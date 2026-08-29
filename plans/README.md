# Animation plans

Produced by an `improve-animations` audit at commit `b58af61`.

Each plan is self-contained: it names its own files, current code, exact target
values and verification steps. An executor needs no other context.

Scope note: the audit found the **scroll-driven layer** — the two-engine reveal
system, the hero, the pinned family rail, the process spine, the progress bar —
to be correct, and no plan touches it. Every finding below is in the
**hover/press layer**, which reads as having been written separately from the
scroll layer and never reconciled with it.

## Plans

| # | Title | Severity | Category | Files | Status |
|---|---|---|---|---|---|
| [001](001-card-hover-double-scale.md) | Collapse the card's double hover scale into one | HIGH | Cohesion / Duration | `motion.css`, `site.css` | **DONE** |
| [002](002-press-feedback-snap.md) | Make press feedback snap instead of drifting | HIGH | Duration / Interruptibility | `site.css`, `motion.css` | **DONE** |
| [003](003-gate-hover-behind-pointer-fine.md) | Gate hover states behind `(hover: hover) and (pointer: fine)` | MEDIUM | Accessibility | `site.css`, `motion.css` | TODO |

## Recommended order

**001 → 002 → 003.**

- **001 before 003.** Plan 001 deletes the `a.card:hover > .card-surface > img`
  selector from `assets/css/site.css:596`. Running 003 first means wrapping a
  rule that 001 is about to rewrite, and resolving the overlap by hand. 003
  already accounts for either order, but 001-first is the clean path.
- **002 before 003.** Plan 002 edits the two `:active` rules that plan 003 must
  deliberately leave ungated. Doing 002 first makes those rules visually distinct
  (they carry `transition-duration: 120ms`), which makes 003's "do not wrap
  `:active`" boundary harder to get wrong.
- **003 last, always.** It is the only plan that changes no values, so running it
  on settled code keeps its diff purely structural and easy to review.

## Dependencies

| Plan | Depends on | Nature |
|---|---|---|
| 001 | — | none |
| 002 | — | none (independent of 001; they touch different declarations) |
| 003 | 001, 002 | soft — 003 works standalone but its line numbers assume 001 and 002 have run. **Match on selector text, not line number.** |

001 and 002 are genuinely independent and could run in parallel. 003 should not.

## Shared context for any executor

- **No build step applies.** `assets/css/*.css` are static assets. `node build.js`
  regenerates HTML from `src/` and is **not** needed for any of these plans. No
  linter and no test suite exist in this repo.
- **Preview**: `node serve.js` → http://localhost:4177
- **Inspecting pages on Chrome**: visibility is gated by scroll animation. Content
  below the fold sits at `opacity: 0`, and `[data-anim="frame"]` clips its
  contents away entirely — which looks exactly like a broken image. Adding an
  `.in` class does **nothing** on Chrome (there is no `.in` rule on the native
  path). Force everything visible instead:
  ```js
  document.querySelectorAll('[data-anim]').forEach(e => {
    e.style.cssText += ';animation:none!important;opacity:1!important;' +
                       'transform:none!important;clip-path:none!important;';
  });
  ```
- **Curves**: `--ease` = `cubic-bezier(0.22, 1, 0.36, 1)` (`site.css:175`),
  `--m-in` aliases it (`motion.css:23`), `--m-out` = `cubic-bezier(0.4, 0, 0.2, 1)`
  (`motion.css:24`). No plan introduces a new curve.
- `CLAUDE.md` documents several deliberate motion tradeoffs. No plan here
  contradicts one. If a plan seems to, STOP and report rather than proceeding.

## Audited but not planned

Findings the audit confirmed at their `file:line` and the user chose not to plan
in this pass. Recorded so the context is not lost.

| Sev | Location | Finding |
|---|---|---|
| MED | `site.css:1259` | `.filter { transition: all 200ms }` — the site's only `transition: all`. Animates every property off-GPU, including the `background` swap on `aria-pressed`. Fix: enumerate `border-color, color, background`. |
| MED | `site.css:195-200` | Reduced motion is a global `0.01ms !important` kill on `*`. Removes colour and opacity feedback too, not just movement — reduced-motion users lose link fades and focus transitions that aid comprehension. Also largely redundant: `motion.css` already gates itself on `prefers-reduced-motion: no-preference`. Fix: narrow to transform/position properties. |
| MED | `site.css:1345-1346` | `.dip-surface` hover scale runs **900ms** — 3× the top of even the modal/drawer band, on a hover. Fix: ~300ms, or drop the scale. |
| LOW | `motion.css:26-27` | `--m-fast: 200ms` and `--m-mid: 420ms` are defined and **never referenced once**, while 17 hand-typed durations are scattered across the two stylesheets (180/200/220/240/260/300/320/380/420/520/600/700/900…). Fix: use them or delete them; consolidate to a 3–4 step scale. Related: `.fam` still uses `--m-out` at `motion.css:286` where comparable components use `--ease`. |
| LOW | `site.css:1361`, `site.css:1339` | Two dead transitions. `.rdx > a` transitions `padding` — a layout property — but nothing changes its padding, so it fires only when the viewport crosses 52rem. `.dip::before` transitions `opacity`; nothing changes its opacity. Fix: delete both declarations. |

### Missed opportunities (additive, not corrective)

- **The project filter teleports.** `assets/js/site.js:67` sets
  `el.hidden = !match`. Clicking a sector makes the gallery jump — items vanish
  and the grid reflows in a single frame. This is the site's only content-swap
  interaction and the one place with no motion at all. The existing
  `[data-stagger]` vocabulary in `motion.css:85-88` already has the right move.
- **The enquiry success state is silent.** `assets/js/site.js:155` swaps
  `status.textContent` to the thank-you message instantly — a once-per-visitor
  success moment rendered with none of the delight budget it is allowed.
- **`gal-count` swaps hard** alongside the filter (`assets/js/site.js:71`), same
  moment and same fix as the first item.
