import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ShieldCheck, SlidersHorizontal, ShoppingCart, ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AmbientGlow } from "@/components/AmbientGlow";

/**
 * "Como funciona" — os quatro passos entre descobrir um volante e encomendar.
 *
 * Descreve o fluxo QUE JÁ EXISTE, não um novo: escolher da coleção ou entrar
 * direto no configurador (passo 01), a confirmação de compatibilidade que a
 * ficha faz antes da compra (02, ver CompatibilityDialog), personalizar a
 * partir do volante apresentado (03, ver configuratorPrefill) e encomendar
 * (04). Sem prazos, percentagens, stock ou garantias — nada que o projeto não
 * tenha confirmado.
 *
 * Visual: mesma linguagem das restantes secções — eyebrow com o ponto vermelho,
 * halos de luz nas arestas, cartões separados por fios de 1px (o mesmo idioma
 * `gap-px bg-border` da lista de compatibilidades) e os CTAs idênticos aos do
 * hero. Ícones do lucide-react já usados noutras páginas do site.
 */

type Step = {
  n: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    icon: Search,
    title: "Escolhe",
    description: "Seleciona um volante da coleção ou começa diretamente pelo configurador.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Confirma o teu automóvel",
    description: "Indica marca, modelo, ano e geração para validarmos a compatibilidade.",
  },
  {
    n: "03",
    icon: SlidersHorizontal,
    title: "Personaliza",
    description: "Mantém a configuração apresentada ou altera materiais, acabamentos e opções disponíveis.",
  },
  {
    n: "04",
    icon: ShoppingCart,
    title: "Encomenda",
    description: "Revê a configuração final e avança com a tua encomenda.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className="relative isolate overflow-hidden scroll-mt-24 border-t border-border/60 bg-background py-20 md:py-24"
    >
      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />

      <div className="container-premium relative">
        <header className="mb-12 md:mb-14">
          <SectionEyebrow className="mb-3">Como funciona</SectionEyebrow>
          <h2 className="text-4xl md:text-5xl font-bold">Do teu carro à configuração final.</h2>
        </header>

        <ol className="grid grid-cols-1 gap-px border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.n}
                className={`group relative min-w-0 bg-surface p-6 transition-colors duration-500 hover:bg-surface-elevated md:p-7 ${
                  isInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={isInView ? { animationDelay: `${i * 90}ms` } : undefined}
              >
                {/* friso técnico — acende no hover, mesma linguagem dos cartões da galeria */}
                <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-primary to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />

                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold tabular-nums tracking-tight text-primary">{step.n}</span>
                  <Icon className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-colors duration-500 group-hover:text-primary" />
                </div>

                <h3 className="mb-2 text-lg font-bold leading-tight">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 rounded-none h-14 px-8 text-sm uppercase tracking-wider"
          >
            <Link to="/configurator">
              Configurar o meu volante <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-none h-14 px-8 text-sm uppercase tracking-wider border-foreground/30"
          >
            <Link to="/products">Ver modelos disponíveis</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
