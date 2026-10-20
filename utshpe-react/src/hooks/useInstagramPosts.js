import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/*
 * @utshpe's newest Instagram posts, from the instagram-feed edge function.
 * Empty until they arrive (or if the function isn't set up), so callers can
 * keep showing placeholders.
 */
export default function useInstagramPosts(count) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    supabase.functions.invoke("instagram-feed", { method: "GET" })
      .then(({ data, error }) => {
        if (error) throw error;
        if (!cancelled) setPosts((data?.posts || []).filter((p) => p?.image && p?.permalink).slice(0, count));
      })
      .catch((err) => console.warn("Instagram feed unavailable; showing placeholders.", err));
    return () => { cancelled = true; };
  }, [count]);

  return posts;
}
