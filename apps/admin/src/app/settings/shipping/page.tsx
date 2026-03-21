"use client";

import { useState } from "react";
import { 
  Truck, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Globe, 
  Euro, 
  Clock,
  ShieldAlert,
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
  { id: "1", name: "Domestic (Germany)", count: 1, countries: ["DE"], active: true },
  { id: "2", name: "European Union", count: 26, countries: ["FR", "IT", "ES", "NL", "..."], active: true },
  { id: "3", name: "International", count: 195, countries: ["US", "GB", "CN", "JP", "..."], active: false },
];

const shippingMethods = [
  { id: "m1", name: "DHL Express", zone: "Domestic", price: 0, threshold: 150, days: "1-2 Days", active: true },
  { id: "m2", name: "Standard Parcel", zone: "Domestic", price: 4.99, threshold: 50, days: "3-5 Days", active: true },
  { id: "m3", name: "EU Priority", zone: "EU", price: 12.50, threshold: 200, days: "2-4 Days", active: true },
];

export default function ShippingSettings() {
  const [activeZone, setActiveZone] = useState(zones[0].id);
  const [deleteMethod, setDeleteMethod] = useState<any>(null);

  const handleSave = () => {
    toast.success("Shipping mapping updated", { description: "Territory logic synchronized globally" });
  };

  useHotkeys("s", handleSave, { ctrlOrCmd: true, preventDefault: true });

  return (
    <div className="space-y-6">
      
      {/* Zone Selector */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-primary">
              <Globe size={18} />
              <h2 className="text-sm font-bold text-neutral-dark">Regional Logistics Zones</h2>
           </div>
           <Button className="flex items-center gap-2 px-6 py-2.5 bg-neutral-dark text-white text-xs font-bold rounded-xl hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/10 whitespace-nowrap shrink-0 h-[36px]">
              <Plus size={16} />
              Create Zone
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
                        "px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap",
                        zone.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                      )}>
                        {zone.active ? "Active" : "Standby"}
                      </div>
                   </div>
                   
                   <div className="mt-auto">
                      <h3 className="text-[13px] font-extrabold text-neutral-dark uppercase tracking-tight mb-0.5">{zone.name}</h3>
                      <p className="text-[11px] text-gray-400 font-medium">{zone.count} Territories Registered</p>
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
               <h3 className="text-lg font-heading font-extrabold text-neutral-dark">Delivery Methods</h3>
               <p className="text-xs text-gray-500 font-medium">Active rules for {zones.find(z => z.id === activeZone)?.name}</p>
            </div>
            <Button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 h-[36px]">
              <Plus size={16} />
              Add Method
            </Button>
         </div>

         <div className="space-y-4">
            {shippingMethods.filter(m => activeZone === "1" ? m.zone === "Domestic" : m.zone === "EU").map((method) => (
              <Card key={method.id} className="p-6 group hover:border-primary/20 transition-all" rounded="2xl" shadow="none">
                 <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6 flex-1">
                       <div className="w-12 h-12 bg-neutral-light rounded-2xl flex items-center justify-center text-primary border border-gray-50 flex-shrink-0">
                          <Truck size={22} />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-neutral-dark uppercase tracking-tight">{method.name}</h4>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {method.days}</span>
                             <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md italic">Free over €{method.threshold}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                       <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-0.5">Base Rate</p>
                          <p className="text-xl font-heading font-extrabold text-neutral-dark">
                             {method.price === 0 ? "FREE" : `€${method.price.toFixed(2)}`}
                          </p>
                       </div>
                       <div className="flex items-center gap-2 h-10 border-l border-gray-100 pl-8 opacity-0 group-hover:opacity-100 transition-opacity">
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
          <h2 className="text-sm font-bold text-neutral-dark">Territory Mapping</h2>
        </div>
        
        <Card className="p-8 space-y-8" rounded="2xl" border="primary">
           <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <Input 
                   type="text" 
                   placeholder="Search territories by code or name..." 
                   className="w-full pl-11 pr-4 py-3 bg-neutral-light border border-gray-100 rounded-xl text-xs font-bold outline-none placeholder:text-gray-400 focus:border-primary/20 transition-all shadow-sm h-11"
                 />
              </div>
              <Button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-neutral-dark text-white font-bold text-xs rounded-xl shadow-lg shadow-neutral-dark/10 hover:bg-neutral-dark/90 transition-all h-[44px]">
                 <Save size={16} />
                 Update Mapping
              </Button>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {["Germany", "France", "Spain", "Italy", "Belgium", "Denmark", "Sweden", "Poland", "Austria", "Portugal", "Greece", "Ireland"].map((country) => (
                <div key={country} className="px-3 py-2 bg-white border border-gray-100 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
                   <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-neutral-dark">{country}</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              ))}
              <div className="px-3 py-2 bg-neutral-light border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-[10px] font-extrabold text-gray-400 uppercase group hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
                 + 14 More
              </div>
           </div>
        </Card>
      </section>

      <ConfirmDialog
        isOpen={!!deleteMethod}
        onClose={() => setDeleteMethod(null)}
        onConfirm={() => toast.success(`${deleteMethod?.name} removed from active routing`)}
        title="Remove Delivery Method"
        description={`Are you sure you want to permanently delete the "${deleteMethod?.name}" delivery method from this zone? This change will reflect instantly on the storefront.`}
        confirmLabel="Remove Method"
      />

    </div>
  );
}
