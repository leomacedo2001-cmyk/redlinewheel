import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavItem =
  | { label: string; to: string; hash?: never }
  | { label: string; to: "/"; hash: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Configurador", to: "/configurator" },
  { label: "Marcas", to: "/marcas" },
  { label: "Produtos", to: "/products" },
  { label: "Antes / Depois", to: "/", hash: "transformacao" },
  { label: "Galeria", to: "/galeria" },
  { label: "Comunidade", to: "/", hash: "comunidade" },
  { label: "Sobre", to: "/about" },
  { label: "Contacto", to: "/contact" },
];

export function MenuDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menu"
          className="flex h-10 w-10 items-center justify-center text-foreground/80 transition-colors hover:text-primary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col bg-background/95 backdrop-blur-2xl sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-bold tracking-tight">
            REDLINE<span className="text-primary">.</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-1 flex-col">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              {...(item.hash ? { hash: item.hash } : {})}
              onClick={() => setOpen(false)}
              {...(item.hash
                ? {}
                : { activeOptions: { exact: item.to === "/" }, activeProps: { className: "text-primary" } })}
              className="group relative py-3.5 text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
              <span className="absolute bottom-2 left-0 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:w-8" />
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
