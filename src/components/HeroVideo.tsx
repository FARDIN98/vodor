"use client";

import { useEffect, useRef, useState } from "react";

const YT = "https://www.youtube.com";
const SRC = `${YT}/embed/g8nhg4HlbFo?autoplay=1&mute=1&loop=1&playlist=g8nhg4HlbFo&controls=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`;

/** The home video fades in once YouTube reports it playing; until then the still photo shows. */
export default function HeroVideo({ title }: { title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const vid = ref.current;
    if (!vid) return;
    let tries = 0;
    const hello = () => vid.contentWindow?.postMessage('{"event":"listening","id":1}', YT);
    // The iframe may finish loading before this runs, so keep asking for a few seconds.
    const poll = setInterval(() => (++tries > 40 ? clearInterval(poll) : hello()), 250);
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT || e.source !== vid.contentWindow) return;
      let d;
      try {
        d = JSON.parse(e.data);
      } catch {
        return;
      }
      if (d?.info?.playerState === 1) {
        setReady(true);
        clearInterval(poll);
      }
    };
    vid.addEventListener("load", hello);
    addEventListener("message", onMessage);
    return () => {
      clearInterval(poll);
      vid.removeEventListener("load", hello);
      removeEventListener("message", onMessage);
    };
  }, []);

  return <iframe ref={ref} className={ready ? "ready" : undefined} src={SRC} title={title} allow="autoplay; encrypted-media" tabIndex={-1} loading="eager" />;
}
