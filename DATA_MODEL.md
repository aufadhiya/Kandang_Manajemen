# Model Data Logis R1 — Kandang Manajemen

| Metadata | Nilai |
|---|---|
| Versi dokumen | 0.1 |
| Tanggal | 23 September 2026 |
| Status | Usulan model logis untuk ditinjau; bukan persetujuan aturan produk, DDL, migrasi yang dijalankan, atau pilihan vendor/ORM |
| Cakupan | Identitas dan grant R1, kandang/periode, recording DAILY, penerimaan informasional, pembelian/klaim, kas/biaya/kewajiban, gaji/kasbon/upah, hasil aktual mitra, opening, lampiran, audit, outbox, ekspor, dan recovery |
| Sumber makna bisnis | [PRD.md](PRD.md), terutama §5–§14, §16, §20, §22, §25, dan GOLD-01/02/05/06/07/12/13/14/20/24/25/28/29/30 |
| Sumber batas teknis | [ARCHITECTURE.md](ARCHITECTURE.md), terutama §2–§11 dan §15 |

Dokumen ini memperinci kamus logis minimum untuk R1. Nama `snake_case` di bawah adalah nama kanonis yang diusulkan untuk komunikasi dengan kontrak API dan dokumen implementasi, bukan kewajiban nama tabel fisik. Simpan di database transaksional relasional dengan constraint yang setara setelah stack dipilih melalui ADR. Jangan membuat kode, DDL, atau migrasi dari dokumen ini tanpa persetujuan fase implementasi.

## Daftar isi

1. [Cara membaca dan batas keputusan](#dm01)
2. [Tipe, presisi, waktu, dan kolom umum](#dm02)
3. [Invarian model](#dm03)
4. [Identitas, tenant, grant, dan pekerja](#dm04)
5. [Kandang, master, periode, dan opening](#dm05)
6. [Sumber transaksi dan status posting](#dm06)
7. [Kas, pembelian, klaim, penerimaan, dan efek](#dm07)
8. [Biaya, alokasi, kewajiban, dan pelunasan](#dm08)
9. [Gaji periode, kasbon, dan upah terpisah](#dm09)
10. [Modal, prive, dan kewajiban Owner pada buku usaha](#dm10)
11. [Settlement aktual dan payout](#dm11)
12. [Recording DAILY, revisi, dan coverage](#dm12)
13. [Receipt, offline, audit, file, outbox, dan ekspor](#dm13)
14. [Constraint, indeks, dan urutan lock](#dm14)
15. [Aljabar koreksi dan versi](#dm15)
16. [Contoh sintetis yang harus cocok](#dm16)
17. [Versi skema, retensi, dan pemulihan](#dm17)
18. [Yang tidak dimodelkan sebagai dependensi R1](#dm18)
19. [Usulan dan keputusan yang masih terbuka](#dm19)

<a id="dm01"></a>
## 1. Cara membaca dan batas keputusan

PRD tetap satu-satunya sumber definisi makna bisnis. Kebutuhan bertanda `K` sudah terkonfirmasi dalam PRD; `D` adalah default rancangan yang belum otomatis menjadi persetujuan; `Q` tetap terbuka. Rincian skema baru pada dokumen ini ditandai **usulan model**. Menulis model tidak menutup Q dan tidak mengubah PRD.

| Label dalam dokumen | Makna |
|---|---|
| **K — terkonfirmasi** | Wajib mempertahankan kebutuhan K yang dirujuk, misalnya multi-ABK, kasbon mandiri, DAILY bersama, dan pencatatan rupiah bulat. |
| **D — default PRD** | Ikuti default sementara PRD dengan status usulannya tetap terlihat; contohnya satu primary owner, review belanja oleh Owner, dan namespace username global. |
| **Usulan model** | Pilihan pemodelan untuk menghindari ambiguitas implementasi; perlu review saat dokumen teknis disatukan. Bukan keputusan produk tambahan. |
| **R1** | Bagian yang dibutuhkan untuk cakupan rilis pertama. Jangan meminta R2 sebagai prasyarat. |
| **R2** | Pengembangan yang ditunda. Nama disebut hanya untuk menjelaskan batas; jangan buat tabel, FK wajib, dummy row, atau layanan R2 demi memenuhi model R1. |

Hierarki scope: `tenant` memiliki data usaha; `farm` (kandang) memiliki satu atau banyak bangunan dan siklus; satu `cycle` dapat melibatkan beberapa bangunan. Keuangan pribadi Owner bukan anak tenant, tidak aktif pada R1. Keanggotaan tenant, izin kandang, pekerja, dan penanggung uang adalah relasi yang berbeda.

Nama pengguna, nomor dokumen, plat, nama kandang, dan nomor periode bukan primary key. Foreign key bisnis harus stabil dan memeriksa tenant yang sama. Semua route, job, agregasi, lampiran, receipt, dan export memerlukan otorisasi server sesuai [PRD §6](PRD.md#s06); menyimpan `tenant_id` bukan pengganti pengecekan izin.

Pemetaan nama untuk menyatukan dokumen teknis: API `purchase` menunjuk aggregate `purchase_document`; API `daily_summary` menunjuk header `daily_recording` dan revisi efektifnya, bukan tabel summary kedua; command API `cash_event.claim.*` menunjuk `cash_claim` dan `cash_event_claim_link`, sedangkan cash transfer kanonis menunjuk `cash_transfer` + dua `cash_movement`; `claim_resolution` hanya mencatat terminal FIN-11 untuk klaim pembelian, bukan linkage OFF-16; API `capture_note.convert` menunjuk `capture_note_conversion` dengan natural dedupe key registration+note dan paling banyak satu target `cash_claim`; API `cash_reconciliation` menunjuk `cash_count` dan `cash_adjustment`; API `settlement_id` menunjuk `partner_settlement_version.id`, `component_id` menunjuk `settlement_component.id`, dan `suspense_receipt_id` menunjuk `partner_payout.id` saat status `UNRECONCILED`; `cost_source_id` menunjuk sumber biaya kanonis/`cost_entry` sesuai command. API `business_category.save` memakai `business_category`; `employee_advance`, `salary_agreement`, `work_compensation`, dan `partner_payout` merujuk aggregate model yang sama. Jenis akun API/model sama: `BUSINESS_CASH`, `BUSINESS_BANK_MANUAL`, `FARM_CASH`, `EMPLOYEE_CUSTODY`; rekening pribadi eksternal tidak menjadi akun tenant. API tidak memberi client akses menulis langsung ke tabel efek.

<a id="dm02"></a>
## 2. Tipe, presisi, waktu, dan kolom umum

### 2.1 Tipe logis

| Jenis | Representasi logis dan batas |
|---|---|
| `id` | ID stabil dan tidak bermakna bisnis. API_SYNC_SPEC mengusulkan UUID lowercase di wire; tipe DB/generator menunggu ADR. Jangan membentuk ID dari nama, nomor DO, tanggal, atau nominal. |
| `tenant_id`, `user_id`, dan FK lain | Bertipe sama dengan ID induk. Untuk relasi antar-entitas tenant, gunakan FK gabungan `(tenant_id, id)` bila didukung agar relasi lintas-tenant ditolak oleh database. |
| `amount_idr` | IDR bulat, tersimpan sebagai integer rupiah atau tipe decimal tepat setara. Tidak boleh float biner atau pecahan rupiah. Payload dapat diserialisasi sebagai string integer agar aman. Input pecahan ditolak, tidak dipotong. |
| `quantity` | Decimal tepat dengan paling banyak 6 digit pecahan, disertai `unit_code` dan bila perlu snapshot konversi. Kuantitas fisik ekor dan jumlah tabung adalah integer ≥0; konsumsi/berat mengikuti satuan. |
| `rate`, `percentage` | Decimal tepat; tarif mengikuti satuan dan maksimum 6 digit pecahan. Persentase input tidak dibulatkan diam-diam; tampilan dua desimal tidak mengubah nilai tersimpan. |
| Intermediate finansial | Presisi sedikitnya 12 digit pecahan desimal atau aritmetika tepat yang setara dan diuji. Half-up ke Rp1 hanya pada batas pengakuan. Alokasi sisa memakai aturan COST-05, bukan pembulatan tiap baris tanpa rekonsiliasi. |
| `currency_code` | Selalu eksplisit; hanya `IDR` diterima untuk pembukuan R1. Mata uang lain ditolak, tidak dikonversi dengan kurs buatan. |
| `date` | Tanggal kalender lokal untuk hari kerja/kejadian jika aturan bisnis menyebut tanggal. Bukan timestamp server. |
| `timestamp` | UTC. Simpan sumber waktu dan zona IANA kandang untuk menurunkan `business_date`; jangan hardcode WIB untuk semua tenant. |
| nilai tidak diketahui | `NULL`/flag unknown, bukan angka nol. Nol hanya berarti diketahui nol dan harus memenuhi aturan konfirmasi yang sesuai. |
| enum | Nilai bisnis terbatas, tervalidasi server; mengganti label tampilan tidak mengubah kelas posting. Enum di dokumen adalah usulan ejaan kanonis. |

### 2.2 Kolom bersama

Data yang ditulis secara mutable memiliki paling sedikit:

- `id`, `tenant_id` (kecuali entitas identitas global atau relasi eksplisit yang tidak tenant-scoped), `created_at`, `created_by_user_id` bila ada aktor user;
- `updated_at`, `updated_by_user_id`, `version` bilamana record dapat diedit; `version` dimulai dari 1 dan bertambah tepat satu pada setiap revisi efektif;
- `occurred_at`/`event_date` untuk kejadian bisnis, `created_at_device` bila tersedia, `received_at_server`, dan `posted_at` untuk command yang membukukan efek;
- `source_timezone`/snapshot timezone untuk tanggal usaha; waktu HP adalah masukan kejadian, bukan waktu posting authoritative;
- status lifecycle eksplisit. Jangan gabungkan status review, posting, settlement, fisik periode, keuangan periode, kelengkapan, dan sinkron menjadi satu enum.

Semua field nullable diberi arti. Status kolom yang tidak berlaku tidak diisi nilai rekaan. Data historis menyimpan snapshot nama pihak, label, unit/konversi, tarif, dasar alokasi, serta tanggal yang berlaku saat dipakai; perubahan master hanya berpengaruh ke transaksi baru.

Data finansial yang telah diposting dan revisi DAILY yang pernah efektif bersifat append-only. Koreksi memakai record baru bertaut ke versi/sumber asal, bukan mengubah payload lama. Draft yang belum menimbulkan efek server boleh dibuang sesuai kebijakan. Penghapusan master yang sudah dipakai adalah arsip/nonaktif, bukan cascade delete histori.

<a id="dm03"></a>
## 3. Invarian model

ID berikut adalah invariant usulan lintas-entitas untuk memudahkan review dan tes. Mereka tidak mengganti nomor kebutuhan PRD.

| ID | Invariant |
|---|---|
| DM-01 | Setiap sumber dan efek bisnis mempunyai satu tenant yang sama; FK gabungan/validasi server mencegah header, line, akun, pekerja, kandang, siklus, dan pihak dari tenant lain tercampur. |
| DM-02 | Saldo kas berasal dari opening terverifikasi ditambah/minus mutasi kas yang committed; total biaya berasal dari `cost_entry` sah, bukan pembayaran, pengajuan, klaim, transfer internal, atau ringkasan bebas edit. |
| DM-03 | Satu kejadian finansial mempunyai satu `financial_source_event` kanonis. Semua cash movement, cost, kewajiban, application, audit, receipt dan outbox yang diwajibkan untuk kejadian itu commit bersama atau tidak ada satu pun efeknya. |
| DM-04 | Sumber yang sama tidak menghasilkan efek ekonomi yang sama dua kali: gunakan constraint sumber-efek dan command receipt. ID operasi berbeda tidak membuktikan dua laporan dengan ID berbeda adalah dua kejadian berbeda. |
| DM-05 | Satu periode fisik memiliki `physical_status` sendiri dan `financial_status` sendiri. Maksimum satu `ACTIVE` per kandang. `FINISHED` tidak sama dengan `LOCKED`. |
| DM-06 | Satu rekap DAILY berlaku untuk setiap `(cycle_id, business_date)`, bersama lintas-ABK/perangkat. Revisi mengganti versi efektif sebelumnya; bukan menambah nilai lama. |
| DM-07 | Klaim pengeluaran nyata yang belum selesai tidak mengubah saldo kas atau biaya sah; penolakan bukan pengembalian uang dan bukan potongan gaji. |
| DM-08 | Transfer antar-akun usaha mengubah dua saldo akun dengan jumlah sama dan tidak menciptakan income/cost. Pemegang uang dan pemilik akun adalah konsep berbeda. |
| DM-09 | Kewajiban/piutang yang belum dibayar dapat tetap open setelah periode financial lock. Pembayaran setelah lock melunasi hak yang sudah diakui dan tidak mengubah snapshot biaya/penghasilan. |
| DM-10 | Kasbon usaha, uang pegangan, reimbursement ABK, gaji periode, dan upah pekerjaan adalah saldo/dokumen berbeda. Jangan saling pindah kategori otomatis. |
| DM-11 | Pembayaran settlement tidak membuktikan hak net atau laba. Tanpa hak diketahui, gunakan penerimaan suspense/`UNRECONCILED`; tidak menciptakan piutang sama dengan nominal pembayaran. |
| DM-12 | `null` bukan nol. Status lengkap tidak boleh disimpulkan dari data yang hilang, cache lama, lampiran pending, atau total yang kebetulan cocok. |
| DM-13 | R1 tidak mempunyai persediaan/consumption: penerimaan feed/sapronak dan DAILY tidak membuat stock movement atau biaya ganda. |
| DM-14 | Grant terkini disahkan server pada setiap mutation dan baca terlindungi; data/receipt tidak memberikan grant baru dan restore tidak boleh menghidupkan kembali grant yang sudah dicabut. |

<a id="dm04"></a>
## 4. Identitas, tenant, grant, dan pekerja

### 4.1 Kamus identitas dan akses

#### `app_user`

- Field: `id`, `username`, `username_normalized`, `principal_kind` (`OWNER`, `TENANT_MANAGED_ABK`, `PLATFORM_ADMIN`, `PPL`), `managed_by_tenant_id` nullable untuk `TENANT_MANAGED_ABK` saja, `account_status` (`ACTIVE`, `DISABLED`, `RECOVERY_REQUIRED` usulan), `credential_version`, `created_at`, `disabled_at` nullable.
- Password hash/secret hanya dikelola subsistem kredensial sesuai `SECURITY_OPERATIONS.md`; jangan taruh password, reset token, atau rahasia pada audit, export, receipt, atau log.
- Relasi: owner/global identity memiliki membership sesuai proses provision/recovery yang sah. Identitas `TENANT_MANAGED_ABK` hanya memiliki membership/grant pada tenant manager; dapat ditautkan ke paling banyak satu `employee` tenant tersebut. Employee tanpa login tetap diperbolehkan.
- Constraint: `username_normalized` unik global adalah default D-25, masih usulan/terkait Q-02; implementasi harus menunggu keputusan namespace dan tidak meminta email/kode usaha untuk login. Username bukan FK histori.
- Constraint identitas D-25/Q-02 (usulan aman, belum keputusan final): `managed_by_tenant_id` immutable/non-null hanya untuk `TENANT_MANAGED_ABK`. ABK terkelola tidak dapat ditautkan ke principal Owner, Admin, PPL, co-owner/multi-owner, atau identitas yang memiliki membership/grant di tenant bisnis lain; jangan mengubah principal_kind untuk memakai kembali akun lintas peran. Buat identitas ABK khusus tenant manager. Menerima invite/grant lain, transfer Owner, atau perubahan principal class memerlukan desain/persetujuan baru, bukan link/reset rutin.
- Index: unique username sesuai keputusan Q-02; index `(account_status, id)` untuk autentikasi/administrasi.

#### `credential_reset_event`

- Field: `id`, `managed_by_tenant_id`, `target_user_id`, `requested_by_owner_user_id`, `auth_reset_request_id`, `credential_version_before`, `credential_version_after`, `sessions_revoked`, `occurred_at`, `result_status`, `reason` minimum bila kebijakan memerlukan.
- Relasi: audit control-plane untuk reset satu akun ABK yang dikelola tenant; tidak menyimpan password, temporary credential, reset secret, atau token.
- Constraint: target wajib `principal_kind=TENANT_MANAGED_ABK` dan `target.managed_by_tenant_id = managed_by_tenant_id`; requester wajib Owner aktif pada tenant yang sama dengan izin terkini; reset harus mencabut sesi lama (`sessions_revoked=true`) dan menaikkan credential version; request ID unik untuk retry.
- Larangan: tidak mereset Owner, Admin, PPL, identitas milik tenant lain, atau satu principal yang dipakai lintas tenant/peran lewat alur reset ABK. Reset tidak mengubah username, principal kind, membership, grant, employee history, author, saldo, ataupun tenant manager.
- Index: unique `(managed_by_tenant_id, auth_reset_request_id)`, `(managed_by_tenant_id, target_user_id, occurred_at)`.

#### `tenant`

- Field: `id`, `display_name`, `service_status` (`ACTIVE`, `READ_ONLY`, `ARCHIVED`), `primary_owner_user_id`, `version`, `created_at`, `archived_at` nullable.
- Relasi: 1..N membership, 0..N farm; primary owner harus memiliki membership `OWNER` aktif di tenant yang sama.
- Constraint: satu primary owner untuk default D-01 R1; co-owner/pembagian saham bukan fitur yang tersirat. Status READ_ONLY menolak mutation bisnis, tidak menghapus histori.
- Index: `(service_status, id)`; nama tampil tidak perlu unik.

#### `tenant_membership`

- Field: `id`, `tenant_id`, `user_id`, `tenant_role` (`OWNER`, `ABK` pada R1), `status` (`ACTIVE`, `REVOKED`), `version`, `valid_from`, `valid_to` nullable.
- Relasi: N..1 tenant dan user; satu membership dapat memiliki beberapa `farm_grant`.
- Constraint/FK: unique `(tenant_id, user_id)`; FK gabungan tenant/user; role global Admin bukan membership finansial dan tidak memberi akses baca data bisnis. Untuk `principal_kind=TENANT_MANAGED_ABK`, satu-satunya membership (termasuk histori/revoked) harus `(tenant_id=managed_by_tenant_id, tenant_role=ABK)`; tidak boleh punya membership pada tenant lain, role Owner, atau link ke co-owner/PPL identity. Enforce di constraint/trigger/service transaction saat create/link/revoke dan role change, bukan hanya saat query.
- Constraint tambahan: membership historis/revoked tetap dihitung; tidak boleh membuat membership kedua bagi `TENANT_MANAGED_ABK`. Karena keputusan ini bergantung pada `app_user.principal_kind`, database harus menegakkannya melalui trigger/constraint lintas-tabel atau mekanisme transaksional setara yang mengunci `app_user` dan memeriksa semua membership sebelum insert/link/role-change. Unique `(tenant_id,user_id)` saja tidak cukup.
- Index: `(tenant_id, status, tenant_role)`, `(user_id, status)`.

#### `farm_grant`

- Field: `id`, `tenant_id`, `farm_id`, `user_id`, `capability_set`, `status`, `valid_from`, `valid_to` nullable, `version`, `granted_by_user_id`, `revoked_by_user_id` nullable.
- Relasi: N..1 farm dan membership. Tidak perlu ada satu grant global per tenant; akses kandang eksplisit.
- Constraint: paling banyak satu grant aktif untuk `(tenant_id, farm_id, user_id)`; farm, tenant membership, dan user harus cocok. Beberapa ABK boleh aktif di satu kandang. Grant bukan data pegawai; pekerja tanpa akun tetap dapat ditugaskan. Untuk ABK terkelola, `tenant_id` setiap grant wajib sama dengan `app_user.managed_by_tenant_id`; tidak ada grant silang tenant walau request membawa user/farm IDs yang valid.
- Capability R1 dibatasi whitelist operasi Owner/ABK sesuai PRD. Finansial sensitif bukan otomatis dibuka ke ABK karena membership kandang.
- Index: `(tenant_id, user_id, status)`, `(tenant_id, farm_id, status)`.

#### `employee`

- Field: `id`, `tenant_id`, `display_name`, `user_id` nullable, `employee_status` (`ACTIVE`, `INACTIVE`), `valid_from`, `valid_to` nullable, catatan minimum opsional.
- Relasi: satu employee dapat memiliki histori assignment, advance, gaji, upah, dan klaim; `user_id` menghubungkan login bila ada.
- Constraint: FK `(tenant_id,user_id)` bila `user_id` tidak null; unique `(tenant_id,user_id)` hanya untuk nilai non-null. `user_id` yang dipakai sebagai login ABK wajib menunjuk `principal_kind=TENANT_MANAGED_ABK` dengan manager/tenant yang sama; jangan tautkan Owner/Admin/PPL, akun multi-owner, atau ABK tenant lain. Owner yang mencatat usaha memakai identitas Owner dan tidak perlu menyamar sebagai employee. Menonaktifkan pegawai tidak memindahkan saldo/riwayat ke pekerja lain.
- Index: `(tenant_id, employee_status, display_name)`, `(tenant_id, user_id)`.

#### `employee_farm_assignment`

- Field: `id`, `tenant_id`, `employee_id`, `farm_id`, `valid_from`, `valid_to` nullable, `assignment_status`, `version`, `created_by_user_id`.
- Relasi: N..1 employee/farm; assignment dapat dibuat tanpa login. Jika employee mempunyai login, assignment bukan pengganti `farm_grant`.
- Constraint: FK gabungan tenant untuk employee/farm; rentang tanggal valid dan tidak tumpang-tindih untuk assignment identik kecuali ada keputusan eksplisit. Riwayat lama tidak ditulis ulang saat pekerja pindah.
- Index: `(tenant_id, farm_id, assignment_status, valid_from)`, `(tenant_id, employee_id, valid_to)`.

#### `device_registration` (metadata provenance R1)

- Field minimum: `id`, `tenant_id` asal, `user_id` asal, `device_key_ref` non-rahasia, `registration_status`, `registered_at`, `revoked_at` nullable, `version`.
- Relasi: perangkat dapat membuat banyak local operation/capture note, tetapi registrasi bukan grant dan bukan jaminan bahwa command boleh diposting setelah reconnect.
- Constraint: tenant/user harus pernah sah; referensi asal immutable. Device key/secret tidak diekspor atau dicatat di audit.
- Index: `(tenant_id, user_id, registration_status)`.

<a id="dm05"></a>
## 5. Kandang, master, periode, dan opening

### 5.1 Master R1

#### `farm`

- Field: `id`, `tenant_id`, `name`, `timezone_iana`, `status` (`ACTIVE`, `ARCHIVED`), alamat/lokasi opsional, `version`.
- Relasi: satu tenant; memiliki 0..N `building`, `cycle`, akun kas kandang bila dibuat, dan grant.
- Constraint: timezone harus nama zona IANA valid; nama tidak menjadi ID.
- Index: `(tenant_id, status, name)`.

#### `building`

- Field: `id`, `tenant_id`, `farm_id`, `name`, `capacity_head_count` nullable bila belum diketahui, `status`, `version`.
- Relasi: N..1 farm; dapat menjadi baris alokasi DOC; tidak wajib untuk recording DAILY, pembelian, atau alokasi biaya kandang-global.
- Constraint: kapasitas bila diketahui integer ≥0; nama aktif dapat unik per farm sesuai keputusan produk, bukan unique tenant-wide.
- Index: `(tenant_id, farm_id, status)`.

#### `counterparty`

- Field: `id`, `tenant_id`, `display_name`, `status`, `version`; detail kontak/rekening sensitif terpisah bila benar-benar perlu.
- Relasi: satu pihak memiliki 1..N `counterparty_role`; transaksi boleh memakai snapshot text sementara sebelum dipadankan. Satu pihak boleh berperan supplier dan partner sekaligus, tetapi saldo tetap berasal dari dokumen/obligation masing-masing. `partner_id` menunjuk counterparty yang mempunyai role PARTNER.
- Constraint: jangan merge pihak hanya karena nama/nomor terlihat sama; jangan menyimpan nomor rekening lengkap bila tidak diperlukan.
- Index: `(tenant_id, status, display_name)`.

#### `counterparty_role`

- Field: `id`, `tenant_id`, `counterparty_id`, `role_kind` (`SUPPLIER`, `PARTNER`, `BROKER`, `OWNER`, `EMPLOYEE`, `OTHER`), `status`, `valid_from`, `valid_to` nullable.
- FK: `(tenant_id,counterparty_id)`; unique `(counterparty_id, role_kind)` untuk role efektif, versi/history bila role dinonaktifkan.
- Index: `(tenant_id, role_kind, status, counterparty_id)`.

#### `business_category`

- Field: `id`, `tenant_id`, `direction` (`INCOME`, `EXPENSE`), `label`, `accounting_class`, `status` (`ACTIVE`, `ARCHIVED`), `is_system_class`, `version`.
- Relasi: opsional pada purchase line/cost/income entry sebagai label pengelompokan. Transfer, stock (R2), principal pinjaman, dan kelas accounting tidak dapat dibuat menjadi expense/income dengan mengganti nama kategori.
- Constraint: edit label tidak mengubah class; kategori yang sudah dipakai hanya archive; unique label normalized per tenant/direction bila disetujui setelah review.
- Index: `(tenant_id, direction, status, label)`.

#### `item_catalog` (opsional R1, bukan inventory)

- Field: `id`, `tenant_id`, `name`, `default_unit_code` nullable, `suggested_purchase_class` nullable, `status` (`ACTIVE`, `ARCHIVED`), `version`.
- Relasi: 0..N purchase line/operational receipt melalui ID opsional; transaksi tetap menyimpan nama dan satuan snapshot. Tidak wajib SKU, lokasi, stok minimum, saldo, atau consumption.
- Constraint: unit/klasifikasi master yang berubah tidak menulis ulang histori. Saran feed/produk tidak membuktikan yang dipakai; recording harus menyimpan pilihan/kuantitas aktual.
- Index: `(tenant_id, status, name)`.

#### `work_rate_template` (R1; dipilih bila relevan)

- Field: `id`, `tenant_id`, `label`, `unit_code`, `rate_amount_idr`, `effective_from`, `effective_to` nullable, `status`, `version`, `created_by_user_id`.
- Relasi: template opsional dipilih saat membuat `work_compensation`; transaksi menyalin label/unit/rate snapshot, tidak FK ke tarif yang dapat berubah.
- Constraint: rate nonnegative dan rupiah bulat per unit; histori template tidak mengubah upah yang sudah disetujui.
- Index: `(tenant_id, status, label, effective_from)`.

### 5.2 `cycle` dan lifecycle dua sumbu

#### `cycle`

- Field wajib/logis: `id`, `tenant_id`, `farm_id`, `cycle_code`/`name`, `physical_status` (`DRAFT`, `ACTIVE`, `FINISHED`, `CANCELLED`), `financial_status` (`OPEN`, `REVIEW`, `LOCKED`), `recording_mode` (`OFF`, `DAILY` R1), `timezone_snapshot`, `version`.
- Field tanggal/cakupan: `planned_chick_in_date` nullable, `actual_chick_in_at` nullable, `tracking_started_at` nullable, `cutoff_at` nullable, `history_coverage` (`COMPLETE`, `PARTIAL`, `UNKNOWN`) nullable sebelum periode berjalan disahkan, `history_source` nullable.
- Field populasi DOC yang berbeda: `doc_billed_count` nullable, `doc_bonus_count` nullable, `doc_rejected_or_arrival_dead_count` nullable, `initial_live_count` nullable, `building_allocation_status` (`PENDING`, `COMPLETE`), `unallocated_doc_count` nullable.
- Field tambahan: `partner_id` nullable saat draft, `current_financial_snapshot_id` nullable hanya saat finance OPEN/REVIEW, catatan; jangan mensyaratkan kontrak, gaji, stok, atau RHPP untuk membuat draft.
- Relasi: N..1 farm, partner opsional, banyak `cycle_building_allocation`, `daily_recording`, pembelian/cost allocation, payroll agreement, settlement. Periode adalah child kandang, bukan child bangunan.
- Constraint: `ACTIVE` membutuhkan tanggal chick-in aktual dan `initial_live_count > 0`; unique maksimum satu cycle ACTIVE per `(tenant_id, farm_id)`; jumlah alokasi bangunan + unallocated DOC harus tepat sama dengan populasi awal bila lengkap; kapasitas tidak otomatis berubah.
- Index: `(tenant_id, farm_id, physical_status)`, `(tenant_id, farm_id, financial_status)`, `(tenant_id, actual_chick_in_at)`.

`physical_status` dan `financial_status` tidak boleh digabung. Cycle baru dapat aktif setelah fisik sebelumnya `FINISHED` walau finance lama masih OPEN/REVIEW. `LOCKED` mengacu finance saja. Gate finansial mengikuti CYC-09–11; utang/piutang yang nilainya final boleh belum dibayar. Pembayaran sesudah lock tidak mengubah snapshot biaya/penghasilan. Late sync yang berdampak pada snapshot masuk usulan koreksi, bukan diterapkan diam-diam.

#### `cycle_building_allocation`

- Field: `id`, `tenant_id`, `cycle_id`, `building_id`, `capacity_snapshot` nullable, `doc_live_count`, `owner_override_reason` nullable, `version`.
- Relasi: N..1 cycle/building dalam farm yang sama.
- Constraint: `doc_live_count` integer ≥0; jumlah baris plus `cycle.unallocated_doc_count` = `initial_live_count`; jika alokasi `COMPLETE`, unallocated = 0 dan semua data bangunan diketahui. Bila populasi melebihi capacity snapshot, perlu konfirmasi Owner beralasan (D-12), tidak mengubah kapasitas master.
- Index: unique `(cycle_id, building_id)`, `(tenant_id, cycle_id)`.

#### `cycle_physical_close`

- Field: `id`, `tenant_id`, `cycle_id`, `actual_finished_date`, `declared_by_user_id`, `declared_at`, `asserted_empty`, `measured_final_head_count` nullable, rekap disposisi/selisih diketahui nullable, `version`, bukti opsional.
- Relasi: cycle mempunyai histori deklarasi; hanya versi efektif terakhir menetapkan FINISHED.
- Constraint: deklarasi `asserted_empty=true` tidak boleh digambarkan sebagai sensus terukur jika hitungan null; finish tidak mengubah finance status menjadi LOCKED.
- Index: `(tenant_id, cycle_id, declared_at)`.

#### `cycle_financial_snapshot` dan `cycle_financial_lock_event`

- `cycle_financial_snapshot`: `id`, `tenant_id`, `cycle_id`, `revision`, `snapshot_status` (`PREVIEW`, `LOCKED`), `captured_at`, `locked_by_user_id` nullable untuk preview, `cycle_version`, `source_version_manifest`/hash, `data_cutoff`, `last_sync_acknowledged_at` nullable, ringkasan biaya/hak/alokasi/status cakupan yang dibekukan, `history_coverage`, `settlement_classification_status`, `report_hash`, `version`.
- Relasi: cycle memiliki banyak snapshot immutable; satu snapshot dapat direferensikan oleh export/manifest. Saat `financial_status=LOCKED`, `cycle.current_financial_snapshot_id` wajib menunjuk snapshot LOCKED cycle itu. Preview di REVIEW bukan lock dan tidak boleh ditampilkan sebagai laba final.
- `cycle_financial_lock_event`: `id`, `tenant_id`, `cycle_id`, `action` (`LOCK`, `REOPEN`), `snapshot_id` nullable untuk reopen, `actor_user_id`, `occurred_at`, `reason` wajib untuk REOPEN, `expected_cycle_version`, receipt.
- Constraint: setiap lock event berhasil membekukan manifest versi sumber setelah gate CYC-11 lolos di transaksi yang sama dengan update status; reopen tidak menghapus/mengubah snapshot lama, memerlukan Owner, alasan, audit, dan mengosongkan pointer current; lock ulang membuat revision snapshot baru. Periode OPEN/REVIEW boleh punya preview tetapi tidak punya snapshot authoritative current.
- Gate snapshot tidak mensyaratkan piutang/utang sudah dibayar atau DAILY lengkap bila data finansial sudah final; tetap merekam coverage PARTIAL/GAP/OFF/UNKNOWN secara jujur. Tidak ada `force lock` yang melewati pending claim/gaji/settlement/cost classification/cutoff.
- Index: unique `(tenant_id, cycle_id, revision)`, `(tenant_id, cycle_id, snapshot_status, captured_at)`, `(tenant_id, cycle_id, action, occurred_at)`.

### 5.3 Mode, cutoff, dan mulai di tengah siklus

#### `cycle_recording_revision`

- Field: `id`, `tenant_id`, `cycle_id`, `revision`, `recording_mode`, `effective_from_date`, `cutoff_at`, `opening_source` nullable, `coverage_status`, `created_by_user_id`, `created_at`, `supersedes_id` nullable, `reason` nullable.
- Relasi: satu cycle memiliki revisi mode/cutoff; recording daily menunjuk revisi yang berlaku pada tanggalnya.
- Constraint: revision berurutan dan unik `(cycle_id, revision)`; tidak ada dua revisi efektif untuk tanggal sama. Perubahan OFF↔DAILY butuh cutoff/coverage yang eksplisit dan review Owner; tidak menggabungkan overlap diam-diam.
- Index: `(tenant_id, cycle_id, effective_from_date)`.

Onboarding periode berjalan menyimpan tanggal chick-in sebenarnya serta cutoff C: kejadian `< C` masuk cakupan opening, kejadian `> C` menjadi event baru. **Kejadian tepat C tidak mempunyai default sisi**: Owner harus menetapkan `INCLUDED_IN_OPENING` atau `POST_CUTOFF_EVENT` sebelum posting/pengesahan yang terdampak. Simpan keputusan per kejadian dalam `cutoff_event_assignment`; query opening/event memakai keputusan yang sama, tidak aturan `>= C` tersendiri. Populasi cutoff bukan DOC baru; history PARTIAL/UNKNOWN tidak dianggap lengkap.

#### `opening_batch`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `scope_kind` (`TENANT`, `FARM`, `CYCLE`), `farm_id` nullable, `cycle_id` nullable, `cutoff_at` (batas dengan keputusan khusus kejadian tepat C), `cutoff_business_date` nullable, `timezone_snapshot` nullable, `history_coverage` (`COMPLETE`, `PARTIAL`, `UNKNOWN`), `source_description`, `batch_status` (`DRAFT`, `RECONCILIATION_PENDING`, `VERIFIED`, `SUPERSEDED`), `version`, `verified_by_user_id`/`verified_at` nullable, `supersedes_id` nullable.
- Relasi: satu batch berisi banyak `opening_position`; batch VERIFIED menjadi satu baseline efektif pada scope/cutoff. Koreksi membuat batch versi baru dan menunjuk versi lama.
- FK/constraint: `scope_kind` memilih tepat satu target yang cocok; cycle dan farm harus tenant sama dan cycle-farm konsisten. Tidak lebih dari satu batch VERIFIED efektif untuk target+cutoff+jenis posisi. Pengesahan oleh Owner online; field/bukti unknown tidak dianggap nol.
- Index: `(tenant_id, scope_kind, farm_id, cycle_id, cutoff_at)`, `(tenant_id, batch_status, cutoff_at)`.

#### `cutoff_event_assignment`

- Field: `id`, `tenant_id`, `opening_batch_id`, stable `event_identity_key`, `source_event_id` nullable jika kejadian masih di luar aplikasi, `external_source_snapshot` wajib bila source ID belum ada, `side` (`INCLUDED_IN_OPENING`, `POST_CUTOFF_EVENT`), `decided_by_user_id`, `decided_at`, `version`.
- Unique `(opening_batch_id,event_identity_key)` dan scope source sama; satu keputusan efektif per kejadian di batas. Identitas kejadian harus dapat ditelusuri/ditaut saat input kemudian, bukan dicocokkan otomatis dari nominal/tanggal saja. Keputusan sisi dan pengecualian overlap ikut disahkan bersama opening. Sisi missing/ambigu menahan baris terdampak sebagai reconciliation-pending; event tidak boleh sekaligus mengubah baseline dan saldo setelah cutoff.
- Koreksi sisi setelah disahkan memakai revisi opening dan koreksi event terkait atomik serta audit, bukan mengubah timestamp agar lolos dedupe. Uji `< C`, `= C` pada kedua pilihan, dan `> C`, termasuk retry/revisi.

#### `opening_position`

- Field: `id`, `tenant_id`, `opening_batch_id`, `position_kind` (`CASH_ACCOUNT`, `SUPPLIER_PAYABLE`, `SUPPLIER_ADVANCE`, `EMPLOYEE_REIMBURSEMENT`, `EMPLOYEE_ADVANCE`, `SALARY_PAYABLE`, `WORK_WAGE_PAYABLE`, `PARTNER_RECEIVABLE`, `PARTNER_PAYABLE`, `OWNER_PAYABLE`, `UNMATCHED_RECEIPT_SUSPENSE`, `OTHER_APPROVED`), typed target FKs (`cash_account_id`, `employee_id`, `partner_id`, `counterparty_id`, `cycle_id`) sesuai `position_kind`, `balance_known`, `balance_amount_idr` nullable, `currency_code=IDR`, `position_date`, `source_snapshot`, `version`.
- Field rekonsiliasi opsional: `gross_entitlement_amount_idr`, `already_paid_amount_idr`, `advance_already_applied_amount_idr`, `unapplied_advance_amount_idr`, `recognized_cost_before_cutoff_amount_idr`, masing-masing nullable bila unknown, plus `historical_cost_coverage` (`RECOGNIZED`, `PARTIAL`, `UNKNOWN`, `NOT_APPLICABLE`).
- Constraint: `balance_known=true` mengharuskan amount terisi (0 sah bila memang nol); false berarti amount NULL. Target persis sesuai kind, tidak memakai string party semata jika employee/partner/account tersedia. Bila semua komponen payroll diketahui, gross − paid − advance already applied = remaining salary payable; nilai advance unapplied tidak boleh diterapkan lagi ke payable yang sudah net.
- Unique: satu baris per batch dan natural position key (kind + typed target + cycle/counterparty yang berlaku); line duplikat untuk kas/utang/employee yang sama ditolak.
- Index: `(tenant_id, opening_batch_id)`, `(tenant_id, position_kind, position_date)`, typed target FK yang dipakai daftar saldo.

Opening cash adalah baseline, bukan cash movement baru; opening receivable/payable/kasbon bukan transaksi income/cost/disbursement baru. Saldo sesudah cutoff = opening terverifikasi + efek yang terjadi setelah cutoff. Jangan sekaligus memasukkan transaksi lama sebagai opening dan mengimpor/menghitungnya lagi. Sumber pembuktian/cakupan disimpan per posisi; data nilai lama yang belum diketahui tetap reconciliation pending, tidak diisi nol.

### 5.4 Penerimaan informasional R1

#### `operational_receipt`

- Field: `id`, `tenant_id`, `farm_id`, `cycle_id` nullable, `receipt_kind` (`DOC`, `FEED`, `SAPRONAK`), `received_at`, pihak/sumber snapshot, `item_catalog_id` nullable, `item_name_snapshot`, `quantity` nullable, `unit_code` nullable, nilai tagihan/bonus/rejected/live bila relevan nullable, catatan, pencatat, `version`.
- Relasi: N..1 farm, cycle opsional untuk feed/sapronak; dokumen DOC awal terkait satu cycle. Jika DOC dirinci, data billed/bonus/rejected/live harus reconcile ke cycle, jangan menambahkan populasi dua kali.
- Constraint: `quantity` unknown tetap null; satu intake DOC kanonis per cycle pada model sederhana R1 (detail pengiriman yang diperlukan menjadi baris intake, bukan DOC populasi kedua). Receipt feed/sapronak dapat banyak.
- Efek: informasional saja; bukan stock, bukan purchase/cost otomatis, bukan kas/utang, dan bukan konsumsi. Jika ada pembelian Owner, tautkan receipt ke dokumen pembelian yang sama tanpa membuat sumber biaya kedua.
- Index: `(tenant_id, farm_id, received_at)`, `(tenant_id, cycle_id, receipt_kind)`.

### 5.5 Akun usaha dan pemegang uang

#### `cash_account`

- Field: `id`, `tenant_id`, `account_name`, `account_kind` (`BUSINESS_CASH`, `BUSINESS_BANK_MANUAL`, `FARM_CASH`, `EMPLOYEE_CUSTODY`), `balance_owner_kind=TENANT_BUSINESS`, `custodian_employee_id` nullable, `farm_id` nullable, `currency_code=IDR`, `status`, `version`.
- Relasi: satu farm/employee opsional; banyak movement dan opening position. Akun pegangan adalah saldo usaha dengan pemegang berbeda, bukan kas pribadi ABK.
- Constraint: akun usaha tenant yang aktif hanya; `EMPLOYEE_CUSTODY` memerlukan employee, tidak mensyaratkan assignment masih aktif untuk histori. R1 tidak merepresentasikan seluruh rekening pribadi Owner/ABK sebagai akun usaha.
- Index: `(tenant_id, status, account_kind)`, `(tenant_id, farm_id, custodian_employee_id)`.

<a id="dm06"></a>
## 6. Sumber transaksi dan status posting

### 6.1 `financial_source_event` — akar satu kejadian uang/biaya

- Field: `id`, `tenant_id`, `source_kind`, `actor_user_id`, `occurred_at` nullable, `event_date` nullable, `created_at_device` nullable, `received_at_server`, `posted_at` nullable, `posting_status` (`PENDING`, `POSTED`, `REVERSED`), `version`, `reversal_of_event_id` nullable.
- Relasi: satu source event memiliki satu dokumen sumber kanonis dan 0..N efek typed (`cash_movement`, `cost_entry`, `obligation`, application, income, alokasi). Klaim/draft boleh memiliki event tanpa efek finansial.
- FK: setiap tabel sumber typed menyimpan `financial_source_event_id` unique FK gabungan `(tenant_id,id)`; source event tidak menyimpan pasangan polymorphic `source_type + source_id`. Validasi domain/deferred constraint setara memastikan `source_kind` cocok dengan subtype yang ada pada commit.
- Constraint: `POSTED` hanya bila seluruh efek yang wajib untuk source kind tersedia lengkap; `PENDING` tidak dihitung ke saldo/cost; satu source tidak dipost dua kali; `REVERSED` harus mempunyai reversal/effect yang tertaut, tidak berarti uang nyata otomatis kembali.
- Index: unique `(tenant_id, id)`; unique source-event reference sesuai tipe; `(tenant_id, posting_status, received_at_server)`, `(tenant_id, event_date)`.

Sumber typed minimum R1: `purchase_document`, `cash_claim`, `cash_transfer`, `cash_adjustment`, `purchase_payment`, `supplier_advance` untuk pencairan baru, `obligation_application`, `obligation_offset_pair`, `employee_advance`, `salary_finalization`, `work_compensation`, `owner_funding_event`, `other_income_entry`, `partner_settlement_version`, `partner_payout`, `opening_batch`, serta `claim_resolution` bila resolusi menghasilkan efek. Source kind dipetakan satu-ke-satu ke subtype; child deskriptif yang menaut source opening/purchase tidak berarti source ekonomi kedua. Jangan mengirim effects dari browser langsung ke tabel ledger.

### 6.2 Matriks sumber ke efek atomik

| Source/aksi yang disahkan | Dalam satu transaksi commit | Tidak boleh ikut terjadi |
|---|---|---|
| `purchase_document` Owner approve/post setelah diterima | Satu status review/posting efektif; `cost_entry` untuk konsumabel; cash OUT hanya sejumlah uang aktual yang dibayar dari `cash_account`; obligation supplier/ABK reimbursement/Owner sesuai sumber dana; cost allocation plan awal bila dipilih; audit + receipt + outbox. | Stock/consumption; biaya saat pembayaran kedua; kas pegangan atau akun pribadi fiktif; biaya otomatis untuk durable equipment. |
| Klaim purchase ABK submit, correction request, atau reject nonterminal | Source/claim/version + audit/receipt; klaim pending tampil di rekonsiliasi kas pegangan bila relevan. | Cash movement, cost, payable finalized, balance correction. Reject bukan refund. |
| FIN-11 purchase claim `NOT_OCCURRED` / `DUPLICATE_OF` | Resolusi terminal purchase claim dan canonical expense/source link; claim keluar dari daftar unresolved setelah keputusan lengkap. | Cash/cost/potongan gaji. Linkage OFF-16 ke movement kanonis bukan FIN-11 resolution. |
| FIN-11 purchase claim `PAYER_CORRECTED` | Sumber pembiayaan nyata yang benar ditautkan dan efek pembelian direklasifikasi atomik; bila ABK menalangi pembelian barang/jasa nyata, bentuk biaya yang layak + payable reimbursement kepada ABK. | Cash pegangan yang tidak membayar, kasbon employee, piutang/potongan gaji kepada employee. |
| FIN-11 purchase claim `POSTED_RECOVERABLE` | Uang nyata yang keluar dibukukan ke akun/sumber sebenarnya dan piutang recoverable ke pihak yang disahkan; refund nyata berikutnya melunasi piutang. | Cost pembelian yang tidak disetujui; receivable employee otomatis/punitif tanpa bukti/kesepakatan atau potongan payroll. |
| `cash_transfer`/`cash_return` canonical | Header source + tepat dua cash movements OUT/IN bernilai sama + claim links yang cocok + audit/receipt/outbox. | Pendapatan, biaya, advance receivable. |
| `purchase_payment`, supplier payment, reimbursement, salary payment, wage payment | Cash movement nyata + satu/lebih `obligation_application` dengan jumlah tepat + audit/receipt/outbox. | Cost baru; salary/work wage saling digabung ke satu entitlement. |
| `supplier_advance` disbursement / application | Pencairan membuat hak uang muka supplier + cash OUT usaha atau payable/kontribusi Owner jika dana pribadi eksternal; aplikasi setelah penerimaan meng-offset hak uang muka dan utang purchase supplier yang sama. | Biaya sebelum penerimaan; cash OUT kedua ketika aplikasi; rekening pribadi sebagai akun tenant; source pembayaran Owner ganda. |
| Purchase refund nyata | Reversal/adjustment terhadap cost/obligation asal + cash IN atau utang turun hanya sesuai refund yang benar-benar diterima/disepakati + link asal. | Inventory R1; cash IN jika hanya nota kredit belum diterima. |
| `employee_advance` disbursement | Kas OUT + `EMPLOYEE_ADVANCE_RECEIVABLE` sebesar pokok, satu source. | Salary cost/payable kecuali ada salary finalization terpisah; potongan otomatis. |
| Salary agreement `DRAFT`/`AGREED` update | Agreement revision + version/audit. | Financial cost/payable final saat hanya proyeksi. |
| `salary_finalization` | Gross `cost_entry` + `SALARY_PAYABLE` sebesar gross + audit/receipt/outbox. | Cash movement otomatis; pekerjaan tambahan; pemotongan kasbon implicit. |
| Kasbon-to-salary application Owner | Satu `obligation_offset_pair` mengurangi advance receivable dan salary payable dengan angka sama + audit/receipt. | Cash; cost; offset melebihi saldo/hak sisa. |
| `work_compensation` disetujui | Work cost + `WORK_WAGE_PAYABLE` + review/effect/audit/receipt. | Payroll component; cost dari task selesai tanpa approval. |
| `owner_funding_event` | Cash IN/OUT hanya bila uang usaha nyata bergerak; contribution sebagai ekuitas/non-income; loan/advance sebagai payable Owner; withdrawal sebagai prive/non-cost; repayment sebagai cash OUT + payable application. | Personal account Owner sebagai akun usaha R1, income/cost ganda. |
| Settlement right verified | `partner_settlement_version`/components + partner receivable atau payable untuk net right yang diketahui + audit/receipt. | Cash movement; klasifikasi income otomatis bila komponen masih unknown. |
| Payout notice | Notice state + audit/notifikasi opsional. | Cash, income, obligation application, status PAID. |
| `partner_payout` actual | Cash IN + settlement receivable application jika verified; atau cash IN + suspense payable `UNMATCHED_RECEIPT_SUSPENSE` jika hak belum diketahui. | Receipt kedua saat RHPP ditaut kemudian; income hanya karena bank menerima uang. |
| `SUSPENSE_TO_SETTLEMENT_RIGHT` reconciliation | Offset suspense payable ↔ verified partner receivable; audit/receipt; status payout berubah matched/partial. | Cash movement kedua, pengakuan hak yang tidak diketahui. |
| `opening_batch` verification | Baseline `opening_position` efektif + versi/cutoff/audit/receipt. | Cash IN, income/cost, pembelian, advance disbursement baru; mengimpor lagi event yang telah tercakup. |
| `cost_allocation_plan` / `settlement_coverage` | Versi allocation/coverage + audit/receipt; report projection berubah. | Cash, cost source, obligation, atau pendapatan baru. |
| `daily_recording_revision` | Satu revisi berlaku untuk tanggal + audit/receipt; tidak menggunakan financial source root. | Cash, cost, stock, atau review approval keuangan. |

Batch approve hanya mengelompokkan command; tiap dokumen memiliki source, receipt, audit dan transaksi commit sendiri. Satu dokumen tidak pernah menghasilkan sebagian efek: bila satu akun, kewajiban, alokasi wajib, versi atau constraint gagal, semua write untuk source itu rollback.

### 6.3 Status independen dokumen

Untuk pembelian/klaim/upah gunakan status yang sesuai kebutuhan domain; jangan menyamakan:

- `review_status`: `DRAFT`, `SUBMITTED`, `NEEDS_CORRECTION`, `APPROVED`, `REJECTED`;
- `posting_status`: `UNPOSTED`, `POSTED`, `REVERSED`;
- `settlement_status`: hasil turunan `UNPAID`, `PARTIAL`, `PAID`, atau `UNRECONCILED` bila hak belum diketahui;
- `resolution_status` purchase claim: default `UNRESOLVED` atau salah satu lima terminal FIN-11; cash-event claim tidak memakai field state ini dan memakai linkage OFF-16 terpisah.
- `sync_status`: lokal/antre/terkirim/konflik/ditolak, disimpan untuk operasi/perangkat, bukan payment state.

Transition mengikuti PRD §9: source posted tidak boleh kemudian menjadi rejected untuk membatalkan efek; perlu reversal/adjustment. Owner boleh simpan+approve+post langsung dalam satu command jika berhak. Owner-only approval finansial R1 berlangsung online. Recording DAILY bukan objek review/posting keuangan.

<a id="dm07"></a>
## 7. Kas, pembelian, klaim, penerimaan, dan efek

### 7.1 `financial_effect` secara domain

Tidak ada satu angka `balance` atau `total_cost` yang boleh diedit langsung. Efek kanonis R1 adalah:

| Efek | Entitas sumber saldo/laporan | Dampak |
|---|---|---|
| Kas masuk/keluar | `cash_movement` | Mengubah akun kas tertentu berdasarkan kejadian uang yang benar-benar terjadi. |
| Biaya yang diakui | `cost_entry` | Menambah biaya tepat satu kali pada tanggal pengakuan; tidak harus terjadi bersamaan dengan pembayaran. |
| Hak/kewajiban | `obligation` | Membentuk saldo piutang atau utang dengan pokok immutable. |
| Pelunasan/offset | `obligation_application` / `obligation_offset_pair` | Mengurangi saldo hak/kewajiban; tidak mengubah nominal pokok/cost source. |
| Pendapatan lain | `other_income_entry` | Pendapatan operasional sampingan yang bukan payout/hasil ayam yang sudah masuk settlement. |
| Alokasi/coverage | `cost_allocation_line`, `settlement_coverage` | Menentukan penyajian biaya periode dan bagian biaya yang sudah menurunkan net settlement; bukan kas dan bukan cost tambahan. |

Setiap effect menyimpan `financial_source_event_id`, `tenant_id`, nominal positif `amount_idr`, currency, tanggal relevan, actor/provenance, dan `reversal_of_effect_id` nullable. Arah disimpan sebagai enum (contoh `IN`/`OUT`, `PAYABLE`/`RECEIVABLE`), bukan nominal negatif pada form normal. Effect key unik per source dan jenis agar retry atau handler ganda tidak menghasilkan baris kedua.

### 7.2 `cash_movement` dan `cash_transfer`

#### `cash_movement`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `cash_account_id`, `direction` (`IN`, `OUT`), `amount_idr > 0`, `currency_code=IDR`, `value_date`, `counterparty_id` nullable, deskripsi/snapshot, `transfer_pair_id` nullable, `reversal_of_id` nullable.
- Relasi: N..1 account/source event; cash event dapat melunasi kewajiban lewat application.
- Constraint: akun dan source tenant sama; tidak ada cash effect sebelum movement nyata; confirmed balance tidak negatif kecuali ada adjustment/recovery sah sesuai D-04; nominal tidak nol; pasangan transfer harus tepat satu OUT dan satu IN bernilai sama.
- Index: `(tenant_id, cash_account_id, value_date, id)`, `(tenant_id, financial_source_event_id)`, `(tenant_id, counterparty_id, value_date)`.

#### `cash_transfer`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `from_account_id`, `to_account_id`, `amount_idr`, `farm_id` nullable, `custodian_employee_id` nullable, `purpose_snapshot` nullable, `handover_at`, konfirmasi penerimaan/status rekonsiliasi, `version`.
- Relasi: dua movement kanonis (OUT dari sumber, IN ke tujuan) yang mempunyai transfer pair sama.
- Constraint: `from_account_id != to_account_id`; akun satu tenant; dua movement amount/currency sama; tidak income/biaya; kas pegangan ABK mencatat farm/pemegang/tujuan bila diketahui.
- Index: `(tenant_id, handover_at)`, `(tenant_id, custodian_employee_id, handover_at)`.

Saldo akun = opening balance efektif + seluruh movement POSTED IN − seluruh movement POSTED OUT. Cache saldo boleh dipakai sebagai proyeksi, tetapi wajib dapat direkonsiliasi/dibangun ulang dan dikunci secara konkuren. Rekonsiliasi/opname fisik tidak mengubah transaksi masa lalu.

#### `cash_count` dan `cash_adjustment`

- `cash_count`: account, waktu, `book_balance_snapshot`, `physical_balance_idr`, `difference_idr`, pencatat, bukti opsional, review/status. Selisih dapat diketahui tanpa biaya otomatis.
- `cash_adjustment`: source event terpisah yang memerlukan approval Owner dan klasifikasi eksplisit; tidak dibuat otomatis dari selisih atau foto. Field: arah, nominal, reason, account, approved_by.
- Constraint: snapshot merekam versi/ledger cutoff; membuat opname tidak mengedit `cash_movement` lama.

### 7.3 `purchase_document`, line, payment, dan klaim

#### `purchase_document`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `created_by_user_id`, `farm_id` nullable (null = biaya umum tenant, bukan farm kosong), `event_at`, `expense_description`, `supplier_id` nullable, `supplier_name_snapshot`, `review_status` (`DRAFT`, `SUBMITTED`, `NEEDS_CORRECTION`, `APPROVED`, `REJECTED`), `posting_status` (`UNPOSTED`, `POSTED`, `REVERSED`), `resolution_status` (`UNRESOLVED` atau keputusan terminal claim), `buyer_employee_id` nullable, `funding_kind` (`BUSINESS_ACCOUNT`, `EMPLOYEE_OWN_FUNDS`, `OWNER_OWN_FUNDS`, `SUPPLIER_CREDIT`, `MIXED`, `UNKNOWN`), `posting_source_kind` nullable sebelum review (`BUSINESS_ACCOUNT`, `CASH_HOLDING`, `OWNER_PAYABLE`, `ABK_REIMBURSEMENT`, `SUPPLIER_PAYABLE`, `ADVANCE_CLEARING`, `MIXED`, `UNKNOWN`), `received_status` (`UNKNOWN`, `PARTIAL`, `RECEIVED`, `NOT_RECEIVED`), `version`.
- Relasi: satu header memiliki 1..N `purchase_line` bila data transaksi sudah cukup; 0..N pembayaran cicilan; 0..N attachment; 0..N claim resolution revision; 0..N cost allocation version.
- Constraint: purchase claim submitted belum posted; klasifikasi missing/unknown bukan nol; satu invoice dibukukan satu kali walau beberapa pembayaran/akun. Purchase credit tidak memerlukan kas movement sampai pembayaran.
- `funding_kind` mempertahankan apa yang dilaporkan pembeli; `posting_source_kind` adalah klasifikasi Owner saat approve. Dana pribadi ABK membuat reimbursement payable, bukan kas usaha/kasbon. Dana pribadi Owner bukan `cash_account`; Owner memilih kewajiban atau kontribusi eksplisit, sementara akun usaha hanya untuk uang yang memang ada pada saldo usaha.
- Index: `(tenant_id, farm_id, event_at)`, `(tenant_id, review_status, event_at)`, `(tenant_id, resolution_status, event_at)`, `(tenant_id, supplier_id, event_at)`.

#### `purchase_line`

- Field: `id`, `tenant_id`, `purchase_document_id`, `description_snapshot`, `item_catalog_id` nullable (master barang R1 opsional), `business_category_id` nullable, `quantity` nullable, `unit_code` nullable, `unit_conversion_snapshot` nullable, `line_amount_idr`, `purchase_class` (`CONSUMABLE`, `DURABLE_EQUIPMENT`, `SAPRONAK_INFORMATIONAL`, `OTHER_PENDING`), `received_quantity` nullable, `version`.
- Relasi: N..1 purchase. Satu line bukan stock SKU wajib.
- Constraint: jumlah line dan total dokumen harus reconcile bila keduanya diketahui; unit/rate disimpan snapshot; durable equipment tidak otomatis membuat cost entry; informasi receipt sapronak tidak dihitung sebagai expense tanpa transaksi pembelian Owner yang terpisah/tertaut.
- Index: `(tenant_id, purchase_document_id)`.

#### `purchase_payment`

- Field: `id`, `tenant_id`, `purchase_document_id`, `financial_source_event_id`, `cash_movement_id` nullable jika belum dibayar/paid from external personal funds, `payment_date`, `amount_idr`, `payer_kind`, `payer_employee_id`/`payer_owner_id` nullable, `version`.
- Relasi: satu pembelian boleh 0..N payment, dari akun sah yang berbeda; setiap cash leg tetap satu kejadian dan boleh dialokasikan ke beberapa kewajiban.
- Constraint: jumlah payment tidak melebihi nilai due tanpa klasifikasi overpayment sebagai advance/receivable/refund; pembayaran tidak membuat expense kedua. Pembelian ditalangi ABK menimbulkan payable reimbursement setelah diterima/disetujui, bukan kasbon karyawan.
- Index: `(tenant_id, purchase_document_id, payment_date)`, `(tenant_id, financial_source_event_id)`.

#### `cash_claim` dan status pengajuan

- `cash_claim`: tautan klaim aktual dari ABK/Owner ke purchase atau kejadian tunai yang dilaporkan; field `id`, `tenant_id`, `financial_source_event_id` (akar laporan klaim), `claim_kind` (`PURCHASE`, `CASH_EVENT`), `purchase_document_id` nullable untuk klaim pembelian, `claimant_employee_id` nullable bagi Owner, `cash_account_id` nullable, `amount_idr`, `occurred_at`, `submission_status` (`DRAFT`, `SUBMITTED`, `NEEDS_CORRECTION`), `resolution_status` nullable (wajib untuk PURCHASE, null untuk CASH_EVENT), `version`, `origin_operation_id` nullable.
- Relasi/constraint: claim purchase menaut purchase doc tenant sama dan memiliki `resolution_status` FIN-11; cash-event claim memiliki `cash_event_claim_link` terpisah dan **tidak** menggunakan FIN-11 `resolution` enum. Claim fisik yang ditolak posting karena grant, lock, saldo, atau dependency tetap `SUBMITTED`/rekonsiliasi; penolakan bukan bukti uang tidak bergerak. Untuk cash-event link, belum ada row link efektif berarti belum dipadankan; state berhasilnya bernama `LINKED_TO_CANONICAL` sesuai OFF-16, bukan terminal `TRANSFER_RECONCILED`.
- Index `cash_claim`: `(tenant_id, claim_kind, submission_status, occurred_at)`, `(tenant_id, claimant_employee_id, submission_status)`, unique `(tenant_id, origin_operation_id)` when non-null.

#### `claim_resolution` — FIN-11 purchase claim saja

- `cash_claim.resolution_status`: nullable bagi `CASH_EVENT`; untuk `PURCHASE`, default `UNRESOLVED` lalu hanya salah satu terminal `POSTED_PURCHASE`, `NOT_OCCURRED`, `DUPLICATE_OF`, `PAYER_CORRECTED`, `POSTED_RECOVERABLE`.
- `claim_resolution`: `id`, `tenant_id`, `cash_claim_id` FK ke claim PURCHASE, `resolution` exact enum terminal di atas (tidak mencakup `UNRESOLVED`, yang merupakan default sebelum ada terminal row), `resolved_amount_idr`, canonical purchase/source ref nullable sesuai terminal kind, alasan keputusan, actor Owner, waktu, `version`, `effective_status`, receipt.
- Constraint: hanya Owner/aktor yang secara eksplisit diberi wewenang menulis resolusi terminal; satu purchase claim hanya punya satu versi efektif. FIN-11 resolution terpisah dari `review_status`; `NEEDS_CORRECTION`/`REJECTED` bukan terminal resolution. Unique `(cash_claim_id, version)`, unique effective `(cash_claim_id)`. `POSTED_PURCHASE` effects dan terminal resolution commit atomik. `PAYER_CORRECTED` mem-post source dan payer yang benar atomik. `POSTED_RECOVERABLE` mem-post uang keluar + receivable sah atomik. `NOT_OCCURRED` tidak membuat efek; `DUPLICATE_OF` menaut kanonis tanpa effect kedua.
- Nilai terminal partial memakai allocation lines yang totalnya persis `resolved_amount_idr`; status terminal baru berlaku bila semua nominal klaim sudah di-account for. `REFUND_REQUIRED` hanyalah status review/needs-correction, bukan FIN-11 terminal state.
- Index `claim_resolution`: unique `(cash_claim_id, version)`, unique effective `(cash_claim_id)`.

#### `cash_event_claim_link` — linkage OFF-16, bukan FIN-11 resolution

- Field: `id`, `tenant_id`, `cash_claim_id` FK ke claim `CASH_EVENT`, `canonical_financial_source_event_id`, `canonical_cash_movement_id`, `canonical_cash_transfer_id` nullable, `link_status` (`LINKED_TO_CANONICAL` saat verified; tidak terkait enum resolusi FIN-11), `linked_by_user_id`, `linked_at`, `evidence_snapshot` nullable, `version`, `supersedes_id` nullable.
- Relasi: banyak laporan counterpart dapat menunjuk movement/transfer kanonis yang sama; satu claim memiliki paling banyak satu linkage efektif. Source event/movement/transfer dan claim harus tenant sama dan movement harus milik canonical source/transfer yang dirujuk.
- Constraint: Owner mengesahkan linkage setelah memeriksa kejadian, bukan auto-match nominal/tanggal. Untuk transfer baru, canonical transfer + movement OUT/IN + linkage claims commit atomik. Untuk counterpart terlambat setelah transfer posted, linkage merujuk movement lama dan commit tanpa movement/expense/payment kedua. Claim tetap klaim fisik, bukan cash effect; bila tidak ada canonical event terverifikasi, claim tetap submitted/reconciliation-pending.
- Index: unique effective `(cash_claim_id)`, `(tenant_id, canonical_cash_movement_id)`, `(tenant_id, canonical_cash_transfer_id)`.

#### `claim_resolution_allocation`

- Field: `id`, `tenant_id`, `claim_resolution_id`, `canonical_financial_source_event_id`, `allocation_kind`, `amount_idr`, `version`.
- Relasi: lines dipakai bila satu FIN-11 purchase claim resolution harus dibagi ke beberapa sumber kanonis; satu target dapat tetap berada langsung pada parent resolution. Target line menggunakan FK ke root source event, bukan polymorphic object ID. OFF-16 link claims tidak memakai allocation ini.
- Constraint: bila lines ada, sum line = `resolved_amount_idr`; semua target satu tenant; resolusi tidak menjadi terminal sampai seluruh nominal klaim tercakup/di-account for; unique target per resolution bila tidak ada alasan untuk memecah target yang sama. `NOT_OCCURRED` tidak memerlukan target line.
- Index: `(tenant_id, claim_resolution_id)`, `(tenant_id, canonical_financial_source_event_id)`.

#### `capture_note_conversion`

- Field: `id`, `origin_registration_id`, `origin_note_id`, `origin_tenant_id`, `origin_user_id`, `origin_device_id`, `origin_payload_hash`, `occurred_at`, `amount_idr`, teks/pihak snapshot, `conversion_status` (`ACCEPTED`, `REVIEW_ONLY`, `REJECTED`), `canonical_cash_claim_id` nullable saat belum diterima/rejected, `first_conversion_operation_id`, `converted_at`, `version`.
- Relasi: setiap baris adalah tombstone/mapping durable dari satu local note pada satu registrasi terverifikasi ke paling banyak satu canonical cash claim tenant. Hash dihitung dari payload capture yang dikanonisasi; author, device, tenant, registration ID, note ID, dan hash immutable setelah first receipt. Tidak menyimpan business cache atau memberi grant.
- Kunci idempotensi independen dari operation receipt: unique `(origin_registration_id, origin_note_id)`; ini berlaku lintas operation ID. Retry key sama + hash sama mengembalikan conversion/claim yang sudah ada; note key sama + hash berbeda ditolak sebagai mismatch/recovery review, tidak mengganti payload atau membuat claim kedua. `first_conversion_operation_id` adalah provenance saja, bukan unique key model tersebut.
- Hash dikanonisasi dari field note OFF-17 yang diizinkan (`occurred_at`, nominal, teks/pihak, bukti baru yang direferensikan); tidak memasukkan `operation_id`, token/sesi, actor envelope, atau recovery request epoch. Hash tidak menggantikan origin verification dan tidak boleh diubah pada koreksi; koreksi setelah conversion adalah revision klaim/source.
- Constraint/FK: client tidak berwenang menyatakan sendiri origin; server memverifikasi `origin_registration_id` dan menurunkan `origin_tenant_id`, `origin_user_id`, `origin_device_id` dari registrasi server-issued yang immutable; nilai client hanya harus cocok. Current actor adalah author asal atau recovery SEC-13 terverifikasi; tenant target wajib origin tenant dan permission/grant dicek ulang. Revoke grant membuat conversion `REVIEW_ONLY`/blocked, tidak rehome ke tenant lain. `ACCEPTED` mengharuskan tepat satu `canonical_cash_claim_id`; claim target harus `CASH_EVENT` pada `origin_tenant_id`; target claim unik dan immutable setelah accepted; claim tidak membawa FK balik ke conversion untuk menghindari dua sumber linkage.
- Atomicity/concurrency: reserve unique `(origin_registration_id, origin_note_id)`, compare canonical hash, create/resolve exactly one `cash_claim` target, finalize conversion mapping, `command_receipt`, and audit in one database transaction. Concurrent operation IDs for the same note/hash converge on the same conversion/claim; mismatched hash is terminal/review, not a second mapping. Never rely on operation receipt uniqueness alone.
- Conversion hanya merekam/link note menjadi `CASH_EVENT` claim biasa; tidak membuat transfer/cash movement, approval, atau posting. Koreksi setelah diterima menggunakan revisi klaim/source dengan audit, bukan mengganti hash atau mengulang conversion dengan operation ID baru.
- Index: unique `(origin_registration_id, origin_note_id)`, unique `(canonical_cash_claim_id)` bila non-null, `(origin_tenant_id, origin_user_id, converted_at)`, `(origin_tenant_id, conversion_status, converted_at)`.

#### `supplier_advance` — uang muka supplier CASH-09

- Field: `id`, `tenant_id`, `supplier_id` FK ke `counterparty`, `purchase_document_id` nullable, `financial_source_event_id`, `obligation_id` bertipe `SUPPLIER_ADVANCE_RECEIVABLE`, `origin_kind` (`DISBURSEMENT`, `OPENING`), `amount_idr`, `paid_at` nullable untuk opening, `funding_kind` nullable untuk opening (`BUSINESS_ACCOUNT`, `OWNER_OWN_FUNDS`), `cash_account_id` nullable, `owner_funding_kind` nullable (`OWNER_ADVANCE_FOR_PURCHASE`, `CAPITAL_CONTRIBUTION`), `opening_position_id` nullable, `version`.
- Disbursement bisnis baru: `amount_idr>0`, supplier jelas; dana usaha memerlukan akun tenant dan cash OUT, sedangkan dana pribadi Owner tidak memakai akun pribadi fiktif dan membuat payable Owner atau kontribusi eksplisit dalam source yang sama. Hak uang muka ke supplier diakui tanpa cost/penerimaan barang/stok. Tidak membuat source Owner kedua untuk arus yang sama.
- Opening: taut posisi `SUPPLIER_ADVANCE` terverifikasi dan cutoff. `supplier_advance.financial_source_event_id` **sama dengan** source `opening_batch` terkait; record supplier_advance ini child deskriptif posisi, bukan source baru bertipe disbursement. Tidak menerbitkan source/receipt/efek ekonomi kedua. Bentuk baseline hak tersisa tanpa cash OUT atau payable Owner baru; utang Owner lama dilaporkan sebagai posisi opening tersendiri berdasarkan bukti.
- Penerimaan/purchase yang disetujui membuat cost atau klasifikasi peralatan dan `SUPPLIER_PAYABLE` sesuai nilainya. Aplikasi uang muka adalah `obligation_offset_pair` dengan `offset_kind=SUPPLIER_ADVANCE_TO_PURCHASE`, berjumlah ≤ hak uang muka tersisa dan utang purchase, supplier/tenant sama, tanpa cash/cost kedua. Boleh parsial; sisa utang dapat dibayar lewat purchase payment. Approval+pemakaian uang muka dalam satu tindakan tetap satu transaksi/receipt dengan semua efek tervalidasi.
- Refund uang muka aktual memakai `obligation_application` bertipe `CASH_SETTLEMENT`/`REFUND` dan kas IN pada hak supplier, bukan membalik biaya yang tidak pernah diakui. Koreksi tanpa uang bergerak mengikuti reversal sumber; cash tidak dibuat dari janji refund.
- Constraint/index: unique `obligation_id`, unique `opening_position_id` bila terisi; source/purchase/supplier/obligation satu tenant, obligation pihak supplier yang sama; `(tenant_id,supplier_id,paid_at)` dan FK purchase/source. Current remaining dihitung dari obligation/applications/offsets, bukan total bebas edit. Dua aplikasi paralel mengunci hak uang muka dan payable sebelum memeriksa sisa.
- Oracle tambahan AC-14: uang muka Rp200.000 mengurangi kas Rp200.000 tanpa biaya; barang konsumabel Rp300.000 diterima/disahkan → biaya/utang Rp300.000; aplikasi Rp200.000 → sisa utang Rp100.000, kas tetap; bayar sisa → total kas OUT Rp300.000 dan biaya tetap Rp300.000. Retry/double application tidak mengubah hasil.

### 7.4 Penerimaan dan status receipt

`operational_receipt` pada §5.4 tidak mengubah buku. `purchase_document.received_status` menyatakan penerimaan barang/jasa yang dibeli untuk memutuskan pengakuan biaya. Penerimaan mitra yang hanya informasi tetap terpisah dari purchase Owner, payable, dan stock. Tidak ada tabel movement inventory atau linking wajib ke DAILY dalam R1.

### 7.5 Pendapatan sampingan R1

#### `other_income_entry`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `farm_id` nullable, `event_date`, `income_kind`, `business_category_id` nullable, `description_snapshot`, `amount_idr`, `counterparty_id` nullable, `receivable_id` nullable, `cash_movement_id` nullable, `version`.
- Relasi: pendapatan lain seperti penjualan karung/sekam/kotoran; ayam yang sudah masuk settlement tidak boleh dicatat lagi sebagai income sampingan.
- Constraint: kas masuk hanya jika diterima; bila belum diterima dapat membuat receivable; bukan transfer/modal; sumber/komoditas settlement ayam harus dinyatakan dan diperiksa anti-double-count.
- Index: `(tenant_id, farm_id, event_date)`, `(tenant_id, income_kind, event_date)`, `(tenant_id, business_category_id, event_date)`.

<a id="dm08"></a>
## 8. Biaya, alokasi, kewajiban, dan pelunasan

### 8.1 `cost_entry`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `effect_kind` (`RECOGNITION`, `REVERSAL`), `cost_kind`, `business_category_id` nullable, `purchase_class` nullable, `recognized_at`, `amount_idr > 0`, `currency_code=IDR`, `farm_id` nullable, `cycle_id` nullable, `source_snapshot`, `reversal_of_id` nullable.
- Sumber R1 dapat berupa barang/jasa konsumabel yang benar-benar diterima dan disetujui Owner, `salary_finalization`, atau pekerjaan tambahan yang selesai/disetujui. Durable equipment dicatat klasifikasi/source tetapi tidak menjadi cost otomatis. Kasbon, modal, transfer, pokok pinjaman, tabungan milik Owner, dan repayment bukan cost.
- Constraint: satu recognition kanonis per business source/type; cost tenant cocok dengan farm/cycle; cycle menentukan farm. RECOGNITION tidak punya reversal_of; REVERSAL wajib menunjuk recognition root satu tenant/jenis, tidak reversal-of-reversal. Jumlah reversal sah ≤ nominal root di bawah lock sumber. Nominal selalu positif; kontribusi REVERSAL ke cost net bertanda minus, bukan expense positif baru. Membatalkan correction dilakukan dengan recognition pengganti bertaut sumber, bukan mengedit histori.
- Cost net root = recognition amount − seluruh reversal sah terhadap root. Alokasi aktif melekat pada **net root**, tidak pada reversal sebagai sumber biaya baru. Refund parsial Rp20.000 atas biaya Rp100.000 menghasilkan reversal 20.000, net root 80.000 dan revisi plan total 80.000 dalam transaksi yang sama; full reversal menjadi net 0, root/histori tetap ada. Jika perlu mengganti nilai, reversal penuh + recognition pengganti atomik. Pengakuan dari pembelian tidak menunggu payment dan tidak terulang saat pemakaian.
- Index: `(tenant_id, farm_id, recognized_at)`, `(tenant_id, cycle_id, recognized_at)`, `(tenant_id, business_category_id, recognized_at)`, `(tenant_id, financial_source_event_id)`.

### 8.2 Alokasi versi dan sisa

#### `cost_allocation_plan`

- Field: `id`, `tenant_id`, `cost_entry_id`, `version`, `basis_kind` (`DIRECT`, `EQUAL`, `PROPORTIONAL`, `OWNER_DEFINED`), dasar/proporsi snapshot, `source_amount_snapshot`, `allocated_amount_idr`, `unallocated_amount_idr`, `status` (`DRAFT`, `EFFECTIVE`, `SUPERSEDED`), `created_by_user_id`, `reason` nullable, `created_at`.
- Relasi: cost dapat memiliki banyak histori plan, tepat satu plan efektif. Perubahan alokasi membuat plan baru, bukan cost baru.
- Constraint: `allocated_amount + unallocated_amount = source_amount_snapshot`; keduanya ≥0; snapshot adalah **cost net root** pada manifest recognition/reversal yang disahkan, bukan nominal bruto root yang sudah direfund. Satu plan efektif per root, tidak membuat plan positif tambahan pada reversal. Koreksi net/alokasi/coverage terkait disahkan atomik; jika coverage setelah refund melebihi net allocation, wajib dikoreksi/ditinjau sebelum commit. Biaya umum tidak otomatis masuk periode berikutnya.
- Index: `(tenant_id, cost_entry_id, status)`, unique `(cost_entry_id, version)`.

#### `cost_allocation_line`

- Field: `id`, `tenant_id`, `allocation_plan_id`, `target_kind` (`TENANT`, `FARM`, `CYCLE`, `OUTSIDE_CYCLE`), `farm_id` nullable, `cycle_id` nullable, `amount_idr`, `share_snapshot` nullable, `tie_break_order`, `version`.
- FK/constraint: target-kind menentukan tepat satu target yang valid; bila cycle ada, farm harus sama dengan farm cycle. Tenant-scope cost umum sah. Building tidak wajib. Tidak memakai polymorphic target bebas tanpa FK tervalidasi.
- Constraint lintas-baris/command: sum line = `allocated_amount_idr`; amount nonnegative; plan efektif total tepat dengan sisa tidak teralokasi. Residual dibagikan menurut fraksi terbesar lalu `tie_break_order` stabil seperti COST-05.
- Index: `(tenant_id, allocation_plan_id)`, `(tenant_id, farm_id, cycle_id)`.

Alokasi adalah cara menampilkan sumber cost ke laporan; bukan mutasi kas, tidak mengubah tanggal source, dan tidak menggandakan cost. Cost dapat tetap `unallocated` dengan alasan/keputusan Owner sesuai gate sebelum finance lock.

### 8.3 `obligation` dan application

#### `obligation`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `obligation_kind` (`SUPPLIER_PAYABLE`, `SUPPLIER_ADVANCE_RECEIVABLE`, `EMPLOYEE_REIMBURSEMENT`, `SALARY_PAYABLE`, `WORK_WAGE_PAYABLE`, `EMPLOYEE_ADVANCE_RECEIVABLE`, `PARTNER_RECEIVABLE`, `PARTNER_PAYABLE`, `OWNER_PAYABLE`, `OWNER_LOAN_PAYABLE`, `OWNER_RECEIVABLE`, `UNMATCHED_RECEIPT_SUSPENSE`, `OTHER_APPROVED`), `direction` (`PAYABLE`, `RECEIVABLE`), `creditor_party_id` nullable, `debtor_party_id` nullable, `employee_id` nullable, `partner_id` nullable, `farm_id`/`cycle_id` nullable, `principal_amount_idr`, `currency_code=IDR`, `recognized_at`, `due_date` nullable, `status`, `reversal_of_id` nullable.
- Relasi: satu kewajiban memiliki 0..N applications/offsets dan source tetap immutable. Pihak employee/partner/owner tertaut eksplisit, bukan nama string saja bila master tersedia.
- Constraint: amount >0; debtor/creditor sesuai `direction` dan satu tenant; cycle-farm konsisten; remaining = principal − valid applications − valid offsets, tidak negatif. Jangan simpan `remaining_amount` bebas edit; cache wajib dibandingkan dengan rumus.
- Index: `(tenant_id, obligation_kind, status)`, `(tenant_id, employee_id, status)`, `(tenant_id, partner_id, status)`, `(tenant_id, cycle_id, status)`.

#### `obligation_application`

- Field: `id`, `tenant_id`, `obligation_id`, `financial_source_event_id`, `application_kind` (`CASH_SETTLEMENT`, `RECLASSIFICATION`, `REFUND`), `cash_movement_id` nullable sesuai kind, `amount_idr`, `applied_at`, `reversal_of_id` nullable.
- Relasi: pembayaran kas menaut cash movement tepat satu kali ke kewajiban target. Pembayaran satu invoice dapat memiliki beberapa aplikasi; satu movement boleh dialokasikan ke banyak obligation dengan total tepat.
- Constraint: `CASH_SETTLEMENT` butuh cash movement committed dan arah benar (payable dilunasi oleh cash OUT, receivable dilunasi oleh cash IN); amount tidak melebihi saldo tersisa; tidak ada double application atas movement/source.
- Index: `(tenant_id, obligation_id, applied_at)`, `(tenant_id, cash_movement_id)`, `(tenant_id, financial_source_event_id)`.

#### `obligation_offset_pair`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `receivable_obligation_id`, `payable_obligation_id`, `offset_kind` (`KASBON_TO_SALARY`, `SUPPLIER_ADVANCE_TO_PURCHASE`, `MUTUAL_SETTLEMENT`, `OWNER_AUTHORIZED`, `SUSPENSE_TO_SETTLEMENT_RIGHT`), `amount_idr`, `authorized_by_user_id`, `effective_at`, `reversal_of_id` nullable.
- Relasi: satu offset mengurangi saldo receivable dan payable dengan nominal sama, tanpa cash movement. Untuk kasbon ke gaji harus refer ke advance ABK dan gaji final pekerja yang sama.
- Constraint: dua obligation berlawanan arah, tenant/pihak konsisten; potongan kasbon ≤ advance outstanding dan salary payable masih tersisa; hanya pilihan eksplisit Owner; upah pekerjaan tidak dapat menjadi target otomatis. `SUSPENSE_TO_SETTLEMENT_RIGHT` hanya memasangkan `UNMATCHED_RECEIPT_SUSPENSE` payable dengan receivable settlement terverifikasi, menutup keduanya sebesar uang yang sudah diterima tanpa movement kedua.
- Index: `(tenant_id, receivable_obligation_id)`, `(tenant_id, payable_obligation_id)`, `(tenant_id, financial_source_event_id)`.

#### `settlement_status` (nilai turunan, bukan kolom bebas edit)

Untuk hak/kewajiban dengan nilai dikenal, `settled_amount = aplikasi valid + offset sah pada sisi obligation ini`, keduanya net dari reversal aplikasi/offset. Evaluasi `PAID` dahulu jika remaining=0; `UNPAID` bila settled_amount=0 dan remaining>0; `PARTIAL` bila 0<settled_amount<principal. Jadi gaji Rp1.500.000 yang seluruhnya dipotong lewat offset kasbon sah berstatus PAID/diselesaikan meskipun cash payment=0; rincian cara pelunasan tetap terlihat. Hak unknown/penerimaan tanpa padanan tetap UNRECONCILED. Kelebihan pembayaran harus diklasifikasi terpisah, bukan membuat remaining negatif.

<a id="dm09"></a>
## 9. Gaji periode, kasbon, dan upah terpisah

### 9.1 Gaji periode

#### `salary_agreement`

- Field: `id`, `tenant_id`, `employee_id`, `farm_id`, `cycle_id`, `current_revision_id`, `agreement_status` (`DRAFT`, `AGREED`, `FINALIZED`, `CANCELLED`), `version`, `finalization_id` nullable, `cancelled_at` nullable.
- Relasi: satu employee dan satu cycle; seorang pekerja boleh punya agreement eksplisit pada beberapa kandang/periode. Assignment baru tidak mengubah agreement historis; setiap perubahan amount/state yang disepakati membuat `salary_agreement_revision` baru.
- Constraint: employee, farm, cycle tenant sama; cycle cocok farm. Unique satu agreement efektif per `(tenant_id, employee_id, cycle_id)` kecuali revisi; jangan menyalin gaji penuh ke tiap kandang. Draft cancel tidak menghapus kasbon yang sudah dicairkan.
- Index: `(tenant_id, cycle_id, agreement_status)`, `(tenant_id, employee_id, cycle_id)`.

#### `salary_agreement_revision`

- Field: `id`, `tenant_id`, `salary_agreement_id`, `revision_no`, `agreed_amount_idr` nullable sebelum disepakati, `revision_status` (`DRAFT`, `AGREED`, `SUPERSEDED`), `basis_snapshot`/catatan, `approved_by_user_id` nullable, `approved_at` nullable, `created_at`, `created_by_user_id`, `supersedes_revision_id` nullable, `expected_base_version`.
- Relasi: satu agreement memiliki satu current revision dan 0..N histori. Satu finalization menunjuk tepat satu revision yang disahkan.
- Constraint: unique `(salary_agreement_id, revision_no)`; satu current revision; mengubah amount setelah AGREED membuat revision baru dengan approval Owner, bukan update in-place. Setelah FINALIZED tidak ada revisi nilai yang berlaku tanpa correction source/reopen sesuai gate.
- Index: `(tenant_id, salary_agreement_id, revision_no)`, `(tenant_id, approved_at)`.

#### `salary_finalization`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `salary_agreement_id`, `salary_agreement_revision_id`, `gross_amount_idr`, `finalized_by_user_id`, `finalized_at`, `correction_of_id` nullable.
- Relasi: Finalize satu kali per agreement revision; creates `cost_entry` sebesar gross dan `obligation` `SALARY_PAYABLE` untuk hak bruto. Potongan kasbon/payment dipisah sebagai offset/application.
- Constraint: nominal final immutable; revisi sesudah final melalui correction source + obligation/cost reversal/delta tertaut, tidak overwrite; `gross` tidak negatif; revision yang dirujuk harus AGREED dari employee/cycle yang sama.
- Index: unique `(tenant_id, salary_agreement_revision_id)`, `(tenant_id, finalized_at)`.

Gaji AGREED hanya proyeksi, bukan biaya final. Slip merangkum gross, kasbon yang secara eksplisit diaplikasikan, pembayaran gaji yang valid, sisa hak tunai nonnegatif, dan kasbon tersisa secara terpisah. `work_compensation` tidak pernah menjadi line komponen slip gaji.

### 9.2 Kasbon usaha

#### `employee_advance`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `employee_id`, `funding_cash_account_id`, `disbursed_amount_idr`, `disbursement_date`, `purpose` nullable, `cycle_id` nullable, `requested_by_user_id`, `approved_by_user_id`, `advance_status`, catatan.
- Relasi: menghasilkan `cash_movement OUT` dan `EMPLOYEE_ADVANCE_RECEIVABLE`; target salary/cycle opsional. Dapat direpayment atau diaplikasikan ke salary payable secara eksplisit.
- Constraint: pencairan harus saldo kas cukup dan approval online; tidak mewajibkan salary agreement. Outstanding berjalan lintas periode pada employee yang sama. Kategori bukan reimbursement pribadi ABK atau uang pegangan belanja.
- Index: `(tenant_id, employee_id, disbursement_date)`, `(tenant_id, advance_status)`.

Cash repayment membuat cash IN dan `obligation_application` pada receivable; gaji application membuat offset pair. Tidak ada batas advance berbasis gaji, potongan otomatis, atau penghapusan saldo ketika assignment/user berubah.

### 9.3 Upah pekerjaan tambahan

#### `work_compensation`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `employee_id`, `farm_id`, `building_id` nullable, `cycle_id` nullable, `rate_template_id` nullable, `work_description`, `completed_at`, `quantity` nullable, `unit_code` nullable, `rate_snapshot` nullable, `total_amount_idr`, `review_status`, `approval_by_user_id` nullable, bukti opsional, `version`.
- Relasi: disetujui setelah pekerjaan selesai, creates `cost_entry` dan obligation `WORK_WAGE_PAYABLE`; pembayaran melalu obligation application sendiri.
- Constraint: nominal/rate/unit snapshot tidak ikut berubah saat template tarif diubah; tidak ada auto-cost dari task; slip gaji tidak menyerap work compensation; satu transfer bank gabungan dapat dipecah jadi aplikasi gaji dan upah tertaut tetapi tetap dua kewajiban.
- Index: `(tenant_id, employee_id, completed_at)`, `(tenant_id, cycle_id, review_status)`, `(tenant_id, review_status, completed_at)`.

<a id="dm10"></a>
## 10. Modal, prive, dan kewajiban Owner pada buku usaha

#### `owner_funding_event`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `owner_user_id`, `owner_party_id` nullable, `event_kind` (`CAPITAL_CONTRIBUTION`, `OWNER_LOAN_TO_BUSINESS`, `OWNER_ADVANCE_FOR_PURCHASE`, `OWNER_WITHDRAWAL`, `OWNER_LOAN_REPAYMENT`), `cash_account_id` nullable, `amount_idr`, `event_date`, `purchase_document_id` nullable, `obligation_id` nullable, `classification_confirmed_by`, `version`.
- Relasi: seluruhnya hanya sisi buku usaha R1. Loan/advance yang harus dibayar membentuk kewajiban usaha ke Owner; contribution membentuk ekuitas; withdrawal/prive bukan cost. Owner advance untuk purchase tertaut ke source purchase yang sama dan payable, tidak mengarang akun bank pribadi sebagai kas usaha.
- Constraint: cash movement hanya bila uang benar-benar masuk/keluar akun usaha. Pembayaran vendor dari rekening pribadi Owner tidak menjadi kas usaha fiktif; purchase yang disetujui dapat membentuk cost + utang ke Owner, atau contribution eksplisit. Pembayaran utang Owner melunasi principal, bukan cost.
- Index: `(tenant_id, owner_user_id, event_date)`, `(tenant_id, event_kind, event_date)`.

Tidak ada `private_account`, `private_transaction`, atau pair lintas-buku pada R1. Owner loan/purchase advance bukan “pengeluaran Owner” tanpa pihak/kewajiban; modal bukan income; prive bukan expense. Kebutuhan aktivasi buku pribadi kelak perlu cutoff/linkage yang disahkan dan tidak memutar ulang transaksi historis (D-10, PER-01–05).

<a id="dm11"></a>
## 11. Settlement aktual dan payout

### 11.1 `partner_settlement_version`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `cycle_id` (required for R1 actual settlement), `partner_id`, `document_number` nullable, `document_date` nullable, `original_label` nullable (`RHPP`, `P4`, teks sumber lain), `currency_code=IDR`, `entry_mode` (`FULL_RHPP`, `PAYOUT_ONLY`), `document_status` (`DRAFT`, `VERIFIED`, `SUPERSEDED`), `classification_status` (`PENDING`, `COMPLETE`), `net_right_abs_amount_idr` nullable, `net_direction` (`RECEIVABLE`, `PAYABLE`) nullable, `version`, `supersedes_id` nullable, `verified_by_user_id` nullable, `verified_at` nullable.
- Relasi: satu cycle/partner mempunyai versi berurutan; versi baru menaut versi lama. Version dapat memiliki component, payout notice, receipt/application dan attachment; settlement aktual tidak memerlukan contract/rule/calculation run.
- Constraint: verified menegaskan dokumen/nilai yang tersedia, tidak otomatis classification COMPLETE atau uang diterima. Jika hak belum diketahui, net amount null, bukan 0. Net negatif membentuk payable ke partner; net positif receivable. `PAYOUT_ONLY` boleh mencatat hanya payment dan tetap pending classification.
- Index: `(tenant_id, cycle_id, partner_id, version)`, `(tenant_id, partner_id, document_date)`, `(tenant_id, document_status, classification_status)`.

#### `settlement_component`

- Field: `id`, `tenant_id`, `settlement_version_id`, `component_kind` (`FARMING_INCOME`, `BONUS`, `PARTNER_SUPPLY_COST`, `PENALTY`, `TAX`, `OWNER_SAVING_HELD`, `OLD_DEBT_PRINCIPAL`, `OLD_SAVING_RELEASE`, `OTHER_ADJUSTMENT`), `amount_idr >= 0`, `net_sign` terbatas sesuai jenis, `accounting_class` (`INCOME`, `EXPENSE`, `OWNER_ASSET`, `LIABILITY`, `PRINCIPAL`, `OTHER_PENDING`), source label/snapshot, `is_verified`, `version`.
- Relasi: N..1 settlement version. Hanya komponen yang benar-benar diketahui dimasukkan; missing tidak diwujudkan sebagai zero line.
- Constraint: mapping komponen ke laba/payout harus eksplisit dan direview Owner. Sapronak yang sudah mengurangi net settlement bukan cost owner kedua; tabungan yang masih hak Owner adalah asset/receivable; pelunasan pokok lama bukan cost saat ini. Settlement net negatif bukan cash receipt negatif.
- Index: `(tenant_id, settlement_version_id, component_kind)`.

Konvensi tanda bukan bebas: income/bonus menambah hak kemitraan; biaya/penalti/pajak yang benar-benar mengurangi hak mengurangi hak sesuai klasifikasi; tabungan Owner ditahan dan pelunasan pokok utang lama mengurangi jumlah payout namun bukan cost/income; pelepasan tabungan lama menambah payout namun bukan income periode baru; `OTHER_ADJUSTMENT` menunggu klasifikasi eksplisit. Rincian sapronak analitis tidak otomatis disalin menjadi cost entry.

Net hak dan expected payout mengikuti rekonsiliasi SET-04, bukan formula universal/kontrak yang dibuat sendiri. R1 menyimpan komponen aktual yang dimasukkan Owner; estimasi/kontrak adalah R2.

#### `settlement_right_declaration`

- Field: `id`, `tenant_id`, `cycle_id`, `partner_id`, `declaration_kind=NO_RIGHT_DUE`, `declaration_status` (`DRAFT`, `VERIFIED`, `SUPERSEDED`), `declared_by_user_id`, `declared_at`, `source_note` nullable, `version`, `supersedes_id` nullable.
- Relasi: deklarasi Owner untuk menyatakan tidak ada hak settlement yang jatuh pada cycle/partner tersebut. Bukan dokumen RHPP dan bukan bukti payout.
- Constraint: nilai nol dianggap sah hanya jika Owner mengesahkan deklarasi ini; unique satu deklarasi efektif per `(cycle_id, partner_id)`. Saat dokumen/rights ditemukan, supersede deklarasi dan buat settlement version baru. Jika mitra/hak masih tidak diketahui, jangan buat deklarasi kosong untuk meluluskan lock.
- Efek: tidak membuat income, receivable, payable, atau cash movement; menjadi sumber checklist/coverage financial lock.
- Index: `(tenant_id, cycle_id, partner_id, declaration_status)`.

### 11.2 Notice, penerimaan payout, dan unmatched suspense

#### `partner_payout_notice`

- Field: `id`, `tenant_id`, `settlement_version_id` nullable, `notice_status` (`ANNOUNCED`, `CANCELLED`, `SUPERSEDED`), jumlah/tanggal rencana nullable, label status sumber, created/updated actor, `version`.
- Relasi: informasi saja; tidak menghasilkan cash movement, obligation application, atau status PAID.
- Index: `(tenant_id, settlement_version_id, notice_status)`.

#### `partner_payout`

- Field: `id`, `tenant_id`, `financial_source_event_id`, `partner_id`, `cycle_id` nullable, `cash_account_id`, `received_at`, `amount_idr`, `currency_code=IDR`, `settlement_version_id` nullable, `reconciliation_status` (`MATCHED`, `PARTIAL`, `UNRECONCILED`), bukti opsional, `version`.
- Relasi: creates actual cash IN. Bila hak terverifikasi, cash IN dapat melunasi receivable; bila hak belum diketahui, buat payable `UNMATCHED_RECEIPT_SUSPENSE` sebesar penerimaan, lalu gunakan offset `SUSPENSE_TO_SETTLEMENT_RIGHT` saat dipadankan ke receivable yang verified. Menautkan RHPP belakangan tidak membuat penerimaan kedua.
- Constraint: payout actual bukan pendapatan otomatis dan bukan bukti hak total. Overage/multi-payment mesti dialokasikan atau jadi advance/suspense. Net-only payment boleh tanpa invoice detail.
- Refund suspense yang benar-benar dibayar keluar membuat source baru dengan cash OUT dan application pada `UNMATCHED_RECEIPT_SUSPENSE` payable, maksimum sisa belum dipadankan. Cash IN/payout asal tetap historis; refund bukan cost atau penghapusan penerimaan. Refund setelah sebagian sudah matched memerlukan koreksi/application sah pada bagian matched terlebih dahulu, tidak boleh mengurangi suspense yang sudah habis.
- Index: `(tenant_id, partner_id, received_at)`, `(tenant_id, cycle_id, reconciliation_status)`, `(tenant_id, financial_source_event_id)`.

#### `settlement_coverage`

- Field: `id`, `tenant_id`, `cost_allocation_line_id`, `settlement_component_id`, `amount_idr`, `version`, `approved_by_user_id`, `approved_at`, `reversal_of_id` nullable.
- Relasi: satu allocation/component dapat memiliki 0..N coverage revision; effective links menentukan jumlah biaya yang sudah mengurangi net hasil kemitraan.
- Constraint: total coverage efektif tidak melebihi allocation line atau nilai komponen settlement net yang relevan; cost line dan settlement component tenant sama; perubahan menjadi revision/reversal. Reimburse yang menambah income tidak bisa menjadi coverage.
- Index: `(tenant_id, cost_allocation_line_id)`, `(tenant_id, settlement_component_id)`.

Coverage hanya mengurangi pengurang laba kedua kali; tidak menghapus cost/cash atau menurunkan angka laporan biaya bruto.

<a id="dm12"></a>
## 12. Recording DAILY, revisi, dan coverage

### 12.1 `daily_recording`

Nama resource API `daily_summary` adalah alias untuk aggregate ini dan `daily_recording_revision`; tidak ada tabel summary kedua atau penjumlahan lintas versi.

- Field header: `id`, `tenant_id`, `cycle_id`, `farm_id` diturunkan/dikunci cocok dengan cycle, `business_date`, `current_revision_id`, `current_version`, `created_at`, `version`.
- Relasi: tepat satu header untuk satu tanggal usaha per cycle; revisi yang dihasilkan banyak user/perangkat terhubung ke header sama. Tidak ada `building_id` wajib atau key per ABK.
- Constraint inti K-25/REC-15: unique `(tenant_id, cycle_id, business_date)`; cycle harus berada pada mode DAILY untuk tanggal tersebut dan tanggal di dalam cutoff/cakupan yang sah. Constraint header/revisi mencegah dua create pertama paralel.
- Index: unique `(cycle_id, business_date)`, `(tenant_id, farm_id, business_date)`, `(tenant_id, cycle_id, business_date)`.

### 12.2 `daily_recording_revision`

- Field: `id`, `tenant_id`, `daily_recording_id`, `revision_no`, `supersedes_revision_id` nullable, `expected_base_version`, `recording_source=DAILY`, `as_of_date`, `created_at_device` nullable, `feed_used_quantity` nullable, `feed_unit_code` nullable, `feed_conversion_snapshot` nullable, `mortality_count` nullable, `cull_count` nullable, `sampling_at` nullable, `sample_count` nullable, `sample_net_weight_kg` nullable, `completeness` (`COMPLETE`, `PARTIAL`), `explicit_zero_fields`, `author_user_id`, `corrector_user_id` nullable, `correction_reason` nullable, `mode_revision_id`, `received_at_server`, `effective_at`, `status` (`RECEIVED`, `SUPERSEDED`, `REJECTED`), `version`.
- Relasi: N..1 header, tepat satu revisi efektif; sample fields opsional sebagai satu paket pengamatan point-in-time; rekap global tidak diprorata ke building.
- Constraint: unique `(daily_recording_id, revision_no)`; revision baru memerlukan expected current version dan supersedes current; stale submit `VERSION_CONFLICT`; satu `effective` per header. `business_date` adalah key lokal, `as_of_date` adalah tanggal data sumber benar-benar mencakup, waktu perangkat dan `received_at_server` tidak saling mengganti. `sample_count` integer >0 dan `sample_net_weight_kg >0` ketika sampling terisi; unit dan bobot net snapshot eksplisit. Mortality/cull integer ≥0. Nilai nol untuk data lengkap harus dikonfirmasi eksplisit; null berarti belum diisi.
- Constraint tambahan: angka yang tercatat bukan harga/biaya/stok; satu submit dan retry tidak dijumlah; mode OFF tidak menampilkan form; actor bukan key rekap. Satu sampling harian dapat tidak ada tanpa menjadikan semua recording invalid bila completeness/kebijakan field mendukung.
- Index: `(tenant_id, daily_recording_id, revision_no)`, `(tenant_id, author_user_id, received_at_server)`, `(tenant_id, mode_revision_id)`.

### 12.3 Hari kosong, cutoff, dan agregasi

Tidak membuat satu row nol/dummy untuk setiap tanggal tanpa submit. `GAP` dihitung pada read model berdasarkan tanggal yang diharapkan, mode, cutoff, dan coverage. `PARTIAL`, GAP, OFF, serta data sebelum/sesudah cutoff ditampilkan jujur dan tidak dipakai sebagai metrik final. Aggregasi periode memakai tepat satu revisi efektif per tanggal untuk feed/mati/afkir; sampling tetap point-in-time dan tidak dijumlah sebagai bobot populasi. DAILY valid menjadi effective langsung saat server menerima; bukan menunggu approval Owner.

Revisi recording mengoreksi nilai hari itu, mempertahankan penulis awal, actor koreksi, alasan jika diwajibkan oleh alur, dan histori. Mode/cutoff version disimpan agar data lama tidak tertafsir berdasarkan mode baru. Revisi DAILY tidak membuat biaya, kas, consumption, atau efek inventory R1.

<a id="dm13"></a>
## 13. Receipt, offline, audit, file, outbox, dan ekspor

### 13.1 `command_receipt`

- Field: `id`, `data_space_id` (tenant R1; private space tidak tersedia), `command_type`, `operation_id`, `business_payload_hash`, `actor_user_id`, `origin_device_registration_id` nullable, `origin_recovery_epoch`, `last_request_epoch`, `receipt_status` (`COMMITTED`, `TERMINAL_REJECTED`, `RESTORE_REVIEW_REQUIRED`), `financial_source_event_id` nullable FK untuk command ledger, `result_kind`/`result_id` opaque untuk acknowledgement saja, `committed_at`, status/response versi minimal.
- Constraint utama FIN-05/FIN-12: unique `(data_space_id, command_type, operation_id)`; hash bisnis kanonis meliputi scope dan source refs yang tak dapat berubah, tidak meliputi token/session/request epoch. Receipt commit berada pada transaksi yang sama dengan source/effects/audit/outbox. R1 tidak commit row PROCESSING mandiri; crash rollback seluruh claim dan effect.
- Retry key/hash sama menghasilkan hasil yang sama tanpa efek baru setelah gate scope/status; key sama/hash berbeda = payload mismatch. Receipt bukan izin baca; setelah grant dicabut, actor asli yang masih authenticated hanya boleh mendapat acknowledgement minimal sesuai kebijakan.
- `result_id` bukan FK umum dan bukan jalur query/otorisasi; untuk operasi non-ledger ia hanya mengidentifikasi hasil receipt minimum. Semua pembacaan detail harus memakai typed query ke objek dengan ACL terkini. Effect link untuk rekonsiliasi memiliki FK spesifik.
- Retensi: identitas key/hash/status/dedupe dipertahankan selama source finansial/prod terkait masih disimpan; bukan cache TTL pendek. Jangan purge command lama bila HP masih mungkin mengirim payload lama.
- Index: unique key di atas; `(data_space_id, actor_user_id, committed_at)`, `(data_space_id, receipt_status, origin_recovery_epoch)`.

`operation_id` dibuat sekali pada perangkat sebelum menampilkan “tersimpan di HP”. Local queue menyimpan payload, parent/dependency IDs, base version, author/device/tenant asal, occurred time, schema payload version, dan hash. Sync parent lebih dulu; file upload terpisah. Reconnect memeriksa sesi, grant, cycle mode/status, expected version, tenant, dan recovery epoch saat ini. Jangan buat operation ID baru untuk mengatasi timeout/401/403 atau hasil belum diketahui.

### 13.2 Restore epoch dan tombstone

#### `recovery_epoch`

- Field: `id`, epoch monotonik/non-reused, waktu dibuat, incident/snapshot ref, actor/proses berwenang, status layanan, cutoff yang diketahui, audit ref. Nilai epoch terkini tidak boleh dipulihkan dari backup lama tanpa menaikkan epoch.

#### `restore_review_case` dan `replay_tombstone`

- Case: `id`, `tenant_id`/data-space, `operation_id`, command type, origin epoch, incident ID, status (`OPEN`, `RECONCILED_NOT_POSTED`, `RESTORED_ONCE`, `CORRECTED`, `UNRESOLVED`), bukti/ref receipt, actor persetujuan, waktu/reason.
- Tombstone: key asli `(data_space_id, command_type, operation_id)`, payload hash bila diketahui, final disposition, canonical source/correction receipt bila ada, resolved epoch, timestamp. Tombstone mencegah replay pra-restore yang efeknya di titik restore tidak ada.
- Constraint: merekonsiliasi ID lama ke correction baru dan mencatat terminal tombstone dilakukan atomik. Epoch request baru tidak membersihkan provenance/review. Jika bukti tidak cukup, tetap UNRESOLVED; jangan mengarang bahwa transaksi belum pernah ada.
- Index: unique case per `(data_space_id, command_type, operation_id, incident_id)`; unique replay tombstone key.

Riwayat grant/revocation dan primary-owner recovery memerlukan bukti yang tahan restore menurut `SECURITY_OPERATIONS.md`; snapshot lama tidak boleh menghidupkan kembali akses yang telah dicabut. Restore memulihkan konsistensi sumber, effects, receipt, audit, outbox, revisions, tombstones, dan referensi file; login kembali bukan bukti restore lulus.

### 13.3 `audit_event`

- Field: `id`, `tenant_id` nullable hanya untuk audit platform tanpa payload tenant bisnis, `actor_user_id`/service actor, `action`, `object_kind`, typed object FK/reference, `object_version_before/after`, `occurred_at`, `received_at_server`, `operation_id`, `reason` nullable, metadata field-level yang diperlukan, `proxy_author_id` nullable.
- Aturan: append-only; actor sebenarnya diambil server; catat perubahan akses, financial approval/post/reversal, recording correction, lock/reopen, opening, export/download, recovery, attachment status. Jangan menyimpan password, token, signed URL, atau isi private document yang tidak perlu.
- Index: `(tenant_id, object_kind, object_id, received_at_server)`, `(tenant_id, actor_user_id, received_at_server)`, `(tenant_id, operation_id)`.

### 13.4 Lampiran privat

#### `attachment` dan `attachment_link`

- `attachment`: `id`, `tenant_id`, private `storage_key`, `sha256`, `mime_type_detected`, `byte_size`, `scan_status`, `upload_status` (`PENDING`, `UPLOADED`, `FAILED`, `QUARANTINED`, `DELETED`), `storage_presence_status` (`UNKNOWN`, `PRESENT`, `MISSING`), `last_integrity_checked_at` nullable, `created_by_user_id`, `created_at`, `deleted_at` nullable.
- `attachment_link`: `id`, `tenant_id`, `attachment_id`, satu FK bertipe ke `financial_source_event_id`, `cycle_id`, `daily_recording_revision_id`, `operational_receipt_id`, `partner_settlement_version_id`, atau `cash_claim_id`; `created_at`, `version`.
- Constraint: tepat satu parent FK terisi dan tenant sama; jangan hanya mengandalkan `parent_type + parent_id` tanpa FK/validasi server. ACL/visibility mewarisi parent dan tidak bisa meluaskan akses; draft tanpa parent final hanya visible bagi author yang berhak.
- File tidak diperlukan agar transaksi pokok R1 sah; upload file/asynchronous scan tidak rollback purchase yang sudah accepted. Pending file bukan bukti sudah tersedia di perangkat/server lain. URL privat sementara diterbitkan setelah otorisasi aktif.
- Status API adalah proyeksi: `LOCAL_ONLY`/`METADATA_PENDING` hanya diketahui client; `UPLOAD_PENDING`/`UPLOADING` menunjukkan intent/byte belum selesai; `AVAILABLE` memerlukan upload lengkap, pemeriksaan keamanan yang diwajibkan lulus, file hadir dan ACL aktif. `MISSING` disimpan pada presence saat rekonsiliasi storage/restore gagal menemukan versi/hash yang benar; bukan sekadar belum upload. Quarantine/failed/deleted tidak boleh diproyeksikan available. Unduhan tetap melalui pengecekan izin terkini, bukan status file saja.
- Index: `(tenant_id, upload_status, created_at)`, `(tenant_id, attachment_id)`, masing-masing FK parent.

### 13.5 Outbox, notification, dan export

#### `outbox_message`

- Field: `id`, `tenant_id`, `financial_source_event_id` nullable untuk task non-ledger, `event_key`, `message_type`, versi payload, payload minimum, `created_at`, `available_at`, `attempt_count`, `status` (`PENDING`, `PROCESSING`, `DONE`, `DEAD_LETTER`), `processed_at` nullable.
- Constraint: unique `(tenant_id, event_key)`; ditulis dalam transaction yang sama dengan source/effects/receipt; payload tidak memuat secret; worker idempotent. Job tidak mendapat hak data permanen dari saat diterima—otorisasi scope dan status dicek saat kerja.
- Index: `(status, available_at)`, `(tenant_id, financial_source_event_id)`.

#### `notification`

- Field: `id`, `tenant_id`, `recipient_user_id`, `notification_kind`, parent typed ref, minimal safe summary, `created_at`, `read_at` nullable, `dedupe_key`.
- Constraint: unique `(tenant_id, recipient_user_id, dedupe_key)`; field dibentuk sesuai ACL parent, bukan data keuangan sensitif ke ABK. Push bukan syarat R1.
- Index: `(tenant_id, recipient_user_id, read_at, created_at)`.

#### `export_job` dan `export_manifest`

- Job: `id`, `tenant_id`, `requesting_user_id`, export kind/scope/date filters, data cutoff/snapshot/version, `job_status` (`PENDING`, `RUNNING`, `READY`, `FAILED`, `EXPIRED`, `CANCELLED`), `command_receipt_id`, `created_at`, `completed_at` nullable.
- Manifest: job ID, covered object classes/range, generated timestamp, source revision/cutoff, file hash/status, missing/pending/conflict/recovery limitations, access policy; no password/hash credential/other tenant/private book.
- Constraint: request receipt/outbox atomik; file private; every create/download checks current permission. Export portabilitas bukan backup/PITR dan bukan import otomatis; server tidak mengetahui draft/capture-only yang belum pernah diterima.
- Index: `(tenant_id, requesting_user_id, created_at)`, `(tenant_id, job_status, created_at)`.

<a id="dm14"></a>
## 14. Constraint, indeks, dan urutan lock

### 14.1 Constraint yang harus berada di database atau dijaga setara

| Kelompok | Constraint/validasi atomik |
|---|---|
| Tenant FK | Semua FK tenant-scoped memakai `(tenant_id, referenced_id)`; source, effect, attachment, allocation, obligation, receipt, dan child line tidak menyeberang tenant. |
| Keanggotaan | `tenant_membership` unik tenant/user; grant aktif unik tenant/farm/user; employee assignment dapat beberapa orang aktif di kandang sama. |
| Periode | Unique partial maksimum satu cycle ACTIVE per tenant/farm; cycle ACTIVE punya actual chick-in + live DOC >0; physical/financial status terpisah. |
| Recording | Unique daily `(cycle_id,business_date)`; revision sequence unik; revision baru cocok expected version; tepat satu current/effective; tidak ada building/user dalam natural key. |
| Source/idempotensi | Unique command receipt key; unique source typed reference; source effect key unik; correction/reversal memiliki FK ke asal dan alasan/actor. |
| Akun | Movement mengacu akun tenant sendiri; transfer pair punya OUT dan IN satu nilai; transaksi confirmed tidak mengurangi kas di bawah batas D-04; saldo dihitung dari opening + effect sah. |
| Purchase | Line/payments/application menjumlah dalam batas source; pembayaran terpisah dari biaya; posting source hanya satu; resolusi klaim efektif maksimum satu. |
| Cost | Satu cost entry per efek pengakuan source; allocation plan efektif satu per cost; `source=allocated+unallocated`; allocation amounts nonnegative; coverage ≤ allocation dan component yang tepat. |
| Obligation | Principal positive; aplikasi + offsets tidak melebihi principal; payable dibayar OUT, receivable diselesaikan IN; offset hanya pasangan receivable/payable yang sah. |
| Payroll | Employee/cycle/farm konsisten; salary finalized immutable; kasbon target employee sama, ≤ outstanding dan payable gaji tersisa; work wage terpisah. |
| Settlement | Settlement version berurutan; unknown net NULL; payout actual ada movement; notice tidak; suspense match tidak menghasilkan cash receipt kedua; classification COMPLETE butuh pemetaan yang cukup. |
| Attachment/export | FK parent typed valid, scope cocok, object storage privat, izin pada setiap download; file status terpisah dari transaction status. |
| History/recovery | Audit/receipt/reversal/tombstone tidak hard-delete selama retensi efektif; restore epoch naik; replay pra-restore yang unresolved diblokir. |

Aggregate check (jumlah line, saldo, atau total aplikasi) memerlukan transaksi pengunci/conditional update/constraint trigger setara; `CHECK` satu row saja tidak cukup untuk sum lintas baris. Query laporan tidak membuat angka authoritative bila proyeksi tertinggal.

### 14.2 Indeks minimum

Selain indeks per entitas yang disebut di atas, wajib rencanakan:

- seluruh FK tenant/scope yang dipakai join atau authorization query;
- daftar business inbox: `(tenant_id, review_status, occurred_at, id)` dan `(tenant_id, resolution_status, occurred_at, id)`;
- activity per employee/farm/cycle dengan tanggal kejadian dan status;
- `financial_source_event` berdasarkan tenant, tanggal kejadian, posting status;
- `cash_movement` per account dan value date;
- obligation outstanding per party, kind, cycle, status;
- audit, receipt, outbox, attachment, export per tenant/actor/status/time;
- unique natural keys yang disebut (period-active partial key, daily key, username sesuai keputusan, source ref, receipt, opening batch line kind/scope bila disetujui).

Index tidak memberi izin akses dan tidak mengatasi race. Query list, detail, agregasi, export, job, dan lookup file harus membuktikan scope dan filter ACL di server.

### 14.3 Lock order konkurensi — usulan, bukan vendor lock-in

Gunakan transaksi DB singkat untuk setiap command finansial. Sebelum write, bentuk aktor/scope dan normalisasi payload di server; cek authorization/tenant/status/recovery epoch lagi dalam transaksi. Lock hanya record yang menjadi invariant, dengan urutan konsisten berikut; dalam satu kelas lock banyak ID harus urut lexicographic ID:

1. Claim/serialize `command_receipt` key `(data_space, command_type, operation_id)`; unique conflict menunggu sebentar lalu baca hasil committed atau retry key yang sama. Jangan commit PROCESSING terpisah untuk ledger sync R1.
2. Tenant service state dan membership/grant version yang menentukan mutation; lalu farm/cycle scope row untuk tanggal/mode/financial status. Urutan parent: tenant → membership/grant → farm → cycle.
3. Record sumber/dokumen dan expected version (purchase, payroll, settlement, daily header/revision, claim); untuk DAILY reserve unique `(cycle_id,business_date)` sebelum publish revision.
4. Cash account IDs berurutan, lalu obligation IDs berurutan, lalu cost/allocation/settlement child IDs berurutan. Jika operasi tidak memerlukan kelas tertentu, lewati kelas itu; jangan membalik urutan.
5. Validasi ulang saldo/outstanding/status/version, tulis source/effects/revision, audit, command receipt final, dan outbox; commit semua bersama.

Perubahan grant/revoke, cycle lock/reopen, dan source posting harus berkoordinasi pada row scope/version yang sama supaya tidak ada race antara cek client dan commit. Posting dan finance lock menserialisasi lewat cycle; settlement/payment lewat obligation/account; transfer lewat kedua account. Gunakan conditional updates/unique constraints untuk row yang belum ada; jangan berharap row lock pada row yang belum terbentuk. Deadlock/serialization conflict me-rollback seluruh command, lalu retry terbatas dengan operation ID sama dan validasi ulang, bukan retry satu effect.

Tingkat isolasi/teknik final (row lock, conditional update, serializable, trigger) belum dipilih; tentukan melalui ADR terhadap database terpilih. Tidak ada klaim bahwa isolasi default vendor otomatis menjaga seluruh invariant. Batch Owner bukan transaksi besar: setiap dokumen mendapatkan receipt dan transaksi atomik sendiri; hasil per dokumen.

<a id="dm15"></a>
## 15. Aljabar koreksi dan versi

### 15.1 Rumus dasar read model

```text
saldo_akun(C) = opening_balance_terverifikasi(C)
              + SUM(movement_IN yang posted dan berada setelah cutoff C)
              - SUM(movement_OUT yang posted dan berada setelah cutoff C)

saldo_obligation = principal
                 - SUM(application valid)
                 - SUM(offset pair valid pada sisi obligation ini)

saldo_kasbon(employee) = opening_advance_receivable
                       + SUM(disbursement posted)
                       - SUM(repayment application)
                       - SUM(kasbon-to-salary offset)

cost_net_root = recognition_amount - SUM(reversal sah bertaut root)
biaya_owner_periode = SUM(allocation line efektif dari net root ke cycle)
pengurang_laba_setelah_net_settlement
  = biaya_owner_periode - SUM(settlement_coverage yang terverifikasi)

cost_net_root = SUM(allocation line efektif) + unallocated_amount
```

Empat pertanyaan laporan selalu terpisah: (1) uang mana bergerak dan kapan, (2) biaya/hak kapan diakui, (3) periode mana menanggung alokasi, (4) apakah biaya telah menurunkan net settlement. Coverage hanya mengurangi pengurang laba setelah net settlement; laporan biaya tetap menampilkan biaya penuh. Jangan mengurangi cost dua kali karena payment, reimbursement, atau settlement application.

### 15.2 Koreksi source finansial

1. Posted source/efek tidak diedit/dihapus. Simpan fakta lama dan `reversal_of_*`/correction link.
2. Jika fakta dibukukan salah, buat satu correction source baru yang menyatakan bagian dibalik dan nilai/fakta pengganti; efek reversal dan replacement/delta terjadi atomik dengan receipt, audit, dan alasan.
3. Default aman ketika total sumber berubah adalah reversal penuh nilai salah lalu source pengganti dengan nilai benar; partial reversal hanya bila kejadian nyata memang parsial dan remainder masih benar. Jangan menambal total laporan tanpa efek yang bisa ditelusuri.
4. Pembalikan bookkeeping tidak menyatakan uang fisik kembali. Bila uang benar-benar dikembalikan, catat cash IN/refund nyata. Bila catatan pembayaran salah tetapi transfer fisik terjadi, koreksi klasifikasi/obligation, jangan menghapus cash movement aktual.
5. Klaim pengeluaran terminal `NOT_OCCURRED` menghilangkan klaim pending tanpa cash/cost effect; `DUPLICATE_OF` menaut source kanonis; tidak membuat nominal negatif atau potong gaji.
6. Perubahan alokasi saja membuat plan baru tanpa cost entry tambahan. Perubahan nilai membuat recognition/reversal immutable menurut §8.1 dan plan net root baru atomik; jangan menjumlah gross root serta semua nominal reversal sebagai positif. Settlement correction membuat versi baru + delta disetujui; payout lama tetap satu movement dan direkonsiliasi terhadap hak baru.

### 15.3 Koreksi rekap produksi

Revisi DAILY baru adalah snapshot pengganti untuk header/tanggal. Satu revisi efektif dipakai agregasi. Untuk feed/mati/afkir, jumlah rentang = nilai tepat satu revisi efektif per tanggal (gap diungkapkan). Sampling adalah observation point-in-time; tidak ditotal menjadi bobot populasi. Retry ID sama/payload sama replay receipt; revision stale mendapat conflict; ID baru tetap membutuhkan expected version dan tidak menambah versi efektif kedua.

### 15.4 Koreksi opening dan cutoff

Opening adalah posisi pada satu cutoff, bukan income/cost/cash event baru untuk periode berjalan. Untuk koreksi opening yang telah disahkan, buat versi/reconciliation delta tertaut yang mengubah baseline efektif satu kali, dan dokumentasikan dampak terhadap opening balance/obligation serta coverage historis. Semua peristiwa setelah cutoff tetap dihitung sekali saja. Tidak menjalankan ulang event historis yang sudah termasuk opening.

<a id="dm16"></a>
## 16. Contoh sintetis yang harus cocok

Angka di bawah fixture uji sintetis yang bersumber dari golden example PRD; bukan data pelanggan atau keputusan harga baru.

### Contoh A — Uang pegangan bukan biaya

1. Kas utama tenant Rp2.000.000; kas pegangan ABK Rp0. Transfer Rp1.000.000 menghasilkan dua movement: utama OUT Rp1.000.000, pegangan IN Rp1.000.000. Total kas tetap Rp2.000.000; cost Rp0.
2. Klaim gas Rp300.000 oleh ABK sebelum review tidak mengubah balance ledger: saldo tercatat pegangan Rp1.000.000, klaim unresolved Rp300.000, perkiraan fisik dapat ditampilkan Rp700.000 hanya jika tidak ada ambiguity/penerimaan pending.
3. Owner approve/post pembelian konsumabel yang diterima: kas pegangan OUT Rp300.000, cost Rp300.000; saldo pegangan Rp700.000. Pengembalian Rp200.000 adalah transfer nyata ke kas utama: pegangan Rp500.000, utama Rp1.200.000, total kas Rp1.700.000, cost tetap Rp300.000.

### Contoh B — Talangan dan pembayaran berangsur

ABK membeli solar Rp150.000 dari uang pribadi. Ketika barang diterima dan disetujui, satu source membentuk cost Rp150.000 + payable reimbursement Rp150.000, tanpa cash movement usaha. Owner bayar dari kas usaha Rp100.000 lalu Rp50.000; dua cash OUT/application melunasi payable. Cost tetap Rp150.000 dan tidak ada kasbon ABK.

### Contoh C — Kasbon melampaui gaji

Kasbon usaha disalurkan Rp1.800.000: kas OUT Rp1.800.000, piutang employee Rp1.800.000. Gaji kemudian difinalkan Rp1.500.000: cost gaji Rp1.500.000 + payable gaji Rp1.500.000. Owner memilih offset Rp1.500.000: dua saldo obligation berkurang, tidak ada kas baru/cost kedua; gaji tunai due Rp0 dan kasbon masih receivable Rp300.000. Upah pekerjaan apa pun berada pada payable/cost terpisah dan tidak dipotong otomatis.

### Contoh D — Alokasi rupiah harus utuh

Cost bersama Rp1.000.001 dibagi sama ke tiga tujuan A/B/C. Floor awal Rp333.333 per target; dua residu jatuh pada urutan tie tersimpan A lalu B. Hasil: A Rp333.334, B Rp333.334, C Rp333.333; total alokasi tetap Rp1.000.001. Bila hanya Rp600.000 dari cost Rp1.000.000 dialokasi sama ke tiga target, masing-masing Rp200.000 dan sisa unallocated Rp400.000.

### Contoh E — Settlement, tabungan, pokok, payout, laba

Hak penghasilan kemitraan net terverifikasi Rp50.000.000; tabungan yang masih milik Owner ditahan Rp5.000.000; pokok utang lama Rp2.000.000. Payout expected Rp43.000.000, bukan income baru. Dua pembayaran nyata Rp20.000.000 + Rp23.000.000 melunasi receivable. Tambah pendapatan sampingan Rp2.000.000 dan biaya Owner di luar settlement Rp12.000.000: laba manajerial Rp50.000.000 + Rp2.000.000 − Rp12.000.000 = Rp40.000.000. Payout Rp43 juta, tabungan, pokok utang, atau rincian sapronak yang sudah di-net tidak dikurangkan/dihitung ganda.

Varian `PAYOUT_ONLY`: Owner mencatat payout nyata Rp20.000.000 sebelum tahu hak total. Cash account naik Rp20.000.000 dan unmatched suspense Rp20.000.000; hak net/laba tetap unknown, classification PENDING, settlement `UNRECONCILED`. Setelah dokumen terverifikasi menetapkan payout right Rp43.000.000, source payout Rp20 juta di-match/application sekali dan remaining receivable Rp23 juta; jangan membuat cash receipt kedua saat menambahkan RHPP.

Varian coverage: cost gas Owner Rp1.000.000 tetap tampil penuh pada laporan biaya. Jika komponen settlement terverifikasi menunjukkan Rp400.000 gas yang sama telah mengurangi net hak, `settlement_coverage` Rp400.000 membuat pengurang laba setelah net settlement Rp600.000, bukan cost entry baru Rp600.000. Jika PT justru menambahkan reimbursement Rp400.000 ke pendapatan, coverage untuk cost itu tetap nol.

### Contoh F — DAILY revisi mengganti, bukan menambah

Revisi pertama pada D: feed 100 kg, mati 2, afkir 1. Koreksi sah menggantinya menjadi feed 95 kg, mati 3, afkir 1. Nilai efektif D adalah versi kedua, bukan feed 195/mati 5. Hari D+1 feed 20, mati 1, afkir confirmed 0: rentang feed 115, mati 4, afkir 1. Sampling disimpan sebagai observation terpisah dan tidak dijumlah ke bobot populasi.

### Contoh G — Opening di tengah periode

Pada cutoff C yang eksplisit, kas usaha diketahui Rp500.000 dan payable toko Rp100.000. Kasbon ABK semula Rp500.000; Owner sudah mengaplikasikan Rp300.000 ke hak gaji bruto Rp3.000.000 yang sudah difinalkan sebelum C, serta membayar gaji Rp1.000.000. Opening salary payable = Rp1.700.000; opening kasbon outstanding = Rp200.000; cost gaji historis Rp3.000.000 dicatat sebagai sudah diakui sebelum C. Jangan buat biaya gaji baru Rp3.000.000, bayar advance dua kali, atau menerapkan lagi Rp300.000 yang sudah terhitung. Opening tidak membuat pendapatan Rp500.000, pembelian Rp100.000, atau kasbon baru Rp500.000. Event dengan waktu >C dicatat sesudah cutoff satu kali; untuk waktu tepat C gunakan keputusan `cutoff_event_assignment`, bukan default perbandingan timestamp. Jika total cost historis belum lengkap, laporan menandai coverage PARTIAL dan tidak menyebut laba seluruh periode final.

<a id="dm17"></a>
## 17. Versi skema, retensi, dan pemulihan

### 17.1 Versi record versus versi skema

- `version` optimistic pada record mutable, revision number pada revisi immutable, `schema_version` pada payload antrean lokal/export, dan `recovery_epoch` adalah empat konsep berbeda; jangan memakai satu counter untuk semuanya.
- DDL/migrasi belum ditetapkan. Usulan rollout mendatang: expand schema yang dapat membaca data lama, deploy reader kompatibel, backfill tervalidasi/reconcilable, switch writer, observasi checksums/counts/invariants, kemudian hapus field lama hanya setelah batas dukungan klien/offline disahkan. Jangan destructive migration satu langkah.
- API/payload lokal harus mempertahankan dukungan versi selama masa transisi yang disepakati. Payload tak dikenal masuk `update_required`/quarantine dan tetap tersimpan; jangan buang antrean atau menyamarkan statusnya.
- Perubahan enum, presisi, timezone, relationship, receipt key, dan constraint uniqueness membutuhkan compatibility note, tes migrasi forward/rollback, serta update `API_SYNC_SPEC.md`/`TEST_PLAN.md`/`Implementation Plan.md` bila file itu sudah tersedia. Ini bukan instruksi untuk mulai migrasi sekarang.

### 17.2 Retensi dan penghapusan

- Usulan aman: jangan purge source posted, effect, correction link, receipt key, audit finansial, opening, revision DAILY, settlement mapping, atau tombstone selama transaksi sumber masih disimpan. Retensi legal/privasi belum diputuskan Q-11; tetapkan masa dan prosedur anonimisasi setelah ditinjau, bukan hard-delete sepihak.
- Pertahankan `capture_note_conversion` unique key/hash/disposition selama note offline lama masih mungkin diunggah atau canonical claim/effects terkait dipertahankan; menghapus target claim tidak boleh menghapus natural-key tombstone dan membuka conversion kedua. Retensi legal Q-11 dapat menghapus/anonimisasi payload hanya melalui kebijakan yang tetap menjaga replay defense.
- Lampiran dapat mempunyai retensi terpisah setelah legal/security review; metadata hash/status dan audit linkage tidak boleh membuat seolah bukti masih tersedia bila file dihapus. Export file/signed URL punya lifecycle tersendiri dan private access check setiap download.
- Disable akun/pegawai, archive master/tenant, delete local cache, penghapusan file, financial reversal, dan purge legal adalah aksi berbeda. Jangan gunakan cascade delete untuk menghapus histori finansial atau replay defense.
- Backups/PITR bukan retention policy dan bukan izin operasional; restore perlu mempertahankan/rekonsiliasi receipt, tombstone, audit, epoch, dan grant revocation evidence.

### 17.3 Pemeriksaan sebelum dan sesudah restore

Sebelum membuka write setelah restore, cocokkan manifest/count/checksum untuk source, effects, receipt, outbox, audit, revision, tombstone dan attachment references; naikkan epoch pada control plane yang tahan restore; cabut session dan revalidate grant/owner recovery; tandai operasi pra-epoch yang tidak ditemukan `RESTORE_REVIEW_REQUIRED`. Acknowledgement dari HP bukan bukti bahwa DB restored lengkap. Selidiki fakta kejadian; jangan meminta pengguna melakukan pembayaran/penyerahan uang kedua kali. Jika hasil belum dapat dibuktikan, tetap `UNRESOLVED` dan jangan membuat replacement operation ID.

<a id="dm18"></a>
## 18. Yang tidak dimodelkan sebagai dependensi R1

Jangan membuat tabel kosong, dummy record, FK wajib, atau master “0/default” untuk fitur berikut hanya demi mempersiapkan masa depan:

- `stock_pool`, `stock_movement`, `stock_location`, opening stock, consumption, opname stok, moving-average/valuation run, partial gas usage, dan inventory source matching;
- asset/fixed-asset depreciation engine, task/perawatan/visit/PPL, role/grant PPL atau Mandor, notifikasi push, APK/device IoT/CCTV;
- production event DETAIL, SUMMARY, harvest DO/trip/ticket, FCR/IP lengkap, recording authority generik, source arbitration, template/rule kontrak, calculation run, estimate/scenario;
- buku pribadi Owner, `private_account`, `private_transaction`, loan pribadi owner, cross-space pair, payroll offset atas pinjaman pribadi;
- approval/auto-post finansial otomatis dari receipt informasional, OCR/import, integrasi bank/PT, atau pembuatan invoice otomatis.

Catatan batas R1 penting: item master boleh opsional, tapi bukan SKU/inventory; receiving feed/sapronak bersifat informasi; DAILY hanya memberi pakan terpakai/mati/afkir/sampling; pembelian R1 tidak mengharuskan pemakaian barang; settlement aktual manual tidak bergantung kontrak; payout-only tidak disebut laba; akun Owner/ABK bukan akun pribadi di buku usaha.

<a id="dm19"></a>
## 19. Usulan dan keputusan yang masih terbuka

Model ini memakai konservatif default PRD tanpa menyatakan Q sudah dijawab. Sebelum produksi, sinkronkan keputusan berikut dengan `SECURITY_OPERATIONS.md`, `API_SYNC_SPEC.md`, `TEST_PLAN.md`, dan `Implementation Plan.md`:

| Rujukan PRD | Yang masih perlu diputuskan/ditinjau | Batas aman pada model ini |
|---|---|---|
| D-25 / Q-02 | Namespace uniqueness username, apakah akun ABK yang dibuat Owner bersifat tenant-managed dan eksklusif satu tenant, serta prosedur recovery/transfer Owner | `managed_by_tenant_id`, `principal_kind`, membership/grant tunggal tenant dan reset khusus ABK adalah usulan aman, belum keputusan final. Jangan link Owner/Admin/PPL/multi-tenant identity menjadi login ABK, jangan reset lintas tenant, dan jangan ubah identitas histori saat username berubah. Tinjau namespace/recovery dengan pemilik produk sebelum produksi. |
| D-01 / Q-02 | Apakah satu primary Owner cukup untuk R1 dan bukti recovery Owner | Schema usulan mengikuti satu primary Owner; co-owner/equity sharing tidak diaktifkan. |
| D-03 / Q-03 | Tindak lanjut saat Owner tidak tersedia dan siapa boleh menyetujui | Belanja ABK tetap klaim sampai Owner online approve; recording DAILY langsung efektif. Tidak ada auto-post uang. |
| D-04, D-05, D-06 / Q-04 | Klasifikasi contoh peralatan dan alokasi biaya masa kosong/overhead | Durable equipment tidak otomatis cost; unallocated remainder terlihat; jangan klasifikasi otomatis sebagai aset tetap. |
| SET-03–11 / Q-08 | Mapping contoh RHPP, pajak, tabungan, potongan PT dan komponen net | Store only known components; net payout tanpa rincian tetap classification PENDING; jangan label laba final. |
| D-09 / Q-06 | Lease/offline security detail, local key/capture note safeguards dan retensi dedupe mapping | Conversion OFF-17 memakai registration+note natural key, hash/origin immutable dan target claim tunggal agar operation ID baru tidak membuat conversion kedua; local provenance bukan grant, reconnect tetap cek izin/epoch terkini. |
| Q-10 / AT-01–AT-09 | Vendor database, ORM, isolation technique, hosting, backup/PITR, schema version | Semua tipe/index/lock adalah rancangan logis; belum mengunci teknologi, biaya, SLA, RPO/RTO. |
| Q-11 | Retensi hukum/privasi, bantuan, penghapusan file/account, expor/restore drill | Tidak purge otomatis transaksi posted/receipt/tombstone; aturan final menunggu review legal/operasional. |
| Q-12 (ditutup) | Tidak ada keputusan terbuka recording global DAILY | Jangan tanyakan ulang atau pecah per bangunan/ABK. Tetap uji conflict, correction, cutoff, mode, dan zero-vs-unknown. |

### Pemeriksaan konsistensi sebelum handoff

- [ ] `PRD.md` tetap tidak berubah oleh model ini; setiap label K/D/Q ditautkan, tidak ditimpa.
- [ ] R1 tidak bergantung pada stok, private finance, PPL, kontrak/estimasi, task, harvest DETAIL, atau integrasi eksternal.
- [ ] Setiap efek finansial memiliki satu source, tanggal pengakuan/pembayaran terpisah, receipt, audit dan relasi tenant yang jelas.
- [ ] Multi-ABK memiliki identitas/assignment/grant terpisah; recording global dan uang per pekerja.
- [ ] Akun ABK tenant-managed tidak dapat memiliki membership/grant/employee link/reset di tenant lain atau ditautkan ke principal Owner/Admin/PPL/multi-owner; capture note OFF-17 hanya satu conversion per registration+note, walau operation ID berubah.
- [ ] Opening, alokasi, application, settlement, rounding, reversal, payout suspense, serta restore replay dapat dihitung kembali dari sumber.
- [ ] Semua current-state/saldo/laporan dibuktikan dari source dan effect, bukan satu total bebas edit.

Penulisan dokumen ini tidak membuktikan implementasi, constraint DB, security, concurrency, backup, restore, atau hasil tes telah berjalan/lulus. Gate tersebut membutuhkan implementasi dan verifikasi nyata setelah fase perencanaan disetujui.

## Referensi internal

- [PRD §5: hierarki, waktu, satuan, presisi](PRD.md#s05)
- [PRD §6: hak akses dan privasi](PRD.md#s06)
- [PRD §7–8: onboarding, opening, periode, lock](PRD.md#s08)
- [PRD §9–11: status transaksi, kas, pembelian, biaya, alokasi](PRD.md#s09)
- [PRD §13–14: payroll, kasbon, upah, keuangan pribadi R2](PRD.md#s13)
- [PRD §16: OFF/DAILY dan recording R1](PRD.md#s16)
- [PRD §20: settlement/payout aktual](PRD.md#s20)
- [PRD §22: offline, conflict, file](PRD.md#s22)
- [PRD §25: kamus data dan invariant lintas-entitas](PRD.md#s25)
- [Arsitektur §6: command transaksi, konkurensi, koreksi](ARCHITECTURE.md#arch06)
- [Arsitektur §7: status, angka, laporan](ARCHITECTURE.md#arch07)
- [Arsitektur §8–11: offline, akses, file, restore](ARCHITECTURE.md#arch08)
- [SECURITY_OPERATIONS.md](SECURITY_OPERATIONS.md): kontrol akses, file, audit, retensi, dan recovery; aturan final tetap mengikuti PRD.
- [API_SYNC_SPEC.md](API_SYNC_SPEC.md): alias resource/API ke entity model serta batas command/receipt.
- [TEST_PLAN.md](TEST_PLAN.md): kandidat verifikasi invariant dan golden cases, bukan bukti test berjalan.
- [Implementation Plan.md](Implementation%20Plan.md): dependensi pekerjaan dan gate handoff bila implementasi diminta kemudian.

## Riwayat

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 September 2026 | Menulis model logis R1 dengan batas keputusan, entity dictionary, invariant lintas domain, efek sumber, concurrency, correction algebra, contoh sintetis, dan batas R2. |
