import { useLayoutEffect, useState } from "react";

const STORAGE_KEY = "redline_preloader_last_seen";
const THIRTY_MIN_MS = 30 * 60 * 1000;

/**
 * Decide se o pre-loader deve aparecer — primeira visita ou 30+ minutos
 * desde a última. Usa useLayoutEffect (não useEffect) de propósito: o React
 * adia a primeira pintura até os layout effects terminarem, por isso a
 * decisão fica pronta antes do browser pintar o primeiro frame — nunca há
 * um "flash" do site por baixo antes do overlay aparecer, e nas visitas que
 * não devem mostrar o pre-loader ele nunca chega a ser pintado.
 */
export function usePreloaderGate(): boolean {
  const [shouldShow, setShouldShow] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const last = window.localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    const show = !last || now - Number(last) > THIRTY_MIN_MS;
    if (show) window.localStorage.setItem(STORAGE_KEY, String(now));
    setShouldShow(show);
  }, []);

  return shouldShow;
}
