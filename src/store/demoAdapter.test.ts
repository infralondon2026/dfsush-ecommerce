// ============================================================
// Tests del adapter demo: catálogo, stock, ciclo de vida de la
// orden (creación → pago simulado → expiración) y panel.
// ============================================================

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateOrderInput } from '../types';
import { DemoAdapter } from './demoAdapter';
import { StockError } from './StoreAdapter';

const baseInput = (variantId: string, qty = 1): CreateOrderInput => ({
  customer: { name: 'Ana Prueba', email: 'Ana@Test.com', phone: '+54 9 2901 000000' },
  items: [{ variantId, qty }],
  pickup: { branch: 'ushuaia_aeropuerto', date: '2026-07-20', flightNumber: 'AR1880' },
  lang: 'es',
});

describe('DemoAdapter', () => {
  let adapter: DemoAdapter;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-17T15:00:00Z'));
    adapter = new DemoAdapter();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve categorías ordenadas y productos activos', async () => {
    const cats = await adapter.getCategories();
    expect(cats.length).toBe(8);
    expect(cats[0].sort).toBeLessThan(cats[cats.length - 1].sort);

    const products = await adapter.getProducts();
    expect(products.length).toBeGreaterThan(30);
    expect(products.every((p) => p.active)).toBe(true);
  });

  it('filtra por categoría, búsqueda y ordena por precio', async () => {
    const bebidas = await adapter.getProducts({ category: 'bebidas' });
    expect(bebidas.length).toBeGreaterThan(5);
    expect(bebidas.every((p) => p.categorySlug === 'bebidas')).toBe(true);

    const jw = await adapter.getProducts({ search: 'johnnie' });
    expect(jw).toHaveLength(1);
    expect(jw[0].slug).toBe('johnnie-walker-black');

    const asc = await adapter.getProducts({ sort: 'price_asc' });
    const prices = asc.map((p) => Math.min(...p.variants.map((v) => v.priceUsd)));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('crea una orden: descuenta stock, calcula el total desde el catálogo y normaliza email', async () => {
    const before = await adapter.getProduct('johnnie-walker-black');
    const variant = before!.variants.find((v) => v.sku === 'BEB-JWB-1L')!;

    const result = await adapter.createOrder(baseInput(variant.id, 2));
    expect(result.code).toMatch(/^DF-[0-9A-F]{8}$/);
    expect(result.totalUsd).toBe(variant.priceUsd * 2);
    expect(Date.parse(result.expiresAt) - Date.now()).toBe(60 * 60 * 1000);

    const after = await adapter.getProduct('johnnie-walker-black');
    expect(after!.variants.find((v) => v.sku === 'BEB-JWB-1L')!.stock).toBe(variant.stock - 2);

    const order = await adapter.getOrder(result.code, 'ana@test.com');
    expect(order).not.toBeNull();
    expect(order!.status).toBe('pendiente_pago');
    expect(order!.customerEmail).toBe('ana@test.com');
    expect(order!.items[0].unitPriceUsd).toBe(variant.priceUsd);
  });

  it('rechaza una orden con stock insuficiente sin descontar nada', async () => {
    const product = await adapter.getProduct('johnnie-walker-black');
    const scarce = product!.variants.find((v) => v.sku === 'BEB-JWB-3L')!;

    await expect(adapter.createOrder(baseInput(scarce.id, scarce.stock + 1))).rejects.toThrow(
      StockError,
    );
    const after = await adapter.getProduct('johnnie-walker-black');
    expect(after!.variants.find((v) => v.sku === 'BEB-JWB-3L')!.stock).toBe(scarce.stock);
  });

  it('el pago demo aprueba la orden y es idempotente', async () => {
    const product = await adapter.getProduct('absolut-vodka');
    const variant = product!.variants[0];
    const { code } = await adapter.createOrder(baseInput(variant.id));

    const payment = await adapter.startPayment(code, 'ana@test.com');
    expect(payment).toEqual({ kind: 'demo_approved' });

    const order = await adapter.getOrder(code, 'ana@test.com');
    expect(order!.status).toBe('pagada');
    expect(order!.paymentId).toBe(`DEMO-${code}`);
    expect(order!.paidAt).not.toBeNull();

    // Reintentar el pago de una orden ya pagada no falla ni duplica.
    await expect(adapter.startPayment(code, 'ana@test.com')).resolves.toEqual({
      kind: 'demo_approved',
    });
  });

  it('expira órdenes pendientes a los 60 minutos y libera stock', async () => {
    const product = await adapter.getProduct('grey-goose');
    const variant = product!.variants[0];
    const initialStock = variant.stock;

    const { code } = await adapter.createOrder(baseInput(variant.id, 3));
    expect((await adapter.getProduct('grey-goose'))!.variants[0].stock).toBe(initialStock - 3);

    vi.advanceTimersByTime(61 * 60 * 1000);

    const order = await adapter.getOrder(code, 'ana@test.com');
    expect(order!.status).toBe('expirada');
    expect((await adapter.getProduct('grey-goose'))!.variants[0].stock).toBe(initialStock);

    // Una orden expirada ya no se puede pagar.
    await expect(adapter.startPayment(code, 'ana@test.com')).rejects.toThrow('order_not_payable');
  });

  it('getOrder exige código y email correctos', async () => {
    const product = await adapter.getProduct('uno-cartas');
    const { code } = await adapter.createOrder(baseInput(product!.variants[0].id));

    expect(await adapter.getOrder(code, 'otra@persona.com')).toBeNull();
    expect(await adapter.getOrder('DF-NOEXISTE', 'ana@test.com')).toBeNull();
    expect(await adapter.getOrder(code.toLowerCase(), 'ANA@test.com')).not.toBeNull();
  });
});

describe('DemoAdapter — panel', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    localStorage.clear();
  });

  async function freshAdapterWithPassword(password: string | undefined) {
    vi.resetModules();
    if (password === undefined) {
      vi.stubEnv('VITE_ADMIN_DEMO_PASSWORD', '');
    } else {
      vi.stubEnv('VITE_ADMIN_DEMO_PASSWORD', password);
    }
    const mod = await import('./demoAdapter');
    return new mod.DemoAdapter();
  }

  it('sin VITE_ADMIN_DEMO_PASSWORD el panel queda deshabilitado', async () => {
    localStorage.clear();
    const adapter = await freshAdapterWithPassword(undefined);
    await expect(adapter.adminSignIn('x@x.com', 'lo-que-sea')).rejects.toThrow('admin_disabled');
    expect(await adapter.getAdminSession()).toBeNull();
  });

  it('con password correcta inicia sesión; con incorrecta no', async () => {
    localStorage.clear();
    const adapter = await freshAdapterWithPassword('clave-demo-123');
    await expect(adapter.adminSignIn('equipo@dfsas.com', 'mala')).rejects.toThrow();
    const session = await adapter.adminSignIn('equipo@dfsas.com', 'clave-demo-123');
    expect(session.role).toBe('admin');
    expect(await adapter.getAdminSession()).not.toBeNull();
  });

  it('gestiona transiciones de estado y libera stock al cancelar', async () => {
    localStorage.clear();
    const adapter = await freshAdapterWithPassword('clave-demo-123');
    await adapter.adminSignIn('equipo@dfsas.com', 'clave-demo-123');

    const product = await adapter.getProduct('jbl-flip-6');
    const variant = product!.variants[0];
    const initialStock = variant.stock;
    const { code } = await adapter.createOrder(baseInput(variant.id, 2));
    await adapter.startPayment(code, 'ana@test.com');

    const [order] = await adapter.adminListOrders();
    expect(order.status).toBe('pagada');

    await adapter.adminSetOrderStatus(order.id, 'preparando');
    await adapter.adminSetOrderStatus(order.id, 'lista_para_retirar');
    await adapter.adminSetOrderStatus(order.id, 'entregada');
    const [delivered] = await adapter.adminListOrders();
    expect(delivered.status).toBe('entregada');

    // Transición inválida.
    await expect(adapter.adminSetOrderStatus(order.id, 'preparando')).rejects.toThrow(
      'invalid_transition',
    );

    // Cancelación de una orden pagada libera stock.
    const { code: code2 } = await adapter.createOrder(baseInput(variant.id, 1));
    await adapter.startPayment(code2, 'ana@test.com');
    const orders = await adapter.adminListOrders();
    const second = orders.find((o) => o.code === code2)!;
    const stockBefore = (await adapter.getProduct('jbl-flip-6'))!.variants[0].stock;
    await adapter.adminSetOrderStatus(second.id, 'cancelada');
    expect((await adapter.getProduct('jbl-flip-6'))!.variants[0].stock).toBe(stockBefore + 1);
    expect(initialStock).toBeGreaterThan(0);
  });

  it('ajusta stock con piso en cero', async () => {
    localStorage.clear();
    const adapter = await freshAdapterWithPassword('clave-demo-123');
    await adapter.adminSignIn('equipo@dfsas.com', 'clave-demo-123');

    const inventory = await adapter.adminListInventory();
    const row = inventory.find((r) => r.sku === 'JUG-UNO')!;

    const up = await adapter.adminAdjustStock(row.variantId, 5);
    expect(up).toBe(row.qty + 5);
    const down = await adapter.adminAdjustStock(row.variantId, -1000);
    expect(down).toBe(0);
  });

  it('sin sesión, las operaciones del panel se rechazan', async () => {
    localStorage.clear();
    const adapter = await freshAdapterWithPassword('clave-demo-123');
    await expect(adapter.adminListOrders()).rejects.toThrow();
    await expect(adapter.adminAdjustStock('BEB-JWB-1L', 1)).rejects.toThrow();
  });
});
