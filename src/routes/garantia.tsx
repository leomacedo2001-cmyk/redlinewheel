import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, X } from "lucide-react";
import { PageHero } from "@/components/PageHero";

import heroTexture from "@/assets/custom-costuras-catalog.jpg";

export const Route = createFileRoute("/garantia")({
  head: () => ({
    meta: [
      { title: "Garantia — REDLINE Performance" },
      {
        name: "description",
        content: "2 anos de garantia premium em todos os volantes REDLINE. O que está coberto, o que não está, e como acionar a garantia.",
      },
      { property: "og:title", content: "Garantia — REDLINE Performance" },
      { property: "og:description", content: "O nosso compromisso depois da entrega." },
      { property: "og:url", content: "/garantia" },
    ],
    links: [{ rel: "canonical", href: "/garantia" }],
  }),
  component: GarantiaPage,
});

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

function GarantiaPage() {
  return (
    <div>
      <PageHero
        eyebrow="Compromisso REDLINE"
        title="Garantia Premium de 2 Anos."
        lead="Cada volante REDLINE é construído para durar. Se algo relacionado com o nosso fabrico não corresponder ao esperado, tratamos disso — sem burocracia."
        texture={heroTexture}
      />

      <div className="container-premium py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-sm border border-white/10 bg-[rgb(12,12,12)] p-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Check className="h-5 w-5 text-primary" /> O que está coberto
            </h2>
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
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <X className="h-5 w-5 text-muted-foreground" /> O que não está coberto
            </h2>
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
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Como acionar a garantia</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CLAIM_STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary font-bold text-primary">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
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
      </div>
    </div>
  );
}
