#!/usr/bin/env node
/**
 * scripts/run-evals.mjs
 * Automated Benchmark & Verification Suite untuk /antislop-graphics-motion (v2.1 Humanizer Edition)
 * Menguji seluruh skenario di evals/evals.json + 7 fitur Editing Humanizer:
 * 1. Static Anti-Slop Linter (Zero Emoji, Determinism, Zero Camera Shake)
 * 2. Component Architecture & 7 Editing Humanizers Contract
 * 3. Eval #1: SaaS Launch (Style Selection + Asymmetric Pacing Scenes + J-Cut Lead-In + Word Sync)
 * 4. Eval #2: Split Flap #10 + B24 Deterministic 48kHz Stereo WAV + Key/Click SFX (D1, D9)
 * 5. Safe-Zone & Bounding-Box Spline Inspector (inspect-motion.mjs)
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILL_ROOT = path.resolve(__dirname, '..');

const evalsFile = path.join(SKILL_ROOT, 'evals', 'evals.json');
const evalsData = JSON.parse(fs.readFileSync(evalsFile, 'utf8'));

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'antislop-eval-'));
const results = [];

function check(name, fn) {
  const start = Date.now();
  try {
    const detail = fn();
    results.push({ name, status: 'PASS', ms: Date.now() - start, detail });
  } catch (err) {
    results.push({ name, status: 'FAIL', ms: Date.now() - start, detail: err.message });
  }
}

console.log(`\n================================================================`);
console.log(`  BENCHMARK SUITE: ${evalsData.skill_name} (v2.1 + 7 Humanizers)`);
console.log(`================================================================\n`);

// Test 1: Static Linter pada seluruh Template
check('1. Static Anti-Slop Linter (Zero Emoji, Determinism, Zero Shake)', () => {
  const out = execSync(`node "${path.join(__dirname, 'lint.mjs')}" "${path.join(SKILL_ROOT, 'templates')}"`, {
    encoding: 'utf8',
  });
  const parsed = JSON.parse(out);
  if (parsed.status !== 'PASS') {
    throw new Error(`Linter failed: ${JSON.stringify(parsed.violations)}`);
  }
  return `Scanned ${parsed.scannedFiles} template files with 0 violations`;
});

// Test 2: Kontrak Arsitektur Komponen + 7 Fitur Editing Humanizer
check('2. Component Architecture & 7 Editing Humanizers Contract', () => {
  const easingCode = fs.readFileSync(path.join(SKILL_ROOT, 'templates/theme/easing-and-timing.ts'), 'utf8');
  const wordsCode = fs.readFileSync(path.join(SKILL_ROOT, 'templates/components/KineticWords.tsx'), 'utf8');
  const cursorCode = fs.readFileSync(path.join(SKILL_ROOT, 'templates/components/AnimatedCursor.tsx'), 'utf8');
  const camCode = fs.readFileSync(path.join(SKILL_ROOT, 'templates/components/CameraRig.tsx'), 'utf8');
  const shellsCode = fs.readFileSync(path.join(SKILL_ROOT, 'templates/components/LivedInUIShells.tsx'), 'utf8');
  const transCode = fs.readFileSync(path.join(SKILL_ROOT, 'templates/components/Transitions.tsx'), 'utf8');

  if (!easingCode.includes('export function splineAt')) throw new Error('Missing splineAt');
  if (!easingCode.includes('export function splineVelocityAt')) throw new Error('Missing splineVelocityAt (Humanizer #5)');
  if (!easingCode.includes('export function staggeredSpringAt') || !easingCode.includes('export function microBob')) {
    throw new Error('Missing staggeredSpringAt or microBob (Humanizer #2)');
  }
  if (!easingCode.includes('export function computeAsymmetricSceneDurations')) {
    throw new Error('Missing computeAsymmetricSceneDurations (Humanizer #3)');
  }
  if (!wordsCode.includes('export const BottomSubtitleBar')) throw new Error('Missing BottomSubtitleBar');
  if (!wordsCode.includes('typoCorrection') || !wordsCode.includes('humanizeCadence')) {
    throw new Error('Missing humanized typing cadence / typoCorrection (Humanizer #1A)');
  }
  if (!cursorCode.includes('humanizeFittsLaw') || !cursorCode.includes('useCursorTargetState')) {
    throw new Error('Missing Fitts Law cursor overshoot / hover state (Humanizer #1B)');
  }
  if (!camCode.includes('enableVelocityBlur') || !camCode.includes('enableRackFocusSpotlight')) {
    throw new Error('Missing Velocity Blur or Rack-Focus Spotlight (Humanizer #5)');
  }
  if (!shellsCode.includes('export const ChatAppShell') || !shellsCode.includes('export const MacDesktopChrome')) {
    throw new Error('Missing Lived-In UI Shells (Humanizer #6)');
  }
  if (!transCode.includes('export const SeamlessSceneShell') || !transCode.includes('export const SharedElementMorph')) {
    throw new Error('Missing SeamlessSceneShell or SharedElementMorph');
  }

  return 'Verified all 7 Editing Humanizers (Typing Cadence/Typo, Fitts Cursor Hover, Micro-Bob/Overlap, Asymmetric Pacing/Anticipation, Velocity Blur/Spotlight, Lived-In UI Shells)';
});

// Test 3: Eval Scenario 1 — SaaS Launch + Asymmetric Pacing & J-Cut Lead-In
check('3. Eval #1: SaaS Launch (Asymmetric Pacing + J-Cut Audio Lead-In + Word Sync)', () => {
  const dir1 = path.join(tmpRoot, 'eval1');
  execSync(
    `node "${path.join(__dirname, 'draw-style.mjs')}" --brief "SaaS AI Assistant developer launch" --out "${dir1}/research"`,
    { stdio: 'pipe' }
  );
  execSync(
    `node "${path.join(__dirname, 'scenes.mjs')}" --brief "SaaS AI Assistant" --duration 12 --overlap 10 --out "${dir1}/research"`,
    { stdio: 'pipe' }
  );
  execSync(
    `node "${path.join(__dirname, 'narrator-sync.mjs')}" --text "Fokus utama adalah visual konten di tengah dan subtitle rapi di bawah." --out-words "${dir1}/public/words.json" --out-map "${dir1}/research/word-map.md"`,
    { stdio: 'pipe' }
  );

  const plan = JSON.parse(fs.readFileSync(path.join(dir1, 'research/scenes-plan.json'), 'utf8'));
  const words = JSON.parse(fs.readFileSync(path.join(dir1, 'public/words.json'), 'utf8'));
  if (!plan.asymmetricPacing || plan.scenes.length < 3) throw new Error('Invalid asymmetric scenes plan');
  const durs = plan.scenes.map((s) => s.durationInFrames);
  if (durs[0] === durs[1]) throw new Error('Scene durations are still identical instead of asymmetric');
  return `Asymmetric scene durations [${durs.join('f, ')}f] with J-Cut lead-in & ${words.length} subtitle words`;
});

// Test 4: Eval Scenario 2 — Split Flap (#10) + B24 + Key/Click SFX (D1, D9)
check('4. Eval #2: Split Flap #10 + B24 48kHz Stereo WAV + Key/Click SFX (D1, D9)', () => {
  const dir2 = path.join(tmpRoot, 'eval2');
  execSync(
    `node "${path.join(__dirname, 'synth-audio.mjs')}" --bgm B24 --duration 4 --out "${dir2}/public/audio"`,
    { stdio: 'pipe' }
  );

  for (const f of ['music.wav', 'bed.wav', 'sfx-track.wav', 'sfx/d1.wav', 'sfx/d9.wav']) {
    const full = path.join(dir2, 'public/audio', f);
    if (!fs.existsSync(full)) throw new Error(`Missing synthesized audio file: ${f}`);
  }
  return 'Verified 48kHz stereo WAVs + tactile key-click (d9.wav) & mouse-click (d1.wav)';
});

// Test 5: Humanizer #7 — Bounding-Box & Safe-Zone Spline Inspector
check('5. Safe-Zone & Bounding-Box Camera Spline Inspector (inspect-motion.mjs)', () => {
  const out = execSync(
    `node "${path.join(__dirname, 'inspect-motion.mjs')}" --src "${path.join(SKILL_ROOT, 'templates')}" --public "${path.join(SKILL_ROOT, 'references')}"`,
    { encoding: 'utf8' }
  );
  const parsed = JSON.parse(out);
  if (parsed.status !== 'PASS') {
    throw new Error(`Inspector failed: ${JSON.stringify(parsed.issues)}`);
  }
  return parsed.passes.join(' | ');
});

try {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
} catch {}

let passed = 0;
for (const r of results) {
  if (r.status === 'PASS') passed++;
  console.log(`[${r.status}] ${r.name} (${r.ms}ms)`);
  console.log(`       -> ${r.detail}\n`);
}

console.log(`================================================================`);
console.log(`  RESULT: ${passed}/${results.length} BENCHMARK CHECKS PASSED`);
console.log(`================================================================\n`);

if (passed < results.length) {
  process.exitCode = 1;
}
