import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-[#1E5631] text-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1 */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-2xl tracking-tight">AGRO BASE</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              Quality pipes, fittings, irrigation products and hardware for farms, businesses and everyday projects.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {/* Social icons placeholder */}
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors" />
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors" />
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Products', 'Categories', 'About', 'Brands', 'Contact'].map((item) => (
                <li key={item}>
                  <Link prefetch={true} href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Categories</h3>
            <ul className="space-y-2">
              {['Agriculture', 'Irrigation', 'Pipes', 'Fittings', 'Hardware'].map((item) => (
                <li key={item}>
                  <Link prefetch={true} href={`/category/${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg">Contact Us</h3>
            <address className="not-italic text-sm text-white/70 space-y-3">
              <p>{SITE_CONFIG?.address || 'Sangli, Maharashtra'}</p>
              <p>
                Phone: <a href={`tel:${SITE_CONFIG?.phone}`} className="hover:text-white">{SITE_CONFIG?.phone || '+91 9999999999'}</a>
              </p>
              <p>
                WhatsApp: <a href={`https://wa.me/${SITE_CONFIG?.whatsapp?.replace(/[^0-9]/g, '')}`} className="hover:text-white">{SITE_CONFIG?.whatsapp || '+91 9999999999'}</a>
              </p>
              <p>
                Email: <a href={`mailto:${SITE_CONFIG?.email}`} className="hover:text-white">{SITE_CONFIG?.email || 'info@agrobase.com'}</a>
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs text-center md:text-left">
            © {new Date().getFullYear()} AGRO BASE. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-white/60">
            <Link prefetch={true} href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link prefetch={true} href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link prefetch={true} href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link>
            <Link prefetch={true} href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
