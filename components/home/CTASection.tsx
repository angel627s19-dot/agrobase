'use client';

import { ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-brand-green-700">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute -right-40 -top-40 w-96 h-96 bg-brand-green-500 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
      <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-brand-orange-500 rounded-full blur-3xl opacity-20 mix-blend-screen"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <ScrollReveal variant="fadeUp" className="max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Need Help Choosing the Right Product?
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Our experts are ready to help you with wholesale quotes, product specifications, and custom requirements. Get in touch for instant assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/917249621323?text=Hello%20Agro%20Base%2C%20I%20would%20like%20to%20inquire%20about%20agricultural%20and%20plumbing%20supplies."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange-500 text-white rounded-xl font-bold hover:bg-brand-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Enquire on WhatsApp
            </a>
            <Link prefetch={true}
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
