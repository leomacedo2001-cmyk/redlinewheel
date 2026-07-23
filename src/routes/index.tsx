import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Wrench, Truck, Star } from "lucide-react";
import { FeaturedProductsSection } from "@/components/FeaturedWheels";
import { BrandShowcase } from "@/components/BrandShowcase";

import heroImg from "@/assets/hero-steering.jpg";
import heroVideo from "@/assets/hero/hero-wheel-reveal.mp4";
import { CustomProductsSection } from "@/components/CustomProductsSection";
import { FeedbackShowcase } from "@/components/feedback/FeedbackShowcase";
import { TransformationShowcase } from "@/components/transformation/TransformationShowcase";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AmbientGlow } from "@/components/AmbientGlow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REDLINE Performance — Volantes Premium Personalizados" },
      {
        name: "description",
        content:
          "Transforma o interior do teu automóvel com volantes premium personalizados. Compatível com BMW, Audi, Porsche, Mercedes e mais.",
      },
      { property: "og:title", content: "REDLINE Performance — Volantes Premium" },
      {
        property: "og:description",
        content: "Volantes desportivos personalizados para uma experiência de condução única.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative isolate min-h-[92vh] flex items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroImg}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

        <div className="container-premium relative pb-24 pt-32 animate-fade-up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/40 bg-primary/10 text-xs uppercase tracking-[0.25em] text-primary mb-6">
              <span className="size-1.5 bg-primary rounded-full" /> Performance · Precisão · Paixão
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              Transforma o<br />
              <span className="text-gradient-red">interior</span> do teu
              <br />
              automóvel.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Volantes premium personalizados em alcantara, carbono e couro nappa. Construídos à mão
              para uma experiência de condução incomparável.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 rounded-none h-14 px-8 text-sm uppercase tracking-wider"
              >
                <Link to="/products">
                  Ver Produtos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-none h-14 px-8 text-sm uppercase tracking-wider border-foreground/30"
              >
                <Link to="/marcas">Explorar Coleção</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TransformationShowcase />

      <FeaturedProductsSection />

      <CustomProductsSection />

      {/* BENEFITS */}
      <section className="relative isolate overflow-hidden bg-surface/40 py-20 md:py-24">
        <AmbientGlow edge="top" />
        <AmbientGlow edge="bottom" />
        <div className="container-premium relative">
          <div className="text-center mb-12 md:mb-14">
            <SectionEyebrow align="center" className="mb-3">
              A Diferença REDLINE
            </SectionEyebrow>
            <h2 className="text-4xl md:text-5xl font-bold">Construído para entusiastas.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-border">
            {[
              {
                icon: Wrench,
                t: "Personalização Total",
                d: "Escolhe materiais, cores e acabamentos. Cada volante é construído à medida do teu carro.",
              },
              {
                icon: Shield,
                t: "Qualidade Premium",
                d: "Alcantara, fibra de carbono real e couro nappa italiano. Garantia de 2 anos em todos os produtos.",
              },
              {
                icon: Truck,
                t: "Entrega Europeia",
                d: "Envio rápido para toda a Europa. Embalagem premium, instalação opcional.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="group relative bg-surface p-10 transition-colors duration-500 hover:bg-surface-elevated"
              >
                <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <Icon className="h-8 w-8 text-primary mb-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5" />
                <h3 className="text-xl font-bold mb-3">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeedbackShowcase />

      <BrandShowcase />

      {/* CTA */}
      <section className="relative isolate overflow-hidden border-t border-border/60">
        <AmbientGlow edge="top" />
        <AmbientGlow edge="bottom" />
        <div className="container-premium relative py-20 md:py-24 text-center">
          <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
            <Star className="relative h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pronto para transformar o teu interior?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Explora a nossa coleção completa de volantes premium.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 rounded-none h-14 px-10 uppercase tracking-wider text-sm"
          >
            <Link to="/products">
              Comprar Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
