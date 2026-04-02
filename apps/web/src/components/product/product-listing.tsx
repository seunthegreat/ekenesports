"use client";

import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/utils/trpc";
import { FilterState, Product } from "@/lib/types";
import { useTranslations } from "next-intl";
import { ProductGrid } from "./product-grid";
import { FacetSidebar } from "./facet-sidebar";
import { Button } from "../ui/button";
import { Sheet } from "../ui/sheet";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { categories, sports, getProducts } from "@/lib/data"; // Only used for sidebars/facets for now

interface ProductListingProps {
  initialFilters?: FilterState;
  title?: string;
}

export function ProductListing({ initialFilters = {}, title }: ProductListingProps) {
  const t = useTranslations("products");
  const [filters, setFilters] = useState<FilterState>({ page: 1, ...initialFilters });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: result, isLoading } = trpc.products.list.useQuery(filters);

  const products = result?.products || [];
  const total = result?.total || 0;
  
  // We still use mock facets for the sidebar UI for now to avoid complex aggregation logic on backend
  const facets = useMemo(() => {
    // Ideally these would come from the server
    const allMockProducts = getProducts(); 
    // This is just to keep the sidebar working with existing UI
    return {
      sports: sports.map(s => ({ value: s.slug, label: s.name, count: 12 })),
      categories: categories.map(c => ({ value: c.slug, label: c.name, count: 8 })),
      genders: [
        { value: 'men', label: 'Men', count: 20 },
        { value: 'women', label: 'Women', count: 20 },
      ],
      sizes: [],
      colors: [],
      brands: [],
      priceRange: { min: 0, max: 1000 }
    };
  }, []);

  const pageSize = 12;
  const totalPages = Math.ceil(total / pageSize);
  const page = filters.page || 1;

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {title && (
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark mb-6">{title}</h1>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <p className="text-sm text-gray-500">{t("showing", { count: total })}</p>
        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("filters")}
          </Button>
          {/* Sort */}
          <select
            value={filters.sort || "newest"}
            onChange={(e) =>
              setFilters({ ...filters, sort: e.target.value as FilterState["sort"], page: 1 })
            }
            className="text-sm border rounded-lg px-3 py-1.5 bg-white"
          >
            <option value="newest">{t("sortNewest")}</option>
            <option value="price-asc">{t("sortPriceLow")}</option>
            <option value="price-desc">{t("sortPriceHigh")}</option>
            <option value="popular">{t("sortPopular")}</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FacetSidebar facets={facets} filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products as Product[]} />
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => setFilters({ ...filters, page: page - 1 })}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-500 mx-4">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= totalPages}
                    onClick={() => setFilters({ ...filters, page: page + 1 })}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">{t("clearFilters")}</div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} side="left" title={t("filters")}>
        <div className="p-4">
          <FacetSidebar facets={facets} filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </Sheet>
    </div>
  );
}
