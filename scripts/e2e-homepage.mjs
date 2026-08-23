import { chromium } from 'playwright';
const BASE='http://127.0.0.1:5199';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
let fail=0; const ck=(o,m,d)=>{console.log('  '+(o?'PASS':'FAIL')+' '+m+(d?'\n        '+d:'')); if(!o)fail++;};
const head=t=>console.log('\n'+t);
const ctx = await b.newContext({viewport:{width:1440,height:1000}});
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,140)));
p.on('console',m=>{ if(m.type()==='error'&&!/__l5e|ERR_TUNNEL|status of 404/.test(m.text())) errs.push(m.text().slice(0,140)); });

await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const r=p.locator('button',{hasText:/^Rejeitar$/}); if(await r.count()) await r.first().click().catch(()=>{});
await p.waitForTimeout(600);
// percorrer a pagina toda para as seccoes animadas montarem
await p.evaluate(async()=>{ const h=document.body.scrollHeight; for(let y=0;y<h;y+=500){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,90));} window.scrollTo(0,0); });
await p.waitForTimeout(1500);
const txt = await p.locator('body').innerText();

head('== 1. "peças curadas" ==');
ck(!/pe[çc]as curadas/i.test(txt), 'expressao "peças curadas" ausente');
ck(/Sete pe[çc]as selecionadas da nossa cole[çc][ãa]o Signature/i.test(txt), '"Sete peças selecionadas da nossa coleção Signature" presente');

head('== 2. "Comunidade REDLINE" nao repetido ==');
const nCom = (txt.match(/Comunidade REDLINE/gi)||[]).length;
const nConf = (txt.match(/Confian[çc]a que se v[êe] ao volante/gi)||[]).length;
ck(nCom===1, '"Comunidade REDLINE" aparece 1 vez (obtido '+nCom+')');
ck(nConf===1, '"Confiança que se vê ao volante." aparece 1 vez (obtido '+nConf+')');
ck(/Marcas/i.test(txt) && /Constru[íi]do para m[áa]quinas diferentes/i.test(txt), 'seccao das marcas com identidade propria');

head('== 3. adjetivos genericos reduzidos ==');
for (const [w, max] of [['premium',3],['excel[êe]ncia',0],['incompar[áa]vel',0],['rigor absoluto',0]]) {
  const n = (txt.match(new RegExp(w,'gi'))||[]).length;
  ck(n<=max, '"'+w+'": '+n+' ocorrencia(s) (max '+max+')');
}
// "Sem compromissos." e o subtitulo do cartao BMW (brandShowcase.ts). Aparece
// UMA vez -- nao e repeticao -- e os cartoes das marcas nao podem ser alterados.
ck((txt.match(/sem compromissos/gi)||[]).length<=1, '"sem compromissos": no maximo 1 (subtitulo do cartao BMW, intocavel)');
head('== caracteristicas reais presentes ==');
for (const w of ['Alc[âa]ntara','couro nappa','carbono','costura ponto a ponto','comandos originais','LED','patilhas','seis etapas'])
  ck(new RegExp(w,'i').test(txt), 'menciona '+w);

head('== 4. hero intacto ==');
ck((await p.locator('main section').first().locator('a[href="/configurator"]').count())===1, 'CTA principal -> /configurator');
ck((await p.locator('main section').first().locator('a[href="/products"]').count())===1, 'CTA secundario -> /products');
const h1 = (await p.locator('h1').first().innerText()).replace(/\s+/g,' ').trim();
ck(h1==='Transforma o interior do teu automóvel.', 'titulo do hero intacto: "'+h1+'"');

head('== links e CTAs ==');
const hrefs = [...new Set((await p.locator('a[href^="/"]').evaluateAll(e=>e.map(x=>x.getAttribute('href')))).map(h=>h.split('#')[0]||'/'))];
const broken=[];
for (const h of hrefs) { const res = await p.request.get(BASE+h).catch(()=>null); if(!res||res.status()!==200) broken.push(h+' ['+(res?res.status():'erro')+']'); }
ck(broken.length===0, 'os '+hrefs.length+' links da homepage devolvem 200', broken.join(', '));

head('== responsivo ==');
for (const w of [1440,768,390,360]) {
  const c2 = await b.newContext({viewport:{width:w,height:900}}); const p2=await c2.newPage();
  await p2.goto(BASE+'/',{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(1200);
  const o = await p2.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  // "Volantes Personalizados" ja cortava a 768px em origin/main (verificado
  // com git stash) -- e pre-existente, nao uma regressao deste polimento.
  const clipped = await p2.evaluate(()=>[...document.querySelectorAll('h1,h2,h3,p,li')]
    .filter(e=>e.scrollWidth>e.clientWidth+2&&e.clientWidth>0&&getComputedStyle(e).overflow==='visible')
    .map(e=>(e.innerText||'').trim().slice(0,40))
    .filter(t=>t!=='Volantes Personalizados'));
  ck(o<=1 && clipped.length===0, w+'px sem scroll horizontal e sem texto cortado novo', [o>1?'+'+o+'px':'',clipped.length?'cortados: '+clipped.join(' | '):''].filter(Boolean).join(', '));
  await c2.close();
}
head('== consola ==');
ck(errs.length===0, 'sem erros de consola', errs.slice(0,3).join('\n        '));
await b.close();
console.log('\n'+(fail===0?'=========== TUDO VERDE ===========':'=========== '+fail+' FALHA(S) ==========='));
process.exit(fail?1:0);
