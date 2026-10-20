import { useEffect, useRef } from "react";
import { SYMBOL } from "../../../lib/design";

const ROUTE = "M-60 780C150 810 330 650 480 610C650 565 930 540 930 380C930 240 720 215 625 320C560 395 640 500 720 450";

/*
 * Landing intro (every load of the home page): a paper plane flies in along a
 * dotted trail and lands as a sealed envelope; it opens, the postcard is pulled out
 * and grows into the hero. index.html adds `introing hideL` to <html> before first
 * paint; this runs the timeline, ported from the design with the same numbers.
 */
function startIntro(refs) {
  const root = document.documentElement, intro = refs.intro;
  const route = refs.route, len = route.getTotalLength(), mask = refs.mask, plane = refs.plane, env = refs.env;
  const in2 = intro.querySelector(".cardp .in2"), cardp = intro.querySelector(".cardp"), in2Html = in2.innerHTML;
  mask.style.strokeDasharray = len + " " + len; mask.style.strokeDashoffset = len;
  root.style.overflow = "hidden";
  let done = false, raf = 0, pa;
  const timers = [];
  const T = (fn, ms) => { timers.push(setTimeout(fn, ms)); };

  function finish() {
    if (done) return; done = true; timers.forEach(clearTimeout); cancelAnimationFrame(raf);
    root.classList.remove("introing", "hideL"); intro.style.display = "none";
    const ex = document.getElementById("exp");
    if (ex) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const fd = ex.dataset.mob ? 1100 : 400; ex.style.transition = "opacity " + fd + "ms ease"; ex.style.opacity = 0;
          setTimeout(() => { if (ex.parentNode) ex.parentNode.removeChild(ex); }, fd + 50);
        });
      });
    }
    root.style.overflow = "";
    [].forEach.call(document.querySelectorAll(".lt"), (l) => { l.style.transitionDelay = ""; });
  }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  const D = 1900; let t0 = null;
  function fly(ts) {
    if (done) return; if (t0 === null) t0 = ts;
    const t = Math.min(1, (ts - t0) / D), p = ease(t), L = p * len, a = route.getPointAtLength(L), b = route.getPointAtLength(Math.min(len, L + 3));
    const raw = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + Math.sin(t * 14) * 3 * (1 - t);
    if (t < 0.93) pa = raw; const ang = (t < 0.93) ? raw : (pa || raw);
    const land = t > 0.88 ? (t - 0.88) / 0.12 : 0, sc = 1.7 * (1 - 0.35 * land);
    plane.setAttribute("transform", "translate(" + a.x.toFixed(1) + " " + a.y.toFixed(1) + ") rotate(" + ang.toFixed(1) + ") scale(" + sc.toFixed(2) + ")");
    mask.style.strokeDashoffset = len * (1 - p);
    if (t < 1) { raf = requestAnimationFrame(fly); } else { land_(); }
  }
  function dup(el, sfx) {
    const c = el.cloneNode(true), ids = {}; [].forEach.call(c.querySelectorAll("[id]"), (n) => { ids[n.id] = 1; });
    if (c.id) ids[c.id] = 1;
    let html = c.outerHTML;
    Object.keys(ids).forEach((i) => { const e = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); html = html.replace(new RegExp('id="' + e + '"', "g"), 'id="' + i + sfx + '"').replace(new RegExp("url\\(#" + e + "\\)", "g"), "url(#" + i + sfx + ")").replace(new RegExp('href="#' + e + '"', "g"), 'href="#' + i + sfx + '"'); });
    const t = document.createElement("div"); t.innerHTML = html; return t.firstChild;
  }
  function syncCl(c) { try { const a = document.getElementById("cl").getAnimations()[0], e = c.querySelector(".cl"); if (a && e) e.style.animationDelay = (-a.currentTime) + "ms"; } catch { /* no Web Animations */ } }
  function land_() {
    plane.style.transition = "opacity .25s"; plane.style.opacity = 0;
    const mm = document.createElement("div"); mm.className = "mm";
    mm.style.aspectRatio = "1514 / 800"; in2.innerHTML = ""; in2.appendChild(mm);
    const sc = document.createElement("div"), cl = dup(document.querySelector(".hero .mur"), "-a"); sc.className = "sc"; syncCl(cl); sc.appendChild(cl); mm.appendChild(sc);
    sc.style.transform = "scale(" + (mm.clientWidth / 1514) + ")";
    cardp.style.height = (mm.offsetHeight + 18) + "px"; in2.style.height = mm.offsetHeight + "px";
    env.classList.add("in");
    T(() => { env.classList.add("open"); }, 560);
    T(() => { env.classList.add("lift"); }, 1270);
    T(() => { env.classList.add("pull"); }, 1500);
    T(expand, 2450);
    T(() => {
      const W = document.querySelector(".wash"), C = document.querySelector(".cover"), HC = [].slice.call(document.querySelectorAll(".hc"));
      W.style.transition = C.style.transition = "opacity 1.3s ease .15s";
      HC.forEach((el, i) => { el.style.transition = "opacity 1s ease " + (0.6 + i * 0.25) + "s,transform 1s ease " + (0.6 + i * 0.25) + "s"; });
    }, 3400);
    T(finish, 3480);
  }
  /* the mural card grows out of the envelope until it fills the header */
  function expand() {
    const card = intro.querySelector(".cardp .mm"), r = card.getBoundingClientRect(), hr = (document.querySelector(".hero .hfr") || document.querySelector(".hero")).getBoundingClientRect(), X = "cubic-bezier(.6,0,.25,1)", Dd = ".95s ";
    const exp = document.createElement("div"); exp.id = "exp";
    exp.style.cssText = "position:fixed;z-index:260;pointer-events:none;left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px";
    const bd = document.createElement("div"); bd.style.cssText = "position:absolute;inset:-9px;border-radius:6px;background:repeating-linear-gradient(-45deg,#D33E26 0 14px,#fff 14px 22px,#1272B8 22px 36px,#fff 36px 44px)";
    const ex = document.createElement("div"); ex.style.cssText = "position:absolute;inset:0;overflow:hidden;background:#6DB6D3";
    const m = dup(document.querySelector(".hero .mur"), "-b"); syncCl(m);
    m.style.left = "0px"; m.style.top = "0px"; m.style.transformOrigin = "0 0"; m.style.transform = "scale(" + (r.width / 1514) + ")";
    ex.appendChild(m); exp.appendChild(bd); exp.appendChild(ex); document.body.appendChild(exp);
    void exp.offsetWidth;
    exp.style.transition = "left " + Dd + X + ",top " + Dd + X + ",width " + Dd + X + ",height " + Dd + X;
    m.style.transition = "transform " + Dd + X; bd.style.transition = "opacity .7s ease .45s";
    exp.style.left = hr.left + "px"; exp.style.top = hr.top + "px"; exp.style.width = hr.width + "px"; exp.style.height = hr.height + "px";
    const rm = document.querySelector(".hero .mur").getBoundingClientRect(); m.style.transform = "translate(" + (rm.left - hr.left) + "px," + (rm.top - hr.top) + "px) scale(" + (rm.width / 1514) + ")"; bd.style.opacity = "0";
    intro.classList.add("go2");
  }
  // Take off once the page has booted (fonts shaped, mural decoded), so the flight doesn't
  // share the main thread with first-load work; never wait more than 1.2s.
  plane.style.opacity = 0;
  const letters = document.querySelector(".hero .gsi");
  const ready = Promise.all([
    document.fonts ? document.fonts.ready : null,
    letters && letters.decode ? letters.decode().catch(() => {}) : null,
  ]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 1200))]).then(() => {
    if (done) return;
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame((ts) => { if (done) return; plane.style.opacity = ""; fly(ts); });
    });
  });

  return {
    finish,
    /* stop without finishing (React unmount): undo every DOM change so a remount starts clean */
    stop() {
      done = true; timers.forEach(clearTimeout); cancelAnimationFrame(raf);
      env.className = "env"; plane.removeAttribute("transform"); plane.style.opacity = ""; plane.style.transition = "";
      in2.innerHTML = in2Html; in2.style.height = ""; cardp.style.height = "";
      intro.classList.remove("go2"); intro.style.display = "";
      document.getElementById("exp")?.remove();
      root.style.overflow = "";
    },
  };
}

// a teardown scheduled by an unmount; a quick remount (React StrictMode) cancels it
let pendingTeardown = null;

export default function Intro() {
  const introRef = useRef(null), routeRef = useRef(null), maskRef = useRef(null), planeRef = useRef(null), envRef = useRef(null);
  const runRef = useRef(null);

  useEffect(() => {
    clearTimeout(pendingTeardown); pendingTeardown = null;
    const root = document.documentElement;
    if (!root.classList.contains("introing")) return;
    const run = startIntro({ intro: introRef.current, route: routeRef.current, mask: maskRef.current, plane: planeRef.current, env: envRef.current });
    runRef.current = run;
    return () => {
      run.stop();
      runRef.current = null;
      // leaving Home mid-intro: drop the intro state unless Home remounts right away
      pendingTeardown = setTimeout(() => {
        root.classList.remove("introing", "hideL");
        root.style.overflow = "";
        pendingTeardown = null;
      }, 0);
    };
  }, []);

  return (
    <div id="intro" aria-hidden="true" ref={introRef}>
      <svg className="pl" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs><mask id="im" maskUnits="userSpaceOnUse" x="-100" y="0" width="1700" height="1000"><path id="imp" ref={maskRef} d={ROUTE} fill="none" stroke="#fff" strokeWidth="34" strokeLinecap="round" /></mask></defs>
        <path d={ROUTE} fill="none" stroke="#F26838" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 15" mask="url(#im)" />
        <path id="route" ref={routeRef} d={ROUTE} fill="none" stroke="none" />
        <g id="plane" ref={planeRef}><g id="planeS" stroke="#0A2350" strokeWidth="3" strokeLinejoin="round"><polygon points="40,0 -30,-26 -20,0" fill="#fff" /><polygon points="40,0 -30,26 -20,0" fill="#CFE6EF" /><polygon points="-20,0 -30,-26 -26,-3" fill="#F26838" /></g></g>
      </svg>
      <div className="env" id="env" ref={envRef}>
        <div className="bk"></div>
        <div className="frt"></div>
        {/* plain HTML: the timeline swaps this card's contents for a copy of the mural */}
        <div className="cardp" dangerouslySetInnerHTML={{ __html: '<div class="in2"><img src="' + SYMBOL + '" alt=""><div class="g">Greetings from</div><div class="u">UT SHPE</div></div>' }} />
        <div className="pk"></div>
        <svg className="cr" viewBox="0 0 480 300" aria-hidden="true"><path d="M0 300L240 156L480 300" fill="none" stroke="#DCCBAE" strokeWidth="2" /></svg>
        <div className="fl"></div>
        <div className="sl"><i><img src={SYMBOL} alt="" /></i></div>
        <div className="fr"></div>
      </div>
      <button className="skip" id="skip" type="button" onClick={() => runRef.current?.finish()}>Skip intro</button>
    </div>
  );
}
