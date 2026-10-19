import { useEffect } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/*
 * The design's scroll reveal: body.rv hides every [data-r] until it first scrolls
 * into view (threshold .1), then adds .in once. A MutationObserver picks up
 * [data-r] elements that render later (route changes, async data).
 */
export default function useReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    document.body.classList.add("rv");
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    const seen = new WeakSet();
    const scan = (root) => {
      const list = root.matches?.("[data-r]") ? [root] : [];
      list.push(...(root.querySelectorAll?.("[data-r]") || []));
      list.forEach((el) => { if (!seen.has(el)) { seen.add(el); if (!el.classList.contains("in")) io.observe(el); } });
    };
    scan(document.body);
    const mo = new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && scan(n))));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); document.body.classList.remove("rv"); };
  }, []);
}
