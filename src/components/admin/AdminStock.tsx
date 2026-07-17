// ============================================================
// Gestión de stock del panel: búsqueda y ajustes ±1 por variante.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../context/LangContext';
import { getStore } from '../../store';
import type { InventoryRow } from '../../types';

export function AdminStock() {
  const { tr } = useI18n();
  const [rows, setRows] = useState<InventoryRow[] | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(false);
  const [busySku, setBusySku] = useState<string | null>(null);

  useEffect(() => {
    getStore().adminListInventory().then(setRows).catch(() => setError(true));
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.productName.toLowerCase().includes(q) ||
        r.brand.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const adjust = async (row: InventoryRow, delta: number) => {
    setBusySku(row.sku);
    try {
      const next = await getStore().adminAdjustStock(row.variantId, delta);
      setRows((prev) =>
        prev ? prev.map((r) => (r.variantId === row.variantId ? { ...r, qty: next } : r)) : prev,
      );
    } catch {
      setError(true);
    } finally {
      setBusySku(null);
    }
  };

  return (
    <div className="admin-panel__section">
      <div className="admin-toolbar">
        <input
          type="search"
          className="input"
          placeholder={tr.admin.stock.search}
          aria-label={tr.admin.stock.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p className="notice notice--error">{tr.common.error}</p>}
      {rows && filtered.length === 0 && <p className="notice notice--info">{tr.admin.stock.empty}</p>}

      {filtered.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{tr.admin.stock.product}</th>
                <th>{tr.admin.stock.variant}</th>
                <th>{tr.admin.stock.sku}</th>
                <th>{tr.admin.stock.qty}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.variantId}>
                  <td>{row.brand} {row.productName}</td>
                  <td>{row.variantLabel}</td>
                  <td><small>{row.sku}</small></td>
                  <td className={row.qty === 0 ? 'admin-table__qty--zero' : ''}>{row.qty}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="qty-btn" aria-label={tr.admin.stock.adjustMinus}
                        disabled={busySku === row.sku || row.qty === 0} onClick={() => adjust(row, -1)}>
                        −
                      </button>
                      <button type="button" className="qty-btn" aria-label={tr.admin.stock.adjustPlus}
                        disabled={busySku === row.sku} onClick={() => adjust(row, 1)}>
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
