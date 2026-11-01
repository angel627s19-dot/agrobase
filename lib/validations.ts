import { z } from 'zod';

// Phone validation (Indian format)
const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number');
const phoneWithCountryCode = z.string().regex(/^(\+91|91)?[6-9]\d{9}$/, 'Invalid phone number');

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Product validations
export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  specifications: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  lowStockThreshold: z.number().int().min(0).default(10),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  seoKeywords: z.array(z.string()).default([]),
  categoryId: z.string().cuid('Invalid category'),
  brandId: z.string().cuid('Invalid brand').optional().nullable(),
});

// Category validations
export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  icon: z.string().optional().nullable(),
  parentId: z.string().cuid().optional().nullable(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Brand validations
export const brandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().optional().nullable(),
  logo: z.string().url().optional().nullable(),
  isActive: z.boolean().default(true),
});

// Order / Checkout validations
export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: phoneSchema,
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  paymentMethod: z.enum(['RAZORPAY', 'WHATSAPP']),
  notes: z.string().optional(),
});

// Inquiry validations
export const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  businessName: z.string().optional(),
  phone: phoneSchema,
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  products: z.string().min(2, 'Please specify products'),
  quantity: z.string().optional(),
  message: z.string().optional(),
});

// Contact form validations
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: phoneSchema,
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Settings validations
export const settingsSchema = z.object({
  key: z.string(),
  value: z.string(),
  group: z.string().default('general'),
});

// Search query validation
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z.enum(['relevance', 'price-asc', 'price-desc', 'newest', 'popular']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(50).optional().default(12),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BrandInput = z.infer<typeof brandSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
