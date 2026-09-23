#!/usr/bin/env bash
# Membuktikan resep FRONTEND_DESIGN_SPEC §3 menghasilkan tampilan yang sama dengan acuan terkoreksi.
# Butuh node/npm, python3, dan agent-browser. Pakai jaringan hanya untuk npm install ke folder kerja sementara.
# Versi yang diuji terakhir: tailwindcss 3.4.17, @fontsource/inter 5.x, material-symbols 0.47.5.
set -euo pipefail
TOOLS="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$TOOLS")"
WORK="${1:-/tmp/uji-fondasi}"
mkdir -p "$WORK/out/shots"
cd "$WORK"
[ -f package.json ] || npm init -y >/dev/null
npm install --silent tailwindcss@3.4.17 @fontsource/inter@5 material-symbols@0.47.5
python3 "$TOOLS/uji_fondasi_lokal.py" "$WORK"
bash "$TOOLS/render_acuan.sh" "$WORK/out" "$WORK/out/shots" >/dev/null
fail=0
for f in "$WORK"/out/shots/*.png; do
  b=$(basename "$f"); layar=${b%%__*}; acuan=${b#*__}
  printf '%s/%s: ' "$layar" "$acuan"
  python3 "$TOOLS/bandingkan_screenshot.py" "$ROOT/stitch/$layar/$acuan" "$f" --mask-file "$ROOT/stitch/masks.json" || fail=1
done
exit $fail
