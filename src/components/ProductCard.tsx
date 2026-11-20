"use client";

import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { money, productHref } from "@/lib/shop";
import { useImageLoaded } from "@/lib/use-image-loaded";

// Cards fade in and settle as their photo loads; on hover the second photo crossfades in (CSS).
export default function ProductCard({ p }: { p: Product }) {
  const [loaded, ref] = useImageLoaded();
  return (
    <Link className={loaded ? "card ld" : "card"} href={productHref(p.slug)}>
      <div className="im">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer to hand this to */}
        <img ref={ref} src={`/img/${p.img}`} alt={p.title} loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.hover && <img src={`/img/${p.hover}`} alt="" loading="lazy" />}
      </div>
      <div className="meta">
        <div className="t">{p.title}</div>
        <div className="p">{money(p.price)}</div>
      </div>
    </Link>
  );
}
