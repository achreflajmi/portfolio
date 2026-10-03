/**
 * Serves dist/ the way Netlify does, which `vite preview` does not: a matching
 * static file wins over the SPA catch-all, so the prerendered /fr and article
 * entry points are actually served instead of index.html.
 *
 * Also applies the 301s from netlify.toml so old URLs can be checked.
 *
 *   node scripts/serve-like-netlify.mjs [port]
 */
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const DIST = resolve(import.meta.dirname, '..', 'dist');
const PORT = Number(process.argv[2] ?? 8888);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

/* Parse the 301 rules straight out of netlify.toml so the two cannot drift. */
const toml = await readFile(resolve(import.meta.dirname, '..', 'netlify.toml'), 'utf8');
const redirects = [];
for (const block of toml.split('[[redirects]]').slice(1)) {
  const from = block.match(/from\s*=\s*"([^"]*)"/)?.[1];
  const to = block.match(/to\s*=\s*"([^"]*)"/)?.[1];
  const status = Number(block.match(/status\s*=\s*(\d+)/)?.[1] ?? 200);
  if (from && to && status !== 200) redirects.push({ from, to, status });
}

const exists = async (p) => {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
};

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);

  const hit = redirects.find((r) => r.from === url);
  if (hit) {
    res.writeHead(hit.status, { Location: hit.to });
    return res.end();
  }

  // Netlify: a real file wins over the SPA catch-all.
  const candidates = [join(DIST, url), join(DIST, url, 'index.html'), join(DIST, `${url}.html`)];
  for (const file of candidates) {
    if (await exists(file)) {
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      return createReadStream(file).pipe(res);
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  createReadStream(join(DIST, 'index.html')).pipe(res);
}).listen(PORT, () => console.log(`netlify-like server on http://localhost:${PORT}`));
