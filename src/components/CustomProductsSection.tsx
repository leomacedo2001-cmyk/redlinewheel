import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import volanteCompleto from "@/assets/configurator-showcase.jpg";
import alcantara from "@/assets/custom-alcantara-catalog.jpg";
import pelePerfurada from "@/assets/custom-pele-perfurada-catalog.jpg";
import carbono from "@/assets/custom-carbono-catalog.jpg";
import costuras from "@/assets/custom-costuras-catalog.jpg";
import ledShift from "@/assets/custom-led-shift-catalog.jpg";
import patilhas from "@/assets/custom-patilhas-catalog.jpg";
import oemPlus from "@/assets/custom-oem-plus-catalog.jpg";

import { CATEGORY_PAGES } from "@/lib/categoryPages";
import { PersonalizationCarousel } from "@/components/carousel/PersonalizationCarousel";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AmbientGlow } from "@/components/AmbientGlow";

const CATEGORIES = [
  {
    slug: "alcantara",
    name: "Revestimento em Alcântara",
    img: alcantara,
    desc: "Aderência e toque premium. O material de eleição das edições M Performance e RS.",
  },
  {
    slug: "pele-perfurada",
    name: "Revestimento em Pele Perfurada",
    img: pelePerfurada,
    desc: "Couro nappa perfurado para ventilação superior e estética GT intemporal.",
  },
  {
    slug: "carbono",
    name: "Acabamentos em Fibra de Carbono",
    img: carbono,
    desc: "Carbono real em tecelagem twill ou forged. Leveza e detalhe motorsport ao nível Porsche e Ferrari.",
  },
  {
    slug: "costuras",
    name: "Costuras Personalizadas",
    img: costuras,
    desc: "Escolhe a cor, o ponto e o padrão. Costura à mão por mestres-artesãos com acabamento OEM+.",
  },
  {
    slug: "led-shift",
    name: "Indicadores LED de Mudança de Caixa",
    img: ledShift,
    desc: "Barra sequencial de LEDs integrada no aro. Resposta imediata, inspirada nos cockpits de competição.",
  },
  {
    slug: "patilhas",
    name: "Patilhas de Velocidade Premium",
    img: patilhas,
    desc: "Patilhas em alumínio CNC anodizado. Maior alcance e ergonomia digna de um AMG GT.",
  },
  {
    slug: "oem-plus",
    name: "Personalização OEM+",
    img: oemPlus,
    desc: "Upgrades que parecem de fábrica — só que melhores. Iluminação ambiente, inserções e detalhes integrados.",
  },
];

export function CustomProductsSection() {
  return (
    <section id="produtos-personalizados" className="relative isolate overflow-hidden bg-surface/40 border-y border-border/60 py-20 md:py-24">
      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />
      <div className="container-premium relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
          <div>
            <SectionEyebrow className="mb-3">Personalização</SectionEyebrow>
            <h2 className="text-4xl md:text-5xl font-bold">Configura o teu volante.</h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              O nosso serviço principal é o volante feito à tua medida. Pede orçamento através do
              configurador — respondemos em menos de 24h.
            </p>
          </div>
        </div>

        {/* Hero — Volantes Personalizados */}
        <article className="group relative bg-surface border border-primary/40 hover:border-primary transition-all duration-500 mb-10 overflow-hidden hover:shadow-[0_32px_70px_-28px_rgba(0,0,0,0.6)]">
          <div className="grid md:grid-cols-2">
            <div className="aspect-square md:aspect-auto overflow-hidden bg-background relative">
              <img
                src={volanteCompleto}
                alt="Volante desportivo em fibra de carbono e pele perfurada, interior Audi RS"
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Serviço Principal
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
                Personalização Total
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Volantes Personalizados</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Construídos à mão, à medida do teu carro. Escolhe materiais, costuras, carbono, LED,
                patilhas e mais. Inspirados nos padrões BMW M, AMG, Audi Sport, Porsche e Ferrari.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-8">
                <li>• Configurador online com mais de 40 opções</li>
                <li>• Compatível com as principais marcas premium</li>
                <li>• Orçamento em menos de 24 horas</li>
              </ul>
              <Button
                asChild
                className="rounded-none h-14 uppercase tracking-wider text-sm bg-primary hover:bg-primary/90 px-8 self-start"
              >
                <Link to="/configurator">
                  Pedir Orçamento <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Catálogo informativo */}
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Catálogo de personalizações
        </div>
        <PersonalizationCarousel
          categories={CATEGORIES.map((c) => ({
            ...c,
            urlSlug: CATEGORY_PAGES[c.slug]?.urlSlug ?? c.slug,
          }))}
        />
      </div>
    </section>
  );
}
