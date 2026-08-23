/**
 * Regressão: espaço vertical vazio depois da secção "Marcas".
 *
 * Percorre a homepage com SCROLL CONTÍNUO desde antes do início das Marcas
 * até depois do início da "Galeria REDLINE", em cinco larguras, e verifica:
 *  - a caixa das Marcas está SEMPRE visível enquanto a secção ocupa scroll
 *    (nenhum viewport vazio entre Marcas e Galeria);
 *  - não há espaço morto no fim do pin (a última barra continua a encher
 *    até ao instante em que o pin liberta);
 *  - as 4 marcas são todas apresentadas e a última fecha com barra cheia;
 *  - Marcas e Galeria não se sobrepõem e não há gap artificial entre elas;
 *  - clicar numa aba salta para a marca certa;
 *  - sem scroll horizontal e sem erros de consola.
 */
import { chromium } from 'playwright';

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = 'http://127.0.0.1:5199';
const SIZES = [[1440,900],[1024,768],[768,1024],[390,844],[360,640]];
// Largura da homepage com overflow horizontal PRÉ-EXISTENTE (medido em
// origin/main antes desta alteração) — não é regressão desta correção.
const KNOWN_OVERFLOW = new Set([1024]);

let fails = 0;
const ok = (c, m) => { console.log(`${c ? '  PASS' : '  FAIL'}  ${m}`); if (!c) fails++; };

const browser = await chromium.launch({ executablePath: EXEC });

for (const [W, H] of SIZES) {
  console.log(`\n=== ${W}x${H} ===`);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('button', { hasText: /^Rejeitar$/ }).first().click().catch(() => {});
  await page.waitForTimeout(700);

  const geo = await page.evaluate(() => {
    const secs = [...document.querySelectorAll('section')];
    const marcas = secs.find((s) => s.querySelector('a[href="/marcas"]'));
    const gal = secs.find((s) => /Galeria REDLINE/i.test(s.textContent || ''));
    const box = (e) => { const b = e.getBoundingClientRect(); return { top: b.top + scrollY, bottom: b.bottom + scrollY, h: b.height }; };
    return { marcas: box(marcas), gal: box(gal) };
  });

  const gap = Math.round(geo.gal.top - geo.marcas.bottom);
  ok(gap === 0, `Marcas termina exatamente onde a Galeria começa (gap ${gap}px, sem sobreposição)`);
  // A altura da secção tem de ser a da própria caixa + a distância pinada, e
  // essa distância tem de derivar da CAIXA (3 + BOUNDARY fatias de uma altura
  // de caixa), nunca da altura do ecrã — era isso que criava scroll a mais.
  const boxH = await page.evaluate(() => {
    const s = [...document.querySelectorAll('section')].find((x) => x.querySelector('a[href="/marcas"]'));
    return s.querySelector('div.z-30').offsetHeight;
  });
  const expected = boxH * (3 + 0.7 + 1);
  ok(Math.abs(geo.marcas.h - expected) <= 4, `altura da secção ${Math.round(geo.marcas.h)}px = caixa(${boxH}) + 3.7 fatias (esperado ${expected}px)`);
  ok(geo.marcas.h - boxH < 3 * H, `distância pinada ${Math.round(geo.marcas.h - boxH)}px < 3 viewports (${3 * H}px)`);

  // --- scroll contínuo ---
  const step = Math.max(60, Math.round(H / 12));
  const from = Math.round(geo.marcas.top - H);
  const to = Math.round(geo.gal.top + H / 2);
  let emptyViewports = 0, worstY = null, seen = new Set(), lastBars = null, deadTail = 0;

  for (let y = from; y <= to; y += step) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(45);
    const s = await page.evaluate(() => {
      const secs = [...document.querySelectorAll('section')];
      const marcas = secs.find((x) => x.querySelector('a[href="/marcas"]'));
      const gal = secs.find((x) => /Galeria REDLINE/i.test(x.textContent || ''));
      const pin = marcas.querySelector('div.z-30');
      const pb = pin.getBoundingClientRect();
      const mb = marcas.getBoundingClientRect();
      const gb = gal.getBoundingClientRect();
      const vh = innerHeight;
      const inter = (a, b) => Math.max(0, Math.min(a.bottom, b) - Math.max(a.top, 0));
      const bars = [...marcas.querySelectorAll('[role="tab"] span > span')]
        .map((b) => Math.round((new DOMMatrixReadOnly(getComputedStyle(b).transform)).a * 1000) / 1000);
      const active = [...marcas.querySelectorAll('[role="tab"]')].findIndex((t) => t.getAttribute('aria-selected') === 'true');
      return {
        pinVisible: inter(pb, vh),
        marcasVisible: inter(mb, vh),
        galVisible: inter(gb, vh),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        bars, active,
      };
    });

    // "viewport vazio": a secção Marcas ocupa o ecrã todo mas a caixa não
    // aparece em lado nenhum, e a Galeria também ainda não entrou.
    if (s.marcasVisible > H * 0.9 && s.pinVisible === 0 && s.galVisible === 0) {
      emptyViewports++; worstY = y;
    }
    if (s.active >= 0) seen.add(s.active);
    if (lastBars && s.pinVisible > 0 && s.marcasVisible >= H * 0.9) {
      const changed = s.bars.some((b, i) => Math.abs(b - lastBars[i]) > 0.002);
      if (!changed) deadTail += step; else deadTail = 0;
    }
    lastBars = s.bars;
    if (!KNOWN_OVERFLOW.has(W)) ok.overflow = s.overflow;
  }

  ok(emptyViewports === 0, `nenhum viewport vazio entre Marcas e Galeria${worstY !== null ? ` (falhou em y=${worstY})` : ''}`);
  ok(deadTail <= step * 2, `sem cauda de scroll morta no fim do pin (${deadTail}px parados)`);
  ok(seen.size === 4 && seen.has(3), `as 4 marcas são apresentadas (vistas: ${[...seen].sort().join(',')})`);
  ok(lastBars && lastBars[3] > 0.98, `a última marca fecha com a barra cheia (scaleX=${lastBars ? lastBars[3] : 'n/a'})`);

  // --- abas continuam a saltar para a marca certa ---
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const s = [...document.querySelectorAll('section')].find((x) => x.querySelector('a[href="/marcas"]'));
    s.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(700);
  // NB: há outros `role="tab"` na homepage — este seletor tem de ser limitado
  // à secção das Marcas.
  const marcasSec = page.locator('section').filter({ has: page.locator('a[href="/marcas"]') });
  const activeTab = () => page.evaluate(() => {
    const s = [...document.querySelectorAll('section')].find((x) => x.querySelector('a[href="/marcas"]'));
    return [...s.querySelectorAll('[role="tab"]')].findIndex((t) => t.getAttribute('aria-selected') === 'true');
  });
  for (const i of [3, 0, 2]) {
    await marcasSec.locator('[role="tab"]').nth(i).click();
    await page.waitForTimeout(1500);
    const got = await activeTab();
    ok(got === i, `clicar na aba ${i + 1} seleciona a marca ${i + 1} (obtido: ${got + 1})`);
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (KNOWN_OVERFLOW.has(W)) console.log(`  SKIP  overflow horizontal ${overflow}px — pré-existente a ${W}px, fora do âmbito`);
  else ok(overflow === 0, `sem scroll horizontal (${overflow}px)`);

  const real = errors.filter((e) => !/favicon|ERR_/i.test(e));
  ok(real.length === 0, `consola sem erros${real.length ? ': ' + real[0].slice(0, 120) : ''}`);

  await page.close();
}

await browser.close();
console.log(fails === 0 ? '\nTODOS OS TESTES PASSARAM' : `\n${fails} TESTE(S) FALHARAM`);
process.exit(fails === 0 ? 0 : 1);
