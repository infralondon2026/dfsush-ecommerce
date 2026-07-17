// ============================================================
// create-payment — crea la preferencia de Mercado Pago
// (Checkout Pro, redirect) para una orden pendiente de pago.
//
// El frontend NUNCA ve MP_ACCESS_TOKEN ni datos de tarjeta:
// el pago completo ocurre en la plataforma de Mercado Pago.
//
// Secrets requeridos (supabase secrets set):
//   MP_ACCESS_TOKEN  — access token privado de MP
//   SITE_URL         — URL pública del sitio (back_urls)
// Opcional:
//   MP_CURRENCY_ID   — default 'USD' (cuentas AR: 'ARS', ver README)
// ============================================================

import { createClient } from 'npm:@supabase/supabase-js@2';
import { fail, ok, preflight, readJson } from '../_shared/http.ts';

const MP_API = 'https://api.mercadopago.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return preflight();
  if (req.method !== 'POST') return fail('method_not_allowed', 405);

  try {
    const body = await readJson(req);
    const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!/^DF-[0-9A-F]{8}$/.test(code) || !email.includes('@')) {
      return fail('invalid_request');
    }

    const mpToken = Deno.env.get('MP_ACCESS_TOKEN');
    const siteUrl = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');
    if (!mpToken || !siteUrl) return fail('payment_not_configured', 500);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Libera reservas vencidas antes de validar la orden.
    await supabase.rpc('expire_stale_orders');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, code, status, total_usd, expires_at, customer_email, lang')
      .eq('code', code)
      .eq('customer_email', email)
      .maybeSingle();

    if (orderError) return fail('lookup_failed', 500);
    if (!order) return fail('order_not_found', 404);
    if (order.status !== 'pendiente_pago') return fail('order_not_payable');
    if (new Date(order.expires_at).getTime() <= Date.now()) return fail('order_expired');

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('product_name, brand, variant_label, unit_price_usd, qty')
      .eq('order_id', order.id);
    if (itemsError || !items?.length) return fail('order_items_missing', 500);

    const currency = Deno.env.get('MP_CURRENCY_ID') ?? 'USD';
    const preferencePayload = {
      external_reference: order.code,
      items: items.map((item) => ({
        title: `${item.brand} ${item.product_name}${item.variant_label ? ` (${item.variant_label})` : ''}`.slice(0, 250),
        quantity: item.qty,
        unit_price: Number(item.unit_price_usd),
        currency_id: currency,
      })),
      back_urls: {
        success: `${siteUrl}/compra/exito?code=${order.code}`,
        failure: `${siteUrl}/compra/fallo?code=${order.code}`,
        pending: `${siteUrl}/compra/pendiente?code=${order.code}`,
      },
      auto_return: 'approved',
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mp-webhook`,
      expires: true,
      expiration_date_to: order.expires_at,
      metadata: { order_code: order.code },
    };

    const mpResponse = await fetch(`${MP_API}/checkout/preferences`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mpToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferencePayload),
    });

    if (!mpResponse.ok) {
      // Nunca reenviar el body del proveedor al cliente.
      console.error('MP preference error', mpResponse.status);
      return fail('gateway_error', 502);
    }

    const preference = (await mpResponse.json()) as { id?: string; init_point?: string };
    if (!preference.init_point) return fail('gateway_error', 502);

    // Registro del evento con un subconjunto saneado.
    await supabase.from('payments').insert({
      order_id: order.id,
      provider: 'mercadopago',
      external_id: preference.id ?? null,
      event_type: 'preference_created',
      status: 'created',
      amount_usd: order.total_usd,
      raw: { preference_id: preference.id ?? null },
    });

    return ok({ url: preference.init_point });
  } catch (err) {
    console.error('create-payment unexpected', err instanceof Error ? err.message : err);
    return fail('internal_error', 500);
  }
});
