/* Silence Acoustic — interactions.
   Everything here is progressive: the site is fully readable and navigable
   with this file blocked. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* iOS only applies :active to elements it considers interactive, so the
     press-pop on .review (a <figure>, which leads nowhere and so is correctly
     not a button or a link) never fires on iPhone or iPad. A single empty
     touch listener on the document opts the whole page into the behaviour —
     the long-standing fix, and the reason this is here rather than in the
     stylesheet. Passive, so it never delays a scroll.

     Progressive, like the rest of this file: with the script blocked, desktop
     hover still works and touch simply gets no pop. */
  document.addEventListener('touchstart', function () {}, { passive: true });

  /* ---------------------------- mobile nav ----------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
        toggle.focus();
      }
    });
  }

  /* --------------------------- the light source -------------------------
     Panels light from the pointer, so a card reads as a lit object rather
     than a swatch. Walls no longer do this — they are moved by the CSS in
     motion.css instead, which costs no main-thread work at all.
     Scoped to devices with a real pointer; a touch device gets nothing. */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', function (e) {
      var s = e.target.closest ? e.target.closest('.card, .sector, .fam, .gal-item, .pd-hero') : null;
      if (!s) return;
      var surf = s.classList.contains('surface') ? s : s.querySelector('.surface');
      if (!surf) return;
      var r = surf.getBoundingClientRect();
      surf.style.setProperty('--lx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      surf.style.setProperty('--ly', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    }, { passive: true });
  }

  /* --------------------------- project filter --------------------------
     State lives in aria-pressed and a single class; the stylesheet owns the
     colours so this keeps working through a palette change. */
  var filters = [].slice.call(document.querySelectorAll('.filter'));
  var gal = document.getElementById('gal');
  if (filters.length && gal) {
    var items = [].slice.call(gal.querySelectorAll('[data-sector]'));
    var count = document.getElementById('gal-count');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var want = btn.getAttribute('data-filter');
        filters.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        var shown = 0;
        items.forEach(function (el) {
          var match = want === 'all' || el.getAttribute('data-sector') === want;
          el.hidden = !match;
          if (match) shown++;
        });
        if (count) {
          count.textContent = want === 'all'
            ? 'Showing all ' + shown + ' projects'
            : 'Showing ' + shown + ' ' + (shown === 1 ? 'project' : 'projects') + ' in ' + want;
        }
      });
    });

    /* The room index links in as `#room=<sector>`. Reading the hash here
       rather than duplicating the show/hide logic means the index and the
       filter buttons can never disagree about what is on screen. Runs on
       load and on hashchange, because a same-page hash link does not
       reload. */
    var applyHash = function () {
      var m = /^#room=(.+)$/.exec(location.hash || '');
      if (!m) return;
      var want = decodeURIComponent(m[1]);
      var btn = filters.filter(function (b) {
        return b.getAttribute('data-filter') === want;
      })[0];
      if (!btn) return;
      btn.click();
      gal.scrollIntoView({ block: 'start' });
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
  }

  /* ---------------------------- image lightbox --------------------------
     Every gallery tile crops its photograph: .gal-surface is aspect-ratio
     3/2 with object-fit: cover, so the tile shows the middle of a 760x570
     frame. Clicking opens the whole frame, uncropped.

     Progressive, like the rest of this file. The markup wraps each surface in
     a real <a href> pointing at the image file, so with the script blocked
     the link still opens the photograph — and it is keyboard-focusable and
     Enter-activatable for free. This only intercepts the click.

     The photographs are 760x570. The figure is capped at 960px so the
     lightbox stops short of a 1.3x upscale; going full-bleed here would look
     soft, and the honest fix is higher-resolution originals, not more CSS. */
  var zooms = [].slice.call(document.querySelectorAll('.gal-zoom'));
  if (zooms.length) {
    var lb = null, lbImg = null, lbCap = null, lbClose = null, opener = null;

    var build = function () {
      lb = document.createElement('div');
      lb.className = 'lb';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Project photograph');
      lb.hidden = true;
      lb.innerHTML =
        '<button class="lb-close" type="button" aria-label="Close">Close</button>' +
        '<figure class="lb-fig"><img alt=""><figcaption></figcaption></figure>';
      document.body.appendChild(lb);
      lbImg = lb.querySelector('img');
      lbCap = lb.querySelector('figcaption');
      lbClose = lb.querySelector('.lb-close');
      lbClose.addEventListener('click', close);
      /* Backdrop only — a click on the figure itself must not close it. */
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      /* Two focusables, so the trap is a wrap rather than a real tab ring. */
      lb.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
      });
    };

    function close() {
      if (!lb || lb.hidden) return;
      lb.hidden = true;
      if (opener) { opener.focus(); opener = null; }
    }

    zooms.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var src = a.getAttribute('href');
        if (!src) return;
        e.preventDefault();
        if (!lb) build();
        var img = a.querySelector('img');
        var cap = a.parentNode.querySelector('.gal-cap');
        lbImg.src = src;
        lbImg.alt = img ? img.getAttribute('alt') || '' : '';
        lbCap.textContent = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : '';
        opener = a;
        /* Visibility is NOT gated on a class applied in requestAnimationFrame.
           It was, and that is a real failure mode rather than a theoretical
           one: rAF does not fire in a background or non-painting tab, so the
           dialog unhid at opacity 0 and stayed invisible with focus trapped
           inside it. The fade is a CSS animation on .lb instead, which runs
           off the style change alone. */
        lb.hidden = false;
        lbClose.focus();
      });
    });
  }

  /* --------------------------- floating controls ------------------------
     Reveal both once the reader is a screen down, and send the top button
     home. Lives here rather than in motion.js because motion.js returns early
     under prefers-reduced-motion — a way back to the top of a long page has
     to work for everyone, so only its transition is motion, not its function.

     One rAF-throttled passive listener, matching the two already in
     motion.js. It reads scrollY and writes one class; the threshold is a
     viewport height, with a 40px hysteresis band so the pair cannot flicker
     when a scroll settles right on the line. */
  var floats = document.querySelector('.floats');
  if (floats) {
    var shown = false, queued = false;
    var settle = function () {
      var y = window.scrollY;
      var on = shown ? y > window.innerHeight - 40 : y > window.innerHeight + 40;
      if (on !== shown) { shown = on; floats.classList.toggle('on', on); }
      queued = false;
    };
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; window.requestAnimationFrame(settle); }
    }, { passive: true });
    settle();

    var top = floats.querySelector('.float-top');
    if (top) {
      top.addEventListener('click', function () {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        /* Send focus back to the top of the document as well as the viewport,
           or a keyboard user is returned visually and left where they were. */
        var skip = document.querySelector('.skip');
        if (skip) skip.focus({ preventScroll: true });
      });
    }
  }

  /* ------------------------------- form --------------------------------
     The endpoint is configured once in src/content.js (SITE.formEndpoint) and
     rendered onto the form as data-endpoint, so nobody has to edit this file
     to make enquiries arrive. Empty endpoint = mail-client fallback. */
  var form = document.getElementById('enquiry');
  if (form) {
    /* Read at submit time, not at init — so the attribute stays the single
       source of truth even if something sets it after load. */
    var endpoint = function () { return (form.getAttribute('data-endpoint') || '').trim(); };
    var FORM_TO = form.getAttribute('data-to') || 'info@silenceacoustic.com';
    var status = document.getElementById('f-status');
    var submit = form.querySelector('[type="submit"]');

    var say = function (msg, tone) {
      status.textContent = msg;
      status.setAttribute('data-tone', tone || '');
    };

    var summarise = function (d) {
      return [
        'Name: ' + (d.get('name') || ''),
        'Company: ' + (d.get('org') || '\u2014'),
        'Email: ' + (d.get('email') || ''),
        'Phone: ' + (d.get('phone') || ''),
        'City: ' + (d.get('city') || '\u2014'),
        'Project type: ' + (d.get('room') || '\u2014'),
        'Room size: ' + (d.get('size') || '\u2014'),
        '',
        'Brief about the project:',
        (d.get('message') || '')
      ].join('\n');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var missing = [].slice.call(form.querySelectorAll('[required]')).filter(function (f) { return !f.value.trim(); });
      if (missing.length) {
        say('Fill in the required fields, then send again.', 'warn');
        missing[0].focus();
        return;
      }
      var email = form.querySelector('#f-email');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        say('That email address does not look right.', 'warn');
        email.focus();
        return;
      }

      var d = new FormData(form);

      /* No endpoint configured — hand it to the visitor's mail client. */
      var FORM_ENDPOINT = endpoint();
      if (!FORM_ENDPOINT) {
        say('Opening your email app\u2026');
        window.location.href = 'mailto:' + FORM_TO
          + '?subject=' + encodeURIComponent('Site enquiry \u2014 ' + (d.get('room') || 'acoustic treatment'))
          + '&body=' + encodeURIComponent(summarise(d));
        return;
      }

      var url = FORM_ENDPOINT;
      if (FORM_ENDPOINT.indexOf('http') !== 0) {          // a bare Web3Forms key
        d.append('access_key', FORM_ENDPOINT);
        url = 'https://api.web3forms.com/submit';
      }
      d.append('subject', 'Site enquiry \u2014 ' + (d.get('room') || 'acoustic treatment'));
      d.append('from_name', 'silenceacoustic.com');

      if (submit) { submit.disabled = true; }
      say('Sending\u2026');

      fetch(url, { method: 'POST', body: d, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.ok ? r : Promise.reject(r.status); })
        .then(function () {
          form.reset();
          say('Thank you \u2014 your enquiry is in. We reply within one working day.', 'ok');
        })
        .catch(function () {
          /* Never strand the visitor: fall back to their mail client. */
          say('That did not send. Opening your email app instead\u2026', 'warn');
          window.location.href = 'mailto:' + FORM_TO
            + '?subject=' + encodeURIComponent('Site enquiry \u2014 ' + (d.get('room') || 'acoustic treatment'))
            + '&body=' + encodeURIComponent(summarise(d));
        })
        .then(function () { if (submit) { submit.disabled = false; } });
    });
  }

  /* ------------------------- banner carousel ----------------------------
     The arrows are BUILT HERE rather than sitting in the markup, because a
     control that cannot work without this file should not exist without it.
     With the script blocked the banner is still the CSS cross-fade, and with
     that gated off too (Reduce Motion) it is still one static photograph.

     They are appended to .hero-top, NOT to .hero-media: the photographs are
     decoration and .hero-media carries aria-hidden="true". A button inside an
     aria-hidden subtree is stripped from the accessibility tree while staying
     keyboard focusable — a screen reader user tabs onto a control that
     announces nothing. That is the easiest way to get this wrong. */
  var media = document.querySelector('.hero-media');
  var slides = media ? [].slice.call(media.querySelectorAll('.hero-slide')) : [];
  /* The headline blocks are the slides' twins: same count, same order, and
     index i addresses the pair. They are NOT inside .hero-media — that
     subtree is aria-hidden decoration and the copy is the page's actual
     words — so they are collected separately and `.is-manual` goes on
     .hero-top, the nearest ancestor of both. */
  var stage = document.querySelector('.hero-top');
  var says = stage ? [].slice.call(stage.querySelectorAll('.hero-say')) : [];
  var paired = says.length === slides.length;

  if (media && media.parentNode && slides.length > 1) {
    var manual = false;
    var at = 0;

    /* Which slide is on screen right now. The auto cross-fade may be part way
       through its loop when the reader first reaches for an arrow — starting
       from 0 would jump the banner backwards before it stepped forward. */
    function showing() {
      var best = 0, top = -1;
      for (var n = 0; n < slides.length; n++) {
        var o = parseFloat(window.getComputedStyle(slides[n]).opacity) || 0;
        if (o > top) { top = o; best = n; }
      }
      return best;
    }

    var live = document.createElement('p');
    live.className = 'vh';
    live.setAttribute('aria-live', 'polite');

    function step(by) {
      if (!manual) {
        manual = true;
        at = showing();
        media.classList.add('is-manual');
        /* .hero-top, so the same class gates both the photograph and the
           headline. The old code put it on .hero-media only, which was
           correct while .hero-media was the only thing that moved. */
        if (stage) { stage.classList.add('is-manual'); }
      }
      /* Which way the banner travels, for the slide-in in theme.css. The
         stylesheet keys off `[data-dir]` being present at all, so an arrow
         slides and the untouched first load does not — it has nowhere to
         have come from. Written before the class change so the attribute is
         already right when the animation starts. */
      if (stage) { stage.setAttribute('data-dir', by > 0 ? 'next' : 'prev'); }

      /* CLEAR THE WHOLE SET, DO NOT ASSUME `at` HOLDS IT. The markup is
         asymmetric — `.hero-say` ships its first block with `.is-on` and no
         `.hero-slide` ships with it at all — so clearing only index `at`
         left say 0 lit for good whenever the auto rotation had already moved
         past slide 0 when the reader first reached for an arrow: `at` came
         back 1 or 2 from showing(), the remove was a no-op, and the page
         then carried TWO headlines stacked on one photograph. Clearing every
         index is indifferent to where the class started. */
      for (var n = 0; n < slides.length; n++) {
        slides[n].classList.remove('is-on');
        if (paired) { says[n].classList.remove('is-on'); }
      }
      at = (at + by + slides.length) % slides.length;
      slides[at].classList.add('is-on');
      if (paired) { says[at].classList.add('is-on'); }

      /* Announce the slide the reader has just moved to by its own words, not
         as "image 2 of 3". The headline blocks are aria-hidden — only the
         first is a real heading in the document — so without this the reader
         gets a count and no idea what changed on screen. */
      var label = 'Banner image ' + (at + 1) + ' of ' + slides.length;
      if (paired) {
        var t = says[at].querySelector('.hero-title');
        var e = says[at].querySelector('.eyebrow');
        if (t) {
          label = (e ? e.textContent.trim() + '. ' : '') + t.textContent.trim()
            + ' (' + (at + 1) + ' of ' + slides.length + ')';
        }
      }
      live.textContent = label;
    }

    function button(label, path, by) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hero-nav-btn';
      b.setAttribute('aria-label', label);
      b.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none"'
        + ' aria-hidden="true" focusable="false"><path d="' + path + '"'
        + ' stroke="currentColor" stroke-width="2.1" stroke-linecap="round"'
        + ' stroke-linejoin="round"/></svg>';
      b.addEventListener('click', function () { step(by); });
      return b;
    }

    var nav = document.createElement('div');
    nav.className = 'hero-nav';
    nav.appendChild(button('Previous banner image', 'M15 5 8 12l7 7', -1));
    nav.appendChild(button('Next banner image', 'M9 5l7 7-7 7', 1));
    nav.appendChild(live);

    /* Left/Right once focus is inside the control group, which is what a
       reader who has just tabbed onto an arrow will try. */
    nav.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });

    media.parentNode.appendChild(nav);
  }

  /* ---------------------------- page curtain ----------------------------
     A same-site page link plays the curtain across the screen, then
     navigates; the next page's HEAD_BOOT sees the flag and uncovers. See the
     PAGE TRANSITION block at the end of theme.css. Skipped for anything that
     is not an ordinary same-tab page load: modifier keys, new tabs,
     downloads, other origins, tel:/mailto:, in-page #anchors, image files
     (the lightbox), and any click another handler already claimed. */
  var curtainOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', function (e) {
    if (!curtainOK || e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.target === '_blank' || a.hasAttribute('download')) { return; }
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) { return; }
    if (!/(\.html|\/)$/.test(url.pathname)) { return; }
    if (url.pathname === location.pathname && url.hash) { return; }
    e.preventDefault();
    try { sessionStorage.setItem('g-curtain', '1'); } catch (err) {}
    document.documentElement.classList.add('curtain-out');
    window.setTimeout(function () { location.href = url.href; }, 540);
  });
  /* Back/forward restores a page from the cache with the curtain still
     drawn across it — take it down. */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { document.documentElement.classList.remove('curtain-out', 'curtain-in'); }
  });

  /* -------------------------- products carousel --------------------------
     Progressive, like the rest of this file. The row itself is native CSS
     scroll-snap and is already draggable, snapping and readable with this
     script blocked — so the arrows, the dots and the keyboard are INJECTED
     here rather than written into the markup. A control is never on the page
     without the behaviour behind it.

     `--car-n` (how many tiles are in view) is read back off the track rather
     than restated here, so the breakpoints live in exactly one place:
     theme.css. One page is the track's visible width, because each tile is
     sized `100% / --car-n`. */
  var smooth = 'scrollBehavior' in document.documentElement.style;

  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (car) {
    var track = car.querySelector('.g-car-track');
    if (!track || !track.children.length) { return; }

    var NS = 'http://www.w3.org/2000/svg';
    var count = track.children.length;

    function perView() {
      var n = parseInt(window.getComputedStyle(track).getPropertyValue('--car-n'), 10);
      return n > 0 ? n : 1;
    }
    function pages() { return Math.max(1, Math.ceil(count / perView())); }
    function maxScroll() { return Math.max(0, track.scrollWidth - track.clientWidth); }

    /* The last page is SHORT whenever the tiles do not divide by `--car-n`
       (ten tiles, three in view), so its target is clamped to the end of the
       scroller. Without the clamp the final dot scrolls to a position the
       track cannot reach, and so can never read as current. */
    function targetFor(i) { return Math.min(i * track.clientWidth, maxScroll()); }
    function current() {
      var w = track.clientWidth;
      /* A carousel in a `display: none` branch — a closed accordion, a tab
         that is not showing — measures zero, and the divide below would then
         hand back NaN, which reads as neither disabled nor enabled and leaves
         both arrows live. Answer page 0 until it has a width. */
      if (!w) { return 0; }
      var ms = maxScroll();
      if (ms <= 1) { return 0; }
      if (track.scrollLeft >= ms - 1) { return pages() - 1; }
      return Math.round(track.scrollLeft / w);
    }

    function arrow(d) {
      var s = document.createElementNS(NS, 'svg');
      s.setAttribute('viewBox', '0 0 20 20');
      s.setAttribute('aria-hidden', 'true');
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', '2');
      p.setAttribute('stroke-linecap', 'square');
      s.appendChild(p);
      return s;
    }
    function btn(label, d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'g-car-btn';
      b.setAttribute('aria-label', label);
      b.appendChild(arrow(d));
      return b;
    }

    var ctl  = document.createElement('div'); ctl.className = 'g-car-ctl';
    var prev = btn('Previous products', 'M12 4 L6 10 L12 16');
    var next = btn('Next products', 'M8 4 L14 10 L8 16');
    var dots = document.createElement('ul'); dots.className = 'g-car-dots';
    var live = document.createElement('p');
    live.className = 'vh';
    live.setAttribute('aria-live', 'polite');

    ctl.appendChild(prev); ctl.appendChild(dots); ctl.appendChild(next);
    car.appendChild(ctl); car.appendChild(live);

    /* The dot count follows `--car-n`, so it is rebuilt when a breakpoint
       changes it — but only then, or every scroll frame would rebuild it. */
    var built = -1;
    function buildDots() {
      var n = pages();
      if (n === built) { return; }
      built = n;
      dots.textContent = '';
      for (var i = 0; i < n; i++) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'g-car-dot';
        b.setAttribute('data-i', String(i));
        b.setAttribute('aria-label', 'Products, page ' + (i + 1) + ' of ' + n);
        li.appendChild(b);
        dots.appendChild(li);
      }
    }

    function sync() {
      buildDots();
      var i = current(), n = pages();
      prev.disabled = i <= 0;
      next.disabled = i >= n - 1;
      Array.prototype.forEach.call(dots.querySelectorAll('.g-car-dot'), function (b, k) {
        if (k === i) { b.setAttribute('aria-current', 'true'); }
        else { b.removeAttribute('aria-current'); }
      });
    }

    /* Reduce Motion gets the same paging with no travel — the jump is the
       destination, not an animation of getting there. */
    function go(i) {
      var n = pages();
      i = Math.max(0, Math.min(i, n - 1));
      var x = targetFor(i);
      if (smooth) { track.scrollTo({ left: x, behavior: reduce ? 'auto' : 'smooth' }); }
      else { track.scrollLeft = x; }
      live.textContent = 'Page ' + (i + 1) + ' of ' + n;
    }

    prev.addEventListener('click', function () { go(current() - 1); });
    next.addEventListener('click', function () { go(current() + 1); });
    dots.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.g-car-dot') : null;
      if (b) { go(parseInt(b.getAttribute('data-i'), 10)); }
    });

    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(current() - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
    });

    var tick = 0;
    track.addEventListener('scroll', function () {
      if (tick) { return; }
      tick = window.requestAnimationFrame(function () { tick = 0; sync(); });
    }, { passive: true });
    window.addEventListener('resize', sync);

    /* MOUSE DRAG. Touch and trackpad already scroll a scroll container
       natively; dragging with a mouse is the one thing they do not give you,
       so this is pointerType 'mouse' only and never fights a real touch.
       Snap is suspended for the duration (`data-drag`), because otherwise the
       browser pulls back to the nearest tile on every move. */
    var dragging = false, startX = 0, startLeft = 0, moved = 0;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) { return; }
      dragging = true; moved = 0;
      startX = e.clientX; startLeft = track.scrollLeft;
      car.setAttribute('data-drag', 'on');
    });
    track.addEventListener('pointermove', function (e) {
      if (!dragging) { return; }
      var dx = e.clientX - startX;
      if (Math.abs(dx) > moved) { moved = Math.abs(dx); }
      track.scrollLeft = startLeft - dx;
    });
    function endDrag() {
      if (!dragging) { return; }
      dragging = false;
      car.removeAttribute('data-drag');
      go(Math.round(track.scrollLeft / track.clientWidth));
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);
    /* A drag that travelled must not ALSO follow the product link under the
       cursor. Capture phase, so this lands before the page-curtain handler
       on the document. `moved` resets on the next pointerdown, so a plain
       click after a drag is not swallowed. */
    track.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    /* Native image dragging would otherwise take over from the first move. */
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* AUTOPLAY (by request: "products to slide automatically"). One page every
       AUTO_MS, wrapping from the last page back to the first. It holds while
       anything says a reader is busy with it: pointer over it, keyboard focus
       inside it, a drag or touch in progress, the row scrolled off screen, or
       the tab hidden. Any manual move restarts the count, so it never jumps
       the moment after someone has chosen a page.

       The pause button is not optional: content that moves by itself for more
       than five seconds needs a way to stop it (WCAG 2.2.2), and hover-to-
       pause does nothing on a phone. Once paused with the button it stays
       paused. Reduce Motion: no autoplay at all, and no button, since there
       is nothing to stop. */
    if (!reduce && pages() > 1) {
      var AUTO_MS = 4000;
      var timer = 0, stopped = false, hover = false, focusIn = false,
          touching = false, onScreen = true;

      var playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.className = 'g-car-btn g-car-play';
      ctl.appendChild(playBtn);
      function drawPlay() {
        playBtn.textContent = '';
        playBtn.appendChild(arrow(stopped ? 'M7 4 L15 10 L7 16 Z' : 'M7 4 V16 M13 4 V16'));
        playBtn.setAttribute('aria-label', stopped ? 'Play automatic sliding' : 'Pause automatic sliding');
        playBtn.setAttribute('aria-pressed', stopped ? 'true' : 'false');
      }

      function held() {
        return stopped || hover || focusIn || touching || dragging || !onScreen || document.hidden;
      }
      function arm() {
        window.clearTimeout(timer);
        if (held()) { return; }
        timer = window.setTimeout(function () {
          if (held()) { return; }
          var i = current(), n = pages();
          var nextI = i >= n - 1 ? 0 : i + 1;
          var x = targetFor(nextI);
          /* No live-region announcement here: a screen reader being told
             "Page 2 of 4" every four seconds is noise it did not ask for. */
          if (smooth) { track.scrollTo({ left: x, behavior: 'smooth' }); }
          else { track.scrollLeft = x; }
          arm();
        }, AUTO_MS);
      }

      playBtn.addEventListener('click', function () {
        stopped = !stopped;
        drawPlay();
        if (stopped) { window.clearTimeout(timer); } else { arm(); }
      });
      car.addEventListener('mouseenter', function () { hover = true;  arm(); });
      car.addEventListener('mouseleave', function () { hover = false; arm(); });
      car.addEventListener('focusin',  function () { focusIn = true; arm(); });
      car.addEventListener('focusout', function (e) {
        if (!car.contains(e.relatedTarget)) { focusIn = false; arm(); }
      });
      track.addEventListener('touchstart', function () { touching = true; arm(); }, { passive: true });
      track.addEventListener('touchend',   function () { touching = false; arm(); }, { passive: true });
      track.addEventListener('pointerup',  arm);
      [prev, next, dots].forEach(function (el) { el.addEventListener('click', arm); });
      document.addEventListener('visibilitychange', arm);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          onScreen = es[0].isIntersecting; arm();
        }, { threshold: 0.35 }).observe(car);
      }

      drawPlay();
      arm();
    }

    sync();
  });

  /* -------------------------- sticky reveal footer ----------------------
     Turns the sticky under-page footer on only while it fits the screen,
     and tells the CSS how far the reveal runs (the footer's height as a
     percentage of the viewport). See STICKY REVEAL FOOTER in theme.css. */
  var foot = document.querySelector('.site-foot');
  if (foot) {
    var root = document.documentElement;
    var fitFoot = function () {
      var h = foot.offsetHeight, vh = window.innerHeight;
      var fits = h > 0 && h <= vh * 0.85;
      root.classList.toggle('foot-reveal', fits);
      if (fits) { root.style.setProperty('--foot-end', Math.min(100, (h / vh) * 100).toFixed(2) + '%'); }
    };
    fitFoot();
    window.addEventListener('resize', fitFoot);
    window.addEventListener('load', fitFoot);
  }

  /* -------------------------- sticky reveal banner ----------------------
     The homepage banner pins while the page slides over it — only while it
     fits the screen. See STICKY REVEAL BANNER in theme.css. */
  var heroEl = document.querySelector('.hero');
  if (heroEl) {
    var rootEl = document.documentElement;
    var fitHero = function () {
      var h = heroEl.offsetHeight;
      var fits = h > 0 && h <= window.innerHeight;
      rootEl.classList.toggle('hero-reveal', fits);
      if (fits) { rootEl.style.setProperty('--hero-h', h + 'px'); }
    };
    fitHero();
    window.addEventListener('resize', fitHero);
    window.addEventListener('load', fitHero);
  }
})();
