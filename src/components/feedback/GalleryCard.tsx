import type { GalleryPhoto } from "@/lib/installations";

/**
 * Cartão do carrossel "Galeria REDLINE" da homepage.
 *
 * Substitui `TestimonialCard`, que mostrava nome, cidade, país e estrelas
 * vindos de dados fictícios (ver auditoria de prova social). O cartão passa a
 * ser só a fotografia — mesmo enquadramento, mesma moldura, mesmo friso e
 * mesmo comportamento no hover que o cartão anterior. Nenhuma atribuição a
 * cliente, local ou configuração é apresentada, porque nenhuma é verificável.
 *
 * Quando existirem instalações verificadas (`verified: true` em
 * `installations.ts`), é aqui que os dados confirmados passam a poder ser
 * mostrados — nunca antes disso.
 */
export function GalleryCard({ photo }: { photo: GalleryPhoto }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-border/60 bg-surface transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_32px_60px_-24px_rgba(0,0,0,0.65)]">
      {/* friso técnico — acende-se no hover, mesma linguagem da Transformação */}
      <span className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-primary to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />

      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-background">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          width={720}
          height={900}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-90" />
      </div>
    </article>
  );
}
