import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, categoryHref, content, getProduct, rebrand, type Category } from "@/lib/catalog";
import { BRAND } from "@/lib/shop";
import Accordion from "./Accordion";
import CategorySelect from "./CategorySelect";
import ProductCard from "./ProductCard";

export const collectionMetadata = (cat: Category): Metadata => ({
  title: `${cat.slug ? cat.name + " — " : ""}The Signature Collection – Linen & Tailored Menswear | ${BRAND} — ${BRAND}`,
  description: `Discover ${BRAND}’s Signature Collection — refined linen trousers, tailored pieces, and leather accessories designed for modern, effortless dressing.`,
});

/** A collection page: every product, or one category. */
export default function Collection({ cat }: { cat: Category }) {
  return (
    <>
      <section className="chero" aria-label="The Signature Collection" />
      <section className="plist">
        {cat.slug ? (
          <>
            <nav className="crumb" aria-label="Breadcrumb">
              <Link href={categoryHref(CATEGORIES[0])}>All</Link> /
            </nav>
            <h2 className="ptitle">{cat.name}</h2>
          </>
        ) : (
          <h2 className="ptitle">{cat.title}</h2>
        )}
        <CategorySelect options={CATEGORIES.map((c) => ({ href: categoryHref(c), name: c.name }))} value={categoryHref(cat)} />
        <div className="pwrap">
          <ul className="cats">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <Link href={categoryHref(c)} className={c === cat ? "on" : undefined}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="grid">
            {cat.items.map((s) => (
              <ProductCard key={s} p={getProduct(s)!} />
            ))}
          </div>
        </div>
      </section>
      <section className="faq">
        <div className="in">
          <h3>Frequently Asked Questions</h3>
          <Accordion titles={content.faq.titles.map(rebrand)} answers={content.faq.descs} icon="plus" />
        </div>
      </section>
    </>
  );
}
