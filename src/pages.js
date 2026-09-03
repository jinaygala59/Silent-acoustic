const C = require('./content.js');
const B = require('./build.js');
const { SITE, NAV, CATEGORIES, PRODUCTS, SECTORS, PROCESS, TESTIMONIALS, PROJECTS, POSTS, FAQ } = C;
const { esc, ARROW, page, productCard, famRail, ctaBand, nrcBar, roomdex } = B;

/* "20+ yrs" was typed, next to "since 2006" which is the client's published
   fact. Two ways of saying the same thing, one of which goes stale on its own:
   in 2027 the sentence is still right and the figure is not. It is derived
   now, so a rebuild is all it takes. Same arithmetic, no new claim — 2006 is
   theirs, the subtraction is ours. */
/* The split the distinction section quotes. Counted, never typed — add a
   soundproofing product and both halves of that copy correct themselves. */
const PROOF_N = C.PRODUCTS.filter(p => p.cat === 'proof').length;
const TREAT_N = C.PRODUCTS.length - PROOF_N;

const FOUNDED = 2006;
const YEARS = new Date().getFullYear() - FOUNDED;

const built = [];

/* ----------------------------- the choreography --------------------------
   Introduces the Work gallery: four finished rooms trade places, stack, and
   the last one opens to full bleed. Slugs only — every name, location and
   sector is read back out of PROJECTS, so this block cannot drift from the
   client's data. Array order is z-order and stage position: back to front,
   and the last entry is the one that expands. */
const CHOREO = [
  'action-voice-studio-khar-mumbai',
  'accenture-vikroli',
  '88-pictures-mumbai',
  'ravindra-natya-mandir-prabhadevi',
];

const choreoBand = () => {
  const picks = CHOREO.map(s => PROJECTS.find(p => p.s === s)).filter(Boolean);
  /* A stage missing a plate reads as broken rather than shorter, and the
     positions below are hard-coded to four. Drop the section instead. */
  if (picks.length !== 4) return '';
  const at = ['tl', 'br', 'bl', 'tr'];
  return `
<section class="light choreo" aria-labelledby="choreo-h">
  <div class="choreo-pin">
    <div class="wrap choreo-copy">
      <p class="eyebrow">Selected work</p>
      <h2 id="choreo-h">Four rooms,<br>one way of working.</h2>
    </div>
    <div class="choreo-stage">
      ${picks.map((pr, i) => `<figure class="choreo-plate at-${at[i]}" data-anim="rise">
        <div class="choreo-surface surface ${(SECTORS.find(x => x.name === pr.sec) || {}).surf || 's-plate'}">
          <img src="assets/img/projects/${pr.s}.webp" alt="${esc(pr.n)}${pr.l ? ', ' + esc(pr.l) : ''}" width="760" height="507" loading="lazy" decoding="async">
        </div>
        <figcaption><b>${esc(pr.n)}</b>${pr.l ? esc(pr.l) + ' &middot; ' : ''}${esc(pr.sec)}</figcaption>
      </figure>`).join('\n      ')}
    </div>
    <p class="choreo-foot"><a class="tlink" href="projects.html">All ${PROJECTS.length} in the gallery ${ARROW}</a></p>
  </div>
</section>`;
};


/* =============================== HOME ==================================== */
built.push(page({
  file: 'index.html', active: 'index.html',
  title: 'Silence Acoustic — Acoustic Treatment & Soundproofing, Mumbai',
  desc: 'Acoustic panels, ceilings, foam and soundproofing for auditoriums, studios, offices and homes. Designed, made and installed by our own team in Mumbai.',
  body: `
<section class="hero">
  <div class="hero-top">
  <div class="hero-media" aria-hidden="true">
    <img src="assets/img/projects/adani-bkc-mumbai.webp"
         alt="" width="760" height="570" fetchpriority="high" decoding="async">
  </div>
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">Acoustic treatment &amp; soundproofing &middot; Mumbai</p>
    <h1 class="hero-title">
      <span class="hl"><span style="--d:120">Sound, put</span></span>
      <span class="hl"><span style="--d:240">in its <span class="decay">place.<i class="echo e1" aria-hidden="true">place.</i><i class="echo e2" aria-hidden="true">place.</i></span></span></span>
    </h1>
    <div class="hero-foot">
      <p class="lead hero-lead" data-in style="--d:520">We measure the room, design the treatment, manufacture the panels and install them ourselves — then measure again to prove it worked.</p>
      <div class="row hero-cta" data-in style="--d:640">
        <a class="btn btn-primary" href="contact.html">Book a free site survey ${ARROW}</a>
        <a class="btn btn-ghost" href="products.html">See the products ${ARROW}</a>
      </div>
    </div>
  </div>
  </div>
  <div class="wrap hero-rail">
    <dl class="hero-specs" data-in style="--d:800">
      <div class="hero-spec"><dt>Experience</dt><dd><span class="tick" data-count-to="${YEARS}">${YEARS}</span>+ yrs<small>Designing and installing acoustic products since ${FOUNDED}</small></dd></div>
      <div class="hero-spec"><dt>Manufacturing</dt><dd>In-house<small>CNC cutting, UV printing and assembly</small></dd></div>
      <div class="hero-spec"><dt>Site survey</dt><dd>Free<small>Within Mumbai and the MMR</small></dd></div>
    </dl>
  </div>
</section>

<section class="light railed dip-sec">
  <div class="wrap">
    <span class="rail-label">The distinction</span>
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">Since ${FOUNDED}</p>
        <h2 data-anim="reveal">What ${YEARS} years actually buys you.</h2>
      </div>
      <p class="lead" data-anim="fade">${SITE.projectsCompleted} installations. ${PROJECTS.length} of those rooms photographed on this site. ${SECTORS.length} room types, each designed to its own number. Long enough to tell which of two very different problems you have before anyone quotes you — and long enough to know that getting that one wrong is a wall covered in wasted money.</p>
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
      <p>The room is loud with its own sound. We measure it, set a target, and absorb to it — ${TREAT_N} of our ${PRODUCTS.length} products.</p>
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
      <p>The sound is somebody else's. Mass, isolation and sealing, never absorption — the other ${PROOF_N}.</p>
      <span class="tlink">Membranes, doors and windows ${ARROW}</span>
    </div>
  </a>
  </div>
</section>

${famRail()}

<section class="light railed">
  <div class="wrap">
    <span class="rail-label">Rooms</span>
    <div class="section-head split">
      <div>
        <p class="eyebrow" data-anim="fade">Where we work</p>
        <h2 data-anim="reveal">Every room type has a number to hit.</h2>
      </div>
      <p class="lead" data-anim="fade">A studio and a sports hall both need treating, but they need opposite things. We design to the target for the room's actual use, not to a coverage percentage.</p>
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

${choreoBand()}

<section class="light railed">
  <div class="wrap">
    <span class="rail-label">Work</span>
    <div class="section-head stack">
      <!-- The visible heading, lead and eyebrow were removed by request, and
           the ticker marquee (24 project names + "N rooms photographed") that
           used to sit here was removed by request too — it duplicated the
           actual photo gallery immediately below it. The h2 stays as .vh
           because the six project cards below are h3s — without it they hang
           off the previous section's heading and the page outline reads
           wrong. -->
      <h2 class="vh">Rooms we have finished.</h2>
    </div>
    <div class="gal" data-stagger>
      ${PROJECTS.slice(0, 6).map(pr => `<article class="gal-item" data-anim="tile">
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
    <p class="mt-l" data-anim="fade"><a class="tlink" href="projects.html">All ${PROJECTS.length} in the gallery ${ARROW}</a></p>
  </div>
</section>

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
built.push(page({
  file: 'products.html', active: 'products.html',
  title: 'Acoustic Panels & Soundproofing Products | Silence Acoustic',
  desc: '19 acoustic products: PET panels, ceiling clouds and baffles, foam, wood wool, slats, mass-loaded vinyl, soundproof doors and windows. Made in Mumbai.',
  body: `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">Catalogue</p>
    <h1 data-in style="--d:170">Products</h1>
    <p class="lead" data-in style="--d:280">${PRODUCTS.length} products across five families. Every one is manufactured or assembled in our own facility in Mumbai, and every one can be made to a size, colour or cut pattern that is not on this page.</p>
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
        <div class="pd-hero surface ${p.surf}" data-anim="frame">
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

    ${related.length ? `<hr class="rule">
    <h2 class="sub-h mb-l">Others in ${esc(cat.name)}</h2>
    <div class="grid g3" data-stagger>${related.map(r => productCard(r, '../')).join('\n')}</div>` : ''}
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
built.push(page({
  file: 'about.html', active: 'about.html',
  title: 'About Silence Acoustic — Acoustics, Mumbai',
  desc: 'Twenty years in acoustics, since 2006. We manufacture acoustic material in our own facility and install it ourselves — supplier and installer in one company, with 2035+ projects completed across India.',
  body: `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-in style="--d:60">About</p>
    <h1 data-in style="--d:170">Twenty years in acoustics,<br>as both supplier and installer.</h1>
  </div>
</section>

<section class="dark railed">
  <div class="wrap">
    <span class="rail-label">Company</span>
    <div class="grid g2" data-stagger style="align-items:start;gap:clamp(2rem,5vw,4rem)">
      <div class="stack stack-m">
        <p class="eyebrow" data-anim="fade">Since 2006</p>
        <h2 data-anim="reveal">Supplier and installer,<br>not one or the other.</h2>
        <p class="muted">In acoustics since 2006 &mdash; twenty years, and more than 2,035 rooms completed across India.</p>
        <p class="muted">We are the supplier: the material is made in our own facility, not bought in and resold, so a custom size or a routed pattern is a production decision rather than an import lead time.</p>
        <p class="muted">And we are the installer: our own crews in Mumbai and Maharashtra, certified teams elsewhere. So if a room misses its target, fixing it is our problem &mdash; not a negotiation between two suppliers.</p>
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
      <div class="bento-i" data-anim="rise"><b>${PRODUCTS.length}</b><span>Products, ${CATEGORIES.length} families</span></div>
      <div class="bento-i" data-anim="rise"><b>${PROJECTS.length}</b><span>Rooms photographed</span></div>
      <div class="bento-i bento-wide" data-anim="rise">
        <b>In-house</b><span>Made in Mumbai</span>
        <small>Manufactured in our own facility and installed by our own crews, pan-India.</small>
      </div>
      <div class="bento-i bento-wide" data-anim="rise">
        <b>Verified</b><span>Measured against target</span>
        <small>We return with the meter after handover and check the room against the number it was designed to.</small>
      </div>
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
    <h1 data-in style="--d:170">Let's measure the room.</h1>
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
            <li><span class="k">Office &amp; works</span><span class="v" style="display:block;line-height:1.55">${SITE.addr1}<br>${SITE.addr2}<br>${SITE.addr3}</span></li>
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
