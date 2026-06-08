import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import volanteCompleto from "@/assets/product-volante-completo.jpg";
import alcantara from "@/assets/product-alcantara.jpg";
import pelePerfurada from "@/assets/product-pele-perfurada.jpg";
import carbono from "@/assets/product-carbono.jpg";
import costuras from "@/assets/product-costuras.jpg";
import ledShift from "@/assets/product-led-shift.jpg";
import patilhas from "@/assets/product-patilhas.jpg";

const PRODUCTS = [
  {
    name: "Volante Personalizado Completo",
    img: volanteCompleto,
    desc: "Construído à medida do teu carro. Combina materiais, formas e acabamentos para uma peça verdadeiramente única.",
  },
  {
    name: "Revestimento em Alcântara",
    img: alcantara,
    desc: "Toque premium e aderência absoluta. O acabamento preferido das versões M, RS e GT.",
  },
  {
    name: "Revestimento em Pele Perfurada",
    img: pelePerfurada,
    desc: "Couro nappa perfurado para ventilação superior e estética desportiva intemporal.",
  },
  {
    name: "Acabamentos em Fibra de Carbono",
    img: carbono,
    desc: "Inserções em carbono real, com tecelagem twill brilhante ou mate. Leveza e detalhe motorsport.",
  },
  {
    name: "Costuras Personalizadas",
    img: costuras,
    desc: "Escolhe a cor, o ponto e o padrão. Costura à mão por mestres-artesãos.",
  },
  {
    name: "Indicador LED de Mudança de Caixa",
    img: ledShift,
    desc: "Barra sequencial de LEDs integrada no aro. Resposta imediata para condução em pista.",
  },
  {
    name: "Patilhas de Velocidade Personalizadas",
    img: patilhas,
    desc: "Patilhas em alumínio CNC anodizado. Maior alcance, melhor ergonomia, troca instantânea.",
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
              Cada componente é feito sob medida. Escolhe o que pretendes e pede um orçamento — respondemos em menos de 24h.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-background">
                <img
                  src={p.img}
                  alt={p.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight mb-2">{p.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 rounded-none h-12 uppercase tracking-wider text-xs w-full"
                >
                  <Link to="/contact">
                    Pedir Orçamento <ArrowRight className="ml-2 h-4 w-4" />
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
