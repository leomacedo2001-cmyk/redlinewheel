import { createFileRoute } from "@tanstack/react-router";
import { Cog, Gem, Hammer, MessageCircle, PackageCheck, Wrench, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";

import heroTexture from "@/assets/engineering-showcase.jpg";

export const Route = createFileRoute("/processo")({
  head: () => ({
    meta: [
      { title: "O Nosso Processo — REDLINE Performance" },
      {
        name: "description",
        content: "Da consulta inicial à entrega — como cada volante REDLINE é desenhado, construído e testado à mão em Portugal.",
      },
      { property: "og:title", content: "O Nosso Processo — REDLINE Performance" },
      {
        property: "og:description",
        content: "Seis etapas, o mesmo rigor de sempre: como nasce um volante REDLINE.",
      },
      { property: "og:url", content: "/processo" },
    ],
    links: [{ rel: "canonical", href: "/processo" }],
  }),
  component: ProcessoPage,
});

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MessageCircle,
    title: "Consulta & Design",
    description:
      "Conversamos sobre o teu carro, o teu estilo de condução e a estética que procuras. Definimos juntos materiais, cores, costuras e acabamentos — nada é escolhido de um catálogo genérico.",
  },
  {
    icon: Gem,
    title: "Seleção de Materiais",
    description:
      "Alcântara, pele premium e fibra de carbono são escolhidos peça a peça junto de fornecedores certificados. Cada rolo e cada folha é inspecionado antes de entrar em produção.",
  },
  {
    icon: Wrench,
    title: "Desmontagem & Preparação",
    description:
      "O teu volante original é desmontado com extremo cuidado. Toda a eletrónica, airbag e comandos OEM são preservados e catalogados para a reinstalação exata.",
  },
  {
    icon: Hammer,
    title: "Fabrico Artesanal",
    description:
      "Cada camada é cortada, cosida e moldada à mão por artesãos especializados. Sem produção em massa, sem atalhos — o mesmo nível de exigência que aplicamos aos nossos próprios carros.",
  },
  {
    icon: Cog,
    title: "Reintegração Eletrónica",
    description:
      "Botões, comandos de som, patilhas e airbag são reinstalados e testados um a um, garantindo 100% de compatibilidade eletrónica e mecânica com o veículo original.",
  },
  {
    icon: PackageCheck,
    title: "Controlo de Qualidade & Entrega",
    description:
      "Uma inspeção final rigorosa confirma acabamento, ajuste e funcionamento. O volante segue depois embalado com proteção reforçada, com envio rastreado para toda a Europa.",
  },
];

/** Mesmo motivo hexagonal usado em "A Diferença REDLINE" — dá continuidade
 * visual entre a homepage e esta página sem reinventar um novo ícone. */
const HEX_CLIP = "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)";

function HexBadge({ icon: Icon, index }: { icon: LucideIcon; index: number }) {
  return (
    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <span className="absolute inset-0 bg-primary/55" style={{ clipPath: HEX_CLIP }} />
      <span className="absolute inset-[1.5px] bg-background" style={{ clipPath: HEX_CLIP }} />
      <Icon strokeWidth={1.5} className="relative h-6 w-6 text-primary" />
      <span className="absolute -bottom-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
        {index + 1}
      </span>
    </span>
  );
}

function ProcessoPage() {
  return (
    <div>
      <PageHero
        eyebrow="Da Ideia ao Volante"
        title="O Nosso Processo."
        lead="Cada volante REDLINE passa pelas mesmas seis etapas — sem atalhos, sem produção em massa. É assim que garantimos que cada peça sai da oficina exatamente como foi desenhada."
        texture={heroTexture}
      />

      <div className="container-premium max-w-3xl py-16 md:py-24">
        <ol className="relative space-y-14">
          <div aria-hidden="true" className="absolute left-7 top-7 bottom-7 hidden w-px bg-border/60 sm:block" />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-6 sm:gap-8">
              <HexBadge icon={step.icon} index={i} />
              <div className="pt-2">
                <h2 className="text-xl font-semibold">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
