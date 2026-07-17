// ============================================================
// Tarjeta de producto para grillas (home destacados y catálogo).
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/LangContext';
import { formatUsd } from '../i18n';
import { asset } from '../lib/env';
import type { Product } from '../types';

export function ProductCard({ product }: { product: Product }) {
  const { tr, lang } = useI18n();
  const { addLine } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const activeVariants = product.variants.filter((v) => v.active);
  const cheapest = activeVariants.reduce(
    (min, v) => (v.priceUsd < min.priceUsd ? v : min),
    activeVariants[0],
  );
  const totalStock = activeVariants.reduce((acc, v) => acc + v.stock, 0);
  const outOfStock = totalStock <= 0;
  const multiVariant = activeVariants.length > 1;

  const handleQuickAdd = () => {
    if (!cheapest || cheapest.stock <= 0) return;
    addLine(product.id, cheapest.id, 1, cheapest.stock);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className={`product-card ${outOfStock ? 'product-card--out' : ''}`}>
      <Link to={`/producto/${product.slug}`} className="product-card__media" tabIndex={-1} aria-hidden="true">
        <img src={asset(product.image)} alt="" loading="lazy" width={300} height={300} />
        {product.featured && <span className="product-card__flag">★</span>}
      </Link>
      <div className="product-card__body">
        <p className="product-card__brand">{product.brand}</p>
        <h3 className="product-card__name">
          <Link to={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card__price">
          {multiVariant && <span className="product-card__from">{tr.product.from} </span>}
          {cheapest ? formatUsd(cheapest.priceUsd, lang) : '—'}
        </p>
        {outOfStock ? (
          <p className="product-card__stock product-card__stock--out">{tr.product.outOfStock}</p>
        ) : multiVariant ? (
          // Con varias presentaciones, la elección se hace en el detalle.
          <Link to={`/producto/${product.slug}`} className="btn btn--sm btn--primary">
            {tr.product.addToCart}
          </Link>
        ) : (
          <button
            type="button"
            className={`btn btn--sm ${justAdded ? 'btn--success' : 'btn--primary'}`}
            onClick={handleQuickAdd}
          >
            {justAdded ? tr.product.added : tr.product.addToCart}
          </button>
        )}
      </div>
    </article>
  );
}
