import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ACCESSORIES } from "@/lib/accessories";

const SITE_URL = "https://redlinewheel.lovable.app";

export const Route = createFileRoute("/acessorios/")({
  head: () => ({
    meta: [
      { title: "Acessórios — REDLINE Performance" },
      {
        name: "description",
        content: "Patilhas de mudança e acessórios premium REDLINE para completar o teu volante personalizado.",
      },
      { property: "og:title", content: "Acessórios — REDLINE Performance" },
      { property: "og:url", content: `${SITE_URL}/acessorios` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/acessorios` }],
  }),
  component: AcessoriosPage,
});

function AcessoriosPage() {
  return (
    <div className="container-premium py-16 md:py-24">
      <header className="mb-12 border-b border-border/60 pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Acessórios</div>
        <h1 className="text-5xl md:text-6xl font-bold">Completa o teu volante.</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Patilhas de mudança e outros acessórios de assinatura REDLINE, com encaixe universal sobre a patilha
          OEM — sem furar nem modificar o volante original.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACCESSORIES.map((a) => {
          const price = a.price
            ? `${a.price.currency === "EUR" ? "€" : a.price.currency + " "}${a.price.amount.toFixed(0)}`
            : null;
          return (
            <Link
              key={a.slug}
              to="/acessorios/$slug"
              params={{ slug: a.slug }}
              className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-background relative">
                <img
                  src={a.img}
                  alt={a.name}
                  loading="lazy"
                  decoding="async"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                  {a.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">{a.description}</p>
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
  );
}
