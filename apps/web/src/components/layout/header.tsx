"use client";

import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { deleteToken } from "@/utils/cookies";
import { LanguageSwitcher } from "./language-switcher";
import { CartDrawer } from "../cart/cart-drawer";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";


export function Header() {
  const router = useRouter();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const navLinks = [
    { href: "/products", label: t("products") },
    { href: "/products?gender=men", label: t("men") },
    { href: "/products?gender=women", label: t("women") },
    { href: "/products?gender=kids", label: t("kids") },
  ];

  const { user, logout: logoutStore, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await deleteToken();
    logoutStore();
    router.push("/");
  };

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

            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 hover:bg-neutral-light rounded-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-xs font-medium hidden md:block">{user?.firstName || 'Account'}</span>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b">
                    <p className="text-xs font-semibold text-neutral-dark">{user?.email}</p>
                    <p className="text-[10px] text-neutral-dark/40 uppercase font-bold">{user?.role}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-neutral-light">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-neutral-light font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-2 hover:bg-neutral-light rounded-lg" aria-label="Login">
                <User className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="p-2 hover:bg-neutral-light rounded-lg relative"
              aria-label={tCommon("cart")}
            >
              <ShoppingBag className="w-5 h-5" />
              {isMounted && itemCount > 0 && (
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
