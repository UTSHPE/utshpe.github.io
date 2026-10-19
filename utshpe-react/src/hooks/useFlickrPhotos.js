import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const DEFAULT_ALT = "UT SHPE photo";

// Shown immediately, and kept if Flickr fails or returns nothing.
export const LOCAL_PHOTOS = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: `/assets/images/Home_Page/slideshow${n}.jpg`,
  alt: DEFAULT_ALT,
}));

// Resolves true once the image is downloaded and decoded, false if it fails.
export function preload(src) {
  const img = new Image();
  img.src = src;
  return img.decode().then(() => true, () => false);
}

async function fetchFlickrPhotos() {
  const { data, error } = await supabase.functions.invoke("flickr-slideshow", { method: "GET" });
  if (error) throw error;
  return (data?.photos || [])
    .filter((p) => p?.src)
    .map((p) => ({ src: p.src, alt: p.title?.trim() || DEFAULT_ALT }));
}

/*
 * This week's Flickr photos (the flickr-slideshow function picks the set and order).
 * Starts with the local photos; swaps once the first Flickr photo has loaded.
 */
export default function useFlickrPhotos() {
  const [photos, setPhotos] = useState(LOCAL_PHOTOS);

  useEffect(() => {
    let cancelled = false;
    fetchFlickrPhotos()
      .then(async (list) => {
        if (!list.length) return console.warn("Flickr slideshow returned no photos; using local images.");
        if (!(await preload(list[0].src)) || cancelled) return;
        setPhotos(list);
      })
      .catch((err) => console.warn("Flickr slideshow unavailable; using local images.", err));
    return () => { cancelled = true; };
  }, []);

  return photos;
}
