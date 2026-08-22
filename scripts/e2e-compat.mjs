import { chromium } from 'playwright';
const BASE='http://127.0.0.1:5199';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
let fail=0; const ck=(o,m,d)=>{console.log('  '+(o?'PASS':'FAIL')+' '+m+(d?'\n        '+d:'')); if(!o)fail++;};
const head=t=>console.log('\n'+t);
const ctx = await b.newContext({viewport:{width:1440,height:1000}});
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,140)));
p.on('console',m=>{ if(m.type()==='error'&&!/__l5e|ERR_TUNNEL|status of 404/.test(m.text())) errs.push(m.text().slice(0,140)); });
const dismiss=async()=>{ const r=p.locator('button',{hasText:/^Rejeitar$/}); if(await r.count()) await r.first().click().catch(()=>{}); await p.waitForTimeout(400); };
const go=async u=>{ await p.goto(BASE+u,{waitUntil:'networkidle'}); await p.waitForTimeout(900); await dismiss(); };

// modelo -> {linhas esperadas}
const CASES = [
  { label:'BMW — varias compat, chassis por entrada + geracao', path:'/brand/bmw/model/g-series-forged-magenta',
    marca:'BMW', linhas:[['330i','G20/G80/G82'],['M3','G80'],['M3 Touring','G81'],['M4','G82']],
    bom:{modelo:'M3 G80'}, chassisInequivoco:false },
  { label:'BMW — geracao unica com anos', path:'/brand/bmw/model/e87',
    marca:'BMW', linhas:[['116i','E87 · 2004–2013'],['1M Coupé','E87 · 2004–2013']],
    bom:{modelo:'118i'}, chassisInequivoco:'E87' },
  { label:'Mercedes-Benz — chassis+anos em todas', path:'/brand/mercedes-benz/model/w205',
    marca:'Mercedes-Benz', linhas:[['C63 AMG','W205 · 2014–2021'],['C180','W205 · 2014–2021']],
    bom:{modelo:'C63 AMG'}, chassisInequivoco:'W205' },
  { label:'Mercedes-Benz — SEM chassis nem anos (generico)', path:'/brand/mercedes-benz/model/amg-red-forged-signature',
    marca:'Mercedes-Benz', linhas:[['C63 AMG',null],['GT AMG',null]],
    bom:{modelo:'C63 AMG'}, generico:true, chassisInequivoco:false },
  { label:'Audi — chassis por entrada, sem anos', path:'/brand/audi/model/rs-carbon-signature',
    marca:'Audi', linhas:[['RS3','8Y'],['RS4','B9'],['RS6','C8'],['TT RS',null]],
    bom:{modelo:'RS3 8Y'}, generico:true, chassisInequivoco:false },
  { label:'Audi — geracao unica com anos abertos', path:'/brand/audi/model/8y',
    marca:'Audi', linhas:[['A3','8Y · 2020–...'],['RS3','8Y · 2020–...']],
    bom:{modelo:'RS3'}, chassisInequivoco:'8Y' },
  { label:'UNICA compatibilidade', path:'/brand/outras-marcas/model/civic-fk8',
    marca:'Outras Marcas', linhas:[['Civic Type R','FK8']],
    bom:{modelo:'Civic Type R FK8'}, unica:'Civic Type R', chassisInequivoco:'FK8' },
];

for (const c of CASES) {
  head('== '+c.label+' ==');
  await go(c.path);
  const txt = await p.locator('body').innerText();
  ck(/COMPATIBILIDADE/i.test(txt), 'seccao "Compatibilidade" presente');
  // cada compatibilidade numa linha propria
  const items = await p.locator('main ul li').filter({hasNotText:/^$/}).evaluateAll(els=>els.map(e=>e.innerText.replace(/\n+/g,'|').trim()));
  for (const [modelo, detalhe] of c.linhas) {
    const hit = items.find(i=>i.split('|')[0].trim()===modelo);
    if (!hit) { ck(false, 'linha "'+modelo+'"', 'linhas vistas: '+items.slice(0,10).join(' ; ')); continue; }
    const seg = hit.split('|').map(x=>x.trim());
    if (detalhe===null) ck(seg[1]==='A confirmar'||seg.length===1, '"'+modelo+'" -> so o modelo (sem chassis/anos inventados)', 'obtido: '+hit);
    else ck(seg[1]===detalhe, '"'+modelo+'" -> "'+detalhe+'"', seg[1]===detalhe?'':'obtido: '+hit);
  }
  if (c.generico) ck(txt.includes('Compatibilidade final confirmada antes da produção.'), 'nota discreta de confirmacao final');
  else ck(!txt.includes('Compatibilidade final confirmada antes da produção.'), 'sem nota de confirmacao (dados completos)');

  // --- validacao de compra usa a mesma fonte ---
  await p.getByRole('button',{name:/^Comprar este volante$/i}).click();
  const opened = await p.waitForSelector('[role="dialog"][data-state="open"]',{timeout:10000}).then(()=>true).catch(()=>false);
  await p.waitForTimeout(400);
  ck(opened, 'abre a confirmacao de compatibilidade');
  if (opened) {
    const dlg = p.locator('[role="dialog"][data-state="open"]');
    const ins = dlg.locator('input');
    await ins.nth(0).fill(c.marca); await ins.nth(1).fill(c.bom.modelo); await p.waitForTimeout(150);
    await dlg.getByRole('button',{name:/Verificar compatibilidade/i}).click(); await p.waitForTimeout(450);
    const t1 = await dlg.innerText();
    const esperaConfirmar = c.marca !== 'Outras Marcas';
    if (esperaConfirmar) ck(/Compatibilidade confirmada/i.test(t1), 'veiculo declarado -> confirmada ("'+c.bom.modelo+'")', t1.slice(0,120));
    else ck(/confirmar manualmente/i.test(t1), 'marca generica -> confirmacao manual (correto)');
    // caso insuficiente
    await ins.nth(0).fill('Fiat'); await ins.nth(1).fill('Panda 1998'); await p.waitForTimeout(150);
    await dlg.getByRole('button',{name:/Verificar compatibilidade/i}).click(); await p.waitForTimeout(450);
    const t2 = await dlg.innerText();
    ck(/confirmar manualmente/i.test(t2) && !/erro/i.test(t2), 'dados insuficientes -> manual, sem erro');
    ck(await dlg.locator('a[href^="mailto:"]').count()>=1, 'permite contacto');
    ck(await dlg.getByRole('button',{name:/Continuar mesmo assim/i}).count()===1, 'mantem "Continuar mesmo assim"');
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  }

  // --- configurador: so pre-preenche o inequivoco ---
  const href = await p.locator('main a[href*="/configurator"]').first().getAttribute('href');
  await go(href);
  const vals = await p.locator('form input').evaluateAll(els=>els.map(e=>e.value));
  const [vMarca,,vChassis] = [vals[0],vals[1],vals[2]];
  ck(vals[0]===c.marca, 'marca pre-preenchida ("'+c.marca+'")');
  if (c.unica) ck(vals[1]===c.unica, 'modelo pre-preenchido (unica compatibilidade): "'+c.unica+'"', 'obtido "'+vals[1]+'"');
  else ck(vals[1]==='', 'modelo VAZIO (varias hipoteses, nao escolhe arbitrariamente)', 'obtido "'+vals[1]+'"');
  if (c.chassisInequivoco) ck(vals[2]===c.chassisInequivoco, 'chassis pre-preenchido (inequivoco): "'+c.chassisInequivoco+'"', 'obtido "'+vals[2]+'"');
  else ck(vals[2]==='', 'chassis VAZIO (ambiguo entre compatibilidades)', 'obtido "'+vals[2]+'"');
}

head('== Pesquisa por chassis ==');
// Nota: so os 22 produtos com `attributes` entram em /products — os modelos-base
// configuraveis (civic-fk8, golf-7, ...) nunca aparecem no catalogo, por desenho.
for (const [q, esperado] of [['G80','/brand/bmw/model/g-series'],['W205','/brand/mercedes-benz/model/w205'],
                             ['8Y','/brand/audi/model/8y'],['w205',null],['W213','/brand/mercedes-benz/model/w213'],
                             ['B8','/brand/audi/model/b8'],['991','/brand/porsche/model/991'],['F80',null],['C8',null],['g81',null]]) {
  await go('/products?q='+encodeURIComponent(q));
  const n = await p.locator('a[href^="/brand/"][href*="/model/"]').count();
  const hrefs = await p.locator('a[href^="/brand/"][href*="/model/"]').evaluateAll(e=>e.map(x=>x.getAttribute('href')));
  ck(n>0, 'procurar "'+q+'" devolve '+n+' volante(s)', n>0?'ex.: '+hrefs.slice(0,3).join(', '):'nenhum resultado');
  if (esperado) ck(hrefs.some(h=>h.startsWith(esperado)), '  inclui '+esperado+'...');
}
await go('/products?q=zzzznaoexiste');
ck(await p.locator('a[href^="/brand/"][href*="/model/"]').count()===0, 'termo inexistente -> 0 resultados (sem associacoes inventadas)');

head('== Nao alterado ==');
await go('/acessorios/patilhas-carbono-azul');
const at = await p.locator('body').innerText();
ck(/Quantidade/i.test(at) && !/Comprar este volante/i.test(at), 'acessorios inalterados');
await go('/paddleshift');
ck(await p.locator('a[href^="/acessorios/"]').count()===2, '/paddleshift inalterado');
await go('/brand/audi/model/rs-carbon-signature');
const rt = await p.locator('body').innerText();
ck(rt.includes('€1.149') && rt.includes('Audi RS Carbon Signature') && rt.includes('Garantia 3 anos'), 'preco, nome e selos intactos');

head('== Responsivo ==');
for (const w of [1440,768,390,360]) {
  const c2 = await b.newContext({viewport:{width:w,height:900}}); const p2 = await c2.newPage();
  const probs=[];
  for (const u of ['/brand/bmw/model/e87','/brand/mercedes-benz/model/w205','/brand/audi/model/rs-carbon-signature','/products']) {
    await p2.goto(BASE+u,{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(800);
    const o = await p2.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    if (o>1) probs.push(u+' +'+o+'px');
  }
  ck(probs.length===0, w+'px sem scroll horizontal', probs.join(', '));
  await c2.close();
}

head('== Consola ==');
ck(errs.length===0, 'sem erros de consola', errs.slice(0,3).join('\n        '));
await b.close();
console.log('\n'+(fail===0?'=========== TUDO VERDE ===========':'=========== '+fail+' FALHA(S) ==========='));
process.exit(fail===0?0:1);
