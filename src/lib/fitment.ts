/**
 * COMPATIBILIDADES — fonte única normalizada.
 * ---------------------------------------------------------------------------
 * Antes de existir este módulo, a informação de veículo de cada volante vivia
 * espalhada por três sítios com formatos diferentes:
 *
 *   - `model.compatibilities: string[]`  texto livre  ("C63 AMG W205", "320i")
 *   - `model.chassis?: string`           texto livre  ("G2x / G8x", "Gama RS")
 *   - `model.specs[]`                    texto livre  ({ label: "Geração",
 *                                                       value: "W205 (2014–2021)" })
 *
 * ...e cada componente (ficha, validação de compra, configurador, pesquisa)
 * relia esse texto à sua maneira. Este módulo derive UMA estrutura a partir
 * desses mesmos dados e passa a ser o único sítio onde essa leitura acontece.
 *
 * REGRA ABSOLUTA: só normaliza o que já está declarado no catálogo. Não há
 * aqui uma única tabela de chassis, gerações ou anos escrita à mão. Um campo
 * que os dados não suportem fica `undefined` — nunca preenchido por inferência.
 * Em particular, os ANOS existem apenas onde um spec de geração os declara
 * entre parênteses; onde não existem, não são inventados.
 */

import type { BrandModel } from "@/lib/brands";

export type YearRange = {
  /** Ano de início declarado. */
  from: number;
  /** Ano de fim; ausente = geração ainda em produção ("2019+"). */
  to?: number;
};

export type Fitment = {
  /** Marca do veículo — a marca do próprio produto. */
  brand: string;
  /** Modelo do veículo, tal como declarado ("C63 AMG", "320i", "Golf 7 GTI"). */
  model: string;
  /** Código de chassis/geração, quando os dados o permitem determinar. */
  chassis?: string;
  /** Anos da geração, só quando declarados num spec. */
  years?: YearRange;
  /** Entrada original em `compatibilities`, para pesquisa e diagnóstico. */
  raw: string;
};

export type FitmentSummary = {
  fitments: Fitment[];
  /** Chassis comum a TODAS as entradas — só então é inequívoco. */
  commonChassis?: string;
  /** Anos da geração declarados no spec, se existirem. */
  years?: YearRange;
  /** Há entradas sem chassis nem anos: a compatibilidade é genérica. */
  hasGeneric: boolean;
  /** Rótulo de geração declarado no spec/chassis, já limpo ("F15/F16"). */
  generationLabel?: string;
};

// ---------------------------------------------------------------------------
// Leitura dos campos livres existentes
// ---------------------------------------------------------------------------

/**
 * Formas que um código de chassis toma neste catálogo. Deliberadamente
 * restritivo: "AMG", "MQB", "Gama", "GTI" e "Evo" não são chassis, e
 * motorizações como "25d", "330e" ou "220d" também não.
 */
const CHASSIS_SHAPES = [
  /^[A-Za-z]{1,3}\d{1,3}(\.\d)?$/, // W205, G80, FK8, MK7, B9, E87
  /^[A-Za-z]\d[xX]$/, //              G2x, E9x, F3x — famílias de geração
  /^\d[A-Za-z]$/, //                  8Y, 8V
  /^\d{2,3}[A-Za-z]$/, //             95B
  /^\d{3,4}$/, //                     991, 992
];

function isChassisCode(token: string): boolean {
  const t = token.trim();
  return t.length > 0 && CHASSIS_SHAPES.some((re) => re.test(t));
}

/**
 * Forma aceite quando o código vem DENTRO de uma entrada de compatibilidade e
 * não está declarado noutro campo. Mais apertada ainda — uma só letra seguida
 * de dígitos, ou dígito seguido de letra — para nunca confundir designações de
 * acabamento ("GT3", "TCR", "GTI") com chassis.
 */
const ENTRY_CHASSIS = /^(?:[A-Za-z]\d{1,3}|\d[A-Za-z]|[Mm][Kk]\d+)$/;

/** "G8x" declarado cobre G80/G81/G82 — expande para comparar com as entradas. */
function declaredMatchers(codes: string[]): RegExp[] {
  return codes
    .filter((c) => /[xX]$/.test(c))
    .map((c) => new RegExp(`^${c.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\d$`, "i"));
}

/** Separa "W213 / S213" ou "F20/F21" nos seus tokens. */
function splitCodes(label: string): string[] {
  return label
    .split(/[/,·]|\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Reduz um rótulo livre aos tokens que são mesmo códigos de chassis.
 * "F15 / F16" -> "F15/F16" · "Gama RS" -> undefined · "MQB Evo" -> undefined
 */
function codesLabel(label?: string): string | undefined {
  if (!label) return undefined;
  const codes = splitCodes(label).filter(isChassisCode);
  return codes.length > 0 ? codes.join("/") : undefined;
}

/** Anos declarados entre parênteses: "W205 (2014–2021)", "G20/G21 (2019+)". */
function parseYears(value?: string): YearRange | undefined {
  if (!value) return undefined;
  const closed = value.match(/(\d{4})\s*[-–—]\s*(\d{4})/);
  if (closed) return { from: Number(closed[1]), to: Number(closed[2]) };
  const open = value.match(/(\d{4})\s*\+/);
  if (open) return { from: Number(open[1]) };
  return undefined;
}

/** O spec que descreve a geração, quando existe ("Geração" ou "Compatível"). */
function generationSpec(model: BrandModel): string | undefined {
  const spec = (model.specs ?? []).find((s) => /gera[çc][ãa]o|compat[íi]vel/i.test(s.label));
  return spec?.value;
}

// ---------------------------------------------------------------------------
// Derivação
// ---------------------------------------------------------------------------

/**
 * Extrai o chassis de uma entrada de compatibilidade, quando ela o traz
 * escrito ("M3 G80" -> G80 + "M3"). Só usa o texto da própria entrada.
 */
function chassisFromEntry(
  entry: string,
  declaredCodes: Set<string>,
  matchers: RegExp[],
): { model: string; chassis?: string } {
  const tokens = entry.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const declared = (t: string) =>
      declaredCodes.has(t.toLowerCase()) || matchers.some((re) => re.test(t));
    const last = tokens[tokens.length - 1];

    // Trailing: aceita a forma apertada, ou qualquer código já declarado no produto.
    if (ENTRY_CHASSIS.test(last) || (isChassisCode(last) && declared(last))) {
      return { model: tokens.slice(0, -1).join(" "), chassis: last };
    }
    // No meio da designação ("Supra A90 MT") — só se declarado noutro campo.
    const mid = tokens.find((t) => isChassisCode(t) && declared(t));
    if (mid) return { model: entry, chassis: mid };
  }
  return { model: entry };
}

/**
 * Constrói a compatibilidade normalizada de um volante a partir dos campos
 * que já existem. Nunca lança e nunca inventa.
 */
export function getFitments(brandName: string, model: BrandModel): FitmentSummary {
  const specValue = generationSpec(model);
  const years = parseYears(specValue);

  // Rótulo de geração: preferimos o do spec; se não der códigos, o campo chassis.
  const generationLabel = codesLabel(specValue?.replace(/\(.*\)/, "")) ?? codesLabel(model.chassis);

  const declaredList = [...splitCodes(model.chassis ?? ""), ...splitCodes(specValue ?? "")].filter(isChassisCode);
  const declaredCodes = new Set(declaredList.map((t) => t.toLowerCase()));
  const matchers = declaredMatchers(declaredList);

  const fitments: Fitment[] = (model.compatibilities ?? []).map((raw) => {
    const { model: vehicleModel, chassis } = chassisFromEntry(raw, declaredCodes, matchers);
    // Sem chassis próprio, herda o rótulo da geração — que é declarado, não inferido.
    const resolved = chassis ?? generationLabel;
    return {
      brand: brandName,
      model: vehicleModel,
      chassis: resolved,
      years: resolved ? years : undefined,
      raw,
    };
  });

  const chassisSet = new Set(fitments.map((f) => f.chassis ?? ""));
  const commonChassis =
    chassisSet.size === 1 && !chassisSet.has("") ? fitments[0]?.chassis : undefined;

  return {
    fitments,
    commonChassis,
    years,
    hasGeneric: fitments.some((f) => !f.chassis && !f.years),
    generationLabel,
  };
}

// ---------------------------------------------------------------------------
// Apresentação e comparação — partilhadas por ficha, compra e pesquisa
// ---------------------------------------------------------------------------

/** "2014–2021" · "2019–..." */
export function formatYears(years?: YearRange): string | undefined {
  if (!years) return undefined;
  return years.to ? `${years.from}–${years.to}` : `${years.from}–...`;
}

/** Segunda linha de cada compatibilidade: "W205 · 2014–2021", "G80", ou nada. */
export function fitmentDetail(f: Fitment): string | undefined {
  const y = formatYears(f.years);
  if (f.chassis && y) return `${f.chassis} · ${y}`;
  if (f.chassis) return f.chassis;
  return undefined;
}

/** minúsculas, sem acentos nem pontuação — para comparar e pesquisar. */
export function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Todos os termos por que um volante deve ser encontrável na pesquisa. */
export function fitmentSearchTerms(summary: FitmentSummary): string[] {
  const out = new Set<string>();
  for (const f of summary.fitments) {
    out.add(f.raw);
    out.add(f.model);
    if (f.chassis) out.add(f.chassis);
  }
  if (summary.generationLabel) for (const c of splitCodes(summary.generationLabel)) out.add(c);
  return [...out];
}
