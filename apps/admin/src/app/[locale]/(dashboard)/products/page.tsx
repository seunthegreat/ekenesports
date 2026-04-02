"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { trpc } from "@/utils/trpc";
import { ProductFilter } from "@/components/products/product-filter";

export default function ProductsPage() {
  const t = useTranslations("Products");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Live data fetching
  const { data: liveProducts } = trpc.products.list.useQuery({
    limit: 100,
  });

  const currentStatus = searchParams.get("status") || "all";
  const currentSport = searchParams.get("sport") || "all";
  const currentBrand = searchParams.get("brand") || "all";

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
    params.delete("status");
    params.delete("sport");
    params.delete("brand");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Safe Swap: Use live products if available, otherwise fallback to mocks
  const liveArray = liveProducts ? (Array.isArray(liveProducts) ? liveProducts : liveProducts.products) : null;
  const displayProducts = (liveArray && liveArray.length > 0) ? liveArray : mockProducts;

  const processedProducts = (displayProducts as any[]).map(p => ({
    ...p,
    totalStock: p.variants ? p.variants.reduce((acc: number, v: any) => acc + v.stock, 0) : 0,
    status: (p.status || "active") as "active" | "draft" | "archived"
  })).filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
    if (currentStatus !== "all" && p.status.toLowerCase() !== currentStatus.toLowerCase()) return false;
    if (currentSport !== "all" && p.sportId?.toLowerCase() !== currentSport.toLowerCase()) return false;
    if (currentBrand !== "all" && p.brand?.toLowerCase() !== currentBrand.toLowerCase()) return false;
    return true;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const columns = [
    {
      header: t("table.name"),
      id: "name",
      sortable: true,
      accessor: (product: Product) => (
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-neutral-light rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            {product.images?.[0]?.url ? (
              <Image src={product.images[0].url} alt={product.name} width={44} height={44} className="object-cover" />
            ) : (
              <ImageIcon className="text-gray-300" size={18} />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-neutral-dark truncate">{product.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{product.brand}</span>
              <span className="text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                {product.sportId}
              </span>
            </div>
          </div>
        </div>
      ),
      className: "w-full"
    },
    {
      header: t("table.price"),
      id: "basePrice",
      sortable: true,
      accessor: (product: Product) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-primary font-mono tracking-tight">€{product.basePrice.toFixed(2)}</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight italic">{t("modal.retail")}</span>
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.stock"),
      id: "totalStock",
      sortable: true,
      accessor: (product: any) => {
        const totalStock = product.totalStock;
        const lowStock = totalStock < 10;
        return (
          <div className="space-y-1.5 min-w-[140px]">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
              <span className={cn(lowStock ? "text-error" : "text-gray-500")}>
                {totalStock} {t("modal.units")}
              </span>
              <span className="text-gray-400 font-medium">
                {t("modal.skus", { count: product.variants.length })}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
              <div
                className={cn("h-full transition-all duration-500", lowStock ? "bg-error" : "bg-primary")}
                style={{ width: `${Math.min(100, (totalStock / 50) * 100)}%` }}
              />
            </div>
          </div>
        );
      },
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.status"),
      id: "status",
      sortable: true,
      accessor: (product: Product) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full bg-primary/5 text-primary uppercase border border-primary/10 tracking-widest leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {t(`status.${product.status || "active"}`)}
        </span>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: t("table.actions"),
      accessor: (product: Product) => (
        <div className="flex items-center">
          <ActionMenu items={[
            {
              label: t("actions.view"),
              icon: Eye,
              onClick: () => setSelectedProduct(product)
            },
            {
              label: t("actions.edit"),
              icon: Edit2,
              onClick: () => { router.push(`/products/new?id=${product.id}`) }
            },
            {
              label: t("actions.archive"),
              icon: Trash2,
              onClick: () => setDeleteProduct(product),
              variant: "danger"
            }
          ]} />
        </div>
      ),
      className: "w-0 whitespace-nowrap"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10 pt-2">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-xl space-y-2">
          <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
            {t("title_part1")} <span className="text-primary">{t("title_part2")}</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">
            {t("description")}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative" ref={filterRef}>
            <Button
              variant={isFilterOpen ? "default" : "outline"}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              size="sm"
            >
              <Filter size={16} />
              {t("filters.title")}
            </Button>

            <ProductFilter
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              currentStatus={currentStatus}
              currentSport={currentSport}
              currentBrand={currentBrand}
              onUpdate={updateFilter}
              onClear={clearFilters}
            />
          </div>

          <Link href="/products/new">
            <Button variant="default" size="sm" className="gap-2">
              <Plus size={16} />
              {t("add")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      <section className="space-y-4 pt-4">
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
          data={processedProducts}
          columns={columns}
          className="border-gray-100/60"
        />
      </section>

      {/* Quick View Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={t("modal.view_title")}
        maxWidth="lg"
        footer={(
          <>
            <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
              {t("modal.close")}
            </Button>
            <Link href={`/products/new?id=${selectedProduct?.id}`}>
              <Button variant="default" size="sm">
                {t("modal.edit_details")}
              </Button>
            </Link>
          </>
        )}
      >
        {selectedProduct && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex gap-8 items-start">
              <div className="w-40 aspect-square rounded-2xl border border-gray-100 bg-neutral-light overflow-hidden shadow-sm flex-shrink-0">
                {selectedProduct.images?.[0]?.url && (
                  <Image src={selectedProduct.images[0].url} alt={selectedProduct.name} width={160} height={160} className="object-cover" />
                )}
              </div>
              <div className="space-y-3 pt-2">
                <h4 className="text-2xl font-heading font-bold text-neutral-dark tracking-tight">{selectedProduct.name}</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full border border-primary/10 uppercase tracking-widest">
                    {selectedProduct.sportId}
                  </span>
                  <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-full border border-gray-100 uppercase tracking-widest">
                    {selectedProduct.brand}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic line-clamp-2">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 bg-neutral-light/50 border border-gray-100 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t("modal.base_price")}</p>
                <p className="text-xl font-heading font-bold text-neutral-dark">€{selectedProduct.basePrice.toFixed(2)}</p>
              </div>
              <div className="p-5 bg-neutral-light/50 border border-gray-100 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t("modal.total_stock")}</p>
                <p className="text-xl font-heading font-bold text-neutral-dark">
                  {selectedProduct.variants.reduce((a: number, b: any) => a + b.stock, 0)}
                </p>
              </div>
              <div className="p-5 bg-neutral-light/50 border border-gray-100 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t("modal.sku_count")}</p>
                <p className="text-xl font-heading font-bold text-neutral-dark">{selectedProduct.variants.length}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Archive Modal */}
      <Modal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        title={t("modal.archive_title")}
        maxWidth="sm"
        footer={(
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteProduct(null)}>
              {t("modal.cancel")}
            </Button>
            <Button variant="outline" size="sm" className="border-error text-error hover:bg-error hover:text-white">
              {t("modal.confirm_archive")}
            </Button>
          </>
        )}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-error/5 rounded-2xl flex items-center justify-center text-error mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            {t("modal.archive_desc", { name: deleteProduct?.name || "" })}
          </p>
        </div>
      </Modal>
    </div>
  );
}
