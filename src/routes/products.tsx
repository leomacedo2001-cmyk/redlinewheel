import { createFileRoute } from "@tanstack/react-router";
import { BrandsCatalog } from "@/components/BrandsCatalog";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Produtos — REDLINE Performance" },
      { name: "description", content: "Volantes personalizados premium compatíveis com BMW, Mercedes-AMG, Audi RS, Porsche, Tesla, VW e Toyota. Pede o teu orçamento." },
      { property: "og:title", content: "Produtos — REDLINE Performance" },
      { property: "og:description", content: "Catálogo organizado por marca automóvel. Volantes personalizados, acabamentos premium e componentes de interior." },
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
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Catálogo por Marca</div>
        <h1 className="text-5xl md:text-6xl font-bold">Encontra o teu carro.</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Personalizamos volantes e interiores para as principais marcas premium e de performance do mercado.
          Escolhe a tua marca e pede um orçamento sem compromisso.
        </p>
      </header>
      <BrandsCatalog />
    </div>
  );
}
