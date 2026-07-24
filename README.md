# DevClub

Portfólio front-end premium, construído para demonstrar domínio técnico em engenharia de software durante um processo seletivo para a vaga de Desenvolvedor Front-end.

> Status: em desenvolvimento incremental. Este README acompanha o projeto desde a fase de documentação e será atualizado a cada fase concluída — ver [ROADMAP.md](./ROADMAP.md).

## Objetivo

Não é "apenas um site". É um produto digital que precisa comunicar, em poucos minutos de navegação, os mesmos padrões que uma banca técnica avalia em código: arquitetura limpa, componentização consciente, performance real (não apenas percebida), acessibilidade nativa e consistência visual de ponta a ponta.

Cada decisão registrada aqui — e nos demais documentos do projeto — existe para ser defendida em entrevista.

## Demonstração

🔗 _(link do deploy será adicionado na Fase 13 — Deploy Final. Ver [ROADMAP.md](./ROADMAP.md))_

## Tecnologias

| Camada | Escolha | Justificativa resumida |
|---|---|---|
| Build tool | [Vite](https://vitejs.dev) | Dev server instantâneo (HMR nativo via ESM), build de produção otimizado com Rollup |
| Biblioteca UI | [React 18](https://react.dev) | Ecossistema maduro, Concurrent Rendering, padrão de mercado para a vaga-alvo |
| Linguagem | [TypeScript](https://www.typescriptlang.org) | Tipagem estática end-to-end, contratos explícitos entre componentes |
| Estilos | [Tailwind CSS](https://tailwindcss.com) | Design tokens como fonte única de verdade, zero CSS morto em produção (JIT) |
| Animação | [Framer Motion](https://www.framer.com/motion) | API declarativa para orquestrar motion com propósito narrativo, sem sacrificar acessibilidade (`prefers-reduced-motion`) |

Justificativas completas em [ARCHITECTURE.md](./ARCHITECTURE.md).

## Como executar

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento
npm run dev

# build de produção
npm run build

# pré-visualizar o build de produção
npm run preview
```

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `dev` | Inicia o servidor de desenvolvimento com HMR |
| `build` | Gera o build de produção tipado e otimizado |
| `preview` | Serve o build de produção localmente |
| `lint` | Executa o ESLint sobre todo o projeto |
| `typecheck` | Valida os tipos sem emitir arquivos |
| `build:analyze` | Gera o build com relatório visual do bundle (`dist/stats.html`) |
| `lighthouse` | Builda produção e roda Lighthouse (mobile + desktop) contra ela |
| `test` | Roda a suíte de testes uma vez |
| `test:watch` | Roda a suíte em modo watch |
| `test:coverage` | Roda a suíte com relatório de cobertura |

## Estrutura de pastas

Documentada em detalhe em [ARCHITECTURE.md](./ARCHITECTURE.md#organização-de-pastas).

## Arquitetura

Decisões estruturais, estratégias de componentização, hooks, performance e acessibilidade: [ARCHITECTURE.md](./ARCHITECTURE.md).

## Performance

Lighthouse (build de produção, mobile + desktop): **mobile 95-96 · desktop 100 · accessibility 100 · best-practices 100 · SEO 100**. Reproduza com `npm run lighthouse`. Estratégias (code splitting por seção, `LazyMotion`, subsetting de fontes) detalhadas em [ARCHITECTURE.md](./ARCHITECTURE.md#estratégias-de-performance).

## Testes

Vitest + React Testing Library. 35 testes cobrindo o design system (100% dos componentes de UI) e as seções com lógica de verdade (`Header`, `Contact`, `Projects`) — escopo e justificativa em [ARCHITECTURE.md](./ARCHITECTURE.md#estratégias-de-testes). Rode com `npm run test` ou `npm run test:coverage`.

## Responsividade

Abordagem mobile-first, com breakpoints definidos no [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md#grid).

## Acessibilidade

HTML semântico, navegação completa por teclado, contraste validado (WCAG AA) e suporte a leitores de tela desde a primeira versão de cada componente — não como revisão final.

## Deploy

_(A definir na Fase 13. Candidatos avaliados: Vercel e Netlify — ver [ROADMAP.md](./ROADMAP.md).)_

## Melhorias futuras

Ver [ROADMAP.md](./ROADMAP.md) para o plano de fases e [CHANGELOG.md](./CHANGELOG.md) para o histórico de versões.

## Licença

Este projeto está sob a licença MIT.
