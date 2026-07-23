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

- [ ] Componentes primitivos (`Button`, `Card`, `Badge`, `Input`, `IconButton`)
- [ ] Componentes de layout (`Container`, `Section`, `Header`, `Footer`)
- [ ] Todos os estados documentados no `DESIGN-SYSTEM.md` implementados (hover/focus/active/disabled)
- [ ] Storybook ou página de preview isolada dos componentes _(avaliar necessidade)_

## Fase 03 — Seção Hero

- [ ] Composição da headline com `accent-gradient`
- [ ] CTA primário e secundário
- [ ] Micro-interação de entrada (scroll reveal / entrance)
- [ ] Responsivo mobile-first

## Fase 04 — Seção Sobre

- [ ] Narrativa curta de posicionamento profissional
- [ ] Hierarquia visual clara entre texto e destaque visual

## Fase 05 — Seção Projetos

- [ ] Modelo de dados tipado em `src/data` (placeholder, ver `ARCHITECTURE.md`)
- [ ] Card de projeto reutilizando o design system
- [ ] Estado vazio e estado de carregamento (se dados vierem assíncronos no futuro)

## Fase 06 — Seção Skills

- [ ] Agrupamento por categoria (linguagens, frameworks, ferramentas)
- [ ] Representação visual sem depender de ícones de terceiros não otimizados

## Fase 07 — Seção Contato

- [ ] Links diretos (e-mail, GitHub, LinkedIn)
- [ ] Feedback visual de cópia/envio quando aplicável

## Fase 08 — Motion & Scroll Reveal

- [ ] Scroll reveal aplicado de forma consistente entre seções
- [ ] Parallax pontual no Hero
- [ ] Respeito a `prefers-reduced-motion` validado em todos os componentes de motion

## Fase 09 — Acessibilidade

- [ ] Auditoria de contraste (WCAG AA) em todos os pares texto/fundo
- [ ] Navegação completa por teclado (tab order, focus trap onde aplicável)
- [ ] `aria-label`/landmarks revisados
- [ ] Teste com leitor de tela (NVDA ou VoiceOver)

## Fase 10 — Performance

- [ ] Lighthouse ≥ 95 em todas as categorias
- [ ] Code splitting por seção
- [ ] Otimização de imagens (formatos modernos, dimensões explícitas)
- [ ] Análise de bundle size

## Fase 11 — Testes

- [ ] Testes unitários dos componentes do design system
- [ ] Testes de integração das seções críticas
- [ ] Definir cobertura mínima aceitável

## Fase 12 — Deploy Final

- [ ] Escolha de plataforma (Vercel/Netlify)
- [ ] Domínio e SEO final (meta tags, Open Graph, sitemap)
- [ ] Link de demonstração adicionado ao `README.md`
