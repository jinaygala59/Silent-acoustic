# 003 — Gate hover states behind `@media (hover: hover) and (pointer: fine)`

- **Status**: TODO
- **Commit**: b58af61
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files, ~28 rules wrapped, no declarations changed

## Problem

There is **no `@media (hover: hover)` or `(pointer: fine)` guard anywhere in the
site's CSS.** Verified:

```
$ grep -rn "hover: *hover\|pointer: *fine" assets/css/
(no matches)
```

Every hover rule in `assets/css/site.css` and `assets/css/motion.css` therefore
applies on touch devices. A touch browser synthesises a `:hover` on tap and
**leaves it applied** until the user taps something else, so tapped elements stay
stuck in their hover state.

The site's own JavaScript already knows this and does it correctly — the
pointer-tracked light source is gated at `assets/js/site.js:38`:

```js
if (!reduce && window.matchMedia('(hover: hover)').matches) {
```

The stylesheet never followed.

**The concrete failure case is the project filter.** Filter pills are `<button>`
elements that do not navigate away, so the stuck state is plainly visible:

```css
/* assets/css/site.css:1261 — current */
.filter:hover { border-color: var(--mark-ink); color: var(--on-light); }
/* assets/css/site.css:1265 — current */
.dark .filter:hover { border-color: var(--brand); color: var(--brand); }
```

Tap "Studios" on `/projects.html` from a phone and that pill keeps the hover
border and colour indefinitely, sitting alongside whichever pill genuinely holds
`aria-pressed="true"`. Two pills now look selected. The filter's only state
indicator is compromised by a decorative hover.

Everything else on the site that hovers is an `<a>` that navigates away, so the
stickiness is briefer — but it still means touch users pay for lift transforms,
scale transforms and arrow nudges that exist purely for a pointer they do not
have, and it still flashes on tap before navigation.

## Target

Wrap every `:hover` rule in both stylesheets in:

```css
@media (hover: hover) and (pointer: fine) {
  /* … the existing rule, unchanged … */
}
```

**No declaration values change in this plan.** This is purely a gating change.

Two documented exceptions and one required split are listed in the Steps.

**Why wrapping in place is safe:** a media query adds **zero** specificity, and
wrapping a rule where it already sits preserves source order. The cascade is
therefore identical on pointer devices. Do not move rules to a single block at
the end of the file — that *would* change source order and break the
light/`.dark` variant pairs, which rely on appearing after their base rule.

## Repo conventions to follow

- The matching JS guard is `assets/js/site.js:38` — use the same
  `(hover: hover)` condition, plus `(pointer: fine)` to also exclude
  imprecise pointers (a TV remote, a Wii-style pointer) that report hover.
- Both stylesheets already nest `@media` and `@supports` blocks with two-space
  indentation — see `assets/css/motion.css:92` (`@supports (animation-timeline: view())`)
  for the house style. Indent the wrapped rule one level.
- Comments in this codebase explain *why*, not *what*. Add one short comment
  above the first wrapped block in each file, e.g.
  `/* Pointer-only: a touch tap synthesises :hover and leaves it stuck. */`

## Steps

Wrap each of the following rules, **in place**, in
`@media (hover: hover) and (pointer: fine) { … }`. Contiguous rules may share one
media block; non-adjacent rules each get their own.

### `assets/css/site.css`

| Line(s) | Rule | Note |
|---|---|---|
| 596-597 | `.gal-item:hover > .gal-surface > img` | **If plan 001 already ran**, this rule is now the `.gal-item` selector alone. If plan 001 has *not* run, it still contains an `a.card:hover` selector — wrap it as found either way. |
| 635 | `.brand:hover .brand-logo, .brand:hover .brand-logo-full` | |
| 651 | `.nav a:hover, .nav a[aria-current="page"]` | **SPLIT — see below** |
| 652 | `.nav a:hover::after, .nav a[aria-current="page"]::after` | **SPLIT — see below** |
| 655 | `.nav a.btn-primary, .nav a.btn-primary:hover` | **DO NOT WRAP — see below** |
| 703, 706 | `.btn:hover`, `.btn:hover .btn-arrow` | line 704 (`.btn:active`) sits between them and must stay **outside** the media block |
| 709 | `.btn-primary:hover` | |
| 722, 723 | `.btn-ghost:hover`, `.btn-ghost:hover::before` | contiguous, one block |
| 726 | `.dark .btn-ghost:hover, .btn-ghost.on-dark:hover` | |
| 743, 744 | `.tlink:hover::after`, `.tlink:hover .btn-arrow` | contiguous, one block |
| 899-903 | `a.card:hover` | |
| 904 | `.dark a.card:hover` | contiguous with the above, may share the block |
| 923 | `a.card:hover .btn-arrow` | |
| 967 | `.sector:hover` | |
| 1141 | `.contact-list a.v:hover` | |
| 1187 | `.foot-list a:hover` | |
| 1218 | `.crumbs a:hover` | |
| 1261 | `.filter:hover` | the headline case |
| 1265 | `.dark .filter:hover` | |
| 1345, 1347 | `.dip:hover .dip-surface`, `.dip:hover .btn-arrow` | line 1346 (`.dip-surface` transition) sits between them and must stay **outside** |
| 1394, 1395, 1396 | `.rdx > a:hover`, `.rdx > a:hover .rdx-swatch`, `.rdx > a:hover .rdx-note, .rdx > a:hover .rdx-n` | contiguous, one block |
| 1468 | `.rdx:hover .rdx-swatch > img` | |

### `assets/css/motion.css`

| Line(s) | Rule | Note |
|---|---|---|
| 288 | `.fam:hover` | |
| 317 | `.fam:hover .btn-arrow` | |
| 324 | `.fam-all:hover` | |
| 423 | `a.card:hover .card-surface, .fam:hover .fam-surface` | line 422 (the transition) must stay **outside** the media block |

### The required split — `assets/css/site.css:651-652`

These two rules each bundle a hover state together with the **current-page
indicator**, which is not a hover state and must keep working on touch:

```css
/* current — lines 651-652 */
.nav a:hover, .nav a[aria-current="page"] { color: var(--on-light); }
.nav a:hover::after, .nav a[aria-current="page"]::after { transform: scaleX(1); }
```

Wrapping these whole would **remove the current-page underline and colour on
every touch device**. Split them so only the hover halves are gated:

```css
/* target — lines 651-652 */
.nav a[aria-current="page"] { color: var(--on-light); }
.nav a[aria-current="page"]::after { transform: scaleX(1); }
@media (hover: hover) and (pointer: fine) {
  .nav a:hover { color: var(--on-light); }
  .nav a:hover::after { transform: scaleX(1); }
}
```

### The exception — `assets/css/site.css:655`

```css
.nav a.btn-primary, .nav a.btn-primary:hover { color: #FFFFFF; }
```

**Leave this line completely untouched.** It is not a hover effect: it is the
specificity guard that stops `.nav a`'s muted grey from overriding
`.btn-primary`'s white text. Both halves set the identical colour; the `:hover`
half exists only to out-rank `.nav a:hover`. Gating it would return the button
to grey on touch, and splitting it serves no purpose.

## Boundaries

- Do NOT change any declaration value — no colours, no durations, no transforms,
  no easings. This plan only adds media-query wrappers.
- Do NOT wrap any `:active` rule. `assets/css/site.css:704` and
  `assets/css/motion.css:418` are press feedback, which touch devices **must**
  keep. If plan 002 has run, those rules carry a `transition-duration: 120ms`;
  either way they stay outside every media block added here.
- Do NOT wrap any `:focus` or `:focus-visible` rule (`assets/css/site.css:237`,
  `:253`, `:1121`). Keyboard focus is not pointer-dependent and gating it would
  break keyboard navigation.
- Do NOT wrap the bare `transition:` declarations that sit between hover rules
  (`assets/css/site.css:705`, `:1346`; `assets/css/motion.css:422`). They must
  apply on all devices or the `:active` press feedback loses its transition.
- Do NOT relocate rules or consolidate them into one block at the end of the
  file — source order matters for every `.dark` variant pair.
- Do NOT touch `src/` or any `.html` file. CSS-only; `node build.js` is **not**
  required.
- Do NOT add dependencies.
- If the code at any cited line does not match what you find, STOP and report the
  drift instead of improvising. Note that plans 001 and 002, if already executed,
  will have shifted line numbers — match on **selector text**, not line number.

## Verification

- **Mechanical**:
  - `grep -c "hover: hover" assets/css/site.css assets/css/motion.css` should
    report roughly 20 and 4 respectively (exact counts depend on how many
    contiguous runs you merged).
  - `grep -n ":hover" assets/css/site.css assets/css/motion.css` — every hit
    except `assets/css/site.css:655` must now sit inside a media block.
  - Confirm `.nav a[aria-current="page"]` appears **outside** any media block.

- **Feel check**: run `node serve.js` (http://localhost:4177).
  - **Below-the-fold content reads as invisible on Chrome** — visibility is gated
    by scroll animation, and adding an `.in` class does nothing on that path. To
    force everything visible for inspection:
    ```js
    document.querySelectorAll('[data-anim]').forEach(e => {
      e.style.cssText += ';animation:none!important;opacity:1!important;' +
                         'transform:none!important;clip-path:none!important;';
    });
    ```
  - **Desktop, mouse:** hover a product card, a button, a sector tile, a family
    panel in the homepage rail, a room-index row, and a filter pill. **Every one
    must behave exactly as it did before this change.** Any hover that stopped
    working means a rule was wrapped with a typo or a brace mismatch.
  - **Touch emulation:** DevTools → Toggle device toolbar → iPhone. Reload (the
    media query is evaluated live, but reload to be certain). Go to
    `/projects.html` and **tap a filter pill**. Confirm:
    - the tapped pill takes the pressed style via `aria-pressed`, and
    - **no second pill is left showing a hover border** — this is the bug being fixed.
  - Still in touch emulation, tap a product card and confirm no lift transform
    fires before navigation.
  - Still in touch emulation, navigate to any inner page and confirm the current
    page's nav link **still shows its underline and darker colour**. If it does
    not, the 651-652 split was done wrong.
  - Confirm the nav "Get a quote" button is still **white text**, not grey — if it
    turned grey, line 655 was wrapped despite the exception.
  - **Keyboard:** tab through the header and a card grid; focus outlines must be
    unchanged.

- **Done when**: on a pointer device every hover behaves identically to before;
  on touch no hover state persists after a tap; the current-page nav indicator
  and the nav button's white text both survive on touch; and keyboard focus is
  untouched.
