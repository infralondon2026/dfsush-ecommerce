// ============================================================
// Métricas básicas: ventas del día (hora de Ushuaia), ticket
// promedio y distribución por estado. Se calculan sobre las
// órdenes visibles para el admin.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../context/LangContext';
import { formatUsd, todayInUshuaia } from '../../i18n';
import { getStore } from '../../store';
import type { Order, OrderStatus } from '../../types';
import { ORDER_STATUSES } from '../../types';

const PAID_STATUSES: OrderStatus[] = ['pagada', 'preparando', 'lista_para_retirar', 'entregada'];

/** Convierte un ISO a fecha YYYY-MM-DD en la zona de Ushuaia. */
function dayInUshuaia(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Ushuaia',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}

export interface Metrics {
  salesTodayUsd: number;
  paidCount: number;
  pendingCount: number;
  avgTicketUsd: number;
  byStatus: Record<OrderStatus, number>;
}

export function computeMetrics(orders: Order[], today: string): Metrics {
  const paid = orders.filter((o) => PAID_STATUSES.includes(o.status));
  const paidToday = paid.filter((o) => o.paidAt && dayInUshuaia(o.paidAt) === today);
  const byStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const o of orders) byStatus[o.status] += 1;
  return {
    salesTodayUsd: paidToday.reduce((acc, o) => acc + o.totalUsd, 0),
    paidCount: paid.length,
    pendingCount: byStatus.pendiente_pago,
    avgTicketUsd: paid.length ? paid.reduce((acc, o) => acc + o.totalUsd, 0) / paid.length : 0,
    byStatus,
  };
}

export function AdminMetrics() {
  const { tr, lang } = useI18n();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getStore().adminListOrders().then(setOrders).catch(() => setError(true));
  }, []);

  const metrics = useMemo(
    () => (orders ? computeMetrics(orders, todayInUshuaia()) : null),
    [orders],
  );

  if (error) return <p className="notice notice--error">{tr.common.error}</p>;
  if (!metrics) return <p className="notice notice--info">{tr.common.loading}</p>;

  return (
    <div className="admin-panel__section">
      <div className="metric-grid">
        <div className="metric-card">
          <p className="metric-card__value">{formatUsd(metrics.salesTodayUsd, lang)}</p>
          <p className="metric-card__label">{tr.admin.metrics.salesToday}</p>
          <p className="metric-card__hint">{tr.admin.metrics.salesTodayHint}</p>
        </div>
        <div className="metric-card">
          <p className="metric-card__value">{formatUsd(metrics.avgTicketUsd, lang)}</p>
          <p className="metric-card__label">{tr.admin.metrics.avgTicket}</p>
          <p className="metric-card__hint">{tr.admin.metrics.avgTicketHint}</p>
        </div>
        <div className="metric-card">
          <p className="metric-card__value">{metrics.paidCount}</p>
          <p className="metric-card__label">{tr.admin.metrics.paidOrders}</p>
        </div>
        <div className="metric-card">
          <p className="metric-card__value">{metrics.pendingCount}</p>
          <p className="metric-card__label">{tr.admin.metrics.pendingOrders}</p>
        </div>
      </div>

      <h3 className="admin-panel__subtitle">{tr.admin.metrics.byStatus}</h3>
      <div className="table-wrap">
        <table className="admin-table">
          <tbody>
            {ORDER_STATUSES.map((status) => (
              <tr key={status}>
                <td>
                  <span className={`status-badge status-badge--${status}`}>{tr.order.status[status]}</span>
                </td>
                <td>{metrics.byStatus[status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
