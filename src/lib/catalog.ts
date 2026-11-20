// Product data for server components only: it includes every product description, so don't import it
// from a client component (pass what the client needs as props instead).
import productsJson from "@/data/products.json";
import detailsJson from "@/data/details.json";
import contentJson from "@/data/content.json";
import { BRAND, productHref, type Catalog } from "./shop";

export type Product = { slug: string; title: string; price: number; img: string; hover?: string };
type Detail = {
  slug: string;
  body: string;
  images: string[];
  options: string[];
  variants: { attrs: Record<string, string>; price: number; stock: boolean }[];
  addons: string[];
  related: string[];
  max: number | null;
  seoTitle: string;
  seoDesc: string;
};
export type Category = { slug: string; name: string; title?: string; items: string[] };

export const products: Product[] = productsJson;
const details: Record<string, Detail> = Object.fromEntries((detailsJson as Detail[]).map((d) => [d.slug, d]));
const bySlug: Record<string, Product> = Object.fromEntries(products.map((p) => [p.slug, p]));
export const content = contentJson;

export const getProduct = (slug: string): Product | undefined => bySlug[slug];
export const getDetail = (slug: string): Detail => details[slug];

export const rebrand = (s: string) => s.replaceAll("MaisonVarro", BRAND);
// The shop's rich text minus its editor-only attributes.
export const cleanBody = (html: string) => rebrand(html.replace(/ style="white-space:pre-wrap;"| data-rte-[a-z-]+="[^"]*"/g, ""));
export const optionValues = (d: Detail, option: string) => [...new Set(d.variants.map((v) => v.attrs[option]))];

export const CATEGORIES: Category[] = [
  { slug: "", name: "All", title: "THE SIGNATURE COLLECTION", items: products.map((p) => p.slug) },
  { slug: "vases", name: "Coastal Linen", items: ["terre-linen-trousers", "lumiere-linen-shorts", "rive-linen-shirt", "lumiere-linen-trousers", "lumiere-linen-shirt", "elan-linen-shirt"] },
  { slug: "vessels", name: "Tailored Minimal", items: ["clair-linen-trousers", "serein-linen-blazer"] },
  { slug: "accessories", name: "Accessories", items: ["brun-leather-card-holder", "clair-suede-belt", "sable-suede-tote", "trame-leather-tote"] },
];
export const categoryHref = (c: Category) => `/the-signature-collection${c.slug ? "/" + c.slug : ""}`;

// The photo the original shop shows for a variant in the cart and checkout: one photo index for every
// variant, or one per option value.
const VARIANT_PHOTO: Record<string, number | Record<string, number>> = {
  "terre-linen-trousers": 0,
  "lumiere-linen-shorts": 1,
  "serein-linen-blazer": 0,
  "rive-linen-shirt": 0,
  "lumiere-linen-trousers": 0,
  "elan-linen-shirt": 0,
  "clair-linen-trousers": { Clair: 0, "Gris Olive": 3 },
};
const variantPhoto = (slug: string) => {
  const v = VARIANT_PHOTO[slug];
  const im = (k: number) => `/img/${details[slug].images[k]}`;
  if (v == null) return undefined;
  return typeof v === "number" ? im(v) : Object.fromEntries(Object.entries(v).map(([val, k]) => [val, im(k)]));
};

/** Cart details for the given products (all of them by default). */
export const cartCatalog = (slugs: string[] = products.map((p) => p.slug)): Catalog =>
  Object.fromEntries(
    slugs.map((s) => {
      const p = bySlug[s];
      const d = details[s];
      return [s, { title: p.title, price: p.price, img: `/img/${p.img}`, href: productHref(s), max: d.max, order: Object.keys(d.variants[0]?.attrs ?? {}), photo: variantPhoto(s) }];
    }),
  );
