import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BRANDS } from "@/lib/brands";

import bmwIcon from "@/assets/brand-icons/bmw.png";
import audiIcon from "@/assets/brand-icons/audi.png";
import volkswagenIcon from "@/assets/brand-icons/volkswagen.png";
import mercedesIcon from "@/assets/brand-icons/mercedes-benz.png";
import porscheIcon from "@/assets/brand-icons/porsche.png";
import toyotaIcon from "@/assets/brand-icons/toyota.png";
import teslaIcon from "@/assets/brand-icons/tesla.png";

/**
 * "Outras Marcas" não é uma marca real — fica sempre com o glifo de volante
 * (ver mais abaixo), nunca com uma ilustração de marca.
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

/** Glow/elevação partilhados por qualquer glifo (ilustração real, volante ou monograma). */
const GLYPH_HOVER =
  "transition-[transform,filter,opacity,color] duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-hover:drop-shadow-[0_12px_28px_oklch(0.58_0.22_25_/_0.35)]";

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
    <section ref={sectionRef} className="relative overflow-hidden border-y border-border/60 bg-surface/50 py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.035) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(55% 50% at 50% 0%, oklch(0.58 0.22 25 / 0.07), transparent 70%)",
        }}
      />

      <div className="container-premium relative">
        <div className={`text-center mb-16 md:mb-20 ${isInView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Marcas</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Encontra a Tua Marca.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Compatibilidade OEM para dezenas de modelos, com o acabamento que só a REDLINE oferece.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-10 md:gap-y-24">
          {BRANDS.map((b, i) => {
            const icon = BRAND_ICONS[b.slug];
            const delay = isInView ? `${i * 70}ms` : undefined;
            return (
              <Link
                key={b.slug}
                to="/brand/$slug"
                params={{ slug: b.slug }}
                aria-label={`Ver volantes compatíveis com ${b.name}`}
                className="group flex cursor-pointer flex-col items-center gap-6 rounded-sm transition-transform duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <div className="flex h-24 w-full items-end justify-center sm:h-28 md:h-36">
                  {icon ? (
                    <img
                      src={icon}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      style={{ animationDelay: delay }}
                      className={`h-full w-auto max-w-44 object-contain opacity-80 group-hover:opacity-100 ${GLYPH_HOVER} ${
                        isInView ? "animate-draw-in" : "opacity-0"
                      }`}
                    />
                  ) : b.slug === "outras-marcas" ? (
                    <svg
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="round"
                      aria-hidden="true"
                      style={{ animationDelay: delay }}
                      className={`h-20 w-20 text-foreground/55 group-hover:text-foreground sm:h-24 sm:w-24 md:h-28 md:w-28 ${GLYPH_HOVER} ${
                        isInView ? "animate-draw-in" : "opacity-0"
                      }`}
                    >
                      <circle cx="50" cy="50" r="36" />
                      <circle cx="50" cy="50" r="9" />
                      <line x1="50" y1="41" x2="50" y2="14" />
                      <line x1="42.2" y1="54.5" x2="18.8" y2="68" />
                      <line x1="57.8" y1="54.5" x2="81.2" y2="68" />
                    </svg>
                  ) : (
                    <span
                      aria-hidden="true"
                      style={{ animationDelay: delay }}
                      className={`text-4xl font-semibold leading-none text-foreground/55 group-hover:text-foreground ${GLYPH_HOVER} ${
                        isInView ? "animate-draw-in" : "opacity-0"
                      }`}
                    >
                      {initials(b.name)}
                    </span>
                  )}
                </div>
                <span
                  style={{ animationDelay: delay }}
                  className={`text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-500 group-hover:text-foreground ${
                    isInView ? "animate-fade-up" : "opacity-0"
                  }`}
                >
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
