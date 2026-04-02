"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, ShoppingBag, Users, CreditCard, PackageCheck, Calendar, Check, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { useTranslations } from "next-intl";

function TrendingUpColor() { return <TrendingUp className="text-primary" size={20} /> }
function ShoppingBagColor() { return <ShoppingBag className="text-secondary" size={20} /> }
function UsersColor() { return <Users className="text-neutral-dark" size={20} /> }
function CreditCardColor() { return <CreditCard className="text-[#3b82f6]" size={20} /> }
function PackageCheckColor() { return <PackageCheck className="text-error" size={20} /> }

const statsConfig = [
  { key: "revenue", value: "€124,592.00", icon: TrendingUpColor, trend: "+12.5%", color: "primary" },
  { key: "orders", value: "1,245", icon: ShoppingBagColor, trend: "+5.2%", color: "secondary" },
  { key: "revenue", value: "€100.07", icon: CreditCardColor, trend: "+2.1%", color: "primary" },
  { key: "customers", value: "842", icon: UsersColor, trend: "+8.1%", color: "neutral-dark" },
  { key: "stock", value: "142", icon: PackageCheckColor, trend: "-1.5%", color: "error" },
];

const timeframeOptions = (t: any) => [
  { label: t("timeframes.30_days"), value: "30_days" },
  { label: t("timeframes.7_days"), value: "7_days" },
  { label: t("timeframes.24_hours"), value: "24_hours" },
  { label: t("timeframes.ytd"), value: "ytd" },
];

export function StatsGrid() {
  const t = useTranslations("Dashboard");
  const [timeframe, setTimeframe] = useState("30_days");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const timeframeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (timeframeRef.current && !timeframeRef.current.contains(e.target as Node)) {
        setIsTimeframeOpen(false);
      }
    };
    if (isTimeframeOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isTimeframeOpen]);

  return (
    <section className="space-y-6">
      <Reveal>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-neutral-dark">{t("overview")}</h2>

          <div className="relative" ref={timeframeRef}>
            <Button
              variant={isTimeframeOpen ? "default" : "outline"}
              onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
              size="sm"
            >
              <Calendar size={16} />
              {timeframeOptions(t).find(o => o.value === timeframe)?.label}
              <ChevronDown size={14} className={cn("ml-1 transition-transform", isTimeframeOpen && "rotate-180")} />
            </Button>

            {isTimeframeOpen && (
              <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-200">
                {timeframeOptions(t).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeframe(option.value);
                      setIsTimeframeOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-5 py-3 text-[13px] font-bold transition-colors flex items-center justify-between",
                      timeframe === option.value
                        ? "bg-primary/5 text-primary"
                        : "text-gray-500 hover:bg-gray-50 hover:text-neutral-dark"
                    )}
                  >
                    {option.label}
                    {timeframe === option.value && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Revenue Hero Card */}
          <Card className="xl:col-span-5 bg-neutral-dark relative overflow-hidden flex flex-col justify-between group min-h-[220px]" padding="lg" rounded="3xl" shadow="md">
            <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] transform scale-150 rotate-12 group-hover:scale-[1.6] group-hover:rotate-[15deg] transition-all duration-1000 pointer-events-none">
              <TrendingUp size={240} className="text-white" />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner overflow-hidden border border-white/5">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <span className="text-white/60 font-bold text-xs tracking-widest uppercase">{t("hero.title")}</span>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl lg:text-[44px] font-heading font-bold text-white tracking-tight leading-none">{statsConfig[0].value}</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 text-white font-bold text-xs rounded-lg uppercase tracking-widest backdrop-blur-md">
                  <ArrowUpRight size={14} /> {statsConfig[0].trend}
                </span>
                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">vs Last 30 Days</span>
              </div>
            </div>
          </Card>

          {/* Secondary Stats Grid */}
          <div className="xl:col-span-7 grid grid-cols-2 gap-4 md:gap-5">
            {statsConfig.slice(1).map((stat, i) => (
              <Card
                key={i}
                className="group hover:border-primary/20 hover:shadow-md transition-all duration-300 h-full flex flex-col"
                padding="sm"
                rounded="2xl"
                shadow="none"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                  <div className={cn(
                    "w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-300 border border-transparent",
                    i === 0 ? "bg-primary/10 text-primary group-hover:bg-primary/15 group-hover:border-primary/20" :
                    i === 1 ? "bg-secondary/10 text-secondary group-hover:bg-secondary/15 group-hover:border-secondary/20" :
                    i === 2 ? "bg-error/10 text-error group-hover:bg-error/15 group-hover:border-error/20" :
                              "bg-primary/5 text-primary-light group-hover:bg-primary/10 group-hover:border-primary/10"
                  )}>
                    <stat.icon />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-tight whitespace-nowrap",
                    stat.trend.startsWith("-") ? "text-error bg-error/10" : "text-primary bg-primary/10"
                  )}>
                    <ArrowUpRight size={12} className={cn(stat.trend.startsWith("-") ? "rotate-90 text-error" : "text-primary")} />
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-1 mt-auto">
                  <p className="text-xs font-bold text-gray-400 tracking-widest uppercase truncate">{t(stat.key)}</p>
                  <h3 className="text-xl md:text-2xl font-heading font-bold tracking-tight text-neutral-dark truncate">
                    {stat.value}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
