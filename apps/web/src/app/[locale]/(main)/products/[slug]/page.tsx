"use client";

import { useParams } from "next/navigation";
import { getProductBySlug, getRelatedProducts, sports, categories } from "@/lib/data";
import { ProductGallery } from "@/components/product/product-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Product, Variant } from "@/lib/types";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ShoppingBag, Star, ChevronRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { trpc } from "@/utils/trpc";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const addItem = useCartStore((s) => s.addItem);
  
  // 1. Fetch from live DB
  const { data: dbProduct, isLoading } = trpc.products.getBySlug.useQuery({ slug });

  // 2. Fallback to mock if not found in DB
  const mockProduct = getProductBySlug(slug);
  const product = dbProduct ? (dbProduct as Product) : mockProduct;

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [added, setAdded] = useState(false);

  // Initialize selected variant once product is available
  useEffect(() => {
    if (product?.variants?.length && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-pulse">Loading product details...</div>;
  }

  if (!product) {
    notFound();
  }

  const sport = sports.find((s) => s.id === product.sportId);
  const category = categories.find((c) => c.id === product.categoryId);
  const related = getRelatedProducts(product, 4);

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    addItem(product, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        {sport && (
          <>
            <Link href={`/sports/${sport.slug}`} className="hover:text-primary">{sport.name}</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          </>
        )}
        {category && (
          <>
            <Link href={`/categories/${category.slug}`} className="hover:text-primary">{category.name}</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          </>
        )}
        <span className="text-neutral-dark truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images} />

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">
                {t("reviews", { count: product.reviewCount })}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl font-bold">
              {formatPrice(selectedVariant?.price || product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="font-mono text-lg text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {product.compareAtPrice && <Badge variant="sale">Sale</Badge>}
          </div>

          {/* Variant selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />

          {/* Stock status */}
          {selectedVariant && (
            <p
              className={`text-sm font-medium ${
                selectedVariant.stock === 0
                  ? "text-error"
                  : selectedVariant.stock <= 5
                  ? "text-secondary"
                  : "text-primary"
              }`}
            >
              {selectedVariant.stock === 0
                ? tCommon("outOfStock")
                : selectedVariant.stock <= 5
                ? t("lowStock", { count: selectedVariant.stock })
                : t("inStock")}
            </p>
          )}

          {/* Add to cart */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> {tCommon("addedToCart")}
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" /> {tCommon("addToCart")}
              </>
            )}
          </Button>

          {/* SKU */}
          {selectedVariant && (
            <p className="text-xs text-gray-400">
              {t("sku")}: {selectedVariant.sku}
            </p>
          )}

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="font-heading font-bold text-sm mb-2">{t("description")}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-neutral-dark mb-6">
            {t("relatedProducts")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
