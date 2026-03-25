import { ProductListing } from "@/components/product/product-listing";
import { sports } from "@/lib/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return sports.map((s) => ({ slug: s.slug }));
}

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sport = sports.find((s) => s.slug === slug);
  if (!sport) notFound();

  return (
    <ProductListing
      initialFilters={{ sport: slug }}
      title={`${sport.icon} ${sport.name}`}
    />
  );
}
