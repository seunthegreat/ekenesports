"use client";

import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function OrderTimeline() {
  const t = useTranslations("Orders");

  const events = [
    { status: t("detail.activity.delivered"), time: t("detail.activity.time_ago", { time: "2h" }), desc: t("detail.activity.delivered_desc"), active: true },
    { status: t("detail.activity.in_transit"), time: t("detail.activity.time_ago", { time: "5h" }), desc: t("detail.activity.in_transit_desc"), active: true },
    { status: t("detail.activity.shipped"), time: t("detail.activity.time_ago", { time: "8h" }), desc: t("detail.activity.shipped_desc"), active: true },
    { status: t("detail.activity.confirmed"), time: t("detail.activity.time_ago", { time: "1d" }), desc: t("detail.activity.confirmed_desc"), active: true },
  ];

  return (
    <Card className="space-y-6" padding="md" shadow="sm">
      <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest flex items-center gap-2">
        <Clock size={14} className="text-primary" />
        {t("detail.activity_title")}
      </h3>
      <div className="space-y-6 pl-2">
        {events.map((event, i) => (
          <div key={i} className="relative flex gap-4">
            {i !== events.length - 1 && <div className="absolute left-1.5 top-6 w-px h-full bg-gray-100" />}
            <div className={cn(
              "w-3 h-3 rounded-full mt-1.5 shrink-0 z-10",
              event.active ? "bg-primary shadow-[0_0_0_4px] shadow-primary/10" : "bg-gray-200"
            )} />
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-dark">{event.status}</span>
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tight inline-flex items-center gap-1">
                  <Clock size={10} />
                  {event.time}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium leading-normal">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
