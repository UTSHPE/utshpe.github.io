// scripts/optimize-images.mjs: make right-sized WebP copies of the site's photos.
//
// Many source photos are far larger than the tiles that show them (up to 3625 px and 2 MB for a
// 655 x 170 tile), and decoding them made scrolling stutter. This writes WebP versions at a few
// widths to public/assets/images/opt/ and lists them in src/data/imageManifest.json; src/lib/images.js
// turns a photo path into a srcset from it. Photos missing from the manifest still work (the
// original is used), so re-run this after adding photos:  node scripts/optimize-images.mjs
// Uses the installed Chrome via playwright-core (no image library needed).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");
const DIRS = ["this-week", "spotlight", "aboutus", "membership", "Leadership", "shpetinas", "sponsors", "Home_Page", "instagram"];
const WIDTHS = [480, 960, 1280]; // the widest photo tile is ~660 CSS px, so 1280 covers 2x screens
const SKIP = /icon|logo/i; // small graphics stay as they are

// only photos the site uses: paths that appear in src/ (data files and pages)
const used = new Set();
(function scan(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) scan(p);
    else if (/\.(jsx?)$/.test(f.name)) for (const m of fs.readFileSync(p, "utf8").matchAll(/\/assets\/images\/[\w./-]+/g)) used.add(m[0]);
  }
})(path.join(ROOT, "src"));
// two data files build paths from a folder constant, e.g. `${PHOTOS}/natalia.jpg`
for (const p of fs.readFileSync(path.join(ROOT, "src/data/leadership.js"), "utf8").matchAll(/\$\{PHOTOS\}\/([\w.-]+)/g)) used.add(`/assets/images/Leadership/${p[1]}`);
for (const p of fs.readFileSync(path.join(ROOT, "src/data/shpetinasCommittee.js"), "utf8").matchAll(/\$\{PHOTOS\}\/([\w.-]+)/g)) used.add(`/assets/images/shpetinas/${p[1]}`);

const files = DIRS.flatMap((d) => fs.readdirSync(path.join(PUB, "assets/images", d))
  .filter((f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.test(f))
  .map((f) => `/assets/images/${d}/${f}`))
  .filter((f) => used.has(f));

// a file:// page may read file:// images back from a canvas only with this flag
const browser = await chromium.launch({ channel: "chrome", args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(PUB, "office-hours.html")).href);

const manifest = {};
for (const src of files) {
  const url = pathToFileURL(path.join(PUB, src)).href;
  // decode once, then encode each width that is smaller than the original
  const out = await page.evaluate(async ({ url, widths }) => {
    const img = new Image(); img.src = url; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight, res = { w: W, h: H, files: {} };
    for (const w of widths.filter((x) => x < W).concat(W <= widths[widths.length - 1] ? [W] : [])) {
      const h = Math.round(H * w / W), c = document.createElement("canvas"); c.width = w; c.height = h;
      const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, 0, 0, w, h);
      res.files[w] = c.toDataURL("image/webp", 0.82).split(",")[1];
    }
    return res;
  }, { url, widths: WIDTHS });
  const base = src.replace(/^\/assets\/images\//, "").replace(/\.[^.]+$/, "");
  const entry = [];
  for (const [w, b64] of Object.entries(out.files)) {
    const rel = `/assets/images/opt/${base}-${w}.webp`;
    fs.mkdirSync(path.dirname(path.join(PUB, rel)), { recursive: true });
    fs.writeFileSync(path.join(PUB, rel), Buffer.from(b64, "base64"));
    entry.push(+w);
  }
  manifest[src] = { w: out.w, h: out.h, widths: entry.sort((a, b) => a - b) };
  const kb = Math.round(fs.statSync(path.join(PUB, src)).size / 1024);
  console.log(`${src} ${out.w}x${out.h} ${kb} KB -> ${entry.join(", ")}`);
}
await browser.close();
fs.writeFileSync(path.join(ROOT, "src", "data", "imageManifest.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(Object.keys(manifest).length, "photos");
