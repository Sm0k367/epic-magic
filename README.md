# 🌌⚡ EPIC TECH AI — The Portal

> **"This isn't a website. This is a transmission from 2077."**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://epic-magic.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Grok 4](https://img.shields.io/badge/Powered%20by-Grok%204-blue?style=for-the-badge)](https://x.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🎬 What Is This?

The most cinematic portfolio/landing page ever built with Next.js. A golden-hour cyberpunk experience featuring:

- 🎬 **Cinematic Trailer** — Full video playlist modal: `epic.mp4` first, `antihero.mp4`, `image.mp4`, + live Websim embed
- 🤖 **Grok 4 Chat** — Talk to the Anti-Hero via xAI's Grok 4 with a cinematic anti-hero persona
- 😏 **Anti-Hero Archive** — Wild portal carousel with 65+ links, 3D hover effects, glitch animations
- 💰 **Rate Card** — $8k–$50k cinematic web experiences
- 📝 **Booking Form** — Direct transmissions to epictechai@gmail.com
- 💬 **Testimonial Marquee** — Infinite scroll client testimonials
- 🔒 **Privacy Policy** — Full legal page at /privacy
- 📱 **Fully Responsive** — Works on all devices
- ⚡ **HIRE THE ANTI-HERO** — Neon-glow pulsing CTA button
- 🌐 **Vercel-Optimized** — Zero-config deployment with env vars

---

## 🚀 Live Site

**[https://epic-magic.vercel.app](https://epic-magic.vercel.app)**

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.2.4 (App Router, Turbopack) |
| Runtime | React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 + custom neon/cyberpunk |
| Animation | Framer Motion v11 |
| Icons | Lucide React |
| AI | Grok 4 via xAI API (`/api/chat`) |
| Fonts | Space Grotesk + IBM Plex Mono |
| Deploy | Vercel (instant on push) |

---

## 🎯 Features

### 🎬 Cinematic Trailer Playlist
- Opens a full-screen modal player
- `epic.mp4` plays first (uploaded to /public)
- `antihero.mp4` second
- `image.mp4` third
- Live Websim embed last
- Playlist tabs + prev/next navigation

### 🤖 Chat with Grok 4
- Powered by `xAI API` model `grok-4`
- Anti-hero persona: DJ Smoke Stream
- Streaming-style typing indicator
- Falls back gracefully if API key missing

### 😏 Anti-Hero Archive (Wild Carousel)
- 65+ links across 10+ categories
- Paginated carousel with smooth animations
- 3D hover effects with Framer Motion
- Gradient glow on hover
- Categories: Core Hubs, Music Vault, AI Agents, WebGL Demos, Portals, Experiments...

### 💰 Rate Card
- Cinematic Landing Page: $8k–$25k
- Full AI Agent Experience: $15k–$50k
- Monthly Retainer: $4k/mo

### 📝 Booking Form
- Name, email, project type, description
- Submits via mailto to epictechai@gmail.com

### 💬 Testimonial Marquee
- 6 testimonials, infinite scroll
- CSS animation, no JS

---

## 📦 Local Development

```bash
# Clone
git clone https://github.com/Sm0k367/epic-magic.git
cd epic-magic

# Install
npm install

# Dev server
npm run dev
# → http://localhost:3000

# Build
npm run build

# Start production
npm start
```

---

## 🌐 Vercel Deployment

1. **Import** the repo at [vercel.com/new](https://vercel.com/new)
2. **Add environment variable**: `XAI_API_KEY` = your xAI API key
3. **Deploy** — that's it!

The `vercel.json` is pre-configured:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

Any push to `main` triggers automatic redeployment.

---

## 📁 Project Structure

```
epic-magic/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # Grok 4 API endpoint
│   ├── privacy/
│   │   └── page.tsx            # Privacy Policy page
│   ├── globals.css             # Tailwind + custom neon effects
│   ├── layout.tsx              # Root layout + Google Fonts
│   └── page.tsx                # Main cinematic page
├── public/
│   ├── epic.mp4                # Primary trailer video
│   ├── antihero.mp4            # Anti-hero video
│   ├── image.mp4               # Uploaded video
│   └── dj-smoke-stream.jpg     # Anti-hero hero image
├── docs/
│   ├── api.md                  # API documentation
│   └── architecture.md        # Architecture overview
├── vercel.json                 # Vercel deployment config
├── LICENSE                     # MIT License
├── CONTRIBUTING.md             # Contribution guide
└── README.md                   # This file
```

---

## 🌐 The Universe

| Platform | Link |
|----------|------|
| 🚀 Site | [epic-magic.vercel.app](https://epic-magic.vercel.app) |
| 🐙 GitHub | [github.com/Sm0k367](https://github.com/Sm0k367) |
| 🐦 X/Twitter | [@Sm0ken420](https://x.com/Sm0ken420) |
| 🎵 Suno | [@dj_smoke_stream](https://suno.com/@dj_smoke_stream) |
| 📧 Email | [epictechai@gmail.com](mailto:epictechai@gmail.com) |
| 🎥 YouTube | [@epictech-ai](https://youtube.com/@epictech-ai) |

---

## 📄 Docs

- [Privacy Policy](https://epic-magic.vercel.app/privacy)
- [API Documentation](docs/api.md)
- [Architecture](docs/architecture.md)
- [Contributing](CONTRIBUTING.md)
- [License](LICENSE)

---

## 🏆 Credits & Shoutouts

**Shoutout to the legends**: [@tsi_org](https://x.com/tsi_org), [Pixio](https://pixio.myapps.ai), [Machine](https://machine-built.vercel.app), [Grok](https://x.ai), [xAI](https://x.ai), and every AI builder pushing the frontier.

---

## 📜 License

MIT — See [LICENSE](LICENSE)

---

**Made with cinematic precision by DJ Smoke Stream / Sm0k367 / Epic Tech AI**  
**© 2077 SM0K3VERSE STUDIOS**

> *"Without you, none of these ships would sail. The anti-hero thanks you 🚀"*
