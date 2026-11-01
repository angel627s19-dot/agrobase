'use client';

import { ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { SITE_CONFIG } from '@/lib/constants';

export function HeroSection() {
  const rawNumber = SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '');

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-10 pb-32">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0 bg-brand-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>
        
        {/* Animated circles/shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse duration-5000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-orange-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse duration-7000 delay-1000"></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto text-center flex flex-col items-center">
        <ScrollReveal delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8">
            <span>🌾 Trusted Agricultural Partner</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} variant="fadeUp">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white max-w-4xl tracking-tight leading-[1.1] mb-6 shadow-sm">
            Complete Agricultural & Plumbing Solutions
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 font-medium">
            Quality pipes, fittings, irrigation products and hardware for farms, businesses and everyday projects.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4} variant="fadeUp">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link prefetch={true}
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-green-700 rounded-xl font-bold hover:bg-brand-light transition-all hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href={`https://wa.me/${rawNumber}?text=${encodeURIComponent('Hello Agro Base, I would like to inquire about agricultural and plumbing supplies.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              Contact on WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-white">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
        </svg>
      </div>
    </section>
  );
}
