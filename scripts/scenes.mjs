#!/usr/bin/env node
/**
 * scripts/scenes.mjs
 * Scene & Seamless Continuity Planner dengan Humanizer #3 (Asymmetric Pacing Contrast)
 * & Humanizer #4 (J-Cut Audio Lead-In 4 frame sebelum transisi gambar).
 */

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    brief: 'Demo Produk & Alur Kerja Interaktif',
    durationSec: 12,
    fps: 30,
    overlapFrames: 10,
    outDir: 'research',
  };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--brief' && v) args.brief = v;
    if (k === '--duration' && v) args.durationSec = Number(v);
    if (k === '--fps' && v) args.fps = Number(v);
    if (k === '--overlap' && v) args.overlapFrames = Number(v);
    if (k === '--out' && v) args.outDir = v;
  }
  return args;
}

const opts = parseArgs(process.argv);
const totalFrames = Math.round(opts.durationSec * opts.fps);
const sceneCount = Math.max(3, Math.min(6, Math.round(opts.durationSec / 3.5)));

// Bobot durasi asimetris (Slow Establish -> Fast Cut -> Medium Glide -> Slow Hold)
const PACING_WEIGHTS = [
  { weight: 1.18, pacingRole: 'Establish & Humanized Typing Hook (Slow-Medium)' },
  { weight: 0.78, pacingRole: 'Fitts-Law Cursor Hover & Click Action (Fast)' },
  { weight: 0.92, pacingRole: 'Wide Desktop Multi-Window Glide (Medium-Fast)' },
  { weight: 1.22, pacingRole: 'Climax & Takeaway Hold with Micro-Bobbing (Slow-Breathe)' },
  { weight: 0.85, pacingRole: 'Data Proof Spotlight (Fast)' },
  { weight: 1.15, pacingRole: 'Final Resolution Hold (Slow)' },
];

const CAMERA_PATTERNS = [
  {
    mode: 'zoom-follow-typing',
    desc: 'Mulai zoom 1.48x mengikuti ketikan (TypeText dengan cadence alami) di ChatAppShell, lalu pull-out halus ke 1.0x.',
    visualHero: 'Lived-In ChatAppShell (lengkap dengan ekor bubble, tombol +, ikon mic, dan header avatar pill).',
  },
  {
    mode: 'follow-cursor-click',
    desc: 'Tenang di 1.0x -> 3-frame anticipation pullback (0.982x) -> Zoom 1.42x mengikuti AnimatedCursor (overshoot 4.5px + 5f hover delay) -> Klik!',
    visualHero: 'Kartu Produk + Typo Backspace Caption + Kursor mengklik tombol Publish.',
  },
  {
    mode: 'wide-canvas-glide',
    desc: 'Kamera C1 spline menyusuri kanvas 3000px dengan Velocity Motion Blur tipis (1.5-3.5px) melewati 3 window macOS.',
    visualHero: 'MacDesktopChrome (Menu Bar atas + Floating Dock bawah dengan micro-bobbing + 3 Traffic-Light Windows).',
  },
  {
    mode: 'spotlight-data-inspect',
    desc: 'Tenang di 1.0x -> Rack-Focus Spotlight + Zoom 1.38x ke puncak grafik -> Kembali tenang ke 1.0x.',
    visualHero: 'Dashboard Grafik Data & Metrik Performa dengan anotasi langsung.',
  },
];

const SEAMLESS_TRANSITIONS = [
  'portal-zoom-in (Zoom masuk ke dalam kartu tengah menuju scene berikutnya + J-Cut SFX 4f lebih awal)',
  'whip-glide-left (Overlap 10 frame: Scene A meluncur ke kiri bersamaan Scene B masuk dari kanan dengan easeInOutSmooth)',
  'shared-element-morph (Objek utama di akhir Scene A berlanjut dan berubah ukuran/posisi secara mulus di Scene B)',
  'spring-sheet-up (Latar belakang menyambung, panel konten baru meluncur naik dengan staggeredSpringAt)',
];

const chosenWeights = Array.from({ length: sceneCount }, (_, i) => PACING_WEIGHTS[i % PACING_WEIGHTS.length]);
const weightSum = chosenWeights.reduce((acc, w) => acc + w.weight, 0);
const distributableFrames = totalFrames + (sceneCount - 1) * opts.overlapFrames;

const scenes = [];
let currentStart = 0;

for (let i = 0; i < sceneCount; i++) {
  const rawDur = Math.round((chosenWeights[i].weight / weightSum) * distributableFrames);
  const endFrame = i === sceneCount - 1 ? totalFrames : Math.min(totalFrames, currentStart + Math.max(45, rawDur));
  const cam = CAMERA_PATTERNS[i % CAMERA_PATTERNS.length];
  const enterTrans = i === 0 ? 'none (Opening Staggered Spring)' : SEAMLESS_TRANSITIONS[(i - 1) % SEAMLESS_TRANSITIONS.length];
  const exitTrans = i === sceneCount - 1 ? 'none (Clean Hold Finale)' : SEAMLESS_TRANSITIONS[i % SEAMLESS_TRANSITIONS.length];

  scenes.push({
    sceneIndex: i + 1,
    startFrame: currentStart,
    endFrame,
    durationInFrames: endFrame - currentStart,
    pacingRole: chosenWeights[i].pacingRole,
    jCutAudioFrame: Math.max(0, endFrame - opts.overlapFrames - 4),
    visualHeroCenter: cam.visualHero,
    subtitlePlacement: 'BottomSubtitleBar (bottom: 38px, 24px font, tidak menutupi visual tengah)',
    cameraSplineBehavior: cam.desc,
    enterTransition: enterTrans,
    exitTransition: exitTrans,
  });

  currentStart = endFrame - opts.overlapFrames;
}

const outDir = path.resolve(process.cwd(), opts.outDir);
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'scenes-plan.json'),
  JSON.stringify({ brief: opts.brief, totalFrames, fps: opts.fps, asymmetricPacing: true, scenes }, null, 2),
  'utf8'
);

const mdRows = scenes
  .map(
    (s) =>
      `### Scene ${s.sceneIndex} — ${s.pacingRole} (Frame ${s.startFrame}–${s.endFrame} | ${s.durationInFrames}f)\n` +
      `- **Konten Visual Utama (85% Tengah):** ${s.visualHeroCenter}\n` +
      `- **Posisi Subtitle:** ${s.subtitlePlacement}\n` +
      `- **Gerak Kamera C1 Spline & Humanizer:** ${s.cameraSplineBehavior}\n` +
      `- **Transisi Masuk:** ${s.enterTransition}\n` +
      `- **Transisi Keluar (Overlap ${opts.overlapFrames}f | J-Cut Audio di f${s.jCutAudioFrame}):** ${s.exitTransition}\n`
  )
  .join('\n');

const motionPlanMd = `# Rencana Gerak, Pacing Asimetris, & Editing Humanizer (Motion Plan)

- **Brief:** ${opts.brief}
- **Total Durasi:** ${opts.durationSec} detik (${totalFrames} frame @ ${opts.fps} fps)
- **7 Standar Editing Humanizer Aktif:**
  1. **Humanized Typing & Fitts-Law Cursor:** Cadence ketik bervariasi + typo backspace & kursor overshoot 4.5px + 5-frame hover delay.
  2. **Overlapping Action & Micro-Bobbing:** Inersia berlapis (\`staggeredSpringAt\`) & elemen mengambang beda fase (\`microBob\`).
  3. **Asymmetric Scene Pacing & 3-Frame Camera Anticipation:** Durasi antar-scene bervariasi (tidak dibagi rata seperti robot) + pullback 0.982x sebelum zoom-in.
  4. **J-Cut Audio Lead-In:** SFX transisi berbunyi 4 frame sebelum gambar berpindah.
  5. **Velocity-Driven Motion Blur & Rack-Focus Spotlight:** Blur otomatis 1.5–3.8px hanya saat kamera cepat, tajam 0px saat diam.
  6. **Lived-In UI Shells:** Bingkai aplikasi lengkap (\`ChatAppShell\`, \`MacDesktopChrome\`) dengan detail periferal nyata.
  7. **Safe-Zone Viewport Clamping:** Fokus kamera terjamin berada di area aman 20%–80% layar dan bebas tabrakan dengan \`BottomSubtitleBar\`.

${mdRows}
`;

fs.writeFileSync(path.join(outDir, 'motion-plan.md'), motionPlanMd, 'utf8');
console.log(`[scenes] Generated ${scenes.length} asymmetric humanized scenes in ${path.join(outDir, 'motion-plan.md')}`);
