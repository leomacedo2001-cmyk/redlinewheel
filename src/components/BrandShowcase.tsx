import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { AmbientGlow } from "@/components/AmbientGlow";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { ACTIVE_BRAND_SHOWCASE_SLIDES } from "@/lib/brandShowcase";

/**
 * Secção "Marcas" — configurador cinematográfico controlado por scroll,
 * com avanço automático opcional. A secção fica pinada (GSAP ScrollTrigger,
 * `pin: true`) enquanto o utilizador percorre cada marca; o scroll é
 * traduzido em progresso contínuo — nunca há um "salto" entre marcas nem
 * entre scroll para cima/baixo, porque tudo deriva do mesmo valor contínuo
 * (`self.progress`), incluindo o comportamento inverso (que por isso não
 * precisa de nenhuma lógica própria: é a mesma matemática, só que a
 * decrescer).
 *
 * Cada marca "vive" numa fatia igual do scroll total (`1/N`). Dentro de
 * cada fatia: os primeiros `BOUNDARY` (70%) enchem a barra dessa marca
 * (imagem/texto continuam assentes, só uma respiração muito subtil ligada
 * a `barT`); os últimos 30% são a transição cinematográfica para a marca
 * seguinte (fade, blur, zoom-out, rotação ~1°, parallax) — sempre
 * derivada da posição de scroll, nunca de um timer, por isso é
 * perfeitamente reversível a qualquer instante.
 *
 * Avanço automático: assim que a secção pina, um `requestAnimationFrame`
 * empurra a própria posição de scroll a um ritmo constante (nunca um
 * estado paralelo — como tudo deriva de `self.progress`, o avanço
 * automático e o manual são perfeitamente intercambiáveis a qualquer
 * instante). Qualquer scroll/toque/tecla/clique genuíno do utilizador
 * pára-o exatamente onde estava; ao fim de `AUTOPLAY_RESUME_DELAY_MS` sem
 * nova interação, retoma sozinho. Para ao alcançar a última marca — nunca
 * empurra o utilizador para a secção seguinte sem ação sua.
 */

const BOUNDARY = 0.7;
const MIN_SEGMENT_PX = 560;
/** Altura do cabeçalho fixo (SiteHeader, h-16). Centrar a caixa pinada no
 * VIEWPORT inteiro (`center center`) dava um gap de cima mais pequeno que
 * o de baixo em qualquer altura de ecrã — o cabeçalho "come" 64px só do
 * lado de cima, nunca do lado de baixo. Deslocar o ponto de centragem
 * metade dessa altura (32px) para baixo faz a caixa centrar-se no espaço
 * ABAIXO do cabeçalho, não no ecrã inteiro — os dois gaps ficam iguais,
 * qualquer que seja a altura da janela (a prova está em baixo, no `start`). */
const HEADER_HEIGHT_PX = 64;
/** Opacidade máxima da cortina de fundo — nunca 1 (opaco): a secção
 * "Transformação" (por cima) continua visível, só desvanecida, nunca
 * desaparece por completo. */
const BACKDROP_MAX_OPACITY = 0.55;
/** Opacidade máxima da pré-visualização de "Comunidade REDLINE" (por
 * baixo). O GSAP pin-spacer ocupa toda a distância de scroll das 4 marcas
 * — o DOM real da secção seguinte só entra no ecrã depois do pin libertar,
 * nunca durante ele, por isso não há "conteúdo real" nenhum para desvanecer
 * ali (confirmado via elementFromPoint: aquele ponto cai sempre dentro do
 * próprio pin-spacer). Esta legenda é uma antevisão deliberada — mesmo
 * texto da abertura de FeedbackShowcase — não a secção real a espreitar. */
const BOTTOM_PREVIEW_MAX_OPACITY = 0.6;
/** Quanto tempo o avanço automático demora a percorrer UMA marca inteira
 * (encher a barra + transição). Recalculado a partir do próprio segmento
 * de scroll (getSegmentPx), por isso o ritmo em segundos fica sempre igual
 * independentemente da altura do ecrã, mesmo a distância em px variando. */
const AUTOPLAY_SEGMENT_DURATION_MS = 6000;
/** Tempo de inatividade (sem scroll/toque/teclado/clique nas abas) antes de
 * o avanço automático retomar sozinho. */
const AUTOPLAY_RESUME_DELAY_MS = 10000;
/** Janela de graça após o pin engatar durante a qual eventos "wheel"
 * residuais do MESMO gesto que causou o pin não contam como "o utilizador
 * pediu controlo manual" — ver `pinEnterTimeRef`. */
const AUTOPLAY_ENTER_GRACE_MS = 700;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Remapeia `t` (0–1) para a janela [a,b], sujeito a clamp — usado para dar
 * a cada elemento (imagem/título/descrição/botão) a sua própria janela
 * dentro da fase de transição, em vez de todos desvanecerem sobre a mesma
 * janela inteira (o que sobrepunha o texto a sair com o texto a entrar,
 * ilegível a meio da transição). */
function remap01(t: number, a: number, b: number): number {
  if (a === b) return t < a ? 0 : 1;
  return Math.max(0, Math.min(1, (t - a) / (b - a)));
}

type GsapVars = Parameters<typeof gsap.set>[1];
function setEl(el: Element | null, vars: GsapVars) {
  if (el) gsap.set(el, vars);
}

export function BrandShowcase() {
  const slides = ACTIVE_BRAND_SHOWCASE_SLIDES;
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const buttonWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const backdropRef = useRef<HTMLDivElement>(null);
  const bottomPreviewRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef(0);
  const autoplayRafRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const isPinnedRef = useRef(false);
  // Instante em que o pin engatou pela última vez — o mesmo gesto de
  // scroll que faz a secção fixar continua a disparar eventos "wheel"
  // durante mais uns instantes (a mesma rodela/gesto de trackpad dispara
  // vários eventos discretos); sem esta janela de graça, essa cauda do
  // MESMO gesto parava imediatamente o avanço automático que o onEnter
  // acabou de arrancar, obrigando à espera de 10s completos antes de
  // sequer começar a mexer-se.
  const pinEnterTimeRef = useRef(0);
  // Preenchidas dentro do efeito — permitem que `handleTabClick` (fora do
  // gsap.context, mas ainda um clique deliberado do utilizador) pare e
  // reagende o avanço automático tal como o scroll/toque/teclado.
  const stopAutoplayRef = useRef<() => void>(() => {});
  const scheduleResumeRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (typeof window === "undefined" || !pinRef.current || slides.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);

    const n = slides.length;
    const reduced = !!prefersReducedMotion;
    const getSegmentPx = () => Math.max(window.innerHeight, MIN_SEGMENT_PX);
    const getAutoplayPxPerMs = () => getSegmentPx() / AUTOPLAY_SEGMENT_DURATION_MS;

    // Avanço automático — vive fora do gsap.context (não é um tween GSAP,
    // é o próprio scroll da página) para `handleTabClick` (fora deste
    // efeito) e a limpeza do efeito conseguirem chamar as mesmas funções.
    const stopAutoplay = () => {
      if (autoplayRafRef.current !== null) {
        cancelAnimationFrame(autoplayRafRef.current);
        autoplayRafRef.current = null;
      }
    };

    const clearInactivityTimer = () => {
      if (inactivityTimerRef.current !== null) {
        window.clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };

    // Avança a própria posição de scroll a um ritmo constante — nunca um
    // estado paralelo: como tudo (barra, crossfade, aba ativa) já deriva
    // de `self.progress` no onUpdate, empurrar o scroll real mantém o
    // avanço automático e o manual perfeitamente intercambiáveis a
    // qualquer instante, sem nenhuma lógica duplicada.
    const startAutoplay = () => {
      if (reduced || !isPinnedRef.current || autoplayRafRef.current !== null) return;
      const st = scrollTriggerRef.current;
      if (!st || st.progress >= 1) return;
      let lastTime = performance.now();
      const tick = (now: number) => {
        const current = scrollTriggerRef.current;
        if (!current || !isPinnedRef.current) {
          autoplayRafRef.current = null;
          return;
        }
        // Limitado a 100ms — um separador em segundo plano (mudar de
        // separador, minimizar) atrasa o próximo requestAnimationFrame por
        // vezes muito além disso; sem este limite, esse hiato inteiro
        // seria empurrado de uma vez para o scroll ao voltar ao separador,
        // saltando marcas em vez de avançar suavemente.
        const deltaMs = Math.min(now - lastTime, 100);
        lastTime = now;
        // Fica 2px aquém de `current.end`, nunca em cima dele — o GSAP
        // liberta o pin assim que o scroll ATINGE o fim do trigger (não só
        // quando o ultrapassa), por isso parar exatamente em cima do limite
        // já era o suficiente para o libertar sozinho, empurrando o
        // utilizador para "Comunidade REDLINE" sem ação sua nenhuma.
        const endGuard = current.end - 2;
        const target = Math.min(window.scrollY + getAutoplayPxPerMs() * deltaMs, endGuard);
        window.scrollTo(0, target);
        if (target >= endGuard) {
          autoplayRafRef.current = null;
          return;
        }
        autoplayRafRef.current = requestAnimationFrame(tick);
      };
      autoplayRafRef.current = requestAnimationFrame(tick);
    };

    const scheduleResume = () => {
      clearInactivityTimer();
      inactivityTimerRef.current = window.setTimeout(() => {
        inactivityTimerRef.current = null;
        if (isPinnedRef.current) startAutoplay();
      }, AUTOPLAY_RESUME_DELAY_MS);
    };

    // Qualquer interação genuína (scroll/toque/teclado — nunca o próprio
    // `window.scrollTo` do autoplay, que não dispara nenhum destes eventos)
    // pára o avanço automático exatamente onde estava e reinicia a janela
    // de 10s de inatividade.
    const handleUserInteraction = () => {
      if (!isPinnedRef.current) return;
      // Ignora a cauda de eventos "wheel" do MESMO gesto que acabou de
      // fazer o pin engatar — ver AUTOPLAY_ENTER_GRACE_MS.
      if (performance.now() - pinEnterTimeRef.current < AUTOPLAY_ENTER_GRACE_MS) return;
      stopAutoplay();
      scheduleResume();
    };

    stopAutoplayRef.current = () => {
      stopAutoplay();
      clearInactivityTimer();
    };
    scheduleResumeRef.current = scheduleResume;

    const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Spacebar", "Home", "End"]);
    const onWheel = () => handleUserInteraction();
    const onTouchStart = () => handleUserInteraction();
    const onKeyDown = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) handleUserInteraction();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    const ctx = gsap.context(() => {
      slides.forEach((_, i) => {
        setEl(imageWrapRefs.current[i], { opacity: i === 0 ? 1 : 0, scale: 1, rotate: 0, y: 0, filter: "blur(0px)" });
        setEl(titleRefs.current[i], { opacity: i === 0 ? 1 : 0, y: 0, filter: "blur(0px)" });
        setEl(descRefs.current[i], { opacity: i === 0 ? 1 : 0 });
        setEl(buttonWrapRefs.current[i], { opacity: i === 0 ? 1 : 0, scale: 1 });
        setEl(barFillRefs.current[i], { scaleX: 0 });
      });

      const fadeBackdrop = (visible: boolean) => {
        const el = backdropRef.current;
        if (el) gsap.to(el, { opacity: visible ? BACKDROP_MAX_OPACITY : 0, duration: reduced ? 0 : 0.4, overwrite: true });
        const preview = bottomPreviewRef.current;
        if (preview) gsap.to(preview, { opacity: visible ? BOTTOM_PREVIEW_MAX_OPACITY : 0, duration: reduced ? 0 : 0.4, overwrite: true });
      };

      const st = ScrollTrigger.create({
        trigger: pinRef.current,
        // A secção pina assim que se apresenta centrada no ecrã (não só
        // quando o topo encosta ao cabeçalho). "center+=HEADER/2" desloca
        // esse centro para o meio do espaço ABAIXO do cabeçalho (ver
        // HEADER_HEIGHT_PX acima) — sem isto, o gap de cima ficava sempre
        // 64px mais pequeno que o de baixo, e em ecrãs mais baixos
        // desaparecia por completo (era exatamente isso que faltava
        // ver no fim de "Transformação"). Como o pin fixa o elemento
        // exatamente onde estava no instante do disparo, a posição final
        // passa a ser essa composição centrada (com os dois gaps iguais),
        // em vez de "encostada" ao cabeçalho.
        start: `center center+=${HEADER_HEIGHT_PX / 2}`,
        end: () => `+=${n * getSegmentPx()}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          fadeBackdrop(true);
          isPinnedRef.current = true;
          pinEnterTimeRef.current = performance.now();
          startAutoplay();
        },
        onEnterBack: () => {
          fadeBackdrop(true);
          isPinnedRef.current = true;
          pinEnterTimeRef.current = performance.now();
          startAutoplay();
        },
        onLeave: () => {
          fadeBackdrop(false);
          isPinnedRef.current = false;
          stopAutoplay();
          clearInactivityTimer();
        },
        onLeaveBack: () => {
          fadeBackdrop(false);
          isPinnedRef.current = false;
          stopAutoplay();
          clearInactivityTimer();
        },
        onUpdate: (self) => {
          const scaled = self.progress * n;
          const idx = Math.min(n - 1, Math.floor(scaled));
          const localT = Math.min(1, scaled - idx);
          const barT = Math.min(1, localT / BOUNDARY);
          const hasNext = idx < n - 1;
          const rawTransT = hasNext ? Math.max(0, Math.min(1, (localT - BOUNDARY) / (1 - BOUNDARY))) : 0;
          const ease = (t: number) => (reduced ? t : easeInOutCubic(t));
          const eImg = ease(rawTransT);
          // Cada elemento tem a sua própria janela dentro da transição (nunca
          // a mesma janela inteira para todos) — o texto/botão a sair
          // termina ANTES do seguinte começar a entrar, para nunca haver
          // dupla-exposição ilegível a meio da troca. Ordem: botão (mais
          // rápido, "arruma-se" primeiro) → descrição → título (a âncora,
          // o que mais tempo fica visível sozinho).
          const eTitleOut = ease(remap01(rawTransT, 0, 0.6));
          const eTitleIn = ease(remap01(rawTransT, 0.45, 1));
          const eDescOut = ease(remap01(rawTransT, 0, 0.5));
          const eDescIn = ease(remap01(rawTransT, 0.5, 1));
          const eBtnOut = ease(remap01(rawTransT, 0, 0.4));
          const eBtnIn = ease(remap01(rawTransT, 0.6, 1));

          // A aba "ativa" (a bold/preenchida) acompanha qual das duas marcas
          // está visualmente dominante neste instante (opacidade da
          // imagem > 50%), não o momento exato em que a fatia de scroll
          // termina — caso contrário a aba ainda diria "Mercedes-Benz" numa
          // altura em que o ecrã já mostra sobretudo a Audi a entrar.
          const displayIndex = hasNext && eImg > 0.5 ? idx + 1 : idx;
          if (displayIndex !== activeIndexRef.current) {
            activeIndexRef.current = displayIndex;
            setActiveIndex(displayIndex);
          }

          slides.forEach((_, i) => {
            if (i === idx) {
              setEl(imageWrapRefs.current[i], {
                opacity: 1 - eImg,
                scale: reduced ? 1 : 1 + barT * 0.015 - eImg * 0.03,
                rotate: reduced ? 0 : -eImg,
                y: reduced ? 0 : -barT * 6 - eImg * 4,
                filter: reduced ? "blur(0px)" : `blur(${eImg * 6}px)`,
              });
              setEl(titleRefs.current[i], {
                opacity: 1 - eTitleOut,
                y: reduced ? 0 : -eTitleOut * 28,
                filter: reduced ? "blur(0px)" : `blur(${eTitleOut * 6}px)`,
              });
              setEl(descRefs.current[i], { opacity: 1 - eDescOut });
              setEl(buttonWrapRefs.current[i], { opacity: 1 - eBtnOut, scale: reduced ? 1 : 1 - eBtnOut * 0.06 });
              setEl(barFillRefs.current[i], { scaleX: barT });
            } else if (hasNext && i === idx + 1) {
              setEl(imageWrapRefs.current[i], {
                opacity: eImg,
                scale: reduced ? 1 : 1.03 - eImg * 0.03,
                rotate: reduced ? 0 : 1 - eImg,
                y: reduced ? 0 : (1 - eImg) * 10,
                filter: reduced ? "blur(0px)" : `blur(${(1 - eImg) * 6}px)`,
              });
              setEl(titleRefs.current[i], {
                opacity: eTitleIn,
                y: reduced ? 0 : (1 - eTitleIn) * 28,
                filter: reduced ? "blur(0px)" : `blur(${(1 - eTitleIn) * 6}px)`,
              });
              setEl(descRefs.current[i], { opacity: eDescIn });
              setEl(buttonWrapRefs.current[i], { opacity: eBtnIn, scale: reduced ? 1 : 0.94 + eBtnIn * 0.06 });
              setEl(barFillRefs.current[i], { scaleX: 0 });
            } else {
              setEl(imageWrapRefs.current[i], { opacity: 0 });
              setEl(titleRefs.current[i], { opacity: 0 });
              setEl(descRefs.current[i], { opacity: 0 });
              setEl(buttonWrapRefs.current[i], { opacity: 0 });
              setEl(barFillRefs.current[i], { scaleX: i < idx ? 1 : 0 });
            }
          });
        },
      });

      scrollTriggerRef.current = st;
    }, sectionRef);

    return () => {
      stopAutoplay();
      clearInactivityTimer();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("keydown", onKeyDown);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  if (slides.length === 0) return null;

  function handleTabClick(i: number) {
    const st = scrollTriggerRef.current;
    if (!st) return;
    // Um clique deliberado conta como interação, tal como scroll/toque/
    // teclado — pára o avanço automático e reinicia a janela de 10s.
    stopAutoplayRef.current();
    scheduleResumeRef.current();
    const total = st.end - st.start;
    const segmentPx = total / slides.length;
    window.scrollTo({ top: st.start + i * segmentPx + 1, behavior: "smooth" });
  }

  return (
    <section ref={sectionRef} className="relative isolate">
      {/* wrapper próprio (não o `section`, ancestral do elemento pinado) para
          o `overflow-hidden` — um `overflow-hidden` num ancestral de um
          elemento `position: fixed` (o que o GSAP usa para pinar) recorta-o
          de forma imprevisível nas arestas do pin; a mesma lição já
          aprendida com `position: sticky` em FeaturedWheels.tsx, agora
          aplicada ao equivalente para `position: fixed`. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[150px] overflow-hidden">
        <AmbientGlow edge="top" />
      </div>

      {/* pré-carregamento fora de ecrã — garante zero flash ao cruzar marcas */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        {slides.map((s) => (
          <img key={s.slug} src={s.image} alt="" loading="eager" decoding="async" />
        ))}
      </div>

      {/* Cortina de fundo — cobre o ecrã inteiro (não só a caixa pinada de
          560px) enquanto a secção está pinada, desvanecendo (nunca
          escondendo por completo — só até BACKDROP_MAX_OPACITY) o que
          ainda estivesse visível das secções vizinhas (fim de
          "Transformação", início de "Comunidade REDLINE") assim que o pin
          arranca. O foco principal continua nas Marcas, mas o contexto à
          volta mantém-se legível, só apagado. Fica sempre por baixo do
          cabeçalho (z-20 < header z-50) e por baixo da própria caixa
          pinada (z-30). O ambient light nos dois gaps (por cima/baixo da
          caixa pinada, mais estreita que o ecrã) vive dentro desta cortina
          — herda de graça o mesmo fade in/out do pin, sem precisar de
          lógica própria. */}
      <div ref={backdropRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 isolate overflow-hidden bg-background opacity-0">
        {/* O halo "top" da AmbientGlow ancora ao próprio topo do elemento
            que o contém — sem este deslocamento, o seu pico ficaria
            escondido atrás do cabeçalho fixo (64px), sobrando só a cauda já
            bastante esvaída do gradiente. Este wrapper de altura zero só
            desloca esse ponto de ancoragem para logo abaixo do cabeçalho. */}
        <div className="absolute inset-x-0 top-16">
          <AmbientGlow edge="top" />
        </div>
        <AmbientGlow edge="bottom" />

        {/* Antevisão de "Comunidade REDLINE" — o pin-spacer do GSAP ocupa
            toda a distância de scroll das 4 marcas, por isso o DOM real
            desta secção nunca está no ecrã enquanto Marcas está pinada (só
            depois do pin libertar). Mesmo texto de abertura de
            FeedbackShowcase.tsx, a antever o que vem a seguir. */}
        <div ref={bottomPreviewRef} className="absolute inset-x-0 bottom-0 px-4 pb-8 text-center opacity-0 sm:px-6 sm:pb-10 lg:px-8">
          <SectionEyebrow align="center">Comunidade REDLINE</SectionEyebrow>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">Confiança que se vê ao volante.</h2>
        </div>
      </div>

      {/* elemento pinado — overflow-hidden aqui é seguro (é o próprio
          elemento fixo, não um ancestral dele), e contém o ligeiríssimo
          overflow da imagem quando o zoom sobe acima de 100%. */}
      <div
        ref={pinRef}
        className="relative z-30 flex h-[420px] w-full flex-col justify-end overflow-hidden sm:h-[480px] md:h-[560px]"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.slug}
            className={`absolute inset-0 ${i === activeIndex ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            <div
              ref={(el) => {
                imageWrapRefs.current[i] = el;
              }}
              className={`absolute inset-0 ${i === 0 ? "" : "opacity-0"}`}
              style={{ willChange: "transform, opacity, filter" }}
            >
              <img
                src={slide.image}
                alt={`Interior ${slide.name} com volante REDLINE instalado`}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Escurece só a faixa onde o texto/CTA/barra realmente vivem
                (fundo e topo), não a foto inteira — as cores/contraste
                originais da fotografia ficam intactos no miolo da imagem.
                Gradiente com várias paragens (não from/via/to de 3 pontos)
                para a cauda ficar longa e gradual — com só 2-3 paragens a
                opacidade caía para zero de forma demasiado linear/abrupta,
                o que revelava uma "linha" visível nas fotos cuja própria
                aresta não é já naturalmente escura (Audi, Porsche), embora
                fosse impercetível nas que já eram (BMW, Mercedes). */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, oklch(0.12 0.005 250 / 1) 0%, oklch(0.12 0.005 250 / 0.62) 10%, oklch(0.12 0.005 250 / 0.36) 20%, oklch(0.12 0.005 250 / 0.20) 28%, oklch(0.12 0.005 250 / 0.10) 34%, oklch(0.12 0.005 250 / 0.04) 40%, transparent 46%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.12 0.005 250 / 0.65) 0%, oklch(0.12 0.005 250 / 0.42) 8%, oklch(0.12 0.005 250 / 0.24) 16%, oklch(0.12 0.005 250 / 0.13) 22%, oklch(0.12 0.005 250 / 0.05) 28%, transparent 34%)",
              }}
            />

            <div className="absolute inset-x-0 top-0 z-10 max-w-md px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
              <h2
                ref={(el) => {
                  titleRefs.current[i] = el;
                }}
                className={`text-2xl font-bold leading-[0.95] md:text-4xl ${i === 0 ? "" : "opacity-0"}`}
                style={{ willChange: "transform, opacity, filter" }}
              >
                {slide.headline}
              </h2>
              <p
                ref={(el) => {
                  descRefs.current[i] = el;
                }}
                className={`mt-2 max-w-sm text-sm text-muted-foreground md:text-base ${i === 0 ? "" : "opacity-0"}`}
                style={{ willChange: "opacity" }}
              >
                {slide.subtitle}
              </p>
              <div
                ref={(el) => {
                  buttonWrapRefs.current[i] = el;
                }}
                className={`mt-6 inline-block ${i === 0 ? "" : "opacity-0"}`}
                style={{ willChange: "transform, opacity" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-11 rounded-none bg-primary px-6 text-sm uppercase tracking-wider hover:bg-primary/90 md:h-12 md:px-7"
                >
                  <Link to="/brand/$slug" params={{ slug: slide.slug }}>
                    {slide.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Barra de progresso — uma faixa por marca, preenchida exatamente
            pelo valor de scroll (nunca por animação própria/timer). Clicar
            salta (scroll suave) para o início dessa fatia — acessibilidade
            para quem não consegue "esfregar" o scroll (teclado/leitor de
            ecrã), sem contradizer "o scroll controla tudo": é só um atalho
            para uma posição de scroll, não um mecanismo paralelo. */}
        <div className="relative z-10 px-4 pb-4 sm:px-6 md:pb-5 lg:px-8">
          <div role="tablist" aria-label="Selecionar marca" className="flex gap-3 sm:gap-4">
            {slides.map((slide, i) => (
              <button
                key={slide.slug}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                onClick={() => handleTabClick(i)}
                className="group flex-1 cursor-pointer text-left focus:outline-none"
              >
                <span className="block h-[2px] w-full overflow-hidden bg-foreground/20">
                  <span
                    ref={(el) => {
                      barFillRefs.current[i] = el;
                    }}
                    className="block h-full w-full origin-left bg-foreground"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
                <span
                  className={`mt-2.5 block truncate text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    i === activeIndex ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                  }`}
                >
                  {slide.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-4 pb-3 sm:px-6 md:pb-4 lg:px-8">
          <div className="text-right">
            {/* Risca sempre visível (não só ao passar o rato) — só a
                intensidade acende no hover: um efeito LED, texto e risca
                cada um a "iluminar-se" na sua própria cor. */}
            <Link
              to="/marcas"
              className="group/link relative inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground transition-[color,text-shadow] duration-300 ease-out hover:text-foreground hover:[text-shadow:0_0_10px_oklch(1_0_0/0.45)]"
            >
              Explorar todas as marcas compatíveis
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-px w-full bg-primary shadow-none transition-shadow duration-300 ease-out group-hover/link:shadow-[0_0_8px_oklch(0.58_0.22_25/0.95),0_0_18px_oklch(0.58_0.22_25/0.6)]"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
