import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { CarouselCard, type CarouselCategory } from "./CarouselCard";
import { CarouselControls } from "./CarouselControls";
import { CarouselIndicators } from "./CarouselIndicators";

type PersonalizationCarouselProps = {
  categories: CarouselCategory[];
};

/** Distância circular (com sinal) mais curta entre `index` e `active`, num círculo de `length` posições. */
function getCircularOffset(index: number, active: number, length: number): number {
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

const SWIPE_THRESHOLD_PX = 40;
/** Intervalo entre avanços automáticos (dentro da janela de 4–5s pedida). */
const AUTOPLAY_INTERVAL_MS = 4500;

export function PersonalizationCarousel({ categories }: PersonalizationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const length = categories.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const autoplayTimer = useRef<number | null>(null);

  const clearAutoplay = useCallback(() => {
    if (autoplayTimer.current !== null) {
      window.clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  // (Re)inicia o temporizador do autoplay. Chamado no arranque e sempre que há
  // interação manual, para que a rotação automática só retome alguns segundos
  // depois da última ação do utilizador — nunca corre em paralelo com outro timer.
  const restartAutoplay = useCallback(() => {
    clearAutoplay();
    if (!isInView || length <= 1) return;
    autoplayTimer.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % length);
    }, AUTOPLAY_INTERVAL_MS);
  }, [clearAutoplay, isInView, length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + length) % length);
    restartAutoplay();
  }, [length, restartAutoplay]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % length);
    restartAutoplay();
  }, [length, restartAutoplay]);

  const goToIndex = useCallback(
    (i: number) => {
      setActiveIndex(i);
      restartAutoplay();
    },
    [restartAutoplay]
  );

  // Deteta se o carousel está visível no ecrã — usado tanto para ativar a
  // navegação por teclado como para pausar o autoplay fora de vista (poupa CPU/GPU).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Arranca/para o autoplay em função da visibilidade; único ponto de criação
  // do timer, garantindo que nunca existe mais do que um intervalo ativo.
  useEffect(() => {
    restartAutoplay();
    return clearAutoplay;
  }, [restartAutoplay, clearAutoplay]);

  useEffect(() => {
    if (!isInView) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInView, goPrev, goNext]);

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
    <div ref={containerRef}>
      <div
        className="relative grid overflow-hidden"
        style={{ perspective: "1800px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {categories.map((cat, i) => (
          <CarouselCard
            key={cat.slug}
            category={cat}
            offset={getCircularOffset(i, activeIndex, length)}
            onFocusCard={() => goToIndex(i)}
          />
        ))}
        <CarouselControls onPrev={goPrev} onNext={goNext} />
      </div>
      <CarouselIndicators count={length} activeIndex={activeIndex} onSelect={goToIndex} />
    </div>
  );
}
