// ============================================================
// Login del panel: Supabase Auth (email+password) o, en demo,
// solo password vía VITE_ADMIN_DEMO_PASSWORD. Sin esa env var
// el panel demo queda deshabilitado (sin hints de credenciales).
// ============================================================

import { useState, type FormEvent } from 'react';
import { useI18n } from '../../context/LangContext';
import { ADMIN_DEMO_PASSWORD } from '../../lib/env';
import { getStore } from '../../store';
import type { AdminSession } from '../../types';

export function AdminLogin({ onSignedIn }: { onSignedIn: (session: AdminSession) => void }) {
  const { tr } = useI18n();
  const store = getStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const demoDisabled = store.isDemo && !ADMIN_DEMO_PASSWORD;

  if (demoDisabled) {
    return <p className="notice notice--warn">{tr.admin.disabled}</p>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const session = await store.adminSignIn(email, password);
      onSignedIn(session);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="admin-login" onSubmit={handleSubmit}>
      <h2>{tr.admin.loginTitle}</h2>
      {store.isDemo && <p className="notice notice--info">{tr.admin.demoMode}</p>}
      {!store.isDemo && (
        <label className="field">
          <span>{tr.admin.email}</span>
          <input className="input" type="email" value={email} required autoComplete="username"
            onChange={(e) => setEmail(e.target.value)} />
        </label>
      )}
      <label className="field">
        <span>{tr.admin.password}</span>
        <input className="input" type="password" value={password} required autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="notice notice--error" role="alert">{tr.admin.wrongCredentials}</p>}
      <button type="submit" className="btn btn--primary" disabled={busy}>
        {busy ? tr.admin.signingIn : tr.admin.signIn}
      </button>
    </form>
  );
}
