import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BrandsCatalog } from "@/components/BrandsCatalog";
import { ACCESSORIES } from "@/lib/accessories";

export const Route = createFileRoute("/marcas")({
  head: () => ({
    meta: [
      { title: "Marcas — REDLINE Performance" },
      { name: "description", content: "Volantes personalizados premium compatíveis com BMW, Mercedes-AMG, Audi RS, Porsche, Tesla, VW e Toyota. Pede o teu orçamento." },
      { property: "og:title", content: "Marcas — REDLINE Performance" },
      { property: "og:description", content: "Catálogo organizado por marca automóvel. Volantes personalizados, acabamentos premium e componentes de interior." },
      { property: "og:url", content: "/marcas" },
    ],
    links: [{ rel: "canonical", href: "/marcas" }],
  }),
  component: MarcasPage,
});

function MarcasPage() {
  return (
    <div className="container-premium py-16 md:py-24">
      <header className="mb-12 border-b border-border/60 pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Catálogo por Marca</div>
        <h1 className="text-5xl md:text-6xl font-bold">Encontra o teu carro.</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Personalizamos volantes e interiores para as principais marcas premium e de performance do mercado.
          Escolhe a tua marca e pede um orçamento sem compromisso.
        </p>
      </header>
      <BrandsCatalog />

      <section className="mt-16 pt-8 border-t border-border/60">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Complementa o teu volante</div>
            <h2 className="text-2xl md:text-3xl font-bold">Acessórios</h2>
          </div>
          <Link
            to="/acessorios"
            className="inline-flex items-center text-xs uppercase tracking-wider font-medium text-primary hover:translate-x-1 transition-transform"
          >
            Ver todos <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ACCESSORIES.map((a) => (
            <Link
              key={a.slug}
              to="/acessorios/$slug"
              params={{ slug: a.slug }}
              className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex"
            >
              <div className="w-1/3 aspect-square overflow-hidden bg-background shrink-0">
                <img
                  src={a.img}
                  alt={a.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 p-5 flex flex-col justify-center">
                <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{a.name}</h3>
                <span className="inline-flex items-center text-[11px] uppercase tracking-wider font-medium text-primary mt-2">
                  Ver <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
