"use client";

import { useState } from "react";
import { 
  Building2, 
  Mail, 
  Globe, 
  CreditCard, 
  Percent, 
  MessageSquare,
  Save,
  CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { toast } from "sonner";

export default function GeneralSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      toast.success("Settings saved successfully", { description: "Global configuration applied" });
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  useHotkeys("s", handleSave, { ctrlOrCmd: true, preventDefault: true });

  return (
    <div className="space-y-6">
      
       {/* Store Identity */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Building2 size={18} />
          <h2 className="text-sm font-bold text-neutral-dark">Store Identity</h2>
        </div>
        
        <Card className="p-6 space-y-6" rounded="2xl" border="primary">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block ml-1">Store Name</label>
                <Input 
                  type="text" 
                  defaultValue="Ekene Sport HQ"
                  className="w-full px-4 py-3 bg-neutral-light border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block ml-1">Support Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input 
                    type="email" 
                    defaultValue="concierge@ekenesport.com"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-light border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-11"
                  />
                </div>
              </div>
           </div>
           
           <div className="h-px w-full bg-gray-50" />
           
           <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Legal Operating Domain</label>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <Input 
                  type="text" 
                  defaultValue="ekenesport.com"
                  className="w-full pl-14 pr-5 py-4 bg-neutral-light border border-gray-100 rounded-2xl text-[13px] font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-12"
                />
              </div>
           </div>
        </Card>
      </section>

      {/* Regional Logic */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-secondary mb-2">
          <CreditCard size={20} />
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Financial Logic</h2>
        </div>
        
        <Card className="p-8 space-y-8" rounded="2xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Global Currency</label>
                <Dropdown 
                  options={[{ label: "Euro (€)", value: "EUR" }, { label: "US Dollar ($)", value: "USD" }, { label: "British Pound (£)", value: "GBP" }]}
                  value="EUR"
                  onChange={() => {}}
                  fullWidth
                  variant="input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Standard VAT Rate (%)</label>
                <div className="relative">
                  <Percent className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <Input 
                    type="number" 
                    defaultValue={19}
                    className="w-full pl-14 pr-5 py-4 bg-neutral-light border border-gray-100 rounded-2xl text-[13px] font-bold outline-none focus:border-primary/20 transition-all shadow-sm h-12"
                  />
                </div>
              </div>
           </div>
        </Card>
      </section>

      {/* Communication & Messaging */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-neutral-dark mb-2">
          <MessageSquare size={18} />
          <h2 className="text-sm font-bold text-neutral-dark">Marketing Broadcast</h2>
        </div>
        
        <Card className="p-6 space-y-6 bg-neutral-dark text-white border-white/5" rounded="2xl" border="primary">
           <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 block ml-1">Promo Bar Message</label>
              <textarea 
                defaultValue="Global Shipping Terminal Online — Free standard delivery on orders over €150.00"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium outline-none focus:border-primary-light/50 transition-all h-24 resize-none"
              />
           </div>
           <div className="flex items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-gray-400">
              <MessageSquare size={14} className="text-primary-light" />
              This text will appear at the very top of your global storefront across all locales.
           </div>
        </Card>
      </section>

      {/* Persistence Bar */}
      <div className="sticky bottom-8 z-20">
         <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-4 rounded-3xl shadow-2xl flex items-center justify-between mx-auto max-w-lg scale-in-center">
            <div className="flex items-center gap-4 pl-4 whitespace-nowrap overflow-hidden">
               {showSuccess ? (
                 <div className="flex items-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 size={18} />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest">Logic Persisted Successfully</span>
                 </div>
               ) : (
                 <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Unsaved Configuration Detected
                 </div>
               )}
            </div>
            <Button
               onClick={handleSave}
               disabled={isSaving}
               className={cn(
                 "flex items-center gap-2 px-6 py-2.5 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 h-[38px]",
                 showSuccess ? "bg-emerald-500 shadow-emerald-500/20 text-white" : "bg-neutral-dark text-white hover:bg-neutral-dark/90 shadow-neutral-dark/10"
               )}
            >
               {isSaving ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <Save size={16} />
               )}
               {isSaving ? "Saving..." : "Save Changes"}
            </Button>
         </div>
      </div>

    </div>
  );
}
