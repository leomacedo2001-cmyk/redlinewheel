// ============================================================================
// GERADOR AUTOMÁTICO DE DESCRIÇÕES
// ----------------------------------------------------------------------------
// A partir dos atributos de um produto, gera uma descrição profissional no
// padrão do catálogo REDLINE — clara, consistente, tecnicamente correta e
// otimizada para SEO. NUNCA inventa características: usa apenas o que está nos
// atributos (que por sua vez derivam da análise das imagens).
//
// Uso recomendado: ao criar um produto novo, se não escreveres uma
// `longDescription` à mão, chama buildAutoDescription() para obter uma base
// consistente. Também alimenta a checklist de validação (validate-catalog).
// ============================================================================

import type { Brand, BrandModel } from "@/lib/brands";
import {
  FORMAT_LABELS,
  MATERIAL_LABELS,
  STITCH_LABELS,
  FEATURE_LABELS,
  type ProductAttributes,
} from "@/lib/attributes";

function joinPt(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

/** Lista de specs (label/value) coerente, derivada dos atributos. */
export function buildAutoSpecs(model: BrandModel): { label: string; value: string }[] {
  const a: ProductAttributes = model.attributes ?? {};
  const specs: { label: string; value: string }[] = [];
  if (a.formato) specs.push({ label: "Formato", value: FORMAT_LABELS[a.formato] });
  if (a.materiais?.length)
    specs.push({ label: "Materiais", value: a.materiais.map((m) => MATERIAL_LABELS[m]).join(" + ") });
  if (a.costuras?.length)
    specs.push({ label: "Costura", value: a.costuras.map((s) => STITCH_LABELS[s]).join(", ") });
  if (a.features?.length)
    specs.push({ label: "Detalhes", value: a.features.map((f) => FEATURE_LABELS[f]).join(", ") });
  return specs;
}

/** Descrição longa profissional no padrão do catálogo. */
export function buildAutoDescription(brand: Brand, model: BrandModel): string {
  const a: ProductAttributes = model.attributes ?? {};
  const parts: string[] = [];

  const formato = a.formato ? FORMAT_LABELS[a.formato].toLowerCase() : "";
  const abertura = formato
    ? `Volante ${formato} ${brand.name} ${model.name}, produzido à mão pela REDLINE Performance.`
    : `Volante ${brand.name} ${model.name}, produzido à mão pela REDLINE Performance.`;
  parts.push(abertura);

  if (a.materiais?.length) {
    const mats = joinPt(a.materiais.map((m) => MATERIAL_LABELS[m].toLowerCase()));
    parts.push(`Acabamento em ${mats}, aplicado nas zonas de pegada e secções do aro com rigor artesanal.`);
  }
  if (a.costuras?.length) {
    const st = joinPt(a.costuras.map((s) => STITCH_LABELS[s].toLowerCase()));
    parts.push(`Costura à mão com ${st}.`);
  }
  if (a.features?.length) {
    const ft = joinPt(a.features.map((f) => FEATURE_LABELS[f].toLowerCase()));
    parts.push(`Inclui ${ft}.`);
  }
  if (model.compatibilities?.length) {
    parts.push(`Compatível com ${joinPt(model.compatibilities)}.`);
  }
  parts.push("Airbag e sensores originais preservados, instalação não destrutiva.");

  return parts.join(" ");
}
