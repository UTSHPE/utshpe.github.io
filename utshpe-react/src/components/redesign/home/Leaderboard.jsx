import { useEffect, useState } from "react";
import { BL, html, icon, RD } from "../../../lib/design";
import { LEADERBOARD_URL } from "../../../lib/constants";
import useLeaderboard, { getInitials } from "../../../hooks/useLeaderboard";

const TINTS = ["#CFE6EF", "#FBD3C0", "#F4C5BD", "#DCEBF2"];

/* 1st gets an orange star; 2nd a blue horseshoe; 3rd a red boot */
function Badge({ cls }) {
  if (cls === "p1") {
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", margin: "0 auto 6px" }}>
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z" fill="#F26838" />
      </svg>
    );
  }
  return <div style={{ height: 40, margin: "0 auto 6px", width: 40 }} dangerouslySetInnerHTML={html(cls === "p2" ? icon("horseshoe", BL, 36) : icon("boot", RD, 36))} />;
}

function Pod({ m, cls }) {
  return (
    <div className={"pod " + cls}>
      <Badge cls={cls} />
      <div className="av">{m.name.trim().charAt(0).toUpperCase()}</div>
      <div className="nm">{m.name}</div>
      <div className="pts">{m.points}</div>
      <div className="evn">{m.events} events</div>
      <div className="ped">{m.rank}</div>
    </div>
  );
}

export default function Leaderboard() {
  const { members, status } = useLeaderboard();
  const [barsOn, setBarsOn] = useState(false);
  useEffect(() => {
    if (status !== "ready") return;
    const t = setTimeout(() => setBarsOn(true), 60);
    return () => clearTimeout(t);
  }, [status]);

  const rows = [...members].sort((a, b) => a.rank - b.rank);
  const maxP = Math.max(1, ...rows.map((r) => r.points));
  const [first, second, third] = rows;

  return (
    <section className="sec" id="leaderboard">
      <div className="center" data-r>
        <div className="kick">2026-2027</div><div className="h2">Leaderboard</div>
      </div>
      <div className="podium" id="podium" data-r>
        {second ? <Pod m={second} cls="p2" /> : <div></div>}
        {first ? <Pod m={first} cls="p1" /> : <div></div>}
        {third ? <Pod m={third} cls="p3" /> : <div></div>}
      </div>
      <div className="lbrows" id="lbrows" data-r>
        {rows.slice(3).map((r, k) => (
          <div className="lr" key={r.rank}>
            <div className="rk">{r.rank}</div>
            <div className="who"><span className="a" style={{ background: TINTS[k % 4] }}>{getInitials(r.name)}</span>{r.name}</div>
            <div className="e">{r.events} events</div>
            <div className="pt"><b>{r.points}</b><div className="bar"><i style={{ width: barsOn ? Math.round(r.points / maxP * 100) + "%" : 0 }}></i></div></div>
          </div>
        ))}
        {status === "loading" ? <div className="lr"><div></div><div className="who">Loading the leaderboard…</div></div> : null}
        {status === "error" ? <div className="lr"><div></div><div className="who">Couldn't load the leaderboard right now. Check back soon.</div></div> : null}
        {status === "ready" && rows.length === 0 ? <div className="lr"><div></div><div className="who">No points recorded yet this semester.</div></div> : null}
      </div>
      <div className="lbmore"><a className="btn" href={LEADERBOARD_URL} target="_blank" rel="noopener">View full leaderboard &amp; check in</a></div>
    </section>
  );
}
