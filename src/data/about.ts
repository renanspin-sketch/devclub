export interface AboutStat {
  label: string;
  value: string;
}

export interface AboutCodeLine {
  key: string;
  value: string;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  stats: AboutStat[];
  codeSnippet: AboutCodeLine[];
}

/**
 * Conteúdo fictício — placeholder claramente substituível pelo texto real
 * antes da Fase 13 (Deploy Final). Ver ROADMAP.md.
 */
export const aboutContent: AboutContent = {
  eyebrow: "Quem constrói",
  heading: "Sobre",
  paragraphs: [
    "Comecei a programar por curiosidade e continuei por gostar do processo: transformar uma ideia solta em algo que roda no navegador de alguém, com boa performance e sem gambiarra.",
    "Hoje meu foco é front-end — interfaces que parecem simples por fora, mas escondem decisões cuidadosas de arquitetura, acessibilidade e performance por trás.",
  ],
  stats: [
    { label: "Anos de experiência", value: "3+" },
    { label: "Projetos entregues", value: "20+" },
    { label: "Stack principal", value: "React · TS" },
  ],
  codeSnippet: [
    { key: "role", value: '"Front-end Developer"' },
    { key: "stack", value: '["React", "TypeScript", "Tailwind"]' },
    { key: "focus", value: '"performance & acessibilidade"' },
    { key: "status", value: '"open to work"' },
  ],
};
