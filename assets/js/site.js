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
})();
