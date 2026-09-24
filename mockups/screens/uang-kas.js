import { init } from '../assets/components.js';
import { initMock } from '../assets/mock.js';
import { escapeHtml, initAbkSheets } from './abk-sheets.js';

const ICONS = '../assets/icons.svg';
const list = document.querySelector('[data-cash-list]');

function addRow({ title, amount, direction, online }) {
  const id = `kas-baru-${Date.now()}`;
  const inbound = direction === 'in';
  const status = online
    ? `<span class="status status--info"><svg class="icon" aria-hidden="true" focusable="false"><use href="${ICONS}#i-history"></use></svg>Belum Dicek Owner</span>`
    : `<span class="status status--warning"><svg class="icon" aria-hidden="true" focusable="false"><use href="${ICONS}#i-upload"></use></svg>Menunggu Kirim</span>`;
  list.insertAdjacentHTML(
    'afterbegin',
    `<li class="disclosure-item">
      <button type="button" class="disclosure__toggle" data-disclosure aria-expanded="false" aria-controls="${id}-panel">
        <svg class="icon ${inbound ? 'money-in' : 'money-out'}" aria-hidden="true" focusable="false"><use href="${ICONS}#${inbound ? 'i-arrow-in' : 'i-arrow-out'}"></use></svg>
        <span class="disclosure__summary">
          <span class="disclosure__title">${escapeHtml(title)}</span>
          <span class="text-meta">Hari ini · ${inbound ? 'Masuk' : 'Keluar'}</span>
          ${status}
        </span>
        <span class="disclosure__side"><span class="num${inbound ? ' money-in' : ''}">${inbound ? '+' : '−'}&nbsp;${escapeHtml(amount)}</span></span>
        <svg class="icon disclosure__chevron" aria-hidden="true" focusable="false"><use href="${ICONS}#i-chevron-down"></use></svg>
      </button>
      <div class="disclosure__panel" id="${id}-panel" hidden>
        <p class="text-meta">Saldo dibukukan belum berubah sampai Owner mengecek dan membukukan.</p>
      </div>
    </li>`,
  );
}

initAbkSheets({
  onPurchaseSaved: ({ purpose, amount, online }) => addRow({ title: `Belanja ${purpose}`, amount, direction: 'out', online }),
  onCashSaved: addRow,
});

init();
initMock();
