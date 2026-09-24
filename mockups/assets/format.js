/*
 * Fungsi murni format/parse angka Indonesia. Tanpa DOM; dapat dipakai langsung di frontend dan tes unit.
 * Uang rupiah disimpan sebagai string digit bulat (sesuai amount_idr di API_SYNC_SPEC), bukan float.
 */

const SMALL = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

const SCALES = [
  [1_000_000_000_000n, 'triliun'],
  [1_000_000_000n, 'miliar'],
  [1_000_000n, 'juta'],
];

function wordsBelowMillion(n) {
  if (n < 12) return SMALL[n];
  if (n < 20) return `${SMALL[n - 10]} belas`;
  if (n < 100) return `${SMALL[Math.floor(n / 10)]} puluh${n % 10 ? ` ${SMALL[n % 10]}` : ''}`;
  if (n < 200) return `seratus${n - 100 ? ` ${wordsBelowMillion(n - 100)}` : ''}`;
  if (n < 1000) return `${SMALL[Math.floor(n / 100)]} ratus${n % 100 ? ` ${wordsBelowMillion(n % 100)}` : ''}`;
  if (n < 2000) return `seribu${n - 1000 ? ` ${wordsBelowMillion(n - 1000)}` : ''}`;
  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  return `${wordsBelowMillion(thousands)} ribu${rest ? ` ${wordsBelowMillion(rest)}` : ''}`;
}

/** Ejaan bilangan bulat ≥0 dalam bahasa Indonesia. Input: string digit atau bigint. */
export function terbilang(digits) {
  let n = typeof digits === 'bigint' ? digits : BigInt(String(digits || '0'));
  if (n === 0n) return 'nol';
  const parts = [];
  for (const [size, name] of SCALES) {
    if (n >= size) {
      const count = n / size;
      parts.push(`${terbilang(count)} ${name}`);
      n %= size;
    }
  }
  if (n > 0n) parts.push(wordsBelowMillion(Number(n)));
  return parts.join(' ');
}

/** Ejaan nominal: "1250000" → "satu juta dua ratus lima puluh ribu rupiah". Kosong → "". */
export function terbilangRupiah(digits) {
  if (!digits) return '';
  return `${terbilang(digits)} rupiah`;
}

/** Titik ribuan untuk string digit: "1250000" → "1.250.000". */
export function groupThousands(digits) {
  return String(digits).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Tampilan rupiah tanpa spasi dan tanpa desimal: "150000" → "Rp150.000". Kosong → "". */
export function formatRupiah(digits) {
  if (digits === '' || digits == null) return '';
  return `Rp${groupThousands(digits)}`;
}

/**
 * Nilai kanonis kuantitas memakai titik desimal ("12.5"); tampilan memakai koma ("12,5").
 * Titik akhir ("12.") dipertahankan agar pengguna bisa melanjutkan mengetik.
 */
export function formatQuantity(canonical) {
  if (canonical === '' || canonical == null) return '';
  const [intPart, decPart] = String(canonical).split('.');
  const grouped = groupThousands(intPart || '0');
  return decPart === undefined ? grouped : `${grouped},${decPart}`;
}

export function formatCount(digits) {
  if (digits === '' || digits == null) return '';
  return groupThousands(digits);
}

export function formatByKind(kind, canonical) {
  if (kind === 'rupiah') return formatRupiah(canonical);
  if (kind === 'quantity') return formatQuantity(canonical);
  return formatCount(canonical);
}

function stripLeadingZeros(intDigits) {
  return intDigits.replace(/^0+(?=\d)/, '');
}

/**
 * Normalisasi teks yang diketik keyboard HP/fisik menjadi nilai kanonis.
 * rupiah/count: hanya digit. quantity: digit + satu koma desimal (titik dianggap pemisah ribuan).
 */
export function normalizeTyped(kind, text, { maxDigits = 13, decimals = 2 } = {}) {
  const raw = String(text || '').replace(/^Rp/i, '');
  if (kind !== 'quantity') {
    const digits = raw.replace(/\D/g, '').slice(0, maxDigits);
    return digits ? stripLeadingZeros(digits) : '';
  }
  const cleaned = raw.replace(/[^\d,]/g, '');
  const commaIndex = cleaned.indexOf(',');
  if (commaIndex === -1) {
    const digits = cleaned.slice(0, maxDigits);
    return digits ? stripLeadingZeros(digits) : '';
  }
  const intPart = stripLeadingZeros(cleaned.slice(0, commaIndex).slice(0, maxDigits) || '0');
  const decPart = cleaned.slice(commaIndex + 1).replace(/,/g, '').slice(0, decimals);
  return `${intPart}.${decPart}`;
}

/**
 * Paste rupiah. Menerima "Rp1.250.000", "1.250.000", "1250000".
 * Koma atau kelompok titik yang tidak tiga digit dianggap ambigu dan harus dikonfirmasi pengguna (UX_UI_SPEC §5.2).
 */
export function parsePastedRupiah(text) {
  const trimmed = String(text || '').trim().replace(/^Rp\s?/i, '').replace(/\s/g, '');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return { digits: '', ambiguous: false, valid: false };
  const validGrouped = /^\d{1,3}(\.\d{3})+$/.test(trimmed);
  const plain = /^\d+$/.test(trimmed);
  return { digits: stripLeadingZeros(digits), ambiguous: !(validGrouped || plain), valid: true };
}

/** Terapkan satu tombol keypad ke nilai kanonis. Mengembalikan nilai baru (atau nilai lama bila ditolak). */
export function applyKeypadKey(kind, current, key, { maxDigits = 13, decimals = 2 } = {}) {
  let value = current || '';
  if (key === 'back') return value.slice(0, -1);
  if (key === 'decimal') {
    if (kind !== 'quantity' || value.includes('.')) return value;
    return `${value || '0'}.`;
  }
  if (!/^\d+$/.test(key)) return value;
  if (value === '' && /^0+$/.test(key) && key.length > 1) return value;
  if (kind === 'quantity' && value.includes('.')) {
    const [intPart, decPart] = value.split('.');
    const nextDec = decPart + key;
    if (nextDec.length > decimals) return value;
    return `${intPart}.${nextDec}`;
  }
  const next = stripLeadingZeros(value + key);
  return next.length > maxDigits ? value : next;
}
