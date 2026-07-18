import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — REDLINE Performance" },
      {
        name: "description",
        content: "Como a REDLINE Performance recolhe, usa e protege os teus dados pessoais.",
      },
      { property: "og:title", content: "Política de Privacidade — REDLINE Performance" },
      { property: "og:url", content: "/privacidade" },
    ],
    links: [{ rel: "canonical", href: "/privacidade" }],
  }),
  component: PrivacyPage,
});

// NOTA IMPORTANTE: este texto é um ponto de partida genérico, não é aconselhamento jurídico.
// Antes de publicar, revê com atenção (ou com um advogado/consultor RGPD) os seguintes pontos,
// que dependem de decisões tuas de negócio:
//   - Entidade legal responsável, morada e NIF/NIPC
//   - Encarregado de Proteção de Dados (se aplicável)
//   - Prazos exatos de retenção de dados
//   - Lista completa de subcontratantes (Supabase, Shopify, Google Analytics, etc.)
function PrivacyPage() {
  return (
    <div className="container-premium py-16 md:py-24 max-w-3xl">
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Legal</div>
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Política de Privacidade</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Última atualização: {new Date().toLocaleDateString("pt-PT")}
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Quem somos</h2>
          <p>
            A REDLINE Performance ("nós") é responsável pelo tratamento dos dados pessoais
            recolhidos através deste site. Para questões sobre os teus dados, contacta-nos através
            da página de{" "}
            <a href="/contact" className="underline hover:text-primary">
              Contacto
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Que dados recolhemos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Dados de conta: nome, email, ao criares conta ou autenticares-te no site.</li>
            <li>
              Dados de encomenda: processados de forma segura pelo Shopify no momento do checkout.
            </li>
            <li>
              Dados de navegação: páginas visitadas e interações, através do Google Analytics
              (apenas se aceitares os cookies de analytics).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Cookies</h2>
          <p>
            Usamos cookies essenciais (necessários ao funcionamento do site, como o carrinho de
            compras) e cookies de analytics (Google Analytics), que só são ativados após o teu
            consentimento explícito no banner apresentado na primeira visita. Podes alterar a tua
            escolha a qualquer momento limpando os dados de navegação do teu browser para este site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            4. Com quem partilhamos dados
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Supabase</strong> — armazenamento seguro de dados de conta/autenticação.
            </li>
            <li>
              <strong>Shopify</strong> — processamento de encomendas e pagamentos.
            </li>
            <li>
              <strong>Google Analytics</strong> — estatísticas de utilização do site (com IPs
              anonimizados).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Os teus direitos (RGPD)</h2>
          <p>
            Tens o direito de aceder, corrigir, apagar ou exportar os teus dados pessoais, e de
            retirar o consentimento para cookies de analytics a qualquer momento. Contacta-nos para
            exercer estes direitos.
          </p>
        </section>
      </div>
    </div>
  );
}
