# DFSAS Tienda

E-commerce del **Duty Free Shop Atlántico Sur** (Ushuaia · Río Grande), London Supply Group.
A diferencia de una reserva, acá **se compra y se paga online** (Mercado Pago Checkout Pro) y
se retira en tienda o aeropuerto presentando un **código QR** + ticket de embarque.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + Vite + TypeScript (SPA, `vite.spa.config.ts` como único build) |
| Tests | Vitest (adapters, i18n, métricas) |
| Backend | Supabase: Postgres + RLS + RPCs `security definer` + Auth + Edge Functions |
| Pagos | Mercado Pago **Checkout Pro** (redirect; los datos de tarjeta nunca tocan este sistema) |
| Emails | Resend (confirmación de compra con QR adjunto) |
| CI/CD | GitHub Actions → GitHub Pages (`.github/workflows/deploy-pages.yml`) |

## Modos de funcionamiento

- **Demo** (`VITE_USE_DEMO_DATA=true` o sin credenciales de Supabase): catálogo estático,
  órdenes y stock en `localStorage`, checkout que simula un pago aprobado. No se envían
  emails ni se procesa ningún cobro. El panel `/equipo` requiere `VITE_ADMIN_DEMO_PASSWORD`
  (sin esa variable queda deshabilitado; no existe ninguna password por defecto).
- **Producción**: Supabase + Mercado Pago + Resend (pasos abajo).

## Desarrollo local

```bash
npm ci
cp .env.example .env   # completar; para demo alcanza con VITE_USE_DEMO_DATA=true
npm run dev            # http://localhost:5173
npm test               # suite de vitest
npm run build          # tsc --noEmit + build de producción (dist/)
```

El catálogo (seed, datos demo e imágenes SVG) se genera desde una única fuente de verdad:

```bash
node scripts/generate-catalog.mjs   # regenera supabase/seed.sql, src/store/demoCatalog.ts y public/img/**
```

### Imágenes

Las imágenes viven **self-hosted** en `public/img/` (nunca hotlinkeadas):

- **Fotos oficiales de producto** extraídas del sitio del Duty Free (activos de la empresa),
  descargadas por `scripts/download-images.mjs`.
- **Fotografía de stock** de Unsplash (licencia libre para uso comercial) para el resto de
  productos, categorías, hero y CTA. El crédito de cada foto queda en `public/img/CREDITS.md`.
- Si un producto no tiene foto (`<slug>.jpg`), el generador usa el **SVG de marca** como
  fallback automático.

> Para producción definitiva se recomienda reemplazar las fotos de stock por fotografía
> propia de producto del inventario real (mismo nombre de archivo y listo).

## Puesta en producción

### 1. Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, ejecutar `supabase/schema.sql` (re-ejecutable) y luego
   `supabase/seed.sql` (idempotente, `on conflict`).
3. Crear los usuarios del equipo en **Authentication → Users** y habilitarlos en la tabla
   `admin_users`:

   ```sql
   insert into public.admin_users (user_id, email, role, active)
   values ('<uuid del usuario de auth>', 'persona@londonsupply.com', 'admin', true);
   ```

4. La seguridad queda garantizada por RLS: el público solo lee catálogo activo; las órdenes
   solo se consultan vía `get_order(code, email)`; los totales y el stock se validan
   **siempre** en la base (`create_order` con `FOR UPDATE`).

### 2. Edge Functions

```bash
supabase functions deploy create-payment
supabase functions deploy mp-webhook --no-verify-jwt   # MP llama sin JWT
supabase functions deploy send-order-email

supabase secrets set \
  MP_ACCESS_TOKEN='<access token PRIVADO de MP>' \
  MP_CURRENCY_ID='ARS' \
  RESEND_API_KEY='<api key de Resend>' \
  EMAIL_FROM='DFSAS Tienda <tienda@sudominio.com>' \
  SITE_URL='https://infralondon2026.github.io/dfsush-ecommerce'
```

> ⚠️ `MP_ACCESS_TOKEN` vive **solo** como secret de edge functions. Jamás en el frontend,
> jamás en el repo (que es público).

> 💱 `MP_CURRENCY_ID`: las cuentas de Mercado Pago Argentina procesan en **ARS**. Los
> precios del catálogo están en USD; si la cuenta es argentina hay que definir la
> estrategia de conversión (precio en ARS en la preferencia) antes de salir a producción.

### 3. Mercado Pago

1. Crear la aplicación en el [panel de desarrolladores de MP](https://www.mercadopago.com.ar/developers)
   y usar las credenciales de **prueba** hasta validar el flujo.
2. `create-payment` ya envía `notification_url` apuntando a
   `https://<ref>.supabase.co/functions/v1/mp-webhook`; opcionalmente configurarla también
   en el panel de MP (Webhooks → pagos).
3. El webhook **no confía** en el body recibido: consulta el pago real a la API de MP y
   aplica el resultado vía RPC atómico (`mp_apply_payment`), idempotente ante reintentos.
4. Órdenes pendientes expiran a los **60 minutos** liberando stock (lazy + al crear órdenes
   y pagos). Un pago `approved` marca la orden `pagada`; `cancelled/expired` libera stock;
   `rejected` queda registrado y la orden sigue pendiente para reintentar hasta expirar.

### 4. Resend

1. Verificar el dominio remitente en [resend.com](https://resend.com).
2. `send-order-email` envía la confirmación en el idioma de la orden con el QR adjunto
   (el QR codifica **solo** el código de orden, sin PII) y es idempotente por orden.

### 5. GitHub Pages

1. Repo (público): **infralondon2026/dfsush-ecommerce** — si cambia el nombre, actualizar
   `REPO_NAME` en `vite.spa.config.ts`.
2. En **Settings → Pages**, elegir *Source: GitHub Actions*.
3. En **Settings → Secrets and variables → Actions → Variables**, definir:
   - `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (claves públicas; RLS protege los datos)
   - `VITE_USE_DEMO_DATA` = `false` (o `true` para publicar la demo)
   - `VITE_ADMIN_DEMO_PASSWORD` solo si se publica la demo con panel habilitado
4. Push a `main`: el workflow corre `npm ci` → tests → build → deploy. El build copia
   `index.html` a `404.html` (fallback SPA) y usa `base=/dfsas-tienda/` con el basename
   del router derivado de `BASE_URL`.

## Seguridad e higiene

- Repo público: `.gitignore` bloquea `.env*`, `*.docx`, `*.pdf`, `*.xlsx`. Todas las
  variables están documentadas en `.env.example`.
- El frontend nunca calcula precios: `create_order` toma los precios de `product_variants`
  y valida stock bajo lock; el carrito solo envía `variant_id + qty`.
- Edge functions: CORS, `try/catch` de JSON, validación de campos y respuestas saneadas
  (`{ok:true|false}`, nunca el body crudo del proveedor).
- Auditoría en `audit_log` (creación de órdenes, webhooks, cambios de estado y stock).
- Los textos de franquicias aduaneras en `/legales` son **placeholder — PARA REVISIÓN
  LEGAL** antes de publicar.

## Estructura

```
scripts/            catalog-data.mjs (fuente de verdad) + generate-catalog.mjs
public/img/         logo + SVGs self-hosted (productos, categorías)
src/
  i18n.ts           TODOS los textos ES/PT/EN (cero ternarios de locale inline)
  types.ts          dominio compartido
  store/            StoreAdapter + demoAdapter + supabaseAdapter (+ tests)
  context/          LangContext, CartContext (carrito persistente)
  components/       UI (un componente por archivo) + admin/
  pages/            Home, Catálogo, Producto, Carrito, Checkout, resultado de pago,
                    Mi orden, Legales, /equipo
supabase/
  schema.sql        tablas + RLS + RPCs (create_order, get_order, release_order_stock…)
  seed.sql          catálogo idempotente (generado)
  functions/        create-payment, mp-webhook, send-order-email
```
