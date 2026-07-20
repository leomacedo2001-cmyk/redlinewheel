import { Star, Quote } from "lucide-react";
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

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, city, country, rating, review, carModel, image } = testimonial;

  return (
    <article className="group h-full bg-surface border border-border/60 flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)]">
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border/60">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight truncate">{name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {city}, {country}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < rating ? "fill-primary text-primary" : "text-border"}`}
            />
          ))}
        </div>

        <div className="relative">
          <Quote className="absolute -top-1 -left-1 h-6 w-6 text-primary/15" />
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 pl-4">
            {review}
          </p>
        </div>
      </div>

      <div className="aspect-[4/5] overflow-hidden bg-background">
        <img
          src={image}
          alt={`Instalação de volante REDLINE personalizado — ${carModel}`}
          loading="lazy"
          decoding="async"
          width={720}
          height={900}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-4 mt-auto">
        <span className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] px-2.5 py-1.5 bg-background border border-border/60 text-muted-foreground">
          {carModel}
        </span>
      </div>
    </article>
  );
}
