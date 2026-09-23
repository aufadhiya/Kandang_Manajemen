# Arsitektur Sistem — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.1 — rancangan awal arsitektur R1 |
| Tanggal | 23 September 2026 |
| Sumber bisnis | [PRD v0.5](PRD.md), terutama bagian 4, 6, 9, 22, dan 25–27 |
| Sumber perilaku | [UX/UI v0.2](UX_UI_SPEC.md) dan [Alur & Wireframe Teks v0.1](UX_FLOWS_WIREFRAMES.md) |
| Status | Draft untuk ditinjau; pilihan teknologi, layanan, biaya, serta rincian keamanan belum disetujui |
| Fase | Perencanaan `.md` saja menurut [PLANNING.md](PLANNING.md); bukan izin membuat mockup, prototype, atau aplikasi |
| Batas bukti | Belum ada implementasi, benchmark, uji keamanan, uji perangkat, atau pemulihan sistem dari dokumen ini |

## Daftar isi

1. [Tujuan, istilah, dan kedudukan dokumen](#arch01)
2. [Kebutuhan pengarah dan batas R1](#arch02)
3. [Bentuk sistem dan batas kepercayaan](#arch03)
4. [Tanggung jawab modul](#arch04)
5. [Dependensi dan aliran data utama](#arch05)
6. [Satu kejadian, satu pembukuan yang sah](#arch06)
7. [Status, angka, dan laporan](#arch07)
8. [Pencatatan lokal dan sinkronisasi](#arch08)
9. [Pemisahan usaha, akun, dan izin](#arch09)
10. [Lampiran, pekerjaan latar, dan ekspor](#arch10)
11. [Operasional, perubahan versi, dan pemulihan](#arch11)
12. [Opsi teknologi dan biaya](#arch12)
13. [Pertumbuhan tanpa membebani R1](#arch13)
14. [Peta verifikasi arsitektur](#arch14)
15. [Keputusan terbuka dan handoff](#arch15)
16. [Referensi dan riwayat](#arch16)

<a id="arch01"></a>
## 1. Tujuan, istilah, dan kedudukan dokumen

Rancangan ini menjelaskan **bagian mana mengerjakan apa, data mana yang sah, dan apa yang terjadi ketika pengiriman atau server gagal**. Tujuannya menjaga aplikasi sederhana bagi Owner/ABK tanpa menyederhanakan uang, izin, atau riwayat secara keliru.

PRD tetap sumber makna bisnis. Kata **wajib** di dokumen ini berarti menjaga aturan PRD yang sedang menjadi dasar rancangan, bukan mengubah seluruh default D menjadi keputusan pengguna yang terkonfirmasi. Pilihan teknis baru diberi ID **AT** dan status **usulan**. Keputusan produk K, default D, dan pertanyaan Q tetap dikelola di PRD; dokumen ini tidak menutup Q atau mengganti gate rilis.

| Istilah | Arti dalam rancangan |
|---|---|
| Tenant/ruang usaha | Batas data usaha satu Owner menurut default D-01; bukan kandang atau akun login |
| Backend modular / modular monolith | Satu sistem server, dibagi menurut tanggung jawab; tidak perlu banyak layanan jaringan untuk satu transaksi |
| API | Pintu komunikasi aplikasi dengan server; aktor dan izin tetap diperiksa server |
| Command | Permintaan perubahan tertentu, misalnya mengajukan belanja atau membayar gaji |
| Atomik | Seluruh perubahan satu kejadian berhasil bersama atau tidak terjadi sama sekali |
| Ledger/efek pembukuan | Catatan sah perubahan kas, biaya, hak, dan kewajiban; bukan angka ringkasan yang bebas diedit |
| Receipt operasi | Bukti server tentang hasil sebuah command, bukan nota belanja; memungkinkan kirim ulang tanpa efek ganda |
| Proyeksi | Tampilan/ringkasan turunan dari sumber sah; tidak menjadi sumber saldo baru |
| Outbox dan worker | Daftar pekerjaan yang disimpan bersama transaksi, lalu diproses di latar; misalnya membuat ekspor atau inbox |
| Lease offline | Masa izin membaca/mencatat scope tersimpan di HP, bukan jaminan data selalu terselamatkan |
| Recovery epoch | Penanda generasi pemulihan server agar operasi sebelum restore tidak diposting ulang tanpa pemeriksaan |

Nama modul berikut adalah batas tanggung jawab, **bukan menu baru, nama tabel final, atau perintah membuat folder/kode**. Model dan kontrak logis serta prosedur keamanan diperinci dalam dokumen pendamping pada [§15.2](#arch15); pilihan library/versi dan parameter yang memerlukan ADR tetap belum final.

<a id="arch02"></a>
## 2. Kebutuhan pengarah dan batas R1

| Kebutuhan bisnis | Konsekuensi arsitektur | Sumber |
|---|---|---|
| Owner dapat mulai sebelum DOC tanpa setup panjang | Kandang dan periode persiapan dapat berdiri tanpa gaji, kontrak, stok, atau RHPP; progres diambil dari data yang benar-benar ada | K-31–K-32, ONB-10–ONB-11 |
| Beberapa ABK mencatat bersama dengan akun sendiri | Satu rekap efektif per siklus/tanggal, revisi dan konflik lintas orang/perangkat; uang tetap per orang | K-25–K-26, SEC-15, MOD-07 |
| Recording valid tidak menunggu persetujuan Owner | Jalur recording terpisah dari review/posting uang | REC-14–REC-19, FIN-01, OFF-18 |
| R1 mencatat pembelian barang/jasa, bukan pemakaian rutin | Tidak ada ketergantungan ke stok/valuasi; gas, solar, peralatan, listrik, dan jasa adalah contoh, bukan daftar pembelian yang dibatasi | K-33, CASH-16, INV-17, GOLD-30 |
| Kas, biaya, gaji, kasbon, dan upah berbeda | Dokumen sumber dan efek tertaut; pembayaran tidak otomatis menjadi biaya kedua atau melunasi semua kasbon | K-20–K-22, FIN-01–FIN-13, PAY-01–PAY-15 |
| Owner bebas memilih RHPP lengkap atau pembayaran saja | Pembayaran aktual tidak bergantung mesin kontrak; rincian yang belum diketahui tidak diisi nol atau disebut laba final | K-36, SET-11, COST-11 |
| Sinyal putus-sambung | Penyimpanan lokal sebelum tanda berhasil, antrean beridentitas tetap, revalidasi server, batas izin offline yang jelas | K-10, OFF-01–OFF-18 |
| Akun pribadi tanpa email | Username/password, reset ABK terbatas tenant, pemulihan Owner terverifikasi, actor sebenarnya tetap dicatat | K-37, SEC-13–SEC-16, D-25 |
| Rupiah bulat dan riwayat yang dapat dijelaskan | Aritmetika tepat, alokasi dengan sisa pembulatan, snapshot sumber dan koreksi tertaut | K-35, DATA-05–DATA-08, COST-05 |
| Mudah tumbuh tetapi biaya awal wajar | Backend modular, database transaksional, storage privat, worker; APK/IoT/CCTV tidak dibangun dulu | ARC-01–ARC-08 |

**R1 aktif:** Admin/Owner/ABK; kandang/bangunan/tim; periode dan penerimaan DOC/pakan/sapronak informasional; DAILY opsional; pembelian, kas dan klaim, utang/piutang, biaya/alokasi, gaji/kasbon/upah; modal, prive dan talangan/pinjaman Owner pada sisi usaha; hasil aktual; laporan, paket ekspor, lampiran, audit, inbox, offline, dan pemulihan.

**Tidak menjadi dependensi R1:** stok/pemakaian/valuasi/opname, panen per DO, SUMMARY/DETAIL, FCR/IP atau estimasi kontrak, task/perawatan umum, buku pribadi Owner, Mandor/PPL, OCR/impor, push/APK, billing otomatis, IoT, atau CCTV. ABW sampling dasar DAILY tetap tersedia sesuai PRD; itu bukan performa panen lengkap. Tidak membuat tabel dummy, stok nol, kontrak kosong, atau layanan belum terpakai agar R1 bisa berjalan. Lihat [PRD §4](PRD.md#s04) dan [§25.1](PRD.md#s25).

<a id="arch03"></a>
## 3. Bentuk sistem dan batas kepercayaan

Rancangan mengikuti ARC-01–ARC-05: aplikasi web mobile-first berkomunikasi dengan **satu backend modular**, yang menyimpan transaksi di database relasional. Proses worker boleh terpisah agar ekspor tidak menahan pekerjaan harian, tetapi memakai aturan domain dan versi rilis yang kompatibel; itu bukan pemecahan menjadi microservices.

```text
HP Owner / HP ABK / browser Admin
  Aplikasi web + adapter perangkat
  Cache berizin + draft/antrean lokal terpisah per identitas
                 |
                HTTPS
                 |
  API: sesi, izin, scope, validasi, versi, recovery epoch
                 |
  Modul bisnis + layanan command/transaksi
                 |
  Database: sumber bisnis, efek, revisi, receipt, audit, outbox
                 |
  Worker: inbox, ekspor, pemeriksaan lampiran, pekerjaan ulang aman

  File aplikasi statis: tidak berisi data/rahasia pengguna
  Object storage privat: lampiran dan hasil ekspor
  Backup + manifest/bukti pemulihan: akses terpisah dan terbatas
```

Bagan adalah hubungan logis, bukan seluruh trafik wajib melewati worker. Upload/download lampiran dapat memakai akses storage berumur pendek setelah otorisasi API. Browser tidak boleh mengakses database bisnis atau menjalankan posting langsung, meskipun vendor menyediakan SDK data.

| Batas | Yang boleh dipercaya | Yang harus diperiksa |
|---|---|---|
| HP → API | Sesi yang diverifikasi server; ID operasi sebagai identitas permintaan | Scope, actor, tanggal, versi, nominal, grant, status tenant/periode, dan epoch; payload client bukan bukti izin/pembayaran |
| API → database | Konteks transaksi dan izin yang dibentuk server | Constraint relasi scope, uniqueness, saldo/kewajiban, konkurensi; validasi form saja tidak cukup |
| API/worker → storage | Referensi parent dan izin layanan terbatas | Pemilik file, status pemeriksaan, hak saat akses, ukuran/tipe; nama file atau URL tidak memberi hak |
| Worker → data pengguna | Identitas layanan untuk jenis tugas tertentu | Scope dan izin terkini; pekerjaan lama tidak membawa hak baca permanen |
| Operator → pemulihan | Identitas infrastruktur yang berwenang sesuai prosedur | Pemulihan mesin bukan izin bebas membaca transaksi atau menyamar sebagai Owner |

Server tidak menyimpan file permanen atau sesi hanya di memori satu instance. Restart atau penambahan instance tidak menghilangkan antrean, receipt, atau file. Cache boleh mempercepat baca, tetapi tidak menentukan saldo, hak posting, atau keberhasilan transaksi.

<a id="arch04"></a>
## 4. Tanggung jawab modul

| Modul logis | Memiliki sumber data/tanggung jawab | Batas yang tidak boleh dilanggar | Rujukan |
|---|---|---|---|
| Identitas & layanan usaha | User, kredensial, tenant, membership/grant, sesi, registrasi perangkat, aktivasi/limit dan recovery akun | Admin tidak otomatis membaca buku usaha; pengelolaan akun bukan impersonation; akun dan penugasan berbeda | SEC-01–SEC-16, ONB-04, D-25 |
| Kandang, tim & periode | Kandang/bangunan, pekerja/assignment, status fisik/keuangan, cutoff dan mode recording; penerimaan DOC/pakan/sapronak R1 | Pekerja dapat ada tanpa akun; tidak membuat satu periode per bangunan; penerimaan informasional bukan ledger stok | CYC-01–CYC-11, INV-17, MOD-07 |
| Recording | Rekap DAILY efektif, revisi, pencatat/korektor, sampling, kelengkapan | Tidak menulis kas/biaya/stok; satu `(cycle_id, business_date)`; OFF bukan data nol | REC-10, REC-13–REC-19, OFF-18 |
| Belanja & klaim | Pengajuan, baris pembelian barang/jasa, pembayar/sumber dana, review dan resolusi klaim; input langsung Owner | Klaim ABK perlu review; Owner boleh simpan+approve+post online dalam satu command tanpa antre persetujuan diri sendiri. Teks baru tanpa master wajib dan bukti opsional; penolakan bukan uang kembali | CASH-05–CASH-09, CASH-16, FIN-10–FIN-13 |
| Pembukuan usaha | Akun kas, transfer, efek kas/biaya/hak/kewajiban, modal/prive/talangan Owner sisi usaha, pelunasan, alokasi, saldo awal, koreksi dan hubungan sumber | Satu pintu pembentukan efek sah; tidak mengedit total atau membiarkan modul lain membukukan ulang sumber sama | FIN-01–FIN-12, CASH-01–CASH-15, COST-01–COST-11, MOD-02–MOD-04 |
| Gaji, kasbon & upah | Agreement/finalisasi gaji, kasbon mandiri, pilihan potongan, dokumen upah dan permintaan pembayarannya | Ketiga subdomain terpisah; biaya/pembayaran lewat pembukuan dengan sumber unik; upah bukan komponen slip gaji | PAY-01–PAY-15, GOLD-05–GOLD-06, GOLD-24, GOLD-29 |
| Hasil kemitraan aktual | RHPP manual, klasifikasi komponen, hak net, pemberitahuan dan penerimaan pembayaran, pemadanan/coverage | Tidak membutuhkan kontrak R2; payout-only bukan pendapatan lengkap; matching tidak membuat kas kedua | SET-01–SET-09, SET-11, COST-11, GOLD-20 |
| Laporan & perhatian | Query/proyeksi berizin, kelengkapan, snapshot, filter, inbox dan rekomendasi langkah berdasar keadaan usaha | Tidak memiliki saldo baru atau menulis transaksi lewat hitungan dashboard; prioritas sederhana bukan mesin AI/peraturan bebas | REP-01–REP-19, NOT-01–NOT-08, UX-16 |
| Infrastruktur bersama | Validasi command, receipt, audit, outbox, file, ekspor, adapter platform, versi protokol dan recovery incident | Bukan tempat aturan bisnis tersembunyi; tiap modul tetap menentukan validitas domain dan izin objeknya | FIN-08, FIN-12, OFF-13–OFF-17, NFR-10–NFR-11, ARC-03–ARC-05 |

Pemilik dokumen sumber mengatur siklus hidupnya; modul pembukuan membuat efek melalui layanan internal dalam **transaksi database yang sama**. Contohnya, finalisasi gaji menulis hak gaji dan biaya/kewajiban tertaut bersama-sama, bukan dua request yang bisa hanya separuh berhasil. Laporan membaca sumber/proyeksi yang sudah diotorisasi; tidak menyalin seluruh tabel lalu menyembunyikan field di layar.

Scope dan pemeriksaan izin menjadi tanggung jawab bersama di setiap jalur, bukan hanya modul login. Modul tidak mengubah tabel milik modul lain secara langsung dari controller; orkestrasi lintas modul mempunyai operasi bisnis eksplisit, versi, dan batas transaksi yang akan dirinci dalam `DATA_MODEL.md` dan `API_SYNC_SPEC.md`.

<a id="arch05"></a>
## 5. Dependensi dan aliran data utama

### 5.1 Urutan kesiapan, bukan kewajiban setup panjang

1. Identitas dan ruang usaha menyediakan scope. Kandang/pekerja minimal menjadi referensi sesuai kebutuhan transaksi; tidak semua master wajib diisi di depan.
2. Kandang/periode menyediakan konteks untuk DAILY serta biaya periode. Pembukuan tetap melayani pengeluaran masa persiapan atau di luar periode.
3. Belanja, gaji, kasbon/upah, dan hasil aktual memanggil pembukuan untuk efek yang sah. Kasbon tidak mensyaratkan agreement gaji atau periode.
4. Laporan menggabungkan hasil sesuai izin dan kelengkapan. Keuangan tidak menunggu recording; recording tidak menunggu mesin stok, gaji, atau kontrak.
5. File, audit, receipt dan pekerjaan latar mengikuti transaksi sumber. Tidak ada panggilan ke storage/notifikasi yang harus berhasil agar transaksi uang di database dapat commit.

### 5.2 Perjalanan perubahan data

| Alur | Jalur data dan efek sah | Pengaman |
|---|---|---|
| FL-01–FL-03: mulai, penerimaan, tim | Owner membuat konteks persiapan; aktivasi DOC/mode/assignment online berizin; penerimaan pakan menyimpan informasi, lalu proyeksi operasional minimum tersedia untuk ABK | Satu periode fisik aktif per kandang; banyak ABK; satu anggota berubah tidak mengganti seluruh tim; tidak ada inventory atau gaji wajib |
| FL-04: recording | Draft personal → antrean dengan versi dasar → validasi mode/tanggal/izin → rekap efektif dan revisi/audit/receipt tersimpan bersama | Tidak melewati approval Owner; koreksi menggantikan versi berlaku, tanpa efek stok/uang; transaksi kedua dari versi dasar sama konflik |
| FL-05–FL-06: uang kas/belanja | Catatan kejadian/klaim ABK → pemeriksaan Owner → resolusi dan efek sah. Input langsung Owner dapat simpan+approve+post online sekaligus, tanpa antre persetujuan diri sendiri; efek, receipt dan audit tetap atomik | Uang yang diklaim berpindah belum menjadi saldo terkonfirmasi; kedua pihak atas kejadian sama ditaut ke satu mutasi kanonis. Jalur langsung tetap wajib lulus validasi sumber, versi, saldo dan periode |
| FL-07: kasbon/gaji/upah | Pencairan kasbon membuat kas keluar dan piutang mandiri; finalisasi gaji mengakui biaya/hak; pembayaran dan potongan pilihan Owner mengurangi hak/piutang; upah memakai dokumen sendiri | Pencairan/pelunasan kasbon bukan biaya baru; gaji belum dibayar tidak membuat kas keluar; jangan memotong upah otomatis |
| FL-08: hasil aktual | Pemberitahuan tanpa kas; pembayaran nyata menaikkan kas; bila hak belum diketahui, masuk penerimaan belum dipadankan; verifikasi berikutnya mereklasifikasi dan menghubungkan, bukan menerima uang lagi | Mode input dipilih per kejadian; suspense tidak menjadi income/laba; coverage membatasi pengurangan biaya ganda |
| FL-09: penutupan | Selesai fisik terpisah dari kunci keuangan; modul periode memeriksa gate melalui data belanja, pembukuan, gaji/upah dan settlement dalam titik konsisten | Periode berikut boleh aktif setelah kosong; lock tidak menunggu pelunasan hak/kewajiban yang sudah diakui; perubahan nilai snapshot perlu reopen |
| FL-10: koneksi/akses pulih | Reauth → periksa epoch/izin → rekonsiliasi status operasi → kirim sesuai dependensi atau tahan untuk review | Bukan memutar ulang semua catatan atau menerbitkan ID pengganti untuk operasi yang hasilnya belum diketahui |

Contoh sintetis untuk membedakan jalur: belanja Rp120.000 dari kas pegangan sah hanya membukukan kas keluar Rp120.000 dan biaya Rp120.000 ketika sumber/klasifikasinya diterima. Belanja kredit bernilai sama membentuk biaya dan utang, bukan kas keluar; pembayaran utang berikutnya mengurangi kas dan utang, bukan menambah biaya lagi. Jika peralatan tahan lama, klasifikasinya mengikuti D-05/Q-04, tidak otomatis seluruhnya menjadi biaya periode.

**Dana Owner dalam R1 (CASH-15):** modal bukan pendapatan dan prive bukan biaya. Pinjaman uang langsung dari Owner menaikkan kas usaha dan utang kepada Owner; pembayaran kembali pokok mengurangi kas serta utang, bukan menjadi biaya. Talangan pembelian habis pakai yang diterima/disahkan membentuk biaya dan utang usaha kepada Owner, kecuali Owner memilih kontribusi secara eksplisit; talangan peralatan tetap mengikuti klasifikasi peralatan. Penggantian talangan hanya melunasi utang, bukan biaya kedua. Dana pribadi di luar aplikasi adalah pihak/sumber eksternal, bukan kas usaha fiktif; bila rekening fisik bercampur, saldo kas usaha hanya bagian yang dialokasikan untuk usaha. Semua ini tersedia tanpa buku pribadi atau pasangan transaksi pribadi R2.

<a id="arch06"></a>
## 6. Satu kejadian, satu pembukuan yang sah

### 6.1 Batas transaksi command

Kontrak berikut mempertahankan [PRD §9](PRD.md#s09) dan [§25.3](PRD.md#s25), bukan menetapkan URL API:

**Pisahkan pemeriksaan hasil operasi dari izin melakukan mutasi baru.** Setelah autentikasi, jalur status receipt boleh mencocokkan ruang/jenis/ID operasi dengan receipt milik aktor asli dari sesi server, tanpa mensyaratkan hak baca objek bisnis yang mungkin sudah dicabut. Jalur sempit ini tidak membaca/mengirim isi objek, memperbarui grant, atau menimbulkan efek bisnis. Sesi tidak sah atau aktor lain tidak mendapat informasi keberadaan operasi tersebut.

- Receipt `committed` yang masih ada dan tidak ditahan review dapat dijawab tanpa efek baru, termasuk bila request membawa epoch sebelum restore. Detail hasil hanya boleh diberikan setelah pemeriksaan akses objek terkini; bila akses itu sudah hilang, aktor asli yang masih terautentikasi hanya mendapat `COMMITTED_NO_DETAIL`. Replay dengan payload tetap memeriksa kecocokan hash bisnis.
- Receipt tidak ditemukan bukan alasan mencatat kejadian baru dengan ID baru. Operasi pra-restore yang tidak ditemukan, atau operasi yang berstatus review durable, tetap `RESTORE_REVIEW_REQUIRED` sampai rekonsiliasi. Di luar insiden, lookup yang belum pasti memberi `OUTCOME_UNKNOWN`; retry command dengan ID sama tetap boleh melalui gate mutasi/idempotensi normal, bukan langsung menjalankan efek dari jalur status. Grant/epoch lama tidak dianggap sah karena lookup tidak menemukan hasil.
- Cabang status ini hanya mengembalikan bukti yang diketahui; semua command yang akan membuat efek baru wajib melewati gate mutasi di bawah. Menemukan receipt tidak menggantikan otorisasi data untuk membaca hasil lengkap.

**Jalur mutasi/command baru:**

1. Verifikasi sesi; bentuk actor dari server. Tentukan ruang usaha/pribadi yang benar, jenis operasi, status layanan, dan hak objek. R1 menolak fitur pribadi yang belum aktif.
2. Periksa `request_recovery_epoch` dan status rekonsiliasi durable **sebelum efek mutasi**. Epoch asal tetap provenance; mengganti epoch request tidak membebaskan operasi yang sedang ditahan.
3. Validasi payload bisnis kanonis dan ambil kunci unik receipt `(data_space, command_type, operation_id)`. Key sama/payload sama mengembalikan hasil sebelumnya sesuai izin terkini; hash berbeda ditolak. Sesi/token/epoch request tidak masuk hash bisnis.
4. Untuk operasi baru, dalam satu transaksi: periksa ulang versi/grant/status yang relevan, kuasai record pengendali konkurensi, validasi batas kas/kewajiban/periode, kemudian tulis sumber/resolusi dan seluruh efek terkait.
5. Commit bersama audit, receipt hasil, dan outbox yang dibutuhkan. Balasan berisi status/versi dan referensi sah; bukan sekadar “sukses”. Ketika terjadi rollback, tidak ada separuh efek finansial yang dianggap sudah selesai.

Receipt `processing` untuk ledger sinkron R1 **tidak dicommit sendiri**. Crash sebelum commit me-rollback claim dan efek; request paralel key sama menunggu secara terbatas atau retry ID sama. Response hilang setelah commit diatasi dengan membaca receipt committed, bukan menjalankan pembayaran lagi. Receipt/dedupe bertahan selama sumber masih disimpan; bukan cache dengan TTL pendek.

Jika grant dicabut setelah commit, aktor asli yang masih terautentikasi hanya dapat menerima `COMMITTED_NO_DETAIL` untuk operasinya sendiri tanpa nominal/pihak/objek rahasia. Jika hasil tidak dapat diketahui, pertahankan `OUTCOME_UNKNOWN` beserta ID. Jangan membuat ID baru untuk mengatasi timeout, 401, atau 403. Error terminal dikoreksi melalui operasi/revisi baru yang tertaut, bukan pengiriman tanpa akhir. Lihat FIN-05/FIN-12.

### 6.2 Konkurensi berbeda dari kirim ulang

Idempotensi mencegah **operasi yang sama** dijalankan dua kali. Ia tidak cukup untuk dua operasi berbeda yang mencoba memakai saldo, membayar kewajiban, atau mengubah recording yang sama.

| Perebutan data | Invariant | Mekanisme rancangan yang perlu dibuktikan |
|---|---|---|
| Dua pembelanjaan atas kas sama | Kas terkonfirmasi tidak negatif | Serialisasi pada akun/sumber pengendali saldo, pembacaan saldo dalam transaksi, validasi ulang; bukan membaca total lalu menulis tanpa lock |
| Dua pembayaran/potongan atas hak sama | Total settlement/application tidak melampaui sisa; kasbon tidak diterapkan dua kali | Kunci kewajiban/piutang dan sumber kas yang terkait dengan urutan konsisten; hitung ulang sisa saat commit |
| Dua orang membuat/mengoreksi recording | Satu rekap efektif cycle+date | Constraint key dan expected revision, termasuk create pertama ketika rekap belum ada; pihak kedua mendapat konflik |
| Lock laporan berbarengan belanja/late sync | Snapshot tidak melewatkan transaksi yang baru sah atau mengizinkan biaya baru setelah lock | Posting dan lock berkoordinasi pada versi/status periode; gate dihitung pada transaksi/snapshot konsisten, bukan hanya checklist dari client |
| Aktivasi periode, ubah grant, transfer Owner, atau naikkan jumlah objek | Satu periode aktif, satu primary owner, assignment/limit sah | Constraint, expected version dan serialisasi scope terkait; aksi status dan posting tidak melewati pemeriksaan karena race |
| Dua laporan atas satu serah-terima nyata | Satu mutasi kanonis, semua klaim tertaut | Linkage eksplisit Owner, constraint konversi/resolusi dan efek atomik; nominal sama bukan bukti kejadian sama |

Pilihan row lock, conditional update, atau transaksi serializable per operasi ditetapkan pada model data/ADR. Jika memilih PostgreSQL, `READ COMMITTED` tidak dengan sendirinya mencegah seluruh anomali bisnis; RLS juga bukan pengganti kontrol konkurensi ([referensi](#arch16)). Deadlock/serialization failure harus membatalkan seluruh transaksi, lalu retry terbatas dengan ID sama dan validasi ulang; jangan mengulangi hanya separuh efek.

### 6.3 Koreksi dan batch

- Dokumen posted tidak ditimpa atau dihapus. Reversal/adjustment menaut sumber dan dampaknya; saldo/laporan mengikuti efek sah, histori lama tetap tersedia.
- Klaim belanja ditolak tetap unresolved sampai ada resolusi FIN-11. Penolakan bukan refund, piutang hukuman, atau potong gaji otomatis. Saat dibukukan, pengurang sementara klaim diganti dengan efek sah secara atomik.
- Batch Owner membekukan pilihan, tindakan dan expected versions. Hasil **per dokumen** dengan receipt sendiri; satu dokumen dan semua efeknya atomik, seluruh batch tidak harus berhasil bersamaan. Dokumen berubah/kurang data tetap pending. `APPROVE_AND_POST` bukan bukti sudah membayar invoice kredit (FIN-13).
- Dugaan duplikasi bisnis dengan ID berbeda memerlukan pemeriksaan sumber; tidak menghapus transaksi hanya karena tanggal/nominal sama. Receipt, key efek sumber dan pengecekan duplikasi saling melengkapi.

<a id="arch07"></a>
## 7. Status, angka, dan laporan

### 7.1 Status tidak saling menggantikan

| Dimensi | Sumber sah dan konsekuensi |
|---|---|
| Simpan/sinkron | Commit lokal hanya membuktikan tersimpan di HP; receipt server membuktikan hasil command. Keduanya bukan bukti uang telah dibayar |
| Review | Belanja/upah mengikuti pemeriksaan; recording DAILY valid langsung efektif. Resolusi klaim terpisah dari keputusan review |
| Pembukuan | Efek `POSTED/REVERSED` menentukan buku sah, bukan status foto atau kartu dashboard |
| Pelunasan | Dihitung dari payment/application yang sah; belum diketahui hak net bukan `PAID` atau `UNPAID` buatan |
| Fisik periode | Persiapan/aktif/selesai/batal mengikuti CYC; selesai fisik tidak otomatis mengunci keuangan |
| Keuangan periode | OPEN/REVIEW/LOCKED mengikuti gate CYC-11; pembayaran atas hak/kewajiban yang sudah diakui dapat berlangsung setelah lock tanpa mengubah biaya/penghasilan snapshot |
| Kelengkapan | Cutoff/history coverage, pending claim, klasifikasi settlement dan freshness tetap terbawa ke laporan, walau sebagian transaksi sudah sah |

Late report/koreksi historis setelah selesai fisik mengikuti review dan rentang tanggal CYC-11, bukan mencatat pemeliharaan baru. Late sync ke periode terkunci tidak diterapkan diam-diam; perubahan yang memengaruhi snapshot memerlukan jalur Owner/reopen. Payout-only tidak menahan pekerjaan harian/periode baru, tetapi tidak meluluskan klasifikasi settlement atau lock keuangan yang belum lengkap.

### 7.2 Representasi angka dan histori

- Input nominal IDR adalah rupiah bulat. Server menolak pecahan, bukan memotong diam-diam. Nominal diserialisasi aman sebagai integer/string integer; parser locale UI tidak dipakai sebagai format penyimpanan/API.
- Kuantitas/tarif hingga enam desimal dan intermediate finansial minimal dua belas digit desimal pecahan atau aritmetika tepat setara mengikuti DATA-05. Jangan memakai floating point biner untuk pembukuan. Persentase boleh desimal; format tampilan tidak mengubah nilai input.
- Half-up ke Rp1 pada batas pengakuan; COST-05 mendistribusikan residu alokasi menurut pecahan terbesar dengan urutan tie tersimpan. Bagian belum dialokasikan tetap terlihat, tidak dibagikan paksa sampai 100%.
- Tanggal kejadian, tanggal biaya, tanggal bayar, waktu diterima server, serta periode pembebanan berbeda. Zona waktu IANA kandang menentukan tanggal operasional; waktu HP bukan waktu posting authoritative.
- Unknown memakai `null`, bukan nol. Perubahan nama, tarif, unit, username atau assignment tidak menulis ulang snapshot/histori. Keuangan tetap milik pekerja asal setelah akun dinonaktifkan.

### 7.3 Sumber laporan dan sifat dinamis

Read model awal cukup query terindeks/proyeksi ringan dari database bisnis, bukan data warehouse atau event-sourcing menyeluruh. Saldo resmi berasal dari efek sah. Cache/agregasi turunan dapat dibangun ulang dan membawa waktu/versi data; mutasi dan kelengkapan tidak dinilai dari cache basi. Setelah command sukses, detail menggunakan hasil authoritative; ringkasan yang belum diperbarui tidak boleh menyatakan nilai lama sebagai hasil baru.

Laporan usaha membedakan kas, biaya, klaim pending, hak/kewajiban, dan alokasi. Mengubah alokasi tidak memindahkan uang. `COST-11` memastikan biaya Owner yang sudah mengurangi net settlement tidak dipotong lagi; rincian sapronak PT analitis bukan otomatis cost entry kedua. Paket ekspor dan layar memakai makna/filter/otorisasi sama (REP-14–REP-19).

“Dinamis” di sini berarti aturan sederhana berbasis keadaan: belum ada kandang, persiapan sebelum DOC, review belanja tertunda, mode DAILY aktif, hasil belum lengkap, atau konflik belum selesai. Status diturunkan dari sumber dan dapat dijelaskan; tidak memerlukan AI, formula bebas, task engine, atau otomatis mengisi nominal. Data yang belum terkirim tidak menjadi tuduhan ABK belum bekerja. Rancangan perilaku tetap milik [UX/UI §3](UX_UI_SPEC.md#ux03) dan [dokumen alur](UX_FLOWS_WIREFRAMES.md).

<a id="arch08"></a>
## 8. Pencatatan lokal dan sinkronisasi

### 8.1 Pembagian penyimpanan di HP

| Bagian | Isi dan masa berlaku | Tidak boleh |
|---|---|---|
| Shell aplikasi | Berkas statis untuk membuka aplikasi; versi aset jelas | Menyimpan respons bisnis terautentikasi dalam cache bersama pengguna |
| Cache scope berizin | Proyeksi data sesuai user+tenant+scope, waktu sinkron dan lease | Menganggap cache sebagai izin posting atau menyajikan data akun sebelumnya |
| Draft/antrean | Payload, ID operasi, parent/dependensi, versi dasar, identitas asal dan status pengiriman | Menghapus saat logout/update, mewariskan ke pengganti, atau memindahkan ke tenant lain |
| Lampiran lokal | Bukti baru beserta status file yang terpisah dari dokumen | Menyatakan file tersedia di perangkat lain sebelum upload diterima |
| Capture-only | Catatan baru terbatas setelah lease habis, hanya jika registrasi/local unlock sah | Membuka saldo, daftar pegawai, autocomplete/cache bisnis, approve/post, atau bekerja setelah logout |

Adapter platform memisahkan penyimpanan, jaringan, kamera/file dan notifikasi dari aturan bisnis. Kandidat web adalah IndexedDB; library/strategi kunci lokal belum dipilih. Transaksi lokal menyimpan payload dan operation ID sebelum konfirmasi tersimpan. Jika quota ditolak/penuh, pertahankan form dan laporkan kegagalan; jangan memberi tanda aman palsu.

### 8.2 Jalur kirim dan konflik

1. Login/registrasi awal dan unduh scope perlu online. Lease 72 jam adalah default D-09/Q-06 yang harus diuji, bukan kesepakatan durasi gangguan lapangan.
2. Draft/ajukan belanja, upah, catatan tunai, dan DAILY dalam scope/mode tercache dapat diantrikan selama lease sah. Persetujuan/posting uang, perubahan grant, aktivasi/penutupan/lock periode tetap online.
3. Setelah koneksi pulih, verifikasi sesi/izin/epoch. Kirim dengan ID asal sesuai dependensi, dimulai parent; response batch menyebut hasil tiap operasi. Parent pending tidak dipaksa menjadi saldo sah agar child lolos.
4. Bedakan gangguan sementara yang boleh retry dengan backoff, konflik versi yang perlu dicocokkan, penolakan izin/period lock, dan hasil belum diketahui. Detail error mengikuti PRD §25.3; kontrak rinci nanti di `API_SYNC_SPEC.md`.
5. DAILY memakai expected revision dari rekap bersama, bukan satu rekap per ABK. Create/revisi kedua dari dasar sama mendapat konflik; hanya field/versi yang masih boleh dilihat yang dikirim. Revisi baru mengganti rekap efektif dan mempertahankan author, bukan last-write-wins/penjumlahan.
6. Receipt sukses direkonsiliasi ke antrean; foto pending tetap jalur tersendiri. Sinkron dijalankan saat aplikasi dibuka, koneksi pulih, atau retry manual. Background Sync bukan syarat keberhasilan dan tidak menjamin kirim ketika aplikasi tertutup.

### 8.3 Lease, logout, dan capture-only

Lease habis mengunci pembacaan cache bisnis dan command bisnis baru; antrean lama tetap tersimpan terkunci, bukan dibuang atau otomatis diposting. Capture-only OFF-17 hanya menyimpan waktu, nominal, teks keperluan/pihak dan bukti baru melalui local unlock yang telah disiapkan. Ia bukan sesi Owner/ABK online, tidak memperpanjang izin, dan tidak tersedia setelah logout.

Origin author/device, note ID, dan origin tenant immutable berasal dari registrasi yang pernah diterbitkan server. Registrasi tersebut adalah **bukti asal, bukan grant**. Setelah reauth, server memeriksa registrasi asal, identitas yang sama atau recovery SEC-13 yang sah, dan hak terkini. Konversi memerlukan konfirmasi, hanya ke tenant asal dan kandang yang masih diizinkan, dengan satu konversi efektif per note. Catatan tidak dapat dipindah usaha dengan mengedit tenant pada payload; asal tidak dapat dibuktikan atau grant hilang → recovery-only.

Logout tetap tersedia dengan opsi antrean terkunci pada identitas asal; penghapusan lokal memerlukan konfirmasi risiko. Pencabutan/reset online tidak menjanjikan menghapus cache pada HP yang sedang offline; lease membatasi pemakaian normal aplikasi, bukan mengalahkan akses fisik/perangkat yang telah disusupi. Mekanisme kunci, kehilangan kunci, XSS, kuota, migrasi dan jam perangkat harus ditinjau pada `SECURITY_OPERATIONS.md` sebelum offline pilot. Enkripsi lokal saja bukan klaim setara hardware keystore.

Persistent storage diminta bila didukung, tetapi browser/uninstall/kerusakan HP tetap dapat menghilangkan local-only. Antrean bukan backup server; server juga tidak dapat mengetahui semua draft yang belum pernah diterima. Ekspor dan laporan harus mengungkap batas tersebut (OFF-12, REP-19).

<a id="arch09"></a>
## 9. Pemisahan usaha, akun, dan izin

Rancangan awal **usulan AT-04** memakai database bersama dengan scope tenant eksplisit pada setiap entitas bisnis. Relasi harus membuktikan header/line/akun/pekerja/periode berada dalam ruang usaha yang benar; ID acak atau filter di UI tidak cukup. Alternatif database per tenant dibahas di [§12](#arch12), bukan dipasang sebagai syarat R1.

- Kebijakan server menggabungkan user, tenant, assignment/capability, aksi, kepemilikan personal, status layanan dan parent objek. Semua query list/detail/agregasi, command, lampiran, ekspor, inbox dan job memakai aturan ini.
- ABK membaca rekap bersama serta proyeksi operasional minimum untuk kandang berizin, **bukan dokumen penerimaan Owner**. Nama pencatat boleh terlihat tanpa invoice/harga mitra, rekening, RHPP, profil lengkap atau keuangan rekan. Proyeksi/whitelist field disusun server (SEC-05).
- Histori kas/gaji/kasbon/upah tetap per pekerja. Satu kandang boleh banyak ABK; grant unik per farm+user, bukan satu ABK per farm. Perubahan assignment ber-versi tidak memindahkan draft atau utang ke ABK baru.
- Username bukan ID histori. Login cukup username/password; namespace global normalisasi dan akun ABK terikat tenant pengelola masih default D-25. Owner tidak mereset Owner/Admin/PPL atau identitas usaha lain melalui menu ABK.
- Reset mengikuti reauth Owner, rahasia sementara berumur terbatas/sekali pakai dan wajib ganti sesuai SEC-16. Sesi lama dicabut; kata sandi tidak masuk audit, notifikasi, ekspor atau log. Recovery Owner dan pergantian kepemilikan tetap perlu bukti, versi dan audit; tidak ada bypass berdasarkan username saja.
- `READ_ONLY` menolak mutasi bisnis, tidak menyamarkannya sebagai gangguan jaringan; baca dan ekspor tetap tersedia sesuai izin. Penurunan limit tidak menghapus data atau otomatis menghentikan periode aktif. Batas penambahan diperiksa atomik sesuai PRD §7.2.
- Admin mengelola layanan/limit dan audit administratif, bukan memperoleh akses baca semua transaksi. Identitas operator backup/dukungan dibatasi prosedur terpisah; izin infrastruktur bukan menu impersonation.

Seluruh kontrol SEC-06–SEC-12 tetap berlaku; ringkasan ini bukan daftar penggantinya. Selain hash password standar, HTTPS, rate limit login, revoke/expiry sesi, pengamanan XSS/CSRF dan secret store, operasi sensitif memerlukan reauth/step-up sesuai ADR serta Admin memerlukan MFA sebelum produksi. Backup/storage memakai kontrol akses dan enkripsi layanan; kebijakan retensi/penghapusan harus diputuskan, tanpa purge otomatis finansial posted. Uji BOLA/IDOR mencakup API, file, ekspor, job dan cache; materi review menggunakan data sintetis/disamarkan, bukan lampiran privat dalam repository. Metode/library dan parameter diperinci pada dokumen keamanan; tidak membuat algoritme kredensial sendiri atau menyimpan rahasia dalam kode/log.

Jika PostgreSQL dipilih, row-level security (RLS) dievaluasi sebagai lapisan tambahan bersama otorisasi aplikasi dan constraint. Role runtime tidak boleh superuser, `BYPASSRLS`, atau tanpa sengaja pemilik tabel yang melewati kebijakan. Konteks tenant per transaksi/koneksi pool tidak boleh tertinggal untuk request berikutnya; worker dan query laporan juga diuji. RLS tidak membatasi field sensitif dengan sendirinya. Pilihan rinci tetap AT-04, dibuktikan lewat uji isolasi, bukan klaim aman karena mengaktifkan satu fitur database.

<a id="arch10"></a>
## 10. Lampiran, pekerjaan latar, dan ekspor

### 10.1 Lampiran bukan bagian wajib keberhasilan pembelian

Metadata/dokumen diterima lebih dahulu. Server menerbitkan izin upload terbatas ke lokasi privat yang ditaut parent/actor sah, memeriksa tipe/isi/ukuran, lalu menandai status file setelah upload dan pemeriksaan berhasil. Parent draft hanya dapat dibaca pembuat yang berhak sampai linkage disahkan. File/revisi mewarisi ACL parent, tidak mempunyai override yang memperluas akses.

Foto/nota R1 opsional, tanpa alasan wajib jika kosong. Kegagalan file tidak membuat transaksi kedua atau otomatis menolak approval data pokok yang valid. Retry file tidak menjalankan ulang posting. Default tipe/batas 10 MB dan lima file mengikuti OFF-15 sebagai usulan, bukan biaya/kuota vendor final. File belum aman tidak ditayangkan sebagai konten aktif; hapus EXIF lokasi salinan tayang, sanitasi nama, dan rencanakan pemeriksaan konten pada dokumen keamanan.

Database dan object storage **tidak dianggap satu transaksi atomik**. Gunakan status pending/uploaded/failed/missing, referensi versi/hash dan rekonsiliasi; orphan/retensi mengikuti kebijakan yang belum final, bukan purge otomatis catatan keuangan. URL akses privat berumur pendek dibuat setelah pemeriksaan izin; URL yang sudah diterbitkan atau file yang diunduh tidak dapat dijanjikan bisa ditarik seketika. Batas masa URL dan kebutuhan gateway ditetapkan dalam rancangan keamanan.

### 10.2 Outbox dan worker

Outbox dicommit bersama perubahan bisnis atau penerimaan job. Worker mengambil pekerjaan yang sudah committed, memproses dengan ID event/job, menyimpan hasil dan menandai selesai. Crash setelah pekerjaan berjalan tetapi sebelum acknowledgement memungkinkan pengiriman ulang; penerima harus idempoten. **Outbox tidak menjanjikan pengiriman exactly-once**. Untuk inbox, key event+penerima mencegah notifikasi ganda; urutan per objek/versi dijaga jika relevan.

Antrean berbasis database cukup sebagai kandidat awal (AT-06); broker/Redis bukan wajib. Retry terbatas dengan jeda, umur antrean dan kegagalan permanen terlihat, tersedia jalur review/retry yang diaudit. Worker tidak mem-posting uang hanya karena notifikasi dibuat. Jika kelak job menghasilkan efek finansial, ia tetap melewati command domain, key efek unik, izin dan gate recovery yang sama (FIN-12).

Inbox server termasuk R1; push web/native tetap R2. Penerima dan hak diperiksa saat pengiriman maupun membuka objek. Jangan menyertakan nominal gaji/kasbon/pribadi pada notifikasi luar aplikasi secara default. Tidak diperlukan WebSocket untuk meluluskan R1; strategi refresh harus menyatakan freshness, bukan janji real-time.

### 10.3 Dua jenis ekspor, bukan pengganti backup

| Hasil | Isi dan pengaman |
|---|---|
| CSV/PDF laporan/slip | Dataset/filter sama dengan layar, whitelist field sesuai izin, tanggal/zona waktu/cakupan/versi, penanganan CSV formula injection |
| Paket usaha REP-19 | Snapshot konsisten dengan stable IDs/relasi, schema version, data posted serta pending terpisah, audit berhak, checksum/jumlah baris, kamus field dan manifest lampiran; sertakan salinan file tersedia dalam paket privat |

Filter dibekukan saat meminta ekspor; titik snapshot data dicatat dan tidak mencampur saldo/relasi dari beberapa waktu. Usulan AT-07 mengambil snapshot konsisten saat job mulai lalu mempertahankannya sepanjang ekstraksi. Dokumen terkunci diekspor menurut versi snapshot yang dipilih, bukan dihitung ulang diam-diam. Durasi snapshot, dampak query besar, pembagian file dan batas unduh harus diuji pada dataset NFR-03.

Job memeriksa izin saat dijalankan; unduh memeriksanya kembali. Hak yang dicabut tidak dipulihkan oleh tautan lama atau job yang pernah diterima. Paket tidak memuat password/hash/token/reset secret, data usaha lain atau buku pribadi. Status file pending/missing, klaim unresolved, konflik yang diterima server dan restore review ikut diungkap. Server tidak dapat menghitung capture-only/draft yang belum diterima; manifest menyatakan keterbatasan, bukan mengaku lengkap. `READ_ONLY` tetap dapat mengekspor sesuai hak. Paket portabilitas ini bukan backup database penuh dan bukan janji impor ulang otomatis.

Untuk memenuhi pemeriksaan hak saat unduh, tautan paket perlu melalui handler/gateway berotorisasi; signed URL storage yang masih berlaku tidak boleh menjadi satu-satunya pengaman setelah hak dicabut. Detail pengiriman file ditetapkan dalam dokumen keamanan. Berkas/byte yang sudah diterima pengguna tidak dapat ditarik kembali.

<a id="arch11"></a>
## 11. Operasional, perubahan versi, dan pemulihan

### 11.1 Bentuk penempatan dan pemantauan yang diusulkan

Satu rilis backend menyediakan proses API dan worker; database serta storage privat bertahan terpisah dari umur proses aplikasi. Aset web statis dapat disajikan lewat hosting/CDN tanpa data privat. Lingkungan pengembangan, pengujian dan produksi dipisahkan kredensial/storage/datanya; data sintetis menjadi default tes. Jumlah instance, region, vendor dan paket belum diputuskan. Belum ada klaim high availability atau SLA.

Pantau latency/error per operasi, lock contention, antrean/outbox tertua, konflik, klaim belum direview, kegagalan upload/ekspor, status backup/arsip log, serta rekonsiliasi recovery. Log memakai request/operation ID dan metadata minimum, bukan payload nota, password, token atau URL privat. Alarm server tidak dapat membuktikan jumlah draft offline yang tidak diketahui. Penanggung jawab, ambang, kanal alert, akses log dan jam dukungan ditetapkan pada `SECURITY_OPERATIONS.md`.

### 11.2 Target rancangan, belum hasil pengukuran

| Area | Target dari PRD | Bukti yang dibutuhkan nanti |
|---|---|---|
| Perangkat | Android RAM 3 GB kelas menengah dan browser yang didukung; LCP ≤2,5 detik pada profil tercatat | Uji HP nyata, profil koneksi dan aplikasi cached; bukan emulator desktop saja |
| Beban API | p95 read terindeks <500 ms, mutation sederhana <800 ms di luar latency internet/upload; error sistem <1% | Benchmark 50 tenant × 10 kandang × 4 bangunan, satu juta baris efek/recording total, 100 sesi aktif; uji scope multi-ABK |
| Offline | Lease awal 72 jam; ≥1.000 operasi teks; antrean bertahan tujuh hari dan melalui restart | Uji migrasi, expiry/logout/reset, storage pressure, konflik dan foto; lease tidak diperpanjang menjadi tujuh hari karena antrean disimpan |
| Ketepatan | Tidak ada selisih rupiah di luar pembulatan yang dinyatakan | Invariant dan GOLD gate R1; concurrent/retry/reversal tests |
| Pemulihan | RPO ≤15 menit untuk server-committed; RTO ≤8 jam | Drill backup + log/PITR atau setara, rekonsiliasi hak/data/file; bukan backup harian saja |

Sumber: NFR-01–NFR-11. Dataset adalah skenario uji, bukan jumlah pelanggan yang dijanjikan. RPO berarti batas kehilangan data server yang ditargetkan; RTO berarti waktu pemulihan yang ditargetkan. Local-only tidak tercakup RPO server. Hosting/biaya/retensi dan hasil drill harus ditinjau sebelum keuangan produksi.

### 11.3 Perubahan versi dan rollback

- Kontrak request/response dan schema lokal berversi. Rilis server mempertahankan dukungan payload lama selama jendela transisi yang akan ditetapkan ADR; operasi terlalu lama ditahan sebagai update-required tanpa membuang ID/payload.
- Migrasi database mempertahankan receipt, referensi sumber dan audit. Usulan strategi bertahap: tambah bentuk kompatibel, migrasikan/verifikasi data, baru hentikan bentuk lama setelah dukungan client lama berakhir. Rencana rollback diuji, bukan langsung menghapus kolom ketika UI berubah.
- Update web/service worker tidak menghapus antrean, berpindah scope, atau menampilkan shell baru yang tidak dapat membaca data lama. Migrasi lokal gagal menahan update/operasi terkait dengan jalan pemulihan yang jelas, bukan reset database lokal otomatis.
- Rollback aplikasi/worker tidak sama dengan restore database. Versi lama hanya dijalankan bila kompatibel dengan skema dan payload saat itu; jika tidak, perbaikan maju atau prosedur insiden diperlukan. Semua perubahan ini masih rencana, bukan pipeline yang sudah ada.

### 11.4 Restore berbeda dari restart

Ringkasan wajib NFR-11; runbook rinci tersedia sebagai rencana pada [dokumen keamanan/operasional](SECURITY_OPERATIONS.md):

1. Hentikan posting dan worker terkait. Pulihkan sumber, ledger, receipt, outbox, audit, revisi serta tombstone pada titik konsisten. File direkonsiliasi dengan manifest versi/hash; lampiran missing bukan transaksi hilang.
2. Catat incident, titik restore, rentang kehilangan diketahui/tidak diketahui dan **epoch baru yang tidak diwarisi snapshot lama**. Bukti recovery/grant yang tahan pemulihan disimpan di luar titik kegagalan yang sama; desain penyimpanan dan aksesnya masih AT-08.
3. Cabut sesi dan reauth. Reverifikasi grant/revocation/pergantian Owner setelah backup dengan bukti yang memadai; jika hak terkini belum dapat dibuktikan, blok scope itu. Login ulang tidak mengesahkan grant lama yang ikut pulih.
4. Periksa epoch di server sebelum mutasi. Receipt committed yang masih ada boleh di-replay sesuai izin tanpa efek baru. Operasi pra-epoch yang tidak ditemukan **bukan otomatis belum diposting**, termasuk ketika HP pernah menerima sukses atau sudah membuang payload.
5. Pertahankan `RESTORE_REVIEW_REQUIRED` durable per ruang/operation ID. Mengubah epoch request atau login ulang tidak menghapus review. Setelah terbukti belum diposting, lanjutkan ID asal; bila memakai correction baru, resolusi ID lama menaut correction lewat receipt/tombstone secara atomik agar replay tidak membuat efek kedua.
6. Owner atau dukungan berizin memeriksa bukti kejadian, tidak meminta menyerahkan uang ulang. Ketidakpastian tetap unresolved dan terlihat dalam laporan. Buka layanan setelah rekonsiliasi saldo/relasi/hash/hak, audit dan persetujuan prosedural; aplikasi bisa login belum berarti restore lulus.

Replikasi, paket ekspor Owner, dan antrean HP masing-masing **bukan pengganti backup teruji**. Pemulihan seluruh database dapat memengaruhi banyak tenant; prosedur kasus satu tenant harus menjaga relasi dan isolation, bukan menyalin sebagian tabel secara ad hoc.

<a id="arch12"></a>
## 12. Opsi teknologi dan biaya

### 12.1 Rekomendasi untuk ditinjau, bukan stack terpasang

Paket awal yang layak dievaluasi: **web TypeScript + React dengan Vite, backend TypeScript modular, PostgreSQL, IndexedDB, object storage privat, dan worker berbasis database**. Ini memperinci kandidat PRD §26.2, bukan keputusan pengguna. Framework backend, library akses database/decimal/local store, versi runtime dan vendor belum dikunci. Dokumentasi publik yang mendasari pertimbangan ada di [§16](#arch16).

| ID | Usulan dan alternatif | Manfaat bagi usaha | Risiko/biaya dan syarat keputusan |
|---|---|---|---|
| AT-01 | React + TypeScript + Vite untuk client SPA; bandingkan framework React berfitur routing/data atau client ekuivalen | Shell/form lokal dapat dipisah dari API; cocok dievaluasi untuk HP dan kemasan Android kelak | SPA bukan otomatis offline; routing, cache, data loading dan update menjadi pekerjaan sendiri. Framework pun tidak menyelesaikan sync uang. Pilih setelah kebutuhan/kemampuan tim ditinjau, bukan karena skill UI merekomendasikan stack |
| AT-02 | Backend TypeScript modular; evaluasi NestJS versus Fastify dengan konvensi modul eksplisit | Bahasa bersama memudahkan berbagi tipe/pemahaman; domain server dapat dipakai API dan worker | Nest memberi struktur tetapi menambah abstraksi; Fastify lebih sedikit kerangka tetapi butuh disiplin tambahan. Tipe TypeScript tidak menggantikan validasi runtime/izin. ORM/query layer harus mendukung transaksi, locks, constraint dan migrasi yang dibutuhkan |
| AT-03 | PostgreSQL sebagai database transaksi; alternatif relasional hanya jika invariant setara terbukti | Relasi, constraint, transaksi dan laporan berada pada sumber konsisten; tidak memerlukan banyak database sejak pilot | Operasional koneksi, indeks, backup/PITR dan numeric serialization wajib dirancang. Versi final mengikuti dukungan hosting/toolchain saat implementasi; dokumentasi PostgreSQL 18 bukan perintah memasang versi tersebut |
| AT-04 | Tenant dalam database/schema bersama dengan scope dan constraint; RLS sebagai pertahanan tambahan yang dievaluasi. Alternatif database per tenant untuk kebutuhan isolasi khusus | Biaya pemeliharaan/migrasi awal lebih terkendali | Salah scope berdampak luas; perlu uji API/job/file/cache dan role database nyata. Database per tenant menambah provisioning, backup dan migrasi, tidak otomatis menyelesaikan salah izin aplikasi |
| AT-05 | IndexedDB melalui library terawat dengan adapter platform; native storage baru dievaluasi saat APK | Draft/antrean tahan reload/restart normal tanpa membuat aturan bisnis khusus tiap perangkat | Quota/eviction dan kehilangan kunci tetap mungkin; local unlock, enkripsi, migrasi dan lease belum final. Wajib uji perangkat Q-06, tanpa klaim data tak pernah hilang |
| AT-06 | Outbox + durable queue berbasis database; object storage privat kompatibel S3/setara. Broker/layanan queue terpisah bila beban membuktikan perlu | Lebih sedikit layanan awal; file tidak bergantung disk server; ekspor tidak memblokir input | Polling/lock cleanup, retry dan dedupe tetap perlu. Ukuran lampiran, egress, scanner serta biaya request/storage harus dihitung; tidak ada exactly-once lintas storage/database |
| AT-07 | Query terindeks/proyeksi ringan dan ekspor snapshot konsisten saat job mulai; warehouse/replica baca ditunda | Laporan dapat ditelusuri ke sumber tanpa sistem analitik tambahan | Snapshot besar dapat menambah beban dan mempertahankan versi data lebih lama; perlu batas durasi dan dataset uji. Jika kelak memakai replica, freshness dan jaminan baca setelah tulis harus dijaga |
| AT-08 | Hosting terkelola yang mendukung API/worker, database dengan PITR/setara, storage privat, secret store dan bukti recovery independen; bandingkan self-managed | Mengurangi pekerjaan rutin operator, bukan menghilangkan tanggung jawab recovery | Biaya tetap/backup/WAL/retensi/monitoring dan batas layanan berbeda. Self-managed menuntut tenaga on-call dan patching; tidak dianggap murah hanya dari sewa server. Q-10/Q-11 harus menyetujui anggaran dan kebijakan |
| AT-09 | Web/API satu origin bila layak, sesi server dengan cookie Secure/HttpOnly/SameSite serta proteksi CSRF; adapter autentikasi native dievaluasi nanti | Mengurangi kebutuhan menyimpan bearer token jangka panjang dalam JavaScript dan menyederhanakan batas web awal | Cookie tidak menyelesaikan XSS/CSRF sendiri; expiry/rotasi/revoke, browser offline dan native memerlukan threat model. Username/password tetap keputusan produk; detail sesi adalah usulan keamanan |

Kriteria umum: dapat diuji dengan aturan PRD; dependensi terawat dan lisensinya cocok; versi stabil kompatibel dipin lewat ADR/lockfile saat implementasi diminta. Tidak memasang dependency `latest`, membuat cloud account, atau menetapkan langganan dari dokumen ini. Android tetap kandidat Capacitor sesuai ARC-05/ARC-06, bukan pekerjaan R1; storage/service worker/push WebView harus diuji sendiri nanti.

### 12.2 Kerangka biaya yang perlu dikonfirmasi

Belum ada harga bulanan atau jadwal pembangunan yang dapat dipertanggungjawabkan: jumlah pengguna/kandang, jumlah serta ukuran foto, retensi, region/vendor, jam dukungan dan pola ekspor belum terukur. Tier gratis bukan dasar janji layanan uang produksi.

| Komponen biaya | Penggerak dan data yang dibutuhkan | Cara menjaga biaya tanpa mengurangi aturan |
|---|---|---|
| API dan worker | Trafik aktif, puncak review, durasi ekspor, proses minimum yang harus hidup | Backend modular, query terindeks, batas konkurensi job; tambah kapasitas dari pengukuran |
| Database + backup/PITR | Ukuran sumber/receipt/audit, pertumbuhan log transaksi, retensi dan target pemulihan | Pilih paket yang benar-benar memenuhi gate dan uji restore; jangan memangkas receipt atau log pemulihan agar tampak murah |
| Lampiran/ekspor | File per kejadian, ukuran setelah kompres, salinan backup, unduhan/egress | Bukti tetap opsional, kompres terbaca, link terbatas, retensi disetujui; tidak menghapus data finansial diam-diam |
| Keamanan/operasional | Monitoring, scanner, secret management, patching, bantuan akun dan drill | Otomasi rutin serta akses minimum; sediakan penanggung jawab, bukan asumsi tanpa tenaga operasi |
| Pembangunan/pemeliharaan | Cakupan R1, test concurrency/offline/recovery, kemampuan tim, dukungan perangkat | Selesaikan alur utuh R1, tidak membangun stok/IoT/CCTV atau banyak layanan lebih awal |

Persetujuan yang dibutuhkan pengguna kelak adalah batas anggaran, perangkat/koneksi yang nyata dan cara bantuan/pemulihan yang dapat diterima, bukan memilih istilah database. Tim teknis menyiapkan perbandingan biaya dari konfigurasi dan volume yang sama sebelum meminta keputusan Q-10.

<a id="arch13"></a>
## 13. Pertumbuhan tanpa membebani R1

| Perluasan | Batas yang disiapkan sekarang dalam rancangan | Yang menunggu keputusan/rilis berikutnya |
|---|---|---|
| Stok/valuasi R2 | ID sumber stabil, klasifikasi pembelian dan efek biaya tertaut; modul recording tidak menulis stok | Opening/cutoff disahkan dan rekonsiliasi biaya; jangan memutar ulang pembelian R1 menjadi biaya consumption kedua atau mengarang stok awal |
| Recording detail, panen, kontrak | Mode/cutoff/revisi R1 jelas; hasil aktual tidak tergantung estimasi; input unknown tetap eksplisit | Source authority, panen DO, template kontrak tervalidasi dan estimasi dengan test sendiri; R1 tidak membuat engine kosong |
| Buku pribadi, PPL/Mandor | Pemisahan data-space, field protection dan capability tetap eksplisit | Aktifkan scope/peran hanya saat fitur disetujui; saldo pribadi tidak otomatis terbentuk dari transaksi usaha historis |
| APK/push | Adapter storage/kamera/jaringan/notifikasi dan API yang sama | Native plugin, signing/distribution, izin OS, pengujian WebView/perangkat; tidak menganggap perilaku web identik |
| Integrasi mitra/IoT | ID tenant/kandang/bangunan stabil; adapter integrasi tidak menulis ledger langsung | Izin API, kredensial perangkat, dedupe, timestamp/freshness, buffering dan volume telemetry; kontrol aktuator/alarm keselamatan di luar scope |
| CCTV | Jalur media/gateway dibedakan dari API transaksi | Kompatibilitas vendor/codec/jaringan, akses token singkat, SSRF, bandwidth dan privasi; tidak menjanjikan video offline |

Pisahkan layanan hanya setelah ada alasan terukur seperti antrean ekspor mengganggu respons, telemetry ber-volume tinggi, kebutuhan isolasi khusus, atau media bandwidth besar. Ukur dan optimalkan query/indeks serta worker dahulu; jangan memecah transaksi uang lintas jaringan agar tampak siap skala. Perluasan memperbarui dokumen, migrasi, test dan gate, bukan otomatis diaktifkan oleh feature flag tersembunyi.

<a id="arch14"></a>
## 14. Peta verifikasi arsitektur

Tabel adalah **rencana bukti**, bukan hasil uji aplikasi. Referensi GOLD yang memiliki bagian R2 hanya dipakai untuk bagian R1 yang ditetapkan [PRD §29.2](PRD.md#s29). Tabel ini tidak menggantikan pemetaan lengkap AC/GOLD/UT di `TEST_PLAN.md` nanti.

| Area | Bukti yang wajib direncanakan | Rujukan awal |
|---|---|---|
| Alur tanpa modul R2 | Mulai sebelum DOC, Owner mencatat sendiri, belanja teks baru/barang/jasa, penerimaan informasional, tanpa stok/kontrak/gaji wajib | AC-84, AC-92–AC-97, GOLD-30; FL-01–FL-03, FL-06 |
| Arahan adaptif | Saran langkah mengikuti izin dan keadaan usaha, bukan angka tebakan, persetujuan uang otomatis atau pekerjaan pemakaian baru | AC-95, AC-99, UX-16; UT-04–UT-06, UT-38 |
| DAILY bersama | Create serentak, koreksi bersamaan, retry response hilang, pergantian mode/cutoff dan grant; tepat satu rekap efektif tanpa kas/stok | AC-87–AC-91, GOLD-28–GOLD-29; UT-07–UT-15 |
| Posting/klaim/kas | Rollback di antara penulisan efek, request paralel, double submit, parent belum sah, linkage dua pihak dan batch sebagian gagal | FIN-01–FIN-13, GOLD-01–GOLD-02, GOLD-14, GOLD-23; FL-05–FL-06 |
| Gaji/kasbon/upah/opening | Kasbon tanpa gaji, melebihi gaji, potongan pilihan, sisa lintas periode, upah terpisah; biaya/hak/kas tidak ganda | AC-98, GOLD-05–GOLD-06, GOLD-24–GOLD-25, GOLD-29; UT-23–UT-25 |
| Angka dan coverage | Rupiah bulat, parsing locale, alokasi parsial/residu, null vs nol, biaya dalam settlement tidak dipotong lagi | DATA-05–DATA-07, COST-05, COST-11, AC-17, AC-66, AC-100, GOLD-07, GOLD-12, GOLD-18 bagian coverage |
| Hasil/penutupan | Payout notice vs uang nyata, suspense lalu matching tanpa kas kedua, lock berbarengan posting, bayar hak sah setelah lock | CYC-09–CYC-11, GOLD-20, AC-43–AC-44, AC-65, AC-68, AC-84; FL-08–FL-09 |
| Isolasi dan akun | Tenant lain, rekan ABK, list/detail/file/export/job, role database nyata, cache akun sebelumnya, reset/revoke/recovery Owner | SEC-01–SEC-16, MOD-01, MOD-06, AC-90–AC-94; UT-29–UT-34, UT-36 |
| Offline/perubahan versi | Restart, quota penuh, 1.000 antrean, lease habis, logout/reset, capture-only asal tetap, migrasi gagal, client lama | OFF-01–OFF-18, NFR-04, AC-77, GOLD-14, GOLD-23; FL-10, UT-43 |
| Jobs/file/ekspor | Worker mati setelah hasil tersimpan, retry event, akses dicabut, snapshot konsisten, checksum/relasi/saldo serta file missing | FIN-12, MOD-06, REP-15–REP-19, NOT-05, NFR-10, AC-82; UT-35 |
| Restore | Commit+response hilang, sukses sebelum restore mundur, grant dicabut setelah backup, epoch diubah client, correction+tombstone, upload parsial | NFR-06, NFR-11, AC-83, GOLD-27; FL-10 |
| Kinerja dan aksesibilitas | Dataset/beban/perangkat sesuai target; response/freshness dan form tetap jelas; keyboard, pembaca layar, fokus, kontras dan zoom | NFR-01–NFR-05, NFR-08–NFR-09; seluruh UT relevan di UX/UI |

Tes concurrency memerlukan database transaksi nyata; mock fungsi tidak membuktikan locks/constraint benar. Tes offline memerlukan restart, pergantian akun dan tekanan storage nyata; indikator offline di desktop tidak cukup. Drill restore harus memeriksa data, hak dan replay, bukan sekadar health check. Semuanya menunggu fase implementasi yang diminta eksplisit.

<a id="arch15"></a>
## 15. Keputusan terbuka dan handoff

### 15.1 Keputusan yang tidak diselesaikan sepihak

| Rujukan | Masih perlu ditentukan | Batas aman sementara |
|---|---|---|
| Q-01, AT-01–AT-03 | Peserta/beban pilot, kemampuan tim, stack serta versi kompatibel | Scope R1 saja; tidak menjanjikan biaya/jadwal atau memasang dependency |
| Q-02, Q-10, AT-09 | Recovery tanpa email, bantuan terverifikasi, masa rahasia sementara/sesi dan detail namespace | Username/password tetap; reset tenant sendiri; tidak bypass Owner atau menjanjikan pemulihan semua sengketa |
| Q-03 | Tindak lanjut saat Owner tidak tersedia/klaim tidak jelas | Owner-only posting online sebagai default; recording tetap tanpa approval; tidak auto-post uang |
| Q-04, Q-08–Q-09 | Contoh klasifikasi peralatan/alokasi, RHPP dan kasus pekerja berhenti | Tidak mengarang biaya/income; payout-only tetap berguna, kasbon mandiri tetap berjalan; label final mengikuti gate |
| Q-06, AT-05 | Browser/HP, lease akhir, local unlock, enkripsi/kunci lokal dan antrean lama | Lease 72 jam hanya usulan; capture-only bukan grant; tidak menghapus antrean atau memindah tenant |
| Q-10–Q-11, AT-04, AT-06–AT-08 | Hosting/anggaran, isolasi database, retensi, backup/PITR, bukti grant tahan restore dan prosedur membuka layanan | Tidak ada produksi finansial sebelum kebijakan dan drill memenuhi gate; data posted tidak dipurge otomatis |

Q-05/Q-07 terkait metrik/kontrak tetap di PRD dan tidak memblokir pembukuan/hasil aktual manual R1 di luar ketergantungan khususnya. Q-12 tentang recording sudah ditutup; tidak ditanyakan ulang atau diubah menjadi per-bangunan/approval wajib.

### 15.2 Dokumen turunan dan handoff

| Dokumen pendamping yang tersedia | Perincian dan batas |
|---|---|
| [SECURITY_OPERATIONS.md](SECURITY_OPERATIONS.md) | Threat model dan matriks akses; akun/reset/recovery; sesi, lease/local unlock; file dan export; retensi; hak operator; backup/restore/epoch/grant evidence; logging, alert, dukungan dan insiden; belum hasil audit/drill |
| [DATA_MODEL.md](DATA_MODEL.md) | Entitas R1 beserta scope, key/constraint, angka/tanggal, ownership sumber dan effects; state/versioning, saldo awal, receipt/tombstone, outbox, conflict dan koreksi; model logis tanpa dependensi R2 wajib |
| [API_SYNC_SPEC.md](API_SYNC_SPEC.md) | Envelope/hash/version/epoch, izin/validasi, hasil per command/batch, retry/error, lease dan capture conversion, transfer kanonis, file/job/recovery; bukan API yang sudah berjalan |
| [TEST_PLAN.md](TEST_PLAN.md) | Seluruh 100 AC/30 GOLD/49 UT, gate per rilis, tes domain/integrasi/isolation/offline, benchmark, restore, data sintetis dan bukti yang kelak harus dikumpulkan |
| [Implementation Plan.md](Implementation%20Plan.md) | 63 kartu dengan dependensi, hasil, langkah, tes, kondisi berhenti dan handoff untuk agent implementer; bukan kickoff coding |

**Status handoff:** paket perencanaan tertulis sudah tersedia untuk review menyeluruh. Pilihan AT dan kebijakan Q yang memerlukan keputusan tetap belum final; dokumen lengkap bukan persetujuan stack, kelulusan tes atau izin implementasi. Urutan peninjauan dan status mengikuti [PLANNING.md](PLANNING.md).

<a id="arch16"></a>
## 16. Referensi dan riwayat

### 16.1 Sumber internal

- [PRD](PRD.md): bagian 3–9 untuk keputusan, batas dan transaksi; bagian 10–13/20 untuk finansial; bagian 22–27 untuk sync/data/arsitektur/keamanan; bagian 29/31 untuk gate dan Q.
- [UX/UI](UX_UI_SPEC.md): perilaku yang harus didukung, tidak diubah oleh pilihan framework.
- [Alur tertulis](UX_FLOWS_WIREFRAMES.md): FL-01–FL-10, cabang gagal dan pemulihan; sketsa teks bukan aplikasi.
- [Peta perencanaan](PLANNING.md) dan [panduan agent](AGENTS.md): batas fase Markdown dan urutan tindak lanjut.

### 16.2 Referensi teknis publik

Diperiksa 23 September 2026. Referensi mendukung sifat teknologi/pola dan keterbatasannya, **bukan persetujuan bisnis, pemilihan vendor, benchmark, atau bukti implementasi aman**. Tidak ada dependency aplikasi yang dipasang untuk penyusunan dokumen ini.

| Sumber | Penggunaan dalam rancangan |
|---|---|
| [React — Build a React app from Scratch](https://react.dev/learn/build-a-react-app-from-scratch) | SPA/build tool tetap memerlukan keputusan routing/data/performance; bandingkan framework, bukan menganggap Vite menyediakan seluruh arsitektur aplikasi |
| [NestJS — Introduction](https://docs.nestjs.com/) | Kandidat struktur backend TypeScript; pilihan kerangka tidak menggantikan aturan domain/izin |
| [PostgreSQL 18 — Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | Isolation/konkurensi dan kebutuhan strategi locks/retry yang diuji |
| [PostgreSQL 18 — Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) | RLS sebagai pertahanan tambahan; pengecualian superuser/BYPASSRLS/table owner perlu diperhatikan |
| [PostgreSQL 18 — Continuous Archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) | Backup dasar dan arsip WAL untuk pemulihan titik waktu; bukan menyamakan dump harian dengan target RPO |
| [MDN — IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) | Penyimpanan terstruktur dengan transaksi lokal; tetap terikat batas browser |
| [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | Quota/persistence/eviction dan risiko hilangnya data lokal |
| [MDN — Background Synchronization API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) | Dukungan browser terbatas; sync foreground/manual tetap wajib |
| [AWS Prescriptive Guidance — Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) | Menghindari dual-write yang kehilangan event; consumer tetap perlu dedupe/idempotensi, bukan kewajiban memakai AWS |
| [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | Kandidat pengamanan sesi/cookie dan lifecycle; threat model spesifik tetap diperlukan |

### 16.3 Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Arsitektur logis R1, batas modul/transaksi, offline/isolasi/restore, opsi teknologi dan biaya, serta handoff; seluruhnya perencanaan Markdown, tanpa implementasi atau klaim lulus uji aplikasi. |
