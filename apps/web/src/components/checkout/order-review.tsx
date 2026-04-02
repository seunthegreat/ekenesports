"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useCheckoutStore } from "@/lib/checkout-store";
import { useCartStore } from "@/lib/cart-store";
import { useOrderStore } from "@/lib/order-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { generateWaybill, generateOrderNumber, generateMockTimeline, COUNTRIES } from "@/lib/dhl-shipping";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import Image from "next/image";


export function OrderReview() {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations("checkout");
  const router = useRouter();

  const address = useCheckoutStore((s) => s.address)!;
  const shippingRate = useCheckoutStore((s) => s.shippingRate)!;
  const payment = useCheckoutStore((s) => s.payment)!;
  const setStep = useCheckoutStore((s) => s.setStep);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const addOrder = useOrderStore((s) => s.addOrder);

  const total = subtotal + shippingRate.price;
  const countryName = COUNTRIES.find((c) => c.code === address.country)?.name ?? address.country;

  const user = useAuthStore((s) => s.user);

  // Hook for tRPC mutation
  const initializeOrder = trpc.checkout.initialize.useMutation();

  async function handlePlaceOrder() {
    if (!user || !stripe || !elements) return;

    try {
      // 1. Create the Order in our DB first
      const paymentIntentId = useCheckoutStore.getState().clientSecret?.split('_secret_')[0];
      
      const response = await initializeOrder.mutateAsync({
        userId: user.id,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.product.name,
          variantName: `${item.variant.color} / ${item.variant.size}`,
          price: item.variant.price,
          quantity: item.quantity,
          image: item.product.images[0]?.url || "",
        })),
        total,
        paymentIntentId,
        shippingAddress: address,
        shippingMethod: shippingRate.name,
      });

      const orderId = response.orderId;


      // 2. Confirm the Payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
        },
      });

      if (error) {
        console.error("Stripe confirm error:", error);
        toast.error(error.message || "Payment failed");
      } else {
        // Redirection happens automatically unless there's an immediate error
        clearCart();
        resetCheckout();
      }
    } catch (error: any) {
      console.error("Order process error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <div className="p-4 bg-neutral-light rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">{t("shippingAddress")}</h3>
          <button onClick={() => setStep(1)} className="text-xs text-primary font-medium hover:underline">
            {t("edit")}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          {address.firstName} {address.lastName}<br />
          {address.street}{address.apartment ? `, ${address.apartment}` : ""}<br />
          {address.city}, {address.state} {address.postalCode}<br />
          {countryName}
        </p>
      </div>

      {/* Shipping Method */}
      <div className="p-4 bg-neutral-light rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">{t("shippingMethod")}</h3>
          <button onClick={() => setStep(2)} className="text-xs text-primary font-medium hover:underline">
            {t("edit")}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          {shippingRate.name} — {t("estimatedDelivery", { min: shippingRate.estimatedDays.min, max: shippingRate.estimatedDays.max })}
        </p>
      </div>

      {/* Payment */}
      <div className="p-4 bg-neutral-light rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">{t("paymentMethod")}</h3>
          <button onClick={() => setStep(3)} className="text-xs text-primary font-medium hover:underline">
            {t("edit")}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Credit Card
        </p>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-sm font-semibold mb-3">{t("orderSummary")}</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-3">
              <div className="relative w-14 h-14 bg-neutral-light rounded overflow-hidden flex-shrink-0">
                <Image src={item.product.images[0]?.url ?? ""} alt={item.product.name} fill className="object-cover" sizes="56px" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500">{item.variant.color} / {item.variant.size}</p>
              </div>
              <p className="text-sm font-mono font-semibold">{formatPrice(item.variant.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>{t("subtotal")}</span>
          <span className="font-mono">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>{t("shippingCost")}</span>
          <span className="font-mono">{shippingRate.price === 0 ? t("freeShipping") : formatPrice(shippingRate.price)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base border-t pt-2">
          <span>{t("total")}</span>
          <span className="font-mono">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
          {t("backTo", { step: t("stepPayment") })}
        </Button>
        <Button onClick={handlePlaceOrder} size="lg" className="flex-1">
          {t("placeOrder")}
        </Button>
      </div>
    </div>
  );
}
