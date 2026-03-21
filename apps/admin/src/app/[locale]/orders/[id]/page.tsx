"use client";

import { useState, useMemo, use } from "react";
import { Link, useRouter } from "@/i18n/routing";
import {
   ChevronLeft,
   Printer,
   Truck,
   PackageCheck,
   CreditCard,
   User,
   MapPin,
   Clock,
   History,
   FileText,
   ExternalLink,
   Copy,
   Check,
   AlertCircle,
   MoreVertical,
   ArrowRight
} from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const t = useTranslations("Orders");
   const router = useRouter();
   const { id } = use(params);
   const [isFulfilling, setIsFulfilling] = useState(false);
   const [copied, setCopied] = useState(false);

   const statusStyles: Record<string, { label: string; bg: string; text: string; dot: string }> = {
      confirmed: { label: t("status.confirmed"), bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
      processing: { label: t("status.processing"), bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
      shipped: { label: t("status.shipped"), bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
      delivered: { label: t("status.delivered"), bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
      cancelled: { label: t("status.cancelled"), bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
      refunded: { label: t("status.refunded"), bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
   };

   // Use the mock data find logic
   const order = useMemo(() => mockOrders.find(o => o.id === id) || mockOrders[0], [id]);

   const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   const status = statusStyles[order.status] || statusStyles.confirmed;

   return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 pt-2 font-body">
         {/* breadcrumb & Navigation */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
               <button
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors group mb-1"
               >
                  <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  {t("detail.back")}
               </button>
               <div className="flex items-center gap-4">
                  <h1 className="text-3xl lg:text-[40px] font-heading font-bold text-neutral-dark tracking-tight leading-none">
                     {t("detail.order_title", { orderNumber: order.orderNumber })}
                  </h1>
                  <span className={cn(
                     "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border",
                     status.bg, status.text, "border-transparent"
                  )}>
                     <span className={cn("w-1.5 h-1.5 rounded-full inline-block mr-1.5", status.dot)} />
                     {status.label}
                  </span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="font-medium">
                     {t("detail.placed_at", {
                        date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
                        time: "14:32"
                     })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className="font-bold text-gray-500">{t("detail.items_total", { count: 2 })}</span>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-500 font-bold rounded-xl text-xs hover:border-gray-200 transition-all shadow-sm">
                  <Printer size={16} />
                  {t("detail.invoicing")}
               </button>
               <button
                  onClick={() => setIsFulfilling(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:shadow-lg hover:shadow-primary/20 transition-all"
               >
                  <Truck size={16} />
                  {t("detail.fulfill_order")}
               </button>
            </div>
         </div>

         {/* Main Layout Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Col: Items & Payment */}
            <div className="lg:col-span-2 space-y-8">

               {/* Items List */}
               <Card className="space-y-6 overflow-hidden" padding="none">
                  <div className="px-6 py-5 border-b border-gray-50 bg-neutral-light/30 flex items-center justify-between">
                     <h2 className="text-sm font-heading font-bold text-neutral-dark flex items-center gap-2 uppercase tracking-wider">
                        {t("detail.items_title")}
                     </h2>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("detail.sku_fulfillment")}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                     {order.items.map((item, idx) => (
                        <div key={idx} className="p-6 flex items-center gap-6 group hover:bg-neutral-light/20 transition-colors">
                           <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                              <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-neutral-dark truncate mb-1">{item.name}</h4>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                    {item.variant}
                                 </span>
                                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{t("detail.qty", { count: item.quantity })}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-bold text-neutral-dark font-mono italic">€{item.price.toFixed(2)}</p>
                              <p className="text-[10px] text-gray-300 font-medium line-through">€{(item.price + 10).toFixed(2)}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                  {/* Totals Section */}
                  <div className="bg-neutral-light/20 p-8 border-t border-gray-50">
                     <div className="max-w-[300px] ml-auto space-y-3">
                        <div className="flex justify-between text-xs font-bold text-gray-400">
                           <span>{t("detail.subtotal")}</span>
                           <span className="text-neutral-dark">€{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-400">
                           <span>{t("detail.shipping_cost", { method: "DHL" })}</span>
                           <span className="text-neutral-dark">€{order.shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex justify-between items-center pt-1">
                           <span className="text-xs font-heading font-bold text-neutral-dark uppercase tracking-widest text-primary">{t("detail.total_amount")}</span>
                           <span className="text-xl font-heading font-bold text-neutral-dark font-mono">€{order.total.toFixed(2)}</span>
                        </div>
                     </div>
                  </div>
               </Card>

               {/* Payment & Fulfillment Status */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="space-y-4" padding="md" shadow="sm">
                     <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={14} className="text-primary" />
                        {t("detail.payment_details")}
                     </h3>
                     <div className="space-y-3 bg-neutral-light/50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center">
                           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight italic">{t("detail.transaction_id")}</span>
                           <span className="text-[11px] font-bold text-neutral-dark font-mono uppercase">ch_2Nf82mE...</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight italic">{t("detail.payment_status")}</span>
                           <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-100">{t("detail.paid_full")}</span>
                        </div>
                     </div>
                  </Card>
                  <Card className="space-y-4" padding="md" shadow="sm">
                     <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest flex items-center gap-2">
                        <Truck size={14} className="text-primary" />
                        {t("detail.shipping_method")}
                     </h3>
                     <div className="space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                              <Truck size={16} />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-neutral-dark">{order.shippingRate.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{order.shippingRate.description}</p>
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>
            </div>

            {/* Right Col: Customer & Timeline */}
            <div className="space-y-8">

               {/* Customer Overview */}
               <Card className="space-y-6" padding="md" shadow="sm">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                     <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        {t("detail.customer_log")}
                     </h3>
                     <Link href={`/customers/${order.id}`} className="p-1.5 hover:bg-neutral-light rounded-lg text-gray-300 hover:text-primary transition-colors">
                        <ArrowRight size={14} />
                     </Link>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm">
                        {order.shippingAddress.firstName?.[0] || ""}{order.shippingAddress.lastName?.[0] || ""}
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-neutral-dark">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</h4>
                        <p className="text-xs text-gray-400 font-medium">{t("detail.customer_id", { id: "8271" })}</p>
                     </div>
                  </div>
                  <div className="space-y-3 pt-2">
                     <div className="flex items-center gap-3 text-xs text-gray-500 font-medium group">
                        <FileText size={14} className="text-gray-300 group-hover:text-primary" />
                        <span className="truncate">{order.shippingAddress.email}</span>
                     </div>
                     <div className="flex items-center gap-3 text-xs text-gray-500 font-medium group">
                        <MapPin size={14} className="text-gray-300 group-hover:text-primary" />
                        <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                     </div>
                  </div>

                  <div className="h-px bg-gray-50" />

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest">{t("detail.delivery_address")}</h4>
                     <div className="relative p-4 bg-neutral-light rounded-2xl border border-gray-100 group">
                        <button
                           onClick={() => handleCopy(`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`)}
                           className="absolute top-3 right-3 p-2 bg-white rounded-lg text-gray-300 opacity-0 group-hover:opacity-100 hover:text-primary transition-all shadow-sm border border-gray-100"
                        >
                           {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <p className="text-[13px] text-neutral-dark font-bold leading-relaxed pr-8">
                           {order.shippingAddress.street}<br />
                           {order.shippingAddress.apartment && <>{order.shippingAddress.apartment}<br /></>}
                           {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                           {order.shippingAddress.country}
                        </p>
                     </div>
                  </div>
               </Card>

               {/* Timeline Card */}
               <Card className="space-y-6" padding="md" shadow="sm">
                  <h3 className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest flex items-center gap-2">
                     <Clock size={14} className="text-primary" />
                     {t("detail.activity_title")}
                  </h3>
                  <div className="space-y-6 pl-2">
                     {[
                        { status: t("detail.activity.delivered"), time: t("detail.activity.time_ago", { time: "2h" }), desc: t("detail.activity.delivered_desc"), active: true },
                        { status: t("detail.activity.in_transit"), time: t("detail.activity.time_ago", { time: "5h" }), desc: t("detail.activity.in_transit_desc"), active: true },
                        { status: t("detail.activity.shipped"), time: t("detail.activity.time_ago", { time: "8h" }), desc: t("detail.activity.shipped_desc"), active: true },
                        { status: t("detail.activity.confirmed"), time: t("detail.activity.time_ago", { time: "1d" }), desc: t("detail.activity.confirmed_desc"), active: true },
                     ].map((event, i) => (
                        <div key={i} className="relative flex gap-4">
                           {i !== 3 && <div className="absolute left-1.5 top-6 w-px h-full bg-gray-100" />}
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

            </div>
         </div>

         {/* Fulfillment Modal (Placeholder logic for Waybill generation) */}
         <Modal
            isOpen={isFulfilling}
            onClose={() => setIsFulfilling(false)}
            title={t("fulfill_modal.title")}
            maxWidth="md"
            footer={(
               <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2 text-primary">
                     <AlertCircle size={14} />
                     <span className="text-[11px] font-bold">{t("fulfill_modal.dhl_integrated")}</span>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setIsFulfilling(false)} className="px-5 py-2 text-xs font-bold text-gray-400">{t("fulfill_modal.cancel")}</button>
                     <button className="px-6 py-2.5 bg-neutral-dark text-white text-xs font-bold rounded-xl shadow-lg shadow-neutral-dark/10">
                        {t("fulfill_modal.confirm")}
                     </button>
                  </div>
               </div>
            )}
         >
            <div className="space-y-6 pt-2">
               <div className="p-4 bg-neutral-light/50 rounded-2xl border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center">
                     <p className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("fulfill_modal.weight")}</p>
                     <span className="text-xs font-bold text-neutral-dark">1.25 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <p className="text-[11px] font-heading font-bold text-[#1A1A2E]/60 uppercase tracking-widest">{t("fulfill_modal.courier")}</p>
                     <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">DHL PRO-EXP 24H</span>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-widest ml-1">{t("fulfill_modal.note_label")}</label>
                  <textarea
                     className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-primary/20 transition-all resize-none h-24 font-medium"
                     placeholder={t("fulfill_modal.note_placeholder")}
                  />
               </div>

               <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3 text-primary">
                  <Truck size={18} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold leading-normal">
                     {t("fulfill_modal.info")}
                  </p>
               </div>
            </div>
         </Modal>

      </div>
   );
}
