import type { ReactNode } from "react";
import type { MegaMenuColumn } from "@/lib/megaMenuData";

type MegaMenuPanelProps = {
  columns: MegaMenuColumn[];
  footer?: ReactNode;
  onNavigate?: () => void;
};

/**
 * Grelha de colunas partilhada pelos dois mega menus (Produtos, Marcas).
 * Item com `href` → link real; sem `href` → conceito ainda sem página própria,
 * mostrado desativado com etiqueta "Em breve" (nunca um link morto).
 */
export function MegaMenuPanel({ columns, footer, onNavigate }: MegaMenuPanelProps) {
  return (
    <div className="p-8 md:p-10">
      <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {columns.map((col, i) => (
          <div key={col.heading ?? i}>
            {col.heading && (
              <div className="mb-4 text-xs uppercase tracking-[0.25em] text-primary">{col.heading}</div>
            )}
            <ul className="space-y-2.5">
              {col.items.map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={onNavigate}
                      className="group inline-flex items-center text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {item.label}
                      <span className="ml-0 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:ml-1.5 group-hover:w-3" />
                    </a>
                  </li>
                ) : (
                  <li key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground/50">
                    {item.label}
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground/40">Em breve</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
      {footer && <div className="mt-8 border-t border-border/60 pt-6">{footer}</div>}
    </div>
  );
}
