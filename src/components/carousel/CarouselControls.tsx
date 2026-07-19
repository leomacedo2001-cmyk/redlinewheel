import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
};

export function CarouselControls({ onPrev, onNext }: CarouselControlsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Personalização anterior"
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-30 h-11 w-11 flex items-center justify-center bg-background/70 backdrop-blur border border-border/60 text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Próxima personalização"
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-30 h-11 w-11 flex items-center justify-center bg-background/70 backdrop-blur border border-border/60 text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </>
  );
}
