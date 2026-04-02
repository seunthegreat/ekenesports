"use client";

import { useTranslations } from "next-intl";
import { CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";

export function OrderPaymentCard() {
  const t = useTranslations("Orders");

  return (
    <Card className="space-y-4" padding="md" shadow="sm">
      <h3 className="text-xs font-heading font-bold text-neutral-dark/60 uppercase tracking-widest flex items-center gap-2">
        <CreditCard size={14} className="text-primary" />
        {t("detail.payment_details")}
      </h3>
      <div className="space-y-3 bg-neutral-light/50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight italic">{t("detail.transaction_id")}</span>
          <span className="text-[11px] font-bold text-neutral-dark font-mono uppercase">ch_2Nf82mE...</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight italic">{t("detail.payment_status")}</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-100">{t("detail.paid_full")}</span>
        </div>
      </div>
    </Card>
  );
}
