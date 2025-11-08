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

function rafThrottle(fn) {
  let scheduled = false;
  return function (...args) {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fn.apply(this, args);
    });
  };
}

function whenImagesReady(rootOrImgs, cb) {
  const imgs = Array.isArray(rootOrImgs)
    ? rootOrImgs
    : Array.from((rootOrImgs || document).querySelectorAll("img"));

  let left = imgs.length;
  if (left === 0) return cb();

  const done = () => {
    left--;
    if (left <= 0) cb();
  };

  imgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      done();
    } else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });
}

function setImportant(el, prop, val) {
  el.style.setProperty(prop, val, "important");
}

function setupPolaroidFader({ frameSelector, images, intervalMs = 3500, fadeMs = 700 }) {
  const frame = document.querySelector(frameSelector);
  if (!frame || !images || !images.length) return;

  const cs = getComputedStyle(frame);
  if (!cs.position || cs.position === "static") frame.style.position = "relative";
  setImportant(frame, "overflow", "hidden");

  let imgA = frame.querySelector("img");
  let imgB = document.createElement("img");
  if (!imgA) imgA = document.createElement("img");

  const styleSlide = (el) => {
    setImportant(el, "position", "absolute");
    setImportant(el, "inset", "0");
    setImportant(el, "width", "100%");
    setImportant(el, "height", "100%");
    setImportant(el, "object-fit", "cover");
    setImportant(el, "border-radius", "8px");
    el.style.transition = `opacity ${fadeMs}ms ease`;
    el.style.opacity = "0";
    el.alt = "UT SHPE Photos";
    el.decoding = "async";
    el.loading = "eager";
  };

  styleSlide(imgA);
  styleSlide(imgB);

  frame.innerHTML = "";
  frame.appendChild(imgA);
  frame.appendChild(imgB);

  let i = 0;
  let showA = true;

  imgA.src = images[i];
  imgA.style.opacity = "1";

  images.slice(1).forEach((src) => {
    const p = new Image();
    p.src = src;
  });

  const next = () => {
    i = (i + 1) % images.length;
    const topImg = showA ? imgB : imgA;
    const bottomImg = showA ? imgA : imgB;
    topImg.src = images[i];
    requestAnimationFrame(() => {
      topImg.style.opacity = "1";
      bottomImg.style.opacity = "0";
      showA = !showA;
    });
  };

  let timer = setInterval(next, intervalMs);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      clearInterval(timer);
    } else {
      clearInterval(timer);
      timer = setInterval(next, intervalMs);
    }
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

  let index = 0;
  let slideW = 0;

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

  let startX = 0;
  let dragging = false;
  let startTransformX = 0;

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
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext();
    }
  });

  const recalc = rafThrottle(() => {
    slideW = measure();
    goTo(index);
  });

  whenImagesReady(track, recalc);
  window.addEventListener("resize", recalc);
  recalc();
}

function setupSponsorsMarquee({ railSelector, speedPxPerSec = 40 }) {
  const rail = document.querySelector(railSelector);
  if (!rail) return;

  const items = Array.from(rail.children);
  if (!items.length) return;

  const track = document.createElement("div");
  track.className = "sponsor-track";
  track.style.display = "flex";
  track.style.alignItems = "center";
  track.style.gap = getComputedStyle(rail).gap || "20px";
  track.style.willChange = "transform";
  track.style.backfaceVisibility = "hidden";
  track.style.transform = "translateX(0)";

  rail.innerHTML = "";
  rail.style.overflow = "hidden";
  rail.appendChild(track);

  items.forEach((n) => track.appendChild(n.cloneNode(true)));
  items.forEach((n) => track.appendChild(n.cloneNode(true)));

  const imgs = Array.from(track.querySelectorAll("img"));

  let contentW = 0;
  let offset = 0;
  let paused = false;
  let visible = true;

  function measure() {
    const children = Array.from(track.children);
    const gapVal = (getComputedStyle(track).gap || "0").split(" ")[0];
    const gap = parseFloat(gapVal) || 0;

    contentW = children.reduce((sum, el, idx) => {
      const w = el.getBoundingClientRect().width;
      return sum + w + (idx ? gap : 0);
    }, 0);

    if (!Number.isFinite(contentW) || contentW <= 0) contentW = 1;
  }

  function fillIfNeeded() {
    const vw = rail.clientWidth || 1;
    let guard = 0;
    while (contentW < vw * 2.2 && guard++ < 20) {
      items.forEach((n) => track.appendChild(n.cloneNode(true)));
      measure();
    }
  }

  function start() {
    measure();
    fillIfNeeded();
  }

  function onVis() {
    visible = document.visibilityState === "visible";
  }

  rail.addEventListener("pointerdown", () => {
    paused = true;
  });

  window.addEventListener("pointerup", () => {
    paused = false;
  });

  document.addEventListener("visibilitychange", onVis);

  const onResize = rafThrottle(() => {
    measure();
    fillIfNeeded();
  });

  window.addEventListener("resize", onResize);

  whenImagesReady(imgs, () => {
    start();
    rafTick((dt) => {
      if (!visible || paused) return;
      const pxPerMs = speedPxPerSec / 1000;
      offset -= pxPerMs * dt;
      if (-offset >= contentW / 2) {
        offset += contentW / 2;
      }
      track.style.transform = `translateX(${offset}px)`;
    });
  });
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

document.addEventListener("DOMContentLoaded", () => {
  const POLAROID_IMAGES = [
    "assets/images/Home_Page/slideshow1.jpg",
    "assets/images/Home_Page/slideshow2.jpg",
    "assets/images/Home_Page/slideshow3.jpg",
    "assets/images/Home_Page/slideshow4.jpg",
    "assets/images/Home_Page/slideshow5.jpg",
    "assets/images/Home_Page/slideshow6.jpg"
  ];

  setupPolaroidFader({
    frameSelector: ".polaroid .frame",
    images: POLAROID_IMAGES,
    intervalMs: 3500,
    fadeMs: 700
  });

  initEventCarousel(".next-event .event-carousel");

  setupSponsorsMarquee({
    railSelector: ".sponsor-carousel",
    speedPxPerSec: 40
  });

  setupHamburger();
});
