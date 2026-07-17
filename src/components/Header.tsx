// ============================================================
// Header sticky: logo, navegación, selector de idioma y carrito.
// ============================================================

import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/LangContext';
import { asset } from '../lib/env';
import { LANGS } from '../i18n';

export function Header() {
  const { tr, lang, setLang } = useI18n();
  const { totalQty } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Cierra el menú mobile al navegar.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const navItems = [
    { to: '/catalogo', label: tr.nav.catalog },
    { to: '/#como-funciona', label: tr.nav.how, hash: true },
    { to: '/#sucursales', label: tr.nav.branches, hash: true },
    { to: '/mi-orden', label: tr.nav.myOrder },
  ];

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="header__logo" aria-label={tr.meta.siteName}>
          <img src={asset('img/logo-dfsas.png')} alt="Duty Free Shop Atlántico Sur" height={40} />
        </Link>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="principal">
          {navItems.map((item) =>
            item.hash ? (
              <a key={item.to} href={`#${item.to.split('#')[1]}`} className="header__link"
                onClick={(e) => {
                  // En páginas internas el ancla vive en el home.
                  if (location.pathname !== '/') return;
                  e.preventDefault();
                  document.getElementById(item.to.split('#')[1])?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="header__actions">
          <div className="lang-switch" role="group" aria-label={tr.nav.changeLang}>
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={`lang-switch__btn ${l === lang ? 'lang-switch__btn--active' : ''}`}
                aria-pressed={l === lang}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <Link to="/carrito" className="header__cart" aria-label={`${tr.nav.cart} (${totalQty})`}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 4h2l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 8H6.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="21" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="17.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {totalQty > 0 && <span className="header__cart-badge">{totalQty}</span>}
          </Link>

          <button
            type="button"
            className="header__burger"
            aria-label={menuOpen ? tr.nav.closeMenu : tr.nav.openMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
