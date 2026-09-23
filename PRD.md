# PRD — SaaS Manajemen Usaha Kandang Broiler Kemitraan

| Metadata | Nilai |
|---|---|
| Versi | 0.6 — operasional sederhana, multi-ABK, recording kandang, onboarding adaptif, arahan kemudahan UX, dan desain visual final dari mockup |
| Tanggal | 23 September 2026 |
| Bahasa produk awal | Bahasa Indonesia |
| Platform utama | Web mobile-first; disiapkan untuk kemasan aplikasi Android |
| Fokus | Operasional dan keuangan kandang; recording dasar OFF/DAILY sebagai pilihan, performa dan estimasi kemitraan tetap bertahap |
| Pengguna awal yang diketahui | Dua owner berminat; jumlah kandang, pengguna aktif, dan transaksi belum terukur |
| Status persetujuan | Memuat keputusan brainstorming sampai 23 September 2026: sederhana/dinamis, multi-ABK, recording global langsung berlaku, pembelian tanpa tracking pemakaian rutin, kasbon fleksibel, dan login username/password. Desain visual final ditetapkan pengguna lewat mockup (K-39). Rincian rancangan, keamanan, dan gate produksi tetap harus diverifikasi |
| Spesifikasi UX pendamping | `UX_UI_SPEC.md` v0.4; desain visual final di [FRONTEND_DESIGN_SPEC.md](FRONTEND_DESIGN_SPEC.md); audit kemudahan di [UX_AUDIT.md](UX_AUDIT.md). ID layar/tes dikelola di dokumen pendamping dan tidak menggantikan AC/GOLD/ledger test PRD |
| Rancangan alur pendamping | [Alur Layar & Wireframe v0.3](UX_FLOWS_WIREFRAMES.md); usulan interaksi R1, bukan perubahan keputusan bisnis atau hasil UAT |
| Arsitektur pendamping | [Arsitektur v0.1](ARCHITECTURE.md); pembagian sistem, pengaman data, dan opsi teknis yang masih usulan |
| Paket teknis dan pelaksanaan | [Peta dokumen lengkap](PLANNING.md), [Rencana tes](TEST_PLAN.md) dan [Implementation Plan](Implementation%20Plan.md); seluruhnya rencana, bukan hasil eksekusi atau persetujuan pilihan teknis |
| Implementasi | Dokumen kebutuhan, bukan aplikasi yang sudah dibuat, bukan desain database final |
| Fase kerja saat ini | Dokumen perencanaan `.md` dan acuan desain visual final di `design/` (K-39); belum ada implementasi. Urutan dan status mengikuti [PLANNING.md](PLANNING.md) |
| Privasi contoh | Semua nama, kode, tarif, dan angka contoh dalam dokumen ini sintetis |

## Daftar isi

1. [Cara memakai PRD dan kontrak kerja untuk AI agent](#s01)
2. [Visi, masalah, sasaran, dan batas produk](#s02)
3. [Keputusan terkonfirmasi dan default usulan](#s03)
4. [Cakupan rilis dan dependensi](#s04)
5. [Istilah, hierarki, waktu, satuan, dan presisi](#s05)
6. [Peran, hak akses, dan privasi](#s06)
7. [Onboarding, master data, dan administrasi SaaS](#s07)
8. [Siklus pemeliharaan dan penutupan keuangan](#s08)
9. [Fondasi transaksi, persetujuan, dan audit](#s09)
10. [Kas kandang, pembelian, pembayaran, dan piutang/utang](#s10)
11. [Pembebanan biaya dan laporan periode](#s11)
12. [Stok operasional, gas, dan sapronak](#s12)
13. [Gaji periode, kasbon, dan upah pekerjaan terpisah](#s13)
14. [Keuangan pribadi owner](#s14)
15. [Pekerjaan, perawatan, dan kunjungan PPL](#s15)
16. [Recording opsional dan sumber data](#s16)
17. [Panen, DO, kendaraan, dan asal bangunan](#s17)
18. [Rumus performa dan kelengkapan data](#s18)
19. [Mitra, kontrak berversi, dan mesin perhitungan](#s19)
20. [Estimasi, RHPP/P4, realisasi, dan pencairan](#s20)
21. [UX mobile-first, navigasi, dan layar minimum](#s21)
22. [Offline, sinkronisasi, lampiran, dan konflik](#s22)
23. [Notifikasi dan pusat perhatian](#s23)
24. [Dashboard, laporan, pencarian, dan ekspor](#s24)
25. [Model data logis dan kontrak layanan](#s25)
26. [Arsitektur, kesiapan Android, IoT, dan CCTV](#s26)
27. [Keamanan dan kebutuhan nonfungsional](#s27)
28. [Contoh hitungan wajib/golden test](#s28)
29. [Kriteria penerimaan dan matriks pengujian](#s29)
30. [Urutan pengembangan dan Definition of Done](#s30)
31. [Keputusan terbuka, risiko, dan persetujuan](#s31)
32. [Sumber, batas interpretasi, dan riwayat dokumen](#s32)

<a id="s01"></a>
## 1. Cara memakai PRD dan kontrak kerja untuk AI agent

### 1.1 Tingkat kepastian

- **K — Terkonfirmasi:** kebutuhan yang dinyatakan/disepakati pengguna dalam diskusi. Daftarnya ada di bagian 3.1.
- **D — Default usulan:** keputusan rancangan konkret agar perilaku dapat diuji. Bukan klaim bahwa pengguna telah menyetujuinya. Default utama ada di bagian 3.2.
- **Q — Perlu keputusan:** pertanyaan terbuka dengan default sementara dan batas implementasi, pada bagian 31.
- **F — Masa depan:** hanya kebutuhan kompatibilitas/ekstensi. Tidak otomatis menjadi pekerjaan rilis pertama.
- Semua detail normatif yang tidak langsung tercakup K adalah **rancangan usulan D**, termasuk target kinerja, state machine, matriks izin, dan pembagian rilis.

**MUST/wajib**, **MUST NOT/dilarang**, dan **SHOULD/disarankan** menyatakan kekuatan persyaratan setelah bagian tersebut disetujui. Status draft tidak membolehkan developer mengabaikan isolasi data, integritas angka, dan pemisahan gaji/upah.

### 1.2 Instruksi untuk implementer/AI agent

**Batas fase aktif:** pengguna meminta fokus pada dokumen `.md`; desain visual final sudah diberikan pengguna (K-39, `design/`), tetapi aplikasi belum dibuat. Aturan pembangunan/pengujian di bawah adalah kontrak untuk saat implementasi kelak diminta secara eksplisit, bukan izin memulainya sekarang.

1. Baca bagian 3, 4, 6, 9, 13, 19, 22, 28, dan 31 sebelum membangun modul terkait.
2. Jangan mengubah kebutuhan K untuk menyesuaikan library, demo, atau keterbatasan implementasi.
3. Jangan menganggap semua usulan telah disetujui. Sebelum development produksi, dapatkan persetujuan scope rilis serta Q yang memblokir modul. Jika prototype kelak diminta secara eksplisit, D hanya boleh dipakai dengan data sintetis dan label draft; prototype bukan pekerjaan fase saat ini.
4. Jika aturan bisnis belum terjawab, ikuti default aman yang tertulis. Jika tidak ada default, hentikan hanya aksi/modul yang terdampak dan ajukan keputusan; jangan mengarang rumus.
5. Implementasikan satu alur vertikal lengkap: UI, otorisasi server, validasi, transaksi database, audit, kondisi gagal, dan pengujian. UI yang hanya memakai data dummy bukan fitur selesai.
6. Gunakan ID requirement dan acceptance test dalam tugas/PR. Tambahkan tes sebelum menyatakan requirement selesai.
7. Jangan menambahkan billing otomatis, payroll bulanan, pencampuran upah pekerjaan ke slip gaji, mutasi ayam antarbangunan, sensor, atau CCTV tanpa perubahan scope yang disetujui.
8. Jangan memperlakukan angka nol sebagai data yang belum diisi; jangan menampilkan estimasi sebagai realisasi; jangan menyamakan persetujuan dengan pembayaran.
9. Jangan membuat engine kontrak melalui `eval`, JavaScript pengguna, SQL pengguna, atau formula bebas yang tidak divalidasi.
10. Jangan memakai dokumen/foto pribadi dari diskusi sebagai seed, fixture, screenshot publik, atau contoh di repositori.
11. Jangan menyatakan integrasi mitra, sensor, push, dan CCTV berfungsi sebelum benar-benar diuji terhadap jalur yang diizinkan.
12. Jika ada konflik antarkebutuhan, kebutuhan K dan koreksi user terbaru menjadi acuan. Catat konflik dan revisi PRD sebelum mengubah perilaku produksi.
13. Bagian 4 adalah batas implementasi: kebutuhan jangka panjang tetap disimpan, tetapi modul R2 tidak wajib dibangun untuk meluluskan R1. Terapkan aturan dan tes lintas-modul hanya pada kapabilitas yang diaktifkan; larangan akses, double count, dan klaim menyesatkan selalu berlaku. Jangan membuat menu/tabel/API dummy untuk mengejar jumlah requirement.

### 1.3 Dokumen lanjutan, bukan prasyarat untuk memahami kebutuhan

Urutan fase perencanaan tertulis mengikuti [PLANNING.md](PLANNING.md): perincian arsitektur, keamanan/operasional, model data, kontrak API/sinkronisasi, rencana tes, dan backlog pembangunan. Semua berupa `.md`, ditambah acuan desain visual final dari pengguna di `design/`; tidak menjalankan migrasi/implementasi. PRD ini menjadi sumber makna bisnis; dokumen teknis tidak boleh mengubah makna uang, periode, atau hak akses secara sepihak.

[UX_FLOWS_WIREFRAMES.md](UX_FLOWS_WIREFRAMES.md) menyediakan bahan peninjauan alur dan wireframe awal sebelum persetujuan desain final. Rujuk ID layar/tes UX serta requirement PRD; tersedianya dokumen pendamping tidak berarti gate persetujuan/produksi sudah lulus.

<a id="s02"></a>
## 2. Visi, masalah, sasaran, dan batas produk

### 2.1 Visi

**Pusat kendali usaha kandang broiler kemitraan yang membuat owner mudah memahami kondisi operasional, pergerakan uang, biaya periode, dan estimasi hasil; sementara ABK dapat mencatat dengan cepat walaupun koneksi buruk.**

Produk adalah SaaS untuk banyak owner independen. Satu owner dapat mengelola beberapa kandang dan beberapa PT/mitra. Pengaturan cukup dinamis untuk variasi nyata, tetapi pengguna lapangan tidak perlu memahami mesin konfigurasi.

**Dinamis dan sederhana** berarti alur mengikuti keadaan usaha, bukan semua pengguna wajib mengisi semua modul. Owner dapat menambah kandang/ABK/kategori, memilih recording OFF/DAILY dan input RHPP ringkas/lengkap, serta melengkapi data saat dibutuhkan. Saran konteks dapat diperbaiki; nominal, kejadian, persetujuan uang, dan rumus tidak dikarang otomatis. Pengaturan tidak boleh mengubah histori atau melemahkan otorisasi. Ini bukan janji formula bebas, custom workflow tanpa batas, atau AI prediktif.

Dalam kebutuhan yang sudah dikonfirmasi, **multi-owner berarti banyak pelanggan/ruang usaha yang terisolasi**, bukan kepemilikan patungan dalam satu tenant. Co-owner dalam satu usaha belum diminta sebagai fitur; jangan menambah pembagian saham/bagi hasil antarowner. Identitas user tetap terpisah dari tenant sehingga hak pengelola tambahan dapat dikembangkan nanti tanpa membuka buku pribadi seseorang.

### 2.2 Masalah yang diselesaikan

| Masalah | Hasil yang diharapkan |
|---|---|
| Catatan biaya tersebar dan tidak jelas periode pembebanannya | Satu catatan sumber, bukti, penanggung jawab, alokasi, dan riwayat |
| Uang pegangan ABK tercampur dengan kasbon pribadi/gaji | Saldo dan tujuan dana terpisah serta dapat direkonsiliasi |
| Pencatatan pemakaian barang membebani ABK | R1 cukup mencatat pembelian; tidak wajib melacak tabung habis, sisa gas, mutasi, atau opname. Laporan jujur sebagai biaya pembelian, bukan konsumsi terukur |
| Gaji, kasbon, dan upah pekerjaan punya cara pembayaran berbeda | Alur masing-masing jelas, tanpa pembayaran atau biaya ganda |
| Hasil kemitraan belum memperlihatkan seluruh biaya owner | Laporan penghasilan kemitraan dan biaya owner yang tidak tumpang tindih |
| Berbeda PT berarti berbeda harga dan cara menghitung | Kontrak berversi, parameter terstruktur, rincian hasil yang dapat ditelusuri |
| Owner perlu melihat banyak kandang dan periode | Dashboard ringkas, drill-down, kualitas data, dan prioritas tindakan |
| Internet lapangan buruk | Catatan penting dapat disimpan lokal; status sinkronisasi jujur |

### 2.3 Sasaran dan ukuran keberhasilan usulan

- **GOAL-01:** seorang ABK terlatih dapat mencatat belanja sederhana tanpa foto dalam ≤60 detik pada uji tugas; minimal 8 dari 10 percobaan selesai tanpa bantuan.
- **GOAL-02:** owner menemukan total biaya periode, saldo kas ABK, dan sisa gaji/kasbon dalam ≤3 navigasi utama dari beranda.
- **GOAL-03:** semua nilai laporan dapat ditelusuri ke dokumen sumber, versi aturan, serta pembayaran/alokasi terkait.
- **GOAL-04:** retry/sinkronisasi ulang tidak menggandakan biaya, kas, gaji, panen, atau stok pada modul yang aktif; seluruh golden test untuk scope rilis pada 29.2 lulus.
- **GOAL-05:** pilot mencakup satu siklus operasional sampai rekonsiliasi keuangan untuk owner yang bersedia; metrik penggunaan diukur, bukan diasumsikan.
- **GOAL-06:** tidak ada akses data antarowner atau keuangan pribadi yang tidak diizinkan dalam pengujian otorisasi.
- **GOAL-07:** sebelum pilot, catat baseline waktu rekonsiliasi kas dan penyelesaian gaji dengan cara kerja lama. Ukur durasi, jumlah koreksi, serta klaim belum selesai pada pekerjaan sebanding; sasaran awal pengurangan waktu rekonsiliasi kas ≥30%, bukan janji hasil.
- **GOAL-08:** uji kelengkapan terhadap sampel bukti belanja/serah-terima yang diverifikasi owner, bukan terhadap jumlah baris aplikasi saja. Sasaran awal ≥90% kejadian sampel tercatat lokal dalam 24 jam; pisahkan waktu kejadian, simpan lokal, diterima server, dan review. Catatan offline belum dianggap tersedia bagi owner sebelum terkirim.
- **GOAL-09:** sasaran awal ≥90% pengajuan lengkap diperiksa dalam 48 jam sejak diterima server. Laporkan umur pengajuan tidak lengkap juga, bukan mengeluarkannya dari dashboard. Ukur penggunaan berulang pada hari yang memang ada aktivitas dan alasan kembali ke catatan lama.
- **GOAL-10:** keputusan lanjut setelah pilot memuat baseline versus hasil, kendala setiap peran, kesediaan owner melanjutkan, dan perbaikan wajib. Satu siklus berlalu atau semua tes teknis lulus tidak otomatis berarti produk berhasil. Jika target gagal, iterasi alur sebelum memperluas modul; perubahan target harus beralasan dan tidak menghapus hasil sebelumnya. Harga tetap keputusan pemilik produk.

Target di atas adalah target uji, bukan hasil yang sudah dicapai. Tidak menjanjikan laba meningkat sekian persen atau data tidak mungkin hilang.

### 2.4 Non-goals awal

- Bukan pengganti wajib aplikasi perusahaan inti; recording internal boleh dimatikan.
- Bukan software akuntansi/pajak tersertifikasi, bank, pemberi kredit, sistem transfer uang, atau penyedia nasihat veteriner.
- Bukan sistem HR lengkap: absensi, BPJS, payroll bulanan umum, rekrutmen, dan pajak penghasilan karyawan otomatis di luar scope awal.
- Tidak menjamin semua skema kontrak dunia dapat dimasukkan tanpa pengembangan.
- Tidak mengambil data aplikasi mitra dengan scraping kredensial, bypass login, atau akses API tanpa izin.
- Bukan marketplace penjualan ayam dan bukan sistem perusahaan inti.

<a id="s03"></a>
## 3. Keputusan terkonfirmasi dan default usulan

### 3.1 Register kebutuhan K

| ID | Keputusan terkonfirmasi |
|---|---|
| K-01 | Bisnis nyata, fokus ayam broiler kemitraan, produk SaaS multi-owner. |
| K-02 | Owner dapat mempunyai beberapa kandang; satu kandang dapat mempunyai beberapa bangunan dengan kapasitas berbeda. |
| K-03 | Kapasitas fisik berbeda dari populasi DOC aktual. |
| K-04 | DOC satu kandang masuk pada satu tanggal untuk satu periode; satu periode pemeliharaan aktif per kandang. |
| K-05 | Tidak ada pemindahan ayam antarbangunan dalam scope saat ini. |
| K-06 | Gudang bersama per kandang lazim; rancangan lokasi stok disimpan sebagai perluasan, bukan kewajiban tracking R1 setelah penyederhanaan K-33. |
| K-07 | Panen dirinci per kandang/bangunan; mobil dapat mengambil dari beberapa bangunan. Ada tanggal, DO, plat, sopir, broker, dan jumlah. |
| K-08 | Peran: Administrator, Owner, ABK, PPL; Mandor opsional. |
| K-09 | Satu PPL dapat memantau banyak plasma melalui akses terbatas; catatan kunjungan dapat dibuat PPL atau dicatatkan owner/ABK. |
| K-10 | ABK menggunakan HP pribadi; sinyal kandang kadang terputus/lemah, bukan diasumsikan tanpa koneksi terus-menerus. Catatan perlu tahan putus-sambung. |
| K-11 | Fokus utama operasional, pengeluaran per periode dan di luar periode, termasuk pembelian gas dan peralatan tanpa kewajiban input pemakaian rutin. |
| K-12 | Recording dan perhitungan FCR/performa diinginkan tetapi bukan syarat untuk memakai operasional. |
| K-13 | Kontrak, harga, aturan, dan skema perhitungan PT/mitra dapat berbeda, termasuk antarowner. |
| K-14 | Owner ingin estimasi penghasilan dari input kontrak dan data pendukung. |
| K-15 | Keuangan pribadi owner dapat dicatat, terpisah dari usaha. |
| K-16 | UI modern, sangat mudah dipakai, dashboard pemantauan per periode. |
| K-17 | Web mobile-first; disiapkan untuk dikemas menjadi APK Android dengan kemampuan notifikasi. |
| K-18 | IoT kandang dan CCTV adalah pengembangan mendatang, bukan implementasi sekarang; sistem harus siap bertumbuh. |
| K-19 | Administrasi owner cukup aktif/nonaktif dan limit; harga serta billing subscription otomatis belum dibangun. |
| K-20 | Owner dapat memberikan kas pegangan, dana belanja khusus, atau membayar toko langsung; pola tidak eksklusif. |
| K-21 | Kasbon dapat diberikan sebelum gaji ditentukan dan melebihi gaji; saldo belum lunas tetap berjalan. Owner menentukan potongan saat pembayaran gaji. Gaji pokok berbasis periode ayam, bukan default bulanan. |
| K-22 | Upah pekerjaan tambahan bertarif tersendiri, tidak digabung ke komponen/slip/pembayaran gaji periode; boleh direkap bersama dalam laporan keuangan. |
| K-23 | PRD harus rinci dan dapat dipakai AI agent berbiaya rendah; deliverable berupa file Markdown. |
| K-24 | Recording dasar tersedia sejak R1 dan dapat dimatikan oleh Owner bila memakai pencatatan mitra. Tanpa recording, operasional dan pembukuan tetap dapat digunakan sampai penghasilan/hasil usaha periode dari data keuangan yang cukup. Nama mode dan pembatasan teknis mengikuti rancangan bagian 4 dan 16. |
| K-25 | DAILY memakai satu rekap bersama per kandang per hari untuk pakan terpakai, mati/afkir, dan sampling; bukan per ABK atau wajib per bangunan. Recording valid langsung berlaku tanpa pemeriksaan/persetujuan Owner; salah input dikoreksi dengan riwayat, bukan dijumlah. OFF tidak mempunyai kewajiban recording. |
| K-26 | Satu kandang boleh memiliki beberapa ABK dengan akun pribadi dan penugasan kandang. Pencatat/korektor terlihat, sedangkan kas, gaji, kasbon, dan upah tetap per orang. Rekap bersama dan konflik antarperangkat/ABK harus ditangani tanpa duplikasi atau timpa diam-diam. |
| K-27 | Owner mencatat pakan datang, DOC, dan penerimaan sapronak mitra serta dapat menginput transaksi langsung. ABK tetap boleh membeli/menerima operasional gas/solar sendiri. Owner mobile-first; setiap ABK menggunakan HP dan identitasnya sendiri untuk input yang berwenang. |
| K-28 | Fokus ABK adalah Recording, Belanja, dan Uang Kas; pemakaian operasional tidak menjadi tugas input R1. Gaji/kasbon/upah/panduan tetap tersedia sesuai hak. Owner juga dapat mencatat langsung. |
| K-29 | Aplikasi menyediakan tutorial bagi pengguna. Bentuk panduan kontekstual dan batas tanpa LMS mengikuti rancangan UX, bukan fitur pelatihan tambahan yang telah diminta. |
| K-30 | Arah UI dikonfirmasi modern, mudah digunakan, dan bergaya glassmorphism. Detail implementasi translucent/frosted, surface opaque, kontras, fallback solid, warna, radius, blur, dan shadow adalah rancangan UX yang masih menunggu mockup/usability/accessibility review. Tampilan kini ditetapkan oleh K-39; uji usability/accessibility tetap diperlukan. |
| K-31 | Aplikasi sangat dinamis dan sederhana: Owner dibimbing bertahap sesuai keadaan usaha, setup dapat dilanjutkan kemudian, data diminta saat dibutuhkan. Label judul/tombol pendek dan jelas; penjelasan lewat teks bantuan. |
| K-32 | Jalur awal utama sebelum DOC masuk: Data Kandang → Tim Kandang opsional → Recording Harian OFF/DAILY → persiapan. Owner boleh mencatat sendiri dan belanja persiapan tanpa seluruh master/gaji/RHPP lengkap. |
| K-33 | R1 mencatat pembelian, termasuk gas, solar, dan peralatan; tidak mewajibkan tracking pemakaian, tabung habis, sisa, atau stok operasional. Recording pakan DAILY tetap ada, terpisah dari pembukuan persediaan. |
| K-34 | Owner memeriksa transaksi setiap hari; nota/foto hanya opsional. Recording langsung berlaku berbeda dari pemeriksaan transaksi uang. |
| K-35 | Nominal rupiah tanpa angka desimal; persentase boleh desimal. Koreksi ini menggantikan usulan dua desimal rupiah sebelumnya. |
| K-36 | Owner memilih input RHPP lengkap atau hanya angka pembayaran. Input ringkas tetap berguna, tanpa menyebut pembayaran sebagai laba lengkap. |
| K-37 | Login menggunakan username dan password, bukan email. Owner dapat membuat/mengelola akun ABK, mengubah username, mereset password, dan mengatur penugasan kandang. |
| K-38 | Pengalaman aplikasi harus sangat mudah: bahasa singkat dan tidak ambigu; aplikasi mengarahkan langkah berikutnya seperti Duolingo, tetapi pengguna tetap bebas memilih tindakan lebih dulu; terasa pintar dan memanjakan, termasuk keypad angka khusus, detail yang mudah dibuka-tutup, dan sesedikit mungkin berpindah halaman. Arahan ini tidak menambah poin/streak, tidak mengisi angka otomatis sebagai fakta, dan tidak melonggarkan izin, validasi, atau aturan uang. |
| K-39 | Tampilan frontend mengikuti **persis** tujuh mockup Google Stitch dan `DESIGN.md` yang diberikan pengguna pada 23 September 2026 (folder `design/`), termasuk Recording Harian berbentuk tab (Pakan, Mortalitas, Sampling). Aturan implementasinya ada di [FRONTEND_DESIGN_SPEC.md](FRONTEND_DESIGN_SPEC.md). Tampilan tidak mengalahkan aturan bisnis, izin, uang, offline, dan glosarium; bagian mockup yang bertentangan dikoreksi seminimal mungkin dan dicatat. Layar yang belum punya mockup disusun dari komponen yang sama. |

### 3.2 Default rancangan D

| ID | Default usulan yang digunakan dalam PRD | Keputusan terkait |
|---|---|---|
| D-01 | Tenant adalah ruang usaha; satu primary owner pada rilis awal. Co-owner/patungan belum didesain sebagai pembagian saham. | Q-02 |
| D-02 | R1 adalah pilot operasional utuh sesuai bagian 4; recording R1 hanya OFF/DAILY dasar, sedangkan SUMMARY, recording detail, estimasi/template kontrak, buku pribadi, PPL, dan task umum ditunda. Tidak perlu membangun modul tertunda agar R1 selesai. | Q-01 |
| D-03 | Belanja ABK tetap melalui pemeriksaan Owner harian sebelum posting finansial; tidak ada keputusan eksplisit auto-post uang. Recording langsung berlaku tanpa approval. Batch review finansial tidak mengubah hak; delegasi bukan default. | Q-03 |
| D-04 | Kas terkonfirmasi tidak boleh minus; laporan belanja belum diverifikasi tetap terlihat sebagai klaim keluar, bukan dihapus. | Q-03 |
| D-05 | R1 barang habis pakai memakai biaya pembelian yang diterima/disahkan, bukan biaya consumption. Weighted average dan INV-16 hanya perluasan persediaan R2. Peralatan tahan lama diklasifikasikan terpisah, tidak otomatis habis dalam satu periode. | Q-04 |
| D-06 | Biaya tanpa alokasi periode tetap di luar periode sampai owner mengalokasikan; tidak otomatis masuk periode berikutnya. | Q-04 |
| D-07 | Hari chick-in ditampilkan sebagai hari ke-1. Basis umur kontrak disimpan eksplisit, default 1 hari saat chick-in. | Q-05 |
| D-08 | Tidak ada standar strain, batas IP baik/buruk, jadwal vaksin, atau harga PT universal yang ditanam sebagai fakta. | Q-05 |
| D-09 | Lease akses scope offline awal 72 jam, harus diuji lapangan; kedaluwarsa mengunci akses bisnis, bukan menghapus antrean. Catatan baru capture-only tanpa akses cache bisnis mengikuti OFF-17. | Q-06 |
| D-10 | Buku pribadi ditunda dari R1; bila diaktifkan kemudian, online-only dan hanya user pemilik. Modal/prive/talangan owner tetap dicatat pada sisi usaha di R1. | Q-06 |
| D-11 | IDR dibukukan rupiah bulat; hasil hitung memakai half-up pada batas pengakuan, alokasi memakai COST-05 agar total cocok dan nonnegatif. Persentase ditampilkan hingga dua desimal; kuantitas/rate mempertahankan presisi sesuai satuan. | K-35, Q-07 |
| D-12 | Kelebihan kapasitas memerlukan konfirmasi owner beralasan, bukan otomatis dianggap kapasitas baru. | Q-05 |
| D-13 | Laporan laba manajerial memakai hasil kemitraan neto sapronak yang direkonsiliasi, bukan menghitung sapronak dua kali. | Q-08 |
| D-14 | Kasbon bertaut pekerja dan kreditur usaha, agreement/periode opsional. Potongan dipilih Owner, bukan otomatis maksimal. Sisa tetap saldo kasbon yang sama lintas periode; pembayaran tunai gaji tidak negatif. | K-21, Q-09 |
| D-15 | Lokasi/valuasi persediaan disiapkan sebagai rancangan R2; R1 tidak membutuhkan ledger stok, opname, atau tugas pemakaian. | K-33, Q-04 |
| D-16 | Inbox aplikasi pada R1; push web/Android dan pengemasan APK pada R2. | Q-01 |
| D-17 | PPL tidak melihat kontrak harga, pengeluaran, kas, gaji, kasbon, atau keuangan pribadi. | Q-03 |
| D-18 | Nominal komponen kontrak yang belum diketahui tidak diganti nol. Output parsial bukan estimasi lengkap. | Q-07 |
| D-19 | Framework dan versi dependensi diputuskan melalui ADR setelah kebutuhan disetujui. Tidak ada stack yang sudah dipasang oleh PRD. | Q-10 |
| D-20 | Owner memilih mode recording per siklus; `OFF` adalah default aman sampai owner mengaktifkan `DAILY`. Mode tidak berubah otomatis karena ada atau tidaknya data, dan pergantian mode memakai cutoff/rekonsiliasi. | Q-01, Q-05 |
| D-21 | Key recording R1 `cycle_id + business_date`; cycle menentukan kandang. Satu rekap bersama semua ABK berwenang, banyak draft/revisi tertaut, satu versi efektif. Bangunan bukan field wajib atau dasar pemecahan otomatis. | K-25, K-26 |
| D-22 | Banyak ABK/Owner/device dapat mengubah rekap bersama. Expected version mencegah timpa diam-diam; penerimaan recording bukan posting kas/biaya/stok. | K-25, K-26 |
| D-23 | Navigasi mengikuti mockup (K-39) dengan label sesuai izin. ABK: Hari Ini / Uang Kas / Catat (tombol tengah) / Riwayat / Lainnya; gaji, kasbon, upah, Status Kirim, Panduan, dan Akun berada di Lainnya. Owner: Ringkasan / Transaksi / Catat (tombol tengah) / Kandang / Lainnya; Laporan, gaji, kasbon, upah, ekspor, Status Kirim, Panduan, dan Akun berada di Lainnya. Kemudahan menemukan tujuan tetap diuji melalui usability. | Q-01 |
| D-24 | Arah visual glassmorphism mengikuti mockup (K-39): kartu kaca putih 75–95% dengan blur di atas kanvas kertas hangat, sedangkan isian, tombol keypad, dan tampilan nominal tetap solid. Solid fallback dipakai bila efek tidak didukung, pengguna memilih Kurangi Efek Visual, atau preferensi sistem meminta transparansi rendah. Token final ada di FRONTEND_DESIGN_SPEC §4; kontras tetap diuji. | Q-01, Q-10 |
| D-25 | Username dinormalisasi dan unik global agar cukup username/password saat masuk; akun ABK yang dikelola Owner terikat satu tenant, boleh beberapa kandang dalam tenant melalui grant eksplisit. Detail namespace adalah rancangan, tidak memerlukan email atau kode usaha tambahan saat login. | K-37, Q-02 |
| D-26 | Keypad angka aplikasi dipakai untuk nominal rupiah, kuantitas, dan hitungan ekor: tombol besar, tombol `000`, hapus, tampilan `Rp` langsung, serta ejaan nominal. Username, password, dan teks bebas tetap memakai keyboard HP. Pengguna selalu dapat beralih ke keyboard HP, menempel angka, memakai keyboard fisik, dan pembaca layar; bila keypad gagal uji aksesibilitas pada perangkat pilot, keyboard angka HP menjadi default. | K-38, Q-01, Q-06 |
| D-27 | Pola kerja di tempat: input singkat dibuka sebagai lembar bawah (di layar ≥640 px tampil sebagai kartu di tengah, sesuai mockup K-39), detail daftar dibuka-tutup di baris yang sama, dan aksi pemeriksaan tersedia dari baris yang dibuka. Formulir panjang tetap satu halaman fokus. Tombol kembali menutup lembar tanpa menghapus draf, alamat layar dapat dibuka ulang, dan tidak ada lembar bertumpuk. Pengecualian sesuai mockup (K-39): Catat Belanja dan Mulai Kandang adalah halaman fokus; Recording Harian adalah halaman bertab dengan lembar input per tab. | K-38, K-39, Q-01 |

<a id="s04"></a>
## 4. Cakupan rilis dan dependensi

### 4.1 Janji dan batas R1

**Janji pilot:** owner dapat mengetahui uang usaha berada di mana, dipakai untuk apa, siapa masih harus dibayar, serta biaya operasional yang sudah tercatat; ABK tidak harus menjadi operator pembukuan. R1 memakai isolasi tenant sejak awal, bukan aplikasi single-owner yang kelak harus dibongkar.

R1 hanya mencakup baris R1 berikut. R2 adalah perluasan bertahap berdasarkan hasil pilot, bukan satu paket wajib atau jadwal yang sudah dijanjikan. Kebutuhan K tetap menjadi arah produk; penundaan tidak mengubah makna bisnisnya. Feature flag tidak mengubah modul R2 menjadi syarat selesai R1. Setiap aktivasi perluasan membawa aturan, izin, migrasi, dan tesnya sendiri.

| Kapabilitas | Rilis usulan | Batas |
|---|---|---|
| Tenant, login, membership, RBAC, audit, admin on/off/limit | R1 | Admin, Owner, ABK; recovery akun dan ekspor data usaha wajib |
| Kandang, bangunan, karyawan, periode, mitra | R1 | Fondasi wajib |
| Pengeluaran, pemasukan sampingan, kas ABK, utang toko, reimbursement | R1 | Inti; pencatatan pembayaran, bukan transfer bank otomatis |
| Pembelian gas/barang dan peralatan | R1 | Catat pembelian tanpa tracking pemakaian; tidak mengklaim stok/sisa/konsumsi aktual |
| Stok, pemakaian operasional, opname, lokasi dan valuasi | R2 | Perluasan hanya setelah kebutuhan baru disetujui; bukan prasyarat pembukuan R1 |
| Alokasi biaya, laporan kas dan biaya, settlement aktual/pencairan | R1 | Komponen aktual dimasukkan/review manual; net-only boleh, bukan otomatis income/laba final; tidak memerlukan mesin kontrak |
| Gaji periode, kasbon mandiri, upah pekerjaan terpisah | R1 | Kasbon tidak menunggu gaji, dapat melebihi hak; potongan dipilih Owner; bukan HR/payroll bulanan |
| Catatan upah pekerjaan dan tarifnya | R1 | Dokumen job compensation mandiri; tidak memerlukan task engine |
| Modal/prive, pinjaman/talangan owner kepada usaha | R1 | Sisi buku usaha saja; tidak membutuhkan buku pribadi aktif |
| Pekerjaan umum, kebutuhan belanja, perawatan, kunjungan PPL, peran Mandor/PPL | R2 | Role dan modul tertunda tidak diundang/diaktifkan pada pilot |
| Keuangan pribadi owner dan offset pinjaman pribadi melalui payroll | R2 | Tidak ada pair ke buku pribadi pada R1; jangan menyamarkan potongan yang belum didukung menjadi pembayaran tunai |
| Recording dasar owner/ABK berwenang: mode OFF atau DAILY (pakan terpakai, mati/afkir, sampling harian) | R1 | Satu rekap kandang/tanggal bersama, langsung berlaku setelah validasi server tanpa approval; revisi bukan tambahan dan tidak membuat efek stok/biaya |
| Username/password, akun ABK dan onboarding adaptif | R1 | Tanpa email wajib; banyak ABK per kandang, reset berizin, label pendek, mulai sebelum DOC; setup dapat dilanjutkan nanti |
| SUMMARY, recording detail/event produksi, panen per DO, FCR/ABW panen/deplesi/IP, dan metrik lanjutan | R2 | ABW sampling sederhana REC-10 tersedia pada DAILY R1; bukan ABW panen/performa lengkap. Tidak ada impor otomatis, mesin kontrak, atau klaim metrik final hanya karena mode DAILY |
| Estimasi dari template kontrak bertipe dan berversi | R2 | Mulai dari pola kontrak pilot terverifikasi; tarif/parameter configurable, tanpa builder umum wajib |
| Builder kontrak umum untuk owner | Setelah validasi template R2 | Hanya jika variasi berulang membuktikan kebutuhan; primitive bounded tetap wajib |
| Dashboard mobile-first, ekspor CSV/PDF dan paket data usaha, lampiran | R1 | File privat; paket terstruktur bukan hanya laporan ringkasan |
| Offline belanja, recording, upah, catatan kejadian tunai, sinkronisasi, inbox | R1 | Tahan putus-sambung; capture bukan posting uang/persetujuan/penutupan |
| APK hybrid, native push, web push | R2 | Kemampuan arsitektur disiapkan pada R1; uji Android tersendiri |
| Impor Excel/PDF/OCR dari mitra | R2 | Per format, preview dan konfirmasi; bukan janji membaca semua format |
| API mitra resmi | R2 atau berikutnya | Hanya setelah tersedia dan diizinkan |
| Reminder berulang kompleks, depresiasi otomatis, analitik lanjutan | Berikutnya | Tidak otomatis masuk R1 |
| IoT suhu/kelembapan, integrasi CCTV | Masa depan | Batas arsitektur saja; vendor dan protokol belum dipilih |
| Billing otomatis, WhatsApp berbayar, IoT actuator/control | Di luar scope saat ini | Memerlukan keputusan baru |

**Dependensi:** estimasi kontrak membutuhkan kontrak valid dan input dengan basis yang jelas; laba lengkap membutuhkan alokasi biaya dan settlement yang cukup; data per bangunan membutuhkan sumber per bangunan. Tidak ada modul tersebut yang menjadi syarat untuk mulai mencatat pengeluaran.

### 4.2 Penerapan scope pada seluruh dokumen

- Bagian 5–13 adalah inti R1 kecuali persediaan/valuasi bagian 12 dan payroll pinjaman pribadi pada 13.4. Penerimaan DOC/sapronak Owner dan pembelian operasional tetap R1 tanpa ledger stok. Bagian 14 menjadi referensi R2; hanya efek **sisi usaha** modal/prive/talangan berlaku R1 melalui CASH-15. Bagian 16 berlaku untuk OFF/DAILY dan lineage minimum; REC-09 integrasi inventory, source SUMMARY/DETAIL, REC-11–REC-12, serta bagian 15, 17–19 tetap tertunda kecuali data periode minimum dan prinsip integritas. ABW sampling sederhana bukan metrik panen R2.
- Pada bagian 20, SET dan rekonsiliasi aktual/coverage berlaku R1 kecuali perbandingan estimasi SET-10. EST dan engine kontrak tidak berlaku R1. Upload RHPP sebagai bukti tidak menjanjikan ekstraksi otomatis.
- Layar, laporan/ekspor, notifikasi, entitas, endpoint, dan tes mengikuti batas ini. Tidak adanya API R2 bukan kegagalan R1; mencoba mengakses fitur/grant tertunda harus ditolak, bukan mengembalikan data tersembunyi. Scope tes rinci pada 29.2.
- Pilot utama dimulai sebelum DOC pada kandang terpilih setiap owner; model mendukung banyak kandang dan ABK. Mulai tengah siklus tetap jalur sekunder ONB-10, bukan wizard wajib semua pengguna. Mode OFF/DAILY tidak mengubah coverage finansial; laporan parsial tidak disebut laba satu siklus lengkap.
- Snapshot kas/biaya dan daftar kewajiban tetap berguna saat settlement belum lengkap. Tidak menunggu RHPP untuk memakai aplikasi atau memulai periode berikutnya; tidak memaksa angka laba final.
- Sebelum pilot, konfirmasi kasus usaha yang benar-benar terjadi. Jika kebutuhan penting berada di luar scope (misalnya pemotongan pinjaman pribadi melalui gaji), putuskan perluasan kecil dengan tes atau nyatakan batasnya; jangan diam-diam menyatakan kewajiban lunas.

<a id="s05"></a>
## 5. Istilah, hierarki, waktu, satuan, dan presisi

### 5.1 Kamus

| Istilah | Makna dalam produk |
|---|---|
| User | Identitas login personal; tidak identik dengan tenant |
| Tenant/ruang usaha | Batas kepemilikan data usaha pelanggan SaaS |
| Owner | User dengan hak pengelolaan usaha pada tenant tertentu |
| Kandang | Lokasi/unit peternakan yang dapat terdiri dari beberapa bangunan |
| Bangunan | House fisik, mempunyai kapasitas; dapat kosong dalam suatu periode |
| Periode/siklus | Satu siklus pemeliharaan pada satu kandang; mempunyai alokasi DOC ke bangunan |
| Populasi awal | DOC hidup yang benar-benar diterima dan masuk pemeliharaan, bukan kapasitas dan belum tentu jumlah yang ditagihkan |
| Kas pegangan | Uang usaha yang berada dalam penguasaan ABK, bukan gaji ABK |
| Dana belanja khusus | Transfer uang usaha dengan tujuan pembelian tertentu; bukan hanya rencana anggaran |
| Kasbon | Dana usaha yang diberikan kepada pekerja dan dicatat sebagai saldo per orang; tidak mensyaratkan gaji/periode ditentukan dahulu, dapat diselesaikan lewat potongan pilihan Owner atau pengembalian |
| Pinjaman ABK | Pinjaman terpisah dengan kreditur eksplisit; pemotongan gaji memerlukan otorisasi/kesepakatan |
| Upah pekerjaan | Imbalan satu pekerjaan/borongan terpisah dari gaji periode |
| Biaya | Nilai barang/jasa yang telah menjadi beban menurut aturan pengakuan produk |
| Arus kas | Pergerakan uang nyata antarakun/pihak, berdasarkan tanggal pembayaran |
| Sapronak | DOC, pakan, dan OVK; sumber/penanggung biaya dapat berasal dari mitra atau owner |
| RHPP/P4/settlement | Laporan penyelesaian kemitraan dari PT; label dokumen dapat berbeda |
| Estimasi | Hitungan dari data aktual dan/atau asumsi, bukan hak final dan bukan uang cair |
| Posting | Pengesahan transaksi ke catatan saldo/biaya yang tidak boleh diedit in-place |
| Reversal | Pembalikan tercatat yang menaut ke transaksi asli, bukan penghapusan |

### 5.2 Hierarki yang benar

```text
Tenant
├── Mitra dan versi kontrak
├── Karyawan, membership, serta penugasan
└── Kandang
    ├── Bangunan A, B, ... (kapasitas masing-masing)
    ├── Lokasi stok/gudang (perluasan R2)
    └── Periode 1, 2, ...
        ├── Alokasi DOC per bangunan
        ├── Catatan operasional/produksi/panen
        ├── Alokasi biaya dan gaji
        └── Kontrak terpilih, estimasi, dan settlement

User owner
└── Ruang keuangan pribadi (bukan child dari kandang dan bukan data bersama tenant)
```

Periode **bukan child masing-masing bangunan**. Satu periode dapat mencakup beberapa bangunan; satu bangunan dapat tidak diisi. Satu PT boleh bermitra dengan beberapa kandang; perubahan PT periode berikutnya tidak mengubah histori.

### 5.3 Konvensi data

- **DATA-01:** gunakan ID stabil, bukan nama orang/nomor DO/plat sebagai primary key. Arsipkan master yang pernah dipakai; jangan menghapus histori ketika nama berubah.
- **DATA-02:** simpan `event_date`/`occurred_at`, `created_at_device`, `received_at_server`, dan `posted_at` sesuai relevansi. Simpan UTC untuk timestamp dan zona waktu IANA kandang untuk tanggal operasional. Jangan hardcode WIB untuk semua tenant Indonesia.
- **DATA-03:** tanggal biaya, tanggal pembayaran, dan periode pembebanan adalah field berbeda. Pemilihan periode boleh disarankan, tidak boleh dikunci berdasarkan tanggal pembayaran.
- **DATA-04:** ekor dan jumlah tabung fisik berupa integer ≥0; kuantitas konsumsi dapat desimal sesuai unit. Berat basis kg, input gram dikonversi eksplisit. Isi sak tidak selalu 50 kg.
- **DATA-05:** R1 hanya membukukan IDR; field mata uang tetap disimpan agar tidak ambigu. Mata uang lain ditolak, bukan dikonversi memakai kurs buatan. Uang IDR dalam desimal fixed-point/integer rupiah, bukan floating point biner. Tarif hingga 6 desimal; kuantitas hingga 6 desimal; intermediate hitungan finansial minimal 12 digit desimal pecahan atau ekuivalen decimal arithmetic yang diuji.
- **DATA-06:** input nominal IDR berupa rupiah bulat; pecahan rupiah ditolak dengan penjelasan, bukan dipotong diam-diam. Hasil kalkulasi dibulatkan half-up ke Rp1 pada batas pengakuan; alokasi proporsional memakai distribusi sisa COST-05, bukan pembulatan setiap bagian secara independen. Total menjumlah nilai dibukukan. Persentase boleh desimal (tampilan hingga dua desimal, bukan membulatkan input diam-diam); kuantitas/rate mengikuti satuan dan DATA-05. Kontrak R2 boleh memiliki profil pembulatan tervalidasi dalam versinya.
- Narasi dan UI memakai locale Indonesia: `1.000` berarti seribu dan `1,5` berarti satu setengah. Payload API memakai format canonical tanpa pemisah ribuan: amount IDR berupa integer rupiah yang aman/serialized integer string, kuantitas/rate berupa decimal string bertitik sesuai kontrak API. Jangan meneruskan string UI langsung ke parser numerik tanpa validasi locale.
- **DATA-07:** `null` berarti tidak diketahui/tidak diisi; `0` berarti diketahui nol. Pembagian dengan nol menghasilkan tidak tersedia beserta alasan, bukan nol/Infinity/NaN.
- **DATA-08:** simpan snapshot label, unit conversion, rate, dan dasar alokasi untuk transaksi historis. Perubahan master hanya berlaku untuk catatan baru.
- **DATA-09:** nomor dokumen unik mengikuti scope yang dinyatakan (misalnya tenant+mitra+nomor+tahun), bukan unik global. Dugaan duplikasi bisnis diperingatkan; jangan menyamakan dua transaksi hanya karena nominalnya sama.

<a id="s06"></a>
## 6. Peran, hak akses, dan privasi

### 6.1 Prinsip wajib

- **SEC-01:** setiap request, lampiran, ekspor, background job, cache, dan query agregasi harus diotorisasi di server. Menyembunyikan menu saja tidak cukup.
- **SEC-02:** hak akses = user + tenant/kandang yang diizinkan + aksi + scope data. Keanggotaan di tenant A tidak memberikan akses tenant B.
- **SEC-03:** PPL menggunakan satu identitas personal dengan grant terpisah per kandang/tenant. Daftar lintas tenant hanya memuat kandang yang diundang. Tidak ada akses lintas tenant implisit berdasarkan nama PT yang sama.
- **SEC-04:** private finance hanya untuk user pemilik. Admin platform, Mandor, PPL, ABK lain, dan owner lain tidak otomatis bisa membacanya.
- **SEC-05:** field-level protection: R1 ABK melihat recording/konteks operasional tanpa invoice mitra atau keuangan rekan. Pada R2, kuantitas stok dapat terlihat tanpa harga dan PPL melihat performa tanpa data keuangan. Endpoint tidak mengirim field rahasia lalu berharap UI menyembunyikannya.

### 6.2 Matriks hak akses dan aktivasi per rilis

Matriks adalah **usulan D-03/D-17, menunggu Q-03**, bukan klaim delegasi finansial telah disetujui owner.

R1 hanya mengaktifkan Admin, Owner, dan ABK serta modul R1. Kolom Mandor/PPL dan baris modul tertunda adalah referensi perluasan, bukan izin membuat grant/menu R2 pada pilot. Satu primary owner tidak berarti satu perangkat atau tidak boleh mempunyai metode pemulihan akun.

Legenda: **M** mengelola sesuai scope; **B** baca; **A** ajukan/catat, bukan persetujuan finansial; **S** hanya milik sendiri; **—** tidak.

| Kemampuan | Admin platform | Owner | Mandor opsional | ABK | PPL |
|---|---|---|---|---|---|
| Aktivasi tenant/limit sistem | M | B status sendiri | — | — | — |
| Kandang, bangunan, mitra, penugasan | — | M | B scope tugas | B proyeksi operasional minimum scope tugas | B identitas minimum kandang undangan |
| Tim kandang: beberapa ABK aktif, akun dan penugasan | — | M dalam tenant sendiri | — | B penugasan sendiri | — |
| Periode fisik: buat/aktifkan/nyatakan selesai | — | M | A setelah R2 | — | B setelah R2 |
| Keuangan periode: review/kunci/buka kembali snapshot | — | M | — | — | — |
| Kas usaha, kontrak harga, settlement, laba | — | M | — | — | — |
| Belanja lapangan | — | M | A scope tugas | A scope tugas | — |
| Membuat/melengkapi/mengesahkan dokumen penerimaan DOC, pakan, sapronak mitra | — | M | — | — | — |
| Pembelian/penerimaan barang/jasa operasional sendiri, termasuk gas dan solar | — | M | A scope tugas | A scope tugas sendiri | — |
| Saldo pegangan dan belanja sendiri | — | M | S | S | — |
| Persetujuan/pembayaran/reversal finansial | — | M | — | — | — |
| Stok kuantitas, pemakaian, opname (R2) | — | M | A/B scope tugas | A/B scope tugas | B kuantitas sapronak relevan |
| Recording bersama R1 (`DAILY`), baca/catat/koreksi tanpa approval | — | M | — | M scope kandang yang ditugaskan, bukan izin finansial | — |
| Gaji/kasbon pribadi ABK | — | M | S | S | — |
| Upah pekerjaan sendiri | — | M | A/B sendiri | A/B sendiri | — |
| Data produksi/panen detail (R2; inaktif pada R1) | — | M | A/B scope tugas | A/B scope tugas | B kandang undangan |
| Kunjungan/rekomendasi PPL (R2; inaktif pada R1) | — | M | A/B scope tugas | A/B scope tugas | A kunjungan sendiri, B scope grant |
| Task/lampiran task nonfinansial (R2; inaktif pada R1) | — | M | A/B scope tugas | A/B scope tugas | B yang dibagikan ke PPL pada kandang undangan |
| Keuangan pribadi owner (R2; inaktif pada R1) | — | S | — | — | — |
| Ekspor | metadata layanan | data berhak | laporan operasional scope tugas | catatan/saldo sendiri | laporan operasional scope grant |
| Audit | administrasi platform | usaha sendiri | riwayat yang berhak | keuangan sendiri + riwayat recording bersama kandang berhak | riwayat kunjungan sendiri |

Default tidak memberi Mandor akses gaji semua ABK. Delegasi finansial, jika disetujui kemudian, harus berupa capability eksplisit, scope kandang, batas nominal, dan audit; bukan otomatis akibat label Mandor.

**Proyeksi operasional ABK:** server hanya mengirim label minimum mitra, jenis/satuan pakan, tanggal DOC, populasi awal kandang, dan recording bersama yang dibutuhkan pada penugasan sah. Bukan saldo stok hasil tebakan atau akses dokumen penerimaan. Invoice/harga/lampiran penerimaan, rekening pihak, settlement, dan keuangan ABK lain tidak termasuk. Endpoint penerimaan sapronak hanya Owner; baca ABK memakai whitelist field. Nama pencatat/revisi recording bersama terlihat tanpa membuka profil atau keuangan pribadi rekan.

**SEC-15:** satu kandang boleh memiliki beberapa grant ABK aktif, masing-masing akun personal; tidak ada constraint satu ABK per kandang. Unik aktif berlaku per `(tenant, farm, user)` agar grant orang yang sama tidak ganda. Satu akun ABK dapat ditugaskan ke beberapa kandang dalam tenant yang sama melalui pilihan Owner; tidak ada akses kandang lain otomatis. Assignment menyimpan `effective_from`, `effective_to`, `assignment_version`, dan status grant. Tambah/cabut/pindah assignment diaudit atomik/versioned per assignment, tidak mengganti seluruh tim diam-diam.

Antrean, draft, dan operation ID tidak diwariskan kepada rekan/pengganti atau dihapus diam-diam. Antrean terikat user/device asal; pencabutan grant mencegah posting tanpa izin terkini. Kas, gaji, kasbon, pinjaman, dan upah historis tetap pada orang asal. Recording yang sudah diterima adalah rekap kandang bersama dengan riwayat author; rekan berizin dapat mengoreksinya tanpa mengambil alih draft lokal orang lain. Expected version, idempotency, dan conflict review berlaku lintas ABK/Owner/device.

**Scope PPL:** identitas kandang/bangunan, status fisik periode, produksi/panen, kuantitas sapronak, serta kunjungan/rekomendasi pada grant yang sah. Task/catatan umum ABK/owner hanya terbaca bila ditandai `PPL_VISIBLE`; default `INTERNAL`. Lampiran dan histori revisi mewarisi visibility objek induk. Nota/pembelian, tarif pekerjaan, kas/gaji, kontrak harga, dan settlement tetap tertutup; flag PPL_VISIBLE tidak dapat mengubah objek finansial menjadi publik. Kunjungan yang sengaja mencatat rekomendasi PPL default PPL_VISIBLE pada scope grant tersebut.

### 6.3 Perubahan akses

- Owner membuat akun ABK dan menetapkan kandang melalui **Tim Kandang**, tanpa undangan email. Peran/grant hanya berlaku pada scope sah; akun pekerja tanpa penugasan tidak mendapat akses bisnis kandang.
- Owner mencabut grant PPL atau penugasan ABK tanpa menghapus catatan lama.
- Owner dapat menambah, memindahkan, atau menonaktifkan anggota tanpa mengeluarkan ABK lain dari kandang; pencabutan akses tidak memindahkan histori keuangan/saldo/antrean ke orang baru.
- Penonaktifan karyawan tidak menghapus sisa kas, piutang, gaji, atau upah belum lunas.
- Setelah pencabutan, server menolak request baru dan URL unduhan baru. Salinan yang sebelumnya sudah diunduh tidak dapat dijanjikan dapat ditarik kembali.
- Admin tidak mempunyai menu impersonation/read-all. Akses dukungan khusus kelak memerlukan persetujuan, durasi, alasan, dan audit terpisah.

### 6.4 Pemulihan akses dan kelangsungan usaha

**SEC-13:** bedakan recovery orang yang sama, reset akun ABK oleh Owner, delegasi, dan pergantian primary owner. R1 memakai username/password tanpa ketergantungan email. Recovery Owner memerlukan prosedur bantuan/bukti kewenangan terverifikasi atau kode pemulihan sesuai ADR, bukan reset berdasarkan username saja. Wajib pencabutan sesi perangkat hilang, pemberitahuan perubahan melalui kanal terverifikasi yang dipilih (in-app bila dapat diakses), dan audit tanpa rahasia. Hilang HP tidak menghapus ledger; local-only tetap berisiko OFF-12.

**SEC-14:** pergantian primary owner tidak cukup berdasarkan permintaan anggota tenant, nomor HP baru, atau keputusan sepihak admin. Jalur biasa memerlukan autentikasi ulang owner lama, undangan dan penerimaan identitas owner baru, snapshot keanggotaan, serta audit. Jika owner lama tidak dapat mengakses akun, selesaikan recovery identitas dahulu; sengketa/tidak tersedia bukti kewenangan memblokir transfer dan masuk proses bantuan terverifikasi, bukan bypass. R1 boleh memakai prosedur bantuan manual yang diuji; tidak menjanjikan pemulihan otomatis untuk setiap sengketa. Hak lama dicabut/dibatasi eksplisit, seluruh sesi diperiksa ulang, dan tidak boleh ada fase tanpa owner atau dua primary owner karena request paralel. Buku pribadi owner lama tidak ikut dipindahkan. Owner berhalangan sementara tidak otomatis memberi Mandor hak finansial; delegasi baru tetap memerlukan kebijakan Q-03 dan audit.

Pergantian ownership dan recovery yang memengaruhi akses memakai expected membership/ownership version, constraint satu primary owner, serta transaksi atomik untuk perubahan grant/audit. Request transfer dan recovery paralel tidak boleh saling menimpa; aksi dengan versi usang harus ditinjau ulang. Sesi/antrean owner lama tidak mewarisi hak baru dan selalu melewati otorisasi terkini sebelum posting.

**SEC-16 — akun ABK:** Owner dapat membuat akun, mengganti username, reset password, dan nonaktifkan akun ABK yang dikelola tenantnya. Default D-25: identitas login ABK ini tidak dipakai bersama antarowner independen, sehingga reset oleh Owner tidak mengambil alih akses usaha lain. Akun Owner/Admin/PPL tidak dapat direset melalui menu ABK. Username bukan ID histori; perubahan tidak mengubah author/saldo/grant. Username normalisasi unik global diperiksa atomik; pesan bentrok tidak mengungkap identitas/tenant pemilik.

Password lama tidak pernah ditampilkan atau dikirim kembali. Usulan reset: reauth Owner, password sementara sekali pakai berumur terbatas, wajib ganti saat login berikutnya, sesi/token lama dicabut, audit actor/alasan tanpa password. Rahasia diserahkan privat, bukan notifikasi/log. Reset tidak memperluas penugasan dan tidak membuat Owner boleh menyamar sebagai ABK; seluruh perubahan bisnis menyimpan actor sebenarnya. Cache offline tidak dapat ditarik seketika, mengikuti lease; antrean lama tetap pada identitas asal dan direvalidasi setelah login. Batas panjang, rate limit, mekanisme reset dan recovery Owner diuji melalui Q-02/Q-10, tanpa menambah email wajib.

<a id="s07"></a>
## 7. Onboarding, master data, dan administrasi SaaS

| ID | Requirement dan validasi utama |
|---|---|
| ONB-01 | Admin membuat tenant, menetapkan primary owner terverifikasi dan limit; bukan registrasi publik bebas klaim usaha. Rancangan aktivasi awal: terbitkan username + password sementara sekali pakai, serahkan melalui jalur privat kepada Owner terverifikasi tanpa email wajib. Owner masuk online lalu mengganti password sebelum akses bisnis. Kredensial awal kedaluwarsa bila tidak dipakai dan tidak masuk audit/log. Tidak ada checkout atau payment gateway R1. |
| ONB-02 | Setup bertahap: Data Kandang (usaha, kandang, timezone) → Tim Kandang opsional → Recording Harian OFF/DAILY → Persiapan. Bangunan, akun kas, dan rincian lain diminta saat relevan, bukan seluruhnya prasyarat masuk aplikasi. Kontrak/gaji/RHPP tidak wajib untuk belanja persiapan. |
| ONB-03 | Saldo awal kas/piutang/kasbon dicatat saat diperlukan dengan cutoff dan sumber; bukan pendapatan/biaya baru. Stok awal tidak wajib pada R1 tanpa persediaan. |
| ONB-04 | Owner membuat akun personal beberapa ABK dan assignment kandang versioned. Menambah ABK tidak mencabut anggota lain. Tim dapat dilewati agar Owner mencatat sendiri; karyawan tanpa login tetap boleh. Mandor/PPL sesudah perluasan. |
| ONB-05 | Master kategori pengeluaran/pemasukan dapat ditambah/diarsip, tetapi kelas akuntansi seperti transfer, stok, pinjaman, dan biaya tidak dapat diubah sekadar mengganti nama kategori. |
| ONB-06 | R1 master barang opsional/bertahap: nama, satuan jika diketahui, dan klasifikasi pembelian habis pakai/peralatan/sapronak. Tidak wajib SKU, lokasi, minimum stok, atau consumption. Konversi pakan recording eksplisit; tidak semua sak/tabung dianggap sama. Mode persediaan disimpan untuk R2. |
| ONB-07 | Master mitra/toko/broker dibedakan menurut peran; satu pihak dapat mempunyai beberapa peran tanpa mencampur saldo/tagihan. |
| ONB-08 | Tarif pekerjaan disimpan sebagai template dengan unit; transaksi menyalin tarif yang dipakai, bukan mengacu pada tarif yang selalu berubah. |
| ONB-09 | Login username/password tanpa email wajib; pembuatan/reset akun ABK oleh Owner sesuai SEC-16. Identitas Owner/recovery melalui prosedur terverifikasi. Tidak meminta NIK/rekening lengkap/dokumen pribadi untuk setup rutin jika tidak diperlukan. |

**ONB-11 — pendampingan adaptif:** jalur utama sebelum DOC, **Siapkan Periode** membuat `physical_status=DRAFT`, bukan ACTIVE. Beranda **Persiapan** menawarkan **Catat Belanja**, **Uang Kas**, dan **DOC Masuk**. DOC aktual (tanggal/populasi valid) baru mengaktifkan periode sesuai CYC-03; tidak dibuat agar checklist tampak lengkap. Pilih satu kandang otomatis bila hanya satu, gunakan konteks relevan dengan konfirmasi, tawarkan barang sering dipakai tanpa menebak nominal. **Nanti** menyimpan progres setup; kembali melalui Pengaturan. Saat aksi membutuhkan data, minta hanya dependensi itu (misalnya sumber kas sebelum penyerahan), jelaskan singkat, lalu kembali ke draft asal. Posting memvalidasi data wajib, bukan seluruh setup. Checklist bukan gamifikasi/LMS wajib dan tidak mengklaim unknown sebagai nol.

### 7.1 Mulai menggunakan aplikasi di tengah siklus

**ONB-10:** onboarding utama **Periode Baru** sebelum DOC; jalur sekunder **Periode Berjalan** tetap tersedia agar pengguna tidak membuat tanggal/ayam fiktif. Jalur kedua menyimpan `tracking_started_at`, cutoff C, sumber, dan `history_coverage=COMPLETE/PARTIAL/UNKNOWN`; bukti opsional. Tanggal chick-in sebenarnya, bukan tanggal daftar. Tanggal/jumlah awal unknown tetap null. Setup historis tidak dibebankan kepada semua pengguna baru.

- Owner dapat langsung mencatat kas/belanja pada kandang meskipun konteks periode masih DRAFT belum lengkap; setelah tanggal chick-in dan populasi awal diverifikasi, aktifkan periode secara atomik sesuai CYC-03 dan alokasikan catatan tadi tanpa menciptakan transaksi kedua. Tidak perlu menunggu DOC siklus berikutnya.
- Saldo kas, utang toko, reimbursement, kasbon mandiri, dan kewajiban gaji/upah dibawa sebagai opening positions tertaut pihak (periode bila relevan) pada C, bukan kas masuk/biaya baru. Stok opening baru untuk R2. Setiap posisi menyimpan apakah biaya sebelum cutoff sudah diakui; biaya historis unknown bukan nol. Gaji final hanya menambah hak yang belum tercakup; kasbon tidak mensyaratkan agreement gaji.
- Nominal hak gaji penuh, yang sudah dibayar, advance yang belum diterapkan, dan sisa payable dipisahkan. Advance yang sudah diperhitungkan dalam saldo payable tidak diterapkan dua kali. Nilai/rincian yang belum cocok masuk reconciliation pending; tidak boleh melakukan offset otomatis sampai opening disahkan.
- Populasi saat cutoff bukan DOC baru. Data sebelum C memakai opening/summary tersendiri; event baru memakai waktu >C. Bila timestamp sama dengan C, tetapkan cakupan opening versus event secara eksplisit sebelum posting. Duplikat historis ditaut/dikeluarkan dari agregasi, bukan dijumlah.
- R1 tidak mewajibkan histori pakan/mortalitas/panen terperinci. Mode `DAILY` hanya mencatat pakan terpakai, mati/afkir, dan sampling sesuai REC-14–REC-19; detail/panen tetap R2. Opening produksi mengikuti cutoff dan sumbernya, dan tidak menghitung FCR/deplesi dari data yang tidak lengkap.
- Jika biaya sebelum C belum lengkap, laporan menampilkan “cakupan pencatatan mulai ...; biaya sebelumnya belum lengkap”. Boleh menyimpan snapshot operasional sesuai cutoff, tetapi `financial_status=LOCKED` dan laba **seluruh periode** menunggu rekonsiliasi cakupan historis; tidak membuat siklus fiktif atau biaya nol untuk meluluskan gate.

### 7.2 Status layanan dan limit

- `ACTIVE`: operasi sesuai izin.
- `READ_ONLY`: default tenant yang dinonaktifkan/suspend; data lama tetap tersedia bagi user berhak, owner dapat mengekspor; mutasi baru ditolak. Tampilkan alasan layanan, bukan error jaringan palsu.
- `ARCHIVED`: akses dikelola lewat kebijakan retensi/ekspor, tidak otomatis hapus data.
- Limit default dapat mencakup jumlah kandang aktif, bangunan aktif, user internal aktif, dan kuota lampiran. Nilai aktual ditentukan administrator; tidak dikarang menjadi paket harga.
- Menurunkan limit di bawah pemakaian tidak menghapus data atau menghentikan periode aktif. Blok penambahan yang memperbesar pelanggaran; pembacaan/penyelesaian data lama mengikuti status tenant.
- Counter limit diperiksa atomik server agar dua request paralel tidak melewati batas.
- Suspend satu tenant tidak memberi akses keuangan pribadi kepada admin dan tidak otomatis mensuspend tenant lain yang dapat diakses user sama.

<a id="s08"></a>
## 8. Siklus pemeliharaan dan penutupan keuangan

### 8.1 Data periode

**CYC-01:** minimum nama/kode periode, kandang, tanggal rencana/aktual chick-in, mitra opsional saat draft, status fisik, status keuangan, mode recording, zona waktu snapshot, dan catatan. Alokasi bangunan menyimpan kapasitas snapshot, DOC diterima hidup, serta bangunan yang tidak dipakai.

Implementasi wajib mempunyai **dua field terpisah `physical_status` dan `financial_status`**, bukan satu enum “status periode”. Semua istilah “locked” dalam PRD berarti `financial_status=LOCKED`; tidak ada lock fisik yang menyamakan ayam habis dengan uang selesai.

**CYC-02:** simpan jumlah DOC ditagihkan, bonus DOC, ditolak/mati saat penerimaan, dan DOC hidup diterima sebagai nilai berbeda bila tersedia. Populasi awal memakai yang benar-benar masuk pemeliharaan. Jangan menghitung kematian kedatangan dua kali; pilih apakah sudah dikeluarkan dari penerimaan atau masuk event kematian setelah diterima.

**CYC-03:** aktif membutuhkan tanggal chick-in aktual dan populasi awal kandang >0; sebelum DOC, periode tetap DRAFT dan belanja persiapan tetap boleh. Maksimal satu ACTIVE per kandang melalui constraint atomik server.

Rancangan sederhana R1: bila rincian DOC per bangunan belum ada, baik periode baru maupun ONB-10 boleh memakai `building_allocation_status=PENDING` dan `unallocated_doc_count`. Alokasi diketahui + belum teralokasi harus tepat populasi awal, bukan bangunan fiktif/pembagian rata. Rincian dapat dilengkapi kemudian tanpa menghalangi recording global atau biaya kandang. Saat alokasi COMPLETE, jumlah semua bangunan tepat populasi awal; angka per bangunan tidak diklaim jika sumbernya belum tersedia. Melengkapi alokasi merevisi konteks awal, bukan menciptakan DOC kedua atau transfer ayam.

**CYC-04:** DOC per bangunan boleh lebih kecil dari kapasitas, termasuk nol. Jika melebihi kapasitas, tampilkan peringatan dan minta persetujuan owner beralasan menurut D-12; tidak mengubah kapasitas master otomatis.

### 8.2 Dua sumbu status yang berbeda

| Sumbu | Status | Aturan transisi |
|---|---|---|
| Pemeliharaan | `DRAFT` | Persiapan; belum ada DOC aktif. Boleh beberapa rencana masa depan. |
| Pemeliharaan | `ACTIVE` | DOC masuk; panen sebagian tetap aktif. Hanya satu per kandang. |
| Pemeliharaan | `FINISHED` | Tidak ada ayam hidup tersisa; Owner mendeklarasikan kandang kosong dan merekonsiliasi populasi sejauh diketahui. Lampiran tidak wajib. Tidak berarti uang sudah cair. |
| Pemeliharaan | `CANCELLED` | Rencana dibatalkan sebelum chick-in; biaya persiapan tetap ada dan dialokasikan ulang/di luar periode dengan audit. |
| Keuangan | `OPEN` | Biaya, upah, settlement, serta alokasi masih dapat diselesaikan melalui alur normal. |
| Keuangan | `REVIEW` | Checklist akhir diperiksa; tidak dianggap terkunci. |
| Keuangan | `LOCKED` | Snapshot laporan telah disahkan. Koreksi perlu buka kembali dengan alasan dan versi laporan baru. |

- **CYC-05:** periode berikutnya boleh aktif setelah fisik sebelumnya `FINISHED`, walau keuangan sebelumnya `OPEN/REVIEW` atau RHPP belum cair.
- **CYC-06:** tidak mengubah `FINISHED` kembali ke `ACTIVE` jika sudah ada periode fisik lain aktif. Koreksi historis populasi melalui review owner, bukan membuat dua periode aktif.
- **CYC-07:** selesai fisik pada mode OFF/DAILY membutuhkan deklarasi Owner tentang tanggal selesai, tidak ada ayam hidup tersisa, serta rekonsiliasi kepala ayam sejauh diketahui; tidak mensyaratkan tiket DO atau daily recording lengkap. Sumber/bukti boleh dilampirkan bila ada, tetapi lampiran dan alasan tidak wajib. Komponen panen/mati yang belum diketahui tetap unknown dan tidak dipalsukan menjadi kematian. Status kelengkapan recording/produksi terpisah dari penyelesaian fisik; metrik yang tidak didukung tetap unavailable.

  Simpan deklarasi terstruktur: cycle, tanggal selesai sebenarnya, Owner deklarator, waktu persetujuan, pernyataan kandang kosong, hitungan akhir jika diukur, rekap disposition/selisih yang diketahui, lampiran opsional bila tersedia, serta versi. Pernyataan kosong tanpa pengukuran tidak ditampilkan sebagai sensus terukur. Tombol/command “Selesai fisik” berbeda dari “Kunci laporan keuangan”; yang pertama tidak otomatis menutup hak/biaya atau mengubah financial_status menjadi LOCKED.
- **CYC-08:** masa kosong dihitung dari selesai fisik ke chick-in berikutnya, bukan tanggal RHPP atau tanggal uang diterima.

### 8.3 Checklist kunci keuangan

**CYC-09:** owner melihat: biaya belum diperiksa, klaim kas belum selesai, dokumen belum dialokasikan, gaji/upah yang belum difinalkan, settlement belum lengkap, serta status sinkronisasi perangkat yang terakhir diketahui. Inventaris stok, penggunaan, opname, atau valuasi gas bukan checklist maupun gate R1; bagian persediaan rinci berlaku di R2. Server tidak bisa menjamin tidak ada draft yang masih tersimpan di HP offline.

Kunci keuangan dapat menyimpan utang/piutang belum lunas jika nilai dan alokasinya telah diakui. Setelah dikunci, pembayaran atas utang/piutang tersebut boleh dicatat dengan tanggal pembayaran aktual dan menaut dokumen terkunci; tidak mengubah biaya/penghasilan snapshot. Mengubah nilai hak, rate, alokasi, atau settlement memerlukan reopen.

**CYC-10:** late sync ke periode terkunci tidak diterapkan diam-diam. Simpan sebagai usulan koreksi yang menunggu owner, dengan isi asli dan alasan konflik.

### 8.4 Gate penutupan dan matriks aksi

**CYC-11:** `financial_status=LOCKED` hanya diperbolehkan bila:

1. Fisik telah FINISHED menurut CYC-07; mode DETAIL memerlukan rekonsiliasi populasi, mode DAILY memerlukan status coverage recording yang jujur bila performa hendak diklaim, dan mode OFF cukup deklarasi akhir yang disahkan serta pengungkapan komponen produksi yang tidak diketahui. Kekurangan recording/produksi tidak otomatis menghalangi final biaya jika hak/biaya aktual tidak bergantung pada angka tersebut, tetapi tetap memblokir klaim performa lengkap. Rencana CANCELLED sebelum DOC dapat dikunci setelah semua biaya persiapannya direkonsiliasi; tidak memerlukan panen fiktif.
2. Semua klaim belanja yang ditaut ke periode sudah mempunyai resolusi terminal, tidak ada pengajuan biaya yang masih menunggu review untuk periode tersebut.
3. Gaji yang berlaku sudah difinalkan; pekerjaan berupah yang selesai pada periode sudah disetujui/ditolak dengan alasan. Kasbon usaha tetap independen dari agreement dan direkonsiliasi pada saldo ABK-nya sendiri.
4. Semua pembelian konsumabel R1 yang dibebankan ke periode sudah diterima dan disetujui owner pada nilainya; tidak ada klaim belanja terkait yang masih menunggu review. R1 mengakui biaya saat penerimaan+persetujuan dan tidak menunggu usage, saldo stok, sisa gas, atau rekonsiliasi INV. Peralatan tahan lama diberi klasifikasi ringan dan tidak otomatis menjadi biaya periode.
5. Seluruh biaya sumber yang terkait telah dialokasikan, atau owner secara eksplisit menetapkan sisa sebagai biaya di luar periode dengan alasan; sumber tidak hilang dari laporan usaha.
6. Hak settlement diverifikasi dan klasifikasi penghasilan versus tabungan/utang/biaya lengkap. Jika hanya pembayaran diketahui, catat kas sebagai belum dipadankan, bukan otomatis seluruh hak terverifikasi/lunas; classification PENDING, laba tidak final, keuangan tetap OPEN/REVIEW. Input ringkas tidak menahan kerja harian atau siklus berikutnya. Tidak ada hak settlement memerlukan deklarasi eksplisit Owner, bukan asumsi nol; lampiran opsional.
7. Owner mengakui waktu sinkron terakhir dan komponen di luar cakupan laporan, misalnya depresiasi yang belum diperhitungkan. Ini tidak mengizinkan melewati klaim kas, gaji, atau klasifikasi settlement yang belum selesai.
8. Cakupan historis biaya sejak awal periode sudah direkonsiliasi jika menggunakan onboarding tengah siklus. Snapshot dengan cakupan parsial tetap boleh diterbitkan sebagai laporan sejak cutoff, bukan laba final seluruh periode.

Utang/piutang yang jumlahnya final tetapi belum dibayar **tidak memblokir lock**. Recording `DAILY` yang partial/gap atau tidak diaktifkan tidak memblokir lock jika data finansial/aktual final sudah cukup, tetapi snapshot tidak boleh mengklaim coverage/performa yang tidak ada. Snapshot sementara boleh diekspor saat REVIEW, tetapi tidak berlabel final dan tidak mengubah state menjadi LOCKED. Tidak ada tombol “paksa final” yang mengabaikan gate di atas.

| Aksi | Physical DRAFT | Physical ACTIVE | Physical FINISHED + finance OPEN/REVIEW | Finance LOCKED |
|---|---|---|---|---|
| Rencana/biaya persiapan | Boleh sesuai izin | Boleh | Biaya aktual/alokasi boleh | Perubahan biaya perlu reopen |
| Event ayam/pakan produksi/panen baru | Tidak sebelum chick-in | Boleh dalam tanggal dan scope valid | Hanya koreksi historis/late report melalui review, bukan pemeliharaan baru | Review + reopen jika mengubah snapshot |
| Pembelian barang/jasa operasional R1 | Boleh sesuai bukti kejadian | Boleh | Boleh sesuai penerimaan, persetujuan, dan alokasi biaya | Usulan koreksi, bukan posting biaya langsung ke periode |
| Finalisasi gaji/upah, settlement, alokasi | Sesuai transaksi yang sudah nyata | Boleh sesuai progres | Boleh | Reopen untuk mengubah nilai hak/biaya |
| Bayar utang/piutang yang nilainya sudah disahkan | Boleh | Boleh | Boleh | Boleh, tanpa mengubah biaya snapshot |

Tanggal event produksi tidak boleh sebelum chick-in atau di luar interval pemeliharaan yang telah disahkan. Koreksi tanggal selesai/chick-in diperiksa agar tidak membuat interval pemeliharaan bertumpuk pada kandang yang sama. Biaya masa kosong bukan event produksi dan mengikuti tanggal sebenarnya.

Rencana CANCELLED tidak menerima event ayam/panen. Biaya persiapan yang sudah terjadi tetap dapat diselesaikan/reklasifikasi sebelum lock; setelah lock hanya pembayaran hak/kewajiban yang sudah diakui atau jalur reopen yang tersedia.

<a id="s09"></a>
## 9. Fondasi transaksi, persetujuan, dan audit

### 9.1 Empat status independen

| Dimensi | Nilai | Makna |
|---|---|---|
| Review | `DRAFT`, `SUBMITTED`, `NEEDS_CORRECTION`, `APPROVED`, `REJECTED` | Apakah isi laporan sudah diperiksa |
| Pembukuan | `UNPOSTED`, `POSTED`, `REVERSED` | Apakah efek saldo/biaya sudah dibukukan |
| Pelunasan | `UNPAID`, `PARTIAL`, `PAID` | Berapa kewajiban/hak sudah diselesaikan, termasuk offset yang sah |
| Pengiriman (label layar: Status Kirim) | lokal, antre, terkirim, konflik, ditolak izin | Apakah server menerima operasi; bukan status pembayaran |

UI menampilkan hanya status yang relevan, bukan empat dropdown yang wajib dipahami ABK.

Transisi review yang diperbolehkan: DRAFT→SUBMITTED; SUBMITTED→APPROVED/NEEDS_CORRECTION/REJECTED; NEEDS_CORRECTION→SUBMITTED dengan versi baru. REJECTED dapat diajukan ulang sebagai revisi tertaut selama sumber belum posted/diresolusi terminal. Dokumen posted tidak dapat diganti menjadi rejected untuk membatalkan uang; gunakan reversal/koreksi. Owner boleh menjalankan simpan+approve+post sebagai satu command atomik untuk transaksi yang memang ia berwenang catat. Status pelunasan dihitung dari application valid, tidak dapat dipilih bebas agar tampak lunas.

Entri recording mode `DAILY` (feed, mati, afkir, dan sampling) menjadi efektif saat server memvalidasi dan menerima submit; tidak menunggu persetujuan manual owner. Koreksi berversi menggantikan nilai efektif hari itu, bukan menambahkannya. Recording produksi tidak memutasi stok atau biaya pembelian. Ini terpisah dari klaim belanja ABK yang tetap menunggu review/persetujuan owner.

### 9.2 Aturan posting

- **FIN-01:** satu kejadian sumber dapat menimbulkan beberapa efek tertaut (utang, kas, biaya) dalam transaksi atomik; fitur stok adalah R2. Masing-masing mempunyai jenis efek; tidak diproses sebagai beberapa pengeluaran terpisah.
- **FIN-02:** dokumen `APPROVED` belum tentu dibayar. Dokumen dibayar sebagian tidak boleh dipaksa `PAID`. Nilai pelunasan = cash payment valid + offset sah, bukan sekadar jumlah transfer bank.
- **FIN-03:** setelah `POSTED`, nominal, pihak, unit, dan alokasi tidak dapat ditimpa. Koreksi memakai reversal/adjustment terhubung, alasan, pelaku, dan pengecekan dampak. Jangan hanya mengedit total laporan.
- **FIN-04:** draft boleh dihapus jika belum menimbulkan efek server; posted record tidak hard-delete. Bukti boleh diganti hanya dengan histori versi dan izin yang sesuai.
- **FIN-05:** satu request mempunyai idempotency key dan payload hash. Key sama/payload sama mengembalikan efek/ID hasil sama; key sama/payload berbeda ditolak. Key berlaku pada tenant atau ruang pribadi pemilik dan jenis operasi yang benar. Replay tetap memerlukan izin terkini dan filter field; receipt lama bukan jalan untuk membaca data setelah hak dicabut.
- **FIN-06:** total pelunasan tidak boleh melebihi kewajiban tersisa. Pembayaran berlebih harus diklasifikasikan sebagai uang muka/piutang atau pengembalian, bukan saldo kewajiban negatif tersembunyi.
- **FIN-07:** approval pengeluaran setelah kejadian bukan izin membelanjakan uang sebelumnya. Fitur permintaan belanja adalah rencana terpisah; bila disetujui belum mengurangi kas/stok/biaya sampai realisasi.
- **FIN-08:** setiap perubahan signifikan menulis audit: actor sebenarnya, waktu server, waktu kejadian, objek, versi sebelum/sesudah yang relevan, alasan, request ID, dan proxy author bila ada. Audit tidak menyimpan password, token, URL rahasia, atau isi dokumen privat yang tidak perlu.
- **FIN-09:** transaksi refund/retur/reversal memakai jenis transaksi dan referensi asal; form nominal biasa tetap nonnegatif. Validasi mencegah refund yang sama diterapkan dua kali.

### 9.3 Pengeluaran telah terjadi tetapi belum disetujui

**FIN-10:** menolak laporan ABK tidak membuat uang yang sudah dibelanjakan kembali secara ajaib.

Tampilkan tiga nilai pada kas pegangan:

```text
saldo_tercatat = saldo_awal + kas_masuk_posted - kas_keluar_posted
keluar_belum_diverifikasi = klaim belanja nyata yang belum diselesaikan
perkiraan_uang_di_tangan = saldo_tercatat - keluar_belum_diverifikasi
```

Formula perkiraan hanya ditampilkan sebagai nominal jika tidak ada penerimaan tunai pending atau konflik sumber dana yang membuatnya tidak dapat dipercaya. Jika parent transfer belum diverifikasi atau hasilnya negatif, tampilkan “belum dapat dipastikan—perlu rekonsiliasi”, beserta saldo buku, klaim keluar, dan penerimaan pending terpisah. Jangan clamp selisih ke nol atau menyimpulkan ABK kekurangan uang fisik dari catatan yang belum lengkap.

Penerimaan uang oleh ABK mengikuti transfer owner yang sudah diposting; jika penerimaan diperselisihkan, beri status rekonsiliasi, bukan menciptakan uang tambahan. Laporan penerimaan baru dari ABK tanpa transfer/bukti yang diverifikasi belum menambah saldo terkonfirmasi.

- `SUBMITTED/NEEDS_CORRECTION/REJECTED` atas belanja yang diklaim nyata tetap masuk daftar klaim belum selesai.
- Saat disetujui, klaim diubah menjadi efek kas/utang dan biaya konsumabel atau klasifikasi peralatan yang sah secara atomik; klaim tidak lagi ikut pengurang sementara. Tidak ada efek stok/usage R1.
- Jika transaksi ternyata tidak terjadi/duplikat, Owner menyelesaikan klaim dengan alasan keputusan dan referensi duplikat jika ada; lampiran opsional. Alasan koreksi berbeda dari alasan wajib karena tidak memiliki nota. Jangan memaksa ABK menghapus laporan untuk menutup selisih.
- Jika uang harus dikembalikan, catat kejadian pengembalian/refund sebenarnya. Jangan otomatis memotong gaji karena kategori belanja ditolak.
- Bila klaim lebih besar dari saldo, minta klarifikasi sumber dana (kas lain/ABK menalangi/kesalahan). Tidak memposting saldo kas negatif untuk menyembunyikan persoalan.
- Dashboard biaya terkonfirmasi dan biaya dilaporkan belum diperiksa dipisahkan. Laba tidak boleh berlabel lengkap selama klaim material belum selesai.

### 9.4 Resolusi klaim kas yang deterministik

**FIN-11:** `cash_claim.resolution` terpisah dari approval. Default `UNRESOLVED`; state berikut terminal dan membutuhkan owner. Satu klaim hanya dapat mempunyai satu resolusi efektif, jumlah klaim parsial diselesaikan melalui allocation lines dengan total yang tepat.

| Resolusi | Efek | Kapan berhenti menjadi pengurang kas sementara |
|---|---|---|
| `POSTED_PURCHASE` | Pembelian barang/jasa operasional R1 diterima; post cash movement atau payable/reimbursement sesuai sumber, serta biaya barang/jasa habis pakai atau klasifikasi peralatan sesuai jenisnya | Atomik saat efek keuangan menggantikan klaim; tidak ada efek stok/usage R1 |
| `NOT_OCCURRED` | Bukti menunjukkan transaksi tidak terjadi; tanpa cash out/cost | Saat owner menyelesaikan dengan alasan/bukti |
| `DUPLICATE_OF` | Menaut klaim/dokumen kanonis untuk kejadian yang sama; tidak membuat efek kedua | Saat link disahkan; hanya klaim kanonis yang dihitung bila masih unresolved |
| `PAYER_CORRECTED` | Ternyata bukan dari kas pegangan; owner mengesahkan sumber lain, misalnya ABK menalangi dan reimbursement | Saat efek sumber yang benar diposting atomik; kas pegangan tidak turun |
| `POSTED_RECOVERABLE` | Uang memang keluar tetapi menjadi tagihan pengembalian pada toko/ABK/pihak lain, bukan biaya yang disetujui | Saat cash out + receivable yang sah dibukukan; refund berikutnya melunasi receivable |

`REFUND_REQUIRED` sebelum nilai/pihak/kewajiban pengembalian disahkan adalah alasan review, **bukan** resolusi terminal. Piutang kepada ABK tidak dibuat sebagai hukuman otomatis; perlu keputusan serta bukti/kesepakatan yang sesuai. Refund yang sudah diterima langsung dicatat melalui pasangan keluar-ke-recoverable dan penerimaan pelunasan agar kejadian kas nyata tetap dapat ditelusuri. Setelah terminal, approval ulang klaim yang sama ditolak; koreksi melalui reversal resolusi/effect terkait, bukan membuat expense kedua.

### 9.5 Receipt idempotency durable

**FIN-12:** server menyimpan `command_receipt` unik `(data_space, command_type, operation_id)`, payload hash, aktor, status processing/committed/terminal-rejected, object/effect IDs, dan waktu. Receipt commit dan ledger effects berada dalam transaksi atomik yang sama.

Payload hash memakai isi command bisnis kanonis, scope, dan referensi sumber yang tidak boleh berubah. Token/sesi serta `request_recovery_epoch` adalah envelope autentikasi/transport, bukan perubahan nominal/payload bisnis; refresh sesi atau rekonsiliasi epoch tidak menyebabkan mismatch palsu. Epoch asal operasi tetap disimpan untuk audit/recovery dan tidak ditimpa epoch request terbaru.

- Dua request key sama secara bersamaan hanya mengeksekusi satu command; lainnya menunggu atau mendapat processing lalu replay hasil yang sama.
- Untuk command ledger sinkron R1, `processing` hanya berada dalam transaksi database yang belum commit, bukan row processing yang dicommit sendiri. Crash/timeout me-rollback claim dan effects bersamaan; retry mengambil ulang key secara aman. Unique lock menunggu dengan timeout terbatas, lalu client retry key sama. Tidak ada status processing permanen yang bergantung pembersihan manual.
- Jika database commit berhasil tetapi response hilang, retry menemukan receipt committed; tidak mem-posting ulang.
- Jika grant dicabut sesudah commit, user asli yang masih terautentikasi boleh menerima acknowledgement minimal `COMMITTED_NO_DETAIL` hanya untuk operation miliknya, tanpa data objek/nominal/pihak. User lain atau sesi tidak sah tidak mendapat acknowledgement ini. Bila status belum dapat diketahui, client menandai `OUTCOME_UNKNOWN` dan mempertahankan operation ID; **tidak otomatis membuat ID/kejadian baru** untuk mengatasi 401/403/timeout. Penyelesaian dibantu owner yang masih berhak.
- Background export/job memakai receipt penerimaan job dan outbox atomik; `job accepted` bukan berarti financial effect selesai. Worker yang kelak menghasilkan posting menggunakan command/effect key unik tersendiri yang tertaut job, dengan invariant idempotensi yang sama.
- Identitas operasi, hash, status final, dan referensi hasil dipertahankan selama data finansial/stock/production sumber masih disimpan. Bukan cache Redis TTL singkat. Isi response dapat dipangkas, identitas dedupe tidak.
- Error sementara setelah rollback tidak dianggap committed dan boleh retry dengan key sama. Error terminal memerlukan koreksi yang menghasilkan operation ID baru, menaut dokumen/operasi lama; tidak retry tanpa henti.
- Penghapusan menurut kebijakan retensi harus mempertahankan mekanisme penolakan replay lama/tombstone yang aman selama payload lama masih dapat diterima. Policy ini diputuskan bersama Q-11.

<a id="s10"></a>
## 10. Kas kandang, pembelian, pembayaran, dan piutang/utang

Transaksi pembelian R1 mencakup kebutuhan operasional barang/jasa; gas, solar, listrik, jasa, dan peralatan adalah contoh, bukan daftar yang membatasi belanja. DOC, pakan, serta sapronak mitra dapat dicatat Owner sebagai informasi penerimaan, bukan inventory atau biaya R1. Barang/jasa habis pakai diakui sebagai biaya saat diterima dan disetujui Owner; tidak ada pencatatan pemakaian rutin atau biaya kedua saat dipakai. Peralatan mendapat klasifikasi ringan konsumabel/tahan lama; yang tahan lama tidak otomatis menjadi biaya periode dan bukan full asset system. Review/persetujuan belanja dan konfirmasi pembayaran tetap oleh Owner secara online; tidak ada financial auto-post.

### 10.1 Akun dana

**CASH-01:** owner dapat membuat kas tunai usaha, rekening usaha yang dicatat manual, kas kandang, dan subakun kas pegangan ABK. Pemilik saldo dan pemegang uang adalah konsep berbeda. Rekonsiliasi saldo fisik tidak mengubah pengeluaran historis.

**CASH-02:** transfer antar akun usaha menghasilkan sisi keluar dan masuk terhubung, tanpa pendapatan/biaya. Pada laporan gabungan usaha, transfer internal dieliminasi. Untuk kas pegangan ABK, simpan kandang, pemegang, tujuan dana, dan penyerahan/konfirmasi penerimaan.

### 10.2 Alur yang wajib didukung

| ID | Skenario | Efek yang benar |
|---|---|---|
| CASH-03 | Owner menyerahkan RpX uang pegangan | Kas sumber turun, kas pegangan ABK naik; biaya tetap nol. |
| CASH-04 | Dana khusus belanja barang tertentu | Transfer seperti CASH-03 dengan tujuan/budget; realisasi ditautkan, sisa dapat dikembalikan atau tetap dipegang dengan keputusan owner. |
| CASH-05 | ABK belanja kebutuhan operasional dari pegangan, misalnya gas, solar, listrik, jasa atau peralatan | Dokumen + sumber kas pegangan; setelah Owner menyetujui, kas turun dan barang/jasa habis pakai diterima menjadi biaya. Peralatan tahan lama diklasifikasikan terpisah, bukan biaya periode otomatis. Contoh bukan daftar barang yang dibatasi sistem. |
| CASH-06 | Owner membayar pembelian R1 langsung ke toko | Pembelian serta pembayaran tertaut ke akun owner/usaha yang sebenarnya; tidak membuat kas ABK fiktif. |
| CASH-07 | Pembelian barang/jasa secara kredit | Barang/jasa habis pakai yang diterima/disetujui menjadi biaya dan utang; peralatan tahan lama menjadi kewajiban dan klasifikasi terpisah, bukan biaya otomatis. Kas turun saat dibayar. |
| CASH-08 | ABK menalangi pembelian R1 dengan uang pribadi | Pembelian yang disetujui menghasilkan utang reimbursement kepada ABK; pembayaran penggantian melunasi utang, tidak membuat biaya lagi. Dana pribadi ABK bukan kasbon usaha. |
| CASH-09 | Bayar uang muka toko sebelum barang datang | Uang muka supplier, bukan biaya/barang diterima; dialihkan saat penerimaan aktual dikonfirmasi. |
| CASH-10 | Sisa dana dikembalikan ABK | Transfer kembali dari pegangan ke kas sumber, bukan pendapatan. |
| CASH-11 | Refund pembelian | Menaut pembelian asli, nilai yang dikembalikan, penerimaan uang atau pengurang utang; biaya konsumabel dibalik sesuai nilai asal. Tidak membuat inventory R1. |
| CASH-12 | Kas fisik tidak cocok | Opname kas mencatat saldo buku, saldo fisik, selisih, bukti opsional, dan review. Penyesuaian butuh Owner; foto/bukti yang tidak ada tidak mewajibkan alasan dan tidak otomatis menjadi biaya lain-lain. |

### 10.3 Field transaksi belanja minimum

Daftar berikut adalah kelengkapan **dokumen sebelum posting**, bukan seluruh field wajib yang harus diisi ABK. Jalur catat cepat mengikuti CASH-16; data klasifikasi boleh dilengkapi owner tanpa mengubah bukti asli.

- Tenant, pembuat, kandang atau biaya umum usaha, tanggal kejadian, serta barang/jasa/keperluan. Gas, solar, listrik, perlengkapan dan peralatan adalah contoh, bukan whitelist jenis belanja.
- Pihak toko/penerima dan catatan keperluan opsional; pihak dapat teks sementara yang kemudian dipadankan master tanpa mengganti bukti asli.
- Satu atau beberapa baris barang/jasa, nominal, kuantitas/unit bila diketahui dan relevan; tidak wajib SKU atau data inventory.
- Status penerimaan, sumber dana, nominal telah dibayar, dan penerima reimbursement jika ditalangi.
- Alokasi periode atau status di luar/belum dialokasikan; tidak memerlukan bangunan maupun opening-stock position.
- Foto/nota/bukti bersifat opsional. Ketiadaan bukti tidak mewajibkan alasan; kelengkapan pembukuan yang belum diketahui tetap dapat menunggu review Owner.

**CASH-13:** satu invoice boleh dibayar beberapa kali dari beberapa akun yang sah, tetapi total pembayaran lintas akun tidak boleh dihitung sebagai beberapa pembelian. Pencatatan manual pembayaran bukan konfirmasi bank otomatis.

**CASH-14:** penjualan kotoran, karung, sekam bekas, atau pemasukan sampingan lain dicatat sebagai pendapatan/kas atau piutang yang relevan. Penjualan ayam yang sudah menjadi bagian settlement tidak dicatat sebagai pendapatan sampingan kedua kali; scope panen dan hak menjual harus dinyatakan.

**CASH-15:** R1 mencatat modal, prive, utang usaha kepada Owner, dan talangan Owner hanya pada buku usaha. Modal bukan pendapatan; prive bukan biaya; talangan pembelian barang/jasa habis pakai menjadi biaya saat diterima dan disetujui plus utang kepada Owner, sedangkan peralatan tahan lama diklasifikasi ringan tanpa otomatis menjadi biaya. Owner dapat memilih kontribusi eksplisit. Penggantian talangan hanya melunasi utang. Akun pribadi di luar aplikasi adalah pihak/sumber eksternal, bukan kas usaha fiktif. Jika satu rekening fisik bercampur, saldo kas usaha adalah bagian yang dialokasikan ke usaha, bukan seluruh saldo bank. Aktivasi buku pribadi kelak menggunakan cutoff dan linkage yang disahkan, tidak memutar ulang kas/biaya historis.

**CASH-16:** form ABK meminta keperluan/barang/jasa, nominal, pembayar/sumber dana, dan tanggal kejadian. Bisa teks baru atau saran barang terakhir; tidak wajib membuat master dahulu. Bukti opsional tanpa alasan wajib jika tidak ada. Kandang/pemegang/tanggal boleh dari konteks terlihat dan dapat diperbaiki. ABK tidak wajib memilih klasifikasi biaya/aset/pajak/coverage/overhead. Pengajuan tetap klaim sampai Owner meninjau; Owner melengkapi klasifikasi dan alokasi sebelum posting. Unknown tetap pending, bukan nol; nota susulan menaut klaim sama tanpa biaya kedua.

**FIN-13:** owner dapat memeriksa batch pengajuan online. Sebelum konfirmasi tampilkan jumlah dokumen, total, sumber dana, dan pengecualian; setiap dokumen tetap dapat dibuka. Hanya dokumen lengkap dan versi yang ditinjau boleh diposting. Proses menghasilkan hasil per dokumen dengan command receipt sendiri; dokumen berubah/invalid tetap pending, bukan ikut disetujui. Satu dokumen beserta semua efeknya tetap atomik; batch bukan satu approval blanket tanpa validasi. Tidak ada auto-approval karena nominal kecil pada R1. Umur pengajuan dan koreksi tampil di inbox agar owner tidak menjadi antrean yang tak terlihat.

Aksi batch R1 berlabel “Setujui dan bukukan” (`APPROVE_AND_POST`), bukan persetujuan yang diam-diam diartikan pembayaran. Cash movement hanya untuk uang yang memang telah berpindah dan diverifikasi; invoice kredit tetap unpaid/payable. Selection menyimpan batch ID, action, daftar dokumen/expected versions, dan hash yang dibekukan saat konfirmasi. Hasil per dokumen membedakan APPLIED, ALREADY_POSTED, NEEDS_DATA, DEPENDENCY_PENDING, VERSION_CONFLICT, dan DENIED. Retry selection yang sama mengembalikan hasil tanpa efek kedua; revisi selection membuat versi/ID baru tetapi constraint efek sumber tetap mencegah dokumen yang sudah posted dibukukan lagi. Mutasi review/ledger suatu dokumen berhasil bersama atau rollback bersama.

<a id="s11"></a>
## 11. Pembebanan biaya dan laporan periode

### 11.1 Pisahkan tiga pertanyaan

1. **Uang keluar kapan dan dari mana?** Dijawab cash movement.
2. **Barang/jasa menjadi biaya kapan?** Dijawab cost recognition.
3. **Biaya menjadi beban kandang/periode mana?** Dijawab cost allocation.

**COST-01:** setiap biaya mempunyai sumber tunggal. Penerimaan invoice, pembayaran invoice, dan alokasi invoice tidak boleh masing-masing membuat biaya baru.

R1 mengakui biaya barang habis pakai saat diterima dan jasa saat pekerjaan selesai, setelah disetujui Owner; gas/solar termasuk barang habis pakai dan pemakaian berikutnya tidak menimbulkan biaya lagi. Penerimaan DOC, pakan, dan sapronak mitra di R1 bersifat informasional. Persediaan, pemakaian stok, serta penilaian stok adalah R2 dan bukan prasyarat biaya/penutupan R1.

| Jenis | Pengakuan default | Tidak boleh dilakukan |
|---|---|---|
| Jasa/barang langsung habis | Saat diterima/pekerjaan selesai dan disetujui | Menambah biaya lagi ketika utang dibayar |
| Gas/solar konsumabel R1 | Saat diterima dan disetujui Owner | Menunggu pencatatan pemakaian atau membebankan lagi saat pemakaian |
| Barang persediaan (R2) | Saat pemakaian/disposal yang disahkan | Membebankan pembelian sekaligus pemakaian |
| Gaji periode | Saat hak gaji periode difinalkan; proyeksi berjalan diberi label terpisah | Mengakui kasbon sebagai biaya tambahan |
| Upah pekerjaan | Saat pekerjaan selesai dan nilai disetujui | Menunggu payroll untuk mengakui atau mencampurnya ke slip gaji |
| Peralatan tahan lama R1 | Klasifikasi ringan sebagai tahan lama; bukan biaya operasional otomatis dan belum masuk full asset system | Menganggap semua pembelian alat sebagai biaya satu periode |
| Uang muka, transfer, pokok pinjaman | Bukan biaya | Memasukkannya ke kategori pengeluaran operasional biasa |

Ledger aset dan depresiasi bukan R1. Klasifikasi peralatan tahan lama tidak membuat biaya periode secara otomatis; jika kelak diakui sebagai beban, penyesuaian terpisah harus disahkan Owner dan terlihat pada laporan.

### 11.2 Scope alokasi

- **COST-02:** biaya boleh berada pada tenant umum, kandang tanpa periode, periode tanpa bangunan, atau periode+bangunan. Jangan memaksa seluruh biaya dibagi per bangunan.
- **COST-03:** biaya persiapan masa kosong tidak otomatis milik periode sebelumnya/berikutnya. Owner boleh menaut periode rencana berikutnya atau tetap di luar periode. Jika rencana batal, biaya tetap nyata dan perlu review alokasi.
- **COST-04:** biaya bersama dapat dibagi nominal tetap, persentase, atau proporsi driver terpilih (misalnya populasi awal snapshot/hari layanan). Simpan driver, nilai driver, rentang tanggal layanan, dan hasil pembagian. Tidak memilih driver otomatis.
- **COST-05:** nominal Rupiah berupa integer tanpa sen; persentase ditampilkan hingga dua desimal, kalkulasi fixed-point/exact arithmetic bukan binary float. Tetapkan dahulu nominal yang hendak dialokasikan; bagian sumber yang belum dialokasikan tetap terlihat dan tidak ikut dibagikan paksa. Hitung share proporsional presisi tinggi, ambil floor tiap baris, lalu distribusikan hanya residu pembulatan dari nominal alokasi menurut pecahan terbesar; tie memakai urutan tersimpan. Persentase parsial menyisakan porsi belum dialokasikan, bukan dinormalisasi menjadi 100% diam-diam. Alokasi + belum dialokasikan tepat nilai sumber, setiap bagian nonnegatif. Reversal memakai koreksi tertaut, bukan alokasi biaya negatif.
- **COST-06:** perubahan alokasi tidak memindahkan kas. Periode tujuan yang terkunci perlu dibuka kembali; laporan lama tetap tersedia sebagai versi lama.
- **COST-07:** mengalokasikan biaya ke bangunan tidak mengizinkan menghitung FCR/produksi per bangunan jika data produksinya tidak ada.

### 11.3 Definisi laporan

```text
biaya_periode = jumlah cost entry sah yang dialokasikan ke periode
biaya_langsung = bagian biaya yang secara langsung ditaut periode
biaya_bersama_teralokasi = bagian biaya bersama dengan allocation plan sah
biaya_belum_dialokasikan = biaya nyata yang belum mendapat alokasi periode

biaya_owner_di_luar_settlement_periode
  = biaya_periode - cakupan_biaya_yang_sudah_mengurangi_penghasilan_settlement

laba_manajerial_periode = penghasilan_kemitraan_terverifikasi
                         + pendapatan_sampingan_periode
                         - biaya_owner_di_luar_settlement_periode
```

**COST-08:** sebelum menyebut angka laba final/lengkap, periksa gaji/upah, klaim belanja, alokasi, settlement, dan komponen biaya yang sengaja belum dicakup. Jika belum lengkap, tampilkan **“hasil sementara berdasarkan biaya tercatat”** serta daftar kekurangannya.

**COST-09:** biaya per ekor harus menyatakan denominator: `per DOC hidup diterima` atau `per ekor panen`. Biaya per kg memakai kg panen actual; selama belum panen dapat memakai proyeksi hanya dengan label. Jangan membandingkan denominator berbeda tanpa peringatan.

**COST-10:** membandingkan biaya periode aktif hari ke-15 dengan total periode selesai tidak boleh diberi label “lebih boros” otomatis. Pilihan: bandingkan umur sama, biaya per denominator yang sama, atau tampilkan keterbatasan pembanding.

### 11.4 Matriks cakupan biaya versus settlement

**COST-11:** `biaya_periode` hanya cost entry owner yang telah diakui; sapronak PT yang semata-mata menjadi rincian hitungan net PT adalah data analitis, bukan cost entry owner kedua. Setiap cost allocation mempunyai `settlement_coverage_amount`, default nol, dan link ke komponen settlement terverifikasi yang **sudah mengurangi** penghasilan net. Nilai coverage tidak boleh melampaui alokasi biaya atau nilai komponen net yang benar-benar dipakai, termasuk jika satu komponen menutup beberapa biaya.

| Kelas kejadian | Masuk biaya periode owner? | Coverage terhadap net settlement | Efek terhadap laba manajerial |
|---|---|---|---|
| Gaji, upah pekerjaan, gas/solar konsumabel owner, jasa owner yang tidak dikurangi di net PT | Ya, satu cost source saat diterima/diakui | Nol | Dikurangkan satu kali |
| Belanja ditalangi ABK/owner | Ya sesuai penerimaan/pemakaian/jasa | Nol kecuali ada coverage terverifikasi | Tetap dikurangkan; pembayaran reimbursement bukan cost lagi |
| Biaya operasional dibayarkan PT dan dipotong dari hak owner pada net settlement | Ya jika didokumentasikan sebagai biaya owner; utang kepada PT diselesaikan lewat potongan | Sebesar komponen yang sudah mengurangi net; link invoice/cost source wajib | Bagian tertutup tidak dikurangkan lagi |
| Sapronak PT yang sudah masuk hitungan penghasilan kemitraan net | Tidak pada ledger biaya owner; ada partner analytic lines | Tidak membuat coverage palsu karena bukan cost entry owner | Tidak dikurangkan lagi dari penghasilan net |
| PT menambah reimburse/kompensasi biaya ke penghasilan settlement | Biaya asal tetap ya | Nol untuk penambahan penghasilan ini | Tambahan penghasilan dan biaya asal sama-sama tampil; biaya tetap dikurangkan |
| Biaya sebagian telah dipotong PT | Ya seluruh biaya sah | Hanya bagian yang terbukti sudah mengurangi net | Hanya sisa biaya di luar coverage yang dikurangkan |
| Modal, transfer, advance, pokok pinjaman, tabungan masih milik owner, pembelian aset | Tidak, kecuali cost terpisah yang benar-benar diakui | Tidak | Tidak dikurangkan sebagai biaya operasional |

Contoh: gas owner Rp1.000.000; Rp400.000 sudah mengurangi net penghasilan PT. Laporan biaya gas tetap Rp1.000.000; coverage Rp400.000; pengurang laba setelah net PT hanya Rp600.000. Jika PT justru **menambah** reimburse Rp400.000 ke penghasilan, coverage nol dan pengurang biaya tetap Rp1.000.000.

Coverage mempunyai ID, cost allocation, settlement component/version, nominal, dan persetujuan; perubahan membuat revisi, bukan flag bebas “sudah dihitung”. Komponen periode lama tidak dialihkan ke laba periode kini hanya karena dipotong pada payout kini. Jika mapping belum jelas, settlement classification belum lengkap dan laba berlabel sementara.

<a id="s12"></a>
## 12. Persediaan operasional, gas, dan sapronak (detail R2)

**Batas rilis:** model inventory rinci dan INV-01–INV-16 adalah R2, bukan gate/dependency R1. INV-17 mempertahankan batas penerimaan R1 tanpa ledger stok. R1 tidak mewajibkan item master, gudang, opening stock, usage, opname, sisa gas, atau valuasi. Pembelian konsumabel menjadi biaya saat diterima/disahkan sesuai bagian 10, tanpa efek kedua saat dipakai. Penerimaan DOC/pakan/sapronak Owner adalah informasi; ABK dapat mengajukan pembelian operasional.

### 12.1 Identitas dan kepemilikan

- **INV-01:** item/SKU mempunyai unit dasar, konversi kemasan, mode `STOCKED` atau `DIRECT_EXPENSE`, serta owner/mitra sebagai pihak kepemilikan/penanggungnya. Perubahan mode hanya prospektif dan tidak boleh merombak histori.
- **INV-02:** minimum satu gudang per kandang; lokasi bangunan dapat ditambahkan. Mutasi antar lokasi dalam kandang yang sama bukan pemakaian dan bukan biaya.
- **INV-03:** stok operasional milik owner dipisahkan dari sapronak milik/ditagihkan PT. Nilai sapronak untuk analisis kontrak tidak otomatis menjadi biaya owner di luar settlement.
- **INV-04:** penerimaan menyimpan tanggal, surat jalan opsional, item, jumlah, unit, lokasi, sumber, serta nilai perolehan jika milik owner. Nilai perolehan = net nilai barang setelah diskon + biaya perolehan yang dipilih untuk dikapitalisasi; pajak refundable tidak dimasukkan tanpa klasifikasi. Alokasi ongkos bersama disimpan eksplisit. Penerimaan fisik tidak harus sekaligus pembayaran; nilai tidak diketahui mengikuti INV-14, bukan diisi nol.
- **INV-17 (R1):** Owner mencatat DOC, pakan datang, dan penerimaan sapronak mitra sebagai dokumen informasional (tanggal, jenis, jumlah/unit dan konteks); tidak otomatis membuat stok/biaya atau pembayaran. ABK hanya mendapat proyeksi operasional berizin dan boleh melaporkan pembelian barang/jasa operasional sendiri; tidak mendapat akses invoice/harga/penerimaan mitra. Pembelian uang terpisah mengikuti FIN/CASH. Perluasan ledger persediaan kemudian memerlukan keputusan/tes R2, bukan mengaktifkannya dari recording DAILY.

### 12.2 Mutasi dan penilaian

```text
stok_akhir = stok_awal + penerimaan + transfer_masuk + retur_dari_pemakaian
             - pemakaian - transfer_keluar - retur_supplier - kehilangan_sah
```

- **INV-05:** penggunaan menyebut item, jumlah, lokasi asal, kandang/bangunan pemakai, periode atau di luar periode, waktu, dan pencatat. ABK tidak harus mengetahui harga; server menghitung nilai biaya.
- **INV-06 (R2):** laporan pemakaian ABK tersimpan dahulu, lalu Owner memeriksa dan mengesahkan online sebelum efek stok/biaya. Izin mencatat bukan izin posting. Koreksi/opname/kehilangan juga memerlukan Owner. Aturan ini tidak menghidupkan lagi tugas pemakaian pada R1.
- **INV-07:** stok terkonfirmasi tidak boleh negatif. Pengambilan offline yang melebihi stok saat sinkron masuk konflik dan tetap disimpan sebagai laporan belum direkonsiliasi. Jangan mengganti jenis barang diam-diam untuk membuat total cocok.
- **INV-08:** moving weighted average berlaku per tenant+kandang+SKU+ownership pool. Lokasi menyimpan kuantitas; transfer lokasi mempertahankan nilai, bukan pembelian baru. Formula rata-rata = nilai persediaan tersedia / kuantitas tersedia, dihitung decimal.
- **INV-09:** consumption mengurangi kuantitas dan nilai persediaan, menambah biaya senilai hasil valuasi. Pengambilan terakhir yang menghabiskan pool mengambil sisa nilai buku untuk menghilangkan residu pembulatan.
- **INV-10:** urutan posting server boleh menghasilkan valuasi sementara, tetapi biaya final memakai urutan kejadian yang disahkan. Event terlambat atau revisi nilai/tanggal/kuantitas menandai pool dan periode terdampak untuk INV-16. Histori tidak diubah in-place dan selisih tidak dibebankan ke periode saat upload semata-mata karena lebih mudah.
- **INV-11:** retur supplier mengacu penerimaan dan jumlah yang belum diretur; stok fisik tersedia tetap harus cukup. Inventory keluar dinilai dengan rata-rata pool pada urutan kejadian retur. Nilai uang/kredit supplier memakai kesepakatan retur; selisih terhadap nilai buku dicatat sebagai variance retur berizin, bukan perubahan diam-diam pada issue historis. Retur pemakaian mengacu issue asal, maksimal jumlah yang belum dikembalikan, dan memakai nilai efektif issue asal termasuk revisi INV-16; ini menambah kuantitas/nilai pool serta membalik biaya terkait. Replay yang mengubah basis retur ikut merekonsiliasi variance dan biaya downstream.
- **INV-12:** opname mencatat tanggal/scope, saldo buku, hitungan fisik, selisih, dan alasan. Selisih tidak disimpulkan sebagai pencurian atau mortalitas. Adjustments yang disahkan menghasilkan mutasi tertaut.

### 12.3 Gas

- **INV-13:** pisahkan isi gas sebagai persediaan habis pakai dari tabung sebagai aset/titipan/jaminan. Membeli tabung tidak sama dengan membeli isi ulang.
- SKU membedakan ukuran, misalnya isi ulang 12 kg dan 50 kg; tidak ada harga bawaan.
- Mode sederhana: jumlah tabung isi utuh/setara isi yang dipakai, dengan konversi nominal kg. Mode terukur: kg aktual berdasarkan timbangan. Jangan menampilkan konversi nominal sebagai pengukuran sensor.
- Pemindahan tabung isi dari gudang ke bangunan = perpindahan lokasi. Pengakuan konsumsi terjadi saat pemakaian yang dicatat (misalnya tabung dinyatakan habis), bukan juga saat dipindahkan.
- Jika tabung masih terpasang dengan sisa tidak terukur saat tutup periode, tampilkan sisa/beban yang belum dapat dipastikan; owner melakukan prosedur partial consumption INV-15, bukan sistem menganggap otomatis habis.
- Beli lalu langsung pakai untuk SKU `STOCKED` menghasilkan penerimaan dan consumption tertaut, satu biaya. SKU nonstok menjadi biaya langsung, tidak boleh dikonsumsi ulang dari stok.
- Analisis gas per DOC/periode hanya membandingkan unit dan basis pengukuran yang sepadan. Kenaikan bukan diagnosis otomatis kebocoran atau penyebab penyakit.

### 12.4 Opening stock dan nilai yang belum diketahui

**INV-14:** opening stock owner memerlukan tanggal cut-off, SKU/unit, lokasi/pool ownership, kuantitas, serta bukti/alasan. Bila diketahui, simpan total nilai buku atau rate yang menghasilkan total nilai; bila belum diketahui, wajib `valuation_status=PENDING` dengan alasan, bukan penolakan seluruh catatan fisik atau default nol. Opening value bukan biaya/pendapatan periode.

- Jika jumlah diketahui tetapi nilai tidak, izinkan `valuation_status=PENDING` agar aktivitas fisik tetap tercatat. Ini bukan stok bernilai Rp0.
- Consumption dari pool yang komponen nilainya belum lengkap tetap mengurangi kuantitas, tetapi menghasilkan `pending_cost_source` bernilai null, bukan biaya Rp0. Semua issue berikutnya yang rata-ratanya bergantung nilai tersebut juga pending.
- Owner mengisi nilai yang hilang melalui opening/receipt valuation berizin. Sistem menyelesaikan **valuation yang sebelumnya pending** dengan urutan kejadian INV-16, membukukan cost source satu kali, lalu menandainya valued. Nilai diketahui tidak otomatis berarti rekonsiliasi historis selesai.
- Backfill pending tidak menimpa cost sebelumnya yang sudah valued. Jika nilai/tanggal baru mengubah cost yang telah dibukukan, INV-16 menghasilkan impact review dan delta append-only; jangan menggunakan backfill untuk menyembunyikan repricing.
- Jika backfill juga mengubah cost lama, penyelesaian cost pending, delta cost lama, dan koreksi nilai inventory/variance yang terkait diterapkan bersama dalam revision atomik INV-16. Sampai approval, nilai baru adalah input usulan dan cost yang belum diposting tetap pending; tidak menandai seluruh pool selesai sesudah baru satu bagian dikoreksi.
- Pending cost yang dialokasikan ke periode memblokir lock keuangan periode tersebut. Stok PT yang memang hanya dicatat kuantitas tidak menjadi pending biaya owner; dampaknya pada estimasi tagihan PT ditentukan kelengkapan kontrak.

### 12.5 Partial consumption gas saat pergantian periode

**INV-15:** catat sesi pemakaian tabung/isi gas di bangunan dengan kuantitas awal, unit dasar, dan consumption yang sudah dibukukan. Unit dapat `kg` atau `isi_tabung_equivalent` desimal; jumlah tabung fisik tetap integer terpisah.

```text
consumption_tambahan = kuantitas_awal_sesi - sisa_yang_ditetapkan - consumption_sudah_dibukukan
```

1. Pada cutoff, owner/ABK berwenang memasukkan sisa terukur atau owner menyetujui estimasi sisa, dengan metode, waktu, alasan, dan label `MEASURED/ESTIMATED`.
2. Consumption tambahan nonnegatif diposting ke periode pemakai, mengurangi inventory quantity/value dan membuat biaya dengan valuasi normal. Ini bukan allocation-only yang membiarkan stok utuh.
3. Sisa tetap berada di lokasi bangunan untuk periode berikutnya. Saat tabung habis, hanya kuantitas tersisa yang dikonsumsi; tidak mengulang satu tabung penuh.
4. Contoh satu isi setara1,00 unit sehargaRp200.000, sisa0,40: periode A memakai0,60 =Rp120.000; sisa0,40 bernilaiRp80.000 untuk B. Saat habis di B, biaya B Rp80.000.
5. Jika sisa tidak diukur dan estimasi tidak disetujui, jangan membuat angka; tampilkan pending consumption/cost dan tetap REVIEW ketika menutup keuangan.
6. Jika data kemudian membuktikan estimasi sebelumnya keliru atau hasil formula negatif, buat correction proposal pada sesi/event asal. Reopen periode yang terdampak bila terkunci; jangan membuat consumption negatif atau membebankan selisih ke periode baru diam-diam.

Perubahan unit/metode pada SKU/sesi aktif harus dikonversi dan direkonsiliasi eksplisit; tidak mengganti 1 tabung menjadi 1 kg.

### 12.6 Rekonsiliasi valuasi yang tidak bergantung urutan sinkronisasi

**INV-16:** satu pool memakai satu urutan ekonomi dan satu revision chain valuasi. Hasil akhir untuk himpunan event, revisi aktif, dan urutan ekonomi yang sama wajib sama, apa pun urutan upload. Tidak ada FIFO/metode tambahan pada R1.

1. **Urutan:** gunakan waktu kejadian yang dinormalisasi dan disahkan, bukan `server_received_at`. Presisi tanggal saja tidak dibuat menjadi jam palsu. Parent penerimaan mendahului penggunaan yang bergantung padanya; retur mengikuti event asal. Jika timestamp/granularitas sama dan urutan memengaruhi nilai atau kecukupan stok, owner menetapkan `economic_sequence` dengan alasan; sampai itu diketahui, rekonsiliasi pending. Jika urutan tidak memengaruhi hasil, tie-break memakai ID event stabil. Opening cutoff harus jelas mencakup event mana; transaksi yang sudah tercakup opening tidak ditambah lagi. Revisi memakai identitas ekonomi sumber yang sama, bukan penerimaan fisik baru.
2. **Deteksi:** setelah event/revisi bernilai masuk, hitung ulang murni dari checkpoint sebelum event terdampak sampai ujung event pool yang telah diterima, termasuk retur dan pemakaian lintas periode/lokasi. Input mencakup versi kuantitas, nilai, urutan, unit, alokasi, dan coverage. Negative stock pada urutan ekonomi, unknown value, atau urutan ambigu menjadi konflik; jangan clamp stok/nilai ke nol. Aktivitas fisik yang belum dapat diposting tetap terlihat sebagai laporan pending.
3. **Dampak:** simpan run dengan pool version/event-set hash, cutoff, old/new cost per issue, nilai akhir inventory, variance retur, alokasi dan semua periode terdampak. Pool mempunyai `reconciliation_status=RECONCILED/REQUIRED/BLOCKED`; known-value berbeda dari reconciliation status. Selama REQUIRED/BLOCKED, biaya terkait berlabel sementara dan tidak meluluskan CYC-11. Untuk urutan normal tanpa selisih dan tanpa input pending, status dapat RECONCILED otomatis dengan jejak pemeriksaan; tidak membutuhkan approval ulang tiap pemakaian.
4. **Pengesahan:** selisih nilai memerlukan preview dan approval owner online. Transaksi atomik memeriksa ulang pool/dependency versions dan status seluruh periode; run stale wajib dihitung ulang. Posting hanya delta antara hasil baru dan **net ledger efektif termasuk koreksi sebelumnya**, bukan selisih terhadap source awal terus-menerus. Delta mengubah biaya/inventory/variance yang tepat, tidak menggerakkan kuantitas atau kas lagi. Uniqueness revision/effect dan FIN-12 mencegah apply dua kali. Sumber biaya tetap satu; alokasi, retur issue dan settlement coverage diperiksa ulang, tidak diduplikasi atau melebihi biaya efektif.
5. **Periode terkunci:** late source disimpan sebagai usulan; jika dampak menyentuh snapshot LOCKED, jangan mengubah snapshot atau cost-nya sebelum owner membuka kembali seluruh periode terkunci yang terdampak. Tandai laporan lama “perlu koreksi valuasi” tanpa menghapus versi lama. Koreksi ditaut ke periode pemakaian asal dan menghasilkan versi laporan baru. Tidak boleh mengesahkan hanya periode penerimaan sambil membiarkan biaya downstream salah. Pemakaian baru dari pool yang belum selesai tetap sementara.
6. **Invariant:** opening book value + nilai penerimaan/retur/adjustment sah − nilai pemakaian/retur supplier/kehilangan sah = nilai stok akhir, dengan transfer internal net nol dan variance retur terpisah. Efek lama + seluruh delta = hasil replay terakhir yang disahkan. Nilai tak diketahui tetap null; final tidak mungkin hanya karena saldo kuantitas cocok. Reversal/revisi sesudah rekonsiliasi menjalankan prosedur yang sama dan mengacu nilai efektif issue asal untuk retur pemakaian.

Mode gas pilot mengutamakan catat tabung/isi terpasang dan habis; estimasi sisa hanya pada cutoff atau saat perlu rekonsiliasi. Tidak memaksa ABK menaksir pecahan setiap hari. Owner memilih MEASURED atau ESTIMATED secara eksplisit; angka estimasi tidak berubah menjadi hasil pengukuran hanya karena disetujui.

<a id="s13"></a>
## 13. Gaji periode, kasbon, dan upah pekerjaan terpisah

**Bagian ini adalah batas keras produk. Jangan menyederhanakannya dengan memasukkan semua pembayaran ABK ke satu payroll. Kasbon usaha R1 berdiri sendiri dari gaji, agreement per siklus, maupun konfigurasi payroll.**

### 13.1 Gaji periode

- **PAY-01:** perjanjian gaji memuat ABK, kandang, periode pemeliharaan, nilai gaji yang disepakati, sumber persetujuan, dan catatan. Basis utama per periode ayam; bukan payroll bulanan otomatis.
- **PAY-02:** satu agreement mempunyai state `DRAFT → AGREED → FINALIZED → SETTLED`; pembatalan draft tidak menghapus kasbon yang sudah dicairkan. `AGREED` dipakai untuk proyeksi biaya, `FINALIZED` mengakui hak gaji/biaya sebenarnya.
- **PAY-03:** gaji disepakati sebelum akhir periode dapat direvisi dengan persetujuan dan histori. Nilai finalized tidak berubah in-place; perubahan setelah final butuh koreksi dan revisi kewajiban.
- **PAY-04:** slip gaji periode menampilkan hak gaji, application kasbon yang secara eksplisit dipilih Owner, pembayaran langsung, sisa hak tunai (tidak pernah negatif), dan saldo kasbon yang masih ada secara terpisah. Posisi net informatif boleh bertanda negatif bila diberi label “sisa kasbon”, bukan pembayaran negatif. **Slip tidak memuat upah pekerjaan tambahan sebagai komponen hak gaji.**
- **PAY-05:** jika seorang ABK bekerja di lebih dari satu kandang, setiap agreement/alokasi harus eksplisit. Jangan menyalin penuh satu gaji ke setiap kandang. Perubahan penugasan tidak otomatis mengubah agreement lama.
- **PAY-06:** ABK berhenti sebelum akhir periode: owner menetapkan hak akhir dan alasan, menyelesaikan uang pegangan/kasbon secara terpisah; tidak ada prorata otomatis yang belum disepakati.

### 13.2 Kasbon dan pinjaman

| Jenis | Saat dicairkan | Saat penyelesaian | Batas |
|---|---|---|---|
| Kasbon/advance dari usaha (`BUSINESS_KASBON`) | Kas usaha turun, piutang kepada ABK naik; bukan biaya gaji | Pembayaran kembali atau application ke hak gaji yang Owner pilih dan setujui | Tidak memerlukan salary agreement/payroll aktif; boleh lebih besar dari gaji kini/yang dikonfigurasi; tidak dipotong otomatis |
| Dana pribadi ABK untuk pembelian | Tidak ada cash out dari kas usaha; pembelian yang disetujui membentuk utang reimbursement (CASH-08) | Reimbursement melunasi utang pembelian | **Bukan kasbon, pinjaman karyawan, atau potongan payroll** |
| Pinjaman dari pribadi Owner | Scope R2; kas pribadi dan piutang pribadi Owner | Pair lintas-buku hanya bila mekanisme R2 diaktifkan | Bukan kas/biaya usaha otomatis; jangan campur dengan kasbon usaha |
| Kas pegangan belanja | Transfer internal kas usaha | Pertanggungjawaban pembelian/pengembalian | **Bukan kasbon dan tidak otomatis memotong gaji** |

- **PAY-07:** kasbon usaha menyimpan tanggal pencairan, akun/pemberi dana usaha, penerima ABK, nominal, tujuan/catatan opsional, dan saldo. Referensi gaji/periode opsional; persetujuan mencairkan tidak mensyaratkan agreement gaji atau bukti rencana potongan. Pengajuan belum mencairkan kas.
- **PAY-08:** application kasbon bersifat opsional, parsial, dan hanya dibuat atas pilihan eksplisit Owner. Setiap application mempunyai ID, sumber kasbon, hak gaji tujuan jika ada, nominal, tanggal, persetujuan, dan efek atomik; nilainya tidak melebihi saldo kasbon outstanding maupun hak gaji tunai yang masih payable. Tidak ada auto-offset berdasarkan saldo atau akhir siklus.
- **PAY-09:** saldo kasbon yang belum diaplikasikan tetap melekat pada ABK dan berlanjut lintas periode secara normal tanpa konversi, agreement baru, atau reissue wajib. Pembayaran kembali/application mengurangi saldo sesuai kejadian nyata. Bila kasbon melebihi hak gaji, pembayaran tunai gaji tetap minimal nol; tampilkan sisa kasbon terpisah. Posisi net informatif boleh negatif hanya jika dilabeli sisa kasbon, bukan sebagai nilai pembayaran.
- **PAY-10:** pemotongan tidak otomatis mengambil upah pekerjaan tambahan. Reversal pembayaran atau payroll harus membalik application terkait secara konsisten, bukan menghidupkan piutang ganda.

```text
sisa_hak_gaji = gaji_final - application_sah_sebelumnya - pembayaran_gaji_valid
potongan_baru <= min(sisa_hak_gaji, saldo_kasbon_outstanding)
sisa_hak_setelah_potongan = sisa_hak_gaji - potongan_baru
posisi_net_informatif_sebelum_potongan = sisa_hak_gaji - saldo_kasbon_outstanding
```

Potongan baru dipilih Owner, tidak otomatis sama dengan seluruh kasbon. Uang benar-benar dibayar dapat nol/sebagian/sampai sisa hak setelah potongan, tidak negatif atau melebihi hak; saldo sisa bukan pembayaran otomatis. Posisi net informatif memakai sisa hak, bukan hak bruto yang sudah pernah dibayar, dan bukan perintah potong. Hak bruto tetap biaya gaji; pencairan/pelunasan kasbon bukan biaya tambahan.

### 13.3 Upah pekerjaan tambahan

- **PAY-11:** catat terpisah: ABK/pekerja, jenis pekerjaan, tanggal selesai, kandang/bangunan bila relevan, periode opsional, jumlah, unit, tarif snapshot, total, pemeriksa, bukti opsional, dan pembayaran.
- **PAY-12:** tarif boleh per karung, per jam/hari kerja, per unit, atau borongan tetap. Satuan dipilih dari template; tarif tidak berubah ketika master diedit.
- **PAY-13:** state `DRAFT → SUBMITTED → APPROVED/NEEDS_CORRECTION/REJECTED`; setelah pekerjaan selesai dan disetujui, biaya serta utang upah diakui. Pembayaran sendiri berstatus unpaid/partial/paid.
- **PAY-14:** pekerjaan dapat dibayar saat itu juga atau belakangan, tetapi melalui dokumen upah pekerjaan, **bukan tambahan pembayaran payroll**. Jika nominal bank digabung secara fisik, pencatat harus memecah alokasinya menjadi pembayaran gaji dan pembayaran pekerjaan yang terhubung referensi bank sama; slip tetap terpisah.
- **PAY-15:** laporan boleh mengagregasi `biaya tenaga kerja = biaya gaji periode + biaya upah pekerjaan`, dengan subkategori tetap terlihat. Daftar utang ABK dapat merangkum kedua jenis, tanpa menambahkan upah ke slip gaji.
- **PAY-16:** task operasional yang ditandai selesai tidak otomatis menghasilkan upah; harus ada job compensation yang disetujui agar pekerjaan biasa tidak semuanya menjadi tagihan.

### 13.4 Kasbon pribadi owner yang dilunasi melalui gaji usaha

**Scope R2:** jalur ini diaktifkan bersama mekanisme lintas-ruang dan tesnya. R1 mendukung advance/pinjaman dari usaha, bukan offset pinjaman pribadi owner. Pembayaran gaji tunai parsial tetap dapat dicatat; selisih yang belum direkonsiliasi tidak otomatis dinyatakan lunas.

Usulan aman untuk mencegah pemakaian uang usaha sebagai uang pribadi tanpa jejak:

1. Owner menautkan klaim pinjaman yang boleh dipotong, dengan persetujuan ABK; hanya nominal dan referensi minimum terlihat pada payroll.
2. Potongan sah mengurangi hak gaji yang dibayar ke ABK dan membentuk kewajiban usaha kepada owner. Biaya gaji bruto tetap sama.
3. Di buku pribadi, bagian piutang terhadap ABK dialihkan menjadi piutang terhadap usaha; belum dianggap kas diterima.
4. Saat usaha membayar owner, kewajiban usaha dan piutang pribadi tersebut lunas secara tertaut. Ini pelunasan pokok, bukan pendapatan pribadi tambahan atau biaya usaha baru.
5. Jika mekanisme lintas-ruang belum disetujui/diimplementasi dengan tes, **blok auto-offset pinjaman pribadi melalui payroll**; pencatatan pembayaran langsung pribadi hanya tersedia ketika buku pribadi diaktifkan. Jangan membuat jalan pintas lewat expense umum.

<a id="s14"></a>
## 14. Keuangan pribadi owner

**Scope R2:** seluruh buku pribadi dan pair di bawah ditunda. R1 hanya menerapkan sisi usaha melalui CASH-15. Tidak ada toggle/menu buku pribadi kosong atau pair setengah jadi yang diwajibkan pada pilot.

- **PER-01:** ruang pribadi mempunyai akun dana, kategori pemasukan/pengeluaran pribadi, transfer internal pribadi, saldo awal, piutang/pinjaman pribadi, lampiran, dan ringkasan tanggal. Tidak menjadi modul perbankan atau penganggaran pribadi kompleks.
- **PER-02:** hanya user owner yang bersangkutan dapat mengakses; tidak terlihat di dashboard tenant/PPL/ABK. Filter tenant tidak cukup untuk melindungi data pribadi—otorisasi owner-user wajib.
- **PER-03:** owner dapat membedakan rekening usaha dan pribadi meskipun secara fisik uang berada di rekening yang sama. Sistem harus memperingatkan perlunya pembukuan alokasi, tidak mengklaim segregasi bank nyata.

| Kejadian | Buku usaha | Buku pribadi |
|---|---|---|
| Owner menambah modal | Kas usaha naik, kontribusi owner; bukan pendapatan | Kas pribadi turun, penempatan modal; bukan belanja pribadi biasa |
| Owner meminjamkan uang ke usaha | Kas naik, utang usaha kepada owner | Kas turun, piutang kepada usaha |
| Owner menarik uang usaha | Kas turun, penarikan owner; bukan biaya kandang | Kas pribadi naik, penarikan dari usaha; bukan dihitung lagi sebagai laba usaha baru |
| Owner membayar kebutuhan usaha dari pribadi | Biaya/stok/aset + utang kepada owner, atau kontribusi jika dipilih eksplisit | Kas turun + piutang ke usaha atau penempatan modal |
| Usaha membayar kebutuhan pribadi owner | Penarikan/piutang owner, bukan biaya kandang | Pengeluaran pribadi dengan sumber tertaut |

**PER-04:** transaksi lintas-ruang dibuat sebagai pair atomik dengan link ID; jangan auto-match berdasarkan nominal/tanggal. Pembatalan satu sisi memerlukan pembalikan kedua sisi yang diotorisasi. Tidak boleh menaut ke ruang pribadi user lain tanpa izin.

**PER-05:** saat buku pribadi diaktifkan, toggle “Usaha/Pribadi” terlihat jelas di layar owner. Draft, hasil pencarian, ekspor, dan lampiran membawa scope; berpindah ruang tidak memindahkan draft otomatis. Buku pribadi online-only sesuai D-10.

<a id="s15"></a>
## 15. Pekerjaan, perawatan, dan kunjungan PPL

**Scope R2:** task/perawatan/kunjungan umum ditunda; upah pekerjaan mandiri pada bagian 13 tetap R1 dan tidak bergantung task ini.

| ID | Requirement |
|---|---|
| OPS-01 | Task memuat kandang/bangunan opsional, periode opsional, jenis, deskripsi, penanggung jawab, jatuh tempo opsional, prioritas, dan status open/in-progress/done/cancelled. |
| OPS-02 | Checklist persiapan dapat disalin antarsiklus, tetapi penyelesaiannya baru, tidak otomatis dianggap selesai karena periode sebelumnya selesai. |
| OPS-03 | Kebutuhan belanja adalah permintaan, boleh memuat perkiraan kuantitas/budget. Persetujuan permintaan tidak membuat expense atau pembayaran. Realisasi menaut pembelian yang sebenarnya. |
| OPS-04 | Daftar alat sederhana memuat lokasi, jenis, kondisi, dan riwayat perawatan. Biaya perawatan menaut transaksi sumber, bukan disalin sebagai expense kedua. |
| OPS-05 | Kunjungan PPL memuat kandang, tanggal/waktu kunjungan sebenarnya, PPL yang berkunjung, pencatat sebenarnya, catatan/rekomendasi, lampiran opsional, dan tindak lanjut. |
| OPS-06 | Catatan yang dibuat ABK/owner atas nama kunjungan PPL menampilkan “dicatat oleh ...”; tidak otomatis dianggap ditulis/disetujui PPL. Konfirmasi PPL merupakan aksi terpisah bila digunakan. |
| OPS-07 | PPL boleh membuat/merevisi catatan sendiri dengan histori; tidak boleh mengubah biaya, recording produksi, atau catatan penulis lain. |
| OPS-08 | Rekomendasi dapat menjadi task tertaut dengan penanggung jawab/status. Aplikasi tidak membuat diagnosis, dosis obat, atau perintah kontrol alat otomatis. |

<a id="s16"></a>
## 16. Recording opsional dan sumber data

**Scope:** R1 memakai `OFF` atau `DAILY`. DAILY adalah rekap bersama tingkat kandang, langsung berlaku setelah validasi server tanpa approval Owner. Pakan terpakai tetap dicatat untuk recording, bukan untuk menggerakkan ledger stok/biaya. SUMMARY, detail/panen, FCR/IP, persediaan dan mesin kontrak tetap R2. UX pendamping tidak menggantikan validasi server, FIN, AC, atau GOLD.

### 16.1 Mode periode

| Mode | Penggunaan | Konsekuensi |
|---|---|---|
| `OFF` | Operasional/keuangan, DOC awal, informasi periode minimum, dan settlement aktual | Recording tidak diminta; hasil usaha aktual tetap dapat dicatat; FCR/performa tidak tersedia dan tidak memblokir belanja atau settlement |
| `DAILY` | Owner atau salah satu ABK berizin mencatat pakan, mati/afkir, dan sampling global kandang | Satu rekap bersama per `cycle + business_date`; revisi menggantikan, tidak menjumlah laporan antar-ABK; langsung berlaku tanpa approval |
| `SUMMARY` | Owner/Mandor memasukkan rekap dari mitra atau catatan sendiri | R2; simpan cutoff, cakupan, sumber, dan bukti; tidak perlu detail harian |
| `DETAIL` | Event produksi/pakan/panen dicatat di aplikasi | R2; agregasi berasal dari event; rekap luar hanya pembanding, bukan ditambahkan lagi |

- **REC-01:** Owner memilih `OFF` atau `DAILY` per siklus pada R1. `OFF` tidak menunggu recording untuk menjalankan operasional, biaya, gaji, atau settlement aktual. `DAILY` tidak menjadikan FCR, panen, mesin kontrak, atau impor otomatis sebagai kewajiban. User tidak harus menginput recording setiap hari agar boleh mengisi pengeluaran.
- **REC-02:** suatu dataset/metrik pada scope dan rentang yang sama hanya mempunyai satu sumber otoritatif. Rekap harian/kumulatif terbaru menggantikan versi rekap sebelumnya pada cakupan itu, bukan dijumlah.
- **REC-03:** beralih mode di tengah periode membutuhkan cutoff dan opening balance yang direkonsiliasi. Aktivasi modul tidak otomatis menggabungkan event lama dengan cumulative summary yang overlap.
- **REC-04:** rekap R1 menyimpan tanggal usaha, sumber DAILY, unit, scope kandang, pencatat/korektor, versi dan kelengkapan. Source mitra serta metrik per bangunan baru R2; nilai FCR mitra tidak disamakan dengan perhitungan aplikasi.
- **REC-05:** sumber satu kandang tidak boleh diproratakan otomatis ke bangunan lalu diklaim sebagai pengukuran nyata.

### 16.2 Pemilihan sumber yang deterministik

**REC-13:** R1 cukup menyimpan lineage pada daily summary/revision: source `DAILY`, scope kandang, tanggal, actor, revisi efektif, coverage dan versi mode/cutoff. Tidak memerlukan entitas generik `RecordingAuthority` atau pemilih sumber. Model authority lintas metrik/sumber (`DETAIL`, `OWNER_SUMMARY`, `PARTNER_SUMMARY`) baru R2. Satu sumber per metrik/rentang; tidak memprorata ke bangunan atau menjumlah sumber/revisi yang overlap.

- Pada DAILY, nilai pakan/mati/afkir adalah kuantitas **hari tersebut**, bukan rekap kumulatif. Agregasi rentang menjumlah tepat satu revisi efektif pada setiap tanggal dalam rentang yang berhak/aktif, dengan daftar gap/partial dan opening cutoff jika diperlukan. Jangan mengambil hanya tanggal terbaru sebagai total periode, menjumlah revisi lama, atau menambahkan consumption tertaut sebagai pemakaian lain. Sampling point-in-time tidak dijumlah menjadi bobot harian seluruh populasi.
- Aturan snapshot kumulatif berikut berlaku pada SUMMARY/R2 atau agregasi DAILY yang diturunkan, bukan mengganti arti input harian. R1 RECEIVED adalah versi recording berlaku, bukan dokumen menunggu Owner; tidak mempunyai efek stok/biaya.

- Metrik kumulatif seperti pakan/mati/panen memakai coverage dari chick-in sampai `as_of_date`, bukan rentang arbitrer yang dijumlahkan. Sampling adalah point-in-time dataset terpisah.
- Untuk laporan cutoff T, ambil snapshot sah pada lineage terpilih dengan `as_of_date` paling akhir yang ≤T; jika tanggal sama, ambil revisi terakhir yang disahkan. Waktu upload tidak menentukan prioritas. Versi sebelumnya tetap tersedia untuk audit; tidak digabungkan dengan revisinya.
- Jika data terakhir hanya sampai T-2, nyatakan cutoff sebenarnya. Jangan menyebut semua input berasal dari T atau menginterpolasi diam-diam. FCR yang memerlukan beberapa input harus menunjukkan cutoff masing-masing dan tidak menjadi final jika belum sepadan.
- Ringkasan dari sumber lain disimpan sebagai pembanding. Pergantian authority memerlukan owner dan impact preview; tidak memilih sumber dengan nilai yang paling bagus atau terbaru di-upload.
- Rekap rentang yang tidak dimulai dari chick-in tidak diterima sebagai cumulative authoritative tanpa opening balance/cutoff migrasi yang disahkan. Migrasi menyimpan saldo hingga cutoff C, lalu hanya event setelah C; data detail yang overlap C tidak ditambahkan lagi.
- Contract metric membedakan `FCR_CALCULATED`, `FCR_PARTNER_REPORTED`, `FCR_PROJECTED`, dan sumber standar. Rule memilih source metric eksplisit; nilai mitra yang kosong tidak diganti nilai aplikasi tanpa keputusan. Estimasi akhir tidak memakai FCR final sebelum tersedia.

### 16.3 Catatan detail

- **REC-06:** beberapa ABK/Owner/device berbagi satu rekap kandang/tanggal. UI menampilkan pencatat dan versi terakhir serta **Lihat / Koreksi** jika rekap sudah ada, bukan form kedua kosong. Draft tetap personal; saat simpan server memeriksa expected version dan uniqueness. Dua submit awal paralel menghasilkan satu rekap dan konflik untuk pihak kedua, bukan dua jumlah. Koreksi langsung berlaku setelah validasi, mempertahankan author asli dan korektor/alasan; tidak perlu approval terpisah.
- **REC-07:** field mati/afkir tidak boleh terisi otomatis dari hari sebelumnya. Angka nol harus dikonfirmasi jika dipakai sebagai data lengkap hari itu; kosong berarti belum ada laporan.
- **REC-08:** catatan pakan memilih jenis/varian dan jumlah yang benar-benar digunakan. Sistem boleh menyarankan barang terakhir tetapi meminta konfirmasi; umur ayam tidak membuktikan jenis pakan yang dipakai.
- **REC-09 (R2):** bila persediaan diaktifkan, tautkan consumption dan recording kejadian sama tanpa input/efek ganda. R1 tidak menunggu atau membuat consumption pakan.
- **REC-10:** sampling global kandang memuat waktu, jumlah sampel >0, total bobot bersih >0, unit, dan metode/catatan opsional; tidak mewajibkan bangunan. ABW dihitung, bukan bobot seluruh populasi atau standar sampel medis universal.
- **REC-11:** suhu/kelembapan manual boleh dicatat sebagai konteks dengan unit/waktu/lokasi; bukan integrasi sensor yang sudah berjalan.
- **REC-12:** user dapat mencatat OVK/vaksin yang diberikan tanpa sistem meresepkan obat/jadwal. Hubungkan pemakaian stok jika memang item yang sama.
- **REC-14:** R1 `DAILY` hanya memuat pakan terpakai, mati/afkir, dan sampling. `business_date` memakai zona waktu kandang; `as_of_date`, waktu input, actor, mode, dan status kelengkapan dibedakan. Sampling tetap point-in-time dan tidak dipaksa menjadi nilai harian bila belum ada.
- **REC-15:** key recording R1 `(cycle_id, business_date)` dengan scope kandang dari cycle. Tidak ada `building_id` wajib atau key per ABK. Bangunan fisik tetap master, tetapi angka global tidak dibagi rata. Revisi menyimpan `revision`, `supersedes_id`, actor/korektor, dan alasan. Pilihan global sudah diputuskan, bukan Q terbuka.
- **REC-16:** tepat satu versi efektif dapat dipakai dalam rekap harian untuk setiap default key. Submit awal, correction, dan retry dengan operation ID berbeda tidak boleh membuat jumlah feed/mati/afkir/sampling terakumulasi dua kali. Versi lama tetap tersedia untuk audit.
- **REC-17:** data `PARTIAL`, `GAP`, atau di luar cutoff diberi label dan tidak dipakai untuk klaim metrik final. Pergantian `OFF`/`DAILY` membuat coverage/cutoff yang dapat direkonsiliasi; tidak menghapus data atau menciptakan event pengganti.
- **REC-18:** pada R1 penyimpanan/revisi feed hanya mengubah rekap produksi. Tidak membuat biaya, consumption, atau antrean pencocokan stok; keterlambatan pencatatan penerimaan Owner tidak menghalangi recording yang valid. Integrasi inventory kelak mengikuti REC-09 dan satu efek kanonis.
- **REC-19:** recording lengkap valid berstatus `RECEIVED` dan langsung menjadi versi berlaku. Tidak ada tahap menunggu pemeriksaan/persetujuan Owner. **Tercatat** berarti sudah diterima server; **Menunggu Kirim** berarti tersimpan di HP dan belum terkirim. Final sebagai catatan berlaku bukan kebal koreksi, bukan jaminan pengukuran benar/performa lengkap, dan bukan posting finansial. Owner memantau atau mengoreksi seperti ABK berizin. Validasi izin, mode, tanggal, versi, tipe angka, dan kewajaran berdasar data tersedia tetap berlaku; gap/unknown tidak dibuat nol. Konflik perlu dicocokkan, bukan approval rutin baru.

<a id="s17"></a>
## 17. Panen, DO, kendaraan, dan asal bangunan

### 17.1 Struktur

- **HAR-01:** DO adalah referensi otorisasi/rencana panen; bukan selalu satu mobil. Simpan mitra/broker, nomor, tanggal, periode, jumlah rencana opsional, dan status.
- **HAR-02:** satu perjalanan/pengangkutan memuat tanggal/jam aktual, plat, sopir, broker, dan periode/kandang. Kendaraan yang sama boleh kembali pada perjalanan lain.
- **HAR-03:** satu perjalanan dapat memiliki satu atau beberapa tiket/rincian DO jika kenyataan membutuhkan. Setiap tiket menaut tepat satu DO dan memiliki baris asal bangunan. Tidak menjadikan nomor DO atau plat sebagai ID perjalanan.
- **HAR-04:** satu tiket dapat mengambil dari beberapa bangunan. Setiap baris menyimpan ekor, kelas ayam (normal/afkir terjual/lainnya), dan kg bila ditimbang per asal.

### 17.2 Validasi dan berat

- **HAR-05:** tiket panen aktual harus mempunyai total ekor integer >0, kg bersih >0, dan setiap baris asal mempunyai ekor >0. Jumlah ekor tiket = jumlah ekor baris bangunan, dan tidak melebihi populasi tersedia saat konfirmasi server. Panen parsial mengurangi populasi hanya sekali. Draft/rencana boleh belum lengkap tetapi tidak masuk metrik/populasi sampai disahkan.
- **HAR-06:** berat bersih = bruto - tara bila dua angka diisi; bruto ≥ tara. Bisa memasukkan berat bersih langsung dengan sumber pengukuran. Jelaskan tara keranjang/kendaraan yang dipakai; tidak mengurangi tara lagi jika net sudah bersih.
- **HAR-07:** total kg tiket harus sesuai jumlah kg baris bila semua baris terukur. Jika hanya total tiket diketahui, kg baris boleh kosong; jangan membagi otomatis dan menyebutnya bobot aktual bangunan. Performa per bangunan tidak lengkap sampai data bobotnya memadai.
- **HAR-08:** DO rencana tidak mengurangi ayam dan tidak menghasilkan pendapatan. Hanya panen aktual disahkan yang masuk metrik. Nilai hasil kontrak adalah estimasi, bukan kas diterima saat mobil keluar.
- **HAR-09:** batalkan panen posted dengan reversal dan cek konsekuensi stok ayam/estimasi/settlement. Periode terkunci memerlukan review/reopen.
- **HAR-10:** panen malam melewati tengah malam memakai waktu aktual dan zona kandang; umur per tiket mengikuti tanggal aktual, bukan otomatis tanggal DO.

<a id="s18"></a>
## 18. Rumus performa dan kelengkapan data

Rumus berikut adalah **basis operasional aplikasi**. PT dapat memakai konvensi berbeda; hasil kontrak harus menyimpan basisnya dan tidak diam-diam mengubah metrik operasional.

Basis umur, definisi kelas panen/deplesi, serta standar adalah **default usulan D-07/D-08 dan menunggu Q-05** sebelum dipakai untuk keputusan pembayaran. Kebutuhan adanya perhitungan FCR sudah terkonfirmasi; konvensi rinci bukan tarif/standar universal semua mitra.

### 18.1 Populasi dan afkir

**MET-01:**

```text
N0 = DOC hidup diterima
Nlive = N0 - mati - afkir_keluar_nonpanen - ekor_panen - kehilangan_lain_disahkan
deplesi_persen = 100 × (mati + afkir_keluar_nonpanen) / N0
pengurangan_nonpanen_persen = 100 × (mati + afkir_keluar_nonpanen + kehilangan_lain_disahkan) / N0
daya_hidup_final_persen = 100 × ekor_panen_hidup / N0
```

Afkir yang dijual/dimuat dicatat sebagai panen berkelas afkir, bukan sekaligus `afkir_keluar_nonpanen`. Kehilangan tidak diketahui dicatat tersendiri; final reconciliation dengan selisih tidak otomatis melabelinya kematian. Jika kontrak menganggap afkir terjual sebagai deplesi, gunakan metrik kontrak terpisah dengan penjelasan basis.

Pada periode fisik selesai dengan rekonsiliasi lengkap, daya hidup final =100−pengurangan_nonpanen_persen. Ini hanya sama dengan100−deplesi_persen jika tidak ada kehilangan lain. Deplesi di layar diberi keterangan “mati + afkir nonpanen”; kehilangan lain tetap tampak terpisah. Panen eligible untuk metrik operasional adalah ayam hidup normal + afkir terjual yang tercatat jumlah/bobotnya; bangkai/disposal bukan panen hidup. Kelas lain yang belum dipetakan menghalangi metrik final, bukan otomatis dimasukkan/dikeluarkan.

Rumus `(N0 - Nlive)/N0` **tidak boleh** dipakai sebagai deplesi setelah ada panen, karena akan menghitung ayam panen sebagai kematian.

### 18.2 Sampling, ABW, FCR, dan IP

| ID | Metrik | Rumus dan prasyarat |
|---|---|---|
| MET-02 | ABW sampling (R1 `DAILY`) | Total kg sampel / total ekor sampel pada sesi yang sama; jangan merata-ratakan rata-rata tanpa pembobot. Ini hanya ringkasan sampling sederhana, bukan ABW panen atau performa penuh. |
| MET-03 | ABW panen (R2) | Total kg panen bersih / total ekor panen aktual. Unit keluaran kg/ekor; gram hanya konversi tampilan. |
| MET-04 | Umur panen rata-rata (R2) | `Σ(umur_tiket × ekor_tiket) / Σ(ekor_tiket)`. Default dibobot ekor, bukan rata-rata sederhana tanggal. Basis alternatif kontrak harus berlabel. |
| MET-05 | FCR final operasional (R2) | Total pakan benar-benar dikonsumsi (kg) / total bobot hidup panen (kg), setelah fisik selesai dan data direkonsiliasi. Pakan diterima/tersisa bukan otomatis konsumsi. |
| MET-06 | FCR berjalan estimasi (R2) | Pakan konsumsi kumulatif / `(kg panen kumulatif + estimasi biomassa hidup tersisa)` pada cutoff yang sama. |
| MET-07 | Biomassa hidup estimasi (R2) | `Σ(populasi hidup bangunan × ABW sampling representatif bangunan)`; jika rekap hanya sekandang, gunakan basis sekandang berlabel. Jangan memasukkan bangunan tanpa sampel sebagai nol kg. |
| MET-08 | IP final operasional (R2) | `(daya_hidup_final_persen × ABW_panen_kg × 100) / (FCR_final × umur_panen_rata_rata)`. Daya hidup mengikuti MET-01, pada periode rekonsiliasi lengkap tanpa selisih populasi yang belum dijelaskan. |

**MET-09:** IP final tidak ditampilkan jika umur/FCR/bobot tidak valid atau rekonsiliasi populasi belum lengkap. IP proyeksi, bila dibuat, harus memakai skenario berlabel; tidak menampilkan nilai berjalan sebagai hasil final.

**MET-10:** umur event = selisih tanggal lokal event terhadap chick-in + `age_at_chick_in_days`. Nilai default 1 adalah usulan; setiap periode/kontrak menyimpan basis. UI dapat membedakan “hari pemeliharaan” dan umur kontrak jika berbeda.

**MET-11:** sampling terakhir menampilkan tanggal dan usia data. Default usulan stale setelah >7 hari; umur batas dapat disetujui per usaha. Sampling stale menyebabkan label data usang/estimasi rendah keyakinan, bukan indikator hijau pasti aman.

**MET-12:** agregasi antarkandang memakai total numerator/denominator yang sepadan, bukan rata-rata FCR/IP mentah. Jangan menggabungkan periode aktif dan selesai menjadi satu metrik final tanpa label.

**MET-13:** tabel standar dipilih eksplisit menurut sumber/strain/bobot/umur, versi, unit, serta aturan interpolasi. Tanpa standar, tampilkan metrik aktual tanpa label baik/buruk. Angka FCR nol atau sampling kosong pada screenshot tidak membuktikan penyebab masalah data.

<a id="s19"></a>
## 19. Mitra, kontrak berversi, dan mesin perhitungan

**Scope R2:** estimasi dimulai dari template yang tervalidasi, bukan builder umum. R1 hanya membutuhkan master mitra/lampiran aktual dan tidak menjalankan rules berikut.

**CON-23:** sebelum mengaktifkan satu pola template, verifikasi kontrak beserta contoh settlement aktual yang disetujui owner: basis kuantitas, harga, bonus/potongan, cutoff retur, rounding, dan komponen nonpenghasilan. Buat fixture sintetis yang merepresentasikan pola tersebut dan cocokkan hasil per komponen, bukan total saja. Minimal satu kasus normal serta kasus batas/pengecualian untuk setiap pola yang diaktifkan; pola lain tidak dianggap otomatis didukung. Kesamaan nama PT tidak membuktikan kesamaan skema.

Template dikelola melalui perubahan berversi yang direview; owner memilih template dan mengisi parameter yang diizinkan, bukan menyusun dependency graph. Engine hanya wajib mengimplementasikan primitive yang dipakai template terpilih; setiap primitive lain ditolak sebagai unsupported sampai ditambahkan beserta tes. Builder umum CON-19 merupakan perluasan setelah pola berulang teramati, bukan gate estimasi awal.

**CON-24:** aktivasi estimasi juga memerlukan jalur input yang benar-benar dapat dijalankan: siapa memasukkan summary, metrik/sumber apa, cutoff, frekuensi, dan beban waktunya. Uji rekap manual sebelum menjanjikan dashboard otomatis; integrasi mitra tidak diasumsikan tersedia. Tanpa input wajib yang cukup, EST-05 berlaku. Fitur estimasi tidak menjadi indikator sukses pilot R1 yang memang tidak mengumpulkan data tersebut.

### 19.1 Kepemilikan dan lifecycle

- **CON-01:** mitra adalah master tenant. Template harga PT tidak dibagikan lintas tenant secara otomatis, meskipun nama PT sama.
- **CON-02:** satu periode memilih satu kesepakatan utama dan snapshot versi syarat untuk perhitungan. Kesepakatan owner berbeda dapat memakai template yang sama dengan nilai berbeda.
- **CON-03:** kontrak memuat mitra, owner/tenant, kandang yang dapat memakai, tanggal berlaku, lampiran privat opsional, mata uang, skema, metrik pembanding, profil pembulatan, dan versi.
- **CON-04:** lifecycle `DRAFT → VALIDATED → APPROVED → RETIRED`. Versi approved yang sudah dipakai immutable. Perubahan membuat versi baru; retired tetap dapat dibaca oleh histori.
- **CON-05:** jika ada addendum di tengah periode, owner memilih cakupan tanggal/kejadian yang terdampak dan melihat impact preview. Simpan mapping versi aturan per cakupan; jangan menimpa transaksi atau estimasi lama. Perubahan retroaktif membutuhkan alasan dan revisi laporan; tidak diperlakukan sebagai update harga master biasa.
- **CON-06:** periode boleh berjalan tanpa kontrak lengkap; modul estimasi menyatakan tidak tersedia. Operasional/keuangan tidak diblokir hanya karena konfigurasi kontrak belum selesai.

### 19.2 Katalog primitive untuk perluasan estimasi

| Tipe | Input yang wajib dinyatakan | Contoh penggunaan sintetis |
|---|---|---|
| Harga tetap × kuantitas | Rate, unit kuantitas, scope, tanggal acuan | Harga DOC per ekor ditagihkan |
| Harga bertingkat | Lookup metric, interval, rate output, unit, agregasi | Rp/kg ayam berdasarkan ABW per tiket |
| Komponen nominal tetap | Nilai, scope penerapan, syarat opsional | Biaya layanan tetap per periode |
| Tarif × metrik | Rate/unit, metrik basis, kelompok syarat | Bonus per kg panen jika diff FCR memenuhi |
| Persentase subtotal | Persentase, named subtotal sumber, syarat | Potongan atas basis tertentu yang disepakati |
| Bagi hasil margin | Persentase, definisi margin, perlakuan nilai negatif | Bagian selisih harga pasar terhadap kontrak |
| Minimum/maksimum | Komponen sumber, floor/cap, waktu penerapan | Batas bonus menurut kesepakatan |
| Penyesuaian manual | Nominal, tanda tambah/kurang, alasan, bukti, persetujuan | Komponen yang belum terotomasi |

**CON-07:** setiap rule mempunyai ID, label, kelas (penghasilan, biaya kemitraan, bonus, beban/pajak, tabungan/aset, pelunasan utang, informatif), basis, unit, kondisi, dependencies, kebijakan jika tidak match, dan pembulatan. Nama label saja tidak menentukan efek finansial.

**CON-08:** basis kuantitas sapronak harus dipilih: dikirim, diterima, ditagihkan, diterima dikurangi retur, atau dikonsumsi. Mesin tidak mengasumsikan semua PT menagih berdasarkan konsumsi.

**CON-09:** minimal metrik bertipe tersedia: DOC diterima/ditagihkan; jumlah/berat panen; ABW; umur; mortalitas/deplesi sesuai definisi; FCR realisasi; FCR standar; diff FCR; pakan per jenis; harga pasar per scope; serta named subtotals. Jika metrik tidak ada, rule berstatus missing input, bukan bernilai nol.

### 19.3 Kontrak konfigurasi rule, bukan bahasa pemrograman

**CON-22:** setiap rule memakai struktur bertipe berikut. Nama field final dapat mengikuti API, tetapi seluruh makna wajib dipertahankan:

| Field | Batas/arti |
|---|---|
| `rule_id`, `label`, `version` | Identitas dan tampilan; bukan kode yang dieksekusi |
| `type` | Enum `FIXED_RATE`, `TIER_RATE`, `FIXED_AMOUNT`, `PERCENT`, `MARGIN_SHARE`, `CLAMP`, `MANUAL`; tipe lain unsupported |
| `effect_class`, `sign` | Kelas hasil pada CON-07; tambah/kurang eksplisit, bukan ditebak dari kata bonus/potongan |
| `scope` | Per ticket, DO, atau cycle; metrik scope berbeda membutuhkan agregasi yang dinyatakan |
| `aggregation` | Enum `IDENTITY`, `SUM`, `RATIO_OF_SUMS`, `WEIGHTED_MEAN`, atau `LAST_AS_OF`; tanpa simple average tersembunyi |
| `aggregation_refs`, `coverage_rule` | Numerator/denominator refs untuk ratio; value/weight refs untuk weighted mean; cutoff dan lineage untuk last-as-of; source scope dan grup tujuan eksplisit |
| `input_refs`, `source_kind`, `unit` | Daftar metrik terdaftar/dataset atau output rule sebelumnya, termasuk calculated/reported/projected; bukan expression string |
| `parameters` | Rate, percent, interval, cap/floor, definisi margin; hanya field yang sah untuk enum type |
| `tier_application` | Wajib untuk TIER_RATE; dukungan awal `ALL_MATCHED_VOLUME`: satu tier terpilih diterapkan ke seluruh kuantitas basis. Tarif marginal/progresif per lapisan ditolak sebagai unsupported sampai ada primitive/template dan tes khusus; jangan menebak dari kata “bertingkat” |
| `conditions`, `group_policy` | Leaf comparisons `eq/ne/lt/lte/gt/gte/between`; all/any maksimal2 tingkat grup, EXCLUSIVE/ADDITIVE |
| `dependencies` | ID rule/subtotal yang harus selesai; graph acyclic |
| `missing_policy` | `BLOCKED` atau `REQUIRE_MANUAL`; manual membutuhkan nilai dan persetujuan, bukan fallback nol |
| `no_match_policy` | `NOT_COVERED` atau default eksplisit yang disahkan; berbeda dari missing input |
| `rounding` | Precision/method/stage sebelum atau sesudah lookup/evaluasi yang dinyatakan |

Batas keselamatan katalog, bukan target kompleksitas template awal: maksimal 200 rule per versi, 1.000 baris lookup per tabel, dan 50 predicate per rule. Template dapat memiliki batas lebih kecil sesuai fixture yang diverifikasi. Pelanggaran ditolak dengan pesan batas; menaikkan limit memerlukan uji performa, bukan mengeksekusi ekspresi bebas. Tidak ada script, recursion, HTTP fetch, SQL, atau custom function dari owner. Formula matematika yang membutuhkan primitive baru masuk unsupported/penyesuaian manual dan antrean pengembangan.

`SUM` hanya untuk metrik aditif yang unitnya cocok. ABW agregat menggunakan total kg/total ekor; FCR agregat memakai total pakan/total bobot eligible; umur panen memakai weighted mean dengan ekor sebagai bobot kecuali kontrak menyatakan basis lain. `LAST_AS_OF` memakai authority/cutoff REC-13, bukan waktu upload. Rule dijalankan per grup scope yang dipilih; menjalankan per tiket lalu menjumlah hasil uang berbeda dari lookup memakai ABW seluruh periode. Validator menolak weight/denominator hilang, unit tidak cocok, atau averaging metrik ratio tanpa numerator/denominator yang benar. Nilai nol denominator tetap missing/invalid, bukan fallback nol hasil.

### 19.4 Interval, urutan, dan rounding

- **CON-10:** interval internal berupa `[batas_bawah_inklusif, batas_atas_eksklusif)`, batas terakhir boleh tak terbatas. UI menerjemahkan label kontrak manusia melalui preview; jangan mengasumsikan `0,99` otomatis berarti `kurang dari 1,00` tanpa konfirmasi.
- **CON-11:** interval lookup dalam satu kelompok tidak boleh overlap. Gap harus mempunyai perilaku eksplisit `NOT_COVERED` atau nilai default yang disetujui. Untuk tabel harga utama, gap runtime memblokir estimasi lengkap.
- **CON-12:** kondisi bertipe mendukung perbandingan terhadap angka/rentang dan kombinasi all/any terbatas. Kelompok rule menyatakan `EXCLUSIVE` atau `ADDITIVE`; dua bonus tidak otomatis ditumpuk karena keduanya cocok.
- **CON-13:** dependency antar subtotal harus acyclic. Urutan evaluasi mengikuti dependency, bukan urutan kebetulan di database. Validasi dimensi: persentase rupiah menghasilkan rupiah; Rp/kg harus dikali kg, bukan ekor.
- **CON-14:** basis lookup ABW/FCR menggunakan decimal sebelum rounding tampilan kecuali kontrak eksplisit memerintahkan pembulatan lebih dulu. Simpan tahap serta metode pembulatannya.
- **CON-15:** harga ayam menyatakan basis lookup dan penerapan: per tiket, per DO, atau rata-rata seluruh periode. Harga untuk ayam kecil/afkir mempunyai rule tersendiri; tidak mengambil harga terdekat tanpa instruksi.
- **CON-16:** `diff_FCR` harus menyatakan arah, default `aktual - standar` (negatif lebih rendah). Kontrak dengan arah lain harus tampilkan labelnya. Standar dan interpolasi disnapshot, tidak memakai tabel strain terbaru untuk periode lampau.
- **CON-17:** bonus pasar menyatakan harga pasar sumber, scope waktu, dan apakah selisih negatif menjadi nol atau potongan. Jangan menerapkan clamp nol jika kontrak tidak menentukannya.
- **CON-18:** pajak tidak mempunyai tarif universal bawaan. Basis, tarif, perlakuan beban/kredit, dan tanggal berlaku dipilih owner dari kesepakatan dengan verifikasi profesional bila perlu; aplikasi bukan penentu kewajiban perpajakan.

### 19.5 Builder untuk owner

**CON-19:** alur wizard: identitas kesepakatan → pilih pola → sapronak → hasil/harga ayam → bonus/potongan → basis/metrik → preview contoh → validasi → setujui. Advanced fields disembunyikan sampai dibutuhkan, tetapi konsekuensinya tidak tersembunyi pada hasil.

**CON-20:** sebelum approved, validasi tipe/unit, overlap/gap, dependency, formula tak didukung, dan contoh batas. Tidak ada tombol “publish tetap” untuk rule yang secara matematis ambigu. Skema unsupported boleh disimpan sebagai lampiran/manual component, dengan banner bagian belum otomatis.

**CON-21:** calculation result menyimpan engine version, contract snapshot/version mapping, dataset version, cutoff, asumsi, intermediate values, matched rows, rounding, warnings, dan hasil. User dapat membuka “Mengapa angkanya demikian?”. Perubahan engine tidak menimpa hasil historis yang disimpan.

<a id="s20"></a>
## 20. Estimasi, RHPP/P4, realisasi, dan pencairan

**Scope:** R1 mencatat settlement aktual melalui mode pilihan Owner `FULL_RHPP` (komponen yang diketahui) atau `PAYOUT_ONLY` (hanya net payout). Mode payout-only menjaga angka hak/penerimaan yang diketahui, tetapi tidak mengarang komponen atau menyebut profit final. Owner dapat melengkapi rincian kelak. Estimasi serta perbandingannya dengan aktual (EST dan SET-10) adalah R2. Settlement net-only yang belum terklasifikasi tidak memblokir pencatatan harian, pembelian/pembayaran, maupun aktivasi siklus berikutnya; ia tetap tidak memenuhi syarat profit final/financial lock lengkap.

### 20.1 Tiga layar/konsep berbeda

| Konsep | Sumber | Efek uang/buku |
|---|---|---|
| Estimasi/skenario | Data aktual sampai cutoff + asumsi owner + kontrak | Tidak memposting pendapatan, utang, atau kas |
| Settlement aktual | Dokumen PT yang dimasukkan/diverifikasi owner | Mengakui hak/kewajiban sesuai komponen; bukan otomatis pembayaran |
| Pencairan | Pembayaran nyata yang dicatat dan direkonsiliasi | Mengubah kas dan melunasi hak/kewajiban, bukan pendapatan kedua kali |

### 20.2 Estimasi

- **EST-01:** tipe `ACTUAL_TO_DATE`, `HARVEST_NOW_SCENARIO`, atau `END_OF_CYCLE_SCENARIO`. Nama tipe selalu tampil; ACTUAL_TO_DATE bukan proyeksi panen akhir.
- **EST-02:** proyeksi akhir memerlukan asumsi ekor/berat/umur panen, tambahan konsumsi/pembelian yang ditagihkan, harga pasar jika relevan, dan biaya owner yang belum terjadi (termasuk gaji). Owner dapat mengisi nilai/rentang; tidak ada prediksi AI tersembunyi ketika modul ini diaktifkan.
- **EST-03:** semua asumsi diberi label, pembuat, waktu, dan satuan. Memakai harga kontrak PT lain sebagai pengganti tanpa persetujuan dilarang.
- **EST-04:** output menampilkan estimasi hasil kemitraan, estimasi biaya owner di luar settlement, estimasi laba manajerial, dan estimasi kas yang akan diterima bila komponen pencairan diketahui.
- **EST-05:** missing mandatory input menghasilkan daftar kekurangan. Boleh menampilkan subtotal diketahui, tetapi tidak sebagai total lengkap/angka pasti. Penyesuaian manual harus terlihat terpisah.
- **EST-06:** komparasi skenario tidak menyarankan waktu panen sebagai kepastian keuntungan; kendala kemitraan, kondisi ayam, serta kualitas asumsi tetap terlihat.

### 20.3 Settlement dan pengakuan

- **SET-01:** record settlement memuat periode, mitra, nomor dokumen/tanggal bila tersedia, label asli (RHPP/P4/lainnya) bila diketahui, mata uang, entry mode pilihan Owner (`FULL_RHPP` atau `PAYOUT_ONLY`), versi, status draft/verified/superseded, dan komponen yang benar-benar diketahui. Lampiran/bukti opsional; data yang tidak tersedia tidak mewajibkan alasan.
- **SET-02:** komponen membedakan pendapatan hasil pemeliharaan, bonus, biaya sapronak dalam perhitungan PT, beban/penalti, pajak sesuai klasifikasi, tabungan yang masih menjadi hak owner, pelunasan utang lama, koreksi periode lain, dan jumlah yang harus dicairkan.
- **SET-03:** default D-13 memakai **penghasilan kemitraan neto setelah biaya kemitraan**, bukan seluruh penjualan ayam sebagai omzet owner ditambah seluruh sapronak sebagai biaya lagi. Rincian bruto disimpan untuk analisis/reconciliation, tetapi mapping ke laporan tidak boleh double count.
- **SET-04:** tabungan/deposit yang tetap hak owner adalah aset/tagihan, bukan otomatis biaya. Pelunasan pokok utang lama bukan biaya periode sekarang. Pajak/penalti/biaya yang memang beban harus dipetakan eksplisit.

```text
kas_diharapkan_dari_settlement
  = penghasilan_kemitraan_periode
    - tabungan_ditahan_yang_masih_milik_owner
    - pelunasan_pokok_utang_lama
    + pelepasan_tabungan_lama
    ± penyesuaian_nonpenghasilan_lain_terklasifikasi
```

Formula ini adalah identitas rekonsiliasi, bukan rumus universal hak kemitraan. Nilai penghasilan dihitung/dinyatakan berdasarkan komponen kontrak aktual yang dipetakan.

- **SET-05:** jalur **Uang Diterima** (`PAYOUT_ONLY`) hanya mencatat pembayaran yang benar-benar diterima: akun, tanggal, jumlah, mitra/periode relevan; rincian RHPP/lampiran tidak wajib. Jika total hak belum diketahui, gunakan penerimaan belum dipadankan dan `UNRECONCILED`, bukan membuat piutang sama dengan pembayaran lalu menyebutnya lunas. Terpisah, Owner boleh mengesahkan angka hak net PT tanpa komponen rinci: piutang dapat diketahui, classification tetap PENDING. Kedua kasus tidak otomatis menjadi laba. Rincian RHPP yang ditambahkan kemudian mencocokkan pembayaran lama, bukan cash receipt baru.
- **SET-06:** pencairan mendukung beberapa pembayaran, potongan yang diverifikasi, kelebihan pembayaran yang diklasifikasi, dan saldo belum cair. Status eksternal seperti “Awaiting” hanya label sumber; tidak otomatis dipetakan menjadi belum dibayar.
- **SET-07:** settlement negatif menjadi kewajiban kepada mitra, bukan cash receipt negatif. Cara pelunasan/carry berikutnya harus eksplisit dan tidak mengubah hasil periode lama.
- **SET-08:** jika suatu biaya owner ternyata sudah dipotong dalam penghasilan settlement, tandai linkage komponen dan keluarkan dari pengurangan laba kedua kali. Pembayaran reimbursement atas biaya itu tidak menciptakan income tambahan yang sama.
- **SET-09:** revisi dokumen PT membuat versi baru, reconciliation delta, serta posting koreksi berizin. Dokumen sebelumnya tetap dapat dilihat. Pembayaran lama dipetakan ke kewajiban/hak yang telah direvisi, tidak diduplikasi.
- **SET-10:** selisih estimasi vs aktual dikelompokkan menurut kuantitas, harga, bonus, potongan, pembulatan, dan input manual. Sistem tidak otomatis menyimpulkan kesalahan/kecurangan PT.

### 20.4 Pengakuan hak dan payout yang deterministik

**SET-11:** dokumen mempunyai dua status independen: `document_status=DRAFT/VERIFIED/SUPERSEDED` dan `classification_status=PENDING/COMPLETE`. VERIFIED berarti nilai dokumen disahkan owner, bukan berarti seluruh komponen laba diketahui atau uang sudah masuk.

| Aksi/data sumber | State/efek yang benar |
|---|---|
| Masukkan dokumen net PT, belum ada pembayaran | Setelah nilai dokumen diverifikasi, buat receivable net expected payout (atau payable jika negatif); kas tetap. Jika rincian penghasilan belum diketahui, classification PENDING dan tidak final income. |
| PT memberi kabar akan mentransfer | Catat `payout_notice=ANNOUNCED`; hanya informasi/rencana, tidak mengubah kas atau saldo lunas. Pembatalan notice tidak membalik kas karena belum ada cash movement. |
| Owner mengonfirmasi dana benar-benar diterima | Buat `payout_payment=POSTED` dengan akun penerima, tanggal aktual, dan nominal; referensi/bukti opsional dan tidak ada alasan wajib bila kosong. Kas naik, receivable berkurang melalui application. |
| Dana diterima sebelum dokumen diketahui | Kas naik melalui penerimaan mitra belum dipadankan/suspense; belum mengakui income periode. Saat dipadankan, reclass/application menutup suspense dan receivable, tidak membuat cash receipt kedua. |
| Pembayaran yang tercatat ternyata salah | Reversal tertaut mengembalikan application dan kas sesuai kenyataan koreksi. Gagal/void sebelum posted tidak memengaruhi kas. |

Status pelunasan hanya dihitung jika kewajiban/hak net telah diverifikasi: `UNPAID` jika application0, `PARTIAL` jika0<application<net due, `PAID` jika sisa0. Application yang sah memisahkan kas aktual dan offset nonkas yang disetujui; UI menampilkan berapa **uang diterima** dan berapa **diselesaikan nonkas**. Jika hak net belum diketahui, gunakan `UNRECONCILED`, bukan memilih unpaid/paid dari status aplikasi mitra. Offset baru tidak boleh dipakai menutup selisih tanpa komponen/bukti yang direkonsiliasi.

Rincian laba dan lock lengkap memerlukan classification COMPLETE. Pembayaran `PAYOUT_ONLY` boleh dibukukan tanpa dokumen hak yang VERIFIED; pembayaran sah tidak memverifikasi hak total. Hak net disahkan terpisah hanya jika Owner benar-benar mengetahuinya. Selama rincian belum cukup, laba tidak final dan keuangan OPEN/REVIEW, tanpa menahan transaksi harian atau siklus berikutnya. Lampiran opsional tanpa alasan wajib jika kosong. Cost coverage mengikuti COST-11; menyebut invoice tanpa mengurangi net income tidak otomatis membuat coverage.

<a id="s21"></a>
## 21. UX mobile-first, navigasi, dan layar minimum

### 21.1 Prinsip tampilan

- **UX-01:** layar ponsel menjadi desain utama, bukan tabel desktop yang diperkecil. Navigasi bawah maksimal lima tujuan utama; detail bertahap.
- **UX-02:** header selalu menjelaskan ruang usaha/pribadi, kandang, bangunan bila relevan, dan periode/tanggal. Sebelum simpan, konteks terlihat; berpindah scope tidak diam-diam mengalihkan draft.
- **UX-03:** angka, satuan, dan status lebih utama dari dekorasi. Warna punya makna dan disertai teks/ikon. Tidak menggunakan grafik/gauge kosong untuk membuat dashboard tampak lengkap.
- **UX-04:** angka jumlah/nominal tidak diisi dari kebiasaan sebagai fakta. Boleh menyarankan kategori/barang terakhir dengan konfirmasi. Tanggal otomatis dapat diubah, dengan penanda jika bukan hari ini.
- **UX-05:** pesan berhasil harus spesifik dan memakai label status kanonis di `UX_UI_SPEC.md` §15–16, misalnya “Menunggu Kirim — tersimpan di HP”, “Menunggu Owner”, “Tercatat”, atau “Dibukukan”. Jangan hanya satu tanda centang untuk semua status.
- **UX-06:** nominal rupiah, kuantitas, dan hitungan memakai keypad angka aplikasi sesuai D-26: format Indonesia, tampilan `Rp` langsung, ejaan nominal, tombol hapus yang jelas, dan tanpa pecahan rupiah. Pengguna tetap dapat beralih ke keyboard HP, paste/edit, memakai keyboard fisik, dan pembaca layar. Keypad tidak dipakai untuk username, password, atau teks bebas; kegagalan uji aksesibilitas mengembalikan keyboard angka HP sebagai default.
- **UX-07:** target sentuh minimal 44×44 CSS px, target utama 48×48; teks utama minimal 16 px usulan. Kontras target WCAG AA, label bukan placeholder saja, error dekat field, navigasi keyboard/focus jelas.
- **UX-08:** rancangan diuji pada lebar 360, 390, 768, dan 1280 CSS px; tidak ada horizontal scroll halaman utama. Tabel kompleks memakai detail/baris adaptif atau scroll di kontainer berlabel.
- **UX-10:** arah visual R1 adalah modern, mudah digunakan, dan glassmorphism secara terukur. Wujud finalnya adalah mockup K-39: header, navigasi, dan kartu memakai kaca putih di atas kanvas hangat; efek bukan tujuan yang mengalahkan keterbacaan.
- **UX-11:** bidang angka, isian form, tombol keypad, status penting, dan area validasi memakai permukaan opaque dengan teks/border/focus yang kontras; kartu pembungkusnya boleh kaca putih ≥75% sesuai mockup K-39. Kontras diuji pada kondisi transparansi, gambar latar, cahaya rendah, dan ukuran mobile; angka/status tidak boleh menjadi samar karena blur.
- **UX-12:** sediakan fallback solid untuk browser/perangkat yang tidak mendukung efek, pengguna yang memilih reduced transparency, atau kondisi kontras tidak lulus. Fallback mempertahankan hierarki, aksi, status, dan akses keyboard; tidak menjadi layar darurat yang berbeda maknanya.
- **UX-13:** warna, radius, blur, shadow, ikon, dan komposisi glassmorphism ditetapkan oleh mockup K-39 dan FRONTEND_DESIGN_SPEC §4–§6; implementer tidak menambah atau menebak token lain. Risiko kontras yang tercatat di FRONTEND_DESIGN_SPEC §10 dan pola tutorial tetap perlu uji usability/accessibility; perubahan token hanya lewat revisi yang disetujui pengguna.
- **UX-14:** setiap alur ABK mengutamakan satu aksi utama, progressive disclosure, konteks kandang/periode/tanggal yang terlihat, dan status tersimpan/terkirim yang eksplisit. Pusat panduan berisi tutorial singkat kontekstual, pencarian topik, dan bantuan saat error; bukan LMS atau kurikulum wajib.
- **UX-15:** label singkat dan jelas: **Data Kandang**, **Tim Kandang**, **Recording Harian**, **Tambah ABK**, **Catat Belanja**, **DOC Masuk**, **Simpan**, **Koreksi**. Judul/tombol menyebut objek/aksi, bukan paragraf pertanyaan. Target 1–3 kata bila makna tetap jelas; jangan memotong label aksesibel atau membuat semua tindakan menjadi “OK”. Penjelasan, risiko, dan status rinci memakai helper text/konfirmasi yang dapat dibaca, bukan tooltip saja.
- **UX-16:** panduan Owner berbasis tahap usaha/dependensi nyata: Persiapan → DOC masuk → Periode berjalan → Hasil Periode. Ini proyeksi pekerjaan, bukan enum pengganti status fisik/keuangan. Langkah dapat dilewati bila opsional; input terkait muncul saat dibutuhkan, kembali ke draft asal setelah selesai. Tidak ada dashboard nol palsu, saran nominal otomatis, setup ulang tiap login, atau tugas pemakaian gas yang tidak diminta. Prioritas harian: transaksi menunggu review, dependensi uang yang nyata, dan pekerjaan Owner berikutnya; recording sudah berlaku bukan antrean approval.
- **UX-17:** aplikasi mengarahkan tanpa mengekang (K-38). Beranda menampilkan satu saran utama dan paling banyak dua saran pendamping yang dapat dijelaskan dari data nyata, sedangkan tombol **Catat** dan navigasi utama selalu tersedia. Urutan hanya dikunci oleh dependensi nyata, misalnya DOC membutuhkan periode. **Nanti** menyembunyikan saran opsional sampai ada kejadian yang relevan; tidak ada pop-up berulang, poin, streak, atau hukuman.
- **UX-18:** kerjakan di tempat bila aman (D-27). Target R1: menerima/mengembalikan uang, mengisi Recording per tab, dan membuka detail transaksi tidak memerlukan pindah halaman; mencatat belanja memakai satu halaman fokus dengan keypad terpasang sesuai mockup K-39; Owner dapat memeriksa dan membukukan belanja dari daftar dengan pratinjau dampak. Aksi uang tidak memakai geser sebagai satu-satunya cara dan tidak dieksekusi hanya dengan satu geseran.
- **UX-19:** bantuan pintar hanya menyarankan, bukan menebak fakta. Boleh: keperluan/pihak dari riwayat sendiri, pilihan tanggal **Hari ini/Kemarin**, hitung otomatis rata-rata sampling, ejaan nominal, peringatan transaksi mirip dan angka tidak biasa dibanding riwayat sendiri, serta melanjutkan draf. Tidak boleh: mengisi nominal/kuantitas dari kebiasaan, menyalin recording kemarin, memilih sumber dana, mengirim, atau membukukan otomatis. Setiap saran dapat diabaikan dan menyebut dasarnya.
- **UX-20:** bahasa layar mengikuti glosarium tunggal di `UX_UI_SPEC.md` §16. Satu konsep satu istilah; istilah internal seperti DRAFT, posting, sync, coverage, review, receipt, epoch, lease, dan capture-only tidak tampil kepada pengguna. Judul/navigasi memakai kata benda singkat, tombol memakai kata kerja + objek, bantuan paling banyak satu kalimat pendek, dan pesan error menyebut apa yang terjadi, apakah data aman, serta langkah berikutnya.

### 21.2 Navigasi usulan

| Peran | Navigasi utama |
|---|---|
| Owner | Ringkasan · Transaksi · Catat (tombol tengah) · Kandang · Lainnya (mockup K-39; Laporan di Lainnya) |
| ABK | Hari Ini · Uang Kas · Catat (tombol tengah) · Riwayat · Lainnya (mockup K-39) |
| Mandor | Ringkasan Tugas · Catat · Kandang · Pekerjaan · Akun |
| PPL | Kandang Undangan · Kunjungan · Tindak Lanjut · Akun |
| Administrator | Tenant · Limit/Layanan · Audit Administrasi · Akun |

Di ABK, **Catat** memberi jalur **Recording Harian** (DAILY), **Catat Belanja**, **Upah Pekerjaan**, **Terima Uang**, dan **Kembalikan Uang**; tidak ada **Pakai Gas/Barang** pada R1. **Uang Kas** berarti uang usaha yang dipegang ABK, bukan gaji/kasbon; aksi terima/kembalikan uang juga tersedia langsung di layar itu. **Lainnya** memuat gaji, kasbon, upah, panduan, dan akun. Satu kandang berhak langsung terpilih; beberapa kandang memakai pemilih berizin tanpa memindahkan draft. Owner dapat direct input dan mengelola **Tim Kandang**.

Navigasi Mandor/PPL hanya pada perluasan R2. R1 tidak menampilkan menu task/perawatan/produksi/kontrak/pribadi yang belum diaktifkan, termasuk sebagai kartu kosong atau ajakan mengisi data yang belum dibutuhkan.

### 21.3 Layar minimum dan aksi utama

R1 membangun SCR-01 sampai SCR-11 dengan SCR-08 sebagai riwayat pembelian barang/peralatan, sisi **Aktual PT/Pencairan** SCR-14, serta SCR-17. DAILY tampil pada SCR-03/SCR-04; OFF tidak memaksa recording. SCR-12/13/15/16 dan tab Estimasi adalah perluasan. Akun/tim, onboarding adaptif, review penutupan, dan ekspor menjadi alur inti; valuasi/stok bukan layar wajib R1.

| ID | Layar | Informasi/aksi wajib |
|---|---|---|
| SCR-01 | Masuk | Username/password tanpa email, ganti password sementara, pemulihan berizin, scope sah dan kesiapan offline; tidak membocorkan tenant/akun lain |
| SCR-02 | Beranda Owner | Kartu kandang/periode, biaya berjalan, kas, tugas/perhatian, kelengkapan dan timestamp data |
| SCR-03 | Detail periode | Tab Ringkasan, Operasional, Keuangan, Riwayat; bila `DAILY`, ringkasan recording dengan status partial/gap/cutoff; aksi Selesai Fisik dan Kunci/Buka Kembali Keuangan terpisah; tab Produksi/Panen dan Kontrak/Estimasi hanya setelah perluasan aktif |
| SCR-04 | Hari Ini | Penugasan, recording bersama dan pencatat terakhir, Catat Belanja, Uang Kas, Terima/Kembalikan Uang, status kirim; tanpa tugas pemakaian atau form per bangunan |
| SCR-05 | Catat belanja | Jalur singkat CASH-16; klasifikasi/alokasi yang belum diketahui dilengkapi owner sebelum posting, bukan dipaksakan kepada ABK |
| SCR-06 | Kas pegangan | Saldo tercatat, belanja belum diperiksa, perkiraan uang di tangan, transfer masuk/keluar, pertanggungjawaban |
| SCR-07 | Pemeriksaan Owner | Daftar/umur pengajuan, bukti, saldo terkait, approve/correction/reject, batch FIN-13; alasan dan penyelesaian klaim kas tetap per dokumen |
| SCR-08 | Riwayat Belanja | Riwayat pembelian barang/jasa/peralatan, klasifikasi, periode dan bukti opsional sesuai hak; bukan saldo stok, pindah lokasi, pemakaian atau opname |
| SCR-09 | Gaji periode | Agreement, kasbon diterapkan, pembayaran, sisa, slip; tanpa komponen upah pekerjaan |
| SCR-10 | Kasbon | Pekerja/kreditur, pencairan, pengembalian/potongan pilihan Owner, sisa lintas periode; tanpa agreement wajib atau plafon berdasarkan gaji |
| SCR-11 | Upah pekerjaan | Pekerjaan, qty, unit, rate, persetujuan, pembayaran terpisah |
| SCR-12 | Panen cepat | Pilih/buat DO, mobil/sopir/broker, bangunan, ekor/berat, tambah asal bangunan, ringkasan sebelum konfirmasi |
| SCR-13 | Kontrak wizard | Komponen dan tabel, validasi, contoh batas, preview perhitungan, versi, publish berizin |
| SCR-14 | Estimasi/settlement | Tab terpisah Estimasi, Aktual PT, Pencairan; missing input, rincian hitung, selisih |
| SCR-15 | Ruang pribadi | Scope privat jelas, akun, transaksi, piutang, laporan; tidak bercampur biaya kandang |
| SCR-16 | Kunjungan PPL | Pencatat vs pengunjung, waktu, rekomendasi, tindak lanjut, scope grant |
| SCR-17 | Pusat sinkronisasi | Antrean, lampiran tertunda, konflik, last sync, retry, alasan penolakan dan jalur penyelesaian |

### 21.4 State UX untuk setiap layar

**UX-09:** setiap layar harus memiliki state loading, empty, error, offline/stale, no permission, dan success yang relevan. Contoh:

- “Belum ada biaya tercatat” berbeda dari “Total biaya Rp0 yang telah diverifikasi”.
- “FCR belum tersedia: bobot panen belum diisi” bukan `FCR 0,00`.
- “Data diterima 2 hari lalu” bukan titik hijau “kandang aman”.
- Foto masih diunggah tidak membatalkan teks yang sudah tersimpan.
- Recording bersama konflik versi menampilkan catatan terbaru dan perubahan lokal berizin, tidak menghapus atau menjumlah draft.
- Tombol approve/finalize saat offline disabled dengan alasan, bukan pura-pura sukses.

Mode gelap dapat ditambahkan setelah uji keterbacaan; bukan syarat utama R1 dan bukan pengganti kontras yang benar.

### 21.5 Tutorial kontekstual dan arahan visual

- Pusat Panduan tersedia dari **Lainnya** dan dari titik kebingungan di form (misalnya beda uang kas, kasbon, dan upah). Tutorial maksimal berupa langkah singkat dengan contoh sintetis, dapat dilewati, dan tidak memblokir transaksi yang sudah dipahami.
- Mengikuti `D-24` dan mockup K-39, glassmorphism dipakai pada header, navigasi, dan kartu (putih 75–95% di atas kanvas rata). Jika efek dimatikan atau tidak didukung, versi solid menjadi perilaku normal, bukan error. Isian, tombol keypad, dan tampilan nominal selalu solid; nilai uang dan status tidak boleh menjadi sulit dibaca karena transparansi.
- Token, radius, blur, shadow, dan tata letak ditetapkan mockup pengguna (K-39) dan diterjemahkan di `FRONTEND_DESIGN_SPEC.md`. Frontend harus sama dengan mockup menurut pemeriksaan visual di dokumen itu; perubahan token hanya lewat revisi yang disetujui pengguna setelah uji lapangan atau aksesibilitas. PRD tetap menetapkan makna, izin, dan acceptance.
- `UX_UI_SPEC.md` adalah handoff pendamping untuk inventaris layar dan skenario UX; saat implementasi, semua layar harus membawa state loading/empty/error/offline/pending/no-permission/success tanpa melonggarkan otorisasi atau efek ledger PRD.

<a id="s22"></a>
## 22. Offline, sinkronisasi, lampiran, dan konflik

### 22.1 Batas aksi offline

| Aksi | Offline R1 | Saat kembali online |
|---|---|---|
| Membaca scope tugas terakhir tersimpan | Ya, dengan waktu data dan masa izin | Refresh izin/data |
| Draft/ajukan belanja, upah pekerjaan | Ya dalam scope cached dan lease berlaku | Validasi izin, periode, versi dan efek finansial; tidak mensyaratkan ledger stok |
| Mencatat penyerahan/penerimaan uang yang sudah nyata | Ya sebagai catatan kejadian OFF-16, bukan posting | Owner memeriksa, menghubungkan kejadian yang sama dan dependensi, lalu mengesahkan online |
| Catatan baru setelah lease habis | Capture-only terbatas OFF-17; bukan akses cache usaha | Reauth, pilih scope yang masih sah, konfirmasi pengajuan; tidak auto-post |
| Recording dasar `DAILY` | Ya bila mode dan konteks cycle/kandang/date tercache; OFF tidak menampilkan form | Periksa grant setiap ABK/Owner, mode/cutoff dan expected revision rekap bersama; langsung berlaku bila valid, bukan antrean approval atau stok |
| Mengambil foto bukti | Ya jika ruang lokal cukup | Upload terpisah setelah metadata diterima |
| Menyetujui/menolak finansial, mengesahkan pencairan kasbon atau posting pembayaran | Tidak; berbeda dari mencatat uang yang sudah berpindah | Memerlukan server, izin terkini, dan validasi atomik |
| Mengaktifkan/menutup/mengunci periode, mengubah grant, approve kontrak | Tidak | Operasi online berizin |
| Mengubah data pribadi owner | Tidak pada R1 | Online-only sesuai D-10 |
| Melihat live CCTV/sensor terkini | Tidak dibangun R1 | Masa depan; koneksi dan freshness wajib dijelaskan |

### 22.2 Protokol produk

- **OFF-01:** login awal, pendaftaran perangkat/cache, dan pengunduhan penugasan memerlukan koneksi. Aplikasi tidak menjanjikan pemakaian offline sebelum pernah dibuka/disiapkan online.
- **OFF-02:** simpan payload dan operation ID atomik ke storage lokal sebelum menampilkan “tersimpan di HP”. Jika storage penuh/ditolak, tampilkan gagal simpan dan pertahankan form; jangan memberi centang palsu.
- **OFF-03:** partisi lokal menurut user + tenant + scope; cache keuangan pribadi tidak ikut cache kerja ABK/PPL. Service worker tidak boleh menyajikan respons authenticated milik user sebelumnya.
- **OFF-04:** local operation mempunyai UUID, jenis, parent IDs, base version, occurred_at, device ID, dan payload hash. Retry memakai ID sama; edit membuat revision/operation baru dengan hubungan yang jelas.
- **OFF-05:** urutan dependency dijaga: parent dokumen harus diterima sebelum line/payment/ref terkait. Partial batch mengembalikan status per operation. Jangan mem-posting separuh transaksi uang yang seharusnya atomik.
- **OFF-06:** server memeriksa izin saat menerima, bukan hanya percaya grant saat catatan dibuat. Pencabutan akses/suspend/period lock dapat menolak posting; payload tetap local/quarantined agar dapat direkonsiliasi oleh user berwenang, tidak otomatis hilang.
- **OFF-07:** konflik memakai expected version, bukan last-write-wins, terutama uang dan recording bersama multi-ABK. Tampilkan versi/perubahan yang boleh dilihat; user berizin mencocokkan lalu menyimpan revisi dengan audit. Pada recording tidak perlu approval Owner rutin; efek finansial tetap Owner. Aturan stok/panen/kontrak mengikuti modul R2 ketika aktif.
- **OFF-08:** event tambahan yang independen dapat digabung, tetapi validasi batas stok/populasi dijalankan lagi secara atomik. Dua ponsel tidak boleh bersama-sama memanen lebih dari jumlah ayam tersedia.
- **OFF-09:** lease awal akses scope offline 72 jam sejak izin terakhir diverifikasi, bukan durasi jaringan buruk yang dianggap sudah terbukti. Setelah habis, pembacaan cache usaha dan pembuatan command bisnis baru dikunci sampai reauth online; antrean lama tetap tersimpan dan tidak diposting otomatis. Capture-only OFF-17 tidak memperpanjang grant. Q-06 harus menguji lease pada perangkat/pola kerja pilot; perubahan kebijakan harus terdokumentasi, bukan memperpanjang izin lokal secara diam-diam.
- **OFF-10:** logout selalu tersedia. Jika ada antrean, tawarkan sinkron saat online, kembali ke aplikasi, atau keluar dengan antrean terkunci pada identitas yang sama. Penghapusan lokal memerlukan konfirmasi eksplisit risiko kehilangan; tidak diam-diam purge antrean saat logout/update.
- **OFF-11:** sinkronisasi dicoba saat aplikasi dibuka/koneksi pulih dan via tombol “Coba kirim lagi”. Background Sync adalah enhancement, bukan satu-satunya jalur. Browser/OS dapat menunda background work; tidak ada jaminan pengiriman saat aplikasi tertutup.
- **OFF-12:** request persistent storage bila didukung, pantau quota, dan tampilkan peringatan antrean lama/ruang menipis. Penghapusan data browser, uninstall, perangkat rusak/hilang tetap dapat menghilangkan data yang belum terkirim. Jangan menjanjikan “data tidak pernah hilang”.
- **OFF-13:** update web/versi skema lokal harus memigrasikan draft/antrean dan mempertahankan dukungan payload lama selama masa transisi yang ditetapkan ADR. Versi tidak kompatibel masuk kondisi update-required tanpa membuang payload.
- **OFF-14:** waktu HP tidak dipercaya sebagai waktu posting. Selisih jam besar ditandai; tanggal kejadian yang dimasukkan tetap dapat ditinjau, bukan diganti diam-diam dengan tanggal kirim.
- **OFF-18:** DAILY offline memakai operation ID dan expected revision rekap `(cycle_id, business_date)`. Reconnect memeriksa mode/date/cutoff dan grant actor saat ini. Revisi/retry hanya satu versi efektif tanpa stok/biaya. Dua ABK/Owner/device dengan versi dasar sama menghasilkan `VERSION_CONFLICT` bagi pihak kedua, bukan menjumlah, timpa, atau menunggu approval harian Owner. Draft per orang tetap di scope asal; rekap server bersama menampilkan pencatat/korektor.

### 22.3 Lampiran

- **OFF-15:** metadata transaksi dikirim lebih dahulu; file mempunyai status local/pending/uploaded/failed terpisah. UI memungkinkan retry foto tanpa menggandakan transaksi.
- Default usulan foto JPEG/PNG/WebP, dokumen PDF; batas 10 MB per file, 5 file per transaksi. Kompres foto sambil menjaga keterbacaan nota; PDF tidak diubah tanpa kebutuhan.
- Validasi MIME dan isi, sanitize nama, hapus EXIF lokasi dari salinan untuk penayangan, scan file bila layanan mendukung; file belum lolos pemeriksaan tidak ditayangkan sebagai konten aktif.
- Object storage privat; URL akses berumur pendek dan baru dibuat setelah otorisasi. Jangan memasukkan link permanen publik ke notifikasi.
- Perangkat lain tidak melihat foto sampai upload selesai; dokumen menampilkan bukti tertunda. Foto/nota R1 opsional, ketidakhadirannya tidak mewajibkan alasan dan tidak otomatis memblokir simpan/approval; data pokok transaksi tetap harus valid. Owner dapat meminta klarifikasi isi transaksi, bukan menetapkan bukti wajib tersembunyi.

### 22.4 Catatan tunai dan fallback capture-only

**OFF-16:** Owner/ABK dapat mencatat kejadian tunai nyata: serah-terima kas, pengembalian, pembayaran toko/reimbursement, atau pencairan gaji/kasbon/upah. Simpan jenis, waktu, nominal, pihak menurut pencatat, operation ID; bukti/catatan opsional tanpa alasan wajib jika nota tidak ada. State lokal `LOCAL_ONLY` lalu `SUBMITTED_UNVERIFIED`, bukan izin ABK membuat cash movement. Label **Belum Disahkan**, dengan helper “Uang sudah berpindah menurut catatan, belum dibukukan.” Saldo sah tidak berubah; klaim penerimaan tidak menjadi dana sah untuk memaksa belanja.

- Sesudah online, owner meninjau sumber/kewajiban dan menyetujui command atomik. Jika parent transfer belum sah, child belanja tetap pending dengan alasan dependensi; jangan membuat saldo negatif atau mengubah sumber ke dana pribadi ABK otomatis. Operation ID parent dipakai jika tersedia; antarperangkat yang tidak saling mengetahui ID perlu linkage owner eksplisit.
- Dua orang melaporkan serah-terima yang sama tidak menghasilkan dua transfer. Owner menautkan kedua klaim ke satu cash movement kanonis setelah memeriksa pihak/waktu/bukti; kecocokan nominal saja tidak cukup. Link klaim kanonis dan efek uang disahkan atomik. Setelah itu, retry/konfirmasi penerima hanya mengembalikan hasil yang sama, bukan cash movement baru.
- Jika transfer kanonis sudah posted sebelum laporan counterpart tiba, laporan baru tetap menunggu pencocokan; sesudah owner memverifikasi kejadian yang sama, simpan `LINKED_TO_CANONICAL` dengan referensi movement lama, tanpa transfer baru. Nomor operation berbeda bukan bukti ada dua kejadian. Kejadian yang benar-benar berbeda memerlukan pengesahan sendiri, bukan auto-merge berdasarkan nominal.
- Penolakan posting karena grant, periode terkunci, saldo, atau kewajiban berubah tidak menghapus klaim bahwa uang sudah berpindah. Tetap masuk rekonsiliasi, bukan dianggap transaksi fisik batal. Pembayaran kewajiban yang sudah disahkan boleh setelah lock sesuai CYC-09; mengubah hak/biaya memerlukan reopen.

**OFF-17:** setelah lease habis, perangkat yang sudah didaftarkan dapat menyediakan catatan baru milik pengguna lokal melalui local unlock yang diuji ADR. Field dibatasi waktu, nominal, teks keperluan/pihak, dan bukti baru; tidak membaca saldo, daftar pegawai, cache tenant, dokumen lama, atau autocomplete bisnis. Catatan belum mempunyai otorisasi tenant dan tidak bisa approve/post/menutup periode. Tanpa setup/local unlock yang sah atau setelah logout, mode ini tidak tersedia; tidak ada penggunaan anonim di profil pengguna lain.

Catatan capture-only menyimpan origin author/device, note ID, dan `origin_tenant_id` immutable dari konteks registrasi terakhir yang diterbitkan server saat online. Simpan referensi registrasi asal saat capture dibuat; server memverifikasi pemetaan tersebut, bukan mempercayai tenant/author yang diklaim payload. Metadata asal adalah provenance, **bukan grant**; tidak berubah ketika lease habis, grant dicabut, registrasi diperbarui, atau pengguna berganti akun. Tanpa konteks registrasi asal yang dapat dibuktikan, catatan tetap recovery-only, bukan command tenant.

Saat reauth, hanya author yang sama atau recovery SEC-13 yang sah boleh mengonversi catatan ke **tenant asal yang sama**, lalu memilih kandang/scope yang saat itu masih diizinkan. Pemilihan/perubahan kandang di dalam tenant sebelum pengajuan diperbolehkan dengan konfirmasi dan histori, bukan transfer transaksi posted; pergantian tenant dilarang. ID asal serta hash/riwayat konversi dipertahankan, dan origin note hanya mempunyai satu konversi efektif yang ditegakkan unik server. Pemecahan alokasi setelah konversi memakai dokumen yang sama melalui COST-04/05, bukan konversi berulang. Grant tenant asal hilang → catatan tetap lokal terkunci/recovery-only, tidak direhome ke tenant lain. Logout tidak membocorkan catatan ke akun berikutnya. Threat model, kehilangan kunci, penyimpanan penuh, migrasi browser, dan expiry diuji sebelum pilot; mode ini bukan klaim keamanan setara hardware keystore.

<a id="s23"></a>
## 23. Notifikasi dan pusat perhatian

- **NOT-01:** inbox server adalah sumber notifikasi, push hanya kanal pengantar. Membaca push tidak sama dengan menyetujui dokumen.
- **NOT-02:** R1 memuat belanja/upah perlu review, klaim kas belum selesai, gaji siap ditinjau, dan konflik sinkron. Recording berlaku hanya informasi/konflik, bukan pengajuan approval. Tidak ada alert stok/sisa gas/pemakaian atau tugas R2.
- **NOT-03:** pada R1 `DAILY` hanya boleh memberi pengingat kelengkapan/stale recording jika data dan ambang disepakati; alert performa/FCR atau diagnosis produksi tetap R2. Ambang per owner/standar harus diatur. Tidak ada alert medis berbasis angka tebakan.
- **NOT-04:** tidak menuduh ABK belum mencatat hanya karena server belum menerima data. Pesan “belum ada data terkirim” dan waktu terakhir sinkron lebih tepat.
- **NOT-05:** event ID dan penerima dipakai untuk dedupe notifikasi. Retry worker tidak mengirim rangkaian pesan yang sama. User dapat memilih jenis nonkritis dan jam tenang.
- **NOT-06:** jangan menaruh nominal kasbon, gaji, atau keuangan pribadi di lock screen secara default. Tautan membuka objek setelah login serta otorisasi ulang.
- **NOT-07:** notifikasi hanya untuk scope yang masih diizinkan saat pengiriman. PPL yang dicabut tidak boleh menerima notifikasi owner tersebut berikutnya.
- **NOT-08:** kelak push web memerlukan browser yang mendukung/izin; push Android memerlukan konfigurasi native/FCM dan izin OS. Keduanya best-effort, bukan jaminan alarm keselamatan real-time.

<a id="s24"></a>
## 24. Dashboard, laporan, pencarian, dan ekspor

| ID | Laporan/tampilan | Scope | Isi wajib |
|---|---|---|---|
| REP-01 | Dashboard lintas kandang | R1 | Periode fisik aktif/masa kosong, biaya tercatat, kas/perhatian, freshness; drill-down tanpa data owner lain |
| REP-02 | Dashboard periode | R1; estimasi R2 | Persiapan/DOC/umur, biaya pembelian/alokasi, klaim belum review, recording global dan author terbaru, gaji/kasbon/upah, hasil aktual dan coverage; tidak ada saldo stok/sisa gas palsu |
| REP-03 | Buku kas | R1 | Saldo awal, cash movement menurut payment date, transfer terpisah, saldo akhir; filter akun/pemegang |
| REP-04 | Biaya periode/kategori | R1 | Sumber biaya, tanggal pengakuan, allocation, status, belum dialokasikan; bukan cash out total |
| REP-05 | Pertanggungjawaban ABK | R1 | Dana masuk, belanja posted, klaim belum selesai, pengembalian, saldo buku/fisik; bukan saldo gaji |
| REP-06 | Gaji dan kasbon | R1; offset pribadi R2 | Hak gaji bila ada, kasbon mandiri per pekerja, potongan pilihan Owner, uang dibayar dan saldo kasbon lintas periode; posisi bersih negatif berlabel sisa kasbon, bukan pembayaran negatif; privacy per orang |
| REP-07 | Upah pekerjaan | R1 | Pekerjaan/unit/tarif, biaya diakui, pembayaran, sisa; terpisah dari slip gaji |
| REP-08 | Persediaan/gas | R2 | Opening/receipt/mutation/use/return/closing dan valuasi hanya bila perluasan disetujui; R1 memakai riwayat pembelian SCR-08/REP-04, bukan laporan stok |
| REP-09 | Recording, produksi, dan panen | R1 untuk ringkasan `DAILY`; R2 untuk detail/panen | R1: pakan terpakai, mati/afkir, sampling, business_date, revision efektif, completeness/cutoff; R2: sumber detail, ekor/kg, per-bangunan bila tersedia, metrik aktual/estimasi dan missing data |
| REP-10 | Kemitraan | Aktual R1; kontrak/estimasi R2 | Settlement aktual manual, tabungan/piutang/utang dan payout pada R1; versi kontrak/estimasi/selisih estimasi baru pada perluasan |
| REP-11 | Hasil manajerial | R1 | Penghasilan kemitraan + sampingan - biaya owner yang tidak sudah masuk settlement, kelengkapan, exclusion seperti depresiasi |
| REP-12 | Pribadi | R2 | Saldo, arus uang, biaya pribadi, pinjaman, transfer usaha, hanya owner-user |
| REP-13 | Riwayat audit | R1 | Siapa, kapan, objek, aksi, alasan, revision; sesuai izin dan scope |

- **REP-14:** setiap laporan memuat filter, zona waktu, periode/tanggal, basis kas/biaya, waktu dibuat, versi jika snapshot, dan status provisional/final. Laporan siklus juga memuat tracking_started_at, cutoff, history_coverage, status alokasi bangunan/DOC belum teralokasi bila relevan, dan daftar komponen belum lengkap. Biaya sejak cutoff tidak dilabeli biaya seluruh siklus. Default antarhalaman harus konsisten.
- **REP-15:** export CSV untuk data tabular dan PDF ringkasan/slip memakai dataset/otorisasi yang sama dengan layar. Tidak boleh mengekspor field tersembunyi. Escape CSV formula injection untuk nilai yang dapat dieksekusi spreadsheet.
- **REP-16:** ekspor besar diproses background dengan status pending/ready/failed; file privat dan masa unduh terbatas. Nilai filter dibekukan pada request; download memeriksa akses yang masih berlaku.
- **REP-17:** pencarian/filter mencakup kandang, bangunan, periode, kategori, pihak, tanggal, status, pemegang kas, dan nomor dokumen sesuai modul. Pagination server, tidak memuat semua tenant ke browser.
- **REP-18:** agregasi uang menjumlah ledger terotorisasi, bukan nilai kartu UI yang mungkin ter-cache berbeda waktu. Tidak merata-ratakan persen atau FCR tanpa basis pembobot yang valid.

**REP-19:** owner R1 dapat mengunduh paket usaha terstruktur berotorisasi: schema version, tenant/cutoff/snapshot ID, timezone, JSON/CSV dengan stable IDs/relasi, opening positions, pembelian/peralatan, kas/biaya/utang/piutang, alokasi/reversal, gaji/kasbon/upah, recording global beserta revisi, settlement/pembayaran, dan audit berhak. Stok/valuasi/kontrak ikut hanya jika perluasan aktif, bukan berkas dummy wajib R1. Jangan menyertakan password/hash/reset secret/token, data tenant lain, atau buku pribadi otomatis dalam ekspor usaha.

Ekspor memakai snapshot konsisten, jumlah baris dan checksum per berkas, kamus field/enum, serta manifest lampiran dengan hash/status; sertakan salinan lampiran yang tersedia dalam paket privat, bukan hanya URL sementara. Bukti local-only/pending/missing tercatat sebagai belum tersedia, bukan paket dinyatakan lengkap. Hak unduh diperiksa ulang dan tautan kedaluwarsa; paket bersifat sensitif. Uji jumlah/saldo/relasi terhadap snapshot sumber dan verifikasi file; tenant READ_ONLY tetap dapat ekspor sesuai hak. Paket ini untuk portabilitas, **bukan** backup database penuh atau janji impor ulang otomatis. Pemulihan sistem mengikuti NFR-11.

Paket menyertakan klaim kas unresolved, transaksi belum diposting, konflik recording yang diterima server, serta RESTORE_REVIEW_REQUIRED; valuasi pending hanya bila modul R2 aktif. Total posted terpisah dari pending. Capture-only belum dikonversi bukan data tenant; server tidak dapat menghitung catatan lokal yang belum diterima. Manifest mengungkap batas itu, bukan menghilangkan pengecualian agar laporan terlihat lengkap.

<a id="s25"></a>
## 25. Model data logis dan kontrak layanan

Ini kamus logis, bukan DDL yang memaksa satu ORM. Developer wajib mempertahankan relasi, invariant, serta makna; nama tabel dapat mengikuti stack setelah ADR.

### 25.1 Entitas minimum

Tabel adalah katalog lintas-rilis. R1 tidak membutuhkan stock pool/movement/gas session/valuation, private account/cross-space pair, task/perawatan/visit, production event/authority, harvest DO, contract rule atau calculation run. Daily summary/revision dan mode/cutoff menyimpan lineage minimum REC-13 tanpa authority generik. Penerimaan sapronak R1 adalah dokumen informasional, bukan stock movement wajib. Referensi R2 tidak dibuat/dijadikan FK wajib; tidak ada row dummy. Settlement aktual tidak bergantung kontrak. Klasifikasi peralatan melekat pada pembelian, bukan task/asset-management engine wajib.

| Grup/entitas | Field dan hubungan kritis |
|---|---|
| User, credential, tenant, membership, grant, device registration | ID stabil, normalized username unik, hash password aman, password-change-required/session version; akun ABK terikat tenant pengelola; primary owner/version, role/capability dan scope; origin registration server-issued bukan grant baru; reset secret tidak masuk audit |
| Farm, building, stock location (lokasi stok R2) | tenant, zona waktu, kapasitas, status; building selalu milik farm yang sama, bukan syarat granularitas recording |
| Employee, assignment | identitas minimum, login opsional, banyak ABK per kandang, unik grant aktif per farm+user dalam tenant, effective dates/version; histori dan kewajiban per orang tetap saat nonaktif |
| Cycle, building allocation, physical close declaration | farm, physical_status dan financial_status terpisah, chick-in, DOC/capacity snapshot, `recording_mode` (`OFF`/`DAILY` R1; `SUMMARY`/`DETAIL` R2), tracking_started_at/history_coverage, building_allocation_status/unallocated_doc_count; deklarasi kosong/tanggal selesai/owner/bukti/rekap diketahui/versi |
| Counterparty, partner | tenant-private identity, supplier/broker/mitra/owner/employee role; rekening sensitif terpisah |
| Business account, cash movement | account owner/custodian, currency, opening balance, transfer pair, value date, source document |
| Purchase/expense, line, payment, cash claim | supplier, event date, recognition class, qty/rate, payer, approval, posting, actual claim, installments |
| Cost entry, allocation plan/line, settlement coverage | source effect, recognized date, amount, farm/cycle/building target, driver snapshot, unallocated remainder, coverage link/amount ke komponen settlement |
| Receivable/payable, settlement application | creditor/debtor, source, principal, type, settled amount, payment/offset references |
| Item; receipt sapronak R1 | nama/jenis/satuan, konversi eksplisit, klasifikasi; receipt Owner menyimpan tanggal/jumlah/sumber, tidak mewajibkan stock pool/movement |
| Ownership pool, stock movement, gas use session (R2) | SKU, units, source, from/to location, qty, valuation sequence/value/status, pending cost source, consumption reference, remaining gas/cutoff method |
| Salary agreement, salary settlement, cost allocation | employee, cycle, agreed/final gross, advances/loan applications, wages paid, remaining; allocation references memakai COST-04/05 dan total tidak menduplikasi gross |
| Advance/loan, disbursement, application | type, creditor space/user/tenant, borrower, target salary/cycle opsional, outstanding mandiri lintas periode; application ke gaji hanya saat Owner memilih potongan, bukan kewajiban baru saat periode berganti |
| Work compensation, payment | task reference opsional, worker, date, qty/unit/rate snapshot, approval, cycle allocation, separate payment |
| Private account/transaction, cross-space link | owner_user_id, private category, balance, related business pair, no broad tenant read |
| Task, asset, maintenance, visit, operational note | scope, assignment, due/completed, cost link, visitor versus entered_by, recommendation follow-up, visibility INTERNAL/PPL_VISIBLE untuk catatan/task/visit nonfinansial |
| Production event, recording authority, summary snapshot, sampling (R2 detail/source authority) | building/farm scope, metric, coverage/cutoff, source, lineage, authority version, completeness, values/units, revision, superseded relation |
| Harvest DO, trip, ticket, allocation | vehicle, driver, broker, event time, DO link, heads/net kg, building breakdown, measured/unknown weight |
| Contract version, rule, lookup table | ownership, validity, primitive, typed input/output, intervals, dependencies, rounding, immutable snapshot |
| Calculation run, scenario | engine version, input snapshots, assumptions, matched rules, intermediates, warnings, results |
| Partner settlement, component, payout notice/payment/application | period, external reference, version, document/classification status, income vs asset/liability vs cash, net receivable/payable, suspense dan payment links |
| Command receipt, recovery reconciliation, replay tombstone | data space/command type/operation ID unik, business payload hash, actor, status/effect IDs, origin epoch dan last request epoch; durable restore-review state, incident, resolution/correction alias dan tombstone; receipt/effect/resolusi terkait atomik |
| Opening position, coverage declaration | cutoff, account/party/cycle, source, quantity/value known flags, recognized historical cost, applied/payable breakdown, coverage completeness |
| Valuation reconciliation (R2) | pool, source revision/event-set hash, economic order, base versions, impact/delta lines, affected periods, approval, effective revision, command receipt |
| Cash event claim, capture-only note linkage | origin note/operation ID, origin registration/author/device/tenant, occurred_at, claim type, canonical movement link, state, satu conversion efektif; note tanpa grant tidak menjadi command tenant sebelum reauth |
| Daily recording summary, revision | cycle/farm, `business_date`, feed used, mortality/cull, sampling, author/corrector/source DAILY, completeness, mode/cutoff version, revision/supersedes; key cycle+date, tanpa building atau inventory link wajib |
| Recovery/export manifest | recovery epoch atau snapshot ID, cutoff, approved procedure/audit, file hashes/status, permissions; tanpa secret/kredensial |
| Attachment, audit, notification, outbox receipt | scope, parent object ref/ACL inheritance, private storage key, status/version, actor, request/operation IDs |

### 25.2 Constraint lintas entitas

- **MOD-01:** semua entitas bisnis tenant-scoped; FK/validasi harus mencegah line tenant A merujuk header/akun/item tenant B. Keuangan pribadi owner-scoped; jangan membuat baris tanpa scope lalu mengandalkan UI.
- **MOD-02:** state dan saldo berasal dari transaksi sah; tidak boleh hanya menyimpan angka total yang bebas diedit tanpa mutasi sumber.
- **MOD-03:** rekonsiliasi harus dapat memeriksa `source amount = allocated + unallocated`, `opening + deltas = closing`, `obligation = valid settlements + remaining`.
- **MOD-04:** satu cost source effect, application kasbon, dan payment allocation mempunyai uniqueness/idempotency yang mencegah double posting.
- **MOD-05:** optimistic lock version disertakan pada record mutable; immutable records memakai correction reference. Index minimal tenant+scope+date/status dan foreign keys yang diperlukan untuk laporan.
- **MOD-06:** lampiran, export, dan notification merujuk objek dengan scope yang sama. Lampiran, revisi, dan histori mewarisi ACL/visibility parent di server; tidak mempunyai override yang memperluas akses. `PPL_VISIBLE` tidak tersedia pada objek finansial. Lampiran draft tanpa parent final hanya dapat dilihat pembuat yang berhak sampai linkage disahkan. Resource ID yang ditebak tidak boleh mengungkap keberadaan objek tenant lain.
- **MOD-07:** DAILY mempunyai satu summary efektif `(cycle_id, business_date)` lintas ABK/Owner/device. Revision/supersedes/expected version menjaga histori tanpa menjumlah atau menimpa payload; scope kandang diturunkan dari cycle dan grant terkini. Assignment multi-ABK unik per farm+user, bukan per farm. R1 recording tidak mempunyai efek inventory/biaya.

### 25.3 Kontrak layanan minimum, tanpa mengunci path API

Setiap command mutation wajib menerima konteks scope yang tervalidasi, operation/idempotency key, expected version bila relevan, payload bertipe, dan request_recovery_epoch sebagai envelope yang diperiksa server sesuai NFR-11. Server mengambil aktor dari sesi, bukan field client. Origin epoch/provenance operasi disimpan terpisah dari epoch request; payload hashing mengikuti FIN-12.

Hasil command minimal: object ID, versi/status authoritative, server timestamp, posting references bila ada, dan warning terstruktur. Error minimal:

| Kode semantik | Perilaku UI |
|---|---|
| `UNAUTHENTICATED` | Reauth tanpa membuang draft |
| `FORBIDDEN_SCOPE` | Tidak retry terus; antrean tetap aman untuk review, tidak membocorkan data tujuan |
| `VERSION_CONFLICT` | Perlihatkan perubahan yang boleh dilihat dan opsi resolusi |
| `PERIOD_LOCKED` | Ajukan koreksi kepada owner, bukan mengubah periode otomatis |
| `INSUFFICIENT_STOCK/POPULATION/CASH` | Tampilkan data berhak dan laporan lokal; stock hanya R2, kasbon tidak memakai batas gaji sebagai insufficient cash |
| `VALIDATION_ERROR` | Field dan alasan spesifik; contoh unit/rentang yang benar |
| `IDEMPOTENCY_PAYLOAD_MISMATCH` | Tidak membuat transaksi baru; minta operation baru untuk revisi |
| `DEPENDENCY_PENDING` | Tunda child sampai parent diterima |
| `RESTORE_REVIEW_REQUIRED` | Pertahankan ID/payload asal, jangan auto-post atau membuat ID baru; buka rekonsiliasi incident/epoch dengan user berwenang |
| `RATE_LIMITED/TEMPORARY_FAILURE` | Retry backoff dengan ID sama; jangan menyatakan sukses |

Response harus membedakan request diterima, dokumen submitted, dan efek finansial posted. Jangan menggunakan HTTP success sebagai bukti pembayaran nyata.

<a id="s26"></a>
## 26. Arsitektur, kesiapan Android, IoT, dan CCTV

Penjabaran R1 tersedia di [ARCHITECTURE.md](ARCHITECTURE.md). Dokumen tersebut mempertahankan aturan PRD, membedakan opsi teknis dari keputusan pengguna, dan tidak memulai implementasi.

### 26.1 Batas rancangan yang dibutuhkan

- **ARC-01:** awal berupa modular monolith: satu backend terstruktur dengan batas identity/tenant, operasional, finance/inventory, people/pay, production, contract, reporting, dan integrations. Tidak perlu microservices banyak sebelum beban nyata.
- **ARC-02:** front-end mobile-first menggunakan API yang sama untuk web dan kemasan Android. Server tetap sumber otorisasi, valuasi, serta posting; kalkulasi preview client bukan authoritative.
- **ARC-03:** database relasional transactional untuk bisnis, storage privat untuk lampiran, job worker untuk ekspor/notifikasi. Background jobs memakai transactional outbox atau mekanisme setara agar transaksi commit tidak kehilangan event.
- **ARC-04:** server tidak bergantung local filesystem atau sesi in-memory satu instance. File dan jobs harus tetap benar saat instance ditambah/restart. Cache bukan sumber kebenaran saldo.
- **ARC-05:** adaptasi storage offline, kamera, jaringan, dan notifikasi berada pada lapisan platform. Pengemasan APK tidak mengasumsikan semua service worker/web storage berperilaku identik dalam WebView.

### 26.2 Kandidat stack, belum keputusan final

| Lapisan | Kandidat evaluasi | Kriteria keputusan |
|---|---|---|
| Web client | TypeScript + React + bundler SPA, atau alternatif ekuivalen | Mobile-first, offline application shell, ekosistem matang, mudah dikemas Capacitor |
| Local store | IndexedDB melalui library yang terawat; adapter native jika kelak diperlukan | Transaksi lokal, migrasi aman, antrean tahan restart, isolasi user |
| API | Backend TypeScript terstruktur, framework dipilih melalui ADR | Validasi, auth, transaksi, decimal math, testing, dokumentasi API |
| Database | PostgreSQL atau relasional dengan kemampuan setara | Constraint, transaksi atomik, decimal, isolation, query laporan, backup |
| File | Object storage privat kompatibel S3 atau setara | Otorisasi, lifecycle, presigned URL berumur pendek |
| Jobs | Durable queue/DB-backed queue awal; layanan terpisah jika perlu | Idempotensi, retry, observability; tidak wajib Redis sejak awal |
| Android | Capacitor sebagai kandidat hybrid | Native plugins, push, kamera, signing/distribution, uji di perangkat nyata |

**ARC-06:** pilih versi stabil yang kompatibel saat development, pin versi/lockfile, tulis alasan ADR. PRD ini tidak memerintahkan memakai dependency “latest” tanpa evaluasi dan tidak menetapkan vendor cloud.

### 26.3 Kesiapan IoT masa depan

- **ARC-07:** pertahankan identitas tenant/kandang/bangunan stabil agar perangkat dapat didaftarkan ke scope yang benar; belum perlu membuat koneksi broker kosong atau ingest telemetry pada R1.
- Kontrak event masa depan memuat device ID, jenis metrik, nilai, unit, observed_at, received_at, sequence/event ID, dan kualitas pembacaan. Tenant/bangunan ditentukan dari registrasi perangkat server, bukan dipercaya dari payload sembarang.
- Adapter per protokol/vendor (misalnya MQTT/HTTPS jika didukung perangkat) terpisah dari transaksi operasional.
- Kredensial unik per perangkat, rotasi/revoke, dedupe replay, validasi range/unit, buffering bila gateway mendukung.
- Telemetry volume tinggi dapat memiliki penyimpanan/time-series dan retensi/agregasi tersendiri ketika dibutuhkan; tidak wajib database terpisah sejak hari pertama.
- Suhu terakhir berumur satu jam tidak disebut suhu sekarang. Backfill tidak otomatis memicu alarm real-time seolah kejadian baru.
- Kontrol pemanas/kipas otomatis dan alarm keselamatan berada di luar scope; membutuhkan safety design tersendiri.

### 26.4 Kesiapan CCTV masa depan

- **ARC-08:** streaming memakai jalur media/gateway terpisah; jangan proxy seluruh video melalui API pengeluaran atau menyimpan frame di tabel transaksi.
- Kompatibilitas kamera, codec, akses jaringan, izin vendor, bandwidth, live vs rekaman, dan retensi harus ditentukan nanti. Tidak menjanjikan semua CCTV bisa disambung.
- Akses kamera berdasarkan grant kandang, token berumur pendek, tanpa credential/RTSP URL permanen di client/log. Input endpoint kamera kelak membutuhkan pencegahan SSRF dan validasi jaringan.
- Live CCTV bergantung koneksi; buffering sensor tidak berarti live video bisa tersedia offline.
- Privasi pekerja, persetujuan, area rekaman, akses rekaman, dan retensi harus ditinjau sebelum fitur ini diaktifkan.

<a id="s27"></a>
## 27. Keamanan dan kebutuhan nonfungsional

Semua target berikut adalah **usulan acceptance environment**, belum benchmark nyata atau janji SLA komersial.

| ID | Kebutuhan | Target/verifikasi |
|---|---|---|
| NFR-01 | Respons mobile | Alur inti berfungsi pada Android RAM 3 GB kelas menengah dan browser Android yang didukung; uji perangkat nyata, bukan desktop emulator saja. |
| NFR-02 | Respons API | Pada dataset uji: p95 read terindeks <500 ms, mutation sederhana <800 ms, di luar latency internet/upload; error rate sistem <1%. |
| NFR-03 | Dataset kapasitas awal | Benchmark sintetis 50 tenant × 10 kandang × 4 bangunan, 1 juta baris efek finansial/recording total dan 100 sesi aktif. Banyak ABK per kandang termasuk uji; stock rows baru saat R2 aktif. Ini skenario uji, bukan estimasi pelanggan. |
| NFR-04 | Offline | Uji lease awal 72 jam, ≥1.000 operasi teks antre, restart browser/perangkat, antrean bertahan 7 hari, serta expiry/capture-only/logout OFF-17; durasi lease akhir mengikuti hasil Q-06. |
| NFR-05 | First-use UI | Target LCP ≤2,5 detik pada profil mobile/jaringan uji yang dicatat; screen cached/form lokal tetap responsif tanpa menunggu server. |
| NFR-06 | Backup/restore | Sasaran pilot data server-committed: RPO ≤15 menit, RTO ≤8 jam, dengan backup dan arsip log transaksi/PITR atau mekanisme setara yang diuji. Angka ini gate rancangan, bukan SLA yang sudah terbukti. Hosting/biaya/retensi dan hasil drill wajib disetujui sebelum data finansial produksi; backup harian saja tidak memenuhi target. Data local-only tidak tercakup RPO server. |
| NFR-07 | Data correctness | Golden tests dan invariants seluruhnya lulus; tidak boleh ada toleransi selisih rupiah kecuali rounding yang dinyatakan. |
| NFR-08 | Observability | Request ID, latency, failure, queue age, conflict count, backup status; tanpa isi nota pribadi/token/password dalam log. |
| NFR-09 | Accessibility | Uji keyboard, pembaca layar untuk form inti, fokus dialog, kontras, label error, zoom 200%, dan target sentuh. |
| NFR-10 | Recovery | Worker/API restart tidak menyebabkan efek ganda; job failure terlihat dan dapat di-retry aman. |

### 27.1 Protokol setelah pemulihan server

**NFR-11:** restore bukan restart biasa. Runbook R1 wajib diuji di lingkungan terisolasi dan menetapkan:

Operator infrastruktur memulihkan backup dengan identitas layanan yang berwenang; review isi kejadian finansial tetap oleh owner atau dukungan yang diberi izin terbatas menurut bagian 6.3. Prosedur restore tidak otomatis memberikan admin platform akses baca seluruh transaksi.

1. Hentikan posting/worker finansial selama pemulihan. Pulihkan ledger, command receipts, outbox, audit, revisions, dan replay tombstones pada titik konsisten. Rekonsiliasi lampiran memakai versi/hash manifest; file hilang bukan transaksi hilang dan tetap diberi status missing. Jangan melaporkan restore berhasil hanya karena aplikasi bisa login.
2. Catat recovery incident, titik pemulihan, rentang kehilangan yang mungkin, dan `recovery_epoch` baru yang tidak diwarisi dari snapshot lama. Bandingkan dengan log/monitoring/manifest yang disimpan di luar titik kegagalan yang sama. Jika rentang kehilangan belum dapat dibuktikan, nyatakan unknown; jangan mengklaim memenuhi RPO.
3. Cabut sesi dan minta reauth sebelum melayani data sensitif. Pulihkan/reverifikasi grant serta pencabutan/pergantian owner setelah titik backup menggunakan bukti otorisasi yang tahan pemulihan. Jika hak terkini belum dapat dibuktikan, akses scope terkait tetap diblokir; login ulang saja tidak membenarkan grant lama yang ikut pulih. Ekspor juga mengikuti pembatasan ini.
4. Server mewajibkan recovery epoch pada command dan memeriksanya **sebelum efek mutasi**; epoch lama masuk rekonsiliasi/karantina, tidak cukup mengandalkan client yang patuh. Perangkat juga membandingkan epoch dan merekonsiliasi operation ID. Receipt committed yang masih ada boleh di-replay sesuai izin terkini tanpa efek baru. Command pra-epoch baru yang tidak ditemukan bukan otomatis “belum pernah diposting”, meskipun client tidak menyimpan acknowledgement; outcome UNKNOWN memerlukan bukti/konfirmasi owner yang diaudit. Simpan `RESTORE_REVIEW_REQUIRED` durable menurut operation ID/space beserta bukti insiden. Operasi yang telah dipastikan belum diposting dapat dilanjutkan dengan ID asal setelah validasi/reconciliation epoch. Mengganti epoch request atau refresh sesi tidak menghapus status review dan tidak mengubah payload hash bisnis FIN-12.
5. Operator/owner yang berhak memeriksa bukti dan log, lalu memulihkan command dengan ID asal atau correction tertaut incident tepat satu kali. Jika menggunakan correction baru, resolusi ID lama wajib atomik menaut ke correction tersebut melalui receipt/tombstone agar replay ID lama tidak membuat efek lagi. Jangan meminta pengguna menyerahkan uang ulang hanya karena ledger dipulihkan. Jika payload/bukti tidak cukup, tetap unresolved dan tampilkan cakupan laporan terdampak. Kehilangan yang tidak dapat dipulihkan harus dilaporkan, bukan ditutupi saldo awal baru.
6. Uji kondisi commit+response hilang, acknowledgement sudah diterima tetapi restore mundur, command masih offline, serta upload lampiran parsial. Retry setelah restore tidak menggandakan biaya/kuantitas/kas; perubahan status akses tidak bocor. Catat RPO/RTO terukur, pemeriksaan saldo/relasi/hash, dan persetujuan membuka layanan kembali. Antrean lokal bukan satu-satunya backup server dan tidak diasumsikan menyimpan seluruh payload setelah acknowledgement.

### 27.2 Kontrol keamanan minimum

- **SEC-06:** HTTPS, password hashing standar jika memakai password, session expiry/refresh yang aman, logout/revoke, rate limiting login, proteksi CSRF bila cookie auth, dan sanitasi XSS. Penyimpanan token jangka panjang di browser harus melalui threat model, bukan dipilih karena paling mudah.
- **SEC-07:** operasi sensitif seperti perubahan owner, grant finansial, ekspor besar, dan perubahan kontrak memerlukan reauth/step-up sesuai ADR. Admin platform memerlukan MFA sebelum produksi.
- **SEC-08:** token/kredensial dalam secret store/environment sesuai platform, tidak dalam repositori, log, snapshot kontrak, atau file PRD.
- **SEC-09:** uji BOLA/IDOR dengan resource ID tenant lain, multi-membership, file URL, export job, API list/detail/update, WebSocket/push bila ada, dan cache offline.
- **SEC-10:** backup dan storage dilindungi dengan kontrol akses serta enkripsi layanan. Enkripsi at rest bukan alasan mengendurkan RBAC.
- **SEC-11:** retensi audit, lampiran, data pribadi, dan prosedur penghapusan/anonimisasi memerlukan kebijakan Q-11. Sampai disetujui, tidak ada purge otomatis data finansial posted atau publikasi lampiran. Soft-delete bukan jaminan pemenuhan hukum privasi.
- **SEC-12:** ekspor snapshot untuk review memakai data sintetis atau disamarkan. Lampiran pengguna dalam diskusi tidak dimasukkan ke repository source, sample data, atau PR publik.

<a id="s28"></a>
## 28. Contoh hitungan wajib/golden test

Semua contoh berdiri sendiri kecuali dinyatakan berurutan. Nilai adalah fixture sintetis, bukan tarif mitra/ketentuan hukum. Semua nilai Rupiah adalah integer; hitungan rasio/persentase memakai fixed-point. Contoh berlabel R2 bukan release gate R1.

### GOLD-01 — Uang pegangan dan pertanggungjawaban

- Kas usaha Rp2.000.000; pegangan ABK Rp0.
- Transfer Rp1.000.000 ke ABK: kas usaha Rp1.000.000; pegangan Rp1.000.000; biaya Rp0.
- ABK melaporkan pembelian gas Rp300.000 sudah dibayar: sebelum review saldo tercatat pegangan Rp1.000.000, klaim Rp300.000, perkiraan fisik Rp700.000.
- Setelah diterima dan disetujui Owner: saldo pegangan Rp700.000, klaim Rp0, biaya gas Rp300.000; tidak ada inventory atau biaya pemakaian lanjutan.
- ABK mengembalikan Rp200.000: kas usaha Rp1.200.000; pegangan Rp500.000; biaya tetap Rp300.000.
- Total kas akhir Rp1.700.000. Transfer/pengembalian bukan pendapatan/biaya.

### GOLD-02 — Reimbursement dan pembelian kredit

- ABK membeli solar Rp150.000 dengan uang pribadi; setelah diterima dan disetujui Owner, biaya Rp150.000 dan utang reimbursement Rp150.000. Ini bukan kasbon usaha; kas usaha belum berubah.
- Reimbursement Rp100.000 lalu Rp50.000: biaya tetap Rp150.000, utang akhir Rp0, kas usaha total turun Rp150.000.
- Peralatan tahan lama kredit toko Rp400.000 yang diterima/disetujui menjadi catatan klasifikasi dan utang Rp400.000, bukan biaya periode otomatis; saat dibayar kas turun Rp400.000 tanpa biaya baru.

### GOLD-03 — R2: Gas dibeli dan dipakai lintas periode

- Beli 20 unit isi ulang gas, Rp200.000/unit; unit dasar contoh adalah unit isi ulang, bukan tabung aset.
- Saat diterima: nilai stok Rp4.000.000; jika dibayar kas turun Rp4.000.000; biaya pemakaian Rp0.
- Periode A memakai 12 unit: biaya A Rp2.400.000; stok 8 unit senilai Rp1.600.000.
- Periode B memakai 8 unit: biaya B Rp1.600.000; stok Rp0.
- Total biaya dua periode Rp4.000.000, bukan Rp8.000.000. Pemindahan lokasi sebelum consumption tidak membuat biaya.

### GOLD-04 — R2: Moving weighted average

- Stok 10 unit @Rp100.000 = Rp1.000.000.
- Terima 10 unit @Rp120.000 = Rp1.200.000.
- Sebelum pemakaian: 20 unit, Rp2.200.000; rate rata-rata Rp110.000.
- Pakai 5 unit: biaya Rp550.000; stok 15 unit, Rp1.650.000.
- Perubahan harga master menjadi Rp130.000 tidak mengubah issue Rp550.000 yang sudah posted.

### GOLD-05 — Gaji periode dan upah pekerjaan tidak tercampur

- Kasbon usaha Rp1.000.000 dicairkan tanpa salary agreement; gaji periode kemudian difinalkan Rp3.000.000.
- Owner secara eksplisit memilih application Rp1.000.000: sisa hak tunai Rp2.000.000. Biaya gaji Rp3.000.000; kasbon outstanding turun sekali.
- Pelunasan gaji Rp2.000.000: sisa gaji Rp0; biaya tetap Rp3.000.000.
- Pekerjaan kemas kotoran 100 karung × Rp2.000 = Rp200.000, disetujui dan dibayar tersendiri.
- Slip gaji tidak memuat Rp200.000 itu. Laporan biaya tenaga kerja boleh menampilkan Rp3.200.000 dengan dua baris.
- Total kas keluar kasbon+pelunasan+pekerjaan Rp3.200.000, bukan Rp4.200.000.

### GOLD-06 — Kasbon mandiri melebihi hak gaji

- Kasbon usaha Rp1.800.000 dicairkan tanpa salary agreement/payroll aktif. Gaji kemudian difinalkan Rp1.500.000.
- Owner memilih application Rp1.500.000, tidak melebihi hak payable atau kasbon outstanding; pembayaran tunai gaji Rp0, sisa kasbon Rp300.000.
- Sisa Rp300.000 terbawa sebagai saldo kasbon ABK yang sama pada periode berikutnya tanpa konversi, persetujuan ulang, atau reissue wajib. Posisi sebelum application adalah Rp1.500.000 − Rp1.800.000 = -Rp300.000 berlabel “sisa kasbon”; setelah application, pembayaran tunai Rp0 dan saldo kasbon Rp300.000. Upah pekerjaan Rp200.000 tidak dipotong otomatis.
- Skenario alternatif dari saldo awal yang sama: Owner memilih potongan Rp500.000 → sisa hak gaji Rp1.000.000 dan kasbon Rp1.300.000; jika sisa gaji benar-benar dibayar, kas turun Rp1.000.000. Memilih tanpa potongan juga sah, tidak otomatis memakai potongan maksimum. Pembayaran gaji Rp500.000 yang sudah ada harus lebih dahulu mengurangi hak tersedia untuk potongan berikutnya, bukan dihitung dari bruto lagi.

### GOLD-07 — Alokasi biaya bersama dan sisa pembulatan

- Biaya Rp1.000.001 dibagi sama rata ke tiga periode dengan urutan alokasi A, B, C.
- Floor awal masing-masing Rp333.333; dua rupiah residu jatuh ke A dan B melalui tie-break urutan tersimpan. Hasil A Rp333.334, B Rp333.334, C Rp333.333.
- Total tepat Rp1.000.001. Biaya sumber tetap satu.
- Biaya Rp2 dibagi dengan proporsi fixed-point 26%, 26%, 26%, 22% dan urutan tersimpan A–D → A Rp1, B Rp1, C Rp0, D Rp0; total tepat Rp2 dan tidak ada bagian negatif.
- Alokasi parsial Rp600 dari biaya Rp1.000, sama rata tiga tujuan → masing-masing Rp200; sisa belum dialokasikan Rp400 tetap terlihat, tidak ikut dibagi paksa.
- Biaya lain Rp500.000 tanpa alokasi tidak otomatis masuk ketiga periode; laporan menampilkan belum dialokasikan Rp500.000.

### GOLD-08 — Performa final

- DOC hidup diterima 10.000; mati 150; afkir keluar nonpanen 50; panen 9.800 ekor, total 19.600 kg; tidak ada selisih lain.
- Pakan konsumsi 29.400 kg; seluruh panen umur 35 hari.
- Deplesi = 200/10.000 ×100 = **2%**; daya hidup **98%**.
- ABW = 19.600/9.800 = **2 kg/ekor**; FCR = 29.400/19.600 = **1,5**.
- IP = 98×2×100/(1,5×35) = **373,333333...**, tampilan 373,33 jika 2 desimal.
- Setelah panen, populasi tersisa nol bukan berarti deplesi 100%.

### GOLD-09 — Panen bertahap dan FCR berjalan

- Panen 4.000 ekor umur 28; panen 6.000 ekor umur 32: umur rata-rata **30,4 hari**, bukan 30 hari.
- Skenario berjalan terpisah: pakan terpakai 12.000 kg, kg panen kumulatif 2.000, sisa 5.000 ekor dengan ABW sampling representatif 1,2 kg.
- Biomassa hidup 6.000 kg; denominator FCR berjalan 8.000 kg; FCR estimasi **1,5**, bukan 2,0 karena mengabaikan kg yang sudah dipanen.
- Bila sampling sisa ayam belum ada, FCR berjalan tidak tersedia; denominator tidak diisi 2.000 saja lalu diberi label lengkap.

### GOLD-10 — Lookup harga, basis, dan batas interval

- Tabel sintetis: `[1,5; 2,0)` → Rp21.000/kg; `[2,0; ∞)` → Rp20.000/kg.
- Tiket A: 1.000 ekor, 1.900 kg → ABW1,9 → nilai Rp39.900.000.
- Tiket B: 1.000 ekor, 2.100 kg → ABW2,1 → nilai Rp42.000.000.
- Basis per tiket: total **Rp81.900.000**.
- Basis rata-rata periode: total4.000kg/2.000ekor =2,0 → seluruh4.000kg×Rp20.000 = **Rp80.000.000**.
- Dua angka berbeda sah hanya jika basis kontraknya berbeda. ABW tepat2,0 masuk baris kedua; ABW1,999 yang hanya ditampilkan2,00 tetap baris pertama kecuali aturan rounding lookup menyatakan lain.
- ABW1,4 tidak tercakup; output bukan otomatis Rp0 atau harga baris pertama.

### GOLD-11 — Bonus dan urutan potongan sintetis

- Hasil ayam Rp400.000.000; sapronak yang ditagihkan Rp300.000.000 → margin dasar Rp100.000.000.
- FCR aktual1,50, standar1,60 → diff aktual-standar = **-0,10**.
- Rule eksplisit diff≤-0,10 memberi Rp100/kg ×20.000kg → bonus Rp2.000.000.
- Subtotal setelah bonus Rp102.000.000. Potongan beban contoh2% **atas subtotal ini** → Rp2.040.000.
- Penghasilan setelah beban Rp99.960.000. Jika basis potongan margin sebelum bonus, hasil akan berbeda; engine harus menolak konfigurasi tanpa basis.
- Persentase di sini adalah contoh rule, bukan rekomendasi tarif pajak.

### GOLD-12 — Hasil kemitraan, tabungan, utang lama, dan pencairan

- Penghasilan kemitraan terverifikasi setelah biaya PT Rp50.000.000.
- Tabungan masih hak owner ditahan Rp5.000.000; pelunasan pokok utang lama Rp2.000.000.
- Kas diharapkan **Rp43.000.000**. Dibayar Rp20.000.000 lalu Rp23.000.000; belum cair awal Rp43.000.000, sesudah pertama Rp23.000.000, akhir Rp0.
- Pendapatan sampingan periode Rp2.000.000; biaya owner di luar settlement Rp12.000.000.
- Laba manajerial periode =50+2-12 = **Rp40.000.000**. Bukan43+2-12, karena tabungan dan pelunasan pokok tidak otomatis menjadi biaya periode ini.
- Sapronak yang sudah diperhitungkan dalam Rp50.000.000 tidak dikurangkan lagi.

### GOLD-13 — Modal dan kebutuhan pribadi

**Fixture R1 — hanya sisi usaha; rekening pribadi adalah sumber eksternal, bukan akun yang dikelola aplikasi:**

- Owner memindah Rp5.000.000 dari rekening pribadi ke kas usaha sebagai modal.
- Kas usaha +Rp5.000.000; kontribusi owner +Rp5.000.000; pendapatan usaha Rp0.
- Owner menarik Rp500.000 untuk kebutuhan pribadi: kas usaha -Rp500.000; penarikan owner Rp500.000; biaya kandang Rp0.

**Tambahan fixture R2 — hanya setelah buku pribadi aktif:** modal mempunyai pair pribadi keluar Rp5.000.000 dan prive mempunyai pair pribadi masuk Rp500.000; bukan pendapatan/biaya pribadi yang menggandakan hasil usaha. Rekap pribadi tidak boleh diunduh ABK/PPL/admin. Pada R1 cukup memastikan fitur pribadi tidak diaktifkan/diakses; tidak membangun pair untuk menjalankan fixture sisi usaha.

### GOLD-14 — Retry, konflik, dan periode terkunci

- Operasi pembelian gas ID `op-demo-001`, Rp100.000 dikirim lima kali dengan payload sama → tepat satu dokumen dan satu efek uang/biaya.
- ID sama dengan payload Rp200.000 → mismatch error, bukan update tersembunyi.
- Uji tambahan R2: dua perangkat masing-masing mengambil7 unit dari stok10 → hanya satu dapat posted penuh; yang lain konflik, tidak menjadi stok -4. Tidak ada inventory contention test pada R1.
- Draft klaim pembelian gas periode A tiba setelah A locked → tidak mengubah snapshot; masuk jalur review koreksi.

### GOLD-15 — R2: Pinjaman owner pribadi melalui potongan gaji

- Owner pribadi mempunyai piutang ABK Rp300.000; gaji usaha finalized Rp3.000.000.
- Offset dengan persetujuan: hak yang dibayar ke ABK Rp2.700.000; kewajiban usaha ke owner Rp300.000; biaya gaji tetap Rp3.000.000.
- Piutang pribadi Rp300.000 berpindah debitur dari ABK ke usaha, belum menjadi penerimaan kas.
- Usaha membayar ABK Rp2.700.000 dan owner Rp300.000 → total kas usaha turun Rp3.000.000; piutang pribadi kepada usaha Rp0.
- Pokok Rp300.000 bukan pendapatan pribadi baru dan tidak membuat biaya gaji Rp3.300.000.

### GOLD-16 — Data ringkasan tidak dijumlah ganda

- Rekap konsumsi sampai hari10: 1.000 kg. Rekap terbaru sampai hari11: 1.200 kg.
- Kumulatif yang digunakan **1.200 kg**, bukan2.200 kg.
- Jika ada event detail200kg yang mencakup hari11 yang sama, sistem tidak menambahkannya lagi tanpa migrasi sumber/cutoff yang sah.
- Rekap tingkat kandang tidak menghasilkan FCR setiap bangunan jika tidak ada pembagian nyata.

### GOLD-17 — Kehilangan lain dan kelas panen campuran

- DOC1.000; mati20; afkir nonpanen5; kehilangan lain10 yang sudah disahkan sebagai kehilangan nonpanen, bukan mortalitas.
- Panen hidup normal950 ekor×2kg=1.900kg dan afkir terjual15 ekor×1kg=15kg. Total965 ekor/1.915kg; populasi akhir0.
- Deplesi mati+afkir nonpanen = **2,5%**. Pengurangan nonpanen total = **3,5%**. Daya hidup final untuk IP = **96,5%**, bukan97,5%.
- Pakan2.872,5kg → FCR **1,5**. ABW1.915/965kg; seluruh panen umur35.
- IP =96,5×(1.915/965)×100/(1,5×35) = **364,761904...**, tampilan **364,76**.
- Jika kehilangan10 ekor masih belum direkonsiliasi atau kelas panen belum dipetakan, IP final tidak tersedia.

### GOLD-18 — R2: Gas parsial; biaya sudah tercakup settlement

- R2-only gas detail: satu isi gas bernilaiRp200.000. Cutoff A: sisa0,40 disetujui sebagai estimasi → consumption A0,60 bernilaiRp120.000, inventory0,40 bernilaiRp80.000.
- R2-only gas detail: saat habis pada B, consumption hanya0,40 bernilaiRp80.000. Total biaya tetapRp200.000.
- R2-only gas detail: nilai isi gas yang sama dikoreksi menjadi Rp220.000 setelah A/B. Biaya A menjadi Rp132.000 (delta +Rp12.000), B Rp88.000 (delta +Rp8.000), inventory tetap nol; tidak ada consumption/kuantitas tambahan. Jika A atau B LOCKED, revision INV-16 menunggu reopen seluruh snapshot terdampak; retry delta tidak menambah biaya kedua.
- Contoh R1 coverage terpisah: biaya gas konsumabel periodeRp1.000.000 (sudah diakui saat diterima dan disetujui), coverage terverifikasi dalam penghasilan net PT Rp400.000 → biaya di luar settlement **Rp600.000**; biaya yang dilaporkan tetapRp1.000.000.
- Jika PT menambah reimburseRp400.000 (bukan mengurangi net), coverage **Rp0** dan biaya di luar settlement **Rp1.000.000**.

### GOLD-19 — R2: Stok awal belum bernilai

- Opening10 unit, nilai belum diketahui → stok10 dengan valuation PENDING, bukanRp0.
- Terpakai4 unit → fisik tersisa6, pending cost4 unit; biaya belum diketahui, lock periode pemakai ditolak.
- Owner menetapkan opening value Rp1.000.000 sebelum ada valued effects yang terdampak → backfill pending issue4unit menjadiRp400.000, nilai sisaRp600.000.
- Kirim command valuation ulang → biaya tetapRp400.000, tidak menjadiRp800.000.

### GOLD-20 — Payout notice versus uang masuk

- Dokumen net due Rp10.000.000 telah diverifikasi, klasifikasi pendapatan masih PENDING → receivable net10juta, cash0, status unpaid; bukan laba final.
- PT memberi kabar akan transfer6juta → cash tetap0, receivable10juta.
- Owner mengonfirmasi penerimaan6juta → cash+6juta, receivable4juta, status partial. Salin status eksternal “Awaiting” tidak membalik transaksi ini.
- Penerimaan tersisa4juta → cash kumulatif10juta, receivable0, status paid; classification tetap PENDING sampai rincian direkonsiliasi, sehingga financial lock masih ditolak.
- Ini adalah mode `PAYOUT_ONLY`: Owner tetap dapat mencatat transaksi harian, membayar kewajiban yang sudah disahkan, dan memulai siklus berikutnya; payout-only tidak menjadi laba final atau lock laba lengkap.

### GOLD-21 — R2: Biaya stok final sama walau urutan upload berbeda

- Opening 10 unit bernilai Rp1.000.000. Kejadian sah: penerimaan 10 unit bernilai Rp2.000.000, kemudian pemakaian 10 unit. Urutan ekonomi tidak ambigu.
- Upload penerimaan dahulu → rata-rata Rp150.000; biaya Rp1.500.000; sisa 10 unit bernilai Rp1.500.000.
- Upload pemakaian dahulu → biaya sementara Rp1.000.000; setelah penerimaan, sisa sementara 10 unit bernilai Rp2.000.000. Deteksi REQUIRED; belum boleh final.
- Replay/approval menambahkan delta biaya +Rp500.000 dan inventory −Rp500.000, tanpa kuantitas/kas baru. Hasil final sama dengan urutan pertama; retry approval tidak menambah delta kedua.
- Jika receipt sudah diterima tetapi koreksi A belum disahkan, lalu 5 unit dipakai di periode B, biaya sementara B Rp1.000.000; replay mengubahnya menjadi Rp750.000 (delta −Rp250.000). Nilai akhir 5 unit Rp750.000; total biaya A+B Rp2.250.000. Jika B tiba **sebelum** receipt dan stok server tidak cukup, B tetap klaim pending tanpa posted cost sampai penerimaan terbukti; jangan membuat stok negatif. Lock B ikut terblokir/reopen bila dampaknya belum selesai.
- Timestamp yang sama tanpa urutan ekonomi yang cukup → BLOCKED jika hasil bergantung urutan, bukan memilih urutan upload. Sesudah owner menetapkan urutan, seluruh permutasi upload harus menghasilkan net ledger yang sama.

### GOLD-22 — R2: Revisi harga dan retur sesudah koreksi valuasi

- Lanjutkan GOLD-21 **tanpa** pemakaian tambahan periode B: biaya Rp1.500.000, sisa 10 unit Rp1.500.000.
- Koreksi nilai receipt asli dari Rp2.000.000 menjadi Rp2.200.000, kuantitas tetap 10. Adjustment sumber menaikkan nilai perolehan/payable sesuai dokumen Rp200.000; tidak menambah penerimaan 10 unit lagi.
- Nilai tersedia Rp3.200.000/20 = Rp160.000 per unit. Biaya efektif pemakaian 10 unit menjadi Rp1.600.000; tambahan delta biaya hanya Rp100.000 terhadap nilai efektif sebelumnya, bukan Rp600.000 lagi. Sisa 10 unit Rp1.600.000.
- Retur pemakaian 5 unit mengacu issue asal dengan nilai efektif Rp160.000: inventory +Rp800.000, biaya −Rp800.000. Sisa 15 unit Rp2.400.000; biaya net Rp800.000; jumlah keduanya Rp3.200.000.
- Run dibuat lalu ada event baru → approval versi lama ditolak dan direplay; tidak menerapkan angka stale. Periode terdampak yang LOCKED harus dibuka kembali sebelum delta; snapshot lama tetap tersedia.

### GOLD-23 — Serah-terima tunai offline pada dua perangkat

- Saldo awal owner Rp2.000.000, ABK Rp0. Owner menyerahkan Rp1.000.000 offline; owner dan ABK masing-masing mencatat kejadian yang sama. ABK kemudian membeli gas Rp300.000.
- Sebelum pengesahan, saldo server belum berubah; penerimaan pending dan klaim belanja terlihat terpisah. Perkiraan uang di tangan belum dapat dipastikan dari saldo buku, bukan dinyatakan minus Rp300.000 sebagai fakta fisik.
- Belanja tiba lebih dahulu → pending sumber/parent, bukan ditalangi ABK otomatis. Owner menautkan kedua laporan serah-terima ke satu cash movement dan mengesahkan transfer, lalu belanja.
- Saldo akhir owner Rp1.000.000, ABK Rp700.000, biaya Rp300.000; total kas Rp1.700.000. Retry kedua klaim, transfer, dan belanja tidak mengubah hasil. Grant dicabut/lock terjadi sebelum sync → klaim tetap untuk review, bukan diposting tanpa izin.

### GOLD-24 — Opening gaji di tengah siklus tanpa biaya ganda

- Mulai mencatat hari ke-18. Hak gaji historis telah finalized Rp3.000.000; kasbon Rp500.000 sudah diaplikasikan dan pembayaran langsung sebelumnya Rp1.000.000. Sisa payable pada cutoff Rp1.500.000; tidak ada kasbon belum diaplikasikan.
- Opening membawa cost historis Rp3.000.000 beserta sumber/coverage dan payable Rp1.500.000; bukan cash out baru Rp1.500.000 atau biaya baru Rp3.000.000 setelah cutoff. Histori kasbon yang sudah diaplikasikan bukan receivable aktif yang boleh dipotong lagi.
- Pembayaran sisa Rp1.500.000 setelah cutoff → kas turun Rp1.500.000, payable nol, tambahan biaya gaji nol; laporan seluruh periode tetap mempunyai satu sumber biaya gaji Rp3.000.000.
- Jika biaya lain sebelum cutoff tidak lengkap, laporan seluruh periode tetap parsial meskipun gaji sudah selesai. Data biaya sebelumnya yang belum diketahui tidak menjadi nol dan tidak meluluskan final lock.

### GOLD-25 — Talangan owner tanpa buku pribadi

- Buku pribadi tidak dibangun. Kas usaha awal Rp1.000.000. Owner membayar pembelian solar Rp600.000 dari uang di luar akun usaha; barang diterima dan disetujui.
- Biaya solar Rp600.000, utang usaha kepada Owner +Rp600.000; kas usaha tetap Rp1.000.000. Tidak membuat kas ABK atau pair buku pribadi.
- Usaha mengganti Rp400.000 → kas usaha Rp600.000, utang Owner Rp200.000, biaya tetap Rp600.000. Tidak ada saldo stok atau usage R1.
- Jika Owner hanya meminjamkan alat kerja tahan lama milik pribadinya untuk dipakai kandang, catatan penyerahan opsional tidak membuat kas, biaya, aset usaha, utang pembelian, atau depresiasi. Itu berbeda dari talangan Owner untuk membeli alat bagi usaha; pembelian baru dicatat sebagai kewajiban kepada Owner atau kontribusi yang dipilih, dengan klasifikasi tahan lama dan tanpa biaya periode otomatis.

### GOLD-26 — Tier seluruh volume bukan tarif marginal

- Fixture perluasan R2: kuantitas 10.000 kg, rate tier di bawah 5.000 kg Rp18.000/kg dan mulai 5.000 kg Rp20.000/kg, basis lookup adalah jumlah kg yang sama, `tier_application=ALL_MATCHED_VOLUME`.
- Hasil = 10.000 × Rp20.000 = Rp200.000.000. Cara marginal 5.000 × Rp18.000 + 5.000 × Rp20.000 = Rp190.000.000 **bukan** hasil template ini.
- Mode tier tidak dinyatakan → konfigurasi tidak valid. Kontrak yang menghendaki marginal → unsupported/manual, bukan dihitung sebagai seluruh volume atau ditambahkan primitive diam-diam.

### GOLD-27 — Acknowledgement sebelum restore mundur

- Saldo server Rp1.000.000; command X membayar pembelian solar Rp100.000 dan mendapat acknowledgement. Ledger/receipt X kemudian hilang karena restore ke titik sebelum X: saldo buku yang dipulihkan Rp1.000.000 bukan bukti uang fisik kembali.
- Epoch berubah; klien yang membawa acknowledgement X masuk RESTORE_REVIEW_REQUIRED. Jangan membuat command Y atau melakukan pembayaran fisik kedua. Setelah bukti direkonsiliasi dan X dipulihkan satu kali, kas Rp900.000 dan biaya Rp100.000.
- Jika X masih ada pada titik restore, replay mengembalikan receipt lama tanpa efek tambahan. Jika payload/bukti X tidak tersedia, laporkan celah data dan jangan mengarang recovery sukses.
- Command Z yang pasti belum pernah diposting tetap memakai ID Z setelah reauth/validasi. Foto belum lengkap tetap pending/missing, bukan alasan menghapus efek teks atau menggandakan transaksi. Grant yang tercabut sesudah backup tidak boleh hidup kembali hanya karena row lama dipulihkan.

### GOLD-28 — Mode DAILY dan revisi recording tidak menggandakan efek

- Siklus C memakai mode `DAILY` dengan ABK A dan B aktif pada kandang yang sama. Pada business date D, A submit rekap kandang-global berisi feed dilaporkan 100 kg, mati 2 ekor, afkir 1 ekor, dan sampling 10 ekor dengan total bobot bersih 2,0 kg (ABW sampel 0,2 kg). Setelah validasi server, nilai langsung efektif tanpa approval manual Owner.
- B membuka rekap yang sama dari perangkat lain, bukan form kandang/tanggal terpisah. Koreksi B memakai expected version dan menggantikan nilai efektif; submit serentak yang stale ditolak sebagai version conflict. Kedua ABK tetap dapat mencatat untuk kandang itu; tidak ada penjumlahan antar-ABK.
- Koreksi berversi mengubah feed menjadi 95 kg dan mati menjadi 3 ekor; retry dengan operation ID/payload yang sama mengembalikan receipt lama. Rekap efektif D adalah feed 95 kg, mati 3 ekor, afkir 1 ekor, sampling 10 ekor/2,0 kg total, bukan feed 195 kg atau mati 5 ekor.
- Recording DAILY hanya data produksi: tidak mengurangi inventory, membuat consumption, mengubah kas, atau mem-post biaya. Submit/revisi valid langsung berlaku terlepas dari status penerimaan Owner atau klaim pembelian; keterlambatan nota/penerimaan tidak membuat recording pending dan recording tidak mengesahkan pembelian. Hari tanpa laporan ditandai `GAP`; angka nol yang sengaja dikonfirmasi dibedakan dari kosong. Input tidak valid ditolak/ditandai koreksi oleh server, bukan diam-diam di-post.
- Pada D+1 nilai efektif adalah feed 20 kg, mati 1 ekor, afkir 0 terkonfirmasi. Total rentang D sampai D+1 adalah 115 kg, mati 4, afkir 1; bukan hanya angka hari terakhir atau penjumlahan semua revisi. Sampling tetap pengukuran bertanggal, bukan bobot populasi yang dijumlah per hari.

### GOLD-29 — Keuangan personal tetap terpisah per ABK

- Kandang K memiliki ABK A dan B aktif. Masing-masing mempunyai saldo kasbon usaha, utang reimbursement dari talangan uang pribadinya, kas pegangan, agreement/hak gaji, dan histori payroll yang terpisah pada identitas ABK; saldo tidak digabung atau saling di-offset karena bekerja di kandang yang sama.
- Owner tetap dapat melihat masing-masing catatan. Kasbon usaha A tidak menjadi hutang B saat assignment berubah; uang pribadi ABK yang menalangi pembelian tetap reimbursement kepada orang yang benar, bukan kasbon atau saldo kandang bersama. Application kasbon ke hak gaji hanya dengan pilihan dan persetujuan Owner untuk ABK yang bersangkutan.
- Jika grant A dicabut, antrean A yang belum tersinkron tetap milik identitas A untuk review, tidak pindah ke B; B tidak dapat memakai ulang operation ID A. A maupun B dapat ditugaskan ke kandang lain tanpa memindahkan histori payroll/kasbon.

### GOLD-30 — Pembelian sederhana R1 tanpa inventory

- Owner mencatat penerimaan DOC, pakan, dan sapronak mitra sebagai informasi; tidak ada kas, biaya, nilai stok, atau saldo inventory yang dibuat oleh catatan tersebut.
- ABK mengajukan pembelian gas Rp300.000 dari kas pegangan. Sebelum Owner menyetujui, klaim terlihat tetapi belum menjadi expense posted. Foto/nota boleh tidak dilampirkan dan tidak ada alasan wajib jika kosong.
- Setelah barang diterima dan Owner online menyetujui, kas pegangan turun Rp300.000 dan biaya konsumabel gas Rp300.000 diakui sekali. Tidak ada opening stock, usage, opname, sisa gas, atau biaya tambahan saat dipakai.
- Ulangi alur dengan belanja listrik Rp150.000 atau jasa perbaikan selesai Rp200.000: pengajuan dan posting tetap tersedia, bukan ditolak karena bukan gas/solar/peralatan; biaya dan uang keluar hanya diakui sekali sesuai kejadian.
- Pembelian peralatan tahan lama Rp1.000.000 yang disetujui dicatat sebagai belanja/kas keluar dengan klasifikasi ringan `DURABLE_EQUIPMENT`, bukan biaya periode otomatis; R1 tidak menuntut register aset atau depresiasi.

<a id="s29"></a>
## 29. Kriteria penerimaan dan matriks pengujian

Format setiap baris: kondisi awal (**Given**), tindakan (**When**), dan hasil terukur (**Then**). Pengujian finansial menggunakan database transactional, tidak cukup hanya unit test UI.

| ID | Skenario Given → When → Then | Requirement utama |
|---|---|---|
| AC-01 | User tenant A mempunyai ID transaksi tenant B → GET/update/export/file → ditolak tanpa payload B; seluruh jalur teruji. | SEC-01, SEC-02, MOD-01 |
| AC-02 | PPL diundang farm A dan B lintas tenant → melihat daftar → hanya keduanya; harga, gaji, dan private finance tidak terkirim di API. | SEC-03, SEC-05 |
| AC-03 | Grant PPL dicabut → request/notification berikutnya → akses ditolak, histori catatan tetap ada. | SEC-03, NOT-07 |
| AC-04 | Admin menonaktifkan tenant → owner membaca/ekspor dan mencoba mutasi → baca sesuai kebijakan, mutasi ditolak; data tidak dihapus. | ONB-01, OFF-06 |
| AC-05 | Limit tinggal satu slot → dua request tambah kandang paralel → hanya satu lolos. | ONB-01, MOD-01 |
| AC-06 | Farm mempunyai satu active cycle → aktivasi lain paralel → ditolak atomik. Setelah fisik selesai boleh aktif baru walau keuangan lama open. | CYC-03, CYC-05 |
| AC-07 | Kapasitas7.000, DOC6.500 → aktifkan → populasi6.500, kapasitas tetap7.000. Rincian bangunan unknown boleh PENDING pada R1; alokasi diketahui + unallocated tepat N0, COMPLETE harus sum tepat, tanpa bangunan fiktif/prorata. | CYC-02, CYC-03, CYC-04, ONB-10 |
| AC-08 | Periode belum dibuat → catat biaya masa kosong → tersimpan tanpa dipaksa ke periode lama/berikutnya. | COST-03 |
| AC-09 | Transfer kas ke ABK lalu belanja/pengembalian → jalankan GOLD-01 → saldo dan biaya sama persis. | CASH-02, FIN-10 |
| AC-10 | Belanja nyata menunggu review → owner reject kategori → klaim uang keluar tetap terlihat sampai direkonsiliasi, tidak otomatis pulih atau potong gaji. | FIN-10 |
| AC-11 | Belanja ABK ditalangi/kredit → bayar dua kali sebagian → utang berkurang, biaya tidak bertambah; GOLD-02. | CASH-07, CASH-08 |
| AC-12 | Dokumen approved belum dibayar → buka laporan → biaya/utang ada, cash movement belum ada. | FIN-02, COST-01 |
| AC-13 | Owner membayar toko langsung → simpan → tidak menambah/mengurangi kas pegangan fiktif. | CASH-06 |
| AC-14 | Uang muka supplier tanpa barang → simpan → bukan stok diterima/biaya; setelah penerimaan, taut aplikasi uang muka sekali. | CASH-09 |
| AC-15 | Transaksi posted → edit nilai → ditolak; reversal+replacement beralasan menghasilkan histori dan total benar. | FIN-03, FIN-09 |
| AC-16 | Belanja invoice100, pembayaran total110 tanpa klasifikasi → submit → ditolak; kelebihan harus menjadi advance/piutang eksplisit. | FIN-06 |
| AC-17 | GOLD-07 termasuk Rp2 dibagi 26/26/26/22% → alokasi deterministik 1/1/0/0, semua nonnegatif dan total tepat; tie mengikuti urutan tersimpan, bukan sisa negatif di baris terakhir. | COST-04, COST-05, DATA-06 |
| AC-18 | Beli stok, pindah lokasi, pakai → jalankan GOLD-03/04 → hanya consumption menambah biaya dan stok tidak negatif. | INV-05, INV-08, INV-13 |
| AC-19 | Recording/penerimaan pakan memakai unit berbeda → konversi menurut satuan/kemasan terverifikasi, bukan 50 kg/sak universal; R1 tidak memerlukan saldo stok. Uji SKU gas/inventory dilanjutkan R2. | DATA-04, REC-08, ONB-06 |
| AC-20 | Stok fisik selisih → opname → tidak mengubah saldo sebelum adjustment owner; jejak selisih tersimpan. | INV-12 |
| AC-21 | Master harga/nama/username berubah → lihat pembelian/gaji/upah/recording lama → nilai snapshot dan actor ID tetap; consumption/kontrak diuji saat R2 aktif. | DATA-08, PAY-12, SEC-16 |
| AC-22 | Gaji per periode dan job tambahan → GOLD-05 → slip gaji hanya3juta, job200ribu terpisah, laporan3,2juta. | PAY-04, PAY-14, PAY-15 |
| AC-23 | Kasbon melebihi gaji → GOLD-06 → potongan sesuai pilihan Owner, uang dibayar tidak negatif, posisi bersih negatif berlabel sisa kasbon; tidak auto-cut upah atau mewajibkan konversi saldo. | PAY-08, PAY-09, PAY-10 |
| AC-24 | Apply kasbon dikirim ulang → hanya satu application, saldo loan/advance dan payroll konsisten. | PAY-08, MOD-04 |
| AC-25 | Dua pembayaran fisik digabung transfer → alokasikan ke gaji dan job → dokumen/slip tetap terpisah, cash total tepat. | PAY-14 |
| AC-26 | Karyawan nonaktif dengan utang/upah → arsipkan → sisa tetap dapat diselesaikan owner, login tidak memberi akses baru. | PAY-06, SEC-02 |
| AC-27 | Pinjaman pribadi dipotong gaji → GOLD-15 → kewajiban usaha ke owner ada sampai dibayar; no extra cost/income. | PER-04, PAY-08 |
| AC-28 | Modal/prive → GOLD-13 → tidak masuk omzet/biaya kandang; user tidak berhak gagal membaca private data. | PER-02, PER-03 |
| AC-29 | Recording OFF/kontrak kosong → ABK mencatat belanja → berhasil; dashboard metrik menyatakan unavailable. | REC-01, CON-06 |
| AC-30 | Rekap kumulatif dan detail overlap → GOLD-16 → tidak double count, sumber authoritative jelas. | REC-02, REC-03 |
| AC-31 | DAILY memiliki sampling valid 25 ekor/30 kg → UI menghitung ABW sampling **1,2 kg/ekor** dari sesi yang sama. Input belum cukup → unavailable dengan alasan, bukan 0. Sampel historis tetap boleh dibaca dengan tanggal/cakupan dan penanda bukan pengukuran hari ini; tidak menjadi status aman atau klaim ABW panen/FCR/IP/performa penuh. | K-24, K-25, DATA-07, REC-04, REC-10, REC-14, UX-09 |
| AC-32 | Dua mobil/DO dan satu tiket dua bangunan → posting → heads sum benar, asal tersimpan, populasi berkurang sekali. | HAR-01, HAR-03, HAR-05 |
| AC-33 | Total kg tiket diketahui, kg asal tidak → tampilkan performa bangunan → bukan bobot prorata yang diklaim aktual. | HAR-07, REC-05 |
| AC-34 | Afkir dijual → catat sebagai harvest afkir → tidak sekaligus mortality; habis panen bukan deplesi100%. | MET-01 |
| AC-35 | Data GOLD-08/09 → hitung → hasil sesuai termasuk weighted age dan harvested biomass. | MET-03, MET-04, MET-05, MET-06, MET-08 |
| AC-36 | Tabel harga overlap/gap/dependency cycle/unit salah → validate → tidak dapat publish sampai diperbaiki/explicit gap policy. | CON-10, CON-11, CON-13 |
| AC-37 | ABW tepat boundary dan display rounded → GOLD-10 → hasil mengikuti raw/basis contract yang tersimpan. | CON-14, CON-15 |
| AC-38 | Bonus FCR dan potongan tanpa basis → hitung → missing config; setelah lengkap GOLD-11 tepat. | CON-09, CON-16, CON-18 |
| AC-39 | Contract/engine version berubah → buka hasil tersimpan → input/output lama tetap; rerun membuat run baru. | CON-04, CON-05, CON-21 |
| AC-40 | Estimasi belum ada future feed/market price yang wajib → tampilkan → subtotal berlabel incomplete, bukan laba pasti; tidak posting. | EST-02, EST-05 |
| AC-41 | Settlement + tabungan + utang lama + dua payout → GOLD-12 → income/cash/profit tepat; sapronak tidak dikurangi dua kali. | SET-03, SET-04, SET-06, COST-08 |
| AC-42 | Hanya net payout/dokumen “Awaiting” → input → boleh catat net unreconciled, tidak otomatis final income atau belum cair. | SET-05, SET-06 |
| AC-43 | Periode keuangan locked, invoice belum lunas → bayar invoice → kas/utang berubah; snapshot biaya tidak berubah. | CYC-09 |
| AC-44 | Draft offline tiba setelah lock → GOLD-14 → usulan koreksi, bukan silent post atau dibuang. | CYC-10, OFF-06 |
| AC-45 | Tidak ada internet → buat belanja/foto → restart → draft dan antrean tetap ada pada user sama; status lokal jelas. | OFF-02, OFF-03, OFF-15 |
| AC-46 | Payload sama retry5x dan dua ABK mengubah recording yang sama → satu efek/versi, konflik pihak kedua; stok concurrency GOLD-14 hanya R2. | FIN-05, OFF-07, OFF-18 |
| AC-47 | Dua user/perangkat mengedit versi sama → kirim → expected-version conflict; tidak last-write-wins. | OFF-07 |
| AC-48 | User berganti tenant/logout → buka cache → tidak ada data user/tenant lain; antrean tersimpan terkunci, bukan otomatis terhapus. | OFF-03, OFF-10 |
| AC-49 | Izin offline >72jam/role revoked/storage full → simpan/sync → perilaku aman sesuai sebab, tanpa centang berhasil palsu. | OFF-02, OFF-06, OFF-09 |
| AC-50 | Foto gagal upload, teks sukses → retry foto → tidak menduplikasi dokumen dan bukti tetap berstatus pending. | OFF-15 |
| AC-51 | Update versi aplikasi saat ada antrean lama → migrasi → draft/operation IDs tetap ada atau safe update-required. | OFF-13 |
| AC-52 | PPL visit dicatat ABK → lihat histori → pengunjung dan pencatat dibedakan, tanpa konfirmasi PPL palsu. | OPS-05, OPS-06 |
| AC-53 | Task selesai tanpa rate agreement → tandai done → tidak otomatis menambah utang upah. | PAY-16, OPS-01 |
| AC-54 | Report/export dengan filter sama → bandingkan → total dan scope sama; CSV injection escaped, download private. | REP-14, REP-15, REP-16 |
| AC-55 | Peringatan retry dan akses dicabut → kirim → dedupe, tidak kirim ke grant lama; nominal pribadi tidak bocor. | NOT-05, NOT-06, NOT-07 |
| AC-56 | Dashboard mobile dan aksesibilitas → jalankan uji tugas GOAL-01/02 serta NFR-09 → hasil dicatat, bukan sekadar screenshot desktop. | UX-01, UX-07, UX-08 |
| AC-57 | API/worker restart/backup restore → uji → tidak duplikasi dan restore dapat digunakan; target terukur dicatat. | NFR-06, NFR-10 |
| AC-58 | Dataset kapasitas NFR-03 → load test → hasil p95/error sesuai target atau temuan memblokir klaim kapasitas. | NFR-02, NFR-03 |
| AC-59 | Farm A/B punya kontrak PT berbeda → estimasi masing-masing → tidak memakai master harga global atau data tenant lain. | CON-01, CON-02 |
| AC-60 | Biaya belum dialokasikan/gaji belum final → laba periode → label sementara dan daftar komponen belum tercakup; tidak mengklaim laba bersih lengkap. | COST-08, EST-04 |
| AC-61 | Ada kehilangan nonpanen dan afkir terjual → GOLD-17 → IP memakai daya hidup96,5%, tidak menganggap kehilangan sah sebagai ayam hidup. | MET-01, MET-08 |
| AC-62 | Summary sumber mitra/manual/detail berbeda cutoff → pilih authority → latest cutoff sah≤T dari lineage dipakai, upload paling baru tidak otomatis menang; contract FCR memilih calculated/reported eksplisit. | REC-13, CON-22 |
| AC-63 | Command commit, response hilang; retry paralel/setelah restart7hari → hanya satu receipt/effect; replay tetap memeriksa izin terkini. | FIN-05, FIN-12 |
| AC-64 | Klaim rejected → selesaikan sebagai not-occurred/duplicate/recoverable/payer-corrected → saldo sementara dan posted sesuai FIN-11; approval ulang terminal ditolak. | FIN-10, FIN-11 |
| AC-65 | Ada pending gaji/claim/penerimaan belanja/klasifikasi settlement → lock → daftar penghambat dapat ditindaklanjuti; utang final/kasbon tersisa tidak memblokir. R1 tidak meminta stok/opname/sisa gas/approval recording. | CYC-11, SET-11, K-33 |
| AC-66 | Biaya pembelian gas Rp1.000.000, bagian Rp400.000 sudah mengurangi net PT → biaya tetap 1juta, pengurang laba hanya 600ribu. Reimburse penambah income tidak menjadi coverage; tes gas consumption GOLD-18 hanya R2. | COST-11, SET-08 |
| AC-67 | Opening stock hanya kuantitas → GOLD-19 → consumption pending cost, backfill nilai sekali tanpa silent repricing histori valued. | INV-14, FIN-12 |
| AC-68 | Net settlement/payout notice/uang diterima → GOLD-20 → status kas/piutang/penghasilan terpisah; classification pending memblokir final income. | SET-11, CYC-11 |
| AC-69 | PPL membaca task/internal note/nota → hanya task PPL_VISIBLE di grant sah terlihat, nota dan field uang tetap tertutup pada API/file/export. | SEC-05, OPS-05 |
| AC-70 | Kontrak enum unsupported, predicate terlalu dalam, atau sumber metrik salah → validasi → ditolak/require manual yang disahkan; tidak menjalankan ekspresi bebas atau fallback nol. | CON-20, CON-22 |
| AC-71 | Command crash sebelum commit lalu retry, atau commit lalu izin dicabut → rollback/replay aman; actor asli hanya mendapat acknowledgement minimal bila masih terautentikasi, client tidak membuat operation baru untuk kejadian yang hasilnya belum diketahui. | FIN-05, FIN-12, OFF-06 |
| AC-72 | Event ekonomi sama diupload dalam permutasi berbeda → GOLD-21 → biaya/inventory final identik; sementara diberi label dan lock ditolak sampai rekonsiliasi selesai. | INV-10, INV-16, CYC-11 |
| AC-73 | Receipt direvisi setelah delta disahkan lalu issue diretur → GOLD-22 → hanya delta terhadap net efektif, qty tidak berganda, retur memakai nilai issue efektif, retry aman. | INV-11, INV-16, FIN-12 |
| AC-74 | Late receipt memengaruhi periode A/B dan B locked, atau pool berubah saat preview → approve → tidak ada delta parsial/stale; reopen seluruh periode terdampak dan replay baru diperlukan. | INV-16, CYC-10, COST-11 |
| AC-75 | Timestamp/tanggal sama ambigu, nilai unknown, atau urutan ekonomi menghasilkan stok negatif → replay → BLOCKED/null dengan alasan, bukan urutan upload/nol; setelah diselesaikan hasil deterministik. | INV-14, INV-16, OFF-14 |
| AC-76 | Transfer offline dilaporkan dua perangkat, counterpart tiba sebelum/sesudah transfer posted, belanja child tiba dahulu → GOLD-23 → satu movement kanonis, linkage akhir tidak membuat transfer lagi; parent disahkan sebelum child; revocation/lock mempertahankan klaim. | OFF-16, FIN-10, FIN-12 |
| AC-77 | Lease habis → capture-only/restart/logout/reauth → tanpa akses cache/saldo/posting; author/device/origin tenant diverifikasi, konversi sekali hanya ke tenant asal dan scope sah, upaya rehome atau akun lain ditolak; storage failure tidak memberi sukses palsu. | OFF-09, OFF-17, OFF-03 |
| AC-78 | Mulai hari ke-18 dengan kasbon/gaji historis → GOLD-24 → opening dan transaksi baru tidak tumpang tindih, cutoff/coverage jelas; tanggal/populasi tidak diketahui tidak dipalsukan agar aktif. | ONB-10, CYC-03, PAY-02 |
| AC-79 | ABK mengisi form pendek dan owner memilih batch berisi lengkap/tidak lengkap/versi berubah → hanya dokumen valid ditetapkan atomik per dokumen, hasil parsial jelas, pelengkapan nota tidak menduplikasi biaya. | CASH-16, FIN-13, FIN-12 |
| AC-80 | Buku pribadi tidak diaktifkan → modal/prive/talangan usaha GOLD-25 → sisi usaha benar tanpa akun/pair pribadi; pelunasan talangan bukan biaya lagi. | CASH-15, MOD-01 |
| AC-81 | Owner kehilangan perangkat, transfer sah/tidak sah, atau transfer bersamaan recovery → expected version/constraint atomik menjaga satu primary owner; sesi/queue lama tidak mewarisi hak, audit ada, tidak ada impersonation/admin read-all atau perpindahan buku pribadi. | SEC-13, SEC-14 |
| AC-82 | Tenant ACTIVE/READ_ONLY mengekspor paket saat data berubah → snapshot konsisten, totals/IDs/relasi/hash cocok; lampiran pending dicantumkan, revoked user tidak bisa mengunduh, secret/private/tenant lain tidak ikut. | REP-19, SEC-01, SEC-04 |
| AC-83 | Restore mundur dengan ack, antrean offline, lampiran parsial, dan grant yang sempat dicabut → GOLD-27 → epoch/review/replay aman, tidak ada lost-ack yang dianggap transaksi baru atau hak lama bocor; RPO/RTO dibuktikan. | NFR-06, NFR-11, FIN-12 |
| AC-84 | R1 tanpa inventory/production detail/contract/private/task/PPL → alur kas–pembelian–gaji/kasbon–settlement–close OFF → tanpa FK/menu/grant dummy R2; selesai fisik bukan LOCKED, net-only tetap REVIEW dan periode berikutnya boleh aktif. | CYC-07, CYC-11, CASH-15, SET-11 |
| AC-85 | Template R2 belum punya fixture terverifikasi/jalur input, atau tier ambigu → tidak boleh aktif sebagai estimasi lengkap; template sah menjalankan GOLD-26 dan tes batas tanpa hardcode satu PT. | CON-23, CON-24, CON-22 |
| AC-86 | UAT pola lapangan dan pilot berjalan → rekonsiliasi sampel serta baseline GOAL-07 sampai GOAL-10 → hasil, kegagalan, beban input/review dan keputusan lanjut tercatat; tidak mengklaim lolos dari screenshot atau unit test saja. | GOAL-07, GOAL-08, GOAL-09, GOAL-10 |
| AC-87 | OFF → belanja gas/peralatan, gaji/kasbon dan hasil aktual → tanpa recording, consumption, stok atau opname; performa unavailable bukan FCR nol, laba lengkap hanya bila data finansial cukup. | K-24, K-33, REC-01, SET-03 |
| AC-88 | DAILY global kandang, beberapa ABK/Owner → pakan/mati/afkir/sampling tersimpan valid langsung berlaku tanpa approval; satu rekap cycle+date, revisi/retry tidak dijumlah dan tidak membuat efek stok/biaya. | K-25, K-26, REC-06, REC-14, REC-16, REC-18, REC-19 |
| AC-89 | DAILY memiliki hari kosong, input parsial, pergantian mode, atau data di luar cutoff → buka dashboard/lock → status `PARTIAL`/`GAP`/cutoff terlihat, tidak dipakai sebagai metrik final, tidak menghapus histori, dan tidak memblokir alur finansial yang tidak bergantung recording. | K-25, REC-03, REC-17, UX-09 |
| AC-90 | Tambah ABK A dan B ke kandang K secara paralel → keduanya boleh aktif; grant ganda orang yang sama ditolak, akses K lain hanya lewat penugasan. Recording bersama terlihat, kas/gaji/kasbon rekan tidak bocor lewat API/search/file. | K-26, SEC-15, MOD-07 |
| AC-91 | Cabut/pindahkan A saat B tetap di K, A punya antrean dan saldo → B tidak terpengaruh; draft A tidak diwariskan/dihapus, kewajiban tetap A, rekap server tetap bersama dengan author asal; sync A memakai hak terkini. | K-26, SEC-15, OFF-06, OFF-18 |
| AC-92 | Owner menerima DOC/pakan/sapronak mitra dan input transaksi langsung; ABK membeli/menerima gas/solar operasional dari HP sendiri → actor/scope/source benar, hak ABK tidak meluas ke sapronak mitra, dan approval/posting finansial tetap mengikuti FIN/RBAC. | K-27, INV-17, SEC-01, SEC-05 |
| AC-93 | Owner membuat akun ABK, ubah username/reset password → histori ID/saldo tetap, password lama tidak terbaca, sementara sekali pakai/expired/reused ditolak, wajib ganti, sesi lama dicabut; Owner lain dan target Owner/Admin/PPL ditolak. | K-37, SEC-16, D-25 |
| AC-94 | Admin memprovisi Owner terverifikasi tanpa email → aktivasi username/password sementara online, wajib ganti sebelum akses bisnis; rahasia kedaluwarsa/terpakai ditolak. Reset ABK/recovery Owner tetap tanpa email wajib, username saja bukan bukti kewenangan; secret tidak masuk log/export. | K-37, ONB-01, SEC-13, SEC-16 |
| AC-95 | Owner sebelum DOC, lewati Tim/Gaji/master opsional → belanja persiapan tersimpan; saat sumber kas diperlukan isi lalu kembali ke draft, DOC aktual baru saat datang, lanjut setup tanpa mengulang. Jalur Periode Berjalan tetap sekunder. | K-31, K-32, ONB-02, ONB-10, ONB-11 |
| AC-96 | Pembelian gas habis pakai disahkan → biaya pembelian sekali, pembayaran utang tidak menambah biaya; tidak ada tugas consumption/stok/sisa. Peralatan tahan lama terpisah, tidak otomatis biaya habis satu periode. | K-33, COST-01, D-05 |
| AC-97 | Belanja tanpa foto/nota/alasan ketiadaan → simpan, kirim, review → boleh jika field pokok valid; unggah bukti kemudian menaut dokumen sama, tanpa biaya baru. | K-34, CASH-16, OFF-15 |
| AC-98 | Pekerja belum punya gaji/agreement → cairkan kasbon; gaji kemudian lebih kecil → Owner memilih potongan nol/sebagian/penuh dalam batas hak/saldo; sisa tetap lintas periode tanpa reissue/konversi paksa. | K-21, D-14, PAY-07, PAY-08 |
| AC-99 | Owner satu/banyak kandang, OFF/DAILY, setup belum lengkap → hanya saran relevan berizin, label pendek jelas, tidak menebak nominal/approve uang otomatis; tanpa menu pemakaian atau field duplikat. | K-31, UX-15, UX-16, ONB-11 |
| AC-100 | Nominal IDR pecahan, persen desimal dan pembagian biaya → pecahan rupiah input diberi validasi, persen diterima tanpa truncation; kalkulasi presisi, alokasi nonnegatif total tepat, kuantitas mengikuti satuan. | K-35, DATA-05, DATA-06, COST-05 |

### 29.1 Jenis pengujian wajib

- Unit: decimal, rounding, allocation, FCR/IP, rule engine, state transition.
- Integration: atomic posting/reversal, constraint tenant/FK, optimistic lock, idempotency, payout/offset.
- E2E mobile: tiap peran, offline/reconnect/restart, form error, photo retry, approval, period close.
- Security: daftar/detail/search/export/file, scope switching, tenant disable, revoked grants.
- Property/invariant: total alokasi tepat dan setiap baris nonnegatif, saldo ledger/kasbon, satu rekap efektif per kandang/tanggal, sumber efek unik; stok hanya bila R2 aktif. Posisi bersih gaji-kasbon boleh negatif berlabel, berbeda dari pembayaran tunai atau outstanding negatif.
- UAT: Owner dan beberapa ABK pada kandang sama; mulai sebelum DOC, lewati setup opsional, belanja tanpa nota, recording global langsung berlaku/koreksi paralel, kasbon sebelum gaji/melebihi gaji, reset username/password tanpa email, pembelian tanpa pemakaian, net-only atau RHPP lengkap, dan sinyal putus-sambung. Jalur tengah siklus tetap diuji sekunder. Data sintetis representatif; data nyata perlu izin/penyamaran/penyimpanan privat. Ukur beban Owner/ABK, label pendek, recovery/ekspor; kegagalan tidak dihapus agar pilot terlihat berhasil.
- Uji APK/push/sensor/CCTV tidak dianggap lulus dari web test; baru ditambahkan ketika rilis terkait dibangun.

### 29.2 Gate tes per rilis

Semua ID dipertahankan untuk traceability. Penundaan berikut adalah perubahan scope produk, bukan izin melemahkan tes fitur yang telah diaktifkan.

| Scope | Acceptance gate |
|---|---|
| R1 | AC-01, AC-04–AC-17, AC-19, AC-21–AC-26, AC-28–AC-29, AC-31, AC-41–AC-51, AC-54–AC-58, AC-60, AC-63–AC-66, AC-68, AC-71, AC-76–AC-84, AC-86–AC-100 |
| R2/fitur tertunda | AC-02–AC-03, AC-18, AC-20, AC-27, AC-30, AC-32–AC-40, AC-52–AC-53, AC-59, AC-61–AC-62, AC-67, AC-69–AC-70, AC-72–AC-75, AC-85 |

Kasus campuran: R1 AC-19 unit recording/penerimaan pakan, AC-21 histori pembelian/gaji/upah/actor, AC-28 sisi usaha modal/prive dan penolakan fitur pribadi, AC-29/31 OFF/sampling/freshness tanpa FCR/IP palsu, AC-46 retry/konflik recording, AC-60 hasil aktual, AC-66 coverage pembelian tanpa pemakaian stok. Bagian inventory/kontrak/PPL/private menyusul saat modul aktif. Semua guard tenant/file/cache tetap wajib. Pergeseran tes stok ke R2 mengikuti keputusan K-33, bukan toleransi kesalahan pada transaksi R1.

| Scope | Golden gate |
|---|---|
| R1 | GOLD-01–GOLD-02, GOLD-05–GOLD-07, GOLD-12–GOLD-14, GOLD-18 (coverage saja), GOLD-20, GOLD-23–GOLD-25, GOLD-27–GOLD-30 |
| R2/fitur tertunda | GOLD-03–GOLD-04, GOLD-08–GOLD-11, GOLD-15–GOLD-17, GOLD-18 (gas/persediaan), GOLD-19, GOLD-21–GOLD-22, GOLD-26 |

GOLD-13 R1 hanya sisi usaha modal/prive. GOLD-12/18/20 menguji aktual, bukan estimasi; GOLD-18 R1 hanya coverage, tidak memerlukan gas usage. GOLD-28 rekap global tanpa approval/inventory; GOLD-29 multi-ABK dan pencabutan anggota; GOLD-30 pembelian sederhana. Opening kas/payroll, recording, akun, offline, recovery, dan ekspor tetap gate R1; valuasi/persediaan R2 bukan syarat pilot.

<a id="s30"></a>
## 30. Urutan pengembangan dan Definition of Done

Perincian tersedia pada [Implementation Plan.md](Implementation%20Plan.md): 63 kartu tugas, dependensi, keluaran, tes minimum, kondisi berhenti dan handoff untuk agent. [TEST_PLAN.md](TEST_PLAN.md) memetakan seluruh AC/GOLD/UT dan memisahkan gate teknis prapilot dari hasil lapangan AC-86. Fase aktif tetap perencanaan; daftar tugas ini tidak memberi izin memulai kode atau data finansial produksi.

### 30.1 Milestone implementasi usulan

| Milestone | Output | Exit gate |
|---|---|---|
| M0 — keputusan dan desain pilot | Pilih owner/kandang/cutoff pilot, baseline, Q blocking R1, ADR stack/threat/recovery, wireframe alur inti, API/data contract | Tidak ada makna uang/gaji yang ambigu; tidak mensyaratkan desain builder, produksi detail, atau buku pribadi |
| M1 — fondasi dan onboarding | Username/password tanpa email, tenant/RBAC, akun/tim multi-ABK, setup sebelum DOC adaptif, OFF/DAILY global, audit/local queue, recovery | AC-01, AC-04–AC-08, AC-87–AC-95, AC-99; akun/grant terisolasi, setup dapat dilanjutkan, rekap bersama langsung berlaku tanpa approval |
| M2 — pembelian dan kas | Belanja gas/barang/peralatan tanpa consumption, bukti opsional, review harian Owner, kas per ABK, kredit/reimbursement, alokasi, kejadian tunai offline | GOLD-01/02/07/14/23/30; AC-76/77/79/96/97/100 dan tes finansial; tanpa inventory/private ledger wajib |
| M3 — tenaga kerja | Gaji periode, kasbon mandiri lintas periode, potongan pilihan Owner, upah terpisah, opening historis | GOLD-05/06/24/25; AC-22–AC-26, AC-78/80/98; tanpa plafon gaji untuk kasbon, net negatif jelas bukan bayar negatif |
| M4 — hasil aktual dan kepercayaan data | Settlement aktual manual/pencairan, laporan, ekspor paket, recovery server/runbook, notifikasi | GOLD-12/20/27, coverage GOLD-18, sisi usaha GOLD-13; AC-41/42/43/54/57/65/66/68/81/82/83/84 |
| M5 — pilot terverifikasi | Integrasi seluruh R1, UX/accessibility termasuk fallback visual, restore/load/UAT representatif, baseline versus hasil satu siklus, dokumentasi batas | Seluruh gate R1 di 29.2 mempunyai evidence, tidak ada blocker integritas/otorisasi P0/P1; hasil teknis dan hasil adopsi dilaporkan terpisah |
| M6 — perluasan berbasis bukti | Estimasi, SUMMARY/DETAIL/panen/PPL/pribadi/task/APK/push/impor dipilih satu per satu; inventory detail hanya bila kebutuhan baru disetujui | Tidak mengembalikan beban tracking R1 diam-diam; scope/Q/tes fitur aktif disahkan, bukan sekadar feature flag |

M1–M5 adalah urutan internal untuk scope R1 pada bagian 4, bukan versi lengkap seluruh visi. Sebelum transaksi produksi, gabungan alur yang dipakai harus lulus gate integrasi/security/recovery; jangan menguji uang nyata pada M1 yang hanya berisi fondasi. Demo sintetis bertahap boleh. M6 bukan syarat selesai pilot dan tidak mempunyai tanggal otomatis.

### 30.2 Definition of Done per requirement

1. Requirement dan AC terkait ditautkan; tidak ada placeholder finansial yang terlihat sebagai angka nyata.
2. Validasi server, RBAC, transaksi atomik, audit, status, dan edge cases lengkap.
3. Unit/integration/E2E relevan lulus; golden output tepat; failing tests diselidiki, bukan dihapus untuk lolos.
4. UI diuji pada ukuran mobile dan browser target; loading/empty/offline/error/permission terverifikasi.
5. Migrasi database/local store dapat diuji dan tidak membuang antrean; rollback/recovery plan ada.
6. Tidak ada private attachment/credential yang masuk log, repo, seed, atau screenshot publik.
7. Catatan implementasi menjelaskan perilaku, batas, dan keputusan yang berbeda dari draft; PRD diperbarui jika disetujui.
8. Belum ada target teknis yang disebut “terbukti” tanpa hasil benchmark/test nyata.

### 30.3 Larangan jalan pintas untuk agent

- Jangan memakai float biasa untuk semua uang kemudian “dibulatkan di UI”.
- Jangan hanya memakai `tenant_id` dari request sebagai bukti otorisasi.
- Jangan mengirim seluruh data lalu memfilter hak akses di front-end.
- Jangan menghapus dokumen posted agar total kembali cocok.
- Jangan memasukkan semua pembayaran ABK ke expense gaji.
- Jangan mengurangi stok saat “barang diminta” dan menguranginya lagi saat “barang dipakai”.
- Jangan menambahkan summary kumulatif ke detail yang telah tercakup.
- Jangan menjadikan satu contoh PT sebagai konfigurasi wajib semua tenant.
- Jangan memberi default nol untuk rule kontrak yang belum didukung.
- Jangan membuat offline “berhasil” hanya karena payload disimpan ke variable memori.
- Jangan menyebut wrap APK berarti UI telah menjadi native penuh, atau push pasti sampai saat tidak ada internet.

<a id="s31"></a>
## 31. Keputusan terbuka, risiko, dan persetujuan

### 31.1 Register Q dan default aman

| ID | Pertanyaan/keputusan | Default draft | Gate sebelum produksi |
|---|---|---|---|
| Q-01 | Owner/kandang pilot, tanggal mulai, baseline, dukungan dan target keputusan lanjut? | Mulai sebelum DOC sudah dipilih; jumlah kandang/peserta/tanggal nyata belum. Scope sederhana R1 dan M1–M5; M6 tidak wajib | Sebelum estimasi jadwal/pilot; perubahan scope memperbarui gate 29.2 |
| Q-02 | Prosedur recovery Owner tanpa email, bukti kewenangan, masa berlaku password sementara dan penanggung jawab bantuan? | Username/password dan pengelolaan ABK oleh Owner sudah diputuskan; rancangan namespace D-25, reset SEC-16, recovery/transfer SEC-13/14. Tidak ada reset lintas tenant | Sebelum akun produksi; verifikasi bantuan dan uji akun/sesi, bukan menambah email wajib atau bypass admin |
| Q-03 | Saat Owner tidak tersedia atau klaim tidak jelas, siapa membantu pelengkapan dan bagaimana tindak lanjutnya? | Review harian dan bukti opsional sudah diputuskan. Belanja ABK tetap Owner-only posting sebagai default aman; recording tidak menunggu approval. Batch bukan auto-approve | Uji beban pemeriksaan sebelum finansial pilot; delegasi/auto-post finansial memerlukan keputusan baru, bukan disimpulkan dari final recording |
| Q-04 | Klasifikasi peralatan tahan lama, alokasi belanja masa kosong/overhead, dan biaya aset manual yang diperlukan pilot? | Pembelian konsumabel jadi biaya saat diterima/disahkan; peralatan terpisah, bukan biaya habis otomatis. Tidak ada tracking/sisa gas wajib R1 | Tetapkan contoh klasifikasi sebelum laporan biaya final. Unit gas/sisa/urutan valuasi hanya diputuskan bila inventory R2 kelak disetujui |
| Q-05 | Basis umur, standar strain, pengelompokan afkir, capacity override, dan prioritas source recording? | Umur+1 saat chick-in, standar tidak universal, klasifikasi eksplisit; R1 hanya OFF/DAILY, sedangkan SUMMARY/DETAIL/source authority metrik tetap R2 | Wajib sebelum metrik/kontrak dipakai untuk keputusan pembayaran; tidak memblokir operasional/settlement aktual R1 |
| Q-06 | Browser/perangkat pilot, local unlock/capture-only, lease serta dampak reset/logout terhadap antrean? | Sinyal putus-sambung sudah dikonfirmasi, bukan selalu offline. Lease 72 jam tetap usulan keamanan yang diuji, bukan durasi gangguan yang diasumsikan; OFF-16/17 | Sebelum offline pilot; uji HP nyata dan reset sesi, jangan membuang antrean atau memperpanjang izin lokal diam-diam |
| Q-07 | Pola kontrak yang akan diaktifkan, contoh settlement terverifikasi, rounding/pajak, serta kemampuan memasok input? | R2 template-first CON-23/24; missing→incomplete, unsupported/manual beralasan; tanpa builder umum wajib | Hanya memblokir aktivasi estimasi/template terkait, bukan R1 kas/settlement aktual manual |
| Q-08 | Mapping contoh RHPP/tabungan/pajak/utang/biaya yang dipotong PT pada pilot? | Pilihan RHPP lengkap atau angka pembayaran saja sudah diputuskan. Net-only tidak memaksa rincian, tetapi belum laba terverifikasi | Hanya sebelum angka disebut laba/penghasilan lengkap; bukan syarat catat pembayaran atau operasi harian |
| Q-09 | Hak gaji berhenti dini, penagihan saldo pekerja keluar, dan kebutuhan offset pinjaman pribadi? | Kasbon tanpa agreement/batas gaji, potongan pilihan Owner, saldo tetap lintas periode sudah diputuskan. Tidak ada pembayaran negatif atau potong upah otomatis; offset pribadi R2 | Sebelum kasus payroll terkait dipakai; jangan membuka kembali keputusan kasbon fleksibel sebagai plafon gaji default |
| Q-10 | Stack/hosting/anggaran, detail keamanan username-password/recovery, backup/PITR dan biaya RPO/RTO? | ADR modular monolith/API-first; metode login bukan pertanyaan terbuka lagi, vendor belum final; NFR-06/11 tetap gate | Sebelum infrastruktur produksi; uji reset, rate limit, sesi dan recovery, tanpa klaim target sudah terbukti |
| Q-11 | Retensi finansial/lampiran/backup, penghapusan akun, dukungan terverifikasi, ekspor paket, dan legal/privacy? | Tidak purge otomatis posted finance; ekspor terstruktur privat REP-19; admin tanpa baca bisnis; catatan incident/recovery jelas | Wajib sebelum data pelanggan produksi; prosedur bantuan dan kehilangan data diuji, bukan hanya kebijakan tertulis |
| Q-12 — ditutup | Granularitas dan pemeriksaan recording | Diputuskan 23 September 2026: global per kandang/tanggal, bersama multi-ABK, langsung berlaku tanpa approval; key cycle+date. Konflik tetap ditangani, bukan dijumlah/timpa | Bukan blocker keputusan produk. Uji koreksi/konflik/cutoff tetap wajib AC-88–AC-91; tidak membuat per-bangunan wajib lagi |

Q tidak mengizinkan agent memilih aturan finansial sesuka hati. Pemilik produk mengesahkan jawaban; default hanya mendukung diskusi/prototype sampai gate terkait ditutup.

Keputusan sudah ditutup tidak ditanyakan ulang sebagai syarat pilot: global DAILY, multi-ABK, recording tanpa approval, bukti opsional, pembelian tanpa pemakaian rutin, kasbon mandiri, nominal rupiah bulat, username/password, label pendek, dan onboarding utama sebelum DOC. Rincian yang masih berupa D tetap ditandai, khususnya posting belanja Owner, klasifikasi peralatan, namespace akun, dan prosedur keamanan.

### 31.2 Risiko utama dan mitigasi

| Risiko | Mitigasi produk |
|---|---|
| Kebutuhan dinamis berubah menjadi formula bebas yang tidak aman | Primitive terbatas, validator, contoh uji, unsupported status, versi immutable |
| Pengguna sulit mengerti kas versus biaya | Bahasa layar sederhana, source account jelas, contoh ringkas, saldo/biaya terpisah |
| ABK mencatat dua kali di aplikasi PT dan aplikasi ini | OFF/DAILY opsional, satu rekap efektif per hari, link sumber, revisi tidak dijumlah, tidak memaksa SUMMARY/DETAIL |
| Offline membuat owner merasa data lengkap padahal belum terkirim | Last sync, claim/pending count, kelengkapan laporan, no real-time guarantee |
| Kehilangan data lokal sebelum sync | Persistent storage bila tersedia, peringatan queue/quota, recovery; tidak memberi jaminan palsu |
| Upah pekerjaan bercampur payroll pada implementasi murah | Entitas/layar/slip/payment terpisah, GOLD-05, AC-22/25 |
| Laba keliru akibat stok, sapronak, tabungan atau kasbon ganda | Cost mapping, reconciliation, golden tests, detail per sumber |
| Akses PPL lintas owner atau private data bocor | Scoped grants, field-level API filtering, file/export/cache authorization tests |
| Skalabilitas terlalu mahal sebelum ada pengguna | Modular monolith, indeks, worker sesuai beban, benchmark; IoT/video terpisah ketika diperlukan |
| Terlalu banyak form/configuration | Wizard owner, default transparan, progressive disclosure, usability pilot |
| Scope pilot kembali membesar karena semua K dianggap wajib R1 | Bagian 4 dan 29.2 menjadi gate; kebutuhan tertunda tidak dihapus, tetapi tidak menjadi dependensi alur inti |
| Penyederhanaan pembelian disalahartikan sebagai konsumsi/stok aktual | Label biaya pembelian, tanpa saldo/sisa gas buatan; inventory dan valuasi hanya perluasan R2 |
| Owner kehilangan akses atau grant lama hidup setelah restore | Recovery identitas, transfer terverifikasi, epoch/reverification hak, deny bila bukti tidak cukup |
| Aplikasi rapi tetapi belanja nyata tidak tercatat | Baseline/sampel independen GOAL-07 sampai GOAL-10, UAT kasus tidak ideal dan pengukuran umur review |
| Beberapa ABK menimpa recording atau membaca keuangan rekan | Rekap bersama versioned/author terlihat, draft personal, API field whitelist dan saldo per orang; pencabutan satu anggota tidak mencabut yang lain |
| Owner reset akun lalu mendapat akses usaha lain | Akun ABK dikelola satu tenant; reset berizin/reauth, pencabutan sesi, password sementara dan audit, tidak reset identitas Owner/Admin/PPL |
| “Dinamis” berubah menjadi terlalu banyak pengaturan | Default terlihat dan bisa dikoreksi, setup bertahap saat dibutuhkan, tanpa form/rumus bebas tak terbatas atau nominal tebakan |
| Glassmorphism membuat angka/form sulit dibaca di lapangan | Kaca hanya sesuai mockup K-39, isian/keypad/nominal solid, fallback solid dan Kurangi Efek Visual, risiko kontras tercatat di FRONTEND_DESIGN_SPEC §10 dan diuji pada HP serta cahaya nyata |

### 31.3 Checklist persetujuan PRD sebelum development produksi

- [ ] Keputusan K-01 sampai K-38 dan perubahan v0.4–v0.5 tercermin pada rancangan; persetujuan bisnis bukan klaim seluruh D/visual/keamanan telah lulus.
- [ ] Owner/kandang/cutoff pilot dan batas R1 bagian 4 dipahami; gate R1/R2 pada 29.2 tercermin pada backlog, bukan semua fitur dibangun sekaligus.
- [ ] Default finansial/RBAC/offline yang berisiko disahkan melalui Q terkait.
- [ ] R1 mempunyai contoh pembelian/kas/gaji/kasbon/recording bersama/settlement aktual representatif yang disamarkan; tanpa kontrak atau stok wajib. Perluasan estimasi memakai fixture kontrak/settlement terverifikasi sesuai CON-23.
- [ ] Wireframe onboarding adaptif, username/password/Tim Kandang, rekap global multi-ABK, belanja tanpa bukti/pemakaian wajib, kasbon fleksibel, hasil periode, dan label pendek diuji dengan calon pengguna.
- [ ] Frontend lolos pemeriksaan visual terhadap mockup K-39 (FRONTEND_DESIGN_SPEC §11); isian/angka solid, fallback solid berfungsi, dan risiko kontras §10 sudah diuji atau diputuskan pengguna.
- [ ] Kebijakan data, keamanan, retensi, backup, dan dukungan perangkat ditetapkan.
- [ ] Sasaran RPO/RTO dibuktikan melalui drill; recovery akun, restore+queue, pencabutan hak, dan ekspor paket diuji. Baseline serta target dampak pilot dicatat sebelum pengukuran hasil.
- [ ] Backlog implementasi mengacu requirement/AC dan tidak memindahkan upah pekerjaan ke payroll.

<a id="s32"></a>
## 32. Sumber, batas interpretasi, dan riwayat dokumen

### 32.1 Sumber kebutuhan

1. Diskusi pemilik produk sampai 20 September 2026, terutama perubahan fokus menjadi operasional/keuangan, pilihan web mobile-first, serta koreksi gaji per periode dan upah pekerjaan terpisah.
2. Contoh perjanjian kemitraan dari pengguna: hanya bukti bahwa harga/bonus/potongan dapat bervariasi. Bukan konfigurasi standar, bukan RHPP realisasi yang wajib diikuti semua PT, dan bukan dasar menetapkan tarif pajak universal.
3. Enam screenshot aplikasi mitra: referensi pola konteks siklus, angka produksi, transaksi sapronak, input numerik, dan laporan penyelesaian. Identitas, kode, serta nomor dokumen aslinya tidak disalin ke PRD.
4. Brainstorming 23 September 2026: keputusan v0.4 menggantikan satu-ABK, DAILY per bangunan, tracking pemakaian wajib, dan kasbon wajib bergaji. Koreksi terakhir uang rupiah tanpa desimal mengalahkan usulan dua desimal sebelumnya. Persetujuan recording final tidak ditafsirkan sebagai auto-post belanja; detail namespace/reset/peralatan tetap rancangan.

**Batas bukti:** screenshot tidak membuktikan sebuah aplikasi tidak mempunyai modul lain, penyebab stok minus, alasan sampling nol, kemampuan ekspor yang benar-benar berfungsi, arti status “Awaiting”, atau masa kosong sebenarnya. Tidak ada asumsi API mitra tersedia. Perkiraan laba/harga yang pernah muncul dalam brainstorming bukan angka kontrak/pilot yang sudah diverifikasi.

### 32.2 Referensi teknis publik

Referensi berikut ditinjau sebagai konteks teknis, bukan keputusan vendor atau dependensi terpasang:

- [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria): penyimpanan browser mempunyai quota/eviction; tidak ada jaminan data lokal tidak hilang.
- [MDN — Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API): persistent storage dan estimasi kuota bergantung browser/izin.
- [Chrome Developers — Workbox Background Sync](https://developer.chrome.com/docs/workbox/modules/workbox-background-sync): retry background bergantung lifecycle browser; jalur sinkron foreground tetap diperlukan.
- [MDN — Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API): web push memerlukan service worker, subscription, serta dukungan platform.
- [Capacitor — Push Notifications](https://capacitorjs.com/docs/apis/push-notifications): native push Android melalui FCM, konfigurasi dan izin OS; mengemas APK bukan otomatis menyelesaikan notifikasi.

Rumus pada bagian18 adalah konvensi operasional eksplisit untuk produk, disertai golden test. Formula/basis kontrak yang berbeda wajib dikonfigurasi dan diverifikasi, bukan disamakan dengan satu standar industri tanpa bukti.

### 32.3 Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 20 September 2026 | Draft awal terintegrasi: arah produk, keputusan/proposal, modul, state/aturan, UX/offline, kontrak, golden tests, acceptance, roadmap, dan keputusan terbuka. |
| 0.2 | 20 September 2026 | Revisi hasil review kritis: pilot R1 terfokus dan gate per rilis; template-first R2; input ABK/batch review; onboarding tengah siklus; valuasi kronologis dengan delta berizin; kejadian tunai offline/capture-only; recovery akun/server, ekspor portabel, sasaran dampak pilot, GOLD-21 sampai GOLD-27 dan AC-72 sampai AC-86. Kebutuhan jangka panjang tetap disimpan; belum merupakan hasil UAT atau janji kesempurnaan. |
| 0.3 | 20 September 2026 | Recording dasar R1 opsional OFF/DAILY, rekap sekali sehari dan ABW sampling sederhana; panen/FCR/IP/mesin kontrak/impor tetap R2. Satu ABK berakses per kandang, penerimaan Owner, transaksi langsung, tutorial, dan arah modern glassmorphism; detail navigasi/visual/granularitas adalah rancangan. Handoff UX_UI_SPEC.md v0.1: 26 layar/35 skenario, bukan hasil UAT. Menambah K-24–K-30, D-20–D-24, Q-12, REC-14–REC-19, SEC-15, INV-17, UX-10–UX-14, OFF-18, MOD-07, GOLD-28–GOLD-29, AC-87–AC-92. Memisahkan agregasi DAILY dari snapshot kumulatif, rekap diterima dari efek stok/biaya, serta revisi dari penambahan. Gate mencakup sampling R1 tanpa performa panen R2. K-01–K-23 tetap. Mockup/pilot/usability/accessibility belum dijalankan. |
| 0.4 | 23 September 2026 | Penyelarasan brainstorming: dinamis/sederhana, onboarding sebelum DOC bertahap, label pendek, username/password tanpa email wajib, akun ABK dikelola Owner, banyak ABK per kandang dan rekap global langsung berlaku. Pembelian tanpa tracking pemakaian R1; inventory detail/valuasi menjadi R2. Kasbon mandiri boleh melebihi gaji, potongan pilihan Owner, sisa tetap lintas periode. Nota opsional, RHPP lengkap/pembayaran saja, rupiah bulat dan alokasi nonnegatif. Menambah K-31–K-37, D-25, SEC-16, ONB-11, UX-15/16, GOLD-30, AC-93–AC-100; Q-12 ditutup, gate diselaraskan dengan UX v0.2. Riwayat versi lama deskriptif, bukan aturan R1 saat ini. Belum implementasi/UAT. |
| 0.5 | 23 September 2026 | Audit kemudahan atas permintaan pengguna: K-38 (arahan seperti Duolingo dengan kebebasan memilih, bahasa jelas, pintar/memanjakan, keypad angka, buka-tutup, sedikit pindah halaman), D-26 keypad, D-27 kerja di tempat, UX-05/UX-06 diperbarui, UX-17–UX-20, label layar Terima/Kembalikan Uang, Riwayat Belanja, dan Status Kirim. Tidak mengubah aturan uang, izin, atau batas R1. Belum mockup/UAT. |
| 0.6 | 23 September 2026 | Pengguna menyerahkan tujuh mockup Google Stitch dan `DESIGN.md` serta meminta frontend persis seperti mockup, dengan Recording Harian bertab. Menambah K-39; D-23 (navigasi per peran sesuai mockup), D-24 (kaca sesuai mockup dengan fallback solid), D-27 (halaman fokus Catat Belanja/Mulai Kandang dan Recording bertab), UX-10, UX-11, dan UX-13 diselaraskan. Sisa aturan lama ikut dirapikan: status fase, K-30, glassmorphism, token/pixel-perfect, lembar di layar lebar, risiko dan checklist kontras. Aturan uang, izin, dan batas R1 tidak berubah. Belum ada frontend atau UAT. |

**Dokumen ini belum menyatakan aplikasi sudah diimplementasikan, diverifikasi di lapangan, atau siap menerima transaksi produksi.**
