import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { serviceRoutes } from './src/data/services.js';

const routes = ['/', '/about', '/contact', ...serviceRoutes];

// Writes robots.txt and sitemap.xml into the build using VITE_SITE_URL.
function seoFiles(siteUrl) {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const urls = routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // PLACEHOLDER: set VITE_SITE_URL to the live domain before deploying.
  const siteUrl = (env.VITE_SITE_URL || 'https://www.example.com').replace(/\/$/, '');
  process.env.VITE_SITE_URL = siteUrl;

  return {
    plugins: [react(), seoFiles(siteUrl)],
  };
});
