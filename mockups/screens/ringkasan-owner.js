import { afterSheetClose, clearDraft, closeSheet, init, onSubmit, resetForm, setExpanded, showToast } from '../assets/components.js';
import { initMock } from '../assets/mock.js';
import { formatCount } from '../assets/format.js';

// Keadaan contoh. Di produk, saran berasal dari data server + izin (UX-17), bukan dari variabel halaman.
const state = { periode: false, doc: null, hiddenUntilChange: false };

const nextCard = document.querySelector('[data-next-step]');
const hiddenNote = document.querySelector('[data-next-hidden-note]');
const nextAction = document.querySelector('[data-next-action]');
const nextLater = document.querySelector('[data-next-later]');

const SUGGESTIONS = {
  periode: {
    title: 'Siapkan Periode',
    text: 'Agar DOC bisa dicatat saat datang.',
    why: 'Data Kandang dan pilihan recording sudah ada. Periode belum disiapkan, jadi DOC belum bisa dicatat.',
    action: 'Siapkan Periode',
    sheet: 'sheet-periode',
    optional: true,
  },
  doc: {
    title: 'Catat DOC saat datang',
    text: 'Periode 01 aktif setelah DOC hidup dicatat.',
    why: 'Periode 01 sudah disiapkan. Tanggal datang dan jumlah DOC hidup belum ada.',
    action: 'DOC Masuk',
    sheet: 'sheet-doc',
    optional: false,
  },
  tim: {
    title: 'Tambah ABK',
    text: 'Agar tim bisa mengisi Recording Harian dari HP masing-masing.',
    why: 'Periode aktif dengan Recording Harian, tetapi belum ada ABK di Tim Kandang.',
    action: 'Tambah ABK',
    sheet: null,
    optional: true,
  },
};

function currentSuggestion() {
  if (!state.periode) return SUGGESTIONS.periode;
  if (!state.doc) return SUGGESTIONS.doc;
  return SUGGESTIONS.tim;
}

function renderSuggestion() {
  const suggestion = currentSuggestion();
  nextCard.querySelector('[data-next-title]').textContent = suggestion.title;
  nextCard.querySelector('[data-next-text]').textContent = suggestion.text;
  nextCard.querySelector('[data-next-why]').textContent = suggestion.why;
  nextAction.textContent = suggestion.action;
  if (suggestion.sheet) {
    nextAction.dataset.sheetOpen = suggestion.sheet;
    delete nextAction.dataset.mockMissing;
  } else {
    delete nextAction.dataset.sheetOpen;
    nextAction.dataset.mockMissing = '';
  }
  // Saran wajib tidak bisa disembunyikan (UX_FLOWS §3.1); hanya yang opsional punya "Nanti".
  nextLater.hidden = !suggestion.optional;
  const hidden = state.hiddenUntilChange && suggestion.optional;
  nextCard.hidden = hidden;
  hiddenNote.hidden = !hidden;
}

function markDone(key, statusText) {
  const item = document.querySelector(`[data-setup-item="${key}"]`);
  item.classList.add('checklist__item--done');
  item.querySelector('.checklist__mark .icon').hidden = false;
  item.querySelector('[data-setup-status]').textContent = statusText;
  const button = item.querySelector('[data-setup-button]');
  if (button) button.hidden = true;
}

function renderSetup() {
  const done = 2 + (state.periode ? 1 : 0) + (state.doc ? 1 : 0);
  document.querySelector('[data-setup-done]').textContent = String(done);
  document.querySelector('[data-setup-bar]').style.width = `${(done / 5) * 100}%`;

  const docButton = document.querySelector('[data-setup-item="doc"] [data-setup-button]');
  const menuDoc = document.querySelector('[data-menu-doc]');
  if (state.periode && !state.doc) {
    markDone('periode', 'Selesai · Periode 01, Persiapan');
    docButton.disabled = false;
    document.getElementById('doc-reason').textContent = 'Catat saat DOC benar-benar datang';
    menuDoc.removeAttribute('aria-disabled');
    document.querySelector('[data-menu-doc-text]').textContent = 'Aktifkan periode saat DOC datang';
  }
  if (state.doc) {
    markDone('doc', `Selesai · ${formatCount(state.doc.count)} ekor, ${state.doc.date}`);
    menuDoc.setAttribute('aria-disabled', 'true');
    document.querySelector('[data-menu-doc-text]').textContent = 'Sudah dicatat untuk Periode 01';
    document.querySelector('[data-context-line]').textContent = 'Kandang Utara · Periode 01 · Hari ke-1';
    const banner = document.querySelector('[data-active-banner]');
    banner.hidden = false;
    banner.querySelector('[data-active-text]').textContent =
      `Periode 01 aktif sejak ${state.doc.date} dengan ${formatCount(state.doc.count)} ekor. Recording Harian mulai hari ini.`;
    // Persiapan inti selesai: daftar diringkas, hanya langkah opsional yang tersisa.
    const toggle = document.querySelector('[aria-controls="persiapan-daftar"]');
    setExpanded(toggle, false);
    document.getElementById('persiapan-judul').textContent = 'Persiapan selesai';
  }
}

function render() {
  renderSuggestion();
  renderSetup();
}

function finish(form, message) {
  const sheet = form.closest('dialog');
  clearDraft(form);
  afterSheetClose(sheet, () => {
    resetForm(form);
    render();
    showToast(message);
    document.querySelector('[data-next-title]').focus?.();
  });
  closeSheet(sheet);
}

onSubmit('periode', (form) => {
  state.periode = true;
  state.hiddenUntilChange = false;
  finish(form, `${form.elements.nama.value} disiapkan. Catat DOC saat datang.`);
});

onSubmit('doc', (form) => {
  const checked = form.querySelector('input[name="tanggal"]:checked');
  state.doc = { count: form.elements.hidup.dataset.value, date: checked.dataset.reviewText };
  state.hiddenUntilChange = false;
  finish(form, `DOC ${formatCount(state.doc.count)} ekor tercatat. Periode 01 aktif.`);
});

document.querySelector('[data-doc-preview]').closest('form').addEventListener('km:numeric', (event) => {
  if (event.target.id !== 'doc-hidup') return;
  const count = event.target.dataset.value;
  const checked = document.querySelector('#form-doc input[name="tanggal"]:checked');
  document.querySelector('[data-doc-preview]').textContent = count
    ? `Periode 01 aktif mulai ${checked.dataset.reviewText} dengan ${formatCount(count)} ekor.`
    : 'Isi jumlah DOC hidup untuk melihat pratinjau.';
});

nextLater.addEventListener('click', () => {
  state.hiddenUntilChange = true;
  render();
  showToast('Saran disembunyikan sampai ada perubahan.', {
    actionLabel: 'Urungkan',
    onAction: () => {
      state.hiddenUntilChange = false;
      render();
    },
  });
});

document.querySelector('[data-next-show]').addEventListener('click', () => {
  state.hiddenUntilChange = false;
  render();
});

// Tautan langsung tetap mengikuti dependensi nyata: DOC hanya setelah periode disiapkan.
document.getElementById('sheet-doc').addEventListener('km:sheet-open', (event) => {
  if (state.periode && !state.doc) return;
  const sheet = event.currentTarget;
  afterSheetClose(sheet, () => showToast(state.doc ? 'DOC Periode 01 sudah dicatat.' : 'Siapkan periode dulu, lalu catat DOC.'));
  closeSheet(sheet);
});

init();
initMock();
render();
