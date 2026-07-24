import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Testimonial } from "@/lib/testimonials";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/**
 * O destaque é a transformação, nunca o modelo de carro — por isso o cartão
 * nunca mostra `carModel`, mesmo quando o dado existe (ver testimonials.ts).
 */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, city, country, rating, image } = testimonial;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-border/60 bg-surface transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_32px_60px_-24px_rgba(0,0,0,0.65)]">
      {/* friso técnico — acende-se no hover, mesma linguagem da Transformação */}
      <span className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-primary to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />

      {/* aspect-[4/5] dá o tamanho de referência; flex-1 deixa crescer para preencher o
          cartão agora que já não há chip de modelo por baixo. */}
      <div className="relative aspect-[4/5] flex-1 min-h-[240px] overflow-hidden bg-background">
        <img
          src={image}
          alt="Instalação de volante REDLINE personalizado"
          loading="lazy"
          decoding="async"
          width={720}
          height={900}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-90" />
      </div>

      <div className="relative flex flex-col gap-4 p-5">
        {/* classificação — tom dourado discreto, propositadamente distinto do
            vermelho da marca (esse é para ações; isto é um sinal de confiança) */}
        <div className="flex items-center gap-1.5" aria-label={`${rating} de 5 estrelas`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < rating
                  ? "fill-[oklch(0.78_0.11_80)] text-[oklch(0.78_0.11_80)]"
                  : "text-border"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3.5">
          <Avatar className="h-11 w-11 shrink-0 border border-border/60 ring-1 ring-primary/10">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold leading-tight tracking-tight">
              {name}
            </div>
            <div className="mt-1 truncate text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
              {city} • {country}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
