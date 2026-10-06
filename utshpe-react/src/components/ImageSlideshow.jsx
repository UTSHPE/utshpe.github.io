import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const SLIDE_INTERVAL = 3500;
const DEFAULT_ALT = "UT SHPE photo";

// Shown immediately on load, and kept if Flickr fails or returns nothing.
const localImages = [
  "/assets/images/Home_Page/slideshow1.jpg",
  "/assets/images/Home_Page/slideshow2.jpg",
  "/assets/images/Home_Page/slideshow3.jpg",
  "/assets/images/Home_Page/slideshow4.jpg",
  "/assets/images/Home_Page/slideshow5.jpg",
  "/assets/images/Home_Page/slideshow6.jpg",
].map((src) => ({ src, alt: DEFAULT_ALT }));

// Matches the .polaroid img opacity transition so the outgoing
// local photo can finish fading before it's removed.
const FADE_MS = 700;

// Resolves true once the image is downloaded and decoded,
// false if it fails to load.
function preload(src) {
  const img = new Image();
  img.src = src;

  return img.decode().then(
    () => true,
    () => false
  );
}

async function fetchFlickrPhotos() {
  const { data, error } = await supabase.functions.invoke(
    "flickr-slideshow",
    { method: "GET" }
  );

  if (error) throw error;

  return (data?.photos || [])
    .filter((photo) => photo?.src)
    .map((photo) => ({
      src: photo.src,
      alt: photo.title?.trim() || DEFAULT_ALT,
    }));
}

function ImageSlideshow() {
  /*
   * `leaving` is the local photo on screen when Flickr photos
   * arrive. It stays on top while it fades out, so the swap is a
   * crossfade instead of a hard cut.
   */
  const [slideshow, setSlideshow] = useState({
    photos: localImages,
    index: 0,
    leaving: null,
  });

  const { photos, index: currentIndex, leaving } = slideshow;

  /*
   * Load Flickr photos once. The function already picks this
   * week's set and order, so they're used as returned. The first
   * one is preloaded before swapping so the frame never shows a
   * half-loaded image.
   */
  useEffect(() => {
    let cancelled = false;
    let fadeTimer;

    fetchFlickrPhotos()
      .then(async (flickrPhotos) => {
        if (flickrPhotos.length === 0) {
          console.warn("Flickr slideshow returned no photos; using local images.");
          return;
        }

        const firstLoaded = await preload(flickrPhotos[0].src);

        if (cancelled) return;

        if (!firstLoaded) {
          console.warn("Flickr photo failed to load; using local images.");
          return;
        }

        setSlideshow((current) => ({
          photos: flickrPhotos,
          index: 0,
          leaving: current.photos[current.index],
        }));

        fadeTimer = setTimeout(() => {
          setSlideshow((current) => ({ ...current, leaving: null }));
        }, FADE_MS);
      })
      .catch((err) => {
        console.warn("Flickr slideshow unavailable; using local images.", err);
      });

    return () => {
      cancelled = true;
      clearTimeout(fadeTimer);
    };
  }, []);

  /*
   * Advance every SLIDE_INTERVAL, but only once the next image has
   * finished loading. Photos that fail to load are dropped.
   */
  useEffect(() => {
    if (photos.length < 2) return;

    let cancelled = false;

    const nextIndex = (currentIndex + 1) % photos.length;
    const nextReady = preload(photos[nextIndex].src);

    const timer = setTimeout(async () => {
      const loaded = await nextReady;

      if (cancelled) return;

      setSlideshow((current) => {
        if (loaded) {
          return { ...current, index: nextIndex };
        }

        return {
          ...current,
          photos: current.photos.filter((_, i) => i !== nextIndex),

          // Removing a photo before the current one shifts it down.
          index: nextIndex < current.index ? current.index - 1 : current.index,
        };
      });
    }, SLIDE_INTERVAL);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [currentIndex, photos]);

  // `leaving` goes first so React keeps its existing <img> node
  // (letting the opacity transition run) instead of remounting it.
  const slides = leaving ? [leaving, ...photos] : photos;

  return (
    <div className="polaroid">
      <div className="frame">
        {slides.map((photo) => {
          const isLeaving = photo === leaving;

          return (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className={!isLeaving && photo === photos[currentIndex] ? "active" : ""}
              style={isLeaving ? { zIndex: 1 } : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ImageSlideshow;
