"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order } from "./types";

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (orderNumber: string) => Order | undefined;
  getOrderByWaybill: (waybill: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      getOrder: (orderNumber) =>
        get().orders.find((o) => o.orderNumber === orderNumber),

      getOrderByWaybill: (waybill) =>
        get().orders.find((o) => o.waybill === waybill),
    }),
    {
      name: "ekene-orders",
    }
  )
);
