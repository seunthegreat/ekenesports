"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Settings as SettingsIcon,
  Truck,
  ShieldCheck,
  Bell,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  {
    name: "General Configuration",
    href: "/settings/general",
    icon: SettingsIcon,
    desc: "Store identity, branding, and core metadata."
  },
  {
    name: "Logistics & Shipping",
    href: "/settings/shipping",
    icon: Truck,
    desc: "Manage delivery zones, rates, and DHL rules."
  },
  {
    name: "Staff & Intelligence",
    href: "/settings/staff",
    icon: ShieldCheck,
    desc: "RBAC permissions and administrative accounts."
  },
  // { 
  //   name: "Notifications", 
  //   href: "/settings/notifications", 
  //   icon: Bell, 
  //   desc: "Email triggers and internal system alerts." 
  // },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">

      {/* Header */}
      <div className="max-w-xl space-y-2">
        <h1 className="text-3xl lg:text-[40px] font-heading font-extrabold text-neutral-dark tracking-tight leading-none">
          Administrative <span className="text-primary">Settings</span>
        </h1>
        <p className="text-[15px] text-gray-500 font-medium leading-relaxed mt-2">
          Fine-tune your global storefront logic, regional logistics, and staff authorization protocols.
        </p>
      </div>

      <div className="h-px w-full bg-gray-100/60" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Sub-Navigation Sidebar */}
        <nav className="lg:col-span-4 space-y-2">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/settings" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-2xl transition-all border",
                  isActive
                    ? "bg-white border-gray-100 shadow-sm"
                    : "border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                    isActive ? "bg-primary text-white" : "bg-white border border-gray-100 text-gray-400 group-hover:text-primary"
                  )}>
                    <item.icon size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-[13px] font-extrabold uppercase tracking-tight transition-colors",
                      isActive ? "text-neutral-dark font-heading" : "text-gray-400 group-hover:text-neutral-dark"
                    )}>{item.name}</p>
                    <p className="text-[11px] text-gray-400 font-medium leading-none">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-primary translate-x-1" : "text-gray-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Settings Content Area */}
        <div className="lg:col-span-8 animate-in slide-in-from-right-4 fade-in duration-500">
          {children}
        </div>

      </div>
    </div>
  );
}
