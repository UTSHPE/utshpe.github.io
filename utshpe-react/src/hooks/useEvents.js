import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/*
 * All live events, fetched once and shared by Upcoming Events and the calendar.
 * The table is small (about a hundred rows a year), so one request covers every month.
 */
let request = null;

function fetchEvents() {
  if (!request) {
    request = supabase
      .from("events")
      .select("id, title, location, event_type, secondary_event_type, calendar_start, calendar_end, is_open")
      .is("deleted_at", null)
      .order("calendar_start", { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        return data || [];
      });
    request.catch(() => { request = null; });
  }
  return request;
}

export default function useEvents() {
  const [state, setState] = useState({ events: [], status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchEvents()
      .then((events) => { if (!cancelled) setState({ events, status: "ready" }); })
      .catch((err) => {
        console.error("Error loading events:", err);
        if (!cancelled) setState({ events: [], status: "error" });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}

/*
 * The design's event categories and their dot / stamp colors, keyed by the
 * event_type values the events table uses.
 */
const CATEGORY = {
  community: ["#74ABC2", "#CFE6EF"],
  professional: ["#F26838", "#FBD3C0"],
  mentorship: ["#D33E26", "#F4C5BD"],
  academic: ["#1272B8", "#CFE6EF"],
  service: ["#D33E26", "#F4C5BD"],
  technical: ["#1272B8", "#CFE6EF"],
  social: ["#F26838", "#FBD3C0"],
};
const TYPE_TO_CATEGORY = [
  [/professional|vpe|vpi/i, "professional"],
  [/academic/i, "academic"],
  [/outreach|service|volunteer/i, "service"],
  [/leadership|mentor/i, "mentorship"],
  [/technical/i, "technical"],
  [/chapter|general meeting/i, "community"],
];

export function eventColors(event) {
  const type = event.event_type || "";
  const hit = TYPE_TO_CATEGORY.find(([re]) => re.test(type));
  const [dot, tint] = CATEGORY[hit ? hit[1] : "social"];
  return { dot, tint };
}

const TZ = "America/Chicago";

/* "7:00 PM" */
export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
}

/* "6pm" / "6:30pm", as the design's calendar writes times */
export function shortTime(iso) {
  const parts = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ }).formatToParts(new Date(iso));
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const m = get("minute");
  return get("hour") + (m && m !== "00" ? ":" + m : "") + (get("dayPeriod") || "").toLowerCase();
}

/* { y, m, d, wd } of the event's start, in Austin time */
export function localDay(iso) {
  const parts = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "numeric", day: "numeric", weekday: "short", timeZone: TZ }).formatToParts(new Date(iso));
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return { y: +get("year"), m: +get("month") - 1, d: +get("day"), wd: get("weekday").toUpperCase() };
}
