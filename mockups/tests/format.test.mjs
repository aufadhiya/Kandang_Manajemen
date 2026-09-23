import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyKeypadKey,
  formatQuantity,
  formatRupiah,
  normalizeTyped,
  parsePastedRupiah,
  terbilang,
  terbilangRupiah,
} from '../assets/format.js';

test('terbilang menulis bilangan Indonesia dengan benar', () => {
  const cases = {
    0: 'nol',
    11: 'sebelas',
    12: 'dua belas',
    85: 'delapan puluh lima',
    100: 'seratus',
    150: 'seratus lima puluh',
    1000: 'seribu',
    1500: 'seribu lima ratus',
    11000: 'sebelas ribu',
    150000: 'seratus lima puluh ribu',
    1000000: 'satu juta',
    1250000: 'satu juta dua ratus lima puluh ribu',
    2500000000: 'dua miliar lima ratus juta',
    1000000000000: 'satu triliun',
  };
  for (const [digits, words] of Object.entries(cases)) assert.equal(terbilang(digits), words, digits);
  assert.equal(terbilangRupiah('150000'), 'seratus lima puluh ribu rupiah');
  assert.equal(terbilangRupiah(''), '');
});

test('format rupiah bulat dan kuantitas koma', () => {
  assert.equal(formatRupiah('150000'), 'Rp150.000');
  assert.equal(formatRupiah(''), '');
  assert.equal(formatQuantity('12.5'), '12,5');
  assert.equal(formatQuantity('1250.75'), '1.250,75');
  assert.equal(formatQuantity('12.'), '12,');
});

test('ketikan keyboard dinormalisasi tanpa pecahan rupiah', () => {
  assert.equal(normalizeTyped('rupiah', 'Rp1.250.000'), '1250000');
  assert.equal(normalizeTyped('rupiah', '00150'), '150');
  assert.equal(normalizeTyped('quantity', '12,5'), '12.5');
  assert.equal(normalizeTyped('quantity', '1.250,755'), '1250.75');
  assert.equal(normalizeTyped('count', '2 ekor'), '2');
});

test('paste ambigu harus dikonfirmasi', () => {
  assert.deepEqual(parsePastedRupiah('Rp1.250.000'), { digits: '1250000', ambiguous: false, valid: true });
  assert.deepEqual(parsePastedRupiah('1250000'), { digits: '1250000', ambiguous: false, valid: true });
  assert.equal(parsePastedRupiah('1,250').ambiguous, true);
  assert.equal(parsePastedRupiah('1.5').ambiguous, true);
  assert.equal(parsePastedRupiah('abc').valid, false);
});

test('tombol keypad mengikuti jenis field', () => {
  let value = '';
  for (const key of ['1', '2', '5', '000']) value = applyKeypadKey('rupiah', value, key);
  assert.equal(value, '125000');
  assert.equal(applyKeypadKey('rupiah', '', '000'), '');
  assert.equal(applyKeypadKey('rupiah', '0', '5'), '5');
  assert.equal(applyKeypadKey('rupiah', '125', 'back'), '12');
  assert.equal(applyKeypadKey('rupiah', '12', 'decimal'), '12');
  assert.equal(applyKeypadKey('quantity', '', 'decimal'), '0.');
  assert.equal(applyKeypadKey('quantity', '12.5', '7'), '12.57');
  assert.equal(applyKeypadKey('quantity', '12.57', '1'), '12.57');
  assert.equal(applyKeypadKey('rupiah', '1234567890123', '4'), '1234567890123');
});
