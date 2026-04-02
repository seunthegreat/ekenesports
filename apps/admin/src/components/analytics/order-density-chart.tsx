"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OrderData {
  name: string;
  value: number;
}

interface OrderDensityChartProps {
  data: OrderData[];
}

export function OrderDensityChart({ data }: OrderDensityChartProps) {
  const t = useTranslations("Analytics");

  return (
    <Card className="lg:col-span-5" padding="lg" rounded="2xl">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-heading font-bold text-neutral-dark">{t("charts.orders.title")}</h3>
        <p className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-widest">{t("charts.orders.subtitle")}</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: '#F1F5F9' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [t("charts.orders.orders_label", { count: value || 0 }), t("charts.orders.volume_label")]}
            />
            <Bar dataKey="value" fill="#0A6847" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
