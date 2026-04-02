"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import {
  Info,
  Layers,
  Euro,
  Boxes,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { MatrixEditor } from "@/components/products/matrix-editor";
import { ProductFilter } from "@/components/products/product-filter"; // Not used here but good to have consistency
import { ProductFormHeader } from "@/components/products/product-form-header";
import { ImageUploadCard } from "@/components/products/image-upload-card";
import { sports as mockSports, categories as mockCategories, mockProducts } from "@/lib/mock-data";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";


export default function ProductFormPage() {
  const t = useTranslations("Products");
  const router = useRouter();
  const tSports = useTranslations("Products.sports");
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  // Live Data Fetching
  const { data: liveSports } = trpc.sports.list.useQuery();
  const { data: liveCategories } = trpc.categories.list.useQuery();
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success(t("form.success_create"));
      router.push("/products");
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const productData = useMemo(() => {
    return isEditing ? mockProducts.find(p => p.id === editId) : null;
  }, [isEditing, editId]);

  const [basePrice, setBasePrice] = useState(productData?.basePrice || 0);
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [sportId, setSportId] = useState(productData?.sportId || "");
  const [categoryId, setCategoryId] = useState(productData?.categoryId || "");
  const [variants, setVariants] = useState<any[]>(productData?.variants || []);
  const [isUploading, setIsUploading] = useState(false);

  // Store File objects instead of just URLs for uploading
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>(
    productData?.images?.map(img => img.url) ?? []
  );
  const [primaryIdx, setPrimaryIdx] = useState(0);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles(prev => [...prev, ...files]);

    const urls = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...urls]);
    e.target.value = "";
  }, []);

  const handleSave = async () => {
    try {
      setIsUploading(true);

      // 1. Upload NEW images to Cloudinary
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload image");
        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      // 2. Combine with existing URLs (if editing)
      const allImages = [
        ...images.filter(img => !img.startsWith("blob:")), // Keep existing
        ...uploadedUrls // Add newly uploaded
      ].map((url, i) => ({
        url,
        alt: `${name} - Image ${i + 1}`,
      }));

      // 3. Create/Update Product
      await createProduct.mutateAsync({
        name,
        slug: name.toLowerCase().replace(/ /g, "-"),
        description,
        basePrice,
        sportId,
        categoryId,
        images: allImages,
        variants: variants.map(v => ({
          size: v.size,
          color: v.color,
          colorHex: v.colorHex || "#000",
          sku: v.sku || `${name.slice(0, 3)}-${v.size}-${v.color}`,
          price: v.price || basePrice,
          stock: v.stock || 0,
        })),
        featured: true,
      });

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (primaryIdx >= next.length) setPrimaryIdx(Math.max(0, next.length - 1));
      return next;
    });
    const imgUrl = images[index];
    if (imgUrl.startsWith("blob:")) {
      setSelectedFiles(prev => prev.filter((_, i) => i !== (index - images.filter(url => !url.startsWith("blob:")).length)));
    }
  };

  // Safe Swap: Use live data if available
  const finalSports = (liveSports && liveSports.length > 0) ? liveSports : mockSports;
  const finalCategories = (liveCategories && liveCategories.length > 0) ? liveCategories : mockCategories;

  const sportOptions = finalSports.map(s => ({ label: tSports(s.slug as any), value: s.id }));
  const categoryOptions = finalCategories.map(c => ({ label: c.name, value: c.id }));

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 pt-4">
      {/* Page Header */}
      <ProductFormHeader
        isEditing={isEditing}
        isUploading={isUploading}
        isPending={createProduct.isPending}
        onSave={handleSave}
      />

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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300 z-10">€</div>
                <Input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  placeholder={t("form.retail_price_placeholder")}
                  className="pl-10 text-2xl font-bold h-14 bg-neutral-light border-gray-100"
                />
              </div>
            </div>
          </Card>

          {/* Media Card */}
          <ImageUploadCard
            images={images}
            primaryIdx={primaryIdx}
            onPrimaryChange={setPrimaryIdx}
            onRemove={removeImage}
            onFileChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
