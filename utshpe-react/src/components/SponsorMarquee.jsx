import { useEffect, useRef } from "react";

const sponsors = [
  {
    name: "Accenture",
    image: "/assets/images/sponsors/Accenture_logo.png",
  },
  {
    name: "Dell",
    image: "/assets/images/sponsors/Dell_logo.png",
  },
  {
    name: "ARM",
    image: "/assets/images/sponsors/ARM_logo.png",
  },
  {
    name: "BP",
    image: "/assets/images/sponsors/BP_logo.png",
  },
  {
    name: "Micron",
    image: "/assets/images/sponsors/Micron_logo.png",
  },
  {
    name: "Spectrum",
    image: "/assets/images/sponsors/Spectrum_logo.png",
  },
  {
    name: "Tesla",
    image: "/assets/images/sponsors/Tesla_logo.png",
  },
  {
    name: "Texas Instruments",
    image: "/assets/images/sponsors/Texas_Instruments_logo.png",
  },
  {
    name: "P&G",
    image: "/assets/images/sponsors/PG_logo.png",
  },
  {
    name: "Lockheed Martin",
    image: "/assets/images/sponsors/lockheedmartin_logo.png",
  },
  {
    name: "LPL Financial",
    image: "/assets/images/sponsors/LPL_Financial_logo.png",
  },
];

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
            <img
              src={sponsor.image}
              alt={sponsor.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SponsorMarquee;