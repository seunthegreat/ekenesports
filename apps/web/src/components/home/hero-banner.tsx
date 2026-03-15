"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HERO_VIDEO_URL = "/hero-video.mp4";

export function HeroBanner() {
  const t = useTranslations("home");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setVideoLoaded(true);
    video.addEventListener("canplaythrough", handleCanPlay);

    return () => video.removeEventListener("canplaythrough", handleCanPlay);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
      <section className="relative overflow-hidden rounded-2xl bg-neutral-dark min-h-[500px] md:min-h-[600px] flex items-center">
        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />

        {/* Green-tinted overlay for brand feel */}
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

        {/* Fallback gradient while video loads */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-light animate-pulse" />
        )}

        <div className="relative px-6 md:px-12 py-16 md:py-24 w-full z-10">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed max-w-lg drop-shadow-md">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="text-base">
                  {t("shopNow")} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
