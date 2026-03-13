import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body text-allurae-ink selection:bg-allurae-terracotta selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
