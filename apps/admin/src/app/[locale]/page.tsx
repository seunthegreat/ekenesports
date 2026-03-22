"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, ShoppingBag, Users, AlertTriangle, CreditCard, PackageCheck, Calendar, Check, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useRef, useEffect } from "react";

function TrendingUpColor() { return <TrendingUp className="text-primary" size={20} /> }
function ShoppingBagColor() { return <ShoppingBag className="text-secondary" size={20} /> }
function UsersColor() { return <Users className="text-neutral-dark" size={20} /> }
function CreditCardColor() { return <CreditCard className="text-[#3b82f6]" size={20} /> }
function PackageCheckColor() { return <PackageCheck className="text-error" size={20} /> }

const statsConfig = [
  { key: "revenue", value: "€124,592.00", icon: TrendingUpColor, trend: "+12.5%", color: "primary" },
  { key: "orders", value: "1,245", icon: ShoppingBagColor, trend: "+5.2%", color: "secondary" },
  { key: "revenue", value: "€100.07", icon: CreditCardColor, trend: "+2.1%", color: "primary" }, // Note: reusing revenue for AOV logic if key matches, or I should add AOV key
  { key: "customers", value: "842", icon: UsersColor, trend: "+8.1%", color: "neutral-dark" },
  { key: "stock", value: "142", icon: PackageCheckColor, trend: "-1.5%", color: "error" },
];

const timeframeOptions = (t: any) => [
  { label: t("timeframes.30_days"), value: "30_days" },
  { label: t("timeframes.7_days"), value: "7_days" },
  { label: t("timeframes.24_hours"), value: "24_hours" },
  { label: t("timeframes.ytd"), value: "ytd" },
];

const topProducts = [
  { id: "1", name: "Pro Elite Jersey", sport: "Football", sold: 452, revenue: "€22,509.60" },
  { id: "2", name: "Court Mastery Shoes", sport: "Basketball", sold: 310, revenue: "€40,300.00" },
  { id: "3", name: "Aero Glide Running Shorts", sport: "Running", sold: 289, revenue: "€10,115.00" },
  { id: "4", name: "PowerGrip Gloves", sport: "Training", sold: 195, revenue: "€4,875.00" },
  { id: "5", name: "ServePro Tennis Racket", sport: "Tennis", sold: 120, revenue: "€23,880.00" },
];



export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const [timeframe, setTimeframe] = useState("30_days");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const timeframeRef = useRef<HTMLDivElement>(null);

  const topProductsCols = [
    { header: t("table.product"), accessor: (p: any) => p.name, className: "font-bold text-neutral-dark whitespace-nowrap" },
    { header: t("table.sport"), accessor: (p: any) => p.sport, className: "font-medium text-gray-500 whitespace-nowrap" },
    { header: t("table.sold"), accessor: (p: any) => p.sold, className: "font-bold text-neutral-dark whitespace-nowrap text-right" },
    { header: t("table.revenue"), accessor: (p: any) => p.revenue, className: "font-bold text-primary whitespace-nowrap text-right" },
  ];

  const recentOrders = [
    { id: "#ORD-9012", customer: "Michael Chen", total: "€145.00", status: "Processing" },
    { id: "#ORD-9011", customer: "Sarah Jenkins", total: "€89.50", status: "Shipped" },
    { id: "#ORD-9010", customer: "David Rossi", total: "€210.00", status: "Delivered" },
    { id: "#ORD-9009", customer: "Emma Thompson", total: "€45.00", status: "Processing" },
    { id: "#ORD-9008", customer: "James Wilson", total: "€320.00", status: "Pending" },
  ];

  const recentOrdersCols = [
    { header: t("table.order_id"), accessor: (o: any) => <Link href={`/orders/${o.id}`} className="text-primary font-bold hover:underline">{o.id}</Link> },
    { header: t("table.customer"), accessor: (o: any) => o.customer, className: "font-bold text-neutral-dark whitespace-nowrap" },
    { header: t("table.total"), accessor: (o: any) => o.total, className: "font-bold text-neutral-dark whitespace-nowrap" },
    {
      header: t("table.status"), accessor: (o: any) => (
        <Badge
          variant={
            o.status === "Delivered"   ? "default"   :
            o.status === "Shipped"     ? "secondary" :
            o.status === "Processing"  ? "secondary" :
                                         "outline"
          }
        >
          {o.status}
        </Badge>
      )
    },
  ];

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
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Page Header */}
      <div className="max-w-xl space-y-2">
        <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
          {t("welcome")} <span className="text-primary">Ekene Sport</span> Admin
        </h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">
          {t("description")}
        </p>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Stats Grid */}
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


      {/* Detail Widgets */}
      <Reveal delay={150}>
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-neutral-dark">{t("top_products")}</h2>
          <DataTable data={topProducts} columns={topProductsCols} className="bg-white" pageSize={5} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-neutral-dark">{t("recent_orders")}</h2>
            <Link href="/orders" className="text-xs font-bold text-primary hover:underline">{t("view_all")} &rarr;</Link>
          </div>
          <DataTable data={recentOrders} columns={recentOrdersCols} className="bg-white" pageSize={5} />
        </div>
        </section>
      </Reveal>

      {/* Alerts & Critical Info */}
      <Reveal delay={200}>
        <section className="space-y-6">
        <h2 className="text-xl font-heading font-bold text-neutral-dark flex items-center gap-2">
          {t("alerts")}
          <span className="flex h-2 w-2 rounded-full bg-error animate-pulse" />
        </h2>
        <Card className="border-error/10 bg-error/5 relative overflow-hidden" padding="md" rounded="2xl" shadow="none">
          {/* Accent treatment - subtle left border */}
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
    </div>
  );
}
