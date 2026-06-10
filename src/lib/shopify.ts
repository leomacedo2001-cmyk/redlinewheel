import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "apex-automotive-7ojnz.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "9f2e79096a9e8a43be5a9830bb7a14e3";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs a paid Shopify plan. Visit admin.shopify.com to upgrade.",
    });
    return;
  }
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data.errors) throw new Error(data.errors.map((e: { message: string }) => e.message).join(", "));
  return data;
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id title description handle
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 10) {
            edges { node {
              id title
              price { amount currencyCode }
              availableForSale
              selectedOptions { name value }
            } }
          }
          options { name values }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id title description handle
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 10) { edges { node { url altText } } }
      variants(first: 20) {
        edges { node {
          id title
          price { amount currencyCode }
          availableForSale
          selectedOptions { name value }
        } }
      }
      options { name values }
    }
  }
`;

export async function fetchProducts(first = 20, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query });
  return data?.data?.products?.edges ?? [];
}

export async function fetchProductByHandle(handle: string) {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  const p = data?.data?.product;
  if (!p) return null;
  return { node: p } as ShopifyProduct;
}

/* ============================================================
 * Produtos em Destaque — persistência via Shopify Metafields
 * ------------------------------------------------------------
 * No Shopify Admin → Produto → secção "Metafields" define:
 *   - Namespace: redline   Key: featured_enabled   Type: Boolean
 *   - Namespace: redline   Key: featured_order     Type: Integer
 * E adiciona a tag "featured" aos produtos que queres destacar.
 *
 * Para os metafields aparecerem na Storefront API têm de estar
 * expostos: Settings → Custom data → Products → adicionar as
 * definições acima e marcar "Storefront access".
 * ============================================================ */

export const FEATURED_NAMESPACE = "redline";
export const FEATURED_ORDER_KEY = "featured_order";
export const FEATURED_ENABLED_KEY = "featured_enabled";

export interface FeaturedWheel {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  vendor: string;
  order: number;
  enabled: boolean;
}

const FEATURED_QUERY = `
  query GetFeatured($first: Int!, $query: String!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id title description handle vendor
          images(first: 1) { edges { node { url altText } } }
          enabled: metafield(namespace: "${FEATURED_NAMESPACE}", key: "${FEATURED_ENABLED_KEY}") { value }
          order: metafield(namespace: "${FEATURED_NAMESPACE}", key: "${FEATURED_ORDER_KEY}") { value }
        }
      }
    }
  }
`;

export async function fetchFeaturedWheels(first = 24): Promise<FeaturedWheel[]> {
  const data = await storefrontApiRequest(FEATURED_QUERY, { first, query: "tag:featured" });
  const edges = data?.data?.products?.edges ?? [];
  type Edge = {
    node: {
      id: string; title: string; description: string; handle: string; vendor: string;
      images: { edges: Array<{ node: { url: string; altText: string | null } }> };
      enabled: { value: string } | null;
      order: { value: string } | null;
    };
  };
  return (edges as Edge[])
    .map((e) => {
      const img = e.node.images.edges[0]?.node;
      const enabledRaw = e.node.enabled?.value;
      // Default: enabled when metafield ausente (assume destaque ativo)
      const enabled = enabledRaw == null ? true : enabledRaw === "true" || enabledRaw === "1";
      const order = e.node.order?.value ? Number(e.node.order.value) : Number.MAX_SAFE_INTEGER;
      return {
        id: e.node.id,
        handle: e.node.handle,
        title: e.node.title,
        description: e.node.description,
        image: img?.url ?? "",
        imageAlt: img?.altText ?? e.node.title,
        vendor: e.node.vendor,
        order,
        enabled,
      } satisfies FeaturedWheel;
    })
    .filter((w) => w.enabled)
    .sort((a, b) => a.order - b.order);
}
