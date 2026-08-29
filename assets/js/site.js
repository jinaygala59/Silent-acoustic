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
        'Room type: ' + (d.get('room') || '\u2014'),
        'Room size: ' + (d.get('size') || '\u2014'),
        '',
        'What is wrong with the room:',
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
