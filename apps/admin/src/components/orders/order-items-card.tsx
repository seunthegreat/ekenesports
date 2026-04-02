"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Order } from "@/lib/types";

interface OrderItemsCardProps {
  order: Order;
}

export function OrderItemsCard({ order }: OrderItemsCardProps) {
  const t = useTranslations("Orders");

  return (
    <Card className="space-y-6 overflow-hidden" padding="none">
      <div className="px-6 py-5 border-b border-gray-50 bg-neutral-light/30 flex items-center justify-between">
        <h2 className="text-sm font-heading font-bold text-neutral-dark flex items-center gap-2 uppercase tracking-wider">
          {t("detail.items_title")}
        </h2>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("detail.sku_fulfillment")}</span>
      </div>
      <div className="divide-y divide-gray-50">
        {order.items.map((item, idx) => (
          <div key={idx} className="p-6 flex items-center gap-6 group hover:bg-neutral-light/20 transition-colors">
            <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-neutral-dark truncate mb-1">{item.name}</h4>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                  {item.variant}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{t("detail.qty", { count: item.quantity })}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-neutral-dark font-mono italic">€{item.price.toFixed(2)}</p>
              <p className="text-[10px] text-gray-300 font-medium line-through">€{(item.price + 10).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Totals Section */}
      <div className="bg-neutral-light/20 p-8 border-t border-gray-50">
        <div className="max-w-[300px] ml-auto space-y-3">
          <div className="flex justify-between text-xs font-bold text-gray-400">
            <span>{t("detail.subtotal")}</span>
            <span className="text-neutral-dark">€{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-400">
            <span>{t("detail.shipping_cost", { method: "DHL" })}</span>
            <span className="text-neutral-dark">€{order.shippingCost.toFixed(2)}</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-heading font-bold text-neutral-dark uppercase tracking-widest text-primary">{t("detail.total_amount")}</span>
            <span className="text-xl font-heading font-bold text-neutral-dark font-mono">€{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
