import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/sponsorship.css";

const sponsorImages = [
  "/assets/images/sponsors/Sponsorpage.jpg",
  "/assets/images/sponsors/Sponsorspage2.jpg",
  "/assets/images/sponsors/Sponsorspage3.jpg",
];

const sponsors = [
  {
    name: "ARM",
    image: "/assets/images/sponsors/ARM_logo.png",
  },
  {
    name: "Accenture",
    image: "/assets/images/sponsors/Accenture_logo.png",
  },
  {
    name: "BP",
    image: "/assets/images/sponsors/BP_logo.png",
  },
  {
    name: "Dell",
    image: "/assets/images/sponsors/Dell_logo.png",
  },
  {
    name: "LPL Financial",
    image: "/assets/images/sponsors/LPL_Financial_logo.png",
  },
  {
    name: "Micron",
    image: "/assets/images/sponsors/Micron_logo.png",
  },
  {
    name: "P&G",
    image: "/assets/images/sponsors/PG_logo.png",
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
    name: "Lockheed Martin",
    image: "/assets/images/sponsors/lockheedmartin_logo.png",
  },
];

function SponsorSlideshow() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % sponsorImages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="sponsor-slideshow"
      aria-label="Sponsor event photos"
    >
      {sponsorImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`UT SHPE sponsor event ${index + 1}`}
          className={index === currentImage ? "active" : ""}
        />
      ))}
    </div>
  );
}

function Sponsorship() {
  return (
    <>

      <main className="sponsor-page">
        {/* Hero / Thank You Section */}
        <section className="section sponsor-hero">
          <div className="hero-left card-blue">
            <span className="hero-icon" aria-hidden="true">
              <i className="fa-solid fa-handshake"></i>
            </span>

            <h2 className="hero-title">
              Thank You to Our Sponsors!
            </h2>

            <p className="hero-text">
              A special thank you to all companies who have supported us
              this year! Your commitment in empowering Hispanics in STEM is
              one-of-a-kind and will provide lots of opportunities for our
              members. Your support represents the hope and the desire for
              a better future. Our chapter and leadership team gratefully
              appreciate you for believing in us!
            </p>
          </div>

          <div className="hero-right">
            <SponsorSlideshow />
          </div>
        </section>

        {/* Sponsors */}
        <section className="section all-sponsors">
          <h2 className="section-title">
            Our Sponsors
          </h2>

          <div className="sponsor-grid">
            {sponsors.map((sponsor) => (
              <article
                className="logo-card"
                key={sponsor.name}
              >
                <img
                  src={sponsor.image}
                  alt={`${sponsor.name} logo`}
                />
              </article>
            ))}
          </div>
        </section>

        {/* Become a Sponsor */}
        <section className="section cta-sponsor">
          <div className="cta-card">
            <span className="cta-icon" aria-hidden="true">
              <i className="fa-solid fa-star"></i>
            </span>

            <h2 className="cta-title">
              Become a Sponsor Today
            </h2>

            <hr className="cta-rule" />

            <p className="cta-text">
              Become a sponsor by contacting our Corporate Director at{" "}
              <a
                className="cta-link"
                href="mailto:utshpe@gmail.com"
              >
                utshpe@gmail.com
              </a>
              . Your support helps UT SHPE students drive toward their
              goals. We’re happy to answer any questions you have,
              including specific event donations.
            </p>

            <a
              className="btn-csp"
              href="/assets/files/UT-SHPE 25-26 Corporate Solicitation Packet.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-file-pdf"></i>
              View Corporate Sponsorship Packet (PDF)
            </a>
          </div>
        </section>
      </main>

    </>
  );
}

export default Sponsorship;