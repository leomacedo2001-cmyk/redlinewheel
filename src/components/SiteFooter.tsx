import { useEffect, useRef, useState } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { BRANDS } from "@/lib/brands";

/** "Outras Marcas" não é uma marca real — mesmo critério já usado no resto do site. */
const NAV_BRANDS = BRANDS.filter((b) => b.slug !== "outras-marcas");

/**
 * Link do footer — sem sublinhado por omissão; ao passar o rato, uma linha
 * fina cresce da esquerda, o mesmo vocabulário de hover já usado nos
 * cartões da Diferença REDLINE e nos testemunhos, agora aplicado aqui para
 * que a interação pareça da mesma família em toda a página.
 */
function FooterLink({
  className = "",
  children,
  ...linkProps
}: LinkProps & { className?: string; children: React.ReactNode }) {
  return (
    <Link
      {...linkProps}
      className={`group/link relative inline-flex w-fit items-center text-sm text-muted-foreground transition-colors duration-300 ease-out hover:text-foreground ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-[280ms] ease-out group-hover/link:scale-x-100"
      />
    </Link>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/90">{title}</h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reveal = (delayMs: number) =>
    isInView ? "animate-footer-reveal" : "opacity-0";
  const revealStyle = (delayMs: number) => (isInView ? { animationDelay: `${delayMs}ms` } : undefined);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-border/60 bg-surface mt-24"
    >
      {/* O website termina aqui — sem luz própria. A pequena transição vem só
          do halo inferior da última secção (CTA), já dentro dela mesma; o
          footer em si é preto sólido, sem gradientes nem pseudo-elementos.
          A única "profundidade" permitida é este fio de luz neutro (não
          laranja) mesmo no topo — o brilho quase impercetível de um bordo a
          apanhar luz, não um glow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="container-premium relative py-20 md:py-24">
        <div className="grid grid-cols-1 gap-y-14 gap-x-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-12">
          {/* Âncora: a marca */}
          <div className={`sm:col-span-2 lg:col-span-4 ${reveal(0)}`} style={revealStyle(0)}>
            <Link to="/" className="inline-flex items-baseline gap-2.5">
              <span className="text-3xl font-bold tracking-tight">
                REDLINE<span className="text-primary">.</span>
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Automotive</span>
            </Link>
            <p className="mt-5 max-w-[30ch] text-sm leading-relaxed text-muted-foreground/90">
              Volantes premium personalizados para uma experiência de condução única.
            </p>
          </div>

          {/* Loja / Empresa / Marcas */}
          <div
            className={`grid grid-cols-2 gap-x-8 gap-y-10 sm:col-span-2 sm:grid-cols-3 lg:col-span-5 lg:gap-x-10 ${reveal(80)}`}
            style={revealStyle(80)}
          >
            <FooterColumn title="Loja">
              <li>
                <FooterLink to="/products">Todos os Produtos</FooterLink>
              </li>
              <li>
                <FooterLink to="/products">Volantes</FooterLink>
              </li>
              <li>
                <FooterLink to="/acessorios">Acessórios</FooterLink>
              </li>
            </FooterColumn>
            <FooterColumn title="Empresa">
              <li>
                <FooterLink to="/about">Sobre Nós</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Contacto</FooterLink>
              </li>
            </FooterColumn>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/90">
                Marcas
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2.5">
                {NAV_BRANDS.map((b) => (
                  <FooterLink key={b.slug} to="/brand/$slug" params={{ slug: b.slug }}>
                    {b.name}
                  </FooterLink>
                ))}
              </div>
            </div>
          </div>

          {/* Assinatura de marca */}
          <div
            className={`lg:col-span-3 lg:border-l lg:border-border/30 lg:pl-10 ${reveal(160)}`}
            style={revealStyle(160)}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Manufatura Redline
            </div>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground/90">
              <li>Feito à Mão em Portugal</li>
              <li>Garantia Premium de 2 Anos</li>
              <li>Compatibilidade OEM</li>
              <li>Entrega Europeia</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Separador premium — quase invisível, com um leve tom quente ao centro. */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent"
      />

      <div className="container-premium py-7">
        <div
          className={`grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-3 sm:items-center ${reveal(220)}`}
          style={revealStyle(220)}
        >
          <span className="sm:text-left">
            © {new Date().getFullYear()} REDLINE Performance. Todos os direitos reservados.
          </span>
          <FooterLink to="/privacidade" className="sm:mx-auto">
            Política de Privacidade
          </FooterLink>
          <span className="sm:text-right">Made with precision in Portugal</span>
        </div>
      </div>
    </footer>
  );
}
