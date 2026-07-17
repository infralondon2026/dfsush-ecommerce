// ============================================================
// Tarjeta de categoría (grilla del home).
// ============================================================

import { Link } from 'react-router-dom';
import { useI18n } from '../context/LangContext';
import { asset } from '../lib/env';
import type { Category, Lang } from '../types';

export function categoryName(category: Category, lang: Lang): string {
  if (lang === 'pt') return category.namePt;
  if (lang === 'en') return category.nameEn;
  return category.nameEs;
}

export function CategoryCard({ category }: { category: Category }) {
  const { lang } = useI18n();

  return (
    <Link to={`/catalogo?cat=${category.slug}`} className="category-card">
      <img src={asset(category.image)} alt="" loading="lazy" width={300} height={200} />
      <span className="category-card__name">{categoryName(category, lang)}</span>
    </Link>
  );
}
