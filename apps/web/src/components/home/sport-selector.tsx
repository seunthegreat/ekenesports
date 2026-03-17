"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const genderCategories = [
  {
    id: "men",
    gender: "men",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop",
  },
  {
    id: "women",
    gender: "women",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
  },
  {
    id: "kids",
    gender: "kids",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=800&fit=crop",
  },
];

export function SportSelector() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hasHover = hoveredId !== null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h2
        className={`font-heading text-2xl md:text-3xl font-bold text-neutral-dark mb-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {t("shopByTitle")}
      </h2>
      <div
        ref={sectionRef}
        className="grid grid-cols-3 gap-4 md:gap-6"
        onMouseLeave={() => setHoveredId(null)}
      >
        {genderCategories.map((cat, index) => (
          <Link
            key={cat.id}
            href={`/products?gender=${cat.gender}`}
            onMouseEnter={() => setHoveredId(cat.id)}
          >
            <div
              className="relative overflow-hidden aspect-[3/4] transition-all duration-500 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? `translateY(0) scale(${
                      hasHover
                        ? hoveredId === cat.id
                          ? 1.02
                          : 0.98
                        : 1
                    })`
                  : "translateY(2.5rem)",
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                filter:
                  hasHover && hoveredId !== cat.id
                    ? "brightness(0.7)"
                    : "brightness(1)",
              }}
            >
              <Image
                src={cat.image}
                alt={tNav(cat.id as "men" | "women" | "kids")}
                fill
                className={`object-cover transition-transform duration-500 ${
                  hoveredId === cat.id ? "scale-110" : "scale-100"
                }`}
                sizes="(max-width: 768px) 33vw, 400px"
              />
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  hoveredId === cat.id
                    ? "bg-gradient-to-t from-primary/80 via-primary/30 to-transparent"
                    : "bg-gradient-to-t from-black/70 to-transparent"
                }`}
              />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p
                  className={`font-heading font-bold transition-all duration-500 ${
                    hoveredId === cat.id ? "text-xl md:text-2xl" : "text-lg md:text-xl"
                  }`}
                >
                  {tNav(cat.id as "men" | "women" | "kids")}
                </p>
              </div>
              <div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-opacity duration-500 pointer-events-none"
                style={{
                  opacity: hoveredId === cat.id ? 1 : 0,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
