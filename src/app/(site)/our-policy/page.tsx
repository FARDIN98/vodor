import type { Metadata } from "next";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import { content, rebrand } from "@/lib/catalog";
import { BRAND } from "@/lib/shop";

export const metadata: Metadata = { title: `OUR POLICY — ${BRAND}` };

export default function Policy() {
  return (
    <>
      <section className="phero">
        <h1>Returns &amp; Exchanges Policies</h1>
        <div className="rt">
          <p>At {BRAND}, every piece is considered with intention — from the fabric and construction to the way it is presented to you.</p>
          <p>We want your experience with {BRAND} to be as considered as the garments themselves. Please take a moment to review our policies before placing an order.</p>
          <Link className="pill light" href="/the-signature-collection">
            SHOP NOW
          </Link>
        </div>
      </section>
      <section className="pacc">
        <Accordion titles={content.policy.titles.map(rebrand)} answers={content.policy.descs} icon="chevron" />
      </section>
      <section className="contact">
        <p>
          For more information please contact:
          <br />
          <a href="mailto:MaisonVarro@gmail.com">MaisonVarro@gmail.com</a>
          <br />
          <br />
          <strong>{BRAND}</strong>
          <br />
          All rights reserved, 2026.
        </p>
        <Link className="pill dark" href="/the-signature-collection">
          SHOP NOW
        </Link>
      </section>
    </>
  );
}
