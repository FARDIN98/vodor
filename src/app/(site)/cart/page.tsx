import type { Metadata } from "next";
import CartView from "@/components/CartView";
import { cartCatalog } from "@/lib/catalog";
import { BRAND } from "@/lib/shop";

export const metadata: Metadata = { title: BRAND };

export default function Cart() {
  return <CartView catalog={cartCatalog()} />;
}
