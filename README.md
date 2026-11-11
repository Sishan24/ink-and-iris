# Ink & Iris
### A Literary World by Jaya Roy Chowdhury

**Ink & Iris** is the official literary website of **Jaya Roy Chowdhury** — a digital garden of stories, characters, books and ideas, celebrating the art of storytelling and the worlds that live between the pages.

Conceived as more than an author website, Ink & Iris brings literature to life through an immersive reading experience, thoughtfully curated character galleries, a personal *Speak to the Author* inbox, passwordless reader accounts and a dedicated administration portal that the author can manage independently.

A meeting of timeless literature and contemporary design, where every story has a place to bloom.

**The technology behind the experience**

React + Vite + Tailwind · Node + Express · MongoDB Atlas · Resend · Cloudinary

```text
ink-and-iris/
├─ client/   React app (public site, reader account, admin portal)
└─ server/   Express API (auth, content, messages, uploads)
```

---

## Getting Started

### Run it locally

1. Install everything: `npm run install:all`
2. Copy `server/.env.example` to `server/.env` and fill it in (details below).
3. Create the admin account and default content: `npm run seed`

   Use `npm run seed:demo` to also publish placeholder books, characters and quotes so you can explore the complete website experience.

4. Start both applications: `npm run dev`.

   - Website: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:5000](http://localhost:5000)

### Environment Configuration

Create a `server/.env` file with the following variables:

| Variable | Needed for |
| --- | --- |
| `MONGODB_URI` | Atlas connection string (or local MongoDB) |
| `JWT_SECRET` | Long random string signing sessions |
| `ADMIN_EMAIL` | The author's email. Signing in with it gives admin access |
| `RESEND_API_KEY`, `EMAIL_FROM` | Real emails. **Leave the key empty in development**: sign-in codes and notifications print in the server terminal instead |
| `CLOUDINARY_*` | Image uploads (covers, portraits, author photo). Without them, uploads return a clear "not set up" message |

### Author Access

The author has a dedicated administration space to curate and manage her literary world.

1. Open `/signin`.
2. Enter the email configured in `ADMIN_EMAIL`.
3. Enter the six-digit verification code received by email (or printed in the terminal during development).
4. On successful authentication, you will be redirected to `/admin`.

No conventional password is required.

---

## Inside the Literary World

Ink & Iris is designed around the relationship between an author, her stories and the readers who discover them.

### 1. The Public Website

- **Home** — The literary introduction to Ink & Iris, featuring the author's work and selected highlights.
- **The Author** — An editorial-style author profile and biography.
- **Books** — A complete literary collection, with a dedicated page for every book.
- **Characters** — A curated character gallery, with individual profiles and filters by book.
- **Speak to the Author** — A dedicated communication channel for readers.
- **Join / Sign In** — Passwordless reader registration and authentication.
- **Reader Dashboard** — A personalised space for registered readers.
- **Privacy** — Privacy information and policies.
- **Custom 404** — A branded page for unavailable destinations.

### 2. A Passwordless Reading Community

Readers can create accounts and sign in using email-based, one-time verification codes.

Security specifications:

- Six-digit verification codes.
- Codes stored as hashes.
- Ten-minute code expiry.
- Single-use verification codes.
- Maximum five incorrect attempts.
- Rate limiting per email and IP address.
- Sessions maintained through httpOnly cookies.
- Seven-day reader sessions.
- One-day administrator sessions.

### 3. The Author's Administration Portal

**Route: `/admin`**

A dedicated, server-protected workspace that allows the author to manage her website without requiring developer assistance for routine content updates.

Features include:

- **Overview:** Readership growth and administrative insights.
- **Readers:** Search registered readers and suspend accounts.
- **Books:** Create, edit and manage book listings.
- **Characters:** Manage character profiles, portraits and descriptions.
- **Message Inbox:** Organise messages by unread, read, replied and archived status, with email replies.
- **Homepage Editor:** Update homepage content and featured sections.
- **Author Profile:** Edit biography and profile information.
- **Settings:** Manage website configuration.

Administrator permissions are enforced through a server-side `admin` role. Reader accounts attempting to access administrative routes receive a `403` response.

### 4. Bookstore Integration

Amazon purchase links are entered and maintained by the author individually for each book. Optional links to other bookstores are supported.

This ensures that purchase destinations can be updated whenever necessary without modifying the application code.

### 5. Thoughtful Details

The experience includes:

- Sticky navigation and responsive mobile menu.
- Website-wide search.
- Reading-progress bar on individual book pages.
- Hover-reveal character introductions.
- Individual SEO titles for every page.
- Accessible skip navigation link.
- Keyboard focus styling.
- Reduced-motion support.
- Responsive layouts across devices.

---

## Preparing the Content

### Bringing the Literary World to Life

Before the website goes live, the following materials need to be collected and approved by the author.

| Content | Requirements |
| --- | --- |
| Author Profile | Approved biography and photograph |
| Book Collection | Complete book list, cover images and synopses |
| Bookstore Links | Amazon URLs and optional additional store links |
| Character Gallery | Character names, portraits and descriptions |
| Notifications | Email address for website notifications |
| Social Media | Official Instagram profile link |
| Branding | Final confirmation of the website name |

The seed data includes seven titles identified in public listings, initially saved as unpublished drafts without invented synopses.

The default biography uses only information from the author's published author bio. Both the biography and book details should be replaced with the author's approved content before publication.

---

## Development Notes

The project intentionally uses JavaScript rather than TypeScript to keep the codebase lightweight and approachable.

CSS transitions are used instead of Framer Motion to minimise dependencies while retaining a polished interface. Both TypeScript and Framer Motion can be introduced later if required.

### Current Testing Status

- API syntax-checked.
- API smoke-tested for health, authentication guards and validation.
- Client production build completed successfully.
- Live MongoDB integration not yet tested.
- Live Resend email integration not yet tested.
- Live Cloudinary upload integration not yet tested.

**Important:** Before production deployment, perform a complete end-to-end test on your local machine, covering reader registration, sign-in, message submission, book management and image uploads.

---

## Deployment

### 1. Frontend — Vercel

Deploy the React application through Vercel.

| Setting | Configuration |
| --- | --- |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

In `client/vercel.json`, replace `YOUR-RENDER-SERVICE.onrender.com` with the actual Render service URL.

API requests are proxied through `/api`, allowing the authentication cookie to remain first-party.

### 2. Backend — Render

Deploy the Express application through Render.

| Setting | Configuration |
| --- | --- |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Configure every variable listed in `.env.example`, including:

- `NODE_ENV=production`
- `CLIENT_URL` set to the live website address.
- MongoDB Atlas connection details.
- JWT secret.
- Resend API credentials.
- Cloudinary credentials.

Verify the sending domain in Resend and configure `EMAIL_FROM`.

### 3. Production Database Setup

Run `npm run seed` once against the production database.

Alternatively, signing in with the configured `ADMIN_EMAIL` automatically creates the administrator account on first use.

---

## The Philosophy

*Every book holds a universe. Every character carries a life of their own. Every reader brings a new interpretation.*

Ink & Iris is an invitation to step into those universes.

It brings together the enduring elegance of the written word and the possibilities of the digital age — creating a home for stories, their creators and the readers who keep them alive.

**Where stories take root, and imagination blossoms.**

---

*Designed and developed with care for the literary world of Jaya Roy Chowdhury.*