import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-steering.jpg";
import wheel from "@/assets/wheel-showcase.jpg";
import carbono from "@/assets/product-carbono.jpg";
import volanteCompleto from "@/assets/product-volante-completo.jpg";
import ledShift from "@/assets/product-led-shift.jpg";
import pelePerfurada from "@/assets/product-pele-perfurada.jpg";
import alcantara from "@/assets/product-alcantara.jpg";
import restauro from "@/assets/product-restauro.jpg";

const WHEELS = [
  { name: "Volante Full Carbon Performance", img: carbono, tag: "Carbon Forged", desc: "Aro integralmente em fibra de carbono twill com detalhes em alcântara. Leveza absoluta, rigidez de competição." },
  { name: "Volante Alcântara + Carbono Forged", img: volanteCompleto, tag: "Performance", desc: "Combinação de alcântara premium nas pegas e carbono forged no aro inferior. Aderência e estética motorsport." },
  { name: "Volante LED Race Display", img: ledShift, tag: "Race", desc: "Barra sequencial de LEDs RGB integrada no aro superior. Indicação de mudança e telemetria visual." },
  { name: "Volante GT Style Custom", img: wheel, tag: "GT Style", desc: "Linha GT com pele nappa, faixa central a 12h e costuras tom-sobre-tom. Conforto premium para longas distâncias." },
  { name: "Volante RS Performance Edition", img: pelePerfurada, tag: "RS Edition", desc: "Pele perfurada nas pegas e alcântara na coroa, inspirado nas séries RS. Costuras vermelhas de assinatura." },
  { name: "Volante AMG Inspired Performance", img: alcantara, tag: "AMG Inspired", desc: "Aro achatado em baixo, alcântara integral e faixa de centro discreta. A linguagem AMG, à tua medida." },
  { name: "Volante M Performance Custom", img: hero, tag: "M Performance", desc: "Tricolor M na faixa central, carbono nas barras e alcântara nas zonas de pegada. Pura herança M." },
  { name: "Volante Signature Redline Performance", img: restauro, tag: "Signature", desc: "A nossa peça de assinatura. Carbono forged, alcântara, costuras vermelhas e logótipo Redline gravado." },
];

export function FeaturedWheels() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {WHEELS.map((w) => (
        <article
          key={w.name}
          className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col"
        >
          <div className="aspect-square overflow-hidden bg-background relative">
            <img
              src={w.img}
              alt={w.name}
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary border border-primary/40">
              {w.tag}
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1 gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-base leading-tight mb-2">{w.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{w.desc}</p>
            </div>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 rounded-none h-10 uppercase tracking-wider text-[11px] w-full">
              <Link to="/contact">
                Pedir Orçamento <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
