import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRANDS } from "@/lib/brands";
import { getProjectForBrand, TRANSFORMATION_PROJECTS } from "@/lib/transformations";
import { CompareSlider } from "./CompareSlider";
import { BrandProjectNav } from "./BrandProjectNav";
import { ComingSoonPanel } from "./ComingSoonPanel";

/** "Outras Marcas" não é uma marca real — não faz sentido como projeto de transformação. */
const NAV_BRANDS = BRANDS.filter((b) => b.slug !== "outras-marcas");

export function TransformationShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [activeBrandSlug, setActiveBrandSlug] = useState("porsche");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeBrand = NAV_BRANDS.find((b) => b.slug === activeBrandSlug) ?? NAV_BRANDS[0];
  const project = getProjectForBrand(activeBrandSlug);
  const revealClass = isInView ? "animate-fade-up" : "opacity-0";
  const revealStyle = (delayMs: number) => (isInView ? { animationDelay: `${delayMs}ms` } : undefined);

  return (
    <section
      ref={sectionRef}
      id="transformacao"
      className="relative scroll-mt-24 overflow-hidden border-t border-border/60 bg-surface/40 py-24 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 55% at 50% 0%, oklch(0.58 0.22 25 / 0.07), transparent 70%)",
        }}
      />

      {isInView && (
        <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
          {TRANSFORMATION_PROJECTS.map((p) => (
            <div key={p.id}>
              <img src={p.before} alt="" loading="eager" decoding="async" />
              <img src={p.after} alt="" loading="eager" decoding="async" />
            </div>
          ))}
        </div>
      )}

      <div className="relative mx-auto max-w-[1500px] px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <div className={revealClass} style={revealStyle(0)}>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Transformação</span>
          </div>
          <h2 className={`${revealClass} text-4xl md:text-5xl font-bold mt-3 mb-6`} style={revealStyle(120)}>
            Onde o Original Termina.
          </h2>
          <p className={`${revealClass} text-muted-foreground`} style={revealStyle(260)}>
            Não fabricamos apenas volantes.
          </p>
          <p className={`${revealClass} text-muted-foreground`} style={revealStyle(400)}>
            Transformamos completamente a experiência de condução.
          </p>
        </div>

        <div className={`${revealClass} mb-8 flex justify-center`} style={revealStyle(520)}>
          <BrandProjectNav brands={NAV_BRANDS} activeSlug={activeBrandSlug} onSelect={setActiveBrandSlug} />
        </div>

        <div className={`${revealClass} grid`} style={revealStyle(620)}>
          <AnimatePresence>
            {project ? (
              <motion.div
                key={project.id}
                className="col-start-1 row-start-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <CompareSlider
                  before={project.before}
                  after={project.after}
                  beforeAlt={project.beforeAlt}
                  afterAlt={project.afterAlt}
                  callouts={project.callouts}
                  active={isInView}
                  imagePosition={project.imagePosition}
                />

                <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{project.projectName}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">{project.description}</p>
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90 rounded-none h-12 px-8 text-sm uppercase tracking-wider"
                    >
                      <Link to="/brand/$slug" params={{ slug: activeBrand.slug }}>
                        Ver Coleção {activeBrand.name} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <div className="mt-10 grid grid-cols-2 gap-6">
                      <div className="border-l-2 border-primary pl-4">
                        <div className="text-3xl font-bold">500+</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          Volantes entregues
                        </div>
                      </div>
                      <div className="border-l-2 border-primary pl-4">
                        <div className="text-3xl font-bold">2 anos</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          Garantia premium
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Tempo de Produção
                      </div>
                      <div className="font-semibold">{project.productionTime}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Materiais</div>
                      <ul className="space-y-1">
                        {project.materials.map((m) => (
                          <li key={m} className="font-medium leading-snug">
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Modificações</div>
                      <motion.ul
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                        className="space-y-1.5"
                      >
                        {project.modifications.map((m) => (
                          <motion.li
                            key={m}
                            variants={{
                              hidden: { opacity: 0, y: 6 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="flex items-start gap-2 font-medium leading-snug"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                            {m}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`coming-soon-${activeBrand.slug}`}
                className="col-start-1 row-start-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ComingSoonPanel brandName={activeBrand.name} />
                <div className="mt-10 text-center">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-none h-12 px-8 text-sm uppercase tracking-wider border-foreground/30"
                  >
                    <Link to="/brand/$slug" params={{ slug: activeBrand.slug }}>
                      Explorar {activeBrand.name} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
