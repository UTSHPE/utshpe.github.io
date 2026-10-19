import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { buildMural } from "./muralBuilder";
import { Cam } from "../PhotoTile";
import { MEMBERSHIP_FORM_URL, photo } from "../../../lib/constants";
import useFlickrPhotos from "../../../hooks/useFlickrPhotos";
import useReducedMotion from "../../../hooks/useReducedMotion";

const T = ["#FBD3C0", "#CFE6EF", "#DCEBF2", "#F4C5BD"];

/* The photo card: four slides cross-fade every 5s from a random start. */
function PhotoCard() {
  const flickr = useFlickrPhotos();
  const n = T.length;
  const [cur, setCur] = useState(() => Math.floor(Math.random() * n));
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setCur((c) => (c + 1) % n), 5000);
    return () => clearInterval(id);
  }, [reduced, n]);

  const photos = T.map((_, i) => photo(flickr[i]?.src) && flickr[i]);
  const real = photos.some(Boolean);
  return (
    <div className="hc pc">
      <div className="in" id="hslides">
        {T.map((c, i) => (
          <div key={i} className={"sl" + (i === cur ? " on" : "")} style={{ background: c }}>
            {photos[i] ? <img className="pimg" src={photos[i].src} alt={photos[i].alt} /> : <Cam />}
          </div>
        ))}
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
  const heroRef = useRef(null), svgRef = useRef(null), clRef = useRef(null);

  // the mural measures its letters, so build it once the fonts are in
  useEffect(() => {
    const svg = svgRef.current, cl = clRef.current;
    let live = true;
    const build = () => { if (live && !svg.childNodes.length) buildMural(svg, cl); };
    (document.fonts && document.fonts.load
      ? Promise.all([document.fonts.load("430px Anton"), document.fonts.load("38px Chango"), document.fonts.load('58px "Mr Dafoe"')])
      : Promise.resolve()).then(build, build);
    return () => { live = false; };
  }, []);

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
        <div className="hfr"><div className="mur"><div className="cl" id="cl" aria-hidden="true" ref={clRef}></div><svg id="gs" ref={svgRef} viewBox="0 0 1400 740" role="img" aria-label="A painted postcard reading Greetings from UT SHPE, with a scene inside each letter and the UT Tower in the corner"></svg></div></div>
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
