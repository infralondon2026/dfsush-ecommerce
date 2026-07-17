// ============================================================
// Panel /equipo: sesión + pestañas Órdenes / Stock / Métricas.
// ============================================================

import { useEffect, useState } from 'react';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminMetrics } from '../components/admin/AdminMetrics';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminStock } from '../components/admin/AdminStock';
import { useI18n } from '../context/LangContext';
import { getStore } from '../store';
import type { AdminSession } from '../types';

type Tab = 'orders' | 'stock' | 'metrics';

export function AdminPage() {
  const { tr } = useI18n();
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('orders');

  useEffect(() => {
    getStore().getAdminSession().then(setSession).catch(() => setSession(null));
  }, []);

  const handleSignOut = async () => {
    await getStore().adminSignOut();
    setSession(null);
  };

  if (session === undefined) {
    return (
      <section className="section page-top">
        <div className="container container--narrow">
          <p className="notice notice--info">{tr.common.loading}</p>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="section page-top">
        <div className="container container--narrow">
          <h1 className="section__title">{tr.admin.title}</h1>
          <AdminLogin onSignedIn={setSession} />
        </div>
      </section>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'orders', label: tr.admin.tabs.orders },
    { key: 'stock', label: tr.admin.tabs.stock },
    { key: 'metrics', label: tr.admin.tabs.metrics },
  ];

  return (
    <section className="section page-top">
      <div className="container admin-panel">
        <div className="admin-panel__head">
          <h1 className="section__title">{tr.admin.title}</h1>
          <div className="admin-panel__session">
            <span>{session.email} · {session.role}</span>
            <button type="button" className="btn btn--ghost-dark btn--sm" onClick={handleSignOut}>
              {tr.admin.signOut}
            </button>
          </div>
        </div>

        <div className="admin-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`admin-tabs__tab ${tab === t.key ? 'admin-tabs__tab--active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'orders' && <AdminOrders />}
        {tab === 'stock' && <AdminStock />}
        {tab === 'metrics' && <AdminMetrics />}
      </div>
    </section>
  );
}
