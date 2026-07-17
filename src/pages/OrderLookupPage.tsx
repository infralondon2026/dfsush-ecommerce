// ============================================================
// "Mi orden": consulta por código + email. Si la orden está
// pendiente de pago y vigente, permite reintentar el pago.
// ============================================================

import { useState, type FormEvent } from 'react';
import { OrderView } from '../components/OrderView';
import { useI18n } from '../context/LangContext';
import { getStore } from '../store';
import type { Order } from '../types';
import { readLastOrder, saveLastOrder } from './CheckoutPage';

export function OrderLookupPage() {
  const { tr } = useI18n();
  const last = readLastOrder();

  const [code, setCode] = useState(last?.code ?? '');
  const [email, setEmail] = useState(last?.email ?? '');
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setNotFound(false);
    setError(false);
    setOrder(null);
    try {
      const found = await getStore().getOrder(code, email);
      if (found) {
        setOrder(found);
        saveLastOrder(found.code, found.customerEmail);
      } else {
        setNotFound(true);
      }
    } catch {
      setError(true);
    } finally {
      setSearching(false);
    }
  };

  const handleContinuePayment = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const payment = await getStore().startPayment(order.code, order.customerEmail);
      if (payment.kind === 'redirect') {
        window.location.href = payment.url;
      } else {
        const refreshed = await getStore().getOrder(order.code, order.customerEmail);
        if (refreshed) setOrder(refreshed);
      }
    } catch {
      setError(true);
    } finally {
      setPaying(false);
    }
  };

  return (
    <section className="section page-top">
      <div className="container container--narrow">
        <h1 className="section__title">{tr.orderLookup.title}</h1>
        <p className="section__subtitle">{tr.orderLookup.subtitle}</p>

        <form className="lookup-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>{tr.orderLookup.code}</span>
            <input
              className="input"
              type="text"
              value={code}
              placeholder={tr.orderLookup.codePlaceholder}
              required
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </label>
          <label className="field">
            <span>{tr.orderLookup.email}</span>
            <input className="input" type="email" value={email} required autoComplete="email"
              onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit" className="btn btn--primary" disabled={searching}>
            {searching ? tr.orderLookup.searching : tr.orderLookup.find}
          </button>
        </form>

        {notFound && <p className="notice notice--warn" role="alert">{tr.orderLookup.notFound}</p>}
        {error && <p className="notice notice--error" role="alert">{tr.common.error}</p>}

        {order && (
          <OrderView order={order} onContinuePayment={handleContinuePayment} paying={paying} />
        )}
      </div>
    </section>
  );
}
