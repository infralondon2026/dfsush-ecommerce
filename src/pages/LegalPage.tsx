// ============================================================
// Condiciones de venta y franquicias aduaneras.
// Texto PLACEHOLDER marcado PARA REVISIÓN LEGAL.
// ============================================================

import { useI18n } from '../context/LangContext';

export function LegalPage() {
  const { tr } = useI18n();

  return (
    <section className="section page-top">
      <div className="container container--narrow legal">
        <h1 className="section__title">{tr.legal.title}</h1>
        <p className="legal__updated">{tr.legal.updated}</p>
        <p className="notice notice--warn">{tr.legal.reviewNotice}</p>

        {tr.legal.sections.map((section) => (
          <article key={section.h} className="legal__section">
            <h2>{section.h}</h2>
            <p>{section.p}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
