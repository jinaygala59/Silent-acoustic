#!/usr/bin/env node
/* Entry point. Run: node build.js
   Renders every page, robots.txt and sitemap.xml into this folder. */
const fs = require('fs');
const path = require('path');
const { SITE } = require('./src/content.js');
const built = require('./src/pages.js');

const today = new Date().toISOString().slice(0, 10);
const priority = f =>
  f === 'index.html' ? '1.0'
  : ['products.html', 'contact.html'].includes(f) ? '0.9'
  : f.startsWith('products/') ? '0.8'
  : '0.7';

const urls = built
  .filter(f => f !== '404.html')
  .map(f => `  <url>
    <loc>${SITE.url}/${f}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority(f)}</priority>
  </url>`).join('\n');

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

fs.writeFileSync(path.join(__dirname, 'robots.txt'),
`User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`);

console.log(`Built ${built.length} pages`);
built.forEach(f => console.log('  ' + f));
console.log('  sitemap.xml\n  robots.txt');
