"use client";

import { 
  Users, 
  BadgeCheck, 
  Euro, 
  ArrowUpRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function CustomerStats() {
  const t = useTranslations("Customers");
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl" border="primary">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Users size={20} />
        </div>
        <div>
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.total")}</p>
          <h3 className="text-xl font-heading font-bold text-neutral-dark">1,284</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
          <BadgeCheck size={20} />
        </div>
        <div>
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.active")}</p>
          <h3 className="text-xl font-heading font-bold text-neutral-dark">942</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
          <Euro size={20} />
        </div>
        <div>
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.avg_ltv")}</p>
          <h3 className="text-xl font-heading font-bold text-neutral-dark">€184.20</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
          <ArrowUpRight size={20} />
        </div>
        <div>
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.growth")}</p>
          <h3 className="text-xl font-heading font-bold text-neutral-dark">+12.4%</h3>
        </div>
      </Card>
    </div>
  );
}
