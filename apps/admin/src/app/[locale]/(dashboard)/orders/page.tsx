"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Trash2,
} from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { Order, OrderStatus } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ActionMenu } from "@/components/ui/action-menu";
import { StatusBadge } from "@/components/ui/badge";
import { toast } from "sonner";
import { OrderStats } from "@/components/orders/order-stats";
import { OrderFilter } from "@/components/orders/order-filter";

export default function OrdersPage() {
  const t = useTranslations("Orders");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const statusStyles: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
    confirmed:        { label: t("status.confirmed"),        bg: "bg-primary/5",   text: "text-primary",       dot: "bg-primary"       },
    processing:       { label: t("status.processing"),       bg: "bg-secondary/10", text: "text-secondary",     dot: "bg-secondary"     },
    shipped:          { label: t("status.shipped"),          bg: "bg-primary/5",   text: "text-primary",       dot: "bg-primary"       },
    in_transit:       { label: t("status.in_transit"),       bg: "bg-primary/5",   text: "text-primary",       dot: "bg-primary-light"  },
    out_for_delivery: { label: t("status.out_for_delivery"), bg: "bg-primary/10",  text: "text-primary-light", dot: "bg-primary-light"  },
    delivered:        { label: t("status.delivered"),        bg: "bg-primary/10",  text: "text-primary-light", dot: "bg-primary-light"  },
    cancelled:        { label: t("status.cancelled"),        bg: "bg-error/5",     text: "text-error",         dot: "bg-error"         },
    refunded:         { label: t("status.refunded"),         bg: "bg-gray-50",     text: "text-gray-500",      dot: "bg-gray-300"      },
  };

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const currentStatus = searchParams.get("status") || "all";

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isFilterOpen]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const processedOrders = useMemo(() => {
    return mockOrders.map(o => ({
      ...o,
      customerName: `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`,
      itemCount: o.items.reduce((s, i) => s + i.quantity, 0)
    })).filter(o => {
      const matchSearch = !search ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o?.shippingAddress?.email?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = currentStatus === "all" || o.status === currentStatus;

      return matchSearch && matchStatus;
    });
  }, [search, currentStatus]);

  const columns = [
    {
      header: t("table.customer"),
      id: "customerName",
      sortable: true,
      accessor: (order: any) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="text-[11px] font-heading font-bold text-primary uppercase tracking-wider mb-0.5">{order.orderNumber}</span>
          <h4 className="text-sm font-bold text-neutral-dark">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</h4>
          <span className="text-xs text-gray-400 font-medium uppercase truncate max-w-[150px]">{order.shippingAddress.email}</span>
        </div>
      ),
      className: "w-full"
    },
    {
      header: t("table.items"),
      id: "itemCount",
      sortable: true,
      accessor: (order: any) => {
        const totalItems = order.itemCount;
        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-dark">
              {totalItems === 1 ? t("table.item", { count: 1 }) : t("table.items_plural", { count: totalItems })}
            </span>
            <span className="text-xs text-gray-400 font-medium uppercase">{order.items[0]?.name}</span>
          </div>
        );
      },
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.status"),
      id: "status",
      sortable: true,
      accessor: (order: Order) => {
        const style = statusStyles[order.status] || statusStyles.confirmed;
        return (
          <StatusBadge
            label={style.label}
            bg={style.bg}
            text={style.text}
            dot={style.dot}
          />
        );
      },
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.total"),
      id: "total",
      sortable: true,
      accessor: (order: Order) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-neutral-dark font-mono">€{order.total.toFixed(2)}</span>
          <span className="text-xs text-gray-400 font-medium uppercase">{order.payment.method}</span>
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.date"),
      id: "createdAt",
      sortable: true,
      accessor: (order: Order) => (
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar size={13} className="opacity-40" />
          <span className="text-xs font-medium uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.actions"),
      accessor: (order: Order) => (
        <div className="flex items-center">
          <ActionMenu items={[
            {
              label: t("actions.view"),
              icon: Eye,
              onClick: () => router.push(`/orders/${order.id}`)
            },
            {
              label: t("actions.delete"),
              icon: Trash2,
              onClick: () => setDeleteOrder(order),
              variant: "danger"
            }
          ]} />
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-12 animate-in fade-in duration-700 pb-20 pt-2">
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
        <div className="relative" ref={filterRef}>
          <Button
            variant={isFilterOpen ? "default" : "outline"}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            size="sm"
          >
            <Filter size={16} />
            {t("filters.title")}
          </Button>

          <OrderFilter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            currentStatus={currentStatus}
            onUpdate={updateFilter}
          />
        </div>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Stats Cards */}
      <OrderStats />

      {/* Main Order Table */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <Input
              placeholder={t("search")}
              className="pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          data={processedOrders}
          columns={columns}
          onRowClick={(order) => router.push(`/orders/${order.id}`)}
          className="border-gray-100/60 shadow-sm"
        />
      </section>

      <ConfirmDialog
        isOpen={!!deleteOrder}
        onClose={() => setDeleteOrder(null)}
        title={t("modal.delete_title")}
        description={t("modal.delete_desc", { orderNumber: deleteOrder?.orderNumber || "" })}
        onConfirm={() => {
          toast.success(t("modal.delete_success", { orderNumber: deleteOrder?.orderNumber || "" }));
          setDeleteOrder(null);
        }}
        confirmLabel={t("modal.delete_confirm")}
        variant="danger"
      />
    </div>
  );
}
