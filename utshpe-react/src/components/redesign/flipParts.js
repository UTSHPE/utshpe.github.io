import { useState } from "react";
import { miniStamp, SIL } from "../../lib/design";
import { photo } from "../../lib/constants";
import { responsiveAttrs } from "../../lib/images";

const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/* the photo corner: a photo (or the navy silhouette) under the numbered mini stamp */
export function photoCorner(src, i, small, focus) {
  const img = photo(src);
  return (img ? '<img class="pimg" ' + responsiveAttrs(img, "auto, 246px") + ' alt="" loading="lazy" decoding="async"' + (focus ? ' style="object-position:' + attr(focus) + '"' : "") + ">" : SIL) + miniStamp(i, small);
}

/* click toggles the flip too (hover and focus flip it in CSS); links on the back don't */
export function useFlip() {
  const [flip, setFlip] = useState(false);
  const onClick = (e) => { if (!e.target.closest(".ic a")) setFlip((f) => !f); };
  return [flip, onClick];
}
