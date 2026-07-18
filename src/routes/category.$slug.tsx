import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import alcantara from "@/assets/product-alcantara.jpg";
import pelePerfurada from "@/assets/product-pele-perfurada.jpg";
import carbono from "@/assets/product-carbono.jpg";
import costuras from "@/assets/product-costuras.jpg";
import ledShift from "@/assets/product-led-shift.jpg";
import patilhas from "@/assets/product-patilhas.jpg";
import oemPlus from "@/assets/product-oem-plus.jpg";
import componentesInterior from "@/assets/product-componentes-interior.jpg";

// Fotografias dedicadas a cada categoria (uma foto por categoria, nome correspondente
// à personalização exata). Usadas como imagem hero de destaque; as fotos "product-*"
// acima continuam a servir de apoio na galeria de cada categoria.
import customAlcantara from "@/assets/custom-alcantara.jpg.asset.json";
import customCarbono from "@/assets/custom-carbono.jpg.asset.json";
import customCosturas from "@/assets/custom-costuras.jpg.asset.json";
import customLedShift from "@/assets/custom-led-shift.jpg.asset.json";
import customOemPlus from "@/assets/custom-oem-plus.jpg.asset.json";
import customPatilhas from "@/assets/custom-patilhas.jpg.asset.json";
import customPelePerfurada from "@/assets/custom-pele-perfurada.jpg.asset.json";

type Category = {
  title: string;
  tagline: string;
  intro: string;
  hero: string;
  gallery: string[];
  highlights: string[];
};

const CATEGORIES: Record<string, Category> = {
  alcantara: {
    title: "Revestimento em Alcântara",
    tagline: "Aderência e toque premium",
    intro: "Alcântara genuíno aplicado à mão nas zonas de pegada para máxima aderência e estética motorsport. Material de eleição das edições M Performance, RS e AMG.",
    hero: customAlcantara.url,
    gallery: [customAlcantara.url, alcantara, costuras],
    highlights: ["Aderência superior em condução desportiva", "Toque premium e respirável", "Disponível em várias tonalidades", "Combinável com pele ou carbono"],
  },
  "pele-perfurada": {
    title: "Pele Perfurada",
    tagline: "GT intemporal",
    intro: "Couro nappa perfurado a laser para ventilação superior. Costura à mão por mestres-artesãos com acabamento OEM+.",
    hero: customPelePerfurada.url,
    gallery: [customPelePerfurada.url, pelePerfurada, costuras],
    highlights: ["Couro nappa europeu de primeira", "Perfuração a laser uniforme", "Costuras à medida", "Durabilidade de longo prazo"],
  },
  carbono: {
    title: "Fibra de Carbono",
    tagline: "Twill e Forged",
    intro: "Carbono real em tecelagem twill 2x2 ou forged. Leveza e detalhe motorsport ao nível Porsche e Ferrari.",
    hero: customCarbono.url,
    gallery: [customCarbono.url, carbono, oemPlus],
    highlights: ["Carbono pré-impregnado de aviação", "Acabamento UV-stable brilhante ou mate", "Twill 2x2 ou forged disponíveis", "Aplicável em aro, inserções e trim"],
  },
  costuras: {
    title: "Costuras Personalizadas",
    tagline: "Cor, ponto e padrão",
    intro: "Escolhe a cor, o ponto e o padrão. Costura à mão por mestres-artesãos com acabamento OEM+ indistinguível de fábrica.",
    hero: customCosturas.url,
    gallery: [customCosturas.url, costuras, oemPlus],
    highlights: ["Mais de 30 cores disponíveis", "Ponto duplo, cruzado ou tom-sobre-tom", "Costura à mão em zonas críticas", "Combinações tricolor M ou personalizadas"],
  },
  "led-shift": {
    title: "Indicadores LED de Mudança",
    tagline: "Cockpit de competição",
    intro: "Barra sequencial de LEDs RGB integrada no aro superior. Resposta imediata, inspirada nos cockpits de competição WRC e GT.",
    hero: customLedShift.url,
    gallery: [customLedShift.url, ledShift, carbono],
    highlights: ["LEDs RGB programáveis", "Integração OBD2 / CAN-bus", "Cores e thresholds personalizáveis", "Plug & play em modelos compatíveis"],
  },
  patilhas: {
    title: "Patilhas de Velocidade",
    tagline: "Alumínio CNC anodizado",
    intro: "Patilhas em alumínio CNC anodizado. Maior alcance e ergonomia digna de um AMG GT ou Porsche GT3.",
    hero: customPatilhas.url,
    gallery: [customPatilhas.url, patilhas, carbono],
    highlights: ["Alumínio aeronáutico CNC", "Anodização em várias cores", "Encaixe direto sem cortes", "Compatibilidade ampla VAG / BMW / MB"],
  },
  "oem-plus": {
    title: "Personalização OEM+",
    tagline: "Parecem de fábrica — só que melhores",
    intro: "Upgrades que parecem de fábrica — só que melhores. Iluminação ambiente, inserções e detalhes integrados sem comprometer a garantia.",
    hero: customOemPlus.url,
    gallery: [customOemPlus.url, oemPlus, componentesInterior],
    highlights: ["Acabamento indistinguível do original", "Sem cortes destrutivos", "Compatível com airbag e sensores", "Documentação técnica fornecida"],
  },
};

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = CATEGORIES[params.slug];
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.cat;
    const title = cat ? `${cat.title} — REDLINE Performance` : "Categoria — REDLINE Performance";
    const desc = cat?.intro ?? "Personalização premium de volantes e interiores.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(cat ? [{ property: "og:image", content: cat.hero }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-premium py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Categoria não encontrada</h1>
      <Button asChild className="rounded-none"><Link to="/">Voltar ao início</Link></Button>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();

  return (
    <div className="container-premium py-16 md:py-24">
      <Link to="/" className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Voltar
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{cat.tagline}</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{cat.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{cat.intro}</p>
          <ul className="space-y-3 mb-10">
            {cat.highlights.map((h: string) => (
              <li key={h} className="flex gap-3 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90 px-8">
              <Link to="/configurator">Pedir Orçamento <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none h-12 uppercase tracking-wider text-xs px-8">
              <Link to="/contact">Falar Connosco</Link>
            </Button>
          </div>
        </div>
        <div className="aspect-square overflow-hidden bg-surface border border-border/60">
          <img src={cat.hero} alt={cat.title} width={1024} height={1024} loading="eager" fetchPriority="high" className="w-full h-full object-cover" />
        </div>
      </div>

      <section>
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Galeria</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cat.gallery.map((g: string, i: number) => (
            <div key={i} className="aspect-square overflow-hidden bg-surface border border-border/60">
              <img src={g} alt={`${cat.title} ${i + 1}`} width={1024} height={1024} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
