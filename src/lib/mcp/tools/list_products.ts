import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { BRANDS } from "@/lib/brands";

const SITE_URL = "https://redlinewheel.lovable.app";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List steering wheel products in the REDLINE Performance catalog. Optionally filter by brand slug (bmw, mercedes, audi, porsche, etc.). Returns product name, description, price and URL.",
  inputSchema: {
    brandSlug: z
      .string()
      .optional()
      .describe("Optional brand slug to filter by (e.g. 'bmw', 'audi', 'mercedes', 'porsche')."),
    limit: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum number of products to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ brandSlug, limit }) => {
    const brands = brandSlug
      ? BRANDS.filter((b) => b.slug === brandSlug.toLowerCase())
      : BRANDS;

    const products = brands.flatMap((brand) =>
      brand.models.map((model) => ({
        brandSlug: brand.slug,
        brandName: brand.name,
        modelSlug: model.slug,
        name: model.name,
        chassis: model.chassis,
        description: model.description,
        status: model.status ?? "Disponível",
        price: model.price,
        sku: model.sku,
        url: `${SITE_URL}/brand/${brand.slug}/model/${model.slug}`,
      })),
    );

    const limited = typeof limit === "number" ? products.slice(0, limit) : products;

    return {
      content: [{ type: "text", text: JSON.stringify(limited, null, 2) }],
      structuredContent: { count: limited.length, products: limited },
    };
  },
});
