// ============================================================================
// MOTOR DE COLEÇÕES / FILTROS AUTOMÁTICOS
// ----------------------------------------------------------------------------
// A partir dos atributos de cada produto (src/lib/attributes.ts), este módulo
// DERIVA automaticamente todas as páginas de filtro do catálogo:
//   • Marca            → páginas /brand/:slug já existentes (curadas)
//   • Categorias ricas → páginas /produtos/:slug já existentes (curadas)
//   • Filtros novos    → páginas /c/:slug (formato, cor de costura,
//                        materiais específicos, features) geradas por este motor
//
// Um produto aparece em TODAS as coleções cujo predicado corresponde aos seus
// atributos — nunca é preciso escolher categorias à mão, e nunca aparece numa
// coleção incorreta. Adicionar um produto = definir os atributos uma vez.
// ============================================================================

import { BRANDS, type Brand, type BrandModel } from "@/lib/brands";
import {
  attr,
  FORMAT_LABELS,
  LINE_LABELS,
  MATERIAL_LABELS,
  STITCH_LABELS,
  FEATURE_LABELS,
  type Format,
  type Line,
  type Material,
  type Stitch,
  type Feature,
} from "@/lib/attributes";
import fallbackHero from "@/assets/hero-steering.jpg";

export type CollectionGroup = "marca" | "formato" | "linha" | "material" | "costura" | "feature";

export type Collection = {
  key: string;
  /** Slug do URL. Coleções curadas usam `curatedPath`; as novas vivem em /c/:urlSlug */
  urlSlug: string;
  group: CollectionGroup;
  title: string;
  subtitle: string;
  intro: string;
  metaDescription: string;
  /** Se preenchido, o link aponta para uma página já existente (marca ou categoria premium). */
  curatedPath?: string;
  /** Predicado de pertença, calculado a partir dos atributos do produto. */
  match: (brand: Brand, model: BrandModel) => boolean;
};

export type ResolvedProduct = { brand: Brand; model: BrandModel };

/** Só produtos finalizados/fotografados (com atributos) entram nas coleções. */
function isClassifiable(model: BrandModel): boolean {
  return attr.hasAny(model.attributes);
}

/** Devolve todos os {brand, model} que pertencem a uma coleção. */
export function getProductsForCollection(col: Collection): ResolvedProduct[] {
  const out: ResolvedProduct[] = [];
  for (const brand of BRANDS) {
    for (const model of brand.models) {
      if (!isClassifiable(model)) continue;
      if (col.match(brand, model)) out.push({ brand, model });
    }
  }
  return out;
}

/** Imagem de hero para uma coleção: primeira imagem de produto correspondente. */
export function collectionHero(col: Collection): string {
  const first = getProductsForCollection(col)[0];
  return first?.model.img ?? fallbackHero;
}

// ---------------------------------------------------------------------------
// Construtores de coleções por grupo de atributos
// ---------------------------------------------------------------------------
const brandCollections: Collection[] = BRANDS.map((b) => ({
  key: `marca-${b.slug}`,
  urlSlug: b.slug,
  group: "marca",
  title: b.name,
  subtitle: b.tagline,
  intro: `Volantes personalizados REDLINE compatíveis com a gama ${b.name}.`,
  metaDescription: `Volantes personalizados premium para ${b.name}. ${b.description}`,
  curatedPath: `/brand/${b.slug}`,
  match: (brand) => brand.slug === b.slug,
}));

const formatCollections: Collection[] = (["flat-bottom", "round"] as Format[]).map((f) => ({
  key: `formato-${f}`,
  urlSlug: `formato-${f}`,
  group: "formato",
  title: `Volantes ${FORMAT_LABELS[f]}`,
  subtitle: f === "flat-bottom" ? "Base achatada, postura desportiva" : "Aro redondo, elegância clássica",
  intro:
    f === "flat-bottom"
      ? "Volantes com base achatada (flat bottom), a assinatura das edições desportivas — mais espaço para as pernas e uma postura de condução focada na pista."
      : "Volantes de aro redondo (round), a geometria clássica e intemporal, ideal para uma condução refinada e confortável.",
  metaDescription: `Volantes ${FORMAT_LABELS[f]} personalizados REDLINE Performance. Acabamentos premium em carbono, Alcantara e pele.`,
  match: (_b, m) => attr.isFormat(m.attributes, f),
}));

const lineCollections: Collection[] = (["desportivo", "original"] as Line[]).map((l) => ({
  key: `linha-${l}`,
  urlSlug: `linha-${l}`,
  group: "linha",
  title: LINE_LABELS[l],
  subtitle: l === "desportivo" ? "Postura M / RS / AMG" : "Discreto e de série",
  intro:
    l === "desportivo"
      ? "Volantes de linha desportiva, inspirados nas edições M Performance, RS e AMG, com materiais e geometria orientados para a condução dinâmica."
      : "Volantes de linha original, que preservam a estética de série com um upgrade de materiais e acabamento.",
  metaDescription: `${LINE_LABELS[l]} personalizado REDLINE Performance.`,
  match: (_b, m) => attr.isLine(m.attributes, l),
}));

// Materiais específicos (o guarda-chuva "carbono" e alcantara/pele-perfurada
// têm páginas premium curadas — ver curatedCategoryCollections abaixo).
const specificMaterials: Material[] = [
  "pele-lisa",
  "nappa",
  "carbono-forjado",
  "carbono-brilhante",
  "carbono-mate",
  "carbono-colorido",
];
const materialCollections: Collection[] = specificMaterials.map((mat) => ({
  key: `material-${mat}`,
  urlSlug: `material-${mat}`,
  group: "material",
  title: MATERIAL_LABELS[mat],
  subtitle: "Acabamento premium",
  intro: `Volantes com acabamento em ${MATERIAL_LABELS[mat]}, aplicado à mão com o padrão de qualidade REDLINE.`,
  metaDescription: `Volantes em ${MATERIAL_LABELS[mat]} — personalização premium REDLINE Performance.`,
  match: (_b, m) => attr.hasMaterial(m.attributes, mat),
}));

const stitchCollections: Collection[] = (
  ["vermelha", "azul", "branca", "amarela", "verde", "tricolor-m"] as Stitch[]
).map((s) => ({
  key: `costura-${s}`,
  urlSlug: `costura-${s}`,
  group: "costura",
  title: STITCH_LABELS[s],
  subtitle: "Costura artesanal ponto a ponto",
  intro: `Volantes com ${STITCH_LABELS[s].toLowerCase()}, feitas à mão por mestres-artesãos com acabamento OEM+.`,
  metaDescription: `Volantes com ${STITCH_LABELS[s].toLowerCase()} — costura personalizada REDLINE Performance.`,
  match: (_b, m) => attr.hasStitch(m.attributes, s),
}));

// Features específicas (led-shift, patilhas e oem-plus têm páginas premium
// curadas — ver curatedCategoryCollections abaixo).
const specificFeatures: Feature[] = [
  "display-digital",
  "patilhas-carbono",
  "aquecimento",
  "botoes-multifuncoes",
  "faixa-central",
  "faixa-12h",
  "insercoes",
];
const featureCollections: Collection[] = specificFeatures.map((f) => ({
  key: `feature-${f}`,
  urlSlug: `feature-${f}`,
  group: "feature",
  title: FEATURE_LABELS[f],
  subtitle: "Detalhe exclusivo",
  intro: `Volantes com ${FEATURE_LABELS[f]}, um detalhe que eleva a experiência ao volante ao nível de uma marca premium.`,
  metaDescription: `Volantes com ${FEATURE_LABELS[f]} — personalização REDLINE Performance.`,
  match: (_b, m) => attr.hasFeature(m.attributes, f),
}));

// ---------------------------------------------------------------------------
// Coleções que correspondem às 7 páginas premium já existentes (/produtos/*).
// Aqui só definimos o predicado + metadados para o HUB de filtros; o conteúdo
// rico dessas páginas continua em categoryPages.ts.
// ---------------------------------------------------------------------------
export const curatedCategoryCollections: Collection[] = [
  {
    key: "cat-alcantara",
    urlSlug: "alcantara",
    group: "material",
    title: "Revestimento em Alcantara",
    subtitle: "Aderência e toque premium",
    intro: "",
    metaDescription: "",
    curatedPath: "/produtos/alcantara",
    match: (_b, m) => attr.hasMaterial(m.attributes, "alcantara"),
  },
  {
    key: "cat-pele-perfurada",
    urlSlug: "pele-perfurada",
    group: "material",
    title: "Revestimento em Pele Perfurada",
    subtitle: "GT intemporal",
    intro: "",
    metaDescription: "",
    curatedPath: "/produtos/pele-perfurada",
    match: (_b, m) => attr.hasMaterial(m.attributes, "pele-perfurada"),
  },
  {
    key: "cat-carbono",
    urlSlug: "fibra-de-carbono",
    group: "material",
    title: "Fibra de Carbono",
    subtitle: "Twill e Forged",
    intro: "",
    metaDescription: "",
    curatedPath: "/produtos/fibra-de-carbono",
    match: (_b, m) => attr.anyCarbon(m.attributes),
  },
  {
    key: "cat-costuras",
    urlSlug: "costuras-personalizadas",
    group: "costura",
    title: "Costuras Personalizadas",
    subtitle: "Cor, ponto e padrão",
    intro: "",
    metaDescription: "",
    curatedPath: "/produtos/costuras-personalizadas",
    match: (_b, m) => attr.anyStitch(m.attributes),
  },
  {
    key: "cat-led-shift",
    urlSlug: "volante-led",
    group: "feature",
    title: "LED de Mudança de Caixa",
    subtitle: "Cockpit de competição",
    intro: "",
    metaDescription: "",
    curatedPath: "/produtos/volante-led",
    match: (_b, m) => attr.hasFeature(m.attributes, "led-shift"),
  },
  {
    key: "cat-patilhas",
    urlSlug: "patilhas",
    group: "feature",
    title: "Patilhas de Velocidade",
    subtitle: "Alumínio CNC / Carbono",
    intro: "",
    metaDescription: "",
    curatedPath: "/produtos/patilhas",
    match: (_b, m) => attr.anyPatilhas(m.attributes),
  },
  {
    key: "cat-oem-plus",
    urlSlug: "oem-plus",
    group: "feature",
    title: "Personalização OEM+",
    subtitle: "Parecem de fábrica — só que melhores",
    intro: "",
    metaDescription: "",
    curatedPath: "/produtos/oem-plus",
    match: (_b, m) =>
      attr.hasFeature(m.attributes, "oem-plus") ||
      attr.hasFeature(m.attributes, "insercoes") ||
      attr.hasFeature(m.attributes, "display-digital"),
  },
];

// ---------------------------------------------------------------------------
// Registos exportados
// ---------------------------------------------------------------------------

/** Coleções que têm uma página GENÉRICA própria em /c/:urlSlug (as novas). */
export const GENERIC_COLLECTIONS: Collection[] = [
  ...formatCollections,
  ...lineCollections,
  ...materialCollections,
  ...stitchCollections,
  ...featureCollections,
];

/** Todas as coleções, incluindo as curadas (para o HUB de filtros). */
export const ALL_COLLECTIONS: Collection[] = [
  ...brandCollections,
  ...curatedCategoryCollections,
  ...GENERIC_COLLECTIONS,
];

const GENERIC_BY_SLUG = new Map(GENERIC_COLLECTIONS.map((c) => [c.urlSlug, c]));

export function getGenericCollection(urlSlug: string): Collection | undefined {
  return GENERIC_BY_SLUG.get(urlSlug);
}

/** Coleções agrupadas para o hub de navegação/filtros. */
export function collectionsByGroup(): Record<CollectionGroup, Collection[]> {
  const groups: Record<CollectionGroup, Collection[]> = {
    marca: [],
    formato: [],
    linha: [],
    material: [],
    costura: [],
    feature: [],
  };
  for (const c of ALL_COLLECTIONS) groups[c.group].push(c);
  return groups;
}

export const GROUP_LABELS: Record<CollectionGroup, string> = {
  marca: "Marca",
  formato: "Formato",
  linha: "Linha",
  material: "Material / Acabamento",
  costura: "Cor de Costura",
  feature: "Funcionalidades",
};
