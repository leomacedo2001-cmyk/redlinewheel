import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, ShoppingCart, Zap, Truck, ShieldCheck, CreditCard, Check } from "lucide-react";
import { getBrandModel } from "@/lib/brands";

export const Route = createFileRoute("/brand/$slug/model/$model")({
  loader: ({ params }) => {
    const data = getBrandModel(params.slug, params.model);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const b = loaderData?.brand;
    const mo = loaderData?.model;
    const title = mo && b ? `${b.name} ${mo.name} — Volante REDLINE Performance` : "Volante — REDLINE";
    const desc = mo?.description ?? "Volante premium personalizado.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(mo ? [{ property: "og:image", content: mo.img }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-premium py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Modelo não encontrado</h1>
      <Button asChild className="rounded-none">
        <Link to="/products">Ver todas as marcas</Link>
      </Button>
    </div>
  ),
  component: ModelPage,
});

function ModelPage() {
  const { brand, model } = Route.useLoaderData();
  const gallery = model.gallery && model.gallery.length > 0 ? model.gallery : [model.img];
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  return (
    <div className="container-premium py-10 md:py-16">
      <Link
        to="/brand/$slug"
        params={{ slug: brand.slug }}
        className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Voltar a {brand.name}
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-surface overflow-hidden mb-3">
            <img src={gallery[activeImg]} alt={`${brand.name} ${model.name}`} className="w-full h-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square bg-surface overflow-hidden border-2 transition-colors ${
                    i === activeImg ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
              {brand.name} {model.chassis ? `· ${model.chassis}` : ""}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{model.name}</h1>
            {model.sku && (
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-3">Ref. {model.sku}</div>
            )}
          </div>

          {model.price && (
            <div className="text-3xl font-bold">
              {model.price.currency} {model.price.amount.toFixed(2)}
            </div>
          )}

          {model.status && (
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-3 py-1.5 bg-surface border border-border/60">
              <span className={`h-2 w-2 rounded-full ${model.status === "Disponível" ? "bg-emerald-500" : "bg-amber-500"}`} />
              {model.status}
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed">{model.longDescription ?? model.description}</p>

          {/* Compatibilities */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Compatibilidades</div>
            <div className="flex flex-wrap gap-1.5">
              {model.compatibilities.map((c) => (
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
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 flex items-center justify-center hover:bg-surface">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-10 w-10 flex items-center justify-center hover:bg-surface">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button asChild variant="outline" className="rounded-none h-12 uppercase tracking-wider text-xs border-border/60 hover:border-primary hover:text-primary">
              <Link to="/contact">
                <ShoppingCart className="h-4 w-4 mr-2" /> Adicionar ao Carrinho
              </Link>
            </Button>
            <Button asChild className="rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90">
              <Link to="/contact">
                <Zap className="h-4 w-4 mr-2" /> Comprar Agora
              </Link>
            </Button>
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
        </div>
      </div>

      {/* Specs */}
      {model.specs && model.specs.length > 0 && (
        <section className="mt-16 md:mt-24">
          <header className="mb-6 border-b border-border/60 pb-4">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Detalhes</div>
            <h2 className="text-2xl md:text-3xl font-bold">Especificações Técnicas</h2>
          </header>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {model.specs.map((s) => (
              <div key={s.label} className="flex justify-between py-3 border-b border-border/40 text-sm">
                <dt className="text-muted-foreground uppercase tracking-wider text-xs">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* What's included */}
      <section className="mt-12">
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
      </section>
    </div>
  );
}
