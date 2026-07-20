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
 */

export type Testimonial = {
  id: string;
  image: string;
  name: string;
  city: string;
  country: string;
  rating: number; // 1–5
  review: string;
  carModel: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t01",
    image: feedback01,
    name: "Miguel Santos",
    city: "Porto",
    country: "Portugal",
    rating: 5,
    review: "Acabamento impecável e o ajuste ao airbag original ficou perfeito. Superou o que esperava.",
    carModel: "BMW M3 G80",
  },
  {
    id: "t02",
    image: feedback02,
    name: "Lukas Hoffmann",
    city: "Munique",
    country: "Alemanha",
    rating: 5,
    review: "Comunicação clara do início ao fim e entrega mais rápida do que esperava. Recomendo sem hesitar.",
    carModel: "Audi RS3 8Y",
  },
  {
    id: "t03",
    image: feedback03,
    name: "Sophie Laurent",
    city: "Lyon",
    country: "França",
    rating: 5,
    review: "A qualidade da Alcântara e das costuras é de outro nível. Parece ter saído de fábrica.",
    carModel: "Mercedes-AMG C63",
  },
  {
    id: "t04",
    image: feedback04,
    name: "Jan Kowalski",
    city: "Varsóvia",
    country: "Polónia",
    rating: 4,
    review: "Resultado final excelente, só demorou um pouco mais do que o previsto inicialmente.",
    carModel: "VW Golf 8 R",
  },
  {
    id: "t05",
    image: feedback05,
    name: "Marco Rossi",
    city: "Milão",
    country: "Itália",
    rating: 5,
    review: "Já tinha visto o trabalho deles nas redes sociais, mas ao vivo é ainda mais impressionante.",
    carModel: "Porsche 911 GT3",
  },
  {
    id: "t06",
    image: feedback06,
    name: "Emma van Dijk",
    city: "Roterdão",
    country: "Países Baixos",
    rating: 5,
    review: "Montagem simples, sem problemas elétricos, e o volante transformou por completo o cockpit.",
    carModel: "BMW M4 F82",
  },
  {
    id: "t07",
    image: feedback07,
    name: "Andrius Petrauskas",
    city: "Vilnius",
    country: "Lituânia",
    rating: 5,
    review: "Escolhi as cores todas ao pormenor e ficou exatamente como imaginei. Trabalho artesanal a sério.",
    carModel: "Audi RS6 C8",
  },
  {
    id: "t08",
    image: feedback08,
    name: "Klara Nováková",
    city: "Praga",
    country: "Chéquia",
    rating: 5,
    review: "Aderência muito melhor do que o volante original e um toque premium em cada detalhe.",
    carModel: "BMW M340i",
  },
  {
    id: "t09",
    image: feedback09,
    name: "David Murphy",
    city: "Dublin",
    country: "Irlanda",
    rating: 4,
    review: "Muito satisfeito com o resultado — a equipa foi flexível para ajustar a configuração a meio do processo.",
    carModel: "Mercedes-AMG A45 S",
  },
  {
    id: "t10",
    image: feedback10,
    name: "Elena Popescu",
    city: "Bucareste",
    country: "Roménia",
    rating: 5,
    review: "Segunda vez que compro à REDLINE e voltei a sair completamente satisfeita com o serviço.",
    carModel: "VW Golf 7 R",
  },
  {
    id: "t11",
    image: feedback11,
    name: "Nikolas Papadopoulos",
    city: "Atenas",
    country: "Grécia",
    rating: 5,
    review: "Perguntei imensas dúvidas antes de encomendar e responderam sempre com paciência e detalhe.",
    carModel: "Porsche 992 Carrera",
  },
  {
    id: "t12",
    image: feedback12,
    name: "Freja Larsen",
    city: "Copenhaga",
    country: "Dinamarca",
    rating: 5,
    review: "O carbono forjado ficou espetacular à luz do dia. Vale cada cêntimo investido.",
    carModel: "Audi TT RS",
  },
  {
    id: "t13",
    image: feedback13,
    name: "Sebastian Wagner",
    city: "Viena",
    country: "Áustria",
    rating: 5,
    review: "Embalagem cuidada, instruções claras e um volante que parece ter saído da fábrica da BMW.",
    carModel: "BMW X5 M",
  },
  {
    id: "t14",
    image: feedback14,
    name: "Camille Dubois",
    city: "Bruxelas",
    country: "Bélgica",
    rating: 5,
    review: "Fiquei impressionada com o nível de personalização possível. Não há duas peças iguais.",
    carModel: "Mercedes-AMG E63 S",
  },
  {
    id: "t15",
    image: feedback15,
    name: "Oskar Lindqvist",
    city: "Estocolmo",
    country: "Suécia",
    rating: 4,
    review: "Excelente relação qualidade-preço face a outras marcas europeias que também contactei.",
    carModel: "Audi RS5 B9",
  },
  {
    id: "t16",
    image: feedback16,
    name: "Thomas Keller",
    city: "Zurique",
    country: "Suíça",
    rating: 5,
    review: "Instalei eu mesmo em casa, sem qualquer complicação, e o resultado foi imediato.",
    carModel: "BMW M2",
  },
  {
    id: "t17",
    image: feedback17,
    name: "James Whitfield",
    city: "Manchester",
    country: "Reino Unido",
    rating: 5,
    review: "Já recomendei a REDLINE a três amigos do clube automóvel. É esse o nível de confiança.",
    carModel: "Porsche Macan GTS",
  },
  {
    id: "t18",
    image: feedback18,
    name: "Iker Fernández",
    city: "Madrid",
    country: "Espanha",
    rating: 5,
    review: "Do primeiro contacto até à entrega, senti sempre que estava a lidar com verdadeiros artesãos.",
    carModel: "BMW M5 F90",
  },
];
