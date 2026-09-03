/* Builds a faithful simulation of a browser with NO scroll timelines:
   - a copy of motion.css with every @supports (animation-timeline: …) block removed
   - a copy of index.html that loads it, and stubs CSS.supports so motion.js
     takes its IntersectionObserver path exactly as an older iPhone would. */
const fs = require('fs');

const css = fs.readFileSync('assets/css/motion.css', 'utf8');
/* Blank comments out FIRST, keeping length and newlines so every index still
   lines up with the original. Without this the search below matches
   "@supports (animation-timeline: view())" written in PROSE inside a comment,
   then brace-matches forward from the next `{` — which is whatever real block
   follows the comment — and deletes it wholesale. That is what silently ate
   the entire engine-2 fallback block and made a working stylesheet look
   broken. src/designboard.js carries the same warning for the same reason. */
const scan = css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
// brace-match and drop each @supports (animation-timeline …) { … }
let out = '', i = 0;
for (;;) {
  const at = scan.indexOf('@supports (animation-timeline', i);
  if (at === -1) { out += css.slice(i); break; }
  out += css.slice(i, at);
  let j = scan.indexOf('{', at), d = 0, k = j;
  for (; k < scan.length; k++) {
    if (scan[k] === '{') d++;
    else if (scan[k] === '}') { d--; if (!d) break; }
  }
  i = k + 1;
}
fs.writeFileSync('assets/css/_motion-nosupport.css', out);

const html = fs.readFileSync('index.html', 'utf8')
  .replace('assets/css/motion.css', 'assets/css/_motion-nosupport.css')
  .replace('<script>(function(d){d.classList.remove(\'no-js\');',
    "<script>(function(){var s=CSS.supports.bind(CSS);CSS.supports=function(a,b){"
    + "if(String(a).indexOf('animation-timeline')>-1||String(b||'').indexOf('view()')>-1)return false;"
    + "return s(a,b)}})();</script>\n<script>(function(d){d.classList.remove('no-js');");
fs.writeFileSync('_iotest.html', html);

const dropped = (scan.match(/@supports \(animation-timeline/g) || []).length;
console.log('stripped @supports blocks:', dropped);
console.log('css bytes:', css.length, '->', out.length);
console.log('still mentions animation-timeline:', /animation-timeline/.test(out));

/* ---- and a Reduce Motion simulation ------------------------------------
   The browser pane cannot emulate prefers-reduced-motion, so invert the two
   media conditions in a copy of the stylesheet and stub matchMedia so the
   scripts take the same branch a phone with the toggle on would. */
const rcss = css
  .replace(/\(prefers-reduced-motion:\s*reduce\)/g, '(min-width: 0px)')
  .replace(/\(prefers-reduced-motion:\s*no-preference\)/g, '(min-width: 99999px)');
fs.writeFileSync('assets/css/_motion-reduce.css', rcss);

const rhtml = fs.readFileSync('index.html', 'utf8')
  .replace('assets/css/motion.css', 'assets/css/_motion-reduce.css')
  .replace("<script>(function(d){d.classList.remove('no-js');",
    "<script>(function(){var m=window.matchMedia.bind(window);window.matchMedia=function(q){"
    + "if(String(q).indexOf('prefers-reduced-motion: reduce')>-1)return {matches:true,media:q,addListener:function(){},addEventListener:function(){}};"
    + "if(String(q).indexOf('prefers-reduced-motion: no-preference')>-1)return {matches:false,media:q,addListener:function(){},addEventListener:function(){}};"
    + "return m(q)}})();</script>\n<script>(function(d){d.classList.remove('no-js');");
fs.writeFileSync('_reducetest.html', rhtml);
console.log('reduce simulation written: _reducetest.html');
