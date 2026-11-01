import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getDiscountPercentage(price: number, discountPrice: number): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function getStockStatus(stock: number, lowStockThreshold: number = 5) {
  if (stock <= 0) return { label: 'Out of Stock', status: 'out_of_stock' };
  if (stock <= lowStockThreshold) return { label: 'Limited Stock', status: 'low_stock' };
  return { label: 'In Stock', status: 'in_stock' };
}

export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function generateProductWhatsAppMessage(productName: string): string {
  return `Hello Agro Base, I am interested in ${productName}. Please share availability and pricing.`;
}

export function generateCartWhatsAppMessage(
  items: Array<{ name: string; quantity: number; price: number }>,
  customerName?: string
): string {
  let message = `🛒 *NEW ORDER INQUIRY — AGRO BASE*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  if (customerName) {
    message += `👤 *Customer:* ${customerName}\n\n`;
  }
  message += `📦 *Order Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}\n`;
  });
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total Units:* ${totalQty}\n`;
  message += `*Estimated Order Total:* ${formatPrice(total)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `I would like to place an order for these items. Please confirm stock availability, delivery schedule, and payment arrangements. Thank you!`;
  return message;
}

export interface OrderWhatsAppDetails {
  items: Array<{ name: string; quantity: number; price: number }>;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  notes?: string;
  orderNumber?: string;
}

export function generateOrderWhatsAppMessage(details: OrderWhatsAppDetails): string {
  const orderNum = details.orderNumber || generateOrderNumber();
  let message = `🛒 *NEW ORDER — AGRO BASE*\n`;
  message += `*Order Reference:* #${orderNum}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  message += `👤 *CUSTOMER & DELIVERY DETAILS:*\n`;
  message += `• *Name:* ${details.customerName}\n`;
  message += `• *Mobile:* ${details.phone}\n`;
  message += `• *Delivery Address:* ${details.address}, ${details.city}, ${details.state || 'Maharashtra'} - ${details.pincode || ''}\n`;
  if (details.notes) {
    message += `• *Order Notes:* ${details.notes}\n`;
  }
  
  message += `\n📦 *ORDERED ITEMS:*\n`;
  details.items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}\n`;
  });

  const total = details.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = details.items.reduce((sum, item) => sum + item.quantity, 0);

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total Units:* ${totalQty}\n`;
  message += `*Total Amount:* ${formatPrice(total)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `Please confirm my order and send dispatch details. Thank you!`;

  return message;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateOrderNumber(): string {
  const prefix = 'SA';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
