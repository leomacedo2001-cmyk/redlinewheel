import { BRANDS, type Brand, type BrandModel } from "@/lib/brands";

// Fotos "hero" dedicadas (uma por categoria, já usadas no cartão do catálogo na home)
import customAlcantara from "@/assets/custom-alcantara-catalog.jpg";
import customPelePerfurada from "@/assets/custom-pele-perfurada-catalog.jpg";
import customCarbono from "@/assets/custom-carbono-catalog.jpg";
import customCosturas from "@/assets/custom-costuras-catalog.jpg";
import customLedShift from "@/assets/custom-led-shift-catalog.jpg";
import customPatilhas from "@/assets/custom-patilhas-catalog.jpg";
import customOemPlus from "@/assets/custom-oem-plus-catalog.jpg";

// Fotos de apoio para as galerias
import productAlcantara from "@/assets/product-alcantara.jpg";
import productPelePerfurada from "@/assets/product-pele-perfurada.jpg";
import productCarbono from "@/assets/product-carbono.jpg";
import productCosturas from "@/assets/product-costuras.jpg";
import productLedShift from "@/assets/product-led-shift.jpg";
import productPatilhas from "@/assets/product-patilhas.jpg";
import productOemPlus from "@/assets/product-oem-plus.jpg";
import productComponentesInterior from "@/assets/product-componentes-interior.jpg";

export type CategoryFAQItem = { question: string; answer: string };

export type CategoryPage = {
  /** Slug usado no URL: /produtos/{urlSlug} */
  urlSlug: string;
  title: string;
  tagline: string;
  /** Subtítulo curto exibido no hero, por baixo do título */
  subtitle: string;
  /** Texto de introdução (secção 2) */
  intro: string;
  heroImg: string;
  gallery: string[];
  benefits: string[];
  faq: CategoryFAQItem[];
  /** Slugs de modelos (em brands.ts) relacionados com esta categoria */
  relatedModelSlugs: string[];
  metaDescription: string;
};

// Processo — igual para todas as categorias (serviço único, configurador único)
export const PROCESS_STEPS = [
  "Escolha do modelo",
  "Escolha dos materiais",
  "Configuração",
  "Produção",
  "Controlo de qualidade",
  "Envio",
];

export const CATEGORY_PAGES: Record<string, CategoryPage> = {
  alcantara: {
    urlSlug: "alcantara",
    title: "Revestimento em Alcântara",
    tagline: "Aderência e toque premium",
    subtitle: "O material de eleição das edições M Performance, RS e AMG.",
    intro:
      "O revestimento em Alcântara oferece uma aderência superior, acabamento premium e um visual inspirado no motorsport. Aplicado à mão nas zonas de pegada do volante, é um dos materiais mais utilizados em modelos RS, M Performance, AMG e Porsche — e o preferido de quem procura o equilíbrio entre estética e desempenho ao volante.",
    heroImg: customAlcantara,
    gallery: [customAlcantara, productAlcantara, productCosturas, productOemPlus],
    benefits: [
      "Maior aderência em condução desportiva",
      "Toque premium e respirável",
      "Aparência motorsport autêntica",
      "Produção artesanal, aplicada à mão",
      "Disponível em várias tonalidades",
      "Combinável com pele ou fibra de carbono",
    ],
    faq: [
      {
        question: "A Alcântara é original?",
        answer:
          "Sim. Utilizamos apenas Alcântara genuína, o mesmo material certificado usado por fabricantes como BMW M, Mercedes-AMG e Porsche nas suas edições de fábrica.",
      },
      {
        question: "Como limpar o revestimento em Alcântara?",
        answer:
          "Recomendamos uma escova macia de cerdas sintéticas e um pano ligeiramente húmido para manchas pontuais. Evita produtos abrasivos ou álcool, que podem alterar a textura da fibra.",
      },
      {
        question: "Qual a durabilidade?",
        answer:
          "Com os devidos cuidados, a Alcântara mantém o aspeto original durante vários anos de uso diário, incluindo exposição solar directa — não perde cor nem textura como o couro sintético.",
      },
      {
        question: "Posso combinar Alcântara com Carbono?",
        answer:
          "Sim, é uma das combinações mais pedidas. O aro fica em Alcântara nas zonas de pegada (3 e 9 horas) e as secções superior/inferior em fibra de carbono.",
      },
      {
        question: "Quanto tempo demora a produção?",
        answer:
          "O prazo médio é de 10 a 15 dias úteis após confirmação do orçamento, dependendo da complexidade da combinação de materiais escolhida.",
      },
    ],
    relatedModelSlugs: [
      "f30-alcantara-signature",
      "w213-amg-edition1-signature",
      "b8-rs-blue-signature",
    ],
    metaDescription:
      "Revestimento em Alcântara genuína para volantes premium. Aderência superior, acabamento motorsport e produção artesanal. Compatível com BMW, Audi, Mercedes-AMG e Porsche.",
  },

  "pele-perfurada": {
    urlSlug: "pele-perfurada",
    title: "Revestimento em Pele Perfurada",
    tagline: "GT intemporal",
    subtitle: "Couro nappa perfurado para ventilação superior e estética GT.",
    intro:
      "O revestimento em pele perfurada combina o conforto do couro nappa europeu com a ventilação de uma perfuração a laser precisa. É a escolha clássica dos modelos GT e das gamas mais exclusivas da Mercedes-Benz, BMW e Audi — um acabamento intemporal, costurado à mão por mestres-artesãos.",
    heroImg: customPelePerfurada,
    gallery: [customPelePerfurada, productPelePerfurada, productCosturas, productCarbono],
    benefits: [
      "Couro nappa europeu de primeira qualidade",
      "Perfuração a laser uniforme e duradoura",
      "Toque macio sem abdicar de durabilidade",
      "Costuras à medida, feitas à mão",
      "Estética GT intemporal",
      "Produção artesanal com acabamento OEM+",
    ],
    faq: [
      {
        question: "A pele é original?",
        answer:
          "Utilizamos couro nappa importado da mesma origem europeia usada por fabricantes premium, com certificação de qualidade e testes de resistência ao desgaste.",
      },
      {
        question: "Como limpar o revestimento em pele perfurada?",
        answer:
          "Um pano macio ligeiramente húmido é suficiente para limpeza regular. Recomendamos um hidratante para couro a cada 2-3 meses para preservar a flexibilidade e evitar rachaduras.",
      },
      {
        question: "Qual a durabilidade?",
        answer:
          "A pele nappa de qualidade premium mantém-se em excelente estado durante muitos anos de uso, mesmo com exposição solar regular.",
      },
      {
        question: "Posso combinar pele perfurada com Alcântara?",
        answer:
          "Sim. É comum reservar a pele perfurada para as secções superior e inferior do aro, com Alcântara nas zonas de pegada lateral.",
      },
      {
        question: "Quanto tempo demora a produção?",
        answer: "Entre 10 e 15 dias úteis, dependendo da cor e do padrão de costura escolhidos.",
      },
    ],
    relatedModelSlugs: [
      "g20-blue-carbon-signature",
      "w213-amg-red-signature",
      "w205-amg-yellow-signature",
    ],
    metaDescription:
      "Revestimento em pele perfurada nappa para volantes premium. Ventilação superior, costura artesanal e estética GT. Compatível com Mercedes, BMW e Audi.",
  },

  carbono: {
    urlSlug: "fibra-de-carbono",
    title: "Acabamentos em Fibra de Carbono",
    tagline: "Twill e Forged",
    subtitle: "Leveza e detalhe motorsport ao nível Porsche e Ferrari.",
    intro:
      "Trabalhamos apenas com fibra de carbono real, pré-impregnada de grau aeronáutico, em tecelagem twill 2×2 ou forged (carbono forjado). O resultado é um acabamento leve, rígido e visualmente marcante — o mesmo padrão usado nas edições especiais Porsche Exclusive, BMW M e Ferrari.",
    heroImg: customCarbono,
    gallery: [customCarbono, productCarbono, productOemPlus, productLedShift],
    benefits: [
      "Carbono real pré-impregnado de aviação",
      "Acabamento UV-stable, brilhante ou mate",
      "Twill 2×2 ou forged à escolha",
      "Leveza sem comprometer rigidez",
      "Aparência motorsport de competição",
      "Aplicável no aro, inserções e trims",
    ],
    faq: [
      {
        question: "É carbono real ou vinil decalque?",
        answer:
          "É sempre fibra de carbono real, laminada e curada em autoclave — nunca vinil ou autocolante decorativo.",
      },
      {
        question: "Como limpar peças em fibra de carbono?",
        answer:
          "Um pano macio com um limpa-vidros suave é suficiente. Evita produtos abrasivos que possam riscar o verniz UV-stable.",
      },
      {
        question: "Qual a diferença entre twill e forged?",
        answer:
          "O twill 2×2 tem o padrão clássico entrançado; o forged (carbono forjado) tem um padrão marmoreado e é ainda mais resistente a impactos, com um visual mais exclusivo.",
      },
      {
        question: "Posso combinar carbono com Alcântara ou pele?",
        answer:
          "Sim — é a combinação mais popular. O carbono fica normalmente nas secções superior/inferior e nas patilhas, com Alcântara ou pele nas zonas de pegada.",
      },
      {
        question: "Quanto tempo demora a produção?",
        answer:
          "Entre 12 e 18 dias úteis, já que a cura do carbono exige um processo mais longo para garantir rigidez e acabamento perfeito.",
      },
    ],
    relatedModelSlugs: ["g-series-forged-magenta", "f-series-carbon-red", "991-carbon-signature"],
    metaDescription:
      "Acabamentos em fibra de carbono real (twill ou forged) para volantes premium. Leveza e acabamento motorsport ao nível Porsche e Ferrari.",
  },

  costuras: {
    urlSlug: "costuras-personalizadas",
    title: "Costuras Personalizadas",
    tagline: "Cor, ponto e padrão",
    subtitle: "Costura à mão por mestres-artesãos com acabamento OEM+.",
    intro:
      "Cada costura é feita à mão, ponto a ponto, por artesãos especializados. Escolhes a cor da linha, o tipo de ponto e o padrão — desde um contorno subtil até às icónicas combinações tricolor M — com um acabamento indistinguível de fábrica.",
    heroImg: customCosturas,
    gallery: [customCosturas, productCosturas, productOemPlus, productAlcantara],
    benefits: [
      "Mais de 30 cores de linha disponíveis",
      "Ponto duplo, cruzado ou tom-sobre-tom",
      "Costura manual em zonas críticas",
      "Combinações tricolor M ou personalizadas",
      "Acabamento indistinguível de fábrica",
      "Marcação central (12h) opcional",
    ],
    faq: [
      {
        question: "Posso escolher qualquer cor de linha?",
        answer:
          "Sim, trabalhamos com uma paleta de mais de 30 cores, incluindo as combinações tricolor M, AMG e RS, além de opções totalmente personalizadas.",
      },
      {
        question: "Como limpar uma costura personalizada?",
        answer:
          "Os cuidados são os mesmos do material de base (Alcântara, pele ou carbono) — um pano macio humedecido é suficiente para o dia a dia.",
      },
      {
        question: "Qual a durabilidade da costura?",
        answer:
          "Usamos linha de alta resistência à tração, própria para uso automóvel, com durabilidade equivalente à costura original de fábrica.",
      },
      {
        question: "Posso combinar costuras com Alcântara e Carbono?",
        answer:
          "Sim, a costura é sempre o último passo, aplicada sobre qualquer combinação de materiais que escolhas.",
      },
      {
        question: "Quanto tempo demora a produção?",
        answer:
          "A costura personalizada não acrescenta tempo adicional ao prazo normal de produção (10 a 15 dias úteis).",
      },
    ],
    relatedModelSlugs: [
      "g-series-forged-magenta",
      "w213-amg-forged-red-signature",
      "f30-alcantara-signature",
    ],
    metaDescription:
      "Costuras personalizadas à mão para volantes premium — cor, ponto e padrão à tua escolha, com acabamento OEM+ indistinguível de fábrica.",
  },

  "led-shift": {
    urlSlug: "volante-led",
    title: "Indicadores LED de Mudança de Caixa",
    tagline: "Cockpit de competição",
    subtitle: "Resposta imediata, inspirada nos cockpits de competição.",
    intro:
      "Uma barra sequencial de LEDs integrada no aro superior do volante, sincronizada com as rotações do motor — a mesma tecnologia usada nos cockpits WRC e GT. Um upgrade visual e funcional que transforma por completo a experiência ao volante.",
    heroImg: customLedShift,
    gallery: [customLedShift, productLedShift, productCarbono, productPatilhas],
    benefits: [
      "Barra de LEDs sequencial de alta visibilidade",
      "Sincronização precisa com o motor",
      "Integração OBD2 / CAN-bus",
      "Cores e limiares de rotação personalizáveis",
      "Instalação plug & play em modelos compatíveis",
      "Visual autêntico de cockpit de competição",
    ],
    faq: [
      {
        question: "É compatível com o meu carro?",
        answer:
          "A instalação plug & play está disponível para a maioria dos modelos BMW, Mercedes-AMG, Audi e Porsche mais recentes. Confirma a compatibilidade connosco antes de encomendar.",
      },
      {
        question: "Preciso de programação adicional?",
        answer:
          "Não — o sistema vem pré-configurado, mas os limiares de rotação e as cores podem ser ajustados depois da instalação, conforme a tua preferência.",
      },
      {
        question: "A instalação é reversível?",
        answer: "Sim, a instalação não altera a cablagem original do veículo de forma permanente.",
      },
      {
        question: "Posso combinar com patilhas e carbono?",
        answer:
          "Sim, é uma das combinações mais populares — LED no aro superior, patilhas em alumínio e trims em fibra de carbono.",
      },
      {
        question: "Quanto tempo demora a produção?",
        answer:
          "Entre 15 e 20 dias úteis, incluindo a integração e teste do sistema de LEDs antes do envio.",
      },
    ],
    relatedModelSlugs: [
      "g-series-forged-magenta",
      "w213-amg-forged-red-signature",
      "g20-blue-carbon-signature",
    ],
    metaDescription:
      "Indicadores LED de mudança de caixa para volantes premium. Barra sequencial sincronizada com o motor, inspirada em cockpits de competição WRC e GT.",
  },

  patilhas: {
    urlSlug: "patilhas",
    title: "Patilhas de Velocidade Premium",
    tagline: "Alumínio CNC anodizado",
    subtitle: "Maior alcance e ergonomia digna de um AMG GT.",
    intro:
      "Patilhas de mudança fabricadas em alumínio aeronáutico, maquinadas em CNC e anodizadas em várias cores. Um encaixe direto, sem cortes destrutivos, que melhora o alcance e a ergonomia das mudanças — ao nível de um AMG GT ou Porsche GT3.",
    heroImg: customPatilhas,
    gallery: [customPatilhas, productPatilhas, productCarbono, productOemPlus],
    benefits: [
      "Alumínio aeronáutico maquinado em CNC",
      "Anodização disponível em várias cores",
      "Encaixe direto, sem cortes destrutivos",
      "Maior alcance e ergonomia de mudança",
      "Compatibilidade ampla VAG / BMW / Mercedes",
      "Acabamento tátil premium",
    ],
    faq: [
      {
        question: "A instalação é destrutiva?",
        answer:
          "Não. As patilhas encaixam diretamente sobre as originais ou substituem-nas sem qualquer corte ou modificação permanente do volante.",
      },
      {
        question: "Que cores de anodização estão disponíveis?",
        answer:
          "Preto, prata, vermelho, azul e dourado são as opções mais pedidas — outras cores sob consulta.",
      },
      {
        question: "São compatíveis com o meu volante personalizado?",
        answer:
          "Sim, as patilhas são desenhadas para se integrar com qualquer combinação de materiais do teu volante REDLINE.",
      },
      {
        question: "Qual a durabilidade do alumínio anodizado?",
        answer:
          "A anodização é resistente ao desgaste diário e não desbota com a exposição solar, mantendo o acabamento original por muitos anos.",
      },
      {
        question: "Quanto tempo demora a produção?",
        answer: "Entre 7 e 12 dias úteis, já que as patilhas são maquinadas por encomenda.",
      },
    ],
    relatedModelSlugs: [
      "w205-amg-yellow-signature",
      "f30-mperf-blue-signature",
      "f-series-carbon-red",
    ],
    metaDescription:
      "Patilhas de velocidade premium em alumínio CNC anodizado para volantes desportivos. Maior alcance e ergonomia, compatibilidade ampla VAG, BMW e Mercedes.",
  },

  "oem-plus": {
    urlSlug: "oem-plus",
    title: "Personalização OEM+",
    tagline: "Parecem de fábrica — só que melhores",
    subtitle: "Iluminação ambiente, inserções e detalhes integrados.",
    intro:
      "OEM+ significa elevar o que já existe de fábrica, sem nunca comprometer a garantia ou a integração com airbag e sensores. Iluminação ambiente, inserções personalizadas e detalhes que parecem ter saído da linha de produção — só que exclusivos do teu carro.",
    heroImg: customOemPlus,
    gallery: [customOemPlus, productOemPlus, productComponentesInterior, productCosturas],
    benefits: [
      "Acabamento indistinguível do original de fábrica",
      "Sem cortes destrutivos no volante",
      "Compatível com airbag e sensores originais",
      "Documentação técnica fornecida",
      "Iluminação ambiente personalizável",
      "Inserções e detalhes exclusivos",
    ],
    faq: [
      {
        question: "A personalização OEM+ afeta a garantia?",
        answer:
          "Não. Todo o trabalho é feito de forma não destrutiva e compatível com airbag e sensores originais, preservando a garantia de fábrica sempre que possível.",
      },
      {
        question: "Que tipo de detalhes posso personalizar?",
        answer:
          "Iluminação ambiente, inserções em carbono ou metal, marcações personalizadas e outros detalhes que mantêm o aspeto de fábrica com um toque exclusivo.",
      },
      {
        question: "Recebo documentação técnica?",
        answer:
          "Sim, cada encomenda OEM+ inclui documentação técnica sobre os componentes e o processo de instalação utilizado.",
      },
      {
        question: "Posso combinar OEM+ com outras personalizações?",
        answer:
          "Sim, o OEM+ é frequentemente o passo final, combinado com Alcântara, carbono, costuras ou LED, consoante o que escolheres.",
      },
      {
        question: "Quanto tempo demora a produção?",
        answer: "Entre 10 e 20 dias úteis, dependendo da complexidade dos componentes escolhidos.",
      },
    ],
    relatedModelSlugs: [
      "w213-amg-edition1-signature",
      "b8-rs-blue-signature",
      "8y-carbon-signature",
    ],
    metaDescription:
      "Personalização OEM+ para volantes premium — iluminação ambiente, inserções e detalhes que parecem de fábrica, só que melhores.",
  },
};

/** Resolve os modelos (brand + model) relacionados com uma categoria, a partir dos slugs configurados. */
export function getRelatedModels(category: CategoryPage): { brand: Brand; model: BrandModel }[] {
  const map = new Map<string, { brand: Brand; model: BrandModel }>();
  for (const brand of BRANDS) {
    for (const model of brand.models) {
      map.set(model.slug, { brand, model });
    }
  }
  return category.relatedModelSlugs
    .map((slug) => map.get(slug))
    .filter((x): x is { brand: Brand; model: BrandModel } => Boolean(x));
}

/** Mapa inverso: urlSlug (usado em /produtos/:slug) -> chave interna em CATEGORY_PAGES */
export const URL_SLUG_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_PAGES).map(([key, cat]) => [cat.urlSlug, key]),
);
