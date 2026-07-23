/**
 * Camada única de luz ambiente atrás de TODAS as secções da homepage —
 * substitui os glows independentes por secção (que se cortavam a direito no
 * fim de cada uma, criando blocos percetíveis) por um único campo contínuo,
 * do tamanho da página inteira. Como é um só elemento, não há costura
 * possível entre secções: a luz nunca "acaba", só continua.
 *
 * Paleta dentro da identidade REDLINE (vermelho primário + variações de
 * laranja queimado / carmesim escuro), sempre muito subtil (4–8% opacidade)
 * — sente-se, não se repara. As secções com fundo translúcido (bg-surface/40)
 * deixam a luz passar por baixo tal como já deixavam passar o corpo da
 * página; nenhuma secção precisou de mudar de cor para isto funcionar.
 */
export function AmbientLightField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background: [
          "radial-gradient(58% 26% at 46% 6%, oklch(0.58 0.22 25 / 0.055), transparent 72%)",
          "radial-gradient(52% 24% at 62% 17%, oklch(0.6 0.15 45 / 0.045), transparent 72%)",
          "radial-gradient(58% 27% at 38% 29%, oklch(0.35 0.15 15 / 0.05), transparent 72%)",
          "radial-gradient(54% 25% at 56% 42%, oklch(0.58 0.22 25 / 0.045), transparent 72%)",
          "radial-gradient(58% 27% at 40% 55%, oklch(0.6 0.15 45 / 0.05), transparent 72%)",
          "radial-gradient(54% 25% at 60% 68%, oklch(0.58 0.22 25 / 0.045), transparent 72%)",
          "radial-gradient(58% 28% at 45% 82%, oklch(0.35 0.15 15 / 0.05), transparent 72%)",
          "radial-gradient(56% 24% at 50% 96%, oklch(0.58 0.22 25 / 0.05), transparent 72%)",
        ].join(", "),
      }}
    />
  );
}
