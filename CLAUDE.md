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
| `src/designboard.js` | Writes `design.html`, the internal type-and-palette board. Reads the tokens back out of `site.css` and computes the contrast ratios itself. Never enters the `built` array, so it stays out of the sitemap. |
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

**The scroll choreography is a second pin, and it is measured in the page.**
`.choreo` (homepage, immediately before the Work gallery) is a 300vh section
with a sticky 100vh child: four project photographs trade places, stack at the
centre, and the last opens to full bleed. It is a port of a framer-motion
component to the site's own engine — no library, no dependency.

Two things about it are load-bearing. The plates take the **named** `--choreo`
timeline, never `view()`, because `.choreo-pin` is `overflow: hidden` (see the
next note). And the hero plate animates its own `width`/`height`/`margin`
rather than scaling, so the photograph is never distorted — the margins carry
the centring, so they must track the size at every keyframe: margin is always
minus half. Below 48rem, under reduced motion, or without native scroll
timelines, the identical markup is a plain captioned 2×2 grid. That is the
default; the pin is layered on top, exactly like the family rail.

**You cannot verify either pin from a hidden browser pane.** Scroll-driven
animations are not sampled when the pane is not painting: `currentTime` reads
`null`, transforms read `none`, and `requestAnimationFrame` never fires, so
every rAF-based probe times out. The pre-existing `.rail-sec` behaves
identically, which is the control to check before concluding new code is
broken. Screenshots only capture the paint at load, so a scrolled screenshot
comes back blank — move the section to the top of `<main>` instead.

**`view()` cannot resolve inside `overflow: hidden`.** An `overflow: hidden`
ancestor is a scroll container, so a `view()` timeline on anything inside one
never advances and the element stays stuck at its start state — invisible. This
is why the hero/CTA/page-head walls borrow a *named* timeline
(`view-timeline-name`) published by their section instead of using `view()`
directly, and why `[data-anim]` goes on the `.card` itself and never on
`.card-surface`.

**Section colour is opt-in, and `.dark` is a real second ground again.**
`.dark` means "the deeper of two light ombres", not "near-black" — it is still
a light ramp, just a visibly lower one. The old failure
mode here — `.rail-sec` and `.gal-item` painting a dark fill while their text
inherited the paper ground's near-black — is gone with the dark grounds. What
replaced it is the same bug on the one saturated fill: see the `.fam-all` note
in the design system section. Any element that sets its own background must
name the colour of every piece of text inside it.


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

**Photos sit above the light wash.** `.surface > img` is `z-index: 4`, above
the `::after` light gradient at 2. What shows underneath while an image loads
is now `.s-plate`, a neutral light placeholder, rather than a per-family
material swatch. Decorative walls that carried no photograph at all
(`.hero-wall`, `.page-wall`, `.cta-wall`, `.dip-surface`) were deleted outright
along with their `mWall` animations in `motion.css`.

**`design.html` is generated from the stylesheet, not written.** The board
(`src/designboard.js`) parses the `:root` block of `assets/css/site.css` at
build time — strips comments first, because several of them contain
`--token:` in prose — resolves `var(--x)` aliases, and computes every
contrast ratio in Node. Nothing on that page is a transcribed hex, so it
cannot drift the way a hand-written swatch sheet does; `node build.js` after
a token change is the whole maintenance story.

Three things about it are deliberate. It is **not** in `NAV` and **not** in
the sitemap (the module never pushes into `built`), and it carries a
`noindex` tag patched into the head after `page()` returns — the shared shell
has no noindex hook and one page did not justify widening its signature. Its
CSS is a `<style>` block in that same patch rather than a section of
`site.css`, because a one-page reference block does not belong in the shared
stylesheet. And a token in its lists that no longer resolves renders as a
dashed **"not defined"** cell instead of vanishing — the board's job is to
surface drift between the stylesheet and this file, so a silent gap would
defeat it. It earned that already: `--on-dark-fixed` showed as *not defined*
after the hero was inverted and the token became `--on-banner`, which is how
the stale reference was found.

The same applies to the material textures. The board reads the `.s-*` rules
straight out of `site.css` and lists, for each, the products, families and
room types that reference it — so a texture nothing uses shows as an orphan,
and a texture that has been deleted stops appearing at all. A pass once
removed all nineteen and hard-coded `s-plate` across the templates; every
surface on the site went blank and nothing caught it. This section is what
catches that. `.s-plate` itself is labelled *fallback, held in reserve*
rather than orphaned — it is referenced from code, as the `|| 's-plate'`
default in `src/pages.js`, not from data.

Its contrast table is **not the authority** — it can only state pairs
derivable from tokens alone. The DOM walker described below composites real
rendered grounds, reads gradient stops and applies the large-text allowance.
Run that after a token change; the board is the quick read.

## Content provenance — important

Everything factual on this site came from the client's own live site, crawled
from their sitemap. **Do not invent product specifications, project names,
testimonials or blog posts.** An earlier pass did, and all of it had to be
replaced. If a figure is not published, leave the row out.

- `specs` on each product — transcribed from their product pages
- `PROJECTS` — their projects gallery, with their captions and sector labels
- `TESTIMONIALS` — verbatim, original grammar intact. Do not edit these.
  **The reviewers are real, identifiable people** named with their
  organisations. Synthetic headshots have been asked for three times and
  declined three times: a generated face published as one of their portraits
  is a fabricated likeness presented as genuine, and none of them consented.
  The cards carry a monogram of the initial, which impersonates nobody. Real
  client-supplied photographs, with permission, are the only thing that may
  replace it. The full reasoning sits next to `.review-avatar` in `site.css`,
  where whoever next edits that block will find it.
- `assets/img/**` — 265 of their own photographs, converted to WebP

Four spec figures carry `(as published)` because their units are wrong on the
source site (foam density in kg/cm³, slats weight in kg/cm, perforated panel at
32 kg/m³). Keep the marker until the client corrects them. See README.

## Design system

Tokens at the top of `site.css` drive everything; change those, not call sites.

**The direction is "Coefficient": two light grounds, and colour means
material.** The ground is a cool slate ramp with text at `--on-light`
`#0F172A` and muted at `--on-light-mute` `#3F4C5E`. There are **two ombres,
and they are not the same**:

| token | stops | luminance |
|---|---|---|
| `--ombre-light` | `#FBFCFD` → `#EEF3F8` → `#CBD5E1` | 0.972 / 0.891 / 0.657 |
| `--ombre-dark`  | `#E4EAF1` → `#D5DEE8` → `#BAC6D6` | 0.817 / 0.722 / 0.557 |

**This was the "too white" bug, and it is worth understanding before you
undo it.** `--ombre-dark` used to be a byte-for-byte alias of
`--ombre-light`, so `.dark` and `.light` rendered identically. Measured on
the homepage, all nine sections below the hero read 1.000 / 0.954 / 0.657 —
the same gradient nine times — and because it started at `#FFFFFF` you met
pure white nine times scrolling down. Every contrast check passed the whole
time. A floor check cannot see sameness, which is exactly why it survived.

So `.dark` is load-bearing now. Every template alternates; no page has two
adjacent `.dark` sections, and none starts a section at pure white. Sequences
(P=page-head, L=light, D=dark, C=cta):

```
index     H L D L D L L L D C      products  P D L D L D L C
projects  P D L D C                about     P D L D C
blog      P D C                    contact   P L
```

Read that sequence from the *rendered* grounds, not from the markup.
`.rail-sec` takes `--ombre-dark` from its own CSS rule rather than from a
`.dark` class, so counting `class="dark"` in the built HTML reports index as
`H L L L D L L L D C` and understates the rhythm by one section. Measure
`getComputedStyle(section).backgroundImage`; do not grep the class.

`contact` and the article are deliberately single-ground: two or three
sections carry no rhythm, and a form's labels and helper text are the last
thing that should sit on the deepest ground.

The stops are literals rather than `var(--paper-*)` on purpose. Those tokens
are still the flat fills for cards, panels and fields — a card reads white
*because* the section under it does not — so wiring the ombres through them
would drag the cards down with the grounds and cancel the effect.

How deep the grounds can go is capped by the text on them, not by taste.
`--on-light-mute` was darkened `#475569` → `#3F4C5E` to buy the current
depth; it measured 4.38:1 against the new deep end otherwise. Darkening text
only ever raises contrast, so that is the free side of the trade — but it is
not free forever: `--on-light` and the mute are now **2.05:1 apart**, and
another round of darkening starts flattening body copy against secondary
copy. Past that, the answer is a lighter ground, not darker text.

The `.dark` class and the `--ink-*` / `--on-dark*` token names still cover
~200 call sites. Do not restore a *near-black* section — that is a different
thing and it is not coming back.

(This replaced a cyan-ramp scheme with alternating dark/light ombres, and
before that a warm-espresso and a neutral-greyscale one. If you see `#172127`,
`#E6ECEF`, `#2E2822`, `#E9E4DA`, `#2A2A2E`, or a warm greige `#F4EFE7` /
`rgba(237, 231, 221, …)` scrim, that reference is stale.)

**Colour on this site means one thing: which material you are looking at.**
The five product families keep their own temperatures, and they appear as the
NRC bar fill and family markers — never as a ground under text:

| token | material | family |
|---|---|---|
| `--mat-pet` `#7C8380` | PET felt, warm neutral | panels |
| `--mat-cloud` `#93A1A6` | the same board, lifted | ceilings |
| `--mat-foam` `#33383C` | profiled PU foam, cold near-black | foam |
| `--mat-wood` `#8A6A44` | timber and wood wool, warm brown | wood |
| `--mat-proof` `#5A646E` | cold graphite | soundproofing |

Do not add a sixth for a non-material purpose, and do not pull them onto the
accent hue: a tinted foam swatch stops looking like foam. The marker is
scoped to `.card[data-mat]` and `.fam[data-mat]`, so it appears on products
and product families only — a blog post is not a material and must not carry
one.

**The nineteen drawn material swatches are load-bearing, not decoration.**
`.s-felt`, `.s-slat`, `.s-wedge` and the rest are the `::before` of
`.surface`, and `.surface > img` sits *above* them — so the drawn material is
what shows while a photograph loads and what stays if one ever 404s. Every
product family has its own, which is what makes nineteen cards read as a
materials library rather than a grid of failed images. Each item's class
comes from its own data (`PRODUCTS[].surf`, `CATEGORIES[].surf`,
`SECTORS[].surf`) — never hard-code `s-plate` across the templates, which a
pass did once and which silently blanked every surface on the site.

**The accent is the client's blue — one hue, at three exposures.**
The whole `--brand-*` ramp is the logo cyan `#1CABDE` (hue ~202°) darkened
until it can carry text. `--brand` `#0B5578` carries links, labels and
`.tlink` (5.48:1 worst); `--brand-lift` `#083E58` is hover, always a step
darker and never lighter; `--brand-deep` `#10789C` is a **solid pill fill
only**, carrying `#FFFFFF` at 5.01:1 — at 3.13:1 on `--paper-lo` it is not
text-safe, so never set it as a `color`.

`--brand-mark` `#1CABDE` is the raw logo cyan. It measures **2.24:1** on
paper and can therefore never be type; it exists so the logo asset keeps its
own colour and nothing else reaches for it. Emphasis moves in lightness
within this one hue — never to a second colour.

Do not spend the blue on decoration. Putting `--brand` on something
non-interactive is what made an earlier palette's eyebrows read as wallpaper.

**An earlier pass ran this as a burnt orange** (`--brand: #9A3412`,
`--brand-deep: #C2410C`, from a safety-orange `#EA580C`). That was not the
brand colour. There is no orange on this site; if you see those values, the
reference is stale.

**The hero is the one place text does not sit on a token ground.** Its type
sits on a swappable banner **photograph** behind a designed two-gradient
scrim, so its colours are named separately — `--on-banner` `#0F172A` and
`--mark-banner` `#3A4759` — and are the banner's, not the palette's.

The scrim is **white**, and the type on it is **dark**. It used to be the
reverse: a dark scrim carrying light text, which made the hero the one dark
surface left on a light-only site and read exactly that way. Inverting it put
the hero on the same single ground as everything else.

Two stacked gradients multiply, so the effective alpha is 1-(1-a1)(1-a2), and
across the left half where the type sits it never drops below 0.643. Over the
worst case a photograph can now present — pure **black** — that is ~7.1:1 for
`--on-banner`. The guarantee holds for any image, which is the point: the
banner is swappable and its contrast must not depend on which photograph is
in. If you lower those alphas to show more of the picture, redo the
arithmetic against black, not against the image you happen to like.

**Pick a light photograph anyway**, and measure rather than eyeball it — the
guarantee means a dark image is legible, not that it looks right; under a
white scrim a dark one goes grey and muddy. Draw candidates to a small canvas
and take the mean relative luminance. The current banner
(`adani-bkc-mumbai`) is 0.396 overall and 0.472 across the left half; the
darkest images in the set are around 0.05. Measured against the real
composite, the banner's text is 8.99:1 and its mute 4.75:1.

The automated check below **cannot see any of this** — it scores CSS grounds
only — so `.hero-top` is excluded from it and verified separately. Setting
these tokens to follow the palette without redoing the scrim was a live bug
in an earlier pass: it made the hero illegible while the checker stayed
green.

**Type is three families, and hierarchy is width, not weight.**
IBM Plex is gone, and so is the typewriter face. **The site is two families:**
Bricolage Grotesque carries `--display`, Public Sans carries `--body` *and*
`--mono`. `--mono` survives as a token name only because 46 call sites depend
on it — it resolves to the Public Sans stack, so labels, spec figures and
buttons are all Public Sans. Where digits must line up in a column, the work
is done by `font-variant-numeric: tabular-nums`, not by a monospaced face.
(Spline Sans Mono was the previous label register; that reference is stale.)
The families are set in `site.css`; the Google Fonts URL is `FONTS` in
`src/build.js`. **Change both together.** (Archivo + Instrument Sans, and then
IBM Plex Sans + Mono, were the previous pairings; both references are stale.)

Everything in the display face is held at one weight, `--w-display` (600).
Hierarchy moves along Bricolage's `wdth` axis instead — `--wd-hero` 100,
`--wd-h2` 96, `--wd-h3` 88, `--wd-label` 75. Width tracks size deliberately:
a long wavelength is a wide mark. **Never reach for a bolder weight; reach for
a width.** `opsz` is set alongside it because Bricolage is optically sized —
left on auto, large headings keep the thicker joins drawn for text and look
soft.

**The NRC bar is the signature.** NRC is already a proportion — 0.85 means 85%
of incident sound energy is absorbed — so the bar states the number rather
than illustrating it. Filled run = absorbed, in the material's colour; empty
run = the paper, i.e. what comes back off the wall. That reading only holds
while the track stays the page ground, so do not tint it.

`nrcOf` / `nrcBar` live in `src/build.js`. **13 of the 19 products publish an
NRC**; the other six (Parametric Design, Micro-Perforated Panel and the four
soundproofing products) do not, and for the soundproofing family NRC is the
wrong metric anyway — it blocks rather than absorbs. `nrcOf` returns null and
the component renders nothing. **Do not fill in the missing six.** Where a
product publishes a range, the bar takes the highest figure and the caption
keeps the client's own wording, so the "up to" qualifier is never dropped —
on cards `.nrc-raw` is hidden rather than truncated, because a clipped
"up to 0.6 (9 mm) / up…" reads as a different claim than the one they make.

**Objects that sit on a ground stay flat** — cards, panels, form fields,
filter pills. A gradient under small text makes its contrast depend on where
the text lands, which is why the rule exists.

**`.review` is the one sanctioned exception**, added by request. It carries
`linear-gradient(168deg, --paper-hi 0%, --paper-sub 62%, --paper-lo 100%)` —
the site-wide ombre angle, so it reads as the same light. The cost is paid
rather than waived: every text colour in the card is measured against the
**deepest** stop, not the white it starts from. At `#FFFFFF / #F1F5F9 /
#CBD5E1` the name runs 17.85 / 16.30 / 12.02, the quote 10.35 / 9.45 / 6.97
and the role 7.58 / 6.92 / 5.10. The right-hand column is the one that
matters, and deepening the end stop moves all three together.

If you add a second gradient-bearing object, do the same thing: score it at
every stop. The walker already parses `background-image` stops and scores
against the worst, so this is verifiable rather than a matter of taste — but
only if you actually run it.

- All emphasis is a step in lightness or width, never a change in hue.
- A fixed 3% film grain sits over the viewport (`body::after`). It is what
  stops the large flat ground reading as screen fill. Removing it flattens
  the site.
- The logo is the client's asset. Scale it, never restyle or recolour it.

**Section shapes are deliberately varied.** The page used to be one shape
repeated. Each block now has its own: `.diptych`, the pinned `.rail-sec`
family rail, `.roomdex`, `.process-grid`, `.voices`, `.statement`,
`.cat-grid`, `.notes`, and the pinned `.choreo` scroll choreography. Reach
for an existing shape before adding a grid of equal cards — two of the three
most recent fixes were removing one.

**`.roomdex` is shared, and its counts are computed.** The ten room types
appear on both the homepage and the projects page from one `roomdex()`
partial in `src/build.js`, so they cannot drift. Each row carries the number
of projects actually completed in that room type, counted from `PROJECTS` at
build time — never typed. That figure is the reason the index earns its place
over ten equal cards, and it is also why the projects page stopped using a
`grid g3` for the same content. Rows link in as `#room=<sector>`, which
`site.js` reads on load and on `hashchange` and turns into a click on the
matching `.filter` — the index and the filter buttons therefore cannot
disagree about what is on screen.

**`.notes` has to survive one article and twenty.** There is exactly one blog
post today. It was a three-column grid, which at one item left two thirds of
the row empty. The first note now runs wide with its material swatch beside
it and any note after it is a compact index row — the move `.cat-grid` makes
for the first product in a family. Adding posts needs no layout change.

**Headings inside a column use `.sub-h`, not an inline font-size.** "Send the
details", "Direct", "Others in Acoustic Wood" are `h2` for the document
outline but sit at h3 in the visual scale. That distinction is real, so it
lives in a class; seven inline `font-size:var(--t-h3)` declarations were
removed to get there. The class sets the width axis too, because hierarchy
here is width.

### The contrast check, and what it cannot see

Every rendered text/background pair measures at or above 4.5:1. The lowest
on the site is **4.70:1** — `.note-go`, the "Read the guide" link on the blog
index, `--brand` `#0B5578` on `#BAC6D6`, the deepest stop of `--ombre-dark`.
It is tighter than the primary pill (`#FFFFFF` on `--brand-deep`, **5.01:1**),
which is the floor everywhere else. Both were re-measured after the two
ombres were separated, by two independent walkers that agreed to the
hundredth: products 0 failures, projects 0, about 0, blog 0, contact 0,
404 0, article 0.

**Do not exclude `.page-head` from the sweep.** It was excluded for a while
on the assumption it carried a photograph like the hero. It does not — it is
`--ombre-light` plus a CSS scrim, with zero `<img>` and zero `url()`
backgrounds on all seven templates, verified. Excluding it silently skipped
the largest text on every page. `.hero-top` is the *only* genuine subtree
exclusion on this site. The
walker scores a pill's label against its *section* ground rather than its
fill, so the fill pair is measured explicitly alongside it. That is measured, not
assumed: the check walks every element with a text node, composites the real
background down the ancestor chain, parses the stops out of a gradient ground
and **scores against the worst one**, and applies the WCAG large-text
allowance.

Two things will make it lie to you, and both bit during this pass:

1. **It cannot see photographs.** It scores CSS grounds only, so text over the
   hero banner, gallery surfaces, product heroes and the choreography plates
   must be excluded — their contrast is guaranteed by a designed scrim
   instead. Score them and you get false failures; "fix" those and you break
   the hero.
2. **It skips `opacity: 0` elements**, which below the fold is most of the
   page. Force the reveals off first, or you are checking the hero and
   nothing else:

```js
document.querySelectorAll('[data-anim],[data-in]').forEach(e => {
  e.style.cssText += ';animation:none!important;opacity:1!important;' +
                     'transform:none!important;clip-path:none!important;';
});
```

If you change a token, re-run it rather than eyeballing.

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
