import { createFileRoute } from "@tanstack/react-router";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — REDLINE Performance" },
      { name: "description", content: "Uma seleção visual de acabamentos, materiais e estilos REDLINE." },
      { property: "og:title", content: "Galeria — REDLINE Performance" },
      { property: "og:description", content: "Uma seleção visual de acabamentos, materiais e estilos REDLINE." },
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
        {/* "Configurações" e uma palavra longa: aos 48px do text-5xl nao cabia
            nos ~312px uteis a 360px e empurrava a pagina para 398px. Comeca em
            text-4xl e sobe a partir de sm; o tamanho em desktop nao muda. */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">Configurações REDLINE.</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Uma seleção visual de acabamentos, materiais e estilos para encontrares inspiração para o
          teu próximo volante.
        </p>
      </header>

      <GalleryGrid />
    </div>
  );
}
