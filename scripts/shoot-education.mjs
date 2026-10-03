/**
 * Screenshots the Education section at phone, tablet and desktop widths and
 * reports how the graduation photo resolves at each.
 *
 *   node scripts/shoot-education.mjs
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.URL ?? 'http://localhost:8888';

mkdirSync('shots', { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  protocolTimeout: 200000,
  args: ['--hide-scrollbars'],
});

for (const [name, w, h] of [
  ['390', 390, 844],
  ['768', 768, 1024],
  ['1440', 1440, 900],
]) {
  const page = await browser.newPage();
  await page.setViewport({
    width: w,
    height: h,
    deviceScaleFactor: 2,
    isMobile: w < 500,
    hasTouch: w < 500,
  });
  await page.goto(BASE, { waitUntil: 'networkidle0' });

  // Walk the page so the lazy photo loads, then settle on the section.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  // The credential slides in on scroll; centre it so the animation completes
  // before capturing, otherwise the card is caught mid-transform.
  await page.evaluate(() =>
    document.querySelector('#education figure, #education h3')?.scrollIntoView({ block: 'center' }),
  );
  await new Promise((r) => setTimeout(r, 1400));
  await page.evaluate(() => window.scrollBy(0, 120));
  await new Promise((r) => setTimeout(r, 1400));

  const m = await page.evaluate(() => {
    const img = document.querySelector('#education img');
    const fig = document.querySelector('#education figure');
    if (!img) return null;
    const r = img.getBoundingClientRect();
    const order = [...document.querySelectorAll('#education figure, #education h3')].map((el) =>
      el.tagName.toLowerCase(),
    );
    return {
      src: img.currentSrc.split('/').pop(),
      nat: `${img.naturalWidth}x${img.naturalHeight}`,
      css: `${Math.round(r.width)}x${Math.round(r.height)}`,
      ratio: (r.width / r.height).toFixed(2),
      alt: img.alt,
      caption: fig?.querySelector('figcaption')?.textContent?.trim(),
      firstIsPhoto: order[0] === 'figure',
      loading: img.loading,
      decoding: img.decoding,
      hasDims: img.hasAttribute('width') && img.hasAttribute('height'),
    };
  });

  if (!m) {
    console.log(`  ${name}px  NO PHOTO RENDERED`);
  } else {
    console.log(
      `  ${name.padEnd(5)} ${m.src}  rendered ${m.css} (ratio ${m.ratio})  source ${m.nat}` +
        `  photo-first=${m.firstIsPhoto}  ${m.loading}/${m.decoding}  dims=${m.hasDims}`,
    );
  }

  const el = await page.$('#education');
  await el.screenshot({ path: `shots/edu-${name}.png` });
  await page.close();
}

await browser.close();
console.log('\nshots/edu-390.png, edu-768.png, edu-1440.png');
