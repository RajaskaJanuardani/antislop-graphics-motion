import React from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeInOutSmooth, easeOutExpo, ip, splineAt } from '../theme/easing-and-timing';
import { MotionStylePreset } from '../theme/styles-catalog';

export type SeamlessTransitionMode =
  | 'whip-glide-left'
  | 'whip-glide-up'
  | 'portal-zoom-in'
  | 'spring-sheet-up'
  | 'match-cut';

export interface SeamlessSceneShellProps {
  startFrame: number;
  endFrame: number;
  enterMode?: SeamlessTransitionMode | 'none';
  exitMode?: SeamlessTransitionMode | 'none';
  overlapFrames?: number;
  background?: string;
  /** Otomatis memutar J-Cut transition whoosh (`audio/sfx/u3.wav`) tepat saat keluar scene */
  enableTransitionSfx?: boolean;
  transitionSfxSrc?: string;
  children: React.ReactNode;
}

export const SeamlessSceneShell: React.FC<SeamlessSceneShellProps> = ({
  startFrame,
  endFrame,
  enterMode = 'none',
  exitMode = 'none',
  overlapFrames = 10,
  background = '#FFFFFF',
  enableTransitionSfx = true,
  transitionSfxSrc = 'audio/sfx/u3.wav',
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
    <>
      {/* J-Cut Transition Whoosh SFX: Hanya berbunyi tepat saat scene berpindah! */}
      {enableTransitionSfx && exitMode !== 'none' && (
        <Sequence from={Math.max(0, exitStart - 3)} durationInFrames={overlapFrames + 8}>
          <Audio src={staticFile(transitionSfxSrc)} volume={0.42} />
        </Sequence>
      )}

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
    </>
  );
};

export interface SharedElementMorphProps {
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

export const SceneTransitionOverlay: React.FC<{
  type?: string;
  startFrame: number;
  durationInFrames?: number;
  stylePreset: MotionStylePreset;
}> = () => null;
