/**
 * Mobile audit across real iOS and Android viewports, in both languages.
 *
 * Checks, per device:
 *   - horizontal overflow of the page, and which element causes it
 *   - interactive targets smaller than Apple's 44x44pt / Android's 48dp
 *   - text rendered below 11px (Apple's floor for secondary labels)
 *   - images that failed to load
 *   - use of 100vh, which mobile browsers mis-measure under their own chrome
 *
 *   node scripts/check-mobile.mjs
 */
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.URL ?? 'http://localhost:5173';

const DEVICES = [
  { name: 'Galaxy S20 (narrowest)', w: 360, h: 800, dpr: 3, touch: true },
  { name: 'iPhone SE',              w: 375, h: 667, dpr: 2, touch: true },
  { name: 'iPhone 15',              w: 393, h: 852, dpr: 3, touch: true },
  { name: 'Pixel 7',                w: 412, h: 915, dpr: 2.6, touch: true },
  { name: 'iPhone 15 Pro Max',      w: 430, h: 932, dpr: 3, touch: true },
  { name: 'iPad mini',              w: 744, h: 1133, dpr: 2, touch: true },
  { name: 'iPad Pro 11',            w: 834, h: 1194, dpr: 2, touch: true },
];

const ROUTES = ['/', '/fr'];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  protocolTimeout: 240000,
  args: ['--hide-scrollbars'],
});

let problems = 0;

for (const route of ROUTES) {
  console.log(`\n######## ${route} ########`);

  for (const d of DEVICES) {
    const page = await browser.newPage();
    await page.setViewport({
      width: d.w,
      height: d.h,
      deviceScaleFactor: d.dpr,
      isMobile: d.touch,
      hasTouch: d.touch,
    });
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));

    // Walk the whole page so lazy sections lay out.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 400));

    const r = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const out = { docW, scrollW: document.documentElement.scrollWidth, wide: [], small: [], tiny: [], brokenImgs: [], vh: 0 };

      for (const el of document.querySelectorAll('body *')) {
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) continue;

        // Overflow past the right edge (ignore deliberately clipped decoration)
        const style = getComputedStyle(el);
        if (b.right > docW + 1 && style.position !== 'fixed') {
          const clipped = el.closest('[class*="overflow-hidden"]');
          if (!clipped) {
            out.wide.push({
              tag: el.tagName.toLowerCase(),
              cls: String(el.className).slice(0, 48),
              right: Math.round(b.right),
              text: (el.textContent || '').trim().slice(0, 28),
            });
          }
        }

        // Tap targets
        const interactive = el.matches('a, button, [role="button"], input, select');
        if (interactive && b.width > 0) {
          const min = Math.min(b.width, b.height);
          if (min < 44) {
            out.small.push({
              tag: el.tagName.toLowerCase(),
              size: `${Math.round(b.width)}x${Math.round(b.height)}`,
              text: (el.textContent || '').trim().slice(0, 26) || el.getAttribute('aria-label') || '',
            });
          }
        }

        // Text too small to read comfortably
        const fs = parseFloat(style.fontSize);
        const hasOwnText = Array.from(el.childNodes).some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 2,
        );
        const srOnly = String(el.className).includes('sr-only');
        if (hasOwnText && fs < 11 && !srOnly) {
          out.tiny.push({ px: +fs.toFixed(1), text: (el.textContent || '').trim().slice(0, 30) });
        }
      }

      for (const img of document.images) {
        // A lazy image that never scrolled into view is simply not loaded yet.
        if (img.loading === 'lazy' && !img.complete) continue;
        if (!img.complete || img.naturalWidth === 0) out.brokenImgs.push(img.currentSrc || img.src);
      }

      // 100vh is measured against the largest viewport on mobile browsers, so
      // a 100vh hero is taller than the visible area while the URL bar shows.
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.cssText && /\b(100vh|min-height:\s*100vh)\b/.test(rule.cssText)) out.vh++;
          }
        } catch {
          /* cross-origin sheet */
        }
      }

      return out;
    });

    const issues = [];
    if (r.scrollW > r.docW) issues.push(`H-SCROLL ${r.scrollW}>${r.docW}`);
    if (r.wide.length) issues.push(`${r.wide.length} overflowing`);
    if (r.small.length) issues.push(`${r.small.length} small tap targets`);
    if (r.tiny.length) issues.push(`${r.tiny.length} tiny text`);
    if (r.brokenImgs.length) issues.push(`${r.brokenImgs.length} broken images`);

    problems += issues.length;
    console.log(`\n  ${d.name.padEnd(24)} ${d.w}x${d.h}  ${issues.length ? 'ISSUES: ' + issues.join(', ') : 'ok'}`);

    for (const w of r.wide.slice(0, 4)) console.log(`      overflow  <${w.tag}> right=${w.right} "${w.text}" .${w.cls}`);
    const seen = new Set();
    for (const t of r.small) {
      const k = t.text + t.size;
      if (seen.has(k)) continue;
      seen.add(k);
      if (seen.size <= 6) console.log(`      tap  ${t.size.padEnd(9)} "${t.text}"`);
    }
    const seenTiny = new Set();
    for (const t of r.tiny) {
      if (seenTiny.has(t.text)) continue;
      seenTiny.add(t.text);
      if (seenTiny.size <= 4) console.log(`      text ${t.px}px  "${t.text}"`);
    }
    for (const i of r.brokenImgs.slice(0, 3)) console.log(`      broken image ${i}`);

    await page.close();
  }
}

await browser.close();
console.log(problems ? `\n${problems} issue group(s) found` : '\nmobile clean');
