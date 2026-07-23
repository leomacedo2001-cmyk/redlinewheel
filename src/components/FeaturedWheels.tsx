import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getBrandModel, type Brand, type BrandModel } from "@/lib/brands";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AmbientGlow } from "@/components/AmbientGlow";

/**
 * Produtos em Destaque — showroom curado, não um carrossel de e-commerce.
 *
 * Reconstruído do zero (a versão anterior — marquee infinito, depois
 * coverflow com escala/blur por distância recalculada a cada frame de
 * scroll — foi abandonada por completo, não iterada). Duas decisões
 * deliberadas para nunca mais reintroduzir os artefactos de render já
 * vistos nas versões antigas:
 *
 * 1. Hierarquia real, não "o que está centrado de momento": uma peça
 *    fixa em destaque (grande, à esquerda) + uma fila de apoio — nunca um
 *    truque de escala/opacidade recalculado por JS a cada frame de scroll.
 * 2. Scroll 100% nativo (overflow-x-auto + scroll-snap do próprio browser),
 *    zero manipulação de estilo por frame. É estruturalmente impossível
 *    voltar a haver "barras pretas a deslizar": não há nenhum mecanismo a
 *    escrever transform/filter em loop — o compositor do browser trata de
 *    tudo sozinho.
 */

/**
 * Curadoria manual — 7 peças, não o catálogo inteiro. Cada uma tem carbono
 * forjado, LED, Alcântara completa ou um acabamento verdadeiramente único
 * (nunca incluída só "porque existe"). Só peças com fotografia local
 * (ficheiro no repositório, não um asset externo do Lovable) entram aqui —
 * é o que torna possível tratar a imagem de forma consistente; as peças
 * "Signature" fotografadas via asset externo (incluindo a única Porsche
 * assinatura do catálogo) ficam de fora desta secção por não ser possível
 * validar/tratar a imagem original neste ambiente.
 */
const CURATED_SHOWCASE: { brandSlug: string; modelSlug: string }[] = [
  { brandSlug: "mercedes-benz", modelSlug: "amg-red-forged-signature" },
  { brandSlug: "audi", modelSlug: "rs-carbon-signature" },
  { brandSlug: "bmw", modelSlug: "g-series-blue-forged" },
  { brandSlug: "audi", modelSlug: "green-camo-signature" },
  { brandSlug: "bmw", modelSlug: "g-series-black-carbon" },
  { brandSlug: "audi", modelSlug: "rs-suede-signature" },
  { brandSlug: "volkswagen", modelSlug: "forged-carbon-signature" },
];

/** Grading consistente aplicado a TODAS as imagens da vitrine — a mesma "sessão de estúdio" visual. */
const IMAGE_GRADE = "brightness(0.92)_contrast(1.12)_saturate(1.03)";
const IMAGE_GRADE_HOVER = "brightness(0.97)_contrast(1.18)_saturate(1.06)";

type ShowcaseItem = { brand: Brand; model: BrandModel };

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function formatPrice(model: BrandModel): string | null {
  if (!model.price) return null;
  return `${model.price.currency === "EUR" ? "€" : model.price.currency + " "}${model.price.amount.toFixed(0)}`;
}

/** Vinheta + reflexo de carbono partilhados pelo hero e pelos cartões de apoio. */
function ImageAtmosphere({ hover = true }: { hover?: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 120% at 50% 42%, transparent 42%, oklch(0 0 0 / 0.45) 100%)",
        }}
      />
      {hover && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-[130%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[130%] motion-reduce:hidden"
        />
      )}
    </>
  );
}

type TiltState = { hovered: boolean; x: number; y: number };
const MAX_TILT_DEG = 2;

function useTilt(reducedMotion: boolean) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ hovered: false, x: 0, y: 0 });

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLAnchorElement>) => {
      if (reducedMotion || e.pointerType !== "mouse") return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setTilt({ hovered: true, x: (0.5 - py) * 2 * MAX_TILT_DEG, y: (px - 0.5) * 2 * MAX_TILT_DEG });
    },
    [reducedMotion],
  );
  const onPointerEnter = useCallback(
    (e: ReactPointerEvent<HTMLAnchorElement>) => {
      if (!reducedMotion && e.pointerType === "mouse") setTilt((t) => ({ ...t, hovered: true }));
    },
    [reducedMotion],
  );
  const onPointerLeave = useCallback(() => setTilt({ hovered: false, x: 0, y: 0 }), []);

  const transform =
    tilt.hovered && !reducedMotion
      ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
      : undefined;

  return { ref, transform, onPointerMove, onPointerEnter, onPointerLeave };
}

function HeroSpotlight({ item, isInView }: { item: ShowcaseItem; isInView: boolean }) {
  const { brand, model } = item;
  const reducedMotion = usePrefersReducedMotion();
  const { ref, transform, onPointerMove, onPointerEnter, onPointerLeave } = useTilt(reducedMotion);
  const price = formatPrice(model);

  return (
    <div className={isInView ? "animate-card-reveal motion-reduce:animate-none" : "opacity-0 motion-reduce:opacity-100"}>
      <Link
        ref={ref}
        to="/brand/$slug/model/$model"
        params={{ slug: brand.slug, model: model.slug }}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        style={{ transform }}
        aria-label={`Ver detalhes de ${model.name}`}
        className="group relative flex h-full flex-col overflow-hidden border border-primary/30 bg-surface transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:border-primary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:!transform-none"
      >
        <span className="absolute left-5 top-0 z-20 -translate-y-1/2 bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.58_0.22_25/0.7)]">
          Coleção Signature
        </span>
        <span className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-primary to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
        {/* glow ambiente atrás do hero, sempre ligeiramente presente, mais forte no hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-16 -z-0 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: "radial-gradient(closest-side, oklch(0.58 0.22 25 / 0.35), transparent 75%)" }}
        />

        <div className="relative aspect-[16/11] overflow-hidden bg-background">
          <img
            src={model.img}
            alt={model.name}
            loading="eager"
            decoding="async"
            width={1280}
            height={880}
            className={`h-full w-full object-cover [filter:${IMAGE_GRADE}] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035] group-hover:[filter:${IMAGE_GRADE_HOVER}]`}
          />
          <ImageAtmosphere />
          <div className="absolute left-4 top-4 z-10 border border-primary/40 bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur transition-transform duration-300 ease-out group-hover:scale-105">
            {brand.name}
          </div>
          {model.status && (
            <div className="absolute right-4 top-4 z-10 border border-border bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/80 backdrop-blur transition-transform duration-300 ease-out group-hover:scale-105">
              {model.status}
            </div>
          )}
        </div>

        <div className="relative flex flex-1 flex-col gap-5 p-6 md:p-7 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
          <div>
            <h3 className="mb-2 text-2xl font-bold leading-tight transition-colors group-hover:text-primary md:text-3xl">
              {model.name}
            </h3>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">{model.description}</p>
          </div>
          <div className="mt-auto flex items-end justify-between border-t border-border/60 pt-5">
            {price && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Desde</div>
                <div className="text-3xl font-bold tracking-tight">{price}</div>
              </div>
            )}
            <span className="inline-flex flex-col items-start text-xs font-medium uppercase tracking-wider text-primary">
              <span className="inline-flex items-center transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                Ver Produto <ArrowRight className="ml-2 h-4 w-4" />
              </span>
              <span className="mt-0.5 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CompactCard({
  item,
  isInView,
  revealDelayMs,
}: {
  item: ShowcaseItem;
  isInView: boolean;
  revealDelayMs: number;
}) {
  const { brand, model } = item;
  const reducedMotion = usePrefersReducedMotion();
  const { ref, transform, onPointerMove, onPointerEnter, onPointerLeave } = useTilt(reducedMotion);
  const price = formatPrice(model);

  return (
    <div
      className={`w-[240px] shrink-0 snap-start lg:w-full ${
        isInView ? "animate-card-reveal motion-reduce:animate-none" : "opacity-0 motion-reduce:opacity-100"
      }`}
      style={isInView ? { animationDelay: `${revealDelayMs}ms` } : undefined}
    >
      <Link
        ref={ref}
        to="/brand/$slug/model/$model"
        params={{ slug: brand.slug, model: model.slug }}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        style={{ transform }}
        aria-label={`Ver detalhes de ${model.name}`}
        className="group relative flex items-center gap-4 overflow-hidden border border-border/60 bg-surface p-3 transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:border-primary/60 hover:shadow-[0_20px_45px_-24px_rgba(0,0,0,0.65),0_0_30px_-14px_oklch(0.58_0.22_25/0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:!transform-none"
      >
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-background">
          <img
            src={model.img}
            alt={model.name}
            loading="lazy"
            decoding="async"
            width={200}
            height={200}
            className={`h-full w-full object-cover [filter:${IMAGE_GRADE}] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:[filter:${IMAGE_GRADE_HOVER}]`}
          />
          <ImageAtmosphere />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-primary transition-transform duration-300 ease-out group-hover:translate-x-0.5">
            {brand.name}
          </div>
          <h4 className="mb-1.5 truncate text-sm font-bold leading-tight transition-colors group-hover:text-primary">
            {model.name}
          </h4>
          <div className="flex items-center justify-between">
            {price && <span className="text-sm font-bold">{price}</span>}
            <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function FeaturedProductsSection() {
  const items = useMemo(
    () =>
      CURATED_SHOWCASE.map(({ brandSlug, modelSlug }) => getBrandModel(brandSlug, modelSlug)).filter(
        (x): x is ShowcaseItem => Boolean(x),
      ),
    [],
  );
  const [flagship, ...supporting] = items;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const revealClass = isInView ? "animate-fade-up" : "opacity-0 motion-reduce:opacity-100";
  const revealStyle = (delayMs: number) => (isInView ? { animationDelay: `${delayMs}ms` } : undefined);

  if (!flagship) return null;

  return (
    <section ref={sectionRef} className="relative overflow-x-clip py-20 md:py-24">
      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />

      <div className="container-premium">
        <div className="mb-10 flex items-end justify-between md:mb-12">
          <div>
            <SectionEyebrow className={`mb-3 ${revealClass}`} style={revealStyle(0)}>
              Coleção
            </SectionEyebrow>
            <h2 className={`text-4xl font-bold md:text-5xl ${revealClass}`} style={revealStyle(110)}>
              Produtos em Destaque
            </h2>
          </div>
          <Link
            to="/products"
            className={`hidden items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:inline-flex ${revealClass}`}
            style={revealStyle(220)}
          >
            Ver todos <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
          <HeroSpotlight item={flagship} isInView={isInView} />

          <div
            className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 lg:mx-0 lg:max-h-[640px] lg:flex-col lg:gap-3 lg:overflow-x-visible lg:overflow-y-auto lg:px-0"
            aria-label="Mais peças da coleção"
          >
            {supporting.map((item, i) => (
              <CompactCard
                key={`${item.brand.slug}-${item.model.slug}`}
                item={item}
                isInView={isInView}
                revealDelayMs={180 + i * 70}
              />
            ))}
          </div>
        </div>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:hidden"
        >
          Ver todos <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
