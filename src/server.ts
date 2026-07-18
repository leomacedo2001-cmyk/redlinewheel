import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Cabeçalhos de segurança aplicados a todas as respostas.
// - HSTS: força HTTPS no browser durante 2 anos (inclui subdomínios).
// - X-Frame-Options / frame-ancestors: impede que o site seja carregado num <iframe>
//   de outro domínio (proteção contra clickjacking).
// - X-Content-Type-Options: impede que o browser "adivinhe" tipos de ficheiro (MIME sniffing).
// - Referrer-Policy: não envia o URL completo de origem para outros sites.
// - Permissions-Policy: desativa APIs sensíveis do browser que o site não usa.
// - CSP: restringe de onde podem vir scripts/estilos/imagens/conexões.
//   Ajusta os domínios abaixo se adicionares novas integrações (ex: outro serviço de analytics).
function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      // 'unsafe-inline' é necessário para os estilos gerados pelo Tailwind/React em runtime.
      "style-src 'self' 'unsafe-inline'",
      // Google Analytics (gtag.js) precisa destes domínios para scripts e pings de medição.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.myshopify.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "frame-src 'self' https://*.myshopify.com",
    ].join("; "),
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
