import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { MenuDrawer } from "./nav/MenuDrawer";
import { DesktopNav } from "./nav/DesktopNav";
import { useFavoritesStore } from "@/stores/favoritesStore";

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="text-2xl font-bold tracking-tight">
        REDLINE<span className="text-primary">.</span>
      </span>
      <span className="hidden text-xs uppercase tracking-[0.3em] text-muted-foreground sm:inline">
        Automotive
      </span>
    </span>
  );
}

function IconActions() {
  const favCount = useFavoritesStore((s) => s.items.length);
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        to="/favoritos"
        aria-label="Favoritos"
        className="group relative flex h-10 w-10 items-center justify-center text-foreground/80 transition-all duration-300 hover:scale-105 hover:text-primary hover:drop-shadow-[0_0_10px_oklch(0.58_0.22_25/0.35)]"
      >
        <Heart className="h-5 w-5" />
        {favCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {favCount}
          </span>
        )}
      </Link>
      <div className="transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_oklch(0.58_0.22_25/0.35)]">
        <CartDrawer />
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      {/* Desktop (lg+): logo à esquerda, navegação visível, mega menus por hover. */}
      <div className="container-premium hidden h-16 items-center justify-between gap-8 lg:flex">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <DesktopNav />
        <IconActions />
      </div>

      {/* Mobile/tablet (<lg): logo centrado, navegação inteira atrás do hambúrguer. */}
      <div className="container-premium grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:hidden">
        <div className="flex items-center justify-start">
          <MenuDrawer />
        </div>
        <Link to="/" className="flex items-center justify-center">
          <Logo />
        </Link>
        <IconActions />
      </div>
    </header>
  );
}
