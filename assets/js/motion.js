/* Silence Acoustic — motion.
   ---------------------------------------------------------------------------
   Loaded early and deliberately small. Its whole job is to cover what CSS
   cannot do on its own:

     1. Scroll direction — no CSS primitive exposes it, so the retracting
        header is driven from here on every browser.
     2. A reveal fallback for browsers without native scroll timelines.
        Nothing is hidden until this file has proved it can show it again.

   Everything else — parallax, the pinned rail, the progress bar, the process
   spine — is native CSS on browsers that have `animation-timeline`, and simply
   sits still on browsers that do not. There is no JavaScript scroll loop
   anywhere in this file. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var native = window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');

  /* --------------------------- retracting header ------------------------
     Hysteresis, not a raw delta: a 6px threshold stops the header flickering
     on trackpad jitter, and it never hides inside the first viewport. */
  var head = document.querySelector('.site-head');
  if (head && !reduce) {
    var last = window.scrollY;
    var pending = false;
    var step = function () {
      var y = window.scrollY;
      var d = y - last;
      doc.classList.toggle('head-solid', y > 40);
      if (Math.abs(d) > 6) {
        doc.classList.toggle('head-up', d > 0 && y > window.innerHeight * 0.6);
        last = y;
      }
      pending = false;
    };
    window.addEventListener('scroll', function () {
      if (!pending) { pending = true; window.requestAnimationFrame(step); }
    }, { passive: true });
    step();
  }

  if (reduce) return;

  /* ------------------------- reveal fallback only -----------------------
     Browsers with native scroll timelines never reach this. */
  if (native || !('IntersectionObserver' in window)) return;

  var targets = [].slice.call(document.querySelectorAll('[data-anim]'));
  if (!targets.length) return;

  /* Claim the hidden state the inline head script put in place. Until this
     line runs, that script's six-second timer is still armed and will strip
     `html.io` back off — so a blocked or failed motion.js leaves a plain,
     fully readable page rather than an empty one. */
  doc.dataset.mo = '1';
  doc.classList.add('io');

  var showAll = function () {
    for (var i = 0; i < targets.length; i++) targets[i].classList.add('in');
  };

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      entries[i].target.classList.add('in');
      io.unobserve(entries[i].target);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

  for (var i = 0; i < targets.length; i++) io.observe(targets[i]);

  /* Failsafes: anything the observer has not reached in four seconds is shown
     anyway, and printing always shows everything. */
  window.setTimeout(showAll, 4000);
  window.addEventListener('beforeprint', showAll);

  /* The progress bar is CSS-driven natively; here it needs a hand. One rAF
     per scroll burst, one style write, no reads. */
  var bar = document.querySelector('.progress > i');
  if (bar) {
    var barPending = false;
    var draw = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      barPending = false;
    };
    window.addEventListener('scroll', function () {
      if (!barPending) { barPending = true; window.requestAnimationFrame(draw); }
    }, { passive: true });
    draw();
  }
})();
