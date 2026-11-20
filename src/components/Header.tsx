"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cartCount, useCart } from "@/lib/cart-store";
import { CartIcon, SOCIAL, SocialIcon } from "./icons";

const NAV = [
  { href: "/", label: "HOME" },
  { href: "/the-signature-collection", label: "THE SIGNATURE COLLECTION" },
];

// Like the original, the header keeps a soft shadow and shrinks once the page scrolls.
const onScroll = (fn: () => void) => {
  addEventListener("scroll", fn, { passive: true });
  return () => removeEventListener("scroll", fn);
};
const useScrolled = () => useSyncExternalStore(onScroll, () => scrollY > 10, () => false);

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(path);
  const scrolled = useScrolled();
  const count = useCart((s) => cartCount(s.lines));

  // The phone menu closes when the page changes.
  if (path !== menuPath) {
    setMenuPath(path);
    setOpen(false);
  }
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
  }, [open]);

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      <header className={scrolled ? "hdr scrolled" : "hdr"}>
        <button className="burger" aria-label={open ? "Close Menu" : "Open Menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span />
          <span />
        </button>
        <nav className="hnav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={active(n.href) ? "on" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link className="logo" href="/">
          Vodor
        </Link>
        <div className="hright">
          {SOCIAL.map((s) => (
            <a key={s.name} className="soc" href={s.href} target="_blank" rel="noopener" aria-label={s.name}>
              <SocialIcon name={s.name} />
            </a>
          ))}
          <Link className="cart" href="/cart" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
            <CartIcon />
            <span>{count}</span>
          </Link>
        </div>
      </header>
      <div className="menu" aria-hidden={!open}>
        {NAV.map((n) => (
          <Link key={n.href} className="big" href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </Link>
        ))}
        <div className="msoc">
          {SOCIAL.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener" aria-label={s.name}>
              <SocialIcon name={s.name} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
