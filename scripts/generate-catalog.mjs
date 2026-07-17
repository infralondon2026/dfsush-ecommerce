// ============================================================
// Genera, a partir de scripts/catalog-data.mjs:
//   - supabase/seed.sql          (idempotente, on conflict)
//   - src/store/demoCatalog.ts   (datos del adapter demo)
//   - public/img/products/*.svg  (imágenes self-hosted)
//   - public/img/categories/*.svg
// Uso: node scripts/generate-catalog.mjs
// ============================================================

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, products } from './catalog-data.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Si hay foto real descargada (scripts/download-images.mjs) se usa esa;
// si no, queda el SVG generado como fallback.
function productImage(slug) {
  return existsSync(resolve(root, `public/img/products/${slug}.jpg`))
    ? `img/products/${slug}.jpg`
    : `img/products/${slug}.svg`;
}

function categoryImage(slug) {
  return existsSync(resolve(root, `public/img/categories/${slug}.jpg`))
    ? `img/categories/${slug}.jpg`
    : `img/categories/${slug}.svg`;
}

// ---------------------------------------------------------------
// Iconos SVG (viewBox 0 0 100 100, silueta blanca)
// ---------------------------------------------------------------
const ICONS = {
  bottle: `<path d="M42 6h16v6l-3 4v12c9 4 14 12 14 22v36a8 8 0 0 1-8 8H39a8 8 0 0 1-8-8V50c0-10 5-18 14-22V16l-3-4z"/>`,
  wine: `<path d="M46 4h8v24c7 3 11 9 11 17v43a6 6 0 0 1-6 6H41a6 6 0 0 1-6-6V45c0-8 4-14 11-17z"/>`,
  sparkling: `<path d="M44 4h12v12H44z"/><path d="M46 20h8v8c7 3 11 9 11 17v43a6 6 0 0 1-6 6H41a6 6 0 0 1-6-6V45c0-8 4-14 11-17z"/>`,
  perfume: `<path d="M40 4h20v12H40z"/><path d="M34 22h32a8 8 0 0 1 8 8v44a12 12 0 0 1-12 12H38a12 12 0 0 1-12-12V30a8 8 0 0 1 8-8z"/>`,
  lipstick: `<path d="M42 10h16l4 12v22H38V22z" opacity=".95"/><path d="M34 50h32v34a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z"/>`,
  cream: `<path d="M28 24h44v10H28z"/><path d="M30 40h40a6 6 0 0 1 6 6v32a12 12 0 0 1-12 12H36a12 12 0 0 1-12-12V46a6 6 0 0 1 6-6z"/>`,
  earbuds: `<path d="M31 14a15 15 0 0 1 15 15c0 7-4 10-8 12v37a7 7 0 0 1-14 0V41c-4-2-8-5-8-12a15 15 0 0 1 15-15z"/><path d="M69 14a15 15 0 0 1 15 15c0 7-4 10-8 12v37a7 7 0 0 1-14 0V41c-4-2-8-5-8-12a15 15 0 0 1 15-15z"/>`,
  keyboard: `<path d="M10 28h80a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V36a8 8 0 0 1 8-8z"/><g fill="#00000030"><rect x="12" y="38" width="10" height="8" rx="2"/><rect x="26" y="38" width="10" height="8" rx="2"/><rect x="40" y="38" width="10" height="8" rx="2"/><rect x="54" y="38" width="10" height="8" rx="2"/><rect x="68" y="38" width="10" height="8" rx="2"/><rect x="82" y="38" width="6" height="8" rx="2"/><rect x="24" y="52" width="46" height="10" rx="2"/></g>`,
  speaker: `<path d="M50 4a27 27 0 0 1 27 27v38a27 27 0 0 1-54 0V31A27 27 0 0 1 50 4z"/><circle cx="50" cy="62" r="15" fill="#00000030"/><circle cx="50" cy="30" r="8" fill="#00000030"/>`,
  powerbank: `<rect x="30" y="8" width="40" height="84" rx="10"/><path d="M56 26 40 56h9l-5 20 17-30h-10z" fill="#00000035"/>`,
  headphones: `<path d="M50 10a35 35 0 0 0-35 35v28h8V45a27 27 0 0 1 54 0v28h8V45a35 35 0 0 0-35-35z"/><path d="M15 56h10a5 5 0 0 1 5 5v24a5 5 0 0 1-5 5h-2a8 8 0 0 1-8-8z"/><path d="M85 56H75a5 5 0 0 0-5 5v24a5 5 0 0 0 5 5h2a8 8 0 0 0 8-8z"/>`,
  console: `<rect x="6" y="26" width="88" height="48" rx="14"/><g fill="#00000030"><circle cx="26" cy="50" r="10"/><circle cx="70" cy="43" r="5"/><circle cx="82" cy="55" r="5"/></g>`,
  chocolate: `<rect x="16" y="20" width="68" height="60" rx="6"/><g fill="#00000030"><rect x="24" y="28" width="24" height="20" rx="2"/><rect x="52" y="28" width="24" height="20" rx="2"/><rect x="24" y="52" width="24" height="20" rx="2"/><rect x="52" y="52" width="24" height="20" rx="2"/></g>`,
  candybox: `<path d="M18 36h64l6 12v34a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V48z"/><path d="M44 14c6-6 16-4 18 3 2-7 12-9 18-3 5 6 1 16-8 18l-10 4-10-4c-9-2-13-12-8-18z" opacity=".9"/>`,
  tea: `<path d="M16 34h54v24a24 24 0 0 1-24 24h-6a24 24 0 0 1-24-24z"/><path d="M70 40h8a12 12 0 0 1 0 24h-8v-8h8a4 4 0 0 0 0-8h-8z"/><rect x="16" y="88" width="54" height="6" rx="3"/>`,
  brick: `<path d="M16 38h68v42a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6z"/><rect x="22" y="26" width="14" height="12" rx="3"/><rect x="43" y="26" width="14" height="12" rx="3"/><rect x="64" y="26" width="14" height="12" rx="3"/>`,
  toycar: `<path d="M20 52l8-18a8 8 0 0 1 7-5h30a8 8 0 0 1 7 5l8 18v18a4 4 0 0 1-4 4h-6a10 10 0 0 1-20 0H50a10 10 0 0 1-20 0h-6a4 4 0 0 1-4-4z"/><circle cx="40" cy="74" r="7" fill="#00000035"/><circle cx="70" cy="74" r="7" fill="#00000035"/>`,
  cards: `<rect x="18" y="18" width="42" height="60" rx="6" transform="rotate(-8 39 48)"/><rect x="42" y="24" width="42" height="60" rx="6" transform="rotate(8 63 54)" opacity=".85"/>`,
  teddy: `<circle cx="30" cy="24" r="10"/><circle cx="70" cy="24" r="10"/><circle cx="50" cy="38" r="20"/><ellipse cx="50" cy="72" rx="24" ry="20"/><circle cx="24" cy="66" r="8"/><circle cx="76" cy="66" r="8"/>`,
  cube: `<rect x="16" y="16" width="68" height="68" rx="8"/><g fill="#00000030"><rect x="24" y="24" width="16" height="16" rx="3"/><rect x="42" y="24" width="16" height="16" rx="3"/><rect x="60" y="24" width="16" height="16" rx="3"/><rect x="24" y="42" width="16" height="16" rx="3"/><rect x="60" y="42" width="16" height="16" rx="3"/><rect x="24" y="60" width="16" height="16" rx="3"/><rect x="42" y="60" width="16" height="16" rx="3"/></g>`,
  sunglasses: `<path d="M6 34h88v8h-6l-4 20a12 12 0 0 1-12 10H62a12 12 0 0 1-12-10l-2-10h-6l-2 10a12 12 0 0 1-12 10H18a12 12 0 0 1-12-10L2 42z" transform="translate(2 6)"/>`,
  watch: `<rect x="36" y="4" width="28" height="18" rx="4"/><rect x="36" y="78" width="28" height="18" rx="4"/><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="21" fill="#00000030"/><path d="M50 36v14l10 8" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  wallet: `<path d="M12 26h70a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8z"/><path d="M12 26a8 8 0 0 1 8-8h52v8z" opacity=".85"/><rect x="62" y="46" width="28" height="16" rx="5" fill="#00000035"/><circle cx="74" cy="54" r="4"/>`,
  scarf: `<path d="M24 12h52c-4 20-4 36 0 56l-10 20-8-18c-3-20-3-38 0-58z" transform="rotate(14 50 50)"/><path d="M20 24c14 6 44 6 58 0" stroke="#00000035" stroke-width="5" fill="none"/>`,
  suitcase: `<rect x="24" y="22" width="52" height="64" rx="10"/><path d="M38 22v-6a8 8 0 0 1 8-8h8a8 8 0 0 1 8 8v6h-8v-6h-8v6z"/><rect x="34" y="86" width="8" height="10" rx="3"/><rect x="58" y="86" width="8" height="10" rx="3"/><path d="M36 32v44M50 32v44M64 32v44" stroke="#00000030" stroke-width="5"/>`,
  backpack: `<path d="M30 22a20 20 0 0 1 40 0c8 4 12 12 12 22v40a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V44c0-10 4-18 12-22z"/><path d="M34 56h32v22a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z" fill="#00000030"/><path d="M42 14a12 12 0 0 1 16 0" stroke="#00000035" stroke-width="5" fill="none"/>`,
  pouch: `<path d="M14 40h72a8 8 0 0 1 8 8v26a12 12 0 0 1-12 12H18A12 12 0 0 1 6 74V48a8 8 0 0 1 8-8z"/><path d="M6 52h88" stroke="#00000035" stroke-width="4"/><path d="M34 40a16 16 0 0 1 32 0h-8a8 8 0 0 0-16 0z"/>`,
  pillow: `<path d="M50 14a34 30 0 0 0-34 30c0 16 10 24 14 34a8 8 0 0 0 8 6h4V64a8 8 0 0 1 16 0v20h4a8 8 0 0 0 8-6c4-10 14-18 14-34a34 30 0 0 0-34-30z"/>`,
  thermo: `<rect x="32" y="20" width="36" height="76" rx="10"/><rect x="36" y="6" width="28" height="12" rx="4"/><path d="M68 40h10a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H68v-8h8V48h-8z"/><rect x="32" y="34" width="36" height="8" fill="#00000030"/>`,
  mate: `<path d="M50 30c14 0 24 4 24 12 0 22-6 44-24 44S26 64 26 42c0-8 10-12 24-12z"/><path d="M58 34 74 8l6 4-14 24z"/><ellipse cx="50" cy="42" rx="18" ry="6" fill="#00000030"/>`,
  knife: `<path d="M14 20h44c20 0 26 8 26 12s-6 12-26 12H14a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6z"/><rect x="30" y="52" width="12" height="44" rx="5" transform="rotate(24 36 74)"/><rect x="56" y="52" width="12" height="44" rx="5" transform="rotate(-24 62 74)"/>`,
  moka: `<path d="M32 8h36l6 32H26z"/><path d="M26 56h48l-6 36H32z"/><rect x="24" y="44" width="52" height="8" rx="4"/><path d="M74 56h10a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H72l2-8h8v-6h-9z"/><rect x="44" y="16" width="12" height="14" rx="3" fill="#00000030"/>`,
};

const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

function productSvg(p) {
  const cat = catBySlug[p.category];
  const [c1, c2] = cat.gradient;
  const icon = ICONS[p.icon] ?? ICONS.bottle;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="${escXml(p.brand)} ${escXml(p.name)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <circle cx="300" cy="290" r="215" fill="#ffffff" opacity=".07"/>
  <circle cx="300" cy="290" r="160" fill="#ffffff" opacity=".06"/>
  <g transform="translate(165 155) scale(2.7)" fill="#ffffff" opacity=".94">${icon}</g>
  <text x="300" y="536" text-anchor="middle" font-family="'PT Sans', Arial, sans-serif" font-size="30" font-weight="bold" fill="#ffffff" opacity=".85" letter-spacing="4">${escXml(p.brand.toUpperCase())}</text>
</svg>
`;
}

function categorySvg(c) {
  const [c1, c2] = c.gradient;
  const icon = ICONS[c.icon] ?? ICONS.bottle;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" role="img" aria-label="${escXml(c.nameEs)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bg)"/>
  <circle cx="470" cy="200" r="190" fill="#ffffff" opacity=".06"/>
  <g transform="translate(360 90) scale(2.2)" fill="#ffffff" opacity=".9">${icon}</g>
</svg>
`;
}

function escXml(s) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function sqlStr(s) {
  return `'${String(s).replaceAll("'", "''")}'`;
}

// ---------------------------------------------------------------
// seed.sql
// ---------------------------------------------------------------
function buildSeedSql() {
  const lines = [
    '-- ============================================================',
    '-- DFSAS Tienda — seed idempotente del catálogo.',
    '-- Generado por scripts/generate-catalog.mjs — NO editar a mano.',
    '-- Basado en el catálogo real de dutyfreeshopatlanticosur.com.',
    '-- Se puede ejecutar varias veces sin duplicar datos.',
    '-- ============================================================',
    '',
    'begin;',
    '',
  ];

  for (const c of categories) {
    lines.push(
      `insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)`,
      `values (${sqlStr(c.slug)}, ${sqlStr(c.nameEs)}, ${sqlStr(c.namePt)}, ${sqlStr(c.nameEn)}, ${sqlStr(categoryImage(c.slug))}, ${c.sort}, true)`,
      `on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,`,
      `  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;`,
      '',
    );
  }

  for (const p of products) {
    lines.push(
      `insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)`,
      `values (${sqlStr(p.slug)}, (select id from public.categories where slug = ${sqlStr(p.category)}),`,
      `  ${sqlStr(p.brand)}, ${sqlStr(p.name)}, ${sqlStr(p.descEs)}, ${sqlStr(p.descPt)}, ${sqlStr(p.descEn)},`,
      `  ${sqlStr(productImage(p.slug))}, ${p.featured}, true)`,
      `on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,`,
      `  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,`,
      `  image = excluded.image, featured = excluded.featured, active = true;`,
      '',
    );
    for (const v of p.variants) {
      lines.push(
        `insert into public.product_variants (product_id, sku, label, price_usd, active)`,
        `values ((select id from public.products where slug = ${sqlStr(p.slug)}), ${sqlStr(v.sku)}, ${sqlStr(v.label)}, ${v.priceUsd.toFixed(2)}, true)`,
        `on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;`,
        '',
        `insert into public.inventory (variant_id, qty)`,
        `select id, ${v.stock} from public.product_variants where sku = ${sqlStr(v.sku)}`,
        `on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones`,
        '',
      );
    }
  }

  lines.push('commit;', '');
  return lines.join('\n');
}

// ---------------------------------------------------------------
// demoCatalog.ts
// ---------------------------------------------------------------
function buildDemoCatalog() {
  const cats = categories.map((c) => ({
    slug: c.slug,
    nameEs: c.nameEs,
    namePt: c.namePt,
    nameEn: c.nameEn,
    image: categoryImage(c.slug),
    sort: c.sort,
  }));
  const prods = products.map((p) => ({
    id: p.slug,
    slug: p.slug,
    categorySlug: p.category,
    brand: p.brand,
    name: p.name,
    descEs: p.descEs,
    descPt: p.descPt,
    descEn: p.descEn,
    image: productImage(p.slug),
    featured: p.featured,
    active: true,
    variants: p.variants.map((v) => ({
      id: v.sku,
      sku: v.sku,
      label: v.label,
      priceUsd: v.priceUsd,
      stock: v.stock,
      active: true,
    })),
  }));

  return `// ============================================================
// Catálogo del modo demo — generado por scripts/generate-catalog.mjs
// a partir de scripts/catalog-data.mjs. NO editar a mano.
// ============================================================
import type { Category, Product } from '../types';

export const demoCategories: Category[] = ${JSON.stringify(cats, null, 2)};

export const demoProducts: Product[] = ${JSON.stringify(prods, null, 2)};
`;
}

// ---------------------------------------------------------------
// Ejecutar
// ---------------------------------------------------------------
mkdirSync(resolve(root, 'public/img/products'), { recursive: true });
mkdirSync(resolve(root, 'public/img/categories'), { recursive: true });
mkdirSync(resolve(root, 'supabase'), { recursive: true });
mkdirSync(resolve(root, 'src/store'), { recursive: true });

for (const p of products) {
  writeFileSync(resolve(root, `public/img/products/${p.slug}.svg`), productSvg(p));
}
for (const c of categories) {
  writeFileSync(resolve(root, `public/img/categories/${c.slug}.svg`), categorySvg(c));
}
writeFileSync(resolve(root, 'supabase/seed.sql'), buildSeedSql());
writeFileSync(resolve(root, 'src/store/demoCatalog.ts'), buildDemoCatalog());

console.log(`OK: ${products.length} productos, ${categories.length} categorías.`);
console.log('Generados: supabase/seed.sql, src/store/demoCatalog.ts, public/img/**');
