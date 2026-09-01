import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AmbientGlow } from "@/components/AmbientGlow";
import { ImageOff } from "lucide-react";

/**
 * Showcase "Galeria REDLINE" — estado "Em breve".
 *
 * O carrossel de fotografias foi temporariamente substituído por retângulos
 * placeholder. As fotografias reais serão reintroduzidas no futuro.
 */

const PLACEHOLDER_COUNT = 6;

export function FeedbackShowcase() {
  return (
    <section
      id="comunidade"
      className="relative isolate overflow-hidden scroll-mt-24 py-20 md:py-24"
    >
      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />

      <div className="container-premium relative mb-12 text-center md:mb-14">
        <SectionEyebrow align="center" className="mb-5">
          Galeria REDLINE
        </SectionEyebrow>
        <div className="mx-auto mb-6 h-px w-16 bg-primary/35" />
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Inspiração ao volante.</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A galeria está em atualização. Em breve partilharemos novos trabalhos REDLINE.
        </p>
      </div>

      <div className="container-premium relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={`gallery-placeholder-${i}`}
              className="group relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden border border-dashed border-border/60 bg-surface transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <div className="flex flex-col items-center gap-3 text-muted-foreground/60">
                <ImageOff className="h-10 w-10" />
                <span className="text-xs uppercase tracking-[0.2em]">Em breve</span>
              </div>
              {/* friso técnico — mantém a linguagem das restantes secções */}
              <span className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-primary to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
