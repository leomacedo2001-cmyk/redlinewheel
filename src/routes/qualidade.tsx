import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Cog, Gem, Hammer, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";

import heroTexture from "@/assets/product-carbono.jpg";

export const Route = createFileRoute("/qualidade")({
  head: () => ({
    meta: [
      { title: "Qualidade — REDLINE Performance" },
      {
        name: "description",
        content: "Materiais certificados, fabrico sem atalhos e testes rigorosos — o padrão de qualidade por trás de cada volante REDLINE.",
      },
      { property: "og:title", content: "Qualidade — REDLINE Performance" },
      { property: "og:description", content: "O nosso padrão de excelência, explicado em detalhe." },
      { property: "og:url", content: "/qualidade" },
    ],
    links: [{ rel: "canonical", href: "/qualidade" }],
  }),
  component: QualidadePage,
});

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

const HEX_CLIP = "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)";

function HexIcon({ icon: Icon }: { icon: LucideIcon }) {
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

function QualidadePage() {
  return (
    <div>
      <PageHero
        eyebrow="Padrão de Excelência"
        title="Qualidade em Cada Detalhe."
        lead="A qualidade REDLINE não é um slogan — é um processo verificável, em seis pilares, aplicado a cada volante que sai da nossa oficina."
        texture={heroTexture}
      />

      <div className="container-premium py-16 md:py-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ icon, title, description }) => (
            <div
              key={title}
              className="group relative isolate flex h-full min-h-[220px] flex-col gap-6 rounded-sm border border-white/10 bg-[rgb(12,12,12)] p-8 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-primary/50 hover:bg-[rgb(18,18,18)] hover:shadow-[0_24px_48px_-28px_oklch(0.58_0.22_25_/_0.35)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle at 30% 15%, oklch(0.58 0.22 25 / 0.08), transparent 65%)",
                }}
              />
              <HexIcon icon={icon} />
              <div>
                <h2 className="text-base font-semibold text-foreground/90 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-foreground/70">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
