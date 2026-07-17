// ============================================================
// Carrito persistente en localStorage. Guarda solo referencias
// (productId + variantId + qty); precios y stock se resuelven
// contra el catálogo al renderizar y al pagar (server-side).
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine } from '../types';

const CART_KEY = 'dfsas_cart_v1';

interface CartContextValue {
  lines: CartLine[];
  totalQty: number;
  addLine: (productId: string, variantId: string, qty: number, maxStock: number) => void;
  setQty: (variantId: string, qty: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* almacenamiento lleno o deshabilitado: el carrito vive en memoria */
    }
  }, [lines]);

  const addLine = useCallback(
    (productId: string, variantId: string, qty: number, maxStock: number) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.variantId === variantId);
        const nextQty = Math.min((existing?.qty ?? 0) + qty, maxStock, 99);
        if (nextQty <= 0) return prev;
        if (existing) {
          return prev.map((l) => (l.variantId === variantId ? { ...l, qty: nextQty } : l));
        }
        return [...prev, { productId, variantId, qty: nextQty }];
      });
    },
    [],
  );

  const setQty = useCallback((variantId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(qty, 99) } : l)),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totalQty: lines.reduce((acc, l) => acc + l.qty, 0),
      addLine,
      setQty,
      removeLine,
      clear,
    }),
    [lines, addLine, setQty, removeLine, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
