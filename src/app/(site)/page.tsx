import type { Metadata } from "next";
import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import { BRAND } from "@/lib/shop";

export const metadata: Metadata = {
  title: `${BRAND} — Premium Linen Menswear`,
  description: "A house of refined, sustainable, and enduring Linen and organic apparel",
};

export default function Home() {
  return (
    <>
      <section className="hero">
        <HeroVideo title={`${BRAND} | The Signature Collection — Summer`} />
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
        <img className="ttl" src="/img/home-title.png" alt="The Signature Collection — “Summer” — Vinh Hy Bay, Vietnam" />
        <Link className="pill" href="/the-signature-collection">
          SHOP
        </Link>
      </section>
      <section className="about">
        <p>
          The Signature Collection defines the essence of {BRAND} — a balance of relaxed tailoring, breathable linen, and refined everyday essentials. Designed for modern living, each piece reflects a quiet approach to luxury.
        </p>
      </section>
    </>
  );
}
