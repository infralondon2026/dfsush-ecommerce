// ============================================================
// Skeletons de carga (respetan prefers-reduced-motion vía CSS).
// ============================================================

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="product-card product-card--skeleton">
          <div className="skeleton skeleton--media" />
          <div className="product-card__body">
            <div className="skeleton skeleton--line skeleton--w40" />
            <div className="skeleton skeleton--line skeleton--w80" />
            <div className="skeleton skeleton--line skeleton--w30" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlockSkeleton({ height = 160 }: { height?: number }) {
  return <div className="skeleton skeleton--block" style={{ height }} aria-hidden="true" />;
}
