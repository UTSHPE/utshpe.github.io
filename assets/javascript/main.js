// UT SHPE - Polaroid cross-fade slideshow
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

function whenImagesReady(imgsOrRoot, cb) {
  const imgs = Array.isArray(imgsOrRoot)
    ? imgsOrRoot
    : Array.from((imgsOrRoot || document).querySelectorAll('img'));

  let remaining = imgs.length;
  if (remaining === 0) return cb();

  const done = () => {
    remaining--;
    if (remaining <= 0) cb();
  };

  imgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      done();
    } else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true }); 
    }
  });
}


function setupPolaroidFader({
  frameSelector,
  images,
  intervalMs = 3500,
  fadeMs = 700
}) {
  const frame = document.querySelector(frameSelector);
  if (!frame || !images || images.length === 0) return;

  
  const frameStyle = frame.style;
  if (!getComputedStyle(frame).position || getComputedStyle(frame).position === 'static') {
    frameStyle.position = 'relative';
  }
  frameStyle.overflow = 'hidden';

 
  let existing = frame.querySelector('img');
  let imgA = existing || document.createElement('img');
  let imgB = document.createElement('img');

  const applySlideStyles = (img) => {
    const s = img.style;
    s.position = 'absolute';
    s.inset = '0';
    s.width = '100%';
    s.height = '100%';
    s.objectFit = 'cover';
    s.borderRadius = '8px';
    s.transition = `opacity ${fadeMs}ms ease`;
    s.opacity = '0';
    s.display = 'block';
    img.alt = 'UT SHPE Photos';
    img.decoding = 'async';
    img.loading = 'eager';
  };

  applySlideStyles(imgA);
  applySlideStyles(imgB);

  
  frame.innerHTML = '';
  frame.appendChild(imgA);
  frame.appendChild(imgB);

  let idx = 0;
  let showingA = true;

  
  imgA.src = images[idx];
  imgA.style.opacity = '1';

  
  images.slice(1).forEach((src) => { const p = new Image(); p.src = src; });

  const next = () => {
    idx = (idx + 1) % images.length;
    const topImg    = showingA ? imgB : imgA;
    const bottomImg = showingA ? imgA : imgB;

    topImg.src = images[idx];
    requestAnimationFrame(() => {
      topImg.style.opacity = '1';
      bottomImg.style.opacity = '0';
      showingA = !showingA;
    });
  };

  let timer = setInterval(next, intervalMs);

  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
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

  const track   = root.querySelector('.event-track');
  const slides  = Array.from(track ? track.children : []);
  const prevBtn = root.querySelector('.carousel-btn.prev');
  const nextBtn = root.querySelector('.carousel-btn.next');
  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  let index = 0;
  let slideW = 0;

  const measure = () => {
    if (!slides[0]) return 0;
    const rect = slides[0].getBoundingClientRect();
    return Math.round(rect.width);
  };

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * slideW}px)`;
  };

  const onPrev = () => goTo(index - 1);
  const onNext = () => goTo(index + 1);

  prevBtn.addEventListener('click', onPrev);
  nextBtn.addEventListener('click', onNext);


  let startX = 0, dragging = false, startTransformX = 0;
  track.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    startTransformX = -index * slideW;
    track.style.transition = 'none';
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    track.style.transform = `translateX(${startTransformX + dx}px)`;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    track.style.transition = ''; 
    if (dx > 60) onPrev();
    else if (dx < -60) onNext();
    else goTo(index);
    track.releasePointerCapture(e.pointerId);
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  
  root.tabIndex = 0;
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); onPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
  });

  const recalc = rafThrottle(() => {
    slideW = measure();
    goTo(index);
  });

  
  whenImagesReady(track, recalc);
  window.addEventListener('resize', recalc);

  // Init
  recalc();
}


function setupSponsorsAutoScroll({
  railSelector,
  speedPxPerFrame = 0.6,
  targetMultiple = 2.2
}) {
  const rail = document.querySelector(railSelector);
  if (!rail) return;

  rail.style.overflow = 'hidden';
  rail.style.scrollBehavior = 'auto';

  const originals = Array.from(rail.children);
  originals.forEach((el) => {
    el.style.flex = '0 0 auto';
    el.style.display = el.style.display || 'flex';
  });

  const imgs = Array.from(rail.querySelectorAll('img'));

  const start = () => {
    
    const needMore = () => rail.scrollWidth < rail.clientWidth * targetMultiple;
    let guard = 0;
    while (needMore() && guard++ < 24) {
      originals.forEach((n) => rail.appendChild(n.cloneNode(true)));
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let originalsWidth = 0;
    const computeOriginalsWidth = () => {
      const gapPx = getFlexGapPx(rail);
      originalsWidth = originals.reduce((sum, el, i) => {
        const w = el.getBoundingClientRect().width;
        return sum + w + (i ? gapPx : 0);
      }, 0);
      if (!Number.isFinite(originalsWidth) || originalsWidth <= 0) {
        originalsWidth = 1; 
      }
    };

    const recalc = rafThrottle(() => {
    
      if (rail.scrollWidth < rail.clientWidth * targetMultiple) {
        let passes = 0;
        while (rail.scrollWidth < rail.clientWidth * targetMultiple && passes++ < 10) {
          originals.forEach((n) => rail.appendChild(n.cloneNode(true)));
        }
      }
      computeOriginalsWidth();
      rail.scrollLeft = 0;
    });

    computeOriginalsWidth();

    let running = true;
    let touching = false;

    const onVis = () => { running = (document.visibilityState === 'visible'); };
    const onDown = () => { touching = true; };
    const onUp = () => { touching = false; };

    document.addEventListener('visibilitychange', onVis);
    rail.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', recalc);

    
    const ro = new ResizeObserver(recalc);
    ro.observe(rail);

    const tick = () => {
      if (running && !touching) {
        rail.scrollLeft += speedPxPerFrame;
        if (rail.scrollLeft >= originalsWidth) {
          rail.scrollLeft -= originalsWidth;
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  whenImagesReady(imgs, start);

  function getFlexGapPx(node) {
    const cs = getComputedStyle(node);
    let gap = cs.columnGap || cs.gap || '0px';
    if (gap.includes(' ')) gap = gap.split(' ')[0];
    const val = parseFloat(gap);
    return Number.isFinite(val) ? val : 0;
  }
}

//mobile menu
function setupHamburger() {
  const btn  = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-menu');
  if (!btn || !menu) return;

  const openMenu = () => {
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };
  const closeMenu = () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  btn.addEventListener('click', () => {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a.nav-link')) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const POLAROID_IMAGES = [
    'assets/images/Home_Page/slideshow1.jpg',
    'assets/images/Home_Page/slideshow2.jpg',
    'assets/images/Home_Page/slideshow3.jpg',
    'assets/images/Home_Page/slideshow4.jpg',
    'assets/images/Home_Page/slideshow5.jpg',
    'assets/images/Home_Page/slideshow6.jpg',
  ];
  setupPolaroidFader({
    frameSelector: '.polaroid .frame',
    images: POLAROID_IMAGES,
    intervalMs: 3500,
    fadeMs: 700
  });

  initEventCarousel('.next-event .event-carousel');

  
  setupSponsorsAutoScroll({
    railSelector: '.sponsor-carousel',
    speedPxPerFrame: 1.0,
    targetMultiple: 2.2
  });

  
  setupHamburger();
});
