"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cartCount, useCart } from "@/lib/cart-store";
import { linePhoto, money, type CartProduct, type Options } from "@/lib/shop";

export type Added = { product: CartProduct; attrs: Options; qty: number };

/**
 * An add-to-cart button: it spins, then says "Added!" for 2 seconds while the panel opens, like the
 * original's. `add` puts the item in the cart and returns what was added, or null when it couldn't.
 */
export function AddButton({ className, children, add, onAdded }: { className: string; children: string; add: () => Added | null; onAdded: (a: Added, button: HTMLButtonElement) => void }) {
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const ref = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const click = () => {
    if (state !== "idle") return;
    const added = add();
    if (!added) return;
    setState("adding");
    timers.current.push(
      window.setTimeout(() => {
        setState("added");
        if (ref.current) onAdded(added, ref.current);
        timers.current.push(window.setTimeout(() => setState("idle"), 2000));
      }, 500),
    );
  };

  return (
    <button ref={ref} type="button" className={state === "idle" ? className : `${className} ${state}`} onClick={click}>
      {state === "added" ? "Added!" : children}
    </button>
  );
}

/** Opens the "Added to cart!" panel. Returns the panel to render and `open`. */
export function useMiniCart() {
  const [panel, setPanel] = useState<(Added & { back: HTMLElement; id: number }) | null>(null);
  const open = useCallback((a: Added, back: HTMLElement) => setPanel({ ...a, back, id: Date.now() }), []);
  const close = useCallback(() => setPanel(null), []);
  const element = panel && <MiniCart key={panel.id} {...panel} onClosed={close} />;
  return [element, open] as const;
}

// It slides in under the header (up from the bottom on phones), dims the page, and closes itself after
// 5 seconds unless the visitor starts using it.
function MiniCart({ product, attrs, qty, back, onClosed }: Added & { back: HTMLElement; onClosed: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(undefined);
  const [closing, setClosing] = useState(false);
  const [top] = useState(() => document.querySelector(".hdr")?.getBoundingClientRect().bottom ?? 0);
  const count = useCart((s) => cartCount(s.lines));
  const meta = [Object.values(attrs).join(" "), `${qty}x`].filter(Boolean).join(" · ");

  const close = useCallback(() => {
    clearTimeout(timer.current);
    setClosing(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    timer.current = window.setTimeout(close, 5000);
    return () => {
      clearTimeout(timer.current);
      document.body.style.overflow = "";
    };
  }, [close]);

  useEffect(() => {
    if (closing) {
      document.body.style.overflow = "";
      if (ref.current?.contains(document.activeElement)) back.focus({ preventScroll: true });
      const t = setTimeout(onClosed, 250);
      return () => clearTimeout(t);
    }
    // Keep keyboard focus inside the panel while it's open.
    const onKey = (e: KeyboardEvent) => {
      clearTimeout(timer.current);
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !ref.current) return;
      e.preventDefault();
      const f = [...ref.current.querySelectorAll<HTMLElement>("button, a")];
      f[(f.indexOf(document.activeElement as HTMLElement) + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [closing, close, back, onClosed]);

  return createPortal(
    <div ref={ref} className={closing ? "mc closing" : "mc"}>
      <div className="mco" onClick={close} />
      <div className="mcd" role="dialog" aria-modal="true" aria-labelledby="mc-t" style={{ "--top": `${top}px` } as React.CSSProperties} onPointerEnter={() => clearTimeout(timer.current)}>
        <div className="mch">
          <span id="mc-t">Added to cart!</span>
          <button type="button" className="mcx" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 22 22" width="18" height="18" aria-hidden="true">
              <path d="M5 5l12 12M17 5 5 17" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </div>
        <div className="mci">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
          <img src={linePhoto(product, attrs)} alt="" />
          <div className="mcn">
            <div className="mcr">
              <span>{product.title}</span>
              <span>{money(product.price * qty)}</span>
            </div>
            <div className="mcm">{meta}</div>
          </div>
        </div>
        <div className="mcb">
          <Link href="/cart">View Cart ({count})</Link>
          <Link href="/checkout">Checkout</Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
