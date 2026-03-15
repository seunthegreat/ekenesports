"use client";

import { Sheet } from "../ui/sheet";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());

  return (
    <Sheet open={open} onClose={onClose} side="right" title={t("title")}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <p className="text-gray-500 mb-4">{t("empty")}</p>
          <Button variant="outline" onClick={onClose}>
            {t("continueShopping")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3 bg-neutral-light p-3">
                <div className="relative w-20 h-20 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.images[0]?.url || ""}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.variant.color} / {item.variant.size}
                  </p>
                  <p className="text-sm font-mono font-semibold mt-1">
                    {formatPrice(item.variant.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-6 h-6 rounded border flex items-center justify-center hover:bg-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-6 h-6 rounded border flex items-center justify-center hover:bg-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="ml-auto text-gray-400 hover:text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t("subtotal")}</span>
              <span className="font-mono font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{t("shipping")}</span>
              <span>{t("shippingCalculated")}</span>
            </div>
            <Link href="/cart" onClick={onClose}>
              <Button className="w-full" size="lg">
                {t("checkout")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Sheet>
  );
}
