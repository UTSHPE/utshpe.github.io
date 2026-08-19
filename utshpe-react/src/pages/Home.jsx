import ImageSlideshow from "../components/ImageSlideshow";
import EventCarousel from "../components/EventCarousel";
import SponsorMarquee from "../components/SponsorMarquee";

import "../styles/home.css";

function Home() {
  return (
    <>
      {/* =========================
          Hero / Introduction
          ========================= */}

      <section className="info">
        <div className="info-left">
          <h1>UT SHPE</h1>

          <p className="sub">
            The University of Texas at Austin
          </p>

          <p className="mission">
            Our mission is to empower Hispanic students in STEM through
            community, mentorship, and professional development.
          </p>

          <a
            href="/membership"
            className="btn btn-primary"
          >
            Join Now!
          </a>
        </div>

        <ImageSlideshow />

        <EventCarousel />
      </section>


      {/* =========================
          Sponsors
          ========================= */}

      <hr />

      <section className="sponsors-slideshow">
        <div className="sponsor-header">
          <h2 className="section-title">
            Our Sponsors
          </h2>

          <a
            className="btn btn-primary sponsor-cta"
            href="/sponsorship"
          >
            Become a Sponsor
          </a>
        </div>

        <div className="section-rule" />

        <SponsorMarquee />
      </section>


      {/* =========================
          Calendar
          ========================= */}

      <hr />

      <section className="calendar">
        <h2 className="section-title">
          Google Event Calendar
        </h2>

        <div className="calendar-frame">
          <iframe
            src="https://calendar.google.com/calendar/embed?height=500&wkst=1&bgcolor=%23EF6C00&ctz=America%2FChicago&showTabs=1&showPrint=0&mode=MONTH&showTz=0&src=ZmU5YjhvZnFxb2wxcXQ1bjYxYjZvajNvNGNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23E67C73"
            title="UT SHPE Google Event Calendar"
            loading="lazy"
          />
        </div>

        <p className="calendar-caption">
          Link your Calendar for upcoming Events!
        </p>
      </section>


      {/* =========================
          Office Hours
          ========================= */}

      <section className="office-hours">
        <h2>Office Hours</h2>

        <img
          src="/assets/images/Home_Page/LeadershipOH.png"
          alt="LeaderSHPE Office Hours"
        />

        <p>
          Visit us during office hours to connect with our leadership
          team, learn more about our pillars, or ask about becoming a
          member!
        </p>
      </section>
    </>
  );
}

export default Home;