import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getBrandModel } from "@/lib/brands";

const SITE_URL = "https://redlinewheel.lovable.app";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Get full details for a specific steering wheel product, including specs, compatibilities, gallery URLs and price.",
  inputSchema: {
    brandSlug: z.string().min(1).describe("Brand slug (e.g. 'bmw')."),
    modelSlug: z.string().min(1).describe("Model slug (e.g. 'g-series-forged-magenta')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ brandSlug, modelSlug }) => {
    const result = getBrandModel(brandSlug, modelSlug);
    if (!result) {
      return {
        content: [
          { type: "text", text: `Product not found for brand='${brandSlug}' model='${modelSlug}'.` },
        ],
        isError: true,
      };
    }
    const { brand, model } = result;
    const product = {
      brandSlug: brand.slug,
      brandName: brand.name,
      modelSlug: model.slug,
      name: model.name,
      chassis: model.chassis,
      description: model.description,
      longDescription: model.longDescription,
      status: model.status ?? "Disponível",
      price: model.price,
      sku: model.sku,
      compatibilities: model.compatibilities,
      specs: model.specs,
      gallery: model.gallery,
      image: model.img,
      url: `${SITE_URL}/brand/${brand.slug}/model/${model.slug}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
