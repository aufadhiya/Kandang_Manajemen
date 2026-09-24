# Alur Layar & Wireframe — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.3 — rancangan alur disesuaikan dengan mockup final (K-39) |
| Tanggal | 23 September 2026 |
| Acuan | [PRD v0.6](PRD.md), [UX/UI v0.4](UX_UI_SPEC.md), [audit kemudahan](UX_AUDIT.md), dan [desain frontend](FRONTEND_DESIGN_SPEC.md) |
| Tujuan | Mendokumentasikan urutan pengalaman, informasi minimum, tindakan, dan keadaan layar sebagai acuan perencanaan tertulis |
| Cakupan | R1; 10 alur dan 16 wireframe teks yang memakai ID layar V yang sudah ada |
| Status | Usulan interaksi, belum disetujui sebagai desain final; bukan aplikasi atau hasil uji pengguna |
| Fase kerja saat ini | `.md` saja; tidak membuat mockup/prototype. Dokumen berikut mengikuti [PLANNING.md](PLANNING.md) |
| Contoh | Seluruh identitas, tanggal, jumlah, dan saldo sintetis; bukan data usaha pengguna |
| Bantuan desain | UI UX Pro Max v2.15.0; hasil pencarian lokal ditinjau terhadap kebutuhan proyek |

## Daftar isi

1. [Cara membaca dan batas rancangan](#flow01)
2. [Peta perjalanan dan rujukan](#flow02)
3. [Beranda adaptif dan pola layar](#flow03)
4. [Mulai sebelum DOC — FL-01](#fl01)
5. [DOC dan pakan datang — FL-02](#fl02)
6. [Tim dan akun ABK — FL-03](#fl03)
7. [Kegiatan harian dan recording — FL-04](#fl04)
8. [Uang kas — FL-05](#fl05)
9. [Belanja dan pemeriksaan — FL-06](#fl06)
10. [Kasbon, gaji, dan upah — FL-07](#fl07)
11. [Hasil periode — FL-08](#fl08)
12. [Selesai fisik dan kunci keuangan — FL-09](#fl09)
13. [Offline, konflik, dan pemulihan — FL-10](#fl10)
14. [Layar pendukung dan batas dokumentasi](#flow14)
15. [Rencana validasi dan handoff](#flow15)
16. [Penggunaan skill dan riwayat](#flow16)

<a id="flow01"></a>
## 1. Cara membaca dan batas rancangan

**Arah pengalaman:** aplikasi membantu menjawab “apa yang perlu saya lakukan sekarang?”, bukan meminta seluruh data usaha sebelum boleh dipakai. Pendampingan seperti langkah belajar bertahap, tanpa poin, streak, ujian, atau tur wajib.

- **PRD** tetap sumber aturan bisnis. **UX/UI** tetap sumber inventaris layar, navigasi, token, status, dan skenario UT. Dokumen ini memperinci perjalanan di antara layar tersebut, bukan menggantikan keduanya.
- Keputusan terkonfirmasi tetap mengikuti register K. Semua urutan, penempatan, label baru, serta pengelompokan interaksi di sini adalah **usulan**; tidak menutup Q atau mengubah D menjadi persetujuan pengguna.
- `FL` adalah alur; `WF` adalah wireframe teks; `V` dan `UT` merujuk [inventaris dan tes UX](UX_UI_SPEC.md#ux07). Satu layar V bisa mempunyai beberapa keadaan WF, bukan penambahan menu baru.
- Sketsa teks yang sudah ada dipertahankan sebagai penjelasan dalam Markdown, bukan perintah membuat mockup. Fase berikut tetap dokumen perencanaan, tanpa aset visual atau aplikasi.
- `[Tombol]` menandai aksi; `(opsional)` berarti boleh kosong. Wireframe memperlihatkan urutan baca, bukan ukuran akhir. Tidak semua isi harus muat sekaligus tanpa scroll.
- Label bisnis ditampilkan ke pengguna; nama internal seperti `DRAFT`, `UNRECONCILED`, dan `LOCKED` hanya untuk handoff. **Persiapan** berarti DRAFT, bukan periode aktif.
- Review/posting uang oleh Owner secara online mengikuti **default D-03/Q-03**. Tidak ada keputusan delegasi/auto-post baru. Recording valid langsung berlaku tanpa approval rutin Owner, sesuai K-25.
- Tetap di luar R1: persediaan/pemakaian rutin, panen per DO, FCR/IP, kalkulasi kontrak, OCR/import otomatis, buku pribadi Owner, Mandor/PPL, IoT, dan CCTV. Jangan membuat menu contoh untuk fitur tersebut.
- Dokumen ini tidak memilih stack, penyedia layanan, atau library. Tampilan, token, dan pilihan solid/kaca mengikuti mockup final di [FRONTEND_DESIGN_SPEC](FRONTEND_DESIGN_SPEC.md) (K-39); sketsa teks di dokumen ini hanya menjelaskan urutan dan isi, bukan tata letak. Tidak ada font daring atau animasi baru.

<a id="flow02"></a>
## 2. Peta perjalanan dan rujukan

```text
Owner menerima akun → Masuk → Ganti password awal
  → Data Kandang → Tim (boleh nanti) → Pilih recording
  → Siapkan Periode → Persiapan → DOC Masuk → Aktif

Sebelum maupun sesudah DOC:
  Uang Kas → Belanja → Pemeriksaan Owner → Pembukuan
  Kasbon mandiri; gaji dan upah tetap jalur terpisah

Jika DAILY: Recording bersama → Tercatat → Koreksi bila perlu
Jika OFF:   Tidak ada tugas recording; keuangan tetap berjalan

Kandang Kosong → boleh siapkan periode berikut
Keuangan lama → Hasil Periode → lengkapi yang perlu → Tutup Buku
```

Keuangan tidak harus menunggu DOC atau selesai fisik. Hasil/pembayaran dapat dicatat sesuai kejadian; panah terakhir bukan kewajiban menunggu semua uang cair.

| Alur | Tujuan dan layar | Aturan acuan | Skenario UX terkait |
|---|---|---|---|
| FL-01 | Mulai bertahap; V-03, V-04, V-01 | ONB-01–ONB-03, ONB-10–ONB-11, CYC-03, AC-94–AC-95 | UT-04–UT-06 |
| FL-02 | Catat DOC/pakan yang datang; V-07, V-05 | CYC-01–CYC-04, INV-17, AC-92 | UT-04–UT-05, UT-15 |
| FL-03 | Tambah/kelola ABK; V-20, V-22, V-03 | ONB-04, SEC-15–SEC-16, D-25, AC-90–AC-94 | UT-01–UT-03, UT-32–UT-34, UT-36 |
| FL-04 | Recording bersama; V-01, V-02, V-06, V-25 | REC-14–REC-19, DATA-04, AC-87–AC-91 | UT-07–UT-15 |
| FL-05 | Catat penyerahan/pengembalian uang; V-08, V-13 | CASH-01–CASH-04, CASH-10, FIN-10–FIN-11, OFF-16 | UT-16, UT-21, UT-23 |
| FL-06 | Belanja dan pemeriksaan; V-09–V-12 | CASH-05–CASH-09, CASH-16, FIN-11, FIN-13, GOLD-30 | UT-17–UT-22, UT-37 |
| FL-07 | Kasbon/gaji/upah; V-14–V-16 | PAY-01–PAY-15, GOLD-05–GOLD-06, AC-98; hanya bagian R1 | UT-23–UT-25 |
| FL-08 | Catat RHPP atau uang diterima; V-17, V-18 | K-36, SET-01–SET-09, SET-11, COST-11, GOLD-20 | UT-26–UT-27 |
| FL-09 | Akhiri fisik, kunci atau koreksi keuangan; V-05, V-26 | CYC-05–CYC-11, SET-11, AC-65, AC-84 | UT-28 |
| FL-10 | Pulihkan catatan/akses; V-19, V-22, V-25 | OFF-03, OFF-06, OFF-09–OFF-10, OFF-15–OFF-18, SEC-13 | UT-03, UT-11, UT-29–UT-34, UT-43 |

UT-35 untuk ekspor; UT-38–UT-49 berlaku lintas layar, termasuk keypad, kerja di tempat, arahan bebas, bantuan pintar, dan bahasa. Rujukan di atas adalah rencana cakupan, bukan klaim tes sudah dijalankan.

<a id="flow03"></a>
## 3. Beranda adaptif dan pola layar

### 3.1 Satu saran utama, navigasi tetap

Usulan prioritas kartu: **hambatan akses/penyimpanan → lanjutkan pekerjaan yang tertahan → kebutuhan keadaan kandang → pengaturan opsional**. Ringkasan belanja yang perlu diperiksa tetap terlihat meski saran utama sedang setup. Jangan menyembunyikan urusan uang di balik tutorial.

| Keadaan yang diketahui | Pesan/kartu utama | Aksi | Jangan dilakukan |
|---|---|---|---|
| Owner belum membuat kandang | “Mulai dari data kandang.” | Data Kandang | Meminta kontrak, gaji, dan histori lengkap |
| Kandang ada, periode belum disiapkan | “Siapkan periode saat dibutuhkan.” | Siapkan Periode; Catat Belanja tetap tersedia | Membuat tanggal/populasi DOC otomatis |
| Periode Persiapan | “Catat DOC saat benar-benar datang.” | DOC Masuk; Catat Belanja tetap tersedia | Menagih recording atau menampilkan umur ayam |
| Aktif + DAILY, tanggal ini belum ada recording server | “Recording hari ini belum tercatat.” | Recording Harian | Menganggap HP ABK lain tidak punya draf |
| Aktif + DAILY, sudah tercatat | Nama pencatat, waktu, ringkasan yang tersedia | Lihat; Koreksi | Meminta ABK kedua mengisi laporan baru |
| Aktif + OFF | Ringkasan kegiatan/uang sesuai izin | Catat Belanja | Kartu “recording tertinggal” atau angka produksi nol |
| Owner mempunyai belanja masuk | Jumlah yang perlu diperiksa dan umur pengajuan | Periksa Belanja | Mengubah saldo sebelum dibukukan |
| Fisik selesai, keuangan belum lengkap | “Keuangan periode ini belum selesai.” | Hasil Periode; Siapkan Periode berikut tetap tersedia | Menahan periode baru karena RHPP belum cair |
| Draf lokal, konflik, atau hasil kirim belum diketahui | Jumlah catatan pada HP ini dan masalahnya | Status Kirim | Janji “semua perangkat sudah sinkron” |
| ABK belum mendapat penugasan | “Belum ada kandang yang ditugaskan.” | Akun; bantuan kepada Owner | Memberi akses lewat pemilih kandang bebas |

Pergantian kartu terjadi setelah keadaan diketahui, bukan memindahkan fokus atau menukar tombol saat sedang ditekan. **Nanti** menunda pengaturan opsional, bukan menghapus klaim/konflik. Kartu tidak menjanjikan jadwal obat, kebutuhan pakan, atau laba dari tebakan.

**Aturan arahan bebas (K-38, UX-17):**

- Tampilkan satu **Saran berikutnya** dan paling banyak dua saran pendamping. Setiap saran punya satu tombol aksi dan **Kenapa?** yang menyebut data dasarnya.
- Tombol **Catat** dan navigasi utama selalu tersedia. Pengguna boleh mencatat belanja, uang kas, atau membuka laporan sebelum mengikuti saran.
- Daftar persiapan menampilkan semua langkah yang relevan dan boleh dikerjakan dalam urutan apa pun. Langkah yang bergantung pada data lain tetap terlihat dengan alasan singkat, misalnya “Perlu periode dulu”.
- **Nanti** pada saran opsional menyembunyikannya sampai ada kejadian yang relevan (misalnya periode baru atau pengguna membuka layar terkait), bukan muncul lagi setiap kali aplikasi dibuka. Saran wajib seperti belanja menunggu Owner tidak dapat disembunyikan, tetapi tidak berupa pop-up.
- Saat membuka aplikasi tidak ada pop-up tur atau modal saran. Selesai satu langkah memberi pesan singkat dan saran berikutnya; tanpa poin, streak, atau hitung mundur.
- Kemajuan persiapan (“2 dari 5 selesai”) memakai data tersimpan dan menghilang setelah persiapan selesai.

### 3.2 Bingkai bersama

1. **Konteks terlihat:** usaha/kandang/periode, tanggal relevan, dan waktu data. Satu kandang berizin boleh langsung terpilih; beberapa kandang memerlukan pilihan yang jelas.
2. **Satu tugas utama:** judul pendek, bantuan satu kalimat bila perlu, detail tambahan dapat dibuka. Ini bukan batas jumlah data yang sah.
3. **Navigasi tetap (mockup K-39):** Owner memakai Ringkasan / Transaksi / Catat / Kandang / Lainnya; ABK memakai Hari Ini / Uang Kas / Catat / Riwayat / Lainnya. **Catat** adalah tombol bulat di tengah; Laporan Owner ada di Lainnya.
4. **Form fokus:** saat mengedit, action bar menggantikan navigasi bawah; tidak bertumpuk. Kembali menjaga draf dan konteks asal. Modal tidak bersarang.
5. **Isi yang jujur:** belum diketahui ditulis demikian. Rp0 hanya untuk nol yang memang diketahui. Nominal rupiah bulat; kuantitas memakai satuan, persentase boleh desimal.

**Kerja di tempat (D-27):** input singkat seperti Terima/Kembalikan Uang, Beri Uang Kas, input per tab Recording Harian, dan koreksi satu nilai dibuka sebagai lembar di atas layar asal. Detail daftar dibuka-tutup di baris yang sama (`[v]` tertutup, `[^]` terbuka pada sketsa). Halaman fokus untuk Catat Belanja, Mulai Kandang, Recording Harian bertab, Rincian RHPP, Tutup Buku, dan detail akun (mockup K-39). Tampilan persis setiap layar ada di [FRONTEND_DESIGN_SPEC](FRONTEND_DESIGN_SPEC.md#fd07). Aturan tombol kembali, alamat lembar, dan satu lembar aktif mengikuti [UX/UI §16.4](UX_UI_SPEC.md#ux16).
6. **Simpan bukan selalu kirim:** Draf, Menunggu Kirim, Tercatat, Menunggu Owner, Dibukukan, dan Lunas menunjukkan akibat yang berbeda. Sukses tidak diumumkan sebelum penyimpanan yang bersangkutan berhasil.

<a id="fl01"></a>
## 4. FL-01 — Mulai sebelum DOC

**Masuk dari:** akun Owner yang diprovisikan Admin setelah verifikasi. **Selesai ketika:** Owner mempunyai konteks kandang dan dapat mulai bekerja; tidak wajib seluruh setup selesai. Aktivasi akun/perubahan pengaturan memerlukan online.

### WF-01 — Masuk dan aktivasi · V-03

```text
Kandang Manajemen
Masuk
Username                    [              ]
Password                    [              ] [Lihat]
[Masuk]
Butuh bantuan?

Khusus password sementara yang masih sah:
Ganti Password → [Simpan Password] → Data Kandang
```

ABK menerima akun dari Owner, bukan mendaftar sebagai Owner. Izinkan paste/password manager. Tidak ada email, kode usaha tambahan, pendaftaran publik, atau password nyata pada contoh. Salah masuk memberi pesan umum; password sementara kedaluwarsa/terpakai memerlukan penerbitan ulang berizin. Bantuan pemulihan tidak menjanjikan reset hanya dari username; prosedurnya tetap Q-02.

### WF-02 — Data Kandang · bagian setup V-04

```text
Data Kandang
Mulai dari tempat pencatatan Anda.
Nama usaha                  [Usaha Contoh  ]
Nama kandang                [Kandang Utara ]
Zona waktu                  [WIB         v]
Rincian lain (opsional)      [Buka]
[Simpan & Lanjut]
[Nanti]
```

- Nama usaha yang sudah diketahui boleh diisi dari konteks dan dapat diperiksa. Zona waktu dipilih/dikonfirmasi, bukan ditebak sebagai WIB untuk semua kandang.
- Minimum untuk menyimpan kandang: identitas usaha, nama kandang, zona waktu yang valid. Bangunan, kapasitas, alamat rinci, mitra, kategori, akun kas, dan gaji dapat dilengkapi saat relevan.
- **Nanti** boleh keluar tanpa membuat kandang kosong. Jika belum disimpan, tampilkan status draf yang sebenarnya; saat kembali, jangan meminta data yang sudah tersimpan lagi.
- Setelah simpan: tawarkan **Tim Kandang** atau **Nanti**, lalu pilihan recording. Tim bukan prasyarat Owner mencatat sendiri.

### WF-03 — Pilih recording dan siapkan periode · V-04

```text
Recording Harian
( ) Tidak aktif             OFF
    Tetap bisa mencatat keuangan.
( ) Harian                  DAILY
    Pakan, mati/afkir, dan sampling bila dilakukan.
[Lanjut]                     [Nanti]

Siapkan Periode
Kandang Utara
Nama periode                [Periode 01    ]
Rencana DOC (opsional)       [Tanggal       ]
Mitra (opsional)             [Pilih / nanti ]
[Siapkan Periode]
Belum mengaktifkan pemeliharaan.
```

Tidak ada mode yang dipilih diam-diam. OFF adalah default aman internal sebelum Owner mengaktifkan DAILY, bukan persetujuan pengguna yang direkayasa. Menunda pilihan tetap mengizinkan belanja pada kandang; saat menyimpan periode, minta konfirmasi mode dan nama/kode periode. Rencana DOC tidak menggantikan tanggal kedatangan aktual. Memilih DAILY sebelum DOC belum membuat tugas harian.

### WF-04 — Ringkasan persiapan · V-01

```text
Usaha Contoh / Kandang Utara                [Ganti]
Ringkasan
Periode 01 · Persiapan

DOC belum dicatat masuk.
[DOC Masuk]
Gunakan saat DOC benar-benar datang.

[Catat Belanja]              [Uang Kas]
Perlu diperiksa: belum ada pengajuan diterima
Tim Kandang                 [Tambah] [Nanti]
Pengaturan lainnya          [Buka]

Ringkasan / Transaksi / (+ Catat) / Kandang / Lainnya
```

**Cabang penting:**

- Belanja persiapan dapat dicatat sebelum periode ada; alokasinya boleh belum ditentukan. Melengkapi periode nanti menaut transaksi lama, bukan membuat biaya kedua.
- Saat butuh sumber kas yang belum ada, tawarkan membuat akun kas dan mencatat saldo awal yang diketahui. Jelaskan saldo awal bukan pendapatan; jangan menganggap saldo belum diisi = nol. Setelah itu kembali ke draf transaksi asal.
- **Periode Sudah Mulai** menjadi tautan sekunder pada Siapkan Periode. Minta tanggal DOC/populasi awal yang sebenarnya dan awal cakupan pencatatan. Data historis yang belum diketahui tetap parsial; bukan DOC baru pada hari mendaftar. Tanpa data aktivasi yang sah, tetap Persiapan dan keuangan tetap bisa dicatat sesuai izin.
- Setelah setup relevan selesai, ringkasan beralih ke keadaan operasional; tidak menampilkan checklist onboarding permanen atau persentase selesai palsu.

<a id="fl02"></a>
## 5. FL-02 — DOC dan pakan datang

**Masuk dari:** DOC Masuk di Ringkasan/Persiapan atau Kandang → Periode. **Pelaku:** Owner. **Selesai ketika:** penerimaan valid tercatat; khusus DOC, periode aktif hanya setelah syarat aktivasi terpenuhi.

### WF-05 — DOC Masuk · V-07

```text
DOC Masuk
Kandang Utara · Periode 01
Tanggal datang sebenarnya   [10 Sep 2026   ]
DOC hidup diterima          [5.000 ekor    ]
Rincian penerimaan (opsional)[Buka]
Pembagian bangunan          [Isi nanti     ]
Lampiran (opsional)          [Tambah]

Periode akan aktif dengan data ini.
[Catat DOC]
```

- Minimum aktivasi: tanggal kedatangan aktual valid dan DOC hidup diterima >0; maksimal satu periode aktif pada kandang. Pratinjau kandang, periode, tanggal, dan populasi tetap terlihat sebelum konfirmasi.
- DOC ditagihkan, bonus, ditolak/mati saat kedatangan hanya diisi bila diketahui, terpisah dari populasi hidup. Tidak menghitung kematian yang sama dua kali.
- Bangunan belum lengkap tidak menghalangi aktivasi: tampilkan jumlah belum dialokasikan; jangan membagi rata atau membuat bangunan fiktif. Rincian yang diisi harus berjumlah tepat; peringatan kapasitas mengikuti CYC-04.
- Jika tanggal/jumlah aktual belum tersedia, **Simpan Draf** tersedia dengan penjelasan periode belum aktif. Sukses aktivasi hanya setelah konfirmasi server; timeout mengikuti FL-10. Periode lain masih aktif memberi tautan meninjau periode itu, bukan menutupnya otomatis.
- **Pakan/Sapronak Masuk** memakai cabang terpisah V-07: tanggal, jenis, jumlah/unit, dan konteks penerimaan; bukti opsional. Kuantitas sak hanya dikonversi jika ukuran sak diketahui. Tercatat sebagai informasi, bukan stok, biaya, DAILY, atau aktivasi periode.

<a id="fl03"></a>
## 6. FL-03 — Tim dan akun ABK

**Masuk dari:** setup opsional, Kandang → Tim Kandang, atau Lainnya. **Pelaku:** Owner online, tenant sendiri. **Selesai ketika:** akun dan penugasan sah tersedia; ABK lain tetap aktif.

### WF-06 — Tim Kandang · V-20

```text
Tim Kandang · Kandang Utara
ABK A                 Aktif                  [Buka]
ABK B                 Aktif                  [Buka]
[Tambah ABK]

Tambah ABK
Nama                       [              ]
Username                   [              ]
Kandang yang ditugaskan    [Kandang Utara  ]
[Buat Akun]
Password sementara diserahkan secara privat.
```

1. Pilih pekerja yang sudah ada atau tambah orang baru sebelum membuat akun; jangan menggandakan identitas pekerja yang sudah mempunyai saldo/hak.
2. Jika ABK sudah mempunyai akun dalam tenant ini, gunakan **Tambah Penugasan**, bukan kredensial baru. Penugasan ke beberapa kandang mengikuti usulan SEC-15/D-25.
3. Pembuatan yang berhasil menampilkan kredensial sementara sekali kepada Owner untuk diserahkan privat. Tidak ada pengiriman publik, password di riwayat, atau tangkapan layar bukti yang memuat rahasia. ABK wajib mengganti password saat aktivasi.
4. Detail anggota menyediakan **Ubah Username**, **Reset Password**, **Penugasan**, dan **Nonaktifkan** sesuai izin. Bedakan mencabut akses satu kandang dari menonaktifkan akun seluruhnya; tampilkan akibat dan minta konfirmasi.
5. Username bentrok memakai pesan “Username tidak tersedia.” tanpa pemilik/tenant lain. Reset memerlukan autentikasi ulang Owner, mencabut sesi lama, dan tidak menampilkan password sebelumnya.
6. Menonaktifkan akun/mencabut penugasan tidak menghapus gaji, kasbon, kas pegangan, atau histori. Antrean lama tidak diwariskan ke pengganti; ditangani lewat FL-10.

Pekerja tanpa login tetap boleh dicatat; tidak wajib membuat akun untuk membayar upah. Tidak ada gaji/nominal kas di daftar tim yang dapat dilihat ABK lain.

<a id="fl04"></a>
## 7. FL-04 — Kegiatan harian dan recording bersama

**Masuk dari:** Hari Ini ABK, Ringkasan Owner, atau Kandang → Periode. **Syarat:** periode/tanggal dalam cakupan DAILY dan pengguna berizin. **Selesai ketika:** server menerima versi berlaku, bukan ketika baru tersimpan di HP.

### WF-07 — Ringkasan Owner saat aktif · V-01

```text
Usaha Contoh / Kandang Utara / Periode 01    [Ganti]
Ringkasan · 23 Sep 2026
Aktif · Data server terakhir 16.05

1 belanja perlu diperiksa                   [Periksa]
Recording hari ini · Tercatat oleh ABK A     [Lihat]
Biaya dibukukan periode ini   Rp300.000      [Rincian]
Belanja belum diperiksa       Rp150.000      [Rincian]
Hasil usaha                  Belum dapat dihitung

[Catat Belanja] [Uang Kas] [Hasil Periode]
```

Angka di atas adalah contoh tersendiri, bukan total seluruh skenario dokumen. Ringkasan semua kandang menggunakan cakupan/waktu yang terlihat, lalu masuk ke kandang tertentu sebelum input. Tidak menggabungkan saldo kas ABK dengan gaji atau kasbon. Tautan membuka sumber, bukan hanya angka besar tanpa penjelasan.

### WF-08 — Hari Ini ABK · V-02

```text
Kandang Utara / Periode 01                  [Ganti]
Hari Ini · 23 Sep 2026
Data server terakhir 16.05

Recording Harian · Tercatat
Dicatat ABK A, 16.00                        [Lihat]
Catatan ini dipakai bersama.                [Koreksi]

[Catat Belanja] [Terima Uang] [Upah Pekerjaan] [Uang Kas]
Catatan Anda di HP ini: 1 belum terkirim     [Buka]

Hari Ini / Uang Kas / (+ Catat) / Riwayat / Lainnya
```

Jika belum ada data server, ajakan **Recording Harian** menggantikan kartu tercatat. Saat OFF atau sebelum DOC, tidak ada tugas recording. ABK kedua membuka catatan yang sama, bukan mengirim laporan terpisah. Nominal uang milik ABK lain maupun laba Owner tidak tampil.

### WF-09 — Recording Harian · V-06

```text
Kandang Utara · Periode 01 · Hari ke-18 · Rabu, 23 Sep 2026   (Aktif)
Recording Harian                           [+ Catat Pakan]
[ Pakan ]  [ Mortalitas ]  [ Sampling ]          (tab)

Tab Pakan
  Total Pakan Tercatat 545 kg · 6 hari data · Rata-rata 90,8 kg/hr
  Riwayat per tanggal: tanggal · status · Hari ke- · jenis + kg · pencatat
  Lembar: Tanggal · Jenis Pakan (+ Tambah Jenis) · Kuantitas [100][kg]
          · Kemarin 96 kg · Catatan · [Simpan Draf] [Kirim Recording]

Tab Mortalitas
  Total Mati Tercatat 15 ekor · Afkir 3 ekor · Rata-rata mati 2,5 ekor/hr
  Riwayat: tanggal · status · Mati 3 ekor · Afkir 1 ekor · pencatat
  Lembar: Tanggal · Mati [-][  ][+] ekor · Afkir [-][  ][+] ekor · Catatan

Tab Sampling
  Sampling Terakhir 0,7 kg/ekor sampel · 21 Sep · 2 kali sampling
  Riwayat: tanggal · 25 ekor · 17,5 kg · 0,7 kg/ekor, atau "Tidak sampling"
  Lembar: Tanggal · Sampling hari ini? [Tidak dilakukan] [Dilakukan]
          · Jumlah ayam ditimbang · Total bobot · Rata-rata (hitung)

Satu catatan bersama untuk seluruh kandang · Berlaku langsung
```

- Recording Harian berbentuk tab sesuai keputusan pengguna (K-39). Ketiga tab mengisi **satu** catatan bersama per periode dan tanggal; mengirim dari satu tab mengirim revisi penuh dengan bagian tab lain apa adanya (kosong tetap kosong). Tampilan persis, lembar per tab, dan keadaan ada di [FRONTEND_DESIGN_SPEC §7.2](FRONTEND_DESIGN_SPEC.md#fd07-rec).
- Angka contoh menggambarkan input pengguna, bukan nilai awal. Jangan menyalin kuantitas kemarin; nol hanya setelah dinyatakan. Saran jenis/satuan pakan boleh dipilih; 1 sak tidak otomatis 50 kg.
- Sampling bukan kewajiban harian. Bila tidak dilakukan, tidak membuat 0 kg; bila dilakukan, jumlah sampel dan total bobot >0, tanggal/waktu pengukuran serta satuan jelas. Rata-rata sampel bukan bobot seluruh populasi.
- Draf parsial tetap dapat disimpan. Data yang belum lengkap ditandai, bukan diisi nol agar terlihat lengkap. Error input ada dekat field dan ringkasan yang dapat difokuskan; teks tidak hilang.
- **Kirim** online memvalidasi izin, tanggal, mode, angka, dan versi. Sesudah receipt: **Tercatat — dipakai bersama.** Tidak masuk Periksa Belanja dan tidak mengubah uang/stok/biaya.
- **Koreksi** membuka nilai berlaku berikut pencatat/waktu, meminta alasan singkat dan menampilkan perubahan. Mengubah 100 kg ke 90 kg membuat nilai berlaku 90 kg, bukan 190 kg. Retry operasi sama tidak menambah catatan.

### WF-10 — Konflik recording · keadaan V-06/V-19

```text
Catatan Berubah
Kandang Utara / 23 Sep 2026
                     Di server       Draf Anda
Pakan A              100 kg          90 kg
Mati                 2 ekor          2 ekor
Afkir                0 ekor          0 ekor
Pencatat             ABK A, 16.00    Anda, di HP ini

[Pakai Data Server]          [Susun Koreksi]
Draf Anda belum mengganti catatan bersama.
```

Tampilkan semua perbedaan yang relevan, bukan pakan saja jika sampling juga berubah. **Pakai Data Server** membaca versi terbaru dan meminta konfirmasi sebelum melepas perubahan lokal; bukan menulis ulang server. **Susun Koreksi** memakai versi server terbaru, lalu nilai yang dipilih dan alasan; jika berubah lagi, ulangi pencocokan. Hanya pengguna yang masih berhak melihat nilai pembanding. Ini penyelesaian konflik, bukan approval rutin Owner.

<a id="fl05"></a>
## 8. FL-05 — Uang kas

**Masuk dari:** Uang Kas. Owner memilih pemegang; ABK hanya dirinya sendiri. Uang kas berarti uang usaha yang dipegang, bukan uang gaji atau kasbon.

### WF-11 — Uang Kas ABK · V-08

```text
Uang Kas · ABK A · Kandang Utara
Data sampai 23 Sep 2026, 15.00
Saldo dibukukan                      Rp500.000
Belanja menunggu Owner                Rp150.000
Perkiraan uang di tangan              Rp350.000
Perkiraan catatan, bukan hasil hitung uang fisik.

[Terima Uang]   [Kembalikan Uang]   [Catat Belanja]
Riwayat kas                            [v]
```

Perkiraan hanya muncul bila sumber/arah klaim jelas, tidak ada penerimaan pending, dan hasil tidak negatif. Jika syarat tidak terpenuhi, ganti dengan **Belum dapat dipastikan**, sambil mempertahankan rincian saldo, klaim keluar, dan penerimaan pending. Klaim ditolak belum otomatis selesai.

| Langkah | Owner | ABK |
|---|---|---|
| Catat kejadian | Pilih sumber, pemegang/kandang, arah penyerahan/pengembalian, tanggal, nominal; tujuan opsional | Terima Uang/Kembalikan Uang (lembar): arah uang, tanggal, nominal, pihak/konteks yang diketahui |
| Tinjau | “Uang sudah diserahkan/diterima?”; lihat sisi kas sumber dan pemegang | Lihat bahwa ini laporan kejadian, bukan saldo yang disahkan |
| Konfirmasi | Online, membukukan satu transfer internal; bukan biaya | Kirim klaim atau simpan lokal; Owner mencocokkan ke transfer yang sama |
| Hasil | Detail kedua sisi dan status rekonsiliasi | Status klaim/konfirmasi yang diketahui, tanpa menambah saldo kedua kali |

Aplikasi tidak mentransfer uang bank. Owner tidak membukukan rencana sebagai uang sudah berpindah. Dua catatan dengan nominal sama tidak digabung otomatis; link ke kejadian yang benar harus diperiksa. Saldo awal atau sumber dana yang belum jelas perlu dilengkapi, bukan kas negatif buatan.

<a id="fl06"></a>
## 9. FL-06 — Belanja dan pemeriksaan

**Masuk dari:** Catat Belanja. **Selesai untuk ABK:** klaim diterima server, menunggu pemeriksaan. **Selesai untuk Owner:** data lengkap dibukukan sesuai kejadian; dibukukan tidak selalu sudah dibayar.

### WF-12 — Catat Belanja · V-09

```text
<- Catat                                           (R)
Draf tersimpan di HP · 09.10                 Terhubung
Catat Belanja                          OPERASIONAL ABK
Kandang Utara · Periode 01 · 23 Sep 2026
Keperluan *                 Contoh: Bensin, Pakan, Vitamin
[Listrik                                   (x)]
Pilihan Cepat: [Solar] [Gas] [Listrik v] [Sekam]
Nominal Belanja *                 Ketuk keypad di bawah
                 Rp 150.000
    seratus lima puluh ribu rupiah
Tanggal Belanja   [v Hari ini] [Kemarin] [Pilih]
Dibayar Dengan    ( ) Uang Kas saya
                  ( ) Uang pribadi saya (minta diganti)
                  ( ) Belum dibayar ke toko (Bon/Hutang)
                  ( ) Belum tahu
Foto Nota / Struk (opsional)   [Tambah Foto Nota]
[Keyboard HP]                        [+50rb] [+100rb]
[1][2][3] [4][5][6] [7][8][9] [000][0][hapus]
[Tinjau Belanja]
Owner memeriksa & menyetujui sebelum dibukukan.
```

**Tinjau** memperlihatkan konteks, nominal, sumber, dan bukti jika ada dalam ringkasan pendek; **Kirim** mengajukan klaim. Ini satu halaman fokus dan satu lembar Tinjau, bukan satu halaman per field (mockup K-39, [FRONTEND_DESIGN_SPEC §7.3](FRONTEND_DESIGN_SPEC.md#fd07)). Pilihan keperluan hanya saran dari riwayat sendiri; nominal tidak pernah diisi otomatis. Jika mirip belanja yang sudah ada, tampilkan “Mirip belanja Listrik Rp150.000 kemarin. [Tetap Kirim] [Lihat]” tanpa memblokir. Sumber **Belum Tahu** boleh dikirim; bantuan menyebut Owner akan melengkapinya.

- Keperluan/barang/jasa boleh teks baru; tidak perlu master barang/SKU atau kategori akuntansi. Listrik dan jasa sama sahnya dengan gas/solar. Rincian tambahan dapat berisi toko, jumlah/unit, pembayaran parsial, penerimaan barang/pekerjaan, dan beberapa baris bila dibutuhkan.
- **Uang Pribadi** pada ABK berarti talangan ABK, bukan kasbon. **Belum Dibayar** berarti utang toko bila pembelian sudah diterima/disahkan. **Belum Tahu** tidak diubah menjadi kas default.
- Foto kosong tidak memunculkan alasan wajib. Foto gagal unggah tidak menghapus teks yang sudah terkirim; nota susulan masuk dokumen sama.
- Minimum untuk klaim siap ditinjau: konteks, kejadian/keperluan, tanggal dan nominal; pilihan sumber boleh belum diketahui. Data yang kurang tetap ditandai untuk dilengkapi. Sebelum posting, Owner memastikan penerimaan, sumber, pembayaran, klasifikasi, serta alokasi/status belum dialokasikan yang sah.
- Setelah diterima server: **Menunggu Owner**, bantuan “Owner belum membukukan belanja ini.” Dari detail, ABK melihat status/permintaan koreksi, bukan tombol menyetujui atau membayar sendiri.

### WF-13 — Periksa Belanja · V-11/V-10

```text
Periksa Belanja
Perlu diperiksa 1            [Filter]
ABK A · 23 Sep · Listrik     Rp150.000      [^]
  (baris terbuka di tempat, tanpa pindah halaman)
Dilaporkan ABK A · Uang Kas ABK A
Barang/jasa diterima         [Konfirmasi]
Pembayaran nyata            [Rp150.000]
Pembebanan                  [Periode 01  v]
Lampiran                    Tidak ada (opsional)

Dampak jika dibukukan:
Kas ABK A turun Rp150.000; biaya Rp150.000 sekali.
[Setujui & Bukukan]
[Minta Perbaikan]
                              [Tolak]
```

**Cabang pembukuan:**

| Kejadian | Dampak yang ditampilkan sebelum konfirmasi |
|---|---|
| Habis pakai/jasa diterima, dibayar kas pegangan | Kas turun dan biaya diakui sekali; klaim sementara diganti efek sah |
| ABK menalangi | Utang penggantian kepada ABK yang tepat; bukan kasbon. Penggantian nanti tidak membuat biaya kedua |
| Belum dibayar ke toko | Utang pembelian; kas belum turun. Pembayaran berikutnya hanya melunasi utang |
| Uang muka, barang belum diterima | Uang muka, belum biaya barang diterima |
| Peralatan tahan lama | Klasifikasi terpisah; bukan seluruh harga menjadi biaya satu periode otomatis; Q-04 tetap terbuka |
| Owner mencatat langsung | Form dan pratinjau yang sesuai sumber uang Owner/usaha, lalu **Bukukan** online; tidak membuat antrean menyetujui diri sendiri |

Data sumber/versi yang belum jelas menghentikan posting dokumen itu saja. Bila menolak klaim, Owner memberi alasan keputusan; uang yang diklaim sudah keluar tetap perlu diselesaikan lewat resolusi FIN-11. Tidak mengembalikan saldo atau memotong gaji secara otomatis.

**Periksa Sekaligus** adalah pilihan lanjutan: jumlah/total/sumber serta pengecualian terlihat. Hanya versi yang ditinjau dan lengkap dibukukan, dengan hasil per item. “4 dibukukan, 1 berubah” bukan gagal semua dan bukan sukses semua. Saat offline, tidak ada approval yang diam-diam dieksekusi belakangan tanpa pemeriksaan ulang.

<a id="fl07"></a>
## 10. FL-07 — Kasbon, gaji, dan upah

**Masuk dari:** Lainnya → Kasbon / Gaji / Upah Pekerjaan. **Pelaku:** Owner mengelola; ABK melihat miliknya. Keempat jalur termasuk Uang Kas tetap terpisah.

**Kasbon tanpa gaji:** pilih ABK → nominal dan tanggal pencairan nyata → sumber kas usaha → tinjau → **Catat Kasbon** online. Periode, tujuan, dan perjanjian gaji tidak menjadi syarat pencairan. Sumber buku pribadi Owner bukan fitur R1.

### WF-14 — Hak gaji dan potongan pilihan Owner · V-14/V-15

```text
Gaji · ABK A · Periode 01
Hak Gaji Periode                     Rp1.000.000
Sudah dibayar/dipotong sebelumnya    Rp0
Kasbon yang masih terbuka            Rp1.200.000

Potong kasbon dari gaji ini?
( ) Tidak   ( ) Tentukan jumlah
Jika ditentukan                     [Rp400.000 ]

Pratinjau setelah potongan pilihan Anda:
Sisa hak gaji                        Rp600.000
Sisa kasbon                          Rp800.000
[Terapkan Potongan]

Pembayaran gaji adalah langkah terpisah:
[Catat Pembayaran]
```

- Contoh Rp400.000 adalah pilihan Owner, bukan default terisi. Tanpa pilihan/konfirmasi tidak ada potongan otomatis. Potongan penuh maksimal hak tunai yang masih tersedia dan saldo kasbon, bukan batas maksimum pencairan kasbon.
- Hak gaji difinalkan sesuai kesepakatan sebelum potongan/pembayaran diterapkan. Pembayaran/potongan sebelumnya mengurangi hak tersedia; tidak memakai bruto kembali. Saldo opening yang belum cocok harus direkonsiliasi dahulu.
- **Catat Pembayaran** meminta jumlah benar-benar dibayar, tanggal, akun, lalu konfirmasi; Rp600.000 tersisa bukan bukti sudah dibayar. Pembayaran boleh ditunda atau sebagian dalam batas hak, tidak negatif. Jika tidak ada uang dibayar, tidak membuat mutasi kas; status hak, potongan, pembayaran, dan saldo kasbon tetap terpisah.
- Kasbon tersisa berjalan lintas periode tanpa penerbitan ulang. Pengembalian kasbon dicatat sebagai pembayaran kembali, bukan pemasukan usaha/biaya negatif. ABK pindah/berhenti tidak menghapus saldo.
- **Upah Pekerjaan**: catat pekerjaan, jumlah/satuan, tarif yang disepakati dan periode → pemeriksaan Owner → hak upah → pembayaran. Tidak otomatis masuk slip gaji atau dipotong kasbon. Satu pembayaran nyata yang mencakup gaji dan upah mempunyai rincian alokasi terpisah, bukan kas keluar ganda.

<a id="fl08"></a>
## 11. FL-08 — Hasil periode

**Masuk dari:** Kandang → Periode → Hasil Periode atau Ringkasan Owner. **Selesai ketika:** informasi yang diketahui tercatat dengan status kelengkapan yang benar, tidak harus RHPP lengkap.

### WF-15 — Pilihan input dan uang diterima · V-17

```text
Hasil Periode · Kandang Utara / Periode 01
[Rincian RHPP]               [Uang Diterima]

Uang Diterima
Catat uang yang benar-benar sudah masuk.
Mitra                       [Mitra Contoh  ]
Tanggal diterima            [23 Sep 2026   ]
Akun penerima               [Rekening Usaha]
Jumlah                      [Rp8.000.000   ]
Lampiran (opsional)          [Tambah]
[Tinjau] → [Catat Penerimaan]

Sesudah tercatat:
Uang diterima                Rp8.000.000
Total hak mitra              Belum diketahui
Pencocokan                  Belum dicocokkan
Hasil usaha                 Belum dapat dihitung
```

**Uang Diterima:** tanggal, akun, nominal, mitra/periode relevan; tidak perlu dokumen lengkap atau alasan bila tidak ada lampiran. Jika total hak belum diketahui, jangan membuat piutang Rp8.000.000 dan status lunas. Kabar “akan ditransfer” hanya informasi, bukan penerimaan kas.

**Rincian RHPP:** pilih periode/mitra → identitas dokumen bila tersedia → komponen yang diketahui → tinjau → sahkan nilai. Kelompok tampil bertahap: hasil/bonus, beban/biaya mitra, potongan nonbiaya seperti tabungan atau pokok utang lama, lalu hak yang perlu dicairkan. Simpan draft bila mapping belum jelas; format mitra tetap perlu validasi Q-08. Input manual/lampiran bukan OCR.

Pemilik yang hanya mengetahui hak net dapat mengesahkan angka itu secara terpisah dari pembayaran, dengan klasifikasi belum lengkap. “Dokumen disahkan” tidak berarti uang masuk atau laba lengkap. Saat rincian ditambahkan kemudian, cocokkan penerimaan yang sudah ada; tidak mencatat kas masuk lagi.

Hasil usaha hanya memakai penghasilan dan biaya yang cukup jelas, dengan biaya yang sudah dipotong mitra tidak dikurangkan dua kali. Tampilkan pendapatan/hasil mitra, biaya usaha, hasil usaha periode, hak belum cair bila diketahui, dan kas aktual sebagai nilai terpisah. Jika rincian kurang, daftar kekurangan lebih berguna daripada laba Rp0 atau grafik kosong. Pembayaran bertahap/nonkas mengikuti SET-11 dan tidak disamakan.

<a id="fl09"></a>
## 12. FL-09 — Selesai fisik dan kunci keuangan

**Masuk dari:** Kandang → Periode → Tutup Buku. **Pelaku:** Owner online. Dua tindakan berbeda; tidak ada satu tombol “Tutup Semua”.

### WF-16 — Kandang Kosong dan Tutup Buku · V-05/V-26

```text
Tutup Buku · Kandang Utara / Periode 01

Pemeliharaan
Tanggal selesai sebenarnya  [              ]
[ ] Kandang sudah kosong
Rincian yang diketahui      [Buka]
[Tandai Kandang Kosong]

Keuangan
Belanja belum diperiksa                  1  [Periksa]
Rincian hasil belum lengkap                 [Lengkapi]
Gaji/upah dan alokasi biaya                 [Tinjau]
Catatan HP yang belum terkirim           Data terakhir 16.05
[Tutup Buku] — belum bisa
Selesaikan penghambat di atas dahulu.
```

- **Tandai Kandang Kosong** mencatat tanggal, deklarasi kosong, dan rekonsiliasi populasi sejauh diketahui. Tiket panen R2/recording lengkap/foto/alasan bukan syarat rutin; unknown tidak diubah menjadi kematian. Tampilkan akibat dan konfirmasi, bukan centang otomatis karena lewat umur tertentu.
- Setelah fisik selesai, **Siapkan Periode** berikutnya tersedia walau RHPP belum cair atau keuangan lama belum dikunci. Tanggal periode tidak boleh bertumpuk; satu periode aktif per kandang.
- **Tutup Buku** meninjau cakupan histori, hak/biaya, klaim unresolved, alokasi, kelengkapan hasil, dan snapshot. Setiap penghambat mempunyai tautan perbaikan. Tidak menambahkan gate stok, opname, atau approval recording.
- Utang final, hak belum dibayar, dan kasbon tersisa bukan penghambat otomatis. Pembayaran setelah lock menaut hak yang sudah sah tanpa mengubah biaya snapshot. Mengubah hak/biaya memerlukan **Buka Kembali**, alasan, dan riwayat versi.
- Payout-only yang belum cukup rincian tidak memaksa laba/lock lengkap. Laporan sementara tetap dapat dilihat/ekspor dengan label yang jujur. OFF atau gap recording sendiri tidak menghalangi keuangan jika data keuangan cukup.

<a id="fl10"></a>
## 13. FL-10 — Offline, konflik, dan pemulihan

Alur ini melekat pada seluruh form, bukan tur tambahan. Status lokal hanya menjelaskan **HP ini**; data di HP lain yang belum terkirim tidak dapat diketahui server.

| Keadaan | Yang pengguna lihat | Aksi dan hasil yang direncanakan |
|---|---|---|
| Draf belum dikirim | Draf | Simpan Draf; label hanya muncul setelah storage berhasil |
| Offline dengan izin lokal masih sah | Menunggu Kirim — tersimpan di HP | Kirim saat aplikasi terbuka dan online; bukan janji background sync |
| Storage gagal/penuh | Gagal Simpan | Pertahankan isian dalam sesi, jelaskan risiko menutup; jangan menyarankan hapus data browser berisi antrean |
| Sedang mengirim | Mengirim | Cegah operasi kedua dari tap berulang; kembali ke daftar tidak menggandakan pengiriman |
| Timeout, hasil belum diketahui | Belum Pasti Terkirim | Periksa hasil/retry operasi sama; jangan buat ulang transaksi karena belum ada jawaban |
| Recording diterima | Tercatat | Versi berlaku bersama; bukan persetujuan finansial |
| Klaim belanja diterima | Menunggu Owner | Buka detail; belum dibukukan, tidak tampil sebagai biaya sah |
| Lampiran gagal | Foto Menunggu Kirim/Foto Gagal, teks tetap berstatus sendiri | Unggah ulang pada dokumen sama; nota opsional |
| Catatan server berubah | Catatan Berubah | FL-04/WF-10; nilai terbaru dibandingkan draf tanpa jumlah/timpa otomatis |
| Mode berubah atau tanggal di luar cakupan | Perlu Dicocokkan | Tampilkan konteks yang masih berizin; pertahankan draf dan validasi cutoff, bukan mengirim ke periode lain |
| Periode terkunci | Perlu Koreksi | Usulan koreksi kepada Owner sesuai CYC-10; tidak mengubah snapshot diam-diam |
| Assignment dicabut | Akses Tidak Tersedia | Jangan memuat data server yang tidak berhak; antrean tetap terikat identitas asal, tidak dikirim sebagai ABK lain |
| Izin offline habis | Masuk Lagi | Kunci cache bisnis; tidak memperpanjang akses lokal sepihak. Capture-only hanya menurut OFF-17 dan keputusan Q-06 |
| Logout/ganti akun | Ada catatan belum terkirim, bila masih berhak melihatnya | Jelaskan akibat; tidak menghapus antrean diam-diam atau membukanya untuk akun berikut |
| Tenant READ_ONLY | Hanya Baca | Baca/ekspor yang berizin; semua mutasi ditolak, bukan disamarkan sebagai koneksi gagal |
| Pemulihan server dari backup | Perlu Pemeriksaan Ulang | Rekonsiliasi receipt/acknowledgement; jangan mencatat uang fisik diterima untuk kedua kali |

V-19 menunjukkan jumlah antrean, tipe, konteks yang boleh dilihat, waktu, status, dan tindakan per item. Jika izin hilang, metadata yang tidak lagi berhak ikut disembunyikan. Recovery Owner memakai verifikasi Q-02; reset ABK melalui Owner. Tidak ada janji memulihkan catatan yang hanya ada di HP hilang. Batas lease 72 jam tetap usulan uji, bukan jaminan layanan.

**Aturan tampil lintas layar:** loading bukan saldo nol; empty membedakan belum ada data dan filter kosong; kegagalan menjelaskan apakah data tersimpan; error izin tidak membocorkan nama/nominal tenant lain. Keberhasilan disampaikan sebagai status persisten selain notifikasi sesaat. Validasi gagal mempertahankan input, error dekat field, dan ringkasan error yang dapat difokuskan.

<a id="flow14"></a>
## 14. Layar pendukung dan batas dokumentasi

Seluruh 26 layar V tetap dirujuk; 16 WF adalah keadaan prioritas, bukan rancangan rinci semua variasi. Tidak ada penambahan layar/login/peran baru melalui dokumen ini.

| Layar pendukung yang belum punya wireframe tersendiri | Isi minimum dan batas untuk rancangan berikut |
|---|---|
| V-05 Kandang & Periode | Daftar/ringkasan periode, dua status, Pengaturan OFF/DAILY dengan cutoff, jalur ke recording/penerimaan/hasil/penutupan; tidak mengganti mode otomatis |
| V-10 Detail Belanja | Riwayat pengajuan/koreksi, bukti, status review/posting/pembayaran terpisah; WF-13 mewakili keadaan pemeriksaan saja |
| V-12 Riwayat Belanja | Riwayat pembelian/filter/status dan klasifikasi, bukan saldo stok atau tombol Pakai |
| V-13 Terima/Kembalikan Uang | Lembar kejadian uang FL-05, identitas pelapor, status pencocokan; tidak menambah kas sah sendiri |
| V-16 Upah Pekerjaan | Jenis, jumlah/satuan, tarif, periode, pemeriksaan dan pembayaran terpisah dari gaji |
| V-18 Laporan | Cakupan/filter/sumber/waktu/kelengkapan; tautan detail angka dan laporan parsial tanpa klaim laba final |
| V-19 Status Kirim | Antrean dan pemulihan FL-10; tidak menganggap retry sebagai transaksi baru |
| V-21 Ekspor | Pilih cakupan/isi, proses, unduh privat berumur terbatas; bukan backup/restore satu tombol; UT-35 |
| V-22 Akun | Ubah password, sesi, bantuan recovery, Kurangi Efek Visual, keluar dengan penjagaan antrean; rahasia tidak ditampilkan kembali |
| V-23 Panduan | Penjelasan singkat sesuai layar; teks utama, media opsional tanpa autoplay atau tur wajib |
| V-24 Administrasi | Provisioning Owner dan status/limit/audit layanan sesuai izin; bukan akses rutin ke bisnis atau impersonasi Owner/ABK |
| V-25 Riwayat | Sumber, tanggal kejadian/kirim, pencatat/korektor, versi, status; keuangan hanya milik yang berhak |

Semua contoh tetap tertulis dan sintetis. Deskripsi offline, reset, posting, dan konflik tidak boleh dipresentasikan sebagai implementasi server/keamanan yang sudah bekerja. Tidak membuat prototype atau demo untuk melengkapi dokumen ini, dan tidak memasukkan kredensial atau dokumen pribadi.

<a id="flow15"></a>
## 15. Rencana validasi dan handoff

### 15.1 Peninjauan dan handoff paket perencanaan

1. Tinjau alur tertulis dengan Owner: langkah yang membingungkan, data yang belum tersedia, dan kebutuhan kembali ke draf. Catat koreksi tanpa membuat mockup.
2. Tinjau [arsitektur](ARCHITECTURE.md), [keamanan/operasional](SECURITY_OPERATIONS.md), [model data](DATA_MODEL.md) dan [kontrak API/sync](API_SYNC_SPEC.md) yang kini tersedia. Semua berupa Markdown; pilihan teknologi masih usulan, bukan hasil otomatis generator atau persetujuan pengguna.
3. Gunakan [rencana tes](TEST_PLAN.md) untuk menelusuri seluruh AC/GOLD/UT serta cabang tim, kasbon, penutupan, konflik dan keadaan gagal. Skenario tertulis tidak diberi status lulus aplikasi.
4. Gunakan [Implementation Plan](Implementation%20Plan.md) yang menguraikan alur vertikal menjadi 63 kartu tugas/dependensi, bukan mulai coding. Bekukan hanya keputusan yang benar-benar disepakati dengan versi/tanggal dan sisa pertanyaan terbuka.
5. Periksa konsistensi seluruh file `.md`. Pindah ke implementasi hanya setelah permintaan eksplisit pengguna; desain visual final sudah ada di `design/` (K-39); selesainya dokumen bukan izin otomatis.

### 15.2 Sesi uji yang direncanakan

**Rencana untuk implementasi mendatang jika diminta pengguna, bukan pekerjaan fase aktif; belum dijalankan.** Saat ini yang ditinjau adalah kelengkapan skenarionya dalam Markdown. Gunakan data sintetis; skenario adalah reset terpisah kecuali dinyatakan bersambung.

| Tugas untuk peserta, tanpa memberitahu tombol yang harus dipilih | Hasil yang perlu diamati | Rujukan |
|---|---|---|
| “DOC belum datang. Mulai pencatatan, lewati tim dulu, lalu catat belanja persiapan.” | Paham Persiapan bukan aktif; tidak perlu tanggal DOC palsu; dapat melanjutkan setup tanpa mengulang | FL-01, UT-04 |
| “Ayam sudah masuk 13 hari lalu saat Anda mulai memakai aplikasi.” | Memilih jalur periode berjalan, tanggal aktual dan cakupan parsial, bukan DOC baru hari ini | FL-01, UT-05 |
| “DOC datang 5.000 ekor hidup; pembagian bangunan belum Anda pegang.” | Aktif dengan jumlah sebenarnya; belum dialokasikan tetap terlihat; tidak dipaksa membagi rata | FL-02, CYC-03 |
| “Tambahkan dua ABK ke kandang sama, lalu cabut penugasan salah satunya.” | Akun pribadi, anggota lain tidak terganggu, histori/hak orang tidak pindah | FL-03, UT-02–UT-03 |
| “ABK lain sudah mencatat 100 kg. Angka yang benar 90 kg.” | Membuka catatan bersama dan koreksi, hasil 90 kg; tidak membuat laporan tambahan atau menunggu approval | FL-04, UT-09–UT-14 |
| “Anda belanja listrik Rp150.000 tanpa nota. Lalu sinyal terputus.” | Form ringkas; paham Menunggu Kirim berbeda dari Menunggu Owner/Dibukukan; retry tidak menggandakan | FL-06, FL-10, UT-17–UT-21 |
| “Cek berapa kas dibukukan dan belanja yang belum diperiksa.” | Membedakan saldo, klaim, perkiraan uang fisik; tidak menganggap perkiraan sebagai hitung tunai | FL-05, UT-16, FIN-10 |
| “Kasbon Rp1.200.000, hak gaji Rp1.000.000. Anda ingin potong Rp400.000.” | Owner memilih sendiri; sisa hak Rp600.000, sisa kasbon Rp800.000; belum berarti gaji dibayar | FL-07, UT-24 |
| “Mitra mengirim Rp8.000.000, rincian RHPP belum ada.” | Catat kas aktual tanpa kewajiban rincian; total hak/laba belum diketahui, bukan lunas | FL-08, UT-26–UT-27 |
| “Kandang sudah kosong, kasbon belum lunas dan RHPP belum lengkap.” | Pisahkan selesai fisik dan lock; dapat menyiapkan periode baru, tidak menghapus kewajiban | FL-09, UT-28 |

Ukuran mengikuti [UX/UI §17.1](UX_UI_SPEC.md#ux17): minimal 8 dari 10 percobaan belanja sederhana tanpa foto ≤60 detik tanpa bantuan; Owner menemukan kas/biaya/sisa gaji-kasbon dalam ≤3 navigasi utama; usulan recording satu jenis pakan tanpa sampling ≥8/10 percobaan ≤2 menit setelah pengenalan. Jangan menerapkan target satu tugas ke seluruh onboarding atau merata-ratakan sampai kegagalan hilang. Sepuluh percobaan bukan otomatis sepuluh peserta.

Catat versi, peran, tugas, durasi, bantuan, salah input, perangkat, koneksi, dan beban pemeriksaan Owner. Bandingkan solid/kaca pada isi sama dengan urutan yang diseimbangkan. Tanyakan “Menurut Anda data ini sudah tersimpan di mana?” untuk menguji pemahaman, bukan hanya jumlah tap.

### 15.3 Pemeriksaan setelah implementasi diminta dan tersedia

- Viewport 320/360/390/768/1280 CSS px, reflow/zoom 200%, orientasi dan keyboard aktif; tidak ada angka penting terpotong atau tombol menutupi field/fokus.
- Target sentuh web mengikuti spesifikasi proyek ≥44×44 CSS px, aksi utama ≥48×48; bukan menyalin satuan pt/dp native secara langsung.
- Label menetap, satuan jelas, paste angka Indonesia, nol versus kosong, error inline/ringkasan, tab/fokus modal dan kembalinya fokus, pembaca layar/status bukan warna saja.
- Kontras teks normal ≥4,5:1, teks besar/kontrol relevan ≥3:1; komposit kaca diperiksa saat scroll, bukan hanya menghitung warna token. Solid, reduced effects/motion, forced colors tetap berfungsi.
- Putus-sambung, klik ulang, versi berubah, unggah foto gagal, storage penuh, izin dicabut, logout, dan periode terkunci memakai jalur FL-10. Uji server/ledger terpisah tetap wajib sebelum menyebutnya bekerja.
- Screenshot membuktikan tampilan yang diperiksa; rekaman interaksi/log tes diperlukan untuk perilaku yang diklaim. Semua bukti harus aman dibagikan dan tanpa rahasia.

### 15.4 Keputusan yang masih perlu ditinjau

Tidak membuka ulang keputusan multi-ABK, recording bersama tanpa approval, kasbon mandiri, atau login tanpa email. Yang ditinjau sekarang adalah spesifikasi prioritas beranda, istilah OFF/DAILY, akses tindakan utama, serta kriteria keterbacaan solid/kaca (Q-01), bukan membuat variasi visualnya. Q-02/Q-06 mengatur recovery/keamanan offline, Q-03 tindak lanjut pemeriksaan belanja, Q-04 peralatan/alokasi, Q-08 mapping RHPP, dan Q-10/Q-11 kesiapan teknis/privasi tetap mengikuti [register PRD](PRD.md#s31).

- [ ] Urutan dan bahasa alur ditinjau Owner/ABK.
- [ ] Kriteria visual/aksesibilitas dan rencana pengujiannya terdokumentasi tanpa klaim hasil uji.
- [ ] Skenario tugas, keadaan gagal, dan batas offline tertaut ke rencana pengujian mendatang.
- [ ] Keputusan disetujui dicatat dengan versi/tanggal; sisa kebijakan terbuka ditautkan.
- [ ] Backlog implementasi mengacu ke aturan, layar, alur, dan tes; tidak menganggap wireframe sebagai fitur selesai.

<a id="flow16"></a>
## 16. Penggunaan skill dan riwayat

[UI UX Pro Max v2.15.0](.agents/README.md) digunakan lewat pencarian lokal pada 23 September 2026. Fokus dokumen adalah alur/interaksi, bukan memilih ulang arah visual menyeluruh; karena itu memakai `--domain`, bukan memilih stack atau menyimpan generator sebagai master desain.

| Pencarian | Hasil relevan yang diperiksa | Penerapan dan batas |
|---|---|---|
| `"progressive disclosure onboarding" --domain ux` | Onboarding / User Freedom | Kembali/Nanti dan tutorial opsional. Hasil tambahan Heading Line Balance bukan dasar aturan onboarding |
| `"error summary validation" --domain ux` | Forms / Accessibility / Focusable Error Summary | Error dekat field tetap ada; ringkasan setelah submit gagal dapat difokuskan dan menaut field |
| `"focus not obscured" --domain ux` | Accessibility / Focus Not Obscured (Enhanced) | Jaga fokus tidak tertutup action bar/keyboard; hasil enhanced adalah acuan AAA, bukan klaim sertifikasi atau penyamaan dengan minimum AA |
| `"glassmorphism" --domain style` | Glassmorphism, active | Hanya bingkai sesuai UX/UI; opacity katalog 10–30% dan klaim biaya render rendah tidak diadopsi untuk form/angka atau dianggap hasil pengukuran HP |

Perintah dapat dijalankan ulang dari root proyek dengan `python3 -B .agents/skills/ui-ux-pro-max/scripts/search.py <pencarian>`. Katalog membantu penilaian, bukan otoritas bisnis atau bukti usability. Tidak ada hasil mentah yang ditetapkan sebagai desain final.

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Alur R1 dan wireframe teks prioritas, beranda adaptif, cabang gagal/offline, rujukan PRD/UX, serta rencana validasi. Arahan pengguna berikutnya menetapkan fokus `.md` saja; urutan mockup diganti dokumen arsitektur dan perencanaan teknis melalui PLANNING.md. Belum mockup visual, implementasi, atau UAT. |
| 0.2 | 23 September 2026 | Audit kemudahan K-38: aturan arahan bebas, kerja di tempat dengan lembar dan baris buka-tutup, keypad angka dan bantuan pintar pada Catat Belanja, serta label kanonis (Terima/Kembalikan Uang, Periksa Belanja, Riwayat Belanja, Status Kirim, Kandang Kosong, Tutup Buku). Masih sketsa teks, bukan mockup. |
| 0.3 | 23 September 2026 | Menyesuaikan dengan mockup final K-39: navigasi per peran dengan tombol Catat di tengah, halaman fokus Catat Belanja/Mulai Kandang, WF-08 aksi cepat, dan WF-09 Recording Harian bertab (Pakan, Mortalitas, Sampling) yang tetap satu catatan bersama. Sketsa teks dinyatakan hanya menjelaskan urutan dan isi; tampilan mengikuti FRONTEND_DESIGN_SPEC. |
