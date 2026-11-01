'use client';

import { BRANDS_DATA } from '@/lib/constants';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';

export function BrandsSection() {
  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-brand-dark">
            Trusted Brands We Stock
          </h2>
        </ScrollReveal>

        <StaggerChildren staggerDelay={0.1} className="flex flex-wrap justify-center gap-6 md:gap-8">
          {BRANDS_DATA.map((brand) => (
            <ScrollReveal key={brand.id} variant="scaleIn">
              <div className="px-8 py-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-green-200 hover:bg-brand-green-50/50 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center min-w-[160px]">
                <span className="font-heading font-bold text-xl text-gray-500 uppercase tracking-widest hover:text-brand-green-700 transition-colors">
                  {brand.name}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
