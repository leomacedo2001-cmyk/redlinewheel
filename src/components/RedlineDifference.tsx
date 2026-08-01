import { useEffect, useRef, useState } from "react";
import { Cog, Gem, Hammer, type LucideIcon, Palette, PackageCheck, ShieldCheck } from "lucide-react";
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
 * atrás do título. Seis cartões de dimensões idênticas (grelha 3×2 em
 * desktop, 2 colunas em tablet, 1 em mobile), com entrada em cascata e um
 * hover discreto — nunca compete com os cartões nem com a secção seguinte.
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
      {/* Glow vermelho contido, só atrás do título — não alcança os cartões. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 42% 30% at 50% 20%, oklch(0.58 0.22 25 / 0.07) 0%, transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6">
        <div className={`mb-16 text-center md:mb-20 ${isInView ? "animate-feature-reveal" : "opacity-0"}`}>
          <SectionEyebrow align="center" className="mb-4">
            Porque Escolher a REDLINE
          </SectionEyebrow>
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">Excelência em cada detalhe.</h2>
        </div>

        {/* Grelha premium: 3 colunas × 2 linhas em desktop, 2 em tablet, 1
            em mobile — todos os cartões com o mesmo tamanho (h-full dentro
            de uma grelha CSS, que já estica cada linha à altura do maior
            item). Espaçamento na escala de 8px (gap-6 = 24px, p-8 = 32px). */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon, title, description }, i) => (
            <div
              key={title}
              className={`group relative isolate flex h-full min-h-[232px] cursor-pointer flex-col gap-6 rounded-sm border border-white/10 bg-[rgb(12,12,12)] p-8 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-primary/50 hover:bg-[rgb(18,18,18)] hover:shadow-[0_24px_48px_-28px_oklch(0.58_0.22_25_/_0.35)] ${
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
                <h3 className="text-base font-semibold text-foreground/90 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
                  {title}
                </h3>
                <p className="mt-2 min-h-[72px] text-sm leading-relaxed text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-foreground/70">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
