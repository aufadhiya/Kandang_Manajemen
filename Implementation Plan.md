# Implementation Plan — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.2 — panduan implementasi R1 terurai untuk AI agent |
| Tanggal | 23 September 2026 |
| Nama file kanonis | `Implementation Plan.md`, sesuai permintaan pengguna; jangan membuat salinan `IMPLEMENTATION_PLAN.md` yang isinya berbeda |
| Status | Rencana tertulis lengkap untuk ditinjau; **seluruh tugas implementasi belum dikerjakan** |
| Izin saat ini | **PERENCANAAN MARKDOWN SAJA.** Permintaan menyelesaikan dokumen ini bukan izin menjalankan tugas pembangunan |
| Cakupan | R1 menurut PRD; R2/fitur masa depan hanya batas perluasan, bukan pekerjaan tersembunyi |
| Sasaran pembaca | Agent implementer yang membutuhkan instruksi kecil, eksplisit, dapat diperiksa, dan tidak bergantung ingatan percakapan |
| Kebenaran bisnis | [PRD v0.5](PRD.md); label/layar/alur mengikuti [UX/UI](UX_UI_SPEC.md) dan [alur tertulis](UX_FLOWS_WIREFRAMES.md) |
| Fondasi teknis | [Arsitektur](ARCHITECTURE.md), [keamanan/operasional](SECURITY_OPERATIONS.md), [model data](DATA_MODEL.md), [kontrak API/sync](API_SYNC_SPEC.md), [rencana tes](TEST_PLAN.md) |
| Batas bukti | Tidak ada kode aplikasi, migrasi, deployment, benchmark, UAT atau uji restore yang dinyatakan selesai dari dokumen ini |

## Daftar isi

1. [Kontrak kerja agent: baca dahulu](#imp01)
2. [Keputusan, izin, dan kondisi berhenti](#imp02)
3. [Aturan bisnis yang tidak boleh disederhanakan](#imp03)
4. [Struktur hasil kerja dan perintah verifikasi](#imp04)
5. [Prosedur satu tugas dari awal sampai selesai](#imp05)
6. [Milestone, urutan, dan dependensi](#imp06)
7. [Fondasi dan akses — tugas 001–013](#imp07)
8. [Kandang, recording, dan penyimpanan lokal — tugas 014–023](#imp08)
9. [Kas dan pembelian — tugas 024–035](#imp09)
10. [Tenaga kerja, hasil, dan penutupan — tugas 036–045](#imp10)
11. [Laporan dan ketahanan sistem — tugas 046–053](#imp11)
12. [Verifikasi, pilot, dan handoff — tugas 054–063](#imp12)
13. [Pemetaan layar, alur, dan tes](#imp13)
14. [Definition of Done dan bukti wajib](#imp14)
15. [Template penugasan dan laporan agent](#imp15)
16. [Risiko, perubahan scope, dan pemeliharaan rencana](#imp16)
17. [Status penyelesaian dokumen dan riwayat](#imp17)

<a id="imp01"></a>
## 1. Kontrak kerja agent: baca dahulu

**Jangan mulai coding dari dokumen ini sebelum pengguna secara eksplisit meminta implementasi.** Saat izin itu diberikan, kerjakan satu kartu tugas yang sudah siap; jangan menafsirkan kata “lanjut” di fase perencanaan sebagai izin otomatis membangun atau memakai data pelanggan.

### 1.1 Sumber kebenaran dan urutan baca

1. Baca `AGENTS.md` dan aturan direktori yang akan diubah; baca status fase pada [PLANNING.md](PLANNING.md).
2. Baca PRD bagian 3–6, 9, 22, 29.2 dan 31.1 sekali sebelum tugas pertama; untuk setiap tugas baca lagi aturan/AC/GOLD yang dirujuk kartu, bukan hanya judulnya.
3. Baca bagian terkait model data, keamanan, API/sync dan rencana tes. Untuk UI, baca V/UT dan FL/WF terkait beserta skill UI/UX yang diwajibkan repositori.
4. Baca kode/test/migrasi yang **benar-benar sudah ada** sebelum membuat file baru. Dokumen ini bukan bukti suatu endpoint, direktori, package atau command sudah tersedia.
5. Keputusan pengguna terkonfirmasi di register K tidak boleh ditimpa pilihan library. Usulan D/AT/kebijakan teknis baru tetap usulan sampai ditinjau. Jika dua dokumen bertentangan, catat sumber dan hentikan bagian terdampak; jangan memilih aturan yang paling mudah dikodekan.

### 1.2 Satuan pekerjaan

- **Satu kartu IMP = satu tujuan yang dapat dibuktikan**, bukan izin merombak seluruh modul. Kerjakan sesuai dependensi. Pecah kartu besar menjadi subpekerjaan berurutan di laporan tugas tanpa mengubah makna atau menghilangkan tes kartu induk.
- Batas perubahan default: file yang dibutuhkan kartu, tes terkait, migrasi terkait, dan catatan keputusan/perilaku. Perubahan lintas modul harus dijelaskan sebelum dikerjakan; tidak ada refactor, upgrade atau desain ulang yang tidak diperlukan.
- Paralelisasi hanya bila file dan invariant tidak saling berubah. Auth, transaksi/receipt, model uang, migrasi, versi protokol dan schema lokal memiliki satu penanggung jawab integrasi; jangan dua agent mengedit file yang sama.
- Setelah satu tugas selesai, laporkan bukti dan status dependensi. Tidak otomatis melompat ke tugas besar berikutnya ketika konteks mulai tidak cukup. Handoff tertulis lebih baik daripada menebak.
- Label “selesai” hanya setelah diff ditinjau dan verifikasi relevan dijalankan. Kompilasi berhasil bukan bukti uang benar; screenshot bukan bukti akses aman; keberhasilan generator bukan bukti UX layak.

### 1.3 Jenis perubahan yang dilarang tanpa persetujuan baru

Tidak mengubah aturan finansial, mengaktifkan R2, memilih provider berbayar, membuka akses publik, memakai data pelanggan, menghapus data/antrean, mengurangi pengujian, memasang dependency tak terkait, atau mengubah status produksi sendiri. Jangan menjanjikan data tidak pernah hilang, pengiriman background pasti berhasil, atau keamanan setara aplikasi native yang belum diuji.

<a id="imp02"></a>
## 2. Keputusan, izin, dan kondisi berhenti

### 2.1 Bedakan empat izin

| Gerbang | Apa yang dibolehkan setelah sah | Bukti yang harus ada | Keadaan saat dokumen ditulis |
|---|---|---|---|
| Izin perubahan fase | Mulai pembangunan sesuai kartu, bukan produksi | Permintaan eksplisit pengguna; scope yang diminta dicatat | Belum diberikan; hanya dokumen `.md` |
| Pembekuan keputusan teknis yang diperlukan | Memilih dependensi, struktur proyek, kontrak versi dan mekanisme keamanan untuk irisan tugas | ADR tertulis, keputusan/reviewer, versi serta alternatif/risiko; bukan hasil rekomendasi otomatis | AT dan rincian keamanan masih usulan |
| Kesiapan teknis prapilot | Menilai build/release candidate menggunakan data sintetis | Bukti tes domain/DB/API/UI/offline/security/restore/performance sesuai gate; runbook dan operator siap | Belum diuji |
| Izin pilot finansial | Memakai data/uang nyata untuk scope terbatas yang disetujui | Owner/penanggung jawab menyetujui lingkup, dukungan, backup, batas, dan keputusan Q yang memblokir | Belum diberikan |

Persetujuan satu gerbang tidak meluluskan gerbang lain. Keberhasilan pilot satu periode baru menghasilkan bukti adopsi/usaha; jangan menyebut seluruh AC-86 lulus sebelum pengukuran lapangan yang diperlukan tersedia.

### 2.2 Daftar keputusan yang harus diturunkan sebelum tugas terkait

| Sumber keputusan | Yang perlu dicatat secara spesifik | Pemilik keputusan | Batas penghentian |
|---|---|---|---|
| AT-01–AT-03, D-19, Q-10 | Framework/runtime/database/library inti, versi kompatibel, package manager, format decimal, lisensi dan metode tes transaksi nyata | Penanggung jawab teknis; persetujuan biaya oleh pengguna | Jangan scaffold stack baru sebelum pilihan ditinjau |
| AT-04, SEC-01–SEC-05 | Enforcement scope, constraint relasi, role runtime/RLS bila dipilih, capability dan field whitelist | Penanggung jawab keamanan/teknis | Jangan menganggap tenant request atau filter UI sebagai grant |
| Q-02, Q-10, AT-09 | Namespace akun, hashing standar, parameter sesi/reauth/MFA, reset sekali pakai, bukti recovery/transfer Owner, saluran privat dan penanggung jawab bantuan | Pemilik produk + keamanan | Blok aktivasi akun produksi tanpa prosedur; jangan menambah email wajib |
| Q-03 | Penyelesaian klaim tidak jelas/Owner tidak tersedia; kemampuan review harian | Pemilik produk/Owner pilot | Default Owner-only online; jangan menyimpulkan delegasi/auto-post |
| Q-04 | Contoh pembelian barang/jasa/peralatan, alokasi di luar periode, pengakuan biaya aset yang diperlukan | Pemilik produk/Owner pilot | Klasifikasi belum jelas tetap pending; tidak semua pembelian menjadi biaya periode |
| Q-06, AT-05 | HP/browser sasaran, local unlock dan kehilangan kunci, lease akhir, payload lama, logout/reset/retention lokal | Produk + keamanan/teknis | Blok offline pilot tanpa pengujian; 72 jam hanya usulan |
| Q-08 | Contoh komponen RHPP/tabungan/utang/coverage untuk pilot | Owner pilot + penanggung jawab bisnis | Boleh payout-only; jangan label laba lengkap atau lock sebelum klasifikasi cukup |
| Q-09 | Kasus pekerja berhenti/hak gaji belum final/penagihan sisa | Owner pilot + penanggung jawab bisnis | Jangan membuat plafon kasbon berdasarkan gaji atau potongan otomatis |
| Q-10–Q-11, AT-06–AT-08 | Hosting/anggaran, file limits/retensi, backup/PITR, bukti grant tahan restore, akses operator, dukungan/penghapusan | Produk + keamanan/operasi | Blok data finansial produksi; default tidak purge posted finance |
| Q-01 | Peserta/kandang/tanggal/cutoff pilot, baseline, cara sampel independen dan kriteria keputusan lanjut | Pemilik produk/Owner pilot | Jangan membuat jadwal atau klaim adopsi tanpa data nyata |

Q-05/Q-07 hanya memblokir fitur/metrik yang bergantung keputusan tersebut, bukan seluruh operasi R1. Q-12 sudah ditutup. Jangan meminta pengguna mengonfirmasi kembali DAILY global, multi-ABK, kasbon fleksibel, tanpa email, bukti opsional atau tanpa tracking pemakaian.

### 2.3 Status tugas dan aturan berhenti

Semua kartu dimulai **NOT_STARTED**. Status yang boleh: READY setelah dependensi+batas keputusan terpenuhi; IN_PROGRESS; BLOCKED_POLICY; BLOCKED_TECHNICAL; NEEDS_REVIEW; DONE. FAILED berarti verifikasi yang dijalankan gagal, bukan alasan untuk menghapus tes. Laporan pengujian tetap memakai status eksekusi di TEST_PLAN; status tugas bukan hasil tes.

Agent **harus berhenti pada bagian terdampak** apabila:

1. Izin fase atau dependensi belum terpenuhi; tidak meloncati prasyarat dengan data dummy produksi.
2. Nominal/sumber dana/klasifikasi/scope tidak dapat ditentukan dari sumber; simpan ketidakpastian, jangan nol/personal payer otomatis.
3. Tidak tahu apakah command sebelumnya committed; pertahankan ID dan lakukan status/reconciliation, bukan membuat transaksi baru.
4. Migrasi berisiko menghapus receipt, histori, file, atau antrean; minta review dan rencana pemulihan.
5. Ada dugaan bocor data atau efek uang ganda; hentikan jalur posting terdampak, jangan lanjut menambah fitur di atas kerusakan.
6. Hanya punya mock unit untuk klaim yang membutuhkan database/perangkat/restore nyata; tandai BLOCKED, bukan PASS.
7. Perintah yang tercantum dalam pemetaan runtime tidak ada atau versinya berbeda; periksa manifest/dokumentasi versi terkait, jangan mengarang command/sukses.

Bagian lain yang tidak bergantung blocker boleh dilanjutkan dalam tugas yang diizinkan dengan batas yang jelas. Tidak perlu menghentikan semua dokumen karena vendor belum dipilih.

<a id="imp03"></a>
## 3. Aturan bisnis yang tidak boleh disederhanakan

| Invariant | Implementasi yang benar | Jalan pintas yang dilarang | Sumber |
|---|---|---|---|
| Scope | Setiap sumber/line/effect/file/query/job mempunyai scope sah dan actor server | Menerima tenant/actor dari payload sebagai bukti hak | SEC-01–SEC-05, MOD-01, MOD-06 |
| DAILY | Satu rekap efektif cycle+date, author/revision, valid langsung berlaku | Per ABK/per bangunan wajib, approval Owner, sum revisi, last-write-wins | K-25–K-26, MOD-07, OFF-18 |
| Pembelian R1 | Barang/jasa umum; habis pakai diterima+disahkan menjadi biaya, peralatan diklasifikasi | Daftar hanya gas/solar, menunggu consumption atau ledger stok wajib | CASH-16, COST-01, INV-17, GOLD-30 |
| Belanja Owner | Dapat simpan+approve+post online dalam satu command sah | Antrean persetujuan diri sendiri atau bypass validasi uang | FIN-01–FIN-03, UT-18 |
| Belanja ABK | Klaim dahulu, Owner memeriksa; tanpa nota tetap boleh jika data inti valid | Auto-post nominal kecil, nota/alasan ketiadaan wajib, reject memulihkan kas | FIN-10–FIN-13, K-34 |
| Kas versus biaya | Transfer bukan biaya, pelunasan bukan biaya kedua; claim pending terpisah | Menjumlah semua cash out sebagai biaya/laba | CASH-01–CASH-15, COST-01–COST-11 |
| Dana Owner | Modal bukan income, prive bukan biaya; pinjaman kas/talangan membentuk kewajiban sisi usaha | Memerlukan buku pribadi R2 atau menjadikan rekening pribadi kas usaha fiktif | CASH-15, GOLD-13, GOLD-25 |
| Gaji/kasbon/upah | Hak gaji, piutang kasbon, kompensasi pekerjaan dan payment terpisah | Kasbon wajib agreement/plafon gaji, auto-offset, sisa diputihkan saat periode ganti, upah digabung slip | PAY-01–PAY-15 |
| Hasil aktual | Notice ≠ uang masuk; payout-only sah sebagai kas belum dipadankan jika hak belum diketahui | Memverifikasi total hak/laba hanya dari transfer; matching membuat kas kedua | SET-11, COST-11, GOLD-20 |
| Penutupan | Fisik terpisah finansial; utang final belum dibayar boleh tetap ada; perubahan nilai butuh reopen | Lock karena kosong saja, lock payout-only, larang bayar kewajiban sah setelah lock | CYC-05–CYC-11 |
| Uang | IDR bulat, arithmetic tepat, rounding pengakuan+distribusi residu alokasi | Binary float, truncation persen, alokasi tiap baris tanpa menjaga total | DATA-05–DATA-07, COST-05 |
| Retry | ID/hash/receipt durable; efek/audit/receipt satu transaksi; key sama beda payload ditolak | ID baru saat timeout/403, receipt TTL singkat, processing dicommit sendirian | FIN-05, FIN-12 |
| Offline | Simpan atomik di HP dahulu; status local/server/review/post/pay terpisah | Memory-only, tanda berhasil sebelum commit, background-only | OFF-01–OFF-18 |
| Capture-only | Registrasi asal immutable, tanpa cache bisnis, konversi sekali ke tenant asal saat berizin | Memperpanjang lease, mode setelah logout, rehome catatan ke usaha lain | OFF-17 |
| Restore | Epoch baru, sesi/grant direverifikasi, unknown pra-restore ditahan, correction menutup replay ID lama | Menganggap receipt hilang berarti belum pernah terjadi; restore menghidupkan grant dicabut | NFR-11, GOLD-27 |
| Rilis | R1 tidak memerlukan stok/kontrak/pribadi/PPL/task/APK | Placeholder FK/menu R2, row dummy, service kosong sebagai dependensi | PRD §4, §25.1, AC-84 |
| Kemudahan | Komponen IMP-006 dan glosarium dipakai di semua layar; saran berasal dari data nyata; input singkat di lembar; detail di baris buka-tutup; keypad angka dengan jalan keluar keyboard HP | Mengisi nominal/kuantitas/sumber dari kebiasaan, bukukan dengan geser, pop-up tur, istilah teknis di layar, membuat varian komponen sendiri per layar | K-38, D-26, D-27, UX-17–UX-20 |

Ini ringkasan pengingat, bukan pengganti membaca rumus, batas dan contoh lengkap di PRD. Jika ada cabang yang belum jelas, tambahkan pertanyaan bertaut sumber, bukan “aturan default” buatan agent.

<a id="imp04"></a>
## 4. Struktur hasil kerja dan perintah verifikasi

### 4.1 Peta area perubahan

Belum ada struktur aplikasi yang dipilih. Saat IMP-003, ikat **area logis** berikut ke path nyata satu kali dalam catatan implementasi yang ditinjau. Semua kartu sesudahnya menggunakan peta tersebut. Jangan membuat dua frontend/backend karena agent berbeda memakai contoh nama direktori berbeda.

| Area | Isi yang diizinkan | Aturan pemisahan |
|---|---|---|
| CORE | Angka/tanggal/ID, validasi dan aturan domain murni | Tidak mengakses UI/network/storage; preview client tidak authoritative |
| IDENTITY | Tenant, akun, sesi, grant, recovery dan kebijakan akses | Secret tidak menjadi data tampilan/export; actor berasal sesi |
| OPERATIONS | Kandang/tim/periode/penerimaan/recording | Tidak membukukan biaya dari DAILY/pakan informasional |
| FINANCE | Pembelian/claims, kas/effects/obligations/applications, gaji/kasbon/upah, settlement | Aturan efek berada server; satu transaksi untuk sumber dan semua efek |
| API | Command/query, schema runtime, field projections, error mapping dan versioning | Handler memanggil domain; tidak menghitung ledger kedua sendiri |
| DATA | Migrations, constraints, repositories, transaksi, indexes, fixture sintetis | Migration data dan schema dipisah tujuan; no destructive reset untuk memperbaiki tes |
| WEB | Shell, routing, komponen IMP-006, kamus teks layar, form, label/status, layar V, accessibility | Tidak menyimpan rahasia server atau membuktikan izin lewat hide menu; tidak membuat komponen/label baru di luar IMP-006 tanpa memperbarui katalog dan glosarium |
| LOCAL | Adapter IndexedDB/setara, cache partition, draft/outbox, lease/key/migration | Tidak mengubah sumber dana/tenant atau nominal ketika retry |
| WORKER | Job/outbox, export, inbox, pemeriksaan file | Dedupe, scope, retry bounded; tidak akses bebas data tenant |
| OPS | Konfigurasi lingkungan, secret references, monitoring, backup/restore/release runbook | Tidak berisi secret nyata; environment produksi membutuhkan approval |
| TESTS | Unit/contract/DB integration/E2E/security/performance/recovery/UAT evidence | Oracle dari dokumen; fixture pelanggan dilarang |

### 4.2 Peta perintah wajib sebelum tugas fitur

Pada IMP-003, tulis perintah **yang benar-benar tersedia** untuk: instalasi reproducible dari lockfile; format/lint; typecheck bila relevan; unit; integrasi dengan database nyata; migration apply/compatibility; build; start test API/worker/web; E2E; checks keamanan/dependency; benchmark; backup/restore drill sandbox. Sebut direktori kerja, env names tanpa nilai, versi layanan, cara menyediakan DB serta exit code/artefak.

Tidak ada perintah fiktif seperti “jalankan npm test” bila package/skrip belum dibuat. Jika lingkungan tidak menyediakan DB yang dibutuhkan, pasang melalui jalur sah/proyek atau laporkan blocker; jangan mengganti dengan database in-memory agar hijau. Jangan memilih Docker wajib tanpa memeriksa ketersediaan dan keputusan setup. Tidak perlu cloud produksi untuk menjalankan unit/tes domain.

### 4.3 Kebijakan dependensi dan kode

Gunakan dependency yang sudah dipilih/dipasang dengan versi kompatibel. Penambahan library perlu tujuan, alternatif yang sudah tersedia, lisensi, keamanan dan test; jangan menambahkan library hanya demi satu ikon/animasi. Komentar singkat menjelaskan invariant, bukan menutupi kode yang belum selesai. Jangan meninggalkan fungsi sukses palsu, catch kosong, nilai hardcode pelanggan/PT, atau TODO sebagai pengganti requirement wajib.

<a id="imp05"></a>
## 5. Prosedur satu tugas dari awal sampai selesai

1. **Buka kartu.** Catat IMP, tujuan, dependensi dan izin fase. Periksa bukti DONE dependensi, bukan sekadar status checkbox.
2. **Baca sumber.** Ambil aturan, AC/GOLD/UT dan kontrak aktual. Tuliskan dalam laporan invariant yang dipengaruhi serta yang tidak boleh berubah.
3. **Periksa baseline.** Status git, diff pengguna/agent lain, manifest dan tes terkait. Jangan menimpa pekerjaan yang belum dipahami. Catat kegagalan yang sudah ada dan investigasi penyebabnya.
4. **Tentukan batas file.** Gunakan peta area/path IMP-003. Daftar file/migrasi/tes yang diperkirakan; perubahan di luar daftar perlu alasan.
5. **Buat pembukti gagal terlebih dahulu bila memungkinkan.** Kasus normal + invalid + unauthorized + duplicate/stale sesuai kartu. Untuk bug, reproduksi kondisi sebelum perbaikan. Unit test tidak menggantikan tes integrasi DB.
6. **Bangun irisan kecil.** Model/constraint → domain transaksi → kontrak server → form/status → sync jika diizinkan → tes ujung-ke-ujung. Bila kartu hanya fondasi, jangan menambah menu fitur lain.
7. **Jalankan verifikasi.** Tes terarah, regressions modul, format/type/build, migrasi terkait dan tes nyata yang diwajibkan. Tampilkan perintah/exit code/hasil; jangan hanya “all good”.
8. **Review diff.** Cek otorisasi server/field, relasi scope, decimal, status, null, konflik, receipt, audit, rollback, local queue, file privacy, dependensi R2 dan referensi dokumen.
9. **Review independen.** Untuk uang/akses/sync/migrasi/restore, minta reviewer terpisah atau putaran review read-only dengan konteks baru. Jika tidak tersedia, catat NEEDS_REVIEW; tidak menyatakan review dilakukan.
10. **Simpan hasil/handoff.** Taut commit/diff jika dibuat lewat izin source-control, bukti tes, batas belum diverifikasi, keputusan dan tugas berikut yang siap. Jangan commit secret/artefak pelanggan. Selesai tugas bukan izin deploy.

Jika tes gagal, perbaiki akar penyebab atau laporkan blocker. Dilarang menghapus assertion, mengubah golden agar cocok kode, skip tes keamanan, menaikkan timeout tanpa diagnosis, atau menonaktifkan lint/typecheck supaya build tampak lulus. Perubahan oracle hanya sah bila kebutuhan berubah dengan persetujuan dan jejak dokumen.

<a id="imp06"></a>
## 6. Milestone, urutan, dan dependensi

| Tahap rencana | Kartu | Hasil yang harus dapat dibuktikan | Batas keluar |
|---|---|---|---|
| M0 persiapan eksekusi | IMP-001–IMP-004 | Izin, keputusan blocking, peta proyek/perintah dan kerangka tes sintetis | Tidak ada stack/aturan uang yang dipilih diam-diam |
| M1 fondasi dan operasional | IMP-005–IMP-023 | Angka, fondasi UI/bahasa, isolasi, akun/tim, periode, DAILY, local queue, lease/capture dan file | Alur sebelum DOC dan recording bersama tanpa approval/stock |
| M2 kas/pembelian | IMP-024–IMP-035 | Efek keuangan, claims, transfer, pembelian, pembayaran, koreksi, alokasi dan dana Owner | GOLD finansial terkait tepat; tidak ada posting offline atau biaya ganda |
| M3 tenaga kerja | IMP-036–IMP-040 | Kasbon mandiri, gaji, potongan pilihan, upah dan opening | Hak/piutang/kas terpisah per orang dan lintas periode |
| M4 hasil dan kepercayaan data | IMP-041–IMP-053 | Settlement/payout, penutupan, laporan/ekspor, versioning/jobs, backup/restore | Tidak mengklaim laba/lock/restore lengkap dari data parsial |
| M5 pembuktian teknis | IMP-054–IMP-060 | Concurrency, keamanan, UI/accessibility, kapasitas, drill, UAT sintetis/baseline dan audit prapilot | Semua syarat teknis yang berlaku lulus dengan bukti; tidak ada izin produksi otomatis |
| Pilot dan penerimaan | IMP-061–IMP-063 | Izin eksplisit scope nyata, pengamatan satu siklus dan handoff operasional | Bukti lapangan terpisah dari gate teknis; sisa risiko dan keputusan lanjut jelas |

Urutan ini memperinci milestone PRD, bukan mengubah gate. Default eksekusi menaik menurut nomor; kolom dependensi menentukan prasyarat minimal, tetapi izin untuk paralel tetap mengikuti §1.2. **Semua dependensi menunjuk nomor lebih kecil.** Tugas yang menyentuh beberapa periode/akun harus diuji sebagai transaksi lintas objek, bukan dipecah menjadi dua posting parsial.

Setiap kartu mewarisi prosedur §5 dan Definition of Done §14. Field **Uji** adalah minimum khusus kartu, bukan daftar semua tes yang boleh dijalankan. Field **Berhenti** menambah kondisi global §2.3. Status awal setiap kartu: NOT_STARTED.

<a id="imp07"></a>
## 7. Fondasi dan akses — tugas 001–013

<a id="imp-001"></a>
### IMP-001 — Konfirmasi izin fase dan inventaris repositori

- **Dependensi:** tidak ada. **Area:** dokumen/status kerja saja sampai izin ada.
- **Baca:** AGENTS, PLANNING, PRD §1/3/4/29.2/31, rencana ini §1–6.
- **Kerjakan:** catat permintaan eksplisit implementasi, scope rilis, branch/status/diff yang sudah ada, semua panduan direktori, runtime/tool yang tersedia dan dokumen versi sumber. Jangan menjalankan instalasi aplikasi dari metadata kandidat.
- **Hasil:** catatan izin + baseline + daftar blocker; semua kartu lain tetap NOT_STARTED. Perubahan pengguna yang sudah ada tidak ikut dihapus/dianggap milik tugas ini.
- **Uji:** inspeksi bahwa file aplikasi/manifest benar-benar ada atau belum; daftar keputusan terbuka berasal Q/AT, bukan pertanyaan ulang K yang sudah diputuskan.
- **Berhenti:** selama hanya diminta dokumen perencanaan. Menyelesaikan kartu pada fase ini berarti mencatat BLOCKED_POLICY, bukan membuat scaffold.

<a id="imp-002"></a>
### IMP-002 — Bekukan keputusan minimum untuk irisan pertama

- **Dependensi:** IMP-001 dan izin pembangunan. **Area:** ADR/catatan keputusan.
- **Baca:** ARCHITECTURE §12/15; SECURITY_OPERATIONS; PRD D-19/D-25, Q-02/Q-06/Q-10/Q-11.
- **Kerjakan:** bandingkan kandidat stack dari kebutuhan transaksi/local store/worker, bukan tren; pilih versi kompatibel, model sesi, scope/role DB, decimal, local unlock dan strategi recovery bersama reviewer berwenang. Rekam usulan/diterima/ditolak, alasan, pemilik, tanggal dan tugas terdampak.
- **Hasil:** ADR cukup spesifik untuk scaffold dan fondasi keamanan; kebijakan biaya/pilot/retensi yang belum diputuskan tetap terbuka dengan gate tersendiri.
- **Uji:** setiap teknologi/parameter wajib mempunyai alasan dan sumber versi; tidak ada keputusan bisnis baru, no email wajib, no provider subscription tanpa izin.
- **Berhenti:** pilihan memengaruhi keamanan atau data tapi tidak dapat diuji/dijelaskan; jangan menyalin angka kebijakan usulan sebagai persetujuan pengguna.

<a id="imp-003"></a>
### IMP-003 — Scaffold minimal, peta path, dan command reproducible

- **Dependensi:** IMP-002. **Area:** struktur proyek, manifests/lockfile, konfigurasi test/build, OPS.
- **Baca:** ARC-01–ARC-06, NFR-08, rencana §4.
- **Kerjakan:** buat satu web client, satu backend modular dan entry worker sesuai ADR; tetapkan path nyata per area, environment schema dengan nama variabel tanpa secret, pemisahan test/development/production. Buat command build/test yang memang bekerja dan documentasikan direktori+versinya.
- **Hasil:** kerangka bisa start/stop/build dengan health readiness yang membedakan proses hidup dan dependency siap; tidak berisi dashboard angka palsu atau akun password default produksi.
- **Uji:** fresh install dari lockfile; build; start API/web/worker sandbox; konfigurasi wajib kosong gagal aman; restart tidak memerlukan file bisnis lokal server.
- **Berhenti:** framework/versi belum diputuskan, tool/DB tidak tersedia, command gagal; jangan tambahkan microservices, Redis atau auth vendor otomatis.

<a id="imp-004"></a>
### IMP-004 — Kerangka tes, fixtures, dan bukti eksekusi

- **Dependensi:** IMP-003. **Area:** TESTS + OPS test.
- **Baca:** TEST_PLAN seluruh daftar suite/fixtures/status; PRD §28/29.
- **Kerjakan:** sediakan unit runner, integration DB nyata terisolasi, API/E2E harness dan laporan hasil. Buat clock/ID seed deterministik, fixture tenant A/B dan Owner/ABK sintetis sesuai skema yang bertambah; tidak memakai data pelanggan. Pisahkan test database dari produksi secara fail-closed.
- **Hasil:** satu tes sengaja gagal membuktikan pipeline mendeteksi gagal, lalu hapus hanya tes demonstrasi setelah hasil tercatat; tes bisnis tetap ditambah per kartu.
- **Uji:** teardown hanya fixture scope test; parallel tests tidak memakai state bersama diam-diam; hasil mempunyai versi/command/exit code dan tidak dicatat PASS sebelum dijalankan.
- **Berhenti:** runner terhubung host/data produksi atau tidak dapat dibuktikan isolasinya. Jangan mengganti database relasional dengan mock untuk bukti concurrency.

<a id="imp-005"></a>
### IMP-005 — Angka, tanggal, ID dan aturan alokasi murni

- **Dependensi:** IMP-004. **Area:** CORE + unit tests.
- **Baca:** DATA-01–DATA-09, COST-04–COST-05, GOLD-07, AC-17/19/100.
- **Kerjakan:** parser canonical terpisah parser Indonesia; input nominal IDR integer, quantity/rate decimal, null berbeda nol; UTC+zona IANA+business_date; snapshot rate/unit. Implementasikan half-up pada batas pengakuan dan largest-remainder dengan tie order tersimpan, termasuk porsi belum dialokasikan.
- **Hasil:** fungsi deterministik dan tipe/serialisasi tanpa kehilangan integer besar; tidak ada harga/konversi sak 50 kg hardcode.
- **Uji:** Rp1.000.001 dibagi tiga = 333.334/333.334/333.333; Rp2 bobot 26/26/26/22 = 1/1/0/0; alokasi Rp600 dari Rp1.000 menyisakan Rp400; input rupiah pecahan ditolak, persen desimal dipertahankan; boundary/missing/overflow/divide-zero.
- **Berhenti:** muncul selisih rupiah atau double rounding; jangan “perbaiki tampilan” sambil menyimpan float salah.

<a id="imp-006"></a>
### IMP-006 — Fondasi UI: pola di tempat, keypad angka, dan bahasa layar

- **Dependensi:** IMP-003, IMP-004, IMP-005. **Area:** WEB + TESTS; tidak menyentuh aturan uang/server.
- **Baca:** PRD K-38, D-24, D-26, D-27, UX-01–UX-20; UX_UI_SPEC §4–6 dan §15–16 (termasuk §5.3 keypad, §5.4 bantuan pintar, §16.4 pola di tempat, §16.5 glosarium, §16.6 aturan bahasa); UX_FLOWS §3; [UX_AUDIT.md](UX_AUDIT.md); skill UI/UX sesuai AGENTS.md.
- **Kerjakan:** buat satu set komponen yang wajib dipakai semua kartu layar berikutnya: shell responsif dan navigasi per peran; token usulan sebagai variabel (solid sebagai dasar, kaca hanya bingkai); tombol **Catat**; kartu **Saran berikutnya** (judul, alasan, satu aksi, **Nanti**, **Kenapa?**); field berlabel + bantuan + error dekat field + ringkasan error terfokus; **keypad angka** untuk rupiah/kuantitas/ekor dengan `000`, hapus, koma kuantitas, −/+ ekor, ejaan rupiah dari CORE IMP-005, tombol **Keyboard HP**, paste dan keyboard fisik; pilihan tanggal **Hari ini/Kemarin/Pilih**; **lembar** (bawah di HP, samping di layar lebar) dengan penjaga draf, tombol kembali, alamat lembar, satu lembar aktif; **baris buka-tutup** dengan `aria-expanded`; bar aksi lengket di atas keyboard; label status kanonis §15.1; state loading/kosong/error/offline/tanpa izin; pesan singkat dengan **Urungkan** hanya untuk aksi lokal; satu kamus teks layar berisi glosarium §16.5.
- **Hasil:** katalog komponen khusus pengembangan/tes yang hanya memakai data sintetis dan tidak tampil di navigasi produk; panduan pemakaian komponen untuk kartu berikutnya; pemeriksa teks otomatis yang gagal bila istilah terlarang (DRAFT, posting, sync, coverage, review, receipt, epoch, lease, capture-only) muncul pada teks layar. Token tetap usulan (UX-13), bukan brand final.
- **Uji:** ejaan rupiah dan parser (`Rp1.250.000`, `1250000`, paste ambigu); keypad dengan TalkBack/VoiceOver, keyboard fisik, paste, dan password manager pada field login; 320 CSS px, zoom 200%, reduced motion, forced colors; tombol kembali menutup lembar tanpa kehilangan draf; refresh membuka lembar sama; fokus kembali ke pemicu; baris buka-tutup mengumumkan keadaan; keypad tidak menutupi field/error/tombol; tidak ada nominal terisi otomatis; UT-44–UT-46 dan UT-49 pada katalog sebelum layar bisnis dibuat.
- **Berhenti:** keypad gagal diakses pembaca layar pada perangkat uji → jadikan keyboard angka HP sebagai default (D-26) dan laporkan; jangan menambah library UI besar, animasi, atau font daring tanpa alasan tertulis; jangan membuat layar bisnis atau angka contoh yang tampak nyata di produk.

<a id="imp-007"></a>
### IMP-007 — Identitas dan scope database dasar

- **Dependensi:** IMP-004, IMP-005. **Area:** DATA + IDENTITY.
- **Baca:** MOD-01, SEC-01–SEC-05, SEC-15–SEC-16, D-01/D-25, DATA_MODEL bagian identity/scope.
- **Kerjakan:** schema user/credential/tenant/membership/grant/employee serta session/device yang diperlukan; ID stabil, normalized username uniqueness, satu primary owner dan ABK tenant pengelola. Buat juga schema induk `farm`/`building` dengan field wajib model data agar grant/assignment memiliki FK sah sejak awal; layanan/form pengelolaan kandang baru IMP-014. FK/check scope menghalangi child tenant A ke parent B; role runtime sesuai ADR, tidak superuser bypass jika RLS dipilih.
- **Hasil:** migrations versioned dan fixture dua tenant/kandang sintetis menggunakan schema sebenarnya, bukan farm dummy wajib bagi pengguna; akun, pekerja dan assignment dibedakan, tanpa single-ABK-per-farm constraint. Penyimpanan audit append-only untuk perubahan auth juga tersedia; kernel command bisnis di IMP-010 menggunakan penyimpanan audit yang sama.
- **Uji:** AC-01; insert/update lintas scope ditolak di jalur repository/DB yang dipilih; username bentrok serentak satu berhasil tanpa mengungkap pemilik; migrasi fresh dan upgrade test.
- **Berhenti:** ORM hanya memberi filter global tetapi raw query/job bisa bypass scope tanpa guard; jangan menyebut UUID sebagai isolasi.

<a id="imp-008"></a>
### IMP-008 — Fondasi login dan rotasi kredensial tanpa email

- **Dependensi:** IMP-006, IMP-007. **Area:** IDENTITY/API/WEB V-03, V-22; layar memakai komponen IMP-006.
- **Baca:** ONB-01, SEC-06–SEC-08, SEC-13, AC-94, UT-01/02, SECURITY_OPERATIONS akun/sesi.
- **Kerjakan:** gunakan akun/tenant fixture sintetis pada schema IMP-007 untuk login dan rotasi kredensial auth; rahasia sementara, wajib ganti sebelum akses bisnis, hashing standar yang disetujui, rate limit, session rotation/logout/revoke, cookie/CSRF sesuai ADR. Rotasi/session version/audit auth atomik dalam subsistem auth tanpa menyimpan rahasia di receipt bisnis. UI mendukung paste/password manager dan tidak mengembalikan password/hash.
- **Hasil:** fondasi masuk/ganti password diuji end-to-end dengan fixture; MFA Admin dan step-up sesuai gate keamanan. **Belum membuka provisioning bisnis CMD-01 atau aktivasi bisnis CMD-02**: keduanya milik IMP-013 setelah kernel IMP-010 tersedia. Kelulusan AC-94 jalur provisioning penuh dinilai di IMP-013, bukan diklaim dari fixture di sini.
- **Uji:** password salah/expired/reused, session fixation, login rate limit, wrong tenant leakage; akun belum ganti password tidak dapat bisnis/export; pesan tidak membocorkan tenant pemilik username.
- **Berhenti:** recovery diasumsikan lewat email/username saja, secret dicetak log atau auth hanya localStorage flag.

<a id="imp-009"></a>
### IMP-009 — Otorisasi server, proyeksi field dan tenant status

- **Dependensi:** IMP-007, IMP-008. **Area:** IDENTITY/API/DATA.
- **Baca:** SEC-01–SEC-05, MOD-01/MOD-06, PRD §6.2/7.2, AC-01/04/48.
- **Kerjakan:** pusatkan evaluasi user+tenant+scope+aksi+personal ownership+status; controller/query/aggregate/job memakai guard; field whitelist ABK minimum. Uji runtime role/pool context reset; error objek asing tidak mengungkap keberadaan.
- **Hasil:** kebijakan reusable dengan denial tests; READ_ONLY menolak bisnis baru tetapi baca/export berhak tetap tersedia. Receipt status memiliki pengecualian sempit tersendiri, bukan read-all.
- **Uji:** tenant A tahu ID B tetap gagal list/detail/update/file; ABK A tidak melihat nominal B; Admin tidak baca ledger; pooled connection setelah tenant A tidak membawa konteks ke B.
- **Berhenti:** solusi hanya hide menu/filter frontend. Perubahan grant harus terkoordinasi dengan posting, bukan cache izin berumur panjang tanpa invalidation.

<a id="imp-010"></a>
### IMP-010 — Kernel command, audit, receipt, epoch dan outbox

- **Dependensi:** IMP-005, IMP-009. **Area:** CORE/API/DATA/WORKER.
- **Baca:** FIN-01–FIN-12, MOD-04–MOD-05, NFR-11, ARCHITECTURE §6, API_SYNC_SPEC envelope/status.
- **Kerjakan:** command runtime validation, actor server, business payload canonical/hash, uniqueness data_space+command_type+operation_id, expected versions dan epoch gate. Receipt/effects/audit/outbox commit atomik; processing sinkron tidak dicommit sendiri. Jalur status original actor boleh COMMITTED_NO_DETAIL tanpa objek setelah revoke; unknown pra-restore tetap review.
- **Hasil:** mekanisme dipakai semua modul berikutnya; transaksi domain uji sintetis untuk fault injection, bukan tabel uang dummy produksi. Korelasi request/operation tanpa log isi privat.
- **Uji:** AC-63/71; dua request ID sama bersamaan satu effect; hash beda ditolak; crash sebelum commit rollback; commit+response hilang replay; revoked actor minimal ack; aktor lain tidak tahu receipt; stale epoch tidak membuat efek.
- **Berhenti:** receipt TTL singkat, outbox ditulis setelah commit terpisah, processing row menggantung, atau audit mencatat secret.

<a id="imp-011"></a>
### IMP-011 — Tim multi-ABK dan pengelolaan akun ABK

- **Dependensi:** IMP-006, IMP-009, IMP-010. **Area:** IDENTITY/OPERATIONS/API/WEB V-20/V-22; tambah ABK memakai lembar IMP-006.
- **Baca:** SEC-15–SEC-16, ONB-04, D-25, AC-90–AC-93, UT-02/03/32/36.
- **Kerjakan:** tambah pekerja dengan login opsional, buat akun ABK tenant sendiri, ubah username, reset privat sekali pakai/reauth, nonaktifkan akun; assignment per farm+user versioned, beberapa ABK dan beberapa kandang dalam tenant sama. Gunakan schema farm dan fixture sah IMP-007 untuk menguji API/form assignment sampai tuntas; tidak menunggu form pembuatan farm IMP-014. Dalam pemakaian nyata, bila Owner belum membuat farm, akun/pekerja boleh ada tanpa grant, bukan dibuatkan farm rekaan.
- **Hasil:** akun/assignment/orang terpisah, revoke satu anggota tidak menghapus rekan/histori/antrean/saldo. Reset tidak menjadikan Owner actor palsu ABK.
- **Uji:** reset target Owner/Admin/PPL/tenant lain ditolak; sesi lama dicabut; grant duplikat orang sama ditolak, dua ABK berbeda boleh; username berubah author tetap ID asal.
- **Berhenti:** satu akun dipakai bersama, reset memberi akses usaha lain, atau perubahan tim mengganti seluruh daftar diam-diam.

<a id="imp-012"></a>
### IMP-012 — Recovery identitas dan pergantian primary Owner

- **Dependensi:** IMP-008, IMP-010, IMP-011. **Area:** IDENTITY/API/WEB V-22/OPS.
- **Baca:** SEC-13–SEC-14, Q-02/Q-10, AC-81/94, UT-33/34.
- **Kerjakan:** prosedur recovery orang sama, reset ABK, transfer Owner dan dukungan dibedakan; bukti/reauth penerimaan Owner baru, expected ownership/membership version dan satu primary owner atomik. Bukti otorisasi tahan restore mengikuti rancangan keamanan; belum dapat dibuktikan → blok, bukan override Admin.
- **Hasil:** alur bantuan terverifikasi/audit minimal, revokasi sesi dan hak lama, notifikasi kanal sah; tanpa read-all/impersonation. Manual runbook sah bila memang diuji, bukan menu backdoor.
- **Uji:** recovery dan transfer paralel; salah bukti; tidak ada fase dua/tanpa Owner; antrean Owner lama tidak mewarisi grant baru; local-only lost dijelaskan, ledger server tetap ada.
- **Berhenti:** sengketa belum terselesaikan, bukti cukup belum didefinisikan, atau hanya mengetahui username dianggap berwenang.

<a id="imp-013"></a>
### IMP-013 — Provisioning Owner, aktivasi bisnis, limit dan READ_ONLY

- **Dependensi:** IMP-009, IMP-010, IMP-012. **Area:** IDENTITY/API/WEB V-24.
- **Baca:** ONB-01, PRD §7.2, AC-04/05/94, SEC-07/13, REP-19, CMD-01–CMD-03.
- **Kerjakan:** implementasikan provisioning tenant/primary Owner terverifikasi CMD-01 dengan kernel receipt/audit IMP-010; alur privat rahasia awal dan rotasi memakai fondasi IMP-008, lalu CMD-02 mengaktifkan akses bisnis setelah bukti rotasi sah. Aktivasi/nonaktifkan/limit memakai actor/audit, alasan layanan, reauth sensitif dan versi. Limit memblokir penambahan yang memperbesar pelanggaran, tidak menghapus data lama/menutup periode. READ_ONLY diterapkan konsisten pada bisnis/job/sync, dengan pengecualian terotorisasi untuk Admin memulihkan status dan user mengelola sesi/ekspor berhak.
- **Hasil:** provisioning sampai akses bisnis diuji tanpa jalur bootstrap yang melewati idempotensi; panel administratif metadata saja, tanpa billing otomatis atau ekspor bisnis Admin.
- **Uji:** retry provisioning satu tenant/primary owner, expired/reused credential dan aktivasi sebelum rotasi ditolak; AC-94 lengkap. Sisa slot satu dengan dua create paralel hanya satu lolos; menurunkan limit tidak menghapus objek; suspend A tidak memengaruhi B; pending lokal tetap aman; ekspor berhak READ_ONLY masih bisa diminta.
- **Berhenti:** perubahan layanan disamarkan sebagai timeout jaringan atau membuat grant finansial Admin.

<a id="imp08"></a>
## 8. Kandang, recording, dan penyimpanan lokal — tugas 014–023

<a id="imp-014"></a>
### IMP-014 — Master kandang/bangunan dan setup bertahap

- **Dependensi:** IMP-006, IMP-011, IMP-013. **Area:** OPERATIONS/API/WEB V-01/V-04/V-20.
- **Baca:** ONB-01–ONB-04, ONB-10–ONB-11, DATA-01/08, K-31/K-32, AC-95/99, FL-01/03.
- **Kerjakan:** layanan/form kandang, zona waktu, bangunan/kapasitas, mitra/pihak minimum saat dibutuhkan di atas schema IMP-007; arsip master tanpa hapus histori. Hubungkan pengelolaan kandang ke alur assignment multi-ABK yang sudah selesai di IMP-011, jangan membuat implementasi kedua; Owner boleh tanpa tim, gaji, kontrak, barang master lengkap.
- **Hasil:** setup dapat ditunda/dilanjutkan, draft kembali ke pekerjaan asal setelah melengkapi prasyarat; nilai default terlihat, bukan transaksi dummy. Kapasitas bukan DOC aktual. Versi awal **Saran berikutnya** untuk keadaan setup (belum ada kandang, belum ada periode, Persiapan) sudah berjalan: satu saran utama, daftar persiapan dengan hitungan nyata, semua langkah dapat diketuk dalam urutan apa pun, langkah bergantung diberi alasan, dan **Nanti** tidak muncul ulang tanpa kejadian relevan. Tombol **Catat** tetap tersedia.
- **Uji:** Owner tanpa ABK tetap masuk persiapan; ubah nama tidak merusak histori; farm/building tenant beda ditolak; data kosong tidak ditampilkan sebagai saldo nol; UT-04–UT-06 dan UT-47 untuk keadaan setup (urutan bebas, alasan dependensi, Nanti, tanpa pop-up).
- **Berhenti:** wizard memaksa semua master/gaji/RHPP atau berpindah konteks diam-diam.

<a id="imp-015"></a>
### IMP-015 — Periode persiapan, DOC aktual dan mode recording

- **Dependensi:** IMP-010, IMP-014. **Area:** OPERATIONS/DATA/API/WEB V-04/V-05/V-07.
- **Baca:** CYC-01–CYC-06, REC-01/REC-17, DATA-02–DATA-04, AC-06/07/87/89/92, FL-01/02.
- **Kerjakan:** DRAFT/ACTIVE dan status finansial terpisah, tanggal DOC aktual/populasi positif, satu aktif per kandang, alokasi bangunan known+unallocated; OFF default eksplisit dan aktivasi DAILY online berizin dengan cutoff/version. Alokasi unknown tidak diprorata/farm dummy.
- **Hasil:** periode persiapan tersedia sebelum DOC; perubahan mode tidak menghapus recording lama atau mengaktifkan tugas stok. Receipt/audit dan period lock coordination dipakai sejak awal.
- **Uji:** dua aktivasi paralel satu lolos; DOC 6.500 kapasitas 7.000 tetap dua angka; salah tanggal/tenant, override kapasitas beralasan sesuai PRD, mode OFF tidak menerima submit DAILY baru.
- **Berhenti:** tidak tahu tanggal/populasi tetapi agent mengarang agar ACTIVE atau membuat periode per bangunan.

<a id="imp-016"></a>
### IMP-016 — Konteks onboarding tengah siklus dan coverage

- **Dependensi:** IMP-015. **Area:** OPERATIONS/DATA/API/WEB V-04/V-05.
- **Baca:** ONB-10, CYC-03/CYC-11, DATA-07, AC-78, GOLD-24.
- **Kerjakan:** jalur sekunder periode sudah berjalan, tracking_started_at, cutoff dan history_coverage; tandai data sebelum cutoff lengkap/parsial/tidak diketahui. Tetapkan referensi opening untuk kas/kewajiban/payroll yang akan diisi kartu berikut, bukan langsung isi saldo tanpa sumber.
- **Hasil:** batas cakupan melekat pada sumber/laporan; tidak membuat siklus fiktif atau biaya nol agar setup lulus.
- **Uji:** mulai hari ke-18 dengan histori tidak lengkap: operasi baru boleh jika valid, laporan seluruh periode belum final; tanggal tidak diketahui tidak diganti hari ini.
- **Berhenti:** opening dianggap transaksi baru biaya historis tanpa deklarasi coverage, atau memerlukan input semua recording lampau.

<a id="imp-017"></a>
### IMP-017 — Penerimaan Owner DOC/pakan/sapronak informasional

- **Dependensi:** IMP-015, IMP-016. **Area:** OPERATIONS/API/WEB V-07.
- **Baca:** INV-17, K-27, SEC-05, DATA-04/08, AC-19/92, UT-15.
- **Kerjakan:** dokumen penerimaan bertanggal, jenis/jumlah/unit/sumber/revisi; Owner-only mengelola. DOC terhubung aktivasi yang sama, bukan menciptakan populasi dua kali; ABK mendapat proyeksi konteks minimum tanpa harga/invoice/lampiran Owner.
- **Hasil:** riwayat penerimaan, bukan stock movement atau biaya PT kedua. Perubahan unit/master tidak menulis ulang snapshot.
- **Uji:** pakan sak berbeda isi dikonversi eksplisit; retry tidak menggandakan receipt; ABK menebak ID dokumen/file tetap ditolak; kuantitas penerimaan tidak menjadi saldo stok tampilan.
- **Berhenti:** penerimaan memerlukan warehouse/stock pool atau mengurangi biaya karena DAILY pakan.

<a id="imp-018"></a>
### IMP-018 — Storage lokal, partisi cache dan draft tahan restart

- **Dependensi:** IMP-003, IMP-008, IMP-009, IMP-015. **Area:** LOCAL/WEB.
- **Baca:** OFF-01–OFF-04, OFF-10–OFF-14, NFR-04, SECURITY_OPERATIONS local data.
- **Kerjakan:** adapter storage sesuai ADR, schema/version, user+tenant+scope partition; simpan operation ID+payload+origin/expected versions atomik sebelum tanda berhasil. Cache shell tidak memuat respons bisnis user lain. Pantau quota/persistent storage jika didukung.
- **Hasil:** draft/queue dapat direload tanpa jaringan, status local-only jelas, gagal simpan mempertahankan form; registrasi/cache awal tetap online.
- **Uji:** AC-45/48/49; restart saat simpan, quota denied/full, logout/login orang lain, clock skew, perangkat belum pernah login tidak boleh mengklaim offline siap.
- **Berhenti:** localStorage/memori dipakai sebagai antrean uang tanpa transaksi/migrasi/isolasi atau penghapusan otomatis saat logout.

<a id="imp-019"></a>
### IMP-019 — Dispatcher sync, dependensi dan status hasil

- **Dependensi:** IMP-010, IMP-018. **Area:** LOCAL/API/WEB V-19.
- **Baca:** OFF-04–OFF-08/OFF-11/OFF-18, FIN-12, API_SYNC_SPEC, AC-46/47/63/71.
- **Kerjakan:** graph parent sebelum child, operasi ID tetap, bounded backoff, status per operasi, auth/forbidden/conflict/dependency/period-lock/unknown/restore-review dibedakan. Foreground/manual reconnect wajib; background optional. Proses multi-tab/worker tidak mengubah ID atau menciptakan effect ganda.
- **Hasil:** server success, submitted review, posted, paid dan upload file adalah dimensi berbeda; tombstone/resolusi server direkonsiliasi tanpa repost.
- **Uji:** response hilang, 401/403 sesudah commit, parent belum diterima, partial batch, double tab; unknown tidak menerbitkan ID baru; detail receipt tidak bocor setelah revoke.
- **Berhenti:** semua error dianggap retry sementara, background satu-satunya jalan, child membuat saldo negatif agar lolos.

<a id="imp-020"></a>
### IMP-020 — Rekap DAILY dan revisi server

- **Dependensi:** IMP-005, IMP-009, IMP-010, IMP-015. **Area:** OPERATIONS/DATA/API.
- **Baca:** REC-10, REC-13–REC-19, MOD-07, OFF-18, GOLD-28/GOLD-29, AC-87–AC-91.
- **Kerjakan:** unique cycle+business_date, feed/mati/afkir/sampling dan completeness; author/corrector, expected revision termasuk create pertama, mode/cutoff/grant/date checks dalam transaksi. Satu summary efektif dan riwayat revision, tidak sum histori.
- **Hasil:** valid submit langsung efektif tanpa approval, no inventory/cost effects; sampling rata-rata hanya jika jumlah/berat cukup, tanpa FCR/IP palsu.
- **Uji:** dua ABK create/edit dasar sama → satu diterima satu konflik; retry lima kali tetap satu versi; koreksi 100→90 tetap 90; sampling 25 ekor/30 kg = 1,2 kg; unknown bukan nol.
- **Berhenti:** validasi mode/grant hanya di client atau revision ditimpa tanpa author/history.

<a id="imp-021"></a>
### IMP-021 — Recording mobile bersama dan resolusi konflik

- **Dependensi:** IMP-017, IMP-019, IMP-020. **Area:** WEB/LOCAL V-02/V-06/V-19/V-25.
- **Baca:** FL-04, WF-07–WF-10, UT-07–UT-15, UX_UI_SPEC recording.
- **Kerjakan:** form satu kandang/tanggal tanpa bangunan wajib, author/freshness bersama, draft personal; bandingkan versi berhak saat konflik dan minta konfirmasi revisi baru. OFF menghilangkan tugas baru, histori tidak hilang. Identitas/scope draft tidak pindah saat ganti kandang.
- **Hasil:** satu halaman fokus dengan bar aksi lengket; pakan memakai keypad kuantitas + satuan, mati/afkir memakai keypad ekor dan −/+, tanggal **Hari ini/Kemarin**, rata-rata sampling dihitung otomatis; riwayat perubahan dibuka-tutup di halaman yang sama dan koreksi satu nilai boleh lewat lembar. Label status kanonis (Draf/Menunggu Kirim/Tercatat/Catatan Berubah). Tidak ada tombol Owner menyetujui recording biasa, saran stok dari pakan, atau angka kemarin yang terisi otomatis.
- **Uji:** dua browser dua ABK offline lalu reconnect; conflicting 100/90 tidak jadi 190; revoke A tidak menghilangkan B; error dekat field; nilai kosong/0/sampling tidak diisi otomatis; angka tidak biasa hanya memberi peringatan setelah diisi; UT-44/UT-48 bagian recording.
- **Berhenti:** API mengirim field keuangan rekan atau UI memperlakukan response 2xx sebagai bukti pembayaran.

<a id="imp-022"></a>
### IMP-022 — Lease, logout dan capture-only aman

- **Dependensi:** IMP-012, IMP-018, IMP-019, IMP-021. **Area:** IDENTITY/LOCAL/API/WEB V-19/V-22.
- **Baca:** OFF-09/OFF-10/OFF-17, SEC-13/SEC-16, Q-06, AC-77, UT-03/29–UT-34/43.
- **Kerjakan:** expiry mengunci cache bisnis/command baru tanpa membuang antrean; local unlock sesuai threat model, capture field minimum saja tanpa autocomplete bisnis. Origin tenant/author/device/note immutable dari registrasi server; satu konversi ke tenant asal setelah reauth+grant+konfirmasi. Logout menonaktifkan capture-only; recovery keys gagal tidak fallback plaintext.
- **Hasil:** pilihan keluar dengan antrean terkunci, bukan purge; reset/revoke offline dibatasi lease dan risiko fisik dijelaskan, tidak dijanjikan remote wipe.
- **Uji:** lease 72 jam default uji, restart/clock rollback, quota/key loss, user lain, registration berubah, grant asal hilang, rehome ditolak, double conversion satu dokumen; tujuh hari queue bukan tujuh hari izin.
- **Berhenti:** local unlock/kehilangan kunci belum disetujui atau data pribadi dapat terbaca akun berikutnya.

<a id="imp-023"></a>
### IMP-023 — Lampiran privat dan upload terpisah

- **Dependensi:** IMP-009, IMP-010, IMP-018, IMP-019. **Area:** API/LOCAL/WORKER/WEB/file storage.
- **Baca:** OFF-15, MOD-06, SEC-09–SEC-12, AC-50/97, UT-17/20.
- **Kerjakan:** metadata dahulu, file local/pending/uploaded/failed/missing terpisah; izin upload parent/actor, tipe/isi/ukuran, nama aman/EXIF, pemeriksaan sebelum tayang, short access links/gateway sesuai kebijakan. DB/storage beda transaksi, rekonsiliasi hash/version dan orphan aman.
- **Hasil:** retry file tidak mengulang dokumen uang; bukti opsional tanpa alasan wajib, draft attachment hanya pembuat berhak sampai linkage; tidak ada public bucket/URL permanen.
- **Uji:** teks sukses foto gagal lalu retry satu dokumen; file tipe palsu/terlalu besar/infected test fixture; parent tenant lain/ABK rekan ditolak; file belum lolos pemeriksaan tidak aktif ditayangkan.
- **Berhenti:** policy file/retensi belum jelas untuk produksi atau foto menjadi syarat approval tersembunyi.

<a id="imp09"></a>
## 9. Kas dan pembelian — tugas 024–035

<a id="imp-024"></a>
### IMP-024 — Akun kas usaha dan saldo awal bersumber

- **Dependensi:** IMP-005, IMP-010, IMP-014, IMP-016. **Area:** FINANCE/DATA/API/WEB V-08.
- **Baca:** CASH-01–CASH-04, MOD-02–MOD-03, ONB-10, REP-03/05, DATA_MODEL opening.
- **Kerjakan:** rekening/kas usaha dan pemegang ABK per orang, currency IDR, opening cutoff+provenance, saldo turunan dari opening+mutasi sah; nominal tidak bebas diedit sebagai total. Pembayaran dari rekening pribadi eksternal bukan akun usaha otomatis.
- **Hasil:** riwayat saldo awal dan coverage; ABK hanya sendiri, Owner memilih pemegang; tidak ada saldo rekan di cache/proyeksi.
- **Uji:** opening Rp500.000 + penerimaan Rp200.000 − belanja Rp120.000 = Rp580.000, tanpa menghitung ulang histori sebelum cutoff; duplicate opening ditolak/koreksi tertaut.
- **Berhenti:** opening menutupi selisih tanpa sumber atau suatu rekening fisik campuran otomatis seluruhnya masuk usaha.

<a id="imp-025"></a>
### IMP-025 — Efek kas/biaya/hak/kewajiban dan application atomik

- **Dependensi:** IMP-010, IMP-024. **Area:** FINANCE/DATA/API.
- **Baca:** FIN-01–FIN-09, MOD-02–MOD-05, CASH-13, COST-01, DATA_MODEL transactions.
- **Kerjakan:** satu layanan posting efek sumber unik, obligations/applications/cost sources, account locking deterministic, expected versions, source/effects/receipt/audit/outbox atomik. Currency/amount/source/classification valid, total pembayaran tidak melampaui sisa kecuali kelebihan diklasifikasi terpisah.
- **Hasil:** domain reuse untuk pembelian/payroll/settlement; tidak menambahkan seluruh cash out sebagai expense; tidak full accounting ERP baru di luar model.
- **Uji:** dua pembayaran masing-masing Rp80.000 atas utang Rp100.000 tidak boleh keduanya penuh; failure setelah effect pertama rollback semua; transfer net nol antar kas; AC-12/15/16/63/71.
- **Berhenti:** lost update karena baca saldo di luar lock, floating point, atau modul menulis total ledger sendiri tanpa source uniqueness.

<a id="imp-026"></a>
### IMP-026 — Transfer, pengembalian pegangan dan rekonsiliasi kas

- **Dependensi:** IMP-024, IMP-025. **Area:** FINANCE/API/WEB V-08.
- **Baca:** CASH-02–CASH-04/CASH-10/CASH-12, FIN-10, GOLD-01, AC-09, UT-16/23, CMD-34–CMD-35.
- **Kerjakan:** Owner online mencatat perpindahan uang nyata dari akun usaha ke pegangan ABK/antar akun/pengembalian; pair sah satu kejadian, bukan biaya. Saldo terkonfirmasi/claim keluar/penerimaan belum sah ditampilkan terpisah; receipt tidak berarti konfirmasi bank. Catat hitungan kas fisik dengan waktu/cutoff/versi buku sebagai pengamatan, bukan update saldo; ABK boleh mengajukan pengamatan miliknya. Owner meninjau selisih dan hanya membuat adjustment terpisah yang beralasan/terklasifikasi jika sah; tanpa keputusan, selisih tetap belum diselesaikan.
- **Hasil:** kas usaha total tidak berubah oleh transfer internal; tidak memberi dana sah dari klaim penerimaan ABK saja. Owner mencatat **Beri Uang Kas**/**Terima Kembali** lewat lembar dari Uang Kas atau **Catat** tanpa pindah halaman; rincian saldo dibuka-tutup di tempat.
- **Uji:** GOLD-01 tepat; duplicate transfer ID, insufficient cash, wrong employee/account tenant, pihak penerima berselisih → reconciliation, bukan movement tambahan. Buku Rp500.000/fisik Rp480.000: submit count tidak mengubah buku, ABK tidak bisa adjust, stale book version perlu review; Owner adjust Rp20.000 dengan arah/kelas/alasan sah sekali, retry tidak ganda dan audit tetap menampilkan selisih asal.
- **Berhenti:** perkiraan uang tangan negatif dipaksa nol atau dianggap kekurangan uang fisik tanpa data cukup.

<a id="imp-027"></a>
### IMP-027 — Catatan tunai OFF-16 dan satu kejadian kanonis

- **Dependensi:** IMP-019, IMP-022, IMP-025, IMP-026. **Area:** LOCAL/FINANCE/API/WEB V-13/V-08.
- **Baca:** OFF-16, FIN-10–FIN-12, GOLD-23, AC-76, UT-21.
- **Kerjakan:** catat penyerahan/penerimaan/pembayaran nyata secara offline sebagai unverified; server menerima klaim bukan posting ABK. Owner menaut kedua laporan ke satu cash movement kanonis, termasuk counterpart terlambat setelah movement posted. Parent operasi/linkage eksplisit sebelum child belanja.
- **Hasil:** resolusi/link dan efek uang atomik; konfirmasi penerima tidak menjadi transfer kedua; nominal/tanggal sama tidak auto-match. Di layar ABK aksinya bernama **Terima Uang** dan **Kembalikan Uang** (lembar dari Uang Kas atau Catat), berstatus **Belum Dicek Owner**; label lama “Catatan Tunai” tidak dipakai.
- **Uji:** dua perangkat masing-masing melaporkan Rp300.000 → saldo berubah Rp300.000 sekali; child Rp100.000 tetap dependency-pending sampai parent sah; late counterpart LINKED tanpa kas tambahan; retry/revoke/lock menjaga isi klaim.
- **Berhenti:** tidak bisa membuktikan kejadian sama; jangan otomatis gabung/mengubah sumber ke talangan ABK.

<a id="imp-028"></a>
### IMP-028 — Catat pembelian barang/jasa yang sederhana

- **Dependensi:** IMP-019, IMP-023, IMP-025, IMP-027. **Area:** FINANCE/API/WEB/LOCAL V-09/V-10.
- **Baca:** CASH-05–CASH-09/CASH-16, K-33/K-34, GOLD-30, AC-13/79/96/97, UT-17/18/37.
- **Kerjakan:** keperluan bebas/saran terakhir, nominal, sumber/pembayar, tanggal dan konteks; bukti opsional, bukan master wajib. ABK mengajukan claim, Owner online boleh langsung save+approve+post dengan klasifikasi dan sumber valid; Owner offline hanya draft/capture.
- **Hasil:** gas/solar/peralatan/listrik/jasa diterima sebagai contoh umum, tanpa usage/stock pool; status review/post/pay terpisah. Unknown klasifikasi ditahan untuk pelengkapan. Catat Belanja adalah lembar dari **Catat**/Hari Ini/Uang Kas: keperluan dengan saran riwayat sendiri, nominal lewat keypad + ejaan, tanggal **Hari ini/Kemarin**, sumber **Belum Tahu** boleh, cek belanja mirip tanpa memblokir; status **Menunggu Owner**.
- **Uji:** simpan tanpa nota/alasan, teks baru tanpa item; Owner bayar toko langsung tidak mengubah pegangan ABK; invoice kredit tidak keluar kas; offline retry satu claim; nominal tidak pernah terisi dari riwayat; UT-44/UT-45/UT-48 bagian belanja.
- **Berhenti:** form ABK meminta coverage/pajak/aset atau pembelian hanya menerima katalog gas/solar; jangan approve uang dari keputusan DAILY.

<a id="imp-029"></a>
### IMP-029 — Review Owner dan resolusi klaim kas

- **Dependensi:** IMP-028. **Area:** FINANCE/API/WEB V-10/V-11/V-08.
- **Baca:** FIN-10–FIN-11, COST-01, CYC-11, AC-10/64/65, UT-19/22.
- **Kerjakan:** review versioned approve/needs correction/reject, source/classification/allocation sebelum posting; resolusi terminal FIN-11 dan link efek dalam transaksi. Klaim rejected tetap unresolved jika uang memang diklaim keluar; kasus tidak terjadi/duplicate/recoverable/payer-corrected mengikuti aturan lengkap.
- **Hasil:** pengurang kas sementara hilang hanya saat resolusi sah, bukan ketika reject; lebih besar saldo meminta klarifikasi, tidak auto-piutang hukuman/gaji. Layar **Periksa Belanja** memakai baris buka-tutup: baris tertutup menampilkan pencatat, tanggal, keperluan, nominal, status; baris terbuka menampilkan data yang perlu dilengkapi, pratinjau dampak, lalu **Setujui & Bukukan**/**Minta Perbaikan**/**Tolak** tanpa pindah halaman. Tidak ada bukukan hanya dengan geser.
- **Uji:** tolak kategori Rp120.000 → claim masih terlihat; resolve duplicate taut sumber tanpa biaya lagi; approve setelah terminal ditolak; actor/version stale gagal; refund-required belum disahkan bukan terminal; UT-46 (posisi gulir, `aria-expanded`, pratinjau sebelum bukukan).
- **Berhenti:** sumber dana/kewajiban pengembalian belum diketahui; Owner boleh meminta klarifikasi, bukan mewajibkan nota tersembunyi.

<a id="imp-030"></a>
### IMP-030 — Batch setujui dan bukukan tanpa blanket approval

- **Dependensi:** IMP-029. **Area:** FINANCE/API/WEB V-11.
- **Baca:** FIN-13, FIN-12, AC-79, UT-19.
- **Kerjakan:** selection/batch action/doc IDs/expected versions/hash dibekukan sebelum konfirmasi; tampilkan jumlah/total/sumber/pengecualian; proses receipt per dokumen atomik. Hasil applied/already posted/needs data/dependency/conflict/denied jelas.
- **Hasil:** satu dokumen invalid tidak memaksa seluruh batch sukses; retry selection sama tanpa efek tambahan; kredit tetap payable/unpaid, bukan PAID karena approve.
- **Uji:** tiga dokumen: valid Rp100.000, sumber belum jelas Rp50.000, versi berubah Rp70.000 → hanya Rp100.000 boleh diposting; retry+double click tetap sama; revisi selection tidak membukukan sumber lama dua kali.
- **Berhenti:** batch tidak punya versi yang ditinjau atau hanya UI mengunci tombol tanpa dedupe server.

<a id="imp-031"></a>
### IMP-031 — Kredit, reimbursement, uang muka dan cicilan

- **Dependensi:** IMP-025, IMP-029. **Area:** FINANCE/API/WEB V-08/V-10/V-18.
- **Baca:** CASH-07–CASH-09/CASH-13, FIN-02/06, GOLD-02, AC-11/12/14/16.
- **Kerjakan:** kewajiban supplier/ABK yang menalangi terpisah dari cash movement; receipt/penerimaan belanja mengakui biaya sesuai class, pembayaran mencicil kewajiban. Advance supplier adalah hak/uang muka sampai penerimaan+application; overpay diklasifikasi eksplisit atau ditolak.
- **Hasil:** satu invoice banyak pembayaran/sumber tetap satu pembelian; remaining bukan status bebas; pembayaran mengikuti kejadian nyata/tanggal sebenarnya.
- **Uji:** GOLD-02; invoice Rp100.000 dibayar Rp40.000 lalu Rp60.000 → biaya tetap Rp100.000; tambahan Rp10.000 tanpa klasifikasi gagal; advance sebelum barang belum biaya.
- **Berhenti:** reimbursement dianggap gaji/kasbon, atau credit approval langsung membuat cash out tanpa uang berpindah.

<a id="imp-032"></a>
### IMP-032 — Refund, reversal dan koreksi uang tertaut

- **Dependensi:** IMP-029, IMP-031. **Area:** FINANCE/DATA/API/WEB V-10/V-25.
- **Baca:** FIN-03/04/09/11, MOD-04/05, CYC-10, AC-15/21/44/64.
- **Kerjakan:** bedakan koreksi pencatatan vs pengembalian uang sebenarnya; referensi sumber, alasan actor, reversal/application dan replacement bila diperlukan. Preview dampak akun/kewajiban/biaya/alokasi dan periode; locked → usulan/reopen, tidak edit total.
- **Hasil:** chain sumber/reversal tetap dapat ditelusuri; efek refund/correction unik. Nilai input biasa nonnegatif, jenis transaksi menentukan arah.
- **Uji:** reversal payment membuka sisa utang tanpa biaya baru; refund parsial biaya Rp100.000 sebesar Rp20.000 → cost net Rp80.000, bukan Rp120.000 atau nol; alokasi/coverage diselaraskan atomik; duplicate refund tidak dua kali; crash rollback; snapshot lama tetap ada; actor dicabut tidak membaca detail.
- **Berhenti:** dampak downstream belum diketahui atau agent ingin hard-delete posted record agar laporan cocok.

<a id="imp-033"></a>
### IMP-033 — Alokasi biaya dan bagian di luar periode

- **Dependensi:** IMP-005, IMP-029, IMP-032. **Area:** FINANCE/API/WEB V-10/V-18.
- **Baca:** COST-03–COST-07, DATA-08, GOLD-07, AC-08/17/100.
- **Kerjakan:** source amount = allocated+unallocated, target farm/cycle/building sah dan driver snapshot, manual/proporsi sesuai PRD; nominal alokasi ditentukan dahulu, residu deterministik; sisa eksplisit di luar periode tidak pindah otomatis ke periode berikut.
- **Hasil:** biaya bersama dapat dibagi tanpa membuat expense/payment kedua, perubahan alokasi tidak menggerakkan kas; target locked butuh reopen.
- **Uji:** contoh GOLD-07 dari CORE pada transaksi nyata; duplicate apply, concurrent allocations tidak melampaui source, sebagian Rp600 dari Rp1.000 menyisakan Rp400; building allocation bukan izin FCR per building.
- **Berhenti:** normalisasi persen parsial menjadi 100% atau pembulatan baris menghasilkan rupiah hilang/negatif.

<a id="imp-034"></a>
### IMP-034 — Riwayat barang/peralatan tanpa inventory

- **Dependensi:** IMP-028, IMP-029, IMP-033; keputusan Q-04 hanya untuk kasus klasifikasi yang memerlukannya, bukan prasyarat membuat daftar riwayat.
- **Area:** FINANCE/API/WEB V-12. **Baca:** D-05/D-15, COST-01, INV-17, GOLD-30, AC-96, UT-37.
- **Kerjakan:** daftar riwayat pembelian dengan source/actor/date/status/classification dan filter; peralatan tahan lama ditandai ringan terpisah dari biaya habis pakai. Tidak membuat asset maintenance/depreciation otomatis, saldo stok atau sisa gas.
- **Hasil:** laporan menunjukkan pembelian dan klasifikasi yang diketahui, bukan pemakaian fisik yang tak dicatat; perubahan jenis historis lewat koreksi sah.
- **Uji:** label layar **Riwayat Belanja** (bukan “Barang & Peralatan”); listrik/jasa/barang baru tetap terlihat, bukan whitelist katalog; beli gas Rp200.000 menjadi biaya sekali saat sah; alat Rp500.000 tidak otomatis habis biaya satu periode; tidak ada tugas rutin consumption.
- **Berhenti:** tahan pengakuan/klasifikasi kasus aset yang Q-04-nya belum diputuskan; daftar/filter/riwayat tetap dapat dibangun dengan label pending. Jangan mengarang depresiasi atau menyamarkan unknown menjadi nol.

<a id="imp-035"></a>
### IMP-035 — Dana Owner sisi usaha dan pendapatan sampingan

- **Dependensi:** IMP-025, IMP-031, IMP-034. **Area:** FINANCE/API/WEB V-08/V-18.
- **Baca:** CASH-14–CASH-15, D-10, GOLD-13 bagian usaha/GOLD-25, AC-28/80.
- **Kerjakan:** modal kas+kontribusi bukan income; prive bukan biaya; pinjaman langsung kas+utang Owner; talangan belanja cost/aset+utang atau kontribusi dipilih eksplisit. Repayment pokok mengurangi kas/utang tanpa expense kedua; sumber pribadi eksternal tanpa buku pribadi/pair R2. Pisahkan pendapatan sampingan usaha (misalnya penjualan karung/sekam/kotoran) menjadi income+kas atau piutang sesuai kejadian; jangan mencatat ulang penjualan yang sudah tercakup settlement.
- **Hasil:** histori dana Owner transparan; satu rekening fisik campuran hanya bagian usaha yang dibukukan.
- **Uji:** GOLD-25 tepat; modal Rp1.000.000 tidak laba, pinjaman Rp500.000 bukan penghasilan, bayar pokok Rp200.000 sisa utang Rp300.000; pendapatan karung Rp100.000 tunai menaikkan income/kas sekali, piutang yang kemudian dibayar tidak mengakui income kedua. Fixture penjualan sudah tercakup settlement menolak pengakuan income kedua; jika sumber belum diketahui, pending/review, bukan asumsi berbeda. Feature private/PPL belum aktif ditolak.
- **Berhenti:** fitur menuntut akun buku pribadi aktif, memberi akses private Admin, atau dana Owner dianggap kasbon ABK.

<a id="imp10"></a>
## 10. Tenaga kerja, hasil, dan penutupan — tugas 036–045

<a id="imp-036"></a>
### IMP-036 — Kasbon mandiri per pekerja

- **Dependensi:** IMP-025, IMP-026, IMP-035. **Area:** FINANCE/API/WEB V-15.
- **Baca:** PAY-07–PAY-10, K-21, D-14, GOLD-06/GOLD-29, AC-24/26/98, UT-23/24.
- **Kerjakan:** disbursement kasbon Owner online membentuk cash out+piutang worker; agreement/periode opsional, tidak dibatasi hak gaji. Repayment/application sesuai kejadian, saldo outstanding lintas periode dan saat worker nonaktif tetap pada worker asal.
- **Hasil:** daftar kasbon, histori, saldo per orang; ABK sendiri saja. Tidak auto-convert/reissue saat periode berganti, tidak otomatis expense.
- **Uji:** tanpa salary agreement cair Rp2.000.000 dari kas sah; gaji kemudian Rp1.500.000 tidak menolak kasbon; sisa tetap saat pindah kandang/nonaktif; double disbursement ID hanya sekali, kas kurang ditolak bukan “gaji kurang”.
- **Berhenti:** ada plafon gaji default atau potongan otomatis dipicu akhir siklus.

<a id="imp-037"></a>
### IMP-037 — Agreement dan finalisasi gaji periode

- **Dependensi:** IMP-033, IMP-036. **Area:** FINANCE/API/WEB V-14.
- **Baca:** PAY-01–PAY-06, COST-04/05, GOLD-05, AC-22/23, Q-09.
- **Kerjakan:** hak gaji per pekerja/periode dengan snapshot nominal/ketentuan dan alokasi, bukan payroll bulanan default. Finalisasi mengakui gross cost+kewajiban bersumber, terpisah paid; koreksi final lewat version/reversal/reopen bila terkait lock.
- **Hasil:** gaji final belum dibayar tidak membuat cash movement; tidak menjumlahkan upah kerja ke slip. Hak berhenti dini mengikuti kebijakan, bukan prorata karangan.
- **Uji:** gaji gross Rp1.500.000 final → biaya/hak Rp1.500.000, kas tidak berubah; finalisasi retry tidak ganda; multi-farm allocation total gross tepat.
- **Berhenti:** formula hak/berhenti dini belum diputuskan atau seluruh transfer ABK diklasifikasi gaji.

<a id="imp-038"></a>
### IMP-038 — Bayar gaji dan potongan pilihan Owner

- **Dependensi:** IMP-036, IMP-037. **Area:** FINANCE/API/WEB V-14/V-15.
- **Baca:** PAY-08–PAY-10, FIN-06, GOLD-06, AC-24/26/98, UT-24.
- **Kerjakan:** tampilkan gross/sisa_hak/kasbon/deduction pilihan/cash payment terpisah; Owner memilih nol/sebagian/sesuai batas min(sisa hak, kasbon outstanding). Payment+application+receipt satu transaksi dengan locks pada hak, kasbon dan akun.
- **Hasil:** deduction bukan nominal auto-maksimal; cash dibayar dapat nol/sebagian tanpa negatif; sisa hak dan kasbon tetap jelas; upah tidak dipotong otomatis.
- **Uji:** sisa gaji Rp1.500.000, kasbon Rp2.000.000, potong Rp500.000, bayar Rp700.000 → sisa gaji Rp300.000, kasbon Rp1.500.000; dua pembayaran paralel tak melampaui sisa; reversal membalik application konsisten.
- **Berhenti:** UI menyebut posisi net negatif sebagai bayar negatif atau memotong kasbon sebelum Owner konfirmasi.

<a id="imp-039"></a>
### IMP-039 — Upah pekerjaan sebagai dokumen dan pembayaran sendiri

- **Dependensi:** IMP-019, IMP-029, IMP-033, IMP-038. **Area:** FINANCE/API/WEB/LOCAL V-16.
- **Baca:** PAY-11–PAY-15, GOLD-05, AC-25, UT-25, FL-07.
- **Kerjakan:** worker/task description/date/qty/unit/rate snapshot, periode opsional, pengajuan offline dan review Owner online; selesai+disetujui mengakui cost+utang upah, payment sendiri. Task engine umum tidak perlu. Transfer bank fisik gabungan dipecah allocations payment gaji/upah bertaut referensi bank sama.
- **Hasil:** slip/work compensation dan sisa upah terpisah dari gaji; report boleh agregasi tenaga kerja dengan subjenis tetap terlihat.
- **Uji:** GOLD-05 tepat; ubah master rate tidak repricing histori; approval tidak cash jika belum dibayar; retry/reject/conflict dan ABK rekan tidak dapat membaca.
- **Berhenti:** pekerjaan selesai otomatis menghasilkan payroll bonus atau ketergantungan modul task R2.

<a id="imp-040"></a>
### IMP-040 — Opening seluruh posisi uang tengah siklus

- **Dependensi:** IMP-016, IMP-024, IMP-036, IMP-037, IMP-039. **Area:** FINANCE/DATA/API/WEB.
- **Baca:** ONB-10, PAY-02, GOLD-24, AC-78, MOD-03.
- **Kerjakan:** lengkapi jalur opening IMP-016/024 untuk kas, kasbon, gaji/upah, utang supplier, reimbursement ABK, uang muka supplier, utang/talangan Owner, hak/piutang dan utang mitra, serta biaya historis yang diketahui menurut ONB-10/model data. Pisahkan gross yang diakui, telah dibayar/dipotong, sisa pada cutoff dan coverage. Opening posisi mitra memakai obligation sah tanpa memerlukan RHPP fiktif sebelum IMP-041; bila ada nilai/kelas belum diketahui tetap pending.
- **Hasil:** review/approve opening bertaut sumber per jenis tidak membuat cash movement, biaya atau pendapatan baru; tidak menghapus piutang lama. Reconciliation opening+valid changes=closing tersedia, overlap transaksi setelah cutoff ditolak. R1 tidak membuat saldo inventory awal sebagai prasyarat.
- **Uji:** fixture GOLD-24 angka persis dari PRD, ditambah tiap posisi di atas (misalnya supplier payable Rp300.000, reimbursement Rp100.000, supplier advance Rp200.000, piutang mitra Rp400.000); approval opening mengakui posisi awal saja, kas/biaya/income baru tidak berubah. Uji kejadian sebelum/tepat/setelah C: tepat C tanpa keputusan sisi tertahan, dua pilihan sisi teruji masing-masing tepat sekali. Pelunasan berikutnya/offset sah mengubah remaining dan status sekali; retry opening tidak ganda; finalisasi tidak mengakui gross lama dua kali; missing history memblokir klaim final seluruh siklus.
- **Berhenti:** tidak tahu mana biaya/hak yang sudah diakui; jangan paksa seluruh saldo opening sebagai pengeluaran hari ini.

<a id="imp-041"></a>
### IMP-041 — RHPP aktual manual dan klasifikasi komponen

- **Dependensi:** IMP-033, IMP-035, IMP-040. **Area:** FINANCE/API/WEB V-17.
- **Baca:** SET-01–SET-09/SET-11, COST-11, GOLD-12, AC-41/42/60/68, Q-08.
- **Kerjakan:** dokumen aktual berversi, net hak dan komponen income/tabungan/utang/potongan/coverage sesuai contoh terverifikasi; status document/classification/settlement/payment independen. Tidak membutuhkan contract engine, FCR atau daftar produksi lengkap.
- **Hasil:** komponen analitis PT bukan cost entry Owner kedua; full detail dan ringkas pilihan per kejadian, belum lengkap tidak dipaksa nol.
- **Uji:** GOLD-12; unknown component classification pending, belum laba final; histori revisi dan verifikasi tidak membuat kas; akses ABK/Admin ditolak.
- **Berhenti:** mapping RHPP ambigu; simpan draft/pending atau jalur payout-only, jangan label seluruh net sebagai income lengkap.

<a id="imp-042"></a>
### IMP-042 — Payout notice, uang masuk, dan payout-only

- **Dependensi:** IMP-025, IMP-041. **Area:** FINANCE/API/WEB V-17/V-08.
- **Baca:** SET-11, GOLD-20, AC-42/68/84, UT-26/27.
- **Kerjakan:** pemberitahuan akan bayar tidak mengubah kas; Owner konfirmasi uang nyata ke akun sah menghasilkan cash receipt. Jika hak belum diverifikasi, masuk penerimaan belum dipadankan/suspense, bukan income atau PAID yang dibuat-buat. Bukti opsional dan tanpa alasan wajib.
- **Hasil:** nominal pembayaran saja tetap berguna tanpa seluruh RHPP; hak net/pelunasan unknown tetap UNRECONCILED; pekerjaan/siklus baru tidak ditahan.
- **Uji:** notice Rp2.000.000 → kas tetap; actual payout Rp1.000.000 → kas +Rp1.000.000, belum income final; notice dibatalkan tidak reversal kas; duplicate actual receipt sama key sekali.
- **Berhenti:** UI meminta foto/dokumen wajib untuk sekadar mencatat pembayaran atau memakai notice sebagai saldo.

<a id="imp-043"></a>
### IMP-043 — Pemadanan payout, coverage biaya, dan hasil sementara

- **Dependensi:** IMP-033, IMP-041, IMP-042. **Area:** FINANCE/API/WEB V-17/V-18.
- **Baca:** COST-08/COST-11, SET-08/SET-11, GOLD-12/GOLD-18 bagian coverage/GOLD-20, AC-60/66/68.
- **Kerjakan:** link suspense/payment ke verified right dengan reclass/application tanpa cash kedua; partial/multiple payment/offset sah, overpay eksplisit. Refund suspense yang benar-benar dikirim adalah cash OUT + pelunasan suspense payable, bukan penghapusan penerimaan asal. Coverage dibatasi net cost allocation dan komponen yang benar-benar mengurangi net. Offset memakai dua obligation bertipe sah; tabungan yang mapping aset/reklasifikasinya belum diputuskan Q-08 tetap pending, bukan dibuatkan payable fiktif agar offset lolos.
- **Hasil:** penghasilan+pendapatan sampingan−biaya di luar settlement menurut kelengkapan; biaya tercakup tidak dikurangi dua kali; report pending komponen jelas.
- **Uji:** biaya Rp1.000.000, coverage Rp400.000 → pengurang laba Rp600.000; coverage concurrent melebihi source gagal; reimburse penambah income bukan coverage; matching cash tetap. Payout belum dipadankan Rp1.000.000, refund nyata Rp200.000 → kas turun Rp200.000 dan suspense tersisa Rp800.000; retry tak mengembalikan uang kedua. Tabungan tanpa mapping terverifikasi tidak di-offset sembarang; anti-duplikasi pendapatan yang sudah tercakup settlement dari IMP-035 diuji end-to-end di sini.
- **Berhenti:** source/coverage belum bisa direkonsiliasi atau memerlukan inventory untuk kasus coverage R1.

<a id="imp-044"></a>
### IMP-044 — Selesai fisik dan periode berikut tanpa panen fiktif

- **Dependensi:** IMP-015, IMP-020, IMP-042. **Area:** OPERATIONS/API/WEB V-05/V-26.
- **Baca:** CYC-05–CYC-08/CYC-11, AC-06/84/89, UT-28, FL-09.
- **Kerjakan:** deklarasi Owner online tanggal kosong, pernyataan tidak ada ayam hidup, rekap sejauh diketahui/sumber/versi; jangan menyebut sensus measured bila hanya deklarasi. Lampiran/alasan ketiadaan tidak wajib; OFF/DAILY tidak perlu DO/fake mortality.
- **Hasil:** FINISHED fisik tidak otomatis LOCKED keuangan; periode baru dapat ACTIVE meskipun RHPP lama belum cair. Tidak boleh kembali ACTIVE jika sudah ada periode lain aktif. Label layar: tombol **Tandai Kandang Kosong**, bukan “Selesai Fisik”.
- **Uji:** partial DAILY/off, sisa disposition unknown, deklarasi sah; late production di luar interval ditolak/usulan historis sesuai CYC; cancellation pra-DOC tidak membuat panen palsu.
- **Berhenti:** command mengunci keuangan otomatis atau menunggu stok/opname/final recording untuk boleh kosong.

<a id="imp-045"></a>
### IMP-045 — Review keuangan, lock, reopen dan snapshot

- **Dependensi:** IMP-029, IMP-032, IMP-033, IMP-038, IMP-039, IMP-040, IMP-043, IMP-044.
- **Area:** OPERATIONS/FINANCE/DATA/API/WEB V-26/V-18. **Baca:** CYC-09–CYC-11, AC-43/44/65/84, GOLD-14, UT-28.
- **Kerjakan:** gate seluruh claim terminal, gaji final/upah selesai diputuskan, alokasi jelas, hak/klasifikasi settlement final, historical coverage serta acknowledgement sync; lock+snapshot konsisten dan serialization dengan posting. Reopen alasan/version mempertahankan snapshot lama; pembayaran kewajiban sah setelah lock tidak mengubah biaya/income snapshot.
- **Hasil:** daftar penghambat konkret dalam baris buka-tutup dengan tautan perbaikan, no force-final; laporan partial sejak cutoff tidak dilabeli laba seluruh periode; tidak meminta inventory R1. Label layar **Tutup Buku**/**Buka Lagi**, bukan lock/reopen/kunci keuangan.
- **Uji:** pending claim/gaji/RHPP masing-masing memblokir; utang final/kasbon sisa tidak; concurrent posting vs lock salah satunya direvalidasi; late sync usulan bukan silent post; bayar invoice locked kas/utang berubah cost snapshot tetap.
- **Berhenti:** server mengasumsikan semua HP sudah mengirim atau lock hanya dari checklist client.

<a id="imp11"></a>
## 11. Laporan dan ketahanan sistem — tugas 046–053

<a id="imp-046"></a>
### IMP-046 — Laporan uang, biaya, recording dan hasil per scope

- **Dependensi:** IMP-021, IMP-034, IMP-035, IMP-040, IMP-043, IMP-045. **Area:** API/DATA/WEB V-01/V-02/V-18/V-25.
- **Baca:** REP-01–REP-19 bagian R1, COST-08–COST-11, AC-21/28/29/31/60/66/87/99.
- **Kerjakan:** query sumber sah dengan pagination/scope/field filter, periode/tanggal/zona/basis/snapshot/freshness; kas, biaya, pending claims, hak, kasbon/upah dan settlement dipisah. Coverage/cutoff/unknown terpropagasi; no sum cached dashboard cards.
- **Hasil:** drill-down ke sumber/audit yang berhak, biaya per denominator benar hanya bila data cukup; tanpa FCR/IP/stock palsu atau buku pribadi.
- **Uji:** dataset terkontrol total query = ledger authorized, perubahan nama/rate historis tidak repricing, cached old summary bertanda waktu; ABK tidak bisa agregasi nominal rekan.
- **Berhenti:** label laba final tidak sesuai gate atau biaya hari ke-15 otomatis disebut boros dibanding total siklus lain.

<a id="imp-047"></a>
### IMP-047 — Inbox, arahan adaptif dan panduan singkat

- **Dependensi:** IMP-013, IMP-014, IMP-019, IMP-029, IMP-039, IMP-046. **Area:** API/WORKER/WEB V-01/V-02/V-23.
- **Baca:** NOT-01–NOT-08 bagian R1, UX-15/16, ONB-11, AC-55/95/99, UT-04–UT-06/38.
- **Kerjakan:** perluas mesin **Saran berikutnya** dari IMP-014 ke keadaan operasional (DAILY belum tercatat, belanja menunggu Owner, keuangan periode belum selesai, catatan belum terkirim) dengan prioritas akses/storage→pekerjaan tertahan→tahap kandang→opsional; satu saran utama + maksimal dua pendamping, **Kenapa?**, aturan **Nanti**; review belanja tetap terlihat; inbox dedupe event+penerima, izin saat kirim/buka, recording informasi bukan approval. Panduan kontekstual pendek sesuai alur, tanpa LMS/gamification wajib.
- **Hasil:** saran dapat dijelaskan dari data, tidak mengubah nominal/mode/posting otomatis; last sync dan “belum ada data terkirim” bukan menuduh ABK. Tidak membangun push/websocket wajib R1.
- **Uji:** setup separuh, OFF/DAILY, multi-farm, revoke recipient, worker retry; inbox tidak ganda, tidak nominal gaji/kasbon dalam pesan publik/lock screen.
- **Berhenti:** rule membutuhkan AI/model eksternal, tugas pemakaian rutin, atau pengingat medis/FCR dari ambang tebakan.

<a id="imp-048"></a>
### IMP-048 — CSV dan PDF laporan/slip privat

- **Dependensi:** IMP-023, IMP-039, IMP-046. **Area:** API/WORKER/WEB V-18/V-21.
- **Baca:** REP-14–REP-16, SEC-01/05/09/12, AC-54, UT-35.
- **Kerjakan:** freeze filters, dataset dan field whitelist sama dengan layar, output basis/tanggal/timezone/coverage/versi; CSV formula injection escaped; PDF/slip gaji tidak menggabungkan upah. Job besar status pending/ready/failed, file privat, akses diperiksa saat unduh.
- **Hasil:** nominal/totals ekspor bisa direkonsiliasi; no public permanent links, secret, atau data tersembunyi.
- **Uji:** filter sama menghasilkan total sama, =formula/CSV injection tidak executable, ABK hanya sendiri, revoke sebelum download ditolak; failed export tidak sukses kosong.
- **Berhenti:** permission hanya diperiksa ketika job dibuat atau signed URL dianggap dapat direvoke seketika tanpa gateway.

<a id="imp-049"></a>
### IMP-049 — Paket usaha portabel snapshot konsisten

- **Dependensi:** IMP-045, IMP-048. **Area:** API/DATA/WORKER/WEB V-21.
- **Baca:** REP-19, MOD-06, AC-82, UT-35, SECURITY_OPERATIONS ekspor.
- **Kerjakan:** snapshot ID/cutoff/schema version, stable IDs+relasi, JSON/CSV dan dictionary, count/checksum per file, audit berhak, revisi/claims/unposted/server-known conflicts/restore-review terpisah posted; manifest file hash/status serta salinan lampiran tersedia. Authorized gateway download, batas file/retensi sesuai keputusan.
- **Hasil:** paket sensitif dapat diverifikasi tanpa URL sementara sebagai satu-satunya isi bukti; local-only yang server tidak tahu diungkap sebagai keterbatasan. READ_ONLY tetap export; bukan backup/auto-import.
- **Uji:** transaksi berubah saat job jalan hasil satu snapshot; totals/relations/checksums cocok; missing file dicatat bukan menghilangkan transaksi; private/secret/tenant lain tidak ikut; revoke before/during request sesuai kebijakan.
- **Berhenti:** ekstraksi mencampur beberapa waktu, arsip memuat file publik atau dianggap pengganti PITR.

<a id="imp-050"></a>
### IMP-050 — Upgrade schema lokal/API/database tanpa kehilangan antrean

- **Dependensi:** IMP-019, IMP-022, IMP-028, IMP-039, IMP-049. **Area:** LOCAL/API/DATA/WEB/OPS.
- **Baca:** OFF-13, MOD-05, AC-51, ARCHITECTURE §11.3, API_SYNC_SPEC compatibility.
- **Kerjakan:** kontrak versi/payload dan migration expand-transition-contract sesuai ADR; fixtures queue versi lama dan server baru; stable ID/hash preservation, update-required untuk versi tidak didukung tanpa purge. Rollback binary hanya bila schema kompatibel; old client tidak mem-bypass epoch.
- **Hasil:** version handshake, migrasi lokal failure-safe, panduan recovery bila storage/key/schema gagal; transaksi sumber tidak diedit untuk “menyesuaikan UI baru”.
- **Uji:** kill saat migrasi, disk/quota gagal, dua tab versi beda, old queued purchase/recording/capture/foto, restart; payload masih tersedia atau aman terkunci, no command ID reset.
- **Berhenti:** dukungan versi lama/window belum dipilih atau rollback memerlukan destructive down migration.

<a id="imp-051"></a>
### IMP-051 — Worker tahan crash dan pemantauan yang berguna

- **Dependensi:** IMP-010, IMP-047, IMP-049, IMP-050. **Area:** WORKER/OPS/API.
- **Baca:** ARC-03/04, FIN-12, NOT-05, NFR-08/10, SECURITY_OPERATIONS observability.
- **Kerjakan:** durable claim/retry bounded, lease job terpisah offline lease user, per-object order bila diperlukan, dead-letter/review dan retry berizin; indikator queue age/fail/conflict/backups/log correlation. Health readiness tidak menjanjikan semua job selesai.
- **Hasil:** restart API/worker tidak hilang/duplikasi hasil; database outbox transaksi konsisten; alert tanpa nota/token/password/URL privat; operator bisa membedakan backlog dan kegagalan permanen.
- **Uji:** mati setelah efek/job output sebelum ack → retry tidak duplicate, grant berubah sebelum kirim/unduh, timeout storage, failure berkepanjangan visible; AC-55/57.
- **Berhenti:** exactly-once diklaim dari broker saja atau log debug membocorkan payload; worker tidak boleh punya jalur posting tanpa domain guard.

<a id="imp-052"></a>
### IMP-052 — Backup, PITR dan bukti otorisasi tahan restore

- **Dependensi:** IMP-002, IMP-012, IMP-049, IMP-051. **Area:** OPS/DATA/storage/security.
- **Baca:** NFR-06/NFR-11, SEC-10/11, Q-10/Q-11, SECURITY_OPERATIONS backup/restore.
- **Kerjakan:** konfigurasi pada sandbox/lingkungan yang diizinkan: consistent base backup+transaction log/PITR atau setara, enkripsi+kontrol akses, manifest/version/hash file, log/otorisasi recovery di luar titik kegagalan sama; monitor archive failures. Tetapkan operator, akses restore dan retensi yang disetujui, bukan asumsi backup vendor aktif.
- **Hasil:** runbook spesifik provider/command aktual setelah dipilih, daftar kredensial berupa referensi tanpa nilai, prosedur uji dan bukti grant/revoke/ownership pasca-backup yang bisa diverifikasi.
- **Uji:** pulihkan ke sandbox baru, backup rusak/arsip terputus terdeteksi, checksum/relasi/count/saldo sesuai snapshot; RPO≤15 menit dan RTO≤8 jam masih target sampai diukur; local-only dikecualikan jelas.
- **Berhenti:** hanya dump harian, restore di tempat tanpa izin, retensi belum disahkan untuk produksi, atau bukti grant ikut hilang pada backup yang sama.

<a id="imp-053"></a>
### IMP-053 — Insiden restore, epoch, reconciliation dan tombstone

- **Dependensi:** IMP-010, IMP-019, IMP-032, IMP-049, IMP-052. **Area:** IDENTITY/API/DATA/LOCAL/OPS/WEB V-19/V-22.
- **Baca:** NFR-11, FIN-12, GOLD-27, AC-83, SECURITY_OPERATIONS restore, ARCHITECTURE §6/11.4.
- **Kerjakan:** freeze posting/workers, restore titik konsisten, epoch baru independen snapshot, revoke sesi dan reverify current grants. Surviving committed receipt replay tanpa efek; pra-epoch missing/unknown masuk durable review. Resolve dengan ID asal setelah bukti belum posted atau correction baru+alias/tombstone ID lama atomik; ganti request epoch tidak menghapus review.
- **Hasil:** incident/rentang kehilangan/cakupan laporan/unresolved tercatat; operator tidak otomatis baca semua bisnis, Owner review kejadian uang. File missing tidak menjadi transaksi hilang; tidak meminta serah uang ulang.
- **Uji:** ack diterima sebelum restore mundur; response hilang; local queue tanpa ack; grant dicabut sesudah backup; old ID replay setelah correction; payload HP hilang; unknown tidak auto-post; RPO/RTO sungguh diukur.
- **Berhenti:** bukti hak/kehilangan tidak cukup; scope tetap diblokir dan hasil unknown, tidak membuka layanan hanya karena login berhasil.

<a id="imp12"></a>
## 12. Verifikasi, pilot, dan handoff — tugas 054–063

<a id="imp-054"></a>
### IMP-054 — Audit integritas dan concurrency lintas modul

- **Dependensi:** IMP-045, IMP-050, IMP-053. **Area:** TESTS/semua modul terkait.
- **Baca:** TEST_PLAN concurrency/domain, MOD-01–MOD-07, FIN-01–FIN-13 dan seluruh GOLD gate R1.
- **Kerjakan:** jalankan dua/lebih koneksi DB nyata dengan barrier di titik race, fault injection sebelum/sesudah commit dan retries; receipt vs source duplicate, kas/kewajiban/allocation/coverage, DAILY create/edit, lock vs posting, grant vs mutation dan ownership vs recovery. Pisahkan deadlock yang aman retry dari invariant rusak.
- **Hasil:** evidence exact row/effect counts, saldo dan audit, bukan hanya response code; seluruh GOLD R1 tepat termasuk bagian coverage saja GOLD-18.
- **Uji:** sum allocation+unallocated=source, opening+deltas=closing, obligation=applications+remaining, one effective DAILY/claim resolution/capture conversion; fail rollback tidak meninggalkan processing permanen.
- **Berhenti:** satu selisih rupiah/row ganda/grant bocor; blocker integritas wajib diperbaiki, tidak diturunkan severity agar lolos.

<a id="imp-055"></a>
### IMP-055 — Audit keamanan seluruh jalur dan data tersimpan

- **Dependensi:** IMP-022, IMP-023, IMP-049, IMP-053, IMP-054. **Area:** TESTS/IDENTITY/API/LOCAL/OPS.
- **Baca:** seluruh SECURITY_OPERATIONS, SEC-01–SEC-16, TEST_PLAN isolation/security.
- **Kerjakan:** uji matriks actor/scope/object/field/action melalui API mentah, DB role nyata, jobs/files/export/cache/notification, bukan UI saja; secret scanning dan dependency checks sesuai toolchain; session/CSRF/XSS/username enumeration/rate limit/reset/recovery dan support access.
- **Hasil:** daftar temuan+reproduksi+perbaikan+retest, threat model diperbarui; file evidence sintetis. Admin MFA/step-up gates terbukti sesuai ADR.
- **Uji:** guessed IDs semua jalur, ABK rekan, pool tenant leak, revoke saat download/status receipt, expired lease key loss, restore revocation journal, no private data in logs/backups access.
- **Berhenti:** data lintas tenant/personal bocor, kredensial terbuka atau kontrol kritis belum diuji; jangan mengklaim audit profesional/sertifikasi dari scanner saja.

<a id="imp-056"></a>
### IMP-056 — Verifikasi seluruh layar mobile dan aksesibilitas

- **Dependensi:** IMP-021, IMP-022, IMP-045–IMP-049, IMP-055. **Area:** WEB/TESTS/evidence sintetis.
- **Baca:** UX_UI_SPEC seluruh V/UT, UX_FLOWS_WIREFRAMES, UI skill sesuai AGENTS, NFR-01/05/09.
- **Kerjakan:** jalankan aplikasi nyata dengan role berbeda pada 320/360/390/768/1280 CSS px, HP sasaran, keyboard/screen reader, zoom 200%, long numbers/text, loading/empty/error/offline/conflict/permission. Glass selektif, form/angka solid, fallback/no blur/forced colors, fokus tidak tertutup keyboard/dialog/header; 320 CSS px wajib untuk reflow UT-42.
- **Hasil:** bukti visual segar dan bukti interaksi untuk semua alur utama; label singkat membantu, tidak menghilangkan konteks/status. Input error inline+ringkasan terfokus bila banyak error; tidak menambah animasi/font daring agar menarik.
- **Uji:** seluruh UT-01–UT-49 sesuai matriks, AC-56; target pindah halaman/ketukan UX_UI_SPEC §16.4; pemeriksa teks glosarium lulus; target sentuh web minimal 44×44 CSS px/utama 48×48 sesuai spesifikasi, bukan menyalin satuan native tanpa penyesuaian.
- **Berhenti:** hanya screenshot desktop atau generator skill; tes appearance tidak membuktikan server security. Tidak menyimpan screenshot privat/pelanggan ke repo/PR.

<a id="imp-057"></a>
### IMP-057 — Kapasitas, jaringan buruk dan tekanan storage

- **Dependensi:** IMP-050, IMP-051, IMP-054, IMP-056. **Area:** TESTS/DATA/API/LOCAL/OPS.
- **Baca:** NFR-01–NFR-05/NFR-08, AC-45/49/58, TEST_PLAN performance/offline.
- **Kerjakan:** benchmark sintetis 50 tenant×10 kandang×4 bangunan, satu juta baris finansial/recording total, 100 sesi aktif; ukur p95/error bukan rata-rata saja. Uji Android RAM 3 GB/browser disepakati, 1.000 operasi teks antre tujuh hari, lease expiry, restart, quota dan upload parsial, foreground/manual sync.
- **Hasil:** profil mesin/network/build/dataset+raw results+penjelasan bottleneck; p95 read<500ms, mutation sederhana<800ms di luar internet/upload; LCP≤2,5s profil tercatat; error sistem<1% adalah target, bukan angka yang diisi.
- **Uji:** beban review/export serentak dengan input; query plans/indexes; tidak ada tenant-wide overfetch atau blocking main thread berlebihan; rerun sesudah perbaikan.
- **Berhenti:** target gagal tanpa penjelasan/keputusan; jangan mengecilkan dataset, exclude error atau menaikkan target sendiri.

<a id="imp-058"></a>
### IMP-058 — Release candidate, rollback dan drill operasional

- **Dependensi:** IMP-052–IMP-057. **Area:** OPS/TESTS/release documentation.
- **Baca:** SECURITY_OPERATIONS release/incident/runbooks; NFR-06/10/11; TEST_PLAN recovery.
- **Kerjakan:** jalankan deploy rehearsal sandbox/staging versi pinned, migration compatibility, job pause/resume, rollback binary aman dan restore terpisah. Simulasikan DB unavailable, archive failure, storage missing, compromised/lost account dan worker backlog; operator melakukan langkah tertulis, bukan hanya penulis menjelaskan.
- **Hasil:** runbook provider nyata+komando verified+operator/escalation+evidence RPO/RTO; secret hanya referensi; akses observability minimum, data sintetis.
- **Uji:** restart tanpa lost jobs, rollback tanpa hilang antrean, restore rollback grants fail-closed, laporan kehilangan jujur; tidak membuka posting sampai reconciliation selesai.
- **Berhenti:** tidak ada operator/backup independen atau drill belum berhasil; server health 200 bukan bukti pemulihan lulus.

<a id="imp-059"></a>
### IMP-059 — UAT sintetis dan baseline pilot yang disepakati

- **Dependensi:** IMP-054–IMP-058. **Area:** TESTS/UX evidence/dokumen pilot.
- **Baca:** GOAL-01–GOAL-10, AC-86, TEST_PLAN UAT, PRD Q-01/Q-03/Q-04/Q-06/Q-08/Q-09.
- **Kerjakan:** Owner dan ABK representatif mengerjakan skenario sintetis FL-01–FL-10, bukan hanya menyaksikan demo; ukur waktu/error/bantuan, review backlog, missing real-world notes dan recovery. Tetapkan sampel pembanding independen, cakupan/baseline sebelum data nyata, cara pencatatan kejadian yang tidak masuk aplikasi, dukungan serta keputusan lanjut.
- **Hasil:** temuan usability/adopsi dan revisi disetujui; bagian baseline/metode AC-86 tersedia, hasil satu siklus belum ada dan tetap pending.
- **Uji:** OFF/DAILY, beberapa ABK, belanja nyata ditolak, cash handover offline, kasbon >gaji, payout-only, missing file, akun hilang; pengguna memahami status bukan sekadar berhasil klik. Ukur juga pindah halaman/ketukan per tugas, klik pertama pada label (Uang Kas, Terima Uang, Catat Belanja, Kasbon, Upah Pekerjaan), apakah langkah berikutnya ditemukan tanpa bantuan, serta perbandingan keypad aplikasi dan keyboard HP untuk menentukan default D-26.
- **Berhenti:** responden/baseline belum ada atau user diminta menyetujui hasil yang belum diuji; jangan mengganti UAT dengan agent roleplay sebagai bukti manusia.

<a id="imp-060"></a>
### IMP-060 — Audit kesiapan teknis prapilot

- **Dependensi:** IMP-059. **Area:** bukti release+review independent.
- **Baca:** PRD §29.2/30/31, TEST_PLAN gate, rencana §14.
- **Kerjakan:** cocokkan setiap AC R1 dan GOLD R1 terhadap bukti versi release candidate. Seluruh bagian teknis wajib lulus; field-outcome AC-86 belum dieksekusi dipisahkan jelas dari bagian baseline/UAT. Cek coverage semua UT, tidak ada P0/P1 integritas/otorisasi, open Q blocking dan operator/retensi/recovery/biaya siap.
- **Hasil:** keputusan GO_TECHNICAL atau NO_GO dengan alasan dan bukti; **bukan ALL_R1_ACCEPTED**, bukan izin agent membuka produksi. Cantumkan daftar field evidence yang menunggu pilot, jangan skip diam-diam.
- **Uji:** matriks 72 AC R1 dan 17 GOLD R1 lengkap; GOLD-18 coverage saja; tidak menghitung 28 AC/14 GOLD R2 sebagai blocker R1 kecuali fitur R2 aktif salah scope harus dihapus/dikembalikan rencananya.
- **Berhenti:** tes wajib “not run”, output screenshot menggantikan ledger test, atau gate dianggap lulus hanya karena checklist penuh.

<a id="imp-061"></a>
### IMP-061 — Izin eksplisit dan pembukaan pilot terbatas

- **Dependensi:** IMP-060 dengan GO_TECHNICAL dan persetujuan pengguna/penanggung jawab operasional.
- **Area:** OPS/pilot, bukan perubahan fitur. **Baca:** Q-01/Q-10/Q-11, SECURITY_OPERATIONS go-live.
- **Kerjakan:** tetapkan Owner/kandang/user/cutoff, data yang boleh dimasukkan, jam bantuan, monitoring/backup, batas layanan, rollback/incident authority, dan cara menghentikan posting. Onboard akun privat tanpa secret dalam chat/repo; verifikasi opening dengan Owner dan coverage, bukan mengimpor semua histori otomatis.
- **Hasil:** izin tertulis dan ruang pilot terkendali; target bukan SLA komersial; backup/alert/operator benar-benar aktif. Mulai uang nyata hanya setelah semua gerbang terkait sah.
- **Uji:** smoke scope/roles/login/upload/sync/backup indikator memakai data sintetis atau transaksi pilot yang secara eksplisit disetujui; tidak membuat pembayaran sungguhan sekadar smoke test.
- **Berhenti:** izin/anggaran/retensi/data handling/operator belum sah, temuan keamanan baru, atau kehilangan bukti baseline; jangan self-approve deployment.

<a id="imp-062"></a>
### IMP-062 — Bukti satu siklus pilot dan penerimaan R1

- **Dependensi:** IMP-061 dan waktu pengamatan lapangan yang diperlukan benar-benar telah berlangsung.
- **Area:** TESTS/pilot evidence/laporan keputusan. **Baca:** GOAL-07–GOAL-10, AC-86, PRD §29.2, TEST_PLAN UAT.
- **Kerjakan:** bandingkan sampel independen belanja nyata vs catatan aplikasi, umur review, penyelesaian claim, beban input/duplikasi, coverage uang/periode dan pendapat Owner/ABK. Dokumentasikan insiden/offline/data hilang, bantuan dan penyimpangan; tetap lindungi data pribadi.
- **Hasil:** bagian lapangan AC-86 punya hasil nyata, semua 72 AC/17 GOLD gate R1 dapat dinilai lengkap beserta semua UT; keputusan lanjut/perbaiki/ulang pilot dan batas belum teruji terpisah. Satu siklus tidak bisa diganti tanggal palsu atau angka simulasi.
- **Uji:** evidensi reconcile ke snapshot yang disepakati; tidak hanya memilih sampel yang sudah masuk aplikasi; setiap kegagalan punya tindak lanjut/retest sebelum klaim final.
- **Berhenti:** periode observasi belum selesai atau baseline tidak dapat dipercaya; tandai PENDING_FIELD, jangan mengklaim produk berhasil hanya karena tes teknis hijau.

<a id="imp-063"></a>
### IMP-063 — Handoff operasi dan batas iterasi berikutnya

- **Dependensi:** IMP-062 atau keputusan tertulis menghentikan pilot dengan status jujur.
- **Area:** dokumentasi/handoff/ops. **Baca:** SECURITY_OPERATIONS, PRD §30/31, rencana §16.
- **Kerjakan:** serahkan versi release, runbooks akun/backup/restore/incident, owner tugas monitoring, jadwal drill/patch yang disetujui, hasil/risiko, changelog, paket ekspor contoh sintetis dan matriks evidence. Dokumentasikan cara menambah fitur tanpa melanggar scope atau menghapus receipt lama.
- **Hasil:** penerima dapat menjalankan prosedur yang diuji; daftar R2 tetap tertunda sampai keputusan baru. Catatan personal memory/rahasia bukan sarana menyimpan keadaan proyek; gunakan dokumen proyek berizin.
- **Uji:** operator/reviewer dapat menemukan prosedur dan bukti tanpa percakapan agent, semua tautan/versi benar; restore/data-loss limitations dinyatakan.
- **Berhenti:** akses pengelola/biaya/dukungan belum jelas; jangan menyimpulkan maintainability hanya dari kode bisa build.

<a id="imp13"></a>
## 13. Pemetaan layar, alur, dan tes

### 13.1 Kepemilikan layar dan alur

| Layar/alur | Kartu implementasi utama | Pembukti tambahan |
|---|---|---|
| V-01/V-02 ringkasan Owner/ABK | IMP-014, IMP-021, IMP-046, IMP-047 | FL-01/04; saran berizin, freshness, OFF/DAILY, no angka dummy |
| V-03/V-22 masuk/akun | IMP-008, IMP-011–IMP-013, IMP-022 | FL-03/10; password/reauth/revoke/recovery, provisioning, queue logout |
| V-04/V-05 kandang/periode | IMP-014–IMP-016, IMP-044–IMP-045 | FL-01/02/09; setup bertahap, satu fisik aktif, lock terpisah |
| V-06 recording | IMP-020–IMP-022 | FL-04; multi-ABK create/edit/retry conflict dan cutoff |
| V-07 penerimaan | IMP-015, IMP-017 | FL-02; Owner dokumen, ABK hanya proyeksi minimum |
| V-08 uang kas | IMP-024–IMP-027, IMP-031, IMP-035 | FL-05; pending vs posted dan personal custodian |
| V-09/V-10 belanja | IMP-028–IMP-029, IMP-031–IMP-033 | FL-06; optional proof, credit/reimbursement, correction |
| V-11 Periksa Belanja | IMP-029–IMP-030 | FL-06; baris buka-tutup, bukukan dari baris dengan pratinjau, tiap dokumen atomik, hasil batch parsial |
| V-12 Riwayat Belanja | IMP-034 | Riwayat pembelian bukan stock balance |
| V-13 Terima/Kembalikan Uang | IMP-027 | FL-05; lembar dari Uang Kas/Catat, dua laporan satu canonical event |
| V-14/V-15 gaji/kasbon | IMP-036–IMP-038, IMP-040 | FL-07; independen, selected deduction, opening |
| V-16 upah | IMP-039 | FL-07; compensation/slip/payment sendiri |
| V-17 hasil | IMP-041–IMP-043 | FL-08; RHPP/payout-only, notice vs actual, coverage |
| V-18 laporan | IMP-033, IMP-040, IMP-045–IMP-046, IMP-048 | Scope/date/cutoff/snapshot, totals terotorisasi |
| V-19 Status Kirim | IMP-018–IMP-019, IMP-022, IMP-050, IMP-053 | FL-10; pending/unknown/conflict/restore-review berbeda |
| V-20 tim | IMP-011, IMP-014 | FL-03; banyak ABK, reset tenant-local |
| V-21 ekspor | IMP-048–IMP-049 | Paket konsisten, gateway private, READ_ONLY |
| V-23 panduan | IMP-047 | Konteks, label, bantuan bukan LMS |
| V-24 Admin | IMP-008, IMP-013 | Status/limit, tidak membaca buku usaha |
| V-25 riwayat | IMP-010, IMP-021, IMP-032, IMP-046 | Actor/revision/source/reversal berizin |
| V-26 Tutup Buku | IMP-044–IMP-045 | FL-09; Kandang Kosong vs Tutup Buku, Buka Lagi dengan snapshot |

IMP-056 memeriksa semua layar di atas pada aplikasi berjalan. Backend/security/offline evidence tetap diperlukan meski layar telah diverifikasi.

### 13.2 Kepemilikan gate penerimaan

Setiap AC di [TEST_PLAN.md](TEST_PLAN.md) mempunyai skenario/lapisan/bukti. Kartu mencantumkan AC terarah; tabel ini menutup cakupan **semua AC R1**, bukan sekadar daftar contoh. Bila kartu fondasi belum punya UI, acceptance end-to-end dinilai ulang pada kartu integrasi/release.

| AC R1 | Kartu pemilik pembuktian implementasi |
|---|---|
| AC-01 | IMP-007, IMP-009, IMP-055 |
| AC-04–AC-05 | IMP-013, IMP-055 |
| AC-06–AC-07 | IMP-015, IMP-044, IMP-054 |
| AC-08 | IMP-033 |
| AC-09–AC-10 | IMP-026, IMP-029 |
| AC-11–AC-14 | IMP-028, IMP-031 |
| AC-15–AC-16 | IMP-025, IMP-031, IMP-032 |
| AC-17 | IMP-005, IMP-033 |
| AC-19 | IMP-005, IMP-017, IMP-020 |
| AC-21 | IMP-010, IMP-032, IMP-046 |
| AC-22–AC-26 | IMP-036–IMP-039 |
| AC-28 | IMP-035, IMP-046 |
| AC-29, AC-31 | IMP-020–IMP-021, IMP-046 |
| AC-41–AC-42 | IMP-041–IMP-043 |
| AC-43–AC-44 | IMP-032, IMP-045 |
| AC-45–AC-49 | IMP-018–IMP-022, IMP-057 |
| AC-50 | IMP-023 |
| AC-51 | IMP-050 |
| AC-54 | IMP-048 |
| AC-55 | IMP-047, IMP-051 |
| AC-56 | IMP-056, IMP-059 |
| AC-57–AC-58 | IMP-051–IMP-053, IMP-057–IMP-058 |
| AC-60 | IMP-041, IMP-043, IMP-046 |
| AC-63–AC-64 | IMP-010, IMP-029, IMP-054 |
| AC-65–AC-66 | IMP-043, IMP-045 |
| AC-68 | IMP-041–IMP-043 |
| AC-71 | IMP-010, IMP-019, IMP-054 |
| AC-76–AC-77 | IMP-022, IMP-027 |
| AC-78 | IMP-016, IMP-040 |
| AC-79 | IMP-028–IMP-030 |
| AC-80–AC-81 | IMP-012, IMP-035 |
| AC-82–AC-83 | IMP-049, IMP-052–IMP-053, IMP-058 |
| AC-84 | IMP-035, IMP-042, IMP-044–IMP-046, IMP-060 |
| AC-86 | IMP-059–IMP-062, teknis/baseline dan hasil lapangan dinilai terpisah |
| AC-87–AC-89 | IMP-015, IMP-020–IMP-021, IMP-044 |
| AC-90–AC-91 | IMP-011, IMP-014, IMP-020–IMP-022 |
| AC-92 | IMP-015, IMP-017, IMP-028 |
| AC-93–AC-94 | IMP-008, IMP-011–IMP-013 |
| AC-95 | IMP-014, IMP-016, IMP-047 |
| AC-96–AC-97 | IMP-023, IMP-028–IMP-029, IMP-034 |
| AC-98 | IMP-036–IMP-038 |
| AC-99 | IMP-014, IMP-046–IMP-047 |
| AC-100 | IMP-005, IMP-033 |

GOLD R1 yang wajib: GOLD-01–GOLD-02, GOLD-05–GOLD-07, GOLD-12–GOLD-14, GOLD-18 **coverage saja**, GOLD-20, GOLD-23–GOLD-25, GOLD-27–GOLD-30. GOLD-13 hanya sisi usaha; tes stok pada GOLD-14/18 dan perluasan pada GOLD lain mengikuti bagian yang aktif. Rincian oracle tetap PRD/TEST_PLAN, tidak ditulis ulang memakai angka yang berbeda demi mempermudah kode.

Seluruh UT-01–UT-49 dipetakan pada TEST_PLAN dan diverifikasi IMP-056/059; layar API-only tidak dianggap lulus UX. Seluruh AC/GOLD R2 tetap tercatat sebagai deferred, bukan dihapus dari dokumen atau dihitung sebagai tes R1 yang sengaja di-skip.

### 13.3 Kontrak API → kartu pemilik → suite pembukti

Tabel ini mengikat **seluruh 69 CMD dan 14 QRY** dari [registry API](API_SYNC_SPEC.md#api17) ke pekerjaan dan [suite tes](TEST_PLAN.md). ID di sini hanya rujukan, bukan definisi ulang. Setiap kartu wajib menambah kasus positif/invalid/unauthorized, dan setiap mutasi juga duplicate/hash mismatch/stale/fault rollback sesuai kernel. `TS-02` dan `TS-10` berlaku lintas command ber-scope dan retry meskipun tidak diulang pada setiap baris. Subtype CMD-31, resolusi FIN-11 dan conditional input tetap dibaca lengkap dari kontrak, bukan disimpulkan dari judul command.

| Kontrak | Kartu pemilik | Suite minimum |
|---|---|---|
| CMD-01–CMD-03 | IMP-013 setelah auth IMP-008 dan kernel IMP-010 | TS-03, TS-12 |
| CMD-04–CMD-05 | IMP-014 memakai schema IMP-007 | TS-03, TS-04 |
| CMD-06–CMD-10 | IMP-011, integrasi kandang IMP-014 | TS-02, TS-03, TS-12 |
| CMD-11–CMD-12 | IMP-014, klasifikasi pemakaian IMP-028/034 | TS-03, TS-05, TS-06 |
| CMD-13 | IMP-024 | TS-04, TS-05 |
| CMD-14–CMD-16 | IMP-015 | TS-03, TS-04, TS-09 |
| CMD-17 | IMP-016, IMP-040 | TS-04, TS-08 |
| CMD-18–CMD-19 | IMP-044 | TS-04, TS-14, TS-15 |
| CMD-20 | IMP-017 | TS-02, TS-04, TS-09 |
| CMD-21 | IMP-020, IMP-021 | TS-08, TS-09, TS-10 |
| CMD-22–CMD-24 | IMP-045 | TS-06, TS-07, TS-14 |
| CMD-25–CMD-26 | IMP-027; kernel transfer IMP-026 | TS-05, TS-10 |
| CMD-27 | IMP-029; linkage counterpart terpisah IMP-027 | TS-05, TS-06, TS-10 |
| CMD-28–CMD-30 | IMP-028–IMP-030 | TS-05, TS-06, TS-10 |
| CMD-31 | IMP-031 | TS-05, TS-06 |
| CMD-32 | IMP-032 | TS-05, TS-06 |
| CMD-33–CMD-35 | IMP-026, linkage OFF-16 IMP-027 | TS-05, TS-06 |
| CMD-36 | IMP-033 | TS-01, TS-06 |
| CMD-37 | IMP-043 | TS-06, TS-14 |
| CMD-38 | IMP-032, pengujian ulang payroll/settlement IMP-038/043 | TS-05, TS-06, TS-07, TS-14 |
| CMD-39–CMD-40 | IMP-016/024 fondasi, seluruh posisi IMP-040 | TS-04, TS-07 |
| CMD-41 | IMP-035, integrasi anti-duplikasi settlement IMP-043 | TS-05, TS-06, TS-14 |
| CMD-42–CMD-43 | IMP-037 | TS-07 |
| CMD-44–CMD-46 | IMP-036 | TS-05, TS-07 |
| CMD-47–CMD-48 | IMP-038 | TS-07, TS-10 |
| CMD-49–CMD-51 | IMP-039 | TS-07, TS-10 |
| CMD-52–CMD-55 | IMP-035 | TS-05, TS-06 |
| CMD-56–CMD-57 | IMP-041 | TS-14 |
| CMD-58–CMD-60 | IMP-042 | TS-05, TS-14 |
| CMD-61–CMD-63 | IMP-043 | TS-06, TS-14 |
| CMD-64–CMD-65 | IMP-023 | TS-02, TS-10, TS-11 |
| CMD-66 | IMP-048–IMP-049 | TS-02, TS-13 |
| CMD-67 | IMP-022 | TS-02, TS-10, TS-12 |
| CMD-68 | IMP-012 | TS-02, TS-12 |
| CMD-69 | IMP-053 | TS-11, TS-12 |
| QRY-01 | IMP-009, IMP-018/022 | TS-02, TS-10, TS-12 |
| QRY-02 | IMP-014–IMP-015 | TS-02, TS-03, TS-04 |
| QRY-03 | IMP-020–IMP-021 | TS-08, TS-09 |
| QRY-04 | IMP-047; status antrean IMP-019 | TS-02, TS-10, TS-13 |
| QRY-05 | IMP-024–IMP-027 | TS-02, TS-05 |
| QRY-06 | IMP-028–IMP-030 | TS-02, TS-06 |
| QRY-07 | IMP-046 | TS-02, TS-06, TS-14 |
| QRY-08 | IMP-045 | TS-14 |
| QRY-09 | IMP-036–IMP-040 | TS-02, TS-07 |
| QRY-10 | IMP-041–IMP-043 | TS-02, TS-14 |
| QRY-11 | IMP-023 | TS-02, TS-11 |
| QRY-12 | IMP-048–IMP-049 | TS-02, TS-13 |
| QRY-13 | IMP-010 fondasi, tampilan IMP-046 | TS-02, TS-06, TS-08 |
| QRY-14 | IMP-010, IMP-019, IMP-053 | TS-02, TS-10, TS-11 |

Login/session/password/lease/download byte adalah jalur keamanan/transport terpisah yang tidak memasukkan secret ke command receipt. Pemiliknya IMP-008/012/022/023/048–IMP-049 dan suite TS-02/11/12/13; tidak dianggap di luar pengujian karena tidak mempunyai CMD bisnis.

Fondasi dan gate yang tidak menambah CMD baru tetap punya pembukti: IMP-004 memasang seluruh runner; IMP-005 → TS-01; IMP-007/009 → TS-02/03; IMP-018–IMP-019/022 → TS-10; IMP-050 → TS-23; IMP-051 → TS-13/17; IMP-052–IMP-053/058 → TS-11; IMP-054 mengulang TS-01–TS-14 yang aktif; IMP-055 → TS-02/12; IMP-056 → TS-15/16; IMP-057 → TS-10/17; IMP-059–IMP-062 → TS-18 dengan batas otorisasi. IMP-060/063 mengaudit bukti semua suite R1, bukan menghasilkan PASS otomatis.

TS-19–TS-22 dan TS-24 adalah perluasan R2, **tidak dijalankan sebagai fitur wajib R1**. TS-23 tetap R1. Bila registry berubah, update tabel ini, suite, model dan kartu bersamaan; pemeriksaan harus memastikan tidak ada CMD/QRY tanpa pemilik/bukti.

<a id="imp14"></a>
## 14. Definition of Done dan bukti wajib

### 14.1 DONE satu kartu

- [ ] Izin fase dan dependensi ada; tidak mengubah makna K/D/Q/AT tanpa keputusan tertulis.
- [ ] Output sesuai kartu tersedia dan terhubung ke modul/layar/kontrak yang benar; tidak ada success stub, dummy finansial atau TODO wajib.
- [ ] Validasi/otorisasi/scope/field serta batas tenant/period/mode dijalankan server.
- [ ] Mutasi terkait memakai transaction/receipt/audit/outbox/expected version sesuai efeknya; retry/concurrency/rollback terbukti bila relevan.
- [ ] Unknown/null, IDR, waktu/cutoff dan seluruh status tetap bermakna benar.
- [ ] Unit + integration DB/contract/E2E yang diperlukan lulus; regression suite terdampak dijalankan. Bukti command/exit code/build/data profile tercatat.
- [ ] UI material diperiksa di aplikasi berjalan, termasuk kondisi gagal/offline/izin; bukti appearance dan behavior dipisah.
- [ ] Layar memakai komponen IMP-006, label glosarium, target pindah halaman/ketukan, dan aturan bantuan pintar; pemeriksa teks istilah terlarang lulus.
- [ ] Migration/compatibility/rollback dan draft lama diuji bila disentuh; tidak menghapus data demi meluluskan tes.
- [ ] Diff dan file references diperiksa; secrets/private attachments tidak masuk source/log/evidence publik; dependency tambahan dijelaskan.
- [ ] Review temuan diselesaikan atau status NEEDS_REVIEW/BLOCKED tetap jujur; laporan handoff memiliki risiko, bukti dan tugas siap berikutnya.

### 14.2 Standar bukti menurut jenis klaim

| Klaim | Bukti minimum | Bukan penggantinya |
|---|---|---|
| Uang benar | Fixture+oracle GOLD, row/effect/application/saldo tepat dan transactional integration tests | Mock return success atau jumlah kartu UI |
| Concurrency aman | Beberapa koneksi DB nyata, urutan race terkontrol, efek/resolusi final diverifikasi | Dua panggilan berurutan pada test unit |
| Tenant/personal aman | API/file/export/job/cache attacks memakai ID objek lain dan runtime DB role | Menu disembunyikan atau snapshot response yang sudah disaring manual |
| Offline tahan gangguan | Restart/pergantian akun/lease/quota/migration/response loss pada target yang diuji | Toggle offline screenshot dengan data di memori |
| UI dapat dipakai | Interaksi nyata, viewport/HP, fokus/reader/contrast/status serta partisipan UAT yang disebutkan | Generator desain, gambar statis atau agent mengaku sebagai ABK |
| UI mudah dan jelas | Hitungan pindah halaman/ketukan per tugas, klik pertama pada label, pengguna menemukan langkah berikutnya tanpa bantuan, perbandingan keypad dan keyboard HP | Pendapat desainer, jumlah komponen, atau screenshot yang terlihat rapi |
| Ekspor konsisten | Snapshot source counts/totals/relations/checksums dibanding artefak private hasil job | File berhasil diunduh saja |
| Restore layak | Drill terisolasi, titik restore/kehilangan/RPO/RTO, grant/receipt/ledger/file reconciliation dan keputusan buka layanan | Backup job hijau atau halaman login hidup |
| Pilot berhasil | Baseline/sampel independen, satu siklus observasi, denominator/coverage, masalah dan keputusan Owner/ABK | Semua unit test hijau atau demo sintetis |

### 14.3 Status rilis

R1 mempunyai **72 AC** dan **17 GOLD** dalam gate PRD. R2/tertunda mempunyai **28 AC** dan **14 GOLD**, dengan hanya GOLD-18 berbagi scope yang berbeda. Jangan menjumlah 17+14 lalu menyimpulkan ada 31 golden case unik. Seluruh 49 UT merupakan kontrak UX R1 yang perlu diuji sesuai skenario.

Laporan prapilot menyebut bagian teknis/baseline yang sudah terbukti dan bagian lapangan yang belum dilakukan. Laporan penerimaan akhir sesudah pilot baru menyatakan cakupan seluruh gate. Perubahan kode setelah bukti dibuat membatalkan klaim bukti untuk area terdampak sampai dites ulang; commit/build evidence tidak boleh merujuk versi lama diam-diam.

<a id="imp15"></a>
## 15. Template penugasan dan laporan agent

### 15.1 Prompt satu tugas setelah izin implementasi diberikan

```text
Kerjakan hanya IMP-___ dari Implementation Plan.md.
Fase implementasi telah diizinkan pada [rujukan keputusan nyata].
Jika rujukan izin/dependensi tidak ada, berhenti dan laporkan BLOCKED.

Baca AGENTS.md, PLANNING.md, kartu tugas, dan seluruh aturan/tes terkait.
Periksa kode, manifest, migrasi, perubahan yang sudah ada, dan peta path/perintah.
Sebelum mengedit, ringkas invariant dan file yang akan diubah.
Jangan pilih aturan bisnis, provider, atau dependency baru tanpa alasan/review.
Jangan aktifkan R2 atau mengubah requirement/expected output demi lolos.

Implementasikan irisan terkecil yang lengkap sesuai kartu.
Jalankan tes positif, invalid, unauthorized, duplicate/stale dan failure yang diwajibkan.
Database concurrency harus diuji pada DB nyata; UI pada aplikasi berjalan.
Review diff, catat perintah/hasil/bukti dan apa yang belum diuji.
Jika gagal/ambigu, pertahankan data serta operation ID dan laporkan blocker.
Hentikan setelah kartu ini; berikan handoff, jangan klaim deploy/pilot sudah diizinkan.
```

Placeholder di template **harus diisi sumber nyata sebelum dipakai**; tidak boleh dianggap keputusan yang sudah ada. Reviewer dapat memakai konteks baru dengan perintah “baca saja, cari pelanggaran invariant/diff; jangan edit” untuk menghindari dua penulis bersamaan.

### 15.2 Catatan eksekusi per kartu

```text
Tugas dan status:
Izin fase / keputusan yang dirujuk:
Versi commit/build + lingkungan + waktu:
Dependensi dan bukti DONE:
Aturan/AC/GOLD/UT yang dipenuhi:
File/migrasi/dependency yang berubah dan alasan:
Perilaku sebelum -> sesudah:
Perintah verifikasi + direktori + exit code + hasil:
Bukti row/totals/konflik/UI/drill yang relevan (sintetis/privat):
Review diff dan temuan/retest:
Bagian belum diuji / blocker / risiko:
Perbedaan dari rancangan dan persetujuannya, bila ada:
Rollback/recovery/kompatibilitas:
Tugas berikut yang siap (belum otomatis dikerjakan):
```

Catatan eksekusi dibuat saat pembangunan diminta, bukan diisi hasil palsu sekarang. Referensi environment menggunakan nama variabel/secret, tidak nilai. Bila PR dibuat pada fase berikut, deskripsi memuat scope/bukti/batas aktual; publikasi/merge/deploy mengikuti izin sumber kontrol, bukan diasumsikan dari selesainya kartu.

### 15.3 Template laporan blocker

```text
BLOCKED_POLICY atau BLOCKED_TECHNICAL — IMP-___
Tujuan yang tertahan:
Sumber aturan yang bertentangan/kurang (file, bagian, ID):
Reproduksi atau bukti kegagalan:
Yang sudah diperiksa/dicoba aman dan hasilnya:
Risiko bila agent menebak atau melanjutkan:
Keputusan minimum yang dibutuhkan (bahasa bisnis):
Pilihan aman sementara dan bagian yang tetap dapat dilanjutkan:
Data/antrean/operation ID yang dipertahankan (tanpa rahasia):
```

<a id="imp16"></a>
## 16. Risiko, perubahan scope, dan pemeliharaan rencana

| Risiko agent | Pencegahan konkret | Tindakan saat ditemukan |
|---|---|---|
| Konteks panjang hilang/agent menebak | Satu kartu, source IDs, prompt ringkas, handoff bukti | Stop dan baca ulang sumber; jangan memakai ingatan percakapan sebagai kontrak |
| Fokus UI sementara server dummy | DoD mengharuskan domain/DB/API dan negative tests | Status belum DONE, larang data nyata |
| Tiap layar membuat pola/label sendiri | IMP-006 menyediakan komponen dan kamus teks tunggal; pemeriksa istilah otomatis | Kembalikan ke komponen/glosarium; perbarui katalog bila memang butuh pola baru |
| Semua uang dimasukkan satu tabel total | Pemilik source/effects, receipt atomik, GOLD per modul | Reproduksi invariant gagal, koreksi model sebelum lanjut layar |
| Pilihan default berubah menjadi approval bisnis | Register keputusan bertanggal/status/owner | Kembalikan sebagai usulan dan gate; jangan meminta ulang keputusan K yang sudah final |
| Scope membesar ke stok/kontrak/task | No R2 dependency dan AC-84 sebagai gate | Hentikan perubahan scope, pisahkan rencana perluasan yang membutuhkan permintaan baru |
| Green test dengan mocking/skipping | Peta evidence per klaim dan review independen | Nyatakan bukti tidak cukup; jalankan DB/perangkat/drill yang diperlukan |
| Salah update bersamaan beberapa agent | Satu pemilik file/schema/contract dan integration owner | Hentikan penulis overlap, reconciliate diff sebelum merge |
| Kehilangan data saat migration/restore | Fixtures versi lama, backup drill, epoch/tombstone | Freeze jalur berisiko dan runbook; jangan reset database/queue |
| Membuat estimasi biaya/jadwal palsu | Kartu berbasis dependency/exit gate, ukur throughput tim dan volume nyata | Sajikan asumsi/risiko, bukan janji tanggal/angka tanpa dasar |

Perubahan kebutuhan harus memperbarui PRD/UX/arsitektur/data/API/security/test dan kartu terdampak sebagai satu perubahan tertaut. Jangan membuat aturan baru hanya pada implementation plan. Nomor IMP stabil; bila perlu pecah/menambah kartu, gunakan revisi rencana dengan mapping lama→baru, periksa graph dependency serta seluruh AC/GOLD/UT/V. Nomor tidak boleh dipakai ulang untuk makna berbeda tanpa riwayat.

R2 tidak otomatis dimulai setelah IMP-063. Inventaris/pemakaian, estimasi kontrak, panen detail, private finance, PPL/Mandor, APK/push, OCR/import, IoT/CCTV memerlukan pemilihan scope dan gate baru; salin data historis R1 hanya lewat cutoff/reconciliation yang tidak menggandakan biaya/kuantitas.

<a id="imp17"></a>
## 17. Status penyelesaian dokumen dan riwayat

Dokumen ini menyediakan **63 kartu tugas**, alur dependency, penanggung jawab area, source IDs, langkah kerja, hasil, uji minimum, kondisi berhenti, template handoff dan gate. Status semua kartu **NOT_STARTED**. Selesai ditulis tidak berarti seluruh kebijakan Q/AT disetujui, developer siap deploy, atau aplikasi lulus pengujian.

Skill UI/UX lokal dibaca dan pencarian `error summary validation` ditinjau untuk rencana pemeriksaan form. Pencarian status offline dan satu percobaan lebih sempit tidak memberi panduan spesifik yang terverifikasi untuk protokol proyek; karena itu OFF/UX PRD tetap acuan, bukan haptic/feedback generik hasil katalog. Tidak ada generator visual, pemilihan stack lewat skill, atau UI aplikasi dibuat untuk dokumen ini.

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Rencana R1 dipecah menjadi 62 kartu yang dapat diaudit, lengkap dengan dependensi, invariant, cakupan tes/layar, stop conditions, bukti dan batas prapilot/pilot; seluruhnya dokumen, belum eksekusi. |
| 0.2 | 23 September 2026 | Audit kemudahan K-38: menyisipkan IMP-006 fondasi UI (pola di tempat, keypad angka, glosarium, pemeriksa istilah) sebelum layar pertama sehingga kartu v0.1 IMP-006–IMP-062 menjadi IMP-007–IMP-063 tanpa perubahan isi selain penyesuaian UI; saran berikutnya dimulai di IMP-014 dan diperluas di IMP-047; gate UX menjadi 49 UT. Semua kartu tetap NOT_STARTED. |
