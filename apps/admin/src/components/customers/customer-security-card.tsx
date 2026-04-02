"use client";

import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Customer } from "@/lib/types";

interface CustomerSecurityCardProps {
  customer: Customer;
  onBlock: () => void;
}

export function CustomerSecurityCard({ customer, onBlock }: CustomerSecurityCardProps) {
  const t = useTranslations("Customers");

  return (
    <Card padding="md" rounded="2xl" className="border-error/10 bg-error/[0.01] space-y-6">
      <div className="flex items-center gap-3 text-error">
        <div className="w-9 h-9 bg-error/10 rounded-xl flex items-center justify-center">
          <ShieldAlert size={18} />
        </div>
        <h4 className="text-[11px] font-heading font-bold uppercase tracking-[0.2em]">{t("detail.risk_mgmt")}</h4>
      </div>
      <p className="text-xs text-gray-500 font-medium leading-[1.6]">
        {t("detail.risk_desc")}
      </p>
      <button
        onClick={onBlock}
        className="w-full py-3.5 bg-white border border-error/20 text-error text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-error hover:text-white transition-all shadow-sm"
      >
        {customer.status === "blocked" ? t("block.confirm_unblock") : t("block.confirm")}
      </button>
    </Card>
  );
}
