import { useState } from "react";
import { sponsors } from "../../data/sponsors";

/* a logo, or its name as a wordmark if the image fails (the design's .lgi error listener) */
export function SponsorLogo({ sponsor }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="wm">{sponsor.name}</span>;
  return <img className="lgi" src={sponsor.image} alt={sponsor.name} loading="lazy" onError={() => setFailed(true)} />;
}

/* the sponsor marquee: every logo twice, so the 46s loop is seamless */
export default function SponsorBelt() {
  const twice = [...sponsors, ...sponsors];
  return (
    <div className="belt" data-r>
      <div className="track">
        {twice.map((s, i) => <div className="lg" key={i}><SponsorLogo sponsor={s} /></div>)}
      </div>
    </div>
  );
}
