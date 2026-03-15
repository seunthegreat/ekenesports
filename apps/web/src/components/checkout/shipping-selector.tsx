"use client";

import { useTranslations } from "next-intl";
import { useCheckoutStore } from "@/lib/checkout-store";
import { useCartStore } from "@/lib/cart-store";
import { getShippingRates } from "@/lib/dhl-shipping";
import { formatPrice } from "@/lib/utils";
import { RadioCard } from "@/components/ui/radio-card";
import { Button } from "@/components/ui/button";
import { ShippingRate } from "@/lib/types";
import { useState } from "react";
import { Truck } from "lucide-react";

export function ShippingSelector() {
  const t = useTranslations("checkout");
  const address = useCheckoutStore((s) => s.address);
  const existingRate = useCheckoutStore((s) => s.shippingRate);
  const setShippingRate = useCheckoutStore((s) => s.setShippingRate);
  const setStep = useCheckoutStore((s) => s.setStep);
  const subtotal = useCartStore((s) => s.getSubtotal());

  const rates = address ? getShippingRates(address.country, subtotal) : [];
  const [selected, setSelected] = useState<ShippingRate | null>(existingRate ?? rates[0] ?? null);

  function handleContinue() {
    if (selected) setShippingRate(selected);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-neutral-dark">{t("shippingMethod")}</h3>

      <div className="space-y-3">
        {rates.map((rate) => (
          <RadioCard
            key={rate.id}
            selected={selected?.id === rate.id}
            onClick={() => setSelected(rate)}
            label={rate.name}
            description={`${rate.description} — ${t("estimatedDelivery", { min: rate.estimatedDays.min, max: rate.estimatedDays.max })}`}
            right={
              <span className={rate.price === 0 ? "text-primary font-bold" : ""}>
                {rate.price === 0 ? t("freeShipping") : formatPrice(rate.price)}
              </span>
            }
          >
            <div className="flex items-center gap-1.5 mt-1.5">
              <Truck className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">DHL</span>
            </div>
          </RadioCard>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          {t("backTo", { step: t("stepInformation") })}
        </Button>
        <Button onClick={handleContinue} disabled={!selected} className="flex-1">
          {t("continueToPayment")}
        </Button>
      </div>
    </div>
  );
}
