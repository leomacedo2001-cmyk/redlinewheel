import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePreloaderGate } from "@/hooks/usePreloaderGate";

const HOLD_MS = 800;
const EXIT_DURATION_S = 0.32;

/**
 * Overlay de entrada — só na primeira visita ou 30+ min depois da última
 * (ver usePreloaderGate). Nunca bloqueia a renderização: o conteúdo da
 * página já está todo presente por baixo (SSR), o overlay só cobre
 * visualmente durante ~0.8s (nunca mais de 1.2s no total, incluindo saída).
 */
export function SitePreloader() {
  const shouldShow = usePreloaderGate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!shouldShow) return;
    const timer = setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  return (
    <AnimatePresence>
      {shouldShow && visible && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-background"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: EXIT_DURATION_S, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* o "ponto a acender" — mesma técnica de glow já usada no ícone da secção CTA */}
            <motion.span
              aria-hidden="true"
              className="absolute -right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-primary blur-xl"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.55, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            />
            <span className="relative text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              REDLINE<span className="text-primary">.</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
