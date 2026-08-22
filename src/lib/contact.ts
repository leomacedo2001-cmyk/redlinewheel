/**
 * Canal de contacto real da REDLINE — fonte única.
 *
 * Só existem dois canais autorizados: este email e o Facebook. Não há telefone
 * nem WhatsApp. Qualquer sítio do site que precise de "falar connosco" deve
 * usar daqui, para não voltarem a aparecer contactos antigos espalhados pelo
 * código.
 */

export const REDLINE_EMAIL = "redlinecustomsauto@gmail.com";
export const REDLINE_FACEBOOK = "https://www.facebook.com/profile.php?id=61591677547923";

/** Constrói um `mailto:` para o email real, com assunto e corpo já preenchidos. */
export function mailtoHref(subject: string, body: string): string {
  return `mailto:${REDLINE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
