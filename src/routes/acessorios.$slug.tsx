import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, ShoppingCart, Zap, Truck, ShieldCheck, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { getAccessory, ACCESSORIES, type AccessorySpec } from "@/lib/accessories";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ShareButton } from "@/components/product/ShareButton";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { ReviewsEmpty } from "@/components/product/ReviewsEmpty";

const SITE_URL = "https://redlinewheel.lovable.app";

export const Route = createFileRoute("/acessorios/$slug")({
  loader: ({ params }) => {
    const accessory = getAccessory(params.slug);
    if (!accessory) throw notFound();
    return accessory;
  },
  head: ({ params, loaderData }) => {
    const a = loaderData;
    const url = `${SITE_URL}/acessorios/${params.slug}`;
    const title = a ? `${a.name} — REDLINE Performance` : "Acessório — REDLINE";
    const desc = a?.description ?? "Acessório premium REDLINE Performance.";
    const jsonLd = a
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: a.name,
          description: a.longDescription ?? a.description,
          image: a.img ? [a.img] : undefined,
          sku: a.sku,
          brand: { "@type": "Brand", name: "REDLINE Performance" },
          offers: a.price
            ? {
                "@type": "Offer",
                priceCurrency: a.price.currency,
                price: a.price.amount,
                availability: a.status === "Disponível" ? "https://schema.org/InStock" : "https://schema.org/BackOrder",
                url,
              }
            : undefined,
        }
      : null;

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(a?.img ? [{ property: "og:image", content: a.img }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: jsonLd ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] : [],
    };
  },
  notFoundComponent: () => (
    <div className="container-premium py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Acessório não encontrado</h1>
      <Button asChild className="rounded-none">
        <Link to="/acessorios">Ver todos os acessórios</Link>
      </Button>
    </div>
  ),
  component: AccessoryPage,
});

function AccessoryPage() {
  const accessory = Route.useLoaderData();
  const heroRef = useRef<HTMLDivElement>(null);

  const productQuery = useQuery({
    queryKey: ["shopify-product", accessory.shopifyHandle],
    queryFn: () => fetchProductByHandle(accessory.shopifyHandle),
    staleTime: 60_000,
  });

  const shopifyProduct = productQuery.data ?? null;
  const variants = shopifyProduct?.node.variants.edges.map((e) => e.node) ?? [];
  const shopifyImages = shopifyProduct?.node.images.edges.map((e) => e.node) ?? [];

  const [variantId, setVariantId] = useState<string | null>(null);
  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === variantId) ?? variants[0] ?? null,
    [variants, variantId]
  );

  const gallery =
    shopifyImages.length > 0
      ? shopifyImages.map((i) => i.url)
      : accessory.gallery && accessory.gallery.length > 0
        ? accessory.gallery
        : [accessory.img];
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const isCartLoading = useCartStore((s) => s.isLoading);

  const priceDisplay = selectedVariant
    ? `${selectedVariant.price.currencyCode} ${parseFloat(selectedVariant.price.amount).toFixed(2)}`
    : accessory.price
      ? `${accessory.price.currency} ${accessory.price.amount.toFixed(2)}`
      : null;

  const handleAddToCart = async () => {
    if (!shopifyProduct || !selectedVariant) {
      toast.error("Produto indisponível", { description: "Este acessório ainda não está publicado na loja." });
      return;
    }
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: selectedVariant.selectedOptions ?? [],
    });
    toast.success("Adicionado ao carrinho", { description: `${accessory.name} × ${qty}` });
  };

  const handleBuyNow = async () => {
    if (!shopifyProduct || !selectedVariant) {
      toast.error("Produto indisponível", { description: "Este acessório ainda não está publicado na loja." });
      return;
    }
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: selectedVariant.selectedOptions ?? [],
    });
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  const productMissing = !productQuery.isLoading && !shopifyProduct;
  const variantUnavailable = !!selectedVariant && !selectedVariant.availableForSale;
  const canBuy = !!shopifyProduct && !!selectedVariant && selectedVariant.availableForSale;

  const others = ACCESSORIES.filter((a) => a.slug !== accessory.slug);

  return (
    <>
      <StickyBuyBar
        triggerRef={heroRef}
        title={accessory.name}
        price={priceDisplay}
        image={accessory.img}
        onAddToCart={canBuy ? handleAddToCart : () => window.location.assign("/contact")}
        onBuyNow={canBuy ? handleBuyNow : () => window.location.assign("/contact")}
        disabled={!canBuy}
        loading={isCartLoading}
      />

      <div className="container-premium py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Acessórios", to: "/acessorios" },
            { label: accessory.name },
          ]}
        />

        <Link
          to="/acessorios"
          className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Voltar a Acessórios
        </Link>

        <div ref={heroRef} className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <ProductGallery images={gallery} alt={accessory.name} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Acessórios REDLINE</div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">{shopifyProduct?.node.title ?? accessory.name}</h1>
              {accessory.sku && (
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-3">Ref. {accessory.sku}</div>
              )}
            </div>

            {priceDisplay && <div className="text-3xl font-bold">{priceDisplay}</div>}

            {productQuery.isLoading && (
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> A carregar disponibilidade...
              </div>
            )}

            {productMissing && (
              <div className="flex items-start gap-3 p-4 bg-surface border border-amber-500/30 text-sm">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="font-semibold">Produto sob consulta</div>
                  <div className="text-muted-foreground text-xs">
                    Este acessório ainda não está disponível para compra online. Contacta-nos para encomendar.
                  </div>
                </div>
              </div>
            )}

            {accessory.status && !productMissing && (
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-3 py-1.5 bg-surface border border-border/60">
                <span
                  className={`h-2 w-2 rounded-full ${
                    variantUnavailable ? "bg-red-500" : accessory.status === "Disponível" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {variantUnavailable ? "Esgotado" : accessory.status}
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed">
              {shopifyProduct?.node.description || accessory.longDescription || accessory.description}
            </p>

            {variants.length > 1 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Variante</div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const isActive = (selectedVariant?.id ?? variants[0]?.id) === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVariantId(v.id)}
                        disabled={!v.availableForSale}
                        className={`text-xs px-3 py-2 border transition-colors ${
                          isActive
                            ? "border-primary text-primary bg-primary/5"
                            : "border-border/60 text-muted-foreground hover:border-primary/50"
                        } ${!v.availableForSale ? "line-through opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {v.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Compatibilidade</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{accessory.fitment}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Quantidade</div>
              <div className="flex items-center border border-border/60">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 flex items-center justify-center hover:bg-surface" aria-label="Diminuir">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-10 w-10 flex items-center justify-center hover:bg-surface" aria-label="Aumentar">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {canBuy ? (
                  <>
                    <Button
                      onClick={handleAddToCart}
                      disabled={isCartLoading}
                      variant="outline"
                      className="rounded-none h-12 uppercase tracking-wider text-xs border-border/60 hover:border-primary hover:text-primary"
                    >
                      {isCartLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                      Adicionar ao Carrinho
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      disabled={isCartLoading}
                      className="rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90"
                    >
                      {isCartLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                      Comprar Agora
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    className="rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90 sm:col-span-2"
                  >
                    <Link to="/contact">Pedir Orçamento</Link>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ShareButton title={`${accessory.name} — REDLINE Performance`} text={accessory.description} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60">
              <div className="flex items-start gap-2 text-xs">
                <Truck className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold">Envio Europa</div>
                  <div className="text-muted-foreground">2–5 dias úteis</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold">Garantia 2 anos</div>
                  <div className="text-muted-foreground">Em todo o produto</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CreditCard className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold">Pagamento Seguro</div>
                  <div className="text-muted-foreground">Cartão · MB Way · Transferência</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {accessory.specs && accessory.specs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mt-16 md:mt-24"
          >
            <header className="mb-6 border-b border-border/60 pb-4">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Detalhes</div>
              <h2 className="text-2xl md:text-3xl font-bold">Especificações Técnicas</h2>
            </header>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {accessory.specs.map((s: AccessorySpec) => (
                <div key={s.label} className="flex justify-between py-3 border-b border-border/40 text-sm">
                  <dt className="text-muted-foreground uppercase tracking-wider text-xs">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </motion.section>
        )}

        {others.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <header className="mb-6 border-b border-border/60 pb-4">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Também podes gostar</div>
              <h2 className="text-2xl md:text-3xl font-bold">Outros Acessórios</h2>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((a) => (
                <Link
                  key={a.slug}
                  to="/acessorios/$slug"
                  params={{ slug: a.slug }}
                  className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-square overflow-hidden bg-background">
                    <img
                      src={a.img}
                      alt={a.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{a.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        <ReviewsEmpty productLabel="acessório" />
      </div>
    </>
  );
}
