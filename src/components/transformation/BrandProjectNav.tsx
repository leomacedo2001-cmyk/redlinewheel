import type { Brand } from "@/lib/brands";

type BrandProjectNavProps = {
  brands: Brand[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export function BrandProjectNav({ brands, activeSlug, onSelect }: BrandProjectNavProps) {
  return (
    <div
      role="tablist"
      aria-label="Selecionar marca"
      className="flex max-w-full gap-2 overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {brands.map((b) => {
        const active = b.slug === activeSlug;
        return (
          <button
            key={b.slug}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(b.slug)}
            className={`shrink-0 border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-[color,border-color,background-color,transform] duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {b.name}
          </button>
        );
      })}
    </div>
  );
}
