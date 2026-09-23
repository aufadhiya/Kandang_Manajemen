"""Memeriksa bahwa kode frontend hanya memakai kelas Tailwind dari mockup (FRONTEND_DESIGN_SPEC §1.2 dan §4).

Daftar yang diizinkan = semua kelas di design/stitch/*/corrected.html (termasuk yang dipasang skripnya)
ditambah TAMBAHAN_SPEC di bawah. Kelas lain harus ditambahkan ke FRONTEND_DESIGN_SPEC dan ke daftar ini
lewat revisi yang disetujui, bukan dikarang.
Contoh: python3 design/tools/cek_kelas.py apps/web/src
Tanpa argumen: memeriksa acuan terkoreksi sendiri (uji alat).
Hanya string kelas statis yang terbaca; kelas yang disusun dinamis wajib ditulis utuh agar bisa diperiksa.
"""
import re
import sys
from pathlib import Path

STITCH = Path(__file__).resolve().parents[1] / "stitch"

# Kelas untuk komponen turunan yang ditetapkan FRONTEND_DESIGN_SPEC (toast, spinner, lapisan lembar, dsb.).
TAMBAHAN_SPEC = {
    "bg-inverse-surface", "text-inverse-on-surface", "text-inverse-primary", "animate-spin", "bottom-24",
    "inset-x-gutter", "text-[40px]", "w-16", "z-[60]", "ml-1", "sr-only", "reduce-effects",
}

ATTR = re.compile(r'\b(?:class|className)\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|\{\s*[`"\']([^`"\']*)[`"\']\s*\})')
JS_CLASS = re.compile(r"classList\.(?:add|remove|toggle)\(([^)]*)\)")
JS_STR = re.compile(r"""['"]([^'"]+)['"]""")
IGNORE = re.compile(r"^(?:\$\{.*|\{.*|.*\}|[A-Z][A-Za-z]*|material-symbols-outlined|payment-card|tx-card|tx-header|tab-btn|chip|kp-key)$")


def classes_in(text):
    found = []
    for m in ATTR.finditer(text):
        value = next(g for g in m.groups() if g is not None)
        found += value.split()
    for m in JS_CLASS.finditer(text):
        for s in JS_STR.findall(m.group(1)):
            found += s.split()
    return found


def allowed():
    names = set(TAMBAHAN_SPEC)
    for f in STITCH.glob("*/corrected.html"):
        names.update(classes_in(f.read_text()))
    return names


def main():
    ok = allowed()
    targets = [Path(p) for p in sys.argv[1:]] or sorted(STITCH.glob("*/corrected.html"))
    files = []
    for t in targets:
        files += [p for p in t.rglob("*") if p.suffix in {".html", ".tsx", ".jsx", ".ts", ".js", ".vue", ".svelte"}] if t.is_dir() else [t]
    bad = {}
    for f in files:
        for cls in classes_in(f.read_text(errors="ignore")):
            if cls not in ok and not IGNORE.match(cls):
                bad.setdefault(cls, set()).add(str(f))
    if bad:
        for cls, where in sorted(bad.items()):
            print(f"TIDAK DIIZINKAN: {cls}  ({', '.join(sorted(where))[:160]})")
        sys.exit(1)
    print(f"OK: {len(files)} file, semua kelas ada di daftar mockup ({len(ok)} kelas diizinkan)")


if __name__ == "__main__":
    main()
