import { useEffect, useRef, useState } from "react";
import { galleryPhotos } from "@/lib/installations";

/**
 * Grelha da Galeria — só fotografias.
 *
 * Mostrava nome e localização de cliente em cada imagem, vindos de dados
 * fictícios (ver auditoria de prova social). As fotografias mantêm-se; as
 * legendas foram removidas, porque não existe informação verificável sobre
 * nenhuma delas. Espaçamento e proporção idênticos em todos os cartões (sem
 * masonry): a consistência é o que dá o efeito, não a variação de tamanho.
 *
 * Quando `installations.ts` tiver entradas verificadas, é aqui que os dados
 * confirmados — carro, chassis, configuração — passam a poder aparecer.
 */
export function GalleryGrid() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {galleryPhotos().map((photo, i) => (
        <figure
          key={photo.installationId}
          className={`group relative aspect-[4/5] overflow-hidden bg-surface ${isInView ? "animate-fade-up" : "opacity-0"}`}
          style={isInView ? { animationDelay: `${Math.min(i, 11) * 45}ms` } : undefined}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            width={720}
            height={900}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </figure>
      ))}
    </div>
  );
}
