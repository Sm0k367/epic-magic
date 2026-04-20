# "FLOORBURNER" - Matching Visuals & Video Package

**Visual identity for the 8-minute club destroyer track.** All assets are engineered to perfectly match the sonic energy, color palette (fiery reds/oranges, electric cyan/blue accents, deep blacks), live DJ/club atmosphere, and "dancefloor on fire" theme from the Suno prompt.

## 1. Cover Art / Thumbnail (Static Image)
**Recommended Tool**: `asi-generate-image` or Replicate Flux-Dev/Schnell

**Prompt (copy-paste ready):**
```
Cinematic photorealistic shot of a massive underground superclub at absolute peak energy, thousands of dancers with hands raised losing their minds on a literal burning dancefloor with flames and embers rising, futuristic DJ on a towering stage commanding the crowd with pyrotechnics exploding, intense laser grid and volumetric god rays cutting through thick fog, giant flaming "FLOORBURNER" logo in aggressive cyberpunk typography hovering above the stage, color palette of fiery orange-reds, electric cyan accents, deep shadow blacks, motion blur on the crowd, sweat and ecstasy on faces, shot on ARRI Alexa 65 with anamorphic lenses, hyper-detailed, National Geographic meets Blade Runner 2049 meets Tomorrowland mainstage, epic scale, dramatic rim lighting, 8k --ar 16:9 --stylize 150 --v 6
```

**Generation Command:**
```bash
asi-generate-image '{"prompt": "Cinematic photorealistic shot of a massive underground superclub at absolute peak energy...", "filename": "floorburner-cover", "aspect_ratio": "16:9", "model": "nano_banana_pro"}'
```

**Variations to generate**:
- Horizontal (16:9) for video thumbnail
- Square (1:1) for streaming platforms
- Vertical (9:16) for TikTok/Shorts

## 2. Animated Visualizer / Music Video Clips
**Recommended Tool**: `asi-generate-video` (Sora 2 / Veo 3.1) or Kling/Runway via agents

**Core Video Prompt (for 8-12s looping segments that can be chained):**
```
Dynamic futuristic techno club mainstage during the peak drop of "FLOORBURNER", massive crowd of thousands jumping in unison with hands up as the floor literally catches fire with stylized flames pulsing to the beat, DJ silhouette commanding the stage with explosive pyrotechnics and sweeping laser shows, camera orbiting dynamically with intense motion, beat-synced visual effects — bass hits cause screen-shaking impacts and fire bursts, supersaw leads trigger cyan energy waves and particle explosions, acid basslines create twisting neon 303 lines across the frame, white noise risers build with rising embers and smoke, perfect sync to 130 BPM four-on-the-floor techno-house drop, cyberpunk color grading with fiery oranges, electric cyan, deep blacks, cinematic camera moves, shot on IMAX, hyper-realistic yet stylized like a hybrid of Blade Runner 2049 club scene and Tomorrowland fireworks, maximum energy, dancefloor destruction aesthetic, 16:9
```

**Generation Commands (run separately):**
```bash
# First drop visual (high energy)
asi-generate-video '{"prompt": "Dynamic futuristic techno club mainstage during the peak drop...", "filename": "floorburner-drop1", "duration": 8, "aspect_ratio": "16:9", "model": "sora_2"}'

# Breakdown / atmospheric version
asi-generate-video '{"prompt": "Eerie atmospheric breakdown in a smoky techno club, floating embers and haunting cyan particle systems pulsing slowly to the groove, subtle crowd movement, dramatic rim lighting on DJ, ethereal mood transitioning to rising tension, beat synced visual effects, cinematic, 16:9", "filename": "floorburner-breakdown", "duration": 8, "aspect_ratio": "16:9", "model": "veo_3_1"}'
```

**Full Music Video Concept (for longer-form tools or editing pipeline):**
- **Act 1 (0:00-1:30)**: DJ arriving, crowd gathering, tension build with filtered visuals
- **Act 2 (1:30-3:15)**: First massive drop — floor ignites, crowd erupts, lasers everywhere
- **Act 3 (3:15-4:45)**: Hypnotic breakdown — slow motion flames, ethereal particles, intimate crowd faces
- **Act 4 (4:45-6:15)**: Second apocalyptic drop — maximum chaos, fire tornadoes, crowd surfing, screen-filling energy
- **Act 5 (6:15-8:00)**: Climax + resolution — unified crowd chant, flames die down but energy remains, final DJ-crowd connection

**Style Direction**: Consistent cyberpunk/techno aesthetic. High contrast lighting. Beat-reactive VFX (use Remotion or post-production to sync if AI video doesn't perfectly match). Color grade: Teal-orange with heavy contrast, film grain, subtle VHS/techno glitch on transitions.

## 3. Additional Assets
- **Social Assets**: Generate square and story versions of the cover with overlaid track title + "8:00 Club Destroyer" text
- **Live Visuals Pack**: Looping background videos for club screens (fire particles, geometric tunnel, waveform reactive to bass)
- ** merch / Logo Variant**: Flaming stylized "FLOORBURNER" wordmark (use logo-creator skill)

## 4. Visual Artist Workflow (from visual-artist.md + media skill)
1. Generate 4-6 variations of the cover using different models
2. Use `image_search` or Moondream2 for reference mood boarding ("techno club mainstage lasers fire crowd")
3. Select strongest composition using rule of thirds, leading lines (lasers pointing to DJ), high contrast
4. Chain to video generation for motion versions
5. Post-process with ffmpeg if needed for looping/seamless playback

**Next Actions Available**:
- Run the generation commands above (I can execute them now)
- Create a full Remotion visualizer that reacts to the audio
- Generate the logo/wordmark
- Build a web visualizer page (using web-builder agent)

This package ensures **sonic and visual unity** — the video will feel like it was shot at the same mythical club set where "FLOORBURNER" was dropped for the first time.

Ready to generate the actual images/videos now?
