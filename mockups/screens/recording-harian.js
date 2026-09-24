import { clearDraft, init, showToast, onSubmit } from '../assets/components.js';
import { initMock } from '../assets/mock.js';

const ICONS = '../assets/icons.svg';
const status = document.querySelector('[data-recording-status]');
const statusText = document.querySelector('[data-recording-status-text]');
const author = document.querySelector('[data-recording-author]');

function setStatus(kind, text, iconName) {
  status.className = `status status--${kind}`;
  status.querySelector('use').setAttribute('href', `${ICONS}#${iconName}`);
  statusText.textContent = text;
}

onSubmit('recording', (form, { online }) => {
  const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  clearDraft(form);
  if (online) {
    // Di produk: CMD-21 daily_summary.save; valid langsung berlaku tanpa persetujuan Owner (K-25).
    setStatus('success', 'Tercatat', 'i-check-circle');
    author.textContent = `Terakhir diubah Rudi (Anda), ${time}. Dipakai bersama tim.`;
    document.querySelector('[data-history-summary]').textContent = '1 perubahan';
    document.querySelector('[data-history-body]').textContent = `Rudi mengirim catatan pertama pukul ${time}.`;
    showToast('Recording 23 Sep tercatat. Dipakai bersama tim.');
  } else {
    setStatus('warning', 'Menunggu Kirim', 'i-upload');
    author.textContent = `Disimpan di HP ini pukul ${time}.`;
    showToast('Recording tersimpan di HP. Dikirim saat ada sinyal.');
  }
});

document.querySelector('[data-save-draft]').addEventListener('click', () => {
  const form = document.getElementById('form-recording');
  form.dispatchEvent(new Event('change', { bubbles: true }));
  showToast('Draf tersimpan di HP. Belum terkirim.');
});

init();
initMock();
