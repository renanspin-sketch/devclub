# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [0.14.0] — 2026-07-24

### Alterado — reposicionamento do DevClub

Início do reposicionamento do DevClub de portfólio pessoal para marca/comunidade de formação em tecnologia (decisão do usuário — ver contexto no histórico do projeto). Primeira fatia: `Header` e `Hero`.

- `Header`: adiciona link "Área do aluno" e CTA "Quero fazer parte", agrupados à direita do nav com um separador visual — replica a estrutura de referência (site de terceiro usado só como referência de layout, não de conteúdo) sem copiar conteúdo, pessoas ou logos reais
- `Hero`: manchete reescrita em torno do storytelling "Do primeiro `console.log` à primeira contratação"; texto de apoio e CTAs ("Quero fazer parte" / "Ver projetos") refletindo comunidade/formação em vez de portfólio individual

### Decisões

- O usuário forneceu capturas de tela de um site real (aparentemente Asimov Academy) como referência para o restante do reposicionamento. Usar apenas a **estrutura/layout** das seções — não o conteúdo: as capturas incluem fotos e nomes de pessoas reais (instrutores/alunos), logos de empresas reais como prova social (Facebook, iFood, OAB, UFRJ) e alegações verificáveis específicas de outro negócio (reconhecimento do MEC, +30 mil alunos, garantia de reembolso de 7 dias). Nenhuma dessas alegações será replicada — cada seção nova recebe conteúdo próprio do DevClub, e três blocos da referência (certificação MEC, contadores de alunos, garantia de reembolso) ficam de fora por representarem afirmações factuais que não são verdadeiras para este projeto

## [0.13.0] — 2026-07-23

### Adicionado

- Duas imagens na seção Projetos (`src/assets/projects/`), com `loading="lazy"` e `width`/`height` explícitos para evitar layout shift
- `Project.image` (opcional) no modelo de dados, com `src`/`alt`/`width`/`height`
- 2 novas entradas de projeto ("Landing Page — Estúdio Criativo", "Landing Page — Arquitetura & Construção"), explicitamente marcadas como referências visuais de UI — sem `repoUrl`/`demoUrl` e sem nome de marca real, para não sugerir autoria de software que não foi implementado

### Decisões

- O usuário enviou 5 imagens para a seção de Projetos. Ao inspecionar cada uma antes de integrar, 3 se mostraram impróprias para uso: duas eram designs de terceiros (uma com o WhatsApp e preço de outro freelancer visíveis na própria imagem) e uma era gerada por IA com texto visivelmente corrompido. Apenas as 2 imagens limpas foram usadas, e como referência visual explícita — não como prova de projetos implementados — a pedido do usuário

## [0.12.0] — 2026-07-23

### Adicionado

- Vitest + React Testing Library + `@testing-library/user-event` + `jest-dom`, configurados em `vite.config.ts` (reaproveita alias e transform do Vite, sem build paralela)
- `src/test/setup.ts`: mocks globais de `IntersectionObserver` e `matchMedia` (jsdom não implementa nenhum dos dois — necessários para qualquer componente que use `Reveal` ou `useReducedMotion`)
- 35 testes em 11 arquivos: `Button`, `Badge`, `Card`, `Input`, `IconButton`, `Footer` (unitários), `useCopyToClipboard` (hook), `Header`, `Contact`, `Projects` + `Projects` estado vazio (integração)
- Scripts `test`, `test:watch`, `test:coverage`
- Threshold de cobertura no Vitest (`vite.config.ts`), calibrado sobre a cobertura real medida: 65% statements / 85% branches / 60% functions / 70% lines

### Corrigido

- `Object.assign(navigator, { clipboard: ... })` falha no jsdom porque `navigator.clipboard` é exposto como getter — trocado por `Object.defineProperty` com `configurable: true`
- No teste do botão de copiar e-mail, `userEvent.setup()` instala seu próprio stub de `navigator.clipboard`, sobrescrevendo qualquer mock definido antes dele (ex.: em `beforeEach`). O mock precisa ser definido depois do `setup()`

## [0.11.0] — 2026-07-23

### Adicionado

- `rollup-plugin-visualizer` + script `build:analyze` (`vite build --mode analyze`): gera treemap do bundle em `dist/stats.html`, usado para decidir onde otimizar em vez de adivinhar
- Script `lighthouse` (`scripts/lighthouse.mjs`): builda produção, sobe via API do Vite (`preview()`, não child process — mais confiável no Windows), roda Lighthouse mobile + desktop com os presets de throttling corretos do próprio Lighthouse (o preset desktop precisa ser importado explicitamente; sem ele, o Lighthouse aplica throttling de mobile numa viewport desktop e penaliza a nota)
- `public/robots.txt`

### Alterado

- Framer Motion migrado de `motion.*` para `m.*` + `<LazyMotion features={domAnimation} strict>` (`src/App.tsx`): o treemap do bundle mostrou que `gestures/drag` e os módulos de `projection` (layout animation) — recursos que o projeto não usa em lugar nenhum — respondiam por boa parte do peso do Framer Motion
- `About`, `Projects`, `Skills` e `Contact` carregados via `React.lazy` + `Suspense`; `Hero` fica fora do split de propósito, por ser conteúdo acima da dobra (LCP)
- Fontes: cada família importa só o subconjunto `latin` (cobre PT-BR por completo — os acentos do português estão em Latin-1 Supplement, dentro de `latin`), em vez dos arquivos "completos" que embutiam cirílico/grego/vietnamita sem necessidade

### Corrigido

- Durante a otimização de fontes, uma primeira tentativa importou `latin` **e** `latin-ext` para "garantir cobertura" — sem checar se `latin-ext` era necessário. Os arquivos do `@fontsource` por subconjunto não têm `unicode-range` (diferente dos arquivos "completos"), então cada import baixa incondicionalmente: isso *dobrou* o número de fontes baixadas por peso/família à toa, e a nota de performance mobile no Lighthouse caiu de ~95 para 86-88 como consequência direta. `latin-ext` foi removido (verificado depois: nenhum caractere do português está fora de `latin`) e a nota voltou a 95-96
- Durante a investigação da queda de performance, descobri 22 processos `chrome.exe` órfãos acumulados de execuções anteriores do Lighthouse (o cleanup do `chrome-launcher` falha silenciosamente com `EPERM` no Windows ao tentar apagar o diretório temporário). Isso também contribuía para notas inconsistentes por contenção de CPU. O script agora força o encerramento via `taskkill /T /F` quando a limpeza normal falha

### Verificado

- Bundle JS principal: 303.45 kB → 253.43 kB (98.74 kB → 84.56 kB gzip) só com `LazyMotion`
- CSS: 34.82 kB → 18.42 kB (12.48 kB → 4.27 kB gzip) com o ajuste de subconjunto de fontes
- Lighthouse (build de produção, `vite preview`, 2 execuções limpas consecutivas): mobile 95-96/100/100/100, desktop 100/100/100/100 (performance/accessibility/best-practices/seo)
- Regressão completa após as mudanças: axe-core (0 violações), navegação por teclado (19 paradas, mesma ordem), menu mobile (abrir/Tab/Esc), parallax do Hero — nada quebrou

## [0.10.0] — 2026-07-23

### Adicionado

- `SkipLink` (`src/components/layout/SkipLink.tsx`): bypass block (WCAG 2.4.1), primeiro elemento focável da página, oculto até receber foco por teclado
- `aria-label` dinâmico no botão de copiar e-mail (`Contact`), comunicando a ação antes do clique para quem usa leitor de tela, não só depois via live region
- Token `accent-violet-light` (`#A78BFA`): variante clara de `accent-violet` para uso como texto sobre fundo tingido (`Badge` variante `accent`), onde a cor original não atingia contraste AA

### Corrigido

- `text-muted` estava definido como `#6B7280` (4.08:1 sobre `bg-canvas`), abaixo do mínimo AA de 4.5:1 — o valor documentado em `DESIGN-SYSTEM.md` (4.6:1) estava incorreto, calculado manualmente sem verificação. Corrigido para `#7E8794` (5.4:1), agora medido por ferramenta
- `Badge` variante `accent` e o destaque `const` em `About`: `accent-violet` como texto sobre fundo `accent-violet/15` media 3.96–4.22:1 dependendo do fundo composto — trocado para `accent-violet-light`
- `Header`: fechar o menu mobile com Esc não devolvia o foco ao botão que o abriu quando o usuário já havia tabulado para dentro do menu (ou além dele) — o foco ficava "perdido" onde estava. Corrigido para sempre devolver o foco ao botão de menu, padrão esperado para menus tipo disclosure

### Verificado

- Auditoria de contraste WCAG AA automatizada com axe-core em toda a página (todas as seções reveladas), em desktop e com o menu mobile aberto — 0 violações após as correções
- Navegação por teclado mapeada ponta a ponta: 19 paradas de Tab em ordem lógica, todas visíveis, todas com indicador de foco; skip link, mobile menu (abrir/Tab/Esc) testados
- Landmarks e hierarquia de headings revisados via árvore de acessibilidade: 1 banner, 1 navigation, 1 main, 5 regions nomeadas, 1 contentinfo, h1→h2→h3 sem saltos
- **Limitação registrada**: o "teste com leitor de tela" desta fase usou Chromium/Playwright + axe-core como proxy, não NVDA/VoiceOver reais (indisponíveis neste ambiente). Teste manual real fica pendente, adicionado à Fase 12

## [0.9.0] — 2026-07-23

### Adicionado

- Parallax pontual no `Hero`: glow decorativo (gradiente `accent-gradient` desfocado) se desloca até 40px conforme o scroll, via `useScroll`/`useTransform` do Framer Motion, atrás do conteúdo (`-z-10`)

### Corrigido

- Auditoria de `prefers-reduced-motion` (Fase 08) encontrou o menu mobile do `Header` animando com duração fixa, sem checar a preferência do usuário. Corrigido para usar `useReducedMotion` como os demais componentes de motion (`Reveal`, parallax do Hero)

### Verificado

- Parallax confirmado via medição real de posição do elemento antes/depois do scroll (motion normal desloca menos que o scroll da página; com `reducedMotion: reduce`, desloca exatamente o mesmo tanto — ou seja, o parallax é efetivamente desativado)

## [0.8.0] — 2026-07-23

### Adicionado

- Seção `Contact` (`src/sections/Contact.tsx`): botão de copiar e-mail com feedback visual (ícone + texto alternando, live region acessível, reset automático em 2s), CTA `mailto:` e links sociais (GitHub/LinkedIn)
- `useCopyToClipboard` (`src/hooks/useCopyToClipboard.ts`): hook genérico de copiar-para-área-de-transferência, reutilizável em qualquer botão de "copiar" futuro
- `src/data/contact.ts`: conteúdo fictício tipado; `socialLinks` reaproveitado tanto na seção Contato quanto no `Footer`, evitando duplicar os mesmos links em dois lugares

### Corrigido

- `Header` e `Footer` usavam `href` como `key` nas listas de navegação/links. Como os social links de placeholder usam `"#"` para ambos (GitHub e LinkedIn), isso causava colisão de key e um warning do React em runtime (descoberto verificando a seção Contato no navegador). Trocado para `key={item.label}`, que é garantidamente único no conteúdo atual

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
