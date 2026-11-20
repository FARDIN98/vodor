"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { money, productHref, type Catalog, type Options } from "@/lib/shop";
import { useImageLoaded } from "@/lib/use-image-loaded";
import { AddButton, useMiniCart, type Added } from "./AddToCart";
import { Add, Down, Minus } from "./icons";
import { stockMessage, useNotice } from "./Notice";

export type OptionGroup = { name: string; values: string[] };
export type AddonView = { slug: string; title: string; price: number; img: string; options: OptionGroup[] };

type Props = {
  slug: string;
  title: string;
  price: number;
  images: string[];
  /** Trusted HTML from the shop's own product description. */
  description: string;
  options: OptionGroup[];
  addons: AddonView[];
  /** Cart details for this product and its add-ons. */
  catalog: Catalog;
};

const toQty = (v: string | number) => String(Math.max(1, Math.floor(+v) || 1));

export default function ProductDetail({ slug, title, price, images, description, options, addons, catalog }: Props) {
  const product = catalog[slug];
  const n = images.length;
  const slides = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [ready, firstSlide] = useImageLoaded();
  const [picked, setPicked] = useState<Options>({});
  const [qty, setQty] = useState("1");
  const [notice, notify] = useNotice();
  const [panel, openPanel] = useMiniCart();

  const current = () => (slides.current ? Math.round(slides.current.scrollLeft / slides.current.clientWidth) : 0);
  // The original swaps photos instantly on desktop and slides them on phones.
  const go = (i: number) => {
    const s = slides.current;
    s?.scrollTo({ left: ((i + n) % n) * s.clientWidth, behavior: matchMedia("(max-width:767px)").matches ? "smooth" : "auto" });
  };

  // Adds to the cart, or explains why it can't. Returns what was added.
  const addToCart = (s: string, attrs: Options, q: number): Added | null => {
    const p = catalog[s];
    const line = useCart.getState().add(s, p, attrs, q);
    if (!line) {
      notify("Unable to Add Item", stockMessage(p.max ?? 0));
      return null;
    }
    return { product: p, attrs: line, qty: q };
  };
  const addMain = () => {
    const missing = options.filter((o) => !picked[o.name]).map((o) => o.name);
    if (missing.length) {
      notify("Unable to Add Item", `Please select the ${missing.join(" and ")} option${missing.length > 1 ? "s" : ""}.`);
      return null;
    }
    return addToCart(slug, picked, product.max == null ? +toQty(qty) : 1);
  };

  return (
    <section className={ready ? "pd ready" : "pd"}>
      <nav className="pcrumb" aria-label="Breadcrumb">
        <Link href="/the-signature-collection">THE SIGNATURE COLLECTION</Link>
        <span aria-hidden="true">›</span>
        <Link href={productHref(slug)} aria-current="page">
          {title}
        </Link>
      </nav>
      <div className="pdw">
        <div className="gal">
          <div className="thumbs">
            {images.map((f, i) => (
              <Thumb key={f} src={`/img/${f}`} label={`Show image ${i + 1} of ${n}`} onClick={() => go(i)} />
            ))}
          </div>
          <div className="sw">
            <div className="slides" ref={slides} onScroll={() => setShown(current())}>
              {images.map((f, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer
                <img key={f} ref={i === 0 ? firstSlide : undefined} src={`/img/${f}`} alt={title} loading={i ? "lazy" : undefined} fetchPriority={i ? undefined : "high"} />
              ))}
            </div>
            <span className="ind" aria-hidden="true">
              {shown + 1} / {n}
            </span>
            {n > 1 && (
              <>
                <button type="button" className="arr prev" aria-label="Previous image" onClick={() => go(current() - 1)} />
                <button type="button" className="arr next" aria-label="Next image" onClick={() => go(current() + 1)} />
              </>
            )}
          </div>
        </div>
        <div className="pmeta">
          <h1 className="pt">{title}</h1>
          <div className="pp">{money(price)}</div>
          <div className="pdesc" dangerouslySetInnerHTML={{ __html: description }} />
          {options.length > 0 && (
            <div className="pvars">
              {options.map((o) => (
                <fieldset key={o.name} className="vopt">
                  <legend className="vt">{o.name}:</legend>
                  <div className="vbtns">
                    {o.values.map((v) => (
                      <label key={v}>
                        <input type="radio" name={`opt-${o.name}`} value={v} checked={picked[o.name] === v} onChange={() => setPicked({ ...picked, [o.name]: v })} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          )}
          <div className="patc">
            {product.max == null && (
              <div className="qty">
                <button type="button" className="qm" aria-label="Decrease quantity" disabled={+qty <= 1} onClick={() => setQty(toQty(+qty - 1))}>
                  <Minus />
                </button>
                <input type="number" value={qty} min={1} inputMode="numeric" aria-label="Quantity" onChange={(e) => setQty(e.target.value)} onBlur={() => setQty(toQty(qty))} />
                <button type="button" className="qp" aria-label="Increase quantity" onClick={() => setQty(toQty(+qty + 1))}>
                  <Add />
                </button>
              </div>
            )}
            <AddButton className="atc" add={addMain} onAdded={openPanel}>
              Add To Cart
            </AddButton>
          </div>
          {addons.length > 0 && (
            <section className="addons" aria-label="Goes well with">
              {addons.map((a) => (
                <AddonRow key={a.slug} addon={a} add={(attrs) => addToCart(a.slug, attrs, 1)} onAdded={openPanel} />
              ))}
            </section>
          )}
        </div>
      </div>
      {notice}
      {panel}
    </section>
  );
}

// Thumbnails fade in once their photo loads.
function Thumb({ src, label, onClick }: { src: string; label: string; onClick: () => void }) {
  const [loaded, ref] = useImageLoaded();
  return (
    <button type="button" className={loaded ? "ld" : undefined} aria-label={label} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
      <img ref={ref} src={src} alt="" loading="lazy" />
    </button>
  );
}

function AddonRow({ addon, add, onAdded }: { addon: AddonView; add: (attrs: Options) => Added | null; onAdded: (a: Added, b: HTMLButtonElement) => void }) {
  const [attrs, setAttrs] = useState<Options>(() => Object.fromEntries(addon.options.map((o) => [o.name, o.values[0]])));
  const href = productHref(addon.slug);
  return (
    <div className="aoc">
      <Link className="aoth" href={href} aria-label={addon.title}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
        <img src={`/img/${addon.img}`} alt={addon.title} loading="lazy" />
      </Link>
      <div className="aoi">
        <Link className="aot" href={href}>
          {addon.title}
        </Link>
        <div className="aop">{money(addon.price)}</div>
      </div>
      {addon.options.map((o) => (
        <div key={o.name} className="aosel">
          <select aria-label={`${o.name} for ${addon.title}`} value={attrs[o.name]} onChange={(e) => setAttrs({ ...attrs, [o.name]: e.target.value })}>
            {o.values.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <Down />
        </div>
      ))}
      <AddButton className="aoadd" add={() => add(attrs)} onAdded={onAdded}>
        Add
      </AddButton>
    </div>
  );
}
