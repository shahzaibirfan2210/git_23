# Shahzaib — AI Engineer

A responsive React, Vite, and React Three Fiber portfolio with an interactive
3D hero, reduced-motion support, editable project/contact data, and a
Mixamo-compatible character integration point.

## Run locally

Install Node.js 18 or newer, then from this folder run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with
`npm run build`, or inspect it locally with `npm run preview`.

## Personalize

Edit `src/data/portfolio.js` to update the bio, skills, project descriptions,
technology tags, email, GitHub, and LinkedIn links. Project links start empty
intentionally; add real URLs before enabling them.

To replace the abstract 3D hero placeholder with a rigged character, follow
the instructions in `public/models/README.md`, add
`public/models/shahzaib.glb`, and set the `characterModel` value in
`src/data/portfolio.js`. The viewer uses embedded GLB animation clips; it
picks clips by names such as `idle`, `walk`, `greet`, `think`, `type`, and
`look`.

## Deploy to Vercel

Import the repository into Vercel. It detects Vite automatically; use
`npm run build` as the build command and `dist` as the output directory.
`vercel.json` includes a fallback rewrite for future client-side routes.
