import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Lembar ABK disalin ke uang-kas.html; tes ini mencegah salinan menyimpang dari sumber di hari-ini.html.
test('lembar ABK di Uang Kas sama dengan sumber di Hari Ini', () => {
  const source = readFileSync(new URL('../screens/hari-ini.html', import.meta.url), 'utf8');
  const copy = readFileSync(new URL('../screens/uang-kas.html', import.meta.url), 'utf8');
  const canonical = source.slice(source.indexOf('  <!-- Lembar: Catat (menu ABK) -->'), source.indexOf('  <div class="keypad" data-keypad hidden></div>\n</body>')).trim();
  const copied = copy.slice(copy.indexOf('-->', copy.indexOf('ABK-SHEETS:START')) + 3, copy.indexOf('<!-- ABK-SHEETS:END -->')).trim();
  assert.equal(copied, canonical);
});
