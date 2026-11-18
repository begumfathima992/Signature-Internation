# Signature International Services: website and admin

| Folder      | What it is                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `frontend/` | The public website and the admin area (React 19, Vite, React Router). See `frontend/README.md`.      |
| `server/`   | The API (Node.js, Express, Prisma, PostgreSQL): the services list, admin login and the activity log. |

Two admins can log in at `/admin` to add, edit, hide, delete and reorder the services and sub-services shown on the
website. Every change and every login is recorded in an activity log that cannot be edited or deleted.

## Who can log in

There is no public sign-up. The developer creates the first admin account once, when the site is set up (see
"Deploying"). From then on the client manages access from **Admins** in the admin area, without touching any settings:

- **Invite admin**: enter a name and email to get a one-time link, then send it by WhatsApp or email (buttons
  provided). The person opens it, chooses their own password and is logged in. Links expire after 48 hours.
- **Reset password**: creates the same kind of link for an admin who forgot their password.
- **Deactivate**: stops that person logging in straight away. They can be reactivated later.
- At most `MAX_ADMINS` admins (2 by default) can have access at once; an open invitation also takes a place.

Invitations, resets and deactivations all appear in the activity log.

## Run locally

You need Node.js 22.9 or newer and PostgreSQL (14 or newer).

### 1. Create the databases

```bash
createdb signature_dev    # for running the site
createdb signature_test   # used only by the tests, which wipe it
```

### 2. Set up and start the API

```bash
cd server
npm install
cp .env.example .env      # then fill it in, see "Environment variables" below
npm run db:migrate        # creates the tables
npm run db:seed           # loads the current services and creates the first admin from ADMIN1_* in .env
npm run dev               # http://localhost:4000
```

The seed only adds what is missing, so running it again never overwrites changes made in the admin area or resets a
password.

### 3. Start the website (in a second terminal)

```bash
cd frontend
npm install
npm run dev -- --port 5174   # http://localhost:5174
```

Vite forwards every `/api` request to `http://localhost:4000`, so the site and the API share one address locally and
the login cookie works without extra settings. Log in at <http://localhost:5174/admin/login> with the `ADMIN1_EMAIL`
and `ADMIN1_PASSWORD` from `server/.env`, then invite the second admin from **Admins**.

If the API is not running, the website still works: it shows the built-in services from
`frontend/src/data/services.js`.

### Tests

```bash
cd server
npm test     # applies migrations to signature_test, then runs the auth, admins, audit log and seed tests
```

Set `TEST_DATABASE_URL` to use a different test database. Its name must contain `test`, because the tests delete
its data.

## Environment variables

### API (`server/.env`, or the Render dashboard)

| Variable                                         | Purpose                                                                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                   | PostgreSQL connection string.                                                                                         |
| `JWT_SECRET`                                     | At least 32 random characters; signs the login cookie. Generate with `openssl rand -hex 32`.                          |
| `SITE_ORIGIN`                                    | The website address(es) allowed to call the API, comma separated, e.g. `https://www.example.co.uk`.                   |
| `PORT`                                           | Port to listen on (default 4000; Render sets it).                                                                     |
| `NODE_ENV`                                       | `production` on the live server. This also marks the login cookie `Secure` (HTTPS only).                              |
| `TRUST_PROXY`                                    | `1` on Render, `0` locally, so the visitor's real IP is used for rate limiting and the log.                           |
| `MAX_ADMINS`                                     | How many admins can have access at once (default 2).                                                                  |
| `ADMIN1_NAME`, `ADMIN1_EMAIL`, `ADMIN1_PASSWORD` | The first admin, created once by `npm run db:seed` (password 12+ characters). Optional `ADMIN2_…` works the same way. |

These `ADMIN…` values are only used once, to create the first account. After that, admins are managed from the
**Admins** page and nobody needs to edit this file.

### Website (`frontend/.env`, or the Render dashboard)

| Variable          | Purpose                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `VITE_SERVER_URL` | Address of the API, e.g. `https://api.example.co.uk`. Leave empty locally.                 |
| `VITE_SITE_URL`   | Live site address, used for `sitemap.xml`, `robots.txt` and Open Graph tags.               |
| `VITE_API_URL`    | Contact form backend. Still empty: the form has no backend yet and only simulates sending. |
| `VITE_ENABLE_MAP` | `true` shows the Google Maps embed on the contact page.                                    |

Never commit `.env` files. Only the `.env.example` files, which hold placeholders, are in git.

## Contact details

The email, phone, WhatsApp number, address and opening hours are edited in the admin area under **Contact details**.
They appear on the Contact page, in the footer, in the mobile menu, on the map card and in the privacy policy. The seed
loads the starting values from `server/prisma/contact-data.json`; until an admin saves new ones, or if the API is down,
the website uses the values in `frontend/src/data/company.js`.

## How the services data works

- The API (`GET /api/services`) controls which services exist, their names, icons, order and visibility.
- The detailed page content (overview, what's included, process, FAQs, photos) stays in
  `frontend/src/data/services.js`, matched by slug.
- A service or sub-service added in the admin area has no detailed content yet, so its page shows the title,
  description, items and a "Contact us" button. To give it a full page, add an entry with the same slug to
  `services.js`.
- Changing a slug in the admin area changes the page's web address. Old links stop working, and the page loses its
  detailed content until `services.js` uses the new slug.
- The public list is cached for 60 seconds, so changes can take up to a minute to appear.
- `sitemap.xml` is built from `services.js` when the site is deployed, so services added in the admin area are not
  listed in it until that file is updated and the site redeployed.

## Security notes

- Admin logins use an httpOnly, `SameSite=Strict` cookie that lasts 8 hours; tokens are never stored in the browser's
  storage. In production the cookie is also `Secure`.
- Logging out removes the cookie. Because the token is stateless, a copy of it taken before logout would stay valid
  until it expires (8 hours). Deactivating an admin (`isActive = false`) blocks them immediately.
- Logins are limited to 5 failed attempts per 15 minutes per IP address. Failed attempts return the same message
  whether or not the email exists.
- Deleting a category or item is a soft delete: it disappears from the site and the admin list but stays in the
  database. Its slug stays reserved, so a new entry cannot reuse it.

## Deploying (Render)

`render.yaml` describes both services: the API as a Node web service and the website as a static site. In Render,
choose **New > Blueprint**, select this repository, then fill in every variable marked "sync: false" when asked.

**Database.** Render's free PostgreSQL databases expire after a short trial period, so for a live site use one of:

- [Neon](https://neon.tech) (free tier) or [Supabase](https://supabase.com) (free tier): create a project and paste
  its connection string into `DATABASE_URL`. With Neon, use the "pooled" string for the app.
- Render's paid PostgreSQL.

After the first deploy, run the seed once from the API service's **Shell** tab: `npm run db:seed`. This loads the
services and creates the client's first admin account from `ADMIN1_…`. Give the client that email and password; they
can invite the second admin themselves.

**Domains (important for login).** The login cookie is `SameSite=Strict`, so the browser only sends it when the
website and the API are on the same site. Two separate `*.onrender.com` addresses count as different sites, and
login would not work. Use a custom domain for both, for example `www.example.co.uk` for the website and
`api.example.co.uk` for the API, then set `SITE_ORIGIN` and `VITE_SERVER_URL` to match. This setup has not been
tested on Render yet.
