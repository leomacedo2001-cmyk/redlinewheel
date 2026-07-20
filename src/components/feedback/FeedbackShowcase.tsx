import { useEffect, useRef, useState } from "react";

import feedback01 from "@/assets/feedback/feedback-01.jpg";
import feedback02 from "@/assets/feedback/feedback-02.jpg";
import feedback03 from "@/assets/feedback/feedback-03.jpg";
import feedback04 from "@/assets/feedback/feedback-04.jpg";
import feedback05 from "@/assets/feedback/feedback-05.jpg";
import feedback06 from "@/assets/feedback/feedback-06.jpg";
import feedback07 from "@/assets/feedback/feedback-07.jpg";
import feedback08 from "@/assets/feedback/feedback-08.jpg";
import feedback09 from "@/assets/feedback/feedback-09.jpg";
import feedback10 from "@/assets/feedback/feedback-10.jpg";
import feedback11 from "@/assets/feedback/feedback-11.jpg";
import feedback12 from "@/assets/feedback/feedback-12.jpg";
import feedback13 from "@/assets/feedback/feedback-13.jpg";
import feedback14 from "@/assets/feedback/feedback-14.jpg";
import feedback15 from "@/assets/feedback/feedback-15.jpg";
import feedback16 from "@/assets/feedback/feedback-16.jpg";
import feedback17 from "@/assets/feedback/feedback-17.jpg";
import feedback18 from "@/assets/feedback/feedback-18.jpg";

/**
 * Showcase "Comunidade REDLINE" — galeria flutuante de fotos reais de clientes.
 *
 * Técnica do loop infinito (igual à do FeaturedWheels, já validada em produção):
 * a lista é duplicada e o track desloca-se em translateX. Em vez de assumir
 * "-50%" (que não bate certo com os gaps entre cartões e causa saltos),
 * medimos com ResizeObserver a distância real em pixels entre o 1º cartão e
 * o cartão duplicado equivalente — junção matematicamente exata, sempre.
 *
 * Efeito 3D: perspective no contentor + ligeira rotação alternada (rotateY)
 * por cartão + flutuação vertical subtil (keyframe "float-y", com atraso
 * escalonado por cartão para um movimento orgânico, não sincronizado).
 */

const IMAGES = [
  feedback01,
  feedback02,
  feedback03,
  feedback04,
  feedback05,
  feedback06,
  feedback07,
  feedback08,
  feedback09,
  feedback10,
  feedback11,
  feedback12,
  feedback13,
  feedback14,
  feedback15,
  feedback16,
  feedback17,
  feedback18,
];

// Velocidade constante e lenta (pixels por segundo) — consistente com o resto do site.
const MARQUEE_SPEED_PX_PER_SEC = 26;

export function FeedbackShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const seam = seamRef.current;
    if (!track || !seam) return;

    function measure() {
      if (!track || !seam) return;
      const trackLeft = track.getBoundingClientRect().left;
      const seamLeft = seam.getBoundingClientRect().left;
      const measured = seamLeft - trackLeft;
      if (measured > 0) setDistance(measured);
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const loop = [...IMAGES, ...IMAGES];
  const durationSec = distance ? distance / MARQUEE_SPEED_PX_PER_SEC : undefined;

  return (
    <section className="border-t border-border/60 py-24 overflow-hidden">
      <div className="container-premium mb-14 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Comunidade REDLINE
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Confiança que se vê ao volante.</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Instalações reais, em carros reais. Uma pequena amostra dos volantes que já saíram das
          nossas mãos para as ruas da Europa.
        </p>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          perspective: "1400px",
        }}
      >
        <div
          ref={trackRef}
          className={
            distance
              ? "flex gap-6 w-max animate-marquee-x opacity-100 transition-opacity duration-700 [animation-play-state:running] hover:[animation-play-state:paused]"
              : "flex gap-6 w-max opacity-0"
          }
          style={
            distance
              ? ({
                  "--marquee-distance": `${distance}px`,
                  animationDuration: `${durationSec}s`,
                } as React.CSSProperties)
              : undefined
          }
        >
          {loop.map((src, i) => {
            // Ligeira rotação 3D alternada e flutuação com atraso escalonado, para um
            // movimento orgânico em vez de sincronizado — subtil, nunca exagerado.
            const tilt = i % 3 === 0 ? -4 : i % 3 === 1 ? 4 : 0;
            const floatDelay = (i % 6) * 0.65;
            return (
              <div
                key={i}
                ref={i === IMAGES.length ? seamRef : undefined}
                className="shrink-0 w-[190px] sm:w-[220px] md:w-[240px] animate-float-y"
                style={{ animationDelay: `${floatDelay}s` }}
              >
                <div
                  className="group aspect-[4/5] overflow-hidden bg-surface border border-border/60 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-[1.04] hover:border-primary/50"
                  style={{ transform: `rotateY(${tilt}deg)`, transformStyle: "preserve-3d" }}
                >
                  <img
                    src={src}
                    alt="Instalação de volante personalizado REDLINE num cliente"
                    loading="lazy"
                    decoding="async"
                    width={720}
                    height={900}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
