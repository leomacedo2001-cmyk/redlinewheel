import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre Nós — APEX Automotive" },
      { name: "description", content: "A APEX Automotive nasceu da paixão pelo setor automóvel. Construímos volantes premium personalizados em Portugal." },
      { property: "og:title", content: "Sobre Nós — APEX Automotive" },
      { property: "og:description", content: "A nossa história, missão e paixão pelo setor automóvel." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container-premium py-16 md:py-24 max-w-4xl">
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">A Nossa História</div>
      <h1 className="text-5xl md:text-6xl font-bold mb-12">Construído com paixão.<br />Entregue com precisão.</h1>

      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-lg leading-relaxed">
        <p>
          A APEX Automotive nasceu de uma obsessão: a perfeição na experiência de condução. Acreditamos que o volante é o ponto de contacto mais íntimo entre condutor e máquina — e merece ser tratado como tal.
        </p>
        <p>
          Desde 2020 desenhamos e construímos à mão volantes personalizados para entusiastas em toda a Europa. Trabalhamos com BMW, Mercedes-AMG, Audi RS, Porsche, Cupra, Tesla e muitas outras marcas, oferecendo personalização total em materiais, cores e acabamentos.
        </p>
        <p>
          Cada peça é única. Cada cliente é tratado como um piloto. Cada detalhe — desde a costura à fibra de carbono polida — é executado com a mesma exigência que aplicamos aos nossos próprios carros.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 mt-16 pt-12 border-t border-border/60">
        {[
          { n: "500+", l: "Volantes entregues" },
          { n: "15+", l: "Países servidos" },
          { n: "2 anos", l: "Garantia premium" },
        ].map((s) => (
          <div key={s.l}>
            <div className="text-4xl font-bold text-primary">{s.n}</div>
            <div className="text-sm uppercase tracking-wider text-muted-foreground mt-2">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
