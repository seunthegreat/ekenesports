"use client";

import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.basePrice / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-neutral-light">
        <Image
          src={product.images[0]?.url || ""}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge>New</Badge>}
          {hasDiscount && <Badge variant="sale">-{discountPercent}%</Badge>}
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-medium text-neutral-dark group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-sm">{formatPrice(product.basePrice)}</span>
          {hasDiscount && (
            <span className="font-mono text-xs text-gray-400 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
        {/* Color swatches */}
        {product.variants.length > 0 && (
          <div className="flex gap-1 pt-1">
            {Array.from(new Set(product.variants.map((v) => v.colorHex)))
              .slice(0, 4)
              .map((hex) => (
                <span
                  key={hex}
                  className="w-3.5 h-3.5 rounded-full border border-gray-300"
                  style={{ backgroundColor: hex }}
                />
              ))}
          </div>
        )}
      </div>
    </Link>
  );
}
