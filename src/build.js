/* Static site generator for silenceacoustic.com
   Renders plain HTML into the project root. The output needs no runtime,
   no build step to host, and no dependencies — upload it anywhere. */

const fs = require('fs');
const path = require('path');
const C = require('./content.js');
const { SITE, NAV, CATEGORIES, PRODUCTS, SECTORS, PROCESS, TESTIMONIALS, PROJECTS, POSTS, FAQ } = C;

const ROOT = path.join(__dirname, '..');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ASSET FINGERPRINTS — why the stylesheets carry `?v=`.
   -------------------------------------------------------------------------
   vercel.json serves /assets/(css|js)/* with `max-age=2592000` and the
   filenames never change, so a browser that has been here before keeps its
   copy of site.css and site.js for THIRTY DAYS and never asks whether there
   is a newer one. The HTML revalidates every request (`max-age=0`), so the
   page is always current — and then it references the same five URLs the
   browser already has, and the reader sees the new markup wearing the old
   stylesheet. That is not a theoretical risk: it is why a design change can
   ship, be verified live with curl, and still not appear in the browser of
   anyone who visited the day before.

   The query string is the version. It changes only when the file's bytes
   change, so an edited stylesheet is fetched immediately and an untouched
   one keeps the full thirty days — the caching stays as aggressive as it was
   and stops being wrong. Eight hex characters of sha-256 is ample: these are
   cache keys, not signatures.

   A missing file yields no `?v=` rather than throwing, because a stale asset
   is a far smaller problem than a build that will not run. */
const fingerprints = new Map();
const asset = rel => {
  if (!fingerprints.has(rel)) {
    let v = '';
    try {
      v = require('crypto').createHash('sha256')
        .update(fs.readFileSync(path.join(ROOT, rel)))
        .digest('hex').slice(0, 8);
    } catch (e) {
      console.warn('  ! no fingerprint for ' + rel + ' (' + e.code + ') — serving it unversioned');
    }
    fingerprints.set(rel, v ? rel + '?v=' + v : rel);
  }
  return fingerprints.get(rel);
};

/* Type.
   The display face used to be a high-contrast editorial serif — considered,
   but it read as a fashion brand, not a fabrication shop. Archivo is a
   geometric grotesk built for signage and technical plates; it sits next to
   the mono labels as a colleague instead of a guest.

   Archivo           headlines and figures. One weight, still the point: a
   THE PAIRING IS INSTRUMENT SERIF + KARLA (the "Workshop" direction).

   Instrument Serif   display. One weight, one italic, no axes — which is the
                      whole point: hierarchy here is SIZE, not width or
                      weight. See the note in site.css about `--wd-*`, which
                      this face does not have and which are now inert.
   Karla              body, UI and labels. It carries `--mono` too, as Public
                      Sans did before it: the token name survives because 46
                      call sites use it, and columns of figures line up with
                      `font-variant-numeric: tabular-nums`, never a
                      monospaced face.

   CHANGE THIS AND site.css's --display/--body/--mono IN THE SAME EDIT.
   (Bricolage Grotesque + Public Sans, Archivo + Instrument Sans, and IBM
   Plex Sans + Mono were the previous pairings; all three references are
   stale.) */
/* THE PAIRING IS NOW OPEN SANS ALONE — the "architectural" direction, modelled
   on the layout language of glydearchitectural.com.au by request (dark bar,
   full-bleed photographic hero, tight bold headings over small tracked caps).
   Only the layout language was taken: no copy, imagery, logo or code. The
   accent stays the logo's cyan where that site uses gold. Instrument Serif +
   Karla ("Workshop") is the previous pairing and that reference is stale. */
const FONTS = 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap';

/* The real Silence Acoustic logo. Two lockups, each in a knockout variant.
   Source: silenceacoustic.com/wp-content/uploads/2026/05/for-website-01-scaled.png

   BOTH HEADER AND FOOTER NOW CARRY THE FULL LOCKUP, tagline included, by
   request — that is what the live site puts in its own header. The header
   used to take `logo-mark.png`, the same artwork with "Innovating Sound In A
   Better Way" cropped off, because the tagline is unreadable at the 32px the
   bar was drawn at. The fix is the bar, not the artwork: `.brand-logo` is
   44px now and the header padding was opened to match. If you shrink it
   back, go back to logo-mark.png rather than shipping an illegible line of
   type — logo-mark.png is kept in assets/img for exactly that. */
const LOGO_HEAD = (up) => `<img class="brand-logo" src="${up}${asset('assets/img/logo-full.png')}" alt="Silence Acoustic — Innovating Sound In A Better Way" width="947" height="168" fetchpriority="high">`;
const LOGO_FOOT = (up) => `<img class="brand-logo-full" src="${up}${asset('assets/img/logo-full.png')}" alt="Silence Acoustic — Innovating Sound In A Better Way" width="947" height="168" loading="lazy">`;

const ARROW = '<svg class="btn-arrow" width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true"><path d="M8.4.6 12.3 4.5 8.4 8.4M12 4.5H.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* Runs before first paint, so the fallback reveal engine never flashes its
   content in and then hides it again.

   Browsers with native scroll timelines animate entirely in CSS and never take
   this branch. The rest get `html.io`, which is the *only* thing that hides
   anything — and it removes itself after six seconds unless motion.js has
   arrived and claimed responsibility. A blocked, failed or slow script
   therefore leaves a plain readable page, never an empty one. */
/* Two hidden states, and both are armed the same way: only when JavaScript is
   running, and only for six seconds unless motion.js turns up and sets
   `dataset.mo`. A blocked, failed or slow script leaves a plain readable page.

   `io`    — no native scroll timelines. The full reveal vocabulary, driven by
             an IntersectionObserver in motion.js.
   `iomin` — the reader asked for reduced motion. OPACITY ONLY: no travel, no
             clip, no scale. Reduced motion means fewer and gentler, not zero,
             and a cross-fade is not vestibular motion — but nothing here may
             move, so this is a separate class rather than a variant of `io`.
             It is armed regardless of scroll-timeline support, because the
             native path is gated out under reduce anyway. */
const HEAD_BOOT = `<script>(function(d){d.classList.remove('no-js');
try{if(sessionStorage.getItem('g-curtain')){sessionStorage.removeItem('g-curtain');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('curtain-in');
setTimeout(function(){d.classList.remove('curtain-in')},1400)}}}catch(e){}
try{if(!('IntersectionObserver' in window))return;
var r=matchMedia('(prefers-reduced-motion: reduce)').matches;
var n=window.CSS&&CSS.supports&&CSS.supports('animation-timeline','view()');
var c=r?'iomin':(n?null:'io');
if(c){d.classList.add(c);
setTimeout(function(){if(!d.dataset.mo)d.classList.remove(c)},6000)}}catch(e){}
})(document.documentElement)</script>`;

const jsonLd = () => JSON.stringify({
  '@context': 'https://schema.org', '@type': 'LocalBusiness',
  name: SITE.name, url: SITE.url, telephone: SITE.phone, email: SITE.email,
  description: 'Acoustic treatment, acoustic panels and soundproofing. Design, manufacture and installation across India, from Mumbai.',
  /* Locality only, to match the footer. streetAddress and postalCode were
     here and are deliberately gone: the request was that the site show the
     city and state, and a street address in the page source is still
     published even though no visitor sees it. addr1/addr2 stay in content.js
     because the client's own contact details have not changed — only what
     this site broadcasts. Cost, stated plainly: a Google Business listing is
     matched partly on address, so a locality-only schema is weaker for local
     search than a full one. That was the trade asked for. */
  address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' },
  areaServed: 'IN', priceRange: '$$',
  /* NO openingHoursSpecification. It said Mon-Sat 10:00-19:00, which is the
     exact string src/content.js records as INVENTED and removed from the
     footer for that reason — it survived here because nobody looked in the
     structured data. Worse than on-page copy: a search engine can surface it
     as the business's hours, so a visitor is told the client is open at a
     time nobody verified. Restore it only when the client supplies the hours.
     The same test applies to anything else added to this block. */
});

function header(active, depth) {
  const up = depth ? '../' : '';
  const links = NAV.map(n => {
    const cur = n.href === active ? ' aria-current="page"' : '';
    return `<a href="${up}${n.href}"${cur}>${n.label}</a>`;
  }).join('\n          ');
  /* The utility bar carries contact routes only — every string in it is
     already published elsewhere on the site (SITE.phone / SITE.email). */
  return `<div class="topbar">
    <div class="wrap">
      <a href="tel:${SITE.phoneHref}">${SITE.phone}</a>
      <a href="mailto:${SITE.email}">${SITE.email}</a>
      <a href="${up}contact.html">Book a free site survey</a>
    </div>
  </div>
  <header class="site-head">
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

/* Social icons for the footer — simple monochrome glyphs drawn here on a
   24px grid, in currentColor (white), on a disc of each network's own
   colour (by request: "colorful icons"; the colours are in theme.css).
   They are pictograms of each network, not the networks' brand artwork. */
const SOCIAL_ICON = {
  facebook:  '<path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21z"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.15" fill="currentColor"/>',
  linkedin:  '<rect x="4" y="9" width="3.4" height="11" fill="currentColor"/><circle cx="5.7" cy="5.6" r="1.95" fill="currentColor"/><path fill="currentColor" d="M10 9h3.2v1.6c.5-.9 1.7-1.9 3.6-1.9 3.3 0 3.7 2.2 3.7 4.9V20h-3.4v-5.6c0-1.4 0-3-1.9-3s-2.2 1.4-2.2 2.9V20H10z"/>',
  youtube:   '<rect x="2.5" y="5.5" width="19" height="13" rx="3.5" fill="currentColor"/><path d="M10 9v6l5.2-3z" fill="var(--tri, #FF0000)"/>',
  x:         '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 4.5l14 15M19 4.5l-14 15"/>',
};
const socialRow = () => `<ul class="foot-social" aria-label="${SITE.name} on social media">
            ${SITE.social.map(s => `<li><a data-net="${s.id}" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.name} (opens in a new tab)"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">${SOCIAL_ICON[s.id] || ''}</svg></a></li>`).join('\n            ')}
          </ul>`;

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
            <li><a href="${SITE.waHref}" target="_blank" rel="noopener">WhatsApp ${SITE.wa}</a></li>
            <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li><a href="mailto:${SITE.emailProjects}">${SITE.emailProjects}</a></li>
            <li style="margin-top:.4rem;line-height:1.5">${SITE.addrShort}</li>
          </ul>
          ${socialRow()}
        </div>
        <!-- CERTIFIED. The client's own two certificates, supplied directly
             (1 Oct 2026). Alt text is read off each badge. Both images go
             through asset() like every other photograph. -->
        <div data-anim="fade">
          <h2 class="foot-h">Certified</h2>
          <ul class="foot-certs">
            <li><img src="${up}${asset('assets/img/certs/arai.webp')}" alt="ARAI certification" width="374" height="287" loading="lazy" decoding="async"></li>
            <li><img src="${up}${asset('assets/img/certs/cii-greenpro.webp')}" alt="CII GreenPro Certified Green Product, Boards and Panels 2026" width="282" height="282" loading="lazy" decoding="async"></li>
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
<meta name="theme-color" content="#1CABDE">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${up}${asset('assets/css/site.css')}">
<link rel="stylesheet" href="${up}${asset('assets/css/motion.css')}">
<link rel="stylesheet" href="${up}${asset('assets/css/theme.css')}">
<link rel="icon" href="${up}${asset('assets/img/favicon.png')}" type="image/png">
<link rel="apple-touch-icon" href="${up}${asset('assets/img/favicon.png')}">
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

<!-- Floating controls. Both appear together once the reader is a screen down;
     neither is in the way at the top, where the hero already has its own two
     calls to action. Left/right split so neither can sit under a thumb
     reaching for the other. -->
<div class="floats" aria-hidden="false">
  <button class="float float-top" type="button" aria-label="Back to top">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 19V6M6 12l6-6 6 6" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <a class="float float-wa" href="${SITE.waHref}" target="_blank" rel="noopener"
     aria-label="Chat with us on WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.2A9 9 0 1 0 12 3Z" fill="none"
            stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-1.4-.7-1 .8a5 5 0 0 1-2.2-2.2l.8-1L11 9.5c0-.5-.4-1-1-1s-1 .4-1 1Z"
            fill="currentColor"/>
    </svg>
  </a>
</div>
<script src="${up}${asset('assets/js/motion.js')}" defer></script>
<script src="${up}${asset('assets/js/site.js')}" defer></script>
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

/* ------------------------------ the room index ---------------------------
   Ten room types as an index rather than a grid of ten equal cards. Each row
   carries the number of projects actually completed in that room type —
   counted from PROJECTS, never typed by hand, so it cannot drift — and links
   into the gallery with that filter already applied.

   `base` is '' on the projects page (a same-page hash) and 'projects.html' on
   the homepage. The hash is read by site.js on load and on hashchange. */
const roomdex = (base = 'projects.html') => {
  /* Counted from PROJECTS at build time, never typed. That derivation is the
     reason this section exists as an index at all, so it outlives any layout
     put on top of it. */
  const rows = SECTORS.map(s => ({
    s, n: PROJECTS.filter(pr => pr.sec === s.name).length,
  }));
  const total = rows.reduce((a, r) => a + r.n, 0);

  /* The heading promises "a number to hit", so the number is the layout. No
     photographs here: they were tried at 4/3 and at 16/9 and both times the
     pictures were the size problem, and none of them showed the figure the
     row is actually about. The material swatch stays as a two-line colour
     cue — it is drawn in CSS, costs no request, and keeps the family
     temperatures the rest of the site uses. */
  return `<div class="rdx-table">
      <p class="rdx-cols" data-anim="fade">
        <span>Ten project types</span>
        <span>${total} rooms photographed</span>
      </p>
      <ol class="roomdex" data-stagger="long">
      ${rows.map(r => `<li class="rdx" data-anim="fade"><a href="${base}#room=${encodeURIComponent(r.s.name)}">
        <span class="rdx-fig">${r.n}</span>
        <span class="rdx-body">
          <span class="rdx-name">${esc(r.s.name)}</span>
          <span class="rdx-note">${esc(r.s.note)}</span>
        </span>
        <span class="rdx-swatch surface ${r.s.surf}" aria-hidden="true"></span>
      </a></li>`).join('\n      ')}
      </ol>
    </div>`;
};

const productCard = (p, up = '') => `<a class="card" data-anim="rise" data-mat="${MAT[p.cat] || 'pet'}" href="${up}products/${p.slug}.html">
  <div class="card-surface surface ${p.surf}${p.cut ? ' is-cut' : ''}">
    <img src="${up}${asset(`assets/img/products/${p.slug}-card.webp`)}" alt="${esc(p.name)}" width="800" height="600" loading="lazy" decoding="async">
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
   nothing about how the range is organised. It became five family panels on a
   rail that travels sideways while the section is pinned.

   IT IS PRODUCTS AGAIN NOW — ten of them — BY REQUEST, and the two things the
   client asked to lose are worth stating so they do not creep back:

     1. THE WORD "FAMILIES" IS GONE FROM THIS SECTION. Not the concept — the
        products page still groups by family and the filters still work — but
        the homepage no longer opens by asking a stranger to learn a taxonomy
        before they can see a panel. The eyebrow counts products.
     2. "MANUFACTURED IN OUR OWN FACILITY IN MUMBAI" IS GONE. That was a
        manufacturing claim, and the client does not want it published. The
        same claim was cut from the About page's bento in the same pass. Do
        not reinstate either without being asked.

   WHY TEN AND NOT NINETEEN. The rail's travel is `100vw - 100%` — it scales
   itself to whatever the track measures — but the scroll distance it is
   driven over does not, and nineteen cards need roughly 4800px of travel.
   Pinning a homepage section for five screens is not a rail, it is a
   detour. Ten cards plus the catalogue card sit at about 2100px, which is
   why `--rail-n` exists below.

   WHICH TEN IS DERIVED, NOT CHOSEN. Each family's own `img` field already
   names its most recognisable member — that pick was made once, in the data,
   when the family cards needed a photograph. This takes that product first
   and the next one in the family after it, two per family. Add a product to
   content.js and this stays correct on its own; change a family's `img` and
   the rail follows it.

   The card is `productCard()`, the same component the products page uses. It
   was tempting to keep the bespoke `.fam` markup and just retitle it, and
   that would have silently dropped the NRC bar and the material marker from
   ten cards — the two things that make this range look measured rather than
   decorative. The rail styles the shared card instead; see `.rail-track .card`
   in site.css.

   The markup is a plain horizontal snap rail. The pin is added by motion.css
   only where it can be driven natively; narrow screens, unsupported browsers
   and reduced-motion users get the rail itself, which works fine. */
const RAIL_PER_FAMILY = 2;
const railPicks = () => {
  const out = [];
  CATEGORIES.forEach(cat => {
    const items = PRODUCTS.filter(p => p.cat === cat.id);
    const lead = items.find(p => p.slug === cat.img);
    const rest = items.filter(p => p !== lead);
    out.push(...[lead, ...rest].filter(Boolean).slice(0, RAIL_PER_FAMILY));
  });
  return out;
};

const famRail = () => {
  const picks = railPicks();
  return `<section class="rail-sec" aria-labelledby="families" style="--rail-n:${picks.length + 1}">
  <div class="rail-sticky">
    <div class="wrap">
      <div class="rail-head">
        <div>
          <p class="eyebrow" data-anim="fade">${PRODUCTS.length} products</p>
          <h2 id="families" data-anim="reveal">Everything we make and fit.</h2>
        </div>
        <!-- CLIENT-SUPPLIED COPY, verbatim from the change brief. -->
        <p class="lead" data-anim="fade">Innovative acoustic products designed for superior sound absorption and effective acoustic control. Combining performance, durability, and aesthetics to create acoustically balanced environments.</p>
      </div>
    </div>
    <div class="rail-viewport">
      <div class="rail-track">
        ${picks.map(p => productCard(p)).join('\n        ')}
        <a class="fam fam-all" data-anim="rise" href="products.html">
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
};

const ctaBand = (up = '') => `<section class="cta-band g-tint">
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

module.exports = { ROOT, esc, ARROW, asset, page, productCard, famRail, railPicks, ctaBand, header, footer, nrcBar, nrcOf, roomdex, MAT };
