"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, LogOut, HelpCircle, Menu, X } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produits", href: "/admin/products", icon: Package },
  { label: "Catégories", href: "/admin/categories", icon: FolderOpen },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { label: "FAQ / Forum", href: "/admin/faq", icon: HelpCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <Link href="/admin" className="font-display text-xl tracking-[6px] text-allurae-ink font-light">
            ALLURAE
          </Link>
          <p className="text-xs text-gray-500 mt-1">Administration</p>
        </div>
        {/* Close button on mobile */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-allurae-terracotta/10 text-allurae-terracotta font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Voir la boutique
        </Link>
        <button
          onClick={() => signOut().then(() => (window.location.href = "/"))}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors w-full"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 text-gray-700 hover:text-gray-900"
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>
        <Link href="/admin" className="font-display text-base tracking-[4px] text-allurae-ink font-light">
          ALLURAE
        </Link>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white flex flex-col transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
