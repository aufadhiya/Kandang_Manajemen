import { init, isOnline, setExpanded, showToast } from '../assets/components.js';
import { initMock } from '../assets/mock.js';
import { escapeHtml, initAbkSheets } from './abk-sheets.js';

const ICONS = '../assets/icons.svg';
const purchaseList = document.querySelector('[data-purchase-list]');
const unsentList = document.querySelector('[data-unsent-list]');
const unsentSection = document.querySelector('[data-unsent-section]');
const unsentCount = document.querySelector('[data-unsent-count]');

function statusBadge(online) {
  return online
    ? `<span class="status status--info"><svg class="icon" aria-hidden="true" focusable="false"><use href="${ICONS}#i-history"></use></svg>Menunggu Owner</span>`
    : `<span class="status status--warning"><svg class="icon" aria-hidden="true" focusable="false"><use href="${ICONS}#i-upload"></use></svg>Menunggu Kirim</span>`;
}

function rowMarkup({ id, title, meta, amount, online }) {
  const panelText = online ? 'Owner belum membukukan belanja ini.' : 'Tersimpan di HP ini. Dikirim otomatis saat ada sinyal.';
  const resend = online
    ? ''
    : `<button type="button" class="btn btn--secondary" data-resend><svg class="icon icon--sm" aria-hidden="true" focusable="false"><use href="${ICONS}#i-send"></use></svg>Kirim Ulang</button>`;
  return `
    <li class="disclosure-item">
      <button type="button" class="disclosure__toggle" data-disclosure aria-expanded="false" aria-controls="${id}-panel">
        <span class="disclosure__summary">
          <span class="disclosure__title">${escapeHtml(title)}</span>
          <span class="text-meta">${escapeHtml(meta)}</span>
          ${statusBadge(online)}
        </span>
        <span class="disclosure__side"><span class="num">${escapeHtml(amount)}</span></span>
        <svg class="icon disclosure__chevron" aria-hidden="true" focusable="false"><use href="${ICONS}#i-chevron-down"></use></svg>
      </button>
      <div class="disclosure__panel" id="${id}-panel" hidden>
        <p class="text-meta">${panelText}</p>
        ${resend}
      </div>
    </li>`;
}

function refreshUnsent() {
  const count = unsentList.children.length;
  unsentCount.textContent = String(count);
  unsentSection.hidden = count === 0;
}

initAbkSheets({
  onPurchaseSaved({ purpose, amount, source, date, online }) {
    const id = `baru-${Date.now()}`;
    const markup = rowMarkup({ id, title: purpose, meta: `${date} · ${source}`, amount, online });
    (online ? purchaseList : unsentList).insertAdjacentHTML('afterbegin', markup);
    refreshUnsent();
  },
});

document.addEventListener('click', (event) => {
  const resend = event.target.closest('[data-resend]');
  if (resend) {
    if (!isOnline()) {
      showToast('Belum ada sinyal. Catatan tetap aman di HP.');
      return;
    }
    const item = resend.closest('.disclosure-item');
    const title = item.querySelector('.disclosure__title').textContent;
    const meta = item.querySelector('.disclosure__summary .text-meta').textContent;
    const amount = item.querySelector('.disclosure__side .num').textContent;
    item.remove();
    purchaseList.insertAdjacentHTML('afterbegin', rowMarkup({ id: `kirim-${Date.now()}`, title, meta, amount, online: true }));
    refreshUnsent();
    showToast(`Belanja ${title} terkirim. Menunggu Owner.`);
    return;
  }
  const opener = event.target.closest('[data-open-row]');
  if (opener) {
    const toggle = document.getElementById(opener.dataset.openRow);
    if (toggle.getAttribute('aria-expanded') !== 'true') setExpanded(toggle, true);
    toggle.scrollIntoView({ block: 'center' });
    toggle.focus({ preventScroll: true });
  }
});

init();
initMock();
refreshUnsent();
