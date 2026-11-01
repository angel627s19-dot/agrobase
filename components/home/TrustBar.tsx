'use client';

import { ShieldCheck, PackageOpen, LayoutGrid, Zap, MapPin } from 'lucide-react';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: 'Trusted Products' },
  { icon: PackageOpen, label: 'Wholesale & Retail' },
  { icon: LayoutGrid, label: 'Multiple Brands' },
  { icon: Zap, label: 'Fast Enquiry' },
  { icon: MapPin, label: 'Local Sangli Store' },
];

export function TrustBar() {
  return (
    <section className="bg-brand-light py-10 border-y border-gray-200/60">
      <div className="container mx-auto px-4">
        <StaggerChildren staggerDelay={0.1} className="flex flex-wrap justify-center gap-6 md:gap-12">
          {TRUST_ITEMS.map((item, index) => (
            <ScrollReveal key={index} variant="fadeIn" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green-50 flex items-center justify-center text-brand-green-700">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-700">{item.label}</span>
            </ScrollReveal>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
