"use client";

import Link from "next/link";
import { useRef } from "react";
import { useCart, type Line } from "@/lib/cart-store";
import { linePhoto, money, type Catalog } from "@/lib/shop";
import { Add, Cross, Minus } from "./icons";
import { stockMessage, useNotice } from "./Notice";

export const lineKey = (l: Line) => `${l.s}|${JSON.stringify(l.a)}`;

export default function CartView({ catalog }: { catalog: Catalog }) {
  const hydrated = useCart((s) => s.hydrated);
  const lines = useCart((s) => s.lines).filter((l) => catalog[l.s]);
  const { setQty, remove } = useCart.getState();
  const heading = useRef<HTMLHeadingElement>(null);
  const [notice, notify] = useNotice();

  const step = (l: Line, by: number) => {
    const max = catalog[l.s].max;
    if (max != null && l.q + by > max) return notify("Unable to Add Item", stockMessage(max));
    setQty(l, Math.max(1, l.q + by));
  };
  const typed = (l: Line, input: HTMLInputElement) => {
    const max = catalog[l.s].max;
    const q = Math.min(Math.max(1, Math.floor(+input.value) || 1), max ?? Infinity);
    input.value = String(q);
    setQty(l, q);
  };

  return (
    <section className={lines.length ? "cartpg has-items" : "cartpg"}>
      <h1 ref={heading} tabIndex={-1}>
        Shopping Cart
      </h1>
      {/* Wait for the saved cart before saying it's empty. */}
      {hydrated && (
        <div className="cempty">
          <p>You have nothing in your shopping cart.</p>
          <Link className="pill dark" href="/">
            Continue Shopping
          </Link>
        </div>
      )}
      <div className="cfill">
        <div className="crows">
          {lines.map((l) => {
            const p = catalog[l.s];
            return (
              <div key={lineKey(l)} className="crow">
                <Link href={p.href} tabIndex={-1}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
                  <img className="ci" src={linePhoto(p, l.a)} alt="" />
                </Link>
                <div className="cd">
                  <Link className="ct" href={p.href}>
                    {p.title}
                  </Link>
                  {Object.entries(l.a).map(([o, v]) => (
                    <p key={o} className="cv">
                      {o}: {v}
                    </p>
                  ))}
                </div>
                <div className="cq">
                  <button type="button" aria-label="Decrease quantity" disabled={l.q <= 1} onClick={() => step(l, -1)}>
                    <Minus />
                  </button>
                  <input
                    key={l.q}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    defaultValue={l.q}
                    aria-label={`Quantity of ${p.title}`}
                    onBlur={(e) => typed(l, e.currentTarget)}
                    onKeyDown={(e) => e.key === "Enter" && typed(l, e.currentTarget)}
                  />
                  <button type="button" aria-label="Increase quantity" onClick={() => step(l, 1)}>
                    <Add />
                  </button>
                </div>
                <p className="cp">{money(p.price * l.q)}</p>
                <button
                  type="button"
                  className="cx"
                  aria-label={`Remove ${p.title}`}
                  onClick={() => {
                    remove(l);
                    heading.current?.focus();
                  }}
                >
                  <Cross />
                </button>
              </div>
            );
          })}
        </div>
        <div className="csum">
          <div className="csub">
            <span>Subtotal</span>
            <b>{money(lines.reduce((t, l) => t + catalog[l.s].price * l.q, 0))}</b>
          </div>
          <Link className="pill dark ckout" href="/checkout">
            Checkout
          </Link>
        </div>
      </div>
      {notice}
    </section>
  );
}
