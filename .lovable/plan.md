# Corrigir o bug intermitente da secção "Marcas" (homepage)

## O problema

A secção "Marcas" (a que termina em "Explorar todas as marcas compatíveis") fica fixa no ecrã enquanto se faz scroll, e essa fixação é calculada uma única vez, no momento em que a homepage monta. Tudo o que carrega depois — o vídeo do hero, as fotografias das secções "Produtos em Destaque", "Personalizações" e "Transformação", as fontes, e o overlay de entrada REDLINE — muda a altura da página *depois* desse cálculo.

Quando isso acontece, as coordenadas guardadas deixam de corresponder à posição real da secção: o espaço de scroll reservado continua lá (é a "faixa preta gigante") mas a caixa com a marca nunca aparece nela, e a animação/avanço automático nunca arranca. Como depende de que imagem acaba de carregar primeiro em cada visita, às vezes acerta e às vezes não — é exatamente o comportamento descrito.

Há ainda um segundo caso, mais raro mas com o mesmo sintoma de "sem automação": recarregar a página já a meio da secção. Nessa situação o arranque do avanço automático (que só é despoletado ao *entrar* na secção vindo de fora) nunca dispara, e a secção fica parada e sem o escurecimento de fundo.

## O que vai ser feito

Alteração confinada ao componente da secção Marcas (`src/components/BrandShowcase.tsx`). Sem mudanças de design, texto, imagens, ordem de secções ou de qualquer outra parte do site.

1. **Recalcular as medidas sempre que o layout muda**, em vez de só uma vez ao montar:
   - depois de todas as imagens/vídeo da página terminarem de carregar (evento `load` da janela e `decode()` das imagens da própria secção);
   - depois de as fontes estarem prontas;
   - depois de o overlay de entrada REDLINE sair;
   - sempre que a altura total do documento mudar (observador de redimensionamento no `body`), com um pequeno atraso agrupado para não recalcular em excesso.

2. **Arrancar a animação a partir do estado real, não só da entrada.** O estado "está fixa" passa a derivar do próprio estado da secção (incluindo logo após um recálculo ou um recarregamento a meio), de modo que o escurecimento de fundo e o avanço automático fiquem sempre coerentes com o que está no ecrã.

3. **Garantir que não fica lixo de um cálculo anterior.** Ao remontar (navegação interna de volta à homepage, recarga em desenvolvimento), a instância antiga é eliminada por identificador próprio antes de criar a nova, evitando dois cálculos sobrepostos — outra fonte possível de espaço vazio.

4. **Validação** com o teste automático já existente `scripts/e2e-marcas-pin.mjs` (cinco larguras, verifica precisamente "nenhum viewport vazio entre Marcas e Galeria"), acrescentando dois cenários que hoje não cobre: carregar a homepage com a rede lenta (imagens a chegar tarde) e recarregar já a meio da secção.

## Nota técnica

Implementação em GSAP ScrollTrigger: chamadas a `ScrollTrigger.refresh()` nos gatilhos acima (o trigger já tem `invalidateOnRefresh: true`, pelo que `start`/`end` são reavaliados), substituição da bandeira `isPinnedRef` alimentada só por `onEnter`/`onEnterBack` por sincronização via `onToggle`/`onRefresh` com `self.isActive`, e `id` + `ScrollTrigger.getById(...)?.kill()` na criação. A matemática de `pinSpanSegments`, `BOUNDARY`, autoplay e abas mantém-se intacta.
