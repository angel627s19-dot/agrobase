'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      
      <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Something Went Wrong</h2>
      <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()} 
          size="lg" 
          className="bg-brand-green-700 hover:bg-brand-green-800 min-w-[160px]"
        >
          Try Again
        </Button>
        <Button asChild size="lg" variant="outline" className="min-w-[160px]">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
