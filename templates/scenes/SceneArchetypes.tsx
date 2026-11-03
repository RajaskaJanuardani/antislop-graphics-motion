import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedCursor, useCursorTargetState } from '../components/AnimatedCursor';
import { CameraRig } from '../components/CameraRig';
import { CustomSVGIcon, CustomIconName } from '../components/CustomSVGIcons';
import { BottomSubtitleBar, FlyText, TypeText, WordItem } from '../components/KineticWords';
import { ChatAppShell, MacDesktopChrome } from '../components/LivedInUIShells';
import { ProceduralBackground } from '../components/ProceduralBackground';
import { easeOutExpo, ip, microBob, staggeredSpringAt } from '../theme/easing-and-timing';
import { MotionStylePreset } from '../theme/styles-catalog';

export interface BaseSceneProps {
  stylePreset: MotionStylePreset;
  durationInFrames: number;
  sceneIndex: number;
  totalScenes: number;
  words: WordItem[];
}

/**
 * SCENE 1: LIVED-IN CHAT & HUMANIZED TYPING ZOOM
 * - Konten Utama (Tengah): `<ChatAppShell />` lengkap dengan ekor bubble, tombol +, ikon mic, dan header avatar pill.
 * - Kamera (`splineAt`): Mulai dari zoom dekat mengikuti gelembung yang muncul, dilengkapi 3-frame anticipation
 *   dan velocity blur tipis saat melesat, lalu pull-out mulus ke 1.0x memperlihatkan seluruh aplikasi.
 * - Subtitle Narasi: Rapi di bawah layar (`BottomSubtitleBar`).
 */
export const SceneInteractiveTypingZoom: React.FC<
  BaseSceneProps & {
    headerTitle?: string;
    messages?: { text: string; isSender?: boolean; startFrame: number; hasTail?: boolean }[];
    inputPlaceholder?: string;
  }
> = ({
  stylePreset,
  durationInFrames,
  words,
  headerTitle = 'studio.workspace',
  messages = [
    { text: 'Deploy production build v2.4', isSender: true, startFrame: 4, hasTail: true },
    { text: 'Running zero-downtime checks...', startFrame: 30 },
    { text: 'All 48 edge nodes verified in 120ms', startFrame: 56, hasTail: true },
  ],
  inputPlaceholder = 'Deploy instant motion build...',
}) => {
  const { palette } = stylePreset;

  // Waypoint C1 Spline Kamera dengan 3-Frame Anticipation & Safe-Zone Clamping
  const camSpline: [number, number, number, number, number][] = [
    [0, 1.48, -420, -60, 0],
    [22, 1.48, -380, -70, 0],
    [34, 1.52, -180, -175, 0],
    [54, 1.52, -160, -260, 0],
    [68, 1.0, 0, 0, 0],
    [durationInFrames, 1.0, 0, 0, 0],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, overflow: 'hidden' }}>
      <ProceduralBackground stylePreset={stylePreset} driftSpeed={0.35} />

      <CameraRig
        waypoints={camSpline}
        durationInFrames={durationInFrames}
        stylePreset={stylePreset}
        transformOrigin="0px 0px"
        enableVelocityBlur
        enableRackFocusSpotlight
      >
        <ChatAppShell
          contactName={headerTitle}
          bubbles={messages}
          inputTypedText={inputPlaceholder}
          inputTypeStartFrame={38}
          headerRevealFrame={60}
          stylePreset={stylePreset}
        />
      </CameraRig>

      {/* Subtitle Penjelasan Narasi — Rapi di Bawah Layar */}
      <BottomSubtitleBar words={words} stylePreset={stylePreset} />
    </AbsoluteFill>
  );
};

/**
 * SCENE 2: HUMANIZED FITTS'S LAW CURSOR + TYPO BACKSPACE + CARD MORPH
 * - Ketikan (`<TypeText />`) memiliki cadence alami + simulasi salah ketik 2 huruf lalu backspace cepat (`typoCorrection`).
 * - Kursor (`<AnimatedCursor humanizeFittsLaw />`) mengalami micro-overshoot 4.5px, hover tenang 5 frame
 *   (tombol ikut membesar `useCursorTargetState`), lalu menekan klik!
 * - Kamera (`splineAt`) dilengkapi 3-frame pre-move anticipation & rack-focus spotlight.
 */
export const SceneCursorClickAndCaptionZoom: React.FC<
  BaseSceneProps & {
    cardHeadline?: string;
    cardSubheadline?: string;
    typedCaption?: string;
    actionButtonLabel?: string;
  }
> = ({
  stylePreset,
  durationInFrames,
  words,
  cardHeadline = 'ZERO LATENCY',
  cardSubheadline = 'GLOBAL EDGE ENGINE',
  typedCaption = 'Deploying instant preview to production...',
  actionButtonLabel = 'Publish',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { palette, typography } = stylePreset;

  // Outer Camera Spline dengan 3-frame anticipation pullback pada f31..34 sebelum zoom ke 1.42x
  const outerSpline: [number, number, number, number, number][] = [
    [0, 1.18, -160, -90, 0],
    [20, 1.0, 0, 0, 0],
    [31, 1.0, 0, 0, 0],
    [34, 0.982, 16, 10, 0], // 3-frame Pre-Move Anticipation Pullback!
    [50, 1.42, -320, 40, 0],
    [76, 1.42, -410, 40, 0],
    [durationInFrames, 1.0, 0, 0, 0],
  ];

  // Lintasan Kursor menuju tombol Publish (otomatis diberi Fitts's Law overshoot + 5f hover delay)
  const clickFrame = 72;
  const cursorWaypoints: [number, number, number][] = [
    [38, 920, 620],
    [54, 1180, 320],
    [clickFrame, 1385, 175],
    [90, 1385, 175],
  ];

  const { isHovered, isClicked, buttonScale } = useCursorTargetState(frame, clickFrame, 6);

  // Overlapping Action: kartu (layer 0), isi judul (layer 1), dan badge sudut (layer 2) tidak berhenti bersamaan
  const cardSp = staggeredSpringAt(frame, 2, 0, fps);
  const badgeSp = staggeredSpringAt(frame, 8, 2, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, overflow: 'hidden' }}>
      <ProceduralBackground stylePreset={stylePreset} driftSpeed={0.35} />

      <CameraRig
        waypoints={outerSpline}
        durationInFrames={durationInFrames}
        stylePreset={stylePreset}
        transformOrigin="0px 0px"
        enableVelocityBlur
        enableRackFocusSpotlight
      >
        {/* Top Caption & Publish Bar */}
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 130,
            width: 1160,
            height: 78,
            backgroundColor: palette.surface,
            borderRadius: 20,
            border: `2px solid ${palette.ink}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <CustomSVGIcon name="spark-four" size={34} color={palette.ink} accentColor={palette.accent} />
            <TypeText
              text={typedCaption}
              start={22}
              cps={1.65}
              size={25}
              weight={700}
              color={palette.ink}
              family={typography.body}
              humanizeCadence
              typoCorrection={{ atCharIndex: 10, wrongText: 'in' }}
              cursor={frame < clickFrame}
            />
          </div>

          <div
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              backgroundColor: isClicked
                ? palette.accentSecondary
                : isHovered
                ? palette.ink
                : palette.accent,
              color: '#FFFFFF',
              fontFamily: typography.heading,
              fontSize: 20,
              fontWeight: 700,
              transform: `scale(${buttonScale.toFixed(3)})`,
              boxShadow: isClicked
                ? `0 0 28px ${palette.accent}`
                : isHovered
                ? '0 6px 20px rgba(0,0,0,0.22)'
                : 'none',
            }}
          >
            {isClicked ? 'Published' : actionButtonLabel}
          </div>
        </div>

        {/* Kartu Visual Utama di Tengah dengan Lived-In Badges (+ALT & ⋮) */}
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 230 + (1 - cardSp) * 28,
            width: 1160,
            height: 640,
            backgroundColor: palette.surface,
            borderRadius: 28,
            border: `2px solid ${palette.ink}`,
            boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
            padding: 56,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <div>
            <FlyText
              text={cardSubheadline}
              start={4}
              stagger={1.4}
              size={24}
              weight={700}
              family={typography.mono}
              color={palette.accent}
            />
            <div style={{ marginTop: 12 }}>
              <FlyText
                text={cardHeadline}
                start={8}
                stagger={1.8}
                size={92}
                weight={900}
                family={typography.heading}
                color={palette.ink}
              />
            </div>
          </div>

          <svg width="100%" height="220" viewBox="0 0 1000 220" style={{ overflow: 'visible' }}>
            <path
              d="M 20 180 C 220 40, 380 200, 580 80 C 740 10, 860 150, 980 35"
              fill="none"
              stroke={palette.accent}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={1400}
              strokeDashoffset={1400 * (1 - ip(frame, [6, 48], [0, 1], easeOutExpo))}
            />
            {[180, 460, 740, 980].map((cx, i) => {
              const pop = staggeredSpringAt(frame, 14 + i * 7, 1, fps);
              const { dy } = microBob(frame, i, 3.2, 0.2);
              const cy = [110, 125, 68, 35][i] + dy;
              return (
                <g key={i} transform={`translate(${cx}, ${cy.toFixed(1)}) scale(${pop.toFixed(3)})`}>
                  <circle r="14" fill={palette.surface} stroke={palette.ink} strokeWidth="4" />
                  <circle r="6" fill={palette.accent} />
                </g>
              );
            })}
          </svg>

          {/* Lived-in Corner Badges (+ALT & Menu) dengan Follow-Through Inertia */}
          <div
            style={{
              position: 'absolute',
              right: 28,
              bottom: 22,
              display: 'flex',
              gap: 10,
              transform: `scale(${badgeSp.toFixed(3)})`,
            }}
          >
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                backgroundColor: palette.ink,
                color: palette.surface,
                fontFamily: typography.mono,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              +ALT
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                backgroundColor: palette.ink,
                color: palette.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              :
            </div>
          </div>
        </div>

        <AnimatedCursor
          waypoints={cursorWaypoints}
          clicks={[{ frame: clickFrame, label: 'Click!' }]}
          humanizeFittsLaw
          accentColor={palette.accent}
        />
      </CameraRig>

      {/* Subtitle Penjelasan Narasi — Rapi di Bawah Layar */}
      <BottomSubtitleBar words={words} stylePreset={stylePreset} />
    </AbsoluteFill>
  );
};

/**
 * SCENE 3: LIVED-IN MAC DESKTOP GLIDE
 * - Dilengkapi `<MacDesktopChrome />` (Menu bar atas + Floating Dock bawah dengan micro-bobbing).
 * - Kamera (`splineAt`) menyusuri kanvas 3000px dengan velocity blur tipis saat melesat.
 */
export const SceneWideDesktopGlide: React.FC<
  BaseSceneProps & {
    windows?: { title: string; metric: string; caption: string; icon: CustomIconName }[];
  }
> = ({
  stylePreset,
  durationInFrames,
  words,
  windows = [
    { title: '01 // Edge Router', metric: '99.99%', caption: 'Smart Traffic Split', icon: 'globe-meridian' },
    { title: '02 // Build Pipeline', metric: '1.4s', caption: 'Incremental Cache', icon: 'cpu-node' },
    { title: '03 // Live Telemetry', metric: '-14 LUFS', caption: 'Real-Time Inspector', icon: 'chart-rising' },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { palette, typography } = stylePreset;

  const desktopCam: [number, number, number, number, number][] = [
    [0, 1.0, 0, 0, 0],
    [16, 1.0, 0, 0, 0],
    [42, 1.04, -420, -12, 0],
    [68, 1.12, -880, -32, 0],
    [durationInFrames, 1.14, -920, -36, 0],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg, overflow: 'hidden' }}>
      <ProceduralBackground stylePreset={stylePreset} driftSpeed={0.4} />

      <MacDesktopChrome appName="Remotion Studio" stylePreset={stylePreset}>
        <CameraRig
          waypoints={desktopCam}
          durationInFrames={durationInFrames}
          stylePreset={stylePreset}
          transformOrigin="0px 0px"
          enableVelocityBlur
          enableRackFocusSpotlight={false}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, width: 3000, height: 1080 }}>
            {windows.map((win, idx) => {
              const startF = 4 + idx * 18;
              // Overlapping action: window frame (layer 0), icon (layer 1), text (layer 2)
              const winSp = staggeredSpringAt(frame, startF, 0, fps);
              const scale = 0.62 + 0.38 * winSp;
              const { dy } = microBob(frame, idx, 3.0, 0.18);
              const left = 180 + idx * 720;
              const top = (idx % 2 === 0 ? 130 : 185) + dy;

              return (
                <div
                  key={win.title}
                  style={{
                    position: 'absolute',
                    left,
                    top: top + (1 - winSp) * 40,
                    width: 640,
                    height: 590,
                    backgroundColor: palette.surface,
                    borderRadius: 22,
                    border: `2px solid ${palette.ink}`,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.16)',
                    transform: `scale(${scale.toFixed(3)})`,
                    transformOrigin: '50% 50%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      height: 52,
                      backgroundColor: `${palette.ink}0C`,
                      borderBottom: `1px solid ${palette.ink}1F`,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 20px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ width: 13, height: 13, borderRadius: 999, backgroundColor: '#FF5F57' }} />
                      <span style={{ width: 13, height: 13, borderRadius: 999, backgroundColor: '#FEBC2E' }} />
                      <span style={{ width: 13, height: 13, borderRadius: 999, backgroundColor: '#28C840' }} />
                    </div>
                    <span style={{ fontFamily: typography.mono, fontSize: 15, fontWeight: 600, color: palette.ink }}>
                      {win.title}
                    </span>
                    <span style={{ width: 36 }} />
                  </div>

                  <div style={{ padding: 42, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CustomSVGIcon
                      name={win.icon}
                      size={64}
                      color={palette.ink}
                      accentColor={palette.accent}
                      startFrame={startF + 5}
                    />

                    <div>
                      <FlyText
                        text={win.metric}
                        start={startF + 6}
                        stagger={2}
                        size={86}
                        weight={900}
                        family={typography.heading}
                        color={palette.accent}
                      />
                      <div style={{ marginTop: 10 }}>
                        <TypeText
                          text={win.caption}
                          start={startF + 10}
                          cps={1.55}
                          size={29}
                          weight={700}
                          color={palette.ink}
                          family={typography.body}
                          humanizeCadence
                          cursor={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CameraRig>
      </MacDesktopChrome>

      <BottomSubtitleBar words={words} stylePreset={stylePreset} />
    </AbsoluteFill>
  );
};

export const SceneHookBurst = SceneInteractiveTypingZoom;
export const SceneArchitectureOrbit = SceneCursorClickAndCaptionZoom;
export const SceneCodeTerminalRack = SceneWideDesktopGlide;
export const SceneDataEditorialCrane = SceneCursorClickAndCaptionZoom;
export const SceneClimaxMonumentalCTA = SceneInteractiveTypingZoom;
