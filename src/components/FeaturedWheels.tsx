import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { BRANDS, type Brand, type BrandModel } from "@/lib/brands";

/**
 * Produtos em Destaque — carousel automático alimentado directamente
 * pelo catálogo local (`src/lib/brands.ts`).
 *
 * Curadoria: selecção manual dos volantes signature com fotografia real
 * (carbono, carbono forjado, Alcântara, pele perfurada). Cada cartão liga
 * exclusivamente à página individual do produto em
 * `/brand/$slug/model/$model`.
 */

// Slugs signature com fotografia real editada.
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

type FeaturedItem = { brand: Brand; model: BrandModel };

function collectFeatured(): FeaturedItem[] {
  const map = new Map<string, FeaturedItem>();
  for (const brand of BRANDS) {
    for (const model of brand.models) {
      map.set(model.slug, { brand, model });
    }
  }
  return FEATURED_SLUGS
    .map((slug) => map.get(slug))
    .filter((x): x is FeaturedItem => Boolean(x));
}

export function FeaturedWheels() {
  const items = useMemo(collectFeatured, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onInit = () => setSnapCount(emblaApi.scrollSnapList().length);
    onInit();
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      onInit();
      onSelect();
    });
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 border border-border/60 bg-surface/30">
        <p className="text-muted-foreground">Sem produtos em destaque disponíveis.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6">
          {items.map(({ brand, model }) => {
            const price = model.price
              ? `${model.price.currency === "EUR" ? "€" : model.price.currency + " "}${model.price.amount.toFixed(0)}`
              : null;
            return (
              <div
                key={`${brand.slug}-${model.slug}`}
                className="pl-6 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link
                  to="/brand/$slug/model/$model"
                  params={{ slug: brand.slug, model: model.slug }}
                  className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Ver detalhes de ${model.name}`}
                >
                  <div className="aspect-square overflow-hidden bg-background relative">
                    <img
                      src={model.img}
                      alt={model.name}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary border border-primary/40">
                      {brand.name}
                    </div>
                    {model.status && (
                      <div className="absolute top-3 right-3 bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/80 border border-border">
                        {model.status}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors">
                        {model.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {model.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      {price && (
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Desde</div>
                          <div className="text-base font-bold">{price}</div>
                        </div>
                      )}
                      <span className="inline-flex items-center text-[11px] uppercase tracking-wider font-medium text-primary group-hover:translate-x-1 transition-transform">
                        Ver Produto <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={`h-1 transition-all ${
                i === selected ? "w-8 bg-primary" : "w-4 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Produto anterior"
            className="h-10 w-10 border border-border/60 hover:border-primary hover:text-primary transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Próximo produto"
            className="h-10 w-10 border border-border/60 hover:border-primary hover:text-primary transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
