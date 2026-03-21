"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  History,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Database,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, key: "dashboard" },
  { name: "Products", href: "/products", icon: Package, key: "products" },
  { name: "Stock", href: "/stock", icon: Database, key: "stock" },
  { name: "Orders", href: "/orders", icon: History, key: "orders" },
  { name: "Customers", href: "/customers", icon: Users, key: "customers" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, key: "analytics" },
  { name: "Settings", href: "/settings/general", match: "/settings", icon: Settings, key: "settings" },
];

// Shown only when sidebar is collapsed to icon-only width
function CollapsedMark() {
  return (
    <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
      <Image
        src="/es.svg"
        alt="ES"
        width={32}
        height={32}
        priority
      />
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tNav = useTranslations("Navigation");
  const tUser = useTranslations("User");
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isCollapsed = !isMobile && sidebarWidth < 200;

  // Drag-to-resize (desktop)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return;
      setSidebarWidth(Math.min(280, Math.max(76, e.clientX)));
    };
    const onUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.body.style.cursor = "col-resize";
    } else {
      document.body.style.cursor = "default";
    }
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isResizing]);

  // Mobile breakpoint detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close drawer on route change
  useEffect(() => setIsMobileOpen(false), [pathname]);

  const sidebarPx = isMobile ? "272px" : `${isCollapsed ? 76 : sidebarWidth}px`;

  return (
    <div className="bg-white h-screen overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex h-screen relative overflow-hidden bg-white shadow-2xl shadow-black/5 ring-1 ring-gray-200/50">

        {/* Mobile backdrop */}
        {isMobileOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside
          className={cn(
            "h-screen flex flex-col z-50 bg-white border-r border-gray-100 transition-transform duration-300",
            isMobile ? "fixed top-0 left-0" : "sticky top-0 lg:transition-none lg:translate-x-0",
            isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
          )}
          style={{ width: sidebarPx, flexShrink: 0 }}
        >

          {/* ── Logo ── */}
          <div
            className={cn(
              "flex items-center justify-between flex-shrink-0 transition-all duration-300 relative",
              isCollapsed ? "px-[18px] py-6" : "px-6 py-7"
            )}
          >

            <div className={cn(
              "flex items-center gap-3 flex-1 transition-all duration-300 min-w-0",
              isCollapsed ? "opacity-0 invisible w-0 overflow-hidden" : "opacity-100 visible w-full"
            )}>
              <Image
                src="/logo.svg"
                alt="Ekene Sport"
                width={110}
                height={34}
                priority
                className="shrink-0"
              />
              <div className="ml-auto shrink-0">
                <LanguageSwitcher compact={sidebarWidth < 260} />
              </div>
            </div>

            <div className={cn(
              "absolute left-6 flex items-center transition-all duration-300 pointer-events-none",
              isCollapsed ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-75"
            )}>
              <CollapsedMark />
            </div>

            {isMobile && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* ── Nav ── */}
          <nav
            className={cn(
              "flex-1 overflow-y-auto hide-scrollbar",
              isCollapsed ? "px-[14px] space-y-1" : "px-3 space-y-0.5"
            )}
          >
            {navigation.map((item) => {
              const isActive = item.match
                ? pathname.startsWith(item.match)
                : item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl transition-all duration-150 group select-none whitespace-nowrap",
                    isCollapsed
                      ? "justify-center w-10 h-10 mx-auto"
                      : "px-3 py-2.5 w-full",
                    isActive
                      ? "bg-primary/8 text-primary"
                      : "text-gray-500 hover:bg-gray-50 hover:text-neutral-dark"
                  )}
                >
                  <item.icon
                    size={17}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />

                  {!isCollapsed && (
                    <>
                      <span
                        className={cn(
                          "font-body text-[13.5px] flex-1",
                          isActive ? "font-semibold" : "font-medium"
                        )}
                      >
                        {tNav(item.key)}
                      </span>
                      {isActive && (
                        <span className="w-[5px] h-[5px] rounded-full bg-primary shrink-0" />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── User / logout CTA ── */}
          <div className={cn("flex-shrink-0", isCollapsed ? "p-[14px]" : "p-4")}>
            <div className="h-px bg-gray-100 mb-3" />

            <button
              className={cn(
                "flex items-center gap-3 w-full rounded-xl transition-all duration-150 group text-left",
                isCollapsed
                  ? "justify-center p-2 hover:bg-gray-50"
                  : "px-3 py-2.5 hover:bg-gray-50"
              )}
            >
              {/* Gradient avatar using theme colors */}
              <div
                className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0 font-heading font-bold text-[11px] text-white tracking-wide"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary-light), var(--color-primary))",
                }}
              >
                AS
              </div>

              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[13px] font-semibold text-neutral-dark truncate leading-snug">
                      {tUser("role")}
                    </p>
                    <p className="font-body text-[11px] text-gray-400 font-normal truncate">
                      admin@ekenesport.com
                    </p>
                  </div>
                  <LogOut
                    size={14}
                    className="text-gray-300 group-hover:text-error transition-colors shrink-0"
                  />
                </>
              )}
            </button>
          </div>

          {/* Drag handle — desktop only */}
          {!isMobile && (
            <div
              className="absolute top-0 right-0 w-[6px] h-full cursor-col-resize group z-50"
              onMouseDown={() => setIsResizing(true)}
            >
              <div className="w-px h-full mx-auto bg-transparent group-hover:bg-primary/20 transition-colors" />
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col h-screen transition-all duration-300 min-w-0">
          {/* Mobile top bar */}
          {isMobile && (
            <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-3 px-4 sticky top-0 z-30">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="p-2 -ml-1 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Menu size={20} />
              </button>
              <Image src="/logo.svg" alt="Ekene Sport" width={96} height={28} priority />
            </header>
          )}

          <main className="flex-1 p-6 lg:p-10 overflow-y-auto hide-scrollbar overflow-x-hidden pt-8">
            <div className="w-full pb-16">
              {children}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}