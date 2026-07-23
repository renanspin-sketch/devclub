export interface SkillCategory {
  title: string;
  skills: string[];
}

/**
 * Conteúdo fictício — placeholder claramente substituível pelas skills
 * reais antes da Fase 12 (Deploy Final). Ver ROADMAP.md.
 */
export const skillCategories: SkillCategory[] = [
  {
    title: "Linguagens",
    skills: ["JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    title: "Frameworks & Bibliotecas",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Ferramentas",
    skills: ["Git", "Vite", "Figma", "ESLint"],
  },
];
