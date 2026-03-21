"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  Save, 
  Image as ImageIcon,
  Upload,
  Info,
  Layers,
  Euro,
  Boxes
} from "lucide-react";
import { sports, categories, mockProducts } from "@/lib/mock-data";
import { MatrixEditor } from "@/components/product/matrix-editor";
import { Card } from "@/components/ui/card";
import { Dropdown } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProductFormPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  // Attempt to find existing product for pre-filling
  const productData = useMemo(() => {
    return isEditing ? mockProducts.find(p => p.id === editId) : null;
  }, [isEditing, editId]);

  const [basePrice, setBasePrice] = useState(productData?.basePrice || 0);
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [sportId, setSportId] = useState(productData?.sportId || "");
  const [categoryId, setCategoryId] = useState(productData?.categoryId || "");
  const [variants, setVariants] = useState<any[]>(productData?.variants || []);

  const sportOptions = sports.map(s => ({ label: s.name, value: s.id }));
  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 pt-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Link 
            href="/products" 
            className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl lg:text-[40px] font-heading font-extrabold text-neutral-dark tracking-tight leading-tight">
              {isEditing ? "Edit Product" : "Create Product"}
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest leading-none">
              <span>Catalog</span>
              <span className="text-gray-200">/</span>
              <span className="text-primary tracking-tight">
                {isEditing ? "Modify Entry" : "New Entry"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {!isEditing && (
            <button className="px-5 py-2.5 bg-white border border-gray-100 text-gray-500 font-bold rounded-xl text-xs hover:border-primary/20 transition-all shadow-sm">
              Save as Draft
            </button>
          )}
          <button className="flex items-center gap-2 px-6 py-2.5 bg-neutral-dark text-white font-bold rounded-xl text-xs hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/20">
            <Save size={18} />
            {isEditing ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* General Information */}
          <Card className="space-y-8" padding="md" rounded="2xl" shadow="none">
            <h2 className="text-lg font-heading font-extrabold text-neutral-dark flex items-center gap-3">
              <Info className="text-primary" size={20} />
              General Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pro Court Basketball Shoes" 
                  className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 text-sm font-bold placeholder:font-normal transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed product specifications and marketing copy..." 
                  className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 text-sm font-medium transition-all" 
                />
              </div>
            </div>
          </Card>

          {/* Variants Matrix */}
          <Card className="space-y-8" padding="md" rounded="2xl" shadow="none">
            <h2 className="text-lg font-heading font-extrabold text-neutral-dark flex items-center gap-3">
              <Layers className="text-primary" size={20} />
              Variant Configuration
            </h2>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-4 text-primary">
              <Info className="mt-0.5 flex-shrink-0" size={16} />
              <p className="text-[11px] font-bold leading-relaxed tracking-tight">
                Instantiate combinations by selecting colors and sizes. Each SKU is treated as a distinct atomic record in our global inventory engine.
              </p>
            </div>
            <MatrixEditor 
              basePrice={basePrice} 
              onUpdate={(rows) => setVariants(rows)} 
            />
          </Card>
        </div>

        {/* Sidebar Controls Area */}
        <div className="lg:col-span-4 space-y-10">
          {/* Categorization Card */}
          <Card className="space-y-6" padding="sm" rounded="2xl" shadow="sm">
            <h2 className="text-base font-heading font-extrabold text-neutral-dark flex items-center gap-2">
              <Boxes className="text-primary" size={18} />
              Organization
            </h2>
            <div className="space-y-6 pt-2">
              <div className="space-y-3">
                <label className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest ml-1">Sport Context</label>
                <Dropdown 
                  options={sportOptions}
                  value={sportId}
                  onChange={setSportId}
                  placeholder="Select Sport..."
                  fullWidth
                  className="w-full [&>button]:w-full [&>button]:justify-between [&>button]:rounded-xl [&>button]:py-3 [&>button]:bg-gray-50/50"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest ml-1">Store Category</label>
                <Dropdown 
                  options={categoryOptions}
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder="Select Category..."
                  fullWidth
                  className="w-full [&>button]:w-full [&>button]:justify-between [&>button]:rounded-xl [&>button]:py-3 [&>button]:bg-gray-50/50"
                />
              </div>
            </div>
          </Card>

          {/* Pricing Card */}
          <Card className="space-y-6" padding="sm" rounded="2xl" shadow="sm">
            <h2 className="text-base font-heading font-extrabold text-neutral-dark flex items-center gap-2">
              <Euro className="text-primary" size={18} />
              Base Pricing
            </h2>
            <div className="space-y-2">
              <label className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest ml-1">Retail Price (€)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-300">€</div>
                <input 
                  type="number" 
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00" 
                  className="w-full pl-10 pr-5 py-3.5 bg-neutral-light border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-2xl font-extrabold text-neutral-dark outline-none transition-all placeholder:text-gray-200" 
                />
              </div>
            </div>
          </Card>

          {/* Media Card */}
          <Card className="space-y-6" padding="sm" rounded="2xl" shadow="sm">
             <h2 className="text-base font-heading font-extrabold text-neutral-dark flex items-center gap-2">
              <ImageIcon className="text-primary" size={18} />
              Media Assets
            </h2>
            <div className="aspect-square bg-neutral-light border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 group hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden relative">
               {productData?.images?.[0]?.url ? (
                 <Image src={productData.images[0].url} alt={productData.name} fill className="object-cover transition-transform group-hover:scale-110" />
               ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:scale-105 group-hover:text-primary transition-all mb-4 shadow-sm border border-gray-100 relative z-10">
                    <Upload size={24} />
                  </div>
                  <p className="text-xs font-extrabold text-neutral-dark uppercase tracking-tight relative z-10">Drop images here</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium relative z-10">Or click to select files (Max 2MB)</p>
                </>
               )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
