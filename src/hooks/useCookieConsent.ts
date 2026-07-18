import { useEffect, useState } from "react";

export type ConsentValue = "accepted" | "rejected" | null;

const STORAGE_KEY = "redline_cookie_consent";

function readStoredConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

// Hook partilhado: o banner e o GoogleAnalytics leem/escrevem o mesmo estado,
// para que ativar analytics após aceitar cookies aconteça sem recarregar a página.
export function useCookieConsent() {
  const [consent, setConsentState] = useState<ConsentValue>(null);

  useEffect(() => {
    setConsentState(readStoredConsent());
  }, []);

  function setConsent(value: Exclude<ConsentValue, null>) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsentState(value);
  }

  return { consent, setConsent };
}
