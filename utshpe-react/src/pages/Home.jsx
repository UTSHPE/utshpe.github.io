import ImageSlideshow from "../components/ImageSlideshow";
import SponsorMarquee from "../components/SponsorMarquee";
import UpcomingEvents from "../components/UpcomingEvents";
import Leaderboard from "../components/Leaderboard";
import ThisWeekCollage from "../components/ThisWeekCollage";
import { Link } from "react-router-dom";

import "../styles/home.css";

function scrollToCalendar(event) {
  const calendar = document.getElementById("calendar");

  if (!calendar) return;

  event.preventDefault();
  calendar.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Home() {
  return (
    <main className="home-page">

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-background"></div>

        <div className="home-hero-inner">

          {/* Hero Text */}

          <div className="hero-content">

            <p className="hero-eyebrow">
              University of Texas at Austin
            </p>

            <h1 className="hero-title">
              UT <span>SHPE</span>
            </h1>

            <div className="hero-divider"></div>

            <h2 className="hero-tagline">
              Find your familia.
              <br />
              Build your future.
            </h2>

            <p className="hero-description">
              The Society of Hispanic Professional Engineers at UT Austin
              empowers Hispanic students in STEM through community,
              mentorship, professional development, and opportunity.
            </p>

            <div className="hero-buttons">

              <Link
                to="/membership"
                className="btn-primary"
              >
                Join the Familia
              </Link>

              <a
                href="#events"
                className="btn-outline"
              >
                Explore UT SHPE
              </a>

            </div>

            <div className="hero-meta">
              <span>Community</span>
              <span>•</span>
              <span>Leadership</span>
              <span>•</span>
              <span>Professional Development</span>
            </div>

          </div>


          {/* Hero Image */}

          <div className="home-hero-media">

            <div className="hero-image-accent"></div>

            <div className="hero-image-frame">
              <ImageSlideshow />
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          UPCOMING EVENTS + LEADERBOARD
          ===================================================== */}

      <section
        className="home-section events-section"
        id="events"
      >

        {/*
          One 2-row grid: headers share the top row and the cards
          share the bottom row, so both cards start on the same line.
          DOM order (header, card, header, card) is the stacked order.
        */}

        <div className="events-leaderboard-grid">

          {/* Upcoming Events */}

          <div className="column-header events-header">

            <h2 className="home-section-title">
              Upcoming Events
            </h2>

            <p className="home-section-description">
              Stay connected with the UT SHPE familia and see what is
              happening next.
            </p>

            <a
              href="#calendar"
              className="btn btn-secondary"
              onClick={scrollToCalendar}
            >
              View Calendar
            </a>

          </div>


          <div className="events-panel">
            <UpcomingEvents />
          </div>


          {/* Leaderboard */}

          <div className="column-header leaderboard-header-area">

            <h2 className="home-section-title">
              Leaderboard
            </h2>

            <p className="home-section-description">
              Earn points at events, volunteering, and workshops
              all semester long.
            </p>

            <Link to="/membership" className="btn">
              Learn More
            </Link>

          </div>


          <div className="leaderboard-card">
            <Leaderboard showHeader={false} />
          </div>

        </div>

      </section>


      {/* =====================================================
          SPONSORS
          ===================================================== */}

      <section className="home-section sponsors-section">

        <div className="sponsor-header">

          <h2 className="home-section-title">
            Our Sponsors
          </h2>

          <p className="home-section-description">
            We are proud to partner with companies that invest in
            the next generation of Hispanic engineers and STEM leaders.
          </p>

          <Link className="btn" to="/sponsorship">
            Become a Sponsor
          </Link>

        </div>


        <SponsorMarquee />

      </section>


      {/* =====================================================
          THIS WEEK IN SHPE
          ===================================================== */}

      <ThisWeekCollage />


      {/* =====================================================
          CALENDAR
          ===================================================== */}

      <section
        className="home-section calendar-section"
        id="calendar"
      >

        <div className="centered-section-header">

          <h2 className="home-section-title">
            UT SHPE Calendar
          </h2>

          <p className="home-section-description">
            Keep up with meetings, professional events, socials,
            and everything happening throughout the semester.
          </p>

        </div>


        <div className="calendar-frame">

          <iframe
            src="https://calendar.google.com/calendar/embed?height=500&wkst=1&bgcolor=%23EF6C00&ctz=America%2FChicago&showTabs=1&showPrint=0&mode=MONTH&showTz=0&src=ZmU5YjhvZnFxb2wxcXQ1bjYxYjZvajNvNGNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23E67C73"
            title="UT SHPE Google Event Calendar"
            loading="lazy"
          />

        </div>

        <p className="calendar-caption">
          Add the UT SHPE calendar to stay up to date with upcoming events.
        </p>

      </section>


      {/* =====================================================
          MEET THE FAMILIA
          ===================================================== */}

      <section className="home-section office-hours-section">

        <div className="centered-section-header">

          <h2 className="home-section-title">
            Meet the Familia
          </h2>
          
        </div>


        <iframe
          className="office-hours-image office-hours-embed"
          src="/office-hours.html?embed"
          title="UT SHPE LeaderSHPE office hours schedule"
          loading="lazy"
        />


        <p className="office-hours-text">
          Visit us during office hours to connect with our leadership
          team, learn more about our pillars, ask questions, or find
          out how you can become part of the UT SHPE familia.
        </p>

      </section>

    </main>
  );
}

export default Home;