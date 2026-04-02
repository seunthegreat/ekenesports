"use client";

import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Order } from "@/lib/types";

interface OrderShippingCardProps {
  order: Order;
}

export function OrderShippingCard({ order }: OrderShippingCardProps) {
  const t = useTranslations("Orders");

  return (
    <Card className="space-y-4" padding="md" shadow="sm">
      <h3 className="text-xs font-heading font-bold text-neutral-dark/60 uppercase tracking-widest flex items-center gap-2">
        <Truck size={14} className="text-primary" />
        {t("detail.shipping_method")}
      </h3>
      <div className="space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
            <Truck size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-dark">{order.shippingRate.name}</p>
            <p className="text-[10px] text-gray-400 font-medium">{order.shippingRate.description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
