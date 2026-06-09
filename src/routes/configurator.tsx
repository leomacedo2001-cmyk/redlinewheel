import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageCircle, Mail, Check } from "lucide-react";

export const Route = createFileRoute("/configurator")({
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

const TIPO_VOLANTE = ["Original (retrim)", "Achatado em baixo (flat bottom)", "Achatado em cima e baixo", "Racing / GT", "OEM+"];
const MATERIAL = ["Alcântara", "Pele perfurada", "Pele lisa (nappa)", "Combinação Alcântara + Pele", "Combinação Alcântara + Carbono"];
const CARBONO = ["Sem carbono", "Carbono twill 2x2", "Carbono forged", "Carbono + Alcântara"];
const COR_COSTURAS = ["Vermelho", "Preto", "Branco", "Cinza", "Azul", "Amarelo", "Tom-sobre-tom", "Tricolor M", "Outra"];
const COR_FAIXA = ["Sem faixa", "Vermelho", "Branco", "Azul", "Amarelo", "Tricolor M", "Verde AMG", "Outra"];

type MultiKey = "extras";
type SingleKey = "tipo" | "material" | "carbono" | "costuras" | "faixa";

const EXTRAS = [
  "Indicador LED de mudança",
  "Patilhas de velocidade em alumínio",
  "Aquecimento do volante",
  "Logótipo personalizado gravado",
  "Airbag retrimado a condizer",
  "Apoio de braço a condizer",
  "Manípulo da caixa a condizer",
  "Fole da caixa a condizer",
];

function ConfiguratorPage() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [single, setSingle] = useState<Record<SingleKey, string>>({
    tipo: "",
    material: "",
    carbono: "",
    costuras: "",
    faixa: "",
  });
  const [extras, setExtras] = useState<string[]>([]);
  const [nome, setNome] = useState("");
  const [contacto, setContacto] = useState("");
  const [notas, setNotas] = useState("");
  const [sent, setSent] = useState(false);

  const toggleExtra = (e: string) =>
    setExtras((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  const summary = useMemo(() => {
    const lines = [
      "*Pedido de orçamento — Volante Personalizado*",
      "",
      `Veículo: ${marca || "-"} ${modelo || ""} ${ano ? `(${ano})` : ""}`.trim(),
      `Tipo: ${single.tipo || "-"}`,
      `Material: ${single.material || "-"}`,
      `Carbono: ${single.carbono || "-"}`,
      `Costuras: ${single.costuras || "-"}`,
      `Faixa central: ${single.faixa || "-"}`,
      `Extras: ${extras.length ? extras.join(", ") : "Nenhum"}`,
      "",
      `Nome: ${nome || "-"}`,
      `Contacto: ${contacto || "-"}`,
      notas ? `Notas: ${notas}` : "",
    ].filter(Boolean);
    return lines.join("\n");
  }, [marca, modelo, ano, single, extras, nome, contacto, notas]);

  const whatsappHref = `https://wa.me/351900000000?text=${encodeURIComponent(summary)}`;
  const mailHref = `mailto:hello@redline-performance.com?subject=${encodeURIComponent(
    "Pedido de orçamento — Volante Personalizado"
  )}&body=${encodeURIComponent(summary)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    window.open(whatsappHref, "_blank");
  };

  return (
    <div className="container-premium py-16 md:py-24 max-w-5xl">
      <Link to="/" className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Voltar
      </Link>
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Configurador</div>
      <h1 className="text-5xl md:text-6xl font-bold mb-4">Configura o teu volante.</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mb-12">
        Escolhe cada detalhe do teu volante personalizado. Enviamos orçamento em menos de 24h.
      </p>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-10">
          <Section title="Veículo">
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Marca"><Input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="BMW, Audi, AMG..." required /></Field>
              <Field label="Modelo"><Input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="M3, RS3, A45..." required /></Field>
              <Field label="Ano"><Input value={ano} onChange={(e) => setAno(e.target.value)} placeholder="2021" inputMode="numeric" /></Field>
            </div>
          </Section>

          <SingleChoice title="Tipo de volante" options={TIPO_VOLANTE} value={single.tipo} onChange={(v) => setSingle((s) => ({ ...s, tipo: v }))} />
          <SingleChoice title="Material principal" options={MATERIAL} value={single.material} onChange={(v) => setSingle((s) => ({ ...s, material: v }))} />
          <SingleChoice title="Fibra de carbono" options={CARBONO} value={single.carbono} onChange={(v) => setSingle((s) => ({ ...s, carbono: v }))} />
          <SingleChoice title="Cor das costuras" options={COR_COSTURAS} value={single.costuras} onChange={(v) => setSingle((s) => ({ ...s, costuras: v }))} />
          <SingleChoice title="Cor da faixa central (12h)" options={COR_FAIXA} value={single.faixa} onChange={(v) => setSingle((s) => ({ ...s, faixa: v }))} />

          <Section title="Extras">
            <div className="grid sm:grid-cols-2 gap-2">
              {EXTRAS.map((e) => {
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
            <MessageCircle className="h-4 w-4 mr-2" /> Enviar por WhatsApp
          </Button>
          <a href={mailHref} className="block">
            <Button type="button" variant="outline" className="w-full rounded-none h-12 uppercase tracking-wider text-xs">
              <Mail className="h-4 w-4 mr-2" /> Enviar por Email
            </Button>
          </a>

          {sent && (
            <p className="text-xs text-primary">Abrimos o WhatsApp numa nova janela. Confirma o envio para nós.</p>
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
