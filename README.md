# Through the Golden Glades

The official literary website of **Jaya Roy Chowdhury**: books, character galleries, a "Speak to the Author" inbox, passwordless reader accounts and an admin portal the author runs herself.

React + Vite + Tailwind · Node + Express · MongoDB Atlas · Resend · Cloudinary

```
golden-glades/
├─ client/   React app (public site, reader account, admin portal)
└─ server/   Express API (auth, content, messages, uploads)
```

## Run it locally

1. Install everything: `npm run install:all`
2. Copy `server/.env.example` to `server/.env` and fill it in (below).
3. Create the admin account and default content: `npm run seed`
   (use `npm run seed:demo` to also publish placeholder books, characters and quotes so you can see the finished layout).
4. Start both apps: `npm run dev`. The site is at http://localhost:5173 and the API at http://localhost:5000.

### What you need in `server/.env`

| Variable | Needed for |
| --- | --- |
| `MONGODB_URI` | Atlas connection string (or local MongoDB) |
| `JWT_SECRET` | Long random string signing sessions |
| `ADMIN_EMAIL` | The author's email. Signing in with it gives admin access |
| `RESEND_API_KEY`, `EMAIL_FROM` | Real emails. **Leave the key empty in development**: sign-in codes and notifications print in the server terminal instead |
| `CLOUDINARY_*` | Image uploads (covers, portraits, author photo). Without them, uploads return a clear "not set up" message |

### Signing in as admin
Open `/signin`, enter `ADMIN_EMAIL`, then the 6-digit code (from the terminal in development). You land in `/admin`.

## How it fits the brief

- **Pages:** Home, The Author, Books (+ a page per book), Characters (+ a profile per character, filter by book), Speak to the Author, Join / Sign in, reader dashboard, Privacy, custom 404.
- **Reader login:** email one-time codes. Codes are 6 digits, stored hashed, expire in 10 minutes, work once, allow 5 wrong guesses, and are rate limited per email+IP. Sessions are httpOnly cookies (7 days; 1 day for admin).
- **Admin portal (`/admin`):** overview with readership growth, readers (search, suspend), books, characters, message inbox (unread / read / replied / archived, reply by email), homepage and author-profile editing, settings. Protected by a server-side `admin` role; readers get a 403.
- **Amazon links** are entered by the author per book (plus optional other stores), so they never go stale.
- **Details included:** sticky nav, mobile menu, search, reading-progress bar on book pages, hover-reveal character intros, per-page SEO titles, skip link, keyboard focus styles, reduced-motion support.

## Before launch: content to collect from the author
Approved biography and photo, complete book list with covers and synopses, Amazon URLs, character names/portraits/descriptions, notification email, Instagram link, and confirmation of the site name. The seed adds the seven titles found in public listings **as unpublished drafts** with no invented synopses; the default biography only uses facts from her published author bio. Replace both with her approved text.

## Notes
- JavaScript (not TypeScript) and CSS transitions (no Framer Motion) keep the project small. Both are easy to add later.
- The API was syntax-checked and smoke-tested (health, auth guard, validation), and the client builds cleanly, but it has **not** been run against a live MongoDB or live email/Cloudinary accounts yet. Do a full pass through sign-up, a message, a book and an upload on your own machine first.

## Deployment (the only step left)
- **Client → Vercel:** root directory `client`, build `npm run build`, output `dist`. In `client/vercel.json`, replace `YOUR-RENDER-SERVICE.onrender.com` with your Render URL. Requests to `/api` are proxied there, so the login cookie stays first-party.
- **Server → Render:** root directory `server`, build `npm install`, start `npm start`. Set every variable from `.env.example` with `NODE_ENV=production` and `CLIENT_URL` set to the live site address. Verify your sending domain in Resend and set `EMAIL_FROM`.
- Run `npm run seed` once against the production database (or sign in with `ADMIN_EMAIL`, which creates the admin on first use).
