"use client";

import { useCartStore } from "@/lib/cart-store";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const t = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">{t("empty")}</h1>
        <Link href="/products">
          <Button variant="outline" className="mt-4">{t("continueShopping")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">{t("title")}</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4 p-4 bg-neutral-light">
            <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden flex-shrink-0">
              <Image
                src={item.product.images[0]?.url || ""}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.slug}`} className="font-medium hover:text-primary">
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-500 mt-0.5">
                {item.variant.color} / {item.variant.size}
              </p>
              <p className="font-mono font-semibold mt-2">{formatPrice(item.variant.price)}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border rounded-lg bg-white">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-gray-400 hover:text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="ml-auto font-mono font-semibold">
                  {formatPrice(item.variant.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-neutral-light p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span>{t("subtotal")}</span>
          <span className="font-mono font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{t("shipping")}</span>
          <span>{t("shippingCalculated")}</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>{t("total")}</span>
          <span className="font-mono text-lg">{formatPrice(subtotal)}</span>
        </div>
        <Link href="/checkout">
          <Button size="lg" className="w-full mt-4">{t("checkout")}</Button>
        </Link>
      </div>
    </div>
  );
}
