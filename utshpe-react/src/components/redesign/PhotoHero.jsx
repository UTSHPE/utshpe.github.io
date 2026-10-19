import { useCallback, useEffect, useRef, useState } from "react";
import { CAM_THIN, html } from "../../lib/design";
import { photo } from "../../lib/constants";
import useReducedMotion from "../../hooks/useReducedMotion";

const T = ["#CFE6EF", "#FBD3C0", "#DCEBF2", "#F4C5BD"];

/*
 * The inner pages' rotating photo hero: slides cross-fade every 5s from a random
 * start, dots jump to a slide, hovering pauses.
 */
export default function PhotoHero({ className = "ph", photos = [] }) {
  const n = T.length;
  const [cur, setCur] = useState(() => Math.floor(Math.random() * n));
  const reduced = useReducedMotion();
  const timer = useRef(null);

  const stop = useCallback(() => { clearInterval(timer.current); timer.current = null; }, []);
  const play = useCallback(() => {
    if (reduced || timer.current) return;
    timer.current = setInterval(() => setCur((c) => (c + 1) % n), 5000);
  }, [reduced, n]);
  useEffect(() => { play(); return stop; }, [play, stop]);

  return (
    <div className={className} id="ph" onMouseEnter={stop} onMouseLeave={play}>
      <div className="slides" id="slides">
        {T.map((c, i) => {
          const src = photo(photos[i]?.src);
          return src ? (
            <div key={i} className={"sl" + (i === cur ? " on" : "")} style={{ background: c }}>
              <img className="pimg" src={src} alt={photos[i].alt || ""} style={photos[i].focus ? { objectPosition: photos[i].focus } : undefined} />
            </div>
          ) : (
            <div key={i} className={"sl" + (i === cur ? " on" : "")} style={{ background: c }} dangerouslySetInnerHTML={html(CAM_THIN + "<span>Photo " + (i + 1) + " of " + n + " · from our Flickr</span>")} />
          );
        })}
      </div>
      <div className="dots" id="dots">
        {T.map((_, i) => (
          <button key={i} type="button" aria-label={"Show photo " + (i + 1)} className={i === cur ? "on" : undefined} onClick={() => { setCur(i); stop(); play(); }} />
        ))}
      </div>
    </div>
  );
}
