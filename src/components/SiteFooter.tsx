import { useEffect, useRef, useState } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AmbientGlow } from "@/components/AmbientGlow";

import signatureImage from "@/assets/footer/post-footer-wordmark.jpg";

/** Curva única partilhada por toda a entrada do footer — o mesmo
 * cubic-bezier já usado em todo o site, para a entrada nunca destoar. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Hover de link: 3px, 250ms — nunca mais, nunca mais rápido. Premium é
 * restrição, não velocidade. */
const linkHover =
  "transition-[color,transform] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-[3px] hover:text-foreground";

/** Label pequeno acima de cada coluna — maiúsculas, tracking largo, ponto
 * vermelho ao lado, exatamente como na referência. */
function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#b3b3b3]">
      {children}
      <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-primary" />
    </div>
  );
}

/** Link de navegação interna do footer: no hover desloca 3px, o texto
 * passa a branco e um sublinhado vermelho fino cresce da esquerda. */
function FooterLink({
  className = "",
  children,
  ...linkProps
}: LinkProps & { className?: string; children: React.ReactNode }) {
  return (
    <Link {...linkProps} className={`group/link relative inline-flex w-fit items-center text-[15px] text-muted-foreground ${linkHover} ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100"
      />
    </Link>
  );
}

/** Mesma interação do FooterLink, para endereços externos/mailto/tel — que
 * não passam pelo router. */
function FooterAnchor({
  href,
  external = false,
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group/link relative inline-flex w-fit items-center text-[15px] text-muted-foreground ${linkHover} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100"
      />
    </a>
  );
}

/** O único CTA vermelho do footer: hover desloca 4px, o ícone acompanha,
 * a luminosidade sobe ligeiramente e um sublinhado fino aparece — 280ms. */
function FooterCta({ to, children }: { to: LinkProps["to"]; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group/link relative mt-7 inline-flex w-fit items-center gap-1.5 text-[15px] font-medium text-primary transition-[transform,filter] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:brightness-125"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-1" />
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100"
      />
    </Link>
  );
}

/** Equalizer minimalista — cinco barras vermelhas com um pulsar
 * extremamente subtil, nunca chamativo. */
function Equalizer() {
  const bars = [45, 75, 100, 60, 85];
  return (
    <span aria-hidden="true" className="inline-flex h-3.5 items-end gap-[3px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[2.5px] origin-bottom animate-eq-bar rounded-full bg-primary"
          style={{ height: `${h}%`, animationDelay: `${i * 140}ms` }}
        />
      ))}
    </span>
  );
}

/** Divisor vertical animado: cresce de scaleY(0) para scaleY(1) a partir
 * do topo, uma única vez, quando o footer entra em viewport — substitui o
 * antigo border-l estático (uma borda CSS não é anima­vel de forma
 * performante). */
function ColumnDivider({ show, delay }: { show: boolean; delay: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-white/6 lg:block"
      style={{ transformOrigin: "top", willChange: "transform" }}
      initial={{ scaleY: 0 }}
      animate={show ? { scaleY: 1 } : {}}
      transition={{ duration: 1, ease: EASE, delay }}
    />
  );
}

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A assinatura tem o seu próprio gatilho de viewport — o footer é alto
  // demais para "isInView" (que dispara ao ver só o topo) coincidir com o
  // instante em que a assinatura em si fica visível.
  const signatureRef = useRef<HTMLDivElement>(null);
  const signatureInView = useInView(signatureRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({ target: signatureRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-4, 4]);

  const col = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <footer ref={footerRef} className="relative isolate overflow-hidden border-t border-white/6 bg-black mt-24">
      {/* Ambient light no início do footer — mesmo componente/padrão usado
          em todas as restantes secções do site (BrandShowcase,
          FeedbackShowcase, RedlineDifference, etc.), para o footer também
          ler-se como continuação, não como um bloco à parte. */}
      <AmbientGlow edge="top" />

      {/* Fio de luz neutro no topo — mesma "profundidade sem gradiente" já usada antes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* ZONA SUPERIOR — 4 colunas em desktop (proporção 1.3/1/1/1.5 — as
          duas centrais iguais, as exteriores maiores), 2 em tablet, 1 em
          mobile. Stagger de entrada 60ms: Navegação → Redline → Contacto →
          Siga-nos → Barra vermelha (por último). O indicador "07/REDLINE"
          NÃO é uma 5ª coluna dividida — vive fora deste grid (ver abaixo)
          para poder alinhar-se com a largura total da página. */}
      <div className="container-premium relative py-20 md:py-24">
        <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.5fr]">
          <motion.div {...col(0)}>
            <ColumnLabel>Navegação</ColumnLabel>
            <ul className="space-y-4">
              <li>
                <FooterLink to="/">Início</FooterLink>
              </li>
              <li>
                <FooterLink to="/marcas">Marcas</FooterLink>
              </li>
              <li>
                <FooterLink to="/products">Produtos</FooterLink>
              </li>
              <li>
                <FooterLink to="/configurator">Personalizações</FooterLink>
              </li>
              <li>
                <FooterLink to="/acessorios">Acessórios</FooterLink>
              </li>
            </ul>
          </motion.div>

          <motion.div className="relative lg:pl-8" {...col(0.06)}>
            <ColumnDivider show={isInView} delay={0.06} />
            <ColumnLabel>Redline</ColumnLabel>
            <ul className="space-y-4">
              <li>
                <FooterLink to="/about" hash="sobre-nos">
                  Sobre Nós
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/about" hash="processo">
                  O Nosso Processo
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/about" hash="qualidade">
                  Qualidade
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/about" hash="garantia">
                  Garantia
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/about" hash="faq">
                  FAQs
                </FooterLink>
              </li>
            </ul>
          </motion.div>

          <motion.div className="relative lg:pl-8" {...col(0.12)}>
            <ColumnDivider show={isInView} delay={0.12} />
            <ColumnLabel>Contacto</ColumnLabel>
            <ul className="space-y-4">
              <li>
                <FooterAnchor href="mailto:redlinecustomsauto@gmail.com">redlinecustomsauto@gmail.com</FooterAnchor>
              </li>
              <li className="text-[15px] text-muted-foreground">Vila Nova de Gaia, Portugal</li>
            </ul>
            <FooterCta to="/contact">Fala connosco</FooterCta>
          </motion.div>

          <motion.div className="relative lg:pl-8" {...col(0.18)}>
            <ColumnDivider show={isInView} delay={0.18} />
            <ColumnLabel>Siga-nos</ColumnLabel>
            <ul className="space-y-4">
              <li>
                <FooterAnchor href="https://www.facebook.com/profile.php?id=61591677547923" external>
                  Facebook
                </FooterAnchor>
              </li>
            </ul>

          </motion.div>

          {/* Indicador "07/REDLINE" — versão mobile/tablet, em fluxo normal
              logo a seguir à grid (abaixo de lg a versão precisa fica
              escondida, ver mais abaixo). */}
          <motion.div className="flex items-center gap-4 lg:hidden" {...col(0.24)}>
            <span className="whitespace-nowrap text-xs uppercase tracking-[0.28em] text-muted-foreground">
              07<span className="mx-1 text-muted-foreground/40">/</span>
              <span className="text-primary">REDLINE</span>
            </span>
            <motion.span
              aria-hidden="true"
              className="h-[2px] w-10 origin-left bg-[#FF1A1A]"
              style={{ willChange: "transform" }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.24 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Indicador "07/REDLINE" — versão desktop precisa: fora do
          container-premium (que satura a 1400px) de propósito, para o
          eixo da barra acompanhar a largura real da página em qualquer
          monitor — exatamente como a assinatura por baixo, que também é
          full-bleed. "right" em % (não px) para o alinhamento com a última
          letra "E" da assinatura se manter em qualquer largura de ecrã.
          Entra por último no stagger (delay 0.24s) e cresce de altura 0
          para 120px via scaleY — nunca anima a propriedade height. */}
      <motion.div
        className="pointer-events-none absolute right-[3.4%] top-[136px] hidden items-center gap-4 lg:flex"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.24 }}
      >
        <span className="whitespace-nowrap text-xs uppercase tracking-[0.28em] text-muted-foreground">
          07<span className="mx-1 text-muted-foreground/40">/</span>
          <span className="text-primary">REDLINE</span>
        </span>
        <motion.span
          aria-hidden="true"
          className="h-[120px] w-[2px] origin-top bg-[#FF1A1A]"
          style={{ willChange: "transform" }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.24 }}
        />
      </motion.div>

      {/* Separador premium — quase invisível, com um leve tom quente ao centro. */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent"
      />

      {/* ZONA INFERIOR — copyright / tagline / assinatura de performance. */}
      <div className="container-premium py-7">
        <motion.div
          className="grid grid-cols-1 gap-4 text-xs text-muted-foreground sm:grid-cols-3 sm:items-center"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        >
          <span className="sm:text-left">
            © REDLINE Performance. Todos os direitos reservados.
          </span>
          <span className="font-medium uppercase tracking-[0.3em] text-primary sm:text-center">
            / Built to Perform /
          </span>
          <span className="flex items-center gap-2.5 sm:justify-end sm:text-right">
            Desempenho. Precisão. Personalização.
            <Equalizer />
          </span>
        </motion.div>
      </div>

      {/* ASSINATURA REDLINE — nasce diretamente do footer: mesmo fundo
          preto, sem linha, sem sombra, sem gap. Fade puro (sem
          translateY) em 1400ms, com o seu próprio gatilho de viewport.
          Afinação fina sobre a simetria matemática (center): +0.5% no eixo
          Y ("subir" a imagem) para corrigir o resíduo que o corte 100%
          simétrico ainda deixava. A imagem em si fica 0.5% menor que a
          própria caixa (inset em vez de inset-0), o que dá um ligeiro
          corte extra nas letras nas quatro arestas — a margem resultante
          é preenchida com a mesma cor de fundo do footer (#050505), nunca
          com o próprio conteúdo da foto, por isso nunca aparece como uma
          "moldura" visível, só como fundo a continuar. Parallax
          extremamente subtil (±4px) ligado ao scroll, e uma respiração de
          brilho quase impercetível (98%→100%) via CSS — nunca glow, nunca
          neon. */}
      <div ref={signatureRef} className="relative w-full overflow-hidden" style={{ height: "clamp(140px, 24vw, 388px)" }}>
        <motion.div
          className={`absolute inset-0 bg-[#050505] ${prefersReducedMotion ? "" : "animate-signature-breathe"}`}
          initial={{ opacity: 0 }}
          animate={signatureInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <motion.img
            src={signatureImage}
            alt="REDLINE"
            className="absolute select-none object-cover"
            style={{
              top: "0.5%",
              left: "0.5%",
              width: "calc(100% - 1%)",
              height: "calc(100% - 1%)",
              objectPosition: "50% 50.5%",
              y: parallaxY,
              willChange: "transform",
            }}
          />
        </motion.div>
      </div>
    </footer>
  );
}
