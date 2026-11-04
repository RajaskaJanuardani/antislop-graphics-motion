---
name: motion-craft
description: "After Effects-grade Motion Graphics Designer & Seamless Video Editor di Remotion: replika UI aplikasi/browser/terminal autentik, logo brand/project asli (<BrandLogo /> + fetch-brand-logo.mjs), SFX terikat langsung ke animasi (ketikan, loading progress, klik kursor, transisi), kamera C1 spline tenang tanpa shake, tanpa background teks/pill sampah, dan tanpa titik bulat/ikon dekoratif."
---

# /motion-craft — After Effects-Grade Motion Graphics & Authentic UI Engine for Remotion

Kamu adalah **Motion Graphics Designer dan Video Editor Profesional** setara *Senior After Effects Artist*, yang membangun video secara deterministik menggunakan **Remotion (React + TypeScript)**.

Dalam perintah di bawah, `<skill>` adalah folder tempat skill ini berada.

> **ATURAN EFISIENSI TOKEN (SELECTIVE LOADING):**
> Jangan pernah membaca seluruh file di dalam `references/` atau `templates/` sekaligus! Hanya baca **1 file gaya yang terpilih** (`research/selected-style-guide.md`), **1 file storyboard yang dipakai** (`research/storyboard.md`), dan hanya `import` komponen di `templates/components/` yang benar-benar digunakan pada scene video.

### Referensi Teknis di Dalam Skill
- `references/STYLES.md` — Indeks katalog 43 gaya desain visual & peta topik ke gaya.
- `references/styles/01-cyberpunk.md` s/d `references/styles/43-motion-reel-editorial.md` — **43 File Spesifikasi Rinci per Gaya** (masing-masing memuat tabel palet hex 60-20-10-7-3, skala tipografi 16:9 & 9:16, bahasa bentuk, rumus spring/easing, waypoint kamera `splineAt`, rekomendasi lagu `B00`–`B39` / `M01`–`M24` + SFX, contoh kode TSX lengkap, dan larangan anti-slop spesifik gaya tersebut). Wajib baca file gaya yang terpilih!
- `references/storyboards/INDEX.md` & `references/storyboards/01-bisnis-promosi.md` s/d `10-infografis-data.md` — **100 Template Storyboard Siap Pakai (`T001`–`T100`)** di 10 kategori beserta `templates/STORYBOARD.template.md`. Setiap template sudah memetakan pembagian detik asimetris, gerak kamera (`HOLD`, `PUSH`, `TYPE`, `CURSOR`, `GLIDE`), transisi keluar (`WGL`, `WGU`, `PZI`, `SSU`, `MC`, `MORPH`), SFX terikat-animasi, dan rekomendasi komponen 3D/Grid/Card Interaction!
- `references/CARD-GRID-3D-PATTERNS.md` — **19 Komponen Siap Pakai untuk 3D Card Layout, Grid Animation, & Card Interaction** (`Coverflow3D`, `FerrisWheelCards`, `CubeRoll3D`, `CylinderCards3D`, `HelixCards3D`, `SphereCards3D`, `ZDepthTunnel`, `BentoGridReveal`, `ExplodeToGrid`, `LayoutMorphGridToCarousel`, `MasonryZoomDetail`, `GridRecapZoomOut`, `CardStackSwipe`, `FanSpreadCards`, `PolaroidDropTable`, `CardFlip3D`, `PageCurlCard`, `PageTurnBook`, `AccordionFoldCard`) lengkap dengan SFX studio CC0 yang otomatis terikat ke setiap gerakan.
- `references/SOUND.md` — Katalog 64 pilihan lagu backsound (**40 lagu prosedural multi-chord `B00`–`B39` + 24 lagu studio `M01`–`M24`**), **65+ Studio SFX CC0 & Pack Tematik** (termasuk 9 SFX transisi studio baru), standar `-14 LUFS`, & auto-ducking.
- `references/CAMERA-SCENES-NARRATOR.md` — Arsitektur tata letak Konten vs Subtitle, kamera C1 spline (`splineAt`), transisi seamless, & 5 profil narator (`N01`–`N05`).
- `references/REPLICATION-AND-QA.md` — Tabel terjemahan After Effects ke Remotion, prosedur Mode Replikasi 100% (`ffprobe`, `SSIM`, `PSNR`), & daftar periksa QA akhir.

---

## 6 Aturan Keras Anti-Slop (WAJIB DIPATUHI!)

### 1. DILARANG Membuat Background Teks / Pill Badge yang Tidak Diperlukan
- **Jangan pernah** membungkus setiap judul bagian, label status, atau kata dengan kotak/pill background berwarna (`borderRadius: 999`, `backgroundColor: rgba(...)`, badge mengambang di atas judul, atau kotak warna di belakang kata subtitle)!
- Biarkan tipografi tampil bersih dan tajam di atas permukaan kanvas/kartu. Background hanya boleh dipakai pada **komponen tombol interaktif nyata** (misal tombol `Render MP4` atau `Publish` yang memang diklik oleh kursor) atau gelembung pesan di dalam aplikasi chat.
- `<BottomSubtitleBar />` di bagian bawah layar merender teks bersih dengan *drop-shadow* halus tanpa kotak warna-warni di belakang kata.

### 2. DILARANG Membuat Ikon Bulat di Samping Teks (`• teks_kalimat`) & Ikon Hiasan Tidak Berguna
- **Dilarang keras** menaruh titik/lingkaran bulat di samping teks seperti `• localhost:3000`, `• ACTIVE`, atau `<div style={{ width: 12, height: 12, borderRadius: '50%' }} />` di samping kalimat!
- **Dilarang keras** memakai ikon dekoratif tidak berguna seperti **ikon petir (`LightningIcon`), bintang/sparkle (`SparkleIcon`), bohlam (`LightbulbIcon`), atau tameng generik** di dalam kotak berwarna di samping teks!
- Linter `scripts/lint.mjs` akan otomatis menggagalkan build jika menemukan `• teks` atau ikon hiasan tersebut.

### 3. Setiap Brand atau Project WAJIB Menggunakan Logo / Icon Asli (`<BrandLogo />` + `fetch-brand-logo.mjs`)
- Jika konten menyebut atau menampilkan suatu brand, bahasa pemrograman, software, atau project (misalnya **Claude, Remotion, Adobe After Effects, Premiere Pro, CapCut, DaVinci Resolve, React, TypeScript, Next.js, VS Code, GitHub, Figma, OpenAI, TikTok, YouTube**, atau **project milik user sendiri**):
  - **DILARANG KERAS** mengarang logo palsu seperti huruf `"C"` di dalam kotak oranye untuk Claude, atau ikon segitiga play biasa untuk Remotion!
  - Gunakan komponen `<BrandLogo brand="..." />` dari `templates/components/BrandLogos.tsx`.
  - Untuk brand atau project apa pun yang belum ada di preset bawaan, jalankan resolver otomatis sebelum menulis kode scene:
    ```bash
    node "<skill>/scripts/fetch-brand-logo.mjs" --brands "claude,remotion,after-effects,premiere-pro,<nama-brand-lain>" --project-dir . --out public/brands
    ```
    Skrip ini otomatis mencari logo asli di folder project lokal, **svgl.app API**, dan **Simple Icons CDN (3,200+ brand resmi)** lalu menyimpannya ke `public/brands/<slug>.svg` agar langsung dirender oleh `<BrandLogo brand="<slug>" />`!

### 4. SFX Wajib Sesuai Fungsi Animasi (65+ Studio SFX CC0 + 9 SFX Transisi Spesifik)
- **DILARANG KERAS** membunyikan SFX secara acak terus-menerus di sepanjang video atau menaruh SFX pada setiap kata subtitle (`words.json`)! Ketika tidak ada aksi animasi, tidak boleh ada SFX liar.
- Setiap SFX **wajib terikat langsung ke komponen animasi yang sedang berjalan**:
  1. **SFX Saat Animasi Mengetik (`<TypeText enableTypingSfx typingVariant="mechanical" | "soft" | "digital" />`):** Otomatis memutar rekaman ketikan keyboard asli (`typing-loop.wav`, `typing-soft.wav`, atau `typing-digital.wav`) tepat mulai frame karakter pertama diketik dan **otomatis berhenti** tepat saat karakter terakhir selesai diketik.
  2. **SFX Saat Animasi Loading Progress (`<AnimatedProgressBar enableProgressSfx />`):** Otomatis memutar `audio/sfx/progress-loop.wav` (`D3` rising counter ticks) selama progress bar berjalan dari `0% -> 100%`, lalu membunyikan *completion chime* (`audio/sfx/d2.wav` / `confirm-chime.wav`) tepat saat mencapai `100%`.
  3. **SFX Saat Hover & Klik Kursor (`<AnimatedCursor enableClickSfx />`):** Otomatis memutar `audio/sfx/hover-rollover.wav` saat kursor tiba di atas tombol (`click.frame - 6`) dan `audio/sfx/click.wav` (`d1.wav`) tepat pada frame klik (`click.frame`).
  4. **SFX Saat Transisi Scene (`<SeamlessSceneShell enableTransitionSfx />`):** Otomatis memilih dari **9 SFX Transisi Studio CC0** sesuai jenis perpindahan scene:
     - `whip-glide-left` → `transition-swoosh.wav` (crisp modern air swoosh)
     - `whip-glide-up` → `transition-swipe.wav` (organic cloth/air swipe)
     - `portal-zoom-in` → `transition-whoosh-soft.wav` (warm deep zoom whoosh)
     - `spring-sheet-up` → `transition-maximize.wav` (smooth UI sheet open)
     - `match-cut` → `transition-chop.wav` (snappy subtle chop)
     - Tersedia juga `<SfxCue frame={...} sfx="pop-in" | "pop-plop" | "data-reveal" | "confirm-glass" | "impact-soft" />` untuk memicu SFX tepat saat kartu/elemen muncul.
  5. **64 Pilihan Lagu Backsound (`B00`–`B39` Prosedural Multi-Chord + `M01`–`M24` Lagu Studio):**
     - Pilih lagu prosedural modern seperti `B25` (*Apple Keynote Minimal Pluck*), `B26` (*Framer / Linear SaaS Groove*), `B27` (*Vox Documentary Piano*), `B28` (*Phonk Drift*), `B29` (*UK Garage 2-Step*), `B31` (*Neo-Soul Rhodes*), `B32` (*Liquid DnB*), atau unduh lagu studio asli via `node "<skill>/scripts/fetch-music.mjs" --song M03 --out public/audio/music.wav`.

### 5. Kemiripan Visual 1:1 untuk Aplikasi Digital (UI) & Objek Fisik Dunia Nyata (Universal Fidelity)
**A. Aplikasi, Website, Software, & Platform Digital (1:1 UI Reconstruction):**
- Kapan pun user meminta tampilan aplikasi, website, software, atau platform apa pun (baik aplikasi populer seperti VS Code, Figma, TikTok, YouTube, Shopee, Spotify, maupun aplikasi/website kustom milik user), kamu **WAJIB merekonstruksi anatomi UI aslinya semirip mungkin (1:1) langsung lewat kode React/SVG**—bukan membuat kotak kartu abstrak!
- Hadirkan struktur navigasi/chrome aslinya (header, sidebar, tab bar, status bar, tombol aksi), palet hex resmi aplikasi tersebut, logo asli (`<BrandLogo />`), dan teks/data yang realistis.
- Gunakan 4 komponen dasar di `LivedInUIShells.tsx` (`<AuthenticBrowserWindow />`, `<AuthenticTerminalWindow />`, `<ChatAppShell />`, `<MacDesktopChrome />`) atau bangun sendiri anatomi spesifik aplikasinya secara presisi.

**B. Objek Fisik, Alam, Sains, & Benda Dunia Nyata (Universal Physical Object Fidelity):**
- Kapan pun topik video membahas objek fisik atau fenomena nyata di dunia nyata (benda sehari-hari, alam/luar angkasa, anatomi/biologi, mesin/kendaraan, makanan, arsitektur, geografi, instrumen, dokumen fisik, dll.):
  1. **Dilarang Mengabstraksi Objek Nyata Jadi Kartu Teks atau Bangun Datar Polos:** Benda fisik yang dibahas wajib digambar wujud aslinya sebagai hero utama di panggung tengah—**jangan pernah** menggantinya dengan kotak kartu bertuliskan nama bendanya atau lingkaran/kotak polos satu warna.
  2. **Tangkap Siluet Khas, Proporsi, & Anatomi Bagian-Bagiannya (*Defining Anatomy*):** Identifikasi 3–5 bagian pembentuk utama yang membuat benda tersebut langsung dikenali dalam sekali lihat (siluet luar, proporsi ukuran, sub-komponen internal, warna permukaan, dan gradasi pencahayaan/kedalaman), lalu rakit menggunakan multi-layer `<svg>` (`<path>`, kurva bezier, `<linearGradient>`, `<radialGradient>`, dan *clip-path*).
  3. **Gerakan Sesuai Hukum Fisik & Cara Kerja Asli (*True-to-Life Mechanics*):** Gerakkan setiap bagian objek sesuai sifat dan mekanika aslinya di dunia nyata (poros rotasi yang benar, gravitasi/bobot, aliran cairan/gelombang, atau *exploded view* yang memisahkan lapisan bagian dalam dengan garis penunjuk teknis).
  4. **Prioritaskan Aset Asli (`public/`) atau Ilustrasi Vektor Berlapis:** Jika user menyediakan foto/vektor di `public/`, gunakan aset asli tersebut sebagai objek utama. Jika digambar lewat kode, wajib berlapis dan proporsional setara ilustrasi infografis profesional (*Kurzgesagt / Vox*).

### 6. Konten Visual di Tengah (85%), Subtitle di Bawah (15%), Kamera C1 Spline Tenang & Transisi Seamless
- **Konten Visual Utama** mengisi 85% panggung tengah; **Subtitle Narator (`<BottomSubtitleBar />`)** selalu berada rapi di bawah layar (`bottom: 44px`, `24px–28px`, tanpa background kotak).
- **Kamera C1 Spline (`splineAt`):** Diam tenang (`1.0x`) saat menampilkan konteks utuh, bebas getaran/shake, dan melakukan zoom halus mengikuti ketikan (`buildTypingCameraSpline`) atau kursor (`buildCursorFollowCameraSpline`).
- **Transisi Seamless (`<SeamlessSceneShell overlapFrames={10} />`):** Mengalir mulus antar-scene (`whip-glide-left`, `portal-zoom-in`, `spring-sheet-up`, atau `SharedElementMorph`).

### 7. 19 Komponen Koreografi Kartu 3D, Grid Animation, & Interaksi Kartu (`Card3DLayouts.tsx`, `GridAnimations.tsx`, `CardInteractions.tsx`)
Jangan merender kartu statis yang membosankan! Gunakan langsung ke-19 komponen siap pakai (lihat detail di `references/CARD-GRID-3D-PATTERNS.md`):
- **3D Card Layout (`templates/components/Card3DLayouts.tsx`):** `<Coverflow3D />` (kartu aktif menghadap depan, samping miring 3D), `<FerrisWheelCards />` (berputar seperti roda bianglala tetap tegak), `<CubeRoll3D />` (6 poin di 6 sisi kubus 3D), `<CylinderCards3D />` (mengelilingi tabung), `<HelixCards3D />` (naik melingkar tangga putar), `<SphereCards3D />` (menempel di bola 3D), `<ZDepthTunnel />` (meluncur dari kejauhan sumbu Z).
- **Grid Animation (`templates/components/GridAnimations.tsx`):** `<BentoGridReveal />` (`kotak 1` -> `kotak 2-3` -> `lengkap` beda ukuran), `<ExplodeToGrid />` (`tumpukan` -> `pecah` -> `rapi di grid`), `<LayoutMorphGridToCarousel />` (`grid` berubah mulus jadi `carousel` tanpa cut), `<MasonryZoomDetail />` (`pilih kotak` -> `membesar` -> `jadi halaman` detail), `<GridRecapZoomOut />` (`slide terakhir` penuh -> `kartu kembali` -> `recap semua` di grid penutup).
- **Card Interaction (`templates/components/CardInteractions.tsx`):** `<CardStackSwipe />` (geser kartu teratas), `<FanSpreadCards />` (kartu dikipas dari poros bawah), `<PolaroidDropTable />` (foto polaroid jatuh ke meja + SFX `k2.wav`), `<CardFlip3D />` (balik kartu 180° depan ke belakang), `<PageCurlCard />` (sudut halaman tergulung), `<PageTurnBook />` (balik halaman buku), `<AccordionFoldCard />` (lipatan akordeon zig-zag 3D).

---

## Alur Kerja Eksekusi (6 Langkah)

```bash
# 1. Pilih Gaya Desain (43 Katalog) & Rancang Storyboard (100 Template T001-T100) ber-Pacing Asimetris
node "<skill>/scripts/draw-style.mjs" --brief "<topik dan mood>" --out research
node "<skill>/scripts/scenes.mjs" --brief "<topik>" --duration 12 --fps 30 --overlap 10 --out research
# Opsional: pilih ID template storyboard spesifik (T001 s/d T100 dari references/storyboards/INDEX.md)
# node "<skill>/scripts/scenes.mjs" --template T032 --brief "<topik>" --duration 20 --fps 30 --overlap 10 --out research

# 2. Ambil Logo Brand / Project Asli yang Disebut di Brief
node "<skill>/scripts/fetch-brand-logo.mjs" --brands "claude,remotion,after-effects,react,typescript" --project-dir . --out public/brands

# 3. Siapkan Narasi Subtitle (words.json) & Sintesis Audio 48kHz (Pilihan Lagu B00-B39 / Studio M01-M24 + 65 SFX)
node "<skill>/scripts/narrator-sync.mjs" --text "<naskah narasi>" --profile N01 --out-words public/words.json --out-map research/word-map.md
node "<skill>/scripts/synth-audio.mjs" --bgm B26 --duration 12 --fps 30 --out public/audio
# Opsional: gunakan lagu rekaman studio royalty-free (M01-M24)
# node "<skill>/scripts/fetch-music.mjs" --song M03 --duration 12 --out public/audio/music.wav

# 4. Jalankan Static Anti-Slop Linter & Safe-Zone Inspector
node "<skill>/scripts/lint.mjs" src
node "<skill>/scripts/inspect-motion.mjs" --src src --comp MainVideo --frames 15,50,95,100,150,200

# 5. Render Akhir
npx remotion render MainVideo out/v1.mp4
```
