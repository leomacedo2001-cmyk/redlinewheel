import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientGlow } from "@/components/AmbientGlow";

import ctaVideo from "@/assets/cta/cta-showcase-loop.mp4";
import ctaPoster from "@/assets/cta/cta-showcase-poster.jpg";

/**
 * Vídeo exclusivo desta secção — ao contrário do vídeo do Hero, nunca é
 * reaproveitado noutro sítio do site.
 */
export function CtaShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  // A maioria dos browsers dispara loadeddata a tempo, mas com o vídeo já em
  // cache (revisita, HMR em dev) o evento pode ter disparado antes deste
  // handler ficar ligado — por isso confirma o readyState já no mount.
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setVideoReady(true);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden border-t border-border/60 -mb-24"
    >
      <div className="absolute inset-0">
        {prefersReducedMotion ? (
          // Sem movimento: primeiro frame do vídeo como imagem estática, mesmo tratamento visual.
          <img
            src={ctaPoster}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ filter: "brightness(0.4) contrast(1.05) saturate(0.8)" }}
          />
        ) : (
          <motion.video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={ctaPoster}
            aria-hidden="true"
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              y: parallaxY,
              filter: "brightness(0.4) contrast(1.05) saturate(0.8)",
              willChange: "transform",
            }}
            className="h-full w-full object-cover"
          >
            <source src={ctaVideo} type="video/mp4" />
          </motion.video>
        )}
      </div>

      {/* Vinheta escura — texto sempre o elemento dominante, nunca o vídeo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.12 0.005 250 / 0.88), oklch(0.12 0.005 250 / 0.78), oklch(0.12 0.005 250 / 0.88))",
        }}
      />

      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />

      <div className="container-premium relative py-20 md:py-24 text-center">
        <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
          <Star className="relative h-8 w-8 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Pronto para transformar o teu interior?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Explora a coleção completa: Alcântara, couro nappa, carbono twill e forjado.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 rounded-none h-14 px-10 uppercase tracking-wider text-sm"
        >
          <Link to="/products">
            Comprar Agora <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
