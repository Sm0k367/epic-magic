#!/usr/bin/env node
/**
 * PixelTale 1000X Video Generator v2
 * SVG → PNG (ImageMagick) → MP4 (FFmpeg)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FRAMES_DIR = path.join(__dirname, 'frames');
const PNG_DIR = path.join(__dirname, 'pngs');
const OUTPUT = path.join(__dirname, 'out', 'pixeltale-reveal.mp4');
const W = 1920, H = 1080;
const FPS = 30;
const TOTAL_FRAMES = 420; // 14 seconds

// ── COLORS ──
const BG = '#050816';
const CYAN = '#06b6d4';
const PURPLE = '#a855f7';
const PINK = '#ec4899';
const EMERALD = '#10b981';
const WHITE = '#f8fafc';
const GRAY = '#94a3b8';
const DIM = '#334155';

// ── EASING ──
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function clamp(v, lo=0, hi=1) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function progress(frame, start, duration) { return clamp((frame - start) / duration); }

// ── SVG HELPERS ──
function svgOpen(frame) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="gCP" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${CYAN}"/>
      <stop offset="50%" stop-color="${PURPLE}"/>
      <stop offset="100%" stop-color="${PINK}"/>
    </linearGradient>
    <radialGradient id="orb1" cx="25%" cy="35%" r="35%">
      <stop offset="0%" stop-color="${CYAN}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="75%" cy="65%" r="30%">
      <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${PURPLE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb3" cx="50%" cy="80%" r="25%">
      <stop offset="0%" stop-color="${PINK}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="${PINK}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#orb1)"/>
  <rect width="${W}" height="${H}" fill="url(#orb2)"/>
  <rect width="${W}" height="${H}" fill="url(#orb3)"/>\n`;
}

function svgClose() { return '</svg>'; }

function particles(f) {
  let d = '';
  for (let i = 0; i < 35; i++) {
    const x = (i * 137.5) % W;
    const y = (i * 97.3 + 50) % H;
    const dx = Math.sin(f * 0.02 + i) * 25;
    const dy = Math.cos(f * 0.015 + i * 2) * 18;
    const op = clamp((Math.sin(f * 0.025 + i * 0.7) + 1) / 2 * 0.5, 0.05, 0.5);
    const c = [CYAN, PURPLE, PINK][i % 3];
    const s = 1.5 + (i % 3);
    d += `<circle cx="${x+dx}" cy="${y+dy}" r="${s}" fill="${c}" opacity="${op}"/>`;
  }
  return d;
}

function txt(text, x, y, size, color, weight=400, extra='') {
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${text}</text>`;
}

// ── SCENES ──
const MODES = [
  { emoji: '📖', name: 'Story Mode', desc: 'Photo → Immersive narrative', color: CYAN },
  { emoji: '📚', name: 'Life Book', desc: 'Photo → Personal memoir', color: PURPLE },
  { emoji: '🎨', name: 'Comics', desc: 'Photos → Graphic novel', color: '#f59e0b' },
  { emoji: '👨‍👩‍👧‍👦', name: 'Family Lore', desc: 'Photo → Family saga', color: PINK },
  { emoji: '🌙', name: 'Bedtime', desc: 'Photo → Gentle tale', color: '#818cf8' },
  { emoji: '🎵', name: 'Songwriter', desc: 'Photo → Original song', color: EMERALD },
  { emoji: '🎲', name: 'RPG World', desc: 'Photo → Fantasy realm', color: '#fb923c' },
  { emoji: '🌐', name: 'Memory Tapestry', desc: 'Photo → Woven memories', color: '#38bdf8' },
  { emoji: '⏰', name: 'Time Capsule', desc: 'Photo → Message to future', color: '#c084fc' },
  { emoji: '💚', name: 'Healing Journal', desc: 'Photo → Therapeutic reflection', color: '#f43f5e' },
];

function introScene(f) {
  let body = '';

  // Flash
  body += `<rect width="${W}" height="${H}" fill="${WHITE}" opacity="${clamp(1 - f / 5)}"/>`;

  // Sparkle
  const sOp = easeOut(progress(f, 15, 15));
  body += `<text x="${W/2}" y="${H/2-160}" text-anchor="middle" dominant-baseline="central" font-size="70" opacity="${sOp}">✨</text>`;

  // Title
  const tOp = easeOut(progress(f, 10, 20));
  const tSc = lerp(0.5, 1, easeOut(progress(f, 8, 25)));
  body += `<g opacity="${tOp}" transform="translate(${W/2} ${H/2-60}) scale(${tSc})">
    <text x="0" y="0" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="110" font-weight="800" fill="url(#gCP)">PixelTale</text>
    <text x="0" y="70" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="48" font-weight="700" fill="${WHITE}" letter-spacing="10">1000X</text>
  </g>`;

  // Line
  const lW = easeOut(progress(f, 50, 30)) * 350;
  body += `<line x1="${W/2-lW/2}" y1="${H/2+50}" x2="${W/2+lW/2}" y2="${H/2+50}" stroke="${CYAN}" stroke-width="1.5" opacity="${clamp(progress(f,50,5))*0.6}"/>`;

  // Taglines
  body += txt('Transform your photos into infinite stories', W/2, H/2+100, 30, GRAY, 400);
  body += txt('10 creative modes  ·  One upload  ·  Endless possibilities', W/2, H/2+145, 17, DIM, 300);

  return svgOpen(f) + particles(f) + body + svgClose();
}

function modeScene(f) {
  const sf = f - 90;
  const fpm = 18;
  const mi = Math.min(Math.floor(sf / fpm), MODES.length - 1);
  const mode = MODES[mi];
  const lf = sf - mi * fpm;

  let body = '';
  body += txt('10 CREATIVE MODES', W/2, H/2-220, 14, CYAN, 600, 'letter-spacing="8"');
  body += txt('Every photo is a gateway to a different story', W/2, H/2-190, 18, '#475569', 300);

  // Glow
  body += `<circle cx="${W/2}" cy="${H/2}" r="200" fill="${mode.color}" opacity="${clamp(Math.sin(lf*0.1)*0.5+0.5)*0.08}"/>`;

  // Emoji
  body += `<text x="${W/2}" y="${H/2-80}" text-anchor="middle" dominant-baseline="central" font-size="80" opacity="${easeOut(clamp(lf/8))}">${mode.emoji}</text>`;

  // Name
  body += txt(mode.name, W/2, H/2+20, 52, mode.color, 700);

  // Desc
  body += txt(mode.desc.toUpperCase(), W/2, H/2+75, 18, GRAY, 300, 'letter-spacing="4"');

  // Line
  const lw = easeOut(clamp((lf-6)/12)) * 160;
  body += `<line x1="${W/2-lw/2}" y1="${H/2+110}" x2="${W/2+lw/2}" y2="${H/2+110}" stroke="${mode.color}" stroke-width="2" opacity="0.5" stroke-linecap="round"/>`;

  // Counter
  body += txt(`${mi+1} / 10`, W/2, H/2+160, 16, DIM, 400, 'letter-spacing="3"');

  // Dot indicators
  let dots = '';
  for (let i = 0; i < MODES.length; i++) {
    const a = i === mi;
    dots += `<circle cx="${W/2+(i-4.5)*22}" cy="${H/2+200}" r="${a?6:4}" fill="${a?mode.color:'#475569'}" opacity="${a?0.8:i<mi?0.2:0.1}"/>`;
  }
  body += dots;

  return svgOpen(f) + particles(f) + body + svgClose();
}

const TECH = ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Groq AI', 'Zustand'];
const TECH_COLORS = [CYAN, PURPLE, PINK, EMERALD, '#f59e0b', '#38bdf8'];

function techScene(f) {
  const sf = f - 270;
  let body = '';
  body += txt('BUILT WITH', W/2, H/2-140, 14, EMERALD, 600, 'letter-spacing="8"');

  [TECH.slice(0,3), TECH.slice(3,6)].forEach((row, ri) => {
    row.forEach((tech, ti) => {
      const i = ri * 3 + ti;
      const t = easeOut(clamp((sf - 8 - i*8) / 15));
      const x = W/2 + (ti-1)*220;
      const y = H/2-40+ri*80;
      const c = TECH_COLORS[i];
      body += `<rect x="${x-80}" y="${y-22}" width="160" height="44" rx="12" fill="${c}" fill-opacity="${t*0.08}" stroke="${c}" stroke-opacity="${t*0.3}"/>`;
      body += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="18" font-weight="600" fill="${c}" opacity="${t}">${tech}</text>`;
    });
  });

  body += txt('100% TypeScript  ·  Zero config  ·  Production ready', W/2, H/2+140, 16, DIM, 300);
  return svgOpen(f) + particles(f) + body + svgClose();
}

function outroScene(f) {
  const sf = f - 345;
  let body = '';

  const sc = 1 + Math.sin(sf*0.05)*0.1;
  body += `<text x="${W/2}" y="${H/2-180}" text-anchor="middle" dominant-baseline="central" font-size="64" opacity="${easeOut(clamp(sf/10))}">✨</text>`;
  body += `<text x="${W/2}" y="${H/2-90}" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="85" font-weight="800" fill="url(#gCP)" opacity="${easeOut(clamp((sf-5)/15))}">PixelTale 1000X</text>`;
  body += txt('Every photo is a gateway to infinite stories', W/2, H/2-20, 24, GRAY, 300);

  const uo = easeOut(clamp((sf-35)/15));

  // Live demo card
  body += `<rect x="${W/2-280}" y="${H/2+30}" width="260" height="90" rx="16" fill="${CYAN}" fill-opacity="${uo*0.06}" stroke="${CYAN}" stroke-opacity="${uo*0.2}"/>`;
  body += `<text x="${W/2-150}" y="${H/2+55}" text-anchor="middle" dominant-baseline="central" font-size="32" opacity="${uo}">🌐</text>`;
  body += `<text x="${W/2-150}" y="${H/2+90}" text-anchor="middle" dominant-baseline="central" font-family="monospace,sans-serif" font-size="13" font-weight="600" fill="${CYAN}" opacity="${uo}">pixal-talev1.vercel.app</text>`;

  // GitHub card
  body += `<rect x="${W/2+20}" y="${H/2+30}" width="260" height="90" rx="16" fill="${PURPLE}" fill-opacity="${uo*0.06}" stroke="${PURPLE}" stroke-opacity="${uo*0.2}"/>`;
  body += `<text x="${W/2+150}" y="${H/2+55}" text-anchor="middle" dominant-baseline="central" font-size="32" opacity="${uo}">🐙</text>`;
  body += `<text x="${W/2+150}" y="${H/2+90}" text-anchor="middle" dominant-baseline="central" font-family="monospace,sans-serif" font-size="13" font-weight="600" fill="${PURPLE}" opacity="${uo}">github.com/Sm0k367/pixal-talev1</text>`;

  // Bottom line
  const lw = easeOut(clamp((sf-55)/20)) * 300;
  body += `<line x1="${W/2-lw/2}" y1="${H/2+150}" x2="${W/2+lw/2}" y2="${H/2+150}" stroke="url(#gCP)" stroke-width="1.5" opacity="0.4"/>`;

  body += txt('TRANSFORM YOUR CREATIVITY  ·  PRESERVE YOUR MEMORIES  ·  SHARE YOUR VISION', W/2, H/2+190, 12, DIM, 400, 'letter-spacing="5"');

  return svgOpen(f) + particles(f) + body + svgClose();
}

function generateFrame(f) {
  if (f < 90) return introScene(f);
  if (f < 270) return modeScene(f);
  if (f < 345) return techScene(f);
  return outroScene(f);
}

// ── MAIN ──
console.log(`🎬 PixelTale 1000X Video Generator`);
console.log(`📐 ${W}x${H} @ ${FPS}fps = ${TOTAL_FRAMES} frames (${TOTAL_FRAMES/FPS}s)\n`);

fs.mkdirSync(FRAMES_DIR, { recursive: true });
fs.mkdirSync(PNG_DIR, { recursive: true });
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });

// Step 1: Generate SVGs
console.log('Step 1/3: Generating SVG frames...');
for (let f = 0; f < TOTAL_FRAMES; f++) {
  const svg = generateFrame(f);
  const pad = String(f).padStart(5, '0');
  fs.writeFileSync(path.join(FRAMES_DIR, `frame_${pad}.svg`), svg);
  if (f % 60 === 0) console.log(`  SVG ${f}/${TOTAL_FRAMES}`);
}
console.log('  ✅ SVGs done');

// Step 2: Convert SVGs → PNGs using ImageMagick
console.log('\nStep 2/3: Converting SVG → PNG via ImageMagick...');
// Batch convert with magick (faster than individual calls)
for (let f = 0; f < TOTAL_FRAMES; f++) {
  const pad = String(f).padStart(5, '0');
  const svgPath = path.join(FRAMES_DIR, `frame_${pad}.svg`);
  const pngPath = path.join(PNG_DIR, `frame_${pad}.png`);
  try {
    execSync(`magick "${svgPath}" -resize "${W}x${H}" -depth 8 "${pngPath}"`, { stdio: 'pipe', timeout: 15000 });
  } catch(e) {
    // Fallback: create a simple PNG if magick fails
    execSync(`magick -size ${W}x${H} xc:"${BG}" "${pngPath}"`, { stdio: 'pipe', timeout: 5000 });
  }
  if (f % 60 === 0) console.log(`  PNG ${f}/${TOTAL_FRAMES}`);
}
console.log('  ✅ PNGs done');

// Step 3: Encode MP4 via FFmpeg
console.log('\nStep 3/3: Encoding MP4 via FFmpeg...');
try {
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${PNG_DIR}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 22 -movflags +faststart "${OUTPUT}"`,
    { stdio: 'inherit', timeout: 300000 }
  );
  console.log(`\n🎬 VIDEO RENDERED: ${OUTPUT}`);
  const mb = (fs.statSync(OUTPUT).size / (1024*1024)).toFixed(2);
  console.log(`📊 Size: ${mb} MB  |  📐 ${W}x${H}  |  ⏱️ ${TOTAL_FRAMES/FPS}s`);
} catch(e) {
  console.error('FFmpeg failed:', e.message);
  process.exit(1);
}
