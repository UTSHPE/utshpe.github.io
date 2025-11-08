function whenImagesReady(rootOrImgs, cb) {
  const imgs = Array.isArray(rootOrImgs)
    ? rootOrImgs
    : Array.from((rootOrImgs || document).querySelectorAll("img"));
  let left = imgs.length;
  if (left === 0) return cb();
  const done = () => { left--; if (left <= 0) cb(); };
  imgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });
}

function rafTick(cb) {
  let last = 0;
  function loop(ts) {
    const dt = ts - last;
    last = ts;
    cb(dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function setupHamburger() {
  const btn = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#site-menu");
  if (!btn || !menu) return;
  const openMenu = () => {
    menu.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  };
  const closeMenu = () => {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };
  btn.addEventListener("click", () => {
    if (menu.classList.contains("open")) closeMenu();
    else openMenu();
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a.nav-link")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
  });
}

function setupHeroFaderSimple(frameSelector, urls, intervalMs) {
  const box = document.querySelector(frameSelector);
  if (!box || !urls || !urls.length) return;

  box.innerHTML = "";
  box.style.position = box.style.position || "relative";
  box.style.overflow = "hidden";

  const imgs = urls.map((src) => {
    const im = document.createElement("img");
    im.src = src;
    im.alt = "UT SHPE Photos";
    im.decoding = "async";
    im.loading = "eager";
    im.style.position = "absolute";
    im.style.inset = "0";
    im.style.width = "100%";
    im.style.height = "100%";
    im.style.objectFit = "cover";
    im.style.borderRadius = "8px";
    im.style.opacity = "0";
    im.style.transition = "opacity 700ms ease";
    box.appendChild(im);
    return im;
  });

  let i = 0, timer = null, N = imgs.length;

  function render() {
    imgs.forEach((im, k) => { im.classList.toggle("is-active", k === i); im.style.opacity = k === i ? "1" : "0"; });
  }
  function next() { i = (i + 1) % N; render(); }
  function play() { if (!timer) timer = setInterval(next, intervalMs); }
  function pause() { if (timer) { clearInterval(timer); timer = null; } }

  whenImagesReady(imgs, () => { render(); play(); });

  let sx = 0, dx = 0;
  box.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; dx = 0; pause(); }, { passive: true });
  box.addEventListener("touchmove", (e) => { dx = e.touches[0].clientX - sx; }, { passive: true });
  box.addEventListener("touchend", () => { if (Math.abs(dx) > 40) next(); play(); });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") pause();
    else play();
  });
}

function initEventCarousel(rootSel) {
  const root = document.querySelector(rootSel);
  if (!root) return;
  const track = root.querySelector(".event-track");
  const slides = Array.from(track ? track.children : []);
  const prevBtn = root.querySelector(".carousel-btn.prev");
  const nextBtn = root.querySelector(".carousel-btn.next");
  if (!track || !slides.length || !prevBtn || !nextBtn) return;

  let index = 0, slideW = 0;

  const measure = () => {
    if (!slides[0]) return 0;
    const r = slides[0].getBoundingClientRect();
    return Math.round(r.width);
  };
  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * slideW}px)`;
  };
  const onPrev = () => goTo(index - 1);
  const onNext = () => goTo(index + 1);

  prevBtn.addEventListener("click", onPrev);
  nextBtn.addEventListener("click", onNext);

  let startX = 0, dragging = false, startTransformX = 0;
  track.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    startTransformX = -index * slideW;
    track.style.transition = "none";
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    track.style.transform = `translateX(${startTransformX + dx}px)`;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    track.style.transition = "";
    if (dx > 60) onPrev();
    else if (dx < -60) onNext();
    else goTo(index);
    track.releasePointerCapture(e.pointerId);
  };
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); onPrev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
  });

  const recalc = () => { slideW = measure(); goTo(index); };
  whenImagesReady(track, recalc);
  window.addEventListener("resize", recalc);
  recalc();
}

function setupSponsorsMarqueeSimple(railSelector, speedPxPerSec) {
  const rail = document.querySelector(railSelector);
  if (!rail) return;

  const originals = Array.from(rail.children);
  if (!originals.length) return;

  rail.innerHTML = "";
  rail.style.overflow = "hidden";

  const track = document.createElement("div");
  track.style.display = "flex";
  track.style.alignItems = "center";
  track.style.gap = getComputedStyle(rail).gap || "20px";
  track.style.willChange = "transform";
  rail.appendChild(track);

  originals.forEach((n) => track.appendChild(n.cloneNode(true)));
  originals.forEach((n) => track.appendChild(n.cloneNode(true)));

  const imgs = Array.from(track.querySelectorAll("img"));
  let contentW = 0, offset = 0, paused = false, visible = true;

  function measure() {
    const kids = Array.from(track.children);
    const gapVal = (getComputedStyle(track).gap || "0").split(" ")[0];
    const gap = parseFloat(gapVal) || 0;
    contentW = kids.reduce((sum, el, idx) => {
      const w = el.getBoundingClientRect().width;
      return sum + w + (idx ? gap : 0);
    }, 0);
    if (!Number.isFinite(contentW) || contentW <= 0) contentW = 1;
  }

  function fillIfNeeded() {
    const vw = rail.clientWidth || 1;
    let guard = 0;
    while (contentW < vw * 2.2 && guard++ < 20) {
      originals.forEach((n) => track.appendChild(n.cloneNode(true)));
      measure();
    }
  }

  function start() {
    measure();
    fillIfNeeded();
  }

  rail.addEventListener("touchstart", () => { paused = true; }, { passive: true });
  rail.addEventListener("touchend", () => { paused = false; }, { passive: true });
  rail.addEventListener("pointerdown", () => { paused = true; });
  window.addEventListener("pointerup", () => { paused = false; });

  document.addEventListener("visibilitychange", () => {
    visible = document.visibilityState === "visible";
  });

  const onResize = () => { measure(); fillIfNeeded(); };
  window.addEventListener("resize", onResize);

  whenImagesReady(imgs, () => {
    start();
    rafTick((dt) => {
      if (!visible || paused) return;
      const pxPerMs = speedPxPerSec / 1000;
      offset -= pxPerMs * dt;
      if (-offset >= contentW / 2) offset += contentW / 2;
      track.style.transform = `translateX(${offset}px)`;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const POLAROID_IMAGES = [
    "assets/images/Home_Page/slideshow1.jpg",
    "assets/images/Home_Page/slideshow2.jpg",
    "assets/images/Home_Page/slideshow3.jpg",
    "assets/images/Home_Page/slideshow4.jpg",
    "assets/images/Home_Page/slideshow5.jpg",
    "assets/images/Home_Page/slideshow6.jpg"
  ];

  setupHamburger();

  setupHeroFaderSimple(".polaroid .frame", POLAROID_IMAGES, 3500);

  initEventCarousel(".next-event .event-carousel");

  setupSponsorsMarqueeSimple(".sponsor-carousel", 40);
});
