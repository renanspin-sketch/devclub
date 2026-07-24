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

- [x] Lighthouse ≥ 95 em todas as categorias — mobile 95-96, desktop 100, accessibility/best-practices/SEO 100 (2 execuções limpas consecutivas, ver CHANGELOG v0.11.0)
- [x] Code splitting por seção — `About`/`Projects`/`Skills`/`Contact` via `React.lazy`; `Hero` fica fora (é o LCP)
- [x] Otimização de imagens (formatos modernos, dimensões explícitas) — as 2 imagens da seção Projetos usam `loading="lazy"` + `width`/`height` explícitos. WebP/AVIF com fallback fica pendente para quando o volume de imagens justificar o pipeline
- [x] Análise de bundle size — `rollup-plugin-visualizer` (`npm run build:analyze`) usado para medir antes/depois; JS principal caiu de 303.45 kB (98.74 kB gzip) para 253.43 kB (84.56 kB gzip) com `LazyMotion`, mais 5 chunks de seção de 0.2-3 KB cada

## Fase 11 — Testes

- [x] Testes unitários dos componentes do design system — `Button`, `Badge`, `Card`, `Input`, `IconButton` (100% statements) + hook `useCopyToClipboard`
- [x] Testes de integração das seções críticas — `Header` (menu mobile, foco, Esc), `Contact` (copiar e-mail via Clipboard API), `Projects` (dados reais + estado vazio via mock de módulo). `Hero`/`About`/`Skills`/`Footer`/`App` deliberadamente fora do escopo — composição estática sem lógica própria, ver `ARCHITECTURE.md#estratégias-de-testes`
- [x] Definir cobertura mínima aceitável — thresholds do Vitest calibrados sobre a cobertura real medida (70% statements / 89% branches / 63% functions / 74% lines), não um número escolhido a priori. 35 testes, 11 arquivos, todos passando

## Fase 12 — Reposicionamento: DevClub como plataforma/comunidade

Decisão do usuário em 2026-07-24: o DevClub deixa de ser só um portfólio pessoal e passa a se posicionar como marca/comunidade de formação em tecnologia ("Do primeiro `console.log` à primeira contratação"). Estrutura de referência vem de capturas de tela de um site real de terceiro — reaproveitada só como layout/estrutura, nunca como conteúdo (sem pessoas, empresas ou alegações reais de terceiros). Ver `CHANGELOG.md` v0.14.0 para o detalhamento da decisão.

- [x] `Header`: nav + "Área do aluno" + CTA "Quero fazer parte"
- [x] `Hero`: manchete e copy em torno do storytelling console.log → contratação
- [x] Seção "Formações" (trilhas de estudo, scroll lateral com `tabIndex` para navegação por teclado — sem isso, contêineres de overflow sem filhos focáveis ficam inacessíveis por teclado)
- [x] Seção "Stack ensinada" (equivalente honesto ao bloco "modelos ilimitados" da referência) — implementada reconciliando a antiga seção `Skills` (que já era um grid categorizado de badges, mesma forma visual) em vez de criar conteúdo duplicado; resolve também o item de reconciliação abaixo
- [x] Seção "Comunidade" (mentoria, networking — sem alegações não verificáveis): 4 pilares (mentoria, comunidade ativa, preparação para entrevistas, rede de indicações), sem números de escala nem superlativos
- [ ] Seção "Plataforma" (preview conceitual, não screenshot de produto real)
- [ ] Seção "Mentores" com placeholders claramente fictícios (sem fotos de pessoas reais)
- [ ] Seção FAQ
- [ ] Footer expandido
- [ ] Reconciliar `About`/`Contact` existentes com o novo posicionamento (hoje ainda escritos em primeira pessoa, como portfólio individual). `Skills` já reconciliado → virou `Stack`
- [ ] Home em scrollytelling de 6 capítulos (Boot/Build/Deploy/Level Up/Connect/Hire) + páginas "Nossos Alunos"/Blog/Newsletter — briefing detalhado do usuário em 2026-07-24, ver `CHANGELOG.md`. Sub-fases:
  - [x] **Fase A — Fundação**: `react-router-dom`, rotas (`/`, `/nossos-alunos`, `/blog`, `/blog/:slug`, `/newsletter`), `Layout` persistente, hooks `useScrollProgress`/`useInView`, páginas placeholder
  - [ ] **Fase B — Home em 6 capítulos** (indicador de progresso lateral e paleta evolutiva ficam para quando houver mais de um capítulo pra orquestrar):
    - [x] Boot — terminal com digitação em tempo real, protótipo validado pelo usuário em 2026-07-24
    - [x] Build — tecnologias conectadas a um centro ("Você"), linhas SVG desenhando-se ao entrar na viewport
    - [x] Deploy — projetos como janelas vivas (mockup de barra de navegador), hover realça, clique expande descrição + stack
    - [x] Level Up — trilhas de `src/data/tracks.ts` como skill tree vertical (fundamentos "desbloqueados", especializações como "próximo nível")
    - [ ] Connect — rede pulsante de comunidade
    - [ ] Hire — CTA final
  - [ ] **Fase C — "Nossos Alunos"**: depoimentos fictícios, filtros por mídia/profissão anterior, paginação
  - [ ] **Fase D — Blog**: busca, post em destaque, grid de artigos, página de artigo
  - [ ] **Fase E — Newsletter**: inscrição, lista de edições fictícias
- **Fora do escopo, de propósito** (alegações factuais que não são verdadeiras para este projeto): certificação MEC, contadores de alunos/números de escala, garantia de reembolso de produto pago, depoimento em vídeo real

## Fase 13 — Deploy Final

- [ ] Escolha de plataforma (Vercel/Netlify)
- [ ] Domínio e SEO final (meta tags, Open Graph, sitemap)
- [ ] Link de demonstração adicionado ao `README.md`
- [ ] Teste manual com leitor de tela real (NVDA ou VoiceOver) — pendente da Fase 09, que usou apenas auditoria automatizada como proxy
- [ ] Substituir conteúdo fictício pelos dados reais (bio, skills, e-mail/links de contato). Projetos: 3 dos 5 cards ainda são fictícios (Dashboard/Tarefas/Loja); os 2 com imagem são referências visuais de UI explicitamente marcadas como tal (sem `repoUrl`/`demoUrl`), não projetos de código — avaliar se entram projetos de código reais no lugar
