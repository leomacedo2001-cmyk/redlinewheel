type AmbientGlowProps = {
  /** Em que aresta da secção o halo nasce — sobe/desce para se sobrepor à secção vizinha. */
  edge: "top" | "bottom";
  /** "strong" para secções-âncora (ex.: Comunidade) onde o halo deve ser o elemento de fundo dominante. */
  strength?: "default" | "strong";
};

/**
 * Halo de luz ambiente reutilizável — a unidade base do sistema de
 * iluminação contínua da homepage. Em vez de um único campo por página
 * (frágil: a posição de cada nó dependia de percentagens da altura total,
 * que se desalinham sempre que uma secção muda de altura — foi exatamente
 * isso que apagou o halo da Comunidade), cada secção passa a ter o seu
 * próprio halo, ancorado a si mesma. Metade do halo nasce sempre fora da
 * secção (para cima ou para baixo, consoante `edge`), pelo que o halo
 * inferior de uma secção sobrepõe-se sempre ao halo superior da seguinte —
 * a continuidade deixa de depender de qualquer cálculo global.
 *
 * Três gradientes radiais concêntricos, nunca um só stop duro — para
 * parecer luz a refletir-se em fumo, não um círculo desenhado.
 *
 * Largura = inset-x-0 (100% da própria secção, nunca um pixel fixo maior
 * que o ecrã): a versão anterior usava 1200–1600px fixos e, centrada com
 * left-1/2, ultrapassava a viewport em ecrãs mais estreitos que isso —
 * incluindo 1280px de desktop — criando scroll horizontal em TODO o site (o
 * footer com o halo é partilhado por todas as páginas, não só a homepage).
 * `w-screen`/`100vw` tem o mesmo problema noutra forma (inclui a barra de
 * scroll em muitos browsers). `inset-x-0` iguala exactamente a largura já
 * segura da própria secção — nunca pode transbordar, e em desktop essa
 * largura já ronda os 1280–1920px pedidos.
 *
 * Propositadamente SEM z-index negativo: com nenhum antepassado a isolar um
 * stacking context (nem as secções, nem <main>, nem <body>, todos
 * `position:relative`/`static` sem z-index), um `-z-10` sobe até ao
 * stacking context raiz do documento inteiro — onde fica atrás de TODO O
 * RESTO da página, não só do conteúdo da própria secção, tornando-se
 * completamente invisível (confirmado a testar com fundo vermelho sólido:
 * só ficava visível ao forçar z-index positivo). Este componente é sempre
 * o primeiro filho dentro da secção que o usa, por isso a ordem do DOM já
 * garante que fica atrás do título/cartões dessa secção, sem precisar de
 * nenhum z-index.
 */
export function AmbientGlow({ edge, strength = "default" }: AmbientGlowProps) {
  const core = strength === "strong" ? 0.14 : 0.1;
  const mid = strength === "strong" ? 0.09 : 0.065;
  const outer = strength === "strong" ? 0.06 : 0.045;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 aspect-square ${
        edge === "top" ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2"
      }`}
      style={{
        background: [
          `radial-gradient(circle at center, oklch(0.65 0.23 32 / ${core}) 0%, oklch(0.6 0.2 28 / ${mid}) 35%, transparent 72%)`,
          `radial-gradient(circle at center, oklch(0.45 0.14 20 / ${outer}) 0%, transparent 60%)`,
        ].join(", "),
      }}
    />
  );
}
