/* Minimal static server for local preview: node serve.js [port] */
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const PORT = Number(process.argv[2]) || Number(process.env.PORT) || 4177;
const TYPES = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2' };

http.createServer((req, res) => {
  // dev-only stub so the contact form's POST path can be exercised locally.
  // Not present in dist/ — serve.js is never deployed.
  if (req.url.startsWith('/__formtest')) {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      const fail = req.url.indexOf('fail') !== -1;
      res.writeHead(fail ? 500 : 200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: !fail, bytes: body.length }));
    });
    return;
  }

  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const alt = file + '.html';
    if (fs.existsSync(alt)) file = alt;
    else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.existsSync(path.join(ROOT, '404.html')) ? fs.readFileSync(path.join(ROOT, '404.html')) : 'Not found');
    }
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log('serving on http://localhost:' + PORT));
