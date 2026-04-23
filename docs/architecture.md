# Architecture Overview

## Stack

```
Next.js 16.2.4 (App Router, Turbopack)
├── React 19
├── TypeScript 5
├── Tailwind CSS v4
├── Framer Motion v11
└── Lucide React
```

## Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Main cinematic landing page |
| `/privacy` | Static | Privacy policy page |
| `/api/chat` | Dynamic | Grok 4 chat API |

## Key Components

### `app/page.tsx`
Main client component with:
- Cyberpunk hero section with DJ image
- Trailer playlist modal (video player)
- Grok 4 chat modal
- Anti-Hero Archive modal with:
  - Rate card
  - Testimonial marquee
  - Booking form
  - Paginated carousel (65+ links)
- Fixed HUD header
- Fixed footer with privacy link

### `app/api/chat/route.ts`
Server-side API route that:
1. Reads message from POST body
2. Calls xAI API with Grok 4 model
3. Returns AI response as JSON

### `app/privacy/page.tsx`
Static privacy policy page with:
- Link back to home
- Full privacy policy sections
- Brand-consistent styling

## Performance

- Videos served from `/public` (Vercel CDN)
- Fonts loaded via next/font/google
- Images optimized by Next.js
- Static pages pre-rendered at build time
- API route dynamically rendered on demand

## Deployment

Deployed on Vercel with:
- Auto-deploy on push to main
- Environment variable: `XAI_API_KEY`
- No custom domains required (vercel.app subdomain)
