import { ProductListing } from "@/components/product/product-listing";
import { getTranslations } from "next-intl/server";
import { FilterState } from "@/lib/types";

export async function generateMetadata() {
  const t = await getTranslations("products");
  return { title: `${t("title")} — Ekene Sport` };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialFilters: FilterState = {};

  if (typeof params.gender === "string") {
    initialFilters.gender = params.gender;
  }
  if (typeof params.sport === "string") {
    initialFilters.sport = params.sport;
  }

  return <ProductListing initialFilters={initialFilters} />;
}
