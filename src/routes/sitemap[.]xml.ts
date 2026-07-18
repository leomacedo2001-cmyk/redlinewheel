import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BRANDS } from "@/lib/brands";

const BASE_URL = "https://redlinewheel.lovable.app";

// Categorias de acabamento/personalização (ver src/routes/category.$slug.tsx)
const CATEGORY_SLUGS = [
  "alcantara",
  "pele-perfurada",
  "carbono",
  "costuras",
  "led-shift",
  "patilhas",
  "oem-plus",
  "componentes-interior",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/products", priority: "0.9", changefreq: "daily" },
          { path: "/configurator", priority: "0.8", changefreq: "weekly" },
          { path: "/about", priority: "0.6", changefreq: "monthly" },
          { path: "/contact", priority: "0.6", changefreq: "monthly" },
          { path: "/privacidade", priority: "0.3", changefreq: "yearly" },
        ];

        const categoryEntries = CATEGORY_SLUGS.map((slug) => ({
          path: `/category/${slug}`,
          priority: "0.7",
          changefreq: "monthly",
        }));

        const brandEntries = BRANDS.flatMap((brand) => [
          { path: `/brand/${brand.slug}`, priority: "0.9", changefreq: "weekly" },
          ...brand.models.map((model) => ({
            path: `/brand/${brand.slug}/model/${model.slug}`,
            priority: "0.8",
            changefreq: "weekly",
          })),
        ]);

        const entries = [...staticEntries, ...categoryEntries, ...brandEntries];

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
