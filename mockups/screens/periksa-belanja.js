import { afterSheetClose, closeSheet, init, onSubmit, openSheet, resetForm, setExpanded, showToast, validate } from '../assets/components.js';
import { initMock } from '../assets/mock.js';
import { formatRupiah } from '../assets/format.js';

const ICONS = '../assets/icons.svg';
const rows = () => [...document.querySelectorAll('[data-purchase]')];
let activeRow = null;

const STATUS = {
  dibukukan: { className: 'status status--success', icon: 'i-check-circle', text: 'Dibukukan' },
  lengkapi: { className: 'status status--warning', icon: 'i-alert', text: 'Perlu Dilengkapi' },
  ditolak: { className: 'status status--danger', icon: 'i-x', text: 'Ditolak' },
};

function currentFilter() {
  return document.querySelector('input[name="filter"]:checked').value;
}

function refreshList() {
  const filter = currentFilter();
  let visibleTotal = 0;
  let visibleCount = 0;
  for (const row of rows()) {
    const show = row.dataset.status === filter;
    row.hidden = !show;
    if (show) {
      visibleCount += 1;
      visibleTotal += Number(row.dataset.amount);
    }
  }
  for (const key of ['periksa', 'lengkapi', 'ditolak', 'dibukukan']) {
    document.querySelector(`[data-count="${key}"]`).textContent = String(rows().filter((row) => row.dataset.status === key).length);
  }
  document.querySelector('[data-list-summary]').textContent = visibleCount
    ? `${visibleCount} belanja · ${formatRupiah(String(visibleTotal))}`
    : 'Tidak ada belanja di bagian ini.';
  document.querySelector('[data-empty]').hidden = visibleCount > 0;
}

function setRowStatus(row, status) {
  row.dataset.status = status;
  const badge = row.querySelector('[data-status-badge]');
  const look = STATUS[status];
  badge.className = look.className;
  badge.querySelector('use').setAttribute('href', `${ICONS}#${look.icon}`);
  badge.querySelector('[data-status-text]').textContent = look.text;
  const toggle = row.querySelector('[data-disclosure]');
  if (toggle.getAttribute('aria-expanded') === 'true') setExpanded(toggle, false);
  row.querySelector('.disclosure__panel').innerHTML = `<p class="text-meta">${
    status === 'dibukukan'
      ? 'Dibukukan hari ini. Perubahan memakai Koreksi, tidak menghapus catatan.'
      : status === 'lengkapi'
        ? 'Menunggu pencatat melengkapi.'
        : 'Ditolak hari ini. Uang yang sudah keluar tetap perlu diselesaikan.'
  }</p>`;
}

function fill(template, amountText) {
  return template.replaceAll('{amount}', amountText);
}

/** Dampak dihitung ulang dari nominal, cara bayar, dan pembebanan yang sedang dipilih di baris. */
function renderImpact(row) {
  const input = row.querySelector('[data-row-amount]');
  if (!input) return;
  const digits = input.dataset.value || '';
  row.dataset.amount = digits || '0';
  row.dataset.amountText = formatRupiah(digits);
  row.querySelector('[data-claim-diff]').hidden = !digits || digits === input.dataset.claim;
  const amountText = digits ? formatRupiah(digits) : '—';
  const source = row.querySelector('p[data-impact]');
  const chosen = row.querySelector('[data-impact-source] input:checked');
  const template = chosen?.dataset.impactTemplate || source.dataset.template;
  source.textContent = template ? fill(template, amountText) : source.dataset.impactDefault;
  const costSelect = row.querySelector('[data-cost-select]');
  const cost = row.querySelector('[data-impact-cost]');
  const costTemplate = costSelect?.selectedOptions[0]?.dataset.costTemplate || cost.dataset.template;
  cost.textContent = fill(costTemplate, amountText);
}

function impactText(row) {
  return [...row.querySelectorAll('.impact p:not(.impact__title)')].map((p) => p.textContent).join(' ');
}

function finishRow(sheet, row, status, message) {
  afterSheetClose(sheet, () => {
    setRowStatus(row, status);
    refreshList();
    showToast(message);
  });
  closeSheet(sheet);
}

document.addEventListener('click', (event) => {
  const row = event.target.closest('[data-purchase]');
  if (event.target.closest('[data-approve]')) {
    const panel = row.querySelector('.disclosure__panel');
    if (!validate(panel)) return;
    activeRow = row;
    const sheet = document.getElementById('sheet-bukukan');
    sheet.querySelector('[data-sheet-title]').textContent = `Bukukan belanja ${row.dataset.title}?`;
    sheet.querySelector('[data-confirm-context]').textContent = `Dicatat ${row.dataset.by}`;
    sheet.querySelector('[data-confirm-amount]').textContent = row.dataset.amountText;
    sheet.querySelector('[data-confirm-impact]').textContent = impactText(row);
    openSheet('sheet-bukukan', { opener: event.target.closest('button') });
  } else if (event.target.closest('[data-request-fix]')) {
    activeRow = row;
    document.querySelector('[data-fix-context]').textContent = `${row.dataset.title} · ${row.dataset.amountText} · ${row.dataset.by}`;
    openSheet('sheet-perbaikan', { opener: event.target.closest('button') });
  } else if (event.target.closest('[data-reject]')) {
    activeRow = row;
    document.querySelector('[data-reject-context]').textContent = `${row.dataset.title} · ${row.dataset.amountText} · ${row.dataset.by}`;
    openSheet('sheet-tolak', { opener: event.target.closest('button') });
  } else if (event.target.closest('[data-confirm-approve]')) {
    // Di produk: CMD-29 purchase.review_and_post, satu transaksi per dokumen dengan versi yang ditinjau.
    finishRow(document.getElementById('sheet-bukukan'), activeRow, 'dibukukan', `Belanja ${activeRow.dataset.title} dibukukan.`);
  }
});

document.addEventListener('change', (event) => {
  if (event.target.name === 'filter') refreshList();
  const row = event.target.closest('[data-purchase]');
  if (row) renderImpact(row);
});

document.addEventListener('km:numeric', (event) => {
  const row = event.target.closest('[data-purchase]');
  if (row && event.target.matches('[data-row-amount]')) {
    renderImpact(row);
    refreshList();
  }
});

onSubmit('perbaikan', (form) => {
  const sheet = form.closest('dialog');
  const row = activeRow;
  afterSheetClose(sheet, () => resetForm(form));
  finishRow(sheet, row, 'lengkapi', `Permintaan terkirim ke ${row.dataset.by}.`);
});

onSubmit('tolak', (form) => {
  const sheet = form.closest('dialog');
  const row = activeRow;
  afterSheetClose(sheet, () => resetForm(form));
  finishRow(sheet, row, 'ditolak', `Belanja ${row.dataset.title} ditolak.`);
});

init();
initMock();
rows().forEach(renderImpact);
refreshList();
