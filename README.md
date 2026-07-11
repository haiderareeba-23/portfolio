# areeba haider · portfolio

Personal portfolio site for Areeba Haider — growth professional.

A single-page, single-file site: interactive resume slot machine, sticky-slide sections, and a Three.js ballpit background. No build step, no dependencies to install.

## Structure

- `index.html` — the entire site (HTML, CSS, and JS in one file)

Fonts load from Google Fonts and Three.js loads from unpkg CDN at runtime.

## Responsive behavior

- **Desktop (>920px):** 4 sections — hero (copy + slot machine side by side), skills, projects, contact
- **Mobile/tablet (≤920px):** 5 sections — the hero splits into an intro screen and a full-screen slot machine, with scroll-snap so one swipe moves one screen

## Mobile performance

On viewports ≤920px the site trades some visual polish for smooth scrolling:

- `backdrop-filter` blur is disabled (section panels use a near-solid background instead)
- Ballpit background is lightened: 40 balls (vs 120), lower-poly spheres, pixel ratio capped at 1.5x
- Scroll-snap uses `proximity`, so sections taller than the viewport still scroll freely

## Run locally

Just open `index.html` in a browser, or serve it:

```
python3 -m http.server 8000
```

## Deploy on GitHub Pages

1. Push this repo to GitHub
2. Repo → Settings → Pages
3. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
4. Site goes live at `https://<username>.github.io/<repo-name>/`

(For `https://<username>.github.io` directly, name the repo `<username>.github.io`.)
