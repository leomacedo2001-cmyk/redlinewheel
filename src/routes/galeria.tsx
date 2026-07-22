import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — REDLINE Performance" },
      { name: "description", content: "Instalações reais de volantes REDLINE, fotografadas em carros de clientes por toda a Europa." },
      { property: "og:title", content: "Galeria — REDLINE Performance" },
      { property: "og:description", content: "Instalações reais de volantes REDLINE, fotografadas em carros de clientes por toda a Europa." },
      { property: "og:url", content: "/galeria" },
    ],
    links: [{ rel: "canonical", href: "/galeria" }],
  }),
  component: GaleriaPage,
});

function GaleriaPage() {
  return (
    <div className="container-premium py-16 md:py-24">
      <header className="mb-12 border-b border-border/60 pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Galeria</div>
        <h1 className="text-5xl md:text-6xl font-bold">Instalações Reais.</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Uma coleção das melhores instalações REDLINE, em carros reais de clientes por toda a Europa.
        </p>
      </header>

      <div className="flex flex-col items-center gap-4 border border-dashed border-border/60 bg-surface/30 px-6 py-24 text-center">
        <Camera className="h-8 w-8 text-muted-foreground" />
        <div className="text-lg font-semibold">Em breve.</div>
        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
          Estamos a preparar a galeria completa de instalações REDLINE. Entretanto, espreita a comunidade na
          homepage.
        </p>
        <Button asChild variant="outline" className="mt-2 rounded-none h-11 px-6 text-xs uppercase tracking-wider border-foreground/30">
          <Link to="/" hash="comunidade">
            Ver Comunidade <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
