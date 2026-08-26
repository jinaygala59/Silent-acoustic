/* Silence Acoustic — interactions.
   Everything here is progressive: the site is fully readable and navigable
   with this file blocked. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  }

  /* ------------------------------- form -------------------------------- */
  var form = document.getElementById('enquiry');
  if (form) {
    var status = document.getElementById('f-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = [].slice.call(form.querySelectorAll('[required]')).filter(function (f) { return !f.value.trim(); });
      var email = form.querySelector('#f-email');
      if (missing.length) {
        status.textContent = 'Fill in the required fields, then send again.';
        missing[0].focus();
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        status.textContent = 'That email address does not look right.';
        email.focus();
        return;
      }
      /* No endpoint is wired up yet. Hand the enquiry to the mail client so
         nothing the visitor typed is lost. See README to connect a service. */
      var d = new FormData(form);
      var lines = [
        'Name: ' + (d.get('name') || ''),
        'Company: ' + (d.get('org') || '—'),
        'Email: ' + (d.get('email') || ''),
        'Phone: ' + (d.get('phone') || ''),
        'City: ' + (d.get('city') || '—'),
        'Room type: ' + (d.get('room') || '—'),
        'Room size: ' + (d.get('size') || '—'),
        '',
        'Problem:',
        (d.get('message') || '')
      ].join('\n');
      status.textContent = 'Opening your email app…';
      window.location.href = 'mailto:info@silenceacoustic.com'
        + '?subject=' + encodeURIComponent('Site enquiry — ' + (d.get('room') || 'acoustic treatment'))
        + '&body=' + encodeURIComponent(lines);
    });
  }
})();
