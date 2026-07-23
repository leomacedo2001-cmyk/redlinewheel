import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/lib/testimonials";

/**
 * Grelha premium de instalações reais — reaproveita as fotos e legendas já
 * usadas na secção "Comunidade REDLINE" (src/lib/testimonials.ts), a única
 * fonte de fotografias de clientes existente no projeto. Espaçamento e
 * proporção de imagem idênticos em todos os cartões (sem masonry): o efeito
 * premium vem da consistência, não da variação de tamanho.
 */
export function GalleryGrid() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {TESTIMONIALS.map((t, i) => (
        <figure
          key={t.id}
          className={`group relative aspect-[4/5] overflow-hidden bg-surface ${isInView ? "animate-fade-up" : "opacity-0"}`}
          style={isInView ? { animationDelay: `${Math.min(i, 11) * 45}ms` } : undefined}
        >
          <img
            src={t.image}
            alt={
              t.carModel
                ? `Instalação de volante REDLINE em ${t.carModel}, ${t.city}`
                : `Instalação de volante REDLINE, ${t.city}`
            }
            loading="lazy"
            decoding="async"
            width={720}
            height={900}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="text-sm font-semibold text-white">{t.name}</div>
            <div className="text-xs text-white/70">
              {t.carModel ? `${t.carModel} · ${t.city}` : t.city}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
