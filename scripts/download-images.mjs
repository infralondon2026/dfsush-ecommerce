// ============================================================
// Descarga las imágenes reales del sitio:
//  1) Fotos de producto oficiales del sitio del Duty Free
//     (dutyfreeshopatlanticosur.londonsupplygroup.net — activos
//     de la propia empresa, self-hosteados, sin hotlinking).
//  2) Fotografía de Unsplash (licencia Unsplash: uso comercial
//     permitido sin atribución) para el resto de productos,
//     categorías y hero. Se registra el crédito de cada foto en
//     public/img/CREDITS.md.
//
// Uso: node scripts/download-images.mjs <resultados-unsplash.json>
// (el JSON de candidatos se genera consultando la búsqueda de
// Unsplash; ver README. Sin argumento solo baja las oficiales.)
// ============================================================

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DFS_BASE = 'http://dutyfreeshopatlanticosur.londonsupplygroup.net/public/assets/';

// Fotos oficiales del catálogo real (id del sitio → slug nuestro).
const OFFICIAL = {
  'jameson-caskmates-stout': '963/gt_1603110894Logoweb900x900px_Mesadetrabajo1copia3.jpg',
  'lagarde-dolce-espumante': '962/gt_1603110447Logoweb900x900px_Mesadetrabajo1.jpg',
  'johnnie-walker-black': '923/gt_1603110632Logoweb900x900px_Mesadetrabajo1copia.jpg',
  'dpoeti-rosso-montalcino': '922/gt_1603110733Logoweb900x900px_Mesadetrabajo1copia2.jpg',
  'prada-la-femme-intense': '918/gt_1599159210Logoweb900x900px_Mesadetrabajo1_Mesadetrabajo1copia.jpg',
  'paco-rabanne-pure-xs-night': '919/gt_1603109786Logoweb900x900px_Mesadetrabajo1copia.jpg',
  'lancome-la-vie-est-belle-leclat': '920/gt_1603109897Logoweb900x900px_Mesadetrabajo1.jpg',
  'prada-luna-rossa': '921/gt_1599159439Logoweb900x900px_Mesadetrabajo1_Mesadetrabajo1copia3.jpg',
  'xiaomi-redmi-buds': '914/gt_1603111695Logoweb900x900px_Mesadetrabajo1.jpg',
  'logitech-k400-plus': '915/gt_1603111775Logoweb900x900px_Mesadetrabajo1copia.jpg',
  'ue-wonderboom-2': '916/gt_1599161565Logoweb900x900px_Mesadetrabajo1_Mesadetrabajo1copia.jpg',
  'xiaomi-power-bank-2s': '917/gt_1603111900Logoweb900x900px_Mesadetrabajo1copia2.jpg',
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/*,*/*',
};

async function download(url, outPath, minBytes = 4000) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
  if (!isJpeg || buf.length < minBytes) throw new Error(`invalid image (${buf.length} bytes)`);
  writeFileSync(outPath, buf);
  return buf.length;
}

mkdirSync(resolve(root, 'public/img/products'), { recursive: true });
mkdirSync(resolve(root, 'public/img/categories'), { recursive: true });

const credits = ['# Créditos de imágenes', '',
  'Fotos de producto oficiales: Duty Free Shop Atlántico Sur (London Supply Group).',
  'Resto de la fotografía: [Unsplash](https://unsplash.com) — licencia Unsplash (uso comercial permitido).', ''];
const failures = [];

// 1) Oficiales
for (const [slug, path] of Object.entries(OFFICIAL)) {
  const out = resolve(root, `public/img/products/${slug}.jpg`);
  try {
    const bytes = await download(DFS_BASE + path, out);
    console.log(`oficial  ${slug} (${Math.round(bytes / 1024)} KB)`);
    credits.push(`- products/${slug}.jpg — Duty Free Shop Atlántico Sur`);
  } catch (e) {
    failures.push(`${slug}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 150));
}

// 2) Unsplash
const resultsFile = process.argv[2];
if (resultsFile && existsSync(resultsFile)) {
  const rawContent = readFileSync(resultsFile, 'utf8');
  // El archivo puede ser: (a) el objeto JSON directo, (b) un array
  // [{type,text}] cuyo text es un string JSON re-encodeado, con un
  // sufijo "(captured at origin …)" que hay que recortar.
  let text = rawContent;
  try {
    const arr = JSON.parse(rawContent);
    if (Array.isArray(arr) && arr[0]?.text) text = arr[0].text;
  } catch {
    /* no era un array: seguimos con el contenido crudo */
  }
  const cut = text.indexOf('\n\n(captured');
  if (cut > 0) text = text.slice(0, cut);
  let results = JSON.parse(text.trim());
  if (typeof results === 'string') results = JSON.parse(results);

  for (const [key, candidates] of Object.entries(results)) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      failures.push(`${key}: sin resultados`);
      continue;
    }
    const pick = candidates[0];
    let outPath;
    let params;
    if (key.startsWith('cat:')) {
      outPath = resolve(root, `public/img/categories/${key.slice(4)}.jpg`);
      params = '?w=1200&h=800&fit=crop&crop=entropy&q=80&fm=jpg';
    } else if (key.startsWith('hero:')) {
      outPath = resolve(root, `public/img/${key.replace(':', '-')}.jpg`);
      params = '?w=2000&h=1200&fit=crop&crop=entropy&q=80&fm=jpg';
    } else {
      if (key in OFFICIAL) continue; // la oficial manda
      outPath = resolve(root, `public/img/products/${key}.jpg`);
      params = '?w=900&h=900&fit=crop&crop=entropy&q=80&fm=jpg';
    }
    try {
      const bytes = await download(pick.base + params, outPath);
      console.log(`unsplash ${key} ← ${pick.id} (${Math.round(bytes / 1024)} KB)`);
      credits.push(`- ${outPath.split('img')[1].replaceAll('\\', '/').replace(/^\//, '')} — Unsplash ${pick.id}${pick.alt ? ` (“${pick.alt}”)` : ''}`);
    } catch (e) {
      failures.push(`${key}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 150));
  }
} else {
  console.log('(sin archivo de resultados de Unsplash: solo se bajaron las oficiales)');
}

writeFileSync(resolve(root, 'public/img/CREDITS.md'), credits.join('\n') + '\n');

console.log('\n--- RESUMEN ---');
console.log('fallos:', failures.length ? failures : 'ninguno');
