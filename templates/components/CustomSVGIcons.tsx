import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SPRING_PRESETS } from '../theme/easing-and-timing';

export type CustomIconName =
  | 'check-badge'
  | 'lightning-bolt'
  | 'terminal-prompt'
  | 'chart-rising'
  | 'layers-stack'
  | 'shield-guard'
  | 'cpu-node'
  | 'spark-four'
  | 'arrow-Editorial'
  | 'clock-precision'
  | 'globe-meridian'
  | 'target-crosshair';

export interface CustomSVGIconProps {
  name: CustomIconName;
  size?: number;
  color?: string;
  accentColor?: string;
  strokeWidth?: number;
  startFrame?: number;
}

/**
 * Perpustakaan Ikon Vektor SVG Murni dari Kode (Draw-On Path + Spring Scale)
 * 100% Patuh Aturan Mutlak #6 (Nol Emoji) & Aturan Mutlak #7 (Full dari Kode).
 */
export const CustomSVGIcon: React.FC<CustomSVGIconProps> = ({
  name,
  size = 64,
  color = '#0F110F',
  accentColor = '#FD5837',
  strokeWidth = 3.5,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  const progress = spring({
    frame: localFrame,
    fps,
    config: SPRING_PRESETS.editorialSettle,
    durationInFrames: 18,
  });

  const dashOffset = interpolate(progress, [0, 1], [320, 0]);
  const scale = interpolate(progress, [0, 1], [0.78, 1]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{
        transform: `scale(${scale.toFixed(3)})`,
        overflow: 'visible',
      }}
    >
      {name === 'check-badge' && (
        <>
          <rect
            x="8"
            y="8"
            width="48"
            height="48"
            rx="10"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="240"
            strokeDashoffset={dashOffset}
          />
          <path
            d="M 20 33 L 29 42 L 45 23"
            stroke={accentColor}
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="120"
            strokeDashoffset={dashOffset * 0.5}
          />
        </>
      )}

      {name === 'lightning-bolt' && (
        <path
          d="M 35 6 L 14 36 H 31 L 27 58 L 50 26 H 33 L 35 6 Z"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeDasharray="260"
          strokeDashoffset={dashOffset}
          fill={`${accentColor}22`}
        />
      )}

      {name === 'terminal-prompt' && (
        <>
          <rect
            x="6"
            y="10"
            width="52"
            height="44"
            rx="6"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="240"
            strokeDashoffset={dashOffset}
          />
          <path
            d="M 16 25 L 26 33 L 16 41"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="32"
            y1="41"
            x2="46"
            y2="41"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={localFrame % 16 < 10 ? 1 : 0.2}
          />
        </>
      )}

      {name === 'chart-rising' && (
        <>
          <line x1="8" y1="54" x2="56" y2="54" stroke={color} strokeWidth={strokeWidth} />
          <rect x="14" y={54 - 16 * progress} width="8" height={16 * progress} fill={color} />
          <rect x="28" y={54 - 28 * progress} width="8" height={28 * progress} fill={color} />
          <rect x="42" y={54 - 42 * progress} width="8" height={42 * progress} fill={accentColor} />
          <path
            d="M 14 34 L 30 22 L 48 10"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset={dashOffset * 0.4}
          />
        </>
      )}

      {name === 'layers-stack' && (
        <>
          <polygon
            points="32,10 56,22 32,34 8,22"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            fill={`${accentColor}22`}
            transform={`translate(0, ${(1 - progress) * -10})`}
          />
          <polyline
            points="8,32 32,44 56,32"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="8,42 32,54 56,42"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {name === 'shield-guard' && (
        <>
          <path
            d="M 32 7 L 52 15 V 31 C 52 44 43 53 32 58 C 21 53 12 44 12 31 V 15 L 32 7 Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="240"
            strokeDashoffset={dashOffset}
          />
          <circle cx="32" cy="31" r={7 * progress} fill={accentColor} />
        </>
      )}

      {name === 'cpu-node' && (
        <>
          <rect
            x="16"
            y="16"
            width="32"
            height="32"
            rx="4"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="200"
            strokeDashoffset={dashOffset}
          />
          <rect x="24" y="24" width="16" height="16" fill={accentColor} />
          {[22, 32, 42].map((p) => (
            <React.Fragment key={p}>
              <line x1={p} y1="6" x2={p} y2="16" stroke={color} strokeWidth={strokeWidth} />
              <line x1={p} y1="48" x2={p} y2="58" stroke={color} strokeWidth={strokeWidth} />
              <line x1="6" y1={p} x2="16" y2={p} stroke={color} strokeWidth={strokeWidth} />
              <line x1="48" y1={p} x2="58" y2={p} stroke={color} strokeWidth={strokeWidth} />
            </React.Fragment>
          ))}
        </>
      )}

      {name === 'spark-four' && (
        <path
          d="M 32 6 C 34 22 42 30 58 32 C 42 34 34 42 32 58 C 30 42 22 34 6 32 C 22 30 30 22 32 6 Z"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          fill={`${accentColor}33`}
          transform={`rotate(${(1 - progress) * 45} 32 32)`}
        />
      )}

      {name === 'arrow-Editorial' && (
        <>
          <line
            x1="10"
            y1="54"
            x2="52"
            y2="12"
            stroke={accentColor}
            strokeWidth={strokeWidth + 0.5}
            strokeDasharray="120"
            strokeDashoffset={dashOffset * 0.4}
          />
          <polyline
            points="24,12 52,12 52,40"
            stroke={color}
            strokeWidth={strokeWidth + 0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {name === 'clock-precision' && (
        <>
          <circle
            cx="32"
            cy="32"
            r="24"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="200"
            strokeDashoffset={dashOffset}
          />
          <line
            x1="32"
            y1="32"
            x2="32"
            y2="16"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            transform={`rotate(${localFrame * 6} 32 32)`}
          />
          <line
            x1="32"
            y1="32"
            x2="44"
            y2="32"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </>
      )}

      {name === 'globe-meridian' && (
        <>
          <circle cx="32" cy="32" r="24" stroke={color} strokeWidth={strokeWidth} />
          <ellipse cx="32" cy="32" rx="11" ry="24" stroke={accentColor} strokeWidth={strokeWidth - 0.5} />
          <line x1="8" y1="32" x2="56" y2="32" stroke={color} strokeWidth={strokeWidth - 0.5} />
        </>
      )}

      {name === 'target-crosshair' && (
        <>
          <circle cx="32" cy="32" r="20" stroke={color} strokeWidth={strokeWidth} />
          <circle cx="32" cy="32" r={6 * progress} fill={accentColor} />
          <line x1="32" y1="4" x2="32" y2="16" stroke={accentColor} strokeWidth={strokeWidth} />
          <line x1="32" y1="48" x2="32" y2="60" stroke={accentColor} strokeWidth={strokeWidth} />
          <line x1="4" y1="32" x2="16" y2="32" stroke={accentColor} strokeWidth={strokeWidth} />
          <line x1="48" y1="32" x2="60" y2="32" stroke={accentColor} strokeWidth={strokeWidth} />
        </>
      )}
    </svg>
  );
};
