import { notFound } from "next/navigation";
import Collection, { collectionMetadata } from "@/components/Collection";
import { CATEGORIES } from "@/lib/catalog";

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.filter((c) => c.slug).map((c) => ({ category: c.slug }));

const find = (slug: string) => CATEGORIES.find((c) => c.slug && c.slug === slug);

export async function generateMetadata({ params }: PageProps<"/the-signature-collection/[category]">) {
  const cat = find((await params).category);
  return cat ? collectionMetadata(cat) : {};
}

export default async function CategoryPage({ params }: PageProps<"/the-signature-collection/[category]">) {
  const cat = find((await params).category);
  if (!cat) notFound();
  return <Collection cat={cat} />;
}
