// ============================================================
// Selección del adapter según entorno: demo (localStorage) o
// Supabase. Singleton usado por toda la UI.
// ============================================================

import { USE_DEMO } from '../lib/env';
import { getSupabase } from '../lib/supabase';
import { DemoAdapter } from './demoAdapter';
import type { StoreAdapter } from './StoreAdapter';
import { SupabaseAdapter } from './supabaseAdapter';

let adapter: StoreAdapter | null = null;

export function getStore(): StoreAdapter {
  if (!adapter) {
    adapter = USE_DEMO ? new DemoAdapter() : new SupabaseAdapter(getSupabase());
  }
  return adapter;
}
