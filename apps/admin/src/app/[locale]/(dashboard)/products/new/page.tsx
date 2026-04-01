"use client";

import { useState, useMemo, useRef, useCallback } from "react";
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
  Boxes,
  X,
  Plus,
  Star
} from "lucide-react";
import { sports, categories, mockProducts } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MatrixEditor } from "../components/matrix-editor";

export default function ProductFormPage() {
  const t = useTranslations("Products");
  const router = useRouter();
  const tSports = useTranslations("Products.sports");
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  const productData = useMemo(() => {
    return isEditing ? mockProducts.find(p => p.id === editId) : null;
  }, [isEditing, editId]);

  const [basePrice, setBasePrice] = useState(productData?.basePrice || 0);
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [sportId, setSportId] = useState(productData?.sportId || "");
  const [categoryId, setCategoryId] = useState(productData?.categoryId || "");
  const [variants, setVariants] = useState<any[]>(productData?.variants || []);

  // Image state: array of object URLs (from file picker) OR existing src strings
  const [images, setImages] = useState<string[]>(
    productData?.images?.map(img => img.url) ?? []
  );
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...urls]);
    // Reset so same file can be picked again
    e.target.value = "";
  }, []);

  const removeImage = (index: number) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (primaryIdx >= next.length) setPrimaryIdx(Math.max(0, next.length - 1));
      return next;
    });
  };

  const sportOptions = sports.map(s => ({ label: tSports(s.slug as any), value: s.id }));
  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 pt-4">
      {/* Page Header */}
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
        <div className="flex gap-3">
          {!isEditing && (
            <Button variant="outline" size="sm">
              {t("form.save_draft")}
            </Button>
          )}
          <Button variant="default" size="sm" className="gap-2">
            <Save size={16} />
            {isEditing ? t("form.update") : t("form.publish")}
          </Button>
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.product_name")}</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("form.product_name_placeholder")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.description_label")}</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("form.description_placeholder")}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all placeholder:text-gray-400 resize-none"
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
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3 text-primary">
              <Info className="mt-0.5 flex-shrink-0" size={15} />
              <p className="text-xs font-bold leading-relaxed tracking-tight">
                {t("matrix.info")}
              </p>
            </div>
            <MatrixEditor
              basePrice={basePrice}
              productName={name}
              onUpdate={(rows) => setVariants(rows)}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Categorization Card */}
          <Card className="space-y-5" padding="sm" rounded="2xl" shadow="sm">
            <h2 className="text-sm font-heading font-bold text-neutral-dark flex items-center gap-2">
              <Boxes className="text-primary" size={18} />
              {t("form.organization")}
            </h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.sport_context")}</label>
                <Select value={sportId} onChange={(e) => setSportId(e.target.value)}>
                  <option value="" disabled>{t("form.select_sport")}</option>
                  {sportOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.store_category")}</label>
                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="" disabled>{t("form.select_category")}</option>
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          {/* Pricing Card */}
          <Card className="space-y-5" padding="sm" rounded="2xl" shadow="sm">
            <h2 className="text-sm font-heading font-bold text-neutral-dark flex items-center gap-2">
              <Euro className="text-primary" size={18} />
              {t("form.pricing")}
            </h2>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t("form.retail_price")}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300">€</div>
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

          {/* Media Card — multi-image */}
          <Card className="space-y-5" padding="sm" rounded="2xl" shadow="sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-bold text-neutral-dark flex items-center gap-2">
                <ImageIcon className="text-primary" size={18} />
                {t("form.media")}
              </h2>
              {images.length > 0 && (
                <span className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5">
                  {images.length === 1 ? t("form.media_photo", { count: 1 }) : t("form.media_photos", { count: images.length })}
                </span>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {images.length === 0 ? (
              /* Empty drop zone */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/3] bg-neutral-light border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 group hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:scale-105 group-hover:text-primary transition-all mb-3 shadow-sm border border-gray-100">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-bold text-neutral-dark uppercase tracking-tight">{t("form.drop_images")}</p>
                <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{t("form.select_files")}</p>
              </button>
            ) : (
              <div className="space-y-3">
                {/* Primary image large preview */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-light border border-gray-100 group">
                  <Image
                    src={images[primaryIdx]}
                    alt="Primary product image"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-black/40 text-white text-[9px] font-bold uppercase tracking-widest rounded-md backdrop-blur-sm flex items-center gap-1">
                      <Star size={10} className="fill-white" /> {t("form.media_primary")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(primaryIdx)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-neutral-dark shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Thumbnail grid */}
                <div className="grid grid-cols-3 gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPrimaryIdx(i)}
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden border-2 transition-all group/thumb bg-neutral-light",
                        i === primaryIdx
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-100 hover:border-primary/40"
                      )}
                    >
                      <Image src={src} alt={`Product image ${i + 1}`} fill className="object-cover" unoptimized />
                      {/* Remove button on each thumbnail */}
                      <div
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X size={16} className="text-white" />
                      </div>
                    </button>
                  ))}

                  {/* Add more tile */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Plus size={20} />
                    <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">{t("form.media_add")}</span>
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
