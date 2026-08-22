/**
 * Pré-preenchimento do configurador a partir de um volante do catálogo.
 *
 * REGRA CENTRAL: nunca inventar. Um campo só é pré-selecionado quando existe
 * correspondência DIRETA entre o atributo declarado do produto e uma opção que
 * já existe no configurador. Quando não existe (ex.: a cor da faixa das 12h,
 * que os atributos não guardam), o campo fica sem seleção — o cliente escolhe.
 *
 * As listas de opções vivem em `configuratorOptions.ts` e são partilhadas com
 * a página do configurador, para o mapeamento não poder ficar dessincronizado
 * das opções realmente apresentadas.
 */

import type { BrandModel } from "@/lib/brands";
import { attr, type ProductAttributes } from "@/lib/attributes";
import { CARBONO, COR_COSTURAS, COR_FAIXA, MATERIAL, TIPO_VOLANTE, EXTRAS } from "@/lib/configuratorOptions";
import { getFitments } from "@/lib/fitment";

export type ConfiguratorPrefill = {
  marca: string;
  modelo: string;
  chassis: string;
  /** Sem correspondência possível a partir do produto — fica sempre vazio. */
  ano: string;
  tipo: string;
  material: string;
  carbono: string;
  costuras: string;
  faixa: string;
  extras: string[];
  /** Nome completo do produto de base, para o aviso "Estás a personalizar: …". */
  baseName: string;
};

export const EMPTY_PREFILL: ConfiguratorPrefill = {
  marca: "",
  modelo: "",
  chassis: "",
  ano: "",
  tipo: "",
  material: "",
  carbono: "",
  costuras: "",
  faixa: "",
  extras: [],
  baseName: "",
};

/** Tipo de volante — só a partir do formato/linha declarados. */
function mapTipo(a: ProductAttributes | undefined): string {
  if (!a) return "";
  if (a.formato === "flat-bottom") return TIPO_VOLANTE.FLAT_BOTTOM;
  if (attr.hasFeature(a, "oem-plus")) return TIPO_VOLANTE.OEM_PLUS;
  if (a.linha === "original") return TIPO_VOLANTE.ORIGINAL;
  // "round" sozinho não corresponde a nenhuma opção do configurador — fica vazio.
  return "";
}

/** Material principal — combinações primeiro, para não perder informação. */
function mapMaterial(a: ProductAttributes | undefined): string {
  if (!a) return "";
  const alcantara = attr.hasMaterial(a, "alcantara");
  const carbon = attr.anyCarbon(a);
  const pele =
    attr.hasMaterial(a, "pele-perfurada") || attr.hasMaterial(a, "pele-lisa") || attr.hasMaterial(a, "nappa");

  if (alcantara && carbon) return MATERIAL.ALCANTARA_CARBONO;
  if (alcantara && pele) return MATERIAL.ALCANTARA_PELE;
  if (alcantara) return MATERIAL.ALCANTARA;
  if (attr.hasMaterial(a, "pele-perfurada")) return MATERIAL.PELE_PERFURADA;
  if (attr.hasMaterial(a, "nappa") || attr.hasMaterial(a, "pele-lisa")) return MATERIAL.PELE_LISA;
  return "";
}

/** Fibra de carbono — tipo declarado; "Sem carbono" só quando o produto é mesmo sem carbono. */
function mapCarbono(a: ProductAttributes | undefined): string {
  if (!a) return "";
  if (!attr.anyCarbon(a)) {
    // Só afirmamos "sem carbono" se o produto tiver materiais declarados.
    return (a.materiais?.length ?? 0) > 0 ? CARBONO.SEM : "";
  }
  if (attr.hasMaterial(a, "carbono-forjado")) return CARBONO.FORGED;
  if (attr.hasMaterial(a, "carbono")) return CARBONO.TWILL;
  if (attr.hasMaterial(a, "alcantara")) return CARBONO.COM_ALCANTARA;
  // carbono brilhante/mate/colorido não têm opção equivalente — fica vazio.
  return "";
}

/** Cor das costuras — cores diretas; verde e "personalizada" caem em "Outra". */
function mapCosturas(a: ProductAttributes | undefined): string {
  if (!a) return "";
  if (attr.hasStitch(a, "tricolor-m")) return COR_COSTURAS.TRICOLOR;
  if (attr.hasStitch(a, "vermelha")) return COR_COSTURAS.VERMELHO;
  if (attr.hasStitch(a, "azul")) return COR_COSTURAS.AZUL;
  if (attr.hasStitch(a, "branca")) return COR_COSTURAS.BRANCO;
  if (attr.hasStitch(a, "amarela")) return COR_COSTURAS.AMARELO;
  if (attr.hasStitch(a, "verde") || attr.hasStitch(a, "personalizada")) return COR_COSTURAS.OUTRA;
  return "";
}

/**
 * Faixa central (12h). Os atributos dizem SE existe faixa, nunca de que cor —
 * por isso só conseguimos afirmar "Sem faixa". Havendo faixa, fica sem seleção.
 */
function mapFaixa(a: ProductAttributes | undefined): string {
  if (!a) return "";
  const temFaixa = attr.hasFeature(a, "faixa-12h") || attr.hasFeature(a, "faixa-central");
  if (temFaixa) return "";
  return (a.features?.length ?? 0) > 0 ? COR_FAIXA.SEM : "";
}

/** Extras — só features com opção equivalente no configurador. */
function mapExtras(a: ProductAttributes | undefined): string[] {
  if (!a) return [];
  const out: string[] = [];
  if (attr.hasFeature(a, "led-shift")) out.push(EXTRAS.LED);
  // A opção do configurador é explicitamente "em alumínio": patilhas em carbono
  // não correspondem, por isso não são pré-selecionadas.
  if (attr.hasFeature(a, "patilhas") && !attr.hasFeature(a, "patilhas-carbono")) out.push(EXTRAS.PATILHAS);
  if (attr.hasFeature(a, "aquecimento")) out.push(EXTRAS.AQUECIMENTO);
  return out;
}

/** "BMW G-Series Forged Magenta Signature" já diz "BMW" — não prefixar outra vez. */
function baseNameOf(brandName: string, modelName: string): string {
  const firstWord = brandName.split(/[\s-]/)[0]?.toLowerCase() ?? "";
  const mentionsBrand = firstWord.length >= 3 && modelName.toLowerCase().includes(firstWord);
  return mentionsBrand ? modelName : `${brandName} ${modelName}`.trim();
}

/**
 * Constrói o pré-preenchimento. Nunca lança: um produto sem `attributes`
 * devolve simplesmente marca/chassis e o resto vazio.
 */
export function buildPrefill(brandName: string, model: BrandModel): ConfiguratorPrefill {
  const a = model.attributes;
  // Mesma fonte normalizada da ficha e da validação de compra.
  const summary = getFitments(brandName, model);

  return {
    marca: brandName,
    // "Modelo" e "Chassis" são do CARRO do cliente. Só pré-preenchemos o que é
    // INEQUÍVOCO: o modelo quando o volante serve um único veículo declarado, e
    // o chassis quando é o mesmo em todas as compatibilidades. Havendo várias
    // hipóteses, o campo fica vazio — escolher uma seria decidir pelo cliente.
    modelo: summary.fitments.length === 1 ? summary.fitments[0].model : "",
    chassis: summary.commonChassis ?? "",
    ano: "",
    tipo: mapTipo(a),
    material: mapMaterial(a),
    carbono: mapCarbono(a),
    costuras: mapCosturas(a),
    faixa: mapFaixa(a),
    extras: mapExtras(a),
    baseName: baseNameOf(brandName, model.name),
  };
}
