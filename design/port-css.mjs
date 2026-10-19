// design/port-css.mjs: copy the design's CSS into utshpe-react/src/styles/redesign/ verbatim.
//
// Run `node design/extract.mjs` first, then `node design/port-css.mjs`.
//
// Each design page is its own document; the SPA loads every page's CSS at once.
// Page-only rules are scoped with `:where(body[data-page="<page>"])`, which adds
// no specificity, so the design's cascade (equal specificity + source order,
// e.g. the mobile "round 2" rules overriding earlier page rules) is unchanged.
//
// Output (imported in this order by styles/redesign/index.css):
//   fonts.css            @font-face rules
//   base.css             shared style block (identical on all six pages)
//   pages/<page>.css     page style block, scoped
//   mobile.css           shared mobile rules that come before the page blocks
//   pages/<page>.mobile.css  page-only mobile rules, scoped
//   mobile-late.css      shared mobile rules that come after the page blocks
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, "..", "utshpe-react", "src", "styles", "redesign");
fs.mkdirSync(path.join(OUT, "pages"), { recursive: true });

const PAGES = { Home: "home", About: "about", Leadership: "leadership", Sponsorship: "sponsorship", SHPEtinas: "shpetinas", Membership: "membership" };
const HEADER = (src) => `/* Ported verbatim from design/pages/${src} by design/port-css.mjs. Do not edit by hand. */\n`;

const read = (variant, page) => fs.readFileSync(path.join(DIR, "pages", variant, `${page}.html`), "utf8");
const styles = (html) => [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);

/* ---------- a tiny CSS walker: enough for the design's hand-written CSS ---------- */
function splitRules(css) {
  // returns [{pre, sel, body}] where pre is whitespace/comments before the rule
  const out = [];
  let i = 0, start = 0;
  while (i < css.length) {
    if (css.startsWith("/*", i)) { i = css.indexOf("*/", i + 2) + 2; continue; }
    if (css[i] === "{") {
      // find the selector start: after the last comment/whitespace run since `start`
      const head = css.slice(start, i);
      const m = head.match(/^((?:\s|\/\*[\s\S]*?\*\/)*)([\s\S]*)$/);
      let depth = 1, j = i + 1;
      while (j < css.length && depth) {
        if (css.startsWith("/*", j)) { j = css.indexOf("*/", j + 2) + 2; continue; }
        if (css[j] === '"' || css[j] === "'") { const q = css[j]; j++; while (css[j] !== q) j++; j++; continue; }
        if (css[j] === "{") depth++; else if (css[j] === "}") depth--;
        j++;
      }
      out.push({ pre: m[1], sel: m[2], body: css.slice(i + 1, j - 1) });
      i = start = j;
      continue;
    }
    i++;
  }
  out.push({ pre: css.slice(start), sel: null, body: null });
  return out;
}

function splitSelectors(sel) {
  const parts = []; let depth = 0, cur = "";
  for (const c of sel) {
    if (c === "(" || c === "[") depth++; else if (c === ")" || c === "]") depth--;
    if (c === "," && !depth) { parts.push(cur); cur = ""; } else cur += c;
  }
  parts.push(cur);
  return parts;
}

// html-level hooks that live on <html>, not under <body>
const HTML_HOOK = /^(html|:root|\.introing|\.hideL)(?=$|[\s.:#[>])/;

function scopeSelector(s, page) {
  const lead = s.match(/^\s*/)[0], body = s.trim();
  const where = `:where(body[data-page="${page}"])`;
  if (/^:root$/.test(body)) return lead + where;
  if (/^body(?=$|[.:#[\s>])/.test(body)) return lead + "body" + `:where([data-page="${page}"])` + body.slice(4);
  const hook = body.match(HTML_HOOK);
  if (hook) {
    // keep the html-level compound first: `.hideL .hero` -> `.hideL :where(body[...]) .hero`
    const m = body.match(/^(\S+)(\s+)([\s\S]*)$/);
    if (!m) return lead + body; // a bare html-level selector: nothing to scope
    return lead + m[1] + " " + where + " " + m[3];
  }
  return lead + where + " " + body;
}

function scopeCss(css, page) {
  return splitRules(css).map(({ pre, sel, body }) => {
    if (sel === null) return pre;
    const s = sel.trim();
    if (/^@(media|supports)/.test(s)) return `${pre}${sel}{${scopeCss(body, page)}}`;
    if (s.startsWith("@")) return `${pre}${sel}{${body}}`;
    return `${pre}${splitSelectors(sel).map((x) => scopeSelector(x, page)).join(",")}{${body}}`;
  }).join("");
}

/* ---------- desktop ---------- */
const homeStyles = styles(read("desktop", "Home"));
const fonts = homeStyles[0].replace(/url\(src\/assets\/fonts\//g, "url(../../assets/fonts/").replace(/\}@font-face/g, "}\n@font-face");
fs.writeFileSync(path.join(OUT, "fonts.css"), HEADER("desktop/*.html (style 1)") + fonts + "\n");
fs.writeFileSync(path.join(OUT, "base.css"), HEADER("desktop/*.html (style 2, shared)") + homeStyles[1].replace(/^\n/, ""));

for (const [Page, page] of Object.entries(PAGES)) {
  const st = styles(read("desktop", Page));
  if (st[1] !== homeStyles[1]) throw new Error(`${Page}: shared style block differs from Home`);
  fs.writeFileSync(path.join(OUT, "pages", `${page}.css`), HEADER(`desktop/${Page}.html (style 3)`) + scopeCss(st[2], page).replace(/^\n/, ""));
}

/* ---------- mobile: the appendix is shared except for a page block in the middle ---------- */
function appendix(Page) {
  const html = read("mobile", Page);
  const css = html.match(/<style id="mobile">([\s\S]*?)<\/style>/)[1];
  return css.split("\n");
}
const home = appendix("Home");
const idx = (re, from = 0) => { const i = home.findIndex((l, k) => k >= from && re.test(l)); if (i < 0) throw new Error("marker " + re); return i; };
// Home appendix landmarks (0-based line indexes)
const pageOpen = idx(/^@media \(max-width:760px\)\{$/, 3);           // second @media: page block
const pageClose = idx(/^\}$/, pageOpen);
const homeExtra = idx(/^\.ohh\.mob\{display:none\}$/);                 // two home-only rules after the block
const fixes = idx(/mobile fixes/);
const homeTail = idx(/Home header on phones/);

const early = home.slice(0, pageOpen).join("\n");
const late = home.slice(fixes, homeTail).join("\n");
fs.writeFileSync(path.join(OUT, "mobile.css"), HEADER("mobile/*.html (<style id=\"mobile\">, shared part 1)") + early.replace(/^\/\*[^\n]*\*\/\n/, "") + "\n");
fs.writeFileSync(path.join(OUT, "mobile-late.css"), HEADER("mobile/*.html (<style id=\"mobile\">, shared part 2)") + late + "\n");

const sharedEarly = home.slice(0, pageOpen), sharedLate = home.slice(fixes, homeTail);
for (const [Page, page] of Object.entries(PAGES)) {
  const a = appendix(Page);
  // sanity: the shared parts are identical on every page
  if (a.slice(0, pageOpen).join("\n") !== sharedEarly.join("\n")) throw new Error(`${Page}: mobile part 1 differs`);
  const open = pageOpen, close = a.findIndex((l, k) => k > open && l === "}");
  const f = a.findIndex((l) => /mobile fixes/.test(l));
  const lateEnd = page === "home" ? homeTail : a.length;
  if (a.slice(f, f + sharedLate.length).join("\n") !== sharedLate.join("\n")) throw new Error(`${Page}: mobile part 2 differs`);
  let block = a.slice(open, close + 1).join("\n");
  if (page === "home") {
    block += "\n" + home.slice(homeExtra, homeExtra + 2).join("\n");
    // the home-only header rules come last in the design; nothing in mobile-late.css touches them
    block += "\n\n" + home.slice(homeTail).join("\n");
  }
  void lateEnd;
  fs.writeFileSync(path.join(OUT, "pages", `${page}.mobile.css`), HEADER(`mobile/${Page}.html (<style id="mobile">, page block)`) + scopeCss(block, page) + "\n");
}
console.log("wrote", fs.readdirSync(OUT), fs.readdirSync(path.join(OUT, "pages")));
