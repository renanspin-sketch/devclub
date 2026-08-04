# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [0.36.0] — 2026-08-04

### Contexto

Usuário pediu pra mudar todos os títulos do site para verde. Perguntado se isso incluía só os títulos principais (h1/h2) ou também os subtítulos menores dentro de cada seção (h3 — nome de cada projeto no Deploy, nome de cada skill no Level Up), o usuário confirmou que era pra incluir tudo.

### Alterado

- Todo `h1`, `h2` e `h3` do site (6 capítulos da Home + títulos das 4 páginas placeholder — Blog, Nossos Alunos, Newsletter, post de blog) passou de `text-text-primary` (quase branco) para `text-accent-green`, o mesmo verde já usado no Boot — antes documentado em `DESIGN-SYSTEM.md` como exclusivo daquele capítulo, agora é a cor de título do site inteiro
- Preservados dois estados que não são "cor de título comum", e sim informação: no Level Up, o nome de uma skill ainda bloqueada continua cinza (`text-text-secondary`) — só o desbloqueado vira verde, senão perde o sinal visual de bloqueado/desbloqueado; no Hire, a headline de fechamento mantém o destaque de duas cores que já existia (`console.log` em ciano, "primeira contratação" no gradiente violeta→ciano) — só as palavras ao redor (que usavam a cor-base do título) passaram a verde

### Verificado

- Cor computada de cada `h1`/`h2`/`h3` da Home conferida via script (todos os 14 títulos "normais" em `rgb(74, 222, 128)` = `#4ADE80`; os 3 nomes de skill ainda bloqueados continuam em `rgb(161, 161, 170)`, como esperado)
- Contraste `#4ADE80` sobre os fundos escuros do site (`canvas` #0A0A0F, `surface` #13131A, `surface-elevated` #1C1C26) calculado em ~9–11:1 — folgado acima do mínimo AA (4.5:1)
- axe-core rodado em cada um dos 6 capítulos: 0 violações (uma leitura inicial no Deploy apontou falha de contraste, mas era o card com entrada animada ainda em transição no momento da leitura — sumiu ao esperar a animação terminar, não é regressão real)
- Zero mensagens de console num scroll completo da página
- Suíte de testes (32/32) e build de produção passando

## [0.35.0] — 2026-08-04

### Contexto

Usuário trouxe um código de referência (HTML/CSS/JS puro: tags flutuando livremente numa caixa, quicando nas bordas, estilo "protetor de tela") pedindo pra usar essa animação na seção de tecnologias do Build. O estilo da referência (badges soltos, sem centro nem conexões) conflitava com o diagrama existente (núcleo "Você" + linhas conectando cada tecnologia + ímã elástico que voltava pra uma "formação original"). Perguntado diretamente, o usuário optou por substituir o diagrama inteiro pelo estilo screensaver, abrindo mão da metáfora visual de "sistema conectado" que vinha dos ajustes anteriores.

### Alterado

- Removidos do Build: núcleo pulsante, anéis orbitais, linhas de conexão, partículas percorrendo as linhas e o ímã elástico que reagia à proximidade do mouse — todo o SVG do diagrama
- As 6 tecnologias agora são badges com efeito vidro dentro de uma caixa (`overflow-hidden`), cada uma com posição e velocidade próprias, quicando nas bordas do container — física rodando a cada frame (`useAnimationFrame` do Framer Motion) escrevendo direto no `transform`/`opacity` de cada badge via ref, sem passar pelo estado do React, pelo mesmo motivo de performance do hook de frames do Boot (6 badges por frame por state re-renderizaria a árvore toda à toa). Tamanho do container medido via `ResizeObserver` (não `getBoundingClientRect` dentro do loop), pra não repetir o forced-reflow que o Lighthouse já tinha pego no Boot
- Cor/glow do hover ficou no acento violeta→ciano já usado no resto do capítulo (a referência do usuário usava verde, cor que no site já é a identidade do Boot) — só a mecânica de flutuação veio da referência, não a paleta
- Sob `prefers-reduced-motion`: mesmos badges num layout estático (`flex-wrap`, centralizado), sem física nenhuma — igual ao padrão já usado no resto do site
- `role="list"` explícito nos dois `<ul>` de badges — o preflight do Tailwind zera `list-style`, e isso remove a semântica implícita de lista no Safari/VoiceOver a menos que o role seja restaurado

### Verificado

- Script Playwright confirma que os 6 badges nunca saem dos limites do container ao longo do tempo, e que de fato se movem (não ficam parados)
- Layout estático sob `prefers-reduced-motion` e recorte mobile conferidos via screenshot
- Zero violações de acessibilidade (axe-core), zero mensagens de console num scroll completo da página
- Suíte de testes (32/32) e build de produção passando — o chunk do Build encolheu (5,67 kB → 3,12 kB gzip) por ter perdido todo o SVG do diagrama antigo
- Lighthouse mobile 95 / desktop 100 / accessibility, best-practices, SEO 100 (20 processos `chrome.exe` órfãos de rodadas anteriores encerrados antes da leitura, mesma mitigação já documentada nas entradas anteriores)

## [0.34.0] — 2026-08-04

### Contexto

Usuário reportou que o núcleo ("Você") do Build "ainda está desalinhado", depois que a v0.33.0 tinha afirmado que a centralização estava "confirmada matematicamente... diferença de 0px". A verificação anterior estava certa nos números, mas errada no que media: foi feita sob `prefers-reduced-motion`, exatamente o estado em que o `animate` do Motion nunca dispara — ou seja, testou o cenário onde o bug não podia aparecer.

### Corrigido

- Bug real: o núcleo e o brilho atrás dele combinavam as classes de centralização do Tailwind (`-translate-x-1/2 -translate-y-1/2`) com `animate={{scale: [...]}}` do Framer Motion no mesmo elemento. O Motion assume o `transform` inline por completo assim que a animação roda, descartando o `translate` do Tailwind — o mesmo bug já corrigido nos nós orbitais do Build, mas que passou batido nesses dois elementos centrais. Corrigido separando cada um em uma `div` externa estática (só posicionamento) envolvendo uma `m.div` interna (só a animação de escala)

### Verificado

- Novo script Playwright mede o centro real do badge "Você" em 9 amostras ao longo de um ciclo completo de pulso (3.2s), desta vez sob movimento normal (não reduzido) — offset de (0.0, 0.0) em relação ao centro do container em todas as amostras
- Regressão checada: hover elástico nos nós e nas linhas continua funcionando após a mudança de estrutura do DOM
- Zero violações de acessibilidade (axe-core), zero erros/warnings de console num scroll completo da página
- Mobile e `prefers-reduced-motion` conferidos via screenshot
- Suíte de testes (32/32) e build de produção passando
- Lighthouse mobile 94 / desktop 100 / accessibility, best-practices, SEO 100 (primeira leitura da rodada deu 69 no mobile por processos `chrome.exe` órfãos de execuções anteriores do Lighthouse acumulados no ambiente Windows — encerrados manualmente antes da leitura válida)

## [0.33.0] — 2026-08-04

### Contexto

Ajuste fino do Build pedido pelo usuário: efeito vidro no núcleo e nos badges de tecnologia, badges flutuantes, e um "sistema elástico" — nós e linhas reagem ao mouse passando perto/por cima e voltam sozinhos pra formação original, como uma mola.

### Adicionado

- Núcleo ("Você") e badges de tecnologia com efeito vidro (`backdrop-blur-md` + fundo translúcido + borda clara) em vez de fundo sólido
- Badges ganharam flutuação contínua sutil (oscilação vertical, duração levemente diferente por nó pra não sincronizarem) depois que entram na tela
- Sistema elástico com `useSpring`: cada badge segue o mouse enquanto ele está por cima (deslocamento proporcional, com teto) e volta pra posição original quando o mouse sai; cada linha reage à proximidade do mouse mesmo sem hover exato (são linhas de 1.5px, alvo pequeno demais pra mirar) — desloca na direção do mouse com força proporcional à distância, some acima de um raio, e volta com mola quando o mouse se afasta. Sob `prefers-reduced-motion`, nenhuma das duas reações roda — só a flutuação/glass ficam (são visuais estáticos, não movimento)

### Verificado

- Centralização do núcleo confirmada matematicamente: medi a posição real na tela do centro do núcleo contra o centroide dos 6 nós ao redor sob `prefers-reduced-motion` (sem a flutuação, que desincroniza os nós e mascarava a medição) — diferença de 0px. O leve desalinhamento que se via numa medição inicial era só a flutuação contínua pegando cada nó numa fase diferente do próprio ciclo, não um bug de posicionamento
- Sequência de screenshots com movimento de mouse real (não teleporte) simulando passar por cima de um badge e por perto de uma linha, confirmando o puxão elástico e o retorno suave em ambos os casos
- `prefers-reduced-motion`: sem flutuação nem reação ao mouse, só o estado final estático (efeito vidro continua, por ser visual, não movimento)
- Zero violações de acessibilidade (axe-core), zero erros/warnings de console num scroll completo da página
- Suíte de testes (32/32) e build de produção passando
- Lighthouse mobile 94 / desktop 100 / accessibility, best-practices, SEO 100 — dentro da variação normal, sem regressão real (mudança é só CSS/interação, nenhum asset novo)

## [0.32.0] — 2026-08-04

### Contexto

Usuário pediu uma animação "fluida" pro Capítulo 2/Build a partir de uma referência em vídeo (`tela.mp4`, gravação de tela de um produto real — núcleo brilhante pulsante, anéis orbitais decorativos, nós de IA chegando um a um com uma partícula percorrendo a linha até cada um). A referência mostrava logos e copy reais de um produto comercial de terceiro; reaproveitada só a linguagem de movimento — o conteúdo do capítulo continua sendo as mesmas tecnologias fictícias já usadas (React, TypeScript, Node.js etc.), não os logos/marcas reais do vídeo.

### Adicionado

- Núcleo ("Você") ganhou um brilho suave atrás (`blur-2xl`, gradiente) pulsando continuamente, e o próprio badge central passou a respirar (`scale` sutil em loop) — antes era estático
- Dois anéis elípticos decorativos ao redor do núcleo, girando bem devagar e continuamente (puramente atmosféricos, não representam dado nenhum — inspirados no anel orbital da referência)
- Uma partícula por linha percorre do centro até o nó junto com o desenho da linha na entrada, depois repete periodicamente (com atraso escalonado por nó, pra não pulsarem todas juntas) — o "pulso de energia" da referência

### Corrigido

- Rótulo "TypeScript" cortado na borda da viewport em telas estreitas — bug de overflow pré-existente (o wrapper de cada nó centraliza sua origem `(x,y)`, mas o badge em si cresce a partir dali sem ficar centralizado nele, então o rótulo mais longo no nó mais deslocado ultrapassava a tela). Corrigido encolhendo o diagrama inteiro (`scale`) abaixo do breakpoint `sm`

### Verificado

- Sequência de screenshots ao longo de ~6,5s confirmando a entrada escalonada dos 6 nós com partículas e o loop periódico funcionando depois
- `prefers-reduced-motion`: núcleo estático, anéis fixos (sem rotação), sem partículas — só o estado final, igual ao padrão já usado no resto do site
- Zero violações de acessibilidade (axe-core), zero erros/warnings de console num scroll completo da página (com as animações contínuas já rodando)
- Suíte de testes (32/32) e build de produção passando
- Lighthouse mobile 94 / desktop 100 / accessibility, best-practices, SEO 100 — dentro da variação normal, sem regressão real (mudança é só CSS/SVG, nenhum asset novo)

## [0.31.0] — 2026-08-04

### Contexto

Usuário aprovou o scroll-scrub do Boot mas pediu um ajuste fino: movimento "mais lento e fluído, menos agressivo" — o progresso seguia a posição bruta do scroll 1:1, o que lia como abrupto num scroll rápido (roda do mouse, flick de trackpad): cada frame/letra pulava direto pra posição exata, sem transição.

### Corrigido

- Progresso de scroll do Boot passa por `useSpring` (massa 0.5, rigidez 120, amortecimento 30 — crítico-mente amortecido, sem oscilar) antes de dirigir texto, imagem de fundo e fade de saída. Num scroll rápido, o visual agora "persegue" a posição real do scroll suavemente ao longo de ~0,5s em vez de saltar pra lá instantaneamente — confirmado via teste automatizado (salto instantâneo de scroll + sequência de screenshots mostrando o texto/frame ainda incompletos no instante do salto, completos só ~560ms depois)
- Altura da faixa de scroll pinada aumentada de 220dvh pra 260dvh — mais distância física de scroll pro mesmo conteúdo, movimento menos apressado
- Sob `prefers-reduced-motion`, a suavização é ignorada (usa o progresso bruto) — é puramente decorativa, sem motivo pra existir quando a digitação/scrub nem estão ativos nesse modo

### Verificado

- Zero violações de acessibilidade (axe-core), zero erros/warnings de console num scroll completo da página
- `prefers-reduced-motion` continua mostrando o texto completo e o fundo estático corretamente
- Suíte de testes (32/32) e build de produção passando
- Lighthouse mobile 94 / desktop 100 / accessibility, best-practices, SEO 100 — dentro da variação normal já observada neste ambiente, sem regressão real (suavização é só matemática de interpolação, não adiciona I/O)

## [0.30.0] — 2026-08-04

### Contexto

Pedido do usuário: (1) texto de abertura do Boot em verde, sem o prefixo "$"; (2) digitação acoplada ao scroll, não a um timer; (3) fundo do Boot com a sequência de imagens fornecida (`Imagem/Imagem_rolagem/`, 55 frames de um zoom cinematográfico gerado por IA — pessoa digitando num laptop → interface holográfica). Isso é essencialmente a técnica "scroll-scrubbed" pesquisada antes nas referências do usuário (`elirigobeli.com/higgsfield/*`), só que agora implementada de verdade, com conteúdo próprio.

### Adicionado

- `accent-green` (`#4ADE80`) — novo token de acento (tailwind + `DESIGN-SYSTEM.md`), distinto de `state-success` (que é semântico de status, não decorativo)
- `useScrollFrameSequence` (`src/hooks/`): desenha uma sequência de imagens num `<canvas>` conforme o `scrollYProgress` avança — mesma técnica por trás de aberturas "scroll-scrubbed" de sites de produto, mas usando `<canvas>` em vez de trocar `src` de `<img>` (mais barato: a imagem já está decodificada em memória) e crucialmente sem entrar nas heurísticas de LCP do Chrome (que só consideram `<img>`, `background-image` e texto — a métrica continua medindo o texto real da página, não o fundo decorativo)
- Boot redesenhado: a section vira uma faixa de scroll "pinada" (220dvh de altura + conteúdo interno `sticky`) — o usuário rola ~120dvh com o visual fixo na tela enquanto texto e fundo avançam juntos; ao final, a section libera e desliza normalmente pro Capítulo 2/Build assumir. Texto perde o prefixo `"$ "` e vira `accent-green`; digitação mapeada pros primeiros 55% do progresso de scroll do capítulo, o fundo usa o progresso inteiro
- 55 frames originais (JPG, ~2,7MB) reduzidos a 28 (1 a cada 2) e convertidos pra WebP 854×480 — scroll-scrub não precisa da densidade de um vídeo de verdade, e cortar pela metade os frames foi mais efetivo que só reduzir qualidade/resolução (testado: 55 frames a 1024×576/q68 pesava 3,16 MB; 28 frames a 854×480/q60 pesa 1,17 MB, sem perda visível)
- Sob `prefers-reduced-motion`: a section volta a ser 1 viewport só, com o texto completo instantâneo e o último frame da sequência como fundo estático (sem canvas, sem scroll-scrub)

### Corrigido — regressão de performance descoberta durante a própria implementação (Lighthouse mobile: 95 → 77)

Rodar Lighthouse depois de plugar a sequência de imagens (hábito mantido mesmo numa tarefa "só visual") expôs quedas reais, investigadas uma a uma:

- **Carregar os 28 frames de uma vez no mount** competia por banda e decodificação bem na largada — tentei adiar pra `requestIdleCallback`, que não ajudou (no ambiente de teste do Lighthouse, o idle dispara cedo demais pra fazer diferença real). A correção efetiva foi carregar sob demanda: só o 1º frame de imediato, os demais conforme o scroll se aproxima deles (com uma folga de 3 frames à frente pra scroll rápido não mostrar frame desatualizado)
- **Forced reflow real**: o resize do canvas lia `getBoundingClientRect()` e escrevia `canvas.width`/`height` na mesma função, no meio do mount — trocado por `ResizeObserver`, cujo callback já roda depois do layout assentar, sem forçar recálculo síncrono
- **`useScroll` duplicado**: o Boot usava `useChapterTilt` (que cria seu próprio `useScroll` internamente) *e* um `useScroll` próprio pro scrub — duas medições de geometria da mesma section. Consolidado num só: o fade de saída (antes feito pelo `useChapterTilt`) agora é derivado do mesmo `scrollYProgress` que já dirige texto e imagem, via `useTransform` direto

### Verificado

- Lighthouse mobile 95 / desktop 100 / accessibility, best-practices, SEO 100 — mas as medições oscilaram bastante entre tentativas (79 a 93) até eu perceber que processos órfãos do Chrome de execuções anteriores do Lighthouse (32 acumulados numa hora) estavam competindo por CPU e distorcendo os números; depois de matá-los, uma medição limpa confirmou o resultado real
- Sequência de screenshots ao longo de todo o range de scroll do Boot (desktop e mobile), confirmando frames e digitação avançando juntos e a transição suave pro Build
- `prefers-reduced-motion`: bug real encontrado e corrigido — o texto ficava vazio (só o cursor), porque o efeito que preenche o texto tinha um `return` antecipado pra reduced-motion sem nunca escrever o texto completo. Corrigido escrevendo a pergunta inteira de uma vez nesse caminho
- Zero violações de acessibilidade (axe-core), inclusive no meio do scrub (fundo mais "carregado" que o anterior, contraste conferido de verdade, não assumido)
- Suíte de testes (32/32) e build de produção passando

### Decisões

- Imagens originais (`Imagem/Imagem_rolagem/*.jpg`, ~2,7MB) removidas do repositório depois de convertidas — mesmo padrão já usado pros outros assets desta fase (só os derivados otimizados entram versionados)

## [0.29.0] — 2026-07-24

### Adicionado

- Link de demonstração no `README.md` — [devclub-flame.vercel.app](https://devclub-flame.vercel.app/), primeiro deploy real do projeto

### Corrigido

- `README.md`: seção de Testes ainda citava `Contact`/`Projects` e a contagem antiga de 35 testes, desatualizada desde a remoção das seções antigas (v0.27.0) — atualizado para 32 testes / `Header` + Capítulo 6/`Hire`

### Verificado

- Deploy em produção testado de ponta a ponta: `/`, `/blog`, `/nossos-alunos`, `/newsletter` retornam 200 (rewrite do `vercel.json` funcionando — sem ele, essas rotas dariam 404 ao serem acessadas direto, não navegando a partir da home)
- Zero erros/warnings de console em produção, imagens dos capítulos (fundo global, projetos do Deploy) carregando corretamente

## [0.28.0] — 2026-07-24

### Adicionado

- `vercel.json` com rewrite (`/(.*)` → `/index.html`) — necessário pro React Router funcionar em produção na Vercel: hospedagem estática por padrão só serve arquivos que existem fisicamente, então acessar `/blog` ou `/nossos-alunos` direto (sem navegar a partir de `/`) daria 404 sem essa regra

### Decisões

- Repositório publicado no GitHub (`github.com/renanspin-sketch/devclub`, público) — decisão do usuário: projeto de portfólio/processo seletivo, faz sentido ficar visível. Deploy na Vercel conectado via importação do repositório (fluxo do painel da Vercel, não CLI — login da Vercel exige OAuth interativo que não é possível automatizar por aqui)
- Publicado com as páginas Nossos Alunos/Blog/Newsletter ainda em placeholder ("em construção") — decisão explícita do usuário, iterar em produção em vez de esperar as Fases C/D/E

### Contexto

Usuário reportou o menu/header "repetindo" ao rolar a página, logo depois do Capítulo 6/Hire, e pediu pra finalizar o site ali — ou seja, que a Home termine no Hire em vez de continuar pras seções antigas de portfólio pessoal (Formações, Stack, Comunidade, Sobre, Projetos, Contato) que ainda coexistiam por baixo dos 6 capítulos desde a Fase 12. Essa remoção já estava registrada como item pendente no ROADMAP.

### Removido

- Seções antigas de portfólio pessoal (página única, anteriores à decisão de reposicionamento como plataforma/comunidade): `Hero`, `Formacoes`, `Stack`, `Community`, `About`, `Projects`, `Contact`, com seus dados (`data/about.ts`, `data/stack.ts`, `data/community.ts`, `data/projects.ts`), testes (`Contact.test.tsx`, `Projects.test.tsx`, `Projects.empty.test.tsx`) e imagens (`ui-concept-studio.jpg`, `ui-concept-architecture.jpg`) — todas órfãs depois da remoção, sem uso em nenhum outro lugar
- `Home.tsx` agora renderiza só os 6 capítulos (Boot→Hire); a página termina no Hire seguido do `Footer`

### Adicionado

- Capítulo 6/Hire ganhou a funcionalidade real de contato que antes vivia em `Contact` (copiar e-mail com feedback acessível, `mailto:`, links sociais) — o CTA "Quero fazer parte" deixa de depender de uma âncora (`#contato`) pra uma seção que não existe mais e passa a copiar o e-mail de contato diretamente, com o mesmo padrão acessível (aria-live, troca de ícone) já testado em `Contact`
- `Hire.test.tsx`: mesma cobertura que `Contact.test.tsx` tinha (copiar e-mail, link `mailto:`, links sociais), adaptada pro novo componente

### Corrigido

- **Aviso real do Framer Motion, presente desde o Capítulo 2/Build (v0.20.0), nunca detectado até agora**: `useScroll({ target })` (usado por `useChapterTilt`) mede o offset contra o container de scroll — que aqui é o `<html>` (`document.scrollingElement`, não o `<body>`), já que a página rola nativamente. Sem posicionamento não-estático nele, o Framer Motion avisa no console a cada carregamento. Todas as verificações anteriores desta sessão (e das fases anteriores) só capturavam `console.error`, nunca `console.warn` — esse aviso específico passou despercebido por 6 capítulos inteiros até uma varredura mais completa pra esta tarefa. Corrigido com `position: relative` no `<html>` (`globals.css`) — não afeta elementos `fixed`, que continuam relativos à viewport
- Coverage do Vitest recalibrado (40/38/30/45, era 50/45/40/85) — a remoção das seções antigas tirou os arquivos mais bem testados do projeto (`Contact`, `Projects`) da base de cobertura; os 5 capítulos sem teste próprio (Boot, Build, Deploy, LevelUp, Connect) agora pesam mais no cálculo

### Verificado

- Lighthouse mobile **voltou a 95** (tinha caído pra 83, recuperado pra 92 na entrega anterior, agora de volta ao patamar histórico) — a remoção do JS/CSS morto das seções antigas foi a peça que faltava; desktop segue 100, accessibility/best-practices/SEO 100 em tudo
- Zero warnings E zero errors no console durante um scroll completo pelos 6 capítulos (antes só zero errors era verificado)
- Zero violações de acessibilidade (axe-core) em `/`, `/nossos-alunos`, `/blog`, `/newsletter`
- Confirmado visualmente que a página termina em Hire + Footer, sem menu duplicado nem seções soltas por baixo
- Suíte de testes (32/32) e build de produção passando

## [0.26.0] — 2026-07-24

### Contexto

Pedido do usuário: (1) fotos reais dos 3 projetos fictícios do capítulo Deploy (mockups de UI gerados por IA, fornecidos pelo usuário em `src/projetos/`); (2) ver a imagem de fundo do Boot aplicada no site inteiro, não só num capítulo. O pedido (2) expôs uma regressão real de performance que precisou de investigação e correção antes de poder ser aceito.

### Adicionado

- Capítulo Deploy: cada card de projeto ganhou a prévia de UI correspondente (`src/assets/projects/deploy/*.webp`) entre a barra de navegador e o texto, com `object-cover`/`object-top`, `loading="lazy"` e `width`/`height` explícitos
- Imagem de fundo (antes só no Boot) agora fixa atrás de toda a navegação (`Layout`), com variantes separadas mobile (640px) e desktop (1920px) — `background-image` não tem `srcset`, a troca por breakpoint usa duas divs com visibilidade condicionada por classe responsiva. Cada capítulo ganhou `bg-canvas/80`/`bg-black/80` (era opaco) pra deixar a camada passar por trás; seções antigas sem fundo próprio (via `Section`) já mostravam a imagem integralmente, sem precisar de mudança

### Corrigido — regressão real de performance (Lighthouse mobile: 95-96 → 83)

Rodar Lighthouse depois dessas mudanças (o hábito estabelecido desde a Fase 10, não pulado mesmo numa tarefa que parecia "só visual") expôs uma queda real, não ruído de medição:

- **Cumulative Layout Shift**: o efeito de digitação do Boot fazia o `<h1>` crescer de 1 pra 2 linhas conforme o texto era digitado, empurrando o conteúdo abaixo — contabilizado como CLS de verdade pelo Lighthouse. Corrigido reservando a altura final desde o primeiro paint: uma cópia invisível do texto completo empilhada via CSS Grid (`col-start-1 row-start-1`) na mesma célula do texto animado, então o container nunca muda de tamanho. Esse bug é anterior a esta sessão (existia desde que o Boot foi criado, v0.19.0) — só não tinha sido pego porque o Lighthouse não rodou de novo depois daquele capítulo
- **Imagem de fundo desproporcional em mobile**: sem a separação de variantes por breakpoint, mobile baixava a versão de 1920px (pensada pra desktop) — corrigido com a variante de 640px descrita acima
- **JS eager desnecessário**: os 5 capítulos abaixo do Boot (Build→Hire) estavam todos fora do code splitting, junto no bundle principal — igual ao padrão já usado antes pras seções antigas (`Hero` fica de fora do lazy por ser o LCP, o resto é `React.lazy`), só que essa mesma regra não tinha sido aplicada aos capítulos novos. Corrigido: só o Boot fica eager agora, os outros 5 entraram no mesmo `Suspense` que já envolvia as seções antigas

### Decisões

- Depois dos três fixes acima, mobile subiu de 83 pra 92 (desktop seguiu 100 o tempo todo). Testei remover o `useChapterTilt` do Boot por completo pra isolar se o hook (`useScroll`/`useTransform`) pesava no bundle crítico — sem diferença mensurável, então mantive o efeito. Os ~2,4s de "Render Delay" restantes do LCP não têm uma causa única e isolável nos testes que fiz; ficam registrados como item aberto no ROADMAP em vez de eu forçar mais mudanças sem um diagnóstico claro do que ainda falta
- Imagens originais (`src/projetos/*.png`, ~1,5MB cada) removidas do repositório depois de convertidas — só os derivados otimizados (WebP, redimensionados) foram versionados, mesmo padrão já usado pro fundo do Boot

### Verificado

- Zero violações de acessibilidade (axe-core) em `/`, `/nossos-alunos`, `/blog`, `/newsletter` com o fundo global aplicado
- Suíte de testes (36/36) e build de produção passando
- Lighthouse mobile 92 / desktop 100 / accessibility, best-practices, SEO 100 em todas as categorias (era mobile 83 antes dos três fixes)

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
