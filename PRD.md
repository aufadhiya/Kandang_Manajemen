# PRD — SaaS Manajemen Usaha Kandang Broiler Kemitraan

| Metadata | Nilai |
|---|---|
| Versi | 0.1 — draft lengkap untuk review produk dan acuan pengembangan |
| Tanggal | 20 September 2026 |
| Bahasa produk awal | Bahasa Indonesia |
| Platform utama | Web mobile-first; disiapkan untuk kemasan aplikasi Android |
| Fokus | Operasional dan keuangan kandang; recording, performa, serta estimasi kemitraan sebagai pendukung |
| Pengguna awal yang diketahui | Dua owner berminat; jumlah kandang, pengguna aktif, dan transaksi belum terukur |
| Status persetujuan | Arah produk telah dibahas; pembagian rilis dan default rancangan di bawah belum seluruhnya disetujui |
| Implementasi | Dokumen kebutuhan, bukan aplikasi yang sudah dibuat, bukan desain database final |
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

1. Baca bagian 3, 4, 6, 9, 13, 19, 22, 28, dan 31 sebelum membangun modul terkait.
2. Jangan mengubah kebutuhan K untuk menyesuaikan library, demo, atau keterbatasan implementasi.
3. Jangan menganggap semua usulan telah disetujui. Sebelum development produksi, dapatkan persetujuan scope rilis serta Q yang memblokir modul. Prototype boleh memakai D dengan data sintetis dan label draft.
4. Jika aturan bisnis belum terjawab, ikuti default aman yang tertulis. Jika tidak ada default, hentikan hanya aksi/modul yang terdampak dan ajukan keputusan; jangan mengarang rumus.
5. Implementasikan satu alur vertikal lengkap: UI, otorisasi server, validasi, transaksi database, audit, kondisi gagal, dan pengujian. UI yang hanya memakai data dummy bukan fitur selesai.
6. Gunakan ID requirement dan acceptance test dalam tugas/PR. Tambahkan tes sebelum menyatakan requirement selesai.
7. Jangan menambahkan billing otomatis, payroll bulanan, pencampuran upah pekerjaan ke slip gaji, mutasi ayam antarbangunan, sensor, atau CCTV tanpa perubahan scope yang disetujui.
8. Jangan memperlakukan angka nol sebagai data yang belum diisi; jangan menampilkan estimasi sebagai realisasi; jangan menyamakan persetujuan dengan pembayaran.
9. Jangan membuat engine kontrak melalui `eval`, JavaScript pengguna, SQL pengguna, atau formula bebas yang tidak divalidasi.
10. Jangan memakai dokumen/foto pribadi dari diskusi sebagai seed, fixture, screenshot publik, atau contoh di repositori.
11. Jangan menyatakan integrasi mitra, sensor, push, dan CCTV berfungsi sebelum benar-benar diuji terhadap jalur yang diizinkan.
12. Jika ada konflik antarkebutuhan, kebutuhan K dan koreksi user terbaru menjadi acuan. Catat konflik dan revisi PRD sebelum mengubah perilaku produksi.

### 1.3 Dokumen lanjutan, bukan prasyarat untuk memahami kebutuhan

Sesudah draft disetujui: wireframe per peran, ADR pemilihan stack, skema database/migrasi, kontrak API, dan backlog yang menautkan requirement. PRD ini menjadi sumber makna bisnis; dokumen teknis tidak boleh mengubah makna uang, periode, atau hak akses secara sepihak.

<a id="s02"></a>
## 2. Visi, masalah, sasaran, dan batas produk

### 2.1 Visi

**Pusat kendali usaha kandang broiler kemitraan yang membuat owner mudah memahami kondisi operasional, pergerakan uang, biaya periode, dan estimasi hasil; sementara ABK dapat mencatat dengan cepat walaupun koneksi buruk.**

Produk adalah SaaS untuk banyak owner independen. Satu owner dapat mengelola beberapa kandang dan beberapa PT/mitra. Pengaturan cukup dinamis untuk variasi nyata, tetapi pengguna lapangan tidak perlu memahami mesin konfigurasi.

Dalam kebutuhan yang sudah dikonfirmasi, **multi-owner berarti banyak pelanggan/ruang usaha yang terisolasi**, bukan kepemilikan patungan dalam satu tenant. Co-owner dalam satu usaha belum diminta sebagai fitur; jangan menambah pembagian saham/bagi hasil antarowner. Identitas user tetap terpisah dari tenant sehingga hak pengelola tambahan dapat dikembangkan nanti tanpa membuka buku pribadi seseorang.

### 2.2 Masalah yang diselesaikan

| Masalah | Hasil yang diharapkan |
|---|---|
| Catatan biaya tersebar dan tidak jelas periode pembebanannya | Satu catatan sumber, bukti, penanggung jawab, alokasi, dan riwayat |
| Uang pegangan ABK tercampur dengan kasbon pribadi/gaji | Saldo dan tujuan dana terpisah serta dapat direkonsiliasi |
| Gas/barang dibeli sekarang tetapi dipakai beberapa periode | Arus kas pembelian terpisah dari biaya pemakaian |
| Gaji, kasbon, dan upah pekerjaan punya cara pembayaran berbeda | Alur masing-masing jelas, tanpa pembayaran atau biaya ganda |
| Hasil kemitraan belum memperlihatkan seluruh biaya owner | Laporan penghasilan kemitraan dan biaya owner yang tidak tumpang tindih |
| Berbeda PT berarti berbeda harga dan cara menghitung | Kontrak berversi, parameter terstruktur, rincian hasil yang dapat ditelusuri |
| Owner perlu melihat banyak kandang dan periode | Dashboard ringkas, drill-down, kualitas data, dan prioritas tindakan |
| Internet lapangan buruk | Catatan penting dapat disimpan lokal; status sinkronisasi jujur |

### 2.3 Sasaran dan ukuran keberhasilan usulan

- **GOAL-01:** seorang ABK terlatih dapat mencatat belanja sederhana tanpa foto dalam ≤60 detik pada uji tugas; minimal 8 dari 10 percobaan selesai tanpa bantuan.
- **GOAL-02:** owner menemukan total biaya periode, saldo kas ABK, dan sisa gaji/kasbon dalam ≤3 navigasi utama dari beranda.
- **GOAL-03:** semua nilai laporan dapat ditelusuri ke dokumen sumber, versi aturan, serta pembayaran/alokasi terkait.
- **GOAL-04:** retry/sinkronisasi ulang tidak menggandakan biaya, kas, gaji, panen, atau stok; seluruh golden test lulus.
- **GOAL-05:** pilot mencakup satu siklus operasional sampai rekonsiliasi keuangan untuk owner yang bersedia; metrik penggunaan diukur, bukan diasumsikan.
- **GOAL-06:** tidak ada akses data antarowner atau keuangan pribadi yang tidak diizinkan dalam pengujian otorisasi.

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
| K-06 | Gudang bersama per kandang lazim, tetapi konfigurasi lokasi stok perlu bisa berkembang. |
| K-07 | Panen dirinci per kandang/bangunan; mobil dapat mengambil dari beberapa bangunan. Ada tanggal, DO, plat, sopir, broker, dan jumlah. |
| K-08 | Peran: Administrator, Owner, ABK, PPL; Mandor opsional. |
| K-09 | Satu PPL dapat memantau banyak plasma melalui akses terbatas; catatan kunjungan dapat dibuat PPL atau dicatatkan owner/ABK. |
| K-10 | Koneksi kandang sering buruk; ABK menggunakan HP pribadi. |
| K-11 | Fokus utama operasional, pengeluaran per periode dan di luar periode, termasuk penggunaan gas. |
| K-12 | Recording dan perhitungan FCR/performa diinginkan tetapi bukan syarat untuk memakai operasional. |
| K-13 | Kontrak, harga, aturan, dan skema perhitungan PT/mitra dapat berbeda, termasuk antarowner. |
| K-14 | Owner ingin estimasi penghasilan dari input kontrak dan data pendukung. |
| K-15 | Keuangan pribadi owner dapat dicatat, terpisah dari usaha. |
| K-16 | UI modern, sangat mudah dipakai, dashboard pemantauan per periode. |
| K-17 | Web mobile-first; disiapkan untuk dikemas menjadi APK Android dengan kemampuan notifikasi. |
| K-18 | IoT kandang dan CCTV adalah pengembangan mendatang, bukan implementasi sekarang; sistem harus siap bertumbuh. |
| K-19 | Administrasi owner cukup aktif/nonaktif dan limit; harga serta billing subscription otomatis belum dibangun. |
| K-20 | Owner dapat memberikan kas pegangan, dana belanja khusus, atau membayar toko langsung; pola tidak eksklusif. |
| K-21 | ABK dapat mengambil kasbon yang diperhitungkan terhadap gaji. Gaji pokok berbasis periode ayam, bukan default bulanan. |
| K-22 | Upah pekerjaan tambahan bertarif tersendiri, tidak digabung ke komponen/slip/pembayaran gaji periode; boleh direkap bersama dalam laporan keuangan. |
| K-23 | PRD harus rinci dan dapat dipakai AI agent berbiaya rendah; deliverable berupa file Markdown. |

### 3.2 Default rancangan D

| ID | Default usulan yang digunakan dalam PRD | Keputusan terkait |
|---|---|---|
| D-01 | Tenant adalah ruang usaha; satu primary owner pada rilis awal. Co-owner/patungan belum didesain sebagai pembagian saham. | Q-02 |
| D-02 | R1 mencakup seluruh inti pada bagian 4; modul recording/kontrak/pribadi opsional diaktifkan. Pembangunan dibagi milestone internal. | Q-01 |
| D-03 | Owner memegang persetujuan/posting finansial. ABK/Mandor mengajukan; delegasi pembayaran bukan default. | Q-03 |
| D-04 | Kas terkonfirmasi tidak boleh minus; laporan belanja belum diverifikasi tetap terlihat sebagai klaim keluar, bukan dihapus. | Q-03 |
| D-05 | Stok bernilai memakai moving weighted average berdasarkan urutan posting server; satuan/metode tidak berubah retroaktif. | Q-04 |
| D-06 | Biaya tanpa alokasi periode tetap di luar periode sampai owner mengalokasikan; tidak otomatis masuk periode berikutnya. | Q-04 |
| D-07 | Hari chick-in ditampilkan sebagai hari ke-1. Basis umur kontrak disimpan eksplisit, default 1 hari saat chick-in. | Q-05 |
| D-08 | Tidak ada standar strain, batas IP baik/buruk, jadwal vaksin, atau harga PT universal yang ditanam sebagai fakta. | Q-05 |
| D-09 | Izin penggunaan offline terakhir berlaku maksimal 72 jam; antrean tidak dibuang saat izin kedaluwarsa. | Q-06 |
| D-10 | Keuangan pribadi online-only pada R1; hanya user pemilik yang dapat mengaksesnya. | Q-06 |
| D-11 | Angka transaksi IDR dibukukan ke rupiah bulat, half-up; kuantitas/rate presisi desimal. | Q-07 |
| D-12 | Kelebihan kapasitas memerlukan konfirmasi owner beralasan, bukan otomatis dianggap kapasitas baru. | Q-05 |
| D-13 | Laporan laba manajerial memakai hasil kemitraan neto sapronak yang direkonsiliasi, bukan menghitung sapronak dua kali. | Q-08 |
| D-14 | Kasbon gaji harus menunjuk perjanjian gaji periode; kelebihan/lanjutan saldo memerlukan keputusan eksplisit. | Q-09 |
| D-15 | Lokasi stok jamak dalam satu kandang didukung; pemindahan stok antar kandang belum otomatis pada R1. | Q-04 |
| D-16 | Inbox aplikasi pada R1; push web/Android dan pengemasan APK pada R2. | Q-01 |
| D-17 | PPL tidak melihat kontrak harga, pengeluaran, kas, gaji, kasbon, atau keuangan pribadi. | Q-03 |
| D-18 | Nominal komponen kontrak yang belum diketahui tidak diganti nol. Output parsial bukan estimasi lengkap. | Q-07 |
| D-19 | Framework dan versi dependensi diputuskan melalui ADR setelah kebutuhan disetujui. Tidak ada stack yang sudah dipasang oleh PRD. | Q-10 |

<a id="s04"></a>
## 4. Cakupan rilis dan dependensi

Pembagian berikut **usulan prioritas**, bukan penghapusan kebutuhan. R1 boleh dikirim ke pilot secara bertahap dengan feature flag; jangan mengklaim R1 penuh selesai jika modul wajib yang disepakati masih dummy.

**“R1, opsional” berarti pemakaiannya dapat dimatikan oleh tenant/periode, bukan izin implementer melewatkan modul dari R1 yang telah disetujui.** Pilot yang mengaktifkan estimasi wajib mempunyai builder primitive, validator, calculation engine, serta tes kontrak yang sesuai. Menampilkan angka manual saja tidak memenuhi fitur estimasi otomatis. Pilot parsial tanpa modul tersebut harus dinyatakan scope terpisah melalui Q-01.

| Kapabilitas | Rilis usulan | Batas |
|---|---|---|
| Tenant, login, membership, RBAC, audit, admin on/off/limit | R1 | Fondasi wajib |
| Kandang, bangunan, karyawan, periode, mitra | R1 | Fondasi wajib |
| Pengeluaran, pemasukan sampingan, kas ABK, utang toko, reimbursement | R1 | Inti; pencatatan pembayaran, bukan transfer bank otomatis |
| Stok gas/barang, penerimaan, pemakaian, opname, lokasi internal | R1 | Inti; bukan ERP gudang besar |
| Alokasi biaya, laporan kas dan biaya, pendapatan kemitraan | R1 | Inti; laba manajerial dengan batas kelengkapan |
| Gaji periode, kasbon, upah pekerjaan terpisah | R1 | Inti; bukan HR/payroll bulanan |
| Pekerjaan, kebutuhan belanja, perawatan, kunjungan PPL | R1 | Catatan/tindak lanjut sederhana; tanpa engine workflow bebas |
| Keuangan pribadi owner | R1, opsional | Buku pribadi sederhana; online-only usulan |
| Recording detail atau rekap manual, panen, FCR/ABW/deplesi/IP | R1, opsional | Tidak memaksa penginputan ulang data inti |
| Kontrak bertipe, tabel harga, bonus/potongan, estimasi, rekonsiliasi RHPP | R1, opsional | Hanya primitive yang didefinisikan; mekanisme baru dapat memerlukan pengembangan |
| Dashboard mobile-first, ekspor CSV/PDF, lampiran | R1 | File privat, ekspor laporan yang diotorisasi |
| Offline catatan lapangan, sinkronisasi, inbox notifikasi | R1 | Posting uang/kontrak/penutupan tetap online |
| APK hybrid, native push, web push | R2 | Kemampuan arsitektur disiapkan pada R1; uji Android tersendiri |
| Impor Excel/PDF/OCR dari mitra | R2 | Per format, preview dan konfirmasi; bukan janji membaca semua format |
| API mitra resmi | R2 atau berikutnya | Hanya setelah tersedia dan diizinkan |
| Reminder berulang kompleks, depresiasi otomatis, analitik lanjutan | Berikutnya | Tidak otomatis masuk R1 |
| IoT suhu/kelembapan, integrasi CCTV | Masa depan | Batas arsitektur saja; vendor dan protokol belum dipilih |
| Billing otomatis, WhatsApp berbayar, IoT actuator/control | Di luar scope saat ini | Memerlukan keputusan baru |

**Dependensi:** estimasi kontrak membutuhkan kontrak valid dan input dengan basis yang jelas; laba lengkap membutuhkan alokasi biaya dan settlement yang cukup; data per bangunan membutuhkan sumber per bangunan. Tidak ada modul tersebut yang menjadi syarat untuk mulai mencatat pengeluaran.

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
| Kasbon gaji | Pengambilan di muka atas gaji periode tertentu |
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
    ├── Lokasi stok/gudang
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
- **DATA-06:** posting IDR dibulatkan half-up ke Rp1 per baris yang ditentukan; total menjumlah nilai baris dibukukan. Kontrak boleh memiliki profil pembulatan berbeda yang tervalidasi dan tersimpan di versinya. Tampilan tidak boleh mengubah nilai input lookup diam-diam.
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
- **SEC-05:** field-level protection: kuantitas stok dapat terlihat tanpa harga beli; PPL melihat performa tanpa data gaji/kontrak/keuangan. Endpoint tidak mengirim field tersembunyi lalu berharap UI tidak menampilkan.

### 6.2 Matriks default R1

Matriks adalah **usulan D-03/D-17, menunggu Q-03**, bukan klaim delegasi finansial telah disetujui owner.

Legenda: **M** mengelola sesuai scope; **B** baca; **A** ajukan/catat, bukan persetujuan finansial; **S** hanya milik sendiri; **—** tidak.

| Kemampuan | Admin platform | Owner | Mandor opsional | ABK | PPL |
|---|---|---|---|---|---|
| Aktivasi tenant/limit sistem | M | B status sendiri | — | — | — |
| Kandang, bangunan, mitra, penugasan | — | M | B scope tugas | B scope tugas | B identitas minimum kandang undangan |
| Periode: buka/selesai/kunci/buka kembali | — | M | A | — | B |
| Kas usaha, kontrak harga, settlement, laba | — | M | — | — | — |
| Belanja lapangan | — | M | A scope tugas | A scope tugas | — |
| Saldo pegangan dan belanja sendiri | — | M | S | S | — |
| Persetujuan/pembayaran/reversal finansial | — | M | — | — | — |
| Stok kuantitas, pemakaian, opname | — | M | A/B scope tugas | A/B scope tugas | B kuantitas sapronak relevan |
| Gaji/kasbon pribadi ABK | — | M | S | S | — |
| Upah pekerjaan sendiri | — | M | A/B sendiri | A/B sendiri | — |
| Data produksi/panen | — | M | A/B scope tugas | A/B scope tugas | B kandang undangan |
| Kunjungan/rekomendasi PPL | — | M | A/B scope tugas | A/B scope tugas | A kunjungan sendiri, B scope grant |
| Task/lampiran operasional nonfinansial | — | M | A/B scope tugas | A/B scope tugas | B yang dibagikan ke PPL pada kandang undangan |
| Keuangan pribadi owner | — | S | — | — | — |
| Ekspor | metadata layanan | data berhak | laporan operasional scope tugas | catatan/saldo sendiri | laporan operasional scope grant |
| Audit | administrasi platform | usaha sendiri | riwayat yang berhak | riwayat sendiri | riwayat kunjungan sendiri |

Default tidak memberi Mandor akses gaji semua ABK. Delegasi finansial, jika disetujui kemudian, harus berupa capability eksplisit, scope kandang, batas nominal, dan audit; bukan otomatis akibat label Mandor.

**Scope PPL:** identitas kandang/bangunan, status fisik periode, produksi/panen, kuantitas sapronak, serta kunjungan/rekomendasi pada grant yang sah. Task/catatan umum ABK/owner hanya terbaca bila ditandai `PPL_VISIBLE`; default `INTERNAL`. Lampiran dan histori revisi mewarisi visibility objek induk. Nota/pembelian, tarif pekerjaan, kas/gaji, kontrak harga, dan settlement tetap tertutup; flag PPL_VISIBLE tidak dapat mengubah objek finansial menjadi publik. Kunjungan yang sengaja mencatat rekomendasi PPL default PPL_VISIBLE pada scope grant tersebut.

### 6.3 Perubahan akses

- Owner mengundang user dan memberikan scope kandang/bangunan. User dapat memegang beberapa peran pada scope berbeda; union izin hanya pada scope yang sama dan sah.
- Owner mencabut grant PPL atau penugasan ABK tanpa menghapus catatan lama.
- Penonaktifan karyawan tidak menghapus sisa kas, piutang, gaji, atau upah belum lunas.
- Setelah pencabutan, server menolak request baru dan URL unduhan baru. Salinan yang sebelumnya sudah diunduh tidak dapat dijanjikan dapat ditarik kembali.
- Admin tidak mempunyai menu impersonation/read-all. Akses dukungan khusus kelak memerlukan persetujuan, durasi, alasan, dan audit terpisah.

<a id="s07"></a>
## 7. Onboarding, master data, dan administrasi SaaS

| ID | Requirement dan validasi utama |
|---|---|
| ONB-01 | Admin membuat/mengaktifkan tenant, menetapkan primary owner, dan limit. Tidak ada checkout, harga paket, atau payment gateway R1. |
| ONB-02 | Owner mengisi nama usaha, zona waktu, kandang, bangunan/kapasitas, lalu akun kas awal. Kontrak lengkap bukan syarat mulai catat operasional. |
| ONB-03 | Saldo awal kas/stok/piutang dicatat dengan tanggal cut-off, sumber, dan alasan; bukan dianggap pendapatan periode. |
| ONB-04 | Owner mengundang ABK/Mandor/PPL dan mengatur penugasan. Karyawan boleh ada sebagai data tanpa akun login. |
| ONB-05 | Master kategori pengeluaran/pemasukan dapat ditambah/diarsip, tetapi kelas akuntansi seperti transfer, stok, pinjaman, dan biaya tidak dapat diubah sekadar mengganti nama kategori. |
| ONB-06 | Master barang memuat jenis, kepemilikan, unit dasar/konversi, mode stok/nonstok, minimum stok opsional. Tidak ada asumsi semua sak/tabung sama. |
| ONB-07 | Master mitra/toko/broker dibedakan menurut peran; satu pihak dapat mempunyai beberapa peran tanpa mencampur saldo/tagihan. |
| ONB-08 | Tarif pekerjaan disimpan sebagai template dengan unit; transaksi menyalin tarif yang dipakai, bukan mengacu pada tarif yang selalu berubah. |
| ONB-09 | Tidak meminta NIK, rekening lengkap, atau dokumen identitas jika tidak diperlukan. Login dan undangan harus membuktikan kepemilikan identitas melalui mekanisme terverifikasi yang dipilih di ADR. |

### 7.1 Status layanan dan limit

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

**CYC-03:** semua alokasi DOC periode berjumlah sama dengan populasi awal kandang. Periode yang diaktifkan membutuhkan populasi >0 dan tanggal chick-in. Maksimal satu status `ACTIVE` per kandang, ditegakkan dengan constraint/lock atomik server.

**CYC-04:** DOC per bangunan boleh lebih kecil dari kapasitas, termasuk nol. Jika melebihi kapasitas, tampilkan peringatan dan minta persetujuan owner beralasan menurut D-12; tidak mengubah kapasitas master otomatis.

### 8.2 Dua sumbu status yang berbeda

| Sumbu | Status | Aturan transisi |
|---|---|---|
| Pemeliharaan | `DRAFT` | Persiapan; belum ada DOC aktif. Boleh beberapa rencana masa depan. |
| Pemeliharaan | `ACTIVE` | DOC masuk; panen sebagian tetap aktif. Hanya satu per kandang. |
| Pemeliharaan | `FINISHED` | Tidak ada ayam hidup tersisa, atau owner telah menyelesaikan rekonsiliasi populasi dengan bukti. Tidak berarti uang sudah cair. |
| Pemeliharaan | `CANCELLED` | Rencana dibatalkan sebelum chick-in; biaya persiapan tetap ada dan dialokasikan ulang/di luar periode dengan audit. |
| Keuangan | `OPEN` | Biaya, upah, settlement, serta alokasi masih dapat diselesaikan melalui alur normal. |
| Keuangan | `REVIEW` | Checklist akhir diperiksa; tidak dianggap terkunci. |
| Keuangan | `LOCKED` | Snapshot laporan telah disahkan. Koreksi perlu buka kembali dengan alasan dan versi laporan baru. |

- **CYC-05:** periode berikutnya boleh aktif setelah fisik sebelumnya `FINISHED`, walau keuangan sebelumnya `OPEN/REVIEW` atau RHPP belum cair.
- **CYC-06:** tidak mengubah `FINISHED` kembali ke `ACTIVE` jika sudah ada periode fisik lain aktif. Koreksi historis populasi melalui review owner, bukan membuat dua periode aktif.
- **CYC-07:** selesai fisik pada mode rekap membutuhkan deklarasi akhir dan rekonsiliasi kepala ayam; tidak mensyaratkan semua recording harian ada. Selisih yang belum diketahui dicatat eksplisit, bukan dibuat menjadi kematian.
- **CYC-08:** masa kosong dihitung dari selesai fisik ke chick-in berikutnya, bukan tanggal RHPP atau tanggal uang diterima.

### 8.3 Checklist kunci keuangan

**CYC-09:** owner melihat: biaya belum diperiksa, klaim kas belum selesai, dokumen belum dialokasikan, stok sisa/retur, gaji/upah yang belum difinalkan, settlement belum lengkap, serta status sinkronisasi perangkat yang terakhir diketahui. Server tidak bisa menjamin tidak ada draft yang masih tersimpan di HP offline.

Kunci keuangan dapat menyimpan utang/piutang belum lunas jika nilai dan alokasinya telah diakui. Setelah dikunci, pembayaran atas utang/piutang tersebut boleh dicatat dengan tanggal pembayaran aktual dan menaut dokumen terkunci; tidak mengubah biaya/penghasilan snapshot. Mengubah nilai hak, rate, alokasi, atau settlement memerlukan reopen.

**CYC-10:** late sync ke periode terkunci tidak diterapkan diam-diam. Simpan sebagai usulan koreksi yang menunggu owner, dengan isi asli dan alasan konflik.

### 8.4 Gate penutupan dan matriks aksi

**CYC-11:** `financial_status=LOCKED` hanya diperbolehkan bila:

1. Fisik telah FINISHED dan populasi sudah direkonsiliasi; selisih fisik mempunyai klasifikasi, tidak dihapus. Rencana CANCELLED sebelum DOC dapat dikunci setelah semua biaya persiapannya direkonsiliasi; tidak memerlukan panen fiktif.
2. Semua klaim belanja yang ditaut ke periode sudah mempunyai resolusi terminal, tidak ada pengajuan biaya yang masih menunggu review untuk periode tersebut.
3. Gaji yang berlaku sudah difinalkan; pekerjaan berupah yang selesai pada periode sudah disetujui/ditolak dengan alasan. Pembatalan agreement menyelesaikan advance yang terkait.
4. Semua consumption yang dibebankan ke periode sudah bernilai; tidak ada unknown valuation. Sisa gas terpasang telah diukur/diestimasi eksplisit sesuai INV-15, atau periode tetap REVIEW.
5. Seluruh biaya sumber yang terkait telah dialokasikan, atau owner secara eksplisit menetapkan sisa sebagai biaya di luar periode dengan alasan; sumber tidak hilang dari laporan usaha.
6. Settlement sudah diverifikasi dan klasifikasi penghasilan versus tabungan/utang/biaya lengkap. Jika belum ada dokumen PT atau hanya net tak terklasifikasi, periode tetap OPEN/REVIEW. Pengecualian “tidak ada hak settlement” membutuhkan deklarasi owner dengan bukti, bukan asumsi nol.
7. Owner mengakui waktu sinkron terakhir dan komponen di luar cakupan laporan, misalnya depresiasi otomatis yang tidak dibangun. Ini tidak mengizinkan melewati klaim kas/gaji/valuation yang belum selesai.

Utang/piutang yang jumlahnya final tetapi belum dibayar **tidak memblokir lock**. Kontrak estimasi/recording harian yang tidak diaktifkan juga tidak memblokir lock jika data final aktual sudah cukup. Snapshot sementara boleh diekspor saat REVIEW, tetapi tidak berlabel final dan tidak mengubah state menjadi LOCKED. Tidak ada tombol “paksa final” yang mengabaikan gate di atas.

| Aksi | Physical DRAFT | Physical ACTIVE | Physical FINISHED + finance OPEN/REVIEW | Finance LOCKED |
|---|---|---|---|---|
| Rencana/biaya persiapan | Boleh sesuai izin | Boleh | Biaya aktual/alokasi boleh | Perubahan biaya perlu reopen |
| Event ayam/pakan produksi/panen baru | Tidak sebelum chick-in | Boleh dalam tanggal dan scope valid | Hanya koreksi historis/late report melalui review, bukan pemeliharaan baru | Review + reopen jika mengubah snapshot |
| Belanja/consumption operasional | Boleh di luar/rencana periode | Boleh | Boleh untuk realisasi biaya terkait; tanggal aktual tetap | Usulan koreksi, bukan posting biaya langsung ke periode |
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
| Sinkronisasi | lokal, antre, terkirim, konflik, ditolak izin | Apakah server menerima operasi; bukan status pembayaran |

UI menampilkan hanya status yang relevan, bukan empat dropdown yang wajib dipahami ABK.

Transisi review yang diperbolehkan: DRAFT→SUBMITTED; SUBMITTED→APPROVED/NEEDS_CORRECTION/REJECTED; NEEDS_CORRECTION→SUBMITTED dengan versi baru. REJECTED dapat diajukan ulang sebagai revisi tertaut selama sumber belum posted/diresolusi terminal. Dokumen posted tidak dapat diganti menjadi rejected untuk membatalkan uang; gunakan reversal/koreksi. Owner boleh menjalankan simpan+approve+post sebagai satu command atomik untuk transaksi yang memang ia berwenang catat. Status pelunasan dihitung dari application valid, tidak dapat dipilih bebas agar tampak lunas.

### 9.2 Aturan posting

- **FIN-01:** satu kejadian sumber dapat menimbulkan beberapa efek tertaut (stok, utang, kas, biaya) dalam transaksi atomik. Masing-masing mempunyai jenis efek; tidak diproses sebagai empat pengeluaran terpisah.
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

Penerimaan uang oleh ABK mengikuti transfer owner yang sudah diposting; jika penerimaan diperselisihkan, beri status rekonsiliasi, bukan menciptakan uang tambahan. Laporan penerimaan baru dari ABK tanpa transfer/bukti yang diverifikasi belum menambah saldo terkonfirmasi.

- `SUBMITTED/NEEDS_CORRECTION/REJECTED` atas belanja yang diklaim nyata tetap masuk daftar klaim belum selesai.
- Saat disetujui, klaim diubah menjadi efek kas/biaya/stok yang sah secara atomik; klaim tidak lagi ikut pengurang sementara.
- Jika transaksi ternyata tidak terjadi/duplikat, owner menyelesaikan klaim dengan alasan dan bukti. Jangan memaksa ABK menghapus laporan untuk menutup selisih.
- Jika uang harus dikembalikan, catat kejadian pengembalian/refund sebenarnya. Jangan otomatis memotong gaji karena kategori belanja ditolak.
- Bila klaim lebih besar dari saldo, minta klarifikasi sumber dana (kas lain/ABK menalangi/kesalahan). Tidak memposting saldo kas negatif untuk menyembunyikan persoalan.
- Dashboard biaya terkonfirmasi dan biaya dilaporkan belum diperiksa dipisahkan. Laba tidak boleh berlabel lengkap selama klaim material belum selesai.

### 9.4 Resolusi klaim kas yang deterministik

**FIN-11:** `cash_claim.resolution` terpisah dari approval. Default `UNRESOLVED`; state berikut terminal dan membutuhkan owner. Satu klaim hanya dapat mempunyai satu resolusi efektif, jumlah klaim parsial diselesaikan melalui allocation lines dengan total yang tepat.

| Resolusi | Efek | Kapan berhenti menjadi pengurang kas sementara |
|---|---|---|
| `POSTED_PURCHASE` | Pembelian diterima; post cash out dan biaya/stok/aset sesuai sumber | Atomik saat cash out menggantikan klaim |
| `NOT_OCCURRED` | Bukti menunjukkan transaksi tidak terjadi; tanpa cash out/cost | Saat owner menyelesaikan dengan alasan/bukti |
| `DUPLICATE_OF` | Menaut klaim/dokumen kanonis untuk kejadian yang sama; tidak membuat efek kedua | Saat link disahkan; hanya klaim kanonis yang dihitung bila masih unresolved |
| `PAYER_CORRECTED` | Ternyata bukan dari kas pegangan; owner mengesahkan sumber lain, misalnya ABK menalangi dan reimbursement | Saat efek sumber yang benar diposting atomik; kas pegangan tidak turun |
| `POSTED_RECOVERABLE` | Uang memang keluar tetapi menjadi tagihan pengembalian pada toko/ABK/pihak lain, bukan biaya yang disetujui | Saat cash out + receivable yang sah dibukukan; refund berikutnya melunasi receivable |

`REFUND_REQUIRED` sebelum nilai/pihak/kewajiban pengembalian disahkan adalah alasan review, **bukan** resolusi terminal. Piutang kepada ABK tidak dibuat sebagai hukuman otomatis; perlu keputusan serta bukti/kesepakatan yang sesuai. Refund yang sudah diterima langsung dicatat melalui pasangan keluar-ke-recoverable dan penerimaan pelunasan agar kejadian kas nyata tetap dapat ditelusuri. Setelah terminal, approval ulang klaim yang sama ditolak; koreksi melalui reversal resolusi/effect terkait, bukan membuat expense kedua.

### 9.5 Receipt idempotency durable

**FIN-12:** server menyimpan `command_receipt` unik `(data_space, command_type, operation_id)`, payload hash, aktor, status processing/committed/terminal-rejected, object/effect IDs, dan waktu. Receipt commit dan ledger effects berada dalam transaksi atomik yang sama.

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

### 10.1 Akun dana

**CASH-01:** owner dapat membuat kas tunai usaha, rekening usaha yang dicatat manual, kas kandang, dan subakun kas pegangan ABK. Pemilik saldo dan pemegang uang adalah konsep berbeda. Rekonsiliasi saldo fisik tidak mengubah pengeluaran historis.

**CASH-02:** transfer antar akun usaha menghasilkan sisi keluar dan masuk terhubung, tanpa pendapatan/biaya. Pada laporan gabungan usaha, transfer internal dieliminasi. Untuk kas pegangan ABK, simpan kandang, pemegang, tujuan dana, dan penyerahan/konfirmasi penerimaan.

### 10.2 Alur yang wajib didukung

| ID | Skenario | Efek yang benar |
|---|---|---|
| CASH-03 | Owner menyerahkan RpX uang pegangan | Kas sumber turun, kas pegangan ABK naik; biaya tetap nol. |
| CASH-04 | Dana khusus belanja barang tertentu | Transfer seperti CASH-03 dengan tujuan/budget; realisasi ditautkan, sisa dapat dikembalikan atau tetap dipegang dengan keputusan owner. |
| CASH-05 | ABK belanja dari pegangan | Dokumen pembelian + sumber kas pegangan; setelah verifikasi, kas turun dan biaya/stok/aset atau uang muka bertambah sesuai klasifikasi. |
| CASH-06 | Owner membayar langsung ke toko | Pembelian serta pembayaran tertaut ke akun owner/usaha yang sebenarnya; tidak membuat kas ABK fiktif. |
| CASH-07 | Pembelian kredit di toko | Barang/jasa yang diterima diakui sebagai stok/biaya/aset dan utang toko; kas baru turun saat pembayaran. |
| CASH-08 | ABK menalangi dengan uang pribadi | Belanja yang disetujui menghasilkan utang reimbursement kepada ABK; pembayaran penggantian melunasi utang, tidak membuat biaya lagi. |
| CASH-09 | Bayar uang muka toko sebelum barang datang | Uang muka supplier, bukan biaya/stok diterima; dialihkan saat bukti penerimaan/invoice dikonfirmasi. |
| CASH-10 | Sisa dana dikembalikan ABK | Transfer kembali dari pegangan ke kas sumber, bukan pendapatan. |
| CASH-11 | Refund pembelian | Menaut pembelian asli, kuantitas/nilai yang dikembalikan, penerimaan uang atau pengurang utang; efek biaya/stok dibalik sesuai asal. |
| CASH-12 | Kas fisik tidak cocok | Opname kas mencatat saldo buku, saldo fisik, selisih, bukti, dan review. Penyesuaian butuh owner; tidak otomatis menjadi biaya lain-lain. |

### 10.3 Field transaksi belanja minimum

- Tenant, pembuat, kandang atau biaya umum usaha, tanggal kejadian, kategori/kelas transaksi.
- Pihak toko/penerima, catatan keperluan; pihak dapat teks sementara yang kemudian dipadankan master tanpa mengganti bukti asli.
- Satu atau beberapa baris: barang/jasa, kuantitas dan unit bila relevan, rate, diskon/biaya tambahan eksplisit, jumlah baris, pajak bila memang diketahui.
- Status barang diterima/jasa selesai, sumber dana, nominal telah dibayar, penerima reimbursement jika ditalangi.
- Alokasi periode/bangunan atau status di luar/belum dialokasikan.
- Bukti opsional awal; jika tidak ada nota, wajib alasan singkat. Aturan wajib bukti per kategori dapat diaktifkan owner setelah kebijakan disetujui.

**CASH-13:** satu invoice boleh dibayar beberapa kali dari beberapa akun yang sah, tetapi total pembayaran lintas akun tidak boleh dihitung sebagai beberapa pembelian. Pencatatan manual pembayaran bukan konfirmasi bank otomatis.

**CASH-14:** penjualan kotoran, karung, sekam bekas, atau pemasukan sampingan lain dicatat sebagai pendapatan/kas atau piutang yang relevan. Penjualan ayam yang sudah menjadi bagian settlement tidak dicatat sebagai pendapatan sampingan kedua kali; scope panen dan hak menjual harus dinyatakan.

<a id="s11"></a>
## 11. Pembebanan biaya dan laporan periode

### 11.1 Pisahkan tiga pertanyaan

1. **Uang keluar kapan dan dari mana?** Dijawab cash movement.
2. **Barang/jasa menjadi biaya kapan?** Dijawab cost recognition.
3. **Biaya menjadi beban kandang/periode mana?** Dijawab cost allocation.

**COST-01:** setiap biaya mempunyai sumber tunggal. Penerimaan invoice, pembayaran invoice, dan alokasi invoice tidak boleh masing-masing membuat biaya baru.

| Jenis | Pengakuan default | Tidak boleh dilakukan |
|---|---|---|
| Jasa/barang langsung habis | Saat diterima/pekerjaan selesai dan disetujui | Menambah biaya lagi ketika utang dibayar |
| Barang persediaan | Saat pemakaian/disposal yang disahkan | Membebankan pembelian sekaligus pemakaian |
| Gaji periode | Saat hak gaji periode difinalkan; proyeksi berjalan diberi label terpisah | Mengakui kasbon sebagai biaya tambahan |
| Upah pekerjaan | Saat pekerjaan selesai dan nilai disetujui | Menunggu payroll untuk mengakui atau mencampurnya ke slip gaji |
| Aset/peralatan tahan lama | Dicatat sebagai aset, bukan default biaya habis | Menganggap semua pembelian alat sebagai biaya satu periode |
| Uang muka, transfer, pokok pinjaman | Bukan biaya | Memasukkannya ke kategori pengeluaran operasional biasa |

Depresiasi otomatis bukan R1. Penyesuaian beban aset manual, jika dibutuhkan, harus disahkan owner, merujuk aset dan basisnya; laporan menandai jika penyusutan belum diperhitungkan.

### 11.2 Scope alokasi

- **COST-02:** biaya boleh berada pada tenant umum, kandang tanpa periode, periode tanpa bangunan, atau periode+bangunan. Jangan memaksa seluruh biaya dibagi per bangunan.
- **COST-03:** biaya persiapan masa kosong tidak otomatis milik periode sebelumnya/berikutnya. Owner boleh menaut periode rencana berikutnya atau tetap di luar periode. Jika rencana batal, biaya tetap nyata dan perlu review alokasi.
- **COST-04:** biaya bersama dapat dibagi nominal tetap, persentase, atau proporsi driver terpilih (misalnya populasi awal snapshot/hari layanan). Simpan driver, nilai driver, rentang tanggal layanan, dan hasil pembagian. Tidak memilih driver otomatis.
- **COST-05:** total alokasi + sisa belum dialokasikan = nilai biaya sumber. Sisa tidak lenyap. Pembulatan dibagikan deterministik: bulatkan setiap bagian kecuali baris terakhir menurut urutan tersimpan; baris terakhir menerima sisa agar total tepat.
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
| Gaji, upah pekerjaan, gas/stock use, jasa owner yang tidak dikurangi di net PT | Ya, satu cost source | Nol | Dikurangkan satu kali |
| Belanja ditalangi ABK/owner | Ya sesuai penerimaan/pemakaian/jasa | Nol kecuali ada coverage terverifikasi | Tetap dikurangkan; pembayaran reimbursement bukan cost lagi |
| Biaya operasional dibayarkan PT dan dipotong dari hak owner pada net settlement | Ya jika didokumentasikan sebagai biaya owner; utang kepada PT diselesaikan lewat potongan | Sebesar komponen yang sudah mengurangi net; link invoice/cost source wajib | Bagian tertutup tidak dikurangkan lagi |
| Sapronak PT yang sudah masuk hitungan penghasilan kemitraan net | Tidak pada ledger biaya owner; ada partner analytic lines | Tidak membuat coverage palsu karena bukan cost entry owner | Tidak dikurangkan lagi dari penghasilan net |
| PT menambah reimburse/kompensasi biaya ke penghasilan settlement | Biaya asal tetap ya | Nol untuk penambahan penghasilan ini | Tambahan penghasilan dan biaya asal sama-sama tampil; biaya tetap dikurangkan |
| Biaya sebagian telah dipotong PT | Ya seluruh biaya sah | Hanya bagian yang terbukti sudah mengurangi net | Hanya sisa biaya di luar coverage yang dikurangkan |
| Modal, transfer, advance, pokok pinjaman, tabungan masih milik owner, pembelian aset | Tidak, kecuali cost terpisah yang benar-benar diakui | Tidak | Tidak dikurangkan sebagai biaya operasional |

Contoh: gas owner Rp1.000.000; Rp400.000 sudah mengurangi net penghasilan PT. Laporan biaya gas tetap Rp1.000.000; coverage Rp400.000; pengurang laba setelah net PT hanya Rp600.000. Jika PT justru **menambah** reimburse Rp400.000 ke penghasilan, coverage nol dan pengurang biaya tetap Rp1.000.000.

Coverage mempunyai ID, cost allocation, settlement component/version, nominal, dan persetujuan; perubahan membuat revisi, bukan flag bebas “sudah dihitung”. Komponen periode lama tidak dialihkan ke laba periode kini hanya karena dipotong pada payout kini. Jika mapping belum jelas, settlement classification belum lengkap dan laba berlabel sementara.

<a id="s12"></a>
## 12. Stok operasional, gas, dan sapronak

### 12.1 Identitas dan kepemilikan

- **INV-01:** item/SKU mempunyai unit dasar, konversi kemasan, mode `STOCKED` atau `DIRECT_EXPENSE`, serta owner/mitra sebagai pihak kepemilikan/penanggungnya. Perubahan mode hanya prospektif dan tidak boleh merombak histori.
- **INV-02:** minimum satu gudang per kandang; lokasi bangunan dapat ditambahkan. Mutasi antar lokasi dalam kandang yang sama bukan pemakaian dan bukan biaya.
- **INV-03:** stok operasional milik owner dipisahkan dari sapronak milik/ditagihkan PT. Nilai sapronak untuk analisis kontrak tidak otomatis menjadi biaya owner di luar settlement.
- **INV-04:** penerimaan menyimpan tanggal, surat jalan opsional, item, jumlah, unit, lokasi, sumber, serta nilai perolehan jika milik owner. Nilai perolehan = net nilai barang setelah diskon + biaya perolehan yang dipilih untuk dikapitalisasi; pajak refundable tidak dimasukkan tanpa klasifikasi. Alokasi ongkos bersama disimpan eksplisit. Penerimaan fisik tidak harus sekaligus pembayaran; nilai tidak diketahui mengikuti INV-14, bukan diisi nol.

### 12.2 Mutasi dan penilaian

```text
stok_akhir = stok_awal + penerimaan + transfer_masuk + retur_dari_pemakaian
             - pemakaian - transfer_keluar - retur_supplier - kehilangan_sah
```

- **INV-05:** penggunaan menyebut item, jumlah, lokasi asal, kandang/bangunan pemakai, periode atau di luar periode, waktu, dan pencatat. ABK tidak harus mengetahui harga; server menghitung nilai biaya.
- **INV-06:** transaksi dari user dengan izin mencatat pemakaian boleh diposting server setelah validasi stok/periode; harga tidak dapat diubah ABK. Penyesuaian opname/kehilangan butuh persetujuan owner.
- **INV-07:** stok terkonfirmasi tidak boleh negatif. Pengambilan offline yang melebihi stok saat sinkron masuk konflik dan tetap disimpan sebagai laporan belum direkonsiliasi. Jangan mengganti jenis barang diam-diam untuk membuat total cocok.
- **INV-08:** moving weighted average berlaku per tenant+kandang+SKU+ownership pool. Lokasi menyimpan kuantitas; transfer lokasi mempertahankan nilai, bukan pembelian baru. Formula rata-rata = nilai persediaan tersedia / kuantitas tersedia, dihitung decimal.
- **INV-09:** consumption mengurangi kuantitas dan nilai persediaan, menambah biaya senilai hasil valuasi. Pengambilan terakhir yang menghabiskan pool mengambil sisa nilai buku untuk menghilangkan residu pembulatan.
- **INV-10:** urutan valuasi adalah urutan posting server. `occurred_at` yang terlambat tidak memicu repricing seluruh histori otomatis. Koreksi yang perlu mengubah valuasi lampau masuk review owner dengan impact report; R1 tidak menawarkan silent backdated recosting.
- **INV-11:** retur supplier mengacu penerimaan dan jumlah yang belum diretur; stok fisik tersedia tetap harus cukup. Inventory keluar dinilai dengan rata-rata pool saat retur. Nilai uang/kredit supplier memakai kesepakatan retur; selisih terhadap nilai buku dicatat sebagai variance retur berizin, tidak mengubah issue historis. Retur pemakaian mengacu issue asal, maksimal jumlah yang belum dikembalikan, dan memakai nilai issue asal; ini menambah kuantitas/nilai pool serta membalik biaya terkait.
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
- Owner mengisi nilai yang hilang melalui opening/receipt valuation berizin. Sistem menyelesaikan **valuation yang sebelumnya pending** sesuai posting sequence, membukukan cost source satu kali, lalu menandainya valued.
- Valuation pending tidak mengubah cost sebelumnya yang sudah valued. Jika koreksi justru mengubah nilai yang telah disahkan, gunakan impact review/reversal, bukan backfill otomatis yang menimpa histori.
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

<a id="s13"></a>
## 13. Gaji periode, kasbon, dan upah pekerjaan terpisah

**Bagian ini adalah batas keras produk. Jangan menyederhanakannya dengan memasukkan semua pembayaran ABK ke satu payroll.**

### 13.1 Gaji periode

- **PAY-01:** perjanjian gaji memuat ABK, kandang, periode pemeliharaan, nilai gaji yang disepakati, sumber persetujuan, dan catatan. Basis utama per periode ayam; bukan payroll bulanan otomatis.
- **PAY-02:** satu agreement mempunyai state `DRAFT → AGREED → FINALIZED → SETTLED`; pembatalan draft tidak menghapus kasbon yang sudah dicairkan. `AGREED` dipakai untuk proyeksi biaya, `FINALIZED` mengakui hak gaji/biaya sebenarnya.
- **PAY-03:** gaji disepakati sebelum akhir periode dapat direvisi dengan persetujuan dan histori. Nilai finalized tidak berubah in-place; perubahan setelah final butuh koreksi dan revisi kewajiban.
- **PAY-04:** slip gaji periode menampilkan hak gaji periode, pengambilan gaji di muka yang diterapkan, potongan pinjaman yang disepakati, pembayaran langsung gaji, dan sisa. **Tidak memuat upah pekerjaan tambahan sebagai komponen hak gaji.**
- **PAY-05:** jika seorang ABK bekerja di lebih dari satu kandang, setiap agreement/alokasi harus eksplisit. Jangan menyalin penuh satu gaji ke setiap kandang. Perubahan penugasan tidak otomatis mengubah agreement lama.
- **PAY-06:** ABK berhenti sebelum akhir periode: owner menetapkan hak akhir dan alasan, menyelesaikan uang pegangan/kasbon secara terpisah; tidak ada prorata otomatis yang belum disepakati.

### 13.2 Kasbon dan pinjaman

| Jenis | Saat dicairkan | Saat penyelesaian | Batas |
|---|---|---|---|
| `WAGE_ADVANCE`/ambil gaji dulu | Kas turun, saldo uang muka gaji kepada ABK naik; belum menjadi biaya gaji | Diterapkan sekali ke agreement periode, mengurangi saldo advance dan hak belum dibayar | Wajib menunjuk agreement; tidak dipotong lagi sebagai loan yang sama |
| `EMPLOYEE_LOAN` dari usaha | Kas usaha turun, piutang ABK naik | Pembayaran langsung atau offset gaji berotorisasi mengurangi piutang | Potongan memerlukan persetujuan; tidak otomatis berdasarkan keberadaan saldo |
| Pinjaman dari pribadi owner | Kas pribadi turun, piutang pribadi owner naik | Pelunasan masuk pribadi; jika melalui potongan gaji, pakai mekanisme lintas-ruang pada 13.4 | Bukan kas/biaya usaha otomatis |
| Kas pegangan belanja | Transfer internal kas usaha | Pertanggungjawaban belanja/pengembalian | **Bukan kasbon dan tidak otomatis memotong gaji** |

- **PAY-07:** kasbon menyimpan tanggal pencairan, pemberi dana/kreditur, penerima, jenis, nominal, tujuan/agreement, bukti, dan saldo. Pengajuan kasbon belum mencairkan kas.
- **PAY-08:** setiap application/offset mempunyai ID, advance/loan sumber, agreement tujuan, nominal, tanggal, persetujuan, dan efek atomic. Tidak boleh melebihi saldo sumber atau sisa hak yang boleh diselesaikan.
- **PAY-09:** jika kasbon melebihi hak gaji, sisa tidak membuat pembayaran gaji negatif. Tampilkan saldo belum selesai. Carry ke periode berikutnya, pembayaran tunai, atau konversi menjadi pinjaman memerlukan keputusan owner dan pengakuan ABK; tidak otomatis.
- **PAY-10:** pemotongan tidak otomatis mengambil upah pekerjaan tambahan. Reversal pembayaran atau payroll harus membalik application terkait secara konsisten, bukan menghidupkan piutang ganda.

```text
sisa_hak_gaji = gaji_final
                - advance_yang_diterapkan
                - offset_pinjaman_yang_disetujui
                - pembayaran_gaji_valid
```

`advance_yang_diterapkan` bukan seluruh kasbon seorang ABK dari semua periode. Hak bruto tetap biaya gaji; advance dan cicilan pokok bukan pengurang biaya.

### 13.3 Upah pekerjaan tambahan

- **PAY-11:** catat terpisah: ABK/pekerja, jenis pekerjaan, tanggal selesai, kandang/bangunan, periode opsional, jumlah, unit, tarif snapshot, total, pemeriksa, bukti, dan pembayaran.
- **PAY-12:** tarif boleh per karung, per jam/hari kerja, per unit, atau borongan tetap. Satuan dipilih dari template; tarif tidak berubah ketika master diedit.
- **PAY-13:** state `DRAFT → SUBMITTED → APPROVED/NEEDS_CORRECTION/REJECTED`; setelah pekerjaan selesai dan disetujui, biaya serta utang upah diakui. Pembayaran sendiri berstatus unpaid/partial/paid.
- **PAY-14:** pekerjaan dapat dibayar saat itu juga atau belakangan, tetapi melalui dokumen upah pekerjaan, **bukan tambahan pembayaran payroll**. Jika nominal bank digabung secara fisik, pencatat harus memecah alokasinya menjadi pembayaran gaji dan pembayaran pekerjaan yang terhubung referensi bank sama; slip tetap terpisah.
- **PAY-15:** laporan boleh mengagregasi `biaya tenaga kerja = biaya gaji periode + biaya upah pekerjaan`, dengan subkategori tetap terlihat. Daftar utang ABK dapat merangkum kedua jenis, tanpa menambahkan upah ke slip gaji.
- **PAY-16:** task operasional yang ditandai selesai tidak otomatis menghasilkan upah; harus ada job compensation yang disetujui agar pekerjaan biasa tidak semuanya menjadi tagihan.

### 13.4 Kasbon pribadi owner yang dilunasi melalui gaji usaha

Usulan aman untuk mencegah pemakaian uang usaha sebagai uang pribadi tanpa jejak:

1. Owner menautkan klaim pinjaman yang boleh dipotong, dengan persetujuan ABK; hanya nominal dan referensi minimum terlihat pada payroll.
2. Potongan sah mengurangi hak gaji yang dibayar ke ABK dan membentuk kewajiban usaha kepada owner. Biaya gaji bruto tetap sama.
3. Di buku pribadi, bagian piutang terhadap ABK dialihkan menjadi piutang terhadap usaha; belum dianggap kas diterima.
4. Saat usaha membayar owner, kewajiban usaha dan piutang pribadi tersebut lunas secara tertaut. Ini pelunasan pokok, bukan pendapatan pribadi tambahan atau biaya usaha baru.
5. Jika mekanisme lintas-ruang belum disetujui/diimplementasi dengan tes, **blok auto-offset pinjaman pribadi melalui payroll**; pembayaran langsung pribadi tetap dapat dicatat. Jangan membuat jalan pintas lewat expense umum.

<a id="s14"></a>
## 14. Keuangan pribadi owner

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

**PER-05:** toggle “Usaha/Pribadi” terlihat jelas di layar owner. Draft, hasil pencarian, ekspor, dan lampiran membawa scope; berpindah ruang tidak memindahkan draft otomatis. Offline private finance belum masuk R1 menurut D-10.

<a id="s15"></a>
## 15. Pekerjaan, perawatan, dan kunjungan PPL

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

### 16.1 Mode periode

| Mode | Penggunaan | Konsekuensi |
|---|---|---|
| `OFF` | Hanya operasi/keuangan, DOC awal dan informasi periode minimum | Performa tidak tersedia kecuali rekap akhir dimasukkan; tidak memblokir belanja |
| `SUMMARY` | Owner/Mandor memasukkan rekap dari mitra atau catatan sendiri | Simpan cutoff, cakupan, sumber, dan bukti; tidak perlu detail harian |
| `DETAIL` | Event produksi/pakan/panen dicatat di aplikasi | Agregasi berasal dari event; rekap luar hanya pembanding, bukan ditambahkan lagi |

- **REC-01:** default awal dapat SUMMARY/OFF sesuai pilihan onboarding. User tidak harus menginput mortalitas setiap hari agar boleh mengisi pengeluaran.
- **REC-02:** suatu dataset/metrik pada scope dan rentang yang sama hanya mempunyai satu sumber otoritatif. Rekap kumulatif terbaru menggantikan versi rekap sebelumnya pada cakupan itu, bukan dijumlah.
- **REC-03:** beralih mode di tengah periode membutuhkan cutoff dan opening balance yang direkonsiliasi. R1 tidak otomatis menggabungkan event lama dengan cumulative summary yang overlap.
- **REC-04:** setiap rekap mencatat `as_of_date`, source type (manual lapangan/rekap mitra), unit, scope kandang/bangunan, pencatat, versi, dan status kelengkapan. Nilai FCR dari mitra disimpan sebagai nilai dilaporkan terpisah dari nilai dihitung aplikasi.
- **REC-05:** sumber satu kandang tidak boleh diproratakan otomatis ke bangunan lalu diklaim sebagai pengukuran nyata.

### 16.2 Pemilihan sumber yang deterministik

**REC-13:** simpan `RecordingAuthority` untuk `(cycle, metric, farm_or_building_scope)` dengan source `DETAIL`, `OWNER_SUMMARY`, atau `PARTNER_SUMMARY`, lineage, dan versi keputusan owner. Versi R1 memakai satu sumber otoritatif per metrik selama periode, kecuali migrasi cutoff yang eksplisit dan direkonsiliasi.

- Metrik kumulatif seperti pakan/mati/panen memakai coverage dari chick-in sampai `as_of_date`, bukan rentang arbitrer yang dijumlahkan. Sampling adalah point-in-time dataset terpisah.
- Untuk laporan cutoff T, ambil snapshot sah pada lineage terpilih dengan `as_of_date` paling akhir yang ≤T; jika tanggal sama, ambil revisi terakhir yang disahkan. Waktu upload tidak menentukan prioritas. Versi sebelumnya tetap tersedia untuk audit; tidak digabungkan dengan revisinya.
- Jika data terakhir hanya sampai T-2, nyatakan cutoff sebenarnya. Jangan menyebut semua input berasal dari T atau menginterpolasi diam-diam. FCR yang memerlukan beberapa input harus menunjukkan cutoff masing-masing dan tidak menjadi final jika belum sepadan.
- Ringkasan dari sumber lain disimpan sebagai pembanding. Pergantian authority memerlukan owner dan impact preview; tidak memilih sumber dengan nilai yang paling bagus atau terbaru di-upload.
- Rekap rentang yang tidak dimulai dari chick-in tidak diterima sebagai cumulative authoritative tanpa opening balance/cutoff migrasi yang disahkan. Migrasi menyimpan saldo hingga cutoff C, lalu hanya event setelah C; data detail yang overlap C tidak ditambahkan lagi.
- Contract metric membedakan `FCR_CALCULATED`, `FCR_PARTNER_REPORTED`, `FCR_PROJECTED`, dan sumber standar. Rule memilih source metric eksplisit; nilai mitra yang kosong tidak diganti nilai aplikasi tanpa keputusan. Estimasi akhir tidak memakai FCR final sebelum tersedia.

### 16.3 Catatan detail

- **REC-06:** mortalitas/afkir, feed consumption, sampling, dan kejadian dapat berupa beberapa event per hari. Daily summary adalah hasil agregasi, bukan record tunggal yang bebas ditimpa oleh beberapa HP.
- **REC-07:** field mati/afkir tidak boleh terisi otomatis dari hari sebelumnya. Angka nol harus dikonfirmasi jika dipakai sebagai data lengkap hari itu; kosong berarti belum ada laporan.
- **REC-08:** catatan pakan memilih jenis/varian dan jumlah yang benar-benar digunakan. Sistem boleh menyarankan barang terakhir tetapi meminta konfirmasi; umur ayam tidak membuktikan jenis pakan yang dipakai.
- **REC-09:** bila konsumsi pakan berasal dari event inventory yang sama, gunakan referensi event tersebut untuk recording; jangan input ulang atau menghitung dua kali.
- **REC-10:** sampling memuat bangunan, waktu, jumlah sampel >0, total bobot bersih >0, unit, dan metode/catatan. ABW dihitung, tidak harus diisi manual. Tidak menentukan jumlah sampel universal sebagai standar medis/peternakan.
- **REC-11:** suhu/kelembapan manual boleh dicatat sebagai konteks dengan unit/waktu/lokasi; bukan integrasi sensor yang sudah berjalan.
- **REC-12:** user dapat mencatat OVK/vaksin yang diberikan tanpa sistem meresepkan obat/jadwal. Hubungkan pemakaian stok jika memang item yang sama.

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
| MET-02 | ABW sampling | Total kg sampel / total ekor sampel pada sesi yang sama; jangan merata-ratakan rata-rata tanpa pembobot. |
| MET-03 | ABW panen | Total kg panen bersih / total ekor panen aktual. Unit keluaran kg/ekor; gram hanya konversi tampilan. |
| MET-04 | Umur panen rata-rata | `Σ(umur_tiket × ekor_tiket) / Σ(ekor_tiket)`. Default dibobot ekor, bukan rata-rata sederhana tanggal. Basis alternatif kontrak harus berlabel. |
| MET-05 | FCR final operasional | Total pakan benar-benar dikonsumsi (kg) / total bobot hidup panen (kg), setelah fisik selesai dan data direkonsiliasi. Pakan diterima/tersisa bukan otomatis konsumsi. |
| MET-06 | FCR berjalan estimasi | Pakan konsumsi kumulatif / `(kg panen kumulatif + estimasi biomassa hidup tersisa)` pada cutoff yang sama. |
| MET-07 | Biomassa hidup estimasi | `Σ(populasi hidup bangunan × ABW sampling representatif bangunan)`; jika rekap hanya sekandang, gunakan basis sekandang berlabel. Jangan memasukkan bangunan tanpa sampel sebagai nol kg. |
| MET-08 | IP final operasional | `(daya_hidup_final_persen × ABW_panen_kg × 100) / (FCR_final × umur_panen_rata_rata)`. Daya hidup mengikuti MET-01, pada periode rekonsiliasi lengkap tanpa selisih populasi yang belum dijelaskan. |

**MET-09:** IP final tidak ditampilkan jika umur/FCR/bobot tidak valid atau rekonsiliasi populasi belum lengkap. IP proyeksi, bila dibuat, harus memakai skenario berlabel; tidak menampilkan nilai berjalan sebagai hasil final.

**MET-10:** umur event = selisih tanggal lokal event terhadap chick-in + `age_at_chick_in_days`. Nilai default 1 adalah usulan; setiap periode/kontrak menyimpan basis. UI dapat membedakan “hari pemeliharaan” dan umur kontrak jika berbeda.

**MET-11:** sampling terakhir menampilkan tanggal dan usia data. Default usulan stale setelah >7 hari; umur batas dapat disetujui per usaha. Sampling stale menyebabkan label data usang/estimasi rendah keyakinan, bukan indikator hijau pasti aman.

**MET-12:** agregasi antarkandang memakai total numerator/denominator yang sepadan, bukan rata-rata FCR/IP mentah. Jangan menggabungkan periode aktif dan selesai menjadi satu metrik final tanpa label.

**MET-13:** tabel standar dipilih eksplisit menurut sumber/strain/bobot/umur, versi, unit, serta aturan interpolasi. Tanpa standar, tampilkan metrik aktual tanpa label baik/buruk. Angka FCR nol atau sampling kosong pada screenshot tidak membuktikan penyebab masalah data.

<a id="s19"></a>
## 19. Mitra, kontrak berversi, dan mesin perhitungan

### 19.1 Kepemilikan dan lifecycle

- **CON-01:** mitra adalah master tenant. Template harga PT tidak dibagikan lintas tenant secara otomatis, meskipun nama PT sama.
- **CON-02:** satu periode memilih satu kesepakatan utama dan snapshot versi syarat untuk perhitungan. Kesepakatan owner berbeda dapat memakai template yang sama dengan nilai berbeda.
- **CON-03:** kontrak memuat mitra, owner/tenant, kandang yang dapat memakai, tanggal berlaku, lampiran privat opsional, mata uang, skema, metrik pembanding, profil pembulatan, dan versi.
- **CON-04:** lifecycle `DRAFT → VALIDATED → APPROVED → RETIRED`. Versi approved yang sudah dipakai immutable. Perubahan membuat versi baru; retired tetap dapat dibaca oleh histori.
- **CON-05:** jika ada addendum di tengah periode, owner memilih cakupan tanggal/kejadian yang terdampak dan melihat impact preview. Simpan mapping versi aturan per cakupan; jangan menimpa transaksi atau estimasi lama. Perubahan retroaktif membutuhkan alasan dan revisi laporan; tidak diperlakukan sebagai update harga master biasa.
- **CON-06:** periode boleh berjalan tanpa kontrak lengkap; modul estimasi menyatakan tidak tersedia. Operasional/keuangan tidak diblokir hanya karena konfigurasi kontrak belum selesai.

### 19.2 Primitive perhitungan R1

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
| `conditions`, `group_policy` | Leaf comparisons `eq/ne/lt/lte/gt/gte/between`; all/any maksimal2 tingkat grup, EXCLUSIVE/ADDITIVE |
| `dependencies` | ID rule/subtotal yang harus selesai; graph acyclic |
| `missing_policy` | `BLOCKED` atau `REQUIRE_MANUAL`; manual membutuhkan nilai dan persetujuan, bukan fallback nol |
| `no_match_policy` | `NOT_COVERED` atau default eksplisit yang disahkan; berbeda dari missing input |
| `rounding` | Precision/method/stage sebelum atau sesudah lookup/evaluasi yang dinyatakan |

Default batas konfigurasi usulan: maksimal200 rule per versi,1.000 baris lookup per tabel, dan50 predicate per rule. Pelanggaran ditolak dengan pesan batas; menaikkan limit memerlukan uji performa, bukan mengeksekusi ekspresi bebas. Tidak ada script, recursion, HTTP fetch, SQL, atau custom function dari owner. Formula matematika yang membutuhkan primitive baru masuk unsupported/penyesuaian manual dan antrean pengembangan.

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

### 20.1 Tiga layar/konsep berbeda

| Konsep | Sumber | Efek uang/buku |
|---|---|---|
| Estimasi/skenario | Data aktual sampai cutoff + asumsi owner + kontrak | Tidak memposting pendapatan, utang, atau kas |
| Settlement aktual | Dokumen PT yang dimasukkan/diverifikasi owner | Mengakui hak/kewajiban sesuai komponen; bukan otomatis pembayaran |
| Pencairan | Pembayaran nyata yang dicatat dan direkonsiliasi | Mengubah kas dan melunasi hak/kewajiban, bukan pendapatan kedua kali |

### 20.2 Estimasi

- **EST-01:** tipe `ACTUAL_TO_DATE`, `HARVEST_NOW_SCENARIO`, atau `END_OF_CYCLE_SCENARIO`. Nama tipe selalu tampil; ACTUAL_TO_DATE bukan proyeksi panen akhir.
- **EST-02:** proyeksi akhir memerlukan asumsi ekor/berat/umur panen, tambahan konsumsi/pembelian yang ditagihkan, harga pasar jika relevan, dan biaya owner yang belum terjadi (termasuk gaji). Owner dapat mengisi nilai/rentang; tidak ada prediksi AI tersembunyi pada R1.
- **EST-03:** semua asumsi diberi label, pembuat, waktu, dan satuan. Memakai harga kontrak PT lain sebagai pengganti tanpa persetujuan dilarang.
- **EST-04:** output menampilkan estimasi hasil kemitraan, estimasi biaya owner di luar settlement, estimasi laba manajerial, dan estimasi kas yang akan diterima bila komponen pencairan diketahui.
- **EST-05:** missing mandatory input menghasilkan daftar kekurangan. Boleh menampilkan subtotal diketahui, tetapi tidak sebagai total lengkap/angka pasti. Penyesuaian manual harus terlihat terpisah.
- **EST-06:** komparasi skenario tidak menyarankan waktu panen sebagai kepastian keuntungan; kendala kemitraan, kondisi ayam, serta kualitas asumsi tetap terlihat.

### 20.3 Settlement dan pengakuan

- **SET-01:** record settlement memuat periode, mitra, nomor dokumen, tanggal dokumen, label asli (RHPP/P4/lainnya), mata uang, lampiran, versi, status draft/verified/superseded, dan komponen.
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

- **SET-05:** jika hanya angka net pencairan diketahui, boleh dicatat sebagai tagihan/penerimaan settlement net yang belum direkonsiliasi. Tampilkan **“pendapatan rinci belum terverifikasi”**; jangan otomatis menganggapnya laba atau mengarang komponen untuk menutup selisih.
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
| Owner mengonfirmasi dana benar-benar diterima | Buat `payout_payment=POSTED` dengan akun penerima, tanggal aktual, nominal, referensi/bukti atau alasan tanpa bukti; kas naik, receivable berkurang melalui application. |
| Dana diterima sebelum dokumen diketahui | Kas naik melalui penerimaan mitra belum dipadankan/suspense; belum mengakui income periode. Saat dipadankan, reclass/application menutup suspense dan receivable, tidak membuat cash receipt kedua. |
| Pembayaran yang tercatat ternyata salah | Reversal tertaut mengembalikan application dan kas sesuai kenyataan koreksi. Gagal/void sebelum posted tidak memengaruhi kas. |

Status pelunasan hanya dihitung jika kewajiban/hak net telah diverifikasi: `UNPAID` jika application0, `PARTIAL` jika0<application<net due, `PAID` jika sisa0. Application yang sah memisahkan kas aktual dan offset nonkas yang disetujui; UI menampilkan berapa **uang diterima** dan berapa **diselesaikan nonkas**. Jika hak net belum diketahui, gunakan `UNRECONCILED`, bukan memilih unpaid/paid dari status aplikasi mitra. Offset baru tidak boleh dipakai menutup selisih tanpa komponen/bukti yang direkonsiliasi.

Rincian laba dan status penutupan keuangan memerlukan classification COMPLETE. Receipt net yang belum terklasifikasi tetap dapat dicatat untuk menjaga saldo kas benar, tetapi bukan alasan menyatakan laba sudah final. Mapping cost coverage mengikuti COST-11; menyebut invoice di settlement tanpa menurunkan net income tidak otomatis membuat coverage.

<a id="s21"></a>
## 21. UX mobile-first, navigasi, dan layar minimum

### 21.1 Prinsip tampilan

- **UX-01:** layar ponsel menjadi desain utama, bukan tabel desktop yang diperkecil. Navigasi bawah maksimal lima tujuan utama; detail bertahap.
- **UX-02:** header selalu menjelaskan ruang usaha/pribadi, kandang, bangunan bila relevan, dan periode/tanggal. Sebelum simpan, konteks terlihat; berpindah scope tidak diam-diam mengalihkan draft.
- **UX-03:** angka, satuan, dan status lebih utama dari dekorasi. Warna punya makna dan disertai teks/ikon. Tidak menggunakan grafik/gauge kosong untuk membuat dashboard tampak lengkap.
- **UX-04:** angka jumlah/nominal tidak diisi dari kebiasaan sebagai fakta. Boleh menyarankan kategori/barang terakhir dengan konfirmasi. Tanggal otomatis dapat diubah, dengan penanda jika bukan hari ini.
- **UX-05:** pesan berhasil harus spesifik: “Tersimpan di HP, belum terkirim”, “Diterima server, menunggu pemeriksaan”, atau “Disetujui”. Jangan hanya satu tanda centang untuk semua status.
- **UX-06:** input angka memakai keyboard numerik yang sesuai locale; tetap bisa paste/edit dan diakses pembaca layar. Keypad khusus bukan kewajiban jika native input lebih mudah digunakan.
- **UX-07:** target sentuh minimal 44×44 CSS px, target utama 48×48; teks utama minimal 16 px usulan. Kontras target WCAG AA, label bukan placeholder saja, error dekat field, navigasi keyboard/focus jelas.
- **UX-08:** rancangan diuji pada lebar 360, 390, 768, dan 1280 CSS px; tidak ada horizontal scroll halaman utama. Tabel kompleks memakai detail/baris adaptif atau scroll di kontainer berlabel.

### 21.2 Navigasi usulan

| Peran | Navigasi utama |
|---|---|
| Owner | Ringkasan · Kandang · Transaksi · Laporan · Lainnya |
| ABK | Hari Ini · Catat · Kas Saya · Pekerjaan · Akun |
| Mandor | Ringkasan Tugas · Catat · Kandang · Pekerjaan · Akun |
| PPL | Kandang Undangan · Kunjungan · Tindak Lanjut · Akun |
| Administrator | Tenant · Limit/Layanan · Audit Administrasi · Akun |

Di ABK, rincian gaji/kasbon sendiri berada pada “Akun/Keuangan Saya” dengan bagian terpisah dari “Kas Saya” yang berarti uang usaha. Uji istilah agar kas pegangan tidak disalahartikan sebagai uang milik ABK.

### 21.3 Layar minimum dan aksi utama

| ID | Layar | Informasi/aksi wajib |
|---|---|---|
| SCR-01 | Login dan pemilih ruang | Identitas, undangan, tenant berhak, last sync, offline availability; tidak membocorkan nama tenant yang tidak berhak |
| SCR-02 | Beranda Owner | Kartu kandang/periode, biaya berjalan, kas, tugas/perhatian, kelengkapan dan timestamp data |
| SCR-03 | Detail periode | Tab Ringkasan, Operasional, Keuangan, Produksi/Panen opsional, Kontrak/Estimasi opsional, Riwayat |
| SCR-04 | Beranda ABK | Penugasan, tindakan Catat Belanja/Pakai Barang/Laporkan Kejadian, tugas hari ini, antrean sinkron; tidak dipaksa mengisi produksi |
| SCR-05 | Catat belanja | Tanggal, konteks, barang/kategori, nominal, siapa membayar, bukti, alokasi sederhana; rincian lanjutan bertahap |
| SCR-06 | Kas pegangan | Saldo tercatat, belanja belum diperiksa, perkiraan uang di tangan, transfer masuk/keluar, pertanggungjawaban |
| SCR-07 | Pemeriksaan Owner | Daftar pengajuan, bukti, saldo terkait, approve/correction/reject, alasan; penolakan menjelaskan penyelesaian klaim kas |
| SCR-08 | Stok/gas | Kuantitas per item/lokasi, penerimaan, pindah lokasi, pemakaian, opname; pemisahan isi gas dan tabung |
| SCR-09 | Gaji periode | Agreement, kasbon diterapkan, pembayaran, sisa, slip; tanpa komponen upah pekerjaan |
| SCR-10 | Kasbon/pinjaman | Jenis, kreditur, tujuan periode, pencairan, pembayaran/offset, sisa; tidak bercampur kas belanja |
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
- Pemakaian barang konflik stok menampilkan isi laporan dan opsi koreksi, tidak menghapus form.
- Tombol approve/finalize saat offline disabled dengan alasan, bukan pura-pura sukses.

Mode gelap dapat ditambahkan setelah uji keterbacaan; bukan syarat utama R1 dan bukan pengganti kontras yang benar.

<a id="s22"></a>
## 22. Offline, sinkronisasi, lampiran, dan konflik

### 22.1 Batas aksi offline

| Aksi | Offline R1 | Saat kembali online |
|---|---|---|
| Membaca scope tugas terakhir tersimpan | Ya, dengan waktu data dan masa izin | Refresh izin/data |
| Draft/ajukan belanja, pemakaian barang, pekerjaan, recording, panen, kunjungan | Ya dalam scope cached dan izin belum kedaluwarsa | Validasi izin, status periode, versi, stok/populasi, dan efek finansial |
| Mengambil foto bukti | Ya jika ruang lokal cukup | Upload terpisah setelah metadata diterima |
| Menyetujui/menolak finansial, mencairkan kasbon, melakukan posting pembayaran | Tidak | Memerlukan server dan validasi atomik |
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
- **OFF-07:** konflik edit memakai optimistic concurrency (expected version). Tidak menggunakan last-write-wins untuk uang, stok, panen, gaji, atau kontrak. Tampilkan versi server dan perubahan lokal; reviewer memilih koreksi yang menghasilkan audit baru.
- **OFF-08:** event tambahan yang independen dapat digabung, tetapi validasi batas stok/populasi dijalankan lagi secara atomik. Dua ponsel tidak boleh bersama-sama memanen lebih dari jumlah ayam tersedia.
- **OFF-09:** offline lifetime usulan 72 jam sejak izin terakhir diverifikasi. Setelah itu, akses protected/write baru dikunci sampai reauth online; antrean lama tetap tersimpan. User melihat alasan keamanan, bukan data hilang.
- **OFF-10:** logout selalu tersedia. Jika ada antrean, tawarkan sinkron saat online, kembali ke aplikasi, atau keluar dengan antrean terkunci pada identitas yang sama. Penghapusan lokal memerlukan konfirmasi eksplisit risiko kehilangan; tidak diam-diam purge antrean saat logout/update.
- **OFF-11:** sinkronisasi dicoba saat aplikasi dibuka/koneksi pulih dan via tombol “Coba kirim lagi”. Background Sync adalah enhancement, bukan satu-satunya jalur. Browser/OS dapat menunda background work; tidak ada jaminan pengiriman saat aplikasi tertutup.
- **OFF-12:** request persistent storage bila didukung, pantau quota, dan tampilkan peringatan antrean lama/ruang menipis. Penghapusan data browser, uninstall, perangkat rusak/hilang tetap dapat menghilangkan data yang belum terkirim. Jangan menjanjikan “data tidak pernah hilang”.
- **OFF-13:** update web/versi skema lokal harus memigrasikan draft/antrean dan mempertahankan dukungan payload lama selama masa transisi yang ditetapkan ADR. Versi tidak kompatibel masuk kondisi update-required tanpa membuang payload.
- **OFF-14:** waktu HP tidak dipercaya sebagai waktu posting. Selisih jam besar ditandai; tanggal kejadian yang dimasukkan tetap dapat ditinjau, bukan diganti diam-diam dengan tanggal kirim.

### 22.3 Lampiran

- **OFF-15:** metadata transaksi dikirim lebih dahulu; file mempunyai status local/pending/uploaded/failed terpisah. UI memungkinkan retry foto tanpa menggandakan transaksi.
- Default usulan foto JPEG/PNG/WebP, dokumen PDF; batas 10 MB per file, 5 file per transaksi. Kompres foto sambil menjaga keterbacaan nota; PDF tidak diubah tanpa kebutuhan.
- Validasi MIME dan isi, sanitize nama, hapus EXIF lokasi dari salinan untuk penayangan, scan file bila layanan mendukung; file belum lolos pemeriksaan tidak ditayangkan sebagai konten aktif.
- Object storage privat; URL akses berumur pendek dan baru dibuat setelah otorisasi. Jangan memasukkan link permanen publik ke notifikasi.
- Perangkat lain tidak melihat foto sampai upload selesai; dokumen tetap menampilkan bahwa bukti tertunda. Owner dapat menunda approval bila kebijakan bukti mewajibkannya.

<a id="s23"></a>
## 23. Notifikasi dan pusat perhatian

- **NOT-01:** inbox server adalah sumber notifikasi, push hanya kanal pengantar. Membaca push tidak sama dengan menyetujui dokumen.
- **NOT-02:** R1 memuat pengajuan perlu review, stok di bawah ambang yang dikonfigurasi, task jatuh tempo, klaim kas belum selesai, gaji/upah siap ditinjau, serta kelengkapan data/konflik.
- **NOT-03:** peringatan produksi hanya jika recording aktif dan data cukup; ambang per owner/standar harus diatur. Tidak ada alert medis berbasis angka tebakan.
- **NOT-04:** tidak menuduh ABK belum mencatat hanya karena server belum menerima data. Pesan “belum ada data terkirim” dan waktu terakhir sinkron lebih tepat.
- **NOT-05:** event ID dan penerima dipakai untuk dedupe notifikasi. Retry worker tidak mengirim rangkaian pesan yang sama. User dapat memilih jenis nonkritis dan jam tenang.
- **NOT-06:** jangan menaruh nominal kasbon, gaji, atau keuangan pribadi di lock screen secara default. Tautan membuka objek setelah login serta otorisasi ulang.
- **NOT-07:** notifikasi hanya untuk scope yang masih diizinkan saat pengiriman. PPL yang dicabut tidak boleh menerima notifikasi owner tersebut berikutnya.
- **NOT-08:** kelak push web memerlukan browser yang mendukung/izin; push Android memerlukan konfigurasi native/FCM dan izin OS. Keduanya best-effort, bukan jaminan alarm keselamatan real-time.

<a id="s24"></a>
## 24. Dashboard, laporan, pencarian, dan ekspor

| ID | Laporan/tampilan | Isi wajib |
|---|---|---|
| REP-01 | Dashboard lintas kandang | Periode fisik aktif/masa kosong, biaya tercatat, kas/perhatian, freshness; drill-down tanpa data owner lain |
| REP-02 | Dashboard periode | DOC, bangunan, umur, biaya langsung/bagi, klaim belum review, stok, gaji/upah, estimasi/aktual bila tersedia |
| REP-03 | Buku kas | Saldo awal, cash movement menurut payment date, transfer terpisah, saldo akhir; filter akun/pemegang |
| REP-04 | Biaya periode/kategori | Sumber biaya, tanggal pengakuan, allocation, status, belum dialokasikan; bukan cash out total |
| REP-05 | Pertanggungjawaban ABK | Dana masuk, belanja posted, klaim belum selesai, pengembalian, saldo buku/fisik; bukan saldo gaji |
| REP-06 | Gaji dan kasbon | Agreement, hak bruto, advance/offset, pembayaran, sisa, pinjaman lintas periode; per-user privacy |
| REP-07 | Upah pekerjaan | Pekerjaan/unit/tarif, biaya diakui, pembayaran, sisa; terpisah dari slip gaji |
| REP-08 | Persediaan/gas | Opening/receipt/mutation/use/return/closing, nilai untuk role berhak, metode nominal/terukur, selisih opname |
| REP-09 | Produksi dan panen | Sumber data, cutoff, ekor/kg, per-bangunan bila tersedia, metrik aktual/estimasi dan missing data |
| REP-10 | Kemitraan | Kontrak/version, estimasi, settlement aktual, selisih, tabungan/piutang/utang, payout yang sudah/belum cair |
| REP-11 | Hasil manajerial | Penghasilan kemitraan + sampingan - biaya owner yang tidak sudah masuk settlement, kelengkapan, exclusion seperti depresiasi |
| REP-12 | Pribadi | Saldo, arus uang, biaya pribadi, pinjaman, transfer usaha, hanya owner-user |
| REP-13 | Riwayat audit | Siapa, kapan, objek, aksi, alasan, revision; sesuai izin dan scope |

- **REP-14:** setiap laporan memuat filter, zona waktu, periode/tanggal, basis kas/biaya, waktu dibuat, versi jika snapshot, dan status provisional/final. Default antarhalaman harus konsisten.
- **REP-15:** export CSV untuk data tabular dan PDF ringkasan/slip memakai dataset/otorisasi yang sama dengan layar. Tidak boleh mengekspor field tersembunyi. Escape CSV formula injection untuk nilai yang dapat dieksekusi spreadsheet.
- **REP-16:** ekspor besar diproses background dengan status pending/ready/failed; file privat dan masa unduh terbatas. Nilai filter dibekukan pada request; download memeriksa akses yang masih berlaku.
- **REP-17:** pencarian/filter mencakup kandang, bangunan, periode, kategori, pihak, tanggal, status, pemegang kas, dan nomor dokumen sesuai modul. Pagination server, tidak memuat semua tenant ke browser.
- **REP-18:** agregasi uang menjumlah ledger terotorisasi, bukan nilai kartu UI yang mungkin ter-cache berbeda waktu. Tidak merata-ratakan persen atau FCR tanpa basis pembobot yang valid.

<a id="s25"></a>
## 25. Model data logis dan kontrak layanan

Ini kamus logis, bukan DDL yang memaksa satu ORM. Developer wajib mempertahankan relasi, invariant, serta makna; nama tabel dapat mengikuti stack setelah ADR.

### 25.1 Entitas minimum

| Grup/entitas | Field dan hubungan kritis |
|---|---|
| User, tenant, membership, grant | user identity, primary owner, role/capability, scope kandang/bangunan, active/revoked timestamps |
| Farm, building, stock location | tenant, zona waktu, kapasitas, status, lokasi; building selalu milik farm yang sama dengan transaksi |
| Employee, assignment | identitas minimum, login opsional, scope penugasan, effective dates; histori tetap saat nonaktif |
| Cycle, building allocation | farm, `physical_status` dan `financial_status` terpisah, chick-in, age basis, DOC, capacity snapshot, source mode |
| Counterparty, partner | tenant-private identity, supplier/broker/mitra/owner/employee role; rekening sensitif terpisah |
| Business account, cash movement | account owner/custodian, currency, opening balance, transfer pair, value date, source document |
| Purchase/expense, line, payment, cash claim | supplier, event date, recognition class, qty/rate, payer, approval, posting, actual claim, installments |
| Cost entry, allocation plan/line, settlement coverage | source effect, recognized date, amount, farm/cycle/building target, driver snapshot, unallocated remainder, coverage link/amount ke komponen settlement |
| Receivable/payable, settlement application | creditor/debtor, source, principal, type, settled amount, payment/offset references |
| Item, ownership pool, stock movement, gas use session | SKU, units, source, from/to location, qty, valuation sequence/value/status, pending cost source, consumption source reference, remaining gas/cutoff method |
| Salary agreement, salary settlement, cost allocation | employee, cycle, agreed/final gross, advances/loan applications, wages paid, remaining; allocation references memakai COST-04/05 dan total tidak menduplikasi gross |
| Advance/loan, disbursement, application | type, creditor space/user/tenant, borrower, target salary, balance, consent, conversion history |
| Work compensation, payment | task reference, worker, date, qty/unit/rate snapshot, approval, cycle allocation, separate payment |
| Private account/transaction, cross-space link | owner_user_id, private category, balance, related business pair, no broad tenant read |
| Task, asset, maintenance, visit, operational note | scope, assignment, due/completed, cost link, visitor versus entered_by, recommendation follow-up, visibility INTERNAL/PPL_VISIBLE untuk catatan/task/visit nonfinansial |
| Production event, recording authority, summary snapshot, sampling | building/farm scope, metric, coverage/cutoff, source, lineage, authority version, completeness, values/units, revision, superseded relation |
| Harvest DO, trip, ticket, allocation | vehicle, driver, broker, event time, DO link, heads/net kg, building breakdown, measured/unknown weight |
| Contract version, rule, lookup table | ownership, validity, primitive, typed input/output, intervals, dependencies, rounding, immutable snapshot |
| Calculation run, scenario | engine version, input snapshots, assumptions, matched rules, intermediates, warnings, results |
| Partner settlement, component, payout notice/payment/application | period, external reference, version, document/classification status, income vs asset/liability vs cash, net receivable/payable, suspense dan payment links |
| Command receipt | data space, command type, operation ID unik, payload hash, actor, status, object/effect IDs, timestamps; durable bersama effects |
| Attachment, audit, notification, outbox receipt | scope, parent object ref/ACL inheritance, private storage key, status/version, actor, request/operation IDs |

### 25.2 Constraint lintas entitas

- **MOD-01:** semua entitas bisnis tenant-scoped; FK/validasi harus mencegah line tenant A merujuk header/akun/item tenant B. Keuangan pribadi owner-scoped; jangan membuat baris tanpa scope lalu mengandalkan UI.
- **MOD-02:** state dan saldo berasal dari transaksi sah; tidak boleh hanya menyimpan angka total yang bebas diedit tanpa mutasi sumber.
- **MOD-03:** rekonsiliasi harus dapat memeriksa `source amount = allocated + unallocated`, `opening + deltas = closing`, `obligation = valid settlements + remaining`.
- **MOD-04:** satu cost source effect, application kasbon, dan payment allocation mempunyai uniqueness/idempotency yang mencegah double posting.
- **MOD-05:** optimistic lock version disertakan pada record mutable; immutable records memakai correction reference. Index minimal tenant+scope+date/status dan foreign keys yang diperlukan untuk laporan.
- **MOD-06:** lampiran, export, dan notification merujuk objek dengan scope yang sama. Lampiran, revisi, dan histori mewarisi ACL/visibility parent di server; tidak mempunyai override yang memperluas akses. `PPL_VISIBLE` tidak tersedia pada objek finansial. Lampiran draft tanpa parent final hanya dapat dilihat pembuat yang berhak sampai linkage disahkan. Resource ID yang ditebak tidak boleh mengungkap keberadaan objek tenant lain.

### 25.3 Kontrak layanan minimum, tanpa mengunci path API

Setiap command mutation wajib menerima konteks scope yang tervalidasi, operation/idempotency key, expected version bila relevan, serta payload bertipe. Server mengambil aktor dari sesi, bukan field client.

Hasil command minimal: object ID, versi/status authoritative, server timestamp, posting references bila ada, dan warning terstruktur. Error minimal:

| Kode semantik | Perilaku UI |
|---|---|
| `UNAUTHENTICATED` | Reauth tanpa membuang draft |
| `FORBIDDEN_SCOPE` | Tidak retry terus; antrean tetap aman untuk review, tidak membocorkan data tujuan |
| `VERSION_CONFLICT` | Perlihatkan perubahan yang boleh dilihat dan opsi resolusi |
| `PERIOD_LOCKED` | Ajukan koreksi kepada owner, bukan mengubah periode otomatis |
| `INSUFFICIENT_STOCK/POPULATION/CASH` | Tampilkan data server dan laporan lokal; butuh rekonsiliasi |
| `VALIDATION_ERROR` | Field dan alasan spesifik; contoh unit/rentang yang benar |
| `IDEMPOTENCY_PAYLOAD_MISMATCH` | Tidak membuat transaksi baru; minta operation baru untuk revisi |
| `DEPENDENCY_PENDING` | Tunda child sampai parent diterima |
| `RATE_LIMITED/TEMPORARY_FAILURE` | Retry backoff dengan ID sama; jangan menyatakan sukses |

Response harus membedakan request diterima, dokumen submitted, dan efek finansial posted. Jangan menggunakan HTTP success sebagai bukti pembayaran nyata.

<a id="s26"></a>
## 26. Arsitektur, kesiapan Android, IoT, dan CCTV

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
| NFR-03 | Dataset kapasitas awal | Benchmark sintetis 50 tenant × 10 kandang × 4 bangunan, 1 juta financial/stock effect rows total, 100 sesi aktif bersamaan. Ini skenario uji, bukan estimasi pelanggan. |
| NFR-04 | Offline | Uji 72 jam penggunaan berizin, ≥1.000 operasi teks antre, restart browser/perangkat, dan antrean bertahan 7 hari walau UI terkunci setelah izin habis. |
| NFR-05 | First-use UI | Target LCP ≤2,5 detik pada profil mobile/jaringan uji yang dicatat; screen cached/form lokal tetap responsif tanpa menunggu server. |
| NFR-06 | Backup/restore | Target pilot produksi RPO ≤24 jam, RTO ≤8 jam; verifikasi restore ke lingkungan terisolasi. SLA komersial dan target lebih ketat perlu keputusan sebelum penjualan luas. |
| NFR-07 | Data correctness | Golden tests dan invariants seluruhnya lulus; tidak boleh ada toleransi selisih rupiah kecuali rounding yang dinyatakan. |
| NFR-08 | Observability | Request ID, latency, failure, queue age, conflict count, backup status; tanpa isi nota pribadi/token/password dalam log. |
| NFR-09 | Accessibility | Uji keyboard, pembaca layar untuk form inti, fokus dialog, kontras, label error, zoom 200%, dan target sentuh. |
| NFR-10 | Recovery | Worker/API restart tidak menyebabkan efek ganda; job failure terlihat dan dapat di-retry aman. |

### 27.1 Kontrol keamanan minimum

- **SEC-06:** HTTPS, password hashing standar jika memakai password, session expiry/refresh yang aman, logout/revoke, rate limiting login, proteksi CSRF bila cookie auth, dan sanitasi XSS. Penyimpanan token jangka panjang di browser harus melalui threat model, bukan dipilih karena paling mudah.
- **SEC-07:** operasi sensitif seperti perubahan owner, grant finansial, ekspor besar, dan perubahan kontrak memerlukan reauth/step-up sesuai ADR. Admin platform memerlukan MFA sebelum produksi.
- **SEC-08:** token/kredensial dalam secret store/environment sesuai platform, tidak dalam repositori, log, snapshot kontrak, atau file PRD.
- **SEC-09:** uji BOLA/IDOR dengan resource ID tenant lain, multi-membership, file URL, export job, API list/detail/update, WebSocket/push bila ada, dan cache offline.
- **SEC-10:** backup dan storage dilindungi dengan kontrol akses serta enkripsi layanan. Enkripsi at rest bukan alasan mengendurkan RBAC.
- **SEC-11:** retensi audit, lampiran, data pribadi, dan prosedur penghapusan/anonimisasi memerlukan kebijakan Q-11. Sampai disetujui, tidak ada purge otomatis data finansial posted atau publikasi lampiran. Soft-delete bukan jaminan pemenuhan hukum privasi.
- **SEC-12:** ekspor snapshot untuk review memakai data sintetis atau disamarkan. Lampiran pengguna dalam diskusi tidak dimasukkan ke repository source, sample data, atau PR publik.

<a id="s28"></a>
## 28. Contoh hitungan wajib/golden test

Semua contoh berdiri sendiri kecuali dinyatakan berurutan. Nilai adalah fixture sintetis, bukan tarif mitra/ketentuan hukum. Developer wajib mengubahnya menjadi unit/integration tests dengan decimal arithmetic.

### GOLD-01 — Uang pegangan dan pertanggungjawaban

- Kas usaha Rp2.000.000; pegangan ABK Rp0.
- Transfer Rp1.000.000 ke ABK: kas usaha Rp1.000.000; pegangan Rp1.000.000; biaya Rp0.
- ABK melaporkan belanja jasa Rp300.000 sudah dibayar: sebelum review saldo tercatat pegangan Rp1.000.000, klaim Rp300.000, perkiraan fisik Rp700.000.
- Setelah disetujui: saldo pegangan Rp700.000, klaim Rp0, biaya jasa Rp300.000.
- ABK mengembalikan Rp200.000: kas usaha Rp1.200.000; pegangan Rp500.000; biaya tetap Rp300.000.
- Total kas akhir Rp1.700.000. Transfer/pengembalian bukan pendapatan/biaya.

### GOLD-02 — Reimbursement dan pembelian kredit

- ABK membayar jasa kandang Rp150.000 dengan uang pribadi, disetujui owner.
- Biaya Rp150.000; utang reimbursement Rp150.000; kas usaha belum berubah.
- Dibayar Rp100.000 lalu Rp50.000: biaya tetap Rp150.000, utang akhir Rp0, kas usaha total turun Rp150.000.
- Pembelian jasa kredit toko Rp400.000 yang sudah selesai juga mengakui biaya Rp400.000 dan utang Rp400.000; saat dibayar, biaya tidak bertambah lagi.

### GOLD-03 — Gas dibeli dan dipakai lintas periode

- Beli 20 unit isi ulang gas, Rp200.000/unit; unit dasar contoh adalah unit isi ulang, bukan tabung aset.
- Saat diterima: nilai stok Rp4.000.000; jika dibayar kas turun Rp4.000.000; biaya pemakaian Rp0.
- Periode A memakai 12 unit: biaya A Rp2.400.000; stok 8 unit senilai Rp1.600.000.
- Periode B memakai 8 unit: biaya B Rp1.600.000; stok Rp0.
- Total biaya dua periode Rp4.000.000, bukan Rp8.000.000. Pemindahan lokasi sebelum consumption tidak membuat biaya.

### GOLD-04 — Moving weighted average

- Stok 10 unit @Rp100.000 = Rp1.000.000.
- Terima 10 unit @Rp120.000 = Rp1.200.000.
- Sebelum pemakaian: 20 unit, Rp2.200.000; rate rata-rata Rp110.000.
- Pakai 5 unit: biaya Rp550.000; stok 15 unit, Rp1.650.000.
- Perubahan harga master menjadi Rp130.000 tidak mengubah issue Rp550.000 yang sudah posted.

### GOLD-05 — Gaji periode dan upah pekerjaan tidak tercampur

- Gaji final periode Rp3.000.000; advance gaji yang sudah dicairkan Rp1.000.000.
- Apply advance: sisa hak gaji Rp2.000.000. Biaya gaji Rp3.000.000.
- Pelunasan gaji Rp2.000.000: sisa gaji Rp0; biaya tetap Rp3.000.000.
- Pekerjaan kemas kotoran 100 karung × Rp2.000 = Rp200.000, disetujui dan dibayar tersendiri.
- Slip gaji tidak memuat Rp200.000 itu. Laporan biaya tenaga kerja boleh menampilkan Rp3.200.000 dengan dua baris.
- Total kas keluar advance+pelunasan+pekerjaan Rp3.200.000, bukan Rp4.200.000.

### GOLD-06 — Kasbon lebih besar dari hak

- Gaji final Rp1.500.000; saldo advance Rp1.800.000.
- Application maksimal Rp1.500.000; sisa gaji Rp0; advance belum terselesaikan Rp300.000.
- Tidak membuat pembayaran gaji -Rp300.000. Tidak memotong upah pekerjaan Rp200.000 secara otomatis.
- Carry/konversi Rp300.000 membutuhkan keputusan baru yang tercatat.

### GOLD-07 — Alokasi biaya bersama dan sisa pembulatan

- Biaya Rp1.000.001 dibagi sama rata ke tiga periode dengan urutan alokasi A, B, C.
- A Rp333.334; B Rp333.334; C menerima sisa Rp333.333.
- Total tepat Rp1.000.001. Biaya sumber tetap satu.
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

- Owner memindah Rp5.000.000 dari rekening pribadi ke kas usaha sebagai modal.
- Kas usaha +Rp5.000.000; kontribusi owner +Rp5.000.000; pendapatan usaha Rp0.
- Owner menarik Rp500.000 untuk kebutuhan pribadi: kas usaha -Rp500.000; penarikan owner Rp500.000; biaya kandang Rp0.
- Rekap pribadi tidak boleh dapat diunduh ABK/PPL/admin.

### GOLD-14 — Retry, konflik, dan periode terkunci

- Operasi belanja ID `op-demo-001`, Rp100.000 dikirim lima kali dengan payload sama → tepat satu dokumen dan satu efek uang/biaya.
- ID sama dengan payload Rp200.000 → mismatch error, bukan update tersembunyi.
- Dua perangkat masing-masing memakai7 unit dari stok10 → hanya satu dapat posted penuh; yang lain konflik, tidak menjadi stok -4.
- Draft biaya periode A tiba setelah A locked → tidak mengubah snapshot; masuk jalur review koreksi.

### GOLD-15 — Pinjaman owner pribadi melalui potongan gaji

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

### GOLD-18 — Gas parsial dan biaya sudah tercakup settlement

- Satu isi gas bernilaiRp200.000. Cutoff A: sisa0,40 disetujui sebagai estimasi → consumption A0,60 bernilaiRp120.000, inventory0,40 bernilaiRp80.000.
- Saat habis pada B, consumption hanya0,40 bernilaiRp80.000. Total biaya tetapRp200.000.
- Contoh coverage terpisah: biaya gas periodeRp1.000.000, coverage terverifikasi dalam penghasilan net PT Rp400.000 → biaya di luar settlement **Rp600.000**; biaya operasional yang dilaporkan tetapRp1.000.000.
- Jika PT menambah reimburseRp400.000 (bukan mengurangi net), coverage **Rp0** dan biaya di luar settlement **Rp1.000.000**.

### GOLD-19 — Stok awal belum bernilai

- Opening10 unit, nilai belum diketahui → stok10 dengan valuation PENDING, bukanRp0.
- Terpakai4 unit → fisik tersisa6, pending cost4 unit; biaya belum diketahui, lock periode pemakai ditolak.
- Owner menetapkan opening value Rp1.000.000 sebelum ada valued effects yang terdampak → backfill pending issue4unit menjadiRp400.000, nilai sisaRp600.000.
- Kirim command valuation ulang → biaya tetapRp400.000, tidak menjadiRp800.000.

### GOLD-20 — Payout notice versus uang masuk

- Dokumen net due Rp10.000.000 telah diverifikasi, klasifikasi pendapatan masih PENDING → receivable net10juta, cash0, status unpaid; bukan laba final.
- PT memberi kabar akan transfer6juta → cash tetap0, receivable10juta.
- Owner mengonfirmasi penerimaan6juta → cash+6juta, receivable4juta, status partial. Salin status eksternal “Awaiting” tidak membalik transaksi ini.
- Penerimaan tersisa4juta → cash kumulatif10juta, receivable0, status paid; classification tetap PENDING sampai rincian direkonsiliasi, sehingga financial lock masih ditolak.

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
| AC-07 | Kapasitas7.000, DOC6.500 → aktifkan → populasi6.500 dan kapasitas tetap7.000. Alokasi total berbeda dari N0 ditolak. | CYC-02, CYC-04 |
| AC-08 | Periode belum dibuat → catat biaya masa kosong → tersimpan tanpa dipaksa ke periode lama/berikutnya. | COST-03 |
| AC-09 | Transfer kas ke ABK lalu belanja/pengembalian → jalankan GOLD-01 → saldo dan biaya sama persis. | CASH-02, FIN-10 |
| AC-10 | Belanja nyata menunggu review → owner reject kategori → klaim uang keluar tetap terlihat sampai direkonsiliasi, tidak otomatis pulih atau potong gaji. | FIN-10 |
| AC-11 | Belanja ABK ditalangi/kredit → bayar dua kali sebagian → utang berkurang, biaya tidak bertambah; GOLD-02. | CASH-07, CASH-08 |
| AC-12 | Dokumen approved belum dibayar → buka laporan → biaya/utang ada, cash movement belum ada. | FIN-02, COST-01 |
| AC-13 | Owner membayar toko langsung → simpan → tidak menambah/mengurangi kas pegangan fiktif. | CASH-06 |
| AC-14 | Uang muka supplier tanpa barang → simpan → bukan stok diterima/biaya; setelah penerimaan, taut aplikasi uang muka sekali. | CASH-09 |
| AC-15 | Transaksi posted → edit nilai → ditolak; reversal+replacement beralasan menghasilkan histori dan total benar. | FIN-03, FIN-09 |
| AC-16 | Belanja invoice100, pembayaran total110 tanpa klasifikasi → submit → ditolak; kelebihan harus menjadi advance/piutang eksplisit. | FIN-06 |
| AC-17 | Satu biaya dibagi tiga periode → alokasikan → total tetap sama dengan sumber, remainder jelas; GOLD-07. | COST-04, COST-05 |
| AC-18 | Beli stok, pindah lokasi, pakai → jalankan GOLD-03/04 → hanya consumption menambah biaya dan stok tidak negatif. | INV-05, INV-08, INV-13 |
| AC-19 | Pakan/gas unit berbeda → input → konversi menurut SKU snapshot, bukan50kg/sak universal. | DATA-04, INV-01 |
| AC-20 | Stok fisik selisih → opname → tidak mengubah saldo sebelum adjustment owner; jejak selisih tersimpan. | INV-12 |
| AC-21 | Master harga berubah → lihat consumption/gaji/upah/kontrak lama → histori tetap nilai semula. | DATA-08, PAY-12, CON-04 |
| AC-22 | Gaji per periode dan job tambahan → GOLD-05 → slip gaji hanya3juta, job200ribu terpisah, laporan3,2juta. | PAY-04, PAY-14, PAY-15 |
| AC-23 | Advance melebihi gaji → GOLD-06 → tidak ada net pay negatif atau auto-cut job; saldo belum selesai terlihat. | PAY-08, PAY-09, PAY-10 |
| AC-24 | Apply kasbon dikirim ulang → hanya satu application, saldo loan/advance dan payroll konsisten. | PAY-08, MOD-04 |
| AC-25 | Dua pembayaran fisik digabung transfer → alokasikan ke gaji dan job → dokumen/slip tetap terpisah, cash total tepat. | PAY-14 |
| AC-26 | Karyawan nonaktif dengan utang/upah → arsipkan → sisa tetap dapat diselesaikan owner, login tidak memberi akses baru. | PAY-06, SEC-02 |
| AC-27 | Pinjaman pribadi dipotong gaji → GOLD-15 → kewajiban usaha ke owner ada sampai dibayar; no extra cost/income. | PER-04, PAY-08 |
| AC-28 | Modal/prive → GOLD-13 → tidak masuk omzet/biaya kandang; user tidak berhak gagal membaca private data. | PER-02, PER-03 |
| AC-29 | Recording OFF/kontrak kosong → ABK mencatat belanja → berhasil; dashboard metrik menyatakan unavailable. | REC-01, CON-06 |
| AC-30 | Rekap kumulatif dan detail overlap → GOLD-16 → tidak double count, sumber authoritative jelas. | REC-02, REC-03 |
| AC-31 | Sample belum ada atau stale → dashboard → bukan FCR0 atau status aman; timestamp/alasan terlihat. | DATA-07, MET-11, UX-09 |
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
| AC-46 | Payload sama retry5x dan concurrent stock use → GOLD-14 → idempotent dan satu konflik, tidak stok negatif. | FIN-05, OFF-08 |
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
| AC-65 | Ada pending gaji/claim/valuation/settlement classification → minta lock → ditolak dengan daftar; utang yang nilainya final tetapi belum lunas tidak memblokir. | CYC-11, INV-14, SET-11 |
| AC-66 | Gas parsial dan cakupan biaya PT → GOLD-18 → stok dan biaya total konsisten, coverage tidak dianggap sama dengan reimburse penambah income. | INV-15, COST-11 |
| AC-67 | Opening stock hanya kuantitas → GOLD-19 → consumption pending cost, backfill nilai sekali tanpa silent repricing histori valued. | INV-14, FIN-12 |
| AC-68 | Net settlement/payout notice/uang diterima → GOLD-20 → status kas/piutang/penghasilan terpisah; classification pending memblokir final income. | SET-11, CYC-11 |
| AC-69 | PPL membaca task/internal note/nota → hanya task PPL_VISIBLE di grant sah terlihat, nota dan field uang tetap tertutup pada API/file/export. | SEC-05, OPS-05 |
| AC-70 | Kontrak enum unsupported, predicate terlalu dalam, atau sumber metrik salah → validasi → ditolak/require manual yang disahkan; tidak menjalankan ekspresi bebas atau fallback nol. | CON-20, CON-22 |
| AC-71 | Command crash sebelum commit lalu retry, atau commit lalu izin dicabut → rollback/replay aman; actor asli hanya mendapat acknowledgement minimal bila masih terautentikasi, client tidak membuat operation baru untuk kejadian yang hasilnya belum diketahui. | FIN-05, FIN-12, OFF-06 |

### 29.1 Jenis pengujian wajib

- Unit: decimal, rounding, allocation, FCR/IP, rule engine, state transition.
- Integration: atomic posting/reversal, constraint tenant/FK, optimistic lock, idempotency, payout/offset.
- E2E mobile: tiap peran, offline/reconnect/restart, form error, photo retry, approval, period close.
- Security: daftar/detail/search/export/file, scope switching, tenant disable, revoked grants.
- Property/invariant: total alokasi, stok tidak negatif, saldo ledger, outstanding tidak negatif, sumber efek unik.
- UAT: owner dan ABK nyata dengan data sintetis/izin eksplisit, setidaknya alur belanja, kasbon/gaji, job tambahan, gas, dashboard.
- Uji APK/push/sensor/CCTV tidak dianggap lulus dari web test; baru ditambahkan ketika rilis terkait dibangun.

<a id="s30"></a>
## 30. Urutan pengembangan dan Definition of Done

### 30.1 Milestone implementasi usulan

| Milestone | Output | Exit gate |
|---|---|---|
| M0 — keputusan dan desain | Approve Q blocking, ADR stack, wireframe inti, model threat/permission, API/data contract | Tidak ada makna uang/gaji yang ambigu untuk modul pertama |
| M1 — fondasi | Tenant/auth/RBAC, kandang/bangunan/period, audit, akun dana, local queue skeleton | AC-01 sampai AC-08 serta tenant isolation lulus |
| M2 — operasional uang dan stok | Belanja, kas pegangan, reimbursement, stock/gas, allocation, offline forms | GOLD-01 sampai GOLD-04, GOLD-07, GOLD-14, bagian gas GOLD-18, GOLD-19; AC-63/64/67/71 serta AC finansial/offline terkait lulus |
| M3 — tenaga kerja dan pribadi | Gaji periode, kasbon, pekerjaan terpisah, private ledger/pairs | GOLD-05/06/13/15 dan RBAC personal lulus |
| M4 — recording dan kemitraan | Source modes, panen, metrik, kontrak typed, estimasi, settlement | GOLD-08 sampai GOLD-12, GOLD-16/17/18/20; AC-61/62/65/66/68/69/70 serta contract negative tests lulus |
| M5 — produk siap pilot | Dashboard/exports, inbox, UX/accessibility, restore/load/UAT, dokumentasi operasional | Seluruh GOLD-01 sampai GOLD-20 dan AC-01 sampai AC-71 pada scope R1 yang disetujui punya evidence; tidak ada blocker P0 |
| M6 — pengembangan berikut | APK/push/impor sesuai persetujuan baru | Tes platform/integrasi sendiri, tidak hanya membungkus build web |

M1–M5 adalah urutan kerja internal. Jangan menganggap M1 sendiri sudah memenuhi produk penuh. Jika user memilih pilot parsial, batas fitur dan label harus diperbarui pada scope/release notes.

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
| Q-01 | Apakah seluruh scope R1 pada bagian4 dibangun sebelum rilis publik, atau pilot bertahap? Kapan push/APK masuk? | M1–M5 bertahap, R1 lengkap; inbox dahulu, push/APK R2 | Wajib sebelum estimasi jadwal dan pembagian tugas agent |
| Q-02 | Konfirmasi batas akun/pengelola tenant R1, bukan pertanyaan ulang tentang SaaS multi-pelanggan | Satu primary owner per tenant; Mandor/ABK/PPL scoped. Co-owner/patungan/bagi saham di luar R1; pengelola tambahan bukan otomatis pemilik | Sahkan batas ini sebelum role model final; jangan menambah shared ownership karena istilah multi-owner |
| Q-03 | Persetujuan belanja, wajib nota, delegasi Mandor, visibilitas biaya per role, dan limit nominal? | Owner-only financial approval; ABK submit; alasan jika tanpa nota; PPL tanpa uang | Wajib sebelum workflow finansial go-live; tidak menolak kenyataan cash out dengan menghapus laporan |
| Q-04 | Valuasi gas/barang, pengukuran sisa gas, alokasi masa kosong/overhead, lokasi gudang jamak? | Moving average, per-item unit eksplisit, biaya belum dialokasikan tetap tampak, tidak auto bagi | Wajib sebelum laporan biaya dinyatakan final; unknown quantities ditandai |
| Q-05 | Basis umur, standar strain, pengelompokan afkir, capacity override, dan prioritas source recording? | Umur+1 saat chick-in, standar tidak universal, klasifikasi eksplisit, source modes | Wajib sebelum metrik/kontrak dipakai untuk keputusan pembayaran |
| Q-06 | Browser/perangkat target, durasi offline, kebijakan login/logout, private offline? | Android web mobile;72jam izin, antrean tidak dibuang; private online-only | Wajib sebelum menjanjikan dukungan perangkat; uji lapangan |
| Q-07 | Skema kontrak pilot, contoh hitungan yang disetujui mitra/owner, rounding, pajak dan komponen unsupported? | Typed primitives, missing→incomplete; manual adjustment beralasan; tidak hardcode tarif nyata | Wajib untuk mengaktifkan estimasi otomatis kontrak tertentu; bukan blocker belanja |
| Q-08 | Detail RHPP yang tersedia dan klasifikasi tabungan/pajak/utang/biaya yang telah dipotong PT? | Net settlement reconciled; jika hanya net cash, status belum lengkap | Wajib sebelum angka disebut penghasilan/laba lengkap |
| Q-09 | Hak gaji jika berhenti dini, batas kasbon, persetujuan pemotongan, carry lintas periode, pinjaman pribadi via payroll? | Owner finalisasi eksplisit; no negative pay; no auto carry/cut job; personal offset gated | Wajib sebelum otomatisasi pelunasan; pembayaran biasa dapat dicatat setelah validasi |
| Q-10 | Stack, hosting, anggaran, domain, layanan email/login, distribution APK? | ADR berdasarkan offline, transaksi, keamanan; tanpa vendor final dalam PRD | Wajib sebelum implementasi infrastruktur produksi |
| Q-11 | Retensi finansial/lampiran, kebijakan hapus akun, akses dukungan, legal/privacy, backup SLA? | Tidak purge otomatis posted finance; ekspor privat; admin tanpa baca bisnis | Wajib sebelum menerima data pelanggan produksi |

Q tidak mengizinkan agent memilih aturan finansial sesuka hati. Pemilik produk mengesahkan jawaban; default hanya mendukung diskusi/prototype sampai gate terkait ditutup.

### 31.2 Risiko utama dan mitigasi

| Risiko | Mitigasi produk |
|---|---|
| Kebutuhan dinamis berubah menjadi formula bebas yang tidak aman | Primitive terbatas, validator, contoh uji, unsupported status, versi immutable |
| Pengguna sulit mengerti kas versus biaya | Bahasa layar sederhana, source account jelas, contoh ringkas, saldo/biaya terpisah |
| ABK mencatat dua kali di aplikasi PT dan aplikasi ini | Mode recording opsional/summary, link sumber, tidak memaksa detail |
| Offline membuat owner merasa data lengkap padahal belum terkirim | Last sync, claim/pending count, kelengkapan laporan, no real-time guarantee |
| Kehilangan data lokal sebelum sync | Persistent storage bila tersedia, peringatan queue/quota, recovery; tidak memberi jaminan palsu |
| Upah pekerjaan bercampur payroll pada implementasi murah | Entitas/layar/slip/payment terpisah, GOLD-05, AC-22/25 |
| Laba keliru akibat stok, sapronak, tabungan atau kasbon ganda | Cost mapping, reconciliation, golden tests, detail per sumber |
| Akses PPL lintas owner atau private data bocor | Scoped grants, field-level API filtering, file/export/cache authorization tests |
| Skalabilitas terlalu mahal sebelum ada pengguna | Modular monolith, indeks, worker sesuai beban, benchmark; IoT/video terpisah ketika diperlukan |
| Terlalu banyak form/configuration | Wizard owner, default transparan, progressive disclosure, usability pilot |

### 31.3 Checklist persetujuan PRD sebelum development produksi

- [ ] Pemilik produk menyetujui visi dan kebutuhan K-01 sampai K-23.
- [ ] Scope R1/R2 dan milestone dipilih, bukan diasumsikan disetujui karena tertulis.
- [ ] Default finansial/RBAC/offline yang berisiko disahkan melalui Q terkait.
- [ ] Minimal satu kontrak pilot mempunyai contoh hitungan yang diverifikasi owner; fixture publik tetap sintetis.
- [ ] Wireframe alur belanja, kas, gaji/kasbon, upah pekerjaan, dan periode diuji dengan calon pengguna.
- [ ] Kebijakan data, keamanan, retensi, backup, dan dukungan perangkat ditetapkan.
- [ ] Backlog implementasi mengacu requirement/AC dan tidak memindahkan upah pekerjaan ke payroll.

<a id="s32"></a>
## 32. Sumber, batas interpretasi, dan riwayat dokumen

### 32.1 Sumber kebutuhan

1. Diskusi pemilik produk sampai 20 September 2026, terutama perubahan fokus menjadi operasional/keuangan, pilihan web mobile-first, serta koreksi gaji per periode dan upah pekerjaan terpisah.
2. Contoh perjanjian kemitraan dari pengguna: hanya bukti bahwa harga/bonus/potongan dapat bervariasi. Bukan konfigurasi standar, bukan RHPP realisasi yang wajib diikuti semua PT, dan bukan dasar menetapkan tarif pajak universal.
3. Enam screenshot aplikasi mitra: referensi pola konteks siklus, angka produksi, transaksi sapronak, input numerik, dan laporan penyelesaian. Identitas, kode, serta nomor dokumen aslinya tidak disalin ke PRD.

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

**Dokumen ini belum menyatakan aplikasi sudah diimplementasikan, diverifikasi di lapangan, atau siap menerima transaksi produksi.**
