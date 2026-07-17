// ============================================================
// Tipos de dominio compartidos por adapters, contextos y UI.
// ============================================================

export type Lang = 'es' | 'pt' | 'en';

export interface Category {
  slug: string;
  nameEs: string;
  namePt: string;
  nameEn: string;
  image: string;
  sort: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  label: string;
  priceUsd: number;
  stock: number;
  active: boolean;
}

export interface Product {
  id: string;
  slug: string;
  categorySlug: string;
  brand: string;
  name: string;
  descEs: string;
  descPt: string;
  descEn: string;
  image: string;
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
}

export const ORDER_STATUSES = [
  'pendiente_pago',
  'pagada',
  'preparando',
  'lista_para_retirar',
  'entregada',
  'cancelada',
  'expirada',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const BRANCHES = [
  'ushuaia_san_martin',
  'ushuaia_aeropuerto',
  'rio_grande_rosales',
  'rio_grande_aeropuerto',
] as const;

export type Branch = (typeof BRANCHES)[number];

export interface OrderItem {
  productName: string;
  brand: string;
  variantLabel: string;
  sku: string;
  unitPriceUsd: number;
  qty: number;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  totalUsd: number;
  paymentId: string | null;
  pickupBranch: Branch;
  pickupDate: string; // YYYY-MM-DD
  flightNumber: string | null;
  createdAt: string; // ISO
  expiresAt: string; // ISO
  paidAt: string | null;
  lang: Lang;
  items: OrderItem[];
}

export interface CreateOrderInput {
  customer: { name: string; email: string; phone?: string };
  items: { variantId: string; qty: number }[];
  pickup: { branch: Branch; date: string; flightNumber?: string };
  lang: Lang;
}

export interface CreateOrderResult {
  code: string;
  totalUsd: number;
  expiresAt: string;
}

/** Resultado de iniciar un pago: redirect a gateway o simulación demo. */
export type PaymentStart =
  | { kind: 'redirect'; url: string }
  | { kind: 'demo_approved' };

export interface AdminSession {
  email: string;
  role: 'admin' | 'staff';
}

export interface InventoryRow {
  variantId: string;
  sku: string;
  productName: string;
  brand: string;
  variantLabel: string;
  qty: number;
}

export interface CartLine {
  productId: string;
  variantId: string;
  qty: number;
}

export interface ProductFilter {
  category?: string;
  search?: string;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'name';
}
