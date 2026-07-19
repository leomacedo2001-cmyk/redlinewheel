import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

type CategoryGalleryProps = {
  title: string;
  images: string[];
};

export function CategoryGallery({ title, images }: CategoryGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function showPrev(e?: React.MouseEvent) {
    e?.stopPropagation();
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }
  function showNext(e?: React.MouseEvent) {
    e?.stopPropagation();
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <section className="border-t border-border/60">
      <div className="container-premium py-16 md:py-24">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Galeria</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-10">{title} em detalhe</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-square overflow-hidden bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
              aria-label={`Ampliar imagem ${i + 1} de ${title}`}
            >
              <img
                src={src}
                alt={`${title} — detalhe ${i + 1}`}
                loading="lazy"
                decoding="async"
                width={1024}
                height={1024}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
                <Expand className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-4xl border-border/60 bg-background p-0 overflow-hidden">
          {activeIndex !== null && (
            <div className="relative aspect-square md:aspect-video bg-surface">
              <img
                src={images[activeIndex]}
                alt={`${title} — detalhe ${activeIndex + 1}`}
                className="w-full h-full object-contain"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label="Imagem anterior"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-primary hover:text-primary-foreground p-2 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Próxima imagem"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-primary hover:text-primary-foreground p-2 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
