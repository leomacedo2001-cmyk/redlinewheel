// ============================================================================
// SISTEMA DE ATRIBUTOS — Fonte única de verdade para a classificação de produtos
// ----------------------------------------------------------------------------
// Cada produto declara os seus atributos (derivados da análise das imagens).
// As categorias, filtros e páginas NÃO têm listas manuais: a pertença de um
// produto a cada página é CALCULADA a partir destes atributos.
// Isto elimina classificações incorretas e garante que um produto aparece
// automaticamente em TODAS as páginas compatíveis (e em nenhuma incorreta).
// ============================================================================

export type Format = "flat-bottom" | "round";

export type Line = "desportivo" | "original";

export type Material =
  | "alcantara"
  | "pele-perfurada"
  | "pele-lisa"
  | "nappa"
  | "carbono" // carbono twill clássico
  | "carbono-forjado"
  | "carbono-brilhante"
  | "carbono-mate"
  | "carbono-colorido";

export type Stitch =
  | "vermelha"
  | "azul"
  | "branca"
  | "amarela"
  | "verde"
  | "tricolor-m"
  | "personalizada";

export type Feature =
  | "led-shift"
  | "display-digital"
  | "patilhas"
  | "patilhas-carbono"
  | "aquecimento"
  | "botoes-multifuncoes"
  | "faixa-central"
  | "faixa-12h"
  | "insercoes"
  | "oem-plus";

export type ProductAttributes = {
  formato?: Format;
  linha?: Line;
  materiais?: Material[];
  costuras?: Stitch[];
  features?: Feature[];
};

// ---------------------------------------------------------------------------
// Rótulos legíveis (PT-PT) — usados nos títulos/labels das páginas de filtro.
// ---------------------------------------------------------------------------
export const FORMAT_LABELS: Record<Format, string> = {
  "flat-bottom": "Flat Bottom",
  round: "Round (Redondo)",
};

export const LINE_LABELS: Record<Line, string> = {
  desportivo: "Volante Desportivo",
  original: "Volante Original",
};

export const MATERIAL_LABELS: Record<Material, string> = {
  alcantara: "Alcantara",
  "pele-perfurada": "Pele Perfurada",
  "pele-lisa": "Pele Lisa",
  nappa: "Pele Nappa",
  carbono: "Fibra de Carbono",
  "carbono-forjado": "Carbono Forjado",
  "carbono-brilhante": "Carbono Brilhante",
  "carbono-mate": "Carbono Mate",
  "carbono-colorido": "Carbono Colorido",
};

export const STITCH_LABELS: Record<Stitch, string> = {
  vermelha: "Costuras Vermelhas",
  azul: "Costuras Azuis",
  branca: "Costuras Brancas",
  amarela: "Costuras Amarelas",
  verde: "Costuras Verdes",
  "tricolor-m": "Costuras Tricolor M",
  personalizada: "Costuras Personalizadas",
};

export const FEATURE_LABELS: Record<Feature, string> = {
  "led-shift": "LED de Mudança de Caixa",
  "display-digital": "Display Digital",
  patilhas: "Patilhas",
  "patilhas-carbono": "Patilhas em Carbono",
  aquecimento: "Aquecimento",
  "botoes-multifuncoes": "Botões Multifunções",
  "faixa-central": "Faixa Central",
  "faixa-12h": "Faixa às 12 Horas",
  insercoes: "Inserções Especiais",
  "oem-plus": "OEM+",
};

// ---------------------------------------------------------------------------
// Predicados reutilizáveis. TODAS as páginas (categorias curadas + filtros
// automáticos) usam estes predicados — DRY e sem duplicação de lógica.
// ---------------------------------------------------------------------------
const mats = (a?: ProductAttributes) => a?.materiais ?? [];
const stitches = (a?: ProductAttributes) => a?.costuras ?? [];
const feats = (a?: ProductAttributes) => a?.features ?? [];

export const attr = {
  hasMaterial: (a: ProductAttributes | undefined, m: Material) => mats(a).includes(m),
  /** Qualquer variante de carbono (twill, forjado, brilhante, mate, colorido). */
  anyCarbon: (a?: ProductAttributes) => mats(a).some((x) => x.startsWith("carbono")),
  hasStitch: (a: ProductAttributes | undefined, s: Stitch) => stitches(a).includes(s),
  anyStitch: (a?: ProductAttributes) => stitches(a).length > 0,
  hasFeature: (a: ProductAttributes | undefined, f: Feature) => feats(a).includes(f),
  /** Patilhas standard OU em carbono. */
  anyPatilhas: (a?: ProductAttributes) =>
    feats(a).some((f) => f === "patilhas" || f === "patilhas-carbono"),
  isFormat: (a: ProductAttributes | undefined, f: Format) => a?.formato === f,
  isLine: (a: ProductAttributes | undefined, l: Line) => a?.linha === l,
  /** Um produto está "classificável" se tiver pelo menos um atributo real. */
  hasAny: (a?: ProductAttributes) =>
    Boolean(a && (a.formato || a.linha || mats(a).length || stitches(a).length || feats(a).length)),
};
