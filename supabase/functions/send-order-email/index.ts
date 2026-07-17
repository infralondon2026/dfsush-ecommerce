// ============================================================
// send-order-email — confirmación de compra vía Resend, con el
// QR de retiro adjunto. El QR codifica SOLO el código de orden
// (sin ningún dato personal). Idempotente: se envía una única
// vez por orden (mark_email_sent).
//
// Secrets: RESEND_API_KEY, EMAIL_FROM, SITE_URL.
// ============================================================

import { createClient } from 'npm:@supabase/supabase-js@2';
import QRCode from 'npm:qrcode@1';
import { fail, ok, preflight, readJson } from '../_shared/http.ts';

type Lang = 'es' | 'pt' | 'en';

interface OrderRow {
  id: string;
  code: string;
  status: string;
  customer_name: string;
  customer_email: string;
  total_usd: number;
  pickup_branch: string;
  pickup_date: string;
  flight_number: string | null;
  lang: Lang;
}

interface ItemRow {
  product_name: string;
  brand: string;
  variant_label: string;
  unit_price_usd: number;
  qty: number;
}

const BRANCH_LABELS: Record<string, string> = {
  ushuaia_san_martin: 'Ushuaia — San Martín 627',
  ushuaia_aeropuerto: 'Ushuaia — Aeropuerto Int. Malvinas Argentinas',
  rio_grande_rosales: 'Río Grande — Rosales 446',
  rio_grande_aeropuerto: 'Río Grande — Aeropuerto Internacional',
};

const COPY: Record<Lang, {
  subject: (code: string) => string;
  title: string;
  intro: string;
  codeLabel: string;
  qrNote: string;
  pickup: string;
  date: string;
  flight: string;
  items: string;
  total: string;
  footer: string;
}> = {
  es: {
    subject: (code) => `Tu compra ${code} está confirmada — DFSAS Tienda`,
    title: '¡Compra confirmada!',
    intro: 'Recibimos tu pago. Presentá este código QR, tu documento y tu ticket de embarque al retirar tu compra.',
    codeLabel: 'Código de retiro',
    qrNote: 'El QR adjunto contiene únicamente tu código de orden.',
    pickup: 'Sucursal de retiro',
    date: 'Fecha de retiro',
    flight: 'Vuelo',
    items: 'Tu compra',
    total: 'Total',
    footer: 'Duty Free Shop Atlántico Sur · London Supply Group — Ushuaia · Río Grande',
  },
  pt: {
    subject: (code) => `Sua compra ${code} está confirmada — DFSAS Tienda`,
    title: 'Compra confirmada!',
    intro: 'Recebemos seu pagamento. Apresente este código QR, seu documento e seu cartão de embarque ao retirar sua compra.',
    codeLabel: 'Código de retirada',
    qrNote: 'O QR anexo contém apenas o código do seu pedido.',
    pickup: 'Loja de retirada',
    date: 'Data de retirada',
    flight: 'Voo',
    items: 'Sua compra',
    total: 'Total',
    footer: 'Duty Free Shop Atlántico Sur · London Supply Group — Ushuaia · Río Grande',
  },
  en: {
    subject: (code) => `Your purchase ${code} is confirmed — DFSAS Tienda`,
    title: 'Purchase confirmed!',
    intro: 'We received your payment. Show this QR code, your ID and your boarding pass when collecting your purchase.',
    codeLabel: 'Pickup code',
    qrNote: 'The attached QR contains only your order code.',
    pickup: 'Pickup store',
    date: 'Pickup date',
    flight: 'Flight',
    items: 'Your purchase',
    total: 'Total',
    footer: 'Duty Free Shop Atlántico Sur · London Supply Group — Ushuaia · Río Grande',
  },
};

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function usd(n: number): string {
  return `US$ ${Number(n).toFixed(2)}`;
}

function buildHtml(order: OrderRow, items: ItemRow[], siteUrl: string): string {
  const t = COPY[order.lang] ?? COPY.es;
  const rows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:6px 0;color:#22262e;">${i.qty} × ${escapeHtml(`${i.brand} ${i.product_name}`)}${i.variant_label ? ` · ${escapeHtml(i.variant_label)}` : ''}</td>
          <td style="padding:6px 0;text-align:right;color:#22262e;">${usd(i.unit_price_usd * i.qty)}</td>
        </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="${order.lang}">
<body style="margin:0;background:#eef1f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:#1d629c;border-radius:12px 12px 0 0;padding:20px 24px;">
      <p style="margin:0;color:#f5d304;font-weight:bold;font-size:14px;letter-spacing:2px;">DUTY FREE SHOP ATLÁNTICO SUR</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;">${t.title}</h1>
    </div>
    <div style="background:#ffffff;border-radius:0 0 12px 12px;padding:24px;">
      <p style="color:#22262e;">${escapeHtml(order.customer_name)},</p>
      <p style="color:#5c6470;">${t.intro}</p>

      <div style="background:#eef1f5;border-radius:10px;padding:16px;text-align:center;margin:20px 0;">
        <p style="margin:0;color:#5c6470;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${t.codeLabel}</p>
        <p style="margin:6px 0 0;color:#0e1122;font-size:30px;font-weight:bold;letter-spacing:3px;">${order.code}</p>
        <p style="margin:8px 0 0;color:#5c6470;font-size:12px;">${t.qrNote}</p>
      </div>

      <table style="width:100%;font-size:14px;margin:0 0 16px;">
        <tr><td style="padding:4px 0;color:#5c6470;">${t.pickup}</td><td style="padding:4px 0;text-align:right;color:#22262e;font-weight:bold;">${BRANCH_LABELS[order.pickup_branch] ?? order.pickup_branch}</td></tr>
        <tr><td style="padding:4px 0;color:#5c6470;">${t.date}</td><td style="padding:4px 0;text-align:right;color:#22262e;font-weight:bold;">${order.pickup_date}</td></tr>
        ${order.flight_number ? `<tr><td style="padding:4px 0;color:#5c6470;">${t.flight}</td><td style="padding:4px 0;text-align:right;color:#22262e;font-weight:bold;">${escapeHtml(order.flight_number)}</td></tr>` : ''}
      </table>

      <p style="color:#0e1122;font-weight:bold;margin:20px 0 6px;">${t.items}</p>
      <table style="width:100%;font-size:14px;border-top:1px solid #dde3ea;">
        ${rows}
        <tr>
          <td style="padding:10px 0;border-top:2px solid #dde3ea;color:#0e1122;font-weight:bold;">${t.total}</td>
          <td style="padding:10px 0;border-top:2px solid #dde3ea;text-align:right;color:#0e1122;font-weight:bold;">${usd(order.total_usd)}</td>
        </tr>
      </table>

      <p style="margin:24px 0 0;"><a href="${siteUrl}/mi-orden" style="color:#2271b4;">${siteUrl.replace(/^https?:\/\//, '')}/mi-orden</a></p>
    </div>
    <p style="text-align:center;color:#5c6470;font-size:12px;margin:16px 0 0;">${t.footer}</p>
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return preflight();
  if (req.method !== 'POST') return fail('method_not_allowed', 405);

  try {
    const body = await readJson(req);
    const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!/^DF-[0-9A-F]{8}$/.test(code) || !email.includes('@')) return fail('invalid_request');

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const from = Deno.env.get('EMAIL_FROM');
    const siteUrl = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');
    if (!resendKey || !from) return fail('email_not_configured', 500);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, code, status, customer_name, customer_email, total_usd, pickup_branch, pickup_date, flight_number, lang')
      .eq('code', code)
      .eq('customer_email', email)
      .maybeSingle();

    if (orderError) return fail('lookup_failed', 500);
    if (!order) return fail('order_not_found', 404);
    if (!['pagada', 'preparando', 'lista_para_retirar'].includes(order.status)) {
      return fail('order_not_paid');
    }

    // Idempotencia: una sola confirmación por orden.
    const { data: shouldSend, error: markError } = await supabase.rpc('mark_email_sent', {
      p_order_id: order.id,
    });
    if (markError) return fail('lookup_failed', 500);
    if (!shouldSend) return ok({ skipped: 'already_sent' });

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('product_name, brand, variant_label, unit_price_usd, qty')
      .eq('order_id', order.id);
    if (itemsError) return fail('lookup_failed', 500);

    // QR con SOLO el código de orden (cero PII).
    const qrDataUrl: string = await QRCode.toDataURL(order.code, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const qrBase64 = qrDataUrl.split(',')[1];

    const t = COPY[(order.lang as Lang) ?? 'es'] ?? COPY.es;
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [order.customer_email],
        subject: t.subject(order.code),
        html: buildHtml(order as OrderRow, (items ?? []) as ItemRow[], siteUrl),
        attachments: [{ filename: `retiro-${order.code}.png`, content: qrBase64 }],
      }),
    });

    if (!resendResponse.ok) {
      console.error('Resend error', resendResponse.status);
      // Devuelve el "claim" de idempotencia para que un reintento
      // posterior (p.ej. webhook duplicado) pueda enviar el email.
      await supabase.from('orders').update({ confirmation_email_at: null }).eq('id', order.id);
      return fail('email_send_failed', 502);
    }

    return ok({ sent: true });
  } catch (err) {
    console.error('send-order-email unexpected', err instanceof Error ? err.message : err);
    return fail('internal_error', 500);
  }
});
