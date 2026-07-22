import { Clock } from "lucide-react";

export function ComingSoonPanel({ brandName }: { brandName: string }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-border/60 bg-surface/30 px-6 text-center">
      <Clock className="h-6 w-6 text-muted-foreground" />
      <div className="text-sm font-semibold">Em breve, {brandName}.</div>
      <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
        Estamos a preparar novos projetos reais de transformação para esta marca.
      </p>
    </div>
  );
}
