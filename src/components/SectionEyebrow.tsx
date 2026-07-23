type SectionEyebrowProps = {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Rótulo técnico partilhado por todas as secções do fim da homepage — o
 * pequeno ponto vermelho é o mesmo acento "indicador técnico" que já existe
 * na secção Transformação, reutilizado aqui para dar continuidade visual à
 * medida que se desce a página (nunca redesenha a Transformação em si).
 */
export function SectionEyebrow({ children, align = "left", className = "", style }: SectionEyebrowProps) {
  return (
    <div
      style={style}
      className={`flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <span className="h-1 w-1 shrink-0 rounded-full bg-primary shadow-[0_0_6px_oklch(0.58_0.22_25/0.7)]" />
      {children}
    </div>
  );
}
