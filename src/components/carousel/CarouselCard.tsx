import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export type CarouselCategory = {
  slug: string;
  name: string;
  img: string;
  desc: string;
  urlSlug: string;
};

type CarouselCardProps = {
  category: CarouselCategory;
  /** Distância (em nº de posições) até ao cartão ativo. 0 = ativo/centrado. */
  offset: number;
  onFocusCard: () => void;
};

// Ajusta aqui a "profundidade" do efeito 3D — afastamento, rotação e escala dos cartões laterais.
const STEP_TRANSLATE_PERCENT = 66; // % da largura do próprio cartão, por posição de distância
const SIDE_SCALE = 0.86;
const SIDE_ROTATE_DEG = 10;
const SIDE_OPACITY = 0.45;
const FAR_OPACITY = 0;

export function CarouselCard({ category, offset, onFocusCard }: CarouselCardProps) {
  const absOffset = Math.abs(offset);
  const isActive = offset === 0;
  const isVisible = absOffset <= 1;

  const translateX = offset * STEP_TRANSLATE_PERCENT;
  const scale = isActive ? 1 : SIDE_SCALE;
  const rotateY = isActive ? 0 : offset > 0 ? -SIDE_ROTATE_DEG : SIDE_ROTATE_DEG;
  const opacity = isActive ? 1 : absOffset === 1 ? SIDE_OPACITY : FAR_OPACITY;
  const zIndex = 20 - absOffset;
  const blur = isActive ? 0 : 1.5;

  const cardStyle: CSSProperties = {
    transform: `translate(-50%, 0) translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
    opacity,
    zIndex,
    filter: blur ? `blur(${blur}px)` : undefined,
    willChange: "transform, opacity",
    pointerEvents: isVisible ? "auto" : "none",
    visibility: absOffset > 2 ? "hidden" : "visible",
  };

  const inner = (
    <article
      className={`h-full bg-surface border transition-colors duration-500 flex flex-col overflow-hidden ${
        isActive
          ? "border-primary/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]"
          : "border-border/60"
      }`}
    >
      <div className="aspect-square overflow-hidden bg-background">
        <img
          src={category.img}
          alt={category.name}
          loading="lazy"
          decoding="async"
          width={1024}
          height={1024}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-3 md:gap-4 text-left">
        <div className="flex-1">
          <h3 className="font-bold text-base md:text-lg leading-tight mb-1.5 md:mb-2">
            {category.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {category.desc}
          </p>
        </div>
        {isActive ? (
          <Button
            asChild
            variant="outline"
            className="rounded-none h-11 md:h-12 uppercase tracking-wider text-xs w-full hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            <Link to="/produtos/$slug" params={{ slug: category.urlSlug }}>
              Ver Mais <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div className="h-11 md:h-12 flex items-center justify-center border border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
            Ver Mais <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div
      className="absolute top-0 left-1/2 w-[78%] sm:w-[64%] md:w-[52%] lg:w-[38%] transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={cardStyle}
      aria-hidden={!isVisible}
    >
      {isActive ? (
        inner
      ) : (
        <button
          type="button"
          onClick={onFocusCard}
          aria-label={`Ver ${category.name}`}
          tabIndex={isVisible ? 0 : -1}
          className="w-full h-full text-left cursor-pointer"
        >
          {inner}
        </button>
      )}
    </div>
  );
}
