import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  CreditCard,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getBrand, getBrandModel, resolveShopifyHandle, type BrandModelSpec } from "@/lib/brands";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { ShareButton } from "@/components/product/ShareButton";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ReviewsEmpty } from "@/components/product/ReviewsEmpty";

const SITE_URL = "https://redlinewheel.lovable.app";

export const Route = createFileRoute("/brand/$slug/model/$model")({
  loader: ({ params }) => {
    const data = getBrandModel(params.slug, params.model);
    if (!data) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const b = loaderData?.brand;
    const mo = loaderData?.model;
    const url = `${SITE_URL}/brand/${params.slug}/model/${params.model}`;
    const title = mo && b ? `${b.name} ${mo.name} — Volante REDLINE Performance` : "Volante — REDLINE";
    const desc = mo?.description ?? "Volante premium personalizado.";
    const image = mo?.img;
    const jsonLd = mo && b
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${b.name} ${mo.name}`,
          description: mo.longDescription ?? mo.description,
          image: image ? [image] : undefined,
          sku: mo.sku,
          brand: { "@type": "Brand", name: b.name },
          offers: mo.price
            ? {
                "@type": "Offer",
                priceCurrency: mo.price.currency,
                price: mo.price.amount,
                availability:
                  mo.status === "Disponível"
                    ? "https://schema.org/InStock"
                    : mo.status === "Em Breve"
                      ? "https://schema.org/PreOrder"
                      : "https://schema.org/BackOrder",
                url,
              }
            : undefined,
        }
      : null;
    const breadcrumbLd = b && mo
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Produtos", item: `${SITE_URL}/products` },
            { "@type": "ListItem", position: 3, name: b.name, item: `${SITE_URL}/brand/${b.slug}` },
            { "@type": "ListItem", position: 4, name: mo.name, item: url },
          ],
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
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        ...(jsonLd ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] : []),
        ...(breadcrumbLd ? [{ type: "application/ld+json", children: JSON.stringify(breadcrumbLd) }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-premium py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Modelo não encontrado</h1>
      <Button asChild className="rounded-none">
        <Link to="/marcas">Ver todas as marcas</Link>
      </Button>
    </div>
  ),
  component: ModelPage,
});

function ModelPage() {
  const { brand, model } = Route.useLoaderData();
  const shopifyHandle = resolveShopifyHandle(brand.slug, model);
  const heroRef = useRef<HTMLDivElement>(null);

  const productQuery = useQuery({
    queryKey: ["shopify-product", shopifyHandle],
    queryFn: () => fetchProductByHandle(shopifyHandle),
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
      : model.gallery && model.gallery.length > 0
        ? model.gallery
        : [model.img];
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const isCartLoading = useCartStore((s) => s.isLoading);

  const priceDisplay = selectedVariant
    ? `${selectedVariant.price.currencyCode} ${parseFloat(selectedVariant.price.amount).toFixed(2)}`
    : model.price
      ? `${model.price.currency} ${model.price.amount.toFixed(2)}`
      : null;

  const handleAddToCart = async () => {
    if (!shopifyProduct || !selectedVariant) {
      toast.error("Produto indisponível", { description: "Este volante ainda não está publicado na loja." });
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
    toast.success("Adicionado ao carrinho", { description: `${brand.name} ${model.name} × ${qty}` });
  };

  const handleBuyNow = async () => {
    if (!shopifyProduct || !selectedVariant) {
      toast.error("Produto indisponível", { description: "Este volante ainda não está publicado na loja." });
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

  const brandFull = getBrand(brand.slug);
  const favoriteItem = {
    brandSlug: brand.slug,
    modelSlug: model.slug,
    name: model.name,
    brandName: brand.name,
    img: model.img,
    price: model.price,
  };

  return (
    <>
      <StickyBuyBar
        triggerRef={heroRef}
        title={`${brand.name} ${model.name}`}
        subtitle={model.chassis}
        price={priceDisplay}
        image={model.img}
        onAddToCart={canBuy ? handleAddToCart : () => window.location.assign("/contact")}
        onBuyNow={canBuy ? handleBuyNow : () => window.location.assign("/contact")}
        disabled={!canBuy}
        loading={isCartLoading}
      />

      <div className="container-premium py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Marcas", to: "/marcas" },
            { label: brand.name, to: "/brand/$slug", params: { slug: brand.slug } },
            { label: model.name },
          ]}
        />

        <Link
          to="/brand/$slug"
          params={{ slug: brand.slug }}
          className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Voltar a {brand.name}
        </Link>

        <div ref={heroRef} className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <ProductGallery images={gallery} alt={`${brand.name} ${model.name}`} />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                {brand.name} {model.chassis ? `· ${model.chassis}` : ""}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">{shopifyProduct?.node.title ?? model.name}</h1>
              {model.sku && (
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-3">Ref. {model.sku}</div>
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
                    Este modelo ainda não está disponível para compra online. Contacta-nos para encomendar.
                  </div>
                </div>
              </div>
            )}

            {model.status && !productMissing && (
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-3 py-1.5 bg-surface border border-border/60">
                <span
                  className={`h-2 w-2 rounded-full ${
                    variantUnavailable ? "bg-red-500" : model.status === "Disponível" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {variantUnavailable ? "Esgotado" : model.status}
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed">
              {shopifyProduct?.node.description || model.longDescription || model.description}
            </p>

            {/* Variant selector */}
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

            {/* Compatibilities */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Compatibilidades</div>
              <div className="flex flex-wrap gap-1.5">
                {model.compatibilities.map((c: string) => (
                  <span key={c} className="text-[11px] px-2 py-1 bg-surface border border-border/60 text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity */}
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

            {/* Actions */}
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
                <FavoriteButton item={favoriteItem} />
                <ShareButton title={`${brand.name} ${model.name} — REDLINE Performance`} text={model.description} />
              </div>
            </div>

            {/* Trust badges */}
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

        {/* Specs */}
        {model.specs && model.specs.length > 0 && (
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
              {model.specs.map((s: BrandModelSpec) => (
                <div key={s.label} className="flex justify-between py-3 border-b border-border/40 text-sm">
                  <dt className="text-muted-foreground uppercase tracking-wider text-xs">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </motion.section>
        )}

        {/* What's included */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <header className="mb-4">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Incluído</div>
            <h2 className="text-2xl md:text-3xl font-bold">O que recebes</h2>
          </header>
          <ul className="space-y-2 text-sm">
            {[
              "Volante personalizado conforme configuração",
              "Reutilização do airbag original (quando aplicável)",
              "Instruções de montagem",
              "Garantia oficial REDLINE Performance (2 anos)",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Related */}
        {brandFull && <RelatedProducts brand={brandFull} currentSlug={model.slug} />}

        {/* Reviews (empty state) */}
        <ReviewsEmpty />
      </div>
    </>
  );
}
