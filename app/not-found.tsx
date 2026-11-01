import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <h1 className="text-[120px] md:text-[180px] font-heading font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-brand-green-700 to-brand-green-500 opacity-20">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search className="w-20 h-20 text-brand-green-700 animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-3xl font-heading font-bold text-gray-900 mt-4 mb-4">Page Not Found</h2>
      <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-brand-green-700 hover:bg-brand-green-800 min-w-[160px]">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="min-w-[160px]">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
