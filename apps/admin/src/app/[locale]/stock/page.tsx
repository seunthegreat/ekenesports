"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Database,
  Save,
  AlertTriangle,
  TrendingUp,
  PackageCheck,
  Filter,
  X,
  Edit2,
  ArrowRight,
  Eye,
  History,
  MoreVertical
} from "lucide-react";
import { ActionMenu } from "@/components/ui/action-menu";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/components/ui/badge";

export default function StockManagementPage() {
  const t = useTranslations("Stock");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<any>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const currentLevel = searchParams.get("level") || "all";
  const currentSport = searchParams.get("sport") || "all";

  // Click outside filter panel
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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

  // Flatten products into variants for the stock table
  const allVariants = useMemo(() => {
    return mockProducts.flatMap(product =>
      product.variants.map(v => ({
        ...v,
        productName: product.name,
        productId: product.id,
        imageUrl: product.images?.[0]?.url,
        sport: product.sportId
      }))
    );
  }, []);

  const processedVariants = useMemo(() => {
    return allVariants.filter(v => {
      const matchSearch = !search ||
        v.productName.toLowerCase().includes(search.toLowerCase()) ||
        v.sku.toLowerCase().includes(search.toLowerCase());

      const matchLevel = currentLevel === "all" ||
        (currentLevel === "low" && v.stock < 10) ||
        (currentLevel === "out" && v.stock === 0) ||
        (currentLevel === "healthy" && v.stock >= 10);

      const matchSport = currentSport === "all" || v.sport?.toLowerCase() === currentSport.toLowerCase();

      return matchSearch && matchLevel && matchSport;
    });
  }, [allVariants, search, currentLevel, currentSport]);

  const totalInventory = allVariants.reduce((sum, v) => sum + v.stock, 0);
  const lowStockCount = allVariants.filter(v => v.stock < 10).length;

  const columns = [
    {
      header: t("table.sku"),
      id: "sku",
      sortable: true,
      accessor: (variant: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-light rounded-lg border border-gray-100 flex items-center justify-center font-mono text-[10px] font-bold text-primary shrink-0">
            {variant.sku.split("-")[2]}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-neutral-dark truncate">{variant.productName}</h4>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-tight">
              {variant.color} / {variant.size}
            </span>
          </div>
        </div>
      ),
      className: "w-full"
    },
    {
      header: t("table.stock"),
      id: "stock",
      sortable: true,
      accessor: (variant: any) => (
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-sm font-bold font-mono",
            variant.stock < 10 ? "text-error" : "text-neutral-dark"
          )}>
            {variant.stock}
          </span>
          {variant.stock < 10 && <AlertTriangle size={14} className="text-error" />}
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.status"),
      accessor: (variant: any) => (
        <StatusBadge
          label={variant.stock < 10 ? t("status.critical") : t("status.healthy")}
          bg={variant.stock < 10 ? "bg-error/5" : "bg-primary/5"}
          text={variant.stock < 10 ? "text-error" : "text-primary"}
          dot={variant.stock < 10 ? "bg-error" : "bg-primary"}
        />
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.actions"),
      accessor: (variant: any) => (
        <div className="flex items-center">
          <ActionMenu items={[
            {
              label: t("actions.adjust"),
              icon: Edit2,
              onClick: () => setEditingStock(variant)
            },
            {
              label: t("actions.view"),
              icon: Eye,
              onClick: () => router.push(`/products/new?id=${variant.productId}`)
            },
            {
              label: t("actions.audit"),
              icon: History,
              onClick: () => setIsHistoryOpen(true)
            }
          ]} />
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 pt-2">
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
        <div className="flex gap-3 relative" ref={filterRef}>
          <Button
            variant="outline"
            onClick={() => setIsHistoryOpen(true)}
            size="sm"
          >
            <History size={16} />
            {t("history")}
          </Button>
          <div className="relative" ref={filterRef}>
            <Button
              variant={isFilterOpen ? "default" : "outline"}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              size="sm"
            >
              <Filter size={16} />
              {t("priority")}
            </Button>

            {/* Quick Filter Panel */}
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("filter.title")}</h3>
                  <button onClick={() => setIsFilterOpen(false)}><X size={14} className="text-gray-300" /></button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("filter.level")}</label>
                    <Select
                      value={currentLevel}
                      onChange={(e) => updateFilter("level", e.target.value)}
                    >
                      <option value="all">{t("filter.all_levels")}</option>
                      <option value="low">{t("filter.low_stock")}</option>
                      <option value="out">{t("filter.out_of_stock")}</option>
                      <option value="healthy">{t("filter.healthy_stock")}</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">{t("filter.sport")}</label>
                    <Select
                      value={currentSport}
                      onChange={(e) => updateFilter("sport", e.target.value)}
                    >
                      <option value="all">{t("filter.all_sports")}</option>
                      <option value="football">{t("filter.football")}</option>
                      <option value="basketball">{t("filter.basketball")}</option>
                      <option value="running">{t("filter.running")}</option>
                      <option value="training">{t("filter.training")}</option>
                    </Select>
                  </div>

                  {(currentLevel !== "all" || currentSport !== "all") && (
                    <button
                      onClick={() => { updateFilter("level", "all"); updateFilter("sport", "all"); }}
                      className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-error transition-colors text-center"
                    >
                      {t("filter.clear")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-6" padding="md" rounded="2xl" border="primary">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Database size={24} />
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest mb-1">{t("stats.total")}</p>
            <h3 className="text-2xl font-heading font-bold text-neutral-dark leading-none">{totalInventory}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-6" padding="md" rounded="2xl">
          <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center text-error">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest mb-1">{t("stats.alerts")}</p>
            <h3 className="text-2xl font-heading font-bold text-error leading-none">{lowStockCount}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-6" padding="md" rounded="2xl">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-heading font-bold text-gray-400 uppercase tracking-widest mb-1">{t("stats.healthy")}</p>
            <h3 className="text-2xl font-heading font-bold text-primary leading-none">{allVariants.length - lowStockCount}</h3>
          </div>
        </Card>
      </div>

      {/* Main Stock Table */}
      <section className="space-y-6 pt-6">
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
          <Button variant="outline">
            <Save size={16} />
            {t("table.export")}
          </Button>
        </div>

        <DataTable
          data={processedVariants}
          columns={columns}
          className="border-gray-100/60"
        />
      </section>

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={!!editingStock}
        onClose={() => setEditingStock(null)}
        title={t("modal.adjust_title")}
        maxWidth="sm"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setEditingStock(null)}>{t("form.cancel")}</Button>
            <Button onClick={() => setEditingStock(null)}>
              {t("modal.confirm")}
            </Button>
          </>
        )}
      >
        {editingStock && (
          <div className="space-y-6 py-2">
            {/* Simple Product Context */}
            <div className="border-l-2 border-primary pl-4 py-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{editingStock.sku}</p>
              <h4 className="text-sm font-bold text-neutral-dark">{editingStock.productName}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{editingStock.color} / {editingStock.size}</p>
            </div>

            {/* Simple Formal Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("modal.current")}</label>
                <Input
                  disabled
                  value={editingStock.stock}
                  className="bg-gray-50/50 border-gray-100 text-gray-400 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-widest ml-1">{t("modal.new")}</label>
                <Input
                  type="number"
                  defaultValue={editingStock.stock}
                  className="font-mono bg-white border-gray-200"
                  autoFocus
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed pt-2">
              {t("modal.alert")}
            </p>
          </div>
        )}
      </Modal>

      {/* History Modal (Placeholder for now) */}
      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title={t("modal.history_title")}
        maxWidth="lg"
      >
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-neutral-light rounded-full flex items-center justify-center text-gray-300">
            <History size={32} />
          </div>
          <p className="text-sm font-bold text-gray-400">{t("modal.history_placeholder")}</p>
        </div>
      </Modal>
    </div>
  );
}
