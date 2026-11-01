'use client';

import { Star } from 'lucide-react';
import { CountUp } from '@/components/animations/CountUp';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';

const DEMO_REVIEWS = [
  { name: 'Rahul Patil', initial: 'R', date: '2 weeks ago', text: 'Excellent quality drip irrigation materials. The staff helped me calculate exact requirements for my farm. Highly recommended!' },
  { name: 'Sanjay Deshmukh', initial: 'S', date: '1 month ago', text: 'Best wholesale rates for PVC pipes in Sangli district. Have been purchasing for my hardware store for years.' },
  { name: 'Amit Kadam', initial: 'A', date: '3 months ago', text: 'Prompt service and genuine products. Very satisfied with the Kothari spray hose.' },
];

export function ReviewsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Summary */}
          <ScrollReveal variant="fadeRight" className="lg:w-1/3 text-center lg:text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Trusted by Farmers & Businesses
            </h2>
            <div className="flex items-center justify-center lg:justify-start gap-4 my-6">
              <div className="text-6xl font-bold text-brand-green-700 font-heading">
                <CountUp end={4.6} decimals={1} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-gray-500 font-medium text-sm">Based on <CountUp end={127} /> Google Reviews</span>
              </div>
            </div>
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-brand-green-700 text-brand-green-700 font-semibold rounded-xl hover:bg-brand-green-700 hover:text-white transition-colors"
            >
              Write a Review
            </a>
          </ScrollReveal>

          {/* Review Cards */}
          <StaggerChildren className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_REVIEWS.map((review, idx) => (
              <ScrollReveal key={idx} variant="fadeUp" className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-green-100 text-brand-green-700 font-bold flex items-center justify-center shrink-0">
                    {review.initial}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  "{review.text}"
                </p>
              </ScrollReveal>
            ))}
          </StaggerChildren>
        </div>
        <p className="text-center text-xs text-gray-400 mt-12 italic">Reviews shown are placeholder data for demonstration.</p>
      </div>
    </section>
  );
}
