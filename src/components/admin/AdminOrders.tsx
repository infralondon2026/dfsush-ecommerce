// ============================================================
// Tablero de órdenes del panel: filtro por estado, transición
// de estados y cancelación con liberación de stock.
// ============================================================

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '../../context/LangContext';
import { formatDate, formatUsd } from '../../i18n';
import { getStore } from '../../store';
import type { Order, OrderStatus } from '../../types';
import { ORDER_STATUSES } from '../../types';

/** Próximas transiciones válidas que ofrece el panel por estado. */
const NEXT_ACTIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pendiente_pago: ['cancelada'],
  pagada: ['preparando', 'cancelada'],
  preparando: ['lista_para_retirar', 'cancelada'],
  lista_para_retirar: ['entregada', 'cancelada'],
};

export function AdminOrders() {
  const { tr, lang } = useI18n();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<OrderStatus | ''>('');
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    getStore().adminListOrders().then(setOrders).catch(() => setError(true));
  }, []);

  useEffect(load, [load]);

  const actionLabel: Partial<Record<OrderStatus, string>> = {
    preparando: tr.admin.orders.markPreparing,
    lista_para_retirar: tr.admin.orders.markReady,
    entregada: tr.admin.orders.markDelivered,
    cancelada: tr.admin.orders.cancel,
  };

  const applyStatus = async (order: Order, status: OrderStatus) => {
    if (status === 'cancelada' && !window.confirm(tr.admin.orders.confirmCancel(order.code))) return;
    setBusyId(order.id);
    try {
      await getStore().adminSetOrderStatus(order.id, status);
      load();
    } catch {
      setError(true);
    } finally {
      setBusyId(null);
    }
  };

  const visible = (orders ?? []).filter((o) => !filter || o.status === filter);

  return (
    <div className="admin-panel__section">
      <div className="admin-toolbar">
        <label className="field field--inline">
          <span>{tr.admin.orders.filterLabel}</span>
          <select className="input" value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | '')}>
            <option value="">{tr.admin.orders.all}</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{tr.order.status[s]}</option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn--ghost-dark btn--sm" onClick={load}>
          {tr.admin.orders.refresh}
        </button>
      </div>

      {error && <p className="notice notice--error">{tr.common.error}</p>}
      {orders && visible.length === 0 && <p className="notice notice--info">{tr.admin.orders.empty}</p>}

      {visible.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{tr.admin.orders.code}</th>
                <th>{tr.admin.orders.customer}</th>
                <th>{tr.admin.orders.status}</th>
                <th>{tr.admin.orders.total}</th>
                <th>{tr.admin.orders.payment}</th>
                <th>{tr.admin.orders.pickup}</th>
                <th>{tr.admin.orders.date}</th>
                <th>{tr.admin.orders.actions}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td className="admin-table__code">{order.code}</td>
                  <td>
                    {order.customerName}
                    <br />
                    <small>{order.customerEmail}</small>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${order.status}`}>
                      {tr.order.status[order.status]}
                    </span>
                  </td>
                  <td>{formatUsd(order.totalUsd, lang)}</td>
                  <td><small>{order.paymentId ?? '—'}</small></td>
                  <td><small>{tr.branches.labels[order.pickupBranch]}</small></td>
                  <td><small>{formatDate(order.pickupDate, lang)}</small></td>
                  <td>
                    <div className="admin-table__actions">
                      {(NEXT_ACTIONS[order.status] ?? []).map((next) => (
                        <button
                          key={next}
                          type="button"
                          className={`btn btn--sm ${next === 'cancelada' ? 'btn--danger' : 'btn--primary'}`}
                          disabled={busyId === order.id}
                          onClick={() => applyStatus(order, next)}
                        >
                          {actionLabel[next]}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
