/* Static site generator for silenceacoustic.com
   Renders plain HTML into the project root. The output needs no runtime,
   no build step to host, and no dependencies — upload it anywhere. */

const fs = require('fs');
const path = require('path');
const C = require('./content.js');
const { SITE, NAV, CATEGORIES, PRODUCTS, SECTORS, PROCESS, TESTIMONIALS, PROJECTS, POSTS, FAQ } = C;

const ROOT = path.join(__dirname, '..');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* Type.
   The display face used to be a high-contrast editorial serif — considered,
   but it read as a fashion brand, not a fabrication shop. Archivo is a
   geometric grotesk built for signage and technical plates; it sits next to
   the mono labels as a colleague instead of a guest.

   Archivo           headlines and figures. One weight, still the point: a
                      display face is sized, not bolded.
   Instrument Sans    body and UI. Neutral enough to stay out of the way.
   IBM Plex Mono      labels, specs, buttons — now the dominant register
                      rather than a supporting one. */
const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..700&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap';

/* The real Silence Acoustic logo. Two lockups, each in a knockout variant:
   the header drops the tagline (it is illegible at 32px), the footer keeps it.
   Sources: silenceacoustic.com/wp-content/uploads/2026/05/for-website-01-scaled.png */
const LOGO_HEAD = (up) => `<img class="brand-logo" src="${up}assets/img/logo-mark.png" alt="Silence Acoustic" width="613" height="108" fetchpriority="high">`;
const LOGO_FOOT = (up) => `<img class="brand-logo-full" src="${up}assets/img/logo-full.png" alt="Silence Acoustic — Innovating Sound In A Better Way" width="947" height="168" loading="lazy">`;

const ARROW = '<svg class="btn-arrow" width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true"><path d="M8.4.6 12.3 4.5 8.4 8.4M12 4.5H.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* Runs before first paint, so the fallback reveal engine never flashes its
   content in and then hides it again.

   Browsers with native scroll timelines animate entirely in CSS and never take
   this branch. The rest get `html.io`, which is the *only* thing that hides
   anything — and it removes itself after six seconds unless motion.js has
   arrived and claimed responsibility. A blocked, failed or slow script
   therefore leaves a plain readable page, never an empty one. */
const HEAD_BOOT = `<script>(function(d){d.classList.remove('no-js');
try{if(!(window.CSS&&CSS.supports&&CSS.supports('animation-timeline','view()'))
&&'IntersectionObserver' in window
&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('io');
setTimeout(function(){if(!d.dataset.mo)d.classList.remove('io')},6000)}}catch(e){}
})(document.documentElement)</script>`;

const jsonLd = () => JSON.stringify({
  '@context': 'https://schema.org', '@type': 'LocalBusiness',
  name: SITE.name, url: SITE.url, telephone: SITE.phone, email: SITE.email,
  description: 'Acoustic treatment, acoustic panels and soundproofing. Design, manufacture and installation across India, from Mumbai.',
  address: { '@type': 'PostalAddress', streetAddress: `${SITE.addr1}, ${SITE.addr2}`, addressLocality: 'Mumbai', addressRegion: 'Maharashtra', postalCode: '400064', addressCountry: 'IN' },
  areaServed: 'IN', priceRange: '$$',
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '10:00', closes: '19:00' },
});

function header(active, depth) {
  const up = depth ? '../' : '';
  const links = NAV.map(n => {
    const cur = n.href === active ? ' aria-current="page"' : '';
    return `<a href="${up}${n.href}"${cur}>${n.label}</a>`;
  }).join('\n          ');
  return `<header class="site-head">
    <div class="wrap">
      <a class="brand" href="${up}index.html" aria-label="${SITE.name} — home">
        ${LOGO_HEAD(up)}
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu">
        <span class="nav-toggle-bars"></span>
      </button>
      <nav class="nav" id="nav" aria-label="Main">
          ${links}
          <a class="btn btn-primary" href="${up}contact.html">Book a survey ${ARROW}</a>
      </nav>
    </div>
  </header>`;
}

function footer(depth) {
  const up = depth ? '../' : '';
  const prodLinks = CATEGORIES.map(c => `<li><a href="${up}products.html#${c.id}">${c.name}</a></li>`).join('');
  const secLinks = SECTORS.slice(0, 6).map(s => `<li><a href="${up}projects.html">${s.name}</a></li>`).join('');
  const navLinks = NAV.slice(1).map(n => `<li><a href="${up}${n.href}">${n.label}</a></li>`).join('');
  return `<footer class="site-foot">
    <div class="wrap">
      <div class="foot-grid" data-stagger>
        <div data-anim="fade">
          <a class="brand" href="${up}index.html" aria-label="${SITE.name} — home">${LOGO_FOOT(up)}</a>
          <p class="foot-blurb">Acoustic design, treatment and soundproofing. Measured, manufactured and installed by our own team, from Mumbai across India.</p>
        </div>
        <div data-anim="fade">
          <h2 class="foot-h">Products</h2>
          <ul class="foot-list">${prodLinks}</ul>
        </div>
        <div data-anim="fade">
          <h2 class="foot-h">Rooms we treat</h2>
          <ul class="foot-list">${secLinks}</ul>
        </div>
        <div data-anim="fade">
          <h2 class="foot-h">Company</h2>
          <ul class="foot-list">${navLinks}</ul>
        </div>
        <div data-anim="fade">
          <h2 class="foot-h">Get in touch</h2>
          <ul class="foot-list">
            <li><a href="tel:${SITE.phoneHref}">${SITE.phone}</a></li>
            <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li><a href="mailto:${SITE.emailProjects}">${SITE.emailProjects}</a></li>
            <li style="margin-top:.4rem;line-height:1.5">${SITE.addr1}<br>${SITE.addr2}<br>${SITE.addr3}</li>
          </ul>
        </div>
      </div>
      <div class="foot-bar">
        <span>&copy; ${new Date().getFullYear()} ${SITE.name}</span>
        <span>Mumbai, India</span>
      </div>
    </div>
  </footer>`;
}

function page({ file, title, desc, active, body, depth = 0 }) {
  const up = depth ? '../' : '';
  const canonical = `${SITE.url}/${file}`;
  const html = `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#F8FAFC">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${up}assets/css/site.css">
<link rel="stylesheet" href="${up}assets/css/motion.css">
<link rel="icon" href="${up}assets/img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="${up}assets/img/favicon.png">
<meta property="og:image" content="${SITE.url}/assets/img/logo-full.png">
${HEAD_BOOT}
<script type="application/ld+json">${jsonLd()}</script>
</head>
<body>
<div class="progress" aria-hidden="true"><i></i></div>
<a class="skip" href="#main">Skip to content</a>
${header(active, depth)}
<main id="main">
${body}
</main>
${footer(depth)}
<script src="${up}assets/js/motion.js" defer></script>
<script src="${up}assets/js/site.js" defer></script>
</body>
</html>`;
  const out = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return file;
}

/* ------------------------------- partials ------------------------------- */

/* ------------------------------- the NRC bar -----------------------------
   The one signature device on the redesigned site. NRC is a coefficient
   between 0 and 1 that already means "this fraction of incident sound energy
   is absorbed", so drawing it as a proportion states exactly what the number
   states — it is not a decoration wrapped around a figure.

   It is drawn ONLY from a published NRC. Eight of the nineteen products carry
   one on the client's own product pages; the rest publish density, thickness
   or an STC instead. Where there is no figure, `nrcOf` returns null and the
   card shows nothing rather than a bar at an invented value. Do not "fill in"
   the missing eleven — see the content-provenance note in CLAUDE.md.

   Where a product publishes a range ("up to 0.6 (9 mm) / up to 0.85 (12 mm)")
   the bar takes the highest published figure, which is the one the sentence
   is about, and the caption keeps the client's own wording so the qualifier
   ("up to") is never dropped. */
const nrcOf = (p) => {
  const raw = p.specs && p.specs['NRC'];
  if (!raw) return null;
  const nums = String(raw).match(/\d?\.\d+/g);
  if (!nums) return null;
  const v = Math.max(...nums.map(Number));
  return (v > 0 && v <= 1) ? { v, raw: String(raw) } : null;
};

const MAT = { panels: 'pet', ceiling: 'cloud', foam: 'foam', wood: 'wood', proof: 'proof' };

const nrcBar = (p, cls = '') => {
  const n = nrcOf(p);
  if (!n) return '';
  const pct = Math.round(n.v * 100);
  return `<div class="nrc ${cls}" data-mat="${MAT[p.cat] || 'pet'}">
    <div class="nrc-track"><i style="--v:${pct}%"></i></div>
    <p class="nrc-fig"><b>${n.v.toFixed(2)}</b> <span class="nrc-unit">NRC</span><span class="nrc-raw">${esc(n.raw)}</span></p>
  </div>`;
};

/* --------------------------------- the ticker ----------------------------
   A port of replit.com's `LogoBlock__scroll` marquee: two identical runs side
   by side in a flex track, each translating -100% of its own width, so the
   loop is seamless without a JS measurement step.

   Theirs carries customer logos. We have no logo assets and inventing them is
   out of the question, so it carries what the client does publish — the names
   and cities of rooms they have finished, read out of PROJECTS. The slice is
   24 of 170, and it links to the gallery where all of them are listed.

   THE LABEL ON THE FIGURE IS LOAD-BEARING. `PROJECTS.length` is how many rooms
   are PHOTOGRAPHED here. Completed installations is `SITE.projectsCompleted`,
   which is 2035+. This footer read "170 rooms finished" for one commit, which
   is the same claim the "stop passing 170 off as the project count" pass had
   just removed from the rest of the site. If you want the completed figure
   here, use `SITE.projectsCompleted` — do not relabel this one.

   `aria-hidden` on the track is deliberate: it is a decorative repetition of
   content that the projects page presents properly, and a screen reader
   reading 48 names twice would be noise, not information. */
const TICK_N = 24;
const ticker = (base = '') => {
  const run = PROJECTS.slice(0, TICK_N)
    .map(p => `<li><span>${esc(p.n)}</span>${esc(p.l)}</li>`).join('');
  return `<div class="ticker" data-anim="fade">
      <div class="ticker-rail" aria-hidden="true">
        <div class="ticker-track">
          <ul class="ticker-run">${run}</ul>
          <ul class="ticker-run">${run}</ul>
        </div>
      </div>
      <p class="ticker-foot">${PROJECTS.length} rooms photographed <a class="tlink" href="${base}projects.html">See the gallery ${ARROW}</a></p>
    </div>`;
};

/* ------------------------------ the room index ---------------------------
   Ten room types as an index rather than a grid of ten equal cards. Each row
   carries the number of projects actually completed in that room type —
   counted from PROJECTS, never typed by hand, so it cannot drift — and links
   into the gallery with that filter already applied.

   `base` is '' on the projects page (a same-page hash) and 'projects.html' on
   the homepage. The hash is read by site.js on load and on hashchange. */
const roomdex = (base = 'projects.html') => `<ol class="roomdex" data-stagger="long">
      ${SECTORS.map(s => {
        const n = PROJECTS.filter(pr => pr.sec === s.name).length;
        const ex = PROJECTS.find(pr => pr.sec === s.name);
        return `<li class="rdx" data-anim="fade"><a href="${base}#room=${encodeURIComponent(s.name)}">
        <span class="rdx-swatch surface ${s.surf}" aria-hidden="true">${ex ? `<img src="assets/img/projects/${ex.s}.webp" alt="" width="760" height="507" loading="lazy" decoding="async">` : ''}</span>
        <span class="rdx-n" aria-hidden="true"></span>
        <span class="rdx-name">${esc(s.name)}</span>
        <span class="rdx-note">${esc(s.note)}</span>
        <span class="rdx-count">${n}<small> photographed</small></span>
      </a></li>`;
      }).join('\n      ')}
    </ol>`;

const productCard = (p, up = '') => `<a class="card" data-anim="rise" data-mat="${MAT[p.cat] || 'pet'}" href="${up}products/${p.slug}.html">
  <div class="card-surface surface ${p.surf}">
    <img src="${up}assets/img/products/${p.slug}-card.webp" alt="${esc(p.name)}" width="800" height="600" loading="lazy" decoding="async">
  </div>
  <div class="card-body">
    <span class="card-cat">${esc(CATEGORIES.find(c => c.id === p.cat).name)}</span>
    <h3>${esc(p.name)}</h3>
    <p>${esc(p.tag)}</p>
    ${nrcBar(p, 'nrc-sm')}
    <span class="card-foot">View spec ${ARROW}</span>
  </div>
</a>`;

/* The homepage catalogue.

   This used to be all nineteen product cards stacked down the page, which made
   the homepage eleven thousand pixels long and told a first-time visitor
   nothing about how the range is organised. It is now five family panels on a
   rail that travels sideways while the section is pinned — every product is
   still named, in a third of the height.

   The markup is a plain horizontal snap rail. The pin is added by motion.css
   only where it can be driven natively; narrow screens, unsupported browsers
   and reduced-motion users get the rail itself, which works fine. */
const famRail = () => `<section class="rail-sec" aria-labelledby="families">
  <div class="rail-sticky">
    <div class="wrap">
      <div class="rail-head">
        <div>
          <p class="eyebrow" data-anim="fade">${PRODUCTS.length} products, five families</p>
          <h2 id="families" data-anim="reveal">Everything we make and fit.</h2>
        </div>
        <p class="lead" data-anim="fade">Manufactured in our own facility in Mumbai. Custom sizes, colours, cut patterns and printing are standard work here, not a special request.</p>
      </div>
    </div>
    <div class="rail-viewport">
      <div class="rail-track">
        ${CATEGORIES.map((cat, i) => {
          const items = PRODUCTS.filter(p => p.cat === cat.id);
          return `<a class="fam" data-mat="${MAT[cat.id] || 'pet'}" href="products.html#${cat.id}">
          <div class="fam-surface surface ${cat.surf}">
            <img src="assets/img/products/${cat.img}-card.webp" alt="" width="800" height="600" loading="lazy" decoding="async">
          </div>
          <div class="fam-body">
            <span class="fam-n">${String(i + 1).padStart(2, '0')} &middot; ${items.length} products</span>
            <h3>${esc(cat.name)}</h3>
            <p class="fam-note">${esc(cat.note)}.</p>
            <span class="card-foot">See the family ${ARROW}</span>
          </div>
        </a>`;
        }).join('\n        ')}
        <a class="fam fam-all" href="products.html">
          <div class="fam-body">
            <span class="fam-n" style="color:inherit">The full catalogue</span>
            <h3>Every spec, in one place.</h3>
            <p class="fam-note">NRC, STC, thickness, fire rating and panel sizes for all ${PRODUCTS.length}.</p>
            <span class="card-foot">Open the catalogue ${ARROW}</span>
          </div>
        </a>
      </div>
    </div>
    <div class="wrap"><p class="rail-hint">Scroll sideways</p></div>
  </div>
</section>`;

const ctaBand = (up = '') => `<section class="cta-band">
  <div class="wrap">
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">Start here</p>
        <h2 data-anim="reveal">Tell us what the room is doing wrong.</h2>
      </div>
      <div class="stack stack-m">
        <p class="lead" data-anim="fade">Send the dimensions and what the space is used for. Clap once in the empty room and send us the voice note — that ten-second clip tells us more than most briefs do.</p>
        <div class="row" data-anim="fade">
          <a class="btn btn-primary" href="${up}contact.html">Book a free site survey ${ARROW}</a>
          <a class="btn btn-ghost" href="tel:${SITE.phoneHref}">${SITE.phone}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

module.exports = { ROOT, esc, ARROW, page, productCard, famRail, ctaBand, header, footer, nrcBar, nrcOf, roomdex, ticker };
