import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Adicionar novos volantes em destaque aqui quando necessário
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WHEELS: any[] = [];

export function FeaturedWheels() {
  if (WHEELS.length === 0) {
    return (
      <div className="text-center py-20 border border-border/60 bg-surface/30">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
          Em breve
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Novos produtos em destaque serão adicionados em breve. Fica atento às novidades da REDLINE Performance.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {WHEELS.map((w: { name: string; img: string; tag: string; desc: string }) => (
        <article
          key={w.name}
          className="group bg-surface border border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col"
        >
          <div className="aspect-square overflow-hidden bg-background relative">
            <img
              src={w.img}
              alt={w.name}
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary border border-primary/40">
              {w.tag}
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1 gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-base leading-tight mb-2">{w.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{w.desc}</p>
            </div>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 rounded-none h-10 uppercase tracking-wider text-[11px] w-full">
              <Link to="/contact">
                Pedir Orçamento <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
