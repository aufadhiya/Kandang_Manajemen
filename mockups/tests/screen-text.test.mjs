import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';

/*
 * Pemeriksa teks layar (IMP-006 + UX_UI_SPEC §16.5): istilah teknis/sinonim terlarang tidak boleh terlihat pengguna.
 * HTML: hanya teks tampil dan atribut yang dibacakan. JS: hanya string berisi spasi (kalimat), bukan selector.
 */
const BANNED = [
  'DRAFT', 'posting', 'posted', 'sync', 'sinkronisasi', 'coverage', 'review', 'receipt', 'epoch', 'lease', 'capture-only',
  'queue', 'antrean', 'approval', 'expense', 'payroll', 'closing', 'reopen', 'lock', 'batch', 'siklus', 'klaim', 'pengajuan',
  'disahkan', 'kas pegangan', 'saldo saya', 'dompet', 'catatan tunai', 'selesai fisik', 'kunci keuangan', 'periode berjalan',
  'barang & peralatan', 'kasbon & pinjaman', 'konflik versi', 'menunggu review', 'stok', 'transfer', 'sukses', 'submit',
];

const SCREENS = new URL('../screens/', import.meta.url);
const ROOT = new URL('../', import.meta.url);

function htmlText(source) {
  const withoutHidden = source.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ');
  const spoken = [...withoutHidden.matchAll(/\s(?:aria-label|placeholder|title|alt|data-required-message|data-usual-text|data-impact-template|data-template|data-cost-template|data-impact-default|data-review-text|data-review-empty|data-suggest)="([^"]*)"/g)].map((m) => m[1]);
  const visible = withoutHidden.replace(/<[^>]+>/g, ' ');
  return [visible, ...spoken].join(' ');
}

function jsText(source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
  // Interpolasi ${...} adalah kode, bukan teks layar.
  const literals = [...withoutComments.matchAll(/'([^'\n]*)'|`([^`]*)`/g)].map((m) => (m[1] ?? m[2]).replace(/\$\{[^}]*\}/g, ' '));
  return literals
    .filter((text) => /\s/.test(text) && !/[\[#=]|^\s*</.test(text.trim()))
    .join(' ');
}

function findBanned(text) {
  return BANNED.filter((term) => new RegExp(`(^|[^\p{L}])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\p{L}]|$)`, 'iu').test(text));
}

test('teks layar HTML bebas istilah terlarang', () => {
  const files = [
    ...readdirSync(SCREENS).filter((f) => f.endsWith('.html')).map((f) => new URL(f, SCREENS)),
    new URL('index.html', ROOT),
  ];
  for (const file of files) {
    assert.deepEqual(findBanned(htmlText(readFileSync(file, 'utf8'))), [], file.pathname);
  }
});

test('teks layar dari JS bebas istilah terlarang', () => {
  const files = [
    ...readdirSync(SCREENS).filter((f) => f.endsWith('.js')).map((f) => new URL(f, SCREENS)),
    new URL('assets/components.js', ROOT),
    new URL('assets/mock.js', ROOT),
  ];
  for (const file of files) {
    assert.deepEqual(findBanned(jsText(readFileSync(file, 'utf8'))), [], file.pathname);
  }
});

test('pemeriksa benar-benar menangkap istilah terlarang', () => {
  assert.deepEqual(findBanned(htmlText('<p>Menunggu review</p>')), ['review', 'menunggu review']);
  assert.deepEqual(findBanned(htmlText('<button aria-label="Sync sekarang">x</button>')), ['sync']);
  assert.deepEqual(findBanned(htmlText('<div data-review-of="x">Tanggal</div>')), []);
});
