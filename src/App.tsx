// ============================================================
// Shell de la aplicación: providers, layout y rutas.
// ============================================================

import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { BackToTop } from './components/BackToTop';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ScrollProgress } from './components/ScrollProgress';
import { CartProvider } from './context/CartContext';
import { LangProvider, useI18n } from './context/LangContext';
import { AdminPage } from './pages/AdminPage';
import { CartPage } from './pages/CartPage';
import { CatalogPage } from './pages/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderLookupPage } from './pages/OrderLookupPage';
import { PaymentResultPage } from './pages/PaymentResultPage';
import { ProductPage } from './pages/ProductPage';

/** Al navegar, vuelve el scroll arriba (salvo anclas dentro del home). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function Layout() {
  const { tr } = useI18n();

  return (
    <>
      <a href="#contenido" className="skip-link">{tr.common.skipToContent}</a>
      <ScrollProgress />
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/compra/exito" element={<PaymentResultPage outcome="exito" />} />
          <Route path="/compra/fallo" element={<PaymentResultPage outcome="fallo" />} />
          <Route path="/compra/pendiente" element={<PaymentResultPage outcome="pendiente" />} />
          <Route path="/mi-orden" element={<OrderLookupPage />} />
          <Route path="/legales" element={<LegalPage />} />
          <Route path="/equipo" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <CartProvider>
        <ScrollToTop />
        <Layout />
      </CartProvider>
    </LangProvider>
  );
}
