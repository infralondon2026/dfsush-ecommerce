// ============================================================
// Vista completa de una orden: estado, línea de tiempo, QR de
// retiro (si está pagada o posterior), items y datos de retiro.
// Compartida por la página de éxito y "Mi orden".
// ============================================================

import { useI18n } from '../context/LangContext';
import { formatDate, formatUsd } from '../i18n';
import type { Order, OrderStatus } from '../types';
import { QrCode } from './QrCode';

const TIMELINE: OrderStatus[] = ['pagada', 'preparando', 'lista_para_retirar', 'entregada'];
const QR_STATUSES: OrderStatus[] = ['pagada', 'preparando', 'lista_para_retirar'];

interface OrderViewProps {
  order: Order;
  onContinuePayment?: () => void;
  paying?: boolean;
}

export function OrderView({ order, onContinuePayment, paying = false }: OrderViewProps) {
  const { tr, lang } = useI18n();

  const timelineIndex = TIMELINE.indexOf(order.status);
  const showTimeline = timelineIndex >= 0;
  const showQr = QR_STATUSES.includes(order.status);
  const isPending = order.status === 'pendiente_pago';
  const minutesLeft = Math.max(0, Math.round((Date.parse(order.expiresAt) - Date.now()) / 60000));

  return (
    <div className="order-view">
      <div className="order-view__head">
        <div>
          <p className="order-view__code-label">{tr.result.orderCode}</p>
          <p className="order-view__code">{order.code}</p>
        </div>
        <span className={`status-badge status-badge--${order.status}`}>
          {tr.order.status[order.status]}
        </span>
      </div>

      <p className="order-view__hint">{tr.order.statusHint[order.status]}</p>

      {isPending && (
        <div className="order-view__pending">
          <p>{tr.order.expiresIn(minutesLeft)}</p>
          {onContinuePayment && (
            <button type="button" className="btn btn--primary" onClick={onContinuePayment} disabled={paying}>
              {paying ? tr.checkout.processing : tr.order.continuePayment}
            </button>
          )}
        </div>
      )}

      {showTimeline && (
        <ol className="order-timeline" aria-label={tr.admin.orders.status}>
          {TIMELINE.map((status, i) => (
            <li
              key={status}
              className={`order-timeline__step ${i <= timelineIndex ? 'order-timeline__step--done' : ''}`}
              aria-current={i === timelineIndex ? 'step' : undefined}
            >
              <span className="order-timeline__dot" aria-hidden="true" />
              <span className="order-timeline__label">{tr.order.status[status]}</span>
            </li>
          ))}
        </ol>
      )}

      {showQr && (
        <div className="order-view__qr">
          <h3>{tr.order.qrTitle}</h3>
          <QrCode value={order.code} />
          <p className="order-view__qr-hint">{tr.result.qrHint}</p>
          <p>{tr.order.showAtPickup}</p>
        </div>
      )}

      <dl className="order-view__meta">
        <div>
          <dt>{tr.order.pickup}</dt>
          <dd>{tr.branches.labels[order.pickupBranch]}</dd>
        </div>
        <div>
          <dt>{tr.order.pickupDate}</dt>
          <dd>{formatDate(order.pickupDate, lang)}</dd>
        </div>
        {order.flightNumber && (
          <div>
            <dt>{tr.order.flight}</dt>
            <dd>{order.flightNumber}</dd>
          </div>
        )}
        <div>
          <dt>{tr.order.createdAt}</dt>
          <dd>{formatDate(order.createdAt, lang, true)}</dd>
        </div>
        {order.paidAt && (
          <div>
            <dt>{tr.order.paidAt}</dt>
            <dd>{formatDate(order.paidAt, lang, true)}</dd>
          </div>
        )}
      </dl>

      <h3 className="order-view__items-title">{tr.order.items}</h3>
      <ul className="order-view__items">
        {order.items.map((item) => (
          <li key={item.sku} className="order-view__item">
            <span>
              {item.qty} × {item.brand} {item.productName}
              {item.variantLabel ? ` · ${item.variantLabel}` : ''}
            </span>
            <span>{formatUsd(item.unitPriceUsd * item.qty, lang)}</span>
          </li>
        ))}
        <li className="order-view__item order-view__item--total">
          <span>{tr.order.total}</span>
          <span>{formatUsd(order.totalUsd, lang)}</span>
        </li>
      </ul>
    </div>
  );
}
