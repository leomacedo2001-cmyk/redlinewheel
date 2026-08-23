import { chromium } from 'playwright';
const BASE='http://127.0.0.1:5199';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
let fail=0; const ck=(o,m,d)=>{console.log('  '+(o?'PASS':'FAIL')+' '+m+(d?'\n        '+d:'')); if(!o)fail++;};
const head=t=>console.log('\n'+t);
const ctx=await b.newContext({viewport:{width:1440,height:1000}});
const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,140)));
p.on('console',m=>{ if(m.type()==='error'&&!/__l5e|ERR_TUNNEL|status of 404/.test(m.text())) errs.push(m.text().slice(0,140)); });
const load=async()=>{ await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
  const r=p.locator('button',{hasText:/^Rejeitar$/}); if(await r.count()) await r.first().click().catch(()=>{});
  await p.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}});
  await p.waitForTimeout(1200); };
await load();

head('== 1. seccao presente e no sitio certo ==');
const sec = p.locator('#como-funciona');
ck(await sec.count()===1, 'seccao #como-funciona existe');
const t = await sec.innerText();
ck(/COMO FUNCIONA/i.test(t), 'eyebrow "Como funciona"');
ck(/Do teu carro à configuração final\./.test(t), 'titulo "Do teu carro à configuração final."');
// ordem na pagina: depois do configurador, antes da transformacao/galeria
const ordem = await p.evaluate(()=>{
  const ids=['produtos-personalizados','como-funciona','transformacao'];
  return ids.map(id=>{const e=document.getElementById(id); return e?Math.round(e.getBoundingClientRect().top+window.scrollY):-1;});
});
ck(ordem[0]>=0 && ordem[1]>ordem[0], 'aparece DEPOIS do serviço/configurador');
ck(ordem[2]<0 || ordem[1]<ordem[2], 'aparece ANTES da Transformação/galeria');
console.log('        posicoes Y: configurador='+ordem[0]+'  como-funciona='+ordem[1]+'  transformacao='+ordem[2]);

head('== 2. os 4 passos, pela ordem correta ==');
const passos = await sec.locator('ol > li').evaluateAll(els=>els.map(e=>e.innerText.replace(/\n+/g,'|').trim()));
ck(passos.length===4, 'exatamente 4 passos (obtido '+passos.length+')');
const ESPERADO = [
 ['01','Escolhe','Seleciona um volante da coleção ou começa diretamente pelo configurador.'],
 ['02','Confirma o teu automóvel','Indica marca, modelo, ano e geração para validarmos a compatibilidade.'],
 ['03','Personaliza','Mantém a configuração apresentada ou altera materiais, acabamentos e opções disponíveis.'],
 ['04','Encomenda','Revê a configuração final e avança com a tua encomenda.'],
];
ESPERADO.forEach(([n,titulo,desc],i)=>{
  const seg=(passos[i]||'').split('|').map(x=>x.trim());
  const ok = seg[0]===n && seg.includes(titulo) && seg.includes(desc);
  ck(ok, 'passo '+n+' — "'+titulo+'"', ok?'':'obtido: '+passos[i]);
});

head('== 3. CTAs ==');
const cta1 = sec.locator('a[href="/configurator"]');
const cta2 = sec.locator('a[href="/products"]');
ck(await cta1.count()===1, 'CTA principal -> /configurator');
ck(await cta2.count()===1, 'CTA secundario -> /products');
ck((await cta1.innerText()).trim().toLowerCase()==='configurar o meu volante', 'texto: "'+(await cta1.innerText()).trim()+'"');
ck((await cta2.innerText()).trim().toLowerCase()==='ver modelos disponíveis', 'texto: "'+(await cta2.innerText()).trim()+'"');
const b1=await cta1.boundingBox(), b2=await cta2.boundingBox();
ck(Math.round(b1.height)===56 && Math.round(b2.height)===56, 'mesma altura dos CTAs do hero (56px): '+Math.round(b1.height)+'/'+Math.round(b2.height));
const c1=await cta1.getAttribute('class'), c2=await cta2.getAttribute('class');
ck(c1.includes('bg-primary')&&c1.includes('rounded-none')&&c1.includes('uppercase'), 'principal usa a linguagem visual existente');
ck(c2.includes('border-foreground/30')&&c2.includes('rounded-none'), 'secundario usa a variante outline existente');
for (const h of ['/configurator','/products']) { const r=await p.request.get(BASE+h); ck(r.status()===200, h+' devolve 200'); }

head('== 4. nada inventado ==');
const PROIBIDO = [/\d+\s*horas/i, /\d+\s*dias/i, /\d+\s*semanas/i, /\d+\s*%/, /stock/i, /certifica/i,
                  /garantia/i, /entrega em/i, /prazo/i, /mbway|mb way|paypal|visa|mastercard/i, /48/];
const achados = PROIBIDO.filter(re=>re.test(t)).map(re=>String(re));
ck(achados.length===0, 'sem prazos, percentagens, stock, garantias ou pagamentos', achados.join(' | '));

head('== 5. links da homepage ==');
const hrefs=[...new Set((await p.locator('a[href^="/"]').evaluateAll(e=>e.map(x=>x.getAttribute('href')))).map(h=>h.split('#')[0]||'/'))];
const bad=[]; for (const h of hrefs){const r=await p.request.get(BASE+h).catch(()=>null); if(!r||r.status()!==200) bad.push(h);}
ck(bad.length===0, 'os '+hrefs.length+' links da homepage devolvem 200', bad.join(', '));

head('== 6. responsivo ==');
const BASELINE={1440:0,1024:206,768:0,390:0,360:0}; // 1024: overflow pre-existente noutra seccao
for (const w of [1440,1024,768,390,360]) {
  const c2=await b.newContext({viewport:{width:w,height:900}}); const p2=await c2.newPage();
  await p2.goto(BASE+'/',{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(1400);
  await p2.evaluate(()=>{const e=document.getElementById('como-funciona'); if(e) e.scrollIntoView();});
  await p2.waitForTimeout(900);
  const r = await p2.evaluate((vw)=>{
    const s=document.getElementById('como-funciona');
    const items=[...s.querySelectorAll('ol > li')].map(e=>e.getBoundingClientRect());
    const cortado=[...s.querySelectorAll('h2,h3,p,a,span')].filter(e=>e.scrollWidth>e.clientWidth+2&&e.clientWidth>0&&getComputedStyle(e).overflow==='visible').map(e=>(e.innerText||'').slice(0,30));
    return { o: document.documentElement.scrollWidth-window.innerWidth,
             fora: items.filter(b=>b.right>vw+1||b.left<-1).length,
             cortado, cols: new Set(items.map(b=>Math.round(b.left))).size };
  }, w);
  ck(r.o<=BASELINE[w] && r.fora===0 && r.cortado.length===0,
     w+'px — sem scroll horizontal novo, passos dentro do ecra, texto inteiro  ['+r.cols+' coluna(s)]',
     [r.o>BASELINE[w]?'+'+r.o+'px':'', r.fora?r.fora+' passos fora':'', r.cortado.length?'cortado: '+r.cortado.join(' | '):''].filter(Boolean).join(', '));
  await c2.close();
}

head('== 7. consola ==');
ck(errs.length===0,'sem erros de consola', errs.slice(0,3).join('\n        '));
await b.close();
console.log('\n'+(fail===0?'=========== TUDO VERDE ===========':'=========== '+fail+' FALHA(S) ==========='));
process.exit(fail?1:0);
