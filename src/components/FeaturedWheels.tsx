import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { fetchFeaturedWheels } from "@/lib/shopify";

/**
 * Produtos em Destaque (persistido no Shopify)
 * ---------------------------------------------------------------
 * A ordenação e o estado ativo/inativo vivem nos metafields do
 * produto no Shopify Admin:
 *   - Tag obrigatória:    featured
 *   - Metafield boolean:  redline.featured_enabled  (false = oculto)
 *   - Metafield integer:  redline.featured_order    (menor = primeiro)
 *
 * Definir em Settings → Custom data → Products (com Storefront access).
 */
export function FeaturedWheels() {
  const { data: wheels = [], isLoading, isError } = useQuery({
    queryKey: ["featured-wheels"],
    queryFn: () => fetchFeaturedWheels(24),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square bg-surface/40 border border-border/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || wheels.length === 0) {
    return (
      <div className="text-center py-20 border border-border/60 bg-surface/30">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Em breve</div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Novos produtos em destaque serão adicionados em breve. Fica atento às novidades da REDLINE Performance.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {wheels.map((w) => (
        <Link
          key={w.id}
          to="/product/$handle"
          params={{ handle: w.handle }}
          className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Ver detalhes de ${w.title}`}
        >
          <div className="aspect-square overflow-hidden bg-background relative">
            {w.image && (
              <img
                src={w.image}
                alt={w.imageAlt}
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            )}
            {w.vendor && (
              <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary border border-primary/40">
                {w.vendor}
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-1 gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors">{w.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{w.description}</p>
            </div>
            <span className="inline-flex items-center justify-center bg-primary group-hover:bg-primary/90 rounded-none h-10 uppercase tracking-wider text-[11px] w-full text-primary-foreground font-medium">
              Ver Produto <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
