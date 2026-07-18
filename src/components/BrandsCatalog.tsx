import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BRANDS } from "@/lib/brands";

export function BrandsCatalog() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {BRANDS.map((b) => (
        <article
          key={b.slug}
          className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
        >
          <div className="md:w-2/5 aspect-square md:aspect-auto overflow-hidden bg-background relative shrink-0">
            <img
              src={b.img}
              alt={`Volantes personalizados para ${b.name}`}
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>

          <div className="flex-1 p-6 md:p-8 flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">{b.tagline}</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{b.name}</h3>

            <div className="flex-1 mb-6">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Modelos compatíveis</div>
              <div className="flex flex-wrap gap-1.5">
                {b.models.slice(0, 8).map((mo) => (
                  <span
                    key={mo.slug}
                    className="text-[11px] px-2 py-1 bg-background border border-border/60 text-muted-foreground"
                  >
                    {mo.name}
                  </span>
                ))}
                {b.models.length > 8 && (
                  <span className="text-[11px] px-2 py-1 bg-background border border-border/60 text-muted-foreground">
                    +{b.models.length - 8}
                  </span>
                )}
              </div>
            </div>

            <Button asChild className="bg-primary hover:bg-primary/90 rounded-none h-11 uppercase tracking-wider text-xs w-full">
              <Link to="/brand/$slug" params={{ slug: b.slug }}>
                Descobrir Gama <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
