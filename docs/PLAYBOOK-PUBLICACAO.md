# Playbook — Sistema Inteligente de Publicação de Produtos (REDLINE)

Este documento descreve o processo **obrigatório e repetível** para adicionar
produtos ao catálogo REDLINE de forma automática, inteligente e consistente.
A regra de ouro: **a imagem é a fonte de verdade**. Os atributos derivam da
análise das imagens; tudo o resto (categorias, filtros, páginas, SEO) é
calculado automaticamente a partir dos atributos.

## 1. Arquitetura (fonte única de verdade)

- **`src/lib/attributes.ts`** — taxonomia de atributos (formato, linha,
  materiais, costuras, features) + predicados reutilizáveis.
- **`src/lib/brands.ts`** — cada produto (`BrandModel`) tem um campo
  `attributes`. **É o único sítio onde se classifica um produto.**
- **`src/lib/collections.ts`** — o MOTOR. Deriva automaticamente a pertença de
  cada produto a todas as páginas de filtro. Não há listas manuais.
- **`src/lib/categoryPages.ts`** — as 7 páginas premium `/produtos/*`; a lista
  de produtos de cada uma é **calculada** (`getRelatedModels`), já não fixa.
- **`src/lib/describe.ts`** — gera descrição + specs no padrão do catálogo.

Consequência: definir os `attributes` de um produto **uma vez** faz com que ele
apareça automaticamente em TODAS as páginas compatíveis (marca, formato,
material, cor de costura, features) e em nenhuma incorreta.

## 2. Taxonomia de atributos

```ts
formato:  "flat-bottom" | "round"
linha:    "desportivo" | "original"
materiais: alcantara | pele-perfurada | pele-lisa | nappa |
           carbono | carbono-forjado | carbono-brilhante | carbono-mate | carbono-colorido
costuras:  vermelha | azul | branca | amarela | tricolor-m | personalizada
features:  led-shift | display-digital | patilhas | patilhas-carbono | aquecimento |
           botoes-multifuncoes | faixa-central | faixa-12h | insercoes | oem-plus
```

## 3. Fluxo obrigatório ao adicionar um produto

1. **Análise visual completa.** Observar TODAS as imagens ao detalhe. Combinar
   a informação de todas as fotos antes de decidir. Identificar: marca, modelo,
   formato, materiais, costuras (cor), LED, patilhas (e se são em carbono),
   faixa central / às 12h, botões, inserções, emblemas, compatibilidades.
2. **Preencher `attributes`** no produto em `brands.ts` — apenas o que está
   **comprovado** nas imagens. Nunca inventar.
3. **Cruzar** com o nome/descrição. Em caso de conflito, a imagem manda.
4. **Descrição.** Escrever `longDescription` à mão OU usar
   `buildAutoDescription(brand, model)` para uma base no padrão do catálogo.
   As specs podem vir de `buildAutoSpecs(model)`.
5. **Publicação automática.** Não é preciso escolher categorias — o motor trata
   disso. Confirmar visitando `/filtros`.
6. **Validação final** (ver secção 5). Só depois considerar concluído.

Antes de concluir, perguntar: *"Se este fosse o único produto que um cliente
visse, a apresentação, descrição e categorização refletiriam um nível premium?"*
Se não for um "sim" inequívoco, continuar a aperfeiçoar.

## 4. Regras de qualidade das fotos (para publicar)

- **Rejeitar:** telemóvel à vista, mãos na foto, volante já aplicado no carro.
- **Aceitável** (mesmo com fundo de oficina ou desmontado): desde que a
  qualidade e o enquadramento estejam ao nível do resto do site.
- Preferir as fotos editadas (fundo estúdio) quando existirem.

## 5. Validação (nunca publicar sem isto)

```bash
npx tsc --noEmit          # tipos
npx vite build            # build de produção (regenera routeTree)
# E2E real (conta produtos por página, deteta overflow e erros de runtime):
npx vite dev --port 4173 --host 127.0.0.1 &
BASE=http://127.0.0.1:4173 PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node scripts/e2e.mjs
```

`scripts/e2e.mjs` afirma o nº de produtos esperado por página. Ao adicionar
produtos, atualizar os números esperados nesse ficheiro.

## 6. Publicar no site

`git push` (com token fine-grained) **não** publica sozinho. Depois do push, o
dono abre o editor Lovable e carrega em **Publish**.

## 7. Notas importantes

- Os **modelos-base** (configuráveis, sem foto real) ficam **sem** `attributes`
  de propósito — não aparecem nas páginas de filtro, só nas páginas de marca.
- As imagens de produto novas devem ser processadas com PIL
  (`quality=85-90, optimize=True`), guardadas em `src/assets/` e importadas no
  produto. As imagens antigas em `.asset.json` vivem no CDN do Lovable e só
  resolvem no site publicado (404 em localhost — é normal).
