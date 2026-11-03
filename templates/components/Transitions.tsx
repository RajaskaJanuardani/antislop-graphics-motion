import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeInOutSmooth, easeOutExpo, ip, splineAt } from '../theme/easing-and-timing';
import { MotionStylePreset } from '../theme/styles-catalog';

export type SeamlessTransitionMode =
  | 'whip-glide-left'
  | 'whip-glide-up'
  | 'portal-zoom-in'
  | 'spring-sheet-up'
  | 'match-cut';

export interface SeamlessSceneShellProps {
  /** Frame global mulai dan berakhirnya scene */
  startFrame: number;
  endFrame: number;
  /** Mode masuk dari scene sebelumnya (overlap 10 frame) */
  enterMode?: SeamlessTransitionMode | 'none';
  /** Mode keluar menuju scene berikutnya (overlap 10 frame) */
  exitMode?: SeamlessTransitionMode | 'none';
  /** Durasi overlap transisi dalam frame (default 10 frame) */
  overlapFrames?: number;
  background?: string;
  children: React.ReactNode;
}

/**
 * Pembungkus Scene Kontinuitas Mulus (<SeamlessSceneShell />)
 * - `whip-glide-left`: Scene A meluncur ke kiri (`-width`) bersamaan dengan Scene B yang masuk dari kanan (`+width`)
 *   menggunakan kurva `easeInOutSmooth` pada frame yang sama persis, sehingga terasa seperti 1 kanvas utuh!
 * - `portal-zoom-in`: Akhir Scene A melakukan zoom-in (`1.0 -> 1.85`) disertai soft radial glow,
 *   lalu Scene B langsung terbuka dari `scale: 1.14 -> 1.0` (`easeOutExpo`).
 * - `spring-sheet-up`: Konten baru meluncur naik dari bawah di atas latar yang menyambung mulus.
 */
export const SeamlessSceneShell: React.FC<SeamlessSceneShellProps> = ({
  startFrame,
  endFrame,
  enterMode = 'none',
  exitMode = 'none',
  overlapFrames = 10,
  background = '#FFFFFF',
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) return null;

  const enterEnd = startFrame + overlapFrames;
  const exitStart = endFrame - overlapFrames;

  let tx = 0;
  let ty = 0;
  let scale = 1;
  let opacity = 1;
  let radialGlow = 0;

  // 1. Transisi Masuk
  if (enterMode === 'whip-glide-left') {
    const t = 1 - ip(frame, [startFrame, enterEnd], [0, 1], easeInOutSmooth);
    tx += t * (width + 20);
  } else if (enterMode === 'whip-glide-up') {
    const t = 1 - ip(frame, [startFrame, enterEnd], [0, 1], easeInOutSmooth);
    ty += t * (height + 20);
  } else if (enterMode === 'portal-zoom-in') {
    scale *= ip(frame, [startFrame, enterEnd + 4], [1.16, 1.0], easeOutExpo);
    opacity *= ip(frame, [startFrame, startFrame + 5], [0, 1]);
  } else if (enterMode === 'spring-sheet-up') {
    const t = 1 - ip(frame, [startFrame, enterEnd + 6], [0, 1], easeOutExpo);
    ty += t * (height * 0.45);
    opacity *= ip(frame, [startFrame, startFrame + 4], [0, 1]);
  }

  // 2. Transisi Keluar
  if (exitMode === 'whip-glide-left') {
    const t = ip(frame, [exitStart, endFrame], [0, 1], easeInOutSmooth);
    tx -= t * (width + 20);
  } else if (exitMode === 'whip-glide-up') {
    const t = ip(frame, [exitStart, endFrame], [0, 1], easeInOutSmooth);
    ty -= t * (height + 20);
  } else if (exitMode === 'portal-zoom-in') {
    const z = ip(frame, [exitStart - 4, endFrame], [0, 0.85], Easing.inOut(Easing.cubic));
    scale += z;
    radialGlow = ip(frame, [exitStart - 2, endFrame], [0, 1]);
    opacity *= 1 - ip(frame, [endFrame - 4, endFrame], [0, 1]);
  }

  return (
    <AbsoluteFill
      style={{
        background,
        overflow: 'hidden',
        opacity,
        transform: `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`,
      }}
    >
      {children}

      {radialGlow > 0.01 && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.92) 100%)',
            opacity: radialGlow,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Komponen Shared-Element Match-Cut Morph (<SharedElementMorph />)
 * Menggerakkan satu objek (kartu, lingkaran avatar, atau judul) melintasi batas scene
 * menggunakan C1 spline `[frame, cx, cy, width, height, borderRadius, rotDeg]`.
 */
export interface SharedElementMorphProps {
  /** [frame, centerX, centerY, width, height, borderRadius, rotDeg?][] */
  keyframes: [number, number, number, number, number, number, number?][];
  startFrame?: number;
  endFrame?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const SharedElementMorph: React.FC<SharedElementMorphProps> = ({
  keyframes,
  startFrame = 0,
  endFrame = 99999,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame || keyframes.length === 0) return null;

  const normalized: [number, number, number, number, number, number, number][] = keyframes.map(
    (k) => [k[0], k[1], k[2], k[3], k[4], k[5], k[6] ?? 0]
  );

  const [cx, cy, w, h, br, rot] = splineAt(frame, normalized);

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        borderRadius: br,
        transform: `rotate(${rot.toFixed(2)}deg)`,
        overflow: 'hidden',
        zIndex: 50,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Kompatibilitas mundur untuk SceneTransitionOverlay (Halus & Tidak Kasar)
 */
export const SceneTransitionOverlay: React.FC<{
  type?: string;
  startFrame: number;
  durationInFrames?: number;
  stylePreset: MotionStylePreset;
}> = () => null;
