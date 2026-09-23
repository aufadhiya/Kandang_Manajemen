# Audit Kemudahan UX — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.2 |
| Tanggal | 23 September 2026 |
| Permintaan pengguna | Pastikan aplikasi sangat mudah dipakai: bahasa singkat dan tidak ambigu, mengarahkan seperti Duolingo tetapi bebas memilih tindakan, terasa pintar dan memanjakan, keypad angka khusus, detail mudah dibuka-tutup, dan sedikit pindah halaman |
| Cakupan | PRD, UX/UI, alur, arsitektur, keamanan, model data, API, rencana tes, Implementation Plan, PLANNING, dan AGENTS |
| Status | Audit dokumen dan perbaikan rancangan tertulis. Desain visual final kemudian diberikan pengguna (K-39, [FRONTEND_DESIGN_SPEC.md](FRONTEND_DESIGN_SPEC.md)); **belum ada aplikasi atau uji pengguna**, jadi kemudahan baru terbukti setelah uji pada HP nyata |
| Keputusan baru | [PRD K-38](PRD.md#s03) mencatat arahan pengguna; D-26 dan D-27 adalah rancangan yang masih diuji |

## Daftar isi

1. [Ringkasan hasil](#uxa01)
2. [Cara audit dan acuan](#uxa02)
3. [Nilai per sasaran pengguna](#uxa03)
4. [Temuan dan perbaikan](#uxa04)
5. [Batas yang sengaja dijaga](#uxa05)
6. [Yang sudah baik dan dipertahankan](#uxa06)
7. [Risiko tersisa dan cara membuktikan](#uxa07)
8. [Referensi dan riwayat](#uxa08)

<a id="uxa01"></a>
## 1. Ringkasan hasil

Fondasi rancangan sebelumnya sudah kuat pada kejujuran angka, status yang terpisah, setup bertahap, dan keamanan data. Kelemahannya ada pada tiga hal yang langsung dirasakan pengguna: **istilah uang dan status yang tumpang tindih**, **arahan langkah berikutnya yang belum punya aturan jelas**, serta **terlalu banyak pindah halaman untuk tugas singkat**. Rencana implementasi juga belum mempunyai tugas fondasi tampilan sebelum layar pertama, sehingga agent berbeda bisa membuat pola dan label sendiri-sendiri.

Perbaikan yang sudah dimasukkan ke dokumen:

- **Arahan bebas:** satu saran utama dari data nyata, paling banyak dua pendamping, tombol **Catat** selalu ada, urutan setup bebas kecuali dependensi nyata, dan **Nanti** tidak mengganggu berulang ([UX-17](PRD.md#s21), [alur §3.1](UX_FLOWS_WIREFRAMES.md#flow03)).
- **Kerja di tempat:** input singkat di lembar bawah, detail di baris buka-tutup, dan Owner membukukan belanja dari daftar dengan pratinjau dampak ([D-27](PRD.md#s03), [UX/UI §16.4](UX_UI_SPEC.md#ux16)).
- **Keypad angka:** tombol besar, `000`, ejaan rupiah untuk mencegah salah nol, −/+ untuk ekor, dan selalu bisa kembali ke keyboard HP ([D-26](PRD.md#s03), [UX/UI §5.3](UX_UI_SPEC.md#ux05)).
- **Bantuan pintar yang jujur:** saran keperluan, tanggal cepat, hitung otomatis, cek belanja mirip, dan peringatan angka tidak biasa—tanpa mengisi fakta atau membukukan sendiri ([UX-19](PRD.md#s21), [UX/UI §5.4](UX_UI_SPEC.md#ux05)).
- **Bahasa tunggal:** glosarium, aturan bahasa, label status kanonis, dan pemeriksa istilah terlarang otomatis ([UX/UI §15–16](UX_UI_SPEC.md#ux15)).
- **Pelaksanaan dan tes:** kartu baru [IMP-006](Implementation%20Plan.md#imp-006) sebelum layar pertama, saran awal di IMP-014, serta skenario UT-44–UT-49 di [rencana tes](TEST_PLAN.md).

<a id="uxa02"></a>
## 2. Cara audit dan acuan

1. Membaca ulang seluruh label, status, wireframe teks, alur FL-01–FL-10, skenario UT, dan kartu layar pada Implementation Plan.
2. Dua peninjau independen memeriksa (a) bahasa layar dan (b) interaksi/jumlah pindah halaman; setiap usulan dicocokkan dengan keputusan PRD sebelum diterima.
3. Memakai skill UI UX Pro Max lokal sesuai AGENTS.md. Hasil yang relevan: error dekat field dan ringkasan error terfokus, `inputmode` untuk keyboard angka, empty state dengan aksi, onboarding yang bisa dilewati, konfirmasi untuk aksi berisiko, dan target sentuh. Pencarian untuk progressive disclosure, bottom sheet, dan accordion tidak memberi hasil yang cocok setelah satu kali perbaikan kata kunci; untuk topik itu dipakai sumber publik di §8.
4. Heuristik yang dipakai: kejelasan status, kecocokan bahasa pengguna, kebebasan dan kontrol pengguna, pencegahan error, pengenalan bukan hafalan, progressive disclosure, serta kriteria WCAG 2.2 yang relevan untuk fokus, target, dan autentikasi.

Referensi publik membantu memilih pola. Referensi tersebut bukan persetujuan pengguna, bukan hasil uji aplikasi ini, dan tidak mengganti aturan bisnis PRD.

<a id="uxa03"></a>
## 3. Nilai per sasaran pengguna

| Sasaran | Sebelum audit | Sesudah perbaikan dokumen | Yang masih harus dibuktikan |
|---|---|---|---|
| Sangat mudah dipakai | Prinsip ada, tetapi tiap layar berpotensi berbeda pola | Fondasi komponen tunggal IMP-006 dan target ketukan/pindah halaman per tugas | Waktu tugas dan bantuan yang dibutuhkan pada uji HP nyata |
| Bahasa singkat, jelas, tidak ambigu | Uang Kas/Catatan Tunai tumpang tindih; status bervariasi; istilah internal bocor | Glosarium, aturan bahasa, label status kanonis, pemeriksa istilah otomatis | Uji klik pertama pada label uang dan pekerjaan |
| Diarahkan seperti Duolingo | Saran utama ada, aturan frekuensi/penundaan belum ada; dibangun terlambat | Aturan saran, **Kenapa?**, **Nanti**, hitungan persiapan nyata; mulai IMP-014 | Pengguna menemukan langkah berikut tanpa bantuan dan tidak merasa diganggu |
| Bebas memilih tindakan | Navigasi tetap ada, urutan setup tampak berurutan | Semua langkah dapat diketuk; dependensi diberi alasan; **Catat** selalu ada | Tidak ada jalan buntu pada tugas uji |
| Pintar dan memanjakan | Belum didefinisikan | Bantuan pintar dengan batas tegas; ejaan rupiah; cek mirip; hitung otomatis | Manfaat nyata tanpa salah isi karena saran |
| Keypad angka khusus | PRD menyatakan tidak wajib | Keypad aplikasi untuk angka dengan jalan keluar keyboard HP | Kecepatan, salah nol, dan pembaca layar dibanding keyboard HP |
| Buka-tutup detail | Hanya disebut sebagai detail bertahap | Pola baris buka-tutup dengan aturan aksesibilitas dan informasi wajib tetap terlihat | Pengguna tidak kehilangan konteks saat membuka detail |
| Sedikit pindah halaman | Belanja, detail, pemeriksaan, dan uang kas memakai layar terpisah | Lembar, baris terbuka, dan aksi dari daftar; halaman fokus hanya untuk tugas panjang | Hitungan pindah halaman sesuai target |

<a id="uxa04"></a>
## 4. Temuan dan perbaikan

| ID | Prioritas | Temuan | Perbaikan dalam dokumen | Status |
|---|---|---|---|---|
| UXA-01 | P1 | **Uang Kas**, **Catatan Tunai**, dan **Catat Belanja** membingungkan; ABK sulit memilih tombol | Menu Catatan Tunai dihapus; aksi **Terima Uang**/**Kembalikan Uang** tersedia di Uang Kas dan Catat; Owner memakai **Beri Uang Kas**/**Terima Kembali** | Diperbaiki: PRD §21, UX/UI §6–8, alur WF-11 |
| UXA-02 | P1 | Status simpan/kirim memakai banyak kata untuk arti sama (Di HP, Belum dikirim, Belum Terkirim, Diterima, Menunggu Review) | Label kanonis Draf, Menunggu Kirim, Mengirim, Belum Pasti Terkirim, Gagal Simpan, Tercatat, Menunggu Owner, Dibukukan, Lunas | Diperbaiki: UX/UI §15.1, PRD UX-05/REC-19, alur §15 |
| UXA-03 | P1 | Istilah internal tampil di layar: DRAFT, “Kunci catatan”, “versi berlaku”, Coverage, Sinkronisasi, “≠ saldo Rp0” | Diganti bahasa sehari-hari; UX-20 dan pemeriksa istilah terlarang di IMP-006 | Diperbaiki |
| UXA-04 | P1 | Tidak ada tugas fondasi tampilan sebelum layar pertama | [IMP-006](Implementation%20Plan.md#imp-006) baru; kartu layar wajib memakai komponen dan kamus teks yang sama | Diperbaiki; nomor kartu lama bergeser satu |
| UXA-05 | P1 | Arahan langkah berikutnya belum punya aturan jumlah, alasan, dan penundaan; dibangun terlambat | UX-17, aturan alur §3.1, versi awal di IMP-014, perluasan di IMP-047, UT-47 | Diperbaiki |
| UXA-06 | P1 | Tugas singkat memerlukan beberapa halaman | D-27, UX-18, pola §16.4, target pindah halaman, UT-45/UT-46 | Diperbaiki |
| UXA-07 | P2 | Input angka mengandalkan keyboard HP; risiko salah jumlah nol pada rupiah | D-26, UX-06 baru, keypad §5.3 dengan ejaan rupiah, UT-44 | Diperbaiki; default final menunggu uji |
| UXA-08 | P2 | “Pintar” belum didefinisikan sehingga agent bisa menebak angka atau membukukan otomatis | UX-19 dan tabel §5.4 berisi yang boleh/tidak boleh; UT-48 | Diperbaiki |
| UXA-09 | P2 | Beranda Owner berupa checklist statis tanpa alasan dependensi | Kartu **Saran berikutnya**, hitungan nyata, langkah bergantung dengan alasan | Diperbaiki: UX/UI §8.1 |
| UXA-10 | P2 | **Barang & Peralatan** memberi kesan ada stok | Diganti **Riwayat Belanja** | Diperbaiki |
| UXA-11 | P2 | **Kasbon & Pinjaman** dapat dikira pinjaman Owner | Label **Kasbon**; pinjaman Owner tetap di dana Owner | Diperbaiki |
| UXA-12 | P2 | Tutup Periode, Selesai Fisik, dan Kunci Keuangan terdengar teknis | **Kandang Kosong**, **Tutup Buku**, **Buka Lagi** | Diperbaiki |
| UXA-13 | P2 | **Periode Berjalan** ambigu | **Periode Sudah Mulai** | Diperbaiki |
| UXA-14 | P2 | Layar mencampur “siklus” dan “periode” | Layar memakai **Periode**; “siklus” hanya istilah teknis | Diperbaiki pada wireframe dan glosarium |
| UXA-15 | P2 | Aturan bahasa belum terukur | Aturan §16.6: judul kata benda, tombol kata kerja + objek, bantuan satu kalimat, format error tiga bagian | Diperbaiki |
| UXA-16 | P2 | Owner harus membuka detail tiap belanja untuk memeriksa | Baris buka-tutup dengan pratinjau dampak dan aksi di tempat; tidak ada bukukan dengan geser | Diperbaiki: V-11, WF-13, IMP-029 |
| UXA-17 | P2 | Catat Belanja belum memanfaatkan tanggal cepat, saran keperluan, dan cek mirip | WF-12 diperbarui dengan keypad dan bantuan pintar; sesuai mockup K-39 kini berupa halaman fokus dengan keypad terpasang | Diperbaiki |
| UXA-18 | P3 | Tes belum mengukur kemudahan secara objektif | Ukuran pindah halaman, ketukan, klik pertama, dan temuan langkah berikut di UX/UI §17.1, IMP-059, UT-44–UT-49 | Diperbaiki |

<a id="uxa05"></a>
## 5. Batas yang sengaja dijaga

Beberapa usulan populer terlihat “pintar”, tetapi dapat merusak angka atau keamanan. Batas berikut dicatat agar agent pelaksana tidak menambahkannya diam-diam.

| Usulan | Keputusan rancangan | Alasan |
|---|---|---|
| Tombol “sama seperti kemarin” atau saran nominal | Tidak dipakai | PRD UX-04/UX-16: angka harus fakta hari itu; saran kebiasaan membuat data tampak lengkap padahal tidak diukur |
| Geser untuk menyetujui/membukukan | Tidak dipakai untuk aksi uang | Aksi berisiko perlu pratinjau dan tidak boleh terpicu tanpa sengaja; geser juga tidak dapat menjadi satu-satunya cara |
| **Urungkan** untuk semua aksi | Hanya aksi lokal yang belum dikirim | Aksi server/uang memakai Koreksi atau pembalikan tercatat agar audit tetap utuh |
| Keypad aplikasi untuk semua field | Hanya angka | Password manager, paste, dan keyboard HP penting untuk login serta teks; keypad buatan berisiko bagi pembaca layar |
| Semua input di lembar | Hanya tugas singkat | Form panjang di lembar sulit dibaca dan rawan kehilangan konteks; lembar juga tidak boleh bertumpuk |
| Detail disembunyikan agar ringkas | Nominal, status, dan pencatat selalu terlihat | Informasi untuk memutuskan tidak boleh tersembunyi di balik buka-tutup |
| Poin, streak, atau tur wajib ala Duolingo | Tidak dipakai | Yang diambil dari Duolingo adalah arahan bertahap dan nuansa ringan; pekerjaan kandang tidak boleh terasa sebagai permainan atau pengawasan |
| AI eksternal wajib agar “pintar” | Tidak dipakai di R1 | Bantuan memakai aturan transparan dari data sendiri, bekerja offline, dan dapat dijelaskan |
| Dialog “Yakin?” saat sumber uang **Belum Tahu** | Tidak dipakai | Keputusan bisnis membolehkan sumber belum diketahui; cukup bantuan bahwa Owner akan melengkapi |
| Label **Transfer Uang** | Ditolak | Aplikasi tidak memindahkan uang; label itu menjanjikan hal yang tidak terjadi |
| Ikon status berupa emoji | Ditolak | Tampilan berbeda antarperangkat dan tidak konsisten untuk aksesibilitas |

<a id="uxa06"></a>
## 6. Yang sudah baik dan dipertahankan

- Setup sebelum DOC dapat dilanjutkan kapan saja; belanja dan uang kas tidak menunggu periode aktif.
- Recording bersama satu per kandang dan tanggal tanpa persetujuan Owner rutin.
- Belum ada data tidak ditampilkan sebagai Rp0 atau nol.
- Foto/nota opsional tanpa alasan wajib.
- Offline jujur: status lokal, server, pemeriksaan, pembukuan, dan pembayaran tidak dicampur.
- Glassmorphism hanya pada bingkai; form dan angka tetap solid dan terbaca.
- Navigasi utama maksimal lima tujuan per peran.

<a id="uxa07"></a>
## 7. Risiko tersisa dan cara membuktikan

| Risiko | Cara membuktikan saat implementasi diminta | Kartu |
|---|---|---|
| Keypad aplikasi lebih lambat atau sulit untuk sebagian pengguna | Bandingkan keypad dan keyboard HP pada tugas belanja/recording; ukur waktu, salah nol, dan pembaca layar | IMP-006, IMP-059 |
| Lembar bawah tertutup keyboard atau tombol kembali mengejutkan | Uji 320–390 CSS px, keyboard terbuka, tombol kembali Android, refresh | IMP-006, IMP-056 |
| Saran terasa mengganggu | Hitung saran yang ditunda/diabaikan dan wawancara singkat Owner/ABK | IMP-047, IMP-059 |
| Label baru tetap membingungkan di lapangan | Uji klik pertama: “Anda menerima uang dari Owner”, “Anda membeli solar”, “ABK meminjam uang” | IMP-059 |
| Agent menambah pola atau istilah sendiri | Pemeriksa istilah otomatis, daftar kelas yang diizinkan, pemeriksaan visual terhadap mockup (FRONTEND_DESIGN_SPEC §11), dan review diff terhadap glosarium | IMP-006, IMP-056 |

Target awal yang diuji tercantum di [UX/UI §16.4](UX_UI_SPEC.md#ux16): catat belanja 1 ketuk membuka halaman fokus dan kembali ke layar asal setelah kirim (mockup K-39), Owner membukukan belanja lengkap tanpa pindah halaman, serta target GOAL-01/02 yang sudah ada. Target ini usulan dan boleh direvisi hanya berdasarkan hasil uji.

<a id="uxa08"></a>
## 8. Referensi dan riwayat

Diperiksa 23 September 2026. Dipakai sebagai acuan pola, bukan persetujuan atau bukti bahwa aplikasi ini lulus uji.

| Sumber | Dipakai untuk |
|---|---|
| [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Tampilkan hal utama dahulu, detail saat diminta |
| [NN/g — Accordions on Mobile](https://www.nngroup.com/articles/mobile-accordions/) | Baris buka-tutup efektif di HP, tetapi jangan menyembunyikan konten yang selalu dibutuhkan |
| [NN/g — Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) | Error dekat sumber, jelas, dan membantu pemulihan |
| [NN/g — Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/) | Konfirmasi spesifik hanya untuk aksi berisiko |
| [W3C APG — Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | Tombol buka-tutup dengan `aria-expanded` dan keyboard |
| [Material Design 3 — Bottom Sheets](https://m3.material.io/components/bottom-sheets/guidelines) | Lembar bawah untuk konten/aksi sekunder di HP |
| [MDN — inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode) | Keyboard angka HP dan mode keypad buatan sendiri |
| [W3C — What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) | Fokus tidak tertutup, target, dan autentikasi yang mudah |
| [GoodUX — Duolingo onboarding](https://goodux.appcues.com/blog/duolingo-user-onboarding) | Arahan bertahap dan nilai dirasakan sebelum tugas berat; gamifikasi tidak diadopsi |

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Audit kemudahan seluruh dokumen perencanaan dan perbaikan rancangan tertulis (K-38, D-26, D-27, UX-17–UX-20, UX/UI v0.3, alur v0.2, UT-44–UT-49, IMP-006). Belum ada mockup, aplikasi, atau uji pengguna. |
| 0.2 | 23 September 2026 | Menyesuaikan dengan desain final K-39: Catat Belanja menjadi halaman fokus sesuai mockup, dan penjagaan pola ditambah daftar kelas yang diizinkan serta pemeriksaan visual. Temuan lain tetap. |
