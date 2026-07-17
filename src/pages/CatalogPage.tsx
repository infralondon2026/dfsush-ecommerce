// ============================================================
// Catálogo: búsqueda con debounce, filtro por categoría, orden
// y grilla de productos. Los filtros se sincronizan con la URL.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryName } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { useI18n } from '../context/LangContext';
import { getStore } from '../store';
import type { Category, Product, ProductFilter } from '../types';

type SortKey = NonNullable<ProductFilter['sort']>;
const SORT_KEYS: SortKey[] = ['featured', 'price_asc', 'price_desc', 'name'];

export function CatalogPage() {
  const { tr, lang } = useI18n();
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);

  const cat = params.get('cat') ?? '';
  const sort = (SORT_KEYS as string[]).includes(params.get('orden') ?? '')
    ? (params.get('orden') as SortKey)
    : 'featured';
  const urlQuery = params.get('q') ?? '';
  const [search, setSearch] = useState(urlQuery);

  // Debounce del buscador hacia la URL (la URL es la fuente de verdad).
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (search) next.set('q', search);
          else next.delete('q');
          return next;
        },
        { replace: true },
      );
    }, 250);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    getStore().getCategories().then(setCategories).catch(() => setError(true));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setProducts(null);
    getStore()
      .getProducts({ category: cat || undefined, search: urlQuery || undefined, sort })
      .then((result) => !cancelled && setProducts(result))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [cat, urlQuery, sort]);

  const setParam = (key: string, value: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const sortLabels = useMemo<Record<SortKey, string>>(
    () => ({
      featured: tr.catalog.sortFeatured,
      price_asc: tr.catalog.sortPriceAsc,
      price_desc: tr.catalog.sortPriceDesc,
      name: tr.catalog.sortName,
    }),
    [tr],
  );

  const hasFilters = Boolean(cat || urlQuery || sort !== 'featured');

  return (
    <section className="section page-top">
      <div className="container">
        <h1 className="section__title">{tr.catalog.title}</h1>

        <div className="catalog-controls">
          <input
            type="search"
            className="input catalog-controls__search"
            placeholder={tr.catalog.searchPlaceholder}
            aria-label={tr.catalog.searchLabel}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="catalog-controls__field">
            <span>{tr.catalog.categoryLabel}</span>
            <select className="input" value={cat} onChange={(e) => setParam('cat', e.target.value)}>
              <option value="">{tr.catalog.all}</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{categoryName(c, lang)}</option>
              ))}
            </select>
          </label>
          <label className="catalog-controls__field">
            <span>{tr.catalog.sortLabel}</span>
            <select
              className="input"
              value={sort}
              onChange={(e) => setParam('orden', e.target.value === 'featured' ? '' : e.target.value)}
            >
              {SORT_KEYS.map((key) => (
                <option key={key} value={key}>{sortLabels[key]}</option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="notice notice--error">{tr.common.error}</p>}
        {!products && !error && <ProductGridSkeleton count={8} />}

        {products && (
          <>
            <p className="catalog-count" role="status">{tr.catalog.results(products.length)}</p>
            {products.length === 0 ? (
              <div className="catalog-empty">
                <p>{tr.catalog.empty}</p>
                {hasFilters && (
                  <button type="button" className="btn btn--primary" onClick={() => setParams({})}>
                    {tr.catalog.clearFilters}
                  </button>
                )}
              </div>
            ) : (
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
