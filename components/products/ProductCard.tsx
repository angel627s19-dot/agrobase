'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Package, Heart, ShoppingCart, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { savePendingAction } from '@/lib/pending-action';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    stock: number;
    brand?: { name: string; slug: string } | null;
    category?: { name: string; slug: string } | null;
    images: { url: string; alt: string }[];
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const addToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'bg-red-500' };
    if (stock < 5) return { label: 'Limited Stock', color: 'bg-orange-500' };
    return { label: 'In Stock', color: 'bg-brand-green-500' };
  };

  const stockStatus = getStockStatus(product.stock);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productPayload = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      discountPrice: product.discountPrice ?? null,
      quantity: 1,
      image: product.images[0]?.url || '',
      stock: product.stock,
      brand: product.brand?.name || null,
    };

    // Mandatory Authentication Check: If guest, preserve intent and redirect to auth
    if (!isAuthenticated) {
      savePendingAction({
        type: 'ADD_TO_CART',
        product: productPayload,
        returnUrl: typeof window !== 'undefined' ? window.location.pathname : `/products/${product.slug}`,
      });

      toast.info('Please log in or create an account to start shopping!', {
        description: `Saved "${product.name}". It will be added to your cart immediately upon login.`,
        duration: 4000,
      });

      router.push('/login?notice=auth_required');
      return;
    }

    // Authenticated customer: add to cart
    addToCart(productPayload);
    openCart();
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col cursor-pointer rounded-xl bg-white shadow-card transition-all hover:shadow-card-hover"
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {product.brand && (
          <span className="rounded-full bg-brand-green-100 px-2.5 py-0.5 text-xs font-semibold text-brand-green-800 border border-brand-green-200">
            {product.brand.name}
          </span>
        )}
        {hasDiscount && (
          <span className="rounded-full bg-brand-orange-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      <button 
        aria-label="Wishlist" 
        className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-gray-600 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-500 group-hover:opacity-100 lg:opacity-0 max-lg:opacity-100"
      >
        <Heart size={18} />
      </button>

      {/* Image */}
      <Link prefetch={true} href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
        {product.images[0]?.url && product.images[0].url !== '/images/placeholder-product.jpg' ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <Package size={48} className="transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <Link prefetch={true} href={`/products/${product.slug}`} className="group/title">
          <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
          <h3 className="font-heading text-lg font-medium leading-tight text-brand-dark line-clamp-2 group-hover/title:text-brand-green-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", stockStatus.color)} />
          <span className="text-xs text-muted-foreground">{stockStatus.label}</span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold text-brand-dark">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2 lg:translate-y-4 lg:opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
          <button 
            className="flex-1 rounded-lg bg-brand-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            {mounted && !isAuthenticated ? (
              <>
                <Lock size={14} className="text-amber-300 shrink-0" />
                <span>Add to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
