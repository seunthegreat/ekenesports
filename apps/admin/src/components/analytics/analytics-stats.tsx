"use client";

import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AnalyticsStats() {
  const t = useTranslations("Analytics");

  const kpis = [
    { label: t("kpis.revenue"), value: "€94,520", trend: "+12.4%", icon: TrendingUp },
    { label: t("kpis.aov"), value: "€168.00", trend: "+5.1%", icon: ShoppingBag },
    { label: t("kpis.customers"), value: "+342", trend: "+8.2%", icon: Users },
    { label: t("kpis.conversion"), value: "3.24%", trend: "-0.4%", icon: Target },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <Card key={i} padding="md" rounded="2xl" shadow="none" border="primary" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              i === 0 ? "bg-primary/10 text-primary" : "bg-neutral-light text-gray-400"
            )}>
              <kpi.icon size={20} />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full",
              kpi.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-error/5 text-error"
            )}>
              {kpi.trend.startsWith("+") ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {kpi.trend}
            </div>
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-gray-400 tracking-widest uppercase">{kpi.label}</p>
            <h3 className="text-2xl font-heading font-bold text-neutral-dark mt-1">{kpi.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
