import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import heroTexture from "@/assets/configurator-showcase.jpg";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes — REDLINE Performance" },
      {
        name: "description",
        content: "Personalização, compatibilidade, entrega, garantia e pagamento — as respostas às dúvidas mais comuns sobre os volantes REDLINE.",
      },
      { property: "og:title", content: "Perguntas Frequentes — REDLINE Performance" },
      { property: "og:description", content: "Tudo o que precisas de saber antes de encomendar." },
      { property: "og:url", content: "/faqs" },
    ],
    links: [{ rel: "canonical", href: "/faqs" }],
  }),
  component: FaqsPage,
});

const GROUPS: { title: string; items: { question: string; answer: string }[] }[] = [
  {
    title: "Personalização",
    items: [
      {
        question: "Como escolho os materiais do meu volante?",
        answer:
          "Através do nosso Configurador podes combinar Alcântara, pele premium e fibra de carbono, escolher cores de costura, patilhas e outros acabamentos em tempo real, antes de encomendar.",
      },
      {
        question: "Posso enviar o meu próprio volante para personalizar?",
        answer:
          "Sim. Depois de confirmares a encomenda, enviamos-te instruções detalhadas para nos fazeres chegar o volante em segurança. Tratamos de tudo a partir daí.",
      },
      {
        question: "Quanto tempo demora a produção?",
        answer:
          "Entre 10 e 15 dias úteis, dependendo da complexidade da combinação escolhida. Combinações com múltiplos materiais ou LED podem demorar um pouco mais.",
      },
    ],
  },
  {
    title: "Compatibilidade",
    items: [
      {
        question: "A personalização afeta o airbag ou a eletrónica original?",
        answer:
          "Não. Toda a eletrónica, comandos e o sistema de airbag são preservados e reinstalados com testes de compatibilidade completos — a segurança nunca é comprometida.",
      },
      {
        question: "Com que marcas e modelos trabalham?",
        answer:
          "Trabalhamos com BMW, Mercedes-AMG, Audi RS, Porsche, Cupra, Tesla e muitas outras marcas. Se não encontrares o teu modelo, contacta-nos — trabalhamos sob consulta.",
      },
    ],
  },
  {
    title: "Entrega & Garantia",
    items: [
      {
        question: "Para onde enviam?",
        answer: "Enviamos para toda a Europa, com embalagem reforçada e envio sempre rastreado, porta a porta.",
      },
      {
        question: "Que garantia têm os volantes REDLINE?",
        answer:
          "Todos os volantes têm 2 anos de garantia premium, cobrindo defeitos de fabrico em materiais, costuras e reintegração eletrónica. Consulta a página de Garantia para todos os detalhes.",
      },
    ],
  },
  {
    title: "Pagamento",
    items: [
      {
        question: "Que métodos de pagamento aceitam?",
        answer: "Cartão de crédito/débito e as principais carteiras digitais, processados de forma segura no checkout.",
      },
      {
        question: "Posso pedir fatura com IVA?",
        answer: "Sim, todas as encomendas incluem fatura com IVA discriminado, enviada automaticamente por email após a compra.",
      },
    ],
  },
];

function FaqsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Ainda Tens Dúvidas?"
        title="Perguntas Frequentes."
        lead="Reunimos as dúvidas mais comuns sobre personalização, compatibilidade, entrega e garantia. Não encontraste o que procuravas? Fala connosco diretamente."
        texture={heroTexture}
      />

      <div className="container-premium max-w-3xl py-16 md:py-24">
        <div className="space-y-14">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary">{group.title}</h2>
              <Accordion type="single" collapsible className="w-full">
                {group.items.map((item, i) => (
                  <AccordionItem key={item.question} value={`${group.title}-${i}`} className="border-border/60">
                    <AccordionTrigger className="text-left text-base hover:text-primary">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
