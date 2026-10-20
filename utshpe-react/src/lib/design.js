/*
 * The design's shared SVG/markup builders (window.SHPE in design/pages/*), ported verbatim.
 * They return HTML strings; components drop them into the same element the design did,
 * via dangerouslySetInnerHTML, so the DOM matches the design exactly.
 * All inputs are our own constants, never user content.
 */

export const SYMBOL = "/assets/images/redesign/shpe-symbol.png";

export const TONES = ["#CFE6EF", "#FBD3C0", "#DCEBF2", "#F4C5BD", "#CFE6EF", "#FDE3D6", "#DCEBF2"];
export const PINK_TONES = ["#F8CFE0", "#FBD3C0", "#FDE3D6", "#F4C5BD", "#F9D9E6", "#FCE0D0", "#F6C4D6"];

export const NV = "#16316B", OR = "#F26838", RD = "#D33E26", BL = "#1272B8", LB = "#74ABC2";

export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}

/* a perforated postage stamp with the SHPE symbol */
export function stamp(main, sub, fill, w) {
  w = w || 130; const h = Math.round(w * 1.25);
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 120 150" aria-hidden="true"><rect width="120" height="150" fill="' + (fill || "#EAF3F8") + '"/><rect x="13" y="13" width="94" height="124" fill="none" stroke="#16316B" stroke-width="2.5"/><image href="' + SYMBOL + '" x="26" y="24" width="68" height="66"/><text x="60" y="112" text-anchor="middle" font-family="Archivo Black,sans-serif" font-size="' + (main.length > 8 ? 9.5 : 12) + '" fill="#16316B">' + main + '</text><text x="60" y="127" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700" font-size="7" letter-spacing="1.5" fill="#F26838">' + sub + '</text><rect x="4" y="4" width="112" height="142" fill="none" stroke="#fff" stroke-width="9" stroke-dasharray="0 11" stroke-linecap="round"/></svg>';
}

/* a stamp-shaped tile that carries a name (sponsors); unused by the current pages, kept from the design */
export function nameStamp(name, fill) {
  const words = name.split(" "); let l1 = name, l2 = "";
  if (name.length > 11 && words.length > 1) {
    let best = 0, bd = 99;
    for (let i = 1; i < words.length; i++) { const a = words.slice(0, i).join(" ").length, b = words.slice(i).join(" ").length, d = Math.abs(a - b); if (d < bd) { bd = d; best = i; } }
    l1 = words.slice(0, best).join(" "); l2 = words.slice(best).join(" ");
  }
  const fs = Math.min(20, Math.floor(120 / Math.max(l1.length, l2.length) * 1.55));
  return '<svg viewBox="0 0 190 130" aria-hidden="true"><rect width="190" height="130" fill="' + fill + '"/><rect x="12" y="12" width="166" height="106" fill="none" stroke="#16316B" stroke-width="2"/><text x="95" y="' + (l2 ? 60 : 72) + '" text-anchor="middle" font-family="Archivo Black,sans-serif" font-size="' + fs + '" fill="#16316B">' + l1 + '</text>' + (l2 ? '<text x="95" y="' + (60 + fs + 4) + '" text-anchor="middle" font-family="Archivo Black,sans-serif" font-size="' + fs + '" fill="#16316B">' + l2 + '</text>' : "") + '<text x="95" y="108" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700" font-size="8" letter-spacing="2" fill="#F26838">SPONSOR</text><rect x="4" y="4" width="182" height="122" fill="none" stroke="#fff" stroke-width="9" stroke-dasharray="0 11" stroke-linecap="round"/></svg>';
}

/* small line icons and brand marks for the footer */
const IC = (p) => '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>";
export const ico = {
  mail: IC('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 8l8 6 8-6"/>'),
  cal: IC('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  trophy: IC('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/>'),
  cam: IC('<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 7l1-3h4l1 3"/>'),
  card: IC('<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-2 5.5-2 6 0M14 10h4M14 14h4"/>'),
};
export const brand = {
  instagram: IC('<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2"/>'),
  linkedin: IC('<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.84-2.06 3.8-2.06 4.06 0 4.8 2.67 4.8 6.14v5.32h-4v-4.72c0-1.13-.02-2.58-1.57-2.58-1.57 0-1.81 1.23-1.81 2.5v4.8h-4z"/>'),
  tiktok: IC('<path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/>'),
  facebook: IC('<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.3 4.34c-2.3 0-3.8 1.4-3.8 3.9v2.26H8v3h2.5V21z"/>'),
  x: IC('<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'),
  github: IC('<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>'),
  linktree: IC('<path d="M12 3l3.2 3.5-1.7.2 3.7 3.8-2.4.2 3.7 4h-5.1V21h-2.8v-6.3H5.5l3.7-4-2.4-.2 3.7-3.8-1.7-.2z"/>'),
};

/* a bat whose wings really flap: each wing swings from the shoulder, the body bobs */
export function flapBat(w, color, dur, style, reduced) {
  dur = dur || 0.32;
  const lw = "M0 0C-6-8-16-11-27-6C-22-4-21 0-19 5C-15 1-11 2-8 7C-6 4-3 3 0 4Z", rw = "M0 0C6-8 16-11 27-6C22-4 21 0 19 5C15 1 11 2 8 7C6 4 3 3 0 4Z";
  const an = (v) => (reduced ? "" : '<animateTransform attributeName="transform" type="rotate" values="' + v + '" dur="' + dur + 's" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1"/>');
  const bob = reduced ? "" : '<animateTransform attributeName="transform" type="translate" values="0 1.5;0 -2;0 1.5" dur="' + dur + 's" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1"/>';
  return '<svg width="' + w + '" height="' + Math.round(w * 0.5) + '" viewBox="-30 -14 60 28" style="' + (style || "") + '" aria-hidden="true"><g fill="' + color + '"><g>' + bob +
    '<g transform="translate(-1.8 1)"><path d="' + lw + '">' + an("28;-34;28") + '</path></g><g transform="translate(1.8 1)"><path d="' + rw + '">' + an("-28;34;-28") + "</path></g>" +
    '<ellipse cx="0" cy="3.4" rx="3.4" ry="5.2"/><path d="M-2.8 -.6L-2.2 -5L-.6 -1ZM2.8 -.6L2.2 -5L.6 -1Z"/></g></g></svg>';
}

export const CAM = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="10" width="40" height="30" rx="6" fill="none" stroke="#16316B" stroke-width="3"/><circle cx="24" cy="25" r="7" fill="none" stroke="#16316B" stroke-width="3"/><rect x="16" y="5" width="16" height="6" rx="2" fill="#16316B"/></svg>';
/* the inner-pages photo hero uses a thinner camera stroke */
export const CAM_THIN = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="10" width="40" height="30" rx="6" fill="none" stroke="#16316B" stroke-width="2.5"/><circle cx="24" cy="25" r="7" fill="none" stroke="#16316B" stroke-width="2.5"/><rect x="16" y="5" width="16" height="6" rx="2" fill="#16316B"/></svg>';
/* the Instagram tiles' camera has no aria-hidden in the design */
export const CAM_IG = '<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="30" rx="6" fill="none" stroke="#16316B" stroke-width="3"/><circle cx="24" cy="25" r="7" fill="none" stroke="#16316B" stroke-width="3"/><rect x="16" y="5" width="16" height="6" rx="2" fill="#16316B"/></svg>';

export const SIL = '<svg viewBox="0 0 300 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="150" cy="124" r="52" fill="#16316B" opacity=".9"/><path d="M42 330C48 240 96 204 150 204s102 36 108 126Z" fill="#16316B" opacity=".9"/></svg>';

export const LINKEDIN_TILE = '<svg viewBox="0 0 24 24" width="34" height="34"><rect width="24" height="24" rx="4" fill="#fff"/><circle cx="6.6" cy="6.6" r="1.7" fill="#16316B"/><rect x="5.1" y="9.6" width="3" height="9" fill="#16316B"/><path d="M10.4 9.6h2.8v1.3c.5-.9 1.6-1.5 3-1.5 2.6 0 3.2 1.7 3.2 4v5.2h-3v-4.5c0-1-.1-2-1.4-2s-1.6.9-1.6 1.9v4.6h-3z" fill="#16316B"/></svg>';
export const MAIL_TILE = '<svg viewBox="0 0 28 24" width="40" height="34"><rect x="1" y="3" width="26" height="18" rx="4" fill="#fff"/><path d="M3.5 7l10.5 7.5L24.5 7" fill="none" stroke="#16316B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* Austin line icons */
export const PATHS = {
  flame: '<path d="M32 5c2 9 15 15 15 30a15 15 0 0 1-30 0c0-7 3-11 7-14 0 6 3 9 6 9 3-6 0-14 2-25z"/><path d="M32 56c-5 0-8-3-8-8 0-5 5-7 8-13 3 5 8 8 8 13 0 5-3 8-8 8z"/>',
  guitar: '<rect x="29.5" y="3" width="5" height="26" rx="1.5"/><rect x="27" y="1" width="10" height="7" rx="2"/><path d="M32 27c-6 0-10 4-10 9 0 3 2 4 2 6-4 2-6 5-6 9 0 6 6 10 14 10s14-4 14-10c0-4-2-7-6-9 0-2 2-3 2-6 0-5-4-9-10-9z"/><circle cx="32" cy="44" r="4.5"/><path d="M28 55h8"/>',
  bat: '<path d="M32 30C27 22 18 18 6 22c7 3 9 8 10 13 4-4 9-3 12 2l4-5 4 5c3-5 8-6 12-2 1-5 3-10 10-13-12-4-21 0-26 8z" fill="currentColor"/>',
  boot: '<path d="M17 5h17v23c0 2 1 3 3 4l13 6c3 1 4 3 4 6v8H17z"/><path d="M17 51v7h11v-7M24 12v14M17 36h10"/><path d="M29 5v6"/>',
  capitol: '<path d="M8 56h48M12 56V42h40v14M18 42V32h28v10M21 32c0-10 5-16 11-16s11 6 11 16"/><path d="M32 16V8M28 8h8M23 42v14M32 42v14M41 42v14"/>',
  tower: '<path d="M10 58h44M14 58V47h36v11M18 47v-5h28v5"/><path d="M26 42V24h12v18"/><path d="M30 28v10M34 28v10"/><path d="M24 24v-8h16v8M24 20h16"/><circle cx="32" cy="20" r="2"/><path d="M28 16v-7h8v7M31 9v7M33 9v7"/><path d="M29 9l3-5 3 5M32 4V1"/>',
  star: '<polygon points="32,6 39,24 58,25 43,37 48,56 32,45 16,56 21,37 6,25 25,24"/>',
  horseshoe: '<g transform="rotate(180 32 32)"><path d="M15 54V30a17 17 0 0 1 34 0v24h-9V30a8 8 0 0 0-16 0v24z"/><circle cx="19.5" cy="46" r="1.2"/><circle cx="19.5" cy="38" r="1.2"/><circle cx="44.5" cy="46" r="1.2"/><circle cx="44.5" cy="38" r="1.2"/></g>',
  cactus: '<path d="M27 58V20a5 5 0 0 1 10 0v38M27 42h-8a4 4 0 0 1-4-4V28M37 36h8a4 4 0 0 0 4-4V22M21 58h22"/><path d="M32 14v36" opacity=".0"/>',
  armadillo: '<path d="M11 41C11 26 20 17 32 17C41 17 47 22 49 30"/><path d="M12 41C20 43 34 42 44 38"/><path d="M22 20C19 26 19 34 21 42M30 17C28 25 28 34 29 42M38 18C37 26 37 34 38 40"/><path d="M48 26C52 25 56 27 58 31L63 40C63 42 61 43 59 42L47 38"/><path d="M49 27Q48 20 52 14Q56 20 55 28"/><circle cx="55" cy="33" r="1.3" fill="currentColor"/><path d="M11 38C7 40 4 44 2 50C5 49 9 47 12 44"/><path d="M18 41v10h7M26 41v9h7M36 41v10h7M44 41v9h7"/>',
  heartenv: '<rect x="7" y="14" width="50" height="36" rx="4"/><path d="M8 16l24 18 24-18"/><path d="M32 46c-3-3-8-5-8-9 0-3 4-4 8-1 4-3 8-2 8 1 0 4-5 6-8 9z" transform="translate(0 -1)" />',
  flag: '<path d="M8 14h48v36H8zM24 14v36M24 32h32"/><polygon points="16,26 17.8,30 22,30.4 18.8,33 19.8,37.2 16,35 12.2,37.2 13.2,33 10,30.4 14.2,30"/>',
  longhorn: '<path d="M8 20c-4 0-5 5-2 8s8 3 12 2M56 20c4 0 5 5 2 8s-8 3-12 2"/><path d="M18 30c0 12 5 24 14 24s14-12 14-24c-3-3-8-5-14-5s-11 2-14 5z"/><circle cx="26" cy="37" r="1.4" fill="currentColor"/><circle cx="38" cy="37" r="1.4" fill="currentColor"/><path d="M27 48h10"/>',
};

export function icon(n, c, s) {
  c = c || NV; s = s || 40;
  return '<svg viewBox="0 0 64 64" width="' + s + '" height="' + s + '" fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:' + c + '" aria-hidden="true">' + PATHS[n] + "</svg>";
}

/* the home event card's date stamp */
export function dateStamp(c, wd, dd) {
  return '<svg width="76" height="92" viewBox="0 0 76 92" aria-hidden="true"><rect width="76" height="92" fill="' + c + '"/><rect x="9" y="9" width="58" height="74" fill="none" stroke="#16316B" stroke-width="2"/><text x="38" y="30" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700" font-size="9" letter-spacing="1.6" fill="#16316B">' + wd + '</text><text x="38" y="63" text-anchor="middle" font-family="Chango,serif" font-size="27" fill="#16316B">' + dd + '</text><rect x="2.5" y="2.5" width="71" height="87" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="0 9" stroke-linecap="round"/></svg>';
}

/* bluebonnet decorations (the inner-pages helper; Home draws a two-flower version) */
export function bluebonnets(spots) {
  let f = "";
  spots.forEach((p, i) => { f += '<path d="M' + p[0] + " 76V" + (p[1] + 8) + '" stroke="#74ABC2" stroke-width="4" stroke-linecap="round"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] + 4) + '" fill="' + (i % 2 ? "#1272B8" : "#CFE6EF") + '"/><circle cx="' + p[0] + '" cy="' + (p[1] - 4) + '" r="' + (p[2] - 2) + '" fill="#fff"/>'; });
  return f;
}

export const html = (s) => ({ __html: s });
