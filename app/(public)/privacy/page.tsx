import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Sevlani Agro',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-green-700">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Privacy Policy</span>
      </div>

      <h1 className="text-4xl font-heading font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-500 mb-8 pb-8 border-b">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="prose prose-green max-w-none text-gray-700 space-y-6">
        <div className="bg-orange-50 border-l-4 border-brand-orange-500 p-4 mb-8">
          <p className="text-sm text-orange-800 m-0"><strong>Note:</strong> This is a template policy. Please customize for your business.</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including when you create an account, make a purchase, request customer support, or otherwise communicate with us. The types of information we may collect include your name, email address, postal address, phone number, payment method information, and any other information you choose to provide.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Communicate with you about products, services, offers, and events</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as described in this privacy policy or as disclosed to you at the time of collection. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@sevlaniagro.com.</p>
        </section>
      </div>
    </div>
  );
}
