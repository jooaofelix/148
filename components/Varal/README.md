# Varal 148

Seção da home em que as peças ficam penduradas num varal, como uma instalação
física. Componente independente: só é usado em `app/page.tsx`
(`<Varal products={products} />`) e não depende de nenhuma outra seção.

## Como funciona

| Aparelho | Experiência |
| --- | --- |
| Desktop com mouse (≥ 1024 px) | A seção prende na tela e a rolagem vertical anda pelo varal na horizontal. A câmera para um instante em cada peça. |
| Celular / tablet / toque | Varal com arrasto lateral e encaixe em cada peça (scroll-snap). A página não fica presa. |
| "Reduzir movimento" ligado | Mesmo varal com arrasto, sem balanço e sem animação de entrada. |

- **Balanço**: cada cabide é um pêndulo (mola + amortecimento) com brisa sutil, reage à velocidade da câmera e ao mouse. O tecido atrasa um pouco em relação ao cabide. Roda num único `requestAnimationFrame`, só enquanto a seção está na tela, e mexe apenas em `transform`.
- **Hover**: a peça ganha destaque e balança; as outras apagam.
- **Clique**: a peça vai para o centro e cresce. Um segundo clique abre a página do produto. A ficha embaixo mostra código, status, nome, referência, frase e preço (só quando `status: "disponivel"` e `priceCents` existir).
- **Teclado**: setas ← → navegam entre as peças; cada peça é um botão.

Sem bibliotecas novas: CSS Module + React. GSAP/Three.js não foram necessários.

## Fotos

O varal usa as fotos **recortadas, sem fundo** de `public/images/products/cutout/`, com o mesmo nome do arquivo de `data/products.ts`:

- costas (`<slug>-back.webp`) quando a peça tem, senão a frente (`<slug>-front.webp`);
- regra em `hangingImage()` (`garment.ts`).

Para trocar ou adicionar uma peça: coloque o PNG/WebP com fundo transparente em
`public/images/products/cutout/` com o nome certo. O encaixe no cabide é medido
sozinho no navegador (`measureGarment`), então fotos com enquadramentos
diferentes funcionam sem mudar código. Para melhor resultado: a camiseta de
frente/costas, reta, sem cabide, gola para cima, ~700–1200 px de largura.

Se uma foto recortada ainda não existir, o espaço fica com o enquadramento padrão
até o arquivo chegar; nenhum produto é inventado.

## Ajustes rápidos (`Varal.tsx`)

| Constante | O que muda |
| --- | --- |
| `STIFFNESS`, `DAMPING` | ritmo e duração do balanço |
| `SCROLL_PUSH` | quanto a rolagem empurra as peças |
| `HOVER_KICK` | força do balanço ao passar o mouse |
| `DWELL` | quanto tempo a câmera para em cada peça (0 = sem parada) |
| `GAP`, `SHOULDER` | espaço entre peças e largura do cabide |
| `CLOTH_CAP` | altura máxima da peça antes de encolher |

Textos do título: props `eyebrow` e `title`.
