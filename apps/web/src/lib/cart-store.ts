"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Variant } from "./types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === variant.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === variant.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, variant.stock) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { productId: product.id, variantId: variant.id, quantity, product, variant }],
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0),
    }),
    {
      name: "ekene-cart",
    }
  )
);
