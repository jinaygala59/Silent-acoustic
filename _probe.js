/* A logging static server. Serves the site AND records what a real device
   reports back, so the phone's environment lands in a file I can read
   instead of being read aloud. Gitignored; kill it when done. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = 4178, LOG = path.join(ROOT, '_probe.log');
const TYPES = { '.html':'text/html;charset=utf-8', '.css':'text/css', '.js':'text/javascript',
  '.webp':'image/webp', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg',
  '.ico':'image/x-icon', '.xml':'application/xml', '.txt':'text/plain', '.woff2':'font/woff2' };

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/beacon') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      const line = JSON.stringify({ at: new Date().toISOString(),
        ua: req.headers['user-agent'], q: Object.fromEntries(u.searchParams), body }) + '\n';
      fs.appendFileSync(LOG, line);
      res.writeHead(204, {'access-control-allow-origin':'*'}); res.end();
    });
    return;
  }
  let p = decodeURIComponent(u.pathname);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, {'content-type': TYPES[path.extname(f)] || 'application/octet-stream',
                      'cache-control': 'no-store'});
  fs.createReadStream(f).pipe(res);
}).listen(PORT, '0.0.0.0', () => console.log('probe server on ' + PORT));
