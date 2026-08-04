# Design System — DevClub

Fonte única de verdade para toda decisão visual do projeto. Cada token aqui documentado corresponde a um valor em `tailwind.config.ts` — este documento e o código nunca devem divergir.

Direção visual: **dark-first premium**. Fundo quase-preto com leve matiz azulado, tipografia geométrica para headings, um par de cores de destaque (violeta → ciano) reservado para pontos de decisão do usuário (CTAs, estados ativos, foco), e uso de glow/gradiente com moderação — como pontuação, não como papel de parede. Escuro continua sendo o padrão e a identidade da marca — o tema claro (ver abaixo) é uma opção que o usuário liga, não o ponto de partida.

## Tema claro/escuro

Site tem os dois temas, trocados por um botão no cabeçalho (`ThemeToggle` em `Header.tsx`, estado em `src/context/ThemeContext.tsx`). Padrão é sempre escuro — não segue a preferência do sistema operacional, pra não esconder a identidade visual da marca de quem usa SO em modo claro. Escolha persiste em `localStorage`; `index.html` aplica o tema salvo antes do primeiro paint (evita flash).

Mecanismo: `bg-canvas`, `bg-surface`/`surface-elevated`, `border`/`border-strong`, `text-primary`/`secondary`/`muted` e os dois acentos usados como cor de texto (`accent-green`, `accent-cyan`) são variáveis CSS (`--color-*` em `globals.css`), trocadas via atributo `data-theme` em `<html>`. `accent-violet`/`violet-light`/`accent-gradient` ficam fixos — só aparecem como fundo (botão/glow), nunca como cor de texto sólida, então não precisam de par mais escuro.

Duas exceções ficam **sempre escuras**, independente do tema do site: o capítulo Boot (texto lido sobre a própria sequência de imagens, não sobre o `canvas`) e a caixa de vídeo do Build (badges lidos sobre o vídeo de fundo). Ambas usam `data-theme="dark"` no próprio elemento — a cascata de variáveis CSS reaplica os valores escuros ali, não importa o tema herdado do resto da página.

### Base (superfícies) — tema escuro (padrão)

| Token | Valor | Uso |
|---|---|---|
| `bg-canvas` | `#0A0A0F` | Fundo da página |
| `bg-surface` | `#13131A` | Cards, seções elevadas |
| `bg-surface-elevated` | `#1C1C26` | Modais, popovers, hover de card |
| `border-default` | `#27272F` | Bordas de baixo contraste |
| `border-strong` | `#3A3A46` | Bordas de inputs em foco, divisores de ênfase |

### Base (superfícies) — tema claro

| Token | Valor | Uso |
|---|---|---|
| `bg-canvas` | `#FAFAFC` | Fundo da página |
| `bg-surface` | `#FFFFFF` | Cards, seções elevadas |
| `bg-surface-elevated` | `#F1F1F5` | Modais, popovers, hover de card |
| `border-default` | `#E2E2E8` | Bordas de baixo contraste |
| `border-strong` | `#C9C9D6` | Bordas de inputs em foco, divisores de ênfase |

### Texto

| Token | Escuro | Claro | Uso |
|---|---|---|---|
| `text-primary` | `#F5F5F7` (17.9:1) | `#16161D` (~18.5:1) | Headings, corpo principal |
| `text-secondary` | `#A1A1AA` (8.4:1) | `#52525E` (~8:1) | Corpo secundário, descrições |
| `text-muted` | `#7E8794` (5.4:1) | `#646975` (~5.7:1) | Metadados, timestamps, legendas |

Contraste calculado sobre o respectivo `bg-canvas` do tema. Todos os pares atendem WCAG AA (mínimo 4.5:1 para texto normal, 3:1 para texto grande). Validado na Fase 09 com auditoria automatizada (axe-core) — o valor original de `text-muted` (`#6B7280`) media apenas 4.08:1 sobre `bg-canvas`, abaixo do mínimo; o cálculo manual deste documento estava incorreto. Corrigido para `#7E8794`, medido e reconfirmado por ferramenta.

### Acento

| Token | Valor | Uso |
|---|---|---|
| `accent-violet` | `#7C5CFC` (fixo nos dois temas) | Cor primária de ação — CTAs, links, foco |
| `accent-violet-light` | `#A78BFA` (fixo nos dois temas) | Texto sobre fundo `accent-violet/15` (ex.: `Badge` variante `accent`) — `accent-violet` sozinho mede 3.96:1 nesse fundo, abaixo do mínimo AA; esta variante mais clara mede 6.4:1 |
| `accent-cyan` | Escuro `#22D3EE` (contraste alto por natureza) · Claro `#0E7490` (~5.4:1) | Destaques secundários, links, `<code>` |
| `accent-green` | Escuro `#4ADE80` · Claro `#158030` (~5:1) | Verde terminal — cor de todos os títulos do site (`h1`/`h2`/`h3`), origem no texto do capítulo Boot (distinto de `state-success`, que é semântico de status, não decorativo) |
| `accent-gradient` | `linear-gradient(135deg, #7C5CFC 0%, #22D3EE 100%)` (fixo) | CTAs de destaque, bordas de glow — nunca usado como cor de texto sólida |
| `--gradient-text-accent` (variável CSS, não token Tailwind) | Escuro igual a `accent-gradient` · Claro `linear-gradient(135deg, #5B3FD9, #0E7490)` | Único uso de violeta/ciano como texto (`bg-clip-text` da manchete de fechamento do Hire) — a ponta ciano do gradiente escuro mede ~1.8:1 sobre um fundo claro (o axe-core não avalia contraste de `background-clip`, então essa combinação não aparece como violação sozinha; conferido à mão) |

### Semânticas

| Token | Valor | Uso |
|---|---|---|
| `state-success` | `#34D399` | Confirmações, disponibilidade |
| `state-warning` | `#FBBF24` | Avisos não bloqueantes |
| `state-danger` | `#F87171` | Erros de validação |

## Tipografia

| Papel | Fonte | Justificativa |
|---|---|---|
| Display / Headings | **Sora** | Geométrica, moderna, boa presença em títulos grandes sem perder legibilidade |
| Corpo | **Inter** | Alta legibilidade em texto corrido, otimizada para tela |
| Código / dados técnicos | **JetBrains Mono** | Diferenciação clara para trechos de código ou labels técnicos |

### Escala tipográfica

Escala fluida via `clamp()`, com base 16px e razão ~1.25 (major third), para headings responderem ao viewport sem breakpoints manuais.

| Token | Tamanho | Uso |
|---|---|---|
| `text-xs` | 12px / 0.75rem | Legendas, badges |
| `text-sm` | 14px / 0.875rem | Texto secundário, metadados |
| `text-base` | 16px / 1rem | Corpo padrão |
| `text-lg` | 18px / 1.125rem | Corpo em destaque |
| `text-xl` | 20px / 1.25rem | Subtítulos de card |
| `text-2xl` | clamp(1.5rem, 1.3rem + 1vw, 1.875rem) | Títulos de seção |
| `text-3xl` | clamp(1.875rem, 1.5rem + 1.8vw, 2.5rem) | Títulos principais de seção |
| `text-4xl` | clamp(2.25rem, 1.7rem + 2.7vw, 3.5rem) | Headline do hero |
| `text-5xl` | clamp(2.75rem, 1.9rem + 4vw, 4.5rem) | Headline hero em telas largas |

Peso: `font-normal` (400) para corpo, `font-medium` (500) para ênfase leve, `font-semibold` (600) para subtítulos, `font-bold` (700) exclusivo para headings principais — evitar mais de dois pesos por composição.

## Espaçamento

Grid base de **4px**, seguindo a escala padrão do Tailwind (`space-1` = 4px até `space-32` = 128px), sem valores customizados fora da escala. Isso garante que qualquer par de elementos no layout esteja alinhado ao mesmo ritmo vertical.

| Token | Valor | Uso típico |
|---|---|---|
| `space-1` | 4px | Gap entre ícone e label |
| `space-2` | 8px | Padding interno de badges |
| `space-4` | 16px | Padding interno de botões, gap entre itens de lista |
| `space-6` | 24px | Padding interno de cards |
| `space-8` | 32px | Gap entre cards em grid |
| `space-16` | 64px | Espaço entre blocos dentro de uma seção |
| `space-24` | 96px | Padding vertical de seção (mobile) |
| `space-32` | 128px | Padding vertical de seção (desktop) |

## Border radius

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 6px | Badges, tags |
| `radius-md` | 10px | Botões, inputs |
| `radius-lg` | 16px | Cards |
| `radius-xl` | 24px | Painéis grandes, modais |
| `radius-full` | 9999px | Avatares, pills, indicadores |

## Sombras e glow

| Token | Valor | Uso |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.4)` | Elevação mínima (botões) |
| `shadow-md` | `0 4px 12px rgb(0 0 0 / 0.35)` | Cards em repouso |
| `shadow-lg` | `0 12px 32px rgb(0 0 0 / 0.4)` | Cards em hover, popovers |
| `glow-violet` | `0 0 24px rgb(124 92 252 / 0.35)` | Foco, hover de CTA primário |
| `glow-cyan` | `0 0 24px rgb(34 211 238 / 0.25)` | Estados de destaque secundário |

Glow é reservado para estados interativos (hover/focus) — nunca aplicado em repouso, para não competir com o conteúdo.

## Componentes reutilizáveis

### Botão

| Estado | Tratamento |
|---|---|
| Default (primário) | `accent-gradient` de fundo, texto `text-primary`, `radius-md` |
| Hover | + `glow-violet`, leve `scale(1.02)`, 150ms ease-out |
| Active | `scale(0.98)`, sem glow |
| Focus (teclado) | anel de foco 2px `accent-cyan` com offset 2px — sempre visível, nunca `outline: none` sem substituto |
| Disabled | opacidade 40%, `cursor-not-allowed`, sem hover |
| Loading | spinner substitui label, botão mantém largura (evita layout shift) |

Variantes: `primary` (gradiente), `secondary` (borda `border-strong`, fundo transparente), `ghost` (sem borda, hover com `bg-surface`).
Tamanhos: `sm` (32px altura), `md` (40px altura), `lg` (48px altura).

### Input

Default: fundo `bg-surface`, borda `border-default`. Focus: borda `accent-violet` + `glow-violet` sutil. Erro: borda `state-danger` + mensagem abaixo com `text-sm text-state-danger` e `aria-describedby` associado. Disabled: opacidade 50%.

### Card

`bg-surface`, `radius-lg`, `shadow-md` em repouso. Hover (quando clicável): `shadow-lg`, `translateY(-4px)`, borda transiciona para `border-strong` — sinaliza affordance sem depender apenas de cursor.

### Badge / Tag

`radius-sm`, `text-xs font-medium`, padding `space-1 space-2`, fundo `bg-surface-elevated` com texto `text-secondary`; variante de destaque usa `accent-violet` em 15% de opacidade de fundo com texto `accent-violet` sólido.

### Ícones

Biblioteca baseada em SVG (stroke, não fill), `stroke-width: 1.5–2px` consistente. Tamanhos: 16px (inline com texto pequeno), 20px (padrão em botões), 24px (destaque), 32px (feature icons). Ícones puramente decorativos recebem `aria-hidden="true"`; ícones com significado próprio recebem `aria-label`.

## Animação e microinterações

| Token | Valor | Uso |
|---|---|---|
| `duration-fast` | 150ms | Hover, foco, toggles |
| `duration-base` | 250ms | Transições de card, entrada de elementos pequenos |
| `duration-slow` | 400ms | Scroll reveal de seções |
| `duration-slower` | 600ms | Transições de página/hero |
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Padrão para a maioria das transições |
| `ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Elementos entrando na tela (scroll reveal) |

Princípios:
- **Scroll reveal**: fade + translateY(16px)→0, disparado uma única vez via `whileInView`, nunca repetido ao rolar para cima e para baixo repetidamente (evita ruído visual).
- **Hover**: apenas `transform` e `opacity` (propriedades compostas na GPU) — nunca animar `width`/`height`/`top`/`left` diretamente.
- **Parallax**: uso pontual no hero, com deslocamento máximo de 40px, desabilitado quando `prefers-reduced-motion: reduce`.
- Todo componente de motion consulta `useReducedMotion` do Framer Motion e substitui a transição por um fade instantâneo quando o usuário prefere movimento reduzido.

## Grid

| Breakpoint | Largura mínima | Container max-width |
|---|---|---|
| `sm` | 640px | 100% |
| `md` | 768px | 720px |
| `lg` | 1024px | 960px |
| `xl` | 1280px | 1140px |
| `2xl` | 1536px | 1320px |

Grid de 12 colunas com gutter de `space-6` (24px) em mobile e `space-8` (32px) a partir de `md`. Mobile-first: todo componente é definido para a menor largura primeiro, com overrides progressivos.

## Tokens visuais — resumo de implementação

Todos os tokens acima serão espelhados em `tailwind.config.ts` na Fase 01 (Estrutura Inicial) como `theme.extend`, nunca como valores mágicos inline no JSX — qualquer cor, espaçamento ou raio usado em um componente deve referenciar um token deste documento.
