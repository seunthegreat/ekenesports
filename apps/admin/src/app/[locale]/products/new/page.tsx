"use client";

import { useState, useMemo } from "react";
import { Link, useRouter } from "@/i18n/routing";
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
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProductFormPage() {
  const t = useTranslations("Products");
  const router = useRouter();
  const tSports = useTranslations("Products.sports");
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

  const sportOptions = sports.map(s => ({ label: tSports(s.slug as any), value: s.id }));
  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 pt-4">
      {/* Page Header - Unified with Settings style */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors group mb-1"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              {t("form.back")}
            </button>
            <div className="max-w-xl space-y-2">
              <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
                {isEditing ? t("form.title_edit") : t("form.title_create")}
              </h1>
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none ml-1">
                <span>{t("form.catalog")}</span>
                <span className="text-gray-200">/</span>
                <span className="text-primary">
                  {isEditing ? t("form.modify") : t("form.new")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {!isEditing && (
            <button className="px-5 py-2.5 bg-white border border-gray-100 text-gray-500 font-bold rounded-xl text-xs hover:border-primary/20 transition-all shadow-sm">
              {t("form.save_draft")}
            </button>
          )}
          <button className="flex items-center gap-2 px-6 py-2.5 bg-neutral-dark text-white font-bold rounded-xl text-xs hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/20">
            <Save size={18} />
            {isEditing ? t("form.update") : t("form.publish")}
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* General Information */}
          <Card className="space-y-8" padding="md" rounded="2xl" shadow="none">
            <h2 className="text-lg font-heading font-bold text-neutral-dark flex items-center gap-3">
              <Info className="text-primary" size={20} />
              {t("form.general_info")}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.product_name")}</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("form.product_name_placeholder")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.description_label")}</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("form.description_placeholder")}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm font-medium transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
          </Card>

          {/* Variants Matrix */}
          <Card className="space-y-8" padding="md" rounded="2xl" shadow="none">
            <h2 className="text-lg font-heading font-bold text-neutral-dark flex items-center gap-3">
              <Layers className="text-primary" size={20} />
              {t("matrix.title")}
            </h2>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-4 text-primary">
              <Info className="mt-0.5 flex-shrink-0" size={16} />
              <p className="text-[11px] font-bold leading-relaxed tracking-tight">
                {t("matrix.info")}
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
            <h2 className="text-base font-heading font-bold text-neutral-dark flex items-center gap-2">
              <Boxes className="text-primary" size={18} />
              {t("form.organization")}
            </h2>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.sport_context")}</label>
                <Select
                  value={sportId}
                  onChange={(e) => setSportId(e.target.value)}
                >
                  <option value="" disabled>{t("form.select_sport")}</option>
                  {sportOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.store_category")}</label>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="" disabled>{t("form.select_category")}</option>
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          {/* Pricing Card */}
          <Card className="space-y-6" padding="sm" rounded="2xl" shadow="sm">
            <h2 className="text-base font-heading font-bold text-neutral-dark flex items-center gap-2">
              <Euro className="text-primary" size={18} />
              {t("form.pricing")}
            </h2>
            <div className="space-y-2">
              <label className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.retail_price")}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-300">€</div>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  placeholder={t("form.retail_price_placeholder")}
                  className="w-full pl-10 pr-5 py-3.5 bg-neutral-light border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-2xl font-bold text-neutral-dark outline-none transition-all placeholder:text-gray-200"
                />
              </div>
            </div>
          </Card>

          {/* Media Card */}
          <Card className="space-y-6" padding="sm" rounded="2xl" shadow="sm">
            <h2 className="text-base font-heading font-bold text-neutral-dark flex items-center gap-2">
              <ImageIcon className="text-primary" size={18} />
              {t("form.media")}
            </h2>
            <div className="aspect-square bg-neutral-light border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 group hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden relative">
              {productData?.images?.[0]?.url ? (
                <Image src={productData.images[0].url} alt={productData.name} fill className="object-cover transition-transform group-hover:scale-110" />
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:scale-105 group-hover:text-primary transition-all mb-4 shadow-sm border border-gray-100 relative z-10">
                    <Upload size={24} />
                  </div>
                  <p className="text-xs font-bold text-neutral-dark uppercase tracking-tight relative z-10">{t("form.drop_images")}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium relative z-10">{t("form.select_files")}</p>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
