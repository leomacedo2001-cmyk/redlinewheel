type AmbientGlowProps = {
  /** Em que aresta da própria secção o halo se ancora — nunca sai da secção. */
  edge: "top" | "bottom";
  /** "strong" para secções-âncora (ex.: Comunidade) onde a luz deve ler-se ligeiramente mais. */
  strength?: "default" | "strong";
};

/**
 * Halo de luz ambiente — separador atmosférico entre secções, não um fundo.
 *
 * Cada secção fica inteiramente preta; isto é só uma luz muito ténue junto a
 * uma das arestas, inteiramente CONTIDA dentro da própria secção (nunca sai
 * para a secção vizinha — cada secção ilumina-se a si mesma nas duas pontas,
 * simetricamente). Por isso: altura fixa e pequena (não `aspect-square`
 * ligado à largura — essa era a causa do "fundo vermelho gigante": em ecrãs
 * largos a caixa ficava tão alta quanto a secção era larga), ancorada com
 * `top-0`/`bottom-0` em vez do antigo `-translate-y-1/2` que a fazia
 * atravessar para a secção seguinte.
 *
 * Sem `filter: blur()`: medido pixel a pixel (screenshot + leitura RGB), um
 * blur de 150–260px sobre uma caixa já com falloff radial e opacidade de
 * 4–6% dilui o resultado para virtualmente zero (a média do blur mistura a
 * cor com uma enorme área de pixels a 0% de alpha à volta). A suavidade
 * "luz a passar por fumo" já vem só do próprio gradiente radial multi-stop
 * (`0%` → `transparent 65%`), sem precisar de blur nenhum — e a opacidade
 * teve de subir para ~15–18% no próprio stop central para, depois do
 * falloff, ainda sobrar um resultado visível (confirmado: R chega a ~19
 * contra G/B~9 no pico, caindo para quase zero a meio da secção — visível
 * como luz, nunca como uma área vermelha).
 *
 * Cada secção que usa este componente deve ter `overflow-hidden` +
 * `isolate` no próprio elemento da secção, para o halo nunca conseguir
 * pintar fora dela mesma, seja qual for a largura do ecrã.
 */
export function AmbientGlow({ edge, strength = "default" }: AmbientGlowProps) {
  const opacity = strength === "strong" ? 0.18 : 0.15;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 h-[150px] ${edge === "top" ? "top-0" : "bottom-0"}`}
      style={{
        background: `radial-gradient(ellipse 65% 100% at 50% ${edge === "top" ? "0%" : "100%"}, oklch(0.6 0.2 30 / ${opacity}) 0%, transparent 65%)`,
      }}
    />
  );
}
