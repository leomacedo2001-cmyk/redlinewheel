import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
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

type SortKey = "featured" | "name-asc" | "price-asc" | "price-desc";

function BrandPage() {
  const { brand } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [chassisFilter, setChassisFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const chassisOptions = useMemo(() => {
    const set = new Set<string>();
    brand.models.forEach((m: BrandModel) => m.chassis && set.add(m.chassis));
    return Array.from(set);
  }, [brand.models]);

  const filtered = useMemo(() => {
    let list = brand.models.filter((m: BrandModel) => {
      const q = query.trim().toLowerCase();
      if (q && !`${m.name} ${m.chassis ?? ""} ${m.description}`.toLowerCase().includes(q)) return false;
      if (chassisFilter !== "all" && m.chassis !== chassisFilter) return false;
      return true;
    });
    if (sort === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.price?.amount ?? Infinity) - (b.price?.amount ?? Infinity));
    if (sort === "price-desc") list = [...list].sort((a, b) => (b.price?.amount ?? -Infinity) - (a.price?.amount ?? -Infinity));
    return list;
  }, [brand.models, query, chassisFilter, sort]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden bg-surface">
        <img
          src={brand.img}
          alt={`${brand.name} — REDLINE Performance`}
          loading="eager"
          fetchPriority="high"
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
        <header className="mb-8 flex flex-col gap-6 border-b border-border/60 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Catálogo</div>
            <h2 className="text-3xl md:text-4xl font-bold">Modelos {brand.name}</h2>
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {filtered.length} de {brand.models.length} modelos
          </div>
        </header>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar modelo ou chassis…"
              aria-label="Pesquisar modelos"
              className="w-full h-11 pl-10 pr-3 bg-surface border border-border/60 focus:border-primary outline-none text-sm"
            />
          </div>
          {chassisOptions.length > 0 && (
            <select
              value={chassisFilter}
              onChange={(e) => setChassisFilter(e.target.value)}
              aria-label="Filtrar por chassis"
              className="h-11 px-3 bg-surface border border-border/60 focus:border-primary outline-none text-sm uppercase tracking-wider"
            >
              <option value="all">Todos os chassis</option>
              {chassisOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Ordenar modelos"
            className="h-11 px-3 bg-surface border border-border/60 focus:border-primary outline-none text-sm uppercase tracking-wider"
          >
            <option value="featured">Ordenação: Destaque</option>
            <option value="name-asc">Nome (A–Z)</option>
            <option value="price-asc">Preço (menor primeiro)</option>
            <option value="price-desc">Preço (maior primeiro)</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-border/60 bg-surface/30">
            <p className="text-muted-foreground">Nenhum modelo encontrado com os filtros atuais.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mo: BrandModel) => (
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
                  loading="lazy"
                  width={800}
                  height={600}
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
        )}
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
