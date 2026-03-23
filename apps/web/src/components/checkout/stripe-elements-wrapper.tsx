"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCheckoutStore } from "@/lib/checkout-store";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/store/auth-store";
import api from "@/utils/api";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface StripeElementsWrapperProps {
  children: ReactNode;
}

export function StripeElementsWrapper({ children }: StripeElementsWrapperProps) {
  const { clientSecret, setClientSecret, step, shippingRate } = useCheckoutStore();
  const items = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  
  const fetchingRef = useRef(false);
  const lastTotalRef = useRef<number | null>(null);

  const subtotal = useCartStore((s) => s.getSubtotal());
  const currentTotal = subtotal + (shippingRate?.price || 0);

  useEffect(() => {
    const shouldFetch = step >= 3 && items.length > 0 && user && shippingRate;
    const totalChanged = lastTotalRef.current !== currentTotal;

    if (shouldFetch && (!clientSecret || totalChanged) && !fetchingRef.current) {
      const initPayment = async () => {
        fetchingRef.current = true;
        setLoading(true);
        try {
          const currentPI = clientSecret?.split('_secret_')[0];
          
          const res = await api.post("/stripe/create-payment-intent", {
            userId: user.id,
            items: items.map(i => ({
              productId: i.productId,
              price: i.variant.price,
              quantity: i.quantity
            })),
            shippingCost: shippingRate.price,
            paymentIntentId: currentPI
          } as any);
          
          if (res.data.clientSecret !== clientSecret) {
            setClientSecret(res.data.clientSecret);
          }
          lastTotalRef.current = currentTotal;
        } catch (err) {
          console.error("Failed to init/update payment intent:", err);
        } finally {
          setLoading(false);
          fetchingRef.current = false;
        }
      };
      initPayment();
    }
  }, [step, clientSecret, items, user, shippingRate, currentTotal, setClientSecret]);

  if (step >= 3 && !clientSecret) {
    return (
      <div className="p-8 text-center bg-neutral-light rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0F172A', // Match your dashboard/primary color
      fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
      borderRadius: '8px',
    },
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: clientSecret || undefined, appearance }}>
      {children}
    </Elements>
  );
}
