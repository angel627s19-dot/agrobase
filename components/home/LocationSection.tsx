'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Navigation, PhoneCall, MessageCircle, Clock, Star } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export function LocationSection() {
  const [locating, setLocating] = useState(false);

  const destinationAddress = 'AGRO BASE, 87B, Mahaveer Nagar, Vakhar Bhag, Sangli-Miraj-Kupwad, Maharashtra 416416, India';

  const handleGetDirections = () => {
    const baseMapsDir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationAddress)}`;

    if ('geolocation' in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          const { latitude, longitude } = position.coords;
          const origin = `${latitude},${longitude}`;
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(destinationAddress)}`;
          window.open(directionsUrl, '_blank');
        },
        (error) => {
          console.warn('Geolocation denied or unavailable:', error.message);
          setLocating(false);
          // Fallback gracefully to destination-only directions (Google Maps will use device location or ask user)
          window.open(baseMapsDir, '_blank');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      window.open(baseMapsDir, '_blank');
    }
  };

  const rawPhone = SITE_CONFIG.phone.replace(/[^0-9]/g, '');
  const rawWhatsApp = SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '');

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green-100 text-brand-green-800 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Store Location & Directions</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-dark">
            Visit Our Store in Sangli
          </h2>
          <p className="text-gray-600 text-sm mt-2 max-w-xl mx-auto">
            Located conveniently in Mahaveer Nagar, Vakhar Bhag. Stop by for direct wholesale pickup or technical guidance.
          </p>
        </ScrollReveal>

        <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Info Side */}
            <div className="lg:w-2/5 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="font-heading font-extrabold text-2xl text-brand-green-800">
                      AGRO BASE
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Pipes • Fittings • Irrigation • Hardware</p>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>4.6</span>
                    <span className="text-[10px] text-amber-600 font-normal">(27)</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-orange-50 text-brand-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-0.5">Address</h4>
                      <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{SITE_CONFIG.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-green-50 text-brand-green-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-0.5">Phone Support</h4>
                      <p className="text-gray-600 text-xs sm:text-sm font-medium">{SITE_CONFIG.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-0.5">Working Hours</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">Monday – Saturday: 9:00 AM – 8:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-0.5">Email</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{SITE_CONFIG.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleGetDirections}
                  disabled={locating}
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-2 bg-brand-green-700 hover:bg-brand-green-800 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 disabled:opacity-75"
                >
                  <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
                  <span>{locating ? 'Locating...' : 'Get Directions'}</span>
                </button>

                <a 
                  href={`tel:${rawPhone}`}
                  className="flex-1 min-w-[110px] flex items-center justify-center gap-2 border-2 border-brand-green-700 text-brand-green-700 hover:bg-brand-green-50 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Us</span>
                </a>

                <a 
                  href={`https://wa.me/${rawWhatsApp}?text=${encodeURIComponent('Hello Sevlani Agro, I am planning to visit your Sangli store. Please share location details.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Map Side */}
            <div className="lg:w-3/5 min-h-[380px] sm:min-h-[440px] relative bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.884784260273!2d74.56847847492167!3d16.85684708394208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc123b36fa89c31%3A0xb36ef27a77e8ef63!2sMahaveer%20Nagar%2C%20Sangli%2C%20Maharashtra%20416416!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '100%', position: 'absolute', inset: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sevlani Agro Sangli Store Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
