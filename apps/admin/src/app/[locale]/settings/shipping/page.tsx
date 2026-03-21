"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
   Truck,
   Plus,
   Edit2,
   Trash2,
   MapPin,
   Globe,
   Clock,
   Save,
   Search
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { toast } from "sonner";

const zones = [
   { id: "1", key: "domestic", count: 1, countries: ["DE"], active: true },
   { id: "2", key: "eu", count: 26, countries: ["FR", "IT", "ES", "NL", "..."], active: true },
   { id: "3", key: "international", count: 195, countries: ["US", "GB", "CN", "JP", "..."], active: false },
];

const shippingMethods = [
   { id: "m1", key: "dhl", zone: "Domestic", price: 0, threshold: 150, days: "1-2", active: true },
   { id: "m2", key: "standard", zone: "Domestic", price: 4.99, threshold: 50, days: "3-5", active: true },
   { id: "m3", key: "priority", zone: "EU", price: 12.50, threshold: 200, days: "2-4", active: true },
];

export default function ShippingSettings() {
   const t = useTranslations("Shipping");
   const [activeZone, setActiveZone] = useState(zones[0].id);
   const [deleteMethod, setDeleteMethod] = useState<any>(null);

   const handleSave = () => {
      toast.success(t("toast.update_success"), { description: t("toast.update_desc") });
   };

   useHotkeys("s", handleSave, { ctrlOrCmd: true, preventDefault: true });

   const activeZoneKey = zones.find(z => z.id === activeZone)?.key || "";

   return (
      <div className="space-y-6">

         {/* Zone Selector */}
         <section className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-primary">
                  <Globe size={18} />
                  <h2 className="text-sm font-bold text-neutral-dark">{t("title")}</h2>
               </div>
               <Button className="flex items-center gap-2 px-6 py-2.5 bg-neutral-dark text-white text-xs font-bold rounded-xl hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/10 whitespace-nowrap shrink-0 h-[36px]">
                  <Plus size={16} />
                  {t("create")}
               </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {zones.map((zone) => (
                  <div key={zone.id} onClick={() => setActiveZone(zone.id)} className="h-full">
                     <Card
                        className={cn(
                           "p-6 cursor-pointer transition-all border border-gray-100 h-full",
                           activeZone === zone.id ? "ring-2 ring-primary border-transparent bg-primary/5" : "hover:bg-white hover:shadow-lg hover:shadow-black/5"
                        )}
                        padding="none"
                        rounded="2xl"
                     >
                        <div className="flex flex-col h-full">
                           <div className="flex items-start justify-between mb-4">
                              <div className={cn(
                                 "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-sm",
                                 activeZone === zone.id ? "bg-primary text-white shadow-primary/20" : "bg-white border border-gray-100 text-gray-400 group-hover:bg-neutral-light"
                              )}>
                                 <MapPin size={18} />
                              </div>
                              <div className={cn(
                                 "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest whitespace-nowrap",
                                 zone.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                              )}>
                                 {zone.active ? t("active") : t("standby")}
                              </div>
                           </div>

                           <div className="mt-auto">
                              <h3 className="text-[13px] font-bold text-neutral-dark uppercase tracking-tight mb-0.5">{t(`zones.${zone.key}`)}</h3>
                              <p className="text-[11px] text-gray-400 font-medium">{zone.count} {t("territories")}</p>
                           </div>
                        </div>
                     </Card>
                  </div>
               ))}
            </div>
         </section>

         {/* Shipping Methods for Active Zone */}
         <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
               <div className="space-y-1">
                  <h3 className="text-lg font-heading font-bold text-neutral-dark">{t("methods")}</h3>
                  <p className="text-xs text-gray-500 font-medium">{t("active_rules", { zone: t(`zones.${activeZoneKey}`) })}</p>
               </div>
               <Button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 h-[36px]">
                  <Plus size={16} />
                  {t("add")}
               </Button>
            </div>

            <div className="space-y-4">
               {shippingMethods.filter(m => activeZone === "1" ? m.zone === "Domestic" : m.zone === "EU").map((method) => (
                  <Card key={method.id} className="p-4 md:p-6 group hover:border-primary/20 transition-all" rounded="2xl" shadow="none">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
                        <div className="flex items-center gap-4 md:gap-6 flex-1">
                           <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-light rounded-xl md:rounded-2xl flex items-center justify-center text-primary border border-gray-50 flex-shrink-0">
                              <Truck size={20} className="md:size-[22px]" />
                           </div>
                           <div className="space-y-0.5 md:space-y-1">
                              <h4 className="text-xs md:text-sm font-bold text-neutral-dark uppercase tracking-tight">{t(`methods_list.${method.key}`)}</h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                 <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary shrink-0" /> {t("methods_list.days", { count: method.days })}</span>
                                 <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md italic">{t("free_over", { amount: `€${method.threshold}` })}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100/60 sm:border-transparent">
                           <div className="sm:text-right">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{t("rate")}</p>
                              <p className="text-[18px] md:text-xl font-heading font-bold text-neutral-dark">
                                 {method.price === 0 ? t("methods_list.free") : `€${method.price.toFixed(2)}`}
                              </p>
                           </div>
                           <div className="flex items-center gap-2 h-10 border-l border-gray-100 sm:border-gray-100 pl-6 sm:pl-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-neutral-light text-gray-400 hover:text-primary transition-all">
                                 <Edit2 size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteMethod(method)} className="w-9 h-9 rounded-xl hover:bg-error/5 text-gray-400 hover:text-error transition-all">
                                 <Trash2 size={16} />
                              </Button>
                           </div>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
         </section>

         {/* Country Mapping Interface */}
         <section className="space-y-6">
            <div className="flex items-center gap-2 text-primary mb-2">
               <MapPin size={18} />
               <h2 className="text-sm font-bold text-neutral-dark">{t("mapping")}</h2>
            </div>

            <Card className="p-8 space-y-8" rounded="2xl" border="primary">
               <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input
                        type="text"
                        placeholder={t("search")}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-light border border-gray-100 rounded-xl text-xs font-bold outline-none placeholder:text-gray-400 focus:border-primary/20 transition-all shadow-sm h-11"
                     />
                  </div>
                  <Button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-neutral-dark text-white font-bold text-xs rounded-xl shadow-lg shadow-neutral-dark/10 hover:bg-neutral-dark/90 transition-all h-[44px]">
                     <Save size={16} />
                     {t("update")}
                  </Button>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {["germany", "france", "spain", "italy", "belgium", "denmark", "sweden", "poland", "austria", "portugal", "greece", "ireland"].map((countryKey) => (
                     <div key={countryKey} className="px-3 py-2 bg-white border border-gray-100 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
                        <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-neutral-dark">{t(`countries.${countryKey}`)}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                     </div>
                  ))}
                  <div className="px-3 py-2 bg-neutral-light border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase group hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
                     {t("more_territories", { count: 14 })}
                  </div>
               </div>
            </Card>
         </section>

         <ConfirmDialog
            isOpen={!!deleteMethod}
            onClose={() => setDeleteMethod(null)}
            onConfirm={() => toast.success(t("toast.remove_success", { name: t(`methods_list.${deleteMethod?.key}`) }))}
            title={t("delete_modal.title")}
            description={t("delete_modal.desc", { name: t(`methods_list.${deleteMethod?.key}`) })}
            confirmLabel={t("delete_modal.confirm")}
         />

      </div>
   );
}
