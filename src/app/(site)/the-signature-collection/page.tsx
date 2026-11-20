import Collection, { collectionMetadata } from "@/components/Collection";
import { CATEGORIES } from "@/lib/catalog";

export const metadata = collectionMetadata(CATEGORIES[0]);

export default function AllProducts() {
  return <Collection cat={CATEGORIES[0]} />;
}
