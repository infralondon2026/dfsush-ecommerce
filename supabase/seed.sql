-- ============================================================
-- DFSAS Tienda — seed idempotente del catálogo.
-- Generado por scripts/generate-catalog.mjs — NO editar a mano.
-- Basado en el catálogo real de dutyfreeshopatlanticosur.com.
-- Se puede ejecutar varias veces sin duplicar datos.
-- ============================================================

begin;

insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)
values ('bebidas', 'Bebidas', 'Bebidas', 'Spirits & Wines', 'img/categories/bebidas.jpg', 1, true)
on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,
  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;

insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)
values ('perfumeria', 'Perfumería', 'Perfumaria', 'Fragrances & Beauty', 'img/categories/perfumeria.jpg', 2, true)
on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,
  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;

insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)
values ('electronica', 'Electrónica', 'Eletrônicos', 'Electronics', 'img/categories/electronica.jpg', 3, true)
on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,
  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;

insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)
values ('comestibles', 'Comestibles', 'Comestíveis', 'Food & Sweets', 'img/categories/comestibles.jpg', 4, true)
on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,
  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;

insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)
values ('moda', 'Moda y Accesorios', 'Moda e Acessórios', 'Fashion & Accessories', 'img/categories/moda.jpg', 5, true)
on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,
  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;

insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)
values ('juguetes', 'Juguetes', 'Brinquedos', 'Toys', 'img/categories/juguetes.jpg', 6, true)
on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,
  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;

insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)
values ('viaje', 'Artículos de Viaje', 'Artigos de Viagem', 'Travel', 'img/categories/viaje.jpg', 7, true)
on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,
  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;

insert into public.categories (slug, name_es, name_pt, name_en, image, sort, active)
values ('home', 'Home & Design', 'Casa & Design', 'Home & Design', 'img/categories/home.jpg', 8, true)
on conflict (slug) do update set name_es = excluded.name_es, name_pt = excluded.name_pt,
  name_en = excluded.name_en, image = excluded.image, sort = excluded.sort, active = true;

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('jameson-caskmates-stout', (select id from public.categories where slug = 'bebidas'),
  'Jameson', 'Caskmates Stout Edition', 'Whiskey irlandés terminado en barricas de cerveza stout: notas de cacao, café y un final suave.', 'Whiskey irlandês finalizado em barris de cerveja stout: notas de cacau, café e final suave.', 'Irish whiskey finished in stout beer casks: cocoa and coffee notes with a smooth finish.',
  'img/products/jameson-caskmates-stout.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'jameson-caskmates-stout'), 'BEB-JAM-CM-750', '750 ml', 28.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 36 from public.product_variants where sku = 'BEB-JAM-CM-750'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('johnnie-walker-black', (select id from public.categories where slug = 'bebidas'),
  'Johnnie Walker', 'Black Label 12 Años', 'El blend escocés icónico, madurado 12 años. Formato 3 litros exclusivo de duty free.', 'O blend escocês icônico, maturado por 12 anos. Formato 3 litros exclusivo de duty free.', 'The iconic Scotch blend, aged 12 years. Travel-exclusive 3-litre format available.',
  'img/products/johnnie-walker-black.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'johnnie-walker-black'), 'BEB-JWB-1L', '1 L', 36.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 48 from public.product_variants where sku = 'BEB-JWB-1L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'johnnie-walker-black'), 'BEB-JWB-3L', '3 L', 110.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 8 from public.product_variants where sku = 'BEB-JWB-3L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('chivas-regal-12', (select id from public.categories where slug = 'bebidas'),
  'Chivas Regal', 'Chivas Regal 12 Años', 'Scotch whisky de 12 años, redondo y cremoso, con notas de miel y manzana madura.', 'Scotch whisky de 12 anos, redondo e cremoso, com notas de mel e maçã madura.', 'A rich, smooth 12-year-old Scotch with honey and ripe apple notes.',
  'img/products/chivas-regal-12.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'chivas-regal-12'), 'BEB-CHV12-750', '750 ml', 30.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 30 from public.product_variants where sku = 'BEB-CHV12-750'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'chivas-regal-12'), 'BEB-CHV12-1L', '1 L', 38.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 24 from public.product_variants where sku = 'BEB-CHV12-1L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('jack-daniels-old-no7', (select id from public.categories where slug = 'bebidas'),
  'Jack Daniel''s', 'Old No. 7 Tennessee Whiskey', 'El clásico de Tennessee filtrado gota a gota en carbón de arce. Suave y con carácter.', 'O clássico do Tennessee filtrado gota a gota em carvão de bordo. Suave e com caráter.', 'The Tennessee classic, charcoal-mellowed drop by drop. Smooth with character.',
  'img/products/jack-daniels-old-no7.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'jack-daniels-old-no7'), 'BEB-JD7-1L', '1 L', 33.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 40 from public.product_variants where sku = 'BEB-JD7-1L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('absolut-vodka', (select id from public.categories where slug = 'bebidas'),
  'Absolut', 'Absolut Vodka', 'Vodka sueco de trigo de invierno, destilado de forma continua para una pureza excepcional.', 'Vodka sueca de trigo de inverno, destilada continuamente para uma pureza excepcional.', 'Swedish winter-wheat vodka, continuously distilled for exceptional purity.',
  'img/products/absolut-vodka.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'absolut-vodka'), 'BEB-ABS-1L', '1 L', 15.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 60 from public.product_variants where sku = 'BEB-ABS-1L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('grey-goose', (select id from public.categories where slug = 'bebidas'),
  'Grey Goose', 'Grey Goose Vodka', 'Vodka premium francés elaborado con trigo de Picardía y agua de manantial natural.', 'Vodka premium francesa feita com trigo da Picardia e água de nascente natural.', 'Premium French vodka crafted from Picardy wheat and natural spring water.',
  'img/products/grey-goose.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'grey-goose'), 'BEB-GG-1L', '1 L', 42.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 18 from public.product_variants where sku = 'BEB-GG-1L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('bombay-sapphire', (select id from public.categories where slug = 'bebidas'),
  'Bombay Sapphire', 'London Dry Gin', 'Gin destilado al vapor con 10 botánicos seleccionados a mano. El alma del gin tonic perfecto.', 'Gin destilado a vapor com 10 botânicos selecionados à mão. A alma do gin tônica perfeito.', 'Vapour-infused gin with 10 hand-selected botanicals. The soul of a perfect G&T.',
  'img/products/bombay-sapphire.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'bombay-sapphire'), 'BEB-BOM-1L', '1 L', 24.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 32 from public.product_variants where sku = 'BEB-BOM-1L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('baileys-original', (select id from public.categories where slug = 'bebidas'),
  'Baileys', 'Original Irish Cream', 'La crema irlandesa original: whiskey, crema fresca y cacao en perfecta armonía.', 'O creme irlandês original: whiskey, creme fresco e cacau em perfeita harmonia.', 'The original Irish cream: whiskey, fresh dairy cream and cocoa in perfect harmony.',
  'img/products/baileys-original.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'baileys-original'), 'BEB-BAI-1L', '1 L', 19.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 28 from public.product_variants where sku = 'BEB-BAI-1L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('lagarde-dolce-espumante', (select id from public.categories where slug = 'bebidas'),
  'Lagarde', 'Dolce Espumante', 'Espumante dulce natural de bodega mendocina, fresco y frutado. Ideal para brindar.', 'Espumante doce natural de vinícola mendocina, fresco e frutado. Ideal para brindar.', 'Naturally sweet sparkling wine from Mendoza — fresh, fruity, made for a toast.',
  'img/products/lagarde-dolce-espumante.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'lagarde-dolce-espumante'), 'BEB-LAG-750', '750 ml', 14.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 26 from public.product_variants where sku = 'BEB-LAG-750'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('dpoeti-rosso-montalcino', (select id from public.categories where slug = 'bebidas'),
  'D.Poeti', 'Rosso di Montalcino DOC', 'Tinto toscano de uva Sangiovese, elegante y especiado, con denominación de origen.', 'Tinto toscano de uva Sangiovese, elegante e condimentado, com denominação de origem.', 'Tuscan Sangiovese red — elegant, spicy, with protected designation of origin.',
  'img/products/dpoeti-rosso-montalcino.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'dpoeti-rosso-montalcino'), 'BEB-DPO-750', '750 ml', 26.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 15 from public.product_variants where sku = 'BEB-DPO-750'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('prada-la-femme-intense', (select id from public.categories where slug = 'perfumeria'),
  'Prada', 'La Femme Intense EDP', 'Frangipani, tuberosa y vainilla en una interpretación intensa y envolvente de la feminidad.', 'Frangipani, tuberosa e baunilha em uma interpretação intensa e envolvente da feminilidade.', 'Frangipani, tuberose and vanilla in an intense, enveloping take on femininity.',
  'img/products/prada-la-femme-intense.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'prada-la-femme-intense'), 'PER-PLF-50', '50 ml', 96.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 14 from public.product_variants where sku = 'PER-PLF-50'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('paco-rabanne-pure-xs-night', (select id from public.categories where slug = 'perfumeria'),
  'Paco Rabanne', 'Pure XS Night EDP', 'Oriental ambarado con jengibre, cacao y vainilla bourbon. Seducción nocturna.', 'Oriental ambarado com gengibre, cacau e baunilha bourbon. Sedução noturna.', 'Amber oriental with ginger, cacao and bourbon vanilla. Night-time seduction.',
  'img/products/paco-rabanne-pure-xs-night.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'paco-rabanne-pure-xs-night'), 'PER-PXN-50', '50 ml', 78.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 16 from public.product_variants where sku = 'PER-PXN-50'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'paco-rabanne-pure-xs-night'), 'PER-PXN-100', '100 ml', 105.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 10 from public.product_variants where sku = 'PER-PXN-100'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('lancome-la-vie-est-belle-leclat', (select id from public.categories where slug = 'perfumeria'),
  'Lancôme', 'La Vie Est Belle L''Éclat EDT', 'La felicidad hecha fragancia: azahar luminoso, jazmín y un fondo cálido de vainilla.', 'A felicidade em fragrância: flor de laranjeira luminosa, jasmim e fundo quente de baunilha.', 'Happiness as a fragrance: luminous orange blossom, jasmine and a warm vanilla base.',
  'img/products/lancome-la-vie-est-belle-leclat.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'lancome-la-vie-est-belle-leclat'), 'PER-LVB-50', '50 ml', 89.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 12 from public.product_variants where sku = 'PER-LVB-50'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('prada-luna-rossa', (select id from public.categories where slug = 'perfumeria'),
  'Prada', 'Luna Rossa EDT', 'Frescura deportiva de lavanda y menta inspirada en la vela de competición.', 'Frescor esportivo de lavanda e menta inspirado na vela de competição.', 'Sporty freshness of lavender and mint, inspired by competitive sailing.',
  'img/products/prada-luna-rossa.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'prada-luna-rossa'), 'PER-PLR-50', '50 ml', 72.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 15 from public.product_variants where sku = 'PER-PLR-50'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'prada-luna-rossa'), 'PER-PLR-100', '100 ml', 98.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 9 from public.product_variants where sku = 'PER-PLR-100'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('chanel-n5-edp', (select id from public.categories where slug = 'perfumeria'),
  'Chanel', 'N°5 EDP', 'El perfume más famoso del mundo: aldehídos, rosa de mayo y jazmín de Grasse.', 'O perfume mais famoso do mundo: aldeídos, rosa de maio e jasmim de Grasse.', 'The world’s most famous perfume: aldehydes, May rose and Grasse jasmine.',
  'img/products/chanel-n5-edp.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'chanel-n5-edp'), 'PER-CH5-50', '50 ml', 128.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 10 from public.product_variants where sku = 'PER-CH5-50'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'chanel-n5-edp'), 'PER-CH5-100', '100 ml', 168.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 6 from public.product_variants where sku = 'PER-CH5-100'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('dior-sauvage-edt', (select id from public.categories where slug = 'perfumeria'),
  'Dior', 'Sauvage EDT', 'Bergamota de Calabria y ambroxan sobre un fondo mineral. Frescura radicalmente masculina.', 'Bergamota da Calábria e ambroxan sobre um fundo mineral. Frescor radicalmente masculino.', 'Calabrian bergamot and ambroxan over a mineral base. Radically fresh and masculine.',
  'img/products/dior-sauvage-edt.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'dior-sauvage-edt'), 'PER-DSV-60', '60 ml', 95.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 14 from public.product_variants where sku = 'PER-DSV-60'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'dior-sauvage-edt'), 'PER-DSV-100', '100 ml', 122.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 8 from public.product_variants where sku = 'PER-DSV-100'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('ch-212-vip-rose', (select id from public.categories where slug = 'perfumeria'),
  'Carolina Herrera', '212 VIP Rosé EDP', 'Champagne rosé, flor de durazno y almizcle: el espíritu de la fiesta neoyorquina.', 'Champagne rosé, flor de pêssego e almíscar: o espírito da festa nova-iorquina.', 'Rosé champagne, peach blossom and musk: the spirit of the New York party.',
  'img/products/ch-212-vip-rose.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'ch-212-vip-rose'), 'PER-212R-80', '80 ml', 92.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 12 from public.product_variants where sku = 'PER-212R-80'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('armani-acqua-di-gio', (select id from public.categories where slug = 'perfumeria'),
  'Giorgio Armani', 'Acqua di Giò EDT', 'Un clásico marino mediterráneo: cítricos, jazmín acuático y maderas cálidas.', 'Um clássico marinho mediterrâneo: cítricos, jasmim aquático e madeiras quentes.', 'A Mediterranean marine classic: citrus, aquatic jasmine and warm woods.',
  'img/products/armani-acqua-di-gio.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'armani-acqua-di-gio'), 'PER-ADG-50', '50 ml', 74.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 16 from public.product_variants where sku = 'PER-ADG-50'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'armani-acqua-di-gio'), 'PER-ADG-100', '100 ml', 99.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 11 from public.product_variants where sku = 'PER-ADG-100'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('lancome-advanced-genifique', (select id from public.categories where slug = 'perfumeria'),
  'Lancôme', 'Advanced Génifique Sérum', 'Sérum de tratamiento con prebióticos que fortalece la barrera de la piel y aporta luminosidad.', 'Sérum de tratamento com prebióticos que fortalece a barreira da pele e traz luminosidade.', 'Prebiotic treatment serum that strengthens the skin barrier and restores radiance.',
  'img/products/lancome-advanced-genifique.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'lancome-advanced-genifique'), 'PER-LAG-50', '50 ml', 105.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 9 from public.product_variants where sku = 'PER-LAG-50'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('mac-retro-matte-ruby-woo', (select id from public.categories where slug = 'perfumeria'),
  'M·A·C', 'Retro Matte Lipstick Ruby Woo', 'El rojo mate universal de M·A·C, de acabado retro y larga duración.', 'O vermelho fosco universal da M·A·C, com acabamento retrô e longa duração.', 'M·A·C’s universally flattering matte red with a long-wearing retro finish.',
  'img/products/mac-retro-matte-ruby-woo.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'mac-retro-matte-ruby-woo'), 'PER-MAC-RW', '3 g', 21.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 30 from public.product_variants where sku = 'PER-MAC-RW'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('xiaomi-redmi-buds', (select id from public.categories where slug = 'electronica'),
  'Xiaomi', 'Redmi Buds True Wireless', 'Auriculares true wireless con estuche de carga, Bluetooth 5.3 y cancelación de ruido en llamadas.', 'Fones true wireless com estojo de carga, Bluetooth 5.3 e cancelamento de ruído em chamadas.', 'True wireless earbuds with charging case, Bluetooth 5.3 and call noise cancellation.',
  'img/products/xiaomi-redmi-buds.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'xiaomi-redmi-buds'), 'ELE-XRB-TWS', 'Único', 29.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 42 from public.product_variants where sku = 'ELE-XRB-TWS'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('logitech-k400-plus', (select id from public.categories where slug = 'electronica'),
  'Logitech', 'Teclado Inalámbrico K400 Plus', 'Teclado inalámbrico con touchpad integrado, ideal para smart TV y home office.', 'Teclado sem fio com touchpad integrado, ideal para smart TV e home office.', 'Wireless keyboard with built-in touchpad — perfect for smart TVs and home office.',
  'img/products/logitech-k400-plus.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'logitech-k400-plus'), 'ELE-LGK400', 'Único', 39.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 25 from public.product_variants where sku = 'ELE-LGK400'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('ue-wonderboom-2', (select id from public.categories where slug = 'electronica'),
  'Ultimate Ears', 'Parlante Portátil Wonderboom 2', 'Parlante portátil resistente al agua con sonido 360° y 13 horas de batería.', 'Caixa de som portátil à prova d’água com som 360° e 13 horas de bateria.', 'Waterproof portable speaker with 360° sound and 13 hours of battery life.',
  'img/products/ue-wonderboom-2.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'ue-wonderboom-2'), 'ELE-UEWB2', 'Único', 69.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 20 from public.product_variants where sku = 'ELE-UEWB2'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('xiaomi-power-bank-2s', (select id from public.categories where slug = 'electronica'),
  'Xiaomi', 'Power Bank 2S 10000 mAh', 'Batería portátil de 10.000 mAh con doble salida USB y carga rápida.', 'Bateria portátil de 10.000 mAh com dupla saída USB e carga rápida.', '10,000 mAh portable battery with dual USB output and fast charging.',
  'img/products/xiaomi-power-bank-2s.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'xiaomi-power-bank-2s'), 'ELE-XPB-2S', 'Único', 25.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 35 from public.product_variants where sku = 'ELE-XPB-2S'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('jbl-flip-6', (select id from public.categories where slug = 'electronica'),
  'JBL', 'Parlante JBL Flip 6', 'Sonido JBL Original Pro con graves profundos, IP67 y 12 horas de reproducción.', 'Som JBL Original Pro com graves profundos, IP67 e 12 horas de reprodução.', 'JBL Original Pro sound with deep bass, IP67 rating and 12 hours of playtime.',
  'img/products/jbl-flip-6.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'jbl-flip-6'), 'ELE-JBLF6', 'Único', 119.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 16 from public.product_variants where sku = 'ELE-JBLF6'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('sony-wh-ch520', (select id from public.categories where slug = 'electronica'),
  'Sony', 'Auriculares WH-CH520', 'Auriculares inalámbricos on-ear con 50 horas de batería y conexión multipunto.', 'Fones sem fio on-ear com 50 horas de bateria e conexão multiponto.', 'Wireless on-ear headphones with 50-hour battery and multipoint connection.',
  'img/products/sony-wh-ch520.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'sony-wh-ch520'), 'ELE-SNYCH520', 'Único', 59.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 22 from public.product_variants where sku = 'ELE-SNYCH520'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('nintendo-switch-lite', (select id from public.categories where slug = 'electronica'),
  'Nintendo', 'Consola Switch Lite', 'Consola portátil compacta y liviana, dedicada al juego en modo portátil.', 'Console portátil compacto e leve, dedicado ao jogo em modo portátil.', 'Compact, lightweight handheld console dedicated to portable play.',
  'img/products/nintendo-switch-lite.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'nintendo-switch-lite'), 'ELE-NSWL', 'Único', 219.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 10 from public.product_variants where sku = 'ELE-NSWL'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('toblerone-leche-360', (select id from public.categories where slug = 'comestibles'),
  'Toblerone', 'Chocolate con Leche 360 g', 'El triángulo suizo clásico con miel y turrón de almendras. Formato viajero de 360 g.', 'O triângulo suíço clássico com mel e torrone de amêndoas. Formato viagem de 360 g.', 'The classic Swiss triangle with honey and almond nougat. 360 g travel format.',
  'img/products/toblerone-leche-360.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'toblerone-leche-360'), 'COM-TOB-360', '360 g', 12.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 60 from public.product_variants where sku = 'COM-TOB-360'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('lindt-lindor-surtido-200', (select id from public.categories where slug = 'comestibles'),
  'Lindt', 'Lindor Surtido 200 g', 'Bombones Lindor de centro cremoso en surtido de leche, blanco y amargo.', 'Bombons Lindor de centro cremoso em sortido ao leite, branco e amargo.', 'Lindor truffles with a smooth melting centre — milk, white and dark assortment.',
  'img/products/lindt-lindor-surtido-200.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'lindt-lindor-surtido-200'), 'COM-LIN-200', '200 g', 11.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 45 from public.product_variants where sku = 'COM-LIN-200'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('ferrero-rocher-t24', (select id from public.categories where slug = 'comestibles'),
  'Ferrero', 'Ferrero Rocher x24', 'Avellana entera, crema de avellanas y oblea crocante bañada en chocolate. Caja x24.', 'Avelã inteira, creme de avelãs e wafer crocante banhado em chocolate. Caixa x24.', 'Whole hazelnut, hazelnut cream and crisp wafer coated in chocolate. Box of 24.',
  'img/products/ferrero-rocher-t24.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'ferrero-rocher-t24'), 'COM-FER-T24', 'Caja x24', 15.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 38 from public.product_variants where sku = 'COM-FER-T24'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('mms-peanut-400', (select id from public.categories where slug = 'comestibles'),
  'M&M''s', 'M&M''s Peanut 400 g', 'Maní recubierto de chocolate con leche y confite de colores, en bolsa familiar.', 'Amendoim coberto de chocolate ao leite e confeito colorido, em embalagem família.', 'Peanuts covered in milk chocolate and colourful candy shell — family size bag.',
  'img/products/mms-peanut-400.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'mms-peanut-400'), 'COM-MMS-400', '400 g', 9.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 50 from public.product_variants where sku = 'COM-MMS-400'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('havanna-alfajores-12', (select id from public.categories where slug = 'comestibles'),
  'Havanna', 'Alfajores Mixtos x12', 'El alfajor argentino por excelencia: dulce de leche y chocolate o merengue italiano.', 'O alfajor argentino por excelência: doce de leite e chocolate ou merengue italiano.', 'Argentina’s signature alfajor: dulce de leche with chocolate or Italian meringue.',
  'img/products/havanna-alfajores-12.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'havanna-alfajores-12'), 'COM-HAV-12', 'Caja x12', 18.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 30 from public.product_variants where sku = 'COM-HAV-12'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('twinings-english-breakfast', (select id from public.categories where slug = 'comestibles'),
  'Twinings', 'English Breakfast x100', 'Blend clásico de té negro, robusto y equilibrado. Caja de 100 saquitos.', 'Blend clássico de chá preto, robusto e equilibrado. Caixa com 100 sachês.', 'Classic robust and balanced black tea blend. Box of 100 tea bags.',
  'img/products/twinings-english-breakfast.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'twinings-english-breakfast'), 'COM-TWI-100', 'Caja x100', 10.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 26 from public.product_variants where sku = 'COM-TWI-100'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('rayban-aviator-classic', (select id from public.categories where slug = 'moda'),
  'Ray-Ban', 'Aviator Classic', 'El icónico aviador con lentes de cristal G-15 y protección UV total.', 'O icônico aviador com lentes de cristal G-15 e proteção UV total.', 'The iconic aviator with G-15 crystal lenses and full UV protection.',
  'img/products/rayban-aviator-classic.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'rayban-aviator-classic'), 'MOD-RBA-G15', 'Único', 129.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 14 from public.product_variants where sku = 'MOD-RBA-G15'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('casio-gshock-ga2100', (select id from public.categories where slug = 'moda'),
  'Casio', 'G-Shock GA-2100', 'Resistencia G-Shock en perfil ultra delgado, con carcasa octogonal de carbono.', 'Resistência G-Shock em perfil ultrafino, com caixa octogonal de carbono.', 'G-Shock toughness in an ultra-slim profile with octagonal carbon case.',
  'img/products/casio-gshock-ga2100.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'casio-gshock-ga2100'), 'MOD-GSH-2100', 'Único', 99.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 12 from public.product_variants where sku = 'MOD-GSH-2100'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('swatch-big-bold', (select id from public.categories where slug = 'moda'),
  'Swatch', 'Big Bold', 'Reloj suizo de 47 mm con espíritu urbano y correa de silicona.', 'Relógio suíço de 47 mm com espírito urbano e pulseira de silicone.', 'A 47 mm Swiss watch with urban attitude and silicone strap.',
  'img/products/swatch-big-bold.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'swatch-big-bold'), 'MOD-SWA-BB', 'Único', 85.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 15 from public.product_variants where sku = 'MOD-SWA-BB'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('tommy-billetera-cuero', (select id from public.categories where slug = 'moda'),
  'Tommy Hilfiger', 'Billetera de Cuero', 'Billetera plegable de cuero genuino con múltiples tarjeteros y monedero.', 'Carteira dobrável de couro genuíno com vários porta-cartões e porta-moedas.', 'Genuine leather bifold wallet with multiple card slots and coin pocket.',
  'img/products/tommy-billetera-cuero.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'tommy-billetera-cuero'), 'MOD-TH-WAL', 'Único', 49.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 20 from public.product_variants where sku = 'MOD-TH-WAL'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('pashmina-austral', (select id from public.categories where slug = 'moda'),
  'Atlántico Sur Selection', 'Pashmina Seda y Lana', 'Pashmina suave de seda y lana, perfecta para el clima fueguino. Varios colores.', 'Pashmina macia de seda e lã, perfeita para o clima fueguino. Várias cores.', 'Soft silk-and-wool pashmina, perfect for the Fuegian climate. Assorted colours.',
  'img/products/pashmina-austral.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'pashmina-austral'), 'MOD-PSH-AUS', 'Único', 35.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 24 from public.product_variants where sku = 'MOD-PSH-AUS'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('lego-classic-creativa', (select id from public.categories where slug = 'juguetes'),
  'LEGO', 'Classic Caja Creativa 484 pzs', 'Ladrillos LEGO de 33 colores con ruedas, ojos y piezas especiales para crear sin límites.', 'Peças LEGO em 33 cores com rodas, olhos e peças especiais para criar sem limites.', 'LEGO bricks in 33 colours with wheels, eyes and special pieces for limitless building.',
  'img/products/lego-classic-creativa.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'lego-classic-creativa'), 'JUG-LEG-484', '484 piezas', 45.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 18 from public.product_variants where sku = 'JUG-LEG-484'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('hot-wheels-pack5', (select id from public.categories where slug = 'juguetes'),
  'Hot Wheels', 'Pack x5 Vehículos', 'Cinco vehículos Hot Wheels a escala 1:64 con diseños temáticos surtidos.', 'Cinco veículos Hot Wheels em escala 1:64 com designs temáticos sortidos.', 'Five 1:64-scale Hot Wheels vehicles in assorted themed designs.',
  'img/products/hot-wheels-pack5.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'hot-wheels-pack5'), 'JUG-HW-P5', 'Pack x5', 12.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 34 from public.product_variants where sku = 'JUG-HW-P5'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('uno-cartas', (select id from public.categories where slug = 'juguetes'),
  'Mattel Games', 'UNO Clásico', 'El juego de cartas más famoso del mundo, para toda la familia. De 2 a 10 jugadores.', 'O jogo de cartas mais famoso do mundo, para toda a família. De 2 a 10 jogadores.', 'The world’s most famous card game, fun for the whole family. 2 to 10 players.',
  'img/products/uno-cartas.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'uno-cartas'), 'JUG-UNO', 'Único', 8.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 40 from public.product_variants where sku = 'JUG-UNO'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('peluche-pinguino-austral', (select id from public.categories where slug = 'juguetes'),
  'Wild Republic', 'Peluche Pingüino Austral 30 cm', 'Un recuerdo del fin del mundo: pingüino de peluche súper suave de 30 cm.', 'Uma lembrança do fim do mundo: pinguim de pelúcia super macio de 30 cm.', 'A keepsake from the end of the world: super-soft 30 cm penguin plush.',
  'img/products/peluche-pinguino-austral.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'peluche-pinguino-austral'), 'JUG-PIN-30', '30 cm', 19.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 28 from public.product_variants where sku = 'JUG-PIN-30'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('cubo-rubik-3x3', (select id from public.categories where slug = 'juguetes'),
  'Rubik''s', 'Cubo Rubik 3x3', 'El rompecabezas clásico de 43 trillones de combinaciones y una sola solución.', 'O quebra-cabeça clássico de 43 trilhões de combinações e uma única solução.', 'The classic puzzle: 43 quintillion combinations, only one solution.',
  'img/products/cubo-rubik-3x3.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'cubo-rubik-3x3'), 'JUG-RUB-3X3', 'Único', 14.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 32 from public.product_variants where sku = 'JUG-RUB-3X3'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('samsonite-cabina-55', (select id from public.categories where slug = 'viaje'),
  'Samsonite', 'Valija Cabina 55 cm', 'Valija rígida de cabina con 4 ruedas dobles, candado TSA y garantía internacional.', 'Mala rígida de cabine com 4 rodas duplas, cadeado TSA e garantia internacional.', 'Hard-shell cabin case with 4 double wheels, TSA lock and international warranty.',
  'img/products/samsonite-cabina-55.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'samsonite-cabina-55'), 'VIA-SAM-55', '55 cm', 189.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 10 from public.product_variants where sku = 'VIA-SAM-55'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('swissgear-mochila-28', (select id from public.categories where slug = 'viaje'),
  'SwissGear', 'Mochila Urbana 28 L', 'Mochila de 28 litros con compartimento acolchado para notebook de 15,6".', 'Mochila de 28 litros com compartimento acolchoado para notebook de 15,6".', '28-litre backpack with padded compartment for a 15.6" laptop.',
  'img/products/swissgear-mochila-28.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'swissgear-mochila-28'), 'VIA-SWG-28', '28 L', 79.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 16 from public.product_variants where sku = 'VIA-SWG-28'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('samsonite-neceser', (select id from public.categories where slug = 'viaje'),
  'Samsonite', 'Neceser de Viaje', 'Neceser compacto con gancho colgante y bolsillos internos impermeables.', 'Nécessaire compacta com gancho suspenso e bolsos internos impermeáveis.', 'Compact toiletry kit with hanging hook and waterproof inner pockets.',
  'img/products/samsonite-neceser.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'samsonite-neceser'), 'VIA-SAM-NEC', 'Único', 32.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 22 from public.product_variants where sku = 'VIA-SAM-NEC'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('cabeau-almohada-viaje', (select id from public.categories where slug = 'viaje'),
  'Cabeau', 'Almohada de Viaje Evolution', 'Almohada cervical viscoelástica con soporte 360° y funda lavable.', 'Travesseiro cervical viscoelástico com suporte 360° e capa lavável.', 'Memory-foam neck pillow with 360° support and washable cover.',
  'img/products/cabeau-almohada-viaje.svg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'cabeau-almohada-viaje'), 'VIA-CAB-EVO', 'Único', 39.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 20 from public.product_variants where sku = 'VIA-CAB-EVO'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('stanley-termo-clasico', (select id from public.categories where slug = 'home'),
  'Stanley', 'Termo Clásico 1 L', 'El termo legendario: acero inoxidable, 24 horas de temperatura y garantía de por vida.', 'A garrafa térmica lendária: aço inox, 24 horas de temperatura e garantia vitalícia.', 'The legendary flask: stainless steel, 24-hour temperature retention, lifetime warranty.',
  'img/products/stanley-termo-clasico.jpg', true, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'stanley-termo-clasico'), 'HOM-STA-1L', '1 L', 55.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 24 from public.product_variants where sku = 'HOM-STA-1L'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('set-matero-austral', (select id from public.categories where slug = 'home'),
  'Atlántico Sur Selection', 'Set Matero Calabaza + Bombilla', 'Mate de calabaza curado con virola de alpaca y bombilla pico de loro.', 'Cuia de porongo curada com detalhe de alpaca e bomba pico de loro.', 'Cured gourd mate with alpaca trim and traditional bombilla straw.',
  'img/products/set-matero-austral.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'set-matero-austral'), 'HOM-MAT-SET', 'Set', 28.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 26 from public.product_variants where sku = 'HOM-MAT-SET'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('victorinox-swiss-classic', (select id from public.categories where slug = 'home'),
  'Victorinox', 'Set Cuchillos Swiss Classic', 'Set de cuchillos de cocina suizos con hojas de acero inoxidable de alta precisión.', 'Conjunto de facas de cozinha suíças com lâminas de aço inox de alta precisão.', 'Swiss kitchen knife set with high-precision stainless steel blades.',
  'img/products/victorinox-swiss-classic.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'victorinox-swiss-classic'), 'HOM-VIC-SET', 'Set x3', 42.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 18 from public.product_variants where sku = 'HOM-VIC-SET'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

insert into public.products (slug, category_id, brand, name, desc_es, desc_pt, desc_en, image, featured, active)
values ('bialetti-moka-express', (select id from public.categories where slug = 'home'),
  'Bialetti', 'Moka Express 3 Tazas', 'La cafetera italiana original de aluminio, ícono del espresso casero desde 1933.', 'A cafeteira italiana original de alumínio, ícone do espresso caseiro desde 1933.', 'The original Italian aluminium coffee maker, a home-espresso icon since 1933.',
  'img/products/bialetti-moka-express.jpg', false, true)
on conflict (slug) do update set category_id = excluded.category_id, brand = excluded.brand,
  name = excluded.name, desc_es = excluded.desc_es, desc_pt = excluded.desc_pt, desc_en = excluded.desc_en,
  image = excluded.image, featured = excluded.featured, active = true;

insert into public.product_variants (product_id, sku, label, price_usd, active)
values ((select id from public.products where slug = 'bialetti-moka-express'), 'HOM-BIA-3T', '3 tazas', 36.00, true)
on conflict (sku) do update set label = excluded.label, price_usd = excluded.price_usd, active = true;

insert into public.inventory (variant_id, qty)
select id, 21 from public.product_variants where sku = 'HOM-BIA-3T'
on conflict (variant_id) do nothing; -- no pisa stock existente en re-ejecuciones

commit;
