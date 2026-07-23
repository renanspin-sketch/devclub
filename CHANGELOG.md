# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [0.7.0] — 2026-07-23

### Adicionado

- Seção `Skills` (`src/sections/Skills.tsx`): categorias (Linguagens, Frameworks & Bibliotecas, Ferramentas) exibidas como `Card` + `Badge`, sem depender de ícones de terceiros
- `src/data/skills.ts`: conteúdo fictício tipado, mesmo padrão de placeholder das seções anteriores
- Item "Skills" adicionado à navegação principal

### Corrigido

- `Header`: navegação mobile estava ausente — com 4 itens de menu, a lista colidia com a logo em telas pequenas (bug descoberto ao verificar a seção Skills em viewport de 375px). Adicionado menu mobile com toggle acessível (`aria-expanded`, `aria-controls`, fecha com Esc e ao clicar em um link), preservando a navegação horizontal a partir de `md`

## [0.6.0] — 2026-07-23

### Adicionado

- Seção `Projects` (`src/sections/Projects.tsx`): grid responsivo de `ProjectCard` (título, descrição, stack em `Badge`, links condicionais de código/demo)
- `src/data/projects.ts`: conteúdo fictício tipado, com um projeto propositalmente sem `demoUrl` para validar a renderização condicional dos links
- Estado vazio da seção (array de projetos vazio) verificado visualmente

### Decisões

- Estado de carregamento da seção de Projetos **não** foi implementado nesta fase: não há nenhuma busca assíncrona de dados no projeto hoje, e uma UI de skeleton sem um fetch real para acioná-la seria código morto e não verificável. Fica registrado como dependência futura de uma fonte de dados assíncrona (ver `ROADMAP.md`)

## [0.5.0] — 2026-07-23

### Adicionado

- Seção `About` (`src/sections/About.tsx`): narrativa de posicionamento, grid de estatísticas (`<dl>` semântico) e um snippet de código estilizado como destaque visual, evitando depender de uma foto real ainda não definida
- `src/data/about.ts`: conteúdo tipado e explicitamente marcado como fictício/placeholder, pronto para ser substituído pelo texto real

## [0.4.0] — 2026-07-23

### Adicionado

- Primitivo `Reveal` (`src/components/ui/Reveal.tsx`): scroll-reveal reutilizável baseado em Framer Motion, centraliza a checagem de `prefers-reduced-motion` para todas as seções de conteúdo
- Seção `Hero` (`src/sections/Hero.tsx`): headline com `accent-gradient`, badge de disponibilidade, CTAs primário/secundário e entrada escalonada via `Reveal`
- `App.tsx` agora compõe `Header` + `Hero` + `Footer` como primeira fatia real de produto

## [0.3.0] — 2026-07-23

### Adicionado

- Componentes primitivos do design system: `Button` (variants primary/secondary/ghost, tamanhos sm/md/lg, estado de loading sem layout shift), `IconButton`, `Badge`, `Card` (com variante interativa) e `Input` (label, estado de erro com `aria-describedby`, foco customizado)
- Componentes de layout: `Container`, `Section`, `Header` (nav orientada a dados via `NavItem[]`) e `Footer`
- Utilitário `cn()` (`clsx` + `tailwind-merge`) para composição segura de classes Tailwind em `src/lib`
- `class-variance-authority` adotado para variantes de componentes tipadas e autocompletáveis

### Documentação

- `ARCHITECTURE.md` atualizado com a justificativa do uso de `cva` e do utilitário `cn()`
- `ROADMAP.md`: Fase 02 marcada como concluída; Storybook avaliado e descartado (verificação feita via showcase temporário + Playwright)

## [0.2.0] — 2026-07-23

### Adicionado

- Scaffold do projeto: Vite + React 18 + TypeScript (modo strict), com alias `@/*` para `src/`
- Tailwind CSS configurado em `tailwind.config.ts`, espelhando 1:1 os tokens de `DESIGN-SYSTEM.md` (cores, tipografia, espaçamento, radius, sombras/glow, breakpoints)
- Framer Motion instalado como base para as animações das próximas fases
- Fontes Sora, Inter e JetBrains Mono via `@fontsource` (self-hosted, sem dependência de CDN externo)
- ESLint (flat config, `typescript-eslint` + regras de React Hooks) e Prettier (com `prettier-plugin-tailwindcss`)
- Estrutura de pastas completa conforme `ARCHITECTURE.md#organização-de-pastas`
- Estilos globais com reset mínimo, `color-scheme: dark`, anel de foco visível por padrão e respeito a `prefers-reduced-motion`
- `App.tsx` placeholder validando o sistema visual (fundo, gradiente de acento, tipografia) enquanto as seções de conteúdo não chegam

## [0.1.0] — 2026-07-23

### Adicionado

- `README.md` com visão geral do produto, stack, instruções de execução e scripts planejados
- `ARCHITECTURE.md` com justificativas técnicas de stack (Vite, React, TypeScript, Tailwind CSS, Framer Motion), organização de pastas, estratégias de componentes, hooks, context, performance, SEO e acessibilidade
- `DESIGN-SYSTEM.md` com paleta de cores (dark-first, acento violeta→ciano), tipografia (Sora/Inter/JetBrains Mono), espaçamento, border radius, sombras/glow, especificação de componentes reutilizáveis, tokens de motion e grid responsivo
- `ROADMAP.md` com as 12 fases planejadas de desenvolvimento, cada uma com checklist próprio
- `CHANGELOG.md` (este arquivo)
