"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { searchProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("common");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchProducts(query, 8));
    } else {
      setResults([]);
    }
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-20 mx-4 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 outline-none text-base"
          />
          <button onClick={onClose} className="p-1 hover:bg-neutral-light rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 p-2 hover:bg-neutral-light rounded-lg"
              >
                <div className="w-12 h-12 relative overflow-hidden bg-neutral-light flex-shrink-0">
                  <Image
                    src={product.images[0]?.url || ""}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                </div>
                <p className="text-sm font-mono font-semibold text-primary">
                  {formatPrice(product.basePrice)}
                </p>
              </Link>
            ))}
          </div>
        )}
        {query.length >= 2 && results.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">{t("noResults")}</div>
        )}
      </div>
    </div>
  );
}
