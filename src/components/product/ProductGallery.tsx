import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const next = () => setActive((a) => (a + 1) % images.length);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  if (!images.length) {
    return <div className="aspect-square bg-surface flex items-center justify-center text-muted-foreground">Sem imagem</div>;
  }

  return (
    <>
      <div>
        <div
          ref={imgRef}
          className="aspect-square bg-surface overflow-hidden mb-3 relative group cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoom({ x: 50, y: 50 })}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={`${alt} — vista ${active + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-cover"
              style={
                zoom
                  ? {
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      transform: "scale(2)",
                      transition: "transform 0.15s ease-out",
                    }
                  : undefined
              }
            />
          </AnimatePresence>

          <button
            type="button"
            aria-label="Ver em ecrã completo"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(true);
            }}
            className="absolute top-3 right-3 bg-background/70 backdrop-blur p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <Expand className="h-4 w-4" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Imagem anterior"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Próxima imagem"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((g, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Ver imagem ${i + 1}`}
                className={`aspect-square bg-surface overflow-hidden border-2 transition-colors ${
                  i === active ? "border-primary" : "border-transparent hover:border-border"
                }`}
              >
                <img src={g} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setLightbox(false)}
              className="absolute top-6 right-6 p-3 hover:bg-surface transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Imagem anterior"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 hover:bg-surface transition-colors z-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  aria-label="Próxima imagem"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 hover:bg-surface transition-colors z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <motion.img
              key={active}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              src={images[active]}
              alt={`${alt} — vista ${active + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-wider text-muted-foreground">
              {active + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
