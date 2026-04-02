"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Check,
  Calendar,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Centralized Components
import { AnalyticsStats } from "@/components/analytics/analytics-stats";
import { RevenueGrowthChart } from "@/components/analytics/revenue-growth-chart";
import { OrderDensityChart } from "@/components/analytics/order-density-chart";
import { SportPerformanceCard } from "@/components/analytics/sport-performance-card";
import { TopProductsTable } from "@/components/analytics/top-products-table";
import { GlobalDistributionCard } from "@/components/analytics/global-distribution-card";

// Data
const revenueData = [
  { name: 'Jan', value: 3100 }, { name: 'Feb', value: 4200 }, { name: 'Mar', value: 3800 },
  { name: 'Apr', value: 5100 }, { name: 'May', value: 4800 }, { name: 'Jun', value: 6200 },
  { name: 'Jul', value: 7100 }, { name: 'Aug', value: 6800 }, { name: 'Sep', value: 8200 },
  { name: 'Oct', value: 7900 }, { name: 'Nov', value: 9400 }, { name: 'Dec', value: 10200 }
];
const orderData = [
  { name: 'W1', value: 45 }, { name: 'W2', value: 52 }, { name: 'W3', value: 48 },
  { name: 'W4', value: 61 }, { name: 'W5', value: 55 }, { name: 'W6', value: 68 },
  { name: 'W7', value: 72 }, { name: 'W8', value: 65 }, { name: 'W9', value: 80 },
  { name: 'W10', value: 74 }, { name: 'W11', value: 88 }, { name: 'W12', value: 95 }
];

const topProducts = [
  { id: "1", name: "Nike Air Zoom Pegasus 40", category: "Running", units: 142, revenue: 18450, rating: 4.8 },
  { id: "2", name: "Nike Mercurial Vapor 15", category: "Football", units: 98, revenue: 24500, rating: 4.9 },
  { id: "3", name: "Nike Dri-FIT DNA+ Shorts", category: "Basketball", units: 210, revenue: 11550, rating: 4.6 },
  { id: "4", name: "Nike Zoom Freak 5", category: "Basketball", units: 65, revenue: 9750, rating: 4.7 },
];

export default function AnalyticsPage() {
  const t = useTranslations("Analytics");
  const [timeframe, setTimeframe] = useState("30_days");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);

  const timeframeOptions = [
    { label: t("timeframes.30_days"), value: "30_days" },
    { label: t("timeframes.7_days"), value: "7_days" },
    { label: t("timeframes.ytd"), value: "ytd" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10 pt-2">

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-xl space-y-2">
          <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
            {t("title_part1")} <span className="text-primary">{t("title_part2")}</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">
            {t("description")}
          </p>
        </div>

        <div className="flex gap-3 relative z-40">
          <Button variant="outline" size="sm">
            <Download size={16} />
            {t("export")}
          </Button>

          <div className="relative">
            <Button
              variant={isTimeframeOpen ? "default" : "outline"}
              onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
              size="sm"
            >
              <Calendar size={16} />
              {timeframeOptions.find(o => o.value === timeframe)?.label}
              <ChevronDown size={14} className={cn("ml-1 transition-transform", isTimeframeOpen && "rotate-180")} />
            </Button>

            {isTimeframeOpen && (
              <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-200">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeframe(option.value);
                      setIsTimeframeOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-5 py-3 text-[13px] font-bold transition-colors flex items-center justify-between",
                      timeframe === option.value
                        ? "bg-primary/5 text-primary"
                        : "text-gray-500 hover:bg-neutral-light hover:text-neutral-dark"
                    )}
                  >
                    {option.label}
                    {timeframe === option.value && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* PRIMARY KPIs */}
      <AnalyticsStats />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-0 relative">
        <RevenueGrowthChart data={revenueData} />
        <OrderDensityChart data={orderData} />
      </div>

      {/* Secondary Row: Products & Sports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <SportPerformanceCard />
        <TopProductsTable products={topProducts} />
      </div>

      {/* Global Distribution Card */}
      <GlobalDistributionCard />

    </div>
  );
}
