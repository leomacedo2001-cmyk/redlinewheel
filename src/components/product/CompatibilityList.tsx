import { fitmentDetail, type FitmentSummary } from "@/lib/fitment";

/**
 * Secção "Compatibilidade" da ficha de volante.
 *
 * Cada veículo ocupa a sua própria linha — modelo em cima, chassis e anos por
 * baixo — em vez de uma fila de etiquetas soltas. O que não existir nos dados
 * simplesmente não aparece: sem chassis mostra só o modelo, sem anos mostra só
 * o chassis. Nada é preenchido por inferência.
 */
export function CompatibilityList({ summary }: { summary: FitmentSummary }) {
  if (summary.fitments.length === 0) return null;

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Compatibilidade</div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/60 border border-border/60">
        {summary.fitments.map((f, i) => {
          const detail = fitmentDetail(f);
          return (
            <li key={`${f.raw}-${i}`} className="bg-surface px-3 py-2.5 min-w-0">
              <div className="text-[13px] font-semibold leading-tight truncate" title={f.model}>
                {f.model}
              </div>
              {detail ? (
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate" title={detail}>
                  {detail}
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground/60 mt-0.5">A confirmar</div>
              )}
            </li>
          );
        })}
      </ul>

      {summary.hasGeneric && (
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Compatibilidade final confirmada antes da produção.
        </p>
      )}
    </div>
  );
}
