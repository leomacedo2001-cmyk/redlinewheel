import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { TESTIMONIALS } from "@/lib/testimonials";
import { TestimonialCard } from "./TestimonialCard";
import { CarouselControls } from "@/components/carousel/CarouselControls";
import { SectionEyebrow } from "@/components/SectionEyebrow";

/**
 * Showcase "Comunidade REDLINE" — cartões de testemunho premium.
 *
 * Carrossel de passos discretos (não um marquee contínuo): mostra várias
 * cartas lado a lado — 1 em mobile, 2 em tablet, 3+ em desktop, apenas por
 * via da largura fixa de cada cartão, sem nenhum "nº de visíveis" hardcoded
 * em JS. Avança uma carta de cada vez, de forma legível.
 *
 * Loop infinito sem saltos: cada cartão é posicionado pela distância
 * circular (com sinal) mais curta até ao "primeiro" cartão visível — o
 * mesmo princípio já validado no PersonalizationCarousel (implementado aqui
 * de forma independente, sem importar nada desse componente), garantindo
 * que o embrulho do último para o primeiro desliza sempre pelo lado mais
 * curto, nunca com um salto brusco.
 */

const SWIPE_THRESHOLD_PX = 40;
const AUTOPLAY_INTERVAL_MS = 5000;
/** % da largura do próprio cartão por posição — > 100% para abrir um respiro entre cartões. */
const STEP_TRANSLATE_PERCENT = 108;
/** Quantas posições para cada lado do cartão inicial se mantêm montadas/interativas. */
const RENDER_WINDOW = { behind: 2, ahead: 7 };

function getCircularOffset(index: number, active: number, length: number): number {
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

export function FeedbackShowcase() {
  const length = TESTIMONIALS.length;
  const [activeStart, setActiveStart] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const autoplayTimer = useRef<number | null>(null);

  const clearAutoplay = useCallback(() => {
    if (autoplayTimer.current !== null) {
      window.clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  const restartAutoplay = useCallback(() => {
    clearAutoplay();
    if (!isInView || length <= 1) return;
    autoplayTimer.current = window.setInterval(() => {
      setActiveStart((i) => (i + 1) % length);
    }, AUTOPLAY_INTERVAL_MS);
  }, [clearAutoplay, isInView, length]);

  const goPrev = useCallback(() => {
    setActiveStart((i) => (i - 1 + length) % length);
    restartAutoplay();
  }, [length, restartAutoplay]);

  const goNext = useCallback(() => {
    setActiveStart((i) => (i + 1) % length);
    restartAutoplay();
  }, [length, restartAutoplay]);

  // Pausa o autoplay quando a secção sai do ecrã — poupa CPU/GPU sem qualquer benefício visual.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Único ponto de criação do timer — nunca há mais do que um intervalo ativo.
  useEffect(() => {
    restartAutoplay();
    return clearAutoplay;
  }, [restartAutoplay, clearAutoplay]);

  function handleTouchStart(e: ReactTouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: ReactTouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      if (deltaX > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  }

  return (
    <section
      ref={sectionRef}
      id="comunidade"
      className="relative scroll-mt-24 overflow-hidden py-20 md:py-24"
    >
      {/* profundidade de fundo — mesma linguagem radial da Transformação, subtil */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(50% 45% at 50% 0%, oklch(0.58 0.22 25 / 0.06), transparent 70%)",
        }}
      />

      <div
        className={
          isInView
            ? "container-premium relative mb-12 text-center animate-fade-up md:mb-14"
            : "container-premium relative mb-12 text-center opacity-0 md:mb-14"
        }
      >
        {/* Rótulo primeiro — marca o "capítulo" antes do friso e do título,
            em vez de ficar espremido entre o friso e o título. */}
        <SectionEyebrow align="center" className="mb-5">
          Comunidade REDLINE
        </SectionEyebrow>
        <div className="mx-auto mb-6 h-px w-16 bg-primary/35" />
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Confiança que se vê ao volante.</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Instalações reais, em carros reais. Uma pequena amostra dos volantes que já saíram das
          nossas mãos para as ruas da Europa.
        </p>
      </div>

      <div className="container-premium relative">
        <div
          className="relative grid overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {TESTIMONIALS.map((testimonial, i) => {
            const offset = getCircularOffset(i, activeStart, length);
            const inWindow = offset >= -RENDER_WINDOW.behind && offset <= RENDER_WINDOW.ahead;
            return (
              <div
                key={testimonial.id}
                className="col-start-1 row-start-1 justify-self-start w-[280px] sm:w-[300px] md:w-[320px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `translateX(${offset * STEP_TRANSLATE_PERCENT}%)`,
                  opacity: inWindow ? 1 : 0,
                  visibility: inWindow ? "visible" : "hidden",
                  pointerEvents: inWindow ? "auto" : "none",
                  willChange: "transform",
                }}
                aria-hidden={!inWindow}
              >
                {/* wrapper independente: a revelação anima opacidade/translateY/blur
                    próprios, sem entrar em conflito com o translateX do carrossel acima. */}
                <div
                  className={isInView ? "animate-card-reveal h-full" : "h-full opacity-0"}
                  style={isInView ? { animationDelay: `${Math.min(i, 6) * 90}ms` } : undefined}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </div>
            );
          })}
          <CarouselControls onPrev={goPrev} onNext={goNext} />
        </div>
      </div>
    </section>
  );
}
