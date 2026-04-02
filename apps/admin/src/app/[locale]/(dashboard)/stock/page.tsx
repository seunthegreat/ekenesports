"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Save,
  AlertTriangle,
  Filter,
  Edit2,
  Eye,
  History,
} from "lucide-react";
import { ActionMenu } from "@/components/ui/action-menu";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { mockProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";

// Centralized Components
import { StockStats } from "@/components/stock/stock-stats";
import { StockFilterPanel } from "@/components/stock/stock-filter-panel";
import { AdjustStockModal } from "@/components/stock/adjust-stock-modal";
import { StockHistoryModal } from "@/components/stock/stock-history-modal";

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

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("level");
    params.delete("sport");
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
  const healthyCount = allVariants.length - lowStockCount;

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
          <div className="relative">
            <Button
              variant={isFilterOpen ? "default" : "outline"}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              size="sm"
            >
              <Filter size={16} />
              {t("filter.title")}
            </Button>
            
            <StockFilterPanel
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              currentLevel={currentLevel}
              currentSport={currentSport}
              onUpdate={updateFilter}
              onClear={clearFilters}
            />
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Stats Cards */}
      <StockStats 
        totalInventory={totalInventory} 
        lowStockCount={lowStockCount} 
        healthyCount={healthyCount} 
      />

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
      <AdjustStockModal
        editingStock={editingStock}
        onClose={() => setEditingStock(null)}
        onConfirm={(newStock) => {
          console.log("Confirmed new stock:", newStock);
          setEditingStock(null);
        }}
      />

      {/* History Modal */}
      <StockHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
