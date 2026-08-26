# Silence Acoustic — silenceacoustic.com

Static marketing site for an acoustic treatment and soundproofing company in
Mumbai. Rebuild of their live WordPress site. 27 pages, no framework, no runtime
dependencies. Node is used only to generate the HTML.

## Commands

```bash
node build.js     # regenerate all 27 pages + sitemap.xml + robots.txt
node serve.js     # local preview on http://localhost:4177
```

There is no test suite, no linter and no package.json. `node build.js` is the
only build step, and it must be run after any change to `src/`.

## Architecture

Content and templates are separate. **Never edit the generated `.html` files at
the repo root or in `products/` — `node build.js` overwrites them.**

| File | Role |
|---|---|
| `src/content.js` | **All copy and data.** Products, specs, projects, sectors, posts, FAQ, contact details. Edit here first. |
| `src/pages.js` | One entry per page. Builds the body HTML for each. |
| `src/build.js` | Page shell (`<head>`, header, footer), shared partials, `page()` writer. |
| `build.js` | Entry point. Requires `src/pages.js` (which writes as a side effect), then emits sitemap + robots. |
| `assets/css/site.css` | Design system: tokens, components, the drawn material textures. |
| `assets/css/motion.css` | Scroll animation, and the structural sections that depend on it (the pinned family rail). Native CSS scroll timelines first; `html.io` is only the Firefox fallback. |
| `assets/js/site.js` | Nav, filters, contact form, light source. |
| `assets/js/motion.js` | Retracting header (all browsers) + the IntersectionObserver reveal fallback (Firefox only). Does **nothing** for reveals on Chrome/Safari. |
| `dist/` | Deploy bundle. Regenerate with the snippet in README. Gitignored. |

Adding a product or project is a `src/content.js` edit plus `node build.js` —
cards, detail pages, filters, counts and the sitemap all follow automatically.

## Non-obvious things that will bite you

**Animation gates visibility, and there are two engines doing it.** Chrome,
Edge and Safari 26 run the reveals entirely in CSS via `animation-timeline:
view()` — `motion.js` is not involved at all. Firefox has no support, so
`motion.js` adds `html.io` and drives the same reveals with an
IntersectionObserver.

This matters when you inspect a page: on Chrome, adding `.in` does **nothing**,
because there is no `.in` rule on that path. Anything below the fold reads as
`opacity: 0`, and `[data-anim="frame"]` clips its contents away entirely, which
looks exactly like a broken image. To force everything visible, kill the
animation rather than adding a class:

```js
document.querySelectorAll('[data-anim]').forEach(e => {
  e.style.cssText += ';animation:none!important;opacity:1!important;' +
                     'transform:none!important;clip-path:none!important;';
});
```

**Scroll reveal is deliberately fail-safe.** Nothing in the stylesheet hides
content on its own. The hidden state comes from `html.io`, which the inline
`HEAD_BOOT` script in `src/build.js` adds *only* on the Firefox path — and that
same script arms a six-second timer to strip it back off unless `motion.js`
arrives and sets `documentElement.dataset.mo`. A blocked, failed or slow script
therefore leaves a plain readable page, never an empty one. Do not "simplify"
this into a CSS-only hidden state.

**`view()` cannot resolve inside `overflow: hidden`.** An `overflow: hidden`
ancestor is a scroll container, so a `view()` timeline on anything inside one
never advances and the element stays stuck at its start state — invisible. This
is why the hero/CTA/page-head walls borrow a *named* timeline
(`view-timeline-name`) published by their section instead of using `view()`
directly, and why `[data-anim]` goes on the `.card` itself and never on
`.card-surface`.

**`.nav a` outranks `.btn-primary`** on specificity. Any button placed in the
nav needs its colour restated or it inherits the muted link grey.

**Photos sit above the light wash.** `.surface > img` is `z-index: 4`, above the
`::after` light gradient at 2. The drawn texture underneath is the intentional
loading/fallback state — every product family has one, so a missing image shows
material rather than a broken icon.

## Content provenance — important

Everything factual on this site came from the client's own live site, crawled
from their sitemap. **Do not invent product specifications, project names,
testimonials or blog posts.** An earlier pass did, and all of it had to be
replaced. If a figure is not published, leave the row out.

- `specs` on each product — transcribed from their product pages
- `PROJECTS` — their projects gallery, with their captions and sector labels
- `TESTIMONIALS` — verbatim, original grammar intact. Do not edit these.
- `assets/img/**` — 265 of their own photographs, converted to WebP

Four spec figures carry `(as published)` because their units are wrong on the
source site (foam density in kg/cm³, slats weight in kg/cm, perforated panel at
32 kg/m³). Keep the marker until the client corrects them. See README.

## Design system

Tokens at the top of `site.css` drive everything; change those, not call sites.

**The palette is neutral.** A true greyscale from `--ink` `#0E0E0F` to
`--paper` `#F2F2F1`. Nothing is warm or cool. There is exactly one hue on the
site.

- `--brand` is the cyan from the client's logo and is the **only** colour,
  reserved for interactive things — links, focus, primary buttons. Because it is
  the only hue, it reads as "you can click this". Do not spend it on decoration.
  `--brand-deep` / `--brand-ink` are the same hue tuned for contrast.
- `--mark` / `--mark-ink` are **neutrals**, not an accent. They carry figures,
  hairline rules and markers. (They replaced `--brass` / `--brass-ink`; if you
  see those names anywhere, that reference is stale.)
- All emphasis is a step in **lightness**, never a change in hue.
- Type: `--display` is Instrument Serif, which ships **one weight**. Hierarchy is
  size, space and measure — nothing here can be emphasised by making it bolder.
  `--body` is Instrument Sans, `--mono` is IBM Plex Mono for labels and specs.
  The families are set in `site.css`; the Google Fonts URL is `FONTS` in
  `src/build.js`. Change both together.
- A fixed 3% film grain sits over the viewport (`body::after`). It is what stops
  the large flat neutrals reading as screen fill. Removing it flattens the site.
- Dark sections and light sections alternate: dark where the page is
  atmospheric, light where it is informational.
- The logo is the client's asset. Scale it, never restyle or recolour it.

**Section shapes are deliberately varied.** The page used to be one shape
repeated — eyebrow + heading left, lead right, then a grid of equal cards — and
eight of those in a row read as a template. Each block now has its own shape:
`.diptych` (full-bleed 50/50 split), the pinned `.rail-sec` family rail,
`.roomdex` (an index, not a tile grid), `.process-grid` (sticky aside),
`.voices` (full-width quote rows), `.statement`, and `.cat-grid` (first product
in each family spans two columns). Reach for an existing shape before adding a
grid of equal cards.

Every text/background pair measures at or above 4.5:1; the lowest is 5.9:1. If
you change a token, re-check.

## Still outstanding

- **Contact form has no endpoint.** Set `SITE.formEndpoint` in `src/content.js`
  (Web3Forms key or Formspree URL) and rebuild. Until then it falls back to the
  visitor's mail client.
- Process steps, the About page commitments and the FAQ answers are written copy,
  not client-confirmed. They include a promise to re-measure and fix a room that
  misses its target.
