import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.node.handle }}
      className="group block bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-background relative">
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.node.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Sem imagem</div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-background/80 backdrop-blur p-2 rounded-full">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight line-clamp-1">{product.node.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{product.node.description}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Desde</div>
            <div className="text-lg font-bold">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isLoading || !variant?.availableForSale}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
