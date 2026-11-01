'use client';

import { ArrowRight, Sprout, Droplets, Pipette, Wrench, Hammer } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES_DATA } from '@/lib/constants';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

// Icon mapping
const ICONS: Record<string, React.ElementType> = {
  Sprout, Droplets, Pipette, Wrench, Hammer
};

export function CategorySection() {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-dark mb-4">
            Everything You Need. <span className="text-brand-green-700">In One Place.</span>
          </h2>
          <p className="text-gray-600 text-lg">Explore our extensive range of high-quality products across major categories.</p>
        </ScrollReveal>

        <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES_DATA.map((category) => {
            const Icon = ICONS[category.icon] || Pipette;
            
            return (
              <ScrollReveal key={category.id} variant="fadeUp" className="h-full">
                <Link 
                  href={`/category/${category.name.toLowerCase()}`}
                  className="group block relative h-[280px] rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <div className="w-12 h-12 bg-brand-green-700 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-white font-bold text-xl mb-1 group-hover:text-brand-green-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {category.count}+ Products
                    </p>
                    
                    <div className="flex items-center text-white/90 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      View Products <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
