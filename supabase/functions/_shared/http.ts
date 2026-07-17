// ============================================================
// Helpers compartidos por las edge functions: CORS, parseo JSON
// defensivo y respuestas saneadas ({ ok: boolean, ... } SIEMPRE;
// nunca se reenvía el body crudo de un proveedor externo).
// ============================================================

export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

export function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function ok(extra: Record<string, unknown> = {}): Response {
  return json({ ok: true, ...extra });
}

export function fail(error: string, status = 400): Response {
  return json({ ok: false, error }, status);
}

export function preflight(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}

/** Lee el body como JSON sin explotar ante cuerpos vacíos o inválidos. */
export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text();
    if (!text) return null;
    const parsed = JSON.parse(text);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
