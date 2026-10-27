# Signature International Services: website frontend

React 19 + Vite + React Router. Frontend only; the contact form is ready to connect to a backend.

## Run locally

```bash
npm install
cp .env.example .env   # optional, see "Environment variables"
npm run dev            # http://localhost:5173
```

## Scripts

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the development server                  |
| `npm run build`        | Production build to `dist/`                   |
| `npm run preview`      | Serve the production build locally            |
| `npm run lint`         | ESLint (React, hooks and accessibility rules) |
| `npm run format`       | Format all files with Prettier                |
| `npm run format:check` | Check formatting without changing files       |

## Environment variables

| Variable          | Purpose                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL`    | Backend base URL. Empty = **mock mode** (the form simulates a successful send after 1 second).                      |
| `VITE_SITE_URL`   | Live site address, e.g. `https://www.example.co.uk`. Used for `sitemap.xml`, `robots.txt` and the Open Graph image. |
| `VITE_ENABLE_MAP` | `true` shows the Google Maps embed on the contact page (also set `company.map.embedUrl`).                           |

All are read at build time, so redeploy after changing them.

## Contact form

Sends `POST ${VITE_API_URL}/api/contact` with:

```json
{ "name": "", "email": "", "phone": "", "service": "", "message": "", "consent": true }
```

Expects `{ "success": true }` or `{ "success": false, "message": "..." }`. Requests time out after 10 seconds and the
visitor can retry. A hidden honeypot field is checked in the browser only, so the backend should add its own spam
protection. Links such as `/contact?service=web-development` preselect the service.

## Editing content

All editable text is in `src/data/`:

| File            | Contents                                                                  |
| --------------- | ------------------------------------------------------------------------- |
| `company.js`    | Name, tagline, email, phone, WhatsApp, address, hours, map settings       |
| `services.js`   | The five services: summary, overview, inclusions, process, audience, FAQs |
| `faqs.js`       | FAQs on the Services page                                                 |
| `process.js`    | The four-step process                                                     |
| `highlights.js` | “Why clients choose us” points on the Services page                       |
| `about.js`      | About page: who we are, mission, values, approach, teams                  |
| `legal.js`      | Privacy Policy and Terms of Use text (needs legal review before launch)   |
| `images.js`     | Photo files and alt text                                                  |

Design tokens (colours, type, spacing, shadows) are in `src/styles/theme.css`.
Photos are in `src/assets/images/` (credits in `IMAGE_CREDITS.md`). The logo is `src/assets/logo.webp`. The favicon and touch icon
(`public/favicon.svg`, `public/apple-touch-icon.png`) are still a simple “SIS” placeholder.

## Deploy on Render (Static Site)

1. Create a new **Static Site** on Render and connect the repository.
2. **Root directory:** `frontend`
3. **Build command:** `npm install && npm run build`
4. **Publish directory:** `dist`
5. **Environment:** add `VITE_SITE_URL`, and `VITE_API_URL` once the backend is live.
6. **Redirects/Rewrites:** add a rule with source `/*`, destination `/index.html`, action **Rewrite**, so routes such
   as `/contact` load directly.
