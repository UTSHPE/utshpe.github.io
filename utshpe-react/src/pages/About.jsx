import { useState } from "react";
import "../styles/about.css";

function About() {
  const pillars = [
    {
      title: "Academic Development",
      image: "/assets/images/aboutus/Academic.jpg",
      icon: "/assets/images/aboutus/AcademicDevIcon.png",
      alt: "Academic photo",
      description:
        "The Academic Development pillar focuses on study success and connecting members to chapter & campus resources.",
    },
    {
      title: "Chapter Development",
      image: "/assets/images/aboutus/Chapter.jpg",
      icon: "/assets/images/aboutus/ChapterDevIcon.png",
      alt: "Chapter photo",
      description:
        "Chapter Development builds familia through socials, transitions, and a welcoming culture.",
    },
    {
      title: "Community Outreach",
      image: "/assets/images/aboutus/ChapterOutreach.jpg",
      icon: "/assets/images/aboutus/CommunityOutreachIcon.png",
      alt: "Community outreach photo",
      description:
        "Community Outreach serves Austin through volunteer events that bond members while giving back.",
    },
    {
      title: "Leadership Development",
      image: "/assets/images/aboutus/Leadership.jpg",
      icon: "/assets/images/aboutus/LeadershipIcon.png",
      alt: "Leadership photo",
      description:
        "Leadership Development grows confident leaders via shadowing, mentorship, and recruiting.",
    },
    {
      title: "Professional Development",
      image: "/assets/images/aboutus/ProfessionalDevelopment.png",
      icon: "/assets/images/aboutus/ProfessionalDevIcon.png",
      alt: "Professional development photo",
      description:
        "Professional Development prepares members for internships & full-time roles with workshops and events.",
    },
    {
      title: "Technical Development",
      image: "/assets/images/aboutus/technicaldevelopment.png",
      icon: "/assets/images/aboutus/TechnicalDevIcon.png",
      alt: "Technical development photo",
      description:
        "Technical Development hones skills such as coding, CAD, hardware, and more through projects & trainings.",
    },
  ];

  const [activePillar, setActivePillar] = useState(0);

  const selectPillar = (index) => {
    setActivePillar(index);
  };

  const handleKeyDown = (event, index) => {
    let nextIndex;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIndex = (index + 1) % pillars.length;
        break;

      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIndex = (index - 1 + pillars.length) % pillars.length;
        break;

      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;

      case "End":
        event.preventDefault();
        nextIndex = pillars.length - 1;
        break;

      default:
        return;
    }

    setActivePillar(nextIndex);

    // Move keyboard focus to the newly selected tab
    requestAnimationFrame(() => {
      document
        .getElementById(`pillar-tab-${nextIndex}`)
        ?.focus();
    });
  };

  const currentPillar = pillars[activePillar];

  return (
    <main className="about-page">
      {/* =========================
          MISSION & VISION
      ========================== */}
      <section className="mission-vision">
        <div className="section">
          {/* Mission */}
          <div className="mission">
            <img
              src="/assets/images/aboutus/Aboutpic1.jpg"
              alt="UT SHPE members"
            />

            <div className="mission-text">
              <h2>Our Mission</h2>

              <p>
                Our mission is to change lives by empowering the Hispanic
                community to reach its fullest potential and make a lasting
                impact on the world through STEM awareness, access, support,
                and development.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="vision">
            <div className="vision-text">
              <h2>Our Vision</h2>

              <p>
                SHPE&apos;s vision is a world where Hispanics are highly valued
                and influential as the leading innovators, scientists,
                mathematicians, and engineers.
              </p>
            </div>

            <img
              src="/assets/images/aboutus/Aboutpic2.jpg"
              alt="UT SHPE members"
            />
          </div>
        </div>
      </section>

      {/* =========================
          UT SHPE IN NUMBERS
      ========================== */}
      <section className="numbers-section">
        <div className="section">
          <h2 className="section-title">UT SHPE in Numbers</h2>

          <div className="numbers-grid">
            <div className="stat">
              <h3>300+</h3>
              <p>Active Members</p>
            </div>

            <div className="stat">
              <h3>210+</h3>
              <p>Average General Meeting Attendance</p>
            </div>

            <div className="stat">
              <h3>35+</h3>
              <p>Social &amp; Networking Events Each Year</p>
            </div>

            <div className="stat">
              <h3>30+</h3>
              <p>Corporate Workshops and Tech Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          SIX PILLARS
      ========================== */}
      <section id="pillars" className="pillars">
        <div className="section pillars-wrap">
          <h2 className="section-title">The 6 Pillars</h2>

          <div className="pillars-grid">
            {/* Left side */}
            <div className="pillars-panel">
              <div
                className="pillars-tabs"
                role="tablist"
                aria-label="UT SHPE Pillars"
              >
                {pillars.map((pillar, index) => (
                  <button
                    key={pillar.title}
                    id={`pillar-tab-${index}`}
                    className={`pillars-tab ${
                      activePillar === index ? "is-active" : ""
                    }`}
                    role="tab"
                    aria-selected={activePillar === index}
                    aria-controls="pillar-content"
                    tabIndex={activePillar === index ? 0 : -1}
                    onClick={() => selectPillar(index)}
                    onKeyDown={(event) =>
                      handleKeyDown(event, index)
                    }
                  >
                    <span
                      className="pillars-icon"
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url("${pillar.icon}")`,
                      }}
                    />

                    <span>{pillar.title}</span>
                  </button>
                ))}
              </div>

              <div
                id="pillar-content"
                className="pillars-content"
                role="region"
                aria-live="polite"
                aria-labelledby={`pillar-tab-${activePillar}`}
              >
                <h3>{currentPillar.title}</h3>

                <p>{currentPillar.description}</p>
              </div>
            </div>

            {/* Right side */}
            <figure className="pillars-figure">
              <img
                src={currentPillar.image}
                alt={currentPillar.alt}
              />
            </figure>
          </div>
        </div>
      </section>

      {/* =========================
          HISTORY
      ========================== */}
      <section className="history" id="history">
        <div className="section">
          <h2 className="history-title">Our History</h2>

          <p className="history-text">
            UT SHPE was founded in 1982 as a subcommittee of the organization
            Pi Sigma Pi. Today our 300+ member chapter is known for building a
            thriving Hispanic community of mathematicians, scientists, and
            engineers. Our chapter is known for leadership, technical
            development, chapter growth, academic development, professional
            development, and our community outreach throughout Austin. Today
            we continue that mission, supporting students, connecting with
            industry, and giving back through service.
          </p>

          <div className="history-cta">
            <a
              className="btn btn-outline"
              href="/assets/files/2025-2026 UT SHPE Bylaws.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bylaws
            </a>

            <a
              className="btn btn-outline"
              href="/assets/files/2025-2026 UT SHPE Constitution.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Constitution
            </a>

            <a
              className="btn btn-outline"
              href="https://give.utexas.edu/?menu=OGPENCS&solicit=ESL&response=DJ0ESL=ENDS&comments=Society%20of%20Hispanic%20Professional%20Engineers%20%28SHPE%29%20Account:%2030-2116-8093"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donate
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;