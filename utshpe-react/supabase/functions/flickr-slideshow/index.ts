// Supabase Edge Function: flickr-slideshow
//
// Returns this week's 10 photos for the home page hero slideshow:
//   { week: "2026-W41", photos: [{ id, src, title, pageUrl }] }
//
// The pool is every public photo taken in the 2.5 weeks before this week's
// Monday (00:00 America/Chicago) and uploaded before that Monday. Photos
// uploaded mid-week join the pool the following week, so the set can't
// change partway through a week. If that finds fewer than 10 photos, the
// window widens to 6 weeks, then 3 months, then 6 months.
//
// The 10 are picked with a shuffle seeded by the ISO week, so every
// visitor sees the same set all week and it changes every Monday.
// Tag a photo `nowebsite` on Flickr to keep it out of the slideshow.
//
// Secrets (set with `supabase secrets set`, never commit them):
//   FLICKR_API_KEY   required
//   FLICKR_USER_ID   required (201375415@N03)

// Deno + Edge Runtime types (gives the editor `Deno`, `Request`, etc.)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FLICKR_ENDPOINT = "https://api.flickr.com/services/rest/";
const PER_PAGE = 500;
const MAX_PHOTOS = 4000; // Flickr search stops returning results past this
const PHOTOS_PER_WEEK = 10;
const LOOKBACK_DAYS = 17.5; // 2.5 weeks before this week's Monday

// Wider windows, tried in order only if the 2.5-week window has
// fewer than PHOTOS_PER_WEEK usable photos.
const FALLBACK_LOOKBACKS: Lookback[] = [
  { days: 42 }, // 6 weeks
  { months: 3 },
  { months: 6 },
];
const EXCLUDE_TAG = "nowebsite";
const TIME_ZONE = "America/Chicago";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const ALLOWED_ORIGINS = new Set([
  "https://utshpe.us",
  "http://localhost:5173",
]);

type FlickrPhoto = {
  id: string;
  title?: string;
  tags?: string;
  url_l?: string;
  url_c?: string;
};

type SlideshowPhoto = {
  id: string;
  src: string;
  title: string;
  pageUrl: string;
};

type Lookback = { days: number } | { months: number };

type Slideshow = {
  week: string;
  photos: SlideshowPhoto[];
};

// Module memory survives between requests while the instance is warm.
let cache: (Slideshow & { expiresAt: number }) | null = null;

/* ================================
   CORS
================================ */

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
    },
  });
}

/* ================================
   WEEK + SEEDED SHUFFLE
================================ */

// Calendar date (year, month 1-12, day) at `instant` in Chicago.
function chicagoDate(instant: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

// The UTC instant of 00:00 Chicago time on the given calendar date.
function chicagoMidnight(year: number, month: number, day: number): Date {
  const guess = Date.UTC(year, month - 1, day);
  const local = chicagoDate(new Date(guess));
  const asUtc = Date.UTC(
    local.year,
    local.month - 1,
    local.day,
    local.hour,
    local.minute,
    local.second,
  );

  // asUtc - guess is Chicago's UTC offset at that moment (e.g. -5h).
  return new Date(guess - (asUtc - guess));
}

/*
 * The current ISO 8601 week ("2026-W41") and the instant it started
 * (Monday 00:00 in Chicago), so the set rolls over at local midnight.
 */
function currentWeek(now = new Date()): { label: string; start: Date } {
  const today = chicagoDate(now);

  // Work on the Chicago calendar date as a UTC date to avoid DST shifts.
  const date = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const dayOfWeek = date.getUTCDay() || 7; // Mon = 1 ... Sun = 7

  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() - (dayOfWeek - 1));

  // The Thursday of this week decides the ISO year.
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + 4 - dayOfWeek);

  const isoYear = thursday.getUTCFullYear();
  const yearStart = Date.UTC(isoYear, 0, 1);
  const week = Math.ceil(
    ((thursday.getTime() - yearStart) / 86_400_000 + 1) / 7,
  );

  return {
    label: `${isoYear}-W${String(week).padStart(2, "0")}`,
    start: chicagoMidnight(
      monday.getUTCFullYear(),
      monday.getUTCMonth() + 1,
      monday.getUTCDate(),
    ),
  };
}

function windowStart(weekStart: Date, lookback: Lookback): Date {
  if ("days" in lookback) {
    return new Date(weekStart.getTime() - lookback.days * 86_400_000);
  }

  const start = new Date(weekStart);
  start.setUTCMonth(start.getUTCMonth() - lookback.months);
  return start;
}

// FNV-1a: turns the week label into a 32-bit seed.
function hashString(value: string): number {
  let hash = 0x811c9dc5;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const random = mulberry32(seed);
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/* ================================
   FLICKR
================================ */

function toUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

async function searchPhotos(
  apiKey: string,
  userId: string,
  dateFilter: "min_taken_date" | "min_upload_date",
  since: Date,
  uploadedBefore: Date,
): Promise<FlickrPhoto[]> {
  const photos: FlickrPhoto[] = [];

  for (let page = 1; ; page++) {
    const params = new URLSearchParams({
      method: "flickr.photos.search",
      api_key: apiKey,
      user_id: userId,
      [dateFilter]: String(toUnixSeconds(since)),
      max_upload_date: String(toUnixSeconds(uploadedBefore)),
      media: "photos",
      privacy_filter: "1",
      safe_search: "1",
      per_page: String(PER_PAGE),
      page: String(page),
      extras: "url_l,url_c,title,tags,date_taken",
      format: "json",
      nojsoncallback: "1",
    });

    const response = await fetch(`${FLICKR_ENDPOINT}?${params}`);

    if (!response.ok) {
      throw new Error(`Flickr responded with HTTP ${response.status}.`);
    }

    const data = await response.json();

    if (data.stat !== "ok") {
      throw new Error(`Flickr error ${data.code}: ${data.message}`);
    }

    const pagePhotos: FlickrPhoto[] = data.photos?.photo ?? [];
    photos.push(...pagePhotos);

    const totalPages = Number(data.photos?.pages) || 0;

    if (
      pagePhotos.length === 0 ||
      page >= totalPages ||
      photos.length >= MAX_PHOTOS
    ) {
      break;
    }
  }

  return photos.slice(0, MAX_PHOTOS);
}

function isUsable(photo: FlickrPhoto): boolean {
  if (!photo.url_l && !photo.url_c) return false;

  const tags = (photo.tags ?? "").toLowerCase().split(/\s+/);
  return !tags.includes(EXCLUDE_TAG);
}

// Usable photos in one window, de-duplicated by id.
async function findPhotos(
  apiKey: string,
  userId: string,
  since: Date,
  uploadedBefore: Date,
): Promise<FlickrPhoto[]> {
  const byId = new Map<string, FlickrPhoto>();
  const addAll = (photos: FlickrPhoto[]) => {
    for (const photo of photos) {
      if (isUsable(photo) && !byId.has(photo.id)) byId.set(photo.id, photo);
    }
  };

  addAll(
    await searchPhotos(apiKey, userId, "min_taken_date", since, uploadedBefore),
  );

  // Camera dates can be missing or wrong; fall back to upload date.
  if (byId.size < PHOTOS_PER_WEEK) {
    addAll(
      await searchPhotos(apiKey, userId, "min_upload_date", since, uploadedBefore),
    );
  }

  return [...byId.values()];
}

async function buildSlideshow(
  week: { label: string; start: Date },
): Promise<Slideshow> {
  const apiKey = Deno.env.get("FLICKR_API_KEY");
  const userId = Deno.env.get("FLICKR_USER_ID");

  if (!apiKey || !userId) {
    throw new Error("FLICKR_API_KEY and FLICKR_USER_ID must be set.");
  }

  const lookbacks: Lookback[] = [
    { days: LOOKBACK_DAYS },
    ...FALLBACK_LOOKBACKS,
  ];

  let found: FlickrPhoto[] = [];

  // Start with 2.5 weeks and widen only if there aren't enough photos.
  for (const lookback of lookbacks) {
    found = await findPhotos(
      apiKey,
      userId,
      windowStart(week.start, lookback),
      week.start,
    );

    if (found.length >= PHOTOS_PER_WEEK) break;
  }

  // Sort by id first so the seeded shuffle doesn't depend on the
  // order Flickr happened to return results in.
  const pool = found.sort((a, b) => a.id.localeCompare(b.id));

  const photos = seededShuffle(pool, hashString(week.label))
    .slice(0, PHOTOS_PER_WEEK)
    .map((photo) => ({
      id: photo.id,
      src: (photo.url_l || photo.url_c) as string,
      title: photo.title ?? "",
      pageUrl: `https://www.flickr.com/photos/${userId}/${photo.id}`,
    }));

  return { week: week.label, photos };
}

/* ================================
   HANDLER
================================ */

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  const week = currentWeek();

  try {
    if (!cache || cache.week !== week.label || Date.now() >= cache.expiresAt) {
      const slideshow = await buildSlideshow(week);
      cache = { ...slideshow, expiresAt: Date.now() + CACHE_TTL_MS };
    }

    return json({ week: cache.week, photos: cache.photos }, 200, origin);
  } catch (err) {
    console.error("flickr-slideshow:", err);

    // Serve the last good set rather than nothing if Flickr is briefly down.
    if (cache) {
      return json({ week: cache.week, photos: cache.photos }, 200, origin);
    }

    return json({ error: "Unable to load photos" }, 502, origin);
  }
});
