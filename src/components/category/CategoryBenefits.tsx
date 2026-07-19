import { Check } from "lucide-react";

type CategoryBenefitsProps = {
  intro: string;
  benefits: string[];
};

export function CategoryBenefits({ intro, benefits }: CategoryBenefitsProps) {
  return (
    <section className="border-t border-border/60">
      <div className="container-premium py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Sobre este acabamento
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Qualidade que se sente ao volante
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{intro}</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Benefícios</div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 text-sm items-start">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
