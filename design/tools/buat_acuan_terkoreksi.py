"""Membuat design/stitch/<layar>/corrected.html dari code.html asli dengan koreksi FRONTEND_DESIGN_SPEC §9.

File asli tidak diubah. Setiap penggantian diberi kode koreksi dan harus cocok tepat sejumlah
kali yang diharapkan; bila mockup berubah, skrip gagal agar koreksi ditinjau ulang.
Jalankan dari root repo: python3 design/tools/buat_acuan_terkoreksi.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "stitch"

AVATAR_ABK = ('<span aria-hidden="true" class="w-8 h-8 rounded-full bg-sky-tint text-primary font-label-md '
              'text-label-md font-bold flex items-center justify-center">R</span>')
AVATAR_OWNER = AVATAR_ABK.replace(">R<", ">H<")
HEADER_CLASS = 'fixed top-0 inset-x-0 z-40 pt-safe bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(31,38,135,0.04)]'


def abk_nav(active, border=False):
    items = [("hari-ini", "calendar_today", "Hari Ini"), ("uang-kas", "account_balance_wallet", "Uang Kas"),
             None, ("riwayat", "history", "Riwayat"), ("lainnya", "more_horiz", "Lainnya")]
    pill = ("max-w-md mx-auto bg-white/85 backdrop-blur-xl rounded-full px-space-xs py-1.5 flex items-center "
            "justify-around pointer-events-auto shadow-[0_8px_32px_0_rgba(31,38,135,0.08)]")
    if border:
        pill += " border border-black/[0.04]"
    out = [f'<nav aria-label="Navigasi utama" class="fixed bottom-3 inset-x-0 z-40 px-margin pointer-events-none pb-safe"><div class="{pill}">']
    for item in items:
        if item is None:
            out.append('<div class="flex items-center justify-center -mt-5"><button aria-label="Catat" class="w-12 h-12 rounded-full '
                       'bg-primary-container text-on-primary shadow-[0_6px_20px_rgba(0,117,222,0.40)] flex items-center justify-center '
                       'transition-all active:scale-90 hover:brightness-105" type="button"><span aria-hidden="true" '
                       'class="material-symbols-outlined text-2xl">add</span></button></div>')
            continue
        path, ico, label = item
        if path == active:
            cls = 'flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all active:scale-95 text-primary-container font-semibold'
            cur = ' aria-current="page"'
        else:
            cls = 'flex flex-col items-center justify-center w-14 h-12 rounded-full text-ink-black-secondary transition-all active:scale-95 hover:text-on-surface'
            cur = ''
        out.append(f'<a{cur} class="{cls}" href="#{path}"><span aria-hidden="true" class="material-symbols-outlined text-xl">{ico}</span>'
                   f'<span class="font-label-sm text-label-sm mt-0.5 tracking-tight">{label}</span></a>')
    out.append('</div></nav>')
    return "".join(out)


def owner_nav(active):
    def item(path, ico, label, badge=False):
        on = path == active
        cls = ("flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors text-primary-container font-semibold"
               if on else "flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-on-surface-variant hover:text-on-surface transition-colors")
        cur = ' aria-current="page"' if on else ''
        icon = f'<span aria-hidden="true" class="material-symbols-outlined text-[24px]">{ico}</span>'
        if badge:
            icon = ('<div class="relative flex items-center justify-center">' + icon +
                    '<span aria-label="3 belanja perlu diperiksa" class="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full '
                    'bg-coral-alert text-on-primary font-label-sm text-[9px] flex items-center justify-center">3</span></div>')
        return f'<a{cur} class="{cls}" href="#{path}">{icon}<span class="font-label-sm text-label-sm">{label}</span></a>'
    catat = ('<div class="relative flex items-center justify-center px-1 -top-4"><button aria-label="Catat" class="w-12 h-12 rounded-full '
             'bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_8px_20px_rgba(0,117,222,0.35)] '
             'transition-transform active:scale-95" type="button"><span aria-hidden="true" class="material-symbols-outlined text-[28px]">add</span></button></div>')
    return ('<nav aria-label="Navigasi utama" class="fixed bottom-0 w-full z-40 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">'
            '<div class="relative flex items-center justify-around h-16 px-space-xs">'
            + item("ringkasan", "dashboard", "Ringkasan") + item("transaksi", "receipt_long", "Transaksi", badge=True)
            + catat + item("kandang", "grid_view", "Kandang") + item("lainnya", "more_horiz", "Lainnya") + '</div></nav>')


def replace_nav(html, new_nav):
    start = html.rfind("<nav")
    end = html.find("</nav>", start) + len("</nav>")
    assert start >= 0 and end > start, "nav tidak ditemukan"
    return html[:start] + new_nav + html[end:]


def common(html, avatar):
    html = html.replace("maximum-scale=1.0, user-scalable=no, ", "")  # K-ALL-1
    html = re.sub(r'<img alt="Profile" class="[^"]*" src="[^"]+"/>', avatar, html)  # K-ALL-4
    html = re.sub(r'(<img alt="[^"]*" class="h-[78] w-auto object-contain" src=")[^"]+(")', r"\1../assets/logo-placeholder-farmflow.jpg\2", html)  # K-ALL-2/3
    html = re.sub(r'<header class="[^"]*">', f'<header class="{HEADER_CLASS}">', html, count=1)  # §5.1 header disatukan
    return html


# (kode, teks lama, teks baru, jumlah kemunculan)
FIXES = {
    "hari_ini_abk": [
        ("K-HI-1", "Kandang A • Terhubung", "Kandang Utara • Terhubung", 1),
        ("K-HI-2", '<span class="font-label-sm text-label-sm text-ink-black-tertiary">Sinkronisasi Otomatis</span>',
         '<a class="font-label-sm text-label-sm text-primary" href="#status-kirim">Status Kirim</a>', 1),
        ("K-HI-3", ">Upah Kerja<", ">Upah Pekerjaan<", 1),
        ("K-HI-4", '<span class="font-label-sm text-label-sm text-primary">Operasional</span>',
         '<a class="font-label-sm text-label-sm text-primary" href="#catat">Semua</a>', 1),
        ("K-HI-6", "Data Aman di Memori HP", "Catatan Aman di HP", 1),
        ("K-HI-6", "Semua data otomatis tersimpan di HP sebelum sinkron.", "Catatan tersimpan di HP sebelum dikirim.", 1),
    ],
    "recording_harian_tab_riwayat_ringkas": [
        ("K-REC-1", "Kandang A • Terhubung", "Kandang Utara • Terhubung", 1),
        # K-REC-7 sekaligus menyelesaikan K-REC-8: tanpa plugin forms, panah kedua pada pilihan jenis pakan hilang.
        ("K-REC-7", "https://cdn.tailwindcss.com?plugins=forms,container-queries", "https://cdn.tailwindcss.com", 1),
        ("§3.2", "family=Inter:wght@400;500;600;700&amp;", "family=Inter:wght@400;600;700&amp;", 1),
        ("K-REC-2", "520 kg <span", "545 kg <span", 1),
        ("K-REC-2", "(≈ 10,4 sak)", "(≈ 10,9 sak)", 1),
        ("K-REC-2", "5 hari data", "6 hari data", 1),
        ("K-REC-2", "Rata-rata: 104 kg/hr", "Rata-rata: 90,8 kg/hr", 1),
        ("K-REC-3", "<span>Dicatat oleh Yanto · 16.05 WIB</span>", "<span>Draf di HP ini · 16.05</span>", 1),
        ("K-ALL-8", "<span>Dicatat oleh Yanto · 16.10 WIB</span>", "<span>Dicatat oleh Yanto · 16.05 WIB</span>", 1),
        ("K-REC-4", "≈ 1,88 sak", "≈ 1,9 sak", 1),
        ("K-REC-4", "≈ 1,84 sak", "≈ 1,8 sak", 1),
        ("K-REC-4", "≈ 1,80 sak", "≈ 1,8 sak", 1),
        ("K-REC-4", "≈ 1,76 sak", "≈ 1,8 sak", 1),
        ("K-REC-5", "<span>Standar harian: ~98-102 kg</span>", "<span>Rata-rata 7 hari: 90,8 kg</span>", 1),
        ("K-REC-6", 'placeholder="0" type="number" value="100"', 'inputmode="none" placeholder="—" type="text" value="100"', 1),
    ],
    "catat_belanja_keypad": [
        ("K-CB-1", ">Catat Harian</h1>", ">Catat</h1>", 1),
        ("K-CB-2", "cloud_done</span> Tersinkron", "cloud_done</span> Terhubung", 1),
        ("K-CB-5", "Sisa saldo kas kecil di tangan: Rp420.000", "Perkiraan uang di tangan: Rp350.000", 1),
        ("K-CB-6", "Belum tahu / Ragu", "Belum tahu", 1),
        ("K-CB-6", "Owner akan melengkapinya saat verifikasi.", "Owner akan melengkapinya saat memeriksa.", 1),
    ],
    "uang_kas_abk": [
        ("K-HI-1", "Kandang A • Terhubung", "Kandang Utara • Terhubung", 1),
        ("K-UK-1", "<span>Kas Operasional Lapangan</span>", "<span>Uang Kas Rudi</span>", 1),
        ("K-UK-2", "\n          Sinkron\n", "\n          Terhubung\n", 1),
        ("K-UK-3", ">Kembalikan</span>", ">Kembalikan Uang</span>", 1),
        ("K-UK-4", "Khusus mutasi operasional kandang • Bebas kasbon", "Hanya uang usaha untuk kandang · Bukan gaji atau kasbon", 1),
        ("K-UK-6", ">Metode Bayar<", ">Dibayar dengan<", 1),
        ("K-UK-6", ">Tunai (Kas Lapangan)<", ">Uang Kas Rudi<", 1),
        ("K-UK-6", ">Pencatat (ABK)<", ">Dicatat oleh<", 1),
        ("K-UK-6", ">Bukti Nota<", ">Foto Nota<", 1),
        ("K-UK-6", ">Toko / Supplier<", ">Toko<", 1),
        ("K-UK-6", ">Status Validasi<", ">Status<", 1),
        ("K-UK-6", ">Telah Diperiksa Owner<", ">Dibukukan Owner, 20 Sep<", 1),
        ("K-ALL-8", "Budi Santoso", "Rudi", 3),
        ("K-ALL-8", "H. Hendra (Owner)", "Pak Hadi (Owner)", 2),
        ("K-ALL-8", "14:15 WIB", "14.15 WIB", 1),
        ("K-ALL-8", "08:30 WIB", "08.30 WIB", 1),
        ("K-ALL-8", "11:00 WIB", "11.00 WIB", 1),
        ("K-ALL-8", "09:10 WIB", "09.10 WIB", 1),
        ("K-ALL-8", "Belanja Listrik Token", "Belanja Listrik", 1),
        ("K-UK-4", "agar perkiraan saldo di tangan tetap akurat.", "agar perkiraan uang di tangan tetap akurat.", 1),
    ],
    "ringkasan_owner_dashboard": [
        ("K-RO-1", "Tersambung · Sinkron 16.05 WIB", "Terhubung · Data terakhir 16.05 WIB", 1),
        ("K-RO-2", "Masuk: 6 Sep 2026", "DOC masuk: 6 Sep 2026", 1),
        ("K-RO-2", "5.000 ekor hidup", "DOC 5.000 ekor", 1),
        ("K-RO-3", "Anak kandang belum memasukkan data pakan, mortalitas, dan bobot untuk hari ini.",
         "ABK belum mengisi pakan, mati/afkir, dan sampling untuk hari ini.", 1),
        ("K-RO-4", "Satu catatan bersama untuk seluruh anak kandang.", "Satu catatan bersama untuk seluruh kandang.", 1),
        ("K-RO-5", "Menunggu Panen", "Data Belum Lengkap", 1),
        ("K-RO-6", "Kas Operasional &amp; ABK", "Uang Kas", 1),
        ("K-RO-6", "Kas Tunai Usaha (Owner)", "Kas tunai usaha", 1),
        ("K-RO-6", "Rekening Bank Usaha", "Rekening usaha", 1),
        ("K-RO-7", "Pemegang Kas Kandang Utara", "Kandang Utara", 1),
        ("K-RO-7", "Pemegang Kas Bersama", "Kandang Utara, Kandang Selatan", 1),
        ("K-RO-7", ">Belum pasti<", ">Belum dapat dipastikan<", 1),
        ("K-RO-8", 'text-label-sm">Kosong</span>', 'text-label-sm">Kandang Kosong</span>', 1),
        ("K-RO-7", "Ada 1 belanja belum terdata sumber dananya, saldo riil belum dapat diverifikasi.",
         "Ada 1 belanja belum jelas sumber uangnya. Perkiraan belum dapat dipastikan.", 1),
    ],
    "periksa_belanja_owner": [
        ("K-PB-2", "Sistem membatasi otomatisasi demi akurasi kas. Pembukuan hanya terjadi atas konfirmasi eksplisit Owner.",
         "Belanja baru dibukukan setelah Anda menekan Setujui &amp; Bukukan.", 1),
        ("K-PB-3", "Form Terbuka <span", "Tutup <span", 1),
        ("K-PB-4", "Toko / Vendor", "Toko", 1),
        ("K-PB-5", "Tanpa foto (Nota hilang)", "Tanpa foto", 1),
    ],
    "mulai_kandang_setup_3_langkah": [
        ("K-MK-5", "Sinkron ABK", "Dipakai bersama ABK", 1),
        ("K-MK-5", "FCR &amp; IP Otomatis", "Rata-rata sampling otomatis", 1),
        ("K-MK-6", "Hanya mencatat keuangan, belanja pakan/OVK, kas kecil, dan penjualan ayam tanpa pencatatan harian ayam per sekat.",
         "Tetap bisa mencatat belanja, uang kas, dan hasil periode tanpa recording harian.", 1),
        ("K-MK-6", "Fokus Laba/Rugi", "Fokus Keuangan", 1),
        ("K-MK-7", "Ekosistem Pintar", "Mulai Sederhana", 1),
        ("K-MK-7", "Kandang terhubung siap memantau performa harian Anda", "Catat kandang, belanja, dan uang di satu tempat.", 1),
        ("K-MK-9", "Perlu sinyal untuk mengaktifkan periode", "Perlu sinyal untuk menyimpan pengaturan kandang", 1),
    ],
}

LOCAL_IMAGES = {
    "catat_belanja_keypad": ["contoh-nota-listrik.jpg"],
    "uang_kas_abk": ["contoh-token-listrik.jpg", "contoh-nota-gas.jpg"],
    "mulai_kandang_setup_3_langkah": ["banner-kandang.jpg"],
}


def main():
    failed = False
    for screen, fixes in FIXES.items():
        src = ROOT / screen / "code.html"
        html = src.read_text()
        owner = screen in ("ringkasan_owner_dashboard", "periksa_belanja_owner", "mulai_kandang_setup_3_langkah")
        html = common(html, AVATAR_OWNER if owner else AVATAR_ABK)
        for code, old, new, count in fixes:
            found = html.count(old)
            if found != count:
                print(f"GAGAL {screen} {code}: {old[:60]!r} ditemukan {found}x, diharapkan {count}x")
                failed = True
                continue
            html = html.replace(old, new)
        for name in LOCAL_IMAGES.get(screen, []):
            html, n = re.subn(r'(<img[^>]*src=")https://lh3\.googleusercontent\.com[^"]+(")', rf"\1../assets/{name}\2", html, count=1)
            if n != 1:
                print(f"GAGAL {screen}: gambar untuk {name} tidak ditemukan")
                failed = True
        if screen == "uang_kas_abk":  # K-UK-5: hapus keterangan di atas foto nota
            html, n = re.subn(r'<[^<>]*>\s*Token ID: 4512-8890-1204\s*</[^<>]+>', "", html)
            if n != 1:
                print("GAGAL uang_kas_abk K-UK-5")
                failed = True
        if screen == "hari_ini_abk":  # K-HI-5: "Antrean Lokal" menjadi tautan Status Kirim
            html, n = re.subn(r'<span class="font-label-sm text-label-sm text-coral-alert flex items-center gap-1">\s*'
                              r'<span class="material-symbols-outlined text-xs">sync_problem</span>\s*Antrean Lokal\s*</span>',
                              '<a class="font-label-sm text-label-sm text-primary flex items-center gap-0.5" href="#status-kirim">'
                              '<span>Status Kirim</span><span aria-hidden="true" class="material-symbols-outlined text-sm">chevron_right</span></a>', html)
            if n != 1:
                print("GAGAL hari_ini_abk K-HI-5")
                failed = True
            html = replace_nav(html, abk_nav("hari-ini"))  # K-NAV-1
        if screen == "uang_kas_abk":
            html = replace_nav(html, abk_nav("uang-kas"))  # K-NAV-1
        if screen == "recording_harian_tab_riwayat_ringkas":
            html = replace_nav(html, abk_nav(None, border=True))  # K-NAV-1, tanpa item aktif
        if screen == "periksa_belanja_owner":  # K-NAV-2, K-PB-1: header dan nav Owner
            ringkasan = common((ROOT / "ringkasan_owner_dashboard" / "code.html").read_text(), AVATAR_OWNER)
            owner_header = ringkasan[ringkasan.find("<header"):ringkasan.find("</header>") + len("</header>")]
            start, end = html.find("<header"), html.find("</header>") + len("</header>")
            html = html[:start] + owner_header + html[end:]
            html = replace_nav(html, owner_nav("transaksi"))
        if screen == "ringkasan_owner_dashboard":
            html = replace_nav(html, owner_nav("ringkasan"))
        leftover = re.findall(r"https://lh3\.googleusercontent\.com", html)
        if leftover:
            print(f"GAGAL {screen}: masih ada {len(leftover)} gambar daring")
            failed = True
        note = ("<!-- Acuan terkoreksi: dibuat dari code.html oleh design/tools/buat_acuan_terkoreksi.py "
                "menurut FRONTEND_DESIGN_SPEC §9. Jangan diedit manual. -->\n")
        (ROOT / screen / "corrected.html").write_text(note + html)
    if failed:
        sys.exit(1)
    print("OK: 7 acuan terkoreksi dibuat")


if __name__ == "__main__":
    main()
