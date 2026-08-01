import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Cog,
  Gem,
  Hammer,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/**
 * Página "Sobre" — junta o conteúdo que antes vivia em 5 páginas
 * separadas (/about, /processo, /qualidade, /garantia, /faqs) numa só,
 * com uma árvore de navegação fixa à esquerda (estilo loja de jogo: ◆
 * preenchido = secção ativa, ◇ contorno = inativa) que faz scroll suave
 * até cada secção. As 4 páginas antigas foram eliminadas — os links do
 * footer para elas passam a apontar para `/about#<âncora>`.
 */

const SECTIONS = [
  { id: "sobre-nos", label: "Sobre Nós" },
  { id: "processo", label: "O Nosso Processo" },
  { id: "qualidade", label: "Qualidade" },
  { id: "garantia", label: "Garantia" },
  { id: "faq", label: "FAQ" },
] as const;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre — REDLINE Performance" },
      {
        name: "description",
        content:
          "A nossa história, o processo de fabrico, os padrões de qualidade, a garantia premium e as perguntas mais frequentes — tudo sobre a REDLINE Performance.",
      },
      { property: "og:title", content: "Sobre — REDLINE Performance" },
      { property: "og:description", content: "História, processo, qualidade, garantia e FAQ — tudo num só lugar." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** ◆ / ◇ — mesma linguagem da árvore de navegação de referência. */
function TreeBullet({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-2.5 w-2.5 shrink-0 rotate-45 border transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active ? "border-primary bg-primary" : "border-muted-foreground/40 bg-transparent group-hover:border-foreground/60"
      }`}
    />
  );
}

function AboutTree({ activeId }: { activeId: string }) {
  return (
    <nav aria-label="Navegação da página Sobre" className="lg:sticky lg:top-28 lg:self-start">
      <ul className="space-y-5">
        {SECTIONS.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <button type="button" onClick={() => scrollToSection(s.id)} className="group flex items-center gap-3 text-left">
                <TreeBullet active={isActive} />
                <span
                  className={`text-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- Sobre Nós ---------- */

const STATS = [
  { n: "500+", l: "Volantes entregues" },
  { n: "15+", l: "Países servidos" },
  { n: "2 anos", l: "Garantia premium" },
];

/* ---------- O Nosso Processo ---------- */

const HEX_CLIP = "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)";

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

function ProcessoHexBadge({ icon: Icon, index }: { icon: LucideIcon; index: number }) {
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

/* ---------- Qualidade ---------- */

const PILLARS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Gem,
    title: "Materiais Certificados",
    description: "Alcântara, pele premium e fibra de carbono provenientes apenas de fornecedores certificados, selecionados folha a folha.",
  },
  {
    icon: Hammer,
    title: "Fabrico Sem Atalhos",
    description: "Cada volante é cosido e moldado à mão por artesãos especializados — nunca em série, nunca por máquinas automáticas.",
  },
  {
    icon: ShieldCheck,
    title: "Testes de Durabilidade",
    description: "Materiais e costuras são testados à tração, abrasão e exposição UV antes de qualquer peça chegar ao cliente.",
  },
  {
    icon: Cog,
    title: "Compatibilidade OEM Garantida",
    description: "Airbag, comandos e eletrónica original são sempre preservados e testados — zero compromissos na segurança.",
  },
  {
    icon: CheckCircle2,
    title: "Inspeção Peça a Peça",
    description: "Nenhum volante sai da oficina sem uma inspeção final individual de acabamento, ajuste e funcionamento.",
  },
  {
    icon: Sparkles,
    title: "Acabamento à Prova do Tempo",
    description: "Tratamentos anti-desgaste e costuras reforçadas garantem que o aspeto premium se mantém ano após ano.",
  },
];

function QualidadeHexIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-primary/0 blur-lg transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-primary/20"
      />
      <span className="absolute inset-0 bg-primary/55" style={{ clipPath: HEX_CLIP }} />
      <span
        className="absolute inset-[1.5px] bg-[rgb(12,12,12)] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[rgb(18,18,18)]"
        style={{ clipPath: HEX_CLIP }}
      />
      <Icon
        strokeWidth={1.5}
        className="relative h-5 w-5 text-primary/80 transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-3 group-hover:text-primary"
      />
    </span>
  );
}

/* ---------- Garantia ---------- */

const COVERED = [
  "Defeitos de fabrico em costuras, colagens e acabamentos",
  "Descolamento ou desgaste prematuro de materiais aplicados",
  "Falhas na reintegração de componentes eletrónicos OEM",
  "Desalinhamento ou folga resultante do processo de montagem",
];

const NOT_COVERED = [
  "Danos por acidente, impacto ou uso indevido",
  "Desgaste natural decorrente do uso normal ao longo dos anos",
  "Modificações ou reparações feitas fora da REDLINE",
  "Danos causados por exposição extrema (água, químicos, calor direto)",
];

const CLAIM_STEPS = [
  { title: "Contacta-nos", description: "Envia-nos uma mensagem através da página de contacto com o teu número de encomenda." },
  { title: "Envia fotos", description: "Descreve o problema e envia fotos claras da zona afetada — respondemos em menos de 24h." },
  { title: "Avaliação", description: "A nossa equipa avalia o caso e confirma se está coberto pela garantia premium." },
  { title: "Reparação ou Substituição", description: "Reparamos ou substituímos a peça sem custos adicionais, com o mesmo cuidado do fabrico original." },
];

/* ---------- FAQ ---------- */

const FAQ_GROUPS: { title: string; items: { question: string; answer: string }[] }[] = [
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
          "Todos os volantes têm 2 anos de garantia premium, cobrindo defeitos de fabrico em materiais, costuras e reintegração eletrónica. Consulta a secção de Garantia acima para todos os detalhes.",
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

function AboutPage() {
  const sobreRef = useRef<HTMLElement>(null);
  const processoRef = useRef<HTMLElement>(null);
  const qualidadeRef = useRef<HTMLElement>(null);
  const garantiaRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  const sobreInView = useInView(sobreRef, { margin: "-45% 0px -45% 0px" });
  const processoInView = useInView(processoRef, { margin: "-45% 0px -45% 0px" });
  const qualidadeInView = useInView(qualidadeRef, { margin: "-45% 0px -45% 0px" });
  const garantiaInView = useInView(garantiaRef, { margin: "-45% 0px -45% 0px" });
  const faqInView = useInView(faqRef, { margin: "-45% 0px -45% 0px" });

  const [activeId, setActiveId] = useState<string>("sobre-nos");

  useEffect(() => {
    if (sobreInView) setActiveId("sobre-nos");
    else if (processoInView) setActiveId("processo");
    else if (qualidadeInView) setActiveId("qualidade");
    else if (garantiaInView) setActiveId("garantia");
    else if (faqInView) setActiveId("faq");
  }, [sobreInView, processoInView, qualidadeInView, garantiaInView, faqInView]);

  return (
    <div className="container-premium py-16 md:py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr] lg:gap-16 xl:grid-cols-[300px_1fr]">
        <AboutTree activeId={activeId} />

        <div className="flex min-w-0 flex-col gap-24 md:gap-28">
          {/* Sobre Nós */}
          <section id="sobre-nos" ref={sobreRef} className="scroll-mt-24">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">A Nossa História</div>
            <h2 className="mb-8 text-4xl font-bold md:text-5xl">
              Construído com paixão.
              <br />
              Entregue com precisão.
            </h2>
            <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                A REDLINE Performance nasceu de uma obsessão: a perfeição na experiência de condução. Acreditamos que o volante é
                o ponto de contacto mais íntimo entre condutor e máquina — e merece ser tratado como tal.
              </p>
              <p>
                Desde 2020 desenhamos e construímos à mão volantes personalizados para entusiastas em toda a Europa. Trabalhamos
                com BMW, Mercedes-AMG, Audi RS, Porsche, Cupra, Tesla e muitas outras marcas, oferecendo personalização total em
                materiais, cores e acabamentos.
              </p>
              <p>
                Cada peça é única. Cada cliente é tratado como um piloto. Cada detalhe — desde a costura à fibra de carbono
                polida — é executado com a mesma exigência que aplicamos aos nossos próprios carros.
              </p>
            </div>
            <div className="mt-16 grid gap-8 border-t border-border/60 pt-12 sm:grid-cols-3">
              {STATS.map((s) => (
                <div key={s.l}>
                  <div className="text-4xl font-bold text-primary">{s.n}</div>
                  <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* O Nosso Processo */}
          <section id="processo" ref={processoRef} className="scroll-mt-24">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Da Ideia ao Volante</div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">O Nosso Processo.</h2>
            <p className="mb-12 max-w-2xl leading-relaxed text-muted-foreground">
              Cada volante REDLINE passa pelas mesmas seis etapas — sem atalhos, sem produção em massa. É assim que garantimos
              que cada peça sai da oficina exatamente como foi desenhada.
            </p>
            <ol className="relative space-y-14">
              <div aria-hidden="true" className="absolute bottom-7 left-7 top-7 hidden w-px bg-border/60 sm:block" />
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-6 sm:gap-8">
                  <ProcessoHexBadge icon={step.icon} index={i} />
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Qualidade */}
          <section id="qualidade" ref={qualidadeRef} className="scroll-mt-24">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Padrão de Excelência</div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Qualidade em Cada Detalhe.</h2>
            <p className="mb-12 max-w-2xl leading-relaxed text-muted-foreground">
              A qualidade REDLINE não é um slogan — é um processo verificável, em seis pilares, aplicado a cada volante que sai
              da nossa oficina.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {PILLARS.map(({ icon, title, description }) => (
                <div
                  key={title}
                  className="group relative isolate flex h-full min-h-[200px] flex-col gap-6 rounded-sm border border-white/10 bg-[rgb(12,12,12)] p-8 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-primary/50 hover:bg-[rgb(18,18,18)] hover:shadow-[0_24px_48px_-28px_oklch(0.58_0.22_25_/_0.35)]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
                    style={{ background: "radial-gradient(circle at 30% 15%, oklch(0.58 0.22 25 / 0.08), transparent 65%)" }}
                  />
                  <QualidadeHexIcon icon={icon} />
                  <div>
                    <h3 className="text-base font-semibold text-foreground/90 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-foreground/70">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Garantia */}
          <section id="garantia" ref={garantiaRef} className="scroll-mt-24">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Compromisso REDLINE</div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Garantia Premium de 2 Anos.</h2>
            <p className="mb-12 max-w-2xl leading-relaxed text-muted-foreground">
              Cada volante REDLINE é construído para durar. Se algo relacionado com o nosso fabrico não corresponder ao esperado,
              tratamos disso — sem burocracia.
            </p>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="rounded-sm border border-white/10 bg-[rgb(12,12,12)] p-8">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Check className="h-5 w-5 text-primary" /> O que está coberto
                </h3>
                <ul className="space-y-4">
                  {COVERED.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-sm border border-white/10 bg-[rgb(12,12,12)] p-8">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <X className="h-5 w-5 text-muted-foreground" /> O que não está coberto
                </h3>
                <ul className="space-y-4">
                  {NOT_COVERED.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-20">
              <h3 className="mb-10 text-center text-2xl font-bold md:text-3xl">Como acionar a garantia</h3>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {CLAIM_STEPS.map((step, i) => (
                  <div key={step.title} className="relative">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary font-bold text-primary">
                      {i + 1}
                    </div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 flex justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Falar Connosco <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" ref={faqRef} className="scroll-mt-24">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Ainda Tens Dúvidas?</div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Perguntas Frequentes.</h2>
            <p className="mb-12 max-w-2xl leading-relaxed text-muted-foreground">
              Reunimos as dúvidas mais comuns sobre personalização, compatibilidade, entrega e garantia. Não encontraste o que
              procuravas? Fala connosco diretamente.
            </p>
            <div className="space-y-14">
              {FAQ_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary">{group.title}</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {group.items.map((item, i) => (
                      <AccordionItem key={item.question} value={`${group.title}-${i}`} className="border-border/60">
                        <AccordionTrigger className="text-left text-base hover:text-primary">{item.question}</AccordionTrigger>
                        <AccordionContent className="leading-relaxed text-muted-foreground">{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
