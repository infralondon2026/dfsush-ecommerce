// ============================================================
// Contrato de acceso a datos de la tienda. Dos implementaciones:
//   - demoAdapter: localStorage, pagos simulados (sin backend)
//   - supabaseAdapter: Postgres + RPCs + Edge Functions
// ============================================================

import type {
  AdminSession,
  Category,
  CreateOrderInput,
  CreateOrderResult,
  InventoryRow,
  Order,
  OrderStatus,
  PaymentStart,
  Product,
  ProductFilter,
} from '../types';

/** Error de stock insuficiente al crear una orden. */
export class StockError extends Error {
  constructor(public readonly sku: string) {
    super(`insufficient_stock:${sku}`);
    this.name = 'StockError';
  }
}

/** Error de credenciales/permiso en el panel. */
export class AuthError extends Error {
  constructor(message = 'auth_error') {
    super(message);
    this.name = 'AuthError';
  }
}

export interface StoreAdapter {
  readonly isDemo: boolean;

  // --- Catálogo público ---
  getCategories(): Promise<Category[]>;
  getProducts(filter?: ProductFilter): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;

  // --- Órdenes públicas ---
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  getOrder(code: string, email: string): Promise<Order | null>;
  /** Inicia el pago de una orden pendiente (redirect a MP o simulación demo). */
  startPayment(code: string, email: string): Promise<PaymentStart>;

  // --- Panel del equipo ---
  adminSignIn(email: string, password: string): Promise<AdminSession>;
  adminSignOut(): Promise<void>;
  getAdminSession(): Promise<AdminSession | null>;
  adminListOrders(): Promise<Order[]>;
  adminSetOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
  adminListInventory(): Promise<InventoryRow[]>;
  adminAdjustStock(variantId: string, delta: number): Promise<number>;
}

/** Orden de productos aplicado en memoria (compartido por ambos adapters). */
export function applyProductFilter(products: Product[], filter?: ProductFilter): Product[] {
  let result = products.filter((p) => p.active);
  if (filter?.category) {
    result = result.filter((p) => p.categorySlug === filter.category);
  }
  if (filter?.search) {
    const q = filter.search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
      );
    }
  }
  const minPrice = (p: Product) =>
    Math.min(...p.variants.filter((v) => v.active).map((v) => v.priceUsd));
  switch (filter?.sort) {
    case 'price_asc':
      result = [...result].sort((a, b) => minPrice(a) - minPrice(b));
      break;
    case 'price_desc':
      result = [...result].sort((a, b) => minPrice(b) - minPrice(a));
      break;
    case 'name':
      result = [...result].sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`));
      break;
    default:
      result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return result;
}
