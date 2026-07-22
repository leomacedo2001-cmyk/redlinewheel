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
 * "Outras Marcas" não é uma marca real — fica sempre com o glifo genérico
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

/** Glow/elevação partilhados por qualquer glifo (ilustração real, "+" ou monograma). */
const GLYPH_HOVER =
  "transition-[transform,filter,opacity,color] duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:drop-shadow-[0_10px_24px_oklch(0.58_0.22_25_/_0.3)]";

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
    <section ref={sectionRef} className="border-y border-border/60 bg-surface/50 py-20 md:py-28">
      <div className="container-premium">
        <div className={`text-center mb-16 md:mb-20 ${isInView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Marcas</div>
          <h2 className="text-3xl md:text-4xl font-bold">Escolhe a Tua Marca</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-10 md:gap-y-20">
          {BRANDS.map((b, i) => {
            const icon = BRAND_ICONS[b.slug];
            return (
              <Link
                key={b.slug}
                to="/brand/$slug"
                params={{ slug: b.slug }}
                aria-label={`Ver volantes compatíveis com ${b.name}`}
                className={`group flex cursor-pointer flex-col items-center gap-6 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                  isInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: isInView ? `${i * 60}ms` : undefined }}
              >
                <div className="flex h-20 w-full items-end justify-center sm:h-24 md:h-28">
                  {icon ? (
                    <img
                      src={icon}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className={`h-full w-auto max-w-36 object-contain opacity-75 group-hover:opacity-100 ${GLYPH_HOVER}`}
                    />
                  ) : b.slug === "outras-marcas" ? (
                    <Plus
                      aria-hidden="true"
                      strokeWidth={1}
                      className={`h-10 w-10 text-foreground/55 group-hover:text-foreground ${GLYPH_HOVER}`}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`text-4xl font-semibold leading-none text-foreground/55 group-hover:text-foreground ${GLYPH_HOVER}`}
                    >
                      {initials(b.name)}
                    </span>
                  )}
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
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
