# Media Swarm Orchestration

## Overview

The Media Swarm is a multi-agent system where specialized agents collaborate to produce complex media projects. Each agent is a domain expert that can work independently or as part of a coordinated pipeline.

## Agent Registry

| Agent ID | Name | Modalities | Skills |
|----------|------|------------|--------|
| `music-wizard` | Music Wizard | Suno, ElevenLabs, audio | Music generation, voice, transcription |
| `visual-artist` | Visual Artist | Replicate, image search, logos | Image gen, design, branding |
| `video-director` | Video Director | Remotion, Kling, ffmpeg | Video gen, editing, post-production |
| `doc-architect` | Doc Architect | PDF, DOCX, PPTX, XLSX | Document creation, formatting |
| `research-agent` | Research Agent | Web, academic, data | Deep research, fact-checking |
| `voice-artist` | Voice Artist | ElevenLabs, Whisper | TTS, cloning, transcription |
| `web-builder` | Web Builder | React, Vite, Tailwind | Websites, apps, visualizations |

## Orchestration Patterns

### Pattern 1: Single Agent (Simple)
One agent handles the entire task.
```
User → [Music Wizard] → Output
```
Use when: Single-modality task (e.g., "generate a song")

### Pattern 2: Linear Pipeline (Sequential)
Agents pass output to the next in sequence.
```
User → [Research] → [Music Wizard] → [Voice Artist] → [Video Director] → Output
```
Use when: Each step depends on the previous (e.g., "research → script → voiceover → video")

### Pattern 3: Parallel Swarm (Concurrent)
Multiple agents work simultaneously, results are merged.
```
User → ┌─ [Music Wizard] ──┐
       ├─ [Visual Artist] ──┤→ [Video Director] → Output
       └─ [Research Agent] ─┘
```
Use when: Independent subtasks that combine (e.g., "music + images + script → composed video")

### Pattern 4: Iterative Refinement
Agent outputs are reviewed and refined in cycles.
```
User → [Music Wizard] → Review → [Music Wizard] → Review → Output
```
Use when: Quality requires iteration (e.g., "make it better", "try a different vibe")

### Pattern 5: Fan-out / Fan-in
One task spawns many subtasks, results are aggregated.
```
User → [Orchestrator] → ┌─ Track 1 ─┐
                         ├─ Track 2 ──┤→ [Merge] → Album
                         ├─ Track 3 ──┤
                         └─ Track 4 ─┘
```
Use when: Batch generation (e.g., "create a 10-track album")

## Dispatch Protocol

### Task Creation
```python
task_create(
    title="[Agent Icon] Task Title",
    description="""
    ## Context
    [Background info and requirements]

    ## Your Role
    [Specific agent responsibilities]

    ## Deliverables
    [Expected outputs and formats]

    ## Verification
    [How to confirm the task is complete]
    """,
    autostart=True  # or False for queued tasks
)
```

### Agent Selection Logic
```
IF task involves music/audio → dispatch music-wizard
IF task involves images/visuals → dispatch visual-artist
IF task involves video/motion → dispatch video-director
IF task involves documents → dispatch doc-architect
IF task involves research → dispatch research-agent
IF task involves voice/speech → dispatch voice-artist
IF task involves websites/apps → dispatch web-builder
IF task involves multiple modalities → orchestrate multi-agent pipeline
```

### Multi-Agent Coordination
1. **Orchestrator** (you, the lead agent) decomposes the request
2. **Dispatch** tasks to specialized agents in parallel or sequence
3. **Monitor** task progress via task_list / task_get
4. **Integrate** results as they arrive
5. **Refine** if quality doesn't meet standards
6. **Deliver** final output to user

## Common Workflows

### Full Music Video Production
```
1. [Research] → Research genre, style, references
2. [Music Wizard] → Generate song (Suno)
3. [Voice Artist] → Transcribe lyrics (Whisper)
4. [Visual Artist] → Generate scene images (Replicate)
5. [Video Director] → Compose video with Remotion
6. [Video Director] → Add music + captions (ffmpeg)
7. → Deliver final MP4
```

### Album Creation
```
1. [Research] → Research genre and album concepts
2. [Music Wizard] → Generate 10 tracks with consistent Persona
3. [Visual Artist] → Generate album art
4. [Doc Architect] → Create album booklet (PDF)
5. → Deliver complete album package
```

### Brand Identity Package
```
1. [Research] → Research brand, competitors, market
2. [Visual Artist] → Design logo system
3. [Web Builder] → Build brand website
4. [Doc Architect] → Create brand guidelines (PDF)
5. [Music Wizard] → Generate brand audio identity (jingle)
6. → Deliver brand kit
```

### Research Report + Presentation
```
1. [Research] → Deep multi-source research
2. [Research] → Write report with citations
3. [Doc Architect] → Format as polished PDF
4. [Doc Architect] → Create presentation deck (PPTX)
5. [Visual Artist] → Generate charts and infographics
6. → Deliver report + deck + visuals
```

## Quality Gates

Every agent output must pass these checks before delivery:

1. **Completeness**: All requested deliverables present?
2. **Accuracy**: Factual claims verified? Data correct?
3. **Quality**: Production-grade? Not rough draft?
4. **Format**: Correct file format? Proper resolution/quality?
5. **Consistency**: Style/tone consistent across deliverables?
