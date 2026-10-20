import { useEffect } from "react";

/*
 * Pause an element's looping CSS animations (the hero clouds, the sponsor belt) while it
 * is off screen: adds .paused, which styles/redesign/react.css maps to animation-play-state.
 */
export default function usePauseOffscreen(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("paused", !e.isIntersecting));
    io.observe(el);
    return () => { io.disconnect(); el.classList.remove("paused"); };
  }, [ref]);
}
