import { useRef, useState } from "react";
import { sponsors } from "../../data/sponsors";
import usePauseOffscreen from "../../hooks/usePauseOffscreen";

/*
 * A logo, or its name as a wordmark if the image fails (the design's .lgi error listener).
 * Not lazy: in the belt most logos sit clipped off to the side, where lazy images never load.
 */
export function SponsorLogo({ sponsor }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="wm">{sponsor.name}</span>;
  return <img className="lgi" src={sponsor.image} alt={sponsor.name} decoding="async" onError={() => setFailed(true)} />;
}

/* the sponsor marquee: every logo twice, so the 46s loop is seamless */
export default function SponsorBelt() {
  const twice = [...sponsors, ...sponsors];
  const ref = useRef(null);
  usePauseOffscreen(ref);
  return (
    <div className="belt" data-r ref={ref}>
      <div className="track">
        {twice.map((s, i) => <div className="lg" key={i}><SponsorLogo sponsor={s} /></div>)}
      </div>
    </div>
  );
}
