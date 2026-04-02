"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/routing";

export function LowStockAlert() {
  const t = useTranslations("Dashboard");

  return (
    <Reveal delay={200}>
      <section className="space-y-6">
        <h2 className="text-xl font-heading font-bold text-neutral-dark flex items-center gap-2">
          {t("alerts")}
          <span className="flex h-2 w-2 rounded-full bg-error animate-pulse" />
        </h2>
        <Card className="border-error/10 bg-error/5 relative overflow-hidden" padding="md" rounded="2xl" shadow="none">
          <div className="absolute top-0 left-0 w-1 h-full bg-error/20" />

          <div className="flex items-start gap-6">
            <div className="w-11 h-11 bg-white rounded-xl shadow-sm border border-error/10 flex items-center justify-center flex-shrink-0 text-error">
              <AlertTriangle size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-heading font-bold text-neutral-dark">12 Low Stock Variants</h3>
              <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
                Critical items from your collection are falling below reorder thresholds. Immediate replenishment is recommended.
              </p>
              <div className="pt-4">
                <Link href="/stock">
                  <Button variant="default" size="sm">
                    Stock Manager →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </Reveal>
  );
}
