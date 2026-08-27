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

**A dark ground does not make its text light.** Section colour on this site is
opt-in via the `.dark` class, and two dark surfaces do not carry it: `.rail-sec`
paints `var(--ink)` itself in `motion.css`, and `.gal-item` is a dark card
sitting inside a `.light` section. Anything inheriting a colour inside those —
`.eyebrow`, `.lead`, a bare `h3` — gets the *paper* ground's near-black on an
espresso fill and disappears at 1.4–1.8:1. Both were live bugs; the fixes name
those selectors explicitly next to the `.dark` rules in `site.css`. If you add a
dark section, either give it `.dark` or add it to those selectors, then re-run
the contrast check — this failure is invisible in code review and obvious on
screen.

**The hero's spec rail spans the full width, and the sample band must not.**
The band (`.hero-wall`) used to run the whole height of the hero, so the rail's
last two columns sat on dark timber with `--mark-ink` figures and
`--on-light-mute` captions on it — about 1.3:1. "Free / Within Mumbai and the
MMR" was simply not on the page. The band is now scoped by a `.hero-top`
wrapper (`src/pages.js`) that holds the wall and the statement only; the rail
is a sibling below it, so the band ends where the statement ends. `.hero-top`
is `position: relative` (it is the wall's containing block) and
`overflow: hidden`, because `mWall` scales the band 1.14 and would otherwise
spill ~68px down over the rail. That clip is safe even though `view()` cannot
resolve inside `overflow: hidden` — the wall borrows the *named* `--hero`
timeline, and the copy's drift is on `scroll(root block)`.

**Do not solve that by giving the rail its own background.** The obvious fix is
a `--paper-lo` plinth on `.hero-rail` that covers the band. It fails, and not
at page load: `mDrift` in `motion.css` fades `.hero .wrap` to `opacity: 0.25`
across the first 78vh of scroll, and the rail *is* a `.hero .wrap`, so the
plinth fades with it and the band reads straight back through as you scroll.
Anything that hides the wall has to live outside the drifting layer. Verify a
change here by walking the scroll positions and comparing the wall's
`getBoundingClientRect().bottom` (transform included, clipped to `.hero-top`)
against the rail's `top` — a static screenshot at scroll 0 will not show it.

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

**The palette is the logo, at different exposures.** The whole ramp is the
Silence Acoustic cyan — `#1CABDE`, hue ~202° — held at different saturations
and lightnesses. Desaturated and darkened it becomes `--ink` `#172127`, the
slate-teal rooms; lifted almost to white it becomes `--paper` `#E6ECEF`. One
hue, top to bottom. That is what makes the mark read as native to the page.

Take the exact logo colours from the asset, not from memory. `logo-full.png`
is `#1CABDE` cyan, `#292A27` wordmark, `#676969` headphones.

(This replaced two earlier schemes: a neutral greyscale, then a warm espresso
ramp. If you see `#2A2A2E`, `#E4E4E2`, `#2E2822`, `#E9E4DA`, or any
`rgba(46, 40, 34, …)` / `rgba(233, 228, 218, …)` scrim, that reference is
stale.)

**Nothing large is a flat fill.** Grounds are an ombre between two steps of the
ramp:

| token | ramp | used by |
|---|---|---|
| `--ombre-dark` | `#28363E` → `#172127` → `#05080A` | `.dark`, `.rail-sec`, `.dip` |
| `--ombre-light` | `#FCFDFD` → `#E6ECEF` → `#A9B4BA` | `.light`, `.hero`, `.page-head`, `.cta-band` |

Both run at `168deg` — near-vertical with a slight lean. The dark ombre
travels about **1.6x in luminance** end to end; the light one **2.2x**.

`.hero` is the one exception to the shared stop positions. It keeps the same
angle and the same three endpoints but compresses them to `0/24/50%`, because
the hero is ~960px tall and only its top two thirds are ever seen — at the
site-wide `0/52/100%` the visible left band travelled only 1.17x and read as
flat white. The 50% end stop is also where the spec rail's plinth joins. Both
numbers are measured in the page; the long comment on `.hero` in `site.css`
says how to re-measure them if the hero's height changes.

**The two ends of each ombre are not equally free.** Pushing the dark ombre
deeper and the light ombre lighter costs nothing: it only adds contrast under
the text. The other two directions bind, and each has exactly one limiter:

- `--ink-lift` (top of the dark ombre) is capped by `--brand` on it, at 4.7:1.
  The logo cyan is fixed, so that is a hard ceiling, not a preference.
- `--paper-lo` (bottom of the light ombre) is capped by the light-side **text**
  tokens sitting on it. An earlier version of this file named `--mark-ink` at
  5.3:1 as the limiter; that was wrong — `--brand-ink` bound first at 4.75:1,
  then `--on-light-mute` at 4.89:1.

That distinction matters, because it means `--paper-lo` was never capped by
anything fixed. Asked for a stronger light ombre, the move was to darken
`--brand-ink`, `--on-light-mute` and `--mark-ink` (darkening text only ever
*raises* contrast) so they hold ≥4.7:1 against a deeper `--paper-lo`. That took
the light ombre from 1.66x to 2.20x.

**There is much less room for a third round of that.** It spends two things:
muted text is now 8.4:1 on `--paper` where it was 6.7:1, so the step down from
`--on-light` (15.3:1) is 1.8x rather than 2.3x — and on this site that gap *is*
the hierarchy, since nothing can be emphasised by weight. `--paper-edge` also
had to follow `--paper-lo` down to stay visible as a hairline, which makes
every card border slightly firmer. Push `--paper-hi` and `--ink-deep` (both
still free) before touching this again, and re-run the gradient check. **Objects that sit on a ground stay flat** — cards, panels, form
fields, filter pills. Light belongs to the room, not to the things standing in
it, and a gradient under small text makes its contrast unpredictable. Do not
"finish the job" by gradient-ing the cards.

Because text now sits on gradients, contrast must hold at **every stop**, not
against one flat value. The check in the next section does that.

- `--brand` is the exact logo cyan and is the **only** saturated colour,
  reserved for interactive things — links, focus, primary buttons. Do not spend
  it on decoration. `--brand-deep` / `--brand-ink` are the same hue tuned for
  contrast.
- `--mark` / `--mark-ink` are the same hue washed almost out — they carry
  figures, hairline rules and markers. Do not saturate them "to match the
  logo": a second strong cyan cancels the first. (They replaced `--brass` /
  `--brass-ink`; if you see those names, that reference is stale.)
- All emphasis is a step in **lightness**, never a change in hue.
- **The drawn material swatches are the deliberate exception** and keep their
  own temperatures: PET felt warm neutral, timber warm brown, wood wool straw,
  foam cold near-black, proofing cold graphite. That is what makes a page of 19
  cards read as a materials library. Do not pull them onto the site hue — a
  cyan foam swatch stops looking like foam.
- Type: `--display` is Archivo, which ships **one weight**. Hierarchy is
  size, space and measure — nothing here can be emphasised by making it bolder.
  `--body` is Instrument Sans, `--mono` is IBM Plex Mono for labels and specs.
  The families are set in `site.css`; the Google Fonts URL is `FONTS` in
  `src/build.js`. Change both together.
- A fixed 3% film grain sits over the viewport (`body::after`). It is what stops
  the large flat grounds reading as screen fill. Removing it flattens the site.
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

Every rendered text/background pair measures at or above 4.5:1; the lowest on
any page is 4.7:1 — the brand-cyan link on the lightest stop of the dark ombre.
The light side now runs it close at 4.72:1 (`--brand-ink` on `--paper-lo`).
That margin is thin by design: it is the price of the current ombre strength,
and it means a token nudge can push the site under AA. That is measured, not assumed — the check walks every
element with a text node, composites the real background down the ancestor
chain, and applies the WCAG large-text allowance. **Where the ground is a
gradient it parses the stops out of the computed `background-image` and scores
against the worst one**, which is the only way a gradient ground can be
verified. About a third of the site's text sits on one. If you change a token
or an ombre, re-run it rather than eyeballing.

## Still outstanding

- **Contact form has no endpoint.** Set `SITE.formEndpoint` in `src/content.js`
  (Web3Forms key or Formspree URL) and rebuild. Until then it falls back to the
  visitor's mail client.
- Process steps and the About page's four commitments (`src/pages.js`, the
  "Four things we will not do" section) are written copy, not client-confirmed.
  They include a promise to re-measure and fix a room that misses its target.
  The FAQ is no longer in this category — as of the last content sync it is
  transcribed verbatim from the live site's About-page FAQ block, not written
  copy. See the "content sync" note in git history for what else was checked
  against the live site and when.
