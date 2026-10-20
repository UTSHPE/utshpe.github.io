import manifest from "../data/imageManifest.json";

/*
 * Right-sized versions of a photo, from scripts/optimize-images.mjs.
 * responsive("/assets/images/x.jpg") -> { src, srcSet } pointing at the WebP copies;
 * a photo the script hasn't seen yet falls back to the original file.
 */
export function responsive(src) {
  const e = src && manifest[src];
  if (!e) return { src };
  const base = "/assets/images/opt/" + src.replace(/^\/assets\/images\//, "").replace(/\.[^.]+$/, "");
  const largest = e.widths[e.widths.length - 1];
  return {
    src: `${base}-${largest}.webp`,
    srcSet: e.widths.map((w) => `${base}-${w}.webp ${w}w`).join(", "),
  };
}

/* the same, as attributes for an <img> written as an HTML string */
export function responsiveAttrs(src, sizes) {
  const r = responsive(src);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return 'src="' + esc(r.src) + '"' + (r.srcSet ? ' srcset="' + esc(r.srcSet) + '" sizes="' + esc(sizes) + '"' : "");
}
