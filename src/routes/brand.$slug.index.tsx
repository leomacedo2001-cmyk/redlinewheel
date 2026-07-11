import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBrand, BRANDS, type BrandModel } from "@/lib/brands";

export const Route = createFileRoute("/brand/$slug/")({
  loader: ({ params }) => {
    const brand = getBrand(params.slug);
    if (!brand) throw notFound();
    return { brand };
  },
  head: ({ loaderData }) => {
    const b = loaderData?.brand;
    const title = b ? `${b.name} — Volantes Personalizados | REDLINE Performance` : "Marca — REDLINE Performance";
    const desc = b?.description ?? "Volantes personalizados premium.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(b ? [{ property: "og:image", content: b.img }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-premium py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Marca não encontrada</h1>
      <Button asChild className="rounded-none">
        <Link to="/products">Ver todas as marcas</Link>
      </Button>
    </div>
  ),
  component: BrandPage,
});

function BrandPage() {
  const { brand } = Route.useLoaderData();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden bg-surface">
        <img
          src={brand.img}
          alt={`${brand.name} — REDLINE Performance`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="container-premium relative h-full flex flex-col justify-end pb-12">
          <Link
            to="/products"
            className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-6 w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Voltar a Marcas
          </Link>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{brand.tagline}</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{brand.name}</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">{brand.description}</p>
        </div>
      </section>

      {/* Models grid */}
      <section className="container-premium py-16 md:py-24">
        <header className="mb-10 flex items-end justify-between gap-6 border-b border-border/60 pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Catálogo</div>
            <h2 className="text-3xl md:text-4xl font-bold">Modelos {brand.name}</h2>
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground hidden md:block">
            {brand.models.length} modelos
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brand.models.map((mo: BrandModel) => (
            <article
              key={mo.slug}
              className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <Link
                to="/brand/$slug/model/$model"
                params={{ slug: brand.slug, model: mo.slug }}
                className="aspect-[4/3] overflow-hidden bg-background block"
              >
                <img
                  src={mo.img}
                  alt={`${brand.name} ${mo.name}`}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </Link>
              <div className="p-5 flex-1 flex flex-col">
                {mo.chassis && (
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">{mo.chassis}</div>
                )}
                <h3 className="text-lg font-bold mb-1">{mo.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{mo.description}</p>
                {mo.price && (
                  <div className="text-base font-semibold mb-3">
                    {mo.price.currency} {mo.price.amount.toFixed(2)}
                  </div>
                )}
                <Button
                  asChild
                  className="rounded-none h-10 uppercase tracking-wider text-[11px] w-full bg-primary hover:bg-primary/90"
                >
                  <Link to="/brand/$slug/model/$model" params={{ slug: brand.slug, model: mo.slug }}>
                    Comprar <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Other brands */}
      <section className="container-premium pb-20">
        <div className="border-t border-border/60 pt-10">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Outras Marcas</div>
          <div className="flex flex-wrap gap-2">
            {BRANDS.filter((b) => b.slug !== brand.slug).map((b) => (
              <Link
                key={b.slug}
                to="/brand/$slug"
                params={{ slug: b.slug }}
                className="text-xs px-3 py-2 bg-surface border border-border/60 hover:border-primary hover:text-primary transition-colors uppercase tracking-wider"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
