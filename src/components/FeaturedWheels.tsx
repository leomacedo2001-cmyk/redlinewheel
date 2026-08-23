import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, ChevronUp, Star } from "lucide-react";
import { getBrandModel, type Brand, type BrandModel } from "@/lib/brands";
import { formatPrice as formatMoney } from "@/lib/price";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { AmbientGlow } from "@/components/AmbientGlow";
import mercedesAmgRedForgedStudio from "@/assets/mercedes-amg-red-forged-studio-16x9.png";
import audiRsCarbonStudio from "@/assets/audi-rs-carbon-studio-16x9.png";
import bmwGBlueForgedStudio from "@/assets/bmw-g-blue-forged-studio-16x9.png";
import audiGreenCamoStudio from "@/assets/audi-green-camo-studio-16x9.png";
import audiRsSuedeStudio from "@/assets/audi-rs-suede-studio-16x9.png";
import vwForgedCarbonStudio from "@/assets/vw-forged-carbon-studio-16x9.png";
import bmwGBlackCarbonStudio from "@/assets/bmw-g-black-carbon-studio-16x9.png";

/**
 * Produtos em Destaque — REDESIGN COMPLETO (pedido explícito, backup do
 * original em `src/components/_backup/FeaturedWheels.pre-redesign.tsx`).
 *
 * Estrutura (referência: vídeo do utilizador, um catálogo de bicicletas
 * premium) — coluna esquerda fixa (eyebrow + título + descrição + índice +
 * setas), coluna direita como uma PILHA VERTICAL de cartões de produto que
 * revelam com fade ao entrar no scroll. Sem carousel horizontal, sem drag —
 * o "movimento" é o próprio scroll da página, tal como no vídeo.
 *
 * Acabamento visual: pedido explícito de manter TODO o design já
 * implementado no site — por isso os cartões reutilizam a mesma linguagem
 * de "Porque Escolher a REDLINE" (gradiente rgb(19,19,19)→rgb(8,8,8),
 * borda white/10, sombra, tilt 3D no hover) em vez de inventar um estilo
 * novo, e o bloco imagem+preço+CTA reutiliza o "hero display" que já
 * existia nesta secção antes do redesign.
 */

/**
 * Curadoria manual — 7 peças, não o catálogo inteiro. Cada uma tem carbono
 * forjado, LED, Alcântara completa ou um acabamento verdadeiramente único.
 * Só peças com fotografia local (ficheiro no repositório, não um asset
 * externo do Lovable) entram aqui — é o que torna possível tratar a
 * imagem de forma consistente sem arriscar mostrar uma foto partida.
 */
const CURATED_SHOWCASE: { brandSlug: string; modelSlug: string }[] = [
  { brandSlug: "mercedes-benz", modelSlug: "amg-red-forged-signature" },
  { brandSlug: "audi", modelSlug: "rs-carbon-signature" },
  { brandSlug: "bmw", modelSlug: "g-series-blue-forged" },
  { brandSlug: "audi", modelSlug: "green-camo-signature" },
  { brandSlug: "bmw", modelSlug: "g-series-black-carbon" },
  { brandSlug: "audi", modelSlug: "rs-suede-signature" },
  { brandSlug: "volkswagen", modelSlug: "forged-carbon-signature" },
];

/**
 * Zoom seguro por foto — a única forma de reduzir a margem vazia à volta do
 * volante sem arriscar cortá-lo: as 7 fotos são todas quadradas (1200x1200)
 * mostradas numa caixa mais larga que alta, e cada uma tem uma margem de
 * fundo de estúdio diferente à volta do volante. A foto "Audi Green Camo" é
 * um close-up que já ocupa a moldura toda (sem margem nenhuma) — fica sem
 * zoom.
 */
const HERO_ZOOM: Record<string, number> = {
  "mercedes-benz-amg-red-forged-signature": 1.05,
  "audi-rs-carbon-signature": 1.1,
  "bmw-g-series-blue-forged": 1.07,
  "audi-green-camo-signature": 1,
  "bmw-g-series-black-carbon": 1.03,
  "audi-rs-suede-signature": 1.15,
  "volkswagen-forged-carbon-signature": 1.11,
};

/**
 * Fotografias de estúdio dedicadas a esta secção — já em 16:9, compostas
 * para este enquadramento específico. Exclusivas: propositadamente não
 * entram em brands.ts, para nunca aparecerem na página de produto, no
 * catálogo ou em qualquer outro sítio do site.
 */
const HERO_IMAGE_OVERRIDE: Record<string, string> = {
  "mercedes-benz-amg-red-forged-signature": mercedesAmgRedForgedStudio,
  "audi-rs-carbon-signature": audiRsCarbonStudio,
  "bmw-g-series-blue-forged": bmwGBlueForgedStudio,
  "audi-green-camo-signature": audiGreenCamoStudio,
  "bmw-g-series-black-carbon": bmwGBlackCarbonStudio,
  "audi-rs-suede-signature": audiRsSuedeStudio,
  "volkswagen-forged-carbon-signature": vwForgedCarbonStudio,
};

type ShowcaseItem = { brand: Brand; model: BrandModel };

function formatPrice(model: BrandModel): string | null {
  if (!model.price) return null;
  return formatMoney(model.price.amount, model.price.currency);
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Um cartão da pilha — a unidade repetida do vídeo de referência (imagem +
 * painel de informação), com o acabamento 3D/glass já estabelecido no
 * site. `onActive` dispara quando o cartão cruza o centro do viewport,
 * para a coluna esquerda saber qual índice mostrar.
 */
function ProductCard({
  item,
  index,
  total,
  onActive,
}: {
  item: ShowcaseItem;
  index: number;
  total: number;
  onActive: (i: number) => void;
}) {
  const { brand, model } = item;
  const price = formatPrice(model);
  const reducedMotion = useReducedMotion();
  const key = `${brand.slug}-${model.slug}`;
  const studioOverride = HERO_IMAGE_OVERRIDE[key];
  const heroImg = studioOverride ?? model.img;
  const zoom = studioOverride ? 1 : (HERO_ZOOM[key] ?? 1);
  const imgFilter = studioOverride ? undefined : "brightness(0.95) contrast(1.16) saturate(1.05)";
  const fillZoomClass = studioOverride
    ? "absolute inset-0 [transform:scale(1.466)] md:[transform:scale(1.222)]"
    : "absolute inset-0";

  // Selos/pills — reaproveita specs reais do produto (nunca inventados),
  // priorizando Formato/Material (os mais visuais), até 3 no total.
  const pills = useMemo(() => {
    const specs = model.specs ?? [];
    const prioritized = specs.filter((s) => s.label === "Formato" || s.label === "Material");
    const rest = specs.filter((s) => s.label !== "Formato" && s.label !== "Material");
    return [...prioritized, ...rest].slice(0, 3);
  }, [model.specs]);

  const cardRef = useRef<HTMLDivElement>(null);
  const revealInView = useInView(cardRef, { once: true, amount: 0.25 });

  // Deteta quando este cartão está "em foco" (a cruzar o centro do ecrã) —
  // a mesma técnica de scrollspy usada para navegação por âncoras. Em vez de
  // um marcador de 1px a meio de uma faixa fina (fácil de "saltar" por cima
  // em scrolls rápidos/grandes), encolhe o próprio cartão inteiro para uma
  // linha ao centro do viewport (-50%/-50%): fica ativo assim que QUALQUER
  // parte do cartão cruza essa linha, o que é robusto mesmo para cartões
  // altos e scrolls rápidos.
  const isActive = useInView(cardRef, { margin: "-50% 0px -50% 0px" });
  useEffect(() => {
    if (isActive) onActive(index);
  }, [isActive, index, onActive]);

  return (
    <div ref={cardRef} className="relative scroll-mt-32">
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 32 }}
        animate={revealInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
        className="group relative isolate overflow-hidden rounded-sm border border-white/10 bg-gradient-to-b from-[rgb(19,19,19)] to-[rgb(8,8,8)] shadow-[0_14px_28px_-20px_rgba(0,0,0,0.8)] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] will-change-transform hover:border-primary/40 hover:shadow-[0_32px_64px_-24px_oklch(0.58_0.22_25_/_0.35)] hover:[transform:rotateX(1.5deg)_translateY(-4px)_scale(1.01)]"
      >
        {/* Aresta superior a apanhar luz — mesmo "bisel" dos cartões de "Porque Escolher a REDLINE". */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-white/10" />

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr]">
          {/* IMAGEM — ~70% da altura do cartão pedido no brief: aqui expresso
              como a coluna dominante da grelha (proporção 1.35fr vs 1fr). */}
          <div className="relative aspect-[4/3] overflow-hidden bg-transparent md:aspect-[16/10] lg:aspect-auto">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: [
                  "radial-gradient(60% 55% at 50% 30%, oklch(1 0 0 / 0.04), transparent 70%)",
                  "radial-gradient(70% 45% at 50% 100%, oklch(0.58 0.22 25 / 0.06), transparent 75%)",
                ].join(", "),
              }}
            />
            <div className={fillZoomClass}>
              <motion.img
                src={heroImg}
                alt={model.name}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                initial={reducedMotion ? undefined : { opacity: 0, scale: zoom * 1.08, rotate: -2, filter: "brightness(0.8)" }}
                animate={
                  revealInView
                    ? { opacity: 1, scale: zoom, rotate: 0, filter: "brightness(1)" }
                    : undefined
                }
                transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
                style={imgFilter ? { filter: imgFilter } : undefined}
                className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] md:p-6"
              />
            </div>

            <span className="absolute left-4 top-4 z-10 bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.58_0.22_25/0.7)]">
              Coleção Signature
            </span>
            <div className="absolute right-4 top-4 z-10 flex items-center gap-1 border border-border/60 bg-background/70 px-2.5 py-1.5 backdrop-blur">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-primary text-primary" />
              ))}
            </div>
          </div>

          {/* PAINEL DE INFORMAÇÃO */}
          <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-primary">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-border">/</span>
              <span>{String(total).padStart(2, "0")}</span>
              <span className="text-border">•</span>
              <span className="text-primary">{brand.name}</span>
            </div>

            <h3 className="mb-3 text-2xl font-bold leading-tight md:text-3xl">{model.name}</h3>
            <p className="mb-5 max-w-md text-sm leading-relaxed text-muted-foreground">{model.description}</p>

            {pills.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {pills.map((spec) => (
                  <span
                    key={spec.label}
                    className="border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {spec.value}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-end justify-between gap-5 border-t border-border/60 pt-5">
              {price && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Desde</div>
                  <div className="text-3xl font-bold tracking-tight">{price}</div>
                </div>
              )}
              <Link
                to="/brand/$slug/model/$model"
                params={{ slug: brand.slug, model: model.slug }}
                className="group/cta relative inline-flex h-12 items-center gap-3 overflow-hidden bg-primary px-6 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-16px_oklch(0.58_0.22_25/0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 ease-out group-hover/cta:translate-x-full"
                />
                <span className="relative">Ver Produto</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function FeaturedProductsSection() {
  const items = useMemo(
    () =>
      CURATED_SHOWCASE.map(({ brandSlug, modelSlug }) => getBrandModel(brandSlug, modelSlug)).filter(
        (x): x is ShowcaseItem => Boolean(x),
      ),
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleActive = useCallback((i: number) => setActiveIndex(i), []);

  const scrollToIndex = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, i));
      cardRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [items.length],
  );

  if (items.length === 0) return null;

  return (
    <section className="relative isolate py-20 md:py-24">
      {/* O halo precisa de overflow-hidden para nunca "sangrar" para fora da
          secção — mas overflow-hidden num antepassado quebra position:sticky
          (a coluna esquerda deixava de ficar fixa durante o scroll da
          pilha). Por isso o halo vive isolado num wrapper próprio, fora da
          árvore da coluna sticky. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <AmbientGlow edge="top" />
        <AmbientGlow edge="bottom" />
      </div>

      <div className="container-premium">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr] lg:gap-14 xl:grid-cols-[340px_1fr]">
          {/* COLUNA ESQUERDA — fixa (sticky) durante o scroll da pilha à
              direita, tal como no vídeo de referência. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionEyebrow className="mb-3">Coleção</SectionEyebrow>
            <h2 className="text-4xl font-bold md:text-5xl">Produtos em Destaque</h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Sete peças selecionadas da nossa coleção Signature — cada uma feita à mão, com carbono forjado, LED ou
              Alcântara completa. Percorre a coleção.
            </p>

            {/* Índice + setas — navegação alternativa ao scroll, tal como pedido. */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-lg font-bold text-primary tabular-nums">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="mx-1 h-px w-8 bg-border" />
                <span className="text-muted-foreground tabular-nums">{String(items.length).padStart(2, "0")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Produto anterior"
                  onClick={() => scrollToIndex(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="flex h-9 w-9 items-center justify-center border border-border/60 text-foreground/70 transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Próximo produto"
                  onClick={() => scrollToIndex(activeIndex + 1)}
                  disabled={activeIndex === items.length - 1}
                  className="flex h-9 w-9 items-center justify-center border border-border/60 text-foreground/70 transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Link
              to="/products"
              className="mt-8 hidden items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 lg:inline-flex"
            >
              Ver todos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* COLUNA DIREITA — pilha vertical de cartões. */}
          <div className="flex flex-col gap-8 md:gap-10">
            {items.map((item, i) => (
              <div
                key={`${item.brand.slug}-${item.model.slug}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <ProductCard item={item} index={i} total={items.length} onActive={handleActive} />
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 lg:hidden"
        >
          Ver todos <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
