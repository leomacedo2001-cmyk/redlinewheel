import { useState } from "react";
import { Check, AlertCircle, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { checkCompatibility, vehicleLines, type CompatibilityResult, type VehicleInput } from "@/lib/compatibility";
import { formatYears, type FitmentSummary } from "@/lib/fitment";
import { mailtoHref } from "@/lib/contact";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  brandName: string;
  /** Estrutura normalizada — a mesma que a ficha mostra. */
  summary: FitmentSummary;
  priceDisplay?: string | null;
  /** Continua para a compra com o veículo confirmado. */
  onProceed: (vehicle: VehicleInput) => void;
  proceeding?: boolean;
};

const EMPTY: VehicleInput = { marca: "", modelo: "", ano: "", chassis: "" };

export function CompatibilityDialog({
  open,
  onOpenChange,
  productName,
  brandName,
  summary,
  priceDisplay,
  onProceed,
  proceeding,
}: Props) {
  const [vehicle, setVehicle] = useState<VehicleInput>({ ...EMPTY, marca: brandName });
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const set = (k: keyof VehicleInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle((v) => ({ ...v, [k]: e.target.value }));
    setResult(null);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(checkCompatibility(summary, vehicle));
  };

  const manualHref = mailtoHref(
    `Confirmação de compatibilidade — ${productName}`,
    [
      "Olá REDLINE,",
      "",
      `Quero confirmar a compatibilidade deste volante com o meu carro:`,
      `Volante: ${productName}${priceDisplay ? ` (${priceDisplay})` : ""}`,
      "",
      ...vehicleLines(vehicle),
      "",
      "Obrigado.",
    ].join("\n"),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setResult(null);
      }}
    >
      <DialogContent className="sm:max-w-lg rounded-none border-border/60 bg-surface">
        <DialogHeader>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">Passo 1 de 2</div>
          <DialogTitle className="text-2xl font-bold">Confirmar compatibilidade</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Indica o teu automóvel. Confirmamos a compatibilidade antes de iniciarmos a produção — para o
            volante encaixar e os comandos e airbag funcionarem como de origem.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCheck} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Marca</Label>
              <Input value={vehicle.marca} onChange={set("marca")} placeholder="BMW" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Modelo</Label>
              <Input value={vehicle.modelo} onChange={set("modelo")} placeholder="M3" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Ano</Label>
              <Input value={vehicle.ano} onChange={set("ano")} placeholder="2021" inputMode="numeric" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Chassis / geração <span className="normal-case tracking-normal">(se souberes)</span>
              </Label>
              <Input value={vehicle.chassis} onChange={set("chassis")} placeholder={summary.commonChassis ?? summary.generationLabel ?? "G80"} />
            </div>
          </div>

          {summary.fitments.length > 0 && (
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              Este volante está declarado como compatível com:{" "}
              <span className="text-foreground">
                {summary.fitments.map((f) => f.model).join(" · ")}
              </span>
              {summary.generationLabel && <> — {summary.generationLabel}</>}
              {formatYears(summary.years) && <> ({formatYears(summary.years)})</>}
            </div>
          )}

          {!result && (
            <Button
              type="submit"
              className="w-full rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90"
            >
              Verificar compatibilidade
            </Button>
          )}
        </form>

        {result?.status === "confirmada" && (
          <div className="space-y-4 border-t border-border/60 pt-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 shrink-0 bg-primary text-primary-foreground flex items-center justify-center">
                <Check className="h-3.5 w-3.5" />
              </span>
              <div className="text-sm">
                <div className="font-semibold">Compatibilidade confirmada</div>
                <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                  {result.matchedOn ? (
                    <>
                      O teu automóvel corresponde a <span className="text-foreground">{result.matchedOn}</span>
                      {formatYears(result.matchedYears) && (
                        <> (<span className="text-foreground">{formatYears(result.matchedYears)}</span>)</>
                      )}
                      , uma das compatibilidades declaradas deste volante. Validamos novamente antes da produção.
                    </>
                  ) : (
                    "Validamos novamente antes de iniciarmos a produção."
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={() => onProceed(vehicle)}
              disabled={proceeding}
              className="w-full rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90"
            >
              {proceeding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Continuar para a compra <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {result?.status === "manual" && (
          <div className="space-y-4 border-t border-border/60 pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold">Precisamos de confirmar manualmente</div>
                <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                  Não conseguimos validar automaticamente esta combinação com os dados que temos deste volante.
                  Isso não quer dizer que seja incompatível — só que preferimos confirmar contigo antes de
                  avançar. Responde-nos e voltamos a ti em menos de 24h.
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Button
                asChild
                className="w-full rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90"
              >
                <a href={manualHref}>
                  <Mail className="h-4 w-4 mr-2" /> Falar com a REDLINE
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onProceed(vehicle)}
                disabled={proceeding}
                className="w-full rounded-none h-11 uppercase tracking-wider text-[11px] border-border/60"
              >
                {proceeding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Continuar mesmo assim
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
