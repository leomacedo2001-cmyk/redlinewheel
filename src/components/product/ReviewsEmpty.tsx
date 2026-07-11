import { Star, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function ReviewsEmpty() {
  return (
    <section className="mt-16 md:mt-24">
      <header className="mb-6 border-b border-border/60 pb-4">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Comunidade</div>
        <h2 className="text-2xl md:text-3xl font-bold">Avaliações</h2>
      </header>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-dashed border-border/60 p-8 text-center bg-surface/30">
          <div className="flex justify-center gap-1 mb-3 text-muted-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5" />
            ))}
          </div>
          <div className="text-sm font-semibold mb-1">Ainda sem avaliações</div>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Sê o primeiro a partilhar a tua experiência com este volante depois da compra.
          </p>
        </div>
        <div className="border border-dashed border-border/60 p-8 text-center bg-surface/30">
          <MessageSquare className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
          <div className="text-sm font-semibold mb-1">Perguntas &amp; Respostas</div>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
            Dúvidas sobre compatibilidade, instalação ou materiais?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center text-xs uppercase tracking-wider text-primary hover:underline"
          >
            Fala connosco
          </Link>
        </div>
      </div>
    </section>
  );
}
