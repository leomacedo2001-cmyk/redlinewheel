import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { BRANDS, type Brand, type BrandModel } from "@/lib/brands";
import {
  attr,
  FORMAT_LABELS,
  MATERIAL_LABELS,
  STITCH_LABELS,
  FEATURE_LABELS,
  type Format,
  type Material,
  type Stitch,
  type Feature,
} from "@/lib/attributes";
import { Slider } from "@/components/ui/slider";

type ProductsSearch = {
  q?: string;
  marca?: string;
};

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    marca: typeof search.marca === "string" && search.marca ? search.marca : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Produtos — REDLINE Performance" },
      {
        name: "description",
        content:
          "Todo o catálogo REDLINE num só lugar: pesquisa instantânea e filtros por marca, formato, material, costura, LED e disponibilidade.",
      },
      { property: "og:title", content: "Produtos — REDLINE Performance" },
      {
        property: "og:description",
        content: "Explora todos os volantes personalizados REDLINE, com pesquisa e filtros avançados.",
      },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

type Entry = { brand: Brand; model: BrandModel };

const NAV_BRANDS = BRANDS.filter((b) => b.slug !== "outras-marcas");

function formatPrice(amount: number, currency: string) {
  return `${currency === "EUR" ? "€" : `${currency} `}${amount.toFixed(0)}`;
}

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [query, setQuery] = useState(search.q ?? "");
  const [marca, setMarca] = useState(search.marca ?? "");
  const [formato, setFormato] = useState<Format | "">("");
  const [material, setMaterial] = useState<Material | "">("");
  const [costura, setCostura] = useState<Stitch | "">("");
  const [feature, setFeature] = useState<Feature | "">("");
  const [disponivelOnly, setDisponivelOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allEntries = useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    for (const brand of NAV_BRANDS) {
      for (const model of brand.models) {
        if (!attr.hasAny(model.attributes)) continue;
        out.push({ brand, model });
      }
    }
    return out;
  }, []);

  const priceBounds = useMemo(() => {
    const prices = allEntries.map((e) => e.model.price?.amount).filter((p): p is number => typeof p === "number");
    if (!prices.length) return { min: 0, max: 0 };
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [allEntries]);

  const [priceRange, setPriceRange] = useState<[number, number]>([priceBounds.min, priceBounds.max]);
  const priceTouched = priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max;

  function syncUrl(nextQuery: string, nextMarca: string) {
    navigate({
      to: "/products",
      search: { q: nextQuery || undefined, marca: nextMarca || undefined },
      replace: true,
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter(({ brand, model }) => {
      if (q) {
        const haystack = `${brand.name} ${model.name} ${model.chassis ?? ""} ${model.description} ${model.compatibilities.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (marca && brand.slug !== marca) return false;
      if (formato && !attr.isFormat(model.attributes, formato)) return false;
      if (material && !attr.hasMaterial(model.attributes, material)) return false;
      if (costura && !attr.hasStitch(model.attributes, costura)) return false;
      if (feature && !attr.hasFeature(model.attributes, feature)) return false;
      if (disponivelOnly && model.status !== "Disponível") return false;
      if (model.price && (model.price.amount < priceRange[0] || model.price.amount > priceRange[1])) return false;
      return true;
    });
  }, [allEntries, query, marca, formato, material, costura, feature, disponivelOnly, priceRange]);

  const activeFilterCount = [marca, formato, material, costura, feature, disponivelOnly ? "1" : "", priceTouched ? "1" : ""].filter(Boolean).length;

  function clearFilters() {
    setQuery("");
    setMarca("");
    setFormato("");
    setMaterial("");
    setCostura("");
    setFeature("");
    setDisponivelOnly(false);
    setPriceRange([priceBounds.min, priceBounds.max]);
    syncUrl("", "");
  }

  return (
    <div className="container-premium py-16 md:py-24">
      <header className="mb-10 border-b border-border/60 pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Catálogo Completo</div>
        <h1 className="text-5xl md:text-6xl font-bold">Todos os Volantes.</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Pesquisa e filtra o catálogo inteiro da REDLINE num só lugar — sem teres de saber a marca primeiro.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              syncUrl(e.target.value, marca);
            }}
            placeholder="Pesquisar por marca, modelo, chassis…"
            aria-label="Pesquisar produtos"
            className="h-12 w-full border border-border/60 bg-surface pl-10 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex h-12 items-center justify-center gap-2 border border-border/60 bg-surface px-5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:w-auto"
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[260px_1fr]">
        <aside className={`${filtersOpen ? "block" : "hidden"} md:block`}>
          <div className="sticky top-24 space-y-6 border border-border/60 bg-surface/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Filtros</span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-primary hover:underline"
                >
                  <X className="h-3 w-3" /> Limpar
                </button>
              )}
            </div>

            <FilterSelect
              label="Marca"
              value={marca}
              onChange={(v) => {
                setMarca(v);
                syncUrl(query, v);
              }}
              options={NAV_BRANDS.map((b) => ({ value: b.slug, label: b.name }))}
            />
            <FilterSelect
              label="Formato"
              value={formato}
              onChange={(v) => setFormato(v as Format | "")}
              options={Object.entries(FORMAT_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <FilterSelect
              label="Material"
              value={material}
              onChange={(v) => setMaterial(v as Material | "")}
              options={Object.entries(MATERIAL_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <FilterSelect
              label="Cor da Costura"
              value={costura}
              onChange={(v) => setCostura(v as Stitch | "")}
              options={Object.entries(STITCH_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <FilterSelect
              label="Características"
              value={feature}
              onChange={(v) => setFeature(v as Feature | "")}
              options={Object.entries(FEATURE_LABELS).map(([value, label]) => ({ value, label }))}
            />

            {priceBounds.max > priceBounds.min && (
              <div>
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>Preço</span>
                  <span className="text-foreground">
                    {formatPrice(priceRange[0], "EUR")} – {formatPrice(priceRange[1], "EUR")}
                  </span>
                </div>
                <Slider
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={10}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                />
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={disponivelOnly}
                onChange={(e) => setDisponivelOnly(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Só disponíveis agora
            </label>
          </div>
        </aside>

        <div>
          <div className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">
            {filtered.length} de {allEntries.length} produtos
          </div>

          {filtered.length === 0 ? (
            <div className="border border-border/60 bg-surface/30 py-16 text-center">
              <p className="text-muted-foreground">Nenhum produto encontrado com os filtros atuais.</p>
              <button type="button" onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(({ brand, model }) => (
                <Link
                  key={`${brand.slug}-${model.slug}`}
                  to="/brand/$slug/model/$model"
                  params={{ slug: brand.slug, model: model.slug }}
                  className="group flex flex-col border border-border/60 bg-background transition-all duration-300 hover:border-primary/50"
                >
                  <div className="relative aspect-square overflow-hidden bg-surface">
                    <img
                      src={model.img}
                      alt={model.name}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={800}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 border border-primary/40 bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur">
                      {brand.name}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-base font-bold leading-tight transition-colors group-hover:text-primary">
                      {model.name}
                    </h3>
                    <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {model.description}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      {model.price && (
                        <span className="text-sm font-bold">Desde {formatPrice(model.price.amount, model.price.currency)}</span>
                      )}
                      <span className="ml-auto inline-flex items-center text-[11px] font-medium uppercase tracking-wider text-primary transition-transform group-hover:translate-x-1">
                        Ver <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full border border-border/60 bg-surface px-3 text-sm outline-none focus:border-primary"
      >
        <option value="">Todos</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
