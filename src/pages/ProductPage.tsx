// ============================================================
// Detalle de producto: variante, cantidad, stock y descripción
// localizada.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlockSkeleton } from '../components/Skeleton';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/LangContext';
import { formatUsd } from '../i18n';
import { asset } from '../lib/env';
import { getStore } from '../store';
import type { Lang, Product } from '../types';

function productDesc(product: Product, lang: Lang): string {
  if (lang === 'pt') return product.descPt;
  if (lang === 'en') return product.descEn;
  return product.descEs;
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { tr, lang } = useI18n();
  const { addLine } = useCart();

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [variantId, setVariantId] = useState('');
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setProduct(undefined);
    getStore()
      .getProduct(slug ?? '')
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        const first = p?.variants.find((v) => v.active && v.stock > 0) ?? p?.variants[0];
        setVariantId(first?.id ?? '');
        setQty(1);
      })
      .catch(() => !cancelled && setProduct(null));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const variant = useMemo(
    () => product?.variants.find((v) => v.id === variantId),
    [product, variantId],
  );

  if (product === undefined) {
    return (
      <section className="section page-top">
        <div className="container container--narrow"><BlockSkeleton height={420} /></div>
      </section>
    );
  }

  if (product === null) {
    return (
      <section className="section page-top">
        <div className="container container--narrow">
          <p className="notice notice--error">{tr.product.notFound}</p>
          <Link to="/catalogo" className="btn btn--primary">{tr.product.backToCatalog}</Link>
        </div>
      </section>
    );
  }

  const outOfStock = !variant || variant.stock <= 0;
  const maxQty = Math.min(variant?.stock ?? 0, 99);

  const handleAdd = () => {
    if (!variant || outOfStock) return;
    addLine(product.id, variant.id, qty, variant.stock);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <section className="section page-top">
      <div className="container product-detail">
        <div className="product-detail__media">
          <img src={asset(product.image)} alt={`${product.brand} ${product.name}`} width={480} height={480} />
        </div>

        <div className="product-detail__info">
          <Link to="/catalogo" className="product-detail__back">← {tr.product.backToCatalog}</Link>
          <p className="product-detail__brand">{product.brand}</p>
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__desc">{productDesc(product, lang)}</p>

          {product.variants.length > 1 && (
            <label className="product-detail__field">
              <span>{tr.product.variantLabel}</span>
              <select className="input" value={variantId} onChange={(e) => { setVariantId(e.target.value); setQty(1); }}>
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.stock <= 0}>
                    {v.label} — {formatUsd(v.priceUsd, lang)}{v.stock <= 0 ? ` (${tr.product.outOfStock})` : ''}
                  </option>
                ))}
              </select>
            </label>
          )}

          <p className="product-detail__price">
            {variant ? formatUsd(variant.priceUsd, lang) : '—'}
            <span className="product-detail__price-note"> {tr.product.dutyFreeNote}</span>
          </p>

          {outOfStock ? (
            <p className="notice notice--warn">{tr.product.outOfStock}</p>
          ) : (
            <>
              <p className={`product-detail__stock ${variant.stock <= 5 ? 'product-detail__stock--low' : ''}`}>
                {variant.stock <= 5 ? tr.product.lowStock : tr.product.inStock(variant.stock)}
              </p>
              <div className="product-detail__buy">
                <label className="product-detail__field product-detail__field--qty">
                  <span>{tr.product.qtyLabel}</span>
                  <select className="input" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                    {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className={`btn btn--lg ${justAdded ? 'btn--success' : 'btn--accent'}`}
                  onClick={handleAdd}
                >
                  {justAdded ? tr.product.added : tr.product.addToCart}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
