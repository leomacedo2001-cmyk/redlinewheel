import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientGlow } from "@/components/AmbientGlow";
import { ACTIVE_BRAND_SHOWCASE_SLIDES, type BrandShowcaseSlide } from "@/lib/brandShowcase";

const AUTOPLAY_INTERVAL_MS = 7000;

type BrandShowcaseNavProps = {
  slides: BrandShowcaseSlide[];
  activeIndex: number;
  onSelect: (index: number) => void;
  paused: boolean;
  onTogglePaused: () => void;
};

/**
 * Barra de progresso segmentada (uma por marca) em vez de separadores em
 * pílula — cada segmento enche ao ritmo do autoplay, como stories; clicar
 * salta diretamente para essa marca.
 */
function BrandShowcaseNav({ slides, activeIndex, onSelect, paused, onTogglePaused }: BrandShowcaseNavProps) {
  return (
    <div className="flex items-center gap-6 sm:gap-8">
      <div role="tablist" aria-label="Selecionar marca" className="flex flex-1 gap-4 sm:gap-6">
        {slides.map((slide, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={slide.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(i)}
              className="group flex-1 cursor-pointer text-left focus:outline-none"
            >
              <span className="block h-[2px] w-full overflow-hidden bg-foreground/20">
                <span
                  key={active ? `${slide.slug}-active` : "idle"}
                  className={`block h-full w-full bg-foreground ${active ? "animate-brand-segment-fill" : "scale-x-0"}`}
                  style={
                    active
                      ? { animationDuration: `${AUTOPLAY_INTERVAL_MS}ms`, animationPlayState: paused ? "paused" : "running" }
                      : undefined
                  }
                />
              </span>
              <span
                className={`mt-2.5 block truncate text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                }`}
              >
                {slide.name}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onTogglePaused}
        aria-label={paused ? "Retomar apresentação automática" : "Pausar apresentação automática"}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-foreground/25 text-foreground transition-colors duration-300 hover:border-foreground/60 hover:bg-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        {paused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
      </button>
    </div>
  );
}

export function BrandShowcase() {
  const slides = ACTIVE_BRAND_SHOWCASE_SLIDES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [paused, setPaused] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const autoplayTimer = useRef<number | null>(null);

  const clearAutoplay = useCallback(() => {
    if (autoplayTimer.current !== null) {
      window.clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  const restartAutoplay = useCallback(() => {
    clearAutoplay();
    if (!isInView || paused || slides.length <= 1) return;
    autoplayTimer.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);
  }, [clearAutoplay, isInView, paused, slides.length]);

  // Pausa quando a secção sai do ecrã — poupa CPU/GPU sem qualquer benefício visual.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Único ponto de criação do timer — reinicia sempre que a marca ativa muda
  // (manual ou automaticamente), nunca há mais do que um intervalo ativo.
  useEffect(() => {
    restartAutoplay();
    return clearAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartAutoplay, clearAutoplay, activeIndex]);

  const active = slides[activeIndex];
  if (!active) return null;

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-[560px] flex-col justify-end overflow-hidden sm:h-[640px] md:h-[760px]"
    >
      <AmbientGlow edge="top" />

      {/* pré-carregamento fora de ecrã — garante zero flash ao trocar de marca */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        {slides.map((s) => (
          <img key={s.slug} src={s.image} alt="" loading="eager" decoding="async" />
        ))}
      </div>

      <AnimatePresence>
        <motion.div
          key={active.slug}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img
            src={active.image}
            alt={`Interior ${active.name} com volante REDLINE instalado`}
            className="h-full w-full origin-center object-cover animate-brand-ken-burns"
          />
        </motion.div>
      </AnimatePresence>

      {/* Escurece toda a metade inferior — onde vivem o texto e a barra de progresso — o
          suficiente para ler bem mesmo quando o volante da foto cai perto do centro (ex.: BMW),
          sem depender de recortar/posicionar cada imagem de forma diferente. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background from-0% via-background/55 via-45% to-transparent to-90%"
      />

      <div className="container-premium relative z-10 pb-10 md:pb-12">
        <AnimatePresence>
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-md"
          >
            <h2 className="text-3xl font-bold leading-[0.95] md:text-5xl">{active.headline}</h2>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground md:text-base">{active.subtitle}</p>
            <Button
              asChild
              size="lg"
              className="mt-6 h-12 rounded-none bg-primary px-7 text-sm uppercase tracking-wider hover:bg-primary/90"
            >
              <Link to="/brand/$slug" params={{ slug: active.slug }}>
                {active.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container-premium relative z-10 pb-6 md:pb-8">
        <BrandShowcaseNav
          slides={slides}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          paused={paused}
          onTogglePaused={() => setPaused((p) => !p)}
        />
        <div className="mt-5 text-right">
          <Link
            to="/marcas"
            className="group/link relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Explorar todas as marcas compatíveis
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover/link:scale-x-100"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
