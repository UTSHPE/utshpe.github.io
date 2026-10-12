import { useState } from "react";

import { spotlights, spotlightMonth } from "../data/spotlights";

import "../styles/spotlight.css";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function SpotlightPhoto({ person }) {
  const [failed, setFailed] = useState(false);

  if (failed || !person.image) {
    return (
      <div
        className="monthly-photo monthly-photo-placeholder"
        role="img"
        aria-label={`${person.name} (photo coming soon)`}
      >
        <span>{getInitials(person.name)}</span>
      </div>
    );
  }

  return (
    <div className="monthly-photo">
      <img
        src={person.image}
        alt={person.name}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function MonthlySpotlight() {
  return (
    <section className="home-section monthly-section">
      <div className="centered-section-header">
        <p className="monthly-eyebrow">{spotlightMonth}</p>

        <h2 className="home-section-title">Spotlight of the Month</h2>

        <p className="home-section-description">
          Recognizing the people who make the UT SHPE familia
          what it is.
        </p>
      </div>

      <div className="monthly-grid">
        {spotlights.map((person) => (
          <article className="monthly-card" key={person.title}>
            <SpotlightPhoto person={person} />

            <div className="monthly-body">
              <p className="monthly-label">{person.title}</p>

              <h3 className="monthly-name">{person.name}</h3>

              <p className="monthly-major">{person.major}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MonthlySpotlight;