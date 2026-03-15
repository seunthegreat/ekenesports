"use client";

import { ProductImage } from "@/lib/types";
import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden bg-neutral-light">
        <Image
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 overflow-hidden flex-shrink-0 border-2 transition-colors ${
                idx === selectedIndex ? "border-primary" : "border-transparent"
              }`}
            >
              <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
