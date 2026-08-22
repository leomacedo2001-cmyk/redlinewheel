/**
 * Validação de compatibilidade veículo ↔ volante.
 *
 * Corre inteiramente com os dados que já existem no catálogo — `brand.name`,
 * `model.chassis` e `model.compatibilities`. Não inventa compatibilidades: se
 * o que o cliente escreve não bate com nada do que está declarado no produto,
 * o resultado é "precisa de confirmação manual", nunca um erro nem uma
 * confirmação inventada.
 */

export type VehicleInput = {
  marca: string;
  modelo: string;
  ano: string;
  chassis: string;
};

export type CompatibilityResult = {
  /** "confirmada" = deu para validar com os dados do produto. */
  status: "confirmada" | "manual";
  /** Marca do cliente bate com a marca do produto. */
  brandMatch: boolean;
  /** Modelo ou chassis do cliente bate com uma compatibilidade declarada. */
  modelMatch: boolean;
  /** A entrada exata do catálogo que fez o match (para mostrar ao cliente). */
  matchedOn?: string;
};

/** minúsculas, sem acentos, só letras e dígitos — "M3 Touring G81" -> "m3touringg81" */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Duas designações "encontram-se" se uma contém a outra (evita falsos positivos curtos). */
function looseMatch(a: string, b: string): boolean {
  const x = norm(a);
  const y = norm(b);
  if (x.length < 2 || y.length < 2) return false;
  return x === y || x.includes(y) || y.includes(x);
}

export type CompatibilitySource = {
  brandName: string;
  /** Chassis/geração declarado no produto, quando existe. */
  chassis?: string;
  /** Lista de compatibilidades declarada no produto. */
  compatibilities: string[];
};

export function checkCompatibility(src: CompatibilitySource, input: VehicleInput): CompatibilityResult {
  // A marca "Outras Marcas" é um agrupamento, não uma marca real — nunca dá
  // para confirmar automaticamente por aí.
  const brandIsGeneric = norm(src.brandName).includes("outrasmarcas");
  const brandMatch = !brandIsGeneric && looseMatch(src.brandName, input.marca);

  // O cliente pode identificar o carro pelo modelo comercial ("M3 Touring") ou
  // pelo chassis ("G81"). Qualquer um serve.
  const candidates = [input.modelo, input.chassis].filter((v) => v.trim().length > 0);
  const declared = [...src.compatibilities, ...(src.chassis ? [src.chassis] : [])];

  let matchedOn: string | undefined;
  for (const candidate of candidates) {
    const hit = declared.find((d) => looseMatch(d, candidate));
    if (hit) {
      matchedOn = hit;
      break;
    }
  }
  const modelMatch = Boolean(matchedOn);

  return {
    status: brandMatch && modelMatch ? "confirmada" : "manual",
    brandMatch,
    modelMatch,
    matchedOn,
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
