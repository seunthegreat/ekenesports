"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export function OrderSummarySidebar() {
  const t = useTranslations("checkout");
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shippingRate = useCheckoutStore((s) => s.shippingRate);

  const shippingCost = shippingRate?.price ?? 0;
  const total = subtotal + shippingCost;

  return (
    <div className="bg-neutral-light p-5 rounded-lg">
      <h3 className="font-semibold text-sm mb-4">{t("orderSummary")}</h3>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="relative w-12 h-12 bg-white rounded overflow-hidden flex-shrink-0">
              <Image src={item.product.images[0]?.url ?? ""} alt={item.product.name} fill className="object-cover" sizes="48px" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] flex items-center justify-center rounded-full">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{item.product.name}</p>
              <p className="text-[10px] text-gray-500">{item.variant.color} / {item.variant.size}</p>
            </div>
            <p className="text-xs font-mono font-semibold">{formatPrice(item.variant.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span>{t("subtotal")}</span>
          <span className="font-mono">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>{t("shippingCost")}</span>
          <span className="font-mono">
            {shippingRate ? (shippingCost === 0 ? t("freeShipping") : formatPrice(shippingCost)) : "—"}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-sm border-t pt-2">
          <span>{t("total")}</span>
          <span className="font-mono">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
