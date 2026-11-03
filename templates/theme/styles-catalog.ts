export type BacksoundCode =
  | 'B00' | 'B01' | 'B02' | 'B03' | 'B04' | 'B05' | 'B06' | 'B07' | 'B08'
  | 'B09' | 'B10' | 'B11' | 'B12' | 'B13' | 'B14' | 'B15' | 'B16' | 'B17'
  | 'B18' | 'B19' | 'B20' | 'B21' | 'B22' | 'B23' | 'B24';

export type SfxPackCode =
  | 'S-UMUM'
  | 'S-KERTAS'
  | 'S-DIGITAL'
  | 'S-MEKANIK'
  | 'S-ANALOG'
  | 'S-ARCADE'
  | 'S-ORGANIK'
  | 'S-JALANAN'
  | 'S-SINEMA'
  | 'S-KOMIK';

export type CameraModePreset =
  | 'push-in-settle'
  | 'dolly-lateral-parallax'
  | 'orbit-3d-inspect'
  | 'crane-up-focus'
  | 'follow-target-rack'
  | 'pull-out-monumental';

export type TransitionTypePreset =
  | 'color-flood'
  | 'whip-pan'
  | 'zoom-through'
  | 'diagonal-wipe'
  | 'shutter-slats'
  | 'iris-mask'
  | 'glitch-slice'
  | 'paper-tear';

export type BackgroundPatternType =
  | 'editorial-grid'
  | 'topographic-contours'
  | 'halftone-dots'
  | 'paper-grain'
  | 'isometric-axon'
  | 'blueprint-draft'
  | 'crt-scanlines'
  | 'diagonal-construct';

export interface MotionStylePreset {
  id: number;
  slug: string;
  name: string;
  suitableFor: string[];
  palette: {
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    accentSecondary: string;
  };
  typography: {
    heading: string;
    body: string;
    mono: string;
    headingWeight: number;
    uppercaseHeading: boolean;
  };
  shape: {
    borderRadius: number;
    strokeWidth: number;
    hardShadow: boolean;
    shadowOffset: number;
    quantizedFps?: number; // 8 or 12 for stop-motion/doodle styles, undefined for full 30/60fps
    hudFrame: boolean;
    bgPattern: BackgroundPatternType;
  };
  motion: {
    bpm: number;
    springPreset: 'editorialSettle' | 'brutalSlap' | 'playfulPop' | 'criticalLock' | 'mechanicalClack';
    defaultTransition: TransitionTypePreset;
    sceneCameraCycle: CameraModePreset[];
  };
  audio: {
    backsound: BacksoundCode;
    altBacksound: BacksoundCode[];
    primarySfxPack: SfxPackCode;
    secondarySfxPack: SfxPackCode;
  };
  avoid: string;
}

export const STYLES_CATALOG: Record<number, MotionStylePreset> = {
  1: {
    id: 1,
    slug: 'cyberpunk',
    name: 'Cyberpunk',
    suitableFor: ['keamanan siber', 'game', 'musik elektronik', 'kota malam', 'AI', 'teknologi gelap'],
    palette: { bg: '#0B0B10', surface: '#141722', ink: '#F5F6FA', muted: '#7A869A', accent: '#F2E900', accentSecondary: '#FF2A3D' },
    typography: { heading: 'Chakra Petch', body: 'Share Tech Mono', mono: 'Share Tech Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 2, hardShadow: true, shadowOffset: 4, hudFrame: true, bgPattern: 'crt-scanlines' },
    motion: {
      bpm: 102,
      springPreset: 'criticalLock',
      defaultTransition: 'glitch-slice',
      sceneCameraCycle: ['push-in-settle', 'orbit-3d-inspect', 'dolly-lateral-parallax', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B03', altBacksound: ['B04', 'B18'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-SINEMA' },
    avoid: 'Gradien cyan-magenta default, glow merata, hujan neon klise tanpa alasan cerita.',
  },
  2: {
    id: 2,
    slug: 'doodle',
    name: 'Doodle',
    suitableFor: ['edukasi', 'startup ramah', 'brainstorming', 'penjelasan konsep', 'konten santai'],
    palette: { bg: '#F6F0E1', surface: '#FFFDF7', ink: '#1F3A93', muted: '#6C7A9C', accent: '#FFD23F', accentSecondary: '#E4572E' },
    typography: { heading: 'Gochi Hand', body: 'Patrick Hand', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 12, strokeWidth: 3, hardShadow: true, shadowOffset: 3, quantizedFps: 12, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 112,
      springPreset: 'playfulPop',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B01', altBacksound: ['B08'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-ORGANIK' },
    avoid: 'Ikon pustaka apa adanya, garis terlalu rapi.',
  },
  3: {
    id: 3,
    slug: 'zine-fotokopi',
    name: 'Zine Fotokopi',
    suitableFor: ['musik independen', 'aktivisme', 'komunitas', 'anak muda', 'kritik sosial', 'event kampus'],
    palette: { bg: '#EFECE6', surface: '#141414', ink: '#111111', muted: '#555555', accent: '#FF4F9A', accentSecondary: '#C6F500' },
    typography: { heading: 'Anton', body: 'Special Elite', mono: 'Space Mono', headingWeight: 800, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 3, hardShadow: true, shadowOffset: 6, quantizedFps: 12, hudFrame: false, bgPattern: 'halftone-dots' },
    motion: {
      bpm: 92,
      springPreset: 'brutalSlap',
      defaultTransition: 'paper-tear',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B05', altBacksound: ['B04'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-JALANAN' },
    avoid: 'Kerapian digital, drop shadow lembut.',
  },
  4: {
    id: 4,
    slug: 'grafiti',
    name: 'Grafiti',
    suitableFor: ['budaya jalanan', 'hip-hop', 'fashion', 'olahraga ekstrem', 'kampanye anak muda'],
    palette: { bg: '#2B2D2F', surface: '#7A3B2E', ink: '#F8F9FA', muted: '#8A8D8F', accent: '#FF3B1F', accentSecondary: '#FFE400' },
    typography: { heading: 'Sedgwick Ave Display', body: 'Permanent Marker', mono: 'Space Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 4, strokeWidth: 4, hardShadow: true, shadowOffset: 6, hudFrame: false, bgPattern: 'halftone-dots' },
    motion: {
      bpm: 90,
      springPreset: 'brutalSlap',
      defaultTransition: 'whip-pan',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'orbit-3d-inspect', 'pull-out-monumental'],
    },
    audio: { backsound: 'B05', altBacksound: ['B06'], primarySfxPack: 'S-JALANAN', secondarySfxPack: 'S-UMUM' },
    avoid: 'Font graffiti tanpa layering, meniru tag nyata milik orang lain.',
  },
  5: {
    id: 5,
    slug: 'topografi',
    name: 'Topografi',
    suitableFor: ['geografi', 'perjalanan', 'lingkungan', 'pendakian', 'logistik', 'data spasial', 'sains bumi'],
    palette: { bg: '#EFE8D6', surface: '#E4DBC4', ink: '#2F5D50', muted: '#7B4B2A', accent: '#D1432B', accentSecondary: '#3E7CB1' },
    typography: { heading: 'EB Garamond', body: 'DM Mono', mono: 'DM Mono', headingWeight: 600, uppercaseHeading: false },
    shape: { borderRadius: 2, strokeWidth: 1.5, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'topographic-contours' },
    motion: {
      bpm: 70,
      springPreset: 'editorialSettle',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['orbit-3d-inspect', 'dolly-lateral-parallax', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B10', altBacksound: ['B19'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-UMUM' },
    avoid: 'Foto satelit atau stok, kontur seragam tanpa noise.',
  },
  6: {
    id: 6,
    slug: 'memphis',
    name: 'Memphis',
    suitableFor: ['kreatif', 'fashion', 'event', 'produk anak muda', 'kelas desain', 'nostalgia 80-an'],
    palette: { bg: '#F8F4E3', surface: '#FFFFFF', ink: '#1B1B1B', muted: '#5A5A5A', accent: '#FF5CA8', accentSecondary: '#00B8A9' },
    typography: { heading: 'Bowlby One', body: 'Fredoka', mono: 'Space Mono', headingWeight: 800, uppercaseHeading: true },
    shape: { borderRadius: 16, strokeWidth: 3, hardShadow: true, shadowOffset: 6, hudFrame: false, bgPattern: 'halftone-dots' },
    motion: {
      bpm: 110,
      springPreset: 'playfulPop',
      defaultTransition: 'color-flood',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'orbit-3d-inspect', 'pull-out-monumental'],
    },
    audio: { backsound: 'B07', altBacksound: ['B08'], primarySfxPack: 'S-ORGANIK', secondarySfxPack: 'S-UMUM' },
    avoid: 'Pola sebagai wallpaper statis, warna pastel pucat.',
  },
  7: {
    id: 7,
    slug: 'isometric',
    name: 'Isometric',
    suitableFor: ['arsitektur sistem', 'logistik', 'kota', 'SaaS', 'proses bisnis', 'penjelasan alur'],
    palette: { bg: '#F4EFE6', surface: '#FFFFFF', ink: '#3D348B', muted: '#6B658B', accent: '#FF6B35', accentSecondary: '#2EC4B6' },
    typography: { heading: 'IBM Plex Sans Condensed', body: 'IBM Plex Sans', mono: 'IBM Plex Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 4, strokeWidth: 2, hardShadow: true, shadowOffset: 5, hudFrame: true, bgPattern: 'isometric-axon' },
    motion: {
      bpm: 120,
      springPreset: 'editorialSettle',
      defaultTransition: 'diagonal-wipe',
      sceneCameraCycle: ['orbit-3d-inspect', 'dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B09', altBacksound: ['B21'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-MEKANIK' },
    avoid: 'Gradien halus di sisi blok, ikon isometrik pustaka.',
  },
  8: {
    id: 8,
    slug: 'clay-3d',
    name: 'Clay 3D',
    suitableFor: ['produk ramah', 'anak', 'kesehatan', 'kuliner', 'aplikasi konsumer', 'cerita lucu'],
    palette: { bg: '#F7EDE2', surface: '#FFF9F2', ink: '#2D232E', muted: '#7A6C7B', accent: '#FF8FA3', accentSecondary: '#FFC857' },
    typography: { heading: 'Baloo 2', body: 'Fredoka', mono: 'DM Mono', headingWeight: 800, uppercaseHeading: false },
    shape: { borderRadius: 28, strokeWidth: 0, hardShadow: false, shadowOffset: 10, quantizedFps: 12, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 114,
      springPreset: 'playfulPop',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['orbit-3d-inspect', 'push-in-settle', 'dolly-lateral-parallax', 'pull-out-monumental'],
    },
    audio: { backsound: 'B08', altBacksound: ['B07'], primarySfxPack: 'S-ORGANIK', secondarySfxPack: 'S-UMUM' },
    avoid: 'Plastik mengilap seragam, bentuk sempurna tanpa cacat.',
  },
  9: {
    id: 9,
    slug: 'comic-book',
    name: 'Comic Book',
    suitableFor: ['cerita aksi', 'humor', 'motivasi', 'edukasi', 'promo event', 'penjelasan langkah'],
    palette: { bg: '#FFF8E7', surface: '#FFFFFF', ink: '#111111', muted: '#4A4A4A', accent: '#E4002B', accentSecondary: '#FFDE00' },
    typography: { heading: 'Bangers', body: 'Comic Neue', mono: 'Space Mono', headingWeight: 800, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 4, hardShadow: true, shadowOffset: 7, hudFrame: false, bgPattern: 'halftone-dots' },
    motion: {
      bpm: 156,
      springPreset: 'brutalSlap',
      defaultTransition: 'whip-pan',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B22', altBacksound: ['B07'], primarySfxPack: 'S-KOMIK', secondarySfxPack: 'S-UMUM' },
    avoid: 'Meniru karakter komik tertentu, kilatan putih > 3x per detik.',
  },
  10: {
    id: 10,
    slug: 'split-flap',
    name: 'Split Flap',
    suitableFor: ['jadwal', 'status', 'hitung mundur', 'harga', 'statistik', 'transportasi', 'pengumuman'],
    palette: { bg: '#111111', surface: '#1B1B1B', ink: '#F5F1E6', muted: '#7A766E', accent: '#F2A900', accentSecondary: '#2EC4B6' },
    typography: { heading: 'Barlow Condensed', body: 'DM Mono', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 4, strokeWidth: 2, hardShadow: true, shadowOffset: 4, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 108,
      springPreset: 'mechanicalClack',
      defaultTransition: 'shutter-slats',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B24', altBacksound: ['B09'], primarySfxPack: 'S-MEKANIK', secondarySfxPack: 'S-DIGITAL' },
    avoid: 'Semua karakter berputar serempak tanpa jeda, font bergaya LED.',
  },
  11: {
    id: 11,
    slug: 'neo-brutalism',
    name: 'Neo-Brutalism',
    suitableFor: ['startup', 'alat developer', 'produk kreatif', 'kampanye berani', 'anak muda', 'SaaS'],
    palette: { bg: '#FFDE59', surface: '#FFFFFF', ink: '#111111', muted: '#333333', accent: '#FF6B6B', accentSecondary: '#7DF9AA' },
    typography: { heading: 'Archivo Black', body: 'Space Mono', mono: 'Space Mono', headingWeight: 900, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 4, hardShadow: true, shadowOffset: 8, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 122,
      springPreset: 'brutalSlap',
      defaultTransition: 'color-flood',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'orbit-3d-inspect', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B09', altBacksound: ['B05'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-KERTAS' },
    avoid: 'Sudut membulat lembut, bayangan berkabut.',
  },
  12: {
    id: 12,
    slug: 'swiss-internasional',
    name: 'Swiss Internasional',
    suitableFor: ['korporat', 'keuangan', 'laporan tahunan', 'arsitektur', 'riset', 'merek bersih'],
    palette: { bg: '#F4F4F0', surface: '#EAEAE4', ink: '#111111', muted: '#767670', accent: '#E10600', accentSecondary: '#111111' },
    typography: { heading: 'Hanken Grotesk', body: 'Hanken Grotesk', mono: 'IBM Plex Mono', headingWeight: 800, uppercaseHeading: false },
    shape: { borderRadius: 0, strokeWidth: 1.5, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 106,
      springPreset: 'criticalLock',
      defaultTransition: 'color-flood',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B21', altBacksound: ['B10'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-UMUM' },
    avoid: 'Dekorasi, bayangan, gradien, simetri tengah.',
  },
  13: {
    id: 13,
    slug: 'bauhaus-konstruktivis',
    name: 'Bauhaus dan Konstruktivis',
    suitableFor: ['manifesto', 'sejarah', 'kampanye', 'politik', 'pameran', 'produk desain'],
    palette: { bg: '#EFE6D2', surface: '#141414', ink: '#141414', muted: '#5C5649', accent: '#D7261E', accentSecondary: '#F2B705' },
    typography: { heading: 'Bebas Neue', body: 'Jost', mono: 'DM Mono', headingWeight: 800, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 3, hardShadow: true, shadowOffset: 6, hudFrame: false, bgPattern: 'diagonal-construct' },
    motion: {
      bpm: 104,
      springPreset: 'brutalSlap',
      defaultTransition: 'diagonal-wipe',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B23', altBacksound: ['B12'], primarySfxPack: 'S-MEKANIK', secondarySfxPack: 'S-SINEMA' },
    avoid: 'Meniru poster propaganda nyata, simbol politik nyata tanpa izin.',
  },
  14: {
    id: 14,
    slug: 'risograph',
    name: 'Risograph',
    suitableFor: ['event budaya', 'buku', 'musik indie', 'poster', 'merek kreatif', 'cerita personal'],
    palette: { bg: '#F5F0E4', surface: '#FFFDF8', ink: '#0078BF', muted: '#00A95C', accent: '#FF48B0', accentSecondary: '#FFE800' },
    typography: { heading: 'Fraunces', body: 'Space Mono', mono: 'Space Mono', headingWeight: 800, uppercaseHeading: false },
    shape: { borderRadius: 2, strokeWidth: 2, hardShadow: true, shadowOffset: 4, hudFrame: false, bgPattern: 'halftone-dots' },
    motion: {
      bpm: 86,
      springPreset: 'editorialSettle',
      defaultTransition: 'paper-tear',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B01', altBacksound: ['B19'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-UMUM' },
    avoid: 'Semua lapisan rapat sempurna, warna lebih dari empat tinta.',
  },
  15: {
    id: 15,
    slug: 'vhs-analog',
    name: 'VHS Analog',
    suitableFor: ['nostalgia 80-an', 'nostalgia 90-an', 'horor ringan', 'dokumenter', 'arsip', 'musik'],
    palette: { bg: '#0A0A0A', surface: '#1B253B', ink: '#E8E1D0', muted: '#8E8878', accent: '#E01E2D', accentSecondary: '#2B4A8B' },
    typography: { heading: 'VT323', body: 'IBM Plex Mono', mono: 'VT323', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 6, strokeWidth: 2, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'crt-scanlines' },
    motion: {
      bpm: 108,
      springPreset: 'mechanicalClack',
      defaultTransition: 'glitch-slice',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B02', altBacksound: ['B20'], primarySfxPack: 'S-ANALOG', secondarySfxPack: 'S-UMUM' },
    avoid: 'Efek VHS seragam sepanjang video, glitch tanpa alasan.',
  },
  16: {
    id: 16,
    slug: 'y2k-kromium',
    name: 'Y2K Kromium',
    suitableFor: ['fashion', 'musik pop', 'teknologi retro', 'merek kasual', 'event'],
    palette: { bg: '#0D0D12', surface: '#C9CED6', ink: '#F5F8FF', muted: '#8F9BB3', accent: '#A8D8FF', accentSecondary: '#E8143C' },
    typography: { heading: 'Unbounded', body: 'Space Grotesk', mono: 'DM Mono', headingWeight: 800, uppercaseHeading: true },
    shape: { borderRadius: 20, strokeWidth: 2, hardShadow: true, shadowOffset: 4, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 124,
      springPreset: 'playfulPop',
      defaultTransition: 'zoom-through',
      sceneCameraCycle: ['orbit-3d-inspect', 'push-in-settle', 'dolly-lateral-parallax', 'pull-out-monumental'],
    },
    audio: { backsound: 'B04', altBacksound: ['B02'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-UMUM' },
    avoid: 'Gradien ungu-biru halus, krom yang hanya terlihat sebagai gradien lembut.',
  },
  17: {
    id: 17,
    slug: 'pixel-art-8bit',
    name: 'Pixel Art 8-Bit',
    suitableFor: ['game', 'developer', 'retro tech', 'gamifikasi', 'hiburan'],
    palette: { bg: '#1A1C2C', surface: '#333C57', ink: '#F4F4F4', muted: '#94B0C2', accent: '#FFCD75', accentSecondary: '#38B764' },
    typography: { heading: 'Press Start 2P', body: 'Pixelify Sans', mono: 'Press Start 2P', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 4, hardShadow: true, shadowOffset: 4, quantizedFps: 12, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 140,
      springPreset: 'mechanicalClack',
      defaultTransition: 'shutter-slats',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B13', altBacksound: ['B04'], primarySfxPack: 'S-ARCADE', secondarySfxPack: 'S-DIGITAL' },
    avoid: 'Anti-aliasing pada tepi, gerak sub-piksel yang halus.',
  },
  18: {
    id: 18,
    slug: 'blueprint',
    name: 'Blueprint',
    suitableFor: ['teknik', 'arsitektur', 'konstruksi', 'produk teknis', 'arsitektur sistem', 'paten'],
    palette: { bg: '#1A4E8A', surface: '#123A6B', ink: '#EAF2FF', muted: '#8EB4E3', accent: '#FFD60A', accentSecondary: '#FF6B35' },
    typography: { heading: 'IBM Plex Mono', body: 'Architects Daughter', mono: 'IBM Plex Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 1.5, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'blueprint-draft' },
    motion: {
      bpm: 96,
      springPreset: 'criticalLock',
      defaultTransition: 'diagonal-wipe',
      sceneCameraCycle: ['orbit-3d-inspect', 'dolly-lateral-parallax', 'push-in-settle', 'pull-out-monumental'],
    },
    audio: { backsound: 'B10', altBacksound: ['B09'], primarySfxPack: 'S-MEKANIK', secondarySfxPack: 'S-KERTAS' },
    avoid: 'Garis tebal seragam, biru gradien.',
  },
  19: {
    id: 19,
    slug: 'papercut-berlapis',
    name: 'Papercut Berlapis',
    suitableFor: ['cerita', 'edukasi', 'budaya', 'alam', 'anak', 'konten hangat'],
    palette: { bg: '#F6EBD9', surface: '#FFF8EE', ink: '#264653', muted: '#5C7680', accent: '#E76F51', accentSecondary: '#2A9D8F' },
    typography: { heading: 'Bricolage Grotesque', body: 'Fredoka', mono: 'DM Mono', headingWeight: 800, uppercaseHeading: false },
    shape: { borderRadius: 10, strokeWidth: 0, hardShadow: true, shadowOffset: 6, quantizedFps: 12, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 108,
      springPreset: 'playfulPop',
      defaultTransition: 'paper-tear',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B08', altBacksound: ['B19'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-ORGANIK' },
    avoid: 'Bayangan lembut gradien digital, lapisan tanpa kedalaman.',
  },
  20: {
    id: 20,
    slug: 'collage-scrapbook',
    name: 'Collage Scrapbook',
    suitableFor: ['cerita personal', 'fashion', 'sejarah', 'musik', 'perjalanan', 'memori'],
    palette: { bg: '#C8A27A', surface: '#F1E8D6', ink: '#151515', muted: '#5A4A3A', accent: '#C1272D', accentSecondary: '#2B4A8B' },
    typography: { heading: 'Playfair Display', body: 'Special Elite', mono: 'Special Elite', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 2, strokeWidth: 2, hardShadow: true, shadowOffset: 5, quantizedFps: 12, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 88,
      springPreset: 'brutalSlap',
      defaultTransition: 'paper-tear',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'orbit-3d-inspect', 'pull-out-monumental'],
    },
    audio: { backsound: 'B19', altBacksound: ['B01'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-UMUM' },
    avoid: 'Foto stok, tata letak rapi dan simetris.',
  },
  21: {
    id: 21,
    slug: 'mid-century-70an',
    name: 'Mid-Century 70-an',
    suitableFor: ['kuliner', 'kafe', 'lifestyle', 'musik', 'nostalgia hangat', 'produk rumah'],
    palette: { bg: '#F2E8D5', surface: '#FFF8EA', ink: '#4A2C1A', muted: '#6B7A3A', accent: '#D4572A', accentSecondary: '#E1A730' },
    typography: { heading: 'Shrikhand', body: 'DM Serif Display', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 24, strokeWidth: 2, hardShadow: true, shadowOffset: 5, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 96,
      springPreset: 'editorialSettle',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B16', altBacksound: ['B14'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-MEKANIK' },
    avoid: 'Palet pastel modern, bentuk tajam dingin.',
  },
  22: {
    id: 22,
    slug: 'art-deco',
    name: 'Art Deco',
    suitableFor: ['mewah', 'perhiasan', 'hotel', 'acara gala', 'properti', 'parfum'],
    palette: { bg: '#0E0E0E', surface: '#0F5C4D', ink: '#EFE3C8', muted: '#9A8C6C', accent: '#C9A227', accentSecondary: '#EFE3C8' },
    typography: { heading: 'Poiret One', body: 'Cinzel', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 2, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'diagonal-construct' },
    motion: {
      bpm: 112,
      springPreset: 'editorialSettle',
      defaultTransition: 'shutter-slats',
      sceneCameraCycle: ['push-in-settle', 'crane-up-focus', 'dolly-lateral-parallax', 'pull-out-monumental'],
    },
    audio: { backsound: 'B14', altBacksound: ['B12'], primarySfxPack: 'S-MEKANIK', secondarySfxPack: 'S-SINEMA' },
    avoid: 'Emas gradien murah, ornamen berlebihan tanpa hierarki.',
  },
  23: {
    id: 23,
    slug: 'ukiyo-e',
    name: 'Ukiyo-e',
    suitableFor: ['Jepang', 'alam', 'sejarah', 'cerita rakyat', 'seni', 'perjalanan'],
    palette: { bg: '#F0E6D0', surface: '#E5D8BC', ink: '#1A1A1A', muted: '#5A5244', accent: '#D9381E', accentSecondary: '#1D3F6B' },
    typography: { heading: 'Zen Antique', body: 'Shippori Mincho', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 0, strokeWidth: 3, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'paper-grain' },
    motion: {
      bpm: 84,
      springPreset: 'editorialSettle',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B23', altBacksound: ['B10'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-ORGANIK' },
    avoid: 'Meniru karya terkenal secara langsung, teks Jepang yang maknanya tidak diperiksa.',
  },
  24: {
    id: 24,
    slug: 'nusantara',
    name: 'Nusantara (Batik, Wayang, Arabesque)',
    suitableFor: ['budaya Indonesia', 'pesantren', 'konten Islami', 'pariwisata', 'sejarah', 'pendidikan'],
    palette: { bg: '#EADBB8', surface: '#1E2A4A', ink: '#1F1A14', muted: '#6B3F1D', accent: '#C79A3B', accentSecondary: '#1F4D3A' },
    typography: { heading: 'Lora', body: 'Lora', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 4, strokeWidth: 2, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'paper-grain' },
    motion: {
      bpm: 76,
      springPreset: 'editorialSettle',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'orbit-3d-inspect', 'pull-out-monumental'],
    },
    audio: { backsound: 'B17', altBacksound: ['B10', 'B00'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-ORGANIK' },
    avoid: 'Mencampur motif daerah tanpa konteks, simbol suci sebagai dekorasi.',
  },
  25: {
    id: 25,
    slug: 'koran-editorial',
    name: 'Koran Editorial',
    suitableFor: ['berita', 'kronologi', 'sejarah', 'investigasi', 'laporan', 'kisah nyata'],
    palette: { bg: '#E9E4D4', surface: '#DFD9C6', ink: '#1A1A1A', muted: '#5A574F', accent: '#B3261E', accentSecondary: '#1A1A1A' },
    typography: { heading: 'Playfair Display', body: 'Old Standard TT', mono: 'Libre Franklin', headingWeight: 800, uppercaseHeading: false },
    shape: { borderRadius: 0, strokeWidth: 1.5, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 104,
      springPreset: 'criticalLock',
      defaultTransition: 'shutter-slats',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B14', altBacksound: ['B15'], primarySfxPack: 'S-MEKANIK', secondarySfxPack: 'S-KERTAS' },
    avoid: 'Koran sungguhan yang ada, berita palsu yang mengecoh.',
  },
  26: {
    id: 26,
    slug: 'terminal-cli',
    name: 'Terminal CLI',
    suitableFor: ['repo', 'kode', 'DevOps', 'API', 'keamanan', 'alat developer', 'demo teknis'],
    palette: { bg: '#0A0F0A', surface: '#111A11', ink: '#E8F0E0', muted: '#5E7A5E', accent: '#33FF66', accentSecondary: '#FFB000' },
    typography: { heading: 'JetBrains Mono', body: 'IBM Plex Mono', mono: 'JetBrains Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 4, strokeWidth: 1.5, hardShadow: true, shadowOffset: 4, hudFrame: true, bgPattern: 'crt-scanlines' },
    motion: {
      bpm: 120,
      springPreset: 'criticalLock',
      defaultTransition: 'glitch-slice',
      sceneCameraCycle: ['follow-target-rack', 'push-in-settle', 'orbit-3d-inspect', 'pull-out-monumental'],
    },
    audio: { backsound: 'B09', altBacksound: ['B03'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-MEKANIK' },
    avoid: 'Hijau di hitam tanpa tema lain, kode palsu tanpa arti.',
  },
  27: {
    id: 27,
    slug: 'wireframe-lowpoly-3d',
    name: 'Wireframe dan Low-Poly 3D',
    suitableFor: ['teknologi', 'AI', 'data', 'game', 'sains', 'produk futuristik'],
    palette: { bg: '#0C1015', surface: '#141B24', ink: '#E8EEF2', muted: '#6C7D8C', accent: '#FF7A1A', accentSecondary: '#38BDF8' },
    typography: { heading: 'Space Mono', body: 'IBM Plex Mono', mono: 'IBM Plex Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 1.5, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'isometric-axon' },
    motion: {
      bpm: 120,
      springPreset: 'editorialSettle',
      defaultTransition: 'zoom-through',
      sceneCameraCycle: ['orbit-3d-inspect', 'push-in-settle', 'dolly-lateral-parallax', 'pull-out-monumental'],
    },
    audio: { backsound: 'B09', altBacksound: ['B10'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-UMUM' },
    avoid: 'Objek 3D bawaan tanpa rancangan, warna lebih dari satu aksen.',
  },
  28: {
    id: 28,
    slug: 'glitch',
    name: 'Glitch',
    suitableFor: ['error', 'hacking', 'musik elektronik', 'disrupsi', 'transisi keras'],
    palette: { bg: '#000000', surface: '#121212', ink: '#FFFFFF', muted: '#7A7A7A', accent: '#FF0033', accentSecondary: '#1E5BFF' },
    typography: { heading: 'Rubik Mono One', body: 'Share Tech Mono', mono: 'Share Tech Mono', headingWeight: 800, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 2, hardShadow: true, shadowOffset: 5, hudFrame: true, bgPattern: 'crt-scanlines' },
    motion: {
      bpm: 126,
      springPreset: 'brutalSlap',
      defaultTransition: 'glitch-slice',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B04', altBacksound: ['B22'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-ANALOG' },
    avoid: 'Glitch terus-menerus yang melelahkan, kedipan > 3x per detik.',
  },
  29: {
    id: 29,
    slug: 'neon-signage',
    name: 'Neon Signage',
    suitableFor: ['kafe malam', 'bar', 'hiburan', 'event', 'toko', 'musik live'],
    palette: { bg: '#121014', surface: '#1D1922', ink: '#FFE9C7', muted: '#786E82', accent: '#FF3D6E', accentSecondary: '#6EE7FF' },
    typography: { heading: 'Tilt Neon', body: 'Space Grotesk', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 12, strokeWidth: 3, hardShadow: false, shadowOffset: 0, hudFrame: false, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 108,
      springPreset: 'editorialSettle',
      defaultTransition: 'whip-pan',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B02', altBacksound: ['B14'], primarySfxPack: 'S-ANALOG', secondarySfxPack: 'S-UMUM' },
    avoid: 'Glow di semua elemen, flicker cepat berlebihan.',
  },
  30: {
    id: 30,
    slug: 'papan-tulis-kapur',
    name: 'Papan Tulis Kapur',
    suitableFor: ['kelas', 'tutorial', 'matematika', 'menu kafe', 'penjelasan langkah', 'edukasi'],
    palette: { bg: '#2B3A37', surface: '#222F2C', ink: '#F1F1E8', muted: '#9AB0AA', accent: '#F6D365', accentSecondary: '#F28DA6' },
    typography: { heading: 'Schoolbell', body: 'Kalam', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 6, strokeWidth: 2.5, hardShadow: false, shadowOffset: 0, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 92,
      springPreset: 'editorialSettle',
      defaultTransition: 'diagonal-wipe',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B19', altBacksound: ['B01'], primarySfxPack: 'S-ORGANIK', secondarySfxPack: 'S-KERTAS' },
    avoid: 'Font tulisan tangan yang terlalu rapi, papan tanpa bekas hapusan.',
  },
  31: {
    id: 31,
    slug: 'film-noir',
    name: 'Film Noir',
    suitableFor: ['misteri', 'kriminal', 'kisah nyata', 'investigasi', 'parfum', 'mewah gelap'],
    palette: { bg: '#0A0A0A', surface: '#1C1C1C', ink: '#F2F0EB', muted: '#7A7873', accent: '#B3171E', accentSecondary: '#FFFFFF' },
    typography: { heading: 'Bodoni Moda', body: 'Libre Franklin', mono: 'IBM Plex Mono', headingWeight: 800, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 1.5, hardShadow: true, shadowOffset: 10, hudFrame: false, bgPattern: 'diagonal-construct' },
    motion: {
      bpm: 78,
      springPreset: 'editorialSettle',
      defaultTransition: 'shutter-slats',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B11', altBacksound: ['B14', 'B10'], primarySfxPack: 'S-SINEMA', secondarySfxPack: 'S-UMUM' },
    avoid: 'B/W datar tanpa kontras, hujan klise tanpa fungsi.',
  },
  32: {
    id: 32,
    slug: 'retro-futurism',
    name: 'Retro-Futurism',
    suitableFor: ['sains', 'antariksa', 'inovasi', 'masa depan optimis', 'teknologi 60-an'],
    palette: { bg: '#F4E3C1', surface: '#1F4E5F', ink: '#1F4E5F', muted: '#697A7E', accent: '#E85D2A', accentSecondary: '#F2B134' },
    typography: { heading: 'Righteous', body: 'Michroma', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 30, strokeWidth: 2.5, hardShadow: true, shadowOffset: 5, hudFrame: true, bgPattern: 'topographic-contours' },
    motion: {
      bpm: 102,
      springPreset: 'editorialSettle',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['orbit-3d-inspect', 'pull-out-monumental', 'push-in-settle', 'dolly-lateral-parallax'],
    },
    audio: { backsound: 'B16', altBacksound: ['B09'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-MEKANIK' },
    avoid: 'Gradien biru-ungu antariksa, bintang sparkle.',
  },
  33: {
    id: 33,
    slug: 'woodcut-engraving',
    name: 'Woodcut dan Engraving',
    suitableFor: ['sejarah', 'filsafat', 'hukum', 'sains klasik', 'folklor', 'cerita gelap'],
    palette: { bg: '#EFE3C6', surface: '#E2D3B0', ink: '#2A1E14', muted: '#6E5A48', accent: '#9E2A2B', accentSecondary: '#2A1E14' },
    typography: { heading: 'IM Fell English', body: 'Cormorant', mono: 'IBM Plex Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 0, strokeWidth: 2, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'paper-grain' },
    motion: {
      bpm: 84,
      springPreset: 'editorialSettle',
      defaultTransition: 'paper-tear',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B19', altBacksound: ['B10'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-UMUM' },
    avoid: 'Meniru ilustrasi tertentu, arsir mekanis seragam.',
  },
  34: {
    id: 34,
    slug: 'rubber-hose-1930s',
    name: 'Rubber Hose 1930-an',
    suitableFor: ['humor', 'hiburan', 'anak', 'cerita ringan', 'merek nostalgia'],
    palette: { bg: '#F2E8D0', surface: '#FFF8E6', ink: '#3A2A1A', muted: '#7A6855', accent: '#C8382C', accentSecondary: '#E1A730' },
    typography: { heading: 'Rye', body: 'Bowlby One SC', mono: 'Special Elite', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 24, strokeWidth: 3.5, hardShadow: true, shadowOffset: 4, quantizedFps: 12, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 106,
      springPreset: 'playfulPop',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B15', altBacksound: ['B14'], primarySfxPack: 'S-KOMIK', secondarySfxPack: 'S-ORGANIK' },
    avoid: 'Meniru karakter atau maskot terkenal, stereotip.',
  },
  35: {
    id: 35,
    slug: 'manga',
    name: 'Manga',
    suitableFor: ['aksi', 'motivasi', 'kompetisi', 'game', 'cerita dramatis', 'promo energik'],
    palette: { bg: '#FFFFFF', surface: '#111111', ink: '#111111', muted: '#555555', accent: '#E4002B', accentSecondary: '#111111' },
    typography: { heading: 'Dela Gothic One', body: 'Zen Kaku Gothic New', mono: 'Space Mono', headingWeight: 900, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 4, hardShadow: true, shadowOffset: 6, hudFrame: false, bgPattern: 'halftone-dots' },
    motion: {
      bpm: 160,
      springPreset: 'brutalSlap',
      defaultTransition: 'whip-pan',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'follow-target-rack', 'pull-out-monumental'],
    },
    audio: { backsound: 'B22', altBacksound: ['B23'], primarySfxPack: 'S-KOMIK', secondarySfxPack: 'S-SINEMA' },
    avoid: 'Meniru karakter tertentu, kilatan inversi > 3x per detik.',
  },
  36: {
    id: 36,
    slug: 'data-editorial',
    name: 'Data Editorial',
    suitableFor: ['statistik', 'riset', 'laporan', 'cerita data', 'jurnalisme data', 'presentasi hasil'],
    palette: { bg: '#FAF8F3', surface: '#F0EDE4', ink: '#1F1F1F', muted: '#8C8C84', accent: '#D1432B', accentSecondary: '#2F6F8F' },
    typography: { heading: 'Source Serif 4', body: 'Source Sans 3', mono: 'IBM Plex Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 2, strokeWidth: 1.5, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 104,
      springPreset: 'criticalLock',
      defaultTransition: 'color-flood',
      sceneCameraCycle: ['dolly-lateral-parallax', 'crane-up-focus', 'push-in-settle', 'pull-out-monumental'],
    },
    audio: { backsound: 'B21', altBacksound: ['B10'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-UMUM' },
    avoid: 'Tampilan default pustaka grafik, warna pelangi tanpa makna.',
  },
  37: {
    id: 37,
    slug: 'inflatable-3d',
    name: 'Inflatable 3D',
    suitableFor: ['produk konsumer', 'hiburan', 'anak muda', 'merek ceria', 'aplikasi'],
    palette: { bg: '#FFF4E6', surface: '#FFFFFF', ink: '#1D1D2C', muted: '#6E6E85', accent: '#FF4D6D', accentSecondary: '#00C2A8' },
    typography: { heading: 'Fredoka', body: 'Baloo 2', mono: 'DM Mono', headingWeight: 800, uppercaseHeading: false },
    shape: { borderRadius: 32, strokeWidth: 0, hardShadow: false, shadowOffset: 12, hudFrame: false, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 112,
      springPreset: 'playfulPop',
      defaultTransition: 'color-flood',
      sceneCameraCycle: ['orbit-3d-inspect', 'push-in-settle', 'dolly-lateral-parallax', 'pull-out-monumental'],
    },
    audio: { backsound: 'B07', altBacksound: ['B08'], primarySfxPack: 'S-ORGANIK', secondarySfxPack: 'S-UMUM' },
    avoid: 'Material kaca atau logam yang tidak dimaksud, bentuk kaku.',
  },
  38: {
    id: 38,
    slug: 'peta-transit',
    name: 'Peta Transit',
    suitableFor: ['roadmap', 'linimasa', 'alur proses', 'rute', 'onboarding', 'penjelasan sistem'],
    palette: { bg: '#F6F4EE', surface: '#FFFFFF', ink: '#1A1A1A', muted: '#757570', accent: '#E63946', accentSecondary: '#1D8FE1' },
    typography: { heading: 'Barlow Condensed', body: 'Barlow', mono: 'IBM Plex Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 16, strokeWidth: 4, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 116,
      springPreset: 'editorialSettle',
      defaultTransition: 'diagonal-wipe',
      sceneCameraCycle: ['follow-target-rack', 'dolly-lateral-parallax', 'push-in-settle', 'pull-out-monumental'],
    },
    audio: { backsound: 'B24', altBacksound: ['B09'], primarySfxPack: 'S-MEKANIK', secondarySfxPack: 'S-DIGITAL' },
    avoid: 'Jalur sembarang sudut, label menabrak jalur.',
  },
  39: {
    id: 39,
    slug: 'hud-game',
    name: 'HUD Game',
    suitableFor: ['game', 'esport', 'simulasi', 'produk teknologi interaktif', 'demo fitur'],
    palette: { bg: '#0B1118', surface: '#14202E', ink: '#F2F6F8', muted: '#6E859E', accent: '#00D1B2', accentSecondary: '#FFB800' },
    typography: { heading: 'Rajdhani', body: 'Teko', mono: 'Share Tech Mono', headingWeight: 700, uppercaseHeading: true },
    shape: { borderRadius: 2, strokeWidth: 2, hardShadow: false, shadowOffset: 0, hudFrame: true, bgPattern: 'isometric-axon' },
    motion: {
      bpm: 132,
      springPreset: 'criticalLock',
      defaultTransition: 'zoom-through',
      sceneCameraCycle: ['orbit-3d-inspect', 'follow-target-rack', 'push-in-settle', 'pull-out-monumental'],
    },
    audio: { backsound: 'B03', altBacksound: ['B22'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-ARCADE' },
    avoid: 'UI game tertentu, HUD yang menutupi seluruh layar.',
  },
  40: {
    id: 40,
    slug: 'siaran-olahraga',
    name: 'Siaran Olahraga',
    suitableFor: ['olahraga', 'kompetisi', 'hasil dan klasemen', 'statistik pemain', 'hype event'],
    palette: { bg: '#0A0A0A', surface: '#18181B', ink: '#FFFFFF', muted: '#9CA3AF', accent: '#FFD400', accentSecondary: '#E4002B' },
    typography: { heading: 'Teko', body: 'Barlow Condensed', mono: 'IBM Plex Mono', headingWeight: 800, uppercaseHeading: true },
    shape: { borderRadius: 0, strokeWidth: 3, hardShadow: true, shadowOffset: 6, hudFrame: true, bgPattern: 'diagonal-construct' },
    motion: {
      bpm: 150,
      springPreset: 'brutalSlap',
      defaultTransition: 'whip-pan',
      sceneCameraCycle: ['push-in-settle', 'dolly-lateral-parallax', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B22', altBacksound: ['B12', 'B23'], primarySfxPack: 'S-SINEMA', secondarySfxPack: 'S-UMUM' },
    avoid: 'Logo liga atau tim sungguhan tanpa izin, kilatan berlebihan.',
  },
  41: {
    id: 41,
    slug: 'cat-air',
    name: 'Cat Air',
    suitableFor: ['puisi', 'wellness', 'perjalanan', 'alam', 'cerita lembut', 'produk organik'],
    palette: { bg: '#FBF7F0', surface: '#F3ECE0', ink: '#2F3E46', muted: '#6A8CAF', accent: '#E7A5A5', accentSecondary: '#A8C69F' },
    typography: { heading: 'Cormorant', body: 'Patrick Hand', mono: 'DM Mono', headingWeight: 600, uppercaseHeading: false },
    shape: { borderRadius: 18, strokeWidth: 1.5, hardShadow: false, shadowOffset: 0, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 68,
      springPreset: 'editorialSettle',
      defaultTransition: 'iris-mask',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B10', altBacksound: ['B19'], primarySfxPack: 'S-ORGANIK', secondarySfxPack: 'S-UMUM' },
    avoid: 'Gradien digital yang hanya meniru cat air, noda seragam.',
  },
  42: {
    id: 42,
    slug: 'krayon-pastel',
    name: 'Krayon dan Pastel Minyak',
    suitableFor: ['anak', 'edukasi dini', 'cerita sederhana', 'kampanye keluarga', 'konten ceria'],
    palette: { bg: '#FFF9EC', surface: '#FFFFFF', ink: '#1D3557', muted: '#457B9D', accent: '#E63946', accentSecondary: '#FFD166' },
    typography: { heading: 'Gochi Hand', body: 'Patrick Hand', mono: 'DM Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 16, strokeWidth: 4, hardShadow: true, shadowOffset: 4, quantizedFps: 10, hudFrame: false, bgPattern: 'paper-grain' },
    motion: {
      bpm: 114,
      springPreset: 'playfulPop',
      defaultTransition: 'paper-tear',
      sceneCameraCycle: ['dolly-lateral-parallax', 'push-in-settle', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B08', altBacksound: ['B01'], primarySfxPack: 'S-KERTAS', secondarySfxPack: 'S-ORGANIK' },
    avoid: 'Garis vektor mulus, terlalu rapi.',
  },
  43: {
    id: 43,
    slug: 'motion-reel-editorial',
    name: 'Motion Reel Editorial',
    suitableFor: ['promo jasa', 'portofolio', 'reel desainer', 'pitch produk digital', 'profil usaha', 'video pamer kemampuan'],
    palette: { bg: '#F4EEE7', surface: '#FFFFFF', ink: '#0F110F', muted: '#686662', accent: '#FD5837', accentSecondary: '#C9DE4B' },
    typography: { heading: 'Instrument Serif', body: 'Hanken Grotesk', mono: 'JetBrains Mono', headingWeight: 700, uppercaseHeading: false },
    shape: { borderRadius: 12, strokeWidth: 1.5, hardShadow: false, shadowOffset: 12, hudFrame: true, bgPattern: 'editorial-grid' },
    motion: {
      bpm: 122,
      springPreset: 'editorialSettle',
      defaultTransition: 'color-flood',
      sceneCameraCycle: ['push-in-settle', 'orbit-3d-inspect', 'dolly-lateral-parallax', 'crane-up-focus', 'pull-out-monumental'],
    },
    audio: { backsound: 'B09', altBacksound: ['B21'], primarySfxPack: 'S-DIGITAL', secondarySfxPack: 'S-MEKANIK' },
    avoid: 'Shake, glow, gradien ungu-biru, kartu kaca berlapis, animasi masuk yang sama untuk semua kartu.',
  },
};

export function getStyleById(id: number): MotionStylePreset {
  return STYLES_CATALOG[id] || STYLES_CATALOG[43];
}

export function getStyleBySlug(slug: string): MotionStylePreset {
  const found = Object.values(STYLES_CATALOG).find(
    (s) => s.slug.toLowerCase() === slug.toLowerCase() || s.name.toLowerCase() === slug.toLowerCase()
  );
  return found || STYLES_CATALOG[43];
}
