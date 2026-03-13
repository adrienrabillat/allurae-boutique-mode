import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-allurae-ink text-white/60 pt-[60px] pb-[32px]">
      <div className="container-custom grid grid-cols-1 md:grid-cols-3 gap-[40px]">
        <div>
          <Link
            href="/"
            className="font-display text-[clamp(24px,3vw,32px)] tracking-[8px] text-white font-light mb-3 inline-block"
          >
            ALLURAE
          </Link>
          <p className="text-[14px] font-light leading-[1.7]">
            Yoga & Summer Essentials.
            <br />
            Conçu avec intention.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[2px] text-white/40 mb-4 font-medium font-body">
            Collections
          </h4>
          <ul className="space-y-1 text-[14px]">
            <li>
              <Link href="/categories/yoga" className="hover:text-white transition-colors py-1 block">
                Yoga
              </Link>
            </li>
            <li>
              <Link href="/categories/summer" className="hover:text-white transition-colors py-1 block">
                Summer
              </Link>
            </li>
            <li>
              <Link href="/categories/lounge" className="hover:text-white transition-colors py-1 block">
                Lounge
              </Link>
            </li>
            <li>
              <Link href="/categories/accessoires" className="hover:text-white transition-colors py-1 block">
                Accessoires
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[2px] text-white/40 mb-4 font-medium font-body">
            Informations
          </h4>
          <ul className="space-y-1 text-[14px]">
            <li>
              <Link href="/lookbook" className="hover:text-white transition-colors py-1 block">
                Lookbook
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors py-1 block">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition-colors py-1 block">
                FAQ & Forum
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors py-1 block">
                Livraison
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-custom mt-[48px] pt-[24px] border-t border-white/10 text-[12px] opacity-50">
        © 2026 ALLURAE. Tous droits réservés.
      </div>
    </footer>
  );
}
