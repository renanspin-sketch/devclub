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

## Estratégia de Hooks

Hooks customizados encapsulam lógica reutilizável que não pertence a um componente específico (ex.: `useScrollProgress`, `useMediaQuery`, `useReducedMotionSafe`). Regra de extração: se a mesma lógica de estado/efeito aparece em dois componentes, ou se um componente mistura lógica de UI com lógica de comportamento, a lógica de comportamento migra para um hook.

## Estratégia de Context

Context é reservado para estado genuinamente global e de baixa frequência de mudança (ex.: tema claro/escuro). Estado local de seção permanece local — Context usado como substituto geral de prop drilling raso introduz re-renders desnecessários e acopla componentes a um provider que nem sempre precisam conhecer.

## Organização de assets

Imagens e ícones vetoriais ficam em `src/assets`, processados pelo pipeline do Vite (hashing de cache, otimização). Ícones de interface usam uma biblioteca de componentes SVG (tree-shakeable) em vez de sprites ou fontes de ícone, para permitir `aria-hidden` e cor via `currentColor` sem overhead adicional.

## Organização dos estilos

Tailwind é a camada primária de estilo, configurada a partir dos tokens do [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md). `src/styles/globals.css` concentra apenas o que não pode ser expresso via utilitários: reset, variáveis CSS de tema e diretivas do Tailwind. Estilo inline ou CSS-in-JS não são usados, para manter uma única fonte de verdade visual.

## Estratégias de performance

- **Lazy loading**: seções abaixo da dobra (`sections/*`) e imagens usam carregamento sob demanda (`React.lazy` + `Suspense` para código, `loading="lazy"` + dimensões explícitas para imagens, evitando layout shift).
- **Code splitting**: divisão por seção de página, não apenas por rota — cada seção pesada (ex.: uma galeria de projetos com muitas imagens) é seu próprio chunk.
- **Memoização**: aplicada de forma seletiva — `useMemo`/`useCallback`/`memo` apenas onde um profiling real (React DevTools Profiler) mostra re-render custoso, não como prática padrão em todo componente.
- **Otimizações de render**: listas usam `key` estável, animações usam apenas propriedades compostas na GPU (`transform`, `opacity`) para manter 60fps sem forçar reflow.
- **Otimização de assets**: imagens em formatos modernos (WebP/AVIF) com fallback, fontes com `font-display: swap` e subsetting quando aplicável.
- **Bundle size**: dependências avaliadas por custo antes da adoção; análise de bundle via `rollup-plugin-visualizer` antes de cada release relevante.

## Estratégias de SEO

Meta tags semânticas (`title`, `description`, Open Graph) por seção relevante, HTML semântico como base (ver seção de acessibilidade, que aqui também serve SEO), e uso de landmarks (`<main>`, `<nav>`, `<section aria-label>`) para que buscadores e leitores de tela interpretem a hierarquia de conteúdo da mesma forma.

## Estratégias de acessibilidade

Ver detalhamento de tokens e estados em [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md). Como princípio arquitetural: acessibilidade é validada por componente no momento em que ele é criado (contraste, foco visível, navegação por teclado, `aria-label` quando o texto visível não é suficiente) — nunca como auditoria isolada ao final do projeto.

## Escalabilidade futura

A separação `components/ui` vs `sections` permite extrair o design system para um pacote independente sem reescrita, caso o projeto evolua para múltiplas superfícies (ex.: um blog técnico complementar). `data/` tipado como camada de conteúdo prepara o terreno para, no futuro, ser substituído por um CMS headless sem alterar a camada de apresentação.
