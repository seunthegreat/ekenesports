"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export function MarketingSettingsCard() {
  const t = useTranslations("General");

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-neutral-dark mb-2">
        <MessageSquare size={18} />
        <h2 className="text-sm font-bold text-neutral-dark">{t("marketing")}</h2>
      </div>

      <Card className="p-6 space-y-6 bg-neutral-dark text-white border-white/5" rounded="2xl" border="primary">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 block ml-1">{t("promo")}</label>
          <textarea
            defaultValue={t("defaults.promo")}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium outline-none focus:border-primary-light/50 transition-all h-24 resize-none"
          />
        </div>
        <div className="flex items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-gray-400">
          <MessageSquare size={14} className="text-primary-light" />
          {t("marketing_desc")}
        </div>
      </Card>
    </section>
  );
}
