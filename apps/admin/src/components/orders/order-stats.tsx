"use client";

import { useTranslations } from "next-intl";
import { CircleDollarSign, Clock, Truck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function OrderStats() {
  const t = useTranslations("Orders");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl" border="primary">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <CircleDollarSign size={20} />
        </div>
        <div>
          <p className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.revenue")}</p>
          <h3 className="text-xl font-heading font-bold text-neutral-dark">€2,480.00</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.pending")}</p>
          <h3 className="text-xl font-heading font-bold text-neutral-dark">{t("stats.orders_count", { count: 12 })}</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Truck size={20} />
        </div>
        <div>
          <p className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.shipped")}</p>
          <h3 className="text-xl font-heading font-bold text-neutral-dark">{t("stats.orders_count", { count: 84 })}</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary-light">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <p className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.completed")}</p>
          <h3 className="text-xl font-heading font-bold text-neutral-dark">{t("stats.orders_count", { count: 412 })}</h3>
        </div>
      </Card>
    </div>
  );
}
