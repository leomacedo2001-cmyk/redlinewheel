import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — APEX Automotive` },
      { name: "description", content: "Volante premium personalizado APEX Automotive." },
      { property: "og:url", content: `/product/${params.handle}` },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: `/product/${params.handle}` }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const p = await fetchProductByHandle(handle);
      if (!p) throw notFound();
      return p;
    },
  });

  if (loadingProduct) {
    return (
      <div className="container-premium py-32 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!product) return null;

  const images = product.node.images.edges;
  const variant = product.node.variants.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAdd = async () => {
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
    <div className="container-premium py-12 md:py-16">
      <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar aos produtos
      </Link>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-surface overflow-hidden mb-4">
            {images[activeImage] ? (
              <img src={images[activeImage].node.url} alt={images[activeImage].node.altText ?? product.node.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-surface overflow-hidden border-2 transition-colors ${i === activeImage ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">APEX Collection</div>
            <h1 className="text-4xl md:text-5xl font-bold">{product.node.title}</h1>
          </div>
          <div className="text-3xl font-bold">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </div>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.node.description}</p>

          <div className="space-y-3 py-6 border-y border-border/60">
            {[
              "Materiais premium (alcantara, carbono, couro nappa)",
              "Construção artesanal",
              "Garantia 2 anos",
              "Entrega para toda a Europa",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleAdd}
            disabled={isLoading || !variant?.availableForSale}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 rounded-none h-14 uppercase tracking-wider text-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingCart className="w-4 h-4 mr-2" />Adicionar ao Carrinho</>}
          </Button>
          {!variant?.availableForSale && (
            <p className="text-sm text-muted-foreground text-center">Esgotado</p>
          )}
        </div>
      </div>
    </div>
  );
}
