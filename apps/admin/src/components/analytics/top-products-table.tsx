"use client";

import { ShoppingBag, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/ui/data-table";

interface TopProduct {
  id: string;
  name: string;
  category: string;
  units: number;
  revenue: number;
  rating: number;
}

interface TopProductsTableProps {
  products: TopProduct[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const t = useTranslations("Analytics");

  const topProductsColumns = [
    {
      header: t("table.name"),
      accessor: (p: TopProduct) => (
        <div className="text-sm font-bold text-neutral-dark hover:text-primary transition-colors cursor-pointer">{p.name}</div>
      ),
      className: "w-full"
    },
    {
      header: t("table.category"),
      accessor: (p: TopProduct) => (
        <span className="text-[10px] font-medium bg-neutral-light px-2 py-1 rounded text-gray-400">{p.category}</span>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.units"),
      accessor: (p: TopProduct) => (
        <span className="text-sm font-bold text-neutral-dark">{p.units}</span>
      ),
      className: "w-0 whitespace-nowrap text-right"
    },
    {
      header: t("table.revenue"),
      accessor: (p: TopProduct) => (
        <span className="text-sm font-bold text-primary">€{p.revenue.toLocaleString()}</span>
      ),
      className: "w-0 whitespace-nowrap text-right"
    },
    {
      header: t("table.rating"),
      accessor: (p: TopProduct) => (
        <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-amber-500">
          <Star size={12} className="fill-amber-500 text-amber-500" /> {p.rating}
        </div>
      ),
      className: "w-0 whitespace-nowrap text-right mb-0"
    }
  ];

  return (
    <div className="lg:col-span-8 z-0">
      <div className="mb-4 pt-1">
        <div className="flex items-center gap-2 text-primary">
          <ShoppingBag size={14} />
          <h3 className="text-sm font-heading font-bold uppercase tracking-widest">{t("table.top_skus_title")}</h3>
        </div>
      </div>

      <DataTable
        data={products}
        columns={topProductsColumns}
        className="border-gray-100/60 shadow-sm bg-white"
        onRowClick={() => { }}
      />
    </div>
  );
}
