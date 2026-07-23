# DevClub

Portfólio front-end premium, construído para demonstrar domínio técnico em engenharia de software durante um processo seletivo para a vaga de Desenvolvedor Front-end.

> Status: em desenvolvimento incremental. Este README acompanha o projeto desde a fase de documentação e será atualizado a cada fase concluída — ver [ROADMAP.md](./ROADMAP.md).

## Objetivo

Não é "apenas um site". É um produto digital que precisa comunicar, em poucos minutos de navegação, os mesmos padrões que uma banca técnica avalia em código: arquitetura limpa, componentização consciente, performance real (não apenas percebida), acessibilidade nativa e consistência visual de ponta a ponta.

Cada decisão registrada aqui — e nos demais documentos do projeto — existe para ser defendida em entrevista.

## Demonstração

🔗 _(link do deploy será adicionado na Fase 12 — Deploy Final. Ver [ROADMAP.md](./ROADMAP.md))_

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

## Estrutura de pastas

Documentada em detalhe em [ARCHITECTURE.md](./ARCHITECTURE.md#organização-de-pastas).

## Arquitetura

Decisões estruturais, estratégias de componentização, hooks, performance e acessibilidade: [ARCHITECTURE.md](./ARCHITECTURE.md).

## Performance

Meta: Lighthouse ≥ 95 em todas as categorias, com lazy loading, code splitting por rota/seção e assets otimizados. Estratégias detalhadas em [ARCHITECTURE.md](./ARCHITECTURE.md#estratégias-de-performance).

## Responsividade

Abordagem mobile-first, com breakpoints definidos no [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md#grid).

## Acessibilidade

HTML semântico, navegação completa por teclado, contraste validado (WCAG AA) e suporte a leitores de tela desde a primeira versão de cada componente — não como revisão final.

## Deploy

_(A definir na Fase 12. Candidatos avaliados: Vercel e Netlify — ver [ROADMAP.md](./ROADMAP.md).)_

## Melhorias futuras

Ver [ROADMAP.md](./ROADMAP.md) para o plano de fases e [CHANGELOG.md](./CHANGELOG.md) para o histórico de versões.

## Licença

Este projeto está sob a licença MIT.
