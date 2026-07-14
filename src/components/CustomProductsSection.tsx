import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import volanteCompleto from "@/assets/product-volante-completo.jpg";
import alcantaraAsset from "@/assets/custom-alcantara.jpg.asset.json";
import pelePerfuradaAsset from "@/assets/custom-pele-perfurada.jpg.asset.json";
import carbonoAsset from "@/assets/custom-carbono.jpg.asset.json";
import costurasAsset from "@/assets/custom-costuras.jpg.asset.json";
import ledShiftAsset from "@/assets/custom-led-shift.jpg.asset.json";
import patilhasAsset from "@/assets/custom-patilhas.jpg.asset.json";
import oemPlusAsset from "@/assets/custom-oem-plus.jpg.asset.json";
import componentesInteriorAsset from "@/assets/custom-componentes.jpg.asset.json";

const alcantara = alcantaraAsset.url;
const pelePerfurada = pelePerfuradaAsset.url;
const carbono = carbonoAsset.url;
const costuras = costurasAsset.url;
const ledShift = ledShiftAsset.url;
const patilhas = patilhasAsset.url;
const oemPlus = oemPlusAsset.url;
const componentesInterior = componentesInteriorAsset.url;

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
  {
    slug: "componentes-interior",
    name: "Componentes Premium para Interior",
    img: componentesInterior,
    desc: "Apoios de braço, manípulos de caixa, foles em pele e trims em carbono. Cada detalhe importa.",
  },
];

export function CustomProductsSection() {
  return (
    <section id="produtos-personalizados" className="bg-surface/40 border-y border-border/60 py-24">
      <div className="container-premium">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Personalização</div>
            <h2 className="text-4xl md:text-5xl font-bold">Configura o teu volante.</h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              O nosso serviço principal é o volante feito à tua medida. Pede orçamento através do configurador — respondemos em menos de 24h.
            </p>
          </div>
        </div>

        {/* Hero — Volantes Personalizados */}
        <article className="group relative bg-surface border border-primary/40 hover:border-primary transition-all duration-300 mb-10 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="aspect-square md:aspect-auto overflow-hidden bg-background relative">
              <img
                src={volanteCompleto}
                alt="Volantes Personalizados"
                width={1024}
                height={1024}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Serviço Principal
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Personalização Total</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Volantes Personalizados</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Construídos à mão, à medida do teu carro. Escolhe materiais, costuras, carbono, LED, patilhas e mais.
                Inspirados nos padrões BMW M, AMG, Audi Sport, Porsche e Ferrari.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-8">
                <li>• Configurador online com mais de 40 opções</li>
                <li>• Compatível com as principais marcas premium</li>
                <li>• Orçamento em menos de 24 horas</li>
              </ul>
              <Button
                asChild
                className="rounded-none h-14 uppercase tracking-[0.2em] text-sm bg-primary hover:bg-primary/90 px-8 self-start"
              >
                <Link to="/configurator">
                  Pedir Orçamento <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Catálogo informativo */}
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Catálogo de personalizações</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <article
              key={c.slug}
              className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-background">
                <img
                  src={c.img}
                  alt={c.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight mb-2">{c.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none h-12 uppercase tracking-wider text-xs w-full hover:bg-primary hover:text-primary-foreground hover:border-primary"
                >
                  <Link to="/category/$slug" params={{ slug: c.slug }}>
                    Ver Mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
