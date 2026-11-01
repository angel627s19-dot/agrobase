import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy | Sevlani Agro',
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-green-700">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Shipping Policy</span>
      </div>

      <h1 className="text-4xl font-heading font-bold mb-4">Shipping Policy</h1>
      
      <div className="prose prose-green max-w-none text-gray-700 space-y-6">
        <div className="bg-orange-50 border-l-4 border-brand-orange-500 p-4 mb-8">
          <p className="text-sm text-orange-800 m-0"><strong>Note:</strong> Placeholder content - configurable by admin.</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Delivery Areas</h2>
          <p>We currently deliver across all major cities and states in India. For bulk orders outside India, please contact our support team or use the Bulk Inquiry form.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Shipping Times</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Standard Delivery:</strong> 5-7 business days</li>
            <li><strong>Express Delivery:</strong> 2-3 business days (available in select pin codes)</li>
            <li><strong>Bulk Orders:</strong> 7-10 business days depending on volume</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Shipping Charges</h2>
          <p>Shipping charges are calculated at checkout based on your location and the weight of your order. Free standard shipping is available on retail orders above ₹1,000.</p>
        </section>
      </div>
    </div>
  );
}
