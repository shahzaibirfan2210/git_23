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
technology tags, email, WhatsApp number, GitHub, and LinkedIn links. The
WhatsApp number should use the international country code without a leading `+`.
Project links start empty intentionally; add real URLs before enabling them.

## Contact form email delivery

The form sends messages through a Vercel Function and Resend; the visitor's
email address is set as `Reply-To`. It does not expose your inbox or Resend
API key in browser code.

1. Create a Resend API key and verify a sender domain in Resend.
2. In Vercel, open **Project Settings → Environment Variables** and add:
   - `RESEND_API_KEY` — your Resend API key.
   - `CONTACT_TO_EMAIL` — the inbox that should receive messages.
   - `CONTACT_FROM_EMAIL` — a sender address on your verified domain, such as
     `Shahzaib Portfolio <contact@your-domain.com>`.
3. Redeploy the Vercel project so the function receives the variables.

``.env.example` shows the required variable names. Never commit real API keys.
To test the function locally, install Vercel CLI (`npm install --global vercel`),
link the project with `vercel link`, pull its environment variables with
`vercel env pull .env.local`, then run `vercel dev`. Run the handler tests with
`npm test`.

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
