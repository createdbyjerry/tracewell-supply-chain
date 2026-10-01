// Builds assets/tokens.css from tokens.json. Zero dependencies: `node scripts/build-tokens.mjs`
// Add `--check` to fail (exit 1) if tokens.css is out of date instead of writing it.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
const out = join(root, 'assets', 'tokens.css');
const p = tokens.prefix || 'twsc';
const sel = `#${p}-root`;

const flatten = theme => Object.values(theme).flatMap(group => Object.entries(group));
const decls = (pairs, indent) => pairs.map(([k, v]) => `${indent}--${p}-${k}: ${v};`).join('\n');

const { light, dark } = tokens.themes;
const lightPairs = flatten(light);
const darkPairs = flatten(dark);

// Every light token needs a dark counterpart (and vice versa), or one theme silently breaks.
const missing = [
  ...lightPairs.filter(([k]) => !darkPairs.some(([d]) => d === k)).map(([k]) => `dark is missing "${k}"`),
  ...darkPairs.filter(([k]) => !lightPairs.some(([l]) => l === k)).map(([k]) => `light is missing "${k}"`),
];
if (missing.length) { console.error('tokens.json error:\n  ' + missing.join('\n  ')); process.exit(1); }

// Which theme visitors see first, and whether their OS setting may override it.
const def = tokens.defaultTheme ?? 'light';
if (def !== 'light' && def !== 'dark') { console.error(`tokens.json error: defaultTheme must be "light" or "dark", got "${def}"`); process.exit(1); }
const alt = def === 'light' ? 'dark' : 'light';
const pairs = { light: lightPairs, dark: darkPairs };
const followSystem = tokens.followSystem === true;

const shared = Object.entries(tokens.shared || {}).map(([k, t]) => [k, typeof t === 'object' ? t.value : t]);

const css = `/* GENERATED from tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */
/* Default theme: ${def}. Set data-theme="${alt}" on ${sel} (the theme toggle does this) to switch.${followSystem ? ` Follows the OS setting until a theme is chosen.` : ''} */
${sel} {
  color-scheme: ${def};
${decls([...shared, ...pairs[def]], '  ')}
}
${followSystem ? `@media (prefers-color-scheme: ${alt}) {
  ${sel}:not([data-theme="${def}"]) {
    color-scheme: ${alt};
${decls(pairs[alt], '    ')}
  }
}
` : ''}${sel}[data-theme="${alt}"] {
  color-scheme: ${alt};
${decls(pairs[alt], '  ')}
}
`;

if (process.argv.includes('--check')) {
  const current = existsSync(out) ? readFileSync(out, 'utf8') : '';
  if (current !== css) { console.error('assets/tokens.css is out of date. Run: node scripts/build-tokens.mjs'); process.exit(1); }
  console.log('assets/tokens.css is up to date.');
} else {
  writeFileSync(out, css);
  console.log(`Wrote assets/tokens.css (${lightPairs.length + shared.length} tokens, default ${def}${followSystem ? ', follows system' : ''}).`);
}
