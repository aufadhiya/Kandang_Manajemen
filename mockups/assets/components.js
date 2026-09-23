/*
 * Perilaku komponen mockup (vanilla ES module). Kontrak markup ada di mockups/README.md §4.
 * Saat porting ke framework: pertahankan atribut ARIA, urutan fokus, aturan riwayat (tombol kembali),
 * serta logika di format.js; ganti localStorage dengan penyimpanan lokal proyek (IndexedDB, OFF-01).
 */
import {
  applyKeypadKey,
  formatByKind,
  formatQuantity,
  normalizeTyped,
  parsePastedRupiah,
  terbilangRupiah,
} from './format.js';

const ICON_URL = new URL('./icons.svg', import.meta.url).href;
const KEYBOARD_PREF_KEY = 'km.keyboard';
const DRAFT_PREFIX = 'km.draft.';

export function icon(name, className = 'icon') {
  return `<svg class="${className}" aria-hidden="true" focusable="false"><use href="${ICON_URL}#${name}"></use></svg>`;
}

function params() {
  return new URLSearchParams(location.search);
}

function urlWith(nextParams) {
  const query = nextParams.toString();
  return `${location.pathname}${query ? `?${query}` : ''}${location.hash}`;
}

function timeLabel(date = new Date()) {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

/* ---------- Koneksi ---------- */

export function isOnline() {
  // ?simulasi=offline hanya untuk meninjau mockup; aplikasi memakai status jaringan sebenarnya.
  if (params().get('simulasi') === 'offline') return false;
  return navigator.onLine;
}

function applyOnlineGates() {
  const online = isOnline();
  document.documentElement.dataset.online = String(online);
  document.querySelectorAll('[data-requires-online]').forEach((button) => {
    if (!online) {
      button.dataset.offlineDisabled = 'true';
      button.disabled = true;
    } else if (button.dataset.offlineDisabled) {
      delete button.dataset.offlineDisabled;
      button.disabled = false;
    }
  });
  document.querySelectorAll('[data-offline-reason]').forEach((note) => {
    note.hidden = online;
  });
}

function initConnectivity() {
  addEventListener('online', applyOnlineGates);
  addEventListener('offline', applyOnlineGates);
  applyOnlineGates();
}

/* ---------- Pesan singkat ---------- */

let toastTimer;

/** Pesan status singkat. `actionLabel` hanya untuk aksi lokal yang dapat diurungkan (UX_UI_SPEC §16.1). */
export function showToast(message, { actionLabel, onAction } = {}) {
  const region = document.querySelector('[data-toast-region]');
  if (!region) return;
  region.replaceChildren();
  const toast = document.createElement('div');
  toast.className = 'toast';
  const text = document.createElement('span');
  text.className = 'toast__text';
  text.textContent = message;
  toast.append(text);
  if (actionLabel) {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'toast__action';
    action.textContent = actionLabel;
    action.addEventListener('click', () => {
      onAction?.();
      toast.remove();
    });
    toast.append(action);
  }
  region.append(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), actionLabel ? 8000 : 5000);
}

/* ---------- Lembar (dialog modal) ---------- */

const sheetOpeners = new WeakMap();

function openSheetsExcept(id) {
  return [...document.querySelectorAll('dialog[data-sheet][open]')].filter((sheet) => sheet.id !== id);
}

function showStep(sheet, stepName) {
  const steps = sheet.querySelectorAll('[data-step]');
  if (!steps.length) return;
  const target = stepName || steps[0].dataset.step;
  steps.forEach((step) => {
    step.hidden = step.dataset.step !== target;
  });
  sheet.querySelectorAll('[data-step-footer]').forEach((footer) => {
    footer.hidden = footer.dataset.stepFooter !== target;
  });
  sheet.dataset.currentStep = target;
  sheet.querySelector('.sheet__body')?.scrollTo({ top: 0 });
  sheet.dispatchEvent(new CustomEvent('km:step', { bubbles: true, detail: { step: target } }));
}

export function openSheet(id, { fromHistory = false, opener = document.activeElement } = {}) {
  const sheet = document.getElementById(id);
  if (!sheet || sheet.open) return;
  const others = openSheetsExcept(id);
  const replacing = others.length > 0;
  others.forEach((other) => closeSheetNow(other, { restoreFocus: false }));
  if (!replacing && opener instanceof HTMLElement) sheetOpeners.set(sheet, opener);
  if (replacing) sheetOpeners.set(sheet, sheetOpeners.get(others[0]) || opener);
  sheet.querySelectorAll('form[data-draft-key]').forEach(restoreDraft);
  showStep(sheet, null);
  sheet.showModal();
  sheet.querySelector('[data-sheet-title]')?.focus();
  if (!fromHistory) {
    const next = params();
    next.set('sheet', id);
    // Satu lembar aktif: berganti lembar tidak menambah riwayat, sehingga Kembali kembali ke layar asal.
    if (replacing) history.replaceState({ sheet: id }, '', urlWith(next));
    else history.pushState({ sheet: id }, '', urlWith(next));
  }
  sheet.dispatchEvent(new CustomEvent('km:sheet-open', { bubbles: true }));
}

function closeSheetNow(sheet, { restoreFocus = true } = {}) {
  if (!sheet.open) return;
  closeKeypad();
  sheet.close();
  if (restoreFocus) {
    const opener = sheetOpeners.get(sheet);
    if (opener?.isConnected) opener.focus();
  }
  sheet.dispatchEvent(new CustomEvent('km:sheet-close', { bubbles: true }));
}

/** Jalankan setelah lembar benar-benar tertutup, agar pesan status tidak tertutup lapisan modal. */
export function afterSheetClose(sheet, callback) {
  if (!sheet?.open) {
    callback();
    return;
  }
  sheet.addEventListener('km:sheet-close', () => callback(), { once: true });
}

/** Menutup lembar lewat riwayat agar tombol Kembali HP/browser dan tombol Tutup berperilaku sama. */
export function closeSheet(sheet) {
  if (history.state?.sheet === sheet.id) {
    history.back();
    return;
  }
  const next = params();
  next.delete('sheet');
  history.replaceState(null, '', urlWith(next));
  closeSheetNow(sheet);
}

function initSheets() {
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-sheet-open]');
    if (opener && !opener.disabled && opener.getAttribute('aria-disabled') !== 'true') {
      event.preventDefault();
      openSheet(opener.dataset.sheetOpen, { opener });
      return;
    }
    const closer = event.target.closest('[data-sheet-close]');
    if (closer) {
      closeSheet(closer.closest('dialog'));
      return;
    }
    const stepButton = event.target.closest('[data-step-to]');
    if (stepButton) {
      const sheet = stepButton.closest('dialog');
      const current = sheet.querySelector(`[data-step="${sheet.dataset.currentStep}"]`);
      if (stepButton.hasAttribute('data-validate') && !validate(current)) return;
      showStep(sheet, stepButton.dataset.stepTo);
      sheet.querySelector('[data-sheet-title]')?.focus();
    }
  });

  document.querySelectorAll('dialog[data-sheet]').forEach((sheet) => {
    sheet.addEventListener('cancel', (event) => {
      event.preventDefault();
      if (activeInput && sheet.contains(activeInput)) {
        closeKeypad();
        return;
      }
      closeSheet(sheet);
    });
    sheet.addEventListener('click', (event) => {
      if (event.target !== sheet) return;
      const rect = sheet.getBoundingClientRect();
      const outside =
        event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) closeSheet(sheet);
    });
  });

  const initial = params().get('sheet');
  if (initial && document.getElementById(initial)) {
    // Buka dari tautan: riwayat dibuat seperti membuka dari layar asal, sehingga Kembali menutup lembar saja.
    const base = params();
    base.delete('sheet');
    history.replaceState(null, '', urlWith(base));
    openSheet(initial, { opener: null });
  }
}

function syncSheetsWithUrl() {
  const wanted = params().get('sheet');
  document.querySelectorAll('dialog[data-sheet][open]').forEach((sheet) => {
    if (sheet.id !== wanted) closeSheetNow(sheet);
  });
  if (wanted && document.getElementById(wanted) && !document.getElementById(wanted).open) {
    openSheet(wanted, { fromHistory: true });
  }
}

/* ---------- Baris buka-tutup ---------- */

function disclosurePanel(button) {
  return document.getElementById(button.getAttribute('aria-controls'));
}

export function setExpanded(button, expanded, { fromHistory = false } = {}) {
  const panel = disclosurePanel(button);
  if (!panel) return;
  button.setAttribute('aria-expanded', String(expanded));
  panel.hidden = !expanded;
  button.closest('.disclosure-item')?.classList.toggle('is-open', expanded);
  const key = button.dataset.urlKey;
  if (!key || fromHistory) return;
  const value = button.dataset.urlValue;
  const next = params();
  if (expanded) {
    next.set(key, value);
    history.pushState({ disclosure: `${key}=${value}` }, '', urlWith(next));
  } else if (next.get(key) === value) {
    if (history.state?.disclosure === `${key}=${value}`) {
      history.back();
    } else {
      next.delete(key);
      history.replaceState(null, '', urlWith(next));
    }
  }
}

function syncDisclosuresWithUrl({ scroll = false } = {}) {
  const current = params();
  document.querySelectorAll('[data-disclosure][data-url-key]').forEach((button) => {
    const shouldOpen = current.get(button.dataset.urlKey) === button.dataset.urlValue;
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    if (shouldOpen !== isOpen) setExpanded(button, shouldOpen, { fromHistory: true });
    if (shouldOpen && scroll) button.scrollIntoView({ block: 'start' });
  });
}

function initDisclosures() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-disclosure]');
    if (button) {
      setExpanded(button, button.getAttribute('aria-expanded') !== 'true');
      return;
    }
    const closeAll = event.target.closest('[data-disclosure-close-all]');
    if (closeAll) {
      const scope = document.getElementById(closeAll.dataset.disclosureCloseAll);
      scope?.querySelectorAll('[data-disclosure][aria-expanded="true"]').forEach((open) => {
        setExpanded(open, false, { fromHistory: true });
        if (open.dataset.urlKey) {
          const next = params();
          next.delete(open.dataset.urlKey);
          history.replaceState(null, '', urlWith(next));
        }
      });
    }
  });
  syncDisclosuresWithUrl({ scroll: true });
}

/* ---------- Field angka dan keypad ---------- */

let activeInput = null;

function keyboardPref() {
  return localStorage.getItem(KEYBOARD_PREF_KEY) === 'device' ? 'device' : 'app';
}

function numericOptions(input) {
  return {
    maxDigits: Number(input.dataset.maxDigits || 13),
    decimals: Number(input.dataset.decimals || 2),
  };
}

function applyInputMode(input) {
  const deviceMode = input.dataset.numeric === 'quantity' ? 'decimal' : 'numeric';
  input.inputMode = keyboardPref() === 'app' ? 'none' : deviceMode;
  const field = input.closest('.field');
  const switcher = field?.querySelector('[data-keyboard-switch]');
  if (switcher) switcher.hidden = keyboardPref() === 'app';
}

function setKeyboardPref(value) {
  localStorage.setItem(KEYBOARD_PREF_KEY, value);
  document.querySelectorAll('input[data-numeric]').forEach(applyInputMode);
}

export function setNumericValue(input, canonical, { silent = false } = {}) {
  input.dataset.value = canonical;
  input.value = formatByKind(input.dataset.numeric, canonical);
  const words = document.querySelector(`[data-terbilang-for="${input.id}"]`);
  if (words) words.textContent = input.dataset.numeric === 'rupiah' ? terbilangRupiah(canonical) : '';
  clearFieldError(input);
  if (!silent) input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new CustomEvent('km:numeric', { bubbles: true, detail: { value: canonical } }));
}

function removeNotice(input) {
  input.closest('.field')?.querySelector('[data-paste-notice]')?.remove();
}

function showPasteConfirm(input, pastedText, canonical) {
  removeNotice(input);
  const field = input.closest('.field');
  const notice = document.createElement('div');
  notice.className = 'field__notice';
  notice.dataset.pasteNotice = '';
  notice.setAttribute('role', 'status');
  const shown = formatByKind(input.dataset.numeric, canonical);
  notice.innerHTML = `${icon('i-alert', 'icon icon--sm')}<div class="field__notice-body"><p></p><div class="row row--wrap"></div></div>`;
  notice.querySelector('p').textContent = `Teks “${pastedText}” kurang jelas. Maksud Anda ${shown}?`;
  const yes = document.createElement('button');
  yes.type = 'button';
  yes.className = 'btn btn--secondary btn--sm';
  yes.textContent = `Ya, pakai ${shown}`;
  yes.addEventListener('click', () => {
    setNumericValue(input, canonical);
    notice.remove();
    input.focus();
  });
  const no = document.createElement('button');
  no.type = 'button';
  no.className = 'btn btn--tertiary btn--sm';
  no.textContent = 'Ketik ulang';
  no.addEventListener('click', () => {
    notice.remove();
    input.focus();
  });
  notice.querySelector('.row').append(yes, no);
  field.append(notice);
}

function handlePaste(event) {
  const input = event.currentTarget;
  event.preventDefault();
  const text = event.clipboardData?.getData('text') ?? '';
  const kind = input.dataset.numeric;
  if (kind === 'rupiah') {
    const parsed = parsePastedRupiah(text);
    if (!parsed.valid) return;
    if (parsed.ambiguous) showPasteConfirm(input, text.trim(), parsed.digits);
    else setNumericValue(input, parsed.digits);
    return;
  }
  if (kind === 'quantity' && text.includes('.') && !text.includes(',')) {
    showPasteConfirm(input, text.trim(), normalizeTyped(kind, text.replace('.', ','), numericOptions(input)));
    return;
  }
  setNumericValue(input, normalizeTyped(kind, text, numericOptions(input)));
}

function keypadFor(input) {
  const sheet = input.closest('dialog[data-sheet]');
  if (sheet) return { host: sheet, keypad: sheet.querySelector('[data-keypad]') };
  return { host: document.body, keypad: document.querySelector('body > [data-keypad]') };
}

function renderKeypad(keypad) {
  if (keypad.dataset.rendered) return;
  keypad.dataset.rendered = 'true';
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    .map((d) => `<button type="button" class="keypad__key" data-key="${d}">${d}</button>`)
    .join('');
  keypad.innerHTML = `
    <div class="keypad__inner">
      <div class="keypad__top">
        <button type="button" class="btn btn--tertiary btn--sm" data-key-action="device">${icon('i-keyboard', 'icon icon--sm')}Keyboard HP</button>
        <span class="row">
          <button type="button" class="btn btn--secondary btn--sm" data-key-action="next">Lanjut</button>
          <button type="button" class="btn btn--primary btn--sm" data-key-action="done">Selesai</button>
        </span>
      </div>
      <div class="keypad__grid" role="group" aria-label="Keypad angka">
        ${digits}
        <button type="button" class="keypad__key" data-key="000" aria-label="nol nol nol">000</button>
        <button type="button" class="keypad__key" data-key="decimal" aria-label="koma">,</button>
        <span class="keypad__spacer" data-keypad-spacer aria-hidden="true"></span>
        <button type="button" class="keypad__key" data-key="0">0</button>
        <button type="button" class="keypad__key keypad__key--fn" data-key="back" aria-label="Hapus satu angka">${icon('i-backspace')}</button>
      </div>
    </div>`;
  keypad.addEventListener('pointerdown', (event) => {
    // Menahan fokus di field agar keyboard HP tidak muncul dan caret tidak hilang.
    if (event.target.closest('button')) event.preventDefault();
  });
  keypad.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !activeInput) return;
    const input = activeInput;
    if (button.dataset.keyAction === 'done') {
      closeKeypad();
      input.focus({ preventScroll: true });
      return;
    }
    if (button.dataset.keyAction === 'next') {
      const next = nextField(input);
      if (!next) return;
      if (!next.matches('input[data-numeric]')) closeKeypad();
      next.focus();
      return;
    }
    if (button.dataset.keyAction === 'device') {
      setKeyboardPref('device');
      closeKeypad();
      input.blur();
      input.focus();
      return;
    }
    const next = applyKeypadKey(input.dataset.numeric, input.dataset.value || '', button.dataset.key, numericOptions(input));
    if (next !== (input.dataset.value || '')) setNumericValue(input, next);
  });
}

function configureKeypad(keypad, input) {
  const kind = input.dataset.numeric;
  keypad.querySelector('[data-key="000"]').hidden = kind !== 'rupiah';
  keypad.querySelector('[data-key="decimal"]').hidden = kind !== 'quantity';
  keypad.querySelector('[data-keypad-spacer]').hidden = kind !== 'count';
  const label = document.querySelector(`label[for="${input.id}"]`)?.textContent.trim() || '';
  keypad.querySelector('.keypad__grid').setAttribute('aria-label', `Keypad angka untuk ${label}`);
  keypad.querySelector('[data-key-action="next"]').hidden = !nextField(input);
}

/** Field ketik berikutnya yang terlihat dalam formulir yang sama (untuk tombol Lanjut); pilihan/select dilewati. */
function nextField(input) {
  const scope = input.form || input.closest('dialog, main');
  const fields = [...scope.querySelectorAll('input, textarea')].filter(
    (element) =>
      !['hidden', 'radio', 'checkbox', 'file', 'submit', 'button', 'date'].includes(element.type) &&
      !element.disabled &&
      !element.closest('[hidden]'),
  );
  return fields[fields.indexOf(input) + 1] || null;
}

export function openKeypad(input) {
  if (keyboardPref() !== 'app') return;
  const { host, keypad } = keypadFor(input);
  if (!keypad) return;
  if (activeInput && activeInput !== input) closeKeypad();
  renderKeypad(keypad);
  configureKeypad(keypad, input);
  activeInput = input;
  keypad.hidden = false;
  host.dataset.keypadOpen = 'true';
  // Seluruh field (termasuk ejaan nominal) harus terlihat di atas keypad.
  const field = input.closest('.field') || input;
  requestAnimationFrame(() => field.scrollIntoView({ block: host === document.body ? 'center' : 'nearest' }));
}

export function closeKeypad() {
  if (!activeInput) return;
  const { host, keypad } = keypadFor(activeInput);
  if (keypad) keypad.hidden = true;
  delete host.dataset.keypadOpen;
  activeInput.dispatchEvent(new CustomEvent('km:keypad-close', { bubbles: true }));
  activeInput = null;
}

function addKeyboardSwitch(input) {
  const field = input.closest('.field');
  if (!field || field.querySelector('[data-keyboard-switch]')) return;
  const switcher = document.createElement('button');
  switcher.type = 'button';
  switcher.className = 'btn btn--tertiary btn--sm';
  switcher.dataset.keyboardSwitch = '';
  switcher.style.justifySelf = 'start';
  switcher.innerHTML = `${icon('i-keyboard', 'icon icon--sm')}Pakai keypad aplikasi`;
  switcher.addEventListener('click', () => {
    setKeyboardPref('app');
    input.focus();
    openKeypad(input);
  });
  field.append(switcher);
}

function initNumericFields() {
  document.querySelectorAll('input[data-numeric]').forEach((input) => {
    input.autocomplete = 'off';
    input.spellcheck = false;
    addKeyboardSwitch(input);
    applyInputMode(input);
    input.addEventListener('focus', () => openKeypad(input));
    input.addEventListener('click', () => {
      if (activeInput !== input) openKeypad(input);
    });
    input.addEventListener('input', (event) => {
      if (!event.isTrusted) return;
      const canonical = normalizeTyped(input.dataset.numeric, input.value, numericOptions(input));
      setNumericValue(input, canonical, { silent: true });
      const end = input.value.length;
      input.setSelectionRange(end, end);
    });
    input.addEventListener('paste', handlePaste);
    if (input.dataset.value) setNumericValue(input, input.dataset.value, { silent: true });
  });

  document.addEventListener('focusin', (event) => {
    if (!activeInput) return;
    const target = event.target;
    if (target === activeInput || target.closest?.('[data-keypad]')) return;
    if (target.matches?.('input[data-numeric]')) return;
    closeKeypad();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeInput && !activeInput.closest('dialog')) closeKeypad();
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-stepper-target]');
    if (!button) return;
    const input = document.getElementById(button.dataset.stepperTarget);
    const delta = Number(button.dataset.stepperDelta);
    const current = input.dataset.value || '';
    if (current === '' && delta < 0) return;
    const next = (current === '' ? 0 : Number(current)) + delta;
    if (next < 0) return;
    setNumericValue(input, String(next));
  });

  document.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-suggest]');
    if (!chip) return;
    const input = document.getElementById(chip.closest('[data-suggest-for]').dataset.suggestFor);
    input.value = chip.dataset.suggest;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

/* ---------- Bantuan pintar generik (UX_UI_SPEC §5.4) ---------- */

function initSmartHints() {
  document.addEventListener('km:numeric', (event) => {
    const input = event.target;
    const value = input.dataset.value || '';

    const compare = document.querySelector(`[data-compare-for="${input.id}"]`);
    if (compare) compare.hidden = value === '';

    const usualMax = input.dataset.usualMax;
    const unusual = document.querySelector(`[data-unusual-for="${input.id}"]`);
    if (usualMax && unusual) {
      const isUnusual = value !== '' && Number(value) > Number(usualMax);
      unusual.hidden = !isUnusual;
      if (isUnusual) {
        unusual.querySelector('[data-unusual-text]').textContent =
          `${input.value} ${input.dataset.unit || ''} — jauh di atas ${input.dataset.usualText}. Sudah benar?`;
      }
    }

    document.querySelectorAll('[data-average-of]').forEach((output) => {
      const [totalId, countId] = output.dataset.averageOf.split('/');
      const total = Number(document.getElementById(totalId)?.dataset.value || 0);
      const count = Number(document.getElementById(countId)?.dataset.value || 0);
      if (total > 0 && count > 0) {
        const avg = Math.round((total / count) * 100) / 100;
        output.textContent = `${formatQuantity(String(avg))} kg/ekor sampel`;
      } else {
        output.textContent = '—';
      }
    });
  });
}

/* ---------- Pilihan yang menampilkan bagian lain ---------- */

function updateShowWhen(scope) {
  scope.querySelectorAll('[data-show-when]').forEach((element) => {
    const [name, value] = element.dataset.showWhen.split('=');
    const form = element.closest('form') || document;
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    element.hidden = !(checked && checked.value === value);
  });
}

function initShowWhen() {
  document.addEventListener('change', (event) => {
    if (event.target.matches('input[type="radio"], input[type="checkbox"]')) updateShowWhen(document);
  });
  document.addEventListener('km:restored', () => updateShowWhen(document));
  updateShowWhen(document);
}

/* ---------- Validasi dan ringkasan error ---------- */

function controlOf(element) {
  return element.matches('fieldset') ? element.querySelector('input') : element;
}

function clearFieldError(element) {
  const container = element.closest('.field, fieldset');
  container?.querySelector(':scope > .field__error')?.remove();
  if (element.getAttribute('aria-invalid') === 'true') element.removeAttribute('aria-invalid');
  const described = (element.getAttribute('aria-describedby') || '')
    .split(' ')
    .filter((id) => id && !id.endsWith('-error'));
  if (described.length) element.setAttribute('aria-describedby', described.join(' '));
  else element.removeAttribute('aria-describedby');
}

function setFieldError(element, message) {
  clearFieldError(element);
  const container = element.closest('.field, fieldset');
  const errorId = `${element.id}-error`;
  const error = document.createElement('p');
  error.className = 'field__error';
  error.id = errorId;
  error.innerHTML = `${icon('i-alert', 'icon icon--xs')}<span></span>`;
  error.querySelector('span').textContent = message;
  // Pesan error tepat di bawah kontrolnya (NN/g: dekat sumber masalah).
  if (element.matches('fieldset')) element.querySelector('legend').insertAdjacentElement('afterend', error);
  else (element.closest('.input-group, .stepper') || element).insertAdjacentElement('afterend', error);
  element.setAttribute('aria-invalid', 'true');
  const described = new Set((element.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
  described.add(errorId);
  element.setAttribute('aria-describedby', [...described].join(' '));
}

export function validate(scope) {
  const summary = scope.querySelector('[data-error-summary]');
  const errors = [];
  scope.querySelectorAll('[data-required]').forEach((element) => {
    if (element.closest('[hidden]')) return;
    let ok;
    if (element.matches('fieldset')) ok = Boolean(element.querySelector('input:checked'));
    else if (element.matches('[data-numeric]')) {
      const value = element.dataset.value || '';
      ok = value !== '' && (!element.dataset.min || Number(value) >= Number(element.dataset.min));
    } else ok = element.value.trim() !== '';
    if (ok) clearFieldError(element);
    else errors.push({ element, message: element.dataset.requiredMessage || 'Wajib diisi.' });
  });
  errors.forEach(({ element, message }) => setFieldError(element, message));

  const useSummary = Boolean(summary) && errors.length >= 2;
  if (summary) {
    summary.hidden = !useSummary;
    if (useSummary) {
      summary.innerHTML = `<p class="error-summary__title" id="${summary.id}-title">Ada ${errors.length} hal yang perlu dilengkapi</p><ul class="stack stack--tight"></ul>`;
      const list = summary.querySelector('ul');
      errors.forEach(({ element, message }) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${controlOf(element).id}`;
        link.textContent = message;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          controlOf(element).focus();
        });
        item.append(link);
        list.append(item);
      });
      summary.focus();
    }
  }
  // Tanpa ringkasan (mis. di dalam baris), fokus langsung ke masalah pertama.
  if (errors.length && !useSummary) controlOf(errors[0].element).focus();
  return errors.length === 0;
}

function initFieldErrorClearing() {
  document.addEventListener('input', (event) => {
    if (event.target.matches?.('[data-required]')) clearFieldError(event.target);
  });
  document.addEventListener('change', (event) => {
    const fieldset = event.target.closest?.('fieldset[data-required]');
    if (fieldset) clearFieldError(fieldset);
  });
}

/* ---------- Draf di HP ---------- */

function serializeForm(form) {
  const data = {};
  for (const element of form.elements) {
    if (!element.name || element.type === 'file' || element.type === 'submit' || element.type === 'button') continue;
    if (element.type === 'radio') {
      if (element.checked) data[element.name] = element.value;
    } else if (element.type === 'checkbox') data[element.name] = element.checked;
    else if (element.matches('[data-numeric]')) data[element.name] = element.dataset.value || '';
    else data[element.name] = element.value;
  }
  return data;
}

function restoreDraft(form) {
  const saved = localStorage.getItem(DRAFT_PREFIX + form.dataset.draftKey);
  const status = form.querySelector('[data-draft-status]');
  if (!saved) {
    if (status) status.hidden = true;
    return;
  }
  const { data, savedAt } = JSON.parse(saved);
  for (const element of form.elements) {
    if (!element.name || !(element.name in data)) continue;
    if (element.type === 'radio') element.checked = element.value === data[element.name];
    else if (element.type === 'checkbox') element.checked = Boolean(data[element.name]);
    else if (element.matches('[data-numeric]')) setNumericValue(element, data[element.name], { silent: true });
    else element.value = data[element.name];
  }
  if (status) {
    status.hidden = false;
    status.querySelector('[data-draft-time]').textContent = timeLabel(new Date(savedAt));
  }
  form.dispatchEvent(new Event('km:restored', { bubbles: true }));
}

export function clearDraft(form) {
  localStorage.removeItem(DRAFT_PREFIX + form.dataset.draftKey);
  const status = form.querySelector('[data-draft-status]');
  if (status) status.hidden = true;
}

export function resetForm(form) {
  form.reset();
  form.querySelectorAll('input[data-numeric]').forEach((input) => setNumericValue(input, '', { silent: true }));
  form.querySelectorAll('.field__error, [data-paste-notice]').forEach((element) => element.remove());
  form.querySelectorAll('[aria-invalid]').forEach((element) => element.removeAttribute('aria-invalid'));
  form.querySelectorAll('[data-error-summary]').forEach((summary) => {
    summary.hidden = true;
  });
  updateShowWhen(form);
}

function initDrafts() {
  const timers = new WeakMap();
  const save = (form) => {
    clearTimeout(timers.get(form));
    timers.set(
      form,
      setTimeout(() => {
        const savedAt = new Date().toISOString();
        localStorage.setItem(DRAFT_PREFIX + form.dataset.draftKey, JSON.stringify({ savedAt, data: serializeForm(form) }));
        const status = form.querySelector('[data-draft-status]');
        if (status) {
          status.hidden = false;
          status.querySelector('[data-draft-time]').textContent = timeLabel(new Date(savedAt));
        }
      }, 300),
    );
  };
  document.addEventListener('input', (event) => {
    const form = event.target.closest?.('form[data-draft-key]');
    if (form) save(form);
  });
  document.addEventListener('change', (event) => {
    const form = event.target.closest?.('form[data-draft-key]');
    if (form) save(form);
  });
  document.querySelectorAll('form[data-draft-key]').forEach((form) => {
    if (!form.closest('dialog')) restoreDraft(form);
  });
}

/* ---------- Tinjau sebelum kirim ---------- */

function reviewText(form, name) {
  const element = form.elements[name];
  if (!element) return '—';
  if (element instanceof RadioNodeList) {
    const checked = [...element].find((option) => option.checked);
    if (!checked) return '—';
    if (checked.dataset.dateInput) {
      const dateValue = form.elements[checked.dataset.dateInput]?.value;
      if (!dateValue) return '—';
      return new Date(`${dateValue}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return checked.dataset.reviewText || document.querySelector(`label[for="${checked.id}"]`)?.textContent.trim() || checked.value;
  }
  if (element.tagName === 'SELECT') return element.selectedOptions[0]?.textContent.trim() || '—';
  if (element.type === 'file') return element.files?.length ? `${element.files.length} foto` : 'Tanpa foto';
  return element.value.trim() || '—';
}

export function fillReview(form, container) {
  container.querySelectorAll('[data-review-of]').forEach((slot) => {
    const text = reviewText(form, slot.dataset.reviewOf);
    slot.textContent = text === '—' && slot.dataset.reviewEmpty ? slot.dataset.reviewEmpty : text;
  });
  container.querySelectorAll('[data-review-terbilang]').forEach((slot) => {
    const input = form.elements[slot.dataset.reviewTerbilang];
    slot.textContent = terbilangRupiah(input?.dataset.value || '');
  });
  const warning = container.querySelector('[data-similar-warning]');
  if (warning && form.dataset.similar) {
    const purpose = (form.elements.keperluan?.value || '').trim().toLowerCase();
    const amount = form.elements.nominal?.dataset.value || '';
    const match = JSON.parse(form.dataset.similar).find((item) => item.keperluan === purpose && item.nominal === amount);
    warning.hidden = !match;
    if (match) warning.querySelector('[data-similar-text]').textContent = `Mirip ${match.keterangan}.`;
  }
}

function initReview() {
  document.addEventListener('km:step', (event) => {
    const sheet = event.target;
    const step = sheet.querySelector(`[data-step="${event.detail.step}"]`);
    const form = sheet.querySelector('form');
    if (form && step?.querySelector('[data-review-of]')) fillReview(form, step);
  });
}

/* ---------- Kirim formulir ---------- */

const submitHandlers = new Map();

/** Daftarkan aksi simpan per formulir (`data-submit`). Handler menerima form dan status koneksi. */
export function onSubmit(name, handler) {
  submitHandlers.set(name, handler);
}

function initSubmit() {
  document.addEventListener('submit', (event) => {
    const form = event.target;
    const handler = submitHandlers.get(form.dataset.submit);
    if (!handler) return;
    event.preventDefault();
    const scope = form.closest('dialog')?.querySelector(`[data-step="${form.closest('dialog').dataset.currentStep}"]`) || form;
    if (!validate(scope)) return;
    handler(form, { online: isOnline(), submitter: event.submitter });
  });
}

/* ---------- Mulai ---------- */

export function init() {
  if (localStorage.getItem('km.reduceEffects') === 'true') document.documentElement.classList.add('reduce-effects');
  initConnectivity();
  initNumericFields();
  initSmartHints();
  initShowWhen();
  initFieldErrorClearing();
  initDrafts();
  initReview();
  initSubmit();
  initDisclosures();
  initSheets();
  addEventListener('popstate', () => {
    syncSheetsWithUrl();
    syncDisclosuresWithUrl();
  });
}
