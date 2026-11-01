import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  noIndex = false,
}: SeoProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;
  const fullDescription = description || SITE_CONFIG.description;
  const fullUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;
  const ogImage = image || `${SITE_CONFIG.url}/images/og-default.jpg`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [
      'agricultural products',
      'pipes',
      'fittings',
      'irrigation',
      'Sangli',
      'Maharashtra',
      'HDPE pipes',
      'plumbing',
      ...keywords,
    ],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: 'en_IN',
      type: type === 'product' ? 'website' : type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function generateProductJsonLd(product: {
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  image?: string;
  sku?: string | null;
  brand?: string | null;
  stock: number;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: product.brand
      ? { '@type': 'Brand', name: product.brand }
      : undefined,
    offers: {
      '@type': 'Offer',
      price: product.discountPrice || product.price,
      priceCurrency: 'INR',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${SITE_CONFIG.url}/products/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
  };
}

export function generateLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.addressDetails?.street || SITE_CONFIG.address,
      addressLocality: SITE_CONFIG.addressDetails?.city || 'Sangli-Miraj-Kupwad',
      addressRegion: SITE_CONFIG.addressDetails?.state || 'Maharashtra',
      postalCode: SITE_CONFIG.addressDetails?.pincode || '416416',
      addressCountry: SITE_CONFIG.addressDetails?.country || 'India',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE_CONFIG.googleRating,
      reviewCount: SITE_CONFIG.googleReviewCount,
    },
    priceRange: '₹₹',
  };
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi', 'Marathi'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.addressDetails?.street || SITE_CONFIG.address,
      addressLocality: SITE_CONFIG.addressDetails?.city || 'Sangli-Miraj-Kupwad',
      addressRegion: SITE_CONFIG.addressDetails?.state || 'Maharashtra',
      postalCode: SITE_CONFIG.addressDetails?.pincode || '416416',
      addressCountry: SITE_CONFIG.addressDetails?.country || 'India',
    },
  };
}
