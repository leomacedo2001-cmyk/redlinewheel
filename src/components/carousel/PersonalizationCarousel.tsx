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

export function PersonalizationCarousel({ categories }: PersonalizationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const length = categories.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [isInView, setIsInView] = useState(false);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + length) % length);
  }, [length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % length);
  }, [length]);

  // Navegação por teclado (← →), ativa apenas quando o carousel está visível no ecrã,
  // para não interferir com outras interações da página.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
        className="relative h-[560px] sm:h-[600px] md:h-[640px] overflow-hidden"
        style={{ perspective: "1800px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {categories.map((cat, i) => (
          <CarouselCard
            key={cat.slug}
            category={cat}
            offset={getCircularOffset(i, activeIndex, length)}
            onFocusCard={() => setActiveIndex(i)}
          />
        ))}
        <CarouselControls onPrev={goPrev} onNext={goNext} />
      </div>
      <CarouselIndicators count={length} activeIndex={activeIndex} onSelect={setActiveIndex} />
    </div>
  );
}
