import { ProductListing } from "@/components/product/product-listing";
import { categories } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const categorySlug = slug[slug.length - 1];
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) notFound();

  return (
    <ProductListing
      initialFilters={{ category: categorySlug }}
      title={category.name}
    />
  );
}
