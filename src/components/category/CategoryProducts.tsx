import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Brand, BrandModel } from "@/lib/brands";

type CategoryProductsProps = {
  title: string;
  products: { brand: Brand; model: BrandModel }[];
};

export function CategoryProducts({ title, products }: CategoryProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-border/60 bg-surface/40">
      <div className="container-premium py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Produtos relacionados
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Volantes com {title.toLowerCase()}</h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-none h-12 uppercase tracking-wider text-xs px-8 self-start"
          >
            <Link to="/products">
              Ver Catálogo Completo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(({ brand, model }) => {
            const price = model.price
              ? `${model.price.currency === "EUR" ? "€" : model.price.currency + " "}${model.price.amount.toFixed(0)}`
              : null;
            return (
              <Link
                key={`${brand.slug}-${model.slug}`}
                to="/brand/$slug/model/$model"
                params={{ slug: brand.slug, model: model.slug }}
                className="group bg-background border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-square overflow-hidden bg-surface relative">
                  <img
                    src={model.img}
                    alt={model.name}
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={1024}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary border border-primary/40">
                    {brand.name}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                    {model.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                    {model.description}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    {price && <span className="text-sm font-bold">Desde {price}</span>}
                    <span className="inline-flex items-center text-[11px] uppercase tracking-wider font-medium text-primary group-hover:translate-x-1 transition-transform ml-auto">
                      Ver <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
