// Types and helpers shared by server pages and client components. Keep this free of the big data files.

export type Options = Record<string, string>;

/** What the cart, the "Added to cart!" panel and checkout need to show a product. */
export type CartProduct = {
  title: string;
  price: number; // cents
  img: string;
  href: string;
  /** Stock limit per cart line, or null when unlimited. */
  max: number | null;
  /** Option names in the shop's own order, the order the cart lists them in. */
  order: string[];
  /** The variant photo the shop shows: one for every variant, or one per option value. */
  photo?: string | Record<string, string>;
};

export type Catalog = Record<string, CartProduct>;

export const BRAND = "Vodor";

export const productHref = (slug: string) => `/the-signature-collection/p/${slug}`;

export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** A cart line's photo: the variant's own when the shop has one. */
export const linePhoto = (p: CartProduct, attrs: Options) => {
  const v = p.photo;
  return (typeof v === "string" ? v : Object.values(attrs).map((x) => v?.[x]).find(Boolean)) || p.img;
};
