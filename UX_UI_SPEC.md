# UX/UI Specification — Manajemen Usaha Kandang Broiler Kemitraan

| Metadata | Nilai |
|---|---|
| Versi | 0.1 — rancangan interaksi dan arah visual R1 |
| Tanggal | 20 September 2026 |
| Sumber bisnis | [PRD v0.3](PRD.md); keputusan pengguna selama brainstorming UX |
| Bahasa | Bahasa Indonesia; nominal IDR, satuan eksplisit |
| Perangkat utama | HP untuk Owner dan ABK; desktop sebagai perluasan tata letak |
| Arah terkonfirmasi | Modern, glassmorphism, tetap mudah digunakan |
| Desain detail | Usulan; warna, font, intensitas efek, dan mockup belum disetujui |
| Implementasi | Spesifikasi, bukan aplikasi/prototype yang sudah berjalan atau lulus UAT |
| Privasi | Contoh sintetis; lampiran pengguna tidak disalin ke dokumen, seed, atau aset publik |

## Daftar isi

1. [Kontrak dokumen dan prinsip](#ux01)
2. [Keputusan, scope, dan peran](#ux02)
3. [Kapan pengguna menentukan desain](#ux03)
4. [Arah visual dan token awal](#ux04)
5. [Tata letak, aksesibilitas, dan input](#ux05)
6. [Arsitektur informasi dan navigasi](#ux06)
7. [Inventaris layar R1](#ux07)
8. [Wireframe prioritas](#ux08)
9. [Onboarding, akses, dan pilihan recording](#ux09)
10. [Recording harian dan penerimaan Owner](#ux10)
11. [Uang kas, belanja, dan pemeriksaan](#ux11)
12. [Pemakaian, stok, dan rekonsiliasi nilai](#ux12)
13. [Gaji, kasbon, dan upah pekerjaan](#ux13)
14. [Hasil periode, penutupan, dan laporan](#ux14)
15. [Offline, status, konflik, dan pemulihan](#ux15)
16. [Komponen, bahasa, dan tutorial](#ux16)
17. [Skenario penerimaan dan pengujian](#ux17)
18. [Keputusan terbuka dan handoff](#ux18)
19. [Referensi dan riwayat](#ux19)

<a id="ux01"></a>
## 1. Kontrak dokumen dan prinsip

PRD menentukan makna bisnis, izin, efek uang/stok, dan batas rilis. Dokumen ini menentukan bagaimana pengguna menemukan, memasukkan, meninjau, dan memahami data. Bila bertentangan, keputusan pengguna terbaru dan PRD yang diselaraskan menjadi acuan; jangan memperbaiki konflik hanya dengan mengganti label. Detail nonterkonfirmasi adalah **default rancangan**, bukan persetujuan pengguna atau pilihan stack.

ID `V` menunjuk layar, `UI` prinsip, `UT` skenario penerimaan UX. ID PRD seperti CASH-16, REC-09, OFF-16, dan SET-11 menautkan perilaku bisnis. Route adalah rancangan navigasi, bukan kontrak API. Menyembunyikan menu tidak menggantikan otorisasi server.

| ID | Prinsip seluruh layar |
|---|---|
| UI-01 | Pekerjaan utama selesai lewat HP; bukan tabel desktop yang diperkecil. |
| UI-02 | Usaha, kandang, tanggal, periode, dan bangunan yang relevan terlihat sebelum simpan; pindah konteks tidak memindahkan draft diam-diam. |
| UI-03 | Unknown bukan nol; nilai sementara, cakupan parsial, dan data lama diberi keterangan. |
| UI-04 | Tersimpan lokal, diterima server, disahkan, dan dibayar adalah keadaan berbeda. |
| UI-05 | Kas pegangan, gaji periode, kasbon/pinjaman, dan upah pekerjaan memiliki jalur/saldo terpisah. |
| UI-06 | Input sekali; revisi, retry, dan dokumen lanjutan tidak membuat efek stok/uang kedua. |
| UI-07 | ABK melaporkan kejadian; Owner melengkapi klasifikasi dan mengesahkan efek finansial. Owner juga mencatat langsung. |
| UI-08 | Tidak ada auto-approval finansial karena nominal kecil atau tombol diketuk dua kali. |
| UI-09 | Glassmorphism tidak boleh menurunkan keterbacaan, aksesibilitas, atau performa. |
| UI-10 | Akses terbatas dijelaskan tanpa membocorkan nama/nominal objek yang tidak berhak. |
| UI-11 | R1 mencatat transaksi nyata; tidak berpura-pura melakukan transfer bank, integrasi mitra, atau push. |
| UI-12 | Satu ABK berakses aktif per kandang; bukan batas jumlah pekerja tanpa akun. |
| UI-13 | Operasional tanpa recording tetap sampai pembukuan/hasil periode dari settlement aktual yang cukup. |
| UI-14 | Posted finance dikoreksi dengan riwayat, bukan dihapus; tindakan berisiko menjelaskan akibatnya. |

<a id="ux02"></a>
## 2. Keputusan, scope, dan peran

### 2.1 Terkonfirmasi versus rancangan

| Topik | Terkonfirmasi dari pengguna | Default yang masih dapat diuji |
|---|---|---|
| Recording | Ada sejak R1; jika diaktifkan Owner, ABK mengisi sekali sehari; OFF tanpa kewajiban recording | OFF/DAILY efektif disimpan per periode; satu rekap per bangunan/tanggal usaha |
| Kegiatan ABK | Recording pakan/mati/sampling, belanja, pemakaian gas/solar, uang kas | Satu pintu recording tiga bagian; nav tetap lima tujuan |
| Akses | Satu kandang hanya satu ABK berakses; masing-masing memakai HP sendiri | Maksimal satu grant aktif, pergantian online atomik; bukan batas satu akun ke satu kandang/perangkat |
| Penerimaan | Pakan datang, DOC, dan penerimaan sejenis melalui Owner | Sapronak mitra terpisah dari belanja operasional ABK; invoice rahasia tidak ikut tampilan kuantitas |
| Owner | Sering memakai HP, juga mencatat transaksi yang tidak lewat ABK | Input langsung dengan preview pembukuan, bukan pengajuan kepada diri sendiri |
| Keuangan | Kas dan kasbon berbeda; mode operasional sampai penghasilan/pembukuan periode | Penghasilan kemitraan, hasil usaha, dan pencairan dipisah |
| Panduan | Ada tutorial | Teks/gambar kontekstual dan pusat panduan; video opsional tanpa autoplay, bukan LMS |
| Visual | Modern glassmorphism, easy to use | Light theme, kaca selektif, palet awal biru-teal, solid fallback; mockup belum disetujui |

### 2.2 Dua pilihan penggunaan R1

| Pilihan di UI | Mode | Kapabilitas |
|---|---|---|
| Operasional & Keuangan | OFF | Kas, transaksi, pemakaian/stok operasional, gaji/kasbon/upah, settlement aktual, pencairan, laporan/ekspor; DOC/konteks periode minimum oleh Owner |
| Operasional, Keuangan & Recording | DAILY | Semua di atas plus rekap harian pakan, mati/afkir, sampling dan ringkasan data yang cukup |

Keduanya bukan tingkatan harga. Hindari label "Semua fitur": R1 bukan seluruh visi masa depan. OFF tidak memblokir belanja/payroll/hasil periode dan tidak mengimpor data mitra otomatis. Penerimaan fisik Owner berbeda dari pemakaian; tanpa pemakaian tercatat, saldo pakan/performa tidak boleh diklaim lengkap.

Tertunda: rekap mitra terintegrasi, panen per DO, FCR/IP/estimasi kontrak lengkap, builder kontrak, buku pribadi terpisah, Mandor/PPL, task engine/perawatan, APK/push, IoT/CCTV. Tidak ada menu kosong, data dummy, atau ketergantungan tersembunyi untuk modul ini. ABW sampling bukan performa panen/FCR final.

### 2.3 Hak yang terlihat

- **Owner:** usaha berhak, multi-kandang, input langsung, penerimaan sapronak/DOC, review, pembayaran tercatat, laporan, pemulihan/ekspor. Bukan batas satu perangkat.
- **ABK:** kandang penugasan, recording/pemakaian, transaksi/kas pegangan/gaji/kasbon/upah sendiri. Tidak melihat kas usaha lain, laba, harga kontrak, settlement, invoice mitra, atau hak pekerja lain.
- **Admin:** layanan/limit dan audit administrasi; bukan akses semua bisnis, impersonation, atau bypass ownership.
- **Pekerja tanpa akun:** tetap dapat dicatat untuk gaji/upah. Menambah pekerja tidak otomatis memberi login.

Mitra bagi ABK hanya label minimum konteks penugasan. Jenis/kuantitas stok, tanggal DOC, dan populasi awal/alokasi tersedia melalui proyeksi operasional berizin; bukan master pihak atau dokumen penerimaan lengkap. Server tidak mengirim harga, invoice/lampiran penerimaan, rekening pihak, atau data finansial lain lalu sekadar menyembunyikannya di UI.

<a id="ux03"></a>
## 3. Kapan pengguna menentukan desain

**Arah visual ditentukan sekarang; bentuk final dipilih melalui mockup sebelum implementasi UI menyeluruh.** Persetujuan alur bukan persetujuan palet; persetujuan screenshot bukan bukti fitur berfungsi.

| Tahap | Artefak | Keputusan pemilik produk | Gate |
|---|---|---|---|
| A — arah | Dokumen ini | Glassmorphism, prioritas HP, keterbacaan | Arah sudah diminta; detail belum final |
| B — struktur | Wireframe peran/alur kritis | Hierarki, istilah, langkah, posisi kas/recording | Tidak rancu kas vs kasbon atau approve vs bayar |
| C — visual | Dua variasi pada layar/data sintetis yang sama | Warna merek, font, radius, kepadatan, kuat/lembut kaca | Pilih dalam konteks lapangan, bukan dekorasi saja |
| D — prototype | Alur harian, kas, hasil periode; glass/solid pada HP | Kenyamanan input, status, navigasi, angka | Uji tugas/kondisi gagal, revisi bila membingungkan |
| E — baseline | Token/komponen/state final, catatan persetujuan | Setujui versi/tanggal dan batas terbuka | Acuan implementasi lintas layar |

Mockup pertama: **Beranda Owner, Hari Ini ABK (DAILY dan OFF), Recording Harian, Uang Kas/Catat Belanja, Hasil Periode**; sertakan normal, offline/pending, dan koreksi. Variasi visual tidak menawarkan fitur berbeda. Tidak perlu menggambar seluruh layar dua kali.

Sesudah arah visual dipilih, prototype memperluas alur ke penerimaan pakan/DOC oleh Owner serta beli/terima versus pakai gas/solar oleh ABK. Keduanya wajib diuji sebelum pilot, bukan tambahan fitur atau alasan mendesain seluruh layar dua kali.

Eksplorasi usulan: **Glass Tenang** (kaca pada header/nav) dan **Glass Beraksen** (tambahan panel konteks dekoratif; angka tetap solid). Keduanya harus dapat menjadi solid tanpa kehilangan informasi. Nama ini bukan merek produk dan belum dipilih pengguna.

<a id="ux04"></a>
## 4. Arah visual dan token awal

### 4.1 Kaca pada bingkai, data pada permukaan solid

Hierarki teks jelas, radius konsisten, ikon berlabel, ruang kosong cukup, aksen terbatas. Latar boleh gradien biru/teal sangat halus; bukan foto/nota, animasi blob, atau latar bergerak di belakang angka.

Header/nav dapat translucent. **Input, tabel, kartu saldo, status, konfirmasi uang, dan slip/laporan memakai latar opaque.** Sheet input tidak tembus ke isi halaman; scrim luar boleh transparan. Jangan memudarkan seluruh container beserta teks menggunakan `opacity`.

### 4.2 Token usulan, bukan brand final

| Token | Nilai awal | Penggunaan |
|---|---|---|
| canvas | `#F3F6FB` | Latar halaman |
| surface | `#FFFFFF` | Form, angka, daftar, dialog |
| text-primary | `#132238` | Judul/data utama |
| text-secondary | `#526176` | Keterangan/timestamp |
| action-primary | `#155EEF` | Tombol utama dengan teks putih |
| action-hover | `#004EEB` | Hover, bukan satu-satunya tanda interaksi |
| accent | `#0E7490` | Aksen terbatas, bukan status sukses universal |
| control-border | `#64748B` | Batas input yang harus dikenali |
| divider | `#E2E8F0` | Pemisah dekoratif, bukan batas kontrol tunggal |
| success | `#067647` pada `#ECFDF3` | Sukses spesifik + teks/ikon |
| warning | `#93370D` pada `#FFFAEB` | Pending/perhatian |
| danger | `#B42318` pada `#FEF3F2` | Error/destruktif |
| info | `#175CD3` pada `#EFF8FF` | Informasi/pengiriman |
| glass-surface | `rgb(255 255 255 / 0.88)` | Shell dengan latar terkendali |
| glass-blur | `12px` | Batas awal eksplorasi, bukan jaminan performa |
| glass-outline | `1px solid rgb(255 255 255 / 0.65)` | Dekorasi, bukan batas input/focus |
| shadow-panel | `0 8px 24px rgb(19 34 56 / 0.08)` | Elevasi lembut, bukan satu-satunya pemisah |

- Font awal `system-ui, -apple-system, "Segoe UI", sans-serif`. Font merek menunggu mockup; bila berbeda, self-host berlisensi dan fallback, tanpa ketergantungan CDN untuk kerja offline.
- Teks: judul 24/32 px, subjudul 20/28, body/input 16/24, metadata nonkritis 14/20, nominal utama 28–32 px dengan wrapping. Nilai penting tidak dipotong `...` atau hanya `jt`.
- Tabular numerals bila tersedia; rupiah panjang tetap terbaca pada 360 px/zoom.
- Spacing 4, 8, 12, 16, 24, 32 px; padding mobile 16 px. Radius input/button 12 px, kartu 16 px, sheet 24 px; pill untuk chip/status.
- Ikon 20–24 px dalam hit area ≥44×44 px; aksi utama ≥48×48 px. Label navigasi selalu tampak.

### 4.3 Fallback dan rendering

1. Solid adalah baseline. Kaca hanya bila `backdrop-filter` didukung dan preferensi mengizinkan; kegagalan efek tidak menghasilkan latar bening tanpa kontras.
2. Sediakan **Kurangi efek visual** per perangkat/tampilan, tanpa izin Owner. Hormati preferensi sistem pengurangan transparansi bila tersedia, tetapi jangan bergantung padanya: dukungan browser belum merata.
3. `prefers-reduced-motion` mematikan gerak nonesensial; forced colors memakai warna/focus sistem yang terbaca. Blur bukan pengaman data pribadi.
4. Budget usulan: maksimal dua bidang blur terlihat, termasuk panel konteks pada variasi Glass Beraksen; jadikan salah satu header/nav solid bila perlu. Tidak nested/per baris transaksi atau animasi blur. Jika profiling HP pilot lambat, gunakan solid tanpa mengurangi fungsi.
5. Transisi 120–180 ms usulan; tidak menunda simpan/konfirmasi, tidak ada success animation sebelum penyimpanan berhasil.
6. Ukur kontras pada **komposit yang dirender**, termasuk saat konten bergulir di bawah header. Gagal → backing opaque, bukan sekadar blur lebih kuat. Teks normal ≥4,5:1, besar ≥3:1, kontrol/focus relevan ≥3:1 sesuai WCAG.

Token bukan klaim WCAG terpenuhi. Audit komposit, keyboard, screen reader, browser/perangkat tetap gate baseline desain.

<a id="ux05"></a>
## 5. Tata letak, aksesibilitas, dan input

### 5.1 Responsive dan lapisan

- Uji 360, 390, 768, 1280 CSS px; reflow juga ekuivalen 320 CSS px. Tidak ada horizontal scroll halaman utama. Tabel kompleks boleh scroll di kontainer bernama dengan alternatif detail baris.
- Mobile satu kolom, konteks ringkas, bottom nav dengan safe area. Form panjang boleh mengganti nav dengan action bar, bukan menumpuk keduanya.
- Tablet satu/dua kolom; desktop sidebar dengan tujuan/nama yang sama dan daftar-detail berdampingan. Tidak mewajibkan hover/right-click.
- Lapisan: konten → header/nav → scrim → modal → pesan aksesibel. Hanya satu modal; focus trap, judul, tombol tutup, focus kembali ke pemicu. Escape/back tidak menjebak; draft belum aman perlu konfirmasi.
- Keyboard HP tidak menutup field/error/action. Gunakan scroll padding/safe area; jangan hanya mengandalkan viewport statis. Floating button tidak menutupi data/aksi; swipe bukan satu-satunya cara.

### 5.2 Form dan validasi

- Label menetap, satuan terlihat, wajib/opsional jelas. Error dekat field dan ringkasan yang dapat difokuskan setelah submit gagal.
- Ekor integer; berat/liter/kuantitas desimal; rupiah bulat sesuai PRD. Keyboard numerik membantu, bukan menggantikan validasi.
- Format Indonesia (`Rp150.000`, `12,5 kg`). Paste diparse deterministik; format ambigu meminta konfirmasi, bukan diam-diam mengubah nilai. Uji caret/backspace/separator/screen reader.
- Empty tidak menjadi nol saat blur. Saran barang/tanggal/sumber dana terlihat dan dapat diperbaiki; jumlah tidak disalin dari kemarin. Konversi sak→kg hanya jika master sah dan ditampilkan.
- Tanggal kejadian berbeda dari waktu kirim; timezone kandang oleh Owner. Tanggal bukan hari ini ditandai. Future/out-of-period tidak dianggap aktual tanpa jalur sah.
- Draf boleh belum lengkap; "tersimpan di HP" hanya setelah storage berhasil. Gagal storage mempertahankan form, bukan centang palsu.
- Request berjalan mencegah aksi ganda; timeout berarti hasil belum diketahui, bukan otomatis gagal. Retry menggunakan identitas operasi sama.
- Aksi online-only menjelaskan alasan saat offline. Penjelasan disabled tetap terbaca/dapat diakses, bukan tooltip hover saja.

<a id="ux06"></a>
## 6. Arsitektur informasi dan navigasi

| Peran | Navigasi utama | Akses sekunder |
|---|---|---|
| Owner | Ringkasan · Kandang · Transaksi · Laporan · Lainnya | Pemeriksaan dari beranda/transaksi; catat langsung mudah ditemukan |
| ABK | Hari Ini · Catat · Uang Kas · Riwayat · Lainnya | Recording aktif lewat Hari Ini/Catat; gaji/kasbon/upah/panduan di Lainnya |
| Admin | Tenant · Layanan · Audit · Akun | Scope admin jelas, bukan tab rahasia Owner |

**Catat** adalah halaman pemilih tindakan: Recording Harian (DAILY), Belanja, Pemakaian, Upah Pekerjaan, Catatan Kejadian Tunai. Uang Kas juga menyediakan catatan penerimaan/pengembalian, bukan transfer bank.

Dalam Belanja sediakan pintasan **Beli/terima gas atau solar**; dalam Pemakaian sediakan **Pakai gas atau solar**. Keduanya memakai alur yang berbeda, bukan dua nama untuk formulir yang sama. Pintasan tidak menambah tab navigasi.

Lainnya ABK: **Gaji Periode**, **Kasbon & Pinjaman**, **Upah Pekerjaan**, **Panduan**, **Sinkronisasi**, **Akun & Tampilan** secara terpisah. Jangan menyebut gabungannya "Saldo Saya". Posisi menu boleh diuji; pemisahan makna tidak berubah.

Satu kandang berhak langsung terpilih; jika user berhak beberapa kandang, pemilih hanya scope sah. Aturan satu ABK per kandang bukan berarti satu ABK pasti hanya satu kandang. Pindah usaha/peran eksplisit dan mempertahankan draft di scope asal.

OFF tidak mengubah posisi nav; hanya kartu/action recording baru disembunyikan. Riwayat lama read-only sesuai izin; deep link tidak mengaktifkan fitur. Empty state tidak menawarkan modul R2.

<a id="ux07"></a>
## 7. Inventaris layar R1

Semua layar memakai state bagian 15 dan komponen bagian 16. Path memakai ID opaque, bukan bukti otorisasi. Rincian field ada di bagian 9–14; route yang ada saja bukan fitur selesai.

| ID | Layar / path usulan | Peran, isi dan aksi | Acuan PRD |
|---|---|---|---|
| V-01 | Ringkasan `/ringkasan` | Owner: perhatian, kas, biaya, kewajiban, kandang, catat langsung | SCR-02, REP-01 |
| V-02 | Hari Ini `/hari-ini` | ABK: konteks, recording aktif, kerja harian, antrean/koreksi | SCR-04, UX-05 |
| V-03 | Masuk/pilih usaha `/masuk` | Identitas, undangan, scope sah, kesiapan offline | SCR-01, SEC-13 |
| V-04 | Mulai usaha/periode `/mulai` | Owner: baru/berjalan, cutoff, posisi awal, pilihan recording | ONB-10, CYC-01 |
| V-05 | Kandang/periode `/kandang/:id/periode/:id` | Tab sesuai izin; selesai fisik/kunci keuangan Owner terpisah | SCR-03, CYC-07, CYC-11 |
| V-06 | Recording `/periode/:id/recording/:tanggal` | ABK/Owner: bangunan, pakan, mati/afkir, sampling, review/revisi | REC-07, REC-09, REC-10 |
| V-07 | Penerimaan `/periode/:id/penerimaan` | Owner: sapronak/DOC, sumber/unit/jumlah/bukti; bukan otomatis bayar | INV-04, CYC-01 |
| V-08 | Uang Kas `/uang-kas` | ABK sendiri/Owner per pemegang: saldo sah, klaim, perkiraan, rekonsiliasi | SCR-06, CASH-01, OFF-16 |
| V-09 | Belanja `/catat/belanja` | ABK quick entry, Owner langsung; bukti/sumber/alokasi | SCR-05, CASH-16 |
| V-10 | Transaksi `/transaksi/:id` | Owner scope sah/ABK sendiri: sumber/status/efek/pembayaran/koreksi | FIN-12, CASH-06 |
| V-11 | Pemeriksaan `/pemeriksaan` | Owner: umur/data kurang, dokumen/batch, hasil per dokumen | SCR-07, FIN-13 |
| V-12 | Stok/pemakaian `/stok` | Kuantitas berhak, gas/solar/lokasi/opname; nilai hanya Owner | SCR-08, INV-13, INV-15 |
| V-13 | Kejadian tunai `/catat/tunai` | Kejadian fisik, bukan posting; Owner menautkan klaim | OFF-16, CASH-02 |
| V-14 | Gaji periode `/gaji` | Owner kelola/ABK sendiri: agreement, kasbon diterapkan, bayar/sisa/slip | SCR-09, PAY-04 |
| V-15 | Kasbon/pinjaman `/kasbon` | Owner kelola/ABK sendiri: jenis/kreditur/tujuan/pencairan/sisa | SCR-10, PAY-07 |
| V-16 | Upah pekerjaan `/upah-pekerjaan` | ABK ajukan, Owner review/bayar; jumlah/unit/tarif snapshot | SCR-11, PAY-11 |
| V-17 | Hasil periode `/periode/:id/hasil` | Owner: dokumen PT, klasifikasi, hasil usaha, pencairan | SCR-14, SET-11 |
| V-18 | Laporan `/laporan` | Owner: kas/biaya/stok/tenaga kerja/hasil, coverage, drill-down | REP-03, REP-04, REP-06, REP-07 |
| V-19 | Sinkronisasi `/sinkronisasi` | Sesuai identitas: antrean, lampiran, konflik, restore review, retry | SCR-17, OFF-06, NFR-11 |
| V-20 | Pengaturan kandang `/kandang/:id/pengaturan` | Owner: penugasan tunggal, mode/cutoff, bangunan/master | ONB-04, REC-03 |
| V-21 | Ekspor `/pengaturan/ekspor` | Owner: cakupan, paket, hasil privat, kelengkapan lampiran | REP-19 |
| V-22 | Akun/pemulihan `/akun` | Identitas/sesi/logout/tampilan/recovery; transfer owner berizin | SEC-13, SEC-14, OFF-10 |
| V-23 | Panduan `/panduan` | Tutorial relevan, teks/gambar, tanpa autoplay/tugas wajib | UX-07 |
| V-24 | Administrasi `/admin` | Admin: tenant/limit/status/audit administrasi, tanpa isi bisnis | SEC-01, SEC-14 |
| V-25 | Inbox/Riwayat `/riwayat` | Scope berhak: status/koreksi/kejadian/link/timestamp | OFF-15, NOT-01 |
| V-26 | Review tutup/valuasi `/periode/:id/review` | Owner: kelengkapan, stok/biaya/delta/dampak, lock/reopen | CYC-11, INV-16 |

<a id="ux08"></a>
## 8. Wireframe prioritas

Hierarki awal, bukan jarak piksel/warna final; semua contoh sintetis.

### 8.1 Owner — V-01

```text
[Usaha] [Semua kandang v]                    [Inbox]
Data diterima 09.10 · 2 catatan masih di HP ini

Perlu ditindaklanjuti
  3 pengajuan · terlama 2 hari              [Periksa]
  1 biaya perlu alokasi                    [Lengkapi]

Posisi uang usaha                          [Rincian]
  Akun usaha · Pegangan ABK · Tagihan
  Saldo disahkan; klaim belum sah terpisah
Biaya periode tercatat                     [Rincian]
Kewajiban: gaji / upah / toko / penggantian dana

[+ Catat transaksi] [Penerimaan pakan/DOC]
Kandang/periode aktif · kelengkapan dan waktu data

Ringkasan | Kandang | Transaksi | Laporan | Lainnya
```

Tidak ada laba final bila settlement/coverage belum cukup. DAILY menambah ringkasan laporan harian, bukan mengubah seluruh beranda menjadi dashboard produksi. Agregat lintas kandang menandai timestamp berbeda.

### 8.2 ABK — V-02

```text
Kandang Utara · Periode aktif               [Inbox]
Data terakhir 09.10 · Offline

Recording hari ini                         (DAILY)
  Bangunan A: Draf · Bangunan B: Belum diisi
  [Lanjutkan recording]

[Catat belanja]           [Pakai gas/solar]
[Catat upah pekerjaan]    [Catat kejadian tunai]

Uang Kas                                   [Buka]
  Saldo disahkan · Belanja belum diperiksa
Perlu diperbaiki / Belum terkirim
  Alasan + aksi per catatan

Hari Ini | Catat | Uang Kas | Riwayat | Lainnya
```

OFF menghilangkan kartu/pengingat recording, bukan menggantinya nol atau promosi. Tidak ada harga sapronak, saldo Owner, atau upah pekerja lain.

### 8.3 Uang Kas — V-08

```text
Uang usaha yang Anda pegang · Kandang Utara
Saldo disahkan                      Rp500.000
Belanja belum diperiksa             Rp150.000
Perkiraan uang di tangan            Rp350.000
  Berdasarkan catatan, bukan hasil hitung fisik

[Catat belanja] [Catat uang diterima/diserahkan]
[Cocokkan uang fisik]
Masuk | Belanja | Pengembalian | Seluruh riwayat
Tanggal · keperluan · sumber · status · nominal
```

Contoh hanya satu klaim belanja tunai unik, tanpa klaim masuk/konflik lain. Jika linkage/arah/timestamp ambigu, jangan tampilkan satu perkiraan pasti; jelaskan komponen belum cocok. Kasbon bukan saldo pegangan.

### 8.4 Hasil Periode — V-17

```text
Kandang Utara · Periode 01
Pencatatan mulai [cutoff] · cakupan lengkap/parsial
[Dokumen PT] [Hasil usaha] [Pencairan]

Penghasilan kemitraan terverifikasi
Pendapatan lain
Biaya Owner yang belum tercakup di hasil mitra
-------------------------------------------------
Hasil usaha / Belum dapat difinalkan

Uang diterima · Penyelesaian nonkas · Hak belum cair
[Rincian & sumber] [Catat uang diterima]
```

Tidak ada tab Estimasi R1. Dokumen disahkan bukan uang diterima; selesai fisik bukan keuangan terkunci.

<a id="ux09"></a>
## 9. Onboarding, akses, dan pilihan recording

### 9.1 Mulai — V-03/V-04

1. Login terverifikasi, pilih/terima undangan usaha berhak. Vendor/metode login melalui ADR; error tidak membocorkan tenant lain.
2. Owner membuat konteks usaha/kandang/bangunan/mitra/timezone; master lain bertahap. Undang maksimal satu ABK aktif; pekerja tanpa akun tetap boleh banyak.
3. Pilih **Mulai periode baru** atau **Lanjutkan periode berjalan**. Tanggal chick-in nyata, bukan tanggal mendaftar.
4. Periode berjalan meminta cutoff/coverage, saldo kas/stok/utang/tagihan dan hak gaji/kasbon/upah terbuka. Unknown pending; opening bukan biaya/pendapatan baru.
5. Pilih OFF/DAILY; keuangan utuh keduanya, bukan paket berlangganan/import otomatis.
6. Tinjau dan mulai. DOC belum diketahui per bangunan tetap belum dialokasikan, bukan dibagi rata. Belanja sah tidak harus menunggu seluruh master produksi lengkap.

Login pertama/perangkat memerlukan online. Jelaskan data offline, waktu izin diverifikasi, risiko local-only; jangan menjanjikan offline selamanya. Coverage historis yang belum lengkap tetap terlihat di laporan dan dapat memblokir final laba seluruh periode.

### 9.2 Ganti ABK — V-20

Owner online melihat akun aktif, pengganti terverifikasi, sisa kas/kewajiban/antrean yang diketahui server. Perubahan grant atomik/versioned; dua request tidak menghasilkan dua ABK aktif. Karyawan lama tidak dihapus, saldo/hak tidak dialihkan.

HP lama offline tidak langsung menerima pencabutan; cache tunduk lease PRD. Saat sinkron, izin terkini berlaku. Antrean lama tidak diberi author baru/diwariskan; penyelesaian melalui review berizin. Owner membantu dengan identitas Owner, bukan impersonation ABK.

### 9.3 Ganti recording — V-20

- Pilih OFF/DAILY, tanggal efektif/cutoff, coverage dan laporan/antrean yang diketahui. Jangan mengklaim mengetahui draft semua HP offline.
- Keputusan efektif tersimpan pada periode. Jika UI kelak menyarankan pilihan dari preferensi kandang/periode sebelumnya, itu hanya nilai awal yang dikonfirmasi Owner; tidak mengubah mode periode berjalan atau histori otomatis.
- OFF→DAILY tengah periode perlu posisi awal/sumber yang cukup; hari sebelum cutoff bukan nol.
- DAILY→OFF menyimpan riwayat. Laporan terlambat untuk tanggal sebelum cutoff divalidasi/review; rentang nonaktif tidak otomatis menerima recording baru.
- Perubahan online; perangkat ABK menyesuaikan setelah menerima konfigurasi. Draft lama tidak dihapus; ada penjelasan dan jalur penyelesaian.
- Aktivasi ulang bukan reset kumulatif; interval/sumber tidak overlap. Performa/kontrak R2 tidak ikut aktif.

<a id="ux10"></a>
## 10. Recording harian dan penerimaan Owner

### 10.1 Struktur — V-06

Referensi screenshot: konteks siklus, bagian pakan/mortalitas/sampling, angka besar, satuan, riwayat. Tidak menyalin identitas/logo/faktur/nilai pelanggan atau fitur yang belum disepakati.

**Default:** satu rekap aktif `(periode, bangunan, tanggal usaha)`. Satu ABK menangani seluruh bangunan penugasannya; satu bangunan otomatis terpilih bila hanya satu. Jika lapangan hanya punya angka gabungan, jangan mengarang pembagian: scope agregat harus disepakati sebelum implementasi terkait. Pindah scope di tengah periode memakai cutoff, bukan menyalin angka ke semua bangunan.

Alur: **Hari Ini → Recording Harian → tanggal/bangunan → Pakan / Mati-Afkir / Sampling → Tinjau → Kirim**. Berpindah bagian mempertahankan draft; ringkasan menunjukkan kelengkapan.

| Bagian | Field | Validasi/bantuan |
|---|---|---|
| Konteks | Kandang/periode/bangunan/tanggal/umur | Data Owner/scope sah; umur bukan dari waktu kirim |
| Pakan | Jenis/varian, jumlah dipakai hari itu, unit; tambah jenis | ≥0; nol dikonfirmasi sebagai tidak ada pemakaian; konversi eksplisit, bukan kumulatif sejak chick-in |
| Mati/Afkir | Jumlah mati dan afkir hari itu, catatan opsional | Integer ≥0; kosong beda nol; tidak menyalin kemarin |
| Sampling | Dilakukan/tidak; jika ya: waktu, jumlah sampel, total bobot bersih, unit/metode | Sampel integer >0, bobot >0; ABW dihitung; sampling tidak wajib harian |
| Catatan | Kejadian/keterangan/lampiran relevan opsional | Bukan resep obat atau jadwal vaksin otomatis |

Contoh sintetis: 25 sampel, bobot total 30 kg → ABW 1,2 kg dengan tanggal/sumber. Bukan bobot seluruh populasi. Tidak sampling → "Tidak dilakukan pada tanggal ini", bukan `0 kg`.

### 10.2 Kirim, koreksi, kelengkapan

- **Simpan Draf** boleh parsial. **Kirim Recording** meninjau rekap: pakan dan mati/afkir bernilai atau nol terkonfirmasi; sampling memilih dilakukan/tidak. Local-only belum terlihat oleh Owner.
- Sekali sehari = satu rekap logis, bukan larangan draf/revisi. **Perbaiki recording** menampilkan sebelum/sesudah dan alasan setelah terkirim.
- Revisi versioned mengganti nilai berlaku dengan audit. Rekap 100→90 kg berarti efektif 90 kg, bukan 190 kg; inventory memakai koreksi tertaut, bukan consumption kedua.
- Dua HP user yang sama atau Owner/ABK tetap dapat konflik. Tampilkan beda versi; tidak last-write-wins/menjumlah rekap.
- Pakan dipakai sebelum penerimaan Owner dicatat tetap bisa menjadi laporan pending dependensi, bukan stok fiktif/negatif. Cocokkan sekali setelah penerimaan sah.
- Default recording rutin valid tidak membutuhkan approval manual setiap hari. **Diterima sebagai laporan produksi bukan berarti efek stok/biaya sudah disahkan.** Pending kuantitas/valuasi terlihat; kontrol finansial PRD tetap berlaku. Ringkasan produksi dan stok menjelaskan basis masing-masing.
- Mati/afkir melebihi populasi diketahui meminta koreksi/review; basis populasi tidak lengkap → belum dapat divalidasi, bukan mengarang basis atau menuduh laporan salah.
- Hari terlewat selama DAILY aktif = belum ada laporan, bukan nol. Backfill bertanggal asli tunduk izin/status periode. Lengkap hari ini mensyaratkan semua bangunan wajib/bagian diterima server, bukan draft pada satu HP.
- Ringkasan R1: pakan per jenis/hari, mati/afkir terpisah, sampling terbaru/tanggal/coverage. Sisa populasi/performa lengkap memerlukan semua keluar/masuk; panen detail/FCR bukan konsekuensi otomatis DAILY.

Pada detail/tinjau recording, panel **Sumber & hubungan stok** menampilkan tanggal kegiatan, cakupan, data sampai tanggal berapa, pencatat, revisi efektif dan riwayat versi yang digantikannya. Metadata ini dibuka bertahap, bukan field wajib tambahan ABK. Tampilkan referensi pemakaian tertaut bila ada; harga/valuasi tetap hanya Owner.

| Keadaan hubungan | Label dan tindakan |
|---|---|
| Laporan diterima, belum ada efek stok sah | **Recording tercatat · Pemakaian stok belum disahkan**; ringkasan produksi memakai sumber DAILY yang jelas, stok tidak mengklaim sudah berubah |
| Masih kurang penerimaan/padanan/versi | **Menunggu pencocokan** dengan alasan; Owner menyelesaikan dependensi, bukan ABK mengarang penerimaan |
| Pemakaian sudah tertaut/disahkan | **Tertaut ke pemakaian stok**, buka referensi yang sama; jangan menjumlah recording dan consumption sebagai dua pemakaian |
| Pemakaian sah sudah ada, recording belum lengkap | Tawarkan **Gunakan catatan pemakaian yang sudah ada** dengan scope/tanggal/kuantitas; tetap lengkapi mati/sampling tanpa membuat pemakaian baru |
| Recording direvisi setelah efek stok sah | Tampilkan nilai berlaku serta status koreksi efek stok; versi lama audit-only, bukan tambahan ke agregat |

Satu sumber efektif per metrik/scope/rentang mengikuti REC-13 sebagai prinsip integritas dan REC-14/REC-18 untuk DAILY. Pergantian sumber/scope memerlukan preview dampak dan cutoff, bukan otomatis memilih angka terbaru/terbesar. Sumber mitra dan SUMMARY tetap belum diaktifkan pada R1.

### 10.3 Pakan/DOC datang — V-07

Owner: jenis penerimaan → periode/tanggal → barang/sumber/kepemilikan → jumlah/unit → lokasi/bangunan → bukti → tinjau. DOC diterima hidup/populasi awal berbeda dari ditagih/kapasitas. Pakan datang bukan pemakaian.

Terima barang tidak otomatis bayar; sapronak mitra bukan otomatis belanja tunai Owner. Nilai unknown pending, bukan nol. ABK melihat kuantitas berhak, bukan invoice/harga. Menu penerimaan sapronak tidak tersedia bagi ABK; belanja/penerimaan gas/solar yang dilakukannya tetap bisa dilaporkan.

<a id="ux11"></a>
## 11. Uang kas, belanja, dan pemeriksaan

### 11.1 Penyerahan dana — V-08/V-13

1. **Catat penyerahan uang kas**: jelaskan pencatatan uang nyata, bukan transfer lewat aplikasi.
2. Isi sumber akun, ABK pemegang, kandang, nominal, tanggal, tujuan opsional, bukti/alasan.
3. Preview: kas sumber turun, pegangan naik, bukan biaya/kasbon. Owner mengesahkan online.
4. Konfirmasi penerimaan ABK menaut transfer sama, bukan saldo masuk kedua.
5. Offline hanya **catatan kejadian tunai**, tanpa perubahan saldo sah/approval.

Dua pihak melaporkan penyerahan sama → Owner cocokkan pihak/waktu/bukti ke satu transfer, bukan merge otomatis dari nominal. Transfer sudah posted → tautkan klaim counterpart ke movement lama. Penolakan posting tidak menghapus klaim bahwa uang fisik berpindah.

### 11.2 Belanja cepat ABK — V-09

**Keperluan/barang → nominal → sumber dana → tanggal/konteks → bukti → tinjau/simpan.** Sumber: uang kas pegangan, uang pribadi ABK (penggantian), atau belum dibayar/utang toko. Parsial menyebut jumlah dibayar/sisa.

Tanpa bukti meminta alasan CASH-16. SKU/kuantitas/klasifikasi/alokasi yang belum diketahui dilengkapi Owner sebelum posting; jangan memaksa ABK memahami akuntansi. Barang/jumlah yang diketahui bisa diisi lewat progressive disclosure. Nota susulan melengkapi klaim sama.

Preview menjelaskan kas/reimbursement/utang. **Kirim untuk diperiksa** bukan "Bayar". Hasil lokal/terkirim punya status dan tautan detail, bukan form kosong tanpa receipt.

Pintasan **Beli/terima gas atau solar** memakai V-09 dengan barang/ukuran, jumlah/unit, status barang diterima atau belum, tanggal penerimaan dan lokasi jika sudah diterima, lalu sumber dana/pembayaran yang sama. Bedakan isi ulang, pembelian tabung, dan jaminan pada pilihan barang; jangan meminta ABK memilih istilah akuntansi `STOCKED`/`DIRECT_EXPENSE`. Kelas berasal dari master dan dilengkapi Owner sebelum pembukuan; data yang belum diketahui tetap klaim pending, bukan asumsi.

Preview menyebut penambahan stok bila barang diterima, kas keluar/utang toko/penggantian kepada ABK menurut sumber dana, serta **tidak memengaruhi gaji/kasbon**. Jika sudah ada pembelian/penerimaan yang sama, buka/tambahkan bukti pada dokumen itu. Receipt susulan bukan belanja kedua. **Langsung digunakan** membuka bagian pemakaian tertaut yang meminta jumlah sebenarnya; tidak menganggap seluruh isi tabung langsung habis.

### 11.3 Owner langsung — V-09/V-10

Pilih akun usaha, dana Owner di luar akun usaha (modal/talangan berjenis), atau kredit toko; tidak membuat kas ABK fiktif. **Tinjau & bukukan** tetap memvalidasi klasifikasi, stok, pembayaran, alokasi, dan versi. Draf/offline bukan bukukan sukses.

Dana luar Owner tidak memerlukan buku pribadi R2. Modal, pinjaman Owner ke usaha, prive, reimbursement bukan kategori biaya umum untuk menutup selisih. Tampilkan penjelasan kelas yang bermakna, bukan debit/kredit kepada ABK.

### 11.4 Review — V-11

Daftar: umur sejak diterima server, pencatat, kandang, tanggal kejadian, nominal, sumber, bukti tertunda/data kurang. Prioritaskan perlu tindakan/terlama; klaim belum lengkap tetap dihitung.

Detail: laporan asli versus pelengkapan Owner; preview efek kas/stok/biaya/utang. Aksi **Setujui dan bukukan**, **Minta perbaikan**, **Tolak dengan alasan**. Tolak klaim tidak membuktikan uang tidak pernah keluar; ada penyelesaian selisih berizin.

Batch online hanya dokumen lengkap/versi ditinjau. Konfirmasi jumlah/total/sumber/pengecualian. Hasil per dokumen: misalnya "4 dibukukan, 1 berubah—periksa ulang". Bukan blanket success atau pembayaran invoice kredit otomatis.

### 11.5 Saldo, fisik, pengembalian — V-08

Saldo sah terpisah dari klaim. Perkiraan hanya komponen unik yang dapat dipadankan; jangan mengurangi klaim lokal yang sudah termasuk saldo server. Hasil operasi unknown → belum bisa direkonsiliasi, bukan perkiraan pasti.

**Cocokkan uang fisik:** jumlah dihitung, tanggal/catatan, selisih dari basis jelas. Selisih bukan otomatis biaya/pencurian; adjustment Owner beralasan. **Pengembalian sisa** transfer ke usaha, bukan pendapatan/pelunasan kasbon.

<a id="ux12"></a>
## 12. Pemakaian, stok, dan rekonsiliasi nilai

V-12 memisahkan **Masuk**, **Pindah lokasi**, **Dipakai**, **Opname**, riwayat. ABK melihat kuantitas berhak; rate/nilai Owner. Saldo menyebut lokasi/unit/timestamp/pending.

- Solar: barang/lokasi asal, tanggal, bangunan/tujuan, liter dipakai; bukan nominal pembelian ulang. Tautkan ke stock pool dan penerimaan yang relevan bila diketahui; referensi yang belum diketahui ditangani Owner tanpa menghapus laporan.
- Gas: isi, tabung, jaminan/titipan terpisah. Memasang/memindahkan tabung belum berarti habis. Metode terukur/setara isi dan ukuran/unit eksplisit.
- Beli langsung pakai bisa satu alur tetapi penerimaan/consumption tertaut, bukan dua biaya. Nonstok yang telah dibebankan tidak dikonsumsi ulang.
- Token listrik melalui belanja/jasa sesuai klasifikasi, bukan inventaris tabung. kWh/konsumsi terukur tidak diasumsikan.
- Pakan recording memakai referensi sama; tidak ada input stok kedua untuk kejadian sama.
- Kuantitas valid bernilai unknown → **Nilai biaya belum lengkap**, bukan nol atau buang bukti fisik.
- Koreksi urutan/revisi harga → V-26: dokumen, urutan ekonomi, periode, delta, konflik. Upload order bukan final; tanggal ambigu butuh keputusan beralasan.
- Periode terkunci memerlukan reopen untuk perubahan biaya; tidak menimpa snapshot. Sisa gas diukur/diestimasi eksplisit, tidak otomatis habis saat tutup.

<a id="ux13"></a>
## 13. Gaji, kasbon, dan upah pekerjaan

| Alur | Input/preview Owner | Informasi yang dilihat ABK | Larangan |
|---|---|---|---|
| Gaji V-14 | Agreement/kandang/periode, hak final, kasbon diterapkan, potongan berizin, bayar/sisa | Hak/pengambilan muka/pembayaran/sisa/slip sendiri | Upah pekerjaan bukan komponen gaji |
| Kasbon gaji V-15 | Pekerja, agreement, nominal/sumber, pencairan nyata, aplikasi gaji | Jenis/periode, pengajuan/pencairan/sisa | Pengajuan bukan uang diberikan |
| Pinjaman V-15 | Kreditur, nominal, tujuan, pembayaran/offset disetujui | Saldo/riwayat sendiri | Tidak otomatis memotong gaji/upah; bukan kas pegangan |
| Upah V-16 | Pekerjaan, jumlah/unit, tarif snapshot, total, approval/pembayaran | Pekerjaan/koreksi/disetujui, unpaid/partial/paid sendiri | Bukan task engine atau tambahan slip payroll |

Pembayaran online bersumber/tanggal/bukti; offline capture-only. Kasbon melebihi hak → saldo belum selesai, bukan pembayaran negatif. Carry/konversi pinjaman eksplisit, bukan otomatis.

**Batas aksi:** ABK hanya melihat hak/status sendiri, mengajukan kasbon/upah sesuai izin, melengkapi bukti/koreksi pengajuannya, dan mengonfirmasi atau mencatat penerimaan uang. Konfirmasi tersebut bukan posting pembayaran baru. Menetapkan hak, menyetujui, membukukan pembayaran/pencairan, menerapkan kasbon/offset, dan reversal hanya Owner berwenang secara online. Kata pembayaran/disetujui di tabel ABK adalah informasi status, bukan tombol untuk menyetujui atau membayar diri sendiri.

Satu transfer fisik untuk gaji/upah: alokasi kewajiban terpisah, referensi sama, jumlah cocok, slip tetap terpisah. Reversal menunjukkan kewajiban terbuka kembali. Pekerja berhenti masih memiliki hak/sisa untuk diselesaikan; tanpa prorata otomatis. ABK tidak melihat pekerja lain melalui search/notifikasi/unduhan.

<a id="ux14"></a>
## 14. Hasil periode, penutupan, dan laporan

### 14.1 Aktual — V-17

Owner memasukkan dokumen PT manual: nomor/tanggal/mitra/periode, lampiran, komponen/sumber, hak net pencairan. Upload bukan OCR/import. Data boleh belum lengkap; kualitas mengikuti SET-11.

Pisahkan **penghasilan kemitraan**, **hasil usaha periode**, **pencairan**. Laba memerlukan klasifikasi/coverage biaya cukup, bukan saldo bank atau angka net screenshot mitra.

```text
Penghasilan kemitraan yang telah direkonsiliasi
+ Pendapatan usaha lain
− Biaya Owner yang belum tercakup dalam hasil mitra
= Hasil usaha periode
```

Penjelasan ini bukan pengganti rumus PRD. Sapronak tidak dikurangi dua kali; tabungan hak Owner bukan otomatis biaya; pokok utang lama bukan biaya periode; reimbursement/coverage tidak ganda. Hak gaji/upah yang sudah diakui tetap biaya meski belum dibayar.

| Kondisi | Tampilan/aksi |
|---|---|
| Hanya net diketahui | Simpan belum direkonsiliasi; "Pendapatan rinci belum terverifikasi", bukan laba final |
| Pemberitahuan pencairan | Informasi, bukan kas masuk otomatis |
| Dana benar diterima | Akun/tanggal/nominal/bukti dan application; bisa bertahap |
| Dana sebelum dokumen | Penerimaan belum dipadankan; matching tidak membuat kas masuk kedua |
| Penyelesaian nonkas | Terpisah dari uang diterima, dengan komponen/bukti |
| Settlement negatif | Kewajiban ke mitra, bukan receipt negatif |
| Dokumen direvisi | Versi/delta/dampak, pembayaran lama tetap tertaut |

"Awaiting" hanya label sumber, bukan otomatis unpaid. Preview menunjukkan komponen belum terklasifikasi, coverage, alokasi, biaya pending yang memblokir finalisasi.

### 14.2 Selesai fisik versus lock — V-05/V-26

**Selesaikan pemeliharaan** dan **Tinjau & kunci keuangan** terpisah, masing-masing akibat/tanggal/scope. OFF/DAILY tidak memaksa tiket panen R2; deklarasi akhir CYC-07 menandai produksi yang belum diketahui.

Penghambat lock dapat ditindaklanjuti: klaim, alokasi, valuasi, klasifikasi settlement, hak gaji belum final, coverage. Kewajiban final belum dibayar tidak otomatis memblokir lock. Pembayaran sah setelah lock tetap boleh; perubahan hak/biaya perlu reopen beralasan.

OFF tetap selesai pembukuan/hasil bila cukup; tidak ada recording bukan penghambat keuangan atau bukti performa lengkap. Periode berikutnya dapat mulai sesuai aturan fisik tanpa menganggap keuangan lama selesai.

### 14.3 Laporan/ekspor — V-18/V-21

- Filter usaha/kandang/periode/tanggal/sumber/status terlihat di layar/unduhan. Saldo menurut waktu; biaya menurut pengakuan/alokasi, bukan seluruh cash out.
- Total dapat ditelusuri ke komponen/dokumen/versi/pembayaran/bukti sesuai izin.
- CSV/PDF adalah laporan; **Ekspor data usaha** paket terstruktur REP-19 dengan cakupan/versi/lampiran. Bukan backup server atau janji one-click restore/import.
- Paket hanya Owner berhak: konfirmasi cakupan, proses/gagal/selesai, link privat berumur terbatas. Tidak ada link publik/lampiran finansial di notifikasi.
- Print/PDF solid tanpa kaca/nav; label sementara/parsial tidak hilang dan makna tidak hanya warna.

<a id="ux15"></a>
## 15. Offline, status, konflik, dan pemulihan

### 15.1 Status multidimensi

| Dimensi | Label contoh | Makna/aksi |
|---|---|---|
| Simpan/kirim | Draf · Tersimpan di HP · Mengirim · Terkirim · Hasil belum diketahui | Terkirim setelah receipt; retry operasi sama |
| Review finansial | Menunggu pemeriksaan · Perlu dilengkapi/diperbaiki · Ditolak · Dibukukan | Bukan otomatis pembayaran |
| Recording | Draf · Terkirim · Perlu dicocokkan · Direvisi | Status produksi berbeda dari inventory |
| Pembayaran | Belum dibayar · Sebagian · Lunas · Belum direkonsiliasi | Dari hak/application sah, bukan label mitra |
| Bukti | Di HP · Menunggu unggah · Terunggah · Unggah gagal | Retry bukan transaksi baru |
| Kualitas | Sementara · Parsial · Nilai belum lengkap · Data sampai [tanggal] | Bukan hijau sukses umum |

Status berdampingan: **Terkirim · Menunggu pemeriksaan · Foto belum terunggah**. Loading bukan saldo nol. Live region mengumumkan perubahan secukupnya, bukan seluruh halaman berulang.

### 15.2 Kontrak state semua layar

| State | Informasi | Aksi aman |
|---|---|---|
| Loading | Memuat; skeleton bukan nilai aktual | Kembali/batal, bukan request uang kedua |
| Empty | Belum ada data versus filter kosong | Aksi pertama berizin/reset filter |
| Error | Apa gagal, apakah tersimpan | Retry/detail/draf/bantuan |
| Offline/stale | Waktu data/batas aksi | Capture berizin, antrean; tidak approve/post |
| No permission | Penjelasan tanpa rincian rahasia | Scope sah/bantuan Owner |
| Pending/conflict | Alasan/dependensi/lokal vs server | Lengkapi/koreksi/review, jangan hapus otomatis |
| Success | Efek yang benar sudah terjadi | Detail/aksi berikut relevan |

### 15.3 Sinkronisasi — V-19

Pisahkan dokumen/lampiran/dependensi/konflik, timestamp dan aksi per item. Retry seluruh antrean tidak mengulang efek sah; hasil parsial per item. Background delivery saat aplikasi tertutup bukan jaminan; retry saat dibuka/online/manual tersedia.

- Storage gagal: **Belum tersimpan di HP. Ruang penyimpanan tidak cukup.** Form tetap ada; jangan menyuruh hapus data browser berisi antrean tanpa peringatan.
- Lease habis: cache bisnis terkunci sampai reauth. Capture-only OFF-17 hanya perangkat/local unlock sah, field minimum, origin tenant immutable, tanpa saldo/autocomplete/cache bisnis. Bukan recording penuh setelah izin kedaluwarsa.
- Logout selalu boleh: sinkron/kembali/keluar dengan antrean terkunci pada user sama. Hapus lokal eksplisit dan berisiko; akun berikutnya tidak membaca antrean lama.
- Izin/periode berubah: tahan data aman, jangan ganti author/tenant atau paksa post. Pengguna tercabut tidak melihat versi server rahasia.
- Konflik: tampilkan beda field jika berhak, ajukan koreksi atau gunakan versi sah dengan konfirmasi; tidak "timpa paksa" default.
- Lampiran privat mewarisi izin. Batas awal 10 MB/file, 5 file/transaksi ditampilkan. Foto gagal tidak menghapus teks; bukti kurang dapat memblokir approval sesuai kebijakan.

### 15.4 Recovery dan restore

V-22 membedakan recovery orang sama, perangkat hilang, pergantian primary owner. Bantuan manual mengikuti SEC-13/SEC-14; sengketa tanpa bukti bukan bypass admin. Notifikasi tidak berisi rahasia/saldo lengkap.

NFR-11: acknowledgement sebelum restore mungkin perlu dicocokkan ulang. Tampilkan **Data dipulihkan; sebagian catatan perlu diperiksa kembali**, referensi/jalur review, bukan auto-resubmit transaksi baru. `RESTORE_REVIEW_REQUIRED` istilah internal, bukan copy utama. Server epoch/otorisasi memblokir mutasi usang; UI bukan satu-satunya pengaman. Data local-only pada HP hilang tidak dijanjikan pulih dari backup server.

<a id="ux16"></a>
## 16. Komponen, bahasa, dan tutorial

### 16.1 Komponen wajib beserta state

| Komponen | Kontrak |
|---|---|
| App shell/context | Scope/switch aman/timestamp, glass/solid, focus tidak tertutup |
| Nav/sidebar | Label/active state bukan warna saja, badge jelas, max lima tujuan |
| Money/quantity field | Locale/unit/empty-zero/paste/edit/validasi/keyboard/readonly |
| Recording switcher | Tiga bagian, kelengkapan, keyboard/focus, draft dipertahankan |
| Value card | Label/nilai/basis/timestamp/coverage/drill-down, solid |
| Badge | Teks/ikon/warna, status independen tidak saling mengganti |
| Transaction list/detail | Tanggal/pencatat/sumber/nominal/status/bukti, mobile, aksi berizin |
| Attachment picker | Kamera/file, preview/ukuran/status/retry, alternatif alasan |
| Review/batch | Before-after/efek/exception/hasil per dokumen, online-only |
| Dialog/sheet | Judul/akibat/aksi jelas/focus return/draft guard, opaque |
| Empty/error/offline | Copy spesifik dan tindakan aman, bukan angka palsu |
| Inbox/tutorial | Deep link berizin, tidak membocorkan nominal ke notifikasi perangkat |

### 16.2 Bahasa

| Hindari | Gunakan |
|---|---|
| CONF / Submit / sukses generik | Simpan draf / Kirim untuk diperiksa / Sudah dibukukan sesuai efek |
| Saldo Saya | Uang Kas — uang usaha yang Anda pegang; gaji/kasbon terpisah |
| Transfer sekarang | Catat penyerahan/pembayaran yang sudah dilakukan |
| Semua beres | Jumlah sukses/pending/ditolak dan tindakan berikut |
| Laba Rp0 saat kosong | Hasil usaha belum dapat dihitung: [data kurang] |
| Stok aman tanpa basis | Stok tercatat [jumlah], data sampai [waktu], [pending] |
| Error 409 / Forbidden | Catatan sudah berubah / Akses berubah, tanpa data rahasia |

### 16.3 Tutorial — V-23

Panduan R1: recording harian; pakan datang/terpakai; kas/kasbon; belanja pribadi; beli/pakai gas; offline; review; hasil usaha/pencairan. Teks/gambar utama sesuai peran/mode dapat dibaca tanpa video/data pelanggan.

**Cara mengisi** dekat form, dapat ditutup/dibuka ulang. Bukan tur wajib, ujian, sertifikat, tracking pegawai, atau LMS/CMS kompleks. Video opsional dengan caption/transkrip/kontrol koneksi, tanpa autoplay. Bukan rekomendasi obat/jadwal otomatis.

<a id="ux17"></a>
## 17. Skenario penerimaan dan pengujian

**Rencana tes, bukan hasil tes aplikasi.** Seluruh V-01–V-26 tunduk state bagian 15. UT melengkapi, tidak menggantikan AC/GOLD PRD dan tes ledger/otorisasi/recovery.

| ID | Skenario dan hasil wajib | Layar/acuan |
|---|---|---|
| UT-01 | ABK langsung scope sah; URL kandang lain tidak bocor | V-02, V-03; UI-10, UI-12 |
| UT-02 | Dua penugasan paralel tidak membuat dua ABK aktif; pekerja tanpa akun tetap boleh | V-20; ONB-04 |
| UT-03 | Ganti ABK, antrean/kas lama tidak diwariskan; review Owner berizin | V-08, V-19, V-20; OFF-06 |
| UT-04 | OFF sampai hasil periode tanpa recording/panen dummy | V-05, V-17; UI-13, SET-11 |
| UT-05 | DAILY tiga bagian; ABK tidak input pakan datang/DOC | V-06, V-07; UI-12 |
| UT-06 | Kosong/nol berbeda; 25 sampel/30 kg → 1,2 kg; tidak sampling bukan nol | V-06; REC-07, REC-10 |
| UT-07 | Recording dan consumption kejadian sama tertaut/sumber terlihat; 100→90 kg, retry/dua perangkat → 90, bukan 190; pemakaian existing tidak dibuat ulang ketika recording dilengkapi | V-06, V-12, V-19; REC-09, REC-18, FIN-12 |
| UT-08 | Penerimaan Owner terlambat: laporan disimpan/pending, stok tidak dibuat-buat | V-06, V-07; INV-04 |
| UT-09 | Gap/backfill/timezone memakai tanggal kegiatan; gap bukan nol | V-06; UI-03, OFF-14 |
| UT-10 | Ganti mode saat HP offline: cutoff/riwayat/draft tetap, tidak auto-post lintas mode | V-06, V-19, V-20; REC-03 |
| UT-11 | Dua klaim penyerahan sama → satu movement; nominal sama tidak auto-merge | V-08, V-13; OFF-16 |
| UT-12 | Kas/talangan/kredit/parsial punya efek benar; nota susulan tidak ganda | V-09, V-10; CASH-05, CASH-07, CASH-08 |
| UT-13 | Owner langsung tanpa kas ABK fiktif/pengajuan diri sendiri | V-09; CASH-06 |
| UT-14 | Batch satu versi berubah: hasil per item, retry tidak ganda | V-11; FIN-13 |
| UT-15 | Perkiraan/unknown receipt tidak dianggap saldo sah atau menghitung klaim dua kali | V-08; OFF-16, FIN-12 |
| UT-16 | Pengembalian sisa bukan income/pelunasan kasbon | V-08, V-15; CASH-10 |
| UT-17 | Pintasan beli/terima berbeda dari pakai; gas/solar ditalangi ABK → penggantian, bukan kasbon. Receipt susulan, langsung pakai, pindah tabung, pakai parsial/revisi nilai tertaut tanpa biaya/stok ganda | V-09, V-12, V-26; CASH-08, INV-13, INV-15, INV-16 |
| UT-18 | Gaji/kasbon/upah satu pembayaran fisik tetap alokasi/slip terpisah | V-14, V-15, V-16; PAY-04, PAY-14 |
| UT-19 | Net-only/label mitra/payout/nonkas tidak menyamakan income/laba/kas | V-17; SET-05, SET-11 |
| UT-20 | Cost coverage tidak dikurangi lagi; classification pending memblokir laba final | V-17; SET-08, COST-11 |
| UT-21 | Selesai fisik bukan lock; utang final unpaid tidak otomatis memblokir lock | V-05, V-26; CYC-07, CYC-11 |
| UT-22 | Tengah periode: coverage/opening terlihat, biaya historis tidak ganda | V-04, V-18; ONB-10 |
| UT-23 | Offline/restart pulihkan antrean user sah; foto gagal tidak hapus teks | V-06, V-09, V-19; OFF-02, OFF-15 |
| UT-24 | Storage gagal/timeout tanpa centang palsu/operasi baru otomatis | V-19; OFF-02, FIN-12 |
| UT-25 | Lease/logout/ganti akun mengunci cache; capture-only tanpa bisnis/origin baru | V-19, V-22; OFF-03, OFF-17 |
| UT-26 | Restore sesudah ack → review, bukan pembayaran fisik kedua | V-19; NFR-11 |
| UT-27 | Recovery/transfer tidak berwenang diblokir; admin bukan bypass | V-22, V-24; SEC-13, SEC-14 |
| UT-28 | Paket ekspor/PDF-CSV privat, coverage tetap, bukan janji restore | V-18, V-21; REP-19 |
| UT-29 | Glass/solid/no-blur/reduced effects/forced colors tetap berfungsi/terbaca | Semua layar; UI-09 |
| UT-30 | Kontras komposit saat scroll dan focus diuji, bukan diasumsikan | Semua layar; bagian 4–5 |
| UT-31 | Viewport utama/reflow 320/zoom 200%/keyboard: angka/error/action tidak tertutup | Semua layar; UX-08 |
| UT-32 | Keyboard/screen reader/modal/tab/paste/nominal panjang benar | V-06, V-09, V-11; UX-06, UX-07 |
| UT-33 | Tutorial/OFF/offline tidak mewajibkan video atau menghalangi kerja | V-23; UI-13 |
| UT-34 | Deep link off/revoked, bukti/slip, dan aksi payroll sendiri tunduk server; proyeksi mitra/stok ABK tidak mengirim harga/invoice/rekening, bukan sekadar menyembunyikan field | V-06, V-07, V-10, V-14, V-21; UI-10 |
| UT-35 | Riwayat/inbox/status layanan tidak membuka data orang lain; baca/ekspor menurut kebijakan | V-03, V-24, V-25; PRD bagian 7.2 |

### 17.1 Uji kegunaan dan bukti

Gunakan calon Owner/ABK pilot pada HP nyata; sepuluh percobaan bukan otomatis sepuluh pengguna. Catat layar/browser/koneksi/kondisi terang/bantuan/kesalahan/waktu. Data sintetis/berizin direduksi; jangan menerbitkan rekaman privat.

- Target PRD: ≥8/10 percobaan belanja tanpa foto ≤60 detik tanpa bantuan; sasaran, belum hasil.
- Usulan recording: ≥8/10 rekap satu bangunan/satu pakan/tanpa sampling ≤2 menit setelah pengenalan. Ukur koreksi/offline juga; revisi target beralasan, jangan menghapus kegagalan.
- Owner menemukan kas/biaya/sisa gaji-kasbon ≤3 navigasi utama; pengguna dapat menjelaskan saldo sah/perkiraan dan gaji/upah tanpa diberi jawaban.
- Bandingkan glass/solid pada tugas sama. Jika salah baca/input/performa memburuk, kurangi efek sebelum memoles dekorasi.
- Bukti appearance: screenshot fresh normal/error/offline pada viewport utama. Bukti behavior: jalankan tugas di prototype/app; screenshot bukan bukti sinkron/izin/tanpa double posting.

<a id="ux18"></a>
## 18. Keputusan terbuka dan handoff

### 18.1 Belum final

| Keputusan | Usulan | Gate |
|---|---|---|
| Merek/warna/font | Token bagian 4, kaca selektif | Pilih setelah dua variasi mockup, sebelum baseline |
| Per bangunan atau gabungan | Per bangunan, satu ABK semuanya | Q-12 sebelum model recording dikunci; tanpa prorata fiktif |
| Jam pengingat/timezone | Tanggal usaha, inbox, belum push | Sebelum prototype recording; bukan reminder arbitrer |
| Unit pakan/gas/solar/sisa gas | Master/metode eksplisit | Q-04/Q-05 sebelum final biaya |
| Review/bukti | Kontrol Owner, batch tersedia | Q-03 sebelum finansial pilot |
| Perangkat/lease/local unlock | PRD + uji nyata/solid fallback | Q-06 sebelum offline pilot |
| RHPP/pajak/tabungan/potongan | Manual, incomplete sampai terverifikasi | Q-08 sebelum laba final |
| Gaji/kasbon khusus | Tanpa auto-carry/prorata/potong upah | Q-09 sebelum payroll pilot |
| Login/retensi/recovery/stack | ADR/kebijakan, bukan pilihan visual | Q-10/Q-11 sebelum data produksi |

Open decisions tidak menghalangi wireframe berasumsi jelas, tetapi memblokir klaim produksi bagian terdampak. Token visual bukan keputusan subscription; harga tetap pemilik produk.

### 18.2 Checklist persetujuan/handoff

- [ ] PRD/UX selaras OFF/DAILY, harian, penerimaan Owner, satu ABK per kandang.
- [ ] Wireframe prioritas disetujui, tanpa rancu kas/gaji/kasbon/upah atau laba/pencairan.
- [ ] Mockup dipilih pengguna; token final dan kompromi keterbacaan tercatat.
- [ ] Komponen memiliki keyboard/error/offline/pending/no-permission/solid fallback.
- [ ] Perangkat/viewport/keyboard/data panjang/koneksi putus diuji.
- [ ] UT serta AC/GOLD ditautkan ke hasil nyata; kegagalan tidak ditutup dummy.
- [ ] Technical design menentukan offline/versioning/server authorization/efek ledger/recovery tanpa mengubah makna UX.
- [ ] Implementation plan berbasis alur vertikal input→simpan→kirim→review→ledger/laporan→koreksi, bukan halaman saja.
- [ ] Persetujuan mencatat versi/tanggal/keputusan/sisa terbuka. Selesai menulis dokumen bukan berarti checklist ini sudah lulus.

<a id="ux19"></a>
## 19. Referensi dan riwayat

### 19.1 Sumber

- [PRD](PRD.md): scope, role, kas/stok/payroll, settlement, UX/offline, recovery, acceptance gate.
- Screenshot pengguna sebagai referensi privat konteks siklus, pakan/mortalitas/sampling, input angka, masuk/pemakaian. Bukan dokumentasi API/validasi/otorisasi atau bukti aplikasi mitra telah diuji. Tidak direproduksi/ditautkan sebagai aset publik.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): acuan uji, bukan klaim sertifikasi.
- [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) dan [prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency), ditinjau 20 September 2026: blur enhancement; reduced transparency belum merata, sehingga fallback/pengaturan aplikasi diperlukan.

### 19.2 Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 20 September 2026 | Rancangan R1: recording opsional sejak awal, satu ABK/kandang, keuangan sampai hasil periode, kaca selektif, tahapan persetujuan visual, offline/recovery, rencana uji. Belum mockup final/implementasi. |
