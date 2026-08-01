import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Cog, Gem, Hammer, type LucideIcon, Palette, PackageCheck, ShieldCheck } from "lucide-react";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AmbientGlow } from "@/components/AmbientGlow";

import carbonTexture from "@/assets/product-carbono.jpg";

const FEATURES = [
  {
    icon: Gem,
    title: "Materiais Premium",
    description: "Utilizamos apenas Alcântara, pele premium e fibra de carbono de elevada qualidade.",
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
    title: "Garantia Premium",
    description: "Todos os trabalhos são testados antes da entrega e acompanhados por garantia.",
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
 * "A Diferença REDLINE" — pausa visual antes do vídeo/CTA final: preto
 * profundo quase liso, uma única textura de carbono a 5% de opacidade (só
 * profundidade, nunca reconhecível como objeto) e um glow vermelho contido
 * atrás do título. Layout editorial de duas colunas (título+descrição à
 * esquerda, grelha compacta 3×2 de cartões à direita) — mesmos seis
 * cartões, nomes e textos de sempre, só a disposição muda.
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
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-[#050505] pt-[110px] pb-[110px]">
      {/* Halo de luz ambiente nas duas arestas — a única secção do
          homepage que ainda não tinha, mesmo componente/padrão das
          restantes (BrandShowcase, FeedbackShowcase, CustomProductsSection,
          etc.), para nunca ler como "uma secção preta" isolada entre elas. */}
      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />

      {/* Textura única, quase impercetível — só profundidade, nunca uma
          imagem legível (nunca leria como volante/interior/carro). */}
      <img
        src={carbonTexture}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.05] blur-[6px]"
      />
      {/* Glow vermelho contido, agora atrás do título à esquerda (o
          layout deixou de ser centrado) — não alcança os cartões. */}
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
              site) e a nova descrição de apoio, seguidos de um CTA. */}
          <div className={`lg:pt-2 ${isInView ? "animate-feature-reveal" : "opacity-0"}`}>
            <SectionEyebrow className="mb-4">Porque Escolher a REDLINE</SectionEyebrow>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Excelência em cada <span className="italic text-primary">detalhe</span>.
            </h2>
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              Da seleção dos materiais ao controlo de qualidade final, cuidamos de cada etapa para que o
              resultado iguale a exigência dos automóveis que personalizamos.
            </p>
            <Link
              to="/products"
              className="group/link mt-7 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-[transform,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:brightness-125"
            >
              Explorar a Coleção
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-1" />
            </Link>
          </div>

          {/* Grelha compacta 3×2 à direita — mesmos seis cartões, agora mais
              contidos (h-full dentro de uma grelha CSS, que já estica cada
              linha à altura do maior item). */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, description }, i) => (
              <div
                key={title}
                className={`group relative isolate flex h-full min-h-[168px] cursor-pointer flex-col gap-4 rounded-sm border border-white/10 bg-[rgb(12,12,12)] p-6 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-primary/50 hover:bg-[rgb(18,18,18)] hover:shadow-[0_24px_48px_-28px_oklch(0.58_0.22_25_/_0.35)] ${
                  isInView ? "animate-feature-reveal" : "opacity-0"
                }`}
                style={isInView ? { animationDelay: `${i * 70}ms` } : undefined}
              >
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
