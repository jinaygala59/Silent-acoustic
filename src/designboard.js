/* =========================================================================
   design.html — the type and palette board.

   An internal reference page, not a marketing page. It is deliberately NOT
   in NAV, NOT in the sitemap (this module never pushes into the `built`
   array that build.js maps over) and carries a noindex robots tag.

   The one rule that makes it worth having: it reads the tokens out of
   assets/css/site.css at build time and computes the contrast ratios in
   Node. Nothing on this page is a transcribed hex value, so it cannot
   drift from the stylesheet the way a hand-written swatch sheet does —
   `node build.js` after any token change is the whole maintenance story.
   The palette has been reworked several times; a board with typed-in
   hexes would have been wrong within the hour each time.
   ========================================================================= */
const fs = require('fs');
const path = require('path');
const { ROOT, esc, page, nrcBar } = require('./build.js');
const { PRODUCTS, CATEGORIES, SECTORS } = require('./content.js');

/* ---------- read the tokens out of the real stylesheet ---------------- */
const css = fs.readFileSync(path.join(ROOT, 'assets/css/site.css'), 'utf8');

/* Strip comments first: the token block is heavily commented and several
   comments contain `--token:` in prose, which a naive line regex reads as
   a declaration. */
const rootBlock = (css.replace(/\/\*[\s\S]*?\*\//g, '').match(/:root\s*\{([\s\S]*?)\n\}/) || [, ''])[1];

const TOK = {};
for (const m of rootBlock.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) TOK[m[1]] = m[2].trim();

/* --x: var(--y) is used a lot now that .dark aliases the light ramp. */
const val = (name, depth = 0) => {
  const v = TOK[name];
  if (v === undefined || depth > 8) return v;
  const m = v.match(/^var\(\s*--([\w-]+)\s*\)$/);
  return m ? val(m[1], depth + 1) : v;
};
const hex = name => {
  const v = val(name);
  return v && /^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : null;
};

/* ---------- WCAG 2.1 contrast, same maths as the in-page walker ------- */
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lum = h => {
  const s = rgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
};
const ratio = (a, b) => {
  const x = lum(a), y = lum(b), hi = Math.max(x, y), lo = Math.min(x, y);
  return (hi + 0.05) / (lo + 0.05);
};
const r2 = (a, b) => Math.round(ratio(a, b) * 100) / 100;
/* label colour for a swatch: whichever of the two text tokens wins on it */
const onSwatch = h => ratio(h, '#0F172A') >= ratio(h, '#FFFFFF') ? '#0F172A' : '#FFFFFF';

/* ---------- the board ------------------------------------------------- */
/* A named token that no longer resolves renders as a marked gap rather than
   vanishing. The palette is under active rework and tokens do get deleted —
   a board that silently shrinks tells you nothing, and the whole point of
   this page is to catch drift between the stylesheet and the documentation. */
const swatch = name => {
  const h = hex(name);
  if (!h) return `<li class="db-sw db-missing"><b>--${name}</b><span>not defined</span></li>`;
  return `<li class="db-sw" style="background:${h};color:${onSwatch(h)}">
        <b>--${name}</b><span>${h}</span>
      </li>`;
};
const ramp = (title, note, names) => `<section class="db-block">
      <h2 class="sub-h">${esc(title)}</h2>
      <p class="db-note">${note}</p>
      <ul class="db-ramp">${names.map(swatch).join('')}</ul>
    </section>`;

/* The nineteen drawn material textures. Discovered by reading the stylesheet
   rather than listed here, for the same reason the hexes are: they get added
   and removed, and a hand-kept list would be wrong. A pass once deleted all
   nineteen and hard-coded s-plate across the templates; every surface on the
   site silently went blank and nothing caught it. This section is what would
   have caught it. */
const SURFACES = [...new Set(
  css.replace(/\/\*[\s\S]*?\*\//g, '')
     .matchAll(/^\.(s-[a-z]+)::before/gm)
)].map(m => m[1]);

/* Which content actually references each one, so an orphan shows. All three
   lists matter: products carry `surf` directly, the five families use one for
   the homepage rail, and the ten room types use one for the gallery and the
   room index. Miss SECTORS out and half the textures read as unused. */
const usersOf = surf => [
  ...PRODUCTS.filter(p => p.surf === surf).map(p => p.name),
  ...CATEGORIES.filter(c => c.surf === surf).map(c => c.name + ' (family)'),
  ...SECTORS.filter(x => x.surf === surf).map(x => x.name + ' (room)'),
];

/* s-plate is the neutral placeholder and is referenced from code rather than
   from data — it is the `|| 's-plate'` fallback in src/pages.js for a room
   type with no surface of its own. It should read as held-in-reserve, not as
   an orphan. Anything else with no users is a real orphan. */
const FALLBACK = 's-plate';

const FAMILIES = [
  ['--display', 'display', 'Bricolage Grotesque', 'Headings, pull-quotes, sector and roomdex names, step numerals.'],
  ['--body', 'body', 'Public Sans', 'Running copy, leads, table cells.'],
  ['--mono', 'label', 'Public Sans', 'Every label, spec figure, button and filter pill \u2014 no longer monospace; the token name is kept only because 46 rules consume it.'],
];

const SCALE = ['t-hero', 't-h1', 't-h2', 't-h3', 't-lead', 't-body', 't-mono'];
const WIDTHS = [['wd-hero', 'hero'], ['wd-h2', 'h2'], ['wd-h3', 'h3'], ['wd-label', 'label']];

/* The pairs this board measures. NOT exhaustive and not the authority —
   the DOM walker in the README composites real rendered grounds, including
   gradient stops, and is what a token change must actually be checked
   against. This list is the subset that can be stated from tokens alone. */
const PAIRS = [
  ['on-light', 'paper-hi'], ['on-light', 'paper'], ['on-light', 'paper-lo'],
  ['on-light-mute', 'paper-hi'], ['on-light-mute', 'paper'], ['on-light-mute', 'paper-lo'],
  ['mark-ink', 'paper-hi'], ['mark-ink', 'paper'], ['mark-ink', 'paper-lo'],
  ['brand', 'paper-hi'], ['brand', 'paper'], ['brand', 'paper-lo'],
  ['brand-lift', 'paper'], ['brand-ink', 'paper'],
];

const pairRow = ([fg, bg]) => {
  const f = hex(fg), b = hex(bg);
  if (!f || !b) return `<tr class="db-fail"><td><code>--${fg}</code></td><td><code>--${bg}</code></td>
        <td class="db-num">&mdash;</td><td>token no longer defined in site.css</td></tr>`;
  const v = r2(f, b);
  const pass = v >= 4.5;
  return `<tr class="${pass ? '' : 'db-fail'}">
        <td><code>--${fg}</code></td><td><code>--${bg}</code></td>
        <td class="db-num">${v.toFixed(2)}:1</td>
        <td>${pass ? 'AA' : 'below 4.5 &mdash; not body text'}</td>
      </tr>`;
};

const pillFg = '#FFFFFF', pillBg = hex('brand-deep');
const markHex = hex('brand-mark'), paperHex = hex('paper');
const worst = PAIRS.map(([f, b]) => hex(f) && hex(b) ? ratio(hex(f), hex(b)) : Infinity)
  .concat(pillBg ? [ratio(pillFg, pillBg)] : []);
const lowest = Math.round(Math.min(...worst) * 100) / 100;

const STYLE = `<style>
  .db-wrap { max-width: var(--max); margin-inline: auto; padding: clamp(2rem,5vw,4rem) var(--gut) var(--pad-y); }
  /* site.css gives every <section> --pad-y (141px a side at this width), which
     is right for a marketing page and absurd for a reference sheet. */
  .db-block { margin-block: clamp(2.5rem,5vw,4rem); padding-block: 0; }
  .db-block h2 { margin-bottom: 0.4rem; }
  /* A bare h1/h2 carries no size in site.css — the scale lives on .hero-title,
     .page-head h1 and friends — so the board has to name its own. */
  .db-wrap > h1 { font-size: var(--t-h1); margin-bottom: 0.75rem; }
  .db-note { color: var(--on-light-mute); max-width: var(--measure); margin-bottom: 1.25rem; }
  .db-ramp { list-style: none; display: grid; gap: 2px;
             grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); }
  /* The hairline is load-bearing, not trim: --paper-hi is #FFFFFF, so
     without an edge that swatch is invisible against the page ground and
     reads as a gap in the ramp. */
  .db-sw { min-height: 6.5rem; padding: 0.75rem; display: flex; flex-direction: column;
           justify-content: flex-end; gap: 0.15rem; border-radius: var(--r-sm, 0);
           box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.12);
           font-family: var(--mono); font-size: var(--t-mono); }
  .db-sw b { font-weight: 500; }
  .db-missing { color: var(--on-light-mute); box-shadow: none;
                border: 1px dashed var(--paper-edge); }
  .db-sw span { opacity: 0.75; }
  .db-fam { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
  .db-spec { border: 1px solid var(--paper-lo); border-radius: var(--r-sm, 0); padding: 1.25rem; }
  .db-aa { font-size: 4.5rem; line-height: 1; margin-bottom: 0.75rem; display: block; }
  .db-stack { font-family: var(--mono); font-size: var(--t-mono); color: var(--on-light-mute);
              word-break: break-word; margin-top: 0.5rem; }
  .db-scale li { list-style: none; border-top: 1px solid var(--paper-lo); padding-block: 0.9rem;
                 display: grid; gap: 0.35rem; }
  .db-scale .db-sample { font-family: var(--display); font-weight: var(--w-display); line-height: 1; }
  .db-scale code { font-family: var(--mono); font-size: var(--t-mono); color: var(--on-light-mute); }
  .db-widths li { list-style: none; font-family: var(--display); font-weight: var(--w-display);
                  font-size: clamp(2rem,5vw,3.25rem); line-height: 1.05; }
  .db-widths code { font-family: var(--mono); font-size: var(--t-mono); color: var(--on-light-mute);
                    margin-left: 0.75rem; }
  .db-tbl { width: 100%; border-collapse: collapse; }
  .db-tbl th, .db-tbl td { text-align: left; padding: 0.6rem 0.75rem 0.6rem 0;
                           border-bottom: 1px solid var(--paper-lo); font-size: 0.9375rem; }
  .db-tbl th { font-family: var(--mono); font-size: var(--t-mono); text-transform: uppercase;
               letter-spacing: 0.16em; color: var(--on-light-mute); }
  .db-tbl code { font-family: var(--mono); font-size: 0.8125rem; }
  .db-num { font-family: var(--mono); font-variant-numeric: tabular-nums; }
  .db-fail td { color: var(--on-light-mute); }
  .db-tbl-wrap { overflow-x: auto; }
  .db-mats { list-style: none; display: grid; gap: 1rem;
             grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr)); }
  .db-mats li { display: grid; gap: 0.3rem; font-family: var(--mono); font-size: var(--t-mono); }
  .db-mat { display: block; aspect-ratio: 4 / 3; border-radius: var(--r-sm, 0);
            box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.12); }
  .db-mat-use { color: var(--on-light-mute); line-height: 1.4; }
  .db-nrc { display: grid; gap: 1.75rem;
            grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
</style>`;

const body = `<div class="db-wrap">
  <p class="eyebrow"><span>Internal reference</span></p>
  <h1>Type and palette</h1>
  <p class="lead">Every value on this page is read out of
  <code>assets/css/site.css</code> when <code>node build.js</code> runs, and every
  ratio is computed here rather than transcribed. If a token moves, rebuild and this
  page moves with it. Not linked from the site and not in the sitemap.</p>

  <section class="db-block">
    <h2 class="sub-h">The three families</h2>
    <p class="db-note">One role each. Hierarchy in the display face is width, not weight —
    everything is held at <code>--w-display</code> ${esc(val('w-display') || '')}.</p>
    <div class="db-fam">
      ${FAMILIES.map(([tok, role, label, use]) => `<div class="db-spec">
        <span class="db-aa" style="font-family: var(${tok})">Aa</span>
        <b>${esc(label)}</b>
        <p class="db-note" style="margin:0.25rem 0 0">${esc(use)}</p>
        <p class="db-stack">${esc(tok)}: ${esc(val(tok.slice(2)) || '')}</p>
      </div>`).join('')}
    </div>
  </section>

  <section class="db-block">
    <h2 class="sub-h">Width, not weight</h2>
    <p class="db-note">The same word at each step of Bricolage's <code>wdth</code> axis.
    A long wavelength is a wide mark.</p>
    <ul class="db-widths">
      ${WIDTHS.map(([tok, name]) => `<li style="font-variation-settings:'wdth' ${esc(val(tok) || '100')}">
        Absorption<code>--${tok} ${esc(val(tok) || '')}</code></li>`).join('')}
    </ul>
  </section>

  <section class="db-block">
    <h2 class="sub-h">The scale</h2>
    <p class="db-note">Rendered at the size this viewport actually resolves the clamp to —
    resize the window and the samples move.</p>
    <ul class="db-scale">
      ${SCALE.map(t => `<li>
        <span class="db-sample" style="font-size: var(--${t})${t === 't-mono' || t === 't-body' || t === 't-lead' ? ';font-family:var(--body);font-weight:400' : ''}">Sound, put in its place</span>
        <code>--${t}: ${esc(val(t) || '')}</code>
      </li>`).join('')}
    </ul>
  </section>

  ${ramp('The ground', 'One ramp, near-white to slate. There are no dark sections — <code>.dark</code> and <code>.light</code> resolve to the same steps, and the <code>--ink-*</code> names survive only because call sites use them.', ['paper-hi', 'paper', 'paper-sub', 'paper-lo', 'paper-edge'])}

  ${ramp('Text', 'The first three are measured against every ground below. The last two are the banner\u2019s own \u2014 they sit on a photograph behind a scrim, not on a token ground, so no pair here can state their contrast.', ['on-light', 'on-light-mute', 'mark-ink', 'on-banner', 'mark-banner'])}

  ${ramp('The accent — one hue at three exposures', 'The client’s logo cyan darkened until it can carry text. <code>--brand-deep</code> is a solid pill fill only. <code>--brand-mark</code> is the raw logo cyan and is never type.', ['brand', 'brand-lift', 'brand-deep', 'brand-mark'])}

  ${ramp('Material', 'Colour on this site means which material you are looking at. These appear as the NRC bar fill and family markers, never as a ground under text.', ['mat-pet', 'mat-cloud', 'mat-foam', 'mat-wood', 'mat-proof'])}

  <section class="db-block">
    <h2 class="sub-h">The drawn materials</h2>
    <p class="db-note">${SURFACES.length} textures, read out of the stylesheet rather than
    listed here. <code>.surface &gt; img</code> sits <b>above</b> these, so the drawn material
    is what shows while a photograph loads and what stays if one ever 404s — they are the
    fallback, not decoration. Each keeps its own temperature; do not pull them onto the
    accent hue.</p>
    <ul class="db-mats">
      ${SURFACES.map(sf => {
        const used = usersOf(sf);
        return `<li>
        <span class="surface db-mat ${sf}"></span>
        <b>.${sf}</b>
        <span class="db-mat-use">${used.length ? esc(used.slice(0, 2).join(', ')) + (used.length > 2 ? ` +${used.length - 2}` : '') : (sf === FALLBACK ? '<em>fallback, held in reserve</em>' : '<em>unused &mdash; orphan</em>')}</span>
      </li>`;
      }).join('')}
    </ul>
  </section>

  <section class="db-block">
    <h2 class="sub-h">The NRC bar</h2>
    <p class="db-note">The one signature device. NRC is already a proportion — 0.85 means
    85% of incident sound energy absorbed — so the bar states the figure rather than
    illustrating it. Filled run is the absorbed share in the material’s own colour; the
    empty run is the paper, i.e. what comes back off the wall. It renders only where the
    client publishes an NRC: <b>${PRODUCTS.filter(p => p.specs && p.specs['NRC']).length} of
    ${PRODUCTS.length}</b> products. The rest show nothing rather than a bar at an invented
    value.</p>
    <div class="db-nrc">
      ${['acoustic-polyester-panel', 'acoustic-foam', 'acoustic-wooden-slats']
        .map(sl => PRODUCTS.find(p => p.slug === sl)).filter(Boolean)
        .map(p => `<div><p class="db-stack" style="margin:0 0 .5rem">${esc(p.name)}</p>${nrcBar(p)}</div>`).join('')}
    </div>
  </section>

  <section class="db-block">
    <h2 class="sub-h">Contrast</h2>
    <p class="db-note">Computed from the tokens above at build time. This is the subset
    that can be stated from tokens alone — it is <b>not</b> the authority. The DOM walker
    in the README composites real rendered grounds, reads gradient stops and applies the
    large-text allowance; run that after a token change. Text over photographs
    (the hero, gallery surfaces, product heroes) is excluded from both: its contrast
    comes from a designed scrim, and scoring it produces false failures.</p>
    <div class="db-tbl-wrap">
      <table class="db-tbl">
        <thead><tr><th>Text</th><th>On</th><th>Ratio</th><th>Verdict</th></tr></thead>
        <tbody>
          ${PAIRS.map(pairRow).join('')}
          ${pillBg ? `<tr><td><code>#FFFFFF</code></td><td><code>--brand-deep</code></td>
            <td class="db-num">${r2(pillFg, pillBg).toFixed(2)}:1</td>
            <td>AA &mdash; the primary pill, measured against its own fill</td></tr>` : ''}
          ${markHex && paperHex ? `<tr class="db-fail"><td><code>--brand-mark</code></td><td><code>--paper</code></td>
            <td class="db-num">${r2(markHex, paperHex).toFixed(2)}:1</td>
            <td>never type &mdash; the logo asset keeps this colour, nothing else reaches for it</td></tr>` : ''}
        </tbody>
      </table>
    </div>
    <h3 class="sub-h" style="margin-top:2rem">The banner is measured separately</h3>
    <p class="db-note">Its type sits on a swappable photograph behind a white two-gradient
    scrim, so no token pair states it. The scrim floor across the left half, where the type
    sits, is 0.643 — over the worst case a photograph can present (pure black) that is
    <b>7.1:1</b>. Measured against the real composite instead of the worst case, by
    replicating the scrim on a canvas over the actual image and sampling inside the eyebrow,
    h1 and lead boxes: <b>8.99:1</b> for <code>--on-banner</code> and <b>4.75:1</b> for
    <code>--mark-banner</code>. Lower those alphas to show more of the picture and the
    arithmetic has to be redone against black, not against the photograph you like.</p>

    <p class="db-note" style="margin-top:1.25rem">Lowest measured pair on this page,
    excluding the <code>--brand-mark</code> row (never type): <b>${lowest.toFixed(2)}:1</b>.
    The banner is measured separately, below.</p>
  </section>
</div>`;

const file = page({
  file: 'design.html',
  title: 'Type and palette — internal reference',
  desc: 'Build-time reference for the Silence Acoustic design system: the three type families, the scale, the token ramps and the measured contrast pairs.',
  active: '',
  body,
});

/* page() has no noindex hook and this is the only page that wants one, so
   patch the head rather than widening the shared shell's signature. The
   board's CSS goes in the same pass: site.css is under active edit and a
   one-page block does not belong in the shared stylesheet. */
const out = path.join(ROOT, file);
fs.writeFileSync(out, fs.readFileSync(out, 'utf8')
  .replace('</head>', `<meta name="robots" content="noindex, nofollow">\n${STYLE}\n</head>`));

module.exports = file;
