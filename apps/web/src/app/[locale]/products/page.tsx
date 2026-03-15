import { ProductListing } from "@/components/product/product-listing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("products");
  return { title: `${t("title")} — Ekene Sport` };
}

export default function ProductsPage() {
  return <ProductListing />;
}
