// ============================================================
// Home de una página: hero, categorías, destacados, marcas,
// cómo funciona, FAQ y sucursales, con reveal-on-scroll.
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { ProductGridSkeleton } from '../components/Skeleton';
import { useI18n } from '../context/LangContext';
import { getStore } from '../store';
import type { Category, Product } from '../types';
import { BRANCHES } from '../types';

const BRAND_NAMES = [
  'Johnnie Walker', 'Chanel', 'Prada', 'Lancôme', 'Dior', 'Ray-Ban', 'JBL',
  'LEGO', 'Samsonite', 'Stanley', 'Victorinox', 'Toblerone', 'Swatch', 'Xiaomi',
];

export function HomePage() {
  const { tr } = useI18n();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const store = getStore();
    Promise.all([store.getCategories(), store.getProducts({ sort: 'featured' })])
      .then(([cats, prods]) => {
        if (cancelled) return;
        setCategories(cats);
        setFeatured(prods.filter((p) => p.featured).slice(0, 8));
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const steps = [
    { title: tr.how.step1Title, text: tr.how.step1Text, icon: '🛍️' },
    { title: tr.how.step2Title, text: tr.how.step2Text, icon: '💳' },
    { title: tr.how.step3Title, text: tr.how.step3Text, icon: '📱' },
    { title: tr.how.step4Title, text: tr.how.step4Text, icon: '✈️' },
  ];

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="hero__mountains">
            <path d="M0 320 L180 140 L320 250 L520 60 L720 230 L900 110 L1100 260 L1290 150 L1440 240 L1440 320 Z" fill="rgba(255,255,255,.05)" />
            <path d="M0 320 L240 200 L430 290 L640 150 L860 280 L1080 180 L1440 300 L1440 320 Z" fill="rgba(255,255,255,.08)" />
          </svg>
        </div>
        <div className="container hero__content">
          <p className="hero__kicker">{tr.hero.kicker}</p>
          <h1 className="hero__title">{tr.hero.title}</h1>
          <p className="hero__subtitle">{tr.hero.subtitle}</p>
          <div className="hero__ctas">
            <Link to="/catalogo" className="btn btn--accent btn--lg">{tr.hero.ctaShop}</Link>
            <a href="#como-funciona" className="btn btn--ghost btn--lg">{tr.hero.ctaHow}</a>
          </div>
          <ul className="hero__badges">
            <li>✔ {tr.hero.freeTax}</li>
            <li>✔ {tr.hero.pickup}</li>
            <li>✔ {tr.hero.secure}</li>
          </ul>
        </div>
      </section>

      {/* --------------------------- CATEGORÍAS --------------------------- */}
      <section className="section" id="categorias">
        <div className="container">
          <Reveal>
            <h2 className="section__title">{tr.categories.title}</h2>
            <p className="section__subtitle">{tr.categories.subtitle}</p>
          </Reveal>
          {error && <p className="notice notice--error">{tr.common.error}</p>}
          {!categories && !error && <ProductGridSkeleton count={4} />}
          {categories && (
            <div className="category-grid">
              {categories.map((cat, i) => (
                <Reveal key={cat.slug} delay={i * 60}>
                  <CategoryCard category={cat} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --------------------------- DESTACADOS --------------------------- */}
      <section className="section section--alt" id="destacados">
        <div className="container">
          <Reveal>
            <h2 className="section__title">{tr.featured.title}</h2>
            <p className="section__subtitle">{tr.featured.subtitle}</p>
          </Reveal>
          {!featured && !error && <ProductGridSkeleton count={8} />}
          {featured && (
            <div className="product-grid">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
          <Reveal>
            <div className="section__cta">
              <Link to="/catalogo" className="btn btn--primary">{tr.categories.viewAll}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- MARCAS ----------------------------- */}
      <section className="section brands" aria-label={tr.brands.title}>
        <div className="container">
          <Reveal>
            <h2 className="section__title section__title--sm">{tr.brands.title}</h2>
          </Reveal>
        </div>
        <div className="brands__marquee" aria-hidden="true">
          <div className="brands__track">
            {[...BRAND_NAMES, ...BRAND_NAMES].map((name, i) => (
              <span key={i} className="brands__item">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- CÓMO FUNCIONA -------------------------- */}
      <section className="section" id="como-funciona">
        <div className="container">
          <Reveal>
            <h2 className="section__title">{tr.how.title}</h2>
            <p className="section__subtitle">{tr.how.subtitle}</p>
          </Reveal>
          <div className="steps">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="step">
                  <span className="step__number" aria-hidden="true">{i + 1}</span>
                  <span className="step__icon" aria-hidden="true">{step.icon}</span>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__text">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="notice notice--info">{tr.how.note}</p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ FAQ ------------------------------- */}
      <section className="section section--alt" id="faq">
        <div className="container container--narrow">
          <Reveal>
            <h2 className="section__title">{tr.faq.title}</h2>
          </Reveal>
          <div className="faq">
            {tr.faq.items.map((item, i) => (
              <Reveal key={i} delay={i * 40}>
                <details className="faq__item">
                  <summary className="faq__q">{item.q}</summary>
                  <p className="faq__a">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- SUCURSALES --------------------------- */}
      <section className="section" id="sucursales">
        <div className="container">
          <Reveal>
            <h2 className="section__title">{tr.branches.title}</h2>
            <p className="section__subtitle">{tr.branches.subtitle}</p>
          </Reveal>
          <div className="branch-grid">
            {BRANCHES.map((branch, i) => (
              <Reveal key={branch} delay={i * 60}>
                <div className="branch-card">
                  <h3 className="branch-card__name">{tr.branches.labels[branch]}</h3>
                  <p className="branch-card__detail">{tr.branches.details[branch]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
