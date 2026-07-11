import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useFavoritesStore } from "@/stores/favoritesStore";

export function SiteHeader() {
  const favCount = useFavoritesStore((s) => s.items.length);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-premium flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            REDLINE<span className="text-primary">.</span>
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground hidden sm:inline">Automotive</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/products" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Produtos</Link>
          <Link to="/about" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Sobre</Link>
          <Link to="/contact" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Contacto</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative h-10 w-10 flex items-center justify-center hover:text-primary transition-colors"
          >
            <Heart className="h-5 w-5" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
