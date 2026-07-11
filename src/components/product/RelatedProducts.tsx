import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Brand, BrandModel } from "@/lib/brands";

interface Props {
  brand: Brand;
  currentSlug: string;
}

export function RelatedProducts({ brand, currentSlug }: Props) {
  const related = brand.models.filter((m) => m.slug !== currentSlug).slice(0, 6);
  if (related.length === 0) return null;

  return (
    <section className="mt-16 md:mt-24">
      <header className="mb-6 border-b border-border/60 pb-4 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Também da {brand.name}</div>
          <h2 className="text-2xl md:text-3xl font-bold">Produtos relacionados</h2>
        </div>
        <Link
          to="/brand/$slug"
          params={{ slug: brand.slug }}
          className="hidden sm:inline-flex items-center text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
        >
          Ver todos <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {related.map((m: BrandModel) => (
          <Link
            key={m.slug}
            to="/brand/$slug/model/$model"
            params={{ slug: brand.slug, model: m.slug }}
            className="group block"
          >
            <div className="aspect-square bg-surface overflow-hidden border border-border/60 group-hover:border-primary/50 transition-colors">
              <img
                src={m.img}
                alt={`${brand.name} ${m.name}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-2">
              <div className="text-sm font-semibold truncate">{m.name}</div>
              {m.chassis && (
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{m.chassis}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
