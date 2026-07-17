// ============================================================
// Footer con enlaces, contacto y aviso de modo demo.
// ============================================================

import { Link } from 'react-router-dom';
import { useI18n } from '../context/LangContext';
import { asset, USE_DEMO } from '../lib/env';

export function Footer() {
  const { tr } = useI18n();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <img
            src={asset('img/logo-dfsas.png')}
            alt="Duty Free Shop Atlántico Sur"
            height={44}
            className="footer__logo"
          />
          <p className="footer__text">{tr.footer.aboutText}</p>
        </div>

        <div>
          <h3 className="footer__title">{tr.footer.linksTitle}</h3>
          <ul className="footer__links">
            <li><Link to="/catalogo">{tr.nav.catalog}</Link></li>
            <li><Link to="/mi-orden">{tr.nav.myOrder}</Link></li>
            <li><Link to="/legales">{tr.footer.legal}</Link></li>
            <li><Link to="/equipo">{tr.admin.title}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="footer__title">{tr.footer.contactTitle}</h3>
          <p className="footer__text">
            {tr.branches.labels.ushuaia_san_martin}
            <br />
            {tr.branches.labels.rio_grande_rosales}
          </p>
          <p className="footer__text">
            {tr.footer.workWithUs}{' '}
            <a href="mailto:rrhh@londonsupply.com">rrhh@londonsupply.com</a>
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          {USE_DEMO && <p className="footer__demo">{tr.footer.demoBadge}</p>}
          <p>
            © {new Date().getFullYear()} Duty Free Shop Atlántico Sur · London Supply Group.{' '}
            {tr.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
