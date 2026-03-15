"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCheckoutStore } from "@/lib/checkout-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import Image from "next/image";

export function PaymentForm() {
  const t = useTranslations("checkout");
  const setPayment = useCheckoutStore((s) => s.setPayment);
  const setStep = useCheckoutStore((s) => s.setStep);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  }

  function handleContinue() {
    setPayment({ method: "stripe" });
  }

  const isValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.replace(/\D/g, "").length === 4 &&
    cvv.length >= 3 &&
    cardHolder.trim().length > 0;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-neutral-dark">{t("paymentMethod")}</h3>

      <div className="p-5 bg-neutral-light rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Image src="/stripe-logo.svg" alt="Stripe" width={48} height={20} />
          <div>
            <p className="text-sm font-semibold">Stripe</p>
            <p className="text-xs text-gray-500">{t("stripeDescription")}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("cardHolder")}</label>
            <Input
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("cardNumber")}</label>
            <Input
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("cardExpiry")}</label>
              <Input
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM / YY"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("cardCvv")}</label>
              <Input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                type="password"
                inputMode="numeric"
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 italic">{t("stripeElementsNote")}</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-4">
          <Lock className="w-3 h-3" />
          <span>{t("stripeSecure")}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          {t("backTo", { step: t("stepShipping") })}
        </Button>
        <Button onClick={handleContinue} disabled={!isValid} className="flex-1">
          {t("reviewOrder")}
        </Button>
      </div>
    </div>
  );
}
