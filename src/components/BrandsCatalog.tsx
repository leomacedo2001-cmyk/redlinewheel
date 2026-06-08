import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-steering.jpg";
import wheel from "@/assets/wheel-showcase.jpg";
import carbono from "@/assets/product-carbono.jpg";
import volanteCompleto from "@/assets/product-volante-completo.jpg";
import ledShift from "@/assets/product-led-shift.jpg";
import pelePerfurada from "@/assets/product-pele-perfurada.jpg";
import oemPlus from "@/assets/product-oem-plus.jpg";
import alcantara from "@/assets/product-alcantara.jpg";

const BRANDS = [
  {
    name: "BMW",
    tagline: "M Performance Heritage",
    img: hero,
    models: ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "M2", "M3", "M4", "M5", "X3M", "X5M"],
  },
  {
    name: "Mercedes-Benz",
    tagline: "AMG Inspired Craft",
    img: alcantara,
    models: ["Classe A", "Classe C", "Classe E", "CLA", "GLA", "C43 AMG", "C63 AMG", "A35 AMG", "A45 AMG", "E63 AMG"],
  },
  {
    name: "Audi",
    tagline: "RS Performance Edition",
    img: pelePerfurada,
    models: ["A3", "S3", "RS3", "A4", "S4", "RS4", "A5", "S5", "RS5", "A6", "RS6", "TT", "TTRS"],
  },
  {
    name: "Volkswagen",
    tagline: "GTI & R Custom",
    img: volanteCompleto,
    models: ["Golf GTI", "Golf R", "Polo GTI", "Scirocco", "Arteon"],
  },
  {
    name: "Porsche",
    tagline: "GT Style Precision",
    img: wheel,
    models: ["Macan", "Cayenne", "Panamera", "911", "Cayman", "Boxster"],
  },
  {
    name: "Tesla",
    tagline: "Modern Performance",
    img: oemPlus,
    models: ["Model 3", "Model Y", "Model S"],
  },
  {
    name: "Toyota",
    tagline: "Track-Ready Series",
    img: ledShift,
    models: ["GR Yaris", "GR86", "Supra"],
  },
  {
    name: "Outras Marcas",
    tagline: "Compatibilidade Total",
    img: carbono,
    models: ["Seat", "Cupra", "Ford", "Nissan", "Honda", "Subaru", "Renault", "Peugeot", "Outras sob consulta"],
  },
];

export function BrandsCatalog() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {BRANDS.map((b) => (
        <article
          key={b.name}
          className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
        >
          <div className="md:w-2/5 aspect-square md:aspect-auto overflow-hidden bg-background relative shrink-0">
            <img
              src={b.img}
              alt={`Volantes personalizados para ${b.name}`}
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>

          <div className="flex-1 p-6 md:p-8 flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">{b.tagline}</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{b.name}</h3>

            <div className="flex-1 mb-6">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Modelos compatíveis</div>
              <div className="flex flex-wrap gap-1.5">
                {b.models.map((m) => (
                  <span
                    key={m}
                    className="text-[11px] px-2 py-1 bg-background border border-border/60 text-muted-foreground"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <Button asChild className="bg-primary hover:bg-primary/90 rounded-none h-11 uppercase tracking-wider text-xs w-full">
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
