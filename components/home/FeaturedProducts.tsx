'use client';

import { useState, useEffect } from 'react';
import { Package, MessageCircle, ShoppingCart, ArrowRight, Check, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { savePendingAction } from '@/lib/pending-action';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { SITE_CONFIG } from '@/lib/constants';

function FeaturedProductCard({ product }: { product: typeof DEMO_PRODUCTS[0] }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productPayload = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      discountPrice: product.discountPrice,
      quantity: 1,
      image: product.images[0]?.url || '',
      stock: product.stock,
      brand: product.brand?.name || null,
    };

    // Mandatory Authentication Check
    if (!isAuthenticated) {
      savePendingAction({
        type: 'ADD_TO_CART',
        product: productPayload,
        returnUrl: '/',
      });

      toast.info('Please log in or create an account to start shopping!', {
        description: `Saved "${product.name}". It will be added to your cart immediately upon login.`,
        duration: 4000,
      });

      router.push('/login?notice=auth_required');
      return;
    }

    addItem(productPayload);
    openCart();
    setAdded(true);
    toast.success(`Added ${product.name} to cart!`);

    setTimeout(() => setAdded(false), 1500);
  };

  const rawPhone = SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative h-full">
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-brand-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
          {discountPercent}% OFF
        </div>
      )}
      
      <div className="absolute top-3 right-3 z-10">
        <a 
          href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(`Hello Agro Base, I am interested in ${product.name}. Please share pricing and availability.`)}`}
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-500 rounded-full shadow-sm flex items-center justify-center hover:text-[#25D366] hover:bg-white transition-colors"
          title="Inquire on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>

      <Link prefetch={true} href={`/products/${product.slug}`} className="h-[200px] bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {product.images[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Package className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs font-semibold text-brand-green-700 uppercase tracking-wider mb-1">
          {product.brand?.name || 'Agro Base'} • {product.category.name}
        </div>
        <Link prefetch={true} href={`/products/${product.slug}`}>
          <h3 className="font-heading font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-brand-green-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-lg text-gray-900">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
            added 
              ? 'bg-emerald-600 text-white' 
              : 'bg-brand-green-700 hover:bg-brand-green-800 text-white disabled:opacity-50'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 animate-bounce" />
              <span>Added ✓</span>
            </>
          ) : (
            <>
              {mounted && !isAuthenticated ? (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>(DEMO_PRODUCTS.filter((p) => p.featured).slice(0, 8));

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/products?featured=true&limit=8');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        // Fallback to static demo products
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase bg-brand-green-50 px-3 py-1 rounded-full border border-brand-green-100">
                Top Quality Supplies
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mt-3">
                Featured Agro Hardware
              </h2>
              <p className="text-gray-600 mt-2 max-w-xl text-sm md:text-base">
                ISI-certified pipes, fittings, drip irrigation equipment, and durable agricultural supplies tested for Indian farming conditions.
              </p>
            </div>
            <Link 
              href="/products" 
              prefetch={true}
              className="inline-flex items-center gap-2 text-brand-green-700 font-semibold hover:text-brand-green-800 transition-colors mt-4 md:mt-0 group"
            >
              <span>View Complete Catalog</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
