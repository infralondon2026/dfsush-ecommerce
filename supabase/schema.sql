-- ============================================================
-- DFSAS Tienda — esquema de base de datos (Supabase / Postgres)
--
-- Principios:
--  * RLS habilitado en TODAS las tablas.
--  * Catálogo público de solo lectura (solo filas activas).
--  * Órdenes/pagos visibles únicamente para admins; el público
--    accede solo vía RPC get_order(code, email).
--  * RPCs transaccionales SECURITY DEFINER con search_path=public.
--  * El total SIEMPRE se calcula acá, nunca se confía en el front.
--  * Códigos de orden con md5(gen_random_uuid()::text): pgcrypto
--    (gen_random_bytes) queda fuera del search_path en Supabase.
--  * Fechas de negocio en zona America/Argentina/Ushuaia (-03).
--
-- Re-ejecutable: usa IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.
-- ============================================================

-- ------------------------------------------------------------
-- Tablas
-- ------------------------------------------------------------

create table if not exists public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name_es text not null,
  name_pt text not null,
  name_en text not null,
  image text not null default '',
  sort integer not null default 0,
  active boolean not null default true
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id bigint not null references public.categories (id),
  brand text not null default '',
  name text not null,
  desc_es text not null default '',
  desc_pt text not null default '',
  desc_en text not null default '',
  image text not null default '',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique,
  label text not null default '',
  price_usd numeric(10, 2) not null check (price_usd >= 0),
  active boolean not null default true
);

create table if not exists public.inventory (
  variant_id uuid primary key references public.product_variants (id) on delete cascade,
  qty integer not null default 0 check (qty >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status text not null default 'pendiente_pago' check (
    status in ('pendiente_pago', 'pagada', 'preparando', 'lista_para_retirar',
               'entregada', 'cancelada', 'expirada')
  ),
  total_usd numeric(10, 2) not null default 0 check (total_usd >= 0),
  payment_id text,
  pickup_branch text not null check (
    pickup_branch in ('ushuaia_san_martin', 'ushuaia_aeropuerto',
                      'rio_grande_rosales', 'rio_grande_aeropuerto')
  ),
  pickup_date date not null,
  flight_number text,
  lang text not null default 'es' check (lang in ('es', 'pt', 'en')),
  stock_released boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  paid_at timestamptz,
  delivered_at timestamptz,
  confirmation_email_at timestamptz
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_email_idx on public.orders (customer_email);
create index if not exists orders_created_idx on public.orders (created_at desc);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id),
  -- Snapshot del producto al momento de la compra:
  product_name text not null,
  brand text not null default '',
  variant_label text not null default '',
  sku text not null,
  unit_price_usd numeric(10, 2) not null check (unit_price_usd >= 0),
  qty integer not null check (qty > 0 and qty <= 99)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.payments (
  id bigint generated always as identity primary key,
  order_id uuid references public.orders (id) on delete set null,
  provider text not null default 'mercadopago',
  external_id text,
  event_type text not null,
  status text,
  amount_usd numeric(12, 2),
  raw jsonb, -- subconjunto saneado del evento del gateway, nunca el body crudo completo
  created_at timestamptz not null default now()
);

create index if not exists payments_order_idx on public.payments (order_id);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor uuid,
  actor_email text,
  action text not null,
  entity text,
  entity_id text,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- is_admin(): rol activo en admin_users (SECURITY DEFINER evita
-- recursión de RLS al leer admin_users desde las policies).
-- ------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from admin_users
    where user_id = auth.uid()
      and active
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.admin_users enable row level security;
alter table public.audit_log enable row level security;

-- Catálogo: lectura pública SOLO de filas activas; admins ven todo.
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select using (active or is_admin());

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (active or is_admin());

drop policy if exists variants_public_read on public.product_variants;
create policy variants_public_read on public.product_variants
  for select using (active or is_admin());

-- Stock visible públicamente (la tienda muestra disponibilidad).
drop policy if exists inventory_public_read on public.inventory;
create policy inventory_public_read on public.inventory
  for select using (true);

-- Órdenes / items / pagos: solo admins. El público consulta vía get_order().
drop policy if exists orders_admin_read on public.orders;
create policy orders_admin_read on public.orders
  for select using (is_admin());

drop policy if exists order_items_admin_read on public.order_items;
create policy order_items_admin_read on public.order_items
  for select using (is_admin());

drop policy if exists payments_admin_read on public.payments;
create policy payments_admin_read on public.payments
  for select using (is_admin());

-- Cada admin puede leer su propia fila (verificación de rol al iniciar sesión).
drop policy if exists admin_users_self_read on public.admin_users;
create policy admin_users_self_read on public.admin_users
  for select using (user_id = auth.uid());

drop policy if exists audit_log_admin_read on public.audit_log;
create policy audit_log_admin_read on public.audit_log
  for select using (is_admin());

-- Nota: no hay policies de INSERT/UPDATE/DELETE para roles públicos.
-- Toda escritura pasa por RPCs SECURITY DEFINER o por el service role
-- (edge functions), que no está sujeto a RLS.

-- ------------------------------------------------------------
-- _release_order_stock(): núcleo interno de liberación de stock.
-- Idempotente: usa orders.stock_released para no devolver dos veces.
-- Sin grants: solo lo invocan otras funciones DEFINER.
-- ------------------------------------------------------------

create or replace function public._release_order_stock(p_order_id uuid, p_new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  r record;
begin
  if p_new_status not in ('cancelada', 'expirada') then
    raise exception 'invalid_status';
  end if;

  select * into v_order from orders where id = p_order_id for update;
  if not found then
    raise exception 'order_not_found';
  end if;

  -- Idempotencia: si ya está en un estado final liberado, no hace nada.
  if v_order.status in ('cancelada', 'expirada') then
    return;
  end if;
  if v_order.status = 'entregada' then
    raise exception 'invalid_transition';
  end if;

  if not v_order.stock_released then
    for r in
      select variant_id, qty
      from order_items
      where order_id = p_order_id and variant_id is not null
      order by variant_id
    loop
      update inventory
      set qty = qty + r.qty, updated_at = now()
      where variant_id = r.variant_id;
    end loop;
  end if;

  update orders
  set status = p_new_status, stock_released = true
  where id = p_order_id;
end;
$$;

revoke all on function public._release_order_stock(uuid, text) from public;

-- ------------------------------------------------------------
-- expire_stale_orders(): expira órdenes pendientes vencidas
-- (60 minutos) liberando stock. Idempotente.
-- ------------------------------------------------------------

create or replace function public.expire_stale_orders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  r record;
begin
  for r in
    select id
    from orders
    where status = 'pendiente_pago'
      and expires_at <= now()
    order by id
    for update skip locked
  loop
    perform _release_order_stock(r.id, 'expirada');
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

revoke all on function public.expire_stale_orders() from public;
grant execute on function public.expire_stale_orders() to service_role;

-- ------------------------------------------------------------
-- create_order(): valida stock con FOR UPDATE, descuenta,
-- calcula el total desde la base y genera el código.
-- ------------------------------------------------------------

create or replace function public.create_order(
  p_customer jsonb,
  p_items jsonb,
  p_pickup jsonb,
  p_lang text default 'es'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := trim(coalesce(p_customer ->> 'name', ''));
  v_email text := lower(trim(coalesce(p_customer ->> 'email', '')));
  v_phone text := nullif(trim(coalesce(p_customer ->> 'phone', '')), '');
  v_branch text := p_pickup ->> 'branch';
  v_flight text := nullif(trim(coalesce(p_pickup ->> 'flight_number', '')), '');
  v_lang text := case when p_lang in ('es', 'pt', 'en') then p_lang else 'es' end;
  -- "Hoy" en Ushuaia, NUNCA current_date (que es UTC):
  v_today date := (now() at time zone 'America/Argentina/Ushuaia')::date;
  v_date date;
  v_expires timestamptz := now() + interval '60 minutes';
  v_order_id uuid;
  v_code text;
  v_total numeric(10, 2) := 0;
  v_qty integer;
  v_lines integer := 0;
  v_variant record;
begin
  -- Primero, liberar reservas vencidas para que ese stock cuente.
  perform expire_stale_orders();

  -- Validaciones de entrada.
  if v_name = '' or char_length(v_name) > 120 then
    raise exception 'invalid_customer';
  end if;
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or char_length(v_email) > 200 then
    raise exception 'invalid_email';
  end if;
  if v_branch is null or v_branch not in
     ('ushuaia_san_martin', 'ushuaia_aeropuerto', 'rio_grande_rosales', 'rio_grande_aeropuerto') then
    raise exception 'invalid_branch';
  end if;
  begin
    v_date := (p_pickup ->> 'date')::date;
  exception when others then
    raise exception 'invalid_date';
  end;
  if v_date is null or v_date < v_today or v_date > v_today + 30 then
    raise exception 'invalid_date';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'invalid_items';
  end if;

  -- Código único legible (md5 sobre uuid: pgcrypto no está en el search_path).
  v_code := 'DF-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));

  insert into orders (code, customer_name, customer_email, customer_phone,
                      pickup_branch, pickup_date, flight_number, lang, expires_at)
  values (v_code, v_name, v_email, v_phone, v_branch, v_date, v_flight, v_lang, v_expires)
  returning id into v_order_id;

  -- Agrupa por variante (suma cantidades duplicadas) y bloquea el
  -- inventario en orden estable de ids para evitar deadlocks.
  for v_variant in
    select pv.id, pv.sku, pv.label, pv.price_usd,
           p.name as product_name, p.brand,
           i.qty as stock, x.wanted
    from (
      select (e ->> 'variant_id')::uuid as variant_id,
             sum((e ->> 'qty')::int) as wanted
      from jsonb_array_elements(p_items) e
      group by 1
    ) x
    join product_variants pv on pv.id = x.variant_id and pv.active
    join products p on p.id = pv.product_id and p.active
    join inventory i on i.variant_id = pv.id
    order by pv.id
    for update of i
  loop
    v_lines := v_lines + 1;
    v_qty := v_variant.wanted;
    if v_qty is null or v_qty < 1 or v_qty > 99 then
      raise exception 'invalid_qty';
    end if;
    if v_variant.stock < v_qty then
      raise exception 'insufficient_stock:%', v_variant.sku;
    end if;

    update inventory
    set qty = qty - v_qty, updated_at = now()
    where variant_id = v_variant.id;

    insert into order_items (order_id, variant_id, product_name, brand,
                             variant_label, sku, unit_price_usd, qty)
    values (v_order_id, v_variant.id, v_variant.product_name, v_variant.brand,
            v_variant.label, v_variant.sku, v_variant.price_usd, v_qty);

    -- El precio sale de product_variants: el total lo fija la base.
    v_total := v_total + v_variant.price_usd * v_qty;
  end loop;

  -- Si algún variant_id no existe o está inactivo, el join lo omitió.
  if v_lines <> (
    select count(distinct e ->> 'variant_id') from jsonb_array_elements(p_items) e
  ) then
    raise exception 'variant_not_found';
  end if;

  update orders set total_usd = v_total where id = v_order_id;

  insert into audit_log (actor_email, action, entity, entity_id, detail)
  values (v_email, 'create_order', 'orders', v_order_id::text,
          jsonb_build_object('code', v_code, 'total_usd', v_total));

  return jsonb_build_object('code', v_code, 'total_usd', v_total, 'expires_at', v_expires);
end;
$$;

revoke all on function public.create_order(jsonb, jsonb, jsonb, text) from public;
grant execute on function public.create_order(jsonb, jsonb, jsonb, text) to anon, authenticated;

-- ------------------------------------------------------------
-- get_order(code, email): consulta pública de una orden propia.
-- Aplica expiración lazy antes de responder.
-- ------------------------------------------------------------

create or replace function public.get_order(p_code text, p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
begin
  select * into v_order
  from orders
  where code = upper(trim(coalesce(p_code, '')))
    and customer_email = lower(trim(coalesce(p_email, '')));

  if not found then
    return null;
  end if;

  -- Expiración lazy: si venció el plazo de pago, liberar y reflejarlo.
  if v_order.status = 'pendiente_pago' and v_order.expires_at <= now() then
    perform _release_order_stock(v_order.id, 'expirada');
    select * into v_order from orders where id = v_order.id;
  end if;

  return jsonb_build_object(
    'id', v_order.id,
    'code', v_order.code,
    'status', v_order.status,
    'customer_name', v_order.customer_name,
    'customer_email', v_order.customer_email,
    'customer_phone', v_order.customer_phone,
    'total_usd', v_order.total_usd,
    'payment_id', v_order.payment_id,
    'pickup_branch', v_order.pickup_branch,
    'pickup_date', v_order.pickup_date,
    'flight_number', v_order.flight_number,
    'lang', v_order.lang,
    'created_at', v_order.created_at,
    'expires_at', v_order.expires_at,
    'paid_at', v_order.paid_at,
    'items', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'product_name', oi.product_name,
            'brand', oi.brand,
            'variant_label', oi.variant_label,
            'sku', oi.sku,
            'unit_price_usd', oi.unit_price_usd,
            'qty', oi.qty
          ) order by oi.id
        ),
        '[]'::jsonb
      )
      from order_items oi
      where oi.order_id = v_order.id
    )
  );
end;
$$;

revoke all on function public.get_order(text, text) from public;
grant execute on function public.get_order(text, text) to anon, authenticated;

-- ------------------------------------------------------------
-- release_order_stock(): cancela una orden liberando su stock.
-- Idempotente; SOLO admins (is_admin()).
-- ------------------------------------------------------------

create or replace function public.release_order_stock(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  if not is_admin() then
    raise exception 'not_authorized';
  end if;

  perform _release_order_stock(p_order_id, 'cancelada');

  select email into v_email from admin_users where user_id = auth.uid();
  insert into audit_log (actor, actor_email, action, entity, entity_id)
  values (auth.uid(), v_email, 'release_order_stock', 'orders', p_order_id::text);
end;
$$;

revoke all on function public.release_order_stock(uuid) from public;
grant execute on function public.release_order_stock(uuid) to authenticated;

-- ------------------------------------------------------------
-- admin_set_order_status(): transiciones operativas del panel.
-- ------------------------------------------------------------

create or replace function public.admin_set_order_status(p_order_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  v_email text;
  v_ok boolean := false;
begin
  if not is_admin() then
    raise exception 'not_authorized';
  end if;

  select * into v_order from orders where id = p_order_id for update;
  if not found then
    raise exception 'order_not_found';
  end if;

  -- Cancelaciones van por release_order_stock().
  v_ok := (v_order.status = 'pagada' and p_status = 'preparando')
       or (v_order.status = 'preparando' and p_status = 'lista_para_retirar')
       or (v_order.status = 'lista_para_retirar' and p_status = 'entregada');
  if not v_ok then
    raise exception 'invalid_transition';
  end if;

  update orders
  set status = p_status,
      delivered_at = case when p_status = 'entregada' then now() else delivered_at end
  where id = p_order_id;

  select email into v_email from admin_users where user_id = auth.uid();
  insert into audit_log (actor, actor_email, action, entity, entity_id, detail)
  values (auth.uid(), v_email, 'set_order_status', 'orders', p_order_id::text,
          jsonb_build_object('from', v_order.status, 'to', p_status));
end;
$$;

revoke all on function public.admin_set_order_status(uuid, text) from public;
grant execute on function public.admin_set_order_status(uuid, text) to authenticated;

-- ------------------------------------------------------------
-- admin_adjust_stock(): ajuste manual con piso en cero.
-- ------------------------------------------------------------

create or replace function public.admin_adjust_stock(p_variant_id uuid, p_delta integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_qty integer;
  v_email text;
begin
  if not is_admin() then
    raise exception 'not_authorized';
  end if;
  if p_delta is null or abs(p_delta) > 1000 then
    raise exception 'invalid_delta';
  end if;

  update inventory
  set qty = greatest(0, qty + p_delta), updated_at = now()
  where variant_id = p_variant_id
  returning qty into v_qty;

  if not found then
    raise exception 'variant_not_found';
  end if;

  select email into v_email from admin_users where user_id = auth.uid();
  insert into audit_log (actor, actor_email, action, entity, entity_id, detail)
  values (auth.uid(), v_email, 'adjust_stock', 'inventory', p_variant_id::text,
          jsonb_build_object('delta', p_delta, 'result_qty', v_qty));

  return v_qty;
end;
$$;

revoke all on function public.admin_adjust_stock(uuid, integer) from public;
grant execute on function public.admin_adjust_stock(uuid, integer) to authenticated;

-- ------------------------------------------------------------
-- mp_apply_payment(): aplica una notificación de Mercado Pago ya
-- VALIDADA contra la API de MP por la edge function mp-webhook.
-- Solo service_role. Atómica e idempotente.
--   * approved  → orden pagada (si estaba pendiente).
--   * cancelled/expired → libera stock (cancelada/expirada).
--   * rejected  → se registra el evento; la orden sigue pendiente
--     para permitir reintentos hasta que venza la reserva (60').
-- ------------------------------------------------------------

create or replace function public.mp_apply_payment(
  p_code text,
  p_payment_id text,
  p_status text,
  p_amount numeric,
  p_raw jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
begin
  select * into v_order
  from orders
  where code = upper(trim(coalesce(p_code, '')))
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'order_not_found');
  end if;

  insert into payments (order_id, provider, external_id, event_type, status, amount_usd, raw)
  values (v_order.id, 'mercadopago', p_payment_id, 'payment_webhook', p_status, p_amount, p_raw);

  if p_status = 'approved' then
    if v_order.status = 'pendiente_pago' then
      update orders
      set status = 'pagada', payment_id = p_payment_id, paid_at = now()
      where id = v_order.id;
    end if;
    -- Si ya estaba pagada (webhook duplicado) no se toca nada: idempotente.
  elsif p_status in ('cancelled', 'expired', 'charged_back', 'refunded') then
    if v_order.status = 'pendiente_pago' then
      perform _release_order_stock(v_order.id, case when p_status = 'expired' then 'expirada' else 'cancelada' end);
    end if;
  end if;
  -- 'rejected' / 'in_process' / otros: solo queda registrado en payments.

  select * into v_order from orders where id = v_order.id;
  insert into audit_log (action, entity, entity_id, detail)
  values ('mp_apply_payment', 'orders', v_order.id::text,
          jsonb_build_object('payment_id', p_payment_id, 'mp_status', p_status, 'order_status', v_order.status));

  return jsonb_build_object('ok', true, 'order_status', v_order.status);
end;
$$;

revoke all on function public.mp_apply_payment(text, text, text, numeric, jsonb) from public;
grant execute on function public.mp_apply_payment(text, text, text, numeric, jsonb) to service_role;

-- ------------------------------------------------------------
-- mark_email_sent(): marca la confirmación enviada (edge function
-- send-order-email, service_role). Devuelve false si ya se envió.
-- ------------------------------------------------------------

create or replace function public.mark_email_sent(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated boolean := false;
begin
  update orders
  set confirmation_email_at = now()
  where id = p_order_id
    and confirmation_email_at is null
  returning true into v_updated;
  return coalesce(v_updated, false);
end;
$$;

revoke all on function public.mark_email_sent(uuid) from public;
grant execute on function public.mark_email_sent(uuid) to service_role;
