import { useEffect, useRef, useState } from "react";

import { sponsors } from "../data/sponsors";

/*
  Shows the logo; if the image file is missing, shows the company
  name as text instead of a broken-image icon.
*/
function SponsorLogo({ sponsor }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className="sponsor-fallback">{sponsor.name}</span>;
  }

  return (
    <img
      src={sponsor.image}
      alt={sponsor.name}
      onError={() => setFailed(true)}
    />
  );
}

function SponsorMarquee() {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const lastTimeRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const speed = 40; // pixels per second

    const animate = (timestamp) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!pausedRef.current) {
        positionRef.current -= (speed * deltaTime) / 1000;

        const halfWidth = track.scrollWidth / 2;

        if (Math.abs(positionRef.current) >= halfWidth) {
          positionRef.current += halfWidth;
        }

        track.style.transform = `translateX(${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handlePointerDown = () => {
    pausedRef.current = true;
  };

  const handlePointerUp = () => {
    pausedRef.current = false;
  };

  /*
    Duplicate the sponsors so that when the first set
    scrolls away, an identical set is already following it.
  */
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div
      className="sponsor-carousel"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="sponsor-track" ref={trackRef}>
        {duplicatedSponsors.map((sponsor, index) => (
          <div
            className="sponsor"
            key={`${sponsor.name}-${index}`}
          >
            <SponsorLogo sponsor={sponsor} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SponsorMarquee;