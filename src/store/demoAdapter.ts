// ============================================================
// Adapter DEMO: catálogo estático + órdenes y stock en
// localStorage. El checkout simula un pago aprobado. No hay
// backend, no se envían emails ni se procesan cobros reales.
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
import { ADMIN_DEMO_PASSWORD } from '../lib/env';
import { demoCategories, demoProducts } from './demoCatalog';
import { applyProductFilter, AuthError, StockError, type StoreAdapter } from './StoreAdapter';

const ORDERS_KEY = 'dfsas_demo_orders_v1';
const STOCK_KEY = 'dfsas_demo_stock_v1';
const ADMIN_KEY = 'dfsas_demo_admin_v1';

const ORDER_TTL_MS = 60 * 60 * 1000; // 60 minutos de reserva de stock

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function randomCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `DF-${hex.toUpperCase()}`;
}

export class DemoAdapter implements StoreAdapter {
  readonly isDemo = true;

  // ------------------------- stock -------------------------

  /** Ajustes de stock relativos al catálogo base, persistidos por SKU. */
  private readStockOverlay(): Record<string, number> {
    return readJson<Record<string, number>>(STOCK_KEY, {});
  }

  private writeStockOverlay(overlay: Record<string, number>): void {
    writeJson(STOCK_KEY, overlay);
  }

  private stockOf(sku: string, overlay: Record<string, number>): number {
    if (sku in overlay) return overlay[sku];
    for (const p of demoProducts) {
      const v = p.variants.find((x) => x.sku === sku);
      if (v) return v.stock;
    }
    return 0;
  }

  // ------------------------ órdenes ------------------------

  private readOrders(): Order[] {
    return readJson<Order[]>(ORDERS_KEY, []);
  }

  private writeOrders(orders: Order[]): void {
    writeJson(ORDERS_KEY, orders);
  }

  /** Expira órdenes pendientes vencidas liberando su stock (idempotente). */
  private expireStaleOrders(): void {
    const orders = this.readOrders();
    const overlay = this.readStockOverlay();
    let dirty = false;
    for (const order of orders) {
      if (order.status === 'pendiente_pago' && Date.parse(order.expiresAt) <= Date.now()) {
        order.status = 'expirada';
        for (const item of order.items) {
          overlay[item.sku] = this.stockOf(item.sku, overlay) + item.qty;
        }
        dirty = true;
      }
    }
    if (dirty) {
      this.writeOrders(orders);
      this.writeStockOverlay(overlay);
    }
  }

  private releaseStock(order: Order, overlay: Record<string, number>): void {
    for (const item of order.items) {
      overlay[item.sku] = this.stockOf(item.sku, overlay) + item.qty;
    }
  }

  // ---------------------- catálogo público ----------------------

  async getCategories(): Promise<Category[]> {
    return [...demoCategories].sort((a, b) => a.sort - b.sort);
  }

  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    this.expireStaleOrders();
    const overlay = this.readStockOverlay();
    const withStock = demoProducts.map((p) => ({
      ...p,
      variants: p.variants.map((v) => ({ ...v, stock: this.stockOf(v.sku, overlay) })),
    }));
    return applyProductFilter(withStock, filter);
  }

  async getProduct(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug) ?? null;
  }

  // ---------------------- órdenes públicas ----------------------

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    this.expireStaleOrders();
    if (!input.items.length) throw new Error('empty_order');

    const overlay = this.readStockOverlay();
    const items: Order['items'] = [];
    let total = 0;

    for (const line of input.items) {
      const qty = Math.floor(line.qty);
      if (qty < 1 || qty > 99) throw new Error('invalid_qty');
      let found = false;
      for (const p of demoProducts) {
        const v = p.variants.find((x) => x.id === line.variantId);
        if (!v) continue;
        found = true;
        const available = this.stockOf(v.sku, overlay);
        if (available < qty) throw new StockError(v.sku);
        overlay[v.sku] = available - qty;
        // Snapshot del producto: el precio SIEMPRE sale del catálogo, nunca del cliente.
        items.push({
          productName: p.name,
          brand: p.brand,
          variantLabel: v.label,
          sku: v.sku,
          unitPriceUsd: v.priceUsd,
          qty,
        });
        total += v.priceUsd * qty;
        break;
      }
      if (!found) throw new Error('variant_not_found');
    }

    const now = Date.now();
    const order: Order = {
      id: randomCode(),
      code: randomCode(),
      status: 'pendiente_pago',
      customerName: input.customer.name.trim(),
      customerEmail: input.customer.email.trim().toLowerCase(),
      customerPhone: input.customer.phone?.trim() || null,
      totalUsd: Math.round(total * 100) / 100,
      paymentId: null,
      pickupBranch: input.pickup.branch,
      pickupDate: input.pickup.date,
      flightNumber: input.pickup.flightNumber?.trim() || null,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + ORDER_TTL_MS).toISOString(),
      paidAt: null,
      lang: input.lang,
      items,
    };

    const orders = this.readOrders();
    orders.unshift(order);
    this.writeOrders(orders);
    this.writeStockOverlay(overlay);

    return { code: order.code, totalUsd: order.totalUsd, expiresAt: order.expiresAt };
  }

  async getOrder(code: string, email: string): Promise<Order | null> {
    this.expireStaleOrders();
    const normCode = code.trim().toUpperCase();
    const normEmail = email.trim().toLowerCase();
    const order = this.readOrders().find(
      (o) => o.code === normCode && o.customerEmail === normEmail,
    );
    return order ? structuredClone(order) : null;
  }

  async startPayment(code: string, email: string): Promise<PaymentStart> {
    this.expireStaleOrders();
    const orders = this.readOrders();
    const order = orders.find(
      (o) => o.code === code.trim().toUpperCase() && o.customerEmail === email.trim().toLowerCase(),
    );
    if (!order) throw new Error('order_not_found');
    if (order.status !== 'pendiente_pago') {
      if (order.status === 'pagada') return { kind: 'demo_approved' };
      throw new Error('order_not_payable');
    }
    // Simulación de pago aprobado (no hay gateway real en demo).
    order.status = 'pagada';
    order.paymentId = `DEMO-${order.code}`;
    order.paidAt = new Date().toISOString();
    this.writeOrders(orders);
    return { kind: 'demo_approved' };
  }

  // ---------------------- panel del equipo ----------------------

  async adminSignIn(email: string, password: string): Promise<AdminSession> {
    if (!ADMIN_DEMO_PASSWORD) throw new AuthError('admin_disabled');
    if (!password || password !== ADMIN_DEMO_PASSWORD) throw new AuthError();
    const session: AdminSession = { email: email.trim() || 'equipo@demo', role: 'admin' };
    writeJson(ADMIN_KEY, session);
    return session;
  }

  async adminSignOut(): Promise<void> {
    localStorage.removeItem(ADMIN_KEY);
  }

  async getAdminSession(): Promise<AdminSession | null> {
    if (!ADMIN_DEMO_PASSWORD) return null;
    return readJson<AdminSession | null>(ADMIN_KEY, null);
  }

  private requireAdmin(): void {
    if (!readJson<AdminSession | null>(ADMIN_KEY, null)) throw new AuthError();
  }

  async adminListOrders(): Promise<Order[]> {
    this.requireAdmin();
    this.expireStaleOrders();
    return structuredClone(this.readOrders());
  }

  async adminSetOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    this.requireAdmin();
    const orders = this.readOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('order_not_found');

    const allowed: Record<OrderStatus, OrderStatus[]> = {
      pendiente_pago: ['cancelada'],
      pagada: ['preparando', 'cancelada'],
      preparando: ['lista_para_retirar', 'cancelada'],
      lista_para_retirar: ['entregada', 'cancelada'],
      entregada: [],
      cancelada: [],
      expirada: [],
    };
    if (!allowed[order.status].includes(status)) throw new Error('invalid_transition');

    // Cancelar libera stock una única vez (idempotente por transición).
    if (status === 'cancelada') {
      const overlay = this.readStockOverlay();
      this.releaseStock(order, overlay);
      this.writeStockOverlay(overlay);
    }
    order.status = status;
    this.writeOrders(orders);
  }

  async adminListInventory(): Promise<InventoryRow[]> {
    this.requireAdmin();
    const overlay = this.readStockOverlay();
    const rows: InventoryRow[] = [];
    for (const p of demoProducts) {
      for (const v of p.variants) {
        rows.push({
          variantId: v.id,
          sku: v.sku,
          productName: p.name,
          brand: p.brand,
          variantLabel: v.label,
          qty: this.stockOf(v.sku, overlay),
        });
      }
    }
    return rows;
  }

  async adminAdjustStock(variantId: string, delta: number): Promise<number> {
    this.requireAdmin();
    const overlay = this.readStockOverlay();
    for (const p of demoProducts) {
      const v = p.variants.find((x) => x.id === variantId);
      if (!v) continue;
      const next = Math.max(0, this.stockOf(v.sku, overlay) + Math.trunc(delta));
      overlay[v.sku] = next;
      this.writeStockOverlay(overlay);
      return next;
    }
    throw new Error('variant_not_found');
  }
}
