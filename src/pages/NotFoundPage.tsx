// ============================================================
// 404 dentro de la SPA.
// ============================================================

import { Link } from 'react-router-dom';
import { useI18n } from '../context/LangContext';

export function NotFoundPage() {
  const { tr } = useI18n();

  return (
    <section className="section page-top">
      <div className="container container--narrow" style={{ textAlign: 'center' }}>
        <h1 className="section__title">404</h1>
        <p className="section__subtitle">{tr.product.notFound}</p>
        <Link to="/" className="btn btn--primary">{tr.result.backHome}</Link>
      </div>
    </section>
  );
}
