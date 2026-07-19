import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export function CategoryCTA() {
  return (
    <section className="border-t border-border/60">
      <div className="container-premium py-24 text-center">
        <Star className="h-8 w-8 text-primary mx-auto mb-6" />
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Personalize o seu volante.</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Solicite um orçamento personalizado e transforme o interior do seu automóvel.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 rounded-none h-14 px-10 uppercase tracking-wider text-sm"
          >
            <Link to="/configurator">
              Pedir Orçamento <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-none h-14 px-10 uppercase tracking-wider text-sm"
          >
            <Link to="/contact">Contactar</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
