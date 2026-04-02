"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Order } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";

interface CustomerOrdersTableProps {
  orders: Order[];
}

export function CustomerOrdersTable({ orders }: CustomerOrdersTableProps) {
  const t = useTranslations("Customers");
  const tOrders = useTranslations("Orders");
  const router = useRouter();

  const orderColumns = [
    {
      header: t("table.order"),
      accessor: (order: Order) => (
        <span className="text-[11px] font-heading font-bold text-primary uppercase tracking-wider">{order.orderNumber}</span>
      ),
      className: "w-full"
    },
    {
      header: t("table.status_label"),
      accessor: (order: Order) => (
        <StatusBadge
          label={tOrders(`status.${order.status}`, { defaultValue: order.status })}
          bg={order.status === "delivered" ? "bg-primary/10" : "bg-primary/5"}
          text={order.status === "delivered" ? "text-primary-light" : "text-primary"}
          dot={order.status === "delivered" ? "bg-primary-light" : "bg-primary"}
        />
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.amount"),
      accessor: (order: Order) => (
        <span className="text-sm font-bold text-neutral-dark font-mono">€{order.total.toFixed(2)}</span>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.date"),
      accessor: (order: Order) => (
        <span className="text-xs text-gray-400 font-medium">
          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
      className: "w-0 whitespace-nowrap"
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-heading font-bold text-neutral-dark/60 uppercase tracking-[0.2em]">{t("detail.ledger")}</h3>
        <button className="text-[10px] font-bold text-primary flex items-center gap-1.5 hover:underline uppercase tracking-widest">
          {t("detail.full_history")} <ExternalLink size={12} />
        </button>
      </div>
      <DataTable
        data={orders}
        columns={orderColumns}
        onRowClick={(order) => router.push(`/orders/${order.id}`)}
        className="border-gray-100 shadow-sm"
      />
    </section>
  );
}
