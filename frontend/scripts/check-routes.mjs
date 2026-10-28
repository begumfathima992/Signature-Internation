// Renders every page and every service/sub-service route, and fails if any shows the 404 page.
// Also follows every internal link found on those pages, so dead links are caught too.
// Usage: npm run check:routes
import { createElement } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const NOT_FOUND = 'We can’t find that page';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
const { serviceRoutes } = await vite.ssrLoadModule('/src/data/services.js');

async function render(url) {
  const app = createElement(
    HelmetProvider,
    null,
    createElement(MemoryRouter, { initialEntries: [url] }, createElement(App)),
  );
  const { prelude } = await prerenderToNodeStream(app);
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}

function check(html) {
  const h1 =
    html
      .match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&#x27;/g, "'") ?? '';
  const title = html.match(/<title>(.*?)<\/title>/)?.[1].replace(/&amp;/g, '&') ?? '';
  return { ok: !html.includes(NOT_FOUND), h1, title };
}

const pages = ['/', '/about', '/contact', ...serviceRoutes];
const seen = new Map();
const linksChecked = new Set();
const failures = [];

async function visit(url, from) {
  const path = url.split(/[?#]/)[0] || '/';
  if (!seen.has(path)) {
    const html = await render(url);
    seen.set(path, { ...check(html), html });
    if (!seen.get(path).ok) failures.push(from ? `${path} (linked from ${from})` : path);
  }
  return seen.get(path);
}

for (const url of pages) {
  const { ok, title, html } = await visit(url);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${url.padEnd(72)} ${title}`);
  // Follow internal links on the page.
  for (const [, href] of html.matchAll(/<a [^>]*href="(\/[^"]*)"/g)) {
    linksChecked.add(href);
    await visit(href, url);
  }
}

// Unknown slugs must show the custom 404 page.
for (const url of ['/services/not-a-service', '/services/web-development/not-a-sub-service', '/no-such-page']) {
  const { ok } = check(await render(url));
  console.log(`${ok ? 'FAIL' : 'PASS'}  ${url.padEnd(72)} shows 404 page`);
  if (ok) failures.push(`${url} should show the 404 page`);
}

const linked = [...seen.keys()].filter((path) => !pages.includes(path));
console.log(
  `\n${pages.length} routes rendered. ${linksChecked.size} distinct internal links checked` +
    (linked.length
      ? `, including ${linked.length} not in the sitemap: ${linked.join(', ')}.`
      : ', all in the sitemap.'),
);
console.log(
  failures.length ? `\n${failures.length} problem(s):\n  ${failures.join('\n  ')}` : 'No dead links and no 404s.',
);
await vite.close();
process.exit(failures.length ? 1 : 0);
