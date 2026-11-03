import React, { useMemo } from 'react';
import { interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeOutExpo } from '../theme/easing-and-timing';
import { MotionStylePreset } from '../theme/styles-catalog';

export type WordHierarchyRole = 'keyword' | 'support' | 'connector';

export interface WordItem {
  text: string;
  startMs: number;
  endMs: number;
  role?: WordHierarchyRole;
  effect?: string;
}

/**
 * 1. BOTTOM SUBTITLE BAR (<BottomSubtitleBar />) — WAJIB UNTUK SUBTITLE NARASI!
 * - Diletakkan rapi di bagian bawah layar (screen-space, tidak menutupi konten utama di tengah!)
 * - Ukuran font proporsional (22px - 28px), bersih, dengan highlight halus pada kata yang sedang diucapkan.
 */
export interface BottomSubtitleBarProps {
  words: WordItem[];
  stylePreset: MotionStylePreset;
  sceneStartOffsetMs?: number;
  fontSize?: number;
  bottomOffset?: number;
  maxWordsPerLine?: number;
}

export const BottomSubtitleBar: React.FC<BottomSubtitleBarProps> = ({
  words,
  stylePreset,
  sceneStartOffsetMs = 0,
  fontSize = 25,
  bottomOffset = 38,
  maxWordsPerLine = 7,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000 + sceneStartOffsetMs;

  if (!words || words.length === 0) return null;

  const chunks: WordItem[][] = [];
  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    chunks.push(words.slice(i, i + maxWordsPerLine));
  }

  const activeChunk = chunks.find((c, idx) => {
    const start = c[0].startMs - 150;
    const end = chunks[idx + 1] ? chunks[idx + 1][0].startMs - 20 : c[c.length - 1].endMs + 450;
    return currentMs >= start && currentMs <= end;
  });

  if (!activeChunk || activeChunk.length === 0) return null;

  const chunkStartMs = activeChunk[0].startMs;
  const chunkEndMs = activeChunk[activeChunk.length - 1].endMs + 400;
  const enterT = clamp((currentMs - (chunkStartMs - 120)) / 160, 0, 1);
  const exitT = clamp((chunkEndMs - currentMs) / 160, 0, 1);
  const barOpacity = Math.min(enterT, exitT);
  const slideY = (1 - easeOutExpo(enterT)) * 12;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: bottomOffset,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 95,
        opacity: barOpacity,
        transform: `translate3d(0, ${slideY.toFixed(1)}px, 0)`,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px 9px',
          padding: '10px 24px',
          borderRadius: 999,
          backgroundColor: 'rgba(14, 15, 18, 0.82)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.22)',
          maxWidth: '82%',
        }}
      >
        {activeChunk.map((w, idx) => {
          const isSpoken = currentMs >= w.startMs - 40 && currentMs <= w.endMs + 90;
          const hasPassed = currentMs > w.endMs + 90;
          const isKeyword = w.role === 'keyword';

          return (
            <span
              key={`${w.text}-${w.startMs}-${idx}`}
              style={{
                display: 'inline-block',
                fontFamily: stylePreset.typography.body,
                fontSize,
                fontWeight: isSpoken || isKeyword ? 700 : 500,
                color: isSpoken
                  ? stylePreset.palette.accent
                  : hasPassed
                  ? '#FFFFFF'
                  : 'rgba(255, 255, 255, 0.62)',
                transform: isSpoken ? 'scale(1.05)' : 'scale(1)',
                padding: isSpoken && isKeyword ? '1px 8px' : '0px',
                borderRadius: 6,
                backgroundColor:
                  isSpoken && isKeyword ? `${stylePreset.palette.accent}24` : 'transparent',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 2. HUMANIZED TYPE TEXT (<TypeText />) — Humanizer #1A
 * Fitur Humanizer:
 * - `humanizeCadence` (default: true): Kecepatan mengetik tidak kaku seperti robot;
 *   ada micro-pause alami setelah spasi/tanda baca dan akselerasi di tengah kata.
 * - `typoCorrection` (opsional): Mengetik beberapa huruf salah (misal 2 huruf), jeda 3 frame,
 *   menghapus dengan backspace cepat, lalu lanjut mengetik teks yang benar!
 */
export interface TypoCorrectionConfig {
  /** Indeks karakter tempat salah ketik terjadi (misal: setelah karakter ke-6) */
  atCharIndex: number;
  /** Karakter salah yang sempat diketik sebelum dihapus (misal: "xqz") */
  wrongText: string;
}

export const TypeText: React.FC<{
  text: string;
  start: number;
  cps?: number;
  size: number;
  color: string;
  newestColor?: string;
  weight?: number;
  family?: string;
  style?: React.CSSProperties;
  cursor?: boolean;
  humanizeCadence?: boolean;
  typoCorrection?: TypoCorrectionConfig;
}> = ({
  text,
  start,
  cps = 1.45,
  size,
  color,
  newestColor = '#9E9EA6',
  weight = 500,
  family = 'Inter, sans-serif',
  style,
  cursor = true,
  humanizeCadence = true,
  typoCorrection,
}) => {
  const frame = useCurrentFrame();
  const chars = useMemo(() => text.split(''), [text]);

  // Hitung jadwal frame kemunculan tiap karakter dengan cadence manusiawi
  const charSchedule = useMemo(() => {
    const frames: number[] = [];
    let t = start;
    const baseStep = 1 / Math.max(0.2, cps);

    for (let i = 0; i < chars.length; i++) {
      // Jika ada simulasi salah ketik + backspace pada indeks ini
      if (typoCorrection && i === typoCorrection.atCharIndex) {
        const wrongLen = typoCorrection.wrongText.length;
        // Waktu mengetik huruf salah + jeda sadar salah (3.5f) + waktu backspace (wrongLen * 0.55f)
        t += wrongLen * baseStep * 0.85 + 3.5 + wrongLen * 0.55;
      }

      frames.push(t);

      if (!humanizeCadence) {
        t += baseStep;
      } else {
        const ch = chars[i];
        // Jeda mikro setelah spasi atau tanda baca, lebih cepat di tengah kata
        const cadenceMult =
          ch === ' '
            ? 1.38
            : /[.,!?;:-]/.test(ch)
            ? 1.75
            : 0.78 + 0.32 * Math.abs(Math.sin(i * 1.9 + 0.5));
        t += baseStep * cadenceMult;
      }
    }
    return frames;
  }, [chars, start, cps, humanizeCadence, typoCorrection]);

  // Cek apakah frame saat ini sedang berada di fase salah ketik (sebelum selesai backspace)
  let displayedChars: { ch: string; startFrame: number }[] = [];
  const baseStep = 1 / Math.max(0.2, cps);

  if (
    typoCorrection &&
    typoCorrection.atCharIndex > 0 &&
    typoCorrection.atCharIndex < chars.length
  ) {
    const idx = typoCorrection.atCharIndex;
    const prefixEndFrame = charSchedule[idx - 1] + baseStep;
    const resumeFrame = charSchedule[idx];

    if (frame >= prefixEndFrame && frame < resumeFrame) {
      // Sedang mengetik huruf salah lalu menghapusnya
      const prefix = chars.slice(0, idx).map((c, i) => ({ ch: c, startFrame: charSchedule[i] }));
      const wrongChars = typoCorrection.wrongText.split('');
      const typeWrongDur = wrongChars.length * baseStep * 0.85;
      const pauseEnd = prefixEndFrame + typeWrongDur + 3.5;

      let activeWrongCount = 0;
      if (frame <= pauseEnd) {
        activeWrongCount = clamp(
          Math.ceil((frame - prefixEndFrame) / (baseStep * 0.85)),
          0,
          wrongChars.length
        );
      } else {
        const backProgress = (frame - pauseEnd) / Math.max(1, resumeFrame - pauseEnd);
        activeWrongCount = clamp(
          Math.round(wrongChars.length * (1 - backProgress)),
          0,
          wrongChars.length
        );
      }

      displayedChars = [
        ...prefix,
        ...wrongChars.slice(0, activeWrongCount).map((wc, wi) => ({
          ch: wc,
          startFrame: prefixEndFrame + wi * baseStep * 0.85,
        })),
      ];
    }
  }

  if (displayedChars.length === 0) {
    displayedChars = chars
      .map((ch, i) => ({ ch, startFrame: charSchedule[i] }))
      .filter((item) => frame >= item.startFrame);
  }

  const lastScheduledFrame = charSchedule[charSchedule.length - 1] ?? start;

  return (
    <div
      style={{
        fontSize: size,
        fontWeight: weight,
        fontFamily: family,
        whiteSpace: 'pre-wrap',
        lineHeight: 1.15,
        ...style,
      }}
    >
      {displayedChars.map((item, i) => {
        const age = frame - item.startFrame;
        const appearT = clamp(age / 3.5, 0, 1);
        const e = easeOutExpo(appearT);
        const colT = clamp(age / 6.5, 0, 1);
        const col = interpolateColors(colT, [0, 1], [newestColor, color]);
        const dy = (1 - e) * 6;
        const sc = 0.88 + 0.12 * e;
        return (
          <span
            key={`${i}-${item.ch}`}
            style={{
              display: 'inline-block',
              color: col,
              opacity: clamp(age / 2.2, 0.15, 1),
              transform: `translate3d(0, ${dy.toFixed(2)}px, 0) scale(${sc.toFixed(3)})`,
              whiteSpace: 'pre',
            }}
          >
            {item.ch}
          </span>
        );
      })}
      {cursor && frame >= start - 2 && frame <= lastScheduledFrame + 18 ? (
        <span
          style={{
            color,
            fontWeight: 300,
            marginLeft: 2,
            opacity: 0.65 + 0.35 * Math.sin(frame * 0.45),
          }}
        >
          |
        </span>
      ) : null}
    </div>
  );
};

/**
 * 3. FLY TEXT (<FlyText />) — Per-Character Spring Fly-In
 */
export const FlyText: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  dur?: number;
  size: number;
  color: string;
  flyingColor?: string;
  weight?: number;
  family?: string;
  letterSpacing?: number;
  style?: React.CSSProperties;
  rotateSpread?: number;
  yOffset?: number;
  xOffset?: number;
}> = ({
  text,
  start,
  stagger = 2,
  dur = 12,
  size,
  color,
  flyingColor = '#8E8E93',
  weight = 700,
  family = 'Inter, sans-serif',
  letterSpacing = 0,
  style,
  rotateSpread = 7,
  yOffset = 42,
  xOffset = 16,
}) => {
  return (
    <div
      style={{
        display: 'inline-block',
        whiteSpace: 'pre-wrap',
        fontSize: size,
        fontWeight: weight,
        fontFamily: family,
        letterSpacing,
        lineHeight: 1.12,
        ...style,
      }}
    >
      {text.split('').map((ch, i) => (
        <FlyChar
          key={i}
          ch={ch}
          frameOffset={start + i * stagger}
          dur={dur}
          color={color}
          flyingColor={flyingColor}
          rotateSpread={rotateSpread}
          yOffset={yOffset}
          xOffset={xOffset}
          seed={i * 13 + 5}
        />
      ))}
    </div>
  );
};

const FlyChar: React.FC<{
  ch: string;
  frameOffset: number;
  dur: number;
  color: string;
  flyingColor: string;
  rotateSpread: number;
  yOffset: number;
  xOffset: number;
  seed: number;
}> = ({
  ch,
  frameOffset,
  dur,
  color,
  flyingColor,
  rotateSpread,
  yOffset,
  xOffset,
  seed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const raw = frame - frameOffset;
  if (raw <= -0.5) return <span style={{ opacity: 0 }}>{ch}</span>;

  const sp = spring({
    frame: Math.max(0, raw),
    fps,
    config: { damping: 14, stiffness: 155, mass: 0.65 },
    durationInFrames: Math.max(10, dur + 4),
  });

  const fade = clamp((raw + 0.5) / 3.5, 0, 1);
  const rem = 1 - sp;
  const r = Math.sin(seed) * rotateSpread * rem;
  const dy = yOffset * rem * (0.65 + 0.35 * Math.abs(Math.cos(seed)));
  const dx = xOffset * rem * Math.sign(Math.sin(seed * 1.7));
  const sc = 0.84 + 0.16 * sp;
  const colT = clamp(raw / (dur * 0.78), 0, 1);
  const col = interpolateColors(colT, [0, 1], [flyingColor, color]);

  return (
    <span
      style={{
        display: 'inline-block',
        opacity: fade,
        transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`,
        color: col,
        whiteSpace: 'pre',
      }}
    >
      {ch}
    </span>
  );
};

export const KineticWordStage = BottomSubtitleBar;
