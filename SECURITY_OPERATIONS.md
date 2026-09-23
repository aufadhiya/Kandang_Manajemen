# Rencana Keamanan dan Operasional — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi | 0.1 |
| Tanggal | 23 September 2026 |
| Status | Rancangan untuk ditinjau; bukan persetujuan kebijakan, implementasi, atau kesiapan produksi |
| Fase | Perencanaan Markdown saja; tidak membuat aplikasi, mockup, atau konfigurasi deployment |
| Cakupan | Kontrol keamanan dan operasi yang harus dirancang sebelum implementasi R1 dan pilot |
| Sumber aturan bisnis | [PRD.md](PRD.md), terutama §3, §6, §7, §9, §22–§27, dan §31 |
| Sumber sistem | [ARCHITECTURE.md](ARCHITECTURE.md), terutama §3, §8–§11, dan §14–§15 |
| Sumber UX offline | [UX_UI_SPEC.md](UX_UI_SPEC.md#ux15) §15.2; UX adalah kontrak perilaku tertulis, bukan hasil uji |

## Daftar isi

[1 Tujuan](#secops01) · [2 Prinsip](#secops02) · [3 Batas kepercayaan](#secops03) · [4 Capability/field](#secops04) · [5 Akun/sesi/MFA](#secops05) · [6 Recovery](#secops06) · [7 Offline](#secops07)

[8 Data/log](#secops08) · [9 File/export](#secops09) · [10 READ_ONLY](#secops10) · [11 Retensi](#secops11) · [12 Backup](#secops12) · [13 Restore](#secops13) · [14 Insiden](#secops14) · [15 Observabilitas](#secops15) · [16 Deployment](#secops16) · [17 Readiness](#secops17) · [18 Q terbuka](#secops18) · [19 Referensi](#secops19)

<a id="secops01"></a>
## 1. Tujuan, batas, dan kepastian

Dokumen ini mengubah kebutuhan keamanan PRD dan batas arsitektur menjadi petunjuk operasional yang dapat diperiksa kelak oleh implementer dengan konteks terbatas. Ini rencana, bukan klaim bahwa kontrol sudah dibuat atau dites.

### 1.1 Hierarki keputusan

- PRD tetap sumber utama makna bisnis, kebutuhan **K**, default rancangan **D**, ID keamanan **SEC-xx**, kebutuhan offline **OFF-xx**, kebutuhan nonfungsional **NFR-xx**, serta pertanyaan **Q-xx**.
- Dokumen ini merinci cara menguji dan mengoperasikan pagar yang sudah ditetapkan; ia **tidak** mengubah, menutup, atau memberi nomor baru pada SEC-xx/OFF-xx/NFR-xx/Q-xx.
- Label **terkonfirmasi** hanya digunakan untuk keputusan yang jelas berstatus K di PRD, misalnya username/password tanpa email wajib (K-37), beberapa ABK personal per kandang (K-26), dan pemisahan Admin/Owner/ABK/PPL (K-08).
- Label **usulan/default** berlaku untuk desain akses dan operasi yang masih D, kebutuhan SEC/NFR yang menunggu keputusan, angka target, serta prosedur yang belum pernah disetujui/dijalankan.
- Keberadaan dokumen, lolosnya pemeriksaan Markdown, atau contoh runbook tidak membuktikan sistem aman, patuh hukum, tersedia tinggi, atau siap menerima uang/data pelanggan.

### 1.2 Cakupan R1 dan dependensi

- R1 mengaktifkan Admin platform, Owner, dan ABK serta fungsi yang dinyatakan aktif di PRD.
- Mandor, PPL, keuangan pribadi Owner, inventory detail, IoT, CCTV, dan fungsi R2 tetap nonaktif; jangan membangun grant atau menu spekulatif untuk mengejar cakupan dokumen ini.
- Ketentuan PPL/Mandor di matriks berikut adalah batas perluasan masa depan, bukan izin mengaktifkannya di pilot.
- Dokumen pelengkap yang direncanakan: [DATA_MODEL.md](DATA_MODEL.md), [API_SYNC_SPEC.md](API_SYNC_SPEC.md), [TEST_PLAN.md](TEST_PLAN.md), dan [Implementation Plan.md](Implementation%20Plan.md). Rujukan ini menyatakan ketergantungan isi, bukan mengklaim file sudah disetujui atau pekerjaan coding boleh dimulai.
- Jika dokumen implementasi memakai ID lain, pertahankan pemetaan ke PRD dan jangan menamai ulang ID requirement sumber.

<a id="secops02"></a>
## 2. Prinsip keamanan yang tidak boleh dilonggarkan

1. **Otorisasi server, deny-by-default.** Tiap operasi mengecek actor + tenant/kandang + capability + status + ownership; tenant ID client hanya selector dan login bukan izin.
2. **Tidak ada Admin baca-semua.** Admin mengelola layanan/limit tanpa membuka isi finansial tenant atau private finance Owner.
3. **Field rahasia tidak dikirim.** ACL berlaku pada API, agregasi, cache, file, ekspor, log, job dan receipt, bukan hanya tampilan UI.
4. **Jaga efek dan bukti.** Klaim bukan uang posted; koreksi/akses/restore diaudit, tidak menimpa riwayat atau membuat efek ganda.
5. **Offline bukan izin permanen.** Revoke tidak menjangkau HP offline; lease dan risiko local-only harus dijelaskan.
6. **Tidak merancang kriptografi sendiri.** Algoritme, parameter, library, key dan provider menunggu threat model/ADR.
7. **Minimalkan data pribadi.** Jangan meminta, menyimpan, mencatat atau mengekspor data yang tidak diperlukan.
8. **Retensi belum diputuskan.** Sampai Q-11, jangan purge otomatis finansial posted, audit, bukti recovery, atau lampiran.

<a id="secops03"></a>
## 3. Batas kepercayaan dan aset

### 3.1 Aset yang dilindungi

| Aset | Risiko utama | Batas yang harus dijaga |
|---|---|---|
| Kredensial dan sesi | Tebak password, credential stuffing, token dicuri, reset sosial | Verifier tidak menyimpan password terbaca; token bisa dicabut; reset perlu kewenangan |
| Data usaha/tenant | BOLA/IDOR, filter tenant terlewat, query agregat bocor | Isolasi pada API, domain, data, cache, file, worker, dan ekspor |
| Keuangan personal Owner | Pembacaan oleh Admin, ABK, PPL, atau tenant lain | Hanya pemilik; fitur ini sendiri ditunda dari R1 |
| Kas, biaya, gaji, kasbon, upah | Perubahan tanpa izin, posting ganda, koreksi tanpa jejak | Command atomik, idempotensi tahan restore, audit, dan aturan Owner-only yang sesuai PRD |
| Recording bersama | Timpa/penjumlahan lintas perangkat | Version check dan satu rekap efektif per kandang/tanggal |
| Foto/nota dan ekspor | URL publik/tertebak, IDOR, file berbahaya, bocor lewat log | Storage privat, otorisasi saat unduh, validasi file, masa akses terbatas |
| Cache dan antrean HP | Perangkat hilang, user berganti, lease habis, storage dihapus | Partisi identitas/scope, minimisasi, antrean terkunci, batas kehilangan dijelaskan |
| Bukti grant dan recovery epoch | Restore menghidupkan hak lama atau mengulang command | Bukti independen dari snapshot DB yang dipulihkan dan prosedur blokir bila bukti kurang |
| Rahasia operasi | Secret di repo/log/backup atau dipakai lingkungan lain | Secret store yang disetujui, akses minimum, rotasi dan audit |

### 3.2 Yang tidak dipercaya sebagai otoritas

- Jangan percaya field actor/tenant/role/capability/status/epoch atau timestamp posting dari client; simpan waktu kejadian terpisah (OFF-14).
- UUID, cache/service worker, key lokal, sukses HTTP/upload, atau snapshot backup lama bukan bukti izin, posting, grant terkini, atau keselamatan data.
- Admin, operator backup dan dukungan tidak otomatis berhak membaca transaksi tenant.

<a id="secops04"></a>
## 4. Kemampuan, scope, dan pembatasan field

### 4.1 Aturan evaluasi izin

Untuk setiap request bisnis server menyusun konteks dari identitas login aktif, grant terbaru, tenant, kandang/siklus, capability, kepemilikan objek, status tenant/periode, dan field yang boleh dikeluarkan. Tidak memakai role global tunggal sebagai pengganti seluruh pemeriksaan.

Urutan server: validasi sesi → cocokkan tenant/scope dengan grant → cek capability dan parent ACL → cek status layanan/periode serta ownership → buat response whitelist → commit audit+efek sesuai batas atomik. Terapkan sama pada list/detail/search/aggregate, notifikasi, file/export, worker, cache, serta receipt replay.

Jika PostgreSQL/RLS dipilih, RLS hanya pertahanan tambahan. Identitas runtime tidak boleh mempunyai hak yang mengabaikan policy; koneksi pool/worker tidak boleh mewarisi tenant context request lain. RLS tidak membatasi kolom rahasia dengan sendirinya. Stack database masih pilihan Q-10/ADR.

### 4.2 Matriks capability tingkat produk

Matriks ini mempertahankan PRD §6.2; bukan grant yang sudah aktif di suatu sistem.

| Kapabilitas | Admin platform | Owner | ABK | Mandor (masa depan) | PPL (masa depan) |
|---|---|---|---|---|---|
| Mengatur status/limit layanan | Kelola metadata/limit; tidak membaca isi finansial | Baca status tenant sendiri | Tidak | Tidak | Tidak |
| Membaca/mengelola kandang dan tim | Tidak | Kelola tenant sendiri | Baca scope assignment; tidak mengelola grant | Hanya scope tugas bila kelak disetujui | Hanya kandang yang diundang dan field minimum |
| Mencatat pembelian operasional | Tidak | Catat/review sesuai aturan bisnis | Ajukan/catat kejadian yang diizinkan; bukan approve/post | Scope tugas jika kelak diputuskan | Tidak |
| Approve/post/reversal finansial | Tidak | Owner berwenang sesuai status/aturan | Tidak | Tidak menjadi default; perlu keputusan baru | Tidak |
| Kas, kontrak harga, settlement, laporan laba | Tidak | Tenant sendiri | Tidak; kas pribadi/claim hanya sesuai scope sendiri | Tidak | Tidak |
| Gaji/kasbon milik ABK | Tidak | Kelola dalam tenant | Hanya catatan yang memang miliknya sendiri | Hanya milik sendiri jika kelak ada grant | Tidak |
| Upah pekerjaan | Tidak | Kelola tenant sendiri | Catat/baca milik sendiri sesuai aturan | Milik sendiri jika kelak aktif | Tidak |
| Recording DAILY bersama | Tidak | Tenant/kandang sendiri | Buat/koreksi dalam assignment aktif; tanpa approval rutin | Tidak pada R1 | Tidak pada R1 |
| Pengaturan mode/cutoff/periode/grant | Tidak | Online, dengan step-up sesuai keputusan | Tidak | Tidak pada R1 | Tidak pada R1 |
| Ekspor | Metadata job saja, bukan isi bisnis | Data tenant yang berhak | Catatan sendiri sesuai izin | Hanya laporan scope yang disetujui | Hanya laporan operasional grant kelak |
| Audit bisnis | Metadata administratif minimum | Tenant sendiri | Data keuangan sendiri dan recording bersama yang berhak | Riwayat scope kelak | Kunjungan sendiri kelak |
| Impersonation/support read-all | **Tidak ada menu atau hak rutin** | Tidak | Tidak | Tidak | Tidak |

### 4.3 Whitelist field utama

| Kelompok | Owner tenant | ABK ber-assign | Admin platform | Batas tegas |
|---|---|---|---|---|
| Konteks operasional | Data kandang yang dikelola | Label mitra minimum, jenis/satuan pakan, tanggal DOC, populasi awal dan recording yang dibutuhkan | Metadata status/limit saja | Jangan kirim invoice, harga mitra, rekening, atau detail penerimaan ke ABK |
| Recording DAILY | Nilai efektif dan riwayat yang diperlukan | Nilai bersama di scope assignment serta author/revisi | Tidak | Tidak membuka profil lengkap atau keuangan author |
| Pembelian dan keuangan | Tenant sendiri | Catatan/claim sendiri sesuai scope; tidak melihat milik rekan | Tidak | Jangan tampilkan saldo usaha, biaya tenant, atau transaksi pekerja lain ke ABK |
| Gaji/kasbon/upah | Data pekerja tenant menurut wewenang Owner | Hanya catatan hak/riwayat dirinya sendiri | Tidak | Akun Admin bukan pengecualian |
| Pribadi Owner | R1 tidak tersedia; jika fitur masa depan hanya pemilik | Tidak | Tidak | Tidak bocor lewat aggregate/search/export |
| Lampiran | Parent object yang dapat dibaca | Parent object yang dapat dibaca | Tidak | Visibility mewarisi induk; tidak ada URL permanen publik |
| Audit | Riwayat tenant sesuai otorisasi | Keuangan sendiri + recording bersama berizin | Audit administrasi platform tanpa payload bisnis | Jangan menyimpan isi nota sebagai audit |

Semua capability dan whitelist berlaku untuk endpoint, list, query agregasi, cache, notifikasi, file, ekspor, worker, dan acknowledgement receipt. Uji juga perbedaan antara “tidak terlihat” dan “tidak dikirim”.

<a id="secops05"></a>
## 5. Akun, password, sesi, MFA, dan step-up

### 5.1 Username/password

- **Terkonfirmasi (K-37):** login username/password tanpa email wajib. D-25 mengusulkan username ternormalisasi unik global; cek benturan atomik tanpa mengungkap pemilik/tenant. Username bukan ID histori.
- Password tidak pernah disimpan/ditampilkan dalam bentuk terbaca atau reversible; gunakan password-hashing standar terpelihara, bukan algoritme sendiri/hash cepat generik. Username yang berubah tidak mengganti author, saldo, grant, atau audit.
- ADR sebelum implementasi menetapkan algoritme/parameter, versi library, migrasi, breached-password check, panjang/encoding, rate limit, dan rotasi. Dokumen ini **tidak** memilih parameter, library, provider, atau algoritme.
- Ikuti pedoman NIST terkini; hindari composition rules sewenang-wenang. Login failure tidak membedakan username tak ada/salah/tenant lain; rate limit tanpa bypass. Threshold harus ditetapkan dengan uji/Q-10.
- Jangan memakai data pribadi atau pertanyaan tebakan sebagai recovery proof.

### 5.2 Sesi dan perangkat

- Server memvalidasi sesi pada setiap request; dapat revoke untuk logout, reset, perubahan grant/password, insiden dan recovery. Putar identifier/token setelah login, reauth, privilege change dan recovery untuk mencegah fixation.
- Masa idle/absolut, refresh rotation dan banyak sesi ditetapkan lewat ADR. Lease offline berbeda dari sesi online. Cookie memerlukan atribut aman dan CSRF; bearer token memerlukan threat review dan tidak boleh disimpan berumur panjang di `localStorage` hanya demi mudah.
- Cegah XSS dengan output escaping, kebijakan sumber konten/dependency sesuai stack, dan tanpa HTML dari catatan/nota.
- Logout tetap tersedia: antrean terkunci pada identitas asal, tidak ditransfer ke login berikutnya. Revoke server tidak dapat menarik cache HP offline atau file yang sudah diunduh; jelaskan batas ini.

### 5.3 MFA dan autentikasi ulang

- **SEC-07:** Admin platform wajib MFA sebelum produksi. Owner serta recovery/transfer, grant sensitif, export besar dan perubahan keamanan memakai reauth/step-up sesuai ADR; mekanisme/pengecualian belum dipilih.
- Step-up mengikat actor, aksi, target/scope dan waktu; MFA reset mengikuti recovery terverifikasi, bukan bypass helpdesk. Jangan menetapkan OTP/SMS/email/passkey/provider sebelum threat review.
- Uji login/logout, session fixation/replay, reauth, revoke paralel, CSRF bila relevan, pergantian perangkat dan akses setelah grant dicabut.

<a id="secops06"></a>
## 6. Reset, recovery, dan pergantian Owner

### 6.1 Reset akun ABK oleh Owner

- Hanya untuk akun ABK yang dikelola tenant Owner (SEC-16), tidak untuk Owner/Admin/PPL atau tenant lain. Owner reauth/step-up; reset satu kali dan berumur terbatas melalui kanal privat; ABK wajib mengganti password saat login.
- Cabut sesi lama; jangan tampilkan password lama, simpan rahasia reset di log/notifikasi/ticket, menambah assignment, atau menyamar sebagai ABK. Audit actor, target, waktu, alasan minimum dan hasil tanpa rahasia.
- Antrean/cache tetap terikat pada actor/device asal dan divalidasi ulang saat sync; reset tidak memindahkan histori. Benturan username ditangani tanpa mengungkap pemilik/tenant.

### 6.2 Recovery Owner tanpa email wajib

**Q-02/Q-10 masih terbuka.** Recovery Owner harus menggunakan bukti kewenangan yang dapat diverifikasi atau kode recovery yang diputuskan dalam ADR. Username saja, nomor telepon baru, permintaan anggota tenant, atau keputusan Admin seorang diri tidak cukup.

Alur minimum yang harus disepakati dan dites:

1. Buat incident ID; jangan ubah kredensial/grant sebelum verifikasi identitas dan kewenangan dengan metode yang disetujui sebelum pilot.
2. Minimalkan bukti pribadi; jangan simpan dokumen identitas lengkap, password, atau recovery token di log/repository. Jika bukti meragukan/sengketa, tahan recovery dan eskalasi.
3. Sesudah verifikasi: rotasi credential/faktor, cabut sesi HP hilang, tinjau grant/antrean, beri notifikasi lewat kanal terverifikasi yang dipilih (belum tentu email), dan audit verifier, alasan, waktu, scope serta hasil.
4. Proses harus sekali/idempotent, aman terhadap request paralel, dan tidak membuka private ledger Owner lain. Tanpa bukti sah, recovery otomatis tidak dijanjikan.

### 6.3 Pergantian primary Owner

- Transfer rutin mensyaratkan reauth Owner lama, undangan/penerimaan Owner baru, snapshot membership/grant, dan audit (SEC-14). Pakai expected ownership version serta constraint/transaksi atomik satu primary Owner; versi usang ditinjau ulang, bukan ditimpa.
- Owner tak dapat login → recovery identitas dahulu; sengketa/bukti kurang menahan transfer. Cabut sesi/grant lama; antrean lama tidak mendapat hak baru. Buku pribadi tidak pindah, dan author/histori bisnis tidak ditulis ulang.
- Admin bukan adjudicator baca-semua. Bantuan, bila disetujui, terbatas waktu/scope, beralasan, diaudit; delegasi finansial saat Owner absen tetap menunggu Q-03.

<a id="secops07"></a>
## 7. Offline, lease, perangkat, dan capture-only

### 7.1 Aturan offline yang berlaku sebagai dasar rancangan

- Login awal/registrasi/unduh scope online (OFF-01); partisi cache per user+tenant+scope, tanpa private finance untuk ABK/PPL (OFF-03). Simpan payload+ID secara atomik sebelum mengaku tersimpan; bila penuh, gagal harus jelas (OFF-02).
- Retry memakai ID yang sama dengan hash, dependency, base version dan waktu kejadian (OFF-04/05). Server memeriksa grant/status terkini; payload yang ditolak tetap tersimpan, bukan dihapus (OFF-06).
- Expected-version menangani konflik; DAILY tidak dijumlah/ditimpa diam-diam (OFF-07/18). Lease awal 72 jam hanya usulan Q-06; expiry mengunci cache/command baru, bukan antrean lama (OFF-09).
- Sync berjalan saat app/koneksi aktif dan dapat dicoba manual; background sync tidak dijamin (OFF-11). Logout/update tidak membuang antrean; eviction, uninstall, perangkat rusak/penuh tetap dapat menghilangkan data lokal (OFF-10/12/13).
- Waktu HP bukan waktu posting (OFF-14); catatan tunai offline tetap klaim belum disahkan, bukan mutasi saldo (OFF-16).

### 7.2 Perangkat dan threat model local key

HP pribadi ABK adalah batas kepercayaan lemah: dapat hilang, dibagi, di-root, dihapus storagenya, memakai browser lain, atau terkena skrip berbahaya. Sistem mengurangi risiko, bukan menjamin kendali atas perangkat.

| Ancaman | Dampak | Perlindungan/komunikasi wajib |
|---|---|---|
| HP hilang/dicuri ketika terkunci | Cache/antrean lama dapat dibaca atau disalahgunakan | Minimalkan cache, kunci aplikasi, lease terbatas, sediakan revoke sesi/grant online, jelaskan bahwa revoke tidak menjangkau HP offline |
| HP tidak terkunci atau profil OS dibagi | Catatan lokal terbuka untuk orang lain | Jangan simpan sesi lintas user tanpa keputusan; local unlock diperlukan untuk capture-only; uji keluar/beralih akun |
| XSS atau dependency jahat pada origin aplikasi | Skrip dapat membaca data lokal dan mungkin meminta operasi atas nama user | Proteksi XSS, dependency/build review, CSP sesuai stack, minimalkan rahasia di browser; key non-exportable saja tidak menghentikan skrip aktif yang dapat meminta operasi |
| Akses fisik/browser devtools/root | Database lokal atau key browser dapat diekstrak/dimodifikasi | Anggap cache dan local key dapat dikompromikan pada perangkat yang dikuasai penyerang; jangan klaim keamanan setara hardware keystore |
| Storage eviction, uninstall, ganti browser/perangkat | Draft/capture-only yang belum sinkron hilang | Minta persistent storage bila tersedia, pantau ruang bila bisa, tampilkan status antrean, jelaskan local-only bukan backup |
| Jam perangkat dimundurkan | Lease lokal tampak belum habis | Waktu lokal tidak memperpanjang izin server; rancangkan pemeriksaan dan threat test clock rollback |
| Kunci lokal hilang/berubah | Provenance lokal tidak lagi dapat dibuktikan/didekripsi | Tetapkan recovery/karantina sebelum pilot; jangan mengonversi catatan yang asalnya tak dapat diverifikasi |
| Copy database atau backup profil | Data pribadi/tenant lain mungkin tersalin | Partisi identitas, minimisasi field, jangan menaruh kredensial terang di database/cache |

**Batas pemilihan:** jangan memilih WebCrypto/native keystore, algoritme/ukuran key, signature, wrapping, library atau provider di sini. ADR harus menyebut bukti yang diberi key, siapa dapat mengelola/menghapusnya, copy/restore, rotasi dan recovery; tanpa bukti memadai capture-only tetap nonaktif.

### 7.3 Lease, revoke, dan perubahan akses offline

- Lease offline harus berisi scope yang benar-benar diunduh dan waktu izin terakhir terverifikasi, serta tidak boleh diperpanjang oleh capture-only atau jam HP.
- 72 jam tetap hipotesis sampai Q-06 diputuskan melalui uji lapangan di perangkat dan pola jaringan pilot.
- Grant dicabut, user dinonaktifkan, atau tenant READ_ONLY tidak dapat menghentikan perangkat yang sepenuhnya offline. Saat koneksi kembali, server menolak operasi yang tidak berhak dan mengarantina antreannya untuk review.
- Setelah lease kedaluwarsa, cache bisnis tidak dapat dibaca oleh alur aplikasi normal. Jangan hapus antrean, mengubah actor, atau mengganti tenant untuk menghilangkan error izin.
- Sisa file/cache yang sudah diunduh mungkin tidak bisa ditarik dari perangkat; berikan batas tersebut dalam copy, kebijakan privasi, dan panduan Owner.
- Perubahan password/recovery/reset mencabut sesi server; cache lokal mengikuti batas lease dan aturan penghapusan eksplisit, bukan klaim remote wipe seketika.

### 7.4 Kontrak provenance OFF-17 capture-only

Capture-only bukan akses tenant offline, bukan akun anonim, bukan persetujuan, dan bukan posting kas.

1. Hanya sesudah registrasi online dan local unlock yang lulus review; tidak tersedia setelah logout atau pada profil tanpa setup sah. Tidak ada saldo, master data, daftar orang, cache/riwayat tenant, autocomplete, atau file lama.
2. Field minimum: waktu kejadian, nominal, teks keperluan/pihak dan bukti baru opsional. Catatan belum berotorisasi; tidak approve/post/menutup periode.
3. Simpan author/device, note ID dan referensi registrasi asal server, termasuk `origin_tenant_id` immutable. Provenance membuktikan asal, **bukan grant**; client tak dapat mengklaim tenant/author.
4. Setelah reauth, hanya author sama atau recovery SEC-13 yang sah dapat mengonversi ke scope terkini dalam tenant asal. Satu konversi efektif unik; retry mengembalikan hasil sama. Tenant/grant tak terbukti → recovery-only, bukan command.
5. Uji kehilangan/rotasi key, storage penuh, browser migration, device replacement, clock tamper, XSS dan rooted device. Jangan menyebut key browser hardware-backed/anti-tamper atau setara server tanpa bukti.

<a id="secops08"></a>
## 8. Data, rahasia, log, privasi, dan audit

### 8.1 Data dan rahasia

- Pisahkan dev/test/staging/production; jangan berbagi credential, storage atau data nyata. Simpan app/DB/signing/backup/storage secrets di secret store/environment terproteksi, bukan repo, PR, image, docs, sample atau shell history.
- Beri hak minimum dan identitas layanan terpisah untuk API/worker/backup bila didukung. Rotasi saat bocor/pergantian operator sesuai policy; audit versi/owner/waktu tanpa nilai rahasia.
- Gunakan HTTPS dan proteksi storage/backup setelah ADR; at-rest encryption bukan pengganti ACL. Jangan tambah field crypto sebelum menilai pencarian, restore, ekspor, key rotation dan bukti recovery.
- Fixture/benchmark memakai tenant, akun, foto dan angka sintetis; data produksi tidak dipakai di laptop/PR tanpa prosedur yang disetujui.

### 8.2 Logging operasional dan privasi

Log operasional bukan audit ledger dan bukan sumber saldo. Batasi isi log pada metadata yang perlu untuk diagnosa.

**Boleh:** request/operation/job ID opaque, actor/scope minimum, aksi, hasil/error, waktu server, latency, versi dan metadata operator/incident. Jumlah/ukuran hanya bila tidak membocorkan isi bisnis.

**Dilarang:** password/reset/session/MFA/recovery/provider secrets, cookie/header/key, signed URL, nota/foto, ID recovery, free text, payload keuangan, private finance, atau rahasia di trace/analytics/crash/URL/push/nama file. Redaksi sebelum logger menerima event.

### 8.3 Audit bisnis

- Audit berbeda dari debug log dan append-only secara logis. Catat actor, waktu server/kejadian, tenant/scope, objek/aksi, versi perlu, alasan, request ID serta proxy actor; jangan simpan secret, URL, nota penuh atau field tak perlu.
- Posted dikoreksi dengan reversal/adjustment tertaut FIN-03, bukan delete atau tulis ulang author. Audit akses/recovery mencatat requester/verifier/decision/actor/scope.
- Masa simpan, penghapusan, subject export dan legal hold tetap Q-11; audit bukan bukti compliance otomatis.

<a id="secops09"></a>
## 9. Lampiran, ekspor, dan pekerjaan latar

### 9.1 Lampiran

- Terima metadata bisnis dulu; status file terpisah (local/pending/uploaded/failed/quarantined/missing); retry foto tak menggandakan transaksi (OFF-15). Bukti foto opsional, bukan syarat tersembunyi approval.
- Capability/ACL parent dicek saat upload dan setiap download. Storage privat; URL berumur pendek setelah otorisasi, bukan link permanen; nama server-generated, validasi isi (bukan hanya MIME), allow-list, ukuran/jumlah dan scan/quarantine sebelum serving.
- Ikuti OWASP File Upload: batasi parser, simpan di luar webroot, malware check bila ada, CSRF bila relevan. EXIF lokasi dihapus dari salinan tayang bila kebijakan mengharuskan; jangan klaim sanitize jika belum diuji.
- Format/size/count PRD masih usulan D/Q-10. Lampiran tak memperluas akses, link tak dikirim ke lockscreen; file yang sudah diunduh tak dapat ditarik kembali.

### 9.2 Ekspor

- Whitelist hanya field/tenant/scope yang pemohon masih boleh lihat. Create/status/result/retry job dan URL selalu diotorisasi ulang; revoke membatalkan akses hasil, dan Admin hanya melihat metadata.
- Catat requester/scope/time/filter/version minimum; jangan simpan payload, token, tenant lain atau signed URL di job/log. Ekspor besar/sensitif memerlukan step-up ADR.
- Storage privat dan link expiry; expiry bukan kebijakan purge (Q-11). Ekspor bukan backup dan tidak berisi draft offline. Review/PR memakai data sintetis/disamarkan (SEC-12).

### 9.3 Worker dan outbox

- Job diterima dengan receipt/outbox atomik; `accepted` bukan bukti ekspor tersedia atau efek keuangan selesai. Worker memeriksa ulang scope, status dan provenance terkini.
- Retry memakai ID/effect sama, dedupe dan backoff terbatas; queue/dead letter privat, akses ops diaudit, kegagalan terminal terlihat tanpa payload sensitif.
- Uji crash commit/response, upload parsial, worker ganda dan revoke sebelum job diproses.

<a id="secops10"></a>
## 10. READ_ONLY, suspend, dan perubahan layanan

| Status | Perilaku server | Yang tidak boleh dilakukan |
|---|---|---|
| `ACTIVE` | Baca/mutasi sesuai hak user, grant, capability, dan status objek | Menganggap status tenant saja cukup untuk izin |
| `READ_ONLY` | Baca dan ekspor tetap menurut izin; tolak mutasi bisnis baru; tampilkan alasan status layanan yang dapat dijelaskan | Menyamarkan penolakan sebagai network error; menyelundupkan mutasi bisnis melalui worker/offline/export; Admin membaca semua transaksi |
| `ARCHIVED` | Akses/ekspor mengikuti kebijakan retensi/ekspor yang belum diputuskan | Menghapus otomatis atau membuka semua data karena arsip |
| Suspend sementara | Menahan mutasi sesuai kebijakan status; baca dibatasi aturan produk | Menghapus data, mengubah saldo, atau mensuspend tenant lain milik user yang sama |

- Periksa status layanan secara konsisten pada API/command, worker, upload, ekspor, dan job yang sudah antre.
- Pengecualian sempit bukan jalur mutasi bisnis: login/logout/rotasi/revoke sesi, lookup receipt milik actor tanpa efek, pencatatan audit keamanan, pembuatan/job/unduhan ekspor berhak, serta perubahan status layanan oleh Admin berwenang. Masing-masing tetap memeriksa izin dan tidak mengubah saldo/dokumen bisnis. `ARCHIVED` tidak mewarisi pengecualian baca/ekspor READ_ONLY tanpa kebijakan arsip yang disahkan.
- Penurunan limit di bawah pemakaian tidak menghapus data dan tidak otomatis menghentikan periode aktif; blok penambahan yang melampaui limit secara atomik (PRD §7.2).
- Tampilkan status `READ_ONLY` sebagai keadaan layanan, bukan error koneksi. Error izin juga tidak memuat detail tenant/objek yang tidak berhak dilihat.
- Catat operator, alasan, ticket/incident ID, waktu, scope tenant dan masa berlaku perubahan. Reaktivasi memerlukan kewenangan dan pemeriksaan data tertunda.
- Keputusan siapa dapat mengubah status, alasan suspend yang dapat ditampilkan, layanan minimum saat tunggakan, dan keberlanjutan ekspor tetap dikonfirmasi sebelum produksi; jangan mengarang kebijakan billing.

<a id="secops11"></a>
## 11. Retensi dan penghapusan yang belum diputuskan

Q-11 belum ditutup. Dokumen ini **tidak** menetapkan masa simpan hukum atau instruksi purge.

- Sampai keputusan retensi disetujui, jangan membuat purge otomatis untuk finansial posted, ledger, receipt/idempotency, audit, revisions, tombstone replay, bukti grant/recovery, atau lampiran tenant.
- Jangan memakai soft-delete sebagai bukti data sudah terhapus atau kewajiban privasi sudah dipenuhi.
- Nonaktifkan akun/grant tanpa menghapus saldo, klaim, hak gaji, atau histori milik pengguna terdahulu.
- Jangan menjanjikan data lokal yang belum terkirim dapat dipulihkan server; jangan menghapusnya otomatis saat logout atau update.
- Simpan status missing/retention hold jika file tidak tersedia; jangan menghapus parent transaksi karena lampiran hilang.
- Sebelum mengaktifkan fitur hapus, pemilik kebijakan perlu menetapkan kategori data, tujuan, tenggat mulai, hold/appeal, konsekuensi ekspor, perilaku backup/PITR, tombstone replay, audit tindakan, dan bukti penghapusan.
- Implementasi penghapusan kelak harus membedakan data aktif, arsip, salinan backup, bukti audit, export cache, file lokal, dan operation replay; satu tombol tidak dapat dianggap menghapus semuanya.
- Penasihat hukum/privasi dan konteks yurisdiksi belum ditetapkan dalam dokumen ini; tidak membuat klaim kepatuhan.

<a id="secops12"></a>
## 12. Backup, PITR, dan sasaran pemulihan

### 12.1 Sasaran yang diusulkan, belum terukur

| ID PRD | Sasaran rancangan | Bukti yang harus tersedia |
|---|---|---|
| NFR-06 | RPO ≤15 menit untuk data server-committed; RTO ≤8 jam | Drill restore/PITR atau mekanisme setara, log waktu, daftar data terdampak, serta biaya/retensi yang disetujui |
| NFR-11 | Restore konsisten ledger, receipt, outbox, audit, revisi, tombstone, file manifest, grant dan epoch | Uji rollback snapshot/command, verifikasi grant pasca-backup, satu command satu efek, persetujuan buka kembali |
| OFF-12 | Local-only tidak tercakup RPO server | Copy dan tes jelas menyebut antrean HP bukan backup server |

Angka RPO/RTO adalah target PRD, **bukan SLA, hasil benchmark, atau janji provider**. Target harus direvisi dengan persetujuan bila pilihan hosting/biaya tidak dapat memenuhinya; jangan menurunkan kontrol diam-diam.

### 12.2 Lingkup backup yang perlu ditetapkan

- Konsistensi sumber bisnis, efek/ledger, operation receipts, outbox/job, audit, revisions, grant/membership, reset/recovery evidence, file metadata/manifest, dan relasi tenant harus diperhitungkan bersama.
- File storage memerlukan manifest/identitas versi/hash yang dapat dicocokkan dengan database; object storage tidak otomatis pulih pada titik waktu database yang sama.
- Backup dan WAL/arsip log (bila teknologi mendukung) disimpan dengan enkripsi dan akses terpisah sesuai provider terpilih. PostgreSQL PITR memerlukan base backup serta arsip WAL kontinu; dump harian saja tidak memenuhi target RPO ≤15 menit.
- Jangan menganggap replica, package export Owner, screenshot, atau antrean offline sebagai backup yang telah diuji.
- Pisahkan identitas yang dapat mengelola backup dari identitas API rutin; hak membaca isi database backup harus minimum, beralasan, dan diaudit.
- Simpan minimal satu salinan/bukti penting di failure domain yang berbeda dari backup utama sesuai desain yang disetujui; provider, region, immutability, lokasi, dan biaya belum dipilih.
- Definisikan keberhasilan backup sebagai artefak konsisten yang dapat dipulihkan, diverifikasi, dan dipetakan ke run/retention; status job “success” saja tidak cukup.
- Retensi backup dan penghapusan salinan tetap Q-11; sampai ada keputusan, tidak menyamakan “menahan semua selamanya” dengan kebijakan final.

### 12.3 Frekuensi, pemantauan, dan latihan

- Jadwalkan backup dan pengarsipan log sehingga jarak data terakhir yang dapat dipulihkan memenuhi target yang disetujui; frekuensi/teknik mengikuti provider setelah ADR.
- Pantau timestamp backup terakhir, umur arsip log, lag, ruang, kegagalan, hasil checksum/manifest, dan kemampuan restore.
- Alarm bila backup/log lewat ambang; eskalasi sebelum window RPO gagal, bukan setelah ada permintaan restore.
- Jalankan drill berkala di lingkungan terisolasi berisi data sintetis; interval drill dan pemiliknya disetujui sebelum pilot.
- Catat waktu mulai/selesai, point-in-time, lag kehilangan, hasil integritas, grant yang diaktifkan/diblokir, file missing, RPO/RTO aktual, dan semua penyimpangan.
- Drill gagal berarti gate recovery belum lulus. Jangan menghapus bukti kegagalan atau menyatakan lulus dari backup tanpa restore.

<a id="secops13"></a>
## 13. Runbook restore, recovery epoch, dan bukti grant

### 13.1 Bukti akses yang bertahan terhadap restore

Restore DB dapat memutar balik grant, revoke, transfer Owner, atau reset yang terjadi setelah snapshot. Karena itu rancangan produksi memerlukan **catatan bukti grant/revoke dan recovery epoch yang tahan terhadap restore snapshot lama**.

- Bukti tersebut harus berada di luar satu snapshot/komponen kegagalan yang dipulihkan; independen berarti mempunyai proteksi dan lifecycle yang mencegah database yang mundur menjadi satu-satunya sumber hak.
- Sumber bukti memuat sequence/version monotonik, tenant/user/scope, aksi grant/revoke/transfer, actor, waktu, referensi approval, dan integritas record minimum; jangan memasukkan password/token.
- Format bukti, penyimpanan, sumber waktu, kunci penandatangan, quorum/approval, provider, mekanisme monotonik, dan biaya **belum dipilih**. Jangan membuat sistem signature, blockchain, atau command deployment sendiri untuk menutup pertanyaan desain ini.
- Sebelum layanan dibuka sesudah restore, bandingkan snapshot dengan bukti perubahan akses pasca-backup. Terapkan revoke/transfer yang terbukti; jangan mengaktifkan grant lama hanya karena baris masih ada.
- Jika bukti independen hilang/diragukan, deny akses untuk scope terdampak dan jalankan recovery identity; jangan menganggap login ulang atau Owner yang pertama masuk sebagai grant baru.
- Pengelola infra menjalankan pemulihan teknis. Review isi klaim/transaksi oleh Owner atau dukungan dengan grant terbatas; tugas backup tidak memberikan hak Admin baca-semua.

### 13.2 Recovery epoch tahan snapshot mundur

- Setiap command mutasi memuat epoch request yang dikeluarkan/diketahui server; server memeriksa epoch sebelum efek, sesuai PRD NFR-11 dan kontrak API mendatang.
- Epoch baru sesudah restore tidak diwariskan dari backup lama. Sumber monotonic epoch dan bukti perubahan epoch berada terpisah dari snapshot DB yang dipulihkan; detail implementasi menunggu ADR.
- Receipt committed yang tetap ada boleh mengembalikan acknowledgement minimal sesuai izin terkini tanpa efek ulang.
- Operation pra-restore yang tidak ditemukan **bukan bukti bahwa ia tidak pernah commit**. Simpan `RESTORE_REVIEW_REQUIRED` secara durable berdasarkan ruang/operation ID.
- Mengganti epoch request, refresh sesi, atau menyalin ulang payload tidak menghapus review atau mengubah payload hash bisnis.
- Setelah verifikasi, lanjutkan dengan ID asal hanya bila terbukti belum posted; bila perlu correction baru, tombstone/receipt ID asal ditaut atomik ke correction agar replay lama tidak menggandakan efek.
- Bila bukti tidak cukup, pertahankan status unresolved dan tunjukkan rentang data/laporan terdampak. Jangan minta user menyerahkan uang lagi semata-mata karena pemulihan mundur.

### 13.3 Runbook pemulihan konseptual

Perintah di bawah adalah **langkah kerja manusia dan checkpoint**, bukan nama CLI vendor atau klaim deployment tertentu. Sebelum pelaksanaan, tulis prosedur spesifik stack yang dipilih dan review aksesnya.

| Tahap | Tindakan konseptual | Bukti/keputusan sebelum lanjut |
|---|---|---|
| 1. Aktifkan incident | Buka incident ID; tunjuk Incident Commander dan operator infra; catat waktu/deteksi, symptom, scope tenant/fitur | Pemilik insiden jelas; jangan mulai mengubah data |
| 2. Hentikan perubahan | Aktifkan maintenance/read-only sesuai kontrol yang tersedia; pause posting/worker/ekspor/file jobs yang dapat mengubah data | Bukti tidak ada write/job baru; ukur dampak terhadap pengguna |
| 3. Pertahankan bukti | Lindungi snapshot, log, receipts, queue, backup manifest, arsip file, bukti grant dan clock/epoch | Hash/version, chain of custody, akses operator tercatat |
| 4. Tentukan titik pulih | Pilih backup + waktu target berdasarkan incident; hitung rentang data yang mungkin hilang | RPO aktual dan unknown range tertulis; persetujuan change/incident lead |
| 5. Pulihkan terisolasi | Pulihkan database dan file ke environment terisolasi menggunakan dokumentasi provider/stack resmi | Aplikasi belum dibuka ke user; kredensial produksi tidak dipakai di fixture |
| 6. Verifikasi integritas | Rekonsiliasi FK/scope, ledger/receipt/tombstone, outbox, revisions, manifest/hash file, snapshot/version schema | Checklist hasil dengan query/alat yang dipilih kemudian; tidak ada perubahan manual tanpa audit |
| 7. Terbitkan epoch baru | Tetapkan epoch yang tidak dapat turun mengikuti snapshot; pertahankan bukti epoch baru secara independen | Dua pihak berwenang bila kebijakan mensyaratkan; nilai lama/baru dan timestamp direkam tanpa secret |
| 8. Pulihkan otorisasi | Bandingkan grant/revoke/ownership/reset terbaru terhadap bukti independen; revoke sesi; blokir scope yang tak dapat dibuktikan | Tidak ada grant lama otomatis aktif; actor validasi dan hasil tercatat |
| 9. Rekonsiliasi operasi | Cari operasi pra-epoch, receipt, status commit/unknown, upload parsial, dan antrean klien; buat `RESTORE_REVIEW_REQUIRED` | Jangan membuat operation ID baru; keputusan satu per satu atau batch yang dapat dibuktikan |
| 10. Uji staging pemulihan | Jalankan tes isolasi tenant, read-only, file, export, worker, satu command satu efek, dan login/reauth | Tidak ada P0/P1 keamanan/integritas; lampiran missing terlihat |
| 11. Setujui layanan kembali | Incident lead + owner operasional menyetujui laporan integritas, RPO/RTO aktual, epoch, grants, dan unresolved cases | Persetujuan dan waktu buka direkam; bila syarat kurang, tetap read-only/terisolasi |
| 12. Tutup dan tindak lanjut | Beri pemberitahuan yang disetujui, selesaikan review klaim, dokumentasikan sebab, pemilik perbaikan, dan drill | Q-11/policy notifikasi dipatuhi; tidak menampilkan detail tenant lain |

**Jangan lakukan:** restore menimpa produksi tanpa snapshot keadaan saat ini; buka semua account dulu lalu cek belakangan; import sebagian tabel secara manual tanpa relasi; set saldo awal untuk menutupi selisih; retry command unknown dengan ID baru; menghapus queue/log karena “mengganggu”; atau mengklaim RPO terpenuhi tanpa bukti.

<a id="secops14"></a>
## 14. Runbook insiden operasional

Semua runbook masih usulan. Severity, owner, kontak, jam dukungan, tenggat, dan kewajiban komunikasi ditetapkan setelah Q-11 serta struktur operasi diputuskan.

| Insiden | Langkah respons minimum | Syarat sebelum ditutup |
|---|---|---|
| Akun diambil alih | Buka incident ID tanpa secret; verifikasi peminta; cabut sesi/grant, tahan aksi berisiko, periksa login/reset/export/receipt dengan akses minimum; reset hanya lewat §6. Untuk HP offline, jelaskan cache tak dapat dihapus seketika. | Unknown financial commands direkonsiliasi; cakupan diketahui dan unknown dilaporkan jujur. |
| HP hilang, lease/kunci gagal | Verifikasi identitas; revoke sesi/device sesuai desain; nilai antrean lokal sebagai risiko hilang/terbuka; jika kembali online, karantina lalu cek actor asal, scope, epoch, version, grant; jangan auto-merge/pindah capture-only. | Tidak membuat transaksi atau saldo pengganti; catatan yang tak pulih dinyatakan hilang/unknown. |
| Dugaan BOLA/IDOR | Batasi endpoint dengan aman; simpan request/scope IDs tersaring; periksa API, list, agregasi, cache, file, job, notifikasi, worker, receipt; tambah tes sintetis lintas tenant dan perbaiki otorisasi server, bukan UI. | Data terdampak dinilai; tes negatif dan review independen §17 lulus. |
| File/export berbahaya atau bocor | Karantina file/job tanpa membuang manifest; cabut akses baru; periksa ACL parent, isi/scan, path, header, log unduh; simpan bukti minimal; jangan buka file pada perangkat operator tanpa lingkungan aman. | Cross-tenant/stale-link regression lulus; file hanya dibuka kembali setelah review. |
| Backup/RPO terancam | Eskalasi ke operator; pertimbangkan READ_ONLY untuk command finansial bila integritas tak dapat dijamin; perbaiki dan verifikasi artefak; jangan hapus arsip lama tanpa impact review. | Gap/RPO aktual atau unknown tercatat; restore drill sukses, bukan hanya status backup hijau. |
| Worker/outbox/upload gagal | Temukan ID dan umur antrean; pause retry jika duplikasi mungkin; periksa receipt, parent, permission, retry dan dependency; retry pakai key yang sama; status file dipisahkan dari transaksi. | Dedupe/rekonsiliasi lulus; jangan hapus item untuk menghilangkan alert. |

<a id="secops15"></a>
## 15. Observabilitas dan operasi rutin

### 15.1 Signal minimum

| Area | Ukur/rekam | Batas privasi |
|---|---|---|
| API | Request ID, latency, error category, endpoint/action, status, versi | Tanpa payload finansial, credential, atau query sensitif |
| Login | jumlah sukses/gagal, rate-limit, revoke/reset event | Jangan logging password, token, username lengkap ke alert publik |
| Otorisasi | penolakan scope, BOLA indicators, actor/scope opaque | Event terukur, jangan bocorkan objek rahasia ke pesan user |
| Sinkronisasi | antrean/outbox tertua, konflik, gagal retry, unknown outcome | Tidak dapat mengukur draft offline yang tidak pernah terkirim |
| Lampiran/ekspor | pending/fail/quarantine, ukuran, worker age, status scan | Jangan tampilkan isi/nama privat/URL akses di log |
| Database | error transaksi, deadlock/lock wait, connection saturation | Query text dibersihkan dari value sensitif |
| Backup/PITR | waktu backup terakhir, arsip WAL/log age, status manifest, hasil restore terakhir | Metadata akses backup terbatas |
| Recovery | current epoch, jumlah `RESTORE_REVIEW_REQUIRED`, status bukti grants | Detail incident dibatasi sesuai peran; jangan sertakan secret |

### 15.2 Tindakan operasional berkala

- Tinjau alert keamanan dan kesehatan job/backup; tetapkan orang penanggung jawab dan jalur eskalasi sebelum pilot.
- Review akun Admin platform, service account, operator backup, dan akses dukungan; cabut hak yang tidak lagi dibutuhkan.
- Pastikan MFA Admin aktif dan recovery-nya teruji sebelum production gate.
- Audit konfigurasi secret expiry/rotation sesuai ADR; jangan mengirim nilai secret melalui chat/ticket.
- Tinjau dependency/security advisories dengan jadwal yang dipilih; emergency patch harus melalui tes kompatibilitas client lokal dan payload antrean.
- Tinjau orphan file/job/cache metadata tanpa purge sebelum Q-11; ukur biaya dan exposure, bukan menghapus berdasarkan asumsi umur.
- Latih restore/runbook dan simpan catatan waktu, owner keputusan, dan tindakan lanjut.
- Uji prosedur READ_ONLY serta cara mengaktifkan kembali status tanpa melewati audit.
- Uji proses ekspor dari akun non-Owner untuk memastikan tidak ada data yang lebih luas daripada grant.
- Lakukan tabletop incident kehilangan Owner, HP offline, unknown transaction, dan bukti grant pasca-restore sebelum pilot.

### 15.3 Alert dan komunikasi

- Threshold latency/error, login abuse, outbox age, konflik, storage, backup age, file scan, dan recovery backlog ditetapkan dari baseline pilot; jangan menyalin angka contoh sebagai SLA.
- Alert hanya mengirim metadata yang perlu, tidak isi transaksi atau URL privat.
- Tentukan escalation owner/on-call, jam dukungan, jalur emergency, komunikasi tenant, dan kebijakan notifikasi insiden sebelum data pelanggan; ini belum diputuskan Q-11.
- Aplikasi harus membedakan error sementara, forbidden, conflict, read-only, upload tertunda, dan restore review agar pengguna tidak membuat transaksi pengganti secara keliru.

<a id="secops16"></a>
## 16. Deployment, perubahan skema, dan rollback

Ini urutan kontrol konseptual, bukan perintah menjalankan provider/CLI.

### 16.1 Sebelum deployment

1. Hubungkan setiap perubahan ke requirement PRD, keputusan yang dibutuhkan, data model, API contract, dan tes.
2. Review threat model perubahan: data/field baru, capability, worker, query agregat, upload, export, cache, epoch, secret, serta efek rollback.
3. Tinjau dependency/security advisory, lisensi, konfigurasi default, dan perubahan transitive yang relevan; tidak menambah library kriptografi/provider sebelum ADR.
4. Uji di environment terpisah memakai data sintetis; secret dan storage produksi tidak boleh dipakai di local/test.
5. Pastikan backup fresh dan restore evidence tersedia untuk perubahan data berisiko; migrasi destruktif ditahan sampai kebijakan retensi/rollback jelas.
6. Persiapkan release note operasional, metrik/alert, feature gate, owner pelaksana, dan langkah stop/rollback.

### 16.2 Rilis perubahan kompatibel

- Gunakan migrasi bertahap: tambah schema/contract yang kompatibel; deploy reader/writer yang aman; migrasikan/verifikasi data; baru hapus bentuk lama setelah versi klien/payload lama tidak lagi diterima dan ADR mendokumentasikan masa transisi.
- Schema DB, payload API, dan schema lokal IndexedDB/queue memiliki versi. Update client tidak membuang draft/antrean yang belum selesai.
- Bila migrasi lokal gagal, tahan operasi terkait/update-required dan pertahankan payload; jangan reset IndexedDB otomatis.
- Jalankan smoke test akses tenant dan command idempotent, lalu pantau error/queue/worker/upload sebelum memperluas rollout.
- Fitur approval/posting tidak diaktifkan hanya karena deploy sukses; gate integritas dan owner approval tetap berlaku.

### 16.3 Rollback bukan restore

- Rollback kode hanya boleh memakai versi yang kompatibel dengan schema/receipt/payload saat ini.
- Jangan rollback skema/database dengan cara menghilangkan transaksi baru atau receipt yang melindungi idempotensi.
- Jika migrasi sudah menghasilkan data yang versi lama tidak dapat baca, gunakan fix-forward terkontrol atau runbook pemulihan; jangan paksa kode lama ke database tanpa bukti kompatibilitas.
- Restore database mengaktifkan prosedur §13 (epoch, grant evidence, receipt review, session revoke), bukan tombol rollback aplikasi.
- Update frontend/service worker harus menjaga antrean dan membatasi respons authenticated cache antar user; lakukan uji logout, perpindahan akun, upgrade, downgrade yang didukung, dan migrasi gagal.
- Hentikan rollout bila muncul kebocoran lintas tenant, posting ganda, kerusakan antrean, atau unknown financial outcome; catat incident sebelum memperbaiki.

<a id="secops17"></a>
## 17. Gate readiness dan bukti pengujian

Daftar ini adalah gate perencanaan. Nama ID berasal dari PRD/UX; tabel tidak menyatakan tes sudah berjalan atau lulus. Rencana tes rinci disusun di [TEST_PLAN.md](TEST_PLAN.md) dan kontrak API di [API_SYNC_SPEC.md](API_SYNC_SPEC.md).

| Gate | Requirement sumber | Bukti minimum sebelum dianggap lulus |
|---|---|---|
| Isolasi tenant dan capability | PRD SEC-01–SEC-05, SEC-09; MOD-06; Q-03 | Tes negatif A/B untuk list/detail/create/update/delete/agregasi, multi-membership, field, cache, search, export, file, worker, dan receipt; tidak ada Admin read-all |
| Grant/assignment dan pencabutan | SEC-13–SEC-16; OFF-06; Q-02/Q-03 | Uji multi-ABK, reset ABK tenant-local, username collision tanpa bocor, assignment version, revoke saat offline, antrean tetap actor asal |
| Sesi/kredensial/MFA | SEC-06–SEC-08; Q-02/Q-10 | Rate-limit, hash policy review, cookie/CSRF atau token threat review, XSS/session fixation, revoke, reset, reauth/step-up, MFA Admin dan pemulihan faktor |
| Field-level privacy | SEC-04/05/12; REP-19; Q-11 | Snapshot response dan ekspor sintetis menunjukkan invoice, keuangan rekan, private finance, secret, dan lampiran rahasia tidak dikirim ke role yang salah |
| DAILY dan transaksi | FIN-01–FIN-13; OFF-04/07/18; MOD-07 | Dua user/device dengan version sama menghasilkan conflict, satu versi efektif; tidak double-post pada timeout/commit+response hilang |
| Offline/lease/capture-only | OFF-01–OFF-18; NFR-04; UT-31; Q-06 | Login awal online, partition cache, storage full, restart/upgrade, lease expiry, logout/reset, clock change, provenance immutable, konversi sekali ke tenant asal; tidak auto-post |
| Lampiran dan ekspor | SEC-01/09/10/12; OFF-15; REP-19; Q-11 | File parser/size/MIME, storage privat, stale URL, cross-tenant access, scan/quarantine, partial upload, export job revoke, masa akses, dan tidak bocor lewat log |
| READ_ONLY dan limit | PRD §7.2; Q-10/Q-11 | Mutasi bisnis baru ditolak konsisten termasuk worker/offline; baca/ekspor berhak, operasi keamanan sesi dan pemulihan status oleh Admin tetap melalui jalur sempit terotorisasi §10; ARCHIVED mengikuti kebijakan arsip tersendiri |
| Backup/PITR/restore | NFR-06/NFR-11; SEC-10; Q-10/Q-11 | Restore terisolasi dengan receipts/outbox/audit/revisions/tombstones/file manifest; RPO/RTO aktual terukur; snapshot lama tidak mengaktifkan grant/revoke yang salah |
| Grant evidence + epoch | NFR-11; SEC-13/14; ARCH §11.4 | Revoke/transfer pasca-snapshot dipulihkan dari bukti independen; epoch baru tidak dapat mundur; old operation unknown masuk review durable |
| Observabilitas/privasi | NFR-08; SEC-08/12; Q-11 | Log/alert dipindai otomatis dan manual untuk secret, private fields, signed URL, isi nota; metric queue/backup/job/recovery teruji |
| Operasi/restart/rollback | NFR-10; ARCH §11.3 | API/worker restart, retry aman, schema expand/contract, client queue upgrade, rollback kompatibilitas dan incident-stop drill |
| Readiness pilot | PRD §29–§31; Q-02/Q-03/Q-06/Q-10/Q-11 | Q blocking ditutup pemilik keputusan, seluruh bukti teknis R1 dan baseline tersedia, tidak ada P0/P1 otorisasi/integritas, runbook dilatih, MFA Admin dan dukungan/retensi/privacy siap; hasil lapangan AC-86 tetap PENDING PILOT, mengikuti tiga gerbang TEST_PLAN §9 |

### 17.1 Checklist per skenario keamanan

Untuk setiap tes, tulis actor, tenant/scope, status grant, input, hasil HTTP/domain, response fields, perubahan ledger/receipt/audit, log/alert, dan apa yang tetap tersimpan lokal. Jangan cukup menguji tombol atau respons 403.

- Owner A tidak dapat melihat/mengubah resource Owner B walau ID benar dan tenant ID dikirim eksplisit.
- ABK A tidak dapat membaca invoice, kas, gaji, kasbon, atau claim ABK B; hanya recording bersama/scope yang sah.
- Admin dapat mengatur layanan tanpa query bisnis; audit administratif tidak memperluas read permission.
- PPL/Mandor nonaktif pada R1; bila diuji di masa depan, grant tenant/kandang dan whitelist tetap eksplisit.
- URL lampiran/export/job tenant lain atau scope dicabut tidak membuka data; READ_ONLY tidak mencabut baca/ekspor yang masih berhak. ARCHIVED tidak otomatis memperoleh hak READ_ONLY; kebijakan arsip yang belum diputuskan tidak boleh ditebak.
- Retry key sama dengan payload sama memberi satu hasil; payload berbeda ditolak; receipt tidak memberi detail setelah akses dicabut.
- Sesudah backup mundur, hak yang berubah pasca-snapshot diverifikasi lagi; command unknown tidak diulang otomatis.
- Storage lokal penuh, browser eviction, logout dan ganti user tidak menampilkan “tersimpan” palsu atau mengirim antrean ke user berikutnya.
- Capture-only tanpa bukti registrasi atau tanpa grant tenant asal tetap recovery-only.
- Semua test data, fixture, file, dan screenshot memakai bahan sintetis, bukan lampiran bisnis privat.

<a id="secops18"></a>
## 18. Keputusan terbuka dan pemilik keputusan

Keputusan di bawah adalah milik pengguna/pemilik kebijakan, bukan agent atau implementer. Default aman memperkecil risiko sementara; default tidak menutup pertanyaan.

| PRD Q | Keputusan yang belum final | Batas aman sampai diputuskan | Gate |
|---|---|---|---|
| Q-02 | Pemulihan Owner tanpa email, bukti kewenangan, metode/kode recovery, masa kredensial sementara, dan bantuan | Username saja tidak cukup; tidak ada reset Owner melalui menu ABK; bila kewenangan meragukan, tahan akses/transfer | Sebelum akun Owner operasional dan recovery pilot |
| Q-03 | Bantuan saat Owner tak tersedia; delegasi dan klaim/transaksi khusus | Owner-only online approval/posting tetap default; tidak memberi Mandor hak finansial otomatis | Sebelum delegasi/auto-post atau proses bantuan mengubah transaksi |
| Q-06 | Perangkat pilot, local unlock, capture-only, lease, reset/logout dan antrean | 72 jam hanya hipotesis; capture-only tidak membuka cache dan tidak menjadi posting | Sebelum offline pilot/capture-only diaktifkan |
| Q-10 | Stack, hosting, biaya, detail password/session/MFA, backup/PITR dan target | Jangan pilih provider/library/crypto parameter di sini; target NFR bukan SLA; gunakan ADR | Sebelum infrastruktur produksi |
| Q-11 | Retensi, privasi/legal, penghapusan, dukungan, backup, ekspor, komunikasi insiden | Tidak purge otomatis; tidak mengklaim compliance; dukungan tak baca tenant tanpa prosedur terverifikasi | Wajib sebelum data pelanggan produksi |

Pertanyaan keamanan tambahan yang harus dijawab dalam ADR/operational policy tanpa mengubah Q bisnis: siapa incident commander, siapa dapat menyetujui break-glass, apakah perlu dua pihak, bagaimana bukti audit dilindungi dari operator, interval restore drill, waktu expiry URL/job, alur MFA reset, serta batas sesi online.

### 18.1 Hal yang sengaja tidak dipilih di dokumen ini

- Cloud/region/hosting, database, object storage, secret manager, email/SMS/push provider, atau deployment platform.
- Library/framework autentikasi/password hashing/MFA/CSRF, parameter algoritme dan key, format signed registration, enkripsi lokal, atau hardware keystore.
- Masa sesi idle/absolute, angka rate limit, durasi reset token, TTL URL, batas attachment final, retensi log/backup/audit, dan severity/SLA.
- Implementasi pemulihan identity proof, notifikasi tanpa email, kebijakan legal/privacy, dan akses dukungan break-glass.

Pilih dan dokumentasikan hanya sesudah kebutuhan bisnis, versi provider, biaya, mekanisme backup/restore, threat model, dan operasional diuji. Jangan menyimpulkan pemilihan karena satu opsi disebut dalam referensi.

<a id="secops19"></a>
## 19. Rujukan teknis

Sumber publik di bawah membantu menjelaskan pedoman/karakteristik teknologi. Sumber ini bukan persetujuan produk, vendor, parameter kripto, kepatuhan hukum, atau bukti implementasi aman. Tanggal pemeriksaan: 23 September 2026.

| Referensi resmi | Relevansi dan batas penggunaan |
|---|---|
| [NIST SP 800-63B-4 — Authenticator and Verifier Requirements](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/) | Persyaratan password, authenticator, session/recovery yang relevan saat kebijakan login diputuskan; pilih persyaratan sesuai tingkat risiko, bukan salin mekanisme tanpa threat model. |
| [NIST SP 800-63B-4 — Strength of Passwords](https://pages.nist.gov/800-63-4/sp800-63b/passwords/) | Menjelaskan pengukuran kekuatan/password panjang, limit serangan online dan dampak composition rule; tidak menetapkan parameter library aplikasi ini. |
| [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | Lifecycle dan perlindungan session ID; sesi harus diperlakukan sebagai bearer secret dan memiliki revoke/rotation. |
| [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | Pertimbangan autentikasi, error, reauth, serta pencegahan serangan login; tidak memilih provider. |
| [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) | Faktor harus independen; proses reset/recovery MFA sendiri perlu diamankan. |
| [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) | Prinsip password hashing adaptif dan penggunaan konfigurasi/library terpelihara; implementer tetap perlu ADR dan review versi terkini. |
| [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | Bedakan authentication dari authorization dan uji access control pada setiap operasi/objek. |
| [OWASP Multi Tenant Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) | Tenant context harus diverifikasi terhadap identity; opaque ID bukan izin; isolasi cache/job/storage juga penting. |
| [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | Allow-list, pemeriksaan isi, nama server, batas ukuran, storage privat/terpisah, malware check bila tersedia. |
| [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | Logging security/operasi harus dirancang bersama minimisasi data; audit, transaction log, dan debug log memiliki tujuan berbeda. |
| [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) | Mulai dari threat model, minimisasi data, dan key management; bukan alasan menambah enkripsi tanpa lifecycle kunci. |
| [PostgreSQL 18 — Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) | RLS adalah kontrol tambahan; table owner, superuser, dan `BYPASSRLS` dapat melewati aturan sehingga role/koneksi perlu ditinjau. Referensi hanya relevan bila PostgreSQL dipilih. |
| [PostgreSQL 18 — Continuous Archiving and PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) | PITR menggabungkan base backup dan WAL; pg_dump bukan backup untuk replay WAL. Teknik/vendor masih belum dipilih. |
| [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | Quota/eviction browser berbeda; storage web best-effort dapat dihapus dan persistent storage tidak dijamin. |
| [MDN — StorageManager.persist()](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist) | Permintaan persistent storage dapat ditolak browser; bukan backup atau jaminan data tidak hilang. |
| [MDN — IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) | IndexedDB menyimpan data terstruktur di origin browser; tidak menghilangkan ancaman same-origin script, eviction, perangkat, atau migrasi. |

### 19.1 Referensi internal

- [PRD §3](PRD.md#s03), §6–§7, §9, §22–§27, dan [§31](PRD.md#s31): status K/D/Q, role/field ACL, reset, transaksi/audit, offline, kontrak, NFR, restore, serta gate keputusan.
- [ARCHITECTURE §3](ARCHITECTURE.md#arch03), §8–§11, dan §14–§15: batas trust, lease/offline, isolasi, attachment/export, operasi dan bukti yang direncanakan.
- [UX/UI §15.2](UX_UI_SPEC.md#ux15): expiry lease, cache, capture-only, risiko storage, perubahan mode dan reconnect.
- [PLANNING.md](PLANNING.md): fase aktif hanya Markdown dan status dokumen bukan persetujuan.
- [DATA_MODEL.md](DATA_MODEL.md), [API_SYNC_SPEC.md](API_SYNC_SPEC.md), [TEST_PLAN.md](TEST_PLAN.md), dan [Implementation Plan.md](Implementation%20Plan.md): dokumen teknis pendamping untuk ditautkan setelah ditinjau; rujukan tidak mengesahkan isi atau menutup Q.

### 19.2 Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Rancangan keamanan/operasi: capability dan field ACL, akun/recovery, sesi/MFA, threat model perangkat, capture-only provenance, logging, lampiran/ekspor, READ_ONLY, retensi terbuka, backup/PITR, grant evidence/epoch, incident runbooks, deployment gates, dan rujukan publik. |
