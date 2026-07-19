import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CategoryFAQItem } from "@/lib/categoryPages";

type CategoryFAQProps = {
  items: CategoryFAQItem[];
};

export function CategoryFAQ({ items }: CategoryFAQProps) {
  return (
    <section className="border-t border-border/60">
      <div className="container-premium py-16 md:py-24 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Perguntas Frequentes
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Ainda tens dúvidas?</h2>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left hover:text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
