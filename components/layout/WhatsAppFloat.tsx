'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function WhatsAppFloat() {
  const pathname = usePathname();

  // Hide on checkout pages
  if (pathname?.startsWith('/checkout')) {
    return null;
  }

  const phoneNumber = SITE_CONFIG?.whatsapp?.replace(/[^0-9]/g, '') || '917249621323';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello Agro Base, I have an inquiry from the website.')}`;

  return (
    <AnimatePresence>
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#20bd5a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Chat on WhatsApp"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.div>
      </motion.a>
    </AnimatePresence>
  );
}
