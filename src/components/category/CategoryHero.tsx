import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type CategoryHeroProps = {
  title: string;
  tagline: string;
  subtitle: string;
  heroImg: string;
};

export function CategoryHero({ title, tagline, subtitle, heroImg }: CategoryHeroProps) {
  return (
    <section className="relative">
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden bg-surface">
        <img
          src={heroImg}
          alt={title}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="container-premium relative h-full flex flex-col justify-end pb-12">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" hash="produtos-personalizados">
                    Personalizações
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{tagline}</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-3xl">{title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">{subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90 px-8"
            >
              <Link to="/configurator">
                Pedir Orçamento <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-none h-12 uppercase tracking-wider text-xs px-8"
            >
              <Link to="/contact">Falar Connosco</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
