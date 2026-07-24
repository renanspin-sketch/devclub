export interface StackCategory {
  title: string;
  items: string[];
}

/**
 * Conteúdo fictício — placeholder claramente substituível pela stack real
 * ensinada antes da Fase 13 (Deploy Final). Ver ROADMAP.md.
 */
export const stackCategories: StackCategory[] = [
  {
    title: "Linguagens",
    items: ["JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    title: "Frameworks & Bibliotecas",
    items: ["React", "Next.js", "Node.js", "React Native", "Tailwind CSS"],
  },
  {
    title: "Ferramentas & IA",
    items: ["Git", "Vite", "Figma", "GitHub Copilot", "ChatGPT", "Claude"],
  },
];
