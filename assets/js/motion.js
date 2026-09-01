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

  /* ------------------------------ live figures --------------------------
     A figure that counts up to itself. One element on the site uses it — the
     hero's years-in-business — and it is here rather than in CSS on purpose.

     The CSS-only version of this animates a registered `<integer>` custom
     property and prints it with `counter()`, which means the number stops
     being real text: a screen reader and a crawler both get nothing, because
     generated content is not content. The figure stays in the markup and this
     overwrites it, so with JavaScript blocked, failed or slow the published
     number is simply what renders.

     A wrong number is worse than a still one, so the digits are not touched
     until a frame has proved it can arrive, and they are only ever blanked
     while the rail is still held at `opacity: 0` by its own 800ms `[data-in]`
     delay. A guard timer covers frames that start and then stop.

     `data-count-to` carries the target, so the target is the markup's, never
     parsed back out of the rendered text. */
  var ticks = document.querySelectorAll('[data-count-to]');
  if (ticks.length && !reduce) {
    [].forEach.call(ticks, function (el) {
      var to = parseInt(el.getAttribute('data-count-to'), 10);
      if (!(to > 0)) { return; }

      var DELAY = 850;    /* the rail is invisible until 800ms */
      var DUR   = 1000;
      var start = null;
      var done  = false;

      var land = function () {
        if (done) { return; }
        done = true;
        el.textContent = String(to);
      };

      var frame = function (t) {
        if (start === null) { start = t; }
        var p = Math.min(1, (t - start) / DUR);
        /* Ease-out QUADRATIC, not cubic, and the exponent was measured rather
           than picked. An ease-in is wrong outright — it would hold the number
           near zero through the half anyone actually watches. But cubic
           overshoots the other way when the range is this short: rounding to
           whole years, 20 * (1 - (1-p)^3) already reads 20 at p = 0.708, so a
           1200ms run spent its last 350ms showing a number that had stopped
           moving. Quadratic reaches 20 at p = 0.842, so the count fills its
           own duration. If the target figure ever gets much larger, cubic
           becomes the better curve again — the flat tail is a function of
           having only twenty distinct values to show. */
        var e = 1 - Math.pow(1 - p, 2);
        if (p < 1) {
          el.textContent = String(Math.round(to * e));
          window.requestAnimationFrame(frame);
        } else {
          land();
        }
      };

      /* NOTHING IS BLANKED UNTIL A FRAME HAS ACTUALLY ARRIVED. This probe is
         the same contract the reveal fallback keeps above — prove you can
         finish before you start.

         The first version blanked the digits the moment this file ran and
         relied on a guard timer to put the figure back. That is a real bad
         state, not a theoretical one: `requestAnimationFrame` does not fire
         at all in a tab that is not painting (a background tab, and every
         automated browser pane — measured at zero frames in 2.5s), so the
         rail would fade in at 1580ms reading "0" and sit there until the
         guard fired. Now, if frames never come, the published figure is never
         touched.

         The guard still exists for the case frames start and then stop —
         switching tabs mid-count — and it is tight, because by then the
         digits are already on screen. */
      window.requestAnimationFrame(function () {
        el.textContent = '0';
        window.setTimeout(land, DELAY + DUR + 400);
        window.setTimeout(function () { window.requestAnimationFrame(frame); }, DELAY);
      });
    });
  }

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
