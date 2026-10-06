# Tracewell — Natural gas supply chain prototype

An interactive graph that traces natural gas from well pads through processing and pipelines to end use, with a node inspector for carbon intensity, methane and throughput data. Plain HTML, CSS and vanilla JavaScript: no build step, no dependencies.

## What's in here

| Path | What it is |
| --- | --- |
| `index.html` | Standalone page for the prototype (this is what GitHub Pages serves) |
| `design-system.html` | Design system / technical documentation page |
| `tokens.json` | **Design tokens: the single source of truth** for colors, shadows, radii, spacing and font (light + dark) |
| `assets/tokens.css` | Generated from `tokens.json`. Don't edit by hand |
| `assets/twsc.css` | Component styles, scoped to `#twsc-root` so they can't clash with a host site. Uses only `var(--twsc-*)` tokens |
| `scripts/build-tokens.mjs` | Zero-dependency Node script that turns `tokens.json` into `tokens.css` |
| `.github/workflows/build-tokens.yml` | Runs the build automatically when `tokens.json` changes on `main` |
| `assets/twsc.js` | Graph engine + UI. Injects its own markup into an empty `#twsc-root` |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Run it locally

Open `index.html` in a browser. Or serve the folder: `python3 -m http.server` and visit http://localhost:8000.

## Publish it

This prototype is a standalone site on GitHub Pages. Your main website links to it.

1. **Create the repo.** Go to https://github.com/new, name it (e.g. `supply-chain`), set it to **Public**, leave "Add a README" unchecked, and click **Create repository**.
2. **Upload the files.** Click **uploading an existing file**, then drag in everything *inside* this folder. Make hidden files visible first (Mac: `Cmd+Shift+.` in Finder; Windows: View → Show → Hidden items) so `.github` and `.nojekyll` are included. Commit.
3. **Allow the token builder to save.** Go to **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions**, and click **Save**.
4. **Turn on Pages.** Go to **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and click **Save**. After 1–2 minutes the site is live at `https://YOUR-USERNAME.github.io/supply-chain/`.
5. **Link to it from your website.** In Webflow, add a link or button pointing to that URL. In the link settings, tick **Open in new tab** if you want visitors to keep your site open.

## Design tokens

All colors, shadows, corner radii, floating-panel spacing and the font stack live in `tokens.json`. Colors and shadows are grouped by theme; shape and spacing tokens are shared by both themes:

```json
"themes": {
  "light": { "color": { "primary": "#581BD3", ... }, "shadow": { ... } },
  "dark":  { "color": { "primary": "#9E74FF", ... }, "shadow": { ... } }
}
```

| Shared token | Value | Used for |
| --- | --- | --- |
| `radius-sm` / `radius-md` / `radius-lg` | 8 / 12 / 16px | Chips and badges / nodes / cards inside panels, zoom controls, minimap |
| `radius-xl` | 28px | Floating containers: app bar and side panel |
| `radius-pill` | 999px | View tabs, theme switch, panel toggle |
| `float-gap` | 12px | Space between floating containers and the screen edge |
| `panel-width` | 340px | Side panel width when expanded |

The `float` shadow (one value per theme) is the drop shadow on every floating container.

Each entry becomes a CSS variable: `primary` → `--twsc-primary`. Light values are the default; dark values apply when `#twsc-root` has `data-theme="dark"`, which is what the theme toggle sets.

Two settings at the top of `tokens.json` control which theme visitors see first:

| Setting | Default | What it does |
| --- | --- | --- |
| `defaultTheme` | `"light"` | The theme shown before a visitor touches the toggle |
| `followSystem` | `false` | Set to `true` to use the visitor's OS light/dark setting until they pick one |

**To change a token:** edit `tokens.json` (on github.com: open the file → pencil icon → commit). The *Build design tokens* GitHub Action (on `main` only) regenerates `assets/tokens.css` and commits it within about a minute. Check the repo's **Actions** tab to see it run.

**To build locally instead:** `node scripts/build-tokens.mjs` (Node 18+). Add `--check` to only verify that `tokens.css` is current.

**To add a new token:** add it to *both* the `light` and `dark` sections (the build fails with a clear message if one is missing), then use `var(--twsc-your-token)` in `assets/twsc.css`.

The first time the Action runs, GitHub may need permission to push: **Settings → Actions → General → Workflow permissions → Read and write permissions**.

## Updating the prototype later

Edit `tokens.json`, `assets/twsc.css` or `assets/twsc.js` on github.com (open the file, click the pencil icon, commit). GitHub Pages republishes automatically within a minute or two. The link on your website never needs to change.

## Notes

- **Theme toggle:** the sun/moon switch at the right end of the top bar flips between light and dark. Light is the default. The choice is saved in the visitor's browser (`localStorage`, key `twsc-theme`) and applies to both `index.html` and `design-system.html`.
- **Floating layout:** the graph fills the whole screen; the app bar, side panel, zoom controls and minimap float above it. Change `radius-xl`, `float-gap`, `panel-width` or the `float` shadow in `tokens.json` to restyle all of them at once.
- **Side panel collapse:** the round button on the panel's right edge collapses and expands it. Selecting a node expands it again. The choice is saved in `localStorage` (key `twsc-panel`). On narrow screens the panel is a bottom sheet and the button is hidden.
- To preset a theme when embedding (e.g. Webflow), put `data-theme="dark"` on `#twsc-root`. A visitor's saved choice still takes priority.
- `index.html` and `design-system.html` link to each other. The design system page lives at `.../supply-chain/design-system.html`.
