/**
 * Validação de compatibilidade veículo ↔ volante.
 *
 * Corre exclusivamente sobre a estrutura normalizada de `fitment.ts`, que é a
 * mesma que a ficha mostra e que o configurador usa para pré-preencher. Não há
 * aqui nenhuma segunda leitura dos campos livres do catálogo.
 *
 * Não inventa compatibilidades: se o que o cliente escreve não bate com nada do
 * que está declarado no produto, o resultado é "precisa de confirmação manual"
 * — nunca um erro, nunca uma confirmação assumida.
 */

import { normalizeText, type Fitment, type FitmentSummary } from "@/lib/fitment";

export type VehicleInput = {
  marca: string;
  modelo: string;
  ano: string;
  chassis: string;
};

export type CompatibilityResult = {
  /** "confirmada" = deu para validar com os dados declarados do produto. */
  status: "confirmada" | "manual";
  brandMatch: boolean;
  modelMatch: boolean;
  /** A entrada do catálogo que fez o match, para mostrar ao cliente. */
  matchedOn?: string;
  /** Anos declarados da entrada que fez o match, quando existem. */
  matchedYears?: { from: number; to?: number };
};

/** Duas designações "encontram-se" se uma contém a outra (evita falsos positivos curtos). */
function looseMatch(a: string, b: string): boolean {
  const x = normalizeText(a);
  const y = normalizeText(b);
  if (x.length < 2 || y.length < 2) return false;
  return x === y || x.includes(y) || y.includes(x);
}

/** Todos os textos por que uma entrada pode ser reconhecida. */
function candidatesOf(f: Fitment): string[] {
  return [f.raw, f.model, f.chassis].filter((v): v is string => Boolean(v));
}

export function checkCompatibility(summary: FitmentSummary, input: VehicleInput): CompatibilityResult {
  const brandName = summary.fitments[0]?.brand ?? "";
  // "Outras Marcas" é um agrupamento, não uma marca — nunca confirma por aí.
  const brandIsGeneric = normalizeText(brandName).includes("outrasmarcas");
  const brandMatch = !brandIsGeneric && looseMatch(brandName, input.marca);

  // O cliente pode identificar o carro pelo modelo comercial ou pelo chassis.
  const typed = [input.modelo, input.chassis].filter((v) => v.trim().length > 0);

  let matched: Fitment | undefined;
  outer: for (const value of typed) {
    for (const f of summary.fitments) {
      if (candidatesOf(f).some((c) => looseMatch(c, value))) {
        matched = f;
        break outer;
      }
    }
  }

  // O rótulo de geração declarado também vale como identificação ("F15/F16").
  let matchedLabel: string | undefined = matched?.raw;
  if (!matched && summary.generationLabel) {
    const label = summary.generationLabel;
    const hit = typed.some((v) => label.split("/").some((code) => looseMatch(code, v)));
    if (hit) matchedLabel = label;
  }

  const modelMatch = Boolean(matchedLabel);

  return {
    status: brandMatch && modelMatch ? "confirmada" : "manual",
    brandMatch,
    modelMatch,
    matchedOn: modelMatch ? matchedLabel : undefined,
    matchedYears: matched?.years,
  };
}

/** Linhas do veículo para o corpo de um email — usado no pedido manual e no orçamento. */
export function vehicleLines(input: VehicleInput): string[] {
  return [
    `Marca: ${input.marca || "-"}`,
    `Modelo: ${input.modelo || "-"}`,
    `Ano: ${input.ano || "-"}`,
    `Chassis / geração: ${input.chassis || "-"}`,
  ];
}
