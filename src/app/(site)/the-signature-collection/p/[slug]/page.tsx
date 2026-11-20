import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import { cartCatalog, cleanBody, getDetail, getProduct, optionValues, products, rebrand } from "@/lib/catalog";
import { BRAND } from "@/lib/shop";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/the-signature-collection/p/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const d = getDetail(slug);
  return { title: `${rebrand(d.seoTitle || p.title)} — ${BRAND}`, description: rebrand(d.seoDesc) };
}

export default async function ProductPage({ params }: PageProps<"/the-signature-collection/p/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const d = getDetail(slug);
  const groups = (s: string) => getDetail(s).options.map((name) => ({ name, values: optionValues(getDetail(s), name) }));
  const addons = d.addons.map((s) => {
    const a = getProduct(s)!;
    return { slug: s, title: a.title, price: a.price, img: a.img, options: groups(s) };
  });

  return (
    <>
      <ProductDetail
        slug={slug}
        title={p.title}
        price={p.price}
        images={d.images}
        description={cleanBody(d.body)}
        options={groups(slug)}
        addons={addons}
        catalog={cartCatalog([slug, ...d.addons])}
      />
      {d.related.length > 0 && (
        <section className="rel">
          <h2>You Might Also Like</h2>
          <div className="grid">
            {d.related.map((s) => (
              <ProductCard key={s} p={getProduct(s)!} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
