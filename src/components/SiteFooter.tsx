import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-surface mt-24">
      {/* O footer é o fim da experiência — o halo tem de se apagar por
          completo DENTRO dele, nunca escapar por baixo. Por isso não reutiliza
          o <AmbientGlow> partilhado (esse é feito para "meio a sobrepor-se à
          secção seguinte": largura = altura, pensado para as secções da home
          que TÊM uma seguinte). Aqui: altura fixa e pequena, ancorada ao
          topo, com o próprio gradiente já a chegar a 0% de opacidade bem
          antes do fim dessa altura — e overflow-hidden no footer como rede
          de segurança, para nunca ser fisicamente possível pintar fora dele,
          seja qual for a largura do ecrã. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background: [
            "radial-gradient(60% 100% at 50% 0%, oklch(0.65 0.23 32 / 0.08) 0%, oklch(0.6 0.2 28 / 0.05) 30%, transparent 60%)",
            "radial-gradient(42% 100% at 50% 0%, oklch(0.45 0.14 20 / 0.035) 0%, transparent 50%)",
          ].join(", "),
        }}
      />
      <div className="container-premium relative py-16 grid gap-12 md:grid-cols-4">
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
