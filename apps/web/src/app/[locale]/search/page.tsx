"use client";

import { useSearchParams } from "next/navigation";
import { ProductListing } from "@/components/product/product-listing";
import { useTranslations } from "next-intl";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const t = useTranslations("search");

  return (
    <ProductListing
      initialFilters={{ search: query }}
      title={query ? t("resultsFor", { query }) : t("title")}
    />
  );
}
