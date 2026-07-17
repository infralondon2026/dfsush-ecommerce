// ============================================================
// Tests del adapter Supabase con el cliente mockeado: verifica
// las llamadas a tablas/RPCs/Edge Functions y el mapeo de filas.
// ============================================================

import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { AuthError, StockError } from './StoreAdapter';
import { SupabaseAdapter } from './supabaseAdapter';

type Result = { data: unknown; error: { message: string } | null };

/** Query builder mock: encadena cualquier método y resuelve `result`. */
function chain(result: Result) {
  const obj: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'order', 'maybeSingle']) {
    obj[m] = vi.fn(() => obj);
  }
  (obj as { then: unknown }).then = (resolve: (r: Result) => void) => resolve(result);
  return obj as { select: ReturnType<typeof vi.fn>; eq: ReturnType<typeof vi.fn> } & Record<string, unknown>;
}

function makeClient(parts: Partial<Record<'from' | 'rpc' | 'functions' | 'auth', unknown>>) {
  return {
    from: vi.fn(),
    rpc: vi.fn(),
    functions: { invoke: vi.fn() },
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getUser: vi.fn(),
    },
    ...parts,
  } as unknown as SupabaseClient;
}

const productRow = {
  id: 'uuid-prod-1',
  slug: 'johnnie-walker-black',
  brand: 'Johnnie Walker',
  name: 'Black Label 12 Años',
  desc_es: 'desc es',
  desc_pt: 'desc pt',
  desc_en: 'desc en',
  image: 'img/products/johnnie-walker-black.svg',
  featured: true,
  active: true,
  categories: { slug: 'bebidas' },
  product_variants: [
    { id: 'uuid-var-1', sku: 'BEB-JWB-1L', label: '1 L', price_usd: '36.00', active: true, inventory: { qty: 48 } },
    { id: 'uuid-var-2', sku: 'BEB-JWB-3L', label: '3 L', price_usd: '110.00', active: false, inventory: null },
  ],
};

describe('SupabaseAdapter — catálogo', () => {
  it('mapea categorías desde snake_case', async () => {
    const rows = [{ slug: 'bebidas', name_es: 'Bebidas', name_pt: 'Bebidas', name_en: 'Spirits', image: 'img/c.svg', sort: 1 }];
    const q = chain({ data: rows, error: null });
    const client = makeClient({ from: vi.fn(() => q) });
    const adapter = new SupabaseAdapter(client);

    const cats = await adapter.getCategories();
    expect(client.from).toHaveBeenCalledWith('categories');
    expect(q.eq).toHaveBeenCalledWith('active', true);
    expect(cats).toEqual([
      { slug: 'bebidas', nameEs: 'Bebidas', namePt: 'Bebidas', nameEn: 'Spirits', image: 'img/c.svg', sort: 1 },
    ]);
  });

  it('mapea productos: variantes inactivas afuera y stock 0 sin inventario', async () => {
    const q = chain({ data: [productRow], error: null });
    const client = makeClient({ from: vi.fn(() => q) });
    const adapter = new SupabaseAdapter(client);

    const products = await adapter.getProducts();
    expect(products).toHaveLength(1);
    const p = products[0];
    expect(p.categorySlug).toBe('bebidas');
    expect(p.variants).toHaveLength(1); // la variante inactiva no se expone
    expect(p.variants[0]).toMatchObject({ sku: 'BEB-JWB-1L', priceUsd: 36, stock: 48 });
  });

  it('aplica búsqueda y orden en memoria', async () => {
    const other = {
      ...productRow,
      id: 'uuid-prod-2',
      slug: 'absolut-vodka',
      brand: 'Absolut',
      name: 'Absolut Vodka',
      featured: false,
      product_variants: [
        { id: 'uuid-var-3', sku: 'BEB-ABS-1L', label: '1 L', price_usd: '15.00', active: true, inventory: { qty: 60 } },
      ],
    };
    const q = chain({ data: [productRow, other], error: null });
    const client = makeClient({ from: vi.fn(() => q) });
    const adapter = new SupabaseAdapter(client);

    const found = await adapter.getProducts({ search: 'absolut' });
    expect(found.map((p) => p.slug)).toEqual(['absolut-vodka']);

    const sorted = await adapter.getProducts({ sort: 'price_asc' });
    expect(sorted.map((p) => p.slug)).toEqual(['absolut-vodka', 'johnnie-walker-black']);
  });
});

describe('SupabaseAdapter — órdenes', () => {
  it('createOrder llama al RPC con el payload correcto y mapea el resultado', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: { code: 'DF-AAAA1111', total_usd: '72.00', expires_at: '2026-07-17T16:00:00Z' },
      error: null,
    });
    const adapter = new SupabaseAdapter(makeClient({ rpc }));

    const result = await adapter.createOrder({
      customer: { name: 'Ana', email: 'ana@test.com', phone: '123' },
      items: [{ variantId: 'uuid-var-1', qty: 2 }],
      pickup: { branch: 'ushuaia_aeropuerto', date: '2026-07-20', flightNumber: 'AR1880' },
      lang: 'es',
    });

    expect(rpc).toHaveBeenCalledWith('create_order', {
      p_customer: { name: 'Ana', email: 'ana@test.com', phone: '123' },
      p_items: [{ variant_id: 'uuid-var-1', qty: 2 }],
      p_pickup: { branch: 'ushuaia_aeropuerto', date: '2026-07-20', flight_number: 'AR1880' },
      p_lang: 'es',
    });
    expect(result).toEqual({ code: 'DF-AAAA1111', totalUsd: 72, expiresAt: '2026-07-17T16:00:00Z' });
  });

  it('createOrder convierte el error de stock del RPC en StockError', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'P0001: insufficient_stock:BEB-JWB-3L' },
    });
    const adapter = new SupabaseAdapter(makeClient({ rpc }));

    await expect(
      adapter.createOrder({
        customer: { name: 'Ana', email: 'ana@test.com' },
        items: [{ variantId: 'uuid-var-2', qty: 9 }],
        pickup: { branch: 'ushuaia_san_martin', date: '2026-07-20' },
        lang: 'es',
      }),
    ).rejects.toThrow(StockError);
  });

  it('getOrder normaliza código/email y mapea items del jsonb', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        id: 'uuid-order-1',
        code: 'DF-AAAA1111',
        status: 'pagada',
        customer_name: 'Ana',
        customer_email: 'ana@test.com',
        customer_phone: null,
        total_usd: 72,
        payment_id: 'MP-1',
        pickup_branch: 'ushuaia_aeropuerto',
        pickup_date: '2026-07-20',
        flight_number: 'AR1880',
        created_at: '2026-07-17T15:00:00Z',
        expires_at: '2026-07-17T16:00:00Z',
        paid_at: '2026-07-17T15:05:00Z',
        lang: 'es',
        items: [
          { product_name: 'Black Label', brand: 'JW', variant_label: '1 L', sku: 'BEB-JWB-1L', unit_price_usd: 36, qty: 2 },
        ],
      },
      error: null,
    });
    const adapter = new SupabaseAdapter(makeClient({ rpc }));

    const order = await adapter.getOrder('  df-aaaa1111 ', ' ANA@Test.com ');
    expect(rpc).toHaveBeenCalledWith('get_order', { p_code: 'DF-AAAA1111', p_email: 'ana@test.com' });
    expect(order!.items[0]).toMatchObject({ sku: 'BEB-JWB-1L', unitPriceUsd: 36, qty: 2 });
    expect(order!.status).toBe('pagada');
  });

  it('startPayment invoca la edge function y devuelve el redirect', async () => {
    const invoke = vi.fn().mockResolvedValue({
      data: { ok: true, url: 'https://mp.example/init' },
      error: null,
    });
    const adapter = new SupabaseAdapter(makeClient({ functions: { invoke } }));

    const payment = await adapter.startPayment('df-aaaa1111', 'ANA@test.com');
    expect(invoke).toHaveBeenCalledWith('create-payment', {
      body: { code: 'DF-AAAA1111', email: 'ana@test.com' },
    });
    expect(payment).toEqual({ kind: 'redirect', url: 'https://mp.example/init' });
  });

  it('startPayment falla con respuesta no ok', async () => {
    const invoke = vi.fn().mockResolvedValue({ data: { ok: false, error: 'order_expired' }, error: null });
    const adapter = new SupabaseAdapter(makeClient({ functions: { invoke } }));
    await expect(adapter.startPayment('DF-X', 'a@a.com')).rejects.toThrow('order_expired');
  });
});

describe('SupabaseAdapter — panel', () => {
  it('adminSignIn exige fila activa en admin_users', async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    const signOut = vi.fn().mockResolvedValue({ error: null });
    const adminRow = chain({ data: { email: 'equipo@dfsas.com', role: 'admin', active: true }, error: null });
    const client = makeClient({
      from: vi.fn(() => adminRow),
      auth: { signInWithPassword, signOut, getUser: vi.fn() },
    });
    const adapter = new SupabaseAdapter(client);

    const session = await adapter.adminSignIn('equipo@dfsas.com', 'secreta');
    expect(session).toEqual({ email: 'equipo@dfsas.com', role: 'admin' });
    expect(signOut).not.toHaveBeenCalled();
  });

  it('adminSignIn cierra sesión si el usuario no es admin activo', async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    const signOut = vi.fn().mockResolvedValue({ error: null });
    const noRow = chain({ data: null, error: null });
    const client = makeClient({
      from: vi.fn(() => noRow),
      auth: { signInWithPassword, signOut, getUser: vi.fn() },
    });
    const adapter = new SupabaseAdapter(client);

    await expect(adapter.adminSignIn('intruso@x.com', 'clave')).rejects.toThrow(AuthError);
    expect(signOut).toHaveBeenCalled();
  });

  it('cancelar usa release_order_stock; otros estados usan admin_set_order_status', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: null });
    const adapter = new SupabaseAdapter(makeClient({ rpc }));

    await adapter.adminSetOrderStatus('uuid-order-1', 'cancelada');
    expect(rpc).toHaveBeenCalledWith('release_order_stock', { p_order_id: 'uuid-order-1' });

    await adapter.adminSetOrderStatus('uuid-order-1', 'preparando');
    expect(rpc).toHaveBeenCalledWith('admin_set_order_status', {
      p_order_id: 'uuid-order-1',
      p_status: 'preparando',
    });
  });

  it('adminAdjustStock devuelve el stock resultante del RPC', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 7, error: null });
    const adapter = new SupabaseAdapter(makeClient({ rpc }));

    const next = await adapter.adminAdjustStock('uuid-var-1', -2);
    expect(rpc).toHaveBeenCalledWith('admin_adjust_stock', { p_variant_id: 'uuid-var-1', p_delta: -2 });
    expect(next).toBe(7);
  });
});
