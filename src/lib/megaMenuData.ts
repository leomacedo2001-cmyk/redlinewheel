import { BRANDS } from "@/lib/brands";
import { curatedCategoryCollections, getGenericCollection } from "@/lib/collections";

/**
 * Dados dos dois mega menus do header (Produtos, Marcas) — fonte única,
 * partilhada entre o painel desktop (hover) e o accordion mobile, para nunca
 * haver duas listas a divergir.
 *
 * Cada item real aponta para uma coleção/página que já existe (curada ou
 * gerada em /c/:slug — ver src/lib/collections.ts). Itens sem `href` são
 * conceitos ainda sem catálogo/página própria: aparecem como "Em breve",
 * visíveis mas não clicáveis — nunca um link morto, nunca dados inventados.
 */

export type MegaMenuItem = { label: string; href?: string };
export type MegaMenuColumn = { heading?: string; items: MegaMenuItem[] };

function curated(urlSlug: string, labelOverride?: string): MegaMenuItem {
  const col = curatedCategoryCollections.find((c) => c.urlSlug === urlSlug);
  if (!col) throw new Error(`Coleção curada "${urlSlug}" não encontrada`);
  return { label: labelOverride ?? col.title, href: col.curatedPath };
}

function generic(urlSlug: string, label: string): MegaMenuItem {
  const col = getGenericCollection(urlSlug);
  if (!col) throw new Error(`Coleção genérica "${urlSlug}" não encontrada`);
  return { label, href: `/c/${col.urlSlug}` };
}

const soon = (label: string): MegaMenuItem => ({ label });

export const PRODUTOS_MEGA_MENU: MegaMenuColumn[] = [
  {
    heading: "Tipo de Volante",
    items: [
      generic("formato-flat-bottom", "Flat Bottom"),
      generic("formato-round", "Round"),
      generic("linha-desportivo", "Volantes Desportivos"),
      generic("linha-original", "Volantes OEM"),
      { label: "Ver Catálogo Completo", href: "/products" },
    ],
  },
  {
    heading: "Fibra de Carbono",
    items: [
      curated("fibra-de-carbono", "Carbono Twill"),
      generic("material-carbono-forjado", "Carbono Forjado"),
      generic("material-carbono-brilhante", "Carbono Brilhante"),
      generic("material-carbono-mate", "Carbono Mate"),
      generic("material-carbono-colorido", "Carbono Colorido"),
    ],
  },
  {
    heading: "Pele & Costuras",
    items: [
      curated("alcantara"),
      curated("pele-perfurada"),
      generic("material-nappa", "Pele Nappa"),
      generic("material-pele-lisa", "Pele Lisa"),
      curated("costuras-personalizadas"),
    ],
  },
  {
    heading: "Detalhes & Extras",
    items: [
      curated("volante-led", "Friso LED de Mudança"),
      curated("patilhas", "Patilhas de Velocidade"),
      generic("feature-patilhas-carbono", "Patilhas em Carbono"),
      generic("feature-faixa-12h", "Marca às 12 Horas"),
      generic("feature-faixa-central", "Friso Central"),
      generic("feature-botoes-multifuncoes", "Botões Multifunções"),
      curated("oem-plus"),
      { label: "Acessórios", href: "/acessorios" },
    ],
  },
  {
    heading: "Em Breve",
    items: [
      soon("Airbags Personalizados"),
      soon("Molduras em Carbono"),
      soon("Logótipos Personalizados"),
      soon("Peças de Carbono para Interior"),
      soon("Cartões-Presente"),
      soon("Edições Limitadas"),
      soon("Mais Vendidos"),
      soon("Novidades"),
    ],
  },
];

const REAL_BRAND_SLUGS = new Set(BRANDS.map((b) => b.slug));

function slugifyBrand(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Lista alfabética pedida — organiza-se automaticamente pelas marcas com catálogo real. */
const BRAND_NAMES = [
  "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "Bentley", "BMW", "Brabus", "Bugatti",
  "Cadillac", "Chevrolet", "Cupra", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda",
  "Hyundai", "Infiniti", "Jaguar", "Jeep", "Koenigsegg", "Lamborghini", "Land Rover", "Lexus", "Lotus",
  "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MINI", "Mitsubishi", "Nissan", "Pagani",
  "Peugeot", "Polestar", "Porsche", "Renault", "Rolls-Royce", "SEAT", "Škoda", "Subaru", "Suzuki",
  "Tesla", "Toyota", "Volkswagen", "Volvo",
];

export type MegaMenuBrand = MegaMenuItem;

export const MARCAS_MEGA_MENU_BRANDS: MegaMenuBrand[] = BRAND_NAMES.map((name) => {
  const slug = slugifyBrand(name);
  return REAL_BRAND_SLUGS.has(slug) ? { label: name, href: `/brand/${slug}` } : { label: name };
});

/** Divide a lista alfabética em N colunas de leitura vertical (topo→baixo, coluna a coluna). */
export function chunkIntoColumns<T>(items: T[], columns: number): T[][] {
  const perColumn = Math.ceil(items.length / columns);
  return Array.from({ length: columns }, (_, i) => items.slice(i * perColumn, i * perColumn + perColumn));
}
