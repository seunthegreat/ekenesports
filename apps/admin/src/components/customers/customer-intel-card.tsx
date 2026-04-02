"use client";

import { History } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export function CustomerIntelCard() {
  const t = useTranslations("Customers");

  return (
    <Card padding="md" rounded="2xl" className="bg-neutral-light/30 border-dashed border-2">
      <div className="flex flex-col items-center justify-center text-center py-10 space-y-5">
        <div className="w-14 h-14 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-300 shadow-sm">
          <History size={24} />
        </div>
        <div className="max-w-[320px] space-y-1.5">
          <h4 className="text-sm font-bold text-neutral-dark">{t("detail.intel_tracking")}</h4>
          <p className="text-xs text-gray-400 leading-relaxed px-4">
            {t("detail.intel_desc")}
          </p>
        </div>
        <button className="px-6 py-2.5 text-[10px] font-bold text-primary border border-primary/20 rounded-xl uppercase tracking-widest hover:bg-primary/5 transition-all shadow-sm bg-white">
          {t("detail.setup_auto")}
        </button>
      </div>
    </Card>
  );
}
