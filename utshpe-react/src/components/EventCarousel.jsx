import { useState } from "react";

const events = [
  "/assets/images/Home_Page/Snap.png",
  // Add additional event images here when you have them:
  // "/assets/images/Home_Page/Eventweek.png",
  // "/assets/images/Home_Page/Event1.png",
  // "/assets/images/Home_Page/Event2.png",
  // "/assets/images/Home_Page/Event3.png",
];

function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const previousSlide = () => {
    setCurrentIndex((current) =>
      current === 0 ? events.length - 1 : current - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((current) =>
      (current + 1) % events.length
    );
  };

  return (
    <section className="next-event">
      <h2 className="section-title">Upcoming Events</h2>

      <div
        className="event-carousel"
        tabIndex="0"
        aria-label="Upcoming events carousel"
      >
        <div
          className="event-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {events.map((event, index) => (
            <img
              key={event}
              src={event}
              alt={`Upcoming UT SHPE event ${index + 1}`}
            />
          ))}
        </div>

        {events.length > 1 && (
          <>
            <button
              className="carousel-btn prev"
              onClick={previousSlide}
              aria-label="Previous event"
            >
              &#10094;
            </button>

            <button
              className="carousel-btn next"
              onClick={nextSlide}
              aria-label="Next event"
            >
              &#10095;
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default EventCarousel;