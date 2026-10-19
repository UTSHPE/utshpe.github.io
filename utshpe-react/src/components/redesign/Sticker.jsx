import { html, icon } from "../../lib/design";

/* A white round sticker with an Austin line icon in it (S.sticker). */
export default function Sticker({ name, color, rot = 8, size = 30, style }) {
  return <span className="stk" style={{ "--r": rot + "deg", ...style }} dangerouslySetInnerHTML={html(icon(name, color, size))} />;
}

/* A bare Austin line icon. */
export function AustinIcon({ name, color, size = 40, as: Tag = "span", style }) {
  return <Tag style={style} dangerouslySetInnerHTML={html(icon(name, color, size))} />;
}
