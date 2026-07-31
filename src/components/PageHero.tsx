import { SectionEyebrow } from "@/components/SectionEyebrow";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Textura macro já existente no repositório — nunca reconhecível como
   * objeto, só profundidade, mesmo mote de "A Diferença REDLINE". */
  texture: string;
};

/**
 * Cabeçalho partilhado pelas novas páginas do footer (Processo, Qualidade,
 * Garantia, FAQs) — mesma linguagem visual de "A Diferença REDLINE": preto
 * profundo, uma textura muito subtil, glow vermelho contido atrás do
 * título. Existe para estas 4 páginas lerem-se como a mesma família, em
 * vez de cada uma inventar o seu próprio tratamento.
 */
export function PageHero({ eyebrow, title, lead, texture }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] pt-32 pb-20 md:pt-40 md:pb-24">
      <img
        src={texture}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.05] blur-[6px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 42% 45% at 50% 30%, oklch(0.58 0.22 25 / 0.09) 0%, transparent 72%)",
        }}
      />
      <div className="container-premium relative z-10 max-w-3xl text-center">
        <SectionEyebrow align="center" className="mb-4 justify-center">
          {eyebrow}
        </SectionEyebrow>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{lead}</p>
      </div>
    </section>
  );
}
