import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Sevlani Agro',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-green-700">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Terms of Service</span>
      </div>

      <h1 className="text-4xl font-heading font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-500 mb-8 pb-8 border-b">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="prose prose-green max-w-none text-gray-700 space-y-6">
        <div className="bg-orange-50 border-l-4 border-brand-orange-500 p-4 mb-8">
          <p className="text-sm text-orange-800 m-0"><strong>Note:</strong> This is a template policy. Please customize for your business.</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Sevlani Agro's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Disclaimer</h2>
          <p>The materials on Sevlani Agro's website are provided on an 'as is' basis. Sevlani Agro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>
      </div>
    </div>
  );
}
