"""Membandingkan screenshot aplikasi dengan acuan mockup (FRONTEND_DESIGN_SPEC §11).

Hanya memakai pustaka standar Python. Contoh:
  python3 design/tools/bandingkan_screenshot.py \
    design/stitch/hari_ini_abk/reference-390-terkoreksi-viewport.png hasil/hari-ini.png \
    --mask-file design/stitch/masks.json --out hasil/hari-ini-selisih.png
Keluar dengan kode 1 bila ukuran berbeda atau selisih melebihi batas.
"""
import argparse
import json
import struct
import sys
import zlib
from pathlib import Path


def read_png(path):
    data = Path(path).read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"{path} bukan PNG")
    pos, idat, width = 8, [], None
    while pos < len(data):
        length, kind = struct.unpack(">I4s", data[pos:pos + 8])
        chunk = data[pos + 8:pos + 8 + length]
        if kind == b"IHDR":
            width, height, depth, color, _, _, interlace = struct.unpack(">IIBBBBB", chunk)
            if depth != 8 or color not in (2, 6) or interlace:
                raise ValueError(f"{path}: hanya PNG 8-bit RGB/RGBA tanpa interlace")
            channels = 4 if color == 6 else 3
        elif kind == b"IDAT":
            idat.append(chunk)
        elif kind == b"IEND":
            break
        pos += 12 + length
    raw = zlib.decompress(b"".join(idat))
    stride = width * channels
    rows, prev, i = [], bytearray(stride), 0
    for _ in range(height):
        ftype, line = raw[i], bytearray(raw[i + 1:i + 1 + stride])
        i += 1 + stride
        for x in range(stride):
            a = line[x - channels] if x >= channels else 0
            b, c = prev[x], prev[x - channels] if x >= channels else 0
            if ftype == 1:
                line[x] = (line[x] + a) & 255
            elif ftype == 2:
                line[x] = (line[x] + b) & 255
            elif ftype == 3:
                line[x] = (line[x] + (a + b) // 2) & 255
            elif ftype == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(bytes(line))
        prev = line
    return width, height, channels, rows


def write_png(path, width, height, rows):
    raw = b"".join(b"\x00" + r for r in rows)
    def chunk(kind, body):
        return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
                           + chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b""))


def masks_for(reference, mask_file, extra):
    rects = [tuple(int(v) for v in m.split(",")) for m in extra]
    if mask_file:
        table = json.loads(Path(mask_file).read_text())
        ref = Path(reference).as_posix()
        for key, items in table.items():
            if key.startswith("_"):
                continue
            if ref.endswith(key) or Path(ref).parent.name == key:
                rects += [tuple(item["rect"]) for item in items]
    return rects


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("acuan")
    ap.add_argument("hasil")
    ap.add_argument("--mask", action="append", default=[], help="x,y,lebar,tinggi dalam piksel CSS")
    ap.add_argument("--mask-file")
    ap.add_argument("--batas-persen", type=float, default=1.0)
    ap.add_argument("--toleransi", type=int, default=16, help="selisih kanal maksimum yang dianggap sama")
    ap.add_argument("--out", help="gambar selisih (merah = berbeda, abu = di-mask)")
    args = ap.parse_args()

    w1, h1, c1, a = read_png(args.acuan)
    w2, h2, c2, b = read_png(args.hasil)
    if (w1, h1) != (w2, h2):
        print(f"GAGAL: ukuran acuan {w1}x{h1}, hasil {w2}x{h2}. Samakan viewport 390 px, skala 1.")
        sys.exit(1)
    rects = masks_for(args.acuan, args.mask_file, args.mask)
    masked = [bytearray(w1) for _ in range(h1)]
    for x, y, w, h in rects:
        for yy in range(max(0, y), min(h1, y + h)):
            masked[yy][max(0, x):min(w1, x + w)] = b"\x01" * (min(w1, x + w) - max(0, x))
    diff = counted = 0
    out_rows = []
    for y in range(h1):
        ra, rb, row = a[y], b[y], bytearray()
        for x in range(w1):
            pa, pb = ra[x * c1:x * c1 + 3], rb[x * c2:x * c2 + 3]
            if masked[y][x]:
                row += b"\xb0\xb0\xb0"
                continue
            counted += 1
            if max(abs(pa[k] - pb[k]) for k in range(3)) > args.toleransi:
                diff += 1
                row += b"\xff\x00\x00"
            else:
                g = sum(pa) // 3
                row += bytes((g // 2 + 127,) * 3)
        out_rows.append(bytes(row))
    pct = 100.0 * diff / max(counted, 1)
    if args.out:
        write_png(args.out, w1, h1, out_rows)
    status = "LULUS" if pct <= args.batas_persen else "GAGAL"
    print(f"{status}: selisih {pct:.2f}% ({diff} dari {counted} piksel di luar mask), batas {args.batas_persen}%")
    sys.exit(0 if status == "LULUS" else 1)


if __name__ == "__main__":
    main()
