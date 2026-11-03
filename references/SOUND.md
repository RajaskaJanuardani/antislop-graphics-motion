# SOUND.md

Katalog suara untuk agent: backsound dan SFX. Tujuannya satu: video tidak pernah terasa sunyi atau datar, dan setiap gerakan penting punya bunyi yang menyatu dengannya. Dipakai bersama STYLES.md (tiap gaya menyebut pasangan kode B dan S).

## Prinsip

1. **Tidak ada keheningan total.** Setiap video punya lima lapisan: (a) bed atau room tone tipis yang selalu ada, (b) musik, (c) SFX yang sinkron dengan gerak, (d) stinger dan riser untuk transisi, (e) narasi bila ada. Pengecualian: user meminta hening, atau konten keagamaan yang diminta tanpa musik (lihat B00).
2. **Ritme musik memimpin ritme visual.** Tentukan BPM dulu, lalu jatuhkan potongan, hit kamera, dan kata kunci di beat (frame per beat = fps x 60 / BPM).
3. **Suara melayani narasi.** Musik turun saat narator bicara (ducking), SFX kata dibuat sangat halus.
4. **Satu sumber waktu.** Cue SFX dan musik dihitung dari data waktu yang sama dengan visual (`words.json` dan daftar scene), bukan ditulis manual.
5. **Variasi.** Tiap SFX punya 3 sampai 5 varian (pitch, panjang, filter), dipilih berurutan lewat seed, tidak pernah varian yang sama dua kali berturut-turut.
6. **Jangan mengulang.** Catat pasangan musik di Style Bible dan `research/style-log.md`. Dua proyek berurutan tidak memakai musik yang sama.

## Sumber dan Lisensi

- Default: sintesis dari kode (skrip Node atau Python di `scripts/audio/`, keluaran WAV deterministik di `public/audio/`). Sample rate sama dengan audio narasi (biasanya 48000 Hz), stereo.
- File dari user dipakai apa adanya. Kalau user memberi musik, lewati katalog B dan pakai katalog S saja.
- Aset luar hanya yang berlisensi jelas (CC0 atau lisensi komersial yang tercatat), disimpan di `public/audio/` dengan catatan sumber dan lisensi. Dilarang memakai musik berhak cipta tanpa izin.
- Kalau jaringan shell tidak bisa mengunduh, jangan mencari jalan lain. Sintesis sendiri.
- Konten budaya atau keagamaan: tawarkan opsi tanpa instrumen musik (B00 dan SFX lembut), dan ikuti preferensi user.

## Level dan Mix

- Target akhir sekitar -14 LUFS terintegrasi, true peak maksimal -1 dBTP. Ukur: `ffmpeg -i out/video.mp4 -af ebur128=peak=true -f null -`.
- Narasi sekitar -16 LUFS sebelum mix akhir. Musik 14 sampai 18 dB di bawah narasi saat bicara, naik 6 sampai 8 dB saat jeda lebih dari 1 detik.
- Ducking: turunkan musik 8 sampai 10 dB mulai 6 frame sebelum kata pertama frasa, naik kembali 12 sampai 18 frame setelah kata terakhir. Hitung dari `words.json`.
- SFX struktural (impact, whoosh): puncak sekitar -8 dBFS. SFX kata (tick, pop): 18 sampai 24 dB di bawah narasi dan tidak menutupi konsonan.
- Bed atau room tone: sekitar -38 sampai -34 LUFS, sekadar menghilangkan rasa sunyi.
- Highpass 30 Hz di semua lapisan. Kurangi 200 sampai 400 Hz pada musik saat narasi supaya suara jelas.
- Tanpa narasi: musik boleh lebih penuh (sekitar -16 LUFS) dan SFX lebih menonjol.
- Kepadatan SFX: jangan lebih dari sekitar 2 per detik kecuali gayanya memang padat (Comic Book, Manga, Split Flap). Beri jeda supaya hit besar terasa besar.
- Musik loop mulus (panjang pas bar penuh, ekor reverb dilipat ke awal), fade in 0,5 detik, fade out 1 sampai 2 detik, atau berakhir tepat di hit penutup.

## Katalog Backsound

Semua dibuat dari kode. Tiap entri: tempo, nada, instrumen sintesis, dan gaya di STYLES.md yang cocok (angka adalah nomor entri, "alt" berarti alternatif).

- **B00 Room tone saja.** Tanpa melodi: noise pink ber-filter, dengung rendah, tekstur halus sesekali. Untuk teks minimalis, konten keagamaan tanpa musik, dan momen hening yang disengaja.
- **B01 Lo-fi berdebu.** 78 sampai 90 BPM, swing ringan, akor minor 7 dan 9 dari piano listrik FM, kick dan snare lembut, hi-hat tipis, kerak vinil. Gaya 2, 14, 20 (alt), 30 (alt), 42 (alt).
- **B02 Synthwave jalan malam.** 100 sampai 118 BPM, minor, bass saw berdenyut, pad saw ter-detune, arpeggio 16 not, snare gated. Gaya 15, 29, 16 (alt).
- **B03 Bass gelap.** 90 sampai 105 BPM (atau 140 setengah waktu), minor, sub dan saw ter-filter, denting logam jarang, pad gelap. Gaya 1, 39, 26 (alt).
- **B04 Glitch elektro.** 118 sampai 128 BPM, kick tegas, stutter potongan noise dan nada pendek, bass bergerigi, bitcrush. Gaya 16, 28, 1 (alt), 3 (alt).
- **B05 Boom-bap.** 85 sampai 95 BPM, kick dan snare kering, hi-hat swing, bass sine, petikan pendek. Gaya 3, 4, 11 (alt).
- **B06 Trap setengah waktu.** 130 sampai 150 BPM terasa 65 sampai 75, 808 panjang, hi-hat roll, snare lebar. Gaya 4 (alt).
- **B07 Funk melompat.** 100 sampai 115 BPM, bass berputar, stab akor pendek, hi-hat 16, clap. Gaya 6, 37, 8 (alt), 9 (alt).
- **B08 Marimba main-main.** 108 sampai 124 BPM, mayor, marimba dan pizzicato sintesis, perkusi kecil, melodi berloncat. Gaya 2, 8, 19, 42, 6 (alt), 37 (alt).
- **B09 Denyut teknologi minimal.** 120 sampai 124 BPM, kick empat-per-empat halus, arpeggio pluk, pad tipis, bass pendek. Gaya 7, 11, 26, 27, 43, 10 (alt), 18 (alt), 32 (alt), 38 (alt).
- **B10 Pad ambient.** 60 sampai 72 BPM atau tanpa tempo, pad lambat berlapis, denting jarang, tekstur noise, tanpa perkusi. Gaya 5, 18, 41, 12 (alt), 23 (alt), 24 (alt), 27 (alt), 31 (alt), 33 (alt), 36 (alt).
- **B11 Tegang sinematik.** 70 sampai 85 BPM, denyut bass rendah, drone, riser panjang, hit jarang dengan reverb besar. Gaya 31.
- **B12 Orkestra sintetis.** 90 sampai 130 BPM, string dan brass sintesis (saw dengan envelope lambat), timpani, naik bertahap. Gaya 13 (alt), 22 (alt), 40 (alt).
- **B13 Chiptune.** 130 sampai 150 BPM, gelombang kotak dan segitiga, noise untuk drum, arpeggio cepat. Gaya 17.
- **B14 Jazz sapu swing.** 110 sampai 130 BPM swing triplet, bass berjalan, akor piano 7 dan 9, drum brush dari noise ber-filter. Gaya 22, 25, 21 (alt), 29 (alt), 31 (alt).
- **B15 Ragtime piano.** 96 sampai 112 BPM, stride (bass dan akor bergantian), melodi bersinkop, nada piano pendek. Gaya 25, 34.
- **B16 Lounge eksotika.** 90 sampai 105 BPM, vibrafon sintesis, bongo, bass lembut, akor mayor 7. Gaya 21, 32.
- **B17 Metalofon Nusantara.** 60 sampai 90 BPM, laras mirip slendro (lima nada berjarak hampir sama) atau pelog (tujuh nada berjarak tak sama), bunyi logam dari FM inharmonik, gong jarang, ritme berlapis. Hanya inspirasi, bukan akurasi etnomusikologis. Gaya 24.
- **B18 Industrial.** 100 sampai 128 BPM, denting logam, noise ber-filter, kick berat terdistorsi, ritme mekanis. Gaya 1 (alt).
- **B19 Petik akustik.** 80 sampai 100 BPM, senar petik sintesis (Karplus-Strong), akor terbuka, perkusi lembut. Gaya 20, 30, 33, 5 (alt), 19 (alt), 41 (alt).
- **B20 Drone seram.** Tanpa tempo, drone rendah, denting tidak harmonis, dengung tipis, derak. Gaya 15 (alt).
- **B21 Denyut korporat bersih.** 100 sampai 112 BPM, pluk dan pad tipis, sinkopasi ringan, akor yang tidak klise (jangan I-V-vi-IV mentah). Gaya 12, 36, 7 (alt).
- **B22 Breakbeat cepat.** 150 sampai 174 BPM, breakbeat ter-slice, bass reese, riser. Gaya 9, 35, 40, 28 (alt), 39 (alt).
- **B23 Perkusi saja.** 80 sampai 120 BPM, tom besar ala taiko, tepukan, rim, tanpa melodi. Gaya 13, 23, 35 (alt), 40 (alt).
- **B24 Jam berdetak.** Ritme dari detak jam dan klik mekanis di 90 sampai 120 BPM, bass minimal, denting jarang. Gaya 10, 38.

## Katalog SFX

Semua sintetis. Dikelompokkan per pack (kode S di STYLES.md). Setiap gaya memakai satu pack utama, S-UMUM sebagai dasar, dan satu pack pendukung.

**S-UMUM (dasar, selalu tersedia)**
- U1 Tick kata: sine atau triangle 1,2 sampai 2,4 kHz, 20 sampai 40 ms, envelope eksponensial. Kata biasa masuk, sangat pelan.
- U2 Pop kata kunci: sine menyapu naik 300 ke 600 Hz selama 60 sampai 90 ms plus klik noise kecil. Kata kunci.
- U3 Whoosh pendek: noise pink band-pass menyapu 400 ke 4000 Hz, 250 sampai 400 ms. Slide, gerak kamera.
- U4 Whoosh panjang: seperti U3, 600 sampai 900 ms dengan reverb singkat. Whip pan, ganti scene.
- U5 Impact: sine turun 140 ke 40 Hz selama 300 sampai 500 ms plus burst noise 30 ms. Hit scene.
- U6 Riser: noise band-pass naik 200 ke 8000 Hz selama 1 sampai 3 detik plus sine naik satu oktaf. Sebelum klimaks.
- U7 Sub drop: sine 70 ke 30 Hz selama 0,8 sampai 1,2 detik. Setelah riser.
- U8 Swipe halus: noise highpass 2 kHz, 100 sampai 150 ms. Pergantian baris atau elemen kecil.
- U9 Stinger penutup: akor 2 sampai 3 nada pluck dengan ekor reverb 1,5 detik. Logo dan ajakan bertindak.
- U10 Reverse swell: noise dengan envelope terbalik 0,5 detik menuju hit. Zoom-through.

**S-KERTAS**
- K1 Geser kertas: noise band 1 sampai 6 kHz, amplitudo bergelombang, 120 sampai 250 ms.
- K2 Tempel (thock): sine 180 Hz pendek plus noise 3 kHz 20 ms.
- K3 Sobek: rangkaian burst noise highpass 3 kHz dengan jarak tak teratur, sekitar 300 ms.
- K4 Stempel: thud 90 Hz plus klik 2 kHz.
- K5 Goresan marker atau pensil: noise band 4 sampai 8 kHz dimodulasi 30 Hz, 200 sampai 500 ms.
- K6 Gunting: dua klik logam 4 kHz berjarak 60 ms plus gesekan.
- K7 Remas kertas: noise berderak acak 300 sampai 600 ms.
- K8 Balik halaman: whoosh kecil plus flutter 18 Hz.

**S-DIGITAL**
- D1 Klik UI: square 1 kHz 8 ms plus noise. D2 Ping: bell FM 1,2 dan 1,8 kHz, 400 ms.
- D3 Counter tick: triangle 900 Hz 15 ms, pitch naik tiap tick. D4 Glitch stutter: potongan 10 sampai 40 ms diulang 4 sampai 8 kali dengan bitcrush.
- D5 Data blip: arpeggio square 3 nada 30 ms. D6 Scan sweep: sine naik 400 ke 3000 Hz selama 150 ms.
- D7 Galat: square 160 Hz 120 ms dua kali. D8 Boot: empat nada naik, 40 ms tiap nada.
- D9 Ketikan: noise 3 kHz 6 ms plus sine 500 Hz 12 ms, lima varian. D10 Lock-on: dua ping cepat dengan pitch naik.

**S-MEKANIK**
- M1 Klak split-flap: noise band-pass 2,5 kHz 50 ms, 20 sampai 40 klak per detik saat berputar, banyak varian.
- M2 Detak jam: sine 2,2 kHz dan 1,6 kHz 6 ms bergantian. M3 Mesin ketik: D9 plus bel 1,5 kHz di akhir baris.
- M4 Servo kamera: sine 600 ke 900 Hz dengan noise, 150 sampai 300 ms. M5 Ratchet: klik berurutan yang makin cepat.
- M6 Cetak: thud 70 Hz plus noise goyang. M7 Tombol besar: thock berat. M8 Lonceng: bell FM 800 Hz inharmonik 1,2 detik.

**S-ANALOG**
- A1 Tape stop: pitch turun cepat sampai nol, 400 ms. A2 Kerak vinil: impuls jarang plus hiss tipis (bed).
- A3 VHS tracking: noise band 1 sampai 3 kHz bergetar 8 Hz, 200 sampai 500 ms. A4 CRT nyala: zap noise 80 ms plus dengung 50 Hz.
- A5 Dengung neon: buzz 100 Hz plus klik flicker. A6 Rewind: noise plus chirp naik 300 ms. A7 Hiss kaset: noise pink tipis (bed).

**S-ARCADE**
- R1 Koin: square 988 lalu 1319 Hz 60 ms. R2 Lompat: square 200 ke 600 Hz 120 ms. R3 Power-up: arpeggio naik 6 nada 40 ms.
- R4 Hit: noise 80 ms plus square 120 Hz. R5 Menang: fanfare 5 nada.

**S-ORGANIK**
- O1 Squish: sine 300 ke 120 Hz 120 ms plus noise lowpass 800 Hz. O2 Pop gelembung: sine 700 ke 1200 Hz 30 ms.
- O3 Boing: sine 200 ke 400 ke 250 Hz dengan vibrato 8 Hz, 350 ms. O4 Goresan kapur: noise highpass 3 kHz terputus, 150 sampai 400 ms.
- O5 Tetes air: sine 1,4 kHz turun ke 600 Hz 80 ms. O6 Kayu (marimba hit): sine 400 Hz plus noise 15 ms. O7 Gesek kain: noise 500 sampai 3000 Hz lembut 200 ms.

**S-JALANAN**
- J1 Kocok kaleng: 6 sampai 10 klik logam acak 40 ms. J2 Semprot: noise putih highpass 5 kHz, 400 sampai 1200 ms, naik lalu turun.
- J3 Marker berdecit: sine 2,5 kHz dengan glissando kecil plus noise. J4 Stensil tempel: K2 plus noise. J5 Tetesan cat: O5.

**S-SINEMA**
- C1 Boom: U5 dengan reverb 2 detik. C2 Detak jantung: sine 55 Hz dua denyut 120 ms berjarak 250 ms.
- C3 Reverse cymbal: noise terbalik 1,5 detik. C4 Hit logam: denting FM 300 Hz inharmonik 1,5 detik.
- C5 Braam: saw rendah ter-detune naik 80 ke 110 Hz selama 1,2 detik. C6 Hening sebelum hit: potong semua audio 8 sampai 12 frame sebelum impact.

**S-KOMIK**
- Y1 Whoosh kartun: sine 300 ke 1200 Hz 200 ms. Y2 Pukulan: noise 60 ms plus sine 120 Hz.
- Y3 BAM: impact plus denting tinggi plus reverb pendek. Y4 Sliding whistle: sine 400 ke 1600 Hz 300 ms. Y5 Boing: O3. Y6 Pop komik: O2 yang lebih tajam.

## Peta Peristiwa Visual ke SFX

- Kata biasa masuk: U1 (selang-seling bila padat). Kata kunci: U2 atau SFX tema (D2, O2, R1 sesuai gaya).
- Frasa atau baris baru: U8. Elemen masuk: SFX tema (K2, M7, O1, D1). Elemen keluar: U8 diputar terbalik atau lebih pendek.
- Whip pan dan ganti scene: U3 atau U4. Zoom-through: U4 plus U10. Cut keras: U5 ringan atau hening mikro 3 sampai 6 frame.
- Garis draw-on: K5 atau D6. Angka menghitung naik: D3. Sorotan atau highlight: U2 atau D10. Glitch: D4.
- Klimaks: U6, lalu C6, lalu U5 dan U7 tepat di hit. Logo dan penutup: U9.
- SFX mulai tepat di frame hit visual atau 1 frame lebih awal. Jangan terlambat.

## Resep Sintesis

- Deterministik: pakai PRNG ber-seed (misalnya mulberry32), jangan `Math.random()`. Render ulang harus menghasilkan WAV identik.
- Blok dasar: osilator (sine, saw, square, triangle), envelope eksponensial atau ADSR, filter biquad (LP, HP, BP), noise (white, pink, brown), delay dan reverb Schroeder (4 comb dan 2 allpass), bitcrusher, soft clip.
- Drum: kick = sine menyapu 150 ke 45 Hz, 0,25 sampai 0,4 detik, plus klik 3 ms. Snare = noise HP 1,5 kHz 120 sampai 180 ms plus sine 190 Hz. Hat = noise HP 7 kHz 30 sampai 60 ms (open 150 sampai 250 ms). Clap = 3 sampai 4 burst noise BP 1,2 kHz berjarak 10 sampai 15 ms. Tom = sine 200 ke 90 Hz.
- Instrumen: bass = saw atau square LP 200 sampai 600 Hz plus sub sine. Pad = 3 sampai 5 saw ter-detune sekitar 7 sen, LP 1,2 kHz, attack 0,8 detik. Pluck = Karplus-Strong. Marimba dan vibrafon = sine plus overtone 4x yang meluruh cepat. Bell = FM (rasio modulator 3,5, indeks turun). Metalofon = jumlah partial inharmonik (1, 2,76, 5,4, 8,9).
- Komposisi: array akor dan pola 16 langkah per BPM, pilih skala sesuai suasana (minor natural, pentatonik, dorian). Humanize timing plus minus 8 ms dan velocity plus minus 10 persen dengan seed, swing 0 sampai 66 persen. Panjang loop adalah bar penuh.
- Cara cepat dengan ffmpeg (sudah diuji): 

```bash
ffmpeg -f lavfi -i "sine=f=1800:d=0.03:r=48000" -af "afade=t=out:st=0.005:d=0.025,volume=0.6" tick.wav
ffmpeg -f lavfi -i "anoisesrc=d=0.7:c=pink:r=48000:a=0.5" -af "highpass=f=300,lowpass=f=5000,afade=t=in:d=0.35,afade=t=out:st=0.35:d=0.35" whoosh.wav
ffmpeg -f lavfi -i "sine=f=55:d=0.45:r=48000" -af "afade=t=out:st=0.05:d=0.4" thud.wav
ffmpeg -f lavfi -i "anoisesrc=d=0.05:c=white:r=48000:a=0.8" -af "bandpass=f=2500:width_type=q:w=1.2,afade=t=out:st=0.004:d=0.046" clack.wav
```

  Untuk bunyi bersapuan (whoosh yang menyapu frekuensi), riser, dan musik, tulis skrip sintesis sendiri.

## Implementasi di Remotion

- Satu cue list (JSON: frame, id, varian, gain, pan) dihitung dari `words.json` dan daftar scene. Skrip di `scripts/audio/` me-mix semuanya menjadi `public/audio/sfx-track.wav`. Pakai satu elemen `Audio` per lapisan (narasi, musik, SFX, bed), jangan ratusan elemen `Audio`.
- Ducking: bangun envelope per frame sekali, lalu berikan ke prop `volume` (fungsi frame). Frame di dalam `Audio` relatif terhadap awal `Sequence` induknya. Cek dokumentasi versi terpasang.

```tsx
export const buildDuck = (words: {startMs: number; endMs: number}[], fps: number, total: number) => {
  const env = new Array<number>(total).fill(1);
  for (const w of words) {
    const s = Math.round((w.startMs / 1000) * fps) - 6;
    const e = Math.round((w.endMs / 1000) * fps) + 15;
    for (let f = Math.max(0, s); f < Math.min(total, e); f++) env[f] = 0.35; // sekitar -9 dB
  }
  // haluskan dengan moving average 6 frame supaya tidak terdengar patah
  return env.map((_, i) => {
    const a = Math.max(0, i - 3), b = Math.min(total - 1, i + 3);
    let sum = 0;
    for (let k = a; k <= b; k++) sum += env[k];
    return sum / (b - a + 1);
  });
};
// <Audio src={staticFile('audio/music.wav')} volume={(f) => duck[Math.min(f, duck.length - 1)] * 0.5} />
```

## QA Suara

- Tes hening: `ffmpeg -i out/video.mp4 -af silencedetect=n=-50dB:d=0.5 -f null -` tidak boleh melaporkan `silence_start` kecuali hening yang disengaja.
- Tes level: LUFS dan true peak sesuai bagian Level dan Mix, tanpa clipping.
- Tes narasi: setiap kata narasi jelas, musik tidak menutupi (cek di bagian paling ramai).
- Tes sinkron: ambil 10 SFX acak, bandingkan frame bunyinya dengan frame hit visual (selisih maksimal 1 frame).
- Tes loop dan sambungan: musik tidak patah di loop, fade akhir bersih.
- Tes lisensi: semua aset luar tercatat sumber dan lisensinya, tidak ada musik berhak cipta tanpa izin.
