import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-3xl">
      <h1 className="text-4xl font-heading font-bold text-brand-dark mb-6">Built on Trust. Driven by Agriculture.</h1>
      <p className="text-lg text-gray-600 mb-12">
        Agro Base has been a trusted partner to farmers for over two decades. We provide top-quality agricultural equipment, machinery, and supplies.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-3xl font-bold text-brand-green-700">4.6★</div>
          <div className="text-sm text-gray-500 mt-2">Google Rating</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-3xl font-bold text-brand-green-700">500+</div>
          <div className="text-sm text-gray-500 mt-2">Products</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-3xl font-bold text-brand-green-700">20+</div>
          <div className="text-sm text-gray-500 mt-2">Years Exp.</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-3xl font-bold text-brand-green-700">10k+</div>
          <div className="text-sm text-gray-500 mt-2">Customers</div>
        </div>
      </div>
    </div>
  );
}
