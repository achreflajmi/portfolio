/**
 * Screenshots the hero at a set of widths and reports, per width, how many
 * line boxes each headline line actually occupies and whether anything
 * overflows horizontally. Run with the dev server up:
 *
 *   node scripts/shoot.mjs
 */
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = process.env.URL ?? 'http://localhost:5173/';
const OUT = resolve(process.argv[2] ?? './shots');
const WIDTHS = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1440, h: 900 },
];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  protocolTimeout: 180000,
  args: ['--hide-scrollbars', '--disable-gpu'],
});

for (const { w, h } of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });

  // Let the entrance animations settle; networkidle0 already covers decoding.
  await new Promise((r) => setTimeout(r, 2000));

  const report = await page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll('h1 > span'));
    const docW = document.documentElement.clientWidth;

    // Anything sticking out past the viewport horizontally.
    const overflowing = Array.from(document.querySelectorAll('header *, section#home *'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > docW + 1;
      })
      .slice(0, 6)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 45),
        right: Math.round(el.getBoundingClientRect().right),
        text: (el.textContent ?? '').trim().slice(0, 38),
      }));

    return {
      docW,
      scrollW: document.documentElement.scrollWidth,
      heroImgLoaded: (() => {
        const img = document.querySelector('section#home img');
        return img ? { complete: img.complete, w: img.naturalWidth, src: img.currentSrc.split('/').pop() } : null;
      })(),
      lines: lines.map((el) => ({
        text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 46),
        lineBoxes: el.getClientRects().length,
        fontPx: Math.round(parseFloat(getComputedStyle(el).fontSize)),
        widthPx: Math.round(el.getBoundingClientRect().width),
      })),
      overflowing,
    };
  });

  await page.screenshot({ path: `${OUT}/hero-${w}.png` });

  console.log(`\n=== ${w}x${h} ===`);
  console.log(`viewport ${report.docW}  scrollWidth ${report.scrollW}` +
    (report.scrollW > report.docW ? '   <-- HORIZONTAL OVERFLOW' : '   ok'));
  console.log('hero image:', JSON.stringify(report.heroImgLoaded));
  for (const l of report.lines) {
    const flag = l.lineBoxes === 1 ? 'ok' : `${l.lineBoxes} line boxes`;
    console.log(`  [${flag}] ${l.fontPx}px w=${l.widthPx}  "${l.text}"`);
  }
  if (report.overflowing.length) {
    console.log('  overflowing past viewport:');
    for (const o of report.overflowing) {
      console.log(`    <${o.tag}> right=${o.right} "${o.text}"  .${o.cls}`);
    }
  }

  await page.close();
}

await browser.close();
console.log(`\nshots -> ${OUT}`);
