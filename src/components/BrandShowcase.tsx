import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { BRANDS } from "@/lib/brands";

import bmwIcon from "@/assets/brand-icons/bmw.png";
import audiIcon from "@/assets/brand-icons/audi.png";
import volkswagenIcon from "@/assets/brand-icons/volkswagen.png";
import mercedesIcon from "@/assets/brand-icons/mercedes-benz.png";
import porscheIcon from "@/assets/brand-icons/porsche.png";
import toyotaIcon from "@/assets/brand-icons/toyota.png";
import teslaIcon from "@/assets/brand-icons/tesla.png";

/**
 * "Outras Marcas" não é uma marca real — fica sempre com o ícone genérico
 * (ver mais abaixo), nunca com uma ilustração própria.
 */
const BRAND_ICONS: Partial<Record<string, string>> = {
  bmw: bmwIcon,
  audi: audiIcon,
  volkswagen: volkswagenIcon,
  "mercedes-benz": mercedesIcon,
  porsche: porscheIcon,
  toyota: toyotaIcon,
  tesla: teslaIcon,
};

function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function BrandShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-border/60 bg-surface/50 py-16 md:py-20">
      <div className="container-premium">
        <div className={`text-center mb-10 md:mb-12 ${isInView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Marcas</div>
          <h2 className="text-3xl md:text-4xl font-bold">Escolhe a Tua Marca</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {BRANDS.map((b, i) => {
            const icon = BRAND_ICONS[b.slug];
            return (
              <Link
                key={b.slug}
                to="/brand/$slug"
                params={{ slug: b.slug }}
                aria-label={`Ver volantes compatíveis com ${b.name}`}
                className={`group relative aspect-square bg-background border border-border/60 hover:border-primary/50 flex flex-col items-center justify-center gap-4 p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                  isInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: isInView ? `${i * 60}ms` : undefined }}
              >
                <div className="h-14 md:h-16 flex items-center justify-center">
                  {icon ? (
                    <img
                      src={icon}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-auto object-contain opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                  ) : b.slug === "outras-marcas" ? (
                    <div className="h-12 w-12 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground transition-colors duration-500 group-hover:border-primary/50 group-hover:text-primary">
                      <Plus className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full border border-border/60 bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold transition-colors duration-500 group-hover:border-primary/50">
                      {initials(b.name)}
                    </div>
                  )}
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-500 group-hover:text-primary">
                  {b.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
