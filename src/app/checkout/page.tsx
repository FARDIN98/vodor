import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";
import { cartCatalog } from "@/lib/catalog";
import { BRAND } from "@/lib/shop";

export const metadata: Metadata = { title: `${BRAND} | Secure Checkout`, robots: { index: false } };

// Outside the (site) group: checkout has its own header and no site footer.
export default function Checkout() {
  return <CheckoutView catalog={cartCatalog()} />;
}
