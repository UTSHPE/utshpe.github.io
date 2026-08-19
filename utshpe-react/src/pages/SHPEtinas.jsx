import { useEffect, useRef, useState } from "react";
import "../styles/shpetinas.css";

function SHPEtinas() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const eventImages = [
    {
      src: "/assets/images/shpetinas/shpetinaslideshow1.JPG",
      alt: "SHPEtinas Event 1",
    },
    {
      src: "/assets/images/shpetinas/shpetinaslideshow2.JPG",
      alt: "SHPEtinas Event 2",
    },
    {
      src: "/assets/images/shpetinas/shpetinaslideshow3.JPG",
      alt: "SHPEtinas Event 3",
    },
    {
      src: "/assets/images/shpetinas/shpetinaslideshow4.JPG",
      alt: "SHPEtinas Event 4",
    },
    {
      src: "/assets/images/shpetinas/shpetinaslideshow5.jpg",
      alt: "SHPEtinas Event 5",
    },
  ];

  const committee = [
    {
      name: "Evelyn Flores",
      role: "SHPEtina Director",
      image: "/assets/images/shpetinas/Eve_shpetina.jpg",
      alt: "SHPEtina Director",
    },
    {
      name: "Natalia Morales",
      role: "Fundraising Coordinator Chair",
      image: "/assets/images/shpetinas/NataliaMorales.jpg",
      alt: "Fundraising Coordinator Chair",
    },
    {
      name: "Destiny Licon",
      role: "Finance Coordinator Chair",
      image: "/assets/images/shpetinas/Destiny.jpg",
      alt: "Finance Coordinator Chair",
    },
    {
      name: "Natalia Martinez",
      role: "Marketing Chair",
      image: "/assets/images/shpetinas/NataliaMartinez.jpg",
      alt: "Marketing Chair",
    },
    {
      name: "Lizbeth Garcia",
      role: "Publicity Chair",
      image: "/assets/images/shpetinas/Lizbeth.jpg",
      alt: "Publicity Chair",
    },
    {
      name: "Lourdes Ybarra",
      role: "Internal Affairs Liaison Chair",
      image: "/assets/images/shpetinas/Lou.jpg",
      alt: "Internal Affairs Liaison Chair",
    },
  ];

  /*
   * Automatically advance the slideshow every 3.5 seconds.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % eventImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [eventImages.length]);

  /*
   * Touch/swipe support.
   */
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchEndX.current - touchStartX.current;

    if (Math.abs(distance) > 40) {
      if (distance < 0) {
        // Swipe left
        setCurrentSlide(
          (previous) => (previous + 1) % eventImages.length
        );
      } else {
        // Swipe right
        setCurrentSlide(
          (previous) =>
            (previous - 1 + eventImages.length) %
            eventImages.length
        );
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <main className="shpetinas-page">

      {/* =========================
          HERO
      ========================== */}
      <section className="shpetinas-hero">
        <div className="shpetinas-hero-wrap">

          <div className="shpetinas-hero-title">
            <h1>SHPEtinas</h1>
          </div>

          <div className="shpetinas-hero-img">
            <img
              src="/assets/images/shpetinas/shpetinasmain.JPG"
              alt="SHPEtinas group at UT Austin"
            />
          </div>

        </div>
      </section>


      {/* =========================
          ABOUT + PROGRAM HIGHLIGHTS
      ========================== */}
      <section id="about" className="shpetinas-about-split">

        {/* About */}
        <div className="shpetinas-pink-panel">

          <h2>About SHPEtinas</h2>

          <p className="shpetinas-big-about">
            The SHPEtinas program exists to accelerate and affirm Latina
            representation at every level of STEM leadership by recognizing
            the unique perspectives of our members. As the program expands,
            we remain grounded in our core mission: empowering women,
            fostering meaningful connections, and providing unwavering support.
          </p>

          <div className="shpetinas-chips">
            <span className="shpetinas-chip">
              Fostering Connections
            </span>

            <span className="shpetinas-chip">
              Empowering Women
            </span>

            <span className="shpetinas-chip">
              Providing Support
            </span>
          </div>

        </div>


        {/* Program Highlights */}
        <aside className="shpetinas-highlights-card">

          <h3>Program Highlights</h3>

          <ul className="shpetinas-highlight-list">

            <li>
              <i
                className="fa-solid fa-user-group"
                aria-hidden="true"
              />

              <div>
                <strong>Mentorship Network</strong>
                <br />
                Connect with mentors and peer support systems.
              </div>
            </li>

            <li>
              <i
                className="fa-solid fa-chalkboard-user"
                aria-hidden="true"
              />

              <div>
                <strong>Leadership Workshops</strong>
                <br />
                Grow professional and leadership skills.
              </div>
            </li>

            <li>
              <i
                className="fa-solid fa-award"
                aria-hidden="true"
              />

              <div>
                <strong>Recognition Program</strong>
                <br />
                Celebrate achievements and academic excellence.
              </div>
            </li>

            <li>
              <i
                className="fa-solid fa-heart"
                aria-hidden="true"
              />

              <div>
                <strong>Sisterhood</strong>
                <br />
                Lasting friendships and community.
              </div>
            </li>

          </ul>

        </aside>

      </section>


      {/* =========================
          COMMITTEE
      ========================== */}
      <section className="shpetinas-section shpetinas-committee">

        <h2 className="shpetinas-h2">
          SHPEtinas Committee
        </h2>

        <div className="shpetinas-rule" />

        <div className="shpetinas-committee-grid">

          {committee.map((member) => (
            <article
              className="shpetinas-card"
              key={member.name}
            >
              <img
                className="shpetinas-card-photo"
                src={member.image}
                alt={member.alt}
              />

              <div className="shpetinas-card-pad">
                <h3>{member.name}</h3>
                <p className="shpetinas-role">
                  {member.role}
                </p>
              </div>
            </article>
          ))}

        </div>

      </section>


      {/* =========================
          EVENTS
      ========================== */}
      <section
        id="events"
        className="shpetinas-section shpetinas-events"
      >

        <h2 className="shpetinas-h2">
          Our Events
        </h2>

        <div className="shpetinas-rule" />

        <div
          className="shpetinas-event-slider"
          aria-label="Event photos slideshow"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          {eventImages.map((image, index) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className={
                index === currentSlide
                  ? "is-active"
                  : ""
              }
            />
          ))}

        </div>

        {/* Slideshow indicators */}
        <div className="shpetinas-slide-indicators">
          {eventImages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={
                index === currentSlide
                  ? "active"
                  : ""
              }
              aria-label={`Show event ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

      </section>


      {/* =========================
          PROMO SECTION
      ========================== */}
      <section className="shpetinas-promo-split">

        {/* Merchandise */}
        <article className="shpetinas-tshirt-card">

          <h3 className="shpetinas-tshirt-title">
            Our Merch
          </h3>

          <img
            src="/assets/images/shpetinas/shpetinamerch.png"
            alt="SHPEtinas shirt design"
          />

        </article>


        {/* SHPEtina of the Month */}
        <aside className="shpetinas-month">

          <span className="shpetinas-badge">
            SHPEtina of the Month
          </span>

          <img
            src="/assets/images/shpetinas/shpetinaofmonth.jpg"
            alt="SHPEtina of the Month"
          />

          <h3 className="shpetinas-name">
            Michelle Bustillos
          </h3>

          <p className="shpetinas-meta">
            Mechanical Engineering • Class of 2028
          </p>

          <ul className="shpetinas-facts">
            <li>
              <strong>Hometown:</strong> Leveland, TX
            </li>

            <li>
              <strong>Fun Fact:</strong> Loves storm chasing
              but afraid of lightning
            </li>
          </ul>

        </aside>

      </section>

    </main>
  );
}

export default SHPEtinas;