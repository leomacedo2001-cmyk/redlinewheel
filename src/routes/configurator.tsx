import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Check, X } from "lucide-react";
import { getBrandModel } from "@/lib/brands";
import { buildPrefill, EMPTY_PREFILL, type ConfiguratorPrefill } from "@/lib/configuratorPrefill";
import {
  TIPO_VOLANTE_LIST,
  MATERIAL_LIST,
  CARBONO_LIST,
  COR_COSTURAS_LIST,
  COR_FAIXA_LIST,
  EXTRAS_LIST,
} from "@/lib/configuratorOptions";
import { mailtoHref } from "@/lib/contact";

export const Route = createFileRoute("/configurator")({
  /**
   * `?base=<marca>/<modelo>` identifica o volante do catálogo usado como ponto
   * de partida. É opcional: sem ele o configurador abre vazio, como sempre.
   */
  validateSearch: (search: Record<string, unknown>): { base?: string } => {
    const base = search.base;
    return typeof base === "string" && base.length > 0 ? { base } : {};
  },
  head: () => ({
    meta: [
      { title: "Configurador de Volante — REDLINE Performance" },
      { name: "description", content: "Configura o teu volante personalizado: materiais, costuras, carbono, LED, patilhas e mais. Pede o teu orçamento em minutos." },
      { property: "og:title", content: "Configurador de Volante — REDLINE Performance" },
      { property: "og:description", content: "Personaliza cada detalhe do teu volante e recebe orçamento em 24h." },
      { property: "og:url", content: "/configurator" },
    ],
    links: [{ rel: "canonical", href: "/configurator" }],
  }),
  component: ConfiguratorPage,
});

type SingleKey = "tipo" | "material" | "carbono" | "costuras" | "faixa";

/**
 * Resolve o `?base=` para um pré-preenchimento. Um slug inválido ou um produto
 * que já não exista devolvem simplesmente o formulário vazio — nunca um erro.
 */
function resolvePrefill(base?: string): ConfiguratorPrefill {
  if (!base) return EMPTY_PREFILL;
  const [brandSlug, modelSlug] = base.split("/");
  if (!brandSlug || !modelSlug) return EMPTY_PREFILL;
  const found = getBrandModel(brandSlug, modelSlug);
  if (!found) return EMPTY_PREFILL;
  return buildPrefill(found.brand.name, found.model);
}

function ConfiguratorPage() {
  const { base } = Route.useSearch();
  const prefill = useMemo(() => resolvePrefill(base), [base]);

  // O estado arranca do pré-preenchimento; a partir daí o cliente muda o que quiser.
  // A `key` no componente de página garante que trocar de produto recomeça limpo.
  const [marca, setMarca] = useState(prefill.marca);
  const [modelo, setModelo] = useState(prefill.modelo);
  const [chassis, setChassis] = useState(prefill.chassis);
  const [ano, setAno] = useState(prefill.ano);
  const [single, setSingle] = useState<Record<SingleKey, string>>({
    tipo: prefill.tipo,
    material: prefill.material,
    carbono: prefill.carbono,
    costuras: prefill.costuras,
    faixa: prefill.faixa,
  });
  const [extras, setExtras] = useState<string[]>(prefill.extras);
  const [nome, setNome] = useState("");
  const [contacto, setContacto] = useState("");
  const [notas, setNotas] = useState("");
  const [sent, setSent] = useState(false);

  const toggleExtra = (e: string) =>
    setExtras((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  const summary = useMemo(() => {
    const lines: string[] = ["*Pedido de orçamento — Volante Personalizado*", ""];
    if (prefill.baseName) lines.push(`Baseado em: ${prefill.baseName}`, "");
    lines.push(
      `Veículo: ${marca || "-"} ${modelo || ""} ${ano ? `(${ano})` : ""}`.trim(),
      `Chassis / geração: ${chassis || "-"}`,
      `Tipo: ${single.tipo || "-"}`,
      `Material: ${single.material || "-"}`,
      `Carbono: ${single.carbono || "-"}`,
      `Costuras: ${single.costuras || "-"}`,
      `Faixa central: ${single.faixa || "-"}`,
      `Extras: ${extras.length ? extras.join(", ") : "Nenhum"}`,
      "",
      `Nome: ${nome || "-"}`,
      `Contacto: ${contacto || "-"}`,
    );
    if (notas) lines.push(`Notas: ${notas}`);
    return lines.join("\n");
  }, [prefill.baseName, marca, modelo, chassis, ano, single, extras, nome, contacto, notas]);

  const mailHref = mailtoHref("Pedido de orçamento — Volante Personalizado", summary);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    window.open(mailHref, "_blank");
  };

  return (
    <div className="container-premium py-16 md:py-24 max-w-5xl">
      <Link to="/" className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Voltar
      </Link>
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Configurador</div>
      <h1 className="text-5xl md:text-6xl font-bold mb-4">Configura o teu volante.</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mb-6">
        Escolhe cada detalhe do teu volante personalizado. Enviamos orçamento em menos de 24h.
      </p>

      {prefill.baseName && (
        <div className="mb-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-l-2 border-primary bg-surface/60 px-4 py-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Estás a personalizar:
          </span>
          <span className="text-sm font-semibold">{prefill.baseName}</span>
          <Link
            to="/configurator"
            className="ml-auto inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="h-3 w-3" /> Começar do zero
          </Link>
        </div>
      )}
      {!prefill.baseName && <div className="mb-12" />}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-10">
          <Section title="Veículo">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Marca"><Input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="BMW, Audi, AMG..." required /></Field>
              <Field label="Modelo"><Input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="M3, RS3, A45..." required /></Field>
              <Field label="Chassis / geração"><Input value={chassis} onChange={(e) => setChassis(e.target.value)} placeholder="G80, 8Y, W205..." /></Field>
              <Field label="Ano"><Input value={ano} onChange={(e) => setAno(e.target.value)} placeholder="2021" inputMode="numeric" /></Field>
            </div>
          </Section>

          <SingleChoice title="Tipo de volante" options={TIPO_VOLANTE_LIST} value={single.tipo} onChange={(v) => setSingle((s) => ({ ...s, tipo: v }))} />
          <SingleChoice title="Material principal" options={MATERIAL_LIST} value={single.material} onChange={(v) => setSingle((s) => ({ ...s, material: v }))} />
          <SingleChoice title="Fibra de carbono" options={CARBONO_LIST} value={single.carbono} onChange={(v) => setSingle((s) => ({ ...s, carbono: v }))} />
          <SingleChoice title="Cor das costuras" options={COR_COSTURAS_LIST} value={single.costuras} onChange={(v) => setSingle((s) => ({ ...s, costuras: v }))} />
          <SingleChoice title="Cor da faixa central (12h)" options={COR_FAIXA_LIST} value={single.faixa} onChange={(v) => setSingle((s) => ({ ...s, faixa: v }))} />

          <Section title="Extras">
            <div className="grid sm:grid-cols-2 gap-2">
              {EXTRAS_LIST.map((e) => {
                const active = extras.includes(e);
                return (
                  <button
                    type="button"
                    key={e}
                    onClick={() => toggleExtra(e)}
                    className={`text-left text-sm px-4 py-3 border transition-colors flex items-center gap-2 ${
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/60 hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className={`h-4 w-4 border flex items-center justify-center shrink-0 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      {active && <Check className="h-3 w-3" />}
                    </span>
                    {e}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Os teus dados">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nome"><Input value={nome} onChange={(e) => setNome(e.target.value)} required /></Field>
              <Field label="Email ou WhatsApp"><Input value={contacto} onChange={(e) => setContacto(e.target.value)} required /></Field>
            </div>
            <Field label="Notas adicionais (opcional)">
              <Textarea rows={4} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Referências, cores específicas, fotos..." />
            </Field>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit bg-surface border border-border/60 p-6 space-y-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">Resumo</div>
            <h3 className="text-xl font-bold">A tua configuração</h3>
          </div>
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground font-mono bg-background p-4 border border-border/40 max-h-72 overflow-auto">{summary}</pre>

          <Button type="submit" className="w-full rounded-none h-12 uppercase tracking-wider text-xs bg-primary hover:bg-primary/90">
            <Mail className="h-4 w-4 mr-2" /> Enviar por Email
          </Button>

          {sent && (
            <p className="text-xs text-primary">Abrimos o teu email numa nova janela. Confirma o envio para nós.</p>
          )}
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SingleChoice({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <Section title={title}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              type="button"
              key={o}
              onClick={() => onChange(o)}
              className={`text-sm px-4 py-2 border transition-colors ${
                active ? "border-primary bg-primary/10 text-foreground" : "border-border/60 hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </Section>
  );
}
