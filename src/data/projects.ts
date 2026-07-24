import uiConceptStudioImg from "@/assets/projects/ui-concept-studio.jpg";
import uiConceptArchitectureImg from "@/assets/projects/ui-concept-architecture.jpg";

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  image?: ProjectImage;
}

/**
 * Conteúdo fictício — placeholder claramente substituível pelos projetos
 * reais antes da Fase 13 (Deploy Final). Ver ROADMAP.md.
 *
 * As duas entradas com `image` são referências visuais de UI (exploração
 * de design, sem código associado) — por isso não têm `repoUrl`/`demoUrl`
 * nem stack de tecnologia de implementação. A ausência desses campos é
 * intencional: comunica que não é software construído e implantado por
 * mim, apenas uma peça de design.
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
  {
    slug: "ui-concept-studio",
    title: "Landing Page — Estúdio Criativo",
    description:
      "Referência visual de UI para a página inicial de um estúdio de design, com tipografia expressiva e hierarquia forte entre imagem e texto.",
    stack: ["UI Design", "Figma"],
    image: {
      src: uiConceptStudioImg,
      alt: "Referência visual de landing page escura para um estúdio de design digital, com foto retrato e métricas de destaque.",
      width: 736,
      height: 1324,
    },
  },
  {
    slug: "ui-concept-architecture",
    title: "Landing Page — Arquitetura & Construção",
    description:
      "Referência visual de UI para uma landing page institucional, com foco em fotografia de destaque e prova social.",
    stack: ["UI Design", "Figma"],
    image: {
      src: uiConceptArchitectureImg,
      alt: "Referência visual de landing page para um escritório de arquitetura, com foto de fachada residencial iluminada à noite.",
      width: 736,
      height: 1307,
    },
  },
];
