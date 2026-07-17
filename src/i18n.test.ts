// ============================================================
// Verifica que los tres idiomas tengan exactamente la misma
// estructura de claves (nada sin traducir) y los helpers de
// formato/zona horaria.
// ============================================================

import { describe, expect, it } from 'vitest';
import { addDays, dictionaries, formatUsd, LANGS, todayInUshuaia } from './i18n';

type AnyRecord = Record<string, unknown>;

/** Devuelve la lista de rutas de claves hoja de un objeto (con tipo). */
function keyPaths(obj: AnyRecord, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return keyPaths(value as AnyRecord, path);
    }
    const kind = Array.isArray(value) ? 'array' : typeof value;
    return [`${path}:${kind}`];
  });
}

describe('i18n', () => {
  it('ES, PT y EN tienen exactamente las mismas claves y tipos', () => {
    const es = keyPaths(dictionaries.es as unknown as AnyRecord).sort();
    for (const lang of LANGS) {
      const other = keyPaths(dictionaries[lang] as unknown as AnyRecord).sort();
      expect(other, `estructura de "${lang}"`).toEqual(es);
    }
  });

  it('ningún texto hoja queda vacío', () => {
    const check = (obj: AnyRecord, lang: string) => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          expect(value.trim(), `${lang}:${key}`).not.toBe('');
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          check(value as AnyRecord, `${lang}.${key}`);
        }
      }
    };
    for (const lang of LANGS) check(dictionaries[lang] as unknown as AnyRecord, lang);
  });

  it('las FAQ tienen la misma cantidad de items en todos los idiomas', () => {
    const count = dictionaries.es.faq.items.length;
    expect(count).toBeGreaterThan(3);
    for (const lang of LANGS) {
      expect(dictionaries[lang].faq.items).toHaveLength(count);
    }
  });

  it('formatUsd formatea en USD', () => {
    expect(formatUsd(36, 'en')).toMatch(/36/);
    expect(formatUsd(1234.5, 'es')).toMatch(/1[.,]?234/);
  });

  it('todayInUshuaia devuelve YYYY-MM-DD', () => {
    expect(todayInUshuaia()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('addDays suma días de calendario', () => {
    expect(addDays('2026-07-17', 30)).toBe('2026-08-16');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});
