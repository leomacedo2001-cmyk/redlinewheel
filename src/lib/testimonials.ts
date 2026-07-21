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

/**
 * ⚠️ CONTEÚDO DE EXEMPLO — nomes, localizações, classificações e reviews
 * abaixo são fictícios (não existem dados reais de clientes associados a
 * estas fotos). Servem para ilustrar o design do cartão de testemunho.
 * Substituir por reviews reais dos clientes antes de publicar como genuíno
 * — basta editar os campos abaixo, o componente não precisa de alterações.
 *
 * `carModel` é intencionalmente omitido sempre que o modelo do carro não é
 * determinável com elevada confiança só a partir da foto do volante (sem
 * crachá exterior visível, muitas gerações partilham o mesmo interior — ex.
 * BMW Série 3/4, Audi S4/S5). Nunca adivinhar aqui: o cartão já foi desenhado
 * para ficar bem com ou sem esta etiqueta.
 */

export type Testimonial = {
  id: string;
  image: string;
  name: string;
  city: string;
  country: string;
  rating: number; // 1–5
  review: string;
  carModel?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t01",
    image: feedback01,
    name: "Miguel Santos",
    city: "Porto",
    country: "Portugal",
    rating: 5,
    review: "O acabamento em carbono e a costura tricolor ficaram impecáveis — parece ter saído assim da fábrica. As patilhas dão um toque desportivo incrível a conduzir de noite.",
  },
  {
    id: "t02",
    image: feedback02,
    name: "Lukas Hoffmann",
    city: "Munique",
    country: "Alemanha",
    rating: 5,
    review: "Encaixou perfeitamente no airbag original, sem qualquer folga. A combinação de carbono com pele perfurada ficou muito mais premium do que o volante de série.",
  },
  {
    id: "t03",
    image: feedback03,
    name: "Sophie Laurent",
    city: "Lyon",
    country: "França",
    rating: 5,
    review: "A pele perfurada dá uma aderência ótima às mãos, mesmo em viagens mais longas. Escolhi a costura tricolor e o resultado superou o que estava à espera.",
  },
  {
    id: "t04",
    image: feedback04,
    name: "Jan Kowalski",
    city: "Varsóvia",
    country: "Polónia",
    rating: 4,
    review: "O padrão do carbono ficou único, não há dois volantes iguais. As patilhas deram um upgrade enorme à sensação de trocar de mudanças.",
  },
  {
    id: "t05",
    image: feedback05,
    name: "Marco Rossi",
    city: "Milão",
    country: "Itália",
    rating: 5,
    review: "Só de pegar no volante já se sente a diferença de qualidade — o acabamento do carbono e da pele é mesmo de outro nível.",
  },
  {
    id: "t06",
    image: feedback06,
    name: "Emma van Dijk",
    city: "Roterdão",
    country: "Países Baixos",
    rating: 5,
    review: "Tiraram-me todas as dúvidas antes de avançar com a encomenda e o resultado final ficou exatamente como tínhamos combinado.",
  },
  {
    id: "t07",
    image: feedback07,
    name: "Andrius Petrauskas",
    city: "Vilnius",
    country: "Lituânia",
    rating: 5,
    review: "Chegou muito bem embalado e mais depressa do que estava à espera. Mal vi o volante já queria instalar naquela mesma noite.",
  },
  {
    id: "t08",
    image: feedback08,
    name: "Klara Nováková",
    city: "Praga",
    country: "Chéquia",
    rating: 5,
    review: "Pedi um azul bem vivo a condizer com o resto do interior e ficou exatamente na tonalidade que eu queria. Reparam sempre quando param ao meu lado no semáforo.",
  },
  {
    id: "t09",
    image: feedback09,
    name: "David Murphy",
    city: "Dublin",
    country: "Irlanda",
    rating: 4,
    review: "Mantiveram o espírito GTI com a costura vermelha e o carbono a condizer com os bancos axadrezados. Ficou perfeito com o resto do interior.",
    carModel: "Volkswagen Golf GTI",
  },
  {
    id: "t10",
    image: feedback10,
    name: "Elena Popescu",
    city: "Bucareste",
    country: "Roménia",
    rating: 5,
    review: "O LED de mudança de caixa dá uma sensação de cockpit de competição incrível, mesmo numa estrada tranquila. Foi o pormenor que mais me impressionou.",
  },
  {
    id: "t11",
    image: feedback11,
    name: "Nikolas Papadopoulos",
    city: "Atenas",
    country: "Grécia",
    rating: 5,
    review: "Pedi para combinar a costura com a luz ambiente do carro e ficaram atentos a esse pormenor todo. Sempre que entro no carro à noite fico ainda mais satisfeito com a escolha.",
  },
  {
    id: "t12",
    image: feedback12,
    name: "Freja Larsen",
    city: "Copenhaga",
    country: "Dinamarca",
    rating: 5,
    review: "A pele tem um toque excelente e o azul do centro do volante ficou muito bem conseguido — nem parece um acabamento personalizado à parte.",
  },
  {
    id: "t13",
    image: feedback13,
    name: "Sebastian Wagner",
    city: "Viena",
    country: "Áustria",
    rating: 5,
    review: "Os botões M1 e M2 ficaram perfeitamente integrados e a resposta ao volante é imediata. Sinto-me muito mais confiante a conduzir em modo desportivo.",
  },
  {
    id: "t14",
    image: feedback14,
    name: "Camille Dubois",
    city: "Bruxelas",
    country: "Bélgica",
    rating: 5,
    review: "A costura branca sobre o cinzento ficou um contraste elegante que não vejo em mais nenhum carro por aí. Trabalho de costura impecável, ponto a ponto.",
  },
  {
    id: "t15",
    image: feedback15,
    name: "Oskar Lindqvist",
    city: "Estocolmo",
    country: "Suécia",
    rating: 4,
    review: "Veio protegido com filme e espuma em cada canto, chegou sem um único risco. Dá para perceber logo que tratam o produto a sério.",
  },
  {
    id: "t16",
    image: feedback16,
    name: "Thomas Keller",
    city: "Zurique",
    country: "Suíça",
    rating: 5,
    review: "Mostraram-me fotos de cada fase da montagem antes de aplicarem a pele. Só a estrutura em carbono já parecia mais robusta do que o volante original.",
  },
  {
    id: "t17",
    image: feedback17,
    name: "James Whitfield",
    city: "Manchester",
    country: "Reino Unido",
    rating: 5,
    review: "As patilhas por si só já mudam a sensação ao volante. Vieram com um acabamento em carbono impecável, sem qualquer folga ao encaixar.",
  },
  {
    id: "t18",
    image: feedback18,
    name: "Iker Fernández",
    city: "Madrid",
    country: "Espanha",
    rating: 5,
    review: "O emblema RS e o carbono deram um ar muito mais agressivo ao interior, sem exagerar. Ainda hoje me apanho a olhar para o volante parado nos semáforos.",
  },
];
