import hero from "@/assets/hero-steering.jpg";
import wheel from "@/assets/wheel-showcase.jpg";
import carbono from "@/assets/product-carbono.jpg";
import volanteCompleto from "@/assets/product-volante-completo.jpg";
import ledShift from "@/assets/product-led-shift.jpg";
import pelePerfurada from "@/assets/product-pele-perfurada.jpg";
import oemPlus from "@/assets/product-oem-plus.jpg";
import alcantara from "@/assets/product-alcantara.jpg";

// BMW G80 (G-Series) — Carbono Forjado com flocos magenta + Alcântara
import bmwG80_1 from "@/assets/bmw-g80-forged-1.jpg.asset.json";
import bmwG80_2 from "@/assets/bmw-g80-forged-2.jpg.asset.json";
import bmwG80_3 from "@/assets/bmw-g80-forged-3.jpg.asset.json";
import bmwG80_4 from "@/assets/bmw-g80-forged-4.jpg.asset.json";
import bmwG80_5 from "@/assets/bmw-g80-forged-5.jpg.asset.json";
import bmwG80_6 from "@/assets/bmw-g80-forged-6.jpg.asset.json";

// BMW F80 (F-Series) — Carbono + Pele Perfurada com detalhe vermelho
import bmwF80_1 from "@/assets/bmw-f80-carbon-1.jpg.asset.json";
import bmwF80_2 from "@/assets/bmw-f80-carbon-2.jpg.asset.json";
import bmwF80_3 from "@/assets/bmw-f80-carbon-3.jpg.asset.json";
import bmwF80_4 from "@/assets/bmw-f80-carbon-4.jpg.asset.json";

// Novas fotografias reais dos volantes
import bmwF30Alc from "@/assets/bmw-f30-alcantara-1.jpg.asset.json";
import bmwF30Blue from "@/assets/bmw-f30-mperf-blue-1.jpg.asset.json";
import bmwG20Blue from "@/assets/bmw-g20-blue-carbon-1.jpg.asset.json";
import audi8yCarbon from "@/assets/audi-8y-carbon-1.jpg.asset.json";
import audiB8Blue from "@/assets/audi-b8-rs-blue-1.jpg.asset.json";
import porsche991 from "@/assets/porsche-991-carbon-1.jpg.asset.json";
import mbW205Yellow from "@/assets/mercedes-w205-amg-yellow-1.jpg.asset.json";
import mbW213Edition1 from "@/assets/mercedes-w213-amg-edition1-1.jpg.asset.json";
import mbW213Red from "@/assets/mercedes-w213-amg-red-1.jpg.asset.json";
import mbW213Forged from "@/assets/mercedes-w213-amg-forged-red-1.jpg.asset.json";

const G80_GALLERY = [bmwG80_1.url, bmwG80_2.url, bmwG80_3.url, bmwG80_4.url, bmwG80_5.url, bmwG80_6.url];
const F80_GALLERY = [bmwF80_1.url, bmwF80_2.url, bmwF80_3.url, bmwF80_4.url];

export type BrandModelSpec = { label: string; value: string };

export type BrandModel = {
  slug: string;
  name: string;
  chassis?: string;
  description: string;
  longDescription?: string;
  img: string;
  gallery?: string[];
  compatibilities: string[];
  specs?: BrandModelSpec[];
  sku?: string;
  price?: { amount: number; currency: string };
  status?: "Disponível" | "Sob Encomenda" | "Em Breve";
  /**
   * Handle do produto no Shopify. Se omitido, é usado `${brand.slug}-${model.slug}`.
   * Cria o produto no Shopify Admin com esse handle para ativar carrinho/checkout.
   */
  shopifyHandle?: string;
};

/** Resolve o handle Shopify para um modelo (default: `${brandSlug}-${modelSlug}`). */
export function resolveShopifyHandle(brandSlug: string, model: BrandModel): string {
  return model.shopifyHandle ?? `${brandSlug}-${model.slug}`;
}

export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  img: string;
  description: string;
  models: BrandModel[];
};

const m = (model: BrandModel): BrandModel => model;

const defaultGallery = [hero, wheel, carbono, volanteCompleto];

export const BRANDS: Brand[] = [
  {
    slug: "bmw",
    name: "BMW",
    tagline: "M Performance Heritage",
    img: hero,
    description:
      "Volantes inspirados nas edições M Performance, com acabamentos em Alcântara, carbono e costuras tricolor M. Organizados por geração/chassis para garantir compatibilidade direta.",
    models: [
      m({
        slug: "e87",
        name: "BMW E87",
        chassis: "E87 / E81 / E82 / E88",
        description: "Volante para Série 1 primeira geração (2004–2013).",
        longDescription:
          "Volante desenhado para a primeira geração da Série 1 BMW. Compatível com airbag original, com possibilidade de acabamentos em pele perfurada, Alcântara ou carbono. Costuras tricolor M opcionais.",
        img: pelePerfurada,
        gallery: [pelePerfurada, alcantara, carbono, hero],
        compatibilities: ["116i", "118i", "120i", "120d", "123d", "130i", "135i", "1M Coupé"],
        specs: [
          { label: "Geração", value: "E87 (2004–2013)" },
          { label: "Diâmetro", value: "370 mm" },
          { label: "Material base", value: "Pele Nappa / Alcântara" },
          { label: "Airbag", value: "Original BMW" },
        ],
        sku: "RL-BMW-E87",
        price: { amount: 549, currency: "EUR" },
        status: "Sob Encomenda",
      }),
      m({
        slug: "e90",
        name: "BMW E90 / E91 / E92 / E93",
        chassis: "E9x",
        description: "Volante para Série 3 (2005–2013), incluindo M3 E92.",
        longDescription:
          "Volante para a icónica geração E9x da Série 3, incluindo Sedan (E90), Touring (E91), Coupé (E92) e Cabrio (E93). Compatível com M3 E92 V8.",
        img: alcantara,
        gallery: [alcantara, carbono, pelePerfurada, hero],
        compatibilities: ["318i", "320i", "320d", "325i", "330i", "335i", "M3 E92"],
        specs: [
          { label: "Geração", value: "E9x (2005–2013)" },
          { label: "Diâmetro", value: "370 mm" },
          { label: "Material base", value: "Alcântara / Carbono" },
          { label: "Patilhas", value: "Opcional alumínio" },
        ],
        sku: "RL-BMW-E90",
        price: { amount: 649, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "f20",
        name: "BMW F20 / F21",
        chassis: "F2x",
        description: "Volante para Série 1 segunda geração (2011–2019).",
        img: carbono,
        gallery: [carbono, ledShift, alcantara, hero],
        compatibilities: ["116i", "118i", "120i", "120d", "125i", "M135i", "M140i"],
        specs: [
          { label: "Geração", value: "F20/F21 (2011–2019)" },
          { label: "Diâmetro", value: "370 mm" },
          { label: "Material base", value: "Alcântara + Carbono" },
        ],
        sku: "RL-BMW-F20",
        price: { amount: 699, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "f30",
        name: "BMW F30 / F31 / F32 / F33 / F36",
        chassis: "F3x / F8x",
        description: "Volante para Série 3 e Série 4 F-Series. Compatível com M3 F80 e M4 F82.",
        longDescription:
          "Volante BMW F-Series em carbono fosco com pele perfurada premium, detalhe central vermelho M Performance e patilhas de mudança em carbono vermelho. Costuras tricolor M (azul/violeta/vermelho). Compatível com airbag original.",
        img: F80_GALLERY[0],
        gallery: F80_GALLERY,
        compatibilities: ["320i", "320d", "330i", "335i", "340i", "M3 F80", "M4 F82", "M2 F87"],
        specs: [
          { label: "Geração", value: "F30/F32 (2012–2019)" },
          { label: "Diâmetro", value: "370 mm" },
          { label: "Material", value: "Carbono + Pele Perfurada" },
          { label: "Patilhas", value: "Carbono Vermelho" },
          { label: "Costura", value: "Tricolor M" },
          { label: "LED Shift", value: "Opcional" },
        ],
        sku: "RL-BMW-F30",
        price: { amount: 749, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "f10",
        name: "BMW F10 / F11 / F06 / F12 / F13",
        chassis: "F1x",
        description: "Volante para Série 5, Série 6 e M5 F10.",
        img: hero,
        gallery: [hero, alcantara, carbono, oemPlus],
        compatibilities: ["520d", "525d", "530i", "535i", "550i", "M5 F10", "640i", "M6 F06"],
        specs: [
          { label: "Geração", value: "F10/F11 (2010–2017)" },
          { label: "Diâmetro", value: "375 mm" },
          { label: "Material base", value: "Nappa / Alcântara" },
        ],
        sku: "RL-BMW-F10",
        price: { amount: 729, currency: "EUR" },
        status: "Sob Encomenda",
      }),
      m({
        slug: "g20",
        name: "BMW G20 / G21",
        chassis: "G2x",
        description: "Volante para Série 3 actual (2019+) e M3 G80.",
        longDescription:
          "Volante BMW G-Series em carbono forjado com flocos magenta exclusivos, aros em Alcântara premium com costuras amarelas em zig-zag, patilhas de mudança em carbono e botões M1/M2 vermelhos. Display bar superior integrado. Marca 12h em amarelo racing.",
        img: G80_GALLERY[0],
        gallery: G80_GALLERY,
        compatibilities: ["320i", "320d", "330i", "330e", "340i", "M3 G80", "M3 Touring G81", "M4 G82"],
        specs: [
          { label: "Geração", value: "G20/G21 (2019+)" },
          { label: "Diâmetro", value: "370 mm" },
          { label: "Material", value: "Carbono Forjado + Alcântara" },
          { label: "Flocos", value: "Magenta Exclusivo" },
          { label: "LED Shift", value: "Integrado" },
          { label: "Patilhas", value: "Carbono" },
          { label: "Costura", value: "Amarela Racing" },
        ],
        sku: "RL-BMW-G20",
        price: { amount: 899, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "g30",
        name: "BMW G30 / G31",
        chassis: "G3x",
        description: "Volante para Série 5 actual e M5 F90.",
        img: volanteCompleto,
        gallery: [volanteCompleto, oemPlus, alcantara, hero],
        compatibilities: ["520d", "530i", "530e", "540i", "M550i", "M5 F90"],
        specs: [
          { label: "Geração", value: "G30/G31 (2017+)" },
          { label: "Diâmetro", value: "375 mm" },
          { label: "Material base", value: "Nappa / Alcântara" },
        ],
        sku: "RL-BMW-G30",
        price: { amount: 849, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "x5-f15",
        name: "BMW X5 F15 / X6 F16",
        chassis: "F15 / F16",
        description: "Volante para SUV X5 e X6 geração F (2013–2018).",
        img: wheel,
        gallery: [wheel, alcantara, oemPlus, hero],
        compatibilities: ["X5 25d", "X5 30d", "X5 40d", "X5 50i", "X5 M F85", "X6 30d", "X6 M F86"],
        specs: [
          { label: "Geração", value: "F15/F16 (2013–2018)" },
          { label: "Diâmetro", value: "380 mm" },
        ],
        sku: "RL-BMW-X5F15",
        price: { amount: 779, currency: "EUR" },
        status: "Sob Encomenda",
      }),
      m({
        slug: "x5-g05",
        name: "BMW X5 G05 / X6 G06 / X7 G07",
        chassis: "G05 / G06 / G07",
        description: "Volante para SUV X5, X6 e X7 actuais e X5M / X6M F95/F96.",
        img: carbono,
        gallery: [carbono, ledShift, oemPlus, hero],
        compatibilities: ["X5 30d", "X5 45e", "X5 M50i", "X5 M F95", "X6 M F96", "X7"],
        specs: [
          { label: "Geração", value: "G05/G06/G07 (2018+)" },
          { label: "Diâmetro", value: "380 mm" },
          { label: "LED Shift", value: "Opcional" },
        ],
        sku: "RL-BMW-X5G05",
        price: { amount: 929, currency: "EUR" },
        status: "Disponível",
      }),
    ],
  },
  {
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    tagline: "AMG Inspired Craft",
    img: alcantara,
    description:
      "Volantes em pele Nappa e Alcântara, com costuras à mão e detalhes AMG. Organizados por chassis/geração para Classe A, C, E e gama AMG.",
    models: [
      m({
        slug: "w204",
        name: "Mercedes W204",
        chassis: "W204 / S204 / C204",
        description: "Classe C (2007–2014) e C63 AMG W204.",
        img: alcantara,
        compatibilities: ["C180", "C200", "C220 CDI", "C250", "C350", "C63 AMG W204"],
        specs: [{ label: "Geração", value: "W204 (2007–2014)" }, { label: "Diâmetro", value: "370 mm" }],
        sku: "RL-MB-W204",
        price: { amount: 649, currency: "EUR" },
        status: "Sob Encomenda",
      }),
      m({
        slug: "w205",
        name: "Mercedes W205",
        chassis: "W205 / S205 / C205 / A205",
        description: "Classe C (2014–2021) e gama AMG C43/C63 W205.",
        img: pelePerfurada,
        compatibilities: ["C180", "C200", "C220d", "C300", "C43 AMG", "C63 AMG W205"],
        specs: [{ label: "Geração", value: "W205 (2014–2021)" }, { label: "Patilhas", value: "Alumínio" }],
        sku: "RL-MB-W205",
        price: { amount: 749, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "w213",
        name: "Mercedes W213",
        chassis: "W213 / S213",
        description: "Classe E (2016+) e E63 AMG S.",
        img: oemPlus,
        compatibilities: ["E200", "E220d", "E300", "E350", "E43 AMG", "E63 AMG S"],
        specs: [{ label: "Geração", value: "W213 (2016+)" }],
        sku: "RL-MB-W213",
        price: { amount: 829, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "w176",
        name: "Mercedes W176",
        chassis: "W176",
        description: "Classe A (2012–2018) incluindo A45 AMG.",
        img: carbono,
        compatibilities: ["A180", "A200", "A220d", "A250", "A45 AMG"],
        specs: [{ label: "Geração", value: "W176 (2012–2018)" }],
        sku: "RL-MB-W176",
        price: { amount: 699, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "w177",
        name: "Mercedes W177",
        chassis: "W177",
        description: "Classe A actual (2018+) e A35/A45 AMG.",
        img: ledShift,
        compatibilities: ["A180", "A200", "A220", "A35 AMG", "A45 AMG S"],
        specs: [{ label: "Geração", value: "W177 (2018+)" }, { label: "LED Shift", value: "Integrado" }],
        sku: "RL-MB-W177",
        price: { amount: 829, currency: "EUR" },
        status: "Disponível",
      }),
    ],
  },
  {
    slug: "audi",
    name: "Audi",
    tagline: "RS Performance Edition",
    img: pelePerfurada,
    description:
      "Volantes para gama A, S e RS, organizados por plataforma. Acabamentos em Alcântara, carbono forged e patilhas em alumínio CNC.",
    models: [
      m({
        slug: "8v",
        name: "Audi 8V",
        chassis: "8V",
        description: "A3 / S3 / RS3 (2012–2020).",
        img: pelePerfurada,
        compatibilities: ["A3 8V", "S3 8V", "RS3 8V"],
        specs: [{ label: "Geração", value: "8V (2012–2020)" }],
        sku: "RL-AUDI-8V",
        price: { amount: 699, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "8y",
        name: "Audi 8Y",
        chassis: "8Y",
        description: "A3 / S3 / RS3 actual (2020+).",
        img: carbono,
        compatibilities: ["A3 8Y", "S3 8Y", "RS3 8Y"],
        specs: [{ label: "Geração", value: "8Y (2020+)" }, { label: "LED Shift", value: "Opcional" }],
        sku: "RL-AUDI-8Y",
        price: { amount: 849, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "b8",
        name: "Audi B8 / B8.5",
        chassis: "B8",
        description: "A4 / S4 / RS4 / A5 / S5 / RS5 (2007–2016).",
        img: oemPlus,
        compatibilities: ["A4 B8", "S4 B8", "RS4 B8", "A5 B8", "S5 B8", "RS5 B8"],
        specs: [{ label: "Geração", value: "B8 (2007–2016)" }],
        sku: "RL-AUDI-B8",
        price: { amount: 729, currency: "EUR" },
        status: "Sob Encomenda",
      }),
      m({
        slug: "b9",
        name: "Audi B9",
        chassis: "B9",
        description: "A4 / S4 / RS4 / A5 / S5 / RS5 (2016+).",
        img: ledShift,
        compatibilities: ["A4 B9", "S4 B9", "RS4 B9", "A5 B9", "RS5 B9"],
        specs: [{ label: "Geração", value: "B9 (2016+)" }],
        sku: "RL-AUDI-B9",
        price: { amount: 829, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "c7",
        name: "Audi C7 / C8",
        chassis: "C7 / C8",
        description: "A6 / S6 / RS6 e A7 / RS7 (2011+).",
        img: hero,
        compatibilities: ["A6 C7", "RS6 C7", "A6 C8", "RS6 C8", "RS7 C8"],
        specs: [{ label: "Geração", value: "C7/C8 (2011+)" }],
        sku: "RL-AUDI-C7",
        price: { amount: 879, currency: "EUR" },
        status: "Disponível",
      }),
    ],
  },
  {
    slug: "volkswagen",
    name: "Volkswagen",
    tagline: "GTI & R Custom",
    img: volanteCompleto,
    description: "Volantes desportivos para a gama GTI, R e modelos premium VW, organizados por plataforma MQB.",
    models: [
      m({
        slug: "golf-6",
        name: "Golf MK6 / Scirocco",
        chassis: "MK6 / 1K",
        description: "Golf 6 GTI/R e Scirocco R.",
        img: volanteCompleto,
        compatibilities: ["Golf 6 GTI", "Golf 6 R", "Scirocco R"],
        specs: [{ label: "Geração", value: "MK6 (2008–2013)" }],
        sku: "RL-VW-MK6",
        price: { amount: 599, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "golf-7",
        name: "Golf MK7 / MK7.5",
        chassis: "MK7",
        description: "Golf 7 GTI, Golf R, GTI Clubsport.",
        img: carbono,
        compatibilities: ["Golf 7 GTI", "Golf 7 R", "Golf 7 GTI TCR"],
        specs: [{ label: "Geração", value: "MK7 (2013–2020)" }],
        sku: "RL-VW-MK7",
        price: { amount: 699, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "golf-8",
        name: "Golf MK8",
        chassis: "MK8",
        description: "Golf 8 GTI, GTI Clubsport, Golf R 8.",
        img: ledShift,
        compatibilities: ["Golf 8 GTI", "Golf 8 GTI Clubsport", "Golf 8 R"],
        specs: [{ label: "Geração", value: "MK8 (2020+)" }],
        sku: "RL-VW-MK8",
        price: { amount: 799, currency: "EUR" },
        status: "Disponível",
      }),
    ],
  },
  {
    slug: "porsche",
    name: "Porsche",
    tagline: "GT Style Precision",
    img: wheel,
    description: "Inspiração GT3 e GT4. Volantes em Alcântara, carbono e pele Nappa com costuras de competição.",
    models: [
      m({
        slug: "991",
        name: "Porsche 991",
        chassis: "991.1 / 991.2",
        description: "911 (2012–2019) incluindo GT3 e Turbo S.",
        img: alcantara,
        compatibilities: ["911 Carrera", "911 Turbo", "911 GT3", "911 GT3 RS"],
        sku: "RL-POR-991",
        price: { amount: 1190, currency: "EUR" },
        status: "Sob Encomenda",
      }),
      m({
        slug: "992",
        name: "Porsche 992",
        chassis: "992",
        description: "911 actual (2019+).",
        img: carbono,
        compatibilities: ["911 Carrera 992", "911 Turbo S 992", "911 GT3 992"],
        sku: "RL-POR-992",
        price: { amount: 1290, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "macan-95b",
        name: "Porsche Macan 95B",
        chassis: "95B",
        description: "Macan e Macan GTS / Turbo.",
        img: wheel,
        compatibilities: ["Macan", "Macan S", "Macan GTS", "Macan Turbo"],
        sku: "RL-POR-MACAN",
        price: { amount: 949, currency: "EUR" },
        status: "Disponível",
      }),
    ],
  },
  {
    slug: "tesla",
    name: "Tesla",
    tagline: "Modern Performance",
    img: oemPlus,
    description: "Upgrades modernos para Model 3, Y e S — incluindo volantes yoke e formatos round redesenhados.",
    models: [
      m({
        slug: "model-3-y",
        name: "Tesla Model 3 / Model Y",
        chassis: "Model 3 / Y",
        description: "Volantes Round e Yoke para Model 3 e Model Y (todas as versões).",
        img: oemPlus,
        compatibilities: ["Model 3", "Model 3 Performance", "Model Y", "Model Y Performance"],
        sku: "RL-TSL-3Y",
        price: { amount: 899, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "model-s-x",
        name: "Tesla Model S / Model X",
        chassis: "Model S / X",
        description: "Volantes Yoke e Round para Model S Plaid e Model X.",
        img: hero,
        compatibilities: ["Model S", "Model S Plaid", "Model X", "Model X Plaid"],
        sku: "RL-TSL-SX",
        price: { amount: 1190, currency: "EUR" },
        status: "Sob Encomenda",
      }),
    ],
  },
  {
    slug: "toyota",
    name: "Toyota",
    tagline: "Track-Ready Series",
    img: ledShift,
    description: "Volantes para a gama GR Performance, com foco em pista e condução desportiva.",
    models: [
      m({
        slug: "gr-yaris",
        name: "Toyota GR Yaris",
        chassis: "XP210 GR",
        description: "Hot-hatch de homologação rali.",
        img: ledShift,
        compatibilities: ["GR Yaris", "GR Yaris Circuit Pack"],
        sku: "RL-TOY-GRY",
        price: { amount: 849, currency: "EUR" },
        status: "Disponível",
      }),
      m({
        slug: "supra-a90",
        name: "Toyota Supra A90",
        chassis: "A90 / J29",
        description: "Coupé GT moderno (partilha plataforma com BMW Z4 G29).",
        img: hero,
        compatibilities: ["Supra 2.0", "Supra 3.0", "Supra A90 MT"],
        sku: "RL-TOY-A90",
        price: { amount: 899, currency: "EUR" },
        status: "Disponível",
      }),
    ],
  },
  {
    slug: "outras-marcas",
    name: "Outras Marcas",
    tagline: "Compatibilidade Total",
    img: carbono,
    description: "Trabalhamos sob consulta com várias outras marcas. Contacta-nos com o teu modelo.",
    models: [
      m({
        slug: "cupra-leon",
        name: "Cupra Leon / Formentor",
        chassis: "MQB Evo",
        description: "Gama Cupra performance.",
        img: ledShift,
        compatibilities: ["Cupra Leon", "Cupra Formentor VZ"],
        sku: "RL-CUP-MQB",
        price: { amount: 749, currency: "EUR" },
        status: "Sob Encomenda",
      }),
      m({
        slug: "civic-fk8",
        name: "Honda Civic Type R FK8",
        chassis: "FK8",
        description: "Hot-hatch icónico da Honda.",
        img: pelePerfurada,
        compatibilities: ["Civic Type R FK8"],
        sku: "RL-HON-FK8",
        price: { amount: 729, currency: "EUR" },
        status: "Sob Encomenda",
      }),
      m({
        slug: "megane-rs",
        name: "Renault Megane RS",
        chassis: "RS Mk3 / Mk4",
        description: "Megane RS 250/265/275 e Megane RS IV.",
        img: volanteCompleto,
        compatibilities: ["Megane RS 265", "Megane RS Trophy", "Megane RS IV"],
        sku: "RL-REN-RS",
        price: { amount: 699, currency: "EUR" },
        status: "Sob Encomenda",
      }),
    ],
  },
];

// Backfill galleries
BRANDS.forEach((b) =>
  b.models.forEach((mo) => {
    if (!mo.gallery || mo.gallery.length === 0) mo.gallery = defaultGallery;
  })
);

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function getBrandModel(brandSlug: string, modelSlug: string) {
  const brand = getBrand(brandSlug);
  if (!brand) return undefined;
  const model = brand.models.find((mo) => mo.slug === modelSlug);
  if (!model) return undefined;
  return { brand, model };
}
