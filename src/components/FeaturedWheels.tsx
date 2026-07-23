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
import { BRANDS, type Brand, type BrandModel } from "@/lib/brands";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { CarouselControls } from "@/components/carousel/CarouselControls";
import { AmbientGlow } from "@/components/AmbientGlow";

/**
 * Produtos em Destaque — carrossel de foco central, ao estilo de um
 * configurador automóvel premium (Apple/Porsche): o cartão perfeitamente
 * centrado é sempre o "hero" (maior, nítido, com glow) e os cartões
 * laterais recuam progressivamente em escala/nitidez/brilho consoante a
 * distância ao centro — nunca desaparecem, só perdem importância.
 *
 * Mecânica: scroll horizontal nativo com `scroll-snap` (dá de graça o
 * "assenta sempre num cartão, nunca a meio" e o momentum/easing do
 * dispositivo) + arrastar com o rato (que não tem scroll nativo por
 * arrasto) + um loop de rAF, ligado ao evento de scroll, que lê a posição
 * de cada cartão e escreve escala/opacidade/blur/sombra directamente no
 * DOM — nunca via `setState`, para não re-renderizar React a cada frame.
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

/** A peça que ancora a hierarquia visual da vitrine quando ainda ninguém tocou no carrossel. */
const FLAGSHIP_SLUG = "g-series-forged-magenta";

/** Inclinação máxima do tilt 3D ao seguir o cursor — física, nunca dramática. */
const MAX_TILT_DEG = 2.5;

const GAP_PX = 24; // gap-6

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

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type CardProps = FeaturedItem & {
  flagship: boolean;
  isInView: boolean;
  revealDelayMs: number;
  cardRef: (el: HTMLDivElement | null) => void;
};

function Card({ brand, model, flagship, isInView, revealDelayMs, cardRef }: CardProps) {
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

  const innerTransform =
    hovered && !reducedMotion
      ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
      : undefined;

  return (
    <div
      ref={cardRef}
      data-hero="false"
      className={`group/hero shrink-0 basis-[280px] snap-center sm:basis-[320px] lg:basis-[340px] ${
        isInView ? "animate-card-reveal motion-reduce:animate-none" : "opacity-0 motion-reduce:opacity-100"
      }`}
      style={isInView ? { animationDelay: `${revealDelayMs}ms` } : undefined}
    >
      <Link
        ref={linkRef}
        to="/brand/$slug/model/$model"
        params={{ slug: brand.slug, model: model.slug }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{ transform: innerTransform }}
        aria-label={`Ver detalhes de ${model.name}`}
        className={`group relative flex h-full flex-col border bg-surface transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:!transform-none ${
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

          {/* reflexo de carbono — luz de estúdio a passar pela superfície; dispara no hover
              REAL do rato E sempre que o cartão chega ao centro (ver data-hero no rAF). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-[130%] rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[130%] group-data-[hero=true]/hero:translate-x-[130%] motion-reduce:hidden"
          />

          <div className="absolute left-3 top-3 z-10 border border-primary/40 bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur transition-[transform,border-color] duration-300 ease-out group-hover:scale-105 group-data-[hero=true]/hero:border-primary/80">
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

export function FeaturedProductsSection() {
  const items = useMemo(collectFeatured, []);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);
  const nearestIndex = useRef(0);
  const [isInView, setIsInView] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const applyCoverflowStyles = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const centerX = scrollerRect.left + scrollerRect.width / 2;

    let minDist = Infinity;
    let minIndex = 0;

    cardEls.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - centerX);
      if (dist < minDist) {
        minDist = dist;
        minIndex = i;
      }
      const t = dist / (rect.width + GAP_PX); // 0 = centrado, 1 = ~um cartão de distância

      const scale = lerp(1.12, 0.95, clamp(t / 1.4, 0, 1));
      const opacityT = clamp(t / 2, 0, 1);
      const opacity = lerp(1, 0.55, opacityT);
      const blur = lerp(0, 2.2, clamp((t - 0.35) / 1.2, 0, 1));
      const brightness = lerp(1, 0.78, opacityT);
      const glow = clamp(1 - t / 0.55, 0, 1);
      const zIndex = Math.round(50 - t * 10);
      const isHero = t < 0.12;

      el.style.transform = reducedMotion ? "" : `scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.filter = reducedMotion ? "" : `blur(${blur}px) brightness(${brightness})`;
      el.style.zIndex = String(zIndex);
      el.style.boxShadow =
        glow > 0.05
          ? `0 ${18 + glow * 26}px ${40 + glow * 40}px -20px rgba(0,0,0,${0.45 + glow * 0.2}), 0 0 ${
              glow * 60
            }px 0 oklch(0.6 0.23 32 / ${glow * 0.3})`
          : "none";
      el.dataset.hero = isHero ? "true" : "false";
    });

    nearestIndex.current = minIndex;
  }, [reducedMotion]);

  const scheduleUpdate = useCallback(() => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      applyCoverflowStyles();
    });
  }, [applyCoverflowStyles]);

  const handleScroll = useCallback(() => {
    scheduleUpdate();
    const scroller = scrollerRef.current;
    if (scroller) {
      setAtStart(scroller.scrollLeft < 8);
      setAtEnd(scroller.scrollLeft > scroller.scrollWidth - scroller.clientWidth - 8);
    }
    if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const target = cardEls.current[nearestIndex.current];
      target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, 120);
  }, [scheduleUpdate]);

  useEffect(() => {
    applyCoverflowStyles();
    const onResize = () => applyCoverflowStyles();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyCoverflowStyles, items.length]);

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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = clamp(index, 0, cardEls.current.length - 1);
    cardEls.current[clamped]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const goPrev = useCallback(() => goTo(nearestIndex.current - 1), [goTo]);
  const goNext = useCallback(() => goTo(nearestIndex.current + 1), [goTo]);

  // Arrastar com o rato usa listeners nativos em `window` (não os props
  // onPointerMove/onPointerUp do React) de propósito: com setPointerCapture
  // ativo, o evento passa a ser entregue via o alvo capturado e o sistema
  // de eventos sintéticos do React deixa, na prática, de o reencaminhar de
  // forma fiável — o evento nativo chega, o synthetic não. Ouvir em
  // `window` evita por completo essa reencaminhação e funciona sempre.
  //
  // `scroll-behavior: smooth` (necessário para o scrollIntoView do
  // assentamento/setas) tem de ser desligado enquanto se arrasta: cada
  // escrita de scrollLeft durante o arrasto ficava a competir com a
  // animação suave da escrita anterior, e a posição nunca acompanhava o
  // cursor. Volta a "smooth" só depois de soltar, para o assentamento final
  // continuar suave.
  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // toque/trackpad já têm scroll nativo
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = scroller.scrollLeft;
    scroller.style.scrollSnapType = "none";
    scroller.style.scrollBehavior = "auto";
    scroller.style.cursor = "grabbing";

    function onMove(ev: PointerEvent) {
      if (!dragging.current || !scroller) return;
      scroller.scrollLeft = dragStartScroll.current - (ev.clientX - dragStartX.current);
      scheduleUpdate();
    }

    function onUp() {
      if (!dragging.current) return;
      dragging.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!scroller) return;
      scroller.style.cursor = "";
      scroller.style.scrollSnapType = "";
      scroller.style.scrollBehavior = "";
      cardEls.current[nearestIndex.current]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }, [scheduleUpdate]);

  if (items.length === 0) {
    return (
      <section className="container-premium py-20 md:py-24">
        <div className="text-center py-20 border border-border/60 bg-surface/30">
          <p className="text-muted-foreground">Sem produtos em destaque disponíveis.</p>
        </div>
      </section>
    );
  }

  const revealClass = (delayMs: number) =>
    isInView ? "animate-fade-up" : "opacity-0 motion-reduce:opacity-100";
  const revealStyle = (delayMs: number) =>
    isInView ? { animationDelay: `${delayMs}ms` } : undefined;

  return (
    <section ref={sectionRef} className="relative py-20 md:py-24">
      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />

      <div className="container-premium">
        <div className="flex items-end justify-between mb-12 md:mb-14">
          <div>
            <SectionEyebrow className={`mb-3 ${revealClass(0)}`} style={revealStyle(0)}>
              Coleção
            </SectionEyebrow>
            <h2 className={`text-4xl md:text-5xl font-bold ${revealClass(110)}`} style={revealStyle(110)}>
              Produtos em Destaque
            </h2>
          </div>
          <Link
            to="/products"
            className={`hidden md:inline-flex items-center text-sm font-medium hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${revealClass(
              220,
            )}`}
            style={revealStyle(220)}
          >
            Ver todos <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* carril a sangrar até à borda do ecrã — o cabeçalho acima mantém-se alinhado
          ao container normal, só o próprio carrossel "respira" para fora dele. */}
      <div
        className={`relative left-1/2 w-screen -translate-x-1/2 ${revealClass(320)}`}
        style={revealStyle(320)}
      >
        <div className="relative">
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            onPointerDown={onPointerDown}
            className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[calc(50%-140px)] py-10 motion-reduce:scroll-auto sm:px-[calc(50%-160px)] lg:px-[calc(50%-170px)]"
            style={{ touchAction: "pan-y" }}
            aria-label="Produtos em destaque — desliza ou arrasta para explorar"
          >
            {items.map((item, i) => (
              <Card
                key={`${item.brand.slug}-${item.model.slug}`}
                brand={item.brand}
                model={item.model}
                flagship={item.model.slug === FLAGSHIP_SLUG}
                isInView={isInView}
                revealDelayMs={420 + Math.min(i, 7) * 60}
                cardRef={(el) => {
                  cardEls.current[i] = el;
                }}
              />
            ))}
          </div>

          <div className="hidden sm:block">
            <CarouselControls onPrev={goPrev} onNext={goNext} />
          </div>
        </div>
      </div>
    </section>
  );
}
