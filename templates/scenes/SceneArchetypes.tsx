import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedCursor, useCursorTargetState } from '../components/AnimatedCursor';
import { BrandLogo, BuiltinBrandSlug } from '../components/BrandLogos';
import { CameraRig } from '../components/CameraRig';
import { AnimatedProgressBar, BottomSubtitleBar, FlyText, TypeText, WordItem } from '../components/KineticWords';
import {
  AuthenticBrowserWindow,
  AuthenticTerminalWindow,
  ChatAppShell,
  MacDesktopChrome,
} from '../components/LivedInUIShells';
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
 * SCENE 1: AUTHENTIC TERMINAL / CHAT & HUMANIZED TYPING ZOOM
 * - Menampilkan replika aplikasi nyata (<ChatAppShell /> atau <AuthenticTerminalWindow />)
 * - Otomatis memutar suara ketikan saat <TypeText /> mengetik
 * - Tanpa pill badge sampah atau titik bulat di samping teks
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

      <BottomSubtitleBar words={words} stylePreset={stylePreset} />
    </AbsoluteFill>
  );
};

/**
 * SCENE 2: AUTHENTIC BROWSER + FITTS'S LAW CURSOR CLICK + LOADING PROGRESS SFX
 * - Menggunakan <AuthenticBrowserWindow /> lengkap dengan tab bar, favicon <BrandLogo />, dan URL bar asli
 * - Ketikan (<TypeText />) dilengkapi SFX ketikan otomatis + simulasi backspace (`typoCorrection`)
 * - Saat tombol diklik oleh <AnimatedCursor />, <AnimatedProgressBar /> berjalan dengan SFX loading progress otomatis!
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
  cardSubheadline = 'REMOTION VIDEO ENGINE',
  typedCaption = 'npx remotion render MainVideo out/video.mp4',
  actionButtonLabel = 'Render MP4',
}) => {
  const frame = useCurrentFrame();
  const { palette, typography } = stylePreset;

  const outerSpline: [number, number, number, number, number][] = [
    [0, 1.16, -150, -80, 0],
    [20, 1.0, 0, 0, 0],
    [31, 1.0, 0, 0, 0],
    [34, 0.982, 16, 10, 0],
    [50, 1.38, -280, 35, 0],
    [76, 1.38, -360, 35, 0],
    [durationInFrames, 1.0, 0, 0, 0],
  ];

  const clickFrame = 64;
  const cursorWaypoints: [number, number, number][] = [
    [34, 920, 620],
    [50, 1180, 340],
    [clickFrame, 1360, 265],
    [90, 1360, 265],
  ];

  const { isHovered, isClicked, buttonScale } = useCursorTargetState(frame, clickFrame, 6);

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
        <div style={{ position: 'absolute', left: 380, top: 140 }}>
          <AuthenticBrowserWindow
            tabTitle="Remotion Studio — MainVideo"
            url="localhost:3000/MainVideo"
            brandFavicon="remotion"
            width={1160}
            height={720}
          >
            <div
              style={{
                padding: '36px 48px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: palette.surface,
              }}
            >
              {/* Top Command & Render Action Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 24,
                  borderBottom: `1px solid ${palette.ink}18`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <BrandLogo brand="claude" size={32} />
                  <TypeText
                    text={typedCaption}
                    start={16}
                    cps={1.65}
                    size={22}
                    weight={600}
                    color={palette.ink}
                    family={typography.mono}
                    humanizeCadence
                    enableTypingSfx
                    typoCorrection={{ atCharIndex: 13, wrongText: 'rn' }}
                    cursor={frame < clickFrame}
                  />
                </div>

                <div
                  style={{
                    padding: '12px 26px',
                    borderRadius: 10,
                    backgroundColor: isClicked
                      ? '#10B981'
                      : isHovered
                      ? palette.ink
                      : palette.accent,
                    color: '#FFFFFF',
                    fontFamily: typography.heading,
                    fontSize: 18,
                    fontWeight: 700,
                    transform: `scale(${buttonScale.toFixed(3)})`,
                  }}
                >
                  {isClicked ? 'Rendering...' : actionButtonLabel}
                </div>
              </div>

              {/* Center Stage Visual Content */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 20 }}>
                <div>
                  <div
                    style={{
                      fontFamily: typography.mono,
                      fontSize: 16,
                      fontWeight: 600,
                      color: palette.muted,
                      letterSpacing: '0.08em',
                      marginBottom: 8,
                    }}
                  >
                    {cardSubheadline}
                  </div>
                  <FlyText
                    text={cardHeadline}
                    start={8}
                    stagger={1.8}
                    size={76}
                    weight={900}
                    family={typography.heading}
                    color={palette.ink}
                  />
                </div>

                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <BrandLogo brand="claude" size={56} />
                  <BrandLogo brand="remotion" size={56} />
                  <BrandLogo brand="react" size={56} />
                  <BrandLogo brand="typescript" size={52} />
                </div>
              </div>

              {/* Loading / Render Progress Bar dengan SFX Otomatis */}
              <div style={{ minHeight: 58 }}>
                {isClicked ? (
                  <AnimatedProgressBar
                    label="Encoding H.264 MP4 (1080p)"
                    startFrame={clickFrame + 2}
                    endFrame={Math.min(durationInFrames - 6, clickFrame + 38)}
                    accentColor="#10B981"
                    textColor={palette.ink}
                    trackColor={`${palette.ink}18`}
                    monoFont={typography.mono}
                    enableProgressSfx
                  />
                ) : (
                  <svg width="100%" height="90" viewBox="0 0 1000 90" style={{ overflow: 'visible' }}>
                    <path
                      d="M 10 75 C 220 15, 380 85, 580 35 C 740 5, 860 65, 990 15"
                      fill="none"
                      stroke={palette.accent}
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeDasharray={1200}
                      strokeDashoffset={1200 * (1 - ip(frame, [6, 46], [0, 1], easeOutExpo))}
                    />
                  </svg>
                )}
              </div>
            </div>
          </AuthenticBrowserWindow>
        </div>

        <AnimatedCursor
          waypoints={cursorWaypoints}
          clicks={[{ frame: clickFrame }]}
          humanizeFittsLaw
          enableClickSfx
          accentColor={palette.accent}
        />
      </CameraRig>

      <BottomSubtitleBar words={words} stylePreset={stylePreset} />
    </AbsoluteFill>
  );
};

/**
 * SCENE 3: LIVED-IN MAC DESKTOP GLIDE DENGAN OFFICIAL BRAND LOGOS
 */
export const SceneWideDesktopGlide: React.FC<
  BaseSceneProps & {
    windows?: { title: string; metric: string; caption: string; brand: BuiltinBrandSlug }[];
  }
> = ({
  stylePreset,
  durationInFrames,
  words,
  windows = [
    { title: '01 // Claude Code CLI', metric: '99.9%', caption: 'Deterministic TSX', brand: 'claude' },
    { title: '02 // Remotion Engine', metric: '60 FPS', caption: 'Frame-Exact Render', brand: 'remotion' },
    { title: '03 // After Effects Parity', metric: '-14 LUFS', caption: 'Spline Camera Rig', brand: 'after-effects' },
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
                    borderRadius: 18,
                    border: `1.5px solid ${palette.ink}28`,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
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
                      height: 48,
                      backgroundColor: `${palette.ink}0C`,
                      borderBottom: `1px solid ${palette.ink}18`,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 20px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#FF5F56' }} />
                      <span style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#FFBD2E' }} />
                      <span style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#27C93F' }} />
                    </div>
                    <span style={{ fontFamily: typography.mono, fontSize: 14, fontWeight: 600, color: palette.ink }}>
                      {win.title}
                    </span>
                    <span style={{ width: 36 }} />
                  </div>

                  <div style={{ padding: 42, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <BrandLogo brand={win.brand} size={64} />

                    <div>
                      <FlyText
                        text={win.metric}
                        start={startF + 6}
                        stagger={2}
                        size={84}
                        weight={900}
                        family={typography.heading}
                        color={palette.accent}
                      />
                      <div style={{ marginTop: 10 }}>
                        <TypeText
                          text={win.caption}
                          start={startF + 10}
                          cps={1.55}
                          size={28}
                          weight={700}
                          color={palette.ink}
                          family={typography.body}
                          humanizeCadence
                          enableTypingSfx={idx === 0}
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

export const AuthenticTerminalDemoScene = AuthenticTerminalWindow;
export const SceneHookBurst = SceneInteractiveTypingZoom;
export const SceneArchitectureOrbit = SceneCursorClickAndCaptionZoom;
export const SceneCodeTerminalRack = SceneWideDesktopGlide;
export const SceneDataEditorialCrane = SceneCursorClickAndCaptionZoom;
export const SceneClimaxMonumentalCTA = SceneInteractiveTypingZoom;
