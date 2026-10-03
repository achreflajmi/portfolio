/**
 * Verifies both language routes: the html lang attribute, that the headline
 * still breaks into exactly three single-line rows at every width, that no
 * English string leaks into the French page, and that the CV link follows.
 *
 *   node scripts/check-i18n.mjs
 */
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.URL ?? 'http://localhost:5173';

const WIDTHS = [390, 768, 1440];

/** Strings that must never appear on the French page. */
const EN_LEAKS = [
  'Download CV',
  'based in Berlin',
  'Where I studied',
  'Selected works',
  'Things I built',
  'Read the write-up',
  'Email me',
  'All rights reserved',
  'Academic foundation',
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  protocolTimeout: 180000,
  args: ['--hide-scrollbars'],
});

let failures = 0;

for (const route of ['/', '/fr']) {
  const expectLang = route === '/fr' ? 'fr' : 'en';
  console.log(`\n=== ${route} (expect lang="${expectLang}") ===`);

  for (const w of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));

    const r = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      scrollW: document.documentElement.scrollWidth,
      docW: document.documentElement.clientWidth,
      lines: Array.from(document.querySelectorAll('h1 > span')).map((el) => ({
        text: el.textContent.replace(/\s+/g, ' ').trim(),
        boxes: el.getClientRects().length,
      })),
      cv: document.querySelector('nav a[href*="/cv/"]')?.getAttribute('href') ?? null,
      body: document.body.innerText,
    }));

    const problems = [];
    if (r.lang !== expectLang) problems.push(`lang="${r.lang}"`);
    if (r.scrollW > r.docW) problems.push(`overflow ${r.scrollW}>${r.docW}`);
    for (const l of r.lines) if (l.boxes !== 1) problems.push(`"${l.text}" wrapped to ${l.boxes}`);
    if (r.lines.length !== 3) problems.push(`${r.lines.length} headline lines`);
    if (expectLang === 'fr') {
      if (r.cv && !r.cv.includes('_FR')) problems.push(`nav CV is ${r.cv}`);
      const haystack = r.body.toLowerCase();
      for (const leak of EN_LEAKS)
        if (haystack.includes(leak.toLowerCase())) problems.push(`EN leak: "${leak}"`);
    }

    failures += problems.length;
    console.log(
      `  ${w}px  ${problems.length ? 'FAIL  ' + problems.join('; ') : 'ok'}` +
        (problems.length ? '' : `   lines: ${r.lines.map((l) => l.text).join(' / ')}`),
    );

    await page.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} problem(s)` : '\nboth languages clean');
process.exit(failures ? 1 : 0);
