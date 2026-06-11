import hero from "@/assets/hero-steering.jpg";
import wheel from "@/assets/wheel-showcase.jpg";
import carbono from "@/assets/product-carbono.jpg";
import volanteCompleto from "@/assets/product-volante-completo.jpg";
import ledShift from "@/assets/product-led-shift.jpg";
import pelePerfurada from "@/assets/product-pele-perfurada.jpg";
import oemPlus from "@/assets/product-oem-plus.jpg";
import alcantara from "@/assets/product-alcantara.jpg";

export type BrandModel = {
  name: string;
  description: string;
  img: string;
};

export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  img: string;
  description: string;
  models: BrandModel[];
};

const m = (name: string, description: string, img: string): BrandModel => ({ name, description, img });

export const BRANDS: Brand[] = [
  {
    slug: "bmw",
    name: "BMW",
    tagline: "M Performance Heritage",
    img: hero,
    description:
      "Volantes inspirados nas edições M Performance, com acabamentos em Alcântara, carbono e costuras tricolor M. Compatíveis com toda a gama BMW moderna.",
    models: [
      m("Série 1", "Hatch compacto desportivo (F20, F40).", hero),
      m("Série 2", "Coupé e Gran Coupé com ADN M.", wheel),
      m("Série 3", "Berlina de referência (F30, G20).", volanteCompleto),
      m("Série 4", "Coupé e Gran Coupé premium.", carbono),
      m("Série 5", "Executivo com tecnologia de topo.", oemPlus),
      m("M2", "Coupé compacto M (F87, G87).", pelePerfurada),
      m("M3", "Ícone M sedan (F80, G80).", alcantara),
      m("M4", "Coupé M de alto desempenho.", ledShift),
      m("M5", "Super-sedan M.", carbono),
      m("X3 M", "SUV M de desempenho.", wheel),
      m("X5 M", "SUV M de luxo.", hero),
    ],
  },
  {
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    tagline: "AMG Inspired Craft",
    img: alcantara,
    description:
      "Volantes em pele nappa e Alcântara, com costuras à mão e detalhes AMG. Pensados para Classe A, C, E e gama AMG.",
    models: [
      m("Classe A", "Hatch premium compacto.", alcantara),
      m("Classe C", "Berlina premium intermédia.", pelePerfurada),
      m("Classe E", "Executivo de referência.", oemPlus),
      m("CLA", "Coupé de quatro portas.", carbono),
      m("GLA", "SUV compacto.", wheel),
      m("C43 AMG", "Performance V6 biturbo.", ledShift),
      m("C63 AMG", "Ícone AMG V8 / híbrido.", hero),
      m("A35 AMG", "Hatch AMG de entrada.", volanteCompleto),
      m("A45 AMG", "Hot-hatch topo de gama.", carbono),
      m("E63 AMG", "Super-sedan AMG.", oemPlus),
    ],
  },
  {
    slug: "audi",
    name: "Audi",
    tagline: "RS Performance Edition",
    img: pelePerfurada,
    description:
      "Volantes para gama A, S e RS. Acabamentos em Alcântara, carbono forged e patilhas em alumínio CNC.",
    models: [
      m("A3", "Hatch premium.", pelePerfurada),
      m("S3", "Performance compacto.", carbono),
      m("RS3", "Hot-hatch 5 cilindros.", ledShift),
      m("A4", "Berlina premium.", oemPlus),
      m("S4", "Sport sedan.", wheel),
      m("RS4", "Avant RS lendário.", alcantara),
      m("A5", "Coupé / Sportback.", hero),
      m("S5", "Sport coupé.", volanteCompleto),
      m("RS5", "Coupé RS V6 biturbo.", carbono),
      m("A6", "Executivo premium.", oemPlus),
      m("RS6", "Avant RS V8 biturbo.", ledShift),
      m("TT", "Coupé desportivo.", wheel),
      m("TT RS", "TT RS 5 cilindros.", carbono),
    ],
  },
  {
    slug: "volkswagen",
    name: "Volkswagen",
    tagline: "GTI & R Custom",
    img: volanteCompleto,
    models: [
      m("Golf GTI", "Hot-hatch icónico.", volanteCompleto),
      m("Golf R", "Tração integral performance.", carbono),
      m("Polo GTI", "Hot-hatch compacto.", pelePerfurada),
      m("Scirocco", "Coupé desportivo.", oemPlus),
      m("Arteon", "Gran Turismo VW.", hero),
    ],
    description: "Volantes desportivos para a gama GTI, R e modelos premium VW.",
  },
  {
    slug: "porsche",
    name: "Porsche",
    tagline: "GT Style Precision",
    img: wheel,
    description: "Inspiração GT3 e GT4. Volantes em Alcântara, carbono e pele nappa com costuras de competição.",
    models: [
      m("Macan", "SUV desportivo compacto.", wheel),
      m("Cayenne", "SUV premium.", oemPlus),
      m("Panamera", "Gran Turismo 4 portas.", hero),
      m("911", "Ícone desportivo.", carbono),
      m("Cayman", "Coupé mid-engine.", alcantara),
      m("Boxster", "Roadster mid-engine.", pelePerfurada),
    ],
  },
  {
    slug: "tesla",
    name: "Tesla",
    tagline: "Modern Performance",
    img: oemPlus,
    description: "Upgrades modernos para Model 3, Y e S — incluindo volantes yoke e formatos round redesenhados.",
    models: [
      m("Model 3", "Berlina elétrica.", oemPlus),
      m("Model Y", "SUV elétrico.", wheel),
      m("Model S", "Berlina top de gama.", hero),
    ],
  },
  {
    slug: "toyota",
    name: "Toyota",
    tagline: "Track-Ready Series",
    img: ledShift,
    description: "Volantes para a gama GR Performance, com foco em pista e condução desportiva.",
    models: [
      m("GR Yaris", "Hot-hatch de homologação rali.", ledShift),
      m("GR86", "Coupé RWD acessível.", carbono),
      m("Supra", "Coupé GT moderno.", hero),
    ],
  },
  {
    slug: "outras-marcas",
    name: "Outras Marcas",
    tagline: "Compatibilidade Total",
    img: carbono,
    description: "Trabalhamos sob consulta com várias outras marcas. Contacta-nos com o teu modelo.",
    models: [
      m("Seat", "Gama Seat e FR.", carbono),
      m("Cupra", "Gama Cupra performance.", ledShift),
      m("Ford", "Focus ST, RS e Mustang.", hero),
      m("Nissan", "GT-R, 370Z, 350Z.", wheel),
      m("Honda", "Civic Type R e gama.", pelePerfurada),
      m("Subaru", "WRX / STI.", alcantara),
      m("Renault", "Megane RS, Clio RS.", volanteCompleto),
      m("Peugeot", "208 GTi, 308 GTi.", oemPlus),
    ],
  },
];

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
