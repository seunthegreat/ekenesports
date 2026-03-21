"use client";

import { useState } from "react";
import { 
  TrendingUp, ShoppingBag, Users, ArrowUpRight, ArrowDownRight, 
  BarChart3, Download, Target, Globe, PieChart as PieChartIcon, Star, Check, Calendar, ChevronDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

// Data
const revenueData = [
  { name: 'Jan', value: 3100 }, { name: 'Feb', value: 4200 }, { name: 'Mar', value: 3800 }, 
  { name: 'Apr', value: 5100 }, { name: 'May', value: 4800 }, { name: 'Jun', value: 6200 }, 
  { name: 'Jul', value: 7100 }, { name: 'Aug', value: 6800 }, { name: 'Sep', value: 8200 }, 
  { name: 'Oct', value: 7900 }, { name: 'Nov', value: 9400 }, { name: 'Dec', value: 10200 }
];
const orderData = [
  { name: 'W1', value: 45 }, { name: 'W2', value: 52 }, { name: 'W3', value: 48 }, 
  { name: 'W4', value: 61 }, { name: 'W5', value: 55 }, { name: 'W6', value: 68 }, 
  { name: 'W7', value: 72 }, { name: 'W8', value: 65 }, { name: 'W9', value: 80 }, 
  { name: 'W10', value: 74 }, { name: 'W11', value: 88 }, { name: 'W12', value: 95 }
];

const sportsPerformance = [
  { name: "Football", revenue: 42500, orders: 412, growth: "+12%" },
  { name: "Basketball", revenue: 31200, orders: 284, growth: "+8%" },
  { name: "Running", revenue: 28400, orders: 310, growth: "+15%" },
  { name: "Training", revenue: 22100, orders: 245, growth: "-2%" },
];

const topProducts = [
  { id: "1", name: "Nike Air Zoom Pegasus 40", category: "Running", units: 142, revenue: 18450, rating: 4.8 },
  { id: "2", name: "Nike Mercurial Vapor 15", category: "Football", units: 98, revenue: 24500, rating: 4.9 },
  { id: "3", name: "Nike Dri-FIT DNA+ Shorts", category: "Basketball", units: 210, revenue: 11550, rating: 4.6 },
  { id: "4", name: "Nike Zoom Freak 5", category: "Basketball", units: 65, revenue: 9750, rating: 4.7 },
];

const regions = [
  { name: "Germany", value: 45, color: "bg-primary" },
  { name: "United Kingdom", value: 25, color: "bg-primary/60" },
  { name: "France", value: 15, color: "bg-primary/40" },
  { name: "Other EU", value: 15, color: "bg-primary/20" },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30_days");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);

  const timeframeOptions = [
    { label: "Last 30 Days", value: "30_days" },
    { label: "Last 7 Days", value: "7_days" },
    { label: "Fiscal Year", value: "ytd" },
  ];

  const topProductsColumns = [
    {
      header: "Product SKU",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessor: (p: any) => (
         <div className="text-[13px] font-extrabold text-neutral-dark hover:text-primary transition-colors cursor-pointer">{p.name}</div>
      ),
      className: "w-full"
    },
    {
      header: "Category",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessor: (p: any) => (
        <span className="text-[10px] font-extrabold bg-gray-50 px-2 py-1 rounded text-gray-400">{p.category}</span>
      ),
      className: "w-0 whitespace-nowrap"
    },
    {
      header: "Units",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessor: (p: any) => (
        <span className="text-[13px] font-bold text-neutral-dark">{p.units}</span>
      ),
      className: "w-0 whitespace-nowrap text-right"
    },
    {
      header: "Revenue",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessor: (p: any) => (
        <span className="text-[13px] font-extrabold text-primary">€{p.revenue.toLocaleString()}</span>
      ),
      className: "w-0 whitespace-nowrap text-right"
    },
    {
      header: "Rating",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessor: (p: any) => (
        <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-amber-500">
           <Star size={12} className="fill-amber-500 text-amber-500" /> {p.rating}
        </div>
      ),
      className: "w-0 whitespace-nowrap text-right mb-0"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10 pt-2">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-xl space-y-2">
          <h1 className="text-3xl lg:text-[40px] font-heading font-extrabold text-neutral-dark tracking-tight leading-none">
            Market Data & <span className="text-primary">Performance</span>
          </h1>
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed mt-2">
             Real-time telemetry of sales curves, customer acquisition, and logistics health across all zones.
          </p>
        </div>

        <div className="flex gap-3 relative z-40">
          <Button variant="outline" size="sm">
            <Download size={16} />
            Export CSV
          </Button>
          
          <div className="relative">
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
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      {/* PRIMARY KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Monthly Revenue", value: "€94,520", trend: "+12.4%", icon: TrendingUp },
          { label: "Average Order Value", value: "€168.00", trend: "+5.1%", icon: ShoppingBag },
          { label: "New Customers", value: "+342", trend: "+8.2%", icon: Users },
          { label: "Conversion Rate", value: "3.24%", trend: "-0.4%", icon: Target },
        ].map((kpi, i) => (
          <Card key={i} padding="md" rounded="2xl" shadow="none" border="primary" className="space-y-4">
             <div className="flex items-center justify-between">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  i === 0 ? "bg-primary/10 text-primary" : "bg-neutral-light text-gray-400"
                )}>
                  <kpi.icon size={20} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full",
                  kpi.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-error/5 text-error"
                )}>
                  {kpi.trend.startsWith("+") ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {kpi.trend}
                </div>
             </div>
             <div>
                <p className="text-[10px] font-heading font-extrabold text-gray-400 tracking-widest uppercase">{kpi.label}</p>
                <h3 className="text-2xl font-heading font-extrabold text-neutral-dark mt-1">{kpi.value}</h3>
             </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-0 relative">
        
        {/* Revenue Growth - Area Chart */}
        <Card className="lg:col-span-7 overflow-hidden" padding="lg" rounded="2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-heading font-extrabold text-neutral-dark">Financial Velocity</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Revenue Growth vs Previous Year</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold">
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> 2026</div>
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-100" /> Target</div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A6847" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0A6847" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} 
                  tickFormatter={(val) => `€${(val/1000)}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1A1A2E' }}
                  formatter={(value: any) => [`€${Number(value || 0).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#0A6847" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Density - Bar Chart */}
        <Card className="lg:col-span-5" padding="lg" rounded="2xl group">
           <div className="space-y-1 mb-6">
              <h3 className="text-lg font-heading font-extrabold text-neutral-dark">Order Volume</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Weekly Fulfillment Rate</p>
           </div>
           <div className="h-[280px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={orderData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                 <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} 
                   dy={10} 
                   interval="preserveStartEnd"
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} 
                 />
                 <Tooltip 
                   cursor={{ fill: '#F1F5F9' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   formatter={(value: any) => [`${value || 0} Orders`, 'Volume']}
                 />
                 <Bar dataKey="value" fill="#0A6847" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </Card>
      </div>

      {/* Secondary Row: Products & Sports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Performance by Sport */}
        <Card className="lg:col-span-4" padding="lg" rounded="2xl" shadow="sm">
           <div className="flex items-center gap-2 text-primary mb-8 border-b border-gray-50 pb-5">
              <PieChartIcon size={18} />
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Sport Logic Share</h3>
           </div>
           <div className="space-y-6">
              {sportsPerformance.map((sport, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex items-center justify-between text-[13px]">
                      <span className="font-extrabold text-neutral-dark uppercase tracking-tight">{sport.name}</span>
                      <span className="font-bold text-gray-400">€{(sport.revenue / 1000).toFixed(1)}k</span>
                   </div>
                   <div className="h-2 w-full bg-neutral-light rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", i === 0 ? "bg-primary" : "bg-primary/40")}
                        style={{ width: `${(sport.revenue / sportsPerformance[0].revenue) * 100}%` }}
                      />
                   </div>
                   <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest">
                      <span className="text-gray-300">{sport.orders} Orders</span>
                      <span className="text-emerald-500">{sport.growth}</span>
                   </div>
                </div>
              ))}
           </div>
        </Card>

        {/* Top Products Table */}
        <div className="lg:col-span-8 z-0">
           <div className="mb-4 pt-1">
              <div className="flex items-center gap-2 text-primary">
                 <ShoppingBag size={14} />
                 <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Unit Velocity - Top SKUs</h3>
              </div>
           </div>
           
           <DataTable 
             data={topProducts} 
             columns={topProductsColumns} 
             className="border-gray-100/60 shadow-sm bg-white"
             onRowClick={() => {}}
           />
        </div>
      </div>

      {/* Global Distribution Card */}
      <Card padding="lg" rounded="2xl" border="primary" className="bg-neutral-dark text-white overflow-hidden relative mt-8">
         <div className="absolute top-0 right-[-10%] w-[50%] h-full opacity-10 pointer-events-none">
            <Globe size={400} className="translate-x-1/4 -translate-y-1/4" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
            <div className="md:col-span-5 space-y-6">
               <div className="flex items-center gap-3 text-primary-light">
                  <Globe size={24} />
                  <h3 className="text-xl font-heading font-extrabold tracking-tight">Geographic Routing</h3>
               </div>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  Revenue concentration across international shipping zones. Germany maintains primary market dominance with the highest volume of DHL Express shipments.
               </p>
               <div className="pt-4">
                  <button className="px-8 py-3 bg-white text-neutral-dark text-[11px] font-extrabold uppercase tracking-widest rounded-2xl hover:bg-primary-light hover:text-white transition-all">
                    Expand Map View
                  </button>
               </div>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-6">
               {regions.map((reg, i) => (
                 <div key={i} className="space-y-4">
                    <div className="flex items-end justify-between">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{reg.name}</span>
                       <span className="text-lg font-extrabold text-white">{reg.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className={cn("h-full rounded-full", reg.color)}
                         style={{ width: `${reg.value}%` }}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </Card>

    </div>
  );
}
