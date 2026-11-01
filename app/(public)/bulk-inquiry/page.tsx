'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, Package, Tag } from 'lucide-react';
import { inquirySchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';

type InquiryFormValues = z.infer<typeof inquirySchema>;

export default function BulkInquiryPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema)
  });

  const onSubmit = async (data: InquiryFormValues) => {
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-green-700">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Bulk Inquiry</span>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold mb-2">Bulk Inquiry</h1>
        <p className="text-gray-500 text-lg">Request wholesale pricing for bulk orders</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-white rounded-2xl shadow-sm p-10 text-center border border-green-100"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-brand-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Submitted Successfully</h2>
              <p className="text-gray-600 mb-8">Our wholesale team will review your requirements and contact you shortly with the best pricing.</p>
              <Button onClick={() => setIsSuccess(false)} variant="outline" className="min-w-[200px]">
                Submit Another Inquiry
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 space-y-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Contact Name *</label>
                  <input {...register('name')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Business Name (Optional)</label>
                  <input {...register('businessName')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <input {...register('phone')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none" placeholder="10-digit number" />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address (Optional)</label>
                  <input {...register('email')} type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none" />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Products Needed *</label>
                <textarea {...register('products')} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none resize-none" placeholder="List the products you are interested in..." />
                {errors.products && <p className="text-xs text-red-500">{errors.products.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estimated Quantity *</label>
                <input {...register('quantity')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none" placeholder="e.g., 500 kg, 1000 bags" />
                {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Additional Message (Optional)</label>
                <textarea {...register('message')} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none resize-none" placeholder="Any specific requirements or questions..." />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-12 text-lg bg-brand-green-700 hover:bg-brand-green-800"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </form>
          )}
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="bg-brand-green-700 text-white rounded-2xl shadow-card p-8">
            <h3 className="text-xl font-heading font-bold mb-6">Why Partner With Us?</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Wholesale Pricing</h4>
                  <p className="text-sm text-green-50 opacity-90">Get the best competitive rates for large volume orders directly from the manufacturer.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Premium Quality</h4>
                  <p className="text-sm text-green-50 opacity-90">Uncompromised quality standards with rigorous testing and certification for all bulk supplies.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Reliable Delivery</h4>
                  <p className="text-sm text-green-50 opacity-90">Dedicated logistics support to ensure your bulk orders arrive safely and on time.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm font-medium mb-2">Need immediate assistance?</p>
              <a href="tel:+919876543210" className="text-lg font-bold hover:underline">+91 98765 43210</a>
              <p className="text-sm mt-1 opacity-80">Mon-Sat, 9AM to 6PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
