#!/usr/bin/env node
/**
 * scripts/synth-audio.mjs
 * Deterministic Procedural Audio & Event-Driven SFX Synthesizer (48,000 Hz, 16-bit Stereo WAV)
 *
 * ATURAN MUTLAK SFX:
 * - DILARANG membunyikan SFX acak pada setiap kata subtitle (words.json) atau timer buta!
 * - SFX hanya berbunyi tepat pada event animasi nyata:
 *   1. `sfx/typing-loop.wav`  (D9: Rangkaian ketikan mekanis realistis saat <TypeText /> mengetik)
 *   2. `sfx/progress-loop.wav`(D3+D6: Tick progres naik + chime selesai saat <AnimatedProgressBar /> berjalan)
 *   3. `sfx/d1.wav`           (D1: Klik mouse presisi saat <AnimatedCursor /> mengklik tombol)
 *   4. `sfx/u2.wav`           (U2: Pop halus saat window/card utama muncul)
 *   5. `sfx/u3.wav`           (U3: Whoosh halus saat <SeamlessSceneShell /> berpindah scene)
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

  // D9: Mechanical Keyboard Keypress (24ms tactile switch click + warm thock)
  if (code === 'D9') {
    const dur = 0.026;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const switchClick = (rand() * 2 - 1) * Math.exp(-t * 280) * 0.55;
      const bodyThock = osc('sine', t * 440 * pitchShift) * Math.exp(-t * 130) * 0.6;
      const capTap = osc('triangle', t * 1850 * pitchShift) * Math.exp(-t * 340) * 0.35;
      buf[i] = (switchClick + bodyThock + capTap) * 0.58;
    }
    return filterLP(buf, 3800);
  }

  // D1: Mouse Click (double transient press + release)
  if (code === 'D1') {
    const dur = 0.048;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const press = t < 0.014 ? osc('triangle', t * 1500 * pitchShift) * Math.exp(-t * 300) : 0;
      const rel =
        t >= 0.024
          ? osc('triangle', (t - 0.024) * 1920 * pitchShift) * Math.exp(-(t - 0.024) * 360) * 0.65
          : 0;
      buf[i] = (press + rel) * 0.65;
    }
    return buf;
  }

  // D3: Counter / Progress Tick (18ms crisp rising tick)
  if (code === 'D3') {
    const dur = 0.02;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    const freq = 950 * pitchShift;
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * 190);
      buf[i] = (osc('triangle', t * freq) * 0.7 + osc('sine', t * freq * 2) * 0.3) * env * 0.48;
    }
    return buf;
  }

  // D2: Completion Chime (soft 2-note harmonic ping when progress reaches 100%)
  if (code === 'D2') {
    const dur = 0.38;
    const len = Math.floor(dur * SAMPLE_RATE);
    const buf = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * 8.5);
      const n1 = osc('sine', t * 880) * 0.45;
      const n2 = t >= 0.045 ? osc('sine', (t - 0.045) * 1318.5) * 0.45 : 0;
      buf[i] = (n1 + n2) * env * 0.55;
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

/**
 * Sintesis Track Ketikan Realistis (`sfx/typing-loop.wav`, durasi 8 detik)
 * Diputar otomatis oleh komponen <TypeText /> hanya selama teks sedang diketik!
 */
function synthesizeTypingLoopTrack(durationSec = 8, seed = 'typing-loop') {
  const rand = mulberry32(seed);
  const len = Math.floor(durationSec * SAMPLE_RATE);
  const left = new Float32Array(len);
  const right = new Float32Array(len);
  const keyVariants = [0, 1, 2, 3, 4].map((v) => synthesizeSfxBuffer('D9', v, seed));

  let tSec = 0.01;
  let idx = 0;
  while (tSec < durationSec - 0.05) {
    const kv = keyVariants[idx % keyVariants.length];
    const startSample = Math.floor(tSec * SAMPLE_RATE);
    const gain = 0.55 + rand() * 0.25;
    const pan = 0.42 + rand() * 0.16;
    for (let i = 0; i < kv.length && startSample + i < len; i++) {
      left[startSample + i] += kv[i] * gain * (1 - pan * 0.3);
      right[startSample + i] += kv[i] * gain * (0.7 + pan * 0.3);
    }
    // Cadence ketik manusiawi (55ms - 115ms antar tombol)
    tSec += 0.055 + rand() * 0.055 + (idx % 6 === 5 ? 0.045 : 0);
    idx++;
  }
  return { left, right };
}

/**
 * Sintesis Track Loading / Progress Bar (`sfx/progress-loop.wav`, durasi 5 detik)
 * Diputar otomatis oleh komponen <AnimatedProgressBar /> selama progress berjalan dari 0% -> 100%!
 */
function synthesizeProgressLoopTrack(durationSec = 5, seed = 'progress-loop') {
  const len = Math.floor(durationSec * SAMPLE_RATE);
  const left = new Float32Array(len);
  const right = new Float32Array(len);

  let tSec = 0.02;
  let step = 0;
  while (tSec < durationSec - 0.05) {
    const progressRatio = tSec / durationSec;
    // Pitch tick naik bertahap seiring persentase loading mendekati 100%
    const tick = synthesizeSfxBuffer('D3', Math.floor(progressRatio * 8), `${seed}-${step}`);
    const startSample = Math.floor(tSec * SAMPLE_RATE);
    for (let i = 0; i < tick.length && startSample + i < len; i++) {
      left[startSample + i] += tick[i] * 0.55;
      right[startSample + i] += tick[i] * 0.55;
    }
    tSec += 0.075;
    step++;
  }
  return { left, right };
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
 * Mix Track SFX HANYA dari event animasi eksplisit (`cues.json` atau `scenes-plan.json`),
 * BUKAN dari kata-kata subtitle `words.json` dan BUKAN dari timer buta!
 * Karena komponen <TypeText />, <AnimatedProgressBar />, <AnimatedCursor />, dan <SeamlessSceneShell />
 * sudah memutar SFX mereka sendiri secara otomatis tepat di frame animasinya!
 */
function buildEventDrivenSfxTrack(cues = [], durationSec = 15, fps = 30, seed = 'sfx-mix') {
  const len = Math.floor(durationSec * SAMPLE_RATE);
  const left = new Float32Array(len);
  const right = new Float32Array(len);

  function placeSound(buf, timeSec, gain = 0.5, pan = 0.5) {
    const startIdx = Math.max(0, Math.floor(timeSec * SAMPLE_RATE));
    for (let i = 0; i < buf.length && startIdx + i < len; i++) {
      left[startIdx + i] += buf[i] * gain * (1 - pan * 0.4);
      right[startIdx + i] += buf[i] * gain * (0.6 + pan * 0.4);
    }
  }

  for (const cue of cues) {
    const tSec = Math.max(0, (cue.frame ?? 0) / fps);
    if (cue.type === 'transition') {
      placeSound(synthesizeSfxBuffer('U3', 0, seed), Math.max(0, tSec - 3 / fps), 0.45, 0.5);
    } else if (cue.type === 'click') {
      placeSound(synthesizeSfxBuffer('D1', 0, seed), tSec, 0.55, 0.5);
    } else if (cue.type === 'pop') {
      placeSound(synthesizeSfxBuffer('U2', 0, seed), tSec, 0.42, 0.5);
    } else if (cue.type === 'complete') {
      placeSound(synthesizeSfxBuffer('D2', 0, seed), tSec, 0.5, 0.5);
    }
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
    cuesFile: 'public/sfx-cues.json',
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
    if (k === '--cues' && v) args.cuesFile = v;
    if (k === '--seed' && v) args.seed = v;
  }
  return args;
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('synth-audio.mjs')) {
  const opts = parseArgs(process.argv);
  const outPath = path.resolve(process.cwd(), opts.outDir);

  let cues = [];
  const resolvedCues = path.resolve(process.cwd(), opts.cuesFile);
  if (fs.existsSync(resolvedCues)) {
    try {
      cues = JSON.parse(fs.readFileSync(resolvedCues, 'utf8'));
    } catch {
      cues = [];
    }
  }

  console.log(`[synth-audio] Generating deterministic 48kHz stereo audio & event-synced SFX in ${outPath}...`);
  const bed = synthesizeRoomToneBed(opts.duration, opts.seed);
  writeStereoWav(path.join(outPath, 'bed.wav'), bed.left, bed.right);

  const music = synthesizeBgmTrack(opts.bgm, opts.duration, opts.seed);
  writeStereoWav(path.join(outPath, 'music.wav'), music.left, music.right);

  const sfxMix = buildEventDrivenSfxTrack(cues, opts.duration, opts.fps, opts.seed);
  writeStereoWav(path.join(outPath, 'sfx-track.wav'), sfxMix.left, sfxMix.right);

  // Buat track loop khusus untuk <TypeText /> dan <AnimatedProgressBar />
  const typingLoop = synthesizeTypingLoopTrack(8, opts.seed);
  writeStereoWav(path.join(outPath, 'sfx', 'typing-loop.wav'), typingLoop.left, typingLoop.right);

  const progressLoop = synthesizeProgressLoopTrack(5, opts.seed);
  writeStereoWav(path.join(outPath, 'sfx', 'progress-loop.wav'), progressLoop.left, progressLoop.right);

  // Buat file SFX individual untuk event spesifik (D1 click, D2 chime, D3 tick, D9 key, U1-U10)
  const individualCodes = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'D1', 'D2', 'D3', 'D9'];
  for (const code of individualCodes) {
    const mono = synthesizeSfxBuffer(code, 0, opts.seed);
    writeStereoWav(path.join(outPath, 'sfx', `${code.toLowerCase()}.wav`), mono, mono);
  }

  console.log(`[synth-audio] Done! Created bed.wav, music.wav (${opts.bgm}), typing-loop.wav, progress-loop.wav, and 14 event SFX files.`);
}
