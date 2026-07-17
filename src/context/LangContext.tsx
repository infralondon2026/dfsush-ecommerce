// ============================================================
// Contexto de idioma: expone el diccionario tipado completo y
// el setter. Uso: const { tr, lang, setLang } = useI18n();
// ============================================================

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { dictionaries, getInitialLang, persistLang, type Dict } from '../i18n';
import type { Lang } from '../types';

interface LangContextValue {
  lang: Lang;
  tr: Dict;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    persistLang(next);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({ lang, tr: dictionaries[lang], setLang }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n debe usarse dentro de <LangProvider>');
  return ctx;
}
