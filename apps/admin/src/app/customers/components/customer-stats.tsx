"use client";

import { 
  Users, 
  BadgeCheck, 
  Euro, 
  ArrowUpRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function CustomerStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl" border="primary">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Users size={20} />
        </div>
        <div>
          <p className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Total Database</p>
          <h3 className="text-xl font-heading font-extrabold text-neutral-dark">1,284</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
          <BadgeCheck size={20} />
        </div>
        <div>
          <p className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Active Now</p>
          <h3 className="text-xl font-heading font-extrabold text-neutral-dark">942</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
          <Euro size={20} />
        </div>
        <div>
          <p className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Avg. LTV</p>
          <h3 className="text-xl font-heading font-extrabold text-neutral-dark">€184.20</h3>
        </div>
      </Card>
      <Card className="flex items-center gap-5" padding="sm" rounded="2xl">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
          <ArrowUpRight size={20} />
        </div>
        <div>
          <p className="text-[10px] font-heading font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">MoM Growth</p>
          <h3 className="text-xl font-heading font-extrabold text-neutral-dark">+12.4%</h3>
        </div>
      </Card>
    </div>
  );
}
