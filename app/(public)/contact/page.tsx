'use client';
import React, { useState } from 'react';
import { SITE_CONFIG } from '@/lib/constants';
import { MapPin, Phone, MessageCircle, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawNumber = SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello Agro Base,\\n\\n*New Website Message*\\n• Name: ${name}\\n• Phone: ${phone}\\n• Email: ${email}\\n• Message: ${message}`
    );
    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
    setSent(true);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-brand-dark mb-4">Get in Touch with Agro Base</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Have questions regarding irrigation pipes, agricultural hardware, or wholesale bulk orders? Contact us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Direct Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Your Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none" 
                required 
                placeholder="Ramesh Patil"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Mobile Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none" 
                required 
                placeholder="98XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email (Optional)</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none" 
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Inquiry / Message</label>
              <textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl p-3 text-sm h-28 focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none resize-none" 
                required 
                placeholder="Describe the pipes or fittings required..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send via WhatsApp (+91 7249621323)</span>
            </button>
            {sent && (
              <p className="text-xs text-green-700 flex items-center gap-1.5 justify-center mt-2 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Message prepared in WhatsApp!
              </p>
            )}
          </form>
        </div>

        <div className="space-y-5 flex flex-col justify-between">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="font-heading font-bold text-lg text-gray-900">Agro Base Store Contact</h3>
            <div className="flex items-start gap-3.5 text-sm">
              <MapPin className="w-5 h-5 text-brand-orange-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-semibold">Store Address:</strong>
                <p className="text-gray-600 text-xs sm:text-sm mt-0.5">{SITE_CONFIG.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 text-sm">
              <Phone className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-semibold">Direct Phone:</strong>
                <a href="tel:+917249621323" className="text-brand-green-700 font-bold hover:underline">{SITE_CONFIG.phone}</a>
              </div>
            </div>
            <div className="flex items-start gap-3.5 text-sm">
              <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-semibold">WhatsApp Business:</strong>
                <a href="https://wa.me/917249621323" target="_blank" rel="noreferrer" className="text-[#25D366] font-bold hover:underline">+91 7249621323</a>
              </div>
            </div>
            <div className="flex items-start gap-3.5 text-sm">
              <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-semibold">Email:</strong>
                <a href="mailto:info@agrobase.com" className="text-gray-600 hover:underline">info@agrobase.com</a>
              </div>
            </div>
          </div>

          <div className="bg-brand-green-700 text-white p-6 rounded-2xl shadow-sm">
            <h4 className="font-heading font-bold text-lg mb-2">Wholesale & Farm Deliveries</h4>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              We provide direct truck delivery across Sangli, Miraj, Kupwad, and surrounding agricultural regions for PVC/HDPE pipes, drip laterals, and bulk fittings.
            </p>
            <a 
              href="https://wa.me/917249621323?text=Hello%20Agro%20Base%2C%20I%20need%20a%20bulk%20quote."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-green-800 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              Inquire Wholesale
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
