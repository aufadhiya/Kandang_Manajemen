# Skill UI/UX proyek

UI UX Pro Max dipasang lokal untuk membantu perancangan dan peninjauan antarmuka. Ini alat bantu desain, bukan aplikasi, keputusan stack, atau persetujuan desain baru.

## Sumber dan versi

| Item | Nilai |
|---|---|
| Upstream | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| Rilis | [v2.15.0](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/releases/tag/v2.15.0) |
| Paket CLI resmi | `ui-ux-pro-max-cli@2.15.0` — bukan paket lama `uipro-cli` |
| Instalasi | 23 September 2026; Universal / Agent Standard, lokal proyek |
| Instruksi utama | [skills/ui-ux-pro-max/SKILL.md](skills/ui-ux-pro-max/SKILL.md) |
| Lisensi upstream | [LICENSE.ui-ux-pro-max](LICENSE.ui-ux-pro-max) |
| Runtime pencarian | Python 3, standard library; tanpa API key atau akses jaringan |

SHA-512 paket npm diverifikasi sebelum menjalankan installer:

```text
sha512-D0J/C40xrzzi5si6ZLtRGbEE5v3QjL7d4wJNnasmP3yfDSrGiuqVCdwQiqCNnIkbqOuVoA/uonR2o1WKXh3urw==
```

Installer resmi menyalin skill utama, data, skrip, tes, serta skill pendamping `banner-design`, `brand`, `design`, `design-system`, `slides`, dan `ui-styling`. Aset bawaan dipertahankan; lihat juga lisensi yang menyertai aset pendamping. Tidak ada instalasi global atau perubahan dependensi aplikasi.

## Pemakaian

Dari root repositori, baca instruksi skill lalu jalankan pencarian terarah, misalnya:

```bash
python3 -B .agents/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
python3 -B .agents/skills/ui-ux-pro-max/scripts/search.py "error summary validation" --domain ux
```

Rekomendasi harus ditinjau terhadap `PRD.md` dan `UX_UI_SPEC.md`. Hasil generik dapat menyarankan landing page, gaya, font, atau komponen yang tidak cocok untuk pekerjaan kandang. Jangan mengadopsi hasil tersebut otomatis, mengubah keputusan pengguna, atau menyimpannya sebagai desain final. Hasil uji generator instalasi tidak disimpan sebagai dokumen desain proyek.

## Verifikasi instalasi

```bash
python3 -B .agents/skills/ui-ux-pro-max/scripts/validate_data.py

cd .agents/skills/ui-ux-pro-max/scripts/tests
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  test_core test_core_data_quality test_data_contracts \
  test_design_system_mode test_native_desktop_stack_freshness \
  test_style_taxonomy test_text_layout_resilience test_web_stack_freshness
```

Pada pemasangan ini: validasi katalog lulus; 130 tes runtime/data lulus; pencarian gaya/UX dan eksekusi generator desain berhasil. Ini bukan pengujian UI atau UAT aplikasi kandang.

`test_catalog_refresh` dan `test_relevance_evaluator` memerlukan skrip pengembangan dari repositori upstream lengkap yang tidak dibundel installer. Keduanya tidak dijalankan pada instalasi proyek ini; file tes tidak dihapus atau dilemahkan.

## Pemasangan ulang

Perintah resmi dengan versi yang dipatok, dijalankan dari root proyek:

```bash
npx --yes --package=ui-ux-pro-max-cli@2.15.0 uipro init --ai universal --offline
```

Pengunduhan CLI memerlukan jaringan; `--offline` memakai aset template bawaan saat pemasangan. Instalasi tanpa `--force` mempertahankan skill yang sudah ada. Untuk pembaruan versi, tinjau perubahan upstream dan perubahan lokal sebelum mengizinkan overwrite, lalu ulangi verifikasi. Python sudah tersedia di workspace saat pemasangan; tidak ada paket Python tambahan yang dibutuhkan.
