// Supabase Edge Function: flickr-slideshow
//
// Returns this week's 10 photos for the home page hero slideshow:
//   { week: "2026-W41", photos: [{ id, src, title, pageUrl }] }
//
// The pool is every public photo taken in the last 6 months. The 10 are
// picked with a shuffle seeded by the ISO week in America/Chicago time,
// so every visitor sees the same set all week and it changes every Monday.
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
const LOOKBACK_MONTHS = 6;
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

// ISO 8601 week ("2026-W41") for the current date in Chicago,
// so the set rolls over at midnight Monday local time.
function currentIsoWeek(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  // Work on the Chicago calendar date as a UTC date to avoid DST shifts.
  const date = new Date(Date.UTC(get("year"), get("month") - 1, get("day")));

  // Move to the Thursday of this week; its year is the ISO year.
  const dayOfWeek = date.getUTCDay() || 7; // Mon = 1 ... Sun = 7
  date.setUTCDate(date.getUTCDate() + 4 - dayOfWeek);

  const isoYear = date.getUTCFullYear();
  const yearStart = Date.UTC(isoYear, 0, 1);
  const week = Math.ceil(((date.getTime() - yearStart) / 86_400_000 + 1) / 7);

  return `${isoYear}-W${String(week).padStart(2, "0")}`;
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

async function searchPhotos(
  apiKey: string,
  userId: string,
  dateFilter: "min_taken_date" | "min_upload_date",
  since: number,
): Promise<FlickrPhoto[]> {
  const photos: FlickrPhoto[] = [];

  for (let page = 1; ; page++) {
    const params = new URLSearchParams({
      method: "flickr.photos.search",
      api_key: apiKey,
      user_id: userId,
      [dateFilter]: String(since),
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

async function buildSlideshow(week: string): Promise<Slideshow> {
  const apiKey = Deno.env.get("FLICKR_API_KEY");
  const userId = Deno.env.get("FLICKR_USER_ID");

  if (!apiKey || !userId) {
    throw new Error("FLICKR_API_KEY and FLICKR_USER_ID must be set.");
  }

  const since = new Date();
  since.setMonth(since.getMonth() - LOOKBACK_MONTHS);
  const sinceSeconds = Math.floor(since.getTime() / 1000);

  const byId = new Map<string, FlickrPhoto>();
  const addAll = (photos: FlickrPhoto[]) => {
    for (const photo of photos) {
      if (!byId.has(photo.id)) byId.set(photo.id, photo);
    }
  };

  addAll(await searchPhotos(apiKey, userId, "min_taken_date", sinceSeconds));

  // Camera dates can be missing or wrong; fall back to upload date.
  if (byId.size < PHOTOS_PER_WEEK) {
    addAll(await searchPhotos(apiKey, userId, "min_upload_date", sinceSeconds));
  }

  // Sort by id first so the seeded shuffle doesn't depend on the
  // order Flickr happened to return results in.
  const pool = [...byId.values()]
    .filter(isUsable)
    .sort((a, b) => a.id.localeCompare(b.id));

  const photos = seededShuffle(pool, hashString(week))
    .slice(0, PHOTOS_PER_WEEK)
    .map((photo) => ({
      id: photo.id,
      src: (photo.url_l || photo.url_c) as string,
      title: photo.title ?? "",
      pageUrl: `https://www.flickr.com/photos/${userId}/${photo.id}`,
    }));

  return { week, photos };
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

  const week = currentIsoWeek();

  try {
    if (!cache || cache.week !== week || Date.now() >= cache.expiresAt) {
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
