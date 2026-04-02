"use client";

import { ShoppingBag, ArrowLeft, Euro, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Customer } from "@/lib/types";

interface CustomerKeyMetricsProps {
  customer: Customer;
}

export function CustomerKeyMetrics({ customer }: CustomerKeyMetricsProps) {
  const t = useTranslations("Customers");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card padding="md" rounded="2xl" border="primary">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <ShoppingBag size={18} />
          </div>
          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
            <ArrowLeft size={10} className="rotate-135" /> {t("stats.growth")}
          </span>
        </div>
        <h4 className="text-3xl font-heading font-bold text-neutral-dark leading-none">{customer.totalOrders}</h4>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-0.5">{t("table.orders")}</p>
      </Card>

      <Card padding="md" rounded="2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <Euro size={18} />
          </div>
        </div>
        <h4 className="text-3xl font-heading font-bold text-neutral-dark leading-none">€{customer.totalSpend.toFixed(2)}</h4>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-0.5">{t("table.spent")}</p>
      </Card>

      <Card padding="md" rounded="2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
            <CreditCard size={18} />
          </div>
        </div>
        <h4 className="text-3xl font-heading font-bold text-neutral-dark leading-none">€{(customer.totalSpend / customer.totalOrders || 0).toFixed(2)}</h4>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-0.5">{t("detail.basket_size")}</p>
      </Card>
    </div>
  );
}
