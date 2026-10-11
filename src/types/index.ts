export type UserRole = 'admin' | 'employee' | 'client';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface VariantOption {
  id: string;
  name: string;
  priceDelta: number;
  stock: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Talla", "Color", "Término"
  options: VariantOption[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  sku: string;
  categoryId: string;
  images: string[];
  stock: number;
  minStockAlert: number;
  isPublished: boolean;
  isFeatured: boolean;
  variants: ProductVariant[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isPublished: boolean;
  iconName?: string;
}

export type InventoryMovementType = 'IN' | 'OUT' | 'ADJUST' | 'SALE';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  date: string;
  user: string;
}

export type OrderStatus =
  | 'Nuevo'
  | 'Pendiente de confirmación'
  | 'Confirmado'
  | 'En preparación'
  | 'Listo para entregar'
  | 'Enviado'
  | 'Entregado'
  | 'Cancelado';

export type PaymentMethod = 'Efectivo' | 'Transferencia SPEI' | 'Tarjeta' | 'WhatsApp Pay';
export type PaymentStatus = 'Pendiente' | 'Pagado';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedVariants?: { variantName: string; optionName: string; priceDelta: number }[];
  image?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  user?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  notes?: string;
}

export interface StoreConfig {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  favicon?: string;
  primaryColor: string;
  accentColor: string;
  fontStyle: 'modern' | 'editorial' | 'bold';
  heroImage: string;
  bannerText: string;
  bannerActive: boolean;
  welcomeText: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  socials: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  openingHours: Record<string, { open: string; close: string; isOpen: boolean }>;
  whatsappOrderMessage: string;
  policies: {
    shipping: string;
    returns: string;
    terms: string;
  };
  faqs: { question: string; answer: string }[];
}

export type HeroStyle = 'showcase' | 'split' | 'minimal';

export interface WebsiteLayoutConfig {
  heroStyle: HeroStyle;
  showBanner: boolean;
  showFeaturedCategories: boolean;
  showFeaturedProducts: boolean;
  showAbout: boolean;
  showReviews: boolean;
  showFaq: boolean;
  sectionOrder: string[];
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  footerNote: string;
}

export type DemoArchetype = 'bistro' | 'fashion' | 'cafe' | 'barber';
