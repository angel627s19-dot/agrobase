'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, MessageCircle, Minus, Plus, Check, ShieldCheck, Truck, ChevronRight, Lock, Zap } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { savePendingAction } from '@/lib/pending-action';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { SITE_CONFIG } from '@/lib/constants';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    stock: number;
    features: string[];
    specifications: Record<string, string>;
    category: { name: string; slug: string };
    brand?: { name: string; slug: string } | null;
    images: { url: string; alt: string }[];
  };
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
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

  const productPayload = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: displayPrice,
    discountPrice: product.discountPrice ?? null,
    quantity,
    image: product.images[0]?.url || '',
    stock: product.stock,
    brand: product.brand?.name || null,
  };

  // 1. Mandatory Auth Handler: Add to Cart
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      savePendingAction({
        type: 'ADD_TO_CART',
        product: productPayload,
        returnUrl: typeof window !== 'undefined' ? window.location.pathname : `/products/${product.slug}`,
      });

      toast.info('Please log in or create an account to start shopping!', {
        description: `Saved ${quantity}x "${product.name}". It will be added to your cart immediately upon login.`,
        duration: 4000,
      });

      router.push('/login?notice=auth_required');
      return;
    }

    addItem(productPayload);
    openCart();
    setAdded(true);
    toast.success(`Added ${quantity}x ${product.name} to cart!`);

    setTimeout(() => setAdded(false), 1500);
  };

  // 2. Mandatory Auth Handler: Buy Now
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      savePendingAction({
        type: 'BUY_NOW',
        product: productPayload,
        returnUrl: '/checkout',
      });

      toast.info('Please log in or create an account to start shopping!', {
        description: `Saved "${product.name}". You will be taken directly to checkout after login.`,
        duration: 4000,
      });

      router.push('/login?notice=auth_required');
      return;
    }

    addItem(productPayload);
    router.push('/checkout');
  };

  const handleWhatsApp = () => {
    const rawNumber = SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '');
    const msg = `Hello Agro Base,\n\nI am interested in:\nProduct: ${product.name}\nQuantity: ${quantity}\nPrice: ${formatPrice(displayPrice)}\n\nPlease share availability and wholesale/bulk pricing. Thank you!`;
    window.open(`https://wa.me/${rawNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-brand-green-700 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link href="/products" className="hover:text-brand-green-700 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link href={`/categories`} className="hover:text-brand-green-700 transition-colors">{product.category.name}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            {product.images[selectedImage]?.url ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt || product.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <span>No image available</span>
              </div>
            )}
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-brand-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 relative rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-brand-green-700 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-bold text-brand-green-700 uppercase tracking-wider bg-brand-green-50 px-3 py-1 rounded-full border border-brand-green-100">
              {product.brand?.name || 'Agro Base'} • {product.category.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-gray-900 mt-3 mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-heading font-bold text-gray-900">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-bold text-brand-orange-600 bg-brand-orange-50 px-2 py-0.5 rounded">
                  Save {formatPrice(product.price - product.discountPrice!)}
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-sm font-medium mb-6">
            <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className={product.stock > 0 ? 'text-emerald-700' : 'text-red-700'}>
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Currently Out of Stock'}
            </span>
          </div>

          {/* Mandatory Guest Authentication Info Banner */}
          {mounted && !isAuthenticated && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
              <Lock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-amber-950">
                  Please log in or create an account to start shopping!
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Browsing is open to all visitors. Adding to cart and placing orders requires an account. Your selected product & quantity will be automatically saved.
                </p>
                <div className="mt-2 flex items-center gap-3 font-semibold text-xs">
                  <Link href="/login?notice=auth_required" className="text-brand-green-800 hover:underline">
                    1. Log In →
                  </Link>
                  <span className="text-amber-400">|</span>
                  <Link href="/signup?notice=auth_required" className="text-brand-green-800 hover:underline">
                    2. Create Account →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2 pb-6 border-t border-b border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-sm text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="p-2.5 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {/* 1. Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 text-sm ${
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
                        <span>Add to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </>
                )}
              </button>

              {/* 2. Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 px-4 rounded-xl font-bold bg-[#FF8C00] hover:bg-[#e07b00] text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 text-sm disabled:opacity-50"
              >
                {mounted && !isAuthenticated ? (
                  <>
                    <Lock className="w-4 h-4 text-amber-200" />
                    <span>Buy Now</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </>
                )}
              </button>

              {/* 3. WhatsApp Direct Inquiry */}
              <button
                onClick={handleWhatsApp}
                className="py-3.5 px-4 rounded-xl font-bold bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire</span>
              </button>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 gap-3 py-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-green-700 shrink-0" />
              <span>100% Genuine Agricultural Hardware</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-green-700 shrink-0" />
              <span>Local Pickup & Delivery Available</span>
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider mb-3">
                Key Features
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-green-600 mt-1 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider mb-3">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="text-gray-900 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
