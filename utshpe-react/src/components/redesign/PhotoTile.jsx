import { photo } from "../../lib/constants";

/* The design's S.cam, as JSX so a tile can also hold children (stickers). */
export function Cam() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="4" y="10" width="40" height="30" rx="6" fill="none" stroke="#16316B" strokeWidth="3" />
      <circle cx="24" cy="25" r="7" fill="none" stroke="#16316B" strokeWidth="3" />
      <rect x="16" y="5" width="16" height="6" rx="2" fill="#16316B" />
    </svg>
  );
}

/*
 * S.ph(tone, label, cls, style): a rounded photo tile. With `src` the photo fills
 * the tile (tone stays as the loading color) and replaces the camera icon.
 */
export default function PhotoTile({ tone, label, cls, style, src, alt, focus, children }) {
  const img = photo(src);
  return (
    <div className={"phd " + (cls || "")} style={{ background: tone, ...style }}>
      {img ? <img className="pimg" src={img} alt={alt ?? label ?? ""} loading="lazy" style={focus ? { objectPosition: focus } : undefined} /> : <Cam />}
      {label ? <span>{label}</span> : null}
      {children}
    </div>
  );
}
