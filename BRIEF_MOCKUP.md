# Brief Mockup — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.1 |
| Tanggal | 23 September 2026 |
| Untuk | Membuat mockup layar di Google AI Studio atau alat lain |
| Isi | Konsep aplikasi, halaman yang penting dibuat mockup, dan isi setiap halaman |
| Sengaja tidak diatur | Gaya visual dan tata letak. Semua keputusan desain ada di tangan Anda |
| Data | Semua nama, angka, dan tanggal di brief ini adalah contoh |

## Cara memakai brief ini

1. Tempel **bagian 1–9** sekali di awal sebagai konteks.
2. Minta **satu halaman per kali** dari bagian 10. Sebut nomor halaman dan keadaan yang ingin dilihat.
3. Tambahkan arahan desain Anda sendiri.

Brief ini **tidak** menentukan warna, huruf, ikon, gaya, susunan elemen di layar, bentuk komponen, atau animasi. Urutan isi pada daftar di bawah adalah **urutan kepentingan**, bukan urutan letak di layar. Kata "tombol", "pilihan", dan "daftar" hanya menyebut fungsi. Bentuknya bebas.

Prompt pembuka yang bisa disalin:

```text
Kamu membantu saya membuat mockup layar untuk aplikasi "Kandang Manajemen".
Ikuti isi, label tombol, status, dan aturan di brief ini apa adanya.
Jangan menambah fitur, menu, angka, atau istilah yang tidak ada di brief.
Pakai data contoh dari brief. Bahasa layar: Bahasa Indonesia.
Aplikasi dipakai terutama di HP.
Gaya visual dan tata letak saya tentukan sendiri: [tulis arahan desain Anda di sini].
Buat satu halaman per permintaan, lengkap dengan keadaan yang saya sebut.
```

---

## 1. Konsep aplikasi

**Dalam satu kalimat:** aplikasi pencatatan untuk usaha kandang ayam broiler kemitraan. Owner memantau kandang dan uang, sedangkan ABK mencatat kegiatan harian dan belanja dari HP walau sinyal lemah.

### 1.1 Masalah yang diselesaikan

- Catatan belanja tersebar di kertas atau chat, dan tidak jelas masuk periode mana.
- Uang usaha yang dipegang ABK untuk belanja tercampur dengan kasbon dan gaji.
- Owner sulit cepat melihat biaya periode, uang di tangan tiap ABK, dan sisa gaji/kasbon.
- Sinyal di kandang sering putus.
- Hasil dari mitra (RHPP) sering datang belakangan atau hanya berupa uang masuk.

### 1.2 Alur satu periode

1. Owner menyiapkan kandang dan periode sebelum DOC datang.
2. DOC datang, lalu Owner mencatat **DOC Masuk**. Periode menjadi aktif.
3. Setiap hari ABK mengisi **Recording Harian** (bila diaktifkan Owner) dan mencatat belanja.
4. Owner memeriksa dan membukukan belanja setiap hari.
5. Uang kas, gaji, kasbon, dan upah pekerjaan dicatat terpisah per orang.
6. Ayam habis: **Kandang Kosong**. Hasil dari mitra dicatat, lalu **Tutup Buku**.

### 1.3 Sifat aplikasi (keputusan pemilik produk)

- Sangat mudah dan sederhana. Bahasa singkat, tidak ambigu, tanpa istilah teknis.
- Dinamis: aplikasi menyarankan langkah berikutnya sesuai keadaan kandang, tetapi pengguna tetap bebas melakukan hal lain lebih dulu.
- Terasa pintar dan memanjakan, tanpa pernah mengarang angka.
- Dipakai terutama di HP (aplikasi web), juga bisa dibuka di laptop. Nanti dikemas menjadi aplikasi Android.

### 1.4 Tidak ada di rilis pertama — jangan muncul di mockup

- Stok barang, sisa gas/solar, tombol **Pakai**, stock opname.
- Panen, DO, kendaraan, sopir.
- Hitungan FCR/IP dan perkiraan hasil dari kontrak mitra.
- Transfer bank atau pembayaran online. Aplikasi hanya mencatat uang yang benar-benar berpindah.
- Payroll bulanan, absensi, BPJS, pajak.
- Peran PPL dan Mandor, IoT, CCTV, notifikasi push.
- Buku keuangan pribadi Owner.
- Poin, streak, lencana, hitung mundur, tur pop-up saat membuka aplikasi, atau asisten AI wajib.

## 2. Pengguna

| Peran | Siapa | Yang dikerjakan | Yang tidak boleh dilihat/dilakukan |
|---|---|---|---|
| **Owner** | Pemilik usaha; bisa punya beberapa kandang | Menyiapkan kandang dan periode, mencatat DOC/pakan masuk, memeriksa dan membukukan belanja, mengelola uang kas, gaji, kasbon, upah pekerjaan, akun ABK, hasil periode, laporan | Data usaha Owner lain |
| **ABK** | Pekerja kandang; akun pribadi, HP sendiri; satu kandang bisa punya banyak ABK | Recording Harian bersama, Catat Belanja, Terima/Kembalikan Uang, melihat Uang Kas, gaji, kasbon, dan upah pekerjaan miliknya | Uang, gaji, dan kasbon ABK lain; laba Owner; membukukan atau menyetujui belanjanya sendiri |
| Admin layanan | Pengelola layanan | Membuat akun Owner baru, mengaktifkan/menonaktifkan layanan | Isi transaksi usaha. **Tidak perlu dibuat mockup** |

Login memakai **username dan password**, tanpa email. Owner membuat akun ABK sendiri.

## 3. Istilah

| Istilah | Arti |
|---|---|
| Kandang | Lokasi peternakan; bisa terdiri dari beberapa bangunan dengan kapasitas masing-masing |
| Periode | Satu masa pemeliharaan ayam di satu kandang. Hanya satu periode aktif per kandang |
| Persiapan | Periode sudah disiapkan, DOC belum datang |
| DOC | Anak ayam yang datang. Jumlah DOC hidup yang diterima menjadi populasi awal |
| Hari ke- | Umur periode sejak DOC datang (hari DOC datang = hari ke-1) |
| Recording Harian | Satu catatan bersama per kandang per tanggal: pakan dipakai, mati, afkir, sampling bobot. Owner bisa memilih **Harian** atau **Tidak aktif** |
| Afkir | Ayam yang dikeluarkan karena tidak layak, dihitung terpisah dari mati |
| Sampling | Menimbang sebagian ayam untuk rata-rata bobot. Tidak wajib setiap hari |
| Belanja | Pembelian barang atau jasa apa saja: gas, solar, listrik, sekam, servis, peralatan |
| Dibukukan | Sudah masuk buku usaha oleh Owner. Sebelum itu belum mengubah saldo atau biaya |
| Uang Kas | Uang usaha yang sedang dipegang seseorang untuk keperluan kandang. Bukan gaji |
| Kasbon | Pinjaman uang usaha kepada ABK. Terpisah dari gaji; bisa lebih besar dari gaji |
| Gaji | Hak gaji ABK untuk satu periode ayam, bukan per bulan |
| Upah Pekerjaan | Upah kerja tambahan di luar gaji, misalnya borongan bersih-bersih |
| Mitra | Perusahaan kemitraan (PT) |
| RHPP | Laporan penyelesaian hasil dari mitra |
| Sapronak | DOC, pakan, dan obat/vaksin dari mitra |

## 4. Aturan isi yang wajib dijaga di semua halaman

1. **Kosong bukan nol.** Data yang belum ada ditulis "—" disertai keterangan singkat, misalnya "Belum ada catatan". Rp0 dan 0 ekor hanya untuk nol yang memang diketahui.
2. **Rupiah selalu bulat dan penuh**, misalnya `Rp1.250.000`, bukan `1,25 jt` dan tanpa desimal. Kuantitas memakai koma desimal dan satuan terlihat, misalnya `12,5 kg`.
3. **Tidak ada angka terisi dari kebiasaan.** Nominal, kuantitas, dan recording kemarin tidak disalin otomatis.
4. **Recording Harian dipakai bersama.** Satu catatan untuk seluruh kandang per tanggal, bukan per ABK atau per bangunan. Setelah terkirim, catatan langsung berlaku tanpa persetujuan Owner. Koreksi mengganti nilai lama (100 kg dikoreksi menjadi 90 kg = 90 kg), tidak dijumlah.
5. **Belanja ABK menunggu Owner.** Setelah dikirim statusnya **Menunggu Owner**, lalu Owner membukukan saat online. ABK tidak punya tombol menyetujui atau membayar belanjanya sendiri.
6. **Belanja yang dicatat Owner** langsung dibukukan oleh Owner sendiri dan tidak masuk antrean pemeriksaan.
7. **Foto nota opsional.** Belanja tanpa foto tetap bisa dikirim tanpa perlu alasan.
8. **Uang Kas, Gaji, Kasbon, dan Upah Pekerjaan selalu terpisah.** Uang pribadi ABK yang dipakai belanja (talangan) adalah utang penggantian kepada ABK, bukan kasbon.
9. **Tidak ada stok.** Pakan Masuk dan pakan dipakai hanya catatan, bukan saldo gudang.
10. **Periode aktif hanya setelah DOC Masuk** dengan tanggal datang sebenarnya dan DOC hidup lebih dari 0. Tanggal rencana tidak mengaktifkan periode.
11. **Tanpa sinyal:** ABK tetap bisa menyimpan catatan di HP (status **Menunggu Kirim**). Aksi Owner yang membukukan uang atau mengubah pengaturan dinonaktifkan dengan alasan tertulis: "Perlu sinyal untuk membukukan."
12. **Hasil usaha tidak pernah Rp0 palsu.** Bila data belum cukup, tulis "Belum dapat dihitung" beserta data yang kurang.
13. **Catatan ABK tentang uang tidak langsung menambah saldo.** Saldo sah hanya yang sudah dibukukan. "Perkiraan uang di tangan" diberi keterangan bahwa itu perkiraan dari catatan.
14. **Konfirmasi uang menyebut objek dan dampaknya**, misalnya "Bukukan belanja Listrik Rp150.000? Uang Kas Rudi turun Rp150.000."
15. **Setiap pengguna hanya melihat data yang menjadi haknya** (lihat bagian 2).

## 5. Bahasa layar

### 5.1 Satu konsep, satu istilah

| Pakai di layar | Jangan pakai |
|---|---|
| Periode | siklus, batch |
| Persiapan | draft, DRAFT |
| Periode Sudah Mulai | periode berjalan |
| Recording Harian | laporan per ABK, form per bangunan |
| Catat Belanja | klaim, pengajuan, expense |
| Periksa Belanja | review, approval |
| Dibukukan / Bukukan | posted, posting, disahkan, final |
| Uang Kas | kas pegangan, saldo saya, dompet |
| Terima Uang / Kembalikan Uang (ABK) | catatan tunai, transfer |
| Beri Uang Kas / Terima Kembali (Owner) | transfer sekarang |
| Kasbon | pinjaman, advance |
| Gaji | payroll |
| Upah Pekerjaan | bonus |
| Hasil Periode | laba (bila belum dapat dihitung) |
| Kandang Kosong | selesai fisik, closing |
| Tutup Buku / Buka Lagi | lock, reopen, kunci keuangan |
| Riwayat Belanja | barang & peralatan, stok |
| Status Kirim | sinkronisasi, sync, antrean, queue |
| Kelengkapan data | coverage |
| Catatan berubah — pilih angka yang benar | konflik versi, error 409 |
| Akses tidak tersedia | forbidden, error 403 |

Istilah kandang yang sudah dikenal tetap dipakai: DOC, RHPP, ABK, afkir, sampling, sapronak, recording, mitra.

### 5.2 Label status

| Untuk | Label | Arti |
|---|---|---|
| Catatan di HP | **Draf** · **Menunggu Kirim** · **Mengirim** · **Belum Pasti Terkirim** · **Gagal Simpan** | Draf: belum dikirim. Menunggu Kirim: tersimpan di HP, dikirim saat ada sinyal. Belum Pasti Terkirim: cek lagi, jangan catat ulang. Gagal Simpan: isian masih di layar, belum tersimpan |
| Recording | **Tercatat** · **Catatan Berubah** · **Dikoreksi** | Tercatat: sudah di server dan dipakai bersama |
| Belanja | **Menunggu Owner** · **Perlu Dilengkapi** · **Ditolak** · **Dibukukan** | Dibukukan hanya oleh Owner saat online |
| Uang | **Belum Dicek Owner** · **Dibukukan** · **Dibayar Sebagian** · **Lunas** | Dibukukan belum tentu sudah dibayar |
| Foto nota | **Tanpa Foto** · **Foto Menunggu Kirim** · **Foto Terkirim** · **Foto Gagal** | Status foto tidak menghapus isi catatan |
| Kelengkapan | **Belum Ada Data** · **Data Belum Lengkap** · **Data sampai [tanggal jam]** | Tidak sama dengan nol atau aman |

Status boleh tampil berdampingan, misalnya **Menunggu Owner · Foto Menunggu Kirim**. Status selalu berupa teks, tidak cukup warna saja.

### 5.3 Aturan kalimat

1. Judul dan menu: kata benda 1–3 kata (**Uang Kas**). Tombol: kata kerja + objek (**Catat Belanja**, **Kirim Ulang**). Hindari tombol **OK** atau **Ya** tanpa objek.
2. Bantuan paling banyak satu kalimat pendek (sekitar 12 kata).
3. Pesan error memuat apa yang terjadi, apakah data aman, dan langkah berikutnya. Contoh: "Belum terkirim. Catatan aman di HP. Dikirim saat ada sinyal." / "Nominal belum diisi."
4. Nada tidak menyalahkan, tanpa tanda seru berlebihan, dan tanpa emoji sebagai penanda status.

## 6. Perilaku kemudahan yang diinginkan

Bagian ini menjelaskan **cara kerja**, bukan tampilan. Bentuk visualnya bebas.

### 6.1 Saran berikutnya

- Setiap beranda punya **satu saran utama** dari data nyata, dan paling banyak dua saran pendamping.
- Saran berisi judul aksi, satu kalimat alasan, satu tombol aksi, dan **Kenapa?** yang menjelaskan dasar saran dalam satu kalimat.
- Saran opsional punya **Nanti**. Saran disembunyikan sampai ada perubahan dan bisa diurungkan. Saran wajib, misalnya belanja yang menunggu Owner, tidak bisa disembunyikan.
- Pengguna **bebas** mengerjakan hal lain lebih dulu. **Catat** dan menu utama selalu tersedia.
- Langkah yang belum bisa dikerjakan tetap terlihat dengan alasannya, misalnya "Perlu periode dulu".
- Selesai satu langkah: pesan singkat, lalu saran berikutnya muncul.

### 6.2 Sedikit pindah halaman

- Isian singkat dikerjakan **tanpa meninggalkan layar asal**: Catat Belanja, Terima/Kembalikan Uang, Beri Uang Kas, Minta Perbaikan, Tolak, dan koreksi satu nilai.
- Detail di daftar bisa **dibuka dan ditutup di tempat**. Saat tertutup, judul, nominal, dan status tetap terlihat.
- Halaman terpisah hanya untuk tugas panjang: Recording Harian, Rincian RHPP, Tutup Buku, dan Akun.
- Tombol Kembali di HP menutup bagian yang sedang terbuka lebih dulu. Isian tidak hilang karena tersimpan sebagai draf di HP.

### 6.3 Input angka

- Angka diisi dengan **keypad angka milik aplikasi**. Pengguna selalu bisa beralih ke **Keyboard HP**.
- Nominal rupiah: tombol 0–9, `000`, dan hapus, tanpa koma. Format `Rp` dan titik ribuan muncul langsung, dan **ejaan nominal** tampil di dekatnya, misalnya "seratus lima puluh ribu rupiah".
- Kuantitas (kg, liter, sak): tombol 0–9, koma, dan hapus. Satuan terlihat dan bisa diganti.
- Hitungan ekor (mati, afkir, sampel): tombol 0–9 dan hapus, plus tombol kurang/tambah satu.
- Aksi pada keypad: **Lanjut** (ke isian berikutnya), **Selesai**, dan **Keyboard HP**.
- Tanggal tidak memakai keypad. Pilihannya: **Hari ini**, **Kemarin**, **Pilih tanggal**. Ada penanda bila tanggal bukan hari ini.
- Username, password, dan teks biasa memakai keyboard HP.

### 6.4 Bantuan pintar

| Boleh | Contoh |
|---|---|
| Lanjutkan pekerjaan | "Belanja Listrik belum dikirim. [Lanjutkan]" |
| Pilihan cepat dari riwayat sendiri | Keperluan: Solar · Gas · Listrik. Teks baru tetap bisa diketik |
| Hitung otomatis | Rata-rata sampling 20 kg ÷ 25 ekor = 0,8 kg/ekor sampel |
| Cek mirip | "Mirip belanja Listrik Rp150.000 yang Anda kirim hari ini." Hanya peringatan, tidak memblokir |
| Angka tidak biasa | "Mati 250 ekor — jauh di atas 7 hari terakhir. Sudah benar?" Muncul setelah angka diisi, tidak memblokir |
| Pembanding | "Kemarin: 96 kg" muncul hanya setelah angka hari ini diisi |
| Urutan pilihan | Pilihan yang sering dipakai muncul lebih dulu, tetapi tidak otomatis terpilih |

**Tidak boleh:** mengisi nominal atau kuantitas dari kebiasaan, menyalin recording kemarin, memilih sumber uang, memilih Harian/Tidak aktif, mengirim, atau membukukan secara otomatis.

### 6.5 Draf dan pesan hasil

- Isian tersimpan otomatis sebagai draf di HP ("Draf tersimpan di HP · 09.10").
- Pesan hasil sesuai kejadian sebenarnya. Contoh saat online: "Belanja Listrik terkirim. Menunggu Owner." Contoh saat tanpa sinyal: "Belanja Listrik tersimpan di HP. Dikirim saat ada sinyal."
- **Urungkan** hanya untuk aksi di HP yang belum dikirim, tidak pernah untuk uang yang sudah dibukukan.

## 7. Data contoh bersama

Semua halaman memakai data ini agar ceritanya nyambung. Setiap keadaan halaman boleh dianggap potret terpisah.

**Usaha dan kandang**

- Usaha: **Hadi Farm**. Owner: **Pak Hadi** (username `hadi`). Mitra: **PT Contoh Mitra**.
- **Kandang Utara**: 2 bangunan (A dan B, masing-masing kapasitas 3.500 ekor, total 7.000), zona waktu WIB, Recording Harian aktif.
  - **Periode 01**: DOC datang 6 Sep 2026, DOC hidup 5.000 ekor. Hari ini **Rabu, 23 Sep 2026 = hari ke-18**.
- **Kandang Selatan**: **Periode 02** sudah Kandang Kosong sejak 15 Sep 2026; keuangannya belum selesai.
- ABK: **Rudi** (Kandang Utara) dan **Yanto** (Kandang Utara dan Kandang Selatan).

**Recording Kandang Utara**

- 22 Sep, dicatat Yanto pukul 16.05: Pakan BR-1 96 kg · Mati 3 ekor · Afkir 1 ekor · Sampling tidak dilakukan.
- 23 Sep: belum ada catatan.

**Belanja Kandang Utara**

| Belanja | Oleh | Tanggal | Dibayar dengan | Foto | Status |
|---|---|---|---|---|---|
| Listrik, Rp150.000 | Rudi | 23 Sep | Uang Kas Rudi | Tanpa foto | Menunggu Owner |
| Solar 20 liter, Rp200.000 | Yanto | 23 Sep | Uang Kas Yanto | 1 foto | Menunggu Owner (mirip belanja Solar Rp200.000 tanggal 22 Sep) |
| Sekam 10 karung, Rp350.000 | Yanto | 22 Sep | Belum tahu | Tanpa foto | Menunggu Owner |
| Servis pompa air, Rp120.000 | Yanto | 21 Sep | Uang Kas Yanto | Tanpa foto | Perlu Dilengkapi (Owner meminta nama bengkel) |
| Solar 20 liter, Rp200.000 | Yanto | 22 Sep | Uang Kas Yanto | 1 foto | Dibukukan 22 Sep |
| Gas 3 kg 2 tabung, Rp200.000 | Rudi | 19 Sep | Uang Kas Rudi | 1 foto | Dibukukan 20 Sep |
| Plastik tirai, Rp85.000 | Rudi | 22 Sep | Uang Kas Rudi | 1 foto | Belum terkirim dari HP Rudi (Menunggu Kirim · Foto Menunggu Kirim) |

**Uang Kas**

- **Rudi**: Terima dari Owner Rp200.000 (15 Sep, Dibukukan) → Belanja Gas −Rp200.000 (19 Sep, Dibukukan) → Terima dari Owner Rp500.000 (20 Sep, Dibukukan). Saldo dibukukan **Rp500.000**. Belanja menunggu Owner Rp150.000. Perkiraan uang di tangan **Rp350.000**. Data sampai 23 Sep 2026, 15.00.
- **Yanto**: saldo dibukukan **Rp400.000**. Ada belanja dengan sumber "Belum tahu", jadi perkiraan uang di tangan **Belum dapat dipastikan**. Terima Uang Rp300.000 tanggal 23 Sep berstatus **Belum Dicek Owner**.
- Owner: Kas tunai usaha **Rp3.250.000**. Rekening usaha **—** (saldo awal belum diisi).

**Gaji, kasbon, upah**

- Kasbon Rudi: Rp300.000, cair 10 Sep.
- Yanto, Periode 02 Kandang Selatan: Hak gaji **Rp2.500.000**. Kasbon masih terbuka **Rp1.200.000**. Contoh pilihan Owner: potong Rp400.000, sehingga sisa hak gaji Rp2.100.000 dan sisa kasbon Rp800.000.
- Upah Pekerjaan Yanto: Bersihkan saluran air, 1 pekerjaan × Rp150.000, **Menunggu Owner**.

**Hasil Kandang Selatan, Periode 02**

- Uang diterima dari PT Contoh Mitra Rp12.500.000 tanggal 20 Sep, masuk ke Rekening usaha. Rincian RHPP belum ada.
- Biaya dibukukan Periode 02: Rp4.100.000. Masih ada 1 belanja belum diperiksa: Gas 3 kg, Rp100.000, oleh Yanto, 14 Sep.

## 8. Keadaan umum yang berlaku di semua halaman

| Keadaan | Yang ditampilkan |
|---|---|
| Sedang memuat | Tanda sedang memuat, **bukan** angka Rp0 |
| Belum ada data | Penjelasan singkat dan aksi pertama, misalnya "Belum ada catatan uang kas." |
| Filter tanpa hasil | "Tidak ada belanja di bagian ini.", dibedakan dari belum ada data |
| Tanpa sinyal | Pemberitahuan tanpa sinyal dan waktu data terakhir. Aksi yang perlu sinyal nonaktif dengan alasannya |
| Gagal simpan | "Gagal simpan. Isian masih di layar." Isian tidak hilang |
| Sedang mengirim | Tombol tidak bisa ditekan dua kali |
| Belum pasti terkirim | "Belum pasti terkirim — cek lagi, jangan catat ulang." |
| Error isian | Pesan tepat di dekat isian yang salah. Bila lebih dari satu, ada ringkasan "Ada 2 hal yang perlu dilengkapi" |
| Tidak punya akses | "Akses tidak tersedia." Tanpa membocorkan nama atau angka orang lain |
| Layanan dibatasi | "Hanya Baca." Data tetap bisa dilihat dan diekspor, tetapi tidak bisa diubah |
| Izin di HP habis | "Masuk lagi untuk melanjutkan. Catatan di HP tetap aman." |

---

## 9. Daftar halaman dan prioritas mockup

**Menu utama** (bentuk dan letak bebas):

- **ABK:** Hari Ini · Catat · Uang Kas · Riwayat · Lainnya. Lainnya berisi Gaji, Kasbon, Upah Pekerjaan, Status Kirim, Panduan, dan Akun.
- **Owner:** Ringkasan · Kandang · Transaksi · Laporan · Lainnya. Usulan pengelompokan: Transaksi berisi Periksa Belanja, Uang Kas, dan Riwayat Belanja; Lainnya berisi Tim Kandang, Gaji, Kasbon, Upah Pekerjaan, Ekspor, Status Kirim, Panduan, dan Akun. Pengelompokan ini boleh Anda ubah.
- **Catat** selalu bisa dibuka dari beranda kedua peran.

| No | Halaman | Peran | Prioritas | Rujukan dokumen |
|---|---|---|---|---|
| 1 | Masuk dan Ganti Password | Semua | **Wajib** | V-03 |
| 2 | Hari Ini | ABK | **Wajib** | V-02 |
| 3 | Catat (pilihan pencatatan) | ABK, Owner | **Wajib** | — |
| 4 | Recording Harian | ABK, Owner | **Wajib** | V-06 |
| 5 | Catat Belanja | ABK, Owner | **Wajib** | V-09 |
| 6 | Uang Kas ABK + Terima/Kembalikan Uang | ABK | **Wajib** | V-08, V-13 |
| 7 | Ringkasan | Owner | **Wajib** | V-01 |
| 8 | Mulai Kandang: Data Kandang, Pilihan Recording, Siapkan Periode | Owner | **Wajib** | V-04 |
| 9 | DOC Masuk dan Pakan Masuk | Owner | **Wajib** | V-07 |
| 10 | Periksa Belanja | Owner | **Wajib** | V-11, V-10 |
| 11 | Uang Kas Owner + Beri Uang Kas/Terima Kembali | Owner | **Wajib** | V-08 |
| 12 | Status Kirim | ABK, Owner | Disarankan | V-19 |
| 13 | Tim Kandang | Owner | Disarankan | V-20 |
| 14 | Gaji, Kasbon, Upah Pekerjaan | Owner; ABK melihat miliknya | Disarankan | V-14, V-15, V-16 |
| 15 | Hasil Periode | Owner | Disarankan | V-17 |
| 16 | Kandang Kosong dan Tutup Buku | Owner | Disarankan | V-05, V-26 |

Halaman lain dibuat nanti (bagian 11).

---

## 10. Rincian halaman

Format setiap halaman: **tujuan**, **isi**, **isian**, **aksi**, **keadaan yang perlu dibuat**, dan **jangan**.

### Halaman 1 — Masuk dan Ganti Password

**Tujuan:** masuk dengan username dan password. Owner baru menerima password sementara dari Admin; ABK menerima akun dari Owner.

**Isi dan isian**

- Nama aplikasi: Kandang Manajemen.
- Username.
- Password, dengan pilihan **Lihat**.
- Tombol **Masuk**.
- Tautan **Butuh bantuan?**

**Ganti Password** (hanya pada masuk pertama dengan password sementara): Password baru, Ulangi password, tombol **Simpan Password**. Owner lalu diarahkan ke Data Kandang; ABK diarahkan ke Hari Ini.

**Keadaan:** normal · salah masuk ("Username atau password salah.") · masuk pertama (Ganti Password) · tanpa sinyal ("Perlu sinyal untuk masuk.") · izin di HP habis ("Masuk lagi untuk melanjutkan. Catatan di HP tetap aman.").

**Jangan:** email, daftar akun baru, kode usaha, atau "lupa password lewat email". Paste dan pengelola password tidak boleh dihalangi.

### Halaman 2 — Hari Ini (ABK)

**Tujuan:** layar pertama ABK. Menunjukkan yang perlu dikerjakan hari ini dan jalan cepat untuk mencatat.

**Isi**

1. Konteks: Kandang Utara · Periode 01 · Hari ke-18 · Rabu, 23 Sep 2026. Bila ditugaskan ke lebih dari satu kandang, ada pilihan ganti kandang.
2. Saran berikutnya: **Isi Recording Harian** — "Belum ada catatan untuk hari ini." Tombol **Isi Recording** dan **Kenapa?** ("Kandang ini memakai Recording Harian dan tanggal 23 Sep belum ada catatan.").
3. Saran pendamping: "1 catatan belum terkirim dari HP ini." dengan tombol **Buka**.
4. Recording Harian: status **Belum Ada Data** · "Kemarin dicatat Yanto, 16.05".
5. Catat cepat: **Catat Belanja**, **Terima Uang**, **Upah Pekerjaan**, **Uang Kas**.
6. Belum terkirim dari HP ini: Plastik tirai · Rp85.000 · Menunggu Kirim. Saat dibuka: "Tersimpan di HP ini. Dikirim otomatis saat ada sinyal." dan tombol **Kirim Ulang**.
7. Belanja saya: Listrik Rp150.000 **Menunggu Owner** · Gas 3 kg 2 tabung Rp200.000 **Dibukukan**. Saat dibuka: waktu dikirim, dibayar dengan, foto nota, dan keterangan status.

**Keadaan**

- A. Recording hari ini belum ada (isi di atas).
- B. Recording sudah tercatat: "Tercatat oleh Yanto, 16.00 · Pakan 100 kg · Mati 2 · Afkir 0", tombol **Lihat** dan **Koreksi**, keterangan "Catatan ini dipakai bersama."
- C. Recording **Tidak aktif**: tidak ada tugas recording dan tidak ada angka nol.
- D. Periode masih Persiapan: tidak ada tugas recording; Catat Belanja tetap tersedia.
- E. Belum ditugaskan ke kandang: "Belum ada kandang yang ditugaskan. Hubungi Owner."
- F. Tanpa sinyal.

**Jangan:** menampilkan uang atau gaji ABK lain, laba Owner, atau menu pemakaian barang.

### Halaman 3 — Catat (pilihan pencatatan)

**Tujuan:** satu pintu untuk semua pencatatan. Selalu bisa dibuka dari mana saja tanpa kehilangan layar asal; bentuknya bebas.

**Isi untuk ABK**

| Pilihan | Keterangan singkat |
|---|---|
| Recording Harian | Pakan, mati, afkir, sampling. Tidak muncul bila recording Tidak aktif |
| Catat Belanja | Pembelian barang atau jasa |
| Terima Uang | Uang tunai dari Owner untuk kandang |
| Kembalikan Uang | Sisa uang kas yang diserahkan kembali |
| Upah Pekerjaan | Pekerjaan tambahan di luar gaji |

**Isi untuk Owner**

| Pilihan | Keterangan singkat |
|---|---|
| Catat Belanja | Langsung dibukukan, tanpa antrean |
| Beri Uang Kas | Uang tunai untuk dipegang ABK |
| DOC Masuk | Aktifkan periode saat DOC datang. Bila periode belum disiapkan: nonaktif dengan alasan "Perlu periode dulu" |
| Pakan Masuk | Catat pakan/sapronak yang diterima |

Konteks kandang dan tanggal terlihat. **Jangan:** pilihan Pemakaian atau Pakai gas/solar.

### Halaman 4 — Recording Harian

**Tujuan:** satu catatan bersama untuk seluruh kandang per tanggal.

**Isi atas:** Kandang Utara · Periode 01 · Hari ke-18 · "Satu catatan bersama untuk seluruh kandang." · status (**Draf** / **Menunggu Kirim** / **Tercatat**) · "Terakhir diubah [nama], [jam]" bila sudah ada.

**Isian**

| Isian | Jenis | Catatan |
|---|---|---|
| Tanggal | Hari ini / Kemarin / Pilih tanggal | Bila memilih tanggal yang sudah tercatat: "Tanggal 22 Sep sudah dicatat Yanto. Mengirim akan mengoreksi catatan itu." |
| Jenis pakan | Pilihan (Pakan BR-1, Pakan BR-2) | Bisa **Tambah jenis pakan** |
| Dipakai hari ini | Kuantitas + satuan (kg/sak) | Bantuan: "Jumlah hari ini saja, bukan total sejak awal." |
| Mati (ekor) | Hitungan ekor dengan kurang/tambah satu | Kosong ≠ 0. "Tulis 0 bila tidak ada." |
| Afkir (ekor) | Hitungan ekor dengan kurang/tambah satu | Terpisah dari mati |
| Sampling bobot | Tidak dilakukan / Dilakukan | "Tidak sampling bukan berarti bobot 0." |
| Jumlah ayam ditimbang (ekor) | Hitungan, hanya bila Dilakukan | Contoh 25 |
| Total bobot (kg) | Kuantitas, hanya bila Dilakukan | Contoh 20 |
| Rata-rata | Dihitung otomatis | "0,8 kg/ekor sampel" · "Rata-rata sampel, bukan bobot seluruh ayam." |
| Catatan | Teks, opsional | Contoh: "Kipas bangunan B mati sore hari" |

**Aksi:** **Simpan Draf** dan **Kirim**. Hasil: "Recording 23 Sep tercatat. Dipakai bersama tim."

**Bantuan pintar:** "Kemarin: 96 kg" setelah pakan diisi. "250 ekor — jauh di atas 7 hari terakhir (paling banyak 6 ekor). Sudah benar?" setelah mati diisi, tanpa memblokir.

**Tambahan yang bisa dibuka-tutup:** Riwayat perubahan hari ini, dan Catatan kemarin 22 Sep (Pakan BR-1 96 kg, Mati 3, Afkir 1, Sampling tidak dilakukan).

**Keadaan**

- A. Kosong (Draf).
- B. Terisi sebagian dengan error, misalnya "Isi jumlah mati. Tulis 0 bila tidak ada."
- C. Tercatat.
- D. Koreksi: nilai lama dan baru terlihat (Pakan 100 kg → 90 kg), dengan isian **Alasan koreksi** singkat. Hasil berlaku 90 kg.
- E. **Catatan Berubah**: perbandingan Di server (Yanto, 16.00) dan Draf Anda: Pakan 100 kg vs 90 kg, Mati 2 vs 2, Afkir 0 vs 0. Aksi **Pakai Data Server** dan **Susun Koreksi**. Keterangan: "Draf Anda belum mengganti catatan bersama."
- F. Tanpa sinyal: Menunggu Kirim.

**Jangan:** formulir per ABK atau per bangunan, persetujuan Owner, angka kemarin tersalin, atau pengurangan stok pakan.

### Halaman 5 — Catat Belanja

**Tujuan:** melaporkan pembelian barang atau jasa apa saja.

**Isian ABK, urut kepentingan**

| Isian | Jenis | Catatan |
|---|---|---|
| Keperluan | Teks bebas + pilihan cepat dari riwayat sendiri (Solar, Gas, Listrik, Sekam) | Wajib |
| Nominal | Rupiah + ejaan nominal | Wajib; tidak pernah terisi otomatis |
| Tanggal belanja | Hari ini / Kemarin / Pilih tanggal | Hari ini terpilih dan terlihat |
| Dibayar dengan | Uang Kas saya / Uang pribadi saya (minta diganti) / Belum dibayar ke toko / Belum tahu | "Belum tahu" → "Tidak apa-apa. Owner akan melengkapinya." · Uang pribadi → "Dicatat sebagai uang yang perlu diganti, bukan kasbon." |
| Rincian tambahan | Bisa dibuka: Nama toko, Jumlah barang + satuan, Catatan | Semua opsional |
| Foto nota | Tambah foto | "Tanpa foto tetap bisa dikirim." |

**Langkah:** Isi → **Tinjau** (ringkasan: keperluan, nominal + ejaan, tanggal, dibayar dengan, foto) → **Kirim**. Ada keterangan "Owner memeriksa sebelum dibukukan." dan status draf "Draf tersimpan di HP · 09.10".

**Bantuan pintar:** belanja mirip → "Mirip belanja Listrik Rp150.000 yang Anda kirim hari ini." dengan **Tetap Kirim** dan **Lihat**. Nominal jauh lebih besar dari biasanya → "Rp15.000.000 — lebih besar dari biasanya. Sudah benar?"

**Hasil:** online → "Belanja Listrik terkirim. Menunggu Owner." · tanpa sinyal → "Belanja Listrik tersimpan di HP. Dikirim saat ada sinyal."

**Versi Owner**

- Dibayar dengan: Kas tunai usaha / Rekening usaha / Uang pribadi Owner (dicatat sebagai utang usaha ke Owner) / Belum dibayar ke toko.
- Tambahan **Dibebankan ke**: Periode 01 · Kandang Utara / Di luar periode (biaya umum).
- Dampak tampil sebelum menyimpan, misalnya "Kas tunai usaha turun Rp150.000. Biaya Periode 01 naik Rp150.000."
- Tombol **Bukukan**. Perlu sinyal; tanpa sinyal nonaktif dengan alasan. Belanja ini tidak masuk Periksa Belanja.

**Keadaan:** kosong · error (dua isian kosong → ringkasan) · tinjau · peringatan mirip · terkirim · tanpa sinyal (ABK) · Owner tanpa sinyal.

**Jangan:** nominal terisi otomatis, foto wajib, alasan wajib bila tanpa foto, pilihan kategori akuntansi, daftar barang terbatas, atau kata "klaim/pengajuan".

### Halaman 6 — Uang Kas (ABK) dengan Terima Uang dan Kembalikan Uang

**Tujuan:** ABK melihat uang usaha yang ia pegang dan mencatat uang tunai yang diterima atau dikembalikan. ABK hanya melihat Uang Kas miliknya sendiri; nama dan saldo ABK lain tidak muncul.

**Isi**

1. **Perkiraan uang di tangan: Rp350.000.** Keterangan: "Dari catatan, bukan hasil hitung uang. Data sampai 23 Sep 2026, 15.00."
2. **Cara menghitung** (bisa dibuka): Saldo dibukukan Owner Rp500.000 · Belanja menunggu Owner −Rp150.000 · Perkiraan di tangan Rp350.000. "Saldo dibukukan berubah setelah Owner membukukan."
3. Aksi: **Terima Uang**, **Kembalikan Uang**, **Catat Belanja**.
4. **Riwayat Uang Kas**: Belanja Listrik −Rp150.000 Menunggu Owner · Terima dari Owner +Rp500.000 Dibukukan · Belanja Gas −Rp200.000 Dibukukan · Terima dari Owner +Rp200.000 Dibukukan. Setiap baris menunjukkan masuk/keluar; saat dibuka tampil dicatat oleh, waktu, cara, dan catatan.

**Isian Terima Uang:** Tanggal diterima (Hari ini/Kemarin), Nominal, Dari (Owner / Orang lain + nama), Catatan (opsional). Tombol **Simpan**. Keterangan: "Owner akan mengecek. Saldo berubah setelah Owner membukukan." Hasil: "Terima Uang Rp500.000 tercatat. Belum dicek Owner."

**Isian Kembalikan Uang:** Tanggal diserahkan, Nominal, Diserahkan kepada (Owner). Tombol **Simpan**.

**Keadaan:** normal (Rudi) · perkiraan tidak bisa dipastikan (Yanto: "Belum dapat dipastikan" beserta rinciannya) · belum ada catatan · tanpa sinyal (tetap bisa simpan; angka dari data terakhir).

**Jangan:** menggabungkan gaji atau kasbon, tombol transfer, menyebut perkiraan sebagai saldo pasti, atau catatan ABK yang langsung menambah saldo.

### Halaman 7 — Ringkasan (Owner)

**Tujuan:** layar pertama Owner. Menampilkan yang perlu perhatian, kesiapan kandang, dan uang.

**Isi umum:** usaha dan kandang (bisa diganti), tanggal, "Data terakhir 16.05", satu saran utama, dan jalan ke **Catat**.

**Keadaan A — Owner baru, sebelum DOC**

- Konteks: Hadi Farm · Kandang Utara · Persiapan.
- Saran: **Siapkan Periode** — "Agar DOC bisa dicatat saat datang." Tombol **Siapkan Periode**, **Nanti**, **Kenapa?** ("Data Kandang dan pilihan recording sudah ada. Periode belum disiapkan.").
- **Persiapan kandang · 2 dari 5 selesai · boleh dikerjakan urutan mana saja:**
  - Selesai: Data Kandang — Kandang Utara, 2 bangunan (**Ubah**).
  - Selesai: Pilihan recording — Harian (**Ubah**).
  - Tim Kandang (opsional) — "Belum ada ABK. Anda tetap bisa mencatat sendiri." (**Tambah**).
  - Siapkan Periode — Belum disiapkan (**Siapkan**).
  - DOC Masuk — "Perlu periode dulu" (nonaktif dengan alasan).
- Uang dan belanja: Kas kandang **—** Belum ada catatan · Belanja menunggu Owner **0**.
- Keterangan: "Belanja sebelum DOC tetap bisa dicatat."

**Keadaan B — Periode Persiapan:** saran **Catat DOC saat datang** — "Periode 01 aktif setelah DOC hidup dicatat." Tombol **DOC Masuk**. Tidak ada tombol Nanti.

**Keadaan C — Periode aktif (hari ke-18)**

- Perhatian (tidak bisa disembunyikan): **3 belanja perlu diperiksa · Rp700.000 · paling lama 1 hari** → **Periksa**.
- Recording hari ini: Belum Ada Data, atau Tercatat oleh Yanto 16.00 → **Lihat**.
- Biaya dibukukan Periode 01: Rp400.000 → **Rincian**.
- Belanja belum dibukukan: Rp820.000 (3 perlu diperiksa, 1 perlu dilengkapi) → **Rincian**.
- Uang Kas per orang: Rudi Rp500.000 · Yanto Rp400.000 (saldo dibukukan).
- Hasil usaha: **Belum dapat dihitung**.
- Kandang Selatan · Periode 02: "Keuangan periode ini belum selesai." → **Hasil Periode**.

**Keadaan D:** tanpa sinyal.

**Jangan:** Rp0 untuk data kosong, daftar persiapan yang tetap tampil setelah selesai, laba dari tebakan, atau transaksi contoh yang tampak nyata di produk.

### Halaman 8 — Mulai Kandang

Tiga langkah yang boleh dikerjakan bertahap. Owner bisa berhenti dan melanjutkan nanti. **Tim Kandang** (halaman 13) adalah langkah opsional di antaranya.

**8a. Data Kandang** — "Mulai dari tempat pencatatan Anda."

- Nama usaha (Hadi Farm), Nama kandang (Kandang Utara), Zona waktu (WIB/WITA/WIT; dipilih, bukan ditebak).
- Rincian lain (opsional, bisa dibuka): bangunan (nama + kapasitas), alamat, mitra.
- Tombol **Simpan & Lanjut** dan **Nanti**.

**8b. Pilihan Recording**

- **Harian** — "Pakan, mati/afkir, dan sampling bila dilakukan."
- **Tidak aktif** — "Tetap bisa mencatat keuangan."
- Tidak ada pilihan yang terpilih otomatis. Keterangan: "Bisa diubah nanti di Kandang → Periode → Pengaturan."
- Tombol **Lanjut** dan **Nanti**.

**8c. Siapkan Periode**

- Nama periode (Periode 01), Rencana DOC datang (opsional), Mitra (opsional: PT Contoh Mitra / Belum ditentukan).
- Yang terjadi: "Periode 01 masuk tahap **Persiapan**. Belum ada ayam atau umur yang dihitung."
- Tombol **Siapkan Periode**; perlu sinyal.
- Tautan kecil **Periode Sudah Mulai** untuk kandang yang sudah berisi ayam: tanggal DOC datang sebenarnya, DOC hidup, dan mulai dicatat sejak tanggal berapa. Data sebelum tanggal itu ditandai **Data Belum Lengkap**.

**Keadaan:** kosong · terisi · error · tanpa sinyal (simpan nonaktif dengan alasan).

### Halaman 9 — DOC Masuk dan Pakan Masuk

**DOC Masuk — tujuan:** mencatat DOC yang benar-benar datang dan mengaktifkan periode.

| Isian | Jenis | Catatan |
|---|---|---|
| Tanggal DOC datang | Hari ini / Kemarin / Pilih tanggal | "Tanggal benar-benar datang, bukan tanggal rencana." |
| DOC hidup diterima (ekor) | Hitungan | Wajib, lebih dari 0. "Kapasitas kandang 7.000 ekor." |
| Rincian penerimaan (opsional, bisa dibuka) | DOC ditagih, Bonus DOC, Mati atau ditolak saat datang | Mati saat datang: "Tidak dihitung lagi sebagai mati harian." |
| Pembagian ke bangunan (opsional) | Jumlah per bangunan | "Belum dibagi: 5.000 ekor." Tidak dibagi rata otomatis |
| Lampiran | Opsional | — |

Pratinjau: "Periode 01 aktif mulai 6 Sep 2026 dengan 5.000 ekor." Tombol **Catat DOC**; perlu sinyal. Bila tanggal atau jumlah belum pasti, ada **Simpan Draf** dan periode tetap Persiapan. Hasil: "DOC 5.000 ekor tercatat. Periode 01 aktif."

**Pakan Masuk — tujuan:** mencatat pakan/sapronak yang diterima. Isian: Tanggal diterima, Jenis (Pakan BR-1), Jumlah + satuan (sak/kg; dikonversi hanya bila berat per sak diketahui), Dari (PT Contoh Mitra), Lampiran (opsional). Keterangan: "Catatan ini bukan saldo stok." Tombol **Catat Pakan Masuk**.

**Keadaan:** kosong · pratinjau · belum bisa aktif (tanggal/jumlah kosong) · berhasil · tanpa sinyal.

**Jangan:** mengaktifkan periode dari tanggal rencana, populasi 0, atau membagi rata ke bangunan.

### Halaman 10 — Periksa Belanja (Owner)

**Tujuan:** memeriksa belanja dari ABK dan membukukannya satu per satu, tanpa pindah halaman.

**Isi atas**

- Pilihan tampilan: **Perlu diperiksa (3)** · **Perlu dilengkapi (1)** · **Ditolak (0)** · **Dibukukan (2)**.
- Ringkasan: "3 belanja · Rp700.000". Tombol **Tutup Semua**.

**Baris saat tertutup:** keperluan · pencatat · tanggal · dibayar dengan · ada/tanpa foto · nominal · status · umur ("masuk 1 hari lalu").

**Baris saat dibuka**

- Detail: dicatat oleh dan jam, tanggal belanja, dibayar dengan, toko, dan foto nota bila ada.
- Isian Owner:
  - **Nominal dibayar**: terisi dari catatan ABK dan bisa diubah. Bila berbeda: "Berbeda dari catatan Rudi (Rp150.000). Pastikan sesuai nota."
  - **Barang atau jasa sudah diterima?** Sudah / Belum.
  - **Dibayar dengan**: wajib dipilih bila ABK memilih "Belum tahu".
  - **Dibebankan ke**: Periode 01 · Kandang Utara / Di luar periode (biaya umum).
- **Jika dibukukan**, dihitung ulang dari pilihan:
  - Uang Kas: "Uang Kas Rudi turun Rp150.000. Biaya Periode 01 naik Rp150.000, sekali saja."
  - Uang pribadi ABK: "Utang penggantian ke Yanto Rp350.000 (bukan kasbon). Uang Kas tidak berubah."
  - Belum dibayar ke toko: "Utang ke toko Rp350.000. Kas belum turun sampai dibayar."
  - Peralatan tahan lama: "Dicatat sebagai peralatan, tidak otomatis menjadi biaya satu periode."
- Peringatan mirip (Solar): "Mirip belanja Solar Rp200.000 kemarin oleh Yanto. Pastikan bukan belanja yang sama."
- Aksi: **Setujui & Bukukan** · **Minta Perbaikan** · **Tolak**. Tombol Tolak diberi jarak dari tombol Bukukan.

**Konfirmasi Bukukan:** "Bukukan belanja Listrik?" · Rp150.000 · dampaknya · "Setelah dibukukan, perubahan memakai Koreksi. Catatan lama tetap tersimpan." Tombol **Batal** dan **Bukukan**.

**Minta Perbaikan:** "Apa yang perlu dilengkapi?" (contoh: "Tambahkan nama toko."). "Pesan ini terlihat oleh pencatat." Tombol **Kirim Permintaan**. Status berubah menjadi Perlu Dilengkapi.

**Tolak:** isian Alasan, dengan peringatan "Menolak tidak menghapus uang yang sudah keluar. Bila uang benar terpakai, pilih Minta Perbaikan." Tombol **Tolak Belanja**.

**Periksa Sekaligus** (opsional): pilih beberapa belanja yang lengkap → ringkasan jumlah, total, sumber, dan pengecualian → hasil per belanja, misalnya "2 dibukukan, 1 perlu dilengkapi".

**Keadaan:** daftar · baris dibuka · data kurang (error dekat isian) · konfirmasi · setelah dibukukan ("Belanja Listrik dibukukan.") · tanpa sinyal (Setujui & Bukukan nonaktif: "Perlu sinyal untuk membukukan.") · kosong ("Tidak ada belanja yang perlu diperiksa.").

**Jangan:** persetujuan otomatis berdasarkan nominal, membukukan dengan geser, alasan wajib bila tanpa foto, atau menghapus catatan yang sudah dibukukan.

### Halaman 11 — Uang Kas (Owner) dengan Beri Uang Kas dan Terima Kembali

**Tujuan:** melihat uang usaha per pemegang dan mencatat uang yang diberikan atau dikembalikan.

**Isi**

- Kas tunai usaha **Rp3.250.000**.
- Rekening usaha **—** "Saldo awal belum diisi", dengan tombol **Isi Saldo Awal**. Keterangan: "Saldo awal bukan pendapatan."
- Uang Kas Rudi: saldo dibukukan Rp500.000 · belanja menunggu Rp150.000 · perkiraan di tangan Rp350.000.
- Uang Kas Yanto: saldo dibukukan Rp400.000 · perkiraan **Belum dapat dipastikan**.
- Saat satu pemegang dibuka: riwayat, dan catatan ABK yang **Belum Dicek Owner** (Yanto: Terima Uang Rp300.000, 23 Sep). Owner menautkan catatan itu ke satu penyerahan: pilih penyerahan yang sudah dicatat, atau catat Beri Uang Kas baru. Label aksi usulan: **Cocokkan**. Dua catatan dengan nominal sama tidak digabung otomatis.

**Beri Uang Kas:** Diberikan kepada (Rudi/Yanto), Dari (Kas tunai usaha / Rekening usaha), Nominal, Tanggal, Tujuan (opsional, contoh "Belanja minggu ini"). Pratinjau: "Kas tunai usaha turun Rp500.000. Uang Kas Rudi naik Rp500.000. Ini bukan biaya dan bukan kasbon." Tombol **Bukukan**; perlu sinyal.

**Terima Kembali:** Dari (Rudi), Masuk ke (Kas tunai usaha), Nominal, Tanggal. Pratinjau dampak. Tombol **Bukukan**.

**Keadaan:** normal · pemegang dibuka · ada catatan Belum Dicek Owner · tanpa sinyal.

**Jangan:** transfer bank, penggabungan dengan gaji atau kasbon, atau saldo negatif buatan.

### Halaman 12 — Status Kirim

**Tujuan:** menunjukkan catatan dari HP ini yang belum sampai ke server.

**Isi per catatan:** jenis dan judul · kandang dan tanggal · waktu disimpan · status · aksi.

| Contoh | Status | Aksi |
|---|---|---|
| Belanja Plastik tirai Rp85.000 | Menunggu Kirim | Kirim Ulang |
| Foto nota Plastik tirai | Foto Menunggu Kirim | Kirim Ulang |
| Recording 23 Sep | Catatan Berubah | Buka (menuju perbandingan di halaman 4) |
| Kembalikan Uang Rp50.000 | Belum Pasti Terkirim — cek lagi, jangan catat ulang | Cek Lagi |

Keterangan: "Hanya catatan dari HP ini."

**Keadaan:** ada beberapa catatan · kosong ("Tidak ada catatan yang tertahan di HP ini.") · keluar akun saat masih ada catatan belum terkirim (peringatan dan penjelasan akibatnya).

**Jangan:** janji "semua perangkat sudah sinkron" atau menghapus catatan diam-diam.

### Halaman 13 — Tim Kandang (Owner)

**Tujuan:** membuat dan mengelola akun ABK.

**Isi:** Rudi — Aktif — Kandang Utara · Yanto — Aktif — Kandang Utara, Kandang Selatan · tombol **Tambah ABK**.

**Tambah ABK:** Nama, Username, Kandang yang ditugaskan (bisa lebih dari satu) → **Buat Akun**. Hasil tampil sekali: username dan password sementara (pakai contoh yang jelas palsu, misalnya `CONTOH-0000`), dengan keterangan "Serahkan secara pribadi. Password ini tidak bisa dilihat lagi." ABK wajib mengganti password saat pertama masuk.

**Detail anggota:** **Ubah Username**, **Reset Password**, **Penugasan** (tambah atau cabut kandang), **Nonaktifkan**. Konfirmasi menyebut akibat, misalnya "Mencabut akses Kandang Selatan. Riwayat, gaji, dan kasbon Yanto tetap tersimpan."

**Keadaan:** belum ada ABK ("Belum ada ABK. Anda tetap bisa mencatat sendiri.") · daftar · username sudah dipakai ("Username tidak tersedia.") · password sementara ditampilkan · tanpa sinyal (perlu sinyal).

**Jangan:** email, menampilkan password lama, atau nominal gaji di daftar tim.

### Halaman 14 — Gaji, Kasbon, Upah Pekerjaan

Tiga hal ini tetap **terpisah**. ABK hanya melihat miliknya sendiri, tanpa tombol ubah.

**Kasbon:** saldo per orang yang masih terbuka dan riwayatnya (cair, potongan, pengembalian). Aksi Owner: **Catat Kasbon** (ABK, nominal, tanggal cair, dari akun) dan **Catat Pengembalian**. Kasbon tidak perlu gaji ditentukan dulu.

**Gaji — contoh Yanto, Periode 02 Kandang Selatan**

- Hak Gaji Periode Rp2.500.000 · Sudah dibayar/dipotong sebelumnya Rp0 · Kasbon yang masih terbuka Rp1.200.000.
- "Potong kasbon dari gaji ini?" **Tidak** / **Tentukan jumlah**. Jumlah tidak terisi otomatis; maksimal sebesar sisa hak gaji dan saldo kasbon.
- Pratinjau untuk pilihan Rp400.000: Sisa hak gaji Rp2.100.000 · Sisa kasbon Rp800.000. Tombol **Terapkan Potongan**.
- Langkah terpisah: **Catat Pembayaran** (jumlah yang benar-benar dibayar, tanggal, dari akun). Pembayaran boleh sebagian.

**Upah Pekerjaan:** Yanto — Bersihkan saluran air · 1 pekerjaan × Rp150.000 = Rp150.000 · **Menunggu Owner**. Owner menyetujui menjadi hak, lalu pembayaran dicatat terpisah. Isian ABK/Owner: jenis pekerjaan, jumlah + satuan, tarif yang disepakati, tanggal, catatan.

**Keadaan:** tampilan Owner (semua ABK, dengan aksi) · tampilan ABK (hanya miliknya, tanpa tombol ubah) · belum ada kasbon ("—" Belum ada catatan).

**Jangan:** potongan kasbon otomatis, angka negatif yang tampak seperti "harus dibayar", upah pekerjaan masuk slip gaji, atau label "Saldo Saya".

### Halaman 15 — Hasil Periode (Owner)

**Tujuan:** mencatat hasil dari mitra sesuai data yang dimiliki, tanpa memaksakan laba.

**Isi:** Kandang Selatan · Periode 02. Owner memilih **Rincian RHPP** atau **Uang Diterima**.

**Uang Diterima:** "Catat uang yang benar-benar sudah masuk." Isian: Mitra (PT Contoh Mitra), Tanggal diterima, Masuk ke (Rekening usaha), Jumlah Rp12.500.000, Lampiran (opsional) → **Tinjau** → **Catat Penerimaan**.

**Sesudah tercatat, tampil terpisah:**

| Baris | Nilai contoh |
|---|---|
| Uang diterima | Rp12.500.000 |
| Total hak dari mitra | Belum diketahui |
| Pencocokan | Belum dicocokkan |
| Biaya usaha | Rp4.100.000 (Data Belum Lengkap) |
| Hasil usaha periode | **Belum dapat dihitung** — kurang: rincian RHPP |

**Rincian RHPP** (tugas panjang, bertahap): identitas dokumen → hasil/bonus → biaya dari mitra → potongan (tabungan, utang lama) → hak yang dicairkan → tinjau → sahkan. Bisa disimpan sebagai draf.

**Jangan:** laba Rp0, menganggap kabar "akan ditransfer" sebagai uang masuk, atau menjanjikan baca otomatis dokumen.

### Halaman 16 — Kandang Kosong dan Tutup Buku (Owner)

Dua tindakan berbeda. Tidak ada satu tombol "Tutup Semua".

**Pemeliharaan:** Tanggal selesai sebenarnya · pernyataan "Kandang sudah kosong" · rincian (opsional) → **Tandai Kandang Kosong**, dengan konfirmasi akibat. Setelah itu **Siapkan Periode** berikutnya langsung tersedia, walau keuangan lama belum selesai.

**Keuangan — contoh Kandang Selatan, Periode 02**

| Pemeriksaan | Keadaan | Aksi |
|---|---|---|
| Belanja belum diperiksa | 1 | Periksa |
| Rincian hasil | Belum lengkap | Lengkapi |
| Gaji/upah dan pembebanan biaya | Perlu ditinjau | Tinjau |
| Catatan HP belum terkirim | Data terakhir 16.05 | — |

Informasi, **bukan penghambat**: Gaji Yanto belum dibayar Rp2.100.000 · Kasbon Yanto masih terbuka Rp800.000.

Tombol **Tutup Buku** nonaktif: "Selesaikan penghambat di atas dahulu." Setelah Tutup Buku tersedia **Buka Lagi**, yang wajib disertai alasan.

**Keadaan:** belum kosong · sudah kosong, keuangan belum lengkap · siap Tutup Buku · sudah Tutup Buku.

**Jangan:** stok/opname sebagai syarat, persetujuan recording sebagai syarat, atau utang/kasbon diubah menjadi 0 agar bisa ditutup.

---

## 11. Halaman yang dibuat nanti

| Halaman | Isi singkat |
|---|---|
| Kandang dan Periode | Daftar kandang, status periode, pengaturan Harian/Tidak aktif dengan tanggal berlaku |
| Riwayat Belanja | Semua pembelian yang sudah dicatat, bisa difilter per barang, tanggal, pembeli, status. Bukan sisa stok |
| Riwayat | Recording, koreksi, belanja, pencatat, dan waktu sesuai hak |
| Laporan | Biaya, kas, dan hasil dengan filter, sumber, tanggal, dan kelengkapan data |
| Ekspor | Pilih cakupan, proses, lalu unduh file (CSV/PDF) |
| Akun | Ubah password, perangkat yang masuk, Kurangi Efek Visual, keluar |
| Panduan | Penjelasan singkat sesuai layar; teks utama, gambar/video opsional tanpa putar otomatis |
| Detail Belanja | Tampilan penuh satu belanja bila dibuka dari tautan |

## 12. Sumber

Brief ini merangkum `PRD.md` v0.5, `UX_UI_SPEC.md` v0.3, dan `UX_FLOWS_WIREFRAMES.md` v0.2. Bila ada perbedaan, dokumen sumber yang berlaku. Arahan visual dari dokumen sumber sengaja tidak dimasukkan agar desain sepenuhnya ditentukan pemilik produk.
