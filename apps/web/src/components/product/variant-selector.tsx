"use client";

import { Variant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
  const t = useTranslations("product");

  const colors = Array.from(
    new Map(variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()
  );

  const selectedColor = selectedVariant?.color || colors[0]?.name;
  const sizesForColor = variants.filter((v) => v.color === selectedColor);

  const handleColorSelect = (colorName: string) => {
    const currentSize = selectedVariant?.size;
    const match = variants.find((v) => v.color === colorName && v.size === currentSize);
    const fallback = variants.find((v) => v.color === colorName);
    onSelect(match || fallback!);
  };

  const handleSizeSelect = (size: string) => {
    const match = variants.find((v) => v.color === selectedColor && v.size === size);
    if (match) onSelect(match);
  };

  return (
    <div className="space-y-4">
      {/* Color selector */}
      <div>
        <p className="text-sm font-medium mb-2">
          {t("selectColor")}: <span className="text-gray-500">{selectedColor}</span>
        </p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color.name)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                selectedColor === color.name ? "border-primary scale-110" : "border-gray-300"
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">
            {t("selectSize")}: <span className="text-gray-500">{selectedVariant?.size}</span>
          </p>
          <button className="text-xs text-primary hover:underline">{t("sizeGuide")}</button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {sizesForColor.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleSizeSelect(variant.size)}
              disabled={variant.stock === 0}
              className={cn(
                "h-10 rounded-lg text-sm font-medium border transition-colors",
                selectedVariant?.id === variant.id
                  ? "border-primary bg-primary text-white"
                  : variant.stock === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                  : "border-gray-300 hover:border-primary"
              )}
            >
              {variant.size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
