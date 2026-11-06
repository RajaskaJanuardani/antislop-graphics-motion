#!/usr/bin/env node
/**
 * scripts/scaffold-remotion.mjs
 * Menyalin seluruh template siap pakai (theme, components, scenes) ke proyek Remotion
 * dan menyiapkan Style Bible, Scenes Plan, words.json, serta audio WAV deterministik dalam 1 langkah.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILL_ROOT = path.resolve(__dirname, '..');

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function parseArgs(argv) {
  const args = {
    targetDir: process.cwd(),
    brief: 'Video demo produk digital interaktif dengan kamera mengikuti ketikan dan kursor',
    styleId: null,
    text: 'Fokus utama adalah visual konten yang hidup. Kamera tenang mengikuti ketikan dan klik kursor, lalu berpindah scene secara halus.',
    duration: 12,
  };
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    const value = argv[++i];
    if (value === undefined) throw new Error(`Missing value for ${key}.`);
    switch (key) {
      case '--target': args.targetDir = path.resolve(value); break;
      case '--brief': args.brief = value; break;
      case '--style': args.styleId = Number(value); break;
      case '--text': args.text = value; break;
      case '--duration': args.duration = Number(value); break;
      default: throw new Error(`Unknown option: ${key}`);
    }
  }
  return args;
}

const opts = parseArgs(process.argv);
if (!Number.isFinite(opts.duration) || opts.duration <= 0) throw new Error('Duration must be positive.');
if (opts.styleId !== null && (!Number.isInteger(opts.styleId) || opts.styleId < 1 || opts.styleId > 43)) throw new Error('Style must be 1..43.');
const targetSrc = path.join(opts.targetDir, 'src', 'antislop');

console.log(`[scaffold-remotion] Copying ready-to-use templates to ${targetSrc}...`);
copyDirRecursive(path.join(SKILL_ROOT, 'templates'), targetSrc);

// Pass user text as argv, never through a shell.
function run(script, args, capture = false) {
  return execFileSync(process.execPath, [path.join(__dirname, script), ...args], {
    encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit',
  });
}
const styleArgs = ['--brief', opts.brief, '--out', path.join(opts.targetDir, 'research')];
if (opts.styleId) styleArgs.push('--style', String(opts.styleId));
const chosenMeta = JSON.parse(run('draw-style.mjs', styleArgs, true)).chosen;
run('scenes.mjs', ['--brief', opts.brief, '--duration', String(opts.duration), '--out', path.join(opts.targetDir, 'research')]);
run('narrator-sync.mjs', ['--text', opts.text, '--duration', String(opts.duration), '--out-words', path.join(opts.targetDir, 'public/words.json'), '--out-map', path.join(opts.targetDir, 'research/word-map.md')]);
run('synth-audio.mjs', ['--bgm', chosenMeta.bgm, '--duration', String(opts.duration), '--words', path.join(opts.targetDir, 'public/words.json'), '--out', path.join(opts.targetDir, 'public/audio')]);
console.log(`[scaffold-remotion] Ready: style #${chosenMeta.id} (${chosenMeta.name}); narration timings are estimates until aligned to audio.`);
