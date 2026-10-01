# Tracewell — Natural gas supply chain prototype

An interactive graph that traces natural gas from well pads through processing and pipelines to end use, with a node inspector for carbon intensity, methane and throughput data. Plain HTML, CSS and vanilla JavaScript: no build step, no dependencies.

## What's in here

| Path | What it is |
| --- | --- |
| `index.html` | Standalone page for the prototype (this is what GitHub Pages serves) |
| `design-system.html` | Design system / technical documentation page |
| `tokens.json` | **Design tokens: the single source of truth** for colors, shadows and font (light + dark) |
| `assets/tokens.css` | Generated from `tokens.json`. Don't edit by hand |
| `assets/twsc.css` | Component styles, scoped to `#twsc-root` so they can't clash with a host site. Uses only `var(--twsc-*)` tokens |
| `scripts/build-tokens.mjs` | Zero-dependency Node script that turns `tokens.json` into `tokens.css` |
| `.github/workflows/build-tokens.yml` | Runs the build automatically when `tokens.json` changes on `main` |
| `assets/twsc.js` | Graph engine + UI. Injects its own markup into an empty `#twsc-root` |
| `webflow/embed-snippet.html` | Paste-ready Webflow Code Embed (loads CSS/JS from this repo via jsDelivr) |
| `webflow/iframe-snippet.html` | Alternative Webflow embed that iframes the GitHub Pages site |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Run it locally

Open `index.html` in a browser. Or serve the folder: `python3 -m http.server` and visit http://localhost:8000.

## 1. Put it on GitHub

**Option 1: in the browser (no Git needed)**
1. Go to https://github.com/new, name the repo (e.g. `tracewell-supply-chain`), choose Public, click **Create repository**.
2. On the empty repo page click **uploading an existing file**.
3. Drag in the *contents* of this folder (`index.html`, `design-system.html`, `tokens.json`, `README.md`, `.nojekyll`, `.gitignore`, and the `assets`, `scripts`, `webflow` and `.github` folders). Hidden files: on macOS press `Cmd+Shift+.` in Finder to show them.
4. Click **Commit changes**.

**Option 2: command line**
```bash
cd tracewell-supply-chain
git init
git add .
git commit -m "Initial import from Webflow"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tracewell-supply-chain.git
git push -u origin main
```

## 2. Turn on GitHub Pages (a live preview URL)

Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → **Save**.
After a minute the prototype is live at `https://YOUR-USERNAME.github.io/tracewell-supply-chain/`.

## 3. Cut a release (so Webflow points at a fixed version)

Repo → **Releases → Draft a new release** → tag `v1.0.0` → **Publish release**.
(CLI: `git tag v1.0.0 && git push origin v1.0.0`.)

jsDelivr can now serve the files at:
```
https://cdn.jsdelivr.net/gh/YOUR-USERNAME/tracewell-supply-chain@v1.0.0/assets/twsc.css
https://cdn.jsdelivr.net/gh/YOUR-USERNAME/tracewell-supply-chain@v1.0.0/assets/twsc.js
```
Open both in a browser once to confirm they load.

## 4. Publish in Webflow

Custom code embeds require a paid Webflow site plan, and they don't run inside the Designer canvas, so check them in **Preview** or on the published site.

**Option A: native embed (recommended).** The widget lives directly in the Webflow page, so it uses Webflow's fonts and scrolls with the page.
1. Open `webflow/embed-snippet.html`, replace `YOUR-USERNAME`, `YOUR-REPO` and the version tag.
2. In the Webflow Designer: **Add (+) → Code Embed**, drop it where the prototype should go.
3. Paste the snippet, **Save & Close**.
4. Give the embed's parent a width (e.g. 100%). Set the height with `--twsc-height` on the `div` (e.g. `720px`, or `80vh`).
5. **Publish** the site.

**Option B: iframe.** Fully sandboxed from Webflow's CSS; simplest if anything looks off with Option A.
Paste `webflow/iframe-snippet.html` (with your username/repo filled in) into a Code Embed instead.

## Design tokens

All colors, shadows and the font stack live in `tokens.json`, grouped by theme:

```json
"themes": {
  "light": { "color": { "primary": "#581BD3", ... }, "shadow": { ... } },
  "dark":  { "color": { "primary": "#9E74FF", ... }, "shadow": { ... } }
}
```

Each entry becomes a CSS variable: `primary` → `--twsc-primary`. Light values are the default; dark values apply when the visitor's system is in dark mode, or when `#twsc-root` has `data-theme="dark"`.

**To change a token:** edit `tokens.json` (on github.com: open the file → pencil icon → commit). The *Build design tokens* GitHub Action regenerates `assets/tokens.css` and commits it within about a minute. Check the repo's **Actions** tab to see it run.

**To build locally instead:** `node scripts/build-tokens.mjs` (Node 18+). Add `--check` to only verify that `tokens.css` is current.

**To add a new token:** add it to *both* the `light` and `dark` sections (the build fails with a clear message if one is missing), then use `var(--twsc-your-token)` in `assets/twsc.css`.

The first time the Action runs, GitHub may need permission to push: **Settings → Actions → General → Workflow permissions → Read and write permissions**.

## Updating the prototype later

1. Edit `tokens.json`, `assets/twsc.css` or `assets/twsc.js` and commit to `main`. GitHub Pages updates automatically.
2. Publish a new release tag, e.g. `v1.0.1`.
3. In Webflow, change `@v1.0.0` → `@v1.0.1` in the embed and republish.

Pinning to a tag is deliberate: Webflow only changes when you say so, and you can roll back by switching the tag. You *can* use `@main` instead to auto-update, but jsDelivr caches branch URLs for up to 12 hours (force a refresh by visiting `https://purge.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@main/assets/twsc.js`).

## Notes

- Only one instance per page: the script looks for a single `#twsc-root`.
- Dark mode follows the visitor's system setting. Force a theme with `data-theme="light"` or `data-theme="dark"` on `#twsc-root`.
- The page and `design-system.html` link to each other; in Webflow you can link to the GitHub Pages copy of the design system or rebuild it as a Webflow page.
