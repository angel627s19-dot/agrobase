import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy | Sevlani Agro',
};

export default function RefundPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-green-700">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Refund & Returns Policy</span>
      </div>

      <h1 className="text-4xl font-heading font-bold mb-4">Refund & Returns Policy</h1>
      
      <div className="prose prose-green max-w-none text-gray-700 space-y-6">
        <div className="bg-orange-50 border-l-4 border-brand-orange-500 p-4 mb-8">
          <p className="text-sm text-orange-800 m-0"><strong>Note:</strong> Placeholder content - configurable by admin.</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Return Conditions</h2>
          <p>We accept returns within 7 days of delivery under the following conditions:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The product is damaged or defective</li>
            <li>The product received is different from what was ordered</li>
            <li>The packaging is unopened and in its original condition</li>
          </ul>
          <p className="mt-2 text-sm text-gray-500">Note: Perishable goods and bulk agricultural commodities cannot be returned unless verified as defective upon delivery.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Refund Process</h2>
          <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed and applied to your original method of payment within 5-7 business days.</p>
        </section>
      </div>
    </div>
  );
}
