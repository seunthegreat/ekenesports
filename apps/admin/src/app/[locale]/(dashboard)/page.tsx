"use client";

import { Reveal } from "@/components/ui/reveal";
import { useTranslations } from "next-intl";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { DetailWidgets } from "@/components/dashboard/widgets";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Page Header */}
      <div className="max-w-xl space-y-2">
        <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
          {t("welcome")} <span className="text-primary">Ekene Sport</span> Admin
        </h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">
          {t("description")}
        </p>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Stats Grid */}
      <StatsGrid />

      {/* Detail Widgets */}
      <DetailWidgets />

      {/* Alerts & Critical Info */}
      <LowStockAlert />
    </div>
  );
}
