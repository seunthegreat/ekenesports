"use client";

import { create } from "zustand";
import { ShippingAddress, ShippingRate, PaymentInfo } from "./types";

interface CheckoutStore {
  step: 1 | 2 | 3 | 4;
  address: ShippingAddress | null;
  shippingRate: ShippingRate | null;
  payment: PaymentInfo | null;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setAddress: (address: ShippingAddress) => void;
  setShippingRate: (rate: ShippingRate) => void;
  setPayment: (payment: PaymentInfo) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()((set) => ({
  step: 1,
  address: null,
  shippingRate: null,
  payment: null,

  setStep: (step) => set({ step }),

  setAddress: (address) => set({ address, step: 2 }),

  setShippingRate: (shippingRate) => set({ shippingRate, step: 3 }),

  setPayment: (payment) => set({ payment, step: 4 }),

  reset: () => set({ step: 1, address: null, shippingRate: null, payment: null }),
}));
