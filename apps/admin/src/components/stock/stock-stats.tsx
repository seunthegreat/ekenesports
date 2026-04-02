"use client";

import { Database, AlertTriangle, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

interface StockStatsProps {
  totalInventory: number;
  lowStockCount: number;
  healthyCount: number;
}

export function StockStats({ totalInventory, lowStockCount, healthyCount }: StockStatsProps) {
  const t = useTranslations("Stock");

  const stats = [
    { label: t("stats.total"), value: totalInventory, icon: Database, color: "primary" },
    { label: t("stats.alerts"), value: lowStockCount, icon: AlertTriangle, color: "error" },
    { label: t("stats.healthy"), value: healthyCount, icon: PackageCheck, color: "primary" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="flex items-center gap-6" padding="md" rounded="2xl" border={i === 0 ? "primary" : undefined}>
          <div className={`w-14 h-14 bg-${stat.color}/10 rounded-2xl flex items-center justify-center text-${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-heading font-bold text-${stat.color === 'error' ? 'error' : 'neutral-dark'} leading-none`}>{stat.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
