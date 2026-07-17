// ============================================================
// Adapter SUPABASE: catálogo desde tablas públicas (RLS solo
// lectura de activos), órdenes vía RPCs transaccionales y pagos
// vía Edge Functions. El total SIEMPRE lo calcula la base.
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AdminSession,
  Branch,
  Category,
  CreateOrderInput,
  CreateOrderResult,
  InventoryRow,
  Lang,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStart,
  Product,
  ProductFilter,
} from '../types';
import { applyProductFilter, AuthError, StockError, type StoreAdapter } from './StoreAdapter';

// ---------- Formas de las filas que devuelve PostgREST ----------

interface CategoryRow {
  slug: string;
  name_es: string;
  name_pt: string;
  name_en: string;
  image: string;
  sort: number;
}

interface VariantRow {
  id: string;
  sku: string;
  label: string;
  price_usd: number;
  active: boolean;
  inventory: { qty: number } | null;
}

interface ProductRow {
  id: string;
  slug: string;
  brand: string;
  name: string;
  desc_es: string;
  desc_pt: string;
  desc_en: string;
  image: string;
  featured: boolean;
  active: boolean;
  categories: { slug: string } | null;
  product_variants: VariantRow[];
}

interface OrderItemRow {
  product_name: string;
  brand: string;
  variant_label: string;
  sku: string;
  unit_price_usd: number;
  qty: number;
}

interface OrderRow {
  id: string;
  code: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_usd: number;
  payment_id: string | null;
  pickup_branch: Branch;
  pickup_date: string;
  flight_number: string | null;
  created_at: string;
  expires_at: string;
  paid_at: string | null;
  lang: Lang;
  order_items?: OrderItemRow[];
  items?: OrderItemRow[]; // get_order (RPC) devuelve los items con esta clave
}

const PRODUCT_SELECT =
  'id, slug, brand, name, desc_es, desc_pt, desc_en, image, featured, active, ' +
  'categories(slug), product_variants(id, sku, label, price_usd, active, inventory(qty))';

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    categorySlug: row.categories?.slug ?? '',
    brand: row.brand,
    name: row.name,
    descEs: row.desc_es,
    descPt: row.desc_pt,
    descEn: row.desc_en,
    image: row.image,
    featured: row.featured,
    active: row.active,
    variants: row.product_variants
      .filter((v) => v.active)
      .map((v) => ({
        id: v.id,
        sku: v.sku,
        label: v.label,
        priceUsd: Number(v.price_usd),
        stock: v.inventory?.qty ?? 0,
        active: v.active,
      })),
  };
}

function mapOrderItems(rows: OrderItemRow[] | undefined): OrderItem[] {
  return (rows ?? []).map((r) => ({
    productName: r.product_name,
    brand: r.brand,
    variantLabel: r.variant_label,
    sku: r.sku,
    unitPriceUsd: Number(r.unit_price_usd),
    qty: r.qty,
  }));
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    code: row.code,
    status: row.status,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    totalUsd: Number(row.total_usd),
    paymentId: row.payment_id,
    pickupBranch: row.pickup_branch,
    pickupDate: row.pickup_date,
    flightNumber: row.flight_number,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
    lang: row.lang,
    items: mapOrderItems(row.order_items ?? row.items),
  };
}

export class SupabaseAdapter implements StoreAdapter {
  readonly isDemo = false;

  constructor(private readonly client: SupabaseClient) {}

  // ---------------------- catálogo público ----------------------

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('slug, name_es, name_pt, name_en, image, sort')
      .eq('active', true)
      .order('sort', { ascending: true });
    if (error) throw error;
    return (data as CategoryRow[]).map((c) => ({
      slug: c.slug,
      nameEs: c.name_es,
      namePt: c.name_pt,
      nameEn: c.name_en,
      image: c.image,
      sort: c.sort,
    }));
  }

  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('active', true);
    if (error) throw error;
    const products = (data as unknown as ProductRow[]).map(mapProduct);
    return applyProductFilter(products, filter);
  }

  async getProduct(slug: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProduct(data as unknown as ProductRow) : null;
  }

  // ---------------------- órdenes públicas ----------------------

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const { data, error } = await this.client.rpc('create_order', {
      p_customer: {
        name: input.customer.name,
        email: input.customer.email,
        phone: input.customer.phone ?? null,
      },
      p_items: input.items.map((i) => ({ variant_id: i.variantId, qty: i.qty })),
      p_pickup: {
        branch: input.pickup.branch,
        date: input.pickup.date,
        flight_number: input.pickup.flightNumber ?? null,
      },
      p_lang: input.lang,
    });
    if (error) {
      const m = /insufficient_stock:(\S+)/.exec(error.message);
      if (m) throw new StockError(m[1]);
      throw error;
    }
    const row = data as { code: string; total_usd: number; expires_at: string };
    return { code: row.code, totalUsd: Number(row.total_usd), expiresAt: row.expires_at };
  }

  async getOrder(code: string, email: string): Promise<Order | null> {
    const { data, error } = await this.client.rpc('get_order', {
      p_code: code.trim().toUpperCase(),
      p_email: email.trim().toLowerCase(),
    });
    if (error) throw error;
    return data ? mapOrder(data as OrderRow) : null;
  }

  async startPayment(code: string, email: string): Promise<PaymentStart> {
    const { data, error } = await this.client.functions.invoke('create-payment', {
      body: { code: code.trim().toUpperCase(), email: email.trim().toLowerCase() },
    });
    if (error) throw error;
    const body = data as { ok: boolean; url?: string; error?: string };
    if (!body.ok || !body.url) throw new Error(body.error ?? 'payment_init_failed');
    return { kind: 'redirect', url: body.url };
  }

  // ---------------------- panel del equipo ----------------------

  private async fetchAdminRow(userId: string): Promise<AdminSession | null> {
    const { data, error } = await this.client
      .from('admin_users')
      .select('email, role, active')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data || !data.active) return null;
    return { email: data.email, role: data.role as AdminSession['role'] };
  }

  async adminSignIn(email: string, password: string): Promise<AdminSession> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new AuthError();
    const session = await this.fetchAdminRow(data.user.id);
    if (!session) {
      // Usuario autenticado pero sin rol activo: no puede usar el panel.
      await this.client.auth.signOut();
      throw new AuthError('not_admin');
    }
    return session;
  }

  async adminSignOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  async getAdminSession(): Promise<AdminSession | null> {
    const { data } = await this.client.auth.getUser();
    if (!data.user) return null;
    try {
      return await this.fetchAdminRow(data.user.id);
    } catch {
      return null;
    }
  }

  async adminListOrders(): Promise<Order[]> {
    const { data, error } = await this.client
      .from('orders')
      .select('*, order_items(product_name, brand, variant_label, sku, unit_price_usd, qty)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as unknown as OrderRow[]).map(mapOrder);
  }

  async adminSetOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (status === 'cancelada') {
      // Cancelación con liberación de stock: RPC idempotente solo-admins.
      const { error } = await this.client.rpc('release_order_stock', { p_order_id: orderId });
      if (error) throw error;
      return;
    }
    const { error } = await this.client.rpc('admin_set_order_status', {
      p_order_id: orderId,
      p_status: status,
    });
    if (error) throw error;
  }

  async adminListInventory(): Promise<InventoryRow[]> {
    const { data, error } = await this.client
      .from('inventory')
      .select('qty, product_variants(id, sku, label, products(name, brand))');
    if (error) throw error;
    interface Row {
      qty: number;
      product_variants: {
        id: string;
        sku: string;
        label: string;
        products: { name: string; brand: string } | null;
      } | null;
    }
    return (data as unknown as Row[])
      .filter((r) => r.product_variants)
      .map((r) => ({
        variantId: r.product_variants!.id,
        sku: r.product_variants!.sku,
        productName: r.product_variants!.products?.name ?? '',
        brand: r.product_variants!.products?.brand ?? '',
        variantLabel: r.product_variants!.label,
        qty: r.qty,
      }));
  }

  async adminAdjustStock(variantId: string, delta: number): Promise<number> {
    const { data, error } = await this.client.rpc('admin_adjust_stock', {
      p_variant_id: variantId,
      p_delta: Math.trunc(delta),
    });
    if (error) throw error;
    return Number(data);
  }
}
