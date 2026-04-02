"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getNewArrivals } from "@/lib/data";
import { ProductCard } from "../product/product-card";
import { trpc } from "@/utils/trpc";
import { Product } from "@/lib/types";

export function NewArrivals() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  
  // Fetch from live DB
  const { data: liveData } = trpc.products.list.useQuery({ 
    limit: 4, 
    sort: 'newest' 
  });

  const products = (liveData?.products && liveData.products.length > 0) 
    ? (liveData.products as Product[]) 
    : getNewArrivals(4);

  return (
    <section className="bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark">
            {t("newArrivalsTitle")}
          </h2>
          <Link
            href="/products?sort=newest"
            className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            {tCommon("viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
