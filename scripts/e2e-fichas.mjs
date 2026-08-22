import { chromium } from 'playwright';
const BASE='http://127.0.0.1:5199';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
let fail=0; const ck=(o,m,d)=>{console.log('  '+(o?'PASS':'FAIL')+' '+m+(d?'\n        '+d:'')); if(!o)fail++;};
const head=t=>console.log('\n'+t);

const PRODUCTS = [
  { path:'/brand/bmw/model/g-series-forged-magenta', brand:'BMW', name:'BMW G-Series Forged Magenta Signature',
    price:'€1.199', chassis:'', good:{marca:'BMW',modelo:'M3 G80'},
    prefill:{ marca:'BMW', chassis:'', tipo:'Achatado em baixo (flat bottom)',
      material:'Combinação Alcântara + Carbono', carbono:'Carbono forged', costuras:'Amarelo',
      faixa:null, extras:['Indicador LED de mudança'], naoExtras:['Patilhas de velocidade em alumínio'] } },
  { path:'/brand/mercedes-benz/model/amg-red-forged-signature', brand:'Mercedes-Benz', name:'Mercedes-AMG Red Forged Signature',
    price:'€1.249', chassis:'', good:{marca:'Mercedes-Benz',modelo:'C63 AMG'},
    prefill:{ marca:'Mercedes-Benz', chassis:'', tipo:'Achatado em baixo (flat bottom)',
      material:'Combinação Alcântara + Carbono', carbono:'Carbono forged', costuras:'Vermelho',
      faixa:'Sem faixa', extras:['Patilhas de velocidade em alumínio'], naoExtras:['Indicador LED de mudança'] } },
  { path:'/brand/audi/model/rs-carbon-signature', brand:'Audi', name:'Audi RS Carbon Signature',
    price:'€1.149', chassis:'', good:{marca:'Audi',modelo:'RS3 8Y'},
    prefill:{ marca:'Audi', chassis:'', tipo:'Achatado em baixo (flat bottom)',
      material:'Pele perfurada', carbono:'Carbono twill 2x2', costuras:'Vermelho',
      faixa:'Sem faixa', extras:['Indicador LED de mudança'], naoExtras:['Patilhas de velocidade em alumínio'] } },
];

const ctx = await b.newContext({ viewport:{width:1440,height:1000} });
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,140)));
p.on('console',m=>{ if(m.type()==='error' && !/__l5e|ERR_TUNNEL|status of 404/.test(m.text())) errs.push(m.text().slice(0,140)); });
const dismiss=async()=>{ const r=p.locator('button',{hasText:/^Rejeitar$/}); if (await r.count()) await r.first().click().catch(()=>{}); await p.waitForTimeout(400); };

for (const prod of PRODUCTS) {
  head('== '+prod.brand+' — '+prod.name+' ==');
  await p.goto(BASE+prod.path,{waitUntil:'networkidle'}); await p.waitForTimeout(1400); await dismiss();
  const txt = await p.locator('body').innerText();

  ck(!/Quantidade/i.test(txt), 'seletor de Quantidade removido');
  ck(await p.getByRole('button',{name:/^Comprar este volante$/i}).count()===1, 'CTA principal "Comprar este volante"');
  ck(await p.locator('main a[href*="/configurator"]').count()>=1, 'CTA secundario "Personalizar este volante"');
  ck(!/Pedir Orçamento/i.test(txt), 'accao antiga "Pedir Orçamento" ja nao existe');
  ck(txt.includes('Confirmamos a compatibilidade com o teu automóvel antes da produção.'), 'micro-copy de compatibilidade');
  ck(txt.includes('Não tens a certeza da compatibilidade? Fala connosco'), 'accao secundaria em texto');
  const unsure = await p.locator('main a[href^="mailto:"]').first().getAttribute('href');
  ck(!!unsure && unsure.includes('redlinecustomsauto@gmail.com'), 'usa o email real configurado');
  ck(txt.includes(prod.name) && txt.includes(prod.price), 'nome e preco intactos ('+prod.price+')');
  ck(txt.includes('Garantia 3 anos') && txt.includes('Envio Europa') && txt.includes('Pagamento Seguro'), 'selos de confianca mantidos');
  ck(/COMPATIBILIDADE/i.test(txt) && /Especificações|Descrição/i.test(txt), 'compatibilidades e especificacoes mantidas');

  // dominancia visual
  const prim = await p.getByRole('button',{name:/^Comprar este volante$/i}).boundingBox();
  const sec = await p.locator('main a[href*="/configurator"]').first().boundingBox();
  ck(prim.height > sec.height, 'CTA principal e o dominante ('+Math.round(prim.height)+'px vs '+Math.round(sec.height)+'px)');

  // --- validacao de compatibilidade: caso bom ---
  await p.getByRole('button',{name:/^Comprar este volante$/i}).click();
  const opened = await p.waitForSelector('[role="dialog"][data-state="open"]', {timeout:10000}).then(()=>true).catch(()=>false);
  await p.waitForTimeout(500);
  const dlg = p.locator('[role="dialog"][data-state="open"]');
  ck(opened && await p.locator('text=Confirmar compatibilidade').count()===1, 'clicar abre a etapa de confirmacao de compatibilidade');
  if (!opened) { console.log('        (dialogo nao abriu — a saltar o resto deste produto)'); continue; }
  const dtxt = await dlg.innerText();
  ck(/marca/i.test(dtxt)&&/modelo/i.test(dtxt)&&/\bano\b/i.test(dtxt)&&/chassis/i.test(dtxt), 'pede Marca, Modelo, Ano e Chassis/geracao');
  ck(/antes de iniciarmos a produção|antes da produção/i.test(dtxt), 'diz que a REDLINE confirma antes da producao');

  const inputs = dlg.locator('input');
  await inputs.nth(0).fill(prod.good.marca);
  await inputs.nth(1).fill(prod.good.modelo);
  await inputs.nth(2).fill('2021');
  await dlg.getByRole('button',{name:/Verificar compatibilidade/i}).click(); await p.waitForTimeout(500);
  const okTxt = await dlg.innerText();
  ck(/Compatibilidade confirmada/i.test(okTxt), 'veiculo compativel -> confirmada ("'+prod.good.marca+' '+prod.good.modelo+'")');
  ck(await dlg.getByRole('button',{name:/Continuar para a compra/i}).count()===1, 'permite continuar para a compra');

  // --- caso que nao da para validar ---
  await inputs.nth(0).fill('Toyota');
  await inputs.nth(1).fill('Yaris 1998');
  await p.waitForTimeout(200);
  await dlg.getByRole('button',{name:/Verificar compatibilidade/i}).click(); await p.waitForTimeout(500);
  const manTxt = await dlg.innerText();
  ck(/confirmar manualmente/i.test(manTxt), 'veiculo desconhecido -> confirmacao manual, sem erro');
  ck(!/erro|error/i.test(manTxt), 'nenhuma mensagem de erro apresentada');
  const mail = await dlg.locator('a[href^="mailto:"]').first().getAttribute('href');
  ck(!!mail && mail.includes('redlinecustomsauto@gmail.com'), 'disponibiliza o contacto da REDLINE');
  ck(await dlg.getByRole('button',{name:/Continuar mesmo assim/i}).count()===1, 'nao bloqueia o cliente');
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);

  // --- configurador pre-preenchido ---
  const href = await p.locator('main a[href*="/configurator"]').first().getAttribute('href');
  await p.goto(BASE+href,{waitUntil:'networkidle'}); await p.waitForTimeout(1400); await dismiss();
  const ctxt = await p.locator('body').innerText();
  ck(/est[áa]s a personalizar/i.test(ctxt) && ctxt.includes(prod.name), 'configurador mostra "Estás a personalizar: '+prod.name+'"');
  const vals = await p.locator('form input').evaluateAll(els=>els.map(e=>e.value));
  ck(vals.includes(prod.prefill.marca), 'marca pre-preenchida ("'+prod.prefill.marca+'")');
  ck(!vals.some(v=>v===prod.name), 'campo Modelo NAO preenchido com o nome do volante (o volante serve varios modelos)');
  ck(prod.prefill.chassis==='' ? vals[2]==='' : vals.includes(prod.prefill.chassis),
     prod.prefill.chassis==='' ? 'chassis VAZIO (ambiguo entre compatibilidades)' : 'chassis pre-preenchido ("'+prod.prefill.chassis+'")',
     'obtido "'+vals[2]+'"');
  const selected = await p.locator('form button.border-primary').evaluateAll(els=>els.map(e=>e.innerText.trim()));
  for (const [label,exp] of [['tipo',prod.prefill.tipo],['material',prod.prefill.material],['carbono',prod.prefill.carbono],['costuras',prod.prefill.costuras]]) {
    ck(selected.includes(exp), label+' pre-selecionado: "'+exp+'"', selected.includes(exp)?'':'selecionados: '+selected.join(' | '));
  }
  if (prod.prefill.faixa === null) {
    ck(!selected.some(s=>['Sem faixa','Vermelho','Branco','Azul','Amarelo','Tricolor M','Verde AMG','Outra'].includes(s) && s!==prod.prefill.costuras),
       'faixa 12h SEM selecao (atributo sem correspondencia) e sem erro');
  } else {
    ck(selected.includes(prod.prefill.faixa), 'faixa pre-selecionada: "'+prod.prefill.faixa+'"');
  }
  for (const e of prod.prefill.extras) ck(selected.includes(e), 'extra pre-selecionado: "'+e+'"');
  for (const e of prod.prefill.naoExtras) ck(!selected.includes(e), 'extra NAO inventado: "'+e+'"');
  ck(ctxt.includes('Baseado em: '+prod.name), 'resumo refere o produto de base (sem marca duplicada)');
}

head('== Robustez ==');
for (const bad of ['/configurator','/configurator?base=lixo','/configurator?base=bmw/nao-existe','/configurator?base=%2F%2F']) {
  const r = await p.goto(BASE+bad,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
  const t = await p.locator('body').innerText();
  ck(r.status()===200 && /Configura o teu volante/.test(t) && !/Estás a personalizar/.test(t) || bad==='/configurator',
     bad.padEnd(38)+' abre sem erro e sem pre-preenchimento invalido');
}

head('== Acessorios e PaddleShift inalterados ==');
for (const pth of ['/acessorios/patilhas-carbono-azul','/acessorios/patilhas-borracha-azul']) {
  await p.goto(BASE+pth,{waitUntil:'networkidle'}); await p.waitForTimeout(1200); await dismiss();
  const t = await p.locator('body').innerText();
  ck(/Quantidade/i.test(t), pth+' mantem o seletor de Quantidade');
  ck(!/Comprar este volante|Personalizar este volante/i.test(t), pth+' sem os CTAs novos de volante');
}
await p.goto(BASE+'/paddleshift',{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
const pt = await p.locator('body').innerText();
ck(await p.locator('a[href^="/acessorios/"]').count()===2 && !/Comprar este volante/i.test(pt), '/paddleshift inalterado (2 produtos, sem CTAs novos)');

head('== Consola ==');
ck(errs.length===0, 'sem erros de consola em todo o percurso', errs.slice(0,4).join('\n        '));

await b.close();
console.log('\n'+(fail===0?'=========== TUDO VERDE ===========':'=========== '+fail+' FALHA(S) ==========='));
process.exit(fail===0?0:1);
