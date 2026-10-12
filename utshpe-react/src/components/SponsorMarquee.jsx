import { useEffect, useRef, useState } from "react";

/*
  Logos only, no tiers. To add or remove a sponsor, edit this list.
  Image files live in public/assets/images/sponsors/
*/
const SPONSOR_DIR = "/assets/images/sponsors";

const sponsors = [
  { name: "Micron", image: `${SPONSOR_DIR}/Micron_logo.png` },
  { name: "Visa", image: `${SPONSOR_DIR}/Visa_logo.png` },
  { name: "Texas Instruments", image: `${SPONSOR_DIR}/Texas_Instruments_logo.png` },
  { name: "Lockheed Martin", image: `${SPONSOR_DIR}/lockheedmartin_logo.png` },
  { name: "Harvest Midstream", image: `${SPONSOR_DIR}/Harvest_Midstream_logo.png` },
  { name: "Crusoe", image: `${SPONSOR_DIR}/Crusoe_logo.png` },
  { name: "Leonardo DRS", image: `${SPONSOR_DIR}/Leonardo_DRS_logo.png` },
  { name: "Arm", image: `${SPONSOR_DIR}/ARM_logo.png` },
  { name: "Dell", image: `${SPONSOR_DIR}/Dell_logo.png` },
  { name: "PepsiCo", image: `${SPONSOR_DIR}/PepsiCo_logo.png` },
  { name: "LCRA", image: `${SPONSOR_DIR}/LCRA_logo.png` },
  { name: "Sandia National Laboratories", image: `${SPONSOR_DIR}/Sandia_Lab_logo.png` },
];

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