export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
}

/**
 * Conteúdo fictício — placeholder claramente substituível pelos projetos
 * reais antes da Fase 12 (Deploy Final). Ver ROADMAP.md.
 */
export const projects: Project[] = [
  {
    slug: "metrics-dashboard",
    title: "Dashboard de Métricas",
    description:
      "Painel de analytics em tempo real para times de produto acompanharem funil de conversão e retenção.",
    stack: ["React", "TypeScript", "Recharts"],
    repoUrl: "#",
    demoUrl: "#",
  },
  {
    slug: "task-manager",
    title: "Gestão de Tarefas",
    description:
      "Aplicativo de produtividade com quadros kanban, atalhos de teclado e sincronização offline-first.",
    stack: ["React", "TypeScript", "Zustand"],
    repoUrl: "#",
  },
  {
    slug: "headless-storefront",
    title: "Loja Headless",
    description:
      "Vitrine de e-commerce desacoplada, consumindo uma API headless com foco em performance de checkout.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    repoUrl: "#",
    demoUrl: "#",
  },
];
