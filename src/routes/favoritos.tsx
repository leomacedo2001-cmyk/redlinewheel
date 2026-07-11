import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — REDLINE Performance" },
      { name: "description", content: "Os teus volantes guardados para mais tarde." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Favoritos — REDLINE Performance" },
      { property: "og:url", content: "https://redlinewheel.lovable.app/favoritos" },
    ],
    links: [{ rel: "canonical", href: "https://redlinewheel.lovable.app/favoritos" }],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);
  const clear = useFavoritesStore((s) => s.clear);

  return (
    <div className="container-premium py-10 md:py-16">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Favoritos" }]} />

      <header className="mb-10 flex items-end justify-between gap-6 border-b border-border/60 pb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">A tua seleção</div>
          <h1 className="text-3xl md:text-4xl font-bold">Favoritos</h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            Limpar tudo
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border/60">
          <Heart className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Ainda sem favoritos</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Guarda os volantes que gostas para os encontrares facilmente depois.
          </p>
          <Button asChild className="rounded-none uppercase tracking-wider text-xs">
            <Link to="/products">Explorar Produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <article
              key={`${item.brandSlug}-${item.modelSlug}`}
              className="group bg-surface border border-border/60 hover:border-primary/50 transition-colors overflow-hidden flex flex-col"
            >
              <Link
                to="/brand/$slug/model/$model"
                params={{ slug: item.brandSlug, model: item.modelSlug }}
                className="aspect-[4/3] overflow-hidden bg-background block"
              >
                <img
                  src={item.img}
                  alt={`${item.brandName} ${item.name}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </Link>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">{item.brandName}</div>
                <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                {item.price && (
                  <div className="text-base font-semibold mb-4">
                    {item.price.currency} {item.price.amount.toFixed(2)}
                  </div>
                )}
                <div className="mt-auto flex gap-2">
                  <Button
                    asChild
                    className="flex-1 rounded-none h-10 uppercase tracking-wider text-[11px] bg-primary hover:bg-primary/90"
                  >
                    <Link
                      to="/brand/$slug/model/$model"
                      params={{ slug: item.brandSlug, model: item.modelSlug }}
                    >
                      Ver produto
                    </Link>
                  </Button>
                  <button
                    onClick={() => remove(item.brandSlug, item.modelSlug)}
                    aria-label="Remover"
                    className="h-10 w-10 flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
