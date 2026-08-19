import React from "react";
import "../styles/leadership.css";

const executiveBoard = [
  {
    name: "Genesis Aguirre",
    pronouns: "She/Her",
    role: "President",
    major: "Civil Engineering",
    image: "/assets/images/Leadership/Genesis.png",
    linkedin: "https://www.linkedin.com/in/genesis-aguirre-0aa25424b/",
    email: "Gda494@my.utexas.edu",
  },
  {
    name: "Alberto Rayon Cardenas",
    pronouns: "He/Him",
    role: "Vice President External",
    major: "Mechanical Engineering",
    image: "/assets/images/Leadership/Alberto.png",
    linkedin: "https://www.linkedin.com/in/jimenacasas29/",
    email: "Jc89832@utexas.edu",
  },
  {
    name: "Julieta Rodriguez",
    pronouns: "She/Her",
    role: "Vice President Internal",
    major: "Computer Science",
    image: "/assets/images/Leadership/Julieta.png",
    linkedin: "https://www.linkedin.com/in/julieta-r/",
    email: "julietarod@utexas.edu",
  },
  {
    name: "Elysha Orozco",
    pronouns: "She/Her",
    role: "Secretary",
    major: "Petroleum Engineering",
    image: "/assets/images/Leadership/Elysha.png",
    linkedin: "https://www.linkedin.com/in/elysha-orozco/",
    email: "Elo436@my.utexas.edu",
  },
  {
    name: "Xitlali Cardenas",
    pronouns: "She/Her",
    role: "Treasurer",
    major: "Computer Science",
    image: "/assets/images/Leadership/Xitlali.png",
    linkedin: "https://www.linkedin.com/in/cardenasxitlali/",
    email: "xitlalicardenas@utexas.edu",
  },
];

const boardOfDirectors = [
  {
    name: "David Jasso",
    pronouns: "He/Him",
    role: "Academic Director",
    major: "Chemical Engineering",
    image: "/assets/images/Leadership/David.png",
    linkedin: "https://www.linkedin.com/in/david-jasso-b980342b2/",
    email: "davidjass0999@gmail.com",
  },
  {
    name: "Chris Garcia",
    pronouns: "He/Him",
    role: "Chapter Director",
    major: "Civil Engineering",
    image: "/assets/images/Leadership/Chris.png",
    linkedin: "https://www.linkedin.com/in/garciachris26/",
    email: "garcia.chris226@utexas.edu",
  },
  {
    name: "Alejandro Ontiveros",
    pronouns: "He/Him",
    role: "Community Outreach Director",
    major: "Electrical & Computer Engineering",
    image: "/assets/images/Leadership/Alejandro.png",
    linkedin: "https://www.linkedin.com/in/alejandro-ontiveros13/",
    email: "alejonti13@gmail.com",
  },
  {
    name: "Yessenia Martin",
    pronouns: "She/Her",
    role: "Leadership Director",
    major: "Computer Science",
    image: "/assets/images/Leadership/Yessenia.png",
    linkedin: "https://www.linkedin.com/in/yessenia-martin/",
    email: "yesseniamartin@utexas.edu",
  },
  {
    name: "Alexandra Galindo",
    pronouns: "She/Her",
    role: "Professional Director",
    major: "Electrical & Computer Engineering",
    image: "/assets/images/Leadership/Alexandra.png",
    linkedin: "https://www.linkedin.com/in/galindo3553/",
    email: "agalindo3553@utexas.edu",
  },
  {
    name: "Evelyn Flores",
    pronouns: "She/Her",
    role: "SHPEtina Director",
    major: "Aerospace Engineering",
    image: "/assets/images/Leadership/Evelyn.png",
    linkedin: "https://www.linkedin.com/in/evelyn-sugei-flores/",
    email: "eveelynnflores902@gmail.com",
  },
  {
    name: "Kevin Contreras",
    pronouns: "He/Him",
    role: "Technical Director",
    major: "Mechanical Engineering",
    image: "/assets/images/Leadership/Kevin.png",
    linkedin: "https://www.linkedin.com/in/kevinscontreras/",
    email: "kevinscontreras@utexas.edu",
  },
];

function OfficerCard({ officer }) {
  return (
    <article className="officer-card">
      <img
        src={officer.image}
        alt={`${officer.name} - ${officer.role}`}
      />

      <div className="officer-body">
        <h3 className="officer-name">{officer.name}</h3>

        <p className="officer-pronouns">
          {officer.pronouns}
        </p>

        <p className="officer-role">
          {officer.role}
        </p>

        <p className="officer-major">
          {officer.major}
        </p>

        <div className="officer-socials">
          <a
            href={officer.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${officer.name} LinkedIn`}
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>

          <a
            href={`mailto:${officer.email}`}
            aria-label={`Email ${officer.name}`}
          >
            <i className="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>
    </article>
  );
}

function Leadership() {
  return (
    <main className="leader-page">
      {/* Hero */}
      <section className="leader-hero">
        <img
          src="/assets/images/Leadership/Leadershipteam.png"
          alt="UT SHPE Leadership Team"
        />
      </section>

      {/* Introduction */}
      <section className="leader-intro section">
        <h1 className="leader-title">
          Meet UT-SHPE's 2025-2026 LeaderSHPE Team!
        </h1>

        <div
          className="leader-rule"
          aria-hidden="true"
        ></div>

        <p className="leader-text">
          These are the amazing, determined individuals who make up our
          leaderSHPE team! Each of them carries vital responsibilities
          that sustain our chapter's vision and mission, and they lead by
          example with perseverance, dedication, and a passion for service.
        </p>
      </section>

      {/* Executive Board */}
      <section className="leader-section section">
        <h2 className="leader-h2">
          Executive Board
        </h2>

        <div className="leader-grid executive-grid">
          {executiveBoard.map((officer) => (
            <OfficerCard
              key={officer.name}
              officer={officer}
            />
          ))}
        </div>
      </section>

      {/* Board of Directors */}
      <section className="leader-section section">
        <h2 className="leader-h2">
          Board of Directors
        </h2>

        <div className="leader-grid bod">
          {boardOfDirectors.map((officer) => (
            <OfficerCard
              key={officer.name}
              officer={officer}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Leadership;