/*
 * Resolves once the landing intro is over and the hero copy has faded in (immediately if the
 * intro isn't playing), so network and rendering work the hero doesn't need yet waits instead
 * of stealing frames from the animation.
 */
const AFTER_FADE_MS = 1800; // the hero copy fades in over ~1.85s, starting just before the intro ends

let done = null;
export function whenIntroDone() {
  if (done) return done;
  const root = document.documentElement;
  if (!root.classList.contains("introing")) return Promise.resolve();
  done = new Promise((resolve) => {
    const mo = new MutationObserver(() => {
      if (root.classList.contains("introing")) return;
      mo.disconnect();
      setTimeout(resolve, AFTER_FADE_MS);
    });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
  });
  return done;
}
