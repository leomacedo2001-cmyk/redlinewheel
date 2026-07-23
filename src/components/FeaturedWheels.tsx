import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BRANDS, type Brand, type BrandModel } from "@/lib/brands";

/**
 * Produtos em Destaque — vitrine em movimento contínuo, estilo "marquee" premium.
 *
 * Nota técnica sobre o loop infinito:
 * A lista de itens é duplicada (para dar a sensação de infinito) e o track desloca-se
 * em translateX. Em vez de usar "-50%" (que, com gaps entre cartões, NÃO corresponde
 * exatamente à largura de um conjunto de itens — a diferença é a causa mais comum de
 * "saltos" visíveis em marquees), medimos com ResizeObserver a distância real em pixels
 * entre o início do 1º cartão e o início do cartão duplicado equivalente. Isso garante
 * uma junção matematicamente exata, invisível, independentemente do nº de itens, do
 * gap ou do breakpoint responsivo.
 */

const FEATURED_SLUGS: string[] = [
  "g-series-forged-magenta",
  "f-series-carbon-red",
  "g20-blue-carbon-signature",
  "f30-alcantara-signature",
  "f30-mperf-blue-signature",
  "w213-amg-edition1-signature",
  "w213-amg-forged-red-signature",
  "w213-amg-red-signature",
  "w205-amg-yellow-signature",
  "8y-carbon-signature",
  "b8-rs-blue-signature",
  "991-carbon-signature",
];

/** A peça que ancora a hierarquia visual da vitrine — ver ponto 1 do pedido. */
const FLAGSHIP_SLUG = "g-series-forged-magenta";

// Velocidade constante e lenta (pixels por segundo). Ajusta este valor para
// acelerar/abrandar — a duração é sempre recalculada a partir da largura real.
const MARQUEE_SPEED_PX_PER_SEC = 34;

/** Inclinação máxima do tilt 3D ao seguir o cursor — física, nunca dramática. */
const MAX_TILT_DEG = 2.5;

type FeaturedItem = { brand: Brand; model: BrandModel };

function collectFeatured(): FeaturedItem[] {
  const map = new Map<string, FeaturedItem>();
  for (const brand of BRANDS) {
    for (const model of brand.models) {
      map.set(model.slug, { brand, model });
    }
  }
  return FEATURED_SLUGS.map((slug) => map.get(slug)).filter((x): x is FeaturedItem => Boolean(x));
}

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

type CardProps = FeaturedItem & {
  flagship: boolean;
  isInView: boolean;
  revealDelayMs: number;
};

function Card({ brand, model, flagship, isInView, revealDelayMs }: CardProps) {
  const price = model.price
    ? `${model.price.currency === "EUR" ? "€" : model.price.currency + " "}${model.price.amount.toFixed(0)}`
    : null;

  const linkRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLAnchorElement>) => {
      if (reducedMotion || e.pointerType !== "mouse") return;
      const rect = linkRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setTilt({ x: (0.5 - py) * 2 * MAX_TILT_DEG, y: (px - 0.5) * 2 * MAX_TILT_DEG });
    },
    [reducedMotion],
  );

  const handlePointerEnter = useCallback(
    (e: ReactPointerEvent<HTMLAnchorElement>) => {
      if (!reducedMotion && e.pointerType === "mouse") setHovered(true);
    },
    [reducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const transform =
    hovered && !reducedMotion
      ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
      : undefined;

  return (
    <div
      className={
        isInView
          ? "h-full animate-card-reveal motion-reduce:animate-none"
          : "h-full opacity-0 motion-reduce:opacity-100"
      }
      style={isInView ? { animationDelay: `${revealDelayMs}ms` } : undefined}
    >
      <Link
        ref={linkRef}
        to="/brand/$slug/model/$model"
        params={{ slug: brand.slug, model: model.slug }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{ transform }}
        aria-label={`Ver detalhes de ${model.name}`}
        className={`group relative flex h-full flex-col border bg-surface transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:border-primary/60 hover:shadow-[0_32px_60px_-26px_rgba(0,0,0,0.65),0_0_46px_-16px_oklch(0.58_0.22_25/0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:!transform-none ${
          flagship ? "border-primary/35" : "border-border/60"
        }`}
      >
        {flagship && (
          <span className="absolute left-4 top-0 z-20 -translate-y-1/2 bg-primary px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
            Peça de Assinatura
          </span>
        )}

        <span className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />

        <div className="relative aspect-square overflow-hidden bg-background">
          <img
            src={model.img}
            alt={model.name}
            loading="eager"
            decoding="async"
            width={1024}
            height={1024}
            className="h-full w-full object-cover [filter:brightness(0.93)_contrast(1.08)_saturate(1.02)] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:[filter:brightness(0.97)_contrast(1.15)_saturate(1.05)]"
          />

          {/* vinheta — unifica fundos inconsistentes (verde/cinza/preto) sem tocar nas fotos originais */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(120% 120% at 50% 45%, transparent 45%, oklch(0 0 0 / 0.42) 100%)",
            }}
          />

          {/* reflexo de carbono — luz de estúdio a passar pela superfície, quase impercetível */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-[130%] rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[130%] motion-reduce:hidden"
          />

          <div className="absolute left-3 top-3 z-10 border border-primary/40 bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur transition-transform duration-300 ease-out group-hover:scale-105">
            {brand.name}
          </div>
          {model.status && (
            <div className="absolute right-3 top-3 z-10 border border-border bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/80 backdrop-blur transition-transform duration-300 ease-out group-hover:scale-105">
              {model.status}
            </div>
          )}
        </div>

        <div className="relative flex flex-1 flex-col gap-4 p-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
          <div className="flex-1">
            <h3 className="mb-2 text-base font-bold leading-tight transition-colors group-hover:text-primary">
              {model.name}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">{model.description}</p>
          </div>
          <div className="flex items-end justify-between pt-1">
            {price && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Desde</div>
                <div className="text-xl font-bold tracking-tight">{price}</div>
              </div>
            )}
            <span className="inline-flex flex-col items-start text-[11px] font-medium uppercase tracking-wider text-primary">
              <span className="inline-flex items-center transition-transform duration-300 ease-out group-hover:translate-x-1">
                Ver Produto <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </span>
              <span className="mt-0.5 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function FeaturedWheels() {
  const items = useMemo(collectFeatured, []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null); // marca o início do conjunto duplicado
  const [distance, setDistance] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const seam = seamRef.current;
    if (!track || !seam) return;

    function measure() {
      if (!track || !seam) return;
      const trackLeft = track.getBoundingClientRect().left;
      const seamLeft = seam.getBoundingClientRect().left;
      const measured = seamLeft - trackLeft;
      if (measured > 0) setDistance(measured);
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [items.length]);

  // Entrada em cascata — dispara uma única vez quando a vitrine entra em vista.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 border border-border/60 bg-surface/30">
        <p className="text-muted-foreground">Sem produtos em destaque disponíveis.</p>
      </div>
    );
  }

  // Duplicar a lista para permitir loop contínuo; a distância exata de translação
  // é medida em runtime (ver useEffect acima), não assumida a partir do nº de itens.
  const loop = [...items, ...items];
  const durationSec = distance ? distance / MARQUEE_SPEED_PX_PER_SEC : undefined;

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden group/marquee"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
      }}
      aria-label="Produtos em destaque"
    >
      <div
        ref={trackRef}
        className={
          distance
            ? "flex gap-6 w-max animate-marquee-x group-hover/marquee:[animation-play-state:paused] motion-reduce:[animation-play-state:paused] opacity-100 transition-opacity duration-500"
            : "flex gap-6 w-max opacity-0"
        }
        style={
          distance
            ? ({
                "--marquee-distance": `${distance}px`,
                animationDuration: `${durationSec}s`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {loop.map(({ brand, model }, i) => (
          <div
            key={`${brand.slug}-${model.slug}-${i}`}
            ref={i === items.length ? seamRef : undefined}
            className="shrink-0 basis-[280px] sm:basis-[320px] lg:basis-[340px]"
          >
            <Card
              brand={brand}
              model={model}
              flagship={model.slug === FLAGSHIP_SLUG}
              isInView={isInView}
              revealDelayMs={Math.min(i % items.length, 7) * 70}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
