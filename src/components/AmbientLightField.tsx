/**
 * Camada única de luz ambiente atrás de TODAS as secções da homepage.
 *
 * Um só elemento contínuo, do tamanho da página inteira — nunca vários
 * glows independentes por secção (esses cortavam-se a direito na fronteira
 * de cada `overflow-hidden`, criando blocos percetíveis). Sendo um só
 * campo, não há costura possível: a luz nunca "acaba", só continua.
 *
 * Os nós de luz estão posicionados (em % da altura total da homepage,
 * medidos em runtime) exactamente sobre cada transição real entre secções
 * — Hero/Transformação, Transformação/Produtos, Produtos/Configurador,
 * Configurador/Diferença, Diferença/Comunidade, Comunidade/Marcas,
 * Marcas/CTA, CTA/Footer — para que o fim de uma e o início da seguinte
 * partilhem sempre o mesmo halo, em vez de cada uma ter o seu.
 *
 * Tom "laranja REDLINE" (~oklch 0.65 0.23 32, o mesmo que #ff3b16)
 * intercalado com o vermelho primário do site e um carmesim mais escuro,
 * para variação orgânica sem nunca sair da identidade da marca.
 */
export function AmbientLightField() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            // Hero → Transformação
            "radial-gradient(56% 22% at 48% 4%, oklch(0.65 0.23 32 / 0.05), transparent 72%)",
            "radial-gradient(54% 22% at 40% 12%, oklch(0.58 0.22 25 / 0.045), transparent 72%)",
            // Transformação → Produtos
            "radial-gradient(56% 24% at 60% 28%, oklch(0.65 0.23 32 / 0.055), transparent 72%)",
            // Produtos → Configurador
            "radial-gradient(54% 22% at 38% 39%, oklch(0.35 0.15 15 / 0.05), transparent 72%)",
            // respiração a meio do Configurador (secção longa)
            "radial-gradient(52% 22% at 55% 51%, oklch(0.65 0.23 32 / 0.045), transparent 72%)",
            // Configurador → Diferença
            "radial-gradient(56% 24% at 42% 63%, oklch(0.58 0.22 25 / 0.05), transparent 72%)",
            // Diferença → Comunidade
            "radial-gradient(54% 22% at 58% 70%, oklch(0.65 0.23 32 / 0.05), transparent 72%)",
            // Comunidade → Marcas
            "radial-gradient(54% 22% at 40% 83%, oklch(0.35 0.15 15 / 0.05), transparent 72%)",
            // Marcas → CTA
            "radial-gradient(54% 22% at 56% 94%, oklch(0.65 0.23 32 / 0.05), transparent 72%)",
            // CTA → Footer
            "radial-gradient(50% 18% at 50% 99%, oklch(0.58 0.22 25 / 0.05), transparent 72%)",
          ].join(", "),
        }}
      />

      {/* vinheta muito subtil — dá profundidade sem escurecer o centro da leitura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(120% 70% at 50% 50%, transparent 62%, oklch(0 0 0 / 0.22) 100%)",
        }}
      />

      {/* grão quase impercetível — quebra a chapa de preto sólido sem custar um filtro de blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </>
  );
}
