# Panduan agent

## Perencanaan produk

- Fase kerja saat ini adalah dokumen perencanaan `.md`. Desain visual final sudah ditetapkan pengguna (K-39): tujuh mockup Google Stitch dan `DESIGN.md` di `design/`, dengan aturan implementasi di `FRONTEND_DESIGN_SPEC.md`. Jangan membuat prototype, aset visual baru, atau implementasi aplikasi tanpa permintaan baru yang eksplisit. Baca `PLANNING.md` untuk urutan dan status dokumen. Folder `mockups/` lama dinilai pengguna kurang bagus dan **bukan** acuan tampilan. `BRIEF_MOCKUP.md` dipakai untuk isi layar yang belum punya mockup.
- Baca `PRD.md` dan `UX_UI_SPEC.md` untuk keputusan bisnis, batas rilis, serta status usulan. Jangan menganggap rancangan atau hasil generator sebagai persetujuan pengguna maupun hasil uji aplikasi.
- Pertahankan prinsip aplikasi sangat dinamis dan sederhana. Gunakan bahasa bisnis yang mudah dipahami pengguna nonteknis dan label aplikasi yang pendek serta jelas.

## Pelaksanaan oleh agent setelah izin fase diberikan

- Baca `Implementation Plan.md` (nama kanonis dengan spasi), `SECURITY_OPERATIONS.md`, `DATA_MODEL.md`, `API_SYNC_SPEC.md`, dan `TEST_PLAN.md` untuk tugas terkait. Selesainya dokumen bukan izin coding, deployment atau pilot finansial.
- Kerjakan satu kartu IMP dengan dependensi yang sudah terbukti selesai. Baca aturan/AC/GOLD/UT sumber, periksa kode/manifest nyata, dan batasi perubahan pada tujuan kartu; jangan mengarang path, command, versi library, atau status pengujian.
- Jika keputusan bisnis/keamanan belum ada atau dokumen bertentangan, hentikan bagian terdampak dan laporkan blocker beserta sumbernya. Jangan mengganti unknown dengan nol, membuat dummy finansial, mengaktifkan R2 atau menebak sumber dana agar alur lolos.
- Tes gagal adalah temuan: perbaiki akar penyebab, bukan menghapus assertion, melemahkan oracle, atau mengganti DB/perangkat nyata dengan mock untuk klaim integritas/offline. Laporkan perintah, hasil, batas belum diuji dan review diff.
- Jaga satu pemilik perubahan pada schema/kontrak/file bersama; receipt, efek uang, audit dan recovery tidak boleh dipecah menjadi posting parsial. Semua kartu saat penyusunan dokumen berstatus belum dikerjakan.

## Pekerjaan UI/UX

- Gunakan `.agents/skills/ui-ux-pro-max/SKILL.md` sebelum merancang, membangun, atau meninjau antarmuka. Baca instruksi lengkap dan jalankan pencarian lokal yang relevan.
- Arah visual sudah ditetapkan (K-39); hasil skill tidak boleh mengubah token atau tata letak mockup. Pakai `--design-system` hanya untuk meninjau, `--domain` untuk masalah khusus, dan `--stack` hanya setelah stack diketahui. Jangan memilih teknologi hanya karena direkomendasikan skill.
- Periksa kecocokan setiap hasil dengan aplikasi operasional mobile-first, Owner/ABK, dan spesifikasi proyek. Hasil katalog bukan aturan bisnis; pola landing page tidak otomatis cocok untuk dashboard operasional.
- Tampilan frontend harus **persis** mockup `design/stitch/` sesuai `FRONTEND_DESIGN_SPEC.md`: salin kelas dari `corrected.html`/`code.html`, pakai hanya token §4, terapkan koreksi wajib §9, dan buktikan dengan alat di `design/tools/` (§3.7 dan §11): `cek_kelas.py` lulus dan `bandingkan_screenshot.py` LULUS terhadap `reference-390-terkoreksi-*`. Jangan menambah mask untuk menutupi perbedaan. Layar tanpa mockup disusun dari komponen §6 menurut resep §8; jangan menciptakan pola baru. Isian, keypad, dan nominal tetap solid dengan fallback solid untuk kaca. Font dan ikon disimpan di aplikasi, bukan CDN. Jangan menambah animasi atau input yang membebani ABK demi tampilan.
- Untuk layar, pakai komponen fondasi IMP-006 (katalog `FRONTEND_DESIGN_SPEC.md` §6), label glosarium `UX_UI_SPEC.md` §16.5, aturan bahasa §16.6, dan batas bantuan pintar §5.4. Jangan mengisi angka dari kebiasaan, membukukan dengan geser, atau menambah istilah teknis di layar; lihat `UX_AUDIT.md`.
- Jangan menyimpan hasil generator sebagai desain final sebelum ditinjau. Verifikasi perubahan UI pada aplikasi yang berjalan saat implementasinya tersedia; pemasangan skill tidak membuktikan UI sudah bagus atau lulus uji.

Versi, sumber, dan perintah verifikasi skill ada di `.agents/README.md`.
