# Roadmap — DevClub

Desenvolvimento incremental, dividido em fases. Cada fase só é considerada concluída quando atende aos critérios de excelência (engenharia, design, UX, motion, performance, acessibilidade, documentação) descritos no processo de trabalho do projeto — não apenas "funciona".

Legenda: ☐ pendente · ☑ concluído

## Fase 00 — Documentação-base

- [x] `README.md`
- [x] `ARCHITECTURE.md`
- [x] `DESIGN-SYSTEM.md`
- [x] `ROADMAP.md`
- [x] `CHANGELOG.md`

## Fase 01 — Estrutura Inicial

- [x] Scaffold Vite + React + TypeScript
- [x] Tailwind CSS configurado com os tokens de `DESIGN-SYSTEM.md`
- [x] Framer Motion instalado
- [x] ESLint + Prettier + TypeScript strict configurados
- [x] Estrutura de pastas conforme `ARCHITECTURE.md#organização-de-pastas`
- [x] `npm run dev/build/lint/typecheck` funcionando sem erros

## Fase 02 — Sistema Visual

- [x] Componentes primitivos (`Button`, `Card`, `Badge`, `Input`, `IconButton`)
- [x] Componentes de layout (`Container`, `Section`, `Header`, `Footer`)
- [x] Todos os estados documentados no `DESIGN-SYSTEM.md` implementados (hover/focus/active/disabled)
- [x] Storybook avaliado e descartado — projeto pequeno, com um único consumidor dos componentes; verificação visual feita via showcase temporário + Playwright, sem manter ferramenta extra no repositório

## Fase 03 — Seção Hero

- [x] Composição da headline com `accent-gradient`
- [x] CTA primário e secundário
- [x] Micro-interação de entrada (scroll reveal / entrance), via primitivo `Reveal` reutilizável
- [x] Responsivo mobile-first

## Fase 04 — Seção Sobre

- [x] Narrativa curta de posicionamento profissional _(conteúdo fictício — ver `src/data/about.ts`)_
- [x] Hierarquia visual clara entre texto e destaque visual (narrativa + stats à esquerda, snippet de código estilizado à direita)

## Fase 05 — Seção Projetos

- [x] Modelo de dados tipado em `src/data` (placeholder, ver `ARCHITECTURE.md`) — `src/data/projects.ts`, conteúdo fictício
- [x] Card de projeto reutilizando o design system (`Card`, `Badge`)
- [x] Estado vazio implementado e verificado (array de projetos vazio → mensagem, sem grid quebrado). Estado de carregamento **adiado intencionalmente**: hoje os dados são importados de forma síncrona de um módulo local — não existe nenhuma chamada assíncrona no projeto, então uma UI de loading não teria como ser exercitada e viraria código morto. Fica planejado para quando uma fonte de dados assíncrona (ex.: CMS headless) for introduzida, conforme já previsto em `ARCHITECTURE.md#escalabilidade-futura`

## Fase 06 — Seção Skills

- [x] Agrupamento por categoria (linguagens, frameworks, ferramentas)
- [x] Representação visual sem depender de ícones de terceiros não otimizados (badges tipográficos, reaproveitando `Badge`/`Card` do design system)
- [x] Correção não planejada: `Header` não tinha navegação mobile — com o 4º item (Skills) o menu colidia com a logo em telas pequenas. Adicionado menu mobile acessível (disclosure pattern: `aria-expanded`, `aria-controls`, fecha com Esc e ao navegar)

## Fase 07 — Seção Contato

- [x] Links diretos (e-mail via `mailto:`, GitHub, LinkedIn — placeholders fictícios)
- [x] Feedback visual de cópia (botão "copiar e-mail" com ícone + texto que alternam, live region para leitores de tela, reset automático)
- [x] Correção não planejada: `Footer`/`Header` usavam `href` como `key` das listas — com dois social links de placeholder (`"#"`), isso colidia e disparava warning do React de key duplicada. Trocado para `key={item.label}`

## Fase 08 — Motion & Scroll Reveal

- [x] Scroll reveal aplicado de forma consistente entre seções (auditado: todas usam o primitivo `Reveal`, mesmo padrão de delay escalonado)
- [x] Parallax pontual no Hero — glow decorativo desloca até 40px via `useScroll`/`useTransform`, atrás do conteúdo
- [x] Respeito a `prefers-reduced-motion` validado em todos os componentes de motion — auditoria encontrou e corrigiu um caso faltante: o menu mobile do `Header` não checava a preferência

## Fase 09 — Acessibilidade

- [x] Auditoria de contraste (WCAG AA) em todos os pares texto/fundo — automatizada com axe-core, cobrindo a página inteira (todas as seções reveladas) em desktop e com o menu mobile aberto. Encontrou e corrigiu 2 problemas reais: `text-muted` (`#6B7280`, 4.08:1) e `accent-violet` como texto sobre fundo tingido (3.96–4.22:1) — ambos abaixo do mínimo. Zero violações após a correção
- [x] Navegação completa por teclado — todas as 19 paradas de Tab da página mapeadas em ordem, todas visíveis e com indicador de foco; menu mobile testado com Enter/Esc, incluindo devolução de foco ao botão ao fechar (bug real encontrado e corrigido)
- [x] `aria-label`/landmarks revisados — 1 banner, 1 navigation, 1 main, 5 regions nomeadas (uma por seção), 1 contentinfo, hierarquia de headings h1→h2→h3 sem saltos. Adicionado skip link ("Pular para o conteúdo principal"), ausente até então
- [x] Teste com leitor de tela — **feito por proxy**, não com NVDA/VoiceOver reais (indisponíveis neste ambiente de execução): árvore de acessibilidade inspecionada via Chromium/Playwright + auditoria axe-core. Recomenda-se um teste manual com leitor de tela real antes do deploy final

## Fase 10 — Performance

- [x] Lighthouse ≥ 95 em todas as categorias — mobile 95, desktop 100, accessibility/best-practices/SEO 100 (2026-08-04, execução limpa após matar processos órfãos do Chrome que estavam distorcendo medições anteriores — ver decisão em CHANGELOG v0.30.0). Histórico da métrica: baseline em v0.11.0 (mobile 95-96); caiu pra 83 na v0.26.0 (Fase 12, expansão de 6 capítulos) e foi recuperada em duas passadas (v0.26.0/v0.27.0); caiu de novo temporariamente na v0.30.0 (sequência de imagens do Boot carregando tudo de uma vez) e foi corrigida com carregamento sob demanda
- [x] Code splitting por seção — `About`/`Projects`/`Skills`/`Contact` via `React.lazy`; `Hero` fica fora (é o LCP)
- [x] Otimização de imagens (formatos modernos, dimensões explícitas) — as 2 imagens da seção Projetos usam `loading="lazy"` + `width`/`height` explícitos. WebP/AVIF com fallback fica pendente para quando o volume de imagens justificar o pipeline
- [x] Análise de bundle size — `rollup-plugin-visualizer` (`npm run build:analyze`) usado para medir antes/depois; JS principal caiu de 303.45 kB (98.74 kB gzip) para 253.43 kB (84.56 kB gzip) com `LazyMotion`, mais 5 chunks de seção de 0.2-3 KB cada

## Fase 11 — Testes

- [x] Testes unitários dos componentes do design system — `Button`, `Badge`, `Card`, `Input`, `IconButton` (100% statements) + hook `useCopyToClipboard`
- [x] Testes de integração das seções críticas — `Header` (menu mobile, foco, Esc), Capítulo 6/`Hire` (copiar e-mail via Clipboard API, mesmo teste que era do antigo `Contact`). `Footer`/`App`/os outros 5 capítulos deliberadamente fora do escopo — composição estática ou sem lógica própria testável ainda, ver `ARCHITECTURE.md#estratégias-de-testes`
- [x] Definir cobertura mínima aceitável — thresholds do Vitest calibrados sobre a cobertura real medida, não um número escolhido a priori (recalibrado de novo em 2026-07-24 após a remoção das seções antigas, ver `CHANGELOG.md`). 32 testes, 9 arquivos, todos passando

## Fase 12 — Reposicionamento: DevClub como plataforma/comunidade

Decisão do usuário em 2026-07-24: o DevClub deixa de ser só um portfólio pessoal e passa a se posicionar como marca/comunidade de formação em tecnologia ("Do primeiro `console.log` à primeira contratação"). Estrutura de referência vem de capturas de tela de um site real de terceiro — reaproveitada só como layout/estrutura, nunca como conteúdo (sem pessoas, empresas ou alegações reais de terceiros). Ver `CHANGELOG.md` v0.14.0 para o detalhamento da decisão.

- [x] `Header`: nav + "Área do aluno" + CTA "Quero fazer parte"
- [x] ~~`Hero`: manchete e copy em torno do storytelling console.log → contratação~~ — retirado em 2026-07-24, substituído pelo Capítulo 1/Boot (mesmo storytelling, formato de scrollytelling)
- [x] ~~Seção "Formações"~~ — retirada em 2026-07-24, substituída pelo Capítulo 4/Level Up (mesmo dado, `src/data/tracks.ts`)
- [x] ~~Seção "Stack ensinada"~~ — retirada em 2026-07-24 junto com o restante do layout de página única
- [x] ~~Seção "Comunidade"~~ — retirada em 2026-07-24, substituída pelo Capítulo 5/Connect
- [ ] Seção "Plataforma" (preview conceitual, não screenshot de produto real)
- [ ] Seção "Mentores" com placeholders claramente fictícios (sem fotos de pessoas reais)
- [ ] Seção FAQ
- [ ] Footer expandido
- [x] ~~Reconciliar `About`/`Contact` existentes com o novo posicionamento~~ — resolvido removendo as duas seções em 2026-07-24: a funcionalidade real de `Contact` (copiar e-mail) foi absorvida pelo Capítulo 6/Hire, `About` não tinha equivalente nos 6 capítulos e foi descartado
- [ ] Home em scrollytelling de 6 capítulos (Boot/Build/Deploy/Level Up/Connect/Hire) + páginas "Nossos Alunos"/Blog/Newsletter — briefing detalhado do usuário em 2026-07-24, ver `CHANGELOG.md`. Sub-fases:
  - [x] **Fase A — Fundação**: `react-router-dom`, rotas (`/`, `/nossos-alunos`, `/blog`, `/blog/:slug`, `/newsletter`), `Layout` persistente, hooks `useScrollProgress`/`useInView`, páginas placeholder
  - [x] **Fase B — Home em 6 capítulos**:
    - [x] Boot — terminal com digitação em tempo real, protótipo validado pelo usuário em 2026-07-24
    - [x] Build — tecnologias conectadas a um centro ("Você"), linhas SVG desenhando-se ao entrar na viewport
    - [x] Deploy — projetos como janelas vivas (mockup de barra de navegador), hover realça, clique expande descrição + stack
    - [x] Level Up — trilhas de `src/data/tracks.ts` como skill tree vertical (fundamentos "desbloqueados", especializações como "próximo nível")
    - [x] Connect — alunos/mentores/comunidade/empresas parceiras como malha de nós (todo par conectado, não um hub único), pulsando continuamente + pontos-satélite decorativos
    - [x] Hire — fechamento com callback à headline de abertura ("Do primeiro console.log à primeira contratação"); CTA primário copia o e-mail de contato (mesma lógica que era da antiga seção `Contact`, absorvida aqui), não depende mais de âncora pra seção nenhuma
    - [x] Transição 3D conectando os capítulos (`useChapterTilt`) — cada capítulo inclina/recua sutilmente ao entrar e sair da viewport, sem depender de WebGL/vídeo, ver decisão em `CHANGELOG.md`
    - [x] Imagem de fundo (código estilizado, gerada por IA) aplicada no site inteiro (fixa, atrás de header/conteúdo/footer), variantes mobile/desktop separadas — cada seção com fundo próprio deixa passar um pouco dessa camada
    - [x] Fotos reais (mockups de UI gerados por IA, fornecidos pelo usuário) nos 3 cards do capítulo Deploy — Painel Financeiro, App de Hábitos, Loja Cápsula
    - [x] Seções antigas (`Formacoes`, `Stack`, `Community`, `About`, `Projects`, `Contact`, `Hero`) removidas de `Home.tsx` — a página termina no Capítulo 6/Hire + `Footer`, sem duplicar conteúdo nem navegação
    - [x] Boot redesenhado: seção "pinada" (scroll alto + conteúdo `sticky`) onde texto (verde, sem "$") e uma sequência de 28 imagens de fundo avançam por scroll em vez de timer — pedido do usuário em 2026-08-04, ver decisão em `CHANGELOG.md`
    - [x] Ajuste fino do scroll do Boot: progresso suavizado com mola (`useSpring`) em vez de seguir a posição bruta 1:1, e altura da faixa de scroll aumentada (220dvh → 260dvh) — pedido do usuário pra um movimento "menos agressivo", ver `CHANGELOG.md`
    - [x] Build redesenhado: núcleo pulsante, anéis orbitais decorativos e partículas percorrendo cada linha (uma vez na entrada, depois em loop periódico) — linguagem de movimento pedida pelo usuário a partir de uma referência em vídeo (produto real, só o estilo foi reaproveitado — ver decisão em `CHANGELOG.md`). Também corrigido: rótulo "TypeScript" cortado na borda em viewports estreitos (bug de overflow pré-existente, achado ao verificar mobile)
    - [x] Build ganhou efeito vidro (núcleo + badges), badges com flutuação contínua, e um sistema elástico com mola: nós e linhas reagem à proximidade/hover do mouse e voltam sozinhos à formação original — pedido do usuário em 2026-08-04, ver `CHANGELOG.md`
    - [x] Corrigido desalinhamento real do núcleo ("Você") do Build: `animate={{scale}}` do Motion sobrescrevia o `translate` de centralização do Tailwind no mesmo elemento — a verificação anterior (v0.33.0) tinha medido só sob `prefers-reduced-motion`, onde o bug nunca disparava, por isso não pegou o problema. Ver `CHANGELOG.md`
    - [x] Build trocou o diagrama núcleo+órbita+linhas por tags de tecnologia flutuando livremente numa caixa, quicando nas bordas — referência de código trazida pelo próprio usuário, pedido em 2026-08-04, ver `CHANGELOG.md`
    - [x] Todos os títulos do site (`h1`/`h2`/`h3`) passaram a usar `accent-green`, que antes era exclusivo do texto do Boot — pedido do usuário em 2026-08-04. Estados semânticos existentes foram preservados: skill bloqueada (Level Up) continua em cinza, e o destaque em duas cores da headline de fechamento do Hire (`console.log` em ciano, "primeira contratação" em gradiente) não foi alterado, ver `CHANGELOG.md`
    - [x] Ícone próprio (`icone.png`, fornecido pelo usuário) substituiu o favicon SVG genérico e passou a acompanhar "DevClub" no logotipo do cabeçalho — pedido do usuário em 2026-08-04, ver `CHANGELOG.md`
    - [x] Vídeo (`sistema.mp4`, fornecido pelo usuário) como fundo em loop mudo da caixa de tags flutuantes do Build — pedido do usuário em 2026-08-04, ver `CHANGELOG.md`
    - [x] Cada badge de tecnologia do Build ganhou uma linha ligando ele a um ponto fixo pulsante no centro da caixa, acompanhando a flutuação em tempo real — pedido do usuário em 2026-08-04, ver `CHANGELOG.md`
    - [x] Build: movimento dos badges passou de "quique" em linha reta pra deriva orgânica com curvas, cada badge dá pra arrastar com o mouse/toque dentro da caixa, e título/subtítulo do capítulo passaram a ficar ao lado da caixa (não em cima) com uma linha verde fina como divisória — pedido do usuário em 2026-08-04, ver `CHANGELOG.md`
    - [x] Imagem de fundo global (código estilizado) com véu mais claro, e véu do capítulo Boot também mais claro — pedido do usuário em 2026-08-04, ver `CHANGELOG.md`
    - [x] Sistema de tema claro/escuro com botão no cabeçalho (`ThemeContext` + `ThemeToggle`), persistido, padrão sempre escuro (não segue o SO) — pedido do usuário em 2026-08-04. Boot e a caixa de vídeo do Build ficam sempre escuros por design (texto lido sobre imagem/vídeo próprio, não sobre o `canvas` da página), ver decisão e cálculos de contraste em `CHANGELOG.md`
    - [x] Removido o rótulo "Capítulo X / 06 — Nome" (eyebrow acima do título) dos 6 capítulos — pedido do usuário em 2026-08-04. `aria-label` de cada `<section>` mantido (não é visível, é só landmark de navegação por leitor de tela)
    - [x] Level Up: título/subtítulo passaram a ficar ao lado esquerdo e a trilha de conhecimento ao lado direito (empilhado no mobile, como antes) — pedido do usuário em 2026-08-04, mesmo padrão já usado no Build
    - [ ] Indicador de progresso lateral ("Capítulo X/6") e paleta evolutiva entre os 6 capítulos como conjunto — segue adiado, ver decisão em `CHANGELOG.md`
  - [ ] **Fase C — "Nossos Alunos"**: depoimentos fictícios, filtros por mídia/profissão anterior, paginação
  - [ ] **Fase D — Blog**: busca, post em destaque, grid de artigos, página de artigo
  - [ ] **Fase E — Newsletter**: inscrição, lista de edições fictícias
- **Fora do escopo, de propósito** (alegações factuais que não são verdadeiras para este projeto): certificação MEC, contadores de alunos/números de escala, garantia de reembolso de produto pago, depoimento em vídeo real

## Fase 13 — Deploy Final

- [x] Escolha de plataforma — Vercel. Repositório publicado em `github.com/renanspin-sketch/devclub`, `vercel.json` com rewrite pra `index.html` (necessário pro React Router: sem isso, acessar `/blog` ou `/nossos-alunos` direto — não navegando a partir da home — dá 404 no Vercel, que serve arquivos estáticos por padrão)
- [ ] Domínio e SEO final (meta tags, Open Graph, sitemap)
- [x] Link de demonstração adicionado ao `README.md` — [devclub-flame.vercel.app](https://devclub-flame.vercel.app/), verificado em produção (rotas do React Router, imagens dos capítulos, zero erros/warnings de console)
- [ ] Teste manual com leitor de tela real (NVDA ou VoiceOver) — pendente da Fase 09, que usou apenas auditoria automatizada como proxy
- [ ] Substituir conteúdo fictício pelos dados reais (e-mail/links de contato do Capítulo 6/Hire, trilhas do Level Up, projetos do Deploy, depoimentos/posts das Fases C/D/E quando existirem)
