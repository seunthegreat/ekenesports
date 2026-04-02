"use client";

import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GlobalDistributionCard() {
  const t = useTranslations("Analytics");

  const regions = [
    { name_key: "geo.regions.germany", value: 45, color: "bg-primary" },
    { name_key: "geo.regions.uk", value: 25, color: "bg-primary/60" },
    { name_key: "geo.regions.france", value: 15, color: "bg-primary/40" },
    { name_key: "geo.regions.other_eu", value: 15, color: "bg-primary/20" },
  ];

  return (
    <Card padding="lg" rounded="2xl" border="primary" className="bg-neutral-dark text-white overflow-hidden relative mt-8">
      <div className="absolute top-0 right-[-10%] w-[50%] h-full opacity-10 pointer-events-none">
        <Globe size={400} className="translate-x-1/4 -translate-y-1/4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-3 text-primary-light">
            <Globe size={24} />
            <h3 className="text-xl font-heading font-bold tracking-tight">{t("geo.title")}</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">
            {t("geo.desc", { main_market: t("geo.regions.germany") })}
          </p>
          <div className="pt-4">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              {t("geo.expand")}
            </Button>
          </div>
        </div>
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-6">
          {regions.map((reg, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t(reg.name_key as any)}</span>
                <span className="text-lg font-bold text-white">{reg.value}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", reg.color)}
                  style={{ width: `${reg.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
