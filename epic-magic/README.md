# Epic Magic — Cinematic Trailer

**The trailer *is* the website.**

A completely immersive cyberpunk golden-hour cinematic experience for **Grok-Magic-Chat / Epic Tech AI**.

## Features
- Dynamic canvas-based nebula, particle systems, embers, holographic lines, and city fly-through at golden hour
- Massive animated portal prominently displaying `https://grok-magic-chat.vercel.app`
- The anti-hero (mid-30s street-hustler in black + gold leather jacket, smirking, breaking the fourth wall with dramatic rim lighting)
- Exact headline with neon glitch/flicker effects: "Grok-Magic-Chat: AI-Powered Magic & Creativity Unleashed"
- Full cinematic trailer sequencing with dramatic voiceover-style text ("In the shadowed sprawl...", "One anti-hero stands...", "The hustler meets the infinite...")
- Film grain, vignette, scanlines, parallax haze, motion blur
- Glassmorphic cosmic chat UI that floats in as the portal climax — **fully functional** with real-time streaming responses, anti-hero persona, voice input (microphone), and text-to-speech readout
- "Play Trailer" control with auto-progressing scenes

The entire page feels like a movie trailer. No traditional SaaS UI — pure vibe.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the random port assigned).

**Important**: Add `XAI_API_KEY` (from https://console.x.ai) to your `.env.local` for the streaming chat to work with Grok-4. The page itself works without it.

## Deploy on Vercel (Recommended)

1. Push this repo to GitHub (already done).
2. Go to [vercel.com/new](https://vercel.com/new) → Import `Sm0k367/epic-magic`.
3. Add Environment Variable:
   - `XAI_API_KEY=your_xai_key_here`
4. Deploy.

The project is fully optimized for Vercel (includes `vercel.json`, passes lint + build).

## Tech
- Next.js 16 + React 19 + TypeScript
- Canvas particle engine for all cinematic effects
- xAI Grok-4 via OpenAI compatible client (streaming)
- Tailwind + custom cinematic CSS/keyframes
- Browser SpeechRecognition + SpeechSynthesis for voice

This is a **no-compromise** implementation of the original vision. The anti-hero is waiting in the portal.

Made with neon and intent.
