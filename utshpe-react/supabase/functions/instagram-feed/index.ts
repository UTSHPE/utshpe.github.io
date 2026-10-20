// Supabase Edge Function: instagram-feed
//
// Returns @utshpe's newest Instagram posts for the Membership page:
//   { posts: [{ id, image, caption, permalink, timestamp, type }] }
//
// Uses the official Instagram API (Instagram API with Instagram Login), which needs
// @utshpe to be a Business or Creator account connected to a Meta app. Scraping
// instagram.com is not an option: it requires logging in and is blocked.
//
// Access tokens last 60 days. The function refreshes the token once a week and saves
// the new one in the `instagram_token` table (created by the migration
// 20261020000000_instagram_token.sql; only the service role can read it). The
// INSTAGRAM_ACCESS_TOKEN secret is just the starting token.
//
// Secrets (set with `supabase secrets set`, never commit them):
//   INSTAGRAM_ACCESS_TOKEN   required: a long-lived token for @utshpe
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   provided by Supabase automatically

// Deno + Edge Runtime types (gives the editor `Deno`, `Request`, etc.)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const GRAPH = "https://graph.instagram.com";
const POST_COUNT = 12;
const CACHE_TTL_MS = 60 * 60 * 1000; // an hour; Instagram's image URLs stay valid for days
const REFRESH_EVERY_MS = 7 * 24 * 60 * 60 * 1000; // tokens last 60 days

const ALLOWED_ORIGINS = new Set([
  "https://utshpe.us",
  "http://localhost:5173",
]);

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

type Post = {
  id: string;
  image: string;
  caption: string;
  permalink: string;
  timestamp: string;
  type: InstagramMedia["media_type"];
};

// Module memory survives between requests while the instance is warm.
let cache: { posts: Post[]; expiresAt: number } | null = null;

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
   ACCESS TOKEN
================================ */

function admin() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return url && key ? createClient(url, key) : null;
}

/*
 * The current token: the saved one if there is one, else the secret. Once a week
 * it is exchanged for a fresh 60-day token, which is saved for next time.
 */
async function accessToken(): Promise<string> {
  const db = admin();
  let token = Deno.env.get("INSTAGRAM_ACCESS_TOKEN") ?? "";
  let refreshedAt = 0;

  if (db) {
    const { data, error } = await db
      .from("instagram_token")
      .select("access_token, refreshed_at")
      .eq("id", 1)
      .maybeSingle();

    if (error) console.warn("instagram-feed: token table:", error.message);
    if (data?.access_token) {
      token = data.access_token;
      refreshedAt = new Date(data.refreshed_at).getTime();
    }
  }

  if (!token) throw new Error("INSTAGRAM_ACCESS_TOKEN is not set.");

  if (db && Date.now() - refreshedAt > REFRESH_EVERY_MS) {
    try {
      const params = new URLSearchParams({
        grant_type: "ig_refresh_token",
        access_token: token,
      });
      const response = await fetch(`${GRAPH}/refresh_access_token?${params}`);
      const data = await response.json();

      if (!response.ok || !data.access_token) {
        throw new Error(data.error?.message ?? `HTTP ${response.status}`);
      }

      token = data.access_token;
      const { error } = await db.from("instagram_token").upsert({
        id: 1,
        access_token: token,
        refreshed_at: new Date().toISOString(),
      });
      if (error) console.warn("instagram-feed: saving token:", error.message);
    } catch (err) {
      // The old token still works until it expires; try again next time.
      console.warn("instagram-feed: token refresh failed:", err);
    }
  }

  return token;
}

/* ================================
   INSTAGRAM
================================ */

async function fetchPosts(): Promise<Post[]> {
  const params = new URLSearchParams({
    fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
    limit: String(POST_COUNT),
    access_token: await accessToken(),
  });

  const response = await fetch(`${GRAPH}/me/media?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Instagram error ${data.error?.code ?? response.status}: ${data.error?.message ?? ""}`,
    );
  }

  return ((data.data ?? []) as InstagramMedia[])
    // videos show their cover frame; carousels show their first image
    .map((m) => ({
      id: m.id,
      image: (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) ?? "",
      caption: m.caption ?? "",
      permalink: m.permalink,
      timestamp: m.timestamp,
      type: m.media_type,
    }))
    .filter((p) => p.image);
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

  try {
    if (!cache || Date.now() >= cache.expiresAt) {
      cache = { posts: await fetchPosts(), expiresAt: Date.now() + CACHE_TTL_MS };
    }

    return json({ posts: cache.posts }, 200, origin);
  } catch (err) {
    console.error("instagram-feed:", err);

    // Serve the last good posts rather than nothing if Instagram is briefly down.
    if (cache) return json({ posts: cache.posts }, 200, origin);

    return json({ error: "Unable to load Instagram posts" }, 502, origin);
  }
});
