/**
 * Drives the mobile menu with real taps: open, navigate, close, Escape, and
 * confirms the page behind it is locked while it is open.
 *
 *   node scripts/check-mobile-menu.mjs
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

let failures = 0;
const check = (label, actual, expected) => {
  const ok = String(actual) === String(expected);
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}: ${actual}${ok ? '' : ` (expected ${expected})`}`);
};
const settle = () => new Promise((r) => setTimeout(r, 500));

for (const route of ['/', '/fr']) {
  console.log(`\n=== ${route} ===`);
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto(BASE + route, { waitUntil: 'networkidle0' });
  await settle();

  const dialog = () => page.$('[role="dialog"]');

  check('menu starts closed', !!(await dialog()), false);

  await page.tap('nav button[aria-expanded]');
  await settle();
  check('opens on tap', !!(await dialog()), true);

  check(
    'page scroll locked',
    await page.evaluate(() => getComputedStyle(document.body).overflow),
    'hidden',
  );

  const linkCount = await page.evaluate(
    () => document.querySelectorAll('[role="dialog"] nav a').length,
  );
  check('section links present', linkCount, 6);

  // Tapping a section link must close the sheet, or it covers the target.
  await page.evaluate(() => document.querySelector('[role="dialog"] nav a').click());
  await settle();
  check('closes after choosing a section', !!(await dialog()), false);
  check(
    'scroll restored',
    await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden'),
    true,
  );

  // Escape closes it too.
  await page.tap('nav button[aria-expanded]');
  await settle();
  await page.keyboard.press('Escape');
  await settle();
  check('closes on Escape', !!(await dialog()), false);

  // The CV inside the sheet follows the language.
  await page.tap('nav button[aria-expanded]');
  await settle();
  const cv = await page.evaluate(
    () => document.querySelector('[role="dialog"] a[href*="/cv/"]')?.getAttribute('href') ?? null,
  );
  check('CV link in sheet', cv, route === '/fr' ? '/cv/Achref_Lajmi_CV_FR.pdf' : '/cv/Achref_Lajmi_CV.pdf');

  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : '\nmobile menu works');
process.exit(failures ? 1 : 0);
