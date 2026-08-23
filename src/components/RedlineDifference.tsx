import { useEffect, useRef, useState } from "react";
import { Cog, Gem, Hammer, type LucideIcon, Palette, PackageCheck, ShieldCheck } from "lucide-react";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AmbientGlow } from "@/components/AmbientGlow";

import materialTexture from "@/assets/redline-difference-texture.jpg";

const FEATURES = [
  {
    icon: Gem,
    title: "Materiais Premium",
    description: "Alcântara, couro nappa e fibra de carbono real — twill ou forjado.",
  },
  {
    icon: Hammer,
    title: "Fabrico Artesanal",
    description: "Cada volante é produzido manualmente com atenção absoluta ao detalhe.",
  },
  {
    icon: Cog,
    title: "Compatibilidade OEM",
    description: "Mantemos toda a compatibilidade eletrónica e mecânica original.",
  },
  {
    icon: ShieldCheck,
    title: "3 Anos de Garantia",
    description: "Todos os trabalhos são testados antes da entrega e acompanhados por garantia legal.",
  },
  {
    icon: PackageCheck,
    title: "Entrega Segura",
    description: "Envio protegido para toda a Europa com embalagem reforçada.",
  },
  {
    icon: Palette,
    title: "Personalização Exclusiva",
    description:
      "Cada volante é desenvolvido à medida, permitindo combinar materiais, costuras, cores e acabamentos para criar um resultado verdadeiramente único.",
  },
];

/** Vértices de um hexágono "deitado" (achatado nos lados), a apontar para
 * cima/baixo — o mesmo motivo do padrão em favo de mel do fundo. */
const HEX_CLIP = "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)";

/**
 * Contorno hexagonal sem SVG: duas camadas com o mesmo clip-path, a de trás
 * um pouco maior e da cor do traço, a da frente encolhida por 1.5px e da cor
 * do cartão (não do fundo da secção — o ícone vive dentro do cartão). No
 * hover: leve rotação (não scale, para não somar com o scale do cartão) e
 * brilho adicional atrás — a única "abordagem de ícone" escolhida.
 */
function HexIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-primary/0 blur-lg transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-primary/20"
      />
      <span className="absolute inset-0 bg-primary/55" style={{ clipPath: HEX_CLIP }} />
      <span
        className="absolute inset-[1.5px] bg-[rgb(12,12,12)] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[rgb(18,18,18)]"
        style={{ clipPath: HEX_CLIP }}
      />
      <Icon
        strokeWidth={1.5}
        className="relative h-5 w-5 text-primary/80 transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-3 group-hover:text-primary"
      />
    </span>
  );
}

/**
 * "A Diferença REDLINE" — pausa visual antes do vídeo/CTA final: já não tem
 * fundo/textura próprios, usa a cor padrão do site (bg-background), a
 * mesma da "Galeria REDLINE" logo acima — as duas secções passam a ler-
 * se como uma continuação, não como blocos isolados. Layout editorial de
 * duas colunas (título+descrição à esquerda, grelha compacta 3×2 de
 * cartões à direita) — mesmos seis cartões, nomes e textos de sempre, só a
 * disposição muda. Cartões com um leve relevo 3D (gradiente + tilt no
 * hover), em vez do preenchimento plano anterior.
 */
export function RedlineDifference() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-background pt-[110px] pb-[110px]">
      {/* Textura de fundo — mesmo mote das outras secções ("nunca
          reconhecível como objeto", só profundidade): recorte da própria
          fotografia de material (Alcântara favo-de-mel + carbono real) que
          exclui por completo qualquer logótipo/texto, a 6% de opacidade e
          desfocada. bg-background continua a ser a camada base, por isso a
          ligação com a "Galeria REDLINE" acima mantém-se intacta. */}
      <img
        src={materialTexture}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06] blur-[6px]"
      />

      {/* Halo de luz ambiente nas duas arestas — mesmo componente/padrão das
          restantes secções (BrandShowcase, FeedbackShowcase,
          CustomProductsSection, etc.). */}
      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />

      {/* Glow vermelho contido, atrás do título à esquerda — não alcança os cartões. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 32% 40% at 18% 30%, oklch(0.58 0.22 25 / 0.07) 0%, transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          {/* Coluna esquerda — eyebrow, título (com a palavra-chave em
              destaque, itálico + vermelho, mesma família tipográfica do
              site) e a descrição de apoio. */}
          <div className={`lg:pt-2 ${isInView ? "animate-feature-reveal" : "opacity-0"}`}>
            <SectionEyebrow className="mb-4">Porque Escolher a REDLINE</SectionEyebrow>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Construído à mão, até ao último <span className="italic text-primary">detalhe</span>.
            </h2>
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              Cada volante passa pelas mesmas seis etapas, sem atalhos e sem produção em massa, do
              primeiro esboço ao momento em que sentes a diferença ao volante.
            </p>
          </div>

          {/* Grelha compacta 3×2 à direita — mesmos seis cartões, agora mais
              contidos (h-full dentro de uma grelha CSS, que já estica cada
              linha à altura do maior item). Relevo 3D: gradiente
              topo-mais-claro/base-mais-escura + sombra própria em repouso
              simulam uma superfície ligeiramente elevada; no hover, um
              tilt de perspetiva (rotateX) substitui o simples lift plano. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
            {FEATURES.map(({ icon, title, description }, i) => (
              <div
                key={title}
                className={`group relative isolate flex h-full min-h-[168px] cursor-pointer flex-col gap-4 rounded-sm border border-white/10 bg-gradient-to-b from-[rgb(19,19,19)] to-[rgb(8,8,8)] p-6 shadow-[0_14px_28px_-20px_rgba(0,0,0,0.8)] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] will-change-transform hover:border-primary/50 hover:shadow-[0_32px_56px_-24px_oklch(0.58_0.22_25_/_0.4)] hover:[transform:rotateX(4deg)_translateY(-6px)_scale(1.02)] ${
                  isInView ? "animate-feature-reveal" : "opacity-0"
                }`}
                style={isInView ? { animationDelay: `${i * 70}ms` } : undefined}
              >
                {/* Aresta superior a apanhar luz — o "bisel" que vende o relevo 3D. */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-sm bg-white/10" />
                {/* Glow interno muito subtil — só aparece no hover, nunca no estado normal. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(circle at 30% 15%, oklch(0.58 0.22 25 / 0.08), transparent 65%)",
                  }}
                />
                <HexIcon icon={icon} />
                <div>
                  <h3 className="text-sm font-semibold text-foreground/90 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-foreground/70">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
