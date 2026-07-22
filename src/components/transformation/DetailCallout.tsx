import { motion } from "framer-motion";

type DetailCalloutProps = {
  label: string;
  xPercent: number;
  yPercent: number;
  visible: boolean;
};

/**
 * Posicionamento (translate -50%/-50% estático) fica num wrapper simples —
 * o framer-motion escreve `transform` diretamente no elemento animado, por
 * isso a centragem e a animação nunca podem viver na mesma tag sem se pisarem.
 */
export function DetailCallout({ label, xPercent, yPercent, visible }: DetailCalloutProps) {
  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{ left: `${xPercent}%`, top: `${yPercent}%`, transform: "translate(-50%, -50%)" }}
    >
      <motion.span
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 10,
          filter: visible ? "blur(0px)" : "blur(6px)",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex items-center whitespace-nowrap border border-white/25 bg-background/85 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md"
      >
        {label}
      </motion.span>
    </div>
  );
}
