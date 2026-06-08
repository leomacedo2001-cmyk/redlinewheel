import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Produtos — REDLINE Performance" },
      { name: "description", content: "Toda a coleção de volantes premium e acessórios automóveis REDLINE. Compatível com as principais marcas." },
      { property: "og:title", content: "Produtos — REDLINE Performance" },
      { property: "og:description", content: "Volantes personalizados, acessórios e peças premium para o teu automóvel." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="container-premium py-16 md:py-24">
      <header className="mb-12 border-b border-border/60 pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Catálogo</div>
        <h1 className="text-5xl md:text-6xl font-bold">Todos os Produtos</h1>
        <p className="text-muted-foreground mt-4 max-w-xl">A coleção completa de volantes premium e acessórios para o teu automóvel.</p>
      </header>
      <ProductGrid first={50} />
    </div>
  );
}
