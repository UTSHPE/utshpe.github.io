import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/* Moved from the old components/Leaderboard.jsx; the ranking logic is unchanged. */
const TOP_N = 15;

function formatName(member) {
  return [member.first_name, member.last_name].filter(Boolean).join(" ");
}

export function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/*
 * Supabase/PostgREST caps a single response at 1000 rows, so a plain
 * select() silently drops everything past that — which made the
 * leaderboard freeze on stale totals once sign_ins outgrew 1000 rows.
 *
 * Page through the table instead so every sign-in is counted. We order
 * by created_at with id as a stable tie-break so the pages don't
 * overlap or skip rows between requests.
 */
const PAGE_SIZE = 1000;

async function fetchAllSignIns() {
  const rows = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("sign_ins")
      .select("eid, points_earned, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    rows.push(...data);

    // A short page means we've reached the end of the table.
    if (data.length < PAGE_SIZE) break;
  }

  return rows;
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
  const signIns = await fetchAllSignIns();

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

  // One sign-in row per event, so the row count is the events attended.
  const eventCounts = new Map();

  for (const row of sortedSignIns) {
    if (!row.eid) continue;

    const points = Number(row.points_earned) || 0;

    const newTotal = (totals.get(row.eid) || 0) + points;

    totals.set(row.eid, newTotal);
    eventCounts.set(row.eid, (eventCounts.get(row.eid) || 0) + 1);

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
      events: eventCounts.get(eid) || 0,

      // Keep this available in case you want to display
      // the tie-break information later.
      pointReachedAt: finalPointTime.get(eid),
    };
  });
}

export default function useLeaderboard() {
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
