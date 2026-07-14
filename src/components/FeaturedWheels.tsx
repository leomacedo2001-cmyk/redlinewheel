import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BRANDS, type Brand, type BrandModel } from "@/lib/brands";

/**
 * Produtos em Destaque — marquee contínuo, fluido e elegante.
 * Movimento constante da direita para a esquerda, com aceleração linear.
 * Pausa suavemente ao passar o rato (desktop).
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

function Card({ brand, model }: FeaturedItem) {
  const price = model.price
    ? `${model.price.currency === "EUR" ? "€" : model.price.currency + " "}${model.price.amount.toFixed(0)}`
    : null;
  return (
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
  );
}

export function FeaturedWheels() {
  const items = useMemo(collectFeatured, []);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 border border-border/60 bg-surface/30">
        <p className="text-muted-foreground">Sem produtos em destaque disponíveis.</p>
      </div>
    );
  }

  // Duplicar a lista para permitir loop contínuo sem saltos.
  const loop = [...items, ...items];
  // Duração proporcional ao número de itens (movimento lento e elegante).
  const durationSec = items.length * 6;

  return (
    <div
      className="relative overflow-hidden group/marquee"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
      }}
      aria-label="Produtos em destaque"
    >
      <div
        className="flex gap-6 w-max animate-marquee-x group-hover/marquee:[animation-play-state:paused]"
        style={{ animationDuration: `${durationSec}s` }}
      >
        {loop.map(({ brand, model }, i) => (
          <div
            key={`${brand.slug}-${model.slug}-${i}`}
            className="shrink-0 basis-[280px] sm:basis-[320px] lg:basis-[340px]"
          >
            <Card brand={brand} model={model} />
          </div>
        ))}
      </div>
    </div>
  );
}
