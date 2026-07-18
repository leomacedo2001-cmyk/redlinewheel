import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Wrench, Truck, Star } from "lucide-react";
import { FeaturedWheels } from "@/components/FeaturedWheels";

import heroImg from "@/assets/hero-steering.jpg";
import wheelImg from "@/assets/wheel-showcase.jpg";
import { CustomProductsSection } from "@/components/CustomProductsSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REDLINE Performance — Volantes Premium Personalizados" },
      { name: "description", content: "Transforma o interior do teu automóvel com volantes premium personalizados. Compatível com BMW, Audi, Porsche, Mercedes e mais." },
      { property: "og:title", content: "REDLINE Performance — Volantes Premium" },
      { property: "og:description", content: "Volantes desportivos personalizados para uma experiência de condução única." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

import { BRANDS } from "@/lib/brands";

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img src={heroImg} alt="Volante desportivo premium em carbono" width={1920} height={1080} loading="eager" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

        <div className="container-premium relative pb-24 pt-32 animate-fade-up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/40 bg-primary/10 text-xs uppercase tracking-[0.25em] text-primary mb-6">
              <span className="size-1.5 bg-primary rounded-full" /> Performance · Precisão · Paixão
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              Transforma o<br />
              <span className="text-gradient-red">interior</span> do teu<br />
              automóvel.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Volantes premium personalizados em alcantara, carbono e couro nappa. Construídos à mão para uma experiência de condução incomparável.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-none h-14 px-8 text-sm uppercase tracking-wider">
                <Link to="/products">Ver Produtos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none h-14 px-8 text-sm uppercase tracking-wider border-foreground/30">
                <Link to="/products">Explorar Coleção</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS MARQUEE */}
      <section className="border-y border-border/60 bg-surface/50 py-8">
        <div className="container-premium">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 text-center">Compatível com</div>
          <nav aria-label="Marcas disponíveis" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {BRANDS.map((b) => (
              <Link
                key={b.slug}
                to="/brand/$slug"
                params={{ slug: b.slug }}
                activeProps={{ className: "text-primary" }}
                className="text-sm font-medium text-muted-foreground/80 hover:text-primary focus:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-colors uppercase tracking-wider"
              >
                {b.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-premium py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Coleção</div>
            <h2 className="text-4xl md:text-5xl font-bold">Produtos em Destaque</h2>
          </div>
          <Link to="/products" className="hidden md:inline-flex items-center text-sm font-medium hover:text-primary transition-colors">
            Ver todos <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <FeaturedWheels />
      </section>

      <CustomProductsSection />

      {/* BENEFITS */}
      <section className="bg-surface py-24">
        <div className="container-premium">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">A Diferença REDLINE</div>
            <h2 className="text-4xl md:text-5xl font-bold">Construído para entusiastas.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-border">
            {[
              { icon: Wrench, t: "Personalização Total", d: "Escolhe materiais, cores e acabamentos. Cada volante é construído à medida do teu carro." },
              { icon: Shield, t: "Qualidade Premium", d: "Alcantara, fibra de carbono real e couro nappa italiano. Garantia de 2 anos em todos os produtos." },
              { icon: Truck, t: "Entrega Europeia", d: "Envio rápido para toda a Europa. Embalagem premium, instalação opcional." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="bg-surface p-10 hover:bg-surface-elevated transition-colors">
                <Icon className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE SPLIT */}
      <section className="container-premium py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Engenharia</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Cada detalhe<br />importa.</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Do design ao acabamento final, cada volante REDLINE é o resultado de centenas de horas de trabalho manual.
            Combinamos materiais premium com tecnologia de ponta para criar peças únicas que elevam qualquer interior.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-2 border-primary pl-4">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Volantes entregues</div>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <div className="text-3xl font-bold">2 anos</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Garantia premium</div>
            </div>
          </div>
        </div>
        <div className="relative aspect-square bg-surface overflow-hidden">
          <img src={wheelImg} alt="Volante personalizado" width={1024} height={1024} loading="lazy" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="container-premium py-24 text-center">
          <Star className="h-8 w-8 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Pronto para transformar o teu interior?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Explora a nossa coleção completa de volantes premium.</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-none h-14 px-10 uppercase tracking-wider text-sm">
            <Link to="/products">Comprar Agora <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
