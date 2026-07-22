import porscheAntes from "@/assets/transformations/porsche-antes.png";
import porscheDepois from "@/assets/transformations/porsche-depois.png";
import audiAntes from "@/assets/transformations/audi-antes.png";
import audiDepois from "@/assets/transformations/audi-depois.png";

/**
 * `revealAt` é a posição (0–100) do slider a partir da qual o callout
 * correspondente fica visível — o número coincide com `xPercent` para que
 * o indicador só apareça quando a sua própria zona da imagem é revelada.
 */
export type TransformationCallout = {
  id: string;
  label: string;
  xPercent: number;
  yPercent: number;
  revealAt: number;
};

/**
 * Enquadramento de uma fotografia (par antes/depois) dentro do comparador.
 * Cada projeto vem de uma sessão fotográfica diferente — câmara, distância e
 * enquadramento do volante variam de marca para marca — por isso o
 * enquadramento nunca pode ser uma regra CSS global: vive aqui, um valor por
 * projeto, tal como qualquer outro dado editorial (descrição, materiais...).
 * Adicionar uma marca nova é só acrescentar um objeto com o seu próprio
 * `focalX`/`focalY`/`zoom` — o componente não muda.
 */
export type TransformationFraming = {
  /** Posição horizontal do ponto focal (0–100) — normalmente o centro do volante. */
  focalX: number;
  /** Posição vertical do ponto focal (0–100). */
  focalY: number;
  /** Ampliação a partir do ponto focal. 1 = sem zoom extra (default). */
  zoom?: number;
};

export type TransformationProject = {
  id: string;
  brandSlug: string;
  projectName: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  /** Omitir usa o centro sem zoom (`{ focalX: 50, focalY: 50, zoom: 1 }`). */
  framing?: TransformationFraming;
  modifications: string[];
  productionTime: string;
  materials: string[];
  description: string;
  callouts: TransformationCallout[];
};

export const TRANSFORMATION_PROJECTS: TransformationProject[] = [
  {
    id: "porsche-signature",
    brandSlug: "porsche",
    projectName: "Porsche — Edição Signature",
    before: porscheAntes,
    after: porscheDepois,
    beforeAlt: "Volante Porsche de série, em pele lisa preta",
    afterAlt: "Volante Porsche personalizado REDLINE, em fibra de carbono forjado e Alcântara",
    modifications: [
      "Revestimento substituído por Alcântara premium",
      "Aro em fibra de carbono forjado",
      "Costura manual tricolor preto / vermelho / branco",
      "Friso central em carbono com marcador vermelho",
      "Emblema REDLINE Performance",
    ],
    productionTime: "48 horas",
    materials: ["Fibra de Carbono Forjado", "Alcântara Premium", "Linha de Costura Tricolor"],
    description:
      "Mantivemos a geometria e os comandos originais intactos — o volante de série foi despido do revestimento e reconstruído à mão em fibra de carbono forjado e Alcântara, com costura tricolor e um friso central que assina cada detalhe.",
    callouts: [
      { id: "carbon", label: "Carbono Forjado", xPercent: 18, yPercent: 24, revealAt: 18 },
      { id: "stitch", label: "Costura Manual Tricolor", xPercent: 36, yPercent: 9, revealAt: 36 },
      { id: "badge", label: "Emblema REDLINE", xPercent: 50, yPercent: 88, revealAt: 50 },
      { id: "grip", label: "Pega em Alcântara", xPercent: 72, yPercent: 52, revealAt: 72 },
    ],
  },
  {
    id: "audi-signature",
    brandSlug: "audi",
    projectName: "Audi — Edição Signature",
    before: audiAntes,
    after: audiDepois,
    beforeAlt: "Volante Audi RS de série, em pele perfurada preta",
    afterAlt: "Volante Audi RS personalizado REDLINE, com friso LED, fibra de carbono e comandos integrados",
    modifications: [
      "Friso LED integrado no aro superior",
      "Fibra de carbono nas zonas de pega",
      "Costura em contraste vermelho",
      "Botões Drive Select e Start/Stop integrados",
    ],
    productionTime: "48 horas",
    materials: ["Fibra de Carbono", "Couro Perfurado", "Costura em Contraste"],
    description:
      "O volante RS de série ganhou um friso LED integrado no aro superior, fibra de carbono nas zonas de pega e os comandos Drive Select e Start/Stop ao alcance dos dedos — sem perder a ergonomia nem os comandos originais.",
    callouts: [
      { id: "carbon", label: "Fibra de Carbono", xPercent: 28, yPercent: 21, revealAt: 28 },
      { id: "stitch", label: "Costura em Contraste", xPercent: 41, yPercent: 39, revealAt: 41 },
      { id: "led", label: "Friso LED Integrado", xPercent: 49, yPercent: 4, revealAt: 49 },
      { id: "startstop", label: "Start/Stop Integrado", xPercent: 58, yPercent: 63, revealAt: 58 },
    ],
  },
];

export function getProjectForBrand(slug: string): TransformationProject | undefined {
  return TRANSFORMATION_PROJECTS.find((p) => p.brandSlug === slug);
}
