"use client";

import { useTranslations } from "next-intl";
import { useCheckoutStore } from "@/lib/checkout-store";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { PaymentElement } from "@stripe/react-stripe-js";
import Image from "next/image";

export function PaymentForm() {
  const t = useTranslations("checkout");
  const setStep = useCheckoutStore((s) => s.setStep);
  const clientSecret = useCheckoutStore((s) => s.clientSecret);

  function handleContinue() {
    setStep(4);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-neutral-dark">{t("paymentMethod")}</h3>

      <div className="p-5 bg-neutral-light rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/stripe-logo.svg" alt="Stripe" width={48} height={20} />
          <div>
            <p className="text-sm font-semibold">Stripe</p>
            <p className="text-xs text-gray-500">{t("stripeDescription")}</p>
          </div>
        </div>

        <div className="min-h-[200px]">
          {clientSecret ? (
            <PaymentElement options={{ layout: "tabs" }} />
          ) : (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
          <Lock className="w-3 h-3" />
          <span>{t("stripeSecure")}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          {t("backTo", { step: t("stepShipping") })}
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          {t("reviewOrder")}
        </Button>
      </div>
    </div>
  );
}
