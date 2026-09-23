# Folder design — acuan visual Kandang Manajemen

Folder ini berisi desain visual final yang diberikan pengguna pada 23 September 2026 (keputusan K-39). Aturan cara memakainya ada di [FRONTEND_DESIGN_SPEC.md](../FRONTEND_DESIGN_SPEC.md).

| Path | Isi | Boleh diubah? |
|---|---|---|
| `DESIGN.md` | Style reference gaya Notion ("warm paper") dari pengguna | Tidak |
| `stitch/DESIGN.stitch.md` | Sistem "Modern Glassmorphism & Warm Paper" dari Google Stitch | Tidak |
| `stitch/tailwind.config.json` | Konfigurasi Tailwind yang sama di ketujuh layar, dinormalisasi | Tidak; ubah hanya lewat revisi token yang disetujui |
| `stitch/<layar>/code.html` | HTML + Tailwind asli dari Stitch | Tidak. Koreksi ditulis di FRONTEND_DESIGN_SPEC §9, bukan di file ini |
| `stitch/<layar>/stitch-screen.png` | Screenshot asli dari Stitch | Tidak |
| `stitch/<layar>/reference-390-*.png` | Render Chromium 390 px dari `code.html` | Dibuat ulang hanya bila `code.html` berubah |
| `stitch/assets/` | Salinan lokal gambar dari mockup (logo sementara, avatar contoh, foto nota contoh, banner) | Ganti dengan aset final pengguna |

Layar: `hari_ini_abk`, `recording_harian_tab_riwayat_ringkas`, `catat_belanja_keypad`, `uang_kas_abk`, `ringkasan_owner_dashboard`, `periksa_belanja_owner`, `mulai_kandang_setup_3_langkah`.

`code.html` memuat Tailwind, font, dan gambar dari internet. Membukanya di browser memerlukan koneksi. Aplikasi yang dibangun tidak boleh memakai sumber daring tersebut.

Nama, angka, dan tanggal di mockup adalah contoh.
