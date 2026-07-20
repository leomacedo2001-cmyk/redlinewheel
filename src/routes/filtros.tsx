import { createFileRoute } from "@tanstack/react-router";
import {
  collectionsByGroup,
  getProductsForCollection,
  GROUP_LABELS,
  type CollectionGroup,
} from "@/lib/collections";

const SITE_URL = "https://redlinewheel.lovable.app";

export const Route = createFileRoute("/filtros")({
  head: () => ({
    meta: [
      { title: "Filtros — Explora por Atributo | REDLINE Performance" },
      {
        name: "description",
        content:
          "Explora o catálogo REDLINE por marca, formato, material, cor de costura e funcionalidades. Cada volante aparece automaticamente em todos os filtros compatíveis.",
      },
      { property: "og:title", content: "Filtros — REDLINE Performance" },
      { property: "og:url", content: `${SITE_URL}/filtros` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/filtros` }],
  }),
  component: FiltersHub,
});

const GROUP_ORDER: CollectionGroup[] = [
  "marca",
  "formato",
  "material",
  "costura",
  "feature",
  "linha",
];

function FiltersHub() {
  const groups = collectionsByGroup();

  return (
    <div className="container-premium py-16 md:py-24">
      <header className="mb-12 border-b border-border/60 pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Navegação por Atributo</div>
        <h1 className="text-5xl md:text-6xl font-bold">Filtros</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          O catálogo classifica-se sozinho. Cada volante aparece automaticamente em
          todas as páginas compatíveis — marca, formato, material, cor de costura e
          funcionalidades — a partir da análise das suas imagens.
        </p>
      </header>

      <div className="space-y-12">
        {GROUP_ORDER.map((g) => {
          const cols = groups[g];
          if (!cols || cols.length === 0) return null;
          return (
            <section key={g}>
              <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{GROUP_LABELS[g]}</h2>
              <div className="flex flex-wrap gap-2.5">
                {cols.map((col) => {
                  const count = getProductsForCollection(col).length;
                  const href = col.curatedPath ?? `/c/${col.urlSlug}`;
                  return (
                    <a
                      key={col.key}
                      href={href}
                      className="group inline-flex items-center gap-2 bg-surface border border-border/60 hover:border-primary hover:text-primary transition-colors px-4 py-2.5 text-sm"
                    >
                      <span className="font-medium">{col.title}</span>
                      <span className="text-[11px] text-muted-foreground group-hover:text-primary tabular-nums">
                        {count}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
