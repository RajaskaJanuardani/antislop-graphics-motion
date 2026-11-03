import React from 'react';
import { AbsoluteFill, Composition } from 'remotion';
import { AudioStage } from '../components/AudioStage';
import { WordItem } from '../components/KineticWords';
import { SeamlessSceneShell } from '../components/Transitions';
import { getStyleById } from '../theme/styles-catalog';
import {
  SceneCursorClickAndCaptionZoom,
  SceneInteractiveTypingZoom,
  SceneWideDesktopGlide,
} from './SceneArchetypes';

const SAMPLE_WORDS: WordItem[] = [
  // Scene 1: 0 - 3300ms
  { text: 'Fokus', startMs: 120, endMs: 520, role: 'keyword' },
  { text: 'utama', startMs: 520, endMs: 920 },
  { text: 'adalah', startMs: 920, endMs: 1280 },
  { text: 'visual', startMs: 1280, endMs: 1750, role: 'keyword' },
  { text: 'konten', startMs: 1750, endMs: 2250, role: 'keyword' },
  { text: 'yang', startMs: 2250, endMs: 2550 },
  { text: 'hidup.', startMs: 2550, endMs: 3150, role: 'keyword' },

  // Scene 2: 3300 - 6600ms
  { text: 'Kamera', startMs: 3450, endMs: 3900, role: 'keyword' },
  { text: 'tenang', startMs: 3900, endMs: 4350 },
  { text: 'mengikuti', startMs: 4350, endMs: 4900, role: 'keyword' },
  { text: 'ketikan', startMs: 4900, endMs: 5450, role: 'keyword' },
  { text: 'dan', startMs: 5450, endMs: 5750 },
  { text: 'klik', startMs: 5750, endMs: 6100, role: 'keyword' },
  { text: 'kursor.', startMs: 6100, endMs: 6550 },

  // Scene 3: 6600 - 10000ms
  { text: 'Setiap', startMs: 6750, endMs: 7150 },
  { text: 'scene', startMs: 7150, endMs: 7550, role: 'keyword' },
  { text: 'menyatu', startMs: 7550, endMs: 8100, role: 'keyword' },
  { text: 'halus', startMs: 8100, endMs: 8550 },
  { text: 'tanpa', startMs: 8550, endMs: 8950 },
  { text: 'terputus.', startMs: 8950, endMs: 9650, role: 'keyword' },
];

/**
 * Contoh Komposisi Utama Seamless Continuity:
 * - Konten Visual berada di tengah (85% layar), Subtitle rapi di bawah (`BottomSubtitleBar`).
 * - Kamera tenang berbasis C1 Spline (`splineAt`) mengikuti ketikan & kursor (tanpa shake).
 * - Transisi antar-scene overlap 10 frame (`SeamlessSceneShell`) sehingga terasa tidak berpindah scene.
 */
export const AntislopMasterShowcase: React.FC<{ styleId?: number }> = ({ styleId = 43 }) => {
  const stylePreset = getStyleById(styleId);

  return (
    <AbsoluteFill style={{ backgroundColor: stylePreset.palette.bg }}>
      <AudioStage words={SAMPLE_WORDS} />

      {/* SCENE 1 (f0..105): Chat & Typing Zoom -> Keluar dengan Portal Zoom halus */}
      <SeamlessSceneShell
        startFrame={0}
        endFrame={105}
        enterMode="none"
        exitMode="portal-zoom-in"
        overlapFrames={10}
        background={stylePreset.palette.bg}
      >
        <SceneInteractiveTypingZoom
          stylePreset={stylePreset}
          durationInFrames={105}
          sceneIndex={1}
          totalScenes={3}
          words={SAMPLE_WORDS.filter((w) => w.startMs < 3300)}
        />
      </SeamlessSceneShell>

      {/* SCENE 2 (f95..205): Cursor Click & Caption Zoom -> Keluar dengan Synchronized Whip-Glide Left */}
      <SeamlessSceneShell
        startFrame={95}
        endFrame={205}
        enterMode="portal-zoom-in"
        exitMode="whip-glide-left"
        overlapFrames={10}
        background={stylePreset.palette.bg}
      >
        <SceneCursorClickAndCaptionZoom
          stylePreset={stylePreset}
          durationInFrames={110}
          sceneIndex={2}
          totalScenes={3}
          words={SAMPLE_WORDS.filter((w) => w.startMs >= 3300 && w.startMs < 6600).map((w) => ({
            ...w,
            startMs: w.startMs - 3150,
            endMs: w.endMs - 3150,
          }))}
        />
      </SeamlessSceneShell>

      {/* SCENE 3 (f195..300): Masuk bersamaan dari kanan (Whip-Glide Left) lalu kamera menyusuri desktop lebar */}
      <SeamlessSceneShell
        startFrame={195}
        endFrame={300}
        enterMode="whip-glide-left"
        exitMode="none"
        overlapFrames={10}
        background={stylePreset.palette.bg}
      >
        <SceneWideDesktopGlide
          stylePreset={stylePreset}
          durationInFrames={105}
          sceneIndex={3}
          totalScenes={3}
          words={SAMPLE_WORDS.filter((w) => w.startMs >= 6600).map((w) => ({
            ...w,
            startMs: w.startMs - 6500,
            endMs: w.endMs - 6500,
          }))}
        />
      </SeamlessSceneShell>
    </AbsoluteFill>
  );
};

export const RemotionRootExample: React.FC = () => {
  return (
    <Composition
      id="MainVideo"
      component={AntislopMasterShowcase}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ styleId: 43 }}
    />
  );
};
