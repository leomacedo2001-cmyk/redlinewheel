import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { DetailCallout } from "./DetailCallout";
import type { TransformationCallout } from "@/lib/transformations";

type CompareSliderProps = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  callouts: TransformationCallout[];
  active: boolean;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Instrumento de comparação Antes/Depois. A posição do arraste vive inteiramente
 * num motion value do framer-motion: `clip-path`, o filtro de contraste/saturação
 * e a posição do próprio traço/pega são escritos diretamente no DOM a cada frame
 * (via `style`), sem nunca passar por um re-render do React — só o React
 * re-renderiza quando um callout muda de visível/invisível (raro, não por pixel).
 */
export function CompareSlider({ before, after, beforeAlt, afterAlt, callouts, active }: CompareSliderProps) {
  const x = useMotionValue(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const [dragging, setDragging] = useState(false);

  const [visibleCallouts, setVisibleCallouts] = useState<Set<string>>(
    () => new Set(callouts.filter((c) => c.revealAt <= 50).map((c) => c.id)),
  );
  const visibleRef = useRef(visibleCallouts);
  visibleRef.current = visibleCallouts;

  const leftPercent = useMotionTemplate`${x}%`;
  const revealPercent = useTransform(x, (v) => 100 - v);
  const clipPath = useMotionTemplate`inset(0 ${revealPercent}% 0 0)`;

  const afterContrast = useTransform(x, (v) => 1 + v / 2500);
  const afterSaturate = useTransform(x, (v) => 1 + v / 3000);
  const afterFilter = useMotionTemplate`contrast(${afterContrast}) saturate(${afterSaturate})`;

  const beforeContrast = useTransform(x, (v) => 1 - (100 - v) / 3500);
  const beforeSaturate = useTransform(x, (v) => 1 - (100 - v) / 4000);
  const beforeFilter = useMotionTemplate`contrast(${beforeContrast}) saturate(${beforeSaturate})`;

  useEffect(() => {
    const unsubscribe = x.on("change", (v) => {
      handleRef.current?.setAttribute("aria-valuenow", String(Math.round(v)));

      let changed = false;
      const next = new Set(visibleRef.current);
      for (const c of callouts) {
        const shouldShow = v >= c.revealAt;
        if (shouldShow && !next.has(c.id)) {
          next.add(c.id);
          changed = true;
        } else if (!shouldShow && next.has(c.id)) {
          next.delete(c.id);
          changed = true;
        }
      }
      if (changed) setVisibleCallouts(next);
    });
    return unsubscribe;
  }, [x, callouts]);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      x.set(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
    },
    [x],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    containerRef.current?.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const stopDragging = (e: React.PointerEvent) => {
    setDragging(false);
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // pointer já pode ter sido libertado pelo browser — sem efeito.
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      x.set(clamp(x.get() - 5, 0, 100));
      e.preventDefault();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      x.set(clamp(x.get() + 5, 0, 100));
      e.preventDefault();
    } else if (e.key === "Home") {
      x.set(0);
      e.preventDefault();
    } else if (e.key === "End") {
      x.set(100);
      e.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full touch-none select-none overflow-hidden rounded-sm bg-background"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <motion.img
        src={before}
        alt={beforeAlt}
        loading={active ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: beforeFilter }}
      />

      <motion.img
        src={after}
        alt={afterAlt}
        loading={active ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ clipPath, filter: afterFilter }}
      />

      {callouts.map((c) => (
        <DetailCallout
          key={c.id}
          label={c.label}
          xPercent={c.xPercent}
          yPercent={c.yPercent}
          visible={visibleCallouts.has(c.id)}
        />
      ))}

      <div className="pointer-events-none absolute left-4 top-4 text-[10px] uppercase tracking-[0.3em] text-white/60">
        Antes
      </div>
      <div className="pointer-events-none absolute right-4 top-4 text-[10px] uppercase tracking-[0.3em] text-white">
        Depois
      </div>

      <motion.div
        className="pointer-events-none absolute top-0 bottom-0 w-px bg-white/70"
        style={{ left: leftPercent }}
      />

      <motion.button
        ref={handleRef}
        type="button"
        role="slider"
        aria-label="Comparar volante antes e depois da personalização REDLINE"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        onKeyDown={onKeyDown}
        style={{ left: leftPercent }}
        className={`absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/50 bg-background/80 text-white/80 backdrop-blur transition-[box-shadow,transform] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          dragging
            ? "scale-110 shadow-lg shadow-primary/50 ring-4 ring-primary/30"
            : "shadow-[0_0_16px_rgba(0,0,0,0.5)]"
        }`}
      >
        <span className="flex gap-1">
          <span className="h-3 w-px bg-current" />
          <span className="h-3 w-px bg-current" />
        </span>
      </motion.button>
    </div>
  );
}
