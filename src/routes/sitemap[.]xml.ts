import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BRANDS } from "@/lib/brands";
import { CATEGORY_PAGES } from "@/lib/categoryPages";
import { GENERIC_COLLECTIONS } from "@/lib/collections";
import { ACCESSORIES } from "@/lib/accessories";

const BASE_URL = "https://redlinewheel.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/products", priority: "0.9", changefreq: "daily" },
          { path: "/acessorios", priority: "0.7", changefreq: "weekly" },
          { path: "/filtros", priority: "0.7", changefreq: "weekly" },
          { path: "/configurator", priority: "0.8", changefreq: "weekly" },
          { path: "/about", priority: "0.6", changefreq: "monthly" },
          { path: "/contact", priority: "0.6", changefreq: "monthly" },
          { path: "/privacidade", priority: "0.3", changefreq: "yearly" },
        ];

        const categoryEntries = Object.values(CATEGORY_PAGES).map((cat) => ({
          path: `/produtos/${cat.urlSlug}`,
          priority: "0.7",
          changefreq: "monthly",
        }));

        const collectionEntries = GENERIC_COLLECTIONS.map((col) => ({
          path: `/c/${col.urlSlug}`,
          priority: "0.6",
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

        const accessoryEntries = ACCESSORIES.map((a) => ({
          path: `/acessorios/${a.slug}`,
          priority: "0.6",
          changefreq: "weekly",
        }));

        const entries = [
          ...staticEntries,
          ...categoryEntries,
          ...collectionEntries,
          ...brandEntries,
          ...accessoryEntries,
        ];

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
