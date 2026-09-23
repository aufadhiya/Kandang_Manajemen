# Spesifikasi Kontrak API dan Sinkronisasi

| Metadata | Nilai |
|---|---|
| Versi | 0.3 (usulan untuk ditinjau) |
| Tanggal | 23 September 2026 |
| Status | Kontrak logis; belum disetujui, belum diimplementasikan, dan belum diuji terhadap aplikasi |
| Sumber utama | [PRD.md](PRD.md), terutama §6–§10, §13, §16, §20, §22, §24–§29; [ARCHITECTURE.md](ARCHITECTURE.md), terutama §5–§11 |
| Cakupan | Operasi R1, API baca, command, receipt, antrean offline, file, ekspor, dan recovery |
| Stack / URL | Belum dipilih. Nama operasi dan contoh route di sini adalah usulan, bukan komitmen REST, database, framework, atau provider tertentu. |

> **Petunjuk untuk implementer mendatang:** perlakukan dokumen ini sebagai kontrak yang perlu dibandingkan dengan PRD dan DATA_MODEL.md terbaru sebelum coding. Jangan menebak hak bisnis, membuat operasi di luar registry, atau menafsirkan respons HTTP sebagai bukti uang berpindah.

<a id="api01"></a>
## 1. Tujuan, batas, dan sumber kebenaran

Dokumen ini menetapkan bentuk pesan dan perilaku layanan. Ia tidak mengganti definisi kas, biaya, gaji, siklus, settlement, izin, atau kriteria penerimaan pada [PRD](PRD.md).

- PRD adalah sumber aturan bisnis dan batas rilis. Arsitektur adalah sumber pembagian tanggung jawab layanan. Dokumen ini menerjemahkan keduanya menjadi kontrak API yang dapat diuji.
- Seluruh operasi adalah **usulan**, bukan endpoint berjalan atau persetujuan bisnis baru. URL, format transport, teknologi, batas ukuran, dan algoritme penyimpanan final menunggu keputusan proyek.
- R1 memakai operasi untuk Admin, Owner, dan ABK. Grant Mandor/PPL, buku pribadi Owner, stok terperinci, penggunaan barang, panen rinci, kontrak hitung otomatis, estimasi, IoT, dan CCTV bukan dependensi R1.
- Pembelian adalah catatan barang atau jasa operasional yang umum. Jangan membatasi daftar belanja pada gas, jangan mewajibkan SKU, stok awal, kontrak, atau pelacakan pemakaian.
- API tidak membuat antrean persetujuan mandiri Owner. Owner yang berwenang boleh mencatat, meninjau, menyetujui, dan membukukan dokumen sendiri dalam satu command online yang atomik.
- Nama scope `tenant_id`, `farm_id`, `cycle_id`, `business_date`, dan field snake_case mengikuti istilah PRD serta kamus [DATA_MODEL.md](DATA_MODEL.md) yang kini tersedia. Entitas pada DATA_MODEL tetap usulan logis, bukan tabel/DDL yang sudah disetujui.
- Nama command adalah niat API, dipetakan ke aggregate usulan DATA_MODEL: akun → `app_user`/`tenant_membership`; grant login → `farm_grant`; assignment kerja → `employee_farm_assignment`; pekerja → `employee`; kategori bisnis → `business_category`; pihak → `counterparty`/`counterparty_role`; mode/cutoff → `cycle_recording_revision`; penerimaan → `operational_receipt`; purchase → `purchase_document`/`purchase_line`; purchase claim terminal → `cash_claim`/`claim_resolution` (FIN-11 saja); claim tunai OFF-16 → `cash_claim`/`cash_event_claim_link`; cash transfer → `cash_transfer`/`cash_movement`; opening → `opening_batch`/`opening_position`; biaya → `financial_source_event`/`cost_entry`/`cost_allocation_plan`; kasbon pekerja → `employee_advance`; uang muka supplier → `supplier_advance`/`SUPPLIER_ADVANCE_RECEIVABLE`/`obligation_application`; upah pekerjaan → `work_compensation`; modal/prive/pinjaman Owner → `owner_funding_event`; settlement → `partner_settlement_version`/`settlement_component`/`partner_payout_notice`/`partner_payout`; DAILY → `daily_recording`/`daily_recording_revision`; file → `attachment`/`attachment_link`; capture-only → `capture_note_conversion`; recovery → `restore_review_case`/`replay_tombstone`.
- Command adalah niat API, bukan nama tabel. Field command memakai konsep bisnis snake_case; bila kamus DATA_MODEL memakai nama FK kanonis (contoh `employee_id`, `funding_kind`, `purchase_class`), selaraskan schema API dengannya sebelum coding dan jangan membuat aggregate duplikat.
- Jika API dan layar berbeda, server tetap menentukan actor, grant, saldo, status, scope, posting, dan hasil akhir. Form atau preview client bukan otorisasi ataupun posting.

Peta rujukan: [hak akses dan recovery PRD §6](PRD.md#s06), [siklus §8](PRD.md#s08), [transaksi dan receipt §9](PRD.md#s09), [kas dan pembelian §10](PRD.md#s10), [biaya §11](PRD.md#s11), [gaji §13](PRD.md#s13), [recording §16](PRD.md#s16), [settlement §20](PRD.md#s20), [offline §22](PRD.md#s22), [ekspor §24](PRD.md#s24), [kontrak layanan §25](PRD.md#s25), [recovery §27](PRD.md#s27), dan [golden tests §28](PRD.md#s28).

<a id="api02"></a>
## 2. Bentuk operasi dan jalur transport

Kontrak memisahkan **command** (minta perubahan), **query** (baca projection berizin), **receipt** (bukti hasil satu operation ID), dan **file/job** (aliran biner atau kerja latar). Satu command mewakili satu perubahan bisnis yang efeknya harus berhasil bersama atau tidak sama sekali.

Nama route berikut hanya contoh konseptual:

| Tujuan | Contoh route usulan | Makna |
|---|---|---|
| Kirim satu command online | `POST /commands` | Satu command dan satu `operation_id`; respons command bukan sekadar respons transport. |
| Kirim batch antrean offline | `POST /sync/batches` | Mengirim daftar operasi yang telah dibekukan; hasil tetap per operasi. |
| Periksa receipt milik sendiri | `GET /operations/{operation_id}/receipt` | Jalur baca sempit; tidak melakukan mutasi atau memberi detail bisnis di luar hak terkini. |
| Login/reset/ganti kredensial | Endpoint auth terpisah, nama belum ditentukan | Password/secret tidak dikirim sebagai command bisnis dan tidak muncul di receipt/hash/audit. |
| Baca query terdaftar | `POST /queries/{query_id}` | Query whitelist dengan filter, cursor, dan projection sesuai izin. |
| Minta sesi unggah/unduh privat | `POST /files/upload-intents`, `POST /files/{file_id}/complete`, `GET /files/{file_id}/download` | Metadata dan izin diproses API; byte file lewat gateway privat. |
| Minta ekspor | `POST /exports` lalu query status job | Penerimaan job tidak berarti file selesai atau boleh diunduh. |

Path, metode HTTP, representasi session, serialisasi, dan status HTTP final dipilih pada rancangan implementasi. Implementasi apa pun harus mempertahankan semantik pada dokumen ini.

**Aturan transport:**

1. Gunakan transport terenkripsi dan sesi tervalidasi; detail perlindungan sesi ditetapkan di `SECURITY_OPERATIONS.md`.
2. Pisahkan header autentikasi dari payload command. Token, cookie, password, dan secret tidak pernah masuk payload, log bisnis, audit yang dapat diekspor, atau hash bisnis.
3. Respons menyatakan hasil domain secara eksplisit. Kode HTTP 2xx hanya berarti request dapat dibaca/diproses sesuai respons; tidak otomatis berarti dokumen disetujui, uang dibayar, atau file tersedia.
4. Gunakan endpoint command yang sama dari web dan Android. Tidak ada client yang menulis langsung ke database, object storage publik, atau proyeksi saldo.
5. Batas pagination, ukuran batch, lampiran, dan timeout perlu diatur dalam konfigurasi terversi; melampaui batas menghasilkan error terstruktur, bukan memotong daftar diam-diam.

<a id="api03"></a>
## 3. Tipe, angka, waktu, dan null

Semua contoh berikut adalah **format logis**, bukan JSON Schema final. Tipe konseptual harus dijadikan schema terversi dan divalidasi server sebelum efek apa pun.

| Tipe API | Bentuk kanonis | Aturan |
|---|---|---|
| `id` | UUID sebagai string lowercase | Stabil, opaque, tidak berisi nama atau nomor dokumen bisnis. |
| `version` | Integer tak bertanda sebagai string desimal | Nomor urut optimistik; bukan timestamp. Jangan dikirim sebagai float. |
| `amount_idr` | Integer rupiah sebagai string desimal tanpa tanda pemisah | Nilai transaksi rupiah bulat; uang masuk/keluar positif. Hasil settlement bertanda memakai tipe terpisah. Tolak pecahan rupiah. |
| `signed_amount_idr` | Integer rupiah bertanda sebagai string desimal | Khusus saldo bersih yang dapat negatif; jangan gunakan sebagai nilai pembayaran. |
| `decimal_quantity` | String desimal bertitik tanpa pemisah ribuan | Presisi maksimal mengikuti satuan/PRD (umumnya 6 angka pecahan); tanpa IEEE float; selalu sertakan unit. |
| `integer_count` | Integer JSON aman atau string integer tervalidasi | Untuk ekor, sampel, tabung fisik, dan hitungan; batas ≥0 kecuali aturan sumber menyatakan lain. |
| `date` | `YYYY-MM-DD` | Tanggal bisnis, bukan timestamp; interpretasikan dengan timezone IANA scope kandang. |
| `instant` | Timestamp ISO 8601 UTC berakhiran `Z` | Waktu absolut; pisahkan waktu kejadian, waktu perangkat, diterima server, dan posting. |
| `timezone` | Nama zona IANA, mis. `Asia/Jakarta` | Snapshot konteks operasional; jangan menganggap semua tenant selalu WIB. |
| `enum` | Nilai eksplisit dari registry | Nilai tak dikenal ditolak, bukan fallback ke default yang mengubah arti. |
| `null` | JSON `null` | Nilai tidak diketahui/belum diisi; berbeda dari angka `0` yang dikonfirmasi. Field absent hanya untuk field opsional di schema. |

- Input nominal UI Indonesia (contoh `1.000.000`) diurai/divalidasi di batas client; wire memakai digit tanpa pemisah (`"1000000"`). Jangan menerima lokal string sebagai nominal API.
- Payload tidak memakai angka floating point untuk uang, kuantitas, tarif, atau persentase. Rate/kuantitas adalah decimal string dengan satuan dan rentang eksplisit.
- Mata uang R1 adalah IDR. `currency_code` boleh dicantumkan sebagai `IDR`; currency lain ditolak, bukan dikonversi memakai kurs default.
- Data finansial memiliki tanggal kejadian/pengakuan, tanggal pembayaran, dan alokasi periode yang berbeda. Tanggal upload bukan pengganti tanggal kejadian.
- API tidak mengisi unknown menjadi nol, menurunkan satuan dari nama barang, atau mengubah tanggal karena jam perangkat berbeda. Validasi memberi field dan sebab spesifik.

**Enum awal yang tertutup:**

- `farm_grant.capability_set[]`: `FARM_CONTEXT_READ`, `DAILY_RECORD_WRITE`, `PURCHASE_CLAIM_SUBMIT`, `CASH_EVENT_CLAIM_SUBMIT`, `WAGE_CLAIM_SUBMIT`. Tidak ada capability approve/post finansial bagi ABK.
- `metric` pada cutoff: `FEED_USED`, `MORTALITY_COUNT`, `CULL_COUNT`, `SAMPLE_WEIGHT_KG`. Daily sampling tetap point-in-time, bukan hitungan harian kumulatif.
- `known_dispositions.kind`: `MORTALITY`, `CULL`, `HARVEST`, `OTHER_KNOWN`; kuantitas akhir yang tak diketahui tetap kosong.
- `cash_reconciliation.adjustment_classification`: `CASH_VARIANCE`, `OTHER_APPROVED`; Owner tetap perlu memilih/menjelaskan adjustment, bukan menghitung expense otomatis.
- `settlement_component.net_sign`: `INCREASE_NET_RIGHT`, `DECREASE_NET_RIGHT`, `NON_INCOME_RECLASS`. `accounting_class` mengikuti daftar finite `INCOME`, `EXPENSE`, `OWNER_ASSET`, `LIABILITY`, `PRINCIPAL`, `OTHER_PENDING` dari DATA_MODEL.
- Attachment `parent_kind` hanya `FINANCIAL_SOURCE_EVENT`, `CYCLE`, `DAILY_RECORDING_REVISION`, `OPERATIONAL_RECEIPT`, `PARTNER_SETTLEMENT_VERSION`, atau `CASH_CLAIM`, dipetakan server ke typed parent reference.
- Enum yang nilainya belum ada di sumber (mis. kelas kategori usaha atau status detail pihak) harus berasal dari registry server yang disetujui. Tidak boleh menerima arbitrary string atau custom class dari client; selesaikan sebelum schema API dianggap final.

<a id="api04"></a>
## 4. Envelope command kanonis

Setiap mutation memakai satu envelope. `actor_user_id`, role, approval pemilik, tanggal server, saldo, dan efek ledger **tidak** diterima dari client sebagai fakta otoritatif.

```json
{
  "protocol_version": "1",
  "operation_id": "uuid-stabil-untuk-command-ini",
  "command_type": "daily_summary.save",
  "tenant_id": "uuid-tenant",
  "scope": {"farm_id": "uuid-kandang", "cycle_id": "uuid-periode"},
  "origin_recovery_epoch": "epoch-dari-manifest-server-saat-dibuat",
  "expected_versions": [
    {"target_type": "daily_recording", "target_id": "uuid-ringkasan", "version": "4"}
  ],
  "client_provenance": {
    "device_id": "uuid-perangkat-terdaftar",
    "created_at_device": "2026-09-23T04:30:00Z",
    "local_schema_version": "1"
  },
  "payload": {"business_date": "2026-09-23"}
}
```

**Field dan batasnya:**

- `protocol_version`: versi schema/protokol. Versi yang tak kompatibel ditolak; antrean lokal dipertahankan untuk migrasi/tindakan aman.
- `operation_id`: unik per niat mutasi. Retry identik memakai ID sama. Koreksi/niat baru memakai ID baru dengan hubungan `supersedes`/correction.
- `command_type`: hanya satu nilai pada registry [§17](#api17); tidak menerima nama handler atau SQL bebas.
- `tenant_id` dan `scope`: permintaan scope, bukan bukti grant. Server memverifikasi relasi, actor, status tenant dan permission untuk masing-masing command.
- `origin_recovery_epoch`: provenance immutable yang diterbitkan server pada sesi/manifest asal. Simpan bersama antrean; jangan ganti saat reauth, retry, migrasi, atau restore.
- `request_recovery_epoch`: **bukan** field bisnis envelope ini. Setiap request online/batch membawa epoch server terkini di metadata transport/session. Ia boleh berubah antar-retry setelah pemulihan, diperiksa sebelum mutasi, dan tidak mengubah operation ID/hash.
- `expected_versions`: versi yang client baca untuk sumber mutable prasyarat. Target unik dan urut kanonis. Buat baru boleh tanpa versi target; operasi atas saldo, summary, status, atau sumber ada wajib membawa versi sesuai registry.
- Nama `expected_*_version` yang ditampilkan sebagai input minimum pada registry adalah cara singkat menyatakan versi prasyarat. Di wire, kirim satu kali sebagai target entry dalam `expected_versions[]` pada envelope, bukan duplikasi field bisnis di `payload`. Untuk operasi yang belum punya object ID (mis. penambahan assignment/cycle), target adalah parent/scope yang sedang dikunci seperti farm, account, atau user. Implementer wajib mengirim semua target yang mengamankan invariant transaksi, bukan hanya satu versi nyaman.
- `client_provenance`: device/waktu pembuatan untuk audit; bukan actor, waktu posting, atau izin. Field tambahan dibatasi allowlist. OFF-17 menambah `origin_registration_id` immutable.
- `payload`: hanya field yang terdaftar untuk `command_type`. Unknown field ditolak.
- `occurred_at`/`business_date` ditetapkan dalam payload jika diperlukan; tidak disimpulkan dari waktu request.
- Aktor berasal dari sesi server. Jika pihak yang dilaporkan berbeda dari pencatat, gunakan field `reported_party`; ia tidak mengubah identitas actor/auditor.

<a id="api05"></a>
## 5. Hash payload, receipt, dan idempotensi

Receipt adalah bukti durable hasil command. Receipt, seluruh efek bisnis, audit, dan outbox yang diwajibkan ditulis dalam transaksi database yang sama.

**Hash bisnis kanonis yang diusulkan:**

1. Setelah validasi/schema normalization, hash mencakup `protocol_version`, `command_type`, `tenant_id`, `scope`, `expected_versions`, payload bisnis, dan referensi sumber immutable.
2. Map/key diserialisasi terurut; teks Unicode dinormalisasi konsisten; decimal tetap canonical string; `null` dipertahankan; array berurutan hanya bila makna bisnisnya berurutan. Daftar tak berurutan dinormalisasi oleh kontrak field.
3. Algoritme hash dan versi canonicalizer diputuskan melalui ADR. Perubahan canonicalizer bukan alasan menerima efek kedua.
4. Hash **tidak** mencakup header auth, token/cookie/session/password, actor dari sesi, retry count, request timestamp server, `request_recovery_epoch`, atau transport. `origin_recovery_epoch` disimpan sebagai provenance immutable, bukan data bisnis yang dapat diedit.
5. `operation_id` adalah kunci deduplikasi, bukan konten hash. Kunci receipt minimum `(data_space, command_type, operation_id)` sesuai FIN-12; `data_space` ditentukan server.

| Keadaan receipt | Retry dengan hash sama | Retry dengan hash berbeda |
|---|---|---|
| `COMMITTED`, detail boleh dibaca | Kembalikan hasil sama; jangan ulang efek. | `IDEMPOTENCY_PAYLOAD_MISMATCH`; tanpa efek. |
| `COMMITTED`, actor terautentikasi tetapi tak lagi berhak melihat object | `COMMITTED_NO_DETAIL`; tanpa detail sensitif. | Mismatch; tanpa detail. |
| Gagal terminal dengan receipt terminal | Kembalikan kegagalan lama. | Mismatch; koreksi pakai ID baru. |
| Transaksi belum commit/receipt belum ada sebelum claim | Validasi dan jalankan sekali setelah gate normal. | Mismatch jika key sudah diklaim; jika belum, tidak mengubah operasi yang sudah tersimpan lokal. |
| Timeout/koneksi/storage biasa di luar insiden restore | `OUTCOME_UNKNOWN`; jangan buat ID baru. | Retry command dengan ID/hash yang sama **boleh dilakukan langsung** melalui gate mutasi normal; receipt lookup boleh dipakai lebih dulu, tetapi bukan prasyarat dan bukan incident review. Efek maksimum satu. |
| Restore/rewind yang membuat receipt atau ledger tak dapat dipercaya | `RESTORE_REVIEW_REQUIRED`; jangan simpulkan commit/tidak commit. | Tahan command sampai bukti/resolver recovery; jangan buat ID baru atau replay otomatis. |

Receipt ID/hash/status/reference dipertahankan setidaknya selama data sumber finansial/produksi. Detail response dapat dipangkas sesuai retensi, tetapi tombstone/dedupe tetap mencegah replay.

<a id="api06"></a>
## 6. Autentikasi, otorisasi, dan scope

- Server membentuk actor hanya dari sesi autentikasi. Username, tenant, grant, role, atau `created_by` pada body tidak mengganti actor.
- Login R1 memakai username/password; email tidak wajib dan bukan bukti tenant/grant. Reset/recovery mengikuti prosedur identitas di `SECURITY_OPERATIONS.md`, bukan command bisnis atau enumerasi username.
- Setiap command/query/file/export/job memeriksa **user + tenant + kandang/scope + aksi + field**. Otorisasi diulang saat sinkron; grant cache saat draft dibuat bukan izin terkini.
- Admin platform hanya mengelola aktivasi/limit dan alur administrasi yang diizinkan; tidak mendapat API read-all, invoice, settlement, private finance, atau impersonation.
- Owner berwenang dalam tenant sendiri. ABK hanya assignment/scope aktif; keuangan/gaji/kasbon ABK lain tidak dikirim. Setiap ABK pakai identitas sendiri.
- Recording `DAILY` adalah data kandang bersama bagi Owner dan ABK yang ditugaskan. Actor pencatat/korektor tersimpan; field keuangan pribadi rekan tidak dikirim.
- Grant dicabut, akun nonaktif, tenant `READ_ONLY`, sesi dicabut, atau periode locked dapat menolak mutasi. Antrean tertolak tidak dibuang atau dialihkan ke user lain.
- Private finance Owner R2 tidak tersedia melalui scope usaha R1. ID object tenant lain gagal tanpa mengungkap keberadaan.
- Pengecualian receipt-status sempit dibahas di [§8](#api08): hanya actor asal yang masih autentik dapat mengetahui minimal apakah operasinya sendiri commit.
- Pada tenant `ARCHIVED`, akses bisnis dan ekspor ditahan sampai kebijakan retensi/akses Q-11 disetujui serta dikonfigurasi. Arsip tidak otomatis menghapus atau membuka data.

<a id="api07"></a>
## 7. Respons command dan taksonomi hasil

Respons menyatakan keadaan authoritative, bukan boolean `success`. Bentuk logis:

```json
{
  "operation_id": "uuid",
  "outcome": "COMMITTED",
  "receipt_status": "COMMITTED",
  "object_ref": {"type": "purchase", "id": "uuid"},
  "object_version": "7",
  "business_status": "POSTED",
  "effects": [{"effect_type": "expense_recognition", "id": "uuid"}],
  "server_received_at": "2026-09-23T04:32:00Z",
  "server_committed_at": "2026-09-23T04:32:01Z",
  "warnings": []
}
```

Object, efek, nominal, pihak, dan detail hanya dikirim jika actor masih berhak membacanya.

| Status transport/receipt | Makna wajib |
|---|---|
| `RECEIVED` | Request diterima; belum membuktikan dokumen submitted atau efek ledger committed. |
| `PROCESSING` | Request/job non-ledger diproses. Command ledger sinkron tidak boleh menyimpan status ini permanen dalam transaksi terpisah. |
| `COMMITTED` | Database mengesahkan command dan efek atomiknya. Belum tentu uang diterima bila command bukan konfirmasi pembayaran. |
| `COMMITTED_NO_DETAIL` | Commit diketahui tetapi detail objek disembunyikan oleh izin terbaru. Jangan retry. |
| `TERMINAL_REJECTED` | Validasi/domain menolak terminal dan receipt penolakan disimpan; koreksi pakai ID baru. |
| `NOT_ACCEPTED` | Ditolak sebelum command diklaim/receipt dibuat; command lama mungkin sudah ada dan harus dicek receipt. |
| `OUTCOME_UNKNOWN` | Client tak dapat tahu apakah server menerima/commit; pertahankan ID/hash, cek receipt. |
| `RESTORE_REVIEW_REQUIRED` | Command terkait epoch sebelum restore; tahan efek sampai review recovery. |

Status bisnis—contoh `DRAFT`, `SUBMITTED`, `APPROVED`, `NEEDS_CORRECTION`, `REJECTED`, `POSTED`, `UNPAID`, `PARTIAL`, `PAID`, `PENDING`, `COMPLETE`, `LOCKED`—berbeda dari antrean jaringan. `SUBMITTED` bukan `POSTED`; `POSTED` bukan `PAID`; notice bukan pembayaran.

<a id="api08"></a>
## 8. Receipt status, timeout, dan commit yang tidak diketahui

Jalur receipt hanya membaca receipt; ia tidak menjalankan command, memberi akses kembali, mengungkap object ke orang lain, atau membatalkan review recovery.

1. Autentikasi tetap wajib. Cocokkan actor sesi dengan actor receipt asal serta tenant/type/operation ID melalui lookup tersekat; ID orang lain tidak dapat dipakai enumerasi.
2. Actor asal boleh mengecek receipt walau grant bisnis dicabut. Bila receipt membuktikan commit tetapi detail object tak lagi boleh dibaca, balas `COMMITTED_NO_DETAIL`. Jangan kirim nominal, pihak, payload, file, account, atau ref efek sensitif.
3. Receipt yang membuktikan belum ada efek memberi status terminal minimal. Retry mutasi tetap melewati auth/izin/epoch terkini; lookup tidak mem-bypass grant revoke.
4. Epoch request baru/berbeda tidak mengubah origin epoch. Receipt lama yang masih ada dapat membuktikan commit tanpa replay.
5. Operasi pra-restore yang receipt-nya hilang/tidak dipercaya menghasilkan `RESTORE_REVIEW_REQUIRED`, bukan “belum pernah dikirim”.
6. Di luar insiden, lookup kosong yang tak membuktikan non-commit menghasilkan `OUTCOME_UNKNOWN`. Status kosong tidak membuktikan grant, validitas, atau saldo.
7. Untuk timeout biasa di luar restore, client boleh mencoba ulang mutation langsung dengan operation ID/hash yang sama melalui gate auth, grant, recovery epoch, versi dan validasi terkini. Receipt lookup membantu memastikan hasil tetapi tidak diwajibkan dan tidak perlu incident review; bila command lama telah commit, receipt/idempotency mengembalikan hasil sama atau `COMMITTED_NO_DETAIL` tanpa effect kedua.
8. Client menyimpan waktu percobaan, hash lokal, receipt/ack, origin epoch, dan recovery state secara durable. Jangan menyimpan token di receipt lokal.

Lookup status adalah `QRY-14` di [§16](#api16), bukan query report dan bukan command.

<a id="api09"></a>
## 9. Validasi, transaksi atomik, dan konkurensi

**Urutan gate mutasi:**

1. Autentikasi sesi dan bentuk actor dari server.
2. Validasi protokol/command/schema tertutup.
3. Turunkan `data_space`; cek tenant, relasi scope, grant, status layanan, fitur rilis dan `request_recovery_epoch`.
4. Cek recovery/review durable untuk operation ID atau scope sebelum efek.
5. Normalisasi/validasi payload, angka, unit, tanggal, dependency dan hash; cocokkan receipt/idempotency.
6. Dalam satu transaksi konsisten: klaim key unik; validasi expected versions dan state domain; lock/constraint scope; tulis revisi/efek, receipt, audit, outbox bersama; commit.
7. Sesudah commit saja, kirim respons atau lakukan kerja luar database melalui outbox. Storage/notifikasi/network bukan dual-write yang diperlukan transaksi uang.

**Pengaman race dan efek:**

- Mutasi saldo/kewajiban mengunci atau conditional-update scope yang sama. Hitung ulang saldo kas, pegangan, payable, advance outstanding, payout dan alokasi dari state server; jangan percaya total client.
- `expected_versions`/unique constraints melindungi period ACTIVE per kandang, assignment aktif `(tenant,farm,user)`, recording `(cycle_id,business_date)`, receipt, payment allocation, reversal sumber, dan satu konversi OFF-17 per note.
- Perubahan bersamaan memakai versi target dan ringkasan scope terkini; dua perangkat stale tidak boleh sama-sama lolos.
- Konflik target menghasilkan `VERSION_CONFLICT`, bukan last-write-wins. Detail konflik difilter sesuai ACL.
- Satu dokumen purchase/review/post atomik. Batch boleh parsial antar-dokumen; tidak ada efek setengah pada satu dokumen.
- Command ledger R1 tidak menyimpan `PROCESSING` committed terpisah dari effect. Crash sebelum commit me-rollback claim dan effects; duplicate request menunggu terbatas atau replay receipt committed.
- Side effect latar memakai outbox ID unik dan consumer idempotent. Export job diterima bukan financial posting atau export `READY`.
- Data posted dikoreksi dengan reversal/revision bertaut, bukan edit/delete in-place.
- Untuk command finansial, sumber kanonis `financial_source_event` dan effect typed (mis. `cash_movement`, `cost_entry`, `obligation`, `obligation_application`) dibuat sesuai invariant command. API tidak menerima effect dari browser dan tidak menulis ledger langsung.

<a id="api10"></a>
## 10. Antrean lokal dan transisi sinkronisasi

Antrean lokal wajib ditulis atomik bersama payload dan operation ID **sebelum** UI mengatakan “tersimpan di HP”. Gagal storage/quota berarti simpan gagal; form tetap terbuka dan tidak memberi centang sukses.

| State antrean client | Makna dan transisi yang dibolehkan |
|---|---|
| `LOCAL_DRAFT` | Form belum committed ke antrean. Tidak boleh disebut tersimpan. |
| `LOCAL_SAVED` | Payload, ID, origin epoch dan provenance tersimpan durable. Edit sebelum dicoba boleh; perubahan semantik membuat ID baru dan menaut draft lama. |
| `READY` | Schema/dependency lokal valid dan lease/mode mengizinkan. Bukan bukti izin server terkini. |
| `SENDING` | Satu percobaan dengan ID/hash sama sedang dikirim; duplikasi transport tetap harus aman. |
| `WAITING_DEPENDENCY` | Parent belum mendapat receipt berhasil/ditautkan; child belum boleh diposting. |
| `OUTCOME_UNKNOWN` | Timeout/putus setelah request mungkin sampai; cek receipt, jangan ubah ID/hash. |
| `SERVER_ACCEPTED` | Server menerima klaim/dokumen; efek dapat menunggu review. |
| `ACKNOWLEDGED` | Receipt commit terminal diterima; status bisnisnya bisa tetap submitted. |
| `REVIEW_REQUIRED` | Konflik, revoke, lock atau recovery perlu tindakan berwenang; jangan kirim ulang otomatis. |
| `TERMINAL_ERROR` | Penolakan terminal. Koreksi semantik menjadi operasi baru bertaut. |
| `QUARANTINED` | Identitas/grant/tenant berubah, lease habis, atau schema tidak kompatibel; simpan di user asal. |

Aturan implementasi client:

- Retry network/429/temporary memakai operation ID dan hash identik, backoff, batas percobaan, dan tombol “Coba kirim lagi”. Background sync hanya tambahan.
- Batch dapat parsial; setiap operation menyimpan hasil sendiri. Sukses batch bukan sukses tiap command.
- Reauth memperbarui grant dan request epoch; ID, payload, origin epoch, actor asal, dan hash tidak ditulis ulang.
- Queue `ACKNOWLEDGED` dapat memuat bisnis `SUBMITTED_UNVERIFIED`; `SERVER_ACCEPTED` belum tentu `POSTED`. Dua sumbu tidak dicampur.
- Logout menawarkan sinkronisasi saat online atau keluar dengan antrean tetap terkunci di user/device asal. Purge perlu konfirmasi risiko kehilangan.
- Partisi local minimal menurut user + tenant + scope. Cache finansial/data private user lama tidak boleh tampil setelah logout.
- Migrasi schema lokal menjaga payload lama atau meminta tindakan aman; versi tak kompatibel dikarantina/update-required, tidak dihapus otomatis.
- Lease offline 72 jam dari verifikasi izin server terakhir adalah usulan PRD, bukan keputusan final. Jam perangkat tidak memperpanjang. Setelah habis, blok baca cache bisnis/command baru; antrean lama dipertahankan untuk recovery.
- Login/aktivasi perangkat dan unduh scope offline awal butuh online. Reset/hilang perangkat tidak memindahkan draft kepada akun pengganti.

<a id="api11"></a>
## 11. Dependency graph dan batch yang dibekukan

Batch sinkron bukan persetujuan finansial massal. Ia mengirim operasi terurut, menjaga relasi parent-child, dan menghasilkan status per operasi.

1. Client membekukan manifest: `batch_id`, versi protokol, user/device lokal, daftar operation ID, hash, `depends_on`, urutan topologis dan waktu pembekuan.
2. Payload batch tidak berubah. Perubahan dokumen/versi/pihak/nominal/parent/keputusan membuat operation ID dan batch/manifest baru. Retry memakai manifest sama.
3. `batch_id` tidak mengganti receipt command. Hasil per operation: `APPLIED`, `ALREADY_COMMITTED`, `SUBMITTED`, `NEEDS_DATA`, `DEPENDENCY_PENDING`, `VERSION_CONFLICT`, `DENIED`, `TERMINAL_REJECTED`, `OUTCOME_UNKNOWN`, atau `RESTORE_REVIEW_REQUIRED`.
4. Parent ditolak/belum diterima → child menunggu. Client tak boleh mengarang parent ID server; Owner menaut kejadian antar-perangkat jika ID tidak diketahui.
5. Efek satu command uang/dokumen atomik walau operasi lain dalam batch gagal.
6. Batch Owner “Setujui dan bukukan” membekukan aksi, ID dokumen, expected version tiap dokumen, batch ID, dan hash selection. Validasi ulang per dokumen; dokumen stale tetap pending tanpa membatalkan yang valid. Tidak ada approval blanket.
7. Selection baru menghasilkan batch baru; source-effect uniqueness tetap mencegah dokumen posted dibukukan lagi.
8. Dependency mengikuti sumber bisnis, bukan urutan jam perangkat: grant/periode sebelum operasi scope; transfer pegangan canonical sebelum belanja dengan dana itu; purchase sebelum payment/refund; salary finalized sebelum payment/application; right/suspense sebelum settlement application; parent object sebelum file link.
9. Klaim OFF-16 belum menjadi saldo sah dan tidak dapat membiayai child.
10. Retry batch sama mengembalikan receipt yang ada, tidak memulai efek baru.

<a id="api12"></a>
## 12. OFF-16 — laporan kejadian tunai dan satu transfer kanonis

OFF-16 mencatat uang yang **menurut pencatat sudah berpindah secara fisik**. Itu bukan posting, transfer terotorisasi, saldo sumber baru, atau izin belanja. Sumber: [PRD §22.4](PRD.md#s22).

- Owner/ABK bisa menyimpan catatan offline berisi `event_kind` (mis. serah-terima kas, pengembalian, pembayaran toko/reimbursement, gaji/kasbon/upah), waktu/tanggal, `amount_idr`, pihak menurut pelapor, note/bukti opsional dan operation ID.
- Status lokal `LOCAL_ONLY`; setelah dikirim `SUBMITTED_UNVERIFIED`. UI: **Belum Disahkan — Uang sudah berpindah menurut catatan, belum dibukukan.**
- Owner meninjau sumber, kewajiban, izin, saldo, versi, periode dan dependency secara online. Persetujuan menghasilkan satu movement canonical dalam command atomik; menolak posting tidak menghapus klaim kejadian fisik.
- Dua orang boleh melaporkan serah-terima sama dengan ID berbeda. Owner menautkan klaim ke satu movement setelah memeriksa kejadian; nominal/tanggal sama saja tidak cukup untuk auto-merge.
- Jika movement sudah posted sebelum counterpart datang, claim terlambat dapat menjadi `LINKED_TO_CANONICAL`. Tautan tidak membuat movement, expense, atau payment kedua.
- Status tautan `LINKED_TO_CANONICAL` hidup di `cash_event_claim_link` dan bukan terminal resolution FIN-11; FIN-11 hanya untuk purchase `cash_claim`.
- Simpan `canonical_effect_id` dan state link dengan unique constraint atomik. Retry/konfirmasi penerima mengembalikan effect yang sama.
- Parent transfer belum canonical → child purchase menunggu. Jangan pakai klaim untuk belanja, membuat saldo negatif, atau mengganti sumber otomatis menjadi uang pribadi ABK.
- Revoke/lock/saldo/versi yang mencegah posting tetap mempertahankan klaim `SUBMITTED_UNVERIFIED` untuk review.
- Klaim pembayaran kasbon/gaji/upah harus ditautkan ke kewajiban/approval tepat; catatan fisik bukan tindakan Owner mengesahkan payout.

<a id="api13"></a>
## 13. OFF-17 — capture-only dan konversi tenant asal

OFF-17 adalah catatan lokal setelah lease habis tanpa membaca cache usaha. Bukan login offline, grant baru, atau transaksi tenant yang dapat langsung dibukukan. Lihat [PRD OFF-17](PRD.md#s22) dan `SECURITY_OPERATIONS.md`.

1. Hanya perangkat terdaftar dengan local unlock/penyimpanan kunci yang diputuskan dan diuji. Logout atau registrasi/kunci tak terbukti → capture-only tidak tersedia.
2. Form hanya berisi waktu/tanggal, nominal bertipe, teks pihak/keperluan, bukti baru, `note_id`, author/device asal dan `origin_registration_id`. Tidak ada saldo, pegawai, autocomplete, histori/cache tenant, dokumen lama, atau akun lain.
3. Capture menyimpan `origin_tenant_id` immutable dari registration context terbitan server. Server verifikasi mapping; tenant/author dari payload saja tidak cukup.
4. Origin adalah provenance, bukan grant. Ia tidak berubah saat lease habis, grant dicabut, registrasi diperbarui, reauth, atau ganti tenant.
5. Konversi perlu reauth dan actor asal atau recovery SEC-13 sah; target hanya tenant asal dan kandang/scope yang saat itu masih diizinkan. Perubahan kandang di tenant sama perlu konfirmasi/audit. Perubahan tenant selalu ditolak.
6. `capture_note.convert` membuat claim biasa, belum cash effect/approval. Owner meninjau lewat alur reguler.
7. Kunci conversion durable unik `(origin_registration_id,note_id)`, terpisah dari `operation_id` receipt. Retry dengan ID sama/berbeda dan note hash sama mengembalikan conversion/claim tunggal. Key sama dengan hash berbeda ditolak untuk mismatch/recovery review; tidak membuat claim kedua atau menimpa note.
8. Hash note memakai hanya field capture yang diizinkan; tidak mencakup `operation_id`, token/sesi, actor envelope, atau request recovery epoch. Ini berbeda dari command payload hash dan tidak menggantikan verifikasi origin. Koreksi setelah conversion adalah revisi claim/source, bukan conversion lain.
9. Tanpa registrasi asal terverifikasi atau grant asal hilang, note tetap lokal terkunci/recovery-only. Jangan rehome ke tenant baru, rekan, atau tenant bernama PT sama.
10. Jangan tampilkan note lokal ke akun berikutnya setelah logout. Storage penuh/migrasi/kunci hilang diberi batas jujur; jangan klaim keamanan hardware tanpa bukti.

<a id="api14"></a>
## 14. Lampiran privat dan alur file

Metadata transaksi dan upload byte terpisah. Lampiran opsional di R1; ketiadaan bukti tidak mewajibkan alasan atau posting otomatis.

| Status file | Arti |
|---|---|
| `LOCAL_ONLY` | Hanya ada di perangkat; server/perangkat lain belum punya. |
| `METADATA_PENDING` | Upload intent belum diterima server. |
| `UPLOAD_PENDING` / `UPLOADING` | Metadata diterima, byte belum lengkap. |
| `QUARANTINED` | Byte diterima tetapi belum lolos pemeriksaan; tak boleh ditampilkan/download. |
| `AVAILABLE` | Lolos validasi dan ACL parent masih memberi akses. |
| `FAILED` | Upload/scan gagal; retry file, bukan command bisnis. |
| `MISSING` | Manifest menyatakan file tidak tersedia; ekspor tidak disebut lengkap. |

**Urutan wajib:**

1. Kirim parent command/metadata dulu; file memiliki state sendiri dan transaksi dapat tersimpan tanpa upload.
2. Minta upload intent untuk parent/file dengan ACL sah. Server validasi quota, format/ukuran yang diizinkan, versi parent dan scope.
3. Upload melalui izin privat singkat; URL bukan publik dan tidak masuk notifikasi/log permanen.
4. Konfirmasi upload, validasi MIME dan isi, sanitize nama, pemeriksaan keamanan/scan sesuai kebijakan yang disetujui, buang EXIF lokasi dari salinan penayangan; baru kemudian `AVAILABLE`. Pemeriksaan wajib belum tersedia/gagal berarti tetap quarantined/pending atau failed, bukan dianggap lulus karena scanner tidak terpasang.
5. Download melalui gateway yang mengecek sesi, ACL/visibility parent, scope, service state, status file. URL signed singkat bukan pengganti auth server.
6. Revoke mencegah URL baru. Salinan yang sudah diunduh tidak bisa ditarik kembali.
7. File mewarisi ACL parent. Attachment finansial tidak `PPL_VISIBLE`; ABK tidak mendapat invoice/rekan yang dilarang.
8. Upload retry memakai file ID/intent sama dan tidak menciptakan purchase/claim/transfer lagi.
9. PRD mengusulkan JPEG/PNG/WebP dan PDF dengan batas awal; keputusan final perlu review keamanan, jangan hardcode sebagai persetujuan.

<a id="api15"></a>
## 15. Ekspor, inbox, audit, dan recovery service

### 15.1 Ekspor asinkron

- Export membekukan filter, scope, timezone, format, waktu request dan dataset. Worker memakai query domain whitelist dan snapshot konsisten; unduhan cek ACL terkini.
- State job `PENDING`, `RUNNING`, `READY`, `FAILED`, `EXPIRED`, `CANCELLED`. `READY` berarti file privat terbentuk, bukan hak download abadi.
- Manifest menyertakan schema version, tenant/snapshot/cutoff, row count, checksum tiap file, kamus field/enum, status attachment, dan caveat local-only belum diterima server.
- Paket usaha dapat meliputi opening position, purchase/peralatan, kas/biaya/utang/piutang, allocation/reversal, gaji/kasbon/upah, recording/revisi, settlement/payout dan audit yang berhak.
- Jangan ekspor password/hash, reset secret, token, data tenant lain, atau private finance. Export bukan backup penuh atau jaminan import ulang.
- Link terbatas waktu, bukan reusable lintas actor. Tiap unduhan melewati pemeriksaan scope/izin baru.

### 15.2 Inbox dan audit

- Inbox adalah projection tindakan berizin: klaim pending, koreksi, conflict, dependency, file gagal, status ekspor dan recovery review. Membuka/arsip inbox tidak mem-posting bisnis.
- `NEEDS_CORRECTION`, `REJECTED`, dan `APPROVED/POSTED` memakai command domain sumber, bukan endpoint inbox generik.
- Audit memuat actor server, aksi, object/scope, operation ID, versi sebelum/sesudah, waktu server, provenance device seperlunya, dan alasan yang diwajibkan.
- Jangan audit/log password, secret, signed URL, foto mentah, token atau reset code. Admin tidak mendapat audit read-all usaha.
- Owner membaca audit tenant sendiri; ABK hanya keuangan sendiri/riwayat recording sesuai matriks PRD.

### 15.3 Protokol recovery

- Pemulihan membuat `recovery_epoch` baru dan manifest/incident durable: cutoff restore, bukti receipt/backup, rentang data terdampak, grant yang harus tetap dicabut, reviewer berwenang.
- Perubahan epoch tidak mengubah hash bisnis, operation ID, origin epoch, receipt yang selamat, atau antrean lokal.
- Pre-restore receipt yang selamat dapat replay tanpa efek. Command yang terbukti belum commit boleh lanjut pakai ID asal setelah reauth/izin/versi/validasi terkini.
- Ack lokal untuk command yang hilang akibat restore menjadi `RESTORE_REVIEW_REQUIRED`; jangan replay uang/kuantitas. Jika koreksi ID baru dipakai, tombstone ID lama atomik harus menunjuk koreksi agar replay lama tidak menambah effect.
- Resolver mengikuti prosedur dan audit; tidak mendapatkan hak baca ledger/impersonation. Bukti kurang → unresolved tetap tertahan.
- Restore gagal, saldo/receipt tidak cocok, atau file parsial tidak ditutupi dengan opening balance baru. Laporkan rentang, laporan terdampak, dan ketidakpastian.

<a id="api16"></a>
## 16. Registry query baca `QRY-*`

Ini daftar whitelisted R1. Query menerima `filters`, `page_size`, cursor opak dan bila perlu `snapshot_token`. Server menerapkan projection/row visibility dari sesi; `tenant_id`, filter ID, atau cursor bukan izin.

| ID | `query_type` / isi whitelist | Batas field dan scope | Pagination / invalidasi |
|---|---|---|---|
| QRY-01 | `session.scope_manifest`: actor sendiri, tenant/grant/kandang, service state, epoch, lease | Tidak mengirim grant orang lain/private data; perlu auth online. | Manifest berversi; revoke/epoch membatalkan sync token. |
| QRY-02 | `farm.team_periods`: kandang, bangunan minimum, assignment sendiri, status periode, timezone, mode | ABK hanya assignment aktif dan field operasional whitelist. | Cursor stabil; membership version wajib cocok. |
| QRY-03 | `daily.recording`: summary efektif dan revision/history yang berhak dilihat | Key `(cycle_id,business_date)`; scope dari cycle; tanpa keuangan/stok. | Snapshot/revision; expected version dari response. |
| QRY-04 | `inbox.actions`: claim/review/conflict/dependency/file/export/recovery | Hanya tindakan actor berhak; detail objek dibuka lewat query terotorisasi. | Cursor opak; unread count bukan authority. |
| QRY-05 | `cash.accounts_and_movements`: akun usaha, saldo sah, pegangan dan mutasi | Owner scope tenant; ABK hanya pegangan/dana belanja sendiri; claim unverified bukan saldo. | Snapshot saldo dan ledger cursor konsisten. |
| QRY-06 | `purchase.claims`: pengajuan/purchase, pihak, tanggal, review, allocation/payment refs termasuk uang muka supplier unapplied yang sudah tercatat | ABK hanya claim pribadi/scope tugas yang dibolehkan; invoice/keuangan rekan tidak ada. | Filter tanggal/status/kandang; cursor satu snapshot. |
| QRY-07 | `finance.report`: ledger/cost/payable/receivable sesuai scope | Owner full; ABK hanya personal balances diizinkan. Tak mencampur private finance. | Snapshot, basis, cutoff, timezone, version wajib. |
| QRY-08 | `cycle.close_checklist`: review gate, claims, payroll, settlement, sync terakhir diketahui | Owner tenant/cycle; menyatakan draft offline tidak terlihat server. | Lock harus bawa versi snapshot ini. |
| QRY-09 | `worker.pay_records`: gaji, kasbon, upah | Owner lihat data yang dikelola; ABK melihat diri sendiri. Slip gaji tak memuat upah pekerjaan. | Cursor per orang/periode; jangan agregasi individu tersembunyi. |
| QRY-10 | `settlements`: dokumen, mode, rights, notice/payout/suspense, classification/coverage | Owner tenant; payout-only/unreconciled bukan laba final. | Versi document/reconciliation + snapshot. |
| QRY-11 | `files.metadata`: status file, parent, nama aman, scan/status | ACL diwarisi parent; list tidak memberi byte/download URL. | Download selalu auth baru. |
| QRY-12 | `exports.jobs`: status dan manifest job berhak | Scope/requester disaring; tidak bocorkan job tenant lain. | URL hanya setelah reauth/ACL; kedaluwarsa. |
| QRY-13 | `audit.history`: histori versi/actor yang diizinkan | Owner tenant; ABK finance diri + recording bersama; field minimization. | Snapshot/cursor; actor lain tidak dibuka. |
| QRY-14 | `operation.receipt_status`: satu operation ID milik actor asal autentik | Status minimal; revoke bisnis tak menutup lookup, tetapi detail menjadi `COMMITTED_NO_DETAIL`. | Tanpa pagination; rate-limit dan anti-enumeration. |

**Aturan query dan pagination:**

- Jangan membuat `get any table`, free SQL, arbitrary include, unrestricted graph, atau export massal tanpa ACL. Query baru harus punya whitelist field/scope/test isolasi.
- Cursor opak terikat query ID, filter canonical, actor/tenant, ACL version, sort key stabil dan snapshot. Filter/query/actor berubah → cursor baru.
- Pakai keyset pagination dengan tie-breaker ID stabil; batasi page size. Jangan offset scan besar.
- Sync incremental memakai cursor server per user/tenant/scope + ACL/recovery epoch. Revoke/membership change membatalkan cursor; ambil manifest segar, jangan lanjutkan halaman lama.
- Periksa izin setiap halaman; field terlarang tidak dikirim dengan harapan UI menyembunyikannya.
- Rentang waktu memakai date bisnis + timezone eksplisit; response menyebut snapshot/cutoff, bukan mengklaim real-time bila projection terlambat.

<a id="api17"></a>
## 17. Registry command `CMD-*` untuk R1

Registry ini tertutup dan unik. `cmd` merujuk `command_type`; tidak ada operasi bebas di luar daftar. `Owner` = Owner tenant sendiri; `ABK` = assignment aktif; `ABK→Owner` = pengajuan lalu review; `Admin` = scope platform eksplisit. Server tetap cek grant per request.

Tipe `id`, `date`, `instant`, `amount_idr`, `signed_amount_idr`, `decimal_quantity`, `integer_count`, `enum`, `text`, `bool`, dan `version` mengikuti [§3](#api03). `?` opsional; `[]` array typed. Reference gunakan ID stabil. Tak ada payload `actor_user_id` otoritatif.

### 17.1 Tenant, akun, grant, dan master

| ID / `command_type` | Pelaku dan syarat | Input bisnis minimum bertipe | Efek atomik / invariant | Error / tes sumber |
|---|---|---|---|---|
| CMD-01 `tenant.provision` | Admin; owner diverifikasi melalui proses privat | `owner_user_id:id`, `tenant_name:text`, `limits:{active_farms:integer_count,active_buildings:integer_count,internal_users:integer_count,file_bytes:integer_count}` | Buat tenant/primary owner/limit konsisten; kredensial awal tidak dapat dibaca ulang; tanpa checkout/payment gateway. | `FORBIDDEN_SCOPE`, `LIMIT_INVALID`; ONB-01, SEC-14. |
| CMD-02 `owner.first_access.activate` | Owner setelah subsistem auth menyelesaikan rotasi kredensial | `credential_rotation_receipt_id:id`, `session_version:version` | Mengaktifkan akses bisnis setelah rotasi; password dikirim hanya lewat alur auth terpisah, tidak masuk command/receipt/audit. | `UNAUTHENTICATED`, `CREDENTIAL_EXPIRED`; ONB-01/09, SEC-06. |
| CMD-03 `tenant.service_state.set` | Admin | `service_status:enum(ACTIVE,READ_ONLY,ARCHIVED)`, `reason:text`, `expected_tenant_version:version` | Suspend tak menghapus data; limit turun tak menghapus object; admin tak mendapat finance read. Menandai `ARCHIVED` tidak dengan sendirinya menetapkan izin read/export, retensi, atau purge; kebijakan itu tetap gate Q-11. | `VERSION_CONFLICT`, `SERVICE_READ_ONLY`; PRD §7.2, SEC-11/Q-11. |
| CMD-04 `farm.save` | Owner | `farm_id?:id`, `name:text`, `timezone_iana:timezone`, `status:enum(ACTIVE,ARCHIVED)`, `expected_version?:version` | Perubahan master tak mengubah snapshot transaksi historis. | `VALIDATION_ERROR`, `LIMIT_REACHED`; ONB-02, DATA-02/08. |
| CMD-05 `building.save` | Owner | `building_id?:id`, `farm_id:id`, `name:text`, `capacity_head_count?:integer_count`, `status:enum(ACTIVE,ARCHIVED)`, `expected_version?:version` | Capacity terpisah dari DOC; bangunan/alokasi tidak wajib pada DAILY global. | `FORBIDDEN_SCOPE`, `VERSION_CONFLICT`; CYC-01/04. |
| CMD-06 `account.abk.create` | Owner | `user_id?:id`, `username?:text`, `display_name:text`, `credential_delivery_ref:id` | Buat atau link satu login ABK ke employee/membership tenant ini saja. Server membuktikan target bukan Owner/Admin/PPL, bukan primary/multi-owner, dan tidak dikelola Owner independen lain; bukan menambah membership lintas tenant. Assignment/grant kandang adalah command terpisah. Username normalized global uniqueness D-25 tetap usulan, bukan approval/izin membuat akun lintas tenant. | `IDENTITY_ROLE_MISMATCH`, `IDENTITY_MANAGED_ELSEWHERE`, `USERNAME_TAKEN`, `LIMIT_REACHED`; ONB-04/09, SEC-15/16, K-37/D-25. |
| CMD-07 `account.abk.reset_credentials` | Owner yang mengelola ABK dalam tenant sendiri; reauth/step-up | `user_id:id`, `credential_reset_request_id:id`, `expected_user_version:version` | Reset hanya ABK tenant-local; server selalu mencabut sesi/token target yang lama tanpa flag opt-out, lalu mengirim credential sekali/terbatas lewat kanal privat dan mewajibkan ganti saat login. Tidak mengubah actor histori/saldo/assignment atau menyamar sebagai ABK. | `FORBIDDEN_SCOPE`, `IDENTITY_ROLE_MISMATCH`, `VERSION_CONFLICT`; SEC-13/16. |
| CMD-08 `account.abk.set_state` | Owner | `user_id:id`, `state:enum(ACTIVE,DISABLED)`, `expected_user_version:version` | Disable tidak menghapus saldo/utang/claim atau memindahkan antrean; request baru dicek. | `VERSION_CONFLICT`; PRD §6.3, ONB-04. |
| CMD-09 `employee_farm_assignment.set` | Owner | `employee_id:id`, `farm_id:id`, `valid_from:date`, `valid_to?:date`, `assignment_status:enum(ACTIVE,ENDED)`, `expected_assignment_version?:version` | Assignment kerja terpisah dari login/grant; riwayat pekerja lintas kandang tidak dipindah atau dihapus. | `VERSION_CONFLICT`, `DATE_RANGE_INVALID`; SEC-15, DATA_MODEL §4. |
| CMD-10 `farm_grant.set` | Owner | `user_id:id`, `farm_id:id`, `capability_set:enum[]`, `grant_status:enum(ACTIVE,REVOKED)`, `valid_from:date`, `valid_to?:date`, `expected_grant_version?:version` | Permission login berbeda dari assignment kerja; multi-ABK sah; keunikan grant aktif `(tenant,farm,user)`; revoke menyimpan history. | `FORBIDDEN_SCOPE`, `VERSION_CONFLICT`, `LIMIT_REACHED`; SEC-02/15, OFF-06. |
| CMD-11 `counterparty.save` | Owner | `counterparty_id?:id`, `display_name:text`, `counterparty_roles:[{role_kind:enum(SUPPLIER,PARTNER,BROKER,OWNER,EMPLOYEE,OTHER),status:enum,valid_from:date,valid_to?:date}]`, `expected_version?:version` | Simpan role bertipe terpisah; pihak dapat beberapa role tanpa gabung saldo/tagihan; jangan merge nama mirip. | `VALIDATION_ERROR`; ONB-07, DATA-01/08. |
| CMD-12 `business_category.save` | Owner | `category_id?:id`, `direction:enum(INCOME,EXPENSE)`, `label:text`, `accounting_class:enum`, `status:enum(ACTIVE,ARCHIVED)`, `expected_version?:version` | Pemetaan ke `business_category`; edit label tak mengganti kelas transfer/loan/stock/expense ledger. | `CLASS_IMMUTABLE`, `VERSION_CONFLICT`; ONB-05. |
| CMD-13 `cash_account.open` | Owner | `account_id?:id`, `account_name:text`, `account_kind:enum(BUSINESS_CASH,BUSINESS_BANK_MANUAL,FARM_CASH,EMPLOYEE_CUSTODY)`, `farm_id?:id`, `custodian_employee_id?:id`, `currency_code:enum(IDR)` | Akun scoped tenant; `EMPLOYEE_CUSTODY` memerlukan custodian employee. Saldo awal/cutoff hanya lewat opening position, bukan field open; bukan rekening pribadi ABK/Owner. | `CURRENCY_UNSUPPORTED`, `CUSTODIAN_REQUIRED`, `VERSION_CONFLICT`; CASH-01–02/15, DATA-05. |

### 17.2 Periode, penerimaan, mode, dan recording

| ID / `command_type` | Pelaku dan syarat | Input bisnis minimum bertipe | Efek atomik / invariant | Error / tes sumber |
|---|---|---|---|---|
| CMD-14 `cycle.prepare` | Owner | `cycle_id?:id`, `farm_id:id`, `name:text`, `planned_chick_in_date?:date`, `partner_id?:id`, `timezone_snapshot:timezone`, `recording_mode:enum(OFF,DAILY)` | Membuat `cycle` DRAFT; tidak membuat ayam/transaksi/recording/ACTIVE. Farm parent version dikirim di envelope. | `VERSION_CONFLICT`, `LIMIT_REACHED`; ONB-02/11, CYC-01/03. |
| CMD-15 `cycle.activate` | Owner online | `cycle_id:id`, `actual_chick_in_at:instant`, `initial_live_count:integer_count`, `doc_billed_count?:integer_count`, `doc_bonus_count?:integer_count`, `doc_rejected_or_arrival_dead_count?:integer_count`, `building_allocations?:[{building_id:id,doc_live_count:integer_count}]` | Menulis population/cycle allocation snapshot lalu ACTIVE dalam satu transaksi; live received menjadi populasi; allocated+unallocated tepat. Capacity overage perlu konfirmasi Owner sesuai PRD. Expected cycle dan farm versions berada di envelope. | `ACTIVE_CYCLE_EXISTS`, `POPULATION_INVALID`, `VERSION_CONFLICT`; CYC-02–04, GOLD-14. |
| CMD-16 `cycle.recording_mode.set` | Owner online | `cycle_id:id`, `recording_mode:enum(OFF,DAILY)`, `effective_business_date:date`, `expected_cycle_version:version` | Perubahan global berlaku setelah cutoff gate; OFF tak menampilkan DAILY; histori lama tidak dihapus. | `VERSION_CONFLICT`, `CUTOFF_REQUIRED`; REC-01/03. |
| CMD-17 `cycle.cutoff.reconcile` | Owner online | `cycle_id:id`, `from_mode:enum(OFF,DAILY)`, `to_mode:enum(OFF,DAILY)`, `cutoff_date:date`, `opening_values:[{metric:enum,quantity:decimal_quantity,unit_code:text,source:text}]`, `coverage:enum(COMPLETE,PARTIAL,UNKNOWN)`, `expected_cycle_version:version` | Cutoff/opening eksplisit; hindari overlap kumulatif/hitung ganda; unknown tetap null dan lineage disimpan. | `VERSION_CONFLICT`, `CUTOFF_OVERLAP`, `UNIT_MISMATCH`; REC-03/13, ONB-10. |
| CMD-18 `cycle.physical.finish` | Owner online | `cycle_id:id`, `actual_finished_date:date`, `asserted_empty:bool`, `measured_final_head_count?:integer_count`, `known_dispositions?:[{kind:enum,count:integer_count}]` | Membuat `cycle_physical_close` revision dan set physical FINISHED atomik; deklarasi kosong bukan sensus terukur; tak mengunci finance. Expected cycle version berada di envelope. | `POPULATION_REVIEW_REQUIRED`, `VERSION_CONFLICT`; CYC-05–08. |
| CMD-19 `cycle.cancel` | Owner online, sebelum chick-in | `cycle_id:id`, `reason:text`, `expected_cycle_version:version` | CANCELLED hanya sebelum DOC; biaya persiapan tetap ada; tak membuat siklus palsu. | `CYCLE_ALREADY_ACTIVE`, `VERSION_CONFLICT`; CYC-02/11. |
| CMD-20 `receiving.record` | Owner | `farm_id:id`, `event_date:date`, `receipt_kind:enum(DOC,FEED,SAPRONAK)`, `party_id?:id`, `lines:[{description:text,quantity?:decimal_quantity,unit_code?:text}]`, `cycle_id?:id`, `cost_responsibility:enum(OWNER,PARTNER,UNKNOWN)`, `note?:text` | Membuat `operational_receipt`; field ABK whitelist; tak membuat inventory R1/cash/cost tanpa purchase posting tertaut. | `FORBIDDEN_SCOPE`, `UNIT_REQUIRED`; ONB-06, REC-08/12, §10. |
| CMD-21 `daily_summary.save` | Owner/ABK assignment; offline hanya lease aktif | `cycle_id:id`, `business_date:date`, `feed_used?:{quantity:decimal_quantity,unit_code:text}`, `mortality_count?:integer_count`, `cull_count?:integer_count`, `sampling?:{sample_count:integer_count,net_weight_kg:decimal_quantity,sampled_at:instant,method?:text}`, `completeness:enum(PARTIAL,COMPLETE)`, `expected_daily_version?:version`, `correction_reason?:text` | API alias untuk `daily_recording`/`daily_recording_revision`; satu `(cycle_id,business_date)`; full revision/supersedes bukan sum; sampling point-in-time; tanpa stock/cost/approval effect. | `VERSION_CONFLICT`, `RECORDING_OFF`, `CYCLE_DATE_INVALID`; REC-01–15, OFF-18, GOLD-28. |
| CMD-22 `cycle.financial_review.start` | Owner online | `cycle_id:id` | Buat `cycle_financial_snapshot` PREVIEW dari source-version manifest konsisten dan set REVIEW bila sesuai gate. Expected cycle version dikirim di envelope. | `CLAIMS_PENDING`, `PAYROLL_INCOMPLETE`, `SETTLEMENT_PENDING`; CYC-09–11. |
| CMD-23 `cycle.financial_lock` | Owner online | `cycle_id:id`, `snapshot_id:id` | Membuat lock event, set LOCKED, dan tunjuk snapshot LOCKED yang sama dalam satu transaksi; utang/piutang yang sudah diakui boleh tersisa, tak menunggu payout atau stok R1. Expected cycle version dikirim di envelope. | `CHECKLIST_STALE`, `PERIOD_NOT_FINISHED`, `CLAIMS_PENDING`, `VERSION_CONFLICT`; CYC-09–11. |
| CMD-24 `cycle.financial_reopen` | Owner online; alasan wajib | `cycle_id:id`, `reason:text`, `affected_source_refs:id[]` | Buat `cycle_financial_lock_event` REOPEN, pertahankan snapshot lama immutable dan kosongkan pointer current; tidak mem-post koreksi sendiri. Expected cycle version dikirim di envelope. | `REASON_REQUIRED`, `VERSION_CONFLICT`; CYC-09/10. |

### 17.3 Klaim tunai, pembelian, cash, biaya, dan opening

| ID / `command_type` | Pelaku dan syarat | Input bisnis minimum bertipe | Efek atomik / invariant | Error / tes sumber |
|---|---|---|---|---|
| CMD-25 `cash_event.claim.submit` | Owner/ABK; OFF-16 boleh lokal/offline | `event_kind:enum(CASH_HANDOVER,CASH_RETURN,PURCHASE_PAYMENT,REIMBURSEMENT,SALARY_PAYMENT,KASBON_DISBURSEMENT,WAGE_PAYMENT)`, `occurred_at:instant`, `amount_idr:amount_idr`, `reported_from?:text`, `reported_to?:text`, `farm_id?:id`, `cycle_id?:id`, `parent_operation_id?:id`, `note?:text`, `attachment_ids?:id[]` | `LOCAL_ONLY`→`SUBMITTED_UNVERIFIED`; klaim tidak menaikkan saldo/otorisasi belanja. | `FORBIDDEN_SCOPE`, `DEPENDENCY_PENDING`, `VALIDATION_ERROR`; OFF-16/18, CASH-03–10. |
| CMD-26 `cash_transfer.resolve_and_post` | Owner online; pilih satu subtype | `action:enum(POST_CANONICAL_TRANSFER,LINK_EXISTING_CANONICAL)`. `POST_CANONICAL_TRANSFER`: `claim_ids?:id[]`, `from_account_id:id`, `to_account_id:id`, `amount_idr:amount_idr`, `occurred_at:instant`, `farm_id?:id`, `custodian_employee_id?:id`, `purpose_snapshot?:text`. `LINK_EXISTING_CANONICAL`: `claim_ids:id[]`, `canonical_financial_source_event_id:id`, `canonical_cash_movement_id:id`, `canonical_cash_transfer_id?:id`, `evidence_ids?:id[]`. | Subtype POST mencatat satu `cash_transfer`, movement OUT+IN dan `cash_event_claim_link` status `LINKED_TO_CANONICAL` untuk claim yang diverifikasi dalam transaksi yang sama. Subtype LINK late counterpart hanya mencatat link Owner-verified ke movement/transfer yang sudah posted; tidak membuat cash/expense/payment effect. Cash-event claim memakai linkage terpisah, bukan resolusi terminal purchase FIN-11. Tautan canonical tidak auto-match dari nominal/tanggal saja. | `VERSION_CONFLICT`, `INSUFFICIENT_CASH`, `CLAIM_ALREADY_LINKED`, `CANONICAL_NOT_FOUND`, `CLAIM_KIND_MISMATCH`, `REVIEW_REQUIRED`; CASH-03/04/10, OFF-16, GOLD-23. |
| CMD-27 `purchase.cash_claim.resolve` | Owner online; hanya claim kind `PURCHASE` | `allocation_lines:[{cash_claim_id:id,resolved_amount_idr:amount_idr,resolution:enum(POSTED_PURCHASE,NOT_OCCURRED,DUPLICATE_OF,PAYER_CORRECTED,POSTED_RECOVERABLE),canonical_cash_claim_id?:id,canonical_purchase_id?:id,funding_kind?:enum(BUSINESS_ACCOUNT,EMPLOYEE_OWN_FUNDS,OWNER_OWN_FUNDS,SUPPLIER_CREDIT),verified_payments?:[{payer_kind:enum(BUSINESS_ACCOUNT,EMPLOYEE_OWN_FUNDS,OWNER_OWN_FUNDS),cash_account_id?:id,payer_employee_id?:id,owner_funding_kind?:enum(OWNER_ADVANCE_FOR_PURCHASE,CAPITAL_CONTRIBUTION),amount_idr:amount_idr,paid_at:instant}],cash_account_id?:id,recoverable_debtor_counterparty_id?:id,recoverable_debtor_employee_id?:id,recoverable_basis?:text}]`, `reason:text`, `evidence_ids?:id[]`, `purchase_posting?:typed CMD-29 posting fields` | Menulis satu effective `claim_resolution` hanya dengan lima terminal FIN-11. Allocation total tepat sebesar klaim purchase. `POSTED_PURCHASE` wajib menyertakan posting data CMD-29 bertipe dan commit source/cost/cash/payable + resolution atomik. `NOT_OCCURRED` tanpa effect; `DUPLICATE_OF` menunjuk claim/purchase kanonis tanpa effect kedua; `PAYER_CORRECTED` memakai posting data yang sama untuk mengakui funding/payer nyata yang dikoreksi. `POSTED_RECOVERABLE` wajib membuktikan pembayaran/pengeluaran nyata, debtor dan dasar pengembalian yang disahkan Owner—bukan otomatis membuat utang ABK karena klaim ditolak/kategori belanja. Jika `OWNER_OWN_FUNDS`, tidak perlu/ tidak boleh kirim account pribadi sebagai cash account; catat Owner funding event, bukan cash movement tenant. Tanpa enum resolusi tambahan atau utang punishment di luar FIN-11. | `CANONICAL_NOT_FOUND`, `ALREADY_RESOLVED`, `VERSION_CONFLICT`, `ALLOCATION_MISMATCH`, `CLAIM_KIND_MISMATCH`, `DEBTOR_REQUIRED`, `REASON_REQUIRED`; FIN-11, OFF-16, GOLD-23. |
| CMD-28 `purchase.claim.submit` | ABK/Owner; ABK offline hanya cached scope/lease | `farm_id?:id`, `cycle_id?:id`, `event_at:instant`, `expense_description:text`, `supplier_id?:id`, `supplier_name_snapshot?:text`, `lines:[{description:text,line_amount_idr:amount_idr,quantity?:decimal_quantity,unit_code?:text}]`, `total_idr:amount_idr`, `funding_kind:enum(BUSINESS_ACCOUNT,EMPLOYEE_OWN_FUNDS,OWNER_OWN_FUNDS,SUPPLIER_CREDIT,MIXED,UNKNOWN)`, `buyer_employee_id?:id`, `reported_payments?:[{payer_kind:enum(BUSINESS_ACCOUNT,EMPLOYEE_OWN_FUNDS,OWNER_OWN_FUNDS),cash_account_id?:id,payer_employee_id?:id,amount_idr:amount_idr,paid_at?:instant}]`, `received_status:enum(RECEIVED,NOT_RECEIVED,PARTIAL,UNKNOWN)`, `cash_claim_ref?:id`, `cycle_allocation?:[{cycle_id:id,amount_idr:amount_idr}]`, `note?:text`, `attachment_ids?:id[]` | Menyimpan `purchase_document`/lines dan claim asli; reported payments adalah klaim, belum movement. BUSINESS_ACCOUNT perlu cash account; EMPLOYEE_OWN_FUNDS perlu payer employee dan dapat membentuk reimbursement saat Owner post; OWNER_OWN_FUNDS bukan cash account usaha. ABK tak wajib class/coverage; bukti opsional; tanpa SKU/stok. `event_date` disnapshot dari event/timezone; line sum reconcile ke total bila diketahui. | `VALIDATION_ERROR`, `FORBIDDEN_SCOPE`, `VERSION_CONFLICT`, `PERIOD_LOCKED`; CASH-05–09/16, OFF-02/06. |
| CMD-29 `purchase.review_and_post` | Owner online; per-dokumen | `purchase_id:id`, `expected_purchase_version:version`, `line_classifications:[{purchase_line_id:id,purchase_class:enum(CONSUMABLE,DURABLE_EQUIPMENT,SAPRONAK_INFORMATIONAL,OTHER_PENDING)}]`, `received_amount_idr:amount_idr`, `funding_kind:enum(BUSINESS_ACCOUNT,EMPLOYEE_OWN_FUNDS,OWNER_OWN_FUNDS,SUPPLIER_CREDIT,MIXED,UNKNOWN)`, `verified_payments?:[{payer_kind:enum(BUSINESS_ACCOUNT,EMPLOYEE_OWN_FUNDS,OWNER_OWN_FUNDS),cash_account_id?:id,payer_employee_id?:id,amount_idr:amount_idr,paid_at:instant}]`, `cost_allocations:[{target_kind:enum(TENANT,FARM,CYCLE,OUTSIDE_CYCLE),farm_id?:id,cycle_id?:id,amount_idr:amount_idr,tie_break_order:integer_count}]`, `purchase_claim_ids_to_resolve?:id[]`, `settlement_coverage_links?:id[]`, `review_decision:enum(APPROVE,NEEDS_CORRECTION,REJECT)`, `decision_note?:text` | Per-line class ke `purchase_line`; verified account payment membuat cash movement hanya sesuai uang usaha nyata; dana pribadi Owner/Worker membuat kewajiban/reimbursement, bukan cash movement tenant. Pada APPROVE, source/effects/obligations dan klaim purchase yang ditaut diselesaikan `POSTED_PURCHASE` atomik. Hanya claim kind PURCHASE; setiap claim dialokasikan tepat, satu kali. Reject/correction tidak mengubah claim/effect. | `VERSION_CONFLICT`, `NEEDS_DATA`, `PERIOD_LOCKED`, `ALLOCATION_MISMATCH`, `ALLOCATION_EXCEEDS_SOURCE`, `DEPENDENCY_PENDING`; CASH-05–09/16, FIN-11/13, COST-01–05. |
| CMD-30 `purchase.owner_direct.post` | Owner online | Field CMD-28 + `line_classifications`, `funding_kind`, `received_amount_idr`, `verified_payments`, `cost_allocations`, `owner_funding_kind?:enum(OWNER_ADVANCE_FOR_PURCHASE,CAPITAL_CONTRIBUTION)` | Simpan+review+post Owner tanpa approval diri. Payment akun usaha perlu account ID dan membuat cash movement; vendor dibayar dari uang pribadi Owner bukan cash movement usaha, harus payable Owner atau contribution eksplisit tertaut purchase sama. | `INSUFFICIENT_CASH`, `VERSION_CONFLICT`, `VALIDATION_ERROR`; CASH-06/07/15, FIN-13, GOLD-02/30. |
| CMD-31 `purchase.payment.resolve` | Owner online; satu subtype bertipe | `action:enum(PAYABLE_SETTLEMENT,SUPPLIER_ADVANCE_DISBURSE,SUPPLIER_ADVANCE_APPLY,SUPPLIER_ADVANCE_REFUND)` dengan payload conditional yang tertutup pada [§17.8](#api178). | Bayar payable, cairkan/aplikasikan uang muka supplier, atau catat refund aktual; efek dan application source-idempotent. `cash_account_id` hanya untuk dana usaha tenant nyata; `OWNER_OWN_FUNDS` adalah sumber eksternal Owner funding event, bukan akun kas usaha. | `INSUFFICIENT_CASH`, `PAYABLE_EXCEEDED`, `SUPPLIER_MISMATCH`, `ADVANCE_EXCEEDED`, `RECEIPT_NOT_CONFIRMED`, `VERSION_CONFLICT`; CASH-07/09/13, AC-14. |
| CMD-32 `purchase.refund.post` | Owner online | `original_purchase_id:id`, `original_effect_id:id`, `refund_date:date`, `amount_idr:amount_idr`, `resolution:enum(CASH_RECEIVED,DEBT_REDUCED)`, `cash_account_id?:id`, `payable_id?:id`, `expected_source_version:version` | Taut sumber; balik expense/utang asal, cash hanya bila diterima; tanpa inventory effect R1. | `REFUND_EXCEEDS_REMAINING`, `SOURCE_NOT_FOUND`, `VERSION_CONFLICT`; CASH-11. |
| CMD-33 `cash_return.post` | Owner online, atau claim di-review bila offline | `holding_user_id:id`, `cash_account_id:id`, `amount_idr:amount_idr`, `occurred_at:instant`, `canonical_claim_ref?:id`, `expected_holding_version:version` | Pegangan turun/kas sumber naik; bukan income. | `INSUFFICIENT_HOLDING`, `VERSION_CONFLICT`, `CLAIM_UNVERIFIED`; CASH-10, OFF-16. |
| CMD-34 `cash_reconciliation.submit` | Owner; ABK hanya submit klaim pengamatan | `cash_account_id:id`, `as_of:instant`, `physical_amount_idr:amount_idr`, `book_version:version`, `evidence_ids?:id[]`, `note?:text` | Catat fisik vs buku untuk review; submission tak menyesuaikan ledger. | `VERSION_CONFLICT`, `FORBIDDEN_SCOPE`; CASH-12. |
| CMD-35 `cash_reconciliation.adjust` | Owner online; subtype sesuai resolution | `reconciliation_id:id`, `resolution:enum(NO_ADJUSTMENT,POST_ADJUSTMENT)`, `adjustment?:{direction:enum(IN,OUT),amount_idr:amount_idr,adjustment_classification:enum(CASH_VARIANCE,OTHER_APPROVED),reason:text}`, `expected_reconciliation_version:version` | `NO_ADJUSTMENT` tidak memuat adjustment dan tidak membuat effect. `POST_ADJUSTMENT` mewajibkan nominal positif + arah, ditaut ke `cash_adjustment`; eksplisit/audited, tidak mengarang biaya dari foto/selisih. | `VERSION_CONFLICT`, `AMOUNT_MISMATCH`, `REASON_REQUIRED`; CASH-12. |
| CMD-36 `cost_allocation.save` | Owner online | `cost_source_id:id`, `expected_source_version:version`, `basis_kind:enum(DIRECT,EQUAL,PROPORTIONAL,OWNER_DEFINED)`, `allocations:[{target_kind:enum(TENANT,FARM,CYCLE,OUTSIDE_CYCLE),farm_id?:id,cycle_id?:id,amount_idr:amount_idr,share_snapshot?:decimal_quantity,tie_break_order:integer_count}]`, `effective_date:date` | Membuat `cost_allocation_plan` baru; total alokasi + unallocated = source; residual rupiah sesuai COST-05; revisi bukan biaya kedua. | `ALLOCATION_EXCEEDS_SOURCE`, `ROUNDING_MISMATCH`, `VERSION_CONFLICT`; COST-01–05, GOLD-07. |
| CMD-37 `cost_coverage.link` | Owner online | `cost_allocation_line_id:id`, `settlement_component_id:id`, `settlement_version:version`, `amount_idr:amount_idr`, `reason:text`, `expected_coverage_version?:version` | Membuat `settlement_coverage`; coverage ≤ alokasi cost dan component sah yang mengurangi net; revisi bukan flag. | `COVERAGE_EXCEEDS_COMPONENT`, `VERSION_CONFLICT`, `SETTLEMENT_UNCLASSIFIED`; COST-08/11, SET-08. |
| CMD-38 `ledger_effect.reverse` | Owner online; source eligible | `source_effect_id:id`, `source_operation_id:id`, `amount_idr:amount_idr`, `reason:text`, `effective_date:date`, `expected_source_version:version`, `replacement_operation_id?:id` | ID effect hanya mengidentifikasi koreksi sumber, bukan izin membalik sembarang leg sendiri. Server menurunkan seluruh effects/application/link/alokasi/coverage terdampak dan membalik kelompok sah atomik; cumulative ≤ original. Cost reversal nominal positif berkontribusi minus ke net root menurut DATA_MODEL §8.1, plan net root direvisi bersama. Tak boleh delete atau menyatakan uang fisik kembali hanya karena koreksi. | `ALREADY_REVERSED`, `REVERSAL_EXCEEDS_SOURCE`, `VERSION_CONFLICT`, `DEPENDENT_EFFECT_REVIEW_REQUIRED`; FIN-09/12, GOLD-14/27. |
| CMD-39 `opening_position.submit` | Owner; mulai pencatatan di tengah siklus | `scope_kind:enum(TENANT,FARM,CYCLE)`, `farm_id?:id`, `cycle_id?:id`, `cutoff_at:instant`, `cutoff_business_date?:date`, `timezone_snapshot?:timezone`, `history_coverage:enum(COMPLETE,PARTIAL,UNKNOWN)`, `source_description:text`, `cutoff_event_assignments?:[{event_identity_key:text,source_event_id?:id,external_source_snapshot?:text,side:enum(INCLUDED_IN_OPENING,POST_CUTOFF_EVENT)}]`, `positions:[{position_kind:enum(CASH_ACCOUNT,SUPPLIER_PAYABLE,SUPPLIER_ADVANCE,EMPLOYEE_REIMBURSEMENT,EMPLOYEE_ADVANCE,SALARY_PAYABLE,WORK_WAGE_PAYABLE,PARTNER_RECEIVABLE,PARTNER_PAYABLE,OWNER_PAYABLE,UNMATCHED_RECEIPT_SUSPENSE,OTHER_APPROVED),employee_id?:id,partner_id?:id,counterparty_id?:id,cash_account_id?:id,cycle_id?:id,balance_amount_idr?:amount_idr,currency_code:enum(IDR),balance_known:bool,historical_cost_coverage:enum(RECOGNIZED,PARTIAL,UNKNOWN,NOT_APPLICABLE)}]` | Membuat opening batch/positions dan keputusan sisi per kejadian tepat C; bukan income/cost/payment. `< C` tercakup opening, `> C` event baru, `= C` wajib keputusan tertaut sebelum pengesahan baris terdampak; missing/ambigu tetap pending. Source/unknown tersimpan; stok R1 tidak masuk. | `CUTOFF_REQUIRED`, `CUTOFF_BOUNDARY_UNRESOLVED`, `DUPLICATE_SOURCE`, `VALIDATION_ERROR`; ONB-03/10, GOLD-24. |
| CMD-40 `opening_position.approve` | Owner online | `opening_batch_id:id`, `expected_batch_version:version`, `reconciliation_decision:enum(ACCEPT,NEEDS_REVIEW,REJECT)`, `position_refs:id[]`, `effective_cutoff:instant` | Verifikasi/supersede batch atomik; posisi opening baseline, bukan historical cash/cost effect; mismatch tetap pending. | `VERSION_CONFLICT`, `OPENING_DOUBLED`, `SOURCE_UNCLEAR`; ONB-03/10, GOLD-24. |
| CMD-41 `other_income.post` | Owner online; income sampingan usaha R1 | `event_date:date`, `description:text`, `amount_idr:amount_idr`, `counterparty_id?:id`, `receipt_kind:enum(CASH,RECEIVABLE)`, `cash_account_id?:id`, `farm_id?:id`, `cycle_id?:id`, `expected_account_version?:version` | Membuat `other_income_entry`; ayam yang sudah masuk settlement tak dihitung lagi. | `DUPLICATE_SETTLEMENT_SOURCE`, `VERSION_CONFLICT`; CASH-14. |

### 17.4 Gaji periode, kasbon, dan upah kerja

| ID / `command_type` | Pelaku dan syarat | Input bisnis minimum bertipe | Efek atomik / invariant | Error / tes sumber |
|---|---|---|---|---|
| CMD-42 `salary.agreement.save` | Owner online | `employee_id:id`, `farm_id:id`, `cycle_id:id`, `agreed_amount_idr?:amount_idr`, `agreement_status:enum(DRAFT,AGREED,CANCELLED)`, `agreed_at?:instant`, `agreement_note?:text`, `expected_salary_version?:version` | Memutakhirkan `salary_agreement` snapshot employee/farm/cycle; AGREED jadi proyeksi, bukan biaya final; multi-farm eksplisit, tidak gandakan gaji penuh. CANCELLED tak membatalkan kasbon yang telah dicairkan. | `VERSION_CONFLICT`, `WORKER_SCOPE_INVALID`, `FINALIZED_IMMUTABLE`; PAY-01–03/05. |
| CMD-43 `salary.finalize` | Owner online | `salary_agreement_id:id`, `final_gross_amount_idr:amount_idr`, `effective_date:date`, `reason?:text`, `expected_agreement_version:version` | AGREED→FINALIZED; akui hak/biaya sekali; revisi berikutnya bukan overwrite. | `AGREEMENT_REQUIRED`, `ALREADY_FINALIZED`, `VERSION_CONFLICT`; PAY-02/03, GOLD-05. |
| CMD-44 `cash_advance.request` | ABK sendiri/Owner; request boleh offline sesuai lease | `employee_id:id`, `amount_idr:amount_idr`, `requested_at:instant`, `purpose?:text`, `cycle_id?:id` | Request saja; tidak mengubah kas/saldo advance; tidak mensyaratkan gaji/periode. | `FORBIDDEN_SCOPE`, `VALIDATION_ERROR`; PAY-07, OFF-02. |
| CMD-45 `cash_advance.disburse` | Owner online | `employee_id:id`, `funding_cash_account_id:id`, `disbursed_amount_idr:amount_idr`, `disbursement_date:date`, `purpose?:text`, `cycle_id?:id`, `advance_request_id?:id`, `expected_cash_version:version` | Membuat `employee_advance`, cash OUT + receivable; boleh melebihi gaji; hanya uang nyata yang disalurkan. | `INSUFFICIENT_CASH`, `VERSION_CONFLICT`; PAY-07/09, GOLD-06. |
| CMD-46 `cash_advance.repayment.post` | Owner mengonfirmasi uang diterima; claim ABK belum post | `employee_advance_id:id`, `employee_id:id`, `cash_account_id:id`, `amount_idr:amount_idr`, `received_at:instant`, `cash_claim_ref?:id`, `expected_advance_version:version` | Cash IN dan obligation application; bukan biaya/income; tidak melebihi outstanding. | `ADVANCE_EXCEEDED`, `CLAIM_UNVERIFIED`, `VERSION_CONFLICT`; PAY-09. |
| CMD-47 `cash_advance.apply_to_salary` | Owner online, pilihan eksplisit | `employee_advance_id:id`, `salary_finalization_id:id`, `amount_idr:amount_idr`, `effective_date:date`, `expected_advance_version:version`, `expected_salary_version:version` | Membuat offset pair; ≤ advance outstanding dan hak gaji tunai sisa; tak auto-apply seluruh saldo atau upah kerja. | `ADVANCE_EXCEEDED`, `SALARY_PAYABLE_EXCEEDED`, `VERSION_CONFLICT`; PAY-04/08–10, GOLD-06. |
| CMD-48 `salary.payment.post` | Owner online atau claim OFF-16 yang diverifikasi | `salary_finalization_id:id`, `obligation_id:id`, `cash_account_id:id`, `paid_amount_idr:amount_idr`, `paid_at:instant`, `expected_salary_version:version`, `cash_claim_ref?:id` | Cash movement + obligation application; tidak lebih dari sisa hak; potongan terpisah; tanpa upah kerja. | `PAYMENT_EXCEEDS_PAYABLE`, `VERSION_CONFLICT`, `CLAIM_UNVERIFIED`; PAY-04/10, GOLD-05/24. |
| CMD-49 `wage_job.submit` | ABK untuk diri sendiri atau Owner | `employee_id:id`, `work_description:text`, `completed_at:instant`, `farm_id:id`, `building_id?:id`, `cycle_id?:id`, `quantity?:decimal_quantity`, `unit_code?:text`, `rate_snapshot?:decimal_quantity`, `total_amount_idr:amount_idr`, `evidence_ids?:id[]` | Membuat `work_compensation`; task biasa bukan tagihan; rate snapshot melekat pada record. | `FORBIDDEN_SCOPE`, `VALIDATION_ERROR`; PAY-11/12/16. |
| CMD-50 `wage_job.review` | Owner online | `work_compensation_id:id`, `decision:enum(APPROVE,NEEDS_CORRECTION,REJECT)`, `approved_amount_idr?:amount_idr`, `reason?:text`, `expected_job_version:version` | APPROVE akui cost/payable terpisah dari salary; reject/correction tanpa posting; revision retained. | `VERSION_CONFLICT`, `REASON_REQUIRED`, `AMOUNT_INVALID`; PAY-13/15. |
| CMD-51 `wage_job.payment.post` | Owner online | `work_compensation_id:id`, `obligation_id:id`, `cash_account_id:id`, `amount_idr:amount_idr`, `paid_at:instant`, `expected_job_version:version`, `cash_claim_ref?:id` | Cash + obligation application; partial payment sah; bukan payroll atau potongan kasbon otomatis. | `PAYMENT_EXCEEDS_PAYABLE`, `VERSION_CONFLICT`; PAY-14/15, GOLD-05. |

### 17.5 Buku usaha: modal, prive, dan pinjaman Owner

R1 hanya memodelkan sisi usaha. Jangan buat private-finance ledger/pair lintas buku atau menu setengah jadi.

| ID / `command_type` | Pelaku dan syarat | Input bisnis minimum bertipe | Efek atomik / invariant | Error / tes sumber |
|---|---|---|---|---|
| CMD-52 `owner.capital_contribution.post` | Owner online | `owner_user_id:id`, `cash_account_id:id`, `amount_idr:amount_idr`, `event_date:date`, `event_kind:enum(CAPITAL_CONTRIBUTION)`, `expected_account_version:version` | Membuat `owner_funding_event`; kas usaha naik; modal/kontribusi bukan income/expense. | `VERSION_CONFLICT`, `CURRENCY_UNSUPPORTED`; CASH-15, GOLD-13. |
| CMD-53 `owner.draw.post` | Owner online | `owner_user_id:id`, `cash_account_id:id`, `amount_idr:amount_idr`, `event_date:date`, `event_kind:enum(OWNER_WITHDRAWAL)`, `classification:enum(PRIVE,OWNER_RECEIVABLE)`, `expected_account_version:version` | `owner_funding_event`; cash turun; prive bukan expense; private ledger tidak dibuka. | `INSUFFICIENT_CASH`, `VERSION_CONFLICT`; CASH-15, GOLD-13. |
| CMD-54 `owner.loan.receive` | Owner online | `owner_user_id:id`, `cash_account_id:id`, `amount_idr:amount_idr`, `event_date:date`, `event_kind:enum(OWNER_LOAN_TO_BUSINESS)`, `expected_account_version:version` | `owner_funding_event`; kas usaha naik/utang Owner naik; bukan income. | `VERSION_CONFLICT`, `VALIDATION_ERROR`; CASH-15, GOLD-25. |
| CMD-55 `owner.loan.repayment.post` | Owner online | `owner_user_id:id`, `loan_obligation_id:id`, `cash_account_id:id`, `principal_amount_idr:amount_idr`, `event_date:date`, `event_kind:enum(OWNER_LOAN_REPAYMENT)`, `expected_loan_version:version`, `expected_cash_version:version` | `owner_funding_event` repayment + application; cash/pokok utang turun, bukan expense. | `LOAN_EXCEEDED`, `INSUFFICIENT_CASH`, `VERSION_CONFLICT`; CASH-15, GOLD-25. |

### 17.6 Hasil aktual, RHPP, notice, payout, dan rekonsiliasi

| ID / `command_type` | Pelaku dan syarat | Input bisnis minimum bertipe | Efek atomik / invariant | Error / tes sumber |
|---|---|---|---|---|
| CMD-56 `settlement.document.submit` | Owner online | `farm_id:id`, `cycle_id:id`, `partner_id:id`, `entry_mode:enum(FULL_RHPP,PAYOUT_ONLY)`, `document_date?:date`, `original_label?:text`, `document_number?:text`, `components?:[{component_kind:enum(FARMING_INCOME,BONUS,PARTNER_SUPPLY_COST,PENALTY,TAX,OWNER_SAVING_HELD,OLD_DEBT_PRINCIPAL,OLD_SAVING_RELEASE,OTHER_ADJUSTMENT),amount_idr:amount_idr,net_sign:enum(INCREASE_NET_RIGHT,DECREASE_NET_RIGHT,NON_INCOME_RECLASS),accounting_class:enum(INCOME,EXPENSE,OWNER_ASSET,LIABILITY,PRINCIPAL,OTHER_PENDING),source_ref?:text,is_verified:bool}]`, `net_right_abs_amount_idr?:amount_idr`, `net_direction?:enum(RECEIVABLE,PAYABLE)`, `evidence_ids?:id[]`, `expected_settlement_version?:version` | Membuat versi `partner_settlement_version`; cycle wajib R1; payout-only tak mengarang component; dokumen bukan cash; rights unknown null, status classification terpisah; file opsional. | `VERSION_CONFLICT`, `COMPONENT_INVALID`; SET-01–05/11, GOLD-12/20. |
| CMD-57 `settlement.rights.verify` | Owner online | `settlement_version_id:id`, `net_right_abs_amount_idr:amount_idr`, `net_direction:enum(RECEIVABLE,PAYABLE)`, `classification_status:enum(PENDING,COMPLETE)`, `expected_settlement_version:version`, `reason?:text` | `partner_settlement_version` VERIFIED + receivable/payable; kas tetap. `COMPLETE` hanya jika setiap komponen/basis klasifikasi diketahui, tertaut, tervalidasi; payout-only dapat tetap PENDING. Verifikasi bukan bukti payout/profit final. | `VERSION_CONFLICT`, `SOURCE_UNCLEAR`, `CLASSIFICATION_INCOMPLETE`; SET-05/11, GOLD-12/20. |
| CMD-58 `settlement.payout_notice.set` | Owner online | `settlement_version_id?:id`, `notice_status:enum(ANNOUNCED,CANCELLED,SUPERSEDED)`, `announced_at:instant`, `planned_amount_idr?:amount_idr`, `planned_date?:date`, `expected_notice_version?:version`, `note?:text` | Membuat/merevisi `partner_payout_notice`; informasi saja, tidak mengubah cash/paid. | `VERSION_CONFLICT`; SET-11. |
| CMD-59 `settlement.payout.receive` | Owner online, right known/verified; cash benar diterima | `settlement_version_id:id`, `partner_id:id`, `cycle_id:id`, `cash_account_id:id`, `amount_idr:amount_idr`, `received_at:instant`, `expected_settlement_version:version`, `cash_claim_ref?:id`, `application_amount_idr?:amount_idr` | Membuat `partner_payout` + cash movement sekali dan melunasi receivable terverifikasi; tak mengubah total right. | `CLAIM_UNVERIFIED`, `APPLICATION_EXCEEDED`, `VERSION_CONFLICT`; SET-05/06/11, GOLD-20. |
| CMD-60 `settlement.suspense.receive` | Owner online, right belum diketahui/unmatched | `partner_id:id`, `cycle_id?:id`, `cash_account_id:id`, `amount_idr:amount_idr`, `received_at:instant`, `reference?:text`, `expected_account_version:version` | Membuat `partner_payout` + cash IN dan suspense obligation; belum income/right. Jika payout sudah dicatat, jangan terima cash lagi. | `VERSION_CONFLICT`, `DUPLICATE_CASH_SOURCE`; SET-05/11, GOLD-12/20. |
| CMD-61 `settlement.suspense.reconcile` | Owner online | `partner_payout_id:id`, `suspense_obligation_id:id`, `resolution:enum(MATCH_RIGHT,UNMATCHED_REMAINS,REFUND,OTHER_REVIEW)`, `expected_payout_version:version`, `note?:text`; MATCH_RIGHT memerlukan `settlement_version_id:id`, `receivable_obligation_id:id`, `amount_idr:amount_idr`; REFUND memerlukan `refund:{amount_idr:amount_idr,cash_account_id:id,paid_at:instant,payment_reference?:text}`. | MATCH_RIGHT meng-offset suspense payable dan right verified tenant/mitra sama dengan `SUSPENSE_TO_SETTLEMENT_RIGHT`, tanpa cash kedua. REFUND hanya bila uang benar-benar dikembalikan: cash OUT usaha + obligation application pada suspense payable yang masih outstanding atomik; bukan pembatalan cash IN asal atau biaya baru. Nominal ≤ sisa suspense dan target/akun valid; versi setiap obligation/account di envelope. UNMATCHED_REMAINS/OTHER_REVIEW hanya status/catatan, tanpa effect dan tidak menerima field amount/refund. | `APPLICATION_EXCEEDED`, `RIGHT_UNVERIFIED`, `INSUFFICIENT_CASH`, `VERSION_CONFLICT`, `SOURCE_MISMATCH`; SET-05/11, FIN-09, GOLD-12/20. |
| CMD-62 `settlement.non_cash_application.set` | Owner online; component/pemetaan noncash terverifikasi | `settlement_version_id:id`, `component_id:id`, `offset_kind:enum(MUTUAL_SETTLEMENT,OWNER_AUTHORIZED)`, `receivable_obligation_id:id`, `payable_obligation_id:id`, `amount_idr:amount_idr`, `expected_settlement_version:version`, `reason:text`. | Taut tepat dua obligation berlawanan arah, tenant/pihak dan komponen cocok; amount ≤ sisa keduanya; versi keduanya wajib. Membuat satu offset pair tanpa kas/income/expense kedua; komponen pokok utang lama boleh hanya jika benar melunasi obligation yang ditaut. **Pelepasan tabungan bukan otomatis receivable/payable offset.** Tanpa pemetaan aset/reklasifikasi terverifikasi menurut Q-08, tolak cabang ini sebagai CLASSIFICATION_REQUIRED, pertahankan PENDING; payout-only/uang aktual tetap boleh lewat CMD-59/60. Tidak membuat payable fiktif atau memakai OTHER_CLASSIFIED sebagai jalan pintas. | `COMPONENT_UNVERIFIED`, `OBLIGATION_KIND_MISMATCH`, `APPLICATION_EXCEEDED`, `CLASSIFICATION_REQUIRED`, `VERSION_CONFLICT`; SET-04/06/11, Q-08. |
| CMD-63 `settlement.revision.accept` | Owner online | `prior_settlement_version_id:id`, `new_document_number?:text`, `revised_components?:[{component_kind:enum(FARMING_INCOME,BONUS,PARTNER_SUPPLY_COST,PENALTY,TAX,OWNER_SAVING_HELD,OLD_DEBT_PRINCIPAL,OLD_SAVING_RELEASE,OTHER_ADJUSTMENT),amount_idr:amount_idr,net_sign:enum(INCREASE_NET_RIGHT,DECREASE_NET_RIGHT,NON_INCOME_RECLASS),accounting_class:enum(INCOME,EXPENSE,OWNER_ASSET,LIABILITY,PRINCIPAL,OTHER_PENDING)}]`, `revised_net_right_abs_amount_idr?:amount_idr`, `revised_net_direction?:enum(RECEIVABLE,PAYABLE)`, `expected_prior_version:version`, `reason:text` | Membuat versi baru `partner_settlement_version` dengan `supersedes_id`; reconcile delta/application lama, bukan duplicate payment; locked snapshot perlu reopen. | `VERSION_CONFLICT`, `REOPEN_REQUIRED`, `SOURCE_UNCLEAR`; SET-09, CYC-09, GOLD-12. |

### 17.7 Berkas, ekspor, ownership, recovery

| ID / `command_type` | Pelaku dan syarat | Input bisnis minimum bertipe | Efek atomik / invariant | Error / tes sumber |
|---|---|---|---|---|
| CMD-64 `file.upload_intent.create` | Actor berhak pada parent | `parent_ref:{parent_kind:enum(FINANCIAL_SOURCE_EVENT,CYCLE,DAILY_RECORDING_REVISION,OPERATIONAL_RECEIPT,PARTNER_SETTLEMENT_VERSION,CASH_CLAIM),parent_id:id}`, `filename:text`, `declared_mime:text`, `byte_size:integer_count`, `content_hash:text` | Buat `attachment` + typed `attachment_link`/quota intent; satu typed parent saja; tak mengubah finance effect. | `FORBIDDEN_SCOPE`, `QUOTA_EXCEEDED`, `FILE_TYPE_UNSUPPORTED`; OFF-15, SEC-01/05. |
| CMD-65 `file.upload.complete` | Intent owner masih berhak | `file_id:id`, `upload_session_id:id`, `expected_file_version:version`; upload capability hanya di header transport | Byte lengkap→quarantine/scan; `AVAILABLE` setelah validasi; capability bukan payload/audit dan tidak ada duplicate transaction. | `UPLOAD_INCOMPLETE`, `SCAN_FAILED`, `VERSION_CONFLICT`; OFF-15, SEC-10. |
| CMD-66 `export.request` | Owner atau actor dengan hak dataset | `export_kind:enum(BUSINESS_PACKAGE,CSV_REPORT,PDF_SUMMARY)`, `filters:object-whitelisted`, `timezone:timezone`, `format_version:text`, `expected_snapshot?:id` | Job+outbox atomik, filter/scope beku; bukan financial posting; tanpa secret/private space. | `FORBIDDEN_SCOPE`, `EXPORT_LIMIT`, `SNAPSHOT_UNAVAILABLE`; REP-14–19. |
| CMD-67 `capture_note.convert` | Actor asal setelah reauth/eligible recovery | `note_id:id`, `origin_registration_id:id`, `confirmed_tenant_id:id`, `farm_id?:id`, `cycle_id?:id`, `capture_payload:{occurred_at:instant,amount_idr:amount_idr,description:text,party_text?:text,new_evidence_metadata?:[{client_file_id:id,media_type:text,byte_size:integer_count,sha256:text}]}`, `expected_note_hash:text`, `conversion_confirmation:bool` | Kirim payload note lokal, bukan hanya ID/hash yang belum diketahui server. Server menghitung hash allowlist note, memvalidasi metadata bukti baru dan membuat link/intent berhak setelah parent claim ada; byte diunggah terpisah §14, bukan bukti tersedia. Dedupe unik `(origin_registration_id,note_id)` independen operation ID. Tenant/user/device asal diturunkan dari registrasi immutable; target sama dan grant terkini wajib. Key/hash sama konvergen ke satu claim; beda hash ditolak/review. Konversi CASH_EVENT tidak approve/post/rehome. | `ORIGIN_UNVERIFIED`, `TENANT_MISMATCH`, `GRANT_REVOKED`, `ALREADY_CONVERTED`, `IDEMPOTENCY_PAYLOAD_MISMATCH`; OFF-17, SEC-13. |
| CMD-68 `tenant.ownership.transfer` | Owner lama + baru; online/reauth sesuai SEC-14 | `new_primary_owner_id:id`, `ownership_version:version`, `new_owner_acceptance_receipt_id:id`, `membership_snapshot_id:id` | Reauth tersimpan di session server, bukan body. Satu primary Owner atomik; grants/sessions policy; private finance lama tidak ikut. | `VERSION_CONFLICT`, `ACCEPTANCE_REQUIRED`, `RECOVERY_REQUIRED`; SEC-14. |
| CMD-69 `recovery.command.resolve` | Resolver berwenang sesuai incident procedure; Owner bila diwajibkan | `incident_id:id`, `operation_id:id`, `resolution:enum(PROVEN_COMMITTED,PROVEN_NOT_COMMITTED,LINK_TO_CORRECTION,UNRESOLVED)`, `evidence_refs:id[]`, `correction_operation_id?:id`, `expected_incident_version:version` | Memutakhirkan `restore_review_case`/`replay_tombstone` atomik; ID lama tak replay effect; unresolved tetap tertahan; bukan ledger read-all. | `EVIDENCE_INSUFFICIENT`, `VERSION_CONFLICT`, `RESTORE_REVIEW_REQUIRED`; NFR-11, GOLD-27. |

<a id="api178"></a>
### 17.8 Payload conditional supplier payment (CMD-31)

`action` adalah discriminant tertutup; field dari cabang lain ditolak. Setiap action memakai `operation_id` tersendiri, expected versions terkait pada envelope, serta `financial_source_event`/receipt/audit atomik sesuai effect-nya.

| `action` | Field khusus wajib | Hasil dan syarat |
|---|---|---|
| `PAYABLE_SETTLEMENT` | `purchase_id:id`, `payable_id:id`, `amount_idr:amount_idr`, `paid_at:instant`, `funding_source:{kind:enum(BUSINESS_ACCOUNT,OWNER_OWN_FUNDS),cash_account_id?:id,owner_funding_kind?:enum(OWNER_ADVANCE_FOR_PURCHASE,CAPITAL_CONTRIBUTION)}` | `BUSINESS_ACCOUNT` mewajibkan `cash_account_id` tenant aktif dan membuat cash OUT + obligation application. `OWNER_OWN_FUNDS` mewajibkan `owner_funding_kind`, tidak menerima/memerlukan cash account: direct payment ke supplier membentuk `owner_funding_event` + owner payable/contribution dan menyelesaikan payable yang sama tanpa cash movement usaha. Owner funds bukan saldo cash tenant. Amount tidak boleh melebihi remaining payable. |
| `SUPPLIER_ADVANCE_DISBURSE` | `supplier_id:id`, `purchase_id?:id`, `amount_idr:amount_idr`, `paid_at:instant`, `funding_source:{kind:enum(BUSINESS_ACCOUNT,OWNER_OWN_FUNDS),cash_account_id?:id,owner_funding_kind?:enum(OWNER_ADVANCE_FOR_PURCHASE,CAPITAL_CONTRIBUTION)}` | Uang muka benar-benar dikirim ke supplier. BUSINESS_ACCOUNT perlu akun dan cash OUT; OWNER_OWN_FUNDS tidak mengirim akun pribadi sebagai cash_account, tetapi membentuk payable Owner/kontribusi pada source supplier_advance yang sama. Buat hak SUPPLIER_ADVANCE_RECEIVABLE tanpa barang diterima, biaya, stok atau source Owner kedua. Purchase tautan opsional tidak mengubah received_status. |
| `SUPPLIER_ADVANCE_APPLY` | `supplier_advance_id:id`, `purchase_id:id`, `payable_id:id`, `amount_idr:amount_idr`, `application_date:date` | Owner mengonfirmasi barang/jasa pada purchase telah diterima; supplier/tenant cocok, purchase approved, amount ≤ receivable advance tersisa dan payable terbuka. Buat `obligation_offset_pair` `SUPPLIER_ADVANCE_TO_PURCHASE` sekali; tidak ada cash movement atau biaya kedua. |
| `SUPPLIER_ADVANCE_REFUND` | `supplier_advance_id:id`, `amount_idr:amount_idr`, `received_at:instant`, `cash_account_id:id`, `refund_reference?:text` | Owner mengonfirmasi uang refund benar-benar diterima ke akun usaha tenant. Amount ≤ advance receivable tersisa. Buat cash IN dan `obligation_application` ke `SUPPLIER_ADVANCE_RECEIVABLE` dalam satu transaksi; bukan reversal biaya (belum ada biaya sebelum barang diterima), bukan income, dan bukan reimbursement/owner funding baru. Memakai versi advance/account terkini di envelope; payment/refund ID idempotent. |

Business funds selalu berbeda dari uang pribadi Owner/ABK. Pembelian yang dibayar ABK dari dana pribadi ditangani pada posting purchase/CMD-27 sebagai employee reimbursement, bukan disamarkan sebagai kasbon atau settlement akun kas. Kegagalan/link attachment tidak boleh mengulang cash leg.

Untuk opening CMD-39 `SUPPLIER_ADVANCE`, `counterparty_id` wajib menunjuk supplier yang sama dengan hak uang muka. Child `supplier_advance` origin OPENING memakai source event batch yang sama menurut DATA_MODEL; approval opening tidak memanggil subtype pencairan CMD-31 atau membuat cash OUT.

### Aturan resolusi klaim pembelian (FIN-11)

`CMD-27` hanya menerima nilai terminal persis `POSTED_PURCHASE`, `NOT_OCCURRED`, `DUPLICATE_OF`, `PAYER_CORRECTED`, atau `POSTED_RECOVERABLE`. `UNRESOLVED` adalah status sebelum ada resolution, bukan nilai terminal. Allocation lines untuk klaim parsial totalnya harus tepat. `purchase_posting` adalah object tertutup berisi field CMD-29 `line_classifications`, `received_amount_idr`, `funding_kind`, `verified_payments`, `cost_allocations`, dan `settlement_coverage_links`; tidak ada body bebas. `POSTED_PURCHASE` dan `PAYER_CORRECTED` commit purchase/source/effect, kas/utang, serta resolution dalam transaksi yang sama. `NOT_OCCURRED` tidak menulis financial effect. `DUPLICATE_OF` harus menunjuk canonical purchase claim/document tenant-sama. `POSTED_RECOVERABLE` hanya dengan kas yang benar-benar keluar, cash/source yang cocok, debtor eksplisit, evidence dan persetujuan Owner; penolakan/kategori/reimburse sendiri tidak menciptakan piutang kepada ABK.

`cash_event_claim_link` OFF-16 adalah aggregate terpisah: `CMD-26` hanya mengesahkan `LINKED_TO_CANONICAL` ke movement/source terverifikasi tanpa efek kedua. Link tidak menulis atau mengubah terminal `claim_resolution` FIN-11 untuk purchase.

Menambah command memerlukan ID unik, schema tertutup, actor/scope, versions, output/error, efek atomik, receipt retention, offline/dependency, PRD link dan tests. Jangan menggabungkan perubahan yang dapat commit separuh.

<a id="api18"></a>
## 18. Kode error dan matriks retry

Error memuat `code`, `retry_class`, `operation_id` jika ada, safe field path, pesan Bahasa Indonesia, dan `trace_ref` non-secret. Jangan kirim stack trace, query, data tenant lain, atau payload sensitif.

| Kode | Kondisi | Efek commit? | Tindakan client / retry |
|---|---|---|---|
| `UNAUTHENTICATED` | Sesi tidak ada/expired/revoked sebelum gate | Tak dapat disimpulkan untuk operasi lama | Reauth; pertahankan payload/ID; cek receipt lama sebelum retry ID sama. Jangan buat ID baru. |
| `FORBIDDEN_SCOPE` | Actor tak punya aksi/scope terkini | Command baru tidak dijalankan | Jangan retry otomatis; simpan `QUARANTINED`/`REVIEW_REQUIRED`; cek receipt route untuk command lama miliknya. Hindari bocor keberadaan object. |
| `SERVICE_READ_ONLY` | Tenant `READ_ONLY` | Command baru tidak commit | Baca/export tetap hanya sesuai ACL yang berlaku; antrean mutation ditahan, bukan dibuang. Ini bukan error transport. |
| `ARCHIVED_POLICY_UNRESOLVED` | Tenant `ARCHIVED`, kebijakan akses/ekspor Q-11 belum disetujui/dikonfigurasi | Tidak ada operasi bisnis/unduhan/export yang dijalankan | Tolak dengan status terpisah; jangan otomatis mengizinkan read/export, melakukan purge, atau menyamarkan sebagai `READ_ONLY`. Tunggu kebijakan eksplisit. |
| `VALIDATION_ERROR` | Schema/angka/unit/field/enum/tanggal/range invalid | Tidak ada effect; receipt terminal jika key sudah diklaim | Tampilkan field/sebab. Perubahan makna = operation ID baru dan tautkan revisi. |
| `VERSION_CONFLICT` | Expected version stale | Tidak ada effect | Ambil state yang boleh dilihat; review/rebase; perubahan menjadi operasi baru. Jangan auto-merge uang/DAILY. |
| `PERIOD_LOCKED` | Perubahan memengaruhi snapshot lock | Tidak mengubah sumber terkunci | Ajukan Owner reopen/koreksi. Payment payable yang telah diakui bisa tetap diizinkan CYC-09. |
| `DEPENDENCY_PENDING` | Parent/transfer/right belum diakui | Child tidak commit | Queue `WAITING_DEPENDENCY`; kirim parent/link sah. Jangan ganti source otomatis. |
| `INSUFFICIENT_CASH` | Saldo authoritative kurang | Tidak ada effect | Review saldo/versi/source; koreksi sebagai operasi baru. Tidak menerapkan batas gaji ke kasbon. |
| `PAYABLE_EXCEEDED` / `APPLICATION_EXCEEDED` | Payment/application melebihi sisa | Tidak ada effect | Muat saldo authoritative, koreksi nominal, kirim operation baru. |
| `IDEMPOTENCY_PAYLOAD_MISMATCH` | Key sama, hash berbeda | Tidak ada effect baru; receipt lama tidak ditimpa | Jangan retry dengan payload lain. Buat ID baru dan reference correction. |
| `TERMINAL_REJECTED` | Penolakan final domain | Tidak ada posting | Tampilkan terminal; revisi claim dengan ID baru. Jangan hidupkan ID lama. |
| `RATE_LIMITED` / `TEMPORARY_FAILURE` | Failure transien/rate limit | Bisa belum commit atau response hilang setelah commit | Backoff; cek receipt jika meragukan; retry ID/hash sama. |
| `OUTCOME_UNKNOWN` | Timeout/disconnect biasa di luar insiden restore, hasil belum diketahui | Tidak diketahui | Jangan buat ID/cash movement baru. Boleh langsung retry payload yang sama dengan ID sama lewat gate mutasi normal; receipt query bersifat membantu, bukan prasyarat atau incident review. |
| `RESTORE_REVIEW_REQUIRED` | Receipt/epoch terdampak restore | Jangan menyimpulkan commit/tidak commit | Hentikan auto-sync untuk operasi itu; pertahankan provenance; tunggu resolver bukti. |
| `COMMITTED_NO_DETAIL` | Receipt commit terbukti, detail disembunyikan karena ACL | Ya | Terminal ack; tidak retry atau mengambil detail lewat endpoint lain. |
| `FILE_UPLOAD_RETRYABLE` | Byte/scan gagal tanpa perubahan parent | Bukan status transaksi | Retry file ID yang sama setelah izin/storage valid; jangan ulang command bisnis. |
| `CURSOR_EXPIRED` / `SNAPSHOT_STALE` | Cursor/snapshot query tak berlaku | Tak terkait command | Minta snapshot/cursor baru; jangan gabungkan halaman snapshot berbeda. |

Auth/ACL error tidak membedakan detail yang membocorkan keberadaan tenant/object lain. Error finance hanya menjelaskan data yang boleh terlihat.

<a id="api19"></a>
## 19. Pemetaan uji dan gerbang implementasi

Rencana uji terinci berada di [TEST_PLAN.md](TEST_PLAN.md) saat tersedia. Registry menaut pada aturan PRD; golden cases perlu diuji sebagai domain/integrasi, bukan hanya mock API.

| Area | Kasus minimum | Rujukan PRD |
|---|---|---|
| Tipe payload | Tolak float, pecahan rupiah, angka lokal ambigu/unit salah; null ≠ nol; timezone/koreksi tanggal tak berubah | DATA-02/05–07; [§5](PRD.md#s05) |
| Idempotensi | Parallel same key satu effect; commit+response hilang; hash mismatch; receipt survive restart | FIN-12; GOLD-14; [§9](PRD.md#s09) |
| Auth/isolation | Tenant ID lain di query/command/file/export; ABK tak lihat invoice/gaji rekan; revoke setelah enqueue; admin no read-all | SEC-01–05/13–16; [§6](PRD.md#s06) |
| Concurrency | Dua device update purchase/cash/payroll/DAILY stale; hanya satu menang; no duplicate grant/cycle/application | CYC-03; REC-06/15; PAY; OFF-07/18; [§8](PRD.md#s08) |
| Finance semantics | Claim vs posting; kredit vs cash; advance vs salary expense; wage outside slip; notice vs payout; suspense vs income | CASH-03–16; PAY-01–16; SET-01–11; GOLD-02/05/06/20 |
| OFF-16 | Dua laporan satu transfer canonical; counterpart datang setelah post; revoke/lock menahan posting tetapi klaim fisik tersimpan | OFF-16; GOLD-23; [§22](PRD.md#s22) |
| OFF-17 | Capture tanpa cache; convert tenant asal saja; sekali conversion; logout/reauth/revoke tak rehome | OFF-17; SEC-13; [§22](PRD.md#s22) |
| Financial close | Checklist stale; lock perlu gate; bayar payable setelah lock; koreksi perlu reopen | CYC-05–11; [§8](PRD.md#s08) |
| Recovery | Epoch request vs origin; ack lalu rewind; missing/committed/unresolved; correction tombstone; revoke survives restore | NFR-11; GOLD-27; [§27](PRD.md#s27) |
| File/export | File gagal tak rollback transaksi; download revoke blocked; counts/checksum/manifest; no secrets/private finance | OFF-15; REP-14–19; SEC-01/09/12 |
| Query pagination | Insert saat paging, cursor tamper, ACL berubah antarpages, expiry/restart, hidden field tak diserialisasi | SEC-01/05/09; REP-14–19 |

Golden cases wajib dipetakan minimal: GOLD-01 (pegangan), GOLD-02 (reimbursement/kredit), GOLD-05/06 (gaji/upah/kasbon), GOLD-07 (rounding alokasi), GOLD-12 (settlement), GOLD-13/25 (Owner business-only), GOLD-14/27 (retry/recovery), GOLD-20 (notice vs cash), GOLD-23 (counterpart tunai), GOLD-24 (opening salary), GOLD-28 (DAILY), GOLD-30 (pembelian tanpa inventory). Golden R2 bukan gate R1.

Sebelum coding:

- Cocokkan registry, role, enum, dan field dengan PRD serta [DATA_MODEL.md](DATA_MODEL.md) terbaru; jangan ubah istilah atau menambah field finance diam-diam.
- Tinjau `SECURITY_OPERATIONS.md` untuk identitas, sesi, lease, reset, retention, signed URL, audit, admin, dan recovery.
- Tinjau `TEST_PLAN.md` untuk pemetaan semua CMD/QRY ke tes eksplisit, data sintetis, isolasi, concurrency, offline dan restore drill.
- Tinjau [Implementation Plan](Implementation%20Plan.md) untuk dependency/backlog/gate/definition of done. Dokumen ini bukan izin memulai implementasi.
- Putuskan pertanyaan terbuka tanpa menyajikan proposal sebagai approval.
- Pastikan R1 tetap: OFF tanpa form recording; DAILY langsung berlaku dengan expected version; pembelian fleksibel tanpa stok/kontrak; Owner input+approve+post online tanpa self-approval queue; kasbon tidak dibatasi gaji; notice bukan cash.

<a id="api20"></a>
## 20. Keputusan yang tetap terbuka

Perlu keputusan/ADR sebelum implementasi, tidak boleh ditebak oleh agent:

1. URL/transport, schema language, hash algorithm/canonicalizer, sesi, rate limit, ukuran batch, cursor expiry dan versi protokol.
2. Format manifest/ack lokal dan aturan `origin_recovery_epoch` untuk command online/offline. Perbedaan origin immutable/request epoch tetap wajib.
3. Lease (72 jam hanya usulan), local unlock/kunci OFF-17, retensi receipt/note, recovery Owner, dan namespace identity.
4. Enum final klasifikasi pembelian/settlement, equipment, adjustment cash reconcile, serta alasan yang diwajibkan keputusan PRD.
5. Ukuran/format file, retention file/export/audit, checksum dan scan yang tersedia pada deployment.
6. Query filters/sort/projection setelah DATA_MODEL/TEST_PLAN direview.
7. Hak delegasi finance tetap Owner-only kecuali produk eksplisit menyetujui capability scope/limit/audit.

### Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Kontrak logis R1: envelope, hash/receipt/epoch, retry, offline, OFF-16/17, query whitelist, registry operasi, file/export/recovery. Tidak ada app atau DDL dibuat. |
| 0.2 | 23 September 2026 | Menyelaraskan FIN-11 purchase claim vs linkage OFF-16, pencabutan sesi wajib SEC-16, batas identity ABK, arsip Q-11, adjustment kas positif + arah, subtype supplier advance CASH-09/AC-14, dan natural-key konversi OFF-17. |
| 0.3 | 23 September 2026 | Menyelaraskan uang muka supplier ke aggregate DATA_MODEL dan menambahkan subtype refund aktual cash IN + aplikasi receivable tanpa membalik biaya yang belum terjadi; menutup mismatch supplier advance pada daftar keputusan terbuka. |
