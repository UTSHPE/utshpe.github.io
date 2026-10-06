import thisWeek, { FLICKR_PROFILE_URL } from "../data/thisWeek";
import "../styles/this-week-collage.css";

// The bento layout is designed for 3 to 6 tiles.
const MAX_TILES = 6;

function ThisWeekCollage() {
  const entries = thisWeek.slice(0, MAX_TILES);

  if (entries.length === 0) return null;

  return (
    <section className="home-section this-week-section">

      <div className="centered-section-header">

        <h2 className="home-section-title">
          This Week in SHPE
        </h2>

        <p className="home-section-description">
          A look at what the familia has been up to.
        </p>

      </div>


      <div
        className="this-week-grid"
        data-count={entries.length}
      >
        {entries.map((entry) => (
          <figure
            className="this-week-tile"
            key={`${entry.image}-${entry.caption}`}
          >
            <img
              src={entry.image}
              alt={entry.caption}
              loading="lazy"
              style={
                entry.focus
                  ? { objectPosition: entry.focus }
                  : undefined
              }
            />

            <figcaption className="this-week-caption">

              {entry.pillar && (
                <span className="this-week-pillar">
                  {entry.pillar}
                </span>
              )}

              <span className="this-week-caption-text">
                {entry.caption}
              </span>

            </figcaption>
          </figure>
        ))}
      </div>


      <div className="this-week-actions">
        <a
          className="btn"
          href={FLICKR_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          See More of Us
        </a>
      </div>

    </section>
  );
}

export default ThisWeekCollage;
