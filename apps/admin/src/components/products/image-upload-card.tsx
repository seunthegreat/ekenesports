"use client";

import { Upload, X, Plus, Star, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRef } from "react";

interface ImageUploadCardProps {
  images: string[];
  primaryIdx: number;
  onPrimaryChange: (idx: number) => void;
  onRemove: (idx: number) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploadCard({
  images,
  primaryIdx,
  onPrimaryChange,
  onRemove,
  onFileChange
}: ImageUploadCardProps) {
  const t = useTranslations("Products");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFileChange}
      />

      {images.length === 0 ? (
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
              onClick={() => onRemove(primaryIdx)}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-neutral-dark shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onPrimaryChange(i)}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden border-2 transition-all group/thumb bg-neutral-light",
                  i === primaryIdx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-gray-100 hover:border-primary/40"
                )}
              >
                <Image src={src} alt={`Product image ${i + 1}`} fill className="object-cover" unoptimized />
                <div
                  onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                >
                  <X size={16} className="text-white" />
                </div>
              </button>
            ))}

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
  );
}
