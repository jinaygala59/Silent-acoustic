# Silence Acoustic — silenceacoustic.com

A static website for Silence Acoustic (acoustic treatment and soundproofing, Mumbai).
26 pages of plain HTML, two CSS files, two JS files. No framework, no dependencies,
no build step needed to host it — upload the folder and it runs.

---

## ⚠️ Read this before you publish

Some content on this site was **written for the layout, not taken from your
records**. It is plausible and industry-standard, but it is not verified. Check
each item below before the site goes live.

| Needs checking | Where | Why |
|---|---|---|
| **Four spec figures with impossible units** | `src/content.js` → `specs` | Transcribed exactly as published on your site, but they look like unit errors: foam density **23 kg/cm³** and tensile **0.97 kg/cm²**; wooden slats weight **12 kg/cm**; perforated wooden panel density **32 kg/m³** (MDF/HDF is normally 700–800). Each is marked "(as published)" on the page. Fix them on the source site and here. |
| **All product descriptions** | `src/content.js` → each product's `lead` and `body` | My copy, written around your real specs. Accurate to the figures, but check the claims about method and application. |
| **The 7-step process** | `src/content.js` → `PROCESS` | Includes a promise to *re-measure the finished room and fix it if it misses the target*. Only keep this if you actually do it. |
| **"Four things we will not do"** | `src/pages.js` → About page | These are commitments. Confirm each one. |
| **The 6 FAQs** | `src/content.js` → `FAQ` | Includes specifics — free survey inside the MMR, travel refunded against the order, typical project durations. Confirm your real terms. |
| **Hero claims** | `src/pages.js` → homepage | "10+ yrs", "Pan-India", "In-house", "Free survey" — from your current site, but confirm "in-house manufacturing" describes your setup accurately. |

**Taken from your live site and verified**: company name, address, phone, both
email addresses, all 19 product names and their five families, the 10 room types
(using your own gallery labels), the 3 testimonials, your logo and favicon,
**every technical specification** (crawled from each product page), **all 265
photographs**, **all 170 projects** with your captions and sector tags, and the one
published blog post — kept at its original URL slug so its ranking survives the
rebuild.

**Testimonials are verbatim**, including the original grammar. They are real
people's words — do not edit them without a written source from the client.

**Projects are real.** All 170 come from your own projects gallery, with your
captions, your sector labels and your photographs. To add or edit one, use the
`PROJECTS` array in `src/content.js`:

```js
{ s: 'image-slug', n: 'Project name', l: 'Location', sec: 'Office Space' },
```

`s` points at `assets/img/projects/<s>.webp`, and `sec` must match one of the ten
`SECTORS` names exactly or the filter will not pick it up. The Projects page,
the homepage work grid and the filter counts all update on the next build.

## Images

Every photograph on the site is yours, pulled from silenceacoustic.com and
converted to WebP. Nothing is stock and nothing is AI-generated.

| Location | What | Count |
|---|---|---|
| `assets/img/products/<slug>-hero.webp` | Product page lead shot, 1600px | 19 |
| `assets/img/products/<slug>-card.webp` | Catalogue card, 800px | 19 |
| `assets/img/products/<slug>-1..3.webp` | Supporting gallery shots, 800px | 57 |
| `assets/img/projects/<slug>.webp` | Project photo, 760px | 170 |

10.2 MB in total, but **every image below the fold is lazy-loaded** — the projects
page carries 172 images and only 28 KB of them load before you scroll.

To replace a photo, drop a new file over the existing name and rebuild; nothing
else needs changing. Behind every image is the CSS surface texture for that product
family, so a missing or slow-loading file shows the material rather than a broken
icon. That is deliberate — if you swap images, you do not need to worry about gaps.

Which supporting shots exist per product is recorded in the `shots` array on each
product in `src/content.js`. If you add a fourth photo, add its number there.

---

## Running it

```bash
node serve.js
```

Then open <http://localhost:4177>. `serve.js` is for local preview only — it is
not needed on the live server.

## Editing content

**All copy lives in `src/content.js`.** Edit that file, then rebuild:

```bash
node build.js
```

That regenerates all 26 HTML pages plus `sitemap.xml` and `robots.txt`.
Page layouts live in `src/pages.js`; the shell (head, nav, footer) is in
`src/build.js`.

You can also hand-edit the generated `.html` files directly — they are plain,
readable HTML. Just be aware a rebuild overwrites them.

## Files

```
index.html  products.html  projects.html  about.html  blog.html  contact.html  404.html
products/           19 generated product pages
assets/css/site.css   design system — tokens, components, material textures
assets/css/motion.css scroll animation — reveals, parallax, the pinned rail
assets/js/site.js     nav, pointer light, contact form
assets/js/motion.js   retracting header + reveal fallback for Firefox
assets/img/         favicon
src/content.js      ← all text and product data lives here
src/pages.js        page layouts
src/build.js        shell, head, shared partials
build.js            run this to regenerate the site
serve.js            local preview server (not deployed)
sitemap.xml  robots.txt
```

## Connecting the contact form

**One setting.** In `src/content.js`, set `SITE.formEndpoint`:

```js
formEndpoint: 'YOUR_WEB3FORMS_ACCESS_KEY',       // or
formEndpoint: 'https://formspree.io/f/xxxxxxx',
```

Then `node build.js`. That is the whole job — no JavaScript to edit.

- **Web3Forms** (<https://web3forms.com>) — free, no account needed, paste the
  access key it emails you. Recommended.
- **Formspree** (<https://formspree.io>) — free tier, paste the full form URL.

Behaviour, all three paths tested:

| Situation | What the visitor gets |
|---|---|
| Endpoint set, submission works | Form clears, "Thank you — your enquiry is in." |
| Endpoint set, submission fails | Warning, then their mail app opens pre-filled. **Nothing they typed is lost.** |
| No endpoint set | Mail app opens pre-filled, with everything summarised |

Required fields and email format are validated before anything is sent, and the
first offending field takes focus.

## Rebuilding the deploy bundle

```bash
node build.js && rm -rf dist && mkdir dist && \
cp -R *.html products assets robots.txt sitemap.xml dist/ && \
git show HEAD:dist/.htaccess > dist/.htaccess 2>/dev/null || true
```

`dist/` holds only what the server needs. `src/`, `build.js`, `serve.js` and this
README are excluded. It also carries:

- **`.htaccess`** — for Apache/LiteSpeed (Hostinger). Clean URLs, 404, gzip,
  cache headers, and **37 permanent redirects** from the old WordPress URLs
  (`/product/<old-slug>/`, the ten sector pages, `/our-products`, `/contact-us`)
  so existing links and search rankings survive the switch.
- **`_redirects`** — the same redirect map for Netlify or Cloudflare Pages.

## Deploying

Upload the contents of **`dist/`** — nothing else. The site is currently live on
WordPress at Hostinger (LiteSpeed), so:

1. **Back up the WordPress site first.** Files and database. This replaces it.
2. Upload `dist/` to `public_html`, including the dotfile `.htaccess`
   (most FTP clients hide dotfiles by default — turn that on).
3. Check a few old URLs redirect: `/our-products`, `/contact-us`, and
   `/product/acoustic-wooden-slats-panels-for-auditorium-wall/`.
4. Confirm HTTPS still resolves and the padlock is clean.

**Consider a staging subdomain first** (`staging.silenceacoustic.com`, or drag
`dist/` onto Netlify for a free preview URL). The live site keeps earning while
the client reviews, and the switch is then a five-minute job.

On Netlify / Vercel / Cloudflare Pages, `dist/` deploys as-is: no build command,
`_redirects` and `404.html` are picked up automatically.

After launch, submit `https://silenceacoustic.com/sitemap.xml` in Google Search
Console and request re-indexing.

---

## Design notes

**Logo.** The site uses Silence Acoustic's own logo, taken from
`silenceacoustic.com/wp-content/uploads/2026/05/for-website-01-scaled.png`.
Four files in `assets/img/`:

| File | Used for |
|---|---|
| `logo-mark-light.png` | Header. Tagline removed — at 32px it is illegible mush. |
| `logo-full-light.png` | Footer. Full lockup including "Innovating Sound In A Better Way". |
| `logo-mark.png`, `logo-full.png` | Original black wordmark, for light backgrounds. Currently unused by the site — kept for documents, email signatures and print. |

The `-light` files are knockout versions: the near-black wordmark is remapped to
warm cream so it reads on the dark header, while the cyan bubble and the white
play triangle are left exactly as the brand has them. The logo is never recoloured
or restyled in CSS — only scaled, with height fixed and width automatic so it
cannot distort. `favicon.png` is the client's own favicon.

**Palette.** Neutral. A true greyscale from near-black (`#0E0E0F`) to off-white
(`#F2F2F1`), alternating: dark where the site is atmospheric, light where it is
informational — a treated room versus a datasheet. Nothing in the system is warm
or cool; there is no cream, no brass, no gold.

There is exactly **one hue on the whole site**: the cyan from the logo
(`--brand` `#2AB3DE`), reserved for interactive things only — links, focus rings,
primary buttons. Because it is the only colour, it reads as "you can click this"
rather than as decoration. Two tuned variants at the same hue exist because that
cyan is too light to carry white text or to sit on the light ground at 4.5:1:
`--brand-deep` (`#0E6C8B`) for solid fills and `--brand-ink` (`#0B6480`) for links
on light.

Everything that used to be a colour accent is now a step in **lightness**.
`--mark` (`#D8D8D6` on dark, `--mark-ink` `#4A4A4E` on light) carries figures,
hairline rules and markers. Spec values read brighter than their labels; that is
the only emphasis they get. Nothing on the page competes with the one cyan.

A fixed three-per-cent film grain sits over the whole viewport (`body::after`) so
the large flat neutrals read as paper stock rather than as screen fill — remove it
and the dark sections go flat immediately.

Every text/background pair has been measured. The lowest on the site is 5.9:1;
nothing falls below 4.5:1.

If you want a different accent, every one flows from the four `--brand` tokens at
the top of `assets/css/site.css` — change those and the whole site follows.

**Type.** Instrument Serif for display, set large — a 400-weight serif needs size to
carry a page. Instrument Sans for body copy, IBM Plex Mono for labels, specs and
buttons (the engineering register). All from Google Fonts. The families are set once
as `--display` / `--body` / `--mono` at the top of `assets/css/site.css`, and the
Google Fonts URL is the `FONTS` constant in `src/build.js` — change both together.

**The signature: there is no photography on this site.** Every product image is
its actual surface relief, drawn in CSS — slat ribs that catch a moving light,
micro-perforation dot grids, wedge sawtooth, tangled wood-wool fibre, laminated
glass. Each of the 19 products has its own texture, and each family keeps its own
place on the greyscale, because with hue gone that is the only thing left to
tell them apart: timber slats are the lightest, PET felt sits light-mid, cut
grooves are mid, ceiling baffles run high-contrast with near-black valleys, and
foam is the darkest surface in the set. A page of 19 cards still reads as a
materials library rather than a wall of identical grey rectangles.

The one exception is the printed panel, whose entire point is that it carries
print — it gets the logo cyan and two neutrals.

This also means the site never shows a broken or low-quality product photo.
When you have real photography, drop it into the `.card-surface` and `.pd-hero`
elements — the textures are the fallback, not a constraint.

**The light source.** Full-bleed walls are lit by a source that travels as you
scroll; cards light from the pointer. Both are disabled under
`prefers-reduced-motion`.

**Accessibility.** Scroll reveal is fail-safe — content is visible by default and
only hidden once JS confirms it can reveal it again, so a script error can never
leave the catalogue invisible. Textured headers carry contrast scrims so body copy
stays above 4.5:1. Keyboard focus is visible throughout, and the site is fully
readable with JS blocked.

**Motion.** The site animates on scroll, and it does it twice over.

Browsers with native scroll-driven animations (Chrome, Edge, Safari 26) run
everything in CSS via `animation-timeline: view()` / `scroll()` — off the main
thread, with no JavaScript involved at all. Firefox has no support yet, so
`motion.js` adds `html.io` and reproduces the reveals with an
IntersectionObserver; the scroll-*linked* pieces (parallax, the pinned rail)
simply sit still there, which reads as deliberate rather than broken.

There are five moves and nothing outside them gets motion:

| `data-anim` | Used on | What it does |
|---|---|---|
| `fade` | quiet copy, small blocks | 18px + opacity |
| `rise` | cards, tiles, panels | 34px + opacity |
| `reveal` | headings | lifted out of a mask |
| `frame` | material surfaces | clip wipe + a 1.04 scale settling |
| `line` | hairline rules | drawn left to right |

Add `data-stagger` to a grid and its children cascade. Everything is transform,
opacity or clip-path only — no layout, no filters, nothing that repaints.

**Nothing can strand content.** The hidden state is applied by the inline script
in `<head>` (`HEAD_BOOT` in `src/build.js`) and *only* on the Firefox path, and
that script arms a six-second timer that strips it back off unless `motion.js`
has arrived and claimed responsibility. A blocked, failed or slow script leaves
a plain readable page, never an empty one. The whole motion layer is inert under
`prefers-reduced-motion: reduce`.

**The pinned rail.** The homepage used to list all 19 product cards, which made
it 11,400px tall and told a first-time visitor nothing about how the range is
organised. It is now five family panels on a rail that travels sideways while
the section is pinned — every product family named, in a third of the height,
with the full catalogue one click away on `products.html`.

The markup is a plain horizontal snap rail. The pin is layered on top by
`motion.css` only where it can be driven natively, so narrow screens,
unsupported browsers and reduced-motion users get the snap rail itself, which
works fine. The pin length is a fixed `calc(100vh + 1200px)` rather than a
multiple of viewport height, because how far the track has to travel is set by
viewport *width* — a `vh` figure that felt right on a laptop became a long slow
drag on a tall display.
