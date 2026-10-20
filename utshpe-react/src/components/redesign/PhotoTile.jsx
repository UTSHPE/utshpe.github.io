import { photo } from "../../lib/constants";
import { responsive } from "../../lib/images";

/*
 * A right-sized photo filling its tile, decoded off the main thread. Tile widths vary, so
 * "auto" lets the browser size the lazy image by its layout; the rest is the fallback.
 */
const TILE_SIZES = "auto, (max-width:760px) 100vw, 50vw";
export function TileImage({ src, alt, focus, sizes = TILE_SIZES, lazy = true }) {
  const r = responsive(src);
  return <img className="pimg" src={r.src} srcSet={r.srcSet} sizes={r.srcSet ? sizes : undefined} alt={alt} loading={lazy ? "lazy" : undefined} decoding="async" style={focus ? { objectPosition: focus } : undefined} />;
}

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
      {img ? <TileImage src={img} alt={alt ?? label ?? ""} focus={focus} /> : <Cam />}
      {label ? <span>{label}</span> : null}
      {children}
    </div>
  );
}
