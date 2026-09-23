# Folder design — acuan visual Kandang Manajemen

Folder ini berisi desain visual final yang diberikan pengguna pada 23 September 2026 (keputusan K-39). Aturan cara memakainya ada di [FRONTEND_DESIGN_SPEC.md](../FRONTEND_DESIGN_SPEC.md).

| Path | Isi | Boleh diubah? |
|---|---|---|
| `DESIGN.md` | Style reference gaya Notion ("warm paper") dari pengguna | Tidak |
| `stitch/DESIGN.stitch.md` | Sistem "Modern Glassmorphism & Warm Paper" dari Google Stitch | Tidak |
| `stitch/tailwind.config.json` | Konfigurasi Tailwind yang sama di ketujuh layar, dinormalisasi | Tidak; ubah hanya lewat revisi token yang disetujui |
| `stitch/<layar>/code.html` | HTML + Tailwind asli dari Stitch | Tidak. Koreksi ditulis di FRONTEND_DESIGN_SPEC §9, bukan di file ini |
| `stitch/<layar>/stitch-screen.png` | Screenshot asli dari Stitch | Tidak |
| `stitch/<layar>/corrected.html` | `code.html` + koreksi tampilan FRONTEND_DESIGN_SPEC §9, dibuat oleh `tools/buat_acuan_terkoreksi.py` | Tidak diedit manual; buat ulang dengan skrip |
| `stitch/<layar>/reference-390-terkoreksi-*.png` | Render 390 px dari `corrected.html`, animasi dimatikan. **Target lulus/gagal** pemeriksaan visual | Buat ulang dengan `tools/render_acuan.sh` bila `corrected.html` berubah |
| `stitch/<layar>/reference-390-*.png` (tanpa "terkoreksi") | Render Chromium 390 px dari `code.html` asli | Arsip; dibuat ulang hanya bila `code.html` berubah |
| `stitch/masks.json` | Area yang tidak dihitung saat membandingkan (hanya logo sementara) | Hapus mask logo setelah logo final dipasang |
| `tools/` | Pembuat acuan terkoreksi, perender acuan, pembanding screenshot, pengecek kelas, uji fondasi lokal | Ubah bersama FRONTEND_DESIGN_SPEC |
| `stitch/assets/` | Salinan lokal gambar dari mockup (logo sementara, avatar contoh, foto nota contoh, banner) | Ganti dengan aset final pengguna |

Layar: `hari_ini_abk`, `recording_harian_tab_riwayat_ringkas`, `catat_belanja_keypad`, `uang_kas_abk`, `ringkasan_owner_dashboard`, `periksa_belanja_owner`, `mulai_kandang_setup_3_langkah`.

`code.html` memuat Tailwind, font, dan gambar dari internet. Membukanya di browser memerlukan koneksi. Aplikasi yang dibangun tidak boleh memakai sumber daring tersebut.

Nama, angka, dan tanggal di mockup adalah contoh.

## Memeriksa hasil frontend

```text
python3 design/tools/cek_kelas.py <folder kode web>
python3 design/tools/bandingkan_screenshot.py design/stitch/<layar>/reference-390-terkoreksi-viewport.png <screenshot aplikasi>.png --mask-file design/stitch/masks.json --out selisih.png
bash design/tools/uji_fondasi_lokal.sh   # membuktikan resep Tailwind/font lokal masih sama dengan acuan
```

Cara lengkap ada di FRONTEND_DESIGN_SPEC §3.7 dan §11. `corrected.html` masih memuat Tailwind dan font dari internet agar bisa dibuka langsung di browser; aplikasi tetap tidak boleh memakai sumber daring.
