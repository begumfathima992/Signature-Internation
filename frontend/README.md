# Signature International Services: website frontend

React 19 + Vite + React Router: the public website and the admin area at `/admin`. The services list and admin
login come from the API in `../server`; see the README in the repository root for running both together.

## Run locally

```bash
npm install
cp .env.example .env   # optional, see "Environment variables"
npm run dev -- --port 5174   # http://localhost:5174
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
| `VITE_SERVER_URL` | Address of the API in `../server`. Empty locally, where Vite forwards `/api` to `http://localhost:4000`.            |
| `VITE_API_URL`    | Contact form backend. Empty = **mock mode** (the form simulates a successful send after 1 second).                  |
| `VITE_SITE_URL`   | Live site address, e.g. `https://www.example.co.uk`. Used for `sitemap.xml`, `robots.txt` and the Open Graph image. |
| `VITE_ENABLE_MAP` | `true` shows the Google Maps embed on the contact page (also set `company.map.embedUrl`).                           |

All are read at build time, so redeploy after changing them.

## Contact form

Sends `POST ${VITE_API_URL}/api/contact` with:

```json
{ "name": "", "email": "", "phone": "", "service": "", "message": "", "consent": true, "topic": "" }
```

Expects `{ "success": true }` or `{ "success": false, "message": "..." }`. Requests time out after 10 seconds and the
visitor can retry. A hidden honeypot field is checked in the browser only, so the backend should add its own spam
protection. Links such as `/contact?service=web-development` preselect the service, and
`&topic=website-design` adds that sub-service as a “Topic” line. `topic` (the sub-service name) is only sent when
the visitor arrived from a sub-service page and kept that service selected.

`phone` (the contact number) is required and is sent in international form, such as `+44 20 7946 0123`, built from
the country code picker and the number typed. `service` is one of the service names or `Other Services`.

## Editing content

All editable text is in `src/data/`:

| File            | Contents                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `company.js`    | Name, tagline, email, phone, WhatsApp, address, hours, map settings                                                                                                           |
| `services.js`   | Detailed page content for each service and sub-service, matched by slug. Names, order and visibility come from the admin area; this list is the fallback when the API is down |
| `faqs.js`       | FAQs on the Services page                                                                                                                                                     |
| `process.js`    | The four-step process                                                                                                                                                         |
| `highlights.js` | “Why clients choose us” points on the Services page                                                                                                                           |
| `about.js`      | About page: who we are, mission, values, approach, teams                                                                                                                      |
| `legal.js`      | Privacy Policy and Terms of Use text (needs legal review before launch)                                                                                                       |
| `images.js`     | Photo files and alt text                                                                                                                                                      |

Design tokens (colours, type, spacing, shadows) are in `src/styles/theme.css`.
Photos are in `src/assets/images/` (credits in `IMAGE_CREDITS.md`). The logo is `src/assets/logo.webp`. The favicon and touch icon
(`public/favicon.svg`, `public/apple-touch-icon.png`) are still a simple “SIS” placeholder.

## Deploy

The website and the API are deployed together with `../render.yaml`. See "Deploying" in the root `README.md`.
