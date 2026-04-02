"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SportPerformanceCard() {
  const t = useTranslations("Analytics");

  const sports = [
    { name_key: "sports.football", val: 42500, orders: 412, growth: "+12%" },
    { name_key: "sports.basketball", val: 31200, orders: 284, growth: "+8%" },
    { name_key: "sports.running", val: 28400, orders: 310, growth: "+15%" },
    { name_key: "sports.training", val: 22100, orders: 245, growth: "-2%" },
  ];

  return (
    <Card className="lg:col-span-4" padding="lg" rounded="2xl" shadow="sm">
      <div className="flex items-center gap-2 text-primary mb-8 border-b border-gray-50 pb-5">
        <PieChartIcon size={18} />
        <h3 className="text-sm font-heading font-bold uppercase tracking-widest">{t("sports.title")}</h3>
      </div>
      <div className="space-y-6">
        {sports.map((sport, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-bold text-neutral-dark uppercase tracking-tight">{t(sport.name_key as any)}</span>
              <span className="font-medium text-gray-400">€{(sport.val / 1000).toFixed(1)}k</span>
            </div>
            <div className="h-2 w-full bg-neutral-light rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", i === 0 ? "bg-primary" : "bg-primary/40")}
                style={{ width: `${(sport.val / 42500) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] uppercase font-medium tracking-widest">
              <span className="text-gray-400">{sport.orders} {t("sports.orders")}</span>
              <span className="text-emerald-500">{sport.growth}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
