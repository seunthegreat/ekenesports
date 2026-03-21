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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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

export default function StockManagementPage() {
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
      header: "SKU & Variant",
      id: "sku",
      sortable: true,
      accessor: (variant: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-light rounded-lg border border-gray-100 flex items-center justify-center font-mono text-[10px] font-bold text-primary shrink-0">
            {variant.sku.split("-")[2]}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-neutral-dark truncate">{variant.productName}</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              {variant.color} / {variant.size}
            </span>
          </div>
        </div>
      ),
      className: "w-full"
    },
    {
      header: "On Hand",
      id: "stock",
      sortable: true,
      accessor: (variant: any) => (
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-sm font-extrabold font-mono",
            variant.stock < 10 ? "text-error" : "text-neutral-dark"
          )}>
            {variant.stock}
          </span>
          {variant.stock < 10 && <AlertTriangle size={14} className="text-error animate-pulse" />}
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: "Status",
      accessor: (variant: any) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-widest leading-none border",
          variant.stock < 10
            ? "bg-error/5 text-error border-error/10"
            : "bg-emerald-50 text-emerald-600 border-emerald-100"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full", variant.stock < 10 ? "bg-error" : "bg-emerald-500")} />
          {variant.stock < 10 ? "Critical" : "Healthy"}
        </span>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: "Actions",
      accessor: (variant: any) => (
        <div className="flex items-center">
          <ActionMenu items={[
            {
              label: "Adjust Stock",
              icon: Edit2,
              onClick: () => setEditingStock(variant)
            },
            {
              label: "View Product",
              icon: Eye,
              onClick: () => router.push(`/products/new?id=${variant.productId}`)
            },
            {
              label: "Audit Logs",
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
          <h1 className="text-3xl lg:text-[40px] font-heading font-extrabold text-neutral-dark tracking-tight leading-none">
            Stock Management
          </h1>
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed mt-2">
            Global inventory control. Adjust variant quantities and handle priority reorders.
          </p>
        </div>
        <div className="flex gap-3 relative" ref={filterRef}>
          <Button
            variant="outline"
            onClick={() => setIsHistoryOpen(true)}
            size="sm"
          >
            <History size={16} />
            History
          </Button>
          <div className="relative" ref={filterRef}>
            <Button
              variant={isFilterOpen ? "default" : "outline"}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              size="sm"
            >
              <Filter size={16} />
              Priority
            </Button>

            {/* Quick Filter Panel */}
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[11px] font-heading font-extrabold text-[#1A1A2E]/60 uppercase tracking-widest">Filter Inventory</h3>
                  <button onClick={() => setIsFilterOpen(false)}><X size={14} className="text-gray-300" /></button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 block">Stock Level</label>
                    <Select 
                      value={currentLevel} 
                      onChange={(e) => updateFilter("level", e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="low">Low Stock (&lt;10)</option>
                      <option value="out">Out of Stock</option>
                      <option value="healthy">Healthy Stock</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 block">Sport Category</label>
                    <Select 
                      value={currentSport} 
                      onChange={(e) => updateFilter("sport", e.target.value)}
                    >
                      <option value="all">All Sports</option>
                      <option value="football">Football</option>
                      <option value="basketball">Basketball</option>
                      <option value="running">Running</option>
                      <option value="training">Training</option>
                    </Select>
                  </div>

                  {(currentLevel !== "all" || currentSport !== "all") && (
                    <button 
                      onClick={() => { updateFilter("level", "all"); updateFilter("sport", "all"); }}
                      className="w-full mt-2 py-2 text-xs font-bold text-gray-400 hover:text-error transition-colors text-center"
                    >
                      Clear All Filters
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
            <p className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest mb-1">Total On Hand</p>
            <h3 className="text-2xl font-heading font-extrabold text-neutral-dark leading-none">{totalInventory}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-6" padding="md" rounded="2xl">
          <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center text-error">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest mb-1">Stock Alerts</p>
            <h3 className="text-2xl font-heading font-extrabold text-error leading-none">{lowStockCount}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-6" padding="md" rounded="2xl">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
            <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest mb-1">Healthy SKUs</p>
            <h3 className="text-2xl font-heading font-extrabold text-emerald-600 leading-none">{allVariants.length - lowStockCount}</h3>
          </div>
        </Card>
      </div>

      {/* Main Stock Table */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <Input
              placeholder="Filter by SKU, variant or product name..."
              className="pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Save size={16} />
            Export Report
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
        title="Adjust Inventory"
        maxWidth="sm"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setEditingStock(null)}>Cancel</Button>
            <Button onClick={() => setEditingStock(null)}>
              Confirm Adjustment
            </Button>
          </>
        )}
      >
        {editingStock && (
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-4 p-4 bg-neutral-light/50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-mono text-xs font-bold text-primary border border-gray-100 shadow-sm">
                {editingStock.sku.split("-")[2]}
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{editingStock.sku}</p>
                <h4 className="text-sm font-bold text-neutral-dark">{editingStock.productName}</h4>
                <p className="text-[10px] font-medium text-gray-500">{editingStock.color} / {editingStock.size}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest ml-1">Current Stock</label>
                <div className="px-4 py-3.5 bg-neutral-light border border-gray-100 rounded-xl text-lg font-extrabold text-[#1A1A2E]/40 font-mono">
                  {editingStock.stock}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-heading font-extrabold text-primary uppercase tracking-widest ml-1">New Quantity</label>
                <Input
                  type="number"
                  defaultValue={editingStock.stock}
                  className="text-lg font-extrabold text-primary font-mono h-14"
                />
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3 text-primary">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold leading-snug">
                Adjustment will be logged to inventory history with your current session ID.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* History Modal (Placeholder for now) */}
      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Inventory Audit Log"
        maxWidth="lg"
      >
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-neutral-light rounded-full flex items-center justify-center text-gray-300">
            <History size={32} />
          </div>
          <p className="text-sm font-bold text-gray-400">Transaction history log is being prepared for your locale.</p>
        </div>
      </Modal>
    </div>
  );
}
