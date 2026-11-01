// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications: string | null;
  features: string[];
  price: number;
  discountPrice: number | null;
  sku: string | null;
  stock: number;
  lowStockThreshold: number;
  published: boolean;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  categoryId: string;
  brandId: string | null;
  category: Category;
  brand: Brand | null;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  publicId: string | null;
  alt: string;
  order: number;
  isPrimary: boolean;
  productId: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  specifications: string;
  features: string[];
  price: number;
  discountPrice: number | null;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  published: boolean;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  categoryId: string;
  brandId: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  parent: Category | null;
  children: Category[];
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

// Brand types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  subtotal: number;
  total: number;
  notes: string | null;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  orderId: string;
  product: Product;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// Customer types
export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  addresses: CustomerAddress[];
  orders: Order[];
  _count?: { orders: number };
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  customerId: string;
}

// Inquiry types
export interface Inquiry {
  id: string;
  name: string;
  businessName: string | null;
  phone: string;
  email: string | null;
  products: string;
  quantity: string | null;
  message: string | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'CLOSED';

// User/Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'STAFF';

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Review types
export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  author: string;
  verified: boolean;
  productId: string;
  createdAt: string;
}

// Site Settings
export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  group: string;
}

// Analytics
export interface AnalyticsEvent {
  id: string;
  event: string;
  data: Record<string, unknown> | null;
  sessionId: string | null;
  createdAt: string;
}

// Cart types (client-side)
export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
  image: string;
  stock: number;
  brand: string | null;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: string;
  page?: number;
}
