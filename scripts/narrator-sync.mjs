#!/usr/bin/env node
/**
 * scripts/narrator-sync.mjs
 * Generator Suara Narator & Peta Kata (words.json + research/word-map.md)
 * Mendukung:
 * 1. Konversi naskah (--text "...") menjadi public/words.json dengan timestamp kata-per-kata,
 *    peran hierarki (keyword/support/connector), dan 10 efek kata yang tidak pernah berulang berurutan.
 * 2. Opsional: Sintesis suara narator menggunakan Edge-TTS jika tersedia (--tts --voice N01..N05).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const VOICE_PROFILES = {
  N01: { voice: 'id-ID-ArdiNeural', rate: '+5%', pitch: '-2Hz', desc: 'Editorial Hangat (ID Pria)' },
  N02: { voice: 'id-ID-GadisNeural', rate: '+10%', pitch: '+2Hz', desc: 'Kreatif Energik (ID Wanita)' },
  N03: { voice: 'id-ID-ArdiNeural', rate: '-5%', pitch: '-6Hz', desc: 'Dokumenter Sinematik (ID Pria Dalam)' },
  N04: { voice: 'en-US-ChristopherNeural', rate: '+8%', pitch: '+0Hz', desc: 'Tech Explainer Cepat (EN Male)' },
  N05: { voice: 'en-US-AriaNeural', rate: '+0%', pitch: '+0Hz', desc: 'Design Essayist (EN Female)' },
};

const EFFECTS = [
  'mask-up',
  'slide-mask',
  'spring-pop',
  'flip-3d',
  'blur-sharp',
  'tracking-lock',
  'split-merge',
  'draw-underline',
  'wipe-highlight',
  'slot-roll',
];

const CONNECTORS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'pada', 'adalah', 'ini', 'itu',
  'atau', 'dalam', 'bisa', 'akan', 'the', 'and', 'to', 'of', 'in', 'for', 'with', 'on', 'is',
]);

function parseArgs(argv) {
  const args = {
    text: 'Bukan sekadar template biasa, setiap frame dirancang presisi dengan kamera hidup dan suara yang menyatu.',
    wpm: 155,
    startOffsetMs: 120,
    profile: 'N01',
    tts: false,
    outWords: 'public/words.json',
    outMap: 'research/word-map.md',
    outAudio: 'public/audio/narration.mp3',
  };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--text' && v) args.text = v;
    if (k === '--wpm' && v) args.wpm = Number(v);
    if (k === '--profile' && v) args.profile = v.toUpperCase();
    if (k === '--tts') args.tts = true;
    if (k === '--out-words' && v) args.outWords = v;
    if (k === '--out-map' && v) args.outMap = v;
  }
  return args;
}

const opts = parseArgs(process.argv);
const rawTokens = opts.text.trim().split(/\s+/).filter(Boolean);
const avgMsPerWord = Math.round(60000 / opts.wpm);

let cursorMs = opts.startOffsetMs;
let prevEffect = '';

const words = rawTokens.map((token, idx) => {
  const clean = token.replace(/[.,!?;:"]/g, '').toLowerCase();
  const hasPunctuationPause = /[.,!?;:]$/.test(token);
  const charFactor = Math.max(0.65, Math.min(1.45, clean.length / 6));
  const durMs = Math.round(avgMsPerWord * charFactor);

  let role = 'support';
  if (CONNECTORS.has(clean) || clean.length <= 2) {
    role = 'connector';
  } else if (/\d/.test(token) || clean.length >= 7 || idx % 4 === 0) {
    role = 'keyword';
  }

  let effect = EFFECTS[(idx * 3 + clean.length) % EFFECTS.length];
  if (/\d/.test(token)) effect = 'slot-roll';
  if (effect === prevEffect) {
    effect = EFFECTS[(EFFECTS.indexOf(effect) + 1) % EFFECTS.length];
  }
  prevEffect = effect;

  const item = {
    text: token,
    startMs: cursorMs,
    endMs: cursorMs + durMs,
    role,
    effect,
  };

  cursorMs += durMs + (hasPunctuationPause ? 180 : 25);
  return item;
});

const wordsPath = path.resolve(process.cwd(), opts.outWords);
fs.mkdirSync(path.dirname(wordsPath), { recursive: true });
fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2), 'utf8');

// Tulis research/word-map.md sesuai SKILL.md
const mapPath = path.resolve(process.cwd(), opts.outMap);
fs.mkdirSync(path.dirname(mapPath), { recursive: true });
const tableRows = words
  .map(
    (w, i) =>
      `| ${i + 1} | \`${w.text}\` | ${w.startMs}–${w.endMs} ms | **${w.role}** | \`${w.effect}\` | ${
        w.role === 'keyword' ? 'U2 (Pop Kata Kunci) + Camera Accent' : 'U1 (Tick Halus)'
      } |`
  )
  .join('\n');

const wordMapMd = `# Peta Kata Narasi (Word Map)

- **Profil Suara Narator:** ${opts.profile} — ${VOICE_PROFILES[opts.profile]?.desc || 'Custom'}
- **Total Kata:** ${words.length} kata
- **Estimasi Durasi Narasi:** ${(cursorMs / 1000).toFixed(2)} detik

| # | Kata | Timestamp | Hierarki | Efek Masuk | Reaksi Audio & Kamera |
|---|---|---|---|---|---|
${tableRows}
`;

fs.writeFileSync(mapPath, wordMapMd, 'utf8');

if (opts.tts) {
  const prof = VOICE_PROFILES[opts.profile] || VOICE_PROFILES.N01;
  const outAudioPath = path.resolve(process.cwd(), opts.outAudio);
  fs.mkdirSync(path.dirname(outAudioPath), { recursive: true });
  try {
    execSync(
      `edge-tts --voice "${prof.voice}" --rate="${prof.rate}" --pitch="${prof.pitch}" --text "${opts.text.replace(/"/g, '\\"')}" --write-media "${outAudioPath}"`,
      { stdio: 'inherit' }
    );
    console.log(`[narrator-sync] Synthesized narrator voice at ${outAudioPath}`);
  } catch {
    console.log(`[narrator-sync] Note: edge-tts CLI not found in PATH. Generated words.json and word-map.md cleanly.`);
  }
}

console.log(`[narrator-sync] Generated ${words.length} timed words in ${wordsPath} and ${mapPath}`);
