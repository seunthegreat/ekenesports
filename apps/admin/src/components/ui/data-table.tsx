"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  id?: string; // used for sorting if accessor is a function
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  pageSize?: number;
}

export function DataTable<T>({ data, columns, onRowClick, className, pageSize = 10 }: DataTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("Common");

  const currentSort = searchParams.get("sort");
  const currentDir = searchParams.get("dir") || "asc";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handleSort = (colId: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentSort === colId) {
      params.set("dir", currentDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", colId);
      params.set("dir", "asc");
    }
    // Reset to page 1 on sort change
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const processedData = useMemo(() => {
    let result = [...data];

    // Sorting
    if (currentSort) {
      result.sort((a: any, b: any) => {
        const valA = a[currentSort];
        const valB = b[currentSort];

        if (typeof valA === "string" && typeof valB === "string") {
          return currentDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        if (valA < valB) return currentDir === "asc" ? -1 : 1;
        if (valA > valB) return currentDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const startIndex = (currentPage - 1) * pageSize;
    return {
      items: result.slice(startIndex, startIndex + pageSize),
      totalItems: result.length,
      totalPages: Math.ceil(result.length / pageSize),
    };
  }, [data, currentSort, currentDir, currentPage, pageSize]);

  return (
    <div className={cn("w-full bg-white rounded-2xl border border-gray-100 flex flex-col", className)}>
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-light/50 border-b border-gray-100">
              {columns.map((col, i) => {
                const colId = col.id || (typeof col.accessor === "string" ? col.accessor : null);
                const isSorted = currentSort === colId;

                return (
                  <th
                    key={`col-${i}`}
                    onClick={() => col.sortable && colId && handleSort(colId)}
                    className={cn(
                      "px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-neutral-dark select-none whitespace-nowrap",
                      col.sortable && "cursor-pointer hover:text-neutral-dark transition-colors group",
                      col.className?.includes("text-right") && "text-right", // Only preserve alignment if specified
                      // We don't want col.className to override font-bold or text-neutral-dark for the header
                    )}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      {col.header}
                      {col.sortable && colId && (
                        <div className={cn("flex flex-col ml-1", isSorted ? "text-primary" : "text-transparent group-hover:text-gray-300 transition-colors")}>
                          <ChevronUp size={10} className={cn("-mb-1", isSorted && currentDir === "asc" ? "opacity-100" : "opacity-30")} />
                          <ChevronDown size={10} className={isSorted && currentDir === "desc" ? "opacity-100" : "opacity-30"} />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {processedData.items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm font-medium text-gray-400">
                  {t("table.no_records")}
                </td>
              </tr>
            ) : processedData.items.map((item, rowIdx) => (
              <tr
                key={`row-${rowIdx}`}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "group transition-colors duration-150",
                  onRowClick ? "cursor-pointer hover:bg-gray-50/50" : "hover:bg-gray-50/30"
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={`cell-${rowIdx}-${colIdx}`} className={cn("px-6 py-5 text-sm", col.className)}>
                    {typeof col.accessor === "function"
                      ? col.accessor(item)
                      : (item[col.accessor as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {processedData.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl">
          <span className="text-xs font-bold text-gray-400">
            {t("table.pagination", {
              start: (currentPage - 1) * pageSize + 1,
              end: Math.min(currentPage * pageSize, processedData.totalItems),
              total: processedData.totalItems
            })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-neutral-dark hover:bg-white disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: processedData.totalPages }).map((_, i) => (
                <button
                  key={`page-${i}`}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all",
                    currentPage === i + 1
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(processedData.totalPages, currentPage + 1))}
              disabled={currentPage === processedData.totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-neutral-dark hover:bg-white disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
