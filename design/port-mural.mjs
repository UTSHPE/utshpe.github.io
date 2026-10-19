// design/port-mural.mjs: copy the hero mural builder out of design/pages/desktop/Home.html, verbatim,
// into utshpe-react/src/components/redesign/home/muralBuilder.js. Run after extract.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(DIR, "pages", "desktop", "Home.html"), "utf8");

const start = src.indexOf("  var NS='http://www.w3.org/2000/svg';");
const end = src.indexOf("  /* ---------- upcoming events ---------- */");
if (start < 0 || end < 0) throw new Error("mural builder not found");
let code = src.slice(start, end);

// the only changes: the svg and cloud layer come in as arguments instead of by id
const edits = [
  ["  function $(i){return document.getElementById(i)}\n", ""],
  ["  var clouds;\n", ""],
  ["  function build(){\n    var svg=$('gs'),defs=mk('defs',{},svg);", "  function build(svg,cl){\n    var defs=mk('defs',{},svg);"],
  ["    var cl=$('cl'),cs=", "    var cs="],
];
for (const [a, b] of edits) {
  if (!code.includes(a)) throw new Error("edit target missing: " + a);
  code = code.replace(a, b);
}

const out = `/*
 * The hero mural ("Greetings from UT SHPE" with a painted scene inside each letter,
 * the UT Tower, the ribbon banner and the drifting clouds), ported verbatim from
 * design/pages/desktop/Home.html by design/port-mural.mjs. Do not edit by hand.
 *
 * buildMural(svg, cloudLayer) fills <svg id="gs"> and <div class="cl">. Call it after
 * the Anton, Chango and Mr Dafoe fonts have loaded (it measures the letters).
 */
${code.replace(/^  /gm, "")}
export function buildMural(svg, cloudLayer) {
  build(svg, cloudLayer);
}
`;
fs.writeFileSync(path.join(DIR, "..", "utshpe-react", "src", "components", "redesign", "home", "muralBuilder.js"), out);
console.log("muralBuilder.js written,", out.length, "bytes");
