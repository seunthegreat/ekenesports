"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  X,
  Truck,
  CheckCircle2,
  Clock,
  CircleDollarSign,
  TrendingDown,
  ArrowRight,
  ChevronRight,
  MoreVertical,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Package
} from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ActionMenu } from "@/components/ui/action-menu";
import { toast } from "sonner";

export default function OrdersPage() {
  const t = useTranslations("Orders");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const statusStyles: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
    confirmed: { label: t("status.confirmed"), bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
    processing: { label: t("status.processing"), bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
    shipped: { label: t("status.shipped"), bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    in_transit: { label: t("status.in_transit"), bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    out_for_delivery: { label: t("status.out_for_delivery"), bg: "bg-sky-50", text: "text-sky-600", dot: "bg-sky-500" },
    delivered: { label: t("status.delivered"), bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    cancelled: { label: t("status.cancelled"), bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    refunded: { label: t("status.refunded"), bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
  };

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const currentStatus = searchParams.get("status") || "all";
  const currentTime = searchParams.get("time") || "all";

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
          <span className="text-[10px] text-gray-400 font-medium uppercase truncate max-w-[150px]">{order.shippingAddress.email}</span>
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
            <span className="text-[10px] text-gray-400 font-medium uppercase">{order.items[0]?.name}</span>
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
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border transition-all",
            style.bg, style.text, "border-transparent"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
            {style.label}
          </span>
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
          <span className="text-[10px] text-gray-400 font-medium uppercase">{order.payment.method}</span>
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
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed mt-2">
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
            {t("filters.button")}
          </Button>

          {/* Quick Filter Panel */}
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("filters.title")}</h3>
                <button onClick={() => setIsFilterOpen(false)}><X size={14} className="text-gray-300" /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest ml-1">{t("filters.status")}</label>
                  <Select
                    value={currentStatus}
                    onChange={(e) => updateFilter("status", e.target.value)}
                  >
                    <option value="all">{t("filters.all_statuses")}</option>
                    <option value="confirmed">{t("status.confirmed")}</option>
                    <option value="processing">{t("status.processing")}</option>
                    <option value="shipped">{t("status.shipped")}</option>
                    <option value="delivered">{t("status.delivered")}</option>
                    <option value="cancelled">{t("status.cancelled")}</option>
                    <option value="refunded">{t("status.refunded")}</option>
                  </Select>
                </div>

                {currentStatus !== "all" && (
                  <button
                    onClick={() => updateFilter("status", "all")}
                    className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-error transition-colors text-center"
                  >
                    {t("filters.clear")}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-5" padding="sm" rounded="2xl" border="primary">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <CircleDollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.revenue")}</p>
            <h3 className="text-xl font-heading font-bold text-neutral-dark">€2,480.00</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.pending")}</p>
            <h3 className="text-xl font-heading font-bold text-neutral-dark">{t("stats.orders_count", { count: 12 })}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
            <Truck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.shipped")}</p>
            <h3 className="text-xl font-heading font-bold text-neutral-dark">{t("stats.orders_count", { count: 84 })}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("stats.completed")}</p>
            <h3 className="text-xl font-heading font-bold text-neutral-dark">{t("stats.orders_count", { count: 412 })}</h3>
          </div>
        </Card>
      </div>

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
