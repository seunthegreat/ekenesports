"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Settings2,
  Euro,
  Database,
  Shirt,
  Footprints
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface MatrixRow {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

interface MatrixEditorProps {
  onUpdate: (rows: MatrixRow[]) => void;
  basePrice: number;
  productName?: string;
}

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const FOOTWEAR_SIZES = ["39", "40", "41", "42", "43", "44", "45", "46"];

const COMMON_COLORS = [
  { name: "Black",  hex: "#000000", abbr: "BLK" },
  { name: "White",  hex: "#FFFFFF", abbr: "WHT" },
  { name: "Red",    hex: "#DC2626", abbr: "RED" },
  { name: "Blue",   hex: "#2563EB", abbr: "BLU" },
  { name: "Green",  hex: "#16A34A", abbr: "GRN" },
  { name: "Yellow", hex: "#EAB308", abbr: "YLW" },
  { name: "Navy",   hex: "#1E3A5F", abbr: "NVY" },
  { name: "Grey",   hex: "#6B7280", abbr: "GRY" },
];

type SizeCategory = "apparel" | "footwear";

function slugify(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 8);
}

function generateSku(productName: string, colorAbbr: string, size: string): string {
  const prefix = productName ? slugify(productName) : "PROD";
  return `${prefix}-${colorAbbr}-${size}`;
}

export function MatrixEditor({ onUpdate, basePrice, productName = "" }: MatrixEditorProps) {
  const t = useTranslations("Products.matrix");
  const tColors = useTranslations("Products.colors");

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes,  setSelectedSizes]  = useState<string[]>([]);
  const [sizeCategory,   setSizeCategory]   = useState<SizeCategory>("apparel");
  const [rows,           setRows]           = useState<MatrixRow[]>([]);

  const CURRENT_SIZES = sizeCategory === "apparel" ? APPAREL_SIZES : FOOTWEAR_SIZES;

  useEffect(() => {
    const newRows: MatrixRow[] = [];
    selectedColors.forEach(colorName => {
      const colorMeta = COMMON_COLORS.find(c => c.name === colorName)!;
      selectedSizes.forEach(size => {
        const existing = rows.find(r => r.color === colorName && r.size === size);
        if (existing) {
          newRows.push(existing);
        } else {
          newRows.push({
            id:       `${colorName}-${size}-${Date.now()}`,
            color:    colorName,
            colorHex: colorMeta?.hex ?? "#000000",
            size,
            sku:      generateSku(productName, colorMeta?.abbr ?? colorName.slice(0, 3).toUpperCase(), size),
            price:    basePrice,
            stock:    0,
          });
        }
      });
    });
    setRows(newRows);
    onUpdate(newRows);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColors, selectedSizes, productName]);

  const updateRow = (id: string, field: keyof MatrixRow, value: any) => {
    const updated = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    setRows(updated);
    onUpdate(updated);
  };

  const toggleColor = (color: string) =>
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);

  const toggleSize = (size: string) =>
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);

  const handleCategoryChange = (cat: SizeCategory) => {
    setSizeCategory(cat);
    setSelectedSizes([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-extrabold text-neutral-dark mb-5 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">1</span>
              {t("configure")}
            </h3>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-gray-400 block">{t("colors")}</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_COLORS.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2",
                      selectedColors.includes(c.name)
                        ? "bg-primary border-primary text-white shadow-md"
                        : "bg-white border-gray-200 text-gray-600 hover:border-primary"
                    )}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    {tColors(c.name)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs font-bold text-gray-400">{t("sizes")}</label>
                <div className="ml-auto flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("apparel")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                      sizeCategory === "apparel"
                        ? "bg-white text-primary shadow-sm border border-gray-100"
                        : "text-gray-400 hover:text-neutral-dark"
                    )}
                  >
                    <Shirt size={12} /> Apparel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("footwear")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                      sizeCategory === "footwear"
                        ? "bg-white text-primary shadow-sm border border-gray-100"
                        : "text-gray-400 hover:text-neutral-dark"
                    )}
                  >
                    <Footprints size={12} /> Footwear
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {CURRENT_SIZES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all min-w-[40px] text-center",
                      selectedSizes.includes(s)
                        ? "bg-primary border-primary text-white shadow-md"
                        : "bg-white border-gray-200 text-gray-600 hover:border-primary"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 self-start">
          <h3 className="text-sm font-extrabold text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
            <Settings2 size={18} />
            {t("bulk_actions")}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-primary/60 mb-2 block uppercase">{t("all_price")}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"><Euro size={12} /></span>
                  <input
                    type="number"
                    placeholder={t("set_all")}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-primary/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        const updated = rows.map(r => ({ ...r, price: val }));
                        setRows(updated);
                        onUpdate(updated);
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-primary/60 mb-2 block uppercase">{t("all_stock")}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"><Database size={12} /></span>
                  <input
                    type="number"
                    placeholder={t("set_all")}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-primary/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) {
                        const updated = rows.map(r => ({ ...r, stock: val }));
                        setRows(updated);
                        onUpdate(updated);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            {rows.length > 0 && (
              <div className="pt-2 border-t border-primary/10">
                <p className="text-[10px] text-primary/50 font-bold uppercase tracking-widest">
                  {rows.length} {rows.length === 1 ? "variant" : "variants"} configured
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("variant")}</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("sku")} <span className="text-[9px] normal-case font-normal text-gray-300 ml-1">auto-generated, editable</span></th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-28">{t("price")}</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-28">{t("stock")}</th>
                <th className="px-5 py-4 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: row.colorHex }}
                      />
                      <span className="text-xs font-bold text-neutral-dark">{tColors(row.color)}</span>
                      <span className="text-[10px] text-gray-300 font-bold">/</span>
                      <span className="text-xs font-bold text-neutral-dark">{row.size}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <input
                      type="text"
                      value={row.sku}
                      onChange={(e) => updateRow(row.id, "sku", e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-transparent rounded-lg text-xs font-mono text-neutral-dark focus:bg-white focus:border-primary/30 outline-none transition-all"
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs">€</span>
                      <input
                        type="number"
                        value={row.price}
                        onChange={(e) => updateRow(row.id, "price", parseFloat(e.target.value))}
                        className="w-full pl-6 pr-3 py-1.5 bg-gray-50 border border-transparent rounded-lg text-xs font-bold focus:bg-white focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <input
                      type="number"
                      value={row.stock}
                      onChange={(e) => updateRow(row.id, "stock", parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-transparent rounded-lg text-xs font-bold focus:bg-white focus:border-primary/30 outline-none transition-all"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = rows.filter(r => r.id !== row.id);
                        setRows(updated);
                        onUpdate(updated);
                      }}
                      className="p-2 hover:bg-error/5 rounded-xl text-gray-200 hover:text-error transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length === 0 && (
        <div className="p-12 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <Plus size={32} />
          </div>
          <p className="text-sm font-semibold text-gray-400">{t("empty_state")}</p>
          <p className="text-xs text-gray-300 mt-1 font-medium">Select colours and sizes above to generate variants</p>
        </div>
      )}
    </div>
  );
}
