# Peta Dokumen Perencanaan — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.8 |
| Tanggal | 23 September 2026 |
| Fase aktif | Perencanaan tertulis dalam file `.md`, dengan desain visual final dari pengguna di `design/` (K-39) |
| Arahan pengguna | Selesaikan seluruh dokumen perencanaan; Implementation Plan harus rinci dan spesifik untuk AI agent dengan kemampuan penalaran terbatas; audit agar UI/UX sangat mudah, jelas, mengarahkan tetapi bebas, pintar, dengan keypad angka, buka-tutup detail, dan sedikit pindah halaman (K-38) |
| Status | Seluruh sembilan dokumen produk/teknis dalam paket R1 serta audit kemudahan tersedia sebagai draft; keputusan terbuka dan bukti implementasi tetap terpisah |

## 1. Batas pekerjaan saat ini

- Hasil pekerjaan berupa Markdown: kebutuhan, aturan, alur tertulis, keputusan teknis, rancangan data/layanan, keamanan, rencana pembangunan, dan rencana pengujian.
- Desain visual final adalah tujuh mockup Google Stitch dan `DESIGN.md` dari pengguna di [design/](design/README.md), diterjemahkan menjadi aturan implementasi di [FRONTEND_DESIGN_SPEC.md](FRONTEND_DESIGN_SPEC.md) (K-39). Mockup lama di [mockups/](mockups/README.md) bukan acuan tampilan. Desain final bukan aplikasi, hasil uji pengguna, atau izin implementasi; tidak membuat prototype atau kode aplikasi tanpa permintaan baru.
- Sketsa teks yang sudah ada di dokumen alur adalah penjelasan struktur dan urutan baca, bukan mockup yang berjalan. Tidak perlu mengubahnya menjadi gambar atau halaman aplikasi.
- Pengujian aplikasi, aksesibilitas, keamanan, dan pemulihan tetap direncanakan untuk implementasi mendatang jika diminta pengguna. Pemeriksaan dokumen tidak menggantikan pengujian tersebut atau membuktikan kesiapan produksi.
- Skill UI UX Pro Max tetap membantu meninjau spesifikasi UX tertulis. Rekomendasi skill tidak mengubah aturan bisnis, memilih stack, atau memberikan izin membuat artefak di luar fase ini.

## 2. Dokumen yang sudah tersedia

**Tersedia berarti file sudah ditulis, bukan seluruh isinya disetujui atau diuji.**

| Dokumen | Fungsi | Status |
|---|---|---|
| [PRD.md](PRD.md) v0.6 | Makna bisnis, keputusan K, usulan D, pertanyaan Q, batas rilis, aturan dan kriteria penerimaan | Draft tersedia; keputusan dan usulan dibedakan |
| [UX_UI_SPEC.md](UX_UI_SPEC.md) v0.4 | Prinsip pengalaman, keypad angka, bantuan pintar, pola kerja di tempat, glosarium, navigasi, layar, label, status, arah visual tertulis dan skenario UX | Draft tersedia; bukan hasil uji UI |
| [UX_FLOWS_WIREFRAMES.md](UX_FLOWS_WIREFRAMES.md) v0.3 | Sepuluh alur, aturan arahan bebas, sketsa teks, data minimum, cabang gagal/offline, dan rencana validasi | Draft tersedia; lima layar penting punya mockup di `mockups/` |
| [UX_AUDIT.md](UX_AUDIT.md) v0.2 | Audit kemudahan: temuan, perbaikan yang diterapkan, batas yang sengaja dijaga, risiko dan cara membuktikan | Audit dokumen; bukan hasil uji pengguna |
| [ARCHITECTURE.md](ARCHITECTURE.md) v0.2 | Batas modul R1, aliran data/transaksi, offline, isolasi, pemulihan, opsi teknologi dan biaya | Draft tersedia; pilihan teknis belum final, bukan sistem yang sudah berjalan atau diuji |
| [SECURITY_OPERATIONS.md](SECURITY_OPERATIONS.md) v0.2 | Izin/privasi, akun tanpa email, data lokal, lampiran/ekspor, retensi, operasional, backup/restore dan insiden | Draft tersedia; kebijakan Q dan parameter ADR belum disetujui, drill belum dijalankan |
| [DATA_MODEL.md](DATA_MODEL.md) v0.2 | Entitas/relasi R1, tipe/status/key/constraint, sumber/efek, saldo awal, koreksi, concurrency dan recovery | Model logis tersedia; bukan DDL/migrasi yang telah dijalankan atau pilihan ORM |
| [API_SYNC_SPEC.md](API_SYNC_SPEC.md) v0.4 | 69 command/14 query, envelope, izin, hasil/error, idempotensi, antrean/konflik, file, ekspor dan recovery | Kontrak logis tersedia; endpoint dan versi teknis belum diimplementasikan |
| [TEST_PLAN.md](TEST_PLAN.md) v0.4 | Pemetaan individual 100 AC, 30 GOLD dan 49 UT; fixtures, suite, gate teknis dan pilot, format bukti | Rencana lengkap tersedia; semua tes aplikasi belum dijalankan |
| [Implementation Plan.md](Implementation%20Plan.md) v0.4 | 63 kartu berurutan, termasuk fondasi UI: prasyarat, area perubahan, sumber, langkah, hasil, tes, stop conditions, review dan handoff | Semua tugas NOT_STARTED; sangat rinci tetapi bukan izin coding/deploy/pilot |
| [AGENTS.md](AGENTS.md) | Batas dan cara kerja agent di proyek | Panduan kerja, bukan persetujuan produk |
| [.agents/README.md](.agents/README.md) | Sumber, versi, penggunaan, serta verifikasi instalasi skill | Dokumentasi alat bantu; bukan bukti mutu UI aplikasi |
| [FRONTEND_DESIGN_SPEC.md](FRONTEND_DESIGN_SPEC.md) v0.2 | Aturan implementasi desain final: sumber kebenaran, fondasi teknis tanpa CDN, token, kerangka/navigasi, katalog komponen, blueprint tujuh layar (termasuk Recording Harian bertab), resep layar tanpa mockup, koreksi wajib, kontras, pemeriksaan visual | Keputusan desain pengguna K-39; belum ada frontend yang dibangun atau diuji |
| [design/](design/README.md) | Tujuh mockup Google Stitch (`code.html` asli, `corrected.html` terkoreksi, screenshot asli dan acuan 390 px), `DESIGN.md`, konfigurasi Tailwind, aset, alat pemeriksa di `design/tools/` | Sumber visual final; file asli tidak diubah, acuan terkoreksi dibuat ulang lewat skrip |
| [mockups/README.md](mockups/README.md) v0.1 | Mockup HTML/CSS lima layar penting, token, kontrak komponen, dan batas porting ke frontend | Mockup berjalan dengan data contoh; desain visualnya dinilai pengguna kurang bagus, jadi bukan acuan tampilan |
| [BRIEF_MOCKUP.md](BRIEF_MOCKUP.md) v0.1 | Brief satu file untuk membuat mockup di alat lain: konsep, aturan isi, bahasa layar, dan isi 16 halaman penting tanpa arahan visual | Rangkuman dokumen sumber; desain diarahkan sendiri oleh pengguna |

PRD tetap sumber makna bisnis. Spesifikasi UX menjelaskan perilaku yang terlihat pengguna; dokumen alur menjelaskan urutannya. Arsitektur menjelaskan pembagian tanggung jawab; keamanan, model data dan API memperinci pengamannya. Rencana tes mendefinisikan pembukti; Implementation Plan mengatur urutan pelaksanaan. Tidak ada dokumen turunan yang boleh mendefinisikan ulang kas, biaya, recording, hak akses atau persetujuan pengguna.

## 3. Paket lengkap dan urutan peninjauan berikutnya

**Tidak ada file perencanaan utama dalam daftar ini yang masih menunggu dibuat.** “Lengkap” berarti isi perencanaan tersedia dan tertaut, bukan seluruh pilihan disetujui atau aplikasi siap produksi. Nama kanonis rencana implementasi adalah **`Implementation Plan.md`** sesuai permintaan pengguna; jangan membuat salinan berjudul lain dengan isi yang menyimpang.

| Urutan baca/review | Fokus |
|---|---|
| PRD → UX/UI → alur → audit kemudahan | Pastikan keputusan bisnis, scope R1 dan pengalaman tetap sederhana; label mengikuti glosarium; keputusan K yang telah terkonfirmasi tidak ditanyakan ulang |
| Arsitektur → keamanan/operasional | Tinjau usulan teknologi/biaya, akun/recovery tanpa email, perangkat/lease, retensi, backup dan penanggung jawab operasi |
| Model data → API/sync | Cocokkan sumber/effects, key/status/versions, atomicity, authorization, konflik dan pemulihan; tidak memutuskan ulang aturan finansial |
| Rencana tes → Implementation Plan | Tinjau traceability, urutan/dependensi, bukti DONE, larangan jalan pintas dan batas prapilot/pilot |

**Langkah berikut saat ini adalah peninjauan keputusan terbuka**, termasuk keputusan desain di [FRONTEND_DESIGN_SPEC §12](FRONTEND_DESIGN_SPEC.md#fd12) (logo, kontras, mockup layar berikutnya), bukan coding. Pertanyaan Q-01–Q-11 dan opsi AT yang relevan tetap terbuka menurut gate masing-masing; Q-12 telah ditutup. Pengguna tidak harus memilih nama library: penanggung jawab teknis menyiapkan perbandingan beralasan dan dampak biaya/operasi sebelum meminta keputusan yang diperlukan.

ADR, peta path/perintah runtime dan catatan eksekusi dibuat saat keputusan spesifik atau fase implementasi telah diizinkan. Tidak membuat file kosong yang menyiratkan keputusan/tes telah tersedia. Implementation Plan membedakan izin pembangunan, pembekuan teknis, kesiapan prapilot dan otorisasi data finansial nyata.

## 4. Cara meninjau tiap dokumen

1. Baca kebutuhan dan keputusan yang terkait; jangan membuka kembali keputusan terkonfirmasi tanpa alasan atau permintaan pengguna.
2. Tulis tujuan, cakupan R1, yang tidak termasuk, sumber requirement, asumsi/usulan, dan pertanyaan yang masih perlu dijawab.
3. Jelaskan pilihan teknis dalam bahasa bisnis: pengaruhnya pada kemudahan, keamanan uang/data, biaya, dan pekerjaan Owner/ABK.
4. Periksa contoh perhitungan, status dan efek samping, alur gagal, otorisasi, serta rujukan antardokumen. Aturan lintas modul tidak boleh saling bertentangan.
5. Perbarui status file di peta ini setelah dokumen benar-benar dibuat. Catat persetujuan hanya bila pengguna menyatakannya; file selesai ditulis bukan persetujuan otomatis.

**Pemeriksaan paket pada 23 September 2026:** pemeriksaan terprogram terhadap ID/rentang, tabel, tautan/anchor, kelengkapan 100 AC/30 GOLD/49 UT, graph 63 kartu tanpa dependensi maju (termasuk semua kartu layar bergantung pada fondasi UI IMP-006), label terlarang pada sketsa layar, serta pemetaan 69 CMD/14 QRY ke kartu dan suite. Contoh aritmetika diperiksa; reviewer read-only meninjau pengaman keuangan, akun, offline/recovery, dependensi dan batas gate, lalu temuan diselaraskan lintas dokumen. Diff PRD/UX terhadap awal sesi hanya menambah rujukan/status handoff, tidak mengganti keputusan bisnis. Ini **pemeriksaan dokumen**, bukan hasil menjalankan aplikasi, migrasi, security audit, benchmark, restore atau pilot.

## 5. Syarat perencanaan siap ditinjau menyeluruh

- [x] Sembilan dokumen utama tersedia dan mempunyai rujukan antardokumen; perubahan lanjutan tetap perlu review konsistensi.
- [x] Keputusan belum final ditandai beserta dampak/gate; tidak ada klaim produksi lulus dari Markdown.
- [x] Batas R1/R2 dan invariant bisnis diteruskan ke model, kontrak, tes serta kartu tugas; pengujian aplikasi tetap belum dilakukan.
- [x] Backlog terurai tertaut aturan/tes, tanpa janji jadwal/biaya teknis tanpa dasar.
- [ ] Pengguna meninjau bagian yang membutuhkan keputusan bisnis; pertanyaan disampaikan tanpa mengharuskan pengguna memahami istilah developer.

Penyelesaian checklist perencanaan dan adanya mockup tidak mengubah fase menjadi implementasi. Perubahan jenis pekerjaan menunggu permintaan eksplisit pengguna.

## 6. Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Menetapkan fokus file `.md`, mencatat dokumen yang tersedia, dan mengganti langkah berikutnya dari mockup menjadi perencanaan arsitektur serta dokumen teknis pendamping. |
| 0.2 | 23 September 2026 | Menambahkan arsitektur v0.1 sebagai draft tersedia dan menetapkan keamanan/operasional sebagai dokumen berikutnya; tidak mengubah fase menjadi implementasi. |
| 0.3 | 23 September 2026 | Menyelesaikan lima dokumen tersisa, termasuk Implementation Plan dengan 62 kartu; seluruh paket tersedia untuk review, fase tetap Markdown dan semua pekerjaan aplikasi belum dimulai. |
| 0.4 | 23 September 2026 | Audit kemudahan UX: menambah UX_AUDIT.md, K-38/D-26/D-27, UX/UI v0.3, alur v0.2, UT-44–UT-49, dan IMP-006 fondasi UI (rencana menjadi 63 kartu). Fase tetap Markdown. |
| 0.5 | 23 September 2026 | Atas permintaan pengguna, menambah mockup HTML/CSS lima layar penting di `mockups/` beserta token, kontrak komponen dan tes format/istilah. Implementasi aplikasi tetap belum dimulai. |
| 0.6 | 23 September 2026 | Pengguna menilai desain mockup kurang bagus. Menambah `BRIEF_MOCKUP.md` agar pengguna mengarahkan desain sendiri di Google AI Studio; isi dan aturan halaman tetap mengikuti dokumen sumber. |
| 0.7 | 23 September 2026 | Pengguna menyerahkan mockup Google Stitch dan `DESIGN.md` sebagai desain final (K-39). Menambah `design/` dan FRONTEND_DESIGN_SPEC.md; menyelaraskan PRD v0.6, UX/UI v0.4, alur v0.3, model data v0.2, API v0.4, rencana tes v0.3, dan Implementation Plan v0.3. Implementasi belum dimulai. |
| 0.8 | 23 September 2026 | Penyelarasan desain final di semua dokumen (PRD, UX/UI, alur, audit, arsitektur, keamanan, model data, API, tes, Implementation Plan) dan alat pemeriksa tampilan di `design/tools/` dengan acuan terkoreksi. Resep fondasi terbukti lulus 20/20 screenshot. |
