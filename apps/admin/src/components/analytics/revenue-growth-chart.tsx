"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueData {
  name: string;
  value: number;
}

interface RevenueGrowthChartProps {
  data: RevenueData[];
}

export function RevenueGrowthChart({ data }: RevenueGrowthChartProps) {
  const t = useTranslations("Analytics");

  return (
    <Card className="lg:col-span-7 overflow-hidden" padding="lg" rounded="2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-heading font-bold text-neutral-dark">{t("charts.revenue.title")}</h3>
          <p className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-widest">{t("charts.revenue.subtitle")}</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> 2026</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-100" /> {t("charts.revenue.target")}</div>
        </div>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A6847" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0A6847" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `€${(val / 1000)}k`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 'bold', color: '#1A1A2E' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`€${Number(value || 0).toLocaleString()}`, t("charts.revenue.revenue_label")]}
            />
            <Area type="monotone" dataKey="value" stroke="#0A6847" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
