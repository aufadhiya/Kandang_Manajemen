# Spesifikasi Desain Frontend — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.1 |
| Tanggal | 23 September 2026 |
| Status | Keputusan pengguna **K-39**: tampilan final mengikuti mockup Google Stitch dan `DESIGN.md` yang diberikan pengguna. Dokumen ini menerjemahkannya menjadi aturan implementasi |
| Pembaca utama | AI agent yang mengerjakan [IMP-006](Implementation%20Plan.md#imp-006) dan semua kartu layar WEB |
| Sumber visual | [design/](design/README.md): tujuh layar Stitch (`code.html`, screenshot asli, screenshot acuan 390 px), `DESIGN.stitch.md`, `DESIGN.md`, konfigurasi Tailwind, aset |
| Sumber isi dan aturan | [PRD](PRD.md), [UX_UI_SPEC](UX_UI_SPEC.md), [UX_FLOWS_WIREFRAMES](UX_FLOWS_WIREFRAMES.md), [DATA_MODEL](DATA_MODEL.md), [API_SYNC_SPEC](API_SYNC_SPEC.md) |
| Bukan | Kode aplikasi, hasil uji pengguna, atau bukti aksesibilitas. Belum ada frontend yang dibangun |

## Daftar isi

1. [Keputusan dan cara memakai dokumen](#fd01)
2. [Isi folder design](#fd02)
3. [Fondasi teknis tampilan](#fd03)
4. [Token desain](#fd04)
5. [Kerangka aplikasi](#fd05)
6. [Katalog komponen](#fd06)
7. [Blueprint layar yang punya mockup](#fd07)
8. [Layar tanpa mockup: resep komposisi](#fd08)
9. [Daftar koreksi gabungan](#fd09)
10. [Aksesibilitas dan risiko visual](#fd10)
11. [Pemeriksaan kesesuaian visual](#fd11)
12. [Keputusan terbuka](#fd12)
13. [Riwayat](#fd13)

<a id="fd01"></a>
## 1. Keputusan dan cara memakai dokumen

### 1.1 Keputusan pengguna

Pada 23 September 2026 pengguna menyerahkan tujuh mockup Google Stitch dan satu `DESIGN.md`, lalu meminta frontend dibuat **persis** seperti mockup. Pengguna juga menegaskan bahwa **Recording Harian berbentuk tab**. Keputusan ini dicatat sebagai [K-39](PRD.md#s03). Token visual usulan lama di UX_UI_SPEC §4.2 dan folder `mockups/` tidak dipakai lagi sebagai acuan tampilan.

K-39 hanya mengatur **tampilan**. Aturan bisnis, izin, uang, offline, dan bahasa layar tetap mengikuti PRD dan UX_UI_SPEC. Bila mockup bertentangan dengan aturan tersebut, bagian yang bertentangan dikoreksi seminimal mungkin. Tata letak dan gayanya tetap sama. Semua koreksi tercatat di [§9](#fd09).

### 1.2 Urutan sumber kebenaran

| Urutan | Sumber | Menentukan | Bila bertentangan |
|---|---|---|---|
| 1 | PRD, UX_UI_SPEC, DATA_MODEL, API_SYNC_SPEC | Arti data, izin, efek uang, status kanonis, glosarium, perilaku offline | Selalu menang atas tampilan |
| 2 | Dokumen ini | Struktur layar, komponen, teks final, koreksi mockup, layar/tab yang tidak ada di mockup | Menang atas file Stitch |
| 3 | `design/stitch/<layar>/code.html` | Kelas Tailwind, ukuran, warna, jarak, radius, ikon, urutan elemen | Menang atas screenshot dan `DESIGN.md` |
| 4 | `reference-390-*.png` dan `stitch-screen.png` | Pembanding visual hasil render | Hanya pembanding |
| 5 | `design/stitch/DESIGN.stitch.md` | Ringkasan token Stitch | Kalah dari `code.html` |
| 6 | `design/DESIGN.md` (gaya Notion, "warm paper") | Watak dasar: kanvas hangat, satu biru utama, teks bertingkat alfa | Kalah dari Stitch untuk kaca, blur, bayangan, radius 16 px, dan gradien halus, karena layar yang disetujui memakainya |

### 1.3 Aturan kerja untuk AI agent

1. **Salin, jangan tafsir.** Untuk layar yang punya mockup, salin struktur dan kelas dari `code.html` pada rentang baris yang disebut di [§7](#fd07). Jangan mengganti kelas dengan nilai yang "mirip".
2. **Pakai token, bukan warna bebas.** Hanya kelas dari konfigurasi Tailwind di [§4](#fd04) dan palet bawaan Tailwind yang memang dipakai mockup (`emerald-*`, `amber-*`, `white`, `black/[alpha]`). Warna heksadesimal baru dilarang.
3. **Terapkan koreksi.** Sebelum menulis teks layar, cek [§9](#fd09). Teks mockup yang ada di daftar koreksi tidak boleh dipakai.
4. **Data contoh bukan data.** Nama, angka, dan tanggal di mockup (misalnya "Budi Santoso", "Token ID", "Rp148.500") hanya contoh. Layar selalu menampilkan data nyata dari API. Untuk tes visual, pakai fixture di [§11.2](#fd11).
5. **Satu komponen, banyak layar.** Bangun komponen [§6](#fd06) sekali, lalu pakai di semua layar. Varian yang berbeda antarfile dicatat per komponen.
6. **Layar tanpa mockup** disusun hanya dari komponen §6 menurut resep [§8](#fd08). Jangan menciptakan pola baru. Bila resep tidak cukup, berhenti dan minta mockup baru kepada pengguna.
7. **Tanpa CDN.** Tailwind dibangun saat build. Font Inter dan ikon Material Symbols disimpan di aplikasi ([§3](#fd03)). Aplikasi harus tampil sama saat offline.
8. **Aksesibilitas tanpa mengubah tampilan.** Tambahkan label ARIA, peran tab/dialog, fokus, dan zoom seperti di [§10](#fd10). Perubahan ini tidak boleh mengubah piksel kecuali cincin fokus.
9. **Perilaku mengikuti spesifikasi, bukan skrip demo.** Skrip di `code.html` hanya demo (misalnya `alert()`, nominal awal `150000`, animasi "Menyimpan..."). Perilaku final ada di §7 dan UX_UI_SPEC.
10. **Bukti.** Setiap layar selesai hanya bila lolos pemeriksaan visual [§11](#fd11) dan tes perilaku kartunya.

### 1.4 Arti "persis"

Pada lebar 390×844 CSS px, dengan data fixture yang sama dan keadaan layar yang sama, screenshot implementasi harus sama dengan screenshot acuan dalam hal: urutan bagian, ukuran dan jarak, warna, radius, bayangan, blur, ikon, berat dan ukuran huruf, serta posisi header dan navigasi.

Perbedaan yang diizinkan hanya:

- teks dan elemen yang berubah karena [§9](#fd09);
- data nyata yang panjangnya berbeda (kelas `truncate`/wrap mengikuti mockup);
- cincin fokus keyboard;
- anti-aliasing huruf dan ikon antarperangkat;
- varian kecil antarfile yang disatukan di §5–§6 (misalnya header 75% atau 80% putih).

<a id="fd02"></a>
## 2. Isi folder design

| Path | Isi | Dipakai untuk |
|---|---|---|
| `design/DESIGN.md` | Style reference gaya Notion dari pengguna | Watak dasar dan larangan umum |
| `design/stitch/DESIGN.stitch.md` | Sistem "Modern Glassmorphism & Warm Paper" dari Stitch | Ringkasan token dan kaca |
| `design/stitch/tailwind.config.json` | Konfigurasi Tailwind yang sama persis di ketujuh layar (sudah dinormalisasi) | Sumber token untuk build |
| `design/stitch/<layar>/code.html` | HTML + Tailwind hasil Stitch, **tidak diubah** | Sumber kelas dan struktur |
| `design/stitch/<layar>/stitch-screen.png` | Screenshot asli dari Stitch | Bukti persetujuan pengguna |
| `design/stitch/<layar>/reference-390-*-viewport.png` | Render 390×844, layar pertama | Pembanding visual utama |
| `design/stitch/<layar>/reference-390-*-full.png` | Render 390 px seluruh halaman | Pembanding bagian bawah |
| `design/stitch/assets/` | Salinan lokal gambar yang dipakai mockup | Hanya contoh; lihat [§12](#fd12) |

Tujuh layar yang ada:

| Folder | Layar | ID spesifikasi |
|---|---|---|
| `hari_ini_abk` | Hari Ini ABK | V-02 |
| `recording_harian_tab_riwayat_ringkas` | Recording Harian bertab | V-06 |
| `catat_belanja_keypad` | Catat Belanja dengan keypad | V-09 |
| `uang_kas_abk` | Uang Kas ABK | V-08, V-13 |
| `ringkasan_owner_dashboard` | Ringkasan Owner | V-01 |
| `periksa_belanja_owner` | Periksa Belanja | V-11, V-10 |
| `mulai_kandang_setup_3_langkah` | Mulai Kandang tiga langkah | V-04 |

Screenshot acuan dibuat dengan Chromium headless dari `code.html` apa adanya (termasuk teks yang kelak dikoreksi). Keadaan tambahan: `recording…/reference-390-tab-pakan-*` (lembar ditutup), `recording…/reference-390-lembar-pakan-*` (lembar terbuka), `uang_kas_abk/reference-390-rincian-terbuka-*`, dan `ringkasan…/reference-390-pilih-kandang-*`.

<a id="fd03"></a>
## 3. Fondasi teknis tampilan

### 3.1 Tailwind CSS

- Gunakan **Tailwind CSS v3** yang dibangun saat build (mockup memakai Tailwind Play CDN v3; format `tailwind.config` v3). Versi pasti dikunci lewat ADR/lockfile saat implementasi dimulai. Jangan memakai Tailwind v4 karena nama dan perilaku token berbeda.
- Isi `theme.extend` **persis** dari `design/stitch/tailwind.config.json`, termasuk `darkMode: 'class'`. Jangan menambah atau mengganti token.
- Konfigurasi ini **mengganti** radius bawaan: `rounded` = 0,25rem, `rounded-lg` = 0,5rem, `rounded-xl` = 0,75rem, `rounded-full` = 9999px. `rounded-md` (0,375rem), `rounded-2xl` (1rem), dan `rounded-3xl` (1,5rem) tetap nilai bawaan Tailwind.
- Semua kelas harus ditulis utuh di kode, tanpa digabung dari potongan string, agar tidak terhapus saat build.
- Mockup memakai kelas arbitrary (`shadow-[0_6px_20px_rgba(0,117,222,0.30)]`, `text-[11px]`, `border-black/[0.05]`, `py-0.2`). Salin apa adanya. Tiga kelas tidak dikenali Tailwind v3 sehingga tidak menghasilkan CSS, baik di mockup maupun di implementasi: `py-0.2` (12 kali), `shadow-xs` (3 kali, kotak Pakan/Mati/Afkir di Ringkasan), dan `backdrop-blur-xs` (scrim pemilih kandang). Biarkan tetap tidak berpengaruh; jangan menggantinya dengan nilai lain.
- Kelas `animate-in`, `slide-in-from-bottom`, `fade-in`, dan `duration-*` pada lembar berasal dari plugin yang **tidak dimuat** di mockup, sehingga lembar muncul tanpa animasi. Implementasi juga tanpa animasi masuk ([§3.6](#fd03)).
- **Plugin `@tailwindcss/forms`:** hanya file Recording yang memuatnya. Plugin ini memberi garis abu-abu pada isian angka dan panah kedua pada pilihan jenis pakan. Keduanya efek samping, bukan desain (koreksi K-REC-7 dan K-REC-8 di §9). Implementasi **tidak** memakai plugin forms. Semua isian ditata hanya dengan kelas di mockup.
- `@tailwindcss/container-queries` dimuat Recording tetapi tidak dipakai. Tidak perlu dipasang.

### 3.2 Huruf Inter

- Simpan Inter **400, 600, dan 700** di aplikasi (woff2, `font-display: swap`). Ini sama dengan enam dari tujuh file mockup.
- Jangan memuat 500 dan 800. Akibatnya `font-medium` tampil seperti 400 dan `font-extrabold` tampil 700, persis seperti yang terlihat di mockup. Hanya Recording yang memuat 500, dan dua pemakaiannya di sana ikut tampil 400 (perbedaan yang diterima).
- Keluarga: `Inter, ui-sans-serif, system-ui, sans-serif`. Semua kelas `font-headline-*`, `font-body-*`, `font-label-*` mengarah ke Inter sesuai konfigurasi.
- Lisensi Inter: SIL Open Font License. Catat versi dan sumber file di ADR.

### 3.3 Ikon Material Symbols Outlined

- Simpan font variabel **Material Symbols Outlined** di aplikasi (woff2), dengan sumbu `FILL 0..1` dan `wght 100..700`. Lisensi Apache 2.0.
- Agar ringan untuk offline, buat subset hanya berisi ikon yang dipakai. Daftar ikon ada di bawah. Tambahkan ikon baru hanya bila resep §8 menyebutnya.
- Kelas `.material-symbols-outlined` wajib punya: `font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;`. Ukuran diatur kelas `text-*` di mockup.
- Ikon terisi memakai `style="font-variation-settings: 'FILL' 1;"` seperti di mockup (ikon `edit_note` pada Saran Utama dan beberapa ikon lain).
- Setiap ikon dekoratif diberi `aria-hidden="true"`. Tombol yang hanya berisi ikon wajib punya `aria-label`.

Ikon yang dipakai tujuh mockup (88):

```text
account_balance account_balance_wallet add add_a_photo add_circle analytics arrow_back
arrow_forward assignment assignment_late assignment_return backspace bed bolt bookmark_border
calculate calendar_month calendar_today call_received cancel check check_circle chevron_right
close cloud_done cloud_off cloud_sync dashboard domain done done_all edit edit_note engineering
event event_upcoming expand_less expand_more fact_check filter_list grid_view groups handshake
heart_broken help_center help_outline hide_image history home_work hourglass_empty image info
inventory_2 keyboard layers lightbulb local_gas_station location_on lock more_horiz
nest_multi_room notification_important payments pending pending_actions person pets photo
photo_camera progress_activity propane_tank receipt_long replay roofing scale schedule send
shopping_cart storefront swap_horiz sync_problem touch_app unfold_less verified verified_user
wallet warehouse warning
```

Ikon tambahan untuk koreksi dan layar tanpa mockup: `remove`, `wifi_off`, `login`, `visibility`, `visibility_off`, `lock_reset`, `group_add`, `person_off`, `download`, `description`, `local_shipping`, `egg`, `lock_open`, `upload`, `undo`.

### 3.4 CSS dasar

Salin blok `<style>` mockup ke CSS global:

```css
@layer base {
  html, body { width: 100%; margin: 0; padding: 0; min-height: 100%; background-color: #f6f5f4; }
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
  .pt-safe { padding-top: env(safe-area-inset-top, 0px); }
  main > :first-child { margin-top: 0 !important; }
  main > :last-child { margin-bottom: 0 !important; }
}
::-webkit-scrollbar { display: none; }
```

- Kanvas default `#f6f5f4` (`bg-canvas-base`). Ringkasan Owner dan Mulai Kandang memakai `#fbf9f9` (`bg-background`) dengan tambahan `body { overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; }`, sesuai file masing-masing. Terapkan lewat properti tata letak `canvas="warm"` (default) atau `canvas="bright"`.
- Kelas `<body>`: `bg-canvas-base text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col relative selection:bg-primary-fixed selection:text-on-primary-fixed`.
- Recording menambah `body { min-height: max(884px, 100dvh); }`. Terapkan hanya di halaman Recording.
- Bila lembar terbuka, `body` diberi `overflow-hidden` seperti di skrip mockup.

### 3.5 Viewport

Mockup memakai `maximum-scale=1.0, user-scalable=no`. Ini **dihapus** karena menghalangi zoom (WCAG 1.4.4). Pakai:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

Tampilan pada zoom 100% tidak berubah.

### 3.6 Kaca, fallback, dan gerak

- Kaca di mockup: latar putih 75–95% (`bg-white/85`, `bg-surface-container-lowest/80`) + `backdrop-blur-md/xl/2xl` + bayangan sangat halus. Isian, tombol keypad, dan tampilan nominal memakai permukaan solid. Pertahankan pembagian ini.
- **Fallback solid** (tampilan sama tanpa efek tembus): bila `backdrop-filter` tidak didukung, pengguna memilih **Kurangi Efek Visual**, atau `prefers-reduced-transparency: reduce`, maka semua `bg-*/NN` pada elemen berblur memakai warna yang sama dengan alfa 100% dan `backdrop-filter: none`. Implementasikan dengan kelas root `reduce-effects` dan varian CSS, bukan dengan menghapus kelas per komponen.
- Gerak yang ada: `active:scale-95`, `active:scale-[0.98]`, `active:scale-90`, `transition-all`/`transition-colors`/`transition-transform` (durasi bawaan 150 ms), `animate-pulse` pada titik status koneksi, putar ikon chevron 180°. Tidak ada animasi lain.
- `prefers-reduced-motion: reduce` mematikan `animate-pulse` dan skala tekan.
- Animasi tidak menunda simpan. Pesan berhasil muncul hanya setelah penyimpanan berhasil.

<a id="fd04"></a>
## 4. Token desain

Nilai di bawah berasal dari `design/stitch/tailwind.config.json`. Tabel ini untuk dibaca manusia. Build memakai file JSON tersebut.

### 4.1 Warna yang dipakai layar

| Kelas token | Nilai | Peran di mockup |
|---|---|---|
| `canvas-base` | `#f6f5f4` | Kanvas halaman (kertas hangat) |
| `background` / `surface` / `surface-bright` | `#fbf9f9` | Kanvas Ringkasan dan Mulai Kandang; kepala lembar |
| `surface-container-lowest` | `#ffffff` | Kartu (sering dengan alfa 80–95%) |
| `surface-container-low` | `#f5f3f3` | Isian, tombol keypad, blok rincian |
| `surface-container` | `#efeded` | Latar tab, pil netral, tombol sekunder ringan |
| `surface-container-high` | `#e9e8e7` | Tombol Simpan Draf, keypad `000` dan hapus, pil kategori |
| `on-surface` | `#1b1c1c` | Teks utama |
| `on-surface-variant` | `#414753` | Teks sekunder gelap |
| `ink-black-primary` | `rgba(0,0,0,0.80)` | Teks isi kuat; scrim lembar (`/60`, `/40`) |
| `ink-black-secondary` | `rgba(0,0,0,0.60)` | Teks bantuan, label kecil, ikon nav tidak aktif |
| `ink-black-tertiary` | `rgba(0,0,0,0.40)` | Metadata paling lemah (lihat risiko kontras §10) |
| `primary` | `#005db2` | Teks aksi, pil terpilih, tanggal terpilih di Catat Belanja |
| `primary-container` | `#0075de` | Tombol utama, tombol Catat (+), item nav aktif |
| `on-primary` / `on-primary-container` | `#ffffff` / `#fffeff` | Teks di atas biru |
| `primary-fixed` | `#d5e3ff` | Tombol Kirim Ulang, pilihan bayar terpilih (`/40`) |
| `sky-tint` | `#e6f3fe` | Pil Aktif/Dibukukan, tombol tonal, latar nominal (`/60`) |
| `secondary` | `#805600` | Teks label Saran Utama |
| `secondary-container` | `#fdaf0c` | Titik status Draf |
| `secondary-fixed` | `#ffddaf` | Pil Draf/Belum Ada Data/Menunggu Owner, ikon Saran Utama, dampak (`/30`) |
| `secondary-fixed-dim` | `#ffba43` | Latar label Saran Utama (`/30`) |
| `on-secondary-fixed` | `#281800` | Teks di atas kuning |
| `tertiary` | `#9b4300` | Angka Belanja Belum Dibukukan, judul perhatian |
| `coral-alert` | `#f64932` | Peringatan, lencana jumlah, nominal keluar yang belum dibukukan |
| `error-container` | `#ffdad6` | Pil Menunggu Kirim, blok peringatan (`/30`, `/40`) |
| `on-error-container` | `#93000a` | Ikon di atas merah muda |
| `outline-variant` | `#c1c6d5` | Garis tipis (jarang) |
| `emerald-100` / `emerald-800` / `emerald-500` | bawaan Tailwind | Pil Tercatat; titik koneksi Terhubung |
| `amber-50` / `amber-700` / `amber-500` | bawaan Tailwind | Pil Menunggu Owner di Uang Kas |

Token lain di konfigurasi (misalnya `inverse-primary`, `tertiary-fixed`, `surface-dim`) boleh dipakai hanya bila resep §8 menyebutnya.

### 4.2 Tipografi

| Kelas | Ukuran/tinggi baris | Berat | Tracking | Contoh pemakaian |
|---|---|---|---|---|
| `text-headline-xl` | 36/44 | 700 | -0,02em | Tidak dipakai di HP |
| `text-headline-xl-mobile` | 28/34 | 700 | -0,02em | Nominal besar (Rp150.000, Rp820.000) |
| `text-headline-lg` | 24/32 | 700 | -0,01em | Judul besar |
| `text-headline-md` | 20/28 | 600 | normal | Judul kartu, angka penting, tombol keypad |
| `text-body-lg` | 16/24 | 400 | normal | Isi utama, ikon 16 px |
| `text-body-md` | 14/20 | 400 | normal | Isi standar, nama aplikasi di header |
| `text-body-sm` | 12/16 | 400 | normal | Bantuan, ejaan nominal |
| `text-label-lg` | 14/20 | 600 | normal | Tombol utama, judul baris |
| `text-label-md` | 12/16 | 600 | normal | Label isian, pil kategori |
| `text-label-sm` | 10/14 | 600 | 0,04em | Pil status, label nav, metadata |

Kelas `font-*` dengan nama sama hanya menetapkan keluarga Inter. Berat diatur `font-bold`/`font-semibold` bila tertulis di mockup. Mockup juga memakai `text-[11px]`, `text-[10px]`, `text-[9px]`, `text-[12px]`, `text-base`, `text-sm`, `text-xs`, `text-lg`, `text-xl`, `text-2xl`, dan `text-[24px]`/`text-[28px]` untuk ikon. Salin apa adanya.

### 4.3 Jarak, radius, bayangan, dan blur

| Jenis | Nilai |
|---|---|
| Spasi token | `space-xs` 4 px · `space-sm` 8 px · `space-md` 16 px · `space-lg` 20 px · `space-xl` 24 px · `gutter` 16 px · `margin` 16 px |
| Lebar isi | `max-w-lg` (512 px) untuk `main`; nav pil ABK `max-w-md` (448 px) |
| Radius | `rounded` 4 px · `rounded-md` 6 px · `rounded-lg` 8 px · `rounded-xl` 12 px · `rounded-2xl` 16 px · `rounded-t-3xl` 24 px (lembar) · `rounded-full` |
| Bayangan kartu | `shadow-sm`, `shadow-md`, `shadow-xl`, `shadow-2xl` bawaan; `shadow-[0_4px_16px_rgba(31,38,135,0.04)]`; `shadow-[0_4px_18px_rgba(31,38,135,0.04)]`; `shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]` |
| Bayangan header | `shadow-[0_4px_24px_rgba(31,38,135,0.04)]` |
| Bayangan nav | ABK `shadow-[0_8px_32px_0_rgba(31,38,135,0.08)]`; Owner `shadow-[0_-4px_20px_rgba(0,0,0,0.05)]` |
| Bayangan tombol biru | `shadow-[0_6px_20px_rgba(0,117,222,0.30)]`, `shadow-[0_3px_12px_rgba(0,117,222,0.3)]`, tombol + `shadow-[0_6px_20px_rgba(0,117,222,0.40)]` / `shadow-[0_8px_20px_rgba(0,117,222,0.35)]` |
| Blur | `backdrop-blur-sm` (scrim lembar), `-md`, `-xl`, `-2xl`; `blur-xl`/`blur-2xl`/`blur-3xl` untuk lingkaran dekorasi. Scrim pemilih kandang tanpa blur (`backdrop-blur-xs` tidak berefek di v3) |
| Garis | `border-black/[0.04]`, `/[0.05]`, `/[0.06]`, `/[0.08]`; `border-primary-container/30` untuk baris hari ini |

### 4.4 Lapisan dan titik henti

| Lapisan | Nilai |
|---|---|
| Header | `z-50` (Hari Ini, Uang Kas, Periksa, Catat Belanja) atau `z-40` (Recording). Pakai `z-40` untuk semua agar lembar (`z-50`) selalu di atas header |
| Navigasi bawah | `z-40` untuk semua layar; disembunyikan saat lembar terbuka |
| Keypad dock Catat Belanja | `z-30` (sticky di dalam `main`) |
| Lembar dan pemilih | `z-50` |
| Pesan singkat | `z-[60]` |
| Layar lebar | Lembar Recording dan pemilih kandang berpindah ke tengah pada `sm:` (≥640 px) seperti di mockup: `sm:items-center sm:p-4 sm:rounded-2xl` |

Tata letak di atas 640 px tetap satu kolom `max-w-lg` di tengah. Dua panel untuk tablet/desktop (UX_UI_SPEC §16.4) menunggu mockup layar lebar; sampai ada, pakai tampilan HP di tengah layar.

<a id="fd05"></a>
## 5. Kerangka aplikasi

### 5.1 Header

Semua header: `fixed top-0 inset-x-0 z-40 pt-safe`, tinggi isi `h-16 px-gutter flex items-center justify-between`, latar kaca putih, bayangan halus. Ada tiga varian.

| Varian | Dipakai di | Sumber | Isi kiri | Isi kanan |
|---|---|---|---|---|
| **Header ABK** | Hari Ini, Uang Kas ABK, Recording (ABK), layar ABK lain | `hari_ini_abk/code.html` baris 4 | Logo `h-8` · nama "Kandang Manajemen" (`font-headline-md text-body-md font-bold tracking-tight text-on-surface leading-none`) · baris status: titik `w-2 h-2 rounded-full bg-emerald-500 animate-pulse` + teks `font-label-sm text-label-sm text-ink-black-secondary leading-none` | Avatar `w-8 h-8 rounded-full` dalam tautan `p-0.5 rounded-full` ke Akun |
| **Header Owner** | Ringkasan, Periksa Belanja, Recording (Owner), layar Owner lain | `ringkasan_owner_dashboard/code.html` baris 4–7 | Logo `h-8` · nama (`font-label-lg text-label-lg text-on-surface tracking-tight leading-none`) · subjudul `font-body-sm text-body-sm text-ink-black-secondary leading-tight mt-0.5` | Tombol avatar `min-w-[44px] min-h-[44px] p-1 rounded-full` |
| **Header fokus** | Catat Belanja, Mulai Kandang, halaman fokus lain | `catat_belanja_keypad/code.html` baris 4; `mulai_kandang_setup_3_langkah/code.html` baris 4–7 | Tombol kembali `w-11 h-11 -ml-2 rounded-full` ikon `arrow_back text-2xl` · logo `h-7` · judul `font-headline-md text-headline-md text-on-surface font-bold tracking-tight truncate max-w-[200px]` | Avatar `w-8 h-8 rounded-full` |

Latar header disatukan menjadi `bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(31,38,135,0.04)]` untuk semua varian (mockup memakai 75–80% dan dua bentuk bayangan; perbedaannya tidak terlihat). Recording menambah `border-b border-black/[0.05]`; pertahankan hanya di Recording.

**Baris status header:**

| Keadaan | ABK | Owner |
|---|---|---|
| Terhubung | Titik `bg-emerald-500 animate-pulse` + "<Kandang aktif> • Terhubung" | "<Nama usaha> • Mode Owner" |
| Tanpa sinyal | Titik `bg-coral-alert` tanpa pulse + "<Kandang aktif> • Tanpa sinyal" | "<Nama usaha> • Tanpa sinyal" |
| Belum ada penugasan | Titik `bg-ink-black-tertiary` + "Belum ada kandang" | — |

Avatar: R1 tidak punya foto profil. Tampilkan lingkaran `w-8 h-8 rounded-full bg-sky-tint text-primary font-label-md text-label-md font-bold flex items-center justify-center` berisi huruf depan nama (mis. "R"). Tombol avatar punya `aria-label="Akun <nama>"`.

### 5.2 Wadah halaman

| Layar | Kelas `main` |
|---|---|
| Hari Ini, Uang Kas, Periksa Belanja | `flex-1 w-full max-w-lg mx-auto pt-16 pb-28 px-gutter flex flex-col bg-canvas-base` |
| Recording Harian | `flex-1 w-full max-w-lg mx-auto pt-20 pb-36 px-gutter flex flex-col bg-canvas-base` |
| Catat Belanja | `flex-1 w-full max-w-lg mx-auto pt-16 pb-safe px-gutter flex flex-col bg-canvas-base` |
| Ringkasan Owner | `flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface` + isi `flex flex-col w-full px-gutter space-y-space-md pb-6` |
| Mulai Kandang | `flex-1 flex flex-col relative w-full pt-16 pb-safe bg-surface` |

Ringkasan dan Mulai Kandang tidak membatasi lebar di mockup. Tambahkan `max-w-lg mx-auto` pada isi agar layar lebar tetap rapi; di 390 px tidak ada beda.

### 5.3 Navigasi bawah ABK (pil terapung)

Sumber: `hari_ini_abk/code.html` baris 266. Bentuk dipertahankan; label dan tujuan disesuaikan izin ABK (koreksi K-NAV-1).

```html
<nav class="fixed bottom-3 inset-x-0 z-40 px-margin pointer-events-none pb-safe" aria-label="Navigasi utama">
  <div class="max-w-md mx-auto bg-white/85 backdrop-blur-xl rounded-full px-space-xs py-1.5 flex items-center justify-around pointer-events-auto shadow-[0_8px_32px_0_rgba(31,38,135,0.08)]">
    <a aria-current="page" class="flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all active:scale-95 text-primary-container font-semibold" href="/hari-ini">
      <span class="material-symbols-outlined text-xl" aria-hidden="true">calendar_today</span>
      <span class="font-label-sm text-label-sm mt-0.5 tracking-tight">Hari Ini</span>
    </a>
    <a class="flex flex-col items-center justify-center w-14 h-12 rounded-full text-ink-black-secondary transition-all active:scale-95 hover:text-on-surface" href="/uang-kas">
      <span class="material-symbols-outlined text-xl" aria-hidden="true">account_balance_wallet</span>
      <span class="font-label-sm text-label-sm mt-0.5 tracking-tight">Uang Kas</span>
    </a>
    <div class="flex items-center justify-center -mt-5">
      <button type="button" aria-label="Catat" class="w-12 h-12 rounded-full bg-primary-container text-on-primary shadow-[0_6px_20px_rgba(0,117,222,0.40)] flex items-center justify-center transition-all active:scale-90 hover:brightness-105">
        <span class="material-symbols-outlined text-2xl" aria-hidden="true">add</span>
      </button>
    </div>
    <a class="flex flex-col items-center justify-center w-14 h-12 rounded-full text-ink-black-secondary transition-all active:scale-95 hover:text-on-surface" href="/riwayat">
      <span class="material-symbols-outlined text-xl" aria-hidden="true">history</span>
      <span class="font-label-sm text-label-sm mt-0.5 tracking-tight">Riwayat</span>
    </a>
    <a class="flex flex-col items-center justify-center w-14 h-12 rounded-full text-ink-black-secondary transition-all active:scale-95 hover:text-on-surface" href="/lainnya">
      <span class="material-symbols-outlined text-xl" aria-hidden="true">more_horiz</span>
      <span class="font-label-sm text-label-sm mt-0.5 tracking-tight">Lainnya</span>
    </a>
  </div>
</nav>
```

- Item aktif: `text-primary-container font-semibold` + `aria-current="page"`. Item lain: `text-ink-black-secondary`.
- Tombol tengah **Catat** membuka lembar pilihan Catat ([§8](#fd08), resep R-03).
- Recording memakai nav yang sama dengan tambahan `border border-black/[0.04]` pada pil (baris 367). Pertahankan di Recording.

### 5.4 Navigasi bawah Owner (bilah penuh)

Sumber: `ringkasan_owner_dashboard/code.html` baris 366. Dipakai di semua layar Owner, termasuk Periksa Belanja (koreksi K-NAV-2).

| Slot | Ikon | Label | Tujuan | Aktif di |
|---|---|---|---|---|
| 1 | `dashboard` | Ringkasan | Ringkasan | Ringkasan |
| 2 | `receipt_long` + lencana jumlah | Transaksi | Daftar transaksi (Periksa Belanja, Uang Kas, Riwayat Belanja) | Periksa Belanja, Uang Kas Owner, Riwayat Belanja |
| 3 | `add` (tombol bulat, tanpa label terlihat) | `aria-label="Catat"` | Lembar Catat Owner | — |
| 4 | `grid_view` | Kandang | Kandang & Periode, Tim Kandang, Tutup Buku | Layar kandang |
| 5 | `more_horiz` | Lainnya | Laporan, Gaji, Kasbon, Upah Pekerjaan, Ekspor, Status Kirim, Panduan, Akun | Layar di Lainnya |

- Wadah: `fixed bottom-0 w-full z-40 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`, isi `relative flex items-center justify-around h-16 px-space-xs`.
- Item: `flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors`; aktif `text-primary-container font-semibold`; tidak aktif `text-on-surface-variant hover:text-on-surface`. Ikon `text-[24px]`, label `font-label-sm text-label-sm`.
- Lencana Transaksi: `absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-coral-alert text-on-primary font-label-sm text-[9px] flex items-center justify-center`, berisi jumlah belanja **Perlu diperiksa**; disembunyikan bila 0; `aria-label="3 belanja perlu diperiksa"`.
- Tombol Catat: wadah `relative flex items-center justify-center px-1 -top-4`, tombol `w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_8px_20px_rgba(0,117,222,0.35)] transition-transform active:scale-95`, ikon `text-[28px]`.
- **Laporan** pindah ke Lainnya karena mockup Owner memakai empat tujuan + Catat.

### 5.5 Konteks dan status koneksi

| Komponen | Sumber | Kelas inti | Isi |
|---|---|---|---|
| Pil konteks (Hari Ini) | `hari_ini_abk` baris 5–17 | `flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-md rounded-full px-space-md py-space-sm shadow-sm`; ikon `warehouse text-primary text-body-lg`; teks `font-label-md text-label-md text-ink-black-primary truncate`; tombol `bg-sky-tint text-primary px-space-sm py-0.5 rounded-full font-label-sm text-label-sm` "Ganti" + `expand_more` | "<Kandang> · <Periode> · Hari ke-<n> · <Hari, tgl>". "Ganti" hanya tampil bila pengguna ditugaskan ke lebih dari satu kandang |
| Baris koneksi (Hari Ini) | `hari_ini_abk` baris 18–24 | Kiri: titik + `font-label-sm text-label-sm text-ink-black-secondary`; kanan `font-label-sm text-label-sm text-ink-black-tertiary` | Kiri "Online · Data terbaru 16.05" / "Tanpa sinyal · Data terakhir 16.05"; kanan tautan **Status Kirim** (koreksi K-HI-2) |
| Bilah konteks (Recording) | `recording…` baris 9–19 | `flex items-center justify-between py-1 mb-2 text-ink-black-secondary`; ikon `roofing text-base text-primary-container`; pil `bg-sky-tint text-primary` dengan titik `bg-primary-container` | Konteks + pil status periode: **Aktif** / **Persiapan** / **Kandang Kosong** |
| Pil status koneksi (Ringkasan) | `ringkasan…` baris 9–16 | `flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-full shadow-sm`; titik `bg-primary animate-pulse` | "Terhubung · Data terakhir 16.05 WIB" (koreksi K-RO-1); kanan tanggal `font-body-sm text-body-sm text-ink-black-secondary` |
| Strip draf (Catat Belanja) | `catat_belanja_keypad` baris 5–14 | `flex items-center justify-between px-space-md py-space-xs bg-surface-container-low rounded-xl mb-space-md shadow-sm`; titik `bg-secondary-container animate-pulse` | Kiri "Draf tersimpan di HP · 09.10" (hanya setelah penyimpanan lokal berhasil); kanan `cloud_done` "Terhubung" atau `cloud_off` "Tanpa sinyal" (koreksi K-CB-2) |

Semua waktu "Data terbaru/terakhir" berasal dari waktu respons server terakhir yang diterima HP, bukan jam HP saat ini.

<a id="fd06"></a>
## 6. Katalog komponen

Setiap komponen dibangun sekali di IMP-006 dan dipakai ulang. Kolom **Sumber** menunjuk file dan baris di `design/stitch/`. Salin markup dari sana. Kolom **Kelas inti** hanya ringkasan untuk pengecekan.

### 6.1 Permukaan dan tata letak

| Komponen | Sumber | Kelas inti | Aturan |
|---|---|---|---|
| `GlassCard` | `hari_ini_abk` 74–97 | `bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-sm` | Varian alfa 80/85/90/95 dan blur md/xl mengikuti layar sumber. Fallback solid [§3.6](#fd03) |
| `HeroGlassCard` | `hari_ini_abk` 25–73; `uang_kas_abk` 5–65 | `relative overflow-hidden bg-surface-container-lowest/85 backdrop-blur-xl rounded-xl p-space-lg shadow-sm` + dua lingkaran dekorasi `absolute … rounded-full blur-2xl/blur-3xl pointer-events-none` | Lingkaran dekorasi: Hari Ini `bg-secondary-fixed/40` dan `bg-sky-tint/80`; Uang Kas `bg-primary-fixed/40` dan `bg-secondary-fixed/30`. Dimatikan pada **Kurangi Efek Visual** |
| `SectionHeader` | `hari_ini_abk` 98–102, 177–188 | Judul `font-label-md text-label-md text-ink-black-secondary uppercase tracking-wider` atau `font-label-md text-label-md text-ink-black-primary font-bold`; tautan kanan `font-label-sm text-label-sm text-primary` | Dua gaya: huruf kapital (Aksi Catat Cepat, Riwayat Catatan Pakan) dan tebal (Belanja Saya). Lencana jumlah `bg-coral-alert text-on-primary font-label-sm text-label-sm px-1.5 rounded-full` |
| `SectionTitleIcon` | `ringkasan…` 74–82, 124–133 | Ikon `material-symbols-outlined text-primary` + `h2 font-headline-md text-headline-md text-on-surface` + pil kanan | Dipakai Ringkasan untuk judul kelompok |
| `InfoRow` | `uang_kas_abk` 90–97 | `flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-surface-container-low/60 text-ink-black-secondary` | Catatan kecil satu baris dengan ikon kiri dan kanan |
| `TipCallout` | `uang_kas_abk` 300–310; `hari_ini_abk` 244–255 | Gradien `bg-gradient-to-r from-sky-tint/60 to-surface-container-lowest/60` atau `bg-surface-container-low` + ikon dalam lingkaran | Hanya teks bantuan yang benar. Tidak boleh berisi janji yang belum pasti |

### 6.2 Tombol

| Komponen | Sumber | Kelas inti | Pemakaian |
|---|---|---|---|
| `PrimaryButton` (lebar penuh) | `hari_ini_abk` 57–61 | `w-full bg-primary-container text-on-primary font-label-lg text-label-lg py-3 px-space-md rounded-lg flex items-center justify-center gap-space-xs shadow-[0_6px_20px_rgba(0,117,222,0.30)] active:scale-[0.98] transition-all` | Satu aksi utama per bagian. Varian `rounded-xl py-3.5` di Catat Belanja/Mulai Kandang; `rounded-xl py-3` di Periksa |
| `PrimaryButtonCompact` | `recording…` 26–31 | `inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-container text-on-primary font-label-sm text-label-sm font-bold shadow-[0_3px_12px_rgba(0,117,222,0.3)]` | Tombol **Catat Pakan/Catat Mati & Afkir/Catat Sampling** di kanan judul |
| `SecondaryButton` | `recording…` 349–365 | `flex-1 py-2.5 px-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold` | **Simpan Draf**, **Batal**, **Ubah** |
| `TonalButton` | `hari_ini_abk` 143–176 | `bg-primary-fixed text-on-primary-fixed font-label-md text-label-md px-3 py-1.5 rounded-lg flex items-center gap-1` | **Kirim Ulang** |
| `TonalBlueButton` | `periksa_belanja_owner` 156–174 | `w-full py-2.5 rounded-xl bg-sky-tint hover:bg-primary-fixed text-primary font-label-md text-label-md flex items-center justify-center gap-1.5` | **Minta Perbaikan** |
| `TonalDangerButton` | `periksa_belanja_owner` 156–174 | `w-full py-2.5 rounded-xl bg-error-container/40 hover:bg-error-container text-coral-alert font-label-md text-label-md flex items-center justify-center gap-1.5` | **Tolak Belanja** |
| `TextButton` | `hari_ini_abk` 42–49; `recording…` 289–300 | `text-primary font-label-md text-label-md flex items-center gap-0.5 px-space-xs py-1 rounded-lg hover:bg-sky-tint/50` | **Kenapa?**, **Tambah Jenis**, **Semua**, **Filter** |
| `ChipButton` | `hari_ini_abk` 62–73 | `font-label-md text-label-md text-primary bg-surface-container-lowest/90 px-space-sm py-1 rounded-md shadow-sm` | **Buka** di baris pendamping |
| `IconButton` bulat | `recording…` 252–266 | `w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-black-secondary` | Tutup lembar. Wajib `aria-label="Tutup"`. Area sentuh diperbesar ke 44×44 dengan `before:` atau padding tanpa mengubah lingkaran 32 px |

Semua tombol yang sedang mengirim diberi `disabled` + ikon `progress_activity animate-spin` di kiri label, dan tidak bisa ditekan dua kali. Tombol yang butuh sinyal saat offline: `opacity-50 cursor-not-allowed` + baris alasan `font-label-sm text-label-sm text-ink-black-secondary` di bawahnya ("Perlu sinyal untuk membukukan.").

### 6.3 Pil status

Label hanya dari UX_UI_SPEC §15.1. Bentuk dan warna mengikuti layar sumber.

| Label | Kelas | Sumber |
|---|---|---|
| **Belum Ada Data** | `bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md px-2 py-0.5 rounded-full` | `hari_ini_abk` 74–97 |
| **Draf** (baris recording) | `inline-flex items-center gap-1 px-1.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] font-semibold` + titik `w-1.5 h-1.5 rounded-full bg-secondary-container` | `recording…` 71–98 |
| **Tercatat** | `inline-flex items-center gap-1 px-1.5 rounded bg-emerald-100 text-emerald-800 font-label-sm text-[10px] font-semibold` + ikon `done text-[11px]` | `recording…` 99–122 |
| **Dikoreksi** | Sama dengan Tercatat, ikon `edit` | Turunan |
| **Catatan Berubah** | `inline-flex items-center gap-1 px-1.5 rounded bg-error-container text-coral-alert font-label-sm text-[10px] font-semibold` + ikon `sync_problem text-[11px]` | Turunan dari pil Menunggu Kirim |
| **Menunggu Kirim** | `bg-error-container text-coral-alert font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold` | `hari_ini_abk` 143–176 |
| **Mengirim** / **Belum Pasti Terkirim** / **Gagal Simpan** | Bentuk sama dengan Menunggu Kirim; Mengirim memakai `bg-sky-tint text-primary` + `progress_activity animate-spin` | Turunan |
| **Foto Menunggu Kirim** / **Tanpa Foto** | `bg-surface-container text-ink-black-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1` + ikon `image` / `hide_image` | `hari_ini_abk` 143–176, 189–215 |
| **Menunggu Owner** (Hari Ini) | `bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full` | `hari_ini_abk` 189–215 |
| **Menunggu Owner** (Periksa) | `text-label-sm font-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed inline-flex items-center gap-1` + titik `w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse` | `periksa_belanja_owner` 53–81 |
| **Menunggu Owner** (Uang Kas) | `mt-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-label-sm text-label-sm flex items-center gap-1` + titik `w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse` | `uang_kas_abk` 112–131 |
| **Dibukukan** (Hari Ini) | `bg-sky-tint text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full` | `hari_ini_abk` 216–243 |
| **Dibukukan** (Uang Kas) | `px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1` + `done_all` | `uang_kas_abk` 163–182 |
| **Belum Dicek Owner** | Sama dengan Menunggu Owner pada layar yang sama | Turunan |
| **Perlu Dilengkapi** / **Ditolak** | Perlu Dilengkapi = kuning; Ditolak = `bg-error-container text-coral-alert` | Turunan |
| **Aktif** / **Persiapan** / **Kandang Kosong** (periode) | Aktif `bg-sky-tint text-primary` + titik `bg-primary-container`; Persiapan `bg-secondary-fixed text-on-secondary-fixed`; Kandang Kosong `bg-surface-container-high text-ink-black-secondary` | `recording…` 9–19; `ringkasan…` 273–305 |
| **Data Belum Lengkap** | `px-2 py-0.5 rounded-full bg-surface-container-high text-ink-black-secondary font-label-sm text-label-sm` | `ringkasan…` 171–188 |

Pil selalu berisi teks. Ikon atau titik hanya pelengkap.

### 6.4 Kartu dan baris

| Komponen | Sumber | Isi | Aturan |
|---|---|---|---|
| `NextStepHero` (Saran Utama) | `hari_ini_abk` 25–73 | Ikon terisi `edit_note` dalam kotak `w-10 h-10 rounded-xl bg-secondary-fixed`; label "Saran Utama" `bg-secondary-fixed-dim/30 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full`; judul `h2 font-headline-md text-headline-md text-on-surface`; alasan tersembunyi `#why-box bg-sky-tint/70 rounded-lg p-space-sm`; PrimaryButton; baris pendamping opsional | Satu saran dari data nyata ([UX-17](PRD.md#s21)). **Kenapa?** membuka/menutup `why-box` di tempat dengan `aria-expanded`. **Nanti** untuk saran opsional memakai TextButton di kiri **Kenapa?** (turunan) |
| `CompanionAlert` | `hari_ini_abk` 62–73 | `flex items-center justify-between bg-error-container/40 rounded-lg px-space-md py-space-sm`; ikon `cloud_off text-coral-alert`; teks `font-body-sm text-body-sm`; ChipButton | Paling banyak dua saran pendamping |
| `StatusRecordingCard` | `hari_ini_abk` 74–97 | Ikon `assignment_late` dalam kotak `w-12 h-12 rounded-xl bg-surface-container-low`; label kecil; pil status; teks "Kemarin dicatat …"; cincin kemajuan | Cincin = bagian wajib yang sudah terisi hari ini: Pakan dan Mati & Afkir (0%, 50%, 100%). Sampling tidak dihitung karena tidak wajib harian. Teks persen wajib ada |
| `QuickActionTile` (4 kolom) | `hari_ini_abk` 98–130 | `flex flex-col items-center justify-center p-space-sm bg-surface-container-lowest/80 backdrop-blur-md rounded-xl shadow-sm active:scale-95 text-center gap-1.5 group`; kotak ikon `w-11 h-11 rounded-xl` warna per aksi; label `font-label-sm text-label-sm text-on-surface font-semibold leading-tight` | Warna kotak ikon: Catat Belanja `bg-sky-tint text-primary`; Terima Uang `bg-secondary-fixed text-on-secondary-fixed`; Upah Pekerjaan `bg-tertiary-fixed text-on-tertiary-fixed`; Uang Kas `bg-surface-container-high text-on-surface` |
| `QuickActionTile3` | `uang_kas_abk` 66–89 | Grid 3; tile utama `bg-primary-container text-on-primary shadow-[0_6px_20px_rgba(0,117,222,0.30)]`, tile lain kaca `bg-surface-container-lowest/80 backdrop-blur-xl`; kotak ikon bulat `w-9 h-9 rounded-full` | Hanya satu tile biru per baris |
| `PendingCard` | `hari_ini_abk` 131–176 | Kartu kaca 90% dengan garis kiri `absolute left-0 top-0 bottom-0 w-1.5 bg-coral-alert`; kotak ikon `bg-error-container text-on-error-container`; judul `font-label-lg … font-bold truncate`; nominal `font-headline-md text-headline-md text-primary font-bold`; dua pil; teks + TonalButton | Untuk catatan **Menunggu Kirim**, **Belum Pasti Terkirim**, **Gagal Simpan** dari HP ini |
| `ListCard` (Belanja Saya) | `hari_ini_abk` 189–243 | Kotak ikon `w-10 h-10 rounded-lg`; judul `h4 font-label-lg … font-semibold truncate`; "Dibayar dengan: …"; nominal kanan `font-headline-md text-headline-md font-bold`; pil; baris bawah foto + tanggal `text-ink-black-tertiary font-body-sm` | Seluruh kartu dapat diketuk untuk membuka detail |
| `ExpandableTxCard` | `uang_kas_abk` 110–299 | `tx-card overflow-hidden rounded-xl bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_4px_18px_rgba(31,38,135,0.04)]`; kepala `tx-header p-3.5 flex items-center justify-between`; laci `tx-drawer px-3.5 pb-3.5 pt-1 bg-surface-container-low/30` berisi grid 2 kolom label/nilai + foto nota opsional | Satu laci terbuka pada satu waktu (seperti mockup). Kepala adalah `button` dengan `aria-expanded` dan `aria-controls`. Warna nominal: keluar belum dibukukan `text-coral-alert`; keluar dibukukan `text-on-surface`; masuk `text-primary` |
| `ReviewArticle` | `periksa_belanja_owner` 51–237 | Terbuka: `bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl shadow-md`; tertutup: `bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl shadow-sm p-space-md` | Banyak baris boleh terbuka bersamaan; **Tutup Semua** menutup semuanya |
| `HolderCard` | `ringkasan…` 198–255 | Inisial dalam lingkaran, nama "Uang Kas <nama>", subjudul, "Perkiraan di Tangan" kanan, baris saldo dibukukan/belanja menunggu, catatan bila perkiraan belum pasti | Nilai "Belum dapat dipastikan" memakai gaya teks italik merah pada mockup |
| `MoneyStatCard` | `ringkasan…` 134–170 | `p-space-md rounded-xl bg-surface-container-lowest shadow-sm`; label kecil; nominal `font-headline-xl-mobile text-headline-xl-mobile font-bold`; ikon kanan dalam kotak; baris rincian | Nominal kuning tua `text-tertiary` untuk Belanja Belum Dibukukan |
| `UnknownResultCard` | `ringkasan…` 171–188 | `p-space-md rounded-xl bg-surface-container-low shadow-sm`; teks `font-headline-md text-headline-md text-ink-black-secondary font-medium italic` "Belum dapat dihitung" + kotak alasan | Tidak pernah menampilkan Rp0 sebagai hasil |
| `StatTile3` | `ringkasan…` 93–110 | Wadah `p-3 rounded-lg bg-sky-tint/50`; grid 3 `bg-surface-container-lowest p-1.5 rounded-md`; label + nilai; Mati memakai `text-coral-alert` | Ringkasan recording kemarin: Pakan, Mati, Afkir |
| `SummaryMiniCard` | `recording…` 47–64 | `bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-3 mb-3 border border-black/[0.05] shadow-sm flex items-center justify-between` | Satu per tab Recording ([§7.2](#fd07)) |
| `HistoryRow` | `recording…` 65–245 | Baris hari ini: `bg-surface-container-lowest rounded-xl p-2.5 border border-primary-container/30 shadow-sm relative overflow-hidden` + garis kiri `w-1 bg-primary-container` + tombol `edit`. Baris lain: `bg-surface-container-lowest/90 rounded-xl p-2.5 border border-black/[0.05] shadow-sm` + ikon `check_circle text-ink-black-tertiary text-lg` | Seluruh baris dapat diketuk membuka lembar tanggal tersebut |

### 6.5 Isian

| Komponen | Sumber | Kelas inti | Aturan |
|---|---|---|---|
| `FieldLabel` | `recording…` 269–275 | `font-label-sm text-label-sm font-semibold text-on-surface flex items-center gap-1.5` + ikon `text-sm text-primary-container`; teks kanan `font-label-sm text-label-sm text-ink-black-tertiary` | Label selalu terlihat, tidak diganti placeholder. Tanda wajib `*` merah seperti Catat Belanja |
| `FieldLabelLarge` | `catat_belanja_keypad` 28–37 | `font-label-lg text-label-lg text-on-surface` + `*` `text-coral-alert` + contoh kanan | Dipakai di kartu Catat Belanja dan Mulai Kandang |
| `TextInput` | `catat_belanja_keypad` 38–42; `mulai_kandang…` 66–84 | Latar `bg-surface-container-low`, radius `rounded-xl`, tanpa garis tepi di Catat Belanja; ikon kanan dalam isian di Mulai Kandang | Tombol hapus teks `cancel` punya `aria-label="Hapus teks"` |
| `Select` | `recording…` 289–309 | `w-full bg-surface-container-low border border-black/[0.08] text-on-surface font-label-md text-label-md rounded-xl p-3 pr-10 appearance-none` + ikon `expand_more absolute right-3` | Hanya satu panah (koreksi K-REC-8) |
| `QtyInput` | `recording…` 310–336 | Wadah `flex-1 flex items-center bg-surface-container-low border border-black/[0.08] rounded-xl overflow-hidden focus-within:border-primary-container`; angka `font-headline-md text-headline-md font-bold text-center`; satuan `bg-surface-container px-3 py-3 text-ink-black-secondary font-label-md` | Input `type="text" inputmode="none"` (keypad aplikasi) atau `inputmode="decimal"` (Keyboard HP). Tanpa garis dalam (koreksi K-REC-7). Kotak konversi `w-28` hanya tampil bila berat per sak diketahui |
| `Textarea` | `recording…` 337–348 | `w-full p-2.5 rounded-xl bg-surface-container-low border border-black/[0.08] font-body-sm text-body-sm resize-none` | Opsional; label "Opsional" di kanan |
| `DateSegment` (lembar) | `recording…` 269–288 | Wadah `grid grid-cols-3 gap-1.5 p-1 bg-surface-container rounded-lg`; terpilih `rounded bg-surface-container-lowest text-primary font-semibold shadow-sm` + `check`; lain `text-ink-black-secondary` | Label "Hari ini (23)", "Kemarin (22)", "Pilih". **Pilih** membuka pemilih tanggal bawaan HP. Penanda bila bukan hari ini ada di kepala lembar |
| `DateButtons` (halaman) | `catat_belanja_keypad` 94–108 | Grid 3; terpilih `rounded-xl bg-primary text-on-primary font-bold shadow-sm` + `check`; lain kaca abu | Dipakai di Catat Belanja |
| `ChoiceCard` | `catat_belanja_keypad` 109–154 | Terpilih `payment-card p-space-md rounded-xl bg-primary-fixed/40` + lingkaran centang biru; lain `bg-surface-container-low` + lingkaran kosong | Radio asli tersembunyi di dalam kartu (`role="radio"` pada kartu tidak cukup). Tidak ada pilihan terpilih otomatis bila datanya fakta (sumber uang, barang diterima) |
| `CategoryChips` | `catat_belanja_keypad` 43–64 | Baris gulir `flex items-center gap-2 overflow-x-auto pb-1`; terpilih `bg-primary text-on-primary font-bold` + "✓"; lain `bg-surface-container-high text-on-surface-variant` | Isi dari riwayat pengguna sendiri, maksimal 5. Mengetuk hanya mengisi teks |
| `RadioCardPair` | `periksa_belanja_owner` 110–145 | Grid 2; terpilih `bg-primary-container text-on-primary` (Sudah Diterima) atau `bg-sky-tint/80` dengan radio (Periode 01) | Dua bentuk sesuai file |
| `SegmentedTimezone` | `mulai_kandang…` 85–105 | Grid 3 tombol `bg-surface-container` / terpilih `bg-primary-container text-on-primary shadow-sm`; dua baris teks (WIB / UTC+7) | Tidak ada yang terpilih otomatis (koreksi K-MK-3) |
| `ModeCard` | `mulai_kandang…` 176–239 | Kartu kaca dengan lingkaran centang, judul `h3 font-headline-md`, deskripsi, chip fitur | Tidak ada yang terpilih otomatis (koreksi K-MK-4) |
| `BuildingRow` | `mulai_kandang…` 106–153 | Huruf bangunan dalam kotak, nama + lokasi, isian kapasitas `w-24` + "ekor"; total `bg-sky-tint p-3 rounded-lg` | Tambah **Tambah Bangunan** (TextButton) di bawah daftar; total dihitung dari isian |

### 6.6 Nominal dan keypad (D-26)

| Komponen | Sumber | Kelas inti | Aturan |
|---|---|---|---|
| `NominalDisplay` | `catat_belanja_keypad` 76–85 | Wadah `flex flex-col items-center justify-center p-space-md bg-sky-tint/60 rounded-xl mb-2 text-center shadow-inner`; "Rp" `font-headline-md text-headline-md text-primary font-bold`; angka `font-headline-xl-mobile text-headline-xl-mobile text-primary font-extrabold tracking-tight`; ejaan `font-body-sm text-body-sm text-on-surface-variant font-medium mt-1 lowercase` | Kosong: angka "0" dengan `opacity-40` dan ejaan "ketuk angka di keypad". Nilai disimpan sebagai string digit, kosong ≠ 0. Elemen angka punya `role="textbox"`, `aria-label="Nominal"`, `aria-describedby` ke ejaan |
| `KeypadDock` | `catat_belanja_keypad` 186–end | Wadah `sticky bottom-0 z-30 -mx-gutter px-gutter pt-3 pb-safe bg-surface-container-lowest/95 backdrop-blur-2xl shadow-xl rounded-t-3xl`; toolbar; grid `grid grid-cols-3 gap-2 mb-3`; tombol angka `h-12 bg-surface-container-low active:bg-primary-fixed rounded-xl font-headline-md text-headline-md text-on-surface font-semibold shadow-sm active:scale-95`; `000` dan hapus `h-12 bg-surface-container-high text-primary …`; PrimaryButton; catatan kaki | Toolbar: **Keyboard HP** (`keyboard`, pil `bg-surface-container`), pintasan **+50rb** dan **+100rb** (pil `bg-sky-tint text-primary`). Pintasan menambah ke nilai saat ini, bukan mengganti, dan tidak pernah aktif sendiri. Tombol hapus `aria-label="Hapus satu angka"`, `000` `aria-label="nol nol nol"` |
| `KeypadInSheet` | Turunan dari `KeypadDock` | Grid dan tombol sama, tanpa toolbar pintasan, di bawah isian aktif di dalam lembar | Untuk kuantitas: tombol kiri bawah **,** (koma). Untuk ekor: tombol kiri bawah kosong (`invisible`) dan isian punya tombol −/+ (`StepperButtons`). Tombol **Lanjut** dan **Selesai** di toolbar sebagai TextButton |
| `StepperButtons` | Turunan dari `IconButton` | Dua tombol `w-11 h-11 rounded-xl bg-surface-container-high text-on-surface` ikon `remove`/`add` mengapit `QtyInput` | Kosong − tidak berbuat apa-apa; tidak turun di bawah 0; label "Kurangi mati satu ekor"/"Tambah mati satu ekor" |

### 6.7 Lembar, pemilih, dan pesan

| Komponen | Sumber | Kelas inti | Aturan |
|---|---|---|---|
| `BottomSheet` | `recording…` 246–365 | Scrim `fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-black-primary/60 backdrop-blur-sm`; kartu `w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl border border-white/40 flex flex-col max-h-[90vh] overflow-hidden`; kepala `px-5 pt-4 pb-3 border-b border-black/[0.06] flex items-center justify-between bg-surface-bright/80 backdrop-blur-md`; isi `p-5 overflow-y-auto space-y-4`; kaki `p-4 bg-surface-container-lowest border-t border-black/[0.06] flex flex-col gap-2` | `role="dialog" aria-modal="true" aria-labelledby`. Fokus ke judul saat buka, kembali ke pemicu saat tutup. Tombol Kembali HP menutup lembar. Draf tidak hilang saat ditutup. Satu lembar aktif. Nav bawah disembunyikan saat lembar terbuka |
| `PickerSheet` | `ringkasan…` 306–365 | Scrim `bg-ink-black-primary/40 backdrop-blur-xs`, kartu `w-full max-w-sm bg-surface-container-lowest rounded-2xl p-space-md shadow-xl`; baris pilihan terpilih `bg-sky-tint` + `check`; lain + `chevron_right`; tombol **Tutup** | Pemilih kandang/periode. Hanya kandang yang boleh dilihat |
| `ImpactBox` | `periksa_belanja_owner` 146–155 | `bg-secondary-fixed/30 backdrop-blur-md p-space-md rounded-xl flex items-start gap-space-sm text-on-secondary-fixed`; ikon `calculate`; judul + kalimat dengan bagian tebal | Kalimat dampak dihitung dari pilihan saat ini. Diulang di lembar konfirmasi |
| `InfoBanner` | `periksa_belanja_owner` 42–48 | `flex items-center gap-space-sm bg-sky-tint/80 backdrop-blur-md p-space-sm px-space-md rounded-xl text-primary`; ikon `info text-lg`; teks `font-body-sm text-body-sm leading-tight` | Satu kalimat |
| `WarningPill` | `periksa_belanja_owner` 194–200 | `flex items-center gap-1.5 bg-error-container/30 px-space-sm py-1.5 rounded-lg text-coral-alert` + `warning` | Peringatan mirip/angka tidak biasa, tidak memblokir |
| `SmartAdvice` | `catat_belanja_keypad` 86–93 | `flex items-start gap-2 bg-secondary-fixed/50 p-2.5 rounded-xl`; ikon `info text-secondary text-base mt-0.5`; teks kecil dengan nominal tebal | Bantuan pintar UX-19; tidak memblokir |
| `Toast` | Turunan | `fixed inset-x-gutter bottom-24 z-[60] max-w-md mx-auto bg-inverse-surface text-inverse-on-surface rounded-xl px-space-md py-3 shadow-xl font-body-md text-body-md flex items-center justify-between gap-space-sm`; aksi **Urungkan** `text-inverse-primary font-label-lg` | `role="status" aria-live="polite"`. Muncul setelah lembar tertutup. **Urungkan** hanya untuk aksi lokal |
| `EmptyState` | Turunan | GlassCard berisi ikon `text-ink-black-tertiary text-[40px]`, judul `font-label-lg`, satu kalimat `font-body-sm text-ink-black-secondary`, tombol aksi pertama | "Belum ada …", dibedakan dari "Tidak ada … di bagian ini" |
| `LoadingSkeleton` | Turunan | Bentuk kartu yang sama dengan `bg-surface-container animate-pulse rounded-xl` | Tidak pernah menampilkan Rp0 atau 0 ekor saat memuat |
| `OfflineStrip` | Turunan dari baris koneksi | Titik `bg-coral-alert` + "Tanpa sinyal · Data terakhir 16.05" | Tidak menutup isi; aksi yang butuh sinyal nonaktif dengan alasan |

<a id="fd07"></a>
## 7. Blueprint layar yang punya mockup

Format setiap layar: identitas, susunan bagian (urutan dari atas), keadaan, perilaku, dan kode koreksi dari [§9](#fd09). Kolom **Baris** menunjuk `code.html` layar tersebut. Data selalu dari API; kolom **Data** menyebut sumbernya.

### 7.1 Hari Ini — ABK (V-02)

| Item | Nilai |
|---|---|
| Rute | `/hari-ini` (beranda ABK) |
| Acuan | [code.html](design/stitch/hari_ini_abk/code.html), [acuan 390](design/stitch/hari_ini_abk/reference-390-viewport.png), [halaman penuh](design/stitch/hari_ini_abk/reference-390-full.png) |
| Kerangka | Header ABK · `main` pb-28 · nav ABK, **Hari Ini** aktif |
| Kartu IMP | IMP-021, IMP-047 (saran), IMP-019 (Status Kirim), IMP-028 (belanja) |
| Data | QRY-03 recording tanggal ini, daftar catatan lokal HP, belanja milik pengguna (terbaru 2), saran dari mesin arahan IMP-047 |

| No | Bagian | Baris | Komponen | Isi dan aturan |
|---|---|---|---|---|
| 1 | Pil konteks | 5–17 | Pil konteks | "Kandang Utara · Periode 01 · Hari ke-18 · Rabu, 23 Sep 2026". **Ganti** membuka `PickerSheet` kandang bila penugasan lebih dari satu |
| 2 | Baris koneksi | 18–24 | Baris koneksi | "Online · Data terbaru 16.05" / "Tanpa sinyal · Data terakhir 16.05"; kanan **Status Kirim** (K-HI-2) |
| 3 | Saran Utama | 25–61 | `NextStepHero` | Judul dan alasan dari mesin saran. Contoh: "Isi Recording Harian" · "Belum ada catatan untuk hari ini." · **Kenapa?** "Kandang ini memakai Recording Harian dan tanggal 23 Sep belum ada catatan." · tombol **Isi Recording** membuka Recording pada tab pertama yang belum terisi |
| 4 | Pendamping | 62–73 | `CompanionAlert` | Mis. "1 catatan belum terkirim dari HP ini." + **Buka** (gulir ke bagian 7). Maksimal dua baris |
| 5 | Status Recording | 74–97 | `StatusRecordingCard` | Pil status hari ini; "Kemarin dicatat Yanto, 16.05"; cincin kemajuan (§6.4). Seluruh kartu dapat diketuk ke Recording |
| 6 | Aksi Catat Cepat | 98–130 | `SectionHeader` + 4 `QuickActionTile` | **Catat Belanja**, **Terima Uang**, **Upah Pekerjaan** (K-HI-3), **Uang Kas**. Tautan kanan **Semua** membuka lembar Catat (K-HI-4) |
| 7 | Belum Terkirim dari HP Ini | 131–176 | `SectionHeader` + `PendingCard` | Lencana jumlah; tautan kanan **Status Kirim** (K-HI-5). Satu kartu per catatan tertahan, maksimal 3, lalu tautan "Lihat semua". Bagian hilang bila kosong |
| 8 | Belanja Saya | 177–243 | `SectionHeader` + `ListCard` | "2 Transaksi Terakhir" · **Semua** ke Riwayat Belanja. Kartu: ikon kategori, keperluan, "Dibayar dengan: …", nominal, pil status, foto, tanggal |
| 9 | Catatan aman | 244–255 | `TipCallout` | "Catatan Aman di HP" · "Catatan tersimpan di HP sebelum dikirim." (K-HI-6). Hanya tampil bila penyimpanan lokal berfungsi |

**Keadaan:**

| Keadaan | Perubahan |
|---|---|
| Recording hari ini belum ada | Seperti mockup |
| Recording sudah tercatat | Saran utama berganti ke saran lain yang relevan atau disembunyikan; kartu 5 memakai pil **Tercatat** dan teks "Tercatat oleh Yanto, 16.00"; cincin 100% |
| Recording **Tidak aktif** atau periode **Persiapan** | Kartu 5 disembunyikan; saran tidak menyebut recording; nilai tidak ditampilkan sebagai 0 |
| Tanpa sinyal | Baris koneksi berubah; header "• Tanpa sinyal"; semua aksi tetap bisa (tersimpan di HP) |
| Belum ditugaskan ke kandang | Hanya header, pil konteks "Belum ada kandang yang ditugaskan", `EmptyState` "Hubungi Owner untuk penugasan." |
| Memuat | `LoadingSkeleton` untuk kartu 3, 5, 8 |

**Ikon kategori belanja** (kotak `w-10 h-10 rounded-lg`): listrik `bolt` (`bg-sky-tint text-primary`), gas `propane_tank` (`bg-surface-container-high`), solar `local_gas_station`, sekam/karung `inventory_2`, lain `receipt_long`. Kategori dari kata kunci keperluan; bila tidak dikenal pakai `receipt_long`.

<a id="fd07-rec"></a>
### 7.2 Recording Harian — bertab (V-06)

| Item | Nilai |
|---|---|
| Rute | `/periode/:id/recording?tab=pakan` (juga `mortalitas`, `sampling`), `&tanggal=YYYY-MM-DD`, `&lembar=1` |
| Acuan | [code.html](design/stitch/recording_harian_tab_riwayat_ringkas/code.html), [tab Pakan](design/stitch/recording_harian_tab_riwayat_ringkas/reference-390-tab-pakan-viewport.png), [lembar Pakan](design/stitch/recording_harian_tab_riwayat_ringkas/reference-390-lembar-pakan-viewport.png) |
| Kerangka | Header sesuai peran (+ `border-b border-black/[0.05]`) · `main` pt-20 pb-36 · nav sesuai peran |
| Peran | ABK yang ditugaskan dan Owner. Satu catatan bersama per periode dan tanggal (K-25) |
| Kartu IMP | IMP-020 (server), IMP-021 (layar dan konflik), IMP-022 (offline) |
| Data | QRY-03 `daily.recording` (nilai berlaku + riwayat), CMD-21 `daily_summary.save` |

**Keputusan pengguna:** Recording Harian **wajib berbentuk tab**: **Pakan**, **Mortalitas**, **Sampling**. Mockup hanya berisi tab Pakan. Tab Mortalitas dan Sampling di bawah adalah turunan resmi dengan pola yang sama persis. Bila pengguna kelak memberi mockup kedua tab ini, mockup tersebut menggantikan §7.2.4–§7.2.5.

#### 7.2.1 Susunan halaman (sama untuk semua tab)

| No | Bagian | Baris | Komponen | Isi dan aturan |
|---|---|---|---|---|
| 1 | Bilah konteks | 9–19 | Bilah konteks | "Kandang Utara · Periode 01 · Hari ke-18 · Rabu, 23 Sep 2026" + pil **Aktif** |
| 2 | Judul + tombol | 20–31 | `h1 font-headline-md text-headline-md font-bold text-on-surface tracking-tight` + subjudul `font-body-sm text-body-sm text-ink-black-secondary` + `PrimaryButtonCompact` | Judul "Recording Harian"; subjudul "Catatan konsumsi & pemantauan kandang"; tombol berubah per tab: **Catat Pakan** / **Catat Mati & Afkir** / **Catat Sampling**. Tombol membuka lembar untuk tanggal hari ini |
| 3 | Tab | 32–46 | `SegmentedTabs` | Tiga tab sama lebar (`flex-1`). Lihat §7.2.2 |
| 4 | Ringkasan tab | 47–64 | `SummaryMiniCard` | Isi per tab |
| 5 | Judul riwayat | 65–70 | `SectionHeader` gaya kapital | "Riwayat Catatan Pakan" / "Riwayat Mati & Afkir" / "Riwayat Sampling"; kanan "Urut Terbaru" |
| 6 | Riwayat | 71–245 | `HistoryRow` × n | Satu baris per tanggal, terbaru di atas, termasuk tanggal tanpa catatan (§7.2.3). Muat 14 hari, lalu TextButton "Muat lebih lama" |
| 7 | Lembar input | 246–365 | `BottomSheet` | Isi per tab (§7.2.6). Terbuka bila `lembar=1` di alamat |

#### 7.2.2 Tab

```html
<div role="tablist" aria-label="Bagian Recording Harian"
     class="p-1 bg-surface-container/80 rounded-xl flex items-center gap-1 mb-3 border border-black/[0.04] shadow-inner">
  <!-- aktif -->
  <button role="tab" aria-selected="true" aria-controls="panel-pakan" id="tab-pakan" type="button"
          class="flex-1 py-1.5 px-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm font-label-md text-label-md font-bold text-center flex items-center justify-center gap-1.5 transition-all">
    <span class="material-symbols-outlined text-base text-primary-container" aria-hidden="true">inventory_2</span>
    <span>Pakan</span>
  </button>
  <!-- tidak aktif -->
  <button role="tab" aria-selected="false" aria-controls="panel-mortalitas" id="tab-mortalitas" tabindex="-1" type="button"
          class="flex-1 py-1.5 px-2 rounded-lg text-ink-black-secondary hover:text-on-surface font-label-md text-label-md font-semibold text-center flex items-center justify-center gap-1.5 transition-colors">
    <span class="material-symbols-outlined text-base text-coral-alert" aria-hidden="true">heart_broken</span>
    <span>Mortalitas</span>
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-sampling" id="tab-sampling" tabindex="-1" type="button"
          class="flex-1 py-1.5 px-2 rounded-lg text-ink-black-secondary hover:text-on-surface font-label-md text-label-md font-semibold text-center flex items-center justify-center gap-1.5 transition-colors">
    <span class="material-symbols-outlined text-base text-primary" aria-hidden="true">scale</span>
    <span>Sampling</span>
  </button>
</div>
```

- Tab aktif memakai kelas tombol pertama; tab lain kelas tombol kedua. Warna ikon **tetap** per tab (Pakan `text-primary-container`, Mortalitas `text-coral-alert`, Sampling `text-primary`) baik aktif maupun tidak.
- Bagian 4–6 berada di dalam `<div role="tabpanel" id="panel-…" aria-labelledby="tab-…">`.
- Keyboard: panah kiri/kanan pindah tab, Home/End ke tab pertama/terakhir (pola ARIA tabs). Ketuk tab tidak menambah riwayat browser; tab dicatat di alamat dengan `replaceState` (`?tab=`), sehingga muat ulang membuka tab yang sama.
- Tab awal: dari `?tab=`. Tanpa `?tab=`, buka tab pertama yang bagian hari ininya belum terisi (Pakan → Mortalitas); bila semua terisi, Pakan.
- Tanda kecil pada tab bila bagian hari ini belum terisi: titik `w-1.5 h-1.5 rounded-full bg-secondary-container` di kanan label, dengan teks tersembunyi "belum diisi hari ini". Sampling tidak diberi tanda karena tidak wajib harian.
- Pindah tab tidak menutup atau mengirim draf. Draf per tab tersimpan sendiri di HP.

#### 7.2.3 Tab Pakan (persis mockup)

**Ringkasan tab** (baris 47–64):

| Elemen | Kelas | Isi |
|---|---|---|
| Kotak ikon | `w-9 h-9 rounded-lg bg-sky-tint text-primary` + `analytics text-xl` | — |
| Label | `font-label-sm text-label-sm text-ink-black-secondary` | "Total Pakan Tercatat" |
| Nilai | `font-headline-md text-body-lg font-bold text-on-surface` + konversi `font-label-sm text-label-sm text-ink-black-tertiary font-normal` | Jumlah pakan semua tanggal **Tercatat** di periode ini, mis. "545 kg" + "(≈ 10,9 sak)" hanya bila berat per sak diketahui untuk semua jenis |
| Chip | `inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container text-ink-black-secondary font-label-sm text-label-sm` + `calendar_today text-xs` | "6 hari data" = jumlah tanggal Tercatat yang punya nilai pakan |
| Rata-rata | `text-[11px] text-ink-black-tertiary mt-0.5` | "Rata-rata: 90,8 kg/hr" = total ÷ hari data, satu desimal koma |

Draf dan catatan Menunggu Kirim tidak ikut dihitung. Angka di mockup (520 kg, 5 hari, 104 kg/hr) hanya contoh dan tidak cocok dengan daftarnya; hitung dari data.

**Baris riwayat** (baris 71–245):

| Elemen | Kelas | Isi |
|---|---|---|
| Tanggal | `font-label-md text-label-md font-bold text-on-surface` | "Selasa, 22 Sep 2026" |
| Pil status | §6.3 | **Draf**, **Menunggu Kirim**, **Tercatat**, **Dikoreksi**, **Catatan Berubah**, atau **Belum Ada Data** |
| Hari ke- | Hari ini `text-[11px] text-primary font-medium`; lain `text-[11px] text-ink-black-tertiary` | "Hari ke-17" |
| Nilai | Nama jenis `font-label-md text-label-md font-semibold text-ink-black-primary` (hari ini `text-primary`); jumlah `font-headline-md text-body-md font-bold text-on-surface`; konversi `font-label-sm text-label-sm text-ink-black-tertiary` | "Pakan BR-1  96 kg  ≈ 1,9 sak". Beberapa jenis: satu baris nilai per jenis |
| Pencatat | `flex items-center gap-1 mt-1 text-[11px] text-ink-black-secondary` + `person text-xs` | "Dicatat oleh Yanto · 16.10 WIB"; setelah koreksi "Dikoreksi oleh Rudi · 17.20 WIB"; draf milik sendiri "Draf di HP ini · 16.05" (K-REC-3) |
| Ikon kanan | Hari ini/draf: tombol `p-1.5 rounded-lg bg-surface-container-low text-primary` + `edit text-base`, `aria-label="Ubah catatan 23 Sep"`; lainnya `check_circle text-ink-black-tertiary text-lg` (hiasan) | Seluruh baris adalah tombol yang membuka lembar untuk tanggal itu |

Baris tanggal hari ini (atau tanggal terpilih) memakai gaya bergaris kiri biru. Tanggal tanpa catatan tetap tampil: pil **Belum Ada Data**, nilai "—" `text-ink-black-tertiary`, teks pencatat "Belum dicatat", ikon kanan tombol `edit`.

#### 7.2.4 Tab Mortalitas (turunan)

Label tab tetap "Mortalitas" sesuai mockup. Isi memakai kata **Mati** dan **Afkir**, dihitung terpisah.

**Ringkasan tab** — kelas sama dengan tab Pakan; kotak ikon `bg-error-container text-coral-alert` + `heart_broken text-xl`:

```html
<div class="bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-3 mb-3 border border-black/[0.05] shadow-sm flex items-center justify-between">
  <div class="flex items-center gap-2.5">
    <div class="w-9 h-9 rounded-lg bg-error-container text-coral-alert flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined text-xl" aria-hidden="true">heart_broken</span>
    </div>
    <div>
      <div class="font-label-sm text-label-sm text-ink-black-secondary">Total Mati Tercatat</div>
      <div class="font-headline-md text-body-lg font-bold text-on-surface">15 ekor <span class="font-label-sm text-label-sm text-ink-black-tertiary font-normal">· Afkir 3 ekor</span></div>
    </div>
  </div>
  <div class="text-right">
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container text-ink-black-secondary font-label-sm text-label-sm">
      <span class="material-symbols-outlined text-xs" aria-hidden="true">calendar_today</span> 6 hari data
    </span>
    <div class="text-[11px] text-ink-black-tertiary mt-0.5">Rata-rata mati: 2,5 ekor/hr</div>
  </div>
</div>
```

- Total mati dan afkir dari tanggal Tercatat; hari data = tanggal Tercatat yang punya nilai mati **atau** afkir. Tidak menampilkan sisa populasi atau persentase deplesi (R2).

**Baris riwayat** — struktur sama dengan tab Pakan; baris nilai:

```html
<div class="flex items-baseline gap-2 mt-1">
  <span class="font-label-md text-label-md font-semibold text-ink-black-primary">Mati</span>
  <span class="font-headline-md text-body-md font-bold text-coral-alert">3 ekor</span>
  <span class="font-label-md text-label-md font-semibold text-ink-black-primary ml-1">Afkir</span>
  <span class="font-headline-md text-body-md font-bold text-on-surface">1 ekor</span>
</div>
```

- Nilai mati memakai `text-coral-alert` seperti kartu Ringkasan Owner, termasuk "0 ekor" bila memang dinyatakan 0. Bagian yang belum diisi ditulis "—" `text-ink-black-tertiary`.

#### 7.2.5 Tab Sampling (turunan)

**Ringkasan tab** — kotak ikon `bg-sky-tint text-primary` + `scale text-xl`; label "Sampling Terakhir"; nilai "0,7 kg/ekor sampel" + kecil "· 21 Sep"; chip "2 kali sampling"; kanan bawah "Dari 25 ekor · 17,5 kg". Bila belum pernah sampling: nilai "—" dan teks "Belum ada sampling".

**Baris riwayat** — hanya tanggal yang punya catatan sampling atau pilihan **Tidak dilakukan**. Sampling tidak wajib harian, sehingga tanggal kosong tidak ditampilkan sebagai celah.

```html
<div class="flex items-baseline gap-2 mt-1">
  <span class="font-headline-md text-body-md font-bold text-on-surface">0,7 kg/ekor</span>
  <span class="font-label-sm text-label-sm text-ink-black-tertiary">25 ekor · 17,5 kg</span>
</div>
```

- Pilihan **Tidak dilakukan** ditulis "Tidak sampling" `font-label-md text-label-md text-ink-black-secondary`, bukan 0 kg.
- Bantuan di bawah judul riwayat, `text-[11px] text-ink-black-tertiary`: "Rata-rata sampel, bukan bobot seluruh ayam."

#### 7.2.6 Lembar input per tab

Bingkai lembar sama untuk ketiga tab (baris 246–365): kepala dengan kotak ikon `w-8 h-8 rounded-lg bg-sky-tint text-primary-container`, judul `font-headline-md text-base font-bold`, subjudul "Kandang Utara · Hari ke-18", tombol tutup; isi `p-5 space-y-4`; kaki dengan **Simpan Draf** (`flex-1`) dan **Kirim Recording** (`flex-[2]`, ikon `send`) serta catatan "Satu catatan bersama untuk seluruh kandang · Berlaku langsung".

| Tab | Ikon kepala | Judul lembar | Isian (urut) |
|---|---|---|---|
| Pakan | `inventory_2` | "Catat Pakan Harian" | Tanggal Catatan · Jenis Pakan (+ **Tambah Jenis**) · Kuantitas Digunakan Hari Ini · Catatan Tambahan |
| Mortalitas | `heart_broken` (kotak `bg-error-container text-coral-alert`) | "Catat Mati & Afkir" | Tanggal Catatan · Mati (ekor) · Afkir (ekor) · Catatan Tambahan |
| Sampling | `scale` | "Catat Sampling Bobot" | Tanggal Catatan · Sampling hari ini? · Jumlah ayam ditimbang · Total bobot · Rata-rata · Catatan Tambahan |

**Isian tab Pakan** (persis mockup, dengan koreksi):

- **Tanggal Catatan** (`event`): `DateSegment` "Hari ini (23)" · "Kemarin (22)" · "Pilih". Bila tanggal terpilih sudah tercatat, di bawah segmen tampil `text-[11px] text-ink-black-secondary` "Tanggal 22 Sep sudah dicatat Yanto. Mengirim akan mengoreksi catatan itu."
- **Jenis Pakan** (`layers`): `Select` berisi jenis pakan tenant. **Tambah Jenis** membuka isian nama jenis di tempat (baris isian + tombol **Simpan Jenis**). Contoh mockup: "Pakan BR-1 (Starter Broiler)".
- Beberapa jenis dalam satu hari: TextButton **+ Tambah jenis pakan lain** di bawah kuantitas menambah pasangan Jenis + Kuantitas berikutnya. Pasangan kedua dan seterusnya punya tombol hapus `close` `aria-label="Hapus jenis ini"`.
- **Kuantitas Digunakan Hari Ini** (`scale`), kanan "Bukan saldo gudang": `QtyInput` angka + satuan (`kg` atau `sak`; dapat diketuk untuk berganti bila jenis mendukung keduanya) dan kotak konversi `≈ n sak` hanya bila berat per sak diketahui (K-REC-4).
- Baris bantuan `text-[11px] text-ink-black-secondary`, muncul **setelah** angka diisi: kiri `history` "Kemarin: **96 kg** (+4 kg hari ini)"; kanan "Rata-rata 7 hari: 91 kg" (K-REC-5).
- **Catatan Tambahan** (`edit_note`), kanan "Opsional": `Textarea` 2 baris, placeholder dari mockup.

**Isian tab Mortalitas** (turunan):

```html
<div class="flex flex-col gap-1.5">
  <label for="mati" class="font-label-sm text-label-sm font-semibold text-on-surface flex items-center justify-between">
    <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-coral-alert" aria-hidden="true">heart_broken</span> Mati (ekor)</span>
    <span class="font-label-sm text-label-sm text-ink-black-tertiary">Tulis 0 bila tidak ada</span>
  </label>
  <div class="flex items-center gap-2">
    <button type="button" aria-label="Kurangi mati satu ekor" class="w-11 h-11 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95"><span class="material-symbols-outlined" aria-hidden="true">remove</span></button>
    <div class="flex-1 flex items-center bg-surface-container-low border border-black/[0.08] rounded-xl overflow-hidden focus-within:border-primary-container focus-within:bg-surface-container-lowest transition-all">
      <input id="mati" type="text" inputmode="none" class="w-full bg-transparent px-3 py-2.5 font-headline-md text-headline-md text-on-surface font-bold text-center outline-none" placeholder="—">
      <span class="bg-surface-container px-3 py-3 text-ink-black-secondary font-label-md text-label-md font-semibold">ekor</span>
    </div>
    <button type="button" aria-label="Tambah mati satu ekor" class="w-11 h-11 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95"><span class="material-symbols-outlined" aria-hidden="true">add</span></button>
  </div>
</div>
```

- **Afkir (ekor)** sama persis; ikon label `inventory_2 text-ink-black-secondary`; bantuan kanan "Terpisah dari mati".
- Bantuan pintar setelah angka diisi: `WarningPill` "250 ekor — jauh di atas 7 hari terakhir (paling banyak 6 ekor). Sudah benar?" Tidak memblokir.

**Isian tab Sampling** (turunan):

- **Sampling hari ini?** (`scale`): `DateSegment` versi dua pilihan (`grid-cols-2`) "Tidak dilakukan" · "Dilakukan". Tidak ada pilihan terpilih otomatis.
- **Tidak dilakukan**: satu baris `text-[11px] text-ink-black-secondary` "Tidak sampling bukan berarti bobot 0." Isian lain disembunyikan.
- **Dilakukan**: **Jumlah ayam ditimbang** (`QtyInput` satuan "ekor", keypad ekor) dan **Total bobot** (`QtyInput` satuan "kg", keypad kuantitas). Di bawahnya kotak hasil `p-3 rounded-lg bg-sky-tint/50 flex items-center justify-between`: kiri `font-label-sm text-label-sm text-ink-black-secondary` "Rata-rata"; kanan `font-headline-md text-body-lg font-bold text-primary` "0,7 kg/ekor sampel", atau "—" bila salah satu kosong.

**Keypad di lembar:** isian angka memakai `KeypadInSheet` (§6.6) yang muncul di atas kaki lembar saat isian angka aktif. Kaki lembar (Simpan Draf/Kirim) disembunyikan selama keypad terbuka dan muncul lagi setelah **Selesai**. Toolbar keypad: **Keyboard HP** · **Lanjut** · **Selesai**.

**Tombol kaki:**

| Tombol | Perilaku |
|---|---|
| **Simpan Draf** | Menyimpan isian tab ini di HP. Pesan "Draf tersimpan di HP." Lembar tertutup |
| **Kirim Recording** | Validasi tab ini (§7.2.7), lalu kirim satu revisi catatan tanggal itu. Online: pesan "Recording 23 Sep tercatat. Dipakai bersama tim." Tanpa sinyal: pil baris menjadi **Menunggu Kirim**, pesan "Recording tersimpan di HP. Dikirim saat ada sinyal." |

**Mode koreksi** (membuka tanggal yang sudah Tercatat): judul lembar "Koreksi Pakan 22 Sep" (atau "Koreksi Mati & Afkir 22 Sep", "Koreksi Sampling 22 Sep"); di atas isian kotak `p-3 rounded-lg bg-surface-container-low` berisi "Nilai berlaku: 96 kg · Yanto 16.10"; isian terisi nilai berlaku; isian wajib tambahan **Alasan koreksi** (`Textarea` 2 baris); tombol utama **Kirim Koreksi**. Setelah diterima, baris berpil **Dikoreksi**.

**Catatan Berubah** (versi server berubah sejak draf dibuat): di atas isian tampil blok `p-3 rounded-lg bg-error-container/30` berjudul `text-coral-alert font-label-md text-label-md` "Catatan berubah — pilih angka yang benar", tabel dua kolom **Di server (Yanto, 16.00)** dan **Draf Anda** untuk setiap bagian yang berbeda, lalu **Pakai Data Server** (`SecondaryButton`) dan **Susun Koreksi** (`PrimaryButton`). Keterangan: "Draf Anda belum mengganti catatan bersama." (WF-10)

#### 7.2.7 Aturan data: tiga tab, satu catatan

- Ketiga tab menulis **satu** catatan per `(periode, tanggal)` (K-25, D-21). Tidak ada catatan Pakan, Mortalitas, atau Sampling yang terpisah.
- **Kirim Recording** dari satu tab mengirim revisi lengkap CMD-21: nilai berlaku terbaru untuk bagian tab lain (apa adanya, termasuk kosong) + isian tab ini, dengan `expected_daily_version` dari data yang dibaca. Bagian yang belum pernah diisi tetap kosong (`null`), **tidak** dikirim sebagai 0.
- `completeness` = `COMPLETE` bila pakan serta mati dan afkir sudah terisi (sampling boleh tidak ada); selain itu `PARTIAL`.
- Nol hanya bila pengguna mengetik 0 atau menekan − sampai 0. Bagian itu masuk `explicit_zero_fields`.
- Pakan dikirim sebagai baris per jenis (`feed_lines`, [DATA_MODEL §12.2](DATA_MODEL.md#122-daily_recording_revision)); total harian dihitung server.
- Versi server berubah → `VERSION_CONFLICT` → keadaan **Catatan Berubah** di lembar tab tersebut. Draf tidak hilang.
- Validasi sebelum kirim: Pakan — jenis dan kuantitas >0 untuk setiap pasangan; Mortalitas — mati dan afkir diisi (boleh 0), bilangan bulat ≥0; Sampling — pilihan wajib; bila Dilakukan, jumlah ekor >0 dan bobot >0. Pesan error tepat di bawah isian (UX_UI_SPEC §5.2).
- Recording tidak mengubah uang, biaya, atau stok, dan tidak memerlukan persetujuan Owner.

#### 7.2.8 Keadaan halaman

| Keadaan | Tampilan |
|---|---|
| Periode aktif, Recording Harian | Seperti mockup |
| Recording **Tidak aktif** | Tab dan tombol Catat tidak tampil. `EmptyState` ikon `edit_note`: "Recording Harian tidak aktif untuk periode ini." Owner melihat tombol **Buka Pengaturan** |
| Periode **Persiapan** | Pil konteks **Persiapan**; `EmptyState` "Recording mulai setelah DOC Masuk." |
| Memuat | Tab tampil; ringkasan dan riwayat `LoadingSkeleton` |
| Tanpa sinyal | Riwayat dari data terakhir di HP dengan "Data terakhir 16.05" di bilah konteks; kirim menjadi Menunggu Kirim |
| Akses dicabut | "Akses tidak tersedia." Tanpa nilai; draf tetap milik pembuatnya |
| Tanggal di luar periode | **Pilih** hanya mengizinkan tanggal dari DOC masuk sampai hari ini |

### 7.3 Catat Belanja (V-09)

| Item | Nilai |
|---|---|
| Rute | `/catat-belanja` (halaman fokus; dibuka dari Hari Ini, Uang Kas, atau lembar Catat) |
| Acuan | [code.html](design/stitch/catat_belanja_keypad/code.html), [acuan 390](design/stitch/catat_belanja_keypad/reference-390-viewport.png), [halaman penuh](design/stitch/catat_belanja_keypad/reference-390-full.png) |
| Kerangka | Header fokus judul **Catat** (K-CB-1) · `main` pb-safe · tanpa nav bawah (keypad dock menggantikannya) |
| Kartu IMP | IMP-028 (ABK), IMP-029 (Owner langsung), IMP-023 (foto) |
| Data | Command belanja API (CASH-16), riwayat keperluan sendiri, perkiraan Uang Kas pengguna |

Mockup ini halaman fokus, bukan lembar bawah. Tabel pola kerja UX_UI_SPEC §16.4 mengikuti keputusan ini (K-39). Tombol Kembali HP menutup halaman tanpa kehilangan draf.

| No | Bagian | Baris | Komponen | Isi dan aturan |
|---|---|---|---|---|
| 1 | Strip draf | 5–14 | Strip draf | Kiri "Draf tersimpan di HP · 09.10" (hanya setelah tersimpan); kanan "Terhubung"/"Tanpa sinyal" (K-CB-2) |
| 2 | Kartu judul | 15–25 | GlassCard 90% | `h2` "Catat Belanja"; badge `bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider` "Operasional ABK" (Owner: "Langsung Dibukukan"); lokasi `location_on` "Kandang Utara · Periode 01 · 23 Sep 2026" |
| 3 | Keperluan | 28–64 | GlassCard 90% + `FieldLabelLarge` + `TextInput` + `CategoryChips` | Label "Keperluan *", kanan "Contoh: Bensin, Pakan, Vitamin"; tombol hapus teks; "Pilihan Cepat:" berisi 5 keperluan tersering milik pengguna. Wajib |
| 4 | Nominal | 65–93 | GlassCard 95% + `NominalDisplay` + `SmartAdvice` | Label "Nominal Belanja *", kanan `touch_app` "Ketuk keypad di bawah". Nilai awal **kosong** (K-CB-3). Saran mirip hanya dari riwayat sendiri (UX-19), mis. "Nominal ini mirip belanja listrik 3 minggu lalu (**Rp148.500**). Pastikan struk token/meteran sudah sesuai." |
| 5 | Tanggal Belanja | 94–108 | GlassCard 90% + `DateButtons` | **Hari ini** terpilih dan terlihat · **Kemarin** · **Pilih** |
| 6 | Dibayar Dengan | 109–154 | GlassCard 90% + 4 `ChoiceCard` | Tidak ada yang terpilih awal (K-CB-4). Lihat tabel pilihan |
| 7 | Foto Nota / Struk | 155–185 | GlassCard 90% + tile tambah + pratinjau | Kanan "Opsional". Tile "Tambah Foto Nota (Opsional)" · "Tanpa foto tetap bisa dikirim." Pratinjau (baris 170–185) tampil setelah foto dipilih: gambar, "Nota 1", nama file, "Terlampir · Siap dikirim", tombol hapus `aria-label="Hapus nota"` |
| 8 | Keypad dock | 186–218 | `KeypadDock` | Selalu terpasang di bawah dan mengetik ke Nominal. Saat isian teks aktif, grid keypad disembunyikan; hanya tombol utama yang tampil di atas keyboard HP |
| 9 | Aksi | 219–end | PrimaryButton `rounded-xl py-3.5` + catatan | **Tinjau Belanja** (`fact_check`) · catatan `verified_user` "Owner memeriksa & menyetujui sebelum dibukukan." |

**Pilihan Dibayar Dengan (ABK):**

| Pilihan | Keterangan (baris kedua) |
|---|---|
| **Uang Kas saya** | "Perkiraan uang di tangan: Rp350.000" dari Uang Kas pengguna, atau "Perkiraan belum dapat dipastikan" (K-CB-5) |
| **Uang pribadi saya (minta diganti)** | "Dicatat sebagai utang penggantian ke Anda, bukan kasbon." (warna `text-secondary` seperti mockup) |
| **Belum dibayar ke toko (Bon/Hutang)** | "Barang sudah dibawa, nota toko menyusul dilunasi." |
| **Belum tahu** | "Tidak apa-apa. Owner akan melengkapinya saat memeriksa." (K-CB-6) |

**Langkah Tinjau** (tidak ada di mockup; memakai `BottomSheet` Recording): judul "Tinjau Belanja", ikon `fact_check`; isi daftar label–nilai `flex justify-between py-2 border-b border-black/[0.05]` untuk Keperluan, Nominal (+ ejaan kecil), Tanggal, Dibayar dengan, Foto nota; `WarningPill` bila mirip; kaki **Ubah** (`SecondaryButton flex-1`) dan **Kirim** (`PrimaryButton flex-[2]`, ikon `send`); catatan "Setelah dikirim, status menjadi Menunggu Owner." Hasil online "Belanja Listrik terkirim. Menunggu Owner."; tanpa sinyal "Belanja Listrik tersimpan di HP. Dikirim saat ada sinyal."

**Versi Owner** (layar sama): badge "Langsung Dibukukan"; pilihan bayar **Kas tunai usaha**, **Rekening usaha**, **Uang pribadi Owner** ("Dicatat sebagai utang usaha ke Owner"), **Belum dibayar ke toko**; kartu tambahan **Bebankan ke** memakai `RadioCardPair` Periksa (Periode 01 / Di Luar Periode) dan `ImpactBox`; tombol utama **Tinjau & Bukukan**; di lembar tinjau tombol **Bukukan** yang butuh sinyal. Tidak masuk antrean Periksa Belanja.

**Validasi:** Keperluan kosong → "Keperluan belum diisi."; Nominal kosong → "Nominal belum diisi."; Dibayar dengan kosong → "Pilih cara bayar, atau Belum tahu." Error di bawah kartu terkait; bila lebih dari satu, halaman menggulir ke yang pertama dan memberi fokus di sana.

### 7.4 Uang Kas — ABK (V-08, V-13)

| Item | Nilai |
|---|---|
| Rute | `/uang-kas` |
| Acuan | [code.html](design/stitch/uang_kas_abk/code.html), [acuan 390](design/stitch/uang_kas_abk/reference-390-viewport.png), [rincian terbuka](design/stitch/uang_kas_abk/reference-390-rincian-terbuka-full.png) |
| Kerangka | Header ABK · `main` pb-28 · nav ABK, **Uang Kas** aktif |
| Kartu IMP | IMP-024–IMP-027 |
| Data | Saldo dibukukan pemegang, belanja menunggu, catatan uang yang belum dicek, riwayat pergerakan milik pengguna |

| No | Bagian | Baris | Komponen | Isi dan aturan |
|---|---|---|---|---|
| 1 | Kartu perkiraan | 5–35 | `HeroGlassCard` | Chip kiri `account_balance_wallet` "Uang Kas Rudi" (K-UK-1); kanan titik + "Terhubung" (K-UK-2); "Perkiraan uang di tangan"; nominal `font-headline-xl-mobile text-headline-xl-mobile font-bold tracking-tight text-on-surface`; catatan "Dari catatan, bukan hasil hitung uang fisik. Data diperbarui hingga **23 Sep 2026, 15.00**." |
| 2 | Cara hitung | 36–65 | TextButton + laci | "Lihat rincian cara hitung" (`calculate`, chevron berputar). Isi: Saldo dibukukan Owner · Belanja menunggu Owner (merah, tanda −) · garis · Perkiraan di tangan (biru) · catatan miring kecil "* Saldo dibukukan berubah setelah Owner membukukan." |
| 3 | Aksi | 66–89 | `QuickActionTile3` | **Terima Uang** (biru, `call_received`) · **Kembalikan Uang** (`assignment_return`, K-UK-3) · **Catat Belanja** (`receipt_long`) |
| 4 | Catatan fokus | 90–97 | `InfoRow` | `verified_user` "Hanya uang usaha untuk kandang · Bukan gaji atau kasbon" + `lock` (K-UK-4) |
| 5 | Judul riwayat | 98–109 | `h2` + pil jumlah + TextButton | "Riwayat Uang Kas" · "4 Catatan" · **Filter** (`filter_list`) membuka lembar filter: Semua / Masuk / Keluar dan status |
| 6 | Daftar | 110–299 | `ExpandableTxCard` × n | Lihat isi laci |
| 7 | Tips | 300–310 | `TipCallout` | "Catat belanja sesegera mungkin saat struk diterima agar perkiraan uang di tangan tetap akurat." |

**Isi laci per jenis** (label `block font-label-sm text-label-sm text-ink-black-tertiary`, nilai di bawahnya):

| Jenis baris | Judul dan meta | Isi laci |
|---|---|---|
| Belanja menunggu | "Belanja Listrik" · "23 Sep • <keperluan singkat>" · nominal merah −, pil Menunggu Owner | Waktu Pengeluaran · Dibayar dengan · Dicatat oleh · Foto Nota (+ foto bila ada, tanpa keterangan di atas foto, K-UK-5) |
| Terima dari Owner | "Terima dari Owner" · "20 Sep • <tujuan>" · nominal biru +, pil Dibukukan | Waktu Penyerahan · Cara Serah · Pemberi · Penerima · Catatan Owner (bila ada) |
| Belanja dibukukan | "Belanja Gas" · "19 Sep • 1 foto nota" · nominal hitam −, pil Dibukukan | Waktu Transaksi · Rincian Barang · Toko · Status: "Dibukukan Owner, 20 Sep" |
| Terima/Kembalikan dari ABK | "Terima Uang" / "Kembalikan Uang" · pil **Belum Dicek Owner** | Waktu · Dari/Kepada · Catatan · "Saldo belum berubah sampai Owner membukukan." |

**Keadaan:** perkiraan tidak dapat dipastikan → nominal diganti "Belum dapat dipastikan" (`font-headline-md text-headline-md text-ink-black-secondary italic`) dan catatan menyebut alasannya; belum ada catatan → `EmptyState` "Belum ada catatan uang kas."; tanpa sinyal → angka dari data terakhir, aksi tetap bisa.

**Lembar Terima Uang / Kembalikan Uang** (tidak ada di mockup; `BottomSheet` Recording): ikon kepala `call_received` / `assignment_return`; isian Tanggal (`DateSegment`), Nominal (`NominalDisplay` versi lembar + `KeypadInSheet` rupiah), **Dari** (`ChoiceCard` Owner / Orang lain + nama) atau **Diserahkan kepada**, Catatan opsional; kaki satu tombol **Simpan** (`PrimaryButton`) dan catatan "Owner akan mengecek. Saldo berubah setelah Owner membukukan." Boleh disimpan tanpa sinyal.

### 7.5 Ringkasan — Owner (V-01)

| Item | Nilai |
|---|---|
| Rute | `/ringkasan` (beranda Owner) |
| Acuan | [code.html](design/stitch/ringkasan_owner_dashboard/code.html), [acuan 390](design/stitch/ringkasan_owner_dashboard/reference-390-viewport.png), [halaman penuh](design/stitch/ringkasan_owner_dashboard/reference-390-full.png), [pilih kandang](design/stitch/ringkasan_owner_dashboard/reference-390-pilih-kandang-full.png) |
| Kerangka | Header Owner · `canvas="bright"` · `main` pb-24 · nav Owner, **Ringkasan** aktif |
| Kartu IMP | IMP-014, IMP-046, IMP-047 |
| Data | Periode aktif kandang terpilih, belanja perlu diperiksa, recording hari ini dan kemarin, biaya dibukukan, belanja belum dibukukan, hasil periode, Uang Kas per pemegang, akun kas Owner, kandang lain |

| No | Bagian | Baris | Komponen | Isi dan aturan |
|---|---|---|---|---|
| 1 | Status koneksi | 9–16 | Pil status koneksi | "Terhubung · Data terakhir 16.05 WIB" (K-RO-1); kanan "Rabu, 23 Sep 2026" |
| 2 | Kandang aktif | 17–47 | Kartu kandang | Chip `nest_multi_room` "Kandang Aktif"; `h1` "Kandang Utara"; "Periode 01 · Hari ke-18" (biru); tombol **Ganti** (`swap_horiz`) membuka `PickerSheet`; meta `calendar_today` "DOC masuk: 6 Sep 2026" • `pets` "DOC 5.000 ekor" (K-RO-2) |
| 3 | Perlu perhatian | 48–73 | Kartu perhatian | Ikon `notification_important`; label "Perlu Persetujuan Anda" (`uppercase`, `text-tertiary`); pil umur "1 hari lalu" `bg-coral-alert text-on-primary`; `h2` "3 belanja perlu diperiksa"; "Total: Rp700.000"; "Belanja dari Rudi dan Yanto menunggu konfirmasi Anda untuk segera dibukukan ke laporan."; tombol **Periksa Belanja (3)** (`verified`, `arrow_forward`). Tidak bisa disembunyikan; hilang bila 0 |
| 4 | Pencatatan harian | 74–123 | `SectionTitleIcon` + GlassCard | Judul "Pencatatan Harian (Hari Ini)" + pil "23 Sep"; blok "Status Catatan Hari Ini" + pil **Belum Ada Data** + "ABK belum mengisi pakan, mati/afkir, dan sampling untuk hari ini." (K-RO-3); blok "Catatan Terakhir: Kemarin" · "16.05 WIB · Yanto" + `StatTile3` Pakan 96 kg · Mati 3 ekor · Afkir 1 ekor; tombol **Lihat Semua Catatan** ke Recording dan **Koreksi / Catat** yang membuka lembar hari ini; catatan "Satu catatan bersama untuk seluruh kandang." (K-RO-4). Tidak tampil bila recording Tidak aktif |
| 5 | Keuangan periode | 124–188 | `SectionTitleIcon` + 3 kartu | "Keuangan Periode 01" · kanan "Kandang Utara". `MoneyStatCard` "Total Biaya Dibukukan" Rp400.000 + "Pengeluaran resmi kandang" + **Rincian Biaya**; `MoneyStatCard` "Belanja Belum Dibukukan" Rp820.000 (`text-tertiary`) + "• 3 belanja menunggu periksa Anda Rp700.000" dan "• 1 belanja perlu dilengkapi ABK Rp120.000"; `UnknownResultCard` "Hasil Usaha Periode Ini" + pil **Data Belum Lengkap** + "Belum dapat dihitung" + alasan "Rincian RHPP dari mitra belum ada. Hasil usaha dihitung setelah data lengkap." (K-RO-5) |
| 6 | Uang Kas | 189–272 | `SectionTitleIcon` + `HolderCard` × n + baris akun Owner | Judul "Uang Kas" (K-RO-6) + tautan **Kelola Uang Kas**. Per pemegang: "Uang Kas Rudi" · subjudul kandang tugasnya (K-RO-7) · Perkiraan di Tangan Rp350.000 · Saldo Dibukukan Rp500.000 · Belanja Menunggu −Rp150.000. Yanto: "Belum dapat dipastikan" + "Ada 1 belanja belum jelas sumber uangnya. Perkiraan belum dapat dipastikan." Baris Owner: `storefront` "Kas tunai usaha" Rp3.250.000; `account_balance` "Rekening usaha" "Belum diisi saldo awal" (ketuk membuka isian saldo awal) |
| 7 | Kandang lainnya | 273–305 | Kartu kandang lain | "Kandang Lainnya" · "1 Kandang". "Kandang Selatan" + pil **Kandang Kosong** (K-RO-8) · "Periode 02 · Kosong sejak 15 Sep 2026" · blok `hourglass_empty` "Tutup Buku Periode 02 Belum Selesai" + "Uang mitra **Rp12.500.000** sudah diterima, namun rincian dokumen RHPP resmi belum dimasukkan." · tombol **Lihat Hasil & Rincian Periode 02** |
| 8 | Pilih kandang | 306–365 | `PickerSheet` | "Pilih Kandang"; terpilih "Kandang Utara (Aktif)" · "Periode 01 · Hari ke-18 · 5.000 ekor" + `check`; lain "Kandang Selatan" · "Periode 02 · Kosong · Menunggu RHPP" + `chevron_right`; **Tutup** |

**Keadaan tambahan (turunan):**

| Keadaan | Tampilan |
|---|---|
| Owner baru, belum ada kandang | Bagian 2–7 diganti `NextStepHero` "Mulai dari data kandang." + tombol **Mulai Kandang** ke §7.7 |
| Periode **Persiapan** | Bagian 2 dengan pil **Persiapan** dan meta "DOC belum masuk"; `NextStepHero` "Catat DOC saat benar-benar datang." + **DOC Masuk**; kartu daftar persiapan (resep R-12 di §8); bagian 4 disembunyikan; bagian 5 hanya Belanja Belum Dibukukan bila ada |
| Tidak ada belanja perlu diperiksa | Bagian 3 hilang; saran utama `NextStepHero` sesuai data, mis. "Recording hari ini belum tercatat." |
| Tanpa sinyal | Pil status koneksi "Tanpa sinyal · Data terakhir …"; **Periksa Belanja** tetap membuka daftar, tetapi pembukuan nonaktif |
| Satu kandang saja | Tombol **Ganti** dan bagian 7 tidak tampil |

### 7.6 Periksa Belanja — Owner (V-11, V-10)

| Item | Nilai |
|---|---|
| Rute | `/periksa-belanja?filter=periksa` (juga `lengkapi`, `ditolak`, `dibukukan`), `&belanja=<id>` |
| Acuan | [code.html](design/stitch/periksa_belanja_owner/code.html), [acuan 390](design/stitch/periksa_belanja_owner/reference-390-viewport.png), [halaman penuh](design/stitch/periksa_belanja_owner/reference-390-full.png) |
| Kerangka | Header Owner (K-NAV-2) · `main` pb-28 · nav Owner, **Transaksi** aktif |
| Kartu IMP | IMP-029, IMP-030 |
| Data | Daftar belanja per status, detail, pratinjau dampak; command pemeriksaan dan pembukuan (FIN-13) |

| No | Bagian | Baris | Komponen | Isi dan aturan |
|---|---|---|---|---|
| 1 | Kepala | 5–21 | GlassCard | Ikon `verified_user`; `h1` "Periksa Belanja"; "**3 belanja** perlu diperiksa • Total **Rp700.000**"; tombol **Tutup Semua** (`unfold_less`), berganti **Buka Semua** setelah ditekan |
| 2 | Filter | 22–41 | `FilterPills` | **Perlu diperiksa (3)** · **Perlu dilengkapi (1)** · **Ditolak (0)** · **Dibukukan (2)**; aktif `bg-primary-container text-on-primary` + angka dalam pil kecil; dapat digulir horizontal; filter disimpan di alamat |
| 3 | Info | 42–48 | `InfoBanner` | "Belanja baru dibukukan setelah Anda menekan Setujui & Bukukan." (K-PB-2) |
| 4 | Belanja terbuka | 51–174 | `ReviewArticle` terbuka | Lihat tabel berikut |
| 5 | Belanja tertutup | 175–237 | `ReviewArticle` tertutup | Judul, "Oleh <nama> • <tgl>", nominal, pil; `WarningPill` bila mirip ("Perhatian: Mirip belanja Solar kemarin (22 Sep • Rp200.000)"); baris bawah `photo_camera` "1 Foto Nota Terlampir" atau pil `help_outline` "Sumber Kas: Belum Tahu"; **Buka Periksa** (`expand_more`) |

**Belanja terbuka:**

| Bagian | Baris | Isi |
|---|---|---|
| Kepala | 53–81 | Kotak ikon kategori; `h2` keperluan; "Oleh **Rudi** • 23 Sep"; nominal biru besar; pil Menunggu Owner; baris umur `schedule` "Masuk hari ini"; kanan tombol **Tutup** (`expand_less`) (K-PB-3) |
| Detail | 82–99 | Baris label–nilai: **Toko** (K-PB-4) · **Dibayar dengan** (`wallet`) · **Foto nota**: "Tanpa foto" atau gambar (K-PB-5) |
| Nominal Disetujui (Rp) | 100–109 | Isian berisi nominal catatan pencatat, dapat diubah dengan keypad; bantuan "Sesuaikan jika ada selisih pembelian nyata."; bila berbeda dari catatan: `WarningPill` "Berbeda dari catatan Rudi (Rp150.000). Pastikan sesuai nota." |
| Barang / Jasa Sudah Diterima? | 110–125 | `RadioCardPair` **Sudah Diterima** / **Belum Diterima**. Tidak ada yang terpilih awal (K-PB-6). Wajib |
| Dibayar dengan (bila "Belum tahu") | Turunan | `ChoiceCard`: Uang Kas <nama> / Uang pribadi <nama>, diganti nanti / Belum dibayar ke toko. Wajib bila pencatat memilih Belum tahu |
| Bebankan Pembukuan Ke | 126–145 | `RadioCardPair` **Periode 01** (Kandang Utara) / **Di Luar Periode** (Biaya Umum / Rutin). Periode aktif terpilih awal dan terlihat |
| Simulasi Dampak | 146–155 | `ImpactBox` "Simulasi Dampak Pembukuan:" + kalimat dari pilihan, mis. "Jika dibukukan: **Uang Kas Rudi turun Rp150.000**. Biaya operasional **Periode 01 naik Rp150.000**, sekali saja." |
| Aksi | 156–174 | **Setujui & Bukukan** (lebar penuh, `check_circle`) · baris dua kolom **Minta Perbaikan** (`edit_note`) dan **Tolak Belanja** (`close`) |

**Lembar lanjutan** (memakai `BottomSheet`):

- **Konfirmasi bukukan**: judul "Bukukan belanja Token Listrik?"; nominal `font-headline-xl-mobile`; `ImpactBox` yang sama; catatan "Setelah dibukukan, perubahan memakai Koreksi. Catatan lama tetap tersimpan."; kaki **Batal** + **Bukukan**. Butuh sinyal.
- **Minta Perbaikan**: `Textarea` "Apa yang perlu dilengkapi?" wajib; catatan "Pesan ini terlihat oleh pencatat."; tombol **Kirim Permintaan**.
- **Tolak**: `WarningPill` "Menolak tidak menghapus uang yang sudah keluar. Bila uang benar terpakai, pilih Minta Perbaikan."; `Textarea` Alasan wajib; kaki **Batal** + **Tolak Belanja** (`TonalDangerButton`).

**Keadaan:** tanpa sinyal → **Setujui & Bukukan** nonaktif dengan alasan "Perlu sinyal untuk membukukan."; filter kosong → `EmptyState` "Tidak ada belanja di bagian ini."; setelah dibukukan → baris pindah ke filter Dibukukan dan pesan "Belanja Token Listrik dibukukan."; **Periksa Sekaligus** memakai resep R-10 di §8.

### 7.7 Mulai Kandang — tiga langkah (V-04)

| Item | Nilai |
|---|---|
| Rute | `/mulai-kandang?langkah=1` (juga `2`, `3`); halaman fokus |
| Acuan | [code.html](design/stitch/mulai_kandang_setup_3_langkah/code.html), [acuan 390](design/stitch/mulai_kandang_setup_3_langkah/reference-390-viewport.png), [halaman penuh](design/stitch/mulai_kandang_setup_3_langkah/reference-390-full.png) |
| Kerangka | Header fokus judul "Detail Kandang" · `canvas="bright"` · kaki aksi lengket · tanpa nav bawah |
| Kartu IMP | IMP-014, IMP-015 |
| Data | Data kandang dan bangunan, CMD-14 `cycle.prepare`, mode recording |

| No | Bagian | Baris | Komponen | Isi dan aturan |
|---|---|---|---|---|
| 1 | Kartu pembuka | 10–51 | GlassCard + `StepperPills` | Chip `roofing` "Kandang Baru"; `h2` "Mulai Kandang Baru"; "Siapkan kandang dan periode secara bertahap. Anda bisa berhenti dan melanjutkan kapan saja."; lencana ikon `pets`; tiga pil **1 Data Kandang** · **2 Recording** · **3 Periode** (aktif biru; selesai memakai ikon `check` menggantikan angka); bantuan `touch_app` "Persiapan kandang • Boleh dikerjakan urutan mana saja" |
| 2 | Langkah 1 | 52–175 | Banner + GlassCard form | Banner `home_work` "Langkah 1: Identitas Kandang" · "Mulai dari tempat pencatatan usaha Anda". Isian: **Nama Usaha Peternakan** (contoh "Hadi Farm", ikon `domain`), **Nama Kandang** (ikon `warehouse`), **Zona Waktu Operasional** "Dipilih, bukan ditebak" dengan `SegmentedTimezone` tanpa pilihan awal, **Rincian Bangunan & Kapasitas** (`BuildingRow` × n + **Tambah Bangunan** + total otomatis), **Mitra Kemitraan** "Opsional" (`handshake`), **Alamat / Lokasi Kandang** "Opsional" |
| 3 | Langkah 2 | 176–239 | Banner + 2 `ModeCard` + info | Banner `edit_note` "Langkah 2: Model Pencatatan" · "Tentukan cara tim Anda bekerja setiap hari". **Recording Harian** + badge "Rekomendasi" + "Pakan dipakai, mati, afkir, dan sampling bobot bila dilakukan. Satu catatan bersama yang praktis diisi bersama ABK." + chip `groups` "Dipakai bersama ABK" dan `analytics` "Rata-rata sampling otomatis" (K-MK-5). **Tidak Aktif (Finansial Saja)** + "Tetap bisa mencatat belanja, uang kas, dan hasil periode tanpa recording harian." + chip "Fokus Keuangan" (K-MK-6). Info "Fleksibel: Mode recording ini bisa diubah kapan saja di menu Pengaturan Periode." |
| 4 | Langkah 3 | 240–289 | Banner + form + kotak status + tautan | Banner `event_upcoming` "Langkah 3: Persiapan Periode" · "Sebelum DOC Datang ke kandang". **Nama Periode Perdana** ("Periode 01"), **Rencana DOC Datang** "Boleh dikosongkan" (tanggal); kotak `verified_user` "Status Transparan & Aman": "Periode 01 akan berstatus **"Persiapan"**. Belum ada ayam atau umur yang dihitung sampai Anda mencatat DOC Masuk saat ayam benar-benar tiba di kandang."; tautan `help_center` "Kandang sudah ada ayamnya?" + **Gunakan 'Periode Sudah Mulai'** |
| 5 | Banner foto | 290–299 | Gambar + overlay | Gambar lokal sementara `design/stitch/assets/banner-kandang.jpg`; eyebrow "Mulai Sederhana"; teks "Catat kandang, belanja, dan uang di satu tempat." (K-MK-7) |
| 6 | Kaki lengket | 300–end | Kaki aksi lengket | Tombol utama per langkah aktif: "Simpan & Lanjut ke Pilihan Recording" → "Simpan & Lanjut ke Siapkan Periode" → **Siapkan Periode** (K-MK-8); tombol sekunder `bookmark_border` "Simpan & Lanjutkan Nanti"; status `cloud_sync` "Draf tersimpan di HP • Perlu sinyal untuk menyimpan pengaturan kandang" (K-MK-9) |

**Perilaku:**

- Ketiga langkah berada di satu halaman gulir. Mengetuk pil langkah menggulir ke panelnya (halus, kecuali reduced motion), mengubah label tombol utama, dan mencatat `?langkah=` dengan `replaceState`.
- Langkah boleh dikerjakan urutan mana saja. Tombol utama menyimpan panel aktif ke server (butuh sinyal), memberi tanda selesai pada pil, lalu menggulir ke langkah berikutnya yang belum selesai.
- **Siapkan Periode** membuat periode **Persiapan** (CMD-14), bukan periode aktif. Setelah berhasil: pesan "Periode 01 disiapkan. Catat DOC saat datang." dan kembali ke Ringkasan (keadaan Persiapan). Tidak ada tombol yang berubah menjadi "Kandang Berhasil Disiapkan!" berwarna cokelat.
- **Simpan & Lanjutkan Nanti** menyimpan draf di HP dan kembali ke Ringkasan tanpa membuat data server.
- Tanpa sinyal: tombol utama nonaktif dengan alasan "Perlu sinyal untuk menyimpan pengaturan kandang."; draf tetap tersimpan.
- Validasi langkah 1: nama usaha, nama kandang, dan zona waktu wajib; kapasitas bangunan bilangan bulat >0 bila bangunan ditambahkan. Langkah 2: satu pilihan wajib sebelum Siapkan Periode. Langkah 3: nama periode wajib.

<a id="fd08"></a>
## 8. Layar tanpa mockup: resep komposisi

Layar di bawah belum punya mockup Stitch. Susun **hanya** dari komponen §6, dengan kerangka §5 dan isi dari [BRIEF_MOCKUP.md](BRIEF_MOCKUP.md) serta UX_UI_SPEC. Jarak antarbagian `gap-space-md`; kartu `GlassCard`; satu `PrimaryButton` per bagian. Bila pengguna kemudian memberi mockup, mockup itu menggantikan resepnya dan ditambahkan ke §7.

Urutan prioritas meminta mockup berikutnya kepada pengguna: R-05 DOC Masuk, R-07 Uang Kas Owner, R-03 lembar Catat, R-01 Masuk, R-08 Tim Kandang, R-09 Gaji/Kasbon/Upah, R-11 Hasil Periode, R-13 Tutup Buku, R-04 Status Kirim.

| Resep | Layar | Kerangka | Susunan dan komponen | Aturan khusus |
|---|---|---|---|---|
| R-01 | Masuk dan Ganti Password (V-03) | Tanpa header dan nav; `canvas="warm"`; isi `max-w-sm mx-auto pt-20 px-gutter` | Logo `h-12` + "Kandang Manajemen" `font-headline-lg`; GlassCard berisi `FieldLabel` + `TextInput` Username, Password (+ tombol `visibility` `aria-label="Tampilkan password"`); `PrimaryButton` **Masuk**; TextButton **Butuh bantuan?**. Ganti Password: dua isian + **Simpan Password** | Tanpa email/daftar. Paste dan pengelola password tidak dihalangi (`autocomplete="username"`/`"current-password"`/`"new-password"`). Pesan salah umum "Username atau password salah." di atas tombol |
| R-02 | Akun (V-22) | Header fokus "Akun" | GlassCard profil (avatar inisial besar `w-16 h-16`, nama, username, peran); daftar baris `ListCard` tanpa nominal: **Ubah Password**, **Perangkat yang Masuk**, **Kurangi Efek Visual** (sakelar), **Panduan**; `TonalDangerButton` **Keluar** | Keluar saat ada catatan belum terkirim: `BottomSheet` peringatan + jumlah catatan + **Buka Status Kirim** / **Tetap Keluar** |
| R-03 | Lembar Catat (menu) | `BottomSheet` dari tombol + | Judul "Catat" + konteks "Kandang Utara · 23 Sep 2026"; isi daftar tombol baris `flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low` dengan kotak ikon warna `QuickActionTile` + judul `font-label-lg` + keterangan `font-body-sm text-ink-black-secondary` + `chevron_right` | ABK: Recording Harian (`edit_note`), Catat Belanja (`shopping_cart`), Terima Uang (`payments`), Kembalikan Uang (`assignment_return`), Upah Pekerjaan (`engineering`). Owner: Catat Belanja, Beri Uang Kas (`account_balance_wallet`), DOC Masuk (`egg`; nonaktif "Perlu periode dulu" bila belum ada periode), Pakan Masuk (`local_shipping`). Recording tidak tampil bila Tidak aktif |
| R-04 | Status Kirim (V-19) | Header sesuai peran + nav | `SectionHeader` "Belum Terkirim dari HP Ini" + lencana; `PendingCard` per catatan dengan pil status masing-masing dan tombol **Kirim Ulang**/**Cek Lagi**/**Buka**; keterangan `font-body-sm text-ink-black-secondary` "Hanya catatan dari HP ini." | Kosong: `EmptyState` `cloud_done` "Tidak ada catatan yang tertahan di HP ini." Tanpa janji "semua perangkat sudah terkirim" |
| R-05 | DOC Masuk (V-07) | `BottomSheet` bingkai Recording, ikon kepala `egg` | `DateSegment`; **DOC hidup diterima (ekor)** `QtyInput` + keypad ekor; baris bantuan "Kapasitas kandang 7.000 ekor."; `ExpandableTxCard`-gaya laci "Rincian penerimaan (opsional)" berisi DOC ditagih, Bonus DOC, Mati atau ditolak saat datang ("Tidak dihitung lagi sebagai mati harian."), Pembagian ke bangunan; `ImpactBox` "Periode 01 aktif mulai 6 Sep 2026 dengan 5.000 ekor."; kaki **Simpan Draf** + **Catat DOC** | Butuh sinyal. Tanggal/jumlah belum pasti → hanya Simpan Draf; periode tetap Persiapan. Tidak membagi rata ke bangunan |
| R-06 | Pakan/Sapronak Masuk (V-07) | `BottomSheet`, ikon `local_shipping` | Tanggal; Jenis (`Select` jenis pakan); Jumlah + satuan (`QtyInput`, konversi hanya bila berat per sak diketahui); Dari (`TextInput`, mis. PT Contoh Mitra); Lampiran opsional; `InfoBanner` "Catatan ini bukan saldo stok."; tombol **Catat Pakan Masuk** | Tidak mengaktifkan periode dan tidak membuat stok |
| R-07 | Uang Kas Owner (V-08) + Beri Uang Kas / Terima Kembali | Header Owner + nav Owner, **Transaksi** aktif | `HeroGlassCard` "Kas tunai usaha" nominal besar; baris "Rekening usaha — Belum diisi saldo awal" + **Isi Saldo Awal** ("Saldo awal bukan pendapatan."); `QuickActionTile3` **Beri Uang Kas** (biru) · **Terima Kembali** · **Catat Belanja**; `HolderCard` per ABK yang dapat dibuka menjadi riwayat `ExpandableTxCard` dan daftar catatan **Belum Dicek Owner** dengan tombol **Cocokkan** | Lembar Beri Uang Kas: Diberikan kepada (`ChoiceCard` per ABK), Dari (Kas tunai usaha / Rekening usaha), Nominal, Tanggal, Tujuan opsional, `ImpactBox` "Kas tunai usaha turun Rp500.000. Uang Kas Rudi naik Rp500.000. Ini bukan biaya dan bukan kasbon.", tombol **Bukukan** (butuh sinyal). **Cocokkan** menautkan satu catatan ABK ke satu penyerahan; dua catatan bernominal sama tidak digabung otomatis |
| R-08 | Tim Kandang (V-20) | Header Owner + nav Owner, **Kandang** aktif | `SectionHeader` "Tim Kandang"; `HolderCard`-gaya kartu per ABK (inisial, nama, pil Aktif/Nonaktif, kandang tugas) tanpa nominal; `PrimaryButton` **Tambah ABK** (`group_add`) | Lembar Tambah ABK: Nama, Username, Kandang yang ditugaskan (`ChoiceCard` multi), **Buat Akun**. Hasil satu kali: kotak `bg-secondary-fixed/30` berisi username + password sementara (contoh palsu `CONTOH-0000`) + "Serahkan secara pribadi. Password ini tidak bisa dilihat lagi." Detail anggota: **Ubah Username**, **Reset Password** (`lock_reset`), **Penugasan**, **Nonaktifkan** (`person_off`, `TonalDangerButton`) |
| R-09 | Gaji, Kasbon, Upah Pekerjaan (V-14–V-16) | Header sesuai peran; tiga halaman terpisah dari Lainnya | Kasbon: `HolderCard` per orang dengan "Kasbon masih terbuka" + riwayat `ExpandableTxCard`; **Catat Kasbon**, **Catat Pengembalian**. Gaji: `MoneyStatCard` Hak Gaji Periode, baris sudah dibayar/dipotong, kasbon terbuka; pertanyaan "Potong kasbon dari gaji ini?" `RadioCardPair` **Tidak** / **Tentukan jumlah** + `NominalDisplay`; `ImpactBox` pratinjau sisa hak dan sisa kasbon; **Terapkan Potongan**; langkah terpisah **Catat Pembayaran**. Upah: `ListCard` per pekerjaan (jenis, jumlah × tarif, pil) | ABK melihat miliknya saja, tanpa tombol ubah. Tidak ada potongan otomatis; tidak ada nilai negatif; upah tidak masuk slip gaji |
| R-10 | Periksa Sekaligus | Dari Periksa Belanja, tombol TextButton "Periksa Sekaligus" di kepala | Mode pilih: setiap `ReviewArticle` tertutup mendapat kotak centang kiri (hanya belanja lengkap); bilah bawah lengket `bg-surface-container-lowest/95 backdrop-blur-2xl rounded-t-3xl` berisi jumlah, total, sumber, dan **Setujui & Bukukan (n)** | Konfirmasi di `BottomSheet` dengan daftar pengecualian. Hasil per belanja, mis. "2 dibukukan, 1 perlu dilengkapi" |
| R-11 | Hasil Periode (V-17) | Header Owner + nav Owner | Konteks "Kandang Selatan · Periode 02"; `RadioCardPair` **Rincian RHPP** / **Uang Diterima**; Uang Diterima dalam `BottomSheet`: Mitra, Tanggal, Masuk ke, Jumlah (`NominalDisplay` + keypad), Lampiran; setelah tercatat daftar label–nilai (`flex justify-between py-2 border-b border-black/[0.05]`) Uang diterima · Total hak dari mitra (Belum diketahui) · Pencocokan (Belum dicocokkan) · Biaya usaha (pil Data Belum Lengkap) · `UnknownResultCard` Hasil usaha | Rincian RHPP adalah halaman fokus bertahap memakai `StepperPills` Mulai Kandang (Identitas → Hasil/bonus → Biaya mitra → Potongan → Hak dicairkan → Tinjau). Tidak ada laba Rp0 |
| R-12 | Daftar persiapan di Ringkasan | Bagian dalam Ringkasan (keadaan Persiapan) | GlassCard judul "Persiapan kandang · 2 dari 5 selesai · boleh dikerjakan urutan mana saja" + bilah kemajuan `h-1.5 rounded-full bg-surface-container` isi `bg-primary-container`; baris langkah: lingkaran selesai `bg-primary-container text-on-primary` + `check` atau lingkaran kosong, judul, keterangan, tombol kecil `TonalBlueButton` **Ubah**/**Tambah**/**Siapkan**/**Catat** | Langkah yang belum bisa: tombol nonaktif + alasan "Perlu periode dulu". Daftar hilang setelah DOC Masuk |
| R-13 | Kandang Kosong dan Tutup Buku (V-05, V-26) | Halaman fokus "Tutup Buku" | GlassCard "Pemeliharaan": tanggal selesai, pernyataan kosong (`ChoiceCard` centang), **Tandai Kandang Kosong**; GlassCard "Keuangan": baris pemeriksaan `flex justify-between` dengan pil dan tombol **Periksa**/**Lengkapi**/**Tinjau**; `InfoBanner` untuk informasi yang bukan penghambat (gaji belum dibayar, kasbon terbuka); `PrimaryButton` **Tutup Buku** nonaktif dengan alasan | Dua tindakan terpisah. **Buka Lagi** wajib alasan. Tidak ada syarat stok |
| R-14 | Riwayat Belanja, Riwayat, Detail Belanja (V-12, V-25, V-10) | Header sesuai peran + nav | `FilterPills` (tanggal, status); `ListCard` per belanja; detail dibuka sebagai `ReviewArticle` baca-saja atau halaman penuh bila dari tautan | Bukan sisa stok. Riwayat recording memakai `HistoryRow` §7.2 |
| R-15 | Laporan dan Ekspor (V-18, V-21) | Dari Lainnya (Owner) | `FilterPills` kandang/periode/tanggal; `MoneyStatCard` per total dengan tautan sumber dan pil kelengkapan; Ekspor: `ChoiceCard` cakupan dan isi, `PrimaryButton` **Buat File** (`download`), status proses di `PendingCard` | Laporan sebagian tidak diberi judul laba satu periode penuh |
| R-16 | Lainnya dan Panduan (V-23) | Nav slot 5 | Daftar baris seperti R-03 tanpa lembar. ABK: Gaji, Kasbon, Upah Pekerjaan, Status Kirim, Panduan, Akun. Owner: Laporan, Gaji, Kasbon, Upah Pekerjaan, Ekspor, Status Kirim, Panduan, Akun. Panduan: `ExpandableTxCard`-gaya topik dengan teks singkat | Tanpa video putar otomatis |
| R-17 | Kandang dan Periode + Pengaturan (V-05) | Nav Owner **Kandang** | Kartu kandang seperti Ringkasan bagian 2 dan 7 per kandang; halaman periode: konteks, pil status, tombol **Pengaturan**; Pengaturan: `ModeCard` Harian/Tidak aktif + tanggal berlaku + `ImpactBox` cakupan | Perubahan mode butuh sinyal dan konfirmasi |
| R-18 | Administrasi (V-24) | Hanya Admin; boleh memakai kerangka Owner | Daftar tenant dengan pil status/limit | Tidak perlu mockup untuk pilot |

<a id="fd09"></a>
## 9. Daftar koreksi gabungan

Koreksi berikut **wajib**. Tata letak, ukuran, dan warna di sekitarnya tetap sama. Setiap koreksi punya alasan dari aturan yang lebih tinggi (§1.2). Kolom **Mockup** berisi teks atau perilaku asli; kolom **Terapkan** berisi hasil final.

### 9.1 Semua layar

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-ALL-1 | `maximum-scale=1.0, user-scalable=no` | Viewport tanpa larangan zoom (§3.5) | WCAG 1.4.4 |
| K-ALL-2 | Tailwind CDN, Google Fonts, gambar `lh3.googleusercontent.com` | Tailwind build, font dan ikon disimpan di aplikasi, gambar dari aset lokal atau data pengguna | Harus berjalan offline (OFF-01); tanpa pihak ketiga saat runtime |
| K-ALL-3 | Logo bertuliskan "FARMFLOW" | Logo final dari pengguna; sementara emblem ayam tanpa tulisan di slot `h-8`/`h-7` | Nama aplikasi "Kandang Manajemen" ([§12](#fd12)) |
| K-ALL-4 | Foto profil orang | Lingkaran inisial (§5.1) | R1 tidak punya foto profil; foto stok bukan data pengguna |
| K-ALL-5 | Skrip demo (`alert()`, nominal awal 150000, "Menyimpan Kandang..." palsu, rentang nominal tetap untuk saran mirip) | Perilaku dari §7 dan API | Demo bukan perilaku produk |
| K-ALL-6 | Tanpa peran ARIA pada tab, lembar, laci; tombol ikon tanpa nama | Tambah `role`, `aria-*`, dan label (§10) | UX-07, WCAG 4.1.2 |
| K-ALL-7 | `z-40`/`z-50` bercampur untuk header, nav, lembar | Lapisan §4.4 | Lembar selalu di atas header dan nav |
| K-ALL-8 | Nama dan angka contoh (Budi Santoso, H. Hendra, Kandang A, Token ID, Rp420.000, Rp148.500) | Data nyata; fixture §11.2 untuk tes | Data contoh bukan data |

### 9.2 Navigasi

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-NAV-1 | Nav ABK: Hari Ini · Kas · + · Periksa · Ringkas | Hari Ini · **Uang Kas** · + (**Catat**) · **Riwayat** · **Lainnya** (§5.3) | ABK tidak berhak memeriksa belanja atau melihat ringkasan Owner (PRD §6); glosarium "Uang Kas" |
| K-NAV-2 | Periksa Belanja memakai header dan nav ABK | Header Owner dan nav Owner, **Transaksi** aktif | Periksa Belanja adalah layar Owner |
| K-NAV-3 | Tombol + tanpa nama | `aria-label="Catat"`; membuka lembar Catat (R-03) | Tombol ikon wajib bernama |

### 9.3 Hari Ini

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-HI-1 | Subjudul header "Kandang A • Terhubung" | "<Kandang aktif> • Terhubung/Tanpa sinyal" | Konteks sebenarnya (UX-02) |
| K-HI-2 | "Sinkronisasi Otomatis" | Tautan **Status Kirim** | Glosarium §16.5; tanpa janji kirim di latar |
| K-HI-3 | "Upah Kerja" | "Upah Pekerjaan" | Glosarium |
| K-HI-4 | Label "Operasional" berwarna tautan tanpa fungsi | Tautan **Semua** yang membuka lembar Catat | Elemen berwarna tautan harus berfungsi |
| K-HI-5 | "Antrean Lokal" | Tautan **Status Kirim** | Glosarium ("antrean" dilarang) |
| K-HI-6 | "Data Aman di Memori HP" · "Semua data otomatis tersimpan di HP sebelum sinkron." | "Catatan Aman di HP" · "Catatan tersimpan di HP sebelum dikirim." Tampil hanya bila penyimpanan lokal berhasil | Glosarium; tidak memberi rasa aman palsu (UT-30) |

### 9.4 Recording Harian

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-REC-1 | Subjudul header "Kandang A • Terhubung"; nav ABK dengan Periksa/Ringkas | Sama dengan K-HI-1 dan K-NAV-1/K-NAV-2 sesuai peran | Konteks dan izin |
| K-REC-2 | Ringkasan "520 kg · 5 hari data · 104 kg/hr" tidak cocok dengan daftar | Dihitung dari catatan Tercatat (§7.2.3) | Angka tidak dikarang (UX-03) |
| K-REC-3 | Baris Draf "Dicatat oleh Yanto" | "Draf di HP ini · <jam>" dan hanya terlihat di HP pembuatnya | Draf belum menjadi catatan bersama (D-22) |
| K-REC-4 | "≈ 2 sak" selalu tampil | Hanya bila berat per sak jenis pakan diketahui | 1 sak tidak otomatis 50 kg (WF-09) |
| K-REC-5 | "Standar harian: ~98-102 kg" | "Rata-rata 7 hari: <n> kg" dari catatan kandang sendiri | Tidak ada sumber standar di R1; bantuan hanya dari riwayat sendiri (UX-19) |
| K-REC-6 | `<input type="number" value="100">` | `type="text"` + keypad aplikasi (`inputmode="none"`/`"decimal"`), kosong di awal | D-26; tidak mengisi angka dari kebiasaan |
| K-REC-7 | Garis abu-abu di dalam isian angka dari plugin forms | Tanpa garis dalam; hanya garis wadah `border-black/[0.08]` | Efek samping plugin (§3.1) |
| K-REC-8 | Dua panah pada pilihan jenis pakan | Satu ikon `expand_more` | Efek samping plugin |
| K-REC-9 | Tab Mortalitas dan Sampling tanpa isi | Isi turunan §7.2.4–§7.2.5 | Permintaan pengguna: Recording bertab |

### 9.5 Catat Belanja

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-CB-1 | Judul header "Catat Harian" | "Catat" | "Catat Harian" mirip Recording Harian; kartu di bawahnya sudah berjudul "Catat Belanja" |
| K-CB-2 | "Tersinkron" di sebelah "Draf tersimpan di HP" | `cloud_done` "Terhubung" / `cloud_off` "Tanpa sinyal" | Glosarium; draf dan terkirim tidak boleh tampil bersamaan |
| K-CB-3 | Nominal awal Rp150.000 | Kosong, tampil "0" pudar | UX-04: nominal tidak diisi otomatis |
| K-CB-4 | "Uang Kas saya" terpilih awal | Tidak ada pilihan awal | UX-19: tidak memilih sumber uang |
| K-CB-5 | "Sisa saldo kas kecil di tangan: Rp420.000" | "Perkiraan uang di tangan: <nilai>" dari Uang Kas | Glosarium; angka harus sama dengan Uang Kas |
| K-CB-6 | "Belum tahu / Ragu" · "…saat verifikasi" | "Belum tahu" · "…saat memeriksa" | Label singkat; glosarium |
| K-CB-7 | **Tinjau Belanja** memunculkan `alert` "Menunggu ACC Owner" | Lembar Tinjau (§7.3) lalu **Kirim** | Tinjau → kirim (UX_UI_SPEC §11.2) |
| K-CB-8 | **Keyboard HP** memindahkan fokus ke Keperluan | Mengganti isian Nominal ke keyboard angka HP; pilihan diingat per perangkat | D-26 |

### 9.6 Uang Kas ABK

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-UK-1 | "Kas Operasional Lapangan" | "Uang Kas <nama>" | Glosarium |
| K-UK-2 | "Sinkron" | "Terhubung" / "Tanpa sinyal" | Glosarium |
| K-UK-3 | "Kembalikan" | "Kembalikan Uang" | Glosarium |
| K-UK-4 | "Khusus mutasi operasional kandang • Bebas kasbon" | "Hanya uang usaha untuk kandang · Bukan gaji atau kasbon" | Bahasa sehari-hari; makna jelas (UI-11) |
| K-UK-5 | Tulisan "Token ID: …" di atas foto nota | Foto tanpa keterangan tambahan | Aplikasi tidak membaca isi foto |
| K-UK-6 | Label laci "Metode Bayar: Tunai (Kas Lapangan)", "Pencatat (ABK)", "Toko / Supplier", "Status Validasi: Telah Diperiksa Owner" | "Dibayar dengan: Uang Kas <nama>", "Dicatat oleh", "Toko", "Status: Dibukukan Owner, <tgl>" | Glosarium dan status kanonis |

### 9.7 Ringkasan Owner

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-RO-1 | "Tersambung · Sinkron 16.05 WIB" | "Terhubung · Data terakhir 16.05 WIB" | Glosarium |
| K-RO-2 | "Masuk: 6 Sep 2026 • 5.000 ekor hidup" | "DOC masuk: 6 Sep 2026 • DOC 5.000 ekor" | Populasi hidup saat ini tidak dihitung di R1 |
| K-RO-3 | "Anak kandang belum memasukkan data pakan, mortalitas, dan bobot untuk hari ini." | "ABK belum mengisi pakan, mati/afkir, dan sampling untuk hari ini." | Glosarium |
| K-RO-4 | "Satu catatan bersama untuk seluruh anak kandang." | "Satu catatan bersama untuk seluruh kandang." | Catatan per kandang, bukan per orang (K-25) |
| K-RO-5 | Pil "Menunggu Panen"; "Data penjualan ayam … setelah panen tuntas." | Pil **Data Belum Lengkap**; "Rincian RHPP dari mitra belum ada. Hasil usaha dihitung setelah data lengkap." | Panen R2; hasil tergantung data, bukan panen |
| K-RO-6 | "Kas Operasional & ABK", "Kas Tunai Usaha (Owner)", "Rekening Bank Usaha" | "Uang Kas", "Kas tunai usaha", "Rekening usaha" | Glosarium |
| K-RO-7 | "Pemegang Kas Kandang Utara", "Pemegang Kas Bersama", "Belum pasti", "saldo riil belum dapat diverifikasi" | Subjudul = kandang tugas; "Belum dapat dipastikan"; "Perkiraan belum dapat dipastikan." | Tidak ada konsep kas bersama; bahasa jelas |
| K-RO-8 | Pil "Kosong" | Pil **Kandang Kosong** | Glosarium |

### 9.8 Periksa Belanja

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-PB-1 | Judul tersembunyi "Periksa Kandang" | Hapus | Tidak dipakai |
| K-PB-2 | "Sistem membatasi otomatisasi demi akurasi kas. Pembukuan hanya terjadi atas konfirmasi eksplisit Owner." | "Belanja baru dibukukan setelah Anda menekan Setujui & Bukukan." | Satu kalimat pendek (UX_UI_SPEC §16.6) |
| K-PB-3 | "Form Terbuka" | Tombol **Tutup** | Istilah teknis |
| K-PB-4 | "Toko / Vendor" | "Toko" | Glosarium |
| K-PB-5 | "Tanpa foto (Nota hilang)" | "Tanpa foto" | Foto opsional tanpa alasan (K-34) |
| K-PB-6 | "Sudah Diterima" terpilih awal | Tidak ada pilihan awal; wajib dipilih | Owner memastikan barang diterima; fakta tidak diisi otomatis |

### 9.9 Mulai Kandang

| Kode | Mockup | Terapkan | Alasan |
|---|---|---|---|
| K-MK-1 | Isian terisi contoh (Hadi Farm, Kandang Utara, PT Contoh Mitra, alamat) | Isian kosong dengan placeholder mockup | Data tidak dikarang |
| K-MK-2 | Dua bangunan 3.500 ekor terisi | Daftar bangunan kosong + **Tambah Bangunan**; total dari isian | Jumlah bangunan berbeda-beda (K-02) |
| K-MK-3 | WIB terpilih awal | Tidak ada pilihan awal | "Dipilih, bukan ditebak" (WF-02) |
| K-MK-4 | Recording Harian terpilih awal | Tidak ada pilihan awal; badge "Rekomendasi" tetap | Mode tidak dipilih diam-diam (WF-03, D-20) |
| K-MK-5 | Chip "Sinkron ABK", "FCR & IP Otomatis" | "Dipakai bersama ABK", "Rata-rata sampling otomatis" | FCR/IP adalah R2 |
| K-MK-6 | "Hanya mencatat keuangan, belanja pakan/OVK, kas kecil, dan penjualan ayam tanpa pencatatan harian ayam per sekat." · "Fokus Laba/Rugi" | "Tetap bisa mencatat belanja, uang kas, dan hasil periode tanpa recording harian." · "Fokus Keuangan" | Penjualan ayam dan sekat bukan fitur R1; tidak menjanjikan laba |
| K-MK-7 | "Ekosistem Pintar" · "Kandang terhubung siap memantau performa harian Anda" | "Mulai Sederhana" · "Catat kandang, belanja, dan uang di satu tempat." | IoT dan performa di luar R1 |
| K-MK-8 | Langkah 3 "Selesai & Buat Kandang Baru" lalu "Kandang Berhasil Disiapkan!" | **Siapkan Periode**; setelah berhasil kembali ke Ringkasan dengan pesan | Label aksi kanonis; berhasil hanya setelah server menerima |
| K-MK-9 | "Perlu sinyal untuk mengaktifkan periode" | "Perlu sinyal untuk menyimpan pengaturan kandang" | Siapkan Periode tidak mengaktifkan periode |

<a id="fd10"></a>
## 10. Aksesibilitas dan risiko visual

### 10.1 Tambahan wajib yang tidak mengubah tampilan

- Tab Recording: pola ARIA tabs (§7.2.2).
- Lembar: `role="dialog" aria-modal="true" aria-labelledby`, perangkap fokus, fokus kembali ke pemicu, Escape/Kembali menutup.
- Laci dan baris buka-tutup: pemicu `button` dengan `aria-expanded` dan `aria-controls`.
- Pilihan kartu (`ChoiceCard`, `RadioCardPair`, `SegmentedTimezone`, `ModeCard`, `DateSegment`): `input type="radio"` asli yang tersembunyi secara visual di dalam `label`, sehingga keyboard dan pembaca layar bekerja.
- Tombol ikon: `aria-label`. Ikon dekoratif: `aria-hidden="true"`. Lencana angka punya teks tersembunyi.
- Cincin fokus: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container` pada semua elemen interaktif. Hanya tampil saat memakai keyboard.
- Pesan singkat dan hasil hitung: `aria-live="polite"`.
- Target sentuh: elemen yang lebih kecil dari 44×44 px di mockup (tombol tutup 32 px, pil **Ganti**, tombol `edit`) diberi area sentuh tak terlihat minimal 44×44 px tanpa mengubah ukuran gambarnya.
- Zoom 200% dan lebar 320 px: tidak ada gulir samping pada halaman; kelas `truncate` tetap, tetapi teks lengkap tersedia lewat `title` atau baris detail.

### 10.2 Risiko kontras yang perlu keputusan pengguna

Rasio dihitung dari warna token terhadap latarnya (target teks kecil ≥4,5:1).

| Pasangan | Rasio | Dipakai untuk | Status |
|---|---|---|---|
| `ink-black-tertiary` (40% hitam) di atas putih | 2,85:1 | Metadata kecil, "Urut Terbaru", "Opsional", ikon `check_circle` | Di bawah target |
| `coral-alert` di atas `error-container` | 2,75:1 | Pil **Menunggu Kirim** | Di bawah target |
| `coral-alert` di atas putih | 3,55:1 | Nominal keluar belum dibukukan, peringatan | Di bawah target untuk teks kecil |
| Putih di atas `coral-alert` | 3,55:1 | Lencana jumlah, pil "1 hari lalu" | Di bawah target untuk teks kecil |
| Putih di atas `primary-container` | 4,57:1 | Tombol utama | Lolos tipis |
| `ink-black-secondary` di atas putih | 5,74:1 | Teks bantuan | Lolos |

Keputusan sementara: implementasi **mengikuti mockup** (K-39). Risiko ini diuji pada uji aksesibilitas IMP-056 dan uji pengguna. Bila pengguna menyetujui perbaikan, pilihan paling kecil adalah: `ink-black-tertiary` naik ke 55% untuk teks, dan teks merah memakai `on-error-container` (`#93000a`) di atas `error-container`. Perubahan ini harus dicatat sebagai revisi token, bukan diubah diam-diam per layar.

<a id="fd11"></a>
## 11. Pemeriksaan kesesuaian visual

### 11.1 Cara memeriksa

1. Jalankan aplikasi dengan fixture §11.2 dan buka layar pada Chromium, viewport 390×844, skala 1, font aplikasi sudah dimuat.
2. Ambil screenshot keadaan yang sama dengan file acuan (`reference-390-*-viewport.png` dan versi `-full`).
3. Bandingkan berdampingan dan dengan selisih piksel. Area yang berisi teks koreksi §9 dan data berbeda ditutup (mask) sebelum menghitung selisih.
4. Lulus bila, di luar area mask, selisih piksel ≤1% dan tidak ada perbedaan urutan, jarak, radius, warna, atau ikon yang terlihat mata. Perbedaan yang terlihat harus dijelaskan dengan kode §9 atau diperbaiki.
5. Ulangi untuk keadaan tambahan: tab Mortalitas dan Sampling, lembar ketiga tab, tanpa sinyal, kosong, error, dan koreksi. Keadaan ini tidak punya acuan Stitch, sehingga diperiksa dengan daftar kelas §6–§7 dan disetujui pengguna sekali, lalu screenshot-nya menjadi acuan baru.
6. Periksa juga 320 px, 360 px, zoom 200%, **Kurangi Efek Visual**, dan `prefers-reduced-motion`.

Pemeriksaan ini melengkapi, bukan menggantikan, tes perilaku dan aksesibilitas di TEST_PLAN.

### 11.2 Fixture tampilan

Pakai data contoh bersama [BRIEF_MOCKUP.md §7](BRIEF_MOCKUP.md#7-data-contoh-bersama) (Hadi Farm, Kandang Utara Periode 01 hari ke-18, Rudi, Yanto, belanja, uang kas), ditambah:

| Data | Nilai |
|---|---|
| Recording Pakan Tercatat | 17 Sep Pakan Pre-Starter 85 kg (Rudi 16.20) · 18 Sep BR-1 88 kg (Yanto 16.30) · 19 Sep 90 kg (Yanto 16.15) · 20 Sep 92 kg (Rudi 16.45) · 21 Sep 94 kg (Rudi 17.00) · 22 Sep 96 kg (Yanto 16.05) |
| Draf hari ini (HP Yanto) | 23 Sep BR-1 100 kg, 16.05 |
| Mati/Afkir Tercatat | 17 Sep 1/0 · 18 Sep 3/1 · 19 Sep 2/0 · 20 Sep 4/1 · 21 Sep 2/0 · 22 Sep 3/1 |
| Sampling | 14 Sep 25 ekor 11,25 kg · 21 Sep 25 ekor 17,5 kg · 22 Sep Tidak dilakukan |
| Jenis pakan | Pakan BR-1 (Starter Broiler), 50 kg per sak · Pakan Pre-Starter Crumbles, 50 kg per sak · Pakan BR-2 (Finisher), berat per sak belum diisi |

Hasil yang diharapkan dari fixture: tab Pakan "545 kg (≈ 10,9 sak)", "6 hari data", "Rata-rata: 90,8 kg/hr"; tab Mortalitas "15 ekor · Afkir 3 ekor", "Rata-rata mati: 2,5 ekor/hr"; tab Sampling "0,7 kg/ekor sampel · 21 Sep", "2 kali sampling".

<a id="fd12"></a>
## 12. Keputusan terbuka

| Topik | Keadaan | Yang dibutuhkan dari pengguna |
|---|---|---|
| Logo | Logo Stitch bertuliskan "FARMFLOW" | File logo final "Kandang Manajemen" (SVG atau PNG 512 px), atau persetujuan memakai emblem ayam tanpa tulisan |
| Foto profil | Diganti inisial | Konfirmasi bahwa inisial cukup untuk R1 |
| Kontras | Beberapa pasangan di bawah target (§10.2) | Setuju tetap seperti mockup sampai uji, atau setuju perbaikan kecil sekarang |
| Mockup tab Mortalitas dan Sampling | Turunan tertulis §7.2.4–§7.2.5 | Opsional: mockup Stitch kedua tab bila ingin detail berbeda |
| Layar tanpa mockup | Resep §8 | Mockup berikutnya sesuai urutan prioritas §8 |
| Banner foto Mulai Kandang | Memakai gambar Stitch sementara | Gambar final atau hapus banner |
| Pintasan +50rb/+100rb | Dipakai seperti mockup | Konfirmasi nilai pintasan |
| Tampilan tablet/desktop | Satu kolom di tengah | Mockup layar lebar bila dua panel diinginkan |

<a id="fd13"></a>
## 13. Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Dokumen pertama dari tujuh mockup Google Stitch dan `DESIGN.md` pengguna (K-39): sumber kebenaran, fondasi teknis tanpa CDN, token, kerangka dan navigasi per peran, sekitar 60 komponen dan varian, blueprint tujuh layar termasuk Recording Harian bertab tiga (Pakan persis mockup; Mortalitas dan Sampling turunan), 18 resep layar tanpa mockup, 63 koreksi wajib, risiko kontras, dan cara pemeriksaan visual. Belum ada frontend yang dibangun atau diuji |
