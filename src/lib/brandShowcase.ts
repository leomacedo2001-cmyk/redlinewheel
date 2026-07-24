import { BRANDS } from "@/lib/brands";
import bmwCockpit from "@/assets/brand-showcase/bmw-7-series-cockpit.jpg";
import mercedesCockpit from "@/assets/brand-showcase/mercedes-amg-gt-cockpit.webp";
import audiCockpit from "@/assets/brand-showcase/audi-r8-cockpit.jpg";
import porscheCockpit from "@/assets/brand-showcase/porsche-911-turbo-s-cockpit.avif";

function brandImg(slug: string): string {
  return BRANDS.find((b) => b.slug === slug)?.img ?? "";
}

export type BrandShowcaseSlide = {
  slug: string;
  name: string;
  headline: string;
  subtitle: string;
  ctaLabel: string;
  image: string;
  /** Pronta para ativar assim que houver fotografia dedicada à mesma qualidade das restantes. */
  enabled: boolean;
};

export const BRAND_SHOWCASE_SLIDES: BrandShowcaseSlide[] = [
  {
    slug: "bmw",
    name: "BMW",
    headline: "BMW M Performance",
    subtitle: "Precisão alemã. Sem compromissos.",
    ctaLabel: "Explorar BMW",
    image: bmwCockpit,
    enabled: true,
  },
  {
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    headline: "Mercedes-AMG Collection",
    subtitle: "Onde a adrenalina encontra o detalhe.",
    ctaLabel: "Explorar Mercedes",
    image: mercedesCockpit,
    enabled: true,
  },
  {
    slug: "audi",
    name: "Audi",
    headline: "Audi RS Interior Collection",
    subtitle: "Minimalismo com intenção.",
    ctaLabel: "Explorar Audi",
    image: audiCockpit,
    enabled: true,
  },
  {
    slug: "porsche",
    name: "Porsche",
    headline: "Porsche 911 Turbo S",
    subtitle: "Cada detalhe, uma decisão de engenharia.",
    ctaLabel: "Explorar Porsche",
    image: porscheCockpit,
    enabled: true,
  },
  {
    slug: "volkswagen",
    name: "Volkswagen",
    headline: "Volkswagen R Collection",
    subtitle: "A herança GTI, reforjada.",
    ctaLabel: "Explorar Volkswagen",
    image: brandImg("volkswagen"),
    enabled: false,
  },
  {
    slug: "tesla",
    name: "Tesla",
    headline: "Tesla Premium Steering Wheels",
    subtitle: "Performance elétrica, acabamento artesanal.",
    ctaLabel: "Explorar Tesla",
    image: brandImg("tesla"),
    enabled: false,
  },
  {
    slug: "toyota",
    name: "Toyota",
    headline: "Toyota GR Collection",
    subtitle: "O espírito de competição, todos os dias.",
    ctaLabel: "Explorar Toyota",
    image: brandImg("toyota"),
    enabled: false,
  },
];

export const ACTIVE_BRAND_SHOWCASE_SLIDES = BRAND_SHOWCASE_SLIDES.filter((s) => s.enabled);
