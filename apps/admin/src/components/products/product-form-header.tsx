"use client";

import { ChevronLeft, Save, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

interface ProductFormHeaderProps {
  isEditing: boolean;
  isUploading: boolean;
  isPending: boolean;
  onSave: () => void;
}

export function ProductFormHeader({
  isEditing,
  isUploading,
  isPending,
  onSave
}: ProductFormHeaderProps) {
  const t = useTranslations("Products");
  const router = useRouter();

  return (
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
          <Button variant="outline" size="sm" disabled={isUploading}>
            {t("form.save_draft")}
          </Button>
        )}
        <Button
          variant="default"
          size="sm"
          className="gap-2"
          onClick={onSave}
          disabled={isUploading || isPending}
        >
          {isUploading ? <Upload size={16} className="animate-bounce" /> : <Save size={16} />}
          {isUploading ? t("form.uploading") : (isEditing ? t("form.update") : t("form.publish"))}
        </Button>
      </div>
    </div>
  );
}
