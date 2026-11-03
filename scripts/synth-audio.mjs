#!/usr/bin/env node
/**
 * scripts/synth-audio.mjs
 * Deterministic Procedural Audio & SFX Synthesizer (48,000 Hz, 16-bit Stereo WAV)
 * Dilengkapi Humanizer #4:
 * - J-Cut Audio Lead-In: Bunyi transisi dan cue masuk 4 frame sebelum gambar berpindah
 * - 5 Varian SFX Ketikan (D9) dengan pitch mikro berbeda + SFX Klik Kursor (D1)
 */

import fs from 'node:fs';
import path from 'node:path';

const SAMPLE_RATE = 48000;

function mulberry32(seedStr = 'antislop-audio') {
  let a = 0;
  for (let i = 0; i < seedStr.length; i++) {
    a = (a * 31 + seedStr.charCodeAt(i)) | 0;
  }
  if (a === 0) a = 987654321;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function writeStereoWav(filePath, left, right, sampleRate = SAMPLE_RATE) {
  const numSamples = Math.min(left.length, right.length);
  const dataSize = numSamples * 4;
  const buf = Buffer.alloc(44 + dataSize);

  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const l = Math.tanh(left[i]) * 0.88;
    const r = Math.tanh(right[i]) * 0.88;
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(l * 32767))), offset);
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(r * 32767))), offset + 2);
    offset += 4;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buf);
}

function osc(type, phase) {
  const p = phase - Math.floor(phase);
  switch (type) {
    case 'sine':
      return Math.sin(p * 2 * Math.PI);
    case 'saw':
      return 2 * p - 1;
    case 'square':
      return p < 0.5 ? 1 : -1;
    case 'triangle':
      return 1 - 4 * Math.abs(Math.round(p - 0.25) - (p - 0.25));
    default:
      return Math.sin(p * 2 * Math.PI);
  }
}

function filterLP(samples, cutoffHz) {
  const out = new Float32Array(samples.length);
  const rc = 1.0 / (2 * Math.PI * Math.max(20, cutoffHz));
  const dt = 1.0 / SAMPLE_RATE;
  const alpha = dt / (rc + dt);
  let prev = 0;
  for (let i = 0; i < samples.length; i++) {
    prev = prev + alpha * (samples[i] - prev);
    out[i] = prev;
  }
  return out;
}

function filterHP(samples, cutoffHz) {
  const lp = filterLP(samples, cutoffHz);
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    out[i] = samples[i] - lp[i];
  }
  return out;
}

function synthesizeSfxBuffer(code, variant = 0, seed = 'sfx') {
  const rand = mulberry32(`${seed}-${code}-${variant}`);
  const pitchShift = 1 + (variant - 2) * 0.06;

  // D9: Mechanical Keyboard Keypress (18ms tactile click + thock, 5 varian)
  if (code === 'D9') {
    const dur = 0.022;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const click = (rand() * 2 - 1) * Math.exp(-t * 260) * 0.5;
      const thock = osc('sine', t * 480 * pitchShift) * Math.exp(-t * 140) * 0.5;
      buf[i] = (click + thock) * 0.42;
    }
    return filterLP(buf, 3400);
  }

  // D1: Mouse Click (double transient press + release)
  if (code === 'D1') {
    const dur = 0.045;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const press = t < 0.012 ? osc('triangle', t * 1450 * pitchShift) * Math.exp(-t * 320) : 0;
      const rel = t >= 0.022 ? osc('triangle', (t - 0.022) * 1850 * pitchShift) * Math.exp(-(t - 0.022) * 380) * 0.65 : 0;
      buf[i] = (press + rel) * 0.55;
    }
    return buf;
  }

  if (code === 'U1' || code === 'M2') {
    const dur = 0.028;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    const freq = (code === 'M2' ? 1900 : 1650) * pitchShift;
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * 140);
      buf[i] = osc('triangle', t * freq) * env * 0.45;
    }
    return buf;
  }

  if (code === 'U2' || code === 'O2' || code === 'Y6') {
    const dur = 0.08;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    let phase = 0;
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const f = (300 + (t / dur) * 340) * pitchShift;
      phase += f / SAMPLE_RATE;
      const env = Math.sin((t / dur) * Math.PI) * Math.exp(-t * 18);
      const click = i < 180 ? (rand() * 2 - 1) * 0.25 : 0;
      buf[i] = (osc('sine', phase) + click) * env * 0.65;
    }
    return buf;
  }

  if (code === 'U3' || code === 'U4' || code === 'U8' || code === 'Y1') {
    const dur = code === 'U4' ? 0.65 : code === 'U8' ? 0.14 : 0.32;
    const len = Math.floor(dur * SAMPLE_RATE);
    const raw = new Float32Array(len);
    let phase = 0;
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const norm = t / dur;
      const env = Math.sin(norm * Math.PI) ** 1.6;
      const sweepFreq = (320 + Math.sin(norm * Math.PI) * 2400) * pitchShift;
      phase += sweepFreq / SAMPLE_RATE;
      const tone = osc('sine', phase) * 0.25;
      const noise = (rand() * 2 - 1) * 0.75;
      raw[i] = (noise + tone) * env * 0.6;
    }
    return filterHP(filterLP(raw, 3600), 260);
  }

  if (code === 'U5' || code === 'U7' || code === 'C1' || code === 'Y3') {
    const dur = code === 'C1' ? 1.1 : 0.48;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    let phase = 0;
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const f = (40 + 110 * Math.exp(-t * 22)) * pitchShift;
      phase += f / SAMPLE_RATE;
      const env = Math.exp(-t * (code === 'C1' ? 3.5 : 7.5));
      const transient = t < 0.025 ? (rand() * 2 - 1) * Math.exp(-t * 90) * 0.5 : 0;
      buf[i] = (osc('sine', phase) * 0.85 + transient) * env * 0.8;
    }
    return buf;
  }

  if (code === 'U6' || code === 'U10') {
    const dur = code === 'U6' ? 1.4 : 0.5;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    let phase = 0;
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const norm = t / dur;
      const env = norm * norm;
      const f = (220 + norm * norm * 1800) * pitchShift;
      phase += f / SAMPLE_RATE;
      buf[i] = (osc('saw', phase) * 0.3 + (rand() * 2 - 1) * 0.4) * env * 0.55;
    }
    return filterLP(buf, 4200);
  }

  if (code === 'U9') {
    const dur = 1.25;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    const freqs = [261.63, 329.63, 392.0, 523.25].map((f) => f * pitchShift);
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * 3.2);
      let s = 0;
      for (const f of freqs) {
        s += osc('triangle', t * f) * 0.22 + osc('sine', t * f * 2) * 0.08;
      }
      buf[i] = s * env * 0.7;
    }
    return buf;
  }

  const dur = 0.12;
  const len = Math.floor(dur * SAMPLE_RATE);
  const buf = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 35);
    buf[i] = ((rand() * 2 - 1) * 0.5 + osc('sine', t * 520 * pitchShift) * 0.5) * env * 0.5;
  }
  return filterLP(buf, 3200);
}

function synthesizeRoomToneBed(durationSec, seed = 'room-bed') {
  const rand = mulberry32(seed);
  const len = Math.floor(durationSec * SAMPLE_RATE);
  const left = new Float32Array(len);
  const right = new Float32Array(len);

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const lowHum = Math.sin(2 * Math.PI * 55 * t) * 0.012 + Math.sin(2 * Math.PI * 110 * t) * 0.006;
    const pinkL = (rand() * 2 - 1) * 0.018;
    const pinkR = (rand() * 2 - 1) * 0.018;
    left[i] = lowHum + pinkL;
    right[i] = lowHum + pinkR;
  }
  return { left: filterLP(left, 900), right: filterLP(right, 900) };
}

const BGM_CONFIGS = {
  B00: { bpm: 70, scale: [110], style: 'ambient', wave: 'sine' },
  B01: { bpm: 84, scale: [220, 261.63, 293.66, 329.63, 392.0], style: 'lofi', wave: 'triangle' },
  B02: { bpm: 110, scale: [146.83, 174.61, 220, 261.63, 293.66], style: 'synthwave', wave: 'saw' },
  B03: { bpm: 98, scale: [110, 130.81, 146.83, 164.81, 196.0], style: 'darkbass', wave: 'saw' },
  B04: { bpm: 124, scale: [164.81, 196, 220, 246.94, 293.66], style: 'glitch', wave: 'square' },
  B05: { bpm: 90, scale: [130.81, 155.56, 174.61, 196.0, 233.08], style: 'boombap', wave: 'triangle' },
  B06: { bpm: 140, scale: [110, 130.81, 164.81, 174.61, 220], style: 'trap', wave: 'sine' },
  B07: { bpm: 108, scale: [196, 233.08, 261.63, 293.66, 349.23], style: 'funk', wave: 'saw' },
  B08: { bpm: 116, scale: [261.63, 293.66, 329.63, 392.0, 440.0], style: 'marimba', wave: 'sine' },
  B09: { bpm: 122, scale: [220, 261.63, 329.63, 392.0, 440.0], style: 'techpulse', wave: 'triangle' },
  B10: { bpm: 68, scale: [174.61, 220, 261.63, 329.63, 392.0], style: 'ambient', wave: 'sine' },
  B11: { bpm: 78, scale: [110, 116.54, 146.83, 164.81, 220], style: 'cinematic', wave: 'saw' },
  B12: { bpm: 112, scale: [196, 246.94, 293.66, 392.0, 440.0], style: 'orchestral', wave: 'saw' },
  B13: { bpm: 140, scale: [261.63, 329.63, 392.0, 523.25, 659.25], style: 'chiptune', wave: 'square' },
  B14: { bpm: 118, scale: [196, 233.08, 261.63, 311.13, 349.23], style: 'jazz', wave: 'triangle' },
  B15: { bpm: 104, scale: [261.63, 329.63, 392.0, 440.0, 523.25], style: 'ragtime', wave: 'triangle' },
  B16: { bpm: 98, scale: [220, 277.18, 329.63, 369.99, 440.0], style: 'lounge', wave: 'sine' },
  B17: { bpm: 76, scale: [261.63, 298.0, 342.0, 402.0, 460.0], style: 'nusantara', wave: 'sine' },
  B18: { bpm: 116, scale: [110, 123.47, 146.83, 164.81, 185.0], style: 'industrial', wave: 'saw' },
  B19: { bpm: 92, scale: [196, 220, 246.94, 293.66, 329.63], style: 'acoustic', wave: 'triangle' },
  B20: { bpm: 64, scale: [98, 103.83, 138.59, 155.56], style: 'drone', wave: 'saw' },
  B21: { bpm: 108, scale: [220, 246.94, 293.66, 329.63, 440.0], style: 'corporate', wave: 'triangle' },
  B22: { bpm: 158, scale: [146.83, 174.61, 220, 261.63, 293.66], style: 'breakbeat', wave: 'saw' },
  B23: { bpm: 104, scale: [110, 146.83, 164.81], style: 'percussion', wave: 'sine' },
  B24: { bpm: 108, scale: [220, 261.63, 329.63, 392.0], style: 'clockwork', wave: 'triangle' },
};

function synthesizeBgmTrack(bgmCode = 'B09', durationSec = 15, seed = 'antislop-bgm') {
  const cfg = BGM_CONFIGS[bgmCode] || BGM_CONFIGS.B09;
  if (bgmCode === 'B00') {
    return synthesizeRoomToneBed(durationSec, seed);
  }

  const rand = mulberry32(`${seed}-${bgmCode}`);
  const len = Math.floor(durationSec * SAMPLE_RATE);
  const left = new Float32Array(len);
  const right = new Float32Array(len);

  const stepSec = 60 / cfg.bpm / 4;
  const totalSteps = Math.ceil(durationSec / stepSec);

  for (let step = 0; step < totalSteps; step++) {
    const startSample = Math.floor(step * stepSec * SAMPLE_RATE);
    if (startSample >= len) break;

    if (!['ambient', 'drone', 'nusantara'].includes(cfg.style) && step % 4 === 0) {
      const kickLen = Math.min(Math.floor(0.28 * SAMPLE_RATE), len - startSample);
      let kPhase = 0;
      for (let i = 0; i < kickLen; i++) {
        const t = i / SAMPLE_RATE;
        const f = 46 + 105 * Math.exp(-t * 28);
        kPhase += f / SAMPLE_RATE;
        const env = Math.exp(-t * 11);
        const s = Math.sin(kPhase * 2 * Math.PI) * env * 0.42;
        left[startSample + i] += s;
        right[startSample + i] += s;
      }
    }

    if (!['ambient', 'drone'].includes(cfg.style) && step % 2 === 0) {
      const hatLen = Math.min(Math.floor(0.04 * SAMPLE_RATE), len - startSample);
      const gain = step % 4 === 2 ? 0.12 : 0.06;
      for (let i = 0; i < hatLen; i++) {
        const t = i / SAMPLE_RATE;
        const n = (rand() * 2 - 1) * Math.exp(-t * 95) * gain;
        left[startSample + i] += n * 0.9;
        right[startSample + i] += n * 1.1;
      }
    }

    if (step % 2 === 0 || rand() > 0.45) {
      const noteFreq = cfg.scale[(step + Math.floor(rand() * 2)) % cfg.scale.length];
      const noteDur = stepSec * (cfg.style === 'ambient' ? 6 : 2.5);
      const noteLen = Math.min(Math.floor(noteDur * SAMPLE_RATE), len - startSample);
      const pan = 0.35 + rand() * 0.3;

      for (let i = 0; i < noteLen; i++) {
        const t = i / SAMPLE_RATE;
        const env = Math.exp(-t * (cfg.style === 'ambient' ? 1.8 : 6.5));
        let sig = osc(cfg.wave, t * noteFreq) * 0.22;
        if (cfg.style === 'nusantara') {
          sig += osc('sine', t * noteFreq * 2.76) * 0.08 * Math.exp(-t * 14);
        } else {
          sig += osc('sine', t * noteFreq * 0.5) * 0.14;
        }
        left[startSample + i] += sig * env * pan;
        right[startSample + i] += sig * env * (1 - pan);
      }
    }
  }

  return {
    left: filterLP(left, cfg.style === 'lofi' ? 2200 : 4800),
    right: filterLP(right, cfg.style === 'lofi' ? 2200 : 4800),
  };
}

/**
 * Mix Track SFX dengan Humanizer #4:
 * - J-Cut Audio Lead-In (4 frame lebih awal sebelum transisi gambar)
 * - 5 Varian SFX Ketikan (D9) & Klik Kursor (D1)
 */
function buildSfxTrackFromWords(words, durationSec, fps = 30, seed = 'sfx-mix') {
  const len = Math.floor(durationSec * SAMPLE_RATE);
  const left = new Float32Array(len);
  const right = new Float32Array(len);

  const u1Variants = [0, 1, 2, 3].map((v) => synthesizeSfxBuffer('U1', v, seed));
  const u2Variants = [0, 1, 2, 3].map((v) => synthesizeSfxBuffer('U2', v, seed));
  const d9Variants = [0, 1, 2, 3, 4].map((v) => synthesizeSfxBuffer('D9', v, seed));
  const d1Click = synthesizeSfxBuffer('D1', 0, seed);
  const u3Whoosh = synthesizeSfxBuffer('U3', 0, seed);
  const u5Impact = synthesizeSfxBuffer('U5', 0, seed);
  const u9Stinger = synthesizeSfxBuffer('U9', 0, seed);

  function placeSound(buf, timeSec, gain = 0.5, pan = 0.5) {
    const startIdx = Math.max(0, Math.floor(timeSec * SAMPLE_RATE));
    for (let i = 0; i < buf.length && startIdx + i < len; i++) {
      left[startIdx + i] += buf[i] * gain * (1 - pan * 0.4);
      right[startIdx + i] += buf[i] * gain * (0.6 + pan * 0.4);
    }
  }

  // Opening hit di awal video
  placeSound(u5Impact, 0.04, 0.6, 0.5);

  // Cue kata dari words.json (dengan 2-frame lead-in)
  words.forEach((w, idx) => {
    const tSec = Math.max(0, w.startMs / 1000 - 2 / fps);
    if (w.role === 'keyword' || idx % 4 === 0) {
      placeSound(u2Variants[idx % u2Variants.length], tSec, 0.38, (idx % 3) * 0.3);
    } else if (idx % 2 === 0) {
      placeSound(u1Variants[idx % u1Variants.length], tSec, 0.16, 0.5);
    }
  });

  // Simulasi ketikan halus (D9) di awal scene 1 & 2 + klik kursor (D1)
  for (let k = 0; k < 10; k++) {
    placeSound(d9Variants[k % d9Variants.length], 1.1 + k * 0.14, 0.22, 0.45);
  }
  if (durationSec >= 6) {
    placeSound(d1Click, 5.4, 0.52, 0.6); // Klik kursor
  }

  // J-Cut Transition Whoosh: mulai 4 frame (4/fps detik) sebelum pergantian scene
  const jCutLeadSec = 4 / fps;
  for (let s = 3.2; s < durationSec - 1.5; s += 3.2) {
    placeSound(u3Whoosh, Math.max(0, s - jCutLeadSec), 0.52, 0.42);
  }

  // Stinger penutup
  if (durationSec > 2.5) {
    placeSound(u9Stinger, durationSec - 1.5, 0.58, 0.5);
  }

  return { left, right };
}

function parseArgs(argv) {
  const args = {
    bgm: 'B09',
    sfxPack: 'S-DIGITAL',
    duration: 15,
    fps: 30,
    outDir: 'public/audio',
    wordsFile: 'public/words.json',
    seed: 'antislop-2026',
  };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--bgm' && v) args.bgm = v.toUpperCase();
    if (k === '--sfx' && v) args.sfxPack = v.toUpperCase();
    if (k === '--duration' && v) args.duration = Number(v);
    if (k === '--fps' && v) args.fps = Number(v);
    if (k === '--out' && v) args.outDir = v;
    if (k === '--words' && v) args.wordsFile = v;
    if (k === '--seed' && v) args.seed = v;
  }
  return args;
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('synth-audio.mjs')) {
  const opts = parseArgs(process.argv);
  const outPath = path.resolve(process.cwd(), opts.outDir);

  let words = [];
  const resolvedWords = path.resolve(process.cwd(), opts.wordsFile);
  if (fs.existsSync(resolvedWords)) {
    try {
      words = JSON.parse(fs.readFileSync(resolvedWords, 'utf8'));
    } catch {
      words = [];
    }
  }

  console.log(`[synth-audio] Generating deterministic 48kHz stereo audio (with J-Cut Lead-In & Key/Click SFX) in ${outPath}...`);
  const bed = synthesizeRoomToneBed(opts.duration, opts.seed);
  writeStereoWav(path.join(outPath, 'bed.wav'), bed.left, bed.right);

  const music = synthesizeBgmTrack(opts.bgm, opts.duration, opts.seed);
  writeStereoWav(path.join(outPath, 'music.wav'), music.left, music.right);

  const sfxMix = buildSfxTrackFromWords(words, opts.duration, opts.fps, opts.seed);
  writeStereoWav(path.join(outPath, 'sfx-track.wav'), sfxMix.left, sfxMix.right);

  const individualCodes = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'D1', 'D9'];
  for (const code of individualCodes) {
    const mono = synthesizeSfxBuffer(code, 0, opts.seed);
    writeStereoWav(path.join(outPath, 'sfx', `${code.toLowerCase()}.wav`), mono, mono);
  }

  console.log(`[synth-audio] Done! Created bed.wav, music.wav (${opts.bgm}), sfx-track.wav, and 12 individual SFX files.`);
}
