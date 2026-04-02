"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Reveal } from "@/components/ui/reveal";

const topProducts = [
  { id: "1", name: "Pro Elite Jersey", sport: "Football", sold: 452, revenue: "€22,509.60" },
  { id: "2", name: "Court Mastery Shoes", sport: "Basketball", sold: 310, revenue: "€40,300.00" },
  { id: "3", name: "Aero Glide Running Shorts", sport: "Running", sold: 289, revenue: "€10,115.00" },
  { id: "4", name: "PowerGrip Gloves", sport: "Training", sold: 195, revenue: "€4,875.00" },
  { id: "5", name: "ServePro Tennis Racket", sport: "Tennis", sold: 120, revenue: "€23,880.00" },
];

const recentOrders = [
  { id: "#ORD-9012", customer: "Michael Chen", total: "€145.00", status: "Processing" },
  { id: "#ORD-9011", customer: "Sarah Jenkins", total: "€89.50", status: "Shipped" },
  { id: "#ORD-9010", customer: "David Rossi", total: "€210.00", status: "Delivered" },
  { id: "#ORD-9009", customer: "Emma Thompson", total: "€45.00", status: "Processing" },
  { id: "#ORD-9008", customer: "James Wilson", total: "€320.00", status: "Pending" },
];

export function TopProductsTable() {
  const t = useTranslations("Dashboard");

  const topProductsCols = [
    { header: t("table.product"), accessor: (p: any) => p.name, className: "font-bold text-neutral-dark whitespace-nowrap" },
    { header: t("table.sport"), accessor: (p: any) => p.sport, className: "font-medium text-gray-500 whitespace-nowrap" },
    { header: t("table.sold"), accessor: (p: any) => p.sold, className: "font-bold text-neutral-dark whitespace-nowrap text-right" },
    { header: t("table.revenue"), accessor: (p: any) => p.revenue, className: "font-bold text-primary whitespace-nowrap text-right" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-bold text-neutral-dark">{t("top_products")}</h2>
      <DataTable data={topProducts} columns={topProductsCols} className="bg-white" pageSize={5} />
    </div>
  );
}

export function RecentOrdersTable() {
  const t = useTranslations("Dashboard");

  const recentOrdersCols = [
    { header: t("table.order_id"), accessor: (o: any) => <Link href={`/orders/${o.id}`} className="text-primary font-bold hover:underline">{o.id}</Link> },
    { header: t("table.customer"), accessor: (o: any) => o.customer, className: "font-bold text-neutral-dark whitespace-nowrap" },
    { header: t("table.total"), accessor: (o: any) => o.total, className: "font-bold text-neutral-dark whitespace-nowrap" },
    {
      header: t("table.status"), accessor: (o: any) => (
        <Badge
          variant={
            o.status === "Delivered"   ? "default"   :
            o.status === "Shipped"     ? "secondary" :
            o.status === "Processing"  ? "secondary" :
                                         "outline"
          }
        >
          {o.status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-neutral-dark">{t("recent_orders")}</h2>
        <Link href="/orders" className="text-xs font-bold text-primary hover:underline">{t("view_all")} &rarr;</Link>
      </div>
      <DataTable data={recentOrders} columns={recentOrdersCols} className="bg-white" pageSize={5} />
    </div>
  );
}

export function DetailWidgets() {
  return (
    <Reveal delay={150}>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
        <TopProductsTable />
        <RecentOrdersTable />
      </section>
    </Reveal>
  );
}
