/*
 * Aksi lembar ABK yang dipakai Hari Ini dan Uang Kas.
 * Di produk, handler ini memanggil antrean lokal + API (CMD-25, CMD-28); di mockup hanya memperbarui layar.
 */
import { afterSheetClose, clearDraft, closeSheet, onSubmit, resetForm, showToast } from '../assets/components.js';

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function checkedLabel(form, name, fallback) {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  if (!checked) return fallback;
  return form.querySelector(`label[for="${checked.id}"]`)?.textContent.trim() || fallback;
}

function finish(form, message) {
  const sheet = form.closest('dialog');
  clearDraft(form);
  afterSheetClose(sheet, () => {
    resetForm(form);
    showToast(message);
  });
  closeSheet(sheet);
}

export function initAbkSheets({ onPurchaseSaved, onCashSaved } = {}) {
  onSubmit('belanja', (form, { online }) => {
    const purpose = form.elements.keperluan.value.trim();
    const amount = form.elements.nominal.value;
    onPurchaseSaved?.({
      purpose,
      amount,
      source: checkedLabel(form, 'sumber', 'Sumber belum tahu'),
      date: checkedLabel(form, 'tanggal', 'Hari ini'),
      online,
    });
    finish(
      form,
      online ? `Belanja ${purpose} terkirim. Menunggu Owner.` : `Belanja ${purpose} tersimpan di HP. Dikirim saat ada sinyal.`,
    );
  });

  onSubmit('terima-uang', (form, { online }) => {
    const amount = form.elements.nominal.value;
    onCashSaved?.({ direction: 'in', title: 'Terima Uang', amount, online });
    finish(form, online ? `Terima Uang ${amount} tercatat. Belum dicek Owner.` : `Terima Uang ${amount} tersimpan di HP. Menunggu kirim.`);
  });

  onSubmit('kembalikan-uang', (form, { online }) => {
    const amount = form.elements.nominal.value;
    onCashSaved?.({ direction: 'out', title: 'Kembalikan Uang', amount, online });
    finish(
      form,
      online ? `Kembalikan Uang ${amount} tercatat. Belum dicek Owner.` : `Kembalikan Uang ${amount} tersimpan di HP. Menunggu kirim.`,
    );
  });
}
