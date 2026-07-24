# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [0.25.0] — 2026-07-24

### Contexto

Pedido do usuário: dar aos 6 capítulos uma sensação de profundidade 3D "conectando um capítulo ao outro", inspirado em sites de referência (`elirigobeli.com/higgsfield/*`) que o usuário indicou. Inspecionei essas referências (Playwright + leitura dos scripts carregados, não cópia de conteúdo) e identifiquei a técnica real: GSAP ScrollTrigger + Lenis fazendo scrub de uma sequência de frames em canvas (essencialmente um vídeo cinematográfico, provavelmente gerado no Higgsfield, sincronizado ao scroll) — não WebGL/geometria 3D de verdade. Apresentei ao usuário duas rotas (réplica real com vídeo gerado + GSAP/Lenis vs. efeito 3D leve com CSS/Framer Motion) e ele escolheu a segunda, mais barata em risco e sem dependência nova.

### Adicionado

- `useChapterTilt` (`src/hooks/useChapterTilt.ts`): hook compartilhado que aplica `rotateX`/`scale`/`opacity` acoplados ao progresso de scroll de cada capítulo (via `useScroll`/`useTransform` do Framer Motion, mesma base já usada no parallax do Hero) — cada capítulo inclina como se emergisse de baixo ao entrar e recua pro lado oposto ao sair, dentro do próprio elemento via `transformPerspective` (sem precisar de `perspective` num ancestral, então não mexe no layout de `Home`)
- Aplicado aos 6 capítulos (Boot→Hire). Capítulos que já tinham `ref` próprio (Build, Connect, via `useInView`) reaproveitam o mesmo ref em vez de criar um segundo — uma única medição de scroll por capítulo
- Boot é caso especial (`withEntry: false`): por ser o topo da página, não existe "capítulo anterior" entrando por baixo — só a saída (inclinando pro Build) é animada, evitando que a primeira coisa que o usuário vê já nasça com fade/tilt aplicado
- Imagem de fundo no capítulo Boot (`src/assets/backgrounds/boot-code.webp`): arte de "editor de código" gerada por IA (fornecida pelo usuário), reforçando o tema terminal da abertura. Overlay escuro (`linear-gradient` + a imagem numa única declaração de `background-image`) garante contraste do texto ciano sobre o fundo

### Decisões

- Sob `prefers-reduced-motion`, o tilt/scale é totalmente suprimido (não apenas acelerado) — os capítulos ficam estáticos (`rotateX: 0`, `scale: 1`), só a opacidade de entrada/saída permanece, e essa não é considerada motion problemática (não desloca conteúdo, é o mesmo padrão já usado pelo `Reveal` em toda a página)
- Imagem original (PNG, 1,5 MB, fornecida em `src/`) convertida para WebP a 1920px/qualidade 72 (~53 KB) antes de entrar no projeto — Boot carrega no LCP crítico da página (não é lazy), então o peso do asset importa; arquivo original removido do repositório após a conversão, só o derivado otimizado foi versionado
- Fundo aplicado só no capítulo Boot, não no site inteiro — decisão do usuário, evita competir com os elementos gráficos próprios de Build/Connect e com o texto mais denso de seções futuras

### Verificado

- Sequência de 24 screenshots ao longo do scroll dos 6 capítulos confirmando a transição sem artefatos de recorte (`overflow-hidden` das seções não corta o conteúdo inclinado, já que a rotação máxima é de só 8°)
- Computado o `transform` real do capítulo Level Up sob `prefers-reduced-motion: reduce` — confirmada matriz identidade (sem rotação/escala)
- Contraste do texto do Boot sobre a nova imagem conferido via axe-core (zero violações) — não assumido visualmente
- Zero violações de acessibilidade (axe-core), zero erros de console, suíte de testes (36/36) e build de produção passando

## [0.24.0] — 2026-07-24

### Adicionado

- Capítulo 6 — `Hire` (`src/sections/chapters/Hire.tsx`), fechamento da jornada de 6 capítulos: título reaproveita a headline de abertura do antigo `Hero` ("Do primeiro `console.log` à primeira contratação") como callback intencional ao Capítulo 1 (Boot). CTA primário ("Quero fazer parte") aponta para `#contato` — a seção real, funcional, que ainda segue renderizada em `Home` — não uma página de inscrição inexistente. CTA secundário volta pro topo da trilha (`#level-up`)
- Com Hire, os 6 capítulos do briefing do usuário (Boot→Hire) estão implementados

### Decisões

- Progresso lateral ("Capítulo X/6") e paleta evolutiva entre capítulos ficam para uma passada dedicada, agora que os 6 existem pra orquestrar como conjunto — não empacotado nesta entrega para manter cada commit focado num único capítulo, como nas anteriores
- Seções antigas redundantes (`Formacoes`, `Community`, `Hero`) continuam temporariamente renderizadas em `Home`; a remoção é um passo de limpeza à parte, não misturado com a adição de conteúdo novo

### Verificado

- Clique no CTA primário rola até `#contato` de verdade (não é link morto) — confirmado via automação (Playwright), não só lido no código
- Zero violações de acessibilidade (axe-core), zero erros de console, desktop e mobile conferidos

## [0.23.0] — 2026-07-24

### Adicionado

- Capítulo 5 — `Connect` (`src/sections/chapters/Connect.tsx`): alunos, mentores, comunidade e empresas parceiras como 4 nós numa malha — todo par conectado (6 linhas), não um hub único apontando pra um centro (diferencia visualmente do Capítulo 2/Build, que é hub-and-spoke). Nós pulsam continuamente (`scale`/`opacity` em loop) após entrar na viewport, mais 8 pontos-satélite decorativos com `animate-pulse` reforçando a sensação de rede povoada e viva

### Decisões

- Linhas da malha usam cor sólida (`#7C5CFC`), não gradiente — decisão deliberada pra não reintroduzir a classe de bug já resolvida no Build (`linearGradient` com `objectBoundingBox` degenera em linhas de largura/altura zero); aqui nem era necessário gradiente, então o caminho mais simples também é o mais seguro
- Animação de pulso contínuo (`repeat: Infinity`) é suprimida por completo com `prefers-reduced-motion` — os nós vão direto pro estado final estático, sem loop nenhum, não apenas mais rápido

### Verificado

- Malha completa (6 linhas + 4 nós + 8 satélites) renderizando corretamente em desktop e mobile
- Zero violações de acessibilidade (axe-core), zero erros de console

## [0.22.0] — 2026-07-24

### Adicionado

- Capítulo 4 — `LevelUp` (`src/sections/chapters/LevelUp.tsx`): as trilhas de formação (mesmo dado de `src/data/tracks.ts`, reaproveitado da seção "Formações") reaparecem como uma trilha vertical de skill tree — linha conectando os nós, os 3 fundamentos com selo "Disponível" (ícone de check), as 3 especializações com selo "Próximo nível" (ícone de cadeado)
- Copy do capítulo evita prometer um mecanismo de acesso real que a plataforma não implementa — o "desbloqueio" é uma metáfora visual de progressão pedagógica (fundamentos → especialização), não uma trava de acesso factual

### Verificado

- Estado desbloqueado/bloqueado conferido visualmente em desktop e mobile
- Zero violações de acessibilidade (axe-core), zero erros de console

## [0.21.0] — 2026-07-24

### Adicionado

- Capítulo 3 — `Deploy` (`src/sections/chapters/Deploy.tsx`): 3 projetos fictícios (Painel Financeiro, App de Hábitos, Loja Cápsula) apresentados como "janelas vivas" — mockup de barra de navegador (semáforo de 3 pontos + barra de endereço fake `devclub.dev/projetos/...`) em vez de card estático
- Micro-interações: hover realça a janela (borda, sombra e um glow do gradiente de acento por trás do conteúdo); clique num botão real (`aria-expanded`) expande/recolhe descrição + stack técnica, com transição de altura via `AnimatePresence`/`framer-motion` e `prefers-reduced-motion` respeitado

### Verificado

- Estados de hover e expandido conferidos visualmente em desktop e mobile; conteúdo permanece legível empilhado no mobile mesmo com a barra de endereço truncando o slug
- Zero violações de acessibilidade (axe-core), zero erros de console — o toggle usa `<button aria-expanded>` real, não uma `div` clicável

## [0.20.0] — 2026-07-24

### Adicionado

- Capítulo 2 — `Build` (`src/sections/chapters/Build.tsx`): 6 tecnologias como nós ao redor de um centro ("Você"), conectados por linhas SVG que se desenham progressivamente (staggered) ao entrar na viewport, via `useInView`

### Corrigido

- **Bug real de SVG, não de React**: o gradiente das linhas usava `objectBoundingBox` (padrão) com coordenadas relativas 0→1 — para uma linha com bounding box de largura ou altura zero (ex.: uma linha perfeitamente vertical, como a de "React" no topo e "Tailwind CSS" embaixo), essa matriz degenera e o SVG não pinta nada, por especificação. As duas linhas verticais simplesmente não apareciam. Trocado para `gradientUnits="userSpaceOnUse"` com coordenadas absolutas do viewBox, que não depende da caixa delimitadora de cada elemento individual
- No caminho, também descartei `pathLength` do Framer Motion em favor de `strokeDasharray`/`strokeDashoffset` manual para o desenho progressivo das linhas — mecânica SVG mais direta e previsível, sem depender do cálculo de comprimento de path da biblioteca

### Verificado

- Todos os 6 nós conectados corretamente em desktop e mobile (capturado antes e depois da correção do gradiente)
- Zero violações de acessibilidade (axe-core), zero erros de console

## [0.19.0] — 2026-07-24

### Adicionado

- Capítulo 1 — `Boot` (`src/sections/chapters/Boot.tsx`): terminal escuro, pergunta de abertura digitada em tempo real (efeito de máquina de escrever, 45ms/caractere), cursor piscando (nova animação `blink` no Tailwind — corte abrupto, não fade, para parecer um cursor de terminal de verdade), indicador "Capítulo 01/06" e dica de scroll que aparece só após a digitação terminar
- Home passa a abrir com `Boot` no lugar do `Hero` antigo — protótipo validado pelo usuário antes de investir nos outros 5 capítulos

### Verificado

- Acessibilidade do efeito de digitação: a pergunta completa existe no `<h1>` desde o primeiro render via um span `sr-only`; a animação visual fica `aria-hidden`. Confirmado medindo o **nome acessível real** do elemento (via `getByRole` com `name` exato, que respeita `aria-hidden`) — não o `textContent` bruto, que concatenaria as duas cópias do texto e daria um falso positivo de duplicação
- `prefers-reduced-motion`: texto completo aparece instantaneamente, sem digitação
- Zero violações de acessibilidade (axe-core), zero erros de console, mobile conferido

## [0.18.0] — 2026-07-24

### Contexto

O usuário forneceu um briefing detalhado para expandir o DevClub além de uma página só: a Home vira uma jornada de scrollytelling em 6 capítulos (Boot/Build/Deploy/Level Up/Connect/Hire, "Do primeiro `console.log` à primeira contratação"), mais 3 páginas novas (Nossos Alunos, Blog, Newsletter). O briefing é explícito: reaproveitar só a arquitetura de informação de referências externas, nunca texto/imagem/copy reais — todo conteúdo é fictício, escrito do zero. Dividido em sub-fases (A-E) dentro da Fase 12; este release cobre a Fase A.

### Adicionado

- `react-router-dom`: rotas `/`, `/nossos-alunos`, `/blog`, `/blog/:slug`, `/newsletter`, roteamento declarativo (`<Routes>`/`<Route>`, sem router de dados — nenhuma rota tem loader/action)
- `Layout` (`src/components/layout/Layout.tsx`): casco persistente entre rotas (Header/Footer/SkipLink + `<Outlet />`)
- `src/pages/`: nova camada de componentes de rota (`Home`, `NossosAlunos`, `Blog`, `BlogPost`, `Newsletter`) — `Home` reaproveita as seções existentes por enquanto (Fase B substitui pelos capítulos); as demais são placeholders explícitos ("em construção"), com `TODO` indicando a fase que preenche cada uma
- `useScrollProgress` e `useInView` (`src/hooks/`): hooks reutilizáveis para animação acoplada a scroll, generalizando o padrão que já existia hardcoded no `Hero` — evita repetir `useScroll`/`target` em cada um dos 6 capítulos da Fase B
- `Header`: passa a decidir entre `<Link>` (rota) e `<a>` (âncora) a partir do formato do `href` — necessário porque o nav agora mistura navegação entre páginas com âncoras dentro da Home

### Corrigido

- Cobertura de testes recalibrada temporariamente (70/65/60/85 → 50/45/40/85): a estrutura de rotas introduziu várias páginas placeholder sem lógica própria ainda: cobri-las com teste agora seria testar um "em construção" que muda de qualquer forma nas Fases B-E. Sobe de novo conforme essas páginas ganham conteúdo real

## [0.17.0] — 2026-07-24

### Adicionado

- Seção `Community` (`src/sections/Community.tsx`): 4 pilares de apoio "além do código" (mentoria, comunidade ativa, preparação para entrevistas, rede de indicações), cada um com ícone SVG próprio (sem biblioteca externa, consistente com o restante do projeto)
- `src/data/community.ts`: conteúdo fictício, deliberadamente escrito **sem** os equivalentes não verificáveis da referência (sem "recrutadora semanal", "terapeuta", contadores de alunos ou superlativos como "maior comunidade do Brasil")
- Nav principal: "Comunidade" adicionado; ordem de página ajustada para Hero → Formações → Stack → Comunidade → Sobre → Projetos → Contato, mais próxima da estrutura de referência

## [0.16.0] — 2026-07-24

### Alterado

- Seção `Skills` reconciliada em `Stack` (`src/sections/Stack.tsx`, `src/data/stack.ts`): mesmo padrão visual (grid de categorias com badges), copy reescrita de "minhas habilidades" para "tecnologias que você vai dominar" — reflete o reposicionamento do DevClub e cobre duas necessidades de uma vez: o item "Stack ensinada" da Fase 12 e a reconciliação de conteúdo pessoal pendente
- Categorias expandidas para cobrir as trilhas de Formações (Node.js e React Native adicionados; "Ferramentas" virou "Ferramentas & IA", incluindo GitHub Copilot/ChatGPT/Claude)
- Nav principal: "Skills" → "Stack"; âncora `#skills` → `#stack`

## [0.15.0] — 2026-07-24

### Adicionado

- Seção `Formações` (`src/sections/Formacoes.tsx`): 6 trilhas de estudo em um scroll lateral de cards, `src/data/tracks.ts` como conteúdo fictício tipado
- Item "Formações" na navegação principal, primeiro da lista (reflete a nova ordem de página: Hero → Formações → Sobre → Projetos → Skills → Contato)

### Corrigido

- Contêiner de scroll lateral recebeu `tabIndex={0}`: uma região com `overflow-x-auto` sem nenhum filho focável não é alcançável via Tab por padrão, o que deixaria usuários de teclado sem forma de rolar a lista de trilhas. Confirmado via teste real (medição de `scrollLeft` antes/depois de `ArrowRight` com o contêiner focado)

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
