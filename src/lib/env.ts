// ============================================================
// Lectura centralizada de variables de entorno del frontend.
// Acá solo pueden vivir claves PÚBLICAS (el bundle es público).
// ============================================================

export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/**
 * Modo demo: explícito por env var, o implícito si faltan las
 * credenciales públicas de Supabase.
 */
export const USE_DEMO: boolean =
  import.meta.env.VITE_USE_DEMO_DATA === 'true' || !SUPABASE_URL || !SUPABASE_ANON_KEY;

/** Password del panel demo. Sin valor → panel deshabilitado en demo. */
export const ADMIN_DEMO_PASSWORD: string = import.meta.env.VITE_ADMIN_DEMO_PASSWORD ?? '';

/** Resuelve una ruta de `public/` contra el BASE_URL del build (GitHub Pages). */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
