import { chromium } from 'playwright';
const BASE='http://127.0.0.1:5199';
/**
 * O h3 "Volantes Personalizados" cortava a 768px: no breakpoint md a coluna
 * passa a metade, o padding sobe para 48px e a fonte para 36px ao mesmo tempo.
 *
 * Overflow horizontal da homepage MEDIDO EM origin/main ANTES desta correcao
 * (commit e2805ed) — serve de linha de base. Os 206px a 1024px sao um problema
 * pre-existente noutra seccao, fora do ambito deste pedido; o teste garante
 * apenas que esta alteracao nao o piora nem cria overflow novo.
 */
const BASELINE = { 1440: 0, 1024: 206, 768: 0, 390: 0, 360: 0 };

const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
let fail=0; const ck=(o,m,d)=>{console.log('  '+(o?'PASS':'FAIL')+' '+m+(d?'\n        '+d:'')); if(!o)fail++;};
for (const w of [1440,1024,768,390,360]) {
  const c = await b.newContext({viewport:{width:w,height:900}}); const p = await c.newPage();
  await p.goto(BASE+'/',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const h = [...document.querySelectorAll('h3')].find(e=>e.innerText.trim()==='Volantes Personalizados');
    if (!h) return null;
    const b = h.getBoundingClientRect(); const cs = getComputedStyle(h);
    return { sw:h.scrollWidth, cw:h.clientWidth, fs:cs.fontSize, lh:cs.lineHeight,
      txt:h.innerText.trim(), left:Math.round(b.left), right:Math.round(b.right),
      hScroll: document.documentElement.scrollWidth - window.innerWidth };
  });
  if (!r) { ck(false, w+'px — h3 nao encontrado'); await c.close(); continue; }
  ck(r.sw <= r.cw + 1, w+'px — titulo inteiro visivel ('+r.sw+' <= '+r.cw+'px)  fonte '+r.fs+'  line-height '+r.lh);
  ck(r.txt==='Volantes Personalizados', w+'px — texto exatamente igual');
  ck(r.left>=-1 && r.right<=w+1, w+'px — dentro do ecra');
  ck(r.hScroll <= BASELINE[w], w+'px — nao cria scroll horizontal novo (medido '+r.hScroll+'px, base '+BASELINE[w]+'px)');
  await c.close();
}
await b.close();
console.log(fail===0?'\n=== TUDO VERDE ===':'\n=== '+fail+' FALHA(S) ===');
process.exit(fail?1:0);
