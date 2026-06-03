import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

export function ProductGrid({ first = 12 }: { first?: number }) {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", first],
    queryFn: () => fetchProducts(first),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border/60 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Sem produtos disponíveis</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Ainda não temos produtos na loja. Diz-me no chat que produto queres adicionar (nome e preço) e eu trato disso.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p.node.id} product={p} />
      ))}
    </div>
  );
}
