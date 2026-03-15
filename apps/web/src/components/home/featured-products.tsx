"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getFeaturedProducts } from "@/lib/data";
import { ProductCard } from "../product/product-card";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function HeroProductCard({ product, imageIndex = 1 }: { product: Product; imageIndex?: number }) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.basePrice / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="relative h-full min-h-[24rem] overflow-hidden bg-neutral-light rounded-xl">
        <Image
          src={product.images[imageIndex]?.url || product.images[0]?.url || ""}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <Badge>New</Badge>}
          {hasDiscount && <Badge variant="sale">-{discountPercent}%</Badge>}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-xs uppercase tracking-wider opacity-80">
            {product.brand}
          </p>
          <h3 className="text-lg md:text-xl font-semibold mt-1 line-clamp-2 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="text-sm opacity-90">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-mono font-bold text-lg">
              {formatPrice(product.basePrice)}
            </span>
            {hasDiscount && (
              <span className="font-mono text-sm opacity-60 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedProducts() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const products = getFeaturedProducts(6);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const heroProducts = products.slice(0, 2);
  const gridProducts = products.slice(2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div
        className={`flex items-center justify-between mb-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark">
          {t("featuredTitle")}
        </h2>
        <Link
          href="/products"
          className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
        >
          {tCommon("viewAll")} →
        </Link>
      </div>

      <div ref={sectionRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* Hero cards — each spans 2 cols on md+ */}
        {heroProducts.map((product, index) => (
          <div
            key={product.id}
            className="col-span-2 transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(2.5rem)",
              transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
            }}
          >
            <HeroProductCard product={product} imageIndex={index + 1} />
          </div>
        ))}

        {/* Standard cards */}
        {gridProducts.map((product, index) => (
          <div
            key={product.id}
            className="col-span-1 transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(2.5rem)",
              transitionDelay: isVisible ? `${(index + 2) * 100}ms` : "0ms",
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
