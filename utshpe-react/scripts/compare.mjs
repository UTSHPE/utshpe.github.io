// scripts/compare.mjs: screenshot the design reference pages and the React routes, side by side, with a pixel diff.
//
// Usage (from utshpe-react/, with the dev server running):
//   node scripts/compare.mjs [--base http://localhost:5173] [--pages Home,About] [--variants desktop,mobile]
//                            [--widths 1440] [--out compare-out]
// For a like-for-like diff, run the dev server with VITE_PLACEHOLDER_PHOTOS=1 so the React site
// shows the design's colored placeholder tiles instead of photos.
// Needs `node design/extract.mjs` first (design/reference/). Drives the installed Chrome via
// playwright-core (no browser download).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REF = path.resolve(ROOT, "..", "design", "reference");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:5173");
const PAGES = arg("pages", "Home,About,Leadership,Sponsorship,SHPEtinas,Membership").split(",");
const VARIANTS = arg("variants", "desktop,mobile").split(",");
const OUT = path.resolve(ROOT, arg("out", "compare-out"));
const ROUTES = { Home: "/", About: "/about", Leadership: "/leadership", Sponsorship: "/sponsorship", SHPEtinas: "/shpetinas", Membership: "/membership" };
const VIEW = {
  desktop: (w) => ({ viewport: { width: w || 1440, height: 900 } }),
  mobile: (w) => ({ viewport: { width: w || 390, height: 844 }, isMobile: true, hasTouch: true }),
};
fs.mkdirSync(OUT, { recursive: true });

// deterministic runs: seeded Math.random, a frozen clock, intro already seen
const INIT = `(() => {
  try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
  let a = 20261019; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const T = new Date('2026-10-19T12:00:00-05:00').getTime(), D = Date;
  class F extends D { constructor(...x) { super(...(x.length ? x : [T])); } static now() { return T; } }
  globalThis.Date = F;
})();`;

// reveal everything, settle animations: finite ones to their end, infinite ones (belt, clouds, bats) to t=0
async function settle(page) {
  await page.evaluate(async () => {
    // scroll through once so lazy images load, then back to the top
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    scrollTo(0, 0);
    document.querySelectorAll("[data-r]").forEach((el) => el.classList.add("in"));
    document.querySelectorAll(".tl").forEach((el) => el.classList.add("in"));
    await document.fonts.ready;
  });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      const t = a.effect?.getComputedTiming?.();
      if (t && t.iterations !== Infinity) a.finish(); else { a.pause(); a.currentTime = 0; }
    }
    document.querySelectorAll("svg").forEach((s) => { if (s.pauseAnimations) { s.pauseAnimations(); s.setCurrentTime(0); } });
  });
  await page.waitForTimeout(900); // transitions (.8s reveals) finish
}

function pad(png, w, h) {
  const out = new PNG({ width: w, height: h });
  out.data.fill(255);
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0);
  return out;
}

const browser = await chromium.launch({ channel: "chrome" });
const report = [];
for (const variant of VARIANTS) {
  const width = +arg("widths", 0) || undefined;
  for (const name of PAGES) {
    const shots = [];
    for (const [label, url] of [["design", pathToFileURL(path.join(REF, variant, name + ".html")).href], ["react", BASE + ROUTES[name]]]) {
      const ctx = await browser.newContext(VIEW[variant](width));
      await ctx.addInitScript(INIT);
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
      await page.goto(url, { waitUntil: "networkidle" });
      await settle(page);
      const file = path.join(OUT, `${variant}-${name}-${label}.png`);
      await page.screenshot({ path: file, fullPage: true });
      if (errors.length) report.push(`${variant} ${name} ${label}: ${errors.length} console errors: ${errors.slice(0, 3).join(" | ")}`);
      shots.push(PNG.sync.read(fs.readFileSync(file)));
      await ctx.close();
    }
    const [a, b] = shots, w = Math.max(a.width, b.width), h = Math.max(a.height, b.height);
    const A = pad(a, w, h), B = pad(b, w, h), diff = new PNG({ width: w, height: h });
    const bad = pixelmatch(A.data, B.data, diff.data, w, h, { threshold: 0.1 });
    const side = new PNG({ width: w * 3, height: h });
    side.data.fill(255);
    PNG.bitblt(A, side, 0, 0, w, h, 0, 0); PNG.bitblt(B, side, 0, 0, w, h, w, 0); PNG.bitblt(diff, side, 0, 0, w, h, w * 2, 0);
    fs.writeFileSync(path.join(OUT, `${variant}-${name}-side.png`), PNG.sync.write(side));
    report.push(`${variant} ${name}: design ${a.width}x${a.height}, react ${b.width}x${b.height}, ${(bad / (w * h) * 100).toFixed(2)}% pixels differ`);
    console.log(report[report.length - 1]);
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, "report.txt"), report.join("\n") + "\n");
console.log("\n" + report.filter((l) => l.includes("console errors")).join("\n"));
