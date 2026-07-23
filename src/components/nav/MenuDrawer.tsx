import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PRODUTOS_MEGA_MENU, MARCAS_MEGA_MENU_BRANDS } from "@/lib/megaMenuData";

type NavLinkItem = { label: string; to: string };

const TOP_LINKS: NavLinkItem[] = [{ label: "Home", to: "/" }, { label: "Configurador", to: "/configurator" }];
const BOTTOM_LINKS: NavLinkItem[] = [
  { label: "Galeria", to: "/galeria" },
  { label: "Sobre", to: "/about" },
  { label: "Contacto", to: "/contact" },
];

const itemLinkClass =
  "group relative block py-3.5 text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary";

function NavLink({ item, onNavigate }: { item: NavLinkItem; onNavigate: () => void }) {
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      activeOptions={{ exact: item.to === "/" }}
      activeProps={{ className: "text-primary" }}
      className={itemLinkClass}
    >
      {item.label}
      <span className="absolute bottom-2 left-0 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:w-8" />
    </Link>
  );
}

/** Secção "Marcas"/"Produtos" em accordion — só uma fica aberta de cada vez. */
function AccordionSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/40">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3.5 text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MenuDrawer() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<"marcas" | "produtos" | null>(null);

  function close() {
    setOpen(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setExpanded(null);
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menu"
          className="flex h-10 w-10 items-center justify-center text-foreground/80 transition-colors hover:text-primary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-full flex-col overflow-y-auto bg-background/95 backdrop-blur-2xl sm:max-w-xs"
      >
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-bold tracking-tight">
            REDLINE<span className="text-primary">.</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-1 flex-col">
          {TOP_LINKS.map((item) => (
            <NavLink key={item.label} item={item} onNavigate={close} />
          ))}

          <AccordionSection
            label="Marcas"
            open={expanded === "marcas"}
            onToggle={() => setExpanded((cur) => (cur === "marcas" ? null : "marcas"))}
          >
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {MARCAS_MEGA_MENU_BRANDS.map((brand) =>
                brand.href ? (
                  <li key={brand.label}>
                    <a
                      href={brand.href}
                      onClick={close}
                      className="text-sm text-foreground/70 transition-colors hover:text-primary"
                    >
                      {brand.label}
                    </a>
                  </li>
                ) : (
                  <li key={brand.label} className="text-sm text-muted-foreground/40">
                    {brand.label}
                  </li>
                ),
              )}
            </ul>
            <a
              href="/brand/outras-marcas"
              onClick={close}
              className="mt-4 inline-block text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              Não encontras a tua marca? Trabalhamos sob consulta →
            </a>
          </AccordionSection>

          <AccordionSection
            label="Produtos"
            open={expanded === "produtos"}
            onToggle={() => setExpanded((cur) => (cur === "produtos" ? null : "produtos"))}
          >
            <div className="space-y-5">
              {PRODUTOS_MEGA_MENU.map((col) => (
                <div key={col.heading}>
                  {col.heading && (
                    <div className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">{col.heading}</div>
                  )}
                  <ul className="space-y-2">
                    {col.items.map((item) =>
                      item.href ? (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            onClick={close}
                            className="text-sm text-foreground/70 transition-colors hover:text-primary"
                          >
                            {item.label}
                          </a>
                        </li>
                      ) : (
                        <li key={item.label} className="text-sm text-muted-foreground/40">
                          {item.label} <span className="text-[9px] uppercase tracking-wider">Em breve</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </AccordionSection>

          {BOTTOM_LINKS.map((item) => (
            <NavLink key={item.label} item={item} onNavigate={close} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
