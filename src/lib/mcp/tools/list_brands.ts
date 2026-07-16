import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { BRANDS } from "@/lib/brands";

export default defineTool({
  name: "list_brands",
  title: "List brands",
  description:
    "List all car brands available in the REDLINE Performance catalog with their slug, name, tagline and number of models.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const brands = BRANDS.map((b) => ({
      slug: b.slug,
      name: b.name,
      tagline: b.tagline,
      description: b.description,
      modelCount: b.models.length,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(brands, null, 2) }],
      structuredContent: { brands },
    };
  },
});
