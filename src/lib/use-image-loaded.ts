"use client";

import { useCallback, useState } from "react";

/**
 * True once the image has loaded (or failed, so it still shows). Use the returned ref on the <img>.
 * It checks `complete` because the image may have loaded before React hydrated and missed onLoad.
 */
export function useImageLoaded() {
  const [loaded, setLoaded] = useState(false);
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.complete) return setLoaded(true);
    const done = () => setLoaded(true);
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    return () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
    };
  }, []);
  return [loaded, ref] as const;
}
