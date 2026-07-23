import { createFileRoute } from "@tanstack/react-router";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { TESTIMONIALS } from "@/lib/testimonials";

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
          {TESTIMONIALS.length} instalações REDLINE em carros reais de clientes, por toda a Europa —
          artesanato, precisão e acabamento premium, fotografados no lugar onde importam: ao volante.
        </p>
      </header>

      <GalleryGrid />
    </div>
  );
}
