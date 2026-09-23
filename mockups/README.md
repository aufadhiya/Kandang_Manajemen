# Mockup layar penting — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.1 |
| Tanggal | 23 September 2026 |
| Dasar | Permintaan eksplisit pengguna: mockup beberapa layar penting yang dapat dipindahkan ke frontend |
| Status | Mockup berjalan dengan data contoh; **bukan aplikasi, bukan hasil uji pengguna, bukan persetujuan desain final** |
| Penilaian pengguna | 23 September 2026: desain visual dinilai kurang bagus. Jangan dipakai sebagai acuan tampilan; isi halaman untuk mockup baru ada di [BRIEF_MOCKUP.md](../BRIEF_MOCKUP.md) |
| Sumber aturan | [PRD](../PRD.md) K-38, D-24, D-26, D-27; [UX_UI_SPEC](../UX_UI_SPEC.md) §4–5, §8, §11, §15–16; [UX_FLOWS](../UX_FLOWS_WIREFRAMES.md) WF-11–WF-13; [IMP-006](../Implementation%20Plan.md#imp-006) |

## 1. Cara membuka

```bash
python3 -m http.server 3000 --directory mockups   # buka http://localhost:3000/
node --test 'mockups/tests/*.test.mjs'            # tes format angka, istilah layar, salinan lembar
```

Tidak ada build, paket npm, font daring, atau CDN. Browser modern cukup; file harus dibuka lewat server (ES module tidak jalan dari `file://`).

## 2. Layar yang dibuat

| File | Layar spesifikasi | Yang dibuktikan |
|---|---|---|
| `screens/hari-ini.html` | V-02 Hari Ini ABK, V-09 Catat Belanja, V-13 Terima/Kembalikan Uang | Saran berikutnya + **Kenapa?**, Catat cepat, lembar dua langkah (isi → tinjau) dengan keypad, draf di HP, peringatan belanja mirip, daftar buka-tutup |
| `screens/recording-harian.html` | V-06, WF-06 | Satu catatan bersama; keypad kuantitas berkoma; −/+ ekor; “tidak sampling” bukan 0; rata-rata sampel otomatis; peringatan angka tidak biasa tanpa memblokir; **Lanjut** antarfield |
| `screens/uang-kas.html` | V-08, WF-11 | Perkiraan uang di tangan beserta cara menghitung; riwayat buka-tutup; lembar ABK sama dengan Hari Ini |
| `screens/ringkasan-owner.html` | V-01, V-04, V-07 | Persiapan bebas urutan dengan alasan ketergantungan; saran berubah mengikuti data; **Nanti** hanya untuk saran opsional; DOC Masuk dengan pratinjau aktivasi |
| `screens/periksa-belanja.html` | V-11, WF-13 | Baris buka-tutup; nominal dibayar dengan keypad; dampak dihitung ulang dari cara bayar/pembebanan; konfirmasi menyebut objek + dampak; **Bukukan** nonaktif tanpa sinyal |

Coba `?simulasi=offline` pada layar mana pun untuk melihat keadaan tanpa sinyal (khusus mockup).

## 3. Apa yang langsung dipakai di frontend dan apa yang tidak

**Dipakai apa adanya (nilai, struktur, perilaku):**

- `assets/tokens.css` — semua warna, ukuran, spasi, radius, lapisan, durasi. Nama variabel tetap; framework boleh membacanya sebagai CSS variable atau memetakannya ke theme object dengan nama sama.
- `assets/format.js` — fungsi murni: `terbilang`, `formatRupiah`, `formatQuantity`, `normalizeTyped`, `parsePastedRupiah`, `applyKeypadKey`. Rupiah selalu **string digit bulat** (cocok dengan `amount_idr` API), bukan float. Sudah dites.
- Markup + atribut ARIA tiap komponen di §4, urutan fokus, perilaku tombol Kembali, dan teks layar (sudah lolos pemeriksa istilah).
- `assets/components.css` — gaya komponen. Boleh dipakai sebagai CSS global/module; nama kelas mengikuti pola `blok__elemen--varian`.

**Perilaku ditulis ulang dengan cara framework, logikanya tetap:** `assets/components.js` (lembar, buka-tutup, keypad, validasi, draf). Aturannya dicatat di §4; jangan mengubah hasil yang terlihat pengguna saat porting.

**Tidak dibawa ke produk:** `assets/mock.js`, `screens/*.js` (keadaan contoh), `?simulasi=offline`, `localStorage` untuk draf (produk memakai penyimpanan lokal pilihan ADR, kandidat IndexedDB — ARCHITECTURE §12), semua nama/angka contoh, dan `.mock-note`.

**Belum diputuskan oleh mockup:** framework (AT-01 masih kandidat React + TypeScript + Vite), router, library penyimpanan lokal, izin server, dan API. Mockup sengaja memakai HTML/CSS/JS standar agar tidak mengunci pilihan itu.

## 4. Kontrak komponen

Nama komponen di kolom pertama adalah nama yang disarankan saat dibuat ulang di framework.

| Komponen | Markup inti | Aturan yang wajib dipertahankan |
|---|---|---|
| `AppBar` | `header.app-bar` > `.app-bar__inner` | Lengket di atas; efek kaca hanya bila `backdrop-filter` didukung, dimatikan oleh `prefers-reduced-transparency` atau kelas `.reduce-effects` (Kurangi Efek Visual) |
| `BottomNav` | `nav.bottom-nav` > `a/button.bottom-nav__item` | 5 item per peran (§6); item aktif memakai `aria-current="page"`, bukan warna saja; **Catat** ABK di tengah; disembunyikan saat keypad terbuka |
| `NextStepCard` | `section.next-step` | Satu judul, satu kalimat, satu aksi utama; **Kenapa?** membuka alasan di tempat; **Nanti** hanya untuk saran opsional dan dapat diurungkan; isi berasal dari data + izin, bukan urutan tetap |
| `Status` | `span.status.status--{success,warning,danger,info,neutral}` + ikon + teks | Hanya label kanonis UX_UI_SPEC §15.1; warna tidak pernah satu-satunya penanda |
| `Disclosure` | `button.disclosure__toggle[aria-expanded][aria-controls]` + panel `[hidden]` | Ringkasan baris: judul, meta, status di kiri; nominal di kanan. Opsional `data-url-key/value` agar baris terbuka punya alamat (Kembali menutupnya, tautan membukanya). **Tutup Semua** tanpa menambah riwayat |
| `Sheet` | `dialog.sheet[data-sheet]` dengan `aria-labelledby`, judul `tabindex="-1"` | Lembar bawah di HP, samping ≥900px; buka = `?sheet=id` + satu entri riwayat; Kembali/Escape/scrim/Tutup menutup lewat riwayat; hanya satu lembar aktif (ganti lembar tidak menambah riwayat); fokus ke judul saat buka dan kembali ke pemicu saat tutup; draf tidak hilang saat ditutup |
| `NumericField` | `input[type=text][data-numeric=rupiah|quantity|count]` | Nilai kanonis di `data-value`, tampilan terformat; `inputmode="none"` saat keypad aplikasi aktif, `numeric`/`decimal` saat **Keyboard HP**; rupiah menampilkan ejaan (`aria-describedby`); paste ambigu minta konfirmasi; tidak pernah diisi dari kebiasaan |
| `Keypad` | `div.keypad[data-keypad]` (di dalam lembar atau di akhir `body`) | Tombol 56px; `000` hanya rupiah, `,` hanya kuantitas; **Lanjut** ke field ketik berikutnya, **Selesai**, **Keyboard HP** (disimpan per perangkat); `pointerdown` tidak mencuri fokus; seluruh field + ejaan tetap terlihat di atasnya; menyembunyikan nav/bar aksi |
| `Stepper` | `.stepper` > tombol −/+ `[data-stepper-target]` + `NumericField count` | Tombol berlabel (“Tambah mati satu ekor”); kosong ≠ 0; tidak turun di bawah 0 |
| `ChoiceGroup` | `fieldset` > `legend` + `input[type=radio]` asli + `label.choice__label` | Radio asli tetap fokus/terbaca; tanda centang + teks saat dipilih; varian `--stack`, `--segmented`, `--scroll` |
| `Field` + error | `.field` > `label` + kontrol + `.field__hint`; error `.field__error#{id}-error` | Error tepat di bawah kontrol, `aria-invalid` + `aria-describedby`; ≥2 error dalam formulir → `.error-summary` terfokus berisi tautan; tanpa ringkasan → fokus ke masalah pertama |
| `SmartNotice` | `.field__notice` | Hanya dari data nyata (perbandingan kemarin, jauh di atas 7 hari, beda dari catatan pencatat, belanja mirip); tidak memblokir dan tidak mengubah angka (UX_UI_SPEC §5.4) |
| `ImpactPreview` | `.impact[aria-live=polite]` | Kalimat dampak dihitung dari nilai yang sedang dipilih; muncul sebelum tombol uang dan diulang di konfirmasi |
| `ActionBar` | `div.action-bar` | Untuk halaman fokus (Recording); disembunyikan saat keypad terbuka |
| `Toast` | `.toast-region[role=status][aria-live=polite]` | Pesan status singkat; **Urungkan** hanya untuk aksi lokal, tidak pernah untuk efek uang yang sudah dibukukan; muncul setelah lembar tertutup |
| Tombol butuh sinyal | `[data-requires-online]` + `.disabled-reason[data-offline-reason]` | Aksi pembukuan Owner nonaktif dengan alasan tertulis saat offline; aksi ABK tetap bisa disimpan di HP |

## 5. Batas yang belum terbukti

Sudah diperiksa di browser headless (Chromium): 320, 390, dan 1280 CSS px tanpa gulir samping; target sentuh ≥44px; alur isi → tinjau → kirim; tombol Kembali; draf setelah muat ulang; keadaan tanpa sinyal; tidak ada error konsol.

Belum diperiksa, wajib di IMP-006 sebelum dianggap final: TalkBack/VoiceOver pada keypad (bila gagal, keyboard HP menjadi default — D-26), HP Android kelas bawah, keyboard HP menutupi lembar, zoom 200%, forced colors di perangkat nyata, dan uji pemahaman label dengan Owner/ABK (UX_AUDIT §7). Warna dan token tetap usulan (UX-13).

## 6. Aturan saat mengubah mockup

- Lembar ABK hanya diubah di `screens/hari-ini.html`, lalu disalin ke blok `ABK-SHEETS` di `uang-kas.html`; tes `sheets-sync` gagal bila salinan berbeda.
- Teks layar baru harus lolos `tests/screen-text.test.mjs` (istilah terlarang IMP-006 + glosarium §16.5).
- Jangan menambah komponen di luar §4 tanpa memperbarui tabel ini dan glosarium.
