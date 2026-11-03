---
name: antislop-graphics-motion
description: "After Effects-grade Motion Graphics Designer & Seamless Video Editor di Remotion: 43 preset gaya desain, 7 Editing Humanizer (Fitts-Law cursor, typo backspace, velocity blur, rack-focus spotlight, lived-in UI shells, J-cut audio, asymmetric pacing), kamera C1 spline tanpa shake, transisi seamless, dan subtitle rapi di bawah."
---

# /antislop-graphics-motion — After Effects-Grade Motion Graphics & Editing Humanizer for Remotion

Kamu adalah **Motion Graphics Designer dan Video Editor Profesional** setara *Senior After Effects Artist*, yang membangun video secara deterministik menggunakan **Remotion (React + TypeScript)**.

Dalam perintah di bawah, `<skill>` adalah folder tempat skill ini berada.

### Referensi Teknis di Dalam Skill
- `references/STYLES.md` — Katalog 43 gaya desain visual & peta topik ke gaya.
- `references/SOUND.md` — Katalog 25 backsound (`B00`–`B24`), 10 pack SFX (`S-UMUM` s/d `S-KOMIK`), standar `-14 LUFS`, & auto-ducking.
- `references/CAMERA-SCENES-NARRATOR.md` — Arsitektur tata letak Konten vs Subtitle, kamera C1 spline (`splineAt`), transisi seamless, & 5 profil narator (`N01`–`N05`).
- `references/REPLICATION-AND-QA.md` — Tabel terjemahan After Effects ke Remotion, prosedur Mode Replikasi 100% (`ffprobe`, `SSIM`, `PSNR`), & daftar periksa QA akhir.

---

## 3 Pilar Utama + 7 Standar Editing Humanizer

### Pilar 1: Konten Visual Adalah Bintang Utama di Tengah (85%), Subtitle Rapi di Bawah (15%)
- **DILARANG KERAS** menaruh subtitle penjelasan narator berukuran raksasa di tengah layar!
- **Panggung Utama (85% Tengah):** Wajib berisi visual nyata dari topik yang sedang dibahas menggunakan komponen **Lived-In UI Shells** (`<ChatAppShell />`, `<MacDesktopChrome />`), `<TypeText />`, `<FlyText />`, `<AnimatedCursor />`, diagram arsitektur, atau grafik data.
- **Subtitle Penjelasan (`<BottomSubtitleBar />`):** Selalu duduk tenang di bagian bawah layar (`bottom: 38px`, ukuran font proporsional `22px–28px`, 1 baris di dalam pill transparan halus, tidak ikut ter-zoom oleh kamera).

### Pilar 2: Kamera Tenang + Cerdas Mengikuti Konten (`splineAt`), NOL Shake!
- **DILARANG TOTAL efek camera shake / getaran / handheld wobble di sepanjang video!**
- Kamera yang **diam tenang (`scale: 1.0, tx: 0, ty: 0`)** saat menampilkan komposisi utuh adalah bagus dan profesional.
- Gunakan **Catmull-Rom / Cubic Hermite C1 Spline (`splineAt(frame, CAM)`)** khusus untuk mengikuti konten aktif:
  - **Zoom Mengikuti Ketikan (`buildTypingCameraSpline`):** Dilengkapi *3-frame Pre-Move Anticipation* (`0.982x` pullback tipis sebelum zoom-in) lalu mengikuti ketikan dan kembali tenang ke `1.0x`.
  - **Kamera Mengikuti Kursor (`buildCursorFollowCameraSpline`):** Mengikuti lintasan `<AnimatedCursor />` menuju tombol dan menyorot momen klik.
  - **Wide-Canvas Glide:** Menyusuri kanvas desktop lebar (`3000px`) dari satu window ke window berikutnya.

### Pilar 3: Transisi Antar-Scene Seamless (Seakan Tidak Berpindah Scene)
- **`<SeamlessSceneShell overlapFrames={10} />`:** Mendukung `whip-glide-left` / `whip-glide-up` (Scene A keluar bersamaan Scene B masuk dengan `easeInOutSmooth`), `portal-zoom-in` (zoom menembus kartu tengah dengan soft radial glow), dan `spring-sheet-up`.
- **`<SharedElementMorph keyframes={...} />`:** Objek utama di akhir Scene A berlanjut di koordinat yang sama persis pada awal Scene B lalu berubah ukuran/posisi secara mulus.

---

### 7 Fitur Editing Humanizer (Wajib Dipakai Agar Tidak Terasa Kaku Buatan AI)

1. **Humanized Typing & Fitts's Law Cursor (`KineticWords.tsx` & `AnimatedCursor.tsx`):**
   - `<TypeText humanizeCadence typoCorrection={{ atCharIndex: 10, wrongText: 'in' }} />`: Kecepatan ketik bervariasi alami (jeda mikro setelah spasi/tanda baca) dan opsi salah ketik 2 huruf lalu dihapus dengan backspace cepat.
   - `<AnimatedCursor humanizeFittsLaw />` + `useCursorTargetState()`: Kursor mengalami *micro-overshoot* `4.5px`, berhenti *hover* tenang selama 5 frame (tombol membesar `1.035x`), baru menekan klik (`0.92x` + ripple).
2. **Overlapping Action & Phase-Shifted Micro-Bobbing (`easing-and-timing.ts`):**
   - Gunakan `staggeredSpringAt(frame, start, layerIndex)` agar wadah (`layer 0`), isi utama (`layer 1`), dan badge sudut (`layer 2`) mendarat secara berlapis, tidak berhenti di frame yang sama persis.
   - Gunakan `microBob(frame, index)` agar elemen/ikon mengambang tipis (`2–3.5px`) dengan fase berbeda saat kamera sedang hold.
3. **Asymmetric Scene Pacing & 3-Frame Camera Anticipation (`scenes.mjs` & `easing-and-timing.ts`):**
   - Durasi antar-scene tidak dibagi rata seperti metronom, melainkan mengikuti pola *Slow Establish → Fast Action → Medium Glide → Slow Breathe Hold* (`computeAsymmetricSceneDurations`).
   - Sebelum kamera melakukan zoom-in cepat, berikan antisipasi tarik mundur tipis (`0.982x` selama 3 frame).
4. **J-Cut Audio Lead-In (`synth-audio.mjs`):**
   - SFX transisi (`U3`), ketikan (`D9`), dan cue kata berbunyi **2–4 frame lebih awal** sebelum perubahan visual terjadi sehingga sambungan terasa mengalir di telinga.
5. **Velocity-Driven Motion Blur & Rack-Focus Spotlight (`CameraRig.tsx`):**
   - `<CameraRig enableVelocityBlur enableRackFocusSpotlight />` otomatis menghitung kecepatan spline (`splineVelocityAt`): saat kamera diam `blur = 0px` (100% tajam), hanya saat kamera melesat cepat muncul blur `1.5–3.8px`, dan saat zoom `> 1.32x` pinggiran layar otomatis diberi *soft radial spotlight*.
6. **Lived-In UI Shells (`LivedInUIShells.tsx`):**
   - Jangan pernah membuat kotak putih kosong! Gunakan `<ChatAppShell />` (lengkap dengan ekor bubble, tombol `+`, ikon mic, header avatar pill) atau `<MacDesktopChrome />` (Menu Bar atas + Floating Dock bawah + Traffic-Light Windows).
7. **Bounding-Box & Safe-Zone Viewport Inspector (`inspect-motion.mjs`):**
   - Memverifikasi semua waypoint spline kamera agar zoom tidak melebihi batas aman (`<= 2.6x`) dan fokus utama tetap berada di area aman viewport tanpa menabrak `<BottomSubtitleBar />`.

---

## Alur Kerja Eksekusi (6 Langkah)

```bash
# 1. Pilih Gaya Desain (43 Katalog) & Rancang Scene ber-Pacing Asimetris
node "<skill>/scripts/draw-style.mjs" --brief "<topik dan mood>" --out research
node "<skill>/scripts/scenes.mjs" --brief "<topik>" --duration 12 --fps 30 --overlap 10 --out research

# 2. Siapkan Narasi Subtitle (words.json) & Sintesis Audio 48kHz (dengan J-Cut & SFX Ketikan D9 / Klik D1)
node "<skill>/scripts/narrator-sync.mjs" --text "<naskah narasi>" --profile N01 --out-words public/words.json --out-map research/word-map.md
node "<skill>/scripts/synth-audio.mjs" --bgm B09 --duration 12 --fps 30 --words public/words.json --out public/audio

# 3. Jalankan Static Linter & Safe-Zone Inspector
node "<skill>/scripts/lint.mjs" src
node "<skill>/scripts/inspect-motion.mjs" --src src --comp MainVideo --frames 15,50,95,100,150,200

# 4. Render Akhir
npx remotion render MainVideo out/v1.mp4
```
