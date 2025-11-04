// UT SHPE - Polaroid cross-fade slideshow
document.addEventListener("DOMContentLoaded", () => {
  const POLAROID_IMAGES = [
    "assets/images/Home_Page/slideshow1.jpg",
    "assets/images/Home_Page/slideshow2.jpg",
    "assets/images/Home_Page/slideshow3.jpg",
    "assets/images/Home_Page/slideshow4.jpg",
    "assets/images/Home_Page/slideshow5.jpg",
    "assets/images/Home_Page/slideshow6.jpg",
  ];

  setupPolaroidFader({
    frameSelector: ".polaroid .frame",
    images: POLAROID_IMAGES,
    intervalMs: 3500,   // time each image stays on screen
    fadeMs: 700         // fade duration
  });
});

function setupPolaroidFader({ frameSelector, images, intervalMs = 3500, fadeMs = 700 }) {
  const frame = document.querySelector(frameSelector);
  if (!frame || !images || images.length === 0) return;

 
  Object.assign(frame.style, {
    position: frame.style.position || "relative",
    overflow: "hidden"
  });

  // Create two stacked <img> tags
  const imgA = document.createElement("img");
  const imgB = document.createElement("img");

  [imgA, imgB].forEach((img) => {
    Object.assign(img.style, {
      position: "absolute",
      inset: "0",            // top:0 right:0 bottom:0 left:0
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "8px",
      transition: `opacity ${fadeMs}ms ease`,
      opacity: 0,
      display: "block"
    });
    img.alt = "UT SHPE Photos";
    img.decoding = "async";
    img.loading = "eager";
  });

  
  frame.innerHTML = "";
  frame.appendChild(imgA);
  frame.appendChild(imgB);

  let idx = 0;
  let showingA = true;

 
  imgA.src = images[idx];
  imgA.style.opacity = 1;

  images.slice(1).forEach((src) => {
    const p = new Image();
    p.src = src;
  });

  const next = () => {
    idx = (idx + 1) % images.length;

    const topImg   = showingA ? imgB : imgA; // will fade in
    const bottomImg= showingA ? imgA : imgB; // will fade out

    topImg.src = images[idx];
    requestAnimationFrame(() => {
      topImg.style.opacity = 1;
      bottomImg.style.opacity = 0;
      showingA = !showingA;
    });
  };

  let timer = setInterval(next, intervalMs);
}


document.addEventListener("DOMContentLoaded", () => {
  initEventCarousel(".next-event .event-carousel");
});

function initEventCarousel(rootSel) {
  const root = document.querySelector(rootSel);
  if (!root) return;

  const track   = root.querySelector(".event-track");
  const slides  = Array.from(track.children);
  const prevBtn = root.querySelector(".carousel-btn.prev");
  const nextBtn = root.querySelector(".carousel-btn.next");
  if (!slides.length || !prevBtn || !nextBtn) return;

  let index = 0;
  let slideW = getSlideWidth();

  function getSlideWidth() {
    const rect = slides[0].getBoundingClientRect();
    return Math.round(rect.width);
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length; // wrap
    track.style.transform = `translateX(${-index * slideW}px)`;
  }

  function onPrev() { goTo(index - 1); }
  function onNext() { goTo(index + 1); }

  prevBtn.addEventListener("click", onPrev);
  nextBtn.addEventListener("click", onNext);

  // Swipe / drag
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
  track.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    track.style.transition = ""; // use CSS transition (0.3s) again
    if (dx > 60) onPrev();
    else if (dx < -60) onNext();
    else goTo(index);
    track.releasePointerCapture(e.pointerId);
  });

  // Keyboard support (focus the carousel then use arrows)
  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); onPrev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
  });

  // Keep position correct on resize
  let rAF;
  function onResize() {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      slideW = getSlideWidth();
      goTo(index);
    });
  }
  window.addEventListener("resize", onResize);

  // Init
  goTo(0);
}


// Sponsors auto-scrolling wheel
document.addEventListener("DOMContentLoaded", () => {
  setupSponsorsAutoScroll({
    railSelector: ".sponsor-carousel",
    speedPxPerFrame: 1.0,   
    targetMultiple: 2.2     
  });
});

function setupSponsorsAutoScroll({ railSelector, speedPxPerFrame = 0.6, targetMultiple = 2.0 }) {
  const rail = document.querySelector(railSelector);
  if (!rail) return;

  // Safety styles 
  rail.style.overflow = "hidden";

  const originals = Array.from(rail.children);
  originals.forEach(el => {
    el.style.flex = "0 0 auto";
    el.style.display = el.style.display || "flex";
  });

  
  requestAnimationFrame(() => {
    const maxPasses = 20; 
    let passes = 0;

    const needsMore = () => rail.scrollWidth < rail.clientWidth * targetMultiple;
    while (needsMore() && passes < maxPasses) {
      originals.forEach(node => rail.appendChild(node.cloneNode(true)));
      passes++;
    }

    
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    
    const gapPx = getFlexGapPx(rail);
    const originalsWidth =
      originals.reduce((sum, el, i) => {
        const w = el.getBoundingClientRect().width;
        return sum + w + (i > 0 ? gapPx : 0);
      }, 0);

    
    function tick() {
      rail.scrollLeft += speedPxPerFrame;

      
      if (rail.scrollLeft >= originalsWidth) {
        rail.scrollLeft -= originalsWidth;
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function getFlexGapPx(rail) {
  const cs = getComputedStyle(rail);
  let gap = cs.columnGap || cs.gap || "0px";
  if (gap.includes(" ")) gap = gap.split(" ")[0]; 
  const val = parseFloat(gap);
  return Number.isFinite(val) ? val : 0;
}

(function(){
  const btn  = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-menu');
  if(!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', open);
  });

  menu.addEventListener('click', (e) => {
    if(e.target.closest('a.nav-link') && menu.classList.contains('open')){
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      document.body.classList.remove('no-scroll');
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && menu.classList.contains('open')){
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      document.body.classList.remove('no-scroll');
    }
  });
})();
