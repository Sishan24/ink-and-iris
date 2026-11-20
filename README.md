# ✦ Ink & Iris

### The Digital Literary World of Ms. Jaya Roy Chowdhury

> A literary sanctuary for the books, characters and stories of author **Ms. Jaya Roy Chowdhury**: a bookshelf, character gallery, journal, reader correspondence and an author admin panel, built as a full-stack TypeScript app.

*Where stories take root, and imagination blossoms.*

---

## ✿ Features

| Area | What it offers |
|:---|:---|
| 📚 **Bookshelf** | Published works with cover art, synopses and detail pages |
| 🎭 **Characters** | Illustrated character gallery with individual character pages |
| 📓 **Journal** | Author's journal posts with dedicated reading pages |
| 💌 **Correspondence** | Readers send letters directly to the author |
| 🌿 **Reading Room** | A quiet space for readers |
| 🕯️ **Gatherings** | Literary events and gatherings |
| 🖋️ **About** | The author's story |
| 🛡️ **Admin panel** | Author-only layout for managing books, characters, journal posts, letters, testimonials, events, media and site settings |
| 🔑 **Authentication** | JWT-based sign-in with role-based admin access |
| ✉️ **Email** | Transactional email service for letters and sign-in |
| 🖼️ **Media uploads** | Image upload service for covers and portraits |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Email | Resend |
| Media | Cloudinary |

---

## 📁 Project Structure

```text
ink-and-iris/
├── client/                     # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── api/                # API client
│   │   ├── components/         # Navbar, Footer, LiteraryShell, AdminLayout
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # Home, Bookshelf, BookDetail, Characters,
│   │   │                       # CharacterDetail, Correspondence, Journal,
│   │   │                       # JournalDetail, ReadingRoom, Gatherings, About
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.ts
│
├── server/                     # Express + TypeScript API
│   ├── src/
│   │   ├── config/             # Database connection
│   │   ├── controllers/        # Auth, Book, Character, Journal, Letter,
│   │   │                       # Testimonial, Event, Media, Settings, Admin
│   │   ├── middleware/         # auth, upload, errorHandler
│   │   ├── models/             # User, Book, Character, JournalPost, ReaderLetter,
│   │   │                       # Testimonial, Event, Media, SiteSettings
│   │   ├── routes/             # One route file per controller
│   │   ├── services/           # emailService, uploadService
│   │   ├── seed/               # Database seed script
│   │   └── index.ts            # Server entry point
│   └── .env.example            # Environment variable template
│
├── package.json               # Root scripts (install, dev, seed, build)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm**
- A **MongoDB** connection (Atlas URI or a local instance)

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in the values (MongoDB URI, JWT secret, admin email, and optionally Resend and Cloudinary keys). Never commit this file.

### 3. Seed the database

```bash
npm run seed
```

### 4. Run in development

```bash
npm run dev
```

| Service | Address |
|:---|:---|
| 🌐 Website | http://localhost:5173 |
| ⚙️ API | http://localhost:5000 |

---

## 📜 Available Scripts

| Command | Description |
|:---|:---|
| `npm run install:all` | Install root, server and client dependencies |
| `npm run dev` | Run the API and the frontend together |
| `npm run seed` | Populate the database with starter content |
| `npm run build` | Build the server and the client |
| `npm start` | Start the built server |

---

## ☁️ Deployment

- **Frontend:** Vercel. Root directory `client`, build command `npm run build`, output directory `dist`.
- **Backend:** Render. Root directory `server`, build command `npm install && npm run build`, start command `npm start`.

Set the same environment variables from `server/.env` in your hosting dashboard.

---

<div align="center">

### ✦ INK & IRIS ✦

*A digital literary sanctuary for Ms. Jaya Roy Chowdhury.*

</div>