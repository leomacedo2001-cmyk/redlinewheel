import { useEffect, useRef, useState } from "react";
import { Cog, Gem, Hammer, type LucideIcon, PackageCheck, ShieldCheck } from "lucide-react";
import { SectionEyebrow } from "@/components/SectionEyebrow";

import stitchingTexture from "@/assets/custom-costuras-catalog.jpg";
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
];

/** Vértices de um hexágono "deitado" (achatado nos lados), a apontar para
 * cima/baixo — o mesmo motivo do padrão em favo de mel do fundo. */
const HEX_CLIP = "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)";

/**
 * Contorno hexagonal sem SVG: duas camadas com o mesmo clip-path, a de trás
 * um pouco maior e da cor do traço, a da frente encolhida por 1.5px e da cor
 * do fundo — o que sobra entre as duas lê-se como um contorno fino.
 */
function HexIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-primary/0 blur-lg transition-colors duration-500 group-hover:bg-primary/20"
      />
      <span className="absolute inset-0 bg-primary/55" style={{ clipPath: HEX_CLIP }} />
      <span className="absolute inset-[1.5px] bg-background" style={{ clipPath: HEX_CLIP }} />
      <Icon
        strokeWidth={1.5}
        className="relative h-5 w-5 text-primary/80 transition-colors duration-500 group-hover:text-primary"
      />
    </span>
  );
}

/**
 * "A Diferença REDLINE" — a secção mais contida da homepage a seguir ao
 * Hero: fundo quase todo preto, duas texturas macro (costura vermelha em
 * Alcântara / carbono forjado) apenas percetíveis nas bordas, um único
 * brilho ambiente ao centro. O conteúdo nunca compete com o fundo.
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

  const reveal = (index: number) => (isInView ? "animate-feature-reveal" : "opacity-0");
  const revealStyle = (index: number) => (isInView ? { animationDelay: `${index * 90}ms` } : undefined);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-background pt-[110px] pb-[110px]">
      {/* Texturas macro — apenas percetíveis junto às bordas; o centro (onde
          vive o conteúdo) é sempre preto puro, nunca compete com o texto. */}
      <img
        src={stitchingTexture}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-[45%] object-cover opacity-[0.11] blur-[3px]"
      />
      <img
        src={carbonTexture}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-[45%] object-cover opacity-[0.11] blur-[3px]"
      />
      {/* Desvanece as duas texturas para preto em todas as direções — só
          resta um resíduo de textura nos cantos, nunca uma imagem legível. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 75% 65% at 50% 50%, var(--background) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 60%, var(--background) 100%)",
        }}
      />
      {/* Brilho ambiente — vermelho/laranja muito ténue, só atrás do conteúdo central. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 40%, oklch(0.58 0.22 25 / 0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6">
        <div className={`mb-16 text-center md:mb-20 ${reveal(0)}`} style={revealStyle(0)}>
          <SectionEyebrow align="center" className="mb-4">
            Porque Escolher a REDLINE
          </SectionEyebrow>
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">Excelência em cada detalhe.</h2>
        </div>

        {/* Divisores verticais só na grelha de 5 colunas — a 2 colunas os 5
            itens quebram de forma desigual (2/2/1) e uma borda vertical fixa
            ficaria desalinhada com o conteúdo por baixo, o que contrariaria
            o pedido de "alinhamento perfeito". A 1/2 colunas o espaçamento
            generoso já basta ("less is more"). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map(({ icon, title, description }, i) => (
            <div
              key={title}
              className={`group relative flex items-center gap-4 px-6 py-6 transition-transform duration-500 ease-out hover:scale-[1.01] lg:px-6 lg:py-2 ${
                i > 0 ? "lg:border-l lg:border-foreground/10" : ""
              } ${reveal(i + 1)}`}
              style={revealStyle(i + 1)}
            >
              <HexIcon icon={icon} />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground/90 transition-colors duration-500 group-hover:text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
