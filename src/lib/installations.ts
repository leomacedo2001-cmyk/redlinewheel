/**
 * INSTALAÇÕES — fonte única para a Galeria e para prova social.
 * ---------------------------------------------------------------------------
 * Substitui `src/lib/testimonials.ts`, que continha 18 clientes, cidades,
 * testemunhos e classificações FICTÍCIOS (o próprio ficheiro o declarava) e
 * era apresentado no site como "Instalações Reais" e "carros reais de
 * clientes". Esses dados foram removidos; as fotografias foram mantidas.
 *
 * DUAS REGRAS QUE TORNAM A PROVA SOCIAL FALSA IMPOSSÍVEL:
 *
 *   1. `verified` — nada é apresentado como instalação real, cliente ou
 *      testemunho sem `verified === true`. Uma entrada pode existir no código
 *      para desenvolvimento; enquanto não for verificada, a UI trata-a apenas
 *      como fotografia de inspiração, sem qualquer atribuição.
 *
 *   2. `consent: true` — o tipo do testemunho EXIGE consentimento literal. Não
 *      há como registar um testemunho sem declarar consentimento: o TypeScript
 *      recusa `consent: false` e recusa a sua ausência. Sem consentimento, nome,
 *      texto e classificação não podem sequer ser construídos.
 *
 * As duas condições são combinadas em `publicTestimonials()`, o único caminho
 * pelo qual um testemunho chega ao ecrã.
 *
 * NÃO DUPLICAR TAXONOMIAS: `build.attributes` é o `ProductAttributes` de
 * `attributes.ts` (o mesmo dos produtos e dos filtros) e `vehicle.chassis`
 * segue a nomenclatura de códigos de `fitment.ts`. Uma instalação verificada
 * passa a poder ser filtrada com os mesmos predicados do catálogo, sem código
 * de classificação novo.
 */

import type { ProductAttributes } from "@/lib/attributes";

import feedback01 from "@/assets/feedback/feedback-01.jpg";
import feedback02 from "@/assets/feedback/feedback-02.jpg";
import feedback03 from "@/assets/feedback/feedback-03.jpg";
import feedback04 from "@/assets/feedback/feedback-04.jpg";
import feedback05 from "@/assets/feedback/feedback-05.jpg";
import feedback06 from "@/assets/feedback/feedback-06.jpg";
import feedback07 from "@/assets/feedback/feedback-07.jpg";
import feedback08 from "@/assets/feedback/feedback-08.jpg";
import feedback09 from "@/assets/feedback/feedback-09.jpg";
import feedback10 from "@/assets/feedback/feedback-10.jpg";
import feedback11 from "@/assets/feedback/feedback-11.jpg";
import feedback12 from "@/assets/feedback/feedback-12.jpg";
import feedback13 from "@/assets/feedback/feedback-13.jpg";
import feedback14 from "@/assets/feedback/feedback-14.jpg";
import feedback15 from "@/assets/feedback/feedback-15.jpg";
import feedback16 from "@/assets/feedback/feedback-16.jpg";
import feedback17 from "@/assets/feedback/feedback-17.jpg";
import feedback18 from "@/assets/feedback/feedback-18.jpg";

export type InstallationPhoto = {
  src: string;
  alt: string;
};

export type Installation = {
  id: string;
  /** Único campo obrigatório além de `verified` — sem fotografia não há entrada. */
  photos: InstallationPhoto[];

  /** Veículo. `chassis` usa a nomenclatura de códigos de `fitment.ts` (G80, W205, 8Y). */
  vehicle?: {
    brand: string;
    model: string;
    chassis?: string;
    year?: number;
  };

  /** Configuração do volante. `attributes` é a taxonomia de `attributes.ts`. */
  build?: {
    /** Liga à ficha do catálogo: /brand/:marca/model/:slug. Ativa Galeria → ficha → Comprar/Personalizar. */
    productSlug?: string;
    attributes?: ProductAttributes;
  };

  location?: {
    city: string;
    country: string;
  };

  /**
   * `consent: true` é literal e obrigatório — não existe testemunho sem
   * consentimento registado. É a garantia de tipo contra publicar nome ou
   * texto de alguém sem autorização.
   */
  testimonial?: {
    author: string;
    text: string;
    rating?: number;
    consent: true;
  };

  /** ISO (YYYY-MM-DD). */
  date?: string;

  /**
   * Só `true` autoriza apresentar a entrada como instalação real, cliente ou
   * testemunho. Por omissão de dados confirmados, é `false`.
   */
  verified: boolean;
};

/**
 * As 18 fotografias que já existiam no projeto.
 *
 * Mantidas de propósito: o problema identificado na auditoria eram as
 * ATRIBUIÇÕES fictícias (nomes, cidades, testemunhos, classificações), não as
 * imagens. Ficam aqui sem veículo, sem configuração, sem localização e sem
 * testemunho — porque não existe informação verificável sobre nenhuma delas —
 * e todas com `verified: false`, o que as impede de ser apresentadas como
 * instalações de clientes.
 *
 * Para publicar uma instalação real: preencher `vehicle`/`build`/`location`
 * com dados confirmados, `testimonial` só com consentimento escrito, e só
 * então passar `verified` a `true`.
 */
const PHOTO_ALT = "Volante REDLINE personalizado";

export const INSTALLATIONS: Installation[] = [
  { id: "ph-01", photos: [{ src: feedback01, alt: PHOTO_ALT }], verified: false },
  { id: "ph-02", photos: [{ src: feedback02, alt: PHOTO_ALT }], verified: false },
  { id: "ph-03", photos: [{ src: feedback03, alt: PHOTO_ALT }], verified: false },
  { id: "ph-04", photos: [{ src: feedback04, alt: PHOTO_ALT }], verified: false },
  { id: "ph-05", photos: [{ src: feedback05, alt: PHOTO_ALT }], verified: false },
  { id: "ph-06", photos: [{ src: feedback06, alt: PHOTO_ALT }], verified: false },
  { id: "ph-07", photos: [{ src: feedback07, alt: PHOTO_ALT }], verified: false },
  { id: "ph-08", photos: [{ src: feedback08, alt: PHOTO_ALT }], verified: false },
  { id: "ph-09", photos: [{ src: feedback09, alt: PHOTO_ALT }], verified: false },
  { id: "ph-10", photos: [{ src: feedback10, alt: PHOTO_ALT }], verified: false },
  { id: "ph-11", photos: [{ src: feedback11, alt: PHOTO_ALT }], verified: false },
  { id: "ph-12", photos: [{ src: feedback12, alt: PHOTO_ALT }], verified: false },
  { id: "ph-13", photos: [{ src: feedback13, alt: PHOTO_ALT }], verified: false },
  { id: "ph-14", photos: [{ src: feedback14, alt: PHOTO_ALT }], verified: false },
  { id: "ph-15", photos: [{ src: feedback15, alt: PHOTO_ALT }], verified: false },
  { id: "ph-16", photos: [{ src: feedback16, alt: PHOTO_ALT }], verified: false },
  { id: "ph-17", photos: [{ src: feedback17, alt: PHOTO_ALT }], verified: false },
  { id: "ph-18", photos: [{ src: feedback18, alt: PHOTO_ALT }], verified: false },
];

// ---------------------------------------------------------------------------
// Seletores — o ÚNICO caminho pelo qual estes dados chegam ao ecrã
// ---------------------------------------------------------------------------

export type GalleryPhoto = InstallationPhoto & {
  /** Id da instalação de origem, para chaves de render. */
  installationId: string;
  /** Só preenchido em instalações verificadas — nunca inferido da fotografia. */
  productSlug?: string;
};

/**
 * Fotografias para a Galeria e para o carrossel da homepage.
 *
 * Inclui entradas não verificadas — mas apenas como IMAGEM. Nenhuma atribuição
 * a cliente, carro, local ou configuração viaja com elas: `productSlug` só é
 * exposto quando a instalação está verificada, o que impede ligar uma
 * fotografia a uma ficha sem confirmação.
 */
export function galleryPhotos(): GalleryPhoto[] {
  return INSTALLATIONS.flatMap((i) =>
    i.photos.map((p) => ({
      ...p,
      installationId: i.id,
      productSlug: i.verified ? i.build?.productSlug : undefined,
    })),
  );
}

/** Instalações que podem ser apresentadas como reais. */
export function verifiedInstallations(): Installation[] {
  return INSTALLATIONS.filter((i) => i.verified === true);
}

/**
 * Testemunhos publicáveis: exige verificação E consentimento.
 * Enquanto devolver vazio, o site não mostra prova social atribuída a pessoas.
 */
export function publicTestimonials(): Installation[] {
  return INSTALLATIONS.filter((i) => i.verified === true && i.testimonial?.consent === true);
}

/** Há prova social real para mostrar? Hoje: não. */
export function hasPublicTestimonials(): boolean {
  return publicTestimonials().length > 0;
}
