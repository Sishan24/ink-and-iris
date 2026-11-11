# ✦ Ink & Iris
### A Literary World by Jaya Roy Chowdhury

<p align="center">
  <em>Where stories take root, and imagination blossoms.</em>
</p>

A world woven from words, characters, imagination and the timeless art of storytelling.

**Ink & Iris** is the official literary website of **Jaya Roy Chowdhury**, envisioned as an immersive digital home for her literary collection and the readers who discover it.

More than an author portfolio, Ink & Iris brings together an elegant book collection, illustrated character galleries, individual literary profiles, a personal reader-to-author communication space, passwordless reader accounts and a comprehensive author-controlled administration portal.

Inspired by the warmth of golden afternoons, the richness of literature and the vibrancy of nature, the platform bridges the enduring charm of traditional storytelling with the possibilities of modern web technology.

---

## ✿ The Experience

A literary world deserves an experience of its own.

| Destination | Experience |
|---|---|
| Home | A welcoming literary introduction, featured books and curated highlights |
| The Author | An editorial-style biography and author profile |
| Books | A complete collection with individual book pages |
| Characters | A visual character gallery with book-based filtering |
| Speak to the Author | A dedicated reader communication channel |
| Join / Sign In | Passwordless reader registration and authentication |
| Reader Dashboard | A personalised space for registered readers |
| Privacy | Privacy information and policies |
| Custom 404 | A thoughtfully designed unavailable-page experience |
| Admin Portal | A private workspace for managing the literary website |

### A closer look at the details

- Responsive sticky navigation and mobile menu.
- Website-wide search.
- Reading-progress indicators on individual book pages.
- Interactive, hover-reveal character introductions.
- Individual SEO titles for every page.
- Keyboard navigation and visible focus states.
- Accessible skip-navigation link.
- Reduced-motion support.
- Dedicated administration bundle at `/admin`.

---

## ❀ The Author's Atelier

A complete administration portal designed to give the author independent control over her digital literary presence.

**Route:** `/admin`

The portal includes:

| Module | Capabilities |
|---|---|
| Overview | Readership growth and administrative insights |
| Readers | Search readers and suspend accounts |
| Books | Create, edit and manage book listings |
| Characters | Manage character profiles, portraits and descriptions |
| Message Inbox | Read, organise, archive and reply to reader messages by email |
| Homepage | Edit homepage content and featured sections |
| Author Profile | Manage biography and author information |
| Settings | Configure website settings |

Administrator privileges are enforced through server-side role verification. Reader accounts attempting to access protected administrative routes receive a `403` response.

---

## ✧ A Passwordless Reading Community

Readers can register and sign in without conventional passwords.

Authentication is handled through email-based, one-time verification codes.

**Security implementation**

- Six-digit verification codes.
- Hashed code storage.
- Ten-minute code expiry.
- Single-use verification.
- Maximum five incorrect attempts.
- Rate limiting per email and IP address.
- httpOnly session cookies.
- Seven-day reader sessions.
- One-day administrator sessions.

The author can access the administration portal using the email configured through `ADMIN_EMAIL`.

---

## ❋ Technology & Architecture

Built with a modern JavaScript stack, combining a responsive React frontend with a structured Express API and MongoDB database.

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Node.js |
| API Framework | Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT + httpOnly Cookies |
| Email Delivery | Resend |
| Image Management | Cloudinary |
| Deployment | Vercel + Render |

### Project Structure

```text
ink-and-iris/
│
├── client/
│   ├── React + Vite application
│   ├── Public literary website
│   ├── Reader authentication
│   ├── Reader dashboard
│   └── Admin portal
│
├── server/
│   ├── Express API
│   ├── Database models
│   ├── Authentication
│   ├── Middleware
│   ├── API routes
│   ├── Content management
│   ├── Message handling
│   ├── Image uploads
│   └── Seed scripts
│
└── README.md
```

### Backend Capabilities

- MongoDB-powered content management with six collections.
- Email-based one-time-code authentication.
- Server-side role-based access control.
- Contact-message storage and email notifications.
- Author-managed book and character content.
- Cloudinary-powered image uploads.
- Database seeding for initial administrator and demonstration content.

### Bookstore Integration

Amazon and optional additional bookstore URLs are maintained individually for each book through the administration portal.

This keeps purchase destinations editable without requiring changes to the application code.

---

## ✿ Getting Started

### Prerequisites

- Node.js and npm.
- MongoDB Atlas account or local MongoDB instance.
- Resend account for production email delivery.
- Cloudinary account for production image uploads.

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp server/.env.example server/.env
```

Configure the following variables:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for signing sessions |
| `ADMIN_EMAIL` | Author's administrator email |
| `RESEND_API_KEY` | Resend API credentials |
| `EMAIL_FROM` | Verified email sender |
| `CLOUDINARY_*` | Cloudinary image-upload credentials |

**Development note:** Leave `RESEND_API_KEY` empty during local development. Verification codes and email notifications are printed in the server terminal instead.

Cloudinary credentials are optional during development. Without them, upload operations return a clear configuration message.

### 3. Initialise the Database

Create the administrator account and default content:

```bash
npm run seed
```

To populate the website with demonstration books, characters and quotes:

```bash
npm run seed:demo
```

The demonstration content makes it possible to explore the website layout without waiting for the author's final approved literary material.

### 4. Start the Application

```bash
npm run dev
```

The applications will be available at:

| Application | Local URL |
|---|---|
| Website | http://localhost:5173 |
| API | http://localhost:5000 |
| Admin Portal | http://localhost:5173/admin |

### 5. Administrator Sign-In

1. Open `/signin`.
2. Enter the email configured in `ADMIN_EMAIL`.
3. Retrieve the six-digit code from the server terminal during development.
4. Enter the code to authenticate.
5. Access the administration portal at `/admin`.

---

## ❀ Content & Editorial Readiness

The database seed includes seven book titles identified through public research, initially stored as unpublished drafts without fabricated synopses.

The default author biography uses information from her published Google Play author bio.

Before public launch, the following materials require the author's approval:

- Official author biography and photograph.
- Complete book collection, covers and synopses.
- Verified Amazon and additional bookstore links.
- Character names, portraits and descriptions.
- Notification email address.
- Official Instagram profile.
- Final confirmation of website branding.

Rotating literary quotations are designed to appear once the author adds approved quotes.

The platform keeps editorial control with the author: her books, characters, descriptions and featured content can be managed through the administration portal.

---

## ✧ Development Decisions

A few deliberate choices keep the project lightweight and maintainable:

- **JavaScript over TypeScript:** A straightforward JavaScript codebase across the frontend and backend.
- **CSS transitions over Framer Motion:** Lightweight animations without an additional animation dependency.
- **Author-managed content:** Bookstore links, character information and literary content remain editable through the admin portal.
- **Separate admin bundle:** Administrative functionality is loaded separately from the public-facing experience.

TypeScript and Framer Motion can be introduced later without changing the overall architecture.

---

## ❋ Testing & Deployment Readiness

The project has reached the local-build and preliminary API-testing stage.

| Component | Current status |
|---|---|
| Project structure | Built |
| Public website | Implemented |
| Reader authentication | Implemented |
| Reader dashboard | Implemented |
| Admin portal | Implemented |
| Backend API | Smoke-tested |
| API health and authentication guards | Tested |
| API validation | Smoke-tested |
| Client production build | Successful |
| Live MongoDB integration | Pending verification |
| Live Resend integration | Pending verification |
| Live Cloudinary integration | Pending verification |
| Production deployment | Pending |

**Before deployment:** Perform a complete local end-to-end test covering reader registration, authentication, message submission, book management and image uploads against the actual service configurations.

The API has been smoke-tested without a live database. A successful client build and API smoke test should not be interpreted as a completed production integration test.

---

## ✿ Deployment

The application is designed for deployment using **Vercel for the frontend** and **Render for the backend**.

### Frontend — Vercel

| Configuration | Value |
|---|---|
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Update `client/vercel.json`:

Replace:

```text
YOUR-RENDER-SERVICE.onrender.com
```

with the actual Render service URL.

The `/api` proxy forwards frontend API requests to the backend. This architecture keeps the authentication cookie first-party across the deployed application.

### Backend — Render

| Configuration | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Configure all variables from `.env.example`, including:

```env
NODE_ENV=production
CLIENT_URL=https://your-live-website.com
```

Also configure MongoDB, JWT, Resend and Cloudinary credentials.

Verify the sending domain in Resend and configure `EMAIL_FROM`.

### Production Database Initialisation

Run the following once against the production database:

```bash
npm run seed
```

Alternatively, signing in with the configured `ADMIN_EMAIL` automatically creates the administrator account on first use.

---

## ✧ The Thought Behind Ink & Iris

*Some worlds are built with stone. Others are built with words.*

Ink & Iris is built around the belief that literature deserves more than a catalogue of titles. It deserves a space where stories can be discovered, characters can be remembered, readers can connect and an author's creative universe can continue to grow.

It brings together the warmth of traditional storytelling, the beauty of visual expression and the possibilities of contemporary technology.

A little ink, a little imagination, and a world of possibilities.

**Ink & Iris — Where stories take root, and imagination blossoms.**

---

<p align="center">
  <strong>Conceptualised, designed & developed with care.</strong>
  <br/>
  <em>A digital literary home for Jaya Roy Chowdhury.</em>
</p>