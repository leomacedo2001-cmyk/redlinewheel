import paddleRubberBlue from "@/assets/paddle-shift-rubber-blue-1.jpg";
import paddleCarbonBlue from "@/assets/paddle-shift-carbon-blue-1.jpg";

export type AccessorySpec = { label: string; value: string };

export type Accessory = {
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  img: string;
  gallery?: string[];
  /** Texto livre de compatibilidade — acessórios não seguem o modelo marca→modelo dos volantes. */
  fitment: string;
  specs?: AccessorySpec[];
  sku?: string;
  price?: { amount: number; currency: string };
  status?: "Disponível" | "Sob Encomenda" | "Em Breve";
  shopifyHandle: string;
};

export const ACCESSORIES: Accessory[] = [
  {
    slug: "patilhas-borracha-azul",
    name: "Patilhas de Mudança REDLINE — Borracha Azul",
    description: "Patilhas de mudança em alumínio com grip em borracha azul perfurada.",
    longDescription:
      "Patilhas de mudança REDLINE em alumínio CNC, com inserto em borracha azul perfurada para máxima aderência em condução dinâmica. Encaixe por clipe sobre a patilha OEM, sem furar nem modificar o volante original.",
    img: paddleRubberBlue,
    gallery: [paddleRubberBlue],
    fitment: "Encaixe universal por clipe sobre patilhas OEM. Confirmar compatibilidade exata com o volante antes da compra.",
    specs: [
      { label: "Material", value: "Alumínio + Grip Borracha" },
      { label: "Cor", value: "Azul" },
      { label: "Montagem", value: "Clipe sobre patilha OEM" },
      { label: "Par", value: "2 unidades (esquerda + direita)" },
    ],
    sku: "RL-ACC-PADDLE-RB",
    price: { amount: 129, currency: "EUR" },
    status: "Sob Encomenda",
    shopifyHandle: "acessorios-patilhas-borracha-azul",
  },
  {
    slug: "patilhas-carbono-azul",
    name: "Patilhas de Mudança REDLINE — Fibra de Carbono Azul",
    description: "Patilhas de mudança em fibra de carbono real com marca +/- azul.",
    longDescription:
      "Patilhas de mudança REDLINE em fibra de carbono real (weave visível), com marcação +/- em azul. Encaixe por clipe sobre a patilha OEM, sem furar nem modificar o volante original. Acabamento de assinatura REDLINE.",
    img: paddleCarbonBlue,
    gallery: [paddleCarbonBlue],
    fitment: "Encaixe universal por clipe sobre patilhas OEM. Confirmar compatibilidade exata com o volante antes da compra.",
    specs: [
      { label: "Material", value: "Fibra de Carbono" },
      { label: "Detalhe", value: "Marca +/- Azul" },
      { label: "Montagem", value: "Clipe sobre patilha OEM" },
      { label: "Par", value: "2 unidades (esquerda + direita)" },
    ],
    sku: "RL-ACC-PADDLE-CB",
    price: { amount: 159, currency: "EUR" },
    status: "Sob Encomenda",
    shopifyHandle: "acessorios-patilhas-carbono-azul",
  },
];

export function getAccessory(slug: string): Accessory | undefined {
  return ACCESSORIES.find((a) => a.slug === slug);
}
