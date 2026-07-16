import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listBrandsTool from "./tools/list_brands";
import listProductsTool from "./tools/list_products";
import getProductTool from "./tools/get_product";

// Direct Supabase issuer (not the .lovable.cloud proxy).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "redline-performance-mcp",
  title: "REDLINE Performance",
  version: "0.1.0",
  instructions:
    "Tools for the REDLINE Performance catalog: premium steering wheels and interior parts for BMW, Audi, Mercedes, Porsche and more. Use `list_brands` to discover brands, `list_products` (optionally filtered by brand) to browse the catalog, and `get_product` for full details of one model.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listBrandsTool, listProductsTool, getProductTool],
});
