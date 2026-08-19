import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/membership.css";

const membershipImages = [
  "/assets/images/membership/membership1.jpg",
  "/assets/images/membership/membership2.jpg",
  "/assets/images/membership/membership3.jpg",
  "/assets/images/membership/membership4.jpg",
  "/assets/images/membership/membership5.jpg",
  "/assets/images/membership/membership6.jpg",
  "/assets/images/membership/membership7.jpg",
];

function MembershipSlideshow() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % membershipImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="hero-media slideshow-js"
      aria-label="UT SHPE membership photos"
    >
      {membershipImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`UT SHPE membership event ${index + 1}`}
          className={index === currentImage ? "active" : ""}
        />
      ))}
    </div>
  );
}

function Membership() {
  return (
    <>
      <Navbar />

      <main className="membership-page">

        {/* HERO */}
        <section className="member-hero">
          <div className="section hero-grid">

            <div className="hero-copy">
              <h1 className="member-subtitle">
                Become a part of the UTSHPE Familia!
              </h1>

              <p className="member-subtitle">
                Find your familia, grow your skills, get involved, and get
                plugged into opportunities across UT and beyond!
              </p>

              <ul className="member-highlights">
                <li>Sponsored General Meetings</li>
                <li>Professional development events</li>
                <li>Mentorship &amp; leadership opportunities</li>
                <li>Recruiting &amp; company info sessions</li>
                <li>Study nights, socials, and outreach</li>
              </ul>
            </div>

            <MembershipSlideshow />

          </div>
        </section>

        {/* HOW TO JOIN */}
        <section className="join-steps section" id="how-to-join">
          <h2 className="h2">How to Join UTSHPE</h2>

          <ol className="steps">
            <li>
              <h3>
                1) Fill out the{" "}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSefYEFS5tTWalPaEtvPx3zCT-vfP-uMf6iC-OQVeqNwporoNg/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  membership form
                </a>
              </h3>
            </li>

            <li>
              <h3>2) Pay membership dues</h3>
            </li>

            <li>
              <h3>
                3) Join our Slack and follow our Instagram to keep up with
                upcoming events!
              </h3>
            </li>

            <li>
              <h3>4) Get involved!</h3>
            </li>
          </ol>
        </section>

        {/* SPOTLIGHTS */}
        <section className="spotlights section" id="spotlights">
          <div className="spotlights-grid">

            {/* Member of the Month */}
            <article className="spotlight-card">
              <div className="badge">
                Member of the Month
              </div>

              <img
                src="/assets/images/membership/memberofmonth.png"
                alt="Member of the Month"
                className="spotlight-photo"
              />

              <div className="spotlight-body">
                <h3 className="spotlight-name">
                  Mayra Silva
                </h3>

                <p className="spotlight-meta">
                  Civil Engineering • Class of 2029
                </p>

                <p className="spotlight-fact">
                  <strong>Hometown:</strong> Dallas TX
                </p>

                <p className="spotlight-fact">
                  <strong>Fun Fact:</strong> I have gone parasailing!
                </p>
              </div>
            </article>

            {/* Officer of the Month */}
            <article className="spotlight-card">
              <div className="badge alt">
                Officer of the Month
              </div>

              <img
                src="/assets/images/membership/officerofthemonth.png"
                alt="Officer of the Month"
                className="spotlight-photo"
              />

              <div className="spotlight-body">
                <h3 className="spotlight-name">
                  Yessenia Martin
                </h3>

                <p className="spotlight-meta">
                  Leadership Director • Class of 2027
                </p>

                <p className="spotlight-fact">
                  <strong>Hometown:</strong> Arlington TX
                </p>

                <p className="spotlight-fact">
                  <strong>Fun Fact:</strong> I ran my first half marathon this
                  year!
                </p>
              </div>
            </article>

            {/* Instagram */}
            <aside className="ig-embed">
              <h3 className="ig-title">
                Latest on Instagram
              </h3>

              <blockquote
                className="instagram-media"
                data-instgrm-permalink="https://www.instagram.com/utshpe/?hl=en"
                data-instgrm-version="14"
              />
            </aside>

            {/* Points Leaderboard */}
            <aside className="ig-embed">
              <h3 className="ig-title">
                Points Leaderboard
              </h3>

              <iframe
                src="https://script.google.com/macros/s/AKfycbyf5sua5ZE-7MxAZBWglR3zv1gu6vQkzEkb1qr1e9unAb7k5qu15DjEj79YyswheQNz/exec"
                title="UT SHPE Points Leaderboard"
                loading="lazy"
                scrolling="yes"
              />
            </aside>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Membership;