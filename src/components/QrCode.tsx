// ============================================================
// QR de retiro: codifica SOLO el código de orden (sin PII).
// ============================================================

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function QrCode({ value, size = 220 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: { dark: '#0e1122', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) return <div className="skeleton" style={{ width: size, height: size }} aria-hidden="true" />;

  return <img src={dataUrl} width={size} height={size} alt={`QR: ${value}`} className="qr-code" />;
}
