import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_PAGES,
  URL_SLUG_TO_KEY,
  PROCESS_STEPS,
  getRelatedModels,
} from "@/lib/categoryPages";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryBenefits } from "@/components/category/CategoryBenefits";
import { CategoryGallery } from "@/components/category/CategoryGallery";
import { CategoryProducts } from "@/components/category/CategoryProducts";
import { CategoryTimeline } from "@/components/category/CategoryTimeline";
import { CategoryFAQ } from "@/components/category/CategoryFAQ";
import { CategoryCTA } from "@/components/category/CategoryCTA";

const SITE_URL = "https://redlinewheel.lovable.app";

export const Route = createFileRoute("/produtos/$slug")({
  loader: ({ params }) => {
    const key = URL_SLUG_TO_KEY[params.slug];
    const cat = key ? CATEGORY_PAGES[key] : undefined;
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData, params }) => {
    const cat = loaderData?.cat;
    const title = cat
      ? `${cat.title} — REDLINE Performance`
      : "Personalização — REDLINE Performance";
    const description =
      cat?.metaDescription ?? "Personalização premium de volantes e interiores automóvel.";
    const url = `${SITE_URL}/produtos/${params.slug}`;

    const schema = cat
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: cat.title,
          description: cat.metaDescription,
          image: cat.heroImg,
          brand: { "@type": "Brand", name: "REDLINE Performance" },
          url,
        }
      : undefined;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(cat ? [{ property: "og:image", content: cat.heroImg }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: schema
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(schema),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="container-premium py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Personalização não encontrada</h1>
      <Button asChild className="rounded-none">
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  ),
  component: CategoryLandingPage,
});

function CategoryLandingPage() {
  const { cat } = Route.useLoaderData();
  const relatedProducts = getRelatedModels(cat);

  return (
    <div>
      <CategoryHero
        title={cat.title}
        tagline={cat.tagline}
        subtitle={cat.subtitle}
        heroImg={cat.heroImg}
      />
      <CategoryBenefits intro={cat.intro} benefits={cat.benefits} />
      <CategoryGallery title={cat.title} images={cat.gallery} />
      <CategoryProducts title={cat.title} products={relatedProducts} />
      <CategoryTimeline steps={PROCESS_STEPS} />
      <CategoryFAQ items={cat.faq} />
      <CategoryCTA />
    </div>
  );
}
