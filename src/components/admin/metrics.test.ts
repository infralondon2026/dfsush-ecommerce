// ============================================================
// Tests de computeMetrics: ventas del día en zona Ushuaia,
// ticket promedio y distribución por estado.
// ============================================================

import { describe, expect, it } from 'vitest';
import type { Order } from '../../types';
import { computeMetrics } from './AdminMetrics';

function order(partial: Partial<Order>): Order {
  return {
    id: 'id',
    code: 'DF-00000000',
    status: 'pagada',
    customerName: 'Ana',
    customerEmail: 'ana@test.com',
    customerPhone: null,
    totalUsd: 100,
    paymentId: 'MP-1',
    pickupBranch: 'ushuaia_san_martin',
    pickupDate: '2026-07-20',
    flightNumber: null,
    createdAt: '2026-07-17T12:00:00Z',
    expiresAt: '2026-07-17T13:00:00Z',
    paidAt: '2026-07-17T12:05:00Z',
    lang: 'es',
    items: [],
    ...partial,
  };
}

describe('computeMetrics', () => {
  it('suma solo las órdenes pagadas del día (zona Ushuaia, -03:00)', () => {
    const orders = [
      // 2026-07-17 09:05 en Ushuaia → cuenta para "hoy".
      order({ totalUsd: 100, paidAt: '2026-07-17T12:05:00Z' }),
      // 2026-07-18 01:30 UTC = 2026-07-17 22:30 en Ushuaia → también es "hoy".
      order({ totalUsd: 50, paidAt: '2026-07-18T01:30:00Z' }),
      // Día anterior en Ushuaia.
      order({ totalUsd: 999, paidAt: '2026-07-16T12:00:00Z' }),
      // Pendiente: no suma ventas.
      order({ status: 'pendiente_pago', paidAt: null, totalUsd: 77 }),
      order({ status: 'cancelada', paidAt: null, totalUsd: 88 }),
    ];

    const metrics = computeMetrics(orders, '2026-07-17');
    expect(metrics.salesTodayUsd).toBe(150);
    expect(metrics.paidCount).toBe(3);
    expect(metrics.pendingCount).toBe(1);
    expect(metrics.avgTicketUsd).toBeCloseTo((100 + 50 + 999) / 3, 5);
    expect(metrics.byStatus.pagada).toBe(3);
    expect(metrics.byStatus.cancelada).toBe(1);
  });

  it('estados posteriores al pago cuentan como cobrados', () => {
    const orders = [
      order({ status: 'preparando', totalUsd: 10 }),
      order({ status: 'lista_para_retirar', totalUsd: 20 }),
      order({ status: 'entregada', totalUsd: 30 }),
    ];
    const metrics = computeMetrics(orders, '2026-07-17');
    expect(metrics.paidCount).toBe(3);
    expect(metrics.avgTicketUsd).toBe(20);
  });

  it('sin órdenes pagadas el ticket promedio es 0', () => {
    const metrics = computeMetrics([order({ status: 'expirada', paidAt: null })], '2026-07-17');
    expect(metrics.avgTicketUsd).toBe(0);
    expect(metrics.salesTodayUsd).toBe(0);
  });
});
