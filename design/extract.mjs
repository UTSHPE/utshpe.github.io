// design/extract.mjs: split the two design bundles into per-page files and extract fonts + images.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SOURCES = [
  ["desktop", "UT_SHPE___About.html"],
  ["mobile", "UT_SHPE___Home__mobile_.html"],
];
const OUT = path.join(DIR, "pages");
const REF = path.join(DIR, "reference");
const FONT_OUT = path.join(DIR, "..", "utshpe-react", "src", "assets", "fonts");
const IMG_OUT = path.join(DIR, "..", "utshpe-react", "public", "assets", "images", "redesign");
for (const d of [OUT, REF, FONT_OUT, IMG_OUT]) fs.mkdirSync(d, { recursive: true });

function readPages(file) {
  const s = fs.readFileSync(path.join(DIR, file), "utf8");
  const i = s.indexOf("var P=") + 6;
  let depth = 0, inStr = false, esc = false, j = i;
  for (; j < s.length; j++) {
    const c = s[j];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true; else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { j++; break; } }
  }
  return JSON.parse(s.slice(i, j));
}

const saved = new Map();
function save(b64, dir, name) {
  if (saved.has(b64)) return saved.get(b64);
  fs.writeFileSync(path.join(dir, name), Buffer.from(b64, "base64"));
  const rel = dir === FONT_OUT ? `src/assets/fonts/${name}` : `/assets/images/redesign/${name}`;
  saved.set(b64, rel);
  return rel;
}

for (const [variant, file] of SOURCES) {
  const P = readPages(file);
  fs.mkdirSync(path.join(OUT, variant), { recursive: true });
  fs.mkdirSync(path.join(REF, variant), { recursive: true });
  for (const [page, raw] of Object.entries(P)) {
    fs.writeFileSync(path.join(REF, variant, `${page}.html`), raw);
    let html = raw;
    html = html.replace(/@font-face\{font-family:"([^"]+)";font-weight:(\d+);[^}]*?url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/g,
      (m, fam, w, b64) => m.replace(/data:font\/woff2;base64,[A-Za-z0-9+/=]+/, save(b64, FONT_OUT, `${fam.replace(/\s+/g, "")}-${w}.woff2`)));
    html = html.replace(/"([\w.-]+_logo\.png)":\s*"data:image\/png;base64,([A-Za-z0-9+/=]+)"/g,
      (m, name, b64) => `"${name}": "${save(b64, IMG_OUT, "sponsor-" + name)}"`);
    html = html.replace(/(<img src=")data:image\/png;base64,([A-Za-z0-9+/=]+)(" alt="SHPE, Leading)/g,
      (m, a, b64, c) => a + save(b64, IMG_OUT, "nav-lockup.png") + c);
    html = html.replace(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g, (m, b64) => save(b64, IMG_OUT, "shpe-symbol.png"));
    let k = 0;
    html = html.replace(/data:([a-z0-9/+.-]+);base64,[A-Za-z0-9+/=]+/g, (m, t) => `[UNEXTRACTED-${t}-${k++}]`);
    fs.writeFileSync(path.join(OUT, variant, `${page}.html`), html);
    console.log(variant, page, (html.length / 1024).toFixed(0) + " KB");
  }
}
console.log("assets:", [...new Set(saved.values())]);
