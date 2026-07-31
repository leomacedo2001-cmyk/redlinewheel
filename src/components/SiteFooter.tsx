import { useEffect, useRef, useState } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import signatureImage from "@/assets/footer/post-footer-wordmark.jpg";

const EASE = "cubic-bezier(0.22,1,0.36,1)";

/** Curva/duração partilhadas por todo o footer — pedido explícito de
 * consistência absoluta entre entrada, hover de link e hover de coluna. */
const linkTransition = `transition-all duration-300 ease-[${EASE}]`;

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

/** Link de navegação interna do footer: no hover desloca 4px para a direita,
 * o texto passa a branco e um sublinhado vermelho fino cresce da esquerda. */
function FooterLink({
  className = "",
  children,
  ...linkProps
}: LinkProps & { className?: string; children: React.ReactNode }) {
  return (
    <Link
      {...linkProps}
      className={`group/link relative inline-flex w-fit items-center text-[15px] text-muted-foreground ${linkTransition} hover:translate-x-1 hover:text-foreground ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary ${linkTransition} group-hover/link:scale-x-100`}
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
      className={`group/link relative inline-flex w-fit items-center text-[15px] text-muted-foreground ${linkTransition} hover:translate-x-1 hover:text-foreground ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary ${linkTransition} group-hover/link:scale-x-100`}
      />
    </a>
  );
}

/** O único CTA vermelho do footer — mesma mecânica de deslocamento, mas sem
 * sublinhado (já se distingue pela cor) e com a seta a acompanhar o hover. */
function FooterCta({ to, children }: { to: LinkProps["to"]; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`group/link mt-7 inline-flex w-fit items-center gap-1.5 text-[15px] font-medium text-primary ${linkTransition} hover:translate-x-1`}
    >
      {children}
      <ArrowRight
        className={`h-3.5 w-3.5 ${linkTransition} group-hover/link:translate-x-1`}
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

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

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

  const reveal = () => (isInView ? "animate-footer-reveal" : "opacity-0");
  const revealStyle = (delayMs: number) => (isInView ? { animationDelay: `${delayMs}ms` } : undefined);

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-white/6 bg-[#050505] mt-24">
      {/* Fio de luz neutro no topo — mesma "profundidade sem gradiente" já usada antes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* ZONA SUPERIOR — 5 colunas em desktop, 2 em tablet, 1 em mobile. */}
      <div className="container-premium relative py-20 md:py-24">
        <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className={reveal()} style={revealStyle(0)}>
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
              <li>
                <FooterLink to="/c/$slug" params={{ slug: "patilhas" }}>
                  PaddleShift
                </FooterLink>
              </li>
            </ul>
          </div>

          <div className={`lg:border-l lg:border-white/6 lg:pl-8 ${reveal()}`} style={revealStyle(80)}>
            <ColumnLabel>Redline</ColumnLabel>
            <ul className="space-y-4">
              <li>
                <FooterLink to="/about">Sobre Nós</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">O Nosso Processo</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">Qualidade</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">Garantia</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">FAQs</FooterLink>
              </li>
            </ul>
          </div>

          <div className={`lg:border-l lg:border-white/6 lg:pl-8 ${reveal()}`} style={revealStyle(160)}>
            <ColumnLabel>Contacto</ColumnLabel>
            <ul className="space-y-4">
              <li>
                <FooterAnchor href="mailto:info@redlinewheels.com">info@redlinewheels.com</FooterAnchor>
              </li>
              <li>
                <FooterAnchor href="tel:+351910123456">+351 910 123 456</FooterAnchor>
              </li>
              <li className="text-[15px] text-muted-foreground">Vila Nova de Gaia, Portugal</li>
            </ul>
            <FooterCta to="/contact">Fala connosco</FooterCta>
          </div>

          <div className={`lg:border-l lg:border-white/6 lg:pl-8 ${reveal()}`} style={revealStyle(240)}>
            <ColumnLabel>Siga-nos</ColumnLabel>
            <ul className="space-y-4">
              <li>
                <FooterAnchor href="https://instagram.com/redlineperformance" external>
                  Instagram
                </FooterAnchor>
              </li>
              <li>
                <FooterAnchor href="https://facebook.com/redlineperformance" external>
                  Facebook
                </FooterAnchor>
              </li>
              <li>
                <FooterAnchor href="https://youtube.com/@redlineperformance" external>
                  YouTube
                </FooterAnchor>
              </li>
              <li>
                <FooterAnchor href="https://tiktok.com/@redlineperformance" external>
                  TikTok
                </FooterAnchor>
              </li>
            </ul>
          </div>

          {/* Coluna direita — elemento minimalista com linha vertical vermelha,
              que cresce (scaleY 0→1) só quando o footer entra em viewport. */}
          <div
            className={`flex items-stretch justify-start gap-4 lg:justify-end lg:border-l lg:border-white/6 lg:pl-8 ${reveal()}`}
            style={revealStyle(320)}
          >
            <span
              aria-hidden="true"
              className="w-px origin-top bg-primary/70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: isInView ? "scaleY(1)" : "scaleY(0)" }}
            />
            <span className="self-end whitespace-nowrap pb-0.5 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              07<span className="mx-1 text-muted-foreground/40">/</span>
              <span className="text-primary">REDLINE</span>
            </span>
          </div>
        </div>
      </div>

      {/* Separador premium — quase invisível, com um leve tom quente ao centro. */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent"
      />

      {/* ZONA INFERIOR — copyright / tagline / assinatura de performance. */}
      <div className="container-premium py-7">
        <div
          className={`grid grid-cols-1 gap-4 text-xs text-muted-foreground sm:grid-cols-3 sm:items-center ${reveal()}`}
          style={revealStyle(380)}
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
        </div>
      </div>

      {/* Linha separadora — o mesmo fio quase invisível, mesmo mote de
          "profundidade sem gradiente forte" usado no resto do footer. */}
      <div aria-hidden="true" className="h-px w-full bg-white/6" />

      {/* ASSINATURA REDLINE — faixa panorâmica, mesmo container do resto do
          footer (alinha com as colunas acima). Crop, nunca resize: altura
          dada por aspect-ratio (1716/492 — a proporção medida diretamente
          na referência enviada), largura sempre 100% — nunca corta
          lateralmente, só topo/base via object-cover. Sem padding, sem
          margem, sem fundo extra: o único elemento entre o footer e a
          imagem é o fio divisor acima. */}
      <div className={`container-premium ${reveal()}`} style={revealStyle(400)}>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1716 / 492" }}>
          <img
            src={signatureImage}
            alt="REDLINE"
            className="absolute inset-0 h-full w-full object-cover object-center select-none"
          />
        </div>
      </div>
    </footer>
  );
}
