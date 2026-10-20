import { useMemo, useState } from "react";
import { GOOGLE_CALENDAR_URL } from "../../../lib/constants";
import useEvents, { eventColors, localDay, shortTime } from "../../../hooks/useEvents";
import useMediaQuery, { MOBILE } from "../../../hooks/useMediaQuery";

const MN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOT = ["#74ABC2", "#D33E26", "#F26838", "#1272B8"];

/* the design's sample events: only used if the events table can't be reached */
function evs(d) {
  const wd = d.getDay(), wk = Math.floor((d.getDate() - 1) / 7), o = [];
  if (wd === 1) { o.push(["6pm Study Night", 0]); if (wk % 2 === 0) o.unshift(["3pm GM Lunch & Learn", 2]); }
  if (wd === 2 && wk % 2 === 0) o.push(["5pm Portfolio Workshop", 2]);
  if (wd === 3) { if (wk % 2 === 0) o.push(["6:30pm General Meeting", 0]); else o.push(["9am Info Session", 2]); }
  if (wd === 4) { if (wk % 2 === 1) o.push(["12pm Company Visit", 3]); o.push(["8pm IM Game", 0]); }
  if (wd === 5 && wk >= 2) o.push(["2pm Tech Talk", 2]);
  if (wd === 6 && wk % 2 === 1) o.push(["10am Volunteer Day", 3]);
  if (wd === 0 && wk % 2 === 0) o.push(["6pm IM Volleyball", 0]);
  if (wd === 2 && wk === 1) o.push(["6:30pm Mentorship Dinner", 1]);
  return o.map(([text, c]) => ({ text, color: DOT[c] }));
}

const key = (y, m, d) => y + "-" + m + "-" + d;
const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function Calendar() {
  const { events, status } = useEvents();
  const mobile = useMediaQuery(MOBILE);
  const [today] = useState(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; });
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [picked, setPicked] = useState(null); // { view: month key, date }

  const sample = status === "error";
  const byDay = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      const d = localDay(e.calendar_start), k = key(d.y, d.m, d.d);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push({ text: shortTime(e.calendar_start) + " " + e.title, color: eventColors(e).dot });
    }
    return map;
  }, [events]);
  const dayEvents = (d) => (sample ? evs(d) : byDay.get(key(d.getFullYear(), d.getMonth(), d.getDate())) || []);

  // the grid: from the Sunday before the 1st, five or six weeks
  const cells = [];
  const start = new Date(view); start.setDate(1 - view.getDay());
  for (let i = 0; i < 42; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    if (i >= 35 && d.getMonth() !== view.getMonth()) break;
    cells.push(d);
  }

  // phones: tap a day to read it; defaults to today, else the first day with events
  const viewKey = view.getFullYear() + "-" + view.getMonth();
  const fallback = cells.find((d) => same(d, today)) || cells.find((d) => d.getMonth() === view.getMonth() && dayEvents(d).length);
  const sel = picked && picked.view === viewKey ? picked.date : fallback;
  const label = (d) => (d.getDate() === 1 ? MN[d.getMonth()].slice(0, 3) + " 1" : d.getDate());

  const go = (v) => { setView(v); setPicked(null); };

  return (
    <section className="sec" id="calendar">
      <div className="center" data-r>
        <div className="kick">mark your calendar</div><div className="h2">UT SHPE Calendar</div>
        <p className="sub">Keep up with meetings, professional events, socials, and everything happening throughout the semester.</p>
      </div>
      <div className="cal" data-r>
        <div className="ct">
          <button id="td" onClick={() => go(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</button>
          <button className="ar" id="pv" aria-label="Previous month" onClick={() => go(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>‹</button>
          <button className="ar" id="nx" aria-label="Next month" onClick={() => go(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>›</button>
          <div className="mo" id="mo">{MN[view.getMonth()] + " " + view.getFullYear()}</div>
          <button className="vw">Month ▾</button>
        </div>
        <div className="dow"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div>
        <div className="cg" id="cg">
          {cells.map((d) => {
            const cls = "cd" + (d.getMonth() !== view.getMonth() ? " out" : "") + (same(d, today) ? " today" : "") + (mobile && sel && same(d, sel) ? " sel" : "");
            return (
              <div key={d.getTime()} className={cls} onClick={mobile ? () => setPicked({ view: viewKey, date: d }) : undefined}>
                <span className="n">{label(d)}</span>
                {dayEvents(d).map((e, i) => <div key={i} className="ev" title={e.text}><i style={{ background: e.color }}></i><span>{e.text}</span></div>)}
              </div>
            );
          })}
        </div>
        {mobile ? (
          <div className="cday">
            {sel ? (
              <>
                <b>{sel.getDate() === 1 ? label(sel) : MN[view.getMonth()] + " " + sel.getDate()}</b>
                {dayEvents(sel).length ? dayEvents(sel).map((e, i) => <div key={i}><i style={{ background: e.color }}></i>{e.text}</div>) : <p>Nothing scheduled.</p>}
              </>
            ) : null}
          </div>
        ) : null}
        <div className="cf">
          <div><b>UT-SHPE</b><a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener">Add to Google Calendar</a></div>
          {sample ? <span style={{ fontSize: 13, color: "rgba(10,35,80,.55)" }}>Sample events</span> : null}
        </div>
      </div>
    </section>
  );
}
