import ImageSlideshow from "../components/ImageSlideshow";
import EventCarousel from "../components/EventCarousel";
import SponsorMarquee from "../components/SponsorMarquee";
import UpcomingEvents from "../components/UpcomingEvents";
import Leaderboard from "../components/Leaderboard";

import "../styles/home.css";

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

              <a
                href="/membership"
                className="btn-primary"
              >
                Join the Familia
              </a>

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
          UPCOMING EVENTS
          ===================================================== */}

      <section
        className="home-section events-section"
        id="events"
      >
        <div className="centered-section-header">
          <h2 className="home-section-title">
            Upcoming Events
          </h2>

          <p className="home-section-description">
            Stay connected with the UT SHPE familia and see what is
            happening next.
          </p>
        </div>

        <UpcomingEvents />
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

          <a
            className="btn"
            href="/sponsorship"
          >
            Become a Sponsor
          </a>

        </div>


        <SponsorMarquee />

      </section>


      {/* =====================================================
          MEMBER POINTS
          ===================================================== */}

      <section className="home-section points-section">

        <div className="points-container">

          {/* Description */}

          <div className="points-copy">

            <span className="eyebrow">
              Get Involved
            </span>

            <h2>
              Earn points.
              <br />
              Get involved.
              <br />
              Make an impact.
            </h2>

            <p>
              Participate in UT SHPE events, volunteer opportunities,
              professional development, and community activities to
              earn points throughout the semester.
            </p>

            <a
              href="/membership"
              className="btn"
            >
              Learn More
            </a>

          </div>


          {/* Leaderboard */}

          <div className="points-card">

            <Leaderboard />

          </div>

        </div>

      </section>


      {/* =====================================================
          CALENDAR
          ===================================================== */}

      <section className="home-section calendar-section">

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

          <p className="home-section-description">
            Connect with our leadership team, learn about our pillars,
            and find ways to get involved with UT SHPE.
          </p>

        </div>


        <img
          className="office-hours-image"
          src="/assets/images/Home_Page/LeadershipOH.png"
          alt="UT SHPE Leadership Office Hours"
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