import { useEffect, useRef, useState } from "react";
import { BL, html, OR, RD } from "../../../lib/design";
import useEvents, { eventColors, formatTime, localDay } from "../../../hooks/useEvents";
import useMediaQuery, { MOBILE } from "../../../hooks/useMediaQuery";
import Sticker from "../Sticker";

const MAX_CARDS = 12;
const EVI = [["star", BL], ["tower", OR], ["guitar", RD], ["flame", OR]];

/* a row of five navy bats over the section (hidden on phones) */
const BAT = "M0 3C-5-5-14-9-25-5C-18-2-16 3-15 8C-11 4-6 5-3 10L0 6L3 10C6 5 11 4 15 8C16 3 18-2 25-5C14-9 5-5 0 3Z";
const BATS = '<svg width="190" height="64" viewBox="0 0 190 64">' + [[0, 26, 0.8], [34, 6, 0.6], [62, 34, 0.7], [96, 12, 0.55], [126, 40, 0.5]].map((p) => '<path d="' + BAT + '" transform="translate(' + (p[0] + 26) + " " + (p[1] + 10) + ") scale(" + p[2] + ')" fill="#16316B" opacity=".6"/>').join("") + "</svg>";

/* the perforated date stamp in the card's corner (the design's stamp(c, wd, dd)) */
function DateStamp({ c, wd, dd }) {
  return (
    <svg width="76" height="92" viewBox="0 0 76 92" aria-hidden="true">
      <rect width="76" height="92" fill={c} />
      <rect x="9" y="9" width="58" height="74" fill="none" stroke="#16316B" strokeWidth="2" />
      <text x="38" y="30" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.6" fill="#16316B">{wd}</text>
      <text x="38" y="63" textAnchor="middle" fontFamily="Chango,serif" fontSize="27" fill="#16316B">{dd}</text>
      <rect x="2.5" y="2.5" width="71" height="87" fill="none" stroke="#fff" strokeWidth="7" strokeDasharray="0 9" strokeLinecap="round" />
    </svg>
  );
}

function EventCard({ event, i }) {
  const { dot, tint } = eventColors(event);
  const day = localDay(event.calendar_start);
  const [icon, color] = EVI[i % 4];
  const meta = formatTime(event.calendar_start) + (event.location ? " · " + event.location : "");
  return (
    <a className="card" href="#calendar" style={{ position: "relative" }}>
      <div className="tp"><div className="k"><i style={{ background: dot }}></i>{event.event_type || "Event"}</div><DateStamp c={tint} wd={day.wd} dd={day.d} /></div>
      <h3>{event.title}</h3>
      <div className="m">{meta}</div>
      <Sticker name={icon} color={color} rot={i % 2 ? -8 : 8} style={{ right: 18, bottom: 18 }} />
    </a>
  );
}

/* phones: the cards page sideways, four at a time, with page dots underneath */
function PagerDots({ cardsRef, count }) {
  const [page, setPage] = useState(0);
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;
    const upd = () => setPage(Math.round(cards.scrollLeft / Math.max(1, cards.clientWidth)));
    upd();
    cards.addEventListener("scroll", upd, { passive: true });
    return () => cards.removeEventListener("scroll", upd);
  }, [cardsRef, count]);
  const n = Math.ceil(count / 4);
  return <div className="evdots">{Array.from({ length: n }, (_, i) => <i key={i} className={i === page ? "on" : undefined}></i>)}</div>;
}

export default function EventsRow() {
  const { events, status } = useEvents();
  const mobile = useMediaQuery(MOBILE);
  const cardsRef = useRef(null);
  const [now] = useState(() => Date.now());
  const upcoming = events.filter((e) => new Date(e.calendar_start).getTime() >= now).slice(0, MAX_CARDS);

  return (
    <section className="sec alt" id="events" style={{ position: "relative" }}>
      <div className="hd" data-r><div><div className="kick">this week in Austin</div><h2>Upcoming Events</h2></div><div className="rt"><a className="btn" href="#calendar">View Calendar</a></div></div>
      <div className="cards" id="cards" data-r ref={cardsRef}>
        {upcoming.map((e, i) => <EventCard key={e.id} event={e} i={i} />)}
        {status !== "loading" && upcoming.length === 0 ? (
          <div className="card"><h3>{status === "error" ? "Events couldn't load right now." : "No upcoming events yet."}</h3><div className="m">Check the calendar below, or check back soon.</div></div>
        ) : null}
      </div>
      {mobile ? <PagerDots cardsRef={cardsRef} count={upcoming.length} /> : null}
      <div className="dec" aria-hidden="true" style={{ position: "absolute", pointerEvents: "none", left: 480, top: 44 }} dangerouslySetInnerHTML={html(BATS)} />
    </section>
  );
}
