# /antislop-graphics-motion (v2.1)

**After Effects-Grade Motion Graphics & Humanized Video Editing Skill for AI Coding Agents (Remotion + React + TypeScript).**

Built following the open-source agent skills standard (`agentskills.io`) to make coding agents design, animate, and edit Remotion videos like a senior After Effects artist—without generic AI motion slop.

---

## Install

```bash
npx skills add https://github.com/RajaskaJanuardani/antislop-graphics-motion --skill "antislop-graphics-motion"
```

<details>
<summary>Claude Code plugin</summary>

```text
/plugin marketplace add RajaskaJanuardani/antislop-graphics-motion
/plugin install antislop-graphics-motion@antislop-graphics-motion
```

</details>

<details>
<summary>From a clone (Claude Code, ZCode, Codex)</summary>

```bash
git clone https://github.com/RajaskaJanuardani/antislop-graphics-motion.git
cd antislop-graphics-motion
./install.sh --all-agents
```

</details>

---

## Key Features (v2.1 + 7 Editing Humanizers)

1. **Visual Content Hero in the Center (85%), Clean Subtitle Bar at the Bottom (`<BottomSubtitleBar />`)**
   - The center stage is dedicated to **interactive visual content**: app UIs, chat conversations, live code/prompt typing, active cursor clicks, data charts, and desktop windows.
   - Narration subtitles sit cleanly at the bottom safe-zone (`bottom: 38px`, `22px–28px`, subtle frosted pill) so they never block the main content.

2. **Calm C1 Spline Camera (`splineAt`) Following Content (100% Zero Shake)**
   - Powered by a **Catmull-Rom / Cubic Hermite C1 Spline (`splineAt`)** that preserves velocity continuity across `[frame, scale, tx, ty, rotDeg]` waypoints.
   - **Calm Full View (`1.0x`):** Holds completely still when consecutive waypoints share the same coordinates.
   - **Zoom-Follow Typing (`<TypeText />` + `buildTypingCameraSpline`):** Smoothly zooms in (`1.0x -> 1.52x–1.85x`) with a 3-frame anticipation pullback (`0.982x`) to track live typing, then pulls back out to `1.0x`.
   - **Follow-Cursor & Click (`<AnimatedCursor />` + `buildCursorFollowCameraSpline`):** Tracks the pointer with Fitts's Law micro-overshoot (`4.5px`) and a 5-frame hover delay before clicking.
   - **Wide-Canvas Desktop Glide:** Sweeps smoothly across a `3000px` desktop canvas as windows pop in with `staggeredSpringAt`.

3. **Seamless Continuity Transitions (`<SeamlessSceneShell />` & `<SharedElementMorph />`)**
   - **Synchronized Whip-Glide Overlap (10 frames):** Scene A glides out on the exact same frames Scene B glides in with `easeInOutSmooth`.
   - **Shared-Element Match-Cut Morph:** Key objects carry across scene boundaries and smoothly morph in size and position.
   - **Portal Zoom-In & Spring Sheet Handoff:** Zoom through central cards or slide new sheets over continuous backdrops.

4. **7 Built-in Editing Humanizers**
   - **Humanizer #1:** Variable typing cadence + optional realistic typo & backspace (`typoCorrection`) + Fitts's Law cursor overshoot & 5-frame hover state (`useCursorTargetState`).
   - **Humanizer #2:** Layered follow-through inertia (`staggeredSpringAt`) + phase-shifted micro-bobbing (`microBob`) during holds.
   - **Humanizer #3:** Asymmetric scene pacing (`computeAsymmetricSceneDurations`) + 3-frame camera anticipation pullback.
   - **Humanizer #4:** J-Cut audio lead-in (transition whooshes & cues start 4 frames before visual cuts) + tactile key-click (`D9`) & mouse-click (`D1`) SFX.
   - **Humanizer #5:** Velocity-driven motion blur (`splineVelocityAt` — `0px` when still, `1.5–3.8px` only during fast moves) + rack-focus peripheral spotlight.
   - **Humanizer #6:** Ready-to-use **Lived-In UI Shells** (`<ChatAppShell />` & `<MacDesktopChrome />`) with rich peripheral details (100% code-drawn SVG, zero emojis).
   - **Humanizer #7:** Automated bounding-box & safe-zone camera spline inspector (`scripts/inspect-motion.mjs`).

5. **19 Ready-to-Use 3D Card Layouts, Grid Animations, & Card Interactions (`references/CARD-GRID-3D-PATTERNS.md`)**
   - **3D Card Layouts (`Card3DLayouts.tsx`):** `<Coverflow3D />`, `<FerrisWheelCards />`, `<CubeRoll3D />`, `<CylinderCards3D />`, `<HelixCards3D />`, `<SphereCards3D />`, `<ZDepthTunnel />`.
   - **Grid Animations (`GridAnimations.tsx`):** `<BentoGridReveal />`, `<ExplodeToGrid />`, `<LayoutMorphGridToCarousel />`, `<MasonryZoomDetail />`, `<GridRecapZoomOut />`.
   - **Card Interactions (`CardInteractions.tsx`):** `<CardStackSwipe />`, `<FanSpreadCards />`, `<PolaroidDropTable />`, `<CardFlip3D />`, `<PageCurlCard />`, `<PageTurnBook />`, `<AccordionFoldCard />`.

6. **43 Deep-Dive Style Guides (`references/styles/01..43.md`), Official Brand Logos (`<BrandLogo />`), 64 BGM Songs (`B00`–`B39` & `M01`–`M24`), & 65+ Event-Driven Studio SFX (`SOUND.md`)**
   - Zero-dependency Node.js CLI scripts (`draw-style.mjs`, `scenes.mjs`, `fetch-brand-logo.mjs`, `narrator-sync.mjs`, `synth-audio.mjs`, `fetch-music.mjs`, `lint.mjs`, `inspect-motion.mjs`, `run-evals.mjs`).

---

## Usage in Agent

Invoke directly with `/antislop-graphics-motion`:

```text
/antislop-graphics-motion Build a 12-second product demo video (1920x1080, 30fps). Show the interactive UI in the center with the camera smoothly zooming to follow typing and tracking the cursor click on Publish, use seamless transitions between scenes, and keep the narration subtitle neatly at the bottom.
```

---

## Run Benchmark Suite

```bash
node scripts/run-evals.mjs
```

## License

[MIT License](LICENSE)
