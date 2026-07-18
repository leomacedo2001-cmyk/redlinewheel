import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/useCookieConsent";

// Banner de consentimento de cookies (obrigatório na UE por causa do RGPD/ePrivacy).
// Só aparece enquanto o utilizador não tiver decidido (aceitar/rejeitar).
// A decisão fica guardada no browser (localStorage) e o GoogleAnalytics só
// carrega depois de "accepted".
export function CookieConsentBanner() {
  const { consent, setConsent } = useCookieConsent();

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container-premium flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground max-w-2xl">
          Usamos cookies para analisar o tráfego do site e melhorar a tua experiência. Podes aceitar
          ou rejeitar os cookies de analytics. Para mais detalhes, consulta a nossa{" "}
          <Link to="/privacidade" className="underline hover:text-primary">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" className="rounded-none" onClick={() => setConsent("rejected")}>
            Rejeitar
          </Button>
          <Button
            className="rounded-none bg-primary hover:bg-primary/90"
            onClick={() => setConsent("accepted")}
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
