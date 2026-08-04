import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";
import { useChapterTilt } from "@/hooks/useChapterTilt";
import financasPreview from "@/assets/projects/deploy/financas.webp";
import habitoPreview from "@/assets/projects/deploy/habito.webp";
import lojaPreview from "@/assets/projects/deploy/loja.webp";

interface DeployProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  image: string;
}

// Dimensões reais das imagens (1536×1024, 3:2) — evita layout shift
// enquanto a imagem carrega.
const IMAGE_WIDTH = 750;
const IMAGE_HEIGHT = 500;

/**
 * Conteúdo fictício, próprio deste capítulo. As imagens são mockups de UI
 * gerados por IA (fornecidos pelo usuário), não capturas de produtos reais.
 */
const PROJECTS: DeployProject[] = [
  {
    slug: "painel-financeiro",
    title: "Painel Financeiro",
    tagline: "Visão consolidada de gastos e metas, em tempo real.",
    description:
      "Dashboard pessoal de finanças com categorização automática de despesas e metas de economia mês a mês.",
    stack: ["React", "TypeScript", "Recharts"],
    image: financasPreview,
  },
  {
    slug: "app-habitos",
    title: "App de Hábitos",
    tagline: "Constância visual: sequências, não só check-lists.",
    description:
      "Aplicativo de acompanhamento de hábitos com streaks visuais e lembretes contextuais, pensado para uso diário.",
    stack: ["React Native", "TypeScript"],
    image: habitoPreview,
  },
  {
    slug: "loja-capsula",
    title: "Loja Cápsula",
    tagline: "Vitrine enxuta pra marcas pequenas, sem excesso.",
    description:
      "E-commerce minimalista para coleções cápsula, com foco em performance de checkout e catálogo pequeno.",
    stack: ["Next.js", "Tailwind CSS"],
    image: lojaPreview,
  },
];

function ProjectWindow({ project }: { project: DeployProject }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-surface shadow-md transition duration-base ease-standard hover:border-border-strong hover:shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-border bg-surface-elevated px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-state-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-state-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-state-success/70" />
        <span className="ml-3 truncate rounded-sm bg-canvas px-2 py-0.5 font-mono text-[11px] text-text-muted">
          devclub.dev/projetos/{project.slug}
        </span>
      </div>

      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={`Prévia da interface do projeto ${project.title}`}
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          loading="lazy"
          className="aspect-[3/2] w-full object-cover object-top transition-transform duration-slower ease-standard group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-accent-gradient opacity-0 transition-opacity duration-base ease-standard group-hover:opacity-10"
        />
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          className="relative block w-full px-6 py-6 text-left"
        >
          <h3 className="font-display text-lg font-semibold text-accent-green">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">{project.tagline}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-cyan">
            {isExpanded ? "Fechar detalhes" : "Ver detalhes"}
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-fast ease-standard ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <path
                d="M5 7.5l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-6 py-5">
              <p className="text-sm text-text-secondary">{project.description}</p>
              <ul
                className="mt-4 flex flex-wrap gap-2"
                aria-label={`Stack de ${project.title}`}
              >
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Badge>{tech}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Capítulo 3 — Deploy. Projetos como "janelas vivas" (mockup de barra de
 * navegador) em vez de cards estáticos: hover realça a janela, clique
 * expande descrição + stack numa transição de altura.
 */
export function Deploy() {
  const { ref, style } = useChapterTilt<HTMLElement>();

  return (
    <section
      ref={ref}
      id="deploy"
      aria-label="Capítulo 3: Deploy"
      className="relative min-h-[100dvh] bg-canvas/80 py-24"
    >
      <m.div style={style}>
        <Container>
          <Reveal delay={0.1}>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-accent-green md:text-4xl">
              Não é exercício de sala de aula. É projeto no ar.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-md text-text-secondary">
              Cada trilha termina em algo real, publicado — não numa pasta de exercícios
              esquecida.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PROJECTS.map((project, index) => (
              <Reveal key={project.slug} delay={0.25 + index * 0.05} className="h-full">
                <ProjectWindow project={project} />
              </Reveal>
            ))}
          </div>
        </Container>
      </m.div>
    </section>
  );
}
