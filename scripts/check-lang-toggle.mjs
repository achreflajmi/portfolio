/**
 * Clicks the language toggle for real and asserts where it lands.
 *
 * Regression guard: the "remember my language" redirect used to re-fire on
 * every navigation, so EN -> / was instantly bounced back to /fr and the
 * toggle looked dead. An explicit click must always win.
 *
 *   node scripts/check-lang-toggle.mjs
 */
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.URL ?? 'http://localhost:5173';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  protocolTimeout: 120000,
  args: ['--hide-scrollbars'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

let failures = 0;

const settle = () => new Promise((r) => setTimeout(r, 700));

async function state() {
  return page.evaluate(() => ({
    path: location.pathname,
    lang: document.documentElement.lang,
    stored: (() => {
      try {
        return localStorage.getItem('al-lang');
      } catch {
        return null;
      }
    })(),
  }));
}

async function clickLang(code) {
  await page.evaluate((code) => {
    const href = code === 'fr' ? '/fr' : '/';
    const link = Array.from(document.querySelectorAll('nav a')).find(
      (a) => a.getAttribute('href') === href,
    );
    if (!link) throw new Error(`no toggle link for ${code}`);
    link.click();
  }, code);
  await settle();
}

function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}: ${actual}${ok ? '' : `  (expected ${expected})`}`);
}

console.log('1. land on English, switch to French');
await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
await settle();
await clickLang('fr');
let s = await state();
check('path', s.path, '/fr');
check('lang', s.lang, 'fr');

console.log('2. switch back to English — the regression');
await clickLang('en');
s = await state();
check('path', s.path, '/');
check('lang', s.lang, 'en');
check('stored preference', s.stored, 'en');

console.log('3. French, then reload — preference persists');
await clickLang('fr');
await page.reload({ waitUntil: 'networkidle0' });
await settle();
s = await state();
check('path', s.path, '/fr');
check('lang', s.lang, 'fr');

console.log('4. with fr remembered, a fresh visit to / redirects once');
await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
await settle();
s = await state();
check('path', s.path, '/fr');

console.log('5. and EN still works from there');
await clickLang('en');
s = await state();
check('path', s.path, '/');
check('lang', s.lang, 'en');

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : '\ntoggle works both ways');
process.exit(failures ? 1 : 0);
