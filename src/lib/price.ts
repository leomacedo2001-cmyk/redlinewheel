/**
 * Formatação de preços — fonte única para todo o site.
 *
 * Formato oficial REDLINE: símbolo primeiro, ponto como separador de milhares,
 * sem casas decimais quando o valor é inteiro.
 *
 *   1149   -> "€1.149"
 *   899    -> "€899"
 *   1249.5 -> "€1.249,50"
 *
 * Nunca usar "EUR 1149.00", "1149 EUR" ou "1,149.00 €".
 *
 * Isto altera apenas a APRESENTAÇÃO. Os valores dos produtos vivem em
 * `brands.ts` / `accessories.ts` / Shopify e não são tocados aqui.
 */

const SYMBOLS: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

/** Agrupa os milhares com ponto: 1149 -> "1.149" */
function groupThousands(whole: number): string {
  return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Formata um montante na convenção da REDLINE.
 * Aceita número (catálogo local) ou string (Shopify devolve "1149.00").
 * Devolve "" para valores não numéricos, para nunca imprimir "NaN" na página.
 */
export function formatPrice(amount: number | string, currency = "EUR"): string {
  const n = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return "";

  const negative = n < 0;
  const cents = Math.round(Math.abs(n) * 100);
  const whole = Math.floor(cents / 100);
  const rest = cents % 100;

  const body = rest === 0 ? groupThousands(whole) : `${groupThousands(whole)},${String(rest).padStart(2, "0")}`;
  const code = currency.toUpperCase();
  const symbol = SYMBOLS[code];

  return `${negative ? "-" : ""}${symbol ?? `${code} `}${body}`;
}

/** Conveniência para `{ amount, currency }` opcional (catálogo local). */
export function formatPriceOf(price?: { amount: number; currency: string } | null): string | null {
  if (!price) return null;
  return formatPrice(price.amount, price.currency);
}

/** Conveniência para o formato do Shopify: `{ amount: "1149.00", currencyCode: "EUR" }`. */
export function formatShopifyPrice(price?: { amount: string; currencyCode: string } | null): string | null {
  if (!price) return null;
  return formatPrice(price.amount, price.currencyCode);
}
