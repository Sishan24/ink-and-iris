# ✦ Ink & Iris

### The Digital Literary World of Jaya Roy Chowdhury

> An ethereal, thoughtfully crafted digital literary sanctuary celebrating the books, characters, and storytelling of **Ms. Jaya Roy Chowdhury**. Featuring an interactive literary bookshelf, illustrated character galleries, a reading journal, reader correspondence routed directly to the author, and an author administration atelier.

<p align="left">
  <img src="https://img.shields.io/badge/REACT-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TYPESCRIPT-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/VITE-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TAILWIND-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FRAMER_MOTION-11.11-FF0055?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/NODE.JS-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/EXPRESS.JS-4.19-555555?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MONGODB-8.5-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-AUTH-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/RESEND-EMAIL-000000?style=for-the-badge&logo=resend&logoColor=white" alt="Resend" />
  <img src="https://img.shields.io/badge/CLOUDINARY-MEDIA-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/AMAZON-BOOKSTORE-FF9900?style=for-the-badge&logo=amazon&logoColor=black" alt="Amazon" />
</p>

<p align="left">
  <em>Where stories take root, and imagination blossoms.</em>
</p>

---

## 🌷 An Introduction

A universe woven from words, memories, folklore, and the timeless art of traditional storytelling.

**Ink & Iris** is the official digital literary home of author, scholar, and educator **Ms. Jaya Roy Chowdhury**. Envisioned as a tranquil and luminous reading sanctuary, it brings together her published bibliography, illustrated character archetypes, journal writings, readers' letters delivered directly to her desk, and an independent author atelier.

Inspired by the golden light of the Kurseong hills, the mist clinging to the deodars of Dow Hill, and the metaphysical depths of Indian mythology, the platform merges timeless literary atmosphere with modern web engineering.

*Every story has a world of its own. Ink & Iris gives that world a place to bloom.*

---

## ✿ The Literary Experience

| Destination | Experience |
|:---|:---|
| 🏡 **Home** | Welcoming hero, animated typography, and curated glimpses of books and characters |
| 📚 **Bookshelf** | The full literary collection with cover artwork, synopsis previews, and Amazon purchase links |
| 📖 **Book Detail** | An in-depth page for each title with the full synopsis and associated characters |
| 🎭 **Characters** | An illustrated character gallery with individual backstory pages |
| 📓 **Journal** | The author's journal posts, each with its own reading page |
| 💌 **Correspondence** | A confidential reader-to-author letter portal delivered straight to the author |
| 🌿 **Reading Room** | A quiet corner for readers to settle in |
| 🕯️ **Gatherings** | Literary events and gatherings |
| 🖋️ **About** | The story of the author, her years at Dow Hill, and her literary philosophy |
| 🛡️ **The Author's Atelier** | A protected administration suite for managing the whole site |

---

## 📚 The Bibliography

The seed collection brings in Jaya Roy Chowdhury's published works:

```text
✦ Anahita's Wanderlust (Namya Press)
  └─ Philosophical fiction on time, past lives, Hindu mythology, and feminine power.

✦ And Woodlands Green
  └─ Heartwarming pastoral narratives celebrating rustic India and woodland solace.

✦ Maiden's Delight: Dow Hill To Thee
  └─ Nostalgic memoir of boarding school days amidst the pine-veiled heights of Kurseong.

✦ Of Kings and Queens and Saints and Rogues
  └─ Historical folklore and cultural essays traversing India's legendary folk imagination.

✦ Through Golden Glades
  └─ Lyrical nature essays and meditations on forest light and changing seasons.

✦ Cosmic View Of A Cryptic Planet
  └─ Philosophical exploration bridging ancient Vedic cosmology with modern astrophysics.

✦ A Fragile Symphony
  └─ A poignant narrative of music, silence, memory, and enduring companionship.
```

---

## ❀ The Author's Atelier

**Protected by server-side role verification**, the atelier gives the author complete editorial control over her digital presence:

| Module | Capabilities |
|:---|:---|
| 📚 **Books** | Create, edit, publish or unpublish, and delete book records, with cover upload and purchase links |
| 🎭 **Characters** | Create character profiles, upload portraits, and link characters to their books |
| 📓 **Journal** | Write and manage journal posts |
| 💌 **Reader Letters** | Read incoming letters from readers and manage correspondence |
| 💬 **Testimonials** | Curate reader testimonials shown across the site |
| 🕯️ **Events** | Add and update gatherings and literary events |
| 🖼️ **Media** | Upload and organise images through Cloudinary |
| 🏡 **Site Settings** | Edit headline, tagline, biography, and other site-wide content |

---

## 🔐 Security & Authentication

- 🔑 **JWT Authentication:** Sessions are authenticated with signed JSON Web Tokens.
- 🛡️ **Role Enforcement:** Admin routes are protected on the server, so only the author's account can reach the atelier.
- 🧹 **Centralised Error Handling:** A shared error handler keeps API responses consistent and safe.
- 🔒 **Secrets Stay Private:** Credentials live in `server/.env`, which is never committed.

---

## 🛠️ Technology Stack & Architecture

### 💻 Technology Stack

| Layer | Technology |
|:---|:---|
| 🎨 Frontend | React 18 + TypeScript |
| ⚡ Build Tool | Vite |
| 🖌️ Styling | Tailwind CSS |
| ✨ Animation | Framer Motion |
| 🟢 Runtime | Node.js |
| 🚀 API Framework | Express.js |
| 🍃 Database | MongoDB (Mongoose) |
| 🔐 Authentication | JWT |
| ✉️ Email | Resend |
| 🖼️ Media | Cloudinary |

### 📁 Project Structure

```text
ink-and-iris/
│
├── client/                      # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── api/                 # API client
│   │   ├── components/          # Navbar, Footer, LiteraryShell, AdminLayout
│   │   ├── context/             # AuthContext, ToastContext
│   │   ├── pages/               # Home, Bookshelf, BookDetail, Characters,
│   │   │                        # CharacterDetail, Correspondence, Journal,
│   │   │                        # JournalDetail, ReadingRoom, Gatherings, About
│   │   └── index.css            # Global styling
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.ts
│
├── server/                      # Express + TypeScript API
│   ├── src/
│   │   ├── config/              # Database connection
│   │   ├── controllers/         # Auth, Book, Character, Journal, Letter,
│   │   │                        # Testimonial, Event, Media, Settings, Admin
│   │   ├── middleware/          # auth, upload, errorHandler
│   │   ├── models/              # User, Book, Character, JournalPost, ReaderLetter,
│   │   │                        # Testimonial, Event, Media, SiteSettings
│   │   ├── routes/              # One route file per controller
│   │   ├── services/            # emailService, uploadService
│   │   ├── seed/                # Database seed script
│   │   └── index.ts             # Server entry point
│   └── .env.example             # Environment variable template
│
├── package.json                 # Root scripts (install, dev, seed, build)
└── README.md
```

---

## 🚀 Quick Start Guide

### 📋 Prerequisites

- **Node.js** v18 or higher (v20+ recommended) and **npm**
- A **MongoDB Atlas** connection URI, or a running local MongoDB instance

### 1. 📥 Install Dependencies

```bash
npm run install:all
```

### 2. 🔑 Configure Environment

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in the values: your MongoDB URI, a JWT secret, the admin email, and optionally your Resend and Cloudinary keys.

> 💡 **Local development note:** Resend and Cloudinary keys are only needed for live email delivery and cloud image uploads. Never commit `server/.env`.

### 3. 🌱 Seed the Database

```bash
npm run seed
```

### 4. ▶️ Run the Development Servers

Start the Express API and the Vite dev server together:

```bash
npm run dev
```

| Destination | Local Address |
|:---|:---|
| 🌐 Public Website | http://localhost:5173 |
| ⚙️ Express API | http://localhost:5000 |

---

## 📜 Available Scripts

| Command | Description |
|:---|:---|
| `npm run install:all` | Install root, server, and client dependencies |
| `npm run dev` | Run the API and the frontend together |
| `npm run seed` | Populate the database with starter content |
| `npm run build` | Build the server and the client |
| `npm start` | Start the built server |

---

## ☁️ Production Deployment

Designed for deployment with **Vercel** for the frontend and **Render** for the backend.

### 🌐 Frontend: Vercel

- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 🖥️ Backend: Render

- **Root Directory:** `server`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- Add the environment variables from `server/.env` in the Render dashboard.

---

<div align="center">

🌿 ━━━━━━━━━━━━━━━━━━━━━ ✦ ━━━━━━━━━━━━━━━━━━━━━ 🌿

### ✦ INK & IRIS ✦

*Where stories take root, and imagination blossoms.*

📖 &nbsp; 🖋️ &nbsp; 🌸 &nbsp; ✨

**A Digital Literary Sanctuary for Ms. Jaya Roy Chowdhury**
Curated with care, literature, and imagination.

</div>