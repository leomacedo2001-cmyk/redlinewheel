import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MegaMenuPanel } from "./MegaMenuPanel";
import { PRODUTOS_MEGA_MENU, MARCAS_MEGA_MENU_BRANDS, chunkIntoColumns } from "@/lib/megaMenuData";

type MenuKey = "marcas" | "produtos";

const MARCAS_COLUMNS = chunkIntoColumns(MARCAS_MEGA_MENU_BRANDS, 5).map((items) => ({ items }));

const CLOSE_DELAY_MS = 180;

/**
 * Barra de navegação visível em desktop (lg+). Em mobile/tablet, toda a
 * navegação continua a viver no `MenuDrawer` — ver `SiteHeader.tsx`.
 *
 * Um único painel partilhado troca de conteúdo consoante o menu aberto
 * (Marcas ou Produtos), em vez de cada trigger desenhar o seu próprio
 * dropdown — evita duplicar posicionamento/animação e mantém sempre um
 * mega menu aberto de cada vez.
 */
export function DesktopNav() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const closeTimer = useRef<number | null>(null);
  const marcasTriggerRef = useRef<HTMLButtonElement>(null);
  const produtosTriggerRef = useRef<HTMLButtonElement>(null);
  /** Evita que o foco devolvido pelo Escape reabra o menu através do onFocus do trigger. */
  const suppressFocusOpen = useRef(false);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    if (!openMenu) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        suppressFocusOpen.current = true;
        (openMenu === "marcas" ? marcasTriggerRef : produtosTriggerRef).current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openMenu]);

  function renderPanel(key: MenuKey) {
    return (
      <AnimatePresence>
        {openMenu === key && (
          <motion.div
            role="region"
            aria-label={key === "marcas" ? "Menu de marcas" : "Menu de produtos"}
            initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-50 border-b border-border/60 bg-background shadow-2xl"
          >
            <div className="container-premium">
              {key === "produtos" ? (
                <MegaMenuPanel columns={PRODUTOS_MEGA_MENU} onNavigate={() => setOpenMenu(null)} />
              ) : (
                <MegaMenuPanel
                  columns={MARCAS_COLUMNS}
                  onNavigate={() => setOpenMenu(null)}
                  footer={
                    <a
                      href="/brand/outras-marcas"
                      onClick={() => setOpenMenu(null)}
                      className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      Não encontras a tua marca? Trabalhamos sob consulta →
                    </a>
                  }
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  function triggerProps(key: MenuKey, ref: typeof marcasTriggerRef) {
    return {
      ref,
      type: "button" as const,
      "aria-haspopup": "true" as const,
      "aria-expanded": openMenu === key,
      onMouseEnter: () => {
        cancelClose();
        setOpenMenu(key);
      },
      onFocus: () => {
        if (suppressFocusOpen.current) {
          suppressFocusOpen.current = false;
          return;
        }
        cancelClose();
        setOpenMenu(key);
      },
      // Não alterna: o foco/hover já abre. Um clique nunca deve fechar o que
      // o utilizador acabou de focar (ex.: Tab + Enter fecharia de imediato).
      onClick: () => setOpenMenu(key),
    };
  }

  const linkClass =
    "relative py-2 text-sm uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary";
  const activeLinkClass = "text-primary";

  return (
    <div
      className="relative"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu(null);
      }}
    >
      <nav className="flex items-center gap-8">
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: activeLinkClass }} className={linkClass}>
          Home
        </Link>
        <Link to="/configurator" activeProps={{ className: activeLinkClass }} className={linkClass}>
          Configurador
        </Link>

        <button {...triggerProps("marcas", marcasTriggerRef)} className={`${linkClass} flex items-center gap-1`}>
          Marcas
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === "marcas" ? "rotate-180" : ""}`} />
        </button>
        {renderPanel("marcas")}

        <button {...triggerProps("produtos", produtosTriggerRef)} className={`${linkClass} flex items-center gap-1`}>
          Produtos
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === "produtos" ? "rotate-180" : ""}`} />
        </button>
        {renderPanel("produtos")}

        <Link to="/galeria" activeProps={{ className: activeLinkClass }} className={linkClass}>
          Galeria
        </Link>
        <Link to="/about" activeProps={{ className: activeLinkClass }} className={linkClass}>
          Sobre
        </Link>
        <Link to="/contact" activeProps={{ className: activeLinkClass }} className={linkClass}>
          Contacto
        </Link>
      </nav>
    </div>
  );
}
