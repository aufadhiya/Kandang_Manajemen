"""Menguji bahwa resep fondasi FRONTEND_DESIGN_SPEC §3 (Tailwind build, font dan ikon lokal, tanpa CDN)
menghasilkan tampilan yang sama dengan acuan terkoreksi.

Dipanggil oleh uji_fondasi_lokal.sh. Mengubah setiap corrected.html menjadi halaman tanpa sumber daring,
lalu membangun CSS-nya dengan Tailwind CLI v3. Bukan kode aplikasi.
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

STITCH = Path(__file__).resolve().parents[1] / "stitch"

ICON_CSS = (".material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;"
            "font-size:24px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;"
            "word-wrap:normal;direction:ltr;font-feature-settings:'liga';-webkit-font-smoothing:antialiased;"
            "font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}")


def main(work):
    work = Path(work).resolve()
    out = work / "out"
    (out / "fonts").mkdir(parents=True, exist_ok=True)
    mods = work / "node_modules"
    for w in (400, 600, 700):
        shutil.copy(mods / f"@fontsource/inter/files/inter-latin-{w}-normal.woff2", out / f"fonts/inter-{w}.woff2")
    shutil.copy(mods / "material-symbols/material-symbols-outlined.woff2", out / "fonts/material-symbols-outlined.woff2")
    shutil.copytree(STITCH / "assets", out / "assets", dirs_exist_ok=True)
    cfg = json.loads((STITCH / "tailwind.config.json").read_text())
    fonts = "".join(f"@font-face{{font-family:'Inter';font-style:normal;font-weight:{w};font-display:swap;"
                    f"src:url(fonts/inter-{w}.woff2) format('woff2')}}" for w in (400, 600, 700))
    fonts += ("@font-face{font-family:'Material Symbols Outlined';font-style:normal;font-weight:100 700;font-display:block;"
              "src:url(fonts/material-symbols-outlined.woff2) format('woff2')}")
    (work / "in.css").write_text(fonts + "\n@tailwind base;\n@tailwind components;\n@layer components{" + ICON_CSS + "}\n@tailwind utilities;\n")
    for f in sorted(STITCH.glob("*/corrected.html")):
        name = f.parent.name
        html = f.read_text()
        html = re.sub(r'<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*/>', "", html)
        html = re.sub(r'<script src="https://cdn\.tailwindcss\.com[^"]*"></script>', "", html)
        html = re.sub(r'<script id="tailwind-config">.*?</script>', "", html, flags=re.S)
        html = html.replace("../assets/", "assets/").replace("<head>", f'<head><link rel="stylesheet" href="{name}.css"/>', 1)
        if "https://" in re.sub(r'href="https://[^"]*"', "", html.split("<body", 1)[0]):
            print(f"GAGAL {name}: masih ada sumber daring di <head>")
            sys.exit(1)
        (out / f"{name}.html").write_text(html)
        conf = {"darkMode": cfg.get("darkMode", "class"), "content": [str(out / f"{name}.html")], "theme": cfg["theme"], "plugins": []}
        (work / f"{name}.config.js").write_text("module.exports=" + json.dumps(conf))
        r = subprocess.run(["npx", "tailwindcss", "-c", f"{name}.config.js", "-i", "in.css", "-o", str(out / f"{name}.css")],
                           cwd=work, capture_output=True, text=True)
        if r.returncode:
            print(r.stderr)
            sys.exit(1)
        print(f"dibangun: {name}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "/tmp/uji-fondasi")
