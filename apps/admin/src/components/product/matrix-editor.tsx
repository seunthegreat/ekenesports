"use client";

import { useState, useEffect } from "react";
import { 
  Trash2, 
  Plus, 
  Settings2,
  Euro,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MatrixRow {
  id: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

interface MatrixEditorProps {
  onUpdate: (rows: MatrixRow[]) => void;
  basePrice: number;
}

const COMMON_SIZES = ["S", "M", "L", "XL", "XXL", "40", "41", "42", "43", "44", "45"];
const COMMON_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Yellow", hex: "#EAB308" },
];

export function MatrixEditor({ onUpdate, basePrice }: MatrixEditorProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [rows, setRows] = useState<MatrixRow[]>([]);

  // Regenerate rows when colors or sizes change
  useEffect(() => {
    const newRows: MatrixRow[] = [];
    selectedColors.forEach(color => {
      selectedSizes.forEach(size => {
        const existing = rows.find(r => r.color === color && r.size === size);
        if (existing) {
          newRows.push(existing);
        } else {
          newRows.push({
            id: `${color}-${size}-${Date.now()}`,
            color,
            size,
            sku: "",
            price: basePrice,
            stock: 0
          });
        }
      });
    });
    setRows(newRows);
    onUpdate(newRows);
  }, [selectedColors, selectedSizes]);

  const updateRow = (id: string, field: keyof MatrixRow, value: any) => {
    const updated = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    setRows(updated);
    onUpdate(updated);
  };

  const removeColor = (color: string) => setSelectedColors(prev => prev.filter(c => c !== color));
  const removeSize = (size: string) => setSelectedSizes(prev => prev.filter(s => s !== size));

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Options Configuration */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-extrabold text-neutral-dark mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px]">1</span>
              Configure Options
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 mb-3 block">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_COLORS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => toggleColor(c.name)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2",
                        selectedColors.includes(c.name) 
                          ? "bg-primary border-primary text-white shadow-md" 
                          : "bg-white border-gray-200 text-gray-600 hover:border-primary"
                      )}
                    >
                      <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-3 block">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all",
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
        </div>

        {/* Bulk Action Panel */}
        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 self-start">
          <h3 className="text-sm font-extrabold text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
            <Settings2 size={18} />
            Bulk Actions
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-primary/60 mb-2 block uppercase">All Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"><Euro size={12}/></span>
                  <input 
                    type="number" 
                    placeholder="Set all..." 
                    className="w-full pl-8 pr-3 py-2 bg-white border border-primary/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setRows(prev => prev.map(r => ({ ...r, price: val })));
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-primary/60 mb-2 block uppercase">All Stock</label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"><Database size={12}/></span>
                  <input 
                    type="number" 
                    placeholder="Set all..." 
                    className="w-full pl-8 pr-3 py-2 bg-white border border-primary/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setRows(prev => prev.map(r => ({ ...r, stock: val })));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: The Matrix Table */}
      {rows.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 italic">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Variant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">SKU</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase w-32">Price (€)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase w-32">Stock</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-neutral-dark">{row.color}</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase">/</span>
                       <span className="text-xs font-bold text-neutral-dark">{row.size}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      value={row.sku} 
                      onChange={(e) => updateRow(row.id, 'sku', e.target.value)}
                      placeholder="ES-PRO-..." 
                      className="w-full px-3 py-1.5 bg-gray-50/50 border border-transparent rounded-lg text-xs font-mono focus:bg-white focus:border-primary/30 outline-none" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      value={row.price} 
                      onChange={(e) => updateRow(row.id, 'price', parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 bg-gray-50/50 border border-transparent rounded-lg text-xs font-bold focus:bg-white focus:border-primary/30 outline-none" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      value={row.stock} 
                      onChange={(e) => updateRow(row.id, 'stock', parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 bg-gray-50/50 border border-transparent rounded-lg text-xs font-bold focus:bg-white focus:border-primary/30 outline-none" 
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        const updated = rows.filter(r => r.id !== row.id);
                        setRows(updated);
                        onUpdate(updated);
                      }}
                      className="p-2 hover:bg-error/5 rounded-xl text-gray-300 hover:text-error transition-all"
                    >
                      <Trash2 size={16} />
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
          <p className="text-sm font-bold text-gray-400">Select at least one color and one size to generate variants matrix.</p>
        </div>
      )}
    </div>
  );
}
