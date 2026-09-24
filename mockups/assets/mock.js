/*
 * Khusus mockup — JANGAN dibawa ke produk.
 * Menandai tujuan yang belum dibuat agar peninjau tidak mengira tautan rusak.
 */
import { afterSheetClose, closeSheet, showToast } from './components.js';

export function initMock() {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-mock-missing]');
    if (!target) return;
    event.preventDefault();
    const sheet = target.closest('dialog[open]');
    const message = 'Layar ini belum termasuk mockup.';
    if (sheet) {
      afterSheetClose(sheet, () => showToast(message));
      closeSheet(sheet);
    } else {
      showToast(message);
    }
  });
}
