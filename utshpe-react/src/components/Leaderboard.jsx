
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/leaderboard.css";

const TOP_N = 15;

function formatName(member) {
  return [member.first_name, member.last_name].filter(Boolean).join(" ");
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/*
 * sign_ins has one row per event a member checked into.
 *
 * We:
 *  1. Pull all live sign-ins with their submission time.
 *  2. Sort sign-ins chronologically.
 *  3. Calculate each member's total points.
 *  4. Record the time at which each member reached their FINAL total.
 *  5. Rank primarily by points (highest first).
 *  6. Break ties by who reached that point total FIRST.
 *
 * Example:
 *
 * Alice:
 *   5 pts @ 6:00
 *   5 pts @ 7:00
 *   5 pts @ 8:00
 *   Total = 15
 *
 * Bob:
 *   10 pts @ 6:30
 *   5 pts  @ 8:30
 *   Total = 15
 *
 * Alice ranks above Bob because Alice reached 15 points
 * at 8:00, while Bob reached 15 points at 8:30.
 */
async function fetchLeaderboard() {
  const { data: signIns, error: signInsError } = await supabase
    .from("sign_ins")
    .select("eid, points_earned, created_at")
    .is("deleted_at", null);

  if (signInsError) throw signInsError;

  /*
   * Sort all sign-ins from earliest to latest.
   *
   * This is important because created_at determines when
   * someone reached a particular point total.
   */
  const sortedSignIns = [...(signIns || [])].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
  );

  /*
   * Keep track of:
   *
   * totals:
   *   Current total points for each member.
   *
   * finalPointTime:
   *   The timestamp at which the member reached their
   *   final point total.
   */
  const totals = new Map();
  const finalPointTime = new Map();

  for (const row of sortedSignIns) {
    if (!row.eid) continue;

    const points = Number(row.points_earned) || 0;

    const newTotal = (totals.get(row.eid) || 0) + points;

    totals.set(row.eid, newTotal);

    /*
     * Because we're processing chronologically, every time
     * we update this value we're moving forward in time.
     *
     * After all sign-ins are processed, this represents
     * the time at which the member reached their FINAL total.
     */
    finalPointTime.set(row.eid, new Date(row.created_at).getTime());
  }

  /*
   * Convert totals into an array and rank them.
   *
   * Primary sort:
   *   More points = higher rank
   *
   * Tie-break:
   *   Earlier time reaching the final point total = higher rank
   */
  const rankedEids = [...totals.entries()]
    .sort((a, b) => {
      const pointsA = a[1];
      const pointsB = b[1];

      // Primary ranking: highest points first
      if (pointsA !== pointsB) {
        return pointsB - pointsA;
      }

      // Tie-break: whoever reached that total first
      const timeA = finalPointTime.get(a[0]) ?? Infinity;
      const timeB = finalPointTime.get(b[0]) ?? Infinity;

      return timeA - timeB;
    })
    .slice(0, TOP_N)
    .map(([eid]) => eid);

  if (rankedEids.length === 0) return [];

  /*
   * Fetch member information for the ranked EIDs.
   */
  const { data: members, error: membersError } = await supabase
    .from("members")
    .select('eid, first_name, last_name, major, "Class"')
    .in("eid", rankedEids);

  if (membersError) throw membersError;

  const memberByEid = new Map(members.map((m) => [m.eid, m]));

  /*
   * rankedEids is already sorted correctly, so assign
   * the leaderboard rank based on its array position.
   */
  return rankedEids.map((eid, index) => {
    const member = memberByEid.get(eid);

    return {
      rank: index + 1,
      name: member ? formatName(member) : eid,
      major: member?.major || "",
      year: member?.Class || "",
      points: totals.get(eid),

      // Keep this available in case you want to display
      // the tie-break information later.
      pointReachedAt: finalPointTime.get(eid),
    };
  });
}

function useLeaderboardData() {
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    fetchLeaderboard()
      .then((data) => {
        if (cancelled) return;

        setMembers(data);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load leaderboard:", err);

        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { members, status };
}

function PodiumCard({ member, place }) {
  return (
    <div className={`podium-card place-${place}`}>
      <span className="podium-rank">{place}</span>

      <span className="podium-avatar">
        {getInitials(member.name)}
      </span>

      <h3 className="podium-name">{member.name}</h3>

      <p className="podium-major">{member.major}</p>

      <span className="podium-points">
        {member.points} pts
      </span>
    </div>
  );
}

function LeaderboardRow({ member }) {
  return (
    <li className="leaderboard-row">
      <span className="row-rank">{member.rank}</span>

      <span className="row-avatar">
        {getInitials(member.name)}
      </span>

      <div className="row-info">
        <span className="row-name">{member.name}</span>

        <span className="row-meta">
          {member.major}
          {member.year ? ` · ${member.year}` : ""}
        </span>
      </div>

      <span className="row-points">
        {member.points} pts
      </span>
    </li>
  );
}

function Leaderboard() {
  const { members, status } = useLeaderboardData();

  const sorted = [...members].sort((a, b) => a.rank - b.rank);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  // Reorder top 3 for podium display: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <section className="leaderboard-section" id="leaderboard">
      <div className="leaderboard-header">
        <h2 className="h2">Leaderboard</h2>
      </div>

      {status === "loading" && (
        <p className="leaderboard-status">
          Loading leaderboard…
        </p>
      )}

      {status === "error" && (
        <p className="leaderboard-status">
          Couldn&apos;t load the leaderboard right now. Check back soon.
        </p>
      )}

      {status === "ready" && members.length === 0 && (
        <p className="leaderboard-status">
          No points recorded yet this semester.
        </p>
      )}

      {status === "ready" && podiumOrder.length > 0 && (
        <div className="podium-grid">
          {podiumOrder.map((member) => (
            <PodiumCard
              key={member.eid || member.rank}
              member={member}
              place={member.rank}
            />
          ))}
        </div>
      )}

      {status === "ready" && rest.length > 0 && (
        <ol className="leaderboard-list">
          {rest.map((member) => (
            <LeaderboardRow
              key={member.eid || member.rank}
              member={member}
            />
          ))}
        </ol>
      )}

      <a
        className="leaderboard-cta"
        href="https://top-12-website.vercel.app/leaderboard"
        target="_blank"
        rel="noopener noreferrer"
      >
        View full leaderboard &amp; check in
      </a>
    </section>
  );
}

export default Leaderboard;

