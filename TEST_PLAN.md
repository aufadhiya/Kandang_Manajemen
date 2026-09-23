# Rencana Pengujian — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.3 — rancangan pengujian R1 dan traceability R2 |
| Tanggal | 23 September 2026 |
| Sumber bisnis | [PRD.md §28–29](PRD.md#s28), termasuk aturan sumber yang dirujuk tiap AC/GOLD |
| Sumber UX | [UX_UI_SPEC.md §17](UX_UI_SPEC.md#ux17), [UX_FLOWS_WIREFRAMES.md](UX_FLOWS_WIREFRAMES.md#flow02), dan [FRONTEND_DESIGN_SPEC.md](FRONTEND_DESIGN_SPEC.md) untuk tampilan |
| Sumber teknis | [ARCHITECTURE.md §6–14](ARCHITECTURE.md#arch06) |
| Status | Rencana tertulis; semua tes berstatus **belum dijalankan** |
| Fase | Perencanaan menurut [PLANNING.md](PLANNING.md); bukan izin membuat aplikasi atau menjalankan tes runtime |
| Berpasangan dengan | [`Implementation Plan.md`](Implementation%20Plan.md), bila dokumen itu tersedia; nama file tidak mengunci stack |

## 1. Tujuan dan aturan membaca

Dokumen ini memberi langkah tes yang dapat diikuti agent pelaksana dengan reasoning terbatas. **PRD tetap satu-satunya sumber makna bisnis.** Matriks di bawah menautkan setiap ID asli; deskripsi singkat tidak mengganti aturan lengkap pada PRD atau kriteria UT pada UX/UI. Alur layar menjadi bahan tugas pengguna, sedangkan arsitektur memberi cara pembuktian transaksi, izin, offline, dan pemulihan. Dokumen lain boleh menautkan ID suite `TS-01`–`TS-24`; ID ini dialokasikan khusus untuk suite di sini.

Tidak ada hasil pengujian yang sudah diperoleh. Status awal seluruh 100 AC, 30 GOLD, 49 UT, dan 24 suite adalah **BELUM DIJALANKAN**. Baca setiap `R1`, `R2`, atau `Campuran` sebagai batas rencana, bukan status implementasi. Semua baris tetap harus punya status eksplisit pada laporan pelaksanaan. Khusus AC-86, gunakan `PENDING PILOT` hanya selama tahap A/B; jangan mengubahnya menjadi lulus karena belum ada implementasi atau menganggapnya sebagai blocker kesiapan teknis.

### 1.1 Gate rilis yang diwarisi dari PRD §29.2

| Jenis acuan | Gate R1 | Gate R2 / fitur tertunda | Catatan hitung |
|---|---:|---:|---|
| AC | 72 ID | 28 ID | Total 100 ID unik; AC campuran dihitung ke gate R1 karena bagian R1-nya wajib, sedangkan cabang R2 tetap tertunda. |
| GOLD | 17 ID | 14 ID | `GOLD-18` memang ada di kedua gate dengan oracle berbeda: coverage saja di R1, gas/persediaan di R2. Ada 30 ID unik. |
| UT | 49 ID | 0 ID R2 | Registry UT adalah tugas UX R1. Pemeriksaan “fitur R2 tidak muncul/aktif” bukan menjalankan fitur R2. |

Gate R1 persis mencakup ID yang tercantum di PRD §29.2. Acuan yang ditunda tidak boleh dihapus dari traceability, diuji setengah lalu dianggap lulus, atau dinyalakan sebagai ketergantungan R1. Fitur R2 tetap nonaktif sampai ada keputusan aktivasi; suite R2 di dokumen ini baru menjadi gate ketika cakupan itu disetujui dan benar-benar dibangun. Penundaan fitur tidak pernah menurunkan kontrol tenant, file, cache, atau izin yang berlaku di R1.

Label `Campuran` hanya dipakai pada AC/GOLD yang secara eksplisit diberi batas R1/R2 dalam PRD §29.2. Untuk sebuah ID campuran, jalankan bagian R1 saja pada gate ini dan simpan bukti bahwa cabang R2 tidak ikut aktif; jangan menganggap bagian R2 lolos.

### 1.2 Lapisan bukti

| Lapisan | Yang dibuktikan | Yang tidak cukup sebagai bukti |
|---|---|---|
| Unit | Parsing, rupiah integer, persentase fixed-point, pembulatan, fungsi deterministik, aturan transisi murni. | Unit test tidak membuktikan transaksi DB atau isolasi akses. |
| Integrasi DB nyata | Constraint, transaksi atomik, rollback, locking/expected version, idempotensi, ledger dan saldo turunan. Gunakan DB transaksional yang sama kelas perilakunya dengan target; uji dua koneksi/worker nyata. | Mock repository, fake lock, atau hanya memanggil fungsi dua kali. |
| API/keamanan | Request langsung sebagai tiap peran untuk list/detail/search/update/file/export/job, perubahan scope, revoke dan tenant nonaktif. Verifikasi payload respons serta penyimpanan, bukan hanya tampilan. | Menyembunyikan tombol atau mengubah URL di browser. |
| E2E mobile/offline | Perangkat/browser sasaran, antrean lokal, restart, kehilangan jaringan, pergantian akun, expiry dan sinkronisasi ulang. | Simulasi indikator offline tanpa restart/penyimpanan lokal. |
| File/job/restore | Bucket privat nyata di lingkungan uji, worker dapat dihentikan/retry, snapshot dan manifest; drill restore di lingkungan terisolasi. | Bukti DB tanpa mencoba membaca file, atau health check sesudah restore. |
| UI/aksesibilitas | Interaksi tugas, keyboard, pembaca layar, fokus, kontras, viewport, zoom dan bukti visual keadaan penting. | Screenshot desktop tunggal atau token desain tanpa uji tampilan aktual. |
| Kinerja/UAT | Dataset/beban, pengukuran waktu yang dapat diulang, observasi Owner/ABK dan rekonsiliasi sampel. | Hasil buatan, screenshot, unit test, atau satu siklus tanpa baseline. |

Nama runner, framework, provider dan arsitektur final belum dipilih. Pelaksana memilih alat setelah stack disepakati, tetapi tidak boleh mengganti lapisan bukti yang disyaratkan suite.

## 2. Fixture uji sintetis yang tetap

Gunakan seed yang dapat dibuat ulang dari awal. Data berikut hanya contoh uji, bukan tarif, data usaha, atau keputusan produk. Gunakan nama dan identitas sintetis; tidak menyalin nota, nomor HP, password, foto, atau tenant nyata ke lingkungan tes.

| Fixture | Data tetap | Dipakai untuk |
|---|---|---|
| `FX-TENANT` | Tenant A dan B; masing-masing Owner sendiri, kandang `K-A1`, `K-A2`, dan `K-B1`; nama barang/ABK boleh sama namun semua ID dan hak berbeda. Di `K-A1`, ABK `A` dan `B` aktif bersamaan; `A` juga boleh ditugaskan ke `K-A2`. | Isolasi tenant, scope kandang, ekspor, akun, revoke dan pencarian. |
| `FX-CLOCK` | Jam uji dibekukan; zona waktu bisnis `Asia/Jakarta`; awal seed `2026-09-10T03:00:00Z` (=10.00 WIB), lalu majukan secara deterministik per skenario. Tetapkan `D=2026-09-10`, `D+1=2026-09-11`, waktu submit terpisah dari tanggal kejadian, cutoff eksplisit. Tanggal/nilai waktu yang sama dan batas tengah malam ikut diuji. | DAILY, cutoff, urutan offline, lease, laporan dan timestamp. |
| `FX-OPEN` | DOC aktual 6.500 pada `2026-09-01`; kapasitas kandang 7.000; awal pencatatan hari ke-18 pada `2026-09-18`, dengan histori sebelum cutoff hanya sebesar data fixture yang disebut skenario. Uji varian tanggal/populasi tidak diketahui sebagai `unknown`, bukan nol. | Onboarding sebelum DOC, periode berjalan, populasi dan opening payroll/kas. |
| `FX-DAILY` | Satu cycle kandang-global, mode `DAILY`; A dan B menyiapkan dua perangkat. Pada D: feed 100 kg, mati 2, afkir 1, sampel 10 ekor/total 2,0 kg; B koreksi stale menjadi feed 95 kg, mati 3. D+1 feed 20 kg, mati 1, afkir 0. Siapkan juga GAP, nol terkonfirmasi, input invalid, dan sampling kosong. | Rekap bersama, revisi, conflict, sampling dan agregasi. |
| `FX-MONEY` | Kas usaha Rp2.000.000; contoh transfer Owner→ABK Rp1.000.000; klaim belanja Rp300.000; pengembalian Rp200.000; reimbursement Rp150.000; kredit peralatan Rp400.000. Untuk pembelian sederhana: listrik Rp150.000, jasa Rp200.000, gas Rp300.000. | Kas, pembelian, klaim, pengakuan biaya, utang dan anti-inventory R1. |
| `FX-PAY` | Kasbon awal Rp1.800.000 tanpa agreement; gaji finalized Rp1.500.000; pilihan potong nol/sebagian/penuh; contoh potongan Rp500.000. Tambahkan job 100 karung × Rp2.000 dan saldo ABK A/B yang tidak boleh tergabung. | Gaji, kasbon, payroll, pembayaran fisik dan hutang per orang. |
| `FX-ALLOC` | Biaya Rp1.000.001 dibagi ke A/B/C berurutan; biaya Rp2 dengan rasio 26/26/26/22%; biaya Rp1.000 hanya Rp600 dialokasikan. | Presisi rupiah, residu deterministik, partial allocation dan laporan. |
| `FX-RESTORE` | Command X: pembayaran solar Rp100.000 dari saldo Rp1.000.000; varian commit tanpa response, ack sebelum restore mundur, receipt masih ada/hilang, grant dicabut setelah backup, upload lampiran parsial. | Idempotensi, receipt, epoch, tombstone, bukti file dan recovery. |
| `FX-FILES` | Lampiran sintetis privat dengan hash yang diketahui: satu berhasil, satu pending, satu missing setelah pemulihan; nama file tidak memuat data rahasia. | BOLA file, retry foto, ekspor dan restore. |
| `FX-R2` | Fixture sintetis terpisah untuk stok, tiket panen, konfigurasi kontrak bertingkat, PPL dan keuangan pribadi. Tidak di-seed/diaktifkan pada environment R1; hanya suite R2 setelah gate aktivasi. | Tes R2 terisolasi tanpa membuat R1 bergantung pada modul tertunda. |

Semua skenario concurrency dimulai dari DB/seed bersih, memakai jam beku, operation ID yang sama untuk retry dan expected version eksplisit. Simpan SQL/seed/hash yang diperlukan agar suite bisa diulang. Jangan memakai jam tidur nyata sebagai satu-satunya cara menguji expiry; majukan clock uji yang terkontrol, lalu validasi sekali pada perangkat untuk jalur cache/lease.

## 3. Katalog suite bernama

Setiap suite menetapkan fixture, operasi, oracle dan bukti minimal. Mapping di bagian 4–6 menggunakan ID asli di kolom **Acuan**, lalu menautkan ke suite ini; jangan membuat ID AC/GOLD/UT baru. Satu requirement dapat memakai lebih dari satu suite bila oracle berbeda.

Pemetaan seluruh command/query API ke kartu implementasi dan suite tersedia pada [Implementation Plan §13.3](Implementation%20Plan.md#imp13). Gunakan bersama schema conditional di API_SYNC_SPEC; tidak ada endpoint mutasi yang boleh dikecualikan dari auth, input invalid, retry/hash mismatch, concurrency dan rollback hanya karena memakai kernel bersama.

| Suite | Nama / gate | Lapisan utama | Masukan dan operasi | Oracle lulus | Bukti minimal |
|---|---|---|---|---|---|
| `TS-01` | Angka, satuan, alokasi | Unit + property + integrasi DB | `FX-ALLOC`; IDR dengan pecahan ditolak, persen desimal, kuantitas dengan unit, pembagian dan tie-break urutan tersimpan. | Nilai uang tersimpan sebagai rupiah bulat; hitungan deterministik; total alokasi tepat ke sumber; tiap baris nonnegatif; unknown tidak dikonversi ke nol. | Input/output terstruktur, versi aturan/seed, hasil property berulang dan pembacaan angka tersimpan. |
| `TS-02` | Isolasi tenant, role, assignment dan BOLA | API/security + integrasi DB + file | `FX-TENANT`; coba ID tenant lain lewat list/detail/search/update, field, url file, export/job, cache dan assignment; uji ABK rekan. | Tidak ada data/payload/side-channel tenant atau uang rekan; server menolak walau UI dimanipulasi; histori/hak mengikuti orang yang benar. | Request/response teredaksi, log izin, query hasil dan uji URL/file; tidak menyimpan secret. |
| `TS-03` | Tenant, kandang, anggota dan onboarding | Integrasi DB concurrency + E2E | `FX-TENANT`, `FX-OPEN`; dua request paralel pada slot kandang/grant; setup opsional, draft sebelum DOC, lalu DOC aktual. | Constraint membolehkan A+B di kandang sama, menolak grant duplikat dan slot lebih; tidak ada siklus aktif ganda; setup dapat dilanjutkan tanpa DOC palsu. | Trace dua transaksi, state sebelum/sesudah, screenshot keadaan DRAFT dan bukti constraint. |
| `TS-04` | Periode, cutoff dan opening tengah siklus | Integrasi DB + unit + E2E | `FX-OPEN`, `FX-CLOCK`; aktivasi DOC, mulai hari 18; opening kas/kasbon/gaji/upah, utang supplier/reimbursement/Owner, uang muka supplier, piutang/utang mitra dan biaya historis diketahui, serta tanggal/populasi unknown. | Populasi hanya DOC aktual; coverage parsial/cutoff terlihat; setiap opening bersumber tepat sekali, bukan cash-out/biaya/income baru. Pembayaran/application setelah cutoff mengubah sisa sekali; overlap histori ditolak dan unknown tetap unknown. | Snapshot per jenis opening sebelum/sesudah, saldo/kas/biaya/income delta, sumber/cutoff, retry dan pelunasan berikutnya. |
| `TS-05` | Satu kejadian kas/pembelian/utang | Integrasi DB transaksional + API | `FX-MONEY`; transfer, belanja dari uang pegangan/pribadi/kredit, pembayaran bertahap, supplier advance dan kas langsung Owner; inject failure di tiap penulisan transaksi. | Atomic commit atau rollback penuh; satu kejadian satu efek; penerimaan informasional tidak menjadi saldo/stok/biaya; pembayaran utang tidak menambah biaya kedua. | Receipt, ledger dan saldo sebelum/sesudah, audit, fault point dan hasil rollback. |
| `TS-06` | Pemeriksaan klaim, koreksi, alokasi dan laporan biaya | Integrasi DB + unit + report compare | `FX-MONEY`, `FX-ALLOC`; review approve/reject, batch dokumen lengkap/tidak lengkap, koreksi posted via reversal, laporan sebelum/sesudah alokasi. | Claim reject tidak menghapus kenyataan uang keluar; posting hanya dokumen sah; nilai posted immutable kecuali reversal beralasan; allocation/snapshot tepat; tidak ada alokasi paksa. | Event/audit, versi dokumen tiap item, ledger, hasil laporan dan rekonsiliasi total. |
| `TS-07` | Gaji, kasbon dan upah terpisah per ABK | Integrasi DB + unit + E2E | `FX-PAY`; cairkan sebelum gaji, finalize, potong nol/sebagian/penuh, bayar, job terpisah, dua ABK dan dua periode. | Pilihan Owner dibatasi hak/saldo, bukan otomatis maksimum; sisa kasbon tetap pada orang/periode berikut; slip/job/kas/biaya tidak ganda; pembayaran nonnegatif. | Slip dan ledger per orang, saldo loan/payable sebelum/sesudah, bukti operation ID/retry. |
| `TS-08` | Recording DAILY bersama | DB transaksional concurrency + E2E dua perangkat | `FX-DAILY`; create bersamaan, dua koreksi dengan expected version sama, response hilang/retry, D+1, perubahan cutoff/mode, grant dicabut. | Tepat satu rekap efektif per cycle+tanggal; koreksi mengganti bukan menjumlah; stale edit conflict; actor/version terjaga; tidak ada efek kas, biaya, stok atau menunggu approval. | Timeline request/version/receipt, record efektif & revision history, ledger diff kosong, tampilan conflict. |
| `TS-09` | OFF, sampling dan ketiadaan metrik palsu | Unit + integrasi + E2E | Mode OFF; DAILY dengan input kosong, nol terkonfirmasi, sampel 25 ekor/30 kg, hari GAP dan data historis. | OFF tidak menciptakan recording; sampling 30/25 = 1,2 kg/ekor bila sah; kosong/GAP beda dari nol; tidak menyatakan FCR/IP/ABW panen atau performa lengkap. | Payload, kalkulasi/unit, state dashboard dan proof transaksi finansial berjalan tanpa recording. |
| `TS-10` | Offline, konflik, antrean dan idempotensi | Perangkat/browser E2E + API/DB | Putus jaringan, simpan draft/command, retry payload/ID sama 5x serta paralel, lalu ID sama dengan payload bisnis berubah; restart, 1.000 command teks, queue 7 hari, lease 72 jam usulan (OFF-09), transfer offline dua perangkat (OFF-16), expiry/capture-only (OFF-17), ganti akun/revoke. | Tidak ada sukses lokal palsu; antrean tahan restart, identitas asal terjaga; retry satu receipt/efek dan hash berubah ditolak tanpa menimpa receipt lama; lease habis mengunci data bisnis; capture-only tidak membaca cache atau membuat command; sync memeriksa izin/version terbaru. | Video/log interaksi berlabel, queue/receipt diff, state setelah restart, izin dan umur antrean. |
| `TS-11` | Receipt, lampiran, tombstone dan restore | Integrasi + bucket privat + drill restore terisolasi | `FX-RESTORE`, `FX-FILES`; commit-response hilang, ack lalu restore mundur, file pending/missing, revoke sesudah backup, epoch berubah. | Receipt lama dipakai atau status review tahan lama; tidak ada pembayaran/efek fisik kedua; file missing tetap ditandai tanpa menghapus transaksi; grant revoke tidak hidup lagi; recovery unresolved tetap unresolved. | Runbook dan timestamp drill, titik backup/epoch, rekonsiliasi hash/relasi/saldo, file access log dan receipt/tombstone. |
| `TS-12` | Akun, reset dan recovery Owner | API/security + E2E | Dua Owner; reset ABK, password sementara expired/reused, ganti username, device hilang, recovery dan transfer primary owner paralel. | ID actor/histori/saldo tetap; secret sekali pakai tidak masuk log/export; password lama tidak terbaca; sesi/queue lama tidak mewarisi hak; username bukan bukti kewenangan. | Audit event teredaksi, hasil percobaan izin, session revoke dan state akun/owner. |
| `TS-13` | Ekspor, snapshot, file dan background job | Integrasi DB + job/worker + bucket + security | Tenant ACTIVE/READ_ONLY; data berubah saat ekspor; worker mati setelah hasil tersimpan; grant dicabut sebelum unduh; lampiran pending/missing. | Paket satu snapshot konsisten; total/ID/relasi/hash cocok; file status dicantumkan; CSV formula di-escape; download privat berizin; retry job aman. | Manifest/hash, rekonsiliasi laporan-paket, job receipts/log retry, uji URL dan inventaris file. |
| `TS-14` | Settlement aktual, coverage dan kunci periode | Unit + integrasi DB + E2E | `FX-MONEY`, settlement payout-only/RHPP, expense belum teralokasi, biaya tercakup settlement, lock dengan item pending, bayar utang setelah lock. | Payout notice bukan kas; payout-only bukan laba final; biaya net dikurangi coverage hanya sekali; lock menjelaskan blocker; selesai fisik bukan lock; pelunasan setelah lock tidak mengubah biaya. | Perhitungan rekonsiliasi, status coverage, checklist lock, saldo/biaya sebelum-sesudah. |
| `TS-15` | E2E alur R1 dan pagar fitur R2 | Browser/perangkat E2E semua role | FL-01–FL-10; jalur mulai sebelum DOC dan tengah siklus; OFF/DAILY, belanja, pay, settlement, close, recovery. Periksa semua menu/tautan/action pada role R1. | Tugas R1 selesai tanpa field/menu/foreign key/grant dummy R2; OFF tetap dapat jalan; R2 tidak pernah menjadi prasyarat atau tampil seolah aktif; status tiap state jujur dan label singkat. | Catatan langkah dan versi aplikasi, bukti layar tiap keadaan kritis, daftar menu/route yang dicoba dan hasil akses server. |
| `TS-16` | Aksesibilitas, responsif, keterbacaan, dan kesesuaian visual | Manual assistive tech + automated audit pendamping + perbandingan screenshot | `UT-38`–`UT-49`; keypad angka, lembar dan baris buka-tutup; kesesuaian visual 390×844 terhadap `design/stitch/*/reference-390-*.png` menurut [FRONTEND_DESIGN_SPEC §11](FRONTEND_DESIGN_SPEC.md#fd11) dengan fixture §11.2; risiko kontras §10.2; viewport 320/360/390/768/1280 CSS px, zoom 200%, keyboard HP, screen reader, modal, paste/angka Indonesia, forced colors, reduced motion, no blur. | Tidak ada horizontal scroll halaman utama; field/error/action tidak tertutup. Cek kontras komposit: teks normal ≥4,5:1, teks besar ≥3:1, fokus/kontrol ≥3:1; target sentuh minimal 44×44 CSS px (target utama 48×48 usulan). Label/form/status dapat dipakai tanpa warna/kaca; koma desimal/paste ambigu tidak diubah diam-diam. | Checklist perangkat/browser/AT dan versi, hasil tiap viewport, angka contrast checker dari komposit ter-render, bukti visual fokus/kontras; bukan screenshot saja. |
| `TS-17` | Kinerja, stabilitas dan observability | Load/API/perangkat + operasional | Fixture NFR-03: 50 tenant × 10 kandang × 4 bangunan, total 1 juta efek finansial/recording, 100 sesi aktif; Android RAM 3 GB dan profil jaringan dicatat. | Laporkan p95 read <500 ms, mutation sederhana <800 ms di luar internet/upload, error <1%, LCP ≤2,5 detik pada profil terukur; request ID/latency/failure/queue age/conflict/backup dapat ditelusuri tanpa secret di log. Target adalah usulan, kegagalan memblokir klaim kapasitas. | Data generator/seed, spesifikasi perangkat/jaringan, raw run dan ringkasan statistik, contoh log teredaksi. |
| `TS-18` | UAT dan baseline pilot R1 | Persiapan sebelum pilot memakai fixture sintetis; lalu **satu siklus lapangan hanya setelah otorisasi eksplisit** | Sebelum otorisasi: validasi protokol/tugas dan baseline cara lama tanpa mengklaim manfaat produk; gunakan data uji sintetis. Sesudah otorisasi: Owner + beberapa ABK satu kandang menjalankan satu siklus yang disetujui; sampel kejadian diverifikasi independen dan beban diukur. | Sebelum pilot hanya membuktikan kesiapan prosedur, bukan keberhasilan adopsi. AC-86 dan keputusan adopsi tetap pending sampai siklus terotorisasi selesai; catat penyelesaian, salah paham, waktu, koreksi, bukti, umur review, hambatan per peran dan keputusan lanjut. | Persetujuan pilot yang eksplisit, cakupan/siklus, protokol dan baseline, bukti teknis prerelease, log observasi teranonimkan, rekonsiliasi sampel, daftar kegagalan dan keputusan. |
| `TS-19` | R2 inventory, nilai stok dan event ekonomi | **R2 saja**, DB transaksional + property | `FX-R2`; GOLD-03/04/18 usage/19/21/22 dan AC-18/20/66/67/72–75. | Inventory/consumption hanya setelah diaktifkan; nilai moving average/delta/retur deterministik, tidak ada stok negatif atau repricing diam-diam; stale approval/locked period menolak atomik. | Stock/ledger replay dari event yang diacak, delta trail, audit approval/period lock. Jangan jalankan di gate R1. |
| `TS-20` | R2 panen dan metrik produksi | **R2 saja**, unit + integrasi | `FX-R2`; GOLD-08/09/17, AC-32–35/61. | Rumus MET persis PRD; weighted age/biomassa benar; unknown dan selisih tak terjelaskan tidak menjadi nol; afkir/panen/mortalitas tidak dihitung ganda. | Fixture mentah, intermediate formula, hasil presisi sebelum format, lineage dan status kelengkapan. Jangan jalankan di gate R1. |
| `TS-21` | R2 kontrak, estimasi, sumber data | **R2 saja**, unit + integrasi + security | `FX-R2`; GOLD-10/11/26, AC-36–40/59/62/70/85. | Boundary pakai raw value dan rule version; konfigurasi tidak valid/unsupported ditolak/manual, bukan nol; tenant/master tidak silang; estimasi tidak diposting dan incomplete berlabel. | Konfigurasi sintetis, run input/output/version, boundary dan tenant test. Jangan jalankan di gate R1. |
| `TS-22` | R2 buku pribadi dan offset owner | **R2 saja**, DB/security | `FX-R2`; GOLD-13 bagian pribadi/GOLD-15, AC-27, AC-28 bagian private. | Tidak ada pair tersembunyi R1; saat R2 disetujui, buku usaha/pribadi dan kewajiban owner direkonsiliasi sesuai aturan tanpa biaya/penerimaan ganda. | Ledger terpisah dan uji scope/data; jangan seed/aktifkan pada gate R1. |
| `TS-23` | **R1** — Kompatibilitas migrasi & client lama | Integrasi upgrade + E2E | DB/client versi N dan N-1 dengan draft, queue, IDs, revisions dan schema lama; migrasi sukses/gagal/cancel. | Migrasi mempertahankan data/operation ID atau berhenti aman dengan `update-required`; tidak posting ulang, tidak kehilangan draft, tidak membuka menu R2 atau melemahkan auth. | Snapshot sebelum/sesudah, checksum/row count, log migrasi dan hasil retry client lama. |
| `TS-24` | R2 peran PPL/task/operasi tertunda | **R2 saja**, API/security + E2E | `FX-R2`; grant lintas farm sah, revoke, field/file/export, task dan visit. | Hanya ruang yang diizinkan tampil; field uang/nota/private tetap tertutup; revoked grant tidak lagi mengakses; task tanpa rate tidak menambah upah. | Request/response dan storage scope tests. Ditunda sesuai gate R2 AC-02/03/52/53/69. |

### 3.1 Petunjuk menjalankan suite

1. Pastikan dokumen keputusan, stack dan environment uji sudah disepakati; baca seluruh aturan PRD yang dirujuk, bukan hanya deskripsi matrix. Ambil commit aplikasi dan konfigurasi yang diuji.
2. Buat tenant/akun/file sintetis dengan fixture di §2. Reset seed dan jam; pastikan data tidak bercampur dengan uji lain.
3. Jalankan tes unit terlebih dahulu, lalu integrasi transaksi nyata, security/API, offline/perangkat, restore, aksesibilitas/kinerja dan UAT sesuai suite. Catat versi runner serta perintah nyata.
4. Pada uji concurrency, jadwalkan kedua aksi agar benar-benar overlap pada dua sesi/koneksi; jangan menjalankan berurutan lalu menyebutnya paralel. Injeksi crash tepat sebelum/sesudah commit dan simpan titiknya.
5. Simpan bukti per oracle: jumlah baris/effect/receipt, query saldo, response, audit, revision/version, checksum file, konfigurasi perangkat, dan video/screenshot hanya bila membantu menunjukkan state. Samarkan akun dan hapus token.
6. Ulangi seluruh test yang gagal setelah bug diperbaiki, plus tes regresi ID yang sama dan suite terkait. Hasil lama tetap tercatat gagal; jangan ditimpa.

## 4. Pemetaan kriteria penerimaan PRD §29

Setiap baris di tabel ini adalah satu **Acuan** asli. Gate dan perilaku mengikuti PRD §29.2; `Campuran` menandai batas rilis yang dinyatakan PRD, bukan kategori baru. Kolom Suite memberi langkah dan bukti lengkap pada katalog §3.

| Acuan | Gate | Suite | Uji ringkas dan oracle yang perlu dibuktikan |
|---|---|---|---|
| AC-01 | R1 | TS-02 | Coba GET/update/export/file milik tenant B sebagai A: tolak tanpa payload/resource B di setiap permukaan. |
| AC-02 | R2 | TS-24 | PPL lintas farm hanya melihat grant sah; field harga/gaji/private tidak terkirim. Tertunda, jangan aktifkan di R1. |
| AC-03 | R2 | TS-24 | Cabut grant PPL; request/notifikasi berikut ditolak, histori tetap. Tertunda. |
| AC-04 | R1 | TS-02 | Nonaktifkan tenant; baca/export sesuai kebijakan, mutasi ditolak, data tidak dihapus. |
| AC-05 | R1 | TS-03 | Dua request mengambil satu slot kandang bersamaan; tepat satu berhasil. |
| AC-06 | R1 | TS-03 | Aktivasi siklus paralel kedua ditolak atomik; setelah fisik selesai siklus baru boleh aktif meski keuangan lama terbuka. |
| AC-07 | R1 | TS-03, TS-04 | DOC 6.500 dari kapasitas 7.000; populasi/kapasitas tetap benar. Alokasi bangunan diketahui + unallocated tepat total, tanpa bangunan/prorata palsu; `PENDING` R1 boleh bila unknown. |
| AC-08 | R1 | TS-05 | Biaya masa kosong tersimpan tanpa dipaksa ke periode lama/baru. |
| AC-09 | R1 | TS-05 | Jalankan GOLD-01; transfer/belanja/pengembalian cocok pada kas dan expense tanpa transfer menjadi biaya. |
| AC-10 | R1 | TS-06 | Reject klasifikasi klaim; pengeluaran aktual tetap terlihat sampai rekonsiliasi dan tidak memotong gaji otomatis. |
| AC-11 | R1 | TS-05 | Reimbursement/kredit GOLD-02 dan dua pembayaran parsial mengurangi utang, bukan biaya dua kali. |
| AC-12 | R1 | TS-05, TS-14 | Approved tapi belum dibayar: biaya dan utang ada, cash movement belum ada. |
| AC-13 | R1 | TS-05 | Owner bayar toko langsung; tidak membuat kas pegangan ABK fiktif. |
| AC-14 | R1 | TS-05 | Advance tanpa barang bukan stok/expense; penerimaan menautkan advance tepat sekali. |
| AC-15 | R1 | TS-06 | Edit nilai posted ditolak; reversal+replacement beralasan menghasilkan histori dan total benar. |
| AC-16 | R1 | TS-05 | Invoice 100, bayar 110 tanpa klasifikasi ditolak; kelebihan harus advance/piutang eksplisit. |
| AC-17 | R1 | TS-01 | GOLD-07: Rp2 pada 26/26/26/22 menghasilkan 1/1/0/0, semua nonnegatif; residu ikut urutan tersimpan. |
| AC-18 | R2 | TS-19 | Stok, transfer lokasi dan consumption GOLD-03/04; biaya hanya consumption dan stok tidak negatif. Tertunda. |
| AC-19 | Campuran: R1 unit/konversi tanpa stok; R2 SKU inventory | TS-01, TS-09, TS-19 | R1 uji unit recording/penerimaan terverifikasi dan tidak butuh saldo; SKU gas/inventory baru pada R2. |
| AC-20 | R2 | TS-19 | Selisih opname tidak mengubah saldo sebelum adjustment Owner; jejak tersimpan. Tertunda. |
| AC-21 | Campuran: snapshot histori R1; consumption/kontrak R2 | TS-05, TS-07, TS-08, TS-19 | Ubah master nama/harga/username, histori purchase/pay/recording mempertahankan snapshot/actor; bagian consumption/contract R2 ditahan. |
| AC-22 | R1 | TS-07 | GOLD-05: slip gaji Rp3 juta, job Rp200 ribu terpisah; laporan Rp3,2 juta. |
| AC-23 | R1 | TS-07 | GOLD-06: potongan pilihan Owner, bayar tidak negatif, posisi bersih negatif berlabel sisa kasbon; tidak potong job otomatis. |
| AC-24 | R1 | TS-07 | Retry kasbon application dengan ID sama; satu application dan saldo loan/payable konsisten. |
| AC-25 | R1 | TS-07 | Satu gerak uang dialokasikan ke gaji/job, dokumen terpisah dan kas keluar hanya sekali. |
| AC-26 | R1 | TS-07, TS-02 | Arsip karyawan nonaktif; hutang/upah masih Owner selesaikan, login tak memberi akses baru. |
| AC-27 | R2 | TS-22 | GOLD-15 pinjaman Owner pribadi lewat payroll dan kewajiban usaha; tertunda bersama buku pribadi. |
| AC-28 | Campuran: modal/prive sisi usaha R1; private finance R2 | TS-05, TS-02, TS-22 | GOLD-13 hanya modal/prive usaha di R1; user tak berizin tak dapat private data; buku pribadi R2 tidak boleh terbentuk di R1. |
| AC-29 | Campuran: OFF R1; contract kosong R2 | TS-09, TS-21 | Recording OFF tetap boleh belanja dan metrik unavailable; kontrak kosong diuji hanya bila mesin R2 diaktifkan. |
| AC-30 | R2 | TS-20 | Rekap cumulative/detail overlap GOLD-16 tidak double count; sumber authoritative jelas. Tertunda. |
| AC-31 | Campuran: DAILY sampling R1; panen/performa R2 | TS-09, TS-20 | R1 sampel 25/30 → 1,2 kg/ekor, unavailable bila input kurang; jangan klaim panen/FCR/IP. Metrik lengkap R2 tertunda. |
| AC-32 | R2 | TS-20 | Panen dua DO/tiket dua bangunan, heads sum, asal dan populasi sekali. Tertunda. |
| AC-33 | R2 | TS-20 | Bobot asal unknown tidak dibagi prorata seolah aktual. Tertunda. |
| AC-34 | R2 | TS-20 | Afkir terjual dibedakan dari mortality; panen habis bukan deplesi 100%. Tertunda. |
| AC-35 | R2 | TS-20 | GOLD-08/09: deplesi, ABW, FCR, weighted age, biomassa dan IP sesuai rumus. Tertunda. |
| AC-36 | R2 | TS-21 | Overlap/gap/dependency/unit salah memblokir publish kecuali gap policy eksplisit. Tertunda. |
| AC-37 | R2 | TS-21 | GOLD-10 boundary lookup memakai raw value dan basis kontrak tersimpan. Tertunda. |
| AC-38 | R2 | TS-21 | Missing bonus/potongan basis menandai konfigurasi incomplete; setelah lengkap GOLD-11 tepat. Tertunda. |
| AC-39 | R2 | TS-21 | Versi engine berubah tidak mengubah run lama; rerun menjadi run baru. Tertunda. |
| AC-40 | R2 | TS-21 | Input wajib estimasi belum ada → subtotal incomplete, tidak posting/tidak sebut laba pasti. Tertunda. |
| AC-41 | R1 | TS-14 | GOLD-12: settlement/tabungan/utang/payout menghasilkan income/cash/profit aktual tepat; sapronak tak dikurangi dua kali. |
| AC-42 | R1 | TS-14 | Net payout dan status “Awaiting” boleh dicatat unreconciled; bukan final income atau bukti uang sudah cair. |
| AC-43 | R1 | TS-14 | Periode financial locked, bayar invoice: kas/utang berubah, snapshot biaya tetap. |
| AC-44 | R1 | TS-10, TS-14 | Draft offline datang sesudah lock; usulan koreksi, bukan silent post atau dibuang. |
| AC-45 | R1 | TS-10, TS-11 | Belanja/foto saat offline, restart: draft/antrian ada pada user sama dan status lokal akurat. |
| AC-46 | Campuran: retry/recording R1; stok concurrency R2 | TS-08, TS-10, TS-19 | R1 payload sama 5x/koreksi dua ABK menghasilkan satu efek dan version conflict; concurrency stok GOLD-14 hanya R2. |
| AC-47 | R1 | TS-08, TS-10 | Dua edit versi sama; server menerima satu, menolak stale dengan konflik, bukan last-write-wins. |
| AC-48 | R1 | TS-02, TS-10 | Logout/ganti tenant lalu baca cache; data tenant/user lain tidak tampak dan queue terkunci, tidak dibuang. |
| AC-49 | R1 | TS-10 | Lease >72 jam, revoked role, storage penuh; perilaku aman sesuai sebab, tanpa indikator tersimpan palsu. |
| AC-50 | R1 | TS-11 | Teks sukses, foto gagal; retry foto menaut bukti yang sama tanpa dokumen baru. |
| AC-51 | R1 | TS-23 | Update app saat antrean lama: ID/draft bertahan atau safe `update-required`, tidak hilang/ganda. |
| AC-52 | R2 | TS-24 | Visit PPL membedakan pengunjung/pencatat tanpa konfirmasi palsu. Tertunda. |
| AC-53 | R2 | TS-24 | Task selesai tanpa rate tidak menambah utang upah otomatis. Tertunda. |
| AC-54 | R1 | TS-13 | Report dan ekspor filter sama memiliki total/scope sama; CSV injection di-escape dan file privat. |
| AC-55 | R1 | TS-02, TS-13 | Retry notification terdedupe, grant revoke tak menerima lagi, nominal pribadi tidak bocor. |
| AC-56 | R1 | TS-15, TS-16 | GOAL-01/02 dan NFR-09 pada dashboard HP; bukti tugas dan aksesibilitas, bukan screenshot desktop saja. |
| AC-57 | R1 | TS-11, TS-13 | Restart API/worker dan backup-restore; tidak ganda, restore usable serta hasil/target terukur. |
| AC-58 | R1 | TS-17 | Jalankan dataset NFR-03; p95/error sesuai target atau catat blocker kapasitas. |
| AC-59 | R2 | TS-21 | Estimasi farm A/B tidak memakai kontrak/master harga tenant lain. Tertunda. |
| AC-60 | Campuran: hasil aktual/coverage R1; estimasi lengkap tidak diaktifkan | TS-14 | Biaya belum dialokasi/gaji belum final → hasil berlabel sementara dan komponen kurang; bukan laba lengkap. |
| AC-61 | R2 | TS-20 | GOLD-17: kehilangan sah memberi survival 96,5% sesuai definisi, bukan ayam hidup. Tertunda. |
| AC-62 | R2 | TS-21 | Sumber dipilih dari lineage/cutoff sah, bukan upload terbaru; FCR basis eksplisit. Tertunda. |
| AC-63 | R1 | TS-10 | Commit/response hilang; retry paralel/setelah restart 7 hari menghasilkan satu receipt/efek dan izin terkini dicek. |
| AC-64 | R1 | TS-06 | Rejected claim direkonsiliasi ke state yang sah; terminal claim tidak bisa approve ulang. |
| AC-65 | R1 | TS-14 | Lock memberi blocker actionable; hutang final/kasbon bukan blocker; tidak meminta approval recording/stok di R1. |
| AC-66 | Campuran: coverage biaya R1; consumption gas GOLD-18 R2 | TS-14, TS-19 | Rp1 juta biaya, Rp400 ribu ditanggung net PT → pengurang laba Rp600 ribu; reimbursement bukan coverage. Pemakaian gas R2. |
| AC-67 | R2 | TS-19 | Opening kuantitas saja; cost pending, backfill sekali tanpa repricing historis. Tertunda. |
| AC-68 | R1 | TS-14 | Payout notice, net settlement dan uang diterima: kas/piutang/penghasilan berbeda; classification pending memblokir final income. |
| AC-69 | R2 | TS-24 | PPL hanya `PPL_VISIBLE` pada grant sah; field uang/nota ditutup pada API/file/export. Tertunda. |
| AC-70 | R2 | TS-21 | Enum/predicate/source metric unsupported ditolak atau manual; tidak ada expression bebas/fallback nol. Tertunda. |
| AC-71 | R1 | TS-05, TS-10 | Crash sebelum commit → rollback; commit + revoke → replay aman/ack minimal; client tidak membuat command baru untuk outcome unknown. |
| AC-72 | R2 | TS-19 | Permutasi event ekonomi GOLD-21 memberi biaya/stok final sama; stale sementara dan lock menolak. Tertunda. |
| AC-73 | R2 | TS-19 | GOLD-22 receipt revisi/return memakai delta net efektif, qty tidak ganda, retry aman. Tertunda. |
| AC-74 | R2 | TS-19 | Late receipt lintas periode locked/pool berubah menolak approve stale/parsial; reopen semua periode dan replay. Tertunda. |
| AC-75 | R2 | TS-19 | Timestamp ambigu/unknown/negative stock → BLOCKED/null beralasan, bukan urutan upload/nol. Tertunda. |
| AC-76 | R1 | TS-10, TS-05 | Transfer offline dua perangkat dan belanja child sebelum parent; satu movement kanonis, parent disahkan dulu, revoke/lock menyisakan review. |
| AC-77 | R1 | TS-10 | Lease habis: capture-only tak baca cache/saldo/posting, identitas asal dan tenant tidak bisa diubah, konversi sekali; storage fail bukan sukses. |
| AC-78 | R1 | TS-04, TS-07 | Opening hari ke-18 cocok coverage/payable setelah kasbon/pembayaran terdahulu; tidak biaya/cash ganda; tanggal unknown tidak dipalsukan. |
| AC-79 | R1 | TS-06 | Batch campuran: hanya dokumen lengkap/versi ditinjau diposting atomik per item; hasil parsial jelas, nota susulan tidak duplikasi. |
| AC-80 | R1 | TS-05, TS-02 | GOLD-25: talangan Owner tercatat sebagai utang/kontribusi usaha yang dipilih, tanpa buku/pair pribadi; pelunasan bukan biaya kedua. |
| AC-81 | R1 | TS-12 | Recovery/transfer Owner paralel; hanya satu primary, sesi/queue lama tidak mewarisi akses, audit ada, tidak impersonate/admin read-all. |
| AC-82 | R1 | TS-13 | ACTIVE/READ_ONLY export konsisten meski data berubah; total/ID/relasi/hash cocok, lampiran pending tercantum, revoke/secret/private/tenant lain aman. |
| AC-83 | R1 | TS-11 | GOLD-27: restore mundur, antrean/file parsial/revoke; epoch/review/replay aman tanpa uang/akses ganda; ukur RPO/RTO, jangan klaim bila unknown. |
| AC-84 | R1 | TS-15 | Uji OFF → financial close; R2 tetap nonaktif dan tidak tampil sebagai fitur siap pakai; selesai fisik bukan LOCKED, net-only REVIEW dan cycle berikut bisa mulai. |
| AC-85 | R2 | TS-21 | Tanpa fixture/jalur input sah/tier eksplisit, estimasi incomplete/nonaktif; GOLD-26 hanya setelah gate R2. Tertunda. |
| AC-86 | R1 | TS-18 | UAT dan pilot, sampel rekonsiliasi + baseline GOAL-07–10; laporkan semua hasil/beban/gagal, tanpa klaim dari screenshot/unit. |
| AC-87 | R1 | TS-09, TS-05 | OFF tetap melayani belanja/gaji/hasil aktual; tidak memerlukan recording/stock; unavailable bukan FCR nol. |
| AC-88 | R1 | TS-08 | Rekap DAILY global langsung berlaku setelah server validasi; satu key cycle+date, edit/retry tidak menjumlah dan tanpa biaya/stock. |
| AC-89 | R1 | TS-08, TS-09 | GAP/partial/cutoff terlihat, histori utuh, tak dianggap metrik final dan tak menghambat transaksi finansial independen. |
| AC-90 | R1 | TS-02, TS-03 | A+B aktif pada K; assignment K lain eksplisit; recording bersama tampak namun kas/gaji/kasbon pribadi tidak bocor. |
| AC-91 | R1 | TS-02, TS-10 | Cabut/pindah A; queue/hak/histori tetap milik A, B tidak berubah, rekap bersama dan author asal terjaga. |
| AC-92 | R1 | TS-02, TS-05 | Owner menerima barang mitra dan input langsung; ABK membelanjakan operasional; actor/source/scope benar dan hak tak meluas. |
| AC-93 | R1 | TS-12 | Reset/ubah username; ID/histori tetap, password lama tak dapat dibaca, secret sekali/expired/reuse ditolak, reauth wajib, sesi dicabut. |
| AC-94 | R1 | TS-12 | Aktivasi Owner terverifikasi tanpa email wajib; password sementara sekali, online, ganti sebelum bisnis; username saja bukan bukti, secret tidak tercatat. |
| AC-95 | R1 | TS-03, TS-04 | Sebelum DOC, lewati tim/gaji; belanja persiapan bertahan saat sumber kas dilengkapi; DOC aktual mengaktifkan tanpa setup ulang. |
| AC-96 | R1 | TS-05 | Gas disahkan → biaya sekali, bayar utang bukan biaya; tak ada stok/pemakaian/sisa; durable equipment bukan expense otomatis. |
| AC-97 | R1 | TS-05, TS-11 | Belanja tanpa lampiran/alasan tetap bisa jika field inti sah; bukti susulan taut klaim yang sama tanpa efek biaya. |
| AC-98 | R1 | TS-07 | Kasbon tanpa agreement; gaji lebih kecil; pilihan potongan nol/sebagian/penuh sah; sisa melintasi periode tanpa reissue/konversi paksa. |
| AC-99 | R1 | TS-15 | Rekomendasi sesuai role/keadaan OFF/DAILY, label jelas; tidak tebak nominal/auto-approve/tampilkan pemakaian. |
| AC-100 | R1 | TS-01 | Pecahan IDR ditolak, persen desimal tidak terpotong, hitung presisi, alokasi nonnegatif dan total tepat, unit kuantitas terjaga. |

## 5. Pemetaan seluruh contoh GOLD PRD §28

R1/R2 mengikuti daftar golden gate §29.2. `GOLD-18` satu ID dengan dua scope/oracle berbeda; baris tunggal ini **tidak** berarti inventory R2 wajib lulus agar R1 rilis.

| Acuan | Gate | Suite | Fixture / uji dan oracle utama |
|---|---|---|---|
| GOLD-01 | R1 | TS-05 | Kas 2 jt, transfer 1 jt, klaim gas 300 rb, disetujui, kembali 200 rb: kas akhir 1,7 jt, pegangan 500 rb, biaya 300 rb. |
| GOLD-02 | R1 | TS-05 | Solar reimbursement 150 rb → utang 150 rb, bayar 100+50 rb tanpa biaya kedua; peralatan kredit 400 rb jadi utang, bukan biaya otomatis. |
| GOLD-03 | R2 | TS-19 | 20 unit @200 rb; konsumsi lintas periode 12/8 unit menghasilkan biaya 2,4 jt/1,6 jt, total 4 jt. Tertunda. |
| GOLD-04 | R2 | TS-19 | Moving average: 10@100 rb +10@120 rb → rate 110 rb; pakai 5 jadi biaya 550 rb; perubahan master tak mengubah issue. Tertunda. |
| GOLD-05 | R1 | TS-07 | Kasbon 1 jt sebelum gaji 3 jt, potong 1 jt, bayar 2 jt, job 200 rb terpisah: total kas keluar 3,2 jt, expense 3,2 jt dua baris. |
| GOLD-06 | R1 | TS-07 | Kasbon 1,8 jt/gaji 1,5 jt; potong pilihan 0/0,5/1,5 jt; jangan bayar negatif/auto-offset job; saldo sisa benar ke periode berikut. |
| GOLD-07 | R1 | TS-01 | 1.000.001 dibagi 3 → 333.334/333.334/333.333; Rp2 pada 26/26/26/22 → 1/1/0/0; parsial tetap unallocated. |
| GOLD-08 | R2 | TS-20 | Deplesi 2%, survival 98%, ABW 2 kg, FCR 1,5, IP presisi 373,333…; panen habis bukan deplesi 100%. Tertunda. |
| GOLD-09 | R2 | TS-20 | Umur rata-rata tertimbang 30,4 hari; biomass 6.000 kg, FCR berjalan 1,5; tanpa sample output unavailable. Tertunda. |
| GOLD-10 | R2 | TS-21 | Boundary `[1,5;2,0)`/`[2,0;∞)`, basis per tiket 81,9 jt vs basis periode 80 jt; raw 1,999 tak berubah oleh display rounding. Tertunda. |
| GOLD-11 | R2 | TS-21 | Bonus/potongan mengikuti input dan urutan sintetis; missing basis/config bukan nol. Tertunda. |
| GOLD-12 | R1 | TS-14 | Income kemitraan 50 jt, tabungan 5 jt, pokok utang lama 2 jt → kas due 43 jt; bayar 20+23 jt, income sampingan 2 jt, biaya luar settlement 12 jt → laba manajerial 40 jt, bukan 33 jt; sapronak tidak dikurangkan lagi. |
| GOLD-13 | Campuran: sisi usaha R1; buku pribadi R2 | TS-05, TS-22 | R1 pindah modal 5 jt → kas/kontribusi +5 jt dan income 0; prive 500 rb → kas −500 rb, biaya 0. Pair buku pribadi R2 tertunda. |
| GOLD-14 | R1 | TS-10 | Retry ID `op-demo-001`, gas Rp100 rb sebanyak 5x → satu dokumen/efek; payload Rp200 rb dengan ID sama memberi mismatch; late claim periode locked masuk review. Stok contention 7 dari 10 unit hanya R2. |
| GOLD-15 | R2 | TS-22 | Pinjaman Owner pribadi dipotong gaji; hutang usaha tetap hingga dibayar, tanpa income/expense tambahan. Tertunda. |
| GOLD-16 | R2 | TS-20 | Summary/detail overlap memakai satu sumber authoritative, bukan double count. Tertunda. |
| GOLD-17 | R2 | TS-20 | Lost nonpanen dan kelas panen campuran; survival/IP mengikuti sumber dan definisi sah. Tertunda. |
| GOLD-18 | Campuran: coverage R1; gas/persediaan R2 | TS-14, TS-19 | Gate R1: gas biaya Rp1 jt, coverage net PT Rp400 rb → biaya tetap 1 jt, di luar settlement 600 rb; reimbursement +400 rb bukan coverage, maka tetap 1 jt di luar. Gate R2 terpisah: isi gas 200 rb, konsumsi 0,60/0,40 unit bernilai 120/80 rb; koreksi nilai jadi 220 rb memberi delta 12/8 rb tanpa kuantitas baru. |
| GOLD-19 | R2 | TS-19 | Stok opening kuantitas tanpa nilai; biaya pending/backfill sekali tanpa repricing historis. Tertunda. |
| GOLD-20 | R1 | TS-14 | Payout notice dibanding uang masuk; status piutang/kas/penghasilan tidak disatukan. |
| GOLD-21 | R2 | TS-19 | Permutasi upload event ekonomi memberi final stock/biaya sama dan temporary status menahan lock. Tertunda. |
| GOLD-22 | R2 | TS-19 | Revisi harga dan retur setelah valuasi memberi delta efektif saja, quantity dan cost tepat. Tertunda. |
| GOLD-23 | R1 | TS-05, TS-10 | Transfer offline dua perangkat dan pembelian child; satu movement kanonis, saldo owner 1 jt, ABK 700 rb, expense 300 rb. |
| GOLD-24 | R1 | TS-04, TS-07 | Opening hari 18: hak 3 jt, kasbon apply 500 rb, bayar lama 1 jt, payable 1,5 jt; opening bukan cash/biaya baru. |
| GOLD-25 | R1 | TS-05 | Talangan Owner dari uang luar: expense/utang 600 rb, kas usaha tak berubah; bayar 400 rb mengurangi hutang, bukan expense; tanpa buku pribadi. |
| GOLD-26 | R2 | TS-21 | Tier seluruh volume: 10.000 kg × 20 rb = 200 jt; tanpa mode tier/config sah ditolak, bukan assumed marginal. Tertunda. |
| GOLD-27 | R1 | TS-11 | Ack pembayaran 100 rb lalu restore mundur: `RESTORE_REVIEW_REQUIRED`; jangan buat pembayaran kedua; setelah rekonsiliasi kas 900 rb, biaya 100 rb satu kali. |
| GOLD-28 | R1 | TS-08 | A submit DAILY 100/2, B revisi 95/3; effective value bukan penjumlahan; retry receipt lama, D+D1 115 kg/4 mati, tanpa efek finansial/stok. |
| GOLD-29 | R1 | TS-02, TS-07, TS-10 | Saldo kasbon/reimbursement/pegangan/gaji A dan B terpisah; cabut A tak mengalihkan histori/queue/operation ID ke B. |
| GOLD-30 | R1 | TS-05, TS-06 | Penerimaan DOC/pakan informasional; claim gas 300 rb dan listrik 150 rb/jasa 200 rb hanya diposting sekali setelah review; tanpa inventory/usage; durable equipment bukan expense otomatis. |

## 6. Pemetaan seluruh skenario UX/UI UT-01–UT-49

Semua UT adalah alur R1 yang direncanakan, dan dipetakan satu per satu. Jika sebuah UT menyebut tidak adanya menu/stok/R2, itu diuji sebagai pagar R1, bukan tes penerimaan fitur R2.

| Acuan | Gate | Suite | Tugas dan oracle ringkas |
|---|---|---|---|
| UT-01 | R1 | TS-02 | ABK buka assignment sendiri; URL kandang lain tidak memberi data. |
| UT-02 | R1 | TS-03 | Banyak ABK satu kandang; multi-kandang hanya tenant Owner sama lewat assignment eksplisit. |
| UT-03 | R1 | TS-02, TS-10 | Revoke tidak hapus histori/memindah saldo/hak/queue ke ABK baru. |
| UT-04 | R1 | TS-03 | Provision Owner terverifikasi, aktivasi/ganti password online; setup opsional dan DRAFT sampai DOC valid; biaya persiapan boleh disimpan tanpa siklus/populasi palsu. |
| UT-05 | R1 | TS-04 | Mulai tengah siklus; DOC aktual dulu, cutoff/coverage parsial tampil, histori tak dicipta. |
| UT-06 | R1 | TS-09, TS-14 | OFF: finansial/periode tetap jalan tanpa recording/panen dummy. |
| UT-07 | R1 | TS-08 | DAILY minta pakan/mati/afkir/sampling per kandang-tanggal, tanpa paksa bangunan. |
| UT-08 | R1 | TS-09 | Kosong beda dari nol; 25 ekor/30 kg memberi ABW sampling 1,2 kg; no sample bukan 0 kg. |
| UT-09 | R1 | TS-08 | Owner/ABK melihat satu rekap per cycle+date dan author/waktu yang benar. |
| UT-10 | R1 | TS-08 | Koreksi 100→90 menghasilkan satu nilai efektif 90 dan riwayat before/after. |
| UT-11 | R1 | TS-08, TS-10 | Dua edit offline tidak merge/jumlah/timpa otomatis; tampilkan server version serta draft lokal. |
| UT-12 | R1 | TS-08 | Validasi server langsung berlaku tanpa approval Owner; invalid tidak tampil bersama. |
| UT-13 | R1 | TS-08, TS-09 | GAP/zero/tanggal kejadian/kirim dan cutoff mode; late sync tidak menghapus/mengirim diam-diam lintas mode. |
| UT-14 | R1 | TS-08 | Owner/ABK berizin koreksi; korektor dan revision history kekal. |
| UT-15 | R1 | TS-08, TS-09 | Feed DAILY dan penerimaan pakan tidak mengubah uang, expense, stock atau usage. |
| UT-16 | R1 | TS-05, TS-10 | Transfer Owner-cash satu kali meski counterpart ABK mencatat penerimaan. |
| UT-17 | R1 | TS-05, TS-06 | Listrik/jasa dan barang tidak dibatasi whitelist; hanya perlakuan Owner sah yang mem-post expense, penerimaan tidak duplikasi. |
| UT-18 | R1 | TS-05, TS-15 | Owner input online langsung tanpa mengajukan/menyetujui klaim dirinya sendiri. |
| UT-19 | R1 | TS-05, TS-11 | ABK kirim tanpa foto/alasan; claim tetap review Owner. |
| UT-20 | R1 | TS-06 | Batch Owner hanya mem-post item lengkap/reviewed; item versi berubah pending; hasil parsial per item dan retry aman. |
| UT-21 | R1 | TS-05, TS-11 | Uang pribadi/kas/toko/unknown ditampilkan beda; nota susulan tertaut klaim sama. |
| UT-22 | R1 | TS-05 | Durable equipment bukan biaya habis otomatis; tidak ada janji register aset R1. |
| UT-23 | R1 | TS-07 | Gaji, kasbon, upah dan kas pegangan per orang terpisah. |
| UT-24 | R1 | TS-07 | Kasbon tanpa agreement/melebihi gaji; Owner pilih nol/sebagian/penuh; sisa lintas cycle dan tak ada bayar negatif. |
| UT-25 | R1 | TS-07 | Pembayaran fisik sama dibagi ke gaji/upah tanpa kas keluar ganda. |
| UT-26 | R1 | TS-14 | RHPP lengkap berbeda dengan payout saja; payout tidak disebut hasil/laba lengkap. |
| UT-27 | R1 | TS-14 | Coverage belum cukup → data kurang/alasan, bukan Rp0 atau nilai karangan. |
| UT-28 | R1 | TS-04, TS-14 | Selesai fisik beda dari lock; hutang/kasbon tak memblokir, payment setelah lock tak mengubah expense, cycle baru boleh dimulai. |
| UT-29 | R1 | TS-10, TS-11 | Retry/ack/restore tidak membuat kas fisik atau posting dua kali. |
| UT-30 | R1 | TS-10 | Storage penuh/gagal tidak memberi label tersimpan; teks tetap dapat dipulihkan dari form saat sesi. |
| UT-31 | R1 | TS-10 | Putus-sambung/restart queue utuh; lease expired cache terkunci; capture-only tanpa data bisnis, konversi sekali tenant asal; 72 jam usulan diuji. |
| UT-32 | R1 | TS-10, TS-12 | Akun/assignment perlu online; logout/ganti akun tak membuka queue user sebelumnya. |
| UT-33 | R1 | TS-12 | Reset ABK tanpa email; secret sekali, password lama tak terbuka, ganti password wajib, sesi revoke. |
| UT-34 | R1 | TS-12, TS-02 | Recovery sah; admin/support tidak dapat impersonate ABK atau membuka tenant lain. |
| UT-35 | R1 | TS-13 | PDF/CSV/paket privat, scope terbatas, coverage dan batas “bukan restore” terlihat. |
| UT-36 | R1 | TS-02, TS-12 | Owner lain tidak dapat melihat, reset credential atau memindah assignment staf. |
| UT-37 | R1 | TS-09, TS-15 | Pakan recording tak mengurangi stok/biaya; menu gas usage/opname/stock tidak ada. |
| UT-38 | R1 | TS-15, TS-16 | Label utama/helper singkat dan jelas untuk Data Kandang, Tim Kandang, Catat Belanja, DOC/Pakan Masuk. |
| UT-39 | R1 | TS-01, TS-16 | Unit benar, IDR tanpa pecahan, persen ≤2 desimal, input panjang terbaca. |
| UT-40 | R1 | TS-16 | Mode glass/solid/reduced effects/forced colors/no blur semuanya tetap usable. |
| UT-41 | R1 | TS-16 | Kontras komposit saat scroll, status text dan focus tampak; bukan sekadar token. |
| UT-42 | R1 | TS-16 | Viewport 320/360/390/768/1280, zoom 200%, keyboard tidak menutup field/error/action. |
| UT-43 | R1 | TS-15, TS-16 | Keyboard/screen reader/modal/paste dan semua state; tutorial opsional; deep link berizin, `READ_ONLY` tanpa mutasi. |
| UT-44 | R1 | TS-01, TS-16 | Keypad angka: `000`/hapus, `Rp` dan ejaan nominal tepat; koma kuantitas, −/+ ekor; Keyboard HP, paste, keyboard fisik, TalkBack/VoiceOver bekerja; field teks/password tetap keyboard HP; tidak ada angka terisi dari kebiasaan. |
| UT-45 | R1 | TS-15, TS-16 | Terima/Kembalikan Uang, Beri Uang Kas, input per tab Recording, dan koreksi satu nilai selesai di lembar tanpa pindah halaman; Catat Belanja di satu halaman fokus lalu kembali ke layar asal (K-39); kembali menutup lembar atau halaman fokus dan menjaga draf; refresh/tautan membuka keadaan sama sesuai izin; satu lembar aktif. |
| UT-46 | R1 | TS-06, TS-15, TS-16 | Baris tertutup memuat nominal/status/pencatat; buka-tutup di tempat dengan `aria-expanded`; bukukan dari baris hanya setelah pratinjau dampak, bukan geser; posisi gulir tetap. |
| UT-47 | R1 | TS-03, TS-15, TS-18 | Satu saran utama + maksimal dua pendamping dari data nyata dengan alasan; Catat selalu ada; urutan setup bebas kecuali dependensi beralasan; Nanti tidak muncul ulang tanpa kejadian relevan; tanpa pop-up, poin, streak. |
| UT-48 | R1 | TS-09, TS-15, TS-18 | Saran keperluan, Hari ini/Kemarin, rata-rata sampling, cek mirip, dan angka tidak biasa hanya membantu; nominal/kuantitas/sumber tidak terisi, tidak ada kirim/bukukan otomatis. |
| UT-49 | R1 | TS-15, TS-16, TS-18 | Semua label mengikuti glosarium; istilah internal tidak tampil; bantuan ≤1 kalimat; error menyebut kejadian, keamanan data, dan langkah; uji klik pertama untuk uang kas/belanja/kasbon/upah. |

## 7. Alur end-to-end dan urutan eksekusi

Suite berikut menyatukan alur teks FL sebagai tugas ujung ke ujung. Pemetaan ini hanya menautkan perilaku, bukan menambahkan persyaratan bisnis baru.

| Alur sumber | Skenario tugas | Suite utama |
|---|---|---|
| FL-01 | Owner masuk, setup singkat, lanjut sebelum DOC; atau mulai periode berjalan hari ke-18. | TS-03, TS-04, TS-12, TS-15 |
| FL-02 | Owner mencatat DOC/pakan aktual; ABK tidak memperoleh hak penerimaan Owner atau inventory. | TS-03, TS-04, TS-05, TS-09 |
| FL-03 | Buat dua akun ABK, assignment, cabut/pindahkan salah satu sambil orang lain tetap bekerja. | TS-02, TS-03, TS-10, TS-12 |
| FL-04 | A mencatat, B mengoreksi DAILY global dengan versi stale/retry; ulangi OFF. | TS-08, TS-09, TS-10 |
| FL-05 | Owner menyerahkan kas, ABK mengakui, retry/offline, kembalikan dana; satu movement. | TS-05, TS-10 |
| FL-06 | Belanja tanpa nota/foto, mati sinyal, retry foto; Owner review satu/batch dokumen campuran. | TS-05, TS-06, TS-10, TS-11 |
| FL-07 | Kasbon sebelum gaji, gaji lebih kecil, pilihan potongan, upah job terpisah. | TS-07 |
| FL-08 | Catat RHPP detail atau payout-only; bedakan notice, kas aktual, piutang, income dan coverage. | TS-14 |
| FL-09 | Selesai fisik, periode berikut mulai, blocker final lock; bayar hutang setelah lock. | TS-04, TS-14 |
| FL-10 | Queue offline/restart/lease/revoke, receipt/lampiran parsial, ekspor/recovery. | TS-10, TS-11, TS-12, TS-13 |

Jalankan berurutan: (1) pemeriksaan seed dan unit `TS-01`; (2) transaksi/isolasi dan concurrency `TS-02`–`TS-09`; (3) offline, file, restore, identitas dan ekspor `TS-10`–`TS-13`; (4) settlement/mobile, accessibility, kinerja `TS-14`–`TS-17`; (5) migrasi client lama `TS-23`; lalu evaluasi gerbang teknis prerelease di §9. Hanya setelah gerbang itu lulus dan otorisasi pilot tercatat, lakukan bagian lapangan `TS-18`. `TS-19`–`TS-22` dan `TS-24` **jangan** dijalankan pada gate R1. Persiapan suite R2 tidak berarti aktivasi fitur R2.

## 8. UAT dan baseline pilot yang direncanakan

Bagian lapangan UAT/pilot **bukan prasyarat untuk masuk ke gerbang otorisasi pilot**. Sebelum otorisasi, pelaksana boleh melatih protokol dengan fixture sintetis dan merekam baseline cara lama yang diperlukan; jangan masukkan transaksi usaha nyata tanpa izin. Sesudah lulus prerelease teknis, hanya Owner/pemilik berwenang yang dapat memberi otorisasi eksplisit untuk satu siklus lapangan dengan tenant/kandang, peserta, cakupan, batas waktu, cara dukungan/recovery, privasi/bukti dan kriteria penghentian yang tercatat. Tanpa otorisasi, jangan mulai pilot finansial nyata.

Dalam siklus yang sudah diotorisasi, UAT dilakukan Owner dengan beberapa ABK pada kandang yang sama, mengikuti batas izin dan data. Catat tugas tanpa mengarahkan pengguna ke tombol tertentu; amati apakah mereka memahami perbedaan `Di HP`, `Terkirim`, `Diterima server`, dan `Dibukukan`. Jalur mulai sebelum DOC prioritas; jalur tengah siklus diuji sekunder. Bukti lapangan dan keputusan adopsi satu siklus baru melengkapi AC-86 di tahap akhir, bukan di awal atau dengan screenshot.

Tugas wajib: mulai sebelum DOC dan lewati setup opsional; masukkan DOC aktual; dua ABK mencatat/koreksi rekap yang sama; transaksi belanja tanpa bukti dan putus-sambung; cek kas dibukukan versus klaim; kasbon tanpa gaji lalu payroll lebih kecil; reset akun tanpa email; pembelian sederhana tanpa pencatatan usage; catat payout saja atau RHPP lengkap; tutup fisik namun biarkan kewajiban terbuka; cari dan unduh ekspor privat; pulihkan queue sesudah restart/lease/revoke. Sertakan satu jalur gagal/invalid dan satu pengguna yang tidak paham istilah awal agar beban bantuan terlihat.

| Baseline / target usulan dari PRD | Cara ukur | Batas klaim |
|---|---|---|
| GOAL-07: waktu rekonsiliasi kas dan penyelesaian gaji dibanding cara lama; sasaran awal pengurangan waktu kas ≥30%. | Ambil baseline dan hasil tugas yang sebanding; ukur durasi, jumlah koreksi dan klaim belum selesai. Simpan rentang, peserta dan cara pencatatan. | Sasaran awal, bukan janji tercapai; jangan ubah baseline setelah melihat hasil. |
| GOAL-08: kelengkapan berdasarkan sampel independen yang diverifikasi Owner; sasaran awal ≥90% kejadian sampel tercatat lokal dalam 24 jam. | Pisahkan waktu kejadian, tersimpan lokal, diterima server dan direview. Queue offline belum tersedia bagi Owner sampai sync. | Denominator adalah sampel kejadian nyata/terverifikasi yang diizinkan, bukan jumlah baris app. |
| GOAL-09: sasaran awal ≥90% pengajuan lengkap direview dalam 48 jam sejak diterima server. | Lapor umur pengajuan lengkap dan tidak lengkap; ukur penggunaan ulang pada hari ada aktivitas dan alasan kembali ke catatan lama. | Jangan keluarkan klaim tidak lengkap/terlambat dari laporan; jangan mulai jam saat offline lokal. |
| GOAL-10: keputusan lanjut pilot dengan baseline/hasil, masalah setiap peran, kesediaan Owner dan perbaikan wajib. | Tulis keputusan lanjut/iterasi/tidak lanjut dan alasan; setiap kegagalan serta perubahan scope tersimpan. | Siklus selesai atau tes teknis lulus tidak otomatis menyatakan produk sukses. |

## 9. Definisi hasil, bukti dan gerbang lulus

| Status | Aturan penggunaan |
|---|---|
| `LULUS` | Semua oracle yang diwajibkan suite terverifikasi di lapisan yang disyaratkan; lampirkan hasil nyata yang dapat diulang. |
| `GAGAL` | Satu oracle wajib salah, ada kebocoran/efek ganda/data hilang, hasil tidak deterministik, atau bukti memperlihatkan regresi. Catat bug/risiko; jangan mengecualikan run. |
| `TERHALANG` | Belum dapat dijalankan karena environment, akses, keputusan atau dependency tak tersedia. Sebutkan tepat apa yang menghalangi dan bukti percobaan. Tidak sama dengan lulus. |
| `DILEWATI` | Hanya untuk bagian memang di luar gate rilis saat ini (mis. suite R2 di rilis R1), alasan dan pemilik keputusan tercatat. Jangan gunakan untuk AC/GOLD/UT gate R1. |
| `PENDING PILOT` | Hanya status sementara bagian lapangan AC-86 di tahap A/B. Bukan lulus/gagal/skip; wajib ditutup oleh bukti satu siklus pada tahap C dan tetap dihitung dalam denominator 72 AC. |
| `BELUM DIJALANKAN` | Status awal semua baris dokumen ini. Tidak menyiratkan pass, blocked, atau ketersediaan implementasi. |

Gerbang berjalan dalam tiga tahap terpisah; **jangan gabungkan label kesiapan teknis dengan persetujuan pilot atau keputusan adopsi**.

| Tahap | Syarat dan hasil | Yang belum boleh diklaim |
|---|---|---|
| **A — Kesiapan teknis prerelease** | Sebelum pilot finansial, luluskan 71 AC teknis R1 selain AC-86, seluruh 17 GOLD R1 (GOLD-18 coverage saja), seluruh 49 UT R1, suite integrasi/security/offline/file/ekspor/migrasi/kinerja yang gate-nya R1, NFR relevan, serta drill `TS-11`/restore. Selesaikan juga persiapan non-lapangan `TS-18`: protokol pilot, izin/batas bukti, dan baseline cara lama; latihan sistem tetap sintetis. Tidak boleh ada blocker keamanan, isolasi tenant, uang/recording ganda, kehilangan data, atau bukti kurang. Target NFR-06 restore harus diukur terhadap RPO ≤15 menit dan RTO ≤8 jam; catat hasil nyata. | Bukan “seluruh R1 diterima”, bukan adopsi/pilot lulus, dan bukan izin otomatis memakai data finansial nyata. **AC-86 berstatus `PENDING PILOT` untuk bagian lapangan**, tidak dihitung lulus dan tidak dihitung sebagai kegagalan prerelease. Kesiapan protokol/baseline saja tidak menutup AC-86. |
| **B — Otorisasi pilot eksplisit** | Setelah A lulus, minta dan catat keputusan `OTORISASI PILOT` dari Owner/pemilik produk berwenang, termasuk tenant/kandang dan satu siklus, peserta/izin data, periode, kontak penghentian, cara bantuan/recovery dan bukti. Otorisasi adalah keputusan terpisah, tidak diasumsikan dari hasil tes, dokumen rencana atau role akun. | Tanpa keputusan tercatat, jangan mulai pilot nyata. Otorisasi bukan kelulusan produk, bukan pengesampingan gate teknis, dan bukan keputusan lanjut adopsi. |
| **C — Hasil akhir satu siklus dan adopsi (AC-86)** | Jalankan siklus lapangan yang diotorisasi; rekonsiliasi sampel dan baseline GOAL-07–10, catat beban/kegagalan semua peran, umur review dan keputusan lanjut/iterasi/tidak lanjut. Lengkapi AC-86 **hanya setelah** bukti satu siklus diperiksa dan keputusan akhir dicatat. | Jangan menyebut R1 diterima penuh sebelum C selesai. Satu siklus yang lewat atau semua tes teknis lulus tidak otomatis menyatakan produk berhasil/adopsi layak. |

Jadi, gerbang A mengeluarkan **kandidat teknis untuk pertimbangan pilot**, bukan “R1 lulus”. Selama A, AC-86 harus tampil `PENDING PILOT` dan tidak menjadi syarat sirkular untuk memperoleh otorisasi pilot; otorisasi B diberikan setelah seluruh pengaman teknis/security/restore sebelum pilot telah dibuktikan. Sesudah B, status AC-86 tetap pending hingga C. Gate akhir R1 baru lulus jika semua 72 AC R1 (termasuk AC-86), 17 GOLD gate R1, seluruh 43 UT yang berlaku, tidak ada blocker, serta bukti lintas-lapisan diselesaikan. Hitung status tanpa menghilangkan denominator: pada A, nyatakan `71/72 AC teknis lulus; AC-86 PENDING PILOT`, bukan `72/72` atau `R1 diterima`.

Untuk setiap tahap, `TERHALANG` pada persyaratan tahap itu, `DILEWATI` tanpa dasar, bukti yang tak memadai, atau masalah tersembunyi berarti tahap belum lulus. ID R2 boleh dilewati hanya sebagai R2 dan bukan alasan mengaktifkan fitur tersebut. NFR-07 menuntut golden/invariant tanpa selisih rupiah di luar pembulatan yang dinyatakan.

RPO ≤15 menit dan RTO ≤8 jam pada NFR-06 adalah **sasaran usulan pilot**, bukan capaian yang diukur/terbukti atau SLA. Drill di tahap A harus mengukur dan melaporkan nilai aktual serta menunjukkan rekonsiliasi; hasil unknown/tidak memenuhi target berarti prerelease belum lulus. Data local-only tidak termasuk RPO server. Hosting, biaya, retensi, prosedur dan persetujuan sebelum data finansial produksi tetap ditinjau sebelum otorisasi.

## 10. Larangan jalan pintas untuk agent pelaksana

1. Jangan mengubah oracle, angka fixture atau expected output hanya agar bug terlihat lulus. Perubahan bisnis memerlukan keputusan dan revisi requirement yang sah, bukan edit tes lokal.
2. Jangan mengganti DB/lock/file/auth nyata dengan mock lalu menyebut bukti concurrency, tenant isolation, restore atau akses file lulus. Mock hanya untuk lapisan unit yang memang sesuai.
3. Jangan menghapus test case, menandai `skip`, atau mengurangi denominator saat ada gagal/unknown. Catat status dan alasan; gate tetap merah/belum lulus.
4. Jangan membuat fitur R2 aktif, menambah menu placeholder, foreign key wajib, fixture kontrak/stok, atau membuat dashboard bergantung R2 demi memudahkan tes R1. Uji pagar nonaktif secara eksplisit.
5. Jangan memakai screenshot palsu, fixture buatan tanpa label, video historis, atau hasil generator sebagai bukti runtime. Simpan tanggal, commit, environment dan data uji; bukti visual harus berasal dari build yang sedang diuji.
6. Jangan membuktikan transaksi dari satu angka tampilan. Bandingkan command/receipt, ledger/event sumber, proyeksi, saldo, audit, dan bila terkait file: hash/status serta otorisasi download.
7. Jangan “membersihkan” audit/log, memindahkan transaksi ke actor lain, menghapus queue, atau reset data setelah kegagalan sebelum snapshot bukti dibuat. Data uji boleh direset setelah bukti diamankan dan identitas sintetis dipastikan.
8. Jangan menyebut target usulan NFR/GOAL sebagai hasil/komitmen sebelum benchmark/UAT dan persetujuan pemiliknya.

## 11. Template laporan pelaksanaan

Salin template ini untuk satu run; isi nilai faktual, link bukti privat yang aman dan hash/commit. Jangan mengisi angka pass dari rencana ini. Bila tidak ada implementasi, biarkan `BELUM DIJALANKAN`.

```markdown
# Laporan tes — [rilis / build]

- Status keseluruhan: BELUM DIJALANKAN | GAGAL | TERHALANG | PENDING PILOT | LULUS
- Tahap: kesiapan teknis prerelease A | otorisasi pilot B | hasil siklus/adopsi C
- Commit/build, tanggal, environment dan runner:
- Versi seed/clock/zona waktu:
- Perangkat/browser/DB/storage yang dipakai:
- Cakupan rilis dan keputusan aktivasi R2:
- AC gate akhir: lulus __/72, gagal __, terhalang __, PENDING PILOT __, belum __
- Tahap A teknis: lulus __/71 AC teknis; dari denominator akhir 72, AC-86 bagian lapangan: PENDING PILOT (jangan hitung sebagai lulus atau blocker teknis A)
- AC R2/fitur tertunda: lulus __/28, gagal __, terhalang __, belum __ (jika gate R2 sedang diuji)
- GOLD gate: lulus __/17, gagal __, terhalang __, belum __; GOLD-18: coverage R1 [status]
- GOLD R2: lulus __/14, gagal __, terhalang __, belum __; GOLD-18: oracle gas/persediaan R2 [status] (jika gate R2 diuji)
- UT gate: lulus __/49, gagal __, terhalang __, belum __
- Suite wajib: TS-01 [status/bukti], ...
- R2: daftar suite/ID DILEWATI beserta alasan (bukan hasil lulus)
- NFR: nilai aktual, unit, metode dan target usulan pembanding:
- Restore drill: RPO aktual / RTO aktual / kehilangan unknown / rekonsiliasi:
- UAT baseline: peserta sintetis/berizin, denominator, hasil GOAL-07–10:
- Otorisasi B: pemberi wewenang, tanggal, tenant/kandang, siklus yang diizinkan, batas data/peserta dan mekanisme berhenti:
- C satu siklus: status AC-86, rekonsiliasi sampel, hasil GOAL-07–10, keputusan adopsi/iterasi/tidak lanjut:
- Bug / blocker / temuan keamanan / data hilang:
- Bukti privat terlampir: log, snapshot, hash, foto/video; lokasi dan redaksi:
- Penilaian gate: LULUS | BELUM LULUS; alasan:
- Pemeriksa/persetujuan dan tanggal:
```

## 12. Sumber dan batas dokumen

- [PRD.md](PRD.md) §28 memberi golden oracle; §29 dan khususnya §29.1–29.2 memberi matriks/gate dan jenis pengujian. PRD v0.5 tetap sumber aturan uang, recording, offline, rilis dan izin.
- [UX_UI_SPEC.md](UX_UI_SPEC.md#ux17) memiliki tepat 49 UT dan inventaris layar R1; dokumen ini menautkan satu per satu tanpa menyatakan layar pernah diuji.
- [UX_FLOWS_WIREFRAMES.md](UX_FLOWS_WIREFRAMES.md#flow02) memberi FL-01–FL-10 dan urutan tugas; sketsa teks bukan hasil usability.
- [ARCHITECTURE.md](ARCHITECTURE.md#arch14) memberi rencana pembuktian DB nyata, idempotensi, role, cache, jobs, file, recovery serta NFR; bukan implementasi yang sudah lulus.
- Perubahan implementasi, kebutuhan, framework tes, stack atau environment harus didokumentasikan pada dokumen pelaksanaan yang tepat; tidak mengubah scope ini otomatis.

Rencana ini tidak menjalankan tes, menyatakan gate produksi lulus, memilih stack, menetapkan SLA, atau memberi izin aktivasi/implementasi. Sebelum dipakai pada data finansial produksi, keputusan bisnis/keamanan terbuka, persetujuan UAT, kesiapan backup/restore dan akses uji harus ditinjau oleh pemilik yang berwenang.

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Rencana test suite dan fixture sintetis; traceability individual 100 AC, 30 GOLD, 43 UT; gate R1/R2 dan bukti pelaksanaan; belum ada tes yang dijalankan. |
| 0.2 | 23 September 2026 | Menambah UT-44–UT-49 dari audit kemudahan (keypad angka, kerja di tempat, baris buka-tutup, arahan bebas, bantuan pintar, bahasa) sehingga gate UX R1 menjadi 49 UT; belum ada tes yang dijalankan. |
| 0.3 | 23 September 2026 | TS-16 menambah pemeriksaan kesesuaian visual terhadap mockup final K-39 dan risiko kontras yang tercatat; UT-45 disesuaikan dengan halaman fokus Catat Belanja dan lembar per tab Recording. Jumlah UT tetap 49. |

