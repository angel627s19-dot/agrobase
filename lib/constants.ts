export const SITE_CONFIG = {
  name: 'Agro Base',
  tagline: 'Your Trusted Partner for Pipes, Fittings & Agricultural Solutions',
  description:
    'Quality pipes, fittings, irrigation products and hardware for farms, businesses and everyday projects. Trusted agricultural & plumbing solutions in Sangli, Maharashtra.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  rating: '4.6',
  googleRating: 4.6,
  googleReviewCount: 27,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 7249621323',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 7249621323',
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91 7249621323',
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@agrobase.com',
  address: '87B, Mahaveer Nagar, Vakhar Bhag, Sangli-Miraj-Kupwad, Maharashtra 416416, India',
  addressDetails: {
    street: '87B, Mahaveer Nagar, Vakhar Bhag',
    city: 'Sangli-Miraj-Kupwad',
    state: 'Maharashtra',
    pincode: '416416',
    country: 'India',
    full: '87B, Mahaveer Nagar, Vakhar Bhag, Sangli-Miraj-Kupwad, Maharashtra 416416, India',
  },
  googleMapsEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.884784260273!2d74.56847847492167!3d16.85684708394208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc123b36fa89c31%3A0xb36ef27a77e8ef63!2sMahaveer%20Nagar%2C%20Sangli%2C%20Maharashtra%20416416!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Brands', href: '/brands' },
  { label: 'Contact', href: '/contact' },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Categories', href: '/admin/categories', icon: 'FolderTree' },
  { label: 'Brands', href: '/admin/brands', icon: 'Award' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
  { label: 'Customers', href: '/admin/customers', icon: 'Users' },
  { label: 'Inquiries', href: '/admin/inquiries', icon: 'MessageSquare' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;

export const PRODUCT_SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Popular', value: 'popular' },
] as const;

export const ORDER_STATUSES = [
  { label: 'Pending', value: 'PENDING', color: 'bg-yellow-100 text-yellow-800' },
  { label: 'Confirmed', value: 'CONFIRMED', color: 'bg-blue-100 text-blue-800' },
  { label: 'Processing', value: 'PROCESSING', color: 'bg-indigo-100 text-indigo-800' },
  { label: 'Ready', value: 'READY', color: 'bg-purple-100 text-purple-800' },
  { label: 'Completed', value: 'COMPLETED', color: 'bg-green-100 text-green-800' },
  { label: 'Cancelled', value: 'CANCELLED', color: 'bg-red-100 text-red-800' },
] as const;

export const INQUIRY_STATUSES = [
  { label: 'New', value: 'NEW', color: 'bg-blue-100 text-blue-800' },
  { label: 'Contacted', value: 'CONTACTED', color: 'bg-yellow-100 text-yellow-800' },
  { label: 'Quoted', value: 'QUOTED', color: 'bg-purple-100 text-purple-800' },
  { label: 'Converted', value: 'CONVERTED', color: 'bg-green-100 text-green-800' },
  { label: 'Closed', value: 'CLOSED', color: 'bg-gray-100 text-gray-800' },
] as const;

export const PAYMENT_METHODS = [
  { label: 'Razorpay', value: 'RAZORPAY' },
  { label: 'WhatsApp Inquiry', value: 'WHATSAPP' },
] as const;

export const STOCK_STATUS_CONFIG = {
  'in-stock': { label: 'In Stock', color: 'text-green-600', dot: 'bg-green-500', icon: '🟢' },
  limited: { label: 'Limited Stock', color: 'text-orange-600', dot: 'bg-orange-500', icon: '🟠' },
  'out-of-stock': { label: 'Out of Stock', color: 'text-red-600', dot: 'bg-red-500', icon: '🔴' },
} as const;

export const CATEGORIES_DATA = [
  {
    id: 'cat-1',
    name: 'Agriculture',
    slug: 'agriculture',
    description: 'Complete range of agricultural pipes and irrigation solutions',
    icon: 'Sprout',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=600',
    count: 45,
    subcategories: ['Garden Pipes', 'Irrigation Pipes', 'HDPE Pipes', 'MDPE Pipes', 'LDPE Pipes'],
  },
  {
    id: 'cat-2',
    name: 'Fittings',
    slug: 'fittings',
    description: 'Industrial and plumbing fittings for all applications',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    count: 68,
    subcategories: ['GI Fittings', 'CI Fittings', 'Brass Fittings', 'Ball Valves', 'Couplers'],
  },
  {
    id: 'cat-3',
    name: 'Pipes',
    slug: 'pipes',
    description: 'Durable pipes for agriculture, plumbing and industrial use',
    icon: 'Pipette',
    image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600',
    count: 52,
    subcategories: ['PVC Pipes', 'HDPE Pipes', 'GI Pipes', 'Spray Hose'],
  },
  {
    id: 'cat-4',
    name: 'Hardware',
    slug: 'hardware',
    description: 'Quality hardware products for every need',
    icon: 'Hammer',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600',
    count: 34,
    subcategories: ['Locks', 'Tapes', 'Adhesives', 'Tools'],
  },
  {
    id: 'cat-5',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Essential accessories for maintenance and protection',
    icon: 'Droplets',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600',
    count: 22,
    subcategories: ['Grease', 'Gloves', 'Spray Pipes'],
  },
];

export const BRANDS_DATA = [
  { id: 'brand-1', name: 'Kothari', slug: 'kothari', description: 'Premier agricultural and drip irrigation solutions' },
  { id: 'brand-2', name: 'Paras', slug: 'paras', description: 'Durable irrigation and plumbing hardware' },
  { id: 'brand-3', name: 'SKF', slug: 'skf', description: 'High-grade industrial greases and accessories' },
  { id: 'brand-4', name: 'Araldite', slug: 'araldite', description: 'High-performance standard and epoxy adhesives' },
  { id: 'brand-5', name: 'WD-40', slug: 'wd-40', description: 'Multi-use lubricants and rust-prevention sprays' },
  { id: 'brand-6', name: 'Maruti', slug: 'maruti', description: 'Reliable brass and metal plumbing ball valves' },
  { id: 'brand-7', name: 'Balaji', slug: 'balaji', description: 'Precision pipe fittings, couplers and parts' },
];

export const POPULAR_SEARCHES = [
  'HDPE Pipes',
  'Spray Hose',
  'Ball Valve',
  'Garden Pipe',
  'GI Fittings',
  'PVC Pipe',
];

export const WHY_CHOOSE_US = [
  {
    title: 'Quality Products',
    description: 'We stock only certified, high-quality products from trusted manufacturers.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Trusted Brands',
    description: 'Authorized dealer for Kothari, Paras, SKF, Araldite, WD-40 and more.',
    icon: 'Award',
  },
  {
    title: 'Wholesale Pricing',
    description: 'Competitive wholesale rates for bulk purchases and business customers.',
    icon: 'IndianRupee',
  },
  {
    title: 'Agricultural Expertise',
    description: 'Deep knowledge of irrigation systems, pipes, and agricultural equipment.',
    icon: 'Sprout',
  },
  {
    title: 'Local Availability',
    description: 'Visit our Sangli store or get products delivered to your doorstep.',
    icon: 'MapPin',
  },
  {
    title: 'Customer Support',
    description: 'Quick responses on WhatsApp. Expert guidance for the right product selection.',
    icon: 'Headphones',
  },
];

export const ITEMS_PER_PAGE = 12;
