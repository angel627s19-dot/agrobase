'use client';

import { WHY_CHOOSE_US } from '@/lib/constants';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import * as LucideIcons from 'lucide-react';

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-brand-light">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-dark mb-4">
            Why Choose Agro Base?
          </h2>
          <p className="text-gray-600 text-lg">
            We are committed to providing the best agricultural and plumbing solutions with unmatched service.
          </p>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((item, idx) => {
            // @ts-ignore
            const Icon = LucideIcons[item.icon] || LucideIcons.CheckCircle;
            return (
              <ScrollReveal key={idx} variant="fadeUp" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-brand-green-50 rounded-xl flex items-center justify-center text-brand-green-700 mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </ScrollReveal>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
