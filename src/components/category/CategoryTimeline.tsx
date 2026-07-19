type CategoryTimelineProps = {
  steps: string[];
};

export function CategoryTimeline({ steps }: CategoryTimelineProps) {
  return (
    <section className="border-t border-border/60">
      <div className="container-premium py-16 md:py-24">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3 text-center">
          Como funciona
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-14 text-center">O nosso processo</h2>

        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-0">
          {steps.map((step, i) => (
            <div
              key={step}
              className="flex md:flex-col items-center gap-4 md:gap-0 flex-1 relative"
            >
              <div className="relative flex flex-col items-center md:w-full">
                <div className="h-11 w-11 shrink-0 rounded-full border-2 border-primary flex items-center justify-center font-bold text-primary bg-background z-10">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-5 left-1/2 w-full h-px bg-border/60"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="text-sm font-medium text-center md:mt-4 md:px-2">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
