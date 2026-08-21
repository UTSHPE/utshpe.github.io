import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/upcoming-events.css";

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);

      try {
        const now = new Date().toISOString();

        const { data, error } = await supabase
          .from("events")
          .select(`
            id,
            title,
            location,
            event_type,
            secondary_event_type,
            calendar_start,
            calendar_end,
            is_open,
            deleted_at
          `)
          .is("deleted_at", null)
          .gte("calendar_start", now)
          .order("calendar_start", {
            ascending: true,
          })
          .limit(10);

        if (error) {
          console.error("Error loading events:", error);
          setError(error.message);
          setEvents([]);
          return;
        }

        console.log("Upcoming events:", data);

        setEvents(data || []);
      } catch (err) {
        console.error("Unexpected error loading events:", err);
        setError("Unable to load upcoming events.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(dateString) {
    const date = new Date(dateString);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatEventType(event) {
    if (
      event.secondary_event_type &&
      event.secondary_event_type.trim() !== ""
    ) {
      return `${event.event_type} • ${event.secondary_event_type}`;
    }

    return event.event_type;
  }

  if (loading) {
    return (
      <div className="upcoming-events">
        <div className="events-loading">
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="upcoming-events">
        <div className="events-error">
          Unable to load upcoming events.
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="upcoming-events">
        <div className="events-empty">
          No upcoming events at this time.
        </div>
      </div>
    );
  }

  const visibleEvents = showAll
    ? events.slice(0, 10)
    : events.slice(0, 3);

  return (
    <div className="upcoming-events">

      <div className="events-list">
        {visibleEvents.map((event) => (
          <article
            className="upcoming-event-card"
            key={event.id}
          >
            <div className="event-date">
              <span className="event-date-day">
                {new Date(event.calendar_start).getDate()}
              </span>

              <span className="event-date-month">
                {new Date(event.calendar_start).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                  }
                )}
              </span>
            </div>

            <div className="event-details">

              <h3 className="event-title">
                {event.title}
              </h3>

              <div className="event-meta">
                <span>
                  {formatDate(event.calendar_start)}
                </span>

                <span className="event-separator">
                  •
                </span>

                <span>
                  {formatTime(event.calendar_start)}
                </span>
              </div>

              <div className="event-location">
                📍 {event.location}
              </div>

              {event.event_type && (
                <div className="event-type">
                  {formatEventType(event)}
                </div>
              )}

            </div>
          </article>
        ))}
      </div>

      {events.length > 3 && (
        <button
          className="events-expand-button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? "Show Less"
            : `Show More Events (${Math.min(events.length, 10)})`}
        </button>
      )}

    </div>
  );
}

export default UpcomingEvents;