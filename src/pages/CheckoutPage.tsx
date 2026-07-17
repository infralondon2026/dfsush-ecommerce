// ============================================================
// Checkout: datos del comprador, sucursal y fecha de retiro,
// vuelo opcional. Crea la orden (el total lo calcula el
// backend/adapter, nunca el formulario) e inicia el pago.
// ============================================================

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BlockSkeleton } from '../components/Skeleton';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/LangContext';
import { addDays, formatUsd, todayInUshuaia } from '../i18n';
import { getStore } from '../store';
import { StockError } from '../store/StoreAdapter';
import { resolveCartLines, type ResolvedLine } from './CartPage';
import type { Branch, Product } from '../types';
import { BRANCHES } from '../types';

const LAST_ORDER_KEY = 'dfsas_last_order';

export function saveLastOrder(code: string, email: string): void {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ code, email }));
  } catch {
    /* noop */
  }
}

export function readLastOrder(): { code: string; email: string } | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as { code: string; email: string }) : null;
  } catch {
    return null;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutPage() {
  const { tr, lang } = useI18n();
  const { lines, clear } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState<Branch | ''>('');
  const [date, setDate] = useState('');
  const [flight, setFlight] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const minDate = todayInUshuaia();
  const maxDate = addDays(minDate, 30);

  useEffect(() => {
    getStore().getProducts().then(setProducts).catch(() => setLoadError(true));
  }, []);

  const resolved: ResolvedLine[] = useMemo(
    () => (products ? resolveCartLines(lines, products) : []),
    [lines, products],
  );
  const total = resolved.reduce((acc, l) => acc + l.variant.priceUsd * l.qty, 0);

  // Sin items no hay checkout.
  useEffect(() => {
    if (products && resolved.length === 0 && !submitting) navigate('/carrito', { replace: true });
  }, [products, resolved.length, submitting, navigate]);

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !branch || !date) return tr.checkout.errRequired;
    if (!EMAIL_RE.test(email.trim())) return tr.checkout.errEmail;
    if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()) return tr.checkout.errEmailMatch;
    if (date < minDate || date > maxDate) return tr.checkout.errDate;
    if (!terms) return tr.checkout.errTerms;
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);
    setSubmitting(true);
    const store = getStore();
    try {
      const result = await store.createOrder({
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() || undefined },
        items: resolved.map((l) => ({ variantId: l.variant.id, qty: l.qty })),
        pickup: { branch: branch as Branch, date, flightNumber: flight.trim() || undefined },
        lang,
      });
      saveLastOrder(result.code, email.trim().toLowerCase());
      clear();

      const payment = await store.startPayment(result.code, email.trim());
      if (payment.kind === 'redirect') {
        // Checkout Pro: el pago ocurre en Mercado Pago.
        window.location.href = payment.url;
      } else {
        navigate(`/compra/exito?code=${encodeURIComponent(result.code)}`);
      }
    } catch (err) {
      if (err instanceof StockError) {
        const item = resolved.find((l) => l.variant.sku === err.sku);
        const label = item ? `${item.product.brand} ${item.product.name}` : err.sku;
        setFormError(tr.checkout.errStock(label));
      } else {
        setFormError(tr.checkout.errGeneric);
      }
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <section className="section page-top">
        <div className="container container--narrow">
          <p className="notice notice--error">{tr.common.error}</p>
        </div>
      </section>
    );
  }

  if (!products) {
    return (
      <section className="section page-top">
        <div className="container container--narrow"><BlockSkeleton height={420} /></div>
      </section>
    );
  }

  const store = getStore();

  return (
    <section className="section page-top">
      <div className="container checkout">
        <form className="checkout__form" onSubmit={handleSubmit} noValidate>
          <h1 className="section__title">{tr.checkout.title}</h1>

          <fieldset className="checkout__group">
            <legend>{tr.checkout.contactTitle}</legend>
            <label className="field">
              <span>{tr.checkout.name} *</span>
              <input className="input" type="text" value={name} required autoComplete="name"
                onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="field">
              <span>{tr.checkout.email} *</span>
              <input className="input" type="email" value={email} required autoComplete="email"
                onChange={(e) => setEmail(e.target.value)} />
              <small>{tr.checkout.emailHint}</small>
            </label>
            <label className="field">
              <span>{tr.checkout.emailConfirm} *</span>
              <input className="input" type="email" value={emailConfirm} required autoComplete="email"
                onChange={(e) => setEmailConfirm(e.target.value)} />
            </label>
            <label className="field">
              <span>{tr.checkout.phone}</span>
              <input className="input" type="tel" value={phone} autoComplete="tel"
                onChange={(e) => setPhone(e.target.value)} />
            </label>
          </fieldset>

          <fieldset className="checkout__group">
            <legend>{tr.checkout.pickupTitle}</legend>
            <label className="field">
              <span>{tr.checkout.branch} *</span>
              <select className="input" value={branch} required
                onChange={(e) => setBranch(e.target.value as Branch)}>
                <option value="">{tr.checkout.branchPlaceholder}</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{tr.branches.labels[b]}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{tr.checkout.date} *</span>
              <input className="input" type="date" value={date} min={minDate} max={maxDate} required
                onChange={(e) => setDate(e.target.value)} />
              <small>{tr.checkout.dateHint}</small>
            </label>
            <label className="field">
              <span>{tr.checkout.flight}</span>
              <input className="input" type="text" value={flight} placeholder="AR1880" maxLength={10}
                onChange={(e) => setFlight(e.target.value)} />
              <small>{tr.checkout.flightHint}</small>
            </label>
          </fieldset>

          <label className="checkout__terms">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span>
              {tr.checkout.termsPrefix}{' '}
              <Link to="/legales" target="_blank">{tr.checkout.termsLink}</Link> *
            </span>
          </label>

          {formError && <p className="notice notice--error" role="alert">{formError}</p>}

          <p className="checkout__note">{tr.checkout.reserveNote}</p>
          <p className="checkout__note">{store.isDemo ? tr.checkout.demoNote : tr.checkout.mpNote}</p>

          <button type="submit" className="btn btn--accent btn--lg checkout__submit" disabled={submitting}>
            {submitting
              ? tr.checkout.processing
              : store.isDemo
                ? tr.checkout.payDemo
                : tr.checkout.payWithMp}
          </button>
        </form>

        <aside className="checkout__summary">
          <h2>{tr.checkout.orderSummary}</h2>
          <ul>
            {resolved.map((l) => (
              <li key={l.variant.id}>
                <span>{l.qty} × {l.product.brand} {l.product.name} · {l.variant.label}</span>
                <span>{formatUsd(l.variant.priceUsd * l.qty, lang)}</span>
              </li>
            ))}
          </ul>
          <p className="checkout__total">
            <span>{tr.cart.total}</span>
            <strong>{formatUsd(total, lang)}</strong>
          </p>
        </aside>
      </div>
    </section>
  );
}
