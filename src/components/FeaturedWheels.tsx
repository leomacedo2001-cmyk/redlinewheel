import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { getBrandModel, type Brand, type BrandModel } from "@/lib/brands";
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
 * Produtos em Destaque — showroom curado com um Navegador de Produto: a
 * imagem, o título, a descrição, o preço e os selos do hero mudam ao passar
 * o rato (ou ao navegar por teclado) sobre a lista à direita — como um
 * configurador automóvel, nunca uma navegação de página.
 *
 * Reconstrução completa (não iteração) da versão anterior: já não há um
 * cartão "hero" fixo + lista de cartões-link separados. Agora é um único
 * ecrã de exibição (hero) cujo conteúdo é function do item selecionado, e
 * uma lista de seletores que só existe para mudar essa seleção — a
 * navegação real para a página do produto vive só no CTA do próprio hero.
 *
 * A imagem nunca é cortada: `object-contain` (não `cover`) garante que o
 * volante inteiro cabe sempre dentro da moldura, com espaço de "estúdio"
 * (gradiente escuro) a preencher a área à volta em vez de cortar bordas —
 * este é o requisito com prioridade sobre qualquer outra decisão de layout.
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
 * fundo de estúdio diferente à volta do volante. Valores calculados a partir
 * de inspeção visual de cada foto (margem mais apertada em qualquer aresta,
 * top/bottom/left/right), usando sempre menos de metade dessa margem como
 * "orçamento" de corte — a folga fica para erro de estimativa, nunca para
 * chegar ao máximo teórico. A foto "Audi Green Camo" é um close-up que já
 * ocupa a moldura toda (sem margem nenhuma) — fica sem zoom.
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
 * Fotografias de estúdio dedicadas ao hero desta secção — já em 16:9,
 * compostas para este enquadramento específico, por isso não herdam nem o
 * zoom de segurança (HERO_ZOOM) nem o grading (brightness/contrast/
 * saturate) pensados só para as fotos quadradas antigas mal-enquadradas
 * nesta caixa mais larga. Exclusivas desta secção: propositadamente não
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

/**
 * Miniatura do Audi Green Camo — era o único produto onde a miniatura
 * (model.img, a foto antiga em close-up) e o hero (a foto de estúdio nova,
 * de corpo inteiro) mostravam composições visivelmente diferentes; nos
 * outros 6, ambas as fotos — antiga e nova — já mostram o volante inteiro
 * num ângulo semelhante, por isso a diferença não se nota. Corrigido só
 * aqui: a miniatura passa a usar o mesmo ficheiro do hero. Zoom = rácio da
 * foto (1672/941 ≈ 1.777) — o valor exato que preenche o quadrado da
 * miniatura por completo, sem sobrar nenhuma margem, mantendo o aro
 * completo (a foto tem folga lateral suficiente para este corte).
 */
const THUMBNAIL_IMAGE_OVERRIDE: Record<string, string> = {
  "audi-green-camo-signature": audiGreenCamoStudio,
};

type ShowcaseItem = { brand: Brand; model: BrandModel };

function formatPrice(model: BrandModel): string | null {
  if (!model.price) return null;
  return `${model.price.currency === "EUR" ? "€" : model.price.currency + " "}${model.price.amount.toFixed(0)}`;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Combina o blur animado do crossfade com o grading estático (quando existe) — CSS só tem um `filter`. */
function blurGrade(blurPx: number, grade: string | undefined): string {
  return grade ? `blur(${blurPx}px) ${grade}` : `blur(${blurPx}px)`;
}

function HeroDisplay({ item }: { item: ShowcaseItem }) {
  const { brand, model } = item;
  const price = formatPrice(model);
  const reducedMotion = useReducedMotion();
  const key = `${brand.slug}-${model.slug}`;
  const studioOverride = HERO_IMAGE_OVERRIDE[key];
  const heroImg = studioOverride ?? model.img;
  // A foto de estúdio já vem em 16:9 bem enquadrada — sem corte de segurança nem grading extra.
  const zoom = studioOverride ? 1 : (HERO_ZOOM[key] ?? 1);
  const imgFilter = studioOverride ? undefined : "brightness(0.95) contrast(1.16) saturate(1.05)";
  // As fotos de estúdio (16:9 = 1.777) são mais largas que as duas proporções
  // da caixa (4:3 = 1.333 no mobile, 16:10 = 1.6 no desktop), por isso o
  // object-contain encosta sempre à largura e sobra uma faixa preta em cima
  // e em baixo — o rácio da CAIXA muda por breakpoint mas o da FOTO não, por
  // isso este zoom (que fecha exatamente essa faixa) tem de ser responsivo;
  // como o scale do framer-motion abaixo é só um número em JS, não dá para
  // variar por breakpoint ali — por isso vive aqui, num wrapper CSS estático
  // à parte, multiplicando-se com o "pulso" da transição (1.03/1/0.98) em
  // vez de o substituir. Valores = ratio da foto ÷ ratio da caixa em cada
  // breakpoint (1.777/1.333≈1.333 mobile, 1.777/1.6≈1.111 desktop) — cortam
  // só as laterais (a foto já batia a largura da caixa), nunca o topo/fundo;
  // confirmado nas 7 fotos que sobra sempre mais de 23% de margem lateral
  // face aos ~5–12.5% que este corte consome.
  const fillZoomClass = studioOverride ? "absolute inset-0 scale-[1.333] md:scale-[1.111]" : "absolute inset-0";

  return (
    <div className="relative">
      {/* glow ambiente atrás do hero — muito ténue, só para o objeto não parecer preso numa caixa */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 blur-3xl md:-inset-10"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.58 0.22 25 / 0.045), transparent 72%)",
        }}
      />

      {/* sem fundo próprio — a caixa em si tem de ser invisível, para o
          volante flutuar diretamente no halo/fundo da secção em vez de
          parecer preso dentro de um retângulo com cor própria */}
      <div className="relative aspect-[4/3] overflow-hidden bg-transparent md:aspect-[16/10]">
        {/* soft directional studio light + floor falloff — o "estúdio" à volta do produto */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              "radial-gradient(60% 55% at 50% 30%, oklch(1 0 0 / 0.04), transparent 70%)",
              "radial-gradient(70% 45% at 50% 100%, oklch(0.58 0.22 25 / 0.05), transparent 75%)",
            ].join(", "),
          }}
        />

        <div className={fillZoomClass}>
          <AnimatePresence mode="wait">
            <motion.img
              key={key}
              src={heroImg}
              alt={model.name}
              loading="eager"
              decoding="async"
              initial={
                reducedMotion
                  ? { opacity: 0, scale: zoom, filter: blurGrade(0, imgFilter) }
                  : { opacity: 0, scale: zoom * 1.03, filter: blurGrade(6, imgFilter) }
              }
              animate={{ opacity: 1, scale: zoom, filter: blurGrade(0, imgFilter) }}
              exit={
                reducedMotion
                  ? { opacity: 0, scale: zoom, filter: blurGrade(0, imgFilter) }
                  : { opacity: 0, scale: zoom * 0.98, filter: blurGrade(4, imgFilter) }
              }
              transition={{ duration: reducedMotion ? 0.2 : 0.5, ease: EASE }}
              className="absolute inset-0 h-full w-full object-contain p-3 md:p-5"
            />
          </AnimatePresence>
        </div>

        <span className="absolute left-5 top-5 z-10 bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.58_0.22_25/0.7)]">
          Coleção Signature
        </span>
        <div className="absolute right-5 top-5 z-10 flex items-center gap-1 border border-border/60 bg-background/70 px-2.5 py-1.5 backdrop-blur">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-primary text-primary" />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${brand.slug}-${model.slug}-info`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.35, ease: EASE, delay: reducedMotion ? 0 : 0.08 }}
          className="relative mt-6 md:mt-8"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-primary">{brand.name}</span>
            <span className="text-border">•</span>
            <span>Feito à Mão</span>
            <span className="text-border">•</span>
            <span>48h de Produção</span>
            {model.status && (
              <>
                <span className="text-border">•</span>
                <span>{model.status}</span>
              </>
            )}
          </div>

          <h3 className="mb-3 text-3xl font-bold leading-tight md:text-4xl">{model.name}</h3>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            {model.description}
          </p>

          <div className="mt-7 flex flex-wrap items-end justify-between gap-6 border-t border-border/60 pt-6">
            {price && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Desde</div>
                <div className="text-4xl font-bold tracking-tight">{price}</div>
              </div>
            )}
            <Link
              to="/brand/$slug/model/$model"
              params={{ slug: brand.slug, model: model.slug }}
              className="group/cta relative inline-flex h-14 items-center gap-3 overflow-hidden bg-primary px-8 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-16px_oklch(0.58_0.22_25/0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 ease-out group-hover/cta:translate-x-full"
              />
              <span className="relative">Ver Produto</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-1.5" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NavigatorRow({
  item,
  active,
  onHoverActivate,
  onHoverCancel,
  onFocusActivate,
}: {
  item: ShowcaseItem;
  active: boolean;
  onHoverActivate: () => void;
  onHoverCancel: () => void;
  onFocusActivate: () => void;
}) {
  const { brand, model } = item;
  const price = formatPrice(model);
  const thumbOverride = THUMBNAIL_IMAGE_OVERRIDE[`${brand.slug}-${model.slug}`];
  const thumbImg = thumbOverride ?? model.img;
  const thumbFillClass = thumbOverride ? "absolute inset-0 scale-[1.777]" : "absolute inset-0";

  return (
    <button
      type="button"
      onMouseEnter={onHoverActivate}
      onMouseLeave={onHoverCancel}
      onFocus={onFocusActivate}
      aria-current={active}
      className={`group relative flex w-[220px] shrink-0 items-center gap-3 overflow-hidden border bg-surface/60 p-2.5 text-left transition-[border-color,background-color,box-shadow] duration-300 ease-out lg:w-full ${
        active
          ? "border-primary/70 bg-surface shadow-[0_16px_36px_-22px_oklch(0.58_0.22_25/0.5)]"
          : "border-border/50 hover:border-primary/40 hover:bg-surface"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-0.5 bg-primary transition-transform duration-300 ease-out ${
          active ? "scale-y-100" : "scale-y-0"
        }`}
      />
      <div className="relative aspect-square w-16 shrink-0 overflow-hidden bg-gradient-to-b from-surface to-background">
        <div className={thumbFillClass}>
          <img
            src={thumbImg}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-contain transition-[filter,transform] duration-300 ease-out [filter:brightness(0.92)_contrast(1.08)] ${
              active ? "scale-105 [filter:brightness(1)_contrast(1.14)]" : "opacity-80"
            }`}
          />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`mb-1 text-[9px] uppercase tracking-[0.18em] transition-colors ${
            active ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {brand.name}
        </div>
        <div className={`truncate text-sm font-semibold leading-tight transition-colors ${active ? "text-primary" : ""}`}>
          {model.name}
        </div>
        {price && <div className="mt-1 text-xs text-muted-foreground">{price}</div>}
      </div>
    </button>
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

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0);
  }, [items.length, activeIndex]);

  // Debounce da ativação por hover: sem isto, o Chromium volta a avaliar
  // :hover sempre que o layout se desloca por baixo do rato — incluindo
  // durante um simples scroll, sem o rato se mexer. Numa lista alta como
  // esta, isso disparava onMouseEnter em várias linhas por segundo enquanto
  // se fazia scroll com o rato pousado em cima da coluna, mudando a key das
  // duas árvores AnimatePresence (imagem + bloco de info) mais depressa do
  // que a própria transição (350–500ms) — ficavam dessincronizadas a meio
  // da saída/entrada, com a opacidade a cair para quase zero durante essa
  // troca (confirmado a medir: imagem a ~0.0001, bloco de info a ~0.18) e a
  // secção a parecer "partida" enquanto se fazia scroll. O foco por teclado
  // não sofre disto (não é recalculado pelo scroll) e mantém-se instantâneo.
  const hoverTimeoutRef = useRef<number | null>(null);
  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);
  const handleHoverActivate = useCallback(
    (i: number) => {
      clearHoverTimeout();
      hoverTimeoutRef.current = window.setTimeout(() => {
        hoverTimeoutRef.current = null;
        setActiveIndex(i);
      }, 120);
    },
    [clearHoverTimeout],
  );
  useEffect(() => clearHoverTimeout, [clearHoverTimeout]);

  if (items.length === 0) return null;
  const active = items[activeIndex];

  return (
    <section className="relative isolate overflow-hidden py-20 md:py-24">
      <AmbientGlow edge="top" />
      <AmbientGlow edge="bottom" />

      <div className="container-premium">
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <div>
            <SectionEyebrow className="mb-3">Coleção</SectionEyebrow>
            <h2 className="text-4xl font-bold md:text-5xl">Produtos em Destaque</h2>
          </div>
          <Link
            to="/products"
            className="hidden items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:inline-flex"
          >
            Ver todos <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.9fr_1fr] lg:gap-12">
          <HeroDisplay item={active} />

          <div className="lg:pt-1">
            <div className="mb-3 hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:block">
              Explora a coleção
            </div>
            <div
              className="scrollbar-none -mx-6 flex gap-3 overflow-x-auto px-6 pb-1 lg:mx-0 lg:max-h-[520px] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:px-0"
              role="listbox"
              aria-label="Selecionar produto em destaque"
            >
              {items.map((item, i) => (
                <NavigatorRow
                  key={`${item.brand.slug}-${item.model.slug}`}
                  item={item}
                  active={i === activeIndex}
                  onHoverActivate={() => handleHoverActivate(i)}
                  onHoverCancel={clearHoverTimeout}
                  onFocusActivate={() => {
                    clearHoverTimeout();
                    setActiveIndex(i);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:hidden"
        >
          Ver todos <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
