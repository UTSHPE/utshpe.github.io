import { useEffect, useRef, useState } from "react";
import { CAM_THIN, html } from "../../lib/design";
import { photo } from "../../lib/constants";
import { responsive } from "../../lib/images";
import useReducedMotion from "../../hooks/useReducedMotion";

const T = ["#CFE6EF", "#FBD3C0", "#DCEBF2", "#F4C5BD"];
const SLIDE_MS = 5000;

/*
 * The inner pages' rotating photo hero: slides cross-fade every 5s from a random
 * start, dots jump to a slide (and restart the timer), hovering pauses.
 */
export default function PhotoHero({ className = "ph", photos = [] }) {
  const n = T.length;
  const [cur, setCur] = useState(() => Math.floor(Math.random() * n));
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();
  const imgs = useRef([]);

  // advance only once the next photo is decoded, so the fade never waits on it
  useEffect(() => {
    if (reduced || hover) return;
    let live = true;
    const t = setTimeout(() => {
      const next = (cur + 1) % n, el = imgs.current[next];
      (el && el.decode ? el.decode() : Promise.resolve()).catch(() => {}).then(() => { if (live) setCur(next); });
    }, SLIDE_MS);
    return () => { live = false; clearTimeout(t); };
  }, [cur, hover, reduced, n]);

  return (
    <div className={className} id="ph" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="slides" id="slides">
        {T.map((c, i) => {
          const src = photo(photos[i]?.src);
          if (!src) return <div key={i} className={"sl" + (i === cur ? " on" : "")} style={{ background: c }} dangerouslySetInnerHTML={html(CAM_THIN + "<span>Photo " + (i + 1) + " of " + n + " · from our Flickr</span>")} />;
          const r = responsive(src);
          return (
            <div key={i} className={"sl" + (i === cur ? " on" : "")} style={{ background: c }}>
              <img className="pimg" ref={(el) => { imgs.current[i] = el; }} src={r.src} srcSet={r.srcSet} sizes={r.srcSet ? "(max-width:760px) 100vw, 50vw" : undefined} alt={photos[i].alt || ""} decoding="async" style={photos[i].focus ? { objectPosition: photos[i].focus } : undefined} />
            </div>
          );
        })}
      </div>
      <div className="dots" id="dots">
        {T.map((_, i) => (
          <button key={i} type="button" aria-label={"Show photo " + (i + 1)} className={i === cur ? "on" : undefined} onClick={() => setCur(i)} />
        ))}
      </div>
    </div>
  );
}
