# Media Swarm

A multi-agent orchestration platform for mastering every kind of AI media generation. Each agent is a domain expert that researches, generates, refines, and delivers production-grade media.

## Architecture

```
media-swarm/
├── agents/           # Agent definitions and configs
│   ├── music/        # Suno, ElevenLabs, audio generation
│   ├── image/        # Replicate, DALL-E, Midjourney, Stable Diffusion
│   ├── video/        # Kling, Runway, Pika, Luma
│   ├── document/     # PDF, DOCX, PPTX generation
│   ├── code/         # Web apps, visualization, charts
│   └── research/     # Deep research, fact-checking, synthesis
├── skills/           # Reusable skill modules per modality
├── templates/        # Prompt templates and generation patterns
├── output/           # Generated media outputs
├── research/         # Research notes and mastery guides
└── orchestrate.py    # Swarm orchestration engine (future)
```

## Agent Swarm

| Agent | Modality | Primary Tools | Status |
|-------|----------|---------------|--------|
| 🎵 Music Wizard | Music/Audio | Suno, ElevenLabs, Whisper | Active |
| 🎨 Visual Artist | Images | Replicate, DALL-E, image_search | Active |
| 🎬 Video Director | Video | Kling, Runway, Remotion | Active |
| 📄 Doc Architect | Documents | PDF, DOCX, PPTX, XLSX | Active |
| 🔬 Research Agent | Knowledge | Deep research, web search, OpenAlex | Active |
| 🌐 Web Builder | Web | Express, Vite, React, Tailwind | Active |
| 🎤 Voice Artist | Speech | ElevenLabs, Whisper | Active |

## Philosophy

1. **Research first** — Every agent deeply researches its domain before generating
2. **Master the craft** — Understand theory, tools, and techniques at expert level
3. **Iterate relentlessly** — Generate → evaluate → refine → deliver
4. **Composable** — Agents can chain together (research → script → voice → music → video)
5. **Production grade** — Output must be polished, not rough drafts

## Quick Start

Each agent is dispatched via the Kortix task system:

```python
# Example: Dispatch the Music Wizard
task_create(
    title="Generate a lo-fi study playlist",
    description="Research lo-fi production techniques, then generate 5 tracks using Suno...",
    autostart=True
)
```

## Mastery Guides

The swarm produces comprehensive mastery guides for each domain:

- `research/SUNO_MASTERY_GUIDE.md` — Complete Suno AI reference
- `research/ELEVENLABS_MASTERY_GUIDE.md` — Voice & TTS mastery
- `research/REPLICATE_MASTERY_GUIDE.md` — Image & video generation
- `research/VIDEO_MASTERY_GUIDE.md` — AI video production

## License

MIT
