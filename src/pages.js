const C = require('./content.js');
const B = require('./build.js');
const { SITE, CLIENTS, BANNERS, FOUNDER, ABOUT_INTRO, VISION, NAV, CATEGORIES, PRODUCTS, SECTORS, PROCESS, TESTIMONIALS, PROJECTS, POSTS, FAQ } = C;
const { esc, ARROW, asset, page, productCard, railPicks, ctaBand, nrcBar } = B;

/* "20+ yrs" was typed, next to "since 2006" which is the client's published
   fact. Two ways of saying the same thing, one of which goes stale on its own:
   in 2027 the sentence is still right and the figure is not. It is derived
   now, so a rebuild is all it takes. Same arithmetic, no new claim — 2006 is
   theirs, the subtraction is ours. */
/* PROOF_N / TREAT_N ARE GONE. They counted the absorb/block split ("— 15 of
   our 19 products" / "— the other 4") for the two halves of the diptych, so
   the copy corrected itself when a product was added. The client replaced
   both paragraphs with their own text, which does not quote the split, and a
   derived constant nothing renders is worse than no constant. If a future
   line wants the figure back, it is two lines:
     const PROOF_N = C.PRODUCTS.filter(p => p.cat === 'proof').length;
     const TREAT_N = C.PRODUCTS.length - PROOF_N;
   — and it should be derived like that again, never typed. */

/* The same map `MAT` in src/build.js uses to put a material marker on a card.
   It is repeated rather than exported because the two are read in different
   files and a one-line map is cheaper to keep than an export; if a sixth
   family ever appears, both have to learn about it. */
const MATKEY = { panels: 'pet', ceiling: 'cloud', foam: 'foam', wood: 'wood', proof: 'proof' };

const FOUNDED = 2006;
const YEARS = new Date().getFullYear() - FOUNDED;

const built = [];

/* OUR VISION — renders only when the client's text is in content.js. */
const visionParas = [].concat(VISION.body || []).map(t => String(t).trim()).filter(Boolean);
const visionBand = () => visionParas.length ? `
<section class="dark g-vision" aria-labelledby="vision-h">
  <div class="wrap">
    <h2 id="vision-h" class="eyebrow center-eyebrow" data-anim="fade">Our vision</h2>
    ${visionParas.map((t, i) => `<p class="${i === 0 ? 'g-vision-lead' : 'muted g-vision-more'}" data-anim="fade">${esc(t)}</p>`).join('\n    ')}
  </div>
</section>` : '';


/* ------------------------------ selected work ----------------------------
   THE HOMEPAGE HAD NO PROJECT PHOTOGRAPHY AT ALL, and that is the single
   biggest reason it read as thin. The pinned choreography that was removed by
   request WAS the work section — four finished rooms and a link to the
   gallery — and the client wall took its slot. So the logos arrived and the
   work left with the animation, which nobody asked for. Measured on the
   rebuilt page: nine sections, and not one of the 170 project photographs
   appeared on any of them.

   This puts the work back without putting the pin back. It is the ordinary
   `.gal` component from the projects page — same markup, same feature tile,
   same lightbox link — so there is no new layout to maintain and a click
   through to the full gallery is one link away.

   WHICH NINE IS A RULE, NOT A TASTE. One project per room type, for every
   type the client has completed more than one of, ordered by how many they
   have done. Three things fall out of that and all three are deliberate:
   the range is visible (nine different kinds of room, not nine conference
   rooms), the feature tile is whatever they actually do most rather than
   whatever photographs best, and the count lands on nine — which is exactly
   what the 3-column grid wants, because the feature tile eats four cells and
   `4 + (n-1)` has to divide by three. Add projects and this stays correct on
   its own; the only way to break it is to give a tenth room type a second
   project, which moves the grid to twelve and wants three more tiles.

   Multiplex & Cinema is the one type left out, on one completed project. It
   is in the gallery, and the link below goes there. */
/* THE CLIENT LOGOS AS A SCROLL TICKER (by request, 30 Sep 2026 — a port of
   Motion+'s <Ticker offset={scrollY}> / {invertScroll} pattern). The fifty
   logos split into three rows; as the section passes, each row slides
   sideways with the scroll, alternate rows the other way. It is scroll-
   LINKED, not a looping marquee: stop scrolling and the rows stop.

   Each row carries its logos twice so a full-bleed row can never run out of
   plates on a wide screen; the second copy is aria-hidden with empty alts,
   so a screen reader hears fifty names once. The motion and the full-bleed
   rows exist ONLY in theme.css's scroll-timeline block. Without it (Firefox,
   Reduce Motion) `.client-row` and `.client-track` are `display: contents`,
   the duplicates are `display: none`, and the fifty fall back into the one
   auto-fit `.client-wall` grid they always were — nothing ever sits clipped
   off the edge of a strip that is not moving. */
const clientRows = () => {
  const ROWS = 3, per = Math.ceil(CLIENTS.length / ROWS);
  const plate = (c, dup) => `<li class="client"${dup ? ' aria-hidden="true" data-dup' : ''}><img src="${asset(`assets/img/marks/${c.s}.webp`)}" alt="${dup ? '' : esc(c.n)}" width="402" height="162" loading="lazy" decoding="async"></li>`;
  return `<div class="client-wall client-rows" data-anim="fade">
      ${Array.from({ length: ROWS }, (_, r) => CLIENTS.slice(r * per, (r + 1) * per)).map((row, r) => `<div class="client-row${r % 2 ? ' is-rev' : ''}">
        <ul class="client-track">
          ${row.map(c => plate(c, false)).join('\n          ')}
          ${row.map(c => plate(c, true)).join('\n          ')}
        </ul>
      </div>`).join('\n      ')}
    </div>`;
};

const workBand = () => {
  const counts = {};
  PROJECTS.forEach(pr => { counts[pr.sec] = (counts[pr.sec] || 0) + 1; });
  const picks = Object.keys(counts)
    .filter(sec => counts[sec] > 1)
    .sort((a, b) => counts[b] - counts[a])
    .map(sec => PROJECTS.find(pr => pr.sec === sec))
    .filter(Boolean);
  /* The feature tile is a 2x2 and the grid is three wide, so the tile count
     has to satisfy (4 + n - 1) % 3 === 0. Rather than trim to fit and show a
     silently different set, drop the section — a ragged final row on the
     homepage is worse than no section, and this makes the breakage loud. */
  /* The grid is a plain 3-up now (the reference layout has no feature tile),
     so the count has to divide by three. Same rule as before: drop the
     section rather than show a ragged row. */
  if (picks.length % 3 !== 0) return '';
  return `
<section class="g-work" aria-labelledby="work-h">
  <div class="wrap">
    <div class="g-work-head">
      <h2 id="work-h" class="eyebrow center-eyebrow" data-anim="fade">${esc(SITE.name)} projects</h2>
    </div>
    <ul class="g-proj" data-stagger>
      ${picks.map(pr => `<li class="g-pj" data-anim="open">
        <a href="projects.html#room=${encodeURIComponent(pr.sec)}">
          <span class="g-pj-img surface ${(SECTORS.find(x => x.name === pr.sec) || {}).surf || 's-plate'}">
            <img src="${asset(`assets/img/projects/${pr.s}.webp`)}" alt="${esc(pr.n)}${pr.l ? ', ' + esc(pr.l) : ''}" width="760" height="507" loading="lazy" decoding="async">
            <span class="g-pj-over" aria-hidden="true">
              <span class="g-pj-t">${esc(pr.n)}</span>
              <span class="g-pj-rule"></span>
              <span class="g-pj-btn">View</span>
            </span>
          </span>
          <span class="g-pj-cap">${esc(pr.n)}</span>
          <span class="g-pj-sub">${pr.l ? esc(pr.l) + ' &middot; ' : ''}${esc(pr.sec)}</span>
        </a>
      </li>`).join('\n      ')}
    </ul>
    <div class="row g-more center-row" data-anim="fade"><a class="btn btn-primary" href="projects.html">All ${PROJECTS.length} projects ${ARROW}</a></div>
  </div>
</section>`;
};


/* The client wall moved to the About page (a near-black logo strip there). */


/* =============================== HOME ==================================== */
/* THE FOUNDER BLOCK IS NOT A `.section-head.split`, AND THAT IS THE FIX FOR A
   REAL BUG. It was one: heading left, copy right. That shape is drawn for a
   heading and ONE lead paragraph, and `.section-head` sets `align-items: end`
   so the two columns meet at the bottom of the row. Drop three long
   paragraphs into the right column and the row becomes ~900px tall, the
   left column holds an eyebrow and a two-word name — and `end` pins that pair
   to the very bottom. The result was a screen-high empty field with the
   client's founder statement crammed into a narrow gutter down the right
   edge. It looked broken because it was.

   `.founder` is a shape of its own: the head runs full width at the top, the
   client's first paragraph runs under it as the lead, and the remaining two
   sit side by side. The band fills, the measure stays readable, and nothing
   is bottom-aligned. It adapts to the copy — one paragraph or five, it still
   works — which the split head could not. */

/* THE HERO HEADLINE ROTATES WITH THE PHOTOGRAPH, which is how the client's
   own site runs its hero, and porting their three banners without their
   captions would have stranded three sector labels on the cutting-room floor.
   Four things about `.hero-copy` are load-bearing:

   · ONLY THE FIRST SLIDE IS THE <h1>. The other two are <p class="hero-title">
     — same type, no heading semantics. Three h1s is the obvious way to build
     this and it is wrong: the page would carry three competing main headings
     and a screen reader would announce two that nobody can see. The h1 is the
     client's own first-slide line, so the page still has a real heading.
   · SLIDES TWO AND THREE ARE aria-hidden, permanently. Which one is on screen
     changes on a CSS animation, and CSS cannot update ARIA — so rather than
     let the accessibility tree drift out of step with the page, the rotating
     copy is decoration and the arrows announce the change themselves. That
     announcement is built in assets/js/site.js and reads the slide's own
     words, not "image 2 of 3".
   · The copy blocks are GRID-STACKED, not absolutely positioned, so the hero
     reserves the height of the LONGEST headline once and the lead and buttons
     below never move as the banner turns.
   · The load-in (.hl and [data-in]) belongs to slide one only. An entrance
     that fires once at page load and never again would read as a glitch on
     slides two and three; they cross-fade in already composed.

   The synchronisation between headline and photograph is two matched sets of
   keyframes in motion.css — same duration, same negative delays. Change one
   and you must change the other in the same edit. */
built.push(page({
  file: 'index.html', active: 'index.html',
  title: 'Silence Acoustic — Acoustic Treatment & Soundproofing, Mumbai',
  desc: 'Acoustic panels, ceilings, foam and soundproofing for auditoriums, studios, offices and homes. Designed, made and installed by our own team in Mumbai.',
  body: `
<section class="hero">
  <div class="hero-top">
  <div class="hero-media" aria-hidden="true">
    ${BANNERS.map((b, i) => `<div class="hero-slide"><img src="${asset(`assets/img/banners/${b.img}.webp`)}"
         alt="" width="${b.w}" height="${b.h}" ${i ? 'fetchpriority="low" loading="lazy"' : 'fetchpriority="high"'} decoding="async"></div>`).join('\n    ')}
  </div>
  <div class="wrap">
    <!-- The headline rotates with the photograph. Only slide one is the h1 —
         see the HOME note at the top of src/pages.js before editing. -->
    <div class="hero-copy">
      ${BANNERS.map((b, i) => {
        /* Architectural layout: the client's headline is set as two lines, a
           bold first half over a light second half, split at the word
           midpoint. The words and their order are untouched — this is
           typesetting, not copy. */
        const words = b.title.split(' ');
        const cut = Math.ceil(words.length / 2);
        const last = words.splice(cut).join(' ');
        /* THE REVERB-TAIL ECHOES ARE GONE. Two partly-opaque copies of the
           last word used to travel out from behind it on load. That was
           drawn for Bricolage Grotesque, where a clean geometric letterform
           trailing itself reads as a tail; in Instrument Serif's italic the
           same three copies read as a word printed twice slightly off
           register — a fault, not an effect. `.decay` itself stays: the
           italic last word in the banner mark is the better half of the idea
           and needs no animation to work. */
        const decay = `<span class="decay">${esc(last)}</span>`;
        const head = `<span class="hero-strong">${esc(words.join(' '))}</span> ${decay}`;
        return i === 0
          ? `<div class="hero-say is-on">
        <p class="eyebrow" data-in style="--d:60">${esc(b.sector)}</p>
        <h1 class="hero-title"><span class="hl"><span style="--d:160">${head}</span></span></h1>
      </div>`
          : `<div class="hero-say" aria-hidden="true">
        <p class="eyebrow">${esc(b.sector)}</p>
        <p class="hero-title">${head}</p>
      </div>`;
      }).join('\n      ')}
    </div>
    <div class="hero-foot">
      <span class="hero-rule" aria-hidden="true"></span>
      <div class="row hero-cta" data-in style="--d:520">
        <a class="btn btn-primary" href="contact.html">Book a free site survey ${ARROW}</a>
      </div>
    </div>
  </div>
  </div>
</section>

<!-- 1 · INTRO. Copy over a photograph that fills the right half. -->
<section class="g-intro" aria-labelledby="intro-h">
  <div class="g-intro-media" aria-hidden="true">
    <img src="${asset('assets/img/projects/z3-powai.webp')}" alt="" width="760" height="570" loading="lazy" decoding="async">
  </div>
  <div class="wrap">
    <div class="g-intro-copy">
      <p class="eyebrow" data-anim="fade">Acoustic treatment &amp; soundproofing &middot; Mumbai</p>
      <h2 id="intro-h" data-anim="reveal">${esc(SITE.name)}</h2>
      <p class="muted" data-anim="fade">${esc(FOUNDER.body[0])}</p>
      <div class="row" data-anim="fade"><a class="btn btn-primary" href="about.html">About us ${ARROW}</a></div>
    </div>
  </div>
</section>

<!-- COUNTERS. The client's own figures (SITE.stats), counting up as they
     scroll into view. Three of the four, as asked: Project Running is a
     one-week snapshot and stays off the homepage. -->
<section class="night g-count" aria-label="Silence Acoustic in numbers">
  <div class="wrap">
    <dl class="g-count-row">
      ${SITE.stats.filter(st => st.label !== 'Project Running').map(st => {
        const m = st.years ? null : String(st.v).match(/^(\d+)(.*)$/);
        const fig = st.years
          ? `<span class="tick" data-count-to="${YEARS}">${YEARS}</span>+`
          : m ? `<span class="tick" data-count-to="${m[1]}">${m[1]}</span>${esc(m[2])}` : esc(st.v);
        return `<div class="g-count-i" data-anim="fade"><dd>${fig}</dd><dt>${esc(st.label)}</dt></div>`;
      }).join('\n      ')}
    </dl>
  </div>
</section>

${visionBand()}

<!-- 2 · OUR PRODUCTS. Photograph tiles with a centred caption. Products, not
     families — see the rail note in CLAUDE.md; the ten are railPicks(). -->
<section class="g-products" aria-labelledby="products-h">
  <div class="wrap">
    <p class="eyebrow" data-anim="fade">${esc(SITE.name)}</p>
    <h2 id="products-h" data-anim="reveal">Our Products</h2>
    <!-- CAROUSEL. '.g-car-track' is a horizontal SCROLL CONTAINER, so nothing
         inside it may carry '[data-anim]': a 'view()' timeline cannot resolve
         in a scroller and the tile would sit at opacity 0 for good (the
         frozen-clock note in CLAUDE.md, which the family rail already hit
         once). The reveal is therefore on '.g-car', outside the scroller, and
         'data-stagger' came off with the per-tile reveals it used to delay.

         The row itself is native scroll-snap, not a JS-driven track: with
         site.js blocked this is still a draggable, snapping row of ten
         products. site.js only adds the arrows, the dots and the keyboard. -->
    <div class="g-car" data-carousel data-anim="rise"
         role="group" aria-roledescription="carousel" aria-label="Our products">
      <ul class="g-tiles g-car-track">
        ${railPicks().map(p => `<li class="g-tile"><a href="products/${p.slug}.html">
          <span class="g-tile-img surface ${p.surf}${p.cut ? ' is-cut' : ''}" data-mat="${MATKEY[p.cat] || 'pet'}">
            <img src="${asset(`assets/img/products/${p.slug}-card.webp`)}" alt="" width="800" height="600" loading="lazy" decoding="async">
            <span class="g-plus" aria-hidden="true">+</span>
          </span>
          <span class="g-tile-cap">${esc(p.name)}</span>
        </a></li>`).join('\n        ')}
      </ul>
    </div>
    <div class="row g-more" data-anim="fade"><a class="btn btn-ghost" href="products.html">All ${PRODUCTS.length} products ${ARROW}</a></div>
  </div>
</section>

<!-- 3 · WHY / WHERE. Heading left, a two-column list right. The list is the
     ten room types with completed-project counts, counted from PROJECTS. -->
<section class="g-why" aria-labelledby="why-h">
  <div class="wrap">
    <div class="g-why-head">
      <p class="eyebrow" data-anim="fade">Where we work</p>
      <h2 id="why-h" data-anim="reveal">Every project type has a number to hit.</h2>
      <!-- CLIENT-SUPPLIED COPY, verbatim from the change brief. -->
      <p class="muted" data-anim="fade">We cater to a wide range of spaces with customised acoustic and soundproofing solutions &mdash; from auditoriums and offices to studios, restaurants, homes, and commercial spaces.</p>
    </div>
    <ul class="g-checks" data-stagger>
      ${SECTORS.map(sec => {
        const n = PROJECTS.filter(pr => pr.sec === sec.name).length;
        return `<li data-anim="fade"><a href="projects.html#room=${encodeURIComponent(sec.name)}">
        <svg class="g-check" viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>
        <span><b>${esc(sec.name)}</b><small>${n} ${n === 1 ? 'project' : 'projects'}</small></span>
      </a></li>`;
      }).join('\n      ')}
    </ul>
  </div>
</section>

<!-- 3b · CAPACITY. A centred statement, on the same measurements as the (still
     empty) vision band so the page's two single-statement sections read as
     one shape rather than two near-misses.

     CLIENT-SUPPLIED COPY, verbatim from the brief of 30 Sep 2026 — heading
     and paragraph both. Nothing here was composed: see the provenance rule
     in CLAUDE.md, which is wider than specs and covers section copy too.

     '.light' puts it on #F3F4F7 between '.g-why''s white and the cyan band
     below, so the page keeps alternating grounds and no two neighbours are
     the same — read the sequence off the rendered background, not the class,
     and re-check it if this section moves. NOTE: no backticks in this
     comment; it lives inside a template literal and a backtick would end the
     string (it already did once). -->
<section class="light g-capacity" aria-labelledby="capacity-h">
  <div class="wrap">
    <p class="eyebrow" data-anim="fade">Capacity</p>
    <h2 id="capacity-h" data-anim="reveal">We Can Handle Multiple Projects Across Different Locations</h2>
    <p class="muted g-capacity-body" data-anim="fade">With a strong team, streamlined processes, and reliable project management, we have the capacity to execute multiple acoustic projects simultaneously across different locations. From site assessment and acoustic planning to material supply and professional installation, we ensure every project is delivered with consistent quality, attention to detail, and timely execution.</p>
  </div>
</section>

<!-- 4 · THE DARK BAND. Three columns: icon, capitals heading, paragraph.
     All three paragraphs are the client's own words (the diptych copy and
     the products lead from the change brief). The icons are drawn here. -->
<section class="night g-band" aria-label="What we do">
  <div class="wrap">
    <div class="g-cols" data-stagger>
      <a class="g-col" href="products.html#panels" data-anim="rise">
        <svg class="g-ico" viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M6 24h4M14 14v20M22 8v32M30 14v20M38 20v8M42 24h0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        <h3>Acoustic treatment</h3>
        <p>Transform your space with Acoustic Treatment designed to control sound, reduce echoes, and enhance clarity.</p>
        <span class="tlink">Panels, ceilings and foam ${ARROW}</span>
      </a>
      <a class="g-col" href="products.html#proof" data-anim="rise">
        <svg class="g-ico" viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M8 8h12v32H8zM28 8h12v32H28zM20 24h8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>
        <h3>Soundproofing</h3>
        <p>Effective Soundproofing minimises unwanted noise by preventing sound from entering or escaping a space.</p>
        <span class="tlink">Membranes, doors and windows ${ARROW}</span>
      </a>
      <a class="g-col" href="products.html" data-anim="rise">
        <svg class="g-ico" viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M6 6h16v16H6zM26 6h16v16H26zM6 26h16v16H6zM26 26h16v16H26z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>
        <h3>Acoustic products</h3>
        <p>Innovative acoustic products designed for superior sound absorption and effective acoustic control. Combining performance, durability, and aesthetics to create acoustically balanced environments.</p>
        <span class="tlink">The full catalogue ${ARROW}</span>
      </a>
    </div>
  </div>
</section>

${workBand()}

<!-- TESTIMONIALS — verbatim from TESTIMONIALS; monograms, never faces. -->
<section class="dark g-voices" aria-labelledby="voices-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow" data-anim="fade">In their words</p>
      <h2 id="voices-h" data-anim="reveal">What consultants and clients say.</h2>
    </div>
    <div class="reviews" data-stagger>
      ${TESTIMONIALS.map(t => `<figure class="review" data-anim="fade">
        <div class="review-head">
          <span class="review-avatar" aria-hidden="true">${esc(t.n.trim()[0].toUpperCase())}</span>
          <span class="review-who"><b>${esc(t.n)}</b><span>${esc(t.r)}</span></span>
        </div>
        <blockquote>${esc(t.q)}</blockquote>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- CLIENT LOGOS — CLIENTS, as on the client's own homepage. Headed with a
     plain label, "Our Clientele" (asked for 1 Oct 2026, replacing "50
     clients"), and nothing else is said about them (see the provenance rule). -->
<section class="night g-clients" aria-labelledby="clients-home-h">
  <div class="wrap">
    <h2 id="clients-home-h" class="eyebrow center-eyebrow on-night clients-title" data-anim="fade">Our Clientele</h2>
    ${clientRows()}
  </div>
</section>`
}));


/* ============================ INNER PAGES ================================
   Every inner page follows the reference layout (glydearchitectural.com.au),
   by request: no dark title banner — each page opens on a LIGHT intro
   (eyebrow, large title, lead, optionally a photograph beside it), then
   alternating grey / white sections, near-black bands for columns of short
   items, and the accent-tinted contact band at the foot (`ctaBand()`).
   Only the layout was taken. All copy below was already on this site. */

/* The light page intro. `img` puts a photograph in the right half. */
const gHead = ({ eyebrow, h1, lead = '', img = '', imgAlt = '', extra = '', center = false, up = '' }) => `
<section class="g-head${img ? ' has-img' : ''}${center ? ' is-center' : ''}">
  <div class="wrap">
    <div class="g-head-copy">
      <p class="eyebrow" data-in style="--d:60">${eyebrow}</p>
      <h1 data-in style="--d:170">${h1}</h1>
      ${lead ? `<p class="lead" data-in style="--d:280">${lead}</p>` : ''}
      ${extra}
    </div>
    ${img ? `<div class="g-head-media" data-in style="--d:240"><img src="${up}${img}" alt="${esc(imgAlt)}" width="760" height="570" fetchpriority="high" decoding="async"></div>` : ''}
  </div>
</section>`;

const checkIco = '<svg class="g-check" viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>';

/* Project tiles with the hover veil. On the projects page they are also the
   gallery: `#gal`, `[data-sector]`, `.gal-zoom` and `.gal-cap` are the hooks
   the filter and the lightbox in site.js read — keep all four. */
const projTile = (pr, up = '') => `<li class="g-pj" data-anim="open" data-sector="${esc(pr.sec)}">
        <a class="gal-zoom" href="${up}${asset(`assets/img/projects/${pr.s}.webp`)}" aria-label="View the photograph of ${esc(pr.n)} at full size">
          <span class="g-pj-img surface ${(SECTORS.find(x => x.name === pr.sec) || {}).surf || 's-plate'}">
            <img src="${up}${asset(`assets/img/projects/${pr.s}.webp`)}" alt="${esc(pr.n)}${pr.l ? ', ' + esc(pr.l) : ''}" width="760" height="507" loading="lazy" decoding="async">
            <span class="g-pj-over" aria-hidden="true">
              <span class="g-pj-t">${esc(pr.n)}</span>
              <span class="g-pj-rule"></span>
              <span class="g-pj-btn">View</span>
            </span>
          </span>
        </a>
        <div class="gal-cap">
          <h3 class="g-pj-cap">${esc(pr.n)}</h3>
          <p class="g-pj-sub">${pr.l ? esc(pr.l) + ' &middot; ' : ''}${esc(pr.sec)}</p>
        </div>
      </li>`;

/* ============================= PRODUCTS INDEX ============================ */
/* THE PAGE-HEAD LEAD IS A COUNT AND NOTHING ELSE, deliberately — the client's
   /our-products page carries no lead copy, and the old one repeated the
   removed manufacturing claim. See the provenance section of CLAUDE.md.
   (A JS comment, not an HTML one: an HTML comment would ship the removed
   sentence in the page source.) The family grouping is this page's
   navigation and is kept.

   The reference category page opens on a strip of three photographs. These
   are the first three products whose own shot is a photograph of a fitted
   room rather than a cut-out — derived from `cut`, not chosen. */
const stripPicks = PRODUCTS.filter(p => !p.cut).slice(0, 3);
built.push(page({
  file: 'products.html', active: 'products.html',
  title: 'Acoustic Panels & Soundproofing Products | Silence Acoustic',
  desc: '19 acoustic products: PET panels, ceiling clouds and baffles, foam, wood wool, slats, mass-loaded vinyl, soundproof doors and windows. Made in Mumbai.',
  body: `
<div class="g-strip" aria-hidden="true">
  ${stripPicks.map((p, i) => `<div class="g-strip-i"><img src="${asset(`assets/img/products/${p.slug}-hero.webp`)}" alt="" width="1600" height="1000" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"></div>`).join('\n  ')}
</div>
${gHead({
  eyebrow: 'Catalogue', h1: 'Products', lead: `${PRODUCTS.length} products.`, center: true,
  extra: `<nav class="fampick" data-in style="--d:390" aria-label="Jump to a product family">
      ${CATEGORIES.map(c => `<a href="#${c.id}">${esc(c.name)} <b>${PRODUCTS.filter(p => p.cat === c.id).length}</b></a>`).join('\n      ')}
    </nav>`,
})}

${CATEGORIES.map((cat, i) => `
<section class="${i % 2 ? 'dark' : 'light'} railed" id="${cat.id}">
  <div class="wrap">
    <span class="rail-label">${esc(cat.name)}</span>
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">${PRODUCTS.filter(p => p.cat === cat.id).length} products</p>
        <h2 data-anim="reveal">${esc(cat.name)}</h2>
      </div>
      <p class="lead" data-anim="fade">${esc(cat.note)}.</p>
    </div>
    <div class="grid g3 cat-grid" data-stagger>${PRODUCTS.filter(p => p.cat === cat.id).map(p => productCard(p)).join('\n')}</div>
  </div>
</section>`).join('')}

<section class="night">
  <div class="wrap">
    <div class="grid g2" data-stagger style="align-items:start;gap:clamp(2rem,5vw,4.5rem)">
      <div class="stack stack-m">
        <p class="eyebrow" data-anim="fade">Which family do you need</p>
        <h2 data-anim="reveal">Absorb, block, or both</h2>
        <p class="muted" style="max-width:var(--measure)">Panels, ceilings, foam and wood all <em>absorb</em> — they change how the room you are standing in sounds. Membranes, doors and windows <em>block</em> — they stop sound moving between two rooms. Most real projects need some of each, and the split is the first thing our survey settles.</p>
      </div>
      <div>
        <table class="spec" data-anim="fade">
          <caption>Quick guide</caption>
          <tbody>
            <tr><th>Room echoes, calls sound hollow</th><td>Panels or ceilings</td></tr>
            <tr><th>Critical listening, small room</th><td>Foam + traps</td></tr>
            <tr><th>Needs to look like an interior</th><td>Wood or designer</td></tr>
            <tr><th>High, hard, noisy volume</th><td>Baffles</td></tr>
            <tr><th>Noise from next door or outside</th><td>Soundproofing</td></tr>
          </tbody>
        </table>
        <p class="muted" style="font-size:.8125rem;margin-top:1.25rem;line-height:1.5;max-width:var(--measure)">Every figure on the product pages is Silence Acoustic&rsquo;s own published specification. We confirm them against your project and supply test reports on request.</p>
      </div>
    </div>
  </div>
</section>

${ctaBand()}`
}));

/* ============================ PRODUCT DETAIL ============================= */
/* Reference product-page order: photographic intro · white overview ·
   near-black band of short items · technical information · related.
   The intro puts the product's OWN photograph beside the copy on the
   near-black ground rather than under it: twelve of the nineteen shots are
   cut-outs on white, which cannot sit full-bleed behind type, and a room
   photograph from the gallery would imply an installation nobody claimed. */
PRODUCTS.forEach(p => {
  const cat = CATEGORIES.find(c => c.id === p.cat);
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.slug !== p.slug).slice(0, 3);
  built.push(page({
    file: `products/${p.slug}.html`, active: 'products.html', depth: 1,
    title: `${p.name} | Silence Acoustic, Mumbai`,
    desc: `${p.name}: ${p.tag}. Supplied and installed across India by Silence Acoustic, Mumbai.`,
    body: `
<section class="night pd-top">
  <div class="wrap">
    <div class="pd-top-grid">
      <div class="pd-top-copy">
        <p class="eyebrow" data-in style="--d:60">${esc(cat.name)}</p>
        <h1 data-in style="--d:170">${esc(p.name)}</h1>
        <p class="lead" data-in style="--d:280">${esc(p.tag)}</p>
        ${nrcBar(p, 'nrc-lead')}
        <div class="row" data-in style="--d:360;margin-top:2rem">
          <a class="btn btn-primary" href="../contact.html">Request a quote ${ARROW}</a>
          <a class="btn btn-ghost" href="tel:${SITE.phoneHref}">${SITE.phone}</a>
        </div>
        <nav class="crumbs" data-in style="--d:420" aria-label="Breadcrumb">
          <a href="../index.html">Home</a><span aria-hidden="true">/</span>
          <a href="../products.html">Products</a><span aria-hidden="true">/</span>
          <a href="../products.html#${cat.id}">${esc(cat.name)}</a><span aria-hidden="true">/</span>
          <span>${esc(p.name)}</span>
        </nav>
      </div>
      <!-- data-mat resolves the material colour for the .is-cut mount. -->
      <div class="pd-hero surface ${p.surf}${p.cut ? ' is-cut' : ''}" data-mat="${MATKEY[p.cat] || 'pet'}" data-anim="frame">
        <img src="../${asset(`assets/img/products/${p.slug}-hero.webp`)}" alt="${esc(p.name)}" width="1600" height="1000" fetchpriority="high" decoding="async">
      </div>
    </div>
  </div>
</section>

<section class="dark">
  <div class="wrap">
    <div class="pd-over${p.shots && p.shots.length ? ' has-shots' : ''}">
      <div class="pd-body">
        <p class="eyebrow" data-anim="fade">Overview</p>
        <h2 data-anim="reveal">${esc(p.name)}</h2>
        <p class="lead" style="color:var(--on-light)">${esc(p.lead)}</p>
        ${p.body.map(t => `<p>${esc(t)}</p>`).join('\n        ')}
      </div>
      ${p.shots && p.shots.length ? `<div class="pd-gallery">${p.shots.map((n, i) => `<figure class="pd-shot" data-anim="open"><img src="../${asset(`assets/img/products/${p.slug}-${n}.webp`)}" alt="${esc(p.name)} — view ${i + 2}" width="800" height="600" loading="lazy" decoding="async"></figure>`).join('')}</div>` : ''}
    </div>
  </div>
</section>

<section class="night g-band">
  <div class="wrap">
    <p class="eyebrow" data-anim="fade">Typical applications</p>
    <ul class="g-apps" data-stagger>
      ${p.apps.map(a => `<li data-anim="fade">${checkIco}<span>${esc(a)}</span></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="light">
  <div class="wrap">
    <div class="pd-tech">
      <div>
        <p class="eyebrow" data-anim="fade">Technical information</p>
        <h2 data-anim="reveal">Specification</h2>
        <p class="muted" style="font-size:.9375rem;margin-top:1.25rem;line-height:1.6;max-width:34ch">Figures as published by Silence Acoustic. We confirm them against your specification and supply test reports on request.</p>
      </div>
      <table class="spec">
        <caption class="vh">Specification</caption>
        <tbody data-stagger="long">
          ${Object.entries(p.specs).map(([k, v]) => `<tr data-anim="fade"><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
  </div>
</section>

${related.length ? `<section class="dark pd-related">
  <div class="wrap">
    <p class="eyebrow" data-anim="fade">${esc(cat.name)}</p>
    <h2 class="mb-l" data-anim="reveal">Others in ${esc(cat.name)}</h2>
    <div class="grid g3" data-stagger>${related.map(r => productCard(r, '../')).join('\n')}</div>
  </div>
</section>` : ''}

${ctaBand('../')}`
  }));
});

/* =============================== PROJECTS =============================== */
built.push(page({
  file: 'projects.html', active: 'projects.html',
  title: 'Projects & Room Types | Silence Acoustic',
  desc: 'Acoustic treatment for auditoriums, recording studios, offices, schools, sports halls, hotels and home theatres. Each room designed to its own target.',
  body: `
${gHead({
  eyebrow: 'Selected work', h1: 'Projects',
  lead: `${SITE.projectsCompleted} completed installations across ten room types, ${PROJECTS.length} of them photographed here — from Ravindra Natya Mandir and Sena Bhavan to corporate floors for Accenture, Microsoft and Bajaj, and recording studios across Mumbai.`,
})}

<section class="light">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter projects by room type">
      <button class="filter" type="button" data-filter="all" aria-pressed="true">All &middot; ${PROJECTS.length}</button>
      ${SECTORS.map(sec => {
        const n = PROJECTS.filter(pr => pr.sec === sec.name).length;
        return n ? `<button class="filter" type="button" data-filter="${esc(sec.name)}" aria-pressed="false">${esc(sec.name)} &middot; ${n}</button>` : '';
      }).filter(Boolean).join('\n      ')}
    </div>
    <ul class="g-proj" id="gal" data-stagger>
      ${PROJECTS.map(pr => projTile(pr)).join('\n      ')}
    </ul>
    <p class="form-status" id="gal-count" role="status" aria-live="polite" style="margin-top:1.5rem"></p>
  </div>
</section>

<section class="dark">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow" data-anim="fade">In their words</p>
      <h2 data-anim="reveal">What consultants and clients say.</h2>
    </div>
    <div class="reviews" data-stagger>
      ${TESTIMONIALS.map(t => `<figure class="review" data-anim="fade">
        <div class="review-head">
          <span class="review-avatar" aria-hidden="true">${esc(t.n.trim()[0].toUpperCase())}</span>
          <span class="review-who"><b>${esc(t.n)}</b><span>${esc(t.r)}</span></span>
        </div>
        <blockquote>${esc(t.q)}</blockquote>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand()}`
}));

/* ================================= ABOUT ================================ */
/* TWO BENTO TILES WERE REMOVED BY REQUEST and are not coming back on their
   own (in-house manufacturing; re-measuring every room after handover). The
   "We make it / We fit it" captions under the two photographs went for the
   same reason when the page took the reference layout: the first asserted
   manufacturing. JS comment, not HTML, so the claim is not in the source.

   Reference about-page order: story + photographs on grey · a near-black
   strip of logos · a two-part story with figures · the contact band. */
built.push(page({
  file: 'about.html', active: 'about.html',
  title: 'About Silence Acoustic — Acoustics, Mumbai',
  desc: 'Two decades of expertise in acoustic products and solutions. Acoustic treatment, soundproofing and high-performance acoustic products across offices, auditoriums, studios and hospitality, with 2035+ projects delivered across India.',
  body: `
<section class="light g-story">
  <div class="wrap">
    <div class="g-story-grid">
      <div class="stack stack-m">
        <p class="eyebrow" data-in style="--d:60">About &middot; since ${FOUNDED}</p>
        <h1 data-in style="--d:170">${esc(ABOUT_INTRO.h1)}</h1>
        <!-- CLIENT-SUPPLIED COPY. Split only where their own sentences end. -->
        ${ABOUT_INTRO.body.split(/(?<=\.)\s+(?=With 2,035|From offices|Our commitment)/).map(para => `<p class="muted" data-in style="--d:280">${esc(para)}</p>`).join('\n        ')}
      </div>
      <!-- One photograph, supplied directly on 1 Oct 2026 for this spot ("beside
           two decades"); it replaced the slat-panel and UPL Metro pair. -->
      <div class="g-story-media is-single">
        <div class="surface s-plate" data-anim="open">
          <img src="${asset('assets/img/about/recording-studio-control-room.webp')}" alt="A recording studio control room in blue light, looking through the observation window into the vocal booth" width="1200" height="1600" loading="lazy" decoding="async">
        </div>
      </div>
    </div>
  </div>
</section>

${visionBand()}

<!-- The logo strip. No lead: the client's own strip carries no heading, and
     a count read off CLIENTS is the only thing said about it. -->
<section class="night g-logos" aria-labelledby="clients-h">
  <div class="wrap">
    <h2 id="clients-h" class="eyebrow center-eyebrow on-night clients-title" data-anim="fade">Our Clientele</h2>
    ${clientRows()}
  </div>
</section>

<section class="dark">
  <div class="wrap">
    <div class="g-8-4">
      <div class="founder">
        <div class="founder-head">
          <p class="eyebrow" data-anim="fade">Founder &middot; since ${FOUNDED}</p>
          <h2 data-anim="reveal">${esc(FOUNDER.name)}</h2>
        </div>
        <!-- All three paragraphs at ONE size, by request — the first used to
             run larger as a lead-in. -->
        ${FOUNDER.body.map(para => `<p class="muted founder-p" data-anim="fade">${esc(para)}</p>`).join('\n        ')}
      </div>
      <div class="bento bento-col" data-stagger>
        <div class="bento-i" data-anim="rise"><b>${SITE.projectsCompleted}</b><span>Installations completed</span></div>
        <div class="bento-i" data-anim="rise"><b>20+</b><span>Years in acoustics</span></div>
        <div class="bento-i" data-anim="rise"><b>98%</b><span>Customer satisfaction</span></div>
        <div class="bento-i" data-anim="rise"><b>${PRODUCTS.length}</b><span>Products in the range</span></div>
        <div class="bento-i" data-anim="rise"><b>${PROJECTS.length}</b><span>Rooms photographed</span></div>
      </div>
    </div>
  </div>
</section>

<section class="night">
  <div class="wrap">
    <div class="process-grid">
      <div class="process-aside">
        <p class="eyebrow" data-anim="fade">How a project runs</p>
        <h2 data-anim="reveal">Seven steps, in this order.</h2>
        <p class="lead" data-anim="fade">Each one gates the next. We do not cut material before the design is signed off, and we do not hand over before the finished room has been measured against the target.</p>
      </div>
      <div class="steps steps-spine">
        ${PROCESS.map(s => `<div class="step" data-anim="fade"><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="light">
  <div class="wrap">
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">How we work</p>
        <h2 data-anim="reveal">Four things we will not do.</h2>
      </div>
      <p class="lead" data-anim="fade">Stated plainly, because each one is something the industry does routinely and we think it is why clients end up disappointed.</p>
    </div>
    <div class="g-cols g-cols-4" data-stagger>
      <div class="g-col" data-anim="fade"><h3>Sell foam as soundproofing</h3><p>If your problem is the neighbour, we will tell you that panels will not fix it — even when panels are the cheaper order and the easier sale.</p></div>
      <div class="g-col" data-anim="fade"><h3>Quote a lump sum</h3><p>Every quotation is itemised by product, area and rate, with installation, transport and taxes shown separately. You can see exactly what you are paying for and take a line out if you need to.</p></div>
      <div class="g-col" data-anim="fade"><h3>Drop the material at your gate</h3><p>Supplying the panels is half a job. We fit them too, to the drawing and to your site timings, and we stay on after handover for support and maintenance. If you only want the material, say so and we will price it that way &mdash; but the default is that we finish what we make.</p></div>
      <div class="g-col" data-anim="fade"><h3>Hand over unmeasured</h3><p>We measure the finished room against the design target and give you the report. If it misses, we come back and fix it. That is what the design fee bought.</p></div>
    </div>
  </div>
</section>

${ctaBand()}`
}));

/* ================================= NOTES ================================ */
/* The FAQ takes the reference's accordion rows. <details> needs no script. */
built.push(page({
  file: 'blog.html', active: 'blog.html',
  title: 'Acoustics Notes & Guides | Silence Acoustic',
  desc: 'Plain-language notes on room acoustics from Silence Acoustic, Mumbai — starting with a beginner\'s guide to acoustic polyester panels and how they work.',
  body: `
${gHead({
  eyebrow: 'Notes', h1: 'Working notes on acoustics',
  lead: 'What we find ourselves explaining on site, written down. No product pitches — if a note ends with "and that is why you need us", we have not written it properly.',
})}

<section class="light">
  <div class="wrap">
    <ol class="notes">
      ${POSTS.map((post, i) => `<li class="note${i === 0 ? ' note-lead' : ''}" data-anim="fade">
        <a href="${post.slug}.html">
          <span class="note-surface surface s-felt" aria-hidden="true"></span>
          <span class="note-body">
            <span class="note-meta">${esc(post.tag)}<i>${esc(post.read)}</i><time datetime="${esc(post.date)}">${esc(post.dateLabel)}</time></span>
            <span class="note-t">${esc(post.t)}</span>
            <span class="note-d">${esc(post.d)}</span>
            <span class="note-go">Read the guide ${ARROW}</span>
          </span>
        </a>
      </li>`).join('\n      ')}
    </ol>
    <p class="mt-l lead">More notes are being written. If you have a question today, call us and we will answer it on the phone rather than make you wait for the post.</p>
  </div>
</section>

<section class="dark">
  <div class="wrap">
    <div class="g-faq-grid">
      <div>
        <p class="eyebrow" data-anim="fade">FAQ</p>
        <h2 data-anim="reveal">The things clients ask first.</h2>
      </div>
      <div class="g-faq" data-stagger>
        ${FAQ.map((f, i) => `<details class="g-faq-i" data-anim="fade"${i === 0 ? ' open' : ''}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

${ctaBand()}`
}));

/* ----------------------------- ARTICLE PAGES ---------------------------- */
/* Headings take `reveal` and prose takes `fade`, so the structure of the
   piece is what moves rather than every paragraph doing the same thing. */
const blocks = (body) => body.map(b => {
  if (b[0] === 'h2') return `<h2 data-anim="reveal">${esc(b[1])}</h2>`;
  if (b[0] === 'p')  return `<p data-anim="fade">${esc(b[1])}</p>`;
  if (b[0] === 'ul') return `<ul data-anim="fade">${b[1].map(li => `<li>${esc(li)}</li>`).join('')}</ul>`;
  if (b[0] === 'qa') return `<h3 data-anim="reveal" style="font-size:1.0625rem;margin-top:1.5rem">${esc(b[1])}</h3><p data-anim="fade">${esc(b[2])}</p>`;
  return '';
}).join('\n          ');

POSTS.forEach(post => {
  built.push(page({
    file: `${post.slug}.html`, active: 'blog.html',
    title: `${post.t.replace(/\s*—.*$/, '')} | Silence Acoustic`.slice(0, 62),
    desc: post.d.slice(0, 158),
    body: `
${gHead({
  eyebrow: `${esc(post.tag)} &middot; ${esc(post.read)} read`, h1: esc(post.t),
  extra: `<nav class="crumbs" data-in style="--d:280" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span aria-hidden="true">/</span>
      <a href="blog.html">Notes</a><span aria-hidden="true">/</span>
      <span>Published ${esc(post.dateLabel)}</span>
    </nav>`,
})}

<section class="light">
  <div class="wrap">
    <div class="pd-grid">
      <article class="pd-body">
        <p class="lead" style="color:var(--on-light)">${esc(post.d)}</p>
        ${blocks(post.body)}
      </article>
      <aside class="pd-aside">
        <p class="eyebrow">The product</p>
        <h2 class="sub-h mb-s" style="margin-top:.8rem">Acoustic Polyester Panel</h2>
        <p class="muted" style="font-size:.9375rem">The panel this guide describes, with published sizes, densities and NRC figures.</p>
        <a class="btn btn-ghost on-light" style="margin-top:1.25rem;width:100%;justify-content:center" href="products/acoustic-polyester-panel.html">See the spec ${ARROW}</a>
        <a class="btn btn-primary" style="margin-top:.6rem;width:100%;justify-content:center" href="contact.html">Book a free survey ${ARROW}</a>
      </aside>
    </div>
  </div>
</section>

${ctaBand()}`
  }));
});

/* ================================ CONTACT =============================== */
/* Reference contact-page order: title and intro, the form beside the office
   contact blocks, then a grey section of short items. */
const roomOptions = SECTORS.map(s => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('\n              ');
built.push(page({
  file: 'contact.html', active: 'contact.html',
  title: 'Contact & Free Site Survey | Silence Acoustic',
  desc: 'Book a free acoustic site survey in Mumbai and the MMR. Call +91 81084 00566 or send your room details and we will come and measure.',
  body: `
${gHead({
  eyebrow: 'Contact', h1: 'Tell us about the space.',
  lead: 'The more you can tell us now, the more useful the first call is. Room size and what goes on in it are the two that matter most.',
})}

<section class="dark g-contact">
  <div class="wrap">
    <div class="g-contact-grid">
      <div data-anim="fade">
        <h2 class="sub-h mb-m">Send the details</h2>
        <form class="form" id="enquiry" data-endpoint="${esc(SITE.formEndpoint || '')}" data-to="${SITE.email}" novalidate>
          <div class="field half"><label for="f-name">Name <span class="req">*</span></label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
          <div class="field half"><label for="f-org">Company or practice</label><input id="f-org" name="org" type="text" autocomplete="organization"></div>
          <div class="field half"><label for="f-email">Email <span class="req">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field half"><label for="f-phone">Phone <span class="req">*</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required></div>
          <div class="field half"><label for="f-city">Project city</label><input id="f-city" name="city" type="text" placeholder="Mumbai"></div>
          <div class="field half">
            <label for="f-room">Project type</label>
            <select id="f-room" name="room">
              <option value="">Select a project type</option>
              ${roomOptions}
              <option value="Other">Something else</option>
            </select>
          </div>
          <div class="field full"><label for="f-size">Approximate room size</label><input id="f-size" name="size" type="text" placeholder="e.g. 12 × 8 m, 3.5 m ceiling"></div>
          <div class="field full"><label for="f-msg">Brief about the project <span class="req">*</span></label><textarea id="f-msg" name="message" required placeholder="Echo, speech is hard to follow, noise from the road, music carrying to the next room…"></textarea></div>
          <div class="full stack stack-m">
            <button class="btn btn-primary" type="submit" style="justify-content:center">Send enquiry ${ARROW}</button>
            <p class="form-status" id="f-status" role="status" aria-live="polite"></p>
            <p class="form-note">We reply within one working day. Prefer to talk? Call or WhatsApp <a href="tel:${SITE.phoneHref}" style="color:inherit">${SITE.phone}</a>.</p>
          </div>
        </form>
      </div>

      <div class="g-offices" data-stagger>
        <div class="g-office" data-anim="fade">
          <p class="eyebrow">Phone &amp; WhatsApp</p>
          <a class="v" href="tel:${SITE.phoneHref}">${SITE.phone}</a>
        </div>
        <div class="g-office" data-anim="fade">
          <p class="eyebrow">General enquiries</p>
          <a class="v" href="mailto:${SITE.email}">${SITE.email}</a>
        </div>
        <div class="g-office" data-anim="fade">
          <p class="eyebrow">Drawings &amp; tenders</p>
          <a class="v" href="mailto:${SITE.emailProjects}">${SITE.emailProjects}</a>
        </div>
        <div class="g-office" data-anim="fade">
          <p class="eyebrow">Office &amp; works</p>
          <span class="v">Mumbai, Maharashtra</span>
        </div>
        <div class="row" data-anim="fade">
          <a class="btn btn-primary" href="${SITE.waHref}" rel="noopener">WhatsApp us ${ARROW}</a>
          <a class="btn btn-ghost" href="tel:${SITE.phoneHref}">Call now</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="light">
  <div class="wrap">
    <p class="eyebrow" data-anim="fade">Helps us quote faster</p>
    <ul class="g-checks g-checks-3" data-stagger>
      ${['A floor plan or a section, any format', 'Ceiling height and finishes already fixed', 'What the room is used for, and by how many', 'A voice note of one clap in the empty room', 'Your handover date']
        .map(t => `<li data-anim="fade"><span class="g-check-row">${checkIco}<b>${t}</b></span></li>`).join('\n      ')}
    </ul>
  </div>
</section>`
}));

/* ================================== 404 ================================= */
built.push(page({
  file: '404.html', active: '',
  title: 'Page not found — Silence Acoustic',
  desc: 'That page does not exist. Find acoustic panels, ceilings, foam, wood and soundproofing in the product catalogue.',
  body: gHead({
    eyebrow: '404', h1: 'Nothing here. Not even an echo.',
    lead: 'That page has moved or never existed. The catalogue and the contact page are both one click away.',
    extra: `<div class="row" style="margin-top:2.5rem">
      <a class="btn btn-primary" href="products.html">Browse products ${ARROW}</a>
      <a class="btn btn-ghost" href="index.html">Back to home ${ARROW}</a>
    </div>`,
  })
}));

module.exports = built;
