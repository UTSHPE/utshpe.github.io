import { useEffect, useRef, useState } from "react";
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


const instagramPosts = [
  "https://www.instagram.com/p/DNg3R0MR3lX/?hl=en&img_index=1",
  "https://www.instagram.com/p/DcrBpuKhV9z/?hl=en",
  "https://www.instagram.com/p/Dcj2u90GdS2/?hl=en&img_index=1",
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

/*
 * Loads Instagram's embed.js once, then re-processes any
 * instagram-media blockquotes on the page whenever `deps` changes
 * (e.g. after the post list renders). Without this, React never
 * triggers Instagram's own auto-init and the blockquotes stay blank.
 */
function useInstagramEmbed(deps) {
  useEffect(() => {
    const process = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    const existingScript = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    );

    if (existingScript) {
      process();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function InstagramFeed() {
  useInstagramEmbed([instagramPosts.length]);

  return (
    <div className="ig-embed">
      <h3 className="ig-title">
        <i className="fa-brands fa-instagram" aria-hidden="true"></i>
        Latest on Instagram
      </h3>

      {instagramPosts.length > 0 ? (
        <div className="ig-post-grid">
          {instagramPosts.map((permalink) => (
            <blockquote
              key={permalink}
              className="instagram-media"
              data-instgrm-permalink={permalink}
              data-instgrm-version="14"
            />
          ))}
        </div>
      ) : (
        <div className="ig-empty">
          <p>
            Add a few post links in <code>instagramPosts</code> to show
            them here, or follow along in the meantime.
          </p>
          <a
            href="https://www.instagram.com/utshpe/"
            target="_blank"
            rel="noopener noreferrer"
            className="ig-follow-link"
          >
            <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            @utshpe on Instagram
          </a>
        </div>
      )}
    </div>
  );
}

function Membership() {
  return (
    <>
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
              <span className="step-icon" aria-hidden="true">
                <i className="fa-solid fa-file-signature"></i>
              </span>

              <h3>
                1) Fill out the{" "}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfpFsfzYCDaP52RhzU70rrBwR49V1JNfCJbOojF0uce5uLG3w/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  membership form
                </a>
              </h3>
            </li>

            <li>
              <span className="step-icon" aria-hidden="true">
                <i className="fa-solid fa-hand-holding-dollar"></i>
              </span>

              <h3>2) Pay membership dues</h3>
            </li>

            <li>
              <span className="step-icon" aria-hidden="true">
                <i className="fa-solid fa-comments"></i>
              </span>

              <h3>
                3) Join our Slack and follow our Instagram to keep up with
                upcoming events!
              </h3>
            </li>

            <li>
              <span className="step-icon" aria-hidden="true">
                <i className="fa-solid fa-people-group"></i>
              </span>

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

            <InstagramFeed />

            {/* Points Leaderboard 
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
            */}
          </div>
        </section>

      </main>

    </>
  );
}

export default Membership;