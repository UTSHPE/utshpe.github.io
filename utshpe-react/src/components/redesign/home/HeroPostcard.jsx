import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Cam } from "../PhotoTile";
import { MEMBERSHIP_FORM_URL, photo } from "../../../lib/constants";
import { responsive } from "../../../lib/images";
import mural from "../../../data/mural.json";
import useFlickrPhotos from "../../../hooks/useFlickrPhotos";
import useReducedMotion from "../../../hooks/useReducedMotion";
import usePauseOffscreen from "../../../hooks/usePauseOffscreen";

const T = ["#FBD3C0", "#CFE6EF", "#DCEBF2", "#F4C5BD"];
const SLIDE_MS = 5000;

/*
 * The mural, prerendered from the design by design/render-mural.mjs (building it as live SVG
 * on every visit was the hero's main source of jank). The mural is 1514 CSS px scaled to the
 * page by --k (or --mk on phones), so it always shows at about 105vw.
 */
const MURAL_DIR = "/assets/images/redesign/mural/";
const muralSet = (layer) => Object.entries(mural[layer]).map(([w, f]) => `${MURAL_DIR}${f} ${w}w`).join(", ");
const LETTERS = { src: MURAL_DIR + mural.letters[1514], srcSet: muralSet("letters") };
const CLOUDS = `image-set(url(${MURAL_DIR}${mural.clouds[1514]}) 1x, url(${MURAL_DIR}${mural.clouds[3028]}) 2x, url(${MURAL_DIR}${mural.clouds[4542]}) 3x)`;

/* The photo card: four slides cross-fade every 5s from a random start. */
function PhotoCard() {
  const flickr = useFlickrPhotos();
  const n = T.length;
  const [cur, setCur] = useState(() => Math.floor(Math.random() * n));
  const reduced = useReducedMotion();
  const imgs = useRef([]);

  // advance only once the next photo is decoded, so the fade never waits on it
  useEffect(() => {
    if (reduced) return;
    let live = true;
    const t = setTimeout(() => {
      const next = (cur + 1) % n, el = imgs.current[next];
      (el && el.decode ? el.decode() : Promise.resolve()).catch(() => {}).then(() => { if (live) setCur(next); });
    }, SLIDE_MS);
    return () => { live = false; clearTimeout(t); };
  }, [cur, reduced, n]);

  const photos = T.map((_, i) => photo(flickr[i]?.src) && flickr[i]);
  const real = photos.some(Boolean);
  return (
    <div className="hc pc">
      <div className="in" id="hslides">
        {T.map((c, i) => {
          const r = photos[i] && responsive(photos[i].src);
          return (
            <div key={i} className={"sl" + (i === cur ? " on" : "")} style={{ background: c }}>
              {r ? <img className="pimg" ref={(el) => { imgs.current[i] = el; }} src={r.src} srcSet={r.srcSet} sizes={r.srcSet ? "(max-width:760px) 100vw, 480px" : undefined} alt={photos[i].alt} decoding="async" /> : <Cam />}
            </div>
          );
        })}
        {real ? null : <span className="lab">Photo · rotates on each visit</span>}
        <div className="dots">{T.map((_, i) => <i key={i} className={i === cur ? "on" : undefined}></i>)}</div>
      </div>
    </div>
  );
}

/*
 * The hero: a 1440 x 696 postcard scaled to the page width (--k on <html>, set in
 * index.html). On phones the mural becomes a banner (--mk / --mh on the hero).
 */
export default function HeroPostcard() {
  const heroRef = useRef(null);
  usePauseOffscreen(heroRef);

  // phones: scale the 1440 x 696 frame to the screen width
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const fit = () => { const k = hero.clientWidth / 1440; hero.style.setProperty("--mk", k.toFixed(4)); hero.style.setProperty("--mh", Math.round(696 * k) + "px"); };
    fit(); addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  return (
    <header className="hero" ref={heroRef}>
      <div className="stage">
        <div className="hfr">
          <div className="mur" style={{ background: mural.sky }}>
            <div className="cl" id="cl" aria-hidden="true" style={{ backgroundImage: CLOUDS }}></div>
            <img className="gsi" src={LETTERS.src} srcSet={LETTERS.srcSet} sizes="105vw" width={mural.width} height={Math.round(mural.height)} fetchPriority="high" decoding="async" alt="A painted postcard reading Greetings from UT SHPE, with a scene inside each letter and the UT Tower in the corner" />
          </div>
        </div>
        <div className="wash"></div><div className="cover"></div>
        <div className="hc hl">
          <div className="kick">University of Texas at Austin</div>
          <h1 className="ut" data-t="UT SHPE">UT <span>SHPE</span></h1>
          <div className="rule"></div>
          <div className="tg">Find your<em>familia.</em><br />Build your future.</div>
          <p className="sb">The Society of Hispanic Professional Engineers at UT Austin empowers Hispanic students in STEM through community, mentorship, professional development, and opportunity.</p>
          <div className="bt"><a className="btn" href={MEMBERSHIP_FORM_URL} target="_blank" rel="noopener">Join the Familia</a><Link className="btn soft" to="/about">Explore UT SHPE</Link></div>
        </div>
        <PhotoCard />
      </div>
    </header>
  );
}
