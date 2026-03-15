"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";
import { Link } from "@/i18n/routing";
import { Stepper } from "@/components/ui/stepper";
import { AddressForm } from "@/components/checkout/address-form";
import { ShippingSelector } from "@/components/checkout/shipping-selector";
import { PaymentForm } from "@/components/checkout/payment-form";
import { OrderReview } from "@/components/checkout/order-review";
import { OrderSummarySidebar } from "@/components/checkout/order-summary-sidebar";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const items = useCartStore((s) => s.items);
  const step = useCheckoutStore((s) => s.step);

  const steps = [t("stepInformation"), t("stepShipping"), t("stepPayment"), t("stepReview")];

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">{t("emptyCart")}</h1>
        <Link href="/products">
          <Button variant="outline" className="mt-4">{t("backToShop")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">{t("title")}</h1>

      <div className="mb-8">
        <Stepper steps={steps} currentStep={step} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && <AddressForm />}
          {step === 2 && <ShippingSelector />}
          {step === 3 && <PaymentForm />}
          {step === 4 && <OrderReview />}
        </div>
        <div className="order-first lg:order-last">
          <div className="lg:sticky lg:top-24">
            <OrderSummarySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
