"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, ShoppingBag, Users, AlertTriangle, CreditCard, PackageCheck, Calendar, Check, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef, useEffect } from "react";

function TrendingUpColor() { return <TrendingUp className="text-primary" size={20} /> }
function ShoppingBagColor() { return <ShoppingBag className="text-secondary" size={20} /> }
function UsersColor() { return <Users className="text-neutral-dark" size={20} /> }
function CreditCardColor() { return <CreditCard className="text-[#3b82f6]" size={20} /> }
function PackageCheckColor() { return <PackageCheck className="text-error" size={20} /> }

const stats = [
  { name: "Total Revenue", value: "€124,592.00", icon: TrendingUpColor, trend: "+12.5%", color: "primary" },
  { name: "Orders", value: "1,245", icon: ShoppingBagColor, trend: "+5.2%", color: "secondary" },
  { name: "Avg. Order Value", value: "€100.07", icon: CreditCardColor, trend: "+2.1%", color: "primary" },
  { name: "Customers", value: "842", icon: UsersColor, trend: "+8.1%", color: "neutral-dark" },
  { name: "Pending Shipments", value: "142", icon: PackageCheckColor, trend: "-1.5%", color: "error" },
];

const timeframeOptions = [
  { label: "Last 30 Days", value: "30_days" },
  { label: "Last 7 Days", value: "7_days" },
  { label: "Last 24 Hours", value: "24_hours" },
  { label: "Year to Date", value: "ytd" },
];

const topProducts = [
  { id: "1", name: "Pro Elite Jersey", sport: "Football", sold: 452, revenue: "€22,509.60" },
  { id: "2", name: "Court Mastery Shoes", sport: "Basketball", sold: 310, revenue: "€40,300.00" },
  { id: "3", name: "Aero Glide Running Shorts", sport: "Running", sold: 289, revenue: "€10,115.00" },
  { id: "4", name: "PowerGrip Gloves", sport: "Training", sold: 195, revenue: "€4,875.00" },
  { id: "5", name: "ServePro Tennis Racket", sport: "Tennis", sold: 120, revenue: "€23,880.00" },
];

const topProductsCols = [
  { header: "Product", accessor: (p: any) => p.name, className: "font-bold text-neutral-dark whitespace-nowrap" },
  { header: "Sport", accessor: (p: any) => p.sport },
  { header: "Sold", accessor: (p: any) => <span className="text-gray-500 font-extrabold">{p.sold}</span> },
  { header: "Revenue", accessor: (p: any) => p.revenue, className: "font-mono font-bold text-primary text-right whitespace-nowrap" },
];

const recentOrders = [
  { id: "#ORD-9012", customer: "Michael Chen", total: "€145.00", status: "Processing" },
  { id: "#ORD-9011", customer: "Sarah Jenkins", total: "€89.50", status: "Shipped" },
  { id: "#ORD-9010", customer: "David Rossi", total: "€210.00", status: "Delivered" },
  { id: "#ORD-9009", customer: "Emma Thompson", total: "€45.00", status: "Processing" },
  { id: "#ORD-9008", customer: "James Wilson", total: "€320.00", status: "Pending" },
];

const recentOrdersCols = [
  { header: "Order ID", accessor: (o: any) => <Link href={`/orders/${o.id}`} className="text-primary font-bold hover:underline">{o.id}</Link> },
  { header: "Customer", accessor: (o: any) => o.customer, className: "font-medium whitespace-nowrap" },
  { header: "Total", accessor: (o: any) => o.total, className: "font-mono font-bold" },
  {
    header: "Status", accessor: (o: any) => (
      <span className={cn(
        "px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest",
        o.status === "Delivered" ? "bg-emerald-50 text-emerald-600" :
          o.status === "Shipped" ? "bg-indigo-50 text-indigo-600" :
            o.status === "Processing" ? "bg-amber-50 text-amber-600" :
              "bg-gray-100 text-gray-500"
      )}>
        {o.status}
      </span>
    )
  },
];

export default function DashboardPage() {
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
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Page Header */}
      <div className="max-w-2xl">
        <h1 className="text-3xl lg:text-[40px] font-heading font-extrabold text-neutral-dark tracking-tight leading-tight">
          Welcome to <span className="text-primary">Ekene Sport</span> Admin
        </h1>
        <p className="text-[15px] text-gray-500 font-medium mt-2 leading-relaxed">
          The ultimate engine for managing your storefront, inventory, and global shipping.
        </p>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* Stats Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-extrabold text-neutral-dark">Overview & Metrics</h2>
          
          <div className="relative" ref={timeframeRef}>
            <Button
              variant={isTimeframeOpen ? "default" : "outline"}
              onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
              size="sm"
            >
              <Calendar size={16} />
              {timeframeOptions.find(o => o.value === timeframe)?.label}
              <ChevronDown size={14} className={cn("ml-1 transition-transform", isTimeframeOpen && "rotate-180")} />
            </Button>

            {isTimeframeOpen && (
              <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-200">
                {timeframeOptions.map((option) => (
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
                <span className="text-white/60 font-extrabold text-[10px] tracking-widest uppercase">Global Revenue</span>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl lg:text-[44px] font-heading font-extrabold text-white tracking-tight leading-none">{stats[0].value}</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] rounded-lg uppercase tracking-widest backdrop-blur-md">
                  <ArrowUpRight size={14} /> {stats[0].trend}
                </span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">vs Last 30 Days</span>
              </div>
            </div>
          </Card>

          {/* Secondary Stats Grid */}
          <div className="xl:col-span-7 grid grid-cols-2 gap-5">
            {stats.slice(1).map((stat, i) => (
              <Card
                key={i}
                className="group hover:border-gray-200 transition-all duration-300 h-full flex flex-col"
                padding="md"
                rounded="2xl"
                shadow="none"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-11 h-11 bg-neutral-light rounded-xl flex items-center justify-center group-hover:bg-primary/5 group-hover:scale-105 transition-all duration-300 border border-transparent group-hover:border-primary/10">
                    <stat.icon />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-tighter",
                    stat.trend.startsWith("-") ? "text-error bg-error/10" : "text-emerald-600 bg-emerald-50"
                  )}>
                    <ArrowUpRight size={12} className={cn(stat.trend.startsWith("-") ? "rotate-90 text-error" : "text-emerald-500")} />
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-1.5 mt-auto">
                  <p className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">{stat.name}</p>
                  <h3 className="text-2xl font-heading font-extrabold tracking-tight text-neutral-dark truncate">
                    {stat.value}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Alerts & Critical Info */}
      <section className="space-y-6">
        <h2 className="text-xl font-heading font-extrabold text-neutral-dark flex items-center gap-2">
          Alerts
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
              <h3 className="text-lg font-heading font-extrabold text-neutral-dark">12 Low Stock Variants</h3>
              <p className="text-[14px] text-gray-500 font-medium max-w-2xl leading-relaxed">
                Critical items from your collection are falling below reorder thresholds. Immediate replenishment is recommended.
              </p>
              <div className="pt-4">
                <Link
                  href="/products/stock"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-dark text-white font-bold rounded-xl text-xs hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/10 group"
                >
                  Stock Manager <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Detail Widgets */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-extrabold text-neutral-dark">Top Selling Products</h2>
          <DataTable data={topProducts} columns={topProductsCols} className="bg-white" pageSize={5} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-extrabold text-neutral-dark">Recent Orders</h2>
            <Link href="/orders" className="text-xs font-bold text-primary hover:underline">View All &rarr;</Link>
          </div>
          <DataTable data={recentOrders} columns={recentOrdersCols} className="bg-white" pageSize={5} />
        </div>
      </section>
    </div>
  );
}
