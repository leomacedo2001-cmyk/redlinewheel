import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavoritesStore, type FavoriteItem } from "@/stores/favoritesStore";
import { cn } from "@/lib/utils";

interface Props {
  item: Omit<FavoriteItem, "addedAt">;
  className?: string;
  variant?: "icon" | "full";
}

export function FavoriteButton({ item, className, variant = "full" }: Props) {
  const has = useFavoritesStore((s) => s.has(item.brandSlug, item.modelSlug));
  const toggle = useFavoritesStore((s) => s.toggle);

  const onClick = () => {
    toggle(item);
    toast.success(has ? "Removido dos favoritos" : "Adicionado aos favoritos", {
      description: `${item.brandName} ${item.name}`,
    });
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={has ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className={cn(
          "h-10 w-10 flex items-center justify-center border border-border/60 hover:border-primary transition-colors",
          has && "border-primary text-primary",
          className
        )}
      >
        <Heart className={cn("h-4 w-4", has && "fill-current")} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 text-xs uppercase tracking-wider border border-border/60 hover:border-primary transition-colors",
        has && "border-primary text-primary",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", has && "fill-current")} />
      {has ? "Nos favoritos" : "Favoritos"}
    </button>
  );
}
