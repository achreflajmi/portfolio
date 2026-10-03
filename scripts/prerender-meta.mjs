/**
 * Writes real HTML entry points for /fr and each article, with their own head.
 *
 * The site is a client-side SPA, and the crawlers that build share previews —
 * LinkedIn, Slack, WhatsApp, Facebook, X — do not run JavaScript. They read the
 * HTML exactly as served, so setting document.title at runtime does nothing for
 * them: every route would share the English head from index.html.
 *
 * Netlify serves a matching static file before it consults the SPA catch-all,
 * so emitting dist/fr/index.html and dist/writing/<slug>/index.html gives each
 * route a correct head while the app still boots and routes normally.
 *
 * Runs automatically after `vite build`.
 */
import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://achreflajmi.netlify.app';

/* Read the real post data rather than duplicating it here. */
async function loadPosts() {
  const out = join(DIST, '.posts.mjs');
  await build({
    entryPoints: [join(ROOT, 'src/lib/posts.ts')],
    outfile: out,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    logLevel: 'silent',
  });
  const mod = await import(pathToFileURL(out).href + `?t=${Date.now()}`);
  return mod.POSTS;
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Replace the value of a tag that already exists in the built head. */
function setMeta(html, selectorAttr, name, value) {
  const re = new RegExp(`(<meta\\s+${selectorAttr}="${name}"\\s+content=")[^"]*(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${esc(value)}$2`);
  // Some tags are emitted with content on the following line.
  const re2 = new RegExp(`(<meta\\s+${selectorAttr}="${name}"\\s*\\n?\\s*content=")[^"]*(")`, 'i');
  return html.replace(re2, `$1${esc(value)}$2`);
}

function rewrite(html, meta) {
  let out = html;

  out = out.replace(/<html lang="[^"]*"/i, `<html lang="${meta.lang}"`);
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${esc(meta.title)}</title>`);
  out = out.replace(
    /(<link rel="canonical" href=")[^"]*(")/i,
    `$1${esc(meta.canonical)}$2`,
  );

  out = setMeta(out, 'name', 'description', meta.description);
  out = setMeta(out, 'property', 'og:title', meta.title);
  out = setMeta(out, 'property', 'og:description', meta.description);
  out = setMeta(out, 'property', 'og:url', meta.canonical);
  out = setMeta(out, 'property', 'og:type', meta.type ?? 'website');
  out = setMeta(out, 'property', 'og:locale', meta.lang);
  out = setMeta(out, 'property', 'og:locale:alternate', meta.lang === 'fr' ? 'en' : 'fr');
  out = setMeta(out, 'property', 'og:image', meta.image);
  out = setMeta(out, 'property', 'og:image:alt', meta.imageAlt);
  out = setMeta(out, 'name', 'twitter:title', meta.title);
  out = setMeta(out, 'name', 'twitter:description', meta.description);
  out = setMeta(out, 'name', 'twitter:image', meta.image);

  if (meta.imageWidth) {
    out = setMeta(out, 'property', 'og:image:width', String(meta.imageWidth));
    out = setMeta(out, 'property', 'og:image:height', String(meta.imageHeight));
  }

  return out;
}

async function emit(routePath, html) {
  const file = join(DIST, routePath, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
  return `${routePath}/index.html`;
}

const base = await readFile(join(DIST, 'index.html'), 'utf8');
const written = [];

/* ── French home ── */
written.push(
  await emit(
    'fr',
    rewrite(base, {
      lang: 'fr',
      title: 'Achref Lajmi — Ingénieur backend, full-stack & IA appliquée',
      description:
        'Achref Lajmi, ingénieur logiciel à Berlin : backend, full-stack et IA appliquée. Je conçois des systèmes qui survivent au contact de la production.',
      canonical: `${ORIGIN}/fr`,
      image: `${ORIGIN}/img/og.jpg`,
      imageAlt: 'Achref Lajmi — des systèmes qui survivent au contact de la production.',
      imageWidth: 1200,
      imageHeight: 630,
    }),
  ),
);

/* ── Articles ── */
const posts = await loadPosts();
for (const post of posts) {
  written.push(
    await emit(
      `writing/${post.slug}`,
      rewrite(base, {
        lang: 'en',
        title: `${post.title} — Achref Lajmi`,
        description: post.excerpt,
        canonical: `${ORIGIN}/writing/${post.slug}`,
        type: 'article',
        image: `${ORIGIN}${post.cover}`,
        imageAlt: post.coverAlt,
        imageWidth: 1200,
        imageHeight: 675,
      }),
    ),
  );
}

/* ── Verify: every emitted page must differ from the English original ── */
let bad = 0;
for (const rel of written) {
  const html = await readFile(join(DIST, rel), 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
  const desc = html.match(/<meta\s+name="description"\s*\n?\s*content="([^"]*)"/i)?.[1] ?? '';
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] ?? '';
  const baseTitle = base.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
  const ok = title && title !== baseTitle && desc && canon !== `${ORIGIN}/`;
  if (!ok) bad++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${rel.padEnd(52)} "${title.slice(0, 56)}"`);
}

console.log(bad ? `\nprerender: ${bad} page(s) kept the default head` : `\nprerender: ${written.length} pages written`);
process.exit(bad ? 1 : 0);
