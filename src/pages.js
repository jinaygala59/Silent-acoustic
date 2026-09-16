const C = require('./content.js');
const B = require('./build.js');
const { SITE, CLIENTS, BANNERS, FOUNDER, ABOUT_INTRO, NAV, CATEGORIES, PRODUCTS, SECTORS, PROCESS, TESTIMONIALS, PROJECTS, POSTS, FAQ } = C;
const { esc, ARROW, page, productCard, famRail, ctaBand, nrcBar, roomdex } = B;

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
  if ((picks.length + 3) % 3 !== 0) return '';
  return `
<section class="dark railed" aria-labelledby="work-h">
  <div class="wrap">
    <span class="rail-label">Work</span>
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">Selected work</p>
        <h2 id="work-h" data-anim="reveal">${picks.length} room types.</h2>
      </div>
      <p class="lead" data-anim="fade"><a class="tlink" href="projects.html">All ${PROJECTS.length} in the gallery ${ARROW}</a></p>
    </div>
    <div class="gal" data-stagger>
      ${picks.map(pr => `<article class="gal-item" data-anim="tile">
        <a class="gal-zoom" href="assets/img/projects/${pr.s}.webp" aria-label="View the photograph of ${esc(pr.n)} at full size">
          <div class="gal-surface surface ${(SECTORS.find(x => x.name === pr.sec) || {}).surf || 's-plate'}">
            <img src="assets/img/projects/${pr.s}.webp" alt="${esc(pr.n)}${pr.l ? ', ' + esc(pr.l) : ''}" width="760" height="507" loading="lazy" decoding="async">
          </div>
        </a>
        <div class="gal-cap">
          <h3>${esc(pr.n)}</h3>
          <p>${pr.l ? esc(pr.l) + ' &middot; ' : ''}${esc(pr.sec)}</p>
        </div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
};


/* ----------------------------- the client wall ---------------------------
   THE PINNED SCROLL CHOREOGRAPHY THAT USED TO SIT HERE IS GONE, by request.
   It was a 300vh section with a sticky 100vh child in which four project
   photographs traded places, stacked, and the last opened to full bleed — a
   port of a framer-motion component to this site's own engine. It is deleted,
   not commented out: `.choreo` markup, the `CHOREO` slug list and the whole
   choreography block in motion.css went with it. If a pinned piece is wanted
   again, write it against the current motion vocabulary rather than reviving
   that one.

   WHAT REPLACES IT IS THE CLIENT LIST, which the client's own site carries as
   a 50-slide swiper and this site did not carry at all. It is a grid, not a
   marquee, and that is deliberate: a marquee of client names was on this
   homepage once (the `.ticker` port of replit.com's LogoBlock) and was
   removed for duplicating the gallery underneath it in motion instead of as
   photographs. A grid says the same thing without moving, every name is
   readable at once, and it does not need JavaScript.

   The wall sits directly above the Work gallery, where the choreography did,
   because the order is the argument: here is who, then here are the rooms.

   IT CARRIES ALMOST NO COPY, AND THAT IS THE POINT. The client's own page
   runs this strip with NO heading at all — the logos sit under the contact
   block unlabelled. A first pass gave it an eyebrow ("Trusted by"), a
   headline and a lead describing the fifty as "broadcasters, banks,
   universities, studios and developers — rooms we have designed, supplied
   and fitted". Every word of that was composed here, and the last clause
   asserted a working relationship with each of fifty named companies that
   nothing in the client's material supports. It is gone. What is left is the
   section label the site's own furniture provides and a count read off
   CLIENTS.length. Do not write a lead for this section; if one is wanted,
   the words have to come from the client. */
const clientWall = () => `
<section class="light railed clients-sec" aria-labelledby="clients-h">
  <div class="wrap">
    <span class="rail-label">Clients</span>
    <div class="section-head">
      <h2 id="clients-h" data-anim="reveal">${CLIENTS.length} clients.</h2>
    </div>
    <ul class="client-wall" data-stagger>
      ${CLIENTS.map(c => `<li class="client" data-anim="fade"><img src="assets/img/clients/${c.s}.webp" alt="${esc(c.n)}" width="402" height="162" loading="lazy" decoding="async"></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;


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
    ${BANNERS.map((b, i) => `<div class="hero-slide"><img src="assets/img/banners/${b.img}.webp"
         alt="" width="${b.w}" height="${b.h}" ${i ? 'fetchpriority="low" loading="lazy"' : 'fetchpriority="high"'} decoding="async"></div>`).join('\n    ')}
  </div>
  <div class="wrap">
    <!-- The headline rotates with the photograph. Only slide one is the h1 —
         see the HOME note at the top of src/pages.js before editing. -->
    <div class="hero-copy">
      ${BANNERS.map((b, i) => {
        const words = b.title.split(' ');
        const last = words.pop();
        /* THE REVERB-TAIL ECHOES ARE GONE. Two partly-opaque copies of the
           last word used to travel out from behind it on load. That was
           drawn for Bricolage Grotesque, where a clean geometric letterform
           trailing itself reads as a tail; in Instrument Serif's italic the
           same three copies read as a word printed twice slightly off
           register — a fault, not an effect. `.decay` itself stays: the
           italic last word in the banner mark is the better half of the idea
           and needs no animation to work. */
        const decay = `<span class="decay">${esc(last)}</span>`;
        const head = `${esc(words.join(' '))} ${decay}`;
        return i === 0
          ? `<div class="hero-say is-on">
        <p class="eyebrow" data-in style="--d:60">${esc(b.sector)} &middot; Mumbai</p>
        <h1 class="hero-title"><span class="hl"><span style="--d:160">${head}</span></span></h1>
      </div>`
          : `<div class="hero-say" aria-hidden="true">
        <p class="eyebrow">${esc(b.sector)} &middot; Mumbai</p>
        <p class="hero-title">${head}</p>
      </div>`;
      }).join('\n      ')}
    </div>
    <div class="hero-foot">
      <p class="lead hero-lead" data-in style="--d:520">We measure the room, design the treatment, manufacture the panels and install them ourselves — then measure again to prove it worked.</p>
      <div class="row hero-cta" data-in style="--d:640">
        <a class="btn btn-primary" href="contact.html">Book a free site survey ${ARROW}</a>
        <a class="btn btn-ghost" href="products.html">See the products ${ARROW}</a>
      </div>
    </div>
  </div>
  </div>
  <!-- THE FIVE MATERIALS AS A RULE, closing the banner. Each segment is
       weighted by how many products that family holds, counted at build time,
       so the band is a reading of the range rather than five equal stripes.
       It is the site's own colour rule stated once, at full width: colour
       means which material you are looking at, and nothing else on the page
       is allowed to use these five. Decorative, so aria-hidden. -->
  <div class="mat-rule" aria-hidden="true">
    ${CATEGORIES.map(c => {
      const n = PRODUCTS.filter(p => p.cat === c.id).length;
      return `<i style="flex:${n};background:var(--mat-${MATKEY[c.id]})"></i>`;
    }).join('')}
  </div>
  <div class="wrap hero-rail">
    <dl class="hero-specs hero-specs-4" data-in style="--d:800">
      ${SITE.stats.map(st => {
        /* ALL FOUR COUNT UP NOW. The figure and its suffix are split rather
           than the string being handed to the counter whole: `data-count-to`
           takes an integer, and the client writes their numbers with the
           plus attached ("2035+"). The digits animate inside the span and
           the "+" sits outside it, unanimated — so what counts is their
           figure and what is appended is their punctuation. A counter that
           ran to 2035 and then printed a "+" of its own would be making a
           different claim from the one they publish.

           `v` is split, never reformatted: anything that is not a leading
           run of digits is carried through as-is, so a future "7 (Q3)" or
           "20+ yrs" still renders correctly and simply counts the number at
           the front. */
        const m = st.years ? null : String(st.v).match(/^(\d+)(.*)$/);
        const fig = st.years
          ? `<span class="tick" data-count-to="${YEARS}">${YEARS}</span>+`
          : m
            ? `<span class="tick" data-count-to="${m[1]}">${m[1]}</span>${esc(m[2])}`
            : esc(st.v);
        return `<div class="hero-spec"><dt>${esc(st.label)}</dt><dd>${fig}</dd></div>`;
      }).join('\n      ')}
    </dl>
  </div>
</section>

<section class="light railed dip-sec">
  <div class="wrap">
    <span class="rail-label">The distinction</span>
    <div class="founder">
      <div class="founder-head">
        <p class="eyebrow" data-anim="fade">Founder &middot; since ${FOUNDED}</p>
        <h2 data-anim="reveal">${esc(FOUNDER.name)}</h2>
      </div>
      ${FOUNDER.body.map((para, i) => `<p class="${i === 0 ? 'lead founder-lead' : 'muted'}" data-anim="fade">${esc(para)}</p>`).join('\n      ')}
    </div>
  </div>
  <div class="diptych">
  <a class="dip" href="products.html#panels" data-anim="slide-l">
    <div class="dip-surface" aria-hidden="true">
      <img src="assets/img/projects/z3-powai.webp" alt=""
           width="760" height="570" loading="lazy" decoding="async">
    </div>
    <div class="dip-body">
      <p class="eyebrow">Inside the room</p>
      <h2>Acoustic treatment</h2>
      <p>Transform your space with Acoustic Treatment designed to control sound, reduce echoes, and enhance clarity.</p>
      <span class="tlink">Panels, ceilings and foam ${ARROW}</span>
    </div>
  </a>
  <a class="dip" href="products.html#proof" data-anim="slide-r">
    <div class="dip-surface" aria-hidden="true">
      <img src="assets/img/projects/swarsamwad-studio-mumbai.webp" alt=""
           width="760" height="570" loading="lazy" decoding="async">
    </div>
    <div class="dip-body">
      <p class="eyebrow">Between rooms</p>
      <h2>Soundproofing</h2>
      <p>Effective Soundproofing minimises unwanted noise by preventing sound from entering or escaping a space.</p>
      <span class="tlink">Membranes, doors and windows ${ARROW}</span>
    </div>
  </a>
  </div>
</section>

${famRail()}

<section class="light railed">
  <div class="wrap">
    <span class="rail-label">Projects</span>
    <div class="rdx-intro">
      <div>
        <p class="eyebrow" data-anim="fade">Where we work</p>
        <h2 data-anim="reveal">Every project type has a number to hit.</h2>
      </div>
      <!-- CLIENT-SUPPLIED COPY, verbatim from the change brief. The heading
           above it is ours and was left alone: the brief marked the paragraph
           for replacement, not the whole block. -->
      <p class="lead" data-anim="fade">We cater to a wide range of spaces with customised acoustic and soundproofing solutions &mdash; from auditoriums and offices to studios, restaurants, homes, and commercial spaces.</p>
    </div>
    ${roomdex()}
  </div>
</section>

<section class="dark railed">
  <div class="wrap">
    <span class="rail-label">Method</span>
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

<section class="light statement">
  <div class="wrap">
    <p class="eyebrow" data-anim="fade">Instead of a case study</p>
    <h2 class="statement-h" data-anim="reveal">Ask a client<br>who had <span class="statement-em">your problem.</span></h2>
    <div class="statement-grid">
      <p class="lead" data-anim="fade">Our written case studies are still being put together. Rather than show you our version, we will put you in touch with a client in your sector — an auditorium, a studio, a corporate floor, a school — and you can ask them how it went.</p>
      <div class="row" data-anim="fade">
        <a class="btn btn-primary" href="contact.html">Request references ${ARROW}</a>
        <a class="btn btn-ghost" href="projects.html">Room types we treat ${ARROW}</a>
      </div>
    </div>
  </div>
</section>

${workBand()}

${clientWall()}


<section class="dark railed">
  <div class="wrap">
    <span class="rail-label">Clients</span>
    <div class="section-head mid">
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


/* ============================= PRODUCTS INDEX ============================ */
/* THE PAGE-HEAD LEAD IS A COUNT AND NOTHING ELSE, deliberately. It used to
   name five families and say every product is made in their own facility in
   Mumbai — both of which the client asked to stop publishing, though this was
   not one of the two places their brief marked. The replacement written here
   ("…for absorbing sound inside a room and for blocking it between two…")
   was then composed rather than sourced, which is the other thing not to do:
   the client's own /our-products page carries no lead copy at all, so there
   was nothing to take. A count is a fact from the data. If this page wants a
   sentence, get it from the client.

   THE REASONING IS A JS COMMENT, NOT AN HTML ONE, deliberately. An HTML
   comment inside these template literals ships to the browser, so explaining
   the removal in the markup would have put the removed sentence back into the
   page source for anyone who reads it. The family grouping BELOW is
   untouched — `fampick`, the per-family sections and the filters are this
   page's navigation, and the brief asked for the product pages to be kept as
   they are. */
built.push(page({
  file: 'products.html', active: 'products.html',
  title: 'Acoustic Panels & Soundproofing Products | Silence Acoustic',
  desc: '19 acoustic products: PET panels, ceiling clouds and baffles, foam, wood wool, slats, mass-loaded vinyl, soundproof doors and windows. Made in Mumbai.',
  body: `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">Catalogue</p>
    <h1 data-in style="--d:170">Products</h1>
    <p class="lead" data-in style="--d:280">${PRODUCTS.length} products.</p>
  </div>
</section>

<section class="dark railed">
  <div class="wrap">
    <span class="rail-label">Families</span>
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">Pick a family</p>
        <h2 class="sub-h" data-anim="reveal">Five families, ${PRODUCTS.length} products</h2>
      </div>
      <p class="lead" data-anim="fade">Jump straight to the range you need, or keep scrolling to see all of them in order.</p>
    </div>
    <nav class="fampick" data-anim="fade" aria-label="Jump to a product family">
      ${CATEGORIES.map(c => `<a href="#${c.id}">${esc(c.name)} <b>${PRODUCTS.filter(p => p.cat === c.id).length}</b></a>`).join('\n      ')}
    </nav>
  </div>
</section>

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

<section class="dark railed">
  <div class="wrap">
    <span class="rail-label">Selecting</span>
    <div class="grid g2" data-stagger style="align-items:start">
      <div class="stack stack-m">
        <p class="eyebrow" data-anim="fade">Which family do you need</p>
        <h2 class="sub-h" data-anim="reveal">Absorb, block, or both</h2>
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
PRODUCTS.forEach(p => {
  const cat = CATEGORIES.find(c => c.id === p.cat);
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.slug !== p.slug).slice(0, 3);
  built.push(page({
    file: `products/${p.slug}.html`, active: 'products.html', depth: 1,
    title: `${p.name} | Silence Acoustic, Mumbai`,
    desc: `${p.name}: ${p.tag}. Supplied and installed across India by Silence Acoustic, Mumbai.`,
    body: `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">${esc(cat.name)}</p>
    <h1 data-in style="--d:170">${esc(p.name)}</h1>
    <p class="lead" data-in style="--d:280">${esc(p.tag)}</p>
    ${nrcBar(p, 'nrc-lead')}
    <nav class="crumbs" data-in style="--d:390" aria-label="Breadcrumb">
      <a href="../index.html">Home</a><span aria-hidden="true">/</span>
      <a href="../products.html">Products</a><span aria-hidden="true">/</span>
      <a href="../products.html#${cat.id}">${esc(cat.name)}</a><span aria-hidden="true">/</span>
      <span>${esc(p.name)}</span>
    </nav>
  </div>
</section>

<section class="light">
  <div class="wrap">
    <div class="pd-grid">
      <div>
        <!-- data-mat is what resolves the material colour for the .is-cut
             mount. Without it every detail hero falls back to the PET grey
             and a timber sample sits on a cold ground. Same attribute the
             cards carry; there it also draws the marker, here it only
             tints the mount. -->
        <div class="pd-hero surface ${p.surf}${p.cut ? ' is-cut' : ''}" data-mat="${MATKEY[p.cat] || 'pet'}" data-anim="frame">
          <img src="../assets/img/products/${p.slug}-hero.webp" alt="${esc(p.name)}" width="1600" height="1000" fetchpriority="high" decoding="async">
        </div>
        ${p.shots && p.shots.length ? `<div class="pd-gallery">${p.shots.map((n, i) => `<figure class="pd-shot"><img src="../assets/img/products/${p.slug}-${n}.webp" alt="${esc(p.name)} — view ${i + 2}" width="800" height="600" loading="lazy" decoding="async"></figure>`).join('')}</div>` : ''}
        <div class="pd-body" style="margin-top:clamp(2rem,4vw,3rem)">
          <p class="lead" style="color:var(--on-light)">${esc(p.lead)}</p>
          ${p.body.map(t => `<p>${esc(t)}</p>`).join('\n          ')}
          <h2>Typical applications</h2>
          <ul class="pills">${p.apps.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
        </div>
      </div>
      <aside class="pd-aside">
        <table class="spec">
          <caption>Specification</caption>
          <tbody data-stagger="long">
            ${Object.entries(p.specs).map(([k, v]) => `<tr data-anim="fade"><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
        <p class="muted" style="font-size:.8125rem;margin-top:1.25rem;line-height:1.5">Figures as published by Silence Acoustic. We confirm them against your specification and supply test reports on request.</p>
        <a class="btn btn-primary" style="margin-top:1.5rem;width:100%;justify-content:center" href="../contact.html">Request a quote ${ARROW}</a>
        <a class="btn btn-ghost on-light" style="margin-top:.6rem;width:100%;justify-content:center" href="tel:${SITE.phoneHref}">${SITE.phone}</a>
      </aside>
    </div>

    ${related.length ? `<div class="pd-related">
    <hr class="rule">
    <h2 class="sub-h mb-l">Others in ${esc(cat.name)}</h2>
    <div class="grid g3" data-stagger>${related.map(r => productCard(r, '../')).join('\n')}</div>
    </div>` : ''}
  </div>
</section>

${ctaBand('../')}`
  }));
});

/* =============================== PROJECTS =============================== */
built.push(page({
  file: 'projects.html', active: 'projects.html',
  title: 'Projects & Room Types | Silence Acoustic',
  desc: 'Acoustic treatment for auditoriums, recording studios, offices, schools, sports halls, hotels and home theatres. Each room designed to its own target.',
  body: `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">Selected work</p>
    <h1 data-in style="--d:170">Projects</h1>
    <p class="lead" data-in style="--d:280">${SITE.projectsCompleted} completed installations across ten room types, ${PROJECTS.length} of them photographed here — from Ravindra Natya Mandir and Sena Bhavan to corporate floors for Accenture, Microsoft and Bajaj, and recording studios across Mumbai.</p>
  </div>
</section>

<section class="light railed">
  <div class="wrap">
    <span class="rail-label">Gallery</span>
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">${PROJECTS.length} rooms photographed</p>
        <h2 data-anim="reveal">Rooms we have finished.</h2>
      </div>
      <p class="lead" data-anim="fade">Auditoriums, broadcast studios, corporate floors, schools and homes — across Mumbai, Maharashtra and the rest of India. Filter by room type, or ask us for a reference in your sector.</p>
    </div>

    <div class="filters" role="group" aria-label="Filter projects by room type">
      <button class="filter" type="button" data-filter="all" aria-pressed="true">All &middot; ${PROJECTS.length}</button>
      ${SECTORS.map(sec => {
        const n = PROJECTS.filter(pr => pr.sec === sec.name).length;
        return n ? `<button class="filter" type="button" data-filter="${esc(sec.name)}" aria-pressed="false">${esc(sec.name)} &middot; ${n}</button>` : '';
      }).filter(Boolean).join('\n      ')}
    </div>

    <div class="gal" id="gal" data-stagger>
      ${PROJECTS.map(pr => `<article class="gal-item" data-anim="tile" data-sector="${esc(pr.sec)}">
        <a class="gal-zoom" href="assets/img/projects/${pr.s}.webp" aria-label="View the photograph of ${esc(pr.n)} at full size">
          <div class="gal-surface surface ${(SECTORS.find(x => x.name === pr.sec) || {}).surf || 's-plate'}">
            <img src="assets/img/projects/${pr.s}.webp" alt="${esc(pr.n)}${pr.l ? ', ' + esc(pr.l) : ''}" width="760" height="507" loading="lazy" decoding="async">
          </div>
        </a>
        <div class="gal-cap">
          <h3>${esc(pr.n)}</h3>
          <p>${pr.l ? esc(pr.l) + ' &middot; ' : ''}${esc(pr.sec)}</p>
        </div>
      </article>`).join('\n      ')}
    </div>
    <p class="form-status" id="gal-count" role="status" aria-live="polite" style="margin-top:1.5rem"></p>
  </div>
</section>

<section class="dark railed">
  <div class="wrap">
    <span class="rail-label">Clients</span>
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
   own. One asserted in-house manufacturing, the other that every finished
   room is re-measured against its target after handover. Both are claims the
   client does not want published; the first was cut from the homepage rail in
   the same brief, and the second is the promise CLAUDE.md already flags as
   written copy rather than client-confirmed. Do not reinstate either without
   being asked for it by name.

   Kept as a JS comment rather than an HTML one on purpose: an HTML comment in
   these template literals ships, and the point of removing a claim is that it
   stops being in the page. */
built.push(page({
  file: 'about.html', active: 'about.html',
  title: 'About Silence Acoustic — Acoustics, Mumbai',
  /* Rewritten from the client's own replacement copy, and for the same reason
     the page-head h1 was: the old description was a summary of three
     paragraphs that no longer exist, and it repeated the manufacturing claim
     into every search result. A description is published text — it just is
     not published on the page. */
  desc: 'Two decades of expertise in acoustic products and solutions. Acoustic treatment, soundproofing and high-performance acoustic products across offices, auditoriums, studios and hospitality, with 2035+ projects delivered across India.',
  body: `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">About</p>
    <h1 data-in style="--d:170">${esc(ABOUT_INTRO.h1)}</h1>
  </div>
</section>

<section class="dark railed">
  <div class="wrap">
    <span class="rail-label">Company</span>
    <div class="grid g2" data-stagger style="align-items:start;gap:clamp(2rem,5vw,4rem)">
      <div class="stack stack-m">
        <p class="eyebrow" data-anim="fade">Since 2006</p>
        <h2 data-anim="reveal">${esc(ABOUT_INTRO.h2).replace(/\n/g, '<br>')}</h2>
        <!-- CLIENT-SUPPLIED COPY. One long paragraph by their choice; it is
             split for reading only where their own sentences end, and no
             words are added, cut or reordered. -->
        ${ABOUT_INTRO.body.split(/(?<=\.)\s+(?=With 2,035|From offices|Our commitment)/).map(para => `<p class="muted">${esc(para)}</p>`).join('\n        ')}
      </div>
      <div>
        <!-- Deliberately the same material twice: slat samples as we make them,
             then the same slats fitted on a wall. It is the supplier/installer
             point made in pictures rather than in another paragraph. -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
          <figure class="stack" style="margin:0;gap:0.5rem">
            <div class="surface s-slat panel" data-anim="frame" style="aspect-ratio:4/5">
              <img src="assets/img/products/acoustic-wooden-slats-card.webp"
                   alt="Acoustic wooden slat panels in several veneers" width="800" height="600" loading="lazy" decoding="async">
            </div>
            <figcaption class="muted" style="font-family:var(--mono);font-size:var(--t-mono);letter-spacing:0.16em;text-transform:uppercase">We make it</figcaption>
          </figure>
          <figure class="stack" style="margin:0;gap:0.5rem">
            <div class="surface s-slat panel" data-anim="frame" style="aspect-ratio:4/5">
              <img src="assets/img/projects/upl-metro-juinagar-navi-mumbai.webp"
                   alt="Slat wall installed at UPL Metro, Juinagar" width="760" height="570" loading="lazy" decoding="async">
            </div>
            <figcaption class="muted" style="font-family:var(--mono);font-size:var(--t-mono);letter-spacing:0.16em;text-transform:uppercase">We fit it</figcaption>
          </figure>
        </div>
      </div>
    </div>

    <p class="eyebrow" data-anim="fade" style="margin-top:clamp(3rem,6vw,4.5rem)">At a glance</p>
    <div class="bento" data-stagger>
      <div class="bento-i bento-lg" data-anim="rise">
        <b>${SITE.projectsCompleted}</b>
        <span>Installations completed</span>
        <small>Across ${SECTORS.length} room types since 2006, ${PROJECTS.length} of them photographed on this site.</small>
      </div>
      <div class="bento-i" data-anim="rise"><b>20+</b><span>Years in acoustics</span></div>
      <div class="bento-i" data-anim="rise"><b>98%</b><span>Customer satisfaction</span></div>
      <div class="bento-i" data-anim="rise"><b>${PRODUCTS.length}</b><span>Products in the range</span></div>
      <div class="bento-i" data-anim="rise"><b>${PROJECTS.length}</b><span>Rooms photographed</span></div>
    </div>
  </div>
</section>

<section class="light railed">
  <div class="wrap">
    <span class="rail-label">Principles</span>
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">How we work</p>
        <h2 data-anim="reveal">Four things we will not do.</h2>
      </div>
      <p class="lead" data-anim="fade">Stated plainly, because each one is something the industry does routinely and we think it is why clients end up disappointed.</p>
    </div>
    <div class="steps" data-stagger="long">
      <div class="step" data-anim="fade" style="grid-template-columns:1fr"><h3 style="grid-column:1;grid-row:1">Sell foam as soundproofing</h3><p style="grid-column:1;grid-row:2;max-width:70ch">If your problem is the neighbour, we will tell you that panels will not fix it — even when panels are the cheaper order and the easier sale.</p></div>
      <div class="step" data-anim="fade" style="grid-template-columns:1fr"><h3 style="grid-column:1;grid-row:1">Quote a lump sum</h3><p style="grid-column:1;grid-row:2;max-width:70ch">Every quotation is itemised by product, area and rate, with installation, transport and taxes shown separately. You can see exactly what you are paying for and take a line out if you need to.</p></div>
      <div class="step" data-anim="fade" style="grid-template-columns:1fr"><h3 style="grid-column:1;grid-row:1">Drop the material at your gate</h3><p style="grid-column:1;grid-row:2;max-width:70ch">Supplying the panels is half a job. We fit them too, to the drawing and to your site timings, and we stay on after handover for support and maintenance. If you only want the material, say so and we will price it that way &mdash; but the default is that we finish what we make.</p></div>
      <div class="step" data-anim="fade" style="grid-template-columns:1fr"><h3 style="grid-column:1;grid-row:1">Hand over unmeasured</h3><p style="grid-column:1;grid-row:2;max-width:70ch">We measure the finished room against the design target and give you the report. If it misses, we come back and fix it. That is what the design fee bought.</p></div>
    </div>
  </div>
</section>

${ctaBand()}`
}));

/* ================================= NOTES ================================ */
built.push(page({
  file: 'blog.html', active: 'blog.html',
  title: 'Acoustics Notes & Guides | Silence Acoustic',
  desc: 'Plain-language notes on room acoustics from Silence Acoustic, Mumbai — starting with a beginner\'s guide to acoustic polyester panels and how they work.',
  body: `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">Notes</p>
    <h1 data-in style="--d:170">Working notes on acoustics</h1>
    <p class="lead" data-in style="--d:280">What we find ourselves explaining on site, written down. No product pitches — if a note ends with "and that is why you need us", we have not written it properly.</p>
  </div>
</section>

<section class="dark railed">
  <div class="wrap">
    <span class="rail-label">Articles</span>
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

<section class="light railed">
  <div class="wrap">
    <span class="rail-label">Questions</span>
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">Frequently asked</p>
        <h2 data-anim="reveal">The things clients ask first.</h2>
      </div>
    </div>
    <div class="steps" data-stagger="long">
      ${FAQ.map(f => `<div class="step" data-anim="fade" style="grid-template-columns:1fr"><h3 style="grid-column:1;grid-row:1;font-size:1.125rem">${esc(f.q)}</h3><p style="grid-column:1;grid-row:2;max-width:70ch">${esc(f.a)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand()}`
}));

/* ----------------------------- ARTICLE PAGES ---------------------------- */
/* Every block reveals on scroll. The article was the one page on the site
   with no motion at all -- 75 elements, none of them animated -- which read
   as a different site once you arrived from anywhere else. Headings take
   `reveal` (the clip-wipe) and prose takes `fade`, so the structure of the
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
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">${esc(post.tag)} &middot; ${esc(post.read)} read</p>
    <h1 data-in style="--d:170">${esc(post.t)}</h1>
    <nav class="crumbs" data-in style="--d:280" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span aria-hidden="true">/</span>
      <a href="blog.html">Notes</a><span aria-hidden="true">/</span>
      <span>Published ${esc(post.dateLabel)}</span>
    </nav>
  </div>
</section>

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
const roomOptions = SECTORS.map(s => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('\n              ');
built.push(page({
  file: 'contact.html', active: 'contact.html',
  title: 'Contact & Free Site Survey | Silence Acoustic',
  desc: 'Book a free acoustic site survey in Mumbai and the MMR. Call +91 81084 00566 or send your room details and we will come and measure.',
  body: `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">Contact</p>
    <h1 data-in style="--d:170">Tell us about the space.</h1>
  </div>
</section>

<section class="light railed">
  <div class="wrap">
    <span class="rail-label">Enquiry</span>
    <div class="grid g2" data-stagger style="align-items:start;gap:clamp(2.5rem,5vw,4.5rem)">
      <div data-anim="fade">
        <h2 class="sub-h mb-s">Send the details</h2>
        <p class="lead" style="margin-bottom:2rem">The more you can tell us now, the more useful the first call is. Room size and what goes on in it are the two that matter most.</p>
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

      <div class="stack stack-l" data-stagger>
        <div data-anim="fade">
          <h2 class="sub-h mb-m">Direct</h2>
          <ul class="contact-list">
            <li><span class="k">Phone &amp; WhatsApp</span><a class="v" href="tel:${SITE.phoneHref}">${SITE.phone}</a></li>
            <li><span class="k">General enquiries</span><a class="v" href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li><span class="k">Drawings &amp; tenders</span><a class="v" href="mailto:${SITE.emailProjects}">${SITE.emailProjects}</a></li>
            <li><span class="k">Office &amp; works</span><span class="v" style="display:block;line-height:1.55">Mumbai, Maharashtra</span></li>
          </ul>
          <div class="row" style="margin-top:1.75rem">
            <a class="btn btn-primary" href="${SITE.waHref}" rel="noopener">WhatsApp us ${ARROW}</a>
            <a class="btn btn-ghost" href="tel:${SITE.phoneHref}">Call now</a>
          </div>
        </div>
        <div data-anim="fade">
          <h2 class="sub-h mb-m">Helps us quote faster</h2>
          <ul class="pills" style="flex-direction:column;align-items:flex-start">
            <li>A floor plan or a section, any format</li>
            <li>Ceiling height and finishes already fixed</li>
            <li>What the room is used for, and by how many</li>
            <li>A voice note of one clap in the empty room</li>
            <li>Your handover date</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>`
}));

/* ================================== 404 ================================= */
built.push(page({
  file: '404.html', active: '',
  title: 'Page not found — Silence Acoustic',
  desc: 'That page does not exist. Find acoustic panels, ceilings, foam, wood and soundproofing in the product catalogue.',
  body: `
<section class="page-head" style="padding-block:clamp(5rem,12vw,9rem)">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">404</p>
    <h1 data-in style="--d:170">Nothing here. Not even an echo.</h1>
    <p class="lead" data-in style="--d:280">That page has moved or never existed. The catalogue and the contact page are both one click away.</p>
    <div class="row" style="margin-top:2.5rem">
      <a class="btn btn-primary" href="products.html">Browse products ${ARROW}</a>
      <a class="btn btn-ghost" href="index.html">Back to home ${ARROW}</a>
    </div>
  </div>
</section>`
}));

module.exports = built;
