"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { sports } from "@/lib/data";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function SportSelector() {
  const t = useTranslations("home");
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
        {t("sportsTitle")}
      </h2>
      <div
        ref={sectionRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x"
        onMouseLeave={() => setHoveredId(null)}
      >
        {sports.map((sport, index) => (
          <Link
            key={sport.id}
            href={`/sports/${sport.slug}`}
            className="flex-shrink-0 snap-start"
            onMouseEnter={() => setHoveredId(sport.id)}
          >
            <div
              className="relative overflow-hidden rounded-xl transition-all duration-500 ease-out"
              style={{
                width: hoveredId === sport.id ? "11rem" : "10rem",
                height: hoveredId === sport.id ? "11rem" : "10rem",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? `translateY(0) scale(${
                      hasHover
                        ? hoveredId === sport.id
                          ? 1.05
                          : 0.95
                        : 1
                    })`
                  : "translateY(2.5rem)",
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                filter:
                  hasHover && hoveredId !== sport.id
                    ? "brightness(0.6)"
                    : "brightness(1)",
              }}
            >
              <Image
                src={sport.image}
                alt={sport.name}
                fill
                className={`object-cover transition-transform duration-500 ${
                  hoveredId === sport.id ? "scale-110" : "scale-100"
                }`}
                sizes="(min-width: 768px) 176px, 160px"
              />
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  hoveredId === sport.id
                    ? "bg-gradient-to-t from-primary/80 via-primary/30 to-transparent"
                    : "bg-gradient-to-t from-black/70 to-transparent"
                }`}
              />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p
                  className={`font-semibold transition-all duration-500 ${
                    hoveredId === sport.id ? "text-base" : "text-sm"
                  }`}
                >
                  {sport.name}
                </p>
              </div>
              {/* Shine overlay on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-opacity duration-500 pointer-events-none"
                style={{
                  opacity: hoveredId === sport.id ? 1 : 0,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
