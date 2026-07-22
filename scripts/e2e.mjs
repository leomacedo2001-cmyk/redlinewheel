import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:4173";

// Página -> nº de produtos esperado (calculado a partir dos atributos).
const EXPECT = {
  "/produtos/alcantara": 10,
  "/produtos/pele-perfurada": 13,
  "/produtos/fibra-de-carbono": 20,
  "/produtos/costuras-personalizadas": 22,
  "/produtos/volante-led": 3, // G-Series Forged Magenta + Audi RS Carbon Signature + F-Series Carbon Red
  "/produtos/patilhas": 14,
  "/produtos/oem-plus": 4,
  "/c/formato-flat-bottom": 21,
  "/c/formato-round": 1,
  "/c/costura-vermelha": 6,
  "/c/costura-azul": 1,
  "/c/costura-verde": 2,
  "/c/costura-tricolor-m": 7,
  "/c/material-carbono-forjado": 7,
  "/c/feature-faixa-12h": 15,
};

const SMOKE = [
  "/",
  "/products",
  "/marcas",
  "/galeria",
  "/filtros",
  "/brand/bmw",
  "/brand/bmw/model/g-series-forged-magenta",
  "/acessorios",
  "/acessorios/patilhas-borracha-azul",
  "/acessorios/patilhas-carbono-azul",
  ...Object.keys(EXPECT),
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
let failures = 0;

for (const path of SMOKE) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  let status = 0;
  try {
    const resp = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 30000 });
    status = resp?.status() ?? 0;
  } catch (e) {
    console.log(`✗ ${path}  navegação falhou: ${e.message}`);
    failures++;
    await page.close();
    continue;
  }

  const bodyText = await page.evaluate(() => document.body.innerText);
  const brokenBoundary = /não carregou|Esta página não|Personalização não encontrada|Filtro não encontrado|Marca não encontrada/i.test(bodyText);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );

  let countInfo = "";
  if (path in EXPECT) {
    const count = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/model/"]'));
      const set = new Set(links.map((a) => a.getAttribute("href")));
      return set.size;
    });
    const exp = EXPECT[path];
    const ok = count === exp;
    countInfo = ` produtos=${count} (esperado ${exp})${ok ? "" : "  ✗COUNT"}`;
    if (!ok) failures++;
  }

  // Ignora 404 de recursos: as imagens de produto (.asset.json) vivem no CDN
  // do Lovable e só resolvem no site publicado, não em localhost.
  const realErrors = errors.filter(
    (e) => !/favicon|analytics|gtag|googletag|Failed to load resource/i.test(e),
  );
  const bad = status >= 400 || brokenBoundary || overflow || realErrors.length > 0;
  if (bad) failures++;
  console.log(
    `${bad ? "✗" : "✓"} ${path}  status=${status}${overflow ? " OVERFLOW" : ""}${brokenBoundary ? " BROKEN" : ""}${realErrors.length ? " ERR:" + realErrors.slice(0, 2).join("|") : ""}${countInfo}`,
  );
  await page.close();
}

await browser.close();
console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
