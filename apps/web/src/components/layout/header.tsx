"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { LanguageSwitcher } from "./language-switcher";
import { CartDrawer } from "../cart/cart-drawer";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";
import Image from "next/image";

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  const navLinks = [
    { href: "/products", label: t("products") },
    { href: "/sports/football", label: t("football") },
    { href: "/sports/basketball", label: t("basketball") },
    { href: "/sports/running", label: t("running") },
    { href: "/sports/gym-training", label: t("gym") },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 -ml-2 hover:bg-neutral-light rounded-lg"
            aria-label={tCommon("menu")}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="Ekene Sport" width={130} height={40} priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-dark hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-neutral-light rounded-lg"
              aria-label={tCommon("search")}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 hover:bg-neutral-light rounded-lg relative"
              aria-label={tCommon("cart")}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-secondary text-neutral-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
