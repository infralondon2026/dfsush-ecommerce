// ============================================================
// Catálogo del modo demo — generado por scripts/generate-catalog.mjs
// a partir de scripts/catalog-data.mjs. NO editar a mano.
// ============================================================
import type { Category, Product } from '../types';

export const demoCategories: Category[] = [
  {
    "slug": "bebidas",
    "nameEs": "Bebidas",
    "namePt": "Bebidas",
    "nameEn": "Spirits & Wines",
    "image": "img/categories/bebidas.svg",
    "sort": 1
  },
  {
    "slug": "perfumeria",
    "nameEs": "Perfumería",
    "namePt": "Perfumaria",
    "nameEn": "Fragrances & Beauty",
    "image": "img/categories/perfumeria.svg",
    "sort": 2
  },
  {
    "slug": "electronica",
    "nameEs": "Electrónica",
    "namePt": "Eletrônicos",
    "nameEn": "Electronics",
    "image": "img/categories/electronica.svg",
    "sort": 3
  },
  {
    "slug": "comestibles",
    "nameEs": "Comestibles",
    "namePt": "Comestíveis",
    "nameEn": "Food & Sweets",
    "image": "img/categories/comestibles.svg",
    "sort": 4
  },
  {
    "slug": "moda",
    "nameEs": "Moda y Accesorios",
    "namePt": "Moda e Acessórios",
    "nameEn": "Fashion & Accessories",
    "image": "img/categories/moda.svg",
    "sort": 5
  },
  {
    "slug": "juguetes",
    "nameEs": "Juguetes",
    "namePt": "Brinquedos",
    "nameEn": "Toys",
    "image": "img/categories/juguetes.svg",
    "sort": 6
  },
  {
    "slug": "viaje",
    "nameEs": "Artículos de Viaje",
    "namePt": "Artigos de Viagem",
    "nameEn": "Travel",
    "image": "img/categories/viaje.svg",
    "sort": 7
  },
  {
    "slug": "home",
    "nameEs": "Home & Design",
    "namePt": "Casa & Design",
    "nameEn": "Home & Design",
    "image": "img/categories/home.svg",
    "sort": 8
  }
];

export const demoProducts: Product[] = [
  {
    "id": "jameson-caskmates-stout",
    "slug": "jameson-caskmates-stout",
    "categorySlug": "bebidas",
    "brand": "Jameson",
    "name": "Caskmates Stout Edition",
    "descEs": "Whiskey irlandés terminado en barricas de cerveza stout: notas de cacao, café y un final suave.",
    "descPt": "Whiskey irlandês finalizado em barris de cerveja stout: notas de cacau, café e final suave.",
    "descEn": "Irish whiskey finished in stout beer casks: cocoa and coffee notes with a smooth finish.",
    "image": "img/products/jameson-caskmates-stout.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "BEB-JAM-CM-750",
        "sku": "BEB-JAM-CM-750",
        "label": "750 ml",
        "priceUsd": 28,
        "stock": 36,
        "active": true
      }
    ]
  },
  {
    "id": "johnnie-walker-black",
    "slug": "johnnie-walker-black",
    "categorySlug": "bebidas",
    "brand": "Johnnie Walker",
    "name": "Black Label 12 Años",
    "descEs": "El blend escocés icónico, madurado 12 años. Formato 3 litros exclusivo de duty free.",
    "descPt": "O blend escocês icônico, maturado por 12 anos. Formato 3 litros exclusivo de duty free.",
    "descEn": "The iconic Scotch blend, aged 12 years. Travel-exclusive 3-litre format available.",
    "image": "img/products/johnnie-walker-black.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "BEB-JWB-1L",
        "sku": "BEB-JWB-1L",
        "label": "1 L",
        "priceUsd": 36,
        "stock": 48,
        "active": true
      },
      {
        "id": "BEB-JWB-3L",
        "sku": "BEB-JWB-3L",
        "label": "3 L",
        "priceUsd": 110,
        "stock": 8,
        "active": true
      }
    ]
  },
  {
    "id": "chivas-regal-12",
    "slug": "chivas-regal-12",
    "categorySlug": "bebidas",
    "brand": "Chivas Regal",
    "name": "Chivas Regal 12 Años",
    "descEs": "Scotch whisky de 12 años, redondo y cremoso, con notas de miel y manzana madura.",
    "descPt": "Scotch whisky de 12 anos, redondo e cremoso, com notas de mel e maçã madura.",
    "descEn": "A rich, smooth 12-year-old Scotch with honey and ripe apple notes.",
    "image": "img/products/chivas-regal-12.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "BEB-CHV12-750",
        "sku": "BEB-CHV12-750",
        "label": "750 ml",
        "priceUsd": 30,
        "stock": 30,
        "active": true
      },
      {
        "id": "BEB-CHV12-1L",
        "sku": "BEB-CHV12-1L",
        "label": "1 L",
        "priceUsd": 38,
        "stock": 24,
        "active": true
      }
    ]
  },
  {
    "id": "jack-daniels-old-no7",
    "slug": "jack-daniels-old-no7",
    "categorySlug": "bebidas",
    "brand": "Jack Daniel's",
    "name": "Old No. 7 Tennessee Whiskey",
    "descEs": "El clásico de Tennessee filtrado gota a gota en carbón de arce. Suave y con carácter.",
    "descPt": "O clássico do Tennessee filtrado gota a gota em carvão de bordo. Suave e com caráter.",
    "descEn": "The Tennessee classic, charcoal-mellowed drop by drop. Smooth with character.",
    "image": "img/products/jack-daniels-old-no7.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "BEB-JD7-1L",
        "sku": "BEB-JD7-1L",
        "label": "1 L",
        "priceUsd": 33,
        "stock": 40,
        "active": true
      }
    ]
  },
  {
    "id": "absolut-vodka",
    "slug": "absolut-vodka",
    "categorySlug": "bebidas",
    "brand": "Absolut",
    "name": "Absolut Vodka",
    "descEs": "Vodka sueco de trigo de invierno, destilado de forma continua para una pureza excepcional.",
    "descPt": "Vodka sueca de trigo de inverno, destilada continuamente para uma pureza excepcional.",
    "descEn": "Swedish winter-wheat vodka, continuously distilled for exceptional purity.",
    "image": "img/products/absolut-vodka.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "BEB-ABS-1L",
        "sku": "BEB-ABS-1L",
        "label": "1 L",
        "priceUsd": 15,
        "stock": 60,
        "active": true
      }
    ]
  },
  {
    "id": "grey-goose",
    "slug": "grey-goose",
    "categorySlug": "bebidas",
    "brand": "Grey Goose",
    "name": "Grey Goose Vodka",
    "descEs": "Vodka premium francés elaborado con trigo de Picardía y agua de manantial natural.",
    "descPt": "Vodka premium francesa feita com trigo da Picardia e água de nascente natural.",
    "descEn": "Premium French vodka crafted from Picardy wheat and natural spring water.",
    "image": "img/products/grey-goose.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "BEB-GG-1L",
        "sku": "BEB-GG-1L",
        "label": "1 L",
        "priceUsd": 42,
        "stock": 18,
        "active": true
      }
    ]
  },
  {
    "id": "bombay-sapphire",
    "slug": "bombay-sapphire",
    "categorySlug": "bebidas",
    "brand": "Bombay Sapphire",
    "name": "London Dry Gin",
    "descEs": "Gin destilado al vapor con 10 botánicos seleccionados a mano. El alma del gin tonic perfecto.",
    "descPt": "Gin destilado a vapor com 10 botânicos selecionados à mão. A alma do gin tônica perfeito.",
    "descEn": "Vapour-infused gin with 10 hand-selected botanicals. The soul of a perfect G&T.",
    "image": "img/products/bombay-sapphire.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "BEB-BOM-1L",
        "sku": "BEB-BOM-1L",
        "label": "1 L",
        "priceUsd": 24,
        "stock": 32,
        "active": true
      }
    ]
  },
  {
    "id": "baileys-original",
    "slug": "baileys-original",
    "categorySlug": "bebidas",
    "brand": "Baileys",
    "name": "Original Irish Cream",
    "descEs": "La crema irlandesa original: whiskey, crema fresca y cacao en perfecta armonía.",
    "descPt": "O creme irlandês original: whiskey, creme fresco e cacau em perfeita harmonia.",
    "descEn": "The original Irish cream: whiskey, fresh dairy cream and cocoa in perfect harmony.",
    "image": "img/products/baileys-original.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "BEB-BAI-1L",
        "sku": "BEB-BAI-1L",
        "label": "1 L",
        "priceUsd": 19,
        "stock": 28,
        "active": true
      }
    ]
  },
  {
    "id": "lagarde-dolce-espumante",
    "slug": "lagarde-dolce-espumante",
    "categorySlug": "bebidas",
    "brand": "Lagarde",
    "name": "Dolce Espumante",
    "descEs": "Espumante dulce natural de bodega mendocina, fresco y frutado. Ideal para brindar.",
    "descPt": "Espumante doce natural de vinícola mendocina, fresco e frutado. Ideal para brindar.",
    "descEn": "Naturally sweet sparkling wine from Mendoza — fresh, fruity, made for a toast.",
    "image": "img/products/lagarde-dolce-espumante.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "BEB-LAG-750",
        "sku": "BEB-LAG-750",
        "label": "750 ml",
        "priceUsd": 14,
        "stock": 26,
        "active": true
      }
    ]
  },
  {
    "id": "dpoeti-rosso-montalcino",
    "slug": "dpoeti-rosso-montalcino",
    "categorySlug": "bebidas",
    "brand": "D.Poeti",
    "name": "Rosso di Montalcino DOC",
    "descEs": "Tinto toscano de uva Sangiovese, elegante y especiado, con denominación de origen.",
    "descPt": "Tinto toscano de uva Sangiovese, elegante e condimentado, com denominação de origem.",
    "descEn": "Tuscan Sangiovese red — elegant, spicy, with protected designation of origin.",
    "image": "img/products/dpoeti-rosso-montalcino.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "BEB-DPO-750",
        "sku": "BEB-DPO-750",
        "label": "750 ml",
        "priceUsd": 26,
        "stock": 15,
        "active": true
      }
    ]
  },
  {
    "id": "prada-la-femme-intense",
    "slug": "prada-la-femme-intense",
    "categorySlug": "perfumeria",
    "brand": "Prada",
    "name": "La Femme Intense EDP",
    "descEs": "Frangipani, tuberosa y vainilla en una interpretación intensa y envolvente de la feminidad.",
    "descPt": "Frangipani, tuberosa e baunilha em uma interpretação intensa e envolvente da feminilidade.",
    "descEn": "Frangipani, tuberose and vanilla in an intense, enveloping take on femininity.",
    "image": "img/products/prada-la-femme-intense.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "PER-PLF-50",
        "sku": "PER-PLF-50",
        "label": "50 ml",
        "priceUsd": 96,
        "stock": 14,
        "active": true
      }
    ]
  },
  {
    "id": "paco-rabanne-pure-xs-night",
    "slug": "paco-rabanne-pure-xs-night",
    "categorySlug": "perfumeria",
    "brand": "Paco Rabanne",
    "name": "Pure XS Night EDP",
    "descEs": "Oriental ambarado con jengibre, cacao y vainilla bourbon. Seducción nocturna.",
    "descPt": "Oriental ambarado com gengibre, cacau e baunilha bourbon. Sedução noturna.",
    "descEn": "Amber oriental with ginger, cacao and bourbon vanilla. Night-time seduction.",
    "image": "img/products/paco-rabanne-pure-xs-night.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "PER-PXN-50",
        "sku": "PER-PXN-50",
        "label": "50 ml",
        "priceUsd": 78,
        "stock": 16,
        "active": true
      },
      {
        "id": "PER-PXN-100",
        "sku": "PER-PXN-100",
        "label": "100 ml",
        "priceUsd": 105,
        "stock": 10,
        "active": true
      }
    ]
  },
  {
    "id": "lancome-la-vie-est-belle-leclat",
    "slug": "lancome-la-vie-est-belle-leclat",
    "categorySlug": "perfumeria",
    "brand": "Lancôme",
    "name": "La Vie Est Belle L'Éclat EDT",
    "descEs": "La felicidad hecha fragancia: azahar luminoso, jazmín y un fondo cálido de vainilla.",
    "descPt": "A felicidade em fragrância: flor de laranjeira luminosa, jasmim e fundo quente de baunilha.",
    "descEn": "Happiness as a fragrance: luminous orange blossom, jasmine and a warm vanilla base.",
    "image": "img/products/lancome-la-vie-est-belle-leclat.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "PER-LVB-50",
        "sku": "PER-LVB-50",
        "label": "50 ml",
        "priceUsd": 89,
        "stock": 12,
        "active": true
      }
    ]
  },
  {
    "id": "prada-luna-rossa",
    "slug": "prada-luna-rossa",
    "categorySlug": "perfumeria",
    "brand": "Prada",
    "name": "Luna Rossa EDT",
    "descEs": "Frescura deportiva de lavanda y menta inspirada en la vela de competición.",
    "descPt": "Frescor esportivo de lavanda e menta inspirado na vela de competição.",
    "descEn": "Sporty freshness of lavender and mint, inspired by competitive sailing.",
    "image": "img/products/prada-luna-rossa.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "PER-PLR-50",
        "sku": "PER-PLR-50",
        "label": "50 ml",
        "priceUsd": 72,
        "stock": 15,
        "active": true
      },
      {
        "id": "PER-PLR-100",
        "sku": "PER-PLR-100",
        "label": "100 ml",
        "priceUsd": 98,
        "stock": 9,
        "active": true
      }
    ]
  },
  {
    "id": "chanel-n5-edp",
    "slug": "chanel-n5-edp",
    "categorySlug": "perfumeria",
    "brand": "Chanel",
    "name": "N°5 EDP",
    "descEs": "El perfume más famoso del mundo: aldehídos, rosa de mayo y jazmín de Grasse.",
    "descPt": "O perfume mais famoso do mundo: aldeídos, rosa de maio e jasmim de Grasse.",
    "descEn": "The world’s most famous perfume: aldehydes, May rose and Grasse jasmine.",
    "image": "img/products/chanel-n5-edp.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "PER-CH5-50",
        "sku": "PER-CH5-50",
        "label": "50 ml",
        "priceUsd": 128,
        "stock": 10,
        "active": true
      },
      {
        "id": "PER-CH5-100",
        "sku": "PER-CH5-100",
        "label": "100 ml",
        "priceUsd": 168,
        "stock": 6,
        "active": true
      }
    ]
  },
  {
    "id": "dior-sauvage-edt",
    "slug": "dior-sauvage-edt",
    "categorySlug": "perfumeria",
    "brand": "Dior",
    "name": "Sauvage EDT",
    "descEs": "Bergamota de Calabria y ambroxan sobre un fondo mineral. Frescura radicalmente masculina.",
    "descPt": "Bergamota da Calábria e ambroxan sobre um fundo mineral. Frescor radicalmente masculino.",
    "descEn": "Calabrian bergamot and ambroxan over a mineral base. Radically fresh and masculine.",
    "image": "img/products/dior-sauvage-edt.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "PER-DSV-60",
        "sku": "PER-DSV-60",
        "label": "60 ml",
        "priceUsd": 95,
        "stock": 14,
        "active": true
      },
      {
        "id": "PER-DSV-100",
        "sku": "PER-DSV-100",
        "label": "100 ml",
        "priceUsd": 122,
        "stock": 8,
        "active": true
      }
    ]
  },
  {
    "id": "ch-212-vip-rose",
    "slug": "ch-212-vip-rose",
    "categorySlug": "perfumeria",
    "brand": "Carolina Herrera",
    "name": "212 VIP Rosé EDP",
    "descEs": "Champagne rosé, flor de durazno y almizcle: el espíritu de la fiesta neoyorquina.",
    "descPt": "Champagne rosé, flor de pêssego e almíscar: o espírito da festa nova-iorquina.",
    "descEn": "Rosé champagne, peach blossom and musk: the spirit of the New York party.",
    "image": "img/products/ch-212-vip-rose.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "PER-212R-80",
        "sku": "PER-212R-80",
        "label": "80 ml",
        "priceUsd": 92,
        "stock": 12,
        "active": true
      }
    ]
  },
  {
    "id": "armani-acqua-di-gio",
    "slug": "armani-acqua-di-gio",
    "categorySlug": "perfumeria",
    "brand": "Giorgio Armani",
    "name": "Acqua di Giò EDT",
    "descEs": "Un clásico marino mediterráneo: cítricos, jazmín acuático y maderas cálidas.",
    "descPt": "Um clássico marinho mediterrâneo: cítricos, jasmim aquático e madeiras quentes.",
    "descEn": "A Mediterranean marine classic: citrus, aquatic jasmine and warm woods.",
    "image": "img/products/armani-acqua-di-gio.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "PER-ADG-50",
        "sku": "PER-ADG-50",
        "label": "50 ml",
        "priceUsd": 74,
        "stock": 16,
        "active": true
      },
      {
        "id": "PER-ADG-100",
        "sku": "PER-ADG-100",
        "label": "100 ml",
        "priceUsd": 99,
        "stock": 11,
        "active": true
      }
    ]
  },
  {
    "id": "lancome-advanced-genifique",
    "slug": "lancome-advanced-genifique",
    "categorySlug": "perfumeria",
    "brand": "Lancôme",
    "name": "Advanced Génifique Sérum",
    "descEs": "Sérum de tratamiento con prebióticos que fortalece la barrera de la piel y aporta luminosidad.",
    "descPt": "Sérum de tratamento com prebióticos que fortalece a barreira da pele e traz luminosidade.",
    "descEn": "Prebiotic treatment serum that strengthens the skin barrier and restores radiance.",
    "image": "img/products/lancome-advanced-genifique.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "PER-LAG-50",
        "sku": "PER-LAG-50",
        "label": "50 ml",
        "priceUsd": 105,
        "stock": 9,
        "active": true
      }
    ]
  },
  {
    "id": "mac-retro-matte-ruby-woo",
    "slug": "mac-retro-matte-ruby-woo",
    "categorySlug": "perfumeria",
    "brand": "M·A·C",
    "name": "Retro Matte Lipstick Ruby Woo",
    "descEs": "El rojo mate universal de M·A·C, de acabado retro y larga duración.",
    "descPt": "O vermelho fosco universal da M·A·C, com acabamento retrô e longa duração.",
    "descEn": "M·A·C’s universally flattering matte red with a long-wearing retro finish.",
    "image": "img/products/mac-retro-matte-ruby-woo.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "PER-MAC-RW",
        "sku": "PER-MAC-RW",
        "label": "3 g",
        "priceUsd": 21,
        "stock": 30,
        "active": true
      }
    ]
  },
  {
    "id": "xiaomi-redmi-buds",
    "slug": "xiaomi-redmi-buds",
    "categorySlug": "electronica",
    "brand": "Xiaomi",
    "name": "Redmi Buds True Wireless",
    "descEs": "Auriculares true wireless con estuche de carga, Bluetooth 5.3 y cancelación de ruido en llamadas.",
    "descPt": "Fones true wireless com estojo de carga, Bluetooth 5.3 e cancelamento de ruído em chamadas.",
    "descEn": "True wireless earbuds with charging case, Bluetooth 5.3 and call noise cancellation.",
    "image": "img/products/xiaomi-redmi-buds.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "ELE-XRB-TWS",
        "sku": "ELE-XRB-TWS",
        "label": "Único",
        "priceUsd": 29,
        "stock": 42,
        "active": true
      }
    ]
  },
  {
    "id": "logitech-k400-plus",
    "slug": "logitech-k400-plus",
    "categorySlug": "electronica",
    "brand": "Logitech",
    "name": "Teclado Inalámbrico K400 Plus",
    "descEs": "Teclado inalámbrico con touchpad integrado, ideal para smart TV y home office.",
    "descPt": "Teclado sem fio com touchpad integrado, ideal para smart TV e home office.",
    "descEn": "Wireless keyboard with built-in touchpad — perfect for smart TVs and home office.",
    "image": "img/products/logitech-k400-plus.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "ELE-LGK400",
        "sku": "ELE-LGK400",
        "label": "Único",
        "priceUsd": 39,
        "stock": 25,
        "active": true
      }
    ]
  },
  {
    "id": "ue-wonderboom-2",
    "slug": "ue-wonderboom-2",
    "categorySlug": "electronica",
    "brand": "Ultimate Ears",
    "name": "Parlante Portátil Wonderboom 2",
    "descEs": "Parlante portátil resistente al agua con sonido 360° y 13 horas de batería.",
    "descPt": "Caixa de som portátil à prova d’água com som 360° e 13 horas de bateria.",
    "descEn": "Waterproof portable speaker with 360° sound and 13 hours of battery life.",
    "image": "img/products/ue-wonderboom-2.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "ELE-UEWB2",
        "sku": "ELE-UEWB2",
        "label": "Único",
        "priceUsd": 69,
        "stock": 20,
        "active": true
      }
    ]
  },
  {
    "id": "xiaomi-power-bank-2s",
    "slug": "xiaomi-power-bank-2s",
    "categorySlug": "electronica",
    "brand": "Xiaomi",
    "name": "Power Bank 2S 10000 mAh",
    "descEs": "Batería portátil de 10.000 mAh con doble salida USB y carga rápida.",
    "descPt": "Bateria portátil de 10.000 mAh com dupla saída USB e carga rápida.",
    "descEn": "10,000 mAh portable battery with dual USB output and fast charging.",
    "image": "img/products/xiaomi-power-bank-2s.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "ELE-XPB-2S",
        "sku": "ELE-XPB-2S",
        "label": "Único",
        "priceUsd": 25,
        "stock": 35,
        "active": true
      }
    ]
  },
  {
    "id": "jbl-flip-6",
    "slug": "jbl-flip-6",
    "categorySlug": "electronica",
    "brand": "JBL",
    "name": "Parlante JBL Flip 6",
    "descEs": "Sonido JBL Original Pro con graves profundos, IP67 y 12 horas de reproducción.",
    "descPt": "Som JBL Original Pro com graves profundos, IP67 e 12 horas de reprodução.",
    "descEn": "JBL Original Pro sound with deep bass, IP67 rating and 12 hours of playtime.",
    "image": "img/products/jbl-flip-6.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "ELE-JBLF6",
        "sku": "ELE-JBLF6",
        "label": "Único",
        "priceUsd": 119,
        "stock": 16,
        "active": true
      }
    ]
  },
  {
    "id": "sony-wh-ch520",
    "slug": "sony-wh-ch520",
    "categorySlug": "electronica",
    "brand": "Sony",
    "name": "Auriculares WH-CH520",
    "descEs": "Auriculares inalámbricos on-ear con 50 horas de batería y conexión multipunto.",
    "descPt": "Fones sem fio on-ear com 50 horas de bateria e conexão multiponto.",
    "descEn": "Wireless on-ear headphones with 50-hour battery and multipoint connection.",
    "image": "img/products/sony-wh-ch520.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "ELE-SNYCH520",
        "sku": "ELE-SNYCH520",
        "label": "Único",
        "priceUsd": 59,
        "stock": 22,
        "active": true
      }
    ]
  },
  {
    "id": "nintendo-switch-lite",
    "slug": "nintendo-switch-lite",
    "categorySlug": "electronica",
    "brand": "Nintendo",
    "name": "Consola Switch Lite",
    "descEs": "Consola portátil compacta y liviana, dedicada al juego en modo portátil.",
    "descPt": "Console portátil compacto e leve, dedicado ao jogo em modo portátil.",
    "descEn": "Compact, lightweight handheld console dedicated to portable play.",
    "image": "img/products/nintendo-switch-lite.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "ELE-NSWL",
        "sku": "ELE-NSWL",
        "label": "Único",
        "priceUsd": 219,
        "stock": 10,
        "active": true
      }
    ]
  },
  {
    "id": "toblerone-leche-360",
    "slug": "toblerone-leche-360",
    "categorySlug": "comestibles",
    "brand": "Toblerone",
    "name": "Chocolate con Leche 360 g",
    "descEs": "El triángulo suizo clásico con miel y turrón de almendras. Formato viajero de 360 g.",
    "descPt": "O triângulo suíço clássico com mel e torrone de amêndoas. Formato viagem de 360 g.",
    "descEn": "The classic Swiss triangle with honey and almond nougat. 360 g travel format.",
    "image": "img/products/toblerone-leche-360.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "COM-TOB-360",
        "sku": "COM-TOB-360",
        "label": "360 g",
        "priceUsd": 12,
        "stock": 60,
        "active": true
      }
    ]
  },
  {
    "id": "lindt-lindor-surtido-200",
    "slug": "lindt-lindor-surtido-200",
    "categorySlug": "comestibles",
    "brand": "Lindt",
    "name": "Lindor Surtido 200 g",
    "descEs": "Bombones Lindor de centro cremoso en surtido de leche, blanco y amargo.",
    "descPt": "Bombons Lindor de centro cremoso em sortido ao leite, branco e amargo.",
    "descEn": "Lindor truffles with a smooth melting centre — milk, white and dark assortment.",
    "image": "img/products/lindt-lindor-surtido-200.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "COM-LIN-200",
        "sku": "COM-LIN-200",
        "label": "200 g",
        "priceUsd": 11,
        "stock": 45,
        "active": true
      }
    ]
  },
  {
    "id": "ferrero-rocher-t24",
    "slug": "ferrero-rocher-t24",
    "categorySlug": "comestibles",
    "brand": "Ferrero",
    "name": "Ferrero Rocher x24",
    "descEs": "Avellana entera, crema de avellanas y oblea crocante bañada en chocolate. Caja x24.",
    "descPt": "Avelã inteira, creme de avelãs e wafer crocante banhado em chocolate. Caixa x24.",
    "descEn": "Whole hazelnut, hazelnut cream and crisp wafer coated in chocolate. Box of 24.",
    "image": "img/products/ferrero-rocher-t24.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "COM-FER-T24",
        "sku": "COM-FER-T24",
        "label": "Caja x24",
        "priceUsd": 15,
        "stock": 38,
        "active": true
      }
    ]
  },
  {
    "id": "mms-peanut-400",
    "slug": "mms-peanut-400",
    "categorySlug": "comestibles",
    "brand": "M&M's",
    "name": "M&M's Peanut 400 g",
    "descEs": "Maní recubierto de chocolate con leche y confite de colores, en bolsa familiar.",
    "descPt": "Amendoim coberto de chocolate ao leite e confeito colorido, em embalagem família.",
    "descEn": "Peanuts covered in milk chocolate and colourful candy shell — family size bag.",
    "image": "img/products/mms-peanut-400.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "COM-MMS-400",
        "sku": "COM-MMS-400",
        "label": "400 g",
        "priceUsd": 9,
        "stock": 50,
        "active": true
      }
    ]
  },
  {
    "id": "havanna-alfajores-12",
    "slug": "havanna-alfajores-12",
    "categorySlug": "comestibles",
    "brand": "Havanna",
    "name": "Alfajores Mixtos x12",
    "descEs": "El alfajor argentino por excelencia: dulce de leche y chocolate o merengue italiano.",
    "descPt": "O alfajor argentino por excelência: doce de leite e chocolate ou merengue italiano.",
    "descEn": "Argentina’s signature alfajor: dulce de leche with chocolate or Italian meringue.",
    "image": "img/products/havanna-alfajores-12.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "COM-HAV-12",
        "sku": "COM-HAV-12",
        "label": "Caja x12",
        "priceUsd": 18,
        "stock": 30,
        "active": true
      }
    ]
  },
  {
    "id": "twinings-english-breakfast",
    "slug": "twinings-english-breakfast",
    "categorySlug": "comestibles",
    "brand": "Twinings",
    "name": "English Breakfast x100",
    "descEs": "Blend clásico de té negro, robusto y equilibrado. Caja de 100 saquitos.",
    "descPt": "Blend clássico de chá preto, robusto e equilibrado. Caixa com 100 sachês.",
    "descEn": "Classic robust and balanced black tea blend. Box of 100 tea bags.",
    "image": "img/products/twinings-english-breakfast.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "COM-TWI-100",
        "sku": "COM-TWI-100",
        "label": "Caja x100",
        "priceUsd": 10,
        "stock": 26,
        "active": true
      }
    ]
  },
  {
    "id": "rayban-aviator-classic",
    "slug": "rayban-aviator-classic",
    "categorySlug": "moda",
    "brand": "Ray-Ban",
    "name": "Aviator Classic",
    "descEs": "El icónico aviador con lentes de cristal G-15 y protección UV total.",
    "descPt": "O icônico aviador com lentes de cristal G-15 e proteção UV total.",
    "descEn": "The iconic aviator with G-15 crystal lenses and full UV protection.",
    "image": "img/products/rayban-aviator-classic.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "MOD-RBA-G15",
        "sku": "MOD-RBA-G15",
        "label": "Único",
        "priceUsd": 129,
        "stock": 14,
        "active": true
      }
    ]
  },
  {
    "id": "casio-gshock-ga2100",
    "slug": "casio-gshock-ga2100",
    "categorySlug": "moda",
    "brand": "Casio",
    "name": "G-Shock GA-2100",
    "descEs": "Resistencia G-Shock en perfil ultra delgado, con carcasa octogonal de carbono.",
    "descPt": "Resistência G-Shock em perfil ultrafino, com caixa octogonal de carbono.",
    "descEn": "G-Shock toughness in an ultra-slim profile with octagonal carbon case.",
    "image": "img/products/casio-gshock-ga2100.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "MOD-GSH-2100",
        "sku": "MOD-GSH-2100",
        "label": "Único",
        "priceUsd": 99,
        "stock": 12,
        "active": true
      }
    ]
  },
  {
    "id": "swatch-big-bold",
    "slug": "swatch-big-bold",
    "categorySlug": "moda",
    "brand": "Swatch",
    "name": "Big Bold",
    "descEs": "Reloj suizo de 47 mm con espíritu urbano y correa de silicona.",
    "descPt": "Relógio suíço de 47 mm com espírito urbano e pulseira de silicone.",
    "descEn": "A 47 mm Swiss watch with urban attitude and silicone strap.",
    "image": "img/products/swatch-big-bold.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "MOD-SWA-BB",
        "sku": "MOD-SWA-BB",
        "label": "Único",
        "priceUsd": 85,
        "stock": 15,
        "active": true
      }
    ]
  },
  {
    "id": "tommy-billetera-cuero",
    "slug": "tommy-billetera-cuero",
    "categorySlug": "moda",
    "brand": "Tommy Hilfiger",
    "name": "Billetera de Cuero",
    "descEs": "Billetera plegable de cuero genuino con múltiples tarjeteros y monedero.",
    "descPt": "Carteira dobrável de couro genuíno com vários porta-cartões e porta-moedas.",
    "descEn": "Genuine leather bifold wallet with multiple card slots and coin pocket.",
    "image": "img/products/tommy-billetera-cuero.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "MOD-TH-WAL",
        "sku": "MOD-TH-WAL",
        "label": "Único",
        "priceUsd": 49,
        "stock": 20,
        "active": true
      }
    ]
  },
  {
    "id": "pashmina-austral",
    "slug": "pashmina-austral",
    "categorySlug": "moda",
    "brand": "Atlántico Sur Selection",
    "name": "Pashmina Seda y Lana",
    "descEs": "Pashmina suave de seda y lana, perfecta para el clima fueguino. Varios colores.",
    "descPt": "Pashmina macia de seda e lã, perfeita para o clima fueguino. Várias cores.",
    "descEn": "Soft silk-and-wool pashmina, perfect for the Fuegian climate. Assorted colours.",
    "image": "img/products/pashmina-austral.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "MOD-PSH-AUS",
        "sku": "MOD-PSH-AUS",
        "label": "Único",
        "priceUsd": 35,
        "stock": 24,
        "active": true
      }
    ]
  },
  {
    "id": "lego-classic-creativa",
    "slug": "lego-classic-creativa",
    "categorySlug": "juguetes",
    "brand": "LEGO",
    "name": "Classic Caja Creativa 484 pzs",
    "descEs": "Ladrillos LEGO de 33 colores con ruedas, ojos y piezas especiales para crear sin límites.",
    "descPt": "Peças LEGO em 33 cores com rodas, olhos e peças especiais para criar sem limites.",
    "descEn": "LEGO bricks in 33 colours with wheels, eyes and special pieces for limitless building.",
    "image": "img/products/lego-classic-creativa.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "JUG-LEG-484",
        "sku": "JUG-LEG-484",
        "label": "484 piezas",
        "priceUsd": 45,
        "stock": 18,
        "active": true
      }
    ]
  },
  {
    "id": "hot-wheels-pack5",
    "slug": "hot-wheels-pack5",
    "categorySlug": "juguetes",
    "brand": "Hot Wheels",
    "name": "Pack x5 Vehículos",
    "descEs": "Cinco vehículos Hot Wheels a escala 1:64 con diseños temáticos surtidos.",
    "descPt": "Cinco veículos Hot Wheels em escala 1:64 com designs temáticos sortidos.",
    "descEn": "Five 1:64-scale Hot Wheels vehicles in assorted themed designs.",
    "image": "img/products/hot-wheels-pack5.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "JUG-HW-P5",
        "sku": "JUG-HW-P5",
        "label": "Pack x5",
        "priceUsd": 12,
        "stock": 34,
        "active": true
      }
    ]
  },
  {
    "id": "uno-cartas",
    "slug": "uno-cartas",
    "categorySlug": "juguetes",
    "brand": "Mattel Games",
    "name": "UNO Clásico",
    "descEs": "El juego de cartas más famoso del mundo, para toda la familia. De 2 a 10 jugadores.",
    "descPt": "O jogo de cartas mais famoso do mundo, para toda a família. De 2 a 10 jogadores.",
    "descEn": "The world’s most famous card game, fun for the whole family. 2 to 10 players.",
    "image": "img/products/uno-cartas.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "JUG-UNO",
        "sku": "JUG-UNO",
        "label": "Único",
        "priceUsd": 8,
        "stock": 40,
        "active": true
      }
    ]
  },
  {
    "id": "peluche-pinguino-austral",
    "slug": "peluche-pinguino-austral",
    "categorySlug": "juguetes",
    "brand": "Wild Republic",
    "name": "Peluche Pingüino Austral 30 cm",
    "descEs": "Un recuerdo del fin del mundo: pingüino de peluche súper suave de 30 cm.",
    "descPt": "Uma lembrança do fim do mundo: pinguim de pelúcia super macio de 30 cm.",
    "descEn": "A keepsake from the end of the world: super-soft 30 cm penguin plush.",
    "image": "img/products/peluche-pinguino-austral.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "JUG-PIN-30",
        "sku": "JUG-PIN-30",
        "label": "30 cm",
        "priceUsd": 19,
        "stock": 28,
        "active": true
      }
    ]
  },
  {
    "id": "cubo-rubik-3x3",
    "slug": "cubo-rubik-3x3",
    "categorySlug": "juguetes",
    "brand": "Rubik's",
    "name": "Cubo Rubik 3x3",
    "descEs": "El rompecabezas clásico de 43 trillones de combinaciones y una sola solución.",
    "descPt": "O quebra-cabeça clássico de 43 trilhões de combinações e uma única solução.",
    "descEn": "The classic puzzle: 43 quintillion combinations, only one solution.",
    "image": "img/products/cubo-rubik-3x3.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "JUG-RUB-3X3",
        "sku": "JUG-RUB-3X3",
        "label": "Único",
        "priceUsd": 14,
        "stock": 32,
        "active": true
      }
    ]
  },
  {
    "id": "samsonite-cabina-55",
    "slug": "samsonite-cabina-55",
    "categorySlug": "viaje",
    "brand": "Samsonite",
    "name": "Valija Cabina 55 cm",
    "descEs": "Valija rígida de cabina con 4 ruedas dobles, candado TSA y garantía internacional.",
    "descPt": "Mala rígida de cabine com 4 rodas duplas, cadeado TSA e garantia internacional.",
    "descEn": "Hard-shell cabin case with 4 double wheels, TSA lock and international warranty.",
    "image": "img/products/samsonite-cabina-55.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "VIA-SAM-55",
        "sku": "VIA-SAM-55",
        "label": "55 cm",
        "priceUsd": 189,
        "stock": 10,
        "active": true
      }
    ]
  },
  {
    "id": "swissgear-mochila-28",
    "slug": "swissgear-mochila-28",
    "categorySlug": "viaje",
    "brand": "SwissGear",
    "name": "Mochila Urbana 28 L",
    "descEs": "Mochila de 28 litros con compartimento acolchado para notebook de 15,6\".",
    "descPt": "Mochila de 28 litros com compartimento acolchoado para notebook de 15,6\".",
    "descEn": "28-litre backpack with padded compartment for a 15.6\" laptop.",
    "image": "img/products/swissgear-mochila-28.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "VIA-SWG-28",
        "sku": "VIA-SWG-28",
        "label": "28 L",
        "priceUsd": 79,
        "stock": 16,
        "active": true
      }
    ]
  },
  {
    "id": "samsonite-neceser",
    "slug": "samsonite-neceser",
    "categorySlug": "viaje",
    "brand": "Samsonite",
    "name": "Neceser de Viaje",
    "descEs": "Neceser compacto con gancho colgante y bolsillos internos impermeables.",
    "descPt": "Nécessaire compacta com gancho suspenso e bolsos internos impermeáveis.",
    "descEn": "Compact toiletry kit with hanging hook and waterproof inner pockets.",
    "image": "img/products/samsonite-neceser.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "VIA-SAM-NEC",
        "sku": "VIA-SAM-NEC",
        "label": "Único",
        "priceUsd": 32,
        "stock": 22,
        "active": true
      }
    ]
  },
  {
    "id": "cabeau-almohada-viaje",
    "slug": "cabeau-almohada-viaje",
    "categorySlug": "viaje",
    "brand": "Cabeau",
    "name": "Almohada de Viaje Evolution",
    "descEs": "Almohada cervical viscoelástica con soporte 360° y funda lavable.",
    "descPt": "Travesseiro cervical viscoelástico com suporte 360° e capa lavável.",
    "descEn": "Memory-foam neck pillow with 360° support and washable cover.",
    "image": "img/products/cabeau-almohada-viaje.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "VIA-CAB-EVO",
        "sku": "VIA-CAB-EVO",
        "label": "Único",
        "priceUsd": 39,
        "stock": 20,
        "active": true
      }
    ]
  },
  {
    "id": "stanley-termo-clasico",
    "slug": "stanley-termo-clasico",
    "categorySlug": "home",
    "brand": "Stanley",
    "name": "Termo Clásico 1 L",
    "descEs": "El termo legendario: acero inoxidable, 24 horas de temperatura y garantía de por vida.",
    "descPt": "A garrafa térmica lendária: aço inox, 24 horas de temperatura e garantia vitalícia.",
    "descEn": "The legendary flask: stainless steel, 24-hour temperature retention, lifetime warranty.",
    "image": "img/products/stanley-termo-clasico.svg",
    "featured": true,
    "active": true,
    "variants": [
      {
        "id": "HOM-STA-1L",
        "sku": "HOM-STA-1L",
        "label": "1 L",
        "priceUsd": 55,
        "stock": 24,
        "active": true
      }
    ]
  },
  {
    "id": "set-matero-austral",
    "slug": "set-matero-austral",
    "categorySlug": "home",
    "brand": "Atlántico Sur Selection",
    "name": "Set Matero Calabaza + Bombilla",
    "descEs": "Mate de calabaza curado con virola de alpaca y bombilla pico de loro.",
    "descPt": "Cuia de porongo curada com detalhe de alpaca e bomba pico de loro.",
    "descEn": "Cured gourd mate with alpaca trim and traditional bombilla straw.",
    "image": "img/products/set-matero-austral.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "HOM-MAT-SET",
        "sku": "HOM-MAT-SET",
        "label": "Set",
        "priceUsd": 28,
        "stock": 26,
        "active": true
      }
    ]
  },
  {
    "id": "victorinox-swiss-classic",
    "slug": "victorinox-swiss-classic",
    "categorySlug": "home",
    "brand": "Victorinox",
    "name": "Set Cuchillos Swiss Classic",
    "descEs": "Set de cuchillos de cocina suizos con hojas de acero inoxidable de alta precisión.",
    "descPt": "Conjunto de facas de cozinha suíças com lâminas de aço inox de alta precisão.",
    "descEn": "Swiss kitchen knife set with high-precision stainless steel blades.",
    "image": "img/products/victorinox-swiss-classic.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "HOM-VIC-SET",
        "sku": "HOM-VIC-SET",
        "label": "Set x3",
        "priceUsd": 42,
        "stock": 18,
        "active": true
      }
    ]
  },
  {
    "id": "bialetti-moka-express",
    "slug": "bialetti-moka-express",
    "categorySlug": "home",
    "brand": "Bialetti",
    "name": "Moka Express 3 Tazas",
    "descEs": "La cafetera italiana original de aluminio, ícono del espresso casero desde 1933.",
    "descPt": "A cafeteira italiana original de alumínio, ícone do espresso caseiro desde 1933.",
    "descEn": "The original Italian aluminium coffee maker, a home-espresso icon since 1933.",
    "image": "img/products/bialetti-moka-express.svg",
    "featured": false,
    "active": true,
    "variants": [
      {
        "id": "HOM-BIA-3T",
        "sku": "HOM-BIA-3T",
        "label": "3 tazas",
        "priceUsd": 36,
        "stock": 21,
        "active": true
      }
    ]
  }
];
