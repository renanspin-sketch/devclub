export interface LearningTrack {
  slug: string;
  title: string;
  description: string;
}

/**
 * Conteúdo fictício — placeholder claramente substituível pelas trilhas
 * reais antes da Fase 13 (Deploy Final). Ver ROADMAP.md.
 */
export const learningTracks: LearningTrack[] = [
  {
    slug: "frontend",
    title: "Front-end",
    description: "React, TypeScript e as bases de HTML/CSS/JS que sustentam tudo.",
  },
  {
    slug: "backend",
    title: "Back-end",
    description: "Node.js, APIs REST e os fundamentos de arquitetura de servidor.",
  },
  {
    slug: "fullstack",
    title: "Full Stack",
    description: "Front-end e back-end integrados, do banco de dados à interface.",
  },
  {
    slug: "mobile",
    title: "Mobile",
    description: "React Native para levar suas telas pra dentro do bolso do usuário.",
  },
  {
    slug: "uiux",
    title: "UI/UX Design",
    description: "Prototipação, sistemas de design e a ponte entre design e código.",
  },
  {
    slug: "ia-devs",
    title: "IA para Devs",
    description: "Ferramentas de IA aplicadas ao dia a dia de quem programa.",
  },
];
