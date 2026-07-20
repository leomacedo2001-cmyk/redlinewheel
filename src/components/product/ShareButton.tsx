import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  text?: string;
  className?: string;
}

export function ShareButton({ title, text, className }: Props) {
  const onClick = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user canceled or failed → fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado", { description: "Partilha onde quiseres." });
    } catch {
      toast.error("Não foi possível copiar", { description: url });
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Partilhar produto"
      className={cn(
        "h-10 w-10 flex items-center justify-center border border-border/60 hover:border-primary hover:text-primary transition-colors",
        className
      )}
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}
