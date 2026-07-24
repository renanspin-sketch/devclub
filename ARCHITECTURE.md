# Arquitetura — DevClub

Este documento registra as decisões estruturais do projeto e a justificativa técnica por trás de cada uma. O critério de escrita é simples: qualquer escolha aqui precisa se sustentar em uma entrevista técnica.

## Stack

### Por que React

Padrão de mercado para a vaga-alvo, ecossistema maduro de bibliotecas (animação, formulários, testes) e um modelo mental — componentes + estado unidirecional — que escala bem da landing page de uma seção até um produto com dezenas de telas. A alternativa (Vanilla JS / Web Components) exigiria reconstruir manualmente reatividade e composição que o React já resolve.

### Por que TypeScript

Contratos explícitos entre componentes (props, retornos de hooks, payloads) eliminam uma classe inteira de bugs em tempo de compilação, antes de chegar ao navegador. Em um projeto avaliado por outros desenvolvedores, tipagem também funciona como documentação viva: a assinatura de uma função comunica sua intenção sem precisar de comentários.

### Por que Vite

HMR baseado em ESM nativo mantém o ciclo de feedback abaixo de 100ms mesmo com o projeto crescendo, ao contrário de bundlers baseados em bundling completo a cada mudança. Para produção, Vite delega ao Rollup, que produz bundles menores via tree-shaking mais agressivo que alternativas como Webpack em configuração padrão.

### Por que Tailwind CSS

Tokens de design (cor, espaçamento, tipografia) vivem em um único arquivo de configuração (`tailwind.config.ts`), que é a fonte única de verdade consumida tanto pelo código quanto pelo [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md). O modo JIT gera apenas o CSS efetivamente utilizado, eliminando CSS morto sem esforço manual de purge. A alternativa (CSS Modules ou styled-components) introduziria uma camada extra de indireção sem ganho proporcional para um projeto deste porte.

### Por que Framer Motion

API declarativa (`animate`, `variants`, `whileInView`) que expressa animação como função do estado, no mesmo paradigma do React — em vez de manipulação imperativa de DOM. Suporte nativo a `prefers-reduced-motion` via `useReducedMotion` permite que cada componente de motion respeite a preferência de acessibilidade do usuário sem lógica duplicada.

## Organização de pastas

```
src/
  components/       # componentes de UI reutilizáveis, sem conhecimento de domínio
    ui/              # primitivos do design system (Button, Card, Badge...)
    layout/          # estrutura de página (Header, Footer, Section...)
  sections/         # composições de página com conhecimento de domínio (Hero, Projects, Contact...)
  hooks/            # hooks customizados reutilizáveis entre seções
  context/          # providers de estado compartilhado (ex.: tema)
  lib/              # funções puras, utilitários, formatadores
  data/             # conteúdo estruturado e tipado (projetos, skills, links)
  types/            # tipos e interfaces compartilhados entre camadas
  assets/           # imagens, ícones e fontes processados pelo bundler
  styles/           # estilos globais e configuração base do Tailwind
```

A separação entre `components/` (sem conhecimento de domínio) e `sections/` (com conhecimento de domínio) existe para que os primitivos do design system permaneçam reutilizáveis fora do contexto deste portfólio — um `Button` não deveria saber o que é um "projeto".

## Estratégia de componentes

Cada componente possui responsabilidade única e é dimensionado para caber em uma tela sem rolagem excessiva. Quando um componente cresce além disso, é sinal de que uma subcomposição está implícita e deve ser extraída. Props são tipadas explicitamente (sem `any`), e componentes visuais puros são mantidos livres de lógica de busca de dados ou efeitos colaterais — essa lógica vive em hooks.

Componentes primitivos com múltiplas variantes visuais (`Button`, `Badge`, `IconButton`) usam [`class-variance-authority`](https://cva.style) para declarar variantes como dados tipados em vez de cadeias de `if`/ternários em `className`. Isso torna as combinações de `variant`/`size` exaustivas e autocompletáveis pelo TypeScript. Quando um componente exporta tanto variantes (`buttonVariants`) quanto o componente em si, as variantes são movidas para um módulo próprio (ex.: `button-variants.ts`) — Fast Refresh do Vite exige que um arquivo que exporta um componente React exporte *apenas* componentes. Conflitos entre classes Tailwind vindas de variantes e de um `className` externo são resolvidos por um utilitário `cn()` (`clsx` + `tailwind-merge`) em `src/lib/cn.ts`, usado em todo componente que aceita `className`.

## Estratégia de Hooks

Hooks customizados encapsulam lógica reutilizável que não pertence a um componente específico (ex.: `useScrollProgress`, `useMediaQuery`, `useReducedMotionSafe`). Regra de extração: se a mesma lógica de estado/efeito aparece em dois componentes, ou se um componente mistura lógica de UI com lógica de comportamento, a lógica de comportamento migra para um hook.

## Estratégia de Context

Context é reservado para estado genuinamente global e de baixa frequência de mudança (ex.: tema claro/escuro). Estado local de seção permanece local — Context usado como substituto geral de prop drilling raso introduz re-renders desnecessários e acopla componentes a um provider que nem sempre precisam conhecer.

## Organização de assets

Imagens e ícones vetoriais ficam em `src/assets`, processados pelo pipeline do Vite (hashing de cache, otimização). Ícones de interface usam uma biblioteca de componentes SVG (tree-shakeable) em vez de sprites ou fontes de ícone, para permitir `aria-hidden` e cor via `currentColor` sem overhead adicional.

## Organização dos estilos

Tailwind é a camada primária de estilo, configurada a partir dos tokens do [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md). `src/styles/globals.css` concentra apenas o que não pode ser expresso via utilitários: reset, variáveis CSS de tema e diretivas do Tailwind. Estilo inline ou CSS-in-JS não são usados, para manter uma única fonte de verdade visual.

## Estratégias de performance

- **Lazy loading**: seções abaixo da dobra (`About`, `Projects`, `Skills`, `Contact`) usam `React.lazy` + `Suspense`; `Hero` fica fora do split por ser conteúdo do LCP — atrasá-lo pioraria a primeira renderização em vez de ajudar. Imagens (quando existirem) devem usar `loading="lazy"` + dimensões explícitas para não causar layout shift.
- **Code splitting**: por seção de página, não apenas por rota (site é uma página só). Cada seção lazy vira seu próprio chunk (ver `npm run build:analyze`).
- **Bundle de animação**: Framer Motion importado via `LazyMotion` + `m.*` (não `motion.*`) com o feature set `domAnimation`, que exclui drag e layout projection — código que o projeto não usa e que, medido via `rollup-plugin-visualizer`, respondia pela maior fatia do bundle. `strict` no `LazyMotion` barra o uso acidental de `motion.*` no futuro.
- **Memoização**: aplicada de forma seletiva — `useMemo`/`useCallback`/`memo` apenas onde um profiling real (React DevTools Profiler) mostra re-render custoso, não como prática padrão em todo componente.
- **Otimizações de render**: listas usam `key` estável (nunca `href`/valores que podem se repetir em conteúdo placeholder — ver Fase 07 no CHANGELOG), animações usam apenas propriedades compostas na GPU (`transform`, `opacity`) para manter 60fps sem forçar reflow.
- **Otimização de fontes**: cada família importa só o subconjunto Unicode `latin` (cobre todo o português, incluindo acentuação — os caracteres do PT-BR estão em Latin-1 Supplement, dentro do subconjunto `latin`). Os arquivos por subconjunto do `@fontsource` não têm `unicode-range`, então cada import baixa incondicionalmente: importar subconjuntos a mais (ex.: `latin-ext`, que não é usado por nenhum idioma deste site) baixa fontes desnecessárias e piora o LCP — isso foi medido, não é só teoria (ver CHANGELOG v0.11.0).
- **Otimização de imagens**: ainda não há imagens raster no site (seção Projetos é só texto/badge por enquanto). Quando entrarem fotos reais de projeto, aplicar formatos modernos (WebP/AVIF) com fallback, `loading="lazy"` e dimensões explícitas — combinação já usada em `<img>` nenhum momento testada porque não existe `<img>` no projeto ainda.
- **Bundle size**: dependências avaliadas por custo antes da adoção; análise de bundle via `npm run build:analyze` (`rollup-plugin-visualizer`, gera `dist/stats.html`) antes de cada release relevante.
- **Lighthouse**: `npm run lighthouse` builda a produção, sobe via `vite preview` (nunca o dev server — não reflete performance real) e roda auditorias mobile + desktop com os presets corretos de throttling do próprio Lighthouse, salvando relatórios em `lighthouse-reports/` (gitignored).

## Estratégias de SEO

Meta tags semânticas (`title`, `description`, Open Graph) por seção relevante, HTML semântico como base (ver seção de acessibilidade, que aqui também serve SEO), e uso de landmarks (`<main>`, `<nav>`, `<section aria-label>`) para que buscadores e leitores de tela interpretem a hierarquia de conteúdo da mesma forma.

## Estratégias de acessibilidade

Ver detalhamento de tokens e estados em [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md). Como princípio arquitetural: acessibilidade é validada por componente no momento em que ele é criado (contraste, foco visível, navegação por teclado, `aria-label` quando o texto visível não é suficiente) — nunca como auditoria isolada ao final do projeto.

Isso não elimina a necessidade de uma auditoria de conjunto: a Fase 09 rodou uma passada dedicada com [axe-core](https://github.com/dequelabs/axe-core) sobre a página inteira, mapeamento de tab order e revisão de landmarks — e mesmo com a disciplina por componente, encontrou problemas reais (dois tokens de cor fora do contraste mínimo, foco não devolvido ao fechar o menu mobile). A lição prática: contraste calculado manualmente deve ser tratado como estimativa até ser confirmado por ferramenta; `DESIGN-SYSTEM.md` documenta os valores já corrigidos e medidos. `SkipLink` (`src/components/layout/SkipLink.tsx`) é o primeiro elemento focável da página, permitindo pular a navegação do `Header` e ir direto ao `<main>`.

## Estratégias de testes

**Vitest** + **React Testing Library**, não Jest: o projeto já roda em Vite, e Vitest reaproveita a mesma configuração (alias `@/*`, transform do React) sem uma segunda cadeia de build para manter sincronizada. Testing Library é usado por filosofia, não só por popularidade — consultar por `getByRole`/`getByLabelText` força os testes a exercitar o componente do jeito que um usuário (ou leitor de tela) o acessaria, então um teste que passa já é, em algum grau, evidência de acessibilidade.

Escopo escolhido para esta fase, e por quê:

- **Componentes do design system** (`Button`, `Badge`, `Card`, `Input`, `IconButton`) têm 100% de cobertura de statements — são a base reutilizada por tudo, então um bug aqui se propaga para o site inteiro.
- **`useCopyToClipboard`**: único hook customizado do projeto, com lógica assíncrona e efeito colateral (timer) — exatamente o tipo de código que "parece óbvio" mas quebra silenciosamente.
- **Seções tratadas como críticas**: `Header` (estado de menu mobile, foco, Esc), `Contact` (Clipboard API, feedback assíncrono) e `Projects` (renderização condicional a partir de dados, estado vazio). São as únicas seções com lógica de verdade — ramos condicionais, estado, efeitos.
- **Deliberadamente não testadas isoladamente**: `Hero`, `About`, `Skills`, `Footer` e `App` são composição de conteúdo estático — sem branches, sem estado próprio. Testá-las forçaria a reescrever, em formato de teste, o mesmo conteúdo já declarado no componente (teste que só quebra quando o texto muda, não quando a lógica quebra). Cobertas indiretamente pelos testes dos componentes de UI que elas reutilizam.

Cobertura mínima é um piso medido, não uma meta escolhida a priori: rodei a suíte, extraí os números reais (70% statements / 89% branches / 63% functions / 74% lines em 2026-07-23) e configurei os thresholds do Vitest (`vite.config.ts`) alguns pontos abaixo disso — o suficiente pra pegar uma regressão real (alguém apaga um teste, ou adiciona um branch não coberto), sem exigir 100% artificial em código que não justifica o esforço.

## Escalabilidade futura

A separação `components/ui` vs `sections` permite extrair o design system para um pacote independente sem reescrita, caso o projeto evolua para múltiplas superfícies (ex.: um blog técnico complementar). `data/` tipado como camada de conteúdo prepara o terreno para, no futuro, ser substituído por um CMS headless sem alterar a camada de apresentação.
