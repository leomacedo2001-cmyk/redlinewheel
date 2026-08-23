import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FeaturedProductsSection } from "@/components/FeaturedWheels";
import { BrandShowcase } from "@/components/BrandShowcase";
import { CtaShowcase } from "@/components/CtaShowcase";
import { RedlineDifference } from "@/components/RedlineDifference";

import heroImg from "@/assets/hero-steering.jpg";
import heroVideo from "@/assets/hero/hero-wheel-reveal.mp4";
import { CustomProductsSection } from "@/components/CustomProductsSection";
import { FeedbackShowcase } from "@/components/feedback/FeedbackShowcase";
import { TransformationShowcase } from "@/components/transformation/TransformationShowcase";

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
              Volantes personalizados em Alcântara, couro nappa e fibra de carbono. Construídos à
              mão, com costura ponto a ponto e os comandos originais mantidos.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 rounded-none h-14 px-8 text-sm uppercase tracking-wider"
              >
                <Link to="/configurator">
                  Configura o teu volante <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-none h-14 px-8 text-sm uppercase tracking-wider border-foreground/30"
              >
                <Link to="/products">Ver modelos disponíveis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProductsSection />

      <CustomProductsSection />

      <TransformationShowcase />

      <BrandShowcase />

      <FeedbackShowcase />

      <RedlineDifference />

      <CtaShowcase />
    </div>
  );
}
