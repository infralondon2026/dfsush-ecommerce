// ============================================================
// mp-webhook — recibe notificaciones de pago de Mercado Pago.
//
// NUNCA se confía en el body de la notificación: solo se toma el
// id de pago y se consulta el estado real a la API de MP con el
// access token. Luego mp_apply_payment() (RPC service-role)
// aplica el resultado de forma atómica e idempotente:
//   approved            → orden pagada + email de confirmación
//   cancelled/expired/… → libera stock
// ============================================================

import { createClient } from 'npm:@supabase/supabase-js@2';
import { fail, ok, preflight, readJson } from '../_shared/http.ts';

const MP_API = 'https://api.mercadopago.com';

/** Extrae el id de pago de los formatos IPN (query) y Webhook (body). */
function extractPaymentId(url: URL, body: Record<string, unknown> | null): string | null {
  const topic = url.searchParams.get('topic') ?? url.searchParams.get('type') ?? '';
  const queryId = url.searchParams.get('id') ?? url.searchParams.get('data.id');
  if (topic && topic !== 'payment') return null;

  if (queryId && topic === 'payment') return queryId;

  if (body) {
    const type = typeof body.type === 'string' ? body.type : typeof body.topic === 'string' ? body.topic : '';
    if (type && type !== 'payment') return null;
    const data = body.data as Record<string, unknown> | undefined;
    const bodyId = data && typeof data.id !== 'undefined' ? String(data.id) : null;
    if (bodyId) return bodyId;
  }
  return queryId;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return preflight();

  try {
    const mpToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!mpToken) return fail('payment_not_configured', 500);

    const url = new URL(req.url);
    const body = req.method === 'POST' ? await readJson(req) : null;
    const paymentId = extractPaymentId(url, body);

    // Notificaciones que no son de pago se aceptan y se ignoran
    // (200 para que MP no reintente indefinidamente).
    if (!paymentId || !/^\d+$/.test(paymentId)) return ok({ ignored: true });

    // Validación contra la API de MP: la única fuente de verdad.
    const mpResponse = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` },
    });

    if (mpResponse.status === 404) return ok({ ignored: true });
    if (!mpResponse.ok) {
      console.error('MP payment fetch error', mpResponse.status);
      // 5xx para que MP reintente ante errores transitorios.
      return fail('gateway_error', 502);
    }

    const payment = (await mpResponse.json()) as {
      id?: number | string;
      status?: string;
      external_reference?: string;
      transaction_amount?: number;
      currency_id?: string;
      date_approved?: string;
    };

    const orderCode = (payment.external_reference ?? '').toUpperCase();
    if (!/^DF-[0-9A-F]{8}$/.test(orderCode) || !payment.status) {
      return ok({ ignored: true });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Subconjunto saneado del evento para auditoría (jamás el body crudo).
    const sanitizedRaw = {
      payment_id: String(payment.id ?? paymentId),
      status: payment.status,
      currency_id: payment.currency_id ?? null,
      date_approved: payment.date_approved ?? null,
    };

    const { data, error } = await supabase.rpc('mp_apply_payment', {
      p_code: orderCode,
      p_payment_id: String(payment.id ?? paymentId),
      p_status: payment.status,
      p_amount: payment.transaction_amount ?? null,
      p_raw: sanitizedRaw,
    });

    if (error) {
      console.error('mp_apply_payment error', error.message);
      return fail('apply_failed', 500);
    }

    const result = data as { ok: boolean; order_status?: string };

    // Orden recién pagada → disparar el email de confirmación con QR.
    if (result.ok && result.order_status === 'pagada' && payment.status === 'approved') {
      const { data: order } = await supabase
        .from('orders')
        .select('customer_email')
        .eq('code', orderCode)
        .maybeSingle();
      if (order) {
        // Fire-and-forget: el email no debe bloquear la respuesta al webhook.
        fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-order-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({ code: orderCode, email: order.customer_email }),
        }).catch((e) => console.error('send-order-email trigger failed', e?.message));
      }
    }

    return ok({ order_status: result.order_status ?? null });
  } catch (err) {
    console.error('mp-webhook unexpected', err instanceof Error ? err.message : err);
    return fail('internal_error', 500);
  }
});
