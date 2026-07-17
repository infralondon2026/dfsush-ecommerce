// ============================================================
// Resultado del pago (/compra/exito|fallo|pendiente).
// Mercado Pago vuelve con ?external_reference=<code>; en demo
// llegamos con ?code=<code>. Se consulta la orden y, si
// corresponde, se muestra el QR de retiro.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { OrderView } from '../components/OrderView';
import { BlockSkeleton } from '../components/Skeleton';
import { useI18n } from '../context/LangContext';
import { getStore } from '../store';
import type { Order } from '../types';
import { readLastOrder } from './CheckoutPage';

export type PaymentOutcome = 'exito' | 'fallo' | 'pendiente';

const POLL_INTERVAL_MS = 4000;
const POLL_MAX_TRIES = 8;

export function PaymentResultPage({ outcome }: { outcome: PaymentOutcome }) {
  const { tr } = useI18n();
  const [params] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [checking, setChecking] = useState(true);
  const tries = useRef(0);

  const last = readLastOrder();
  const code = params.get('code') ?? params.get('external_reference') ?? last?.code ?? '';
  const email = last?.email ?? '';

  useEffect(() => {
    if (!code || !email) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    let timer = 0;

    const poll = async () => {
      tries.current += 1;
      try {
        const found = await getStore().getOrder(code, email);
        if (cancelled) return;
        if (found) setOrder(found);
        // En "éxito" el webhook puede tardar unos segundos en acreditar:
        // seguimos consultando hasta ver la orden pagada o agotar intentos.
        const stillWaiting = outcome === 'exito' && found?.status === 'pendiente_pago';
        if (stillWaiting && tries.current < POLL_MAX_TRIES) {
          timer = window.setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setChecking(false);
        }
      } catch {
        if (!cancelled) setChecking(false);
      }
    };
    poll();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code, email, outcome]);

  const titles: Record<PaymentOutcome, { title: string; text: string; tone: string }> = {
    exito: { title: tr.result.successTitle, text: tr.result.successText, tone: 'success' },
    pendiente: { title: tr.result.pendingTitle, text: tr.result.pendingText, tone: 'info' },
    fallo: { title: tr.result.failTitle, text: tr.result.failText, tone: 'error' },
  };
  const { title, text, tone } = titles[outcome];
  const isDemo = getStore().isDemo;

  return (
    <section className="section page-top">
      <div className="container container--narrow">
        <div className={`result-banner result-banner--${tone}`}>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>

        {checking && (
          <>
            <p className="notice notice--info">{tr.result.verifying}</p>
            <BlockSkeleton height={220} />
          </>
        )}

        {!checking && order && (
          <>
            {outcome === 'exito' && order.status !== 'pendiente_pago' && (
              <p className="notice notice--success">
                {isDemo ? tr.result.emailDemoNote : tr.result.emailSent(order.customerEmail)}
              </p>
            )}
            <OrderView order={order} />
          </>
        )}

        {!checking && !order && (
          <p className="notice notice--info">{tr.result.lookupFallback}</p>
        )}

        <div className="result-actions">
          <Link to="/mi-orden" className="btn btn--primary">
            {outcome === 'fallo' ? tr.result.retryPay : tr.result.goMyOrder}
          </Link>
          <Link to="/" className="btn btn--ghost-dark">{tr.result.backHome}</Link>
        </div>
      </div>
    </section>
  );
}
