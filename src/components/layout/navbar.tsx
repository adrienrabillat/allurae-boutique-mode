"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Search, User, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { openCart, totalItems } = useCartStore();
  const { data: session } = useSession();
  const itemCount = totalItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      fetch("/api/products")
        .then((r) => r.json())
        .then((data) => setAllProducts(Array.isArray(data) ? data : []))
        .catch(() => {});
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const searchResults = searchQuery.trim().length >= 2
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/produits?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: "Nos Pièces", href: "/produits" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b border-allurae-borderLight ${
          isScrolled
            ? "bg-allurae-warmWhite/95 backdrop-blur-md py-3"
            : "bg-allurae-warmWhite/90 backdrop-blur-md py-5"
        }`}
      >
        <div className="container-custom flex justify-between items-center">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex flex-col gap-[5px] p-1"
            aria-label="Ouvrir le menu"
          >
            <span className="block w-[22px] h-[1.5px] bg-allurae-ink transition-transform" />
            <span className="block w-[22px] h-[1.5px] bg-allurae-ink transition-opacity" />
            <span className="block w-[22px] h-[1.5px] bg-allurae-ink transition-transform" />
          </button>

          <Link
            href="/"
            className="font-display text-[clamp(24px,3vw,32px)] tracking-[8px] text-allurae-ink font-light"
          >
            ALLURAE
          </Link>

          <div className="hidden md:flex gap-9">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] uppercase tracking-[1.5px] text-allurae-muted hover:text-allurae-ink relative group transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-allurae-terracotta transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex gap-4 text-allurae-muted items-center">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-allurae-ink transition-colors"
              aria-label="Rechercher"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link
              href={
                session
                  ? (session.user as any).role === "ADMIN"
                    ? "/admin"
                    : "/account"
                  : "/auth/signin"
              }
              className="hover:text-allurae-ink transition-colors"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button
              onClick={openCart}
              className="relative hover:text-allurae-ink transition-colors"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-allurae-terracotta text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] bg-allurae-ink/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="bg-allurae-warmWhite w-full max-w-[640px] mx-4 shadow-xl">
            <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-allurae-borderLight px-5 py-4 gap-3">
              <Search size={18} strokeWidth={1.5} className="text-allurae-muted flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit…"
                className="flex-1 bg-transparent outline-none text-[15px] text-allurae-ink placeholder:text-allurae-muted/60 font-light"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-allurae-muted hover:text-allurae-ink transition-colors"
                aria-label="Fermer"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </form>

            {searchResults.length > 0 && (
              <ul className="divide-y divide-allurae-borderLight max-h-[360px] overflow-y-auto">
                {searchResults.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/produits/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-allurae-sand transition-colors"
                    >
                      <div className="w-10 h-12 bg-allurae-sandDark flex-shrink-0 overflow-hidden">
                        {p.imageUrl ? (
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            width={40}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full product-placeholder" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-allurae-ink truncate">{p.name}</p>
                        <p className="text-[12px] text-allurae-muted">
                          {formatPrice(p.salePrice ?? p.price)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <p className="px-5 py-6 text-[14px] text-allurae-muted font-light text-center">
                Aucun produit trouvé pour &quot;{searchQuery}&quot;
              </p>
            )}

            {searchQuery.trim().length < 2 && (
              <p className="px-5 py-4 text-[12px] text-allurae-muted/60 uppercase tracking-[1.5px] text-center">
                Tapez au moins 2 caractères
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-allurae-warmWhite flex flex-col justify-center items-center">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 left-6 text-allurae-ink p-2"
            aria-label="Fermer le menu"
          >
            <X size={32} strokeWidth={1} />
          </button>
          <div className="flex flex-col gap-6 text-center">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-4xl text-allurae-ink font-light py-3 block"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
