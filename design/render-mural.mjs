// design/render-mural.mjs: render the hero mural from the design's reference Home page into images.
//
// The design builds the mural at runtime as a heavy SVG (each letter is 30 extruded copies with
// masks and a turbulence "wobble" filter). Building and rasterizing it on every visit made the hero
// and the intro stutter, so the site ships it prerendered instead, in two transparent layers:
//   letters.webp  the #gs svg (water strip, letters with their scenes, UT Tower, banner, script)
//   clouds.webp   one 1400-unit tile of the drifting cloud layer (the layer repeats it twice)
// The mural's CSS filter (saturate(1.1) contrast(1.12)) is baked into each layer; both are affine
// per-pixel color ops, so filtering the layers equals filtering their composite. The filtered
// background color is written to utshpe-react/src/data/mural.json along with the image sizes.
//
// Run from the repo root after `node design/extract.mjs`:  node design/render-mural.mjs
// Uses the installed Chrome via utshpe-react's playwright-core and pngjs.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const req = createRequire(path.join(DIR, "..", "utshpe-react", "package.json"));
const { chromium } = req("playwright-core");
const { PNG } = req("pngjs");

const OUT = path.join(DIR, "..", "utshpe-react", "public", "assets", "images", "redesign", "mural");
const WIDTHS = [760, 1514, 3028, 4542];
const SCALE = 3, FILTER = "saturate(1.1) contrast(1.12)", MUR_W = 1514;
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: SCALE })).newPage();
await page.addInitScript(() => { try { sessionStorage.setItem("introSeen", "1"); } catch { /* file:// storage */ } });
await page.goto(pathToFileURL(path.join(DIR, "reference", "desktop", "Home.html")).href);
await page.waitForFunction(() => document.querySelectorAll("#gs .lt").length === 6);
await page.evaluate(() => document.fonts.ready);
// no intro on this page (file:// can't remember introSeen)
await page.evaluate(() => document.documentElement.classList.remove("introing", "hideL"));
// lay the mural out flat at the page's top-left corner, nothing else visible
await page.addStyleTag({ content: `
  html,body{background:transparent!important}
  body>*:not(.hero):not(svg):not(#bgprobe){display:none!important}
  *{transition:none!important}
  .hero{height:auto!important;overflow:visible!important;background:transparent!important}
  .hero::before,.wash,.cover,.hc{display:none!important}
  .stage{position:relative!important;transform:none!important;width:auto!important;height:auto!important}
  .hfr{position:relative!important}
  .mur{position:relative!important;left:0!important;top:0!important;filter:none!important;background:transparent!important}
  .cl{animation:none!important;transform:none!important}` });
const H = await page.evaluate(() => document.querySelector(".mur").getBoundingClientRect().height);

async function shot(css) {
  const tag = await page.addStyleTag({ content: css });
  await page.waitForTimeout(300);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: MUR_W, height: H }, omitBackground: true });
  await tag.evaluate((t) => t.remove());
  return buf;
}
const letters = await shot(`.cl{display:none!important} #gs{filter:${FILTER}}`);
const clouds = await shot(`#gs{visibility:hidden!important} .cl{filter:${FILTER}}`);
// the sky in the letters layer must be see-through, or it would veil the clouds and sky color
const corner = PNG.sync.read(letters).data[3];
if (corner !== 0) throw new Error(`letters layer is not transparent at the corner (alpha ${corner})`);

// the filtered sky color behind everything
await page.evaluate((f) => {
  const d = document.createElement("div");
  d.style.cssText = "position:fixed;left:0;top:0;width:4px;height:4px;z-index:9;background:#6DB6D3;filter:" + f;
  d.id = "bgprobe"; document.body.appendChild(d);
}, FILTER);
const px = PNG.sync.read(await page.screenshot({ clip: { x: 1, y: 1, width: 1, height: 1 } }));
const sky = "#" + [0, 1, 2].map((i) => px.data[i].toString(16).padStart(2, "0")).join("").toUpperCase();

// encode each layer as WebP at several widths, in the browser
async function encode(name, png) {
  const out = {};
  for (const w of WIDTHS) {
    const b64 = await page.evaluate(async ({ data, w }) => {
      const img = new Image(); img.src = "data:image/png;base64," + data; await img.decode();
      const h = Math.round(img.naturalHeight * w / img.naturalWidth);
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, 0, 0, w, h);
      return c.toDataURL("image/webp", 0.86).split(",")[1];
    }, { data: png.toString("base64"), w });
    const file = `${name}-${w}.webp`;
    fs.writeFileSync(path.join(OUT, file), Buffer.from(b64, "base64"));
    out[w] = file;
    console.log(file, Math.round(Buffer.from(b64, "base64").length / 1024) + " KB");
  }
  return out;
}
const manifest = { width: MUR_W, height: +H.toFixed(2), sky, letters: await encode("letters", letters), clouds: await encode("clouds", clouds) };
fs.writeFileSync(path.join(DIR, "..", "utshpe-react", "src", "data", "mural.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(manifest);
await browser.close();
