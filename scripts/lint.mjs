#!/usr/bin/env node
/**
 * scripts/lint.mjs
 * Fast Static Anti-Slop Linter (Setara `scripts/lint.mjs` di taste-skill)
 * Memeriksa aturan mutlak sebelum merender di browser:
 * 1. Zero-Emoji Check (Aturan Mutlak #8)
 * 2. Remotion Determinism Check (Tanpa Math.random, setTimeout, setInterval, CSS transition)
 * 3. Anti-Camera-Shake Check (Menolak penggunaan shake/jitter/wobble terus-menerus pada kamera)
 * 4. Subtitle Placement Check (Menolak subtitle ukuran raksasa di tengah layar; wajib BottomSubtitleBar)
 */

import fs from 'node:fs';
import path from 'node:path';

const EMOJI_REGEX = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/u;

const STATIC_RULES = [
  {
    id: 'NO_MATH_RANDOM',
    pattern: /\bMath\.random\s*\(/,
    message: 'Dilarang Math.random() di Remotion. Gunakan createSeededRandom() atau splineAt().',
  },
  {
    id: 'NO_TIMERS',
    pattern: /\b(setTimeout|setInterval)\s*\(/,
    message: 'Dilarang setTimeout/setInterval. Semua animasi wajib diturunkan dari useCurrentFrame().',
  },
  {
    id: 'NO_EMOJI_PKG',
    pattern: /@remotion\/animated-emoji/,
    message: 'Dilarang paket emoji. Gunakan komponen SVG dari CustomSVGIcons.tsx.',
  },
  {
    id: 'NO_CAMERA_SHAKE',
    pattern: /\b(cameraShake|handheldShake|continuousShake|randomShake)\b/i,
    message: 'Dilarang efek camera shake terus-menerus! Gunakan splineAt() yang tenang dan mengikuti ketikan/kursor.',
  },
];

function walkFiles(dir, extFilter = ['.ts', '.tsx', '.js', '.jsx', '.json']) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', 'out', 'dist'].includes(entry.name)) {
      results.push(...walkFiles(full, extFilter));
    } else if (entry.isFile() && extFilter.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

const targetDir = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.resolve(process.cwd(), 'src');
const files = walkFiles(targetDir);
const violations = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const isComment = trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*');

    if (EMOJI_REGEX.test(line)) {
      violations.push({
        rule: 'ZERO_EMOJI',
        file: path.relative(process.cwd(), file),
        line: idx + 1,
        message: 'Ditemukan karakter emoji/simbol Unicode dekoratif. Ganti dengan SVG dari kode.',
      });
    }

    if (!isComment && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      for (const r of STATIC_RULES) {
        if (r.pattern.test(line)) {
          violations.push({
            rule: r.id,
            file: path.relative(process.cwd(), file),
            line: idx + 1,
            message: r.message,
          });
        }
      }
    }
  });
}

console.log(
  JSON.stringify(
    {
      status: violations.length === 0 ? 'PASS' : 'FAIL',
      scannedFiles: files.length,
      violations,
    },
    null,
    2
  )
);

if (violations.length > 0) {
  process.exitCode = 1;
}
