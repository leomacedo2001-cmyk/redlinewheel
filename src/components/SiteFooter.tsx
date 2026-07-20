import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface mt-24">
      <div className="container-premium py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="text-2xl font-bold">
            REDLINE<span className="text-primary">.</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Volantes premium personalizados para uma experiência de condução única.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Loja</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/products" className="hover:text-primary">
                Todos os Produtos
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-primary">
                Volantes
              </Link>
            </li>
            <li>
              <Link to="/acessorios" className="hover:text-primary">
                Acessórios
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Empresa</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-primary">
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Marcas</h4>
          <p className="text-sm text-muted-foreground">
            BMW · Mercedes · Audi · Porsche · VW · Cupra · Tesla
          </p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-premium py-6 text-xs text-muted-foreground flex flex-col gap-2 md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} REDLINE Performance. Todos os direitos reservados.
          </span>
          <div className="flex gap-4">
            <Link to="/privacidade" className="hover:text-primary">
              Política de Privacidade
            </Link>
            <span>Made with precision in Portugal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
