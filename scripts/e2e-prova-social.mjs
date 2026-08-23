import { chromium } from 'playwright';
const BASE='http://127.0.0.1:5199';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
let fail=0; const ck=(o,m,d)=>{console.log('  '+(o?'PASS':'FAIL')+' '+m+(d?'\n        '+d:'')); if(!o)fail++;};
const head=t=>console.log('\n'+t);
const ctx = await b.newContext({viewport:{width:1440,height:1000}});
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,140)));
p.on('console',m=>{ if(m.type()==='error'&&!/__l5e|ERR_TUNNEL|status of 404/.test(m.text())) errs.push(m.text().slice(0,140)); });
const dismiss=async()=>{const r=p.locator('button',{hasText:/^Rejeitar$/}); if(await r.count()) await r.first().click().catch(()=>{}); await p.waitForTimeout(400);};
const sweep=async()=>{ await p.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}window.scrollTo(0,0);}); await p.waitForTimeout(1200); };

const NOMES = ['Miguel Santos','Lukas Hoffmann','Sophie Laurent','Jan Kowalski','Marco Rossi','Emma van Dijk',
 'Andrius Petrauskas','Klara Nováková','David Murphy','Elena Popescu','Nikolas Papadopoulos','Freja Larsen',
 'Sebastian Wagner','Camille Dubois','Oskar Lindqvist','Thomas Keller','James Whitfield','Iker Fernández'];
const CIDADES = ['Munique','Lyon','Varsóvia','Milão','Roterdão','Vilnius','Praga','Bucareste','Atenas',
 'Copenhaga','Viena','Bruxelas','Estocolmo','Zurique','Manchester','Madrid','Dublin'];
const FRASES = ['Instalações Reais','Instalações reais','carros reais','clientes reais','Comunidade REDLINE','48 horas'];

for (const [url, label] of [['/','homepage'],['/galeria','/galeria']]) {
  head('== '+label+' ==');
  await p.goto(BASE+url,{waitUntil:'networkidle'}); await p.waitForTimeout(1200); await dismiss(); await sweep();
  const t = await p.locator('body').innerText();

  const nomesVistos = NOMES.filter(n=>t.includes(n));
  ck(nomesVistos.length===0, 'zero nomes ficticios visiveis', nomesVistos.join(', '));
  const cidadesVistas = CIDADES.filter(c=>new RegExp('\\b'+c+'\\b').test(t));
  ck(cidadesVistas.length===0, 'zero cidades ficticias visiveis', cidadesVistas.join(', '));
  const frasesVistas = FRASES.filter(f=>t.includes(f));
  ck(frasesVistas.length===0, 'zero frases proibidas', frasesVistas.join(' | '));
  ck(!/estrelas|de 5 estrelas/i.test(t), 'sem rotulos de classificacao');
  // estrelas preenchidas (fill-...) = rating; as vazias do "sem avaliacoes" nao contam
  const filled = await p.locator('svg.lucide-star[class*="fill-"]').count();
  ck(filled===0, 'zero estrelas de classificacao renderizadas (obtido '+filled+')');
  ck(!/\b\d+\s+instala[çc][õo]es\b/i.test(t), 'sem contagem de "N instalacoes"');
}

head('== textos novos ==');
await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(1000); await dismiss(); await sweep();
const home = await p.locator('body').innerText();
ck(/GALERIA REDLINE/i.test(home), 'homepage — eyebrow "Galeria REDLINE"');
ck(/Inspira[çc][ãa]o ao volante\./.test(home), 'homepage — titulo "Inspiração ao volante."');
ck(/Explora diferentes acabamentos, materiais e estilos REDLINE\./.test(home), 'homepage — texto curto correto');
await p.goto(BASE+'/galeria',{waitUntil:'networkidle'}); await p.waitForTimeout(1000); await dismiss();
const gal = await p.locator('body').innerText();
ck(/GALERIA/i.test(gal), '/galeria — eyebrow "Galeria"');
ck(/Configura[çc][õo]es REDLINE\./.test(gal), '/galeria — titulo "Configurações REDLINE."');
ck(/Uma sele[çc][ãa]o visual de acabamentos, materiais e estilos/.test(gal), '/galeria — descricao correta');

head('== fotografias preservadas ==');
ck(await p.locator('main figure img').count()===18, '/galeria mantem as 18 fotografias (obtido '+await p.locator('main figure img').count()+')');
const broken = await p.evaluate(()=>[...document.querySelectorAll('main figure img')].filter(i=>i.complete&&i.naturalWidth===0).length);
ck(broken===0, 'nenhuma imagem partida');
ck(await p.locator('main figcaption').count()===0, 'sem legendas nos cartoes (obtido '+await p.locator('main figcaption').count()+')');
await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200); await dismiss(); await sweep();
const carr = await p.locator('article img[width="720"]').count();
ck(carr===18, 'carrossel da homepage mantem as 18 fotografias (obtido '+carr+')');

head('== fichas de produto inalteradas ==');
for (const u of ['/brand/audi/model/rs-carbon-signature','/acessorios/patilhas-carbono-azul']) {
  await p.goto(BASE+u,{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
  const t = await p.locator('body').innerText();
  ck(/Ainda sem avalia[çc][õo]es/i.test(t), u+' — mantem "Ainda sem avaliações"');
  ck(NOMES.filter(n=>t.includes(n)).length===0, u+' — sem nomes ficticios');
}
await p.goto(BASE+'/brand/audi/model/rs-carbon-signature',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const ficha = await p.locator('body').innerText();
ck(ficha.includes('€1.149') && ficha.includes('Garantia 3 anos') && /comprar este volante/i.test(ficha),
   'ficha intacta: preco, garantia e CTA');

head('== links ==');
await p.goto(BASE+'/galeria',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
const hrefs=[...new Set((await p.locator('a[href^="/"]').evaluateAll(e=>e.map(x=>x.getAttribute('href')))).map(h=>h.split('#')[0]||'/'))];
const bad=[]; for (const h of hrefs){const r=await p.request.get(BASE+h).catch(()=>null); if(!r||r.status()!==200) bad.push(h);}
ck(bad.length===0, 'os '+hrefs.length+' links de /galeria devolvem 200', bad.join(', '));

head('== responsivo ==');
const BASELINE={1440:0,768:0,390:0,360:0};
for (const w of [1440,768,390,360]) {
  const c2=await b.newContext({viewport:{width:w,height:900}}); const p2=await c2.newPage();
  const probs=[];
  for (const u of ['/','/galeria']) {
    await p2.goto(BASE+u,{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(1200);
    const o=await p2.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    if (o>BASELINE[w]) probs.push(u+' +'+o+'px');
  }
  ck(probs.length===0, w+'px — homepage e /galeria sem scroll horizontal', probs.join(', '));
  await c2.close();
}
head('== consola ==');
ck(errs.length===0,'sem erros de consola', errs.slice(0,3).join('\n        '));
await b.close();
console.log('\n'+(fail===0?'=========== TUDO VERDE ===========':'=========== '+fail+' FALHA(S) ==========='));
process.exit(fail?1:0);
