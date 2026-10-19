import useMediaQuery from "./useMediaQuery";

export function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

export default function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
