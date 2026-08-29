# 002 — Make press feedback snap instead of drifting

- **Status**: DONE (executed at 46383bc; verified via CSSOM cascade + computed styles)
- **Commit**: b58af61 (plan written); executed against 46383bc — cited code re-verified by selector text, unchanged
- **Severity**: HIGH
- **Category**: Easing & duration / Interruptibility
- **Estimated scope**: 2 files, 2 declarations

## Problem

Every pressable element on the site acknowledges a click on the **same slow
transition it uses for hover**. There is no separate press timing anywhere.

Buttons — 260ms:

```css
/* assets/css/site.css:699-704 — current */
.btn {
  …
  transition: background 260ms var(--ease), color 260ms var(--ease),
              border-color 260ms var(--ease), transform 260ms var(--ease),
              box-shadow 260ms var(--ease);
}
.btn:hover { transform: translateY(-2px); }
.btn:active { transform: translateY(0); }
```

Cards — 320ms:

```css
/* assets/css/site.css:892-893 — current */
.card {
  …
  transition: border-color 320ms var(--ease), transform 320ms var(--ease),
              box-shadow 320ms var(--ease);
}
```

Sector tiles — 240ms (`assets/css/site.css:964`) and family panels — 240ms
(`assets/css/motion.css:286`). All four share one `:active` rule:

```css
/* assets/css/motion.css:418 — current */
a.card:active, .sector:active, .fam:active { transform: translateY(-1px); }
```

The budget for press feedback is **100–160ms**. A press is the one moment where
the interface must confirm it heard you *immediately*; at 260–320ms a button
takes roughly a third of a second to admit it was clicked, which reads as lag
rather than as feedback. On a card the press travel is only 3px
(`-4px` hover → `-1px` active) stretched over 320ms, which is slow enough that
a quick click can finish before the acknowledgement is visible at all.

The correct shape here is **asymmetric**: the press-down snaps, the release can
relax back at the leisurely hover speed. Right now both directions are equally
slow.

## Target

Add a short `transition-duration` override on the `:active` state only. Because
`transition-duration` with a single value applies to every property in the
element's transition list, the whole press response snaps together.

```css
/* assets/css/site.css:704 — target */
.btn:active { transform: translateY(0); transition-duration: 120ms; }
```

```css
/* assets/css/motion.css:418 — target */
a.card:active, .sector:active, .fam:active {
  transform: translateY(-1px);
  transition-duration: 120ms;
}
```

`120ms` sits in the middle of the 100–160ms press band.

**Why this produces asymmetry for free:** CSS uses the transition properties of
the state being *entered*. Pressing enters `:active`, so press-down runs at
120ms. Releasing leaves `:active` and re-enters `:hover`/base, so release runs at
the element's own 240–320ms. Press snaps, release relaxes. That is the intended
behaviour — do not add a matching override anywhere else to "make it symmetric".

## Repo conventions to follow

- `--ease` (`assets/css/site.css:175`, `cubic-bezier(0.22, 1, 0.36, 1)`) is the
  curve already in every one of these transition lists. This plan changes **only
  duration** — do not introduce a curve, and do not change the existing curves.
- Durations are inline literals throughout both stylesheets. Write `120ms`
  directly; do not create a token. (The unused `--m-fast` / `--m-mid` tokens at
  `assets/css/motion.css:26-27` are a separate unplanned finding — leave them.)
- Press transforms already exist and are correct in magnitude
  (`translateY(-1px)` from a `-4px`/`-3px` hover, `translateY(0)` from `-2px`).
  Do not change the distances.

## Steps

1. In `assets/css/site.css`, line 704, append `transition-duration: 120ms;` to
   the `.btn:active` rule:
   ```css
   .btn:active { transform: translateY(0); transition-duration: 120ms; }
   ```

2. In `assets/css/motion.css`, line 418, append `transition-duration: 120ms;` to
   the shared `:active` rule. Expand it to multiple lines for legibility:
   ```css
   a.card:active, .sector:active, .fam:active {
     transform: translateY(-1px);
     transition-duration: 120ms;
   }
   ```

3. Nothing else. Do not modify the four base `transition:` lists at
   `assets/css/site.css:699-701`, `assets/css/site.css:892-893`,
   `assets/css/site.css:964`, or `assets/css/motion.css:286` — their durations
   govern hover and release, which are allowed to stay slow.

## Boundaries

- Do NOT touch `src/` or any `.html` file. CSS-only; `node build.js` is **not**
  required.
- Do NOT wrap these `:active` rules in `@media (hover: hover)`. `:active` fires
  on touch and press feedback is exactly what a touch device *should* get. Plan
  003 gates `:hover` only, and it explicitly excludes these rules — if you are
  executing both plans, do not let 003's media queries capture line 418 or 704.
- Do NOT change `.btn-arrow`'s own transition at `assets/css/site.css:705`. The
  arrow nudge is hover decoration, not press feedback.
- Do NOT add `:active` states to elements that lack them today.
- Do NOT add dependencies.
- If the code at any cited line does not match the "current" excerpts above,
  STOP and report the drift instead of improvising.

## Verification

- **Mechanical**: no build step or linter applies to CSS here. Run
  `node serve.js` (http://localhost:4177) and confirm in DevTools → Elements →
  Styles that `transition-duration: 120ms` appears on the `:active` rules and is
  not struck through.

- **Feel check**: on the homepage, press and hold the primary CTA button, then a
  product card.
  - **Below-the-fold elements read as invisible on Chrome** (visibility is gated
    by scroll animation). Force them visible for inspection with:
    ```js
    document.querySelectorAll('[data-anim]').forEach(e => {
      e.style.cssText += ';animation:none!important;opacity:1!important;' +
                         'transform:none!important;clip-path:none!important;';
    });
    ```
  - Press and **hold** a `.btn`. The downward settle must feel immediate — it
    should land well before you consciously register having pressed.
  - **Release** and watch: the button should rise back to its hover position
    noticeably more slowly than it went down. If down and up feel the same speed,
    step 1 did not take effect.
  - In DevTools → Animations panel at **10%** playback, press a card and confirm
    the 3px drop completes in roughly half the time the hover lift takes.
  - Force `:active` from DevTools (Elements → `:hov` → check `:active`) on
    `.btn`, `a.card`, `.sector` and `.fam` in turn, and confirm each one moves.
  - On a touch device or in device emulation, tap a card and confirm the press
    dip still occurs — this plan must not remove touch press feedback.

- **Done when**: `grep -n "transition-duration: 120ms" assets/css/site.css assets/css/motion.css`
  returns exactly two hits (site.css:704 and motion.css inside the `:active`
  rule), and pressing any button, card, sector tile or family panel produces a
  visibly faster down-travel than up-travel.
