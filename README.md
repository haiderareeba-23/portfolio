# areeba haider · portfolio (React)

Personal portfolio site for Areeba Haider — growth professional. Built with React 18 + Vite.

Interactive resume slot machine, sticky-slide sections, and a Three.js ballpit background.

## Structure

```
index.html                     entry (fonts + root div)
vite.config.js                 Vite config (base './' for GitHub Pages)
src/
  main.jsx                     React entry
  index.css                    all styles (global)
  App.jsx                      page layout
  resumeSections.js            resume content + lever order
  components/
    Ballpit.jsx                Three.js background canvas
    DotNav.jsx                 right-side dot navigation
    Hero.jsx                   intro copy + scroll cue
    SlotMachine.jsx            the resume slot machine
    Skills.jsx                 skill blobs
    Projects.jsx               project cards (edit PROJECTS array)
    Contact.jsx                contact cards + footer
```

## Responsive behavior

- **Desktop (>920px):** 4 sections — hero (copy + slot machine side by side), skills, projects, contact
- **Mobile/tablet (≤920px):** 5 sections — the hero splits into an intro screen and a full-screen slot machine, with scroll-snap so one swipe moves one screen

## Mobile performance

- `backdrop-filter` blur disabled ≤920px (near-solid panels instead)
- Lighter ballpit: 40 balls (vs 120), lower-poly spheres, pixel ratio capped at 1.5x
- Scroll-snap uses `proximity`, so sections taller than the viewport still scroll freely

## Develop

```
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the build
```

## Deploy on GitHub Pages

Option A — gh-pages package:

```
npm run build
npm run deploy
```

Then in the repo: Settings → Pages → deploy from the `gh-pages` branch.

Option B — GitHub Actions: use the standard "Deploy static content to Pages" workflow with build output folder `dist`.

Site goes live at `https://<username>.github.io/<repo-name>/`.

## Editing content

- Projects: `src/components/Projects.jsx` (PROJECTS array)
- Resume sections in the machine: `src/resumeSections.js`
- Skills: `src/components/Skills.jsx` (BLOBS array)
- Colors: CSS variables at the top of `src/index.css`
