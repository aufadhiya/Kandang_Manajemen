# UX/UI Specification — Manajemen Usaha Kandang Broiler Kemitraan

| Metadata | Nilai |
|---|---|
| Versi | 0.3 — audit kemudahan: arahan bebas, kerja di tempat, keypad angka, dan glosarium |
| Tanggal | 23 September 2026 |
| Sumber bisnis | [PRD v0.5](PRD.md) dan keputusan pengguna terbaru, termasuk K-38 |
| Bahasa | Bahasa Indonesia; IDR dan satuan ditulis jelas |
| Perangkat utama | HP untuk Owner dan ABK; desktop sebagai perluasan |
| Arah terkonfirmasi | Aplikasi sederhana, sangat dinamis/adaptif, modern; glassmorphism tetap mudah dibaca |
| Status rancangan | Keputusan dan usulan dibedakan; detail visual belum final |
| Inventaris UX | 26 layar (V-01–V-26); 49 skenario (UT-01–UT-49) |
| Rancangan alur pendamping | [Alur Layar & Wireframe v0.1](UX_FLOWS_WIREFRAMES.md): perjalanan R1, keadaan layar, dan rencana validasi; masih usulan |
| Implementasi | Spesifikasi, bukan aplikasi/prototype yang sudah berjalan atau lulus UAT |
| Fase kerja saat ini | Perencanaan `.md` saja, tanpa mockup atau prototype; lihat [PLANNING.md](PLANNING.md) |
| Handoff pelaksanaan | [Rencana tes](TEST_PLAN.md) mencakup seluruh UT; [Implementation Plan](Implementation%20Plan.md) memetakan layar/alur ke tugas, tanpa mengubah makna bisnis atau memberi izin implementasi |
| Privasi | Data dan contoh sintetis; materi privat pengguna tidak disalin ke dokumen atau aset publik |

## Daftar isi

1. [Kontrak dokumen dan prinsip](#ux01)
2. [Keputusan, scope, dan peran](#ux02)
3. [Validasi desain dan sifat dinamis](#ux03)
4. [Arah visual dan token awal](#ux04)
5. [Tata letak, aksesibilitas, dan input](#ux05)
6. [Arsitektur informasi dan navigasi](#ux06)
7. [Inventaris layar R1](#ux07)
8. [Wireframe prioritas](#ux08)
9. [Onboarding, akun, dan tim](#ux09)
10. [Recording harian bersama](#ux10)
11. [Uang kas, belanja, dan pemeriksaan](#ux11)
12. [Penerimaan barang tanpa pelacakan stok R1](#ux12)
13. [Gaji, kasbon, dan upah pekerjaan](#ux13)
14. [Hasil periode, penutupan, dan laporan](#ux14)
15. [Offline, status, konflik, dan pemulihan](#ux15)
16. [Komponen, bahasa, dan panduan](#ux16)
17. [Skenario penerimaan dan pengujian](#ux17)
18. [Keputusan terbuka dan handoff](#ux18)
19. [Referensi dan riwayat](#ux19)

<a id="ux01"></a>
## 1. Kontrak dokumen dan prinsip

PRD menetapkan arti bisnis, izin, efek uang, dan batas rilis. Dokumen ini menetapkan bagaimana pengguna menemukan, memasukkan, meninjau, dan memahami data. Ikuti keputusan pengguna terbaru dan PRD v0.5 yang diselaraskan; jangan menutupi konflik bisnis dengan mengganti label. Penanda **Terkonfirmasi** merujuk keputusan brainstorming. **Usulan** adalah rancangan yang masih perlu validasi; **Terbuka** memerlukan keputusan kebijakan.

ID `V` menunjuk layar, `UI` prinsip lintas layar, `UT` skenario penerimaan UX. Nama rute hanya usulan navigasi, bukan kontrak API. Menyembunyikan menu bukan pengganti otorisasi server.

| ID | Prinsip |
|---|---|
| UI-01 | Prioritaskan HP; tata letak menyesuaikan peran, kesiapan usaha, dan tugas berikutnya tanpa memindahkan navigasi secara mengejutkan. |
| UI-02 | Gunakan label pendek dan jelas; helper text menjelaskan arti bisnis dengan bahasa sehari-hari. |
| UI-03 | Tampilkan pilihan/default yang terlihat; jangan menyimpan pilihan baru atau angka otomatis secara diam-diam. |
| UI-04 | Setup dapat dilakukan bertahap; tampilkan tindakan berikut yang berguna, bukan wizard panjang atau checklist palsu. |
| UI-05 | Data kosong/unknown bukan nol. Tunjukkan cakupan, tanggal data, dan bagian yang belum diketahui. |
| UI-06 | Konteks usaha, siklus, tanggal, orang, dan izin terlihat sebelum aksi disimpan. Draft tidak ikut pindah konteks diam-diam. |
| UI-07 | Satu recording harian efektif per siklus kandang dan tanggal pencatatan; koreksi mengganti versi berlaku, bukan menjumlahkan versi. |
| UI-08 | Recording harian valid langsung berlaku; belanja tetap melalui pemeriksaan, tanpa menyimpulkan posting finansial otomatis. Owner-only online posting belanja adalah default PRD D-03/Q-03, bukan keputusan auto-post yang telah disetujui. |
| UI-09 | Catatan lokal, diterima server, pemeriksaan belanja, pembukuan, dan uang dibayar adalah status berbeda. |
| UI-10 | ABK mencatat belanja; pemeriksaan harian Owner dan bukti opsional terkonfirmasi. Owner-only online posting adalah default PRD D-03/Q-03, bukan keputusan produk final. |
| UI-11 | Kas pegangan, gaji, kasbon/pinjaman, dan upah pekerjaan dipisahkan per orang dan tidak saling mengubah otomatis. |
| UI-12 | R1 tidak membentuk saldo stok operasional atau riwayat pemakaian gas/solar. Jangan mengklaim stok/valuasi yang tidak dicatat. |
| UI-13 | Akun bersifat pribadi dan penugasan membatasi data yang terlihat; Owner satu tenant tidak mengelola akun tenant lain. |
| UI-14 | Offline selalu menunjukkan status/waktu yang diketahui; retry tidak membuat transaksi kedua dan pengiriman latar bukan jaminan. |
| UI-15 | Glassmorphism adalah lapisan visual, bukan syarat fungsi, keterbacaan, privasi, atau aksesibilitas. |
| UI-16 | Arahkan tanpa mengekang: satu saran utama dari data nyata dan paling banyak dua saran pendamping; tombol **Catat** dan navigasi utama selalu tersedia; urutan hanya dikunci dependensi nyata (K-38, UX-17). |
| UI-17 | Kerjakan di tempat: input singkat di lembar, detail di baris buka-tutup, aksi dari baris yang dibuka; pindah halaman hanya untuk tugas panjang (D-27, UX-18). |
| UI-18 | Angka diisi dengan keypad aplikasi yang besar dan jelas, selalu dengan jalan keluar ke keyboard HP, paste, keyboard fisik, dan pembaca layar (D-26, UX-06). |
| UI-19 | Bantuan pintar menyarankan dengan alasan yang terlihat; tidak pernah mengisi fakta, memilih sumber dana, mengirim, atau membukukan sendiri (UX-19). |
| UI-20 | Satu konsep satu istilah menurut glosarium §16.5; label 1–3 kata, bantuan paling banyak satu kalimat pendek, tanpa istilah teknis (UX-20). |

<a id="ux02"></a>
## 2. Keputusan, scope, dan peran

### 2.1 Keputusan dan tingkat kepastian

| Topik | Keputusan terkini | Status UX |
|---|---|---|
| Sifat aplikasi | Sederhana, sangat dinamis, menampilkan langkah yang relevan tanpa membanjiri pengguna | Terkonfirmasi; detail adaptasi dapat diuji |
| Setup Owner | Arah utama: siapkan data usaha/kandang dan mode recording sebelum DOC masuk; pengaturan lain dapat dilanjutkan nanti | Terkonfirmasi |
| Tim | Satu kandang dapat memiliki banyak ABK. Setiap orang memakai akun sendiri; satu akun ABK dapat ditugaskan ke beberapa kandang hanya dalam tenant Owner yang sama | Banyak ABK/akun pribadi terkonfirmasi (K-26); cakupan penugasan mengikuti usulan SEC-15/D-25 |
| Recording | OFF atau DAILY; jika DAILY, satu ringkasan harian bersama per siklus kandang dan tanggal pencatatan, bukan per ABK atau bangunan | Terkonfirmasi (PRD K-25/REC-14–REC-19) |
| Koreksi recording | Owner atau ABK berizin dapat mengoreksi; versi berlaku dan pencatat/riwayat tetap terlihat | Terkonfirmasi |
| Penerimaan Owner | Catat DOC, pakan, dan sapronak mitra yang benar-benar diterima; penerimaan pakan/sapronak R1 adalah informasi, bukan saldo stok | Terkonfirmasi (PRD K-27) |
| Belanja ABK | Owner memeriksa transaksi setiap hari; foto/nota opsional | Terkonfirmasi (PRD K-34) |
| Posting belanja ABK | Pemeriksaan/posting Owner secara online; auto-post uang tidak disimpulkan dari keputusan recording | Default PRD D-03; tindak lanjut saat klaim belum jelas mengikuti Q-03 |
| Bukti belanja | Foto/nota boleh dilampirkan tetapi tidak wajib; ketiadaannya tidak mewajibkan alasan | Terkonfirmasi |
| Stok/pemakaian | R1 tidak punya pencatatan rutin pemakaian gas/solar, saldo stok, opname, atau valuasi persediaan | Terkonfirmasi |
| Kasbon | Terpisah dari gaji, dapat lebih besar dari upah satu periode, dan saldo tetap kasbon sampai Owner memutuskan pemotongan | Terkonfirmasi |
| Akun Owner | Setelah verifikasi, Admin memprovisikan tenant, username Owner, dan password sementara sekali pakai melalui serah-terima privat; Owner aktivasi online dan mengganti password sebelum aktivitas bisnis. Tidak ada pendaftaran mandiri atau klaim tenant publik; email tidak wajib | Mengikuti PRD ONB-01/ONB-09; detail handoff privat dan aktivasi ditautkan ke AC-94 |
| Kredensial ABK per tenant | Default usulan: akun staf dikelola satu tenant Owner; username ternormalisasi unik global untuk login, tetapi identitas ABK tidak dipakai bersama antar-Owner | Usulan D-25; perlu uji namespace/copy bentrok |
| Lease offline 72 jam | Ambang awal untuk diuji pada HP/koneksi lapangan, bukan jaminan offline atau nilai final | Usulan |
| Visual | Glassmorphism modern, tetapi form, angka dan status tetap solid/terbaca | Arah terkonfirmasi; token belum final |
| Kemudahan dan arahan | Aplikasi mengarahkan langkah berikutnya seperti Duolingo, tetapi pengguna bebas memilih tindakan; bahasa singkat dan tidak ambigu; terasa pintar dan memanjakan | Terkonfirmasi (PRD K-38); pola rinci di bawah adalah usulan yang diuji |
| Keypad angka | Keypad aplikasi untuk rupiah, kuantitas, dan hitungan ekor dengan pilihan kembali ke keyboard HP | Arah terkonfirmasi K-38; rancangan D-26 |
| Kerja di tempat | Lembar bawah, baris buka-tutup, dan aksi dari daftar agar jarang pindah halaman | Arah terkonfirmasi K-38; rancangan D-27 |

### 2.2 Pilihan recording R1

| Pilihan | Yang dilakukan | Yang tidak berubah |
|---|---|---|
| **OFF** | Keuangan, belanja, gaji/kasbon/upah, penerimaan informasional, hasil periode dan laporan tetap tersedia | Tidak membuat recording atau angka produksi nol secara otomatis |
| **DAILY** | Menambahkan satu recording harian bersama: pakan dipakai hari itu, mati/afkir, serta sampling bila dilakukan | Tidak menambah antrean persetujuan produksi, stok pakan, pemakaian bernilai uang, FCR, atau estimasi mitra |

Keduanya bukan paket berlangganan. Owner memilih mode secara eksplisit; helper text menerangkan apa yang akan diminta setiap hari. Mode tersimpan pada siklus kandang dan dapat ditemukan kembali melalui **Kandang → Periode → Pengaturan**; perubahan mode/cutoff tidak mengubah riwayat diam-diam. OFF tidak menghalangi keuangan. DAILY tidak memaksa input per bangunan atau mengklaim performa lengkap.

R1 mendukung belanja barang/jasa operasional; gas, solar, listrik, jasa, dan peralatan adalah contoh, bukan daftar pembatas. Tidak ada pencatatan pemakaian rutin barang, saldo stok, opname, jumlah sisa, valuasi persediaan, atau aset persediaan. Fitur lanjutan seperti integrasi mitra, panen per DO, FCR/IP, kalkulasi kontrak, Mandor/PPL, task engine, push, IoT, dan CCTV tidak menjadi menu R1.

### 2.3 Peran dan batas data

- **Owner:** mengelola satu atau lebih usaha/kandang miliknya, membuat/mengelola akun ABK tenant sendiri, memberi penugasan, melihat ringkasan bersama, mengoreksi recording, meninjau belanja, mencatat penerimaan, mem-posting finansial secara online, dan melihat laporan sesuai izin.
- **ABK:** akun pribadi untuk orang tersebut; melihat usaha/kandang yang ditugaskan, recording bersama, belanja sendiri, kas pegangan sendiri, gaji/kasbon sendiri, dan upah pekerjaannya sendiri. Tidak melihat data finansial, kas, atau hak ABK lain.
- **Admin layanan:** mengelola status/layanan tenant sesuai mandat; tidak mendapat akses rutin ke isi transaksi, kredensial, atau dokumen usaha.
- Banyak ABK boleh aktif pada satu kandang. Satu akun ABK dapat ditugaskan ke beberapa kandang hanya di tenant Owner yang sama; tidak ada akun/assignment lintas Owner atau tenant.

<a id="ux03"></a>
## 3. Validasi desain dan sifat dinamis

Sasaran bukan sekadar halaman yang berubah warna: beranda, kartu tindakan, dan helper text menyesuaikan peran, mode OFF/DAILY, progres setup, dan data yang benar-benar tersedia. Jangan mengubah angka, menetapkan mode, mengirim formulir, atau mengalihkan pengguna otomatis berdasarkan tebakan.

Fase aktif hanya dokumentasi. Tahap berikut meninjau kelengkapan spesifikasi, bukan menguji antarmuka yang belum dibuat.

| Tahap | Artefak `.md` | Yang ditinjau |
|---|---|---|
| A — arah | Dokumen ini dan contoh label | Bahasa singkat, tugas harian, izin, dan setup bertahap |
| B — struktur | Sketsa teks Owner/ABK dan alur utama | Urutan setup sebelum DOC, recording bersama, pemeriksaan belanja, batas offline |
| C — perincian sistem | Arsitektur, keamanan, data dan kontrak layanan yang tertaut | Dukungan terhadap alur UX tanpa mengubah makna bisnis |
| D — rencana pengujian | Skenario normal, gagal, offline, konflik, serta aksesibilitas | Hasil yang diharapkan dan bukti yang kelak perlu dikumpulkan |
| E — peninjauan dokumen | Status keputusan, rujukan, batas rilis dan backlog | Persetujuan yang benar-benar diberikan serta kebijakan yang masih terbuka |

Prioritas alur tertulis tetap **Aktivasi Owner → Data Kandang → Tim Kandang (opsional) → pilih OFF/DAILY → Siapkan Periode (Persiapan) → DOC Masuk**, beranda adaptif Owner, Hari Ini ABK, Recording Harian, Catat Belanja, dan Uang Kas. Tidak membuat mockup sebagai langkah berikutnya. Jika implementasi kelak diminta, keterbacaan solid/kaca, perangkat kecil dan keyboard tetap perlu diuji; dokumen atau persetujuan arah visual bukan bukti kelulusan aplikasi.

<a id="ux04"></a>
## 4. Arah visual dan token awal

### 4.1 Kaca pada bingkai, data pada permukaan solid

Gunakan hierarki teks jelas, radius konsisten, ikon berlabel, dan ruang kosong yang cukup. Latar boleh memiliki gradien biru/teal sangat halus. Hindari foto nota, latar bergerak, dan animasi di belakang angka.

Header atau navigasi boleh translucent. Form, daftar, kartu saldo, status, konfirmasi uang, tabel, dan laporan memakai permukaan opaque. Scrim boleh transparan; modal input tetap solid. Jangan menurunkan opacity seluruh teks/container.

### 4.2 Token usulan, bukan brand final

| Token | Nilai awal | Penggunaan |
|---|---|---|
| canvas | `#F3F6FB` | Latar halaman |
| surface | `#FFFFFF` | Form, angka, daftar, dialog |
| text-primary | `#132238` | Judul/data utama |
| text-secondary | `#526176` | Bantuan dan timestamp |
| action-primary | `#155EEF` | Tombol utama dengan teks putih |
| accent | `#0E7490` | Aksen terbatas; bukan satu-satunya tanda status |
| control-border | `#64748B` | Batas field yang terlihat |
| divider | `#E2E8F0` | Pemisah dekoratif |
| success | `#067647` pada `#ECFDF3` | Status sukses beserta label/ikon |
| warning | `#93370D` pada `#FFFAEB` | Pending/perhatian |
| danger | `#B42318` pada `#FEF3F2` | Error/tindakan berisiko |
| info | `#175CD3` pada `#EFF8FF` | Informasi/pengiriman |
| glass-surface | `rgb(255 255 255 / 0.88)` | Shell dengan latar terkendali |
| glass-blur | `12px` | Batas awal eksplorasi, bukan target performa |
| shadow-panel | `0 8px 24px rgb(19 34 56 / 0.08)` | Elevasi, bukan batas satu-satunya |

Font awal: `system-ui, -apple-system, "Segoe UI", sans-serif`; jangan bergantung pada CDN untuk kerja offline. Usulan ukuran: judul 24/32 px, isi/input 16/24 px, metadata nonkritis 14/20 px, nominal utama 28–32 px dan dapat membungkus. Gunakan tabular numerals bila tersedia. Hit area kontrol ≥44×44 px; aksi utama ≥48×48 px. Nilai penting tidak dipotong menjadi `jt`.

### 4.3 Fallback dan rendering

1. Solid adalah baseline; bila blur tidak tersedia, dimatikan, atau lambat, fungsi dan informasi tetap sama.
2. Sediakan **Kurangi efek visual**; hormati preferensi sistem bila tersedia. Blur bukan pengaman data pribadi.
3. `prefers-reduced-motion` mematikan gerak nonesensial; forced colors tetap menampilkan kontrol/focus dengan warna sistem.
4. Usulan maksimal dua bidang blur yang terlihat; jangan blur baris transaksi atau menganimasikan blur. Jika HP lambat, gunakan solid.
5. Animasi tidak boleh menunda simpan/konfirmasi dan tidak mendahului keberhasilan penyimpanan.
6. Uji kontras pada komposit yang dirender, termasuk ketika konten bergulir di bawah header. Target acuan WCAG: teks normal ≥4,5:1, teks besar ≥3:1, dan fokus/kontrol relevan ≥3:1.

Token di atas bukan klaim sertifikasi WCAG. Mockup final tetap memerlukan uji kontras, keyboard, screen reader, dan perangkat.

<a id="ux05"></a>
## 5. Tata letak, aksesibilitas, dan input

### 5.1 Responsive dan lapisan

- Uji 360, 390, 768, dan 1280 CSS px; reflow sampai ekuivalen 320 CSS px. Hindari horizontal scroll halaman utama.
- HP memakai satu kolom dan bottom navigation dengan safe area. Form panjang memakai action bar yang tidak bertumpuk dengan nav.
- Tablet/desktop boleh memakai dua panel atau sidebar; nama/urutan tujuan tetap konsisten. Tidak ada aksi yang hanya tersedia lewat hover/right-click.
- Modal punya judul, tombol tutup, focus trap, dan fokus kembali ke pemicu. Hanya satu modal aktif; back/escape tidak boleh menghilangkan draft tanpa konfirmasi.
- Keyboard HP tidak menutup field, error, atau tombol simpan. Tombol terapung tidak menutupi data; swipe bukan satu-satunya cara.

### 5.2 Field dan angka

- Label menetap, satuan dan wajib/opsional terlihat. Error berada dekat field dan dapat dibaca/difokuskan setelah submit gagal.
- Nominal IDR memakai bilangan bulat tanpa pecahan (contoh `Rp150.000`). Persentase menampilkan paling banyak dua angka desimal. Presisi kuantitas mengikuti satuannya (contoh `12,5 kg`); satuan dan konversi ditampilkan.
- Empty bukan nol saat blur. Untuk field recording, pengguna memilih/memasukkan nol secara sengaja bila memang tidak ada kejadian. Data kemarin tidak disalin otomatis.
- Format Indonesia memakai koma desimal. Paste ambigu meminta konfirmasi; jangan mengubah nilai diam-diam. Uji caret, separator, pembaca layar, dan angka panjang.
- Default tanggal/barang boleh membantu, tetapi harus terlihat dan bisa diganti. Perubahan konteks tidak membawa draft diam-diam.

### 5.3 Keypad angka — D-26

```text
Nominal
Rp1.250.000
satu juta dua ratus lima puluh ribu rupiah

[ 1 ]  [ 2 ]  [ 3 ]
[ 4 ]  [ 5 ]  [ 6 ]
[ 7 ]  [ 8 ]  [ 9 ]
[000]  [ 0 ]  [ ⌫ ]
[Keyboard HP]          [Selesai]
```

| Jenis field | Tombol | Bantuan otomatis | Batas |
|---|---|---|---|
| Nominal rupiah | 0–9, `000`, hapus; tanpa koma | `Rp` dan titik ribuan langsung; ejaan nominal di bawah angka | Bulat; kosong bukan Rp0; tidak ada nominal saran |
| Kuantitas (kg, liter, sak) | 0–9, koma, hapus; satuan terlihat di samping angka | Satuan dapat diganti; konversi hanya bila ukurannya diketahui | Presisi mengikuti satuan; tidak menyalin angka kemarin |
| Hitungan ekor (mati, afkir, sampel) | 0–9, hapus, serta tombol − dan + di samping field | Nol hanya bila diketik/dipilih | Bilangan bulat ≥0 |
| Tanggal | Bukan keypad: **Hari ini**, **Kemarin**, **Pilih tanggal** | Penanda bila tanggal bukan hari ini | Mengikuti zona waktu kandang |

- Field tetap input asli yang berlabel. Setiap tombol keypad punya nama yang dapat dibaca pembaca layar (“tiga”, “nol nol nol”, “hapus satu angka”) dan nilai terbaru diumumkan saat pengguna menekan **Selesai**.
- **Keyboard HP** beralih ke keyboard angka bawaan HP; pilihan diingat per perangkat. Keyboard fisik dan paste selalu bekerja. `Rp1.250.000` dan `1250000` diterima; paste ambigu seperti `1,250` meminta konfirmasi.
- Keypad hanya muncul saat field angka aktif, tidak menutupi field, pesan error, atau tombol simpan, serta memperhitungkan safe area. Tombol keypad minimal 48×48 CSS px.
- Username, password, catatan, dan keperluan tetap memakai keyboard HP; password manager dan paste tidak dihalangi.
- Jika uji TalkBack/VoiceOver pada perangkat pilot gagal, keyboard angka HP menjadi default dan keypad aplikasi menjadi pilihan (D-26).
- Nominal yang jauh di atas belanja serupa pada riwayat sendiri memunculkan catatan di bawah field, misalnya “Rp15.000.000 — lebih besar dari biasanya. Sudah benar?”, tanpa memblokir.

### 5.4 Bantuan pintar — UX-19

| Bantuan | Contoh perilaku | Batas |
|---|---|---|
| Lanjutkan pekerjaan | “Belanja Listrik belum dikirim. [Lanjutkan]” | Draf milik akun dan konteks yang sama |
| Saran keperluan/pihak | Pilihan cepat dari riwayat sendiri: Gas · Solar · Listrik; teks baru tetap bisa diketik | Bukan daftar pembatas; tidak mengisi nominal |
| Tanggal cepat | **Hari ini** terpilih dan terlihat · **Kemarin** · **Pilih tanggal** | Penanda bila bukan hari ini |
| Hitung otomatis | Rata-rata sampling 30 kg ÷ 25 ekor = 1,2 kg/ekor; jumlah baris belanja | Hanya dari angka yang sudah diisi |
| Cek mirip | “Mirip belanja Listrik Rp150.000 kemarin oleh ABK A. [Tetap Kirim] [Lihat]” | Peringatan saja; tidak menggabung otomatis |
| Angka tidak biasa | “Mati 250 ekor — jauh di atas 7 hari terakhir. Sudah benar?” | Pembanding riwayat kandang sendiri, tampil setelah angka diisi; bukan standar medis; tidak memblokir |
| Urutan pilihan | Kandang dan sumber uang yang sering dipakai tampil paling atas | Tampil sebagai pilihan, bukan otomatis terpilih |
| Alasan saran | Setiap kartu saran punya **Kenapa?** berisi satu kalimat | Tidak memakai data yang tidak berhak dilihat |

Tidak boleh: mengisi nominal/kuantitas dari kebiasaan, menyalin recording kemarin, memilih sumber dana, memilih OFF/DAILY, mengirim, membukukan, atau mewajibkan layanan AI eksternal. Nilai kemarin boleh tampil kecil sebagai pembanding hanya setelah pengguna mengisi angka hari ini.

<a id="ux06"></a>
## 6. Arsitektur informasi dan navigasi

| Peran | Navigasi utama | Tujuan sekunder |
|---|---|---|
| Owner | Ringkasan · Kandang · Transaksi · Laporan · Lainnya | Pemeriksaan belanja, Tim Kandang, DOC/Pakan Masuk, pengaturan recording lewat Kandang → Periode → Pengaturan, akun, ekspor |
| ABK | Hari Ini · Catat · Uang Kas · Riwayat · Lainnya | Gaji, Kasbon, Upah Pekerjaan, akun dan panduan |
| Admin | Tenant · Layanan · Audit · Akun | Batas tenant; bukan tab rahasia Owner |

Tombol/menu **Catat** membuka lembar pilihan: ABK melihat **Recording Harian**, **Catat Belanja**, **Upah Pekerjaan**, **Terima Uang**, dan **Kembalikan Uang**; Owner melihat **Catat Belanja**, **Beri Uang Kas**, **DOC Masuk**, dan **Pakan Masuk** sesuai keadaan kandang. Tidak ada menu **Pemakaian** atau tombol **Pakai gas/solar** di R1. Uang Kas menampilkan catatan penerimaan/pengembalian uang yang benar-benar terjadi; aplikasi tidak mentransfer uang.

Gunakan label pendek yang sama di navigasi, judul layar, dan notifikasi. Helper text menjelaskan istilah dan batas efek, misalnya:

- **Data Kandang** — “Nama usaha dan kandang tempat pencatatan dilakukan.”
- **Tim Kandang** — “Tambah akun ABK satu per satu. Langkah ini bisa dilakukan nanti.”
- **Recording Harian** — “Satu catatan bersama untuk satu siklus kandang dan tanggal; bukan saldo stok.”
- **Catat Belanja** — “Laporkan pembelian. Owner memeriksa dan membukukan secara online.”
- **DOC Masuk** — “Catat DOC yang benar-benar datang, bukan jumlah rencana.”
- **Pakan/Sapronak Masuk** — “Catat barang yang benar-benar diterima. Catatan ini bukan saldo stok.”
- **Uang Kas** — “Uang usaha yang Anda pegang untuk keperluan kandang.”
- **Terima Uang** / **Kembalikan Uang** — “Catat uang tunai yang benar-benar diterima/diserahkan. Owner akan mengecek.”
- **Riwayat Belanja** — “Semua pembelian yang sudah dicatat. Bukan sisa stok.”
- **Status Kirim** — “Catatan dari HP ini yang belum sampai.”
- **Kandang Kosong** — “Tandai ayam sudah habis. Keuangan tetap bisa dilanjutkan.”
- **Tutup Buku** — “Kunci angka keuangan periode ini. Bisa dibuka lagi dengan alasan.”

Pemilih kandang/periode hanya menampilkan tenant dan assignment yang sah. Assignment ABK hanya dapat mencakup kandang-kandang dalam satu tenant Owner; perpindahan kandang/periode eksplisit dan draft tetap terikat ke konteks asal. OFF menyembunyikan ajakan membuat recording baru tetapi tidak menghapus riwayat. Tidak ada menu kosong untuk fitur R2.

<a id="ux07"></a>
## 7. Inventaris layar R1

Daftar ini mempertahankan 26 ID layar sebagai rujukan desain dan tes. Rute usulan bukan bukti endpoint tersedia. Semua layar menggunakan state pada bagian 15 dan izin server sesuai konteks.

| ID | Layar / rute usulan | Peran, isi, dan batas | Requirement PRD |
|---|---|---|---|
| V-01 | Ringkasan `/ringkasan` | Owner: kesiapan usaha, perhatian hari ini, kas/biaya tercatat, aksi berikut; tanpa angka palsu | SCR-02, REP-01–REP-02, ONB-11, AC-99 |
| V-02 | Hari Ini `/hari-ini` | ABK: konteks assignment, recording bersama, Catat, status kirim/koreksi | SCR-04, REC-14–REC-19, SEC-15, AC-90–AC-91 |
| V-03 | Masuk/Aktivasi `/masuk` | Owner terverifikasi menerima username dan password sementara sekali pakai dari Admin melalui handoff privat, lalu aktivasi online + ganti password; ABK memakai akun yang dibuat Owner. Tidak ada daftar/claim publik atau syarat email | ONB-01, ONB-09, SEC-13, SEC-16, AC-94 |
| V-04 | Siapkan Periode `/siapkan-periode` | Menyiapkan periode berlabel **Persiapan** (status internal DRAFT); tetap Persiapan sampai DOC Masuk dengan tanggal aktual dan populasi awal >0 tervalidasi. **Periode Sudah Mulai** adalah jalur sekunder | ONB-02, ONB-10–ONB-11, CYC-02–CYC-03, AC-95 |
| V-05 | Kandang & Periode `/kandang/:kandangId/periode/:periodeId` | Status kandang/periode, serta tautan **Pengaturan** untuk mode recording/cutoff | SCR-03, CYC-01, CYC-07, CYC-09, CYC-11, AC-65, AC-84 |
| V-06 | Recording Harian `/periode/:id/recording/:tanggal` | ABK/Owner berizin: satu ringkasan siklus kandang + tanggal, pakan/mati/afkir/sampling, koreksi | SCR-03–SCR-04, REC-14–REC-19, REP-09, AC-88–AC-91 |
| V-07 | Penerimaan DOC & Pakan `/penerimaan` | Owner: aksi **DOC Masuk** dan **Pakan/Sapronak Masuk**. Hanya DOC aktual dengan tanggal datang dan populasi >0 mengaktifkan periode Persiapan; pakan/sapronak tidak mengaktifkan siklus atau membuat saldo stok | K-27, CYC-01–CYC-03, AC-92, AC-95 |
| V-08 | Uang Kas `/uang-kas` | Owner per pemegang atau ABK sendiri; saldo dibukukan, belanja menunggu Owner, perkiraan uang di tangan; aksi **Beri Uang Kas**/**Terima Kembali** (Owner) atau **Terima Uang**/**Kembalikan Uang** (ABK) lewat lembar tanpa pindah halaman | SCR-06, CASH-01–CASH-04, CASH-10, REP-03, REP-05, AC-76 |
| V-09 | Catat Belanja `/catat-belanja` | ABK melaporkan, Owner mencatat langsung; foto bukti opsional | SCR-05, CASH-06, CASH-16, K-34, AC-13, AC-97 |
| V-10 | Detail Belanja `/belanja/:id` | Dibuka sebagai baris terbuka di daftar atau lembar; halaman penuh hanya dari tautan langsung/refresh. Nilai, pencatat, status pemeriksaan, pembukuan/koreksi sesuai izin | SCR-05, CASH-16, FIN-03, FIN-08, FIN-12, AC-97 |
| V-11 | Periksa Belanja `/periksa-belanja` | Owner: daftar dengan baris buka-tutup; lengkapi data, pratinjau dampak, **Setujui & Bukukan**/**Minta Perbaikan**/**Tolak** dari baris yang dibuka; membukukan online sesuai default, bukan keputusan auto-post terkonfirmasi | SCR-07, CASH-16, FIN-13, D-03, Q-03, AC-97 |
| V-12 | Riwayat Belanja `/riwayat-belanja` | Riwayat pembelian barang/jasa/peralatan saja, dapat difilter per barang; tidak menampilkan kuantitas saldo/opname/valuasi | SCR-08, D-05, Q-04, COST-01, REP-04, REP-08 (R2), AC-96 |
| V-13 | Terima/Kembalikan Uang (lembar dari Uang Kas atau Catat) | ABK: catatan uang tunai yang benar-benar diterima/dikembalikan, boleh offline; menunggu dicek Owner, bukan perubahan saldo atau pembayaran aplikasi | SCR-04, CASH-02, OFF-16, AC-76 |
| V-14 | Gaji `/gaji` | Owner mengelola/ABK melihat haknya; rincian hak, potongan dipilih, dibayar/sisa | SCR-09, PAY-04, PAY-08–PAY-09, REP-06 |
| V-15 | Kasbon `/kasbon` | Saldo per orang dan riwayat terpisah dari gaji/upah pekerjaan | SCR-10, PAY-07–PAY-09, REP-06, AC-98 |
| V-16 | Upah Pekerjaan `/upah-pekerjaan` | Pekerjaan dan upah terpisah dari gaji; Owner meninjau/pembayaran | SCR-11, PAY-11, REP-07, AC-25 |
| V-17 | Hasil Periode `/hasil-periode` | Owner: RHPP lengkap atau nominal tunai saja, coverage dan hasil yang boleh diklaim | SCR-14, K-36, SET-11, REP-10–REP-11, Q-08, AC-68 |
| V-18 | Laporan `/laporan` | Owner: transaksi/biaya/hasil dengan sumber, tanggal, coverage, status | REP-01–REP-07, REP-09–REP-11, CYC-09, AC-68 |
| V-19 | Status Kirim `/status-kirim` | Per user: catatan belum terkirim, catatan berubah, foto menunggu kirim, hasil tiap item, **Kirim Ulang** | SCR-17, OFF-02–OFF-03, OFF-06, OFF-09, OFF-15, OFF-17, AC-49–AC-50, AC-77 |
| V-20 | Tim Kandang `/tim-kandang` | Owner: banyak akun ABK, assignment dalam tenant Owner yang sama, izin dan pencabutan | ONB-04, SEC-15–SEC-16, D-25, AC-90–AC-93 |
| V-21 | Ekspor `/ekspor` | Owner: scope, isi paket, proses dan unduhan privat | REP-19 |
| V-22 | Akun `/akun` | Profil login, ubah password, reset sesi, pemulihan, tampilan | SCR-01, SEC-13–SEC-14, OFF-10, AC-81, AC-94 |
| V-23 | Panduan `/panduan` | Instruksi ringkas sesuai layar/peran; teks utama, media opsional | K-29, UX-14, UX-16 |
| V-24 | Administrasi `/admin` | Admin layanan: tenant/status/audit administrasi, tanpa isi bisnis rutin | SEC-01, SEC-14, AC-81, AC-93 |
| V-25 | Riwayat `/riwayat` | Scope berizin: recording, koreksi, belanja, status dan pencatat | OFF-15, NOT-01, REP-13, AC-91 |
| V-26 | Tutup Buku `/tutup-buku` | Owner: tinjau kelengkapan data keuangan, **Tutup Buku**/**Buka Lagi**; tanpa valuasi stok | SCR-03, CYC-07, CYC-09–CYC-11, SET-11, AC-65, AC-84 |

<a id="ux08"></a>
## 8. Wireframe prioritas

Hierarki dan copy awal, bukan ukuran piksel final. Contoh tidak menyiratkan adanya data usaha sungguhan.

Rincian urutan, data minimum, aksi, cabang gagal/offline, dan sketsa teks keadaan prioritas ada di [UX_FLOWS_WIREFRAMES.md](UX_FLOWS_WIREFRAMES.md). Dokumen tersebut memakai ID V/UT di sini, bukan menambah inventaris layar atau menggantikan aturan PRD. Gunakan label status kanonis pada bagian 15 dalam spesifikasi tertulis maupun implementasi mendatang yang diminta pengguna.

### 8.1 Owner — V-01

```text
[Usaha yang dipilih v]                         [Akun]
Ringkasan

Saran berikutnya                           [Kenapa?]
Siapkan periode agar DOC bisa dicatat saat datang.
[Siapkan Periode]                          [Nanti]

Persiapan kandang · 2 dari 5 selesai       [v]
  ✓ Data Kandang
  ✓ Pilihan recording
  Tim Kandang (opsional)             [Tambah]
  Siapkan Periode                    [Siapkan]
  DOC Masuk                          Perlu periode dulu

Kas kandang: — belum ada catatan
Belanja menunggu Owner: 0

[Catat]                 [Buka Kandang]
Ringkasan | Kandang | Transaksi | Laporan | Lainnya
```

Kartu berubah berdasarkan tugas yang belum selesai dan izin. Semua langkah persiapan dapat diketuk dalam urutan apa pun; langkah yang bergantung pada data lain menulis alasannya (“Perlu periode dulu”), bukan disembunyikan. Hitungan “2 dari 5” berasal dari data yang benar-benar tersimpan dan daftar ini diringkas otomatis setelah persiapan selesai. **Catat** tetap membuka lembar pilihan kapan pun. Tanda ✓ selalu disertai teks langkahnya. **Siapkan Periode** membuat periode berlabel Persiapan (DRAFT internal), bukan periode aktif. Nilai belum diketahui ditulis “—” dengan keterangan singkat, bukan Rp0. Setelah DOC Masuk mencatat tanggal aktual dan populasi awal lebih dari nol, periode dapat aktif; sebelum itu belanja/Uang Kas persiapan tetap dapat dicatat tanpa mengaktifkan siklus. Jangan mempertahankan checklist onboarding selesai selamanya atau menampilkan transaksi dummy. Agregat beberapa kandang menyertakan tanggal data masing-masing.

### 8.2 ABK — V-02

```text
Kandang Utara · Periode 01                   [Akun]
Hari Ini · 23 Sep 2026

Recording Harian                 [Buka / Koreksi]
Status: Draf / Menunggu Kirim / Tercatat
Catatan dipakai bersama ABK berizin dan Owner.

[Catat Belanja]          [Terima Uang]
[Upah Pekerjaan]         [Uang Kas]

Belum terkirim dari HP ini            [v]
Judul · status · tindakan

Hari Ini | Catat | Uang Kas | Riwayat | Lainnya
```

OFF menghilangkan kartu recording baru, bukan mengubahnya menjadi nol. Tidak ada menu pemakaian, saldo Owner, nominal gaji orang lain, atau link yang melewati assignment.

### 8.3 Recording Harian — V-06

```text
Recording Harian · Kandang Utara
23 Sep 2026 · Periode 01 · seluruh kandang
Satu catatan bersama untuk tanggal ini
Terakhir diubah [nama akun], 16.00    [Riwayat v]

Pakan dipakai hari ini                 [kg]
Mati [ekor]          Afkir [ekor]
Sampling: Tidak dilakukan / Dilakukan

[Simpan draf]                   [Kirim]
Status: Draf
```

Setelah validasi server: **Tercatat — dipakai bersama**. Tidak ada tahap “menunggu persetujuan Owner”. Koreksi menampilkan perbedaan nilai lama/baru dan siapa yang mengubahnya.

### 8.4 Uang, belanja, dan hasil — V-08/V-09/V-17

```text
Uang Kas · Kandang Utara
Saldo dibukukan                          [v]
Belanja menunggu Owner                   [v]
[Terima Uang] [Kembalikan Uang] [Catat Belanja]

Hasil Periode · Kandang Utara
[Rincian RHPP] [Uang Diterima]
Kelengkapan data                         [v]
Hasil usaha: belum dapat dihitung / angka dengan dasar
```

Saldo yang sah tidak mencakup klaim ABK yang belum diperiksa. Ketiadaan RHPP/coverage tidak tampil sebagai laba Rp0.

<a id="ux09"></a>
## 9. Onboarding, akun, dan tim

### 9.1 Jalur utama sebelum DOC — V-03/V-04/V-07

Urutan default yang ditampilkan kepada Owner baru:

1. **Aktivasi Owner:** setelah memverifikasi calon Owner, Admin memprovisikan tenant, username Owner, dan password sementara sekali pakai. Kredensial diserahkan privat, tanpa ketergantungan email. Owner masuk/aktivasi secara online dan wajib mengganti password sebelum membuat aktivitas bisnis. Tidak ada pendaftaran Owner mandiri atau klaim tenant publik.
2. **Data Kandang:** isi nama usaha dan kandang/tempat pencatatan. Helper text menjelaskan mana yang diperlukan untuk mulai; rincian yang belum diperlukan dapat diisi nanti.
3. **Tim Kandang (opsional):** Owner dapat membuat akun ABK sekarang atau melewati langkah ini. Pekerja tanpa akun tidak dipaksa dibuatkan akun.
4. **Recording Harian:** tampilkan OFF dan DAILY beserta contoh pekerjaan harian dan artinya. Tidak ada mode terpilih diam-diam. Nilai awal yang disarankan, bila kelak dipakai, tetap berlabel dan harus dikonfirmasi.
5. **Siapkan Periode:** simpan periode baru berlabel **Persiapan** (DRAFT internal), bukan aktif. DOC Masuk saja yang mengaktifkan periode, setelah tanggal kedatangan aktual dan populasi awal >0 dicatat serta tervalidasi. Tanggal/jumlah rencana atau invoice tidak memenuhi syarat aktivasi.
6. Tampilkan dashboard persiapan dengan tugas yang masih relevan. Sebelum DOC datang, Owner tetap dapat mencatat belanja persiapan dan Uang Kas; keduanya tidak mengaktifkan periode. Data DOC aktual yang belum lengkap membuat periode tetap DRAFT. Pengaturan lain dapat diteruskan ketika diperlukan.

Jangan menahan pencatatan DOC/pakan yang benar-benar diterima hanya karena foto profil, lampiran, payroll, inventaris, atau seluruh master data belum disiapkan. Jika tanggal aktual atau populasi awal belum tersedia/terverifikasi, simpan aktivitas yang diizinkan dan pertahankan status periode DRAFT; jangan aktifkan dengan tanggal/kuantitas rencana, nol, atau nilai tebakan. Sesudah onboarding, Owner selalu dapat mengubah OFF/DAILY dari **Kandang → Periode → Pengaturan**; perubahan mode/cutoff memerlukan konfirmasi dan mempertahankan histori.

### 9.2 Mulai tengah siklus

Jalur **Periode Sudah Mulai** tetap tersedia sebagai alternatif sekunder, bukan CTA utama untuk usaha baru. Owner mencatat tanggal DOC yang benar-benar datang dan populasi awal >0; setelah keduanya tervalidasi, periode diaktifkan dengan tanggal mulai pencatatan/cutoff serta coverage historis yang dinyatakan. Saldo/coverage historis yang belum diketahui ditandai parsial; jangan membagi DOC, biaya, recording, atau hak secara rata tanpa sumber. Tanpa tanggal/populasi aktual yang memenuhi syarat, periode tetap DRAFT. Laporan parsial tidak disebut laba satu siklus penuh.

### 9.3 Akun pribadi, assignment, dan reset

- Setiap ABK menggunakan akun sendiri; jangan berbagi satu username/password untuk satu tim. Banyak ABK dapat ditugaskan pada usaha yang sama.
- Owner tenant membuat akun ABK, mengganti username, dan mereset password untuk tenantnya. Default usulan mengikuti PRD D-25: username ternormalisasi unik global, tetapi akun yang dikelola Owner terikat pada satu tenant. Bentrok username diberi pesan umum yang tidak membocorkan tenant/pemilik lain.
- Kredensial lama tidak dapat dilihat setelah pembuatan/reset.
- Reset oleh Owner membuat kredensial sementara/sekali pakai yang ditampilkan satu kali, meminta perubahan password saat login berikut, dan mencabut sesi lama. Jangan kirim password melalui layar/notifikasi ke pihak lain.
- Email tidak dibutuhkan untuk provisioning Owner oleh Admin, aktivasi/login, pembuatan akun ABK oleh Owner, reset ABK, atau recovery Owner yang sudah diverifikasi. Prosedur recovery harus membuktikan kewenangan tanpa mengirim data tenant lain.
- Default usulan: akun/kredensial ABK tenant-lokal; beberapa kandang dalam tenant yang sama hanya lewat assignment Owner yang eksplisit. Admin layanan tidak boleh mereset akun lintas Owner atau menyamar sebagai ABK. Prosedur dukungan khusus memerlukan kebijakan terverifikasi.
- Mencabut assignment tidak menghapus histori, hak upah, kasbon, atau transaksi lama. Antrean lama tetap dikaitkan dengan pembuat aslinya dan perlu penyelesaian berizin.

<a id="ux10"></a>
## 10. Recording harian bersama

### 10.1 Konteks dan field — V-06

Satu recording berlaku untuk **satu siklus kandang + satu tanggal pencatatan (`business_date`)**. `cycle_id` menentukan kandang; catatan mencakup seluruh bangunan dalam siklus itu, tidak dibuat pada scope usaha/global, per bangunan, atau per ABK. Tidak perlu meminta pengguna memilih bangunan. Tanggal pencatatan mengikuti zona waktu kandang yang ditetapkan Owner; tanggal kejadian berbeda dari waktu kirim.

| Bagian | Input | Bantuan dan validasi |
|---|---|---|
| Pakan | Jenis pakan bila diperlukan, jumlah dipakai hari itu, satuan | Kuantitas hari itu, bukan total sejak awal; tidak mengurangi stok atau membentuk biaya |
| Mati/afkir | Jumlah mati dan jumlah afkir pada tanggal tersebut | Bilangan ekor; mati dan afkir tidak digabung |
| Sampling | Tidak dilakukan / dilakukan; bila ya, jumlah sampel dan total bobot bersih dengan satuan | Sampling tidak wajib harian; tampilkan tanggal, cakupan, dan hasil hitung jika satuan/metode tersedia |
| Catatan | Kejadian singkat/lampiran relevan | Opsional; bukan resep atau instruksi medis otomatis |

Field belum diisi berbeda dari nol. Pengguna dapat menyatakan nol dengan sengaja. Contoh sintetis: 25 sampel dengan total bobot 30 kg menghasilkan rata-rata 1,2 kg per sampel; bukan klaim bobot seluruh populasi. Foto tidak wajib.

### 10.2 Kirim, berlaku, dan koreksi

1. Simpan lokal hanya setelah storage berhasil. Label **Draf** bila belum dikirim, atau **Menunggu Kirim** setelah **Kirim** ditekan tanpa sinyal; helper “Tersimpan di HP, belum terkirim.”
2. Saat online, server memeriksa tenant, assignment, siklus, tanggal, satuan, dan versi.
3. Setelah diterima server, recording langsung menjadi versi berlaku. Label **Tercatat**, helper “Sudah tersimpan di server.” Tidak ada approval Owner atau review manual rutin.
4. Owner dan ABK yang memiliki assignment/izin aktif dapat memperbaiki recording; perubahan membutuhkan versi baru, alasan koreksi singkat, dan audit penulis/waktu/before-after. Tidak ada form persetujuan tambahan.
5. Versi baru menggantikan nilai efektif. Perubahan 100 kg menjadi 90 kg membuat nilai berlaku 90 kg, tidak menambah 90 ke 100. Riwayat lama tetap dapat dibuka sebagai versi sebelumnya.
6. Data diterima tidak menimbulkan efek uang, biaya, saldo stok, atau pengurangan stok pakan. Penerimaan pakan yang dicatat Owner juga bersifat informasi di R1.

### 10.3 Banyak pengguna dan konflik

Semua pengguna yang diizinkan melihat **ringkasan siklus kandang/tanggal yang sama**, pencatat terakhir yang diterima, waktu, dan riwayat perubahan. Jangan membuat satu rekap per ABK, bangunan, atau perangkat. Dua draf offline tidak dijumlahkan dan tidak ditimpa diam-diam.

Jika versi lokal dibuat dari catatan server yang sudah berubah, simpan draf lokal dan tampilkan nilai server/nilai lokal berdampingan. Pengguna berizin memilih nilai yang benar atau menyimpan koreksi baru; hasil diterima server menjadi satu versi efektif dan audit tetap utuh. Jangan gunakan last-write-wins tanpa konfirmasi, menjumlahkan count/berat, atau menghilangkan author.

Hari terlewat berarti **belum ada catatan**, bukan nol. Laporan terlambat memakai tanggal kejadian dan mengikuti aturan siklus/izin. Kartu kelengkapan menampilkan hari yang memiliki recording diterima server; draf di HP lain tidak dihitung sebagai catatan bersama yang sudah diterima.

**Ganti recording:** Owner online mengubah OFF/DAILY melalui Pengaturan periode, dengan tanggal efektif/cutoff dan preview cakupan. OFF→DAILY tidak mengisi hari sebelumnya dengan nol; DAILY→OFF mempertahankan riwayat. HP offline mungkin masih memakai konfigurasi lama: draft ditahan aman dan dinilai menurut tanggal kegiatan, cutoff serta izin saat tersambung. Laporan historis/late sync ke periode terkunci memakai jalur koreksi CYC-10; pengecualian ini bukan approval rutin recording. Tidak ada perubahan mode otomatis karena pengguna melewatkan satu hari.

<a id="ux11"></a>
## 11. Uang kas, belanja, dan pemeriksaan

### 11.1 Uang kas — V-08/V-13

Label **Uang Kas** merujuk uang usaha yang dipegang orang tertentu, bukan gaji, kasbon, atau transfer dalam aplikasi. Owner melihat per pemegang sesuai hak; ABK hanya melihat uang kas dan klaim miliknya.

Owner mencatat penyerahan/pembayaran yang benar-benar dilakukan: sumber, penerima, nominal, tanggal, dan tujuan opsional. Preview menerangkan saldo kas sumber/pemegang dan menyebut bahwa ini bukan biaya atau pembayaran kasbon. Posting hanya dilakukan Owner saat online. Catatan offline ABK tentang uang diterima/diserahkan adalah klaim lokal, bukan saldo disahkan. Klaim dari dua pihak ditautkan Owner ke satu perpindahan, bukan otomatis digabung hanya karena nominal sama.

Jika saldo/klaim belum cocok, tunjukkan bagian sah dan klaim yang belum diperiksa terpisah. Perkiraan uang fisik bukan hasil hitung fisik. Jangan menyebut satu nilai pasti jika arah atau hubungan transaksi belum jelas.

### 11.2 Catat Belanja oleh ABK — V-09/V-10

Alur ringkas: **keperluan → nominal → tanggal → sumber uang bila diketahui → bukti opsional → tinjau → kirim**. Helper text tidak memaksa ABK memilih istilah akuntansi. Klaim boleh menyatakan dibayar dari uang kas, uang pribadi/talangan, belum dibayar ke toko, atau sumber belum diketahui bila memang belum pasti.

Foto nota/bukti opsional. Jika foto tidak tersedia, pengguna tetap dapat mengirim tanpa mengisi alasan khusus. Jangan blokir hanya karena lampiran kosong dan jangan mengarang bukti. Data inti transaksi yang benar-benar tidak diketahui tetap berstatus belum lengkap untuk diperiksa Owner.

Setelah dikirim, status yang terlihat **Menunggu Owner**. Belanja ABK bukan perubahan saldo/biaya yang sudah dibukukan; tidak ada auto-approval berdasarkan nominal, jenis barang, atau jumlah tap. Pemeriksaan setiap hari adalah keputusan terkonfirmasi (K-34). Owner-only posting secara online adalah default PRD D-03/Q-03, bukan keputusan final bahwa alur atau delegasi lain dilarang. ABK melihat status dan permintaan koreksi, bukan tombol menyetujui/membayar klaimnya sendiri.

Nota susulan ditambahkan ke klaim yang sama. Posting Owner menampilkan preview sumber dana, biaya/hutang/penggantian yang akan berubah, lalu konfirmasi. Owner yang belanja langsung mencatat dan mem-posting secara online; tidak membuat pengajuan untuk menyetujui diri sendiri.

### 11.3 Pemeriksaan Owner — V-11

Daftar tindakan dapat dipilah menurut tanggal dan status, dengan label singkat: **Perlu diperiksa**, **Perlu dilengkapi**, **Ditolak**, **Dibukukan**. Setiap item menunjukkan siapa yang mencatat, kapan terjadi, apa yang diketahui, dan apa dampak posting. Foto hanya ditampilkan bila tersedia dan berhak dilihat. Rancangan approval/posting Owner-online mengikuti default PRD D-03 dan Q-03; jangan tampilkan sebagai keputusan confirmed yang menutup kemungkinan penyesuaian kebijakan.

Owner dapat meminta koreksi dengan alasan yang relevan, tetapi aplikasi tidak menambah kolom “alasan bukti tidak ada” yang wajib. Posting belanja/uang selalu tindakan online; ketiadaan jaringan tidak mengubah klaim menjadi persetujuan. Revisi terhadap yang sudah dibukukan memakai riwayat/koreksi, bukan menghapus jejak.

**Periksa Sekaligus** membantu review harian: tampilkan jumlah/total/sumber dan pengecualian sebelum konfirmasi. Hanya dokumen lengkap pada versi yang ditinjau dapat dibukukan; hasil per dokumen, misalnya “4 dibukukan, 1 berubah.” Retry tidak mengulang efek sah. Umur pengajuan sejak diterima server dan data kurang tetap terlihat. Menolak belanja tidak membuktikan uang tidak pernah keluar; Owner tetap menyelesaikan klaim kas sesuai FIN-11, bukan menghilangkannya dari saldo sementara tanpa resolusi.

<a id="ux12"></a>
## 12. Penerimaan barang tanpa pelacakan stok R1

R1 tidak menyediakan **Pakai gas/solar**, pencatatan pemakaian operasional rutin, saldo stok, stock opname, mutasi tabung, valuasi, atau inventory ledger. Jangan tampilkan kata **stok aman**, jumlah tersisa, atau peringatan kehabisan jika sistem tidak memiliki sumber yang sah. V-12 adalah histori pembelian saja.

- **DOC Masuk:** Owner mencatat tanggal kedatangan aktual dan populasi awal yang benar-benar diterima. Periode baru aktif hanya setelah keduanya tervalidasi dan populasi >0; rencana/invoice atau penerimaan pakan tidak mengaktifkan siklus. Bukan penerimaan uang atau persediaan finansial.
- **Pakan/sapronak datang:** penerimaan Owner adalah catatan informasi R1. Tidak membuat saldo stok pakan, klaim persediaan tersedia, atau pemakaian DAILY. Angka “pakan dipakai” pada recording adalah data operasional saja.
- **Belanja bahan habis pakai** seperti gas/solar: dicatat sebagai transaksi pembelian. Biaya diakui pada barang diterima dan pembelian disetujui/dibukukan Owner sesuai kebijakan PRD; sistem tidak mencatat berapa yang dipakai.
- **Barang tahan lama/peralatan:** jangan langsung membebankan seluruh harga sebagai biaya rutin hanya karena dibeli. Tandai sebagai barang/peralatan untuk klasifikasi Owner; R1 tidak mengklaim punya register aset/depresiasi. Perlakuan akuntansi final masih terbuka.
- Bukti pembelian opsional tanpa alasan wajib jika tidak tersedia; tidak ada pengecualian kategori tersembunyi yang membuat foto wajib. Kuantitas pembelian pada histori bukan saldo tersedia.

V-12 dapat memfilter catatan pembelian berdasarkan tanggal, barang, pembeli, status, dan nilai yang sudah dibukukan. Jangan menampilkan kartu saldo/jumlah tersisa atau tombol **Pakai**. Jika pengguna membutuhkan stok dan pemakaian terukur, jelaskan bahwa pencatatan itu belum tersedia di R1.

<a id="ux13"></a>
## 13. Gaji, kasbon, dan upah pekerjaan

Semua informasi pekerja dibatasi ke orang itu dan Owner yang berhak. **Gaji**, **Kasbon**, **Upah Pekerjaan**, dan **Uang Kas** adalah jalur berbeda; satu pembayaran uang nyata dapat dialokasikan ke beberapa kewajiban tetapi tidak menggabungkan histori/saldo.

### 13.1 Gaji — V-14

Owner memilih periode, orang, hak/gaji yang telah disepakati, potongan yang dipilih, dan pembayaran aktual. ABK melihat slipnya sendiri: nilai hak, pengurang yang diterapkan, tunai dibayar, dan sisa hak. Aplikasi tidak menjanjikan pembayaran atau transfer bank.

### 13.2 Kasbon — V-15

Kasbon dapat dicairkan sebelum angka gaji/perjanjian gaji/periode ditentukan; tidak perlu setup payroll dahulu. Saldo per orang terpisah dari gaji, upah pekerjaan, dan kas pegangan, boleh melebihi gaji dan tetap berjalan lintas siklus tanpa konversi atau pencairan ulang. Owner memilih potongan nol/sebagian/penuh; bukan otomatis maksimum.

Pada slip, Owner secara eksplisit memilih dan mengonfirmasi nominal kasbon yang dipotong untuk periode itu. UI memvalidasi batas maksimum potongan sebesar hak gaji yang tersedia; pilihan melebihi batas ditolak dan tidak diam-diam dipotong otomatis. Sisa kasbon tetap outstanding dan tidak menjadi pembayaran/utang baru atau janji bayar otomatis. Contoh: Owner memilih potongan Rp1.000.000 dari saldo kasbon Rp1.200.000 atas hak gaji Rp1.000.000:

```text
Hak Gaji Periode                  Rp1.000.000
Potongan kasbon diterapkan        Rp1.000.000
Uang dibayar                      Rp0
Kasbon yang masih terbuka         Rp200.000
```

Jangan menampilkan nilai bersih negatif sebagai seolah-olah nominal yang harus dibayar. Tanpa pilihan dan konfirmasi Owner, sistem tidak menerapkan potongan kasbon otomatis.

### 13.3 Upah Pekerjaan — V-16

Catatan pekerjaan memiliki jenis, jumlah/satuan, tarif yang disepakati, periode, status pemeriksaan, dan pembayaran sendiri. Upah pekerjaan tidak dimasukkan diam-diam ke slip gaji atau saldo kasbon. Satu uang keluar yang dibagi ke gaji dan upah menunjukkan alokasi terpisah dengan referensi pembayaran yang sama.

<a id="ux14"></a>
## 14. Hasil periode, penutupan, dan laporan

### 14.1 Hasil aktual — V-17

Owner memilih jalur yang datanya tersedia: **Rincian RHPP** (helper: “Masukkan rincian dokumen yang tersedia; cakupan yang belum lengkap tetap ditandai.”) atau **Uang Diterima** (helper: “Catat kas yang benar-benar sudah diterima. Ini bukan RHPP atau laba.”). Pilihan kedua hanya mencatat penerimaan kas aktual; bukan pendapatan terperinci atau hasil usaha final. Input dokumen manual tidak dijanjikan OCR/import.

Pisahkan di layar: **pendapatan/hasil mitra**, **biaya usaha**, **hasil usaha periode**, **hak yang belum cair**, dan **uang benar-benar diterima**. Bila cakupan biaya atau komponen hasil belum cukup, tunjukkan “Belum dapat menghitung hasil usaha” beserta data kurang. Jangan menampilkan Rp0 sebagai laba.

Pemberitahuan pencairan bukan penerimaan kas. Pembayaran bertahap dicatat sebagai penerimaan aktual yang ditautkan ke hak/dokumen yang sama. Penyelesaian nonkas, potongan, dan saldo belum cair tidak disamakan dengan uang diterima. Revisi dokumen menunjukkan versi/delta dan dampak tanpa menggandakan penerimaan terdahulu.

### 14.2 Kandang Kosong dan Tutup Buku — V-05/V-26

Pisahkan **Kandang Kosong** (selesai fisik) dari **Tutup Buku** (kunci keuangan). Kandang Kosong meminta tanggal akhir dan pernyataan tidak ada ayam hidup, bukan tiket panen R2. Sebelum Tutup Buku tampilkan kelengkapan data, belanja belum diperiksa, biaya/hasil belum lengkap, gaji/kasbon/upah dan akibatnya. Penghambat mempunyai tautan tindakan; tidak ada gate opname/valuasi stok atau approval recording R1.

Periode yang mulai di tengah siklus diberi label coverage parsial. Tidak ada recording (OFF) bukan penghambat keuangan dan bukan bukti performa lengkap. Kewajiban yang sudah sah tetapi belum dibayar tetap ditampilkan; jangan mengubah kewajiban menjadi nol untuk meluluskan penutupan. Reopen dan koreksi membutuhkan izin serta alasan/riwayat.

Utang final/kasbon tersisa tidak menghalangi lock; pembayaran hak/kewajiban yang sudah disahkan tetap boleh sesudah lock tanpa mengubah biaya snapshot. Perubahan hak/biaya memerlukan reopen. Periode baru boleh dimulai setelah fisik selesai meski keuangan lama OPEN/REVIEW; input pembayaran tanpa RHPP lengkap tidak memaksa angka laba final.

### 14.3 Laporan dan ekspor — V-18/V-21

- Filter usaha, kandang, periode, tanggal, orang, sumber, dan status terlihat sebelum hasil dibaca/diunduh.
- Setiap total dapat ditelusuri ke sumber dan versi sesuai izin. Recording produksi tidak digabung sebagai uang/biaya. Klaim belanja pending ditampilkan terpisah dari biaya dibukukan.
- RHPP lengkap dan nominal kas saja mempunyai label/coverage berbeda. Laporan parsial tidak berjudul laba satu siklus penuh.
- Ekspor memiliki scope dan status proses yang jelas; link file privat dan berumur terbatas. CSV/PDF adalah laporan, bukan janji backup server atau restore satu tombol.
- Cetak/PDF memakai layout solid; status parsial dan sumber tidak hilang serta tidak dibedakan dengan warna saja.

<a id="ux15"></a>
## 15. Offline, status, konflik, dan pemulihan

### 15.1 Label state

| Dimensi | Label layar | Arti singkat untuk helper |
|---|---|---|
| Penyimpanan di HP | Draf · Menunggu Kirim · Mengirim · Belum Pasti Terkirim · Gagal Simpan | Draf: belum dikirim, masih bisa diubah. Menunggu Kirim: tersimpan di HP, dikirim saat ada sinyal. Belum Pasti Terkirim: cek lagi, jangan catat ulang. Gagal Simpan: isi masih di layar, belum tersimpan |
| Recording | Tercatat · Catatan Berubah · Dikoreksi | Tercatat: sudah di server dan dipakai bersama. Catatan Berubah: ada perubahan lain, pilih angka yang benar |
| Belanja | Menunggu Owner · Perlu Dilengkapi · Ditolak · Dibukukan | Dibukukan hanya setelah Owner membukukan secara online |
| Uang | Belum Dicek Owner · Dibukukan · Dibayar Sebagian · Lunas | Belum Dicek Owner bukan saldo sah; Dibukukan bukan otomatis dibayar |
| Foto/nota | Tanpa Foto · Foto Menunggu Kirim · Foto Terkirim · Foto Gagal | Bukti opsional; status foto tidak menghapus isi catatan |
| Kelengkapan | Belum Ada Data · Data Belum Lengkap · Data sampai [tanggal jam] | Tidak disamakan dengan nol atau kondisi aman |

Status internal seperti DRAFT, RECEIVED, POSTED, UNRECONCILED, dan LOCKED hanya untuk handoff teknis; layar memakai label di atas.

Status dapat berdampingan, misalnya **Menunggu Owner · Foto Menunggu Kirim**, dengan penjelasan seperlunya. Timeout berlabel **Belum Pasti Terkirim**, bukan gagal pasti; retry memakai operasi sama. Request berjalan mencegah tap berulang membuat catatan kedua.

Semua layar mempunyai state relevan: loading (bukan saldo nol), empty versus filter kosong, error dengan apakah data tersimpan, offline/stale dengan waktu data, no-permission tanpa bocoran, pending/conflict dengan alasan/aksi aman, dan success sesuai efek nyata. Error dekat field/ringkasan dapat difokuskan; live region mengumumkan perubahan tanpa membaca ulang seluruh halaman. Tenant READ_ONLY menjelaskan layanan dibatasi, tetap baca/ekspor berizin dan tidak menyamar sebagai error koneksi.

### 15.2 Perilaku offline

- Offline boleh menyimpan draf recording/belanja/catatan tunai jika storage lokal berhasil; tampilkan waktu/perangkat dan batas “belum diterima/dibukukan”.
- Recording menjadi data bersama dan efektif hanya sesudah validasi server. Posting transaksi uang dan review belanja hanya online oleh Owner.
- Login/penambahan akun, reset kredensial, assignment, dan perubahan izin memerlukan koneksi serta konfirmasi server.
- Uji awal menggunakan lease offline 72 jam sebagai **usulan**, pada koneksi sesekali putus dan masa perangkat yang berbeda. Batas dan masa validasi yang final tunduk pada keputusan keamanan PRD; jangan menyatakan offline selamanya.
- Lease kedaluwarsa mengunci cache bisnis sampai login ulang online. Capture-only OFF-17 hanya dengan registrasi/local unlock sah: catatan minimum tanpa saldo/master/autocomplete lama, origin tenant immutable, bukan recording penuh atau posting. Sesudah reauth hanya dapat dikonversi sekali ke tenant asal dan scope berizin. Logout tidak menghapus antrean diam-diam; opsi hapus lokal menjelaskan risiko.
- Jangan menjanjikan sinkronisasi latar saat aplikasi tertutup. Sediakan retry saat aplikasi dibuka/online atau aksi manual. Foto gagal unggah tidak membatalkan teks transaksi.
- Lampiran privat mengikuti hak dokumen, batas awal 10 MB/file dan 5 file/transaksi terlihat sebelum unggah. Retry foto menaut dokumen sama. Storage penuh mempertahankan form, berlabel **Belum Tersimpan**, bukan menyarankan hapus data browser berisi antrean tanpa peringatan.

### 15.3 Konflik, perubahan izin, dan pemulihan

Konflik recording menampilkan nilai server/lokal kepada pengguna yang masih berhak. Tidak ada penjumlahan otomatis, last-write-wins diam-diam, pergantian author, atau perpindahan data ke tenant/akun baru. Simpan versi lokal selama aman dan arahkan ke koreksi yang diaudit.

Jika assignment dicabut, data server yang tidak lagi berhak tidak ditampilkan. Antrean tetap milik identitas pembuat dan perlu pemulihan/penyelesaian Owner sesuai izin; jangan mengirimnya sebagai ABK baru. Keluar akun tidak memindahkan antrean ke login berikutnya. Penghapusan data lokal menjelaskan bahwa catatan yang belum dikirim mungkin hilang.

Saat restore, acknowledgement transaksi sebelumnya perlu pemeriksaan ulang yang jelas; jangan kirim transaksi baru atau menganggap uang fisik diterima dua kali. Data yang hanya tersimpan pada HP yang hilang tidak dijanjikan dapat dipulihkan dari server.

<a id="ux16"></a>
## 16. Komponen, bahasa, dan panduan

### 16.1 Komponen dan state

| Komponen | Kontrak UX |
|---|---|
| App shell/context | Usaha, siklus/tanggal relevan, assignment, dan timestamp terlihat |
| Navigasi | Maksimal lima tujuan utama; label singkat dan active state bukan warna saja |
| Kartu tindakan | Berubah sesuai tugas/izin; tidak menunjukkan langkah yang sudah tak relevan |
| Tombol Catat | Selalu tersedia di beranda/navigasi; membuka lembar pilihan sesuai peran dan keadaan kandang |
| Kartu langkah berikutnya | Judul aksi, satu kalimat alasan, satu tombol, **Nanti** bila opsional, dan **Kenapa?** |
| Field uang/kuantitas | Keypad angka §5.3, locale, satuan, empty/zero, paste, validasi, readonly dan keyboard HP |
| Kartu nilai | Label, nominal/nilai, basis, waktu, kelengkapan data, dan detail buka-tutup |
| Status | Teks + ikon + warna; recording, pemeriksaan, pembukuan, bayar, lampiran tidak saling mengganti |
| Recording bersama | Siklus/tanggal, author, versi berlaku, simpan lokal, konflik, riwayat koreksi |
| Detail belanja | Baris buka-tutup/lembar: pencatat, waktu kejadian, nominal, lampiran jika ada, pemeriksaan/pembukuan |
| Lembar dan dialog | Lembar bawah di HP, panel samping di layar lebar; judul, akibat, aksi jelas, fokus kembali, penjaga draf; tombol kembali menutup lembar; satu lembar aktif |
| Baris buka-tutup | Nominal, status, dan pencatat terlihat saat tertutup; tombol baris memakai `aria-expanded`; posisi gulir dan fokus tetap |
| Bar aksi lengket | Simpan/Kirim tetap terlihat di atas keyboard dan tidak menutupi field yang aktif |
| Pesan singkat | Mengumumkan status nyata; **Urungkan** hanya untuk aksi lokal yang belum dikirim, misalnya hapus baris draf, bukan aksi uang/server |
| Inbox/riwayat | Tautan sesuai hak; tidak membocorkan nominal melalui notifikasi layar terkunci |

### 16.2 Copy produk

| Hindari | Gunakan |
|---|---|
| Submit / CONF / “Sukses” | Simpan Draf / Kirim / Tercatat, sesuai efek |
| Persetujuan recording Owner | Diterima server; versi berlaku dan pencatat terlihat |
| Pakai gas / stok tersisa | Tidak tersedia di R1; buka riwayat pembelian |
| Saldo Saya | Uang Kas / Gaji / Kasbon, terpisah |
| Transfer sekarang | Catat uang yang benar-benar diterima/diserahkan |
| “Tanpa bukti, wajib isi alasan” | “Lampiran opsional”; jika informasi inti belum diketahui, minta dilengkapi |
| Laba Rp0 saat kosong | Hasil usaha belum dapat dihitung: [data yang belum ada] |
| Semua beres | Jumlah diterima/pending/ditolak dan tindakan berikut |
| Saldo stok aman | Jangan tampilkan status stok pada R1 |
| Error 409 / Forbidden | Catatan berubah / Akses tidak tersedia, tanpa rincian rahasia |
| Posting / Post | Bukukan / Dibukukan |
| Review / Approval | Periksa Belanja / Menunggu Owner / Setujui & Bukukan |
| Sync / Sinkronisasi / antrean | Kirim / Status Kirim / Belum Terkirim |
| Coverage | Kelengkapan data |
| DRAFT (periode) | Persiapan |
| Klaim (layar ABK) | Belanja menunggu Owner / Uang belum dicek Owner |
| Konflik versi | Catatan berubah — pilih angka yang benar |
| Timeout / unknown | Belum pasti terkirim — jangan catat ulang |
| Lease habis | Masuk lagi untuk melanjutkan. Catatan di HP tetap aman. |
| Capture-only | Catatan Singkat |
| Belum ada data ≠ Rp0 | “—” dan keterangan **Belum ada catatan** |

### 16.3 Panduan — V-23

Panduan pendek tersedia dekat form: isi recording bersama, koreksi versi, belanja tanpa lampiran, perbedaan kas/gaji/kasbon/upah, dan batas data offline. Teks adalah jalur utama; gambar/video opsional dengan caption/transkrip, kontrol koneksi, dan tanpa autoplay. Panduan tidak menjadi tur wajib, ujian, atau sistem pemantauan pegawai.

### 16.4 Pola kerja di tempat — D-27

| Pola | Dipakai untuk | Jangan dipakai untuk |
|---|---|---|
| Lembar bawah / panel samping | Catat Belanja, Terima/Kembalikan Uang, Beri Uang Kas, koreksi satu nilai, filter, pratinjau dampak | Form panjang seperti Rincian RHPP atau Tutup Buku; lembar di atas lembar |
| Baris buka-tutup | Detail belanja/uang, riwayat recording, rincian saldo, penghambat Tutup Buku, rincian gaji per orang | Menyembunyikan nominal, status, atau pencatat yang dibutuhkan untuk memutuskan |
| Aksi dari baris terbuka | **Setujui & Bukukan**, **Minta Perbaikan**, **Tolak**, **Koreksi**, **Kirim Ulang** | Aksi hanya lewat geser; membukukan tanpa pratinjau dampak |
| Halaman fokus | Recording Harian, Rincian RHPP, Tutup Buku, detail akun Tim Kandang | Aksi 1–3 field |

- Tombol kembali HP/browser menutup lembar atau baris terbuka lebih dulu, bukan keluar dari layar. Isi lembar disimpan sebagai draf lokal dan muncul lagi saat dibuka.
- Lembar dan baris terbuka mempunyai alamat, misalnya `?belanja=123`, sehingga refresh atau tautan membuka keadaan yang sama sesuai izin.
- Hanya satu lembar aktif. Bila butuh data lain, misalnya akun kas belum ada, isi lembar berganti dengan tombol kembali ke draf asal.
- Lembar untuk aksi yang wajib online—**Beri Uang Kas**, **Terima Kembali**, **Setujui & Bukukan**—menampilkan “Perlu sinyal untuk membukukan” dan menonaktifkan tombol dengan alasan saat offline; isi lembar tetap tersimpan sebagai draf. **Terima Uang**, **Kembalikan Uang**, dan **Catat Belanja** ABK boleh disimpan offline dengan status **Menunggu Kirim**.
- Membuka satu baris tidak menutup paksa baris lain; daftar panjang menyediakan **Tutup Semua**. Posisi gulir tetap.
- Fokus pindah ke judul lembar/isi baris dan kembali ke pemicunya; tidak ada aksi yang hanya bisa dengan gesture.
- Tablet/desktop memakai dua panel: daftar di kiri, detail di kanan, dengan data dan izin yang sama.

| Tugas | Target usulan untuk diuji |
|---|---|
| ABK catat belanja dari Hari Ini | 1 ketuk membuka lembar; 0 pindah halaman; ≤60 detik (GOAL-01) |
| ABK Recording Harian | 1 ketuk dari Hari Ini; 1 halaman fokus; ≤2 menit |
| Owner periksa dan bukukan satu belanja lengkap | 0 pindah halaman dari Periksa Belanja; ≤3 ketuk setelah baris dibuka |
| Owner beri uang kas | 0 pindah halaman dari Uang Kas atau Catat |
| Owner menemukan kas, biaya, sisa gaji/kasbon | ≤3 navigasi utama (GOAL-02) |

### 16.5 Glosarium istilah layar

| Istilah layar | Arti untuk pengguna | Jangan dipakai di layar |
|---|---|---|
| Periode | Satu masa pemeliharaan ayam di satu kandang | siklus, batch |
| Persiapan | Periode sudah disiapkan, DOC belum datang | DRAFT |
| Periode Sudah Mulai | Mulai mencatat saat ayam sudah ada | periode berjalan |
| Recording Harian | Satu catatan bersama pakan, mati, afkir, dan sampling per tanggal | laporan per ABK, form per bangunan |
| Catat Belanja | Laporkan pembelian barang atau jasa | klaim, pengajuan, expense |
| Periksa Belanja | Owner memeriksa dan membukukan belanja | review, approval |
| Dibukukan | Sudah masuk buku usaha oleh Owner | posted, disahkan, final |
| Uang Kas | Uang usaha yang dipegang seseorang | kas pegangan, saldo saya, dompet |
| Terima Uang / Kembalikan Uang | Catatan uang tunai yang berpindah tangan | catatan tunai, transfer |
| Beri Uang Kas / Terima Kembali | Owner mencatat uang kas yang diberikan/dikembalikan | transfer sekarang |
| Kasbon | Pinjaman uang usaha kepada ABK | pinjaman, advance |
| Gaji | Hak gaji ABK untuk satu periode | payroll |
| Upah Pekerjaan | Upah kerja tambahan di luar gaji | bonus |
| Hasil Periode | Rincian RHPP atau uang yang diterima dari mitra | laba, bila belum dapat dihitung |
| Kandang Kosong | Ayam sudah habis dari kandang | selesai fisik, closing |
| Tutup Buku / Buka Lagi | Mengunci/membuka angka keuangan periode | lock, reopen, kunci keuangan |
| Riwayat Belanja | Daftar pembelian yang sudah dicatat | barang & peralatan, stok |
| Status Kirim | Catatan dari HP ini yang belum sampai server | sinkronisasi, antrean, queue |
| Kelengkapan data | Seberapa lengkap data untuk angka tersebut | coverage |
| Catatan Singkat | Catatan darurat saat perlu masuk lagi | capture-only |

Istilah dunia kerja kandang yang sudah dikenal tetap dipakai: DOC, RHPP, ABK, afkir, sampling, sapronak, recording, dan mitra.

### 16.6 Aturan bahasa layar

1. Judul dan navigasi memakai kata benda 1–3 kata (**Uang Kas**). Tombol memakai kata kerja + objek (**Catat Belanja**, **Bukukan**, **Kirim Ulang**). Hindari tombol **OK** atau **Ya** tanpa objek.
2. Bantuan paling banyak satu kalimat pendek (sekitar 12 kata). Detail tambahan disimpan di balik **Selengkapnya** atau Panduan.
3. Pesan error berisi apa yang terjadi, apakah data aman, dan langkah berikutnya. Contoh: “Belum terkirim. Catatan aman di HP. Dikirim saat ada sinyal.” / “Nominal belum diisi.” / “Catatan ini sudah diubah orang lain. Pilih angka yang benar.”
4. Konfirmasi uang menyebut objek dan dampak: “Bukukan belanja Listrik Rp150.000? Kas ABK A turun Rp150.000.” Tombol **Bukukan** dan **Batal** diberi jarak dari **Tolak**.
5. Angka ditulis penuh (`Rp1.250.000`, bukan `1,25 jt`), satuan selalu terlihat, dan “—” untuk belum ada data.
6. Nada tidak menyalahkan, tanpa tanda seru berlebihan, dan tanpa emoji sebagai ikon status.
7. Aturan uang yang panjang dijelaskan di Panduan, bukan memenuhi form.

<a id="ux17"></a>
## 17. Skenario penerimaan dan pengujian

**Rencana tes, bukan hasil tes aplikasi.** Jumlah: 49 skenario. Semua layar V-01–V-26 tunduk pada state/izin server di atas. UT melengkapi, bukan menggantikan tes bisnis, keamanan, ledger, dan recovery PRD v0.4.

| ID | Skenario dan hasil wajib | Layar |
|---|---|---|
| UT-01 | ABK hanya membuka usaha/kandang assignment; URL lain tidak membocorkan data | V-02, V-03 |
| UT-02 | Banyak ABK dapat aktif pada kandang yang sama; satu ABK dapat ditugaskan ke beberapa kandang hanya dalam tenant Owner yang sama, masing-masing dengan akun pribadi dan assignment eksplisit | V-03, V-20 |
| UT-03 | Pencabutan assignment tidak menghapus histori, mengalihkan kas/hak, atau mewariskan antrean ke ABK baru | V-08, V-19, V-20 |
| UT-04 | Admin memverifikasi Owner dan memprovisikan tenant + username Owner + password sementara sekali pakai melalui handoff privat; Owner aktivasi online dan ganti password sebelum aktivitas bisnis, tanpa self-registration/tenant claim. Setup Data Kandang, Tim opsional, dan recording dapat diselesaikan; Siapkan Periode tetap DRAFT sampai DOC Masuk memvalidasi tanggal aktual dan populasi >0. Belanja/Uang Kas persiapan tetap dapat dicatat dalam DRAFT tanpa mengaktifkan siklus atau membuat angka nol palsu | V-01, V-03, V-04, V-07, V-08, V-20; ONB-01, ONB-02, ONB-11, AC-94–AC-95 |
| UT-05 | Jalur Periode Sudah Mulai tersedia sebagai alternatif; periode hanya aktif setelah DOC aktual bertanggal dan populasi >0 tervalidasi; cutoff/coverage parsial terlihat dan saldo historis tidak dibuat | V-04, V-07, V-18; ONB-10, CYC-02–CYC-03 |
| UT-06 | OFF tetap mendukung keuangan dan periode tanpa membuat recording/panen dummy | V-05, V-17 |
| UT-07 | DAILY meminta pakan/mati/afkir/sampling pada satu siklus kandang + tanggal tanpa wajib memilih bangunan | V-02, V-06 |
| UT-08 | Kosong berbeda dari nol; sampling 25/30 kg memberi 1,2 kg rata-rata; “tidak sampling” bukan 0 kg | V-06 |
| UT-09 | Semua ABK berizin dan Owner melihat satu record per siklus+tanggal dengan author/waktu yang benar | V-06, V-25 |
| UT-10 | Koreksi menghasilkan satu versi efektif; 100→90 kg tetap 90, histori before/after tersedia | V-06, V-25 |
| UT-11 | Dua edit offline tidak auto-merge/jumlah/timpa; konflik menampilkan server dan draft lokal | V-06, V-19 |
| UT-12 | Recording yang diterima server langsung berlaku tanpa approval Owner; gagal validasi tidak tampil sebagai data bersama | V-06, V-19 |
| UT-13 | Gap bukan nol; tanggal usaha berbeda dari kirim. Ganti OFF/DAILY online memakai cutoff; HP offline tidak menghapus draft/riwayat atau mengirim lintas mode diam-diam, late sync mengikuti status periode | V-05, V-06, V-18, V-19; REC-03, OFF-18 |
| UT-14 | Owner maupun ABK berizin dapat koreksi; identitas korektor dan riwayat versi dipertahankan | V-06, V-25 |
| UT-15 | Jumlah pakan DAILY dan catatan pakan masuk tidak mengubah uang, biaya, saldo stok, atau pemakaian inventory | V-06, V-07, V-12 |
| UT-16 | Penyerahan uang oleh Owner hanya satu movement; klaim penerimaan pasangan tidak menggandakan saldo | V-08, V-13 |
| UT-17 | Belanja barang/jasa, termasuk listrik dan jasa perbaikan, dapat dicatat tanpa whitelist gas/solar/peralatan atau saldo stok; biaya hanya pada perlakuan Owner yang sah, bukan duplikasi penerimaan | V-09, V-12; CASH-05, CASH-16, GOLD-30 |
| UT-18 | Owner mencatat transaksi langsung secara online tanpa membuat pengajuan/persetujuan diri sendiri | V-09, V-10 |
| UT-19 | Belanja ABK tanpa foto dan tanpa alasan ketiadaan bukti dapat dikirim; tetap menunggu pemeriksaan Owner | V-09, V-10, V-11 |
| UT-20 | Belanja tidak auto-post; batch Owner online hanya membukukan dokumen lengkap/versi ditinjau, satu versi berubah tetap pending dan hasil per item jelas; retry tidak ganda | V-10, V-11; D-03, FIN-13 |
| UT-21 | Sumber uang pribadi/kas/toko/sumber belum diketahui ditampilkan terpisah; nota susulan menambah bukti pada klaim sama | V-08, V-10 |
| UT-22 | Peralatan tahan lama tidak otomatis diperlakukan sebagai biaya habis pakai; R1 tidak mengklaim register aset | V-12 |
| UT-23 | Gaji, kasbon/pinjaman, upah pekerjaan dan kas pegangan tetap terpisah per orang | V-08, V-14, V-15, V-16 |
| UT-24 | Kasbon tanpa agreement/gaji boleh dicairkan dan melebihi gaji kemudian; Owner memilih potongan nol/sebagian/penuh dalam batas hak/saldo, sisa lintas siklus tanpa konversi; uang dibayar tidak negatif | V-14, V-15; PAY-07–PAY-09, AC-98 |
| UT-25 | Satu pembayaran fisik dapat dialokasikan terpisah ke gaji dan upah tanpa menggandakan kas keluar | V-14, V-16 |
| UT-26 | RHPP lengkap berbeda dari nominal kas saja; kas saja tidak disebut laba/hasil lengkap | V-17 |
| UT-27 | Hasil belum cukup coverage menampilkan data kurang, bukan laba Rp0 atau jumlah yang dikarang | V-17, V-18 |
| UT-28 | Kandang Kosong bukan Tutup Buku; utang final/kasbon belum lunas tidak memblokir lock, pembayaran setelah lock tidak mengubah biaya; periode berikut dapat aktif meski keuangan lama belum selesai. Data kurang tidak dibuat nol | V-05, V-14, V-26; CYC-05, CYC-09, CYC-11 |
| UT-29 | Restore/retry acknowledgement tidak mencatat penerimaan atau posting uang fisik untuk kedua kalinya | V-19, V-22 |
| UT-30 | Storage lokal gagal tidak menunjukkan “tersimpan”; teks tetap dapat dipulihkan dari form selama sesi | V-09, V-19 |
| UT-31 | Putus-sambung/restart tidak merusak antrean; expiry lease mengunci cache, capture-only tanpa data bisnis dan konversi sekali ke tenant asal; 72 jam usulan diuji, bukan janji pengiriman latar | V-19, V-22; OFF-03, OFF-09, OFF-17 |
| UT-32 | Perubahan akun/assignment memerlukan online; logout/ganti akun tidak membuka antrean user sebelumnya | V-19, V-20, V-22 |
| UT-33 | Owner dapat membuat/mengganti username dan reset akun ABK tanpa email; reset menampilkan kredensial sementara sekali, tidak membuka password lama, meminta ganti password, dan mencabut sesi lama | V-20, V-22; SEC-16, AC-93–AC-94 |
| UT-34 | Recovery membutuhkan verifikasi yang sah; admin/support tidak dapat membuka tenant lain atau menyamar sebagai ABK | V-22, V-24 |
| UT-35 | Paket ekspor/PDF/CSV privat, membatasi scope, menampilkan coverage dan bukan janji restore | V-18, V-21 |
| UT-36 | Dua Owner/tenant tidak dapat melihat, mereset username/password, atau memindahkan assignment staf satu sama lain | V-03, V-20, V-22 |
| UT-37 | Recording pakan tidak membuat pengurangan persediaan/biaya; tidak ada menu penggunaan gas/solar/opname/saldo stok | V-06, V-12 |
| UT-38 | Semua label utama pendek; helper text menjelaskan Data Kandang, Tim Kandang, Catat Belanja, DOC Masuk, dan Pakan/Sapronak Masuk | V-01, V-04, V-07, V-09, V-20 |
| UT-39 | Satuan kuantitas tepat, IDR tanpa pecahan, persentase maks. dua desimal; input panjang tetap terbaca | V-06, V-09, V-17 |
| UT-40 | Glass, solid, reduced effects, forced colors, dan no-blur tetap dapat dipakai | Semua |
| UT-41 | Kontras komposit saat scroll, teks status, dan focus terlihat; tidak hanya diasumsikan dari token | Semua |
| UT-42 | Viewport 320/360/390/768/1280 px, zoom 200%, dan keyboard tidak menutup field/error/action | Semua |
| UT-43 | Keyboard/screen reader/modal/paste dan state loading/empty/error/offline/no-permission/success dapat digunakan; tutorial opsional, deep link berizin, READ_ONLY tidak memberi mutasi | Semua; UX-09, SEC-01 |
| UT-44 | Keypad angka: nominal diisi dengan `000`/hapus, tampil `Rp1.250.000` dan ejaannya; kuantitas memakai koma dan satuan; ekor memakai −/+; **Keyboard HP**, paste, keyboard fisik, dan pembaca layar bekerja; username/password/teks tetap keyboard HP; tidak ada nominal atau kuantitas yang terisi dari kebiasaan | V-06, V-08, V-09, V-13, V-14; UX-06, D-26 |
| UT-45 | Kerja di tempat: Catat Belanja, Terima/Kembalikan Uang, Beri Uang Kas, dan koreksi satu nilai selesai di lembar tanpa pindah halaman; tombol kembali menutup lembar tanpa kehilangan draf; refresh/tautan membuka keadaan yang sama sesuai izin; satu lembar aktif dan fokus kembali ke pemicu | V-02, V-08, V-09, V-13, V-06; UX-18, D-27 |
| UT-46 | Baris buka-tutup menampilkan nominal/status/pencatat saat tertutup; detail dan aksi terbuka di tempat dengan `aria-expanded`; Owner memeriksa dan membukukan dari baris dengan pratinjau dampak; tidak ada bukukan hanya dengan geser; posisi gulir tetap | V-10, V-11, V-08, V-25, V-26; UX-18 |
| UT-47 | Arahan bebas: satu saran utama dan maksimal dua pendamping berasal dari data nyata dengan **Kenapa?**; tombol **Catat** selalu ada; langkah setup dapat dikerjakan dalam urutan apa pun kecuali dependensi nyata yang diberi alasan; **Nanti** menyembunyikan saran opsional sampai kejadian relevan; tidak ada pop-up berulang, poin, atau streak | V-01, V-02, V-04, V-20; UX-16, UX-17 |
| UT-48 | Bantuan pintar: saran keperluan dari riwayat sendiri, **Hari ini/Kemarin**, rata-rata sampling otomatis, cek belanja mirip, dan peringatan angka tidak biasa tidak memblokir; tidak mengisi nominal/kuantitas/sumber dana dan tidak mengirim/membukukan otomatis | V-06, V-09, V-11; UX-04, UX-19 |
| UT-49 | Bahasa: label mengikuti glosarium §16.5; tidak ada DRAFT, posting, sync, coverage, review, receipt, lease, atau capture-only di layar; bantuan ≤1 kalimat; error menyebut kejadian, keamanan data, dan langkah; pengguna uji memilih tombol yang benar untuk uang kas, belanja, kasbon, dan upah tanpa bantuan | Semua; UX-15, UX-20 |

### 17.1 Uji kegunaan dan bukti

Sebelum menyatakan UI tervalidasi, minta Owner mencoba onboarding sebelum DOC, menyelesaikan satu recording harian, mengoreksi nilai, menambah ABK, memeriksa belanja tanpa foto, dan melihat saldo kasbon/upah. Uji juga beberapa akun ABK pada satu kandang serta satu akun yang ditugaskan ke beberapa kandang dalam tenant Owner yang sama, koneksi putus saat kirim, dan tampilan HP dengan keyboard terbuka. Simpan hasil yang disetujui tanpa data pribadi; dokumen ini sendiri bukan hasil uji.

Target tetap mengikuti GOAL-01/02: minimal 8 dari 10 percobaan belanja tanpa foto selesai ≤60 detik tanpa bantuan; Owner menemukan kas/biaya/sisa gaji-kasbon dalam ≤3 navigasi utama. Usulan target recording global sederhana (satu jenis pakan, tanpa sampling): ≥8/10 percobaan ≤2 menit setelah pengenalan; bukan target per bangunan. Sepuluh percobaan bukan otomatis sepuluh pengguna. Catat waktu/bantuan/salah input/perangkat/koneksi dan beban review Owner. Bandingkan solid/glass pada tugas sama; screenshot membuktikan tampilan, bukan sinkron/otorisasi. Kegagalan dan perubahan target beralasan tetap tersimpan.

Tambahkan ukuran kemudahan dari audit v0.3: jumlah pindah halaman dan ketukan per tugas terhadap target §16.4, ketepatan klik pertama pada label glosarium, apakah pengguna menemukan langkah berikutnya tanpa bantuan, serta perbandingan keypad aplikasi dan keyboard HP untuk kecepatan, salah angka nol, dan pembaca layar. Hasil ini menentukan default D-26/D-27, bukan asumsi desainer.

<a id="ux18"></a>
## 18. Keputusan terbuka dan handoff

### 18.1 Kebijakan yang masih perlu keputusan

ID di bawah adalah nomor Q milik PRD v0.5, bukan nomor pertanyaan UX lokal.

| ID PRD | Keputusan terbuka | Batas desain sementara |
|---|---|---|
| [Q-02](PRD.md#s31) | Recovery Owner tanpa email, bukti kewenangan, masa berlaku kredensial sementara, dan pihak bantuan | Username/password tetap tanpa email wajib; tidak ada reset berdasarkan username saja. Akun ABK tenant-local dan reset Owner mengikuti SEC-16/D-25. |
| [Q-03](PRD.md#s31) | Jika Owner tidak tersedia atau klaim belanja belum jelas, siapa membantu dan bagaimana tindak lanjutnya | Pemeriksaan transaksi harian terkonfirmasi (K-34). Posting Owner-only online tetap default D-03; auto-post/delegasi bukan keputusan tersirat. |
| [Q-04](PRD.md#s31) | Klasifikasi peralatan tahan lama, alokasi belanja masa kosong/overhead, dan biaya aset manual yang diperlukan pilot | Barang tahan lama tidak otomatis menjadi biaya satu periode; R1 tidak memiliki modul aset/persediaan. |
| [Q-06](PRD.md#s31) | Perangkat, local unlock/capture-only, lease dan dampak reset/logout pada antrean | 72 jam hanya hipotesis uji, bukan durasi gangguan yang dijanjikan. |
| [Q-08](PRD.md#s31) | Mapping komponen RHPP, tabungan/pajak/utang/biaya mitra pada pilot | Jalur nominal kas saja boleh dipakai; tidak disebut laba/hasil lengkap. |
| [Q-10](PRD.md#s31) | Stack/hosting/anggaran, keamanan username-password, backup/restore dan target RPO/RTO | Belum ada pilihan vendor atau klaim target teruji; login tetap tanpa email wajib. |
| [Q-11](PRD.md#s31) | Retensi, penghapusan akun/data, backup, dukungan, ekspor dan privasi hukum | Tidak purge otomatis posted finance; ekspor privat sesuai REP-19; dukungan tidak membuka isi tenant tanpa verifikasi. |

### 18.2 Checklist handoff

**Peninjauan perencanaan saat ini:**

- [ ] PRD v0.5 dan UX menyepakati setup sebelum DOC, banyak ABK, recording bersama, serta tidak ada inventory tracking R1.
- [ ] Alur tertulis, sketsa teks, dan copy pendek ditinjau tanpa menganggapnya hasil uji aplikasi.
- [ ] Rencana tes UX dihubungkan ke tes bisnis/keamanan PRD; rencana tes bukan bukti kelulusan.
- [ ] Keputusan terbuka dicatat dengan versi/tanggal/pemilik. Dokumen selesai bukan berarti implementasi atau persetujuan akhir selesai.

**Verifikasi mendatang, hanya setelah implementasi diminta; bukan tugas membuat mockup sekarang:**

- [ ] Kemudahan alur dan copy pendek diuji Owner serta ABK pada aplikasi.
- [ ] Akun, assignment, reset, recovery, dan isolasi tenant diotorisasi server.
- [ ] Recording offline/konflik menghasilkan satu versi efektif dengan audit, tanpa approval produksi atau double-count.
- [ ] Belanja tanpa foto tetap dapat dilaporkan; posting finansial Owner online.
- [ ] Kasbon, gaji, dan upah diuji lintas siklus dan per orang.
- [ ] Glass/solid, aksesibilitas, keyboard, viewport, dan angka panjang diuji pada perangkat.

<a id="ux19"></a>
## 19. Referensi dan riwayat

### 19.1 Sumber

- [PRD v0.5](PRD.md): keputusan bisnis, onboarding, assignment/akses, recording, transaksi, pengupahan, offline, keamanan, dan acceptance.
- Screenshot/contoh dari pengguna hanya referensi privat konteks kerja lapangan; bukan dokumentasi API, aturan validasi, atau bukti fitur mitra sudah diuji. Tidak disalin ke aset publik.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), dan [Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): acuan uji, bukan klaim sertifikasi.
- [MDN `backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter): efek visual sebagai enhancement dengan fallback solid.
- Audit kemudahan v0.3 ([UX_AUDIT.md](UX_AUDIT.md)) memakai referensi publik yang diperiksa 23 September 2026 sebagai dasar pola, bukan persetujuan atau hasil uji: [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [NN/g Accordions on Mobile](https://www.nngroup.com/articles/mobile-accordions/), [NN/g Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/), [NN/g Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/), [W3C APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [Material 3 Bottom Sheets](https://m3.material.io/components/bottom-sheets/guidelines), [MDN inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode), dan [What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

### 19.2 Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 20 September 2026 | Rancangan awal dengan satu ABK/kandang dan gagasan pemakaian/stok; referensi historis, bukan keputusan terkini. |
| 0.2 | 23 September 2026 | Konsolidasi UX v0.2: setup Owner sebelum DOC dan adaptif; banyak akun ABK; recording bersama satu per siklus/tanggal tanpa approval Owner; koreksi ter-audit; belanja ditinjau Owner dan posting online; bukti opsional; penghapusan pemakaian/stok operasional R1; pemisahan kasbon/gaji/upah; login tanpa email wajib; 26 layar dan 43 skenario penerimaan. |
| 0.3 | 23 September 2026 | Audit kemudahan (K-38): prinsip UI-16–UI-20, keypad angka, bantuan pintar, pola kerja di tempat, glosarium dan aturan bahasa, label status kanonis, penggantian label ambigu (Catatan Tunai, Barang & Peralatan, Sinkronisasi, Tutup Periode, Selesai Fisik, DRAFT), serta UT-44–UT-49. Masih rancangan tertulis, belum mockup atau uji pengguna. |
