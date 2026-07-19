type CarouselIndicatorsProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function CarouselIndicators({ count, activeIndex, onSelect }: CarouselIndicatorsProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 mt-8"
      role="tablist"
      aria-label="Selecionar personalização"
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Ir para personalização ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i === activeIndex ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}
