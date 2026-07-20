import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  getGenericCollection,
  getProductsForCollection,
  collectionHero,
} from "@/lib/collections";
import { PROCESS_STEPS } from "@/lib/categoryPages";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryProducts } from "@/components/category/CategoryProducts";
import { CategoryTimeline } from "@/components/category/CategoryTimeline";
import { CategoryCTA } from "@/components/category/CategoryCTA";

const SITE_URL = "https://redlinewheel.lovable.app";

export const Route = createFileRoute("/c/$slug")({
  loader: ({ params }) => {
    const col = getGenericCollection(params.slug);
    if (!col) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const col = getGenericCollection(params.slug);
    const title = col ? `${col.title} — REDLINE Performance` : "Filtro — REDLINE Performance";
    const description = col?.metaDescription ?? "Personalização premium de volantes automóvel.";
    const url = `${SITE_URL}/c/${params.slug}`;
    const schema = col
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: col.title,
          description: col.metaDescription,
          url,
        }
      : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: schema
        ? [{ type: "application/ld+json", children: JSON.stringify(schema) }]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="container-premium py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Filtro não encontrado</h1>
      <Button asChild className="rounded-none">
        <Link to="/filtros">Ver todos os filtros</Link>
      </Button>
    </div>
  ),
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useLoaderData();
  const col = getGenericCollection(slug)!;
  const products = getProductsForCollection(col);
  const heroImg = collectionHero(col);

  return (
    <div>
      <CategoryHero title={col.title} tagline={col.subtitle} subtitle={col.intro} heroImg={heroImg} />

      <section className="container-premium py-12 md:py-16">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/filtros" className="hover:text-primary">
            Filtros
          </Link>
          <span>/</span>
          <span className="text-primary">{col.title}</span>
          <span className="ml-auto normal-case tracking-normal">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </span>
        </div>
      </section>

      {products.length > 0 ? (
        <CategoryProducts title={col.title} products={products} />
      ) : (
        <section className="container-premium pb-16">
          <div className="border border-border/60 bg-surface/30 py-16 text-center">
            <p className="text-muted-foreground">
              Ainda não há produtos publicados com este atributo. Fala connosco para
              uma peça à medida.
            </p>
            <Button asChild className="rounded-none mt-6">
              <Link to="/contact">Pedir orçamento</Link>
            </Button>
          </div>
        </section>
      )}

      <CategoryTimeline steps={PROCESS_STEPS} />
      <CategoryCTA />
    </div>
  );
}
