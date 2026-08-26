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
| `assets/css/motion.css` | Scroll/enter animation only. Reveal is opt-in via `html.io`. |
| `assets/js/site.js` | Nav, filters, contact form, light source. |
| `assets/js/motion.js` | Adds `.in` to `[data-anim]` elements as they enter view. |
| `dist/` | Deploy bundle. Regenerate with the snippet in README. Gitignored. |

Adding a product or project is a `src/content.js` edit plus `node build.js` —
cards, detail pages, filters, counts and the sitemap all follow automatically.

## Non-obvious things that will bite you

**Animation gates visibility.** `[data-anim]` elements are hidden until
`motion.js` adds `.in`. When verifying in a browser, add the class — setting any
other attribute does nothing, and `[data-anim="frame"]` clips its contents away
entirely, which looks exactly like a broken image.

```js
document.querySelectorAll('[data-anim]').forEach(e => e.classList.add('in'));
```

**Scroll reveal is deliberately fail-safe.** `.rise`-style elements are visible
by default; the hidden state is applied by script only once it has confirmed it
can reveal them again. Do not "simplify" this into a CSS-only hidden state — a
script error would make the whole catalogue invisible.

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

- `--brand` is the cyan from the client's logo, and is the **only** interactive
  colour. `--brand-deep` / `--brand-ink` are the same hue tuned for contrast on
  fills and on the paper ground.
- `--brass` / `--brass-ink` are for **numerals and spec values only**.
- Dark sections and light sections alternate: dark where the page is
  atmospheric, light where it is informational.
- The logo is the client's asset. Scale it, never restyle or recolour it.

Every text/background pair currently measures at or above 4.5:1. If you change a
token, re-check — the brass and cyan both sit close to the line.

## Still outstanding

- **Contact form has no endpoint.** Set `SITE.formEndpoint` in `src/content.js`
  (Web3Forms key or Formspree URL) and rebuild. Until then it falls back to the
  visitor's mail client.
- Process steps, the About page commitments and the FAQ answers are written copy,
  not client-confirmed. They include a promise to re-measure and fix a room that
  misses its target.
