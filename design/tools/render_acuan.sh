#!/usr/bin/env bash
# Merender screenshot acuan terkoreksi 390 px (FRONTEND_DESIGN_SPEC §11.1).
# Memakai agent-browser (Chromium). Alat lain boleh dipakai asal pengaturannya sama:
# viewport 390x844, skala 1, font sudah dimuat, animasi/transisi dimatikan.
# Tanpa argumen: membuka stitch/<layar>/corrected.html dan menulis acuan di folder layar.
# Dengan argumen <folder_html> <folder_output>: membuka <folder_html>/<layar>.html dan menulis
# <folder_output>/<layar>__<keadaan>-viewport.png (dipakai uji_fondasi_lokal.sh).
set -euo pipefail
cd "$(dirname "$0")/.."
R="$PWD/stitch"
SRC="${1:-}"
OUT="${2:-}"
page() { if [ -n "$SRC" ]; then echo "file://$SRC/$1.html"; else echo "file://$R/$1/corrected.html"; fi; }
dest() { if [ -n "$OUT" ]; then echo "$OUT/$1__$2"; else echo "$R/$1/$2"; fi; }
FREEZE='(()=>{const s=document.createElement("style");s.textContent="*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";document.head.appendChild(s);return document.fonts.ready.then(()=>1)})()'
shot() { # layar nama-keadaan [js-keadaan]
  agent-browser set viewport 390 844 >/dev/null
  agent-browser open "$(page "$1")" >/dev/null
  agent-browser wait 2500 >/dev/null
  agent-browser eval "$FREEZE" >/dev/null
  if [ -n "${3:-}" ]; then agent-browser eval "$3" >/dev/null; fi
  agent-browser eval "$FREEZE" >/dev/null
  agent-browser wait 500 >/dev/null
  agent-browser screenshot "$(dest "$1" "$2")-viewport.png" >/dev/null
  local h; h=$(agent-browser eval 'document.documentElement.scrollHeight' | tr -dc 0-9)
  agent-browser set viewport 390 "$h" >/dev/null
  agent-browser wait 700 >/dev/null
  agent-browser screenshot "$(dest "$1" "$2")-full.png" >/dev/null
  echo "$1 $2 (tinggi penuh $h px)"
}
shot hari_ini_abk reference-390-terkoreksi
shot catat_belanja_keypad reference-390-terkoreksi
shot uang_kas_abk reference-390-terkoreksi
shot uang_kas_abk reference-390-terkoreksi-rincian-terbuka 'document.getElementById("toggle-calc-btn").click(); document.querySelector(".tx-card .tx-header").click()'
shot recording_harian_tab_riwayat_ringkas reference-390-terkoreksi-lembar-pakan
shot recording_harian_tab_riwayat_ringkas reference-390-terkoreksi-tab-pakan 'document.getElementById("recordingModal").classList.add("hidden")'
shot ringkasan_owner_dashboard reference-390-terkoreksi
shot ringkasan_owner_dashboard reference-390-terkoreksi-pilih-kandang 'document.getElementById("btn-ganti-kandang").click()'
shot periksa_belanja_owner reference-390-terkoreksi
shot mulai_kandang_setup_3_langkah reference-390-terkoreksi
agent-browser set viewport 390 844 >/dev/null
