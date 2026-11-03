import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { easeOutExpo, ip, microBob, staggeredSpringAt } from '../theme/easing-and-timing';
import { MotionStylePreset } from '../theme/styles-catalog';
import { FlyText, TypeText } from './KineticWords';

/**
 * Humanizer #6: LIVED-IN UI SHELLS
 * Mencegah AI membuat "kotak putih kosong" yang terlihat seperti wireframe murahan.
 * Menyediakan Chrome Shell lengkap dengan detail periferal dunia nyata (100% dari kode SVG, 0 Emoji):
 * 1. <ChatAppShell />       — Header avatar pill, back chevron, video icon, bubble tails, + button, input bar + mic
 * 2. <MacDesktopChrome />   — Top Menu Bar, Traffic-light Windows, Bottom Floating Dock SVG
 */

export interface ChatBubbleItem {
  text: string;
  isSender?: boolean;
  startFrame: number;
  hasTail?: boolean;
}

export interface ChatAppShellProps {
  contactName?: string;
  statusText?: string;
  bubbles: ChatBubbleItem[];
  inputTypedText?: string;
  inputTypeStartFrame?: number;
  headerRevealFrame?: number;
  stylePreset: MotionStylePreset;
}

export const ChatAppShell: React.FC<ChatAppShellProps> = ({
  contactName = 'studio.workspace',
  bubbles,
  inputTypedText = 'Deploy instant motion build...',
  inputTypeStartFrame = 36,
  headerRevealFrame = 62,
  stylePreset,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { palette, typography } = stylePreset;

  const headerT = ip(frame, [headerRevealFrame, headerRevealFrame + 14], [0, 1], easeOutExpo);
  const avatarSp = staggeredSpringAt(frame, headerRevealFrame, 1, fps);
  const inputSp = staggeredSpringAt(frame, 12, 0, fps);

  return (
    <div
      style={{
        position: 'absolute',
        left: 340,
        top: 76,
        width: 1240,
        height: 790,
        backgroundColor: palette.surface,
        borderRadius: 32,
        border: `2px solid ${palette.ink}1F`,
        boxShadow: '0 28px 75px rgba(0,0,0,0.14)',
        overflow: 'hidden',
      }}
    >
      {/* Top Bar Lengkap ala iMessage (Back Chevron + Avatar Pill + Video Call Icon) */}
      <div
        style={{
          position: 'relative',
          height: 92,
          padding: '0 36px',
          borderBottom: `1px solid ${palette.ink}14`,
          backgroundColor: `${palette.surface}F2`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: headerT,
          transform: `translate3d(0, ${((1 - headerT) * -22).toFixed(1)}px, 0)`,
          zIndex: 10,
        }}
      >
        {/* Back Chevron */}
        <svg width="28" height="32" viewBox="0 0 24 24">
          <path
            d="M15.5 4.5 8 12l7.5 7.5"
            stroke={palette.ink}
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Center Avatar + Contact Pill */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `scale(${(0.5 + 0.5 * avatarSp).toFixed(3)})`,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              backgroundColor: palette.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: typography.heading,
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            {contactName.slice(0, 2).toUpperCase()}
          </div>
          <div
            style={{
              marginTop: 4,
              padding: '2px 12px',
              borderRadius: 12,
              backgroundColor: `${palette.ink}0D`,
              fontFamily: typography.body,
              fontSize: 15,
              fontWeight: 600,
              color: palette.ink,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{contactName}</span>
            <svg width="11" height="11" viewBox="0 0 24 24">
              <path d="M9 5.5 15.5 12 9 18.5" stroke={palette.muted} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Right Video Call SVG */}
        <svg width="38" height="28" viewBox="0 0 32 24">
          <rect x="1" y="2" width="21" height="20" rx="5" stroke={palette.ink} strokeWidth="2.2" fill="none" />
          <path d="M22 9.5 30 5v14l-8-4.5z" stroke={palette.ink} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Area Gelembung Chat dengan Ekor SVG (Tail) */}
      <div style={{ padding: '38px 54px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {bubbles.map((b, idx) => {
          const sp = staggeredSpringAt(frame, b.startFrame, 0, fps);
          const appear = ip(frame, [b.startFrame - 2, b.startFrame + 3], [0, 1]);
          if (appear <= 0) return null;

          const bgCol = b.isSender ? palette.accent : '#E9E9EC';
          const txtCol = b.isSender ? '#FFFFFF' : '#101012';

          return (
            <div
              key={idx}
              style={{
                position: 'relative',
                alignSelf: b.isSender ? 'flex-end' : 'flex-start',
                padding: '18px 30px',
                borderRadius: 999,
                backgroundColor: bgCol,
                opacity: appear,
                transform: `translate3d(0, ${((1 - sp) * 26).toFixed(1)}px, 0) scale(${(0.62 + 0.38 * sp).toFixed(3)})`,
                transformOrigin: b.isSender ? '100% 100%' : '0% 100%',
              }}
            >
              <FlyText
                text={b.text}
                start={b.startFrame}
                stagger={1.5}
                dur={10}
                size={27}
                weight={600}
                family={typography.body}
                color={txtCol}
                yOffset={26}
                xOffset={10}
                rotateSpread={4}
              />
              {b.hasTail && <BubbleTail color={bgCol} side={b.isSender ? 'br' : 'bl'} />}
            </div>
          );
        })}
      </div>

      {/* Input Bar Bawah Lengkap (+ Button, Rounded Input Pill, Mic SVG) */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          right: 34,
          bottom: 24,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transform: `translate3d(0, ${((1 - inputSp) * 32).toFixed(1)}px, 0)`,
          opacity: inputSp,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 999,
            backgroundColor: palette.bg,
            border: `1.5px solid ${palette.ink}1F`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            color: palette.ink,
            fontWeight: 300,
          }}
        >
          +
        </div>

        <div
          style={{
            flex: 1,
            height: 54,
            borderRadius: 999,
            backgroundColor: palette.bg,
            border: `1.5px solid ${palette.ink}22`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <TypeText
            text={inputTypedText}
            start={inputTypeStartFrame}
            cps={1.6}
            size={21}
            color={palette.ink}
            family={typography.body}
            humanizeCadence
            cursor
          />
          <svg width="20" height="24" viewBox="0 0 24 24">
            <path
              d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-4 4.9V19h2v2H9v-2h2v-2.1A5 5 0 0 1 7 12h2a3 3 0 0 0 6 0h2z"
              fill={palette.muted}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const BubbleTail: React.FC<{ color: string; side: 'bl' | 'br' }> = ({ color, side }) => (
  <svg
    width="22"
    height="26"
    viewBox="0 0 28 34"
    style={{
      position: 'absolute',
      bottom: -2,
      [side === 'bl' ? 'left' : 'right']: -6,
      transform: side === 'bl' ? 'scaleX(-1)' : undefined,
    }}
  >
    <path d="M0 0 C2 14 10 26 26 32 C12 34 2 30 0 22 Z" fill={color} />
  </svg>
);

/**
 * 2. MAC DESKTOP & WINDOW SHELL (<MacDesktopChrome />)
 * Menu Bar atas + Floating Dock bawah + Traffic-light window.
 */
export const MacDesktopChrome: React.FC<{
  appName?: string;
  clockText?: string;
  stylePreset: MotionStylePreset;
  children: React.ReactNode;
}> = ({ appName = 'Studio', clockText = 'Sat 03:40 PM', stylePreset, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { palette, typography } = stylePreset;

  const dockSp = staggeredSpringAt(frame, 4, 1, fps);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {children}

      {/* Screen-Fixed macOS Top Menu Bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 34,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          fontFamily: typography.body,
          fontSize: 14,
          color: '#1A1A1A',
          zIndex: 85,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 999, backgroundColor: palette.accent }} />
          <b style={{ fontWeight: 700 }}>{appName}</b>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Window</span>
          <span>Help</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: typography.mono, fontSize: 13 }}>
          <span>WIFI</span>
          <span>100%</span>
          <span style={{ fontWeight: 700 }}>{clockText}</span>
        </div>
      </div>

      {/* Screen-Fixed Bottom Floating Dock dengan Phase-Shifted Micro-Bobbing */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 104,
          transform: `translate3d(-50%, ${((1 - dockSp) * 45).toFixed(1)}px, 0)`,
          opacity: dockSp,
          height: 58,
          padding: '0 16px',
          borderRadius: 20,
          backgroundColor: 'rgba(244,244,248,0.78)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.16)',
          border: '1px solid rgba(255,255,255,0.55)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 85,
        }}
      >
        {['#3E9CF3', '#FF5F57', '#28C840', '#FEBC2E', '#5856D6', '#00B8A9'].map((col, idx) => {
          const { dy } = microBob(frame, idx, 2.2, 0.2);
          return (
            <div
              key={idx}
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                backgroundColor: col,
                transform: `translateY(${dy.toFixed(1)}px)`,
                boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
