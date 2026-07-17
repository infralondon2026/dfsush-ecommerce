// ============================================================
// Carrito: resuelve las líneas guardadas contra el catálogo
// vigente (precios y stock actuales, nunca los guardados).
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BlockSkeleton } from '../components/Skeleton';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/LangContext';
import { formatUsd } from '../i18n';
import { asset } from '../lib/env';
import { getStore } from '../store';
import type { Product } from '../types';

export interface ResolvedLine {
  product: Product;
  variant: Product['variants'][number];
  qty: number;
}

/** Cruza las líneas del carrito con el catálogo actual. */
export function resolveCartLines(
  lines: { productId: string; variantId: string; qty: number }[],
  products: Product[],
): ResolvedLine[] {
  const resolved: ResolvedLine[] = [];
  for (const line of lines) {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (product && variant && variant.active) {
      resolved.push({ product, variant, qty: Math.min(line.qty, Math.max(variant.stock, 0)) });
    }
  }
  return resolved.filter((l) => l.qty > 0);
}

export function CartPage() {
  const { tr, lang } = useI18n();
  const { lines, setQty, removeLine } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getStore().getProducts().then(setProducts).catch(() => setError(true));
  }, []);

  const resolved = useMemo(
    () => (products ? resolveCartLines(lines, products) : []),
    [lines, products],
  );
  const total = resolved.reduce((acc, l) => acc + l.variant.priceUsd * l.qty, 0);

  return (
    <section className="section page-top">
      <div className="container container--narrow">
        <h1 className="section__title">{tr.cart.title}</h1>

        {error && <p className="notice notice--error">{tr.common.error}</p>}
        {!products && !error && <BlockSkeleton height={220} />}

        {products && resolved.length === 0 && (
          <div className="cart-empty">
            <p>{tr.cart.empty}</p>
            <Link to="/catalogo" className="btn btn--primary">{tr.cart.emptyCta}</Link>
          </div>
        )}

        {products && resolved.length > 0 && (
          <>
            <p className="catalog-count">{tr.cart.itemCount(resolved.reduce((a, l) => a + l.qty, 0))}</p>
            <ul className="cart-list">
              {resolved.map(({ product, variant, qty }) => {
                const display = `${product.brand} ${product.name}`;
                return (
                  <li key={variant.id} className="cart-item">
                    <img src={asset(product.image)} alt="" width={72} height={72} className="cart-item__img" />
                    <div className="cart-item__info">
                      <p className="cart-item__name">
                        <Link to={`/producto/${product.slug}`}>{display}</Link>
                      </p>
                      <p className="cart-item__variant">{variant.label}</p>
                      <p className="cart-item__unit">
                        {tr.cart.unitPrice}: {formatUsd(variant.priceUsd, lang)}
                      </p>
                    </div>
                    <div className="cart-item__qty" role="group" aria-label={tr.cart.qty}>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label={tr.cart.decreaseAria(display)}
                        onClick={() => setQty(variant.id, qty - 1)}
                      >
                        −
                      </button>
                      <span className="cart-item__qty-value" aria-live="polite">{qty}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label={tr.cart.increaseAria(display)}
                        disabled={qty >= variant.stock}
                        title={qty >= variant.stock ? tr.cart.maxStockReached : undefined}
                        onClick={() => setQty(variant.id, Math.min(qty + 1, variant.stock))}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item__subtotal">{formatUsd(variant.priceUsd * qty, lang)}</p>
                    <button
                      type="button"
                      className="cart-item__remove"
                      aria-label={tr.cart.removeAria(display)}
                      onClick={() => removeLine(variant.id)}
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="cart-summary">
              <p className="cart-summary__total">
                <span>{tr.cart.total}</span>
                <strong>{formatUsd(total, lang)}</strong>
              </p>
              <div className="cart-summary__actions">
                <Link to="/catalogo" className="btn btn--ghost-dark">{tr.cart.continueShopping}</Link>
                <button type="button" className="btn btn--accent btn--lg" onClick={() => navigate('/checkout')}>
                  {tr.cart.checkout}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
