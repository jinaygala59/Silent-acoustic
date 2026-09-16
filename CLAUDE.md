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

**The homepage rail shows PRODUCTS, not the five families.** Both the "five
families" framing and the "manufactured in our own facility in Mumbai" claim
were removed by client request, in the same brief that cut the *In-house* and
*Verified* tiles from the About page. Do not reinstate either anywhere — they
were also cleared from the products page head, the About meta description and
the `Manufacture` process step, none of which the brief marked but all of
which carried the same claim. The products page still groups by family: that
is its navigation, and it was explicitly left alone.

Which ten products appear on the rail is **derived, not chosen** — each
family's own `img` field already names its most recognisable member, so
`railPicks()` takes that one and the next in the family, two per family. It is
ten and not nineteen because the pin scales at 200px of scroll per card
(`--rail-n`, clamped 900–2600px) and nineteen would want ~4800px.

## Non-obvious things that will bite you

**The motion vocabulary is seven words, and two of them were dead.** `fade`,
`rise`, `reveal`, `frame`, `line`, `tile` and the `slide-l` / `slide-r` pair.
`line` and `tile` were defined in `motion.css` and referenced by *zero*
templates — dead motion that read as a complete system. `tile` now belongs to
the project gallery, which is what its own comment always said it was for.
`line` is wired through CSS rather than an attribute, because the thing it
draws is already a pseudo-element: the 2.25rem dash every eyebrow carries, so
one rule covers ~50 call sites. That rule is `.eyebrow[data-anim]::before`
and the attribute selector is load-bearing — it matches only eyebrows that are
themselves scroll-revealed, which excludes the hero's and the page-head's,
both animated on *load* by `mHeroIn` and both inside `overflow: hidden` boxes
where it could not resolve anyway. Widen that selector and those two dashes
vanish.

**The ambient layer is ported from replit.com, read off their stylesheets.**
What they actually run is a `LogoBlock__scroll` logo marquee, a
`--sweep-pos` light sweep, a `glow-fade-in` bloom, a `steps(1)` typing caret,
a sticky header and a sticky bottom CTA. The lesson from that list is the
opposite of how it looks: **their entrance travels are tiny — 4px, 16px,
20px.** What makes their page feel alive is continuous ambient motion, not
large scroll reveals. So the marquee, the sweep and the glow are ported and
the reveals were not made to imitate theirs. Two of the six are deliberately
not ported: the caret has nothing to type on this site, and the sticky bottom
CTA is a layout and consent decision rather than a motion one. Their
below-fold reveals are rAF-driven, which is why every scrolled screenshot of
replit.com taken during that pass came back blank — no paint, no rAF, no
reveal, no content. This site's CSS-first path is what avoids that. Do not
move it back onto JavaScript.

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

**Hover motion is gated once, at the end of `motion.css`, and it has to stay
there.** Unscoped `:hover` latches on touch — a tapped card stays lifted until
you tap elsewhere. `.review` was the only component scoped for it; the other
eighteen moving hover rules were not. They are now neutralised together by one
`@media (hover: none), (pointer: coarse)` block that resets `transform` only,
leaving colour, border and shadow feedback intact — the same division
`.review`'s reduced-motion variant already made.

That block must live in **`motion.css`**, not `site.css`. The shell links
`site.css` first, so a reset at the end of `site.css` loses at equal
specificity to the five hover rules that live in `motion.css` — `.fam:hover`,
`.fam:hover .btn-arrow`, `a.card:hover .card-surface, .fam:hover
.fam-surface`, `.gal-item:hover > .gal-surface` and `.dip:hover
.dip-surface`. That was a real one-revision bug: thirteen hovers fixed, five
still latching. Verify by walking the CSSOM for `:hover` rules with a
non-`none` transform and checking none of them sorts after the reset.

Related: **no `transition: all` on this site.** `.filter` had it, which meant
`aria-pressed` state changes and any future property joined the same 200ms —
including layout properties. Name the properties.

**An opacity fade is a contrast change wearing a costume, and the walker
cannot see it.** The DOM walker reads *declared* colours; it never sees what
text at `opacity: 0.6` actually composites to. A scroll fade was written for
the inner page heads to match the hero and had to be removed: at a 0.6 floor
over `--ombre-light`'s deepest stop `#C2CCD8`, the h1 went 10.99:1 → 3.93:1
(passing only on the large-text allowance) and the lead and eyebrow both went
5.37:1 → **2.50:1**, well under the floor, while the head was still on screen.
`.page-head .wrap` therefore drifts on transform only. Before adding a fade
anywhere, composite the text against its ground at the floor alpha and score
it — and note that the hero's `mDrift` to 0.25 is *not* a precedent for it:
that one is pre-existing, deliberate, on content you have already left, and
excluded from the automated sweep.

**`--box` is the timeline that gets around `overflow: hidden`.** Most of the
newer motion animates something *inside* a clipped box — a photograph inside
`.surface`, the dash inside `.dip`. `view()` cannot resolve there (see the
`overflow: hidden` note below), so the enclosing box publishes a named
timeline and the descendant borrows it, exactly as the hero does with
`--hero`. `--box` is published on `section, footer, .card, .gal-item, .rdx,
.note, .dip, .pd-hero, .panel, .review` and found by nearest ancestor, so a
consumer in a card gets the card's pass through the viewport and a loose one
gets the section's. Sections that already publish a name take `--box` as a
second entry in the list (`view-timeline-name: --rail, --box`) rather than
losing the first — drop that second entry and the dashes and bars inside
`.rail-sec`, `.page-head` and `.cta-band` silently stop.

**A `--box` publisher inside a scroll container publishes a FROZEN timeline,
and there is exactly one exception in the stylesheet because of it.**
`.rail-track .card { view-timeline-name: none; }`. The family rail carries
product cards now, and `.card` is in the publisher list above — so each card
published its own `--box`, and every consumer inside it (the NRC bar, the
card's own reveal) measured against the *card's* pass through its scrollport.
That scrollport is `.rail-viewport`, which is `overflow-x: auto` /
`overflow-y: hidden` and therefore a scroll container on the **block** axis
too. A block-axis `ViewTimeline` measured against a port that never scrolls
vertically does not fail loudly: it **freezes** at whatever constant it first
resolved to and never moves again.

Measured at 375×700 before the fix: every bar on the rail sat at
`scaleX(0.967)` with its timeline pinned at `50.8131%` — at the top of the
page, in the middle of the rail, and 9,728px past it at the bottom of the
document. Because the NRC bar is the site's one fail-unsafe animation, that
was drawing a published 0.85 as roughly 0.82. The card reveals were frozen at
the same constant and only rendered because 50.8% happens to fall past the end
of `mRise`'s range; a viewport that resolved a lower constant would have held
ten cards at `opacity: 0`.

`none` makes the lookup walk past the card to `.rail-sec`, which is outside
the horizontal scroller and whose timeline advances normally. **The general
rule: if you put a `--box` publisher inside a scroll container, suppress its
name or its descendants inherit a frozen clock.**

**The NRC bar is the one fail-UNSAFE animation on the site.** Everything else
degrades to "visible and static". The bar's fill draws with `scaleX(0 → 1)`
on `--box`, so if that timeline ever fails to resolve, the fill holds
`scaleX(0)` and the bar renders EMPTY — understating a real published
absorption figure, which is a content error, not a visual one. It is
`scaleX` and not `width` because `width` is `var(--v)` from the data and
animating it would be a layout pass per frame on up to nineteen cards; the
transform scales the fill inside the width the figure sets, so the published
number still decides where the bar ends. The range closes early (`cover 52%`)
so the bar is full and stays full for most of the scroll. If you touch
`--box`, re-check the bars on `products.html`, a product detail page **and the
homepage family rail** — 13, 4 and 8 respectively, all of which must reach
`matrix(1, 0, 0, 1, 0, 0)`. The rail is the one that has already broken once;
see the frozen-timeline note under `--box` above.

**Verifying any of this from the browser pane needs paint between the scroll
and the read.** Two separate traps, on top of the pinned-section one below.
`scroll-behavior` is smooth and rAF is starved in a non-painting pane, so
`window.scrollTo(0, y)` crawls a few pixels and every probe reads the top of
the page — set `document.documentElement.style.scrollBehavior = 'auto'` and
pass `behavior: 'instant'`. And a scroll-driven animation is not re-sampled
until the pane paints, so scrolling and reading `getComputedStyle` in the
*same* `javascript_tool` call returns stale values. It reported three of four
NRC bars stuck at zero during this pass, which was the probe, not the CSS.
The sequence that works is: scroll → screenshot → read, as three separate
calls.

**Scroll reveal is deliberately fail-safe, and there are now TWO hidden
states.** Nothing in the stylesheet hides content on its own. Both states come
from the inline `HEAD_BOOT` script in `src/build.js`, both are added *only*
when JavaScript is running, and both arm a six-second timer to strip
themselves back off unless `motion.js` arrives and sets
`documentElement.dataset.mo`. A blocked, failed or slow script therefore
leaves a plain readable page, never an empty one. Do not "simplify" either
into a CSS-only hidden state.

| class | when | what it drives |
|---|---|---|
| `io` | no native scroll timelines (Firefox, iOS Safari before 26) | the full reveal vocabulary, via IntersectionObserver |
| `iomin` | the reader has Reduce Motion on | **opacity only** — no travel, clip or scale |

`iomin` exists because every animation block in `motion.css` is gated on
`prefers-reduced-motion: no-preference`, which made one OS toggle — a common
one on iOS — produce a completely inert page. Reduce Motion asks for no
vestibular triggers, not for nothing to happen, and a cross-fade is not
motion. The tier is opacity and nothing else: no transform, no clip-path, no
`--sweep-pos`, no drift, no pins, no ticker, no count-up. If you extend it,
the test is not "is it subtle" but "does anything move" — if it moves, it does
not belong there.

**Verifying either fallback needs a stripped stylesheet, and the stripper must
remove comments first.** `_mkiotest.js` (gitignored) writes `_iotest.html`,
which loads a copy of `motion.css` with every `@supports (animation-timeline
…)` block brace-matched out and stubs `CSS.supports` so `motion.js` takes the
observer path; `_reducetest.html` inverts the two reduced-motion conditions
and stubs `matchMedia`. Without them the pane's own support for scroll
timelines means the native rules always win and the fallback is unreachable.
The stripper blanks comments before scanning, and that is load-bearing: the
prose in this file and in `motion.css` contains the literal string `@supports
(animation-timeline: view())`, and matching it inside a comment then
brace-matching forward from the next `{` deletes whatever real block follows —
which silently ate the entire engine-2 block and made a working stylesheet
look broken for three rounds. `src/designboard.js` carries the same warning
for the same reason.

**The scroll choreography is gone, and the client wall replaced it.**
`.choreo` was a 300vh section with a sticky 100vh child in which four project
photographs traded places, stacked at the centre and the last opened to full
bleed — a port of a framer-motion component to this engine. It was **removed
by request**, and removed rather than disabled: the markup, the `CHOREO` slug
list, `choreoBand()`, the `--choreo` timeline and all six `mChoreo*` keyframes
are deleted. There is no dead code to revive. If a pinned piece is wanted in
that slot again, write it against the current vocabulary.

Two sections sit in its place. `workBand()` puts the WORK back — removing the
choreography had quietly taken the homepage's only project photography with
it, and a rebuilt page with none of the client's 170 rooms on it is most of
why the site was reported as feeling "very simple". It is the ordinary `.gal`
component from the projects page, showing **one project per room type for
every type with more than one completed project**. That rule yields nine,
which is exactly what the 3-column grid wants: the feature tile eats four
cells, so `4 + (n - 1)` has to divide by three. `workBand()` returns an empty
string rather than a ragged final row if that ever stops holding — make the
breakage loud, do not trim to fit.

Then `clientWall()` — the fifty client logos the client already publishes on
their own homepage, as a flat grid of white tiles. It is
deliberately **not** a marquee: a marquee of client names was on this page
once (`.ticker`) and was removed for duplicating the gallery below it. See the
`.client-wall` block in `site.css` for why the tiles are `--paper-hi` when
nothing else on the site is.

**`.rail-sec` is now the ONLY pin on the site.** Anywhere this file used to
say "either pin" or "a second pin", there is one.

**You cannot verify the pin from a hidden browser pane.** Scroll-driven
animations are not sampled when the pane is not painting: `currentTime` reads
`null`, transforms read `none`, and `requestAnimationFrame` never fires, so
every rAF-based probe times out. Screenshots only capture the paint at load,
so a scrolled screenshot comes back blank — move the section to the top of
`<main>` instead, or take **two** screenshots in separate calls: the first
comes back as a flat pale rectangle and the second has the real paint. That
second-screenshot trick is the cheapest way through and it works for the rail,
the client wall and the NRC bars alike.

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

**Never write a text colour in a `style` attribute — use `.muted`.** An inline
style outranks every `.dark X` rule in the stylesheet, so a paragraph carrying
`style="color:var(--on-light-mute)"` cannot be re-coloured for the dark ground
by anything short of `!important`. Nine of these had accumulated in
`src/pages.js`, seven of them inside `.dark` sections — including the three
About paragraphs that carry the twenty-years copy. They rendered fine only
because `.dark` was a *light* ombre at the time; they become invisible the
moment it is not. `.muted` / `.dark .muted` (beside `.lead` in `site.css`) is
the fix, and it mirrors `.lead` deliberately. Inline `font-size`, `max-width`
and `margin` are fine — it is specifically colour that has to be overridable,
for the same reason `.sub-h` exists for size.

Two things make this class of bug survive review. The contrast walker skips
`opacity: 0` elements, so below-fold text is invisible to it unless the
reveals are forced off first (see the snippet in the contrast section). And
grepping the built HTML for `class="dark"` under-reports which sections are
affected, because `.rail-sec` takes the deep ground from its own rule rather
than the class — measure `getComputedStyle(section).backgroundImage` instead.


**The hero's spec rail carries the client's own four counters now** — 2035+
Project Completed, 20+ Years of Experience, 20+ Team Strength, 7 Project
Running — transcribed from the band on their live site, labels in their
wording. They live in `SITE.stats`. Two of them cannot be checked from this
repo and one goes stale on its own: *Project Running* is a snapshot of one
week's workload, not a cumulative total. Ask before a rebuild if it has been a
while, and do not round it up. Only *Years of Experience* is derived (from
`FOUNDED`); the other three are quoted strings, which is why they do not
count up — `data-count-to` takes an integer and "2035+" is the client's own
figure with its plus sign attached.

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

**THE RULE IS WIDER THAN SPECS: DO NOT COMPOSE SECTION COPY EITHER.** The
client's instruction is "only take info from the existing website". A
plausible-sounding caption is the easiest thing in the world to write and the
hardest to spot afterwards, because nothing about it looks wrong. Three went
in during the banner pass and all three had to come back out:

- **Sub-captions under the four hero counters** — "Across India since 2006",
  "Designers, fabricators and installers", "On site at the time of writing".
  The client's band carries a figure and a label, nothing else. The third was
  an invention about their current workload.
- **A heading and lead for the client wall** — "Trusted by / 50 clients, 20
  years / Broadcasters, banks, universities, studios and developers — rooms we
  have designed, supplied and fitted." Their own strip has *no heading at
  all*, and that last clause asserted a working relationship with each of
  fifty named companies that nothing supports.
- **A products page-head lead** — written to replace the one carrying the
  removed manufacturing claim. Their /our-products page carries no lead copy,
  so there was nothing to take.

All three are now a label and a count, or nothing. **A count read off the data
is a fact; a sentence about what the count means is copy, and copy needs a
source.** If a section looks bare without one, that is the correct appearance
of a section the client has not written yet — ask them for the words.

Note what this does NOT cover: a large amount of prose from earlier passes is
still written-not-client — every product `lead` and `body`, `PROCESS`, the
About page's four commitments, most section headings. That is flagged under
*Still outstanding* and is a separate decision from this rule.

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
| `--ombre-light` | `#EDF1F5` → `#DFE6ED` → `#C2CCD8` | 0.875 / 0.784 / 0.596 |
| `--ombre-dark`  | `#DDE4EC` → `#CED7E1` → `#B0BCCB` | 0.769 / 0.672 / 0.495 |

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
index     H L D L D L D L D C      products  P D L D L D L C
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
depth. The grounds have been deepened again since that trade was made, so
restate it against today's deep end `#B0BCCB` rather than the `#BAC6D6` it
was originally scored on: the old mute would now be **3.93:1** there, and the
current one is **4.53:1** — which is the whole margin the site has left, and
the floor quoted in the contrast section below. Darkening text
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
until it can carry text. `--brand` `#094A68` carries links, labels and
`.tlink` (4.98:1 worst); `--brand-lift` `#073349` is hover, always a step
darker and never lighter; `--brand-deep` `#10789C` is a **solid pill fill
only**, carrying `#FFFFFF` at 5.01:1 — at 3.38:1 on `--paper-lo` it is not
text-safe, so never set it as a `color`.

`--brand-mark` `#1CABDE` is the raw logo cyan. It measures **2.53:1** on
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
`--mark-banner` `#333E4E` — and are the banner's, not the palette's.

The scrim is **the page's own light** — `rgb(237,241,245)`, the top stop of
`--ombre-light` — and the type on it is **dark**. It was white until the
landing page was still reported as too white after the grounds were deepened:
the hero is the first full screen and the largest surface on the site, and a
white scrim was washing the photograph toward 1.000 while everything below it
had come down to 0.875–0.596.

**THE SCRIM NO LONGER GUARANTEES ANY PHOTOGRAPH.** It used to — an effective
alpha that never dropped below 0.643 across the type column, holding ~7:1
over even a pure-black image, so the banner could be swapped freely. That was
given up deliberately, by request, because at 0.82 alpha the wash rather than
the picture was what you saw. The alphas are now 0.60 / 0.56 / 0.50 held across
the type column, then falling to 0 by the right edge so the photograph
carries that half outright.

The cost, stated plainly: the effective floor is now ~0.53, so over a
pure-black image the title would sit near 3.6:1 and the lead would be
marginal.
**The banner's contrast is a property of the current photograph, not of the
scrim.**

**THE BANNERS ARE THE CLIENT'S OWN THREE, ported from their live site**
(`assets/img/banners/`: `recording-studio`, `office-conference`,
`auditorium`), and each was measured against the real composite — both
gradients replicated on a canvas over the actual image, darkest pixel under
every *word* — before it went in. Nothing in the scrim was changed to
accommodate them. The full table lives beside `.hero-media::after` in
`site.css`; the summary is worst text **4.97:1** (auditorium h1, desktop) and
worst mute **3.13:1** (office-conference `.decay`, desktop).

**Re-run the canvas measurement whenever you change an image** — do not assume
it holds. `--mark-banner` on `.decay` clears the **large-text threshold only**
(3:1), and 3.13 clears it by very little: that is the tightest number on the
site. A darker banner, or a smaller `.hero-title`, takes it under. Do not put
`--mark-banner` on anything body-sized in the banner.

**THE HEADLINE ROTATES WITH THE PHOTOGRAPH**, because the client's own hero
does and porting their pictures without their captions would have stranded
three sector labels. Four things about `.hero-copy` are load-bearing and all
four are written out above the HOME block in `src/pages.js`: only slide one is
the `<h1>` (the other two are `<p class="hero-title">`, so the document has
one main heading); slides two and three are permanently `aria-hidden` because
CSS cannot update ARIA and the arrows announce the change themselves; the
three blocks are **grid-stacked**, not absolutely positioned, so the hero
reserves the tallest headline once and the lead below never moves; and the
load-in belongs to slide one only.

The synchronisation is two matched sets of keyframes in `motion.css` —
`.hero-slide` and `.hero-say`, same duration, same negative delays. **Change
one and you must change the other in the same edit**, or a headline outlives
its picture and describes the wrong room for nine seconds.

`.hero-title` is **4.25rem at the top end, not `--t-hero`'s 7rem**. The
client's longest line is 44 characters against the 24 the slot was drawn for,
and at 7rem it ran to four lines and pushed the lead and both buttons off a
900px screen. The column cannot be widened to absorb it — `padding-right: 42%
+ gut` is where the scrim still has alpha to spare — so the type came down
instead.

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

`.review` now also carries the scroll-driven **sweep** ported from
replit.com — a narrow white band raked across it by `--sweep-pos` on the
`--box` timeline. It is safe on top of the figures above for one reason worth
stating: it only ever *adds* white under dark text, so it raises the local
luminance and moves every measured pair the safe way. It cannot lower one. A
sweep that darkened, or one on light text, would have to be scored frame by
frame. It is also the only thing in `motion.css` that repaints a gradient per
frame rather than moving a compositor layer, which is why it is on exactly one
selector. Do not spread it — and if you do, read the note beside it first,
because `.panel` and the roomdex rows were both tried and both removed.

- All emphasis is a step in lightness or width, never a change in hue.
- A fixed 3% film grain sits over the viewport (`body::after`). It is what
  stops the large flat ground reading as screen fill. Removing it flattens
  the site.
- The logo is the client's asset. Scale it, never restyle or recolour it.
  **Both header and footer carry the full lockup, tagline included**, which is
  what the live site's own header does. The header used to take
  `logo-mark.png` — the same artwork with "Innovating Sound In A Better Way"
  cropped off — because the tagline is unreadable at 32px. The fix was the
  bar, not the artwork: `.brand-logo` is 2.75rem and `.site-head .wrap`
  min-height went 5.25 to 5.75rem. `logo-mark.png` is still in `assets/img`
  for whoever decides the bar has to shrink again; shipping an illegible line
  of type is the wrong answer.

**Section shapes are deliberately varied.** The page used to be one shape
repeated. Each block now has its own: `.diptych`, the pinned `.rail-sec`
product rail, `.roomdex`, `.process-grid`, `.voices`, `.statement`,
`.cat-grid`, `.notes`, `.founder` and `.client-wall`. Reach for an existing
shape before adding a grid of equal cards — three of the four most recent
fixes were removing one.

**`.founder` exists because `.section-head.split` bottom-aligns its columns.**
`.section-head` sets `align-items: end`, which is right for a heading beside
one lead paragraph and wrong for a heading beside three. The client's founder
statement made the row ~900px tall, and `end` pinned a two-word name to the
floor of it — a screen-high empty field with the copy squeezed down the right
edge. It was reported as "this section feels empty", and it was. `.founder`
runs the head full width, the first paragraph under it as the lead, and the
rest in two columns. Before putting long copy in a `.split` head, check what
the short column does.

**The `.ticker` marquee (a port of replit.com's `LogoBlock`, 24 client project
names scrolling past "N rooms photographed") was removed by request from the
homepage's Work section.** It sat directly above the actual photo gallery and
duplicated it — the same 24-ish names, less usefully, in motion instead of as
photographs. `ticker()` is gone from `src/build.js` entirely (it is not dead
code kept for later; it was deleted), and its CSS is gone from `motion.css`.
If a marquee of client names is wanted again elsewhere, write it fresh against
the current motion vocabulary rather than reviving this — the old version's
reduced-motion and dark/`.rail-sec` handling documented here no longer exists
to copy from.

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
on the site is **4.53:1** — muted body copy (`--on-light-mute` `#3F4C5E`, via
`.dark .lead` / `.dark .muted`) on `#B0BCCB`, the deepest stop of
`--ombre-dark`. Next tightest is `.note-go`, the "Read the guide" link on the
blog index, at **4.98:1** — `--brand` `#094A68` on that same stop, which is
also `--brand`'s worst case anywhere. Both are tighter than the primary pill
(`#FFFFFF` on `--brand-deep`, **5.01:1**).

Those three are token-level computations, which is all a hex can tell you. Both were re-measured after the two
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

Three things will make it lie to you, and all three have bitten:

1. **It cannot see photographs.** It scores CSS grounds only, so text over the
   hero banner, gallery surfaces and product heroes must be excluded — their
   contrast is guaranteed by a designed scrim instead. Score them and you get
   false failures; "fix" those and you break the hero.
2. **It skips `opacity: 0` elements**, which below the fold is most of the
   page. Force the reveals off first (the snippet is below), or you are
   checking the hero and nothing else.
3. **A gradient stop is not the same thing as a ground, and the drafting grid
   is the trap.** `.hero`, `body` and the paper sections carry
   `linear-gradient(var(--grid-line) 1px, transparent 1px)` tiled at 64px —
   a 1px hairline covering 1.6% of the box. A walker that follows the
   documented rule ("parse the stops out of a gradient ground and score
   against the worst one") treats that hairline as full coverage and reports
   the entire hero spec rail at **4.03:1**. It is not a real failure: no glyph
   sits entirely on a 1px line, and the ground the type actually composites
   against is the ombre. Skip any gradient layer whose stop positions are
   given in `px` — those are textures; the ombres are all `%`. This cost a
   full round of investigating a "regression" that was present, unchanged, on
   the committed build.

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
- **Two of the four hero counters cannot be verified from this repo, and one
  goes stale on its own.** `SITE.stats` carries the client's published *Team
  Strength* (20+) and *Project Running* (7). The second is a snapshot of one
  week's workload. Confirm both with the client before a release, and do not
  adjust either by guesswork.
- **The fifty client logos are other companies' trademarks.** They are on this
  site because the client already publishes them on theirs — this is a port,
  not a new claim made on their behalf. If a listed organisation asks to come
  off, delete its row in `CLIENTS` and its file in `assets/img/clients`;
  nothing else references either. Two display names could not be recovered
  from the client's own filenames and were read off the artwork
  (`Clients-page-images-12.png` is DBS, `Doorsha.jpg` is Doordarshan); three
  more were misspellings corrected the same way. Those are recorded in
  `src/content.js` so nobody "corrects" them back.
- Process steps and the About page's four commitments (`src/pages.js`, the
  "Four things we will not do" section) are written copy, not client-confirmed.
  They include a promise to re-measure and fix a room that misses its target.
  The FAQ is no longer in this category — as of the last content sync it was
  transcribed verbatim from the live site's About-page FAQ block, not written
  copy. See the "content sync" note in git history for what else was checked
  against the live site and when.

  It has since moved: the FAQ now lives on the Notes page (`blog.html`), not
  About, and its five answers were condensed by request — the client's own
  answers ran long for a page built around short entries. Every figure
  (pricing, timelines, warranty terms) is unchanged; only the wording was
  cut. `src/content.js`'s `FAQ` array carries the current text and the note
  on why it no longer matches the live site word-for-word.
