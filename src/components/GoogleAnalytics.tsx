// Integração Google Analytics 4.
// O ID de medição vem de uma variável de ambiente pública (VITE_GA_MEASUREMENT_ID),
// nunca fica escrito diretamente no código.
//
// Como configurar:
// 1. Cria a propriedade GA4 em https://analytics.google.com e obtém o ID (formato G-XXXXXXXXXX).
// 2. Adiciona ao ficheiro .env: VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
// 3. Reinicia o servidor de dev / faz novo deploy.
//
// Este componente só carrega o script se:
//   a) o ID estiver configurado, e
//   b) o utilizador já tiver aceitado cookies de analytics no banner de consentimento.
import { useEffect } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn("[GA4] VITE_GA_MEASUREMENT_ID não está definido — analytics desativado.");
      return;
    }
    if (consent !== "accepted") return;
    if (document.getElementById("ga4-script")) return; // já carregado

    const script = document.createElement("script");
    script.id = "ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    // anonymize_ip: reforça a privacidade, recomendado para conformidade RGPD.
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  }, [consent]);

  return null;
}
