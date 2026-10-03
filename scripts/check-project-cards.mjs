/**
 * The Projects section pins and pages through fixed-height cards, so adding a
 * bullet can silently push content out of the frame. This walks every scroll
 * slot at desktop width and reports any card whose content exceeds its frame.
 *
 *   node scripts/check-project-cards.mjs
 */
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = process.env.URL ?? 'http://localhost:5173/';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  protocolTimeout: 180000,
  args: ['--hide-scrollbars'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0' });

const total = await page.evaluate(() => {
  const pin = document.querySelector('#projects > div');
  return Math.round(pin.offsetHeight / (window.innerHeight * 0.9));
});

console.log(`scroll slots: ${total}`);
let bad = 0;

for (let slot = 0; slot < total; slot++) {
  await page.evaluate(
    (slot, total) => {
      const sec = document.querySelector('#projects');
      const pin = sec.querySelector(':scope > div');
      const range = pin.offsetHeight - window.innerHeight;
      window.scrollTo(0, pin.getBoundingClientRect().top + window.scrollY + range * ((slot + 0.5) / total));
    },
    slot,
    total,
  );
  await new Promise((r) => setTimeout(r, 900));

  const m = await page.evaluate(() => {
    const frames = Array.from(document.querySelectorAll('#projects div'))
      .filter((el) => el.clientHeight === 520 && el.querySelector('h3'));
    const frame = frames[0];
    if (!frame) return null;
    const card = frame.firstElementChild;
    return {
      title: card?.querySelector('h3')?.textContent?.trim() ?? '?',
      frameH: frame.clientHeight,
      contentH: card ? card.scrollHeight : 0,
    };
  });

  if (!m) {
    console.log(`slot ${slot}: no frame found`);
    continue;
  }
  const over = m.contentH > m.frameH;
  if (over) bad++;
  console.log(
    `${over ? 'OVERFLOW' : 'ok      '} slot ${slot}  frame=${m.frameH} content=${m.contentH}  "${m.title}"`,
  );
}

await browser.close();
console.log(bad ? `\n${bad} card(s) overflow their frame` : '\nall cards fit');
process.exit(bad ? 1 : 0);
